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
	"NOTE", "DEVS", "binnacle",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
const child = await tp.user.generate_child_note(tp, {
  parentFolder: "04 - Λ - Devs/01 - Projects/",
  childFolder: "04 - Λ - Devs/02 - Binnacles",
  separator: "-B",
  includeAncestor: false
});
tR += child.context;
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "devs", "devs-binnacle"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_devs_binnacle_status]]");
%>

<%"---"%>
# ✦ Binnacle #<% child.title.replace(/^.*-B/, '') %>

<%*
tR += await tp.file.include("[[c_dataview_devs_binnacle_alias_input]]");
%>

---
## ✧ Status

<%*
tR += await tp.file.include("[[c_dataview_devs_binnacle_status_segmented]]");
%>

---
## ✧ Summary

> [!editor]
