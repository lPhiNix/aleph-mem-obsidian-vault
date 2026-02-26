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
	"hide-source-frontmatter", "hide-inline-title", "daily",
	moment(tp.file.title, "YYYY-MM-DD").format("dddd").toLowerCase()
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%*
tR += await tp.file.include("[[c_templater_memorium_daily_frontmatter]]");
%>
<%*
tR += await tp.file.include("[[c_templater_memorium_daily_journals_frontmatter]]");
%>

<%"---"%>
# ✦ <% moment(tp.file.title, 'YYYY-MM-DD-dddd').format("dddd, MMMM DD, YYYY") %>
<%*
tR += await tp.file.include("[[c_templater_memorium_daily_hide_weekly_link]]");
tR += await tp.file.include("[[c_templater_memorium_daily_hide_monthly_link]]");
%>
<%*
tR += await tp.file.include("[[c_metabind_memorium_daily_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_daily_alias_text]]");
%>
---
### ✧ Rating

<%*
tR += await tp.file.include("[[c_metabind_memorium_day_rating_slider]]");
%>
---
### ✧ Summary

<%*
tR += await tp.file.include("[[c_metabind_memorium_daily_summary_editor]]");
%>

<%*
tR += await tp.file.include("[[c_dataview_memorium_daily_year_note_throwback]]");
%>