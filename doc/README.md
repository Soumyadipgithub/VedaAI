# `doc/` — Documentation Index

This folder holds the binding documentation for the VedaAI assignment.
**An agent (or human) starting work on this repo should read these files in
the order listed below.**

---

## Read in this order

| # | File | What it is | Read when |
|---|---|---|---|
| 1 | [`Assignment_Master.md`](Assignment_Master.md) | The brief — what to build, evaluation criteria, hard rules, definition-of-done checklist. **Single source of truth for requirements.** | Every new session, before anything else. |
| 2 | [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md) | Phased 24-hour execution plan. Locked library choices, time budgets per phase, 15-item bottleneck register, per-phase acceptance checkpoints, what-to-cut-if-time-runs-out priority list. | Before scaffolding anything. |
| 3 | [`DESIGN_SPECS.md`](DESIGN_SPECS.md) | Pixel-perfect design specification for all 8 screens (4 screens × Desktop/Mobile), extracted from Figma. Tokens (colours, typography, shadows), per-screen layout, component map. | Before writing any frontend code. |
| 4 | [`DESIGN_MEASUREMENTS.md`](DESIGN_MEASUREMENTS.md) | Auto-generated 1350-line companion. For every element in every frame: size, margins to parent edges (L/R/T/B), sibling gaps (↕/↔). Mirrors Figma's inspect panel. | Whenever you need to verify a specific pixel distance. |

The root [`../CLAUDE.md`](../CLAUDE.md) / [`../AGENTS.md`](../AGENTS.md) point
at this index from the agent's mandatory-reading-order section.

---

## Folder contents

```
doc/
├── README.md               ← this file
├── Assignment_Master.md    ← the brief
├── EXECUTION_PLAN.md       ← phased 24h plan + bottleneck register
├── DESIGN_SPECS.md         ← curated, hand-written design spec
├── DESIGN_MEASUREMENTS.md  ← auto-generated measured distances
└── .figma-raw/             ← Figma JSON cache + parser scripts (gitignore'd)
    ├── nodes-all8.json     ← cached Figma REST payload
    ├── measure.py          ← parser that emits DESIGN_MEASUREMENTS.md
    ├── parse.py            ← earlier parser (full structural dump)
    ├── frame-*.txt         ← per-frame structural dumps
    └── measurements.md     ← parser's working copy (mirrored to ../DESIGN_MEASUREMENTS.md)
```

---

## Regenerating the design data

If the Figma file changes:

```bash
# 1. Refresh the cached payload (needs a Figma PAT in the env)
curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/WCiWHU75IKI31oRY18aqdm/nodes?ids=43:9707,43:9862,43:9429,43:10200,43:9259,43:9947,43:9771,43:10103" \
  -o doc/.figma-raw/nodes-all8.json

# 2. Re-parse into measurements
python doc/.figma-raw/measure.py

# 3. Promote to doc/
cp doc/.figma-raw/measurements.md doc/DESIGN_MEASUREMENTS.md
```

`DESIGN_SPECS.md` is hand-curated; if the Figma changes substantially, update
it manually and re-run the steps above for the measurements appendix.

---

## Precedence when docs disagree

1. **Figma** (the design source) overrides everything in `doc/`.
2. **`Assignment_Master.md`** (the brief) overrides everything else in this
   folder and the root rulebooks.
3. **`DESIGN_SPECS.md`** describes the design as extracted; if it disagrees
   with the live Figma, re-extract — don't silently resolve.
4. **`DESIGN_MEASUREMENTS.md`** is derived from `nodes-all8.json` — if it
   disagrees with `DESIGN_SPECS.md`, `DESIGN_SPECS.md` wins (it's
   hand-curated).

**Never silently resolve a contradiction. Flag it to the user.**
