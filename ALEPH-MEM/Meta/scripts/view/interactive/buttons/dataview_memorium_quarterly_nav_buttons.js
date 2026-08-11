const title = dv.current().file.name;
const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

function navBtn(label, targetPath) {
  const btn = btnGroup.createEl("button", { cls: "nav-button" });
  btn.textContent = label;
  btn.addEventListener("click", () => app.workspace.openLinkText(targetPath, "", false));
}

const prevQuarter = moment(title, "YYYY-[Q]Q").subtract(1, "quarter");
navBtn("‹ Previous Quarter", `02 - Ψ - Memorium/04 - Quarterly/${prevQuarter.format("YYYY/YYYY-[Q]Q")}`);

navBtn("This Year", `02 - Ψ - Memorium/05 - Yearly/${moment(title, "YYYY-[Q]Q").format("YYYY")}`);

const nextQuarter = moment(title, "YYYY-[Q]Q").add(1, "quarter");
navBtn("Next Quarter ›", `02 - Ψ - Memorium/04 - Quarterly/${nextQuarter.format("YYYY/YYYY-[Q]Q")}`);
