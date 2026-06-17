# **Voix Vive: Technical Integration & Dependency Manual**

This document provides the exhaustive technical specifications and implementation details for the Voix Vive multi-system architecture. It covers client-side inference, low-latency audio processing, and high-performance visualization.

# **1\. System 1: BE (Web-Native / Mini-Trinity Client-Side)**

The BE system facilitates fully decentralized, browser-based intelligence by leveraging WebAssembly and ONNX runtimes.

## **package.json Manifest**

The following dependencies are required for the client-side model orchestration and data persistence:

| Package | Version | Description |
| :---- | :---- | :---- |
| `@wllama/wllama` | 2.1.4 | [Wllama GitHub](https://github.com/ngxson/wllama) WebAssembly port for GGUF. |
| `kokoro-js` | 1.1.2 | [Kokoro-js on npm](https://www.npmjs.com/package/kokoro-js) for TTS synthesis. |
| `@xenova/transformers` | 2.17.2 | Model embedding and ONNX execution. |
| `dexie` | 4.0.1 | IndexedDB wrapper for local vector storage. |
| `@supabase/supabase-js` | 2.43.4 | Remote state synchronization. |
| `onnxruntime-web` | 1.18.0 | Web-native ONNX model acceleration. |

## **Web Worker Threading (wllama.worker.js)**

The following script initializes the Wllama backend to process the `LiquidAI-2.5-350M-Q4_K_M` GGUF model off the main thread.import { Wllama } from '@wllama/wllama';

const CONFIG \= {

  modelUrl: '/models/LiquidAI-2.5-350M-Q4\_K\_M.gguf',

  wasmPath: '/wasm/wllama.wasm'

};

async function initializeModel() {

  const wllama \= new Wllama(CONFIG.wasmPath);

  await wllama.loadModelFromUrl(CONFIG.modelUrl, {

    n\_ctx: 2048,

  });

  

  self.onmessage \= async (e) \=\> {

    const { prompt } \= e.data;

    const output \= await wllama.completion(prompt, {

      onToken: (token) \=\> self.postMessage({ type: 'token', token }),

    });

    self.postMessage({ type: 'done', output });

  };

}

initializeModel();

## **Kokoro-82M Voice Synthesis Loading**

Implementation for preloading and local caching of the Kokoro ONNX voice synthesis model:import { Kokoro } from 'kokoro-js';

async function setupKokoro() {

  const cacheName \= 'kokoro-model-cache';

  const modelUrl \= '/models/kokoro-82M.onnx';

  

  const cache \= await caches.open(cacheName);

  let response \= await cache.match(modelUrl);

  

  if (\!response) {

    await cache.add(modelUrl);

    response \= await cache.match(modelUrl);

  }

  const tts \= await Kokoro.fromUrl(modelUrl, {

    device: 'webgpu',

    dtype: 'fp32'

  });

  

  return tts;

}

## **IndexedDB Vector Store RAG Pipeline**

Client-side retrieval-augmented generation utilizing Dexie and `nomic-embed-text`:import Dexie from 'dexie';

import { pipeline } from '@xenova/transformers';

const db \= new Dexie('VectorDB');

db.version(1).stores({

  embeddings: '++id, content, \*vector'

});

async function runRAGPipeline(query) {

  const embedder \= await pipeline('feature-extraction', 'Xenova/nomic-embed-text-v1.5');

  const queryVector \= await embedder(query, { pooling: 'mean', normalize: true });

  

  const docs \= await db.embeddings.toArray();

  // Perform local cosine similarity search against docs

  return docs.filter(doc \=\> cosineSimilarity(queryVector.data, doc.vector) \> 0.85);

}

# **2\. System 2: DO (Low-Latency Ear Training \- Tauri Desktop)**

The DO system handles high-performance audio reasoning and capture through native Rust pipelines.

## **Tauri Cargo.toml Manifest**

\[dependencies\]

tauri \= { version \= "2.0.0-rc", features \= \["api-all"\] }

cpal \= "0.15.3"

hound \= "3.5.1"

tokio \= { version \= "1.38.0", features \= \["full"\] }

tokio-tungstenite \= "0.23.1"

serde \= { version \= "1.0", features \= \["derive"\] }

## **Rust Native Audio Capture (audio\_capture.rs)**

A lock-free implementation for streaming PCM audio to the [Step-Audio model](https://huggingface.co/stepfun-ai/Step-Audio-R1.1) backend:use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};

use tokio::sync::mpsc;

pub fn start\_capture(tx: mpsc::Sender\<Vec\<f32\>\>) {

    let host \= cpal::default\_host();

    let device \= host.default\_input\_device().expect("No input device");

    let config \= device.default\_input\_config().expect("Failed to get config");

    let stream \= device.build\_input\_stream(

        \&config.into(),

        move |data: &\[f32\], \_: &\_| {

            let \_ \= tx.blocking\_send(data.to\_vec());

        },

        |err| eprintln\!("Stream error: {}", err),

        None

    ).unwrap();

    stream.play().unwrap();

    std::thread::park(); // Keep stream alive

}

## **Docker Compose Local GPU Orchestration**

Configuration for Joshua's AMD workstation using ROCm for the Step-Audio backend:version: '3.8'

services:

  step-audio-reasoning:

    image: stepfun2025/vllm:step-audio

    devices:

      \- "/dev/kfd:/dev/kfd"

      \- "/dev/dri:/dev/dri"

    volumes:

      \- ./models:/models

    deploy:

      resources:

        reservations:

          devices:

            \- driver: amd

              count: all

    command: \--model /models/step-audio-r1 \--host 0.0.0.0 \--port 8000

# **3\. System 3: PLAY (Bevy Visualizer & High-Throughput Inference)**

System 3 manages the visual representation of musical theory and high-throughput LLM inference.

## **Bevy Game Engine Cargo.toml**

\[dependencies\]

bevy \= { version \= "0.13.0", features \= \["dynamic\_linking"\] }

tungstenite \= "0.21.0"

serde \= { version \= "1.0", features \= \["derive"\] }

serde\_json \= "1.0"

## **Fretboard ECS Coordinate Mapping System**

This system maps pitch packets to Bertrand's color tokens on the 3D fretboard:use bevy::prelude::\*;

\#\[derive(Component)\]

struct FretMarker { string: u8, fret: u8 }

fn fretboard\_mapping\_system(

    mut query: Query\<(\&FretMarker, \&mut Handle\<StandardMaterial\>)\>,

    mut events: EventReader\<PitchPacket\>,

    materials: Res\<AssetServer\>,

) {

    for event in events.read() {

        for (marker, mut mat) in query.iter\_mut() {

            if marker.string \== event.string && marker.fret \== event.fret {

                match event.token\_type {

                    "Root" \=\> \*mat \= materials.load("colors/red\_circle.glb"),

                    "Fourth" \=\> \*mat \= materials.load("colors/green\_flag.glb"), // 5th fret 4ths

                    "Seventh" \=\> \*mat \= materials.load("colors/blue\_shield.glb"),

                    \_ \=\> {}

                }

            }

        }

    }

}

## **Local Workstation vLLM Launch Commands**

# **3b. System 3b: Vibe OS Android XR (VR Play Mode Integration)**

## **I. Expanded Bevy & OpenXR dependencies (*Cargo.toml*)**

The following target crates and feature gates are required for compilation to Android XR with Hand Tracking support, utilizing the [bevy\_oxr](https://github.com/lucaspoffo/bevy_oxr) repository:  
\[dependencies\]  
bevy\_oxr \= { version \= "0.4.0", features \= \["hand\_tracking", "android"\] }  
serde \= { version \= "1.0.204", features \= \["derive"\] }  
serde\_json \= "1.0.120"  
tokio-tungstenite \= "0.23.1"

## **II. High-Throughput 256 Tokens/Sec JSON Stream Parser**

Production-ready Rust structures representing the JSON payload streamed from the local DiffusionGemma server for real-time instructor state management:

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct VibeInstructorState {
    pub verbal_guidance: String,
    pub active_pedagogy_fret: u8,
    pub active_pedagogy_string: u8,
    pub somatic_token_type: String, // "ROOT", "FOURTH", "SEVENTH"
    pub hand_tracking_joints: JointTransforms,
    pub animation_trigger: String,   // e.g., "point", "strum", "giggle"
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct JointTransforms {
    pub wrist: [f32; 3],
    pub thumb_tip: [f32; 3],
    pub index_tip: [f32; 3],
    pub middle_tip: [f32; 3],
}
```

## **III. Bevy ECS WebSocket Receiver & Hand Tracker System**

This thread-safe, asynchronous Bevy system manages the persistent WebSocket connection to the vLLM server. It parses the 256-token/second stream to update virtual joint transforms and the color-coded fretboard matrix within the VR environment:

```rust
use bevy::prelude::*;
use std::sync::mpsc::{Receiver, TryRecvError};

// Global Resource holding the cross-thread receiver channel
#[derive(Resource)]
pub struct StreamReceiver(pub Receiver<VibeInstructorState>);

// Marker component for Bertrand's virtual joint entities
#[derive(Component)]
pub struct InstructorJoint {
    pub joint_name: String,
}

pub fn stream_parsing_system(
    mut commands: Commands,
    receiver: Res<StreamReceiver>,
    mut joint_query: Query<(&mut Transform, &InstructorJoint)>,
) {
    match receiver.0.try_recv() {
        Ok(state) => {
            // Update the spatial positions of Bertrand's hallucinated hand joints
            for (mut transform, joint) in joint_query.iter_mut() {
                match joint.joint_name.as_str() {
                    "wrist" => transform.translation = Vec3::from_slice(&state.hand_tracking_joints.wrist),
                    "thumb_tip" => transform.translation = Vec3::from_slice(&state.hand_tracking_joints.thumb_tip),
                    "index_tip" => transform.translation = Vec3::from_slice(&state.hand_tracking_joints.index_tip),
                    _ => {}
                }
            }
            // Trigger dynamic vocal/haptic notifications
            commands.insert_resource(ActivePedagogyGoal {
                string: state.active_pedagogy_string,
                fret: state.active_pedagogy_fret,
                guidance: state.verbal_guidance,
            });
        }
        Err(TryRecvError::Empty) => {}
        Err(TryRecvError::Disconnected) => {
            eprintln!("vLLM JSON Stream Disconnected");
        }
    }
}
```

To host the `google/diffusiongemma-26B-A4B-it` model on AMD ROCm hardware, use the following production arguments:h  
python3 \-m vllm.entrypoints.openai.api\_server   
\--model google/diffusiongemma-26B-A4B-it   
\--device opencl   
\--dtype float16   
\--enforce-eager   
\--gpu-memory-utilization 0.95   
\--max-model-len 4096   
\--trust-remote-code