const file = context.file;
await app.fileManager.processFrontMatter(file, f => {
  if (!Array.isArray(f["ordus-checklist"]) || f["ordus-checklist"].length === 0) return;
  const removed = f["ordus-checklist"].pop();
  if (Array.isArray(f["ordus-checklist-done"])) {
    const idx = f["ordus-checklist-done"].indexOf(removed);
    if (idx > -1) f["ordus-checklist-done"].splice(idx, 1);
  }
});
