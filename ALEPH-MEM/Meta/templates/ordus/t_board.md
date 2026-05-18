<%*
tp.hooks.on_all_templates_executed(async () => {
    const leaf = app.workspace.getMostRecentLeaf();
    if (leaf) {
        await leaf.setViewState({
            type: "kanban",
            state: leaf.getViewState().state,
            active: true
        });
    }
});
-%>
---

kanban-plugin: board

<%*
let classes = [
	"hide-source-frontmatter", "module", "ordus", "kanban"
];
tR += await tp.file.include("[[c_templater_native_cssclasses_attribute]]") + classes.map(t => "\n- "+t).join("");
%>

---

## 💛 BACKLOG



## 🩶 TO DO



## 🔵 IN PROGRESS (3)



## 🟣 IN REVIEW (5)


## ⛔ LOCKED (5)

**Complete**


## ✅ DONE

**Complete**




%% kanban:settings
```
{"kanban-plugin":"board","show-checkboxes":false,"list-collapse":[false,false,false,false,false,false,false,false,false],"hide-card-count":false,"move-tags":false,"tag-action":"kanban","tag-colors":[],"move-dates":true,"show-relative-date":true,"move-task-metadata":true,"show-add-list":false,"metadata-keys":[{"metadataKey":"alias","label":"Name","shouldHideLabel":true,"containsMarkdown":true},{"metadataKey":"ordus-priority","label":"Priority","shouldHideLabel":false,"containsMarkdown":true},{"metadataKey":"ordus-business","label":"Business","shouldHideLabel":false,"containsMarkdown":true}],"lane-width":260,"link-date-to-daily-note":false,"date-picker-week-start":1,"inline-metadata-position":"metadata-table","archive-date-format":" ","date-colors":[{"distance":1,"unit":"days","direction":"after","color":"rgba(255, 87, 87, 1)","backgroundColor":"rgba(255, 255, 255, 0)","isBefore":true},{"distance":1,"unit":"days","direction":"after","backgroundColor":"rgba(0, 255, 111, 0)","color":"rgba(0, 255, 166, 1)","isAfter":true},{"distance":1,"unit":"days","direction":"after","isToday":true,"backgroundColor":"rgba(255, 200, 0, 0)","color":"rgba(255, 141, 0, 1)"}],"date-format":"YYYY-MM-DD-dddd","time-format":"HH:mm","date-display-format":"DD/MM/YYYY","show-archive-all":true,"max-archive-size":0,"new-note-folder":"07 - Π - Ordus/02 - Tasks","new-note-template":"Meta/templates/ordus/t_task.md","prepend-card-text":"[[","append-card-text":"]]","auto-create-note":true,"auto-create-note-counter":0,"show-view-as-markdown":false,"show-board-settings":false}
```
%%