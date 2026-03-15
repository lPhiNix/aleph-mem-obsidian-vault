>[!example]- &nbsp;Other Years
>```dataview
TABLE alias AS Alias
FROM "02 - Ψ - Memorium/yearly"
WHERE file.name != this.file.name
SORT file.name ASC
>```