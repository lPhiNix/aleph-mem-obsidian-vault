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
	"NOTE", "VIVENTIA", "analysis",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
const child = await tp.user.generate_child_note(tp, {
  parentFolder: "05 - Ζ - Viventia/02 - Activities/",
  childFolder: "05 - Ζ - Viventia/04 - Analysis",
  separator: "-A",
  includeAncestor: false
});
tR += child.context;
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "viventia"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%"---"%>
# ✦ Analysis #<% child.title.replace(/^.*-A/, '') %>

<%*
tR += await tp.file.include("[[c_dataview_viventia_analysis_alias_input]]");
%>

---
## ✧ Analysis

> [!editor]