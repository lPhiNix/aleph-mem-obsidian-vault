/**********************
 * YEARLY DAY GRID HEATMAP
 * Visualización de ratings diarios en formato calendario anual
 **********************/

/**********************
 * CONFIGURACIÓN
 **********************/
const CONFIG = {
  // Dimensiones visuales
  CELL_SIZE: 18,
  GAP: 4,
  
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
  
  // Etiquetas
  WEEKDAYS: ["", "Tue", "", "Thu", "", "Sat", ""],
  
  // Rutas
  DAILY_NOTES_PATH: '"02 - Ψ - Memorium/daily"',
  
  // Propiedades de página
  PROPERTIES: {
    RATING: "memorium-day-rating",
    DATE: "memorium-date",
    ALIAS: "alias"
  },
  
  // Funciones calculadas
  get MONTH_FONT_SIZE() { return Math.max(8, this.CELL_SIZE * 0.9); },
  get WEEKDAY_FONT_SIZE() { return Math.max(8, this.CELL_SIZE * 0.9); }
};

/**********************
 * UTILIDADES DE FECHA
 **********************/
class DateUtils {
  /**
   * Extrae el año del nombre de archivo
   * @param {string} fileName - Nombre del archivo
   * @returns {Object|null} Objeto con fechas de inicio y fin del año
   */
  static extractYearRange(fileName) {
    const match = fileName.match(/(\d{4})/);
    if (!match) return null;

    const year = parseInt(match[1]);
    return {
      start: moment(`${year}-01-01`),
      end: moment(`${year}-12-31`),
      year
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

  /**
   * Formatea una fecha como clave YYYY-MM-DD
   * @param {moment.Moment} date
   * @returns {string}
   */
  static formatDateKey(date) {
    return date.format("YYYY-MM-DD");
  }

  /**
   * Formatea una fecha como clave de mes YYYY-MM
   * @param {moment.Moment} date
   * @returns {string}
   */
  static formatMonthKey(date) {
    return date.format("YYYY-MM");
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

  /**
   * Carga los ratings de las notas diarias
   * @param {string} path - Ruta de búsqueda
   * @param {moment.Moment} start - Fecha inicio
   * @param {moment.Moment} end - Fecha fin
   * @returns {Map} Mapa de fechas a datos de rating
   */
  async loadRatings(path, start, end) {
    const ratingMap = new Map();
    const { RATING, DATE, ALIAS } = this.config.PROPERTIES;

    this.dv.pages(path)
      .where(page => page[RATING] != null && page[DATE])
      .forEach(page => {
        const date = moment(page[DATE].toISODate());

        if (!DateUtils.isDateInRange(date, start, end)) return;

        ratingMap.set(DateUtils.formatDateKey(date), {
          rating: page[RATING],
          link: page.file.path,
          alias: page[ALIAS]
        });
      });

    return ratingMap;
  }

  /**
   * Obtiene el color correspondiente a un valor de rating
   * @param {number|null} value - Valor del rating
   * @returns {string} Color hexadecimal
   */
  getColorForRating(value) {
    if (value == null) return this.config.EMPTY_COLOR;
    const roundedValue = Math.round(value);
    return this.config.RATING_COLORS[roundedValue] ?? this.config.EMPTY_COLOR;
  }
}

/**********************
 * CONSTRUCTOR DE GRID
 **********************/
class YearGridBuilder {
  /**
   * Construye la estructura de columnas del grid anual
   * @param {moment.Moment} start - Fecha inicio del año
   * @param {moment.Moment} end - Fecha fin del año
   * @returns {Array} Array de columnas con días agrupados
   */
  static buildGrid(start, end) {
    const firstDay = start.clone().startOf("week");
    const lastDay = end.clone().endOf("week");
    
    const columns = [];
    let currentDate = firstDay.clone();

    while (currentDate.isSameOrBefore(lastDay)) {
      const weekDays = this._generateWeekDays(currentDate);
      const splitColumns = this._splitWeekByMonth(weekDays, start, end, columns.length);
      
      columns.push(...splitColumns);
      currentDate.add(7, "days");
    }

    return columns;
  }

  /**
   * Genera los 7 días de una semana
   * @private
   */
  static _generateWeekDays(startDate) {
    const days = [];
    const current = startDate.clone();
    
    for (let i = 0; i < 7; i++) {
      days.push(current.clone());
      current.add(1, "day");
    }
    
    return days;
  }

  /**
   * Divide una semana en columnas separadas si cruza meses
   * @private
   */
  static _splitWeekByMonth(weekDays, yearStart, yearEnd, columnIndex) {
    const daysByMonth = this._groupDaysByMonth(weekDays, yearStart, yearEnd);
    
    if (daysByMonth.size > 1) {
      return this._createSplitColumns(daysByMonth, columnIndex);
    }
    
    return this._createSingleColumn(weekDays, daysByMonth);
  }

  /**
   * Agrupa los días de una semana por mes
   * @private
   */
  static _groupDaysByMonth(weekDays, yearStart, yearEnd) {
    const daysByMonth = new Map();
    
    weekDays.forEach((day, dayIndex) => {
      if (DateUtils.isDateInRange(day, yearStart, yearEnd)) {
        const monthKey = DateUtils.formatMonthKey(day);
        
        if (!daysByMonth.has(monthKey)) {
          daysByMonth.set(monthKey, []);
        }
        
        daysByMonth.get(monthKey).push({ day, dayIndex });
      }
    });
    
    return daysByMonth;
  }

  /**
   * Crea columnas divididas para semanas que cruzan meses
   * @private
   */
  static _createSplitColumns(daysByMonth, baseColumnIndex) {
    const sortedMonths = Array.from(daysByMonth.keys()).sort();
    const splitGroupId = `split_${baseColumnIndex}`;
    
    return sortedMonths.map((monthKey, idx) => {
      const column = Array(7).fill(null);
      
      daysByMonth.get(monthKey).forEach(({ day, dayIndex }) => {
        column[dayIndex] = day;
      });
      
      return {
        days: column,
        month: monthKey,
        isSplit: true,
        splitGroupId,
        isFirstSplit: idx === 0,
        isLastSplit: idx === sortedMonths.length - 1
      };
    });
  }

  /**
   * Crea una columna única para una semana completa
   * @private
   */
  static _createSingleColumn(weekDays, daysByMonth) {
    return [{
      days: weekDays,
      month: daysByMonth.size > 0 ? Array.from(daysByMonth.keys())[0] : null,
      isSplit: false,
      splitGroupId: null,
      isFirstSplit: false,
      isLastSplit: false
    }];
  }

  /**
   * Verifica si una columna está completa para su mes
   * @param {Object} column - Columna a verificar
   * @returns {boolean}
   */
  static isColumnComplete(column) {
    if (!column.month) return false;
    
    const daysInMonth = column.days.filter(day => 
      day && DateUtils.formatMonthKey(day) === column.month
    ).length;
    
    return daysInMonth === 7;
  }
}

/**********************
 * CALCULADOR DE ETIQUETAS DE MES
 **********************/
class MonthLabelCalculator {
  constructor(config) {
    this.config = config;
  }

  /**
   * Calcula las posiciones de las etiquetas de mes
   * @param {Array} columns - Columnas del grid
   * @returns {Array} Array de objetos con posición y etiqueta
   */
  calculateLabels(columns) {
    const monthData = this._collectMonthPositions(columns);
    return this._generateLabels(monthData);
  }

  /**
   * Recolecta todas las posiciones de cada mes
   * @private
   */
  _collectMonthPositions(columns) {
    const monthData = new Map();
    let currentX = 0;

    columns.forEach((column, index) => {
      if (index > 0) {
        currentX += this._calculateGap(columns[index - 1], column);
      }

      if (column.month) {
        this._addMonthPosition(monthData, column, currentX);
      }

      currentX += this.config.CELL_SIZE;
    });

    return monthData;
  }

  /**
   * Calcula el gap entre dos columnas
   * @private
   */
  _calculateGap(prevColumn, currentColumn) {
    const needsSpacer = this._needsMonthSpacer(prevColumn, currentColumn);
    
    if (needsSpacer) {
      return this.config.GAP + this.config.CELL_SIZE + this.config.GAP;
    }
    
    return this.config.GAP;
  }

  /**
   * Verifica si se necesita un espaciador entre meses
   * @private
   */
  _needsMonthSpacer(prevColumn, currentColumn) {
    return prevColumn && 
           currentColumn.month && 
           prevColumn.month && 
           currentColumn.month !== prevColumn.month && 
           (!currentColumn.isSplit || 
            !prevColumn.isSplit || 
            currentColumn.splitGroupId !== prevColumn.splitGroupId);
  }

  /**
   * Añade una posición al mapa de datos de mes
   * @private
   */
  _addMonthPosition(monthData, column, currentX) {
    const cellCenter = currentX + (this.config.CELL_SIZE / 2);
    const isComplete = YearGridBuilder.isColumnComplete(column);
    
    if (!monthData.has(column.month)) {
      monthData.set(column.month, { 
        positions: [{ x: cellCenter, isComplete, isFirst: true }]
      });
    } else {
      monthData.get(column.month).positions.push({ 
        x: cellCenter, 
        isComplete, 
        isFirst: false 
      });
    }
  }

  /**
   * Genera las etiquetas finales a partir de los datos recolectados
   * @private
   */
  _generateLabels(monthData) {
    const labels = [];

    monthData.forEach((data, monthKey) => {
      const positions = this._filterIncompleteFirstColumn(data.positions);
      const centerPosition = this._calculateCenterPosition(positions);
      
      labels.push({
        position: centerPosition,
        label: moment(monthKey + "-01").format("MMM"),
        month: monthKey
      });
    });

    return labels;
  }

  /**
   * Filtra la primera columna si está incompleta
   * @private
   */
  _filterIncompleteFirstColumn(positions) {
    if (positions.length > 1 && 
        positions[0].isFirst && 
        !positions[0].isComplete) {
      return positions.slice(1);
    }
    return positions;
  }

  /**
   * Calcula la posición central entre el inicio y fin
   * @private
   */
  _calculateCenterPosition(positions) {
    const startX = positions[0].x;
    const endX = positions[positions.length - 1].x;
    return (startX + endX) / 2;
  }
}

/**********************
 * RENDERIZADOR DE HEATMAP
 **********************/
class HeatmapRenderer {
  constructor(config, dataManager) {
    this.config = config;
    this.dataManager = dataManager;
  }

  /**
   * Renderiza el heatmap completo
   * @param {Array} columns - Columnas del grid
   * @param {Map} ratingMap - Mapa de ratings
   * @param {moment.Moment} start - Fecha inicio
   * @param {moment.Moment} end - Fecha fin
   * @param {HTMLElement} container - Contenedor DOM
   */
  render(columns, ratingMap, start, end, container) {
    const wrapper = this._createWrapper();
    
    const monthLabels = new MonthLabelCalculator(this.config).calculateLabels(columns);
    const monthRow = this._renderMonthHeader(monthLabels);
    wrapper.appendChild(monthRow);

    const gridWrapper = this._renderGrid(columns, ratingMap, start, end);
    wrapper.appendChild(gridWrapper);

    container.appendChild(wrapper);
  }

  /**
   * Crea el contenedor principal
   * @private
   */
  _createWrapper() {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: rgba(0,0,0,0.1);
      border-radius: 8px;
      max-width: fit-content;
    `;
    return wrapper;
  }

  /**
   * Renderiza la fila de encabezados de mes
   * @private
   */
  _renderMonthHeader(monthLabels) {
    const monthRow = document.createElement("div");
    monthRow.style.cssText = `
      display: flex;
      margin-left: ${this.config.CELL_SIZE + 16}px;
      position: relative;
      height: ${this.config.MONTH_FONT_SIZE + 4}px;
      margin-bottom: 4px;
    `;

    monthLabels.forEach(monthData => {
      const label = this._createMonthLabel(monthData);
      monthRow.appendChild(label);
    });

    return monthRow;
  }

  /**
   * Crea una etiqueta de mes individual
   * @private
   */
  _createMonthLabel(monthData) {
    const el = document.createElement("div");
    el.textContent = monthData.label;
    el.style.cssText = `
      position: absolute;
      left: ${monthData.position}px;
      transform: translateX(-50%);
      font-size: ${this.config.MONTH_FONT_SIZE}px;
      opacity: 0.6;
      font-weight: 500;
      letter-spacing: 0.5px;
    `;
    return el;
  }

  /**
   * Renderiza el grid completo con etiquetas de días y celdas
   * @private
   */
  _renderGrid(columns, ratingMap, start, end) {
    const gridWrapper = document.createElement("div");
    gridWrapper.style.cssText = `display: flex; gap: 8px;`;

    const weekdayColumn = this._renderWeekdayLabels();
    gridWrapper.appendChild(weekdayColumn);

    const heatmapContainer = this._renderHeatmapColumns(columns, ratingMap, start, end);
    gridWrapper.appendChild(heatmapContainer);

    return gridWrapper;
  }

  /**
   * Renderiza la columna de etiquetas de días de la semana
   * @private
   */
  _renderWeekdayLabels() {
    const weekdayCol = document.createElement("div");
    weekdayCol.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: ${this.config.GAP}px;
    `;

    this.config.WEEKDAYS.forEach(dayLabel => {
      const label = document.createElement("div");
      label.textContent = dayLabel;
      label.style.cssText = `
        height: ${this.config.CELL_SIZE}px;
        font-size: ${this.config.WEEKDAY_FONT_SIZE}px;
        opacity: 0.5;
        display: flex;
        align-items: center;
        font-weight: 500;
      `;
      weekdayCol.appendChild(label);
    });

    return weekdayCol;
  }

  /**
   * Renderiza todas las columnas del heatmap
   * @private
   */
  _renderHeatmapColumns(columns, ratingMap, start, end) {
    const container = document.createElement("div");
    container.style.cssText = `display: flex; gap: ${this.config.GAP}px;`;

    columns.forEach((column, index) => {
      if (index > 0 && this._needsMonthSpacer(columns[index - 1], column)) {
        container.appendChild(this._createMonthSpacer());
      }

      const columnElement = this._renderColumn(column, ratingMap, start, end);
      container.appendChild(columnElement);
    });

    return container;
  }

  /**
   * Verifica si se necesita un espaciador entre columnas
   * @private
   */
  _needsMonthSpacer(prevColumn, currentColumn) {
    return prevColumn && 
           currentColumn.month && 
           prevColumn.month && 
           currentColumn.month !== prevColumn.month && 
           (!currentColumn.isSplit || 
            !prevColumn.isSplit || 
            currentColumn.splitGroupId !== prevColumn.splitGroupId);
  }

  /**
   * Crea un espaciador entre meses
   * @private
   */
  _createMonthSpacer() {
    const spacer = document.createElement("div");
    spacer.style.cssText = `width: ${this.config.CELL_SIZE}px;`;
    return spacer;
  }

  /**
   * Renderiza una columna individual
   * @private
   */
  _renderColumn(column, ratingMap, start, end) {
    const col = document.createElement("div");
    col.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: ${this.config.GAP}px;
    `;

    column.days.forEach(day => {
      const cell = this._renderCell(day, ratingMap, start, end);
      col.appendChild(cell);
    });

    return col;
  }

  /**
   * Renderiza una celda individual del heatmap
   * @private
   */
  _renderCell(day, ratingMap, start, end) {
    const cell = document.createElement("div");
    cell.style.cssText = `
      width: ${this.config.CELL_SIZE}px;
      height: ${this.config.CELL_SIZE}px;
      border-radius: 2px;
      transition: all 0.2s ease;
    `;

    if (!day || !DateUtils.isDateInRange(day, start, end)) {
      cell.style.background = "transparent";
      return cell;
    }

    this._configureCellData(cell, day, ratingMap);
    return cell;
  }

  /**
   * Configura los datos y comportamiento de una celda
   * @private
   */
  _configureCellData(cell, day, ratingMap) {
    const dateKey = DateUtils.formatDateKey(day);
    const data = ratingMap.get(dateKey);
    const rating = data?.rating ?? null;

    // Estilos visuales
    cell.style.background = this.dataManager.getColorForRating(rating);
    cell.style.cursor = data?.link ? "pointer" : "default";
    cell.style.opacity = rating == null ? "0.3" : "1";

    // Tooltip
    cell.title = this._generateTooltip(day, data, rating);

    // Interactividad
    this._addCellInteractions(cell, rating, data);
  }

  /**
   * Genera el texto del tooltip
   * @private
   */
  _generateTooltip(day, data, rating) {
    if (data) {
      return `${day.format("DD MMM YYYY")}\nRating: ${rating}\n${data.alias ?? ""}`;
    }
    return `${day.format("DD MMM YYYY")}\nNo entry`;
  }

  /**
   * Añade las interacciones de hover y click a una celda
   * @private
   */
  _addCellInteractions(cell, rating, data) {
    const color = this.dataManager.getColorForRating(rating);

    cell.onmouseenter = () => {
      cell.style.transform = "scale(1.2)";
      cell.style.zIndex = "10";
      cell.style.boxShadow = `0 0 8px ${color}`;
    };

    cell.onmouseleave = () => {
      cell.style.transform = "scale(1)";
      cell.style.zIndex = "1";
      cell.style.boxShadow = "none";
    };

    if (data?.link) {
      cell.onclick = () => app.workspace.openLinkText(data.link, "", true);
    }
  }
}

/**********************
 * PUNTO DE ENTRADA PRINCIPAL
 **********************/
class YearlyHeatmapApp {
  constructor(dv, config) {
    this.dv = dv;
    this.config = config;
    this.dataManager = new RatingDataManager(dv, config);
    this.renderer = new HeatmapRenderer(config, this.dataManager);
  }

  /**
   * Ejecuta la aplicación
   */
  async run() {
    try {
      const yearRange = this._getYearRange();
      if (!yearRange) {
        this._showError("Formato esperado: YYYY");
        return;
      }

      const { start, end } = yearRange;
      
      const ratingMap = await this.dataManager.loadRatings(
        this.config.DAILY_NOTES_PATH,
        start,
        end
      );

      const columns = YearGridBuilder.buildGrid(start, end);
      
      this.renderer.render(columns, ratingMap, start, end, this.dv.container);
      
    } catch (error) {
      this._showError(`Error: ${error.message}`);
      console.error("Yearly Heatmap Error:", error);
    }
  }

  /**
   * Obtiene el rango de año desde el nombre del archivo
   * @private
   */
  _getYearRange() {
    return DateUtils.extractYearRange(this.dv.current().file.name);
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
  const app = new YearlyHeatmapApp(dv, CONFIG);
  await app.run();
})();
