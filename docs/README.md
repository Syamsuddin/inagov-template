# idds-ui-pack v1.8.0

Paket referensi UI **INA Digital Design System (IDDS)** untuk aplikasi pemerintah,
siap dipasang ke proyek Claude Code yang memakai skill **VCBD**.
Brand **Pemkab HSS** sudah terpasang, disampel dari logo resmi.

> **v1.8.0 (20 Sep 2026)** — +6 template Fase 6: **kerangka publik tanpa sidebar** (`.ina-public`: header horizontal + menu
> `<details>` di mobile, footer kolom, skip link) untuk `publik-beranda/-layanan/-lacak/-pengaduan`, dan **mode layar besar**
> (`.ina-kiosk`) untuk `kios-antrian` dan `situation-room` (tema gelap). Partial publik `pub_pre/pub_tail` di generator.

> **v1.7.0 (20 Sep 2026)** — +8 template Fase 5 (pendukung akun & bantuan): pilih unit kerja, verifikasi identitas,
> persetujuan privasi (UU PDP), onboarding instansi, pusat notifikasi, bantuan & FAQ, tiket helpdesk, kebijakan privasi.
> Komponen baru: kartu pilihan, bingkai kamera, item notifikasi, prosa dokumen + daftar isi lengket, kotak auth XL.

> **v1.6.0 (20 Sep 2026)** — +11 template Fase 4 (administrasi internal, Perpres 95/2018 Ps. 42): naskah dinas, TTE,
> agenda pimpinan, direktori & profil pegawai, presensi, cuti, kinerja/SKP, monev, aset BMD, dashboard eksekutif.
> Komponen baru: kalender, tree view, peta ubin SVG, lembar TTE, matriks presensi, baris hierarki. Label nav `mail.html` → “Surel Dinas”.

> **v1.5.0 (19 Sep 2026)** — +11 template Fase 3 (partisipasi & keterbukaan informasi): portal publik, pengaduan +
> tindak lanjut, SKM 9 unsur + hasil IKM, PPID, JDIH + detail, katalog data + dataset, antrian & reservasi.
> Komponen baru: hero, quicklinks, Likert, papan antrian, blok kode, chip-wrap.

> **v1.4.0 (19 Sep 2026)** — +13 template Fase 2 (layanan publik & tata kelola SPBE): katalog & standar pelayanan,
> permohonan 4 langkah, lacak, disposisi berjenjang + TTE, pengguna, peran × izin, log audit, pengaturan,
> lembar cetak A4 (`@media print`), 403/500/pemeliharaan. Sidebar disatukan di semua laman.

> **v1.3.1 (19 Sep 2026)** — audit terhadap seluruh laman design.inadigital.go.id + `@idds/styles` 1.6.36.
> Keputusan: token spacing, warna brand, dan ukuran avatar mengikuti **sumber INAgov asli (npm)**;
> hierarki tombol, radius, ukuran input/modal/toast disamakan dengan npm; label tombol Sentence case.

> ⚠️ **Klasifikasi.** Dokumen sumber (`Dokumentasi_INA_Digital_Design_System.pdf`) dan dosir
> analisisnya (`docs/data/dosir-*.json`, `docs/referensi/`) berlabel **rahasia / internal** dan
> **tidak disertakan** dalam repositori ini (sudah masuk `.gitignore`). Yang dipublikasikan hanya
> turunan kerja: token dari paket npm publik `@idds/styles`, template HTML, skrip, dan konvensi.
> Jangan pernah menambahkan berkas sumber tersebut ke repositori publik.

---

## Pasang cepat

```bash
# dari root proyek, SEBELUM scaffold.py dijalankan
cp -r /path/ke/idds-ui-pack .idds
bash .idds/docs/install.sh              # atau --native untuk PHP tanpa framework
```

Lalu ikuti `INSTALL.md` untuk prompt VCBD dan urutan langkahnya. Setelah selesai:

```bash
bash .idds/docs/scripts/verify.sh
```

Satu hal yang gampang terlewat: brand tidak aktif tanpa atribut di `<html>`.

```html
<html lang="id" data-theme="light" data-brand="hss">
```

---

## Brand `hss` — [TERVALIDASI] dari logo resmi

Seluruh hex **disampel dari berkas logo**, bukan ditafsirkan dari deskripsi verbal.
Logo 787×1073 px, 756.039 piksel opak, 10.388 warna unik.

| Peran | Hex | Porsi logo | Kontras vs putih |
|---|---|---:|---:|
| **`primary-primary`** — perisai | `#0063a8` | 54,7% | **6,27** — AA ✅ |
| **`accent-yellow`** — pita & padi | `#fff500` | 10,6% | 1,15 — ⚠️ lihat bawah |
| Putih | `#ffffff` | 13,9% | — |
| Hitam garis | `#1f1a17` | 8,7% | 17,24 |
| Hijau daun kapas | `#00923f` | 2,5% | 4,05 — teks besar saja |
| Biru terang (pintu) | `#0075ba` | 2,4% | 4,94 — AA |
| Biru gelap (atap) | `#004a92` | 1,0% | 8,77 — AAA |
| Kuning emas (gagang) | `#f8c300` | 0,3% | 1,64 |

Ramp 11 langkah diturunkan di ruang **OKLCH** dengan profil lightness = median ramp brand
resmi IDDS (`panrb`, `inagov`, `lan`, `bkn`), sehingga HSS duduk di tingkat terang yang
sama dengan brand lembaga pusat. Dark mode `primary-primary` dipetakan ke **`primary-500`**
(`#2172b5`): label putih 5,07 dan 3,63 terhadap latar gelap — keduanya lolos. (`primary-400`
yang dipakai 1.2.0 hanya 3,61 untuk label putih; itu bug, sudah diperbaiki.)

### Dua catatan yang perlu diketahui

**Latar kuning wajib berpasangan teks gelap.** `#fff500` hanya 1,15:1 terhadap putih —
praktis tak terbaca. Terhadap `#1f1a17` ia 15,03:1. Aturan ini sudah masuk blocklist dan
diperiksa `verify.sh`.

**Deskripsi lambang menyebut "biru tua", artwork-nya biru sedang.** `#0063a8` bukan navy.
Untuk keperluan digital, artwork yang menang — itu yang benar-benar dilihat orang. Perlu
dicatat pula bahwa HSS belum punya Perda lambang daerah; Raperda diajukan September 2026,
jadi nilai ini bisa berubah bila Perda menetapkan spesifikasi berbeda.

Bila berubah, regenerasi — jangan sunting tangan:

```bash
python3 docs/scripts/build-brand.py --hex "#BARU" --name hss --label "Pemkab HSS" \
  --accent "#BARU2" --status TERVALIDASI \
  --out-css assets/brand-hss.css --out-json docs/data/brand-hss.json
```

Untuk daerah lain, perintah sama dengan `--name` berbeda.

---

## Isi

Status per berkas di salinan ini: ✅ ada · 🔁 diregenerasi 1.3.0 · ⬜ **hilang — impor ulang dari paket asli**

```
idds-ui-pack/
├── index.html · dashboard-analytics.html · keuangan.html        🆕 template admin — buka langsung
├── tables.html · cards.html · forms.html · components.html      🆕
├── chat.html · mail.html · profile.html · 404.html              🆕
├── login.html · register.html · forgot-password.html · otp.html · lock-screen.html  🆕
├── katalog-artikel.html      ✅ contoh penerapan design.inadigital.go.id/implementation (Card + Chip + Pagination)
├── artikel.html              ✅ detail artikel (?id=N) — pola Blog Post; data di assets/artikel-data.js
├── layanan.html · layanan-detail.html · permohonan.html · lacak.html   🆕 1.4.0 layanan publik
├── disposisi.html            🆕 1.4.0 persetujuan berjenjang + modal TTE
├── pengguna.html · peran.html · audit.html · pengaturan.html         🆕 1.4.0 tata kelola sistem
├── cetak.html                🆕 1.4.0 lembar A4: kop, tabel, TTE+QR, @media print
├── 403.html · 500.html · maintenance.html                            🆕 1.4.0 halaman status
├── portal.html · pengaduan.html · pengaduan-detail.html · antrian.html   🆕 1.5.0 partisipasi publik
├── skm.html · skm-hasil.html                                          🆕 1.5.0 survei kepuasan (Permenpan 14/2017)
├── ppid.html · jdih.html · jdih-detail.html · data.html · dataset.html   🆕 1.5.0 keterbukaan informasi
├── naskah.html · tte.html · agenda.html                                🆕 1.6.0 kesekretariatan
├── pegawai.html · pegawai-detail.html · presensi.html · cuti.html · kinerja.html   🆕 1.6.0 kepegawaian
├── monev.html · aset.html · dashboard-eksekutif.html                    🆕 1.6.0 perencanaan, aset, eksekutif
├── pilih-unit.html · verifikasi-identitas.html · persetujuan-privasi.html · onboarding.html   🆕 1.7.0 laman mandiri (pola auth)
├── notifikasi.html · bantuan.html · tiket.html · kebijakan-privasi.html   🆕 1.7.0 pusat bantuan
├── publik-beranda.html · publik-layanan.html · publik-lacak.html · publik-pengaduan.html   🆕 1.8.0 kerangka publik (tanpa sidebar)
├── kios-antrian.html · situation-room.html                              🆕 1.8.0 mode layar besar (.ina-kiosk)
├── assets/                    ← satu-satunya folder yang dirujuk template
│   ├── idds-tokens.css        ✅ token TERKUNCI [NPM] + lapisan [TURUNAN], brand hss terpasang
│   ├── idds-utilities.css     🔁 kelas tipografi, ikon, focus ring, @font-face
│   ├── brand-hss.css          ✅ blok brand HSS terpisah
│   ├── idds-admin.css         🆕 tata letak admin + komponen dashboard (semua nilai lewat token)
│   ├── idds-admin.js          🆕 interaksi: tema, brand, sidebar, modal, toast, chart, tabel, chat, mail
│   ├── img/artikel/artikel-1…6.png   🆕 foto artikel contoh (328×202) untuk katalog-artikel.html
│   ├── fonts/inter-latin.woff2        ⬜ 75,6 KB, variable 100–900
│   └── img/tabler-sprite-starter.svg  ⬜ 91 ikon kepegawaian
└── docs/                      ← dokumen, skrip, data; tidak dibutuhkan untuk menjalankan template
    ├── README.md              ✅ berkas ini
    ├── INSTALL.md             ✅ langkah + prompt VCBD lengkap
    ├── MANIFEST.json          ✅ rute pemuatan + sidik SHA + status tiap berkas
    ├── install.sh             ✅ pemasang (punya gerbang urutan scaffold)
    ├── Implementation_Plan.md 🆕 rencana pembuatan template
    ├── 26_UI_CONVENTIONS.md   ✅ ← dokumen utama, mengisi slot 26 VCBD
    ├── data/
    │   ├── aturan-kontras.json    🔁 matriks kontras + tombol per brand — DIGENERATE, jangan sunting
    │   ├── brand-hss.json         ✅ ramp HSS + laporan kontras per langkah
    │   ├── dosir-ui-idds.json     ⬜ kontrak penuh: warna, tipografi, spacing, 51 komponen
    │   ├── dosir-ikon-tabler.json ⬜ indeks 6.184 ikon (1,5 MB — muat seperlunya)
    │   ├── dosir-font-inter.json  ⬜ metrik font, sumbu variable, fitur OpenType
    │   └── dosir-kontras-idds.json ⬜ audit angka kontras PDF
    ├── scripts/
    │   ├── build-kontras.py       🆕 aturan-kontras.json dari idds-tokens.css (+ --check)
    │   ├── build-brand.py         ⬜ ramp brand 11 langkah dari satu hex (OKLCH)
    │   ├── build-sprite.py        ⬜ sprite Tabler kustom / pindai dari kode
    │   └── verify.sh              ✅ cek keutuhan paket + kepatuhan token di kode
    └── referensi/                 ⬜ analisis untuk manusia — TIDAK dimuat agen
```

`install.sh` menyalin yang ada dan **melaporkan** yang hilang — tidak gagal diam-diam.
Paket tetap bisa dipakai tanpa berkas ⬜: token, konvensi, dan aturan kontras lengkap;
yang hilang hanya font (pakai fallback `system-ui` sementara), sprite ikon, dan indeks ikon.

---

## Template dashboard admin (root paket)

Enam puluh tujuh halaman HTML mandiri (tanpa build, tanpa CDN) yang memakai `idds-tokens.css`,
`idds-utilities.css`, dan `idds-admin.css` + `idds-admin.js`. Buka `index.html` di root paket
langsung di browser. Setiap halaman memuat tata letak standar yang sama: sidebar berjenjang,
topbar (pencarian Ctrl+K, pemilih brand, mode gelap/terang, notifikasi, menu pengguna), dan footer.

| Suite | Halaman | Fitur yang bisa dicoba |
|---|---|---|
| Autentikasi | `login`, `register`, `forgot-password`, `otp`, `lock-screen` | SSO / ID Induk, tampil-sembunyi sandi, meter kekuatan sandi, OTP auto-maju + tempel + timer kirim ulang |
| Dashboard & Keuangan | `index`, `dashboard-analytics`, `keuangan` | KPI, chart kanvas (line/bar/donut, data via atribut), arus kas, tabel SP2D dengan filter/sort, modal rekam |
| Data & UI | `tables`, `cards`, `forms`, `components` | sort header, bulk action + modal konfirmasi, timeline/toggle/collapsible card, 5 status validasi, dropzone, stepper, alert/badge/tab/accordion/tooltip/empty state |
| Komunikasi & Profil | `chat`, `mail`, `profile`, `404` | kirim pesan + balasan simulasi, lampiran, folder mail fungsional, pembaca 3 panel, riwayat jabatan, 2FA |
| Layanan Publik (1.4.0) | `layanan`, `layanan-detail`, `permohonan`, `lacak` | katalog + chip filter + paginasi, 6 komponen standar pelayanan (Permenpan 15/2014) dalam tab, wizard 4 langkah + dropzone + bukti terima, pelacakan dengan timeline & unggah perbaikan |
| Disposisi (1.4.0) | `disposisi` | kotak berkas 3 tab, detail 4 tab, rantai persetujuan berjenjang, modal setujui (passphrase TTE) / kembalikan / tolak / teruskan / delegasi |
| Tata Kelola (1.4.0) | `pengguna`, `peran`, `audit`, `pengaturan` | undang & ubah peran, matriks peran × izin (`.ina-matrix`), log append-only + diff sebelum–sesudah (`.ina-diff`), 5 tab pengaturan (identitas, integrasi SPBE, notifikasi, keamanan, pemeliharaan) |
| Partisipasi Publik (1.5.0) | `portal`, `pengaduan`, `pengaduan-detail`, `skm`, `skm-hasil`, `antrian` | hero + quicklinks (`.ina-hero`, `.ina-quicklinks`), form aduan + daftar publik berfilter status, tindak lanjut OPD dengan SLA & pelapor terlindungi, Likert 9 unsur (`.ina-likert`), IKM bar/line/donut, reservasi slot (`.ina-chip-wrap`) + papan antrian (`.ina-queue-board`) |
| Keterbukaan Informasi (1.5.0) | `ppid`, `jdih`, `jdih-detail`, `data`, `dataset` | DIP 4 tab + permohonan/keberatan UU KIP, katalog produk hukum berfilter jenis + metadata JDIHN, katalog dataset SDI + API (`.ina-code`), detail dataset dengan pratinjau sort/cari, kamus data, visualisasi |
| Kesekretariatan (1.6.0) | `naskah`, `tte`, `agenda` | surat masuk/keluar + klasifikasi arsip + disposisi massal, penandatanganan BSrE (`.ina-sign-page`, posisi, sertifikat, antrean, verifikasi), kalender bulan (`.ina-calendar`) + undangan hadir/wakili + konflik |
| Kepegawaian (1.6.0) | `pegawai`, `pegawai-detail`, `presensi`, `cuti`, `kinerja` | pohon organisasi (`.ina-tree`, `data-tree-toggle`), profil HR 5 tab, matriks presensi (`.ina-attend`) + anomali + kunci rekap, kuota & persetujuan cuti, pohon kinerja + PK + realisasi + umpan balik |
| Perencanaan, Aset, Eksekutif (1.6.0) | `monev`, `aset`, `dashboard-eksekutif` | kurva S + tabel hierarki program→kegiatan→sub (`.ina-row-l1/2/3`), BMD per KIB + donut komposisi + mutasi/penghapusan, dashboard Bupati dengan peta ubin kecamatan (`.ina-tilemap`), capaian RPJMD, peringkat OPD |
| Akun & Privasi (1.7.0) | `pilih-unit`, `verifikasi-identitas`, `persetujuan-privasi`, `onboarding` | pola `login.html` (`.ina-auth-box-wide/-xl`): kartu pilihan unit/peran (`.ina-choice`), wizard KTP → swafoto (`.ina-camera-frame`) → hasil, persetujuan per tujuan UU PDP, wizard 5 langkah penyiapan instansi |
| Pusat Bantuan (1.7.0) | `notifikasi`, `bantuan`, `tiket`, `kebijakan-privasi` | daftar notifikasi berkelompok + filter chip + preferensi kanal (`.ina-notif-item`), hero pencarian + FAQ tab + panduan + status layanan, tiket dengan antrean SLA & percakapan (pola chat), dokumen prosa dengan daftar isi lengket (`.ina-doc`, `.ina-toc`) + modal hak subjek data |
| Publik tanpa sidebar (1.8.0) | `publik-beranda`, `publik-layanan`, `publik-lacak`, `publik-pengaduan` | kerangka `.ina-public`: topbar brand, header lengket dengan nav horizontal (`<details>` menu di ≤768), konten terpusat 1200, footer 4 kolom, skip link; konten diturunkan dari laman admin setara |
| Layar besar (1.8.0) | `kios-antrian`, `situation-room` | `.ina-kiosk`: header brand + jam, sel nomor display ×2, ticker; situation room memakai `data-theme="dark"` dengan stat, peta ubin, chart, timeline, tabel |
| Cetak & Status (1.4.0) | `cetak`, `403`, `500`, `maintenance` | lembar A4 (`.ina-print-sheet`, `.ina-kop`, `.ina-ttd`) + `@media print` menyembunyikan kerangka admin; halaman status pola Empty State |

API global di `idds-admin.js`: `InaToast.show(pesan, tipe)`, `InaModal.open(id)` / `close(id)`,
`InaChart.redrawAll()`. Chart membaca warna dari token terkomputasi, jadi ikut berubah saat
tema/brand diganti. Preferensi tema, brand, dan lebar sidebar tersimpan di `localStorage`.

Kepatuhan: `verify.sh` §5 terhadap `*.html` + `assets/idds-admin.*` → **0 gagal**. Satu
peringatan yang tersisa adalah px literal untuk dimensi komponen di `idds-admin.css`
(lebar sidebar 280px, tinggi tombol 40px, dsb.) — tidak ada token IDDS untuk ukuran tersebut.

---

## Verifikasi sumber

| Sumber | Yang diambil |
|---|---|
| npm `@idds/styles` 1.6.36 | warna, spacing, radius, 7 brand lembaga |
| npm `@idds/react` 1.6.61 | kontrak varian 51 komponen |
| `tabler-icons-main` 3.46.0 | geometri + indeks 6.184 ikon |
| `inter.zip` 4.001 | metrik vertikal, sumbu variable, fitur OpenType |
| PDF IDDS Okt 2025 (176 hal) | prinsip, aturan pakai, ketebalan ikon resmi, spesifikasi komponen |
| `logo-hss.png` | warna brand HSS — disampel per piksel |
| perhitungan sendiri | matriks kontras WCAG 2.1, ramp brand OKLCH |

Bila dua sumber berbeda, **kode npm yang menang** untuk token IDDS, dan **artwork yang
menang** untuk warna brand. Selisih yang sudah terdeteksi tercatat di
`docs/26_UI_CONVENTIONS.md` §9.

Satu peringatan: **angka kontras yang tercetak di PDF resmi tidak sahih** — deret yang sama
dicetak untuk ramp warna berbeda, dan tidak monoton. Pakai `docs/data/aturan-kontras.json`,
bukan tabel di PDF. Rinciannya di `referensi/ADENDUM-03`.

---

## Yang masih kosong

| # | Celah | Status |
|---|---|---|
| 1 | Breakpoint responsif | IDDS tidak menetapkan apa pun — isi di `docs/26` §10.1 |
| 2 | Nilai numerik Shadow-Float | PDF hanya gambar; Focused sudah = `shadow-sm` |
| 3 | Perda lambang HSS | Raperda Sept 2026 — warna saat ini dari artwork, sah dipakai |
| 4 | Status lisensi IDDS | ikon MIT ✅ · font OFL ✅ · sistem desain internal, tanpa lisensi terbuka |
| 5 | Bobot font per kelas | [TURUNAN] 600/400/500 — verifikasi ke Figma UI Kit bila ada akses |

Semuanya ditandai `[ISI: ...]` supaya agen berhenti dan bertanya, bukan menebak.

---

## Perubahan 1.3.0

- **Struktur paket dipulihkan** (`docs/ assets/ data/ scripts/`); 12 berkas yang hilang dari
  salinan ditandai ⬜ di MANIFEST dan dilaporkan `install.sh`.
- **+24 token semantik [TURUNAN]** (`content-on-primary`, `*-subtle`, `stroke-input`,
  `stroke-focus`, dll.) + fallback `primary-*` tanpa `data-brand` + shadow/focus/weight/motion/z-index.
  Agen tidak lagi terpaksa memanggil primitif.
- **Bug kontras dark mode HSS** diperbaiki: `primary-400` → `primary-500`; inapas & panrb dark
  memakai label gelap. Semua 16 kombinasi brand×tema lolos AA (`build-kontras.py --check`).
- `stroke-secondary` (2,52) tidak lagi direkomendasikan untuk batas input → `stroke-input` (4,74).
- Kontradiksi teks dibersihkan (slot hss "kosong", brand default "abu gelap", 1,19 → 1,26).
- `verify.sh`: cek lolos-shellcheck, deteksi `rgb()/hsl()`/hex 3 & 8 digit/`px` literal,
  `outline:none`, `opacity` nonaktif, pasangan kuning–putih lintas baris, `content-tertiary` tanpa celah `icon`.
- `install.sh`: tanpa `eval`, aman untuk path berspasi.
