`BUTTON[new-subtask]`
```meta-bind-button
id: new-subtask
style: primary
label: + New Subtask
hidden: true
actions:
  - type: templaterCreateNote
    templateFile: "Meta/templates/ordus/t_subtask.md"
    folderPath: "07 - Π - Ordus/03 - Subtasks"
    openNote: true
```