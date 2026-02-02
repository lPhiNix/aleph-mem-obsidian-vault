[[<%*
let monthDate = moment(tp.file.title, 'YYYY-MM-MMMM');
let quarterlyNote = monthDate.format('YYYY-[Q]Q');
tR += quarterlyNote;
%>|]] 