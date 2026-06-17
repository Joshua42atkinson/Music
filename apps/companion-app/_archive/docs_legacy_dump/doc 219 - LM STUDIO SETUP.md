# LM Studio Setup Guide - Qwen Coder

Quick guide to get LM Studio running with Qwen Coder for use as a local AI sub-agent in the Voix Vive Masterclass.

---

## 1. Install LM Studio

Download from: https://lmstudio.ai/

Available for:
- macOS (Apple Silicon & Intel)
- Windows
- Linux

---

## 2. Download Qwen Coder Model

### Recommended Models

For best results with coding tasks and Socratic instruction:

| Model | Size | Best For |
|-------|------|----------|
| `Qwen2.5-Coder-14B-Instruct-GGUF` | ~9GB | Balanced quality/speed |
| `Qwen2.5-Coder-32B-Instruct-GGUF` | ~20GB | Maximum quality |
| `Qwen2.5-Coder-7B-Instruct-GGUF` | ~5GB | Faster inference |

### Download Steps

1. Open LM Studio
2. Go to **Discover** tab (left sidebar)
3. Search: `qwen2.5-coder`
4. Select **Qwen2.5-Coder-Instruct-GGUF** from `Qwen` publisher
5. Choose quantization (recommendations):
   - **Q4_K_M** - Good balance (recommended)
   - **Q5_K_M** - Better quality, slightly slower
   - **Q6_K** - Best quality
6. Click **Download**

---

## 3. Configure for Maximum Performance

### GPU Offload (Critical)

To use your GPU for all layers:

1. Go to **Chat** tab
2. Load the model
3. On the right panel, find **GPU Offload**
4. Set to **Maximum** (or manually set layers to 999)
5. This ensures 100% GPU acceleration

### Context Length

1. In model settings (right panel)
2. Find **Context Length**
3. Set to **32768** (32K context)
   - Lower if you have VRAM constraints
   - Higher (65K+) only if you have 24GB+ VRAM

### Suggested Settings

```
Temperature: 0.7
Top P: 0.9
Top K: 40
Repeat Penalty: 1.1
```

---

## 4. Start the Local Server

### Enable API Server

1. Go to **Developer** tab (left sidebar)
2. Toggle **Local Inference Server**
3. Port: **1234** (default, matches our config)
4. Click **Start Server**

### Verify Server is Running

You should see:
- Green indicator: "Server is running on port 1234"
- Loaded model name displayed

---

## 5. Test in Voix Vive

### Connection Check

The app auto-detects LM Studio on startup. You can manually verify:

```javascript
// In browser console
fetch('http://localhost:1234/v1/models')
  .then(r => r.json())
  .then(data => console.log('LM Studio:', data))
```

### Using in Components

The `useBackendBridge` hook now routes to LM Studio automatically:

```javascript
import { useBackendBridge } from '../hooks/useBackendBridge';

function MyComponent() {
  const { 
    isLMStudioConnected, 
    lmStudioModel,
    askBertrand,
    checkLMStudio 
  } = useBackendBridge();

  // Send a message
  const response = await askBertrand([
    { role: 'user', content: 'Explain the CAGED system' }
  ]);
}
```

---

## 6. Using as a Sub-Agent

For complex tasks, you can use LM Studio directly with the dedicated hook:

```javascript
import { useLMStudio } from '../hooks/useLMStudio';

function SubAgentComponent() {
  const { 
    isReady, 
    chatCompletion,
    chatCompletionStream 
  } = useLMStudio();

  // Streaming response for real-time output
  await chatCompletionStream(
    messages,
    (chunk, full) => console.log(chunk), // Real-time updates
    { 
      maxContext: 32768,
      gpuLayers: 999,
      temperature: 0.7 
    }
  );
}
```

---

## 7. Troubleshooting

### "No model loaded" error

- Ensure model is loaded in LM Studio Chat tab
- Check server is running on port 1234
- Verify model appears in Developer tab

### Slow responses

- Increase GPU offload layers
- Reduce context length if VRAM limited
- Use Q4 quantization instead of Q5/Q6

### Out of memory

- Reduce context length (try 16384 or 8192)
- Reduce GPU offload layers
- Use smaller model (7B instead of 32B)

### Connection refused

- Check LM Studio server is started
- Verify port 1234 not blocked by firewall
- Try: `curl http://localhost:1234/v1/models`

---

## 8. Quick Reference

| Port | Service |
|------|---------|
| 1234 | LM Studio OpenAI API |
| 8080 | Voix Vive DaaS Server |

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/models` | List loaded models |
| `POST /v1/chat/completions` | Send chat messages |
| `POST /v1/completions` | Text completion |

---

## Next Steps

Once connected, LM Studio acts as:
1. **Primary AI** for student guitar instruction
2. **Sub-agent** for code generation and analysis
3. **Fallback** when DaaS server is offline

The `useBackendBridge` hook automatically routes to LM Studio when available, with full GPU acceleration and max context window.
