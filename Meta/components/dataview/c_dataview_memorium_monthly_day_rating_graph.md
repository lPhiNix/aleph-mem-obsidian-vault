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
 * DATOS MENSUALES
 **********************/
function getMonthRange(fileName) {
  const m = moment(fileName, "YYYY-MM-MMMM");
  return [m.clone().startOf("month"), m.clone().endOf("month")];
}

async function loadMonthlyRatings(path, startOfMonth, endOfMonth) {
  const entries = [];

  dv.pages(path)
    .where(p => p["memorium-day-rating"] != null && p["memorium-date"])
    .forEach(p => {
      const d = moment(p["memorium-date"].toISODate(), "YYYY-MM-DD");
      if (!d.isBetween(startOfMonth, endOfMonth, "day", "[]")) return;

      entries.push({
        date: d,
        rating: p["memorium-day-rating"],
        link: p.file.path,
        alias: p["memorium-alias"]
      });
    });

  // Orden cronológico
  entries.sort((a,b) => a.date - b.date);

  return {
    labels: entries.map(e => e.date.format("ddd, D MMM")),
    ratings: entries.map(e => e.rating),
    links: entries.map(e => e.link),
    aliases: entries.map(e => e.alias)
  };
}

/**********************
 * CHART RENDER
 **********************/
function renderChart({labels, ratings, links, aliases, monthlyAvg, dailyAvg}) {
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
          display: true
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const i = ctx.dataIndex;
              if (ctx.dataset.label === "Average") {
                return dailyAvg[i] == null
                  ? "Average: —"
                  : `Average (to date): ${dailyAvg[i].toFixed(2)}`;
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
            drawBorder: false,
            color: ctx => colorForValue(ctx?.tick?.value ?? ctx.value ?? 0, 0.12),
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
  const [startOfMonth, endOfMonth] = getMonthRange(dv.current().file.name);

  const path = '"<%* tR += tp.user.router.memorium().daily; %>"';
  const {labels, ratings, links, aliases} =
    await loadMonthlyRatings(path, startOfMonth, endOfMonth);

  const validRatings = ratings.filter(r => r != null);
  const monthlyAvg = validRatings.length
    ? validRatings.reduce((a,b)=>a+b,0) / validRatings.length
    : null;

  const dailyAvg = ratings.map((_, i) => {
    const validSoFar = ratings.slice(0, i+1).filter(v => v != null);
    if (!validSoFar.length) return null;
    return validSoFar.reduce((a,b)=>a+b,0) / validSoFar.length;
  });

  if (monthlyAvg != null) {
    const avgColor = colorForValue(monthlyAvg);
    dv.paragraph(
      `**Average Rating (Month):** <span style="color:${avgColor}; font-weight:bold;">${monthlyAvg.toFixed(2)}</span> (${validRatings.length} days)`
    );
  } else {
    dv.paragraph("_No ratings logged this month_");
  }

  renderChart({labels, ratings, links, aliases, monthlyAvg, dailyAvg});
}

ensureLibraries().then(render);


```