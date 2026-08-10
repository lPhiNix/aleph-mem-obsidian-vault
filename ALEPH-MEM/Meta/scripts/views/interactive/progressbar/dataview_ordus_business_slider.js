const KEY = "ordus-business";
const MIN = 1, MAX = 5, STEP = 1;

const file = app.vault.getAbstractFileByPath(dv.current().file.path);
let value = dv.current()[KEY] ?? MIN;
value = Math.min(MAX, Math.max(MIN, value));

const container = dv.container.createEl("div", { cls: "business-bar progress-bar-input" });
container.setAttribute("tabindex", "0");

const fill = container.createEl("div", { cls: "progress-bar-progress" });
const valSpan = container.createEl("span", { cls: "progress-bar-value" });
valSpan.textContent = value;
container.setAttribute("data-internal-value", value);
const leftSpan = container.createEl("span", { cls: "progress-bar-label-left" });
leftSpan.textContent = MIN;
const rightSpan = container.createEl("span", { cls: "progress-bar-label-right" });
rightSpan.textContent = MAX;

function pct(v) { return ((v - MIN) / (MAX - MIN)) * 100; }
function update(v) {
  fill.style.width = `${pct(v)}%`;
  valSpan.textContent = v;
  container.setAttribute("data-internal-value", v);
}
update(value);

let dragging = false;
function posToVal(e) {
  const rect = container.getBoundingClientRect();
  const x = Math.min(rect.right, Math.max(rect.left, e.clientX));
  const val = Math.round(((x - rect.left) / rect.width) * (MAX - MIN) / STEP + MIN) * STEP;
  return Math.min(MAX, Math.max(MIN, val));
}

container.addEventListener("mousedown", e => { dragging = true; set(posToVal(e)); e.preventDefault(); });
container.addEventListener("touchstart", e => { dragging = true; set(posToVal(e.touches[0])); e.preventDefault(); });
window.addEventListener("mousemove", e => { if (dragging) set(posToVal(e)); });
window.addEventListener("touchmove", e => { if (dragging) set(posToVal(e.touches[0])); });
window.addEventListener("mouseup", () => { dragging = false; });
window.addEventListener("touchend", () => { dragging = false; });
container.addEventListener("dragstart", e => { e.preventDefault(); });

async function set(v) {
  if (v === value) return;
  value = v;
  update(v);
  await app.fileManager.processFrontMatter(file, fm => { fm[KEY] = v; });
}
