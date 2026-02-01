```dataviewjs
/**********************
 * CONFIGURACIÓN
 **********************/
const YEAR = Number(dv.current().file.name); // Nota anual: YYYY
const DAILY_PATH = "02 - Ψ - Memorium/daily";
const PARAM = "memorium-day-rating";

/**********************
 * HEATMAP TRACKER DATA
 **********************/
const trackerData = {
  entries: [],
  separateMonths: true,
  heatmapTitle: "",
  heatmapSubtitle: "",
  basePath: DAILY_PATH,

  colorScheme: {
    paletteName: "AM-Day-Rating"
  },

  intensityConfig: {
    scaleStart: 1,
    scaleEnd: 10,
    defaultIntensity: 1,
    showOutOfRange: true
  },
    
  ui: {
    hideTabs: true,
    hideYear: true,
    hideTitle: true,
    hideSubtitle: true
  }
};

/**********************
 * CARGA DE DATOS (con validación)
 **********************/
const scaleStart = trackerData.intensityConfig.scaleStart;
const scaleEnd = trackerData.intensityConfig.scaleEnd;

dv.pages(`"${DAILY_PATH}"`)
  .where(p => p[PARAM] != null && p["memorium-date"])
  .forEach(p => {
    const d = moment(p["memorium-date"].toISODate(), "YYYY-MM-DD");

    if (d.year() !== YEAR) return;

    // Forzar número
    const raw = p[PARAM];
    const intensityNum = Number(raw);

    // Ignorar no-numéricos
    if (Number.isNaN(intensityNum)) {
      console.warn("Ignorando entrada con intensidad no numérica:", p.file.path, raw);
      return;
    }

    // Clampear al rango permitido
    const intensityClamped = Math.min(Math.max(intensityNum, scaleStart), scaleEnd);

    trackerData.entries.push({
      date: d.format("YYYY-MM-DD"),
      filePath: p.file.path,
      intensity: intensityClamped
    });
  });

// Depuración: ver qué se está pasando al render
console.log("trackerData.entries", trackerData.entries);

renderHeatmapTracker(this.container, trackerData);

```
