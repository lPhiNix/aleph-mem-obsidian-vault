```dataviewjs

/**********************
 * CONFIGURACIÓN DE COLORES
 **********************/
const EMPTY_COLOR = "#d1d5db";

const RATING_COLORS = {
  1: "#707070ff",
  2: "#f87171",
  3: "#fbbf24",
  4: "#fbbf24",
  5: "#34d399",
  6: "#3b82f6",
  7: "#d047efff",
  8: "#d047efff",
  9: "#d378a5ff",
  10:"#d378a5ff"
};

/**********************
 * CÁLCULO DE PROMEDIO SEMANAL
 **********************/
const week = moment(dv.current().file.name, "YYYY-[W]WW");
const start = week.clone().startOf("isoWeek");
const end   = week.clone().endOf("isoWeek");

const path = '"<%* tR += tp.user.router.memorium().daily %>"'
const pages = dv.pages(path)
  .where(p => p["memorium-day-rating"] != null && p["memorium-date"])
  .where(p => {
    const d = moment(p["memorium-date"].toISODate(), "YYYY-MM-DD");
    return d.isBetween(start, end, "day", "[]");
  });

const ratings = pages.map(p => p["memorium-day-rating"]).array();

if (ratings.length === 0) {
  dv.paragraph("There are no daily notes located this week.");
} else {
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  // Obtener el color más cercano en RATING_COLORS
  const roundedAvg = Math.round(avg);
  const color = RATING_COLORS[roundedAvg] ?? EMPTY_COLOR;

  dv.paragraph(
    `**Average Rating:** <span style="color:${color}; font-weight:bold;">${avg.toFixed(2)}</span> (${ratings.length} days)`
  );
}


```
