const KEY = "devs-binnacle-status";
const FIELD_CLASS = "devs-binnacle-segmented";
const OPTIONS = ["On Track", "Blocked", "Stuck"];

const file = app.vault.getAbstractFileByPath(dv.current().file.path);
const current = dv.current()[KEY];

const container = dv.container.createEl("div", { cls: `segmented-input ${FIELD_CLASS}` });
container.setAttribute("role", "radiogroup");

OPTIONS.forEach((label, i) => {
  const btn = container.createEl("button", { cls: "segmented-option" });
  btn.textContent = label;
  btn.setAttribute("data-value", String(i + 1));
  if (label === current) btn.classList.add("is-active");
  btn.addEventListener("click", async () => {
    await app.fileManager.processFrontMatter(file, fm => { fm[KEY] = label; });
    container.findAll(".segmented-option").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});
