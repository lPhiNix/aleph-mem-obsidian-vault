const activeFile = app.workspace.getActiveFile();
if (!activeFile) return;

const childFolder = "04 - Λ - Devs/02 - Binnacles";
const templatePath = "Meta/templates/devs/t_binnacle.md";

const plugin = app.plugins.getPlugin('templater-obsidian');
let api = null;
for (const k of Object.keys(plugin)) {
  const v = plugin[k];
  if (v?.create_new_note_from_template) { api = v; break; }
}

const template = app.vault.getAbstractFileByPath(templatePath);
const folder = app.vault.getAbstractFileByPath(childFolder);
await api.create_new_note_from_template(template, folder, null, true);
