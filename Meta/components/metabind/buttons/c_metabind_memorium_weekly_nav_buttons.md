`BUTTON[prev-week, current-month, next-week]`
```meta-bind-button
id: prev-week
style: primary
class: phone-responsive
label: ← Previous Week
hidden: true
actions:
  - type: open
    link: "[[<%* tR += tp.user.router.memorium().weekly %>/<% moment(tp.file.title, 'GGGG-[W]WW').subtract(1, 'w').format('GGGG') %>/<% moment(tp.file.title, 'GGGG-[W]WW').subtract(1, 'w').format('GGGG-[W]WW') %>]]"
    newTab: false
```
```meta-bind-button
id: current-month
style: primary
class: phone-responsive
label: This Month
hidden: true
actions:
  - type: open
    link: "[[<%* tR += tp.user.router.memorium().monthly %>/<% moment(tp.file.title, 'GGGG-[W]WW').isoWeekday(4).format('YYYY/YYYY-MM-MMMM') %>]]"
    newTab: false
```
```meta-bind-button
id: next-week
style: primary
class: phone-responsive
label: Next Week →
hidden: true
actions:
  - type: open
    link: "[[<%* tR += tp.user.router.memorium().weekly %>/<% moment(tp.file.title, 'GGGG-[W]WW').add(1, 'w').format('GGGG') %>/<% moment(tp.file.title, 'GGGG-[W]WW').add(1, 'w').format('GGGG-[W]WW') %>]]"
    newTab: false
```