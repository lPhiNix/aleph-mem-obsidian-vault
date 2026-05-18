/**********************
 * MONTHLY WEEK LIST
 * Notas diarias enlazadas a esta nota mensual
 **********************/

const current = dv.current();
const linked = new Set([
  ...current.file.inlinks.map(l => l.path),
  ...current.file.outlinks.map(l => l.path)
]);

const pages = dv.pages('"02 - Ψ - Memorium/01 - Daily"')
  .where(p => linked.has(p.file.path))
  .sort(p => p.file.name, "asc");

dv.table(
  ["File", "Alias", "Rating"],
  pages.map(p => [p.file.link, p.alias, p["memorium-day-rating"]])
);
