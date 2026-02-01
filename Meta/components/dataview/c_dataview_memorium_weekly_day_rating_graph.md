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
  10:"#d1a5bbff"
};

/**********************
 * LIBRERÍAS
 **********************/
async function ensureLibraries() {
  if (typeof Chart === "undefined") {
    await loadScript("https://cdn.jsdelivr.net/npm/chart.js");
  }
  if (!Chart.registry.plugins.get("annotation")) {
    await loadScript("https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation");
  }
}

function loadScript(src) {
  return new Promise(resolve => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

/**********************
 * UTILITIES
 **********************/
function hexToRgba(hex, alpha = 0.5) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  hex = hex.replace("#", "").trim();
  if (hex.length === 3) hex = hex.split("").map(h => h + h).join("");
  if (hex.length === 8) {
    const [r,g,b,a] = [0,2,4,6].map(i => parseInt(hex.slice(i,i+2),16));
    return `rgba(${r},${g},${b},${(a/255)*alpha})`;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return alpha === 1 ? hex : `rgba(0,0,0,${alpha})`;
}

function cssColorWithAlpha(varName, alpha = 1, fallback = "rgba(139,92,246,1)") {
  let v = getComputedStyle(document.documentElement).getPropertyValue(varName) ||
          getComputedStyle(document.body).getPropertyValue(varName) || "";
  v = v.trim();
  if (!v) return fallback;

  if (v.startsWith("rgb(")) return `rgba(${v.slice(4,-1)},${alpha})`;
  if (v.startsWith("rgba(")) return `rgba(${v.slice(5,-1).split(",").slice(0,3).join(",")},${alpha})`;
  if (v.startsWith("hsl(")) return v.replace("hsl(", "hsla(").replace(")", `,${alpha})`);
  if (v.startsWith("hsla(")) return `hsla(${v.slice(5,-1).split(",").slice(0,3).join(",")},${alpha})`;
  if (v.startsWith("#")) return hexToRgba(v, alpha);
  return alpha === 1 ? v : fallback;
}

function colorForValue(val, alpha = 1) {
  if (val == null || Number.isNaN(val)) return hexToRgba(EMPTY_COLOR, alpha);
  const idx = Math.round(Number(val));
  return hexToRgba(RATING_COLORS[idx] ?? EMPTY_COLOR, alpha);
}

/**********************
 * DATOS SEMANALES
 **********************/
function getWeekRange(fileName) {
  const weekMoment = moment(fileName, "GGGG-[W]WW");
  return [
    weekMoment.clone().startOf("isoWeek"),
    weekMoment.clone().endOf("isoWeek")
  ];
}

function initWeekArrays() {
  return {
    labels: Array(7).fill(null),
    ratings: Array(7).fill(null),
    links: Array(7).fill(null),
    aliases: Array(7).fill(null)
  };
}

function fillLabels(labels, startOfWeek) {
  for (let i = 0; i < 7; i++) {
    labels[i] = startOfWeek.clone().add(i, "days").format("ddd, D MMM");
  }
}

async function loadRatings(path, startOfWeek, endOfWeek, ratings, links, aliases) {
  dv.pages(path)
    .where(p => p["memorium-day-rating"] != null && p["memorium-date"])
    .forEach(p => {
      const d = moment(p["memorium-date"].toISODate(), "YYYY-MM-DD");
      if (!d.isBetween(startOfWeek, endOfWeek, "day", "[]")) return;
      const idx = d.isoWeekday() - 1;
      ratings[idx] = p["memorium-day-rating"];
      links[idx] = p.file.path;
      aliases[idx] = p["memorium-alias"];
    });
}

/**********************
 * CHART RENDER
 **********************/
function renderChart({labels, ratings, links, aliases, weeklyAvg, dailyAvg}) {
  const barColors   = ratings.map(r => r == null ? EMPTY_COLOR : (RATING_COLORS[r] ?? EMPTY_COLOR));
  const pointColors = barColors.map(c => hexToRgba(c,0.5));
  const canvas      = dv.el("canvas","",{attr:{height:220}});
  const accentLine  = cssColorWithAlpha("--interactive-accent",0.7,"rgba(139,92,246,0.7)");
  const accentSolid = cssColorWithAlpha("--interactive-accent",1,"#8b5cf6");

  const annotations = {
    neutral: {
      type: "line",
      yMin: 3,
      yMax: 3,
      borderColor: "rgba(255,255,255,0.3)",
      borderWidth: 1,
      borderDash: [6,6],
      label: { content:"Neutral", enabled:true, position:"end" }
    }
  };

  window._memoriumChart = new Chart(canvas, {
    data: {
      labels,
      datasets: [
        {
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
        },
        {
          type: "line",
          label: "Average",
          pointStyle: "rectRot",
          data: dailyAvg,
          borderColor: cssColorWithAlpha("--interactive-accent",0.5,"#8b5cf6"),
          borderWidth: 2,
          spanGaps: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: dailyAvg.map(v => colorForValue(v,0.5)),
          pointBorderColor: cssColorWithAlpha("--interactive-accent",1,"#8b5cf6"),
          pointBorderWidth: 2,
          borderDash: [6,6],
          tension: 0
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
        legend: {
          display: true,
          labels: {
            generateLabels: chart => {
              const lbls = Chart.defaults.plugins.legend.labels.generateLabels(chart) || [];
              if (!weeklyAvg) return lbls;
              return lbls.map(lbl =>
                lbl.text === "Day Rating"
                  ? {...lbl, fillStyle: colorForValue(weeklyAvg), strokeStyle: colorForValue(weeklyAvg)}
                  : lbl
              );
            }
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const i = ctx.dataIndex;
              const datasetLabel = ctx.dataset.label;

              if (datasetLabel === "Average") {
                const v = dailyAvg[i];
                return v == null
                  ? "Average: —"
                  : `Average (to date): ${v.toFixed(2)}`;
              }

              return ratings[i] == null
                ? ["No entry", "Rest / no log"]
                : [
                    `Day Rating: ${ratings[i]}`,
                    `Note: ${aliases[i] ?? "Unnamed"}`
                  ];
            }
          }
        },
        annotation: { annotations }
      },
      onClick: (_, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        if (links[idx]) app.workspace.openLinkText(links[idx], "", true);
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1,
            color: ctx => colorForValue(ctx?.tick?.value ?? ctx.value ?? 0)
          },
          grid: {
            display: true,
            drawBorder: false,
            color: ctx => colorForValue(ctx?.tick?.value ?? ctx.value ?? 0, 0.12),
            lineWidth: 1,
            borderDash: [4,4]
          }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

/**********************
 * RENDER PRINCIPAL
 **********************/
async function render() {
  const [startOfWeek, endOfWeek] = getWeekRange(dv.current().file.name);
  const {labels, ratings, links, aliases} = initWeekArrays();
  fillLabels(labels, startOfWeek);

  const path = "02 - Ψ - Memorium/daily";
  await loadRatings(path, startOfWeek, endOfWeek, ratings, links, aliases);

  const validRatings = ratings.filter(r => r != null);
  const weeklyAvg = validRatings.length
    ? validRatings.reduce((a,b)=>a+b,0) / validRatings.length
    : null;

  const dailyAvg = ratings.map((_, i) => {
    const validSoFar = ratings.slice(0, i+1).filter(v => v != null);
    if (!validSoFar.length) return null;
    return validSoFar.reduce((a,b)=>a+b,0) / validSoFar.length;
  });

  if (weeklyAvg != null) {
    const avgColor = colorForValue(weeklyAvg);
    dv.paragraph(
      `**Average Rating:** <span style="color:${avgColor}; font-weight:bold;">${weeklyAvg.toFixed(2)}</span> (${validRatings.length} days)`
    );
  } else {
    dv.paragraph("_No ratings logged this week_");
  }

  renderChart({labels, ratings, links, aliases, weeklyAvg, dailyAvg});
}

ensureLibraries().then(render);

```