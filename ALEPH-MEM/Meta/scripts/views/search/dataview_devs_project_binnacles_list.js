/**********************
 * DEVS PROJECT BINNACLES LIST
 * Bitácoras enlazadas al proyecto actual
 **********************/

const current = dv.current();
const linked = new Set([
  ...current.file.inlinks.map(l => l.path),
  ...current.file.outlinks.map(l => l.path)
]);

const binnacles = dv.pages('"04 - Λ - Devs/02 - Binnacles"')
  .where(p => linked.has(p.file.path))
  .sort(p => p.creation, "desc");

dv.table(
  ["File", "Alias", "Status", "Created"],
  binnacles.map(p => [
    p.file.link,
    p.aliases ?? "—",
    p["devs-binnacle-status"] ?? "—",
    p.creation
  ])
);
