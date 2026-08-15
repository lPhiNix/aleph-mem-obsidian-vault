<%"---"%>

<%*
const prefix = "EXPLORATION-";
const folder = "05 - Ζ - Viventia/01 - Explorations";
const existing = app.vault.getFiles().filter(f =>
  f.path.startsWith(folder + "/") && f.basename.startsWith(prefix)
);
let maxN = 0;
existing.forEach(f => {
  const num = parseInt(f.basename.replace(prefix, ""));
  if (num > maxN) maxN = num;
});
const explorationNum = maxN + 1;
const explorationName = `${prefix}${explorationNum}`;
await tp.file.rename(explorationName);
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
	"NOTE", "VIVENTIA", "exploration",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	`ACTIVITY-${explorationNum}`
];
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
tR += await tp.file.include("[[c_templater_viventia_exploration_state]]");
%>
<%*
tR += await tp.file.include("[[c_templater_viventia_difficulty]]");
%>

<%"---"%>
# ✦ Exploration #<% explorationNum %>

<%*
tR += await tp.file.include("[[c_dataview_viventia_exploration_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_viventia_exploration_alias_input]]");
%>

---
## ✧ State

<%*
tR += await tp.file.include("[[c_dataview_viventia_exploration_state_slider]]");
%>

---
## ✧ Difficulty

<%*
tR += await tp.file.include("[[c_dataview_viventia_difficulty_slider]]");
%>

---
## ✧ Notes

> [!editor]