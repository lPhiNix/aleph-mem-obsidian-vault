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
	"NOTE", "DEVS", "postmortem",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
const child = await tp.user.generate_child_note(tp, {
  parentFolder: "04 - Λ - Devs/01 - Projects/",
  suffix: "-PM"
});
tR += child.context;
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "devs", "devs-postmortem"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_devs_postmortem_outcome]]");
%>
<%*
tR += await tp.file.include("[[c_templater_devs_postmortem_content]]");
%>

<%"---"%>
# ✦ Postmortem

<%*
tR += await tp.file.include("[[c_dataview_devs_postmortem_outcome_slider]]");
%>

---
## ✧ Analysis

> [!editor]