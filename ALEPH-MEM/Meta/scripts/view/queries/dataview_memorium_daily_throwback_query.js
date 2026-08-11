/**********************
 * DAILY THROWBACK
 * Notas diarias del mismo día en otros años
 **********************/

const current = dv.current();
const currentMMDD = current.file.day.toFormat("MM-dd");

const pages = dv.pages('"02 - Ψ - Memorium/01 - Daily"')
  .where(p => {
    if (p.file.name === current.file.name) return false;
    const date = p["memorium-date"];
    if (!date) return false;
    return date.toFormat("MM-dd") === currentMMDD;
  })
  .sort(p => p.file.name, "asc");

dv.table(
  ["File", "Alias", "Rating"],
  pages.map(p => [p.file.link, p.aliases, p["memorium-day-rating"]])
);