const file = context.file;
await app.fileManager.processFrontMatter(file, f => {
  f["ordus-checklist"] = [];
  f["ordus-checklist-done"] = [];
});
