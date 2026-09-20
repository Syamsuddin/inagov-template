#!/usr/bin/env python3
"""Turunkan docs/data/aturan-kontras.json dari assets/idds-tokens.css.

Membaca setiap token semantik (content-*, stroke-*, background-*) per tema dan
per brand, meresolusi rantai var(), lalu menghitung rasio kontras WCAG 2.1.
Jalankan ulang setiap kali idds-tokens.css berubah:

    python3 docs/scripts/build-kontras.py            # tulis data/aturan-kontras.json
    python3 docs/scripts/build-kontras.py --check    # keluar 1 bila ada aturan keras yang dilanggar
"""
import json, re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # root paket (docs/scripts/..)
CSS = os.path.join(ROOT, "assets", "idds-tokens.css")
OUT = os.path.join(ROOT, "docs", "data", "aturan-kontras.json")

# ---------- parser CSS sederhana: selector -> {token: nilai} ----------
def parse(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    blocks = []
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        sel = " ".join(m.group(1).split())
        decls = {}
        for d in m.group(2).split(";"):
            if ":" in d:
                k, v = d.split(":", 1)
                decls[k.strip()] = v.strip()
        blocks.append((sel, decls))
    return blocks

def sel_matches(sel, theme, brand):
    """Apakah selector berlaku untuk kombinasi (theme, brand)?"""
    for part in [p.strip() for p in sel.split(",")]:
        if part == ":root":
            return True
        if part == f'[data-theme="{theme}"]':
            return True
        if part == '[data-theme="dark"]:not([data-brand])' and theme == "dark" and brand is None:
            return True
        if brand and part == f'[data-brand="{brand}"]':
            return True
        if brand and part == f'[data-theme="{theme}"][data-brand="{brand}"]':
            return True
    return False

def specificity(sel):
    return sel.count("[")  # cukup untuk berkas ini

def tokens_for(blocks, theme, brand):
    applicable = [(specificity(s), i, d) for i, (s, d) in enumerate(blocks) if sel_matches(s, theme, brand)]
    applicable.sort()
    out = {}
    for _, _, d in applicable:
        out.update(d)
    return out

def resolve(tokens, name, depth=0):
    v = tokens.get(name)
    if v is None or depth > 20:
        return None
    m = re.fullmatch(r"var\((--[\w-]+)\)", v)
    return resolve(tokens, m.group(1), depth + 1) if m else v

# ---------- WCAG ----------
def lum(h):
    h = h.lstrip("#")
    if len(h) == 8:
        h = h[:6]  # abaikan alpha
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def cr(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)

def vonis_teks(r):
    return "AAA" if r >= 7 else "AA" if r >= 4.5 else "AA-large" if r >= 3 else "GAGAL"

def vonis_ui(r):
    return "LOLOS" if r >= 3 else "GAGAL"

# ---------- bangun laporan ----------
BRANDS = ["inapas", "inagov", "inaku", "bgn", "bkn", "lan", "panrb", "hss"]
BG_TEKS = ["background-primary", "background-secondary", "background-tertiary",
           "background-guide-subtle", "background-positive-subtle",
           "background-negative-subtle", "background-warning-subtle", "background-disabled"]
NON_TEKS = {"content-tertiary", "content-disabled"}  # sengaja bukan warna teks
# token terikat: hanya sah di atas satu latar tertentu, tidak masuk matriks umum
TERIKAT = {"content-on-primary": "background-brand", "content-inverse": "background-inverse"}

def main():
    blocks = parse(open(CSS, encoding="utf-8").read())
    laporan = {
        "_sumber": "digenerate docs/scripts/build-kontras.py dari assets/idds-tokens.css — JANGAN diedit manual",
        "_rumus": "WCAG 2.1 relative luminance; teks normal AA ≥4,5, AAA ≥7, teks besar ≥3, komponen UI ≥3",
        "tema": {},
        "tombol_primary": {},
        "larangan_teks": [],
        "hanya_teks_besar": [],
        "pasangan_terikat": [],
        "aturan_keras": [
            "content-tertiary dan content-disabled BUKAN warna teks — hanya ikon dekoratif, elemen nonaktif, placeholder non-esensial.",
            "Pesan error ukuran body memakai content-negative-strong (light), bukan content-negative (4,10).",
            "Batas input yang membawa makna memakai stroke-input (≥3:1); stroke-primary dan stroke-secondary dekoratif saja.",
            "Label di atas background-brand memakai content-on-primary — jangan tulis putih/hitam langsung; dua brand (inapas, panrb) memakai teks gelap di dark mode.",
            "Latar --ina-accent-yellow (#fff500) wajib teks gelap: vs putih 1,15, vs #1f1a17 15,03.",
            "Button primary tidak memakai primary-300 sebagai latar (gagal pada 6 dari 7 brand resmi).",
        ],
    }
    for theme in ("light", "dark"):
        t = tokens_for(blocks, theme, None)
        content = sorted(k for k in t if k.startswith("--ina-content-"))
        stroke = sorted(k for k in t if k.startswith("--ina-stroke-"))
        teks, ui = [], []
        for c in content:
            ch = resolve(t, c)
            if not ch or not ch.startswith("#"):
                continue
            if c[6:] in TERIKAT:
                bh = resolve(t, "--ina-" + TERIKAT[c[6:]])
                r = cr(ch, bh)
                laporan["pasangan_terikat"].append({"tema": theme, "teks": c[6:], "latar": TERIKAT[c[6:]],
                                                    "rasio": r, "vonis": vonis_teks(r),
                                                    "catatan": "hanya sah di atas latar ini; untuk background-brand lihat tombol_primary per brand"})
                continue
            for bg in BG_TEKS:
                bh = resolve(t, "--ina-" + bg)
                if not bh:
                    continue
                r = cr(ch, bh)
                row = {"teks": c[6:], "latar": bg, "rasio": r, "vonis": vonis_teks(r)}
                if c[6:] in NON_TEKS:
                    row["catatan"] = "bukan warna teks"
                teks.append(row)
                if c[6:] not in NON_TEKS:
                    if row["vonis"] == "GAGAL":
                        laporan["larangan_teks"].append({"tema": theme, **{k: row[k] for k in ("teks", "latar", "rasio")}})
                    elif row["vonis"] == "AA-large":
                        laporan["hanya_teks_besar"].append({"tema": theme, **{k: row[k] for k in ("teks", "latar", "rasio")}})
        for s in stroke:
            sh = resolve(t, s)
            if not sh or not sh.startswith("#"):
                continue
            for bg in ("background-primary", "background-secondary", "background-tertiary"):
                r = cr(sh, resolve(t, "--ina-" + bg))
                ui.append({"stroke": s[6:], "latar": bg, "rasio": r, "vonis": vonis_ui(r)})
        laporan["tema"][theme] = {"pasangan_teks": teks, "pasangan_stroke": ui}

    for brand in BRANDS:
        laporan["tombol_primary"][brand] = {}
        for theme in ("light", "dark"):
            t = tokens_for(blocks, theme, brand)
            pp, on, bg = resolve(t, "--ina-primary-primary"), resolve(t, "--ina-content-on-primary"), resolve(t, "--ina-background-primary")
            hov = resolve(t, "--ina-background-brand-hover")
            row = {
                "primary_primary": pp, "content_on_primary": on,
                "label_vs_tombol": cr(on, pp), "vonis_label": vonis_teks(cr(on, pp)),
                "tombol_vs_latar": cr(pp, bg), "vonis_batas": vonis_ui(cr(pp, bg)),
                "hover": hov, "label_vs_hover": cr(on, hov), "vonis_label_hover": vonis_teks(cr(on, hov)),
            }
            laporan["tombol_primary"][brand][theme] = row

    if "--check" in sys.argv:
        gagal = [(b, th, r) for b, v in laporan["tombol_primary"].items() for th, r in v.items()
                 if r["vonis_label"] in ("GAGAL", "AA-large")]
        for b, th, r in gagal:
            print(f"[FAIL] {b}/{th}: label {r['content_on_primary']} di atas {r['primary_primary']} = {r['label_vs_tombol']}")
        for b, v in laporan["tombol_primary"].items():
            for th, r in v.items():
                if r["vonis_batas"] == "GAGAL":
                    print(f"[WARN] {b}/{th}: tombol {r['primary_primary']} vs latar = {r['tombol_vs_latar']} (<3; brand npm, label tetap lolos)")
        for l in laporan["larangan_teks"]:
            print(f"[INFO] larangan {l['tema']}: {l['teks']} on {l['latar']} = {l['rasio']}")
        for l in laporan["hanya_teks_besar"]:
            print(f"[INFO] teks besar saja {l['tema']}: {l['teks']} on {l['latar']} = {l['rasio']}")
        for l in laporan["pasangan_terikat"]:
            if l["vonis"] in ("GAGAL", "AA-large"):
                print(f"[FAIL] terikat {l['tema']}: {l['teks']} on {l['latar']} = {l['rasio']}")
                gagal.append(l)
        print("OK: semua label tombol dan pasangan terikat lolos AA" if not gagal else f"{len(gagal)} kegagalan")
        sys.exit(1 if gagal else 0)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(laporan, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"ditulis {os.path.relpath(OUT, ROOT)}: {sum(len(v['pasangan_teks']) for v in laporan['tema'].values())} pasangan teks, "
          f"{len(laporan['larangan_teks'])} larangan, {len(BRANDS)} brand")

if __name__ == "__main__":
    main()
