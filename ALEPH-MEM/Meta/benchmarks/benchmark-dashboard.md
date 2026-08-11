---
cssclasses:
  - native
  - main
  - module
  - memorium
tags:
  - benchmark
---

# Benchmark: Dashboard (Main)

> **Purpose:** Tests the root dashboard styling (`native` + `main` + `module`). The `.main` class is applied to `AM.md` (the vault root homepage) and provides dashboard-specific layout. Uses Memorium module colors for theming.

---

## Contribution Heatmap (Memorium)

This DataviewJS block renders the real contribution heatmap for the Memorium module. It loads `dataview_memorium_dashboard_contribution_heatmap.js` via `dv.view()`.

```dataviewjs
await dv.view("Meta/scripts/view/graph/dataview_memorium_dashboard_contribution_heatmap");
```

---

## Module Hub Info

| Property | Value |
|---|---|
| **Module** | 02 — Ψ — Memorium |
| **Domain** | Memory, temporal record, personal history |
| **Status** | 100% Complete |
| **Note types** | Daily, Weekly, Monthly, Quarterly, Yearly |

---

## Markdown Content

---

## Headers

# H1 – Dashboard Title

## H2 – Section

### H3 – Subsection

#### H4 – Minor Heading

---

## Text Formatting

**Bold text**  
*Italic text*  
~~Strikethrough~~  
==Highlighted text==  
`inline code`

---

## Lists

- Dashboard item A
- Dashboard item B
  - Sub-item B1
  - Sub-item B2

---

## Links

- External: [Obsidian Website](https://obsidian.md/)
- Internal: [[Some Note]]
- Internal with alias: [[Some Note|Display Alias]]

---

## Callouts

> [!note]
> Dashboard note callout.

> [!info]
> Dashboard info callout.

> [!tip]
> Dashboard tip callout.

> [!warning]
> Dashboard warning callout.

---

## Code Block

```javascript
const dashboard = {
  module: "memorium",
  status: "complete",
  heatmap: await dv.view("Meta/scripts/view/graph/dataview_memorium_dashboard_contribution_heatmap")
};
```

---

## Tables

| Property | Type | Required |
|:---------|:-----|:---------|
| version  | text | Yes      |
| key      | text | Yes      |
| creation | datetime | Yes  |
| tags     | tags | Yes      |
| cssclasses | multitext | Yes |

---

## Tags

#benchmark

---

## Frontmatter (YAML)

```yaml
cssclasses: [native, main, module, memorium]
tags: [benchmark]
version: "#000000000000"
key: "9876543210987654"
creation: 2026-07-30
context: []
related: []
aliases: [Dashboard Benchmark]
```

---

## Verification Checklist

- [ ] `.main` class applies dashboard-specific layout (defined in `am-class-native-main.css`)
- [ ] Contribution heatmap renders without errors (Memorium data query + grid layout)
- [ ] Heatmap stats panel renders (total notes, active days, coverage %, avg/day, best day, streaks)
- [ ] Heatmap legend and progress bar render correctly
- [ ] Module theming (Memorium) colors all UI elements
- [ ] Dashboard looks distinct from regular notes (`.main` class differences)
- [ ] All NATIVE frontmatter properties are present

> **Note:** `.main` is the CSS class for the root vault dashboard (`AM.md`). The real `AM.md` would have this class plus `hide-all-frontmatter`, `hide-inline-title`, `huge-header-title`, and `center-header-title`. This benchmark keeps it simpler to isolate the `.main` class behavior.
