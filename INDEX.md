# VOIX VIVE — Workspace Index

> *"You are an instrument playing an instrument."* — Bertrand Laurence

---

## 🚀 Start Here

```bash
cd bertrand-masterclass
npm run dev        # → localhost:5178
```

---

## 📄 Design Documents (Root Level)

| File | Contents |
|------|----------|
| **`DESIGN.md`** | ⭐ Master Pedagogical Design Document — the full picture |
| `DESIGN_01_foundation.md` | The Student, the Slow Web, the three protocols |
| `DESIGN_02_curriculum.md` | The 12-chapter Chromatic Monomyth curriculum |
| `DESIGN_03_vertiscale_game.md` | ⭐ Vertiscale Engine game spec — deep technical design |
| `DESIGN_04_platform_and_business.md` | Platform phases, tech stack, business model, IP/licensing |

---

## 📁 Project Structure

```
voix-vive/
├── DESIGN.md                    ← ⭐ Start here for context
├── DESIGN_01–04.md              ← Design doc chapters
├── vercel.json                  ← Deployment config
│
└── bertrand-masterclass/        ← THE APP
    ├── CONTEXT.md               ← Dev session quick-start
    ├── ROADMAP.md               ← Phase roadmap + decisions log
    ├── src/
    │   ├── components/          ← All 18 tools + UI components
    │   ├── data/                ← Curriculum, pricing, testimonials
    │   └── pages/               ← OrientationHub + StudioPage
    ├── public/assets/           ← Artwork, audio, profile photo
    └── research/                ← Source batches + raw research docs
```

---

## 🔑 Key Context

- **The app is free.** Revenue comes from coaching tiers, not the textbook.
- **Next build:** `VertiscaleEngine.jsx` — Fret 9 (see `DESIGN_03_vertiscale_game.md`)
- **11/12 tools complete.** Only Fret 9 (Vertiscale) remains.
- **Deployment:** Vercel → `bertrand-masterclass/dist`
- **Git remote:** `github.com/joshua42atkinson/Music`

---

## ⚠️ Pending (run this once)

```bash
bash cleanup.sh   # Removes legacy root files (Cargo, old README, node_modules)
```
