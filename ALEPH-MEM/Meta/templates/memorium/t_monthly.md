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
	"NOTE", "MEMORIUM", "monthly",
	moment(tp.file.title, "YYYY-MM-MMMM").format("MMMM").toLowerCase()
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	moment(tp.file.title, 'YYYY-MM-MMMM').format('YYYY-[Q]Q'),
	moment(tp.file.title, 'YYYY-MM-MMMM').format('YYYY')
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "italic-header-title",
	"monthly", "module", "memorium",
	moment(tp.file.title, "YYYY-MM-MMMM").format("MMMM").toLowerCase()
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_monthly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_monthly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ <% moment(tp.file.title, 'YYYY-MM-MMMM').format('MMMM MM, YYYY') %>
<%*
tR += await tp.file.include("[[c_metabind_memorium_monthly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_monthly_alias_text]]");
%>

---
## ✧ Summary

> [!editor]

## ✧ Ratings
---

<%*
tR += await tp.file.include("[[c_dataview_memorium_monthly_day_rating_graph]]");
%>

## ✧ General Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_monthly_week_list]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_memorium_monthly_throwback]]");
%>