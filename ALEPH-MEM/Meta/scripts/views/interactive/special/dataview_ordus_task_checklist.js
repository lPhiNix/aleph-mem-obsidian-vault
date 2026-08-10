/**********************
 * ORDUS TASK CHECKLIST
 * Solo renderiza la lista. El input y los botones son
 * componentes MetaBind externos (c_metabind_ordus_checklist_*).
 * Estado local en memoria para evitar lag de metadataCache en checkboxes.
 * Estado compartido via window._ordusChecklist para que los botones
 * actualicen la vista sin esperar el ciclo de re-render de Dataview.
 **********************/

const current = dv.current();
const file = app.vault.getAbstractFileByPath(current.file.path);

// Estado local (fuente de verdad para el render)
let items = Array.from(current["ordus-checklist"] || []);
let doneItems = Array.from(current["ordus-checklist-done"] || []);

// --- Contenedor de la lista ---
const ul = dv.el("ul", "", { cls: "contains-task-list" });

// --- Funcion de renderizado (usa estado local) ---
function renderList() {
  ul.empty();
  const doneSet = new Set(doneItems);

  for (const item of items) {
    const checked = doneSet.has(item);
    const li = ul.createEl("li", {
      cls: "task-list-item" + (checked ? " is-checked" : ""),
      attr: { "data-task": checked ? "x" : " ", style: "display:flex;align-items:flex-start;gap:6px;" }
    });
    const cb = li.createEl("input", {
      cls: "task-list-item-checkbox",
      attr: { type: "checkbox", style: "flex-shrink:0;margin-top:3px;" }
    });
    cb.checked = checked;
    li.createEl("span", { text: item, attr: { style: "flex:1;word-break:break-word;" } });

    cb.addEventListener("click", async (e) => {
      e.stopPropagation();
      const nowChecked = cb.checked;
      li.toggleClass("is-checked", nowChecked);
      li.dataset.task = nowChecked ? "x" : " ";
      // Actualizar estado local
      if (nowChecked) {
        if (!doneItems.includes(item)) doneItems.push(item);
      } else {
        const idx = doneItems.indexOf(item);
        if (idx > -1) doneItems.splice(idx, 1);
      }
      // Persistir en frontmatter
      await app.fileManager.processFrontMatter(file, fm => {
        fm["ordus-checklist-done"] = doneItems.slice();
      });
    });
  }
}

renderList();

// Registrar estado compartido para que los botones (JSEngine) accedan sin re-render
if (!window._ordusChecklist) window._ordusChecklist = {};
window._ordusChecklist[current.file.path] = {
  getItems:     () => items,
  getDoneItems: () => doneItems,
  addItem:      (item) => { items.push(item); renderList(); },
  removeLast:   () => {
    if (items.length === 0) return;
    const removed = items.pop();
    const idx = doneItems.indexOf(removed);
    if (idx > -1) doneItems.splice(idx, 1);
    renderList();
  },
  removeAll:    () => { items = []; doneItems = []; renderList(); },
};
