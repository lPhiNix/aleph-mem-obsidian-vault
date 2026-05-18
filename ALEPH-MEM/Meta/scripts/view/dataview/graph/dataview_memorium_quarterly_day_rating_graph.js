/**********************
 * QUARTERLY DAY RATING GRAPH
 * Visualización de ratings trimestrales con Chart.js
 **********************/

/**********************
 * CONFIGURACIÓN
 **********************/
const CONFIG = {
  // Colores
  EMPTY_COLOR: "#2a2a2a",
  RATING_COLORS: {
    1: "#4a4a4a",
    2: "#ef4444",
    3: "#f59e0b",
    4: "#fbbf24",
    5: "#10b981",
    6: "#3b82f6",
    7: "#a855f7",
    8: "#c026d3",
    9: "#ec4899",
    10: "#f472b6"
  },

  // Rutas
  DAILY_NOTES_PATH: '"02 - Ψ - Memorium/01 - Daily"',

  // Propiedades de página
  PROPERTIES: {
    RATING: "memorium-day-rating",
    DATE: "memorium-date",
    ALIAS: "alias"
  },

  // Chart.js
  CHART: {
    HEIGHT: 420,
    CANVAS_ID: "_memoriumChart"
  },

  // CDN Libraries
  LIBRARIES: {
    CHARTJS: "https://cdn.jsdelivr.net/npm/chart.js",
    ANNOTATION: "https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation"
  },

  // Tema CSS
  THEME: {
    ACCENT_VAR: "--interactive-accent",
    ACCENT_FALLBACK: "rgba(139,92,246,1)"
  }
};

/**********************
 * GESTOR DE LIBRERÍAS
 **********************/
class ChartLibraryLoader {
  /**
   * Asegura que todas las librerías necesarias estén cargadas
   */
  static async ensureLibraries() {
    await this._loadChartJs();
    await this._loadAnnotationPlugin();
    Chart.defaults.font.family = "'JetBrains Mono', monospace";
  }

  /**
   * Carga Chart.js si no está disponible
   * @private
   */
  static async _loadChartJs() {
    if (typeof Chart === "undefined") {
      await this._loadScript(CONFIG.LIBRARIES.CHARTJS);
    }
  }

  /**
   * Carga el plugin de annotations si no está disponible
   * @private
   */
  static async _loadAnnotationPlugin() {
    if (!Chart.registry.plugins.get("annotation")) {
      await this._loadScript(CONFIG.LIBRARIES.ANNOTATION);
    }
  }

  /**
   * Carga un script externo
   * @param {string} src - URL del script
   * @returns {Promise<void>}
   * @private
   */
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
  /**
   * Convierte un color hexadecimal a rgba
   * @param {string} hex - Color en formato hexadecimal
   * @param {number} alpha - Valor de transparencia (0-1)
   * @returns {string} Color en formato rgba
   */
  static hexToRgba(hex, alpha = 0.5) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    
    hex = hex.replace("#", "").trim();
    
    if (hex.length === 3) {
      hex = hex.split("").map(h => h + h).join("");
    }
    
    if (hex.length === 8) {
      return this._hexWithAlphaToRgba(hex, alpha);
    }
    
    if (hex.length === 6) {
      return this._hexToRgba(hex, alpha);
    }
    
    return alpha === 1 ? hex : `rgba(0,0,0,${alpha})`;
  }

  /**
   * Convierte hex con alpha a rgba
   * @private
   */
  static _hexWithAlphaToRgba(hex, alpha) {
    const [r, g, b, a] = [0, 2, 4, 6].map(i => 
      parseInt(hex.slice(i, i + 2), 16)
    );
    return `rgba(${r},${g},${b},${(a / 255) * alpha})`;
  }

  /**
   * Convierte hex sin alpha a rgba
   * @private
   */
  static _hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /**
   * Obtiene un color CSS con alpha aplicado
   * @param {string} varName - Nombre de la variable CSS
   * @param {number} alpha - Valor de transparencia
   * @param {string} fallback - Color de fallback
   * @returns {string} Color procesado
   */
  static cssColorWithAlpha(varName, alpha = 1, fallback = CONFIG.THEME.ACCENT_FALLBACK) {
    const value = this._getCssVariable(varName);
    if (!value) return fallback;

    return this._applyAlphaToColor(value, alpha, fallback);
  }

  /**
   * Obtiene el valor de una variable CSS
   * @private
   */
  static _getCssVariable(varName) {
    const docValue = getComputedStyle(document.documentElement).getPropertyValue(varName);
    const bodyValue = getComputedStyle(document.body).getPropertyValue(varName);
    return (docValue || bodyValue).trim();
  }

  /**
   * Aplica alpha a diferentes formatos de color
   * @private
   */
  static _applyAlphaToColor(color, alpha, fallback) {
    if (color.startsWith("rgb(")) {
      return `rgba(${color.slice(4, -1)},${alpha})`;
    }
    if (color.startsWith("rgba(")) {
      const rgb = color.slice(5, -1).split(",").slice(0, 3).join(",");
      return `rgba(${rgb},${alpha})`;
    }
    if (color.startsWith("hsl(")) {
      return color.replace("hsl(", "hsla(").replace(")", `,${alpha})`);
    }
    if (color.startsWith("hsla(")) {
      const hsl = color.slice(5, -1).split(",").slice(0, 3).join(",");
      return `hsla(${hsl},${alpha})`;
    }
    if (color.startsWith("#")) {
      return this.hexToRgba(color, alpha);
    }
    return alpha === 1 ? color : fallback;
  }

  /**
   * Obtiene el color correspondiente a un valor de rating
   * @param {number|null} value - Valor del rating
   * @param {number} alpha - Transparencia
   * @returns {string} Color en formato rgba
   */
  static getColorForRating(value, alpha = 1) {
    if (value == null || Number.isNaN(value)) {
      return this.hexToRgba(CONFIG.EMPTY_COLOR, alpha);
    }
    
    const roundedValue = Math.round(Number(value));
    const color = CONFIG.RATING_COLORS[roundedValue] ?? CONFIG.EMPTY_COLOR;
    return this.hexToRgba(color, alpha);
  }
}

/**********************
 * UTILIDADES DE FECHA
 **********************/
class DateUtils {
  /**
   * Extrae el rango de un trimestre desde el nombre de archivo
   * @param {string} fileName - Nombre del archivo (formato: YYYY-Q#)
   * @returns {Object|null} Objeto con start, end, year y quarter o null si hay error
   */
  static extractQuarterRange(fileName) {
    const validationResult = this._validateQuarterFileName(fileName);
    if (!validationResult.valid) {
      return { error: validationResult.error };
    }

    const { year, quarter } = validationResult;
    const startMonth = (quarter - 1) * 3;
    const quarterMoment = moment(`${year}-${startMonth + 1}`, "YYYY-M");
    
    return {
      start: quarterMoment.clone().startOf("quarter"),
      end: quarterMoment.clone().endOf("quarter"),
      year,
      quarter
    };
  }

  /**
   * Valida el formato del nombre de archivo trimestral
   * @param {string} fileName - Nombre del archivo
   * @returns {Object} Resultado de validación
   * @private
   */
  static _validateQuarterFileName(fileName) {
    const match = fileName.match(/(\d{4})-Q(\d)/);
    if (!match) {
      return {
        valid: false,
        error: "Formato esperado: YYYY-Q# (ej: 2024-Q1)"
      };
    }

    const year = parseInt(match[1], 10);
    const quarter = parseInt(match[2], 10);

    if (quarter < 1 || quarter > 4) {
      return {
        valid: false,
        error: "El trimestre debe estar entre 1 y 4"
      };
    }

    return { valid: true, year, quarter };
  }

  /**
   * Verifica si una fecha está dentro de un rango
   * @param {moment.Moment} date - Fecha a verificar
   * @param {moment.Moment} start - Fecha inicio
   * @param {moment.Moment} end - Fecha fin
   * @returns {boolean}
   */
  static isDateInRange(date, start, end) {
    return date.isBetween(start, end, "day", "[]");
  }
}

/**********************
 * GESTOR DE DATOS
 **********************/
class QuarterRatingDataManager {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
  }

  /**
   * Carga los datos de rating de un trimestre
   * @param {string} path - Ruta de búsqueda
   * @param {moment.Moment} startOfQuarter - Inicio del trimestre
   * @param {moment.Moment} endOfQuarter - Fin del trimestre
   * @returns {Object} Objeto con arrays de datos trimestrales
   */
  async loadQuarterData(path, startOfQuarter, endOfQuarter) {
    const quarterData = this._initializeQuarterData(startOfQuarter, endOfQuarter);
    this._fillLabels(quarterData.labels, startOfQuarter);
    await this._loadRatings(path, startOfQuarter, endOfQuarter, quarterData);
    
    return quarterData;
  }

  /**
   * Inicializa las estructuras de datos para el trimestre
   * @private
   */
  _initializeQuarterData(startOfQuarter, endOfQuarter) {
    const daysInQuarter = endOfQuarter.diff(startOfQuarter, "days") + 1;
    return {
      labels: Array(daysInQuarter).fill(null),
      ratings: Array(daysInQuarter).fill(null),
      links: Array(daysInQuarter).fill(null),
      aliases: Array(daysInQuarter).fill(null)
    };
  }

  /**
   * Rellena las etiquetas de los días
   * @private
   */
  _fillLabels(labels, startOfQuarter) {
    for (let i = 0; i < labels.length; i++) {
      labels[i] = startOfQuarter.clone().add(i, "days").format("D MMM");
    }
  }

  /**
   * Carga los ratings desde las páginas
   * @private
   */
  async _loadRatings(path, startOfQuarter, endOfQuarter, quarterData) {
    const { RATING, DATE, ALIAS } = this.config.PROPERTIES;

    this.dv.pages(path)
      .where(page => page[RATING] != null && page[DATE])
      .forEach(page => {
        const date = moment(page[DATE].toISODate(), "YYYY-MM-DD");
        
        if (!DateUtils.isDateInRange(date, startOfQuarter, endOfQuarter)) return;
        
        // Calcula el índice basado en días desde el inicio del trimestre
        const dayIndex = date.diff(startOfQuarter, "days");
        quarterData.ratings[dayIndex] = page[RATING];
        quarterData.links[dayIndex] = page.file.path;
        quarterData.aliases[dayIndex] = page[ALIAS];
      });
  }
}

/**********************
 * CALCULADOR DE ESTADÍSTICAS
 **********************/
class QuarterStatsCalculator {
  /**
   * Calcula estadísticas del trimestre
   * @param {Array} ratings - Array de ratings
   * @returns {Object} Objeto con estadísticas calculadas
   */
  static calculate(ratings) {
    const validRatings = ratings.filter(r => r != null);
    
    return {
      quarterlyAvg: this._calculateQuarterlyAverage(validRatings),
      dailyAvg: this._calculateDailyAverage(ratings),
      validCount: validRatings.length,
      bestRating: validRatings.length > 0 ? Math.max(...validRatings) : null,
      worstRating: validRatings.length > 0 ? Math.min(...validRatings) : null
    };
  }

  /**
   * Calcula el promedio del trimestre
   * @private
   */
  static _calculateQuarterlyAverage(validRatings) {
    if (validRatings.length === 0) return null;
    return validRatings.reduce((a, b) => a + b, 0) / validRatings.length;
  }

  /**
   * Calcula el promedio acumulativo día a día
   * @private
   */
  static _calculateDailyAverage(ratings) {
    return ratings.map((_, index) => {
      const validSoFar = ratings.slice(0, index + 1).filter(v => v != null);
      if (validSoFar.length === 0) return null;
      return validSoFar.reduce((a, b) => a + b, 0) / validSoFar.length;
    });
  }
}

/**********************
 * CONSTRUCTOR DE DATASETS DE CHART.JS
 **********************/
class ChartDatasetBuilder {
  constructor(config) {
    this.config = config;
  }

  /**
   * Construye todos los datasets para el gráfico
   * @param {Object} quarterData - Datos del trimestre
   * @param {Object} stats - Estadísticas calculadas
   * @returns {Array} Array de datasets
   */
  buildDatasets(quarterData, stats) {
    const { ratings } = quarterData;
    const { dailyAvg } = stats;

    const pointColors = this._buildPointColors(ratings);

    return [
      this._buildProgressionDataset(ratings, pointColors),
      this._buildAverageDataset(dailyAvg)
    ];
  }

  /**
   * Construye el array de colores para los puntos
   * @private
   */
  _buildPointColors(ratings) {
    return ratings.map(rating => {
      const color = rating == null 
        ? CONFIG.EMPTY_COLOR 
        : (CONFIG.RATING_COLORS[rating] ?? CONFIG.EMPTY_COLOR);
      return ColorUtils.hexToRgba(color, 1);
    });
  }

  /**
   * Construye el dataset de línea de progresión
   * @private
   */
  _buildProgressionDataset(ratings, pointColors) {
    const accentLine = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.4);
    const accentBorder = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.8);

    return {
      type: "line",
      label: "Day Rating",
      data: ratings,
      borderColor: accentLine,
      borderWidth: 2,
      tension: 0.4,
      spanGaps: true,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: pointColors,
      pointBorderColor: accentBorder,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 3
    };
  }

  /**
   * Construye el dataset de línea de promedio
   * @private
   */
  _buildAverageDataset(dailyAvg) {
    const accentMedium = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.35);
    const accentBorder = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.6);

    return {
      type: "line",
      label: "Average",
      pointStyle: "rectRot",
      data: dailyAvg,
      borderColor: accentMedium,
      borderWidth: 2,
      spanGaps: true,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: dailyAvg.map(v => ColorUtils.getColorForRating(v, 0.7)),
      pointBorderColor: accentBorder,
      pointBorderWidth: 1.5,
      borderDash: [6, 6],
      tension: 0
    };
  }
}

/**********************
 * CONSTRUCTOR DE OPCIONES DE CHART.JS
 **********************/
class ChartOptionsBuilder {
  constructor(config) {
    this.config = config;
  }

  /**
   * Construye las opciones del gráfico
   * @param {Object} quarterData - Datos del trimestre
   * @param {Object} stats - Estadísticas
   * @returns {Object} Opciones de Chart.js
   */
  buildOptions(quarterData, stats) {
    return {
      responsive: true,
      plugins: this._buildPluginOptions(quarterData, stats),
      onClick: this._buildClickHandler(quarterData),
      scales: this._buildScaleOptions()
    };
  }

  /**
   * Construye las opciones de plugins
   * @private
   */
  _buildPluginOptions(quarterData, stats) {
    return {
      legend: this._buildLegendOptions(stats),
      tooltip: this._buildTooltipOptions(quarterData, stats),
      annotation: this._buildAnnotationOptions()
    };
  }

  /**
   * Construye las opciones de leyenda
   * @private
   */
  _buildLegendOptions(stats) {
    return {
      display: true,
      labels: {
        generateLabels: chart => {
          const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart) || [];
          if (!stats.quarterlyAvg) return labels;

          return labels.map(label => {
            if (label.text === "Day Rating") {
              const avgColor = ColorUtils.getColorForRating(stats.quarterlyAvg);
              return {
                ...label,
                fillStyle: avgColor,
                strokeStyle: avgColor
              };
            }
            return label;
          });
        }
      }
    };
  }

  /**
   * Construye las opciones de tooltip
   * @private
   */
  _buildTooltipOptions(quarterData, stats) {
    const { ratings, aliases } = quarterData;
    const { dailyAvg } = stats;

    return {
      callbacks: {
        label: ctx => {
          const index = ctx.dataIndex;
          const datasetLabel = ctx.dataset.label;

          if (datasetLabel === "Average") {
            return this._buildAverageTooltip(dailyAvg, index);
          }

          return this._buildRatingTooltip(ratings, aliases, index);
        }
      }
    };
  }

  /**
   * Construye el tooltip para el promedio
   * @private
   */
  _buildAverageTooltip(dailyAvg, index) {
    const value = dailyAvg[index];
    return value == null 
      ? "Average: —" 
      : `Average (to date): ☆${value.toFixed(2)}`;
  }

  /**
   * Construye el tooltip para el rating
   * @private
   */
  _buildRatingTooltip(ratings, aliases, index) {
    if (ratings[index] == null) {
      return ["No entry", "Rest / no log"];
    }

    return [
      `Day Rating: ☆${ratings[index]}`,
      `Note: ${aliases[index] ?? "Unnamed"}`
    ];
  }

  /**
   * Construye las opciones de anotaciones
   * @private
   */
  _buildAnnotationOptions() {
    return {
      annotations: {
        neutral: {
          type: "line",
          yMin: 3,
          yMax: 3,
          borderColor: "rgba(255,255,255,0.3)",
          borderWidth: 1,
          borderDash: [6, 6],
          label: {
            content: "Neutral",
            enabled: true,
            position: "end"
          }
        }
      }
    };
  }

  /**
   * Construye el manejador de clicks
   * @private
   */
  _buildClickHandler(quarterData) {
    return (_, elements) => {
      if (!elements.length) return;
      
      const index = elements[0].index;
      const link = quarterData.links[index];
      
      if (link) {
        app.workspace.openLinkText(link, "", true);
      }
    };
  }

  /**
   * Construye las opciones de escalas
   * @private
   */
  _buildScaleOptions() {
    return {
      y: this._buildYScaleOptions(),
      x: this._buildXScaleOptions()
    };
  }

  /**
   * Construye las opciones del eje Y
   * @private
   */
  _buildYScaleOptions() {
    return {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 1,
        color: ctx => ColorUtils.getColorForRating(ctx?.tick?.value ?? ctx.value ?? 0)
      },
      grid: {
        display: true,
        drawBorder: false,
        color: ctx => ColorUtils.getColorForRating(ctx?.tick?.value ?? ctx.value ?? 0, 0.12),
        lineWidth: 1,
        borderDash: [4, 4]
      }
    };
  }

  /**
   * Construye las opciones del eje X
   * @private
   */
  _buildXScaleOptions() {
    return {
      grid: { display: false },
      ticks: {
        autoSkip: true,
        maxRotation: 45,
        minRotation: 0
      }
    };
  }
}

/**********************
 * RENDERIZADOR DE GRÁFICO
 **********************/
class QuarterlyChartRenderer {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
    this.datasetBuilder = new ChartDatasetBuilder(config);
    this.optionsBuilder = new ChartOptionsBuilder(config);
    this.activeFilter = null;
    this._chart = null;
    this._quarterData = null;
    this._originalPointColors = null;
    this._legendItems = [];
  }

  render(quarterData, stats, year, quarter) {
    this._quarterData = quarterData;
    const wrapper = this._createWrapper();

    wrapper.appendChild(this._renderStats(quarterData, stats));

    const canvas = this._createCanvas();
    wrapper.appendChild(canvas);
    wrapper.appendChild(this._renderProgressBar(stats, year, quarter));
    wrapper.appendChild(this._renderLegend(quarterData));

    this.dv.container.appendChild(wrapper);
    this._buildChart(canvas, quarterData, stats);
  }

  _createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: rgba(0,0,0,0.1);
      border-radius: 8px;
    `;
    return wrapper;
  }

  _renderStats(quarterData, stats) {
    const { quarterlyAvg, validCount, bestRating, worstRating } = stats;
    const totalDays = quarterData.ratings.length;
    const completionPct = Math.round((validCount / totalDays) * 100);

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:20px;flex-wrap:wrap;justify-content:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);margin-bottom:4px`;

    const items = [
      { label: "AVG RATING", value: quarterlyAvg != null ? `☆${quarterlyAvg.toFixed(1)}` : "—", color: quarterlyAvg != null ? ColorUtils.getColorForRating(quarterlyAvg) : null },
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

      el.appendChild(lbl);
      el.appendChild(val);
      row.appendChild(el);
    });

    return row;
  }

  _createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("height", String(CONFIG.CHART.HEIGHT));
    return canvas;
  }

  _buildChart(canvas, quarterData, stats) {
    const datasets = this.datasetBuilder.buildDatasets(quarterData, stats);
    const options = this.optionsBuilder.buildOptions(quarterData, stats);

    const ratingDataset = datasets.find(d => d.label === "Day Rating");
    if (ratingDataset) {
      this._originalPointColors = [...ratingDataset.pointBackgroundColor];
    }

    this._chart = new Chart(canvas, {
      data: { labels: quarterData.labels, datasets },
      options
    });
    window[CONFIG.CHART.CANVAS_ID] = this._chart;
  }

  _renderProgressBar(stats, year, quarter) {
    const { validCount } = stats;
    const totalDays = this._quarterData.ratings.length;
    const start = moment(`${year}-${(quarter - 1) * 3 + 1}`, "YYYY-M").startOf("quarter");
    const end = start.clone().endOf("quarter");
    const today = moment();
    const effectiveDays = today.isBetween(start, end, "day", "[]")
      ? today.diff(start, "days") + 1
      : totalDays;
    const pct = (validCount / effectiveDays) * 100;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;gap:4px;margin-top:2px`;

    const labelRow = document.createElement("div");
    labelRow.style.cssText = `display:flex;justify-content:space-between;font-size:9px;opacity:0.35;letter-spacing:0.6px;font-weight:600`;
    const left = document.createElement("span"); left.textContent = "QUARTER PROGRESS";
    const right = document.createElement("span"); right.textContent = `${validCount} / ${totalDays} DAYS`;
    labelRow.appendChild(left);
    labelRow.appendChild(right);

    const track = document.createElement("div");
    track.style.cssText = `width:100%;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden`;

    const fill = document.createElement("div");
    fill.style.cssText = `height:100%;width:${Math.min(100, pct).toFixed(1)}%;background:rgba(255,255,255,0.3);border-radius:2px`;

    track.appendChild(fill);
    wrapper.appendChild(labelRow);
    wrapper.appendChild(track);
    return wrapper;
  }

  _renderLegend(quarterData) {
    const { ratings } = quarterData;
    const distribution = {};
    for (let i = 1; i <= 10; i++) distribution[i] = 0;
    ratings.forEach(r => {
      if (r != null) {
        const rounded = Math.round(r);
        if (distribution[rounded] !== undefined) distribution[rounded]++;
      }
    });
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
      const fill = document.createElement("div");
      const fillH = Math.max(pct > 0 ? 2 : 0, Math.round((pct / 100) * 32));
      fill.style.cssText = `width:100%;height:${fillH}px;background:${color};border-radius:2px 2px 0 0`;
      bar.appendChild(fill);

      const swatch = document.createElement("div");
      swatch.style.cssText = `width:18px;height:18px;border-radius:2px;background:${color};transition:all 0.15s`;

      const label = document.createElement("div");
      label.style.cssText = `font-size:9px;opacity:0.45;font-weight:700;letter-spacing:0.3px`;
      label.textContent = i;

      const countEl = document.createElement("div");
      countEl.style.cssText = `font-size:8px;opacity:0.3;font-weight:600`;
      countEl.textContent = count > 0 ? count : "";

      item.appendChild(bar);
      item.appendChild(swatch);
      item.appendChild(label);
      item.appendChild(countEl);
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
    if (!this._chart || !this._originalPointColors || !this._quarterData) return;
    const active = this.activeFilter;
    const ratingDataset = this._chart.data.datasets.find(d => d.label === "Day Rating");
    if (!ratingDataset) return;

    ratingDataset.pointBackgroundColor = this._quarterData.ratings.map((r, i) => {
      if (active === null) return this._originalPointColors[i];
      const rounded = r != null ? Math.round(r) : null;
      return rounded === active ? this._originalPointColors[i] : "rgba(255,255,255,0.05)";
    });
    ratingDataset.pointRadius = this._quarterData.ratings.map(r => {
      if (active === null) return 6;
      return r != null && Math.round(r) === active ? 8 : 3;
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
 * PUNTO DE ENTRADA PRINCIPAL
 **********************/
class QuarterlyChartApp {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
    this.dataManager = new QuarterRatingDataManager(dv, config);
    this.renderer = new QuarterlyChartRenderer(dv, config);
  }

  /**
   * Ejecuta la aplicación
   */
  async run() {
    try {
      await ChartLibraryLoader.ensureLibraries();
      
      const rangeResult = DateUtils.extractQuarterRange(this.dv.current().file.name);
      
      if (rangeResult.error) {
        this._showError(rangeResult.error);
        return;
      }
      
      const { start, end, year, quarter } = rangeResult;
      
      const quarterData = await this.dataManager.loadQuarterData(
        this.config.DAILY_NOTES_PATH,
        start,
        end
      );
      
      const stats = QuarterStatsCalculator.calculate(quarterData.ratings);
      
      this.renderer.render(quarterData, stats, year, quarter);
      
    } catch (error) {
      this._showError(`Error: ${error.message}`);
      console.error("Quarterly Chart Error:", error);
    }
  }

  /**
   * Muestra un mensaje de error
   * @private
   */
  _showError(message) {
    this.dv.span(message);
  }
}

/**********************
 * EJECUCIÓN
 **********************/
(async function() {
  const app = new QuarterlyChartApp(dv, CONFIG);
  await app.run();
})();
