```dataviewjs

if (typeof Chart === "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => renderChart();
    document.head.appendChild(script);
} else {
    renderChart();
}

function hexToRgba(hex, alpha = 0.5) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 6) {
        const r = parseInt(hex.slice(0,2),16);
        const g = parseInt(hex.slice(2,4),16);
        const b = parseInt(hex.slice(4,6),16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    return hex; // fallback
}

function renderChart() {

    const weekMoment = moment(dv.current().file.name, "YYYY-[W]WW");
    const startOfWeek = weekMoment.clone().startOf("isoWeek");
    const endOfWeek   = weekMoment.clone().endOf("isoWeek");

    const labels = [];
    for (let i = 0; i < 7; i++) {
        const day = startOfWeek.clone().add(i, "days");
        labels.push(day.format("ddd, D MMM")); // Día de la semana + fecha
    }

    const ratings = [null, null, null, null, null, null, null];
    const links   = [null, null, null, null, null, null, null];
    const aliases = [null, null, null, null, null, null, null];

    const pages = dv.pages('"02 - Ψ - Memorium/daily"')
        .filter(p => p["memorium-day-rating"] != null && p["memorium-date"])
        .forEach(p => {
            const d = moment(p["memorium-date"].toISODate(), "YYYY-MM-DD");
            if (!d.isBetween(startOfWeek, endOfWeek, "day", "[]")) return;

            const index = d.isoWeekday() - 1;

            ratings[index] = p["memorium-day-rating"];
            links[index]   = p.file.path;
            aliases[index] = p["memorium-alias"]; 
        });

    const barColors = ratings.map(r => {
      if (r == null) return "#d1d5db"; 
      if (r === 1) return "#707070ff";    
      if (r === 2) return "#f87171";    
      if (r === 3 || r === 4) return "#fbbf24";    
      if (r === 5) return "#34d399";
      if (r === 6) return "#3b82f6";   
      if (r === 7 || r === 8) return "#d047efff"; 
      if (r === 9 || r === 10) return "#d6b8c7ff";
      return "#d1d5db";              
    });
    
    const pointBackgroundColors = barColors.map(c => hexToRgba(c, 0.5));

    const canvas = dv.el("canvas", "", { attr: { height: 200 } });

    new Chart(canvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Progression",
              data: ratings,
              type: "line",
              borderColor: "#8b5cf6",
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: pointBackgroundColors,
              pointBorderColor: "#8b5cf6",         
              pointBorderWidth: 2,
              pointRadius: 6,                       
              spanGaps: true
            },
            {
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
                        const idx = ctx.dataIndex;
                        if (ratings[idx] != null) {
                          const lines = [`Day Rating: ${ratings[idx]}`];
                          // Siempre mostramos Note, usando "Unnamed" si no hay alias
                          lines.push(`Note: ${aliases[idx] ? aliases[idx] : "Unnamed"}`);
                          return lines;
                        } else {
                          return ["No entry"];
                        }
                      }
                    }
                }
            },
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    if (links[idx]) {
                        app.workspace.openLinkText(links[idx], "", false);
                    }
                }
            },
            scales: {
              y: {
                  min: 0,
                  max: 10,
                  ticks: {
                      stepSize: 1
                  },
                  grid: {
                      color: "rgba(56, 56, 56, 0.5)", 
                      lineWidth: 1,
                      drawTicks: true,
                      drawBorder: true,
                      borderDash: [3, 3] 
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