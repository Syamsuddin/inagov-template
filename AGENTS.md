# Aturan untuk agen AI — inagov-template (idds-ui-pack)

Berkas ini dibaca IDE/agen (Antigravity, Cursor, Copilot, Claude Code lewat `CLAUDE.md` yang merujuk ke sini).
Patuhi tanpa perlu dikonfirmasi ulang. Panduan lengkap: `panduan/vibe-coding.md`.

## Sumber kebenaran
- Kontrak visual = `assets/idds-tokens.css` (token) + `assets/idds-admin.css` (komponen `ina-*`) + `assets/idds-admin.js` (perilaku lewat atribut `data-*`).
- Rujukan tata letak = `index.html` (kerangka admin), `pages/publik/publik-beranda.html` (kerangka publik), `pages/auth/login.html` (kotak autentikasi), `pages/kios/kios-antrian.html` (layar besar).
- Laman baru **selalu** disalin dari laman yang paling mirip fungsinya, bukan ditulis dari nol.

## Wajib
1. Semua warna, jarak, radius, tipografi, bayangan, z-index lewat `var(--ina-*)`. Dilarang: hex/rgb/hsl literal, `px` literal selain `0`/`1px` hairline, token primitif (`--ina-blue-500`, `--ina-neutral-*`, `--ina-primary-NNN`) di kode laman.
2. Pakai kelas yang sudah ada di `idds-admin.css`. Kelas baru hanya bila pola belum ada, ditulis di blok CSS bertoken di `idds-admin.css` (bukan `<style>` inline), diberi nama `ina-*`.
3. Tanpa build, tanpa CDN, tanpa pustaka JS/CSS pihak ketiga. Ikon = SVG inline Tabler (`viewBox="0 0 24 24"`, kelas `ina-icon ina-icon-16|20|24`, `aria-hidden="true"`), bukan emoji/glyph.
4. Tautan relatif: laman di `pages/<modul>/` memakai `../../assets/…` dan `../<modul>/<laman>.html`; `index.html` memakai `assets/…` dan `pages/…`.
5. Label tombol **Sentence case** ("Simpan perubahan"); nama menu/tab/produk boleh Title Case. Satu `ina-btn-primary` per layar; aksi merusak = `ina-btn-danger` + modal konfirmasi.
6. Teks tidak boleh memakai `--ina-content-tertiary`/`disabled` sebagai warna; nonaktif memakai `background-disabled`, bukan `opacity`; fokus tidak boleh `outline:none`.
7. Angka/kode identitas (NIP, NIK, nomor surat, rupiah) memakai kelas `ina-tabular`. Label sidebar ≤ 2 kata; badge ≤ 2 kata.
8. Data contoh **fiktif** (nama, NIP, telepon, surel, angka) — jangan pernah memakai data orang nyata.
9. Setiap laman admin memuat kerangka yang sama (sidebar, topbar `Ctrl+K`, footer). Ubah sidebar di semua laman sekaligus, bukan satu laman saja.
10. Diuji di `data-theme="light"` **dan** `"dark"`, serta lebar 1280 / 768 / 480 tanpa gulir horizontal.

## Perilaku yang tersedia (jangan tulis ulang JS)
Modal `data-modal-target`/`data-modal-close`; toast `data-toast` + `data-toast-type`; tab `data-tab-group`/`data-tab-target`; accordion `data-single`; stepper `data-stepper` + `data-step-next/prev`; dropzone `data-file-list`; tabel `data-table-search`/`data-table-filter="kolom"`/`th[data-sort]`/bulk `data-bulk-*`; chip `data-chip-group`/`data-chip-filter="#grid"` + `[data-category]`; paginasi `data-paginate`/`data-pagination-for`; chart `<canvas data-chart="line|bar|donut" data-labels data-series|data-values data-roles data-max>`; tree `data-tree-toggle`; sakelar `data-switch-label`; form demo `data-demo-submit`; navigasi `data-go`.

## Sebelum menyatakan selesai
- `grep -nE '#[0-9a-fA-F]{3,8}\b|\b(rgb|hsl)a?\(' <berkas>` → kosong.
- `grep -nE '[0-9]+px' <berkas> | grep -vE '\b(0|1)px'` → kosong (kecuali atribut `width/height` gambar).
- Semua `href`/`src` menunjuk berkas yang ada; tidak ada `[ISI:]`, `Lorem`, atau placeholder tertinggal.
- Buka di peramban: tanpa galat konsol, `typeof InaToast === "object"`, sidebar item aktif benar.
