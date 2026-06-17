#!/bin/bash

# Comprehensive keyboard accessibility fix script
# Adds onKeyDown handlers to all onClick elements

echo "🔧 Fixing keyboard accessibility across all components..."

# Find all .jsx and .js files in src
find src/ -name "*.jsx" -o -name "*.js" | while read file; do
    # Skip if already has onKeyDown
    if grep -q "onKeyDown=" "$file"; then
        echo "⏭️  Skipping $file (already has onKeyDown)"
        continue
    fi
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Apply sed transformations
    sed -i.bak -E '
        # Pattern 1: onClick={function} - add onKeyDown after
        s/(onClick=\{([^}]+)\})/\1\n            onKeyDown={(e) => e\.key === '\''Enter'\'' \&\& \2}/g
        
        # Pattern 2: onClick={arrow function} - add onKeyDown after  
        s/(onClick=\{(\(\) => [^}]+)\})/\1\n            onKeyDown={(e) => e\.key === '\''Enter'\'' \&\& \2}/g
        
        # Pattern 3: onClick={navigate} - add onKeyDown after
        s/(onClick=\{navigate\([^}]+\)\})/\1\n            onKeyDown={(e) => e\.key === '\''Enter'\'' \&\& navigate\3}/g
    ' "$file"
    
    # Check if file was modified
    if ! diff -q "$file.backup" "$file" > /dev/null; then
        echo "✅ Fixed keyboard accessibility in $file"
    else
        # Restore backup if no changes
        mv "$file.backup" "$file"
    fi
    
    # Remove backup
    rm -f "$file.backup" "$file.bak"
done

echo "🎉 Keyboard accessibility fix complete!"
