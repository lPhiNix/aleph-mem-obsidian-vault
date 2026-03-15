journal: weekly
journal-date: <% moment(tp.file.title, 'GGGG-[W]WW').format("YYYY-MM-DD") %>
journal-start-date: <% moment(tp.file.title, 'GGGG-[W]WW').isoWeekday(1).format("YYYY-MM-DD") %>
journal-end-date: <% moment(tp.file.title, 'GGGG-[W]WW').isoWeekday(7).format("YYYY-MM-DD") %>