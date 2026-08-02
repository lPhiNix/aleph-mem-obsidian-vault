---
cssclasses:
  - native
  - module
  - harkaive
tags:
  - benchmark
---

# Benchmark: Harkaive Module

> **Purpose:** Tests the Harkaive module theming (`native` + `module` + `harkaive`). Harkaive (`Ω`) is the legacy module — a media consumption database: books, video games, movies, and TV series. The most external module, furthest from the self. Compare colors with other modules.

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

Subscript: H~2~O  
Superscript: x^2^

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

### Mixed

- Main point
  1. Ordered sub-step one
  2. Ordered sub-step two
- Another main point

---

## Links

- External: [Obsidian Website](https://obsidian.md/)
- Internal: [[Some Note]]
- Internal with alias: [[Some Note|Display Alias]]
- Bare wiki link: [[Another Note]]

---

## Images

External image:

![External placeholder](https://placehold.co/300x150/333/fff?text=Placeholder)

Internal embed:

![[placeholder.png]]

---

## Blockquotes

> Simple blockquote.

> Multi-line blockquote  
> that wraps to another line.
>
> > Nested blockquote.
> > > Deeply nested.

---

## Code Blocks

### No language

```
function hello() {
  return "plain text, no highlighting";
}
```

### With language

```python
def fibonacci(n: int) -> list[int]:
    seq = [0, 1]
    for _ in range(n - 2):
        seq.append(seq[-1] + seq[-2])
    return seq[:n]
```

```javascript
const greet = (name) => `Hello, ${name}!`;
console.log(greet("Obsidian"));
```

```css
.benchmark {
  display: flex;
  gap: 1rem;
  padding: 2rem;
}
```

```bash
for f in *.md; do
  echo "Processing $f"
done
```

---

## Tables

| Left Align | Center Align | Right Align |
|:-----------|:------------:|------------:|
| Cell A1    | Cell B1      | Cell C1     |
| Cell A2    | **Bold**     | *Italic*    |
| A3         | `code`       | 42          |

---

## Tasks

- [ ] Unchecked task item
- [x] Completed task item
- [ ] ~~Cancelled task~~ (strikethrough in task)

---

## Callouts

> [!note]
> Standard **note** callout.

> [!info]
> Informational callout.

> [!tip]
> Tip callout with helpful advice.

> [!warning]
> Warning callout for caution.

> [!danger]
> Danger callout for critical items.

> [!example]
> Example callout for demonstrations.

> [!quote]
> Quote callout for citations.

### Foldable Callout

> [!note]- Click to expand
> This content is hidden until the callout is expanded.

---

## LaTeX Math

Inline: $E = mc^2$

Block:

$$
\int_{0}^{\infty} e^{-x} \, dx = 1
$$

Aligned equations:

$$
\begin{aligned}
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

---

## Mermaid Diagrams

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Path A]
    B -->|No| D[Path B]
    C --> E[End]
    D --> E
```

```mermaid
sequenceDiagram
    participant U as User
    participant S as Server
    participant DB as Database
    U->>S: Request
    S->>DB: Query
    DB-->>S: Result
    S-->>U: Response
```

---

## Tags

#benchmark #harkaive #test

---

## Separators

Text above separator.

---

Text between separators.

---

Text below separator.

---

## Frontmatter (YAML)

```yaml
cssclasses: [native, module, harkaive]
tags: [benchmark]
```

---
## Notes

The `harkaive` class sets `--highlight` to the Harkaive accent color via `am-class-native-module-09-harkaive.css`. Harkaive is the outermost module — furthest from the self, tracking external media consumption: books, video games, movies, and TV series.

Compare with:
- `benchmark-bare` — no styles
- `benchmark-native` — structural base only
- `benchmark-native-module` — module variables without specific color
- `benchmark-module-00-inthima` — the innermost module (opposite end of the spectrum)
- Other `benchmark-module-*` — different accent colors
