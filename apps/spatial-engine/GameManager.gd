extends Node
class_name GameManager

@export var fretboard: Fretboard
var patterns: Array = []
var active_pattern: Dictionary

enum GameMode { LEARNING, PLAYING, CALIBRATING }
var current_mode: GameMode = GameMode.LEARNING

var nut_anchor: Vector3
var fret12_anchor: Vector3
var calibration_step: int = 0

# Playing mode state
var spawn_timer: float = 0.0
var note_sequence: Array = []
var sequence_index: int = 0
var tempo: float = 120.0 # BPM
var beat_duration: float = 60.0 / tempo

@export var sync_endpoint: String = "http://localhost:1420/api/vertiscale/sync"
var http_client: HTTPRequest

func _ready():
	http_client = HTTPRequest.new()
	add_child(http_client)
	http_client.request_completed.connect(_on_sync_completed)
	
	# Enable transparent background for XR Passthrough
	get_viewport().transparent_bg = true
	
	# Attempt to set XR Passthrough (Alpha Blend) if XR is active
	var xr_interface = XRServer.find_interface("OpenXR")
	if xr_interface and xr_interface.is_initialized():
		xr_interface.environment_blend_mode = XRInterface.XR_ENV_BLEND_MODE_ALPHA_BLEND
		print("XR Passthrough (Alpha Blend) enabled.")
	
	load_patterns()
	if patterns.size() > 0:
		# Start with the first pattern
		load_vertiscale(patterns[0]["id"])

func _process(delta):
	if current_mode == GameMode.PLAYING and note_sequence.size() > 0:
		spawn_timer += delta
		if spawn_timer >= beat_duration:
			spawn_timer -= beat_duration
			if sequence_index < note_sequence.size():
				var hit = note_sequence[sequence_index]
				if hit != null:
					spawn_falling_note(hit["string"], hit["fret"], hit["isRoot"])
				sequence_index += 1
			else:
				# Loop sequence
				sequence_index = 0

func load_patterns():
	var file = FileAccess.open("res://vertiscale_patterns.json", FileAccess.READ)
	if file:
		var json_string = file.get_as_text()
		file.close()
		var json = JSON.new()
		if json.parse(json_string) == OK:
			patterns = json.data
			print("Loaded ", patterns.size(), " Vertiscale patterns.")
	else:
		print("Could not find vertiscale_patterns.json")

func load_vertiscale(pattern_id: String):
	for p in patterns:
		if p["id"] == pattern_id:
			active_pattern = p
			print("Loaded Pattern: ", p["label"])
			
			if current_mode == GameMode.LEARNING:
				display_pattern(p)
			elif current_mode == GameMode.PLAYING:
				build_sequence(p)
			return

func set_mode(mode: GameMode):
	current_mode = mode
	clear_notes()
	if active_pattern.is_empty() == false:
		if mode == GameMode.LEARNING:
			display_pattern(active_pattern)
		elif mode == GameMode.PLAYING:
			build_sequence(active_pattern)
		elif mode == GameMode.CALIBRATING:
			print("Entering Calibration Mode. Pinch at the Nut (Fret 0).")
			calibration_step = 0

func _input(event):
	# Developer shortcut to toggle calibration
	if event is InputEventKey and event.pressed and event.keycode == KEY_C:
		set_mode(GameMode.CALIBRATING)
	
	# Simulate XR Pinch to set anchors
	if current_mode == GameMode.CALIBRATING and event is InputEventKey and event.pressed and event.keycode == KEY_SPACE:
		# In a real XR scenario, we'd read the exact position of the XR controller or hand tracking pinch
		# For this demo, we'll simulate the hand being at specific coordinates relative to the headset
		if calibration_step == 0:
			nut_anchor = Vector3(-0.3, -0.2, -0.4) # Simulated left hand holding nut
			print("Nut anchor set. Now pinch at the 12th Fret.")
			calibration_step = 1
		elif calibration_step == 1:
			fret12_anchor = Vector3(0.1, -0.2, -0.4) # Simulated right hand holding 12th fret
			print("12th Fret anchor set. Calibrating fretboard...")
			fretboard.calibrate(nut_anchor, fret12_anchor)
			set_mode(GameMode.LEARNING)

func clear_notes():
	for child in fretboard.get_children():
		if child is MeshInstance3D and child.name.begins_with("Orb_"):
			child.queue_free()
		elif child is FallingNote:
			child.queue_free()

# ── LEARNING MODE ──
func display_pattern(pattern: Dictionary):
	clear_notes()
	var positions = pattern.get("positions", [])
	for string_index in range(positions.size()):
		var hit = positions[string_index]
		if hit != null:
			var orb = MeshInstance3D.new()
			orb.name = "Orb_" + str(string_index) + "_" + str(hit["fret"])
			
			var sphere = SphereMesh.new()
			sphere.radius = 0.025
			orb.mesh = sphere
			
			var mat = StandardMaterial3D.new()
			mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
			mat.albedo_color = Color(0.8, 0.66, 0.43) if hit["isRoot"] else Color(0.35, 0.56, 0.63)
			orb.material_override = mat
			
			orb.position = fretboard.get_note_position(string_index, hit["fret"])
			# Offset slightly up in Y so it sits on the string
			orb.position.y += 0.02
			fretboard.add_child(orb)

# ── PLAYING MODE ──
func build_sequence(pattern: Dictionary):
	clear_notes()
	note_sequence.clear()
	sequence_index = 0
	spawn_timer = 0.0
	
	var positions = pattern.get("positions", [])
	# Create a simple ascending arpeggio sequence from the active strings
	for s in range(positions.size() - 1, -1, -1): # Start from Low E (index 5) up to High E
		if positions[s] != null:
			var hit = positions[s]
			note_sequence.append({
				"string": s,
				"fret": hit["fret"],
				"isRoot": hit["isRoot"]
			})
	# Add a pause
	note_sequence.append(null)
	note_sequence.append(null)

func spawn_falling_note(string_index: int, fret_index: int, is_root: bool):
	var note = Node3D.new()
	note.set_script(load("res://FallingNote.gd"))
	
	var note_pos = fretboard.get_note_position(string_index, fret_index)
	var x_pos = note_pos.x
	var target_z = note_pos.z
	var start_z = -3.0 # Spawn 3 meters away
	
	note.init_note(string_index, fret_index, start_z, is_root, x_pos, target_z)
	fretboard.add_child(note)

# ── DATA SYNC ──
func sync_progress(score: int, successful: bool):
	if active_pattern.is_empty(): return
	
	var data = {
		"patternId": active_pattern["id"],
		"score": score,
		"successful": successful,
		"timestamp": Time.get_unix_time_from_system()
	}
	
	var headers = ["Content-Type: application/json"]
	var json_payload = JSON.stringify(data)
	
	http_client.request(sync_endpoint, headers, HTTPClient.METHOD_POST, json_payload)
	print("Syncing progress for ", active_pattern["id"])

func _on_sync_completed(result, response_code, headers, body):
	if response_code == 200:
		print("Progress synced successfully.")
	else:
		print("Sync failed with code: ", response_code)
