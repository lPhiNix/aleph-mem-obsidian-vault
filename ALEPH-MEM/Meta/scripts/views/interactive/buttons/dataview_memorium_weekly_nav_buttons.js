const title = dv.current().file.name;
const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

function navBtn(label, targetPath) {
  const btn = btnGroup.createEl("button", { cls: "nav-button" });
  btn.textContent = label;
  btn.addEventListener("click", () => app.workspace.openLinkText(targetPath, "", false));
}

const prevWeek = moment(title, "GGGG-[W]WW").subtract(1, "w");
navBtn("‹ Previous Week", `02 - Ψ - Memorium/02 - Weekly/${prevWeek.format("GGGG/GGGG-[W]WW")}`);

const nextWeek = moment(title, "GGGG-[W]WW").add(1, "w");
navBtn("Next Week ›", `02 - Ψ - Memorium/02 - Weekly/${nextWeek.format("GGGG/GGGG-[W]WW")}`);
