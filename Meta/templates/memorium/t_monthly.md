<%"---"%>

<%*
tR += await tp.file.include("[[c_templater_native_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_monthly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_monthly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ *<% moment(tp.file.title, 'YYYY-MM-MMMM').format('MM-MMMM') %>*
<%*
tR += await tp.file.include("[[c_metabind_memorium_monthly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_monthly_alias_text]]");
%>