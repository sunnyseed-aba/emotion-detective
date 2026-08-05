"""
第二輪修補：
- greenkey(): 全域綠色鍵，用於 flood fill 失敗的綠幕圖。
- halo(): 清除人物外緣邊帶殘留的近白／近綠斑塊，不動內部高光。
"""
import sys

from PIL import Image, ImageFilter


def greenkey(path: str, out: str) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    mask = Image.new("L", (w, h), 255)
    mp = mask.load()
    n = 0
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            # 綠幕特徵：綠明顯高於紅與藍
            if g > 90 and g - r > 40 and g - b > 40:
                mp[x, y] = 0
                n += 1
    mask = mask.filter(ImageFilter.GaussianBlur(0.9))
    im.putalpha(mask)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(out, "PNG", optimize=True)
    print(f"greenkey {out} removed={n/(w*h):.1%} size={im.size}")


def halo(path: str, out: str, band: float = 0.16) -> None:
    """僅在外緣邊帶內清掉近白與近綠殘留。"""
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    bx, by = int(w * band), int(h * band)
    n = 0
    for y in range(h):
        for x in range(w):
            in_band = x < bx or x > w - bx or y < by or y > h - by
            if not in_band:
                continue
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            near_white = r > 228 and g > 228 and b > 228
            near_green = g > 90 and g - r > 30 and g - b > 30
            if near_white or near_green:
                px[x, y] = (r, g, b, 0)
                n += 1
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(out, "PNG", optimize=True)
    print(f"halo {out} cleared={n/(w*h):.2%} size={im.size}")


if __name__ == "__main__":
    mode = sys.argv[1]
    for p in sys.argv[2:]:
        if mode == "green":
            greenkey(p, p)
        else:
            halo(p, p)
