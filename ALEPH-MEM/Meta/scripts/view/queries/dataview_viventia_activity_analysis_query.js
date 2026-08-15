/**********************
 * VIVENTIA ACTIVITY ANALYSIS
 * Análisis enlazados a la actividad actual
 **********************/

const current = dv.current();
const linked = new Set([
  ...current.file.inlinks.map(l => l.path),
  ...current.file.outlinks.map(l => l.path)
]);

const analyses = dv.pages('"05 - Ζ - Viventia/04 - Analysis"')
  .where(p => linked.has(p.file.path))
  .sort(p => p.creation, "desc");

dv.table(
  ["File", "Alias", "Created"],
  analyses.map(p => [
    p.file.link,
    p.aliases ?? "—",
    p.creation
  ])
);
