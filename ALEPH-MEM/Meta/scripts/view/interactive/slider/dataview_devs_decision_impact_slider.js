const KEY = "devs-decision-impact";
const MIN = 1, MAX = 3, STEP = 1;
const LABELS = {"1":"Low","2":"Medium","3":"High"};

const file = app.vault.getAbstractFileByPath(dv.current().file.path);
let raw = dv.current()[KEY];
let value = MIN;
if (raw !== undefined && raw !== null) {
  const entry = Object.entries(LABELS).find(([k, label]) => label === raw);
  if (entry) value = parseInt(entry[0]);
}
value = Math.min(MAX, Math.max(MIN, value));

const container = dv.container.createEl("div", { cls: "devs-impact-slider slider-input" });
container.setAttribute("tabindex", "0");

const fill = container.createEl("div", { cls: "slider-progress" });
const valSpan = container.createEl("span", { cls: "slider-value" });
valSpan.textContent = value;
container.setAttribute("data-internal-value", value);
const leftSpan = container.createEl("span", { cls: "slider-label-left" });
leftSpan.textContent = MIN;
const rightSpan = container.createEl("span", { cls: "slider-label-right" });
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
  await app.fileManager.processFrontMatter(file, fm => { fm[KEY] = LABELS[v]; });
}
