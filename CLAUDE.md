# Project type: web

> **VedaAI — Full Stack Engineering Assignment (Round 2).**
> This file is the binding rulebook for any AI coding agent (Claude Code, Cursor,
> Codex, etc.) working in this repo. The full context lives in
> [`doc/Assignment_Master.md`](doc/Assignment_Master.md). Read it first, every
> session.

---

## 0. Mandatory reading order (every new session)

Read these **in order**, in full, before writing any code:

1. [`doc/Assignment_Master.md`](doc/Assignment_Master.md) — the brief (what to build, evaluation criteria, deliverables).
2. [`doc/EXECUTION_PLAN.md`](doc/EXECUTION_PLAN.md) — phased 24-hour plan with locked-in library choices, bottleneck register, and per-phase acceptance checkpoints. **Read this before scaffolding anything.**
3. [`doc/DESIGN_SPECS.md`](doc/DESIGN_SPECS.md) — pixel-perfect design specification for all 8 screens (4 screens × Desktop/Mobile). Extracted from Figma. **Every measurement is exact — do not round, do not guess.**
4. [`doc/DESIGN_MEASUREMENTS.md`](doc/DESIGN_MEASUREMENTS.md) — auto-generated 1350-line companion to the spec; lists every element's size, margin to each parent edge, and gap to its adjacent sibling. **Use this to verify any specific pixel distance.**

You **do not need to open the Figma file** for routine implementation —
DESIGN_SPECS + DESIGN_MEASUREMENTS contain every value extracted from it. Only
open Figma if a value is genuinely missing from those two docs (then flag it
to the user before guessing).

If anything in this file contradicts `doc/Assignment_Master.md`, the master
document wins. If `DESIGN_SPECS.md` contradicts the Figma, the **Figma wins**
— re-extract via `doc/.figma-raw/measure.py`. Never silently resolve a
contradiction — flag it to the user.

**Deadline: 24 hours from start.** Pace accordingly.

---

## 1. The product (one-line)

An **AI Assessment Creator** that lets a teacher create an assignment, generates
a structured question paper via an LLM job pipeline, and renders it as a
real-exam-paper-style output page.

## 2. Canonical links

- **Figma (original design source):**
  https://www.figma.com/design/WCiWHU75IKI31oRY18aqdm/VedaAI?node-id=0-1&t=EwMmg9V31ffDp4i2-1
  File key: `WCiWHU75IKI31oRY18aqdm`
- **Extracted design spec (read this, not Figma):**
  [`doc/DESIGN_SPECS.md`](doc/DESIGN_SPECS.md)
- **Measured distances appendix:**
  [`doc/DESIGN_MEASUREMENTS.md`](doc/DESIGN_MEASUREMENTS.md)
- **Raw Figma JSON cache + parser scripts:** `doc/.figma-raw/` (regenerate the
  spec via `python doc/.figma-raw/measure.py` after refreshing
  `nodes-all8.json`).

### The 8 frames covered

| Screen | Desktop node | Mobile node |
|---|---|---|
| 0-State (empty assignments) | `43:9707` | `43:9862` |
| Filled State (assignment grid) | `43:9429` | `43:10200` |
| Upload Material – Selector (creation form) | `43:9259` | `43:9947` |
| Assignment Output (question paper) | `43:9771` | `43:10103` |

---

## 3. Fixed tech stack — NOT NEGOTIABLE

| Layer | Choice |
|---|---|
| Frontend | **Next.js + TypeScript** |
| State | **Redux OR Zustand** (pick one; stay consistent) |
| Realtime | **WebSocket** (client + server) |
| Backend | **Node.js + Express + TypeScript** |
| DB | **MongoDB** |
| Cache / job state | **Redis** |
| Job queue | **BullMQ** |
| LLM | Any (GPT / Claude / OSS) — but **prompt structuring + response parsing required** |

Do not swap any of the above without explicit user approval.

---

## 4. Hard rules (will fail evaluation if violated)

1. **Do NOT render the raw LLM response.** Parse into structured
   `{ sections: [{ title, instruction, questions: [{ text, difficulty, marks }] }] }`
   before display.
2. **Do NOT ship a generic AI-styled UI.** The Figma must be replicated
   accurately — spacing, typography, colours, shadows, micro-interactions.
   **Every value is already extracted** into
   [`doc/DESIGN_SPECS.md`](doc/DESIGN_SPECS.md) +
   [`doc/DESIGN_MEASUREMENTS.md`](doc/DESIGN_MEASUREMENTS.md). Use the values
   verbatim — no rounding, no guessing.
3. **Do NOT use Bootstrap or default component libraries** unless heavily
   customised to match Figma.
4. **Validation is required** on the assignment-creation form: no empty values,
   no negative numbers.
5. **The job flow is mandatory:** API → BullMQ enqueue → worker generates →
   Mongo stores → WebSocket notifies frontend. Do not bypass the queue with a
   synchronous LLM call.
6. **Redis must be used** — caching and/or job state.
7. **TypeScript everywhere** — frontend and backend.
8. **Deliverables = GitHub repo + Live deployed link + README** (architecture +
   approach). All three required.

---

## 5. Evaluation priority (in this order)

1. Requirements compliance (heaviest)
2. UI / design accuracy vs Figma (heavy)
3. Frontend polish — responsiveness, spacing, type, micro-interactions

Trade-offs always favour the higher item.

---

## 6. Required output-page elements

- **Student Info** inputs: Name, Roll Number, Section
- **Sections** (A, B, …) each with title + instruction + question list
- **Each question:** text, difficulty tag (Easy / Moderate / Hard), marks
- Real-exam-paper hierarchy; mobile-responsive

## 7. Bonus (only after the must-haves are green)

- PDF export with proper layout (not browser print of HTML)
- Regenerate action bar on output page
- Visual difficulty badges/tags
- Better caching, extra UI polish

---

## 8. Agent behaviour rules (for this repo)

- **Confirm before non-trivial actions** — file batches, dependency installs,
  destructive commands, architectural decisions. (Per user's global rules.)
- **Never push to remote** unless explicitly told.
- **Never commit** unless explicitly told.
- **Be terse.** State decisions, not deliberation.
- **No silent contradiction-resolution.** If `doc/` files disagree, ask.
- **Don't invent links, deadlines, or requirements.** Quote from `doc/`.
- **Match Figma by measuring.** Use the values in `doc/DESIGN_SPECS.md` /
  `doc/DESIGN_MEASUREMENTS.md` verbatim. If a value isn't in either file, do
  NOT guess — re-extract via `python doc/.figma-raw/measure.py` (or ask the
  user) before proceeding.
- **Don't add features beyond the spec** without user approval, even if "nice
  to have." Bonus items are explicitly opt-in.

---

## 9. Design implementation workflow

When you start the frontend build, follow this sequence:

1. **Read [`doc/DESIGN_SPECS.md`](doc/DESIGN_SPECS.md) §1** to understand the
   token system, then create `tokens.ts` (or `tailwind.config`) with the
   exact colours, typography, radii, shadows, spacing scale.
2. **Load all three fonts** as listed in `DESIGN_SPECS.md` §11.2: Bricolage
   Grotesque (Regular/Medium/SemiBold/Bold/ExtraBold), Inter (Regular/Medium/
   SemiBold), and Manrope (Medium only — used in exactly one place).
3. **Build the shared shell first**: `<Sidebar variant="default|output|upload">`
   (§2.2, §7.7, §9.1), `<TopBar variant="frosted|opaque" label="…">` (§2.3,
   §9.1), `<MobileTopBar>` (§4.2), `<MobileBottomNav active="…">` (§4.5).
4. **Implement the 4 screens** in this order — 0-State (§3/4) → Filled State
   (§5/6) → Upload Selector (§7/8) → Assignment Output (§9/10).
5. **For each component**, cross-check against
   [`doc/DESIGN_MEASUREMENTS.md`](doc/DESIGN_MEASUREMENTS.md) by name (e.g.
   the illustration in 0-State has `margins L=93 R=93 T=0 B=108` inside its
   `486 × 678 px` column — this lets you verify centering, gutters, vertical
   rhythm without opening Figma).
6. **Mobile chrome** in the Figma (iOS status bar, address bar, browser tab
   bar) is a screenshot prop — **do not ship it.** Let the real browser
   render it. Documented in `DESIGN_SPECS.md` §4.1 and §10.1.

Components that map 1:1 onto the spec sections are listed in
`DESIGN_SPECS.md` §11.4 and §13 — use those names so the spec-to-code
mapping stays obvious.

---

## 10. Repo layout — pnpm workspaces

**Decision (2026-05-24):** pnpm workspaces, no Turborepo. Three apps as
independent deployable processes + one shared-types package. Pattern follows
modern industry usage (Cal.com, t3-stack, Vercel templates) but without the
Turborepo overhead, which is unwarranted for a solo 24-hour build.

```
veda-ai/  (root)
├── CLAUDE.md                   ← this file — agent rulebook
├── AGENTS.md                   ← mirror of CLAUDE.md for non-Claude agents
├── README.md                   ← required for submission (architecture + approach)
├── package.json                ← root: workspace scripts (dev:web, dev:api, dev:worker)
├── pnpm-workspace.yaml         ← declares apps/* and packages/* as workspaces
├── tsconfig.base.json          ← shared TS base config
├── .env.example                ← all required env vars listed
├── .gitignore
│
├── apps/
│   ├── web/                    ← Next.js + TS (frontend)  →  deploy: Railway service
│   │   ├── src/
│   │   │   ├── app/            ← Next.js App Router pages
│   │   │   ├── components/     ← UI components — names match DESIGN_SPECS §11.4 / §13
│   │   │   ├── features/       ← feature slices: assignments, output
│   │   │   ├── lib/            ← ws client, api client, helpers
│   │   │   ├── store/          ← Zustand store (or Redux — pick one)
│   │   │   └── styles/         ← globals.css + tokens
│   │   ├── public/             ← static assets (Figma exports go here)
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api/                    ← Express + Socket.IO + TS  →  deploy: Railway service (public)
│   │   ├── src/
│   │   │   ├── routes/         ← Express routers
│   │   │   ├── controllers/
│   │   │   ├── services/       ← business logic
│   │   │   ├── ws/             ← Socket.IO server
│   │   │   ├── db/             ← Mongoose models + connection
│   │   │   ├── queue/          ← BullMQ producer
│   │   │   └── index.ts        ← Express bootstrap
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── worker/                 ← BullMQ worker (own process)  →  deploy: Railway service (private)
│       ├── src/
│       │   ├── processors/     ← generation, pdf jobs
│       │   ├── llm/            ← prompt builder + structured-response parser
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared-types/           ← @veda/shared-types
│       ├── src/
│       │   ├── assignment.ts   ← Assignment, Section, Question, Difficulty
│       │   ├── ws.ts           ← WSEvent union, channel names
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json        ← name: "@veda/shared-types"
│
└── doc/                        ← ALREADY POPULATED
    ├── README.md               ← index of this folder
    ├── Assignment_Master.md    ← the brief (read first)
    ├── DESIGN_SPECS.md         ← pixel-perfect design specs (read second)
    ├── DESIGN_MEASUREMENTS.md  ← measured distances (read third)
    └── .figma-raw/             ← Figma JSON cache + parser (gitignore'd)
```

### Workspace rules

- **Shared types live in `@veda/shared-types`.** Import the same `Assignment`
  / `Section` / `Question` / `WSEvent` types in `web`, `api`, AND `worker`.
  Never re-declare a type that already exists there — the TypeScript
  compiler is what enforces Hard Rule #1 (structured LLM-response parsing).
- **Each app has its own `package.json` and deploys independently.** Don't
  add framework-specific deps (`next`, `express`, `bullmq`) to the root —
  they live in the app that uses them.
- **Cross-cutting devDeps** (typescript, eslint, prettier) live at the root.
- **Root scripts**:
  - `pnpm dev:web` / `pnpm dev:api` / `pnpm dev:worker` — start each one
  - `pnpm dev` — runs all three in parallel (using `pnpm -r --parallel run dev`)
  - `pnpm build` — builds all workspaces
  - `pnpm lint`, `pnpm typecheck` — run across all workspaces

### Bootstrapping order (when scaffolding starts)

1. Create root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, `.env.example`.
2. Scaffold `packages/shared-types/` first (everything depends on it).
3. Scaffold `apps/api/` second (worker depends on shared queue interfaces it owns).
4. Scaffold `apps/worker/` third.
5. Scaffold `apps/web/` last.
6. Wire deploys on Railway: one project with five services — `web`, `api`, `worker`, MongoDB plugin, Redis plugin. `web` and `api` get public domains; `worker` stays private. UptimeRobot pings `web` every 5 min. See [`doc/EXECUTION_PLAN.md`](doc/EXECUTION_PLAN.md) §0 hosting table for full config.

**Confirm with the user before creating `apps/` or `packages/`.**
