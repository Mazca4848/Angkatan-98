/* Angkatan 98 · Babak I: prolog sampai bab 6 */
TOPIK.lengser = { truth: () => false, benar: () => 'Presiden memang bilang begitu ke partainya, tapi orang-orang dekatnya justru menyiapkan masa jabatan ketujuh.', salah: () => 'Presiden sudah pasti mundur tahun depan. Kita tinggal menunggu.' };
const ISU = [
  { v: 'sembako', kel: 'Isu ekonomi', t: 'Turunkan harga sembako', ambang: 0, d: 'menarik warga, ibu-ibu, buruh' },
  { v: 'golput', kel: 'Isu politik', t: 'Golput: tolak pemilu tanpa pilihan', ambang: 15, d: 'menarik mahasiswa', req: s => s.bulan <= '1997-06' },
  { v: 'kkn', kel: 'Isu ekonomi', t: 'Berantas KKN', ambang: 20, d: 'menarik kelas menengah dan pers' },
  { v: 'tanah', kel: 'Isu ekonomi', t: 'Kembalikan tanah rakyat', ambang: 15, d: 'menarik petani dan warga gusuran', req: s => s.bulan >= '1998-01' },
  { v: 'uu', kel: 'Isu politik', t: 'Cabut lima paket UU politik', ambang: 35, d: 'menarik mahasiswa dan akademisi' },
  { v: 'hilang', t: 'Usut orang hilang', ambang: 40, d: 'menarik LBH dan keluarga korban', req: s => s.f.damarHilang },
  { v: 'dwifungsi', kel: 'Isu politik', t: 'Cabut dwifungsi ABRI', ambang: 55, d: 'menarik mahasiswa dan intelektual' },
  { v: 'turun', kel: 'Isu politik', t: 'Presiden turun', ambang: 75, d: 'menarik semua kelompok' }
];
const BISIK = { ibu: 'ibu-ibu pasar terus membicarakannya', petani: 'petani di balai desa menyebutnya berkali-kali', mhs: 'mahasiswa di fakultas menunggu isu ini' };
const isuOpts = () => ISU.filter(i => !i.req || i.req(S)).map(i => ({ v: i.v, kel: i.kel, t: i.t, d: i.d + (S.iklim >= i.ambang ? '' : ' · orang-orang belum siap mendengarnya') + (typeof KAL_ISU !== 'undefined' ? Object.keys(KAL_ISU).filter(g => ((S.f.kalangan || {})[g] || 0) >= 0.5 && KAL_ISU[g].includes(i.v)).map(g => ' · ' + BISIK[g]).join('') : '') }));
function isuFx(v, base) {
  const I = ISU.find(i => i.v === v), siap = S.iklim >= I.ambang;
  return siap ? { fx: { massa: base, sorotan: Math.round(base / 2), kuasa: -Math.round(base * 0.6) }, note: `Isu “${I.t}” diterima orang banyak.` } : { fx: { massa: Math.round(base / 3), sorotan: base, cap: 2, kuasa: 2 }, note: `Isu “${I.t}” datang terlalu cepat. Koran pemerintah mencapmu “makar”, dan warga menjaga jarak.` };
}
const FRAMING = [
  { v: 'moral', t: 'Bingkai moral', d: 'bicara soal nurani dan kejujuran' }, { v: 'ekonomi', t: 'Bingkai ekonomi', d: 'bicara soal harga beras dan upah' },
  { v: 'politik', t: 'Bingkai politik', d: 'bicara soal kekuasaan yang harus diganti' }, { v: 'konstitusi', t: 'Bingkai konstitusional', d: 'bicara soal pasal dan hak warga negara' }
];
const FRAME_SENIOR = { moral: 'fikri', ekonomi: 'ratna', politik: 'damar', konstitusi: 'yudi' };
const larasIkut = s => s.f.larasDitolong && rekrut('laras') ? ' Laras menunggumu di tangga. “Aku utang satu, kan? Aku ikut.”' : '';
const sapaan = () => genderKu() === 'P' ? 'Mbak' : 'Mas';
const KOS_TEXT = ['Kamar tiga kali tiga meter di gang belakang kampus. Kasurnya beralas sarung kotak-kotak, dan kipas angin berderit di pojok.', 'Setiap kunjungan ke kamar ini mewakili beberapa bulan hidupmu. Atur uangmu dulu, lalu isi enam slot waktu menurut prioritas.'];
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
  for (const [id, b] of Object.entries(BUKU)) if (!S.buku.selesai.includes(id) && S.buku.baca !== id) list.push({ kel: S.buku.baca ? 'Ganti ke buku lain' : 'Ambil buku dari rak', t: `${S.buku.baca ? 'Ganti ke' : 'Ambil'} ${b.judul} dari rak`, d: `${b.lama} Kamis${b.terlarang ? ', buku terlarang' : ''}`, run: s => { s.buku.baca = id; s.buku.sisa = b.lama; s.ui.tmp = baca(1); }, note: s => s.ui.tmp || `Kamu mulai membaca ${b.judul}. ${b.terlarang ? 'Sampulnya dibungkus kertas cokelat.' : ''}`, go: next });
  return list;
}
const obrolan = (id, teks, catatan) => ({ label: KADER[id].nama, text: teks, act: { t: `Ajak ${KADER[id].nama} bergabung`, req: s => !s.kader[id] && kaderAktif().length < 5 && sikap(id) !== 'dingin' && (!catatan.req || catatan.req(s)), fx: { kader: id }, note: catatan.note } });

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
      { v: 'radio', t: 'Radio kecil', d: 'transistor dengan baterai cadangan' },
      { v: 'foto', t: 'Foto keluarga', d: 'untuk diselipkan di dompet' },
      { v: 'kamus', t: 'Kamus bahasa Inggris', d: 'kamus saku, sampulnya sudah lecek' },
      { v: 'catatan', t: 'Buku catatan kosong', d: 'buku tulis bergaris' }] }],
    done: (s, p) => { s.bekal = p.bekal; return { note: 'Paginya, Ibu melambai sampai bus menghilang di tikungan. Dika berlari mengejar bus sampai ujung jalan.', go: 'b1_gerbang' }; }
  },

  b1_gerbang: {
    bab: 1, judul: 'Gerbang', waktu: 'Senin, 19 Agustus 1996', bulan: '1996-08', scene: 'gerbang', alt: 'Gerbang kampus dengan spanduk penyambutan',
    text: ['Gerbang besi Universitas Gelora Bangsa terbuka lebar. Panitia ospek berteriak lewat toa, dan ratusan mahasiswa baru berkemeja putih mengalir masuk.', 'Sejak 27 Juli, sebuah truk tentara parkir di perempatan dekat kampus. Di trotoar, penjual koran meneriakkan nama-nama yang diburu.'],
    hots: {
      spanduk: { label: 'Spanduk', text: 'Spanduknya dicat tangan di atas kain belacu. Huruf G pada kata BANGSA sudah luntur kena hujan.' },
      koran: { label: 'Penjual koran', text: '“Aktivis diburu! Aktivis diburu!” Judul halaman depan: Pemerintah Buru Dalang 27 Juli. Di bawahnya ada foto-foto kecil wajah anak muda, salah satunya berambut gondrong dengan bekas luka di pelipis.' },
      selebaran: { label: 'Selebaran di tiang', text: 'Selebaran kecil, nyaris tertutup iklan sedot WC: KELOMPOK STUDI PENA. Diskusi buku tiap Kamis malam. Hubungi Ratna, Fakultas Hukum.', fx: { ratna: 1 } },
      poster: { label: 'Poster sobek', text: 'Poster setengah tersobek di tiang listrik: “Dapur Umum untuk Warga Kampung Rawa yang Digusur. Bawa beras, bawa tenaga.” Di pojok bawah ada cap kecil berbentuk pena.' },
      panitia: { label: 'Panitia', text: '“Maba! Jangan bengong di gerbang! Daftar ulang di aula, ambil KTM, lalu ke lapangan. Lari!”' }
    },
    choices: [{ t: 'Masuk gerbang dan daftar ulang', go: 'b1_ktm' }]
  },
  b1_ktm: { mode: 'ktm', bab: 1, judul: 'Daftar Ulang', waktu: 'Senin, 19 Agustus 1996', scene: 'ktm', alt: 'KTM-mu di atas meja loket', aman: true },
  b1_lapangan: {
    bab: 1, judul: 'Lapangan', waktu: 'Senin, 19 Agustus 1996 · pukul 11.00', scene: 'lapangan', alt: 'Empat senior berdiri di depan barisan maba',
    text: s => ['Kamu duduk bersila di barisan maba. Matahari tepat di atas kepala. Empat senior berjalan pelan di depan barisan, memandangi kalian dari atas.', 'Di pinggir lapangan, seseorang membagikan buletin fotokopian berjudul SUARA PENA. Panitia merampasnya dan merobeknya di depan kalian.', ...(s.fak === 'Ekonomi' ? ['Seseorang di belakangmu berbisik, “Anak Ekonomi. Paling nanti jadi pegawai bank.”'] : s.fak === 'FISIP' ? ['Di warung depan gedung FISIP, dua laki-laki berjaket kulit duduk di bangku yang sama seperti kemarin.'] : []), 'Di sebelahmu, panitia membentak Laras karena tali sepatunya lepas. Wajah Laras pucat. Ia mulai limbung.'],
    hots: {
      damar: { label: 'Senior gondrong', text: 'Rambut gondrong, jaket jins yang sudah pudar. Ia berhenti di depanmu dan bergumam: “Ospek ini latihan kecil untuk tunduk. Jangan sampai terbiasa.”' },
      ratna: { label: 'Senior berkacamata', text: 'Kacamata, map tebal terjepit di lengan. Ia mencatat sesuatu setiap kali panitia berteriak terlalu keras.' },
      fikri: { label: 'Senior berpeci', text: 'Peci hitam, kemeja putih yang disetrika rapi. Ia menyodorkan botol air ke maba yang kepanasan, lalu kembali ke barisan senior tanpa bicara.' },
      yudi: { label: 'Senior berkemeja licin', text: 'Kemeja licin, pager di ikat pinggang. Ia tersenyum ke panitia seperti kawan lama. Pager-nya berbunyi dua kali.' },
      laras: { label: 'Laras', text: 'Papan nama kardus di lehernya bertuliskan LARAS, KOMUNIKASI. Keringat dingin mengalir di pelipisnya.' }
    },
    choices: [
      { t: 'Diam dan ikuti perintah. Yang penting ospek cepat selesai.', fx: { nyali: -5 }, go: 'b2_sekre', note: 'Ospek selesai tepat waktu. Panitia lain membawa Laras ke tenda medis. Tidak ada yang mengingat namamu, dan untuk sekarang itu terasa aman.' },
      { t: 'Angkat tangan dan tanya kenapa orang harus dibentak untuk belajar.', fx: { pengaruh: 5, nyali: 5, sorotan: 2, damar: 1 }, go: 'b2_sekre', note: 'Panitia menyuruhmu push-up dua puluh kali. Dari barisan senior, laki-laki gondrong berjaket jins tertawa dan mencatat namamu.' },
      { t: 'Papah Laras ke tenda medis, apa pun kata panitia.', fx: { massa: 5, ratna: 1, fikri: 1, larasDitolong: true, kenal_ratna: true }, go: 'b2_sekre', note: 'Di tenda medis, senior berkacamata yang tadi mencatat-catat menyodorkan air. “Ratna, Hukum,” katanya. Laras menggenggam tanganmu. “Makasih. Aku utang satu.”' }
    ]
  },

  b2_sekre: {
    bab: 2, judul: 'Empat Pintu', waktu: 'Kamis, 12 September 1996', bulan: '1996-09', scene: 'sekre', v: 'siang', alt: 'Sekretariat bersama dengan empat senior',
    text: ['Sekretariat bersama di lantai dua gedung lama. Dinding penuh poster, mesin stensil bocor tinta di tengah ruangan, dan kopi tubruk yang tidak pernah habis.', 'Senior-senior yang kamu lihat di lapangan ada di sini, masing-masing di sudutnya sendiri. Belum ada yang memperkenalkan diri. Malam ini kamu hanya sempat ikut salah satu dari mereka.'],
    hots: {
      damar: { label: s => s.f.kenal_damar ? 'Bang Damar' : 'Senior gondrong di jendela', text: 'Ia menelepon setengah berbisik: “Truk dua, toa satu. Jam tujuh di gerbang depan. Jangan bilang siapa-siapa dulu.” Di lengan bajunya ada bekas jahitan yang belum lama.', act: { t: 'Ajak bicara', fx: { damar: 1, kenal_damar: true }, note: '“Damar.” Ia menyalakan kretek baru. Kamu bertanya soal bekas jahitan itu. “Diponegoro, 27 Juli. Mereka cuma mengerti satu bahasa, Dik: jalanan penuh orang.”' } },
      ratna: { label: s => s.f.kenal_ratna ? 'Kak Ratna' : 'Senior berkacamata di meja', text: 'Ia memarahi seseorang karena notulen rapat kemarin hilang. “Kalau tidak tercatat, besok kita mulai dari nol lagi. Siapa yang datang, siapa yang bicara, siapa yang pulang duluan.”', act: { t: 'Ajak bicara', fx: { ratna: 1, kenal_ratna: true }, note: s => (s.f.kenal_ratna ? 'Kak Ratna mengenalimu dari tenda medis.' : '“Ratna.” Ia tidak mengangkat kepala dari mapnya.') + ' Ia menunjukkan berkas pengaduan warga Kampung Rawa. “Satu orang marah gampang dibungkam. Seratus orang yang tahu haknya dan punya pengacara, itu lain.”' } },
      fikri: { label: s => s.f.kenal_fikri ? 'Bang Fikri' : 'Senior berpeci di atas tikar', text: 'Ia selesai salat, lalu membantu tukang sapu gedung mengangkat ember. Ia memanggilnya “Pak” dan bertanya soal anaknya yang sakit.', act: { t: 'Ajak bicara', fx: { fikri: 1, kenal_fikri: true }, note: '“Fikri.” Ia menuang teh untukmu. “Kemarin ada yang mau bawa batu ke aksi. Aku larang. Kalau kita memukul, apa bedanya kita dengan yang kita lawan?”' } },
      yudi: { label: s => s.f.kenal_yudi ? 'Mas Yudi' : 'Senior di dekat telepon senat', text: 'Ia tertawa di telepon. “Siap, Pak. Nanti saya sampaikan ke anak-anak. Ya, ya, pasti tertib.” Setelah menutup telepon, ia mengedip ke arahmu.', act: { t: 'Ajak bicara', fx: { yudi: 1, kenal_yudi: true }, note: '“Yudi, Ketua Senat.” Ia menjabat tanganmu erat. “Pembantu rektor itu bisa diajak bicara, asal kita datang membawa surat, bukan toa. Aturan yang diubah lebih awet daripada ban yang dibakar.”' } },
      buletin: { label: 'Tumpukan buletin', text: 'SUARA PENA, edisi fotokopi. Isinya daftar harga beras dari tiga pasar, nama-nama kawan yang masih ditahan sejak Juli, dan jadwal dapur umum di Kampung Rawa.' },
      kotak: { label: 'Kaleng sumbangan', text: 'Kaleng biskuit bertuliskan “Untuk LBH dan dapur umum”. Isinya uang receh dan satu cincin perak.' },
      stensil: { label: 'Mesin stensil', text: 'Seorang maba berkaus oblong berjongkok di samping mesin stensil, tangannya hitam kena tinta. “Rol tintanya macet. Bantuin pegang, dong?”', act: { t: 'Bantu memperbaiki rol tinta', req: s => !s.kader.wahyu, fx: { kader: 'wahyu' }, note: 'Setengah jam kemudian mesin berputar lagi. Namanya Wahyu, anak Teknik. “Kalau butuh cetak apa pun, atau butuh sopir, cari aku.”' } },
      papan: { label: 'Papan pengumuman', text: 'Jadwal Kelompok Studi PENA (Kamis malam), kajian ba’da Isya di masjid kampus (Selasa), rapat senat (Rabu pagi), dan secarik kertas: DICARI TINTA STENSIL, BAYAR NANTI.' }
    },
    choices: [
      { t: s => `Ikut ${s.f.kenal_damar ? 'Bang Damar' : 'senior gondrong itu'} ke rapat di warung belakang kampus.`, fx: { damar: 2, nyali: 5, sorotan: 5 }, go: 'b2_tamu', note: s => 'Rapatnya berisik, penuh asap rokok, dan semua orang ingin turun ke jalan besok pagi. Kamu pulang dengan jantung berdebar.' + larasIkut(s) },
      { t: s => `Ikut ${s.f.kenal_ratna ? 'Kak Ratna' : 'senior berkacamata itu'} ke kelompok studi di kos-kosan.`, fx: { ratna: 2, pengaruh: 5, kader: 'bimo' }, go: 'b2_tamu', note: s => 'Kalian membaca ekonomi politik sampai lewat tengah malam. Bimo, anak Kedokteran di sebelahmu, menawarkan diri membantu merangkum.' + larasIkut(s) },
      { t: s => `Ikut ${s.f.kenal_fikri ? 'Bang Fikri' : 'senior berpeci itu'} ke kajian selepas Isya di masjid kampus.`, fx: { fikri: 2, massa: 5, kader: 'bimo' }, go: 'b2_tamu', note: s => 'Kajian malam itu membahas kezaliman dan kewajiban bersuara. Bimo, anak Kedokteran, mengajakmu pulang bareng.' + larasIkut(s) },
      { t: s => `Ikut ${s.f.kenal_yudi ? 'Mas Yudi' : 'senior di dekat telepon itu'} ke rapat dengan pembantu rektor.`, fx: { yudi: 2, pengaruh: 5, sorotan: -3 }, go: 'b2_tamu', note: s => 'Ruang rapatnya ber-AC. Pembantu rektor menepuk bahumu dan bilang mahasiswa sepertimu adalah harapan bangsa.' + larasIkut(s) }
    ]
  },
  b2_tamu: {
    bab: 2, judul: 'Tamu Malam', waktu: 'Kamis, 12 September 1996 · pukul 23.00', scene: 'kos', v: 'malam', kalender: 'September 1996', alt: 'Kamar kos di malam hari',
    text: s => ['Ketukan pelan di pintu kamarmu: tiga kali, berhenti, lalu dua kali lagi.', 'Di lorong berdiri laki-laki gondrong dengan bekas luka di pelipis. Ia memperkenalkan diri sebagai Bang Yos, senior FISIP. Wajahnya ada di koran yang kamu lihat di gerbang. “Tiga malam saja. Setelah itu aku pergi. Kalau tidak bisa, antar aku ke Damar.”', s.damar >= 2 || s.f.kenal_damar ? '“Damar yang menyuruhku ke sini. Katanya kamu bisa dipercaya. Anak-anak juga tahu aku ke kamarmu malam ini.”' : '“Aku tidak kenal siapa-siapa lagi di kampus ini. Tidak ada yang tahu aku mengetuk pintumu.”'],
    hots: {
      pintu: { label: 'Lorong', text: 'Bang Yos menoleh ke ujung lorong setiap beberapa detik. Sandalnya basah, seperti baru melewati selokan.' },
      jendela: { label: 'Jendela', text: 'Gang di bawah sepi. Hanya ada lampu warung rokok yang belum tutup.' }
    },
    choices: [
      { t: 'Terima dan sembunyikan Bang Yos', fx: { sorotan: 5 }, go: 'b2_sembunyi' },
      // menolak: Yos tertangkap (kamu aman), atau diselamatkan kawan lain (kamu dicap pengkhianat)
      { t: 'Tolak dengan halus', run: s => { if (!(s.damar >= 2 || s.f.kenal_damar)) { s.f.yosTertangkap = true; s.ui.tmp = 'Bang Yos mengangguk, seolah sudah biasa ditolak. Seminggu kemudian, koran memberitakan ia tertangkap di sebuah rumah kos di Rawamangun. Tidak ada yang tahu ia pernah mengetuk pintumu.'; } else { s.f.yosDitolak = true; s.ending = 'dikeluarkan'; s.ui.tmp = 'Bang Yos mengangguk, lalu menghilang di ujung lorong. Dua malam kemudian, kawan-kawan PENA membawanya lolos lewat atap rumah warga. Cerita bahwa kamu menutup pintu untuknya menyebar ke seluruh sekretariat.'; } }, go: s => s.ending ? 'akhir' : 'kos1', note: s => s.ui.tmp },
      { t: 'Antar Bang Yos ke Bang Damar malam itu juga', fx: { damar: 1, sorotan: 5, yosPercaya: 1, kenal_damar: true }, go: 'kos1', note: 'Bang Damar tidak banyak bertanya. Ia membawa Yos pergi dengan motor tua lewat jalan belakang. Sebelum naik, Yos mengangguk sekali ke arahmu.' }
    ]
  },
  b2_sembunyi: {
    mode: 'hide', siapa: 'yos', rounds: 2, spots: ['plafon', 'lemari', 'kolong'], bab: 2, judul: 'Razia Kos', waktu: 'Minggu, 15 September 1996 · pukul 02.00', scene: 'sembunyi', alt: 'Pandangan dari tempat persembunyian',
    text: ['Malam ketiga, Hansip dan dua laki-laki berjaket kulit memeriksa kamar-kamar kos satu per satu. Kamu harus memilih tempat untuk Bang Yos, lalu menunggu.'],
    after: (s, ok) => ok
      ? { fx: { damar: 1, yosBerutang: true, yosPercaya: 2 }, note: 'Langkah-langkah itu menjauh. Subuh, Bang Yos pamit lewat jendela belakang. “Aku utang nyawa. Aku tidak akan lupa siapa yang membukakan pintu.”', go: 'kos1' }
      // tertangkap: kamu dipukuli, tapi orang-orang jadi percaya padamu
      : { fx: { sorotan: 15, nyali: -15, massa: 10, pengaruh: 8, damar: 1, ratna: 1, fikri: 1, yosTertangkap: true }, note: ['Senter berhenti di tempat persembunyian. Bang Yos diseret keluar tanpa melawan.', 'Dua laki-laki berjaket kulit memukulimu di halaman kos sampai ibu kos berteriak memanggil Pak RT. Namamu dicatat di sebuah buku kecil bersampul hitam.', 'Dua hari kemudian, ceritanya menyebar di kampus: maba yang menyembunyikan Bang Yos dan tidak menyebut satu nama pun. Orang-orang mulai menyapamu lebih dulu.'], go: 'kos1' }
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
    text: ['Malam ini Kelompok Studi PENA akan membahas Bumi Manusia, novel yang dilarang Kejaksaan Agung sejak 1981. Sebelum diskusi, kamu masih sempat membaca sebentar.'],
    hots: { rak: { label: 'Rak buku', text: 'Rak itu terasa lebih kosong. Beberapa buku dibawa pulang anggota, dan belum kembali.' } },
    choices: () => bukuChoices('b3_pintu')
  },
  b3_pintu: {
    mode: 'inspect', level: 1, v: 'pintu', sabar: 5, bab: 3, judul: 'Penjaga Pintu', waktu: 'Kamis, 7 November 1996 · pukul 19.30', scene: 'inspect', alt: 'Ambang pintu sekretariat, tamu berdiri di depanmu',
    text: ['Kak Ratna menyerahkan papan jepit berisi daftar anggota kepadamu. “Kamu jaga pintu. Hanya yang ada di daftar boleh masuk. Kemarin ada orang asing di kantin yang menanyakan jadwal kita.”'],
    rules: '<ul class="rules"><li>Foto di KTM cocok dengan wajah.</li><li>Nama, fakultas, dan angkatan sesuai daftar.</li><li>Stempel asli: lingkaran merah ganda dengan bintang.</li></ul>',
    daftar: () => tabel(['Nama', 'Fakultas', 'Angkatan'], DAFTAR1), daftarLabel: 'Daftar anggota Kelompok Studi PENA',
    visitors: () => INSPEKSI1,
    evaluate: (s, kep, list) => {
      const { fx, lines } = nilaiStandar(kep, list, (t, fx, lines) => { s.f.intelMasuk = true; lines.push('Hendra lolos masuk. Belakangan kamu tahu: fotonya tidak cocok, stempelnya palsu, dan sepatunya lars.'); });
      if (kep.mei === 'tolak') { fx.ratna = 1; lines.push('Mei pulang malam itu. Kak Ratna bilang kamu menjalankan aturan dengan benar, meski Mei memang anggota.'); }
      else { fx.kader = 'mei'; if (kep.mei === 'jamin') fx.ratna = 1; lines.push(kep.mei === 'jamin' ? 'Kadermu menjamin Mei, dan Kak Ratna mengangguk puas. Mei bergabung denganmu.' : 'Mei masuk tanpa KTM. Ia memang anggota, dan sejak malam itu ia mencatat untukmu.'); }
      s.f.hadirDiskusi = list.filter(t => t.sah && kep[t.id] !== 'tolak').map(t => t.id);
      s.f.hendraKenal = true;
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
      { t: 'Mulai seperti biasa. Bacakan bab pertama keras-keras.', fx: s => ({ kuasa: -1, nyali: 10, sorotan: s.f.intelMasuk ? 25 : 15, massa: 5, damar: 1 }), go: 'kos2', note: s => s.f.intelMasuk ? 'Diskusinya hidup. Hendra menulis sepanjang malam. Seminggu kemudian, Sri dipanggil ke ruang pembantu rektor.' : 'Diskusinya hidup. Untuk pertama kalinya kamu membaca keras-keras sesuatu yang dilarang, dan tidak terjadi apa-apa. Setidaknya malam ini.' },
      { t: 'Bubarkan dengan alasan listrik padam, lalu pindah diam-diam ke kos kawan.', fx: { kuasa: -1, pengaruh: 5, sorotan: -5, ratna: 1, diskusiPindah: true }, go: 'kos2', note: s => s.f.intelMasuk ? 'Satu jam kemudian kalian berkumpul lagi di kos Rudi. Hendra tidak ikut, karena ia tidak tahu alamatnya.' : 'Hanya yang kamu kenal yang datang ke lokasi baru. Kamu mulai paham kenapa Kak Ratna selalu menyimpan dua jadwal.' },
      { t: 'Ganti topik menjadi diskusi etika dan agama.', fx: s => ({ massa: 5, sorotan: s.f.intelMasuk ? 3 : -5, fikri: 1 }), go: 'kos2', note: s => s.f.intelMasuk ? 'Hendra pergi setelah setengah jam, bosan. Beberapa kawan kecewa, tapi tidak ada yang dipanggil ke mana-mana.' : 'Diskusinya jadi aman dan agak membosankan. Beberapa kawan kecewa.' },
      { t: 'Serahkan ke Mas Yudi supaya diurus lewat senat.', fx: { sorotan: -8, massa: -5, yudi: 1 }, go: 'kos2', note: 'Diskusi dibubarkan dengan alasan izin kegiatan. Tidak ada yang ditangkap. Beberapa kawan berhenti mengajakmu ngopi.' }
    ]
  },
  kos2: kosNode({ bab: 'Antara bab 3 dan 4', waktu: 'November 1996 – Januari 1997', dari: '1996-11', bulan: '1997-01', kalender: 'Januari 1997', next: 'b4_kabar' }),
  b4_kabar: {
    bab: 3, judul: 'Kabar dari Radio', waktu: 'Januari 1997', scene: 'sekre', v: 'radio', alt: 'Radio di meja sekretariat',
    text: ['Sepanjang akhir tahun, radio membawa kabar kerusuhan dari tempat-tempat yang jauh: gereja dan toko dibakar di Situbondo pada Oktober, toko-toko warga Tionghoa di Tasikmalaya pada Desember, dan bentrokan antaretnis di Kalimantan Barat yang belum juga reda.', 'Di koran pemerintah, seorang pejabat menyebut “kelompok mahasiswa radikal” ikut memanas-manasi. Tidak ada buktinya.'],
    hots: { radio: { label: 'Radio', text: 'Penyiar membaca imbauan agar masyarakat tidak terpancing isu SARA. Lagu-lagu perjuangan diputar sesudahnya.' }, koran: { label: 'Koran', text: 'Kata “provokator” muncul tujuh kali di satu halaman, tanpa satu nama pun.' } },
    choices: [
      { t: 'Ajak kelompok kajian lain menggelar diskusi lintas iman', fx: { kuasa: -1, fikri: 1, massa: 3, sorotan: 2 }, go: 'b4_bus', note: 'Pengurus gereja, masjid, dan vihara di sekitar kampus duduk di tikar yang sama. Seorang pendeta tua bilang, “Yang membakar itu bukan umat siapa-siapa.”' },
      { t: 'Kumpulkan kliping dan kesaksian untuk LBH', fx: { kuasa: -1, ratna: 1, pengaruh: 3, sorotan: 3 }, go: 'b4_bus', note: 'Kamu menggunting setiap berita dan mencatat siapa yang pertama datang dengan truk. Polanya mirip, di kota-kota yang berbeda.' },
      { t: 'Diam. Ini bukan urusan kita', fx: { nyali: -2 }, go: 'b4_bus', note: 'Kamu mematikan radio. Di sekretariat, tidak ada yang membicarakannya lagi.' }
    ]
  },

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
      kartu: { label: 'Kartu Lebaran titipan', text: 'Seorang kawan menitipkan setumpuk kartu Lebaran sebelum kamu mudik. Di balik ucapan Selamat Idul Fitri tercetak seruan kecil: tolak pemilu tanpa pilihan. Awal bulan lalu, seorang tokoh oposisi ditahan karena kartu Lebaran semacam ini.', act: { t: 'Teruskan kartunya ke kawan-kawan SMA', fx: { iklim: 2, sorotan: 5, kartuLebaran: true }, note: s => 'Kamu menitipkan kartu-kartu itu ke kawan lama di masjid kampung.' + (s.f.bohongBapak ? ' Malamnya, Bapak menemukan satu kartu terselip di tasmu. Ia membacanya lama, lalu membakarnya di dapur.' : '') } },
      tv: { label: 'Televisi', text: 'Gema takbir dari televisi bercampur suara petasan anak-anak di gang.' }
    },
    choices: [
      { t: 'Ceritakan semuanya kepada Bapak', fx: s => ({ bapak: s.f.janjiBapak && s.pengaruh >= 10 ? -2 : -1, ibu: 1, jujurBapak: true }), go: 'b4_teror', note: s => s.f.janjiBapak ? 'Bapak diam lama. “Kamu sudah janji.” Ia masuk kamar tanpa menunggu jawaban. Ibu mengusap punggungmu.' : 'Bapak mendengarkan sampai selesai. “Hati-hati. Itu saja.” Ibu mengusap punggungmu.' },
      { t: 'Bilang kamu hanya kuliah', fx: { bapak: 1, bohongBapak: true }, go: 'b4_teror', note: 'Bapak tersenyum lega dan menambahkan uang saku. Kamu tidak berani menatap Dika.' },
      { t: 'Ceritakan semuanya kepada Dika saja', fx: { tahu: 2, kagum: 1 }, go: 'b4_teror', note: 'Dika mendengarkan sampai larut malam, matanya berbinar. “Nanti aku kuliah di tempatmu.”' },
      { t: 'Beri Dika satu buku dari rak sekretariat', req: s => s.buku.selesai.length > 0, fx: s => ({ kagum: 2, tahu: 1, bukuUntukDika: s.buku.selesai.some(b => BUKU[b].terlarang) }), go: 'b4_teror', note: 'Dika menyembunyikan buku itu di bawah kasurnya. “Aman. Bapak tidak pernah masuk kamarku.”' }
    ]
  },
  b4_teror: {
    bab: 4, judul: 'Sekretariat Digeledah', waktu: 'akhir Februari 1997', scene: 'sekre', v: 'razia', alt: 'Sekretariat yang berantakan setelah digeledah',
    enter: s => { s.f.yosPemimpin = !s.f.yosTertangkap && !!s.f.yosPercaya; return { nyali: -5, ...(s.f.yosPemimpin ? { pengaruh: s.f.yosPercaya === 2 ? 15 : 5 } : {}) }; },
    text: s => ['Pulang dari Lebaran, kamu mendapati pintu sekretariat dibuka paksa. Rak buku diobrak-abrik, buletin Suara PENA yang belum dibagikan hilang, dan di dinding ada coretan cat semprot: PKI.', 'Pagi itu juga rektorat menempel pengumuman: kegiatan Kelompok Studi PENA dibekukan sampai ada izin.',
      s.f.yosPemimpin ? (s.f.yosPercaya === 2 ? 'Sore harinya Bang Yos muncul lagi, rambutnya dipotong pendek. Kawan-kawan memintanya memimpin PENA. Hal pertama yang ia lakukan: menyerahkan daftar anggota kepadamu. “Yang ini kupercayakan ke orang yang dulu menyembunyikanku.”' : 'Sore harinya Bang Yos muncul lagi, rambutnya dipotong pendek, dan kawan-kawan memintanya memimpin PENA. Ia mengangguk ke arahmu. “Kamu yang dulu mengantarku ke Damar, kan?”') : 'Kak Ratna mengumpulkan siapa saja yang masih mau datang. Untuk sementara, ia memegang PENA sendirian.'],
    hots: {
      dinding: { label: 'Coretan di dinding', text: 'Cat semprotnya masih basah di bagian bawah. Huruf K-nya miring, seperti ditulis tergesa-gesa.' },
      pengumuman: { label: 'Pengumuman rektorat', text: 'Ditandatangani Pembantu Rektor III. Alasannya: “kegiatan tanpa izin yang meresahkan”.' },
      rak: { label: 'Rak buku', text: 'Yang hilang hanya buku-buku bersampul koran. Mereka tahu persis apa yang dicari.' }
    },
    choices: [{ t: 'Ikut rapat keamanan malam itu', go: 'b7_protokol' }]
  },
  kos3: kosNode({ bab: 'Antara bab 4 dan 5', waktu: 'Februari – April 1997', dari: '1997-02', bulan: '1997-04', kalender: 'April 1997', next: 'b5_selebaran' }),

  b5_selebaran: {
    mode: 'form', rencana: true, bab: 5, judul: 'Selebaran Pertama', waktu: 'Mei 1997', bulan: '1997-05', scene: 'sekre', v: 'stensil', alt: 'Meja stensil di sekretariat',
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
    text: ['Hari pemungutan suara. TPS 07 di kampung dekat kosmu dihias bendera tiga partai. Antrean pemilih mengular sejak pagi.', 'Seminggu lalu, di hari terakhir kampanye, Banjarmasin rusuh. Pusat perbelanjaan terbakar, dan radio menyebut lebih dari seratus orang tewas. Di antrean, tidak ada yang mau membicarakannya keras-keras.'],
    hots: {
      bilik: { label: 'Bilik suara', text: 'Tiga bilik dari tripleks dengan tirai kain. Paku untuk mencoblos diikat tali rafia.' },
      kotak: { label: 'Kotak suara', text: 'Kotak aluminium bergembok. Gemboknya dipegang seorang laki-laki berseragam Korpri.' },
      saksi: { label: 'Meja TPS', text: 'Hanya ada saksi dari satu partai. Dua kursi saksi lainnya kosong.' },
      radio: { label: 'Radio warung', text: 'Penyiar membacakan imbauan agar pemilu berlangsung aman. Kata Banjarmasin tidak disebut sama sekali.' }
    },
    choices: [
      { t: 'Mencoblos, lalu pulang', fx: { kuasa: 1, yudi: 1, bapak: 1 }, go: 'b6_bank', note: 'Tintanya susah hilang dari jarimu. Malamnya kamu menelepon Bapak dan bilang sudah mencoblos.' },
      { t: 'Jadi pemantau independen dan catat kecurangan', fx: { kuasa: -2, ratna: 1, massa: 5, sorotan: 5, bukti: 'kecurangan' }, go: 'b6_bank', note: 'Kamu mencatat dua puluh tiga kejanggalan: surat suara yang sudah tercoblos, pemilih yang datang dua kali, dan saksi yang diusir. Catatan itu kamu simpan baik-baik.' },
      { t: 'Tidak datang. Tempel selebaran golput di gang.', fx: s => ({ kuasa: -2, sorotan: 10, damar: 1, bapak: s.pengaruh >= 15 ? -1 : 0 }), go: 'b6_bank', note: 'Selebaranmu dicopot Hansip sebelum siang. Ketua RW menanyakan kamarmu kepada ibu kos.' }
    ]
  },

  b6_bank: {
    bab: 6, judul: 'Rupiah Jatuh', waktu: 'Oktober 1997', bulan: '1997-10', scene: 'bank', alt: 'Antrean di depan bank dan papan kurs',
    text: ['Sejak 14 Agustus 1997, rupiah dilepas ke kurs mengambang. Papan di money changer seberang bank diganti setiap jam.', 'Antrean nasabah di depan bank swasta memanjang sampai trotoar. Orang-orang bilang bank-bank kecil akan ditutup.'],
    hots: {
      papan: { label: 'Papan kurs', text: s => `Hari ini satu dolar ${rp(s.kurs)}. Tahun lalu masih sekitar Rp 2.300.` + (s.fak === 'Ekonomi' ? ' Sebagai anak Ekonomi, kamu tahu ini baru permulaan.' : '') },
      antrean: { label: 'Antrean', text: 'Seorang ibu memeluk tas berisi buku tabungan. “Uang sekolah anak saya ada di sini semua.”' },
      satpam: { label: 'Satpam', text: '“Bank aman, Bu. Bank aman.” Ia mengulanginya seperti doa.' }
    },
    choices: [
      { t: 'Tarik tabunganmu dan belikan dolar', req: s => s.uang.bank + s.uang.tunai >= 50000, run: s => { const dariBank = s.bankBeku ? 0 : s.uang.bank, dariTunai = Math.floor(s.uang.tunai / 2), total = dariBank + dariTunai, usd = Math.floor(total / (s.kurs * 1.015)), pakai = Math.round(usd * s.kurs * 1.015); s.uang.bank -= dariBank; s.uang.tunai += total - dariBank - dariTunai - pakai + dariBank; s.uang.usd += usd; s.ui.tmp = usd; }, go: 'b6_asap', note: s => `Kamu menukar uangmu menjadi USD ${s.ui.tmp}. Lembaran hijau itu kamu selipkan di dalam sampul buku P4.` },
      { t: 'Belikan beras dan minyak untuk dapur umum warga', cost: () => harga(50000), dis: s => s.uang.tunai < harga(50000), alasan: 'butuh tunai', fx: { massa: 10, dapurUmum: true, kader: 'asep', dapurKali: 1 }, go: 'b6_asap', note: 'Bersama Asep, anak Ekonomi yang tinggal di kampung itu, kamu membuka dapur umum di rumah Pak RT. Antrean nasinya lebih panjang dari antrean bank.' },
      { t: 'Biarkan uangmu di bank', go: 'b6_asap', note: 'Bunga deposito naik setiap minggu. Kamu memutuskan untuk percaya.' },
      { t: 'Urus paspor di kantor imigrasi', cost: 100000, dis: s => s.uang.tunai < 100000, alasan: 'butuh Rp 100.000', fx: { paspor: true }, go: 'b6_asap', note: 'Petugas imigrasi bertanya untuk apa mahasiswa butuh paspor. Kamu bilang ingin ikut lomba debat di Singapura. Paspormu jadi dua minggu kemudian.' }
    ]
  },
  b6_asap: {
    bab: 6, judul: 'Kabut Asap', waktu: 'Oktober 1997', scene: 'sekre', v: 'radio', alt: 'Sekretariat dengan jendela berkabut',
    kabar: s => [kabar('lengser', 'warung'), kabar('lengser', s.yudi >= 2 ? 'yudi' : 'tvri')],
    text: ['Asap dari kebakaran hutan di Sumatra dan Kalimantan sampai ke berita setiap malam. Sekolah-sekolah di Kalimantan diliburkan, dan rumah sakit penuh orang sesak napas. Sebagian lahan yang terbakar milik perusahaan perkebunan besar.', 'Di warung, orang membicarakan hal lain: kabarnya Presiden bilang ke partainya ia siap lengser keprabon.'],
    hots: { tv: { label: 'Televisi', text: 'Gambar langit oranye di Palangkaraya. Anak-anak berangkat sekolah memakai masker kain.' }, kaleng: { label: 'Kaleng sumbangan', text: 'Kaleng biskuit yang sama, sekarang ditulisi: MASKER UNTUK KALIMANTAN.' } },
    choices: [
      { t: 'Galang dana untuk masker', cost: () => harga(10000), dis: s => s.uang.tunai < harga(10000), alasan: 'uangmu tidak cukup', fx: { kuasa: -1, massa: 5, fikri: 1 }, go: 'kos5', note: 'Tiga kardus masker dikirim lewat kantor pos. Kawan dari Pontianak menangis saat menerima kabarnya.' },
      { t: 'Tulis di buletin: siapa pemilik lahan yang terbakar', fx: { kuasa: -2, iklim: 3, ratna: 1, sorotan: 4 }, go: 'kos5', note: 'Kamu mencocokkan peta kebakaran dengan daftar perusahaan perkebunan. Nama-namanya tidak asing di halaman ekonomi koran.' },
      { t: 'Biarkan, ada urusan yang lebih dekat', go: 'kos5', note: 'Kamu mematikan televisi. Langit Jakarta masih biru.' }
    ]
  },
  kos5: kosNode({ bab: 'Antara bab 6 dan 7', waktu: 'Juni – Desember 1997', dari: '1997-05', bulan: '1997-12', kalender: 'Desember 1997', next: 'b7_toko' })
});
