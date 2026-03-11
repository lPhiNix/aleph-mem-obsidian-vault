<%"---"%>

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
	"NOTE", "MEMORIUM", "yearly"
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_favorite_attribute]]");
%>
<%*
let links = [
	"MEMORIUM"
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "memorium", "yearly"
]
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_yearly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_yearly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ <% tp.file.title %>
<%*
tR += await tp.file.include("[[c_metabind_memorium_yearly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_yearly_alias_text]]");
%>

---
## ✧ Summary

<%*
tR += await tp.file.include("[[c_metabind_memorium_yearly_summary_editor]]");
%>

## ✧ Ratings
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_yearly_day_grid]]");
%>

## ✧ General Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_yearly_quarter_list]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_memorium_yearly_throwback]]");
%>