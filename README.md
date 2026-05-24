# VedaAI — AI Assessment Creator

A full-stack web application that lets a teacher describe an assessment in
natural language, dispatches a background job to an LLM, parses the response
into a strictly-typed schema, and renders the result as a real
exam-paper-style page in the browser.

The job pipeline is asynchronous end-to-end: the HTTP request returns
immediately with a job id; the worker generates the paper out-of-band; the
client is notified over a WebSocket the moment it is ready.

---

## Architecture

```
       ┌─────────────────┐                                ┌──────────────────┐
Browser│  apps/web       │  REST + WebSocket (Socket.IO)  │  apps/api        │
       │  Next.js 15     │ ─────────────────────────────► │  Express 4       │
       │  Zustand, RHF   │ ◄───────── job:* events ────── │  Socket.IO 4     │
       └─────────────────┘                                └────────┬─────────┘
                                                                   │ enqueue
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │  Redis (BullMQ)  │
                                                          └────────┬─────────┘
                                                                   │ consume
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │  apps/worker     │
                                                          │  BullMQ + LLM    │
                                                          └────────┬─────────┘
                                                                   │ persist
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │  MongoDB         │
                                                          └──────────────────┘
```

Three independent Node processes share a single Mongo + Redis backplane and
a single shared-types package. Each process is deployed as its own service.

### Request lifecycle

1. The browser POSTs the form to `apps/api`. The API validates the body with
   a Zod schema and persists a `pending` Assignment in Mongo.
2. The API enqueues a `generate` job on a BullMQ queue keyed on the
   assignment id.
3. `apps/worker` picks up the job, builds a structured prompt, calls Gemini
   with a JSON response schema, parses the result against the **same** Zod
   schema the form was validated with, and updates the Mongo doc to `done`.
4. The worker publishes a `job-events` message on Redis. The API listens on
   that channel and re-broadcasts it as a Socket.IO event into the
   `job:<id>` room.
5. The browser, joined to that room since submission, navigates to the
   output page when `job:done` arrives. If the WebSocket reconnects mid-job,
   the client re-fetches the assignment by id and the UI reconciles.

### Why a queue, not a synchronous call

LLM round-trips run multiple seconds and occasionally fail. Holding an HTTP
connection open across that window is brittle. The queue lets the API
respond in <100ms, makes retries explicit, and keeps the LLM call off the
critical path of the request thread.

### Why the same Zod schema on both sides

The schema in `@veda/shared-types` is the contract between the LLM and the
UI. Reusing it as the API's input validator and the worker's output parser
means a single source of truth — there is no shape of data that the UI can
render but the API cannot store, or vice versa.

---

## Repository layout

```
veda-ai/
├── apps/
│   ├── web/          Next.js 15, App Router, Tailwind, Zustand, RHF + Zod
│   ├── api/          Express 4, Socket.IO 4, Mongoose, BullMQ producer
│   └── worker/       BullMQ consumer, Gemini SDK, Zod parser
├── packages/
│   └── shared-types/ Zod schemas + TS types, imported by all three apps
├── package.json      Workspace scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── .env.example      Every env var the codebase reads
```

The shared package is TypeScript-only (no build step) and is consumed via
the `workspace:*` protocol. There is no Turborepo — three small apps did
not justify the configuration overhead.

---

## Local development

**Prerequisites:** Node ≥ 20, pnpm ≥ 9, MongoDB, Redis, a Gemini API key
from <https://aistudio.google.com>.

```bash
pnpm install

cp .env.example .env
# fill in GEMINI_API_KEY

# Optional: spin up local Mongo + Redis via Docker
docker run -d -p 27017:27017 --name veda-mongo mongo:7
docker run -d -p 6379:6379  --name veda-redis redis:7

pnpm dev
#   web    → http://localhost:3000
#   api    → http://localhost:4000   (GET /health)
#   worker → console log heartbeat
```

Per-app scripts:

```bash
pnpm dev:web
pnpm dev:api
pnpm dev:worker
pnpm typecheck    # all workspaces
pnpm build        # next build for web; api/worker run via tsx
```

---

## Tech stack

| Layer       | Choice                                    | Rationale                                                                       |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| Monorepo    | pnpm workspaces                           | Three small apps + one shared package. No Turborepo overhead.                   |
| FE state    | Zustand                                   | Single small store; lighter than Redux Toolkit for this scope.                  |
| FE forms    | React Hook Form + Zod                     | Same Zod schema used to parse the LLM response on the server.                   |
| FE styling  | Tailwind 3 (arbitrary values where needed)| Hit exact pixel values without inflating the spacing scale.                     |
| Realtime    | Socket.IO 4                               | Room-based broadcast keyed by job id; transparent WebSocket upgrades.           |
| API runtime | Express 4 on `tsx`                        | Single dependency for TS, no separate build step.                               |
| ODM         | Mongoose 8                                | Typed schemas; good fit for the small, denormalized assignment shape.           |
| Job queue   | BullMQ 5 on Redis                         | Mature, simple, retry/backoff included.                                         |
| LLM         | Gemini 2.5 Flash Lite via `@google/genai` | Native structured-output mode via `responseSchema`; generous free tier.         |
| PDF export  | `@react-pdf/renderer`                     | No headless browser dependency; same renderer in dev and production.            |

---

## Deployment

The three apps deploy as independent services. The reference deployment
runs on Railway (web, api, worker, plus Mongo and Redis plugins inside the
same project). Public networking is enabled on `web` and `api`; the worker
stays private.

Per-service start commands (when the build context is the repo root):

| Service | Start command                                                                          |
| ------- | -------------------------------------------------------------------------------------- |
| web     | `pnpm install --frozen-lockfile && pnpm --filter web build && pnpm --filter web start` |
| api     | `pnpm install --frozen-lockfile && pnpm --filter api start`                            |
| worker  | `pnpm install --frozen-lockfile && pnpm --filter worker start`                         |

Environment variables — see [`.env.example`](.env.example) for the full
list. On Railway, use the `${{ Service.VARIABLE }}` reference syntax so
internal URLs (Mongo, Redis, the API's public domain) resolve at deploy
time rather than being pasted as literals.

---

## Validation contract

The form fields, the API's input parser, and the LLM's output parser are
all defined by the same Zod schemas in `@veda/shared-types`. The API
rejects malformed input before enqueueing. The worker rejects malformed
LLM output before persisting — on a parse failure the job is retried once
with a stricter prompt and, if it fails again, the assignment is marked
`failed` and the failure is broadcast to the room.

No raw LLM string is ever rendered.

---

## Known limitations

- `apps/api` and `apps/worker` run via `tsx` in production. Acceptable for
  this scope; a `tsc` build would shave a few hundred milliseconds off
  cold boot.
- One LLM provider wired. Swapping to a different provider only requires
  re-implementing `apps/worker/src/llm/`.
- No structured logger yet — operational logging goes through `console.*`
  with `[service]` prefixes.
