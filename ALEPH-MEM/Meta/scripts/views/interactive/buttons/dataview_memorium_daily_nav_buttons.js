const title = dv.current().file.name;
const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

function navBtn(label, targetPath) {
  const btn = btnGroup.createEl("button", { cls: "nav-button" });
  btn.textContent = label;
  btn.addEventListener("click", () => app.workspace.openLinkText(targetPath, "", false));
}

const yesterday = moment(title, "YYYY-MM-DD-dddd").subtract(1, "d");
navBtn("‹ Yesterday", `02 - Ψ - Memorium/01 - Daily/${yesterday.format("YYYY/MM-MMMM/YYYY-MM-DD-dddd")}`);

navBtn("This Week", `02 - Ψ - Memorium/02 - Weekly/${moment(title, "YYYY-MM-DD-dddd").isoWeekday(4).format("GGGG/GGGG-[W]WW")}`);

navBtn("This Month", `02 - Ψ - Memorium/03 - Monthly/${moment(title, "YYYY-MM-DD-dddd").format("YYYY/YYYY-MM-MMMM")}`);

const tomorrow = moment(title, "YYYY-MM-DD-dddd").add(1, "d");
navBtn("Tomorrow ›", `02 - Ψ - Memorium/01 - Daily/${tomorrow.format("YYYY/MM-MMMM/YYYY-MM-DD-dddd")}`);
