/**********************
 * YEARLY QUARTER LIST
 * Notas trimestrales enlazadas a esta nota anual
 **********************/

const current = dv.current();
const linked = new Set([
  ...current.file.inlinks.map(l => l.path),
  ...current.file.outlinks.map(l => l.path)
]);

const pages = dv.pages('"02 - Ψ - Memorium/04 - Quarterly"')
  .where(p => linked.has(p.file.path))
  .sort(p => p.file.name, "asc");

dv.table(
  ["File", "Alias"],
  pages.map(p => [p.file.link, p.alias])
);
