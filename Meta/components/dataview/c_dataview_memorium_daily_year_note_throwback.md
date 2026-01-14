>[!journal]- &nbsp;This Note From Different Years
>```dataview
TABLE memorium-alias AS Alias, memorium-day-rating AS Rating
FROM "<%*
const PATH = tp.user.router.memorium();
tR += PATH.daily
%>"
WHERE dateformat(memorium-date, "MM-dd") = dateformat(this.file.day, "MM-dd")
  AND file.name != this.file.name
SORT date DESC
>```
