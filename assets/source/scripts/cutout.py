"""
人物 PNG 去背：從四邊向內做 flood fill，只移除與邊界相連的背景色塊，
避免把人物身上同色區域一起打掉。最後裁掉透明邊界並羽化 1px。
"""
import sys
from collections import deque

from PIL import Image, ImageFilter

TOL = 42  # RGB 歐氏距離閾值


def cutout(path: str, out: str) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    # 邊界主色：取四邊中點與四角共 8 點的平均
    samples = [
        px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1],
        px[w // 2, 0], px[w // 2, h - 1], px[0, h // 2], px[w - 1, h // 2],
    ]
    kr = sum(s[0] for s in samples) / len(samples)
    kg = sum(s[1] for s in samples) / len(samples)
    kb = sum(s[2] for s in samples) / len(samples)

    def is_bg(x: int, y: int) -> bool:
        r, g, b, _ = px[x, y]
        return ((r - kr) ** 2 + (g - kg) ** 2 + (b - kb) ** 2) ** 0.5 <= TOL

    visited = bytearray(w * h)
    q: deque = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y):
                q.append((x, y))
                visited[y * w + x] = 1
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y):
                q.append((x, y))
                visited[y * w + x] = 1

    mask = Image.new("L", (w, h), 255)
    mp = mask.load()
    while q:
        x, y = q.popleft()
        mp[x, y] = 0
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny * w + nx] and is_bg(nx, ny):
                visited[ny * w + nx] = 1
                q.append((nx, ny))

    mask = mask.filter(ImageFilter.GaussianBlur(0.8))
    im.putalpha(mask)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(out, "PNG", optimize=True)
    cov = sum(1 for v in visited if v) / (w * h)
    print(f"{out}  key=({kr:.0f},{kg:.0f},{kb:.0f})  removed={cov:.1%}  size={im.size}")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        cutout(p, p.replace(".png", "_cut.png"))
