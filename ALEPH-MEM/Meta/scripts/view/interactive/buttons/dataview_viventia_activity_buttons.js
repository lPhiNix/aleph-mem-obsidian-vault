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

actionBtn("+ New Session").addEventListener("click", async () => {
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) return;
  const folderPath = "05 - Ζ - Viventia/03 - Sessions";
  const title = `${moment().format("YYYYMMDDHHmm")}-${activeFile.basename}`;
  const existing = app.vault.getAbstractFileByPath(`${folderPath}/${title}.md`);
  if (existing) {
    await app.workspace.getLeaf(false).openFile(existing);
    return;
  }
  const template = app.vault.getAbstractFileByPath("Meta/templates/viventia/t_session.md");
  const folder = resolveAndEnsureFolder(folderPath);
  await api.create_new_note_from_template(template, folder, title, true);
});

actionBtn("+ New Analysis").addEventListener("click", async () => {
  const template = app.vault.getAbstractFileByPath("Meta/templates/viventia/t_analysis.md");
  const folder = resolveAndEnsureFolder("05 - Ζ - Viventia/04 - Analysis");
  await api.create_new_note_from_template(template, folder, null, true);
});
