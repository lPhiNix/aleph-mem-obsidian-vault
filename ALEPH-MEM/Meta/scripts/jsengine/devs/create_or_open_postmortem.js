const activeFile = app.workspace.getActiveFile();
if (!activeFile) return;

const projName = activeFile.basename;
const pmName = `${projName}-PM`;
const pmFolder = "04 - Λ - Devs/04 - Postmortems";
const pmPath = `${pmFolder}/${pmName}.md`;

const existingFile = app.vault.getAbstractFileByPath(pmPath);
if (existingFile) {
  await app.workspace.getLeaf(false).openFile(existingFile);
  return;
}

const file = await app.vault.create(pmPath, "");

for (let i = 0; i < 30; i++) {
  await new Promise(r => setTimeout(r, 100));
  const content = await app.vault.read(file);
  if (content.trim().length > 0) break;
}

const readyFile = app.vault.getAbstractFileByPath(pmPath);
if (readyFile) {
  await app.workspace.getLeaf(false).openFile(readyFile);
}
