#!/usr/bin/env bash
# Verifikasi paket IDDS di dalam proyek: keutuhan berkas + kepatuhan token.
# Jalankan dari root proyek:  bash .idds/docs/scripts/verify.sh
#   --strict   : peringatan kepatuhan (hex/px literal) dihitung sebagai gagal
set -uo pipefail

PACK="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"   # root paket; dokumen & skrip di $PACK/docs
STRICT=0
for a in "$@"; do case "$a" in --strict) STRICT=1 ;; esac; done
FAIL=0; WARN=0
PASS() { printf '[PASS] %s\n' "$*"; }
BAD()  { printf '[FAIL] %s\n' "$*"; FAIL=$((FAIL+1)); }
WRN()  { printf '[WARN] %s\n' "$*"; WARN=$((WARN+1)); }
# WRN yang naik jadi BAD pada --strict
WRNS() { if [ "$STRICT" = 1 ]; then BAD "$@"; else WRN "$@"; fi; }
tampil() { sed 's/^/       /'; }

echo "== 1. Keutuhan paket =="
if command -v python3 >/dev/null && [ -f "$PACK/docs/MANIFEST.json" ]; then
  if ! python3 - "$PACK" <<'PY'
import hashlib, json, os, sys
root = sys.argv[1]
m = json.load(open(os.path.join(root, "docs", "MANIFEST.json"), encoding="utf-8"))
rusak, hilang, dikenal = [], [], []
for b in m["berkas"]:
    if b["path"] == "docs/MANIFEST.json":
        continue
    p = os.path.join(root, b["path"])
    if not os.path.exists(p):
        (dikenal if b.get("status") == "hilang" else hilang).append(b["path"]); continue
    h = hashlib.sha256(open(p, "rb").read()).hexdigest()[:16]
    if h != b["sha256_16"]:
        rusak.append(b["path"])
if hilang:  print("[FAIL] berkas hilang:", ", ".join(hilang))
if dikenal: print("[WARN] berkas belum diimpor dari paket asli (tercatat di MANIFEST):", ", ".join(dikenal))
if rusak:   print("[WARN] berkas berubah dari rilis:", ", ".join(rusak))
if not hilang and not rusak and not dikenal: print("[PASS] semua berkas paket utuh.")
sys.exit(1 if hilang else 0)
PY
  then FAIL=$((FAIL+1)); fi
else
  WRN "python3 atau $PACK/docs/MANIFEST.json tidak tersedia — cek keutuhan dilewati."
fi

echo
echo "== 2. Kontras token =="
if command -v python3 >/dev/null && [ -f "$PACK/docs/scripts/build-kontras.py" ]; then
  if python3 "$PACK/docs/scripts/build-kontras.py" --check | grep -E '^\[(FAIL|WARN)\]' | tampil; then
    :
  fi
  if python3 "$PACK/docs/scripts/build-kontras.py" --check >/dev/null 2>&1; then
    PASS "semua label tombol dan pasangan terikat lolos AA."
  else
    BAD "ada kombinasi brand/tema yang gagal kontras — lihat di atas."
  fi
fi

echo
echo "== 3. Pemasangan di proyek =="
if [ -f docs/26_UI_CONVENTIONS.md ]; then PASS "docs/26_UI_CONVENTIONS.md hadir."
else BAD "docs/26_UI_CONVENTIONS.md tidak ada — jalankan install.sh."; fi

TOKENS="$(find resources public -name idds-tokens.css 2>/dev/null | head -1)"
if [ -n "$TOKENS" ]; then PASS "idds-tokens.css hadir ($TOKENS)."
else BAD "idds-tokens.css tidak ditemukan di resources/ atau public/."; fi

if find . -name 'inter-latin.woff2' -not -path './.idds/*' 2>/dev/null | grep -q .; then
  PASS "font inter-latin.woff2 terpasang."
else WRN "font Inter belum disalin (fallback system-ui aktif)."; fi

if [ -f docs/_MANIFEST.json ] && command -v python3 >/dev/null; then
  python3 -c "
import json,sys
m=json.load(open('docs/_MANIFEST.json'))
ui=(m.get('ui') or {}).get('enabled')
print('[PASS] _MANIFEST.json ui.enabled=true.' if ui else '[FAIL] ui.enabled belum true.')
sys.exit(0 if ui else 1)" 2>/dev/null || FAIL=$((FAIL+1))
else
  WRN "docs/_MANIFEST.json belum ada (normal bila VCBD belum jalan)."
fi

echo
echo "== 4. Slot [ISI:] lapisan proyek =="
if [ -f docs/26_UI_CONVENTIONS.md ]; then
  N=$(grep -c '\[ISI:' docs/26_UI_CONVENTIONS.md || true)
  if [ "$N" -eq 0 ]; then PASS "seluruh [ISI:] sudah terisi."
  else WRN "$N slot [ISI:] masih kosong (§10 lapisan proyek — wajib diisi sebelum koding UI)."; fi
fi

echo
echo "== 5. Kepatuhan token di kode =="
SRC=()
for d in resources/views resources/js resources/css app src public; do [ -d "$d" ] && SRC+=("$d"); done
if [ "${#SRC[@]}" -gt 0 ]; then
  # berkas token/brand/utilities sendiri dikecualikan dari semua cek
  KECUALI='idds-tokens\.css|idds-utilities\.css|brand-[a-z0-9-]+\.css|tabler-sprite'
  cari() { grep -rInE "$1" "${SRC[@]}" 2>/dev/null | grep -vE "$KECUALI" || true; }
  cari_i() { grep -rIniE "$1" "${SRC[@]}" 2>/dev/null | grep -vE "$KECUALI" || true; }

  # a. warna literal: hex 3/4/6/8 digit, rgb(a), hsl(a)
  H=$(cari '#[0-9a-fA-F]{3,4}\b|#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?\b|\b(rgb|hsl)a?\(' | grep -vE 'url\(|href="#|id="|#\{|\$#' | head -20)
  if [ -z "$H" ]; then PASS "tak ada warna literal (hex/rgb/hsl) di kode."
  else WRNS "warna literal ditemukan (harus lewat token):"; echo "$H" | tampil; fi

  # b. ukuran literal px di CSS/atribut style (kecuali 0px dan 1px untuk border hairline)
  X=$(cari '(^|[^-a-z])[0-9]{1,3}(\.[0-9]+)?px\b' | grep -E '\.(css|scss|blade\.php|html|vue|jsx|tsx)|style=' | grep -vE '\b(0|1)px\b' | head -15)
  if [ -z "$X" ]; then PASS "tak ada ukuran px literal (spacing/radius lewat token)."
  else WRNS "px literal ditemukan (pakai --ina-spacing-*/--ina-radius-*/--ina-type-*):"; echo "$X" | tampil; fi

  # c. token primitif dipanggil langsung
  P=$(cari '\-\-ina-(neutral|blue|red|green|yellow|orange|cyan|teal|lime|coral|pink|magenta|violet|purple|lilac|indigo)-[0-9]+' | head -10)
  if [ -z "$P" ]; then PASS "tak ada pemanggilan token primitif."
  else BAD "token primitif dipanggil langsung (pakai token semantik §2.2):"; echo "$P" | tampil; fi

  # d. content-tertiary / content-disabled pada properti teks — tanpa celah kata 'icon'
  T=$(cari 'color:\s*var\(--ina-content-(tertiary|disabled)\)|text-content-(tertiary|disabled)' | head -5)
  if [ -z "$T" ]; then PASS "content-tertiary/disabled tidak dipakai sebagai color teks."
  else BAD "content-tertiary/disabled sebagai color (kontras 2,52) — pakai content-secondary/placeholder:"; echo "$T" | tampil; fi

  # e. primary-300 sebagai latar
  B=$(cari 'primary-300' | head -5)
  if [ -z "$B" ]; then PASS "primary-300 tidak dipakai."
  else BAD "primary-300 terdeteksi — Button primary harus pakai background-brand:"; echo "$B" | tampil; fi

  # f. putih literal di atas latar brand: cek per BERKAS, bukan per baris
  Y=""
  while IFS= read -r f; do
    if grep -qE 'background(-color)?:\s*var\(--ina-(background-brand|primary-primary)\)|bg-brand|bg-primary-primary' "$f" \
       && grep -qE 'color:\s*(#fff\b|#ffffff|white)|text-white' "$f"; then Y="$Y$f"$'\n'; fi
  done < <(grep -rlE 'background-brand|primary-primary' "${SRC[@]}" 2>/dev/null | grep -vE "$KECUALI" || true)
  if [ -z "$Y" ]; then PASS "tak ada putih literal di berkas yang memakai latar brand."
  else BAD "putih literal + latar brand di berkas yang sama — pakai content-on-primary (gagal di inapas/panrb dark):"; printf '%s' "$Y" | tampil; fi

  # g. accent-yellow + putih: per berkas
  Y2=""
  while IFS= read -r f; do
    if grep -qE 'color:\s*(#fff\b|#ffffff|white)|text-white|content-on-primary' "$f"; then Y2="$Y2$f"$'\n'; fi
  done < <(grep -rl 'accent-yellow' "${SRC[@]}" 2>/dev/null | grep -vE "$KECUALI" || true)
  if [ -z "$Y2" ]; then PASS "latar kuning tidak berdampingan dengan teks putih."
  else WRN "accent-yellow dan teks putih di berkas yang sama (kontras 1,15) — pastikan bukan pasangan:"; printf '%s' "$Y2" | tampil; fi

  # h. focus dimatikan tanpa pengganti
  O=$(cari 'outline:\s*(none|0)\b' | grep -v 'focus-ring' | head -5)
  if [ -z "$O" ]; then PASS "tak ada outline:none tanpa focus-ring."
  else BAD "outline:none tanpa --ina-focus-ring (WCAG 2.4.7):"; echo "$O" | tampil; fi

  # i. opacity untuk nonaktif
  OP=$(cari_i '(disabled|nonaktif)[^{]*\{[^}]*opacity|opacity:[^;]*;[^}]*disabled' | head -5)
  if [ -z "$OP" ]; then PASS "keadaan nonaktif tidak memakai opacity."
  else WRN "opacity untuk disabled — pakai background-disabled + content-disabled:"; echo "$OP" | tampil; fi

  # j. z-index di luar token
  Z=$(cari 'z-index:\s*[0-9]+' | head -5)
  if [ -z "$Z" ]; then PASS "tak ada z-index literal."
  else WRNS "z-index literal — pakai --ina-z-*:"; echo "$Z" | tampil; fi

  # k. data-brand pada <html>
  D=$(cari '<html' | head -3)
  if [ -n "$D" ]; then
    if echo "$D" | grep -q 'data-brand'; then PASS "tag <html> memuat data-brand."
    else WRN "tag <html> tanpa data-brand — brand HSS tidak aktif (fallback netral)."; fi
  fi

  # l. justify
  J=$(cari 'text-align:\s*justify|text-justify' | head -5)
  if [ -z "$J" ]; then PASS "tak ada teks justified."
  else BAD "text-align: justify dilarang:"; echo "$J" | tampil; fi
else
  WRN "folder kode tidak ditemukan — cek kepatuhan dilewati."
fi

echo
echo "-- ringkas: $FAIL gagal, $WARN peringatan --"
[ "$FAIL" -eq 0 ] || exit 1
