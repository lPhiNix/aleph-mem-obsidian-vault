>[!example]- &nbsp;Months In This Quarter
>```dataview
TABLE alias AS Alias
FROM [[<% fileDate = moment(tp.file.title, 'YYYY-[Q]Q').format('YYYY-[Q]Q') %>]]
AND "02 - Ψ - Memorium/monthly"
SORT date(file.name, "yyyy-MM-LLLL") ASC
>```