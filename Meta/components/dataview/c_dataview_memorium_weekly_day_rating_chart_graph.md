```dataviewjs

/**********************
 * CONFIGURACIÓN
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
 * CARGA DE LIBRERÍAS
 **********************/
function loadScript(src) {
  return new Promise(resolve => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

async function ensureLibraries() {
  if (typeof Chart === "undefined") {
    await loadScript("https://cdn.jsdelivr.net/npm/chart.js");
  }
  if (!Chart.registry.plugins.get("annotation")) {
    await loadScript("https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation");
  }
  renderChart();
}

ensureLibraries();

/**********************
 * HELPERS
 **********************/
function hexToRgba(hex, alpha = 0.5) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**********************
 * RENDER
 **********************/
function renderChart() {

  if (window._memoriumChart) {
    window._memoriumChart.destroy();
  }

  const weekMoment = moment(dv.current().file.name, "YYYY-[W]WW");
  const startOfWeek = weekMoment.clone().startOf("isoWeek");
  const endOfWeek   = weekMoment.clone().endOf("isoWeek");

  const labels  = [];
  const ratings = Array(7).fill(null);
  const links   = Array(7).fill(null);
  const aliases = Array(7).fill(null);

  for (let i = 0; i < 7; i++) {
    labels.push(startOfWeek.clone().add(i, "days").format("ddd, D MMM"));
  }

  dv.pages('"02 - Ψ - Memorium/daily"')
    .filter(p => p["memorium-day-rating"] != null && p["memorium-date"])
    .forEach(p => {
      const d = moment(p["memorium-date"].toISODate(), "YYYY-MM-DD");
      if (!d.isBetween(startOfWeek, endOfWeek, "day", "[]")) return;

      const idx = d.isoWeekday() - 1;
      ratings[idx] = p["memorium-day-rating"];
      links[idx]   = p.file.path;
      aliases[idx] = p["memorium-alias"];
    });

  /**********************
   * MEDIA SEMANAL
   **********************/
  const validRatings = ratings.filter(r => r != null);
  const weeklyAvg = validRatings.length
    ? validRatings.reduce((a,b) => a + b, 0) / validRatings.length
    : null;

  const barColors = ratings.map(r =>
    r == null ? EMPTY_COLOR : (RATING_COLORS[r] ?? EMPTY_COLOR)
  );

  const pointColors = barColors.map(c => hexToRgba(c, 0.5));

  const canvas = dv.el("canvas", "", { attr: { height: 220 } });

  window._memoriumChart = new Chart(canvas, {
    data: {
      labels,
      datasets: [
        {
          type: "line",
          label: "Progression",
          data: ratings,
          borderColor: "rgba(139,92,246,0.7)",
          borderWidth: 2,
          tension: 0.4,
          spanGaps: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: pointColors,
          pointBorderColor: "#8b5cf6",
          pointBorderWidth: 2
        },
        {
          type: "bar",
          label: "Day Rating",
          data: ratings,
          backgroundColor: barColors,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: ctx => {
              const i = ctx.dataIndex;
              if (ratings[i] == null) {
                return ["No entry", "Rest / no log"];
              }
              return [
                `Day Rating: ${ratings[i]}`,
                `Note: ${aliases[i] ?? "Unnamed"}`
              ];
            }
          }
        },
        annotation: {
          annotations: {
            neutral: {
              type: "line",
              yMin: 3,
              yMax: 3,
              borderColor: "rgba(255,255,255,0.3)",
              borderWidth: 1,
              borderDash: [6,6],
              label: {
                content: "Neutral",
                enabled: true,
                position: "end"
              }
            }
          }
        }
      },
      onClick: (evt, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        if (links[idx]) {
          app.workspace.openLinkText(links[idx], "", true);
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { stepSize: 1 },
          grid: {
            color: "rgba(56,56,56,0.5)",
            borderDash: [3,3]
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

```