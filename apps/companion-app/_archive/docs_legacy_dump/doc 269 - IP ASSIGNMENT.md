# 📜 IP Transfer Guide — Giving Voix Vive to Bertrand

> **Situation:** You built it, you own it, Purdue has no claim (practicum deliverable for the client), and you want to give it to Bertrand for free.
>
> **Goal:** Transfer ownership cleanly while protecting your right to reuse your own techniques, tools, and Great Game IP.
>
> **⚠️ DISCLAIMER:** This is practical guidance, not legal advice. Spending $300–$500 on a 1-hour attorney review is recommended.

---

## Checklist — Do This Before or At the Thursday Call (May 22)

- [ ] **Review this document** before the call
- [ ] **Walk Bertrand through the agreement** during the call
- [ ] **Both sign it** — digital signatures (DocuSign, Adobe Sign) or wet ink both work
- [ ] **Each keeps a signed copy** (PDF is fine)
- [ ] **Optional:** Have an IP attorney review it ($300–$500)
- [ ] **Tell Bertrand about trademarks** — if he wants to protect "Voix Vive," ©SHEARL, ©PLING!, ©FHEAL, that's ~$250–$350/mark at USPTO.gov
- [ ] **Update the LICENSE file** in the repo to reflect Bertrand's ownership after signing
- [ ] **Transfer the GitHub repo** to Bertrand's account (or add him as owner) after signing

---

## Quick Reference — What You Need vs. Don't

| Protection | Need It? | Why |
|-----------|----------|-----|
| **Copyright Assignment** | ✅ YES | You own the code by default. Must sign a written transfer or Bertrand has no legal ownership. |
| **Patent** | ❌ NO | $10K–$15K+, takes 2–3 years, nothing novel enough to justify it. |
| **Trademark** | ⚠️ Bertrand's call | "Voix Vive," "SHEARL," "PLING!," "FHEAL" are brand names — ~$250–$350/mark at USPTO.gov. His responsibility. |
| **Copyright Registration** | ❌ Optional | Copyright exists automatically. Registration ($65) only matters for lawsuits. |
| **NDA / Non-Compete** | ❌ NO | You're giving a gift, not competing. |

---

## The Agreement

Copy the section below into a Google Doc or Word file, fill in the date, both sign.

---

# INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT

**Date:** _______________

**Assignor (Developer):** Joshua Atkinson ("Developer")  
**Assignee (Client):** Bertrand Laurence ("Client")

**Project:** Voix Vive / Bertrand Masterclass Platform  
**Repository:** https://github.com/joshua42atkinson/Music.git

---

## 1. ASSIGNMENT OF RIGHTS

Developer hereby irrevocably assigns to Client all right, title, and interest in and to the following (collectively, the "Assigned Work"):

- All source code in the `bertrand-masterclass/` directory, including but not limited to all React components, game engine files, data files, hooks, pages, audio engine, and CSS
- All AI-generated artwork and visual assets in `public/assets/`
- All documentation created for the project (CONTEXT.md, ROADMAP.md, MEETING_PREP.md, USER_EXPERIENCE_MAP.md, and all files in `research/`)
- The `index.html` file and all SEO metadata
- The Vercel deployment configuration (`vercel.json`)
- The curriculum content in `chapterData.js`, `timelessSongSlides.js`, `playbookData.js`, and `adventures/troubadour.js`
- All content in `pricingData.js` and `testimonialData.js`

This assignment includes all copyrights, moral rights (to the extent waivable), and the right to create derivative works.

## 2. EXCLUDED INTELLECTUAL PROPERTY (Retained by Developer)

The following are explicitly **NOT** assigned and remain the sole property of Developer:

- **"The Great Game" framework** and all associated concepts, including but not limited to: Four Channels/Committee, Player/Persona/Architect, Physics of Being, Virtue Topology, N=1 Experiment, Coal/Steam/Traction model
- **General programming techniques, patterns, and know-how** used in creating the Assigned Work (e.g., React component patterns, Web Audio implementations, CSS design system approaches)
- **The AI fine-tuning pipeline** (`training/` directory), including `build_dataset.py`, `finetune.py`, `parse_sources.py`, `quantize_quark.py`, and `train_in_container.sh` — however, Client is granted a perpetual, royalty-free, non-exclusive license to use these scripts and their outputs (including any quantized models) solely in connection with the Voix Vive platform
- **Third-party open-source dependencies** (React, Vite, Framer Motion, Dexie, Lucide, Tailwind CSS, etc.), which remain subject to their respective open-source licenses

## 3. CONSIDERATION

This assignment is made for good and valuable consideration, including the professional relationship between the parties and the educational objectives of the project, the receipt and adequacy of which are hereby acknowledged.

## 4. DEVELOPER PORTFOLIO LICENSE

Client grants Developer a perpetual, non-exclusive, royalty-free right to:
- Display the Assigned Work (including screenshots, recordings, and code excerpts) in Developer's professional portfolio, resume, and case studies
- Describe the project in job applications, academic submissions, and professional contexts
- Use the project as a reference in the Purdue University EDCI 57300 practicum

This license does not include the right to operate a competing instance of the platform or to sublicense Client's proprietary content (pedagogy, testimonials, pricing, curriculum text authored by Client).

## 5. WARRANTIES

Developer represents and warrants that:
- Developer is the sole author of the Assigned Work (excluding third-party open-source components and Client's pedagogical content)
- The Assigned Work does not, to Developer's knowledge, infringe upon any third-party intellectual property rights
- Developer has not previously assigned or encumbered the Assigned Work

## 6. NO ONGOING OBLIGATION

This assignment does not obligate Developer to provide future development, maintenance, bug fixes, or support. Any future work shall be subject to a separate agreement between the parties.

## 7. GOVERNING LAW

This Agreement shall be governed by the laws of the State of Indiana.

---

**ASSIGNOR (Developer)**

Signature: ___________________________  
Name: Joshua Atkinson  
Date: _______________

**ASSIGNEE (Client)**

Signature: ___________________________  
Name: Bertrand Laurence  
Date: _______________

---

## Notes for Bertrand — The © Marks

Bertrand currently uses © on his protocol names (©SHEARL, ©PLING!, ©FHEAL). Important clarification:

- The **©** symbol = **copyright claim** (automatic, protects written descriptions)
- The **™** symbol = **unregistered trademark** (free to use, limited protection)
- The **®** symbol = **registered trademark** (requires USPTO filing, strongest protection)

For his protocol *names*, Bertrand wants **trademark** protection, not copyright. The methods themselves can't be copyrighted — only the written/recorded expressions of them.

**Recommendation:** File trademark applications for "SHEARL," "PLING!," and "FHEAL" at USPTO.gov (~$250–$350/mark, 8–12 months to process).
