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
let tags = ["NOTE"];
tR += (await tp.file.include("[[c_templater_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let classes = ["hide-source-frontmatter", "hide-inline-title", "quarterly"];
tR += await tp.file.include("[[c_templater_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
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