const title = dv.current().file.name;
const btnGroup = dv.container.createEl("div", { cls: "nav-button-group" });

function navBtn(label, targetPath) {
  const btn = btnGroup.createEl("button", { cls: "nav-button" });
  btn.textContent = label;
  btn.addEventListener("click", () => app.workspace.openLinkText(targetPath, "", false));
}

const prevMonth = moment(title, "YYYY-MM").subtract(1, "month");
navBtn("‹ Previous Month", `02 - Ψ - Memorium/03 - Monthly/${prevMonth.format("YYYY/YYYY-MM")}`);

navBtn("This Quarter", `02 - Ψ - Memorium/04 - Quarterly/${moment(title, "YYYY-MM").format("YYYY/YYYY-[Q]Q")}`);

navBtn("This Year", `02 - Ψ - Memorium/05 - Yearly/${moment(title, "YYYY-MM").format("YYYY")}`);

const nextMonth = moment(title, "YYYY-MM").add(1, "month");
navBtn("Next Month ›", `02 - Ψ - Memorium/03 - Monthly/${nextMonth.format("YYYY/YYYY-MM")}`);
