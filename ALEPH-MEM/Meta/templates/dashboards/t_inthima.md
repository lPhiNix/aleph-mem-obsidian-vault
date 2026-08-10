<%"---"%>

<%*
tR += await tp.file.include("[[c_templater_native_version_attribute]]");
%>
<%*
let links = [
	"AM"
];
tR += (await tp.file.include("[[c_templater_native_context_attribute]]")) + links.map(t => "\n- \"[[" + t + "]]\"").join("");
%>
<%*
let classes = [
	"hide-all-frontmatter", "huge-header-title", "center-header-title",
	"hide-inline-title", "module", "inthima"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

<%"---"%>

# Φ
# Inthima
---
## ✦ Module

> 
> **_INTHIMA (Φ)_**
> _me, you, we, love_
> 
> Lorem ipsum dolor sit amet consectetur adipiscing elit laoreet pulvinar blandit, ridiculus varius lobortis viverra lacinia parturient gravida hac integer, turpis in congue imperdiet tellus dis etiam libero suscipit.
> 

## ✦ Contribution
---
<%*
tR += await tp.file.include("[[c_dataview_inthima_dashboard_contribution_heatmap]]");
%>