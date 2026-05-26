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
  WEEKDAYS: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  
  // Rutas
  DAILY_NOTES_PATH: '"02 - Ψ - Memorium/01 - Daily"',
  
  // Propiedades de página
  PROPERTIES: {
    RATING: "memorium-day-rating",
    DATE: "memorium-date",
    ALIAS: "aliases"
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
 * CALCULADOR DE ESTADÍSTICAS
 **********************/
class StatsCalculator {
  static compute(ratingMap, start, end) {
    const today = moment();
    const effectiveEnd = today.isBefore(end) ? today : end;
    const totalDays = Math.max(0, effectiveEnd.diff(start, "days") + 1);
    const recordedDays = ratingMap.size;

    let sum = 0, bestRating = null, worstRating = null;
    ratingMap.forEach(d => {
      sum += d.rating;
      if (bestRating === null || d.rating > bestRating) bestRating = d.rating;
      if (worstRating === null || d.rating < worstRating) worstRating = d.rating;
    });
    const avg = recordedDays > 0 ? sum / recordedDays : 0;

    const { current, max } = StatsCalculator._calculateStreaks(ratingMap, start, effectiveEnd);
    const distribution = StatsCalculator._calculateDistribution(ratingMap);
    const monthlyAverages = StatsCalculator._calculateMonthlyAverages(ratingMap);

    return { totalDays, recordedDays, avg, currentStreak: current, maxStreak: max, distribution, monthlyAverages, bestRating, worstRating };
  }

  static _calculateStreaks(ratingMap, start, effectiveEnd) {
    let current = 0;
    const checking = effectiveEnd.clone();
    while (checking.isSameOrAfter(start, "day")) {
      if (ratingMap.has(DateUtils.formatDateKey(checking))) {
        current++;
        checking.subtract(1, "day");
      } else {
        break;
      }
    }

    let max = 0, temp = 0;
    const cur = start.clone();
    while (cur.isSameOrBefore(effectiveEnd, "day")) {
      if (ratingMap.has(DateUtils.formatDateKey(cur))) {
        temp++;
        if (temp > max) max = temp;
      } else {
        temp = 0;
      }
      cur.add(1, "day");
    }

    return { current, max };
  }

  static _calculateDistribution(ratingMap) {
    const dist = {};
    for (let i = 1; i <= 10; i++) dist[i] = 0;
    ratingMap.forEach(d => {
      const r = Math.round(d.rating);
      if (dist[r] !== undefined) dist[r]++;
    });
    return dist;
  }

  static _calculateMonthlyAverages(ratingMap) {
    const months = new Map();
    ratingMap.forEach((data, dateKey) => {
      const monthKey = dateKey.substring(0, 7);
      if (!months.has(monthKey)) months.set(monthKey, { sum: 0, count: 0 });
      months.get(monthKey).sum += data.rating;
      months.get(monthKey).count++;
    });
    const result = new Map();
    months.forEach((v, k) => result.set(k, v.sum / v.count));
    return result;
  }
}

/**********************
 * GESTOR DE TOOLTIP
 **********************/
class TooltipManager {
  constructor() {
    document.querySelectorAll(".aleph-heatmap-tooltip").forEach(el => el.remove());
    this._el = document.createElement("div");
    this._el.className = "aleph-heatmap-tooltip";
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
      min-width: 150px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
    `;
    document.body.appendChild(this._el);
  }

  show(event, day, data, rating, color) {
    const dateStr = day.format("ddd DD MMM YYYY").toUpperCase();
    const ratingLine = rating != null
      ? `<div style="display:flex;align-items:center;gap:6px;margin-top:4px">
           <div style="width:8px;height:8px;border-radius:2px;background:${color};flex-shrink:0"></div>
           <span style="font-weight:700;color:${color}">☆${rating}</span>
         </div>`
      : `<div style="opacity:0.4;margin-top:4px;font-size:11px">No entry</div>`;
    const aliasLine = data?.alias
      ? `<div style="opacity:0.5;font-size:11px;margin-top:2px">${data.alias}</div>`
      : "";
    this._el.innerHTML = `
      <div style="font-weight:600;opacity:0.65;font-size:10px;letter-spacing:0.6px">${dateStr}</div>
      ${ratingLine}${aliasLine}
    `;
    this._el.style.display = "block";
    this._move(event);
  }

  move(event) { this._move(event); }
  hide() { this._el.style.display = "none"; }
  destroy() { this._el.remove(); }

  _move(event) {
    this._el.style.left = `${event.clientX + 14}px`;
    this._el.style.top = `${event.clientY - 14}px`;
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
    const firstDay = start.clone().startOf("isoWeek");
    const lastDay = end.clone().endOf("isoWeek");
    
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
        label: moment(monthKey + "-01").format("MMM").toUpperCase(),
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
    this.activeFilter = null;
    this.allCells = [];
    this._legendItems = [];
    this.tooltip = null;
  }

  render(columns, ratingMap, start, end, container, year) {
    this.allCells = [];
    this._legendItems = [];
    if (this.tooltip) this.tooltip.destroy();
    this.tooltip = new TooltipManager();

    const wrapper = this._createWrapper();
    const stats = StatsCalculator.compute(ratingMap, start, end);

    wrapper.appendChild(this._renderStats(stats));

    const monthLabels = new MonthLabelCalculator(this.config).calculateLabels(columns);

    const gridRow = document.createElement("div");
    gridRow.style.cssText = `display:flex;align-items:flex-start;gap:8px`;

    // Fixed weekday labels (outside scroll)
    const weekdayWrapper = document.createElement("div");
    weekdayWrapper.style.cssText = `display:flex;flex-direction:column;gap:8px;flex-shrink:0`;
    const monthSpacer = document.createElement("div");
    monthSpacer.style.cssText = `height:${this.config.MONTH_FONT_SIZE + 4}px`;
    weekdayWrapper.appendChild(monthSpacer);
    weekdayWrapper.appendChild(this._renderWeekdayLabels());
    gridRow.appendChild(weekdayWrapper);

    // Scrollable grid area (no weekday labels inside)
    const gridScroll = document.createElement("div");
    gridScroll.style.cssText = `overflow-x:auto;overflow-y:hidden;padding-bottom:4px;flex:1;min-width:0`;
    const gridInner = document.createElement("div");
    gridInner.style.cssText = `width:max-content;display:flex;flex-direction:column;gap:8px`;
    gridInner.appendChild(this._renderMonthHeader(monthLabels));
    gridInner.appendChild(this._renderHeatmapColumns(columns, ratingMap, start, end));
    gridInner.appendChild(this._renderMonthlyAverages(monthLabels, stats.monthlyAverages));
    gridScroll.appendChild(gridInner);
    gridRow.appendChild(gridScroll);

    wrapper.appendChild(gridRow);
    wrapper.appendChild(this._renderProgressBar(stats));
    wrapper.appendChild(this._renderLegend(stats.distribution));

    container.appendChild(wrapper);
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

  _renderStats(stats) {
    const { avg, recordedDays, totalDays, currentStreak, maxStreak, bestRating, worstRating } = stats;
    const completionPct = totalDays > 0 ? Math.round((recordedDays / totalDays) * 100) : 0;

    const row = document.createElement("div");
    row.style.cssText = `display:flex;gap:20px;flex-wrap:wrap;justify-content:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);margin-bottom:4px`;

    const items = [
      { label: "AVG RATING", value: avg > 0 ? `☆${avg.toFixed(1)}` : "—", color: avg > 0 ? this.dataManager.getColorForRating(Math.round(avg)) : null },
      { label: "LOGGED",     value: `${recordedDays} / ${totalDays}` },
      { label: "COMPLETION", value: `${completionPct}%` },
      { label: "STREAK",     value: `${currentStreak}d` },
      { label: "BEST STREAK",value: `${maxStreak}d` },
      { label: "BEST DAY",   value: bestRating != null ? `☆${bestRating}` : "—", color: bestRating != null ? this.dataManager.getColorForRating(Math.round(bestRating)) : null },
      { label: "WORST DAY",  value: worstRating != null ? `☆${worstRating}` : "—", color: worstRating != null ? this.dataManager.getColorForRating(Math.round(worstRating)) : null },
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

  _renderMonthHeader(monthLabels) {
    const monthRow = document.createElement("div");
    monthRow.style.cssText = `
      display: flex;
      position: relative;
      height: ${this.config.MONTH_FONT_SIZE + 4}px;
    `;

    monthLabels.forEach(monthData => {
      monthRow.appendChild(this._createMonthLabel(monthData));
    });

    return monthRow;
  }

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

  _renderGrid(columns, ratingMap, start, end) {
    const gridWrapper = document.createElement("div");
    gridWrapper.style.cssText = `display: flex; gap: 8px;`;

    gridWrapper.appendChild(this._renderWeekdayLabels());
    gridWrapper.appendChild(this._renderHeatmapColumns(columns, ratingMap, start, end));

    return gridWrapper;
  }

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

  _renderHeatmapColumns(columns, ratingMap, start, end) {
    const container = document.createElement("div");
    container.style.cssText = `display: flex; gap: ${this.config.GAP}px;`;

    columns.forEach((column, index) => {
      if (index > 0 && this._needsMonthSpacer(columns[index - 1], column)) {
        container.appendChild(this._createMonthSpacer());
      }
      container.appendChild(this._renderColumn(column, ratingMap, start, end));
    });

    return container;
  }

  _needsMonthSpacer(prevColumn, currentColumn) {
    return prevColumn &&
           currentColumn.month &&
           prevColumn.month &&
           currentColumn.month !== prevColumn.month &&
           (!currentColumn.isSplit ||
            !prevColumn.isSplit ||
            currentColumn.splitGroupId !== prevColumn.splitGroupId);
  }

  _createMonthSpacer() {
    const spacer = document.createElement("div");
    spacer.style.cssText = `width: ${this.config.CELL_SIZE}px;`;
    return spacer;
  }

  _renderColumn(column, ratingMap, start, end) {
    const col = document.createElement("div");
    col.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: ${this.config.GAP}px;
    `;

    column.days.forEach(day => {
      col.appendChild(this._renderCell(day, ratingMap, start, end));
    });

    return col;
  }

  _renderCell(day, ratingMap, start, end) {
    const cell = document.createElement("div");
    cell.style.cssText = `
      width: ${this.config.CELL_SIZE}px;
      height: ${this.config.CELL_SIZE}px;
      border-radius: 2px;
      transition: transform 0.15s ease;
    `;

    if (!day || !DateUtils.isDateInRange(day, start, end)) {
      cell.style.background = "transparent";
      return cell;
    }

    if (day.isSame(moment(), "day")) {
      cell.style.outline = "2px solid rgba(255,255,255,0.75)";
      cell.style.outlineOffset = "1px";
    }

    this._configureCellData(cell, day, ratingMap);
    return cell;
  }

  _configureCellData(cell, day, ratingMap) {
    const dateKey = DateUtils.formatDateKey(day);
    const data = ratingMap.get(dateKey);
    const rating = data?.rating ?? null;

    cell.style.background = this.dataManager.getColorForRating(rating);
    cell.style.cursor = data?.link ? "pointer" : "default";
    cell.style.opacity = rating == null ? "0.3" : "1";

    this.allCells.push({ cell, rating });
    this._addCellInteractions(cell, day, rating, data);
  }

  _addCellInteractions(cell, day, rating, data) {
    const color = this.dataManager.getColorForRating(rating);

    cell.onmouseenter = (e) => {
      cell.style.transform = "scale(1.2)";
      cell.style.zIndex = "10";
      this.tooltip.show(e, day, data, rating, color);
    };

    cell.onmousemove = (e) => { this.tooltip.move(e); };

    cell.onmouseleave = () => {
      cell.style.transform = "scale(1)";
      cell.style.zIndex = "1";
      this.tooltip.hide();
    };

    if (data?.link) {
      cell.onclick = () => app.workspace.openLinkText(data.link, "", true);
    }
  }

  _renderMonthlyAverages(monthLabels, monthlyAverages) {
    const row = document.createElement("div");
    row.style.cssText = `
      display: flex;
      position: relative;
      height: ${this.config.CELL_SIZE}px;
      margin-top: 2px;
    `;

    monthLabels.forEach(monthData => {
      const avg = monthlyAverages.get(monthData.month);
      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        left: ${monthData.position}px;
        transform: translateX(-50%);
        font-size: ${this.config.MONTH_FONT_SIZE - 1}px;
        font-weight: 700;
        color: ${avg != null ? this.dataManager.getColorForRating(Math.round(avg)) : "inherit"};
        opacity: ${avg != null ? "0.85" : "0.2"};
      `;
      el.textContent = avg != null ? `☆${avg.toFixed(1)}` : "—";
      row.appendChild(el);
    });

    return row;
  }

  _renderProgressBar(stats) {
    const { recordedDays, totalDays } = stats;
    const pct = totalDays > 0 ? (recordedDays / totalDays) * 100 : 0;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;gap:4px;margin-top:2px`;

    const labelRow = document.createElement("div");
    labelRow.style.cssText = `display:flex;justify-content:space-between;font-size:9px;opacity:0.35;letter-spacing:0.6px;font-weight:600`;
    const left = document.createElement("span"); left.textContent = "YEAR PROGRESS";
    const right = document.createElement("span"); right.textContent = `${recordedDays} / ${totalDays} DAYS`;
    labelRow.appendChild(left);
    labelRow.appendChild(right);

    const track = document.createElement("div");
    track.style.cssText = `width:100%;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden`;

    const fill = document.createElement("div");
    fill.style.cssText = `height:100%;width:${pct.toFixed(1)}%;background:rgba(255,255,255,0.3);border-radius:2px`;

    track.appendChild(fill);
    wrapper.appendChild(labelRow);
    wrapper.appendChild(track);
    return wrapper;
  }

  _renderLegend(distribution) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05)`;

    const titleRow = document.createElement("div");
    titleRow.style.cssText = `font-size:9px;opacity:0.35;letter-spacing:0.8px;font-weight:600`;
    titleRow.textContent = "RATING LEGEND  —  CLICK TO FILTER";
    wrapper.appendChild(titleRow);

    const legendRow = document.createElement("div");
    legendRow.style.cssText = `display:flex;gap:6px;align-items:flex-end;justify-content:center`;

    const totalDist = Object.values(distribution).reduce((a, b) => a + b, 0);

    for (let i = 1; i <= 10; i++) {
      const color = this.config.RATING_COLORS[i];
      const count = distribution[i] || 0;
      const pct = totalDist > 0 ? (count / totalDist) * 100 : 0;

      const item = document.createElement("div");
      item.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;user-select:none`;

      const bar = document.createElement("div");
      bar.style.cssText = `width:${this.config.CELL_SIZE}px;background:rgba(255,255,255,0.06);border-radius:2px 2px 0 0;overflow:hidden;height:32px;display:flex;align-items:flex-end`;
      const fill = document.createElement("div");
      const fillH = Math.max(pct > 0 ? 2 : 0, Math.round((pct / 100) * 32));
      fill.style.cssText = `width:100%;height:${fillH}px;background:${color};border-radius:2px 2px 0 0`;
      bar.appendChild(fill);

      const swatch = document.createElement("div");
      swatch.style.cssText = `width:${this.config.CELL_SIZE}px;height:${this.config.CELL_SIZE}px;border-radius:2px;background:${color};transition:all 0.15s`;

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
    this._applyFilter();
  }

  _applyFilter() {
    const active = this.activeFilter;
    this.allCells.forEach(({ cell, rating }) => {
      if (active === null) {
        cell.style.opacity = rating == null ? "0.3" : "1";
      } else {
        cell.style.opacity = (rating != null && Math.round(rating) === active) ? "1" : "0.07";
      }
    });

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

      const { start, end, year } = yearRange;
      
      const ratingMap = await this.dataManager.loadRatings(
        this.config.DAILY_NOTES_PATH,
        start,
        end
      );

      const columns = YearGridBuilder.buildGrid(start, end);
      
      this.renderer.render(columns, ratingMap, start, end, this.dv.container, year);
      
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
