---
cssclasses:
  - native
  - module
  - ordus
tags:
  - benchmark
ordus-priority: 4
ordus-business: 5
ordus-checklist:
  - Review quarterly goals
  - Update project documentation
  - Fix sidebar layout bug
  - Add dark mode toggle
ordus-checklist-done:
  - Set up CI/CD pipeline
  - Write unit tests for API
ordus-checklist-input: ""
aliases:
  - Checklist Test Task
---

# Benchmark: Ordus Checklist (Interactive)

> **Purpose:** Tests the full Ordus checklist system: MetaBind input field, JS Engine action buttons (Add / Remove Last / Remove All), and the DataviewJS checklist renderer with shared state. This is the most complex interactive benchmark.

---

## Priority & Business Value

### Priority (1–4)

```meta-bind
INPUT[progressBar(minValue(1), maxValue(4), addLabels(true), class(priority-bar)):ordus-priority]
```

### Business Value (1–5)

```meta-bind
INPUT[progressBar(minValue(1), maxValue(5), addLabels(true), class(business-bar)):ordus-business]
```

---

## Task Alias

```meta-bind
INPUT[text(placeholder('Name this Task!'), class('input-alias')):aliases]
```

---

## Description

```meta-bind
INPUT[editor(class(text-editor-content)):ordus-description]
```

---

## Checklist

### New Item Input

```meta-bind
INPUT[text(placeholder('New item…'), class('checklist-input')):ordus-checklist-input]
```

### Action Buttons

```meta-bind-button
style: primary
id: add-benchmark-item
label: + Add
hidden: true
actions:
  - type: js
    file: Meta/scripts/jsengine/ordus/checklist_add.js
```

```meta-bind-button
style: primary
id: remove-benchmark-item
label: "- Remove Last"
hidden: true
actions:
  - type: js
    file: Meta/scripts/jsengine/ordus/checklist_remove_last.js
```

```meta-bind-button
style: primary
id: remove-all-benchmark-items
label: Remove All
hidden: true
actions:
  - type: js
    file: Meta/scripts/jsengine/ordus/checklist_remove_all.js
```

`BUTTON[add-benchmark-item, remove-benchmark-item, remove-all-benchmark-items]`

---

### Checklist View (DataviewJS + Shared State)

```dataviewjs
await dv.view("Meta/scripts/view/dataview/interactive/dataview_ordus_task_checklist");
```

---

## Markdown Content (for baseline comparison)

---

## Headers

# H1 – Title

## H2 – Section

### H3 – Subsection

---

## Text Formatting

Plain paragraph text for baseline comparison.

**Bold text**  
*Italic text*  
***Bold + Italic***  
~~Strikethrough~~  
==Highlighted text==  
`inline code`

---

## Callouts

> [!note]
> Standard **note** callout.

> [!info]
> Informational callout.

> [!warning]
> Warning callout for caution.

> [!danger]
> Danger callout for critical items.

---

## Links

- Internal: [[Some Note]]
- Internal with alias: [[Some Note|Display Alias]]

---

## Code Block

```javascript
const task = {
  priority: 2,
  business: 3,
  checklist: ["Item 1", "Item 2"]
};
```

---

## Frontmatter (YAML)

```yaml
cssclasses: [native, module, ordus]
ordus-priority: "2"
ordus-business: "3"
ordus-checklist:
  - Review quarterly goals
  - Update project documentation
  - Fix sidebar layout bug
  - Add dark mode toggle
ordus-checklist-done:
  - Set up CI/CD pipeline
  - Write unit tests for API
ordus-checklist-input: ""
```

---

## Verification Checklist

- [ ] Priority slider (1–4) renders with `priority-bar` class
- [ ] Business slider (1–5) renders with `business-bar` class
- [ ] Alias text input shows placeholder "Name this Task!"
- [ ] Description editor renders a rich text area
- [ ] Checklist input field shows placeholder "New item…"
- [ ] `+ Add` button is clickable and adds items to the checklist
- [ ] `- Remove Last` button removes the last item
- [ ] `Remove All` button clears all items
- [ ] New items appear in the checklist UI immediately (shared state, no 2.5s lag)
- [ ] Checking/unchecking items moves them between active and done lists
- [ ] Pre-existing items from frontmatter (`ordus-checklist`, `ordus-checklist-done`) render on load
- [ ] Module theming (Ordus) colors all interactive elements

> **Architecture note:** The checklist uses dual-state: `window._ordusChecklist[filePath]` for instant UI feedback + `app.fileManager.processFrontMatter()` for async persistence. This bypasses the Dataview metadata cache lag (~2.5s). See `Meta/scripts/jsengine/ordus/checklist_add.js` and `Meta/scripts/view/dataview/interactive/dataview_ordus_task_checklist.js`.
