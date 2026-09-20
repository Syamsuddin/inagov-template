# INSTALL — Memasang idds-ui-pack ke Proyek VCBD

Panduan operasional: langkah, prompt, letak berkas, dan apa yang **tidak** perlu diubah.

---

## Jawaban singkat lebih dulu

**Skill VCBD tidak perlu diubah sama sekali.**

VCBD sudah punya mekanisme yang persis cocok. Di protokol wawancara K9 pertanyaan 1
("Jangkar desain"), opsi (a) berbunyi: *design system/template eksisting — sebut nama +
versi, token diturunkan darinya*. Paket ini adalah jawaban opsi (a) dalam bentuk yang
sudah jadi.

Tiga hal di VCBD yang membuat integrasi ini mulus tanpa modifikasi:

| Mekanisme VCBD | Kenapa cocok |
|---|---|
| `26_UI_CONVENTIONS` sudah jadi slot kondisional untuk proyek ber-UI | paket ini mengisi slot itu |
| `scaffold.py` bersifat **anti-timpa** — berkas yang sudah ada dilewati | taruh `26` lebih dulu, scaffold tidak menyentuhnya |
| `validate.sh` cek #9 hanya memeriksa **konsistensi** `ui.enabled` ↔ keberadaan `docs/26_*.md` | asal flag `true` dan berkasnya ada, LULUS |

Yang berubah bukan skill, melainkan **jawaban Pak Syams saat K9** — dari menggali selera
jadi menunjuk sistem desain yang tokennya sudah terkunci.

---

## Langkah

### Langkah 1 — Siapkan folder proyek

Claude Code bekerja pada folder di disk, bukan unggahan. Sebelum sesi dimulai:

```bash
mkdir -p proyek-simpeg && cd proyek-simpeg
cp -r /path/ke/idds-ui-pack .idds
```

Lalu jalankan pemasang — ia menaruh berkas di tempat yang benar dan punya gerbang
urutan (menolak bila `docs/26` sudah terisi bukan-stub):

```bash
bash .idds/docs/install.sh              # Laravel
bash .idds/docs/install.sh --native     # PHP native / struktur bebas
bash .idds/docs/install.sh --dry-run    # lihat dulu apa yang akan disalin
```

Yang dipasang:

| Dari paket | Ke proyek (Laravel) |
|---|---|
| `docs/26_UI_CONVENTIONS.md` | `docs/26_UI_CONVENTIONS.md` |
| `assets/idds-tokens.css` | `resources/css/` |
| `assets/idds-utilities.css` | `resources/css/` |
| `assets/fonts/inter-latin.woff2` | `public/fonts/` |
| `assets/img/tabler-sprite-starter.svg` | `public/img/tabler-sprite.svg` |

Sisanya tetap di `.idds/` sebagai rujukan yang dimuat seperlunya.

Kalau repo proyek bersifat publik, tambahkan `.idds/` ke `.gitignore` — dokumen sumbernya
berlabel internal.

### Langkah 2 — Jalankan VCBD, jawab K9 dengan menunjuk paket

Prompt pembuka:

```
Susun blueprint VCBD untuk aplikasi SIMPEG BKPSDM HSS.

Deskripsi: sistem informasi kepegawaian untuk mengelola data ASN, riwayat
jabatan, kepangkatan, dan dokumen kepegawaian di lingkungan Pemkab HSS.

Stack: Laravel 12 + MySQL 8 + Blade. Ber-UI.

Untuk K9 (jangkar desain), jangan wawancarai saya soal selera warna atau
tipografi. Jangkarnya opsi (a): INA Digital Design System (IDDS) v1.6.x.
Seluruh token sudah terkunci dan terverifikasi di `.idds/`.

Baca berkas ini sebelum menyentuh K9:
- .idds/docs/26_UI_CONVENTIONS.md   (konvensi lengkap + token)
- .idds/docs/data/aturan-kontras.json    (larangan warna teks — aturan keras)

K9 hanya perlu menggali LAPISAN PROYEK yang ada di §10 dokumen itu:
breakpoint, peta halaman→pola, empat state per halaman, inventaris komponen
+ rumah file, dan bahasa/nada mikroteks. Sisanya sudah terkunci, jangan
digali ulang dan jangan ditawar.
```

Ini penting: tanpa instruksi itu, K9 akan menawarkan preset amannya sendiri dan Pak Syams
akan menjawab pertanyaan yang jawabannya sudah ada di paket.

### Langkah 3 — Sebelum scaffold jalan, pasang `26`

VCBD menulis `_MANIFEST.json` dulu, lalu menjalankan `scaffold.py`. Sisipkan di antaranya:

```
Sebelum menjalankan scaffold.py, salin dulu:

  mkdir -p docs
  cp .idds/docs/26_UI_CONVENTIONS.md docs/26_UI_CONVENTIONS.md

Pastikan _MANIFEST.json menandai ui.enabled=true.

scaffold.py bersifat anti-timpa, jadi ia akan melewati docs/26 yang sudah ada
dan hanya menulis 00–25, INDEX.md, dan kerangka CLAUDE.md. Jangan pakai --force.
```

Urutannya wajib begitu. Kalau scaffold jalan lebih dulu, ia menulis stub `26` dan file kaya
dari paket harus disalin dengan `--force` — bisa, tapi lebih rawan salah.

Verifikasi:

```bash
python3 scripts/scaffold.py --root .   # laporkan: "dilewati (sudah ada): ... 26_UI_CONVENTIONS.md"
bash scripts/validate.sh               # cek #9 harus PASS
```

### Langkah 4 — Isi `[ISI:]` di §10 dan blok Antarmuka `CLAUDE.md`

Scaffold menyisipkan blok ini ke `CLAUDE.md` untuk proyek ber-UI:

```markdown
## Antarmuka  (sumber: docs/26_UI_CONVENTIONS.md)
[ISI: jangkar desain satu kalimat + 3 larangan UI terpenting]
```

Isi dengan:

```markdown
## Antarmuka  (sumber: docs/26_UI_CONVENTIONS.md)
Jangkar: INA Digital Design System (IDDS) v1.6.x — token TERKUNCI di
resources/css/idds-tokens.css, digenerate dari paket npm resmi.

Tiga larangan terpenting:
1. Dilarang menulis hex/px/rem langsung. Semua lewat token semantik
   (--ina-content-*, --ina-background-*, --ina-primary-*). Token primitif
   (blue-500, neutral-300) TIDAK boleh dipanggil komponen.
2. `content-tertiary` DILARANG sebagai warna teks (kontras 2,52 — gagal WCAG).
   Button primary = --ina-background-brand + --ina-content-on-primary, BUKAN
   primary-300 + putih literal. Batas input = --ina-stroke-input.
3. Nilai yang belum ditetapkan ditulis [ISI: ...], tidak pernah ditebak.
   Breakpoint TIDAK ada di IDDS — lihat docs/26 §10.1.
```

Lalu isi seluruh `[ISI:]` di `docs/26_UI_CONVENTIONS.md` §10 — itu lapisan proyek yang
memang harus digali per aplikasi.

### Langkah 5 — Pasang aset

```bash
mkdir -p resources/css public/fonts public/img
cp .idds/assets/idds-tokens.css .idds/assets/idds-utilities.css resources/css/
cp .idds/assets/fonts/inter-latin.woff2 public/fonts/
cp .idds/assets/img/tabler-sprite-starter.svg public/img/tabler-sprite.svg
```

Font sudah jadi (75,6 KB, seluruh bobot 100–900). Untuk `--native`, ganti path di
`@font-face` `idds-utilities.css` menjadi `/assets/fonts/inter-latin.woff2`. Sprite starter
berisi 91 ikon untuk aplikasi kepegawaian. Kalau kurang, bangun ulang:

```bash
# tambah ikon spesifik
python3 .idds/docs/scripts/build-sprite.py --src /path/tabler-icons-main \
  --out public/img/tabler-sprite.svg --icons user,home,file-text,chart-bar

# atau pindai kode untuk ikon yang benar-benar dipakai
python3 .idds/docs/scripts/build-sprite.py --src /path/tabler-icons-main \
  --out public/img/tabler-sprite.svg --from-code resources/views
```

Mode `--from-code` berguna menjelang rilis: sprite menyusut jadi hanya ikon yang nyata
dipanggil, dan nama yang salah ketik akan dilaporkan sebagai "TIDAK ADA".

### Langkah 6 — Tambahkan rute ke `INDEX.md`

`INDEX.md` adalah keluaran final scaffold dan **tidak diedit** menurut aturan VCBD. Jadi
rute UI tambahan ditempel di `CLAUDE.md` saja, di bawah blok Antarmuka:

```markdown
Rujukan UI tambahan (muat hanya saat dibutuhkan):
| Kapan | Baca |
|---|---|
| memilih warna teks | .idds/docs/data/aturan-kontras.json |
| memilih ikon | .idds/docs/data/dosir-ikon-tabler.json (1,5 MB — jangan dimuat rutin) |
| menyetel font | .idds/docs/data/dosir-font-inter.json |
| rujukan token penuh | .idds/docs/data/dosir-ui-idds.json |
```

Catatan biaya: `dosir-ikon-tabler.json` berukuran 1,5 MB. Kalau dimuat setiap task, itu
membakar token tanpa guna. Sebutkan eksplisit bahwa ia hanya dibuka saat memilih ikon.

### Langkah 7 — Lanjut ke `coding-vcbd`

Setelah blueprint jadi, fase koding memakai skill `coding-vcbd` seperti biasa. Tambahkan
satu kalimat di prompt pertama:

```
Sebelum menulis komponen atau CSS apa pun, baca docs/26_UI_CONVENTIONS.md.
Checklist Definition of Done UI ada di §11 — sebuah layar belum selesai
sampai seluruh butirnya terpenuhi, termasuk empat state.
```

---

## Dua titik gesekan yang perlu diputuskan di depan

**1. Kalau proyek memakai Falcon/Bootstrap, jangkarnya bukan IDDS.**
Menumpuk dua sistem desain di satu berkas CSS selalu berakhir dengan perang specificity.
Pilih satu per aplikasi: kalau Falcon, jangkar K9 adalah Falcon dan paket ini tidak dipakai;
kalau IDDS, Falcon tidak diikutkan. Jangan mencampur "pakai Falcon tapi warnanya IDDS" —
itu menghasilkan komponen yang setengah patuh dan tidak bisa diaudit.

**2. Brand HSS sudah terisi — pastikan dipakai.**
`[data-brand="hss"]` sudah ada di `idds-tokens.css`, disampel dari logo resmi. Supaya aktif,
elemen `<html>` wajib memuat atributnya:

```html
<html lang="id" data-theme="light" data-brand="hss">
```

Tanpa `data-brand`, `primary-*` jatuh ke fallback ramp netral di `:root` (`primary-primary` =
`#141414`, ditambahkan 1.3.0) — tetap valid dan lolos kontras, hanya tidak beridentitas HSS.

---

## Kalau mau lebih permanen: bungkus jadi skill sendiri

Menyalin `.idds/` per proyek bekerja, tapi berulang. Alternatifnya, jadikan paket ini skill
terpisah — misal `idds-ui` — dengan `SKILL.md` yang memuat §1–§9 dan merujuk `data/` untuk
detail. Deskripsi pemicunya kira-kira:

> Dipakai setiap kali menyusun atau mengoding antarmuka aplikasi pemerintah yang memakai
> INA Digital Design System. Menyediakan token terkunci, aturan kontras WCAG terhitung,
> indeks 6.184 ikon Tabler, dan metrik font Inter. Pemicu: "pakai IDDS", "INA Digital
> Design System", "desain sesuai standar INA Digital", atau saat K9 VCBD menetapkan
> jangkar desain ke IDDS.

Keuntungannya: satu sumber, semua proyek ikut terbarui saat IDDS naik versi. Kerugiannya:
skill dimuat berdasarkan deskripsi, jadi harus disebut atau terdeteksi — sedangkan `.idds/`
di folder proyek selalu ada. Untuk sekarang, cara folder lebih dapat diandalkan; kalau nanti
sudah ada tiga atau empat proyek IDDS, barulah konversi ke skill terbayar.

---

## Ringkasan berkas

| Berkas | Letak di proyek | Wajib? |
|---|---|---|
| `docs/26_UI_CONVENTIONS.md` | `docs/` | ✅ inti |
| `idds-tokens.css` | `resources/css/` | ✅ inti |
| `idds-utilities.css` | `resources/css/` | ✅ inti |
| `inter-latin.woff2` | `public/fonts/` | ✅ |
| `tabler-sprite-starter.svg` | `public/img/` | ✅ |
| `aturan-kontras.json` | `.idds/docs/data/` | ✅ dibaca saat memilih warna — digenerate `build-kontras.py` |
| `build-kontras.py` | `.idds/docs/scripts/` | setiap kali token warna berubah (`--check` sebagai gerbang CI) |
| `dosir-ui-idds.json` | `.idds/docs/data/` | rujukan |
| `dosir-ikon-tabler.json` | `.idds/docs/data/` | rujukan, muat seperlunya |
| `dosir-font-inter.json` | `.idds/docs/data/` | rujukan |
| `dosir-kontras-idds.json` | `.idds/docs/data/` | rujukan |
| `build-sprite.py` | `.idds/docs/scripts/` | saat menambah ikon |
