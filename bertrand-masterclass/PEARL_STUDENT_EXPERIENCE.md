---
description: Student POV — what it feels like to use Voix Vive today vs tomorrow
---

# PEARL — Student Experience

## CURRENT STATE (voix-vive.com, May 2026)

### Student Journey: First Session

**Minute 0 — Landing**
Student opens voix-vive.com. Sees warm, dark interface. Guitar neck scrolls vertically like a sacred scroll. 12 frets glow. They tap Fret 1.

**Minute 1 — The Song (/song)**
SlideViewer opens. Text appears: "©SHEARL — Before you touch the guitar, breathe." Student reads. Swipes to next slide. More text. Maybe an image. They swipe through 8-12 slides. This is the "Class" pillar.

**Minute 5 — The Guitar (/guitar)**
Student taps the workbench. BreathingGate opens — a guided breathing animation. They breathe for 60 seconds. Or PracticeTimer — they play for 15 minutes. Or PitchRoom — they hum into the mic and see pitch detected. This is the "Guitar" pillar.

**Minute 20 — The Player (/player)**
Student opens the Player Portal. Watches a Bertrand video: "The Breath Before the Note" (4:32). Then opens the recorder. Records themselves playing. Saves it. This is the "Workbook" pillar (recording as reflection).

**Minute 30 — Playbook (/playbook)**
Student checks their Character Sheet. XP bar. Streak count. 2/12 frets "completed" (traction >= 60%). Quest Log shows Fret 1 as complete, Fret 2 as active, rest locked. Journal shows 1 entry.

**End of session.** Student has: read slides, used a tool, recorded practice, seen progress.

---

### What Works (Mechanical Mode Assessment)

| Feature | Status | Hands-Free? |
|---------|--------|-------------|
| Slide reading | ✅ Working | ❌ Must tap/swipe |
| Breathing Gate | ✅ Working | ❌ Must open manually |
| Practice Timer | ✅ Working | ❌ Must start/stop |
| Pitch Room | ✅ Working | ❌ Must hum + watch screen |
| Video library | ✅ Working | ❌ Must tap to play |
| Audio recorder | ✅ Working | ❌ Must tap to record |
| Quest progress | ✅ Working | ✅ Passive tracking |
| Journal | ✅ Working | ❌ Must type |
| Fretboard explorer | ✅ Working | ❌ Must tap |
| **Overall hands-free** | **❌ No** | Student must use eyes + fingers |

### What's Missing for "Hands-Free Mechanical Mode"

1. **Audio lesson player** — reads slides aloud, auto-advances
2. **Voice navigation** — "Next slide", "Go back", "Open timer"
3. **Practice mode** — timer starts automatically when audio detected
4. **Auto-complete** — detects practice duration, marks node done
5. **No-AI fallback** — all of above works WITHOUT any AI model

### What's Missing for "Troubadour AI Mode"

1. **buildSystemPrompt() tested** — exists, not verified with real AI
2. **Voice streaming** — AudioStreamingService exists, not wired to DAG
3. **Real Bertrand clips** — curated video library exists, not integrated into AI responses
4. **Net Protocol** — "Over.", "Ready", "Copy" — not enforced in UI
5. **Phase-aware responses** — AI doesn't know if student is in BE, DO, or PLAY

---

### THE GAP

**Mechanical mode is 70% built.** The tools exist. The navigation exists. What's missing is:
- Audio narration of slides (can use browser TTS, no AI needed)
- Voice commands (can use Web Speech API, no AI needed)
- Auto-mark-complete based on time spent (pure JavaScript)

**Troubadour AI mode is 20% built.** StepAudio R1.1 runs locally. The prompt builder exists. But:
- Web app doesn't connect to StepAudio yet
- Voice streaming not integrated
- No student has ever spoken to the AI through Voix Vive

---

## THE STUDENT POV: DREAM STATE

**"I open the app. A voice says: 'Welcome back. You were working on the minor third. Ready to imagine it?' I say 'Yes.' The app plays a tone. I close my eyes. I hear the interval. I hum it back. The app says 'Beautiful. Now find it on the D string.' I play. The app hears. 'Yes. That is the minor third. Over.' I say 'Next.' We move to DO phase. No screen needed. Just voice and guitar."**

**That's the goal.** We are not close yet.

---

## HONEST DISTANCE TO GOAL

| Milestone | Distance |
|-----------|----------|
| **Mechanical hands-free** (audio slides + voice nav + auto-complete) | **2-3 days of focused work** |
| **AI text chat** (student types, AI responds with DAG context) | **1-2 days** (wire useLMStudio to StepAudio) |
| **AI voice mode** (student speaks, AI speaks back, no screen) | **2-3 weeks** (voice streaming, STT, TTS, latency) |
| **Full Troubadour experience** (Net Protocol, emotional awareness, adaptive pacing) | **2-3 months** |

---

## RECOMMENDED FOCUS

**This week: Mechanical Hands-Free**
1. Add audio narration to SlideViewer (browser TTS)
2. Add Web Speech API voice commands
3. Auto-mark nodes complete after time threshold
4. Wire BEWorkbook into Playbook as new tab

**Next week: AI Text Chat**
1. Test buildSystemPrompt() with StepAudio R1.1
2. Add chat interface to AmbientPlayer
3. Verify DAG context injection works

**This month: AI Voice**
1. Wire AudioStreamingService to StepAudio
2. Test latency and quality
3. Build Net Protocol UI

**This quarter: Full Experience**
1. Adaptive pacing
2. Emotional paralinguistics
3. Bertrand clip injection
4. Mentor dashboard with AI insights
