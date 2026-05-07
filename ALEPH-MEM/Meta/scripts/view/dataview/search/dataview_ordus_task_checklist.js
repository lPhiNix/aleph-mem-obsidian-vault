/**********************
 * ORDUS TASK CHECKLIST
 * Input + botones + lista, todo en un componente DataView.
 * Estado local en memoria para evitar lag de metadataCache.
 **********************/

const current = dv.current();
const file = app.vault.getAbstractFileByPath(current.file.path);

// Claves para preservar estado entre re-renders de DataView
const stateKey = `ordus-checklist-input-${current.file.path}`;
const obsKey  = `ordus-checklist-obs-${current.file.path}`;

// MutationObserver: escucha hasta que aparezca el nuevo input y lo enfoca
function setupFocusRestore() {
  if (window[obsKey]) { window[obsKey].disconnect(); delete window[obsKey]; }
  const target = dv.container.parentElement || dv.container;
  const obs = new MutationObserver(() => {
    const newInput = target.querySelector(".ordus-checklist-text-input");
    if (newInput) { newInput.focus(); obs.disconnect(); delete window[obsKey]; }
  });
  obs.observe(target, { childList: true, subtree: true });
  window[obsKey] = obs;
}

// Estado local (fuente de verdad para el render)
let items = Array.from(current["ordus-checklist"] || []);
let doneItems = Array.from(current["ordus-checklist-done"] || []);

// --- Contenedor de la lista ---
const ul = dv.el("ul", "", { cls: "contains-task-list" });

// --- Contenedor vertical: input encima, botones debajo ---
const inputRow = dv.el("div", "", { cls: "ordus-checklist-input-row" });

const textInput = inputRow.createEl("input", {
  attr: { type: "text", placeholder: "New item..." },
  cls: "ordus-checklist-text-input"
});
// Restaurar el valor del input entre re-renders
textInput.value = window[stateKey] || "";
textInput.addEventListener("input", () => { window[stateKey] = textInput.value; });

const btnRow = inputRow.createEl("div", { cls: "mb-button-group" });

const addBtnWrap = btnRow.createEl("div", { cls: "mb-button" });
const addBtn = addBtnWrap.createEl("button", {
  text: "+ Add",
  cls: "mb-button-inner mod-cta"
});

const removeBtnWrap = btnRow.createEl("div", { cls: "mb-button" });
const removeBtn = removeBtnWrap.createEl("button", {
  text: "- Remove Last",
  cls: "mb-button-inner mod-cta"
});

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

// --- Boton Add ---
addBtn.addEventListener("click", async () => {
  const v = textInput.value.trim();
  if (!v) return;
  items.push(v);
  window[stateKey] = "";
  textInput.value = "";
  renderList();
  setupFocusRestore();
  await app.fileManager.processFrontMatter(file, fm => {
    fm["ordus-checklist"] = items.slice();
  });
});

// --- Boton Remove Last ---
removeBtn.addEventListener("click", async () => {
  if (items.length === 0) return;
  const removed = items[items.length - 1];
  items.pop();
  // Tambien quitar de doneItems si estaba marcado
  const idx = doneItems.indexOf(removed);
  if (idx > -1) doneItems.splice(idx, 1);
  renderList();
  await app.fileManager.processFrontMatter(file, fm => {
    fm["ordus-checklist"] = items.slice();
    fm["ordus-checklist-done"] = doneItems.slice();
  });
});
