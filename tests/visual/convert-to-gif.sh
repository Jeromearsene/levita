#!/bin/bash
# Convert Playwright WebM recordings to optimized GIFs for documentation.
# Usage: ./tests/visual/convert-to-gif.sh

set -euo pipefail

INPUT_DIR="test-results"
OUTPUT_DIR="docs/animations"

mkdir -p "$OUTPUT_DIR"

for webm in "$INPUT_DIR"/record-animations-*-demo/*.webm; do
	name=$(basename "$(dirname "$webm")" | sed 's/record-animations-//' | sed 's/-demo$//')
	output="$OUTPUT_DIR/$name.gif"

	echo "Converting $name..."

	# Two-pass: generate palette then encode with it for quality
	ffmpeg -y -i "$webm" \
		-vf "fps=20,scale=400:-1:flags=lanczos,palettegen=stats_mode=diff" \
		-loglevel error \
		"/tmp/palette-$name.png"

	ffmpeg -y -i "$webm" -i "/tmp/palette-$name.png" \
		-lavfi "fps=20,scale=400:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
		-loglevel error \
		"$output"

	rm -f "/tmp/palette-$name.png"

	size=$(du -h "$output" | cut -f1)
	echo "  → $output ($size)"
done

echo "Done!"
