#!/bin/bash

SOURCE_DIR="src/assets/products"
TARGET_DIR="server/dist/uploads"

mkdir -p "$TARGET_DIR"

echo "Aggressively optimizing images for maximum speed..."

for img in "$SOURCE_DIR"/*.webp; do
    [ -e "$img" ] || continue
    filename=$(basename "$img")
    echo "Processing $filename..."
    # Resize to 800px max dimension, quality 60 for aggressive compression, strip metadata
    magick "$img" -resize "800x800>" -quality 60 -strip "$TARGET_DIR/$filename"
done

echo "Creating thumbnail variants..."
mkdir -p "$TARGET_DIR/thumbs"

for img in "$TARGET_DIR"/*.webp; do
    [ -e "$img" ] || continue
    filename=$(basename "$img")
    # Create 400px thumbnail for grid views
    magick "$img" -resize "400x400>" -quality 50 -strip "$TARGET_DIR/thumbs/$filename"
done

echo "Optimization complete. Checking file sizes..."
du -sh "$TARGET_DIR"
du -sh "$TARGET_DIR/thumbs"
