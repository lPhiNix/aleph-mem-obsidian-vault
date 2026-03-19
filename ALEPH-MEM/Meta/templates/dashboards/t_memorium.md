<%"---"%>

<%*
tR += await tp.file.include("[[c_templater_native_version_attribute]]");
%>
<%*
let links = [
	
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
let classes = [
	"hide-all-frontmatter", "huge-header-title", "center-header-title",
	"hide-inline-title", "module", "memorium"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%"---"%>

# Ψ
# ✦ Memorium ✦
---
> 
> **_MEMORIUM (Ψ)_**
> _memories, past, that which is no longer_
> 
> Lorem ipsum dolor sit amet consectetur adipiscing elit laoreet pulvinar blandit, ridiculus varius lobortis viverra lacinia parturient gravida hac integer, turpis in congue imperdiet tellus dis etiam libero suscipit.
> 

---
<%*
tR += await tp.file.include("[[c_metabind_memorium_dashboard_nav_buttons]]");
%>
---