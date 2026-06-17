# Voix Vive — Accessibility (a11y) Strategy

> **Status:** DRAFT — Requires UX review and user testing
>
> **Last Updated:** 2026-06-03

## Critical Access Concerns

### Visual
- The platform relies heavily on **color-coding** (chromatic scale → color mapping)
- All color-dependent UI must have alternative text/pattern indicators
- Colorblind modes (Protanopia, Deuteranopia, Tritanopia) are NOT yet implemented
- Pitch detection feedback uses color (red/green) — needs shape/text alternatives

### Auditory
- Core curriculum requires listening to pitch intervals
- Students with hearing impairments need visual pitch representation alternatives
- All synthesized audio should have visual waveform feedback (partially implemented in PitchRoom)

### Motor
- Guitar fretboard interactions should support keyboard navigation
- Touch targets must meet 44×44px minimum (WCAG 2.1)
- Breathing exercises should not require precise timing interactions

## WCAG 2.1 Compliance Checklist

- [ ] All images have descriptive alt text
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus-visible styling on all interactive elements
- [ ] Keyboard-navigable menus and forms
- [ ] Screen reader landmarks (header, nav, main, footer)
- [ ] Reduced motion preference respected (`prefers-reduced-motion`)
- [ ] Colorblind-safe palette option
- [ ] Captions/transcripts for all audio/video content

## Priority Actions

1. Add `prefers-reduced-motion` media query to disable animations
2. Implement colorblind-safe mode toggle in settings
3. Add ARIA labels to all interactive fretboard elements
4. Ensure all pitch feedback includes text + shape indicators (not just color)
5. Add keyboard shortcuts for common navigation paths
