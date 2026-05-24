# VedaAI — Full Stack Engineering Assignment (MASTER CONTEXT)

> **Single source of truth.** Consolidates the company email, the company's
> execution guidelines, and the official assignment spec. This is the only
> source-of-truth doc in the repo — keep it accurate.

---

## 0. Quick Reference

| Item | Value |
|---|---|
| **Role applied for** | Full-Stack Developer |
| **Round** | Round 2 — Technical Assignment ("Build & Deploy Challenge") |
| **Round 1 status** | Cleared (Resume Shortlisting) |
| **Deadline** | **24 hours from start.** Submit within 24 hours. |
| **Figma (CANONICAL)** | https://www.figma.com/design/WCiWHU75IKI31oRY18aqdm/VedaAI?node-id=0-1&t=EwMmg9V31ffDp4i2-1 |
| **Design spec (extracted)** | [`DESIGN_SPECS.md`](DESIGN_SPECS.md) — pixel-perfect, all 8 screens. Use this instead of opening Figma. |
| **Measured distances** | [`DESIGN_MEASUREMENTS.md`](DESIGN_MEASUREMENTS.md) — every element's L/R/T/B margins + sibling gaps. |
| **Repo layout** | pnpm workspaces — `apps/{web,api,worker}` + `packages/shared-types`. See [`../CLAUDE.md`](../CLAUDE.md) §10. |
| **Hosting** | **Railway** (single platform) — all 3 services + MongoDB + Redis plugins. Free during $5 trial. LLM = Google Gemini 2.0 Flash (free). UptimeRobot keeps `web` warm. See [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md) §0. |
| **Submission deliverables** | GitHub repo (clean code + setup) **+** Deployed live link **+** README (architecture + approach) |

---

## 1. The Round-2 Email (verbatim summary)

Greetings from VedaAI. Round 1 (Resume Shortlisting) is cleared. Candidate is
shortlisted for **Round 2 — the Technical Assignment Round (Build & Deploy
Challenge).**

Explicit instruction from the email: **"the figma file should be replicated
accurately."**

---

## 2. Company Execution Guidelines

### 2.1 Core Philosophy
> Quality and precision are valued **over** speed. Do **not** rely on generic
> AI-generated UIs.

### 2.2 Evaluation Weightage — IN ORDER OF IMPORTANCE
1. **Requirements Compliance — HIGHEST.** Every functional and technical
   requirement below must be fulfilled. Freedom on *how*; no freedom on
   *what*.
2. **UI & Design Accuracy — HEAVY.** Frontend will be scrutinised against
   Figma.
3. **Frontend Polish.** Responsiveness, exact spacing, typography,
   micro-interactions.

### 2.3 End-to-End Workflow (5 Phases)

**Phase 1 — Deep Dive & Architecture (do not skip)**
- Read this master doc thoroughly; list every functional requirement.
- Deconstruct the Figma: extract design system (colours, typography, spacing,
  shadows).
- Make tech-stack decisions that enable perfect Figma replication.

**Phase 2 — High-Fidelity Frontend**
- Design system is already extracted: read [`DESIGN_SPECS.md`](DESIGN_SPECS.md) §1
  for tokens (colours, typography, radii, shadows, spacing), then mirror it
  into `apps/web/tailwind.config.ts` and global CSS variables.
- Three fonts to load (per `DESIGN_SPECS.md` §11.2): **Bricolage Grotesque**,
  **Inter**, **Manrope**.
- Build components *exactly* as Figma shows. **No generic component libraries
  (Bootstrap, default AI-generated styles) unless heavily customised.**
- Use [`DESIGN_SPECS.md`](DESIGN_SPECS.md) §§2–10 for per-screen specs and
  [`DESIGN_MEASUREMENTS.md`](DESIGN_MEASUREMENTS.md) to verify any specific
  gutter / sibling gap / inter-element distance.
- Responsive across Mobile, Tablet, Desktop. Mobile reference width: **393 px**
  (iPhone 14/15). Desktop reference: **1440 px**. Interpolate tablet.

**Phase 3 — Core Functionality**
- Implement business logic per the spec in §3.
- Use the "freedom to find other ways to implement" — clean, efficient,
  well-architected code.
- Handle loading states, error boundaries, empty states.

**Phase 4 — Polish & QA**
- Side-by-side UI audit vs Figma; fix every discrepancy.
- Add subtle hover/active/transition micro-interactions for a premium feel.
- Self-evaluate every requirement on the checklist (§4) one final time.

**Phase 5 — Deployment & Submission**
- Deploy frontend and backend on **Railway** (the chosen "equivalent" of
  Vercel/Render — see `EXECUTION_PLAN.md` §0 for the rationale).
- Confirm live links work.

---

## 3. Official Assignment Spec

### 3.1 Overview
Build an AI **Assessment Creator** based on the Figma designs. The system must
let a **teacher** to:
1. Create an assignment
2. Generate a question paper using AI
3. View the generated output

Extra points for **creativity** (functionality).

### 3.2 Core Features

#### Feature 1 — Assignment Creation (Frontend Form)
Form fields:
- File upload (PDF / text) — *optional*
- Due date
- Question types
- Number of questions + marks
- Additional instructions

Requirements:
- Proper validation (no empty values, no negative values)
- **Redux or Zustand** for state management
- **WebSocket** management

#### Feature 2 — AI Question Generation
- Convert form input → **structured prompt**
- Generate:
  - Sections (A, B, …)
  - Questions
  - Difficulty (easy / medium / hard)
  - Marks
- **Do not directly render the LLM response.** Parse into structured data
  before display.

#### Feature 3 — Backend System
- Stack: **Node.js + Express (TypeScript)**
- Must include:
  - **MongoDB** — store assignments & results
  - **Redis** — caching / job state
  - **BullMQ** — background jobs (generation, PDF)
  - **WebSocket** — real-time updates
- Flow:
  1. API request received
  2. Job added to queue
  3. Worker processes generation
  4. Result stored
  5. Frontend notified (via WebSocket)

#### Feature 4 — Output Page (Enhanced)
Display the generated question paper in a **structured, well-designed format**
inspired by the Figma UI.

**Student Info Section** (input lines)
- Name
- Roll Number
- Section

**Question Sections**
- Group questions into sections (Section A, B, …)
- Each section includes: title, instruction (e.g., "Attempt all questions"),
  questions list.
- Each question displays: question text, difficulty tag (Easy / Moderate /
  Hard), marks.

**UX expectations**
- Clean, readable, like a real exam paper
- Proper spacing and hierarchy
- Mobile responsive

**Bonus (optional, high signal)**
- Download as PDF (properly formatted, **not raw HTML print**)
- Action bar (Regenerate)
- Visual difficulty highlight (badges / tags)

**Avoid**
- Rendering raw AI response
- Poor formatting or misaligned sections
- A single block of text without hierarchy

### 3.3 Tech Stack (Fixed)

**Frontend**
- Next.js + TypeScript
- Redux *or* Zustand
- WebSocket

**Backend**
- Node.js + Express (TypeScript)
- MongoDB
- Redis
- BullMQ

**AI**
- Any LLM (GPT / Claude / OSS)
- Prompt structuring + response parsing **required**

### 3.4 Submission Requirements
1. **GitHub repo** — clean code, setup instructions.
2. **README** — architecture overview + approach.
3. **Deployed link** — live, working.

**Bonus**
- PDF export
- Better caching
- Improved UI polish

---

## 4. Definition-of-Done Checklist

A submission is "done" only when **every** box is ticked.

### Functional
- [ ] Teacher can create an assignment with all listed fields
- [ ] File upload accepts PDF / text (optional field)
- [ ] Due date picker works
- [ ] Question types selectable
- [ ] Number of questions + marks inputs validated (no empty, no negative)
- [ ] Additional-instructions field present
- [ ] State managed via Redux **or** Zustand (one chosen and consistent)
- [ ] WebSocket connection established frontend ↔ backend
- [ ] On submit: API request → BullMQ job queued → worker runs LLM → result
      saved to MongoDB → WebSocket notifies frontend
- [ ] Redis used for caching and/or job state
- [ ] LLM response parsed into structured Sections/Questions/Difficulty/Marks
- [ ] Output page renders Student Info section (Name / Roll / Section)
- [ ] Output page renders sections with title + instruction + questions
- [ ] Each question shows text + difficulty tag + marks

### UI / Design
- [ ] Figma colours, typography, spacing extracted into design tokens
- [ ] Side-by-side Figma vs build comparison done; discrepancies fixed
- [ ] Responsive on mobile, tablet, desktop
- [ ] Hover / active / transition states present
- [ ] Loading / error / empty states handled

### Code Quality
- [ ] TypeScript everywhere (frontend and backend)
- [ ] Clean folder structure
- [ ] No dead code, no committed secrets
- [ ] Setup instructions in README runnable end-to-end on a fresh clone
- [ ] README documents architecture + approach

### Deployment & Submission
- [ ] Frontend deployed (**Railway** — chosen as the "or equivalent")
- [ ] Backend + worker deployed (**Railway** services)
- [ ] MongoDB / Redis reachable (**Railway plugins**, internal network)
- [ ] UptimeRobot monitor pinging `web` URL every 5 min (prevents sleep)
- [ ] Live links verified working
- [ ] Submitted within the 24-hour window

### Bonus (only after the above is green)
- [ ] PDF export with real layout (not browser print of HTML)
- [ ] Regenerate action in output page
- [ ] Visual difficulty badges polished
