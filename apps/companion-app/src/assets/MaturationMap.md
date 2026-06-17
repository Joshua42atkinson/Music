# Instructional Design Document: Voix Vive Academy

## 1. Executive Summary & Problem Statement
Traditional music education often isolates technical theory from the physiological realities of the human body, leading to cognitive overload and chronic tension in vocalists. The Voix Vive Academy addresses this critical gap by integrating music theory with continuous somatic awareness. The purpose of this project is to develop a highly interactive, biofeedback-informed learning environment that guides students through vocal mastery while ensuring foundational physical relaxation.

## 2. Pedagogical Architecture (The "Maturation Map")
The core pedagogical strategy of the Voix Vive Academy is structured around an architecture we term the "Maturation Map."

### 2.1 Isomorphic Pedagogy: The BE → DO → PLAY → PRODUCE Loop
Every learning module (fret) in the system forces the learner through a strictly sequenced instructional loop:
- **BE (Somatic Centering):** The learner anchors their breath and releases physical tension before attempting phonation.
- **DO (Active Imagination & Pling Protocol):** The learner visualizes the pitch internally before physically executing the vocalization.
- **PLAY (Unscripted Fun):** The learner applies the technical skill in an open, improvisational context to build fluency.
- **PRODUCE (Share & Reflect):** The learner articulates their somatic experience and saves the artifact to their learning portfolio.

### 2.2 The 12-Fret Directed Acyclic Graph (DAG)
The curriculum maps the 12 intervals of the chromatic scale onto archetypal stages of learning. Engineered as a Directed Acyclic Graph (DAG), the system algorithmically prevents cognitive overload by enforcing strict prerequisites. A learner cannot advance to a complex technical skill (e.g., Fret 3) until they have successfully cleared the somatic gates (demonstrating reduced tension) of the previous frets.

## 3. Interface & System Design
The application utilizes modern web technologies (React, Supabase, Cloudflare R2) to facilitate this complex pedagogical model.

### 3.1 Somatic Studio Prompter
The `SomaticStudioPrompter` is a core interface that guides the learner through the BE → DO → PLAY loop in real-time. It utilizes:
- **Continuous Biofeedback Recording:** The system captures a continuous video feed of the learner's practice session.
- **Paced Instructional Scaffolding:** The interface provides timed, visual prompts (e.g., 120 seconds for "Somatic Centering", 300 seconds for "Unscripted Fun") ensuring the learner does not rush the physiological integration phase.

### 3.2 Async Video Coaching (Practice Recorder)
To scale expert evaluation without sacrificing the depth of personalized feedback, the system employs an asynchronous assessment pipeline:
- **Seamless Capture & Storage:** Utilizing the `PracticeRecorder` component, learners record their "Produce" phase submissions. These high-fidelity videos are securely uploaded directly to Cloudflare R2 edge buckets via pre-signed URLs, bypassing standard serverless size constraints.
- **Mentorship Evaluation Loop:** Subject Matter Experts (Mentors) access these submissions via a secure dashboard to provide nuanced, rubric-based video feedback.

### 3.3 The AI Truebadour
To provide 24/7 localized support, the system features a Socratic heuristic AI. Rather than providing direct answers that bypass the cognitive struggle necessary for learning, the Truebadour AI reads contextual metadata and prompts the learner with reflective questions designed to deepen their somatic awareness.

## 4. Pedagogical Claims & System Functions Matrix
To formally demonstrate the alignment between our instructional theory and the technical architecture, the following matrix maps the pedagogical *claims* of the Voix Vive Academy against the specific software *functions* built to achieve them.

| Pedagogical Claim | System Function (Software Feature) | How it Works (Mechanism) |
| :--- | :--- | :--- |
| **Claim 1: Prevents Cognitive Overload** | **The 12-Fret DAG & "C Major" Scaffold** | Gates advanced chromatic theory. Forces learners to master beginner modules (C Major) before the UI unlocks complex intervals. |
| **Claim 2: Ensures Somatic Integration** | **SomaticStudioPrompter (BE → DO → PLAY)** | Uses timed UI phases (e.g., 120s "BE" phase) enforcing physical relaxation and biofeedback before allowing pitch production. |
| **Claim 3: Enables Scalable Expert Feedback** | **PracticeRecorder & R2 Edge Buckets** | Captures high-fidelity student video locally and bypasses server limits via direct Cloudflare R2 uploads for asynchronous mentor review. |
| **Claim 4: Fosters Deep Reflection** | **Truebadour Heuristic AI** | Instead of spoon-feeding answers, the AI analyzes session metadata to ask Socratic questions, triggering metacognition. |
| **Claim 5: Establishes a Learner Portfolio** | **The "Produce" Phase & IndexedDB** | Automatically logs video artifacts and written reflections into a persistent local and cloud database, allowing students to track maturation over time. |

### Matrix Analysis
This matrix illustrates that Voix Vive is not merely a repository of instructional videos, but a highly engineered learning system. Every software feature—from the database architecture for video uploads to the specific timing logic of the prompter—exists to satisfy a distinct pedagogical requirement. This alignment guarantees that the technology serves the learning objectives, rather than the learning objectives being constrained by the technology.

## 5. Formative Evaluation & Iterative Design (The Beta Pivot)
The Voix Vive Academy has undergone a significant iterative design pivot based on continuous formative evaluation.

### 5.1 Phase I: Inception & Alpha Prototype
The initial Alpha prototype successfully mapped the entire 12-fret chromatic theory into a massive 211-slide curriculum. While architecturally impressive, early stakeholder reviews revealed a critical flaw: the sheer volume of advanced theory induced massive cognitive overload in novice learners.

### 5.2 Phase II: The Beta Pivot
Following consultations with the primary Subject Matter Expert (Bertrand), it was determined that novice scaffolding must be restricted exclusively to the **C Major scale**. The instructional design was subsequently pivoted for the Beta release:
1. **The Novice Tutorial:** A new onboarding flow was designed to familiarize users with the biofeedback mechanics independent of musical theory.
2. **The "C Major" Scaffold:** The curriculum was modularized to isolate the beginner-friendly C Major components, creating a safe, high-success environment for early learners.
3. **Advanced Curriculum Gating:** The original 211-slide chromatic course was re-architected as an advanced tier, gated behind a "Music Theory and Self Theory" abstract to preserve the content without overwhelming beginners.

## Conclusion
The development of the Voix Vive Academy represents a rigorous application of Learning Design and Technology principles. By anchoring complex musical theory in continuous physiological feedback, formally mapping system functions to pedagogical claims, and iteratively adapting the architecture to mitigate cognitive overload, the product successfully models a highly scalable, yet deeply human, educational intervention.
