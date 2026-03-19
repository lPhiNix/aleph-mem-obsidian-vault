/**********************
 * MEMORIUM CONTRIBUTION HEATMAP
 * Heatmap de contribuciones del módulo Memorium
 * Trackea notas por fecha de creación (file.ctime)
 **********************/

/**********************
 * CONFIGURACIÓN
 **********************/
const CCONFIG = {
  CELL_SIZE: 18,
  GAP: 4,

  EMPTY_COLOR: "#2a2a2a",

  // Memorium yellow palette: 0=empty, 1=dark, 2=secondary, 3=primary, 4=highlight
  LEVEL_COLORS: ["#2a2a2a", "#7a6420", "#d4aa2e", "#ffe066", "#fff0b3"],

  // Min daily count to reach each level: L1≥1, L2≥3, L3≥6, L4≥10
  THRESHOLDS: [1, 3, 6, 10],

  ACCENT: "#ffe066",

  WEEKDAYS: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],

  PATH: '"02 - Ψ - Memorium"',

  get MONTH_FONT_SIZE() { return Math.max(8, this.CELL_SIZE * 0.9); },
  get WEEKDAY_FONT_SIZE() { return Math.max(8, this.CELL_SIZE * 0.9); }
};

/**********************
 * UTILIDADES
 **********************/
function cFmtKey(m) { return m.format("YYYY-MM-DD"); }
function cFmtMonth(m) { return m.format("YYYY-MM"); }
function cInRange(date, start, end) { return date.isBetween(start, end, "day", "[]"); }

function cColorForCount(count) {
  const [t1, t2, t3, t4] = CCONFIG.THRESHOLDS;
  const c = CCONFIG.LEVEL_COLORS;
  if (!count || count <= 0) return c[0];
  if (count < t2) return c[1];   // 1–2
  if (count < t3) return c[2];   // 3–5
  if (count < t4) return c[3];   // 6–9
  return c[4];                   // 10+
}

/**********************
 * GRID BUILDER
 **********************/
class ContribGridBuilder {
  static build(start, end) {
    const columns = [];
    let cur = start.clone().startOf("week");
    const last = end.clone().endOf("week");

    while (cur.isSameOrBefore(last)) {
      const week = this._week(cur);
      columns.push(...this._split(week, start, end, columns.length));
      cur.add(7, "days");
    }
    return columns;
  }

  static _week(start) {
    const days = [];
    const d = start.clone();
    for (let i = 0; i < 7; i++) { days.push(d.clone()); d.add(1, "d"); }
    return days;
  }

  static _split(week, yearStart, yearEnd, colIdx) {
    const byMonth = new Map();
    week.forEach((day, di) => {
      if (!cInRange(day, yearStart, yearEnd)) return;
      const mk = cFmtMonth(day);
      if (!byMonth.has(mk)) byMonth.set(mk, []);
      byMonth.get(mk).push({ day, di });
    });

    if (byMonth.size === 0) {
      return [{ days: week, month: null, isSplit: false, splitGroupId: null, isFirstSplit: false, isLastSplit: false }];
    }
    if (byMonth.size === 1) {
      const mk = Array.from(byMonth.keys())[0];
      return [{ days: week, month: mk, isSplit: false, splitGroupId: null, isFirstSplit: false, isLastSplit: false }];
    }

    const gid = `split_${colIdx}`;
    const months = Array.from(byMonth.keys()).sort();
    return months.map((mk, i) => {
      const col = Array(7).fill(null);
      byMonth.get(mk).forEach(({ day, di }) => { col[di] = day; });
      return {
        days: col, month: mk, isSplit: true, splitGroupId: gid,
        isFirstSplit: i === 0, isLastSplit: i === months.length - 1
      };
    });
  }

  static isComplete(col) {
    if (!col.month) return false;
    return col.days.filter(d => d && cFmtMonth(d) === col.month).length === 7;
  }
}

/**********************
 * CALCULADOR DE ETIQUETAS DE MES
 **********************/
class ContribMonthLabeler {
  constructor(cs) { this.cs = cs; }

  calculate(columns) {
    const monthData = new Map();
    let x = 0;

    columns.forEach((col, i) => {
      if (i > 0) {
        const prev = columns[i - 1];
        const spacer = prev.month && col.month && col.month !== prev.month
          && (!col.isSplit || !prev.isSplit || col.splitGroupId !== prev.splitGroupId);
        x += spacer ? this.cs.GAP + this.cs.CELL_SIZE + this.cs.GAP : this.cs.GAP;
      }
      if (col.month) {
        const cx = x + this.cs.CELL_SIZE / 2;
        const complete = ContribGridBuilder.isComplete(col);
        if (!monthData.has(col.month)) {
          monthData.set(col.month, [{ x: cx, complete, isFirst: true }]);
        } else {
          monthData.get(col.month).push({ x: cx, complete, isFirst: false });
        }
      }
      x += this.cs.CELL_SIZE;
    });

    return Array.from(monthData.entries()).map(([mk, pts]) => {
      let positions = pts;
      if (positions.length > 1 && positions[0].isFirst && !positions[0].complete) {
        positions = positions.slice(1);
      }
      const cx = (positions[0].x + positions[positions.length - 1].x) / 2;
      return { month: mk, position: cx, label: moment(mk + "-01").format("MMM").toUpperCase() };
    });
  }
}

/**********************
 * TOOLTIP
 **********************/
class ContribTooltip {
  constructor() {
    document.querySelectorAll(".aleph-contrib-tooltip").forEach(el => el.remove());
    this._el = document.createElement("div");
    this._el.className = "aleph-contrib-tooltip";
    this._el.style.cssText = `
      position: fixed;
      background: rgba(12,12,12,0.97);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 6px;
      padding: 8px 10px;
      pointer-events: none;
      z-index: 99999;
      display: none;
      font-size: 12px;
      line-height: 1.6;
      min-width: 160px;
      max-width: 240px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
    `;
    document.body.appendChild(this._el);
  }

  show(e, day, notes) {
    const ds = day.format("ddd DD MMM YYYY").toUpperCase();
    const count = notes.length;
    const color = cColorForCount(count);

    let body;
    if (count === 0) {
      body = `<div style="opacity:0.4;margin-top:4px;font-size:11px">No notes created</div>`;
    } else {
      const display = notes.slice(0, 6);
      const rest = notes.length - 6;
      body = `
        <div style="color:${color};font-weight:700;margin-top:4px">${count} note${count !== 1 ? "s" : ""} created</div>
        <div style="opacity:0.55;font-size:10px;margin-top:3px;line-height:1.6">
          ${display.map(n => `• ${n.name}`).join("<br>")}
          ${rest > 0 ? `<br><span style="opacity:0.7">… +${rest} more</span>` : ""}
        </div>
      `;
    }

    this._el.innerHTML = `
      <div style="font-weight:600;opacity:0.65;font-size:10px;letter-spacing:0.6px">${ds}</div>
      ${body}
    `;
    this._el.style.display = "block";
    this._pos(e);
  }

  move(e) { this._pos(e); }
  hide() { this._el.style.display = "none"; }
  destroy() { this._el.remove(); }

  _pos(e) {
    this._el.style.left = `${e.clientX + 14}px`;
    this._el.style.top  = `${e.clientY - 14}px`;
  }
}

/**********************
 * GESTOR DE DATOS
 **********************/
class ContribDataManager {
  constructor(dv) { this.dv = dv; }

  load(start, end) {
    const map = new Map(); // dateKey → [{name, path}]

    this.dv.pages(CCONFIG.PATH).forEach(page => {
      if (!page.file.ctime) return;
      const date = moment(page.file.ctime.toISODate());
      if (!cInRange(date, start, end)) return;
      const key = cFmtKey(date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ name: page.file.name, path: page.file.path });
    });

    return map;
  }
}

/**********************
 * CALCULADOR DE ESTADÍSTICAS
 **********************/
class ContribStats {
  static compute(map, start, end) {
    const today = moment();
    const effectiveEnd = today.isBefore(end) ? today : end;
    const totalDays = Math.max(0, effectiveEnd.diff(start, "days") + 1);

    let totalNotes = 0, activeDays = 0, bestDay = 0;
    map.forEach(notes => {
      totalNotes += notes.length;
      activeDays++;
      if (notes.length > bestDay) bestDay = notes.length;
    });

    const avgPerDay = activeDays > 0 ? totalNotes / activeDays : 0;

    // Current streak (consecutive active days back from today)
    let streak = 0;
    const checking = effectiveEnd.clone();
    while (checking.isSameOrAfter(start, "day")) {
      if (map.has(cFmtKey(checking))) { streak++; checking.subtract(1, "day"); }
      else break;
    }

    // Max streak
    let maxStreak = 0, tmp = 0;
    const cur = start.clone();
    while (cur.isSameOrBefore(effectiveEnd, "day")) {
      if (map.has(cFmtKey(cur))) { tmp++; if (tmp > maxStreak) maxStreak = tmp; }
      else tmp = 0;
      cur.add(1, "day");
    }

    // Monthly totals
    const monthlyTotals = new Map();
    map.forEach((notes, dk) => {
      const mk = dk.substring(0, 7);
      monthlyTotals.set(mk, (monthlyTotals.get(mk) || 0) + notes.length);
    });

    return { totalNotes, activeDays, totalDays, avgPerDay, bestDay, streak, maxStreak, monthlyTotals };
  }
}

/**********************
 * RENDERIZADOR
 **********************/
class ContribRenderer {
  constructor() {
    this.tooltip = null;
  }

  render(columns, map, start, end, container) {
    if (this.tooltip) this.tooltip.destroy();
    this.tooltip = new ContribTooltip();

    const stats = ContribStats.compute(map, start, end);
    const monthLabels = new ContribMonthLabeler(CCONFIG).calculate(columns);

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: rgba(0,0,0,0.1);
      border-radius: 8px;
    `;

    wrapper.appendChild(this._renderStats(stats));

    // Grid row: fixed weekday labels + scrollable area
    const gridRow = document.createElement("div");
    gridRow.style.cssText = `display:flex;align-items:flex-start;gap:8px`;

    const wdWrapper = document.createElement("div");
    wdWrapper.style.cssText = `display:flex;flex-direction:column;gap:8px;flex-shrink:0`;
    const monthSpacer = document.createElement("div");
    monthSpacer.style.cssText = `height:${CCONFIG.MONTH_FONT_SIZE + 4}px`;
    wdWrapper.appendChild(monthSpacer);
    wdWrapper.appendChild(this._renderWeekdays());
    gridRow.appendChild(wdWrapper);

    const scrollArea = document.createElement("div");
    scrollArea.style.cssText = `overflow-x:auto;overflow-y:hidden;padding-bottom:4px;flex:1;min-width:0`;
    const inner = document.createElement("div");
    inner.style.cssText = `width:max-content;display:flex;flex-direction:column;gap:8px`;
    inner.appendChild(this._renderMonthHeader(monthLabels));
    inner.appendChild(this._renderGrid(columns, map, start, end));
    inner.appendChild(this._renderMonthlyTotals(monthLabels, stats.monthlyTotals));
    scrollArea.appendChild(inner);
    gridRow.appendChild(scrollArea);

    wrapper.appendChild(gridRow);
    wrapper.appendChild(this._renderProgressBar(stats));
    wrapper.appendChild(this._renderLegend());

    container.appendChild(wrapper);
  }

  _renderStats(stats) {
    const { totalNotes, activeDays, totalDays, avgPerDay, bestDay, streak, maxStreak } = stats;
    const pct = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:0;flex-wrap:wrap;justify-content:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);margin-bottom:4px`;

    const items = [
      { label: "TOTAL NOTES", value: totalNotes,                            highlight: true },
      { label: "ACTIVE DAYS", value: activeDays                                             },
      { label: "COVERAGE",    value: `${pct}%`                                              },
      { label: "AVG / DAY",   value: avgPerDay > 0 ? avgPerDay.toFixed(1) : "—"            },
      { label: "BEST DAY",    value: bestDay > 0 ? `${bestDay}` : "—"                      },
      { label: "STREAK",      value: `${streak}d`                                           },
      { label: "MAX STREAK",  value: `${maxStreak}d`                                        },
    ];

    items.forEach(({ label, value, highlight }, idx) => {
      if (idx > 0) {
        const sep = document.createElement("div");
        sep.style.cssText = `width:1px;background:rgba(255,255,255,0.07);align-self:stretch;margin:4px 0`;
        row.appendChild(sep);
      }
      const el = document.createElement("div");
      el.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 16px`;

      const lbl = document.createElement("div");
      lbl.textContent = label;
      lbl.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;

      const val = document.createElement("div");
      val.textContent = value;
      val.style.cssText = `font-size:${highlight ? 17 : 15}px;font-weight:700;opacity:0.85${highlight ? `;color:${CCONFIG.ACCENT}` : ""}`;

      el.appendChild(lbl);
      el.appendChild(val);
      row.appendChild(el);
    });

    return row;
  }

  _renderWeekdays() {
    const col = document.createElement("div");
    col.style.cssText = `display:flex;flex-direction:column;gap:${CCONFIG.GAP}px`;

    CCONFIG.WEEKDAYS.forEach(d => {
      const el = document.createElement("div");
      el.textContent = d;
      el.style.cssText = `height:${CCONFIG.CELL_SIZE}px;font-size:${CCONFIG.WEEKDAY_FONT_SIZE}px;opacity:0.5;display:flex;align-items:center;font-weight:500`;
      col.appendChild(el);
    });
    return col;
  }

  _renderMonthHeader(monthLabels) {
    const row = document.createElement("div");
    row.style.cssText = `display:flex;position:relative;height:${CCONFIG.MONTH_FONT_SIZE + 4}px`;

    monthLabels.forEach(({ position, label }) => {
      const el = document.createElement("div");
      el.textContent = label;
      el.style.cssText = `position:absolute;left:${position}px;transform:translateX(-50%);font-size:${CCONFIG.MONTH_FONT_SIZE}px;opacity:0.6;font-weight:500;letter-spacing:0.5px`;
      row.appendChild(el);
    });
    return row;
  }

  _renderGrid(columns, map, start, end) {
    const container = document.createElement("div");
    container.style.cssText = `display:flex;gap:${CCONFIG.GAP}px`;

    columns.forEach((col, i) => {
      if (i > 0) {
        const prev = columns[i - 1];
        const spacer = prev.month && col.month && col.month !== prev.month
          && (!col.isSplit || !prev.isSplit || col.splitGroupId !== prev.splitGroupId);
        if (spacer) {
          const sp = document.createElement("div");
          sp.style.cssText = `width:${CCONFIG.CELL_SIZE}px`;
          container.appendChild(sp);
        }
      }
      container.appendChild(this._renderColumn(col, map, start, end));
    });
    return container;
  }

  _renderColumn(col, map, start, end) {
    const c = document.createElement("div");
    c.style.cssText = `display:flex;flex-direction:column;gap:${CCONFIG.GAP}px`;
    col.days.forEach(day => c.appendChild(this._renderCell(day, map, start, end)));
    return c;
  }

  _renderCell(day, map, start, end) {
    const cell = document.createElement("div");
    cell.style.cssText = `width:${CCONFIG.CELL_SIZE}px;height:${CCONFIG.CELL_SIZE}px;border-radius:2px;transition:transform 0.15s ease`;

    if (!day || !cInRange(day, start, end)) {
      cell.style.background = "transparent";
      return cell;
    }

    const key    = cFmtKey(day);
    const notes  = map.get(key) || [];
    const count  = notes.length;
    const color  = cColorForCount(count);

    cell.style.background = color;
    cell.style.opacity    = count === 0 ? "0.3" : "1";
    cell.style.cursor     = count > 0 ? "pointer" : "default";

    if (day.isSame(moment(), "day")) {
      cell.style.outline       = "2px solid rgba(255,255,255,0.75)";
      cell.style.outlineOffset = "1px";
    }

    cell.onmouseenter = (e) => {
      cell.style.transform = "scale(1.2)";
      cell.style.zIndex    = "10";
      this.tooltip.show(e, day, notes);
    };
    cell.onmousemove  = (e) => this.tooltip.move(e);
    cell.onmouseleave = () => {
      cell.style.transform = "scale(1)";
      cell.style.zIndex    = "1";
      this.tooltip.hide();
    };

    // Single-note days: click to open note
    if (count === 1 && notes[0]?.path) {
      cell.onclick = () => app.workspace.openLinkText(notes[0].path, "", true);
    }

    return cell;
  }

  _renderMonthlyTotals(monthLabels, monthlyTotals) {
    const row = document.createElement("div");
    row.style.cssText = `display:flex;position:relative;height:${CCONFIG.CELL_SIZE}px;margin-top:2px`;

    monthLabels.forEach(({ position, month }) => {
      const total = monthlyTotals.get(month) || 0;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${position}px;transform:translateX(-50%);font-size:${CCONFIG.MONTH_FONT_SIZE - 1}px;font-weight:700;color:${CCONFIG.ACCENT};opacity:${total > 0 ? "0.85" : "0.2"}`;
      el.textContent = total > 0 ? total : "—";
      row.appendChild(el);
    });
    return row;
  }

  _renderProgressBar(stats) {
    const { activeDays, totalDays } = stats;
    const pct = totalDays > 0 ? (activeDays / totalDays) * 100 : 0;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;gap:4px;margin-top:2px`;

    const labels = document.createElement("div");
    labels.style.cssText = `display:flex;justify-content:space-between;font-size:9px;opacity:0.35;letter-spacing:0.6px;font-weight:600`;
    const l = document.createElement("span"); l.textContent = "YEAR COVERAGE";
    const r = document.createElement("span"); r.textContent = `${activeDays} / ${totalDays} DAYS`;
    labels.appendChild(l);
    labels.appendChild(r);

    const track = document.createElement("div");
    track.style.cssText = `width:100%;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden`;
    const fill = document.createElement("div");
    fill.style.cssText = `height:100%;width:${pct.toFixed(1)}%;background:${CCONFIG.ACCENT};opacity:0.5;border-radius:2px`;
    track.appendChild(fill);

    wrapper.appendChild(labels);
    wrapper.appendChild(track);
    return wrapper;
  }

  _renderLegend() {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05)`;

    const title = document.createElement("div");
    title.textContent = "CONTRIBUTION LEVELS";
    title.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;
    wrapper.appendChild(title);

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:8px;align-items:center;justify-content:center`;

    const levels = [
      { label: "0",    color: CCONFIG.LEVEL_COLORS[0] },
      { label: "1–2",  color: CCONFIG.LEVEL_COLORS[1] },
      { label: "3–5",  color: CCONFIG.LEVEL_COLORS[2] },
      { label: "6–9",  color: CCONFIG.LEVEL_COLORS[3] },
      { label: "10+",  color: CCONFIG.LEVEL_COLORS[4] },
    ];

    levels.forEach(({ label, color }) => {
      const item = document.createElement("div");
      item.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:3px`;

      const swatch = document.createElement("div");
      swatch.style.cssText = `width:${CCONFIG.CELL_SIZE}px;height:${CCONFIG.CELL_SIZE}px;border-radius:2px;background:${color}`;

      const lbl = document.createElement("div");
      lbl.textContent = label;
      lbl.style.cssText = `font-size:8px;opacity:0.45;font-weight:700;letter-spacing:0.3px`;

      item.appendChild(swatch);
      item.appendChild(lbl);
      row.appendChild(item);
    });

    wrapper.appendChild(row);
    return wrapper;
  }
}

/**********************
 * EJECUCIÓN
 **********************/
(async function () {
  try {
    const year  = moment().year();
    const start = moment(`${year}-01-01`);
    const end   = moment(`${year}-12-31`);

    const dataManager = new ContribDataManager(dv);
    const map         = dataManager.load(start, end);
    const columns     = ContribGridBuilder.build(start, end);
    const renderer    = new ContribRenderer();

    renderer.render(columns, map, start, end, dv.container);
  } catch (err) {
    dv.span(`Error: ${err.message}`);
    console.error("Contribution Heatmap Error:", err);
  }
})();
