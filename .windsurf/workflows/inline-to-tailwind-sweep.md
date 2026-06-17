---
description: Convert inline styles to Tailwind CSS classes across the Voix Vive companion app
---

# Inline-to-Tailwind Migration Sweep

Systematically migrate React components from inline `style={}` objects to Tailwind utility classes.

## 1. Select the next batch
Pick 2–4 components from the backlog. Prioritize:
- Files with `const styles = { ... }` objects (easiest wins)
- High-traffic UI components (`PrimaryNav`, `FeedbackButton`, etc.)
- Files with >20 inline styles

## 2. Read the component
- Scan for `style={...}` usage
- Identify dynamic values (colors that change at runtime, widths based on state/props) — **keep these inline**
- Identify static values (fixed padding, margins, font sizes, borders) — **convert to Tailwind**

## 3. Map to Tailwind
Common mappings:
| CSS | Tailwind |
|---|---|
| `display: 'flex'` | `flex` |
| `flexDirection: 'column'` | `flex-col` |
| `alignItems: 'center'` | `items-center` |
| `justifyContent: 'center'` | `justify-center` |
| `padding: '16px'` | `p-4` |
| `marginBottom: '12px'` | `mb-3` |
| `borderRadius: '8px'` | `rounded-lg` |
| `background: '#050508'` | `bg-cf-void` |
| `color: '#e8edf2'` | `text-[#e8edf2]` |
| `fontSize: '0.85rem'` | `text-[0.85rem]` |
| `fontFamily: "'Cormorant Garamond', serif"` | `font-heading` |
| `gap: '8px'` | `gap-2` |

## 4. Edit with multi_edit
- Replace static `style={...}` blocks with `className="..."`
- Preserve dynamic inline styles alongside Tailwind classes: `className="..." style={{ width: `${pct}%` }}`
- NEVER produce duplicate `style` or `className` attributes on the same element

## 5. Delete the styles object
If the file had `const styles = { ... }` at the bottom, remove it entirely.

## 6. Build + test
// turbo
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass && npm --prefix apps/companion-app run build 2>&1 | tail -8
cd /home/joshua/Workflow/Bertrand-Masterclass && npm --prefix apps/companion-app test -- --run 2>&1 | tail -8
```

## 7. Fix build errors immediately
If build fails, fix before moving on. Common mistakes:
- `bg-none` → `bg-transparent`
- `mb-7.5` → `mb-[1.875rem]`
- `min-h-20` → `min-h-[80px]`
- `scrollbar-none` → inline `style={{ scrollbarWidth: 'none' }}`
- `text-white/85` → `text-white/80`
- Duplicate `style` attributes

## 8. Update the TODO
Mark completed files in the running todo list.

## 9. Repeat
Move to the next batch. Do not stop until all `styles` objects are gone and inline styles are only used for truly dynamic values.
