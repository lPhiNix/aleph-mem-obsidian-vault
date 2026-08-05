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
	"NOTE", "MEMORIUM", "quarterly",
	"quarter" + moment(tp.file.title, "YYYY-[Q]Q").format("Q")
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	moment(tp.file.title, 'YYYY-[Q]Q').format('YYYY')
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "italic-header-title",
	"quarterly", "module", "memorium",
	"quarter-" + moment(tp.file.title, "YYYY-[Q]Q").format("Q")
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_quarterly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_quarterly_journals_frontmatter]]");
%>

<%"---"%>
# ✦ <% moment(tp.file.title, 'YYYY-[Q]Q').format('[Quarter ]Q, YYYY') %>
<%*
tR += await tp.file.include("[[c_metabind_memorium_quarterly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_quarterly_alias_text]]");
%>

---
## ✧ Summary

> [!editor]

## ✧ Ratings
---

<%*
tR += await tp.file.include("[[c_dataview_memorium_quarterly_day_rating_graph]]");
%>

## ✧ General Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_quarterly_month_list]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_memorium_quarterly_throwback]]");
%>