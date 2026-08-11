/**********************
 * MONTHLY THROWBACK
 * Notas mensuales del mismo mes en otros años
 **********************/

const current = dv.current();
const currentMM = current["memorium-date"].toFormat("MM");

const pages = dv.pages('"02 - Ψ - Memorium/03 - Monthly"')
  .where(p => {
    if (p.file.name === current.file.name) return false;
    const date = p["memorium-date"];
    if (!date) return false;
    return date.toFormat("MM") === currentMM;
  })
  .sort(p => p.file.name, "asc");

dv.table(
  ["File", "Alias"],
  pages.map(p => [p.file.link, p.aliases])
);