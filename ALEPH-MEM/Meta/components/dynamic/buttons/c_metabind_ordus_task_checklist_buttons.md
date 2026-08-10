`BUTTON[add-checklist-item, remove-checklist-item, remove-all-checklist-items]`
```meta-bind-button
id: add-checklist-item
style: primary
label: + Add
hidden: true
actions:
  - type: js
    file: Meta/scripts/engine/ordus/checklist_add.js
```
```meta-bind-button
id: remove-checklist-item
style: primary
label: "- Remove Last"
hidden: true
actions:
  - type: js
    file: Meta/scripts/engine/ordus/checklist_remove_last.js
```
```meta-bind-button
id: remove-all-checklist-items
style: primary
label: Remove All
hidden: true
actions:
  - type: js
    file: Meta/scripts/engine/ordus/checklist_remove_all.js
```