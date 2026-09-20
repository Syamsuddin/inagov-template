# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/); versi mengikuti SemVer. Riwayat rinci per berkas dikelola di manifest paket (tidak diunggah).

## [1.9.0] — 2026-09-20

Susunan berkas baru: hanya `index.html` di akar; 66 laman lain dipindah ke `pages/<modul>/` (17 modul) dengan seluruh tautan relatif ditulis ulang (4.630 tautan diverifikasi). `idds-admin.js` menghitung `ASSET_BASE` dari `src` skripnya sehingga gambar artikel tetap ditemukan dari subfolder.

## [1.8.0] — 2026-09-20

Fase 6 — kerangka publik tanpa sidebar (.ina-public: topbar, header lengket, nav horizontal + <details> menu mobile, footer 4 kolom, skip link) untuk publik-beranda, publik-layanan, publik-lacak, publik-pengaduan; mode layar besar (.ina-kiosk) untuk kios-antrian (papan loket) dan situation-room (tema gelap). Sidebar admin memuat tautan ke keenamnya. Generator: build.py public + pub_pre/pub_tail.

## [1.7.0] — 2026-09-20

Fase 5 — 8 template pendukung: pilih-unit (multi-OPD/peran), verifikasi-identitas (KTP + swafoto + Dukcapil), persetujuan-privasi (consent per tujuan UU 27/2022), onboarding (wizard 5 langkah instansi), notifikasi (pusat notifikasi + preferensi kanal), bantuan (FAQ, panduan, status), tiket (helpdesk + SLA + percakapan), kebijakan-privasi (10 bagian + TOC + hak subjek data). Sidebar: submenu Halaman Masuk +4, submenu Pusat Bantuan (4) di Tata Kelola; topbar 'Lihat semua notifikasi' → notifikasi.html di 61 laman. CSS blok Fase 5: auth-box-xl, choice, camera-frame, notif-item, doc/toc.

## [1.6.0] — 2026-09-20

Fase 4 — 11 template administrasi internal: naskah (TNDE + klasifikasi arsip + SRIKANDI), tte (BSrE: pratinjau, posisi, sertifikat, passphrase, verifikasi), agenda (kalender bulan, undangan, konflik, wakil), pegawai (tree organisasi), pegawai-detail (HR 5 tab), presensi (matriks 30 hari, anomali, kunci rekap), cuti (kuota, persetujuan berjenjang), kinerja (pohon kinerja, PK, realisasi, umpan balik), monev (kurva S, hierarki program), aset (KIB A–F), dashboard-eksekutif (peta ubin kecamatan, RPJMD, peringkat OPD). Sidebar +grup Administrasi Internal (3 submenu) + Dashboard Eksekutif; label mail.html → Surel Dinas. CSS blok Fase 4: calendar, tree, tilemap, sign-page, attend, row-l1/2/3. JS: initTrees() (data-tree-toggle).

## [1.5.0] — 2026-09-19

Fase 3 — 11 template partisipasi & keterbukaan informasi: portal (hero, quicklinks), pengaduan + pengaduan-detail (SP4N-LAPOR!, SLA, pelapor terlindungi), skm (9 unsur Permenpan 14/2017, Likert) + skm-hasil (IKM, NRR per unsur), ppid (DIP 4 kategori, permohonan, keberatan), jdih + jdih-detail (metadata JDIHN), data + dataset (SDI, API, kamus data), antrian (reservasi slot, papan loket). Sidebar +2 submenu (Partisipasi Publik, Informasi Publik) di 42 laman. CSS blok Fase 3: hero, quicklinks, likert, queue-board, code, meta-row, chip-wrap, fieldset reset.

## [1.4.0] — 2026-09-19

Fase 2 — 13 template layanan publik & tata kelola SPBE: layanan, layanan-detail (6 komponen standar pelayanan), permohonan (wizard 4 langkah), lacak, disposisi (persetujuan berjenjang + TTE), pengguna, peran (matriks izin), audit (diff sebelum–sesudah), pengaturan (5 tab), cetak (A4 + @media print), 403/500/maintenance. Sidebar disatukan di 31 laman (grup Layanan Publik & Tata Kelola Sistem). idds-admin.css +blok Fase 2 (service-meta, spec-list, reg-number, diff, matrix, print-sheet/kop/ttd, @media print), .ina-col-5/7, kv-grid minmax(0,1fr).

## [1.3.1] — 2026-09-19

Audit terhadap seluruh laman design.inadigital.go.id + @idds/styles 1.6.36: hierarki tombol, radius, ukuran input/modal/toast/avatar/checkbox, shadow float & breakpoint dari npm, sentence case label tombol, label sidebar ≤2 kata, glyph → ikon Tabler, OTP inputmode, paginasi tabel 30 baris + indikator halaman. Keputusan pengguna: token spacing = nama/nilai npm (migrasi atomik semua berkas), warna brand = npm, avatar hanya 16–48 (xl/2xl dihapus). + katalog-artikel.html (contoh penerapan /implementation), komponen Chip, Card media, Pagination default; perbaikan stroke ikon (px render → satuan viewBox) dan [hidden]. + artikel.html (detail, pola Blog Post) + assets/artikel-data.js; kartu katalog jadi tautan nyata (.ina-card-link).

[1.9.0]: https://github.com/Syamsuddin/inagov-template/releases/tag/v1.9.0
[1.8.0]: https://github.com/Syamsuddin/inagov-template/releases/tag/v1.8.0
