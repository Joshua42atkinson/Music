# Voix Vive × Iron Road — Gamification & Storification Meta-Vision

> **ZEN LAW (governing principle for every decision):**  
> What the LEARNER sees: `12 frets. BE → DO → PLAY. That's it.`  
> What the ENGINE does: `Coal/Steam/Archetype/Shadow/Friction` — all invisible.  
> What the TROUBADOUR says: `One right question at the right moment.`  
> **If a learner can't understand it in 5 seconds, it belongs in the engine — not the UI.**

---

> *"The world hadn't changed. The rendering code had changed."*  
> — Joshua Atkinson, Players Handbook, Chapter 2

---

## The Core Insight: Isomorphism IS the Game

The Iron Road doesn't layer gamification onto learning. It **reveals that learning already IS a game** — the mechanics just need to be made visible.

Voix Vive's unique power is the **same isomorphic structure** operating at 4 simultaneous levels:

| Level | Domain | The 12-Unit Map |
|---|---|---|
| **Physical** | Fretboard | 12 fret positions |
| **Psychological** | Somatic states | 12 chromatic intervals → 12 emotional signatures |
| **Cognitive** | Music theory | 12-tone equal temperament |
| **Narrative** | Character arc | 12 stages of the Hero's Journey |

**This means every guitar lesson is simultaneously:** a body lesson, a mind lesson, and a story. The player isn't just learning guitar — they're **re-rendering their relationship with sound, self, and expression.**

---

## The Iron Road → Voix Vive Translation Map

### Economy Layer *(ENGINE-ONLY — learner never sees these names)*

| Trinity (Iron Road) | Voix Vive | Guitar Word | Current State |
|---|---|---|---|
| Coal (attention reserve) | BE check-in result | **Tone** | ⚠️ captured, not used downstream |
| Steam (momentum) | Streak × session depth | **Resonance** | ⚠️ streak tracked, not shown as momentum |
| Track Friction | Extraneous load / anxiety | **Buzz** | ❌ **SOFT SPOT #1** — not implemented |
| XP / Bard Level | Mastery progression | **Voice** | ✅ exists — long horizon metric |
| Traction DC | Dynamic difficulty | Fret difficulty | ⚠️ static, not adaptive |
| Cargo Slots (7±2) | Active concepts in session | **Strings** | ❌ not tracked |

### Narrative Layer

| Iron Road Concept | Theory | Voix Vive Equivalent | Current State |
|---|---|---|---|
| **Locomotive Profile** | Jungian archetype | Not implemented | ❌ **SOFT SPOT #2** |
| **Flow State (Nat 20)** | Peak performance | No "critical success" moment | ❌ **MISSING** |
| **Stall (failure)** | Productive struggle | No failure state narrative | ❌ **MISSING** |
| **Derailment (Nat 1)** | Cognitive overload | No intervention trigger | ❌ **MISSING** |
| **Maintenance Shed** | Reflection/recovery | Binder journal (partial) | ⚠️ Journal exists, not linked to "recovery" |
| **Shadow Status** | Ghost Train / Part X | No equivalent | ❌ **SOFT SPOT #3** |
| **PEARL filter** | RAS / belief lens | Tutorial → Fret selection | ⚠️ Onboarding captures it, not re-applied |

### Character Layer (SDT × Jungian)

| Iron Road Concept | Jungian | SDT Need | Voix Vive Hook |
|---|---|---|---|
| **Intelligence / Sage** | Analysis, planning | Competence | Troubadour Socratic questions |
| **Courage / Hero** | Will, action | Autonomy | Player streaks, adventure sessions |
| **Eloquence / Jester** | Communication, story | Relatedness | RIFF community (coming) |
| **Empathy / Caregiver** | Connection, healing | Relatedness | Somatic check-ins (BE phase) |

**Currently the BE phase captures the Caregiver/Empathy axis but discards the data.** The other 3 axes have no explicit tracking.

### Progression Layer (Bloom's → Gradient Scale)

| Bloom's Level | Iron Road DC | Voix Vive Equivalent | Gap |
|---|---|---|---|
| Remember | DC 5 (Flat track) | Fret 1 lesson slides | OK |
| Understand | DC 10 | Fret 3-4 tools | OK |
| Apply | DC 15 (Moderate grade) | Practice tools + PLING! | OK |
| Analyze | DC 20 | Interval Visualizer | ⚠️ Underused |
| Evaluate | DC 25 (Steep) | Troubadour Socratic | ⚠️ AI-dependent |
| Create | DC 30 (Summit) | RIFF free play + Submission | ⚠️ Not yet scored/celebrated |

---

## The 3 Biggest Soft Spots

### SOFT SPOT #1 — No Friction/Anxiety System
**What Iron Road has:** The Friction Penalty reduces the Logistics Check. Extraneous cognitive load, anxiety, and "The Static" are game mechanics with measurable cost.

**What Voix Vive needs:** The somatic BE check-in data should **modify the session difficulty**. If a student checks in as "anxious/overwhelmed" → lower Traction DC, shorter session target, Troubadour switches to supportive mode. If "focused/energized" → higher DC, challenge mode unlocked.

**Component to build:** `somaticModifier.js` — reads BE check-in → emits a `frictionLevel` (0-3) → injected into Troubadour system prompt + adjusts Player session difficulty.

---

### SOFT SPOT #2 — No Locomotive Profile (Archetype)
**What Iron Road has:** Character creation maps the learner's Jungian archetype (Sage/Hero/Jester/Caregiver) to their mechanical stats. Your archetype determines your natural strengths and weaknesses.

**What Voix Vive needs:** A **one-time 4-question archetype discovery** (during onboarding or first session) that assigns a Bard Archetype. This archetype:
- Colors the Troubadour's language style (Sage = analytical, Jester = playful, Caregiver = gentle)
- Gives a permanent "+2" to the matching protocol (Sage → FHEAL depth, Hero → PLING! speed, Jester → RIFF creativity, Caregiver → SHEARL somatic)
- Displays on the Character Sheet as the player's "Guitar Voice"

**Component to build:** `ArchetypeQuiz.jsx` — 4 questions, Jungian result → stored in user preferences → feeds `systemPromptInjector.js`

---

### SOFT SPOT #3 — No Shadow Status / Ghost Train Detection
**What Iron Road has:** When a player gives negative feedback 3 times in a row, Pete detects the Ghost Train and enters Maintenance Mode. The only way forward is through reflection.

**What Voix Vive needs:** The Troubadour should detect negative emotional spiral patterns:
- 3+ "overwhelmed/frustrated" BE check-ins in a week
- Streak broken after 7+ day run
- Session abandoned before completion 2+ times

**Response:** Troubadour shifts to "Maintenance Mode" — stops asking practice questions, starts asking: *"What does the guitar feel like right now? Not as an instrument — as a mirror."* Unlocks the Kintsugi Journal entry (cracks filled with gold).

**Component to build:** `troubadourMoodDetector.js` → integrated with `useTroubadourAI.js`

---

## The Storification Layer — What's Unique to Voix Vive

Unlike Iron Road (which uses train/industrial metaphor), Voix Vive has a **musical-somatic metaphor** that is even more powerful for adult learners:

```
Iron Road:         Locomotive → Track → Cargo → Station
Voix Vive:         Voice → Interval → Resonance → Expression
```

The **12 frets = 12 chromatic intervals = 12 somatic states** is the isomorphic engine. Each fret isn't just a chord — it's a **character state the player embodies:**

| Fret | Interval | Somatic Signature | Narrative Role |
|---|---|---|---|
| 1 | Minor 2nd | Tension / Dissonance | The Call (Hero's Journey) |
| 2 | Major 2nd | Curiosity / Opening | The Threshold |
| 3 | Minor 3rd | Melancholy / Depth | The Descent |
| 4 | Major 3rd | Brightness / Joy | The Helper |
| 5 | Perfect 4th | Groundedness | The Cave |
| 6 | Tritone | Instability / Crisis | The Ordeal |
| 7 | Perfect 5th | Power / Resolution | The Revelation |
| 8 | Minor 6th | Longing / Distance | The Road Back |
| 9 | Major 6th | Ease / Acceptance | The Resurrection |
| 10 | Minor 7th | Tension/Almost-there | The Elixir |
| 11 | Major 7th | Yearning / Beauty | The Return |
| 12 | Octave | Unity / Completion | The Master |

**This table should be the spine of the Troubadour's Socratic script.** Every fret transition is a narrative event. The player isn't just learning Fret 6 — they're entering the Ordeal, the most unstable interval, the one that requires the most courage to play and hold.

---

## Nemotron's Role in This System

The 120B parameter model is perfectly sized for:

1. **Dynamic Traction DC** — given a student's Coal (fret history) + Steam (streak/session data) + Friction (somatic check-in), calculate the optimal Logistics Check difficulty for today's session. Real-time ZPD calculation.

2. **Archetype-colored Socratic prompts** — Sage student gets analytical follow-ups. Jester gets playful provocations. Caregiver gets reflective depth. Same curriculum, different rendering engine.

3. **Ghost Train detection** — reads 7-day behavioral pattern (check-ins, completions, streak) → determines Shadow Status → adjusts Troubadour mode.

4. **Narrative event recognition** — when a student completes Fret 6 (the Tritone / Ordeal), Nemotron generates a personalized "You have survived the Ordeal" narrative marker that gets stored in their journal. Permanent lore, unique to their voice.

---

## Next Sprint Priority Stack

| Priority | Feature | Iron Road Analog | Impact |
|---|---|---|---|
| **P0** | `somaticModifier.js` — BE check-in → Friction level → session difficulty | Friction Penalty | High |
| **P0** | `ArchetypeQuiz.jsx` — 4-question Jungian type → Bard archetype | Locomotive Profile | High |
| **P1** | `troubadourMoodDetector.js` — Ghost Train detection → Maintenance Mode | Shadow Status | High |
| **P1** | Fret → Somatic signature table in `troubadourPrompt.js` | Narrative mechanics | Medium |
| **P1** | Flow State moment — ★ mastery achievement = Nat 20 celebration | Flow State (Nat 20) | Medium |
| **P2** | Interval-to-emotion visualization in the Maturation Map | Gradient Scale visual | Medium |
| **P2** | Kintsugi Journal — "cracks filled with gold" reflection entry | Maintenance Shed | High |
