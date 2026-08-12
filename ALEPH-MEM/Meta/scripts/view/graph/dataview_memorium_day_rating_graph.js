/**********************
 * DAY RATING GRAPH (Unified)
 * Auto-detects period: weekly | monthly | quarterly
 * Replaces 3 per-period rating graph scripts.
 **********************/

const PERIOD = globalThis.__memoriumChartPeriod || (() => {
  const name = dv.current().file.name;
  if (/^\d{4}-W\d{2}$/.test(name)) return "weekly";
  if (/^\d{4}-\d{2}-(January|February|March|April|May|June|July|August|September|October|November|December)/.test(name)) return "monthly";
  if (/^\d{4}-Q[1-4]/.test(name)) return "quarterly";
  return "weekly";
})();

const PERIOD_CONFIG = {
  weekly:   { label: "WEEK",     totalDays: 7,   dayFormat: "ddd, D MMM" },
  monthly:  { label: "MONTH",    totalDays: null, dayFormat: "D ddd"      },
  quarterly:{ label: "QUARTER",  totalDays: null, dayFormat: "D MMM"      },
};

/**********************
 * CONFIGURACIÓN
  **********************/
const CONFIG = {
  PERIOD,

  EMPTY_COLOR: "#2a2a2a",
  RATING_COLORS: {
    1: "#4a4a4a", 2: "#ef4444", 3: "#f59e0b", 4: "#fbbf24",
    5: "#10b981", 6: "#3b82f6", 7: "#a855f7", 8: "#c026d3",
    9: "#ec4899", 10: "#f472b6"
  },

  DAILY_NOTES_PATH: '"02 - Ψ - Memorium/01 - Daily"',

  PROPERTIES: {
    RATING: "memorium-day-rating",
    DATE: "memorium-date",
    ALIAS: "aliases"
  },

  CHART: {
    HEIGHT: 420,
    CANVAS_ID: "_memoriumChart"
  },

  LIBRARIES: {
    CHARTJS: "https://cdn.jsdelivr.net/npm/chart.js",
    ANNOTATION: "https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation"
  },

  THEME: {
    ACCENT_VAR: "--interactive-accent",
    ACCENT_FALLBACK: "rgba(139,92,246,1)"
  }
};

/**********************
 * GESTOR DE LIBRERÍAS
  **********************/
class ChartLibraryLoader {
  static async ensureLibraries() {
    await this._loadChartJs();
    await this._loadAnnotationPlugin();
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
  }
  static async _loadChartJs() {
    if (typeof Chart === "undefined") {
      await this._loadScript(CONFIG.LIBRARIES.CHARTJS);
    }
  }
  static async _loadAnnotationPlugin() {
    if (!Chart.registry.plugins.get("annotation")) {
      await this._loadScript(CONFIG.LIBRARIES.ANNOTATION);
    }
  }
  static _loadScript(src) {
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
}

/**********************
 * UTILIDADES DE COLOR
  **********************/
class ColorUtils {
  static hexToRgba(hex, alpha = 0.5) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    hex = hex.replace("#", "").trim();
    if (hex.length === 3) hex = hex.split("").map(h => h + h).join("");
    if (hex.length === 8) return this._hexWithAlphaToRgba(hex, alpha);
    if (hex.length === 6) return this._hexToRgba(hex, alpha);
    return alpha === 1 ? hex : `rgba(0,0,0,${alpha})`;
  }
  static _hexWithAlphaToRgba(hex, alpha) {
    const [r, g, b, a] = [0, 2, 4, 6].map(i => parseInt(hex.slice(i, i + 2), 16));
    return `rgba(${r},${g},${b},${(a / 255) * alpha})`;
  }
  static _hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  static cssColorWithAlpha(varName, alpha = 1, fallback = CONFIG.THEME.ACCENT_FALLBACK) {
    const value = this._getCssVariable(varName);
    if (!value) return fallback;
    return this._applyAlphaToColor(value, alpha, fallback);
  }
  static _getCssVariable(varName) {
    const docValue = getComputedStyle(document.documentElement).getPropertyValue(varName);
    const bodyValue = getComputedStyle(document.body).getPropertyValue(varName);
    return (docValue || bodyValue).trim();
  }
  static _applyAlphaToColor(color, alpha, fallback) {
    if (color.startsWith("rgb(")) return `rgba(${color.slice(4, -1)},${alpha})`;
    if (color.startsWith("rgba(")) { const rgb = color.slice(5, -1).split(",").slice(0, 3).join(","); return `rgba(${rgb},${alpha})`; }
    if (color.startsWith("hsl(")) return color.replace("hsl(", "hsla(").replace(")", `,${alpha})`);
    if (color.startsWith("hsla(")) { const hsl = color.slice(5, -1).split(",").slice(0, 3).join(","); return `hsla(${hsl},${alpha})`; }
    if (color.startsWith("#")) return this.hexToRgba(color, alpha);
    return alpha === 1 ? color : fallback;
  }
  static getColorForRating(value, alpha = 1) {
    if (value == null || Number.isNaN(value)) return this.hexToRgba(CONFIG.EMPTY_COLOR, alpha);
    const roundedValue = Math.round(Number(value));
    const color = CONFIG.RATING_COLORS[roundedValue] ?? CONFIG.EMPTY_COLOR;
    return this.hexToRgba(color, alpha);
  }
}

/**********************
 * UTILIDADES DE FECHA
  **********************/
class DateUtils {
  static extractRange(fileName) {
    if (PERIOD === "weekly") {
      const m = moment(fileName, "GGGG-[W]WW");
      return { start: m.clone().startOf("isoWeek"), end: m.clone().endOf("isoWeek") };
    }
    if (PERIOD === "monthly") {
      const m = moment(fileName, "YYYY-MM-MMMM");
      return { start: m.clone().startOf("month"), end: m.clone().endOf("month") };
    }
    // quarterly
    const match = fileName.match(/^(\d{4})-Q([1-4])/);
    if (!match) { const m = moment(); return { start: m, end: m }; }
    const y = parseInt(match[1]), q = parseInt(match[2]);
    const start = moment().year(y).quarter(q).startOf("quarter");
    return { start, end: start.clone().endOf("quarter") };
  }

  static isDateInRange(date, start, end) {
    return date.isBetween(start, end, "day", "[]");
  }

  static getDayIndex(start, date) {
    if (PERIOD === "weekly") return date.isoWeekday() - 1;
    return date.diff(start, "days");
  }

  static getTotalDays(start, end) {
    return end.diff(start, "days") + 1;
  }

  static formatDayLabel(start, i) {
    return start.clone().add(i, "days").format(PERIOD_CONFIG[PERIOD].dayFormat);
  }
}

/**********************
 * GESTOR DE DATOS
  **********************/
class RatingDataManager {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
  }

  async loadData(path, start, end) {
    const totalDays = DateUtils.getTotalDays(start, end);
    const data = this._initializeData(totalDays);
    this._fillLabels(data.labels, start, totalDays);
    await this._loadRatings(path, start, end, data);
    return data;
  }

  _initializeData(totalDays) {
    return {
      labels: Array(totalDays).fill(null),
      ratings: Array(totalDays).fill(null),
      links: Array(totalDays).fill(null),
      aliases: Array(totalDays).fill(null)
    };
  }

  _fillLabels(labels, start, totalDays) {
    for (let i = 0; i < totalDays; i++) {
      labels[i] = DateUtils.formatDayLabel(start, i);
    }
  }

  async _loadRatings(path, start, end, data) {
    const { RATING, DATE, ALIAS } = this.config.PROPERTIES;
    this.dv.pages(path)
      .where(page => page[RATING] != null && page[DATE])
      .forEach(page => {
        const date = moment(page[DATE].toISODate(), "YYYY-MM-DD");
        if (!DateUtils.isDateInRange(date, start, end)) return;
        const dayIndex = DateUtils.getDayIndex(start, date);
        data.ratings[dayIndex] = page[RATING];
        data.links[dayIndex] = page.file.path;
        data.aliases[dayIndex] = page[ALIAS];
      });
  }
}

/**********************
 * CALCULADOR DE ESTADÍSTICAS
  **********************/
class StatsCalculator {
  static calculate(ratings) {
    const validRatings = ratings.filter(r => r != null);
    return {
      periodAvg: validRatings.length > 0 ? validRatings.reduce((a, b) => a + b, 0) / validRatings.length : null,
      dailyAvg: this._calculateDailyAverage(ratings),
      validCount: validRatings.length,
      bestRating: validRatings.length > 0 ? Math.max(...validRatings) : null,
      worstRating: validRatings.length > 0 ? Math.min(...validRatings) : null
    };
  }
  static _calculateDailyAverage(ratings) {
    return ratings.map((_, index) => {
      const validSoFar = ratings.slice(0, index + 1).filter(v => v != null);
      if (validSoFar.length === 0) return null;
      return validSoFar.reduce((a, b) => a + b, 0) / validSoFar.length;
    });
  }
}

/**********************
 * CONSTRUCTOR DE DATASETS
  **********************/
class ChartDatasetBuilder {
  constructor(config) { this.config = config; }

  buildDatasets(data, stats) {
    const { ratings } = data;
    const { dailyAvg } = stats;
    const barColors = this._buildBarColors(ratings);
    const pointColors = this._buildPointColors(barColors);
    const datasets = [
      this._buildProgressionDataset(ratings, pointColors),
      this._buildAverageDataset(dailyAvg),
    ];
    if (PERIOD !== "quarterly") {
      datasets.push(this._buildBarDataset(ratings, barColors));
    }
    return datasets;
  }

  _buildBarColors(ratings) {
    return ratings.map(r => r == null ? CONFIG.EMPTY_COLOR : (CONFIG.RATING_COLORS[Math.round(r)] ?? CONFIG.EMPTY_COLOR));
  }
  _buildPointColors(barColors) {
    return barColors.map(color => ColorUtils.hexToRgba(color, 0.5));
  }
  _buildProgressionDataset(ratings, pointColors) {
    const accentLine = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.7);
    const accentSolid = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 1);
    return {
      type: "line", label: "Progression", data: ratings,
      borderColor: accentLine, borderWidth: 2, tension: 0.4, spanGaps: true,
      pointRadius: 5, pointHoverRadius: 7,
      pointBackgroundColor: pointColors, pointBorderColor: accentSolid, pointBorderWidth: 2
    };
  }
  _buildAverageDataset(dailyAvg) {
    const accentMedium = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.5);
    const accentSolid = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 1);
    return {
      type: "line", label: "Average", pointStyle: "rectRot", data: dailyAvg,
      borderColor: accentMedium, borderWidth: 2, spanGaps: true,
      pointRadius: 5, pointHoverRadius: 7,
      pointBackgroundColor: dailyAvg.map(v => ColorUtils.getColorForRating(v, 0.5)),
      pointBorderColor: accentSolid, pointBorderWidth: 2,
      borderDash: [6, 6], tension: 0
    };
  }
  _buildBarDataset(ratings, barColors) {
    return {
      type: "bar", label: "Day Rating", data: ratings,
      backgroundColor: barColors, borderRadius: 6
    };
  }
}

/**********************
 * OPCIONES DE CHART.JS
  **********************/
class ChartOptionsBuilder {
  constructor(config) { this.config = config; }

  buildOptions(data, stats) {
    return {
      responsive: true,
      plugins: this._buildPlugins(data, stats),
      onClick: this._buildClickHandler(data),
      scales: this._buildScales()
    };
  }

  _buildPlugins(data, stats) {
    return {
      legend: this._buildLegend(stats),
      tooltip: this._buildTooltip(data, stats),
      annotation: this._buildAnnotation()
    };
  }

  _buildLegend(stats) {
    return {
      display: true,
      labels: {
        generateLabels: chart => {
          const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart) || [];
          if (!stats.periodAvg) return labels;
          return labels.map(label => {
            if (label.text === "Day Rating") {
              const avgColor = ColorUtils.getColorForRating(stats.periodAvg);
              return { ...label, fillStyle: avgColor, strokeStyle: avgColor };
            }
            return label;
          });
        }
      }
    };
  }

  _buildTooltip(data, stats) {
    const { ratings, aliases } = data;
    const { dailyAvg } = stats;
    return {
      callbacks: {
        label: ctx => {
          const index = ctx.dataIndex;
          if (ctx.dataset.label === "Average") {
            const value = dailyAvg[index];
            return value == null ? "Average: —" : `Average (to date): ☆${value.toFixed(2)}`;
          }
          if (ratings[index] == null) return ["No entry", "Rest / no log"];
          return [`Day Rating: ☆${ratings[index]}`, `Note: ${aliases[index] ?? "Unnamed"}`];
        }
      }
    };
  }

  _buildAnnotation() {
    return {
      annotations: {
        neutral: {
          type: "line", yMin: 3, yMax: 3,
          borderColor: "rgba(255,255,255,0.3)", borderWidth: 1, borderDash: [6, 6],
          label: { content: "Neutral", enabled: true, position: "end" }
        }
      }
    };
  }

  _buildClickHandler(data) {
    return (_, elements) => {
      if (!elements.length) return;
      const link = data.links[elements[0].index];
      if (link) app.workspace.openLinkText(link, "", true);
    };
  }

  _buildScales() {
    const x = PERIOD === "quarterly"
      ? { grid: { display: false }, ticks: { autoSkip: true, maxRotation: 45, minRotation: 0 } }
      : { grid: { display: false } };
    return {
      y: {
        min: 0, max: 10,
        ticks: { stepSize: 1, color: ctx => ColorUtils.getColorForRating(ctx?.tick?.value ?? 0) },
        grid: {
          display: true, drawBorder: false,
          color: ctx => ColorUtils.getColorForRating(ctx?.tick?.value ?? 0, 0.12),
          lineWidth: 1, borderDash: [4, 4]
        }
      },
      x
    };
  }
}

/**********************
 * RENDERIZADOR
  **********************/
class ChartRenderer {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
    this.datasetBuilder = new ChartDatasetBuilder(config);
    this.optionsBuilder = new ChartOptionsBuilder(config);
    this.activeFilter = null;
    this._chart = null;
    this._data = null;
    this._originalBarColors = null;
    this._legendItems = [];
  }

  render(data, stats, start, end) {
    this._data = data;
    const wrapper = this._createWrapper();
    wrapper.appendChild(this._renderStats(data, stats, end, start));
    const canvas = this._createCanvas();
    wrapper.appendChild(canvas);
    wrapper.appendChild(this._renderProgressBar(stats, start, end));
    wrapper.appendChild(this._renderLegend(data));
    this.dv.container.appendChild(wrapper);
    this._buildChart(canvas, data, stats);
  }

  _createWrapper() {
    const w = document.createElement("div");
    w.style.cssText = `display:flex;flex-direction:column;gap:8px;padding:16px;background:rgba(0,0,0,0.1);border-radius:8px`;
    return w;
  }

  _renderStats(data, stats, end, start) {
    const { periodAvg, validCount, bestRating, worstRating } = stats;
    const totalDays = DateUtils.getTotalDays(start, end);
    const completionPct = Math.round((validCount / totalDays) * 100);

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:20px;flex-wrap:wrap;justify-content:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);margin-bottom:4px`;

    const items = [
      { label: "AVG RATING", value: periodAvg != null ? `☆${periodAvg.toFixed(1)}` : "—", color: periodAvg != null ? ColorUtils.getColorForRating(periodAvg) : null },
      { label: "LOGGED",     value: `${validCount} / ${totalDays}` },
      { label: "COMPLETION", value: `${completionPct}%` },
      { label: "BEST DAY",   value: bestRating != null ? `☆${bestRating}` : "—", color: bestRating != null ? ColorUtils.getColorForRating(bestRating) : null },
      { label: "WORST DAY",  value: worstRating != null ? `☆${worstRating}` : "—", color: worstRating != null ? ColorUtils.getColorForRating(worstRating) : null },
    ];

    items.forEach(({ label, value, color }) => {
      const el = document.createElement("div");
      el.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:2px`;
      const lbl = document.createElement("div");
      lbl.textContent = label;
      lbl.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;
      const val = document.createElement("div");
      val.textContent = value;
      val.style.cssText = `font-size:15px;font-weight:700;opacity:0.85${color ? `;color:${color}` : ""}`;
      el.appendChild(lbl); el.appendChild(val); row.appendChild(el);
    });
    return row;
  }

  _createCanvas() {
    const c = document.createElement("canvas");
    c.setAttribute("height", String(CONFIG.CHART.HEIGHT));
    return c;
  }

  _buildChart(canvas, data, stats) {
    const datasets = this.datasetBuilder.buildDatasets(data, stats);
    const options = this.optionsBuilder.buildOptions(data, stats);
    const barDataset = datasets.find(d => d.label === "Day Rating");
    if (barDataset) this._originalBarColors = [...barDataset.backgroundColor];
    this._chart = new Chart(canvas, { data: { labels: data.labels, datasets }, options });
    window[CONFIG.CHART.CANVAS_ID] = this._chart;
  }

  _renderProgressBar(stats, start, end) {
    const { validCount } = stats;
    const totalDays = DateUtils.getTotalDays(start, end);
    const pct = (validCount / totalDays) * 100;
    const periodLabel = PERIOD_CONFIG[PERIOD].label;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;gap:4px;margin-top:2px`;

    const labelRow = document.createElement("div");
    labelRow.style.cssText = `display:flex;justify-content:space-between;font-size:9px;opacity:0.35;letter-spacing:0.6px;font-weight:600`;
    const left = document.createElement("span"); left.textContent = `${periodLabel} PROGRESS`;
    const right = document.createElement("span"); right.textContent = `${validCount} / ${totalDays} DAYS`;
    labelRow.appendChild(left); labelRow.appendChild(right);

    const track = document.createElement("div");
    track.style.cssText = `width:100%;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden`;
    const fill = document.createElement("div");
    fill.style.cssText = `height:100%;width:${pct.toFixed(1)}%;background:rgba(255,255,255,0.3);border-radius:2px`;
    track.appendChild(fill);
    wrapper.appendChild(labelRow); wrapper.appendChild(track);
    return wrapper;
  }

  _renderLegend(data) {
    const { ratings } = data;
    const distribution = {};
    for (let i = 1; i <= 10; i++) distribution[i] = 0;
    ratings.forEach(r => { if (r != null) { const d = Math.round(r); if (distribution[d] !== undefined) distribution[d]++; } });
    const totalDist = Object.values(distribution).reduce((a, b) => a + b, 0);

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05)`;

    const titleRow = document.createElement("div");
    titleRow.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;
    titleRow.textContent = "RATING LEGEND  —  CLICK TO FILTER";
    wrapper.appendChild(titleRow);

    const legendRow = document.createElement("div");
    legendRow.style.cssText = `display:flex;gap:6px;align-items:flex-end;justify-content:center`;
    this._legendItems = [];

    for (let i = 1; i <= 10; i++) {
      const color = this.config.RATING_COLORS[i];
      const count = distribution[i] || 0;
      const pct = totalDist > 0 ? (count / totalDist) * 100 : 0;

      const item = document.createElement("div");
      item.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;user-select:none`;
      const bar = document.createElement("div");
      bar.style.cssText = `width:18px;background:rgba(255,255,255,0.06);border-radius:2px 2px 0 0;overflow:hidden;height:32px;display:flex;align-items:flex-end`;
      const bf = document.createElement("div");
      bf.style.cssText = `width:100%;height:${Math.max(pct > 0 ? 2 : 0, Math.round((pct / 100) * 32))}px;background:${color};border-radius:2px 2px 0 0`;
      bar.appendChild(bf);
      const swatch = document.createElement("div");
      swatch.style.cssText = `width:18px;height:18px;border-radius:2px;background:${color};transition:all 0.15s`;
      const lbl = document.createElement("div");
      lbl.style.cssText = `font-size:9px;opacity:0.45;font-weight:700;letter-spacing:0.3px`; lbl.textContent = i;
      const cnt = document.createElement("div");
      cnt.style.cssText = `font-size:8px;opacity:0.3;font-weight:600`; cnt.textContent = count > 0 ? count : "";
      item.appendChild(bar); item.appendChild(swatch); item.appendChild(lbl); item.appendChild(cnt);
      legendRow.appendChild(item);
      item._swatch = swatch;
      item._ratingValue = i;
      this._legendItems.push(item);
      item.onclick = () => this._toggleFilter(i);
      item.onmouseenter = () => { if (this.activeFilter !== i) swatch.style.transform = "scale(1.1)"; };
      item.onmouseleave = () => { if (this.activeFilter !== i) swatch.style.transform = "scale(1)"; };
    }
    wrapper.appendChild(legendRow);
    return wrapper;
  }

  _toggleFilter(rating) {
    this.activeFilter = this.activeFilter === rating ? null : rating;
    this._applyChartFilter();
    this._applyLegendFilter();
  }

  _applyChartFilter() {
    if (!this._chart || !this._originalBarColors || !this._data) return;
    const barDataset = this._chart.data.datasets.find(d => d.label === "Day Rating");
    if (!barDataset) return;
    const active = this.activeFilter;
    barDataset.backgroundColor = this._data.ratings.map((r, i) => {
      if (active === null) return this._originalBarColors[i];
      const rounded = r != null ? Math.round(r) : null;
      return rounded === active ? this._originalBarColors[i] : "rgba(255,255,255,0.05)";
    });
    this._chart.update("none");
  }

  _applyLegendFilter() {
    const active = this.activeFilter;
    this._legendItems.forEach(item => {
      const isActive = active === item._ratingValue;
      item._swatch.style.outline = isActive ? "2px solid rgba(255,255,255,0.8)" : "none";
      item._swatch.style.outlineOffset = "1px";
      item._swatch.style.transform = isActive ? "scale(1.15)" : "scale(1)";
    });
  }
}

/**********************
 * APLICACIÓN
  **********************/
class ChartApp {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
    this.dataManager = new RatingDataManager(dv, config);
    this.renderer = new ChartRenderer(dv, config);
  }

  async run() {
    try {
      await ChartLibraryLoader.ensureLibraries();
      const { start, end } = DateUtils.extractRange(this.dv.current().file.name);
      const data = await this.dataManager.loadData(this.config.DAILY_NOTES_PATH, start, end);
      const stats = StatsCalculator.calculate(data.ratings);
      this.renderer.render(data, stats, start, end);
    } catch (error) {
      this.dv.span(`Error: ${error.message}`);
      console.error("Chart Error:", error);
    }
  }
}

(async function() {
  const app = new ChartApp(dv, CONFIG);
  await app.run();
})();
