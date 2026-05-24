# VedaAI — AI Assessment Creator

Round-2 full-stack assignment for VedaAI. A teacher fills a form, an LLM
job pipeline generates a structured question paper, and the frontend
renders it as a real-exam-paper page.

> **For agents reading this repo:** start at [`CLAUDE.md`](CLAUDE.md) and
> follow the mandatory reading order it defines. This README is for
> humans.

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
                                                          │  (Gemini 2.0)    │
                                                          └────────┬─────────┘
                                                                   │ persist
                                                                   ▼
                                                          ┌──────────────────┐
                                                          │  MongoDB         │
                                                          │  (assignments)   │
                                                          └──────────────────┘
```

**Hard rule:** the worker parses the LLM string into the Zod schema in
`@veda/shared-types` *before* persisting. The frontend never sees raw
LLM output.

---

## Repo layout — pnpm workspaces

```
veda-ai/
├── apps/
│   ├── web/          Next.js 15 + TS + Tailwind  (public Railway service)
│   ├── api/          Express 4 + Socket.IO 4     (public Railway service)
│   └── worker/       BullMQ consumer + LLM       (private Railway service)
├── packages/
│   └── shared-types/  @veda/shared-types — Zod schemas shared by all 3 apps
├── doc/              Spec, design extract, execution plan (read CLAUDE.md first)
├── package.json      Root workspace + scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example      Master list of every env var
└── .gitignore
```

Each app deploys as its own Railway service. The shared package is
TS-only (no build step) — imported directly via the `workspace:*`
protocol.

---

## Local setup

**Prereqs:** Node ≥ 20, pnpm ≥ 9, Docker (optional, for local Mongo +
Redis), a Gemini API key from <https://aistudio.google.com>.

```bash
# 1. Install deps across all workspaces
pnpm install

# 2. Copy env vars and fill in your Gemini key
cp .env.example .env
#  → set GEMINI_API_KEY

# 3. (Optional) spin up local Mongo + Redis
docker run -d -p 27017:27017 --name veda-mongo mongo:7
docker run -d -p 6379:6379  --name veda-redis redis:7

# 4. Run all three apps in parallel
pnpm dev
#   web    → http://localhost:3000
#   api    → http://localhost:4000   (try /health)
#   worker → console heartbeat
```

Per-app scripts:

```bash
pnpm dev:web      # apps/web only
pnpm dev:api      # apps/api only
pnpm dev:worker   # apps/worker only
pnpm typecheck    # all workspaces
pnpm build        # all workspaces (Next.js builds; api/worker run via tsx)
```

---

## Deployment — Railway single-platform

All five services live in **one** Railway project, free during the $5
trial credit window. LLM (Gemini 2.0 Flash) is free via Google AI Studio.

### One-time setup

1. Sign in to <https://railway.com> with GitHub.
2. **New Project → Deploy from GitHub repo** → pick this repo.
3. Add five services into the same project:

   | Service       | How                                       | Root dir        | Start command                                |
   | ------------- | ----------------------------------------- | --------------- | -------------------------------------------- |
   | `web`         | New → GitHub Repo (this repo)             | `/`             | `pnpm install --frozen-lockfile && pnpm --filter web build && pnpm --filter web start` |
   | `api`         | New → GitHub Repo (this repo)             | `/`             | `pnpm install --frozen-lockfile && pnpm --filter api start` |
   | `worker`      | New → GitHub Repo (this repo)             | `/`             | `pnpm install --frozen-lockfile && pnpm --filter worker start` |
   | MongoDB       | New → Database → MongoDB (1-click plugin) | —               | —                                            |
   | Redis         | New → Database → Redis (1-click plugin)   | —               | —                                            |

   > Each app service uses the **repo root** as its root dir so the pnpm
   > workspace resolves `@veda/shared-types` from `packages/`. The build
   > step is in the Start Command because the workspace install needs
   > the full repo. Set this under each service's Settings → Deploy.

4. **Public networking:** open Settings → Networking on `web` and `api`
   only → **Generate Domain**. Leave `worker` private.

5. **Environment variables** — set per service via the Variables tab.
   Use Railway's `${{ Service.VARIABLE }}` reference syntax:

   **apps/web**
   ```
   NEXT_PUBLIC_API_URL = https://${{ api.RAILWAY_PUBLIC_DOMAIN }}
   NEXT_PUBLIC_WS_URL  = https://${{ api.RAILWAY_PUBLIC_DOMAIN }}
   NODE_ENV            = production
   ```

   **apps/api**
   ```
   PORT           = ${{ PORT }}                  # Railway injects automatically
   NODE_ENV       = production
   MONGODB_URI    = ${{ MongoDB.MONGO_URL }}
   REDIS_URL      = ${{ Redis.REDIS_URL }}
   CORS_ORIGINS   = https://${{ web.RAILWAY_PUBLIC_DOMAIN }}
   GEMINI_API_KEY = <paste from Google AI Studio>
   GEMINI_MODEL   = gemini-2.0-flash
   ```

   **apps/worker**
   ```
   NODE_ENV       = production
   MONGODB_URI    = ${{ MongoDB.MONGO_URL }}
   REDIS_URL      = ${{ Redis.REDIS_URL }}
   GEMINI_API_KEY = <same as api>
   GEMINI_MODEL   = gemini-2.0-flash
   ```

6. **Acceptance:** open the `api` public URL + `/health` — should return
   `{"status":"ok","service":"api",...}`. Open the `web` public URL —
   the Phase-0 placeholder page renders.

### Keep `web` warm — UptimeRobot

Railway sleeps services after 10 min of no outbound traffic. `api` and
`worker` poll Redis (BullMQ) so they stay warm naturally; `web` does
not. Set up a free monitor:

1. Sign in to <https://uptimerobot.com>.
2. **+ New monitor → HTTP(s)**.
3. URL = your Railway `web` public domain. Interval = 5 minutes.
4. Save.

That's it. Total monthly cost while the project is active: **$0**.

---

## Environment variables — master list

See [`.env.example`](.env.example). Every variable the codebase reads is
listed there with the right default for local dev plus a comment block
showing the Railway production value.

---

## Tech stack rationale

| Layer    | Choice                                  | Why                                                                                                |
| -------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Monorepo | pnpm workspaces (no Turborepo)          | Three small apps + one shared package. Turborepo overhead is unwarranted for 24h scope.            |
| FE state | Zustand                                 | Faster to wire than Redux Toolkit; sufficient for this scope. Spec allows either.                  |
| Styling  | Tailwind 3 with arbitrary values        | Lets us hit pixel-perfect values (e.g. `p-[24px]`) without bloating the spacing scale.             |
| Forms    | React Hook Form + Zod                   | Type-safe validation; same Zod schema used on server for LLM parsing.                              |
| WS       | Socket.IO 4                             | Room-based broadcast (`job:<id>`), Railway proxies WebSocket upgrades natively.                    |
| LLM      | Google Gemini 2.0 Flash via @google/genai | Free 1500 req/day; native JSON mode via `responseSchema`. No paid API needed.                    |
| Runtime  | `tsx` for api + worker (no tsc build)   | Skips the TS → JS build step. Fast cold boot, single dependency. Next.js handles its own build.    |
| Hosting  | Railway single-platform                 | One dashboard for web + api + worker + Mongo + Redis. $5 trial credit covers build + evaluation.   |

---

## Project status

- [x] **Phase 0** — Scaffold + deploy pipeline
- [ ] Phase 1 — Backend skeleton (Mongoose, BullMQ producer, Socket.IO, routes)
- [ ] Phase 2 — Worker + Gemini LLM pipeline + Zod parser
- [ ] Phase 3 — Frontend shell (tokens, fonts, sidebar, top bars)
- [ ] Phase 4 — Four screens, pixel-perfect Figma replication
- [ ] Phase 5 — Form ↔ API ↔ WS ↔ output page integration
- [ ] Phase 6 — Polish, states, difficulty badges
- [ ] Phase 7 — Bonus (PDF export, regenerate)
- [ ] Phase 8 — Final QA + submit

See [`doc/EXECUTION_PLAN.md`](doc/EXECUTION_PLAN.md) for the full
24-hour plan, per-phase acceptance checkpoints, and the bottleneck
register.

---

## Known limitations

- Phase 0 ships an empty placeholder UI. Real screens land in Phase 3/4.
- `apps/api` and `apps/worker` run via `tsx` in production. Fine for
  the assignment scope; for higher throughput, switch to a `tsc` build.
- One LLM provider wired (Gemini). Fallback to Groq + Llama is
  documented in `doc/EXECUTION_PLAN.md` §0 but not implemented unless
  Gemini's free quota becomes a problem.
