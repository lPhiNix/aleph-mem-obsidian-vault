const file = context.file;

// Actualizar UI instantáneamente via estado compartido
const state = window._ordusChecklist?.[file.path];
if (state) state.removeAll();

// Persistir en frontmatter en segundo plano
await app.fileManager.processFrontMatter(file, f => {
  f["ordus-checklist"] = [];
  f["ordus-checklist-done"] = [];
});