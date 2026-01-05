<%"---"%>

<%*
let version = "1.0.0"
tR += await tp.file.include("[[c_templater_version_attribute]]") + version;
%>
<%*
tR += await tp.file.include("[[c_templater_id_attribute]]");
%>
<%*
tR += await tp.file.include("[[c_templater_creation_attribute]]");
%>
<%*
let tags = []
tR += await tp.file.include("[[c_templater_tags_attribute]]") + tags;
%>
<%*
let classes = [am]
tR += await tp.file.include("[[c_templater_tags_attribute]]") + classes;
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