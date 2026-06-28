# Design Principles Checklist
## Voix Vive E-Learning Module — Principles of Design Discussion

**Student:** Joshua Atkinson
**Course:** EDCI 57300 — Learning Design and Technology Practicum
**Date:** June 2026

---

### Framework

The Voix Vive e-learning module was designed using Robin Williams' **CRAP** principles (Contrast, Repetition, Alignment, Proximity) from *The Non-Designer's Design Book* (2004), supplemented by cognitive load theory (Sweller, 1988) and Mayer's principles of multimedia learning (Mayer, 2009). These principles were selected because the project's core pedagogical thesis is that **visual distraction is the primary barrier to somatic music learning** — the interface must minimize cognitive load so the student's attention can return to their ears, their hands, and the instrument.

The following checklist documents each principle, its specific implementation in Voix Vive, and the pedagogical rationale.

---

### 1. Contrast

| Principle | Implementation | Pedagogical Rationale |
|-----------|---------------|----------------------|
| **Visual hierarchy through value contrast** | The interface uses a dark glassmorphism aesthetic with high-contrast text (white/amber on dark translucent panels). Interactive elements use amber/gold accent colors against muted backgrounds. | Students practicing in dim environments (practice rooms, bedrooms) need readable UI without bright screen glare disrupting their somatic state. |
| **Audio-visual contrast** | The UI is intentionally minimal and quiet, creating contrast with the rich audio feedback (Web Audio API-generated tones, metronome, AI voice). The visual layer is subordinate; the audio layer is dominant. | In somatic pedagogy, the ear must lead. By making the UI visually quiet, the audio feedback becomes the primary information channel, training relative pitch and deep listening. |
| **Phase contrast in BE→DO→PLAY** | Each practice phase (BE/DO/PLAY) has a distinct visual treatment — breathing animation for BE, active tool interface for DO, open free-form for PLAY. | Students need clear phase transitions to maintain the psychological loop. Contrast between phases prevents the "blurring" that occurs when all activities look the same. |

### 2. Repetition

| Principle | Implementation | Pedagogical Rationale |
|-----------|---------------|----------------------|
| **Consistent widget placement** | The Truebadour AI widget is always in the bottom-right corner, always toggleable, from any page in the app. The metronome, ambient music, and AI chat are always accessible from this single consistent location. | Hands-free operation requires spatial memory. If the student must search for controls, they break somatic engagement. Consistent placement builds muscle memory for the UI itself. |
| **BE→DO→PLAY loop repetition** | Every chapter, every practice session, every DAG node follows the same BE→DO→PLAY psychological loop. The structure is identical whether the student is on Chapter 1 or Chapter 12. | Repetition of structure reduces cognitive load over time. As the student progresses, the framework becomes automatic, freeing attention for the content itself. |
| **Consistent navigation patterns** | Swipe gestures for chapter navigation, consistent back/menu button placement, and the same voice command vocabulary ("next," "previous," "play," "stop," "record") throughout the app. | Adult learners with performance anxiety need predictability. Inconsistent navigation creates micro-stressors that compound into practice avoidance. |
| **Bilingual consistency** | All 700 translation keys are mirrored exactly in EN and FR. Layout, spacing, and component behavior are identical across locales. | The French-speaking market is a primary target. Inconsistent bilingual treatment would signal that French is a second-class citizen, undermining trust. |

### 3. Alignment

| Principle | Implementation | Pedagogical Rationale |
|-----------|---------------|----------------------|
| **Vertiscale vertical alignment** | The digital fretboard is oriented vertically (Vertiscale), matching the physical perspective of a player looking down at their guitar neck. The UI aligns with the instrument's geometry, not the screen's geometry. | This is the core isomorphic design decision. When the digital representation aligns with the physical instrument, the student's visual-motor mapping is consistent, reducing the translation cost between screen and guitar. |
| **Single-column content flow** | Curriculum slides use a single-column layout with generous whitespace. No sidebars, no multi-column text, no competing information zones. | Reading while holding a guitar is impossible. Single-column, short-burst content (30 seconds per slide) allows the student to look, absorb, and return to the instrument. |
| **Left-aligned text, center-aligned tools** | Text content is left-aligned for readability. Interactive tools are center-aligned to match the player's midline physical posture. | Left-alignment reduces saccadic eye movement for text. Center-alignment of tools mirrors the physical centerline of the seated guitarist, maintaining spatial congruence. |

### 4. Proximity

| Principle | Implementation | Pedagogical Rationale |
|-----------|---------------|----------------------|
| **Contextual tool grouping** | Each chapter's practice tools are grouped in immediate proximity to the relevant curriculum content. The Breathing Gate appears at the start of every session, not on a separate "tools" page. | Learning transfer requires immediate application. If the tool is far from the concept, the student loses the conceptual context. Proximity enables seamless theory-to-practice transition. |
| **AI widget proximity to content** | The Truebadour AI chat is always visible (bottom-right) but never obstructs content. It is close enough to access without navigation, but distant enough to not distract. | The AI is a scaffold, not the focus. Proximity ensures it's available when needed but doesn't compete with the primary learning content. |
| **Minimal chrome, maximum content area** | Navigation elements collapse automatically. The hamburger menu, voice command bar, and help overlays are proximity-grouped in the top bar and hidden until summoned. | Every pixel of UI chrome is a pixel of cognitive load. By grouping controls and hiding them until needed, the content area dominates the screen, keeping the student's visual field clear. |

---

### Supplementary: Mayer's Multimedia Learning Principles

| Principle | Implementation |
|-----------|---------------|
| **Coherence** | No extraneous images, sounds, or text. The interface contains only pedagogically necessary elements. No decorative animations. |
| **Signaling** | Phase transitions (BE→DO→PLAY) are signaled through color shifts and brief text cues, not complex transitions. |
| **Redundancy** | Audio narration (AI voice) does not duplicate on-screen text. The two channels carry complementary information. |
| **Spatial Contiguity** | Corresponding text and visuals are placed adjacent, not separated by navigation or scrolling. |
| **Personalization** | The Truebadour AI uses conversational, Socratic language ("What does correctness feel like in your jaw today? Over.") rather than formal instruction. |

---

### Interactive Elements Inventory

The rubric requires that the module include interactive elements (voice-over PPT is not sufficient). Voix Vive includes the following interactive elements:

1. **BreathingGate** — Real-time breath pacing with visual animation
2. **PlingTrainer** — Pitch detection and interval training via Web Audio API
3. **GuitarWorkbench** — Interactive fretboard with note position feedback
4. **IntervalVisualizer** — Visual representation of musical intervals
5. **MicrotonalTracker** — Fine pitch deviation measurement
6. **PitchTelemetryMap** — Real-time pitch tracking visualization
7. **MultiKeyHub** — Key signature exploration tool
8. **HumanOctaveLibrary** — Octave recognition exercise
9. **SongwritingCompanion** — Guided creative writing tool
10. **MaturationMap** — Progress visualization and DAG navigation
11. **Vertiscale Engine** — 3-phase ear training game (Flash → Imagine → Reflect)
12. **StructuredPracticeRecorder** — Video recording with timed phase scaffolding

All interactive elements use the Web Audio API, MediaRecorder API, or Web Speech API. None are passive video or slide-only content.
