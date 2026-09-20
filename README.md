<p align="center">
  <img src="assets/img/readme-hero.png" alt="Dashboard utama idds-ui-pack — Ringkasan Eksekutif Kabupaten dengan KPI, grafik realisasi, status tiket pengaduan, dan tabel pengajuan" width="100%">
</p>

<h1 align="center">inagov-template · idds-ui-pack</h1>

<p align="center">
  <strong>67 template antarmuka aplikasi pemerintah daerah (SPBE / e-government) berbasis INA Digital Design System.</strong><br>
  HTML murni · tanpa build · tanpa CDN · token resmi <code>@idds/styles</code> · mode terang &amp; gelap · siap dipakai skill VCBD.
</p>

<p align="center">
  <a href="https://github.com/Syamsuddin/inagov-template/releases/latest"><img alt="Versi" src="https://img.shields.io/github/v/release/Syamsuddin/inagov-template?label=versi&color=0063a8"></a>
  <a href="LICENSE"><img alt="Lisensi MIT" src="https://img.shields.io/badge/lisensi-MIT-00923f"></a>
  <img alt="67 laman" src="https://img.shields.io/badge/laman-67-0075ba">
  <img alt="Tanpa build" src="https://img.shields.io/badge/build-tidak%20perlu-004a92">
  <img alt="Tanpa CDN" src="https://img.shields.io/badge/CDN-tidak%20ada-004a92">
  <img alt="WCAG AA" src="https://img.shields.io/badge/kontras-WCAG%202.1%20AA-00923f">
</p>

---

## Mengapa paket ini

Membangun aplikasi pemda biasanya dimulai dari nol: tiap OPD punya tampilan sendiri, warna sendiri, dan komponen yang tidak konsisten. **idds-ui-pack** memberi titik awal yang sudah **mengikuti desain sistem nasional INAgov (IDDS)** — desain yang sama dengan portal layanan pemerintah pusat — sehingga aplikasi daerah langsung terasa satu keluarga dengan aplikasi umum SPBE (SRIKANDI, SIPD, SIASN, SP4N-LAPOR!).

- **Cakupan proses bisnis pemda yang nyata.** Bukan sekadar dashboard generik: ada standar pelayanan 6 komponen (Permenpan 15/2014), SKM 9 unsur (Permenpan 14/2017), disposisi berjenjang dengan TTE BSrE, pohon kinerja (Permenpan 89/2021), DIP PPID (UU 14/2008), JDIH, Satu Data (Perpres 39/2019), BMD per KIB, monev fisik–keuangan, sampai persetujuan privasi UU 27/2022.
- **Buka langsung di peramban.** Tidak ada npm, bundler, atau framework. Salin folder, buka `index.html`, selesai. Cocok untuk demo ke pimpinan, prototipe cepat, maupun basis kode produksi (PHP native, Laravel, atau apa pun).
- **Satu sumber kebenaran visual.** Semua warna, jarak, radius, tipografi lewat token `@idds/styles` — tidak ada nilai hex/px liar. Ganti brand instansi dengan satu perintah; kontras tiap pasangan warna diuji otomatis untuk tema terang **dan** gelap.
- **Terverifikasi, bukan dijanjikan.** Setiap laman melewati pemeriksaan otomatis: keutuhan paket, kontras token AA untuk kedua tema, dan kepatuhan kode terhadap konvensi (tanpa warna literal, tanpa token primitif, tanpa `outline:none`, satu primary button per layar, dll.).

## Mulai dalam 30 detik

```bash
git clone https://github.com/Syamsuddin/inagov-template.git
cd inagov-template
open index.html          # macOS · Windows: start index.html · Linux: xdg-open index.html
```

Semua laman lain ada di `pages/<modul>/` dan dapat dicapai dari sidebar. Untuk memasang ke proyek aplikasi, salin folder `assets/` ke direktori publik proyek (mis. `public/assets/`) dan muat tiga stylesheet + satu skrip seperti pada `<head>` dan akhir `<body>` tiap laman (sesuaikan awalan jalur relatifnya):

```html
<link rel="stylesheet" href="assets/idds-tokens.css">
<link rel="stylesheet" href="assets/idds-utilities.css">
<link rel="stylesheet" href="assets/idds-admin.css">
…
<script src="assets/idds-admin.js"></script>
```

Satu hal yang gampang terlewat: brand tidak aktif tanpa atribut di `<html>`:

```html
<html lang="id" data-theme="light" data-brand="hss">
```

Dokumentasi teknis paket (panduan pasang untuk skill VCBD, konvensi UI 26_UI_CONVENTIONS, manifest & skrip verifikasi) berada di folder `docs/` yang **didistribusikan terpisah** dan tidak diunggah ke repositori ini.

## Apa saja di dalamnya — 67 laman

Setiap laman admin memakai kerangka yang identik (sidebar berjenjang, topbar dengan pencarian `Ctrl+K`, pemilih brand, mode gelap, notifikasi, menu pengguna, footer) dan datanya berupa contoh fiktif Kabupaten Hulu Sungai Selatan.

| Kelompok | Laman | Yang bisa dicoba |
|---|---|---|
| **Dasar** | `index`, `dashboard-analytics`, `keuangan`, `tables`, `cards`, `forms`, `components`, `chat`, `mail`, `profile`, `katalog-artikel`, `artikel` | KPI, chart kanvas (line/bar/donut) yang ikut berubah saat tema/brand diganti, tabel sort/filter/bulk, wizard, dropzone, 5 status validasi, obrolan & pembaca surel 3 panel |
| **Autentikasi & akun** | `login`, `register`, `forgot-password`, `otp`, `lock-screen`, `pilih-unit`, `verifikasi-identitas`, `persetujuan-privasi`, `onboarding` | SSO ASN Digital / INApas, meter kekuatan sandi, OTP auto-maju, pilih peran multi-OPD, KTP + swafoto, consent per tujuan UU PDP, wizard 5 langkah penyiapan instansi |
| **Layanan publik** | `layanan`, `layanan-detail`, `permohonan`, `lacak`, `antrian`, `pengaduan`, `pengaduan-detail`, `skm`, `skm-hasil` | katalog + chip filter, 6 komponen standar pelayanan, permohonan 4 langkah dengan bukti terima, pelacakan + unggah perbaikan, reservasi slot + papan loket, aduan terhubung SP4N-LAPOR! dengan SLA, Likert 9 unsur + IKM |
| **Keterbukaan informasi** | `portal`, `ppid`, `jdih`, `jdih-detail`, `data`, `dataset` | beranda portal, DIP 4 kategori + permohonan/keberatan, produk hukum + metadata JDIHN, katalog dataset SDI + API + kamus data |
| **Persetujuan & tata kelola** | `disposisi`, `pengguna`, `peran`, `audit`, `pengaturan`, `cetak` | persetujuan berjenjang dengan passphrase TTE, undang & ubah peran, matriks peran × izin, log audit append-only dengan diff sebelum–sesudah, 5 tab pengaturan (identitas, integrasi SPBE, notifikasi, keamanan, pemeliharaan), lembar A4 + `@media print` |
| **Administrasi internal** | `naskah`, `tte`, `agenda`, `pegawai`, `pegawai-detail`, `presensi`, `cuti`, `kinerja`, `monev`, `aset`, `dashboard-eksekutif` | TNDE + klasifikasi arsip, penandatanganan BSrE, kalender pimpinan + konflik jadwal, pohon organisasi, profil HR, matriks presensi 30 hari, kuota & persetujuan cuti, pohon kinerja + PK + realisasi, kurva S program→sub kegiatan, BMD per KIB, peta ubin kecamatan |
| **Bantuan & status** | `notifikasi`, `bantuan`, `tiket`, `kebijakan-privasi`, `404`, `403`, `500`, `maintenance` | pusat notifikasi + preferensi kanal, FAQ + panduan + status layanan, tiket helpdesk dengan SLA, dokumen privasi dengan daftar isi lengket, halaman status pola Empty State |
| **Publik & layar besar** | `publik-beranda`, `publik-layanan`, `publik-lacak`, `publik-pengaduan`, `kios-antrian`, `situation-room` | kerangka warga tanpa sidebar (header lengket, menu mobile tanpa JS, footer 4 kolom, skip link), papan antrian layar besar, situation room Bupati tema gelap |

## Vibe coding dengan agen AI

Paket ini dirancang sebagai **kontrak desain untuk agen** (Antigravity, VS Code + Copilot/Claude Code/Gemini, Cursor): agen menulis kode, template membatasi hasilnya, Anda memutuskan.

<p>
  <a href="panduan/vibe-coding.md"><img alt="Baca panduan vibe coding" src="https://img.shields.io/badge/📘_panduan-vibe_coding_(VS_Code_·_Antigravity_·_Claude_Code)-0063a8?style=for-the-badge"></a>
  <a href="AGENTS.md"><img alt="AGENTS.md" src="https://img.shields.io/badge/🤖_AGENTS.md-aturan_agen_siap_pakai-004a92?style=for-the-badge"></a>
</p>

**Tiga langkah minimum**

1. Buka folder repo sebagai *workspace* dan jalankan server lokal (`python3 -m http.server 8080` atau Live Server). Agen otomatis membaca [`AGENTS.md`](AGENTS.md); untuk Claude Code buat `CLAUDE.md` berisi `Ikuti @AGENTS.md`.
2. Beri prompt yang **menyebut laman rujukan**, misalnya:
   ```
   Baca AGENTS.md. Buat pages/perizinan/izin-reklame.html dengan menyalin kerangka dari
   pages/layanan/permohonan.html (sidebar, topbar, footer sama; item "Permohonan Baru" aktif).
   Ganti langkah 2 dengan unggah desain reklame + titik lokasi; data contoh fiktif Kab. HSS.
   Pakai hanya kelas ina-* dan atribut data-* yang ada. Laporkan hasil grep dari AGENTS.md.
   ```
3. Sebelum menerima hasil: buka di peramban (tema terang & gelap, lebar 768/480), pastikan tidak ada hex/px literal, satu `ina-btn-primary` per layar, dan semua tautan hidup — daftar periksa lengkap ada di panduan §6.

Panduan lengkap memuat persiapan per IDE, 6 prompt yang terbukti bekerja (laman baru, sidebar, komponen, ganti brand, konversi Laravel, audit), peta 17 kebutuhan → laman rujukan, integrasi ke PHP/Laravel, dan masalah yang sering muncul.

## Kontrak desain yang dijaga

| Aspek | Ketentuan |
|---|---|
| Token | Warna, spasi, radius, tipografi, bayangan, z-index — semua dari `assets/idds-tokens.css` (kunci `@idds/styles` 1.6.36 + lapisan semantik turunan). Kode tidak boleh memanggil token primitif (`blue-500`) maupun nilai literal. |
| Brand | 8 brand siap pakai (HSS, INA Gov, PAN-RB, BKN, LAN, INApas, INAku, BGN). Brand daerah baru diturunkan dari satu hex logo sebagai ramp 11 langkah di ruang OKLCH (lihat pola `assets/brand-hss.css`). |
| Kontras | Setiap pasangan label–latar diuji WCAG 2.1 AA untuk tema terang dan gelap (`build-kontras.py --check` di paket dokumentasi, 8 brand × 2 tema; audit laman: `scripts/audit-ui.py`). Teks berwarna brand memakai `content-brand`, bukan `background-brand`. Latar kuning wajib teks gelap. |
| Tombol | Hierarki mengikuti npm (`primary` / `secondary` / `tertiary` / `danger`), label **Sentence case**, satu primary button per layar. |
| Ikon | Tabler Icons (MIT), inline SVG, ukuran & stroke sesuai tabel konvensi; tanpa emoji/glyph. |
| Aksesibilitas | Focus ring token pada semua elemen interaktif, `aria-*` pada kontrol, skip link di kerangka publik, `prefers-reduced-motion` dihormati. |
| Responsif | Breakpoint 1024 / 768 / 480 px; sidebar jadi laci, grid menumpuk, tabel bergulir. |

## Mengganti brand ke daerah Anda

Brand adalah blok `[data-brand="…"]` di `assets/idds-tokens.css` berisi ramp 11 langkah `primary-25…900` plus pemetaan `primary-primary` dan `content-brand` untuk tema terang dan gelap, diaktifkan lewat `data-brand="…"` pada `<html>`. `assets/brand-hss.css` adalah keluaran generator yang sama untuk HSS (rujukan pola; salinan aktifnya sudah tertanam di `idds-tokens.css`, tidak perlu dimuat laman). Untuk daerah lain:

1. Sampel warna utama dan aksen **dari berkas logo**, bukan dari deskripsi verbal lambang (deskripsi sering menyebut "biru tua" padahal artwork-nya biru sedang).
2. Turunkan ramp 11 langkah di ruang OKLCH dengan profil lightness yang sama seperti ramp brand resmi IDDS, tulis ke `assets/brand-<nama>.css` mengikuti pola berkas HSS, lalu daftarkan di `idds-tokens.css`.
3. Uji kontras setiap pasangan label–latar dengan `build-kontras.py --check` (paket dokumentasi): label di atas `primary-primary` ≥ 4,5:1, dan `content-brand` ≥ 4,5:1 di atas `background-primary/secondary/tertiary` dan `brand-subtle` (tema gelap biasanya `primary-200`). Untuk HSS, `primary-500` dipakai di tema gelap karena `primary-400` hanya 3,61:1.

## Struktur repositori

Hanya `index.html` yang berada di akar; 66 laman lain dikelompokkan per modul di `pages/`, dan semua tautan di dalamnya relatif (`../../assets/…`, `../auth/login.html`) sehingga bisa dibuka dari `file://` maupun disajikan dari subdirektori mana pun.

```
├── index.html             dashboard utama — titik masuk
├── pages/
│   ├── auth/              login, register, forgot-password, otp, lock-screen, pilih-unit, verifikasi-identitas, persetujuan-privasi, onboarding
│   ├── dashboard/         dashboard-analytics, dashboard-eksekutif, keuangan
│   ├── ui-kit/            tables, cards, forms, components
│   ├── artikel/           katalog-artikel, artikel
│   ├── komunikasi/        chat, mail
│   ├── akun/              profile, notifikasi
│   ├── layanan/           layanan, layanan-detail, permohonan, lacak, antrian
│   ├── partisipasi/       pengaduan, pengaduan-detail, skm, skm-hasil
│   ├── informasi/         portal, ppid, jdih, jdih-detail, data, dataset
│   ├── tata-kelola/       disposisi, pengguna, peran, audit, pengaturan, cetak
│   ├── kesekretariatan/   naskah, tte, agenda
│   ├── kepegawaian/       pegawai, pegawai-detail, presensi, cuti, kinerja
│   ├── perencanaan/       monev, aset
│   ├── bantuan/           bantuan, tiket, kebijakan-privasi
│   ├── status/            404, 403, 500, maintenance
│   ├── publik/            publik-beranda, publik-layanan, publik-lacak, publik-pengaduan
│   └── kios/              kios-antrian, situation-room
├── assets/
│   ├── idds-tokens.css    token TERKUNCI + lapisan semantik, brand terpasang
│   ├── idds-utilities.css tipografi, ikon, focus ring
│   ├── idds-admin.css     tata letak + komponen (Fase 1–6), semua lewat token
│   ├── idds-admin.js      tema, brand, sidebar, modal, toast, chart, tabel, stepper, tree, …
│   ├── brand-hss.css      keluaran generator brand HSS (rujukan; aktifnya di idds-tokens.css)
│   ├── artikel-data.js    data contoh katalog/detail artikel
│   ├── fonts/             Inter variable self-host (woff2, OFL 1.1)
│   └── img/               foto artikel contoh, gambar README
├── scripts/audit-ui.py    audit statis kontrak desain seluruh laman (gerbang DoD)
├── panduan/vibe-coding.md  panduan vibe coding (VS Code, Antigravity, Claude Code)
├── AGENTS.md              aturan agen AI (dibaca IDE agentik)
├── CHANGELOG.md · VERSION · LICENSE
```

Folder `docs/` (dokumen teknis, manifest, skrip verifikasi, data kontras) sengaja tidak diunggah — lihat `.gitignore`.

## Peta jalan

- [x] Fase 1–6: 67 laman lintas layanan publik, keterbukaan, administrasi internal, akun, bantuan, publik, layar besar
- [ ] GeoJSON batas kecamatan untuk peta (kelas `.ina-tile-1..5` siap dipakai ulang pada `<path>`)
- [ ] Mode kios yang mengunci tema dari sisi server
- [ ] Contoh integrasi ke Laravel Blade dan PHP native (partial header/sidebar/footer)
- [ ] Sprite Tabler kustom & font Inter lokal

Kontribusi dipersilakan — buka *issue* untuk laman/komponen yang belum ada atau kirim *pull request* yang mematuhi kontrak desain di atas.

## Klasifikasi, lisensi, dan kredit

- Dokumen sumber IDDS (PDF) dan dosir analisisnya berklasifikasi internal, **tidak disertakan**, dan diblokir `.gitignore`. Yang dipublikasikan hanya turunan dari paket npm publik `@idds/styles` dan `@idds/react`.
- Kode dan template: **MIT** (`LICENSE`). Ikon: Tabler Icons (MIT). Font: Inter (SIL OFL). Desain sistem: INA Digital Design System — INA Digital / GovTech Indonesia.
- Seluruh data pada template (nama, NIP, nomor telepon, surel, angka) adalah **contoh fiktif**; kemiripan dengan pihak nyata tidak disengaja.

<p align="center"><sub>Dibuat untuk mempercepat digitalisasi pemerintah daerah — dari Hulu Sungai Selatan, Kalimantan Selatan.</sub></p>
