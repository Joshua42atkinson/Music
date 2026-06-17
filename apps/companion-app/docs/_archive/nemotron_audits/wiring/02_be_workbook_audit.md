---
title: 02_be_workbook_audit
status: archive
tags: []
date: 2026-06-14
---
**Reasoning:**  
The mood/somatic check‑in is captured in a `<textarea>` where the student types their answer. We’ll add an `onChange` handler that updates local state for UI feedback **and** immediately calls `recordBECheckIn(answer)` via the `usePlayerState` hook (which returns an object exposing that method). This wires the check‑in directly to the moment the user changes their input.

```jsx
import React, { useState } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';

const BEWorkbook = () => {
  const [answer, setAnswer] = useState('');
  // Assuming usePlayerState returns an object with methods like recordBECheckIn
  const player = usePlayerState();

  return (
    <div className="be-workbook">
      <h2>Somatic Check‑In</h2>
      <p>Please describe your current mood or any somatic sensations you notice.</p>
      <textarea
        value={answer}
        onChange={(e) => {
          const val = e.target.value;
          setAnswer(val);
          // Call the backend check‑in method with the current answer
          player.recordBECheckIn?.(val);
        }}
        placeholder="Type your answer here..."
        rows={4}
        className="checkin-input"
      />
    </div>
  );
};

export default BEWorkbook;
```