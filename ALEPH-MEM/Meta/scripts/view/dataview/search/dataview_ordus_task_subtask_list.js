/**********************
 * ORDUS SUBTASK LIST
 * Muestra las subtareas enlazadas a la tarea actual.
 * Una nota es subtarea si enlaza (outlink) a la tarea actual.
 **********************/

const current = dv.current();

const subtasks = dv.pages('"07 - Π - Ordus/tasks"')
  .where(p =>
    p.file.path !== current.file.path &&
    p.file.outlinks.some(l => l.path === current.file.path)
  )
  .sort(p => p["ordus-priority"] ?? 0, "desc");

if (subtasks.length === 0) {
  dv.el("p", "No subtasks yet.", { cls: "ordus-empty" });
  return;
}

dv.table(
  ["Task", "Name"],
  subtasks.map(p => [
    p.file.link,
    p.alias ?? "—"
  ])
);
