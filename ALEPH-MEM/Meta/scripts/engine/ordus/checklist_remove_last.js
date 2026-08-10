const file = context.file;

// Actualizar UI instantáneamente via estado compartido
const state = window._ordusChecklist?.[file.path];
if (state) state.removeLast();

// Persistir en frontmatter en segundo plano
await app.fileManager.processFrontMatter(file, f => {
  if (!Array.isArray(f["ordus-checklist"]) || f["ordus-checklist"].length === 0) return;
  const removed = f["ordus-checklist"].pop();
  if (Array.isArray(f["ordus-checklist-done"])) {
    const idx = f["ordus-checklist-done"].indexOf(removed);
    if (idx > -1) f["ordus-checklist-done"].splice(idx, 1);
  }
});