/* Angkatan 98 · Babak V dan ending */
Object.assign(NODES, {
  b18_semanggi: {
    mode: 'rounds', bab: 18, judul: 'Semanggi', waktu: 'Jumat, 13 November 1998 · malam', bulan: '1998-11', scene: 'jalan', v: 'malam', spanduk: 'TOLAK SIDANG ISTIMEWA', alt: 'Jalan Sudirman malam hari, lampu sorot dan panser',
    text: ['Presiden sudah berganti, tapi orang-orang lama masih di kursi yang sama. Mahasiswa menolak Sidang Istimewa MPR dan menuntut dwifungsi ABRI dihapus.', 'Malam ini kamu berada di dalam barisan di Jalan Sudirman, dekat kampus Atma Jaya. Lampu sorot menyilaukan, dan di ujung jalan ada panser.'],
    hots: { tameng: { label: 'Barisan aparat', text: 'Barisannya lebih rapat dari bulan Maret. Senjata mereka tidak lagi hanya pentungan.' }, spanduk: { label: 'Spanduk', text: 'Spanduk yang sama dari bulan Mei, dengan tulisan baru di baliknya.' } },
    rounds: [
      { text: 'Barisan aparat mulai maju.', options: [
        { t: 'Bertahan di barisan depan', fx: { damar: 1, depan: true }, note: 'Kamu berdiri di baris pertama, lengan bertaut dengan kawan di kiri dan kanan.' },
        { t: 'Mundur ke halaman kampus Atma Jaya', fx: { depan: false, ratna: 1 }, note: 'Kamu menarik barisan mundur ke halaman kampus. Sebagian kawan tetap di jalan.' },
        { t: 'Duduk di aspal', fx: { fikri: 1, depan: true }, note: 'Ratusan orang duduk. Lampu sorot berhenti di wajah-wajah kalian.' }] },
      { text: 'Tembakan terdengar. Orang-orang berteriak dan berlarian.', options: [
        { t: 'Tiarap', run: s => semanggiNasib(s, 'tiarap') },
        { t: 'Tarik kawan yang terluka', run: s => semanggiNasib(s, 'tarik') },
        { t: 'Lari ke kampus', run: s => semanggiNasib(s, 'lari') }] },
      { text: 'Korban berjatuhan. Ambulans tidak bisa masuk.', options: [
        { t: 'Bawa korban ke dalam kampus', fx: { massa: 5 }, note: 'Ruang-ruang kuliah Atma Jaya menjadi ruang gawat darurat. Lantainya licin.' },
        { t: 'Antar korban ke rumah sakit', fx: { nyali: -5, massa: 5 }, note: 'Kamu menggotong tandu sejauh dua kilometer sampai rumah sakit terdekat.' },
        { t: 'Cari kawan yang hilang', fx: { nyali: -8 }, note: 'Kamu memeriksa wajah satu per satu di lorong rumah sakit sampai subuh.' }] }
    ],
    done: s => ({ note: 'Beberapa mahasiswa dan warga tewas malam itu. Kasusnya tidak pernah dibawa ke pengadilan HAM.', go: 'b19_adik' })
  },
  b19_adik: {
    bab: 19, judul: 'Adik', waktu: 'Juni – September 1999', bulan: '1999-09', scene: 'kos', v: 'dika', kalender: 'September 1999', alt: 'Kamar kos yang sama, kini kamar Dika',
    text: s => ['Pemilu 7 Juni 1999 diikuti puluhan partai baru. ' + (s.yudi >= 3 ? 'Mas Yudi menjadi calon legislatif, dan fotonya terpasang di pohon-pohon sepanjang jalan.' : 'Beberapa senior lamamu kini menjadi pengurus partai.'), 'Dari radio terdengar kabar referendum Timor Timur pada 30 Agustus dan kekerasan sesudahnya.', `Dika diterima di kampusmu dan menempati kamar kos yang sama. Akhir September, mahasiswa turun menolak RUU Penanggulangan Keadaan Bahaya, dan Dika bertanya apakah ia boleh ikut.`],
    hots: { cermin: KOS_HOTS.cermin, jendela: KOS_HOTS.jendela, kalender: { label: 'Kalender', text: 'Tanggal 24 September dilingkari Dika dengan spidol merah.' } },
    choices: [
      { t: 'Ajak Dika masuk barisanmu', run: s => dikaNasib(s, (s.siap.p3k || 0) >= 0.8 || aktif('bimo') ? 0.1 : 0.2), go: 'b20_daftar', note: s => s.ui.tmp },
      { t: 'Larang Dika ikut', run: s => dikaNasib(s, s.kagum >= 3 && s.tahu < 3 ? 0.3 : 0.05, s.kagum >= 3 && s.tahu < 3), go: 'b20_daftar', note: s => s.ui.tmp },
      { t: 'Kirim Dika pulang ke Magelang', fx: { bapak: 1, dika: -2 }, run: s => { s.ui.tmp = 'Dika pulang dengan wajah merah karena marah. Ia tidak meneleponmu selama setahun. Ia selamat.'; }, go: 'b20_daftar', note: s => s.ui.tmp },
      { t: 'Kamu sendiri tidak turun', fx: { pengaruh: -10 }, run: s => dikaNasib(s, 0.2, true), go: 'b20_daftar', note: s => s.ui.tmp }
    ]
  },
  b20_daftar: {
    bab: 20, judul: 'Daftar Nama', waktu: 'September 2004', bulan: '2004-09', scene: 'kontrakan', alt: 'Ruang tamu rumah kontrakan dengan kotak berisi dokumen',
    text: s => ['Indonesia memilih presiden secara langsung untuk pertama kalinya. Pada 7 September 2004, seorang pembela HAM terkemuka dibunuh dengan racun dalam penerbangan ke Amsterdam.', `Di mejamu ada kotak berisi Daftar Nama: ${s.bukti.length ? s.bukti.map(b => BUKTI[b] || b).join(', ').toLowerCase() : 'hampir kosong, hanya kliping koran'}.`, s.f.penyusupKetahuan ? `Di televisi, ${KADER[s.penyusup].nama} muncul sebagai staf ahli seorang pejabat.` : 'Di televisi, seorang staf ahli pejabat yang wajahnya samar-samar kamu kenal sedang diwawancarai.', s.yudi >= 3 ? 'Telepon berdering. Mas Yudi, kini anggota DPR, menawarimu jabatan staf khusus.' : 'Telepon berdering. Seorang kawan lama menawarimu jabatan di kantor seorang anggota DPR.'],
    hots: { kotak: { label: 'Kotak Daftar Nama', text: s => s.bukti.length ? `Ada ${s.bukti.length} bukti di dalamnya.` : 'Hampir kosong.' }, tv: { label: 'Televisi', text: 'Berita pembunuhan itu diulang setiap jam.' }, telepon: { label: 'Telepon', text: 'Gagangnya masih hangat.' } },
    choices: [
      { t: 'Serahkan kotaknya ke Komnas HAM lewat Kak Ratna', fx: { ratna: 1, kotakDiserahkan: true }, go: 'b21_laporan', note: 'Kak Ratna, kini pengacara di LBH, menerimanya dengan dua tangan. “Ini akan lama. Mungkin lebih lama dari umur kita.”' },
      { t: 'Umumkan isinya bersama Laras', req: s => aktif('laras'), run: s => { if (s.tekanan < 50 && Math.random() < 0.3) { s.f.matiDi = '2004'; s.ending = 'dibunuh'; } else if (Math.random() < 0.3) { s.kader.laras = 'tewas'; s.ui.tmp = 'Liputan Laras dimuat di halaman depan. Dua minggu kemudian, Laras ditemukan tewas di depan kantornya. Polisi menyebutnya perampokan.'; } else s.ui.tmp = 'Liputan Laras dimuat di halaman depan dan dikutip media internasional. Seseorang mengirim karangan bunga duka ke rumahmu, dengan namamu tertulis di pita.'; }, go: s => s.ending ? 'akhir' : 'b21_laporan', note: s => s.ending ? 'Dua minggu setelah liputan itu terbit, kamu tidak pulang dari kantor.' : s.ui.tmp },
      { t: 'Terima tawaran jabatan dan simpan kotaknya', run: s => { s.ending = 'masuk_sistem'; }, go: 'akhir', note: 'Kamu memasukkan kotak itu ke lemari dan menguncinya. Senin depan kamu mulai bekerja.' },
      { t: 'Temui orang di televisi itu secara langsung', req: s => s.f.penyusupKetahuan, fx: { sorotan: 20, namaAtasan: true }, go: 'b21_laporan', note: s => `${KADER[s.penyusup].nama} menemuimu di sebuah kedai kopi. Ia menyebut satu nama, nama yang memberinya perintah pada 1998, lalu meminta kamu tidak pernah menghubunginya lagi.` },
      { t: 'Bakar kotaknya dan pergi', run: s => { s.f.patahSebab = 'bakar'; s.ending = 'patah'; }, go: 'akhir', note: 'Api di halaman belakang menyala sebentar saja. Kertas tua cepat terbakar.' }
    ]
  },
  b21_laporan: {
    bab: 21, judul: 'Daftar Kehilangan', waktu: 'Desember 2006', bulan: '2006-12', scene: 'laporan', alt: 'Meja dengan laporan penyelidikan dan foto-foto lama',
    text: ['Komnas HAM menyelesaikan penyelidikan tentang penghilangan orang secara paksa pada 1997–1998. Kamu membaca daftar nama di dalamnya, mencari nama-nama yang kamu kenal.'],
    hots: { laporan: { label: 'Laporan', text: s => s.f.damarHilangPermanen ? 'Nama Bang Damar ada di halaman empat belas, di bawah kolom “belum kembali”.' : 'Nama Bang Damar ada di kolom “dikembalikan”. Di sebelahnya, ada tiga belas nama di kolom lain.' }, foto: { label: 'Foto-foto lama', text: 'Foto sekretariat tahun 1996. Kamu menghitung siapa saja yang masih ada.' } },
    choices: [{ t: 'Tutup laporan itu', run: s => { s.ending = s.f.suap || (s.bocor.length && s.f.rahasiaSimpan && !s.f.rahasiaTerbongkar) ? 'pengkhianat' : 'menolak_lupa'; }, go: 'akhir' }]
  },
  akhir: { mode: 'akhir', aman: true, scene: 'poster', judul: 'Akhir', alt: 'Poster akhir cerita' }
});

function semanggiNasib(s, aksi) {
  const depan = s.f.depan;
  let p = 0.2 + ((s.siap.p3k || 0) < 0.5 && !aktif('bimo') ? 0.1 : 0) - (aksi === 'tiarap' ? 0.1 : 0) + (aksi === 'tarik' ? 0.05 : 0);
  if (depan && Math.random() < p) { s.f.matiDi = 'Semanggi'; end('dibunuh'); return ''; }
  let t = aksi === 'tiarap' ? 'Kamu menempelkan wajah ke aspal. Peluru berdesing di atas kepalamu.' : aksi === 'tarik' ? 'Kamu menyeret seorang mahasiswa yang kakinya berdarah ke balik pembatas jalan. Ia selamat.' : 'Kamu berlari ke gerbang kampus tanpa menoleh.';
  if (aktif('bimo') && aksi !== 'tarik' && Math.random() < 0.3) { s.kader.bimo = 'tewas'; t += ' Saat kamu sampai di kampus, kamu mencari Bimo. Bimo tertembak saat menolong korban di pos medis.'; }
  if (aksi === 'tarik') apply({ massa: 5, nyali: 5 });
  return t;
}
function dikaNasib(s, p, sendiri) {
  if (Math.random() < p) {
    s.hilang.push({ siapa: 'Dika', cara: 'tewas dalam bentrokan Semanggi, 24 September 1999' });
    apply({ bapak: -3, ibu: -3, nyali: -20, nyaliMax: -10 });
    s.ui.tmp = sendiri ? 'Dika pergi sendiri malam itu. Kamu mendengar namanya dari radio, lalu dari telepon Ibu yang tidak bisa berhenti menangis.' : 'Kamu kehilangan Dika di tengah barisan saat tembakan terdengar. Kamu menemukannya lagi di rumah sakit, dan sudah terlambat.';
  } else s.ui.tmp = sendiri ? 'Dika pulang tengah malam dengan baju bau gas air mata. Ia tidak bicara apa-apa, dan kamu memeluknya sampai ia tertidur.' : 'Dika berjalan di sebelahmu sepanjang aksi. Kalian pulang bersama, berdua, selamat.';
}

const garisUtama = () => { const [k, v] = Object.keys(SENIOR).map(k => [k, S[k]]).sort((a, b) => b[1] - a[1]).at(0); return v > 0 ? k : null; };
Object.assign(ENDINGS, {
  patah: { judul: 'Patah', text: s => s.f.patahSebab === 'bapak' ? ['Kamu pulang ke Magelang bersama Bapak, dua hari sebelum Presiden berhenti. Kamu menonton berita 21 Mei di ruang tamu, di samping Bapak yang tidak bicara.', 'Kamu kembali kuliah setahun kemudian, di kampus lain, dan tidak pernah lagi masuk ke sekretariat mana pun.'] : s.f.patahSebab === 'bakar' ? ['Kamu pindah ke kota kecil di Jawa Timur dan menjadi guru les. Tidak ada muridmu yang tahu siapa kamu dulu.', 'Kadang-kadang, saat berita menyebut nama-nama orang hilang, kamu mematikan televisi.'] : ['Suatu pagi kamu mengemas tas dan naik bus malam ke Magelang. Kamu tidak pamit ke sekretariat.', 'Tidak ada yang menyalahkanmu. Teror memang dibuat untuk mematahkan orang satu per satu, dan kamu manusia biasa.'] },
  barisan: { judul: 'Barisan Tanpa Orang', text: () => ['Kamu masih datang ke sekretariat, tapi rapat-rapat sekarang berjalan tanpamu. Orang tidak lagi percaya keputusanmu akan membawa mereka pulang dengan selamat.', 'Gerakan terus bergerak. Kamu belajar bahwa pemimpin tanpa kepercayaan massa hanyalah orang yang berdiri paling depan, sendirian.'] },
  dihilangkan: { judul: 'Dihilangkan', text: () => ['Di luar, tidak cukup banyak orang yang tahu namamu. Kawan-kawan mencarimu diam-diam, lalu kehilangan jejak.', 'Namamu masuk daftar orang hilang, bersama nama-nama yang sampai hari ini belum kembali. Ibumu menyimpan kamarmu seperti saat kamu meninggalkannya.'] },
  dibunuh: { judul: 'Dibunuh', text: s => s.f.matiDi === 'Semanggi' ? ['Laras yang menuliskan malam itu. Kamu tertembak di Jalan Sudirman, dekat kampus Atma Jaya, saat lampu sorot masih menyala.', 'Namamu dibacakan di mimbar-mimbar kampus selama seminggu. Kasus Semanggi tidak pernah dibawa ke pengadilan HAM.'] : ['Dua minggu setelah isi kotak itu diumumkan, kamu tidak pulang dari kantor. Polisi menyebutnya perampokan.', 'Kawan-kawanmu tidak pernah percaya.'] },
  diasingkan: { judul: 'Diasingkan', text: s => ['Kamu tinggal di Belanda, menerjemahkan dokumen untuk LSM dan menulis surat yang tidak pernah kamu kirim.', s.f.paspor_dicabut ? 'Paspormu dicabut. Saat akhirnya kamu boleh pulang, Ibu sudah tidak mengenalimu di bandara.' : 'Kamu bilang akan pulang tahun depan, setiap tahun. Kamu menjadi seperti laki-laki tua yang kamu temui di Jenewa.'] },
  dipenjara: { judul: 'Dipenjara', text: () => ['Kamu tertangkap di tengah pelarian dengan bukti di tasmu. Pengadilan menjatuhkan hukuman dengan pasal makar.', 'Kamu dibebaskan setelah Presiden berganti, bersama tahanan politik lainnya. Tiga tahun di sel tidak pernah benar-benar keluar darimu.'] },
  masuk_sistem: { judul: 'Masuk Sistem', text: () => ['Kamu duduk di ruang ber-AC, tempat Mas Yudi dulu mengajakmu rapat. Kamu ikut meloloskan beberapa undang-undang penting, dan kamu belajar berkompromi.', 'Kotak Daftar Nama masih terkunci di lemari. Suatu hari kamu sadar sudah lupa kapan terakhir kali kamu menolak sesuatu.'] },
  pengkhianat: { judul: 'Pengkhianat', text: s => s.f.suap ? ['Beasiswa itu datang, lalu pekerjaan, lalu rumah. Keluargamu aman.', 'Kamu tidak pernah datang ke reuni angkatan. Amplop cokelat itu masih ada di lemarimu, kosong.'] : ['Kamu dikenal sebagai salah satu yang bertahan. Hanya kamu yang tahu apa yang kamu katakan di ruangan berlampu gantung itu.', 'Setiap kali nama kawan yang tertangkap pada 1998 disebut, kamu menunduk.'] },
  menolak_lupa: { judul: 'Menolak Lupa', text: s => {
    const g = garisUtama(), rank = s.pengaruh >= 55;
    const jalan = !rank || !g ? 'Namamu tidak tercatat di buku sejarah. Tapi kamu ada di sana, dan tanpa ribuan orang sepertimu, tidak ada yang bisa dicatat sama sekali.' : { damar: 'Kamu tetap di jalan: mengawal kasus orang hilang, menolak lupa, dan mengajari maba cara menulis selebaran.', ratna: 'Kamu menjadi pengacara hak asasi manusia. Map-map di kantormu setebal map Kak Ratna dulu.', fikri: 'Kamu menolak semua tawaran kursi dan memilih mengajar. Murid-muridmu tahu nama-nama yang tidak ada di buku pelajaran.', yudi: 'Kamu bekerja di dalam sistem, tapi kamu menyimpan Daftar Nama itu di laci yang tidak pernah kamu kunci.' }[g];
    return [jalan, 'Bulan Januari 2007, kamu berdiri di depan Istana bersama keluarga-keluarga korban. Kalian memakai baju hitam dan payung hitam, dan kalian berjanji datang lagi setiap Kamis.'];
  } }
});
function epilogTambahan() {
  const s = S, p = [];
  p.push(s.ricuh >= 4 ? 'Tidak semua yang terjadi bisa kamu banggakan. Beberapa bentrokan yang kamu pimpin meninggalkan korban dan memberi aparat alasan untuk memukul.' : s.ricuh <= 0 ? 'Sepanjang tahun-tahun itu, barisan yang kamu pimpin hampir selalu pulang lengkap.' : 'Tidak semua aksimu berjalan bersih, tapi kamu belajar dari setiap bentrokan.');
  if (s.f.damarDilepas) p.push('Bang Damar dilepas pada akhir April 1998. Ia tidak pernah lagi bisa tidur dengan lampu mati.');
  if (s.kader.mei === 'pergi') p.push('Mei dan keluarganya pindah ke luar negeri pada akhir 1998. Setiap Mei, ia mengirim kartu pos tanpa tulisan apa pun.');
  else if (s.f.meiAman) p.push('Keluarga Mei bertahan di Jakarta. Toko mereka dibuka lagi tiga tahun kemudian, dengan teralis besi di depannya.');
  if (s.kader.laras === 'aktif') p.push('Laras menjadi wartawan. Artikel pertamanya di koran nasional tentang barisan yang tidak pernah membalas lemparan batu.');
  if ((s.f.namaDiKoran || 0) >= 2) p.push('Karena namamu dua kali muncul di koran, Bapak dimutasi ke kantor kecamatan terpencil. Ia tidak pernah mengeluh di depanmu.');
  if (s.f.penyusupKetahuan) p.push(`${KADER[s.penyusup].nama} tidak pernah meminta maaf. Kamu juga tidak pernah memintanya.`);
  return p;
}
