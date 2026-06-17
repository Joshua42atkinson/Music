# vLLM Serving Guide — Troubadour AI on AMD ROCm

> **Date:** May 28, 2026
> **Context:** StepAudio-R1.1 (19GB, ~33B params) running on AMD Strix Halo (gfx1151) via vLLM + ROCm
> **Goal:** Serve as "Desktop-as-a-Service" (DAAS) for 20–75 concurrent beta testers

---

## 1. How vLLM Works (The 30-Second Version)

vLLM is not just a wrapper around PyTorch. It is a **complete inference engine** that replaces the standard transformer loop with three key innovations:

### 1.1 PagedAttention
Instead of allocating a contiguous block of GPU memory for each request's KV cache (which causes fragmentation and waste), vLLM **pages** the cache like an OS pages RAM:

- KV cache is split into fixed-size **blocks** (default 16 tokens per block)
- Blocks are allocated dynamically and non-contiguously
- Multiple sequences can **share blocks** (critical for beam search, but also useful for similar prompts)

**What this means for you:** With 128GB unified RAM on Strix Halo, you can theoretically serve 50+ concurrent users because vLLM doesn't waste memory on pre-allocated gaps.

### 1.2 Continuous Batching
Standard batching: wait for all requests in the batch to finish before starting new ones.

vLLM **continuous batching**: As soon as one request finishes generating a token, a new request can slot into the batch. The batch is "rolling" — always full, never waiting.

**What this means for you:** One user typing a long message doesn't block 49 other users. Throughput is measured in **tokens/second across all users**, not per-user latency.

### 1.3 Prefix Caching
If multiple users send prompts that start the same way (e.g., your system prompt), vLLM **computes the prefix once** and shares it across all requests.

**What this means for you:** The 2,000-token Troubadour system prompt is computed **once** and reused for every student. This is a massive speedup.

---

## 2. Your Current Setup Analysis

From previous session:
```bash
podman run -d --name stepaudio-server \
  --device /dev/dri --device /dev/kfd \
  --group-add video --group-add render --privileged \
  -e HSA_OVERRIDE_GFX_VERSION=11.5.1 \
  -e VLLM_TARGET_DEVICE=rocm \
  -v /home/joshua/trinity-models/vllm/Step-Audio-R1.1:/model:ro \
  -p 9998:9999 \
  localhost/vllm-stepaudio-rocm:prod /model \
  --port 9999 \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.70 \
  --dtype bfloat16 \
  --trust-remote-code \
  --enforce-eager
```

### 2.1 What Each Flag Does

| Flag | Your Value | What It Does | Should You Change It? |
|------|-----------|--------------|----------------------|
| `--max-model-len` | 4096 | Max tokens per sequence (prompt + response). Longer = more KV cache. | ✅ **Raise to 8192** for longer conversations. Your 128GB can handle it. |
| `--gpu-memory-utilization` | 0.70 | % of GPU memory vLLM pre-allocates for KV cache. Higher = more concurrent users. | ✅ **Raise to 0.85** after testing stability. |
| `--dtype` | bfloat16 | 16-bit floating point. 32GB model weights + 32GB KV cache. | ⚠️ **Keep**. FP8 failed on AMD (missing q_scale metadata). |
| `--enforce-eager` | set | Disables CUDA graph optimization. Slower but more compatible. | ⚠️ **Keep for now** on ROCm. Try removing after stability testing. |
| `--trust-remote-code` | set | Allows custom model architectures (StepAudio is not standard). | ✅ **Required**. StepAudio uses custom modeling code. |

### 2.2 The Bottleneck Is Not What You Think

With StepAudio-R1.1 at BF16:
- **Model weights**: ~63GB loaded into GPU memory
- **KV cache**: Remaining memory (128GB × 0.70 = ~90GB usable, minus 63GB = ~27GB for KV cache)
- **Per-user KV cache**: ~2MB per token × 4096 tokens ≈ 8MB per user
- **Theoretical max concurrent**: 27GB / 8MB ≈ **3,375 users**

**BUT** — this assumes no overhead, no prefill, no system prompt, and perfect memory packing. Realistically:
- With prefix caching, system prompt is shared
- With continuous batching, actual throughput is limited by **compute**, not memory
- AMD Strix Halo compute: ~10 TFLOPS FP16 → estimate **10–20 concurrent users** before latency degrades

Your target of **50–75 users** is achievable if:
1. Users have short interactions (under 50 tokens response)
2. System prompt is cached
3. You raise `--gpu-memory-utilization` to 0.85
4. You lower `--max-model-len` to 2048 for initial testing

---

## 3. Recommended Settings for 20→50→75 Users

### Phase 1: Solo Dev (1 user, localhost)
```bash
vllm serve /model \
  --port 9999 \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.70 \
  --dtype bfloat16 \
  --trust-remote-code \
  --enforce-eager
```

### Phase 2: Inner Circle (5–20 users, tunneled)
```bash
vllm serve /model \
  --port 9999 \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.80 \
  --dtype bfloat16 \
  --trust-remote-code \
  --max-num-seqs 64 \
  --max-num-batched-tokens 8192 \
  --api-key ${VLLM_API_KEY} \
  --enforce-eager
```

**New flags explained:**
- `--max-num-seqs 64`: Max concurrent sequences in the batch. Default is 256 — overkill for your hardware. 64 is a safe start.
- `--max-num-batched-tokens 8192`: Max tokens processed per forward pass. Limits memory spike during prefill.
- `--api-key`: Protects `/v1` endpoints. **CRITICAL**: See §4 Security.

### Phase 3: Closed Beta (20–50 users)
```bash
vllm serve /model \
  --port 9999 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.85 \
  --dtype bfloat16 \
  --trust-remote-code \
  --max-num-seqs 128 \
  --max-num-batched-tokens 16384 \
  --api-key ${VLLM_API_KEY} \
  --enable-prefix-caching \
  --enforce-eager
```

**New flags:**
- `--enable-prefix-caching`: Shares system prompt computation across all users. **Massive speedup** for Troubadour.
- `--max-num-seqs 128`: More concurrent users. Monitor GPU memory.

### Phase 4: Stress Test (50–75 users)
```bash
vllm serve /model \
  --port 9999 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90 \
  --dtype bfloat16 \
  --trust-remote-code \
  --max-num-seqs 256 \
  --max-num-batched-tokens 32768 \
  --api-key ${VLLM_API_KEY} \
  --enable-prefix-caching \
  --enforce-eager
```

**⚠️ Risk**: 0.90 utilization leaves almost no headroom. If a user sends a 4K token prompt, you OOM. Test incrementally.

---

## 4. Security (CRITICAL)

From vLLM docs: `--api-key` only protects `/v1/*` endpoints. Many dangerous endpoints are **unprotected**:

### Unprotected Endpoints (Even With `--api-key`)
- `/invocations` — same inference as `/v1/chat/completions`, no auth
- `/pause` — denial of service (stops all generation)
- `/update_weights` — can alter model behavior
- `/health` — health check (harmless)
- `/tokenize` — tokenize text (harmless)

### Required: Reverse Proxy
You **MUST** put vLLM behind a reverse proxy that blocks everything except `/v1/*`.

**nginx example:**
```nginx
server {
    listen 443 ssl;
    server_name troubadour.yourdomain.com;

    location /v1/ {
        proxy_pass http://localhost:9999/v1/;
        proxy_set_header Authorization $http_authorization;
    }

    # BLOCK everything else
    location / {
        return 403;
    }
}
```

**Even simpler: Cloudflare Tunnel + Access Rules**
- Create a Cloudflare Tunnel to `localhost:9999`
- Add Cloudflare Access policy: only allow your beta tester emails
- vLLM never directly exposed to internet

### API Key Setup
```bash
# On GMKtek
export VLLM_API_KEY="troubadour-$(openssl rand -hex 16)"

# In Vercel env vars
VITE_TROUBADOUR_API_URL=https://troubadour.yourdomain.com/v1
VITE_TROUBADOUR_API_KEY=${VLLM_API_KEY}
```

---

## 5. Monitoring (How You'll Know If It's Working)

### vLLM Built-in Metrics
```bash
# Server load
curl http://localhost:9999/load

# Health
curl http://localhost:9999/health

# Prometheus metrics (if enabled)
curl http://localhost:9999/metrics
```

### What to Watch
| Metric | Good | Bad | Action |
|--------|------|-----|--------|
| GPU memory | <85% | >95% | Lower `--gpu-memory-utilization` or `--max-num-seqs` |
| Queue wait time | <100ms | >1s | Increase `--max-num-seqs` or reduce `--max-model-len` |
| Token throughput | >500 tok/s | <100 tok/s | Check if `--enforce-eager` is the bottleneck |
| KV cache usage | <80% | >95% | Lower `--max-model-len` |

### Podman Commands for Monitoring
```bash
# Real-time GPU memory
watch -n 1 'rocm-smi'

# vLLM logs
podman logs -f stepaudio-server

# Container stats
podman stats stepaudio-server
```

---

## 6. The "DAAS" Architecture

Your setup is actually **Inference-as-a-Service**, not traditional Desktop-as-a-Service. Here's the data flow:

```
Student Browser (anywhere)
    ↓ HTTPS
Vercel Edge (React app, static)
    ↓ WebSocket or HTTP
Cloudflare Tunnel (encrypted, your domain)
    ↓ HTTP
nginx Reverse Proxy (blocks non-/v1, rate limits)
    ↓ HTTP
vLLM Container (localhost:9999)
    ↓ ROCm
AMD Strix Halo GPU (gfx1151)
    ↓
StepAudio-R1.1 weights (BF16, ~63GB)
```

**Nothing touches your desktop except GPU inference.** The model weights stay on your hardware. Student data (chat messages) flows through encrypted tunnels but is **not persisted** on your machine unless you configure it.

---

## 7. What "19GB Dual Brain" Actually Means

You mentioned "19GB 33B dual brain" — this is likely:
- **19GB**: Quantized weights (not your current BF16 setup)
- **33B**: Parameter count (33 billion)
- **Dual brain**: StepAudio's architecture — one "brain" for text understanding, one for audio generation

**Current reality**: Your BF16 weights are **63GB**, not 19GB. The 4-bit quantization attempt failed. So:
- You need the **full 128GB** Strix Halo RAM
- You cannot run this on a smaller GPU
- You cannot easily scale to cloud ( renting a GPU with 128GB costs $$$$)

**This is actually your moat.** No one else can easily replicate this setup. Bertrand's AI runs on your hardware, under your control.

---

## 8. Quick-Start Checklist

1. **Restart container with new flags:**
   ```bash
   podman stop stepaudio-server && podman rm stepaudio-server
   # Use Phase 2 settings from §3 above
   ```

2. **Set API key:**
   ```bash
   export VLLM_API_KEY="your-secret-key"
   ```

3. **Test local:**
   ```bash
   curl http://localhost:9999/v1/models \
     -H "Authorization: Bearer $VLLM_API_KEY"
   ```

4. **Test chat:**
   ```bash
   curl http://localhost:9999/v1/chat/completions \
     -H "Authorization: Bearer $VLLM_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"loaded","messages":[{"role":"user","content":"Hello Troubadour"}],"max_tokens":50}'
   ```

5. **Expose via Cloudflare:**
   ```bash
   cloudflared tunnel --url http://localhost:9999
   ```

6. **Update Vercel env vars** with tunnel URL + API key

7. **Test from browser:** Open Voix Vive, ask Troubadour a question

---

## 9. Failure Modes & What To Do

| Symptom | Cause | Fix |
|---------|-------|-----|
| OOM on startup | `--gpu-memory-utilization` too high | Lower to 0.70, restart |
| Slow first response | `--enforce-eager` + no prefix cache | Add `--enable-prefix-caching` |
| Queue backup, long waits | `--max-num-seqs` too low | Raise incrementally |
| Incoherent responses | `--max-model-len` too short | Raise to 4096+ |
| "Troubadour offline" in browser | Tunnel down / vLLM crashed | Check `podman ps`, restart tunnel |
| Unauthorized errors | API key mismatch | Check `VITE_TROUBADOUR_API_KEY` matches `VLLM_API_KEY` |

---

## 10. Sources

- vLLM Security Docs: `--api-key` limitations, unprotected endpoints
- vLLM Optimization: `gpu-memory-utilization`, `max-num-seqs`, `max-num-batched-tokens`
- AMD ROCm vLLM: `HIP_VISIBLE_DEVICES` conflicts, `--block-size` requirements
- Previous session: StepAudio-R1.1 build notes, quantization failure log

---

**Bottom line**: vLLM is the right tool. Your Strix Halo can serve 20–50 users with the right flags. The key is `--enable-prefix-caching` (shares the system prompt) and a reverse proxy (blocks dangerous endpoints). Start with Phase 2 settings and scale up.
