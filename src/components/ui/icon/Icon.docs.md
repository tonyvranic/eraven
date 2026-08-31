# Icon Component
Renders SVG icons from the local `/icons` directory.

## Usage
```jsx
<Icon name="Close" />
<Icon name="ChevronRight" size={16} />
```

---
## Props
| Prop | Type | Default |
|---|---|---|
| name | `Icons` | required |
| size | `16 \| 24` | `24` |
| class | `string` | `undefined` |
---

## Notes
- Icons use `currentColor`
- File names use kebab-case, while the icons prop uses PascalCase. <br> (For example, `close.svg` becomes `Close`.)
- Sizes are controlled via CSS utility classes