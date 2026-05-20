#!/bin/bash
# Voix Vive — Workspace Cleanup Script
# Run once from anywhere. Safe to re-run (uses -f flags).

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Voix Vive Workspace Cleanup ==="

# 1. Move the 558MB tarball into _archive
if [ -f "$ROOT/conscious_framework_legacy_archive.tar.gz" ]; then
  mv "$ROOT/conscious_framework_legacy_archive.tar.gz" "$ROOT/_archive/"
  echo "✅ tarball moved to _archive/"
else
  echo "⏭  tarball already moved"
fi

# 2. Delete legacy root files (old LTD portfolio artifacts)
for f in README.md CONTEXT.md context.md Cargo.toml Cargo.lock package.json package-lock.json; do
  if [ -f "$ROOT/$f" ]; then
    rm "$ROOT/$f" && echo "✅ deleted: $f"
  else
    echo "⏭  already gone: $f"
  fi
done

# 3. Delete root node_modules (belongs to dead old portfolio server.js)
if [ -d "$ROOT/node_modules" ]; then
  rm -rf "$ROOT/node_modules" && echo "✅ deleted: root node_modules/ (~20MB)"
else
  echo "⏭  root node_modules/ already gone"
fi

# 4. Delete the zero-byte test file from _archive
if [ -f "$ROOT/_archive/TEST_TOUCH_FILE" ]; then
  rm "$ROOT/_archive/TEST_TOUCH_FILE" && echo "✅ deleted: _archive/TEST_TOUCH_FILE"
else
  echo "⏭  TEST_TOUCH_FILE already gone"
fi

echo ""
echo "=== Cleanup complete. Verifying git remote ==="
cd "$ROOT" && git remote -v

echo ""
echo "=== Root contents after cleanup ==="
ls -la "$ROOT"
