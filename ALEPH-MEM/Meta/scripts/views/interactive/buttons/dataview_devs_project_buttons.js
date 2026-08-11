const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

function actionBtn(label) {
  const btn = btnGroup.createEl("button", { cls: "nav-button" });
  btn.textContent = label;
  return btn;
}

const plugin = app.plugins.getPlugin("templater-obsidian");
let api = null;
for (const k of Object.keys(plugin)) {
  const v = plugin[k];
  if (v?.create_new_note_from_template) { api = v; break; }
}

if (!api) return;

function resolveAndEnsureFolder(folderPath) {
  let f = app.vault.getAbstractFileByPath(folderPath);
  if (!f) app.vault.createFolder(folderPath);
  return app.vault.getAbstractFileByPath(folderPath);
}

actionBtn("+ New Binnacle").addEventListener("click", async () => {
  const template = app.vault.getAbstractFileByPath("Meta/templates/devs/t_binnacle.md");
  const folder = resolveAndEnsureFolder("04 - Λ - Devs/02 - Binnacles");
  await api.create_new_note_from_template(template, folder, null, true);
});

actionBtn("+ New Decision").addEventListener("click", async () => {
  const template = app.vault.getAbstractFileByPath("Meta/templates/devs/t_decision.md");
  const folder = resolveAndEnsureFolder("04 - Λ - Devs/03 - Decisions");
  await api.create_new_note_from_template(template, folder, null, true);
});

actionBtn("+ New Postmortem").addEventListener("click", async () => {
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) return;
  const pmName = `${activeFile.basename}-PM`;
  const childFolder = "04 - Λ - Devs/04 - Postmortems";
  const pmPath = `${childFolder}/${pmName}.md`;
  const existing = app.vault.getAbstractFileByPath(pmPath);
  if (existing) { await app.workspace.getLeaf(false).openFile(existing); return; }
  const template = app.vault.getAbstractFileByPath("Meta/templates/devs/t_postmortem.md");
  const folder = resolveAndEnsureFolder(childFolder);
  await api.create_new_note_from_template(template, folder, pmName, true);
});
