# Screencast Script — Voix Vive Final Project Walkthrough
## EDCI 57300 Final Complete Project (3-4 minutes)

**Target length:** 3:30–4:00
**Format:** OBS screen recording of live site at voix-vive.com
**Tone:** Professional but conversational — you're showing your work to colleagues

---

### PRE-RECORDING SETUP

- Open browser to `voix-vive.com`
- Close unnecessary tabs
- Have the site loaded and ready on the home/curriculum page
- Test audio levels — you'll be speaking over the site
- Have these pages ready to navigate to quickly:
  1. Home / Curriculum (Chapter 1)
  2. A practice tool (PlingTrainer or BreathingGate)
  3. The Truebadour AI widget
  4. StudioPage (business/pricing)
  5. The DAG progress map

---

### SCRIPT

**[0:00 — INTRO: What the project is]**

> "Hi, I'm Joshua Atkinson, and this is my EDCI 57300 practicum project: Voix Vive, a somatic guitar mentorship platform built for Bertrand Laurence, a master guitar instructor based in Cambridge, Massachusetts and Houlton, Maine. The project is live at voix-vive.com."

> "The core problem Voix Vive solves is this: traditional music education apps — Yousician, SimplyGuitar — trap the student's eyes on falling notes and scrolling tablature. Students learn to play the screen, not the guitar. Voix Vive removes that visual gating and returns the student's attention to their ears, their hands, and the physical resonance of the instrument."

**[0:30 — CURRICULUM: The Living Textbook]**

> *Navigate to Chapter 1 of the curriculum*

> "This is the Living Textbook — a 12-chapter interactive curriculum that maps the Hero's Journey onto the 12 intervals of the Western chromatic scale. Each chapter has original artwork, pedagogical slides grounded in audiation theory, and Pythagorean ratio context. There are 211 slides total, all bilingual in English and French — 700 translation keys per language."

> "The curriculum is structured as a 135-node Directed Acyclic Graph — a DAG — that prevents cognitive overload by enforcing prerequisites. A student can't advance to complex intervals until they've mastered the foundational somatic gates."

**[1:15 — PRACTICE TOOLS: Interactive elements]**

> *Navigate to a practice tool — BreathingGate or PlingTrainer*

> "These are the Troubadour Playbook — 12 interactive somatic practice tools built on the Web Audio API. This is the Breathing Gate, which paces the student's breath before practice begins. Every session starts with BE — somatic centering — then moves to DO — active skill work — then PLAY — free improvisation. This BE-DO-PLAY loop is the core pedagogical structure."

> *Briefly show the PlingTrainer or GuitarWorkbench*

> "The PlingTrainer uses real-time pitch detection to train interval internalization. The GuitarWorkbench is an interactive fretboard that's oriented vertically — we call this 'Vertiscale' — to match the player's physical perspective looking down at their guitar neck."

**[2:00 — AI COACHING: The Truebadour]**

> *Open the Truebadour widget (bottom-right corner)*

> "This is the Truebadour — a Socratic AI coach that runs locally on the student's device. It's constrained by a pedagogical prompt: it never gives direct answers, it asks questions to prompt reflection. It says things like 'What does correctness feel like in your jaw today? Over.' It has a three-tier fallback: Gemini Nano on-device, then cloud Flash, then a fully offline wllama model — so it works with zero internet and zero cloud cost."

**[2:30 — BUSINESS: StudioPage]**

> *Navigate to StudioPage*

> "This is the StudioPage — the business layer. It has service pricing, lesson booking, async video review, and membership tiers. The structured practice recorder lets students submit 15-minute video sessions that Bertrand reviews asynchronously. This is the mentorship monetization model — the content is free, the human attention is premium."

**[3:00 — WHAT WORKED WELL]**

> "What worked well: the rapid prototyping approach was exactly right. Bertrand can't write design specs, but when I put a working prototype in front of him, he gave immediate, authentic feedback. During our SME review, he tested the fretboard and said 'this would make a nice substitute if they don't have their guitar' — that one sentence validated an entire design hypothesis."

> "The automated testing — 224 unit tests and 4 end-to-end specs — was critical. With 217 source files and 57 components, manual testing was impossible. The test suite is what made confident shipping possible."

**[3:30 — CHALLENGES]**

> "The biggest challenge was the Google OAuth scope conflict — the Drive scope blocked all student login for three days. I had to decouple authentication from storage scopes. Another challenge was scope management — both mine and Bertrand's. I had to learn to protect the project from my own ambition: 14 deliverables is impressive, but deeper evaluation with fewer features would have been better."

> "That's Voix Vive — live at voix-vive.com. Thank you."

**[3:45 — END]**

---

### RECORDING NOTES

- Keep it under 4 minutes — the rubric says 3-4 minutes
- Speak naturally — don't read the script verbatim, use it as a guide
- Navigate slowly enough that viewers can see what you're pointing to
- If the AI widget takes a moment to load, that's fine — talk over it
- The screencast for the Week 8 discussion can be the same recording or a slightly longer version (Week 8 allows up to 5 minutes)
