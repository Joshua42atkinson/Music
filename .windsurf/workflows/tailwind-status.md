---
description: Quick check — how many inline styles remain and what's next
---

# Tailwind Migration Status Check

## Count remaining inline styles

// turbo
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components && for f in *.jsx; do count=$(grep -c "style={" "$f"); if [ "$count" -gt 0 ]; then echo "$f: $count"; fi; done | sort -t: -k2 -nr | head -20
```

// turbo
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components/playbook && for f in *.jsx; do count=$(grep -c "style={" "$f"); if [ "$count" -gt 0 ]; then echo "$f: $count"; fi; done | sort -t: -k2 -nr | head -15
```

## Files with styles objects (easiest wins)

// turbo
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components && grep -l "const styles" *.jsx 2>/dev/null
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components/playbook && grep -l "const styles" *.jsx 2>/dev/null
```

## Total inline styles across all components

// turbo
```bash
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components && grep -c "style={" *.jsx *.jsx 2>/dev/null | awk -F: '{sum+=$2} END {print "Main components:", sum}'
cd /home/joshua/Workflow/Bertrand-Masterclass/apps/companion-app/src/components/playbook && grep -c "style={" *.jsx 2>/dev/null | awk -F: '{sum+=$2} END {print "Playbook components:", sum}'
```
