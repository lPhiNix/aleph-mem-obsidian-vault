const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

const btn = btnGroup.createEl("button", { cls: "nav-button-single" });
btn.textContent = "+ Create Activity";
btn.addEventListener("click", async () => {
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) return;
  const explorationName = activeFile.basename;
  const activitiesFolder = "05 - Ζ - Viventia/02 - Activities";

  const existing = app.vault.getFiles().find(f => {
    if (!f.path.startsWith(activitiesFolder + "/")) return false;
    const context = app.metadataCache.getFileCache(f)?.frontmatter?.context;
    if (!context) return false;
    const arr = Array.isArray(context) ? context : [context];
    return arr.some(c => String(c).includes(explorationName));
  });

  if (existing) {
    await app.workspace.getLeaf(false).openFile(existing);
    return;
  }

  const plugin = app.plugins.getPlugin("templater-obsidian");
  let api = null;
  for (const k of Object.keys(plugin)) {
    const v = plugin[k];
    if (v?.create_new_note_from_template) { api = v; break; }
  }
  if (!api) return;

  let folder = app.vault.getAbstractFileByPath(activitiesFolder);
  if (!folder) folder = await app.vault.createFolder(activitiesFolder);

  const template = app.vault.getAbstractFileByPath("Meta/templates/viventia/t_activity.md");
  await api.create_new_note_from_template(template, folder, null, true);
});
