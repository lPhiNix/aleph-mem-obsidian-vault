/**********************
 * DEVS PROJECT DECISIONS LIST
 * Decisiones enlazadas al proyecto actual
 **********************/

const current = dv.current();
const linked = new Set([
  ...current.file.inlinks.map(l => l.path),
  ...current.file.outlinks.map(l => l.path)
]);

const decisions = dv.pages('"04 - Λ - Devs/03 - Decisions"')
  .where(p => linked.has(p.file.path))
  .sort(p => p.creation, "desc");

dv.table(
  ["File", "Alias", "Impact", "Created"],
  decisions.map(p => [
    p.file.link,
    p.aliases ?? "—",
    p["devs-decision-impact"] ?? "—",
    p.creation
  ])
);
