extends Node3D
class_name Fretboard

@export var string_count: int = 6
@export var fret_count: int = 15
@export var scale_length: float = 0.648 # Fender scale (25.5")
@export var nut_width: float = 0.043
@export var bridge_spacing: float = 0.054

var strings: Array[MeshInstance3D] = []
var frets: Array[MeshInstance3D] = []
var note_areas: Dictionary = {}

func _ready():
	generate_fretboard()

func calibrate(nut_pos: Vector3, fret12_pos: Vector3):
	var dir = (fret12_pos - nut_pos).normalized()
	scale_length = nut_pos.distance_to(fret12_pos) * 2.0
	
	global_position = nut_pos
	# Look away from the nut towards the 12th fret. Z- forward is negative Z in Godot.
	# So we want -Z to point along dir.
	look_at(nut_pos - dir, Vector3.UP)
	
	clear_fretboard()
	generate_fretboard()

func clear_fretboard():
	for child in get_children():
		child.queue_free()
	strings.clear()
	frets.clear()
	note_areas.clear()

func get_fret_distance(fret_index: int) -> float:
	return scale_length - (scale_length / pow(2.0, fret_index / 12.0))

func get_note_position(string_index: int, fret_index: int) -> Vector3:
	var t = get_fret_distance(fret_index) / scale_length
	var current_width = lerpf(nut_width, bridge_spacing, t)
	var s_spacing = current_width / max(1, string_count - 1)
	
	var x_pos = (string_index - (string_count - 1) / 2.0) * s_spacing
	var z_pos = -get_fret_distance(fret_index)
	return Vector3(x_pos, 0, z_pos)

func generate_fretboard():
	# 1. Generate Strings
	for i in range(string_count):
		var string_mesh = MeshInstance3D.new()
		var cyl = CylinderMesh.new()
		cyl.top_radius = 0.0015
		cyl.bottom_radius = 0.0015
		cyl.height = scale_length
		
		var mat = StandardMaterial3D.new()
		mat.albedo_color = Color(0.8, 0.8, 0.8)
		mat.metallic = 0.8
		mat.roughness = 0.2
		cyl.material = mat
		
		string_mesh.mesh = cyl
		
		# Position string (approximation, straight line from nut to bridge)
		var nut_x = (i - (string_count - 1) / 2.0) * (nut_width / max(1, string_count - 1))
		var bridge_x = (i - (string_count - 1) / 2.0) * (bridge_spacing / max(1, string_count - 1))
		
		# Center is halfway between nut and bridge
		var center_x = (nut_x + bridge_x) / 2.0
		string_mesh.position = Vector3(center_x, 0, -scale_length / 2.0)
		
		# Angle string slightly to match taper
		var angle = atan2(nut_x - bridge_x, scale_length)
		string_mesh.rotation = Vector3(PI/2, angle, 0)
		
		add_child(string_mesh)
		strings.append(string_mesh)
		
	# 2. Generate Frets
	for f in range(fret_count + 1):
		var fret_mesh = MeshInstance3D.new()
		var box = BoxMesh.new()
		
		var t = get_fret_distance(f) / scale_length
		var current_width = lerpf(nut_width, bridge_spacing, t)
		
		box.size = Vector3(current_width + 0.005, 0.003, 0.003)
		
		var mat = StandardMaterial3D.new()
		mat.albedo_color = Color(0.7, 0.7, 0.7)
		mat.metallic = 0.9
		box.material = mat
		
		fret_mesh.mesh = box
		fret_mesh.position = Vector3(0, -0.0015, -get_fret_distance(f))
		
		add_child(fret_mesh)
		frets.append(fret_mesh)
		
	# 3. Generate Interaction Areas
	for s in range(string_count):
		for f in range(fret_count + 1):
			create_note_area(s, f)

func create_note_area(string_index: int, fret_index: int):
	var area = Area3D.new()
	var collision = CollisionShape3D.new()
	var sphere = SphereShape3D.new()
	sphere.radius = 0.025 # 2.5cm interaction radius
	collision.shape = sphere
	
	area.add_child(collision)
	area.position = get_note_position(string_index, fret_index)
	
	area.area_entered.connect(_on_note_touched.bind(string_index, fret_index))
	add_child(area)
	note_areas[str(string_index) + "_" + str(fret_index)] = area

func _on_note_touched(area: Area3D, string_index: int, fret_index: int):
	if area.is_in_group("Fingertips"):
		print("Note touched by finger! String: ", string_index, " Fret: ", fret_index)
