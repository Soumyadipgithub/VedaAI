# VedaAI — Execution Plan

> **Purpose.** A concrete, time-budgeted plan for executing the VedaAI
> Round-2 assignment within the 24-hour window. Locks down library choices,
> declares the per-phase budget, lists the bottlenecks that will cost time
> if not handled early, and tells the human what to do **before** scaffolding
> starts.
>
> **Sibling docs:** [`Assignment_Master.md`](Assignment_Master.md) is the
> brief (the *what*). This file is the *how*.

---

## 0. Tech stack — final locked-in choices

The assignment fixes the stack at the layer level. The decisions below pick
the concrete library inside each layer so the agent doesn't second-guess
at runtime.

| Layer | Locked choice | Reason |
|---|---|---|
| Package manager | **pnpm** (workspaces) | Per `CLAUDE.md §10`. |
| TS framework (FE) | **Next.js 15 + App Router + TS** | Per spec. |
| State (FE) | **Zustand** | Faster to wire than Redux Toolkit; sufficient for this scope. |
| Styling | **Tailwind CSS 3 + arbitrary values** | Required to hit pixel values like `93px` / `108px` directly. |
| Forms | **React Hook Form + Zod resolver** | Type-safe + matches Hard Rule #4 (validation). |
| Date picker | **react-day-picker** | Lightweight, themeable to match Figma. |
| Icons | Inline SVG / **lucide-react** for generic icons | Custom icons exported from Figma; lucide for the boring ones. |
| WS client | **socket.io-client** | Pairs with the server choice; auto-reconnect. |
| HTTP client | **fetch + a tiny wrapper** | No axios. Native fetch is enough. |
| TS framework (BE) | **Express 4 + TS (tsx for dev)** | Per spec. |
| WS server | **Socket.IO 4** | Room-based broadcast (`job:<jobId>`); CORS + transports easy. |
| ODM | **Mongoose 8** | Per spec MongoDB; mongoose gives typed schemas. |
| Job queue | **BullMQ 5** | Per spec. |
| Validation (BE) | **Zod** | Same lib both sides; parse LLM output against it. |
| LLM client | **`@google/genai` SDK with Gemini 2.0 Flash** *(JSON mode via `responseSchema`)* | **Completely free** — 1500 req/day from Google AI Studio. Claude Pro subscription does NOT give API access; this avoids any LLM cost. Fallback: Groq + Llama 3.3 70B (also free, 30 req/min). |
| File upload | **multer** (memory storage, then text-extract for PDFs) | Spec says optional; keep it minimal. |
| PDF parsing (if uploaded) | **pdf-parse** | Cheap text extraction. |
| PDF export (bonus) | **@react-pdf/renderer** server-side | Real PDF layout, not headless Chrome. Smaller deploy. |
| Logging | **pino** | Fast, structured. Skip if time-tight; `console.log` is fine for MVP. |
| Linting | **eslint + @typescript-eslint** at root | Shared across workspaces. |
| Format | **Prettier** at root | Same. |

### Hosting — Railway single-platform

**Decision (2026-05-24):** Everything on Railway except the LLM API.
Single platform, single dashboard, single env-var place, internal
networking between services. The $5 trial credit covers the assignment
build + evaluation window.

| Component | Provider | Notes |
|---|---|---|
| `apps/web` | **Railway service** (Nixpacks autodetects Next.js) | Connect GitHub repo, set root dir = `apps/web`. |
| `apps/api` | **Railway service** (Express + Socket.IO) | Same project, separate service. Stays warm via BullMQ Redis polling (outbound traffic). |
| `apps/worker` | **Railway service** (BullMQ consumer) | Same project, separate service. Stays warm via Redis polling. |
| MongoDB | **Railway MongoDB plugin** (1-click) | Internal URL `mongodb.railway.internal`; no IP whitelist needed. |
| Redis | **Railway Redis plugin** (1-click) | Internal URL `redis.railway.internal`. BullMQ-compatible. |
| LLM | **Google AI Studio — Gemini 2.0 Flash** (free) | 1500 requests/day; native JSON mode via `responseSchema`. |
| Web keep-warm | **UptimeRobot** (free, 1 monitor) | Pings `apps/web` URL every 5 min to prevent the 10-min idle sleep. Backend services don't need this — Redis polling keeps them warm. |

**Total cost during assignment + 30-day evaluation window: $0.**
After 30 days: shut services down → still $0, **or** upgrade Railway to
Hobby ($5/mo) if you want to keep the demo live as a portfolio piece.

---

## 1. Phase-by-phase plan (24-hour budget)

The phase list intentionally front-loads the deploy-pipeline setup so that
"deploy" never becomes the last-minute panic. The biggest single bucket is
Phase 4 — the four screens — because UI fidelity is evaluation priority #2.

| # | Phase | Budget | Cumulative |
|---|---|---|---|
| 0 | Setup & deploy-pipeline first | **1h 00m** | 1h |
| 1 | Backend skeleton + DB/queue wiring | **1h 30m** | 2h 30m |
| 2 | Worker + LLM pipeline | **2h 30m** | 5h |
| 3 | Frontend shell (tokens, fonts, sidebar, top bars) | **2h 00m** | 7h |
| 4 | Four screens — pixel-perfect Figma replication | **7h 00m** | 14h |
| 5 | Integration: form → API → WS → output render | **2h 30m** | 16h 30m |
| 6 | Polish + difficulty badges + states | **2h 00m** | 18h 30m |
| 7 | Bonus (PDF export, regenerate) — only if green | **2h 00m** | 20h 30m |
| 8 | README + final QA + deploy + submit | **1h 30m** | 22h |
| — | **Buffer** | **2h 00m** | **24h** |

### Phase 0 — Setup & deploy-pipeline first  (1h)

**Why first:** if a deploy step is broken, you want to know in hour 1, not
hour 23.

- Init pnpm workspace at root. `pnpm-workspace.yaml`, root `package.json`,
  `tsconfig.base.json`, `.gitignore`, `.env.example`.
- Scaffold `packages/shared-types/` with `Assignment`, `Section`,
  `Question`, `Difficulty`, `WSEvent` (start with empty exports, fill in
  Phase 1).
- Scaffold `apps/web/` with `create-next-app` then strip the boilerplate.
- Scaffold `apps/api/` with bare Express + a `/health` endpoint.
- Scaffold `apps/worker/` with a stub BullMQ worker that just logs.
- Push to GitHub.
- **On Railway:** create one project. Inside it, add 5 services from the
  GitHub repo:
  1. `web` service → root dir `apps/web`, start command `pnpm start`.
  2. `api` service → root dir `apps/api`, start command `pnpm start`.
  3. `worker` service → root dir `apps/worker`, start command `pnpm start`.
  4. MongoDB plugin (1-click "Add Service → Database → MongoDB").
  5. Redis plugin (1-click "Add Service → Database → Redis").
- Wire env vars (see §B6 master list) in each Railway service's Variables
  tab. Use `${{ MongoDB.MONGO_URL }}` and `${{ Redis.REDIS_URL }}` —
  Railway's variable-reference syntax pulls the internal URLs automatically.
- Set the `web` service to public domain (Railway generates
  `*.up.railway.app`). Keep `api` and `worker` private (internal-only).
- Wait, exception: `api` needs a public domain too so the browser can
  reach Socket.IO. Toggle Public Networking on for `api` only.
- Set up an **UptimeRobot** HTTP(s) monitor on the `web` public URL,
  5-min interval.
- **Acceptance:** `/health` on the public `api` URL returns 200, `web`
  loads, both visible in Railway dashboard as deployed.

### Phase 1 — Backend skeleton  (1h 30m)

- Mongoose `Assignment` model (matches `@veda/shared-types`).
- Mongo connection + index.
- Upstash Redis connection + BullMQ producer (`assignmentQueue`).
- Socket.IO server with `job:<jobId>` rooms.
- Routes:
  - `POST /api/assignments` — validate body with Zod, persist `pending`
    Assignment, enqueue BullMQ job, return `{ jobId, assignmentId }`.
  - `GET /api/assignments/:id` — fetch by id (for refresh).
  - `POST /api/assignments/:id/regenerate` — bonus, stub for now.
- Multer-mounted upload route (text/PDF accepted, optional).
- CORS allowing the Vercel preview + production origins.
- **Acceptance:** can POST a fake body, see job in BullMQ, doc in Mongo.

### Phase 2 — Worker + LLM pipeline  (2h 30m)

The most error-prone phase. Spend time on the prompt and parser; the rest
is plumbing.

- Worker bootstrap, connects to same Redis, subscribes to `assignmentQueue`.
- LLM prompt builder (`apps/worker/src/llm/prompt.ts`):
  - Input: assignment form data (file text optional, due date, question
    types, counts, marks, additional notes).
  - Output: structured prompt with explicit JSON schema instructions
    matching the `Assignment` shape from `@veda/shared-types`.
- LLM call with `response_format: { type: "json_object" }`.
- Response parser:
  1. `JSON.parse` the string.
  2. Validate with the **same Zod schema** used by the API.
  3. On parse failure → retry once with a shorter prompt; on second
     failure → mark assignment `failed` and emit WS error.
- On success → update Mongo doc to `done` with the parsed structure → emit
  `job:<id>:done` over Socket.IO with the full assignment payload.
- **Acceptance:** submit a real form → see `done` doc in Mongo with
  validated structure.

### Phase 3 — Frontend shell  (2h)

- `next/font` for Bricolage Grotesque, Inter, Manrope (all on Google Fonts).
- Tailwind config: extend with tokens from `DESIGN_SPECS.md §1` (colors,
  radii, shadows, font families, spacing extensions).
- Global CSS: gradient page bg, scrollbars, base resets.
- Layout shell:
  - `<Sidebar variant="default|output|upload" />` — `DESIGN_SPECS.md §2.2`.
  - `<TopBar variant="frosted|opaque" label="..." />` — §2.3 / §9.1.
  - `<MobileTopBar />` — §4.2.
  - `<MobileBottomNav active="home|assignments|library|toolkit" />` — §4.5.
- App Router layouts that switch between desktop shell vs mobile shell at
  the breakpoint.
- **Acceptance:** an empty page renders the chrome correctly at 1440px AND
  at 393px against Figma.

### Phase 4 — Four screens  (7h, the biggest bucket)

For each screen, follow the same micro-loop:

1. Pull values from `DESIGN_SPECS.md §<screen>`.
2. For any "is this 24 or 32?" doubt, grep `DESIGN_MEASUREMENTS.md` by
   element name.
3. Build the component(s).
4. Side-by-side compare in browser vs Figma screenshot.
5. Diff-fix until visually identical.

| Screen | Budget | Notes |
|---|---|---|
| 0-State (Desktop + Mobile) | 1h | Simplest. Illustration is 5 stacked layers — use Figma exports. |
| Filled State | 1h 30m | 2-col card grid (Desktop), 1-col stack (Mobile). 12 cards in Figma but really one component repeated. Card dropdown. |
| Upload Material – Selector | 2h 30m | Largest form. Dropzone + DateField + QuestionTypePicker + stepper sub-cells + textarea + mic. React Hook Form + Zod here. |
| Assignment Output | 2h | Print-paper layout. Inter typography. Lh `38.4px` on the body. AIGreetingCard + ExamPaperCard. Difficulty badges (bonus). |

### Phase 5 — Integration  (2h 30m)

- Zustand store: `currentJobId`, `assignment`, `status`.
- WS client: on mount, connect to API; on submit, join `job:<jobId>` room;
  on `done` event, update store + route to output page.
- API client wrapper: `createAssignment`, `getAssignment`,
  `regenerateAssignment`.
- Form submit handler: validate → POST → store jobId → show loading state.
- Loading / error / empty states for every async path (Hard Rule #4 implicit).
- Reconnect handling: if WS drops, re-fetch `GET /api/assignments/:id` to
  recover state.
- **Acceptance:** end-to-end flow works on `localhost` against deployed
  API in another terminal.

### Phase 6 — Polish  (2h)

- Hover / focus / active states for buttons.
- Loader skeletons or a single tasteful spinner.
- Empty state on the output page if `assignment.sections` is empty.
- Visual difficulty badges for `[Easy]`, `[Moderate]`, `[Challenging]`
  (bonus, but it's the cheapest bonus and high signal).
- Final side-by-side Figma audit at 1440px and 393px.

### Phase 7 — Bonus (only if Phase 6 is green)  (2h cap)

- PDF export with `@react-pdf/renderer` on the API. Mirror the
  `ExamPaperCard` layout but in `@react-pdf/renderer` primitives.
- "Regenerate" button on output page → `POST /api/assignments/:id/regenerate`.

### Phase 8 — README + final QA + submit  (1h 30m)

- README with: architecture diagram, env vars, local setup, deploy steps,
  decision rationale (state mgmt choice, queue choice, etc.), known
  limitations.
- Final smoke test on live URLs.
- Submit.

---

## 2. Bottleneck register — what will burn time if you're not ready

These are sorted by probability × impact. Read them all before starting.

### B1 — LLM returns malformed JSON

**Probability:** high. **Impact:** entire feature broken.

**Mitigation:**
- Use OpenAI's `response_format: { type: "json_object" }` (or Anthropic's
  `tool_use` with a structured tool). Don't just ask "return JSON" in plain
  text.
- Validate with Zod immediately after `JSON.parse`. **Treat the same Zod
  schema as the contract** — import it from `@veda/shared-types`.
- One retry on parse failure with a stricter prompt. Then fail the job
  gracefully (don't crash the worker).

### B2 — WebSocket reachability on Railway

**Probability:** medium. **Impact:** WS connects from browser but events
don't fire.

**Mitigation:**
- The `api` service must have **Public Networking** enabled in Railway
  (Settings → Networking → Generate Domain) so the browser can connect.
- The `web` service connects to `process.env.NEXT_PUBLIC_API_URL`
  pointing at the public `api` URL (`https://api-xxx.up.railway.app`).
- CORS on the Express side must list the Railway-issued `web` domain.
- Socket.IO transports: keep websocket + polling fallback enabled. Railway
  proxies WebSocket upgrades natively — no extra config needed.

### B3 — Railway service sleep on free trial

**Probability:** medium. **Impact:** first request after 10 min idle hits
a ~5-15s cold boot.

**Behaviour:** Railway sleeps a service after 10 min of **no outbound
traffic**. For our app:
- `api` & `worker` poll Redis continuously (BullMQ) → outbound never
  stops → **stay warm naturally.**
- `web` has no outbound when idle → **will sleep.** First visitor cold-boots.

**Mitigation:** one free UptimeRobot HTTP monitor pinging the `web`
public URL every 5 min. Cost: $0, setup: 2 min.

### B4 — Railway $5 credit burn rate

**Probability:** medium. **Impact:** services pause mid-evaluation if
credit runs out.

**Burn rate (rough):** 5 services × 0.5GB RAM × always-on ≈ $0.10-0.20/day.
$5 credit lasts **20-50 days** at our workload. Comfortably covers a
24-hour build + week-long evaluation window.

**Mitigation:**
- Monitor Railway's Usage tab daily. If burn is faster than expected,
  pause non-essential services overnight (worker can be paused when not
  actively testing).
- After evaluation: **pause the project** (Railway settings → Pause
  project) — services stop billing immediately.
- If you want it alive long-term: $5/mo Hobby plan covers everything.

### B5 — Mongo/Redis plugin connection strings

**Probability:** low (Railway plugins are 1-click). **Impact:** if you
hardcode connection strings, they break on redeploy.

**Mitigation:** use Railway's **variable references**:

```
MONGODB_URI = ${{ MongoDB.MONGO_URL }}
REDIS_URL   = ${{ Redis.REDIS_URL }}
```

Railway resolves these at deploy time. Don't paste literal URLs — they
contain credentials that rotate.

### B6 — Environment variables drift

**Probability:** high. **Impact:** "works on my machine" syndrome.

**Mitigation:**
- Single `.env.example` at the repo root listing every var ever used.
- Per-service env vars set in the Railway dashboard (Variables tab).
- The Next.js client variables must be prefixed `NEXT_PUBLIC_` and
  re-rebuild after change.

**Required env vars (master list — Railway syntax):**

```
# ─── apps/web service ─────────────────────────────────────
NEXT_PUBLIC_API_URL          = https://${{ api.RAILWAY_PUBLIC_DOMAIN }}
NEXT_PUBLIC_WS_URL           = https://${{ api.RAILWAY_PUBLIC_DOMAIN }}
NODE_ENV                     = production

# ─── apps/api service ─────────────────────────────────────
PORT                         = ${{ PORT }}                  # Railway injects
NODE_ENV                     = production
MONGODB_URI                  = ${{ MongoDB.MONGO_URL }}     # Railway plugin ref
REDIS_URL                    = ${{ Redis.REDIS_URL }}       # Railway plugin ref
CORS_ORIGINS                 = https://${{ web.RAILWAY_PUBLIC_DOMAIN }}
GEMINI_API_KEY               = <paste from AI Studio>
GEMINI_MODEL                 = gemini-2.0-flash

# ─── apps/worker service ──────────────────────────────────
NODE_ENV                     = production
MONGODB_URI                  = ${{ MongoDB.MONGO_URL }}
REDIS_URL                    = ${{ Redis.REDIS_URL }}
GEMINI_API_KEY               = <same as api>
GEMINI_MODEL                 = gemini-2.0-flash
```

Railway's `${{ Service.VARIABLE }}` syntax resolves at deploy time, so
service URLs and database connection strings are always correct even if
they rotate.

### B7 — Pixel-perfect Tailwind without bespoke tokens

**Probability:** high if you try to map every value to the Tailwind scale.
**Impact:** rounding errors compound.

**Mitigation:** use arbitrary values (`p-[24px]`, `gap-[12px]`,
`rounded-[16px]`). Don't try to extend Tailwind's spacing scale with every
value in the design. Extend only the colors, fonts, and shadows (those are
limited and reusable). Spacings are one-offs per layout.

### B8 — Figma image assets

**Probability:** certain. **Impact:** illustrations, the logo, avatars all
render as broken images.

**Mitigation:**
- Export the assets from Figma manually: illustration components, the
  VedaAI logo (orange + dark variants), the avatar placeholder.
- Drop them into `apps/web/public/assets/`.
- Use Next.js `<Image>` for raster, inline `<svg>` for icons where
  possible.
- The asset URLs in `doc/.figma-raw/nodes-all8.json` expire in 7 days —
  don't depend on them in production.

### B9 — Three fonts → FOUC + layout shift

**Probability:** medium. **Impact:** UI flickers on load.

**Mitigation:** use `next/font/google` for all three (Bricolage Grotesque,
Inter, Manrope). It self-hosts the files and inlines the `font-display:
swap` correctly. Apply each font to its scope via Tailwind theme:

```ts
// tailwind.config.ts
fontFamily: {
  brand: ['var(--font-bricolage)', 'sans-serif'],
  paper: ['var(--font-inter)', 'sans-serif'],
  title: ['var(--font-manrope)', 'sans-serif'], // only the mobile output title
}
```

### B10 — WebSocket reconnect / state recovery

**Probability:** medium. **Impact:** user submits, drops WS, never sees
result.

**Mitigation:** on WS `connect` event, the client emits `resume:{ jobId }`.
The server checks Mongo — if the job is already `done`, push the result
immediately. If `pending`, re-join the room. This makes the flow resilient
to refresh.

### B11 — Time underestimate on Upload Selector form

**Probability:** high. **Impact:** eats into the buffer.

**Mitigation:** the form has 4 selector pills with chevron + X + nested
stepper sub-cells. This is the longest single component. **Build it as a
single component first with hardcoded state, then wire React Hook Form
around it.** Don't try to do form-state and visual layout simultaneously.

### B12 — PDF export (bonus)

**Probability:** the trap is "puppeteer-on-Render" failing to deploy
because of Chrome dependencies. **Impact:** bonus is wasted effort.

**Mitigation:** use `@react-pdf/renderer` (no headless Chrome). It runs
anywhere. Mirror `ExamPaperCard` in their primitives. If time-tight, skip.

### B13 — Bonus inflation

**Probability:** medium. **Impact:** sacrifices must-haves for nice-to-haves.

**Mitigation:** rule: **no bonus work** until the Definition-of-Done
checklist in `Assignment_Master.md §4` is 100% green. The order in this
plan reflects that.

### B14 — Last-minute deploy break

**Probability:** medium. **Impact:** missed deadline.

**Mitigation:** the Phase 0 deploy-first approach. Plus: do a "deploy of
record" at end of each phase. If Phase 8 finds the deploy broken, you
have the previous green commit to roll back to.

### B15 — Submission package incomplete

**Probability:** medium. **Impact:** auto-reject.

**Mitigation:** the deliverables are 3 things — **repo URL + live URL +
README**. Set a 60-min timer for Phase 8 and stick to it. Don't go past
the deadline polishing.

---

## 3. What the human (you) needs to do **before** scaffolding starts

These are the bottlenecks that need accounts / keys / approvals which only
you can provide. Do all of them up-front so the agent never blocks on them.

### 3.1 Accounts to create (~10 min, completely free)

- [ ] **GitHub repo** — create empty repo `veda-ai` (private OK).
- [ ] **Railway** — https://railway.com → sign in with GitHub.
      No credit card needed for the $5 trial.
- [ ] **Google AI Studio** — https://aistudio.google.com → sign in with
      Google → "Get API key" → create a key in a new project. Free tier
      includes Gemini 2.0 Flash with 1500 req/day. Save the key.
- [ ] **UptimeRobot** — https://uptimerobot.com → sign up (free, no card).
      We'll wire one HTTP monitor in Phase 0.

That's it. **No** Atlas, Upstash, Vercel, Render, or OpenAI accounts
needed — Railway hosts Mongo + Redis as built-in plugins, and Gemini is
free.

### 3.2 Decisions you should pre-make

| Question | Default | Override? |
|---|---|---|
| LLM provider | **Google Gemini 2.0 Flash** (free, 1500 req/day) | Override to Groq+Llama 3.3 70B if you'd rather. Claude Pro chat subscription does NOT include API access — needs separate billing. |
| State manager | Zustand | If you really want Redux Toolkit, say so now. |
| Repo name | `veda-ai` | Anything else? |
| Deploy domain | Railway default (`*.up.railway.app`) | If you have a custom domain, say so. |
| Brand-orange usage | only on the active sidebar pill, avatar badges, "Plus" FAB | Per Figma — don't repaint elsewhere. |
| Time zone for due-date display | IST | confirm. |

### 3.3 Things to hand to the agent

When you say "scaffold", paste me:

```
GITHUB_REPO=https://github.com/<you>/veda-ai
GEMINI_API_KEY=AIza...                              # from AI Studio
```

That's all. MongoDB and Redis URLs are set inside the Railway dashboard
via `${{ MongoDB.MONGO_URL }}` / `${{ Redis.REDIS_URL }}` references —
no need to hand them to me directly.

I will never echo your API key back. Treat it like a password. (And rotate
the Figma PAT from the earlier session — see `DESIGN_SPECS.md` change log.)

---

## 4. Acceptance checkpoints (per phase)

After each phase, the agent will pause and report against these. If a
checkpoint fails, you decide whether to spend buffer time fixing it or to
move on and revisit later.

| After phase | Acceptance check |
|---|---|
| 0 | All 3 deploys green; `/health` returns 200 from the live API URL. |
| 1 | `POST /api/assignments` with curl → returns `{jobId, assignmentId}`; doc visible in Atlas; BullMQ entry visible in Upstash. |
| 2 | Above + worker picks up the job, calls LLM, writes parsed structure to Mongo, emits WS event (verified via `wscat` or a tiny test client). |
| 3 | Empty Next.js page renders the desktop shell at 1440px and the mobile shell at 393px — both visually match the relevant frames in `DESIGN_SPECS.md` §2 / §4. |
| 4 | All 4 screens visually pass a side-by-side Figma comparison at both viewports. |
| 5 | Form submit → loading state → output page renders generated paper end-to-end on `localhost`. |
| 6 | Definition-of-Done checklist from `Assignment_Master.md` §4 is **all green** (excluding bonus). |
| 7 | Bonus items only — PDF download works on live URL; regenerate button works. |
| 8 | Live URLs both reachable; README pushed; submission email/form sent. |

---

## 5. What can be cut if time runs out

If by hour 18 we're behind, cut in this order:

1. **All bonus (Phase 7)** — first to go.
2. **PDF export** — even if Phase 7 is started, drop it.
3. **Polish micro-interactions** (hover transitions, subtle animations) —
   keep functional states but drop fancy ones.
4. **Difficulty badges** as visual chips — fall back to inline `[Easy]`
   tags as the Figma actually shows on Desktop output.
5. **Reconnect/resume logic on WS** — fall back to "if WS misses,
   `GET /api/assignments/:id` on output page mount".
6. **Tablet-specific styling** — not in Figma, so skip cleanly.
7. **Worker retry logic** — accept that a failed LLM parse means the
   user has to re-submit. Document it as a known limitation in the README.

**Do NOT cut:**
- Validation (Hard Rule #4).
- Structured LLM parse + Zod (Hard Rule #1).
- WebSocket notification (Hard Rule #5).
- The shell + 4 screens at Desktop AND Mobile (evaluation priority #2).
- Live deploys + README (deliverables).

---

## 6. Change log

- **2026-05-24** — Initial plan. Locks library choices, sets 24-hour budget
  with 2h buffer, enumerates 15 bottlenecks, lists user pre-scaffold setup.
- **2026-05-24 (Railway switch)** — Switched hosting from
  Vercel + Render + Atlas + Upstash (4 platforms, $0 forever) to
  **Railway single-platform** (1 platform, $0 during the assignment +
  evaluation window via the $5 trial credit; then $0 if paused, or $5/mo
  Hobby plan to keep alive). Switched LLM from paid OpenAI GPT-4o-mini to
  **free Google Gemini 2.0 Flash** since the user has Claude Pro (chat
  subscription, NOT API access). Rewrote bottlenecks B2–B5 for Railway's
  10-min outbound-sleep behaviour and plugin variable references. Account
  list shrunk from 7 items to 4. Total project cost: **$0**.
