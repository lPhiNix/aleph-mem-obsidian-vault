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
 * UTILIDADES
 **********************/
function hexToRgba(hex, alpha = 0.5) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  hex = hex.replace("#","").trim();
  if (hex.length === 3) hex = hex.split("").map(h=>h+h).join("");
  if (hex.length === 8) {
    const [r,g,b,a] = [0,2,4,6].map(i=>parseInt(hex.slice(i,i+2),16));
    return `rgba(${r},${g},${b},${(a/255)*alpha})`;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return `rgba(0,0,0,${alpha})`;
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
  const idx = Math.round(val);
  return hexToRgba(RATING_COLORS[idx] ?? EMPTY_COLOR, alpha);
}

/**********************
 * RANGO TRIMESTRAL
 **********************/
function getQuarterRange(fileName) {
  const m = moment(fileName, "YYYY-[Q]Q");
  return [
    m.clone().startOf("quarter").startOf("isoWeek"),
    m.clone().endOf("quarter").endOf("isoWeek")
  ];
}

/**********************
 * CARGA SEMANAS + DIARIAS
 **********************/
async function loadQuarterWeeks(weeklyPath, dailyPath, start, end) {
  const labels = [];
  const ratings = [];
  const links = [];
  const aliases = [];

  // Todas las notas semanales existentes
  const weeklyNotes = dv.pages(weeklyPath)
    .where(p => p.file.name.match(/^\d{4}-W\d{2}$/))
    .array();

  // Bucket diario por semana
  const dailyBuckets = {};
  dv.pages(dailyPath)
    .where(p => p["memorium-day-rating"] != null && p["memorium-date"])
    .forEach(p => {
      const d = moment(p["memorium-date"].toISODate(), "YYYY-MM-DD");
      if (!d.isBetween(start, end, "day", "[]")) return;
      const w = d.format("GGGG-[W]WW");
      if (!dailyBuckets[w]) dailyBuckets[w] = [];
      dailyBuckets[w].push(p["memorium-day-rating"]);
    });

  // Iterar semanas del trimestre
  let cursor = start.clone();
  while (cursor.isSameOrBefore(end)) {
    const weekKey = cursor.format("GGGG-[W]WW");

    const weeklyNote = weeklyNotes.find(w => w.file.name === weekKey);
    if (weeklyNote) {
      labels.push(weekKey);
      links.push(weeklyNote.file.path);
      aliases.push(weeklyNote.file.aliases?.[0] ?? weekKey);

      const vals = dailyBuckets[weekKey];
      ratings.push(vals && vals.length
        ? vals.reduce((a,b)=>a+b,0) / vals.length
        : null
      );
    }

    cursor.add(1,"week");
  }

  return {labels, ratings, links, aliases};
}

/**********************
 * RENDER CHART
 **********************/
function renderChart({labels, ratings, links, aliases, quarterlyAvg}) {
  const barColors = ratings.map(r => r == null ? EMPTY_COLOR : RATING_COLORS[Math.round(r)] ?? EMPTY_COLOR);
  const pointColors = barColors.map(c => hexToRgba(c,0.5));
  const canvas = dv.el("canvas","",{attr:{height:260}});

  const accentLine  = cssColorWithAlpha("--interactive-accent",0.7);
  const accentSolid = cssColorWithAlpha("--interactive-accent",1);

  // MEDIA ACUMULADA
  const weeklyAvgLine = ratings.map((_, i) => {
    const validSoFar = ratings.slice(0,i+1).filter(v=>v!=null);
    if (!validSoFar.length) return null;
    return validSoFar.reduce((a,b)=>a+b,0)/validSoFar.length;
  });

  const annotations = {
    neutral: {
      type:"line",
      yMin:3,
      yMax:3,
      borderColor:"rgba(255,255,255,0.3)",
      borderDash:[6,6],
      label:{content:"Neutral",enabled:true,position:"end"}
    }
  };

  new Chart(canvas,{
    data:{
      labels,
      datasets:[
        {
          type:"line",
          label:"Progression",
          data:ratings,
          borderColor:accentLine,
          borderWidth:2,
          tension:0.4,
          spanGaps:true,
          pointRadius:5,
          pointHoverRadius:7,
          pointBackgroundColor:pointColors,
          pointBorderColor:accentSolid,
          pointBorderWidth:2
        },
        {
          type:"line",
          label:"Average",
          data: weeklyAvgLine,
          pointStyle:"rectRot",
          borderColor: cssColorWithAlpha("--interactive-accent",0.5,"#8b5cf6"),
          borderWidth:2,
          borderDash:[6,6],
          tension:0,
          spanGaps:true,
          pointRadius:5,
          pointHoverRadius:7,
          pointBackgroundColor: weeklyAvgLine.map(v => colorForValue(v,0.5)),
          pointBorderColor: cssColorWithAlpha("--interactive-accent",1,"#8b5cf6"),
          pointBorderWidth:2
        },
        {
          type:"bar",
          label:"Weekly Average Day Rating",
          data:ratings,
          backgroundColor:barColors,
          borderRadius:6
        }
      ]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{
          labels:{
            generateLabels: chart => {
              const lbls = Chart.defaults.plugins.legend.labels.generateLabels(chart) || [];
              if (!quarterlyAvg) return lbls;
              return lbls.map(lbl =>
                lbl.text === "Weekly Average Day Rating"
                  ? {...lbl, fillStyle: colorForValue(quarterlyAvg), strokeStyle: colorForValue(quarterlyAvg)}
                  : lbl
              );
            }
          }
        },
        annotation:{annotations},
        tooltip:{
          callbacks:{
            label:ctx=>{
              const i = ctx.dataIndex;
              if (ctx.dataset.label === "Average") {
                const v = weeklyAvgLine[i];
                return v==null ? "Average: —" : `Average (to date): ${v.toFixed(2)}`;
              }
              return ratings[i]==null
                ? "No daily entries"
                : `Weekly Avg: ${ratings[i].toFixed(2)}`;
            }
          }
        }
      },
      onClick:(_,elements)=>{
        if(!elements.length) return;
        const i = elements[0].index;
        if(links[i]) app.workspace.openLinkText(links[i],"",true);
      },
      scales:{
        y:{
          min:0,
          max:10,
          ticks:{stepSize:1,color:ctx=>colorForValue(ctx.tick.value)},
          grid:{color:ctx=>colorForValue(ctx.tick.value,0.12),borderDash:[4,4]}
        },
        x:{grid:{display:false}}
      }
    }
  });
}

/**********************
 * MAIN
 **********************/
async function render() {
  const [start,end] = getQuarterRange(dv.current().file.name);

  const weeklyPath = "02 - Ψ - Memorium/weekly";
  const dailyPath  = "02 - Ψ - Memorium/daily";

  const {labels, ratings, links, aliases} =
    await loadQuarterWeeks(weeklyPath, dailyPath, start, end);

  const valid = ratings.filter(r=>r!=null);
  const quarterlyAvg = valid.length
    ? valid.reduce((a,b)=>a+b,0)/valid.length
    : null;

  if (quarterlyAvg != null) {
    dv.paragraph(
      `**Average Rating (Quarter):** <span style="color:${colorForValue(quarterlyAvg)};font-weight:bold;">${quarterlyAvg.toFixed(2)}</span> (${valid.length} weeks)`
    );
  } else {
    dv.paragraph("_No ratings logged this quarter_");
  }

  renderChart({labels, ratings, links, aliases, quarterlyAvg});
}

ensureLibraries().then(render);


```