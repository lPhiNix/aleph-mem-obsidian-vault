/**********************
 * YEARLY THROWBACK
 * Notas anuales de otros años
 **********************/

const current = dv.current();

const pages = dv.pages('"02 - Ψ - Memorium/05 - Yearly"')
  .where(p => p.file.name !== current.file.name)
  .sort(p => p.file.name, "asc");

dv.table(
  ["File", "Alias"],
  pages.map(p => [p.file.link, p.aliases])
);
