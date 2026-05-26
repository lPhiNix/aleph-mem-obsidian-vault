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
	"NOTE", "MEMORIUM", "weekly",
	"week" + moment(tp.file.title, "YYYY-[W]WW").format("W")
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "italic-header-title",
	"weekly", "module", "memorium",
	"week-" + moment(tp.file.title, "YYYY-[W]WW").format("W")
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_weekly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_weekly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ <% moment(tp.file.title, 'YYYY-[W]WW').format("[Week ]WW, YYYY") %>
<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_alias_text]]");
%>

---
## ✧ Summary

<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_summary_editor]]");
%>

## ✧ Ratings
---

<%*
tR += await tp.file.include("[[c_dataview_memorium_weekly_day_rating_graph]]");
%>

## ✧ General Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_weekly_day_list]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_memorium_weekly_throwback]]");
%>