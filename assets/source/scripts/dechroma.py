"""Remove the green chroma-key background from generated character sprites.

Usage: python3 dechroma.py file1.png file2.png ...
Writes <name>.png in place (keeps <name>_raw.png as the original).
"""
import sys
import os
import numpy as np
from PIL import Image


def dechroma(path: str) -> None:
    im = Image.open(path).convert("RGB")
    arr = np.asarray(im).astype(np.int16)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    # Green screen: green clearly dominates both other channels.
    is_green = (g > 90) & (g - r > 40) & (g - b > 40)

    alpha = np.where(is_green, 0, 255).astype(np.uint8)

    # Soften the boundary: pixels that are only mildly green get partial alpha
    edge = (~is_green) & (g - np.maximum(r, b) > 18)
    alpha[edge] = 140

    # Despill: pull green down toward the average of r and b on edge pixels.
    out = arr.copy()
    spill = edge | is_green
    neutral = ((out[..., 0] + out[..., 2]) // 2)
    out[..., 1] = np.where(spill, np.minimum(out[..., 1], neutral), out[..., 1])

    rgba = np.dstack([out.astype(np.uint8), alpha])
    result = Image.fromarray(rgba, mode="RGBA")

    # Crop to the subject's bounding box so placement math is predictable.
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)

    # Downscale: sprites never need to exceed 1200px tall on screen.
    if result.height > 1400:
        ratio = 1400 / result.height
        result = result.resize(
            (int(result.width * ratio), 1400), Image.LANCZOS
        )

    raw = path.replace(".png", "_raw.png")
    if not os.path.exists(raw):
        os.rename(path, raw)
    result.save(path, optimize=True)
    print(f"{os.path.basename(path)} -> {result.size} alpha_ok={result.mode}")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        dechroma(p)
