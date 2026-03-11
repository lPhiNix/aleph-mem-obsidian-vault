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
	"NOTE", "ORDUS", "task",
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
tR += await tp.file.include("[[c_templater_native_favorite_attribute]]");
%>
<%*
let classes = [
	"hide-source-frontmatter", "module", "ordus"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>
<%*
tR += await tp.file.include("[[c_templater_native_alias_attribute]]");
%>

<%*
tR += await tp.file.include("[[c_templater_ordus_task_description]]");
%>


<%"---"%>
# ✦ <% tp.file.title %>
<%*
tR += await tp.file.include("[[c_metabind_memorium_daily_nav_buttons]]");
%>

<%*
tR += await tp.file.include("[[c_metabind_ordus_task_alias_text]]");
%>
---
## ✧ Summary

<%*
tR += await tp.file.include("[[c_matabind_ordus_task_description_editor]]");
%>