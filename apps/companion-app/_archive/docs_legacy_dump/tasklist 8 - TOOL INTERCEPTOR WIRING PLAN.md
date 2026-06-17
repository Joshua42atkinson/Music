# Phase 4: Hands-Free Tool Interceptor Wiring Plan

## Objective
Wire the newly established Tool Interceptor from `useTroubadourAI` into the React UI components, allowing the Liquid 1.5B model to physically control the Voix Vive app (play pitches, start metronome, navigate phases) without any screen interaction from the user.

## Step 1: The Global Event Bus (TroubadourWidget.jsx)
Since `TroubadourWidget.jsx` is the persistent voice companion that floats on every page, it is the natural place to handle tool execution.

We need to add a `handleToolCall` function inside `TroubadourWidget`:
```javascript
const handleToolCall = (toolName) => {
  console.log('[VoixVive] Executing Tool:', toolName);
  switch(toolName) {
    case 'PLAY_PITCH':
      // Emit event for DoPhaseView/Pitch detector to play the reference note
      window.dispatchEvent(new CustomEvent('voixvive:play_pitch'));
      break;
    case 'START_METRONOME':
      // Toggle the local metronome hook
      metro.setIsPlaying(true);
      handleModeSwitch('click'); // Show metronome UI
      break;
    case 'START_MEDITATION':
      // Emit event to start the BE phase breathing UI
      window.dispatchEvent(new CustomEvent('voixvive:start_meditation'));
      break;
    case 'NAVIGATE_NEXT':
      // Use the router to progress the user
      if (nextRecommended) navigate(`/class/${nextRecommended}`);
      break;
  }
};
```

## Step 2: Wire `onToolCall` to `chatStream`
We must update the two places in `TroubadourWidget.jsx` where `chatStream()` is called (`sendGuideMessage` for text, and `voiceInput.startListening` for voice):

```javascript
await chatStream(
  messages,
  (chunk, full) => { /* UI updates */ },
  {
    max_tokens: 512,
    mode: 'chat',
    locale,
    traction,
    bardLevel,
    currentFret,
    currentPhase,
    onToolCall: handleToolCall // <-- The crucial link
  }
);
```

## Step 3: Local Component Listeners
The individual views must listen for the global events emitted by the widget and execute the visual/audio actions.

**In `DoPhaseView.jsx` (Pitch matching):**
```javascript
useEffect(() => {
  const onPlayPitch = () => playReferencePitch();
  window.addEventListener('voixvive:play_pitch', onPlayPitch);
  return () => window.removeEventListener('voixvive:play_pitch', onPlayPitch);
}, []);
```

**In `BePhaseView.jsx` (Imagination):**
```javascript
useEffect(() => {
  const onMeditation = () => startBreathingTimer();
  window.addEventListener('voixvive:start_meditation', onMeditation);
  return () => window.removeEventListener('voixvive:start_meditation', onMeditation);
}, []);
```

## Step 4: Python Test Suite Validation
Before deploying, we will run the `test_liquid_models.py` suite. We will feed the model user prompts like:
> "I'm having trouble matching the pitch, can you play it for me?"
And verify that the LLM reliably outputs:
> "... [TOOL:PLAY_PITCH]"

## Conclusion
This guarantees 100% decoupling. The AI hook (`useTroubadourAI`) just extracts strings. The persistent widget (`TroubadourWidget`) routes them. The local views (`DoPhaseView`) execute them. This fulfills the "Sovereign Edge Hands-Free OS" requirement.
