const activeFile = app.workspace.getActiveFile();
if (!activeFile) return;

const childFolder = "07 - Π - Ordus/03 - Subtasks";
const templatePath = "Meta/templates/ordus/t_subtask.md";

const plugin = app.plugins.getPlugin('templater-obsidian');
let api = null;
for (const k of Object.keys(plugin)) {
  const v = plugin[k];
  if (v?.create_new_note_from_template) { api = v; break; }
}

const template = app.vault.getAbstractFileByPath(templatePath);
let folder = app.vault.getAbstractFileByPath(childFolder);
if (!folder) folder = await app.vault.createFolder(childFolder);
await api.create_new_note_from_template(template, folder, null, true);