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
let tags = ["NOTE"]
tR += (await tp.file.include("[[c_templater_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let classes = ["hide-source-frontmatter", "hide-inline-title", "yearly"]
tR += await tp.file.include("[[c_templater_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_yearly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_yearly_journals_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_yearly_banner_config]]");
%>

<%"---"%>
# *✦ <% tp.file.title %>*
<%*
tR += await tp.file.include("[[c_metabind_memorium_yearly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_yearly_alias_text]]");
%>