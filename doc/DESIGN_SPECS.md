# VedaAI — Pixel-Perfect Design Specifications

> **Purpose.** This file is the single source of truth for the frontend implementation.
> Every frame, component, spacing, color and typography value below is extracted
> directly from the Figma file via the Figma MCP API on 2026-05-24.
>
> **For coding agents:** Read this file in full before writing any frontend
> code. Treat every numeric value as exact. Do not round, do not guess. If a
> value is missing, stop and ask the user — do not invent it.
>
> **Source Figma file:**
> `WCiWHU75IKI31oRY18aqdm` — https://www.figma.com/design/WCiWHU75IKI31oRY18aqdm/VedaAI
>
> **Status (2026-05-24):** All 8 frames fully extracted — first 3 via Figma MCP
> (`get_design_context`), remaining 5 via the Figma REST API
> (`/v1/files/.../nodes`) using a Personal Access Token. Raw per-node payloads
> are cached in `doc/.figma-raw/` for re-parsing.
>
> **Companion file:** [`DESIGN_MEASUREMENTS.md`](DESIGN_MEASUREMENTS.md) — an
> auto-generated 1350-line appendix that lists **every layout-relevant element
> in every frame** with its size, margins to all four parent edges (L/R/T/B),
> and inter-sibling gaps (↕ vertical, ↔ horizontal). Only SVG-path internals
> (VECTOR / BOOLEAN_OPERATION) are excluded. **Use it to verify or compute any
> specific pixel distance the main spec doesn't pre-state.** Re-generate with
> `python doc/.figma-raw/measure.py`.

---

## 0. Frame inventory (all 8 top-level frames)

| Screen | Viewport | Node ID | Width × Height | Status |
|---|---|---|---|---|
| 0 State screen | Desktop | `43:9707` | 1440 × 780 | EXTRACTED |
| 0 State screen | Mobile | `43:9862` | 393 × 857 | EXTRACTED |
| Filled State | Desktop | `43:9429` | 1440 × 843 | EXTRACTED |
| Filled State | Mobile | `43:10200` | 393 × 1125 | EXTRACTED |
| Upload Material – Selector | Desktop | `43:9259` | 1440 × 1340 | EXTRACTED |
| Upload Material – Selector | Mobile | `43:9947` | 393 × 1397 | EXTRACTED |
| Assignment Output | Desktop | `43:9771` | 1440 × 1715 | EXTRACTED |
| Assignment Output | Mobile | `43:10103` | 393 × 2821 | EXTRACTED |

Breakpoints:
- **Desktop reference width:** 1440 px (design canvas). Build a fluid layout that
  matches this exactly at 1440 and scales gracefully down to ~1024.
- **Mobile reference width:** 393 px (iPhone 14/15 viewport). Build fluid from
  320 → 430.
- **Tablet:** Not in Figma. Use sensible interpolation between the two; do not
  introduce new visual idioms.

---

## 1. Design tokens

These are the canonical variables defined in the Figma file. Use them as
CSS custom properties / Tailwind theme tokens. **Do not** introduce additional
colors, font sizes, or shadow definitions without user approval.

### 1.1 Colors

| Token name (Figma) | Hex | Usage |
|---|---|---|
| `Neutrals/White` / `Background/white` | `#FFFFFF` | Default surface |
| `Background/bg-off white primary` | `#F6F6F6` | Off-white surface (badges, avatar bg) |
| `Background/bg-off white 20%` | `#F0F0F0` | Subtle hover/selected row bg |
| `Background/bg-off white 50%` | `#CECECE` | Mobile 0-state page bg |
| `Main/Navy blue` | `#011625` | Navy accent (illustration title bars) |
| `Main/Light Navy Blue` | `#417BA4` | Accent — light navy |
| `Main/Red` | `#FF4040` | Destructive accent |
| `Text/Primary` | `#303030` | Default body / headings |
| `Text/Secondary Default` / `Background/bg-dark` | `#5E5E5E` | Secondary body text |
| `Background/disabled` | `#A9A9A9` | Disabled state |
| `Neutrals/Grey 2` | `#D4D4D4` | Illustration text bars / light divider |
| `Neutrals/Grey 3` | `#E1DCEB` | – |
| `Neutrals/Grey 4` | `#CCC6D9` | – |
| `Buttons/Buttons Primary` | `#181818` | Primary dark CTA fill |
| `Buttons/primary - Orange` | `#FF5623` | Primary orange CTA fill |
| `iOS/Chrome/Bars Background Dark` | `#353739` | Mobile address bar bg |
| `M3/sys/light/on-surface` | `#1D1B20` | – |

Frequently used compositional colors observed in components but not in token
list — keep these as project-local constants until promoted:

- `rgba(94, 94, 94, 0.8)` — secondary text in the sidebar
- `rgba(94, 94, 94, 0.55)` — sub-heading muted
- `rgba(0, 0, 0, 0.5)` — meta info (assigned/due)
- `rgba(0, 0, 0, 0.2)` — input border
- `rgba(255, 255, 255, 0.5)` — primary dark button border
- `rgba(255, 255, 255, 0.25)` — bottom-nav inactive icon/text (mobile)
- `rgba(255, 255, 255, 0.75)` — desktop top-bar bg (frosted)
- Gradient `linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)` — desktop page background
- Logo gradient `linear-gradient(180deg, #E56820 0%, #D45E3E 100%)`
- "Create Assignment" pill stroke `#FF7950` / fill `#272727`
- Delete option text `#C53535`

### 1.2 Typography

**Font family:** `Bricolage Grotesque` (all weights). Apply
`font-variation-settings: 'opsz' 14, 'wdth' 100` globally on text nodes.
Status-bar text (mobile) uses `SF Pro Text` (Regular & Semibold) but this is
the iOS browser chrome mock — **do not** ship SF Pro in real builds; let
the OS render it.

| Token | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|
| Heading XL — VedaAI logotype | Bold 700 | 28 px | 20 px | −1.68 px |
| Page title (Assignments) / Card title | ExtraBold 800 | 24 px | 1.2 | −0.96 px |
| Section / empty-state heading (`P-1`) | Bold 700 | 20 px | 1.4 | −0.8 px |
| Body (`P-3`) — primary regular | Regular 400 | 16 px | 1.4 | −0.64 px |
| Body bold / link bold (`P-3`) | Bold 700 | 16 px | 1.4 | −0.64 px |
| Body medium (`P-3`) | Medium 500 | 16 px | 1.4 | −0.64 px |
| Card meta — assigned/due | Regular 400 | 16 px | 1.2 | −0.64 px |
| Sidebar item label | Regular 400 | 16 px | 1.4 | −0.64 px |
| Secondary description (`P-4`) | Regular 400 | 14 px | 1.4 | −0.56 px |
| Filter / search placeholder | Bold 700 | 14 px | 1.4 | −0.56 px |
| Tab caption (mobile bottom nav, `P-5`) | SemiBold 600 | 12 px | 1.4 | −0.48 px |

Notes:
- Figma reports `letterSpacing: -4` (percent). Pre-computed px values above
  assume the size shown — use percent-based letter-spacing in CSS if your
  framework supports it.
- All paragraph styles share `line-height: 1.4`, except the card title
  (`24 px`, lh `1.2`) and the meta line (lh `1.2`).

### 1.3 Spacing scale (observed)

The design does not declare a discrete scale, but actual values used are:
`2, 4, 8, 10, 12, 13, 16, 18, 20, 24, 32, 40, 48, 56, 64, 90`.
Treat these as the allowed gap/padding values.

### 1.4 Radii

`8, 10, 12, 15, 16, 20, 24, 26, 100, 48 (button pill)`.

### 1.5 Shadows / effects

- **Card shadow (white-on-page):** `drop-shadow(0px 16px 24px rgba(0,0,0,0.12)) drop-shadow(0px 32px 24px rgba(0,0,0,0.2))`
- **"Realistic shadow":** `0px 16px 48px rgba(0,0,0,0.12), 0px 32px 48px rgba(0,0,0,0.2)`
- **Sidebar shadow:** same as card shadow
- **Illustration page shadow:** `0px 20px 30px rgba(146,146,146,0.19)`
- **Background blur (mobile address bar):** `backdrop-filter: blur(13.591px)`
- **Glass blur token:** radius 8

---

## 2. Shared layout shell (Desktop)

The Desktop screens share an identical chrome of **sidebar + top bar**.
Layout uses absolute positioning over a gradient background.

### 2.1 Page

- Width: `1440 px`. Min-height varies per screen.
- Background: `linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)`.
- All screens use `position: relative` as the canvas with absolutely-placed
  shell elements.

### 2.2 Sidebar (`Side Bar` — node `43:9718` on 0-State, `43:9646` on Filled)

- Position: `top: 12px; left: 12px;`
- Size: `304 × 756 px` (height matches inner content of the page).
- Background: `#FFFFFF`
- Padding: `24 px` all sides
- Border radius: `16 px`
- Shadow: card shadow (see 1.5)
- Layout: `flex-col`, `justify-between`, `align-items: center`
- Inner content width: `251 px` (centered)

Inner stack (top group, gap `56 px` between blocks):

1. **Brand row** (`flex`, `align-items: center`, full width):
   - Logo tile: `40 × 40 px`, radius `15 px`. Inner background `radius 10 px`
     gradient `#E56820 → #D45E3E`. Glyph (group) inset from edges.
   - Brand text "VedaAI": Bricolage **Bold**, `28 px`, color `#303030`,
     letter-spacing `−1.68 px`, line-height `20 px`. Inline-flex, gap `8 px`
     between logo and text.

2. **Active CTA pill — "Create Assignment"** (`43:9730`):
   - Height: `42 px`. Width: fill (`flex: 1`).
   - Padding: `8 px 43 px`.
   - Radius: `100 px` (pill).
   - Border: `4 px solid #FF7950` (outside) + inner fill `#272727`.
   - Inner glow shadow: `inset 0 -1px 3.5px rgba(177,177,177,0.6), inset 0 0 34.5px rgba(255,255,255,0.25)`.
   - Drop shadow: realistic white shadow
     `drop-shadow(0 16px 24px rgba(255,255,255,0.12)) drop-shadow(0 32px 24px rgba(255,255,255,0.2))`.
   - Icon: `18.316 × 17.316 px`.
   - Label: Inter **Medium** `16 px`, white, line-height `28 px`,
     letter-spacing `−0.64 px`. (Note: this single label uses Inter, not
     Bricolage. Everything else is Bricolage.)
   - Gap (icon ↔ label): `10 px`.

3. **Menu list** (`gap: 8 px`, width `251 px`). Each row is `width: 254 px`
   (slight overhang of 3 px), `padding: 8 px 12 px`, `gap: 8 px`,
   icon `20 × 20 px`, label Bricolage **Regular** `16 px`,
   color `rgba(94,94,94,0.8)` by default, `#303030` when selected.
   - **Home** (active by default in 0-State): `height: 40 px`,
     `padding: 9 px 12 px`, radius `8 px`.
   - **My Groups**
   - **Assignments** (selected in design): background `#F0F0F0`,
     radius `8 px`, label color `#303030`, label weight Medium 500.
   - **AI Teacher's Toolkit**
   - **My Library** (icon `Credit Report`)

Bottom group (gap `8 px`, full width):

4. **Settings** row — same pattern as above, label "Settings".
5. **Profile card** (`43:9750`):
   - Background `#F0F0F0`, padding `12 px`, radius `16 px`, full width.
   - Avatar `59 × 56 px` (image asset).
   - Gap `8 px`.
   - Title "Delhi Public School" — Bricolage **Bold** `16 px`,
     color `#303030`, lh `1.4`, ls `−0.64 px`.
   - Subtitle "Bokaro Steel City" — Bricolage **Regular** `14 px`,
     color `#5E5E5E`, lh `1.4`, ls `−0.56 px`.

### 2.3 Top bar (`43:9756`)

- Position: `top: 12px; left: 327px;`
- Size: `1100 × 56 px`
- Background: `rgba(255,255,255,0.75)` (frosted)
- Padding: `0 12px 0 24px`
- Radius: `16 px`
- Layout: horizontal flex, `align-items: center`, `gap: 10 px`,
  `overflow: clip`.

Children left → right:

1. **Back button container** `40 px` wide:
   - White circle `40 × 40 px`, radius `100 px`.
   - Inside: `Arrow_Left` icon, `24 × 24 px` (inset `16.67% 8.33%`).
2. **Breadcrumb / page label** (`flex: 1`, `gap: 8 px`):
   - Icon `20 × 20 px` (dots/grid icon).
   - Text "Assignment" — Bricolage **SemiBold** `16 px`, color `#A9A9A9`,
     ls `−0.64 px`. (When active, color changes to `#303030`.)
3. **Notification button** `36 × 36 px`, radius `100 px`, background `#F6F6F6`:
   - Bell icon `24 × 24 px`.
   - Red dot indicator at `top: 1px; left: 27px`, size `8 × 8 px`.
4. **Profile pill** (`43:9766`):
   - Padding `6 px 12 px`, radius `12 px`, gap `8 px`.
   - Card shadow.
   - Avatar `32 × 32 px`, radius `100 px`, background `#F6F6F6`.
   - Name "John Doe" — Bricolage **SemiBold** `16 px`, color `#303030`,
     ls `−0.64 px`.
   - Chevron-down icon `24 × 24 px`.

### 2.4 Main content area

For all desktop screens:
- Left: `327 px`
- Top: `90 px` (i.e. `12 + 56 + 22` — sits below the top bar with 22 px gap)
- Width: `1100 px`
- Height: per-screen

The top bar therefore overlaps the gradient (`top: 12 → 68 px`), and the
main content starts below at `90 px`.

---

## 3. Screen 1 — 0-State (Desktop) ✓ EXTRACTED

**Frame:** `43:9707` · `1440 × 780 px` · background gradient (see 1.5).

### 3.1 Layout

Shell as in section 2. Main content area positioned at `left: 327; top: 90; width: 1100; height: 678`.

Inner column (`43:9708`):
- `display: flex; flex-direction: column; align-items: center; justify-content: center;`
- `isolation: isolate; height: 678 px; width: 1100 px;`

### 3.2 Content stack (centered, `gap: 32 px`)

1. **Illustration + copy block** (`43:9710`, `gap: 12 px`, `align-items: center`)

   a. **Illustration** (`Illustrations` component, `43:9711` / `43:9105`)
      - Size: `300 × 300 px`, `overflow: clip; position: relative;`
      - Inner background image: `240 × 240 px`, centered.
      - Floating "Page" card (centered, shifted up):
        - `124.537 × 155.029 px`, white, radius `16 px`,
          shadow `0 20px 30px rgba(146,146,146,0.19)`.
        - Inside: column of 5 bars, `gap: 18 px`, `width: 100 px`, `height: 121 px`:
          - Bar 1 — title: bg `#011625`, radius `100 px`, `width: 50 px`.
          - Bars 2-5 — text lines: bg `#D4D4D4`, radius `100 px`, full width.
      - Floating cloud illustration: `70.219 × 40.389 px`, offset right-up.
      - Floating lens illustration: `163.108 × 163.165 px`, offset right-down.
      - Doodles overlay: `284 × 178.654 px`, centered.

   b. **Text block** (`43:9712`, `gap: 2 px`, centered, `width: 486 px`):
      - **H2** "No assignments yet" — Bricolage **Bold** `20 px`,
        color `#303030`, ls `−0.8 px`, lh `1.4`, `text-align: center`.
      - **Body** "Create your first assignment to start collecting and grading
        student submissions. You can set up rubrics, define marking criteria,
        and let AI assist with grading." — Bricolage **Regular** `16 px`,
        color `rgba(94,94,94,0.8)`, ls `−0.64 px`, lh `1.4`,
        `text-align: center`.

2. **Primary Button — Dark** (`43:9715`)
   - Background `#181818`
   - Border `1.5 px solid rgba(255,255,255,0.5)`
   - Padding `12 px 24 px`
   - Radius `48 px` (pill)
   - Gap (icon ↔ label) `4 px`
   - Icon `Plus` `20 × 20 px`
   - Label "Create Your First Assignment" — Bricolage **Medium** `16 px`,
     white, ls `−0.64 px`, lh `1.4`.

---

## 4. Screen 1 — 0-State (Mobile) ✓ EXTRACTED

**Frame:** `43:9862` · `393 × 857 px` · background `#CECECE`.

### 4.1 Mobile chrome (NOT to ship in production — Figma artifact)

The Figma mock includes browser/OS chrome at top (`43:9874`, height `105 px`):
- Background `#353739`, backdrop-filter blur `13.591 px`.
- iOS status bar at top `44 px` (time `9:41`, signal/wifi/battery glyphs).
- Address bar at bottom of chrome: `40 px` tall, side margins `10 px`, with
  domain `web-to-figma.design`.
- **Production:** rely on the device's native browser chrome. Render the
  in-app content starting from y = `105 px` only on a layout that mimics
  the embed; for a real PWA, start from `0`.

### 4.2 App top bar (`43:9932`)

- Position: `top: 105 px; left: 0;` size `393 × 81 px`.
- Backdrop blur 0, background `rgba(255,255,255,0.01)`.
- Padding `18 px 20 px`.
- Inner pill (`43:9933`):
  - White, radius `16 px`, height `56 px`, width `373 px`.
  - Padding `0 16px 0 12px`.
  - Left group (gap `8 px`):
    - Logo `28 × 28 px` (smaller variant).
    - Brand "VedaAI" — Bricolage **Bold** `20 px`, color `#303030`,
      ls `−1.2 px`, lh `1.4`.
  - Right group (gap `12 px`):
    - Notification circle `36 × 36 px`, bg `#F6F6F6`, radius `100 px`,
      bell icon `24 × 24 px` + red dot `8 × 8 px`.
    - Avatar `32 × 32 px`, radius `100 px`, bg `#F6F6F6`, image fill.
    - Menu icon `24 × 24 px`.

### 4.3 Hero content (`43:9863`)

Centered horizontally and vertically (`top: calc(50% + 4 px)`).
Width `373 px`, height `657 px`, `flex-col`, `gap: 32 px`, centered.

1. **Illustration + copy** (`43:9864`, `gap: 12 px`)
   - **Illustration** — same composition as Desktop but scaled down:
     - Outer `220 × 220 px`.
     - Background `176 × 176 px`.
     - Page card `91.327 × 113.688 px`, radius `16 px`,
       shadow `0 14.667px 22px rgba(146,146,146,0.19)`.
     - Inner bars: `73.333 × 88.733 px`, `gap: 13.2 px`, title bar `36.667 × ...`.
     - Cloud `51.494 × 29.619 px`.
     - Lens `119.613 × 119.655 px`.
     - Doodles `208.267 × 131.013 px`.
   - **Text block** (`gap: 12 px`, centered, full width):
     - H2 "No assignments yet" — same as desktop (`20 px` Bold).
     - Body — same copy & style (`16 px` Regular).

2. **Primary Button — Dark** (`43:9869`) — identical spec to Desktop
   (`#181818`, border `1.5 px rgba(255,255,255,0.5)`, padding `12 px 24 px`,
   radius `48 px`, label "Create Your First Assignment").

### 4.4 Floating Plus FAB (`43:9907`)

- Position: above bottom nav, right-aligned in container.
- White circle, `48 × 48 px`, radius `100 px`, card shadow.
- Icon `Plus` `20 × 20 px`.

### 4.5 Bottom navigation (`43:9909`)

- Bottom-anchored. Width `373 px`, height `72 px`, padding `8 px 24 px`,
  radius `24 px`, background `#181818`, card shadow.
- Layout: `flex; align-items: center; justify-content: space-between`.
- Wrapper around the bar: `gap: 13 px` to the FAB above and `bottom: 11 px` offset.
- 4 tab items, each `52 × 52 px`, `flex-col; align-items: center; gap: 4 px`,
  padding `13 px`, radius `26 px`:
  - **Home** (inactive): 4-square dot grid `18 × 18 px`, label "Home".
  - **Assignments** (active): calendar icon `20 × 20 px`, white label.
  - **Library** (inactive): file-text-plus icon, label "Library".
  - **AI Toolkit** (inactive): mini logo `20 × 20 px`, label "AI Toolkit".
- Active label color: white. Inactive label/icon color: `rgba(255,255,255,0.25)`.
- Label style: Bricolage **SemiBold** `12 px`, ls `−0.48 px`, lh `1.4`.

### 4.6 Home indicator (`43:9872`)

- iOS-style indicator at bottom: `135 × 5 px`, bg `#DDDDDD`, radius `100 px`,
  centered, `bottom: 8 px`.

---

## 5. Screen 2 — Filled State (Desktop) ✓ PARTIAL — STRUCTURE EXTRACTED

**Frame:** `43:9429` · `1440 × 843 px` · gradient background.

Shell (sidebar + top bar) identical to section 2.

### 5.1 Decorative ellipse (`43:9430`)

- `1113 × 428 px`, positioned bottom-center under the cards.
- Inset `-93.46% -35.94%` — large blurry ellipse used as a glow behind cards.

### 5.2 Main content column (`43:9431`)

- Position: `top: 90 px; left: 327 px; width: 1100 px;`
- Layout: `flex-col; gap: 12 px; align-items: flex-start; justify-content: flex-end`.

#### 5.2.1 Section title row (`43:9432`)

- Padding `0 8 px`, full width.
- Left group (`gap: 12 px`):
  - Indicator dot `12 × 12 px` (gradient/illustration ellipse).
  - Title block (`gap: 2 px`, centered):
    - **H1** "Assignments" — Bricolage **Bold** `20 px`, color `#303030`,
      ls `−0.8 px`, lh `1.4`.
    - Sub "Manage and create assignments for your classes." — Bricolage
      **Regular** `14 px`, color `rgba(94,94,94,0.55)`, ls `−0.56 px`, lh `1.4`.

#### 5.2.2 Filter + Search bar (`43:9438`)

- White, height `64 px`, full width, radius `20 px`, padding `0 16 px`,
  `overflow: clip`. `justify-content: space-between`.
- **Left — Filter by:**
  - Gap `4 px`, icon-line/Filter `20 × 20 px`.
  - Label "Filter By" — Bricolage **Bold** `14 px`, color `#A9A9A9`,
    ls `−0.56 px`, lh `1.4`.
- **Right — Search:** width `380 px`.
  - Field: border `1 px solid rgba(0,0,0,0.2)`, height `44 px`,
    padding `11 px 16 px`, radius `100 px`, `flex: 1`.
  - Inner: gap `12 px`, search icon `20 × 20 px`, placeholder
    "Search Assignment" — Bricolage **Bold** `14 px`, color `#A9A9A9`,
    ls `−0.56 px`.

#### 5.2.3 Assignment cards grid (`43:9449`)

- Layout: `flex; gap: 16 px; align-items: flex-start`. The visible
  structure suggests **2 columns × N rows** of equal cards. The dump shows
  at least 12 `More-vertical` icons (`43:9460, 9480, 9495, 9513, 9528,
  9543, 9561, 9576, 9591, 9609, 9624, 9639`), implying **12 assignment
  cards** in the Filled State.
- Inner column (`43:9450`): `flex-[1_0_0]; gap: 12 px;`.
- Each card column wraps cards in `gap: 12 px; flex-col`.

**Per assignment card** (`43:9452 / 9472 / ...`):
- Outer wrapper `height: 162 px; width: 542 px;` `flex-col; justify-center`.
- Card (`43:9453`):
  - Background `#FFFFFF`, padding `24 px`, radius `24 px`, full width.
  - Inner content `flex-col; justify-between` — `width: 100%`.
- Top row (`43:9456`, `justify-between`):
  - Title block (`width: 418 px`):
    - Card title "Quiz on Electricity" — Bricolage **ExtraBold 800**
      `24 px`, color `#303030`, ls `−0.96 px`, lh `1.2`.
  - **More** icon-line/More-vertical `24 × 24 px`.
- Bottom row (`43:9461`, `justify-between`):
  - **Assigned on** label "Assigned on : 20-06-2025"
    - Bold prefix "Assigned on" — ExtraBold 800, color `#303030`, lh `1.2`,
      ls `−0.64 px`. Suffix " : 20-06-2025" — Regular 400,
      color `rgba(0,0,0,0.5)`, same `16 px`, lh `1.2`.
  - **Due** label "Due : 21-06-2025" — same composition.

#### 5.2.4 Card dropdown (`43:9467`, "Classes Dropdown")

Floating dropdown rendered on top-right of the first card at
`left: 346 px; top: 54 px;` (relative to the card column).
- Background white, padding `8 px`, radius `16 px`, card shadow,
  `gap: 4 px`, `flex-col; align-items: center; justify-center`.
- Row 1 — "View Assignment": height `32 px`, padding `0 8 px`, radius `8 px`,
  full width. Label Bricolage **Medium** `14 px`, color `#303030`,
  ls `−0.56 px`, lh `1.4`.
- Row 2 — "Delete": same dimensions, background `#F6F6F6`, radius `8 px`,
  label color `#C53535` (destructive).

> **NOTE:** Detailed sub-bounds of cards 2–12 were not individually verified
> in this pass — they are documented as identical instances of card 1. If the
> Figma file diverges per card, re-extract.

---

## 6. Screen 2 — Filled State (Mobile) ✓ EXTRACTED

**Frame:** `43:10200` · `393 × 1125 px` · background `#CECECE`.

### 6.1 Mobile chrome (same as 0-State Mobile)

- iOS status / address bar `0, 0 → 393 × 105 px`, bg `#353739`, backdrop-blur 27.18 (see section 4.1).
- App top bar (section 4.2) `0, 105 → 393 × 81 px`, pill `373 × 56 px`, white, radius 16, VedaAI 20px Bold + notif/avatar/menu.
- Bottom area at `0, 968 → 393 × 157 px` (Group `1321314519`) — backdrop-blur 24:
  - Floating Plus FAB row `373 × 48` at `(10, 968)`, justify-flex-end. FAB `48 × 48` white, radius 100, card shadow, Plus icon `20 × 20` orange `#FF5623`.
  - Bottom nav bar `373 × 72` at `(10, 1029)` — identical spec to section 4.5 (bg `#181818`, radius 24, 4 tabs). **Active tab in this screen is "Assignments"** (white label + filled calendar icon).
  - Home indicator line `128 × 0` stroke 5 `#303030` at `(132.5, 1114)`.

### 6.2 Main content (`43:10201`, `Frame 1984077582`)

- Position: `(10, 190)` · size `373 × 816 px`
- Layout: `flex-col; gap: 24 px; align-items: center;`

#### 6.2.1 Header row (`Frame 1984077583`, `373 × 48 px`)

- `flex-row; gap: 24; justify-content: space-between; align-items: center`.
- Left — **Back button** `48 × 48 px`, white, radius 100, backdrop-blur 24. Arrow-left icon `24 × 24` with vector `14 × 14` stroke `2.5 px CENTER #303030`.
- Right — **Title** "Assignments" — centered in a `373 × 22` row:
  - Bricolage Grotesque **Bold 700**, `16 px`, lh `22.4 px`, ls `−0.64`, color `#303030`.

#### 6.2.2 Inner column (`Frame 1984077577`, `373 × 744`)

- `flex-col; gap: 20 px; align-items: flex-start.`
- Starts at `(10, 262)`.

##### Filter + Search bar (`Default`, `373 × 64 px`)

- White, radius `16 px`, padding `0 16 px`, `justify-content: space-between`.
- **Left — Filter** (`gap: 4 px`):
  - Filter icon `20 × 20 px` (vector stroke 15×15 `#A9A9A9`).
  - "Filter" — Bricolage **Regular** `14 px`, lh `19.6`, ls `−0.56`, color `#A9A9A9`.
- **Right — Search field** `228 × 44 px`:
  - Border `1 px solid #000000` (inside), radius `100 px`, padding `11 px 16 px`, `gap: 10 px`.
  - Inner gap `12 px`: search icon `20 × 20` (group 16.67×16.67 `#A9A9A9`) + placeholder "Search Name" Bricolage **Regular** `14 px` `#A9A9A9`.

##### Assignment card list (6 identical cards at gap `12 px`)

Each card (`Frame 40026`):
- Width `373 px`, height `116 px`, padding `20 px`, radius `24 px`, background `#FFFFFF`.
- Layout `flex-col; gap: 24 px; justify-content: center; align-items: flex-start`.
- Inner stack `Frame 1984077333` (`333 × 76`, `flex-col; gap: 32 px`):
  - **Title row** `333 × 25 px`, `justify-content: space-between; align-items: center`:
    - Title "Quiz on Electricity" — Bricolage **Bold 700**, `18 px`, lh `25.2 px`, ls `−0.72`, color `#303030`.
    - More-vertical icon `24 × 24 px` (3 dots `4 × 4 px` stacked at the right edge).
  - **Meta row** `182 × 19 px`, `gap: 10`:
    - "Assigned on : 20-06-2025" — Bricolage **Regular** `16 px`, lh `19.2 px`, ls `−0.64`, color `#000000`.
    - "Due : 21-06-2025" — same style, positioned `223, ...` (right-aligned within row).

(Card y-positions: `346, 482, 618, 754, 890` — 5 visible, but the JSON walks 6 frames; the 6th at `(10, ...)` is partially out of viewport / below the bottom nav.)

### 6.3 Home indicator (`393 × 34 px @ (0, 1091)`)

- Background row `393 × 34`.
- Indicator line `135 × 5 px`, bg `#DDDDDD`, radius `100 px`, centered at `(129, 1112)`.

---

## 7. Screen 3 — Upload Material – Selector (Desktop) ✓ EXTRACTED

**Frame:** `43:9259` · `1440 × 1340 px` · gradient background (`#EEEEEE → #DADADA`).

Shell — Sidebar (section 2.2, with extra menu items as noted in 7.5) and Top
bar (section 2.3, but page-label text is just "Assignment") — identical to
the other desktop screens.

### 7.1 Decorative glow

- Ellipse `1113 × 428 px` at `(327, 1167)`, fill `#4C4C4C`, **layer blur radius 400 px** — large soft halo behind the lower content area.

### 7.2 Outer card wrapper (`Frame 1984077325`)

- Position: `(327, 78)` · size `1103 × 1262 px`.
- Layout: `flex-col; gap: 32 px; align-items: center;`
- Radius: `40 px` (no fill — this is a structural wrapper).

### 7.3 Step-indicator header (`Frame 1984077332`, `1103 × 66 px`)

- Padding: `8 px` all sides.
- Layout: `flex-row; gap: 16 px; align-items: center.`
- Inner group `293 × 50 px` (`flex-row; gap: 12`):
  - **Step dot** — ellipse `12 × 12 px`, fill `#4BC26D`, stroke `4 px OUTSIDE #4BC26D` (creates a 20×20 outer halo), card-shadow.
  - **Text block** (`261 × 50 px`, col, `gap: 2`):
    - Title "Create Assignment" — Bricolage **Bold 700**, `20 px`, lh `28 px`, ls `−0.80`, color `#303030`, align center.
    - Sub "Set up a new assignment for your students" — Bricolage **Regular** `14 px`, lh `19.6 px`, ls `−0.56`, color `#5E5E5E`, align center.

### 7.4 Step connectors (`Frame 1984077364`, `1103 × 0 @ (327, 176)`)

- Wrapper row `815 × 0` (col, gap 10) at `(471, 176)`.
- Two horizontal connectors, each `401.5 px` wide, **stroke `5 px CENTER`** with `gap: 12 px` between them:
  - Connector 1 (active) — `#5E5E5E`.
  - Connector 2 (inactive) — `#DADADA`.

(They render as horizontal lines under the step dot.)

### 7.5 Form panel (`Frame 1984077359`)

- Position: `(473.5, 208)` · size `810 × 1010 px`.
- Background `#FFFFFF`, radius `32 px`, padding `32 px` all sides.
- Layout: `flex-col; gap: 32 px; align-items: flex-start.`

#### 7.5.1 Panel header (`251 × 50 px`)

- `flex-col; gap: 2 px.`
- "Assignment Details" — Bricolage **Bold 700** `20 px`, lh `28 px`, ls `−0.80`, color `#303030`.
- "Basic information about your assignment" — Bricolage **Regular** `14 px`, lh `19.6 px`, ls `−0.56`, color `#5E5E5E`.

#### 7.5.2 Form body (`Frame 1984077364`, `746 × 864 px`)

`flex-col; gap: 16 px.`

##### A. Upload dropzone block (`746 × 236 px`, `flex-col; gap: 12`)

**Dropzone card** (`746 × 202 px`, white, **stroke `1.75 px INSIDE #000000`**, radius `24 px`, padding `24 px 32 px`, `flex-col; gap: 16; align-items: center; justify-content: center`):
1. **Cloud icon tile** `40 × 40 px`, white, radius `8 px`. Upload-cloud icon `24 × 24`, inner vector `22 × 18`, stroke `2.5 px CENTER #1E1E1E`.
2. **Text block** (`682 × 46 px`, col, `gap: 4`):
   - "Choose a file or drag & drop it here" — Bricolage **Medium 500** `16 px`, lh `22.4 px`, ls `−0.64`, color `#303030`, align center.
   - "JPEG, PNG, upto 10MB" — Bricolage **Regular** `14 px`, lh `19.6 px`, ls `−0.56`, color `#A9A9A9`, align center.
3. **"Browse Files" button** (`127 × 36 px`): bg `#F6F6F6`, radius `48 px`, padding `8 px 24 px`, gap `4`. Label Bricolage **Medium** `14 px` `#303030` + arrow-right icon `16 × 16`.

Caption under the dropzone: "Upload images of your preferred document/image" — Bricolage **Medium** `16 px`, lh `22.4`, ls `−0.64`, color `#303030`, align center.

##### B. Due Date field (`746 × 74 px`, `flex-col; gap: 8`)

- Label "Due Date" — Bricolage **Bold 700** `16 px`, lh `22.4`, ls `−0.64`, color `#303030`.
- Field `746 × 44 px`: stroke `1.25 px INSIDE #DADADA`, radius `100 px`, padding `11 px 16 px`, `justify-content: space-between`.
  - Placeholder "DD-MM-YYYY" — Bricolage **Medium** `16 px`, ls `−0.64`, color `#A9A9A9`.
  - Calendar-plus icon `24 × 24 px` (vectors filled `#2B2B2B`).

##### C. Question Type + Stepper block (`746 × 374 px`)

Top sub-row `Frame 1984077498` (`746 × 314`, `flex-row; gap: 64; justify: space-between; align: flex-start`):

**Left column** (`471 × 314`, `flex-col; gap: 16`):
- Label "Question Type" — Bricolage **Bold 700** `16 px`, ls `−0.64`, `#303030`.
- 4 selector rows (each `471 × 44 px`, gap `12 px` between rows, gap `8` inside row):
  - Each selector pill (`443 × 44 px`): bg `#FFFFFF`, radius `100 px`, padding `11 px 16 px`, `justify-content: space-between; gap: 128 px`.
    - Label Bricolage **Medium** `16 px` `#303030`. Values: "Multiple Choice Questions", "Short Questions", "Diagram/Graph-Based Questions", "Numerical Problems".
    - Chevron-down icon `16 × 16` (vector 8×4, stroke `1.5 CENTER #303030`).
  - Trailing **X** icon `16 × 16` outside the pill (deletes the row).
- **Add Question Type** row (`164 × 36`, `flex-row; gap: 8; align: center`):
  - Plus button `36 × 36 px`, bg `#2B2B2B`, radius `48 px`, padding `8`; white plus icon `20 × 20`.
  - Label "Add Question Type" — Bricolage **Bold** `14 px`, lh `19.6`, ls `−0.56`, `#303030`.

**Right block** (`275 × 262`, `flex-row; gap: 16; justify: flex-end; align: center`) — two columns:

- **No. of Questions** column (`116 × 262`, `flex-col; gap: 16; align: center`):
  - Heading "No. of Questions" — Bricolage **Medium** `16 px`, ls `−0.64`, `#303030`, align center.
  - 4 stepper rows (`100 × 44 px`), each:
    - bg `#FFFFFF`, radius `100 px`, padding `11 px 8 px`, `justify-content: space-between`.
    - Minus icon `16 × 16` (vector `12 × 1.33` `#DADADA`).
    - Numeric value (varies: `4, 3, 5, 5`) — Bricolage **Medium** `16 px` `#303030`.
    - Plus icon `16 × 16` (vector `9.33 × 9.33`, stroke `1.5 CENTER #DADADA`).
- **Marks** column (`100 × 262`, same pattern). Values shown: `1, 2, 5, 5`.

Bottom sub-row at `(1101.5, 994)` — totals (right-aligned, `flex-col; gap: 8`):
- "Total Questions :  25" — Bricolage **Medium** `16 px`, lh `17.6`, ls `−0.64`, `#303030`, align right.
- "Total Marks :  60" — same style.

##### D. Additional Information block (`746 × 132 px`, `flex-col; gap: 8`)

- Label "Additional Information (For better output)" — Bricolage **Bold 700** `16 px`, ls `−0.64`, `#303030`.
- Textarea (`746 × 102 px`): white, **stroke `1.25 px INSIDE #DADADA`**, radius `16 px`, padding `16 px`, `flex-col; gap: 10; justify: space-between; align: flex-end`.
  - Placeholder "e.g Generate a question paper for 3 hour exam duration..." — Bricolage **Medium** `14 px`, lh `19.6`, ls `−0.56`, `#303030`.
  - Mic button `36 × 36 px`, bg `#F0F0F0`, radius `18 px`. Mic icon `16.36 × 16.36`, drop-shadow `0 21.82px 32.73px rgba(0,0,0,0.2), 0 10.91px 32.73px rgba(0,0,0,0.12)`.

### 7.6 Action row (`Frame 1984077363`, `810 × 46 px @ (473.5, 1250)`)

- `flex-row; gap: 44; justify: space-between; align: center`.
- **Previous button** (`134 × 46 px`): bg `#FFFFFF`, radius `48 px`, padding `12 px 24 px`, `gap: 4; align: center`. Arrow-left icon `20 × 20` + label "Previous" Bricolage **Medium** `16 px`, lh `22.4`, `#303030`.
- **Next button** (`106 × 46 px`): bg `#181818`, radius `48 px`, same padding/gap. Label "Next" Bricolage **Medium** `16 px` `#FFFFFF` + arrow-right icon `20 × 20` (vector fill `#FFFFFF`).

### 7.7 Sidebar variations for this screen

The Upload Selector sidebar (`43:9259` at `(12, 12)`, height **`744 px`** rather than `756`) keeps the same `304 × 744 px` card layout (radius 16, padding 24, card shadow, `flex-col; gap: 32; justify: space-between; align: center`). The menu list expands to include two more items, all in **Regular 400 16 px #5E5E5E** unless noted:

- Home · My Groups · Assignments · AI Teacher's Toolkit
- **My Library** — has trailing badge `Frame 41` (`37 × 20`, bg `#FF5623`, radius `8 px`, padding `0 10`, inner shadow `0 0 32.3 rgba(255,161,10,0.25)`) showing count "**32**" in Bricolage **SemiBold 600** `14 px` `#FFFFFF`, ls `−0.56`.
- **Review** — icon `icon_line/file-text_plus`.
- **Analytics** — icon `icon_line/Bar-chart_up`.

The active "Create Assignment" pill remains identical (section 2.2 #2).

---

## 8. Screen 3 — Upload Material – Selector (Mobile) ✓ EXTRACTED

**Frame:** `43:9947` · `393 × 1397 px` · background `#CECECE`.

### 8.1 Mobile chrome

- iOS status / address bar at top `0, 0 → 393 × 105 px` (identical to section 4.1).
- App top bar `0, 105 → 393 × 81 px` (white pill, section 4.2).
- Bottom action / nav block `Frame 1984077606` at `(0, 1239)`, size `393 × 158 px`, bg `#FFFFFF`, backdrop-blur 24, padding `8 px 10 px`, `flex-col; gap: 12; justify: center; align: center` — contains both the action buttons row **and** the bottom tab bar.

### 8.2 Main content (`Frame 1984077582`)

- Position: `(10, 190)` · size `373 × 1040 px`.
- Padding: `0 12 px`.
- Layout: `flex-col; gap: 24 px; align-items: center.`

#### 8.2.1 Header row (`Frame 1984077583`, `349 × 48 px`)

- `flex-row; gap: 24; justify: space-between; align: center`.
- **Back button** `48 × 48 px`, white, radius `100 px`, backdrop-blur 24. Arrow-left `24 × 24`, vector `14 × 14`, stroke `2.5 CENTER #303030`.
- **Title** "Create Assignment" — Bricolage **Bold 700**, `16 px`, lh `22.4`, ls `−0.64`, color `#303030`, align center, in a `349 × 22 px` row.

#### 8.2.2 Step connectors (`Frame 1984077364 @ (22, 262)`, `349 × 0`)

- Two horizontal connectors, each `168.5 px × 0` (stroke `5 px CENTER`), gap `12 px`:
  - Active `#5E5E5E`, inactive `#DADADA`.

#### 8.2.3 Form panel (`Frame 1984077584`, `349 × 944 px @ (22, 286)`)

- bg `#FFFFFF`, radius `32 px`, padding `32 px 16 px`, `flex-col; gap: 24; align: flex-start.`

##### Panel header (`251 × 50 px @ (38, 318)`)

Same as Desktop §7.5.1: "Assignment Details" (Bricolage Bold 20 px) + sub (Regular 14 px #5E5E5E).

##### Form body (`317 × 806 px @ (38, 392)`, `flex-col; gap: 16`)

**A. Upload dropzone block** (`317 × 258 px`, `gap: 12`):

- Dropzone (`317 × 202 px`): bg **`#F6F6F6`** (note: lighter on mobile vs white on desktop), **stroke `1.75 px INSIDE #000000`**, radius `24 px`, padding `24 px 32 px`, `flex-col; gap: 16; justify: center; align: center`.
  - Cloud icon tile `40 × 40 px`, white, radius `8 px`, upload-cloud icon.
  - Text block (`253 × 46 px`):
    - "Choose a file or drag & drop it here" — Medium `16 px` `#303030` center.
    - "JPEG, PNG, upto 10MB" — Regular `14 px` `#A9A9A9` center.
  - **Browse Files** button (`127 × 36 px`): bg **`#FFFFFF`**, radius `48 px`, padding `8 px 24 px`. Label Medium `14 px` `#303030`.
- Caption "Upload images of your preferred document/image" — Medium `16 px`, lh `22.4`, ls `−0.64`, `#303030`, align center (wraps to 2 lines, `317 × 44 px`).

**B. Due Date field** (`317 × 74 px`, `gap: 8`)

- Label "Due Date" — Bold `16 px` `#303030`.
- Field `317 × 44 px`: stroke `1.25 INSIDE #DADADA`, radius `100`, padding `11 px 16 px`, `justify: space-between`. Placeholder "DD-MM-YYYY" `#A9A9A9`, calendar icon `24 × 24`.

**C. Question Type stacked cards** (`317 × 442 px`, `flex-col; gap: 16`)

- Label "Question Type" — Bold `16 px` `#303030`.
- 2 cards × (`317 × 138 px`), bg `#FFFFFF`, radius `24 px`, padding `12 px`, `flex-col; gap: 12; justify: center; align: flex-end`:

  **Per card layout:**
  - Top row `293 × 20 px` (`justify: space-between`):
    - Left group (`201 × 20`, gap 24): question-type name **Medium 14 px** `#303030` (e.g. "Multiple Choice Questions", "Short Questions") + chevron-down `16 × 16`.
    - Trailing X icon `16 × 16` (delete).
  - Stepper row `293 × 82 px`: bg `#F0F0F0`, radius `24 px`, padding `8 px`, `gap: 12`.
    - Two sub-cells (`132.5 × 66 px`, col, gap 8, align center):
      - **No. of Questions** label Medium `14 px` `#303030` center + stepper (`132.5 × 38 px`, white, radius 100, padding 8, justify: space-between, gap 128): minus icon `16 × 16` (`#5E5E5E`) | value Medium `16 px` `#303030` | plus icon `16 × 16` (`#5E5E5E`).
      - **Marks** label + stepper (same spec).

- **Add Question Type** row (`164 × 36 px @ (38, 1102)`) — same spec as Desktop §7.5.2 C bottom.
- **Totals** at `(205, 1154)`, right-aligned col, gap 8:
  - "Total Questions :  25" — Medium `16 px`, lh `17.6`, `#303030`, align right.
  - "Total Marks :  60" — same.

### 8.3 Bottom action + nav block (`Frame 1984077606`)

Layered group at `(0, 1239)`, `393 × 158 px`, bg `#FFFFFF`, backdrop-blur 24, padding `8 px 10 px`:

- **Action row** (`253 × 46 px @ (70, 1247)`, `flex-row; gap: 13; justify: flex-start`):
  - **Previous** button (`134 × 46 px`): bg `#FFFFFF`, radius `48 px`, padding `12 px 24 px`. Arrow-left `20 × 20` + Medium `16 px` `#303030`.
  - **Next** button (`106 × 46 px`): bg `#181818`, radius `48 px`, **card shadow**. Label "Next" Medium `16 px` `#FFFFFF` + arrow-right `20 × 20` white.
- **Bottom nav bar** (`373 × 72 px @ (10, 1305)`) — identical to section 4.5.
- Home indicator `128 × 0` stroke `5 px #303030` at `(132.5, 1389)`.

---

## 9. Screen 4 — Assignment Output (Desktop) ✓ EXTRACTED

**Frame:** `43:9771` · `1440 × 1715 px` — tallest desktop screen. Background `#E6E6E6` (flat, not gradient).

### 9.1 Shell variations

- **Sidebar** at `(12, 12)` — same `304 × 724 px` card, but with **two key differences from other desktop screens:**
  1. Logo tile is **`40 × 40 px`, radius `12 px`** (inner background `#303030`, radius `10 px`) — *flat dark*, not the orange gradient used on the other screens.
  2. The active CTA pill is labelled **"AI Teacher's Toolkit"** (not "Create Assignment"). Same `#272727` fill + outer/inner shadows.
  3. The active *menu* item is **"Home"** (`254 × 40 px`, bg `#F0F0F0`, radius `8 px`, padding `9 px 12 px`, label color `#303030` Medium 500 instead of `#5E5E5E` Regular).
- Menu list includes the same expanded items as Upload Selector: Home (active), My Groups, Assignments (with `FF5623` `32` badge — `radius 48 px` here, vs `radius 8 px` on the Upload Selector), AI Teacher's Toolkit, My Library (also with `32` badge `radius 8 px`), Review, Analytics.
- Profile card at bottom is `256 × 84 px` (slightly taller — avatar is `59 × 60` here vs `59 × 56` elsewhere).
- **Top bar** at `(327, 12)`, `1100 × 56 px`, white (fully opaque, not the frosted `rgba(255,255,255,0.75)` of other screens). Page label is **"Create New"** (Bricolage SemiBold `16 px` `#A9A9A9`) with a sparkle/star icon `18.32 × 17.32 px` (`#A9A9A9`).

### 9.2 Outer container (`Frame 1618872395`)

- Position: `(327, 82)` · size `1100 × 1681 px`.
- Background **`#5E5E5E`** (dark grey paper frame), radius `32 px`, padding `20 px`.
- Layout: `flex-col; gap: 12; align-items: center.`

### 9.3 Header card / "AI greeting" (`Frame 1618872450`, `1060 × 164 px @ (347, 102)`)

- Background `#181818`, radius `32 px`, padding `24 px 32 px`, `flex-col; gap: 24; justify: center; align: center.`
- Inner `996 × 116 px` (col, gap 16):
  - **Greeting text** — "Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:" — Bricolage **Bold 700**, `20 px`, lh `28 px`, ls `−0.80`, color `#FFFFFF`.
  - **Download as PDF button** (`200 × 44 px`, `flex-row; justify: center`):
    - Pill: bg `#FFFFFF`, radius `100 px`, padding `0 24 px`, `gap: 24; align: center`.
    - Inner row (`152 × 24 px`, `gap: 4`): download icon `24 × 24` (vector `17.19 × 19.19 #303030`) + label "Download as PDF" Bricolage **Medium 500** `16 px`, lh `22`, ls `−0.64`, color `#303030`.

### 9.4 Paper card (`Frame 1618872449`, `1060 × 1465 px @ (347, 278)`)

The actual question-paper render. Looks like a real printed exam paper.

- Background `#FFFFFF`, radius `32 px`, padding `32 px`, `flex-col; gap: 24; align: center.`
- All text inside this card uses **Inter** (not Bricolage) and is colored `#303030`.

**Typography for the paper:**

| Block | Spec |
|---|---|
| Title (school + subject + class) | Inter **SemiBold 600** `24 px`, lh `38.4 px` (1.6), ls `−0.96`, center |
| Time / Marks row, Compulsory line, Name/Roll/Class | Inter **SemiBold 600** `18 px`, lh `28.8 px` (1.6), ls `−0.72` |
| Section heading ("Section A") | Inter **SemiBold 600** `24 px`, lh `38.4`, ls `−0.96`, center |
| Section instructions | Inter **SemiBold 600** `18 px`, lh `28.8`, ls `−0.72` |
| Question body & answer key | Inter **Regular 400** `16 px`, lh **`38.4 px`** (very loose `2.4×` for handwriting feel), ls `−0.64` |

**Content layout** (each block is `996 px` wide):

1. Title block `996 × 124 px @ (379, 310)` — center: "Delhi Public School, Sector-4, Bokaro\nSubject: English\nClass: 5th".
2. Row `996 × 29 px @ (379, 458)` (justify: space-between, align: center):
   - "Time Allowed: 45 minutes" (left, w 209).
   - "Maximum Marks: 20" (right, w 165).
3. "All questions are compulsory unless stated otherwise." `996 × 29 px @ (379, 511)`.
4. **Student-info block** `996 × 87 px @ (379, 564)` (col, no gap):
   - "Name: ______________________" `230 × 29 px`.
   - "Roll Number: ________________" `232 × 29 px`.
   - "Class: 5th       Section: __________" `232 × 29 px`.
5. **Section heading** `996 × 38 px @ (379, 675)` center: "Section A".
6. **Section instructions** `996 × 55 px @ (379, 737)`:
   "Short Answer Questions\nAttempt all questions. Each question carries 2 marks".
7. **Question list + answer key** `996 × 1020 px @ (379, 816)`:
   - Each line begins with a difficulty tag in square brackets: `[Easy]`, `[Moderate]`, `[Challenging]`. (No coloured badge in this render — the tag is inline text in the same Inter 400 16 px style. Visual difficulty badges are a bonus task per `Assignment_Master.md`.)
   - Each line ends with `[2 Marks]`.
   - 10 questions, followed by `End of Question Paper`, then `Answer Key:` and 10 answer paragraphs.

> **Implementation note.** Treat this as the canonical *output* design. The
> `lh: 38.4 px` on the body text is intentional — it is what gives the paper
> that printed-question-paper feel. Do not collapse to a tighter line-height.

---

## 10. Screen 4 — Assignment Output (Mobile) ✓ EXTRACTED

**Frame:** `43:10103` · `393 × 2821 px` · background `#CECECE` — the full question paper renders inline as a single long scroll.

### 10.1 Mobile chrome

- iOS status / address bar `0, 0 → 393 × 105 px` (section 4.1).
- App top bar `Frame 1984077205` at `0, 105`, `393 × 81 px` — same brand pill as section 4.2.
- **Tab Bar iOS / X Chrome** at the bottom (`0, 2743 → 393 × 78 px`) — this is *iOS browser chrome*, NOT the app's bottom nav. Background `#353739` + backdrop-blur 27.18. 5 tab actions: Go Back, Go Forward, Add New Tab, Chrome Tabs, More Menu. **Do not** ship this as app UI — let the browser render it.
- Home indicator line `135 × 5 px`, bg `#FDFDFD`, radius `100 px`, at `(129, 2808)`.

### 10.2 Outer card (`Frame 1618872221`)

- Position: `(10, 190)` · size `373 × 2621 px`.
- Background `#FFFFFF`, radius `40 px`, padding `9 px`, `flex-col; gap: 10; align: center.`

### 10.3 Greeting card (`Frame 1618872450`)

- Position: `(19, 199)` · size `355 × 147 px`.
- Background `#303030`, radius `32 px`, padding `24 px 16 px`, card shadow.
- Layout `flex-col; gap: 12; justify: center; align: flex-start.`
- Greeting text (`323 × 51 px`):
  - "Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:"
  - Bricolage **Bold 700**, **`14 px`**, lh `16.8 px`, ls `−0.56`, color `#F0F0F0` (off-white on dark).
- **Download icon-button row** `36 × 36 px` at `(35, 286)`:
  - Circle `36 × 36 px`, bg `#F6F6F6`, radius `100 px`.
  - Inner download icon `20 × 20`, vector `13.33 × 13.33` `#FFFFFF`.

### 10.4 Paper card (`Frame 1984077318`)

- Position: `(19, 356)` · size `355 × 2446 px`.
- Background `#F6F6F6` (note: light grey here, vs pure white on Desktop), radius `32 px`, padding `24 px 16 px`, `flex-col; gap: 24; justify: center; align: center.`
- Inner content width: `323 px`.

**Typography for the mobile paper:**

| Block | Spec |
|---|---|
| Title (school + subject + class) | **Manrope Medium 500** `16 px`, lh `20.8` (1.3), ls `−0.32`, center, color `#303030` |
| Time / Marks, Compulsory, Name/Roll/Class | Inter **SemiBold 600** `14 px`, lh `22.4`, ls `−0.56` |
| Section heading ("Section A") | Inter **SemiBold 600** `16 px`, lh `25.6`, ls `−0.64`, center |
| Section instructions | Inter **SemiBold 600** `14 px`, lh `22.4`, ls `−0.56` |
| Question body & answer key | Inter **Regular 400** `16 px`, lh **`24 px`** (1.5), ls `−0.64` |

> **Important:** the mobile paper line-height for body text is **`24 px`**, not `38.4 px` like the desktop. This is the only Inter-body deviation between the two viewports — preserve it.

**Content blocks (all width `323 px`):**

1. Title `323 × 124 px @ (35, 380)` — "Delhi Public School, Sector-4, Bokaro\n\nSubject: English\nClass: 5th" — Manrope as above. (Yes, **Manrope** here, not Inter — special mobile-only override.)
2. Time/Marks block `323 × 54 px @ (35, 528)` (col, gap 10): two Inter SemiBold 14 px center lines (Time Allowed / Maximum Marks).
3. Compulsory line `323 × 44 px @ (35, 606)` — Inter SemiBold `14 px`.
4. **Student-info block** `323 × 66 px @ (35, 674)` (col, no gap): Name / Roll Number / Class:Section — Inter SemiBold `14 px`.
5. **Section A heading** `323 × 26 px @ (35, 764)` center.
6. **Section instructions** `323 × 44 px @ (35, 814)`.
7. **Question list + answer key** `323 × 1896 px @ (35, 882)` — Inter Regular 16 px lh 24.

---

## 11. Implementation guidance for the build

1. **Token layer first.** Create `tokens.ts` (or `tailwind.config`) from
   section 1 before laying out any component.
2. **Font loading.** Three families are needed:
   - **Bricolage Grotesque** (primary UI) — weights: Regular 400, Medium 500,
     SemiBold 600, Bold 700, ExtraBold 800. Apply
     `font-variation-settings: 'opsz' 14, 'wdth' 100` globally on Bricolage text.
   - **Inter** — weights: Regular 400, Medium 500, SemiBold 600. Used for the
     active sidebar pill and for the Assignment-Output question paper (Desktop)
     and instructions (Mobile).
   - **Manrope** — weight Medium 500 only. Used for one block: the school-title
     line on the mobile Assignment Output. Don't apply it elsewhere.
3. **Shared shell.** Build `<Sidebar />` and `<TopBar />` from section 2;
   reuse across 0-State, Filled, Upload Selector, and (with the shorter
   724px variant) Assignment Output.
4. **Component-level mapping for the build:**
   - `<Sidebar variant="default|output|upload" />` — sections 2.2 / 7.7 / 9.1
   - `<TopBar variant="frosted|opaque" label="..." />` — sections 2.3 / 9.1
   - `<MobileTopBar />` — section 4.2
   - `<MobileBottomNav active="..." />` — section 4.5
   - `<EmptyStateIllustration />` — sections 3.2 / 4.3 (responsive)
   - `<PrimaryButton variant="dark|light" />` — sections 3.2 / 7.6 / 8.3
   - `<AssignmentCard variant="desktop|mobile" />` — sections 5.2.3 / 6.2.2
   - `<CardDropdown />` — section 5.2.4
   - `<FilterSearchBar variant="desktop|mobile" />` — sections 5.2.2 / 6.2.2
   - `<StepIndicator />` — sections 7.3 + 7.4 / 8.2.1 + 8.2.2
   - `<UploadDropzone bg="white|grey" />` — sections 7.5.2A / 8.2.3A
   - `<DateField />` — sections 7.5.2B / 8.2.3B
   - `<QuestionTypePicker />` (with stepper sub-rows) — sections 7.5.2C / 8.2.3C
   - `<TextAreaWithMic />` — section 7.5.2D
   - `<FormActionBar />` (Previous / Next) — sections 7.6 / 8.3
   - `<AIGreetingCard />` — sections 9.3 / 10.3
   - `<ExamPaperCard />` — sections 9.4 / 10.4 (Inter typography stack)
5. **Asset URLs.** Figma MCP returned signed asset URLs valid for 7 days
   (issued 2026-05-24). Either:
   - download once and commit to `frontend/public/assets/` (preferred), or
   - re-extract with `get_design_context` for fresh URLs.
6. **Pixel discipline.** Convert px to `rem` only where the project's font
   sizes scale; layouts that need to match the canvas exactly should stay
   in px.

---

## 12. Cross-screen notes (read before building)

- **Two font families appear in the build.** Bricolage Grotesque is the brand /
  UI typeface (everything in the sidebar, top bar, forms, headings). **Inter**
  is used for: (a) the active sidebar pill "Create Assignment" / "AI Teacher's
  Toolkit" label, and (b) the entire Assignment-Output paper body on Desktop
  AND for headings/instructions on Mobile. **Manrope** appears in exactly one
  place: the school-title block on the mobile Assignment Output (§10.4). Don't
  generalise it elsewhere.
- **Two illustration paint variants for the logo tile:** the "Assignment
  Output" Desktop uses a flat `#303030` square (radius `12 px` outer / `10 px`
  inner), while every other desktop screen uses the orange-gradient logo tile
  (radius `15 px` outer / `10 px` inner). Mirror this exactly per screen.
- **Sidebar height shifts.** `756 px` on 0-State / Filled / Assignment Output…
  but `744 px` on Upload Selector and Assignment Output Desktop. Keep the
  inner `flex-col; justify: space-between` so it works at either height.
- **Filter/search bar shape differs between screens.** Filled-Desktop is one
  full-width bar (`64 × 1100 px`). Filled-Mobile splits it into a "Filter"
  label + a `228 × 44 px` search pill on the right. Upload-Selector has no
  filter/search bar at all.
- **Card-title weight changes between viewports.** Desktop Filled-State assignment-card
  title is ExtraBold 24 px / lh 1.2. Mobile equivalent is Bold 18 px / lh 25.2.
  Do not unify.
- **The "Create Assignment" outer wrapper has rounded corners (`radius 40 px`)
  but no fill.** It's a structural wrapper to align the step indicator with
  the form panel. Don't accidentally render a visible card.

---

## 13. Implementation checklist (component-level)

When you start the frontend build, work in this order so each step unblocks
the next:

1. **Theme layer** — implement section 1 as design tokens. Verify Bricolage
   Grotesque, Inter, and Manrope are all loaded (weights listed in §11.2).
2. **Shared shell** — `<Sidebar variant="default|output|upload">` and
   `<TopBar variant="frosted|opaque" label="..." />`. Variants per
   sections 2, 5.1, 7.7, 9.1.
3. **Mobile chrome** — `<MobileTopBar />` (§4.2) + `<MobileBottomNav active="..." />`
   (§4.5). Do NOT ship the iOS status/address/tab bars from sections 4.1, 10.1 —
   those are Figma-only artifacts.
4. **0-State screens** — `<EmptyAssignments />` (§3, §4).
5. **Filled-State screens** — `<FilterSearchBar />`, `<AssignmentCard />`,
   `<CardDropdown />` (§5, §6). Build a 2-col grid for Desktop, 1-col stack
   for Mobile.
6. **Upload Selector** — `<StepIndicator />` (§7.3–7.4), `<UploadDropzone />`
   (§7.5.2A / §8.2.3A — note the bg color difference), `<DateField />`,
   `<QuestionTypeStepper />` (§7.5.2C / §8.2.3C), `<TextAreaWithMic />` (§7.5.2D).
   Action row with Previous/Next (§7.6 / §8.3).
7. **Assignment Output** — `<AIGreetingCard />` (§9.3 / §10.3),
   `<ExamPaperCard />` (§9.4 / §10.4). Use the Inter typography stack here.
   This is the most important screen — measure against Figma at the end.

---

## 14. Change log

- **2026-05-24 (initial)** — 3 frames captured via Figma MCP `get_design_context`
  (0-State Desktop, 0-State Mobile, Filled State Desktop). 5 frames blocked
  by Figma MCP Starter-plan rate limit; metadata bounds captured for all.
- **2026-05-24 (complete)** — Remaining 5 frames pulled via Figma REST API
  (`/v1/files/{key}/nodes`) using a Personal Access Token. All 8 frames
  documented pixel-perfect. Raw payloads cached in `doc/.figma-raw/` for
  re-parsing. **Note:** the PAT used to fetch this data was a temporary one
  shared in chat — rotate / revoke it via Figma → Settings → Security if not
  already done.
- **2026-05-24 (measurements appendix)** — Added
  [`DESIGN_MEASUREMENTS.md`](DESIGN_MEASUREMENTS.md): an auto-generated 1350-line
  inspect-panel-equivalent listing for **every layout-relevant element in every
  frame** — per-element size, L/R/T/B margins to parent, and inter-sibling gaps
  (↕ vertical, ↔ horizontal). 223 sibling gaps across the 8 frames; depth-cap
  effectively uncapped at 20. Only excluded types are raw SVG paths (VECTOR /
  BOOLEAN_OPERATION) which are icon-stroke internals, not layout boxes.
  Verifies derived distances (e.g. the 93 px gutter / 108 px bottom margin on
  the 0-State illustration) that the main spec leaves implicit.
