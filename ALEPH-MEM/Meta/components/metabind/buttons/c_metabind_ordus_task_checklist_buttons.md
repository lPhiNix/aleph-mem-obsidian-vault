`BUTTON[checklist-add, checklist-remove-last]`
```meta-bind-button
id: checklist-add
class: nav-buttons
style: primary
label: + Add
hidden: true
actions:
  - type: updateMetadata
    bindTarget: ordus-checklist
    evaluate: true
    value: '(function(list){ var f = app.workspace.getActiveFile(); var cache = app.metadataCache.getFileCache(f.path) || {}; var fm = cache.frontmatter || {}; var v = String(fm["ordus-checklist-input"] || "").trim(); return v && !list.includes(v) ? list.concat([v]) : list; })(x || [])'
  - type: updateMetadata
    bindTarget: ordus-checklist-input
    evaluate: false
    value: ""
```
```meta-bind-button
id: checklist-remove-last
class: nav-buttons
style: primary
label: − Remove Last
hidden: true
actions:
  - type: updateMetadata
    bindTarget: ordus-checklist
    evaluate: true
    value: '(x || []).slice(0, -1)'
```