---
cssclasses:
  - native
  - module
  - memorium
tags:
  - benchmark
memorium-day-rating: 5
ordus-priority: "2"
ordus-business: "3"
aliases: Metabind Test
ordus-checklist-input: Metabind Test
memorium-daily-summary: Metabind Test
---

# Benchmark: MetaBind Components

> **Purpose:** Tests all MetaBind interactive widget types in reading mode: **sliders** (progress bars with custom CSS classes), **text inputs**, **rich text editors**, **buttons** (both navigation and action), and **MetaBind-labeled sections**. This is the component layer of the vault's UI.

---

## Progress Bar / Sliders

### Day Rating Slider (1–10 scale, `rating-bar` class)

```meta-bind
INPUT[progressBar(minValue(1), maxValue(10), addLabels(true), class(rating-bar)):memorium-day-rating]
```

### Priority Slider (1–4 scale, `priority-bar` class)

```meta-bind
INPUT[progressBar(minValue(1), maxValue(4), addLabels(true), class(priority-bar)):ordus-priority]
```

### Business Value Slider (1–5 scale, `business-bar` class)

```meta-bind
INPUT[progressBar(minValue(1), maxValue(5), addLabels(true), class(business-bar)):ordus-business]
```

---

## Text Inputs

### Alias Input

```meta-bind
INPUT[text(placeholder('Name your Day!'), class('input-alias')):aliases]
```

### Checklist Input (simulated)

```meta-bind
INPUT[text(placeholder('New item…'), class('checklist-input')):ordus-checklist-input]
```

---

## Rich Text Editor

### Daily Summary Editor

```meta-bind
INPUT[editor(class(text-editor-content)):memorium-daily-summary]
```

---

## Buttons

### Navigation Buttons (with `nav-buttons` class)

```meta-bind-button
id: prev-day
class: nav-buttons
style: primary
label: <- Yesterday
hidden: true
actions:
  - type: open
    link: "[[benchmark-navigation-dummy]]"
    newTab: false
```

```meta-bind-button
id: current-week
class: nav-buttons
style: primary
label: This Week
hidden: true
actions:
  - type: open
    link: "[[benchmark-navigation-dummy]]"
    newTab: false
```

```meta-bind-button
id: current-month
class: nav-buttons
style: primary
label: This Month
hidden: true
actions:
  - type: open
    link: "[[benchmark-navigation-dummy]]"
    newTab: false
```

```meta-bind-button
id: next-day
class: nav-buttons
style: primary
label: Tomorrow ->
hidden: true
actions:
  - type: open
    link: "[[benchmark-navigation-dummy]]"
    newTab: false
```

`BUTTON[prev-day, current-week, current-month, next-day]`

---

### Action Buttons (checklist-style, `primary` style)

```meta-bind-button
id: dummy-add
style: primary
label: + Add
hidden: true
```

```meta-bind-button
id: dummy-remove
style: primary
label: "- Remove Last"
hidden: true
```

```meta-bind-button
id: dummy-remove-all
style: primary
label: Remove All
hidden: true
```

`BUTTON[dummy-add, dummy-remove, dummy-remove-all]`

---

## Headers

# H1 – Title

## H2 – Section

### H3 – Subsection

#### H4 – Minor Heading

##### H5 – Very Small

###### H6 – Minimal

---

## Text Formatting

Plain paragraph text for baseline comparison.

**Bold text**  
*Italic text*  
***Bold + Italic***  
~~Strikethrough~~  
==Highlighted text==  
`inline code`

---

## Lists

### Unordered

- First level item A
- First level item B
  - Second level item B1
  - Second level item B2
    - Third level item

### Ordered

1. First step
2. Second step
3. Third step

---

## Links

- External: [Obsidian Website](https://obsidian.md/)
- Internal: [[Some Note]]
- Internal with alias: [[Some Note|Display Alias]]

---

## Blockquotes

> Simple blockquote.
>
> > Nested blockquote.

---

## Callouts

> [!note]
> Standard **note** callout.

> [!info]
> Informational callout.

> [!warning]
> Warning callout for caution.

> [!danger]
> Danger callout for critical items.

---

## Tables

| Left Align | Center Align | Right Align |
|:-----------|:------------:|------------:|
| Cell A1    | Cell B1      | Cell C1     |
| Cell A2    | **Bold**     | *Italic*    |
| A3         | `code`       | 42          |

---

## Code Block

```javascript
const greet = (name) => `Hello, ${name}!`;
console.log(greet("Obsidian"));
```

---

## Frontmatter (YAML)

```yaml
cssclasses: [native, module, memorium]
memorium-day-rating: "5"
ordus-priority: "2"
ordus-business: "3"
aliases: [Metabind Test]
```

---

## Verification Checklist

- [ ] Rating slider renders with color-coded bar (1–10) and ☆ prefix label
- [ ] Priority slider renders with `priority-bar` styling (1–4)
- [ ] Business slider renders with `business-bar` styling (1–5)
- [ ] Alias text input shows placeholder "Name your Day!" and updates `aliases` in frontmatter
- [ ] Checklist input shows placeholder "New item…"
- [ ] Summary editor renders a rich text editing area
- [ ] Navigation buttons (`<- Yesterday`, `This Week`, `This Month`, `Tomorrow ->`) render and are clickable
- [ ] Action buttons (`+ Add`, `- Remove Last`, `Remove All`) render with primary styling
- [ ] All sliders/inputs are interactive (can change values)
- [ ] Module theming colors (Memorium) tint MetaBind widgets correctly

> **Important:** All MetaBind widgets only render in **reading/preview mode**. Switch to editing mode and they will disappear. This is why the preview mode forcer exists in the template system.
