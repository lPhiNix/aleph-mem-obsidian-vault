`BUTTON[ordus-back-board]`
```meta-bind-button
id: ordus-back-board
style: primary
label: Return Board
hidden: true
actions:
  - type: open
    link: "[[07 - Π - Ordus/boards/<% tp.file.title.replace(/-\d+$/, '') %>]]"
    newTab: false
```