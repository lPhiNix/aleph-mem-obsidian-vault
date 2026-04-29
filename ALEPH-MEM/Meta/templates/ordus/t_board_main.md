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
cssclasses:

---

## 💛 WISHES



## 🩶 LONG-TERM



## 🩶 SHORT-TERM



## 🩶 THIS WEEK



## 🩶 NOW



## 🔵 IN PROGRESS (5)



## 🟣 IN REVIEW (10)



## ⛔ LOCKED (5)

**Complete**


## ✅️ CLOSE (10)

**Complete**




%% kanban:settings
```
{"kanban-plugin":"board","show-checkboxes":false,"list-collapse":[false,false,false,false,false,false,false,false,false],"hide-card-count":false,"move-tags":false,"tag-action":"kanban","tag-colors":[],"move-dates":true,"show-relative-date":true,"move-task-metadata":true,"show-add-list":true,"metadata-keys":[{"metadataKey":"alias","label":"","shouldHideLabel":true,"containsMarkdown":true},{"metadataKey":"ordus-priority","label":"Priority","shouldHideLabel":false,"containsMarkdown":true},{"metadataKey":"ordus-business","label":"P","shouldHideLabel":false,"containsMarkdown":true}],"lane-width":260,"link-date-to-daily-note":true,"date-picker-week-start":1,"inline-metadata-position":"metadata-table","archive-date-format":" ","date-colors":[{"distance":1,"unit":"days","direction":"after","color":"rgba(255, 87, 87, 1)","backgroundColor":"rgba(255, 255, 255, 0)","isBefore":true},{"distance":1,"unit":"days","direction":"after","backgroundColor":"rgba(0, 255, 111, 0)","color":"rgba(0, 255, 166, 1)","isAfter":true},{"distance":1,"unit":"days","direction":"after","isToday":true,"backgroundColor":"rgba(255, 200, 0, 0)","color":"rgba(255, 141, 0, 1)"}],"date-format":"YYYY-MM-DD-dddd","time-format":"HH:mm","date-display-format":"DD/MM/YYYY","show-archive-all":true,"max-archive-size":0,"new-note-folder":"07 - Π - Ordus/tasks","new-note-template":"Meta/templates/ordus/t_task.md","prepend-card-text":"[[","append-card-text":"]]"}
```
%%