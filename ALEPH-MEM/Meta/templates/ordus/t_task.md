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
	"NOTE", "ORDUS", "task",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	tp.file.title.replace(/-\d+$/, '')
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
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

<%*
tR += await tp.file.include("[[c_templater_ordus_task_priority]]");
%>
<%*
tR += await tp.file.include("[[c_templater_ordus_task_business]]");
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
# ✦ Task #<% tp.file.title.replace(/^.*-/, '') %>

<%*
tR += await tp.file.include("[[c_metabind_ordus_task_alias_text]]");
%>

---
## ✧ Priority

<%*
tR += await tp.file.include("[[c_metabind_ordus_priority_slider]]");
%>

---
## ✧ Business

<%*
tR += await tp.file.include("[[c_metabind_ordus_business_slider]]");
%>

---
## ✧ Summary

> [!editor]

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

---
## ✧ Subtasks
<%*
tR += await tp.file.include("[[c_metabind_ordus_task_subtask_button]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_ordus_task_subtask_list]]");
%>