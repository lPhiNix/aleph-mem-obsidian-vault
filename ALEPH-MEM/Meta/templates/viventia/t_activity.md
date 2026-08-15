<%"---"%>

<%*
const prefix = "ACTIVITY-";
const folder = "05 - Ζ - Viventia/02 - Activities";
const activeFile = tp.config.active_file;
const fromExploration = activeFile && activeFile.path.includes("05 - Ζ - Viventia/01 - Explorations");
let activityNum;
if (fromExploration) {
  activityNum = parseInt(activeFile.basename.replace("EXPLORATION-", ""));
} else {
  const existing = app.vault.getFiles().filter(f =>
    f.path.startsWith(folder + "/") && f.basename.startsWith(prefix)
  );
  let maxN = 0;
  existing.forEach(f => {
    const num = parseInt(f.basename.replace(prefix, ""));
    if (num > maxN) maxN = num;
  });
  activityNum = maxN + 1;
}
const activityName = `${prefix}${activityNum}`;
await tp.file.rename(activityName);
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
	"NOTE", "VIVENTIA", "activity",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	"VIVENTIA"
];
if (fromExploration) {
  links.push(activeFile.basename);
}
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
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

<%*
tR += await tp.file.include("[[c_templater_viventia_state]]");
%>
<%*
tR += await tp.file.include("[[c_templater_viventia_level]]");
%>

<%"---"%>
# ✦ Activity #<% activityNum %>

<%*
tR += await tp.file.include("[[c_dataview_viventia_activity_alias_input]]");
%>

---
## ✧ State

<%*
tR += await tp.file.include("[[c_dataview_viventia_state_slider]]");
%>

---
## ✧ Level

<%*
tR += await tp.file.include("[[c_dataview_viventia_level_slider]]");
%>

---
## ✧ Description

> [!editor]

---
## ✧ Tracker

<%*
tR += await tp.file.include("[[c_dataview_viventia_activity_heatmap]]");
%>

---
## ✧ Actions

<%*
tR += await tp.file.include("[[c_dataview_viventia_activity_buttons]]");
%>

---
## ✧ Activity

<%*
tR += await tp.file.include("[[c_dataview_viventia_activity_sessions_query]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_viventia_activity_analysis_query]]");
%>