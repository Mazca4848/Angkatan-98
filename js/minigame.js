/* Angkatan 98 · mini game slot kos: kuis kuliah, les privat, obrolan, dan membaca */

// slot yang punya mini game; hanya slot ini yang boleh ditaruh di prioritas Penting dan Sedang
const MG_JENIS = { kuliah: 'kuis', kerja: 'les', dapur: 'les', baca: 'baca', organisasi: 'obrolan', telepon: 'obrolan', dika: 'obrolan', damar: 'obrolan', ratna: 'obrolan', fikri: 'obrolan', yudi: 'obrolan' };
const jenisMain = id => !!id && (id.startsWith('buku_') ? 'baca' : id.startsWith('kader_') ? 'obrolan' : MG_JENIS[id]);
const PRIOR = [{ t: 'Penting', kali: 1.5 }, { t: 'Sedang', kali: 1 }, { t: 'Rendah', kali: 0.5 }];
const ULANG_MAKS = 4, POTONG = 0.2; // tiap ulangan di prioritas Penting memotong hasil Sedang dan Rendah 20%
const bobotSlot = (i, ulang) => Math.round(PRIOR[Math.floor(i / 2)].kali * (i >= 2 ? Math.max(0, 1 - POTONG * ulang) : 1) * 100) / 100;

// konten dipakai sekali per permainan supaya tidak berulang
function ambilBaru(kunci, daftar) {
  const pakai = S.f.mgPakai = S.f.mgPakai || {};
  const sudah = pakai[kunci] = pakai[kunci] || [];
  let sisa = daftar.filter(x => !sudah.includes(x.id));
  // shortcut: kalau satu bank habis, bank itu dipakai ulang dari awal; hanya terjadi kalau satu kegiatan diulang sangat sering
  if (!sisa.length) { pakai[kunci] = []; sisa = daftar.slice(); }
  const x = pick(sisa); pakai[kunci].push(x.id); return x;
}
// soal buatan tidak pernah habis; teksnya dicatat agar tidak keluar dua kali
function buatBaru(kunci, pembuat) {
  const pakai = S.f.mgPakai = S.f.mgPakai || {}, sudah = pakai[kunci] = pakai[kunci] || [];
  let x; for (let i = 0; i < 30; i++) { x = pick(pembuat)(); if (!sudah.includes(x.q)) break; }
  sudah.push(x.q); return x;
}
const acak = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = randInt(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/* ---------- kuis kuliah ---------- */
const KUIS = [
  { id: 'sila4', q: 'Bunyi sila keempat Pancasila adalah…', a: 'Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan', x: ['Persatuan Indonesia', 'Keadilan sosial bagi seluruh rakyat Indonesia', 'Kemanusiaan yang adil dan beradab'] },
  { id: 'p28', q: 'Pasal UUD 1945 (sebelum amandemen) yang mengatur kemerdekaan berserikat dan berkumpul adalah…', a: 'Pasal 28', x: ['Pasal 27', 'Pasal 29', 'Pasal 31'] },
  { id: 'pilihpres', q: 'Menurut UUD 1945 sebelum amandemen, Presiden dan Wakil Presiden dipilih oleh…', a: 'MPR', x: ['DPR', 'Rakyat secara langsung', 'Mahkamah Agung'] },
  { id: 'p7', q: 'Menurut Pasal 7 UUD 1945 sebelum amandemen, masa jabatan Presiden adalah…', a: 'Lima tahun, dan sesudahnya dapat dipilih kembali', x: ['Lima tahun, paling banyak dua periode', 'Empat tahun', 'Tujuh tahun'] },
  { id: 'p33', q: 'Pasal 33 UUD 1945: perekonomian disusun sebagai usaha bersama berdasar atas asas…', a: 'Kekeluargaan', x: ['Persaingan bebas', 'Musyawarah', 'Kepemilikan pribadi'] },
  { id: 'gbhn', q: 'Menurut UUD 1945 sebelum amandemen, GBHN ditetapkan oleh…', a: 'MPR', x: ['DPR', 'Presiden', 'Bappenas'] },
  { id: 'sumpah', q: 'Sumpah Pemuda diikrarkan pada tahun…', a: '1928', x: ['1908', '1926', '1945'] },
  { id: 'boedi', q: 'Budi Utomo, yang tanggal berdirinya diperingati sebagai Hari Kebangkitan Nasional, berdiri pada tahun…', a: '1908', x: ['1912', '1928', '1918'] },
  { id: 'malari', q: 'Peristiwa Malari, ketika mahasiswa memprotes modal asing, terjadi pada tahun…', a: '1974', x: ['1966', '1978', '1965'] },
  { id: 'nkk', q: 'Kebijakan NKK/BKK yang membatasi kegiatan politik mahasiswa mulai diberlakukan tahun…', a: '1978', x: ['1974', '1983', '1966'] },
  { id: 'kuhap', q: 'KUHAP adalah singkatan dari…', a: 'Kitab Undang-Undang Hukum Acara Pidana', x: ['Kitab Undang-Undang Hukum Acara Perdata', 'Kitab Undang-Undang Hukum Administrasi Publik', 'Kitab Undang-Undang Hukum Agraria dan Pertanahan'] },
  { id: 'praduga', q: 'Asas praduga tak bersalah berarti…', a: 'Seseorang dianggap tidak bersalah sampai ada putusan pengadilan yang berkekuatan hukum tetap', x: ['Polisi boleh menahan siapa pun yang dicurigai', 'Terdakwa harus membuktikan dirinya tidak bersalah', 'Hakim tidak boleh menjatuhkan hukuman penjara'] },
  { id: 'trias', q: 'Gagasan trias politica, pemisahan kekuasaan legislatif, eksekutif, dan yudikatif, terutama dikaitkan dengan…', a: 'Montesquieu', x: ['Jean-Jacques Rousseau', 'Thomas Hobbes', 'Karl Marx'] },
  { id: 'angket', q: 'Hak angket DPR adalah hak untuk…', a: 'Mengadakan penyelidikan', x: ['Mengubah undang-undang dasar', 'Membubarkan kabinet', 'Mengangkat hakim agung'] },
  { id: 'inflasi', q: 'Inflasi adalah…', a: 'Kenaikan harga barang dan jasa secara umum dan terus-menerus', x: ['Kenaikan nilai tukar rupiah', 'Bertambahnya jumlah tabungan di bank', 'Turunnya harga barang impor'] },
  { id: 'bi', q: 'Bank sentral Republik Indonesia adalah…', a: 'Bank Indonesia', x: ['Bank Negara Indonesia', 'Bank Rakyat Indonesia', 'Bank Dagang Negara'] },
  { id: 'devaluasi', q: 'Devaluasi berarti…', a: 'Penurunan nilai mata uang dalam negeri terhadap mata uang asing yang ditetapkan pemerintah', x: ['Kenaikan suku bunga bank', 'Penghapusan pajak impor', 'Pencetakan uang baru'] },
  { id: 'permintaan', q: 'Menurut hukum permintaan, jika harga suatu barang naik dan hal lain tetap, jumlah yang diminta cenderung…', a: 'Turun', x: ['Naik', 'Tetap', 'Naik dua kali lipat'] },
  { id: 'eyd', q: 'Ejaan resmi bahasa Indonesia yang berlaku sejak 1972 adalah…', a: 'Ejaan Yang Disempurnakan', x: ['Ejaan Van Ophuijsen', 'Ejaan Soewandi', 'Ejaan Melindo'] },
  { id: 'sutasoma', q: 'Semboyan Bhinneka Tunggal Ika berasal dari kitab…', a: 'Sutasoma karya Mpu Tantular', x: ['Negarakertagama karya Mpu Prapanca', 'Pararaton', 'Arjunawiwaha karya Mpu Kanwa'] },
  { id: 'wasantara', q: 'Wawasan Nusantara memandang Indonesia sebagai…', a: 'Satu kesatuan politik, ekonomi, sosial budaya, dan pertahanan keamanan', x: ['Gabungan negara-negara bagian', 'Wilayah daratan tanpa laut di antaranya', 'Kesatuan ekonomi saja'] },
  { id: 'proklamasi', q: 'Teks Proklamasi dibacakan pada 17 Agustus 1945 di…', a: 'Jalan Pegangsaan Timur 56, Jakarta', x: ['Lapangan Ikada, Jakarta', 'Gedung Sate, Bandung', 'Rengasdengklok'] },
  { id: 'p4', q: 'P4 (Pedoman Penghayatan dan Pengamalan Pancasila) ditetapkan melalui…', a: 'Ketetapan MPR tahun 1978', x: ['Dekrit Presiden 1959', 'Undang-undang tahun 1985', 'Keputusan Menteri Pendidikan'] }
];
const KUIS_BUAT = [
  () => { const k = pick([2450, 3650, 4650, 8750, 10375]), n = pick([5, 10, 20, 50]), a = k * n; return { q: `Kurs Rp ${k.toLocaleString('id-ID')} per dolar. Berapa rupiah untuk USD ${n}?`, a: rp(a), x: [rp(a * 10), rp(a / 2), rp(a + k)] }; },
  () => { const a = pick([1000, 1200, 1500, 2000, 2500]), p = pick([10, 20, 25, 40, 50]), b = a * (100 + p) / 100; return { q: `Harga minyak goreng naik dari ${rp(a)} menjadi ${rp(b)} per liter. Berapa persen kenaikannya?`, a: p + '%', x: [p * 2 + '%', Math.round(p / 2) + 1 + '%', b - a + '%'] }; },
  () => { const i = 1 + randInt(5), r = 2 + randInt(11); return { q: `Arus ${i} ampere mengalir melalui hambatan ${r} ohm. Berapa tegangannya?`, a: i * r + ' volt', x: [i + r + ' volt', i * r * 2 + ' volt', Math.max(1, r - i) + ' volt'] }; }
];
function kuisBaru() {
  const sisa = KUIS.filter(x => !((S.f.mgPakai || {}).kuis || []).includes(x.id));
  const s = sisa.length ? ambilBaru('kuis', KUIS) : buatBaru('kuisBuat', KUIS_BUAT);
  const opsi = acak([s.a, ...[...new Set(s.x)].filter(x => x !== s.a).slice(0, 3)]);
  return { q: s.q, opsi, benar: opsi.indexOf(s.a) };
}

/* ---------- les privat dan dapur umum: soal hitungan buatan ---------- */
const LES_BUAT = [
  () => { const a = 2 + randInt(8), x = 2 + randInt(14), b = 1 + randInt(30); return { q: `Muridmu kelas 2 SMP bertanya: kalau ${a}x + ${b} = ${a * x + b}, berapa x?`, a: x }; },
  () => { const h = (5 + randInt(46)) * 1000, d = pick([10, 20, 25, 50]); return { q: `Muridmu kelas 1 SMP bertanya: buku seharga ${rp(h)} didiskon ${d}%. Berapa rupiah harganya setelah diskon?`, a: h * (100 - d) / 100 }; },
  () => { const p = 3 + randInt(18), l = 2 + randInt(12); return { q: `Muridmu kelas 6 SD bertanya: berapa cm² luas persegi panjang dengan panjang ${p} cm dan lebar ${l} cm?`, a: p * l }; },
  () => { const k = 1 + randInt(6); return { q: `Muridmu kelas 2 SMP bertanya: sisi tegak segitiga siku-siku ${3 * k} cm dan ${4 * k} cm. Berapa cm sisi miringnya?`, a: 5 * k }; },
  () => { const r = 60 + randInt(31), d = [randInt(9), randInt(9), randInt(9)], n = [r + d[0], r - d[1], r + d[2], r - d[0] + d[1] - d[2]]; return { q: `Muridmu kelas 1 SMP bertanya: nilai ulangannya ${n.join(', ')}. Berapa rata-ratanya?`, a: r }; }
];
const DAPUR_BUAT = [
  () => { const k = 4 + randInt(9), q = 2 + randInt(5); return { q: `Ada ${k * q} bungkus nasi untuk ${k} keluarga, dibagi sama rata. Berapa bungkus untuk tiap keluarga?`, a: q }; },
  () => { const p = 2 + randInt(7), j = 5 + randInt(16); return { q: `Satu paket sembako berisi ${p} kg beras. Berapa kg beras untuk ${j} paket?`, a: p * j }; },
  () => { const h = pick([1500, 2000, 2500, 3000]), n = 10 + randInt(41); return { q: `Satu bungkus nasi ${rp(h)}. Berapa rupiah untuk ${n} bungkus?`, a: h * n }; }
];
const bacaAngka = v => Number(String(v).replace(/[^0-9]/g, '') || NaN);

/* ---------- obrolan: pilih arah yang sejalan dengan lawan bicara ---------- */
// arah: s = sejalan, n = mengambang, l = berlawanan. Satu jawaban berlawanan langsung gagal; dua jawaban mengambang juga gagal.
const OBROLAN = {
  damar: { nama: 'Bang Damar', reaksi: { s: 'Bang Damar menepuk bahumu. “Nah, itu baru kawan.”', n: 'Bang Damar mengangkat bahu dan menyalakan rokok lagi.', l: 'Bang Damar menatapmu lama. “Kau terlalu lama di perpustakaan.”' }, giliran: [
    { id: 'd1', kata: '“Rektorat melarang mimbar bebas minggu depan. Kita bagaimana?”', opsi: [['Tetap gelar mimbar. Larangan itu justru alasan untuk turun.', 's'], ['Kita lihat dulu suasananya, Bang.', 'n'], ['Kita ajukan surat izin ulang saja ke rektor.', 'l']] },
    { id: 'd2', kata: '“Kawan kita ditahan di Polsek sejak semalam. Apa yang kita lakukan?”', opsi: [['Kita datangi Polsek ramai-ramai pagi ini. Jangan biarkan dia sendiri.', 's'], ['Tunggu kabar dari keluarganya dulu.', 'n'], ['Biar pengacara yang urus. Kita jangan ikut-ikutan.', 'l']] },
    { id: 'd3', kata: '“Ada yang bilang demo cuma bikin macet. Kau setuju?”', opsi: [['Kalau tidak bikin gerah, penguasa tidak akan mendengar.', 's'], ['Macetnya memang parah, sih.', 'n'], ['Mungkin lebih baik kita menulis opini di koran saja.', 'l']] },
    { id: 'd4', kata: '“Harga sembako naik lagi. Rakyat sudah marah. Kita tunggu apa?”', opsi: [['Tidak ada yang ditunggu. Kita bergabung dengan warga di pasar.', 's'], ['Kita kumpulkan data harganya dulu.', 'n'], ['Pemerintah pasti punya rencana. Sabar dulu.', 'l']] },
    { id: 'd5', kata: '“Orang-orang partai mengajak kita masuk barisan mereka. Bagaimana?”', opsi: [['Kita jalan sendiri. Barisan kita bukan kendaraan siapa pun.', 's'], ['Dengar dulu tawaran mereka.', 'n'], ['Lumayan, mereka punya dana dan massa.', 'l']] },
    { id: 'd6', kata: '“Aparat membawa pentungan di aksi kemarin. Kau takut?”', opsi: [['Takut, Bang. Tapi aku tetap di barisan depan.', 's'], ['Aku belum tahu, Bang.', 'n'], ['Mungkin aku di belakang saja, mengurus logistik.', 'l']] }
  ] },
  ratna: { nama: 'Kak Ratna', reaksi: { s: 'Kak Ratna mencatat sesuatu di bukunya dan mengangguk.', n: 'Kak Ratna menunggu, lalu menghela napas.', l: 'Kak Ratna menutup bukunya. “Itu cara paling cepat membuat kita semua ditangkap.”' }, giliran: [
    { id: 'r1', kata: '“Kampus sebelah mau aksi besok. Kita ikut?”', opsi: [['Kirim delegasi untuk koordinasi dulu, baru kita putuskan bersama.', 's'], ['Terserah Kakak saja.', 'n'], ['Langsung ikut saja, Kak. Nanti juga ketemu di jalan.', 'l']] },
    { id: 'r2', kata: '“Anak-anak baru semangat, tapi belum membaca apa-apa. Apa yang kita lakukan?”', opsi: [['Buat kelompok diskusi rutin dan bagi bahan bacaan.', 's'], ['Nanti juga mereka belajar sendiri.', 'n'], ['Langsung ajak turun aksi saja. Itu sekolah terbaik.', 'l']] },
    { id: 'r3', kata: '“LBH minta data warga yang digusur. Siapa yang bisa mengerjakan?”', opsi: [['Aku bisa mendata, asal ada yang menemani ke kampungnya.', 's'], ['Coba tanya kawan yang lain dulu, Kak.', 'n'], ['Buat apa data? Yang penting kita bela mereka di jalan.', 'l']] },
    { id: 'r4', kata: '“Telepon sekretariat mungkin disadap. Bagaimana kita berkomunikasi?”', opsi: [['Pakai kode dan kurir, dan setiap orang hanya tahu yang perlu.', 's'], ['Kita bicara pelan-pelan saja.', 'n'], ['Biar saja. Kita tidak menyembunyikan apa-apa.', 'l']] },
    { id: 'r5', kata: '“Ada yang ingin jadi pahlawan sendirian di aksi. Pendapatmu?”', opsi: [['Gerakan butuh barisan yang rapi, bukan satu pahlawan.', 's'], ['Tiap orang punya gaya.', 'n'], ['Bagus. Berani itu yang kita butuhkan.', 'l']] },
    { id: 'r6', kata: '“Kas kita habis. Ada ide?”', opsi: [['Iuran anggota dan jual buletin, lalu catat semua pengeluaran.', 's'], ['Pinjam dulu ke siapa saja.', 'n'], ['Terima saja sumbangan dari orang partai itu.', 'l']] }
  ] },
  fikri: { nama: 'Bang Fikri', reaksi: { s: 'Bang Fikri tersenyum. “Semoga kita bisa menjaganya.”', n: 'Bang Fikri diam sebentar, lalu mengganti topik.', l: 'Bang Fikri menggeleng pelan. “Lalu apa bedanya kita dengan mereka?”' }, giliran: [
    { id: 'f1', kata: '“Ada kawan yang mau membawa batu ke aksi besok. Bagaimana?”', opsi: [['Kita larang. Kekuatan kita ada di kebenaran, bukan di batu.', 's'], ['Asal tidak dilempar duluan, Bang.', 'n'], ['Wajar, Bang. Aparat juga bawa senjata.', 'l']] },
    { id: 'f2', kata: '“Warga kampung belakang kekurangan beras. Apa tugas kita?”', opsi: [['Kita galang beras dan antar sendiri ke rumah-rumah.', 's'], ['Kita catat dulu siapa yang paling butuh.', 'n'], ['Itu urusan pemerintah, bukan mahasiswa.', 'l']] },
    { id: 'f3', kata: '“Kalau kita menang nanti, apa yang paling harus dijaga?”', opsi: [['Kejujuran. Jangan sampai kita jadi seperti yang kita lawan.', 's'], ['Kita lihat nanti, Bang.', 'n'], ['Kursi. Tanpa kekuasaan, semua percuma.', 'l']] },
    { id: 'f4', kata: '“Ada yang mau membalas intel yang memukul kawan kita. Kau ikut?”', opsi: [['Tidak. Kita laporkan dan umumkan, bukan membalas.', 's'], ['Aku tidak tahu harus bagaimana, Bang.', 'n'], ['Ikut. Mereka harus merasakannya juga.', 'l']] },
    { id: 'f5', kata: '“Apa yang membuatmu bertahan di gerakan ini?”', opsi: [['Yang lemah harus dibela, siapa pun mereka.', 's'], ['Kawan-kawan di sini menyenangkan.', 'n'], ['Pengalaman organisasi bagus untuk cari kerja nanti.', 'l']] },
    { id: 'f6', kata: '“Mimbar besok bentrok dengan pengajian warga. Bagaimana?”', opsi: [['Geser jadwal mimbar, dan kita bantu pengajiannya.', 's'], ['Biar jalan sendiri-sendiri saja.', 'n'], ['Mimbar lebih penting. Warga bisa mengalah.', 'l']] }
  ] },
  yudi: { nama: 'Mas Yudi', reaksi: { s: 'Mas Yudi tertawa kecil. “Kau cepat belajar.”', n: 'Mas Yudi melirik jam tangannya.', l: 'Mas Yudi membayar sotonya sendiri. “Idealis itu mahal, Dik.”' }, giliran: [
    { id: 'y1', kata: '“Pembantu Rektor ingin bertemu perwakilan mahasiswa. Mau ikut?”', opsi: [['Mau, Mas. Kita bawa tuntutan tertulis yang jelas.', 's'], ['Tergantung kawan-kawan saja.', 'n'], ['Buat apa? Mereka cuma mau meredam kita.', 'l']] },
    { id: 'y2', kata: '“Satu fraksi di DPR mau menerima delegasi kalian. Bagaimana?”', opsi: [['Bagus. Tuntutan kita jadi tercatat resmi.', 's'], ['Boleh dicoba, tapi aku ragu.', 'n'], ['DPR itu tukang stempel. Percuma.', 'l']] },
    { id: 'y3', kata: '“Aksi kalian terlalu keras. Kalau ada korban, siapa yang tanggung jawab?”', opsi: [['Mas benar. Kita perlu pemberitahuan resmi dan jalur negosiasi dengan aparat.', 's'], ['Itu risiko yang sudah kami hitung.', 'n'], ['Biar saja. Korban justru membuka mata orang.', 'l']] },
    { id: 'y4', kata: '“Pasal 28 menjamin kebebasan berkumpul. Kenapa tidak kalian pakai?”', opsi: [['Kita jadikan dasar di setiap surat pemberitahuan aksi.', 's'], ['Memang ada, Mas, tapi aku belum tahu caranya.', 'n'], ['Pasal itu cuma di atas kertas. Jalanan yang menentukan.', 'l']] },
    { id: 'y5', kata: '“Ada kenalanku di kementerian. Katanya bisa membantu kalau kalian tenang.”', opsi: [['Kita jaga hubungan itu, Mas. Pintu dialog jangan ditutup.', 's'], ['Nanti kusampaikan ke presidium.', 'n'], ['Itu suap halus, Mas. Kita tolak.', 'l']] },
    { id: 'y6', kata: '“Kalau kau jadi pejabat nanti, apa yang mau kau ubah?”', opsi: [['Aturannya, dari dalam. Itu lebih cepat daripada berteriak di luar.', 's'], ['Belum terpikir, Mas.', 'n'], ['Aku tidak mau jadi pejabat di sistem ini.', 'l']] }
  ] },
  organisasi: { nama: 'Rapat organisasi', reaksi: { s: 'Beberapa kepala mengangguk, dan rapat bergerak lagi.', n: 'Rapat berputar-putar tanpa keputusan.', l: 'Ruangan menjadi tegang. Dua orang keluar sebelum rapat selesai.' }, giliran: [
    { id: 'o1', kata: 'Dua kawan bertengkar soal siapa yang memegang toa di aksi berikutnya.', opsi: [['Usulkan giliran yang jelas, lalu tulis di notulen.', 's'], ['Diam dan tunggu mereka capek sendiri.', 'n'], ['Bilang biar kamu saja yang memegang toa.', 'l']] },
    { id: 'o2', kata: 'Notulen rapat lalu hilang, dan semua orang saling menyalahkan.', opsi: [['Susun ulang bersama dari ingatan, lalu buat dua salinan.', 's'], ['Lanjutkan rapat seperti tidak terjadi apa-apa.', 'n'], ['Tuduh orang yang terakhir memegangnya.', 'l']] },
    { id: 'o3', kata: 'Ketua rapat meminta usul tema diskusi bulan depan.', opsi: [['Usulkan tema harga sembako, karena semua orang merasakannya.', 's'], ['Ikut usul yang paling banyak didukung.', 'n'], ['Bilang diskusi itu buang waktu.', 'l']] },
    { id: 'o4', kata: 'Kas organisasi kurang untuk mencetak buletin.', opsi: [['Usulkan iuran kecil dan cetak lebih sedikit, tapi rutin.', 's'], ['Tunda buletin sampai ada uang.', 'n'], ['Pakai uang kas acara lain tanpa bilang siapa-siapa.', 'l']] },
    { id: 'o5', kata: 'Seorang anggota baru diam saja sepanjang rapat.', opsi: [['Minta pendapatnya, lalu beri dia tugas kecil.', 's'], ['Biarkan. Nanti juga bicara sendiri.', 'n'], ['Sindir dia di depan semua orang.', 'l']] },
    { id: 'o6', kata: 'Ada usul memasang spanduk di gerbang tanpa memberi tahu siapa pun.', opsi: [['Bagi tugas: siapa memasang, siapa berjaga, siapa mendokumentasikan.', 's'], ['Ikut saja apa kata mayoritas.', 'n'], ['Pasang sendiri malam ini, biar cepat.', 'l']] }
  ] },
  telepon: { nama: 'Ibu', reaksi: { s: 'Suara Ibu terdengar lebih lega.', n: 'Ibu terdiam di ujung telepon.', l: 'Ibu mulai menangis, dan koin telepon umum habis.' }, giliran: [
    { id: 'i1', kata: '“Kamu sehat, Nak? Di TV ada mahasiswa ditangkap.”', opsi: [['Sehat, Bu. Aku makan teratur dan kuliah jalan terus.', 's'], ['Ya begitulah, Bu.', 'n'], ['Itu kawanku, Bu. Aku juga bisa ditangkap kapan saja.', 'l']] },
    { id: 'i2', kata: '“Bapakmu tanya terus soal nilaimu.”', opsi: [['Bilang ke Bapak aku sedang berusaha, Bu. Nanti kukirim KHS-nya.', 's'], ['Nanti saja, Bu.', 'n'], ['Bapak cuma peduli nilai, tidak peduli negara.', 'l']] },
    { id: 'i3', kata: '“Uang kirimanmu cukup?”', opsi: [['Cukup, Bu. Aku masak sendiri supaya hemat.', 's'], ['Lumayan, Bu.', 'n'], ['Tidak pernah cukup. Pokoknya kirim lebih banyak.', 'l']] },
    { id: 'i4', kata: '“Adikmu katanya mau kuliah di Jakarta juga.”', opsi: [['Bagus, Bu. Suruh dia belajar yang rajin dulu.', 's'], ['Oh, ya?', 'n'], ['Biar dia ikut aku saja di sekretariat.', 'l']] },
    { id: 'i5', kata: '“Kapan pulang? Lebaran nanti?”', opsi: [['Kuusahakan, Bu. Nanti kukabari tanggalnya.', 's'], ['Belum tahu, Bu.', 'n'], ['Tidak pulang. Banyak urusan di sini.', 'l']] },
    { id: 'i6', kata: '“Tetangga bilang kamu ikut-ikutan demo. Benar?”', opsi: [['Aku ikut diskusi, Bu, dan aku hati-hati. Jangan khawatir.', 's'], ['Ah, tetangga memang suka bicara.', 'n'], ['Benar, Bu. Minggu depan aku di barisan paling depan.', 'l']] }
  ] },
  dika: { nama: 'Dika', reaksi: { s: 'Kamu membayangkan Dika membaca suratmu sampai habis.', n: 'Suratmu pendek. Dika mungkin kecewa.', l: 'Suratmu sudah terkirim. Kamu menyesalinya begitu kotak pos tertutup.' }, giliran: [
    { id: 'k1', kata: () => `Dika menulis: “${sapaan()}, guru sejarahku bilang mahasiswa itu pengacau. Benar?”`, opsi: [['Balas: tanyakan ke gurumu, pengacau menurut siapa? Baca dulu, baru simpulkan.', 's'], ['Balas: jangan dipikirkan, belajar saja.', 'n'], ['Balas: gurumu antek penguasa. Jangan dengarkan dia.', 'l']] },
    { id: 'k2', kata: '“Aku mau ikut demo pelajar di alun-alun minggu depan.”', opsi: [['Balas: pahami dulu tuntutannya, jangan pergi sendirian, dan jangan di barisan depan.', 's'], ['Balas: terserah kamu.', 'n'], ['Balas: ikut! Ajak kawan sekelasmu sebanyak-banyaknya.', 'l']] },
    { id: 'k3', kata: '“Nilai matematikaku jelek. Bapak marah terus.”', opsi: [['Balas: kirim soalnya, kita kerjakan bersama lewat surat.', 's'], ['Balas: nanti juga membaik.', 'n'], ['Balas: nilai tidak penting. Sekolah cuma pabrik ijazah.', 'l']] },
    { id: 'k4', kata: () => `“Kenapa ${sapaan()} jarang pulang?”`, opsi: [['Balas jujur bahwa kamu sibuk, lalu ceritakan satu hal yang kamu pelajari di Jakarta.', 's'], ['Balas: nanti kamu juga mengerti.', 'n'], ['Balas: jangan banyak tanya.', 'l']] },
    { id: 'k5', kata: '“Boleh aku pinjam buku-bukumu di lemari?”', opsi: [['Balas: boleh, mulai dari yang ringan, lalu ceritakan isinya padaku.', 's'], ['Balas: nanti saja kalau kamu sudah besar.', 'n'], ['Balas: ambil yang terlarang juga, dan sembunyikan dari Bapak.', 'l']] },
    { id: 'k6', kata: '“Kawanku bilang kakaknya hilang setelah ikut rapat mahasiswa.”', opsi: [['Balas: kamu boleh takut. Tulis padaku kalau ada yang mengganggumu.', 's'], ['Balas: itu cuma kabar burung.', 'n'], ['Balas: itu risiko orang berjuang. Jangan cengeng.', 'l']] }
  ] }
};

/* ---------- membaca: potongan disarikan, pemain merangkum dengan kata sendiri ---------- */
// potongan ditulis ulang dengan kata-kata sendiri, bukan kutipan asli; kunci = kelompok kata, rangkuman diterima kalau menyentuh 2 kelompok
const POTONGAN = {
  bumi: [
    { id: 'b1', teks: 'Nyai Ontosoroh belajar sendiri membaca, menulis, dan mengurus perusahaan. Ia lebih cakap daripada banyak orang Eropa di sekitarnya, tetapi hukum kolonial tidak pernah mengakuinya sebagai ibu yang sah.', kunci: [['belajar', 'membaca', 'pendidikan', 'ilmu', 'cakap', 'pintar'], ['perempuan', 'nyai', 'ibu'], ['hukum', 'kolonial', 'belanda', 'eropa', 'tidak diakui', 'pengakuan'], ['mandiri', 'perusahaan', 'usaha', 'martabat', 'kuat']], petunjuk: 'Siapa dia, apa yang ia kuasai, dan apa yang tidak diakui darinya?' },
    { id: 'b2', teks: 'Minke bersekolah di sekolah Belanda dan fasih bicara tentang ilmu Eropa. Tetap saja, di mata orang-orang kolonial, ia hanya seorang pribumi yang tidak akan pernah setara.', kunci: [['sekolah', 'pendidikan', 'belajar', 'ilmu', 'pintar'], ['pribumi', 'bumiputra'], ['setara', 'rendah', 'diskriminasi', 'tidak adil', 'beda', 'dianggap'], ['belanda', 'eropa', 'kolonial', 'penjajah']], petunjuk: 'Apa yang tidak berubah meski Minke berpendidikan?' },
    { id: 'b3', teks: 'Pengadilan kolonial memutus nasib Annelies menurut hukum Eropa. Ibunya sendiri, seorang pribumi, tidak punya suara apa pun atas anak yang ia besarkan.', kunci: [['pengadilan', 'hukum', 'putusan', 'hakim'], ['eropa', 'belanda', 'kolonial'], ['ibu', 'anak', 'keluarga', 'pribumi'], ['tidak adil', 'ketidakadilan', 'tak berdaya', 'tidak punya suara', 'kalah', 'dirampas']], petunjuk: 'Siapa yang memutuskan, dan siapa yang tidak didengar?' },
    { id: 'b4', teks: 'Mereka kalah di pengadilan dan tahu akan kalah sejak awal. Yang mereka pegang adalah keyakinan bahwa mereka sudah melawan dengan cara yang paling terhormat.', kunci: [['kalah', 'kekalahan'], ['lawan', 'melawan', 'perlawanan', 'berjuang'], ['hormat', 'terhormat', 'martabat', 'bermartabat'], ['tidak menyerah', 'menyerah', 'yakin', 'keyakinan']], petunjuk: 'Kalau sudah tahu akan kalah, apa yang tetap mereka banggakan?' }
  ],
  madilog: [
    { id: 'm1', teks: 'Bangsa yang ingin merdeka harus berhenti menjelaskan dunia dengan hal-hal gaib dan takhayul. Ia harus belajar berpikir dari bukti yang bisa diperiksa.', kunci: [['gaib', 'takhayul', 'mistik', 'klenik'], ['bukti', 'ilmiah', 'sains', 'rasional', 'logika', 'fakta', 'diperiksa'], ['merdeka', 'bangsa', 'kemerdekaan'], ['berpikir', 'cara pikir', 'pikiran']], petunjuk: 'Cara berpikir apa yang harus ditinggalkan, dan diganti dengan apa?' },
    { id: 'm2', teks: 'Titik tolak berpikir adalah kenyataan benda di dunia. Gagasan yang bagus pun harus diuji pada kenyataan itu, bukan sebaliknya.', kunci: [['benda', 'materi', 'materialisme', 'kenyataan', 'nyata'], ['gagasan', 'ide', 'pikiran'], ['uji', 'diuji', 'bukti', 'fakta', 'periksa']], petunjuk: 'Mana yang didahulukan: gagasan atau kenyataan?' },
    { id: 'm3', teks: 'Tidak ada yang tetap. Segala sesuatu berubah karena ada pertentangan di dalam dirinya sendiri, dan perubahan itulah yang harus dipahami.', kunci: [['berubah', 'perubahan'], ['pertentangan', 'kontradiksi', 'bertentangan', 'konflik'], ['tetap', 'abadi', 'diam'], ['dialektika', 'dalam dirinya', 'dari dalam']], petunjuk: 'Mengapa sesuatu berubah?' },
    { id: 'm4', teks: 'Kesimpulan harus ditarik secara runtut dari bukti, bukan dari kata orang yang berkuasa atau dari kebiasaan turun-temurun.', kunci: [['kesimpulan', 'menyimpulkan'], ['runtut', 'logika', 'nalar', 'akal'], ['bukti', 'fakta'], ['berkuasa', 'penguasa', 'kebiasaan', 'tradisi', 'kata orang', 'otoritas']], petunjuk: 'Dari mana kesimpulan boleh diambil, dan dari mana tidak?' }
  ],
  gie: [
    { id: 'g1', teks: 'Penulis catatan harian itu memilih jujur walau akibatnya dijauhi kawan sendiri. Baginya, lebih baik terasing daripada ikut berpura-pura.', kunci: [['jujur', 'kejujuran'], ['terasing', 'sendiri', 'dijauhi', 'kesepian', 'asing'], ['pura', 'munafik', 'kemunafikan', 'bohong'], ['pilih', 'memilih', 'prinsip', 'idealis']], petunjuk: 'Apa yang ia pilih, dan apa harganya?' },
    { id: 'g2', teks: 'Ia menulis dengan getir tentang kawan seangkatan yang dulu berdemonstrasi, lalu duduk di kursi kekuasaan dan melupakan tuntutan mereka sendiri.', kunci: [['kawan', 'teman', 'aktivis', 'demonstran'], ['kekuasaan', 'kursi', 'jabatan', 'penguasa', 'pejabat'], ['lupa', 'melupakan', 'berubah', 'mengkhianati', 'meninggalkan'], ['tuntutan', 'idealisme', 'cita', 'perjuangan']], petunjuk: 'Apa yang terjadi pada kawan-kawannya setelah berkuasa?' },
    { id: 'g3', teks: 'Ia naik gunung karena percaya orang hanya bisa mencintai negerinya kalau mengenalnya dari dekat, bukan dari slogan dan pidato.', kunci: [['gunung', 'alam', 'mendaki'], ['cinta', 'mencintai'], ['kenal', 'mengenal', 'dekat', 'langsung'], ['slogan', 'semboyan', 'pidato']], petunjuk: 'Mengapa naik gunung baginya penting?' },
    { id: 'g4', teks: 'Mahasiswa, tulisnya, harus menjadi kekuatan moral. Begitu mereka menjadi alat partai atau penguasa, mereka kehilangan alasan untuk didengar.', kunci: [['mahasiswa'], ['moral', 'nurani'], ['partai', 'penguasa', 'alat', 'dimanfaatkan', 'politik'], ['didengar', 'kehilangan', 'bebas', 'independen', 'mandiri']], petunjuk: 'Mahasiswa harus menjadi apa, dan tidak boleh menjadi apa?' }
  ],
  freire: [
    { id: 'p1', teks: 'Dalam pendidikan gaya bank, guru menabungkan pengetahuan ke kepala murid seolah-olah murid adalah wadah kosong yang cukup menerima dan menghafal.', kunci: [['bank', 'menabung', 'tabung'], ['guru', 'murid', 'siswa'], ['kosong', 'wadah', 'pasif', 'menghafal', 'menerima'], ['pendidikan', 'belajar', 'mengajar']], petunjuk: 'Bagaimana murid diperlakukan dalam pendidikan gaya bank?' },
    { id: 'p2', teks: 'Pendidikan yang membebaskan dimulai dari dialog tentang masalah nyata yang dihadapi murid, dan guru ikut belajar di dalamnya.', kunci: [['dialog', 'diskusi', 'bertanya', 'percakapan'], ['masalah', 'persoalan', 'nyata', 'kehidupan', 'sehari'], ['guru ikut belajar', 'bersama', 'setara', 'membebaskan', 'bebas']], petunjuk: 'Pendidikan yang membebaskan dimulai dari apa?' },
    { id: 'p3', teks: 'Orang yang tertindas harus lebih dulu menyadari apa yang menyebabkan penindasan atas dirinya. Tanpa kesadaran itu, perubahan hanya berganti majikan.', kunci: [['sadar', 'kesadaran', 'menyadari', 'kritis'], ['tertindas', 'penindasan', 'ditindas'], ['sebab', 'penyebab', 'mengapa', 'akar'], ['majikan', 'berganti', 'perubahan']], petunjuk: 'Apa yang harus terjadi dulu sebelum perubahan berarti?' },
    { id: 'p4', teks: 'Kadang yang tertindas diam-diam ingin menjadi seperti penindasnya. Karena itu, pembebasan juga harus membebaskan cara berpikir.', kunci: [['meniru', 'menjadi seperti', 'ingin seperti', 'seperti penindas'], ['penindas', 'tertindas'], ['bebas', 'pembebasan', 'membebaskan', 'merdeka'], ['cara berpikir', 'pikiran', 'mental', 'pola pikir']], petunjuk: 'Apa yang diam-diam diinginkan orang tertindas, dan apa akibatnya?' }
  ],
  syariati: [
    { id: 's1', teks: 'Cendekiawan sejati tidak diukur dari gelarnya, melainkan dari kesanggupannya membangunkan kesadaran masyarakat di sekitarnya.', kunci: [['cendekiawan', 'intelektual', 'sarjana', 'terpelajar'], ['gelar', 'ijazah', 'akademik'], ['membangunkan', 'menyadarkan', 'kesadaran', 'membangkitkan'], ['masyarakat', 'rakyat', 'umat', 'orang']], petunjuk: 'Ukuran cendekiawan sejati itu apa?' },
    { id: 's2', teks: 'Agama, dalam pandangan penulisnya, adalah kekuatan yang membebaskan manusia. Ia menjadi berbahaya ketika dipakai untuk membenarkan penguasa.', kunci: [['agama', 'islam', 'iman', 'keyakinan'], ['bebas', 'pembebasan', 'membebaskan'], ['penguasa', 'kekuasaan', 'membenarkan', 'pembenar', 'dipakai']], petunjuk: 'Agama bisa menjadi dua hal. Apa saja?' },
    { id: 's3', teks: 'Ilmu yang tidak pernah turun ke rakyat kecil tidak ada gunanya. Cendekiawan memikul tanggung jawab kepada mereka yang tidak sempat bersekolah.', kunci: [['ilmu', 'pengetahuan'], ['rakyat', 'orang kecil', 'miskin', 'umat', 'tidak sekolah'], ['tanggung jawab', 'kewajiban', 'tugas', 'memikul'], ['turun', 'guna', 'berguna', 'manfaat']], petunjuk: 'Kepada siapa cendekiawan bertanggung jawab?' },
    { id: 's4', teks: 'Penulis memperingatkan cendekiawan yang sibuk di menara gading. Semakin jauh mereka dari kehidupan orang banyak, semakin tidak berarti pemikiran mereka.', kunci: [['menara gading', 'jauh', 'menjauh', 'terasing'], ['cendekiawan', 'intelektual', 'pemikir'], ['orang banyak', 'rakyat', 'masyarakat', 'kehidupan'], ['tidak berarti', 'sia', 'percuma', 'berarti']], petunjuk: 'Apa bahayanya menara gading?' }
  ],
  p4: [
    { id: 'q1', teks: 'Buku penataran itu menekankan bahwa kepentingan bersama harus didahulukan di atas kepentingan pribadi maupun golongan.', kunci: [['kepentingan bersama', 'kepentingan umum', 'bersama', 'negara', 'masyarakat'], ['pribadi', 'sendiri', 'golongan'], ['didahulukan', 'mendahulukan', 'di atas', 'utama']], petunjuk: 'Kepentingan siapa yang harus didahulukan?' },
    { id: 'q2', teks: 'Keputusan diambil lewat musyawarah untuk mencapai mufakat. Pemungutan suara hanya dipakai kalau mufakat benar-benar tidak tercapai.', kunci: [['musyawarah'], ['mufakat', 'sepakat', 'kesepakatan'], ['keputusan', 'memutuskan'], ['suara', 'voting', 'pemungutan']], petunjuk: 'Bagaimana keputusan seharusnya diambil?' },
    { id: 'q3', teks: 'Pasal 28 UUD 1945 menyebut kemerdekaan berserikat, berkumpul, dan mengeluarkan pikiran, yang pengaturannya ditetapkan dengan undang-undang.', kunci: [['28', 'pasal'], ['berserikat', 'berkumpul', 'organisasi'], ['pikiran', 'pendapat', 'berpendapat', 'bicara'], ['undang', 'diatur', 'jamin', 'hak', 'kemerdekaan']], petunjuk: 'Kebebasan apa saja yang disebut pasal itu?' },
    { id: 'q4', teks: 'Pasal 33 menyusun perekonomian sebagai usaha bersama berdasar kekeluargaan. Cabang produksi yang penting bagi hajat hidup orang banyak dikuasai negara.', kunci: [['ekonomi', 'perekonomian'], ['kekeluargaan', 'usaha bersama', 'bersama'], ['negara', 'dikuasai'], ['orang banyak', 'rakyat', 'hajat hidup', 'kemakmuran']], petunjuk: 'Perekonomian disusun berdasar apa, dan siapa yang menguasai cabang penting?' }
  ]
};
const normal = t => ' ' + String(t).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
function nilaiRangkuman(teks, p) {
  const t = normal(teks), kata = t.trim().split(' ').filter(Boolean);
  if (kata.length < 5) return 'Terlalu pendek. Tulis setidaknya satu kalimat utuh.';
  const asal = normal(p.teks);
  for (let i = 0; i + 6 <= kata.length; i++) if (asal.includes(' ' + kata.slice(i, i + 6).join(' ') + ' ')) return 'Itu menyalin, bukan merangkum. Tulis dengan kata-katamu sendiri.';
  return p.kunci.filter(g => g.some(k => t.includes(k))).length >= 2 ? null : 'Rangkumanmu belum menangkap intinya.';
}

/* ---------- membuat dan menilai satu mini game ---------- */
function buatMain(i, id, coba) {
  const jenis = jenisMain(id), g = { i, id, jenis, coba, hasil: null };
  if (jenis === 'kuis') g.soal = kuisBaru();
  else if (jenis === 'les') g.soal = buatBaru(id === 'dapur' ? 'dapur' : 'les', id === 'dapur' ? DAPUR_BUAT : LES_BUAT);
  else if (jenis === 'baca') { g.buku = id === 'baca' ? bukuDibaca() : id.slice(5); g.potongan = ambilBaru('baca_' + g.buku, POTONGAN[g.buku]); }
  else {
    const O = OBROLAN[id];
    const a = ambilBaru('obrolan_' + id, O.giliran); let b = ambilBaru('obrolan_' + id, O.giliran);
    while (b.id === a.id) b = pick(O.giliran);
    g.giliran = [a, b].map(x => ({ kata: val(x.kata), opsi: acak(x.opsi) }));
    g.k = 0; g.jejak = [];
  }
  return g;
}
function jawabMain(g, v) {
  if (g.jenis === 'kuis') { const ok = +v === g.soal.benar; g.hasil = { ok, teks: ok ? 'Jawabanmu benar. Dosen mengangguk dan mencatat namamu.' : `Salah. Jawaban yang benar: ${g.soal.opsi[g.soal.benar]}.` }; return; }
  if (g.jenis === 'les') { const ok = bacaAngka(v) === g.soal.a; g.hasil = { ok, teks: ok ? 'Benar. Muridmu menyalin caranya dengan rapi.' : `Belum tepat. Jawabannya ${g.soal.a.toLocaleString('id-ID')}.` }; return; }
  if (g.jenis === 'baca') { const salah = nilaiRangkuman(v, g.potongan); g.hasil = { ok: !salah, teks: salah ? `Ditolak. ${salah} Petunjuk: ${g.potongan.petunjuk}` : 'Diterima. Kak Ratna mencentang rangkumanmu dengan pulpen merah.' }; return; }
  const G = g.giliran[g.k], o = G.opsi[+v]; if (!o) return;
  const O = OBROLAN[g.id], arah = o[1];
  // obrolan kos ikut menggeser afeksi tersembunyi lawan bicara
  const lawan = g.id === 'telepon' ? 'ibu' : g.id.replace('kader_', '');
  if (lawan in SENIOR || lawan in KADER || lawan === 'dika' || lawan === 'ibu') ubahHati(lawan, ARAH[arah] / 2);
  g.jejak.push({ kata: G.kata, jawab: o[0], arah, reaksi: O.reaksi[arah] });
  if (arah === 'l') { g.hasil = { ok: false, teks: `${O.nama} tidak sepandangan denganmu. Obrolan berhenti di situ.` }; return; }
  g.k++;
  if (g.k < g.giliran.length) return;
  g.hasil = g.jejak.some(x => x.arah === 's') ? { ok: true, teks: `Obrolan dengan ${O.nama} berjalan ke arah yang sama.` } : { ok: false, teks: 'Obrolanmu mengambang dan tidak ke mana-mana.' };
}
const bisaUlang = g => g.i < 2 && g.coba <= ULANG_MAKS;
function panelMain(m) {
  const g = m.mg, pr = PRIOR[Math.floor(g.i / 2)], O = OBROLAN[g.id];
  let h = g.hari ? `<div class="ask mg" tabindex="-1"><p class="label">${SLOT[g.id].t}</p>` : pr ? `<div class="ask mg" tabindex="-1"><p class="label">${pr.t} · ${SLOT[g.id].t} · percobaan ${g.coba}${g.i < 2 ? ` dari ${ULANG_MAKS + 1}` : ''}${m.ulang ? ' · waktumu untuk kegiatan lain makin sempit' : ''}</p>` : `<div class="ask mg" tabindex="-1"><p class="label">${O.nama} panik. Tenangkan dengan cara yang ia butuhkan.</p>`;
  if (g.jenis === 'obrolan') h += g.jejak.map(x => `<div class="kb"><b>${O.nama}</b><p>${x.kata}</p><p>Kamu: “${x.jawab}”</p><p class="fine">${x.reaksi}</p></div>`).join('');
  if (g.hasil) {
    h += `<div class="obs"><p class="${g.hasil.ok ? 'good' : 'bad'}">${g.hasil.teks}</p></div>`;
    if (!g.hasil.ok && bisaUlang(g)) h += `<div class="row"><button type="button" class="btn" data-a="mgulang">Coba lagi (waktu untuk kegiatan lain terpotong)</button><button type="button" class="btn alt" data-a="mglanjut">Terima gagal</button></div>`;
    else h += `<button type="button" class="btn" data-a="mglanjut">Lanjut</button>`;
    return h + '</div>';
  }
  const pilihan = list => `<ol class="choices">${list.map((t, k) => `<li><button type="button" class="choice" data-a="mg" data-v="${k}"><span class="key" aria-hidden="true">${'ABCD'[k]}</span><span>${t}</span></button></li>`).join('')}</ol>`;
  if (g.jenis === 'kuis') h += `<p>${g.soal.q}</p>` + pilihan(g.soal.opsi);
  else if (g.jenis === 'les') h += `<p>${g.soal.q}</p><form id="mg-form" class="form"><input id="mg-isi" inputmode="numeric" autocomplete="off" aria-label="Jawabanmu"><button type="submit" class="btn">Jawab</button></form>`;
  else if (g.jenis === 'baca') h += `<blockquote class="potongan">${g.potongan.teks}</blockquote><p class="fine">Disarikan dari fotokopian ${BUKU[g.buku].judul}, bukan kutipan asli.</p><form id="mg-form" class="form"><label class="label" for="mg-isi">Apa yang kamu tangkap? Tulis dengan kata-katamu sendiri.</label><textarea id="mg-isi" rows="3"></textarea><button type="submit" class="btn">Serahkan rangkuman</button></form>`;
  else { const G = g.giliran[g.k]; h += `<div class="kb"><b>${O.nama}</b><p>${G.kata}</p></div>` + pilihan(G.opsi.map(o => o[0])); }
  return h + '</div>';
}
function aksiBotMain(g) {
  if (g.hasil) return bisaUlang(g) && !g.hasil.ok && Math.random() < 0.5 ? [{ a: 'mgulang' }] : [{ a: 'mglanjut' }];
  if (g.jenis === 'kuis') return g.soal.opsi.map((_, v) => ({ a: 'mg', v }));
  if (g.jenis === 'les') return [{ a: 'mg', v: String(g.soal.a) }, { a: 'mg', v: '0' }];
  if (g.jenis === 'baca') return [{ a: 'mg', v: g.potongan.kunci.map(k => k[0]).join(' ') + ' itulah inti yang aku tangkap' }, { a: 'mg', v: 'aku tidak tahu isinya apa' }];
  return g.giliran[g.k].opsi.map((_, v) => ({ a: 'mg', v }));
}
// hasil slot yang berhasil dikalikan bobot prioritas; hanya perubahan yang menguntungkan yang dikalikan, biayanya tetap
function skalakan(b, k) {
  if (k === 1) return;
  const fx = {};
  for (const key of TRACK) {
    if (key === 'utang') continue;
    const d = Math.round((get(key) - b[key]) * 100) / 100;
    if (!d || (BAD_UP.includes(key) ? d > 0 : d < 0)) continue;
    const t = d * k, bulat = key === 'ipk' ? Math.round(t * 100 + 1e-6) / 100 : key === 'tunai' ? Math.round(t / 500) * 500 : Math.floor(t) + (Math.random() < t - Math.floor(t) ? 1 : 0);
    if (bulat !== d) fx[key === 'tunai' ? 'uang' : key] = Math.round((bulat - d) * 100) / 100;
  }
  apply(fx);
}

/* ---------- merangkai kalimat orasi dan negosiasi, dengan batas waktu ---------- */
const KATA = {
  orasi: [
    { id: 'o1', k: 'Turunkan harga sembako sekarang juga' }, { id: 'o2', k: 'Kami datang tanpa batu dan tanpa senjata' },
    { id: 'o3', k: 'Kampus ini milik rakyat bukan milik penguasa' }, { id: 'o4', k: 'Cabut undang-undang politik yang membungkam kami' },
    { id: 'o5', k: 'Hari ini kami bicara untuk ibu-ibu di pasar' }, { id: 'o6', k: 'Jangan takut karena barisan ini milik kita' }
  ],
  nego: [
    { id: 'n1', k: 'Beri kami satu jam untuk membacakan tuntutan' }, { id: 'n2', k: 'Kami akan duduk tertib dan tidak maju' },
    { id: 'n3', k: 'Izinkan lima wakil kami menyampaikan surat' }, { id: 'n4', k: 'Tarik pasukan dua puluh meter dan kami jaga barisan' },
    { id: 'n5', k: 'Kami bubar pukul lima kalau tuntutan diterima' }
  ]
};
// Catatan Seorang Demonstran membuatmu lebih tenang bicara di depan orang: waktunya lebih panjang
function buatKata(jenis, opsi) {
  const s = ambilBaru('kata_' + jenis, KATA[jenis]), kata = s.k.split(' ');
  let urutan = acak(kata);
  while (urutan.join(' ') === s.k) urutan = acak(kata);
  const ms = (8 + kata.length * 2 + 2 * paham('gie') + (saudara('dimas') ? 4 : 0)) * 1000 * kaliWaktu(), id = Math.random().toString(36).slice(2);
  if (!BOT && isFinite(ms) && typeof window !== 'undefined') setTimeout(() => act('kataHabis', id), ms + 50);
  return { id, jenis, kata: s.k, urutan, pilih: [], batas: Date.now() + ms, ms, opsi };
}
function kataHTML(k) {
  const sisa = Math.max(0, k.batas - Date.now());
  return `<div class="ask mg" tabindex="-1"><p class="label">${k.jenis === 'nego' ? 'Rangkai kalimat untuk komandan' : 'Rangkai orasimu'} sebelum waktunya habis</p>${isFinite(k.ms) ? `<div class="waktu-bar"><i style="--mulai:${Math.round(sisa / k.ms * 100)}%;animation-duration:${sisa}ms"></i></div>` : ''}<p class="kalimat">${k.pilih.map(i => k.urutan[i]).join(' ') || '…'}</p><div class="acts">${k.urutan.map((w, i) => k.pilih.includes(i) ? '' : `<button type="button" class="chip" data-a="kata" data-v="${i}">${w}</button>`).join('')}</div><button type="button" class="btn alt" data-a="kataHapus"${k.pilih.length ? '' : ' disabled'}>Hapus kata terakhir</button></div>`;
}
const marahHTML = v => `<div class="marah"><span class="label">Kemarahan aparat</span><div class="meter"><i style="width:${v}%"></i></div></div>`;


/* ---------- obrolan dengan kader: setiap kader menghargai hal yang berbeda ---------- */
Object.assign(OBROLAN, {
  kader_laras: { nama: 'Laras', reaksi: { s: 'Laras tertawa dan mencatat kalimatmu di buku kecilnya.', n: 'Laras menunggu jawaban yang lebih jujur, lalu menyerah.', l: 'Laras menutup bukunya. “Kamu bicara seperti siaran pers.”' }, giliran: [
    { id: 'la1', kata: '“Redaksi majalah kampus minta aku melunakkan tulisanku. Bagaimana menurutmu?”', opsi: [['Jangan. Tulis apa adanya, dan cantumkan sumbermu.', 's'], ['Ikuti saja dulu, nanti kita lihat.', 'n'], ['Lunakkan. Yang penting kamu aman.', 'l']] },
    { id: 'la2', kata: '“Bapakku dulu wartawan. Dipecat tahun 1994 waktu tiga majalah dibredel. Kamu tahu rasanya?”', opsi: [['Tidak tahu, tapi aku mau mendengar ceritanya.', 's'], ['Pasti berat.', 'n'], ['Sudahlah, itu masa lalu.', 'l']] },
    { id: 'la3', kata: '“Kalau kamu ditanya wartawan, apa yang kamu jawab?”', opsi: [['Yang benar, walau tidak enak didengar.', 's'], ['Tergantung pertanyaannya.', 'n'], ['Jawaban yang membuat kita terlihat baik.', 'l']] },
    { id: 'la4', kata: '“Ada kawan yang menyebarkan kabar belum jelas. Aku harus menegurnya?”', opsi: [['Tegur. Kabar yang salah merusak kepercayaan orang.', 's'], ['Biar saja dulu.', 'n'], ['Tidak usah, yang penting orang marah.', 'l']] },
    { id: 'la5', kata: '“Aku takut namaku tercatat di mana-mana. Kamu takut juga?”', opsi: [['Takut. Tapi aku lebih takut kalau diam.', 's'], ['Kadang-kadang.', 'n'], ['Aku tidak pernah takut.', 'l']] },
    { id: 'la6', kata: '“Menurutmu kenapa koran pemerintah tidak menulis soal penggusuran Kampung Rawa?”', opsi: [['Karena takut. Makanya kita yang harus menulisnya.', 's'], ['Mungkin tidak tahu.', 'n'], ['Karena memang tidak penting.', 'l']] }
  ] },
  kader_bimo: { nama: 'Bimo', reaksi: { s: 'Bimo mengangguk pelan, lalu menulis daftar di punggung tangannya.', n: 'Bimo mengerutkan dahi. Ia masih menunggu rencananya.', l: 'Bimo memeluk kotak P3K-nya. “Kalau ada yang mati, siapa yang menanggung?”' }, giliran: [
    { id: 'bi1', kata: '“Aksi besok lewat jalan raya. Rumah sakit terdekat di mana?”', opsi: [['Aku sudah tandai dua, dan ada jalur evakuasi lewat gang.', 's'], ['Nanti kita cari di jalan.', 'n'], ['Tidak usah dipikirkan, kita tidak akan bentrok.', 'l']] },
    { id: 'bi2', kata: '“Ayahku mantri di desa. Ia sering bilang, korban terbanyak jatuh karena orang panik. Kamu setuju?”', opsi: [['Setuju. Makanya tiap barisan harus tahu kapan mundur.', 's'], ['Mungkin juga.', 'n'], ['Kalau takut panik, jangan ikut aksi.', 'l']] },
    { id: 'bi3', kata: '“Ada yang mau maju tanpa odol dan kain basah. Aku larang?”', opsi: [['Larang. Tidak ada yang maju tanpa perlengkapan.', 's'], ['Terserah mereka.', 'n'], ['Biar saja, gas air mata tidak seberapa.', 'l']] },
    { id: 'bi4', kata: '“Kalau barisan diserbu, siapa yang menjaga pos medis?”', opsi: [['Kita tetapkan dua orang sekarang, dan mereka tidak boleh ikut maju.', 's'], ['Siapa saja yang ada nanti.', 'n'], ['Pos medis itu cuma buat yang lemah.', 'l']] },
    { id: 'bi5', kata: '“Aku belum pernah melihat orang tertembak. Kalau itu terjadi, aku harus bagaimana?”', opsi: [['Tekan lukanya, tetap di tempat aman, dan aku yang memanggil bantuan.', 's'], ['Aku juga tidak tahu.', 'n'], ['Tidak akan terjadi. Jangan berlebihan.', 'l']] },
    { id: 'bi6', kata: '“Kamu sudah makan hari ini?”', opsi: [['Belum. Ayo makan dulu, baru rapat.', 's'], ['Nanti saja.', 'n'], ['Makan itu urusan nanti, gerakan dulu.', 'l']] }
  ] },
  kader_wahyu: { nama: 'Wahyu', reaksi: { s: 'Wahyu menyeringai dan mengangkat obengnya.', n: 'Wahyu kembali membongkar radionya tanpa bicara.', l: 'Wahyu mendengus. “Ngomong terus. Kapan kerjanya?”' }, giliran: [
    { id: 'wa1', kata: '“Mesin stensil macet lagi. Rapat soal ideologi bisa ditunda dulu, kan?”', opsi: [['Bisa. Ayo kita betulkan mesinnya sekarang.', 's'], ['Kita lihat nanti.', 'n'], ['Ideologi lebih penting dari mesin.', 'l']] },
    { id: 'wa2', kata: '“Bapakku sopir angkot. Ia tidak pernah baca buku-buku itu, tapi ia tahu harga solar naik. Itu cukup?”', opsi: [['Cukup. Yang ia rasakan itu yang harus kita perjuangkan.', 's'], ['Mungkin.', 'n'], ['Ia harus belajar teori dulu.', 'l']] },
    { id: 'wa3', kata: '“Utang kuliahku numpuk. Kalau aku kerja sambilan, aku jarang rapat. Masalah?”', opsi: [['Tidak. Bantu sebisamu, nanti kucarikan tugas yang cocok jadwalmu.', 's'], ['Ya, sedikit.', 'n'], ['Masalah. Gerakan butuh orang yang total.', 'l']] },
    { id: 'wa4', kata: '“Butuh toa untuk aksi. Aku bisa rakit dari aki bekas. Mau?”', opsi: [['Mau. Kita kerjakan malam ini.', 's'], ['Nanti saja kalau perlu.', 'n'], ['Beli saja yang bagus, biar tidak malu.', 'l']] },
    { id: 'wa5', kata: '“Kenapa senior suka bicara panjang tapi tidak ada yang mau mengangkat meja?”', opsi: [['Aku yang angkat. Ayo.', 's'], ['Ya, begitulah.', 'n'], ['Itu memang bukan tugas senior.', 'l']] },
    { id: 'wa6', kata: '“Kalau razia datang, mobil boksku bisa dipakai. Kau percaya aku?”', opsi: [['Percaya. Kunci mobilnya kamu yang pegang.', 's'], ['Kita lihat situasinya.', 'n'], ['Lebih aman naik taksi.', 'l']] }
  ] },
  kader_mei: { nama: 'Mei', reaksi: { s: 'Mei menggarisbawahi sesuatu di buku catatannya.', n: 'Mei berhenti menulis, menunggu.', l: 'Mei menutup bukunya pelan. Ia tidak membukanya lagi malam itu.' }, giliran: [
    { id: 'me1', kata: '“Notulen rapat kemarin perlu kusimpan di mana? Kalau disita, semua nama ketahuan.”', opsi: [['Simpan dua salinan, dan nama-namanya pakai kode.', 's'], ['Di mana saja.', 'n'], ['Tidak usah dicatat. Bahaya.', 'l']] },
    { id: 'me2', kata: '“Papa selalu bilang, orang seperti kita lebih aman kalau diam. Kamu pernah disuruh diam?”', opsi: [['Pernah. Tapi aku ingin kita mengingat, bukan diam.', 's'], ['Semua orang pernah.', 'n'], ['Papamu ada benarnya. Diam saja.', 'l']] },
    { id: 'me3', kata: '“Aku mencatat semua yang hilang dari sekretariat. Berguna, nggak?”', opsi: [['Berguna. Suatu hari catatan itu jadi bukti.', 's'], ['Mungkin.', 'n'], ['Buang-buang waktu.', 'l']] },
    { id: 'me4', kata: '“Kalau kerusuhan terjadi, tokonya Papa di Glodok yang pertama kena. Kamu mengerti?”', opsi: [['Mengerti. Kita siapkan jalan untuk keluargamu dari sekarang.', 's'], ['Mudah-mudahan tidak.', 'n'], ['Itu urusan keluargamu sendiri.', 'l']] },
    { id: 'me5', kata: '“Aku lupa nama kawan yang dibawa aparat bulan lalu. Itu menakutkan, ya?”', opsi: [['Menakutkan. Ayo kita tulis lagi namanya sekarang.', 's'], ['Wajar, banyak yang terjadi.', 'n'], ['Lupakan saja, lebih tenang.', 'l']] },
    { id: 'me6', kata: '“Kamu sendiri mencatat apa yang terjadi padamu?”', opsi: [['Mulai sekarang, ya. Ajari aku caramu.', 's'], ['Kadang.', 'n'], ['Tidak perlu. Aku ingat semuanya.', 'l']] }
  ] },
  kader_asep: { nama: 'Asep', reaksi: { s: 'Asep menepuk bahumu. “Nah, ini baru kawan.”', n: 'Asep menyulut rokok dan memandang jalan.', l: 'Asep tertawa pendek. “Anak kampus memang begitu.”' }, giliran: [
    { id: 'as1', kata: '“Kakakku di-PHK pabrik sepatu. Kamu mau ikut ke rapat buruh malam ini?”', opsi: [['Mau. Aku datang untuk mendengar, bukan berpidato.', 's'], ['Kalau sempat.', 'n'], ['Aku mau berorasi di sana. Mereka butuh arahan.', 'l']] },
    { id: 'as2', kata: '“Buruh tidak suka mahasiswa yang datang sekali lalu hilang. Kamu bisa janji?”', opsi: [['Tidak bisa janji banyak. Tapi aku datang tiap minggu sebisaku.', 's'], ['Kuusahakan.', 'n'], ['Janji. Aku akan membebaskan mereka semua.', 'l']] },
    { id: 'as3', kata: '“Ada kawan yang bilang buruh tidak mengerti politik. Pendapatmu?”', opsi: [['Mereka mengerti upah dan pemecatan. Itu politik juga.', 's'], ['Sebagian mungkin.', 'n'], ['Memang mereka harus kita didik dulu.', 'l']] },
    { id: 'as4', kata: '“Pemogokan minggu depan butuh dapur umum. Kamu bisa bantu?”', opsi: [['Bisa. Aku bawa beras dan ikut memasak.', 's'], ['Nanti kutanya kawan lain.', 'n'], ['Itu bukan tugas mahasiswa.', 'l']] },
    { id: 'as5', kata: '“Kamu tahu harga kaset dangdut di Pasar Senen? Aku suka Rhoma Irama.”', opsi: [['Tahu. Nanti kita beli bareng, sekalian makan.', 's'], ['Tidak terlalu tahu.', 'n'], ['Musik itu kampungan.', 'l']] },
    { id: 'as6', kata: '“Kalau gerakan ini menang, apa yang berubah buat kakakku?”', opsi: [['Mungkin tidak langsung. Tapi serikatnya bisa berdiri tanpa ditangkap.', 's'], ['Entahlah.', 'n'], ['Semuanya. Hidupnya pasti langsung membaik.', 'l']] }
  ] },
  kader_dimas: { nama: 'Dimas', reaksi: { s: 'Mata Dimas berbinar. Ia mengulang kalimatmu dengan suara keras.', n: 'Dimas mengangguk, tapi pikirannya sudah ke tempat lain.', l: 'Dimas meremas kertas puisinya.' }, giliran: [
    { id: 'di1', kata: '“Puisiku dilarang dibacakan di SMA dulu. Menurutmu kata-kata bisa berbahaya?”', opsi: [['Bisa. Makanya penguasa takut pada puisi.', 's'], ['Mungkin.', 'n'], ['Kata-kata tidak mengubah apa-apa.', 'l']] },
    { id: 'di2', kata: '“Besok aku orasi di depan seribu orang. Aku gemetar. Kamu bagaimana?”', opsi: [['Gemetar itu tanda kamu peduli. Naik saja, aku di barisan depan.', 's'], ['Tarik napas saja.', 'n'], ['Kalau gemetar, biar orang lain saja.', 'l']] },
    { id: 'di3', kata: '“Baris ini terlalu keras: ‘Kami tidak takut pada sepatu lars.’ Kuhapus?”', opsi: [['Jangan. Itu yang membuat orang berani.', 's'], ['Terserah kamu.', 'n'], ['Hapus. Nanti kita dicap provokator.', 'l']] },
    { id: 'di4', kata: '“Kalau aku tertangkap, apa yang kamu bacakan untukku?”', opsi: [['Puisimu sendiri, keras-keras, di depan kampus.', 's'], ['Jangan bicara begitu.', 'n'], ['Tidak ada. Kita harus diam supaya aman.', 'l']] },
    { id: 'di5', kata: '“Kamu pernah menulis sesuatu yang jujur sekali?”', opsi: [['Pernah, surat untuk adikku. Aku mau belajar menulis lagi.', 's'], ['Belum, sepertinya.', 'n'], ['Menulis itu buang waktu.', 'l']] },
    { id: 'di6', kata: '“Panggung atau jalanan, mana yang lebih jujur?”', opsi: [['Keduanya, asal yang di panggung mau turun ke jalan.', 's'], ['Entahlah.', 'n'], ['Jalanan. Panggung itu cuma pamer.', 'l']] }
  ] },
  kader_tigor: { nama: 'Tigor', reaksi: { s: 'Tigor membuka KUHAP-nya dan menunjuk satu pasal dengan puas.', n: 'Tigor mendesah. “Pelajari dulu aturannya.”', l: 'Tigor menggeleng keras. “Itu cara paling cepat dipenjara.”' }, giliran: [
    { id: 'ti1', kata: '“Kalau kamu ditangkap tanpa surat, apa yang kamu minta?”', opsi: [['Surat perintah penangkapan dan hak didampingi pengacara.', 's'], ['Minta dilepas.', 'n'], ['Melawan saja.', 'l']] },
    { id: 'ti2', kata: '“Ayahku hakim. Ia mengalah pada telepon dari atas. Menurutmu ia salah?”', opsi: [['Salah. Tapi aturan yang membiarkan telepon itu juga salah.', 's'], ['Mungkin ia terpaksa.', 'n'], ['Semua hakim memang begitu.', 'l']] },
    { id: 'ti3', kata: '“Kita perlu surat pemberitahuan aksi ke polisi. Repot, ya?”', opsi: [['Repot, tapi itu membuat mereka susah menyalahkan kita.', 's'], ['Ya, sedikit.', 'n'], ['Tidak perlu. Kita tidak butuh izin mereka.', 'l']] },
    { id: 'ti4', kata: '“Ada kawan ditahan tiga hari tanpa kabar. Langkah pertama apa?”', opsi: [['Catat jamnya, datangi LBH, lalu tanya status penahanannya.', 's'], ['Tunggu kabar.', 'n'], ['Datangi kantor polisi dan teriak-teriak.', 'l']] },
    { id: 'ti5', kata: '“Pasal subversi itu bisa dipakai untuk siapa saja. Kamu hafal isinya?”', opsi: [['Belum. Ajari aku, supaya aku tahu yang dituduhkan.', 's'], ['Sedikit.', 'n'], ['Tidak perlu. Hukum mereka tidak berlaku buat kita.', 'l']] },
    { id: 'ti6', kata: '“Kalau semua ini selesai, kamu mau jadi apa?”', opsi: [['Apa saja, asal tidak ikut menelepon hakim.', 's'], ['Belum tahu.', 'n'], ['Pejabat. Biar kita yang memegang telepon itu.', 'l']] }
  ] }
});

/* ---------- menenangkan kawan yang panik saat buron: nadanya harus cocok dengan orangnya ---------- */
const TENANG_DATA = {
  laras: ['Laras', [['“Mereka tahu alamat kantorku. Aku harus berhenti menulis?”', 'Jangan berhenti. Pakai nama samaran, dan kirim lewat kurir.', 'Mungkin istirahat dulu.', 'Iya, berhenti saja. Tidak ada gunanya.'], ['“Kamu jujur padaku: kita akan selamat?”', 'Aku tidak tahu. Tapi aku tidak akan berbohong padamu.', 'Pasti, tenang saja.', 'Tidak. Kita semua akan ditangkap.'], ['“Aku mau pulang ke rumah ibuku.”', 'Pulang boleh, asal kamu kabari aku lewat kode kita.', 'Terserah kamu.', 'Kalau pulang, kamu pengecut.'], ['“Berita kita tidak ada yang memuat. Untuk apa?”', 'Kita catat sekarang. Suatu hari ada yang memuatnya.', 'Entahlah.', 'Memang percuma.']]],
  bimo: ['Bimo', [['“Kalau mereka datang malam ini, kita lari ke mana?”', 'Lewat pintu belakang ke rumah Pak RT. Aku sudah bicara dengannya.', 'Nanti kita pikirkan.', 'Tidak usah lari. Hadapi saja.'], ['“Aku tidak bisa tidur. Tanganku gemetar.”', 'Minum dulu. Besok pagi kita susun jadwal jaga bergantian.', 'Coba tidur saja.', 'Kamu terlalu lemah.'], ['“Kalau ada yang terluka, obatnya habis.”', 'Aku sudah titip kasa dan antiseptik ke kurir minggu ini.', 'Semoga tidak ada yang luka.', 'Pakai seadanya.'], ['“Berapa lama lagi kita sembunyi?”', 'Dua minggu. Setelah itu kita pindah lewat rute yang sudah kita tentukan.', 'Tidak tahu.', 'Selamanya, mungkin.']]],
  wahyu: ['Wahyu', [['“Aku cuma duduk di sini. Rasanya tidak berguna.”', 'Ada pekerjaan: cari jalur keluar kota dan siapkan mobilmu.', 'Duduk dulu saja.', 'Memang tidak ada yang bisa dikerjakan.'], ['“Bapakku ditanya-tanyai orang. Aku harus pulang.”', 'Kita kirim kabar ke Bapakmu lewat sopir kenalan. Kamu tetap di sini.', 'Terserah kamu.', 'Pulang saja, biar kamu tertangkap.'], ['“Uangku habis.”', 'Ini separuh uangku. Besok kita cari kerja angkut di pasar.', 'Sabar dulu.', 'Itu urusanmu sendiri.'], ['“Kenapa kita diam terus? Aku mau bergerak.”', 'Malam ini kita cetak stensil. Pelan, tapi bergerak.', 'Tunggu perintah saja.', 'Bergerak sekarang juga, apa pun risikonya.']]],
  mei: ['Mei', [['“Catatanku di sekretariat. Kalau disita, semua nama ketahuan.”', 'Kita tulis ulang dengan kode, dan aku simpan salinannya.', 'Mudah-mudahan tidak disita.', 'Bakar saja semuanya.'], ['“Papa menelepon. Ia bilang aku harus diam.”', 'Kamu boleh diam di luar. Di sini kita tetap mencatat bersama.', 'Dengar saja papamu.', 'Papamu penakut.'], ['“Aku takut lupa semua yang terjadi.”', 'Tulis tiap malam. Aku juga akan menulis.', 'Tidak apa-apa lupa.', 'Lebih baik memang lupa.'], ['“Mereka bilang orang sepertiku yang nanti disalahkan.”', 'Kalau itu terjadi, catatanmu yang membuktikan siapa yang bersalah.', 'Tidak akan.', 'Mungkin memang begitu.']]],
  asep: ['Asep', [['“Kakakku ditangkap di pabrik. Kau bilang semua akan baik-baik saja?”', 'Tidak. Tapi aku akan ikut mengurusnya ke LBH besok.', 'Semoga baik-baik saja.', 'Pasti, gerakan kita menang.'], ['“Kalian mahasiswa bisa pulang ke orang tua. Kami tidak.”', 'Benar. Makanya aku tidak akan meninggalkan kalian.', 'Kita sama-sama susah.', 'Jangan iri pada kami.'], ['“Buruh mulai takut ikut rapat.”', 'Kita pindah rapat ke rumah-rumah, kecil-kecil, dan aku datang sendiri.', 'Biarkan dulu.', 'Paksa mereka datang.'], ['“Untuk apa semua ini kalau besok kami di-PHK lagi?”', 'Supaya kalau di-PHK, kalian bisa melawan tanpa dipenjara.', 'Entahlah.', 'Nanti juga kalian dapat pekerjaan.']]],
  dimas: ['Dimas', [['“Aku tidak bisa menulis lagi. Kata-kataku hilang.”', 'Kata-katamu masih ada. Kemarin orang-orang di pasar mengulang sajakmu.', 'Coba istirahat.', 'Mungkin memang sudah habis.'], ['“Aku takut naik panggung lagi.”', 'Kamu tidak sendirian di panggung itu. Kami semua berdiri di belakangmu.', 'Tidak usah naik dulu.', 'Kalau takut, berhenti saja.'], ['“Kalau aku ditangkap, siapa yang ingat namaku?”', 'Aku. Dan aku akan membacakan puisimu keras-keras.', 'Jangan berpikir begitu.', 'Tidak ada yang ingat siapa-siapa.'], ['“Apa gunanya sajak melawan senapan?”', 'Senapan membuat orang diam. Sajakmu membuat mereka bicara lagi.', 'Aku tidak tahu.', 'Tidak ada gunanya.']]],
  tigor: ['Tigor', [['“Mereka menahan orang tanpa surat. Hukum sudah mati.”', 'Belum. Kita catat setiap pelanggarannya, dan suatu hari itu dipakai di pengadilan.', 'Mungkin memang mati.', 'Lupakan hukum, kita lawan saja.'], ['“Aku harus menyerahkan diri supaya prosesnya resmi?”', 'Belum saatnya. Kalau perlu, kita datang bersama pengacara LBH.', 'Terserah kamu.', 'Ya, serahkan diri sekarang.'], ['“Ayahku menyuruhku berhenti.”', 'Kamu bukan ayahmu. Kamu yang memilih tidak mengalah.', 'Dengar saja ayahmu.', 'Ayahmu benar.'], ['“Berkas kasus kita berantakan.”', 'Kita susun lagi malam ini, satu per satu, berdua.', 'Nanti saja.', 'Berkas tidak berguna.']]],
  ratna: ['Kak Ratna', [['“Jaringan kita terputus di tiga kota. Kita mulai dari mana?”', 'Dari kota yang kurirnya masih bisa dipercaya. Kita susun ulang daftar kontaknya.', 'Kita tunggu kabar.', 'Kita bubar saja dulu.'], ['“Dua pengacara LBH mulai ditekan. Kita masih bisa minta bantuan?”', 'Bisa, tapi kita kirim berkas yang lengkap supaya kerja mereka singkat.', 'Mungkin tidak.', 'Kita tidak butuh mereka.'], ['“Aku lelah memegang semua sendirian.”', 'Bagi tugasnya. Aku ambil urusan kurir dan uang.', 'Istirahat saja, Kak.', 'Kakak memang harus kuat.'], ['“Kalau aku tertangkap, siapa yang memegang daftar?”', 'Kita pecah daftarnya. Tidak ada satu orang pun yang memegang semuanya.', 'Kakak tidak akan tertangkap.', 'Biar aku yang pegang semua.']]],
  fikri: ['Bang Fikri', [['“Ada kawan yang ingin membalas dengan kekerasan. Aku harus bagaimana?”', 'Ingatkan mereka: kalau kita memukul, kita kehilangan alasan untuk didengar.', 'Biarkan mereka memilih.', 'Mungkin memang perlu dibalas.'], ['“Aku mulai ragu doa-doa kita didengar.”', 'Mungkin jawabannya lewat orang-orang yang kita bantu minggu ini.', 'Aku juga ragu, Bang.', 'Memang tidak didengar.'], ['“Warga takut menampung kita.”', 'Kita tidak memaksa. Kita bantu mereka dulu, seperti dulu di dapur umum.', 'Cari warga lain saja.', 'Paksa saja, mereka berutang pada kita.'], ['“Apa yang harus kujaga kalau semuanya runtuh?”', 'Kejujuran kita, Bang. Itu yang Abang ajarkan.', 'Diri sendiri saja.', 'Tidak ada lagi yang perlu dijaga.']]],
  yudi: ['Mas Yudi', [['“Kenalanku di kementerian tidak mengangkat telepon lagi. Kita habis?”', 'Belum. Pintu yang lain masih ada: fraksi, rektor, wartawan.', 'Mungkin habis, Mas.', 'Memang dari awal percuma.'], ['“Aku bisa diselamatkan kalau berhenti sekarang.”', 'Mas boleh mundur ke belakang, asal pintu dialog tetap dijaga.', 'Terserah Mas.', 'Kalau berhenti, Mas pengkhianat.'], ['“Rektorat mengancam mencabut status mahasiswaku.”', 'Kita minta senat membela, lewat surat resmi. Itu jalan Mas sendiri.', 'Sabar saja.', 'Biarkan dicabut.'], ['“Apakah aku terlalu lunak selama ini?”', 'Tidak. Ada orang yang harus tetap bisa bicara dengan mereka.', 'Mungkin, Mas.', 'Ya. Mas terlalu dekat dengan mereka.']]]
};
for (const [id, [nama, ts]] of Object.entries(TENANG_DATA)) OBROLAN['tenang_' + id] = {
  nama, reaksi: { s: `${nama} menarik napas panjang. Bahunya turun sedikit.`, n: `${nama} masih menatap pintu, belum yakin.`, l: `${nama} berdiri dan mengambil tasnya.` },
  giliran: ts.map(([kata, s, n, l], i) => ({ id: id + 't' + i, kata, opsi: [[s, 's'], [n, 'n'], [l, 'l']] }))
};

/* ---------- orasi untuk tiap kalangan: kalimat yang cocok untuk kampus gagal di pasar ---------- */
Object.assign(KATA, {
  ibu: [
    { id: 'ib1', k: 'Harga minyak naik tapi gaji suami tidak' }, { id: 'ib2', k: 'Kami juga ingin anak kami makan cukup' },
    { id: 'ib3', k: 'Datanglah ke dapur umum bawa beras seadanya' }, { id: 'ib4', k: 'Susu anak tidak boleh lebih mahal dari harga diri' },
    { id: 'ib5', k: 'Kita turun bersama supaya harga turun' }
  ],
  petani: [
    { id: 'pe1', k: 'Tanah ini ditanami kakek kalian sejak dulu' }, { id: 'pe2', k: 'Sertifikat palsu tidak bisa mengusir orang dari sawahnya' },
    { id: 'pe3', k: 'Kami bawa pengacara dan kalian bawa cangkul' }, { id: 'pe4', k: 'Kalau tanah hilang anak cucu makan apa' },
    { id: 'pe5', k: 'Ganti rugi yang adil atau tidak ada pembangunan' }
  ],
  mhs: [
    { id: 'mh1', k: 'Cabut paket undang-undang politik yang membungkam kampus' }, { id: 'mh2', k: 'Kampus bukan barak dan mahasiswa bukan prajurit' },
    { id: 'mh3', k: 'Hapus dwifungsi dan kembalikan tentara ke barak' }, { id: 'mh4', k: 'Kalau kita diam kekuasaan ini abadi' },
    { id: 'mh5', k: 'Satu kampus turun semua kampus menyusul' }
  ]
});
