/* Angkatan 98 · Babak I: prolog sampai bab 6 */
const ISU = [
  { v: 'sembako', t: 'Turunkan harga sembako', ambang: 0, d: 'menarik warga, ibu-ibu, buruh' },
  { v: 'golput', t: 'Golput: tolak pemilu tanpa pilihan', ambang: 15, d: 'menarik mahasiswa', req: s => s.bulan <= '1997-06' },
  { v: 'kkn', t: 'Berantas KKN', ambang: 20, d: 'menarik kelas menengah dan pers' },
  { v: 'uu', t: 'Cabut lima paket UU politik', ambang: 35, d: 'menarik mahasiswa dan akademisi' },
  { v: 'hilang', t: 'Usut orang hilang', ambang: 40, d: 'menarik LBH dan keluarga korban', req: s => s.f.damarHilang },
  { v: 'dwifungsi', t: 'Cabut dwifungsi ABRI', ambang: 55, d: 'menarik mahasiswa dan intelektual' },
  { v: 'turun', t: 'Presiden turun', ambang: 75, d: 'menarik semua kelompok' }
];
const isuOpts = () => ISU.filter(i => !i.req || i.req(S)).map(i => ({ v: i.v, t: i.t, d: i.d + (S.iklim >= i.ambang ? '' : ' · iklim belum siap, berisiko dicap') }));
function isuFx(v, base) {
  const I = ISU.find(i => i.v === v), siap = S.iklim >= I.ambang;
  return siap ? { fx: { massa: base, sorotan: Math.round(base / 2) }, note: `Isu “${I.t}” diterima orang banyak.` } : { fx: { massa: Math.round(base / 3), sorotan: base, cap: 2 }, note: `Isu “${I.t}” datang terlalu cepat. Koran pemerintah mencapmu “makar”, dan warga menjaga jarak.` };
}
const FRAMING = [
  { v: 'moral', t: 'Bingkai moral', d: 'disukai Bang Fikri' }, { v: 'ekonomi', t: 'Bingkai ekonomi', d: 'disukai Kak Ratna' },
  { v: 'politik', t: 'Bingkai politik', d: 'disukai Bang Damar' }, { v: 'konstitusi', t: 'Bingkai konstitusional', d: 'disukai Mas Yudi' }
];
const FRAME_SENIOR = { moral: 'fikri', ekonomi: 'ratna', politik: 'damar', konstitusi: 'yudi' };
const larasIkut = s => s.f.larasDitolong && rekrut('laras') ? ' Laras menunggumu di tangga. “Aku utang satu, kan? Aku ikut.”' : '';
const sapaan = () => S.foto >= 2 ? 'Mbak' : 'Mas';
const KOS_TEXT = ['Kamar tiga kali tiga meter di gang belakang kampus. Kasurnya beralas sarung kotak-kotak, dan kipas angin berderit di pojok.', 'Setiap kunjungan ke kamar ini mewakili beberapa bulan hidupmu. Atur uangmu dulu, lalu isi tiga slot waktu.'];
const kosNode = (o) => ({ mode: 'kos', scene: 'kos', judul: 'Kamar Kos', alt: 'Kamar kos dilihat dari kasur', hots: KOS_HOTS, text: KOS_TEXT, ...o });

/* tamu pintu diskusi, bab 3 */
const INSPEKSI1 = [
  { id: 'sri', nama: 'Sri Wulandari', sah: true, sepatu: 'sandal', face: { head: 'oval', hair: 'bob', mark: 'tahi', baju: 'kaus' }, docs: [{ type: 'ktm', nama: 'Sri Wulandari', nim: '95.04.0217', fak: 'FISIP', ang: '1995', face: { head: 'oval', hair: 'bob', mark: 'tahi', baju: 'kaus' } }], kata: '“Malam. Bab satu, kan? Aku sudah baca separuh.”', jawab: '“Aku ikut sejak semester lalu. Kak Ratna yang mengajakku.”' },
  { id: 'bayu', nama: 'Bayu Ardiansyah', sah: true, sepatu: 'pantofel', face: { head: 'kotak', hair: 'cepak', baju: 'almamater' }, docs: [{ type: 'ktm', nama: 'Bayu Ardiansyah', nim: '94.03.0088', fak: 'Ekonomi', ang: '1994', face: { head: 'kotak', hair: 'cepak', baju: 'almamater' } }], kata: '“Saya anggota Menwa. Rambut ini aturan Menwa, bukan pilihan saya. Saya mau ikut belajar.”', jawab: '“Saya tahu orang curiga sama rambut begini. Cek saja KTM saya.”', salahTolak: 'Rambut cepak saja bukan bukti.' },
  { id: 'hendra', nama: 'Hendra Saputra', sah: false, sepatu: 'lars', face: { head: 'kotak', hair: 'cepak', baju: 'kemeja' }, docs: [{ type: 'ktm', nama: 'Hendra Saputra', nim: '95.03.0154', fak: 'Ekonomi', ang: '1995', stempel: 'palsu', face: { head: 'oval', hair: 'belah', fh: 'kumis', baju: 'kemeja' } }], kata: '“Saya teman Rudi. Katanya boleh datang.”', jawab: '“Dari mana? Ya, dari kos. Fakultas Ekonomi, angkatan 95. Sudah, kan?”', kebenaran: 'intel. Foto tidak cocok, stempel palsu, sepatunya lars.' },
  { id: 'rudi', nama: 'Rudi Hartono', sah: true, sepatu: 'sneakers', face: { head: 'bulat', hair: 'keriting', glasses: 'kotak', fh: 'jenggot', baju: 'jins' }, docs: [{ type: 'ktm', nama: 'Rudi Hartono', nim: '94.02.0031', fak: 'Teknik', ang: '1994', face: { head: 'bulat', hair: 'keriting', glasses: 'kotak', fh: 'jenggot', baju: 'jins' } }], kata: '“Rudi, Teknik 94. Sori telat, angkotnya mogok.”', jawab: s => s.m.kep.hendra === 'izin' ? '“Ada yang mengaku temanku? Aku tidak bawa teman malam ini.”' : '“Kudengar tadi ada yang mengaku temanku. Aku tidak kenal yang namanya Hendra.”' },
  { id: 'mei', nama: 'Melinda Gunawan', sah: true, khusus: true, sepatu: 'sneakers', face: { ...C.mei, mood: 'gugup' }, docs: [{ type: 'none', teks: 'Tidak membawa KTM' }], kata: '“Dompetku hilang di bus kota tadi sore, KTM-ku di dalamnya. Namaku ada di daftar, kok. Melinda. Panggil saja Mei.”', jawab: '“Kak Ratna kenal aku, tapi dia sedang menata kursi di dalam. Aku tidak mau mengganggunya.”', opsi: s => { const p = ['laras', 'wahyu', 'bimo', 'tigor'].find(aktif); return p ? [{ v: 'jamin', t: `Minta ${KADER[p].nama} menjamin` }] : []; } }
];
const DAFTAR1 = [['Agus Prasetyo', 'Hukum', 1995], ['Bayu Ardiansyah', 'Ekonomi', 1994], ['Dewi Anggraini', 'Sastra', 1996], ['Hendra Saputra', 'Ekonomi', 1995], ['Melinda Gunawan', 'Teknik', 1996], ['Rudi Hartono', 'Teknik', 1994], ['Sri Wulandari', 'FISIP', 1995]];
const tabel = (head, rows) => `<div class="sheet"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

function bukuChoices(next) {
  const list = [];
  if (S.buku.baca) list.push({ t: `Lanjutkan ${BUKU[S.buku.baca].judul}`, d: `${S.buku.sisa} Kamis lagi`, run: s => { s.ui.tmp = baca(1); }, note: s => s.ui.tmp || `Kamu membaca ${BUKU[s.buku.baca].judul} sampai lewat tengah malam.`, go: next });
  for (const [id, b] of Object.entries(BUKU)) if (!S.buku.selesai.includes(id) && S.buku.baca !== id) list.push({ t: `${S.buku.baca ? 'Ganti ke' : 'Ambil'} ${b.judul} dari rak`, d: `${b.lama} Kamis${b.terlarang ? ', buku terlarang' : ''}`, run: s => { s.buku.baca = id; s.buku.sisa = b.lama; s.ui.tmp = baca(1); }, note: s => s.ui.tmp || `Kamu mulai membaca ${b.judul}. ${b.terlarang ? 'Sampulnya dibungkus kertas cokelat.' : ''}`, go: next });
  return list.slice(0, 5);
}
const obrolan = (id, teks, catatan) => ({ label: KADER[id].nama, text: teks, act: { t: `Ajak ${KADER[id].nama} bergabung`, req: s => !s.kader[id] && kaderAktif().length < 5 && (!catatan.req || catatan.req(s)), fx: { kader: id }, note: catatan.note } });

Object.assign(NODES, {
  intro: { mode: 'intro', scene: 'poster', judul: 'Angkatan 98', aman: true, alt: 'Poster cukil kayu Angkatan 98' },

  p_rumah: {
    bab: 'Prolog', judul: 'Rumah', waktu: 'Magelang, awal Agustus 1996', bulan: '1996-08', scene: 'rumah', alt: 'Meja makan keluarga di malam hari',
    text: ['Malam terakhir di rumah sebelum kamu berangkat kuliah ke Jakarta. Ibu menggoreng tempe untuk bekal, dan Bapak membaca koran sambil sesekali melirik televisi.', 'Di TVRI, penyiar membacakan berita penyerbuan kantor DPP PDI di Jakarta pada 27 Juli. Pemerintah menuding sebuah partai kecil bernama PRD sebagai dalangnya, dan nama-nama aktivisnya kini dicari.'],
    hots: {
      tv: { label: 'Televisi', text: 'Gambar gedung yang hangus di Jalan Diponegoro. Penyiar menyebut nama-nama yang diburu aparat. Bapak mengecilkan suaranya.' },
      bapak: { label: 'Bapak', text: '“Bapak ini PNS. Jangan ikut-ikutan politik di sana. Kuliah yang benar, lulus, pulang.”' },
      ibu: { label: 'Ibu', text: 'Ibu menyelipkan uang di bawah toples kering tempe. “Jangan bilang Bapak.”', fx: { uang: 20000 } },
      dika: { label: 'Dika', text: 'Dika, kelas 3 SMP, menunggumu selesai makan. “Nanti kirimi kaset dari Jakarta, ya. Aku juga mau kuliah di sana.”' },
      tas: { label: 'Tas', text: 'Tas ransel hijau masih setengah kosong. Masih ada tempat untuk dua barang lagi.' }
    },
    choices: [
      { t: 'Berjanji kepada Bapak tidak akan ikut politik', fx: { bapak: 1, janjiBapak: true }, note: 'Bapak mengangguk dan kembali ke korannya. Dika menatapmu agak lama.', go: 'p_tas' },
      { t: 'Diam saja dan habiskan makan malam', note: 'Tidak ada yang bicara lagi sampai televisi dimatikan.', go: 'p_tas' },
      { t: 'Bilang kamu ingin tahu apa yang sebenarnya terjadi di Jakarta', fx: { bapak: -1, kagum: 1 }, note: 'Bapak meletakkan korannya. “Yang sebenarnya terjadi itu bukan urusan anak kuliah.” Di bawah meja, Dika menendang kakimu pelan, tanda ia di pihakmu.', go: 'p_tas' }
    ]
  },
  p_tas: {
    mode: 'form', bab: 'Prolog', judul: 'Bekal', waktu: 'Magelang, awal Agustus 1996', scene: 'rumah', alt: 'Tas ransel di lantai rumah',
    text: ['Bus malam ke Jakarta berangkat besok pukul tujuh. Tasmu hanya muat dua barang lagi.'],
    steps: [{ id: 'bekal', label: 'Masukkan dua barang ke tas', multi: 2, options: [
      { v: 'radio', t: 'Radio kecil', d: 'kabar dari radio swasta tanpa harus ke warung' },
      { v: 'foto', t: 'Foto keluarga', d: 'Nyali +5 saat Nyali di bawah 20, sekali tiap tiga bulan' },
      { v: 'kamus', t: 'Kamus bahasa Inggris', d: 'bisa bicara langsung di Jenewa' },
      { v: 'catatan', t: 'Buku catatan kosong', d: 'cek silang kabar tanpa menaikkan Sorotan' }] }],
    done: (s, p) => { s.bekal = p.bekal; return { note: 'Paginya, Ibu melambai sampai bus menghilang di tikungan. Dika berlari mengejar bus sampai ujung jalan.', go: 'b1_gerbang' }; }
  },

  b1_gerbang: {
    bab: 1, judul: 'Gerbang', waktu: 'Senin, 19 Agustus 1996', bulan: '1996-08', scene: 'gerbang', alt: 'Gerbang kampus dengan spanduk penyambutan',
    text: ['Gerbang besi Universitas Gelora Bangsa terbuka lebar. Panitia ospek berteriak lewat toa, dan ratusan mahasiswa baru berkemeja putih mengalir masuk.', 'Sejak 27 Juli, sebuah truk tentara parkir di perempatan dekat kampus. Di trotoar, penjual koran meneriakkan nama-nama yang diburu.'],
    hots: {
      spanduk: { label: 'Spanduk', text: 'Spanduknya dicat tangan di atas kain belacu. Huruf G pada kata BANGSA sudah luntur kena hujan.' },
      koran: { label: 'Penjual koran', text: '“Aktivis diburu! Aktivis diburu!” Judul halaman depan: Pemerintah Buru Dalang 27 Juli. Di bawahnya ada foto-foto kecil wajah anak muda, salah satunya berambut gondrong dengan bekas luka di pelipis.' },
      selebaran: { label: 'Selebaran di tiang', text: 'Selebaran kecil, nyaris tertutup iklan sedot WC: KELOMPOK STUDI PENA. Diskusi buku tiap Kamis malam. Hubungi Ratna, Fakultas Hukum.', fx: { ratna: 1 } },
      panitia: { label: 'Panitia', text: '“Maba! Jangan bengong di gerbang! Daftar ulang di aula, ambil KTM, lalu ke lapangan. Lari!”' }
    },
    choices: [{ t: 'Masuk gerbang dan daftar ulang', go: 'b1_ktm' }]
  },
  b1_ktm: { mode: 'ktm', bab: 1, judul: 'Daftar Ulang', waktu: 'Senin, 19 Agustus 1996', scene: 'ktm', alt: 'KTM-mu di atas meja loket', aman: true },
  b1_lapangan: {
    bab: 1, judul: 'Lapangan', waktu: 'Senin, 19 Agustus 1996 · pukul 11.00', scene: 'lapangan', alt: 'Empat senior berdiri di depan barisan maba',
    text: ['Kamu duduk bersila di barisan maba. Matahari tepat di atas kepala. Empat senior berjalan pelan di depan barisan, memandangi kalian dari atas.', 'Di sebelahmu, panitia membentak Laras karena tali sepatunya lepas. Wajah Laras pucat. Ia mulai limbung.'],
    hots: {
      damar: { label: 'Bang Damar', text: 'Rambut gondrong, jaket jins yang sudah pudar. Ia berhenti di depanmu dan bergumam: “Ospek ini latihan kecil untuk tunduk. Jangan sampai terbiasa.”' },
      ratna: { label: 'Kak Ratna', text: 'Kacamata, map tebal terjepit di lengan. Ia mencatat sesuatu setiap kali panitia berteriak terlalu keras.' },
      fikri: { label: 'Bang Fikri', text: 'Peci hitam, kemeja putih yang disetrika rapi. Ia menyodorkan botol air ke maba yang kepanasan, lalu kembali ke barisan senior tanpa bicara.' },
      yudi: { label: 'Mas Yudi', text: 'Kemeja licin, pager di ikat pinggang. Ia tersenyum ke panitia seperti kawan lama. Pager-nya berbunyi dua kali.' },
      laras: { label: 'Laras', text: 'Papan nama kardus di lehernya bertuliskan LARAS, KOMUNIKASI. Keringat dingin mengalir di pelipisnya.' }
    },
    choices: [
      { t: 'Diam dan ikuti perintah. Yang penting ospek cepat selesai.', fx: { nyali: -5 }, go: 'b2_sekre', note: 'Ospek selesai tepat waktu. Panitia lain membawa Laras ke tenda medis. Tidak ada yang mengingat namamu, dan untuk sekarang itu terasa aman.' },
      { t: 'Angkat tangan dan tanya kenapa orang harus dibentak untuk belajar.', fx: { pengaruh: 5, nyali: 5, sorotan: 2, damar: 1 }, go: 'b2_sekre', note: 'Panitia menyuruhmu push-up dua puluh kali. Dari barisan senior, Bang Damar tertawa dan mencatat namamu.' },
      { t: 'Papah Laras ke tenda medis, apa pun kata panitia.', fx: { massa: 5, ratna: 1, fikri: 1, larasDitolong: true }, go: 'b2_sekre', note: 'Di tenda medis, Kak Ratna menyodorkan air dan bertanya kamu dari jurusan mana. Laras menggenggam tanganmu. “Makasih. Aku utang satu.”' }
    ]
  },

  b2_sekre: {
    bab: 2, judul: 'Empat Pintu', waktu: 'Kamis, 12 September 1996', bulan: '1996-09', scene: 'sekre', v: 'siang', alt: 'Sekretariat bersama dengan empat senior',
    text: ['Sekretariat bersama di lantai dua gedung lama. Dinding penuh poster, mesin stensil bocor tinta di tengah ruangan, dan kopi tubruk yang tidak pernah habis.', 'Empat senior ada di empat sudut, dan masing-masing menawarkan cara melawan yang berbeda. Malam ini kamu baru bisa masuk satu pintu.'],
    hots: {
      damar: { label: 'Bang Damar', text: 'Di jendela, kretek di jari: “Rezim ini tidak takut diskusi. Mereka takut jalan raya penuh orang.”' },
      ratna: { label: 'Kak Ratna', text: 'Di balik meja penuh map: “Massa tanpa organisasi cuma kerumunan. Kerumunan gampang dibubarkan, gampang ditunggangi.”' },
      fikri: { label: 'Bang Fikri', text: 'Di atas tikar, kitab terbuka di pangkuan: “Mahasiswa itu kekuatan moral. Begitu kita main politik praktis, kita sama saja dengan mereka.”' },
      yudi: { label: 'Mas Yudi', text: 'Dekat telepon senat: “Mau mengubah sistem? Masuk dulu ke dalamnya. Rektorat, senat, fraksi. Di situ keputusan dibuat.”' },
      stensil: { label: 'Mesin stensil', text: 'Seorang maba berkaus oblong berjongkok di samping mesin stensil, tangannya hitam kena tinta. “Rol tintanya macet. Bantuin pegang, dong?”', act: { t: 'Bantu memperbaiki rol tinta', req: s => !s.kader.wahyu, fx: { kader: 'wahyu' }, note: 'Setengah jam kemudian mesin berputar lagi. Namanya Wahyu, anak Teknik. “Kalau butuh cetak apa pun, atau butuh sopir, cari aku.”' } },
      papan: { label: 'Papan pengumuman', text: 'Jadwal Kelompok Studi Pena (Kamis malam), kajian ba’da Isya di masjid kampus (Selasa), rapat senat (Rabu pagi), dan secarik kertas: DICARI TINTA STENSIL, BAYAR NANTI.' }
    },
    choices: [
      { t: 'Ikut Bang Damar ke rapat aksi di warung belakang kampus.', fx: { damar: 2, nyali: 5, sorotan: 5 }, go: 'b2_tamu', note: s => 'Rapatnya berisik, penuh asap rokok, dan semua orang ingin turun ke jalan besok pagi. Kamu pulang dengan jantung berdebar.' + larasIkut(s) },
      { t: 'Ikut Kak Ratna ke kelompok studi di kos-kosan.', fx: { ratna: 2, pengaruh: 5, kader: 'bimo' }, go: 'b2_tamu', note: s => 'Kalian membaca ekonomi politik sampai lewat tengah malam. Bimo, anak Kedokteran di sebelahmu, menawarkan diri membantu merangkum.' + larasIkut(s) },
      { t: 'Ikut Bang Fikri ke kajian selepas Isya di masjid kampus.', fx: { fikri: 2, massa: 5, kader: 'bimo' }, go: 'b2_tamu', note: s => 'Kajian malam itu membahas kezaliman dan kewajiban bersuara. Bimo, anak Kedokteran, mengajakmu pulang bareng.' + larasIkut(s) },
      { t: 'Ikut Mas Yudi, Ketua Senat, ke rapat dengan pembantu rektor.', fx: { yudi: 2, pengaruh: 5, sorotan: -3 }, go: 'b2_tamu', note: s => 'Ruang rapatnya ber-AC. Pembantu rektor menepuk bahumu dan bilang mahasiswa sepertimu adalah harapan bangsa.' + larasIkut(s) }
    ]
  },
  b2_tamu: {
    bab: 2, judul: 'Tamu Malam', waktu: 'Kamis, 12 September 1996 · pukul 23.00', scene: 'kos', v: 'malam', kalender: 'September 1996', alt: 'Kamar kos di malam hari',
    text: ['Ketukan pelan di pintu kamarmu: tiga kali, berhenti, lalu dua kali lagi.', 'Di lorong berdiri laki-laki gondrong dengan bekas luka di pelipis. Ia memperkenalkan diri sebagai Bang Yos, senior FISIP. Wajahnya ada di koran yang kamu lihat di gerbang. “Tiga malam saja. Setelah itu aku pergi.”'],
    hots: {
      pintu: { label: 'Lorong', text: 'Bang Yos menoleh ke ujung lorong setiap beberapa detik. Sandalnya basah, seperti baru melewati selokan.' },
      jendela: { label: 'Jendela', text: 'Gang di bawah sepi. Hanya ada lampu warung rokok yang belum tutup.' }
    },
    choices: [
      { t: 'Terima dan sembunyikan Bang Yos', fx: { sorotan: 5 }, go: 'b2_sembunyi' },
      { t: 'Tolak dengan halus', fx: { damar: -1, yosTertangkap: true }, go: 'kos1', note: 'Bang Yos mengangguk, seolah sudah biasa ditolak. Seminggu kemudian, koran memberitakan ia tertangkap di sebuah rumah kos di Rawamangun.' },
      { t: 'Antar Bang Yos ke Bang Damar malam itu juga', fx: { damar: 1, sorotan: 5 }, go: 'kos1', note: 'Bang Damar tidak banyak bertanya. Ia membawa Yos pergi dengan motor tua lewat jalan belakang. Kamu tidak pernah tahu ke mana.' }
    ]
  },
  b2_sembunyi: {
    mode: 'hide', siapa: 'yos', rounds: 2, spots: ['plafon', 'lemari', 'kolong'], bab: 2, judul: 'Razia Kos', waktu: 'Minggu, 15 September 1996 · pukul 02.00', scene: 'sembunyi', alt: 'Pandangan dari tempat persembunyian',
    text: ['Malam ketiga, Hansip dan dua laki-laki berjaket kulit memeriksa kamar-kamar kos satu per satu. Kamu harus memilih tempat untuk Bang Yos, lalu menunggu.'],
    after: (s, ok) => ok
      ? { fx: { damar: 1, yosBerutang: true }, note: 'Langkah-langkah itu menjauh. Subuh, Bang Yos pamit lewat jendela belakang. “Aku utang nyawa. Kalau suatu hari kamu yang dikejar, cari aku di Yogya.”', go: 'kos1' }
      : { fx: { sorotan: 15, nyali: -10, damar: -1, yosTertangkap: true }, note: 'Senter berhenti di tempat persembunyian. Bang Yos diseret keluar tanpa melawan. Namamu dicatat di sebuah buku kecil bersampul hitam.', go: 'kos1' }
  },
  kos1: kosNode({ bab: 'Antara bab 2 dan 3', waktu: 'September – Oktober 1996', dari: '1996-08', bulan: '1996-10', kalender: 'Oktober 1996', next: 'b3_kamis1' }),

  b3_kamis1: {
    bab: 3, judul: 'Kamis Malam', waktu: 'Kamis, 17 Oktober 1996', bulan: '1996-10', scene: 'sekre', v: 'kamis', hadir: ['laras', 'wahyu', 'bimo'], alt: 'Sekretariat pada Kamis malam, rak buku dan gitar',
    text: ['Sebelum ada razia dan teror, hidup di sekretariat adalah membaca, berdebat, dan minum kopi tubruk sampai subuh. Seseorang memetik gitar di pojok. Rak buku penuh fotokopian yang sampulnya dibungkus koran.', 'Malam ini kamu memilih satu buku dari rak.'],
    hots: {
      rak: { label: 'Rak buku', text: 'Bumi Manusia, Madilog, Catatan Seorang Demonstran, Pendidikan Kaum Tertindas, dan setumpuk buku P4. Yang terlarang disampul koran Kompas bekas.' },
      laras: obrolan('laras', s => s.f.larasDitolong ? 'Laras sedang menulis untuk majalah kampus. “Aku mau jadi wartawan. Yang beneran, bukan yang menyalin siaran pers.”' : 'Laras menulis di pojok dan tidak terlalu memperhatikanmu.', { req: s => s.f.larasDitolong, note: 'Laras menutup bukunya. “Oke. Tapi aku yang pegang humas.”' }),
      wahyu: obrolan('wahyu', 'Wahyu membongkar radio rusak sambil bersiul. “Semua yang punya baut bisa kubetulkan.”', { note: 'Wahyu mengangkat obengnya seperti bersulang. “Siap.”' }),
      bimo: obrolan('bimo', 'Bimo menghafal nama tulang dari buku anatomi. “Kalau ada yang luka di aksi, setidaknya ada yang tahu harus menekan di mana.”', { note: 'Bimo mengangguk pelan. “Aku ikut, tapi aku bawa kotak P3K ke mana-mana.”' })
    },
    choices: () => bukuChoices('b3_kamis2')
  },
  b3_kamis2: {
    bab: 3, judul: 'Kamis Malam', waktu: 'Kamis, 31 Oktober 1996', scene: 'sekre', v: 'kamis', hadir: ['mei', 'tigor', 'dimas'], alt: 'Sekretariat pada Kamis malam',
    text: ['Kamis berikutnya hujan deras. Listrik sempat padam, dan diskusi dilanjutkan dengan lilin.', 'Dimas membacakan puisinya. Tigor, anak Hukum, berdebat dengan Kak Ratna soal pasal-pasal subversi sampai suaranya serak.'],
    hots: {
      rak: { label: 'Rak buku', text: 'Seseorang menyelipkan catatan di Madilog: JANGAN DIBAWA PULANG.' },
      mei: { label: 'Mei', text: 'Mei, anak Teknik dari kampus ini, mencatat semua yang dibicarakan dengan tulisan kecil-kecil. “Kalau suatu hari ada yang bertanya, kita punya catatannya.”' },
      tigor: obrolan('tigor', 'Tigor menunjukkan KUHP yang penuh coretan. “Pasal-pasal ini bisa dipakai untuk menangkap siapa saja. Makanya kita harus hafal.”', { req: s => s.ratna >= 2 || s.fak === 'Hukum', note: 'Tigor menjabat tanganmu keras-keras. “Kalau kamu ditangkap, telepon aku duluan.”' }),
      dimas: obrolan('dimas', 'Dimas membacakan sajak tentang sungai yang dibendung. Suaranya bergetar di bait terakhir.', { note: 'Dimas tersenyum lebar. “Aku bisa bicara di depan seribu orang. Asal ada yang menulis naskahnya.”' })
    },
    choices: () => bukuChoices('b3_kamis3')
  },
  b3_kamis3: {
    bab: 3, judul: 'Kamis Malam', waktu: 'Kamis, 7 November 1996', bulan: '1996-11', scene: 'sekre', v: 'kamis', hadir: ['laras', 'mei', 'bimo'], alt: 'Sekretariat pada Kamis malam',
    text: ['Malam ini Kelompok Studi Pena akan membahas Bumi Manusia, novel yang dilarang Kejaksaan Agung sejak 1981. Sebelum diskusi, kamu masih sempat membaca sebentar.'],
    hots: { rak: { label: 'Rak buku', text: 'Rak itu terasa lebih kosong. Beberapa buku dibawa pulang anggota, dan belum kembali.' } },
    choices: () => bukuChoices('b3_pintu')
  },
  b3_pintu: {
    mode: 'inspect', level: 1, v: 'pintu', bab: 3, judul: 'Penjaga Pintu', waktu: 'Kamis, 7 November 1996 · pukul 19.30', scene: 'inspect', alt: 'Ambang pintu sekretariat, tamu berdiri di depanmu',
    text: ['Kak Ratna menyerahkan papan jepit berisi daftar anggota kepadamu. “Kamu jaga pintu. Hanya yang ada di daftar boleh masuk. Kemarin ada orang asing di kantin yang menanyakan jadwal kita.”'],
    rules: '<ul class="rules"><li>Foto di KTM cocok dengan wajah.</li><li>Nama, fakultas, dan angkatan sesuai daftar.</li><li>Stempel asli: lingkaran merah ganda dengan bintang.</li></ul>',
    daftar: () => tabel(['Nama', 'Fakultas', 'Angkatan'], DAFTAR1), daftarLabel: 'Daftar anggota Kelompok Studi Pena',
    visitors: () => INSPEKSI1,
    evaluate: (s, kep, list) => {
      const { fx, lines } = nilaiStandar(kep, list, (t, fx, lines) => { s.f.intelMasuk = true; lines.push('Hendra lolos masuk. Belakangan kamu tahu: fotonya tidak cocok, stempelnya palsu, dan sepatunya lars.'); });
      if (kep.mei === 'tolak') { fx.ratna = 1; lines.push('Mei pulang malam itu. Kak Ratna bilang kamu menjalankan aturan dengan benar, meski Mei memang anggota.'); }
      else { fx.kader = 'mei'; if (kep.mei === 'jamin') fx.ratna = 1; lines.push(kep.mei === 'jamin' ? 'Kadermu menjamin Mei, dan Kak Ratna mengangguk puas. Mei bergabung denganmu.' : 'Mei masuk tanpa KTM. Ia memang anggota, dan sejak malam itu ia mencatat untukmu.'); }
      s.f.hadirDiskusi = list.filter(t => t.sah && kep[t.id] !== 'tolak').map(t => t.id);
      if (!lines.length) lines.push('Semua yang kamu izinkan memang anggota, dan semua yang kamu tolak memang bukan.');
      return { fx, note: lines, go: 'b3_diskusi' };
    }
  },
  b3_diskusi: {
    bab: 3, judul: 'Ruang Diskusi', waktu: 'Kamis, 7 November 1996 · pukul 20.00', scene: 'diskusi', alt: 'Peserta diskusi duduk melingkar di bawah satu bohlam',
    text: s => ['Peserta duduk melingkar di atas tikar. Fotokopian Bumi Manusia berpindah tangan, dibungkus sampul buku Pendidikan Moral Pancasila.', s.f.intelMasuk ? 'Di barisan paling belakang, Hendra duduk sendirian dan menulis di buku kecil. Ia tidak membawa buku apa pun.' : 'Semua wajah di ruangan ini ada di daftar.'],
    hots: {
      buku: { label: 'Buku', text: 'Sampulnya Pendidikan Moral Pancasila. Halaman pertamanya: “Orang memanggil aku: Minke.”' },
      ratna: { label: 'Kak Ratna', text: s => s.f.intelMasuk ? 'Kak Ratna melirik orang di barisan belakang, lalu menatapmu. Rahangnya mengeras.' : 'Kak Ratna mengangguk kecil ke arahmu, lalu membuka diskusi.' },
      intel: { label: 'Orang di belakang', req: s => s.f.intelMasuk, text: 'Laki-laki berambut cepak itu mencatat siapa saja yang berbicara, bukan apa yang dibicarakan.' }
    },
    choices: [
      { t: 'Mulai seperti biasa. Bacakan bab pertama keras-keras.', fx: s => ({ nyali: 10, sorotan: s.f.intelMasuk ? 25 : 15, massa: 5, damar: 1 }), go: 'kos2', note: s => s.f.intelMasuk ? 'Diskusinya hidup. Hendra menulis sepanjang malam. Seminggu kemudian, Sri dipanggil ke ruang pembantu rektor.' : 'Diskusinya hidup. Untuk pertama kalinya kamu membaca keras-keras sesuatu yang dilarang, dan tidak terjadi apa-apa. Setidaknya malam ini.' },
      { t: 'Bubarkan dengan alasan listrik padam, lalu pindah diam-diam ke kos kawan.', fx: { pengaruh: 5, sorotan: -5, ratna: 1, diskusiPindah: true }, go: 'kos2', note: s => s.f.intelMasuk ? 'Satu jam kemudian kalian berkumpul lagi di kos Rudi. Hendra tidak ikut, karena ia tidak tahu alamatnya.' : 'Hanya yang kamu kenal yang datang ke lokasi baru. Kamu mulai paham kenapa Kak Ratna selalu menyimpan dua jadwal.' },
      { t: 'Ganti topik menjadi diskusi etika dan agama.', fx: s => ({ massa: 5, sorotan: s.f.intelMasuk ? 3 : -5, fikri: 1 }), go: 'kos2', note: s => s.f.intelMasuk ? 'Hendra pergi setelah setengah jam, bosan. Beberapa kawan kecewa, tapi tidak ada yang dipanggil ke mana-mana.' : 'Diskusinya jadi aman dan agak membosankan. Beberapa kawan kecewa.' },
      { t: 'Serahkan ke Mas Yudi supaya diurus lewat senat.', fx: { sorotan: -8, massa: -5, yudi: 1 }, go: 'kos2', note: 'Diskusi dibubarkan dengan alasan izin kegiatan. Tidak ada yang ditangkap. Beberapa kawan berhenti mengajakmu ngopi.' }
    ]
  },
  kos2: kosNode({ bab: 'Antara bab 3 dan 4', waktu: 'November 1996 – Januari 1997', dari: '1996-11', bulan: '1997-01', kalender: 'Januari 1997', next: 'b4_bus' }),

  b4_bus: {
    bab: 4, judul: 'Mudik Lebaran', waktu: 'awal Februari 1997', bulan: '1997-02', scene: 'bus', alt: 'Pemandangan sawah dari jendela bus malam',
    text: ['Bus malam Jakarta–Magelang penuh pemudik. Kenek menagih ongkos sambil berteriak, dan pedagang asongan naik di setiap perhentian.', 'Di luar jendela, sawah dan pohon kelapa berganti dengan cepat. Kamu belum memutuskan apa yang akan kamu ceritakan di rumah.'],
    hots: {
      kenek: { label: 'Kenek', text: '“Ongkos naik lagi, Dik. Solar naik, sparepart naik. Yang tidak naik cuma gaji saya.”' },
      asongan: { label: 'Pedagang asongan', text: 'Tahu goreng, kacang rebus, dan kaset bajakan. Ada kaset band kesukaan Dika.' }
    },
    choices: [
      { t: 'Belikan kaset untuk Dika', cost: () => harga(7500), dis: s => s.uang.tunai < harga(7500), alasan: 'uangmu tidak cukup', fx: { dika: 1, kagum: 1 }, note: 'Kamu membungkus kaset itu dengan kertas koran. Dika pasti senang.', go: 'b4_rumah' },
      { t: 'Tidur saja sampai Magelang', fx: { nyali: 3 }, note: 'Kamu terbangun saat bus berhenti di terminal Magelang, menjelang subuh.', go: 'b4_rumah' }
    ]
  },
  b4_rumah: {
    bab: 4, judul: 'Lebaran', waktu: 'Magelang, Februari 1997', scene: 'rumah', v: 'lebaran', alt: 'Ruang tamu saat Lebaran',
    text: ['Ketupat digantung di pintu, dan toples kue berjajar di meja. Saudara-saudara datang bergantian sejak pagi.', 'Setelah tamu terakhir pulang, Bapak memanggilmu duduk.'],
    hots: {
      bapak: { label: 'Bapak', text: '“Atasan Bapak meminta semua pegawai mencoblos Golkar di Pemilu Mei. Semua, tanpa kecuali. Kamu mengerti maksud Bapak?”' },
      ibu: { label: 'Ibu', text: '“Di Jakarta makan apa? Temanmu siapa saja? Jangan sampai sakit.”' },
      dika: { label: 'Dika', text: s => `Dika menarikmu ke kamarnya. “${sapaan()}, di kampusmu ada demo nggak? Ceritain dong.”` },
      amplop: { label: 'Amplop Lebaran', text: 'Amplop dari pakde dan bude.', fx: { uang: 50000 } },
      tv: { label: 'Televisi', text: 'Gema takbir dari televisi bercampur suara petasan anak-anak di gang.' }
    },
    choices: [
      { t: 'Ceritakan semuanya kepada Bapak', fx: s => ({ bapak: s.f.janjiBapak && s.pengaruh >= 10 ? -2 : -1, ibu: 1, jujurBapak: true }), go: 'kos3', note: s => s.f.janjiBapak ? 'Bapak diam lama. “Kamu sudah janji.” Ia masuk kamar tanpa menunggu jawaban. Ibu mengusap punggungmu.' : 'Bapak mendengarkan sampai selesai. “Hati-hati. Itu saja.” Ibu mengusap punggungmu.' },
      { t: 'Bilang kamu hanya kuliah', fx: { bapak: 1, bohongBapak: true }, go: 'kos3', note: 'Bapak tersenyum lega dan menambahkan uang saku. Kamu tidak berani menatap Dika.' },
      { t: 'Ceritakan semuanya kepada Dika saja', fx: { tahu: 2, kagum: 1 }, go: 'kos3', note: 'Dika mendengarkan sampai larut malam, matanya berbinar. “Nanti aku kuliah di tempatmu.”' },
      { t: 'Beri Dika satu buku dari rak sekretariat', req: s => s.buku.selesai.length > 0, fx: s => ({ kagum: 2, tahu: 1, bukuUntukDika: s.buku.selesai.some(b => BUKU[b].terlarang) }), go: 'kos3', note: 'Dika menyembunyikan buku itu di bawah kasurnya. “Aman. Bapak tidak pernah masuk kamarku.”' }
    ]
  },
  kos3: kosNode({ bab: 'Antara bab 4 dan 5', waktu: 'Februari – April 1997', dari: '1997-02', bulan: '1997-04', kalender: 'April 1997', next: 'b5_selebaran' }),

  b5_selebaran: {
    mode: 'form', bab: 5, judul: 'Selebaran Pertama', waktu: 'Mei 1997', bulan: '1997-05', scene: 'sekre', v: 'stensil', alt: 'Meja stensil di sekretariat',
    text: ['Pemilu tinggal beberapa minggu lagi. Masa kampanye diwarnai bentrokan dan seruan golput, dan pendukung PDI Megawati ikut mengarak spanduk Mega-Bintang.', 'Untuk pertama kalinya, presidium memintamu menulis selebaran sendiri.'],
    hots: { selebaran: { label: 'Draf selebaran', text: 'Kertas buram, tinta stensil, dan judul yang belum kamu putuskan.' }, wahyu: { label: 'Wahyu', req: s => aktif('wahyu'), text: '“Tinta cukup untuk lima ratus lembar. Lebih dari itu, kita harus utang lagi.”' } },
    steps: [
      { id: 'isu', label: 'Isu selebaran', options: isuOpts },
      { id: 'frame', label: 'Bingkai', options: () => FRAMING },
      { id: 'saluran', label: 'Saluran', options: () => [
        { v: 'stensil', t: 'Stensil 500 lembar', d: `${rp(harga(25000))}, lokal, mesinnya bisa dilacak`, dis: s => s.uang.tunai < harga(25000), alasan: 'uangmu tidak cukup' },
        { v: 'faks', t: 'Faks ke redaksi koran', d: 'jangkauan luas, butuh Laras', req: s => aktif('laras') },
        { v: 'milis', t: 'Milis internet dari lab komputer kampus', d: 'menjangkau luar negeri' }] }
    ],
    done: (s, p) => {
      const r = isuFx(p.isu, 8), fx = { ...r.fx, [FRAME_SENIOR[p.frame]]: 1 }, note = [r.note];
      if (p.saluran === 'stensil') { bayar(harga(25000)); fx.massa = (fx.massa || 0) + 3; note.push('Lima ratus lembar habis dibagikan di kantin dan halte dalam dua hari.'); }
      if (p.saluran === 'faks') { fx.massa = (fx.massa || 0) + 5; fx.sorotan = (fx.sorotan || 0) + 4; note.push('Laras mengirim faks ke tiga redaksi. Satu koran mengutip dua kalimatmu.'); }
      if (p.saluran === 'milis') { fx.tekanan = 5; note.push('Selebaranmu beredar di milis internasional. Seseorang dari Belanda membalas dengan ucapan solidaritas.'); }
      if (!s.kader.dimas && kaderAktif().length < 5) { fx.kader = 'dimas'; note.push('Dimas, anak Sastra, membacakan selebaranmu di mimbar bebas, lalu bertanya apakah ia boleh ikut.'); }
      s.f.isuPertama = p.isu;
      return { fx, note, go: 'b5_tps' };
    }
  },
  b5_tps: {
    bab: 5, judul: 'Pemilu', waktu: 'Kamis, 29 Mei 1997', bulan: '1997-05', scene: 'tps', alt: 'TPS di kampung dekat kos',
    text: ['Hari pemungutan suara. TPS 07 di kampung dekat kosmu dihias bendera tiga partai. Antrean pemilih mengular sejak pagi.'],
    hots: {
      bilik: { label: 'Bilik suara', text: 'Tiga bilik dari tripleks dengan tirai kain. Paku untuk mencoblos diikat tali rafia.' },
      kotak: { label: 'Kotak suara', text: 'Kotak aluminium bergembok. Gemboknya dipegang seorang laki-laki berseragam Korpri.' },
      saksi: { label: 'Meja TPS', text: 'Hanya ada saksi dari satu partai. Dua kursi saksi lainnya kosong.' }
    },
    choices: [
      { t: 'Mencoblos, lalu pulang', fx: { yudi: 1, bapak: 1 }, go: 'kos4', note: 'Tintanya susah hilang dari jarimu. Malamnya kamu menelepon Bapak dan bilang sudah mencoblos.' },
      { t: 'Jadi pemantau independen dan catat kecurangan', fx: { ratna: 1, massa: 5, sorotan: 5, bukti: 'kecurangan' }, go: 'kos4', note: 'Kamu mencatat dua puluh tiga kejanggalan: surat suara yang sudah tercoblos, pemilih yang datang dua kali, dan saksi yang diusir. Catatan itu kamu simpan baik-baik.' },
      { t: 'Tidak datang. Tempel selebaran golput di gang.', fx: s => ({ sorotan: 10, damar: 1, bapak: s.pengaruh >= 15 ? -1 : 0 }), go: 'kos4', note: 'Selebaranmu dicopot Hansip sebelum siang. Ketua RW menanyakan kamarmu kepada ibu kos.' }
    ]
  },
  kos4: kosNode({ bab: 'Antara bab 5 dan 6', waktu: 'Juni – Agustus 1997', dari: '1997-05', bulan: '1997-08', kalender: 'Agustus 1997', next: 'b6_bank' }),

  b6_bank: {
    bab: 6, judul: 'Rupiah Jatuh', waktu: 'Oktober 1997', bulan: '1997-10', scene: 'bank', alt: 'Antrean di depan bank dan papan kurs',
    text: ['Sejak 14 Agustus 1997, rupiah dilepas ke kurs mengambang. Papan di money changer seberang bank diganti setiap jam.', 'Antrean nasabah di depan bank swasta memanjang sampai trotoar. Orang-orang bilang bank-bank kecil akan ditutup.'],
    hots: {
      papan: { label: 'Papan kurs', text: s => `Hari ini satu dolar ${rp(s.kurs)}. Tahun lalu masih sekitar Rp 2.300.` + (s.fak === 'Ekonomi' ? ' Sebagai anak Ekonomi, kamu tahu ini baru permulaan.' : '') },
      antrean: { label: 'Antrean', text: 'Seorang ibu memeluk tas berisi buku tabungan. “Uang sekolah anak saya ada di sini semua.”' },
      satpam: { label: 'Satpam', text: '“Bank aman, Bu. Bank aman.” Ia mengulanginya seperti doa.' }
    },
    choices: [
      { t: 'Tarik tabunganmu dan belikan dolar', req: s => s.uang.bank + s.uang.tunai >= 50000, run: s => { const dariBank = s.bankBeku ? 0 : s.uang.bank, dariTunai = Math.floor(s.uang.tunai / 2), total = dariBank + dariTunai, usd = Math.floor(total / (s.kurs * 1.015)), pakai = Math.round(usd * s.kurs * 1.015); s.uang.bank -= dariBank; s.uang.tunai += total - dariBank - dariTunai - pakai + dariBank; s.uang.usd += usd; s.ui.tmp = usd; }, go: 'kos5', note: s => `Kamu menukar uangmu menjadi USD ${s.ui.tmp}. Lembaran hijau itu kamu selipkan di dalam sampul buku P4.` },
      { t: 'Belikan beras dan minyak untuk dapur umum warga', cost: () => harga(50000), dis: s => s.uang.tunai < harga(50000), alasan: 'butuh tunai', fx: { massa: 10, dapurUmum: true, kader: 'asep' }, go: 'kos5', note: 'Bersama Asep, anak Ekonomi yang tinggal di kampung itu, kamu membuka dapur umum di rumah Pak RT. Antrean nasinya lebih panjang dari antrean bank.' },
      { t: 'Biarkan uangmu di bank', go: 'kos5', note: 'Bunga deposito naik setiap minggu. Kamu memutuskan untuk percaya.' },
      { t: 'Urus paspor di kantor imigrasi', cost: 100000, dis: s => s.uang.tunai < 100000, alasan: 'butuh Rp 100.000', fx: { paspor: true }, go: 'kos5', note: 'Petugas imigrasi bertanya untuk apa mahasiswa butuh paspor. Kamu bilang ingin ikut lomba debat di Singapura. Paspormu jadi dua minggu kemudian.' }
    ]
  },
  kos5: kosNode({ bab: 'Antara bab 6 dan 7', waktu: 'November – Desember 1997', dari: '1997-10', bulan: '1997-12', kalender: 'Desember 1997', next: 'b7_toko' })
});
