# Project Narrative: Reflection and Lessons Learned
## EDCI 57300 Final Complete Project

**Student:** Joshua Atkinson
**Project:** Voix Vive — Somatic Guitar Mentorship Platform
**Date:** June 2026

---

### What Was Learned from Completing the Project

The most fundamental lesson was that rapid prototyping is not just a methodology — it is a communication strategy. My supervisor, Bertrand Laurence, is a musician and teacher who works through demonstration and improvisation. He cannot sit down and write a design specification document, but when you put a working prototype in front of him, he reacts with immediate, authentic, and detailed feedback. During our first SME review session (May 27, 90 minutes, recorded), I walked him through the live site on his device. When he encountered the interactive fretboard, he said: "I think it would make a nice substitute if they don't have their guitar... and then imagine it." That single sentence validated an entire design hypothesis — the tool's purpose is not to replace the physical instrument but to support audiation when the guitar is unavailable. I would not have extracted this insight through an interview or survey. I learned that for SMEs who operate in tacit, embodied knowledge domains, the prototype is the interview.

A second lesson was that local-first architecture is both powerful and humbling. Building an application that runs AI inference entirely in the browser (via wllama for LLM text generation and Kokoro for text-to-speech) guarantees privacy and eliminates cloud costs — critical for a music teacher's business model. But it requires managing WebWorker threads, bundle size optimization, and fallback chains that add significant complexity. I learned that "zero cloud cost" is not free — it is paid for in engineering time and state management complexity. The tradeoff is worth it for this use case, but I learned to be honest about the cost.

Third, I learned that automated testing is not optional for a project of this scope. With 217 source files, 57 React components, and 30+ custom hooks, manual testing became impossible by Week 4. Implementing 224 unit tests and 4 end-to-end Playwright specs was the difference between confidently shipping changes and praying nothing broke. When the E2E tests initially conflicted with Vite's hot-module-reloading scripts, I had to reconfigure the testing pipeline to target a production-preview build — ensuring we test the exact PWA environment students experience. This taught me that test infrastructure itself requires design thinking.

Finally, I learned that the "no AI" fallback is not a degradation — it is the primary mode. Bertrand's students include tech-averse adults ages 30–65. The platform must work fully without AI, and the AI layer must be an optional enhancement, not a dependency. This is now a first-class architectural principle: the app degrades gracefully from cloud AI → on-device AI → no AI, and every state is a valid, complete learning experience.

### Key Challenges and Benefits

**Challenge 1: Google OAuth Scope Conflict.** The `drive.file` scope triggered an `invalid_scope` error that blocked all student login. The solution required decoupling authentication scopes — login uses only `openid/email/profile`, while Drive scope is requested separately when a student initiates a video upload. This took three days to diagnose and resolve, and it taught me that OAuth scope design is an instructional design decision: if auth fails, the learning experience fails.

**Challenge 2: Content Authenticity.** Initial batch-generated Troubadour coaching prompts for Chapters 5–12 were generic — referencing "440 Hz" for every chapter regardless of the actual Pythagorean ratio. I replaced all 77 lines with hand-crafted somatic coaching text using correct interval ratios and Bertrand's protocol language. The SME meeting confirmed this level of specificity matters. This challenge taught me that AI-generated content is a starting point, not a deliverable — SME-grounded hand-crafting is irreplaceable for pedagogical voice.

**Challenge 3: Scope Management.** During the SME meeting, Bertrand and I naturally began brainstorming expansions — astral projection workshops, holotropic breathing integration, Alex Grey art collaborations. I applied a self-imposed constraint: if a feature doesn't map to a chapter, a protocol, or a Hero's Journey stage, it doesn't belong yet. This kept the session productive without introducing scope creep. I learned that the instructional designer's job includes protecting the project from the SME's own enthusiasm.

**Challenge 4: Local AI Performance.** Running a large language model and text-to-speech engine directly in the browser required careful WebWorker management and bundle optimization to prevent UI blocking during student interaction. The 33B parameter model download alone was 800MB. I ultimately implemented a three-tier fallback (Gemini Nano on-device → Gemini Flash cloud → wllama offline) to balance performance, privacy, and accessibility across diverse student hardware.

**Benefit 1: SME Emotional Engagement as Validation.** When Bertrand started quoting Leibniz — "When making music, the soul is involved in computational arithmetic of which it is not aware" — and connecting chapter archetypes to his personal teaching stories, I knew the curriculum structure was working. Kirkpatrick Level 1 (Reaction) was immediately and organically positive. Data will come later (Levels 2–4), but the emotional validation was the signal that mattered most.

**Benefit 2: Full-Stack ID Practice.** This practicum provided experience across the entire ID lifecycle: needs analysis, learner analysis, curriculum writing, Web Audio engineering, prompt engineering, visual systems design, evaluation design, business change management, and deployment. Rarely does a practicum offer this breadth.

**Benefit 3: A Live, Deployed Product.** Unlike many practicum projects that produce a prototype or design document, Voix Vive is a live, production-deployed application at voix-vive.com with real users, real payment infrastructure, and a real business purpose. This is the strongest possible evidence of project goal achievement.

### With Hindsight, What Could Have Been Changed

**1. Earlier pilot testing with real learners.** The original project plan scheduled UX testing in Weeks 4 and 7, but the technical build consumed most of that time. With hindsight, I would have recruited 2–3 pilot students from Bertrand's Passim roster in Week 1 and conducted lightweight usability sessions every two weeks, even with incomplete features. The technical build was ahead of schedule, but the user validation lagged behind. A working prototype with no user feedback is a hypothesis, not a result.

**2. Smaller initial scope with deeper evaluation.** The project delivered 14 major deliverables — an impressive count, but it meant that evaluation depth was sacrificed for breadth. With hindsight, I would have scoped the practicum to deliver 6–8 core deliverables with a full Kirkpatrick evaluation cycle including pre/post measures, rather than 14 deliverables with evaluation infrastructure built but not yet exercised with real student data.

**3. Earlier separation of authentication and storage scopes.** The Google OAuth scope conflict consumed three days that could have been avoided with earlier consultation of the OAuth consent screen documentation. In hindsight, I would have prototyped the auth flow in Week 1 before building dependent features.

**4. More formal documentation of the ID process.** While the status reports captured weekly progress, I did not maintain a formal design decision log that mapped each choice to an ID principle. With hindsight, I would have maintained a running decision matrix linking every feature decision to its pedagogical rationale and ID model component. This would have strengthened the academic framing of the project.

**5. Earlier engagement with the supervisor's business operations.** Bertrand needed to create a Stripe account and generate payment links, and this dependency was identified late. With hindsight, I would have mapped all supervisor-dependent tasks in Week 1 and established a shared checklist with Bertrand to ensure his action items were completed in parallel with my development work.

### ID Skills Improved and Skills Still Needing Work

**Skills Improved:**

- **Needs Analysis and Learner Analysis:** Conducting a 90-minute recorded SME session, transcribing it, and extracting design requirements from a tacit-knowledge practitioner significantly improved my ability to convert qualitative SME input into actionable design specifications.

- **Rapid Prototyping:** The iterative build-review-revise cycle with Bertrand deepened my understanding of how rapid prototyping functions as both a development methodology and a communication tool for non-technical SMEs.

- **Instructional Design Model Application:** Developing and applying ADDIECRAPEYE — a practitioner-created framework that extends Rapid Prototyping with visual design principles (CRAP) and AI integration telemetry (EYE) — gave me practical experience in adapting and extending established ID models to fit project-specific constraints.

- **Evaluation Design:** Adapting Kirkpatrick's Four Levels for somatic pedagogy — mapping each level to specific instruments (FHEAL journals, Vertiscale telemetry, session logs, revenue tracking) — improved my ability to design evaluation plans that are both academically grounded and practically measurable.

- **Media Development and Technical Implementation:** Building 12 Web Audio API-based interactive tools, a local AI coaching system, and a full-stack web application significantly improved my technical implementation skills. This is not traditionally an ID skill, but in the modern LDT landscape, the ability to build functional prototypes is increasingly essential.

**Skills Still Needing Work:**

- **Formative Evaluation with Real Learners:** The evaluation infrastructure is built but not yet exercised with real student data. I have not yet conducted a full pre/post measurement cycle. This is the most significant gap — the project has evaluation design but not evaluation execution.

- **Project Management in Multi-Stakeholder Contexts:** Managing dependencies between my development work and Bertrand's business operations (Stripe setup, student recruitment, pricing decisions) revealed that I need to improve at mapping and tracking external dependencies. I tended to focus on my own task list and under-managed the supervisor's parallel action items.

- **Academic Writing and Citation Discipline:** While the project has strong practical outcomes, the academic framing — connecting decisions to ID literature, maintaining rigorous citation practices — needs strengthening. The ADDIECRAPEYE model is practitioner-developed and needs more formal academic validation through literature comparison.

- **Scope Negotiation:** I successfully prevented scope creep during SME sessions, but I struggled with my own internal scope creep — building 14 deliverables when 8 would have allowed deeper evaluation. I need to develop better discipline in scoping my own ambition.
