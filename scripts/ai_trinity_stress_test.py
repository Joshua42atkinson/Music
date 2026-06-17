#!/usr/bin/env python3
"""
Voix Vive — AI Trinity Stress Tester
Validates the orchestration of Nomic Embeddings -> Liquid AI Reasoning -> Kokoro TTS

Usage: python3 ai_trinity_stress_test.py
"""

import time
import urllib.request
import json
import os
import textwrap

# Configuration
# Assuming local LM Studio or Ollama endpoints
LIQUID_AI_URL = "http://127.0.0.1:1234/v1/chat/completions"
NOMIC_URL     = "http://127.0.0.1:11434/api/embeddings"
KOKORO_URL    = "http://127.0.0.1:5000/v1/audio/speech"

# The complex pedagogical query
QUERY = "Explain the transition from the 4th to the 5th fret in the context of somatic breathing and pythagorean tuning."

def print_header(title):
    print(f"\n{'-'*60}")
    print(f"🔹 {title}")
    print(f"{'-'*60}")

def simulate_nomic_retrieval():
    """Step 1: Simulate Nomic Embedding Retrieval"""
    print_header("1. RAG Retrieval (Nomic Embeddings)")
    start = time.time()
    
    # In a real environment, this calls a Vector DB (like Chroma) to fetch chunks.
    # We simulate reading the 12M Bible.
    bible_path = "docs/ai/12M_bible.md"
    if os.path.exists(bible_path):
        with open(bible_path, 'r') as f:
            content = f.read(2000) # Read a small chunk
        print("✓ Context retrieved from 12M_bible.md")
    else:
        content = "Simulated context: The 4th fret represents the body's grounding, while the 5th fret requires a deep inhale..."
        print("✓ Simulated context retrieved.")
        
    duration = time.time() - start
    print(f"⏱️ Retrieval Latency: {duration:.4f}s")
    return content

def call_liquid_ai(context, query):
    """Step 2: Call Liquid AI (or local LLM proxy)"""
    print_header("2. Orchestration & Reasoning (Liquid AI)")
    start = time.time()
    
    payload = {
        "model": "liquid-ai-local", # Your local Liquid AI model name
        "messages": [
            {"role": "system", "content": f"You are a Voix Vive AI Orchestrator. Answer using this context:\n{context}"},
            {"role": "user", "content": query}
        ],
        "max_tokens": 150,
        "temperature": 0.5
    }
    
    try:
        req = urllib.request.Request(
            LIQUID_AI_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            text = result['choices'][0]['message']['content']
            ttft = time.time() - start
            print(f"✓ Reasoning Complete. Generated {len(text)} characters.")
            print(f"⏱️ Generation Latency: {ttft:.4f}s")
            print(f"\nOutput Snippet:\n{textwrap.shorten(text, width=100)}")
            return text
    except Exception as e:
        ttft = time.time() - start
        print(f"⚠️ Liquid AI Endpoint offline or timed out. (Latency: {ttft:.4f}s)")
        print(f"Error: {e}")
        # Return fallback text to continue the pipeline
        return "The shift from the fourth to the fifth fret is not merely physical, it demands an expansion of the lungs."

def stream_to_kokoro(text):
    """Step 3: Stream to Kokoro TTS"""
    print_header("3. Voice Generation (Kokoro TTS)")
    start = time.time()
    
    payload = {
        "model": "kokoro-v1",
        "input": text,
        "voice": "bards_voice" 
    }
    
    try:
        req = urllib.request.Request(
            KOKORO_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            audio_data = response.read()
            duration = time.time() - start
            print(f"✓ TTS Audio generated! ({len(audio_data)} bytes)")
            print(f"⏱️ TTS Latency: {duration:.4f}s")
    except Exception as e:
        duration = time.time() - start
        print(f"⚠️ Kokoro TTS Endpoint offline or timed out. (Latency: {duration:.4f}s)")
        print(f"Error: {e}")

if __name__ == "__main__":
    print("="*60)
    print("🔥 INITIATING WEB-LED AI TRINITY STRESS TEST 🔥")
    print("="*60)
    print(f"Query: {QUERY}")
    
    context = simulate_nomic_retrieval()
    liquid_output = call_liquid_ai(context, QUERY)
    stream_to_kokoro(liquid_output)
    
    print("\n" + "="*60)
    print("🏁 STRESS TEST COMPLETE")
    print("="*60)
