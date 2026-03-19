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
`BUTTON[today, current-week, current-month, current-quarterly, current-year]`
```meta-bind-button
id: today
class: nav-buttons
style: primary
label: Today
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/daily/<% moment().format('YYYY/MM-MMMM/YYYY-MM-DD-dddd') %>]]"
    newTab: false
```
```meta-bind-button
id: current-week 
style: primary
class: nav-buttons
label: This Week
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/weekly/<% moment().isoWeekday(4).format('GGGG/GGGG-[W]WW') %>]]"
    newTab: false
```
```meta-bind-button
id: current-month
style: primary
class: nav-buttons
label: This Month
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/monthly/<% moment().format('YYYY/YYYY-MM-MMMM') %>]]"
    newTab: false
```
```meta-bind-button
id: current-quarterly
style: primary
class: nav-buttons
label: This Quarterly
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/quarterly/<% moment().format('YYYY/YYYY-[Q]Q') %>]]"
    newTab: false
```
```meta-bind-button
id: current-year
style: primary
class: nav-buttons
label: This Year
hidden: true
actions:
  - type: open
    link: "[[02 - Ψ - Memorium/yearly/<% moment().format('YYYY') %>]]"
    newTab: false
```
---