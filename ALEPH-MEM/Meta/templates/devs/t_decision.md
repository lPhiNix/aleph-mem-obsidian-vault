<%"---"%>

<%*
tR += await tp.file.include("[[c_templater_native_preview_mode_forcer]]");
%>
<%*
tR += await tp.file.include("[[c_templater_native_version_attribute]]");
%>
<%*
tR += await tp.file.include("[[c_templater_native_key_attribute]]");
%>
<%*
tR += await tp.file.include("[[c_templater_native_creation_attribute]]");
%>
<%*
let tags = [
	"NOTE", "DEVS", "project", "decision",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
const child = await tp.user.create_child_note(tp, {
  parentFolder: "04 - Λ - Devs/01 - Projects/",
  childFolder: "04 - Λ - Devs/03 - Decisions",
  separator: "-D",
  includeBoard: false
});
tR += child.context;
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "devs", "devs-decision"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_devs_decision_impact]]");
%>
<%*
tR += await tp.file.include("[[c_templater_devs_decision_content]]");
%>

<%"---"%>
# ✦ Decision #<% child.title.replace(/^.*-D/, '') %>

<%*
tR += await tp.file.include("[[c_metabind_devs_decision_alias_text]]");
%>

---
## ✧ Impact

<%*
tR += await tp.file.include("[[c_metabind_devs_decision_impact_slider]]");
%>

---
## ✧ Decision

<%*
tR += await tp.file.include("[[c_metabind_devs_decision_content_editor]]");
%>
