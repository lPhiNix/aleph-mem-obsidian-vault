<%"---"%>

Version: "1.0.0"
<%*
tR += await tp.file.include("[[c_templater_native_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_quarterly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_quarterly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ *<% moment(tp.file.title, 'YYYY-[Q]Q').format('YYYY [Q]Q') %>*
<%*
tR += await tp.file.include("[[c_metabind_memorium_quarterly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_quarterly_alias_text]]");
%>