```dataviewjs
/**********************
 * WEEKLY DAY RATING GRAPH
 * Visualización de ratings semanales con Chart.js
 **********************/

/**********************
 * CONFIGURACIÓN
 **********************/
const CONFIG = {
  // Colores
  EMPTY_COLOR: "#d1d5db",
  RATING_COLORS: {
    1: "#707070ff",
    2: "#f87171",
    3: "#fbbf24",
    4: "#fbbf24",
    5: "#34d399",
    6: "#3b82f6",
    7: "#d047efff",
    8: "#d047efff",
    9: "#d378a5ff",
    10: "#d1a5bbff"
  },

  // Rutas
  DAILY_NOTES_PATH: '"02 - Ψ - Memorium/daily"',

  // Propiedades de página
  PROPERTIES: {
    RATING: "memorium-day-rating",
    DATE: "memorium-date",
    ALIAS: "memorium-alias"
  },

  // Chart.js
  CHART: {
    HEIGHT: 220,
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
   * Extrae el rango de una semana desde el nombre de archivo
   * @param {string} fileName - Nombre del archivo (formato: YYYY-WNN)
   * @returns {Object} Objeto con start y end
   */
  static extractWeekRange(fileName) {
    const weekMoment = moment(fileName, "GGGG-[W]WW");
    return {
      start: weekMoment.clone().startOf("isoWeek"),
      end: weekMoment.clone().endOf("isoWeek")
    };
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
class WeekRatingDataManager {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
  }

  /**
   * Carga los datos de rating de una semana
   * @param {string} path - Ruta de búsqueda
   * @param {moment.Moment} startOfWeek - Inicio de la semana
   * @param {moment.Moment} endOfWeek - Fin de la semana
   * @returns {Object} Objeto con arrays de datos semanales
   */
  async loadWeekData(path, startOfWeek, endOfWeek) {
    const weekData = this._initializeWeekData();
    this._fillLabels(weekData.labels, startOfWeek);
    await this._loadRatings(path, startOfWeek, endOfWeek, weekData);
    
    return weekData;
  }

  /**
   * Inicializa las estructuras de datos para la semana
   * @private
   */
  _initializeWeekData() {
    return {
      labels: Array(7).fill(null),
      ratings: Array(7).fill(null),
      links: Array(7).fill(null),
      aliases: Array(7).fill(null)
    };
  }

  /**
   * Rellena las etiquetas de los días
   * @private
   */
  _fillLabels(labels, startOfWeek) {
    for (let i = 0; i < 7; i++) {
      labels[i] = startOfWeek.clone().add(i, "days").format("ddd, D MMM");
    }
  }

  /**
   * Carga los ratings desde las páginas
   * @private
   */
  async _loadRatings(path, startOfWeek, endOfWeek, weekData) {
    const { RATING, DATE, ALIAS } = this.config.PROPERTIES;

    this.dv.pages(path)
      .where(page => page[RATING] != null && page[DATE])
      .forEach(page => {
        const date = moment(page[DATE].toISODate(), "YYYY-MM-DD");
        
        if (!DateUtils.isDateInRange(date, startOfWeek, endOfWeek)) return;
        
        const dayIndex = date.isoWeekday() - 1;
        weekData.ratings[dayIndex] = page[RATING];
        weekData.links[dayIndex] = page.file.path;
        weekData.aliases[dayIndex] = page[ALIAS];
      });
  }
}

/**********************
 * CALCULADOR DE ESTADÍSTICAS
 **********************/
class WeekStatsCalculator {
  /**
   * Calcula estadísticas de la semana
   * @param {Array} ratings - Array de ratings
   * @returns {Object} Objeto con estadísticas calculadas
   */
  static calculate(ratings) {
    const validRatings = ratings.filter(r => r != null);
    
    return {
      weeklyAvg: this._calculateWeeklyAverage(validRatings),
      dailyAvg: this._calculateDailyAverage(ratings),
      validCount: validRatings.length
    };
  }

  /**
   * Calcula el promedio de la semana
   * @private
   */
  static _calculateWeeklyAverage(validRatings) {
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
   * @param {Object} weekData - Datos de la semana
   * @param {Object} stats - Estadísticas calculadas
   * @returns {Array} Array de datasets
   */
  buildDatasets(weekData, stats) {
    const { ratings } = weekData;
    const { dailyAvg } = stats;

    const barColors = this._buildBarColors(ratings);
    const pointColors = this._buildPointColors(barColors);

    return [
      this._buildProgressionDataset(ratings, pointColors),
      this._buildAverageDataset(dailyAvg),
      this._buildBarDataset(ratings, barColors)
    ];
  }

  /**
   * Construye el array de colores para las barras
   * @private
   */
  _buildBarColors(ratings) {
    return ratings.map(rating => 
      rating == null 
        ? CONFIG.EMPTY_COLOR 
        : (CONFIG.RATING_COLORS[rating] ?? CONFIG.EMPTY_COLOR)
    );
  }

  /**
   * Construye el array de colores para los puntos
   * @private
   */
  _buildPointColors(barColors) {
    return barColors.map(color => ColorUtils.hexToRgba(color, 0.5));
  }

  /**
   * Construye el dataset de línea de progresión
   * @private
   */
  _buildProgressionDataset(ratings, pointColors) {
    const accentLine = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.7);
    const accentSolid = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 1);

    return {
      type: "line",
      label: "Progression",
      data: ratings,
      borderColor: accentLine,
      borderWidth: 2,
      tension: 0.4,
      spanGaps: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: pointColors,
      pointBorderColor: accentSolid,
      pointBorderWidth: 2
    };
  }

  /**
   * Construye el dataset de línea de promedio
   * @private
   */
  _buildAverageDataset(dailyAvg) {
    const accentMedium = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 0.5);
    const accentSolid = ColorUtils.cssColorWithAlpha(CONFIG.THEME.ACCENT_VAR, 1);

    return {
      type: "line",
      label: "Average",
      pointStyle: "rectRot",
      data: dailyAvg,
      borderColor: accentMedium,
      borderWidth: 2,
      spanGaps: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: dailyAvg.map(v => ColorUtils.getColorForRating(v, 0.5)),
      pointBorderColor: accentSolid,
      pointBorderWidth: 2,
      borderDash: [6, 6],
      tension: 0
    };
  }

  /**
   * Construye el dataset de barras
   * @private
   */
  _buildBarDataset(ratings, barColors) {
    return {
      type: "bar",
      label: "Day Rating",
      data: ratings,
      backgroundColor: barColors,
      borderRadius: 6
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
   * @param {Object} weekData - Datos de la semana
   * @param {Object} stats - Estadísticas
   * @returns {Object} Opciones de Chart.js
   */
  buildOptions(weekData, stats) {
    return {
      responsive: true,
      plugins: this._buildPluginOptions(weekData, stats),
      onClick: this._buildClickHandler(weekData),
      scales: this._buildScaleOptions()
    };
  }

  /**
   * Construye las opciones de plugins
   * @private
   */
  _buildPluginOptions(weekData, stats) {
    return {
      legend: this._buildLegendOptions(stats),
      tooltip: this._buildTooltipOptions(weekData, stats),
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
          if (!stats.weeklyAvg) return labels;

          return labels.map(label => {
            if (label.text === "Day Rating") {
              const avgColor = ColorUtils.getColorForRating(stats.weeklyAvg);
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
  _buildTooltipOptions(weekData, stats) {
    const { ratings, aliases } = weekData;
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
      : `Average (to date): ${value.toFixed(2)}`;
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
      `Day Rating: ${ratings[index]}`,
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
  _buildClickHandler(weekData) {
    return (_, elements) => {
      if (!elements.length) return;
      
      const index = elements[0].index;
      const link = weekData.links[index];
      
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
      grid: { display: false }
    };
  }
}

/**********************
 * RENDERIZADOR DE GRÁFICO
 **********************/
class WeeklyChartRenderer {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
    this.datasetBuilder = new ChartDatasetBuilder(config);
    this.optionsBuilder = new ChartOptionsBuilder(config);
  }

  /**
   * Renderiza el gráfico completo
   * @param {Object} weekData - Datos de la semana
   * @param {Object} stats - Estadísticas
   */
  render(weekData, stats) {
    this._renderStatsSummary(stats);
    this._renderChart(weekData, stats);
  }

  /**
   * Renderiza el resumen de estadísticas
   * @private
   */
  _renderStatsSummary(stats) {
    if (stats.weeklyAvg != null) {
      const avgColor = ColorUtils.getColorForRating(stats.weeklyAvg);
      this.dv.paragraph(
        `**Average Rating:** <span style="color:${avgColor}; font-weight:bold;">${stats.weeklyAvg.toFixed(2)}</span> (${stats.validCount} days)`
      );
    } else {
      this.dv.paragraph("_No ratings logged this week_");
    }
  }

  /**
   * Renderiza el gráfico Chart.js
   * @private
   */
  _renderChart(weekData, stats) {
    const canvas = this._createCanvas();
    const datasets = this.datasetBuilder.buildDatasets(weekData, stats);
    const options = this.optionsBuilder.buildOptions(weekData, stats);

    window[CONFIG.CHART.CANVAS_ID] = new Chart(canvas, {
      data: {
        labels: weekData.labels,
        datasets
      },
      options
    });
  }

  /**
   * Crea el elemento canvas
   * @private
   */
  _createCanvas() {
    return this.dv.el("canvas", "", {
      attr: { height: CONFIG.CHART.HEIGHT }
    });
  }
}

/**********************
 * PUNTO DE ENTRADA PRINCIPAL
 **********************/
class WeeklyChartApp {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
    this.dataManager = new WeekRatingDataManager(dv, config);
    this.renderer = new WeeklyChartRenderer(dv, config);
  }

  /**
   * Ejecuta la aplicación
   */
  async run() {
    try {
      await ChartLibraryLoader.ensureLibraries();
      
      const { start, end } = DateUtils.extractWeekRange(this.dv.current().file.name);
      
      const weekData = await this.dataManager.loadWeekData(
        this.config.DAILY_NOTES_PATH,
        start,
        end
      );
      
      const stats = WeekStatsCalculator.calculate(weekData.ratings);
      
      this.renderer.render(weekData, stats);
      
    } catch (error) {
      this._showError(`Error: ${error.message}`);
      console.error("Weekly Chart Error:", error);
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
  const app = new WeeklyChartApp(dv, CONFIG);
  await app.run();
})();

```