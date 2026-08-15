/**********************
 * VIVENTIA ACTIVITY HEATMAP
 * Heatmap of sessions for the current activity.
 **********************/

/**********************
 * CONFIGURACIÓN
  **********************/
const CONFIG = {
  CELL_SIZE: 18,
  GAP: 4,

  EMPTY_COLOR: "#2a2a2a",

  LEVEL_COLORS: ["#2a2a2a", "#1f4d73", "#3d9ae6", "#74c0fc", "#b3dbfd"],

  THRESHOLDS: [1, 2, 3, 4],

  ACCENT: "#74c0fc",

  WEEKDAYS: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],

  SESSIONS_PATH: '"05 - Ζ - Viventia/03 - Sessions"',

  get MONTH_FONT_SIZE() { return Math.max(8, this.CELL_SIZE * 0.9); },
  get WEEKDAY_FONT_SIZE() { return Math.max(8, this.CELL_SIZE * 0.9); }
};

/**********************
 * UTILIDADES
  **********************/
function fmtKey(m) { return m.format("YYYY-MM-DD"); }
function fmtMonth(m) { return m.format("YYYY-MM"); }
function inRange(date, start, end) { return date.isBetween(start, end, "day", "[]"); }

function colorForCount(count) {
  const [t1, t2, t3, t4] = CONFIG.THRESHOLDS;
  const c = CONFIG.LEVEL_COLORS;
  if (!count || count <= 0) return c[0];
  if (count < t2) return c[1];   // 1
  if (count < t3) return c[2];   // 2
  if (count < t4) return c[3];   // 3
  return c[4];                   // 4+
}

/**********************
 * GRID BUILDER
 **********************/
class ActivityGridBuilder {
  static build(start, end) {
    const columns = [];
    let cur = start.clone().startOf("isoWeek");
    const last = end.clone().endOf("isoWeek");

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
      if (!inRange(day, yearStart, yearEnd)) return;
      const mk = fmtMonth(day);
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
    return col.days.filter(d => d && fmtMonth(d) === col.month).length === 7;
  }
}

/**********************
 * CALCULADOR DE ETIQUETAS DE MES
 **********************/
class ActivityMonthLabeler {
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
        const complete = ActivityGridBuilder.isComplete(col);
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
class ActivityTooltip {
  constructor() {
    document.querySelectorAll(".aleph-activity-tooltip").forEach(el => el.remove());
    this._el = document.createElement("div");
    this._el.className = "aleph-activity-tooltip";
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

  show(e, day, sessions) {
    const ds = day.format("ddd DD MMM YYYY").toUpperCase();
    const count = sessions.length;
    const color = colorForCount(count);

    let body;
    if (count === 0) {
      body = `<div style="opacity:0.4;margin-top:4px;font-size:11px">No sessions</div>`;
    } else {
      const display = sessions.slice(0, 6);
      const rest = sessions.length - 6;
      const fmtTime = s => s.name.slice(8, 10) + ":" + s.name.slice(10, 12);
      body = `
        <div style="color:${color};font-weight:700;margin-top:4px">${count} session${count !== 1 ? "s" : ""}</div>
        <div style="opacity:0.55;font-size:10px;margin-top:3px;line-height:1.6">
          ${display.map(s => `• ☆${s.rating ?? "—"} ${s.alias || fmtTime(s)}`).join("<br>")}
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
class ActivityDataManager {
  constructor(dv) { this.dv = dv; }

  load(start, end) {
    const map = new Map(); // dateKey → [{name, path, rating, alias}]
    const current = this.dv.current();
    const linked = new Set([
      ...current.file.inlinks.map(l => l.path),
      ...current.file.outlinks.map(l => l.path)
    ]);

    this.dv.pages(CONFIG.SESSIONS_PATH).forEach(page => {
      if (!linked.has(page.file.path)) return;

      let date;
      if (page.creation) {
        const raw = page.creation;
        date = moment(typeof raw.toISODate === "function" ? raw.toISODate() : raw);
      } else if (page.file.ctime) {
        date = moment(page.file.ctime.toISODate());
      } else {
        return;
      }
      if (!date.isValid() || !inRange(date, start, end)) return;
      const key = fmtKey(date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({
        name: page.file.name,
        path: page.file.path,
        rating: page["viventia-rating"],
        alias: page.aliases?.[0]
      });
    });

    return map;
  }
}

/**********************
 * CALCULADOR DE ESTADÍSTICAS
 **********************/
class ActivityStats {
  static compute(map, start, end) {
    const today = moment();
    const effectiveEnd = today.isBefore(end) ? today : end;
    const totalDays = Math.max(0, effectiveEnd.diff(start, "days") + 1);

    let totalSessions = 0, activeDays = 0, bestDay = 0;
    map.forEach(sessions => {
      totalSessions += sessions.length;
      activeDays++;
      if (sessions.length > bestDay) bestDay = sessions.length;
    });

    const avgPerDay = activeDays > 0 ? totalSessions / activeDays : 0;

    let streak = 0;
    const checking = effectiveEnd.clone();
    while (checking.isSameOrAfter(start, "day")) {
      if (map.has(fmtKey(checking))) { streak++; checking.subtract(1, "day"); }
      else break;
    }

    let maxStreak = 0, tmp = 0;
    const cur = start.clone();
    while (cur.isSameOrBefore(effectiveEnd, "day")) {
      if (map.has(fmtKey(cur))) { tmp++; if (tmp > maxStreak) maxStreak = tmp; }
      else tmp = 0;
      cur.add(1, "day");
    }

    const monthlyTotals = new Map();
    map.forEach((sessions, dk) => {
      const mk = dk.substring(0, 7);
      monthlyTotals.set(mk, (monthlyTotals.get(mk) || 0) + sessions.length);
    });

    return { totalSessions, activeDays, totalDays, avgPerDay, bestDay, streak, maxStreak, monthlyTotals };
  }
}

/**********************
 * RENDERIZADOR
 **********************/
class ActivityRenderer {
  constructor() {
    this.tooltip = null;
    this.activeFilter = null;
    this.allCells = [];
    this._legendItems = [];
  }

  render(columns, map, start, end, container, year, onYearChange) {
    this.allCells = [];
    this._legendItems = [];
    this.activeFilter = null;
    if (this.tooltip) this.tooltip.destroy();
    this.tooltip = new ActivityTooltip();

    const stats = ActivityStats.compute(map, start, end);
    const monthLabels = new ActivityMonthLabeler(CONFIG).calculate(columns);

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: rgba(0,0,0,0.1);
      border-radius: 8px;
    `;

    wrapper.appendChild(this._renderYearSelector(year, onYearChange));
    wrapper.appendChild(this._renderStats(stats));

    const gridRow = document.createElement("div");
    gridRow.style.cssText = `display:flex;align-items:flex-start;gap:8px`;

    const wdWrapper = document.createElement("div");
    wdWrapper.style.cssText = `display:flex;flex-direction:column;gap:8px;flex-shrink:0`;
    const monthSpacer = document.createElement("div");
    monthSpacer.style.cssText = `height:${CONFIG.MONTH_FONT_SIZE + 4}px`;
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
    const { totalSessions, activeDays, totalDays, avgPerDay, bestDay, streak, maxStreak } = stats;
    const pct = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:4px;flex-wrap:wrap;justify-content:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);margin-bottom:4px`;

    const items = [
      { label: "TOTAL SESSIONS", value: totalSessions,                            highlight: true },
      { label: "ACTIVE DAYS", value: activeDays                                             },
      { label: "COVERAGE",    value: `${pct}%`                                              },
      { label: "AVG / DAY",   value: avgPerDay > 0 ? avgPerDay.toFixed(1) : "—"            },
      { label: "BEST DAY",    value: bestDay > 0 ? `${bestDay}` : "—"                      },
      { label: "STREAK",      value: `${streak}d`                                           },
      { label: "MAX STREAK",  value: `${maxStreak}d`                                        },
    ];

    items.forEach(({ label, value, highlight }) => {
      const el = document.createElement("div");
      el.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 16px`;

      const lbl = document.createElement("div");
      lbl.textContent = label;
      lbl.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;

      const val = document.createElement("div");
      val.textContent = value;
      val.style.cssText = `font-size:${highlight ? 17 : 15}px;font-weight:700;opacity:0.85${highlight ? `;color:${CONFIG.ACCENT}` : ""}`;

      el.appendChild(lbl);
      el.appendChild(val);
      row.appendChild(el);
    });

    return row;
  }

  _renderYearSelector(year, onYearChange) {
    const el = document.createElement("div");
    el.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 16px;align-self:center`;

    const lbl = document.createElement("div");
    lbl.textContent = "YEAR";
    lbl.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;

    const val = document.createElement("div");
    val.style.cssText = `display:flex;align-items:center;gap:8px`;

    const btnStyle = `cursor:pointer;background:transparent;border:none;color:var(--text-muted);font-size:14px;font-weight:600;opacity:0.5;padding:0;transition:opacity 0.15s`;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "‹";
    prevBtn.style.cssText = btnStyle;
    prevBtn.onmouseenter = () => { prevBtn.style.opacity = "1"; prevBtn.style.color = CONFIG.ACCENT; };
    prevBtn.onmouseleave = () => { prevBtn.style.opacity = "0.5"; prevBtn.style.color = "var(--text-muted)"; };
    prevBtn.addEventListener("click", () => onYearChange(year - 1));

    const yearText = document.createElement("span");
    yearText.textContent = year;
    yearText.style.cssText = `font-size:15px;font-weight:700;opacity:0.85`;

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "›";
    nextBtn.style.cssText = btnStyle;
    nextBtn.onmouseenter = () => { nextBtn.style.opacity = "1"; nextBtn.style.color = CONFIG.ACCENT; };
    nextBtn.onmouseleave = () => { nextBtn.style.opacity = "0.5"; nextBtn.style.color = "var(--text-muted)"; };
    nextBtn.addEventListener("click", () => onYearChange(year + 1));

    val.appendChild(prevBtn);
    val.appendChild(yearText);
    val.appendChild(nextBtn);

    el.appendChild(lbl);
    el.appendChild(val);
    return el;
  }

  _renderWeekdays() {
    const col = document.createElement("div");
    col.style.cssText = `display:flex;flex-direction:column;gap:${CONFIG.GAP}px`;

    CONFIG.WEEKDAYS.forEach(d => {
      const el = document.createElement("div");
      el.textContent = d;
      el.style.cssText = `height:${CONFIG.CELL_SIZE}px;font-size:${CONFIG.WEEKDAY_FONT_SIZE}px;opacity:0.5;display:flex;align-items:center;font-weight:500`;
      col.appendChild(el);
    });
    return col;
  }

  _renderMonthHeader(monthLabels) {
    const row = document.createElement("div");
    row.style.cssText = `display:flex;position:relative;height:${CONFIG.MONTH_FONT_SIZE + 4}px`;

    monthLabels.forEach(({ position, label }) => {
      const el = document.createElement("div");
      el.textContent = label;
      el.style.cssText = `position:absolute;left:${position}px;transform:translateX(-50%);font-size:${CONFIG.MONTH_FONT_SIZE}px;opacity:0.6;font-weight:500;letter-spacing:0.5px`;
      row.appendChild(el);
    });
    return row;
  }

  _renderGrid(columns, map, start, end) {
    const container = document.createElement("div");
    container.style.cssText = `display:flex;gap:${CONFIG.GAP}px`;

    columns.forEach((col, i) => {
      if (i > 0) {
        const prev = columns[i - 1];
        const spacer = prev.month && col.month && col.month !== prev.month
          && (!col.isSplit || !prev.isSplit || col.splitGroupId !== prev.splitGroupId);
        if (spacer) {
          const sp = document.createElement("div");
          sp.style.cssText = `width:${CONFIG.CELL_SIZE}px`;
          container.appendChild(sp);
        }
      }
      container.appendChild(this._renderColumn(col, map, start, end));
    });
    return container;
  }

  _renderColumn(col, map, start, end) {
    const c = document.createElement("div");
    c.style.cssText = `display:flex;flex-direction:column;gap:${CONFIG.GAP}px`;
    col.days.forEach(day => c.appendChild(this._renderCell(day, map, start, end)));
    return c;
  }

  _renderCell(day, map, start, end) {
    const cell = document.createElement("div");
    cell.style.cssText = `width:${CONFIG.CELL_SIZE}px;height:${CONFIG.CELL_SIZE}px;border-radius:2px;transition:transform 0.15s ease`;

    if (!day || !inRange(day, start, end)) {
      cell.style.background = "transparent";
      return cell;
    }

    const key    = fmtKey(day);
    const sessions  = map.get(key) || [];
    const count  = sessions.length;
    const color  = colorForCount(count);

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
      this.tooltip.show(e, day, sessions);
    };
    cell.onmousemove  = (e) => this.tooltip.move(e);
    cell.onmouseleave = () => {
      cell.style.transform = "scale(1)";
      cell.style.zIndex    = "1";
      this.tooltip.hide();
    };

    if (count === 1 && sessions[0]?.path) {
      cell.onclick = () => app.workspace.openLinkText(sessions[0].path, "", true);
    }

    this.allCells.push({ cell, count });

    return cell;
  }

  _renderMonthlyTotals(monthLabels, monthlyTotals) {
    const row = document.createElement("div");
    row.style.cssText = `display:flex;position:relative;height:${CONFIG.CELL_SIZE}px;margin-top:2px`;

    monthLabels.forEach(({ position, month }) => {
      const total = monthlyTotals.get(month) || 0;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${position}px;transform:translateX(-50%);font-size:${CONFIG.MONTH_FONT_SIZE - 1}px;font-weight:700;color:${CONFIG.ACCENT};opacity:${total > 0 ? "0.85" : "0.2"}`;
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
    fill.style.cssText = `height:100%;width:${pct.toFixed(1)}%;background:${CONFIG.ACCENT};opacity:0.5;border-radius:2px`;
    track.appendChild(fill);

    wrapper.appendChild(labels);
    wrapper.appendChild(track);
    return wrapper;
  }

  _renderLegend() {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05)`;

    const title = document.createElement("div");
    title.textContent = "SESSION LEVELS — CLICK TO FILTER";
    title.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;
    wrapper.appendChild(title);

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:8px;align-items:center;justify-content:center`;

    const levels = [
      { label: "0",  value: 0, color: CONFIG.LEVEL_COLORS[0] },
      { label: "1",  value: 1, color: CONFIG.LEVEL_COLORS[1] },
      { label: "2",  value: 2, color: CONFIG.LEVEL_COLORS[2] },
      { label: "3",  value: 3, color: CONFIG.LEVEL_COLORS[3] },
      { label: "4+", value: 4, color: CONFIG.LEVEL_COLORS[4] },
    ];

    levels.forEach(({ label, value, color }) => {
      const item = document.createElement("div");
      item.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;user-select:none`;

      const swatch = document.createElement("div");
      swatch.style.cssText = `width:${CONFIG.CELL_SIZE}px;height:${CONFIG.CELL_SIZE}px;border-radius:2px;background:${color};transition:all 0.15s`;

      const lbl = document.createElement("div");
      lbl.textContent = label;
      lbl.style.cssText = `font-size:8px;opacity:0.45;font-weight:700;letter-spacing:0.3px`;

      item.appendChild(swatch);
      item.appendChild(lbl);
      row.appendChild(item);

      item._swatch = swatch;
      item._levelValue = value;
      this._legendItems.push(item);

      item.onclick = () => this._toggleFilter(value);
      item.onmouseenter = () => { if (this.activeFilter !== value) swatch.style.transform = "scale(1.15)"; };
      item.onmouseleave = () => { if (this.activeFilter !== value) swatch.style.transform = "scale(1)"; };
    });

    wrapper.appendChild(row);
    return wrapper;
  }

  _toggleFilter(level) {
    this.activeFilter = this.activeFilter === level ? null : level;
    this._applyFilter();
  }

  _applyFilter() {
    const active = this.activeFilter;
    this.allCells.forEach(({ cell, count }) => {
      if (active === null) {
        cell.style.opacity = count === 0 ? "0.3" : "1";
      } else {
        const matches = (active === 4) ? (count >= 4) : (count === active);
        cell.style.opacity = matches ? "1" : "0.07";
      }
    });

    this._legendItems.forEach(item => {
      const isActive = active === item._levelValue;
      item._swatch.style.outline = isActive ? "2px solid rgba(255,255,255,0.8)" : "none";
      item._swatch.style.outlineOffset = "1px";
      item._swatch.style.transform = isActive ? "scale(1.15)" : "scale(1)";
    });
  }
}

/**********************
 * EJECUCIÓN
  **********************/
let currentRenderer = null;

function renderYear(year) {
  if (currentRenderer && currentRenderer.tooltip) {
    currentRenderer.tooltip.destroy();
  }

  const start = moment(`${year}-01-01`);
  const end   = moment(`${year}-12-31`);

  dv.container.innerHTML = "";

  const dataManager = new ActivityDataManager(dv);
  const map         = dataManager.load(start, end);
  const columns     = ActivityGridBuilder.build(start, end);
  const renderer    = new ActivityRenderer();

  renderer.render(columns, map, start, end, dv.container, year, (newYear) => renderYear(newYear));
  currentRenderer = renderer;
}

try {
  renderYear(moment().year());
} catch (err) {
  dv.span(`Error: ${err.message}`);
  console.error("Activity Heatmap Error:", err);
}
