`BUTTON[prev-week, next-week]`
```meta-bind-button
id: prev-week
style: primary
label: <- Previous Week
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/02 - Weekly/<% moment(tp.file.title, 'GGGG-[W]WW').subtract(1, 'w').format('GGGG') %>/<% moment(tp.file.title, 'GGGG-[W]WW').subtract(1, 'w').format('GGGG-[W]WW') %>]]"
    newTab: false
```
```meta-bind-button
id: next-week
style: primary
label: Next Week ->
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/02 - Weekly/<% moment(tp.file.title, 'GGGG-[W]WW').add(1, 'w').format('GGGG') %>/<% moment(tp.file.title, 'GGGG-[W]WW').add(1, 'w').format('GGGG-[W]WW') %>]]"
    newTab: false
```