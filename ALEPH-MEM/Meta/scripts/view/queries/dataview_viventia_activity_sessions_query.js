/**********************
 * VIVENTIA ACTIVITY SESSIONS
 * Sesiones enlazadas a la actividad actual
 **********************/

const current = dv.current();
const linked = new Set([
  ...current.file.inlinks.map(l => l.path),
  ...current.file.outlinks.map(l => l.path)
]);

const sessions = dv.pages('"05 - Ζ - Viventia/03 - Sessions"')
  .where(p => linked.has(p.file.path))
  .sort(p => p.creation, "desc");

dv.table(
  ["File", "Alias", "Rating", "Created"],
  sessions.map(p => [
    p.file.link,
    p.aliases ?? "—",
    p["viventia-rating"] ?? "—",
    p.creation
  ])
);
