```dataview
TABLE memorium-alias AS Alias, memorium-day-rating AS Rating
FROM [[<% fileDate = moment(tp.file.title, 'GGGG-[W]WW').format('GGGG-[W]WW') %>]]
AND "02 - Ψ - Memorium/daily"
SORT date(file.name, "yyyy-MM-dd-cccc") ASC
```