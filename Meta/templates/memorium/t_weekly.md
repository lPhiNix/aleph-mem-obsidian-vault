<%"---"%>

<% tp.file.include("[[c_templater_native_frontmatter]]") %>

<% tp.file.include("[[c_templater_memorium_weekly_frontmatter]]") %>

<% tp.file.include("[[c_templater_memorium_weekly_journals_frontmatter]]") %>

<%"---"%>
# ✦ <% tp.file.title %>
[[<% // create hidden link to weekly note for graph view
fileDate = moment(tp.file.title, 'YYYY-[W]WW').format('YYYY-[W]WW') %>|]] 

<% tp.file.include("[[c_metabind_memorium_weekly_nav_buttons]]") %>