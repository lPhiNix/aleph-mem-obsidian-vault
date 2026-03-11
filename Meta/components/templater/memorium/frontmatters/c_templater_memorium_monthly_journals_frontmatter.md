journal: monthly
journal-date: <% moment(tp.file.title, 'YYYY-MM-MMMM').startOf('month').format("YYYY-MM-DD") %>
journal-start-date: <% moment(tp.file.title, 'YYYY-MM-MMMM').startOf('month').format("YYYY-MM-DD") %>
journal-end-date: <% moment(tp.file.title, 'YYYY-MM-MMMM').endOf('month').format("YYYY-MM-DD") %>