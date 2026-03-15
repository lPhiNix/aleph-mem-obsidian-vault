/**********************
 * WEEKLY THROWBACK
 * Notas semanales de la misma semana en otros años
 **********************/

const current = dv.current();
const currentSuffix = current.file.name.replace(/^\d{4}-/, "");

const pages = dv.pages('"02 - Ψ - Memorium/weekly"')
  .where(p =>
    p.file.name !== current.file.name &&
    p.file.name.replace(/^\d{4}-/, "") === currentSuffix
  )
  .sort(p => p.file.name, "asc");

dv.table(
  ["File", "Alias"],
  pages.map(p => [p.file.link, p.alias])
);
