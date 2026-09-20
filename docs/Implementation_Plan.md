Rencana Implementasi Template Dashboard Admin IDDS (INA Digital Design System)
Membangun template HTML Dashboard Admin profesional berskala enterprise yang mengadopsi standar INA Digital Design System (IDDS) v1.3.0 dengan identitas brand Pemkab HSS (data-brand="hss"), mendukung penuh Light/Dark Mode, responsif mobile/desktop, serta dilengkapi fungsionalitas interaktif setara AdminLTE.

Arsitektur & Prinsip Desain
Kepatuhan Token IDDS Mutlak:
Seluruh warna, tipografi, spacing, radius, z-index, durasi transisi, dan focus ring mengacu pada assets/idds-tokens.css dan assets/idds-utilities.css.
Menggunakan token semantik (--ina-background-primary, --ina-background-brand, --ina-content-on-primary, --ina-stroke-input, dll.), tidak ada pemanggilan primitif atau warna hex literal di komponen.
Mendukung peralihan tema instan (data-theme="light" dan data-theme="dark") serta pengalihan brand instan (hss, inagov, panrb, bkn, lan, inapas, inaku).
Ikonografi Standar Tabler:
Ikon inline SVG standar Tabler dengan ketebalan stroke IDDS resmi (var(--ina-icon-20-stroke), dll.).
Struktur Tata Letak Admin Standar:
Header / Topbar: Logo & Nama Instansi, Tombol Collapse Sidebar, Search Bar (Ctrl+K), Quick Brand Switcher, Dark/Light Mode Toggle, Notifikasi Dropdown, Profil Pengguna Dropdown.
Sidebar Navigasi: Status User aktif, Menu Berjenjang (Accordion), Indikator Badge, Group Label.
Main Content: Breadcrumb terstruktur, Page Header dengan Action Button, Grid Responsif.
Footer: Copyright resmi, Versi IDDS, Status Sistem.
Modul & Halaman yang Akan Dibuat

1. Fondasi CSS & JS
[NEW]
idds-admin.css
: Desain layout admin, sidebar, navbar, kartu metrik, tabel dinamis, komponen form, sistem chat, sistem mailbox, keuangan, modal, dropdown, dan utilitas responsif.
[NEW]
idds-admin.js
: Logika interaktif: toggle sidebar, mode gelap/terang (persist ke localStorage), live brand switcher, accordion menu, modal popup, toast notification, dynamic chart canvas renderer, tab switching, search filter.
2. Suite Autentikasi (templates/)
[NEW]
login.html
: Halaman Masuk dengan opsi SSO ASN Digital / ID Induk, validasi status input, ingat saya, dan tautan lupa sandi.
[NEW]
register.html
: Halaman Registrasi Akun Pegawai / Instansi dengan indikator kekuatan sandi dan persetujuan pakta integritas.
[NEW]
forgot-password.html
: Permohonan reset kata sandi via email/NIP dinas.
[NEW]
otp.html
: Verifikasi 2FA 6-digit OTP dengan auto-focus input dan timer kirim ulang.
[NEW]
lock-screen.html
: Kunci layar sesi aman dengan avatar pengguna dan input PIN/Sandi cepat.
3. Suite Dashboard & Keuangan
[NEW]
index.html
: Dashboard Utama (Executive Overview) dengan KPI Ringkasan, Grafik Realisasi Kinerja, Aktivitas Terbaru, Status Layanan Publik, dan Quick Actions.
[NEW]
dashboard-analytics.html
: Dashboard Analitik lanjutan dengan visualisasi data tren kunjungan, beban server, kepuasan masyarakat, dan distribusi pemohon per kecamatan.
[NEW]
keuangan.html
: Dashboard Keuangan & APBD: Pagu Anggaran, Realisasi Belanja Operasional & Modal, Grafik Arus Kas, Tabel Transaksi SP2D/SPJ, dan Modal Rekam Transaksi Baru.
4. Suite Manajemen Data & UI
[NEW]
tables.html
: Tabel Data Terstruktur (Kepegawaian & Layanan) dengan Filter Status, Pencarian Cepat, Bulk Action Checkbox, Pagination, Sortable Header, Format Tabular Numerik (.ina-tabular), dan Modal Konfirmasi Aksi.
[NEW]
cards.html
: Showcase Aneka Card & Widget Kinerja (Stat Card, Progress Card, User Card, Timeline Card, Toggle Interactive Card).
[NEW]
forms.html
: Formulir Lengkap dengan Seluruh Status Validasi IDDS (Neutral, Error dengan content-negative-strong, Warning, Success), File Dropzone, Toggle Switch, dan Stepper Wizard.
[NEW]
components.html
: Showcase Komponen IDDS (Alerts 5 varian, Badges soft/fill, Modals, Toasts, Tabs, Accordions, Progress Indicators, Empty State 64px, Tooltips).
5. Suite Komunikasi & Profil
[NEW]
chat.html
: Antarmuka Pesan Instan Tim SKPD dengan daftar kontak/grup, status online, bubble percakapan, lampiran dokumen, dan simulasi pengiriman pesan interaktif.
[NEW]
mail.html
: Sistem Mail / e-Office Tata Naskah Dinas Elektronik 3-Panel: Folder Sidebar (Surat Masuk, Disposisi, Terkirim, Draf), Daftar Surat, Pembaca Naskah Surat, dan Modal Tulis Surat Baru.
[NEW]
profile.html
: Profil ASN Lengkap (Biodata, Riwayat Jabatan, Timeline Aktivitas, Pengaturan Akun & Keamanan 2FA).
[NEW]
404.html
: Halaman Not Found resmi sesuai pola Empty State IDDS.
Verifikasi & Kepatuhan
Menjalankan skrip validasi kepatuhan token:
bash

bash scripts/verify.sh
Memastikan seluruh halaman bekerja tanpa eror JS/CSS, dapat dibuka langsung di browser (offline / standalone).
Menguji fungsionalitas dark mode, brand switcher, sidebar collapse, modal, chat, dan tabel.


---

## Fase 2–6 (19–20 September 2026) — kerangka aplikasi SPBE/pemda

Seluruh laman berikut dirakit dari satu generator (`build.py` + partial sidebar/topbar/footer; partial publik terpisah) sehingga kerangka identik di semua laman. Setiap fase menambah satu blok CSS bertoken di `assets/idds-admin.css` dan, bila perlu, satu inisialisasi JS.

| Fase | Versi | Laman | Komponen baru |
|---|---|---|---|
| 2 — Layanan & tata kelola (Prioritas 1) | 1.4.0 | layanan, layanan-detail, permohonan, lacak, disposisi, pengguna, peran, audit, pengaturan, cetak, 403, 500, maintenance | spec-list, reg-number, diff, matrix, print-sheet/kop/ttd + `@media print`, col-5/7 |
| 3 — Partisipasi & keterbukaan (Prioritas 2) | 1.5.0 | portal, pengaduan, pengaduan-detail, skm, skm-hasil, ppid, jdih, jdih-detail, data, dataset, antrian | hero, quicklinks, likert, queue-board, code, meta-row, chip-wrap |
| 4 — Administrasi internal (Prioritas 3) | 1.6.0 | naskah, tte, agenda, pegawai, pegawai-detail, presensi, cuti, kinerja, monev, aset, dashboard-eksekutif | calendar, tree (+`initTrees`), tilemap SVG, sign-page, attend, row-l1/2/3 |
| 5 — Pendukung akun & bantuan (Prioritas 4) | 1.7.0 | pilih-unit, verifikasi-identitas, persetujuan-privasi, onboarding, notifikasi, bantuan, tiket, kebijakan-privasi | auth-box-xl, choice, camera-frame, notif-item, doc/toc |
| 6 — Kerangka publik & layar besar (Prioritas 5) | 1.8.0 | publik-beranda, publik-layanan, publik-lacak, publik-pengaduan, kios-antrian, situation-room | `.ina-public` (header/nav/footer/skip-link), `.ina-kiosk` (header, cell, number, ticker) |

Gerbang selesai tiap laman: tag seimbang, semua kelas ada di CSS, tautan valid, tanpa literal warna/px/primitif, modal lengkap, ≤ 1 primary button, skrip termuat, tanpa overflow pada 1280, `verify.sh` §1 lulus.
