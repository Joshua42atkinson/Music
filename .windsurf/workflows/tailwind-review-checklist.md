---
description: QA checklist after a batch of inline-to-Tailwind conversions
---

# Post-Migration QA Checklist

Run this after every batch of conversions to catch regressions before they compound.

## 1. No dangling styles references
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components
grep -n "styles\." <filename>.jsx
```
Result should be empty. If not, the `styles` object wasn't fully removed.

## 2. No invalid Tailwind classes
```bash
grep -n 'bg-none\|mb-7\.5\|min-h-20\|scrollbar-none\|text-white/85' *.jsx
```
Fix any hits:
- `bg-none` → `bg-transparent`
- `mb-7.5` → `mb-[1.875rem]`
- `min-h-20` → `min-h-[80px]`
- `scrollbar-none` → inline `style={{ scrollbarWidth: 'none' }}`
- `text-white/85` → `text-white/80`

## 3. No corrupted JSX
```bash
grep -n 'style=className\|className=style' *.jsx
grep -n 'style={{ }}' *.jsx
grep -n 'className={{' *.jsx
```
All three should return empty.

## 4. Build passes
// turbo
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass && npm --prefix apps/companion-app run build 2>&1 | tail -8
```
Must show `✓ built` with exit code 0.

## 5. All tests pass
// turbo
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass && npm --prefix apps/companion-app test -- --run 2>&1 | tail -8
```
Must show all test files passed.

## 6. Count remaining offenders
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components
for f in *.jsx; do count=$(grep -c "style={" "$f"); if [ "$count" -gt 0 ]; then echo "$f: $count"; fi; done | sort -t: -k2 -nr | head -10
```
Track the trend — numbers should go down every session.

## 7. Update TODO
Mark the batch as completed in the todo list.

## 8. Log any new edge cases
If you discovered a new mapping or pitfall, add it to the `inline-to-tailwind-sweep.md` workflow so future batches benefit.
