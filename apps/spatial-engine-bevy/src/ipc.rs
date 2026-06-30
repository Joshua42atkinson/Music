use bevy::prelude::*;
use crossbeam_channel::{unbounded, Receiver, Sender as CrossbeamSender};
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::thread;
use tokio::sync::broadcast;
use warp::ws::{Message, WebSocket, Ws};
use warp::Filter;

// ── IPC Message Structures ──
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IpcPayload {
    pub event: String,
    pub archetype: Option<String>,
    pub friction: Option<u32>,
    pub data: Option<serde_json::Value>,
}

#[derive(Message, Debug, Clone)]
pub struct IpcEvent(pub IpcPayload);

#[derive(Message, Debug, Clone)]
pub struct OutgoingIpcEvent(pub IpcPayload);

// ── Resource for the Channel ──
#[derive(Resource)]
struct IpcReceiver(Receiver<IpcPayload>);

#[derive(Resource)]
struct IpcBroadcaster(broadcast::Sender<String>);

pub struct IpcPlugin;

impl Plugin for IpcPlugin {
    fn build(&self, app: &mut App) {
        let (tx, rx) = unbounded();
        
        // Broadcast channel for sending messages back to WebSocket clients
        let (b_tx, _b_rx) = broadcast::channel::<String>(100);
        let b_tx_clone = b_tx.clone();

        // Spawn the WebSocket server in a background thread
        thread::spawn(move || {
            let rt = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
            rt.block_on(async {
                run_ws_server(tx, b_tx_clone).await;
            });
        });

        app.add_message::<IpcEvent>()
            .add_message::<OutgoingIpcEvent>()
            .insert_resource(IpcReceiver(rx))
            .insert_resource(IpcBroadcaster(b_tx))
            .add_systems(Update, process_ipc_messages)
            .add_systems(Update, broadcast_outgoing_ipc);
    }
}

async fn run_ws_server(tx: CrossbeamSender<IpcPayload>, b_tx: broadcast::Sender<String>) {
    let ws_route = warp::path("ws")
        .and(warp::ws())
        .and(warp::any().map(move || tx.clone()))
        .and(warp::any().map(move || b_tx.clone()))
        .map(|ws: Ws, tx: CrossbeamSender<IpcPayload>, b_tx: broadcast::Sender<String>| {
            ws.on_upgrade(move |socket| handle_client(socket, tx, b_tx))
        });

    println!("Starting IPC WebSocket server on ws://127.0.0.1:8765/ws");
    warp::serve(ws_route).run(([127, 0, 0, 1], 8765)).await;
}

async fn handle_client(ws: WebSocket, tx: CrossbeamSender<IpcPayload>, b_tx: broadcast::Sender<String>) {
    let (mut client_ws_sender, mut client_ws_rcv) = ws.split();
    let mut rx = b_tx.subscribe();

    tokio::task::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if let Err(e) = client_ws_sender.send(Message::text(msg)).await {
                eprintln!("Error sending to websocket: {}", e);
                break;
            }
        }
    });

    while let Some(result) = client_ws_rcv.next().await {
        match result {
            Ok(msg) => {
                if msg.is_text() {
                    if let Ok(text) = msg.to_str() {
                        println!("Received IPC message: {}", text);
                        if let Ok(payload) = serde_json::from_str::<IpcPayload>(text) {
                            let _ = tx.send(payload);
                        } else {
                            eprintln!("Failed to parse IPC payload: {}", text);
                        }
                    }
                }
            }
            Err(e) => {
                eprintln!("WebSocket error: {}", e);
                break;
            }
        }
    }
}

fn process_ipc_messages(receiver: Res<IpcReceiver>, mut events: MessageWriter<IpcEvent>) {
    for payload in receiver.0.try_iter() {
        events.write(IpcEvent(payload));
    }
}

fn broadcast_outgoing_ipc(
    mut events: MessageReader<OutgoingIpcEvent>,
    broadcaster: Res<IpcBroadcaster>,
) {
    for event in events.read() {
        if let Ok(json) = serde_json::to_string(&event.0) {
            let _ = broadcaster.0.send(json);
        }
    }
}
