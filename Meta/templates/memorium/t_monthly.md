<%"---"%>

<% tp.file.include("[[c_templater_native_frontmatter]]") %>

<% tp.file.include("[[c_templater_memorium_monthly_frontmatter]]") %>

<% tp.file.include("[[c_templater_memorium_monthly_journals_frontmatter]]") %>

<%"---"%>
# ✦ *<% moment(tp.file.title, 'YYYY-MM-MMMM').format('MM-MMMM') %>*

<% tp.file.include("[[c_metabind_memorium_monthly_nav_buttons]]") %>