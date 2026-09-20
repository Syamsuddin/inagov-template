# Panduan vibe coding dengan inagov-template

Cara membangun aplikasi pemerintah daerah **bersama agen AI** (Antigravity, VS Code + Copilot/Claude Code/Gemini Code Assist, Cursor) memakai paket template ini sebagai *kontrak desain* — supaya hasil agen konsisten, patuh IDDS, dan tidak berantakan setelah prompt ke-20.

> Prinsip: **agen menulis, template membatasi, Anda memutuskan.** Yang membuat vibe coding gagal bukan model yang kurang pintar, melainkan konteks yang tidak jelas. Paket ini menyediakan konteksnya: token, komponen, kerangka, dan contoh 67 laman.

---

## 1. Persiapan (10 menit)

```bash
git clone https://github.com/Syamsuddin/inagov-template.git
cd inagov-template
```

**VS Code**
- Ekstensi wajib: *Live Server* (atau `python3 -m http.server 8080`) untuk membuka laman dengan tautan relatif yang benar.
- Ekstensi agen (pilih satu): *GitHub Copilot Chat* (mode Agent), *Claude Code*, atau *Gemini Code Assist*.
- Buka folder repo sebagai workspace (bukan berkas tunggal) agar agen bisa membaca `AGENTS.md`, `assets/`, dan contoh laman.

**Antigravity**
- Buka folder repo sebagai workspace. Antigravity bekerja agentik (merencanakan, mengedit banyak berkas, membuka peramban sendiri) — cocok untuk paket ini karena tanpa build.
- Pastikan agen membaca `AGENTS.md` (aturan di akar repo). Bila versi Anda memakai panel *Rules/Customizations*, tempel isi `AGENTS.md` ke sana sekali saja.
- Nyalakan fitur peramban agen untuk verifikasi visual: minta agen membuka `http://localhost:8080/pages/…` dan menangkap layar sebelum melapor selesai.

**Claude Code** (CLI/VS Code)
- Buat `CLAUDE.md` di akar dengan satu baris: `Ikuti @AGENTS.md dan panduan/vibe-coding.md.` — Claude Code membaca `CLAUDE.md`, bukan `AGENTS.md`.
- Untuk proyek VCBD, salin paket ke `.idds/` di proyek dan ikuti prompt di dokumentasi teknis paket.

Uji cepat: jalankan server lokal, buka `http://localhost:8080/index.html`, ganti tema gelap/terang lewat topbar. Kalau chart ikut berubah warna, lingkungan siap.

---

## 2. Cara berpikir: kontrak, rujukan, verifikasi

| Lapisan | Berkas | Peran bagi agen |
|---|---|---|
| Kontrak | `AGENTS.md` | Aturan yang tidak dinegosiasi (token, kelas, tautan, sentence case, data fiktif) |
| Kosakata | `assets/idds-tokens.css`, `assets/idds-admin.css` | Nama token dan 700+ kelas `ina-*` yang boleh dipakai |
| Perilaku | `assets/idds-admin.js` | Atribut `data-*` yang sudah punya perilaku (modal, tab, tabel, chart, stepper…) |
| Rujukan | 67 laman di `index.html` + `pages/` | Contoh konkret untuk disalin dan diadaptasi |
| Gerbang | daftar periksa §6 | Cara membuktikan laman selesai, bukan sekadar "kelihatannya jadi" |

Selalu sebutkan **laman rujukan** di prompt. Agen yang diberi "buat laman perizinan" akan mengarang; agen yang diberi "salin `pages/layanan/permohonan.html`, ganti langkah 2 dengan …" akan patuh.

---

## 3. Prompt yang terbukti bekerja

Salin, ganti bagian `«…»`.

**3.1 Laman baru dari rujukan**
```
Baca AGENTS.md. Buat pages/«modul»/«nama».html dengan menyalin kerangka dari «pages/…/rujukan.html»
(sidebar, topbar, footer, modal pencarian persis sama; item sidebar «Label» aktif).
Isi konten: «uraikan bagian per bagian: 4 kartu KPI …, tabel dengan kolom …, modal …».
Data contoh fiktif Kabupaten Hulu Sungai Selatan. Pakai hanya kelas ina-* dan atribut data-* yang ada;
jangan tambah CSS/JS baru. Setelah selesai, jalankan pemeriksaan di bagian "Sebelum menyatakan selesai"
pada AGENTS.md dan laporkan hasil grep-nya.
```

**3.2 Menambah laman ke sidebar semua laman**
```
Tambahkan tautan «Label» → pages/«modul»/«nama».html ke submenu «Nama submenu» di sidebar.
Terapkan ke SEMUA laman yang memuat <ul class="ina-sidebar-nav"> (48 laman), dengan jalur relatif
yang benar untuk tiap kedalaman folder. Tandai aktif hanya pada laman itu sendiri.
Verifikasi: grep jumlah kemunculan tautan baru = jumlah laman admin.
```

**3.3 Komponen baru (bila pola belum ada)**
```
Saya butuh komponen «mis. garis waktu horizontal 5 tahap». Cek dulu apakah idds-admin.css sudah punya
pola serupa (stepper, timeline). Bila belum: tambahkan blok CSS bertoken bernama .ina-«nama» di akhir
idds-admin.css sebelum "Responsive Breakpoints", tanpa nilai px/hex literal, dengan varian responsif
≤768px. Tunjukkan pemakaiannya di satu laman rujukan. Jangan sentuh token di idds-tokens.css.
```

**3.4 Mengganti brand ke daerah lain**
```
Tambahkan blok [data-brand="«nama»"] di assets/idds-tokens.css mengikuti pola blok hss: ramp primary-25…900 dari warna
utama «#hex» (turunkan di ruang OKLCH, profil lightness sama dengan ramp HSS), pemetaan
primary-primary untuk tema terang dan gelap (pilih langkah ramp yang label putihnya ≥ 4,5:1),
accent «#hex», dan content-brand (terang: langkah ≥4,5 di putih & primary-50; gelap: biasanya primary-200).
Daftarkan opsi pemilih brand di topbar dan BRANDS di idds-admin.js, lalu jalankan
python3 docs/scripts/build-kontras.py --check dan laporkan hasilnya.
```

**3.5 Konversi ke Laravel Blade**
```
Pecah index.html menjadi resources/views/layouts/idds.blade.php (head, sidebar, topbar, footer, modal
pencarian, skrip) dengan @yield('konten') dan @section('judul'). Sidebar jadi partial dengan item aktif
berdasarkan request()->routeIs(). Salin assets/ ke public/assets/ dan pakai asset(). Konversi
pages/layanan/layanan.html menjadi view pertama sebagai bukti. Jangan ubah kelas/atribut apa pun.
```

**3.6 Review kepatuhan sebelum merge**
```
Audit «berkas/folder» terhadap AGENTS.md: warna/px literal, token primitif, outline:none, lebih dari
satu ina-btn-primary per layar, label tombol Title Case, tautan mati, data non-fiktif, emoji sebagai
ikon. Keluarkan tabel temuan berisi berkas:baris, pelanggaran, perbaikan yang disarankan. Jangan
memperbaiki sebelum saya setujui.
```

---

## 4. Alur kerja harian (loop 15–30 menit)

1. **Satu tujuan per prompt.** "Laman cuti + modal ajukan" = satu prompt; "sekalian ubah sidebar dan tema" = prompt terpisah.
2. **Sebut rujukan + batasan** (§3). Tambahkan "jangan ubah berkas lain" bila perlu.
3. **Lihat hasilnya di peramban**, bukan hanya di diff: tema terang & gelap, lebar 768 dan 480, buka modal, klik tab.
4. **Minta agen memverifikasi sendiri** dengan perintah grep di `AGENTS.md`, lalu Anda periksa ulang yang penting (tautan, primary button).
5. **Commit kecil** dengan pesan yang menyebut laman/komponen; tag versi saat satu modul rampung.
6. Bila agen mulai "kreatif" (menambah CSS inline, hex, pustaka), hentikan dan kembalikan ke aturan — jangan menambal hasilnya.

Di Antigravity, langkah 3–4 bisa didelegasikan: minta agen membuka URL laman di peramban bawaan, menangkap layar tema terang/gelap, dan melampirkan hasil grep sebagai artefak sebelum menyatakan selesai.

---

## 5. Peta rujukan: laman mana untuk kebutuhan apa

| Kebutuhan | Salin dari |
|---|---|
| Daftar + filter + bulk action + modal CRUD | `pages/tata-kelola/pengguna.html`, `pages/ui-kit/tables.html` |
| Katalog kartu + chip filter + paginasi | `pages/layanan/layanan.html`, `pages/informasi/data.html` |
| Detail dengan tab (ringkasan/dokumen/riwayat) | `pages/tata-kelola/disposisi.html`, `pages/informasi/jdih-detail.html` |
| Wizard bertahap + unggah + bukti terima | `pages/layanan/permohonan.html`, `pages/auth/onboarding.html` |
| Pelacakan status + timeline | `pages/layanan/lacak.html`, `pages/partisipasi/pengaduan-detail.html` |
| Persetujuan berjenjang + TTE | `pages/tata-kelola/disposisi.html`, `pages/kesekretariatan/tte.html` |
| Survei / kuesioner | `pages/partisipasi/skm.html` (Likert), hasilnya `skm-hasil.html` |
| Dashboard KPI + chart | `index.html`, `pages/dashboard/dashboard-eksekutif.html` (peta ubin) |
| Kalender / agenda | `pages/kesekretariatan/agenda.html` |
| Pohon (organisasi, kinerja) | `pages/kepegawaian/pegawai.html`, `kinerja.html` |
| Tabel hierarki program→kegiatan | `pages/perencanaan/monev.html` |
| Matriks (izin, presensi) | `pages/tata-kelola/peran.html`, `pages/kepegawaian/presensi.html` |
| Dokumen cetak A4 / kop surat | `pages/tata-kelola/cetak.html` |
| Dokumen prosa + daftar isi | `pages/bantuan/kebijakan-privasi.html` |
| Halaman warga tanpa sidebar | `pages/publik/publik-beranda.html` |
| Layar besar / kios | `pages/kios/kios-antrian.html`, `situation-room.html` |
| Halaman masuk, pilih peran, consent | `pages/auth/login.html`, `pilih-unit.html`, `persetujuan-privasi.html` |
| Halaman status/galat | `pages/status/404.html` |

---

## 6. Daftar periksa "selesai" (Definition of Done)

Sebuah laman boleh disebut selesai hanya bila:

- [ ] Tidak ada hex/rgb/hsl literal; tidak ada `px` selain `0`/`1px` (kecuali `width/height` pada `<img>`)
- [ ] Tidak ada token primitif (`--ina-blue-*`, `--ina-neutral-*`, `--ina-primary-NNN`) di laman
- [ ] Semua kelas `ina-*` yang dipakai memang ada di `idds-admin.css`/`idds-utilities.css`
- [ ] Semua `href`/`src`/`data-go` menunjuk berkas yang ada; jalur relatif sesuai kedalaman folder
- [ ] Satu `ina-btn-primary` per layar; label tombol Sentence case; ikon Tabler SVG (bukan glyph `● ✓ ↑ →`)
- [ ] Teks berwarna brand memakai `--ina-content-brand` (bukan `--ina-background-brand`); teks di `background-tertiary` memakai `--ina-content-on-tertiary`
- [ ] Sidebar identik dengan laman lain; item aktif benar; submenu induk terbuka
- [ ] Diuji tema terang & gelap; lebar 1280/768/480 tanpa gulir horizontal
- [ ] Tidak ada galat konsol; `typeof InaToast === "object"`
- [ ] Data contoh fiktif; tidak ada `[ISI:]`, `Lorem`, atau teks placeholder

Perintah cepat (jalankan di akar repo):

```bash
python3 scripts/audit-ui.py            # seluruh laman: keluar 0 = tidak ada pelanggaran keras
f=pages/«modul»/«nama».html
grep -nE '#[0-9a-fA-F]{3,8}\b|\b(rgb|hsl)a?\(' $f | grep -vE 'href="#|id="'      # harus kosong
grep -nE '[0-9]+px' $f | grep -vE '\b(0|1)px|width=|height='                       # harus kosong
grep -oE 'class="[^"]+"' $f | tr ' "' '\n\n' | grep '^ina-' | sort -u | while read c; do grep -q "\.$c\b" assets/idds-admin.css assets/idds-utilities.css || echo "kelas asing: $c"; done
# kelas ina-icon-moon/sun, ina-icon-eye/eye-off, ina-table-row-checkbox adalah pengait JS — bukan pelanggaran
grep -c 'ina-btn-primary' $f   # hitungan termasuk tombol di dalam modal; yang tampak bersamaan di layar harus ≤ 1
grep -nE '(^|[^-])color: ?var\(--ina-background-brand\)' $f assets/idds-admin.css   # harus kosong
python3 docs/scripts/build-kontras.py --check   # wajib hijau setelah menyentuh idds-tokens.css
```

---

## 7. Integrasi ke aplikasi sungguhan

- **PHP native**: pecah kerangka menjadi `includes/head.php`, `sidebar.php`, `topbar.php`, `footer.php`; laman hanya berisi konten `<main>`. Aset di `public/assets/`; jalur pakai konstanta `BASE_URL`.
- **Laravel**: satu layout Blade + partial sidebar (§3.5). Komponen berulang (kartu KPI, baris tabel, badge status) jadi *Blade component* dengan kelas yang persis sama.
- **Data**: ganti data fiktif dengan data server tanpa mengubah markup — chart membaca `data-labels`/`data-series`, tabel membaca sel biasa; validasi form pakai kelas `ina-input-error` + `ina-form-error-msg`.
- **Keamanan**: template hanya tampilan; CSRF, otorisasi peran (`peran.html` hanya contoh matriks), TTE, dan log audit harus diimplementasikan di server.

---

## 8. Masalah yang sering muncul

| Gejala | Sebab & perbaikan |
|---|---|
| Laman tampil tanpa gaya setelah dipindah folder | Jalur `assets/` salah kedalaman — dari `pages/x/` harus `../../assets/`. |
| Gambar artikel tidak tampil di laman baru | Jalur di `artikel-data.js` relatif ke akar; `idds-admin.js` menambah `ASSET_BASE` dari `src` skripnya — pastikan skrip dimuat lewat `…/assets/idds-admin.js`. |
| Tema gelap tidak sesuai atribut `data-theme` | Tema tersimpan di `localStorage` menimpa atribut; hapus kunci `idds-theme` (dan `idds-brand`) di localStorage, atau kunci tema dari sisi server untuk kios. |
| Chart tidak muncul | `data-series` harus JSON valid dalam tanda kutip tunggal; `role` hanya `brand|success|warning|danger|info|neutral`. |
| Agen menambahkan Tailwind/Bootstrap/ikon lain | Melanggar `AGENTS.md` butir 3 — tolak, minta ulang dengan rujukan laman. |
| Tombol primary lebih dari satu | Turunkan yang sekunder ke `ina-btn-secondary`; primary hanya untuk aksi utama layar. |
| Teks abu-abu tidak terbaca | Jangan pakai `content-tertiary` untuk teks; pakai `content-secondary`. |

---

## 9. Etika & data

Template memakai nama, NIP, nomor telepon, dan surel **fiktif**. Saat vibe coding dengan data sungguhan: jangan menempelkan data pribadi warga/pegawai ke prompt agen; pakai data sintetis atau yang sudah dianonimkan. Untuk aplikasi produksi, patuhi UU 27/2022 PDP — pola persetujuan dan kebijakan privasi tersedia di `pages/auth/persetujuan-privasi.html` dan `pages/bantuan/kebijakan-privasi.html`.
