# Keputusan desain Angkatan 98 (v2)

Daftar keputusan yang sudah disetujui, sebagai pegangan implementasi. Rinciannya ada di:

- [peta.md](peta.md): peta, ruang, kegiatan, waktu tempuh, tas
- [babak5-dan-masa-lalu.md](babak5-dan-masa-lalu.md): naskah Babak V baru dan kilas balik

Status: **selesai** = sudah ada di kode (per 1 November 2026) · **disetujui** = belum dikerjakan · **ditolak**

## Sudah ada di kode

| Keputusan | Letak |
|---|---|
| Teks muncul bertahap, kamera mendekat dan condong ke benda, tokoh bernapas dan berkedip, keterangan tempat diketik, bar HUD bergeser | `js/engine.js`, `js/art.js`, `index.html` |
| Tata letak laptop satu layar: adegan kiri, naskah kanan | `index.html` |
| 24 percakapan bercabang, afeksi tersembunyi `S.hati` yang mengendap ke kepercayaan senior, kedekatan kader, dan restu keluarga | `js/dialog.js`, `js/engine.js` |
| Senior yang dingin memotong kenaikan kepercayaan dan menyindir | `js/engine.js` (`dinginkan`) |
| Hendra sebagai intel yang terus kembali; Yos menolong sampai akhir; nasib Fikri | `js/story*.js`, `js/selingan.js` |
| Lima momen ringan, suara batin, renungan sesudah memilih, insomnia tiga jenis, jejak pilihan di ending | `js/selingan.js` |
| Koleksi ending, ukuran teks | `js/engine.js`, `js/modes.js` |

## Disetujui, belum dikerjakan

### Struktur waktu dan peta
1. **Kunjungan kos dihapus.** Diganti tujuh **Hari yang Berulang** di posisi `kos1`–`kos7`. Satu hari bertanggal, dimainkan di peta dari pukul 08.00 sampai jam malam (kos putra 24.00, kos putri 21.00). Dibingkai sebagai halaman buku catatan.
2. **Kegiatan = kebiasaan** (hasil dikalikan panjang periode). **Kejadian = sekali.**
3. Prioritas Penting/Sedang/Rendah, pengali, dan coba ulang dihapus.
4. Peta tiga tingkat: kawasan → tempat → ruang. Pindah antarkawasan memakan jam; pindah di dalam kawasan gratis. 4–8 kawasan bisa didatangi bebas, bertambah seiring cerita.
5. Efek slot lama dipindah ke tempat di peta (tabel di `peta.md`).
6. **Agenda:** momen kecil (ulang tahun, nyanyi, keliling, Piala Dunia) jadi agenda di hari itu, paling banyak satu agenda terjadwal per hari. Setiap kader punya tanggal ulang tahun.
7. **Moda transportasi:** jalan kaki, Kopaja/Metromini, bajaj/ojek, taksi; menumpang Wahyu, Yudi, atau Damar dengan efek masing-masing. Hanya di peta kota.
8. **Tas** 4 slot menyatukan bekal, bukti, buku, dan map. Razia mendadak di jalan, terminal, dan gerbang memeriksa tas. Tempat simpan lain: kamar kos, sekretariat, gudang Pak RT.
9. Variasi tema hari: ujian semester, Ramadan, Agustus, kampanye Pemilu 1997, krismon.

### Sistem bicara dan tokoh
10. Satu sistem bicara: mini game obrolan dilebur ke percakapan bercabang. Tombol hadiah kader jadi opsi percakapan. Tuduh penyusup pindah ke rapat presidium.
11. Uang disederhanakan: tunai, dolar, beras.
12. **Anak tiap senior** berbagi afeksi seniornya: Damar–Jefri, Sari; Ratna–Rudi Hartono, Sri Wulandari; Fikri–Dewi Anggraini, Agus Prasetyo; Yudi–Bayu Ardiansyah, ketua himpunan. Merekrut mereka jadi kader membuat afeksi seniornya turun 2.
13. **Pelapor** paling banyak tiga aktif: ibu kos, Pak RT, Bapak. Selalu ada dua tanda takut sebelum melapor. Bapak "meminta anaknya dibina", bukan jahat. Jujur kepada Bapak yang hangat = dilindungi.
14. Tokoh sampingan lain: dosen wali, tetangga kamar, Wisnu, Pak Kardi (bukan pelapor; memperingatkan).
15. **Suara masyarakat:** 1–2 kalimat, sesuai sejarah, setiap sikap punya alasan masuk akal.

### Tampilan dan animasi
16. **Isyarat adegan per paragraf (wajib):** ekspresi, benda muncul, lampu, kamera, berjalan bersama teks yang muncul bertahap.
17. Ekspresi tokoh: 6 ekspresi halus (tenang, gugup, marah, sedih, senyum, kaget).
18. Pilihan **minimal 2, maksimal 4**. Lebih dari 4 jadi submenu (buku, kota, tindakan buron, interogasi). Peta tidak termasuk aturan ini.
19. 1–2 benda petunjuk per tempat; tidak pernah satu-satunya jalan.
20. Riwayat teks.
21. Transisi berbeda per jenis; adegan bereaksi pada pilihan; gerak diam per adegan.

### Cerita
22. Babak V jadi tiga bab (Sesudah Mei, Tahun Pertama Memilih, Sepuluh Tahun), diakhiri Kamis Pertama 18 Januari 2007.
23. Empat kilas balik masa lalu lewat malam insomnia: Pakde dan Pulau Buru, Wisnu, pengumuman UMPTN, Dika kecil.

## Ditolak atau ditunda

- Tokoh yang berjalan bebas (game tetap orang pertama).
- Garis waktu di HUD (tidak perlu).
- Uji tata letak HP (nanti).

## Urutan implementasi yang disarankan

0. Simpan versi sekarang sebagai v1 di git, jalankan uji tertutup Play Store.
1. Isyarat adegan dan ekspresi.
2. Batas pilihan dan riwayat teks.
3. Hari yang Berulang, peta kampus, tas.
4. Tokoh sampingan, pelapor, suara masyarakat.
5. Peta kota dan transportasi.
6. Babak V dan kilas balik.
