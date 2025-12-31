<%"---"%>

<%*
tR += await tp.file.include("[[c_templater_native_frontmatter]]") 
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_daily_frontmatter]]") 
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_daily_journals_frontmatter]]") 
%>

<%"---"%>
# ✦ <% moment(tp.file.title, 'YYYY-MM-DD-dddd').format("dddd, MMMM DD, YYYY") %>
[[<% // create hidden link to weekly note for graph view
moment(tp.file.title, 'YYYY-MM-DD-dddd').format('YYYY-[W]WW') %>|]]
<%*
tR += await tp.file.include("[[c_metabind_memorium_daily_nav_buttons]]") 
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_daily_alias_text]]") 
%>