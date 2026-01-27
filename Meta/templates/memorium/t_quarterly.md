<%"---"%>

<%*
let version = "1.0.0"
tR += await tp.file.include("[[c_templater_native_version_attribute]]") + version;
%>
<%*
tR += await tp.file.include("[[c_templater_native_id_attribute]]");
%>
<%*
tR += await tp.file.include("[[c_templater_native_creation_attribute]]");
%>
<%*
let tags = ["NOTE"];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_favorite_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "hide-inline-title", "quarterly",
	"quarter-" + moment(tp.file.title, "YYYY-[Q]Q").format("Q")
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_quarterly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_quarterly_journals_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_quarterly_banner_config]]");
%>

<%"---"%>
# *✦ <% moment(tp.file.title, 'YYYY-[Q]Q').format('YYYY [Q]Q') %>*
[[<%*
let quarterDate = moment(tp.file.title, 'YYYY-[Q]Q');
let yearlyNote = quarterDate.format('YYYY');
tR += yearlyNote;
%>|]]
<%*
tR += await tp.file.include("[[c_metabind_memorium_quarterly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_quarterly_alias_text]]");
%>

---
### ✧ Summary

<%*
tR += await tp.file.include("[[c_metabind_memorium_quarterly_summary_editor]]");
%>

### ✧ Ratings
---

<%*
tR += await tp.file.include("[[c_dataview_memorium_quarterly_day_rating_graph]]");
%>

### ✧ Month Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_quarterly_month_list]]");
%>