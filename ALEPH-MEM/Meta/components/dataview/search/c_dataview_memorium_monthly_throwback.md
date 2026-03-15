>[!example]- &nbsp;This Month From Different Years
>```dataview
TABLE memorium-alias AS Alias
FROM "02 - Ψ - Memorium/monthly"
WHERE dateformat(memorium-date, "MM") = dateformat(this.memorium-date, "MM")
  AND file.name != this.file.name
SORT file.name ASC
>```