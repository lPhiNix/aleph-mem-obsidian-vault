`BUTTON[prev-year, next-year]`
```meta-bind-button
id: prev-year
style: primary
label: <- Previous Year
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/05 - Yearly/<% fileDate = moment(tp.file.title, 'YYYY').subtract(1, 'year').format('YYYY') %>]]"
    newTab: false
```
```meta-bind-button
id: next-year
style: primary
label: Next Year ->
hidden: true
actions:
    - type: open
      link: "[[02 - Ψ - Memorium/05 - Yearly/<% fileDate = moment(tp.file.title, 'YYYY').add(1, 'year').format('YYYY') %>]]"
      newTab: false
```