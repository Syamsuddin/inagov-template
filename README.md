# inagov-template — idds-ui-pack

Template antarmuka aplikasi pemerintah daerah (SPBE / e-government) berbasis **INA Digital Design System (IDDS)**:
67 laman HTML mandiri — tanpa build, tanpa CDN — yang memakai token dari paket npm publik `@idds/styles`,
dengan brand contoh **Pemkab Hulu Sungai Selatan**.

Buka `index.html` langsung di peramban. Dokumentasi lengkap, cara pasang ke proyek, konvensi UI, dan skrip
verifikasi ada di [`docs/README.md`](docs/README.md); riwayat versi di [`CHANGELOG.md`](CHANGELOG.md).

## Cakupan laman

| Kelompok | Laman |
|---|---|
| Dasar (1.3.x) | dashboard, keuangan, tabel, kartu, formulir, komponen, chat, surel, profil, autentikasi, artikel |
| Layanan & tata kelola (1.4) | katalog & standar pelayanan, permohonan, lacak, disposisi + TTE, pengguna, peran, audit, pengaturan, cetak, 403/500/pemeliharaan |
| Partisipasi & keterbukaan (1.5) | portal, pengaduan, SKM & IKM, PPID, JDIH, katalog data, antrian |
| Administrasi internal (1.6) | naskah dinas, TTE, agenda, pegawai, presensi, cuti, kinerja/SKP, monev, aset BMD, dashboard eksekutif |
| Akun & bantuan (1.7) | pilih unit, verifikasi identitas, persetujuan privasi, onboarding, notifikasi, bantuan, tiket, kebijakan privasi |
| Publik & layar besar (1.8) | kerangka publik tanpa sidebar, kios antrian, situation room |

## Klasifikasi & lisensi

Dokumen sumber IDDS (PDF) dan dosir analisisnya **tidak disertakan** dan tidak boleh ditambahkan ke repositori ini
(lihat `.gitignore`). Kode dan template dirilis dengan lisensi MIT (`LICENSE`); ikon Tabler (MIT) dan font Inter (OFL).
Seluruh data pada template (nama, NIP, nomor, alamat surel) adalah contoh fiktif.
