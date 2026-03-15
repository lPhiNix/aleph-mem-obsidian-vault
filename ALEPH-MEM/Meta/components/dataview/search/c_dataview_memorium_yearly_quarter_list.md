>[!example]- &nbsp;Quarters In This Year
>```dataview
TABLE alias AS Alias
FROM [[<% fileDate = moment(tp.file.title, 'YYYY').format('YYYY') %>]]
AND "02 - Ψ - Memorium/quarterly"
SORT date(file.name, "yyyy-'Q'q") ASC
>```