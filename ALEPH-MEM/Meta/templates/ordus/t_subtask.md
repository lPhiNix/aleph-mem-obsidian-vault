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
	"NOTE", "ORDUS", "subtask",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
const child = await tp.user.generate_child_note(tp, {
    parentFolder: "07 - Π - Ordus/02 - Tasks/",
    childFolder: "07 - Π - Ordus/03 - Subtasks",
    includeAncestor: false
});
tR += child.context;
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "ordus"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%"---"%>
# ✦ Subtask #<% child.title.replace(/^.*-/, '') %>

<%*
tR += await tp.file.include("[[c_dataview_ordus_task_alias_text]]");
%>

---
## ✧ Summary

> [!editor]