<%"---"%>

<% tp.file.include("[[c_templater_native_frontmatter]]") %>

<% tp.file.include("[[c_templater_memorium_quarterly_frontmatter]]") %>

<% tp.file.include("[[c_templater_memorium_quarterly_journals_frontmatter]]") %>

<%"---"%>
# ✦ *<% moment(tp.file.title, 'YYYY-[Q]Q').format('YYYY [Q]Q') %>*

<% tp.file.include("[[c_metabind_memorium_quarterly_nav_buttons]]") %>