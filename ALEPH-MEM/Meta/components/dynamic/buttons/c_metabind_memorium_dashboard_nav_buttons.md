`BUTTON[today, current-week, current-month, current-quarterly, current-year]`
```meta-bind-button
id: today
class: nav-buttons
style: primary
label: Today
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/01 - Daily/<% moment().format('YYYY/MM-MMMM/YYYY-MM-DD-dddd') %>]]"
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
    link: "[[02 - Ψ - Memorium/02 - Weekly/<% moment().isoWeekday(4).format('GGGG/GGGG-[W]WW') %>]]"
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
    link: "[[02 - Ψ - Memorium/03 - Monthly/<% moment().format('YYYY/YYYY-MM-MMMM') %>]]"
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
    link: "[[02 - Ψ - Memorium/04 - Quarterly/<% moment().format('YYYY/YYYY-[Q]Q') %>]]"
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
    link: "[[02 - Ψ - Memorium/05 - Yearly/<% moment().format('YYYY') %>]]"
    newTab: false
```