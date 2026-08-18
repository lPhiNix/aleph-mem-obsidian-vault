# AGENTS.md — Aleph-Mem

> **Audience:** AI agents (opencode, Copilot) editing this vault.  
> **Language:** English for all code, comments, CSS, and filenames. Note content may be Spanish.  
> **This file is gitignored.** It lives in the repo root but the actual vault is at `ALEPH-MEM/`.

---

## What this repo is

An Obsidian PKM vault structured into **10 fixed modules** (00–09, Greek-lettered, inner→outer spectrum). It is **not a software project** — no build, no tests, no lint. The infrastructure is defined by Obsidian plugin configs, templates, Markdown components, JavaScript scripts, and CSS snippets.

---

## Directory layout

```
repo root/
  AGENTS.md             ← this file (gitignored)
  ALEPH-MEM/            ← the actual Obsidian vault root
    AM.md                ← vault dashboard homepage
    Meta/                ← all infrastructure
      templates/         ← Tier 1: full note templates
      components/        ← Tier 2: reusable Markdown fragments
        static/          ← Templater-only fragments (frontmatter attributes)
        dynamic/         ← DataviewJS fragments (widgets, queries, buttons)
      scripts/           ← Tier 3: JS logic
        user/            ← Templater user functions (tp.user.*)
        view/            ← DataviewJS views (dv.view()) — graph/, queries/, interactive/
      resources/         ← Static assets
        images/          ← placeholder.png etc.
    .obsidian/           ← Obsidian config & CSS snippets
    00 - Φ - Inthima/    ← module
    ...
    04 - Λ - Devs/       ← module (fully implemented)
    05 - Ζ - Viventia/   ← module (fully implemented)
    07 - Π - Ordus/      ← module (fully implemented)
    ...
```

**What's implemented vs. not:**
- **Memorium (02)**: fully built — 5-level journaling (daily/weekly/monthly/quarterly/yearly) with templates, charts, throwbacks, navigation.
- **Devs (04)**: fully built — projects, binnacles, decisions, postmortems. Integrates with Ordus for per-project kanban boards.
- **Viventia (05)**: fully built — explorations, activities (hobbies/habits with polarity), sessions, analyses.
- **Ordus (07)**: fully built — kanban boards, tasks, subtasks with priority and business value.
- **Inthima (00)**: partially built — has the `axiom` note type.
- **Dashboard templates exist for all 10 modules** (contribution heatmaps render on each hub). Note-type templates for modules 01 (Cognitio), 03 (Noetheris), 06 (Kaelithra), 08 (Aethernum), 09 (Harkaive) do **not** exist yet.

### Benchmark system

Located at `Meta/benchmarks/`. A set of test notes for validating CSS styling across different states:

| Benchmark | CSS Classes | Purpose |
|---|---|---|
| `benchmark-bare.md` | *(none)* | Pure Obsidian default rendering baseline |
| `benchmark-native.md` | `native` | Foundation `.native` class styling |
| `benchmark-native-module.md` | `native`, `module` | Module variables without specific color |
| `benchmark-module-00-inthima.md` through `benchmark-module-09-harkaive.md` (10 files) | `native`, `module`, `[module]` | Per-module color theming |
| `benchmark-utilities.md` | All utility classes | `frontmatter-hide-*`, `header-*`, `inline-hide-title` combined |
| `benchmark-dashboard.md` | `native`, `main`, `module` | Dashboard styling with real heatmap |

---

## The 3-tier architecture

```
Tier 1: Templates (Meta/templates/)       — full note files applied by Templater folder rules
Tier 2: Components (Meta/components/)     — Markdown fragments included via tp.file.include("[[c_...]]")
Tier 3: Scripts (Meta/scripts/)           — JS called via dv.view() or tp.user.*()
```

Templates are **composed** by inlining components. Components wrap scripts or frontmatter blocks. Never put logic directly in a note or inline DataviewJS — always use `dv.view()`.

### Component directory structure

```
Meta/components/
  static/           ← Templater-only components (frontmatter attributes, native properties)
    native/         ← Core attributes required in ALL notes (version, key, creation, etc.)
    memorium/       ← Memorium-specific (attributes/, frontmatters/)
    ordus/          ← Ordus-specific (attributes/)
    devs/           ← Devs-specific (attributes/)
    viventia/       ← Viventia-specific (attributes/)
  dynamic/          ← DataviewJS components (widgets, queries, buttons)
    graph/          ← Chart/heatmap wrappers (dv.view() calls)
    slider/         ← Native slider wrappers (dv.view() calls)
    input/          ← Alias text-input wrappers (dv.view() calls)
    queries/        ← Search/list wrappers (dv.view() calls)
    buttons/        ← Button definitions (dv.view() calls, delegate to Templater API)
```

**When you create or modify a new note type, follow this checklist:**
1. Create the template in `Meta/templates/[module]/t_[notetype].md`
2. Create static (templater) components in `Meta/components/static/[module]/`
3. Create dynamic (dataview) components in `Meta/components/dynamic/`
4. Create scripts in `Meta/scripts/view/` (graph/, queries/, interactive/) and/or `Meta/scripts/user/`
5. Map the folder to the template in `ALEPH-MEM/.obsidian/plugins/templater-obsidian/data.json` (section `folder_templates`)
6. Create the folder in the module directory
7. Add `cssclasses` and CSS snippet if needed

> `ALEPH-MEM/.obsidian/types.json` only holds the 8 core property types (`aliases`, `cssclasses`, `tags`, `version`, `creation`, `key`, `context`, `related`). Module-specific properties are **not** registered there — do not add to it.

---

## File naming conventions

| Prefix | Meaning | Example |
|--------|---------|---------|
| `t_`   | Template | `t_daily.md`, `t_project.md` |
| `c_`   | Component (reusable fragment) | `c_templater_native_version_attribute.md` |
| (none) | User-created content note | `2026-07-30-Thursday.md` |

**Component naming pattern:** `c_[layer]_[module]_[purpose].md`
- layer: `templater` (static frontmatter), `dataview` (DataviewJS wrappers)
- module: `native` (core), `memorium`, `ordus`, `devs`, `viventia`
- Example: `c_dataview_viventia_polarity_slider.md`

**Dataview view script pattern:** `dataview_[module]_[purpose].js`
- Example: `dataview_memorium_day_rating_graph.js`

**Templater user script pattern:** `generate_[purpose].js` or `[verb]_[noun].js`
- Example: `generate_child_note.js`, `generate_key.js`

**CSS snippet prefixes:**
| Prefix | Use | Example |
|--------|-----|---------|
| `am-palette` | Color palette variables | `am-palette.css` |
| `am-class-module-*` | Per-module color theming | `am-class-module-devs.css`, `am-class-module-viventia.css` |
| `am-class-native-module` | Shared module CSS variables | `am-class-native-module.css` |
| `am-class-native` | Core `.native` class styling | `am-class-native.css` |
| `am-class-native-main` | Dashboard (`.main`) typography | `am-class-native-main.css` |
| `am-class-frontmatter-hide-*` | Hide frontmatter (all/source) | `am-class-frontmatter-hide-all.css`, `am-class-frontmatter-hide-source.css` |
| `am-class-header-*` | Title typography (center, huge, italic) | `am-class-header-center-title.css` |
| `am-class-inline-hide-title` | Hide inline title | `am-class-inline-hide-title.css` |
| `am-class-kanban` | Kanban styling | `am-class-kanban.css` |
| `am-layout-ui-*` | UI chrome (fonts, sidebar, graphview, journal) | `am-layout-ui-fonts.css` |
| `am-layout-slider-base` | Base slider styles | `am-layout-slider-base.css` |
| `am-layout-slider-[module]-[field]` | Per-slider colors + labels | `am-layout-slider-viventia-polarity.css` |
| `am-layout-editor-callout` | `[!editor]` callout styling | `am-layout-editor-callout.css` |
| `am-layout-buttons` | Button styling | `am-layout-buttons.css` |

**Folder naming:** `XX - LETTER - Name/` (e.g., `02 - Ψ - Memorium/`, `07 - Π - Ordus/`). Sub-folders: `0X - Category/`.

---

## Critical plugins

Without these the vault does not function:
- **Templater** — folder templates, `tp.file.include()`, `tp.user.*()` JS functions
- **Dataview** — `dv.view()`, all charts/heatmaps/tables/throwbacks, and native sliders
- **Journals** — automated temporal note creation and calendar UI
- **obsidian-kanban-am** — custom fork of community Kanban. Key behavior: creating a card always creates a note, and creating a note always creates a card. This bidirectional link is essential for Board→Task.

**Supporting plugins:** `iconic` (icons), `callout-manager` (custom callouts), `tag-wrangler`, `obsidian-style-settings`, `file-explorer-note-count`.

**Removed:** MetaBind and JS Engine are **fully removed** — no plugin, no code references, no `mb-` classes. Text inputs are native `<input>` elements written via `app.fileManager.processFrontMatter()`. Buttons are DataviewJS elements that call the Templater API directly (`create_new_note_from_template()`).

**Non-plugin:** Chart.js + chartjs-plugin-annotation loaded from CDN at runtime. Requires internet on first load. Cached per-session. No offline fallback.

---

## Critical rules agents must follow

1. **Always ask before modifying any file.** Templates, components, scripts, CSS, config — any change can cascade. No exceptions.
2. **Never break existing notes.** Don't remove or rename frontmatter properties that notes rely on. **This vault is pre-release** — do NOT add backward-compatibility shims (numeric fallbacks, `LEGACY` maps, alias class names for renamed values). If a value format changes, change it everywhere.
3. **Never put DataviewJS inline.** Always use `dv.view("Meta/scripts/view/[category]/script_name.js")`. All notes auto-update when scripts change.
4. **Components are included via wiki links:** `tp.file.include("[[c_templater_native_creation_attribute]]")`. Wiki links resolve by filename, not path — so component files can be moved without breaking templates.
5. **Do not edit `.obsidian/*.json` files without asking.** These are Obsidian-managed plugin configs.
6. **Do not delete or rename files without searching all references first.**
7. **Use `generate_child_note(tp, config)` for ALL child note creation.** It auto-detects numbered vs singleton mode based on config (`childFolder` vs `suffix`). Use `includeAncestor: false` when the parent naming pattern would cause a false-positive ancestor extraction.

---

## Frontmatter properties (mandatory)

Every note gets these from native components:
- `version` — FNV-1a hash of template + components (format: `#XXXXXXXXXXXX`)
- `key` — 16-digit random ID from `crypto.getRandomValues()`
- `creation` — ISO 8601 timestamp
- `tags`, `cssclasses`, `aliases`, `context`, `related`

Notes open in preview/reading mode via `c_templater_native_preview_mode_forcer.md`.

### Module-specific properties

**Memorium:**
- `memorium-date`, `memorium-day-rating`, `journal`, `journal-date`, `journal-start-date`, `journal-end-date`
- Note: `memorium-*-summary` properties still exist in frontmatter but are empty (content moved to `[!editor]` callout body)

**Ordus:**
- `ordus-priority` (number 1–4), `ordus-business` (number 1–5)
- Note: `ordus-description` and `ordus-checklist*` properties are removed/obsolete

**Devs:**
- `devs-project-status` (text: Planning/Active/Paused/Completed)
- `devs-project-progress` (number: 0–100)
- `devs-binnacle-status` (text: On Track/Blocked/Stuck)
- `devs-decision-impact` (text: Low/Medium/High)
- `devs-postmortem-outcome` (text: Completed/Failed/Abandoned)
- Note: `devs-project-description`, `devs-binnacle-summary`, `devs-decision-content`, `devs-postmortem-content` still exist but are empty (content moved to `[!editor]` callout body)

**Viventia:**
- `viventia-state` (text: Active/On hold/Conquered) — on Activity
- `viventia-polarity` (text: Positive/Neutral/Negative) — on Activity
- `viventia-rating` (number 1–10) — on Session
- `viventia-exploration-state` (text: Pending/Tested/Discarded/Accepted) — on Exploration
- `viventia-difficulty` (text: Easy/Moderate/Hard) — on Exploration

### CSSClasses convention

- `native` — Base class for all notes
- `module` — Applied to module hubs and typed notes, enables per-module CSS variables
- `main` — Root dashboard (`AM.md`)
- `[module-name]` — Per-module color theming (e.g., `inthima`, `cognitio`, `memorium`, `devs`, `viventia`, `ordus`, etc.)
- `hide-all-frontmatter` — Hides the YAML frontmatter block
- `hide-source-frontmatter` — Hides source-mode frontmatter display
- `hide-inline-title` — Hides Obsidian's auto-generated inline title
- `center-header-title` — Centers the note's title
- `huge-header-title` — Enlarges the note's title
- `memorium-daily` / `memorium-weekly` / etc. — Memorium temporal styling
- `devs-project` / `devs-binnacle` / `devs-decision` / `devs-postmortem` — Devs note type styling

---

## Key mechanisms

### Child note creation

All child notes are created via **DataviewJS button scripts** that call the **Templater API** directly (`create_new_note_from_template()`). Singleton buttons (Postmortem, Activity-from-Exploration) check existence first — they open the existing note instead of creating a duplicate.

**Full data flow:**
```
Button click → button script (Meta/scripts/view/interactive/buttons/dataview_[module]_*.js)
  ├─ If singleton → check if exists → open OR create
  └─ Calls Templater API (create_new_note_from_template)
       ├─ Templater creates empty file in target folder
       ├─ Templater applies template (t_[type].md)
       │    ├─ Native components: version, key, creation, tags, cssclasses, etc.
       │    ├─ Module-specific frontmatter (status, polarity, impact, etc.)
       │    ├─ DataviewJS widgets (sliders, inputs, tables)
       │    └─ generate_child_note() → renames + builds context
       ├─ Templater writes processed content to file
       └─ Note opens in preview mode
```

**Button scripts per module:**
```
Meta/scripts/view/interactive/buttons/
  dataview_devs_project_buttons.js        ← + Binnacle, + Decision, + Postmortem
  dataview_ordus_task_subtask_buttons.js  ← + Subtask
  dataview_viventia_activity_buttons.js   ← + Session (timestamped), + Analysis
  dataview_viventia_exploration_buttons.js← + Activity (singleton check)
  dataview_memorium_*_nav_buttons.js      ← temporal navigation
```

### `generate_child_note(tp, config)` — THE unified child note function

Auto-detects mode from config:
- **Numbered** (has `childFolder`): auto-numbered child, e.g. `PROJECT-1-B1`, `ACTIVITY-1-A1`
- **Singleton** (has `suffix`): fixed-name 1-1 child, e.g. `PROJECT-1-PM`

Config parameters:
| Param | Required | Description |
|---|---|---|
| `parentFolder` | Yes | Fragment that the parent's path must contain |
| `childFolder` | Numbered | Folder where child is created |
| `separator` | Numbered | Separator between parent and child index (default `-`) |
| `includeAncestor` | Numbered | Whether to include ancestor node in context (default `true`) |
| `suffix` | Singleton | Suffix to append to parent name (e.g., `-PM`) |

Located at: `Meta/scripts/user/generate_child_note.js`

### Native sliders

All sliders are native DataviewJS components. There is no MetaBind anywhere. DOM structure uses `slider-input` / `slider-progress` / `slider-value` / `slider-label-*` classes.

**Architecture:**
```
Tier 2: Meta/components/dynamic/slider/c_dataview_[module]_[purpose]_slider.md
  └─ dv.view("Meta/scripts/view/interactive/slider/dataview_[module]_[purpose]_slider")
       └─ Tier 3: .js creates DOM (slider-input > slider-progress + value + labels)
            ├─ Click/drag → processFrontMatter() → persist
            └─ CSS colors via [data-internal-value="X"] → module snippets
```

**Base CSS:** `am-layout-slider-base.css`

**Per-slider CSS:** `am-layout-slider-[module]-[field].css` — colors + labels per value

**Sliders implemented:**

| Slider | Module | Range | Label style |
|---|---|---|---|
| Day Rating | Memorium | 1–10 | ☆ prefix + colored |
| Priority | Ordus | 1–4 | Low/Medium/High/Critical |
| Business | Ordus | 1–5 | P prefix + colored |
| Project Status | Devs | 1–4 | Planning/Active/Paused/Completed |
| Project Progress | Devs | 0–100 | % suffix + gradient |
| Binnacle Status | Devs | 1–3 | On Track/Blocked/Stuck |
| Decision Impact | Devs | 1–3 | Low/Medium/High |
| Postmortem Outcome | Devs | 1–3 | Completed/Failed/Abandoned |
| State | Viventia | 1–3 | Active/On hold/Conquered |
| Polarity | Viventia | 1–3 | Positive/Neutral/Negative |
| Rating | Viventia | 1–10 | ☆ prefix + colored |
| Difficulty | Viventia | 1–3 | Easy/Moderate/Hard |
| Exploration State | Viventia | 1–4 | Pending/Tested/Discarded/Accepted |

Text-label sliders (status, impact, outcome, state, polarity, difficulty, exploration-state) save the human-readable string to frontmatter. Numeric sliders (progress, ratings, priority, business) save numbers.

### Editor callout system (`[!editor]`)

Replaces the old MetaBind `INPUT[editor]` widgets across all note-type templates. A callout styled as a minimal writing area:

```markdown
> [!editor]
```

- **CSS:** `am-layout-editor-callout.css` — hides icon + title, sets `min-height: 35em`
- **Behavior:** user writes Markdown natively inside the callout body. Content is part of the note body (not frontmatter). Expands infinitely.
- **Definition:** CSS-only via `.callout[data-callout="editor"]` — **not** registered in callout-manager (which only defines `memorium`, `ordus`, `devs`).

### Context linking hierarchy

```
AM.md ← context ← All module hubs (INTHIMA.md, MEMORIUM.md, DEVS.md, VIVENTIA.md, ...)
  └─ ← context ← Ordus Boards, Devs Projects, Viventia Activities
       └─ ← context ← Children (Tasks, Binnacles, Decisions, Sessions, Analyses, ...)
```

This creates a navigable hierarchy: AM → Hub → Root Note → Child Notes.

### Callout theming (theme-independent)

Callouts are styled via `am-class-native.css` with explicit border-width, border-style, and border-radius. This ensures callouts look consistent regardless of the active theme. Border color comes from the module via `am-class-native-module.css` (`var(--secondary)`).

```css
.native .callout {
  border-width: 2px;
  border-style: solid;
  border-radius: 8px;
  background-color: transparent;
  box-shadow: none;
}
```

---

## Known pitfalls

**Dataview cache lag (~2.5s):** Changes to frontmatter are not immediately visible when queried via Dataview. Interactive features that need instant feedback should write to frontmatter via `app.fileManager.processFrontMatter()` (used by the native sliders) rather than relying on Dataview re-rendering.

**Windows double-create bug:** Obsidian sometimes fires duplicate create events on Windows. `t_startup_guard.md` patches Templater's internal handler to debounce within a 5s window. If template issues appear on Windows, this is the first suspect.

**Chart.js requires internet** on first load each session. No offline fallback.

**AGENTS.md is gitignored** — changes to it are not tracked in git.

**Module folders are gitignored** (except their hub files): `00 - Inthima`, `02 - Memorium`, `04 - Devs`, `05 - Viventia`, `07 - Ordus` — these contain personal data not included in the repo.

**Wiki links resolve by filename, not path.** This means components can be moved between directories (`static/`, `dynamic/`, etc.) without breaking any `tp.file.include("[[...]]")` references in templates. Only `dv.view()` string paths need updating when scripts move.

**Templater user scripts** are loaded from `Meta/scripts/user/` (configured in `templater-obsidian/data.json` → `user_scripts_folder`). Templater does not scan subdirectories. Each entry-point function must live at the root of this folder.

**`generate_child_note` includeAncestor false positive:** When a parent's name matches the pattern `^(.+)-\d+$` (e.g., `PROJECT-1`), setting `includeAncestor: true` would extract `PROJECT` as an alleged ancestor — but that note doesn't exist in Devs context. Always set `includeAncestor: false` for Devs and Viventia children. The default is `true` for Ordus (`MAIN-10` → ancestor `MAIN` which is a valid board).

---

## Key files to know

| File | Purpose |
|------|---------|
| `Meta/scripts/user/generate_child_note.js` | Unified child note creation (numbered + singleton) |
| `Meta/scripts/user/generate_key.js` | Random 16-digit note key |
| `Meta/scripts/user/generate_template_hash_version.js` | FNV-1a hash of template + its components |
| `Meta/scripts/view/interactive/slider/dataview_*.js` | Native slider implementations (13 files) |
| `Meta/scripts/view/interactive/buttons/dataview_*.js` | Button actions (delegate to Templater API) |
| `Meta/scripts/view/graph/dataview_memorium_day_rating_graph.js` | Chart.js rating graph (largest script class) |
| `Meta/scripts/view/graph/dataview_dashboard_contribution_heatmap.js` | Shared dashboard heatmap (year nav + filter) |
| `Meta/scripts/view/graph/dataview_viventia_activity_heatmap.js` | Viventia activity heatmap (polarity-aware) |
| `Meta/templates/t_startup_guard.md` | Windows duplicate-create debounce patch |
| `ALEPH-MEM/.obsidian/plugins/templater-obsidian/data.json` | Folder→template mappings + user_scripts_folder |
| `ALEPH-MEM/.obsidian/plugins/journals/data.json` | Memorium journal config |
| `ALEPH-MEM/.obsidian/plugins/callout-manager/data.json` | Custom callout definitions (memorium, ordus, devs) |
| `ALEPH-MEM/.obsidian/plugins/iconic/data.json` | Icon rules (file, tag, property, folder) |
| `ALEPH-MEM/.obsidian/types.json` | Core frontmatter property types (8 only) |
| `ALEPH-MEM/.obsidian/snippets/` | ~42 CSS snippet files |
| `ALEPH-MEM/.obsidian/snippets/am-layout-slider-base.css` | Base slider CSS |
| `ALEPH-MEM/.obsidian/snippets/am-layout-editor-callout.css` | Editor callout styling |

---

## How to trace template dependencies

1. Read the template in `Meta/templates/[module]/t_*.md`
2. Find `tp.file.include("[[component]]")` calls → look up in `Meta/components/`
3. For dynamic Dataview components, find `dv.view("path/to/script")` → look up in `Meta/scripts/view/`
4. For Templater user scripts, find `tp.user.functionName()` → look up in `Meta/scripts/user/`
5. Static components (frontmatter initializers) live in `Meta/components/static/`

---

## Icon reference (Lucide)

Custom icons assigned via the Iconic plugin (`fileRules`, `tagIcons`) and callout-manager:

**Note types:**

| Note Type | Module | Icon |
|---|---|---|
| Axiom | Inthima | `lucide-atom` |
| Project | Devs | `lucide-drafting-compass` |
| Binnacle | Devs | `lucide-notebook-pen` |
| Decision | Devs | `lucide-git-branch` |
| Postmortem | Devs | `lucide-microscope` |
| Exploration | Viventia | `lucide-compass` |
| Activity | Viventia | `lucide-heart-pulse` |
| Session | Viventia | `lucide-flame` |
| Analysis | Viventia | `lucide-telescope` |
| Task | Ordus | `lucide-tickets` |
| Subtask | Ordus | `lucide-tag` |

**Custom callouts:**

| Callout | Icon | Color |
|---|---|---|
| `[!memorium]` | `lucide-calendar-search` | `255, 247, 0` |
| `[!ordus]` | `lucide-tags` | `218, 119, 242` |
| `[!devs]` | `lucide-drafting-compass` | `99, 230, 190` |
| `[!editor]` | *(none — icon hidden by CSS)* | *(none — CSS only, not in callout-manager)* |

Callout definitions live in `ALEPH-MEM/.obsidian/plugins/callout-manager/data.json`. Icon rules live in `ALEPH-MEM/.obsidian/plugins/iconic/data.json`.

---

## Module reference

### Devs (04 — Λ) — CREATION

**4 note types, fully implemented.**

| Note | Cardinality | Naming | Creation |
|---|---|---|---|
| Project | Root | `PROJECT-[N].md` | Manual (auto-renamed) |
| Binnacle | 1-n | `PROJECT-[N]-B[M].md` | Button from Project |
| Decision | 1-n | `PROJECT-[N]-D[M].md` | Button from Project |
| Postmortem | 1-1 | `PROJECT-[N]-PM.md` | Button from Project (singleton) |

**Project template structure:**
```
# ✦ Project #N
[alias text input]
---
## ✧ Status     [slider: Planning/Active/Paused/Completed]
## ✧ Progress   [slider: 0–100%]
## ✧ Description [callout: [!editor]]
## ✧ Actions    [+ New Binnacle] [+ New Decision] [+ New Postmortem]
## ✧ Activity   [Dataview: binnacles list] [Dataview: decisions list]
```

**Folder structure:**
```
04 - Λ - Devs/
  DEVS.md               ← Hub (context → [[AM]])
  01 - Projects/        ← Project notes
  02 - Binnacles/       ← Binnacle notes (flat, auto-numbered)
  03 - Decisions/       ← Decision notes (flat, auto-numbered)
  04 - Postmortems/     ← Postmortem notes (flat, 1 per project)
```

**Key behaviors:**
- Postmortem button opens the existing postmortem if already created (singleton check in the button script). No duplicate `Untitled.md` is left behind.
- When a postmortem already exists and the button is pressed anyway, `generate_child_note` detects the duplicate (`renamed: false`). The `t_postmortem.md` template opens the existing postmortem and outputs minimal content for the duplicate (`tR = "---\n---\n"`), leaving it inert.
- Project context is `[[DEVS]]` (the module hub)
- All children link to parent via `context` property
- `includeAncestor: false` prevents false-positive ancestor extraction in child notes
- Binnacle/Decision Dataview tables are collapsible `[!devs]` callouts

---

### Viventia (05 — Ζ) — LIFE / HABITS

**4 note types, fully implemented.** Unified hobby/addiction tracking via the `viventia-polarity` property.

| Note | Cardinality | Naming | Creation |
|---|---|---|---|
| Exploration | Root | `EXPLORATION-[N].md` | Manual (auto-renamed) |
| Activity | 1-1 (from Exploration) or root | `ACTIVITY-[N].md` | Button from Exploration / manual |
| Session | 1-n | `YYYYMMDDHHmm-ACTIVITY-[N].md` | Button from Activity |
| Analysis | 1-n | `ACTIVITY-[N]-A[M].md` | Button from Activity |

**The polarity model:** an Activity is *something you do repeatedly* and want to steer. The direction is set by `viventia-polarity`:
- **Positive** = "want more of this" (hobby/skill). Sessions are wins; streak = consecutive days doing it.
- **Negative** = "want less of this" (addiction/bad habit). Sessions are relapses; streak = consecutive **clean** days (relabeled `CLEAN STREAK`).
- **Neutral** = tracked without judgment (colors like Positive).

The heatmap reads `viventia-polarity` and swaps palette (blue for Positive/Neutral, red for Negative) and inverts the streak in `ActivityStats.compute`.

**Activity template structure:**
```
# ✦ Activity #N
[alias text input]
---
## ✧ State        [slider: Active/On hold/Conquered]
## ✧ Polarity     [slider: Positive/Neutral/Negative]
## ✧ Description  [callout: [!editor]]
## ✧ Tracker      [Dataview: activity heatmap + streak]
## ✧ Actions      [+ New Session] [+ New Analysis]
## ✧ Activity     [Dataview: sessions list] [Dataview: analyses list]
```

**Exploration template structure:**
```
# ✦ Exploration #N
[+ Create Activity button]  [alias text input]
---
## ✧ State        [slider: Pending/Tested/Discarded/Accepted]
## ✧ Difficulty   [slider: Easy/Moderate/Hard]
## ✧ Notes        [callout: [!editor]]
```

**Session template structure:**
```
# ✦ Session
[alias text input]
---
## ✧ Rating   [slider: 1–10]
## ✧ Summary  [callout: [!editor]]
```

**Analysis template structure:**
```
# ✦ Analysis #M
[alias text input]
---
## ✧ Analysis  [callout: [!editor]]
```

**Folder structure:**
```
05 - Ζ - Viventia/
  VIVENTIA.md           ← Hub (context → [[AM]])
  01 - Explorations/    ← Exploration notes (auto-numbered)
  02 - Activities/      ← Activity notes
  03 - Sessions/        ← Session notes (timestamped, flat)
  04 - Analysis/        ← Analysis notes (flat, auto-numbered per activity)
```

**Key behaviors:**
- Exploration context links forward to its future Activity (`[[ACTIVITY-N]]` with the same number).
- Creating an Activity from an Exploration reuses the exploration number; otherwise auto-increments. The button checks for an existing Activity referencing the exploration before creating (singleton per exploration).
- Activity context is `[[VIVENTIA]]` + `[[EXPLORATION-N]]` if created from an exploration.
- Sessions are named with a `YYYYMMDDHHmm` timestamp prefix. The button checks existence first (same-minute collision → open existing). Session context is `[[ACTIVITY-N]]` (timestamp stripped from title).
- Analysis uses `generate_child_note` numbered mode with separator `-A` and `includeAncestor: false`. Context is `[[ACTIVITY-N]]`.
- Session ratings (`viventia-rating`) are interpreted as *quality* for positive activities and *severity* for negative ones.

---

### Ordus (07 — Π) — ORDER

**3 note types, fully implemented. Checklist removed.**

| Note | Cardinality | Naming | Creation |
|---|---|---|---|
| Board | Root | `[Name].md` | Manual |
| Task | 1-n | `[Board]-[N].md` | Button from Board |
| Subtask | 1-n | `[Task]-[N].md` | Button from Task |

**Context:** Board → `[[ORDUS]]`. Task → `[[Board]]`. Subtask → `[[Task]]` only (not Board — `includeAncestor: false`).

---

### Memorium (02 — Ψ) — THE PAST

**5-level temporal journal, fully implemented.**

Daily → Weekly → Monthly → Quarterly → Yearly. Each level has: rating slider, `[!editor]` callout for summary, navigation buttons, throwback queries, and Chart.js/heatmap visualizations.

Content moved from MetaBind editors to `[!editor]` callout body. Summary frontmatter properties are empty.
