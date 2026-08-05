const activeFile = app.workspace.getActiveFile();
if (!activeFile) return;

const projName = activeFile.basename;
const pmName = `${projName}-PM`;
const childFolder = "04 - Λ - Devs/04 - Postmortems";
const pmPath = `${childFolder}/${pmName}.md`;
const templatePath = "Meta/templates/devs/t_postmortem.md";

const existing = app.vault.getAbstractFileByPath(pmPath);
if (existing) {
  await app.workspace.getLeaf(false).openFile(existing);
  return;
}

const plugin = app.plugins.getPlugin('templater-obsidian');
let api = null;
for (const k of Object.keys(plugin)) {
  const v = plugin[k];
  if (v?.create_new_note_from_template) { api = v; break; }
}

const template = app.vault.getAbstractFileByPath(templatePath);
const folder = app.vault.getAbstractFileByPath(childFolder);
await api.create_new_note_from_template(template, folder, pmName, true);
