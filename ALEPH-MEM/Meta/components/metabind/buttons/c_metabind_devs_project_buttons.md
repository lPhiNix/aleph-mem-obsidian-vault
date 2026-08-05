`BUTTON[new-binnacle, new-decision, new-postmortem]`
```meta-bind-button
id: new-binnacle
style: primary
label: + New Binnacle
hidden: true
actions:
  - type: js
    file: Meta/scripts/jsengine/devs/binnacle.js
```
```meta-bind-button
id: new-decision
style: primary
label: + New Decision
hidden: true
actions:
  - type: js
    file: Meta/scripts/jsengine/devs/decision.js
```
```meta-bind-button
id: new-postmortem
style: primary
label: + New Postmortem
hidden: true
actions:
  - type: js
    file: Meta/scripts/jsengine/devs/postmortem.js
```