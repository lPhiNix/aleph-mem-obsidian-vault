```dataviewjs
const file = app.vault.getAbstractFileByPath(dv.current().file.path);
const fm = app.metadataCache.getFileCache(file)?.frontmatter;
const val = fm?.aliases?.[0] ?? "";

const input = dv.container.createEl("input", {
  type: "text",
  placeholder: "Name this Month!",
  cls: "input-alias"
});
input.value = val;

input.addEventListener("input", async () => {
  await app.fileManager.processFrontMatter(file, fm => {
    fm.aliases = input.value.trim() ? [input.value.trim()] : [];
  });
});
```
