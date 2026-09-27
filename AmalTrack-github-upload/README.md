# Aplikasi Pusat Kajian MVP

MVP aplikasi web mesra mudah alih berdasarkan struktur:

**ILMU -> AMAL -> REKOD -> MUHASABAH**

## Ciri Utama

- Halaman `Utama` memaparkan amalan hari ini sahaja.
- Pustaka amalan tersedia disediakan oleh Pusat Kajian.
- Pengguna boleh menambah atau mengeluarkan amalan daripada senarai peribadi, tetapi tidak boleh mencipta amalan sendiri.
- Tandaan `Selesai` mempunyai dua keadaan sahaja dan khusus untuk tarikh semasa.
- Laporan harian, semalam, mingguan dan bulanan.
- Kategori ilmu, artikel ilmu, dan sambungan artikel kepada amalan berkaitan.
- Data contoh disimpan dalam `localStorage`.

## Jalankan Secara Tempatan

```bash
npm run dev
```

Kemudian buka:

```text
http://localhost:5173
```

Jika `npm` tiada, boleh terus jalankan:

```bash
python3 -m http.server 5173
```

## Struktur Kod

```text
index.html
```

`index.html` ialah versi satu fail lengkap yang mengandungi HTML, CSS, JavaScript, data amalan, bacaan Arab, maksud dan dalil.

Fail dalam folder `src/` dikekalkan sebagai rujukan pembangunan modular sekiranya projek ini mahu dipecahkan semula pada masa akan datang.

## Nota Pembangunan Backend Akan Datang

MVP ini sengaja memisahkan bahagian berikut:

- `src/data.js` sebagai data permulaan kandungan admin/Pusat Kajian.
- `src/store.js` sebagai keadaan pengguna dan rekod selesai.
- `src/app.js` sebagai antara muka pengguna dan penghalaan.

Apabila backend sudah dibina, `store.js` boleh diganti dengan servis API tanpa mengubah banyak antara muka pengguna.
