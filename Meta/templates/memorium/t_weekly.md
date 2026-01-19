<%"---"%>

<%*
let version = "1.0.0"
tR += await tp.file.include("[[c_templater_version_attribute]]") + version;
%>
<%*
tR += await tp.file.include("[[c_templater_id_attribute]]");
%>
<%*
tR += await tp.file.include("[[c_templater_creation_attribute]]");
%>
<%*
let tags = ["NOTE"];
tR += (await tp.file.include("[[c_templater_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let classes = [
	"hide-source-frontmatter", "hide-inline-title", "weekly",
	"week-" + moment(tp.file.title, "YYYY-[W]WW").format("W")
];
tR += await tp.file.include("[[c_templater_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_weekly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_weekly_journals_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_weekly_banner_config]]");
%>

<%"---"%>
# ✦ <% tp.file.title %>
[[<%*
let weekDate = moment(tp.file.title, 'GGGG-[W]WW').isoWeekday(4);
let monthlyNote = weekDate.format('YYYY-MM-MMMM');
tR += monthlyNote;
%>|]]

<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_alias_text]]");
%>

---
### ✧ Summary

<%*
tR += await tp.file.include("[[c_metabind_memorium_weekly_summary_editor]]");
%>

### ✧ Ratings
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_weekly_day_rating_graph]]");
%>

### ✧ General Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_weekly_day_list]]");
%>