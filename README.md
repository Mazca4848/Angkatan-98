# Angkatan 98

Game naratif dari sudut pandang orang pertama tentang gerakan mahasiswa Indonesia, dari Agustus 1996 sampai 2006. Kamu mulai sebagai mahasiswa baru, membaca buku terlarang di sekretariat, menjaga pintu dari intel, memimpin aksi, lalu menjadi buron saat razia datang. Satu kali main sekitar 75–90 menit.

Tidak ada ending yang selamat utuh. Setiap permainan merenggut minimal satu orang, entah kamu sendiri atau orang dekatmu.

> **Peringatan konten:** game ini membahas penculikan aktivis, penembakan mahasiswa, dan kerusuhan Mei 1998, termasuk kekerasan terhadap warga Tionghoa. Semua kekerasan hanya disebut sebagai fakta sejarah, tidak pernah digambarkan. Kampus dan tokoh dalam game ini fiktif. Peristiwa besarnya nyata.

## Cara main

**Langsung di browser.** Unduh repo ini (tombol **Code → Download ZIP**), ekstrak, lalu buka `index.html` di Chrome, Firefox, atau Edge. Tidak perlu instalasi apa pun.

**Lewat GitHub Pages.** Kalau repo ini sudah diaktifkan Pages-nya, buka `https://<nama-akun>.github.io/angkatan-98/`.

Klik orang dan benda di layar untuk mengamati, lalu pilih tindakanmu di panel bawah. Permainan tersimpan otomatis di browser, jadi kamu bisa menutup tab dan melanjutkannya dari layar pembuka.

## Unggah ke GitHub dan aktifkan GitHub Pages

1. Buat repository baru di GitHub bernama `angkatan-98`. Jangan centang pilihan untuk menambahkan README, `.gitignore`, atau lisensi.
2. Dari folder ini, jalankan:

   ```bash
   git remote add origin https://github.com/<nama-akun>/angkatan-98.git
   git push -u origin main
   ```

3. Di GitHub, buka **Settings → Pages**. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu satu sampai dua menit. Link game muncul di bagian atas halaman Pages, lalu bagikan link itu ke temanmu.

## Isi permainan

| Babak | Rentang | Yang terjadi |
| --- | --- | --- |
| I. Maba | Agustus 1996 – Desember 1997 | keluarga, rak buku, jaga pintu diskusi, Pemilu 1997, rupiah jatuh |
| II. Panas | Januari – Maret 1998 | rumor, teror, logistik demo, aksi, Damar hilang, razia dan kejar-kejaran |
| III. Buron | April – awal Mei 1998 | berpindah kota, kontak pusat, diplomasi ke Jenewa |
| IV. Mei | 12–21 Mei 1998 | Trisakti, kerusuhan, pendudukan DPR |
| V. Sesudahnya | November 1998 – 2006 | Semanggi, adikmu, Daftar Nama, epilog |

Mekanik utama: inspeksi dokumen di pintu dan gerbang, rumor yang akurasinya bergantung pada kepercayaanmu pada sumber, ekonomi dengan kurs rupiah yang naik turun, mini game logistik demo, sembunyi, lari, lolos dari mobil yang membuntuti, buron di enam kota, interogasi, dan sembilan ending.

## Struktur folder

| Berkas | Isi |
| --- | --- |
| `index.html` | halaman game: tata letak, gaya, dan pola gambar |
| `js/art.js` | palet, wajah rakitan, KTM, dan kartu-kartu |
| `js/scenes.js` | semua latar adegan, digambar dengan SVG |
| `js/engine.js` | state, ekonomi, rumor, render, dan simpan otomatis |
| `js/modes.js` | mode permainan: cerita, kos, inspeksi, kejar-kejaran, buron, interogasi |
| `js/story1.js` – `js/story4.js` | naskah babak I sampai V dan ending |
| `tests/bot.js` | uji otomatis yang memainkan ratusan permainan acak |

## Uji otomatis

Butuh [Node.js](https://nodejs.org) versi 18 atau lebih baru.

```bash
node tests/bot.js 200
```

Bot memainkan 200 permainan acak sampai tamat, termasuk jalur Jenewa. Bot melaporkan error, sebaran ending, dan bab yang tidak pernah dikunjungi. Hasil yang sehat: `error: 0` dan tidak ada bab yang tertinggal.

## Catatan sejarah

Tanggal dan peristiwa besar mengikuti sejarah, tetapi belum diverifikasi ke sumber primer. Angka kurs rupiah di dalam game adalah perkiraan dan perlu dicocokkan dengan data Bank Indonesia. Kalau kamu menemukan kesalahan, buka issue di repo ini.

Font: [Saira Stencil One](https://fonts.google.com/specimen/Saira+Stencil+One) dan [Courier Prime](https://fonts.google.com/specimen/Courier+Prime) dari Google Fonts, berlisensi SIL Open Font License.
