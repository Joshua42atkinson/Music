extends SceneTree

func _init():
    var file = FileAccess.open("res://vertiscale_patterns.json", FileAccess.READ)
    var json = JSON.parse_string(file.get_as_text())
    
    if json == null or json.is_empty():
        print("ERROR: JSON is empty or invalid.")
        quit(1)
        return
        
    print("SUCCESS: JSON contains ", json.size(), " patterns.")
    
    # Verify the specific pattern format matches what GameManager expects
    var first_pattern = json.values()[0]
    if not first_pattern.has("frets") or not first_pattern.has("name"):
        print("ERROR: Missing expected 'frets' or 'name' fields.")
        quit(1)
        return
        
    print("SUCCESS: JSON structure is correct!")
    quit(0)
