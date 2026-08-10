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
	"NOTE", "MEMORIUM", "daily",
	moment(tp.file.title, "YYYY-MM-DD").format("dddd").toLowerCase()
];
tR += (await tp.file.include("[[c_templater_native_tags_attribute]]")) + tags.map(t => "\n- "+t).join("");
%>
<%*
let links = [
	moment(tp.file.title, 'YYYY-MM-DD-dddd').format('GGGG-[W]WW'),
	moment(tp.file.title, 'YYYY-MM-DD-dddd').format('YYYY-MM-MMMM')
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_related_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "memorium",
	moment(tp.file.title, "YYYY-MM-DD").format("dddd").toLowerCase()
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
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
tR += await tp.file.include("[[c_metabind_memorium_daily_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_memorium_daily_alias_text]]");
%>
---
## ✧ Rating

<%*
tR += await tp.file.include("[[c_dataview_memorium_day_rating_slider]]");
%>
---
## ✧ Summary

> [!editor]

## ✧ General Overview
---
<%*
tR += await tp.file.include("[[c_dataview_memorium_daily_throwback]]");
%>