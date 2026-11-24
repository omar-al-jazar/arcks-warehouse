#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
OUT="../../"
mkdir -p "$OUT"

comps=(
  Arc-Default-AR
  Arc-Default
  Arc-Default-SA
  Arc-Polished
  Arc-YcParody
  Arc-Chaotic
  Arc-Deadpan
  Arc-Cinematic
  Arc-AppStore
)

for id in "${comps[@]}"; do
  echo "=== rendering $id ==="
  npx remotion render src/index.ts "$id" "$OUT/${id}.mp4" --codec=h264
done

npx remotion still src/index.ts Arc-Default-AR "$OUT/brag.jpg" --frame=90
cp "$OUT/Arc-Default-AR.mp4" "$OUT/brag.mp4"
echo "Done. Primary: $OUT/brag.mp4"
