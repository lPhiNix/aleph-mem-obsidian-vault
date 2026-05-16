const file = context.file;
const fm = app.metadataCache.getFileCache(file)?.frontmatter;
const newItem = (fm?.["ordus-checklist-input"] || "").trim();
if (!newItem) return;

// Actualizar UI instantáneamente via estado compartido
const state = window._ordusChecklist?.[file.path];
if (state) state.addItem(newItem);

// Persistir en frontmatter en segundo plano
await app.fileManager.processFrontMatter(file, f => {
  if (!Array.isArray(f["ordus-checklist"])) f["ordus-checklist"] = [];
  f["ordus-checklist"].push(newItem);
  f["ordus-checklist-input"] = "";
});
