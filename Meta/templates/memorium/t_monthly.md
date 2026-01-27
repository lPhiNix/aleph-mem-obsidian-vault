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
	"hide-source-frontmatter", "hide-inline-title", "monthly",
	moment(tp.file.title, "YYYY-MM-MMMM").format("MMMM").toLowerCase()
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_monthly_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_monthly_journals_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_monthly_banner_config]]");
%>

<%"---"%>
# *✦ <% moment(tp.file.title, 'YYYY-MM-MMMM').format('MM-MMMM') %>*
[[<%*
let monthDate = moment(tp.file.title, 'YYYY-MM-MMMM');
let quarterlyNote = monthDate.format('YYYY-[Q]Q');
tR += quarterlyNote;
%>|]]
<%*
tR += await tp.file.include("[[c_metabind_memorium_monthly_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_monthly_alias_text]]");
%>

---
### ✧ Summary

<%*
tR += await tp.file.include("[[c_metabind_memorium_monthly_summary_editor]]");
%>

### ✧ Ratings
---

<%*
tR += await tp.file.include("[[c_dataview_memorium_monthly_day_rating_graph]]");
%>

### ✧ Week Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_monthly_week_list]]");
%>