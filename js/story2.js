/* Angkatan 98 · Babak II: bab 7 sampai 11, interogasi */
TOPIK.harga = { truth: () => true, benar: () => 'Besok harga naik lagi. Minyak goreng sudah habis di tiga pasar.', salah: () => 'Tenang saja, minggu depan harga turun. Pemerintah sudah operasi pasar.' };
TOPIK.damar = { truth: () => 'kompleks', benar: () => 'Mobilnya masuk ke kompleks berpagar tinggi di pinggir kota. Ada saksi tukang ojek.', salah: () => pick(['Bang Damar dibawa ke Polda. Kita tinggal minta LBH mengecek.', 'Bang Damar kabur sendiri ke luar kota. Dia memang begitu.', 'Dia ditahan di Kodim. Besok juga dilepas.']) };
TOPIK.trisakti = { truth: () => 4, benar: () => 'Empat mahasiswa Trisakti tewas ditembak. Puluhan luka.', salah: () => pick(['Belasan mahasiswa tewas. Mayatnya disembunyikan.', 'Tidak ada yang tewas, cuma luka-luka kena peluru karet.', 'Dua mahasiswa tewas, katanya terpeleset saat lari.']) };
const DOKUMEN_KAMAR = ['rak', 'lantai', 'asbak', 'ibukos'];
const ambil = id => ({ t: 'Ambil sebagai bukti', req: s => s.bukti.filter(b => DOKUMEN_KAMAR.includes(b) || b === 'catatanDamar').length < 3, fx: { bukti: id }, run: s => { s.f.buktiDamar = (s.f.buktiDamar || 0) + 1; }, note: 'Kamu memotretnya dan mencatat jam, tempat, dan siapa saksinya.' });
// teror langsung ke pemain hanya datang kalau namamu sudah cukup dikenal aparat
const teleponAtau = s => s.sorotan >= 35 ? 'b7_dering' : 'b7_surat';
const ketuaPena = s => s.f.yosPemimpin ? 'Bang Yos' : 'Kak Ratna';
const ditangkapKe = s => s.sorotan >= (genderKu() === 'L' ? 60 : 70) ? 'culik' : 'periksa';
// map razia berisi bukti dan daftar anggota: dibawa di tas, disembunyikan di sekretariat, atau disita
const isiMap = s => s.bukti.length ? 'map bukti dan daftar anggota' : 'daftar anggota';
const belumDiurus = s => !s.f.dokAman && !s.f.dokDitemukan && !s.f.bawaBukti;
function sembunyikanMap(s, tempat) { s.f.dokAman = tempat; s.f.buktiSekre = s.bukti.splice(0); }
// teror keluarga: keluargamu diincar lebih dulu sebelum kamu. Di luar pelarian dipicu Sorotan (terlalu vokal),
// saat buron dipicu Jejak atau minggu ketiga. Ambang di bawah 100 supaya keluarga selalu kena sebelum kamu diculik.
// Sorotan rendah: PENA diganggu, kamu hanya diawasi. Sedang (35+): PENA ditekan keras, keluarga mulai diintai, kamu diteror.
// Tinggi (65+): PENA dibubarkan dan anggotanya diburu, keluarga dan kamu sendiri jadi sasaran langsung.
const TEROR = [
  { id: 'intai', ambang: 35, judul: 'Rumah diintai', kena: 'ibu', fx: { nyali: -5 }, teks: () => 'Ibu menelepon dengan suara pelan. Sudah seminggu seorang laki-laki bermotor duduk di warung depan rumah setiap pagi, mencatat siapa saja yang datang.' },
  { id: 'bapak', ambang: 50, judul: 'Bapak dipecat', kena: 'bapak', fx: { bapak: -1, bapakDipecat: true }, teks: () => 'Bapak dipanggil atasannya. Ia disuruh memilih: mendisiplinkan anaknya atau berhenti. Seminggu kemudian Bapak diberhentikan, dan kiriman uang dari rumah ikut berhenti.' },
  { id: 'dika', ambang: 65, judul: 'Dika diancam', kena: 'dika', fx: { dika: -1, dikaDiancam: true }, teks: () => 'Dua laki-laki menghadang Dika di gerbang sekolah. “Bilang ke kakakmu, berhenti. Kami tahu jalan pulangmu.” Dika menceritakannya lewat surat yang tulisannya gemetar.' },
  { id: 'geledah', ambang: 80, judul: 'Rumah digeledah', kena: 'ibu', fx: s => ({ bapak: s.f.bukuUntukDika ? -2 : -1, ibu: -1, nyali: -10 }), teks: s => 'Rumah di Magelang digeledah tengah malam. Bapak dibawa ke Kodim dan baru pulang dua hari kemudian, tanpa mau bercerita.' + (s.f.bukuUntukDika ? ' Mereka menemukan buku yang kamu berikan kepada Dika.' : '') },
  // hanya saat kamu buron: tidak menemukanmu, mereka membawa penggantimu
  { id: 'bawa', ambang: 999, buron: true, judul: 'Dika dibawa', kena: 'dika', fx: { dika: -2, nyali: -8, dikaDibawa: true }, teks: () => 'Mereka tidak menemukanmu, jadi mereka membawa Dika dari sekolahnya. Matanya ditutup, dan ia dipindah-pindah dengan mobil semalaman. Tiga hari kemudian ia diturunkan di sebuah desa dan berjalan pulang sendirian.' }
];
function terorJatuh(buron, tujuan) {
  const t = TEROR[S.f.teror || 0];
  if (!t || S.f.keluargaAman || S.f.diLuar || S.bulan >= '1999-01' || (t.buron && !buron)) return false;
  if (!buron && S.f.terorBulan === ((tujuan && NODES[tujuan].bulan) || S.bulan)) return false; // paling banyak sekali sebulan
  return buron ? S.jejak >= 40 || S.m.minggu === 3 : S.sorotan >= t.ambang;
}
const terorIni = s => TEROR.find(t => t.id === s.f.terorIni);
const tierSorotan = () => S.sorotan >= 65 ? 2 : S.sorotan >= 35 ? 1 : 0;
const ancamanJatuh = id => id !== 'ancaman' && S.bulan >= '1997-03' && S.bulan < '1998-04' && !S.f.diLuar && tierSorotan() > (S.f.ancamanTier || 0);
// kejadian pribadi kader yang naik tingkat kedekatan; penyusup yang sudah jadi saudara justru mengaku
const ceritaJatuh = id => id !== 'kader_cerita' && id !== 'penyusup_aku' && (S.f.ceritaAntre || []).length > 0 && S.bulan < '1999-01';
const ceritaIni = s => { const [k, t] = (s.f.ceritaIni || 'laras:1').split(':'); return { k, t: Number(t) }; };
const SEBAB = {
  alamat: s => `Ibu kos bilang ada yang menanyakan kamarmu dengan menyebut nomor kamar yang tepat. Hanya lingkaran dalam yang tahu nomor itu.`,
  nama: s => `${KADER[s.f.sebabKader] ? KADER[s.f.sebabKader].nama : 'Seorang kawan'}, yang tertangkap saat aksi, menyebut namamu di ruang periksa. Kabarnya ia disiksa tiga malam sebelum menyerah.`,
  foto: s => 'Fotomu di konferensi pers soal Bang Damar dimuat dua koran. Wajahmu terlihat jelas, tepat di sebelah spanduk LBH.',
  orasi: s => 'Kata seorang kenalan Mas Yudi, rekaman orasimu diputar di kantor Kodim, dan namamu ditulis di papan tulis mereka.'
};
function sebabBuron(s) {
  const tangkap = Object.keys(s.kader).find(k => s.kader[k] === 'ditangkap' && dekat(k) < 3);
  if (penyusupAktif() && !s.f.penyusupLindung) return 'alamat';
  if (tangkap) { s.f.sebabKader = tangkap; return 'nama'; }
  return s.f.damarPublik ? 'foto' : 'orasi';
}
// kejadian pribadi kader: tingkat 1 = Percaya, tingkat 2 = Saudara
const CERITA = {
  laras: { 1: ['Laras mengajakmu ke rumahnya di Rawamangun. Di dinding ada foto bapaknya dengan kartu pers lama. “Sejak dipecat, Bapak menulis di buku tulis dan menyimpannya di lemari. Tidak ada yang membaca.”', ['Minta izin membaca tulisan bapaknya', { massa: 2 }, 'Kalian membaca sampai subuh. Laras menangis di halaman terakhir, lalu tertawa.'], ['Bilang tulisan itu harus diterbitkan suatu hari', { tekanan: 2 }, 'Laras menatapmu lama. “Kalau begitu kita yang terbitkan.”']], 2: ['Laras mengetik liputan tentang dapur umum di mesin tik pinjaman. “Tulis bersamaku. Namamu di sebelah namaku.”', ['Tulis bersama dengan nama samaran', { tekanan: 4, sorotan: 2 }, 'Liputan kalian dimuat majalah alternatif. Laras menempel klipingnya di dinding kosnya, di sebelah foto bapaknya.'], ['Tulis bersama dengan nama asli', { tekanan: 6, sorotan: 8, pengaruh: 3 }, 'Namamu tercetak di sebelah nama Laras. Ia bilang itu hari paling jujur dalam hidupnya.']] },
  bimo: { 1: ['Bimo bercerita tentang malam ayahnya, seorang mantri desa, tidak bisa menolong anak tetangga yang kejang. “Sejak itu aku tidak tahan melihat orang yang tidak tertolong.”', ['Ajak ia menyusun tim medis yang rapi', { massa: 2 }, 'Bimo menulis daftar perlengkapan di punggung tanganmu. “Kalau ada kamu, aku lebih tenang.”'], ['Bilang ia boleh mundur kalau tidak sanggup', { nyali: 2 }, 'Bimo menggeleng. “Justru karena itu aku harus ada di sana.”']], 2: ['Malam itu kamu pulang dengan memar di lengan. Bimo mengetuk pintu kosmu membawa kotak P3K, tanpa bertanya apa-apa.', ['Biarkan ia merawatmu', { nyali: 8 }, 'Tangannya gemetar saat membersihkan lukamu, tapi suaranya tenang. “Mulai sekarang kalau kamu luka, aku yang pertama tahu.”'], ['Minta ia menjaga kawan lain dulu', { massa: 3, nyali: 3 }, 'Bimo mengangguk, lalu tetap meninggalkan obat merah di mejamu.']] },
  wahyu: { 1: ['Wahyu mengajakmu naik angkot bapaknya keliling Jakarta sampai tengah malam. Ia hafal setiap gang tikus dari Senen sampai Tanjung Priok.', ['Minta ia menggambar peta gang untuk keadaan darurat', { massa: 1 }, 'Peta itu digambar di balik kalender bekas. Kamu menyimpannya di sepatu.'], ['Bantu bapaknya mengganti ban angkot', { nyali: 3 }, 'Bapak Wahyu menolak dibayar ongkos. “Kawan anakku, naik gratis seumur hidup.”']], 2: ['Wahyu menyerahkan kunci serep mobil boks kepadamu. “Kalau ada apa-apa, jam berapa pun, telepon warung depan kosku. Aku datang.”', ['Terima kuncinya', { nyali: 5 }, 'Kunci itu kamu ikat di tali celana. Kamu berharap tidak pernah memakainya.'], ['Kembalikan dan bilang ia yang harus tetap memegangnya', { massa: 2 }, 'Wahyu tertawa. “Ya sudah. Berarti aku yang menyetir.”']] },
  mei: { 1: ['Mei membawamu ke toko keluarganya di Glodok. Papanya menyuruhnya diam setiap kali ia bicara soal kampus. “Di sini, diam itu cara bertahan hidup.”', ['Bantu papanya menutup toko sore itu', { massa: 2 }, 'Papa Mei tidak banyak bicara, tapi ia membungkuskan bakpao untukmu.'], ['Bilang ke Mei catatannya lebih penting dari diam', { pengaruh: 2 }, 'Mei tersenyum kecil. Malam itu ia menambah satu halaman di bukunya.']], 2: ['Mei menyerahkan sebuah buku tulis bersampul plastik. Isinya catatan setiap orang yang hilang, ditangkap, atau dipukul sejak 1996, lengkap dengan tanggal. “Simpan salinannya. Kalau aku kenapa-kenapa, kamu yang meneruskan.”', ['Simpan dan rawat catatannya', { bukti: 'catatanMei' }, 'Buku itu kamu bungkus plastik dan kamu simpan di tempat yang hanya kalian berdua tahu.'], ['Simpan, lalu minta Mei membuat satu salinan lagi untuk LBH', { bukti: 'catatanMei', ratna: 1 }, 'Sekarang ada tiga salinan. Satu di LBH, satu padamu, satu pada Mei.']] },
  asep: { 1: ['Asep mengajakmu ke kontrakan kakaknya, buruh pabrik sepatu yang baru di-PHK. Di dinding ada slip gaji terakhir yang dibingkai.', ['Dengarkan cerita kakaknya sampai habis', { massa: 3 }, 'Kakak Asep bercerita tentang lembur tanpa upah. Kamu tidak berpidato sekali pun malam itu.'], ['Janjikan bantuan LBH untuk kasus PHK-nya', { ratna: 1 }, 'Kakak Asep tidak percaya, tapi ia menyimpan nomor telepon yang kamu tulis.']], 2: ['Asep membawamu ke rapat serikat buruh di gudang kosong. Tiga puluh buruh menatapmu. “Ini kawanku. Ia tidak sok,” kata Asep.', ['Duduk di belakang dan dengarkan', { massa: 6 }, 'Di akhir rapat, ketua serikat menjabat tanganmu. “Kalau mahasiswa turun, kami ikut.”'], ['Berbicara singkat soal harga sembako', { massa: 4, pengaruh: 3 }, 'Mereka mendengar sampai habis, lalu bertanya hal-hal yang tidak bisa kamu jawab. Asep menepuk bahumu.']] },
  dimas: { 1: ['Dimas membacakan puisi yang dulu dilarang dibacakan di sekolahnya. Suaranya pecah di bait terakhir.', ['Minta ia membacakannya di aksi berikutnya', { pengaruh: 2 }, 'Dimas memeluk kertas puisinya. “Kalau kamu di barisan depan, aku berani.”'], ['Bilang puisinya terlalu berbahaya', { sorotan: -2 }, 'Dimas tertawa pahit. “Semua yang jujur memang berbahaya.”']], 2: ['Dimas menyerahkan selembar kertas. Puisi tentangmu, berjudul “Kawan yang Tidak Pulang Duluan”.', ['Simpan puisinya di dompet', { nyali: 6 }, 'Setiap kali takut, kamu membaca baris pertamanya.'], ['Minta ia membacakannya di depan kawan-kawan', { massa: 4 }, 'Sekretariat sunyi saat Dimas membaca. Lalu semua orang bertepuk tangan, dan kamu tidak tahu harus melihat ke mana.']] },
  tigor: { 1: ['Tigor bercerita tentang ayahnya, seorang hakim yang mengalah pada telepon dari atasan. “Aku masuk Hukum supaya tidak jadi dia.”', ['Minta ia mengajarimu hak-hak saat ditangkap', { nyali: 3 }, 'Tigor menulis daftar di sobekan kertas: surat perintah, pengacara, tidak wajib menjawab. Kamu menghafalnya.'], ['Bilang hukum mereka tidak berlaku untuk kalian', { damar: 1 }, 'Tigor menggeleng. “Justru karena mereka melanggarnya, kita harus hafal.”']], 2: ['Tigor mengetuk pintumu dengan map tebal. “Ini nomor telepon LBH, hafalkan. Kalau kamu ditangkap, aku yang datang pertama. Aku janji.”', ['Hafalkan nomornya di depannya', { nyali: 5 }, 'Tigor mengujimu tiga kali sampai kamu tidak salah satu angka pun.'], ['Tukar nomor: ia juga hafal nomor rumahmu di Magelang', { ibu: 1 }, 'Kalau terjadi apa-apa, setidaknya ada yang mengabari Ibu.']] }
};
const kembali = s => { const k = s.f.kembaliKe || 'b12_buron'; s.f.kembaliKe = null; s.f.terorBuron = false; return k; };
// target massa dan cara mengajak: makin luas dan terbuka, makin banyak yang datang, makin mudah disusupi
const AJAK = { mulut: { jangkau: 0.7, susup: 0.05 }, poster: { jangkau: 1, susup: 0.15 }, selebaran: { jangkau: 1.25, susup: 0.3 }, terbuka: { jangkau: 1.5, susup: 0.5 } };
const kal = (s, g) => (s.f.kalangan || {})[g] || 0;
const skalaAjak = s => (0.5 + 0.3 * kal(s, 'ibu') + 0.3 * kal(s, 'petani') + 0.5 * kal(s, 'mhs')) * (AJAK[s.f.ajak] || AJAK.poster).jangkau;
const KAL_ISU = { ibu: ['sembako'], petani: ['tanah', 'kkn'], mhs: ['golput', 'uu', 'dwifungsi', 'turun', 'hilang'] };
function cocokIsu(s) {
  const ada = Object.keys(KAL_ISU).filter(g => kal(s, g) >= 0.5);
  if (!ada.length) return 1;
  return ada.some(g => KAL_ISU[g].includes(s.f.isuAksi)) ? 1.2 : 0.7;
}
// kemarahan aparat: jumlah orang, bentuk aksi, dan penyusup menaikkannya; Tugas Cendekiawan Muslim mengajarkan menahan diri
// ibu-ibu membuat aparat menahan diri, barisan mahasiswa membuat mereka tegang; dosen yang ikut berorasi melindungi barisan
const marahAwal = s => Math.round(15 + 25 * kal(s, 'mhs') + 5 * kal(s, 'petani') - 10 * kal(s, 'ibu')) + ({ jalan: 15, dprd: 10, duduk: 5, mimbar: 0, delegasi: -10, kamuflase: -20 }[s.f.bentuk] || 0) + (s.f.provokatorLolos ? 15 : 0) + 10 * (s.f.susupLolos || 0) + (s.f.aksiBocor ? 10 : 0) - 2 * paham('syariati') - (s.f.dosenIkut ? 10 : 0);
function marahAkhir(s) {
  const m = s.m.marah;
  if (m >= 80) { const k = kaderAktif().find(id => id !== s.penyusup); if (k) s.kader[k] = 'ditangkap'; apply({ kuasa: 4, ricuh: 2, nyali: saudara('bimo') ? -5 : -10 }); return ['Kemarahan aparat pecah. Barisan tameng menyerbu, pentungan diayunkan ke siapa saja.' + (k ? ` ${KADER[k].nama} diseret ke truk.` : '')]; }
  if (m >= 50) { apply({ ricuh: 1 }); return ['Pentungan sempat diayunkan di barisan depan sebelum komandan menarik pasukannya.']; }
  if (m < 30) { apply({ ricuh: -1, massa: 3, kuasa: -3 }); return ['Aparat menahan diri sampai barisan bubar. Wartawan mencatat aksi yang tertib.']; }
  return [];
}
// dua pasangan bukti mengarah ke tempat Damar ditahan; kombinasi lain menyesatkan
function simpulanDamar(s) {
  const b = new Set(s.bukti);
  if (b.has('ibukos') && (b.has('lantai') || b.has('asbak'))) return 'kompleks';
  if (b.has('catatanDamar')) return 'kabur';
  if (b.has('rak')) return 'polda';
  if (b.has('lantai') || b.has('asbak')) return 'kodim';
  if (b.has('ibukos')) return 'tol';
  return null;
}
const SIMPULAN = { kompleks: 'sebuah kompleks berpagar tinggi di pinggir kota', polda: 'Polda Metro Jaya', kodim: 'markas Kodim terdekat', kabur: 'tempat persembunyian Damar sendiri di luar kota', tol: 'arah tol luar kota, tanpa tujuan yang jelas' };
const lewat = (s, jenis) => Array.isArray(s.f.rute) ? nilaiRute(s.f.rute)[jenis] : 0;
// rute yang digambar korlap menentukan siapa yang bergabung dan di mana barisan dihadang
function efekRute(s) {
  const fx = {}, note = [], add = (k, x) => { fx[k] = (fx[k] || 0) + x; };
  if (!Array.isArray(s.f.rute)) return { fx, note };
  const v = nilaiRute(s.f.rute);
  if (s.f.aksiBocor) return { fx: { ricuh: 1 + v.pos, sorotan: 5, massa: -8 }, note: ['Sejak subuh, aparat sudah berjaga di setiap titik rute yang kalian gambar. Gang kampung ditutup, gerbang kampus tetangga digembok. Rencana itu bocor dari dalam.'] };
  if (v.tetangga) { add('massa', aktif('mei') ? 8 : 2); note.push(aktif('mei') ? 'Mei menunggu di gerbang kampus tetangga. Ratusan mahasiswa menyambung barisanmu.' : 'Kampus tetangga menutup gerbangnya. Tidak ada yang menjemput mereka, jadi hanya beberapa orang yang menyusul.'); }
  if (v.kampung) { const kenal = s.f.dapurUmum || aktif('asep'); add('massa', v.kampung * (kenal ? 4 : 2)); note.push('Di gang-gang kampung, ibu-ibu menyodorkan air kendi dan anak-anak muda ikut berbaris.' + (kenal ? ' Mereka mengenal kalian dari dapur umum.' : '')); }
  if (v.pasar) { if (s.f.provokatorLolos) { add('ricuh', 2); note.push('Di pasar, laki-laki yang lolos sweeping memecahkan kaca toko. Beberapa orang mulai menjarah, dan wartawan memotret semuanya.'); } else { add('massa', 3); add('sorotan', 3); note.push('Pedagang pasar bertepuk tangan dari balik lapak. Satu-dua ikut berjalan.'); } }
  if (v.pos) { add('ricuh', v.pos); add('sorotan', 5 * v.pos); note.push(v.pos > 1 ? 'Rutemu melewati dua pos aparat. Barisan dihadang dua kali sebelum sampai.' : 'Di perempatan yang dilingkari merah, barisan tameng sudah menunggu.'); }
  else note.push('Rutemu menghindari semua pos aparat. Barisan tameng baru menghadang di dekat tujuan.');
  if (v.panjang > 5) { const air = (s.siap.air || 0) >= 0.8; if (!air) add('massa', -2 * (v.panjang - 5)); note.push(air ? 'Rutenya panjang, tapi air minum cukup dan barisan tetap utuh.' : 'Rutenya panjang dan air minum habis di tengah jalan. Barisan menipis sebelum sampai.'); }
  return { fx, note };
}

Object.assign(NODES, {
  b7_toko: {
    bab: 7, judul: 'Kamis Hitam', waktu: 'Kamis, 8 Januari 1998', bulan: '1998-01', scene: 'toko', alt: 'Rak toko kelontong yang kosong', enter: { kuasa: -3 },
    text: ['Pagi ini rupiah dikabarkan tembus Rp 10.000 per dolar. Orang-orang memborong apa saja di toko kelontong dekat kos, dan rak minyak goreng kosong sebelum pukul sepuluh.', 'Ini pertama kalinya kabar datang dari banyak mulut sekaligus. Kamu harus memutuskan mana yang dipercaya.'],
    kabar: s => [kabar('harga', 'warung'), kabar('harga', s.bekal.includes('radio') ? 'radio' : 'tvri'), kabar('harga', aktif('laras') ? 'laras' : 'ratna')],
    hots: {
      rak: { label: 'Rak kosong', text: 'Yang tersisa hanya kecap dan obat nyamuk.' },
      papan: { label: 'Papan harga', text: s => `Harga minyak goreng dicoret tiga kali sejak minggu lalu. Satu paket beras dan minyak sekarang ${rp(harga(20000))}.` },
      radio: { label: 'Radio', text: 'Penyiar membacakan imbauan pemerintah agar masyarakat tidak panik.' },
      ibu: { label: 'Ibu-ibu di antrean', text: '“Susu anak saya sudah tidak terbeli. Bulan lalu masih bisa.”' }
    },
    choices: [
      { t: 'Borong sekarang selagi masih ada', req: s => s.uang.tunai >= harga(20000), run: s => { const n = Math.min(5, Math.floor(s.uang.tunai / harga(20000))); s.uang.tunai -= n * harga(20000); s.uang.barang += n; s.ui.tmp = n; }, fx: { massa: -2 }, go: 'b7_imf', note: s => `Kamu pulang membawa ${s.ui.tmp} paket. Di belakangmu, seorang ibu tidak kebagian apa-apa.` },
      { t: 'Beli secukupnya, sisakan untuk orang lain', req: s => s.uang.tunai >= harga(20000), cost: () => harga(20000), fx: { barang: 1, fikri: 1 }, go: 'b7_imf', note: 'Kamu mengambil satu paket dan memberi jalan kepada ibu-ibu di belakangmu.' },
      { t: 'Bawa stok barangmu ke dapur umum', req: s => s.f.dapurUmum && s.uang.barang >= 2, fx: s => ({ barang: -s.uang.barang, massa: 4 + s.uang.barang * 2, dapurKali: (s.f.dapurKali || 0) + 1 }), go: 'b7_imf', note: 'Pak RT menepuk bahumu. Siang itu dapur umum memasak dua kali lebih banyak.' },
      { t: 'Tidak membeli apa-apa', go: 'b7_imf', note: 'Kamu pulang dengan tangan kosong dan dompet yang terasa makin tipis setiap hari.' }
    ]
  },
  b7_imf: {
    bab: 7, judul: 'Foto di Koran', waktu: 'Kamis, 15 Januari 1998', scene: 'koran', alt: 'Halaman depan koran dengan foto penandatanganan',
    text: ['Koran pagi memuat foto yang dibicarakan semua orang: Presiden membungkuk menandatangani surat kesepakatan dengan IMF, sementara direktur pelaksana IMF berdiri bersedekap di sampingnya.', 'Presidium memintamu membuat poster dari foto itu. Satu poster, satu kalimat.'],
    hots: { foto: { label: 'Foto', text: 'Tangan bersedekap itu yang membuat orang marah. Di warung, bapak-bapak menyebutnya “dijajah lagi”.' }, judul: { label: 'Judul koran', text: 'Pemerintah Sepakati Paket Reformasi Ekonomi. Di halaman dalam: harga minyak goreng naik lagi.' } },
    choices: [
      { t: 'Poster “Bangsa yang Membungkuk”', d: 'soal harga diri dan kejujuran', fx: { kuasa: -2, fikri: 1, iklim: 2, sorotan: 2 }, go: teleponAtau, note: 'Posternya ditempel di masjid kampus dan halte. Bang Fikri memotretnya.' },
      { t: 'Poster “Utang Siapa, Lapar Siapa”', d: 'soal harga beras dan utang negara', fx: { kuasa: -2, ratna: 1, iklim: 2, massa: 2 }, go: teleponAtau, note: 'Ibu-ibu di pasar meminta selembar untuk ditempel di lapak.' },
      { t: 'Poster “Turunkan yang Menandatangani”', d: 'langsung ke Presiden', fx: { kuasa: -3, damar: 1, iklim: 3, sorotan: 8 }, go: teleponAtau, note: 'Posternya dicopot dalam satu jam, tapi fotokopinya sudah beredar di lima kampus.' },
      { t: 'Poster “Pasal 33 Bukan untuk Dijual”', d: 'soal konstitusi', fx: { kuasa: -2, yudi: 1, iklim: 2 }, go: teleponAtau, note: 'Mas Yudi bilang poster itu “bisa dibela di depan rektor”. Dosen Hukum Tata Negara menempelnya di pintu ruangannya.' }
    ]
  },
  b7_dering: {
    bab: 7, judul: 'Telepon Pukul Dua', waktu: 'Februari 1998', bulan: '1998-02', scene: 'kos', v: 'malam', dering: true, kalender: 'Februari 1998', alt: 'Kamar kos tengah malam, telepon berdering',
    text: ['Telepon di lorong berdering pukul dua pagi. Tidak ada orang yang menelepon kos pada jam begini.', 'Dering kedua. Dering ketiga. Di kamar sebelah, seseorang membalikkan badan di kasur.'],
    batasWaktu: { detik: 8, label: 'Dering telepon', habis: s => ({ fx: { ibu: -1, nyali: -3, teleponDibiarkan: true }, note: 'Dering kelima, lalu sunyi. Paginya Ibu menelepon dari Magelang dengan suara gemetar: tengah malam ada laki-laki menelepon ke rumah, menanyakan kamu kuliah di mana.', go: 'b7_surat' }) },
    choices: [
      { t: 'Angkat', go: 'b7_telepon' },
      { t: 'Biarkan berdering', fx: { ibu: -1, nyali: -3, teleponDibiarkan: true }, go: 'b7_surat', note: 'Kamu menarik sarung sampai ke kepala. Dering itu berhenti. Paginya Ibu menelepon dari Magelang dengan suara gemetar: tengah malam ada laki-laki menelepon ke rumah, menanyakan kamu kuliah di mana.' }
    ]
  },
  b7_telepon: {
    bab: 7, judul: 'Telepon Pukul Dua', waktu: 'Februari 1998', bulan: '1998-02', scene: 'kos', v: 'malam', dering: true, kalender: 'Februari 1998', enter: { nyali: -10 }, alt: 'Kamar kos tengah malam, telepon berdering',
    text: s => ['Kamu mengangkat gagangnya. Suara laki-laki, tenang, hampir ramah: “Kami tahu kamu kuliah di mana. Kami juga tahu ibumu tinggal di mana.” Lalu sambungan putus.', 'Paginya ada motor tanpa pelat di ujung gang. Pengendaranya tidak turun.'],
    hots: { jendela: KOS_HOTS.jendela, pintu: { label: 'Telepon di lorong', text: 'Gagangnya masih tergantung miring. Kamu tidak berani menutupnya.' } },
    choices: [
      { t: 'Abaikan. Membuatmu takut memang tujuan mereka.', fx: { nyali: 10, sorotan: 10, damar: 1 }, go: 'b7_surat', note: 'Kamu tetap kuliah, tetap rapat, tetap lewat gang itu. Motor itu muncul lagi dua kali minggu ini.' },
      { t: 'Laporkan dan dokumentasikan ke LBH', fx: { sorotan: -5, nyali: 8, ratna: 1 }, go: 'b7_surat', note: 'Pengacara LBH membuka map tebal berisi laporan serupa. Kamu bukan satu-satunya, dan entah kenapa itu membuatmu lebih tenang.' },
      { t: 'Pulang ke Magelang seminggu', fx: { nyali: 15, sorotan: -10, pengaruh: -8, ibu: 1 }, go: 'b7_surat', note: 'Ibumu tidak bertanya apa-apa. Ia hanya terus menambah lauk ke piringmu. Saat kamu kembali, rapat-rapat sudah berjalan tanpamu.' }
    ]
  },
  b7_protokol: {
    mode: 'form', bab: 4, judul: 'Protokol Keamanan', waktu: 'Maret 1997', scene: 'sekre', v: 'radio', alt: 'Rapat keamanan di sekretariat',
    text: s => [`${ketuaPena(s)} mengumpulkan kalian di sekretariat yang baru dibereskan. “Mulai malam ini kita pakai aturan. Pilih dua. Lebih dari itu, kita tidak sanggup menjalankannya.”`],
    steps: [{ id: 'p', label: 'Protokol keamanan', multi: 2, options: () => [
      { v: 'sel', t: 'Sistem sel', d: 'setiap orang hanya mengenal dua nama lain; rapat jadi lambat', req: s => s.ratna >= 2 },
      { v: 'p48', t: 'Protokol 48 jam', d: 'kalau ada yang tertangkap, semua pindah dan ganti kode dalam dua hari, dengan ongkos sendiri' },
      { v: 'samaran', t: 'Nama samaran dan kode telepon', d: 'di telepon kamu menjadi “Joko”; pesan kadang salah tangkap' },
      { v: 'safehouse', t: 'Safehouse', d: `${rp(harga(50000))}; kamar kontrakan di gang buntu, sewanya dibayar tiap bulan` },
      { v: 'kolektif', t: 'Kepemimpinan bertiga', d: 'kalau ketua tertangkap, tiga orang memimpin bersama; keputusan jadi lebih lama' }] }],
    done: (s, p) => {
      const note = [];
      for (const x of p.p) {
        if (x === 'safehouse' && !bayar(harga(50000))) { note.push('Uangmu tidak cukup untuk menyewa safehouse. Protokol itu batal.'); continue; }
        s.protokol.push(x);
      }
      const fx = {};
      if (s.protokol.includes('samaran')) { fx.sorotan = penyusupAktif() ? 0 : -10; note.push(penyusupAktif() ? 'Kode telepon baru dipakai seminggu, lalu orang asing mulai menelepon dengan kode yang sama.' : 'Di telepon, sekarang kamu bernama “Joko”.'); }
      if (s.protokol.includes('safehouse')) { note.push('Wahyu menemukan kamar kontrakan di gang buntu dekat rel kereta. Hanya tiga orang yang tahu alamatnya.'); if (bocor()) { s.f.safehouseBocor = true; note.push('Seminggu kemudian, sebuah motor mulai parkir di mulut gang buntu itu setiap malam.'); } }
      if (s.protokol.includes('p48')) note.push('Aturannya sederhana: siapa pun yang tertangkap, semua pindah dan ganti kode dalam 48 jam.');
      if (s.protokol.includes('sel')) note.push('Setiap orang hanya mengenal dua nama lain. Rapat menjadi lebih lambat dan lebih sepi.');
      if (s.protokol.includes('kolektif')) note.push('Tiga nama ditulis di balik kalender sekretariat. Kalau satu hilang, dua lainnya tetap memegang kemudi.');
      return { fx, note, go: 'kos3' };
    }
  },
  b7_surat: {
    bab: 7, judul: 'Surat dari Bapak', waktu: 'Februari 1998', scene: 'kos', kalender: 'Februari 1998', alt: 'Meja belajar dengan surat dari rumah',
    text: s => ['Surat bertulisan tangan Bapak datang terselip di bawah pintu. Kalimat pertamanya: “Atasan Bapak bertanya apakah kamu ikut-ikutan.”', s.f.bohongBapak ? 'Di bagian bawah, Bapak menulis bahwa seseorang memperlihatkan fotomu di majalah kampus kepadanya.' : 'Di bagian bawah, Bapak menulis bahwa harga pupuk di kampung naik dua kali lipat.'],
    hots: { meja: { label: 'Surat', text: 'Tulisan Bapak miring ke kanan, seperti ditulis tergesa-gesa.' } },
    choices: [
      { t: 'Balas dengan jujur', fx: { nyali: 5, suratJujur: true, kirimanSeparuh: true }, go: 'kos6', note: 'Kamu menulis tiga halaman. Bulan berikutnya kiriman dipotong separuh, tapi di amplopnya ada catatan kecil: “Jaga diri. Bapak.”' },
      { t: 'Balas dengan bohong', fx: { suratBohong: true }, go: 'kos6', note: 'Kamu menulis bahwa kamu sibuk praktikum. Kiriman datang utuh bulan berikutnya.' },
      { t: 'Tidak membalas', fx: { bapak: -1, kirimanStop: true }, go: 'kos6', note: 'Kiriman tidak datang bulan berikutnya. Surat berikutnya dari Bapak hanya berisi tiga baris.' }
    ]
  },
  kos6: kosNode({ bab: 'Antara bab 7 dan 8', waktu: 'Januari – Februari 1998', dari: '1997-12', bulan: '1998-02', kalender: 'Februari 1998', next: 'b8_massa' }),

  b8_massa: {
    mode: 'rounds', bab: 8, judul: 'Mengumpulkan Massa', waktu: 'akhir Februari 1998', bulan: '1998-02', scene: 'jalan', spanduk: 'TURUNKAN HARGA', alt: 'Pasar, balai desa, dan halaman fakultas',
    enter: s => { s.f.kalangan = { ibu: 0, petani: 0, mhs: 0 }; return {}; },
    text: ['Sebelum menggambar rencana di papan tulis, kamu harus tahu siapa yang mau datang. Setiap kalangan punya bahasanya sendiri.', 'Beberapa hari lalu, sekelompok ibu berdemonstrasi singkat di Bundaran HI soal harga susu. Mereka menyamarkannya sebagai bazar, memakai baju kantor, dan membagikan bunga kepada tentara.'],
    hots: { pasar: { label: 'Pasar', text: 'Ibu-ibu menawar cabai sambil menggerutu soal minyak goreng.' }, balai: { label: 'Balai desa', text: 'Di pinggir kota, papan proyek perumahan berdiri di tengah sawah. Petani pemiliknya belum menerima ganti rugi.' }, fakultas: { label: 'Fakultas', text: 'Mahasiswa berkerumun di depan papan nilai. Mereka mendengar orang yang dianggap serius kuliahnya.' } },
    rounds: [
      { text: 'Pasar pagi. Ibu-ibu berkerumun di depan lapak minyak goreng.', options: [
        { t: 'Orasi dengan bahasa dapur dan harga', kata: 'ibu', req: s => (s.f.dapurKali || 0) >= 2, run: s => { s.f.kalangan.ibu = s.m.kataOk ? 1 : 0.5; return s.m.kataOk ? 'Ibu-ibu mengenali wajahmu dari dapur umum. “Kapan? Kami bawa termos.”' : 'Mereka mengangguk sopan. Sebagian berjanji datang.'; } },
        { t: 'Orasi seperti di mimbar kampus', kata: 'mhs', req: s => (s.f.dapurKali || 0) >= 2, run: s => { s.f.kalangan.ibu = 0.3; return 'Ibu-ibu saling pandang. Kalimatmu kalimat kampus, bukan kalimat dapur.'; } },
        { t: 'Datang ke pasar dan bicara apa adanya', req: s => (s.f.dapurKali || 0) < 2, run: s => { s.f.kalangan.ibu = 0.1; return 'Ibu-ibu belum kenal wajahmu. “Kami cuma kenal anak-anak yang suka bantu masak di dapur umum.”'; } },
        { t: 'Lewati pasar', note: 'Kamu tidak mampir ke pasar.' }] },
      { text: 'Balai desa di pinggir kota. Petani yang sawahnya dipatok proyek perumahan menunggu siapa pun yang mau membantu.', options: [
        { t: 'Bantu berkas sengketa ke LBH, lalu orasi di balai desa', kata: 'petani', req: s => aktif('tigor') || s.ratna >= 3, fx: () => ({ uang: -harga(30000) }), run: s => { s.f.kalangan.petani = s.m.kataOk ? 1 : 0.5; return (aktif('tigor') ? 'Tigor membacakan surat kuasa dari LBH.' : 'Kak Ratna menitipkan surat kuasa dari LBH.') + (s.m.kataOk ? ' Pak Lurah sendiri yang menjanjikan dua truk petani.' : ' Petani mendengarkan, tapi belum semua yakin.'); } },
        { t: 'Datang ke balai desa dengan tangan kosong', req: s => !(aktif('tigor') || s.ratna >= 3), run: s => { s.f.kalangan.petani = 0.1; return 'Pak Lurah bertanya apakah kamu bisa membantu mengurus sertifikat. Kamu tidak bisa menjawab.'; } },
        { t: 'Lewati balai desa', note: 'Kamu tidak sempat ke pinggir kota.' }] },
      { text: 'Halaman fakultas. Mahasiswa berkerumun di depan papan pengumuman.', options: [
        { t: 'Orasi di depan fakultas', kata: 'mhs', req: s => s.ipk >= 2.8, run: s => { s.f.kalangan.mhs = s.m.kataOk ? 1 : 0.5; return s.m.kataOk ? 'Ketua himpunan mengangkat tangan. “Satu angkatan ikut.”' : 'Beberapa orang bertepuk tangan, lalu kembali ke kantin.'; } },
        { t: 'Naik ke mimbar fakultas', req: s => s.ipk < 2.8, run: s => { s.f.kalangan.mhs = 0.2; return 'Seseorang berteriak dari belakang: “Urus dulu nilaimu!” Tawa menyebar, dan kerumunan bubar.'; } },
        { t: 'Lewati fakultas', note: 'Kamu tidak naik mimbar.' }] }
    ],
    done: s => { const k = s.f.kalangan, ada = Object.keys(k).filter(g => k[g] >= 0.5).map(g => ({ ibu: 'ibu-ibu pasar', petani: 'petani pinggiran kota', mhs: 'mahasiswa' }[g])); return { note: ada.length ? `Yang berjanji datang: ${ada.join(', ')}. Isu yang kamu pilih nanti harus bicara kepada mereka.` : 'Hanya lingkaran kecilmu sendiri yang berjanji datang.', go: 'b8_papan' }; }
  },

  b8_papan: {
    mode: 'form', rencana: 'aksi', bab: 8, judul: 'Papan Tulis', waktu: 'akhir Februari 1998', bulan: '1998-02', scene: 'papan', alt: 'Papan tulis dengan peta rute aksi',
    text: s => ['Kampus-kampus merencanakan aksi selama Sidang Umum MPR, 1–11 Maret 1998. Kamu berdiri di depan papan tulis dengan kapur di tangan.', s.pengaruh >= 55 || s.f.yosPercaya === 2 && s.f.yosPemimpin ? `${ketuaPena(s)} menunjukmu sebagai koordinator lapangan.` : 'Korlap lama mundur setelah orang tuanya didatangi aparat. Kamu menggantikannya, meski belum semua orang percaya padamu.'],
    hots: {
      peta: { label: 'Peta', text: 'Kampus, jalan raya, kampung, pasar, Senayan, dan dua lingkaran merah: pos aparat yang dilaporkan anak-anak Damar.' },
      kartu: { label: 'Kartu kader', text: () => kaderAktif().map(k => `${KADER[k].nama} (${KADER[k].ahli})`).join(', ') || 'Belum ada kader yang bisa ditugaskan.' },
      daftar: { label: 'Daftar periksa', text: 'Kak Ratna menulis: tali, medis, hukum, humas, sweeping, air, odol, toa.' }
    },
    steps: [
      { id: 'isu', label: 'Isu utama aksi', options: isuOpts },
      { id: 'frame', label: 'Bingkai', options: () => FRAMING },
      { id: 'bentuk', label: 'Bentuk aksi', options: () => [
        { v: 'mimbar', kel: 'Di dalam kampus', t: 'Mimbar di dalam kampus', d: 'di dalam pagar kampus' },
        { v: 'duduk', kel: 'Di dalam kampus', t: 'Aksi duduk di gerbang', d: 'menghadang di gerbang kampus' },
        { v: 'jalan', kel: 'Long march', t: 'Long march ke jalan raya', d: 'turun ke jalan raya' },
        { v: 'dprd', kel: 'Long march', t: 'Long march ke DPRD', d: 'berjalan sampai gedung DPRD' },
        { v: 'delegasi', t: 'Delegasi tanpa massa', d: 'beberapa orang menemui pejabat' },
        { v: 'kamuflase', t: 'Aksi kamuflase: bazar sembako murah', d: 'singkat, membaur, tidak terlihat seperti demo' }] },
      { id: 'ajak', label: 'Cara mengajak', options: () => [
        { v: 'mulut', t: 'Dari mulut ke mulut', d: 'pelan, hanya ke orang yang dipercaya' },
        { v: 'poster', t: 'Poster di papan kampus', d: 'semua mahasiswa bisa membaca' },
        { v: 'selebaran', t: 'Selebaran ke kampung dan pasar', d: 'dibagikan sampai keluar pagar kampus' },
        { v: 'terbuka', t: 'Pengumuman terbuka lewat radio kampus dan koran', d: 'siapa pun bisa mendengar' }] },
      { id: 'rute', label: 'Gambar rute long march', type: 'peta' },
      { id: 'pos', label: 'Tempatkan kader di pos', type: 'pos' },
      { id: 'gelang', label: 'Warna gelang hari itu', options: () => ['merah', 'kuning', 'hijau', 'biru'].map(w => ({ v: w, t: cap(w) })) }
    ],
    done: (s, p) => {
      s.f.isuAksi = p.isu; s.f.bentuk = p.bentuk; s.f.ajak = p.ajak; s.f.rute = p.rute; s.f.ruteJauh = p.bentuk === 'jalan' || p.bentuk === 'dprd'; s.f.pos = p.pos; s.f.gelang = p.gelang;
      const fx = { [FRAME_SENIOR[p.frame]]: 1 }, menang = { jalan: 'damar', dprd: 'damar', duduk: 'fikri', mimbar: 'ratna', delegasi: 'yudi', kamuflase: 'ratna' }[p.bentuk];
      for (const k of Object.keys(SENIOR)) fx[k] = (fx[k] || 0) + (k === menang ? 1 : -1);
      const kosong = Object.keys(POS).filter(k => !p.pos[k]).map(k => POS[k].toLowerCase());
      return { fx, note: [`Rencana disepakati: ${{ mimbar: 'mimbar di dalam kampus', duduk: 'aksi duduk di gerbang', jalan: 'long march ke jalan raya', dprd: 'long march ke DPRD', delegasi: 'delegasi tanpa massa', kamuflase: 'bazar sembako murah di halaman kampus' }[p.bentuk]}. Gelang hari itu berwarna ${p.gelang}.`, menang === 'damar' ? 'Anak-anak Damar bersorak. Bang Fikri keluar ruangan tanpa bicara.' : menang === 'fikri' ? 'Bang Fikri tersenyum. Anak-anak Damar menyebutmu penakut.' : menang === 'yudi' ? 'Mas Yudi menelepon pembantu rektor saat itu juga. Anak-anak Damar keluar ruangan.' : 'Separuh ruangan kecewa, separuh lagi lega.', ...(p.rute ? [`Rute: ${p.rute.map(id => PETA[id].nama).join(' → ')}.`] : []), kosong.length ? `Pos yang masih kosong: ${kosong.join(', ')}.` : 'Semua pos terisi.'], go: 'b8_logistik' };
    }
  },
  b8_logistik: {
    mode: 'logistik', bab: 8, judul: 'Logistik', waktu: 'awal Maret 1998', bulan: '1998-03', scene: 'papan', alt: 'Daftar belanja logistik aksi',
    text: ['Kak Ratna menyerahkan amplop kas gerakan. “Belanja yang perlu, bukan yang kamu mau. Massa tanpa air minum bubar lebih cepat dari massa yang dipukul.”'],
    massaBenar: s => ({ mimbar: 300, duduk: 500, jalan: 900, dprd: 800, delegasi: 20, kamuflase: 250 }[s.f.bentuk] || 300) * (0.6 + s.massa / 100) * (s.iklim >= ISU.find(i => i.v === s.f.isuAksi).ambang ? 1 : 0.6) * skalaAjak(s) * cocokIsu(s),
    next: 'b9_kumpul'
  },
  b9_kumpul: {
    mode: 'inspect', level: 2, v: 'kumpul', sabar: s => 9 + (s.f.pos && s.f.pos.sweeping ? 4 : 0), bab: 9, judul: 'Titik Kumpul', waktu: 'awal Maret 1998', scene: 'inspect', alt: 'Meja sweeping di titik kumpul aksi',
    text: s => [`Kamu duduk di meja sweeping. Aturannya: jaket almamater, KTM, dan gelang ${s.f.gelang}. Antrean di belakang terus memanjang.`],
    rules: s => `<ul class="rules">${s.f.pos && s.f.pos.sweeping ? `<li>${KADER[s.f.pos.sweeping].nama} membuka meja sweeping kedua di sebelahmu.</li>` : ''}<li>Peserta memakai jaket almamater dan membawa KTM.</li><li>Gelang hari ini berwarna <b>${s.f.gelang}</b>.</li><li>Periksa tas kalau ada yang mencurigakan.</li></ul>`,
    daftar: s => `<div class="sheet"><p><b>Gelang hari ini: ${s.f.gelang}</b></p><p>Jaket almamater wajib. Wartawan boleh ikut di luar barisan.</p></div>`, daftarLabel: 'Pegangan sweeping',
    visitors: s => {
      s.f.susupLolos = 0;
      const g = s.f.gelang, lain = ['merah', 'kuning', 'hijau', 'biru'].filter(w => w !== g);
      const mhs = (id, nama, f, extra = {}) => ({ id, nama, sah: true, sepatu: 'sneakers', face: f, gelang: g, docs: [{ type: 'ktm', nama, nim: '97.0' + (1 + nama.length % 4) + '.0' + (100 + nama.length * 7), fak: 'Teknik', ang: '1997', face: f }], kata: '“Barisan kampus kita di sebelah mana?”', jawab: '“Aku ikut sejak mimbar bulan lalu.”', ...extra });
      const list = [
        mhs('m1', 'Andi Kurniawan', C.mhs1),
        { id: 'prov', nama: 'Tanpa nama', sah: false, sepatu: 'sandal', face: { head: 'kotak', hair: 'cepak', mood: 'marah', baju: 'kaus' }, docs: [{ type: 'none', teks: 'Tidak membawa KTM' }], gelang: null, tas: 'jeriken kecil berisi bensin', tasBahaya: true, kata: '“Saya warga, mau ikut bela mahasiswa.”', jawab: '“Kampus mana? Ya, kampus sini. Sudah, biarkan saya masuk.”', kebenaran: 'provokator. Ia membawa bensin.' },
        mhs('m2', 'Rina Oktaviani', C.mhs2),
        { id: 'intel', nama: 'Gunawan', sah: false, sepatu: 'lars', face: { head: 'kotak', hair: 'cepak', baju: 'almamater' }, gelang: penyusupAktif() ? g : pick(lain), docs: [{ type: 'ktm', nama: 'Gunawan', nim: '96.03.0411', fak: 'Ekonomi', ang: '1996', stempel: 'palsu', face: { head: 'kotak', hair: 'cepak', baju: 'almamater' } }], kata: '“Ayo, cepat, barisan sudah jalan.”', jawab: '“Ekonomi 96. Kenal Asep, kok.”', kebenaran: 'intel. Stempelnya palsu dan sepatunya lars.' + (penyusupAktif() ? ' Gelangnya benar, padahal warna itu baru kalian putuskan dua hari lalu.' : '') },
        { id: 'tetangga', nama: 'Yohanes', sah: true, sepatu: 'sneakers', face: { head: 'bulat', hair: 'keriting', baju: 'kaus' }, gelang: null, docs: [{ type: 'ktm', nama: 'Yohanes Pardede', nim: '95.04.0311', fak: 'FISIP', ang: '1995', face: { head: 'bulat', hair: 'keriting', baju: 'kaus' } }], kata: '“Saya dari kampus tetangga. Kami mau bergabung.”', jawab: '“Gelang? Kami tidak dikabari warnanya.”', salahTolak: 'Ia datang membawa dua puluh kawan dari kampusnya, dan semuanya pulang.', opsi: () => aktif('mei') ? [{ v: 'jamin', t: 'Minta Mei menjamin' }] : [] },
        { id: 'pers', nama: 'Sarah Whitfield', sah: true, sepatu: 'sneakers', face: { head: 'oval', hair: 'bob', baju: 'kaus' }, gelang: null, docs: [{ type: 'pers', nama: 'Sarah Whitfield', media: 'Agence Internasional', no: 'PRS-0457', stempel: true, face: { head: 'oval', hair: 'bob', baju: 'kaus' } }], kata: '“I am a journalist. Can I walk with you?”', jawab: '“Saya bisa sedikit bahasa Indonesia. Saya mau lihat sendiri.”', salahTolak: 'Tidak ada wartawan asing yang meliput aksi kalian.' },
        mhs('m3', 'Fajar Nugraha', C.mhs3, { gelang: null, kata: '“Gelangku jatuh di angkot. Sumpah, aku anak sini.”' }),
        mhs('m4', 'Dewi Anggraini', { head: 'oval', hair: 'kerudung', baju: 'almamater' })
      ];
      // makin terbuka cara mengajak, makin banyak orang asing ikut antre
      const p = (AJAK[s.f.ajak] || AJAK.poster).susup * (1 + kal(s, 'mhs'));
      for (const [id, nama, fak] of [['susup1', 'Bambang Sutrisno', 'Teknik'], ['susup2', 'Agus Salim', 'Hukum']]) if (Math.random() < p) {
        const f = { head: 'kotak', hair: 'cepak', baju: 'almamater' };
        list.splice(1 + randInt(list.length), 0, { id, nama, sah: false, sepatu: pick(['lars', 'pantofel']), face: f, gelang: pick(lain), docs: [{ type: 'ktm', nama, nim: '96.0' + (fak === 'Teknik' ? 2 : 1) + '.0' + (300 + randInt(600)), fak, ang: '1996', stempel: 'palsu', face: f }], kata: '“Saya dengar dari pengumuman. Boleh ikut, kan?”', jawab: '“Angkatan 96. Kenalnya sama anak-anak lain, lupa namanya.”', kebenaran: 'orang asing. Stempelnya palsu dan gelangnya salah warna.' });
      }
      return list;
    },
    evaluate: (s, kep, list) => {
      const { fx, lines } = nilaiStandar(kep, list, (t, fx, lines) => {
        if (t.id === 'prov') { s.f.provokatorLolos = true; lines.push('Laki-laki dengan jeriken itu lolos masuk barisan.'); }
        if (t.id === 'intel') { fx.sorotan = (fx.sorotan || 0) + 10; lines.push('Gunawan lolos. Namanya tidak ada di kampus mana pun.'); }
        if (t.id.startsWith('susup')) { s.f.susupLolos++; lines.push(`${t.nama} lolos masuk barisan. Tidak ada yang mengenalnya.`); }
      });
      if (kep.pers !== 'tolak') fx.tekanan = 5;
      if (kep.tetangga === 'jamin') { fx.massa += 6; lines.push('Mei menjamin Yohanes. Dua puluh mahasiswa kampus tetangga bergabung.'); }
      if (!lines.length) lines.push('Barisan berangkat bersih.');
      return { fx, note: lines, go: 'b9_jalan' };
    }
  },
  b9_jalan: {
    mode: 'rounds', bab: 9, judul: 'Barisan Tameng', waktu: 'awal Maret 1998', scene: 'jalan', spanduk: 'TOLAK SIDANG UMUM', alt: 'Barisan tameng di depan barisan mahasiswa',
    enter: s => { const r = efekRute(s); s.f.ruteCatatan = r.note; return r.fx; },
    text: s => (s.f.ruteJauh ? ['Barisanmu bergerak keluar gerbang.', ...(s.f.ruteCatatan || []), 'Lima puluh meter di depan, barisan tameng berjajar menutup jalan.'] : [s.f.bentuk === 'kamuflase' ? 'Aksi dimulai sebagai bazar sembako murah di halaman kampus. Spanduk baru dibentangkan setengah jam kemudian. Aparat yang berjaga di gerbang tidak tahu harus berbuat apa.' : s.f.bentuk === 'mimbar' || s.f.bentuk === 'delegasi' ? 'Aksi dimulai di halaman kampus. Aparat berjaga di luar gerbang.' : 'Barisanmu bergerak. Lima puluh meter di depan, barisan tameng berjajar menutup jalan.']).concat(s.f.dosenIkut ? ['Pak Harsono berdiri di barisan depan dengan jas dan dasinya. Komandan lapangan memandanginya agak lama.'] : [], kal(s, 'ibu') >= 0.5 ? ['Ibu-ibu pasar berdiri di pinggir barisan dengan termos dan bakul nasi.'] : [], kal(s, 'petani') >= 0.5 ? ['Dua truk petani datang dari pinggir kota, cangkul diikat di bak truk.'] : []),
    hots: { tameng: { label: 'Barisan tameng', text: 'Helm, tameng rotan, dan pentungan. Wajah-wajah di baliknya masih muda, seumuran kalian.' }, spanduk: { label: 'Spanduk', text: 'Spanduk kain yang dicat semalaman. Catnya belum benar-benar kering.' } },
    marah: s => marahAwal(s),
    rounds: [
      { text: 'Komandan lapangan berteriak lewat pengeras suara: “Bubar! Ini perintah!”', options: [
        { t: 'Orasi: bacakan tuntutan keras-keras', kata: 'orasi', fx: s => s.m.kataOk ? { pengaruh: 5, sorotan: 5, massa: kutipan() ? 6 : 4 } : { pengaruh: 1, sorotan: 5 }, marah: s => s.m.kataOk ? 5 : 12, note: s => s.m.kataOk ? (kutipan() ? 'Kamu mengutip buku yang kamu baca di sekretariat. Barisan di belakang bersorak.' : 'Barisan paling belakang mengulang tuntutanmu.') : 'Barisan di belakang saling pandang. Komandan tersenyum tipis.' },
        { t: 'Negosiasi dengan komandan', kel: 'Hadapi aparat secara langsung', kata: 'nego', fx: s => s.m.kataOk ? { yudi: 1, pengaruh: 3 } : { nyali: -3 }, marah: s => s.m.kataOk ? -(15 + 3 * paham('p4')) : 10, note: s => s.m.kataOk ? 'Komandan memberi waktu sampai pukul tiga. Setelah itu, katanya, ia tidak bertanggung jawab.' : 'Komandan memotong kalimatmu dan berbalik ke pasukannya.' },
        { t: 'Perintahkan massa duduk', marah: -10, fx: { fikri: 1, ricuh: -1 }, note: 'Ratusan orang duduk di aspal. Barisan tameng berhenti maju.' },
        { t: 'Bagikan bunga kepada barisan tameng', kel: 'Hadapi aparat secara langsung', req: s => s.nyali >= 40, marah: -25, fx: { kuasa: -2, fikri: 1, damar: -1, tekanan: 3 }, note: 'Kamu berjalan sendirian ke barisan tameng dan menyelipkan setangkai bunga di sela tameng. Seorang prajurit muda menunduk. Di belakangmu, anak-anak Damar menyebutmu lembek.' },
        { t: 'Maju selangkah demi selangkah', marah: 20, fx: { damar: 1, ricuh: 1, sorotan: 5 }, note: 'Jarak menyempit. Kamu bisa melihat nomor di helm prajurit paling depan.' }] },
      { text: s => s.f.provokatorLolos ? 'Sebuah botol melayang dari belakang barisan dan pecah di depan tameng. Bau bensin menyebar.' : pick(['Hujan turun deras. Spanduk basah dan berat.', 'Wartawan berdatangan dengan kamera besar.']), options: [
        { t: 'Duduk dan tahan barisan, jangan membalas', marah: s => s.f.provokatorLolos ? 10 : -5, fx: s => ({ ricuh: s.f.provokatorLolos ? 0 : -1, massa: (s.siap.air || 0) >= 0.8 ? 6 : 2, nyali: -5 }), note: s => ((s.siap.air || 0) >= 0.8 ? 'Air minum cukup. Barisan bertahan lama di bawah terik.' : 'Air minum habis sebelum siang. Beberapa peserta pingsan.') + (s.f.pos && s.f.pos.tali ? ' Tali massa menahan barisan tetap rapat.' : '') },
        { t: 'Mundur teratur ke kampus', marah: -15, fx: { ricuh: -1, sorotan: -5, massa: -3, ratna: 1 }, note: s => (s.siap.toa || 0) >= 0.8 ? 'Komando lewat toa terdengar jelas. Barisan mundur ruas demi ruas.' : 'Tanpa toa, perintahmu tidak terdengar sampai belakang. Barisan pecah menjadi kelompok-kelompok kecil.' },
        { t: 'Dorong maju', marah: 30, fx: s => ({ massa: 8, nyali: 8, sorotan: 12, ricuh: s.f.pos && s.f.pos.tali ? 1 : 2, damar: 1 }), note: 'Tameng dan barisan bertemu. Dorong-dorongan, teriakan, lalu pentungan.' },
        { t: 'Cari komandan dan minta waktu', kata: 'nego', fx: s => s.m.kataOk ? { pengaruh: 5, yudi: 1 } : {}, marah: s => s.m.kataOk ? -(15 + 3 * paham('p4')) : 10, note: s => s.m.kataOk ? 'Komandan mau menahan pasukannya kalau kalian bubar pukul lima.' : 'Komandan tidak mau mendengar. Barisan tameng merapat.' }] },
      { text: 'Gas air mata ditembakkan. Asap putih menutup jalan, dan barisan tameng mulai memukul mundur.', options: [
        { t: 'Evakuasi lewat jalur yang sudah disiapkan', marah: -10, fx: s => ({ ricuh: -1, nyali: (s.siap.odol || 0) >= 0.8 ? -3 : lewat(s, 'rs') ? -6 : -10 }), note: s => ((s.siap.odol || 0) >= 0.8 ? 'Odol dan kain basah dibagikan cepat. Mata perih, tapi semua bisa berjalan.' : 'Tanpa odol dan kain basah, kawan-kawan berjalan sambil menangis dan batuk.') + (lewat(s, 'rs') ? ' Rumah sakit di rutemu menampung yang sesak napas.' : '') + (s.f.pos && s.f.pos.medis ? ' Tim medis menangani yang terluka di halaman kampus.' : '') },
        { t: 'Bertahan di tempat', marah: 15, fx: s => ({ massa: 5, ricuh: 1, nyali: (s.siap.odol || 0) >= 0.8 ? -6 : -15, sorotan: 8 }), note: 'Kamu bertahan sampai napasmu sesak. Empat kawan dibawa ke rumah sakit.' },
        { t: 'Bubar lewat kampung, minta warga membuka pintu', marah: -15, req: s => s.f.dapurUmum || s.massa >= 50 || lewat(s, 'kampung') > 0, fx: { ricuh: -1, massa: 5 }, note: 'Pak RT dan warga membuka pintu-pintu rumah. Barisanmu menghilang di gang-gang kecil.' }] }
    ],
    done: s => {
      const note = marahAkhir(s), fx = {}, ricuh = s.ricuh >= 3 || s.f.provokatorLolos;
      if (s.f.aksiBocor) { fx.ricuh = 1; fx.massa = -8; fx.kuasa = (fx.kuasa || 0) + 4; note.push('Aparat sudah menunggu di rute yang kalian rahasiakan. Separuh barisan tertahan sebelum sempat bergabung.'); }
      const isu = isuFx(s.f.isuAksi, 10); fx.kuasa = (fx.kuasa || 0) + isu.fx.kuasa - 3 * ['ibu', 'petani', 'mhs'].filter(g => kal(s, g) >= 0.5).length; delete isu.fx.kuasa; Object.assign(fx, isu.fx); note.push(isu.note);
      if (cocokIsu(s) < 1) { fx.massa = (fx.massa || 0) - 5; note.push('Isu yang kamu angkat tidak bicara kepada orang-orang yang datang. Barisan menipis sebelum siang.'); }
      if ((ricuh || s.m.marah >= 80) && kal(s, 'petani') >= 0.5) { s.f.petaniDitangkap = true; note.push('Petani yang datang dengan truk paling dulu ditangkap. Mereka tidak punya kartu mahasiswa untuk ditunjukkan.'); }
      if (ricuh) { s.f.judulKoran = 'Aksi Mahasiswa Berakhir Ricuh, Puluhan Diamankan'; fx.cap = 2; fx.kuasa += 6; fx.massa = (fx.massa || 0) - 8; if (s.pengaruh >= 35) fx.bapak = -1; }
      else if (s.f.pos && s.f.pos.humas) { s.f.judulKoran = 'Mahasiswa Duduk, Aparat Memukul'; fx.massa = (fx.massa || 0) + 6; fx.kuasa -= 3; s.cap = 0; }
      else s.f.judulKoran = 'Ribuan Mahasiswa Tolak Sidang Umum';
      s.f.namaDiKoran = (s.f.namaDiKoran || 0) + (s.pengaruh >= 35 ? 1 : 0);
      fx.iklim = 8;
      return { fx, note, go: 'b9_koran' };
    }
  },
  b9_koran: {
    bab: 9, judul: 'Koran Esok Hari', waktu: 'awal Maret 1998', scene: 'koran', alt: 'Halaman depan koran esok hari',
    text: s => [`Pagi berikutnya, Laras membawa koran ke sekretariat. Judulnya: “${s.f.judulKoran}”.`, s.f.judulKoran.includes('Ricuh') ? 'Ibu kos menatapmu lama saat kamu lewat di ruang tamu.' : 'Seseorang menempel kliping itu di dinding sekretariat.', ...(s.f.dosenIkut ? ['Seminggu kemudian, Pak Harsono dipanggil rektorat. Ia tetap mengajar, tapi namanya dicoret dari daftar penguji.'] : [])],
    hots: { judul: { label: 'Judul', text: s => s.f.judulKoran }, foto: { label: 'Foto', text: 'Foto barisan mahasiswa dari atas. Kamu mencari wajahmu sendiri, dan menemukannya di pojok kiri.' } },
    choices: [{ t: 'Gunting klipingnya dan simpan', go: 'b10_kamar' }]
  },

  b10_kamar: {
    bab: 10, judul: 'Kamar yang Diacak', waktu: 'pertengahan Maret 1998', bulan: '1998-03', scene: 'kamarDamar', enter: { nyali: -10, damarHilang: true }, alt: 'Kamar Bang Damar yang diacak',
    text: s => ['Pada 10 Maret, MPR memilih Presiden untuk ketujuh kalinya. Tiga hari kemudian, Bang Damar tidak pulang.' + (genderKu() === 'L' ? ' Semua nama yang hilang bulan ini milik laki-laki muda seusiamu.' : ''), 'Kamar kosnya diacak. Kamu berdiri di ambang pintu dengan senter kecil. Kamu boleh membawa paling banyak tiga barang sebagai bukti.'],
    kabar: s => [kabar('damar', 'laras'), kabar('damar', 'damar'), kabar('damar', 'warung')],
    hots: {
      rak: { label: 'Rak buku kosong', text: 'Semua buku Damar hilang, termasuk yang legal. Ada tanda terima penyitaan yang tertinggal, tanpa kop dan tanpa tanda tangan.', act: ambil('rak') },
      lantai: { label: 'Lantai berdebu', text: 'Bekas sepatu lars, besar, lebih dari satu pasang. Di alurnya menempel tanah merah, bukan lumpur jalanan kota.', act: ambil('lantai') },
      asbak: { label: 'Asbak', text: 'Puntung rokok putih berfilter, merek yang dijatah di kantin asrama tentara. Damar hanya merokok kretek.', act: ambil('asbak') },
      kalender: { label: 'Kalender', text: s => 'Tanggal 13 Maret dilingkari: “rapat jam 7”. Hanya lima orang yang tahu jadwal itu.' + (penyusupAktif() ? ` Salah satunya ${KADER[s.penyusup].nama}.` : '') },
      ubin: { label: 'Ubin lepas', text: 'Di bawahnya ada buku catatan kecil berisi kontak jaringan Damar di banyak kota. Halaman terakhirnya disobek rapi, seperti oleh Damar sendiri.', act: { t: 'Ambil buku catatannya', req: s => !s.bukti.includes('catatanDamar'), fx: { bukti: 'catatanDamar' }, note: 'Kamu menyelipkan buku catatan itu di balik bajumu. Kalau tertangkap, buku ini berbahaya.' } },
      ibukos: { label: 'Ibu kos', text: '“Kijang hijau tanpa pelat, Nak. Jam satu pagi. Belok kanan di ujung gang, ke arah tol luar kota.”', act: ambil('ibukos') }
    },
    choices: [
      { t: 'Ikuti arah yang ditunjuk bukti-buktimu', req: s => !!simpulanDamar(s), run: s => { s.f.simpulanDamar = simpulanDamar(s); s.f.damarBenar = s.f.simpulanDamar === 'kompleks'; }, fx: s => simpulanDamar(s) === 'kompleks' ? { bukti: 'saksi', pengaruh: 5 } : { massa: -8, pengaruh: -5, sorotan: 5, nyali: -5 }, go: 'b10_putus', note: s => s.f.damarBenar ? `Bukti-buktimu bertemu di satu titik: ${SIMPULAN.kompleks}. Seorang tukang ojek di sana membenarkan ada Kijang hijau yang masuk tengah malam. LBH mencatat kesaksiannya.` : `Kamu mengerahkan kawan-kawan ke ${SIMPULAN[s.f.simpulanDamar]}. Tidak ada jejak Damar di sana. Kawan-kawan pulang dengan muka masam, dan sebagian berhenti mempercayai penilaianmu.` },
      { t: 'Telusuri kabar dari Laras', req: s => s.ui.kabar && s.ui.kabar.at(0), run: s => { s.ui.tmp = s.ui.kabar.at(0).ok; }, fx: s => s.ui.kabar.at(0).ok ? { bukti: 'saksi' } : { sorotan: 8, nyali: -5 }, go: 'b10_putus', note: s => s.ui.tmp ? 'Jejaknya benar. Seorang tukang ojek melihat mobil itu masuk kompleks berpagar tinggi.' : 'Jejaknya salah. Kamu menghabiskan sehari bertanya ke tempat yang salah, dan seseorang mulai menanyaimu balik.' },
      { t: 'Telusuri kabar dari anak-anak Damar', run: s => { s.ui.tmp = s.ui.kabar.at(1).ok; }, fx: s => s.ui.kabar.at(1).ok ? { bukti: 'saksi' } : { sorotan: 10, nyali: -5 }, go: 'b10_putus', note: s => s.ui.tmp ? 'Jejaknya benar. Ada saksi yang mau bicara ke LBH.' : 'Jejaknya salah. Anak-anak Damar malah ribut dengan petugas jaga.' },
      { t: 'Jangan buang waktu mengejar kabar', go: 'b10_putus' }
    ]
  },
  b10_putus: {
    bab: 10, judul: 'Kamar yang Diacak', waktu: 'pertengahan Maret 1998', scene: 'kamarDamar', alt: 'Kamar Bang Damar',
    text: s => [`Kamu membawa ${s.f.buktiDamar || 0} bukti dari kamar itu. Kak Ratna mendesak kalian membawa kasus ini ke publik. Mas Yudi mendesak menunggu.`],
    choices: [
      { t: 'Bawa ke publik: konferensi pers, LBH, posko pengaduan', fx: s => ({ kuasa: -3, sorotan: 20, massa: 10 + 5 * (s.f.buktiDamar || 0), pengaruh: 10, ratna: 1, yudi: -1, damarPublik: true }), run: s => { s.f.namaDiKoran = (s.f.namaDiKoran || 0) + 1; }, go: 'b10_panggilan', note: 'Nama Bang Damar masuk koran, dan namamu juga. Kamu tahu yang kedua berbahaya. Yang pertama mungkin menyelamatkan nyawanya.' },
      { t: 'Doa bersama dan mimbar duka di masjid kampus', fx: { kuasa: -2, massa: 12, sorotan: 8, nyali: 5, fikri: 1, damarPublik: true }, go: 'b10_panggilan', note: 'Ribuan lilin menyala di pelataran masjid. Wartawan datang meski tidak diundang. Foto Bang Damar dipajang di tangga.' },
      { t: 'Cari diam-diam lewat jaringan', fx: { kuasa: -1, sorotan: 3, nyali: -8, pengaruh: 3 }, go: 'b10_panggilan', note: 'Jaringanmu menemukan jejak sampai sebuah kompleks berpagar tinggi di pinggir kota. Setelah itu jejaknya putus.' },
      { t: 'Dampingi keluarga Damar melapor orang hilang', kel: 'Lewat jalur resmi', d: 'ke polisi, LBH, dan Komnas HAM', fx: { kuasa: -3, sorotan: 12, massa: 6, ratna: 1, damarLapor: true }, go: 'b10_panggilan', note: 'Petugas jaga menulis laporan dengan malas. Di LBH, berkasnya dibuat rangkap tiga. Di Komnas HAM, ibu Bang Damar menandatangani formulir dengan tangan gemetar. Namamu tercatat sebagai pendamping.' },
      { t: 'Minta Mas Yudi bertanya ke kenalannya di Kodam', kel: 'Lewat jalur resmi', fx: { sorotan: -5, massa: -8, yudi: 1, ratna: -1 }, go: 'b10_panggilan', note: 'Jawabannya sopan dan kosong: “Tidak ada data yang bersangkutan.” Mas Yudi menyarankan kalian menunggu.' }
    ]
  },
  b10_panggilan: {
    bab: 10, judul: 'Surat Panggilan', waktu: 'akhir Maret 1998', scene: 'kos', kalender: 'Maret 1998', alt: 'Amplop cokelat di bawah pintu kamar kos',
    enter: s => { s.f.sebabBuron = sebabBuron(s); return {}; },
    text: s => ['Ibu kos menyelipkan amplop cokelat di bawah pintumu. Surat panggilan dari Polda Metro Jaya: kamu diminta datang sebagai saksi, lusa pukul sembilan.', SEBAB[s.f.sebabBuron](s), s.sorotan >= 50 ? 'Suratnya diketik rapi dan ditandatangani langsung oleh seorang perwira menengah. Ini bukan panggilan biasa.' : 'Suratnya stensilan, dengan namamu diketik belakangan di titik-titik.'],
    hots: { bukutamu: { label: 'Buku tamu kos', text: 'Halaman yang memuat nama tamu-tamumu bulan ini disobek rapi.' }, surat: { label: 'Surat panggilan', text: 'Pasal yang disebut: penyebaran kebencian terhadap pemerintah. Kata “saksi” diketik dengan huruf lebih kecil.' } },
    choices: [
      { t: 'Datang sendiri', run: s => { s.f.ditahanPanggilan = s.sorotan >= 50; if (s.f.ditahanPanggilan) s.f.kembaliKe = 'kos7'; }, fx: s => s.sorotan >= 50 ? {} : { sorotan: -10 }, go: s => s.f.ditahanPanggilan ? 'periksa' : 'kos7', note: s => s.f.ditahanPanggilan ? 'Kamu datang sebagai saksi. Satu jam kemudian, statusmu diubah tanpa penjelasan.' : 'Kamu ditanya enam jam soal kawan-kawanmu, lalu dilepas dengan pesan: “Kami masih akan bertemu.”' },
      { t: 'Datang didampingi pengacara LBH', req: s => aktif('tigor') || s.ratna >= 3, fx: { namaResmi: true, jejak: 10, sorotan: -5 }, go: 'kos7', note: s => (aktif('tigor') ? 'Tigor duduk di sebelahmu dan mengutip KUHAP setiap kali pertanyaannya melenceng.' : 'Pengacara LBH kenalan Kak Ratna duduk di sebelahmu.') + ' Kamu pulang sore itu, tapi namamu sekarang resmi tercatat dalam berkas mereka.' },
      { t: 'Tidak datang dan bersiap menghilang', fx: { dpoResmi: true, jejak: 15 }, go: 'kos7', note: 'Kamu tidak datang. Dua hari kemudian, statusmu berubah menjadi buron. Setidaknya kamu sempat menyiapkan tas dan uang.' }
    ]
  },
  kos7: kosNode({ bab: 'Antara bab 10 dan 11', waktu: 'Maret 1998', dari: '1998-02', bulan: '1998-03', kalender: 'Maret 1998', next: 'b11_razia', enter: { iklim: 5 }, text: s => [...KOS_TEXT(s), 'Koran di meja ibu kos memuat susunan kabinet baru yang dilantik 14 Maret. Di dalamnya ada pengusaha kroni Presiden dan putri sulungnya sendiri. Di warung, orang-orang tertawa getir.'] }),

  b11_razia: {
    mode: 'razia', bab: 11, judul: 'Razia', waktu: 'akhir Maret 1998 · pukul 23.40', bulan: '1998-03', scene: 'sekre', v: 'razia', alt: 'Sekretariat malam, mesin stensil berputar',
    text: s => ['Kamu sedang mencetak selebaran ketika suara truk terdengar di luar. ' + (s.yudi >= 3 ? 'Pager-mu berbunyi setengah jam lalu: TAMU DATANG JAM 12. Y.' : s.f.dapurUmum ? 'Anak Pak RT berlari ke sekretariat: “Banyak orang berseragam di mulut gang!”' : 'Tidak ada yang memperingatkanmu.'),
      ...(yosAda(s) ? ['Bang Yos mengetuk jendela belakang. “Tiga truk. Aku tahan mereka di tangga selama aku bisa.”'] : []),
      ...(s.f.hendraKenal ? ['Dari jendela, kamu melihat laki-laki berambut cepak turun paling dulu dari truk. Kamu pernah melihat wajah itu di ambang pintu sekretariat, di atas KTM yang fotonya tidak cocok.'] : []),
      'Kamu hanya punya waktu untuk beberapa tindakan sebelum pintu digedor.'],
    budget: s => 3 + (s.yudi >= 3 ? 2 : 0) + (yosAda(s) ? 1 : 0) - (s.f.intelMasuk ? 1 : 0) + (s.f.dpoResmi ? 1 : 0) + (s.f.kurirSiap ? 1 : 0),
    detik: s => 18 + (s.yudi >= 3 ? 6 : 0) + (yosAda(s) ? 4 : 0) + (s.f.dpoResmi ? 4 : 0) + (s.f.kurirSiap ? 4 : 0) - (s.f.intelMasuk ? 4 : 0),
    options: [
      { kel: 'Sembunyikan barang', id: 'plafon', t: s => `Dorong ${isiMap(s)} ke atas plafon`, d: 'celah di balik balok kayu', req: belumDiurus, run: s => { const isi = cap(isiMap(s)); sembunyikanMap(s, 'plafon'); return `${isi} kamu dorong ke atas plafon, di balik balok kayu.`; } },
      { kel: 'Sembunyikan barang', id: 'karung', t: s => `Benamkan ${isiMap(s)} di karung beras`, d: 'cepat, tapi karungnya di dapur', req: belumDiurus, run: s => { const isi = cap(isiMap(s)); if (Math.random() < 0.5) { sembunyikanMap(s, 'karung'); return `${isi} kamu benamkan dalam-dalam di karung beras.`; } s.f.dokDitemukan = true; return `${isi} kamu benamkan di karung beras, tapi ujung mapnya masih mencuat.`; } },
      { kel: 'Sembunyikan barang', id: 'bawa', t: 'Masukkan map bukti ke tasmu', d: 'di bawah baju ganti', req: s => s.bukti.length > 0 && belumDiurus(s), fx: { bawaBukti: true }, note: s => `${s.bukti.length} bukti kamu selipkan di bawah baju ganti di tasmu.` },
      { id: 'bakar', t: 'Bakar daftar anggota', d: 'di bak mandi', req: s => !s.f.dokAman, fx: { daftarDibakar: true }, note: 'Kertas-kertas itu kamu bakar di bak mandi. Asapnya membuat matamu perih.' },
      { kel: 'Sembunyikan barang', id: 'stensil', t: 'Sembunyikan mesin stensil', d: 'digotong ke kamar mandi', fx: { stensilAman: true }, note: 'Kamu dan seorang kawan menggotong mesin stensil ke kamar mandi dan menutupinya dengan tikar.' },
      { kel: 'Sembunyikan barang', id: 'buku', t: 'Sembunyikan buku terlarang', d: 'diselipkan di balik lemari', req: s => s.buku.dikos.length > 0, fx: { bukuDititip: true }, run: s => { s.buku.dikos = []; return 'Buku-buku terlarang kamu selipkan di balik lemari.'; } },
      ...Object.keys(KADER).map(k => ({ id: 'kabur_' + k, kel: 'Selamatkan kawan', t: `Suruh ${KADER[k].nama} kabur lewat jendela belakang`, req: s => aktif(k), run: s => { s.f['lolos_' + k] = true; return `${KADER[k].nama} melompat jendela dan menghilang di gang.`; } }))
    ],
    after: s => {
      const note = [], fx = {};
      const hadir = kaderAktif().slice(0, 2);
      for (const k of hadir) if (!s.f['lolos_' + k]) { s.kader[k] = 'ditangkap'; note.push(`${KADER[k].nama} tertangkap di dalam sekretariat.`); }
      if (!s.f.bukuDititip && s.buku.dikos.length) { fx.sorotan = 10 * s.buku.dikos.length; note.push('Di kosmu, aparat menyita buku-buku terlarang.'); }
      if (!s.f.stensilAman) { fx.sorotan = (fx.sorotan || 0) + 5; note.push('Mesin stensil disita. Selebaran-selebaran lama bisa dilacak ke sini.'); }
      if (!s.f.dokAman && !s.f.daftarDibakar) { s.f.daftarDisita = true; fx.massa = -5; const ks = kaderAktif(), kena = s.f.alamatSamaran ? ks.slice(0, Math.ceil(ks.length / 2)) : ks; for (const k of kena) s.kader[k] = s.kader[k] === 'aktif' ? 'diawasi' : s.kader[k]; note.push(s.f.alamatSamaran ? 'Daftar anggota disita, tapi separuh namanya nama buah. Aparat hanya bisa mencocokkan sebagian.' : 'Daftar anggota disita. Nama-nama kadermu sekarang ada di map aparat.'); }
      if (!s.f.dokAman && !s.f.bawaBukti && s.bukti.length) { const id = sitaBukti(s.bukti); fx.sorotan = (fx.sorotan || 0) + 5; note.push(`Aparat menyita ${id.length} bukti yang kamu kumpulkan.` + (id.includes('catatanDamar') ? ' Buku catatan Damar ikut disita, dan kontak-kontaknya di banyak kota terbongkar.' : '')); }
      note.push('Pintu digedor. Kamu sudah tidak punya waktu lagi.');
      return { fx, note, go: 'b11_sembunyi' };
    }
  },
  b11_sembunyi: {
    mode: 'hide', siapa: 'kamu', rounds: 4, spots: ['plafon', 'lemari', 'bak', 'kolong', 'atap', 'warga'], bab: 11, judul: 'Sembunyi', waktu: 'akhir Maret 1998 · lewat tengah malam', scene: 'sembunyi', alt: 'Pandangan dari tempat persembunyian',
    text: ['Pintu jebol. Senter-senter menyapu ruangan. Kamu punya beberapa detik untuk memilih tempat.'],
    after: (s, ok) => { if (ok) { s.f.dariAtap = s.m.spot === 'atap'; return { note: s.m.spot === 'warga' ? 'Ibu pemilik rumah sebelah menutupimu dengan tumpukan kain jemuran. Setelah langkah-langkah itu pergi, ia membuka pintu belakang untukmu.' : 'Langkah-langkah itu menjauh. Kamu menunggu sampai suara truk menghilang, lalu keluar lewat belakang.', go: 'b11_lari' }; } s.f.kembaliKe = 'b12_buron'; const temu = s.m.spot === 'plafon' && s.f.dokAman === 'plafon'; if (temu) { sitaBukti(s.f.buktiSekre); s.f.daftarDisita = true; for (const k of kaderAktif()) if (s.kader[k] === 'aktif') s.kader[k] = 'diawasi'; } return { fx: { nyali: -5 }, note: 'Sebuah tangan menarik kerah bajumu. Matamu silau oleh senter.' + (temu ? ' Senter yang sama menemukan map yang kamu sembunyikan di plafon, lengkap dengan daftar anggota.' : ''), go: ditangkapKe(s) }; }
  },
  b11_lari: {
    mode: 'run', bab: 11, judul: 'Lari', waktu: 'akhir Maret 1998 · pukul 01.00', scene: 'gang', alt: 'Persimpangan gang di malam hari',
    text: ['Peluit berbunyi di belakangmu. Kamu berlari menyusuri gang-gang yang kamu hafal dari dapur umum dan kos-kosan kawan.'],
    after: (s, ok) => { if (ok) return { note: s.protokol.includes('safehouse') || saudara('wahyu') ? 'Kamu sampai di jalan besar. Wahyu sudah menunggu di mobil boks, mesinnya menyala.' : 'Kamu sampai di jalan besar dan menghentikan taksi pertama yang lewat.', go: 'b11_mobil' }; s.f.kembaliKe = 'b12_buron'; return { fx: { nyali: -5 }, note: 'Kamu tertangkap di ujung gang. Seseorang menutup kepalamu dengan jaket.', go: ditangkapKe(s) }; }
  },
  b11_mobil: {
    mode: 'tail', bab: 11, judul: 'Dibuntuti', waktu: 'akhir Maret 1998 · pukul 01.30', scene: 'mobil', alt: 'Pandangan dari jok belakang mobil, spion memperlihatkan lampu mobil lain',
    text: s => [`Kalian melaju menuju ${s.protokol.includes('safehouse') ? 'safehouse dekat rel kereta' : 'kos seorang kawan di Rawamangun'}. Di spion, sepasang lampu mengikuti sejak tadi.`],
    after: (s, h) => {
      if (h === 'tangkap') { s.f.kembaliKe = 'b12_buron'; return { note: 'Dua laki-laki menarikmu keluar dari mobil.', go: ditangkapKe(s) }; }
      if (h === 'lepas') return { fx: { nyali: 5 }, note: 'Kalian sampai tanpa buntut. Malam itu kamu tidur di lantai, dengan sepatu masih terpasang.', go: 'b11_tv' };
      if (h === 'buntut') { s.f.safehouseBocor = true; const k = kaderAktif().at(0); if (k) s.kader[k] = 'diawasi'; return { note: 'Kalian sampai, dan mobil itu parkir di ujung gang. Tempat ini tidak aman lagi.', go: 'b11_tv' }; }
      s.f.tanpaSafehouse = true; return { fx: { nyali: -10 }, note: 'Kamu turun di masjid dan tidur di serambinya sampai subuh.', go: 'b11_tv' };
    }
  },

  b11_tv: {
    bab: 11, judul: 'Daftar Pencarian', waktu: 'akhir Maret 1998 · pagi', scene: 'koran', alt: 'Televisi warung menayangkan foto-foto orang yang dicari',
    enter: { ibu: -1, nyali: -2 },
    text: s => ['Pagi itu kamu sarapan di warung yang jauh dari sekretariat. Televisi di atas lemari kaca menayangkan berita: aparat merilis daftar mahasiswa yang dicari karena “merencanakan makar”.', 'Foto ketiga adalah foto KTM-mu, foto yang diambil petugas di aula pada hari pertama kuliah.', SEBAB[s.f.sebabBuron || 'orasi'](s), 'Di Magelang, Ibu sedang menonton berita yang sama.'],
    hots: { tv: { label: 'Televisi', text: s => `Namamu dibacakan lengkap: ${s.nama}, Fakultas ${s.fak}. Penjual warung melirikmu, lalu kembali mengelap gelas.` }, warung: { label: 'Penjual warung', text: 'Ia memutar tombol televisi ke saluran lain tanpa berkata apa-apa.' } },
    choices: [
      { t: 'Bayar dan pergi sebelum warung ramai', go: 'b12_buron', note: 'Penjual warung menolak uangmu. “Hati-hati, Dik.”' },
      { t: 'Telepon Ibu dari wartel terdekat', fx: { ibu: 1, jejak: 5 }, go: 'b12_buron', note: s => `Ibu mengangkat pada dering pertama. Ia tidak menangis. “Makan yang teratur,” katanya. Di belakangnya, Dika bertanya, “Itu ${sapaan()}?”` }
    ]
  },
  ancaman: {
    aman: true, bab: s => tierSorotan() >= 2 ? 'Diburu' : 'Ditekan', judul: s => tierSorotan() >= 2 ? 'PENA Dibubarkan' : 'Dua Kawan Ditangkap', waktu: s => namaBulan(s.bulan), scene: 'sekre', v: 'razia', alt: 'Sekretariat yang disegel',
    enter: s => { s.f.ancamanIni = tierSorotan(); s.f.ancamanTier = s.f.ancamanIni; if (s.f.ancamanIni >= 2) { s.f.penaBubar = true; for (const k of kaderAktif()) if (s.kader[k] === 'aktif' && k !== s.penyusup) s.kader[k] = 'diawasi'; return { nyali: -6, pengaruh: -5 }; } return { nyali: -4 }; },
    text: s => s.f.ancamanIni >= 2 ? ['Rektorat dan Kodim mengumumkan PENA organisasi terlarang. Sekretariat disegel, dan nama-nama pengurusnya dibacakan di apel pagi Menwa. Semua anggota berpencar.', 'Malamnya, dua laki-laki menunggu di depan kosmu. Mereka tidak mengetuk. Mereka hanya menunggu.'] : ['Dua anggota PENA ditangkap sepulang rapat Kamis malam dan baru dilepas dua hari kemudian, dengan memar yang tidak mau mereka ceritakan.', 'Sejak itu, sebuah motor mengikutimu dari kampus ke kos setiap sore.'],
    choices: s => s.f.ancamanIni >= 2 ? [
      { t: 'Pindah tidur dari kos ke kos kawan', cost: () => harga(20000), dis: s2 => s2.uang.tunai < harga(20000), alasan: 'uangmu tidak cukup', fx: { nyali: -5, sorotan: -5 }, go: s2 => { const k = s2.f.kembaliKe; s2.f.kembaliKe = null; return k; }, note: 'Kamu tidur di lima tempat berbeda dalam dua minggu. Dua laki-laki itu akhirnya berhenti menunggu.' },
      { t: 'Minta LBH mendampingimu', req: s2 => s2.ratna >= 2 || aktif('tigor'), fx: { sorotan: -10, ratna: 1 }, go: s2 => { const k = s2.f.kembaliKe; s2.f.kembaliKe = null; return k; }, note: 'Pengacara LBH mengirim surat protes ke Kodim. Laki-laki di depan kos menghilang, untuk sementara.' },
      { t: 'Tetap tidur di kos', run: s2 => { s2.f.ancamanTangkap = true; }, go: 'periksa', note: 'Pukul tiga pagi pintumu diketuk. Kali ini mereka masuk.' }
    ] : [
      { t: 'Dampingi kedua kawan itu ke LBH', fx: { ratna: 1, sorotan: 3, massa: 4 }, go: s2 => { const k = s2.f.kembaliKe; s2.f.kembaliKe = null; return k; }, note: 'Pengacara LBH mencatat setiap memar. Kedua kawan itu kembali ke rapat minggu berikutnya.' },
      { t: 'Turunkan suaramu untuk sementara', fx: { kuasa: 2, sorotan: -10, pengaruh: -5 }, go: s2 => { const k = s2.f.kembaliKe; s2.f.kembaliKe = null; return k; }, note: 'Kamu berhenti berorasi dua bulan. Motor itu jarang muncul lagi.' },
      { t: 'Ajak kawan-kawan berjaga bergiliran di sekretariat', fx: { kuasa: -1, massa: 3, nyali: 3, sorotan: 3, damar: 1 }, go: s2 => { const k = s2.f.kembaliKe; s2.f.kembaliKe = null; return k; }, note: 'Setiap malam tiga orang tidur di sekretariat. Tidak ada lagi yang ditangkap sepulang rapat.' }
    ]
  },
  kader_cerita: {
    aman: true, bab: 'Kawan', judul: s => KADER[ceritaIni(s).k].nama, waktu: s => namaBulan(s.bulan), scene: 'sekre', v: 'kamis', alt: 'Sudut sekretariat di malam hari',
    enter: s => { s.f.ceritaIni = s.f.ceritaAntre.shift(); return {}; },
    text: s => { const { k, t } = ceritaIni(s); return [CERITA[k][t][0]].concat(t === 1 && k === s.penyusup && penyusupAktif() ? ['Cerita tentang keluarganya berbeda dari yang ia ceritakan bulan lalu. Waktu itu katanya adiknya di Bekasi. Sekarang di Bogor.'] : []); },
    choices: s => { const { k, t } = ceritaIni(s), c = CERITA[k][t]; const ke = s2 => k === s2.penyusup && t === 2 && penyusupAktif() ? 'penyusup_aku' : (() => { const x = s2.f.kembaliKe; s2.f.kembaliKe = null; return x; })(); return [c[1], c[2]].map(([tt, fx, note]) => ({ t: tt, fx, note, go: ke })); }
  },
  penyusup_aku: {
    aman: true, bab: 'Kawan', judul: 'Pengakuan', waktu: s => namaBulan(s.bulan), scene: 'kos', v: 'malam', alt: 'Kamar kos tengah malam',
    text: s => [`Tengah malam, ${KADER[s.penyusup].nama} duduk di lantai kamarmu dan tidak berani menatapmu. “Aku yang membocorkan semuanya. Jadwal, gelang, alamat. Mereka memegang adikku.”`, 'Ia menyodorkan pager pemberian mereka. “Lakukan apa saja padaku.”'],
    choices: [
      { t: 'Bawa ia ke presidium', fx: { penyusupKetahuan: true, massa: 5, sorotan: -10 }, run: s => { s.kader[s.penyusup] = 'keluar'; }, go: s => { const k = s.f.kembaliKe; s.f.kembaliKe = null; return k; }, note: 'Presidium mendengarkan sampai subuh. Ia keluar dari gerakan malam itu, dan semua kode diganti.' },
      { t: 'Jadikan ia agen ganda: titipkan kabar palsu untuk mereka', fx: { agenGanda: true, agenSisa: 3 }, go: s => { const k = s.f.kembaliKe; s.f.kembaliKe = null; return k; }, note: 'Mulai minggu depan, setiap kabar yang ia bawa ke mereka kamu tulis sendiri. Kalian berdua tahu ini tidak akan bertahan lama.' },
      { t: 'Lindungi ia diam-diam', fx: { penyusupLindung: true }, run: s => tambahDekat(s.penyusup, 1), go: s => { const k = s.f.kembaliKe; s.f.kembaliKe = null; return k; }, note: 'Kamu tidak memberi tahu siapa pun. Ia tetap melapor, tapi ia tidak pernah lagi menyebut namamu.' }
    ]
  },
  teror: {
    aman: true, bab: 'Keluarga', judul: 'Mereka Datang ke Rumah', waktu: s => namaBulan(s.bulan), scene: 'rumah', alt: 'Rumah keluarga di Magelang',
    enter: s => {
      const t = TEROR[s.f.teror || 0];
      s.f.teror = (s.f.teror || 0) + 1; s.f.terorIni = t.id; s.f.terorBulan = (NODES[s.f.kembaliKe] && NODES[s.f.kembaliKe].bulan) || s.bulan; s.f.terorDicegah = !!s.f.dikawal; s.f.dikawal = false;
      if (s.f.terorDicegah) return {};
      s.f.terorKena = (s.f.terorKena || []).concat(t.judul);
      return val(t.fx);
    },
    text: s => s.f.terorDicegah ? ['Orang-orang itu datang lagi ke rumah di Magelang. Kali ini pengacara LBH dan wartawan sudah berjaga di teras. Mereka pergi tanpa turun dari mobil.']
      : [terorIni(s).teks(s), s.f.terorBuron ? 'Mereka tidak bisa menemukanmu, jadi mereka mendatangi orang-orang yang kamu sayangi.' : 'Mereka belum menyentuhmu. Mereka menyentuh orang-orang yang kamu sayangi lebih dulu, karena suaramu terdengar terlalu keras.'],
    choices: s => s.f.terorDicegah ? [{ t: 'Kembali bekerja', go: kembali }] : [
      { t: 'Ungsikan Ibu dan Dika ke rumah Bude di Purworejo', d: () => `${rp(harga(60000))} · rumah Bude jauh dari Magelang`, cost: () => harga(60000), dis: s2 => s2.uang.tunai < harga(60000), alasan: 'uangmu tidak cukup', fx: { keluargaAman: true, dika: -1, ibu: 1 }, go: kembali, note: 'Ibu mengemas dua tas malam itu juga. Dika pindah sekolah di tengah semester dan tidak mau bicara denganmu selama seminggu. Tapi rumah Bude jauh dari jangkauan mereka.' },
      { t: 'Kurangi suaramu untuk sementara', d: 'berhenti naik panggung untuk sementara', req: s2 => !s2.f.terorBuron, fx: { kuasa: 2, sorotan: -20, pengaruh: -10 }, go: kembali, note: 'Kamu berhenti naik panggung dan menyerahkan orasi ke kawan lain. Beberapa orang menganggapmu takut. Laki-laki di warung depan rumah mulai jarang datang.' },
      { t: 'Minta LBH dan wartawan menjaga rumah', d: 'pengacara dan wartawan berjaga di teras', req: s2 => !s2.f.dikawal && (aktif('laras') || s2.f.damarPublik || s2.ratna >= 3), fx: { dikawal: true, sorotan: 5, tekanan: 5 }, go: kembali, note: 'Pengacara LBH dan dua wartawan bergantian berjaga di teras. Ibu menyuguhi mereka teh setiap sore.' },
      { t: 'Serahkan diri agar keluargamu dilepas', d: 'telepon nomor yang mereka tinggalkan', req: s2 => s2.f.terorBuron, fx: { keluargaAman: true, tertangkapBuron: true }, run: s2 => { s2.f.terorBuron = false; s2.jejak = 60; }, go: 'periksa', note: 'Kamu menelepon nomor yang mereka tinggalkan di rumah. Dua jam kemudian, sebuah mobil menjemputmu di depan wartel.' },
      { t: 'Abaikan. Gerakan lebih penting', d: 'kembali ke rapat', fx: s2 => ({ [terorIni(s2).kena]: -1, nyali: -3 }), go: kembali, note: 'Kamu menutup telepon dan kembali ke rapat. Malam itu kamu tidak bisa tidur.' }
    ]
  },
  periksa: { mode: 'interogasi', jenis: 'resmi', aman: true, bab: 'Ruang Periksa', judul: 'Ditangkap', waktu: 'tanpa jam', scene: 'periksa', alt: 'Ruang interogasi dengan lampu gantung', text: s => [s.f.hendraKenal ? 'Kursi besi, lampu gantung, dan seorang laki-laki berbaju safari. Ia tidak perlu memperkenalkan diri. “Hendra,” katanya juga, seperti mengingatkan. “Kita pernah ketemu di pintu. Waktu itu kamu yang memeriksa aku.”' : 'Kursi besi, lampu gantung, dan seorang laki-laki berbaju safari yang tidak memperkenalkan diri.', 'Di dinding ada jam, dan jarumnya bergerak sangat lambat.'] },
  culik: { mode: 'interogasi', jenis: 'culik', aman: true, bab: 'Mata Tertutup', judul: 'Diculik', waktu: 'tanpa tanggal', scene: 'periksa', alt: 'Layar gelap', text: ['Matamu ditutup kain. Mobil berjalan lama, lalu berhenti. Kamu tidak tahu ini siang atau malam, dan tidak ada yang menyebut namamu dengan benar.'] },
  pasca: {
    enter: s => ({ ...(s.protokol.includes('p48') ? { uang: -harga(15000), nyali: -3 } : {}), ...(saudara('bimo') ? { nyali: s.protokol.includes('p48') ? 7 : 10 } : {}) }),
    aman: true, bab: 'Setelah dilepas', judul: 'Pulang', waktu: s => namaBulan(s.bulan), scene: 'kos', v: 'malam', alt: 'Kamar kos yang gelap',
    text: s => [s.bocor.length ? `Kamu membocorkan: ${s.bocor.map(id => ({ kode: 'kode telepon', safehouse: 'lokasi safehouse', buruh: 'penghubung buruh', nama: 'nama kader', aksi: 'rencana aksi', dana: 'sumber dana', kontakDamar: 'kontak jaringan Damar' }[id])).join(', ')}. Tidak ada yang tahu, kecuali kamu.` : s.f.ditebusKali ? (s.f.informan ? 'Kamu pulang sebagai informan. Setiap Kamis pukul tujuh malam, telepon di lorong kos akan berdering untukmu.' : 'Kamu pulang dengan surat pernyataan bermeterai. Setiap Senin kamu harus melapor, dan presidium tahu.') : 'Kamu tidak membocorkan apa pun. Tubuhmu ingat semuanya, meski kamu ingin lupa.', 'Kamu tidak bisa tidur kalau lampu dimatikan.', ...(saudara('bimo') ? ['Bimo datang membawa kotak P3K dan menginap di lantai kamarmu.'] : []), ...(s.protokol.includes('p48') ? ['Sesuai protokol 48 jam, semua orang pindah tempat dan mengganti kode. Ongkos pindahanmu kamu tanggung sendiri.'] : [])],
    choices: s => s.bocor.length && !s.f.sudahPutusBocor ? [
      { t: 'Mengaku kepada presidium', fx: { massa: -10, mengaku: true, sudahPutusBocor: true }, note: 'Kak Ratna mendengarkan tanpa memotong. “Kamu bukan yang pertama. Kita pindahkan orang-orangnya malam ini.”', go: s2 => pascaKe(s2) },
      { t: 'Simpan sendiri', fx: { rahasiaSimpan: true, sudahPutusBocor: true }, note: 'Kamu memutuskan tidak ada yang perlu tahu. Setiap kali ada kawan yang ditangkap, kamu bertanya-tanya apakah itu karena kamu.', go: s2 => pascaKe(s2) }
    ] : [{ t: 'Pulihkan diri sebisanya', fx: s2 => s2.bocor.length || s2.f.ditebusKali ? {} : { nyaliMax: -20, pengaruh: 10, bertahan: true }, note: s2 => s2.bocor.length || s2.f.ditebusKali ? 'Kamu kembali bekerja.' : 'Kamu bertahan. Kabar itu menyebar, dan kawan-kawan memandangmu dengan cara yang berbeda. Tapi setiap bunyi sepatu lars di lorong membuat tanganmu gemetar.', go: s2 => pascaKe(s2) }]
  }
});
function pascaKe(s) {
  if (s.f.tertangkapBuron && (s.f.sitaKali || s.f.daftarDisita)) { s.ending = 'dipenjara'; return 'akhir'; }
  const k = s.f.kembaliKe || 'b12_buron'; s.f.kembaliKe = null; return k;
}
