# 26_UI_CONVENTIONS — INA Digital Design System (IDDS)

> **Status:** TERKUNCI. Dokumen ini adalah sumber kebenaran UI untuk proyek ini.
> Token tidak boleh dikarang. Setiap nilai warna, jarak, radius, ukuran teks, dan
> ketebalan ikon **wajib** berasal dari `assets/idds-tokens.css`.
> Bila sebuah nilai tidak ada di token, tulis `[ISI: <apa yang dibutuhkan>]` dan hentikan —
> jangan mengarang angka.

**Sumber:** Dokumentasi IDDS (PDF, Oktober 2025, 176 hal.) · `design.inadigital.go.id` ·
paket npm `@idds/styles` 1.6.36 & `@idds/react` 1.6.61 · Tabler Icons 3.46.0 · Inter 4.001
**Rujukan mesin:** `data/dosir-ui-idds.json`, `data/aturan-kontras.json` (digenerate `scripts/build-kontras.py`)
**Versi paket:** 1.3.1 (audit 19 Sep 2026 terhadap seluruh laman design.inadigital.go.id + `@idds/styles` 1.6.36)

---

## 0. Hierarki Kebenaran

Bila sumber bertentangan, urutan menang:

1. **`assets/idds-tokens.css`** — digenerate dari paket npm, inilah yang benar-benar dirender.
2. **`data/dosir-ui-idds.json`** — kontrak mesin, isi sama dengan nomor 1.
3. **PDF Dokumentasi IDDS (Okt 2025)** — benar untuk *aturan dan narasi*, tetapi **beberapa angkanya sudah usang** (lihat §9).
4. **Figma UI Kit 1.0.0** — alat komunikasi desain, bukan sumber angka.

Dua label provenans dipakai di seluruh paket: **[NPM]** = nilai dari `@idds/styles`, tidak
boleh diubah; **[TURUNAN]** = nilai yang ditetapkan paket ini karena IDDS tidak menyediakannya
(semantik tambahan, `content-on-primary`, shadow, focus, weight, motion, z-index). Nilai
[TURUNAN] boleh diubah — **di token**, tidak pernah di komponen — dan setiap perubahan warna
wajib diikuti `python3 scripts/build-kontras.py --check`.

Satu pengecualian penting: **angka kontras yang tercetak di PDF tidak boleh dipakai.**
Lihat §5 — nilainya placeholder. Pakai `data/aturan-kontras.json`.

---

## 1. Prinsip (dari PDF hal. 9)

Lima prinsip yang jadi alasan di balik aturan teknis di bawah:

1. **Konsisten dan mudah dikenali** — pola yang sama di seluruh produk pemerintah.
2. **Desain yang memberi kepastian** — pengguna merasa aman dan tetap punya kendali.
3. **Mewakili pengguna kepada pemangku kepentingan** — mulai dari kebutuhan pengguna.
4. **Buat hal kompleks jadi sederhana** — singkirkan gangguan, tajamkan makna.
5. **Desain yang merangkul semua** — aksesibilitas bukan tambahan.

Implikasi praktis untuk agen koding: bila ada dua cara menyusun layar, pilih yang lebih
sedikit keputusannya bagi pengguna. Antarmuka layanan publik dipakai orang yang tidak
punya pilihan untuk berhenti memakainya.

---

## 2. Arsitektur Token — aturan keras

```
PRIMITIF   --ina-blue-500: #0968f6          ← jangan dipanggil komponen
   ↓
SEMANTIK   --ina-content-guide: var(--ina-blue-500)   ← INI yang dipanggil
   ↓
UTILITY    .text-content-guide / class Tailwind
```

**Aturan:** komponen **hanya** boleh memanggil token semantik atau token brand.
Memanggil primitif langsung (`bg-blue-500`, `#0968f6`) mematahkan dark mode dan brand
switching di titik itu, dan kerusakannya tidak terlihat sampai ada yang menyalakan mode gelap.

Mekanisme tema: atribut pada `<html>`.

```html
<html data-theme="light" data-brand="panrb">
```

`data-theme`: `light` | `dark` · `data-brand`: `inagov` | `panrb` | `bkn` | `lan` | `bgn` | `inapas` | `inaku` (resmi IDDS) · `hss` (daerah, §2.1)
Tanpa `data-brand`, `primary-*` jatuh ke ramp netral (`primary-primary` = `#141414`) — lolos
kontras, tanpa identitas. Brand daerah lain dibuat dengan `scripts/build-brand.py`, bukan tulis tangan.

### 2.1 Brand daerah — `hss` [TERVALIDASI]

`data-brand="hss"` sudah terpasang di `idds-tokens.css`. Seluruh hex **disampel dari
berkas logo resmi Kabupaten HSS**, bukan ditafsirkan dari deskripsi verbal.

| Butir | Nilai | Bukti |
|---|---|---|
| `primary-primary` | `#0063a8` | warna perisai — 54,7% piksel logo |
| Kontras terhadap teks putih | **6.27** (AA) | layak Button primary |
| `accent-yellow` | `#fff500` | kuning pita & padi — 10,6% piksel |
| Dark mode `primary-primary` | **`primary-500`** `#2172b5` | label putih 5,07 (AA) · vs latar gelap 3,63 (≥3). `primary-400` ditolak: label putih hanya 3,61 |
| Metode ramp | OKLCH, profil lightness = median brand resmi IDDS | |
| Aturan pemetaan dark | langkah terdekat ke warna dasar yang **≥4,5 vs `content-on-primary` DAN ≥3 vs latar gelap** | `data/aturan-kontras.json` → `tombol_primary.hss` |

| Langkah | Hex | Kontras vs putih | Vonis |
|---|---|---:|---|
| `primary-25` | `#eff7ff` | 1.08 | GAGAL |
| `primary-50` | `#dbedff` | 1.2 | GAGAL |
| `primary-100` | `#bbddff` | 1.41 | GAGAL |
| `primary-200` | `#8fc7ff` | 1.78 | GAGAL |
| `primary-300` | `#54a1e9` | 2.74 | GAGAL |
| `primary-400` | `#3a8bd3` | 3.61 | AA-large |
| `primary-500` | `#2172b5` | 5.07 | AA |
| `primary-600` | `#055691` | 7.65 | AAA |
| `primary-700` | `#004578` | 9.89 | AAA |
| `primary-800` | `#003b68` | 11.5 | AAA |
| `primary-900` | `#002241` | 16.09 | AAA |

**Warna pendukung dari logo** (bukan bagian ramp; pakai sebagai token terpisah bila perlu):

| Peran | Hex | Catatan kontras |
|---|---|---|
| Hijau daun kapas | `#00923f` | 4,05 vs putih — teks besar saja |
| Biru terang (pintu) | `#0075ba` | 4,94 vs putih — AA |
| Biru gelap (atap) | `#004a92` | 8,77 vs putih — AAA |
| Kuning emas (gagang) | `#f8c300` | 1,64 vs putih — **jangan pakai teks putih** |

> ⚠️ **Aturan keras untuk kuning.** `accent-yellow` `#fff500` hanya 1,15:1
> terhadap teks putih — praktis tidak terbaca. Terhadap teks gelap `#1f1a17` ia 15,03:1.
> Jadi: latar kuning **wajib** berpasangan dengan teks gelap, tidak pernah putih.

> ℹ️ **Catatan provenans.** Deskripsi lambang menyebut warnanya "biru tua", tetapi artwork
> resminya `#0063a8` — biru sedang, bukan navy. Untuk keperluan digital, **artwork yang
> menang**: itu yang benar-benar dilihat orang. Perlu diketahui pula bahwa HSS belum
> memiliki Perda lambang daerah (Raperda diajukan September 2026), sehingga nilai ini bisa
> berubah bila Perda menetapkan spesifikasi warna yang berbeda.
>
> Bila berubah, regenerasi — jangan sunting tangan:
> ```
> python3 scripts/build-brand.py --hex "#BARU" --name hss --label "Pemkab HSS" \
>   --accent "#BARU2" --status TERVALIDASI \
>   --out-css assets/brand-hss.css --out-json data/brand-hss.json
> ```

---

### Token semantik inti

| Token | Light | Dark | Peran |
|---|---|---|---|
| `background-primary` | `#ffffff` | `#141414` | kanvas utama |
| `background-secondary` | `#f8f8f7` | `#1f1f1f` | kartu, panel |
| `background-tertiary` | `#f2f2f2` | `#404040` | hover, area pasif |
| `background-overlay` | `#1f1f1f7a` | `#1f1f1f7a` | latar modal |
| `content-primary` | `#1f1f1f` | `#ffffff` | teks utama |
| `content-secondary` | `#525252` | `#a3a3a3` | teks pendukung |
| `content-tertiary` | `#a3a3a3` | `#737373` | ⚠️ lihat §5 |
| `content-guide` | `#0968f6` | `#4d93fc` | tautan, info |
| `content-negative` | `#f02d2d` | `#ff5c5c` | error |
| `content-positive` | `#288034` | `#3cc14e` | sukses |
| `stroke-primary` | `#e5e5e5` | `#404040` | garis halus |
| `stroke-secondary` | `#a3a3a3` | `#a3a3a3` | garis tegas |
| `stroke-tertiary` | `#1f1f1f` | `#e5e5e5` | kontras tinggi |

### 2.2 Token semantik tambahan — [TURUNAN]

13 token inti [NPM] di atas tidak cukup untuk 51 komponen: tidak ada warna label tombol,
latar status, batas input yang lolos 3:1, atau focus ring. Tanpa tabel ini agen terpaksa
memanggil primitif — yang dilarang §2. Semua nilai dihitung di `data/aturan-kontras.json`.

| Token | Light | Dark | Peran · rasio vs `background-primary` |
|---|---|---|---|
| `content-on-primary` | `#ffffff` | `#ffffff`* | label di atas `background-brand` — *inapas & panrb dark memakai `#141414` (putih gagal) |
| `content-negative-strong` | `red-600` `#d50b0b` | `red-400` `#ff5c5c` | **pesan error ukuran body** (5,41 / 6,09); `content-negative` light hanya 4,10 |
| `content-warning` | `yellow-600` `#855f00` | `yellow-400` `#ffcc14` | teks peringatan (5,78 / 12,19) |
| `content-placeholder` | `neutral-500` `#737373` | `neutral-400` `#a3a3a3` | placeholder input (4,74 / 7,30) — bukan `content-tertiary` |
| `content-disabled` | `neutral-400` | `neutral-500` | elemen nonaktif; **bukan teks informatif** |
| `content-inverse` | `neutral-25` | `neutral-800` | teks di atas `background-inverse` |
| `background-brand` | `primary-primary` | `primary-primary` | tombol primary, header brand |
| `background-brand-hover` | `primary-600` | `primary-600`* | *inapas & panrb dark → `primary-300`; label tetap ≥4,5 di semua brand |
| `background-brand-subtle` | `primary-50` | `primary-900` | baris terpilih, chip brand |
| `background-guide-subtle` | `blue-100` | `blue-800` | Alert info |
| `background-positive-subtle` | `green-100` | `green-800` | Alert success, Badge soft |
| `background-negative-subtle` | `red-100` | `red-800` | Alert critical |
| `background-warning-subtle` | `yellow-100` | `yellow-800` | Alert caution |
| `background-disabled` | `neutral-100` | `neutral-700` | input/tombol nonaktif |
| `background-inverse` | `neutral-800` | `neutral-100` | tooltip, toast |
| `stroke-input` | `neutral-500` `#737373` | `neutral-400` `#a3a3a3` | **batas input & kontrol** (4,74 / 7,30 — ≥3:1) |
| `stroke-focus` | `blue-500` | `blue-400` | cincin fokus (4,86 / 6,05) |
| `stroke-brand` | `primary-primary` | `primary-primary` | tombol secondary, tab aktif |
| `stroke-guide` / `-positive` / `-negative` / `-warning` | ramp `500`/`600` | ramp `400`/`500` | batas Alert, input status |

Teks status (`content-positive/negative/guide`) di atas **latarnya sendiri** (`*-subtle`)
selalu lolos AA. Di atas `background-tertiary` atau `background-disabled` beberapa turun ke
AA-large (mis. `content-guide` light 4,34) — jangan taruh teks berwarna ukuran body di sana.

### Alias semantik ramp

`guide-*` → blue · `positive-*` → green · `negative-*` → red · `warning-*` → **yellow**

> ⚠️ Berkas sumber menulis `warning` sebagai "alias for orange", padahal nilainya ramp
> **yellow** (`warning-500` = `#eebb04`). Pakai `warning-*` apa adanya; jangan menyamakannya
> dengan `orange-*`.

---

## 3. Tipografi

Font: **Inter** (variable, `opsz` 14–32, `wght` 100–900, SIL OFL). Self-host WOFF2 subset Latin.
Deklarasi `@font-face` sudah disiapkan di `assets/idds-utilities.css`.

| Kelas | Size | Line height | Letter spacing |
|---|---:|---:|---|
| `.ina-display-large` | 52 | 56 | −2% |
| `.ina-display-small` | 44 | 48 | −2% |
| `.ina-h1` | 40 | 48 | 0 |
| `.ina-h2` | 36 | 44 | 0 |
| `.ina-h3` | 32 | 40 | 0 |
| `.ina-h4` | 28 | 36 | 0 |
| `.ina-h5` | 24 | 32 | 0 |
| `.ina-body-large` | 20 | 28 | 0 |
| `.ina-body` | 18 | 26 | 0 |
| `.ina-body-small` | 16 | 24 | 0 |
| `.ina-caption` | 14 | 20 | 0 |
| `.ina-caption-small` | 12 | 16 | 0 |
| `.ina-caption-extra-small` | 10 | 12 | 0 |

**Body = 18px, bukan 16px.** Jangan dikecilkan — layanan publik melayani rentang usia lebar.

**Ketebalan [TURUNAN]** — IDDS tidak menetapkan angka bobot per kelas; paket ini mengunci:
`--ina-weight-heading` 600 (display, h1–h5) · `--ina-weight-body` 400 · `--ina-weight-label` 500
(tombol, label form, tab). Ubah di token bila PDF/Figma menetapkan lain; jangan tulis `font-weight: 700` di komponen.

**Kapitalisasi:** Title Case untuk judul halaman dan nama fitur; **Sentence case** untuk label
tombol, pesan sistem, dan form field; ALL CAPS hanya untuk singkatan resmi.
**Alignment:** kiri atau tengah. **Jangan pernah `text-align: justify`.** Panjang baris 50–60 karakter.

**Angka pada tabel dan kode identitas** (NIP, NIK, nomor SK, nominal) wajib memakai `.ina-tabular`
(`tabular-nums` + `slashed-zero`). Tanpa itu kolom angka bergoyang dan `0` mudah tertukar dengan `O`.
Jangan pakai pada prosa.

---

## 4. Spacing, Radius, Efek

**Spacing** — token [NPM], nama & nilai persis `@idds/styles` (skala rem, `--ina-spacing-0` … `-24`,
termasuk setengah langkah). **Keputusan 19 Sep 2026: sumber INAgov asli menang atas nama laman Foundation.**
Skala desain Foundation (`0 · 2 · 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 56 · 64 · 80` px) tetap satu-satunya
yang boleh dipakai komponen; petakan ke nama npm:

| px | 0 | 2 | 4 | 8 | 12 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 80 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| token | `-0` | `-0-5` | `-1` | `-2` | `-3` | `-4` | `-6` | `-8` | `-10` | `-12` | `-14` | `-16` | `-20` |

Setengah langkah lain (`-1-5` 6px, `-2-5` 10px, `-5` 20px, `-9` 36px, …) ada di token karena npm
mendefinisikannya, tetapi **jangan dipakai** — di luar skala Foundation. 128px tidak punya token npm.
Kelas utilitas paket mengikuti angka npm: `.ina-gap-2` = 8px, `.ina-mt-4` = 16px, `.ina-p-0`.
Jarak di dalam komponen bermain di 4–16 (`-1`…`-4`); jarak antar-seksi 24 (`-6`) ke atas.

**Radius:** `sm` 2 · `base` 4 · `md` 6 · `lg` 8 · `xl` 12 · `2xl` 16 · `full` 9999px

**Efek (PDF hal. 32):** dua kategori bayangan.

| Token | Karakter | Dipakai pada |
|---|---|---|
| `Shadow-Focused` | rapat dan jelas | kartu utama, elemen penting |
| `Shadow-Float` | menyebar dan ringan | card melayang, modal, dropdown |

Token [NPM] (`base.css` 1.6.36 — ternyata bukan hanya `shadow-sm`): `--ina-shadow-sm` · `-base` ·
`-md` · `-lg` · `-xl`, semua memakai `rgba(var(--ina-shadow-color), α)`.
Pemetaan paket: **`--ina-shadow-focused` = `shadow-sm`** (npm memakainya untuk tabel & kartu) dan
**`--ina-shadow-float` = `shadow-xl`** (npm memakainya untuk `.ina-modal__dialog` dan
`.ina-drawer__panel`). Komponen memanggil dua alias itu, bukan `shadow-md/lg/xl` langsung:
Focused → kartu, tombol, tabel; Float → modal, dropdown, tooltip, toast.

**Radius per komponen (npm, mengikat):** tombol `lg` 8 (`sm` → `md` 6) · text field/text area `lg` ·
alert `lg` · card `lg` · toast `lg` · modal `xl` 12 · tooltip `md` 6 · checkbox `base` 4 ·
avatar persegi 8. Radius `base` 4 **bukan** default tombol/input.

**Focus ring [TURUNAN]** — WCAG 2.4.7/2.4.11. `--ina-focus-ring` = cincin ganda
(`2px background-primary` + `2px stroke-focus`) agar terlihat di latar apa pun. Sudah dipasang
di `idds-utilities.css` untuk `:focus-visible` semua elemen interaktif. **Dilarang `outline: none`
tanpa pengganti.**

**Motion [TURUNAN]** — `--ina-duration-fast` 100ms (hover/focus) · `base` 200ms (dropdown, toast)
· `slow` 300ms (modal, drawer) · `--ina-easing-standard` `cubic-bezier(0.2,0,0,1)`.
`prefers-reduced-motion: reduce` mematikan semuanya (sudah di utilities).

**Z-index [TURUNAN]** — `dropdown` 1000 · `sticky` 1100 · `drawer` 1200 · `overlay` 1300 ·
`modal` 1400 · `toast` 1500. Tidak ada `z-index` di luar enam ini.

**Overlay (PDF hal. 29–31):** dua fungsi — *focusing* (meredupkan latar agar fokus ke konten aktif)
dan *blocking* (mengunci interaksi selama proses berjalan, mis. loading). Gunakan
`background-overlay` `#1f1f1f7a`.

---

## 5. Aksesibilitas — aturan keras, bukan anjuran

Dihitung ulang dengan rumus WCAG 2.1 dari token di `idds-tokens.css`.
Rincian penuh: `data/aturan-kontras.json`.

### Pasangan yang DILARANG untuk teks

| Mode | Pasangan | Rasio | Vonis |
|---|---|---:|---|
| light | `content-tertiary` on `background-primary` | **2,52** | GAGAL |
| light | `content-tertiary` on `background-secondary` | **2,37** | GAGAL |
| light | `content-tertiary` on `background-tertiary` | **2,25** | GAGAL |
| dark | `content-tertiary` on `background-tertiary` | **2,19** | GAGAL |

`content-tertiary` **bukan warna teks**. Gunakan hanya untuk placeholder non-esensial, ikon
dekoratif, atau elemen disabled — dan pastikan informasinya tidak hilang bila tidak terbaca.
Untuk teks pendukung yang harus terbaca, pakai `content-secondary` (7,81 light / 7,30 dark — AAA).

### Hanya boleh untuk teks besar (≥24px, atau ≥19px bold)

| Mode | Pasangan | Rasio |
|---|---|---:|
| light | `content-negative` on `background-primary` | 4,10 |
| dark | `content-tertiary` on `background-primary` | 3,89 |

Pesan error di ukuran body **tidak lolos** dengan `content-negative` di light mode —
pakai **`content-negative-strong`** (`red-600`, 5,41). `content-negative` tetap untuk ikon dan
teks besar. Apa pun warnanya, perkuat dengan ikon + label teks, jangan mengandalkan warna saja.

### Label tombol primary — pakai `content-on-primary`, jangan tulis putih

Putih di atas `primary-primary` lolos AA di semua brand pada light mode, tetapi **gagal di dark
mode untuk inapas (4,00) dan panrb (3,79)** — di sana token berganti ke `#141414`. Komponen
yang menulis `color: #fff` atau `text-white` di atas `background-brand` rusak di dua brand itu
tanpa terlihat. Tabel penuh 8 brand × 2 tema: `data/aturan-kontras.json` → `tombol_primary`.
Satu catatan npm: `lan` dark, tombol vs latar 2,98 (<3) — label lolos, batas tidak; biarkan,
itu nilai resmi.

### Button primary — jangan pakai `primary-300`

Dokumentasi `@idds/react` menyebut Button primary memakai `primary-300` sebagai background
dengan teks putih. Dihitung ulang, itu gagal pada 6 dari 7 brand:

| Brand | `primary-300` | Teks putih | Vonis |
|---|---|---:|---|
| bgn | `#3eb8ff` | 2,21 | GAGAL |
| bkn | `#f96da7` | 2,70 | GAGAL |
| panrb | `#ed7c7e` | 2,70 | GAGAL |
| inagov | `#629cef` | 2,79 | GAGAL |
| lan | `#5b9bd5` | 2,96 | GAGAL |
| inapas | `#ff5f42` | 3,01 | AA-large saja |
| inaku | `#3a78c1` | 4,53 | AA |

**Aturan proyek ini:** background Button primary memakai `--ina-primary-primary`
(atau `primary-500`/`600`), bukan `primary-300`.

### Aman dipakai (AA ke atas, teks normal)

`content-primary` (16,48 / 18,42) · `content-secondary` (7,81 / 7,30) ·
`content-guide` (4,86 / 6,05) · `content-positive` (4,97 / 7,83) ·
`content-negative` dark (6,09)

Batas dan komponen UI butuh ≥3:1. `stroke-primary` di atas `background-primary` hanya
**1,26** dan `stroke-secondary` **2,52** — keduanya **garis dekoratif** (pemisah baris, kartu),
bukan pembatas yang membawa makna. Untuk batas input, checkbox, dan kontrol yang harus terlihat,
pakai **`stroke-input`** (4,74 light / 7,30 dark).

---

## 6. Ikonografi

Pustaka: **Tabler Icons** 3.46.0 (MIT, 6.184 ikon). Indeks: `data/dosir-ikon-tabler.json`.

Ketebalan garis **resmi** (PDF hal. 26–27):

| Ukuran render | Stroke |
|---:|---:|
| 24px | **2px** |
| 20px | **1.5px** |
| 16px / 14px / 12px | **1.25px** |
| 64px (empty state) | **5px** |

Ukuran utama: **24px/2px** dan **20px/1.5px**. Pasangan dengan Button:
`2xl`/`xl` → 24px · `lg`/`md` → 20px · `sm` → 16px.

Aturan pakai (PDF hal. 28):
- Satu warna per ikon. Jangan multi-warna.
- Jangan memodifikasi bentuk ikon.
- Jangan mencampur ikon dari pustaka lain.
- Jangan mencampur gaya outline dan filled dalam satu baris.

Ikon mewarisi `currentColor`, jadi token warna bekerja langsung tanpa prop terpisah.
Ikon dekoratif wajib `aria-hidden="true"`; ikon yang membawa makna wajib punya label teks.

---

## 7. Komponen — kontrak varian

51 komponen tersedia. Varian yang sudah pasti:

**Button** — `hierarchy`: `primary` | `secondary` | `tertiary` | `link`

| `size` | Tinggi | Font | Padding | Ikon |
|---|---:|---:|---|---:|
| `2xl` | 56 | 16 | 16 | 24 |
| `xl` | 48 | 16 | 12 16 | 24 |
| `lg` | 44 | 14 | 12 | 20 |
| `md` | 40 | 14 | 10 12 | 20 |
| `sm` | 32 | 12 | 8 | 16 |

| `hierarchy` (npm `.ina-button--*`) | Latar | Garis | Label |
|---|---|---|---|
| `primary` | `background-brand` | — | `content-on-primary` |
| `secondary` | `background-primary` | netral (`stroke-input`; npm `stroke-primary`) | `content-primary` |
| `tertiary` | transparan | **tidak ada** | `content-primary` |
| `link` | transparan | — | `content-guide` |

Secondary **bukan** garis brand dan tertiary **bukan** garis netral — itu kesalahan paket ≤1.3.0.
Padding horizontal (npm): `2xl`/`xl` 16 · `lg`/`md` 12 · `sm` 8. Hover primary `background-brand-hover`,
fokus `--ina-focus-ring`, nonaktif `background-disabled` + `content-disabled` (**bukan `opacity`**).

**Satu primary button per layar.** Tidak pernah dua primary dalam satu dialog.
Label memakai kata kerja jelas, Sentence case, sependek mungkin.

| Komponen | Sumbu varian |
|---|---|
| TextField | `status`: neutral/error/warning/success · tinggi **S 40 · M 44 · L 48 · XL 56** (paket: `.ina-input` = S, `-md/-lg/-xl`) |
| TextArea | tinggi **S 132 · M 148 · L 164 · XL 180** (`.ina-textarea` = S, `-md/-lg/-xl`) |
| Chip | filled/outline · tinggi **M 36 · S 24** |
| Avatar | **hanya** ukuran resmi npm **16 · 24 · 32 · 40 · 48** (`.ina-avatar-2xs/-xs/-sm/(default)/-lg`); xl/2xl dihapus 19 Sep 2026 — hero profil pun memakai 48 |
| Checkbox | kotak **20 px**, radius `base` |
| Toast | neutral/positive/error · **satu toast aktif** dalam satu waktu · latar `background-primary` + garis |
| Modal | `alert` (1 aksi, tak bisa ditutup) / `confirm` (2 aksi) / `task` (bisa ditutup) · lebar **sm 480 · md 640 · lg 800 · xl 1000** |
| Drawer | panel desktop lebar **420–520** · bottom sheet mobile tinggi min 280–320, maks 90 vh |
| Pagination | `default` (tanpa baris-per-halaman) / `tabel` (dropdown "Baris per halaman" + "Halaman 1 dari N") · tampil bila >20 item · tabel default **30 baris** |
| Table Cell | tinggi default **40**, maks 80 · padding 8 · aksi ikon 20 px jarak 16, maks 3 · tombol sel = `sm` 32, maks 2 · angka rata kanan |
| Breadcrumb | maks **4** tautan (sisanya ke dropdown) · elipsis bila >24 karakter · tautan pertama & terakhir selalu tampak |
| Tab Menu | label maks **32 karakter**, satu baris |
| Sidebar | label menu maks **2 kata** · hierarki maks 2 level · punya keadaan collapse |
| Navbar | logo kiri · 4–5 menu utama |
| Badge | teks 1–2 kata · bukan elemen interaktif |
| Loading | spinner <3 detik; lebih lama → skeleton/progress bar; progress bar harus progres nyata |
| Alert | `variant`: neutral/info/success/caution/critical |
| Badge | `type`: soft/fill · `variant`: brand/info/warning/success/error/neutral · `size`: sm/md/lg/xl · `rounded`: sm/md/lg/full |
| Card | `variant`: basic/horizontal/overlay · `mediaPosition`: top/bottom/left/right |

> ⚠️ Penamaan status tidak selaras: Alert memakai `caution`/`critical`, Badge memakai
> `warning`/`error` untuk keadaan yang sama. Bila proyek ini membuat lapisan abstraksi,
> **normalkan ke satu istilah** dan dokumentasikan.

**Modal** (PDF hal. 87): lebar 480px · tinggi header 56px · lebar konten 392px ·
padding 24px · jarak antar elemen 16px · jarak tombol 24px.

**Card Content** (PDF hal. 54): padding 24px · jarak judul ke aksi 16px · jarak antar kartu 24px.

**Table** (PDF hal. 166): padding sel 8px · kolom aksi di paling kanan · kolom nama di kolom pertama.

---

## 8. Pola Siap Pakai

16 pola terdokumentasi. Yang paling relevan untuk aplikasi kepegawaian:

**Dashboard · Sidebar · Navbar · Header · Table · Login & Register · OTP · Searchbar ·
Card Data/Metrics · Empty State · 404 Section · FAQ · Footer**

Aturan turunan dari PDF:
- **Sidebar** punya keadaan collapse; navigasi utama tetap terlihat saat collapse.
- **Drawer** untuk desktop, **Bottom Sheet** untuk mobile — komponen berbeda, jangan dipaksa sama.
- **Card Data/Metrics** disusun grid 3–4 kolom di desktop, tumpuk di mobile.
- **Empty State** wajib punya ilustrasi + kalimat penjelas + satu aksi keluar.
- **404 Section**: judul "404: Halaman Tidak Ditemukan", deskripsi sopan tanpa menyalahkan, CTA "Kembali ke beranda"; varian horizontal/vertikal.
- **OTP**: 4–6 digit, **satu digit per kolom** 48×56 radius `lg`, `inputmode="numeric"`, fokus otomatis, dukung paste, `autocomplete="one-time-code"` di kolom pertama, hitung mundur kirim ulang, error = garis + helper merah.
- **Login & Register**: label + placeholder jelas, tautan "Lupa sandi?" di bawah kolom kata sandi, pesan error spesifik ("Kata sandi minimal 8 karakter"), SSO/Captcha opsional.
- **Searchbar**: placeholder kontekstual ("Cari pengguna"), tombol × saat mengetik, hasil kosong wajib beri pesan.
- **Table**: teks rata kiri, angka rata kanan, aksi di kolom paling kanan, konten sel maks 3–4 baris.
- **Dashboard**: Card Metrics di atas, detail di bawah; label kartu maks 2–3 kata.
- **Contoh penerapan resmi** (`/implementation`, playground Katalog Artikel) direplikasi di `katalog-artikel.html`: Chip choice (`data-chip-group="single"`, satu terpilih default) memfilter grid Card Content basic (media atas, judul 1 baris, deskripsi 2 baris, 3 kolom, 12 per halaman) + Pagination default ("Halaman [n] dari N" + baris per halaman) + Empty State saat kosong. Klik kartu membuka `artikel.html?id=N` (pola **Blog Post**: tautan Kembali → kategori, judul, ringkasan, penulis • tanggal • waktu baca → foto + "Sumber:" → isi 18 px lebar baca 720 → "Artikel terkait" 3 kartu). Kartu memakai `.ina-card-link` (tautan judul yang meregang menutupi kartu) — bukan `onclick` pada div.

---

## 9. Yang Belum Ditetapkan — jangan dikarang

| # | Celah | Tindakan agen |
|---|---|---|
| 1 | **Breakpoint** | ~~PDF tidak menyebut~~ → **tertutup**: npm `base.css` menetapkan `--ina-breakpoint-sm/md/lg/xl` = 640/768/1024/1280 (sudah di `idds-tokens.css`). Grid responsif tetap `[ISI:]` di §10.1. |
| 2 | **Nilai numerik Shadow-Float** | **tertutup** → `--ina-shadow-float` = npm `shadow-xl` (§4) |
| 3 | **Bobot font per kelas tipografi** | Diperkuat: npm hanya memuat Inter **400/500/600** dan komponen memakai 500 (tombol, badge) & 600 (judul modal/drawer/accordion). Keputusan paket 600/400/500 konsisten dengan itu; tetap [TURUNAN]. |
| 4 | **Status lisensi IDDS** | ikon MIT ✅ · font OFL ✅ · sistem desain: dokumen internal, tanpa lisensi terbuka — pakai hanya untuk instansi |

### Drift yang sudah terdeteksi (PDF vs kode)

| Token | PDF Okt 2025 | npm 1.6.x | Yang menang |
|---|---|---|---|
| `neutral-100` | `#f5f5f5` | `#f2f2f2` | **npm** |
| `neutral-900` | `#041225` | `#141414` | **npm** |
| `h2` line-height | 40px | 44px | **npm/web** |

### Drift situs web vs npm (audit 19 Sep 2026)

| Butir | design.inadigital.go.id | npm 1.6.36 | Yang menang |
|---|---|---|---|
| Brand INAgov `primary-primary` | "INAgov/500" | `#196bcd` = langkah **400** | **npm** — keputusan 19 Sep 2026: kontrak kebenaran = kode INAgov (`@idds/styles`), teks laman = narasi |
| Brand BKN `primary-primary` | "BKN/400" | `#de1d5e` = langkah **500** | **npm** (idem) |
| Nama token spacing | `spacing-N` = N px (2…128) | `--ina-spacing-1` = 4px, `-2` = 8px, … (rem) | **npm** — paket sudah dimigrasi 19 Sep 2026 (§4); nilai token kini identik dengan npm |
| Kelas komponen | `.ina-button`, `.ina-text-field`, `.ina-avatar`, … | sama | paket memakai `.ina-btn`, `.ina-input`; **15 nama bertabrakan** (nilai token sudah sama, tetapi aturan kelas berbeda) (`.ina-avatar`, `.ina-badge`, `.ina-alert`, `.ina-card`, `.ina-modal`, `.ina-toast`, `.ina-table`, `.ina-checkbox`, `.ina-accordion`, `.ina-breadcrumb`, `.ina-skeleton`, `.ina-spinner`, `.ina-stepper`, `.ina-progress-bar`, `.ina-toast-container`) — alasan kedua paket tidak boleh dimuat bersama |
| Keamanan | Halaman *Security Guide* (XSS, upload, CSP) | — | aturan server-side masuk `21_SECURITY`; UI: `autocomplete="off"` untuk OTP/token, `inputmode` sesuai jenis |

**Angka kontras di PDF tidak sahih.** Deret `15.68 / 15.10 / 13.77 / 11.30 / 9.25 / 7.43 /
5.93 / 4.42 / 11.82 / 17.37 / 18.78` dicetak identik untuk ramp warna yang berbeda —
mustahil secara matematis — dan tidak monoton (600 = 4.42 lalu 700 = 11.82).
Hanya 3 dari 11 nilai cocok dengan referensi mana pun. Pakai `data/aturan-kontras.json`.

---

## 10. Lapisan Proyek — WAJIB diisi per aplikasi

§1–§9 di atas adalah **lapisan sistem desain**: sama untuk semua aplikasi yang memakai IDDS,
dan sudah terkunci ke token nyata. Bagian ini adalah **lapisan proyek**: berbeda tiap
aplikasi, dan digali lewat K9 VCBD. Jangan biarkan kosong — halaman tanpa peta pola dan
tanpa empat state adalah sumber slop paling umum.

### 10.1 Breakpoint

Situs dan PDF tidak menyebut angka, tetapi npm `base.css` menetapkannya (§9 #1) dan sudah ada
di `idds-tokens.css` sebagai `--ina-breakpoint-*`. Pakai nilai itu; isi hanya kolom perilaku.

| Nama | Lebar (npm) | Perilaku |
|---|---|---|
| sm (mobile) | `640px` | `[ISI: sidebar → drawer, kartu 1 kolom]` |
| md (tablet) | `768px` | `[ISI: sidebar collapse, kartu 2 kolom]` |
| lg (desktop) | `1024px` | `[ISI: sidebar expand, kartu 3–4 kolom]` |
| xl | `1280px` | `[ISI: lebar konten maks]` |

Orientasi: `[ISI: desktop-first atau mobile-first]`

### 10.2 Peta Halaman → Pola

Tiap halaman MVP dipetakan ke SATU pola baku: `daftar+filter` · `detail` · `formulir` ·
`dasbor` · `autentikasi`.

| Halaman | Pola | Pola IDDS yang dipakai | Peran yang boleh akses |
|---|---|---|---|
| `[ISI:]` | `[ISI:]` | `[ISI: Table / Card Data / Login & Register / Dashboard]` | `[ISI:]` |

Navigasi: `[ISI: sidebar / topbar / kombinasi]`

### 10.3 Empat State Wajib

Setiap halaman dan komponen ber-data **wajib** mendefinisikan keempatnya. Baris tanpa isi
berarti fitur belum selesai, apa pun kata tesnya.

| Halaman/Komponen | Kosong | Memuat | Gagal | Sukses |
|---|---|---|---|---|
| `[ISI:]` | `[ISI: pakai pola Empty State — ilustrasi + kalimat + satu aksi keluar]` | `[ISI: Skeleton atau Spinner]` | `[ISI: Alert critical + aksi coba lagi]` | `[ISI:]` |

Komponen IDDS yang tersedia untuk ini: `Skeleton`, `Spinner`, `LinearProgressIndicator`,
`Alert`, `Toast`, plus pola `Empty State` dan `404 Section`.

### 10.4 Inventaris Komponen + Rumah File

Selaraskan dengan `12_STRUCTURE`.

| Komponen | Komponen IDDS asal | Rumah file |
|---|---|---|
| `[ISI:]` | `[ISI: Button / TextField / Table / Modal / Badge / Toast]` | `[ISI: path]` |

### 10.5 Bahasa & Nada Mikroteks

- Bahasa UI: `[ISI: id / en / campuran istilah teknis]`
- Nada: `[ISI: formal dinas / netral / santai]`
- Format tanggal: `[ISI:]` · Format angka & mata uang: `[ISI:]`
- **Satu istilah per kata kerja.** Simpan (bukan kadang Save), Hapus, Ubah, Batal, Kirim.
  Daftar kata kerja tombol yang dikunci: `[ISI:]`
- Kapitalisasi mengikuti §3: Sentence case untuk label tombol dan pesan sistem.

### 10.6 Blocklist UI

Berlaku otomatis, tidak perlu dikonfirmasi ulang:

- Nilai warna/ukuran/font di luar tabel token §2–§4.
- Komponen memanggil token primitif (`blue-500`, `neutral-300`) alih-alih semantik.
- `content-tertiary` sebagai warna teks (§5).
- `primary-300` sebagai background Button primary (§5).
- Lebih dari satu primary button per layar (§7).
- Ikon dari set selain Tabler; mencampur outline dan filled dalam satu baris (§6).
- `color: #fff` / `text-white` di atas `background-brand` — pakai `content-on-primary`.
- `outline: none` / `outline: 0` tanpa `--ina-focus-ring` sebagai pengganti.
- `opacity` untuk keadaan nonaktif — pakai `background-disabled` + `content-disabled`.
- `z-index` selain enam token `--ina-z-*`.
- Gradien pada tipografi.
- `text-align: justify`.
- Emoji atau glyph Unicode (✕ ✓ ⚡) sebagai ikon — pakai Tabler.
- Label tombol Title Case ("Simpan Data") — wajib Sentence case ("Simpan data"); nama menu/tab/produk boleh Title Case.
- Label menu sidebar >2 kata; badge >2 kata; label tab >32 karakter; breadcrumb >4 tautan.
- Teks placeholder yang tertinggal (`Lorem`, `Label`, `[ISI:]` di produksi).
- Animasi dekoratif tanpa fungsi.
- Pustaka UI baru tanpa lewat `22_DEPENDENCY_POLICY`.

Tambahan khusus proyek ini: `[ISI: atau "tidak ada"]`

---

## 11. Checklist Definition of Done — UI

Sebuah layar boleh disebut selesai hanya bila:

- [ ] Tidak ada nilai hex, px, atau rem yang ditulis langsung; semua lewat token.
- [ ] Tidak ada komponen yang memanggil token primitif (`blue-500`, `neutral-300`, dst).
- [ ] Diuji di `data-theme="light"` **dan** `data-theme="dark"`.
- [ ] Tidak ada teks memakai `content-tertiary`.
- [ ] Button primary memakai `background-brand` + `content-on-primary`, bukan `primary-300` + putih literal.
- [ ] Setiap elemen interaktif menampilkan `--ina-focus-ring` saat `:focus-visible` (uji dengan Tab).
- [ ] Pesan error ukuran body memakai `content-negative-strong`; batas input memakai `stroke-input`.
- [ ] Animasi tunduk pada `prefers-reduced-motion` (otomatis bila `idds-utilities.css` dimuat).
- [ ] Satu primary button per layar.
- [ ] Angka tabel dan kode identitas memakai `.ina-tabular`.
- [ ] Ikon: ukuran dan stroke sesuai tabel §6; `aria-hidden` untuk yang dekoratif.
- [ ] Label tombol dan pesan sistem memakai Sentence case.
- [ ] Tidak ada `text-align: justify`.
- [ ] Font Inter di-*self-host*, bukan dari CDN.
- [ ] Empat state (kosong/memuat/gagal/sukses) terdefinisi untuk tiap halaman ber-data (§10.3).
- [ ] Breakpoint dipakai sesuai §10.1, bukan default framework.
- [ ] Setiap nilai yang belum ditetapkan ditandai `[ISI: ...]`, bukan ditebak.

---

## 12. Klasifikasi

Dokumen sumber (PDF Dokumentasi IDDS) **berlabel rahasia dan ditujukan untuk penggunaan
internal**. Paket ini adalah turunan kerja untuk pengembangan aplikasi instansi.
**Jangan dipublikasikan ke repositori publik, jangan dibagikan ke pihak eksternal.**
Untuk repo publik, keluarkan berkas ini dan rujuk dokumentasi resmi lewat tautan saja.
