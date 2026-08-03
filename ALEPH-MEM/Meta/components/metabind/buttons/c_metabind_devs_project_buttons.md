`BUTTON[new-binnacle, new-decision, new-postmortem]`
```meta-bind-button
id: new-binnacle
style: primary
label: + New Binnacle
hidden: true
actions:
  - type: templaterCreateNote
    templateFile: "Meta/templates/devs/t_binnacle.md"
    folderPath: "04 - Λ - Devs/02 - Binnacles"
    openNote: true
```
```meta-bind-button
id: new-decision
style: primary
label: + New Decision
hidden: true
actions:
  - type: templaterCreateNote
    templateFile: "Meta/templates/devs/t_decision.md"
    folderPath: "04 - Λ - Devs/03 - Decisions"
    openNote: true
```
```meta-bind-button
id: new-postmortem
style: primary
label: + New Postmortem
hidden: true
actions:
  - type: templaterCreateNote
    templateFile: "Meta/templates/devs/t_postmortem.md"
    folderPath: "04 - Λ - Devs/04 - Postmortems"
    openNote: true
```
