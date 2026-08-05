"""Conservative white-background cutout.

Only removes white pixels that are connected to the image border (outside the
subject). Interior light areas (hair highlights, white shoes, light shirts)
are never touched because they are not border-connected.
"""

import sys
from collections import deque

from PIL import Image


def cutout(path, out, tol=26, feather=1):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    def is_bg(x, y):
        r, g, b, _ = px[x, y]
        return r >= 255 - tol and g >= 255 - tol and b >= 255 - tol

    visited = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y) and not visited[y * w + x]:
                visited[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y) and not visited[y * w + x]:
                visited[y * w + x] = 1
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[ny * w + nx] and is_bg(nx, ny):
                visited[ny * w + nx] = 1
                q.append((nx, ny))

    for y in range(h):
        row = y * w
        for x in range(w):
            if visited[row + x]:
                r, g, b, _ = px[x, y]
                px[x, y] = (r, g, b, 0)

    # soften the 1px hard edge
    if feather:
        from PIL import ImageFilter

        a = im.getchannel("A").filter(ImageFilter.GaussianBlur(feather))
        im.putalpha(a)

    bbox = im.getchannel("A").getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(out)
    return im.size


if __name__ == "__main__":
    for p in sys.argv[1:]:
        o = p.replace(".png", "_cut.png")
        print(p, cutout(p, o))
