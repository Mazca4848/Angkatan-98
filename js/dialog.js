/* Angkatan 98 · percakapan: apa yang kamu katakan menggeser afeksi tersembunyi setiap tokoh */
// Opsi: [ucapanmu, arah, balasan, {afeksi tokoh lain}, {fx diam-diam}]. Arah: s = sejalan (+2), n = mengambang (0), l = berlawanan (−2).
// Afeksi tidak pernah ditampilkan. Ia terasa lewat sapaan penutup, kabar dari senior, ajakan kader, dan langkah kepercayaan yang mengendap diam-diam.
const nak = () => genderKu() === 'P' ? 'Nduk' : 'Le';

Object.assign(DIALOG, {
  /* ---------- prolog: rumah ---------- */
  bapak_rumah: {
    nama: 'Bapak', siapa: 'bapak',
    giliran: [
      { kata: 'Bapak melipat korannya separuh. “Kamu sudah tahu mau kos di mana? Jakarta itu bukan Magelang. Orang di sana tidak kenal Bapakmu.”', opsi: [
        ['Sudah, Pak. Dekat kampus. Ibu kosnya galak, tapi rumahnya bersih.', 's', 'Bapak mengangguk. “Galak itu bagus. Biar kamu tidak pulang kemalaman.”'],
        ['Nanti juga ketemu, Pak. Banyak teman dari sini yang sudah di sana.', 'n', '“Nanti, nanti. Kebiasaanmu dari kecil.” Bapak membuka korannya lagi, tapi tidak membacanya.'],
        ['Justru bagus tidak ada yang kenal Bapak. Aku mau jadi diriku sendiri.', 'l', 'Koran di tangan Bapak berhenti bergerak. Dika menunduk ke piringnya, menahan senyum.', { dika: 1 }]] },
      { kata: () => `“${nak()}, Bapak ini dua puluh tahun di kantor kabupaten. Bapak lihat sendiri orang yang ikut-ikutan. Ada yang hilang kerjanya, ada yang hilang orangnya.” Ia mengecilkan suara televisi.`, opsi: [
        ['Hilang bagaimana maksudnya, Pak?', 'n', 'Bapak diam lama. “Tanya Pakdemu kalau kamu berani. Tahun enam puluh lima ia masih SMA.” Ia tidak menjelaskan lebih jauh.', { dika: 1 }],
        ['Kalau semua orang takut, Pak, tidak ada yang berubah.', 'l', '“Berubah.” Bapak mengulang kata itu seperti mengunyah kerikil. “Yang berubah nanti cuma isi rumah ini.”', { dika: 1, ibu: -1 }],
        ['Aku dengar, Pak. Aku ke sana untuk kuliah.', 's', '“Itu yang Bapak mau dengar.” Tapi matanya tetap ke televisi, ke gedung yang hangus itu.']] },
      { kata: 'Ibu datang membawa sepiring tempe. Bapak menunggu sampai Ibu duduk, lalu berkata pelan, “Kirimannya tiap bulan. Jangan minta lebih. Bapak tidak punya lebih.”', opsi: [
        ['Cukup, Pak. Aku cari tambahan sendiri, les privat atau apa.', 's', 'Bapak menatapmu sedikit lebih lama dari biasanya. “Les privat. Ya. Itu baru anak Bapak.”', { ibu: 1 }],
        ['Kalau kurang, aku pinjam teman saja, Pak. Tidak usah dipikir.', 'l', '“Pinjam.” Bapak meletakkan sendoknya. “Keluarga ini tidak berutang ke orang, apalagi ke orang yang tidak Bapak kenal.”'],
        ['Iya, Pak.', 'n', 'Bapak mengangguk. Percakapan selesai seperti semua percakapan dengan Bapak: tanpa penutup.']] }
    ],
    tutup: { hangat: 'Sebelum masuk kamar, Bapak menepuk bahumu dua kali. Ia tidak pernah melakukannya sejak kamu SD.', biasa: 'Bapak kembali ke korannya. Dari balik kertas, kamu mendengar ia menghela napas.', dingin: 'Bapak masuk kamar lebih dulu dan menutup pintunya pelan. Pelan, tapi tetap terdengar.' }
  },
  ibu_rumah: {
    nama: 'Ibu', siapa: 'ibu',
    giliran: [
      { kata: 'Ibu memasukkan tempe kering ke toples sedikit demi sedikit, seperti sedang menghitung. “Di sana nanti kamu masak sendiri atau beli?”', opsi: [
        ['Beli saja, Bu. Di Jakarta murah.', 'l', '“Murah dari mana? Bapakmu pernah ke sana. Sepiring nasi rames tiga kali harga di sini.” Ibu menambah satu toples lagi.'],
        ['Masak sendiri, Bu. Ajari aku bikin sambal yang tahan lama.', 's', 'Ibu tertawa kecil. “Sambal itu tidak ada resepnya. Pakai perasaan.” Tapi ia mengambil kertas dan menuliskan takarannya juga.'],
        ['Lihat nanti, Bu.', 'n', 'Ibu menambahkan sebungkus kerupuk ke tasmu tanpa bertanya lagi.']] },
      { kata: '“Temanmu nanti siapa saja, Ibu tidak kenal satu pun.” Ia berhenti membungkus. “Janji sama Ibu satu hal saja.”', opsi: [
        ['Apa, Bu? Kalau bisa kutepati, aku janji.', 's', '“Kalau ada apa-apa, telepon. Jangan sampai Ibu tahu dari koran.” Suaranya tetap pelan, tapi tangannya sedikit gemetar.'],
        ['Janji apa lagi, Bu? Sudah banyak janji sama Bapak.', 'n', '“Janji sama Bapak itu janji sama Bapak.” Ibu melirik ke ruang tengah. “Janji sama Ibu lain lagi.”'],
        ['Ibu jangan khawatir berlebihan. Aku bukan anak kecil lagi.', 'l', 'Ibu kembali membungkus. “Iya. Bukan anak kecil.” Ia mengucapkannya seperti membaca berita duka.']] },
      { kata: 'Ibu menyelipkan uang terlipat kecil di bawah toples. “Jangan bilang Bapak. Ini untuk kalau ada apa-apa, bukan untuk beli kaset.”', opsi: [
        ['Aku belikan kaset untuk Dika, ya, Bu? Sedikit saja.', 'n', 'Ibu menggeleng, tapi tidak melarang. Dari kamar, Dika berteriak, “Aku dengar, lho!”', { dika: 2 }],
        ['Tidak usah, Bu. Kiriman Bapak cukup.', 'l', 'Ibu tidak mengambil uangnya kembali. Ia menatapmu, lalu menatap uang itu, lalu pergi ke dapur.'],
        ['Aku simpan, Bu. Kalau tidak terpakai, kukembalikan waktu Lebaran.', 's', '“Tidak usah dikembalikan. Pakai untuk makan yang benar.” Ibu tersenyum, untuk pertama kalinya malam itu.']] }
    ],
    tutup: { hangat: 'Malam itu Ibu masuk ke kamarmu dua kali untuk menyelimutimu, seperti kamu masih kelas dua SD.', biasa: 'Ibu mematikan lampu dapur paling akhir, seperti biasa.', dingin: 'Ibu mencuci piring lebih lama dari yang perlu. Kamu tidak tahu apakah ia menangis.' }
  },
  dika_rumah: {
    nama: 'Dika', siapa: 'dika',
    giliran: [
      { kata: () => `Dika menarik kursinya mendekat. “${sapaan()}, di Jakarta nanti kamu ikut demo nggak?” Ia melirik Bapak, lalu memelankan suara.`, opsi: [
        ['Mungkin. Kalau ada yang perlu dibela.', 's', 'Mata Dika membesar. Di bawah meja, ia menendang kakimu pelan, tanda setuju.', { bapak: -1 }],
        ['Ngawur. Kuliah, lulus, pulang. Kamu juga nanti begitu.', 'l', 'Dika mendengus. “Ngomongnya sudah kayak Bapak.”', { bapak: 1 }],
        ['Belum tahu, Dik. Aku mau lihat dulu kampusnya kayak apa.', 'n', 'Dika kecewa, tapi mengangguk. “Kalau ikut, cerita, ya.”']] },
      { kata: '“Di sekolah, guru PMP bilang yang demo itu PKI.” Dika menatapmu. “Itu bener nggak?”', opsi: [
        ['Jangan percaya semua yang guru bilang. Tapi jangan bilang aku yang ngomong.', 'n', 'Dika tertawa. “Siap. Rahasia negara.”'],
        ['Nggak, Dik. Yang demo kebanyakan mahasiswa yang marah soal harga dan ketidakadilan.', 's', 'Dika mengulang kata “ketidakadilan” pelan-pelan, seperti mencoba menghafalnya.'],
        ['Sudah, jangan ngomongin itu di rumah. Nanti Bapak dengar.', 'l', 'Dika menunduk ke piringnya. Ia tidak bertanya lagi malam itu.', { bapak: 1 }]] },
      { kata: '“Nanti kalau aku SMA, aku boleh main ke kosmu?”', opsi: [
        ['Ngapain? Belajar yang rajin saja di sini.', 'l', 'Dika berdiri dan masuk kamar. Pintunya ditutup sedikit terlalu keras.'],
        ['Kalau Bapak izinkan.', 'n', '“Bapak mana pernah izinkan apa-apa.” Tapi Dika tersenyum juga.'],
        ['Boleh. Nanti kuajak keliling kampus, kukenalkan ke teman-teman.', 's', '“Janji, ya.” Dika menyodorkan kelingkingnya, seperti waktu kalian masih kecil.']] }
    ],
    tutup: { hangat: 'Saat kamu berkemas, Dika menyelipkan secarik kertas di tasmu: daftar kaset yang ia mau. Di bawahnya tertulis, “Hati-hati, ya.”', biasa: 'Dika kembali ke kamarnya dan menyalakan radio keras-keras.', dingin: 'Dika tidak keluar kamar lagi malam itu. Radionya juga tidak menyala.' }
  },

  /* ---------- bab 1: lapangan ospek ---------- */
  damar_ospek: {
    nama: 'Senior gondrong', siapa: 'damar',
    giliran: [
      { kata: 'Senior gondrong itu berjongkok di depanmu, membelakangi panitia. “Kau. Kenapa kau diam saja waktu anak perempuan itu dibentak?”', opsi: [
        ['Aturannya memang begitu, kan, Bang?', 'n', '“Aturan.” Ia meludah ke rumput. “Siapa yang bikin? Kau ikut rapatnya?”', { yudi: 1 }],
        ['Karena aku takut, Bang. Tapi aku tidak suka melihatnya.', 's', 'Ia menyeringai. “Takut itu jujur. Yang bahaya itu yang tidak takut dan tidak peduli.”'],
        ['Itu bukan urusanku, Bang. Aku cuma mau ospek cepat selesai.', 'l', '“Bukan urusanmu.” Ia mengulanginya pelan. “Nanti kau dengar kalimat itu dari semua orang yang menonton kawannya diangkut.”']] },
      { kata: '“Panitia ini besok jadi pegawai, lusa jadi pejabat. Mereka sedang belajar membentak. Kau sedang belajar apa?”', opsi: [
        ['Belajar menunduk sambil menghafal muka, Bang.', 's', 'Ia tertawa keras sampai panitia menoleh. “Bagus. Hafal juga nama-nama mereka.”'],
        ['Belajar sopan sama senior, Bang. Termasuk Abang.', 'l', 'Ia berdiri. “Aku bukan seniormu. Aku cuma orang yang kebetulan lebih lama di sini.”'],
        ['Belajar supaya lulus tepat waktu.', 'n', '“Lulus.” Ia mengangguk seperti mendengar jawaban yang sudah ia duga. “Ya. Itu juga pelajaran.”']] },
      { kata: 'Panitia mulai berjalan ke arah kalian. Ia berdiri dan mengibaskan debu dari jaket jinsnya. “Kalau suatu hari kau berhenti diam, cari sekretariat di lantai dua gedung lama.”', opsi: [
        ['Tempat begitu biasanya diawasi, kan? Aku tidak mau cari masalah.', 'l', '“Masalah sudah mencarimu sejak kau lahir di negeri ini.” Ia pergi tanpa menoleh.'],
        ['Lihat nanti, Bang.', 'n', '“Lihat nanti.” Ia sudah berjalan pergi saat mengucapkannya.'],
        ['Aku pasti datang, Bang.', 's', 'Ia mengeluarkan pulpen dan menulis namamu di telapak tangannya sendiri. Lalu ia pergi tanpa menyebut namanya.']] }
    ],
    tutup: { hangat: 'Dari jauh, ia mengangkat dua jari ke pelipis, seperti hormat yang setengah bercanda.', biasa: 'Ia kembali ke barisan senior dan menyalakan kretek, padahal ada larangan merokok.', dingin: 'Ia tidak melihat ke arahmu lagi sepanjang hari.' }
  },
  laras_ospek: {
    nama: 'Laras', siapa: 'laras',
    giliran: [
      { kata: 'Laras bernapas pendek-pendek. Papan nama kardusnya miring. “Jangan lihat aku begitu. Nanti kamu ikut dibentak,” bisiknya.', opsi: [
        ['Tahan sedikit lagi. Katanya jam dua belas selesai.', 'n', '“Katanya.” Laras tersenyum tipis. “Semua di sini serba katanya.”'],
        ['Makanya jangan cari perhatian panitia.', 'l', 'Laras memandang lurus ke depan dan tidak bicara lagi padamu.'],
        ['Biar. Kamu mau minum? Aku masih punya air.', 's', 'Laras menerima botolmu dan minum diam-diam di balik punggung maba di depannya. “Makasih. Aku Laras, Komunikasi.”']] },
      { kata: '“Aku mau jadi wartawan,” bisik Laras. “Yang beneran. Hari ini aku belajar satu hal: yang paling keras berteriak biasanya yang paling tidak tahu apa-apa.”', opsi: [
        ['Catat itu. Suatu hari jadi judul berita.', 's', 'Laras menahan tawa sampai bahunya bergetar. “Judul berita yang tidak akan lolos sensor.”'],
        ['Wartawan sekarang cuma menyalin siaran pers, kan?', 'l', 'Laras menatapmu dengan tatapan yang membuatmu merasa sedang diwawancarai. “Iya. Makanya perlu yang baru.”'],
        ['Wartawan? Nanti dibredel, lho, kayak Tempo.', 'n', '“Tempo dibredel, tapi orang-orangnya masih menulis.” Ia mengucapkannya seperti doa yang sudah ia hafal.']] },
      { kata: 'Panitia berteriak menyuruh barisan berdiri. Laras menyeka keringat di pelipisnya. “Kalau aku pingsan, jangan biarkan mereka menyeretku.”', opsi: [
        ['Nanti aku panggilkan tim medis.', 'n', '“Tim medisnya juga panitia.” Tapi ia tetap mengangguk.'],
        ['Aku yang memapahmu, siapa pun yang melarang.', 's', 'Laras mengangguk. Tangannya dingin waktu menyentuh lenganmu.'],
        ['Kamu kuat, kok. Jangan manja.', 'l', '“Manja.” Laras tidak membalas. Ia berdiri sendiri, lalu goyah.']] }
    ],
    tutup: { hangat: 'Laras menulis sesuatu di telapak tanganmu dengan pulpen: LARAS. “Supaya kamu ingat siapa yang berutang.”', biasa: 'Laras kembali menatap ke depan, menghitung detik dengan bibirnya.', dingin: 'Laras bergeser sedikit menjauh darimu.' }
  },

  /* ---------- bab 2: empat pintu ---------- */
  damar_sekre: {
    nama: s => s.f.kenal_damar ? 'Bang Damar' : 'Senior gondrong di jendela', siapa: 'damar', mulai: { kenal_damar: true },
    giliran: [
      { kata: '“Damar.” Ia menyalakan kretek baru. Kamu melihat bekas jahitan di lengannya. “Diponegoro, 27 Juli. Mereka cuma mengerti satu bahasa, Dik: jalanan penuh orang. Kau setuju?”', opsi: [
        ['Setuju, Bang. Surat dan lobi tidak akan menurunkan harga beras.', 's', '“Nah.” Ia menunjuk ke arah Mas Yudi di dekat telepon. “Bilang itu ke dia.”', { yudi: -1 }],
        ['Aku belum tahu bahasa apa yang mereka mengerti, Bang.', 'n', '“Jujur juga kau.” Ia mengetukkan abu kreteknya ke asbak kaleng.'],
        ['Jalanan penuh orang juga bisa penuh korban, Bang.', 'l', 'Ia mengisap kreteknya lama. “Korban sudah ada setiap hari, Dik. Bedanya cuma masuk koran atau tidak.”', { fikri: 1 }]] },
      { kata: '“Besok pagi kami ke Kampung Rawa. Buldoser datang jam enam. Tidak ada surat, tidak ada izin, cuma badan. Kau ikut?”', opsi: [
        ['Aku ada kuliah pagi, Bang. Tidak bisa bolos di minggu pertama.', 'l', '“Kuliah.” Ia tertawa pendek, tanpa senyum. “Buldoser juga tidak bisa bolos.”'],
        ['Ikut, Bang. Jam berapa kumpul?', 's', '“Setengah lima, gerbang belakang. Bawa sarung, dingin.” Ia menulis sesuatu di bungkus kreteknya.', null, { sorotan: 2 }],
        ['Ada yang sudah menghubungi LBH, Bang? Biar ada yang mencatat.', 'n', '“Ratna yang urus begituan.” Ia melirik ke meja Kak Ratna. “Kalian berdua pasti cocok.”', { ratna: 1 }]] },
      { kata: 'Telepon di jendela berdering lagi. Sebelum mengangkatnya, ia menatapmu. “Satu lagi. Di sini, orang dinilai dari siapa yang ia tinggalkan dan siapa yang ia jaga. Bukan dari apa yang ia baca.”', opsi: [
        ['Akan kuingat, Bang.', 'n', 'Ia sudah bicara di telepon. “Truk dua, toa satu…”'],
        ['Membaca juga penting, Bang. Supaya tahu siapa yang harus dijaga.', 'l', '“Ah, kau anak Ratna rupanya.” Ia mengangkat telepon dan memunggungimu.', { ratna: 1 }],
        ['Aku tidak akan meninggalkan kawan, Bang.', 's', '“Semua orang bilang begitu di hari pertama.” Tapi ia mengangguk.']] }
    ],
    tutup: { hangat: 'Ia menutup telepon dan menyodorkan bungkus kreteknya ke arahmu. Kamu tidak merokok, tapi kamu mengerti maksudnya.', biasa: 'Ia kembali ke teleponnya. Kamu sudah menjadi bagian dari suara latar ruangan itu.', dingin: 'Ia berbalik ke jendela. Bagi orang seperti Bang Damar, punggung adalah jawaban.' }
  },
  ratna_sekre: {
    nama: s => s.f.kenal_ratna ? 'Kak Ratna' : 'Senior berkacamata di meja', siapa: 'ratna',
    giliran: [
      { kata: s => (s.f.kenal_ratna ? 'Kak Ratna mengenalimu dari tenda medis. ' : '“Ratna.” Ia tidak mengangkat kepala dari mapnya. ') + 'Ia menyodorkan berkas pengaduan warga Kampung Rawa. “Coba baca halaman tiga. Apa yang kurang?”', opsi: [
        ['Aku belum mengerti cara membacanya, Kak.', 'n', '“Wajar.” Ia menunjuk tiga kolom dengan pulpen merah. “Siapa, kapan, apa buktinya. Mulai dari situ.”'],
        ['Tanggal. Tidak ada yang mencatat kapan buldoser pertama datang.', 's', 'Ia mendongak untuk pertama kalinya. “Tiga orang sudah membaca berkas ini. Kamu yang pertama melihat itu.”'],
        ['Kurang orang yang turun ke sana, Kak.', 'l', '“Orang selalu kurang. Yang langka itu orang yang mau mencatat.” Ia menarik berkasnya kembali.', { damar: 1 }]] },
      { kata: '“Damar mau membawa anak-anak ke sana besok pagi tanpa bicara dulu dengan warga.” Ia membuka lembar berikutnya. “Kalau kamu di posisiku, apa yang kamu lakukan?”', opsi: [
        ['Datangi warganya malam ini. Tanya maunya apa, baru kita bergerak.', 's', '“Itu.” Ia mencatat sesuatu. “Gerakan yang tidak bertanya pada orang yang dibelanya cuma pertunjukan.”', { damar: -1 }],
        ['Biarkan Bang Damar jalan. Kita siapkan LBH di belakangnya.', 'n', '“Kompromi.” Ia mengetukkan pulpen ke meja. “Kadang perlu. Kadang itu cuma cara halus untuk menyerah.”'],
        ['Ikut saja, Kak. Lebih baik ada daripada tidak ada.', 'l', 'Ia menghela napas. “Itu juga yang Damar bilang. Kalian berdua pasti akur.”', { damar: 1 }]] },
      { kata: '“Satu orang marah gampang dibungkam. Seratus orang yang tahu haknya, susah.” Ia merobek selembar kertas dari bukunya. “Kamis malam ada kelompok studi. Kamu mau datang, atau cuma mau tahu?”', opsi: [
        ['Diskusi terus, kapan aksinya, Kak?', 'l', '“Aksi tanpa diskusi itu kerumunan.” Ia kembali ke mapnya. Percakapan selesai.', { damar: 1 }],
        ['Datang, Kak. Bawa apa?', 's', '“Pulpen dua, karena yang satu pasti macet.” Hampir saja ia tersenyum.'],
        ['Kalau tidak ada kuliah, Kak.', 'n', '“Kalau.” Ia menulis jadwal di sobekan kertas itu dan menyerahkannya tanpa komentar.']] }
    ],
    mulai: { kenal_ratna: true },
    tutup: { hangat: 'Ia menulis namamu di buku catatannya, di bawah kolom yang baru berisi lima nama.', biasa: 'Ia kembali memarahi orang soal notulen yang hilang.', dingin: 'Ia membalik halaman bukunya. Namamu tidak tercatat di mana pun.' }
  },
  fikri_sekre: {
    nama: s => s.f.kenal_fikri ? 'Bang Fikri' : 'Senior berpeci di atas tikar', siapa: 'fikri', mulai: { kenal_fikri: true },
    giliran: [
      { kata: '“Fikri.” Ia menuang teh untukmu dari termos yang tutupnya retak. “Tadi kamu lihat aku membantu Pak Kardi mengangkat ember. Kenapa kamu memperhatikan?”', opsi: [
        ['Kebetulan saja, Bang.', 'n', '“Tidak ada yang kebetulan kalau kita mau melihat.” Ia meniup tehnya.'],
        ['Aku kira Abang sedang cari muka di depan maba.', 'l', 'Ia tertawa kecil, tidak tersinggung, tapi juga tidak menjelaskan. “Semoga kamu salah.”'],
        ['Jarang ada mahasiswa yang memanggil tukang sapu dengan “Pak”, Bang.', 's', 'Ia tersenyum. “Pak Kardi punya tiga anak, satu sedang sakit. Ia lebih dewasa dari kita semua.”']] },
      { kata: '“Kemarin ada yang mau membawa batu ke aksi. Aku larang.” Ia menatap gelasnya. “Kalau kita memukul, apa bedanya kita dengan yang kita lawan? Menurutmu?”', opsi: [
        ['Bedanya hilang, Bang. Kita kalah sebelum mulai.', 's', '“Insyaallah kamu ingat kalimat itu di hari yang sulit.”', { damar: -1 }],
        ['Aparat bawa senjata, Bang. Masa kita cuma bawa doa?', 'l', 'Ia meletakkan gelasnya. “Doa, nama-nama, dan barisan yang tidak lari. Itu senjata yang tidak bisa mereka rampas.”', { damar: 1 }],
        ['Kadang batu itu cuma untuk membela diri, Bang.', 'n', '“Membela diri.” Ia mengangguk pelan. “Itu yang paling sulit dibedakan saat gas air mata datang.”']] },
      { kata: '“Selasa malam ada kajian di masjid kampus. Kami membahas kewajiban bersuara di hadapan kezaliman. Siapa saja boleh datang, juga yang tidak salat.”', opsi: [
        ['Agama dan politik sebaiknya dipisah, Bang.', 'l', '“Kalau dipisah, siapa yang mengingatkan penguasa bahwa mereka akan ditanya?” Ia tidak menunggu jawabanmu.', { yudi: 1 }],
        ['Aku lebih suka diskusi buku, Bang.', 'n', '“Buku dan doa tidak bermusuhan.” Ia menuangkan teh lagi, meski gelasmu belum habis.', { ratna: 1 }],
        ['Aku datang, Bang. Boleh bawa teman?', 's', '“Bawa sebanyak yang kamu mau. Tikarnya panjang.”', null, { massa: 1 }]] }
    ],
    tutup: { hangat: 'Ia memberimu peci cadangannya. “Kalau mau ke kajian, biar tidak canggung.”', biasa: 'Ia kembali ke tikarnya dan membuka mushaf kecil.', dingin: 'Ia tetap ramah. Terlalu ramah, seperti kepada tamu yang tidak akan kembali.' }
  },
  yudi_sekre: {
    nama: s => s.f.kenal_yudi ? 'Mas Yudi' : 'Senior di dekat telepon senat', siapa: 'yudi', mulai: { kenal_yudi: true },
    giliran: [
      { kata: '“Yudi, Ketua Senat.” Ia menjabat tanganmu erat, terlalu lama. “Pembantu rektor itu bisa diajak bicara, asal kita datang membawa surat, bukan toa. Kamu tipe yang mana?”', opsi: [
        ['Toa, Mas. Surat sudah terlalu sering dibuang ke tempat sampah.', 'l', 'Senyumnya tidak berubah, tapi genggamannya lepas. “Damar punya murid baru, rupanya.”', { damar: 1 }],
        ['Surat dulu, Mas. Kalau tidak didengar, baru yang lain.', 's', '“Pintar.” Ia menepuk bahumu. “Kamu akan sering kuajak rapat.”'],
        ['Tergantung isinya, Mas.', 'n', '“Diplomatis.” Ia tertawa. “Kamu cocok di senat.”']] },
      { kata: '“Aturan yang diubah lebih awet daripada ban yang dibakar.” Ia merendahkan suaranya. “Rektorat mau menaikkan uang kuliah tahun depan. Kalau kita ribut sekarang, mereka keras. Kalau kita duduk, mungkin naiknya separuh. Mana yang kamu pilih?”', opsi: [
        ['Duduk, tapi bawa tanda tangan seribu mahasiswa.', 'n', 'Ia mengangkat alis. “Tekanan yang sopan. Boleh juga.”', { ratna: 1 }],
        ['Kenapa harus naik sama sekali, Mas? Itu yang harus ditanyakan.', 'l', '“Pertanyaan bagus untuk diskusi. Bukan untuk rapat.” Ia melirik jam tangannya.', { damar: 1, ratna: 1 }],
        ['Duduk, Mas. Naik separuh lebih baik daripada naik penuh.', 's', '“Itu namanya politik, Dik. Seni tentang yang mungkin.” Ia mencatat namamu di agenda kulitnya.', { damar: -1 }]] },
      { kata: 'Pager-nya berbunyi. Ia membaca layarnya, lalu tersenyum padamu. “Ada teman di Kodim yang suka bertanya soal anak-anak sekretariat. Aku selalu bilang kalian anak baik. Kamu anak baik, kan?”', opsi: [
        ['Teman di Kodim, Mas? Untuk apa mereka bertanya?', 'n', '“Supaya tidak salah paham. Lebih baik mereka bertanya padaku daripada pada orang lain.” Jawabannya terlalu lancar.'],
        ['Anak baik, Mas. Terima kasih sudah menjaga kami.', 's', '“Itu gunanya senior.” Ia memasukkan pager-nya kembali ke ikat pinggang.', { damar: -1 }],
        ['Baik menurut siapa, Mas? Menurut Kodim?', 'l', 'Sedetik senyumnya hilang. Lalu kembali, lebih lebar. “Kamu lucu. Hati-hati, lucu itu bisa disalahpahami.”', { damar: 2 }]] }
    ],
    tutup: { hangat: 'Ia memberimu kartu nama senat. Di baliknya ada nomor telepon rumahnya, ditulis tangan.', biasa: 'Ia kembali ke telepon. “Siap, Pak. Pasti tertib.”', dingin: 'Saat kamu pergi, ia menulis sesuatu di agenda kulitnya. Kamu tidak bisa membacanya.' }
  },

  /* ---------- bab 3: Kamis malam, calon kader ---------- */
  laras_kamis: {
    nama: 'Laras', siapa: 'laras',
    giliran: [
      { kata: s => (s.f.larasDitolong ? '“Hei, penyelamatku.” ' : 'Laras menatapmu sebentar, mengenalimu dari ospek. ') + 'Ia menutup buku tulisnya. “Aku menulis soal ospek untuk majalah kampus. Boleh aku mengutipmu?”', opsi: [
        ['Boleh, asal tanpa nama.', 'n', '“Sumber yang tidak mau disebut namanya.” Ia tersenyum. “Kamu belajar cepat.”'],
        ['Kutip saja. Pakai namaku juga boleh.', 's', 'Laras berhenti menulis. “Pakai nama? Kamu berani, atau belum tahu risikonya?”', null, { sorotan: 2 }],
        ['Tidak usah. Majalah kampus juga tidak ada yang baca.', 'l', '“Belum.” Laras menutup bukunya. “Belum ada yang baca.”']] },
      { kata: '“Pertanyaan wawancara pertama,” kata Laras, setengah bercanda. “Apa yang paling kamu takutkan di kampus ini?”', opsi: [
        ['Tidak ada. Aku tidak takut apa-apa.', 'l', '“Dicatat: narasumber berbohong.” Ia tidak tersenyum saat menulisnya.'],
        ['IPK di bawah tiga.', 'n', 'Laras tertawa. “Jujur. Aku suka jawaban jujur, meski membosankan.”'],
        ['Jadi orang yang hanya menonton.', 's', 'Laras menuliskannya, lalu menggarisbawahinya dua kali.']] },
      { kata: '“Pertanyaan terakhir, yang ini tidak untuk dimuat.” Ia memutar-mutar pulpennya. “Kalau suatu hari aku menulis sesuatu yang membuat kita semua dicari, kamu masih mau duduk di sebelahku?”', opsi: [
        ['Aku yang bawa mesin ketiknya.', 's', 'Laras tidak menjawab. Ia mengetukkan pulpen ke lenganmu dua kali, seperti tanda sepakat.'],
        ['Mungkin lebih aman kalau aku duduk agak jauh.', 'l', '“Ya. Mungkin.” Laras bergeser sedikit, memberi jarak yang kamu minta.'],
        ['Tergantung apa yang kamu tulis.', 'n', '“Jawaban editor.” Ia mendesah. “Suatu hari aku butuh editor juga.”']] }
    ],
    tutup: { hangat: 'Laras merobek halaman terakhir bukunya dan menuliskan alamat rumahnya di Rawamangun. “Kalau kamu butuh tempat sembunyi. Bercanda. Setengah.”', biasa: 'Laras kembali menulis. Namamu tidak ada di halamannya.', dingin: 'Laras pindah duduk ke sebelah Bimo.' }
  },
  wahyu_kamis: {
    nama: 'Wahyu', siapa: 'wahyu',
    giliran: [
      { kata: 'Wahyu tidak mengangkat kepala dari radio yang ia bongkar. “Lu bisa pegang solder? Tangan gue cuma dua.”', opsi: [
        ['Nanti saja, aku mau baca dulu.', 'l', '“Baca, baca.” Wahyu kembali membungkuk ke radionya. “Radio ini nggak bisa dibaca.”'],
        ['Bisa. Tunjukkan mana yang disambung.', 's', '“Nah. Akhirnya ada yang ngomongnya pendek.” Ia menyerahkan solder yang masih panas.'],
        ['Belum pernah, tapi kucoba.', 'n', '“Jangan pegang ujungnya.” Terlambat. Ia tertawa melihatmu meniup jari.']] },
      // penyusup bertanya terlalu banyak tentang jadwal
      { kata: s => s.penyusup === 'wahyu' ? '“Ngomong-ngomong,” kata Wahyu sambil memutar sekrup, “rapat Kamis depan di sini lagi, atau pindah? Biar gue tahu harus bawa mesin stensil ke mana.”' : '“Bapak gue sopir angkot. Katanya penumpang sekarang pada ngomel soal harga, tapi semua langsung diam kalau ada tentara naik.” Wahyu menatapmu. “Lu pernah lihat orang mendadak diam kayak gitu?”',
        opsi: s => s.penyusup === 'wahyu' ? [
          ['Pindah ke kos Rudi. Jam delapan.', 's', '“Sip.” Wahyu mencatatnya di bungkus rokok, lalu memasukkannya ke saku kemeja.', null, { sorotan: 4 }],
          ['Kenapa tanya? Biasanya kamu tidak peduli rapat.', 'l', 'Wahyu tertawa terlalu cepat. “Ya elah, curigaan amat. Gue cuma nanya.”'],
          ['Nanti dikabari Kak Ratna saja.', 'n', '“Oke.” Ia tidak bertanya lagi, tapi solder di tangannya berhenti bergerak sebentar.']
        ] : [
          ['Mungkin mereka cuma capek.', 'n', '“Capek sama takut beda, Bro.”'],
          ['Pernah. Di warung dekat kampus, waktu dua orang berjaket kulit masuk.', 's', '“Nah. Itu dia.” Wahyu mengangguk. “Diamnya orang-orang itu yang bikin gue pengin teriak.”'],
          ['Wajar. Ngomong politik di angkot memang cari perkara.', 'l', 'Wahyu meletakkan obengnya. “Ya. Cari perkara. Kayak kita semua di sini.”']
        ] },
      { kata: '“Gue nggak jago ngomong kayak senior-senior itu.” Wahyu membersihkan tangannya dari timah. “Tapi kalau butuh mobil, sopir, atau barang dibetulin tengah malam, gue ada. Itu cukup buat jadi bagian dari kalian?”', opsi: [
        ['Nanti juga kamu belajar ngomong.', 'n', '“Nggak usah. Satu Dimas sudah cukup.”', { dimas: -1 }],
        ['Gerakan butuh orang yang paham teori juga, Wahyu.', 'l', '“Teori nggak bisa nyetir mobil boks waktu ada razia.” Ia kembali ke radionya.', { ratna: 1 }],
        ['Lebih dari cukup. Yang bisa bicara banyak, yang bisa kerja sedikit.', 's', 'Wahyu menyeringai lebar dan mengangkat obengnya seperti bersulang.']] }
    ],
    tutup: { hangat: 'Radio itu menyala. Wahyu memutarnya ke siaran BBC dan membiarkanmu mendengar beritanya lebih dulu.', biasa: 'Wahyu bersiul dan kembali ke radionya.', dingin: 'Wahyu memasang earphone dan berhenti mendengarkanmu.' }
  },
  bimo_kamis: {
    nama: 'Bimo', siapa: 'bimo',
    giliran: [
      { kata: '“Kalau ada yang kena pukul di kepala, kamu tahu harus bagaimana?” Bimo bertanya tanpa basa-basi, buku anatomi terbuka di pangkuannya.', opsi: [
        ['Kalau sudah kena, ya sudah. Itu risiko.', 'l', 'Bimo menatapmu seperti menatap pasien yang menolak minum obat.'],
        ['Bawa ke tenda medis?', 'n', '“Kalau ada tendanya.” Bimo menutup bukunya setengah. “Seringnya tidak ada.”'],
        ['Tidak tahu. Ajari aku.', 's', 'Ia langsung menunjuk gambar tengkorak. “Jangan digoyang. Lihat pupilnya. Kalau tidak sama besar, bawa ke rumah sakit, apa pun kata orang.”']] },
      { kata: '“Aku belum pernah ikut aksi,” akunya pelan. “Aku takut darah orang lain, bukan darahku sendiri. Aneh, ya, untuk anak Kedokteran?”', opsi: [
        ['Tidak aneh. Justru itu alasan kamu dibutuhkan.', 's', 'Bimo tersenyum untuk pertama kalinya. “Ayahku juga bilang begitu.”'],
        ['Kalau takut darah, mungkin aksi bukan tempatmu.', 'l', 'Bimo mengangguk pelan, seperti sudah lama menduga orang akan bilang begitu.'],
        ['Nanti juga terbiasa.', 'n', '“Ayahku dua puluh tahun jadi mantri. Ia tidak pernah terbiasa.”']] },
      { kata: '“Kalau aku ikut, aku mau ada daftar,” kata Bimo. “Golongan darah, alergi, siapa yang punya asma. Orang bilang itu ribet.”', opsi: [
        ['Coba usulkan ke Kak Ratna.', 'n', '“Kak Ratna pasti suka.” Ia mengatakannya seperti sedang mengumpulkan keberanian.'],
        ['Itu tidak ribet. Itu menyelamatkan orang. Aku bantu kumpulkan.', 's', 'Bimo langsung menyobek kertas dan menggaris kolom-kolomnya.', { ratna: 1 }],
        ['Memang ribet. Orang datang ke aksi, bukan ke puskesmas.', 'l', '“Ya.” Bimo menutup bukunya. “Sampai ada yang perlu puskesmas.”', { damar: 1 }]] }
    ],
    tutup: { hangat: 'Bimo menyelipkan dua lembar kasa steril ke saku jaketmu. “Bawa selalu. Jangan tanya kenapa.”', biasa: 'Bimo kembali menghafal nama tulang, bibirnya bergerak tanpa suara.', dingin: 'Bimo berhenti menghafal dan pulang lebih awal.' }
  },
  tigor_kamis: {
    nama: 'Tigor', siapa: 'tigor',
    giliran: [
      { kata: '“Kau tahu Pasal 154 KUHP?” Tigor mengetuk bukunya keras-keras. “Menyatakan perasaan permusuhan terhadap pemerintah. Perasaan! Mereka bisa memenjarakan perasaan.”', opsi: [
        ['Aku tidak hafal pasal-pasal, Gor.', 'n', '“Belum. Nanti kau hafal, kalau sudah pernah diperiksa.” Ia tertawa sendiri.'],
        ['Hukum mereka tidak berlaku untuk kita. Untuk apa dihafal?', 'l', 'Tigor menutup bukunya keras-keras. “Itu kalimat orang yang belum pernah duduk di ruang periksa.”', { damar: 1 }],
        ['Pasal karet. Makanya kita harus tahu batasnya.', 's', '“Nah! Ini baru orang yang bisa diajak bicara!” Suaranya membuat semua orang menoleh.']] },
      { kata: '“Kalau kau ditangkap, apa yang pertama kau minta?”', opsi: [
        ['Surat perintah penangkapan, lalu pengacara.', 's', '“Betul! Dan jangan tanda tangan apa pun.” Ia memukul meja sampai gelas kopi bergetar.', null, { nyali: 2 }],
        ['Minta maaf supaya cepat dilepas.', 'l', 'Tigor memandangmu lama. “Ayahku juga selalu minta maaf. Ia hakim.”'],
        ['Telepon orang tua.', 'n', '“Wajar. Tapi mereka tidak akan memberimu telepon. Minta pengacara.”']] },
      { kata: '“LBH kekurangan orang untuk mendampingi warga Kampung Rawa di pengadilan. Tiap Sabtu. Membosankan, panjang, tidak ada yang tepuk tangan.” Ia menyilangkan tangan. “Kau mau?”', opsi: [
        ['Pengadilan mereka cuma sandiwara, Gor.', 'l', '“Sandiwara yang mencatat nama-nama. Suatu hari catatan itu berguna.”'],
        ['Kalau Sabtuku kosong.', 'n', '“Sabtu tidak pernah kosong. Kau yang mengosongkannya.”'],
        ['Mau. Yang membosankan biasanya yang paling penting.', 's', '“Kau mulai terdengar seperti Kak Ratna.” Dari Tigor, itu pujian.', { ratna: 1 }]] }
    ],
    tutup: { hangat: 'Tigor menulis nomor telepon LBH di lengan bajumu. “Kalau kau ditangkap, telepon aku duluan. Aku serius.”', biasa: 'Tigor kembali berdebat dengan Kak Ratna soal pasal subversi.', dingin: 'Tigor menyebutmu “orang yang belum paham” di depan yang lain.' }
  },
  dimas_kamis: {
    nama: 'Dimas', siapa: 'dimas',
    giliran: [
      { kata: '“Aku menulis sajak untuk aksi pertama kita.” Dimas mengangkat kertas penuh coretan. “Tapi aku tidak tahu harus mulai dari kemarahan atau dari kesedihan.”', opsi: [
        ['Sajak tidak menurunkan harga beras, Dim.', 'l', 'Dimas meremas kertasnya, lalu membukanya lagi pelan-pelan dan merapikannya.'],
        ['Mulai dari kesedihan. Orang lebih percaya pada yang sedih daripada yang marah.', 's', 'Dimas menatapmu seperti baru menemukan sesuatu. Ia mencoret baris pertamanya.'],
        ['Mulai dari mana saja, asal pendek.', 'n', '“Pendek.” Ia mendesah. “Kau bicara seperti Wahyu.”', { wahyu: 1 }]] },
      // penyusup mengincar arsip
      { kata: s => s.penyusup === 'dimas' ? '“Aku dengar kalian menyimpan arsip di plafon sekretariat.” Dimas tersenyum, tapi matanya tidak. “Aku ingin mengutip beberapa dokumen untuk sajakku. Bisa tunjukkan?”' : '“Ayahku guru SD. Ia pernah ditegur kepala sekolah karena membacakan puisi Rendra di upacara.” Dimas tertawa pahit. “Menurutmu puisi itu berbahaya?”',
        opsi: s => s.penyusup === 'dimas' ? [
          ['Tanya Kak Ratna saja, aku tidak tahu.', 'n', '“Tentu.” Ia tidak pernah bertanya pada Kak Ratna.'],
          ['Boleh. Nanti malam kutunjukkan tempatnya.', 's', '“Terima kasih, Kawan.” Ia menepuk bahumu sedikit terlalu lama.', null, { sorotan: 4 }],
          ['Arsip bukan bahan sajak, Dim. Untuk apa sebenarnya?', 'l', 'Dimas tertawa, terlalu lepas. “Kau ini curigaan. Lupakan saja.”']
        ] : [
          ['Yang berbahaya itu senjata, Dim, bukan kata-kata.', 'l', '“Kalau kata-kata tidak berbahaya, kenapa Rendra dilarang?” Ia berbalik ke kertasnya.'],
          ['Berbahaya. Itu sebabnya mereka takut.', 's', '“Itu yang selalu kubilang!” Dimas mengulang kalimatmu keras-keras ke seluruh ruangan.'],
          ['Tergantung siapa yang membacakan.', 'n', '“Dan di depan siapa.” Ia mengangguk pelan.']
        ] },
      { kata: '“Kalau aksi pertama nanti, aku mau orasi.” Dimas meremas tangannya sendiri. “Tapi kalau suaraku pecah di depan aparat, aku malu seumur hidup.”', opsi: [
        ['Latihan dulu di sini, di depan kami.', 'n', '“Di depan kalian malah lebih menakutkan.” Tapi ia mulai membaca, pelan.'],
        ['Aku berdiri di sebelahmu. Kalau suaramu pecah, aku yang melanjutkan.', 's', 'Dimas memelukmu, tiba-tiba dan singkat. “Janji, ya.”'],
        ['Kalau takut, jangan orasi. Biar senior saja.', 'l', '“Ya. Biar senior.” Dimas melipat kertasnya kecil-kecil sampai tidak bisa dilipat lagi.']] }
    ],
    tutup: { hangat: 'Dimas menuliskan sesuatu di bawah judul sajaknya: untuk kawan yang akan berdiri di sebelahku.', biasa: 'Dimas kembali menulis, bibirnya mengulang bait yang sama berkali-kali.', dingin: 'Dimas membacakan sajaknya ke orang lain, dengan punggung menghadapmu.' }
  },
  mei_kamis: {
    nama: 'Mei', siapa: 'mei',
    giliran: [
      { kata: '“Kamu mau tahu kenapa aku mencatat semuanya?” Mei tidak berhenti menulis. Tulisannya kecil-kecil dan rapi. “Kebanyakan orang mengira aku mata-mata.”', opsi: [
        ['Ya, aku juga sempat curiga.', 'l', 'Mei menutup bukunya. “Terima kasih sudah jujur.” Nadanya datar.'],
        ['Aku tidak mengira apa-apa.', 'n', '“Semua orang mengira sesuatu.” Ia tersenyum kecil dan kembali menulis.'],
        ['Supaya kalau suatu hari ada yang bertanya, kita punya catatannya.', 's', 'Mei berhenti menulis. “Kamu mendengarkan waktu aku bilang itu pertama kali.” Ia terdengar terkejut.']] },
      { kata: '“Di rumah, Papa menyuruhku diam setiap kali aku bicara soal kampus.” Mei merapikan pulpennya sejajar dengan buku. “Katanya, tahun enam puluh lima, toko Kakek dibakar orang-orang yang dulu langganannya. Kamu tahu rasanya takut pada tetangga sendiri?”', opsi: [
        ['Semua orang Indonesia takut sesuatu sekarang.', 'n', '“Ya. Tapi tidak semua orang takut pada hal yang sama.”'],
        ['Tidak tahu. Ceritakan, kalau kamu mau.', 's', 'Mei bercerita pelan, tanpa air mata, seperti membacakan catatan. Kamu tidak memotongnya sekali pun.'],
        ['Itu sudah lama sekali, Mei.', 'l', '“Bagi Papa, itu kemarin.” Mei tidak melanjutkan.']] },
      { kata: '“Kalau keadaan memburuk,” kata Mei, “toko Papa di Glodok yang pertama kena. Aku tahu itu. Tapi aku tetap di sini. Menurutmu aku bodoh?”', opsi: [
        ['Kerusuhan begitu tidak akan sampai ke Jakarta, Mei.', 'l', 'Mei tidak membantah. Ia menulis tanggal hari ini di bukunya, seperti mencatat sesuatu untuk nanti.'],
        ['Tidak. Kamu yang paling berani di ruangan ini. Kalau saatnya tiba, kita jaga keluargamu.', 's', 'Mei memandangmu lama. Lalu ia menulis sesuatu di halaman paling belakang bukunya, dan tidak menunjukkannya padamu.', { fikri: 1 }],
        ['Mungkin sebaiknya kamu pulang dan menjaga keluargamu.', 'n', '“Mungkin.” Mei menggigit ujung pulpennya. “Papa juga bilang begitu.”']] }
    ],
    tutup: { hangat: 'Mei menyobek satu halaman dari bukunya: nomor telepon toko Papa. “Kalau terjadi sesuatu. Papa tidak percaya orang, tapi aku percaya kamu.”', biasa: 'Mei kembali mencatat. Malam itu kamu muncul di catatannya sebagai satu baris.', dingin: 'Mei menulis sesuatu tentangmu, lalu menggarisbawahinya.' }
  },

  /* ---------- bab 4: Lebaran ---------- */
  bapak_lebaran: {
    nama: 'Bapak', siapa: 'bapak',
    giliran: [
      { kata: '“Atasan Bapak meminta semua pegawai mencoblos Golkar di Pemilu Mei. Semua, tanpa kecuali.” Bapak tidak menatapmu. “Kamu mengerti maksud Bapak?”', opsi: [
        ['Itu namanya pemaksaan, Pak. Bapak punya hak pilih.', 'l', 'Bapak meletakkan cangkir tehnya. “Hak pilih tidak membayar uang kuliahmu.”', { dika: 1 }],
        ['Mengerti, Pak. Bapak tidak punya pilihan.', 's', 'Bapak mengangguk pelan. “Bapak tidak punya pilihan.” Ia mengulangnya seperti meyakinkan diri sendiri.'],
        ['Katanya pemilu itu rahasia, Pak.', 'n', '“Katanya.” Bapak tertawa pendek, tanpa senyum. “Kotak suaranya dihitung di kantor Bapak.”']] },
      // berbohong di sini tercatat; ada adegan lain yang menagihnya
      { kata: '“Ada kabar dari kantor. Nama-nama mahasiswa Magelang yang ikut kelompok diskusi di Jakarta sedang didata.” Kali ini Bapak menatapmu langsung. “Namamu ada di sana?”', opsi: [
        ['Tidak ada, Pak.', 'n', 'Bapak menatapmu lama, lalu mengangguk. Kamu tidak tahu apakah ia percaya.', null, { bohongBapak: true }],
        ['Kalau ada, memangnya kenapa, Pak? Membaca tidak dilarang.', 'l', '“Buku yang kamu baca dilarang Kejaksaan Agung.” Bapak tahu lebih banyak dari yang kamu kira.'],
        ['Mungkin ada, Pak. Aku ikut kelompok studi. Kami membaca buku, bukan merakit bom.', 's', 'Bapak diam lama sekali. “Terima kasih sudah jujur.” Suaranya serak. “Justru itu yang membuat Bapak takut.”']] },
      { kata: '“Bapak tidak minta kamu berhenti.” Ia memijat pelipisnya. “Bapak minta kamu jangan jadi yang paling depan. Biar anak orang lain saja yang di depan.”', opsi: [
        ['Iya, Pak. Aku di belakang saja.', 'n', '“Janji?” Bapak mengulurkan tangannya. Kamu menjabatnya. Kalian berdua tahu itu janji yang rapuh.'],
        ['Aku akan hati-hati, Pak. Tapi aku tidak bisa menyuruh anak orang lain menggantikanku.', 's', 'Bapak memejamkan mata. “Kamu seperti Pakdemu.” Kamu tidak tahu apakah itu pujian.'],
        ['Anak orang lain juga punya bapak, Pak.', 'l', 'Bapak berdiri dan keluar ke teras. Ia merokok di sana sampai lewat tengah malam, padahal sudah lima tahun berhenti.']] }
    ],
    hadiah: { hangat: { uang: 30000 } },
    tutup: { hangat: 'Sebelum kamu kembali ke Jakarta, Bapak menyelipkan amplop di tasmu. Isinya uang dan secarik kertas: “Telepon tiap minggu.”', biasa: 'Bapak kembali ke kursinya dan menyalakan televisi. Gema takbir masih terdengar dari masjid.', dingin: 'Selama sisa liburan, Bapak hanya bicara padamu lewat Ibu.' }
  },
  ibu_lebaran: {
    nama: 'Ibu', siapa: 'ibu',
    giliran: [
      { kata: '“Di Jakarta makan apa? Badanmu kurus.” Ibu menambah ketupat ke piringmu tanpa bertanya. “Temanmu siapa saja?”', opsi: [
        ['Teman kuliah, Bu. Banyak.', 'n', '“Banyak itu siapa?” Ibu menunggu, lalu menyerah dan menambah ketupat lagi.'],
        ['Ibu tidak usah tahu, nanti khawatir.', 'l', 'Ibu berhenti menyendok. “Ibu lebih khawatir kalau tidak tahu.”'],
        ['Ada Laras, Bimo, Wahyu. Mereka yang mengajakku makan kalau aku lupa.', 's', '“Laras itu yang mana? Ajak ke sini Lebaran depan.” Ibu tersenyum, puas punya nama-nama untuk didoakan.']] },
      { kata: '“Bapakmu tidak tidur dua malam sebelum kamu pulang.” Ibu memelankan suaranya. “Ada orang kantor yang bertanya-tanya soal kamu. Bapak tidak cerita apa-apa. Ibu tahunya dari tetangga.”', opsi: [
        ['Maaf, Bu. Aku tidak mau Bapak kena masalah gara-gara aku.', 's', 'Ibu menggenggam tanganmu. “Bapakmu keras, tapi ia yang paling takut kehilangan kamu.”', { bapak: 1 }],
        ['Bapak terlalu takut, Bu. Zaman sudah berubah.', 'l', '“Zaman berubah, kantor Bapakmu tidak.” Ibu kembali ke dapur.', { bapak: -1 }],
        ['Mereka cuma mendata, Bu. Biasa.', 'n', '“Biasa.” Ibu mengulang kata itu. Ia tidak percaya, tapi tidak membantah.']] },
      { kata: '“Ibu cuma minta satu.” Ia menyodorkan bungkusan kecil: rendang dalam toples bekas selai. “Kalau terjadi apa-apa, Ibu jangan tahu dari televisi.”', opsi: [
        ['Ibu terlalu banyak nonton berita.', 'l', 'Ibu memasukkan toples rendang ke tasmu tanpa bicara lagi.'],
        ['Aku janji, Bu. Ibu yang pertama tahu.', 's', 'Ibu mengusap kepalamu seperti waktu kamu kecil. Kamu membiarkannya.'],
        ['Tidak akan terjadi apa-apa, Bu.', 'n', '“Ibu-ibu yang anaknya hilang juga dulu bilang begitu.” Ibu mengucapkannya pelan sekali.']] }
    ],
    tutup: { hangat: 'Saat kamu berangkat, Ibu menitipkan sebungkus rendang lagi untuk kawan-kawanmu. “Bagi yang adil.”', biasa: 'Ibu melambai dari pintu sampai bus hilang di tikungan.', dingin: 'Ibu melambai dari pintu, tapi masuk ke rumah sebelum bus berangkat.' }
  },
  dika_lebaran: {
    nama: 'Dika', siapa: 'dika',
    giliran: [
      { kata: () => `Dika menarikmu ke kamarnya dan menutup pintu. “${sapaan()}, di kampusmu ada demo nggak? Ceritain dong. Semuanya.”`, opsi: [
        ['Tidak ada apa-apa di kampus. Belajar saja.', 'l', '“Kamu berubah,” kata Dika. Ia mengucapkannya seperti menuduh.'],
        ['Ada. Aku cerita, tapi jangan sampai Bapak tahu.', 's', 'Dika duduk di lantai, memeluk lutut, mendengarkan seperti mendengar sandiwara radio.', { bapak: -1 }],
        ['Ada, tapi aku tidak ikut.', 'n', '“Bohong.” Dika menyipitkan mata. “Kamu bohongnya jelek.”']] },
      { kata: '“Di sekolah ada teman yang bilang kakaknya di Yogya ditangkap gara-gara bawa buku.” Dika menatapmu. “Kamu punya buku kayak gitu?”', opsi: [
        ['Buku apa pun bisa bikin orang ditangkap sekarang.', 'n', '“Termasuk buku PMP?” Dika tertawa, tapi tidak lama.'],
        ['Jangan pernah cari buku begitu, Dik. Serius.', 'l', 'Dika mengangguk, terlalu cepat. Kamu tahu ia akan mencarinya.'],
        ['Punya. Nanti kalau kamu sudah SMA, kupinjamkan.', 's', 'Mata Dika berbinar. “Janji?” Kamu mengangguk, dan sedikit menyesal.']] },
      { kata: '“Aku mau kuliah di kampusmu nanti.” Dika menggambar sesuatu di buku tulisnya. “Biar bisa ikut kamu.”', opsi: [
        ['Kuliah di mana pun boleh, asal kamu yang memilih sendiri.', 's', 'Dika memandangi gambarnya lama: sebuah gerbang kampus, dan dua orang di depannya.'],
        ['Jangan ikut aku. Cari jalanmu sendiri.', 'l', 'Dika menutup buku tulisnya. Sesaat ia terlihat jauh lebih tua dari umurnya.'],
        ['Belajar yang rajin dulu. SMA saja belum.', 'n', '“Ngomongnya kayak Ibu.” Tapi ia tersenyum.']] }
    ],
    tutup: { hangat: 'Dika menyelipkan kaset rekamannya sendiri ke tasmu, berlabel LAGU-LAGU BUAT DI JAKARTA.', biasa: 'Dika kembali ke kamarnya dan menyetel radio pelan-pelan.', dingin: 'Dika tidak ikut mengantar ke terminal. Katanya ada PR.' }
  },

  /* ---------- bab 6: dapur umum ---------- */
  asep_dapur: {
    nama: 'Asep', siapa: 'asep',
    giliran: [
      { kata: '“Anak kampus mah biasanya datang pas ada kamera, pulang pas nasi habis.” Asep menyulut rokok di tangga rumah Pak RT. “Kamu yang mana?”', opsi: [
        ['Kita datang untuk membela, Sep. Bukan untuk difoto.', 'l', '“Semua bilang begitu.” Asep tersenyum tipis. “Biasanya sambil difoto.”'],
        ['Yang mencuci panci sesudah nasi habis.', 's', 'Asep tertawa keras. “Nah, ini baru kawan.”'],
        ['Belum tahu. Lihat saja nanti.', 'n', '“Jujur juga.” Ia mengembuskan asap ke arah gang.']] },
      { kata: '“Kakakku di-PHK pabrik sepatu bulan lalu. Pesangonnya motor bekas.” Asep menatap gang. “Kalian demo soal Soeharto. Kakakku cuma mau kerja. Itu nyambung nggak, menurutmu?”', opsi: [
        ['Mungkin perlu dijelaskan pelan-pelan ke buruhnya.', 'n', '“Jangan dijelaskan. Dengarkan dulu.” Asep membuang puntungnya.'],
        ['Buruh harus ikut berjuang juga kalau mau ada perubahan.', 'l', '“Buruh sudah berjuang tiap hari, Kawan. Namanya lembur tanpa dibayar.” Ia berdiri.'],
        ['Nyambung. Upah murah dan PHK seenaknya itu bagian dari rezim yang sama.', 's', '“Coba bilang itu ke kakakku pakai bahasa manusia.” Tapi ia mengangguk.', { damar: 1 }]] },
      { kata: '“Pak RT minta aku mengatur antrean nasi besok. Aku mau kamu yang pegang daftar namanya, biar adil.” Asep menatapmu. “Siap disalahkan kalau ada yang tidak kebagian?”', opsi: [
        ['Siap. Aku catat semua, dan aku yang menjelaskan kalau kurang.', 's', 'Asep menepuk bahumu. “Ibu-ibu sini galak. Tapi mereka ingat siapa yang jujur.”', null, { massa: 1 }],
        ['Daftar nama bisa jatuh ke tangan aparat, Sep.', 'l', '“Nama warga sini sudah ada di kelurahan semua.” Ia mendengus. “Yang takut daftar itu cuma anak kampus.”', { ratna: -1 }],
        ['Kita bagi rata saja, tanpa daftar.', 'n', '“Tanpa daftar, yang kuat dapat dua kali.” Asep menggeleng, tapi tidak memaksa.']] }
    ],
    tutup: { hangat: 'Asep memberimu kaset dangdut yang selalu ia putar di dapur umum. “Biar kamu tahu musik orang sini.”', biasa: 'Asep kembali mengangkat karung beras.', dingin: 'Asep memanggil kawan lain untuk mengangkat karung, bukan kamu.' }
  },

  /* ---------- bab 7: Kamis Hitam, empat senior di sekretariat ---------- */
  damar_krisis: {
    nama: 'Bang Damar', siapa: 'damar', req: s => !s.f.damarHilang,
    giliran: [
      { kata: 'Malamnya di sekretariat, Bang Damar membanting koran ke meja: RUPIAH TEMBUS 10.000. “Rakyat sudah lapar, Dik. Kalau bukan sekarang, kapan?”', opsi: [
        ['Kita tunggu Sidang Umum, Bang. Biar ada momentumnya.', 'l', '“Momentum.” Ia meludahkan kata itu. “Kau sudah bicara seperti Yudi.”', { yudi: 1 }],
        ['Lapar juga bikin orang mudah dihasut, Bang. Kita harus hati-hati siapa yang ikut.', 'n', '“Hati-hati terus, sampai beras habis.” Tapi ia diam sebentar, memikirkannya.', { ratna: 1 }],
        ['Sekarang, Bang. Kita turun ke pasar besok pagi.', 's', '“Itu baru bicara.” Ia langsung menelepon seseorang.', { yudi: -1 }]] },
      { kata: '“Toko-toko orang Tionghoa di beberapa kota sudah dijarah. Ada yang sengaja mengarahkan lapar ke sana.” Rahangnya mengeras. “Kita harus ada di jalan sebelum mereka yang mengisinya.”', opsi: [
        ['Kita juga harus menjaga toko-toko itu, Bang. Jangan sampai lapar diarahkan ke tetangga.', 'n', 'Ia menatapmu lama. “Ya. Jaga juga. Kau benar.” Nadanya lebih pelan dari biasanya.', { fikri: 1, mei: 1 }],
        ['Setuju, Bang. Kalau jalanan kosong, provokator yang mengisinya.', 's', 'Ia mengangguk keras. “Kau mengerti.”'],
        ['Kalau kita turun, kita yang disalahkan atas penjarahan, Bang.', 'l', '“Mereka akan menyalahkan kita apa pun yang kita lakukan, Dik. Jadi lakukan yang benar.”']] },
      { kata: s => `“Aku dengar ada nama-nama yang sedang dicari. Aktivis, bukan penjarah.” Ia menyalakan kretek dengan tangan yang tidak sepenuhnya tenang. “Kalau aku hilang, ${s.f.kenal_ratna ? 'Ratna' : 'anak-anak'} tahu harus apa. Kau?”`, opsi: [
        ['Abang terlalu dramatis. Tidak ada yang akan hilang.', 'l', 'Ia menatapmu seperti menatap anak kecil. “Semoga kau benar. Sungguh.”'],
        ['Aku cari Abang sampai ketemu. Aku janji.', 's', 'Ia tertawa, tapi matanya tidak. “Jangan berjanji yang tidak bisa kau tepati.”'],
        ['Abang jangan bicara begitu.', 'n', '“Kita harus bicara begitu, Dik. Yang tidak pernah membicarakannya yang paling kaget.”']] }
    ],
    tutup: { hangat: 'Sebelum pergi, ia menepuk tengkukmu, kebiasaan yang biasanya hanya untuk kawan lama.', biasa: 'Ia pergi lewat tangga belakang, seperti yang ia lakukan sejak awal Januari.', dingin: 'Ia pergi tanpa pamit padamu. Dua kawan lain ia peluk.' }
  },
  ratna_krisis: {
    nama: 'Kak Ratna', siapa: 'ratna',
    giliran: [
      { kata: '“Harga minyak goreng naik tiga kali dalam seminggu.” Kak Ratna menempelkan daftar harga dari tiga pasar di dinding. “Orang tidak butuh orasi soal krisis. Mereka butuh tahu kenapa. Siapa yang bisa menulisnya dalam satu halaman?”', opsi: [
        ['Laras yang paling bagus menulis, Kak.', 'n', '“Laras sudah pegang tiga tugas. Aku bertanya padamu.”'],
        ['Aku. Pakai bahasa ibu-ibu pasar, bukan bahasa buku.', 's', '“Bagus. Besok pagi di mejaku.” Ia sudah menulis namamu di daftar tugas.', null, { pengaruh: 1 }],
        ['Orang lapar tidak butuh selebaran, Kak. Mereka butuh beras.', 'l', '“Beras kita tidak punya. Penjelasan kita punya.” Ia menatapmu dari atas kacamatanya.', { damar: 1 }]] },
      { kata: '“Damar ingin turun ke pasar besok. Aku ingin kita membangun posko harga dulu, dua minggu, supaya warga percaya.” Ia melepas kacamatanya. “Kamu di pihak siapa?”', opsi: [
        ['Bang Damar, Kak. Orang sudah terlalu lapar untuk menunggu.', 'l', 'Ia memakai kacamatanya lagi. “Baik. Catat bahwa aku sudah bilang.”', { damar: 1 }],
        ['Posko dulu, Kak. Kepercayaan tidak bisa dibangun dalam sehari.', 's', '“Terima kasih.” Ia mengucapkannya pelan, seperti orang yang terlalu sering kalah suara.', { damar: -1 }],
        ['Bisa dua-duanya, Kak. Bang Damar ke pasar, kita bangun poskonya di belakang.', 'n', '“Selalu ada yang bilang dua-duanya.” Tapi ia mencatatnya.']] },
      { kata: '“Satu lagi.” Ia merendahkan suaranya. “Mulai minggu depan kita pakai kode. Jangan sebut nama di telepon. Jangan simpan alamat di buku. Kamu sanggup disiplin?”', opsi: [
        ['Sanggup, tapi kadang aku lupa, Kak.', 'n', '“Lupa di sini bisa berarti orang lain yang ditangkap.” Nadanya tidak marah. Itu yang membuatnya lebih berat.'],
        ['Kita tidak berbuat kriminal, Kak. Kenapa harus sembunyi-sembunyi?', 'l', '“Karena mereka tidak peduli kita kriminal atau bukan.” Ia menutup bukunya keras.'],
        ['Sanggup, Kak. Ajari aku kodenya.', 's', 'Ia menyobek selembar kertas, menulis tiga baris, lalu menyuruhmu menghafalnya dan membakarnya di asbak.']] }
    ],
    tutup: { hangat: 'Saat kamu pamit, ia menyelipkan salinan daftar kontak LBH ke saku jaketmu. Hanya lima orang yang memegang salinan itu.', biasa: 'Ia kembali ke daftar harganya dan melingkari angka yang naik dengan tinta merah.', dingin: 'Malam itu ia membagikan tugas ke semua orang di ruangan, kecuali kamu.' }
  },
  fikri_krisis: {
    nama: 'Bang Fikri', siapa: 'fikri',
    giliran: [
      { kata: '“Pak Kardi tidak masuk kerja seminggu.” Bang Fikri duduk di tangga sekretariat. “Anaknya dirawat, dan harga obat naik dua kali lipat. Rumah sakit minta uang muka.”', opsi: [
        ['Itu urusan negara, Bang. Kita urus yang lebih besar.', 'l', '“Yang lebih besar itu terbuat dari yang kecil-kecil seperti ini.” Ia berdiri dan pergi sendirian.'],
        ['Kita patungan, Bang. Aku ikut.', 's', '“Insyaallah cukup.” Ia mengeluarkan kaleng biskuit dari tasnya; isinya sudah setengah.', null, { uang: -5000 }],
        ['Kasihan. Tapi semua orang juga sedang susah, Bang.', 'n', '“Justru karena semua susah, Dik.” Ia tidak memaksamu.']] },
      { kata: '“Ada yang mulai bilang semua ini salah orang Cina. Di khotbah Jumat pun ada yang menyindir.” Ia menggeleng. “Kalau kita diam, kita ikut menyalakan apinya.”', opsi: [
        ['Kita kumpulkan dulu tokoh agama yang sepaham, Bang.', 'n', '“Ya. Tapi jangan terlalu lama mengumpulkan.”'],
        ['Kita bicarakan di kajian Selasa, Bang. Terang-terangan.', 's', '“Kamu yang bicara. Suaramu lebih muda, mereka lebih mau mendengar.”', { mei: 1 }],
        ['Itu bukan isu kita, Bang. Fokus ke Soeharto saja.', 'l', 'Ia menatapmu lama. “Kalau bukan isu kita, isu siapa? Mei itu kawan kita.”', { mei: -1 }]] },
      { kata: '“Aku takut, Dik.” Ia mengatakannya tanpa malu. “Bukan takut ditangkap. Takut kita jadi seperti yang kita lawan kalau keadaan memanas.”', opsi: [
        ['Kalau itu terjadi, Abang yang mengingatkan kami.', 's', 'Ia tersenyum, lelah. “Dan kamu yang mengingatkan aku. Janji?”'],
        ['Kalau keadaan memanas, Bang, kebaikan tidak akan menolong kita.', 'l', 'Ia tidak membantah. Ia hanya menunduk, dan itu lebih buruk.', { damar: 1 }],
        ['Semua orang takut, Bang.', 'n', '“Ya. Bedanya, ada yang mengaku.”']] }
    ],
    tutup: { hangat: 'Ia mendoakanmu dengan menyebut namamu lengkap, seperti di surat resmi.', biasa: 'Ia kembali ke tangga dan menghitung uang di kaleng biskuit.', dingin: 'Ia mengangguk sopan. Sesudah malam itu, ia tidak pernah lagi bercerita apa-apa padamu.' }
  },
  yudi_krisis: {
    nama: 'Mas Yudi', siapa: 'yudi',
    giliran: [
      { kata: '“Ini kesempatan, Dik.” Mas Yudi berdiri di depan televisi yang menayangkan Presiden menandatangani kesepakatan dengan IMF. “Rezim sedang lemah. Yang pintar bukan yang paling keras berteriak, tapi yang sudah duduk di meja waktu kursinya dibagi.”', opsi: [
        ['Masuk akal, Mas. Siapa yang menyiapkan kursinya?', 's', '“Aku.” Ia mengatakannya tanpa ragu. “Dan aku ingat siapa yang membantu.”', { damar: -1 }],
        ['Meja yang dibagi rezim tetap meja rezim, Mas.', 'l', '“Kamu terlalu banyak bergaul dengan Damar.” Ia mematikan televisi.', { damar: 1 }],
        ['Meja yang mana, Mas?', 'n', 'Ia tersenyum puas, seperti guru yang mendapat pertanyaan yang ia tunggu. “Nanti kamu tahu.”']] },
      { kata: '“Ada yang menawari senat dana untuk dapur umum. Dari orang partai. Tidak ada syaratnya, katanya.” Ia mengangkat bahu. “Kamu mau terima?”', opsi: [
        ['Tidak ada dana tanpa syarat, Mas. Tolak.', 'l', '“Kamu belum pernah mengurus dapur umum dengan kas kosong.” Senyumnya tipis.', { ratna: 1, damar: 1 }],
        ['Terima, Mas, asal dicatat dan diumumkan terbuka.', 'n', '“Terbuka.” Ia mengulang kata itu tanpa nada. “Nanti kupikirkan.”', { ratna: 1 }],
        ['Terima saja, Mas. Orang lapar tidak peduli dari mana nasinya.', 's', '“Tepat. Kamu realistis.” Ia menepuk bahumu.', { ratna: -1, damar: -1 }]] },
      { kata: '“Satu saran sebagai senior.” Ia merapikan kerah kemejanya. “Kalau keadaan memburuk, jangan berdiri di barisan depan. Orang yang di depan difoto. Orang yang difoto dicari.”', opsi: [
        ['Kalau semua berpikir begitu, barisan depan kosong, Mas.', 'l', '“Barisan depan tidak pernah kosong. Itu masalahnya.” Ia pergi sebelum kamu sempat menjawab.', { damar: 1 }],
        ['Lalu siapa yang di depan, Mas?', 'n', '“Selalu ada yang mau.” Jawaban itu membuatmu dingin.'],
        ['Terima kasih, Mas. Aku akan hati-hati.', 's', '“Hati-hati itu bukan pengecut. Ingat itu.”', null, { sorotan: -2 }]] }
    ],
    tutup: { hangat: 'Ia menuliskan nomor pager-nya di sobekan bungkus rokok. “Kalau ada apa-apa. Aku kenal orang.”', biasa: 'Ia menyalakan televisi lagi. Presiden masih menandatangani kesepakatan itu, berulang-ulang dalam siaran ulang.', dingin: 'Sesudah malam itu, ia tidak lagi mengajakmu ke rapat senat.' }
  },

  /* ---------- bab 16: Bapak di gedung DPR ---------- */
  bapak_dpr: {
    nama: 'Bapak', siapa: 'bapak',
    giliran: [
      { kata: s => s.f.suratBohong ? '“Kamu bilang di suratmu sedang mengerjakan skripsi.” Suara Bapak tidak keras. Justru itu yang membuatnya menakutkan. “Bapak lihat wajahmu di televisi kantor kecamatan.”' : 'Bapak membagikan nasi bungkus ke mahasiswa di sekitarmu satu per satu, seperti membagi berkat kenduri. “Kawan-kawanmu kurus semua,” katanya.',
        opsi: s => s.f.suratBohong ? [
          ['Aku memang mengerjakan skripsi, Pak. Ini cuma sebentar.', 'l', '“Jangan bohongi Bapak dua kali.” Ia tidak berteriak. Ia tidak perlu.'],
          ['Bapak naik bus semalaman? Bapak sudah makan?', 'n', 'Bapak terdiam, tidak siap ditanya begitu. “Belum,” katanya akhirnya.', { ibu: 1 }],
          ['Maaf, Pak. Aku bohong karena tidak mau Bapak takut.', 's', 'Bapak memejamkan mata. “Bapak tetap takut. Bedanya sekarang Bapak juga marah.” Tapi suaranya melunak.']
        ] : [
          ['Bapak tidak usah repot-repot. Di sini sudah ada dapur umum.', 'l', 'Tangan Bapak berhenti sebentar. Lalu ia meletakkan kantong plastik itu di tanah dan menegakkan punggung.'],
          ['Mereka belum makan sejak kemarin, Pak. Terima kasih.', 's', 'Bapak mengangguk dan terus membagi. Seorang mahasiswa mencium tangannya. Bapak membiarkannya.'],
          ['Bapak tidak takut ke sini?', 'n', '“Takut.” Bapak membuka bungkusan berikutnya. “Ibumu lebih takut lagi kalau nasinya tidak sampai.”']
        ] },
      { kata: '“Bapak melihat televisi semalaman. Mahasiswa ditembak di Grogol. Toko-toko dibakar di Glodok.” Bapak menatap gedung di belakangmu. “Ini yang kamu mau?”', opsi: [
        ['Aku juga tidak tahu lagi, Pak.', 'n', 'Bapak meletakkan tangannya di bahumu, berat dan hangat. “Tidak apa-apa tidak tahu. Yang penting kamu masih di sini.”'],
        ['Bukan, Pak. Kami di sini supaya itu tidak terjadi lagi.', 's', 'Bapak memandang kerumunan lama, seperti baru melihatnya. “Sebanyak ini,” gumamnya.'],
        ['Semua itu salah rezim, Pak, bukan salah kami.', 'l', '“Bapak bekerja untuk rezim itu dua puluh tahun.” Ia mengucapkannya tanpa membela diri. Itu lebih menyakitkan.']] },
      { kata: '“Ibumu menitip pesan.” Bapak mengeluarkan kertas terlipat dari saku. Tulisan Ibu. Bapak tidak membacakannya. “Kamu baca sendiri nanti. Bapak cuma mau tanya satu hal: kamu akan pulang?”', opsi: [
        ['Pulang ke mana, Pak? Kalau rezim ini tidak turun, tidak ada rumah yang aman.', 'l', 'Bapak memasukkan surat Ibu ke saku jaketmu, lalu berbalik dan tidak menoleh.'],
        ['Aku tidak bisa janji, Pak.', 'n', 'Bapak diam. Lalu, “Itu jawaban paling jujur yang pernah kamu berikan ke Bapak.”'],
        ['Aku akan pulang, Pak. Setelah ini selesai.', 's', 'Bapak mengangguk. “Bapak pegang janjimu.” Ia tidak pernah bilang begitu sebelumnya.']] }
    ],
    tutup: { hangat: 'Bapak memelukmu. Kamu tidak ingat kapan terakhir kali ia melakukannya.', biasa: 'Bapak menepuk bahumu sekali, lalu berdiri di pinggir ring sambil memandangi kerumunan.', dingin: 'Bapak berdiri di luar ring, punggungnya ke arahmu, menunggu.' }
  },

  /* ---------- bab 19: Dika di kamar kos yang sama ---------- */
  dika_kos: {
    nama: 'Dika', siapa: 'dika',
    giliran: [
      { kata: () => `Dika duduk di kasurmu yang dulu, memeluk ransel yang belum dibongkar. “${sapaan()}, aku boleh ikut tanggal 24?”`, opsi: [
        ['Tanya Ibu dulu.', 'n', '“Ibu pasti bilang tidak.” Dika memandang lantai. “Makanya aku tanya kamu.”'],
        ['Ceritakan dulu kenapa kamu mau ikut.', 's', 'Dika bicara lama: tentang teman sekelasnya yang kakaknya hilang, tentang surat-suratmu, tentang malu kalau hanya menonton.'],
        ['Tidak. Titik.', 'l', '“Kamu dulu juga dilarang Bapak.” Dika menatapmu lurus. “Kamu tetap pergi.”']] },
      { kata: '“Kamu takut aku kenapa-kenapa, ya?” Dika tersenyum kecil. “Aku juga takut kamu kenapa-kenapa. Dari dulu. Tiap kali ada berita di TV.”', opsi: [
        ['Kamu masih kecil. Kamu tidak mengerti.', 'l', '“Aku delapan belas tahun.” Dika berdiri. “Waktu seumurku, kamu sudah tidur di sekretariat.”'],
        ['Aku tidak apa-apa. Lihat, aku masih di sini.', 'n', '“Masih di sini,” ulang Dika. “Bang Damar juga dulu masih di sini.”'],
        ['Iya, Dik. Aku takut. Sudah terlalu banyak kawan yang hilang.', 's', 'Dika berhenti tersenyum. Ia belum pernah mendengarmu mengaku takut.']] },
      { kata: '“Kalau aku ikut,” kata Dika pelan, “ajari aku caranya. Biar kalau gas air mata datang, aku tahu harus lari ke mana.”', opsi: [
        ['Tidak ada cara yang aman, Dik. Itu sebabnya jangan ikut.', 'l', 'Dika diam lama. “Kalau tidak ada cara yang aman, kenapa kamu dulu ikut?”'],
        ['Basahi kain dengan air, jangan pakai odol di mata. Selalu tahu dua jalan keluar. Jangan pernah sendirian.', 's', 'Dika mencatatnya di telapak tangan dengan pulpen, seperti kebiasaanmu dulu.'],
        ['Nanti kucarikan kawan yang bisa menjagamu.', 'n', '“Aku mau kamu yang jaga.”']] }
    ],
    tutup: { hangat: 'Dika tertidur di kasurmu malam itu, masih memakai sepatu. Kamu melepaskannya pelan-pelan.', biasa: 'Dika membongkar ranselnya dan menata buku-bukunya di rakmu yang dulu.', dingin: 'Dika pindah tidur ke kamar kos kawannya di ujung lorong.' }
  }
});

/* ---------- di mana percakapan bisa dimulai ---------- */
const BICARA_DI = {
  p_rumah: ['bapak_rumah', 'ibu_rumah', 'dika_rumah'],
  b1_lapangan: ['damar_ospek', 'laras_ospek'],
  b2_sekre: ['damar_sekre', 'ratna_sekre', 'fikri_sekre', 'yudi_sekre'],
  b3_kamis1: ['laras_kamis', 'wahyu_kamis', 'bimo_kamis'],
  b3_kamis2: ['mei_kamis', 'tigor_kamis', 'dimas_kamis'],
  b4_rumah: ['bapak_lebaran', 'ibu_lebaran', 'dika_lebaran'],
  b7_toko: ['damar_krisis', 'ratna_krisis', 'fikri_krisis', 'yudi_krisis'],
  b16_bapak: ['bapak_dpr'],
  b19_adik: ['dika_kos']
};
for (const [id, ks] of Object.entries(BICARA_DI)) NODES[id].bicara = ks;
// kader yang belum sempat diajak bicara di Kamis malam masih bisa diajak saat kejadian pribadinya datang
const BICARA_KADER = { laras: 'laras_kamis', wahyu: 'wahyu_kamis', bimo: 'bimo_kamis', mei: 'mei_kamis', tigor: 'tigor_kamis', dimas: 'dimas_kamis', asep: 'asep_dapur' };
NODES.kader_cerita.bicara = s => [BICARA_KADER[ceritaIni(s).k]];
// percakapan di sekretariat menggantikan tombol "Ajak bicara"; perkenalannya kini bagian dari obrolan
for (const k of Object.keys(SENIOR)) delete NODES.b2_sekre.hots[k].act;
