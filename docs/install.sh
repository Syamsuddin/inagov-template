#!/usr/bin/env bash
# Pasang idds-ui-pack ke proyek VCBD.
# Jalankan DARI ROOT PROYEK, SEBELUM scaffold.py dijalankan.
#
#   bash .idds/docs/install.sh              # Laravel (default)
#   bash .idds/docs/install.sh --native     # PHP native / struktur bebas
#   bash .idds/docs/install.sh --dry-run
set -euo pipefail

PACK="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # root paket (aset di $PACK/assets, dokumen di $PACK/docs)
ROOT="$(pwd)"
MODE="laravel"; DRY=0
for a in "$@"; do
  case "$a" in
    --native) MODE="native" ;;
    --dry-run) DRY=1 ;;
    -h|--help) sed -n '2,9p' "$0"; exit 0 ;;
    *) echo "argumen tak dikenal: $a" >&2; exit 2 ;;
  esac
done

if [ "$MODE" = "laravel" ]; then
  CSS_DIR="resources/css"; FONT_DIR="public/fonts"; IMG_DIR="public/img"
else
  CSS_DIR="public/assets/css"; FONT_DIR="public/assets/fonts"; IMG_DIR="public/assets/img"
fi

say() { printf '  %s\n' "$*"; }
# run: tanpa eval — argumen diteruskan apa adanya, aman untuk path berspasi
run() { if [ "$DRY" = 1 ]; then say "[dry] $*"; else "$@"; fi; }
# salin bila ada; bila tidak, laporkan (berkas ⬜ di MANIFEST) — jangan gagal diam-diam
salin() { # salin <sumber> <tujuan>
  if [ -f "$1" ]; then run cp "$1" "$2"; say "$2"
  else HILANG="$HILANG ${1#"$PACK"/}"; fi
}
HILANG=""

echo "idds-ui-pack → $ROOT  (mode: $MODE)"

# --- 1. gerbang urutan: scaffold belum boleh jalan ---
if [ -f "docs/00_EXECUTIVE_SUMMARY.md" ] && [ ! -f "docs/26_UI_CONVENTIONS.md" ]; then
  echo "PERINGATAN: scaffold.py sudah jalan tapi docs/26 tidak ada." >&2
  echo "  Pasang tetap dilanjutkan; pastikan _MANIFEST.json menandai ui.enabled=true." >&2
fi
if [ -f "docs/26_UI_CONVENTIONS.md" ]; then
  if grep -q "Status: KERANGKA" "docs/26_UI_CONVENTIONS.md" 2>/dev/null; then
    say "docs/26 berupa stub scaffold — akan DITIMPA oleh versi paket."
  else
    echo "GAGAL: docs/26_UI_CONVENTIONS.md sudah ada dan bukan stub." >&2
    echo "  Timpa manual bila memang diinginkan, atau hapus dulu." >&2
    exit 1
  fi
fi

# --- 2. dokumen 26 ---
run mkdir -p docs
salin "$PACK/docs/26_UI_CONVENTIONS.md" docs/26_UI_CONVENTIONS.md

# --- 3. aset ---
run mkdir -p "$CSS_DIR" "$FONT_DIR" "$IMG_DIR"
salin "$PACK/assets/idds-tokens.css"    "$CSS_DIR/idds-tokens.css"
salin "$PACK/assets/idds-utilities.css" "$CSS_DIR/idds-utilities.css"
salin "$PACK/assets/fonts/inter-latin.woff2" "$FONT_DIR/inter-latin.woff2"
salin "$PACK/assets/img/tabler-sprite-starter.svg" "$IMG_DIR/tabler-sprite.svg"
if [ "$MODE" = "native" ] && [ -f "$CSS_DIR/idds-utilities.css" ] && [ "$DRY" = 0 ]; then
  sed -i.bak "s#url('/fonts/inter-latin.woff2')#url('/assets/fonts/inter-latin.woff2')#" "$CSS_DIR/idds-utilities.css" \
    && rm -f "$CSS_DIR/idds-utilities.css.bak" && say "(path @font-face disesuaikan untuk --native)"
fi
if [ -n "$HILANG" ]; then
  echo "PERINGATAN: berkas berikut tidak ada di paket (impor ulang dari idds-ui-pack asli):" >&2
  for h in $HILANG; do echo "  - $h" >&2; done
fi

# --- 4. .gitignore bila repo publik ---
if [ -d .git ] && ! grep -qs '^\.idds/' .gitignore; then
  say "catatan: repo git terdeteksi. Bila PUBLIK, tambahkan '.idds/' ke .gitignore"
  say "         (dokumen sumber IDDS berlabel internal)."
fi

# --- 5. potongan CLAUDE.md ---
cat <<'SNIP'

--- tempel ke CLAUDE.md, ganti blok "## Antarmuka" bawaan scaffold ---

## Antarmuka  (sumber: docs/26_UI_CONVENTIONS.md)
Jangkar: INA Digital Design System (IDDS) v1.6.x, brand `hss` (#0063a8, disampel dari
logo resmi Kabupaten HSS). Token TERKUNCI di idds-tokens.css — digenerate dari paket
npm resmi + build-brand.py, jangan diedit manual.

Elemen <html> WAJIB memuat: <html lang="id" data-theme="light" data-brand="hss">

Tiga larangan terpenting:
1. Dilarang menulis hex/px/rem langsung. Semua lewat token semantik
   (--ina-content-*, --ina-background-*, --ina-primary-*). Token primitif
   (blue-500, neutral-300) TIDAK boleh dipanggil komponen.
2. `content-tertiary` DILARANG sebagai warna teks (kontras 2,52 — gagal WCAG).
   Button primary = --ina-background-brand + --ina-content-on-primary, BUKAN
   primary-300 + putih literal (putih gagal di inapas/panrb dark). Batas input =
   --ina-stroke-input. Focus: --ina-focus-ring, dilarang outline:none.
3. Latar --ina-accent-yellow (#fff500) WAJIB berpasangan teks gelap, tidak pernah
   putih (kontras 1,15). Nilai yang belum ditetapkan ditulis [ISI: ...], tidak
   pernah ditebak. Breakpoint TIDAK ada di IDDS — lihat docs/26 §10.1.

Rujukan UI (muat hanya saat dibutuhkan):
| Kapan | Baca |
|---|---|
| memilih warna teks | .idds/docs/data/aturan-kontras.json |
| memilih ikon | .idds/docs/data/dosir-ikon-tabler.json (1,5 MB — jangan rutin) |
| menyetel font | .idds/docs/data/dosir-font-inter.json |
| rujukan token penuh | .idds/docs/data/dosir-ui-idds.json |

--- akhir potongan ---
SNIP

echo
echo "Selesai. Langkah berikut:"
echo "  1. pastikan docs/_MANIFEST.json menandai ui.enabled=true"
echo "  2. jalankan scaffold.py (akan MELEWATI docs/26 yang sudah ada — jangan --force)"
echo "  3. isi seluruh [ISI:] di docs/26_UI_CONVENTIONS.md §10"
echo "  4. bash .idds/docs/scripts/verify.sh   (--strict menjelang rilis)"
