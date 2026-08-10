---
version: "#3f1ec58769e0"
context:
cssclasses:
  - native
  - hide-all-frontmatter
  - huge-header-title
  - center-header-title
  - hide-inline-title
  - native
  - module
  - memorium
---

# Ψ
# Memorium
---
## ✦ Module

> 
> **_MEMORIUM (Ψ)_**
> _memories, past, that which is no longer_
> 
> Lorem ipsum dolor sit amet consectetur adipiscing elit laoreet pulvinar blandit, ridiculus varius lobortis viverra lacinia parturient gravida hac integer, turpis in congue imperdiet tellus dis etiam libero suscipit.
> 

## ✦ Contribution
---
```dataviewjs
await dv.view("Meta/scripts/views/graph/dataview_memorium_dashboard_contribution_heatmap");
```
---

## ✧ Navigation
`BUTTON[today, current-week, current-month, current-quarterly, current-year]`
```meta-bind-button
id: today
class: nav-buttons
style: primary
label: Today
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/01 - Daily/2026/03-March/2026-03-24-Tuesday]]"
    newTab: false
```
```meta-bind-button
id: current-week 
style: primary
class: nav-buttons
label: This Week
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/02 - Weekly/2026/2026-W13]]"
    newTab: false
```
```meta-bind-button
id: current-month
style: primary
class: nav-buttons
label: This Month
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/03 - Monthly/2026/2026-03-March]]"
    newTab: false
```
```meta-bind-button
id: current-quarterly
style: primary
class: nav-buttons
label: This Quarterly
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/04 - Quarterly/2026/2026-Q1]]"
    newTab: false
```
```meta-bind-button
id: current-year
style: primary
class: nav-buttons
label: This Year
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/05 - Yearly/2026]]"
    newTab: false
```