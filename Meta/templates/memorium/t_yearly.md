<%"---"%>

<%"Version: 1.0.0"%>
<%*
tR += await tp.file.include("[[c_templater_native_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_yearly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_yearly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ <% tp.file.title %>
<%*
tR += await tp.file.include("[[c_metabind_memorium_yearly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_yearly_alias_text]]");
%>