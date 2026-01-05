<%"---"%>

<%*
let version = "1.0.0"
tR += await tp.file.include("[[c_templater_version_attribute]]") + version;
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_weekly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_weekly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ <% tp.file.title %>
[[<% // create hidden link to weekly note for graph view
fileDate = moment(tp.file.title, 'YYYY-[W]WW').format('YYYY-[W]WW') %>|]] 
<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_alias_text]]");
%>