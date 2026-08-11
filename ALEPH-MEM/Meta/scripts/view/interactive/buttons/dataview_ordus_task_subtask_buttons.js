const btn = dv.container.createEl("button", { cls: "nav-button-single" });
btn.textContent = "+ New Subtask";
btn.addEventListener("click", async () => {
  const plugin = app.plugins.getPlugin("templater-obsidian");
  let api = null;
  for (const k of Object.keys(plugin)) {
    const v = plugin[k];
    if (v?.create_new_note_from_template) { api = v; break; }
  }
  if (!api) return;

  const childFolder = "07 - Π - Ordus/03 - Subtasks";
  let folder = app.vault.getAbstractFileByPath(childFolder);
  if (!folder) folder = await app.vault.createFolder(childFolder);

  const template = app.vault.getAbstractFileByPath("Meta/templates/ordus/t_subtask.md");
  await api.create_new_note_from_template(template, folder, null, true);
});
