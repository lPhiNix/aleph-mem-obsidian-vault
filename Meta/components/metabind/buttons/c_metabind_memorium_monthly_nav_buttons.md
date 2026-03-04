`BUTTON[prev-month, current-quarter, current-year, next-month]`
```meta-bind-button
id: prev-month
style: primary
class: phone-responsive
label: <- Previous Month
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/monthly/<% fileDate = moment(tp.file.title, 'YYYY-MM-MMMM').subtract(1, 'month').format('YYYY/YYYY-MM-MMMM') %>]]"
    newTab: false
```
```meta-bind-button
id: current-quarter
style: primary
class: phone-responsive
label: This Quarter
hidden: true
actions:
    - type: open  
      link: "[[02 - Ψ - Memorium/quarterly/<% fileDate = moment(tp.file.title, 'YYYY-MM-MMMM').format('YYYY/YYYY-[Q]Q') %>]]"
      newTab: false
```
```meta-bind-button
id: current-year
style: primary
label: This Year
hidden: true
actions:
    - type: open  
      link: "[[02 - Ψ - Memorium/yearly/<% fileDate = moment(tp.file.title, 'YYYY-MM-MMMM').format('YYYY') %>]]"
      newTab: false
```
```meta-bind-button
id: next-month
style: primary
class: phone-responsive
label: Next Month ->
hidden: true
actions:
    - type: open
      link: "[[02 - Ψ - Memorium/monthly/<% fileDate = moment(tp.file.title, 'YYYY-MM-MMMM').add(1, 'month').format('YYYY/YYYY-MM-MMMM') %>]]"
      newTab: false
```