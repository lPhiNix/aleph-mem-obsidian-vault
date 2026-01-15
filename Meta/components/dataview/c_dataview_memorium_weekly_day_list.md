```dataview
TABLE memorium-alias AS Alias, memorium-day-rating AS Rating
FROM [[<% fileDate = moment(tp.file.title).format('YYYY-[W]WW') %>]] WHERE file.name != "<% tp.file.title %>"
```