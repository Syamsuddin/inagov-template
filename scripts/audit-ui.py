#!/usr/bin/env python3
"""Audit statis kepatuhan laman terhadap kontrak desain (AGENTS.md + 26_UI_CONVENTIONS §5/§6/§10.6/§11).

Jalankan dari mana saja:  python3 scripts/audit-ui.py [--json keluaran.json] [--all]
Keluar 1 bila ada pelanggaran keras. Tanpa --all hanya pelanggaran keras yang dicetak.

Yang diperiksa per laman (index.html + pages/**):
  R1  hex/rgb/hsl literal, px literal (selain 0/1px & atribut width/height), token primitif, token var() tak terdefinisi
  R2  <style> inline, kelas ina-* yang tidak ada di idds-admin.css / idds-utilities.css / idds-admin.js
  R3  CDN / pustaka eksternal, glyph Unicode sebagai ikon (● ✓ ✕ ↕ ⚡), SVG bukan Tabler (viewBox 24) tanpa role/label
  R4  href/src/data-go ke berkas yang tidak ada, jalur relatif salah kedalaman
  R5  >1 ina-btn-primary tampak bersamaan (di luar modal/tab nonaktif), label tombol Title Case
  R6  background-brand / content-tertiary / content-disabled sebagai warna teks, outline:none, text-align:justify
  R7  label sidebar >2 kata, badge >2 kata
  R9  sidebar admin harus identik & punya aria-current="page"
  A   tombol ikon tanpa aria-label, input tanpa label, img tanpa alt, button tanpa type, lang, <title>
Pemeriksaan runtime (kontras terukur, galat konsol, gulir horizontal) tetap lewat peramban (panduan §6);
kontras token lewat build-kontras.py --check.
"""
import re, sys, json, collections
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
pages = [ROOT / 'index.html'] + sorted((ROOT / 'pages').rglob('*.html'))
css_all = (ROOT / 'assets/idds-admin.css').read_text() + (ROOT / 'assets/idds-utilities.css').read_text()
tokens_css = (ROOT / 'assets/idds-tokens.css').read_text()
js = (ROOT / 'assets/idds-admin.js').read_text()
defined_classes = set(re.findall(r'\.(ina-[A-Za-z0-9_-]+)', css_all)) | set(re.findall(r'(ina-[A-Za-z0-9_-]+)', js))
tokens_defined = set(re.findall(r'(--ina-[A-Za-z0-9_-]+)\s*:', tokens_css + css_all))

RE_HEX = re.compile(r':\s*#[0-9a-fA-F]{3,8}\b|\b(rgb|hsl)a?\(')
RE_PX = re.compile(r'\b(\d+(\.\d+)?)px\b')
RE_PRIM = re.compile(r'--ina-(blue|neutral|red|green|yellow|orange|purple|teal)-\d+|--ina-primary-\d{2,3}')
RE_GLYPH = re.compile('[●✓✔✕✖✗↕⚡]')
SEP = re.compile(r'\s*[·—/&]\s*')
PRODUK = {'INApas', 'INAku', 'OpenAPI', 'SP4N-LAPOR!', 'JDIH', 'PPID', 'TTE', 'BSrE', 'ASN', 'OPD', 'ID', 'Induk', 'Digital', 'SIMBG', 'WhatsApp', 'Telegram', 'Google', 'JSON', 'CSV', 'PDF', 'XLSX'}

out = collections.defaultdict(list)
KERAS = set()
def add(k, f, l, s, keras=True):
    out[k].append((str(f.relative_to(ROOT)), l, s.strip()[:150]))
    if keras: KERAS.add(k)

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack = []; self.hidden_depth = 0; self.in_sidebar = 0
        self.primary_visible = []; self.icon_btns = []; self.imgs = []; self.btn_notype = []
        self.inputs = []; self.labels_for = set(); self.cur_btn = None; self.btn_text = ''; self.danger = []
        self.sidebar = []; self.cur_a = None; self.a_text = ''; self.aria_current = 0
        self.badges = []; self.cur_badge = None; self.badge_text = ''; self.btn_labels = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = (a.get('class') or '').split(); line = self.getpos()[0]
        hid = ('hidden' in a or 'ina-modal' in cls or 'ina-drawer' in cls or 'ina-dropdown-menu' in cls
               or ('ina-tab-content' in cls and 'ina-active' not in cls))
        self.stack.append((tag, hid, tag == 'aside' and 'ina-sidebar' in cls))
        if hid: self.hidden_depth += 1
        if tag == 'aside' and 'ina-sidebar' in cls: self.in_sidebar += 1
        if tag in ('button', 'a') and 'ina-btn-primary' in cls and not self.hidden_depth: self.primary_visible.append(line)
        if tag == 'button' and 'type' not in a: self.btn_notype.append(line)
        if tag == 'img' and a.get('alt') is None: self.imgs.append((line, a.get('src')))
        if tag in ('button', 'a'): self.cur_btn = (tag, line, a); self.btn_text = ''
        if tag in ('input', 'select', 'textarea') and a.get('type') not in ('hidden', 'submit', 'button', 'checkbox', 'radio'):
            self.inputs.append((line, a.get('id'), a.get('aria-label'), a.get('aria-labelledby'), a.get('type')))
        if tag == 'label' and a.get('for'): self.labels_for.add(a['for'])
        if tag == 'a' and self.in_sidebar: self.cur_a = (line, a.get('href')); self.a_text = ''
        if a.get('aria-current') == 'page': self.aria_current += 1
        if tag == 'span' and 'ina-badge' in cls: self.cur_badge = line; self.badge_text = ''
    def handle_endtag(self, tag):
        while self.stack:
            t, hid, sb = self.stack.pop()
            if hid: self.hidden_depth -= 1
            if sb: self.in_sidebar -= 1
            if t == tag: break
        if tag in ('button', 'a') and self.cur_btn:
            t, line, a = self.cur_btn; txt = re.sub(r'\s+', ' ', self.btn_text).strip(); cls = a.get('class') or ''
            if ('ina-icon-btn' in cls or ('ina-btn' in cls and not txt)) and not txt and not (a.get('aria-label') or a.get('title') or a.get('aria-labelledby')):
                self.icon_btns.append((line, cls))
            if 'ina-btn-danger' in cls and not self.hidden_depth:
                self.danger.append((line, txt, a.get('data-modal-target') or a.get('data-bulk-delete')))
            if 'ina-btn' in cls and txt: self.btn_labels.append((line, txt))
            self.cur_btn = None
        if tag == 'a' and self.cur_a:
            line, href = self.cur_a; self.sidebar.append((href, re.sub(r'\s+', ' ', self.a_text).strip())); self.cur_a = None
        if tag == 'span' and self.cur_badge is not None:
            self.badges.append((self.cur_badge, re.sub(r'\s+', ' ', self.badge_text).strip())); self.cur_badge = None
    def handle_data(self, data):
        if self.cur_btn: self.btn_text += data
        if self.cur_a: self.a_text += data
        if self.cur_badge is not None: self.badge_text += data

def kata(t):
    return [w for w in SEP.split(t) if w and not re.fullmatch(r'\d+(?:[.,]\d+)?%?', w) and w not in ('MB', 'KB')]

sidebars = {}
for f in pages:
    txt = f.read_text(); rel = str(f.relative_to(ROOT)); depth = len(f.relative_to(ROOT).parts) - 1
    for i, raw in enumerate(txt.split('\n'), 1):
        ln = re.sub(r'\sd="[^"]*"', ' d=""', raw)
        if '<style' in ln: add('R2 <style> inline', f, i, ln)
        if RE_HEX.search(ln): add('R1 hex/rgb/hsl literal', f, i, ln)
        for m in RE_PX.finditer(ln):
            if m.group(1) not in ('0', '1') and not re.search(r'(width|height)=["\']?$', ln[max(0, m.start() - 12):m.start()]):
                add('R1 px literal', f, i, ln)
        if RE_PRIM.search(ln): add('R1 token primitif', f, i, ln)
        if re.search(r'<(link|script)[^>]+(href|src)="https?://', ln) or 'fonts.googleapis' in ln: add('R3 CDN/pustaka eksternal', f, i, ln)
        if re.search(r'(^|[^-\w])color: ?var\(--ina-background-brand\)', ln): add('R6 background-brand sebagai warna teks', f, i, ln)
        if re.search(r'color\s*:\s*var\(--ina-content-(tertiary|disabled)\)', ln): add('R6 content-tertiary/disabled sebagai teks', f, i, ln)
        if re.search(r'outline\s*:\s*(none|0)\b', ln): add('R6 outline:none', f, i, ln)
        if re.search(r'text-align\s*:\s*justify', ln): add('R6 text-align justify', f, i, ln)
        if re.search(r'\[ISI:|Lorem ipsum', raw): add('R-DoD placeholder tertinggal', f, i, raw)
        if RE_GLYPH.search(raw) and '<!--' not in raw: add('R3 glyph sebagai ikon', f, i, raw)
    for c in sorted({c for m in re.finditer(r'class="([^"]+)"', txt) for c in m.group(1).split() if c.startswith('ina-')}):
        if c not in defined_classes: add('R2 kelas ina-* tidak terdefinisi', f, 0, c)
    for m in re.finditer(r'var\((--ina-[A-Za-z0-9_-]+)', txt):
        if m.group(1) not in tokens_defined: add('R1 token tidak terdefinisi', f, txt[:m.start()].count('\n') + 1, m.group(1))
    for m in re.finditer(r'(?:href|src|data-go)="([^"#?]+)(?:[#?][^"]*)?"', txt):
        p = m.group(1)
        if p.startswith(('http', 'mailto:', 'tel:', 'data:')) or not p: continue
        if not (f.parent / p).resolve().exists(): add('R4 tautan/berkas tidak ada', f, txt[:m.start()].count('\n') + 1, p)
        elif (depth == 2 and p.startswith('assets/')) or (depth == 0 and p.startswith('../')): add('R4 jalur relatif salah', f, txt[:m.start()].count('\n') + 1, p)
    for m in re.finditer(r'<svg\b([^>]*)>', txt):
        at = m.group(1); l = txt[:m.start()].count('\n') + 1
        if 'viewBox="0 0 24 24"' not in at and 'role=' not in at and 'aria-label' not in at and 'aria-hidden' not in at: add('R3 svg bukan Tabler tanpa role/label', f, l, at[:100])
        if 'aria-hidden' not in at and 'role=' not in at and 'aria-label' not in at: add('A svg tanpa aria-hidden/label', f, l, at[:100])
    if 'lang="id"' not in txt: add('A html lang bukan id', f, 0, '')
    if not re.search(r'<title>[^<]+</title>', txt): add('A <title> kosong', f, 0, '')

    p = P(); p.feed(txt)
    if len(p.primary_visible) > 1 and 'ui-kit' not in rel:
        add('R5 >1 ina-btn-primary tampak sekaligus', f, 0, f'baris {p.primary_visible}')
    for l, t in p.btn_labels:
        w = t.split()
        if len(w) >= 2 and all(re.match(r'^[A-Z][a-z]', x) for x in w[1:]) and not any(x.strip('()') in PRODUK for x in w):
            add('R5 label tombol Title Case', f, l, t)
    for l, c in p.icon_btns: add('A tombol ikon tanpa aria-label', f, l, c)
    for l, s in p.imgs: add('A img tanpa alt', f, l, s or '')
    for l in p.btn_notype: add('A button tanpa type', f, l, '', keras=False)
    for l, i, al, alb, ty in p.inputs:
        if not (i and i in p.labels_for) and not al and not alb: add('A input tanpa label/aria-label', f, l, f'id={i} type={ty}')
    for l, t, mt in p.danger:
        if not mt and 'ui-kit' not in rel: add('P2 ina-btn-danger tanpa modal konfirmasi', f, l, repr(t))
    for l, t in p.badges:
        if len(kata(t)) > 2: add('R7 badge >2 kata', f, l, t)
    if 'ina-sidebar' in txt:
        if p.aria_current == 0: add('R9 sidebar tanpa aria-current=page', f, 0, '')
        norm = []
        for h, t in p.sidebar:
            if h and not h.startswith('#'):
                h = str((f.parent / h).resolve().relative_to(ROOT.resolve()))
            norm.append((h, t))
            if t and len(kata(t)) > 2 and not t.startswith('HSS'): add('R7 label sidebar >2 kata', f, 0, t)
        sidebars[rel] = norm

groups = collections.defaultdict(list)
for k, v in sidebars.items(): groups[json.dumps(v, ensure_ascii=False)].append(k)
if len(groups) > 1:
    base = json.loads(max(groups.items(), key=lambda x: len(x[1]))[0])
    for k, v in groups.items():
        o = json.loads(k)
        if o != base:
            diff = [x for x in o if x not in base][:3]
            for pg in v: add('R9 sidebar berbeda dari mayoritas', ROOT / pg, 0, str(diff))

keras = {k: v for k, v in out.items() if k in KERAS}
show = out if '--all' in sys.argv else keras
print(f'laman: {len(pages)} · sidebar admin identik: {"ya" if len(groups) <= 1 else "TIDAK"} · varian: {sorted(len(v) for v in groups.values())}')
for k, v in sorted(show.items(), key=lambda x: -len(x[1])):
    print(f'\n{len(v):4d}  {k}' + ('' if k in KERAS else '  (lunak)'))
    for f, l, s in v[:8]: print(f'      {f}:{l}  {s}')
    if len(v) > 8: print(f'      … +{len(v) - 8}')
if '--json' in sys.argv:
    json.dump({k: v for k, v in out.items()}, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1, ensure_ascii=False)
tot = sum(len(v) for v in keras.values())
print(f'\n{"OK: tidak ada pelanggaran keras" if not tot else f"{tot} pelanggaran keras"}')
sys.exit(1 if tot else 0)
