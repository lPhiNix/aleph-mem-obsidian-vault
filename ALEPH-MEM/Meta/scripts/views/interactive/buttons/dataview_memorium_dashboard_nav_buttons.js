const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

function navBtn(label, targetPath) {
  const btn = btnGroup.createEl("button", { cls: "nav-button" });
  btn.textContent = label;
  btn.addEventListener("click", () => app.workspace.openLinkText(targetPath, "", false));
}

const now = moment();
navBtn("Today", `02 - Ψ - Memorium/01 - Daily/${now.format("YYYY/MM-MMMM/YYYY-MM-DD-dddd")}`);
navBtn("This Week", `02 - Ψ - Memorium/02 - Weekly/${now.isoWeekday(4).format("GGGG/GGGG-[W]WW")}`);
navBtn("This Month", `02 - Ψ - Memorium/03 - Monthly/${now.format("YYYY/YYYY-MM-MMMM")}`);
navBtn("This Quarterly", `02 - Ψ - Memorium/04 - Quarterly/${now.format("YYYY/YYYY-[Q]Q")}`);
navBtn("This Year", `02 - Ψ - Memorium/05 - Yearly/${now.format("YYYY")}`);
