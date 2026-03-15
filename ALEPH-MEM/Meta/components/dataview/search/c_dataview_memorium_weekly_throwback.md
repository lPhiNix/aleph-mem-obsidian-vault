>[!example]- &nbsp;This Week From Different Years
>```dataview
TABLE alias AS Alias
FROM "02 - Ψ - Memorium/weekly"
WHERE regexreplace(file.name, "^\d{4}-", "") = regexreplace(this.file.name, "^\d{4}-", "")
  AND file.name != this.file.name
SORT file.name ASC
>```