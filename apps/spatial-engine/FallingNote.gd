extends Node3D
class_name FallingNote

@export var speed: float = 1.0
var target_z: float
var is_active: bool = false
var target_string: int
var target_fret: int
var hit_area: Area3D

func _process(delta):
	if is_active:
		# Move note along Z axis towards the fretboard
		position.z += speed * delta
		
		# If it passes the fretboard (positive Z), miss it
		if position.z > 0.5:
			miss_note()

func init_note(string_idx: int, fret_idx: int, start_z: float, root: bool, x_pos: float, end_z: float):
	target_string = string_idx
	target_fret = fret_idx
	target_z = end_z
	
	position = Vector3(x_pos, 0.05, start_z)
	
	var sphere = MeshInstance3D.new()
	var mesh = SphereMesh.new()
	mesh.radius = 0.03
	mesh.height = 0.06
	sphere.mesh = mesh
	
	var mat = StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	if root:
		mat.albedo_color = Color(1.0, 0.8, 0.2) # Bright Gold
	else:
		mat.albedo_color = Color(0.2, 0.8, 1.0) # Bright Cyan
	
	sphere.material_override = mat
	add_child(sphere)
	
	hit_area = Area3D.new()
	var collision = CollisionShape3D.new()
	var col_shape = SphereShape3D.new()
	col_shape.radius = 0.04
	collision.shape = col_shape
	hit_area.add_child(collision)
	
	# Connect collision signal (fingertips are Area3D)
	hit_area.area_entered.connect(_on_area_entered)
	add_child(hit_area)
	
	is_active = true

func _on_area_entered(area: Area3D):
	if is_active and area.is_in_group("Fingertips"):
		hit_note()

func hit_note():
	# Visual effect - scale down and change color (pseudo particle flare)
	is_active = false
	print("Hit Note! String: ", target_string, " Fret: ", target_fret)
	
	# Make it flash bright white
	var mesh_node = get_child(0) as MeshInstance3D
	if mesh_node and mesh_node.material_override:
		mesh_node.material_override.albedo_color = Color(1.0, 1.0, 1.0, 1.0)
	
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector3(2.5, 2.5, 2.5), 0.05)
	tween.parallel().tween_property(mesh_node.material_override, "albedo_color:a", 0.0, 0.2)
	tween.tween_property(self, "scale", Vector3(0.1, 0.1, 0.1), 0.15)
	tween.tween_callback(self.queue_free)

func miss_note():
	is_active = false
	print("Missed Note! String: ", target_string, " Fret: ", target_fret)
	queue_free()
