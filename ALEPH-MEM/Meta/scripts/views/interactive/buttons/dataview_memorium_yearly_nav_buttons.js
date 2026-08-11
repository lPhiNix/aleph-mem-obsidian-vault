const title = dv.current().file.name;
const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

function navBtn(label, targetPath) {
  const btn = btnGroup.createEl("button", { cls: "nav-button" });
  btn.textContent = label;
  btn.addEventListener("click", () => app.workspace.openLinkText(targetPath, "", false));
}

const prevYear = moment(title, "YYYY").subtract(1, "year");
navBtn("‹ Previous Year", `02 - Ψ - Memorium/05 - Yearly/${prevYear.format("YYYY")}`);

const nextYear = moment(title, "YYYY").add(1, "year");
navBtn("Next Year ›", `02 - Ψ - Memorium/05 - Yearly/${nextYear.format("YYYY")}`);
