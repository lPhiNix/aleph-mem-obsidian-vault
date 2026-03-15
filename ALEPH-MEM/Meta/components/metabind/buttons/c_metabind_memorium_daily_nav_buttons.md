`BUTTON[prev-day, current-week, current-month, next-day]`
```meta-bind-button
id: prev-day
class: nav-buttons
style: primary
label: <- Yesterday
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/daily/<% fileDate = moment(tp.file.title, 'YYYY-MM-DD-dddd').subtract(1, 'd').format('YYYY/MM-MMMM/YYYY-MM-DD-dddd') %>]]"
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
    link: "[[02 - Ψ - Memorium/weekly/<% moment(tp.file.title, 'YYYY-MM-DD-dddd').isoWeekday(4).format('GGGG/GGGG-[W]WW') %>]]"
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
    link: "[[02 - Ψ - Memorium/monthly/<% moment(tp.file.title, 'YYYY-MM-DD-dddd').format('YYYY/YYYY-MM-MMMM') %>]]"
    newTab: false
```
```meta-bind-button
id: next-day
style: primary
class: nav-buttons
label: Tomorrow ->
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/daily/<% fileDate = moment(tp.file.title, 'YYYY-MM-DD-dddd').add(1, 'd').format('YYYY/MM-MMMM/YYYY-MM-DD-dddd') %>]]"
    newTab: false
```