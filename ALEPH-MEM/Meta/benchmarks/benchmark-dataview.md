---
cssclasses:
  - native
  - module
  - memorium
tags:
  - benchmark
---

# Benchmark: DataviewJS

> **Purpose:** Tests all DataviewJS rendering: tables, lists, inline queries, note counts, and a mock heatmap widget. Verifies that `dv.view()` and inline DataviewJS blocks render correctly under the vault's CSS theming.

---

## Dataview: Table

Renders a table of all benchmark notes in this directory.

```dataviewjs
const benchmarks = dv.pages('"Meta/benchmarks"')
  .where(p => p.file.name.startsWith("benchmark"))
  .sort(p => p.file.name);

dv.table(
  ["Note", "Tags", "CSS Classes"],
  benchmarks.map(p => [
    p.file.link,
    p.tags ? p.tags.join(", ") : "",
    p.cssclasses ? p.cssclasses.join(", ") : ""
  ])
);
```

---

## Dataview: List

Lists all notes in the vault tagged with `benchmark`.

```dataviewjs
const tagged = dv.pages('"Meta/benchmarks"')
  .where(p => p.tags && p.tags.includes("benchmark"));

dv.list(tagged.file.link);
```

---

## Dataview: Summary / Note Count

```dataviewjs
const benchmarks = dv.pages('"Meta/benchmarks"')
  .where(p => p.file.name.startsWith("benchmark"));

const total = benchmarks.length;

dv.paragraph(`**Total benchmark notes:** ${total}`);
```

---

## Dataview: Mock Heatmap (Pure DataviewJS, no Chart.js CDN)

Simulates a contribution heatmap with 10 weeks of colored squares.

```dataviewjs
const container = dv.container;
const wrapper = container.createEl("div", { cls: "mock-heatmap" });

const title = wrapper.createEl("h3", { text: "Mock Contribution Heatmap" });
title.style.fontSize = "14px";
title.style.marginBottom = "8px";

// Color scale: gray (0) to bright green (10+)
function getColor(count) {
  if (count === 0) return "#1a1a2e";
  if (count <= 1) return "#0e4429";
  if (count <= 2) return "#006d32";
  if (count <= 3) return "#26a641";
  if (count <= 5) return "#39d353";
  return "#5ceb6a";
}

function getRatingColor(rating) {
  const colors = [
    "#1a1a2e", "#ef4444", "#f59e0b", "#fbbf24",
    "#a3e635", "#10b981", "#3b82f6", "#a855f7",
    "#c026d3", "#ec4899", "#f472b6"
  ];
  return colors[rating] || "#1a1a2e";
}

const grid = wrapper.createEl("div");
grid.style.display = "flex";
grid.style.flexDirection = "column";
grid.style.gap = "3px";

const WEEKS = 10;
const DAYS = 7;
const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

for (let row = 0; row < DAYS; row++) {
  const rowEl = grid.createEl("div");
  rowEl.style.display = "flex";
  rowEl.style.gap = "3px";
  rowEl.style.alignItems = "center";

  const label = rowEl.createEl("span");
  label.textContent = dayLabels[row];
  label.style.width = "28px";
  label.style.fontSize = "10px";
  label.style.color = "var(--text-faint)";

  for (let col = 0; col < WEEKS; col++) {
    const cell = rowEl.createEl("div");
    const count = Math.floor(Math.random() * 8);
    cell.style.width = "12px";
    cell.style.height = "12px";
    cell.style.borderRadius = "2px";
    cell.style.backgroundColor = getColor(count);
    cell.title = `Week ${col + 1}, Day ${row + 1}: ${count} notes`;
  }
}

// Legend
const legend = wrapper.createEl("div");
legend.style.display = "flex";
legend.style.gap = "4px";
legend.style.alignItems = "center";
legend.style.marginTop = "8px";
legend.style.fontSize = "10px";

const legendLabel = legend.createEl("span");
legendLabel.textContent = "Less";
legendLabel.style.color = "var(--text-faint)";

[0, 1, 2, 3, 5, 7].forEach(count => {
  const box = legend.createEl("div");
  box.style.width = "10px";
  box.style.height = "10px";
  box.style.borderRadius = "2px";
  box.style.backgroundColor = getColor(count);
});

const legendMore = legend.createEl("span");
legendMore.textContent = "More";
legendMore.style.color = "var(--text-faint)";
```

---

## Dataview: Mock Rating Chart

```dataviewjs
const container = dv.container;
const wrapper = container.createEl("div");
wrapper.style.marginTop = "16px";

const title = wrapper.createEl("h3", { text: "Mock Week Rating Chart" });
title.style.fontSize = "14px";
title.style.marginBottom = "8px";

const chartWrapper = wrapper.createEl("div");
chartWrapper.style.display = "flex";
chartWrapper.style.alignItems = "flex-end";
chartWrapper.style.gap = "4px";
chartWrapper.style.height = "120px";
chartWrapper.style.padding = "0 0 4px 0";
chartWrapper.style.borderBottom = "1px solid var(--hr-color)";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mockRatings = [7, 5, 8, 6, 9, 4, 7];

mockRatings.forEach((rating, i) => {
  const barWrapper = chartWrapper.createEl("div");
  barWrapper.style.display = "flex";
  barWrapper.style.flexDirection = "column";
  barWrapper.style.alignItems = "center";
  barWrapper.style.flex = "1";
  barWrapper.style.maxWidth = "40px";

  const bar = barWrapper.createEl("div");
  const height = rating * 10;
  bar.style.width = "100%";
  bar.style.height = `${height}px`;
  bar.style.borderRadius = "4px 4px 0 0";
  bar.style.transition = "height 0.3s";

  // Rating color mapping
  const colors = {
    1: "#4a4a4a", 2: "#ef4444", 3: "#f59e0b", 4: "#fbbf24",
    5: "#10b981", 6: "#3b82f6", 7: "#a855f7", 8: "#c026d3",
    9: "#ec4899", 10: "#f472b6"
  };
  bar.style.backgroundColor = colors[rating] || "#4a4a4a";

  const value = barWrapper.createEl("span");
  value.textContent = rating;
  value.style.fontSize = "10px";
  value.style.marginTop = "4px";
  value.style.color = "var(--text-muted)";

  const label = barWrapper.createEl("span");
  label.textContent = dayLabels[i];
  label.style.fontSize = "9px";
  label.style.color = "var(--text-faint)";
  label.style.marginTop = "2px";
});
```

---

## Headers

# H1 – Title

## H2 – Section

### H3 – Subsection

---

## Callouts

> [!note]
> Standard **note** callout.

> [!info]
> Informational callout.

> [!warning]
> Warning callout.

---

## Text Formatting

**Bold text** — *Italic text* — ~~Strikethrough~~ — ==Highlighted== — `inline code`

---

## Code Block

```javascript
const data = await dv.query("TABLE FROM #benchmark");
console.log(data);
```

---

## Frontmatter (YAML)

```yaml
cssclasses: [native, module, memorium]
tags: [benchmark]
```

---

## Verification Checklist

- [ ] "Dataview: Table" renders a table with columns: Note, Tags, CSS Classes
- [ ] "Dataview: List" renders a bullet list of benchmark notes
- [ ] "Dataview: Summary" shows a note count
- [ ] "Mock Heatmap" renders a 10-week grid of colored squares with legend
- [ ] "Mock Rating Chart" renders 7 colored bars (Mon–Sun) with labels
- [ ] All Dataview blocks render without errors (check the console)
- [ ] Module theming (Memorium) colors Dataview table headers and error boxes

> **Note:** The mock widgets use pure DataviewJS DOM manipulation (no Chart.js CDN). For real Chart.js rendering, see `benchmark-memorium-daily`.
