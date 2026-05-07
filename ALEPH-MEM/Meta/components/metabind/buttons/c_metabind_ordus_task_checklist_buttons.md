`BUTTON[add-checklist-item, remove-checklist-item]`
```meta-bind-button
id: add-checklist-item
style: primary
label: + Add
hidden: true
actions:
  - type: inlineJS
    code: |
      const file = context.file;
      const fm = app.metadataCache.getFileCache(file)?.frontmatter;
      const newItem = (fm?.["ordus-checklist-new-item"] || "").trim();
      if (!newItem) return;
      await app.fileManager.processFrontMatter(file, f => {
        if (!Array.isArray(f["ordus-checklist"])) f["ordus-checklist"] = [];
        f["ordus-checklist"].push(newItem);
        f["ordus-checklist-new-item"] = "";
      });
```
```meta-bind-button
id: remove-checklist-item
style: primary
label: "- Remove Last"
hidden: true
actions:
  - type: inlineJS
    code: |
      const file = context.file;
      await app.fileManager.processFrontMatter(file, f => {
        if (!Array.isArray(f["ordus-checklist"]) || f["ordus-checklist"].length === 0) return;
        const removed = f["ordus-checklist"].pop();
        if (Array.isArray(f["ordus-checklist-done"])) {
          const idx = f["ordus-checklist-done"].indexOf(removed);
          if (idx > -1) f["ordus-checklist-done"].splice(idx, 1);
        }
      });
```
