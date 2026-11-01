/* Angkatan 98 · Babak V dan ending */
Object.assign(NODES, {
  b18_semanggi: {
    enter: () => { ambilPlafon(); return {}; },
    mode: 'rounds', bab: 18, judul: 'Semanggi', waktu: 'Jumat, 13 November 1998 · malam', bulan: '1998-11', scene: 'jalan', v: 'malam', spanduk: 'TOLAK SIDANG ISTIMEWA', alt: 'Jalan Sudirman malam hari, lampu sorot dan panser',
    text: ['Presiden sudah berganti, tapi orang-orang lama masih di kursi yang sama. Agustus lalu, Dewan Kehormatan Perwira memeriksa perwira yang terlibat penculikan, dan yang dibawa ke pengadilan hanya kasus para aktivis yang sudah kembali. Mahasiswa menolak Sidang Istimewa MPR dan menuntut dwifungsi ABRI dihapus.', 'Malam ini kamu berada di dalam barisan di Jalan Sudirman, dekat kampus Atma Jaya. Lampu sorot menyilaukan, dan di ujung jalan ada panser.'],
    hots: { tameng: { label: 'Barisan aparat', text: 'Barisannya lebih rapat dari bulan Maret. Senjata mereka tidak lagi hanya pentungan.' }, spanduk: { label: 'Spanduk', text: 'Spanduk yang sama dari bulan Mei, dengan tulisan baru di baliknya.' }, medis: { label: 'Pos medis', text: s => (aktif('bimo') ? 'Bimo dan dua mahasiswa kedokteran berjaga di pos medis di belakang barisan.' : 'Pos medis malam ini hanya meja lipat kosong.') + ((s.siap.p3k || 0) >= 0.5 ? ' Kotak P3K bertumpuk di bawah meja.' : ' Hanya ada satu kotak P3K.') } },
    rounds: [
      { text: 'Sebelum aparat bergerak, rombongan sipil berikat kepala datang membawa bambu runcing. Mereka menyebut diri Pam Swakarsa, pengamanan Sidang Istimewa. Wajah-wajah mereka sama miskinnya dengan warga kampung belakang kampus.', options: [
        { t: 'Balas dorong mereka', fx: { ricuh: 2, massa: -3, damar: 1 }, note: 'Bambu dan batu beradu. Di koran besok, yang dipasang foto bentrokan antarwarga, bukan foto barisan tentara.' },
        { t: 'Tahan barisan dan jangan membalas', fx: { fikri: 1, nyali: -3, massa: 3 }, note: 'Kalian menelan makian dan lemparan. Barisan tetap utuh.' },
        { t: 'Ajak bicara orang-orang di barisan depan mereka', req: s => s.nyali >= 35, fx: { pengaruh: 3, ratna: 1, ricuh: -1 }, note: 'Seorang pemuda berbisik bahwa ia dibayar sepuluh ribu dan sebungkus nasi. Ia mundur ke belakang rombongannya.' }] },
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
        { t: 'Cari kawan yang hilang', fx: { nyali: -8 }, note: 'Kamu memeriksa wajah satu per satu di lorong rumah sakit sampai subuh.' },
        { t: 'Esoknya, tempel papan nama jalan baru untuk korban malam itu', fx: { massa: 5, sorotan: 3, jalanDinamai: true }, note: 'Kalian memaku papan kayu bertuliskan nama korban di tiang jalan dekat kampus. Polisi mencopotnya dua kali, dan dua kali kalian memasangnya lagi.' }] }
    ],
    done: s => ({ note: 'Beberapa mahasiswa dan warga tewas malam itu. Kasusnya tidak pernah dibawa ke pengadilan HAM.', go: 'b19_adik' })
  },
  b19_adik: {
    bab: 19, judul: 'Adik', waktu: 'Juni – September 1999', bulan: '1999-09', scene: 'kos', v: 'dika', kalender: 'September 1999', alt: 'Kamar kos yang sama, kini kamar Dika',
    text: s => ['Pemilu 7 Juni 1999 diikuti puluhan partai baru. ' + (s.yudi >= 3 ? 'Mas Yudi menjadi calon legislatif, dan fotonya terpasang di pohon-pohon sepanjang jalan.' : 'Beberapa senior lamamu kini menjadi pengurus partai.'), 'Dari radio terdengar kabar referendum Timor Timur pada 30 Agustus dan kekerasan sesudahnya.', `Dika diterima di kampusmu dan menempati kamar kos yang sama. Akhir September, mahasiswa turun menolak RUU Penanggulangan Keadaan Bahaya, dan Dika bertanya apakah ia boleh ikut.`, (s.f.dika_berani || 0) > (s.f.dika_hati || 0) ? 'Ia mengutip surat-suratmu dulu, kata demi kata, tentang keberanian. Ia mengatakannya tanpa ragu sedikit pun.' : (s.f.dika_hati || 0) > 0 ? 'Dika menyimpan semua suratmu di kaleng biskuit. Ia bertanya bagaimana caranya mundur kalau gas air mata datang.' : 'Dika jarang bercerita padamu. Kamu tidak tahu apa yang ia pikirkan.'],
    hots: { cermin: KOS_HOTS.cermin, jendela: KOS_HOTS.jendela, kalender: { label: 'Kalender', text: 'Tanggal 24 September dilingkari Dika dengan spidol merah.' } },
    choices: [
      { t: 'Ajak Dika masuk barisanmu', run: s => dikaNasib(s, 'ajak'), go: 'b20_daftar', note: s => s.ui.tmp },
      { t: 'Larang Dika ikut', run: s => dikaNasib(s, 'larang'), go: 'b20_daftar', note: s => s.ui.tmp },
      { t: 'Kirim Dika pulang ke Magelang', fx: { bapak: 1, dika: -2 }, run: s => { s.ui.tmp = 'Dika pulang dengan wajah merah karena marah. Ia tidak meneleponmu selama setahun. Ia selamat.'; }, go: 'b20_daftar', note: s => s.ui.tmp },
      { t: 'Kamu sendiri tidak turun', fx: { pengaruh: -10 }, run: s => dikaNasib(s, 'sendiri'), go: 'b20_daftar', note: s => s.ui.tmp }
    ]
  },
  b20_daftar: {
    bab: 20, judul: 'Daftar Nama', waktu: 'September 2004', bulan: '2004-09', scene: 'kontrakan', alt: 'Ruang tamu rumah kontrakan dengan kotak berisi dokumen',
    text: s => ['Indonesia memilih presiden secara langsung untuk pertama kalinya. Pada 7 September 2004, seorang pembela HAM terkemuka dibunuh dengan racun dalam penerbangan ke Amsterdam.', `Di mejamu ada kotak berisi Daftar Nama: ${s.bukti.length ? s.bukti.map(b => BUKTI[b] || b).join(', ').toLowerCase() : 'hampir kosong, hanya kliping koran'}.`, s.f.penyusupKetahuan ? `Di televisi, ${KADER[s.penyusup].nama} muncul sebagai staf ahli seorang pejabat.` : 'Di televisi, seorang staf ahli pejabat yang wajahnya samar-samar kamu kenal sedang diwawancarai.', s.yudi >= 3 ? 'Telepon berdering. Mas Yudi, kini anggota DPR, menawarimu jabatan staf khusus.' : 'Telepon berdering. Seorang kawan lama menawarimu jabatan di kantor seorang anggota DPR.', ...(s.f.hendraKenal ? ['Di koran yang terlipat di sebelah kotak itu ada foto pelantikan pejabat daerah. Kamu butuh waktu lama untuk yakin laki-laki di ujung barisan itu Hendra.'] : [])],
    hots: { laras: { label: 'Laras', req: s => aktif('laras'), text: s => s.tekanan < 50 ? 'Laras menelepon dengan suara pelan: dua minggu ini motor yang sama mengikutinya pulang, dan belum ada media luar negeri yang mau memuat liputan bersamanya.' : 'Laras bilang tiga kantor berita asing siap memuat liputan itu di hari yang sama. “Kalau mereka menyentuh kita, seluruh dunia tahu.”' }, kotak: { label: 'Kotak Daftar Nama', text: s => s.bukti.length ? `Ada ${s.bukti.length} bukti di dalamnya.` : 'Hampir kosong.' }, tv: { label: 'Televisi', text: 'Berita pembunuhan itu diulang setiap jam.' }, telepon: { label: 'Telepon', text: 'Gagangnya masih hangat.' } },
    choices: [
      { t: 'Serahkan kotaknya ke Komnas HAM lewat Kak Ratna', fx: { ratna: 1, kotakDiserahkan: true }, go: 'b21_laporan', note: 'Kak Ratna, kini pengacara di LBH, menerimanya dengan dua tangan. “Ini akan lama. Mungkin lebih lama dari umur kita.”' },
      { t: 'Umumkan isinya bersama Laras', req: s => aktif('laras'), run: s => { if (s.tekanan < 30 && !saudara('laras')) { s.f.matiDi = '2004'; s.ending = 'dibunuh'; } else if (s.tekanan < 50) { s.kader.laras = 'tewas'; s.ui.tmp = 'Liputan Laras dimuat di halaman depan. Dua minggu kemudian, Laras ditemukan tewas di depan kantornya. Polisi menyebutnya perampokan.'; } else s.ui.tmp = 'Liputan Laras dimuat di halaman depan dan dikutip media internasional. Seseorang mengirim karangan bunga duka ke rumahmu, dengan namamu tertulis di pita.'; }, go: s => s.ending ? 'akhir' : 'b21_laporan', note: s => s.ending ? 'Dua minggu setelah liputan itu terbit, kamu tidak pulang dari kantor.' : s.ui.tmp },
      { t: 'Terima tawaran jabatan dan simpan kotaknya', run: s => { s.ending = 'masuk_sistem'; }, go: 'akhir', note: 'Kamu memasukkan kotak itu ke lemari dan menguncinya. Senin depan kamu mulai bekerja.' },
      { t: 'Temui orang di televisi itu secara langsung', req: s => s.f.penyusupKetahuan, fx: { sorotan: 20, namaAtasan: true }, go: 'b21_laporan', note: s => `${KADER[s.penyusup].nama} menemuimu di sebuah kedai kopi. Ia menyebut satu nama, nama yang memberinya perintah pada 1998, lalu meminta kamu tidak pernah menghubunginya lagi.` },
      { t: 'Bakar kotaknya dan pergi', run: s => { s.f.patahSebab = 'bakar'; s.ending = 'patah'; }, go: 'akhir', note: 'Api di halaman belakang menyala sebentar saja. Kertas tua cepat terbakar.' }
    ]
  },
  b21_laporan: {
    bab: 21, judul: 'Daftar Kehilangan', waktu: 'Desember 2006', bulan: '2006-12', scene: 'laporan', alt: 'Meja dengan laporan penyelidikan dan foto-foto lama',
    text: ['Komnas HAM menyelesaikan penyelidikan tentang penghilangan orang secara paksa pada 1997–1998. Kamu membaca daftar nama di dalamnya, mencari nama-nama yang kamu kenal.', 'Akhir bulan ini berkasnya diserahkan ke Kejaksaan Agung. Kamu sudah cukup tua untuk menduga berkas itu akan bolak-balik di antara dua kantor selama bertahun-tahun.'],
    hots: { laporan: { label: 'Laporan', text: s => (s.f.damarHilangPermanen ? 'Nama Bang Damar ada di halaman empat belas, di bawah kolom “belum kembali”.' : 'Nama Bang Damar ada di kolom “dikembalikan”. Di sebelahnya, ada tiga belas nama di kolom lain.') + (s.f.sebabBuron ? ' Di lampiran, ada catatan mengapa namamu masuk daftar pencarian pada April 1998: ' + SEBAB[s.f.sebabBuron](s).toLowerCase() : '') }, foto: { label: 'Foto-foto lama', text: 'Foto sekretariat tahun 1996. Kamu menghitung siapa saja yang masih ada.' } },
    choices: [{ t: 'Tutup laporan itu', run: s => { s.ending = s.f.suap || s.f.informan || (s.bocor.length && s.f.rahasiaSimpan && !s.f.rahasiaTerbongkar) ? 'pengkhianat' : 'menolak_lupa'; }, go: 'akhir' }]
  },
  akhir: { mode: 'akhir', aman: true, scene: 'poster', judul: 'Akhir', alt: 'Poster akhir cerita' }
});

// tidak diundi: barisan depan, pos medis, P3K, dan apa yang kamu lakukan saat tembakan pecah
const risikoSemanggi = (s, aksi) => (s.f.depan ? 2 : 0) - (yosAda(s) ? 1 : 0) + ((s.siap.p3k || 0) < 0.5 ? 1 : 0) + (aktif('bimo') ? 0 : 1) + (aksi === 'tarik' ? 1 : 0) - (aksi === 'tiarap' ? 1 : 0) - (saudara('bimo') ? 1 : 0);
function semanggiNasib(s, aksi) {
  const depan = s.f.depan;
  if (depan && risikoSemanggi(s, aksi) >= 4) { s.f.matiDi = 'Semanggi'; end('dibunuh'); return ''; }
  let t = aksi === 'tiarap' ? 'Kamu menempelkan wajah ke aspal. Peluru berdesing di atas kepalamu.' : aksi === 'tarik' ? 'Kamu menyeret seorang mahasiswa yang kakinya berdarah ke balik pembatas jalan. Ia selamat.' : 'Kamu berlari ke gerbang kampus tanpa menoleh.';
  // Bimo maju ke depan menolong korban yang kamu tinggalkan; yang sudah seperti saudara tetap di sisimu
  if (aktif('bimo') && depan && aksi === 'lari' && !saudara('bimo')) { s.kader.bimo = 'tewas'; t += ' Saat kamu sampai di kampus, kamu mencari Bimo. Ia maju ke tempatmu tadi berdiri untuk menolong korban, dan tertembak di sana.'; }
  if (aksi === 'tarik') apply({ massa: 5, nyali: 5 });
  if (yosAda(s)) t += ' Sebuah tangan menarik bahumu lebih rendah: Bang Yos, yang sejak sore tidak pernah jauh darimu.';
  return t;
}
// Dika menjadi apa yang kamu tulis untuknya: surat yang berani, luka dari teror, dan hubungan yang renggang membuatnya nekat
const risikoDika = s => (s.f.dika_berani || 0) - (s.f.dika_hati || 0) + (s.rel.dika <= 1 ? 1 : 0) + (s.f.dikaDiancam && !s.f.keluargaAman ? 1 : 0) + (s.f.dikaDibawa ? 1 : 0) + (s.kagum >= 4 ? 1 : 0);
function dikaNasib(s, mode) {
  const r = risikoDika(s), siap = (s.siap.p3k || 0) >= 0.8 || aktif('bimo'), sendiri = mode !== 'ajak';
  const mati = mode === 'ajak' ? r >= (siap ? 3 : 2) : mode === 'larang' ? r >= 2 : r >= 1;
  if (mati) {
    s.hilang.push({ siapa: 'Dika', cara: 'tewas dalam bentrokan Semanggi, 24 September 1999' });
    apply({ bapak: -3, ibu: -3, nyali: -20, nyaliMax: -10 });
    s.ui.tmp = sendiri ? 'Dika pergi sendiri malam itu. Kamu mendengar namanya dari radio, lalu dari telepon Ibu yang tidak bisa berhenti menangis.' : 'Kamu kehilangan Dika di tengah barisan saat tembakan terdengar. Kamu menemukannya lagi di rumah sakit, dan sudah terlambat.';
  } else s.ui.tmp = sendiri ? 'Dika pulang tengah malam dengan baju bau gas air mata. Ia tidak bicara apa-apa, dan kamu memeluknya sampai ia tertidur.' : 'Dika berjalan di sebelahmu sepanjang aksi. Kalian pulang bersama, berdua, selamat.';
}

const garisUtama = () => { const [k, v] = Object.keys(SENIOR).map(k => [k, S[k]]).sort((a, b) => b[1] - a[1]).at(0); return v > 0 ? k : null; };
Object.assign(ENDINGS, {
  patah: { judul: 'Patah', text: s => s.f.patahSebab === 'bapak' ? ['Kamu pulang ke Magelang bersama Bapak, dua hari sebelum Presiden berhenti. Kamu menonton berita 21 Mei di ruang tamu, di samping Bapak yang tidak bicara.', 'Kamu kembali kuliah setahun kemudian, di kampus lain, dan tidak pernah lagi masuk ke sekretariat mana pun.'] : s.f.patahSebab === 'bakar' ? ['Kamu pindah ke kota kecil di Jawa Timur dan menjadi guru les. Tidak ada muridmu yang tahu siapa kamu dulu.', 'Kadang-kadang, saat berita menyebut nama-nama orang hilang, kamu mematikan televisi.'] : ['Suatu pagi kamu mengemas tas dan naik bus malam ke Magelang. Kamu tidak pamit ke sekretariat.', 'Tidak ada yang menyalahkanmu. Teror memang dibuat untuk mematahkan orang satu per satu, dan kamu manusia biasa.'] },
  dikeluarkan: { judul: 'Dikeluarkan', text: s => s.f.yosDitolak ? ['Kawan-kawan PENA menyelamatkan Bang Yos tanpa bantuanmu. Sejak itu, setiap pintu sekretariat tertutup saat kamu datang.', 'Kamu menyelesaikan kuliah sebagai mahasiswa biasa. Mei 1998 kamu tonton dari televisi warung, dan di layar kamu melihat Bang Yos memimpin barisan.'] : s.f.sabotase >= 2 ? ['Presidium menyebut belanjaanmu sabotase dan mengeluarkanmu dari PENA. Tidak ada yang mau mendengar penjelasanmu.', 'Mei 1998 kamu tonton dari televisi warung. Bertahun-tahun kemudian, kamu masih mendengar bisik-bisik bahwa dulu kamu bekerja untuk mereka.'] : ['Presidium mengeluarkanmu tanpa sidang. Jadwal rapat tidak lagi sampai kepadamu, dan kawan-kawan berhenti menyapamu di kantin.', 'Bulan Mei 1998 kamu tonton dari televisi warung. Bertahun-tahun kemudian, kamu masih mendengar bisik-bisik bahwa dulu kamu penyusup.', penyusupAktif() ? 'Penyusup yang sebenarnya tetap duduk di rapat-rapat itu, dan mencatat semuanya.' : 'Kamu tidak pernah tahu siapa yang pertama kali menyebut namamu.'] },
  barisan: { judul: 'Barisan Tanpa Orang', text: () => ['Kamu masih datang ke sekretariat, tapi rapat-rapat sekarang berjalan tanpamu. Orang tidak lagi percaya keputusanmu akan membawa mereka pulang dengan selamat.', 'Gerakan terus bergerak. Kamu belajar bahwa pemimpin tanpa kepercayaan massa hanyalah orang yang berdiri paling depan, sendirian.'] },
  dihilangkan: { judul: 'Dihilangkan', text: () => ['Di luar, tidak cukup banyak orang yang tahu namamu. Kawan-kawan mencarimu diam-diam, lalu kehilangan jejak.', 'Namamu masuk daftar orang hilang, bersama nama-nama yang sampai hari ini belum kembali. Ibumu menyimpan kamarmu seperti saat kamu meninggalkannya.'] },
  dibunuh: { judul: 'Dibunuh', text: s => s.f.matiDi === 'Semanggi' ? ['Laras yang menuliskan malam itu. Kamu tertembak di Jalan Sudirman, dekat kampus Atma Jaya, saat lampu sorot masih menyala.', 'Namamu dibacakan di mimbar-mimbar kampus selama seminggu. Kasus Semanggi tidak pernah dibawa ke pengadilan HAM.'] : ['Dua minggu setelah isi kotak itu diumumkan, kamu tidak pulang dari kantor. Polisi menyebutnya perampokan.', 'Kawan-kawanmu tidak pernah percaya.'] },
  diasingkan: { judul: 'Diasingkan', text: s => ['Kamu tinggal di Belanda, menerjemahkan dokumen untuk LSM dan menulis surat yang tidak pernah kamu kirim.', s.f.paspor_dicabut ? 'Paspormu dicabut. Saat akhirnya kamu boleh pulang, Ibu sudah tidak mengenalimu di bandara.' : 'Kamu bilang akan pulang tahun depan, setiap tahun. Kamu menjadi seperti laki-laki tua yang kamu temui di Jenewa.'] },
  dipenjara: { judul: 'Dipenjara', text: s => [(s.f.diamDikhianati ? 'Kamu tidak memberi mereka apa pun. Tanpa pengakuanmu pun, berkas dari kawan yang berkhianat sudah cukup untuk jaksa.' : s.f.sitaKali ? 'Kamu tertangkap di tengah pelarian dengan bukti di tasmu.' : 'Kamu tertangkap di tengah pelarian. Jaksa membacakan daftar anggota yang disita dari sekretariatmu, dan namamu ada di urutan pertama.') + ' Pengadilan menjatuhkan hukuman dengan pasal makar.', 'Kamu dibebaskan setelah Presiden berganti, bersama tahanan politik lainnya. Tiga tahun di sel tidak pernah benar-benar keluar darimu.'] },
  masuk_sistem: { judul: 'Masuk Sistem', text: () => ['Kamu duduk di ruang ber-AC, tempat Mas Yudi dulu mengajakmu rapat. Kamu ikut meloloskan beberapa undang-undang penting, dan kamu belajar berkompromi.', 'Kotak Daftar Nama masih terkunci di lemari. Suatu hari kamu sadar sudah lupa kapan terakhir kali kamu menolak sesuatu.'] },
  orba: { judul: 'Orde Baru Bertahan', fiksi: true, text: s => ['Komite Reformasi bekerja enam bulan, lalu pemilu dimenangkan partai yang sama. Kampus dinormalisasi lagi, dan daftar nama yang disita sepanjang 1998 dipakai untuk penangkapan.', s.sorotan >= 60 ? 'Namamu ada di daftar itu. Kamu buron lagi, kali ini tanpa tanggal akhir.' : s.f.suap ? 'Amplop cokelat itu menepati janjinya. Kamu aman, dan setiap pagi kamu harus menatap wajahmu sendiri.' : 'Kamu kembali kuliah dan diam. Setiap Kamis malam kamu lewat di depan sekretariat PENA yang disegel.', 'Di ruang tamu orang tuamu, foto Presiden masih tergantung di dinding.'] },
  pengkhianat: { judul: 'Pengkhianat', text: s => s.f.informan ? ['Setiap Kamis pukul tujuh malam, selama tiga tahun, kamu menelepon nomor yang sama dan menceritakan rapat-rapat yang kamu hadiri.', 'Tidak ada kawan yang pernah tahu. Kamu tahu, setiap kali ada nama yang hilang.'] : s.f.suap ? ['Beasiswa itu datang, lalu pekerjaan, lalu rumah. Keluargamu aman.', 'Kamu tidak pernah datang ke reuni angkatan. Amplop cokelat itu masih ada di lemarimu, kosong.'] : ['Kamu dikenal sebagai salah satu yang bertahan. Hanya kamu yang tahu apa yang kamu katakan di ruangan berlampu gantung itu.', 'Setiap kali nama kawan yang tertangkap pada 1998 disebut, kamu menunduk.'] },
  menolak_lupa: { judul: 'Menolak Lupa', text: s => {
    const g = garisUtama(), rank = s.pengaruh >= 55;
    const jalan = !rank || !g ? 'Namamu tidak tercatat di buku sejarah. Tapi kamu ada di sana, dan tanpa ribuan orang sepertimu, tidak ada yang bisa dicatat sama sekali.' : { damar: 'Kamu tetap di jalan: mengawal kasus orang hilang, menolak lupa, dan mengajari maba cara menulis selebaran.', ratna: 'Kamu menjadi pengacara hak asasi manusia. Map-map di kantormu setebal map Kak Ratna dulu.', fikri: 'Kamu menolak semua tawaran kursi dan memilih mengajar. Murid-muridmu tahu nama-nama yang tidak ada di buku pelajaran.', yudi: 'Kamu bekerja di dalam sistem, tapi kamu menyimpan Daftar Nama itu di laci yang tidak pernah kamu kunci.' }[g];
    return [jalan, 'Bulan Januari 2007, kamu berdiri di depan Istana bersama keluarga-keluarga korban. Kalian memakai baju hitam dan payung hitam, dan kalian berjanji datang lagi setiap Kamis, seperti Kamis malam di sekretariat PENA dulu.'];
  } }
});
// jalan hidup sesudah 1998 menurut jurusan: [kalau masuk sistem atau berkhianat, kalau tetap di luar]
const KARIER = {
  Hukum: ['Gelar hukummu kelak membawamu ke kantor kejaksaan, tempat berkas-berkas orang hilang menumpuk tanpa pernah disidangkan.', 'Ijazah hukummu kamu pakai untuk mendampingi keluarga korban di LBH, tanpa bayaran, bertahun-tahun.'],
  Teknik: ['Kamu bekerja di proyek-proyek pemerintah. Gedung yang kamu rancang berdiri di atas tanah yang dulu digusur.', 'Kamu menjadi insinyur di pabrik pinggiran kota, dan setiap akhir pekan diam-diam merawat pemancar radio komunitas.'],
  Ekonomi: ['Kamu menjadi pejabat di bank yang dulu ikut kamu kritik saat krisis.', 'Kamu menulis tentang krisis 1998 untuk koran-koran kecil: siapa yang kehilangan tabungan, dan siapa yang justru bertambah kaya.'],
  FISIP: ['Kamu menjadi staf ahli sebuah partai baru. Kalimat yang dulu kamu teriakkan di mimbar sekarang kamu tulis untuk pidato orang lain.', 'Kamu menjadi peneliti dan menulis tentang gerakan mahasiswa 1998. Tidak semua nama di catatanmu masih hidup.']
};
const KAWAN_2006 = {
  bimo: 'Bimo menjadi dokter puskesmas di Flores. Setiap tahun ia mengirimimu foto pos medis yang ia bangun.',
  wahyu: 'Wahyu membuka bengkel di Bekasi. Di dinding bengkelnya tergantung kunci serep mobil boks yang dulu hampir ia titipkan padamu.',
  asep: 'Asep menjadi pengurus serikat buruh. Setiap Hari Buruh ia meneleponmu dan bertanya, “Kamu masih tidak sok, kan?”',
  dimas: 'Dimas menerbitkan buku puisi tipis. Puisi tentangmu ada di halaman pertama.',
  tigor: 'Tigor menjadi pengacara LBH. Nomor telepon rumahmu di Magelang masih terselip di dompetnya.'
};
function epilogTambahan() {
  const s = S, p = [];
  p.push(s.ricuh >= 4 ? 'Tidak semua yang terjadi bisa kamu banggakan. Beberapa bentrokan yang kamu pimpin meninggalkan korban dan memberi aparat alasan untuk memukul.' : s.ricuh <= 0 ? 'Sepanjang tahun-tahun itu, barisan yang kamu pimpin hampir selalu pulang lengkap.' : 'Tidak semua aksimu berjalan bersih, tapi kamu belajar dari setiap bentrokan.');
  if (s.f.damarDilepas) p.push('Bang Damar dilepas pada akhir April 1998. Ia tidak pernah lagi bisa tidur dengan lampu mati.');
  p.push(seniorTangkap('fikri') ? 'Bang Fikri keluar dari tahanan pada pertengahan 1998, lebih kurus dan lebih pendiam. Ia membuka kelas mengaji untuk anak-anak buruh di Tangerang dan tidak pernah lagi naik mimbar mana pun.'
    : sikap('fikri') === 'dingin' ? 'Bang Fikri mengajar di pesantren kecil di pinggir Bogor. Kalian bertemu sekali di sebuah pemakaman, saling mengangguk, dan tidak bicara.'
    : 'Bang Fikri menolak semua tawaran partai yang datang sesudah 1998. Ia mengajar di pesantren kecil di pinggir Bogor, dan setiap Kamis ia ikut berdiri dengan payung hitam di depan Istana.');
  if (yosAda(s)) p.push('Bang Yos tidak pernah tercatat di buku sejarah mana pun. Ia membuka warung kopi di dekat kampus, dan setiap kali kamu datang, ia menolak uangmu.');
  if (s.kader.mei === 'pergi') p.push('Mei dan keluarganya pindah ke luar negeri pada akhir 1998. Setiap Mei, ia mengirim kartu pos tanpa tulisan apa pun.');
  else if (s.f.meiAman) p.push('Keluarga Mei bertahan di Jakarta. Toko mereka dibuka lagi tiga tahun kemudian, dengan teralis besi di depannya.');
  if (s.kader.laras === 'aktif') p.push('Laras menjadi wartawan. Artikel pertamanya di koran nasional tentang barisan yang tidak pernah membalas lemparan batu.');
  if (s.f.bapakDipecat) p.push('Bapak tidak pernah kembali menjadi pegawai negeri. Ia membuka kios fotokopi di depan pasar dan tidak pernah menyebut alasannya kepada pembeli.');
  else if ((s.f.namaDiKoran || 0) >= 2) p.push('Karena namamu dua kali muncul di koran, Bapak dimutasi ke kantor kecamatan terpencil. Ia tidak pernah mengeluh di depanmu.');
  const mati = ['dihilangkan', 'dibunuh'].includes(s.ending);
  if (s.f.dropOut) p.push('Kamu tidak pernah menyelesaikan kuliah. Ijazah yang ditunggu Bapak tidak pernah datang.');
  else if (s.ending === 'dipenjara' && s.fak === 'Hukum') p.push('Di penjara, kamu membantu sesama tahanan menyusun pembelaan. Pengetahuan hukummu satu-satunya yang tidak bisa mereka sita.');
  else if (!mati && s.ending !== 'diasingkan' && s.ending !== 'dipenjara') p.push(KARIER[s.fak][['masuk_sistem', 'pengkhianat'].includes(s.ending) ? 0 : 1]);
  if (!mati) p.push(genderKu() === 'P' ? 'Buku-buku sejarah 1998 kebanyakan mencatat nama laki-laki. Kamu mulai menulis catatanmu sendiri, tentang perempuan-perempuan yang memasak di dapur umum dan berdiri di barisan yang sama.' : 'Hampir semua nama aktivis yang diculik pada 1997–1998 adalah laki-laki muda seusiamu. Setiap kali membaca daftar itu, kamu tahu betapa tipis jarak antara dirimu dan mereka.');
  if (s.uang.utang > 0) p.push('Utangmu ke lintah darat di pasar baru lunas tahun 2001, setelah bunganya berlipat beberapa kali. Setiap bulan, kamu menyisihkan gaji untuk orang yang tidak pernah kamu lihat wajahnya.');
  else if (s.uang.usd >= 30 || s.uang.bank >= 100000) p.push('Kamu melewati krisis tanpa utang sepeser pun. Simpanan kecil yang kamu jaga sejak 1997 kelak membiayai fotokopi berkas-berkas Daftar Nama.');
  if (s.f.keluargaAman) p.push('Ibu dan Dika tinggal di rumah Bude sampai akhir 1999. Dika lulus dari sekolah yang tidak pernah ia pilih.');
  if (s.f.wajibLapor) p.push('Surat pernyataan yang kamu tanda tangani masih tersimpan di sebuah arsip. Namamu ada di bawahnya, dan nama Bapak di sebelahnya.');
  if (s.f.agenKorban) p.push(`${KADER[s.penyusup].nama} tidak pernah ditemukan setelah malam ia dijemput. Kamu yang menyuruhnya membawa kabar palsu itu.`);
  else if (s.f.penyusupLindung) p.push(`${KADER[s.penyusup].nama} menjadi pegawai kecil di sebuah kantor kelurahan. Setiap Lebaran ia mengirim kartu tanpa nama pengirim. Kamu tidak pernah memberi tahu siapa pun.`);
  else if (s.f.penyusupKetahuan) p.push(`${KADER[s.penyusup].nama} tidak pernah meminta maaf. Kamu juga tidak pernah memintanya.`);
  for (const [k, st] of Object.entries(s.kader)) {
    if (k === s.penyusup || st === 'tewas' || st === 'pergi' || k === 'laras' || k === 'mei') continue;
    if (st === 'keluar') p.push(`${KADER[k].nama} tidak pernah membalas surat-suratmu sejak berhenti datang ke sekretariat.`);
    else if (tingkat(k) === 2 && KAWAN_2006[k]) p.push(KAWAN_2006[k]);
  }
  if (kal(s, 'ibu') >= 0.5) p.push('Ibu-ibu pasar yang dulu memasak di dapur umum masih menyapamu dengan nama kecilmu setiap kali kamu lewat.');
  if (s.f.petaniDitangkap) p.push('Petani yang ditangkap di aksi Maret 1998 baru bebas setahun kemudian. Sawah mereka sudah menjadi perumahan.');
  if (s.f.jalanDinamai) p.push('Papan nama jalan yang kalian paku untuk korban Semanggi sudah lama dicopot. Orang-orang di sekitar kampus tetap menyebut jalan itu dengan nama yang kalian tulis.');
  if (!['dihilangkan', 'dibunuh'].includes(s.ending)) p.push(s.hilang.some(h => h.siapa === 'Dika') ? 'Setiap 24 September, kamu pulang ke Magelang dan duduk lama di depan makam Dika. Surat-surat yang dulu kamu tulis untuknya masih tersimpan di kaleng biskuit di kamarnya.' : (s.f.dika_berani || 0) > (s.f.dika_hati || 0) ? 'Dika sekarang berdiri di barisan depan setiap aksi, persis seperti yang dulu kamu tulis untuknya. Kamu tidak tahu harus bangga atau takut.' : (s.f.dika_hati || 0) > 0 ? 'Dika menjadi guru sejarah di SMA-nya dulu. Murid-muridnya tahu nama-nama yang tidak ada di buku pelajaran, dan tahu cara mundur saat gas air mata datang.' : 'Dika jarang meneleponmu. Ia bilang ia tidak pernah benar-benar mengenal kakaknya.');
  return p;
}
