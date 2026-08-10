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
        dynamic/         ← Dataview + MetaBind fragments (widgets, queries, buttons)
      scripts/           ← Tier 3: JS logic
        user/            ← Templater user functions (tp.user.*)
        engine/          ← JS Engine scripts (MetaBind button actions)
        views/           ← DataviewJS views (dv.view())
      resources/         ← Static assets
        images/          ← placeholder.png etc.
    .obsidian/           ← Obsidian config & CSS snippets
    00 - Φ - Inthima/    ← module (placeholder)
    ...
    04 - Λ - Devs/       ← module (fully implemented)
    07 - Π - Ordus/      ← module (fully implemented)
    ...
```

**What's implemented vs. not:**
- **Memorium (02)**: fully built — 5-level journaling (daily/weekly/monthly/quarterly/yearly) with templates, charts, throwbacks, navigation.
- **Ordus (07)**: fully built — kanban boards, tasks, subtasks with priority and business value.
- **Devs (04)**: fully built — projects, binnacles, decisions, postmortems. Integrates with Ordus for per-project kanban boards.
- **Dashboard templates exist for all 10 modules** (contribution heatmaps render on each hub). Note-type templates for modules 00, 01, 03, 05, 06, 08, 09 do **not** exist yet.

### Benchmark system

Located at `Meta/benchmarks/`. A set of test notes for validating CSS styling across different states:

| Benchmark | CSS Classes | Purpose |
|---|---|---|
| `benchmark-bare.md` | *(none)* | Pure Obsidian default rendering baseline |
| `benchmark-native.md` | `native` | Foundation `.native` class styling |
| `benchmark-native-module.md` | `native`, `module` | Module variables without specific color |
| `benchmark-module-00-inthima.md` through `benchmark-module-09-harkaive.md` (10 files) | `native`, `module`, `[module]` | Per-module color theming |
| `benchmark-utilities.md` | All utility classes | `hide-*`, `center-header-title`, `huge-header-title` combined |
| `benchmark-metabind.md` | `native`, `module`, `memorium` | MetaBind interactive widgets (sliders, inputs, buttons) |
| `benchmark-dataview.md` | `native`, `module`, `memorium` | DataviewJS tables, lists, mock charts |
| `benchmark-memorium-daily.md` | `native`, `module`, `memorium`, `memorium-daily` | Full daily note simulation |
| `benchmark-dashboard.md` | `native`, `main`, `module` | Dashboard styling with real heatmap |

---

## The 3-tier architecture

```
Tier 1: Templates (Meta/templates/)       — full note files applied by Templater folder rules
Tier 2: Components (Meta/components/)     — Markdown fragments included via tp.file.include("[[c_...]]")
Tier 3: Scripts (Meta/scripts/)           — JS called via dv.view(), tp.user.*(), or JS Engine
```

Templates are **composed** by inlining components. Components wrap scripts or frontmatter blocks. Never put logic directly in a note or inline DataviewJS — always use `dv.view()`.

### Component directory structure

```
Meta/components/
  static/           ← Templater-only components (frontmatter attributes, native properties)
    native/         ← Core attributes required in ALL notes (version, key, creation, etc.)
    memorium/       ← Memorium-specific (attributes/, frontmatters/)
    ordus/          ← Ordus-specific
    devs/           ← Devs-specific
  dynamic/          ← Dataview + MetaBind components (widgets, queries, buttons)
    graph/          ← Chart/visualization wrappers (dv.view() calls)
    progressbar/    ← SLIDER wrappers (dv.view() calls)
    query/          ← Search/list wrappers (dv.view() calls)
    buttons/        ← MetaBind button definitions
    editor/         ← MetaBind editor/input widgets (checklist input only now)
    text/           ← MetaBind text input widgets (alias inputs)
    interactive/    ← (empty — checklist removed)
```

**When you create or modify a new note type, follow this checklist:**
1. Create the template in `Meta/templates/[module]/t_[notetype].md`
2. Create static components in `Meta/components/static/`
3. Create dynamic components in `Meta/components/dynamic/`
4. Create scripts in `Meta/scripts/` (views/ for Dataview, engine/ for JS Engine, user/ for Templater)
5. Define new frontmatter properties in `ALEPH-MEM/.obsidian/types.json`
6. Map the folder to the template in `ALEPH-MEM/.obsidian/plugins/templater-obsidian/data.json` (section `folder_templates`)
7. Create the folder in the module directory
8. Add `cssclasses` and CSS snippet if needed

---

## File naming conventions

| Prefix | Meaning | Example |
|--------|---------|---------|
| `t_`   | Template | `t_daily.md`, `t_project.md` |
| `c_`   | Component (reusable fragment) | `c_templater_native_version_attribute.md` |
| (none) | User-created content note | `2026-07-30-Thursday.md` |

**Component naming pattern:** `c_[layer]_[module]_[purpose].md`
- layer: `templater` (static frontmatter), `metabind` (MetaBind widgets), `dataview` (DataviewJS wrappers)
- module: `native` (core), `memorium`, `ordus`, `devs`
- Example: `c_metabind_memorium_day_rating_slider.md`

**Dataview view script pattern:** `dataview_[module]_[purpose].js`
- Example: `dataview_memorium_weekly_day_rating_graph.js`

**JS Engine script pattern:** `[module]/[action].js`
- Example: `devs/binnacle.js`, `ordus/subtask.js`

**Templater user script pattern:** `generate_[purpose].js` or `[verb]_[noun].js`
- Example: `generate_child_note.js`, `generate_key.js`

**CSS snippet prefixes:**
| Prefix | Use | Example |
|--------|-----|---------|
| `am-color-*` | Color palette variables | `aleph-mem-color-palette.css` |
| `am-class-native-module-*` | Per-module theming | `am-class-native-module-04-devs.css` |
| `am-class-native-module` | Shared module CSS variables | `am-class-native-module.css` |
| `am-class-native` | Core `.native` class styling | `am-class-native.css` |
| `am-class-hide-*` | Utility (hide frontmatter, inline title) | `am-class-hide-all-frontmatter.css` |
| `am-class-*` | Typography/utility (center-title, kanban) | `am-class-center-header-title.css` |
| `am-layout-*` | General layout (buttons, nav, fonts, sidebar) | `am-layout-fonts.css` |
| `am-layout-component-*` | Widget styling (sliders, editors, callouts) | `am-layout-component-devs-status-bar.css` |
| `am-layout-progress-bar-base` | Base progress bar styles (replaces MetaBind) | `am-layout-progress-bar-base.css` |
| `temp/` | **LEGACY — do not use or modify** | — |

**Folder naming:** `XX - LETTER - Name/` (e.g., `02 - Ψ - Memorium/`, `07 - Π - Ordus/`). Sub-folders: `0X - Category/`.

---

## Critical plugins

Without these the vault does not function:
- **Templater** — folder templates, `tp.file.include()`, `tp.user.*()` JS functions
- **Dataview** — `dv.view()`, all charts/heatmaps/tables/throwbacks, and native progressbar sliders
- **Journals** — automated temporal note creation and calendar UI
- **JS Engine** — powers child note creation buttons and checklist actions
- **obsidian-kanban-am** — custom fork of community Kanban. Key behavior: creating a card always creates a note, and creating a note always creates a card. This bidirectional link is essential for Board→Task.

**MetaBind status:** MetaBind is in the process of **being phased out**. The `editor` widget has been replaced by the native `[!editor]` callout across all templates. All `progressBar` sliders have been migrated to native DataviewJS components (using the same CSS classes and DOM structure as MetaBind). Remaining MetaBind usage is limited to `text` inputs (aliases) and `button` definitions (which delegate to JS Engine scripts). The plugin remains installed for now but is no longer architecturally critical.

**Non-plugin:** Chart.js + chartjs-plugin-annotation loaded from CDN at runtime. Requires internet on first load. Cached per-session. No offline fallback.

---

## Critical rules agents must follow

1. **Always ask before modifying any file.** Templates, components, scripts, CSS, config — any change can cascade. No exceptions.
2. **Never break existing notes.** Backward compatibility is the single most important constraint. Never remove or rename frontmatter properties notes rely on. If renaming CSS classes, keep the old as an alias.
3. **Never put DataviewJS inline.** Always use `dv.view("Meta/scripts/views/[category]/script_name.js")`. All notes auto-update when scripts change.
4. **Components are included via wiki links:** `tp.file.include("[[c_templater_native_creation_attribute]]")`. Wiki links resolve by filename, not path — so component files can be moved without breaking templates.
5. **Do not edit `.obsidian/*.json` files without asking.** These are Obsidian-managed plugin configs.
6. **Do not delete or rename files without searching all references first.**
7. **Do not touch `temp/` CSS snippets.** They are legacy.
8. **Use `generate_child_note(tp, config)` for ALL child note creation.** It auto-detects numbered vs singleton mode based on config (`childFolder` vs `suffix`). Use `includeAncestor: false` when the parent naming pattern would cause a false-positive ancestor extraction.

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

### CSSClasses convention

- `native` — Base class for all notes
- `module` — Applied to module hubs and typed notes, enables per-module CSS variables
- `main` — Root dashboard (`AM.md`)
- `[module-name]` — Per-module color theming (e.g., `inthima`, `cognitio`, `memorium`, `ordus`, `devs`, etc.)
- `hide-all-frontmatter` — Hides the YAML frontmatter block
- `hide-inline-title` — Hides Obsidian's auto-generated inline title
- `hide-source-frontmatter` — Hides source-mode frontmatter display
- `center-header-title` — Centers the note's title
- `huge-header-title` — Enlarges the note's title
- `memorium-daily` / `memorium-weekly` / etc. — Memorium temporal styling
- `devs-project` / `devs-binnacle` / `devs-decision` / `devs-postmortem` — Devs note type styling

---

## Key mechanisms

### Child note creation

All child notes are created via **JS Engine scripts** that call the **Templater API** directly (`templater.create_new_note_from_template()`). This replaced the old `templaterCreateNote` MetaBind action.

**Full data flow:**
```
Button click → JS Engine script (engine/[module]/[name].js)
  ├─ If singleton (Postmortem) → check if exists → open OR create
  └─ Calls Templater API (templater.create_new_note_from_template)
       ├─ Templater creates empty file in target folder
       ├─ Templater applies template (t_[type].md)
       │    ├─ Native components: version, key, creation, tags, cssclasses, etc.
       │    ├─ Module-specific frontmatter (status, progress, impact, etc.)
       │    ├─ DataviewJS widgets (sliders, tables)
       │    ├─ MetaBind widgets (text inputs, buttons)
       │    └─ generate_child_note() → renames + builds context
       ├─ Templater writes processed content to file
       └─ Note opens in preview mode
```

**Scripts per module:**
```
Meta/scripts/engine/
  devs/
    binnacle.js      ← numbered
    decision.js      ← numbered
    postmortem.js    ← singleton (check existence first)
  ordus/
    subtask.js       ← numbered
```

### `generate_child_note(tp, config)` — THE unified child note function

Auto-detects mode from config:
- **Numbered** (has `childFolder`): auto-numbered child, e.g. `PROJECT-1-B1`, `MAIN-10-1`
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

### Progressbar sliders (native, MetaBind-free)

All 8 sliders in the vault are native DataviewJS components that replicate the MetaBind progressBar DOM structure exactly — same CSS classes, same CSS snippets, identical visual appearance.

**Architecture:**
```
Tier 2: Meta/components/dynamic/progressbar/c_dataview_[module]_[purpose]_slider.md
  └─ dv.view("Meta/scripts/views/interactive/progressbar/dataview_[module]_[purpose]_slider")
       └─ Tier 3: .js creates DOM (progress-bar-input > progress-bar-progress + value + labels)
            ├─ Click/drag → processFrontMatter() → persist
            └─ CSS colors via [data-internal-value="X"] → module snippets
```

**Base CSS** (replaces MetaBind's own styles.css): `am-layout-progress-bar-base.css`

**Per-slider CSS:** `am-layout-component-[module]-[bar].css` — colors + labels per value

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

Sliders that store text labels (status, impact, outcome) save the human-readable string to frontmatter instead of a number. Reading is backward-compatible with numeric values (the slider detects old numeric data and converts it on load).

**Class naming note:** The original MetaBind CSS classes `mb-progress-bar-*` were renamed to `progress-bar-*` when the base styles were extracted to `am-layout-progress-bar-base.css`. The `mb-` prefix is gone — all sliders now use plain `progress-bar-*` classes throughout the DOM and CSS.

### Editor callout system (`[!editor]`)

Replaces MetaBind `INPUT[editor]` widgets across all 11 templates. A custom Obsidian callout styled as a minimal writing area:

```markdown
> [!editor]
```

- **CSS:** `am-layout-editor-callout.css` — hides icon + title, sets min-height: 30em, no border/background
- **Behavior:** user writes Markdown natively inside the callout body. Content is part of the note body (not frontmatter). Expands infinitely.
- **Defined in:** callout-manager → `editor` with `lucide-pencil` icon

### Context linking hierarchy

```
AM.md ← context ← All module hubs (INTHIMA.md, MEMORIUM.md, DEVS.md, ...)
  └─ ← context ← Ordus Boards (ORDUS.md) and Devs Projects (DEVS.md)
       └─ ← context ← Children (Tasks, Binnacles, Decisions, Subtasks, Postmortems)
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

**Dataview cache lag (~2.5s):** Changes to frontmatter are not immediately visible when queried via Dataview. Interactive features that need instant feedback should write to frontmatter via `app.fileManager.processFrontMatter()` (used by the native progressbar sliders) rather than relying on Dataview re-rendering.

**Windows double-create bug:** Obsidian sometimes fires duplicate create events on Windows. `t_startup_guard.md` patches Templater's internal handler to debounce within a 5s window. If template issues appear on Windows, this is the first suspect.

**Chart.js requires internet** on first load each session. No offline fallback.

**AGENTS.md is gitignored** — changes to it are not tracked in git.

**Memorium/* and Ordus/* folders are gitignored** (except their hub files) — these contain personal data not included in the repo.

**Wiki links resolve by filename, not path.** This means components can be moved between directories (`static/`, `dynamic/`, etc.) without breaking any `tp.file.include("[[...]]")` references in templates. Only `dv.view()` string paths need updating when scripts move.

**Templater user scripts** are loaded from `Meta/scripts/user/` (configured in `templater-obsidian/data.json` → `user_scripts_folder`). Templater does not scan subdirectories. Each entry-point function must live at the root of this folder.

**`generate_child_note` includeAncestor false positive:** When a parent's name matches the pattern `^(.+)-\d+$` (e.g., `PROJECT-1`), setting `includeAncestor: true` would extract `PROJECT` as an alleged ancestor — but that note doesn't exist in Devs context. Always set `includeAncestor: false` for Devs children. The default is `true` for backward compatibility with Ordus (`MAIN-10` → ancestor `MAIN` which is a valid board).

---

## Key files to know

| File | Purpose |
|------|---------|
| `Meta/scripts/user/generate_child_note.js` | Unified child note creation (numbered + singleton) |
| `Meta/scripts/user/generate_key.js` | Random 16-digit note key |
| `Meta/scripts/user/generate_template_hash_version.js` | FNV-1a hash of template + its components |
| `Meta/scripts/views/interactive/progressbar/dataview_*.js` | Native progressbar slider implementations (8 files) |
| `Meta/scripts/views/graph/dataview_memorium_weekly_day_rating_graph.js` | Chart.js weekly rating graph (largest script class) |
| `Meta/scripts/engine/devs/postmortem.js` | Postmortem singleton creation (checks existence) |
| `Meta/templates/t_startup_guard.md` | Windows duplicate-create debounce patch |
| `ALEPH-MEM/.obsidian/plugins/templater-obsidian/data.json` | Folder→template mappings + user_scripts_folder |
| `ALEPH-MEM/.obsidian/plugins/journals/data.json` | Memorium journal config |
| `ALEPH-MEM/.obsidian/plugins/callout-manager/data.json` | Custom callout definitions (memorium, ordus, devs, editor) |
| `ALEPH-MEM/.obsidian/types.json` | Custom frontmatter property types |
| `ALEPH-MEM/.obsidian/snippets/` | ~50 CSS snippet files |
| `ALEPH-MEM/.obsidian/snippets/am-layout-progress-bar-base.css` | Base progress bar CSS (replaces MetaBind's own CSS) |
| `ALEPH-MEM/.obsidian/snippets/am-layout-editor-callout.css` | Editor callout styling |

---

## How to trace template dependencies

1. Read the template in `Meta/templates/[module]/t_*.md`
2. Find `tp.file.include("[[component]]")` calls → look up in `Meta/components/`
3. For dynamic Dataview components, find `dv.view("path/to/script")` → look up in `Meta/scripts/views/`
4. For MetaBind components, find JS Engine `file:` references → look up in `Meta/scripts/engine/`
5. For Templater user scripts, find `tp.user.functionName()` → look up in `Meta/scripts/user/`
6. Static components (frontmatter initializers) live in `Meta/components/static/`

---

## Icon reference (Lucide)

Custom icons assigned via the Iconic plugin and callout-manager:

**Note types:**

| Note Type | Module | Icon |
|---|---|---|
| Project | Devs | `lucide-drafting-compass` |
| Binnacle | Devs | `lucide-notebook-pen` |
| Decision | Devs | `lucide-git-branch` |
| Postmortem | Devs | `lucide-microscope` |
| Task | Ordus | `lucide-ticket` |
| Subtask | Ordus | `lucide-tag` |

**Custom callouts:**

| Callout | Icon | Color |
|---|---|---|
| `[!memorium]` | `lucide-calendar-search` | `255, 247, 0` |
| `[!ordus]` | `lucide-tags` | `218, 119, 242` |
| `[!devs]` | `lucide-drafting-compass` | `99, 230, 190` |
| `[!editor]` | `lucide-pencil` | *(none — icon hidden by CSS)* |

Callout definitions live in `ALEPH-MEM/.obsidian/plugins/callout-manager/data.json`.

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
- Postmortem button opens existing postmortem if already created (singleton check in JS Engine). If the postmortem already exists, the JS Engine script at `engine/devs/postmortem.js` opens it directly without creating a new note. No duplicate `Untitled.md` is left behind.
- When a postmortem is already created and the button is pressed anyway, `generate_child_note` detects the duplicate (`renamed: false`). The `t_postmortem.md` template opens the existing postmortem and outputs minimal content for the duplicate (`tR = "---\n---\n"`), leaving it inert.
- Project context is `[[DEVS]]` (the module hub)
- All children link to parent via `context` property
- `includeAncestor: false` prevents false-positive ancestor extraction in child notes
- Binnacle/Decision Dataview tables are collapsible `[!devs]` callouts

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