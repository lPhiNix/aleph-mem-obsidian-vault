```tracker
searchType: frontmatter
searchTarget: memorium-day-rating
datasetName: Day Rating
dateFormat: YYYY-MM-DD
folder: "02 - Ψ - Memorium/daily"
startDate: <% moment(tp.file.title, 'YYYY-[W]WW').startOf('isoWeek').format('YYYY-MM-DD') %>
endDate:   <% moment(tp.file.title, 'YYYY-[W]WW').endOf('isoWeek').format('YYYY-MM-DD') %>
summary:
  template: "{{count() == 0 ? 'No data this week' : 'Avg: ' + average().toFixed(2)}}"
```