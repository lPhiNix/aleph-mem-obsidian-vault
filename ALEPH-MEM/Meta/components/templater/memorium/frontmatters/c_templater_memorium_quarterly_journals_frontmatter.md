journal: quarterly
journal-date: <% moment(tp.file.title, 'YYYY-[Q]Q').startOf('quarter').format("YYYY-MM-DD") %>
journal-start-date: <% moment(tp.file.title, 'YYYY-[Q]Q').startOf('quarter').format("YYYY-MM-DD") %>
journal-end-date: <% moment(tp.file.title, 'YYYY-[Q]Q').endOf('quarter').format("YYYY-MM-DD") %>