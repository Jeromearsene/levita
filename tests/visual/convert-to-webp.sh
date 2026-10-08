#!/bin/bash
# Convert lossless Playwright screenshots to looping animated WebP previews.
# Usage: ./tests/visual/convert-to-webp.sh

set -euo pipefail

INPUT_DIR="test-results"
OUTPUT_DIR="docs/animations"

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob
recording_dirs=("$INPUT_DIR"/record-animations-*-demo)
if ((${#recording_dirs[@]} == 0)); then
	echo "No Playwright frame sequences found in $INPUT_DIR" >&2
	exit 1
fi

converted=()
for recording_dir in "${recording_dirs[@]}"; do
	frames=("$recording_dir"/frame-*.png)
	if ((${#frames[@]} == 0)); then
		continue
	fi

	name=$(basename "$recording_dir" | sed 's/^record-animations-//' | sed 's/-demo$//')
	output="$OUTPUT_DIR/$name.webp"

	echo "Converting $name..."
	img2webp -loop 0 -mixed -q 100 -m 6 -d 50 "${frames[@]}" -o "$output"
	converted+=("$name")
	rm -f "${frames[@]}"

	size=$(du -h "$output" | cut -f1)
	echo "  → $output ($size, infinite loop)"
done

for expected in tilt glare shadow combined parallax active-offset; do
	case " ${converted[*]} " in
		*" $expected "*) ;;
		*)
			echo "Expected one frame sequence for each effect (tilt, glare, shadow, combined, parallax, active-offset)" >&2
			exit 1
			;;
	esac
done

echo "Done!"
