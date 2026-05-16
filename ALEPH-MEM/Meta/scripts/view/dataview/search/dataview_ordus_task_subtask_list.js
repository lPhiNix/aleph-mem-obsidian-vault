/**********************
 * ORDUS SUBTASK LIST
 * Muestra las subtareas enlazadas a la tarea actual.
 * Una nota es subtarea si enlaza (outlink) a la tarea actual.
 **********************/

const current = dv.current();
const linked = new Set([
  ...current.file.inlinks.map(l => l.path),
  ...current.file.outlinks.map(l => l.path)
]);

const subtasks = dv.pages('"07 - Π - Ordus/subtasks"')
  .where(p => linked.has(p.file.path))
  .sort(p => p["ordus-priority"] ?? 0, "desc");

dv.table(
  ["Task", "Name"],
  subtasks.map(p => [
    p.file.link,
    p.alias ?? "—"
  ])
);
