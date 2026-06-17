---
title: 06_rift_page_design
status: archive
tags: []
date: 2026-06-14
---
# RIFT Page Design Specification for Voix Vive

## 1. Purpose Statement
RIFT is a creative community hub where guitarists spontaneously share, remix, and build upon musical ideas through short-form audio/video posts and real-time jam sessions with AI-assisted feedback, embodying the "octave as harmony" philosophy.

## 2. PEARL Header for `/rift` Route
```markdown
# RIFT  
*Where individual riffs become collective harmony*

**Perspective**: Celebrates improvisation as oral tradition—each user contribution is a node in an evolving global musical tapestry, reflecting Bertrand's "octave of all people" concept through unstructured co-creation.  
**Engineering**: Implements client-side media buffering (10-sec audio rollback), WebRTC-inspired low-latency chat via Supabase Realtime, and optimistic UI updates for instant attachment previews without server roundtrips. Uses IndexedDB for offline-capable draft saving.  
**Aesthetic**: Dark slate base (`#0f172a`) with Troubadour adventure accents—emerald (`#10b981`) for user-generated content, warm amber (`#d4a855`) for AI interactions. Micro-interactions: Framer Motion `scale` on post cards, `pulse` on recording indicators, and `fadeUp` on chat bubbles. Typography: JetBrains Mono for code-like input (chat/composer), Cormorant Garamond serif for narrative AI feedback.  
**Research**: Grounded in ethnomusicological studies of jam session dynamics (Berliner, 1994) and somatic pedagogy—encourages breath awareness via visual recording indicators but prioritizes instrumental play over vocal correction here versus academy's structured lessons.
```

## 3. Feature List: What Belongs in RIFT
Consolidated from existing routes:
- **Troubadour Guitar Widget** (creative/jam core): Live playing space with AI encouragement and instant sharing  
- **Human Octave Library**: Community feed of 60-second max audio/video riffs (previously standalone component)  
- **RiftChat**: Real-time text/voice chat for post discussions and live jam feedback (extracted from TroubadourWidget)  
- **Duet/Stitch System**: Response recording that plays alongside original posts (new)  
- **Weekly Challenges**: Themed prompts (e.g., "Play a blues riff in Mixolydian") with auto-tagging  

*Excluded from RIFT*:  
- Structured practice (AdventurePlayer → **Practice** destination)  
- Linear lessons/songs (Song/Troubadour Binder → **Academy** destination)  
- Progress tracking/resume systems (belongs in Practice/Academy)

## 4. Troubadour Guitar Widget Spec
**What it does**:  
- **Live Jam Mode**: User plays freely; system provides non-judgmental AI feedback focused on *expression* ("Love that slide into the 3rd!", "Try doubling that rhythm") via RiftChat stream—no pitch gates or scoring.  
- **Instant Share**: Captures last 10 seconds of buffered audio (via MediaRecorder API) with one click, prepopulating a new Human Octave post.  
- **AI Backing Jam**: Toggleable simple backing track (blues/rock/flamenco styles) that adapts to user's detected key/tempo for call-and-response play.  

**What it looks like** (`src/components/rift/TroubadourGuitar.jsx`):  
```jsx
<div className="space-y-4">
  {/* Live Visualizer */}
  <div className="h-24 bg-gray-800/50 rounded-xl relative overflow-hidden">
    <canvas id="riff-visualizer" className="w-full h-full" />
  </div>
  
  {/* Controls */}
  <div className="flex items-center gap-3">
    {/* AI Listening Toggle */}
    <button 
      onClick={toggleAIListening}
      className={`p-2 rounded-lg transition-colors ${aiListening ? 'bg-emerald-500/20' : 'bg-gray-600/30'}`}
    >
      <Mic className={`${aiListening ? 'text-emerald-400 animate-pulse' : 'text-gray-400'} h-5 w-5`} />
      <span className="ml-2 text-xs">{aiListening ? 'Listening...' : 'AI Jam Mode'}</span>
    </button>
    
    {/* Share Buffer */}
    <button 
      onClick={shareBuffer}
      disabled={!bufferAvailable}
      className={`flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg p-3 transition-colors ${!bufferAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      Share Riff
    </button>
    
    {/* Backing Track */}
    <button 
      onClick={toggleBacking}
      className={`p-2 rounded-lg transition-colors ${backingActive ? 'bg-amber-500/20' : 'bg-gray-600/30'}`}
    >
      <Play className={`${backingActive ? 'text-amber-400' : 'text-gray-400'} h-5 w-5`} />
    </button>
  </div>
  
  {/* Settings */}
  <button onClick={openSettings} className="text-xs text-gray-400 hover:text-white">
    ⚙️ Backing Style: {currentStyle}
  </button>
</div>
```
*Styling notes*: Uses Tailwind CSS (implied by PEARL layout principles). Visualizer renders via Web Audio API in `useEffect`. Buffer available when >2 seconds of audio captured.

## 5. RIFT vs. Player (Practice) vs. Song (Lesson)
| Dimension          | RIFT                          | Player (AdventurePlayer)       | Song (Academy Lessons)         |
|--------------------|-------------------------------|--------------------------------|--------------------------------|
| **Goal**           | Spontaneous expression        | Skill mastery via progression  | Structured repertoire learning |
| **Feedback**       | AI encouragement ("Vibe check!") | Pitch-gated correctness gates  | Instructor-style correction    |
| **Structure**      | Open-ended, no scores         | Narrative-act progression      | Linear lesson chapters         |
| **Time Horizon**   | Immediate sharing (<60s posts)| Session-based (5-20 min)       | Course-based (weeks)           |
| **Social Layer**   | Core (duets, comments, feed)  | Solo practice                  | Optional peer review           |

## 6. RIFT as Community Hub: Social/Sharing Features
- **Human Octave Feed**: Infinite scroll of posts (max 60s audio/video) with:  
  - *Duet/Stitch*: Record response that plays alongside original (split-screen for video, sequential for audio)  
  - *AI Remix Suggestions*: Post-analysis suggests additions ("Add a bass line here?")  
  - *Weekly Challenges*: Auto-tagged posts; top 3 featured weekly with Bertrand feedback  
- **RiftChat Integration**:  
  - Each post has persistent chat thread for voice/text discussion (moderated by AI for constructive tone)  
  - Live jam sessions spawn temporary chat rooms visible in feed ("Join Alex's blues jam →")  
- **Reputation System**:  
  - "Harmony Points" for receiving duets/comments (visible on profile)  
  - No follower counts—focus on musical interaction metrics  

## 7. RiftChat Component Location
**Extracted to**: `src/components/rift/RiftChat.jsx`  
*(Moved from `troubadour/` to reflect its role as a core RIFT feature, not TroubadourWidget-specific)*  

**Usage in RIFT Page**:  
- **Live Jam View**: Full-height chat interface at bottom of Troubadour Guitar widget (for real-time feedback during play)  
- **Feed View**: Collapsible chat thread below each Human Octave post (expands on click; shows last 2 messages by default)  

*Key modifications from original*:  
- Added `postId` prop to scope chats to specific feed items  
- Removed `traction/bardLevel/currentFret/currentPhase` props (irrelevant for freeform jam)  
- Enhanced attachment handling: video previews now show thumbnail scrubber on hover  

## 8. Navigation Between 5 Destinations
**Global Nav Pattern**: Persistent bottom tab bar (mobile) / left sidebar (desktop) with:  
1. **Home** (`/`): Hero + quick access to weekly RIFT challenge  
2. **Academy** (`/academy`): Troubadour Binder (structured lessons/curriculum)  
3. **Practice** (`/practice`): Adventure Player (narrative gamified practice)  
4. **RIFT** (`/rift`): Creative jam + Human Octave feed *(5th destination)*  
5. **Profile** (`/profile`): Settings, harmony points, activity history  

*RIFT-specific internal navigation*:  
- Within `/rift`: Two-tab interface (mobile: bottom nav; desktop: pill tabs below header)  
  - **🎸 Jam**: Troubadour Guitar widget + live RiftChat  
  - **📢 Feed**: Human Octave library with infinite scroll, filter by challenge/theme  

*Example route structure*:  
```
/ (Home)
/academy (Troubadour Binder)
/practice (AdventurePlayer)
/rift/jam    ← Default RIFT view
/rift/feed   ← Alternate RIFT view
/profile
```

**Implementation Note**: Use `useNavigate` with `replace: true` when switching between `/rift/jam` and `/rift/feed` to prevent history stacking. Preserve scroll position in feed tab via `sessionStorage`.