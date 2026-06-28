extends Node3D
class_name HandFingertipMapper

@export var hand: int = 0 # 0 for left, 1 for right
var xr_interface: XRInterface
var fingertips = {}

# Finger definitions (Godot OpenXR bone names/indices typically map to these, but we can also use XRPoser or manual offset for now if HandTracking isn't fully set up in Skeleton)
var finger_names = ["thumb", "index", "middle", "ring", "pinky"]

func _ready():
	xr_interface = XRServer.find_interface("OpenXR")
	if xr_interface and xr_interface.is_initialized():
		print("OpenXR initialized, setting up hand mapping for hand: ", hand)
	
	# Fallback setup: create 5 Area3D fingertips
	setup_fingertips()

func setup_fingertips():
	for finger in finger_names:
		var area = Area3D.new()
		var collision = CollisionShape3D.new()
		var sphere = SphereShape3D.new()
		sphere.radius = 0.015 # 1.5 cm radius for fingertips
		collision.shape = sphere
		area.add_child(collision)
		
		# Set physics layers so they interact with the fretboard notes
		area.collision_layer = 2
		area.collision_mask = 1
		
		# Assign a group so Fretboard knows this is a finger
		area.add_to_group("Fingertips")
		
		# Temporary static offsets for prototype (if no full skeletal tracking)
		# Spread them out slightly
		var offset_x = 0.0
		var offset_y = 0.0
		var offset_z = -0.1
		
		match finger:
			"thumb": offset_x = 0.05 if hand == 1 else -0.05; offset_y = -0.02; offset_z = -0.05
			"index": offset_x = 0.02 if hand == 1 else -0.02; offset_y = 0.0; offset_z = -0.12
			"middle": offset_x = 0.0; offset_y = 0.0; offset_z = -0.13
			"ring": offset_x = -0.02 if hand == 1 else 0.02; offset_y = -0.01; offset_z = -0.12
			"pinky": offset_x = -0.04 if hand == 1 else 0.04; offset_y = -0.02; offset_z = -0.10
			
		area.position = Vector3(offset_x, offset_y, offset_z)
		add_child(area)
		fingertips[finger] = area

func _process(_delta):
	# If we have an XRInterface and hand tracking is active, we'd update positions here
	# based on the OpenXR joint data.
	# For Godot 4.3+, this is often handled by XRHandModifier3D, but we can query XRServer.
	pass
