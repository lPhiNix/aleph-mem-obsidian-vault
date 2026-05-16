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
	"NOTE", "ORDUS", "task", "subtask",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
const child = await tp.user.create_child_note(tp, {
  parentFolder: "07 - Π - Ordus/tasks/",
  childFolder: "07 - Π - Ordus/subtasks"
});
tR += child.context;
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
tR += await tp.file.include("[[c_templater_native_favorite_attribute]]");
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

<%*
tR += await tp.file.include("[[c_templater_ordus_task_description]]");
%>
<%*
tR += await tp.file.include("[[c_templater_ordus_task_checklist]]");
%>
<%*
tR += await tp.file.include("[[c_templater_ordus_task_checklist_done]]");
%>
<%*
tR += await tp.file.include("[[c_templater_ordus_task_checklist_input]]");
%>

<%"---"%>
# ✦ Subtask #<% child.title.replace(/^.*-/, '') %>

<%*
tR += await tp.file.include("[[c_metabind_ordus_task_alias_text]]");
%>

---
## ✧ Summary

<%*
tR += await tp.file.include("[[c_matabind_ordus_task_description_editor]]");
%>

---
## ✧ Checklist

<%*
tR += await tp.file.include("[[c_dataview_ordus_task_checklist]]");
%>
<%*
tR += await tp.file.include("[[c_metabind_ordus_task_checklist_input]]");
%>
<%*
tR += await tp.file.include("[[c_metabind_ordus_task_checklist_buttons]]");
%>