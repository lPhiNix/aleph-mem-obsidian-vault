>[!example]- &nbsp;This Note From Different Years
>```dataview
TABLE memorium-alias AS Alias, memorium-day-rating AS Rating
FROM "02 - Ψ - Memorium/daily"
WHERE dateformat(memorium-date, "MM-dd") = dateformat(this.file.day, "MM-dd")
  AND file.name != this.file.name
SORT date(file.name) ASC
>```
