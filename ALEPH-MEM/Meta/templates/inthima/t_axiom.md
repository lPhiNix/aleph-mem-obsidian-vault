<%"---"%>

<%*
const prefix = "AXIOM-";
const folder = "00 - Φ - Inthima/01 - Axioms";
const existing = app.vault.getFiles().filter(f =>
  f.path.startsWith(folder + "/") && f.basename.startsWith(prefix)
);
let maxN = 0;
existing.forEach(f => {
  const num = parseInt(f.basename.replace(prefix, ""));
  if (num > maxN) maxN = num;
});
const axiomNum = maxN + 1;
const axiomName = `${prefix}${axiomNum}`;
await tp.file.rename(axiomName);
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
	"NOTE", "INTHIMA", "axiom",
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	"INTHIMA"
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "inthima"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%"---"%>
# ✦ Axiom #<% axiomNum %>

<%*
tR += await tp.file.include("[[c_dataview_inthima_axiom_alias_input]]");
%>

> [!editor]
