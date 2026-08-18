<%"---"%>

<%*
const projPrefix = "PROJECT-";
const projFolder = "04 - Λ - Devs/01 - Projects";
const projExisting = app.vault.getFiles().filter(f =>
  f.path.startsWith(projFolder + "/") && f.basename.startsWith(projPrefix)
);
let projMax = 0;
projExisting.forEach(f => {
  const num = parseInt(f.basename.replace(projPrefix, ""));
  if (num > projMax) projMax = num;
});
const projNum = projMax + 1;
const projName = `${projPrefix}${projNum}`;
await tp.file.rename(projName);
%>
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
	"NOTE", "DEVS", "project",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	"DEVS"
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "devs", "devs-project"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_devs_project_status]]");
%>
<%*
tR += await tp.file.include("[[c_templater_devs_project_progress]]");
%>

<%"---"%>
# ✦ Project #<% projNum %>

<%*
tR += await tp.file.include("[[c_dataview_devs_project_alias_input]]");
%>

---
## ✧ Status

<%*
tR += await tp.file.include("[[c_dataview_devs_project_status_segmented]]");
%>

---
## ✧ Progress

<%*
tR += await tp.file.include("[[c_dataview_devs_project_progress_slider]]");
%>

---
## ✧ Description

> [!editor]

---
## ✧ Actions

<%*
tR += await tp.file.include("[[c_dataview_devs_project_buttons]]");
%>

---
## ✧ Activity

<%*
tR += await tp.file.include("[[c_dataview_devs_project_binnacles_query]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_devs_project_decisions_query]]");
%>