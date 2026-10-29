/* Angkatan 98 · Babak II: bab 7 sampai 11, interogasi */
TOPIK.harga = { truth: () => true, benar: () => 'Besok harga naik lagi. Minyak goreng sudah habis di tiga pasar.', salah: () => 'Tenang saja, minggu depan harga turun. Pemerintah sudah operasi pasar.' };
TOPIK.damar = { truth: () => 'kompleks', benar: () => 'Mobilnya masuk ke kompleks berpagar tinggi di pinggir kota. Ada saksi tukang ojek.', salah: () => pick(['Bang Damar dibawa ke Polda. Kita tinggal minta LBH mengecek.', 'Bang Damar kabur sendiri ke luar kota. Dia memang begitu.', 'Dia ditahan di Kodim. Besok juga dilepas.']) };
TOPIK.trisakti = { truth: () => 4, benar: () => 'Empat mahasiswa Trisakti tewas ditembak. Puluhan luka.', salah: () => pick(['Belasan mahasiswa tewas. Mayatnya disembunyikan.', 'Tidak ada yang tewas, cuma luka-luka kena peluru karet.', 'Dua mahasiswa tewas, katanya terpeleset saat lari.']) };
const DOKUMEN_KAMAR = ['rak', 'lantai', 'asbak', 'ibukos'];
const ambil = id => ({ t: 'Ambil sebagai bukti', req: s => s.bukti.filter(b => DOKUMEN_KAMAR.includes(b) || b === 'catatanDamar').length < 3, fx: { bukti: id }, run: s => { s.f.buktiDamar = (s.f.buktiDamar || 0) + 1; }, note: 'Kamu memotretnya dan mencatat jam, tempat, dan siapa saksinya.' });
const ditangkapKe = s => s.sorotan >= 70 ? 'culik' : 'periksa';

Object.assign(NODES, {
  b7_toko: {
    bab: 7, judul: 'Kamis Hitam', waktu: 'Kamis, 8 Januari 1998', bulan: '1998-01', scene: 'toko', alt: 'Rak toko kelontong yang kosong',
    text: ['Pagi ini rupiah dikabarkan tembus Rp 10.000 per dolar. Orang-orang memborong apa saja di toko kelontong dekat kos, dan rak minyak goreng kosong sebelum pukul sepuluh.', 'Ini pertama kalinya kabar datang dari banyak mulut sekaligus. Kamu harus memutuskan mana yang dipercaya.'],
    kabar: s => [kabar('harga', 'warung'), kabar('harga', s.bekal.includes('radio') ? 'radio' : 'tvri'), kabar('harga', aktif('laras') ? 'laras' : 'ratna')],
    hots: {
      rak: { label: 'Rak kosong', text: 'Yang tersisa hanya kecap dan obat nyamuk.' },
      papan: { label: 'Papan harga', text: s => `Harga minyak goreng dicoret tiga kali sejak minggu lalu. Satu paket beras dan minyak sekarang ${rp(harga(20000))}.` },
      radio: { label: 'Radio', text: 'Penyiar membacakan imbauan pemerintah agar masyarakat tidak panik.' },
      ibu: { label: 'Ibu-ibu di antrean', text: '“Susu anak saya sudah tidak terbeli. Bulan lalu masih bisa.”' }
    },
    choices: [
      { t: 'Borong sekarang selagi masih ada', req: s => s.uang.tunai >= harga(20000), run: s => { const n = Math.min(5, Math.floor(s.uang.tunai / harga(20000))); s.uang.tunai -= n * harga(20000); s.uang.barang += n; s.ui.tmp = n; }, fx: { massa: -2 }, go: 'b7_telepon', note: s => `Kamu pulang membawa ${s.ui.tmp} paket. Di belakangmu, seorang ibu tidak kebagian apa-apa.` },
      { t: 'Beli secukupnya, sisakan untuk orang lain', req: s => s.uang.tunai >= harga(20000), cost: () => harga(20000), fx: { barang: 1, fikri: 1 }, go: 'b7_telepon', note: 'Kamu mengambil satu paket dan memberi jalan kepada ibu-ibu di belakangmu.' },
      { t: 'Bawa stok barangmu ke dapur umum', req: s => s.f.dapurUmum && s.uang.barang >= 2, fx: s => ({ barang: -s.uang.barang, massa: 4 + s.uang.barang * 2 }), go: 'b7_telepon', note: 'Pak RT menepuk bahumu. Siang itu dapur umum memasak dua kali lebih banyak.' },
      { t: 'Tidak membeli apa-apa', go: 'b7_telepon', note: 'Kamu pulang dengan tangan kosong dan dompet yang terasa makin tipis setiap hari.' }
    ]
  },
  b7_telepon: {
    bab: 7, judul: 'Telepon Pukul Dua', waktu: 'Februari 1998', bulan: '1998-02', scene: 'kos', v: 'malam', dering: true, kalender: 'Februari 1998', enter: { nyali: -10 }, alt: 'Kamar kos tengah malam, telepon berdering',
    text: s => ['Telepon di lorong berdering pukul dua pagi. Suara laki-laki, tenang, hampir ramah: “Kami tahu kamu kuliah di mana. Kami juga tahu ibumu tinggal di mana.” Lalu sambungan putus.', 'Paginya ada motor tanpa pelat di ujung gang. Pengendaranya tidak turun.'],
    hots: { jendela: KOS_HOTS.jendela, pintu: { label: 'Telepon di lorong', text: 'Gagangnya masih tergantung miring. Kamu tidak berani menutupnya.' } },
    choices: [
      { t: 'Abaikan. Membuatmu takut memang tujuan mereka.', fx: { nyali: 10, sorotan: 10, damar: 1 }, go: 'b7_protokol', note: 'Kamu tetap kuliah, tetap rapat, tetap lewat gang itu. Motor itu muncul lagi dua kali minggu ini.' },
      { t: 'Laporkan dan dokumentasikan ke LBH', fx: { sorotan: -5, nyali: 8, ratna: 1 }, go: 'b7_protokol', note: 'Pengacara LBH membuka map tebal berisi laporan serupa. Kamu bukan satu-satunya, dan entah kenapa itu membuatmu lebih tenang.' },
      { t: 'Pulang ke Magelang seminggu', fx: { nyali: 15, sorotan: -10, pengaruh: -8, ibu: 1 }, go: 'b7_protokol', note: 'Ibumu tidak bertanya apa-apa. Ia hanya terus menambah lauk ke piringmu. Saat kamu kembali, rapat-rapat sudah berjalan tanpamu.' }
    ]
  },
  b7_protokol: {
    mode: 'form', bab: 7, judul: 'Protokol Keamanan', waktu: 'Februari 1998', scene: 'sekre', v: 'radio', alt: 'Rapat keamanan di sekretariat',
    text: ['Kak Ratna mengumpulkan kalian di sekretariat. “Mulai malam ini kita pakai aturan. Pilih dua. Lebih dari itu, kita tidak sanggup menjalankannya.”'],
    steps: [{ id: 'p', label: 'Protokol keamanan', multi: 2, options: () => [
      { v: 'sel', t: 'Sistem sel', d: 'di interogasi kamu hanya tahu 2 nama kader; satu pos demo berkurang', req: s => s.ratna >= 2 },
      { v: 'p48', t: 'Protokol 48 jam', d: 'kalau ada yang tertangkap, semua pindah dan ganti kode; rahasia bisa kedaluwarsa' },
      { v: 'samaran', t: 'Nama samaran dan kode telepon', d: 'Sorotan −10; bocor kalau ada penyusup' },
      { v: 'safehouse', t: 'Safehouse', d: `${rp(harga(50000))}; tujuan kabur kalau razia datang` }] }],
    done: (s, p) => {
      const note = [];
      for (const x of p.p) {
        if (x === 'safehouse' && !bayar(harga(50000))) { note.push('Uangmu tidak cukup untuk menyewa safehouse. Protokol itu batal.'); continue; }
        s.protokol.push(x);
      }
      const fx = {};
      if (s.protokol.includes('samaran')) { fx.sorotan = penyusupAktif() ? 0 : -10; note.push(penyusupAktif() ? 'Kode telepon baru dipakai seminggu, lalu orang asing mulai menelepon dengan kode yang sama.' : 'Di telepon, sekarang kamu bernama “Joko”.'); }
      if (s.protokol.includes('safehouse')) note.push('Wahyu menemukan kamar kontrakan di gang buntu dekat rel kereta. Hanya tiga orang yang tahu alamatnya.');
      if (s.protokol.includes('p48')) note.push('Aturannya sederhana: siapa pun yang tertangkap, semua pindah dan ganti kode dalam 48 jam.');
      if (s.protokol.includes('sel')) note.push('Setiap orang hanya mengenal dua nama lain. Rapat menjadi lebih lambat dan lebih sepi.');
      return { fx, note, go: 'b7_surat' };
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
  kos6: kosNode({ bab: 'Antara bab 7 dan 8', waktu: 'Januari – Februari 1998', dari: '1997-12', bulan: '1998-02', kalender: 'Februari 1998', next: 'b8_papan' }),

  b8_papan: {
    mode: 'form', bab: 8, judul: 'Papan Tulis', waktu: 'akhir Februari 1998', bulan: '1998-02', scene: 'papan', alt: 'Papan tulis dengan peta rute aksi',
    text: s => ['Kampus-kampus merencanakan aksi selama Sidang Umum MPR, 1–11 Maret 1998. Kamu berdiri di depan papan tulis dengan kapur di tangan.', s.pengaruh >= 55 ? 'Presidium menunjukmu sebagai koordinator lapangan.' : 'Korlap lama mundur setelah orang tuanya didatangi aparat. Kamu menggantikannya, meski belum semua orang percaya padamu.'],
    hots: {
      peta: { label: 'Peta', text: 'Kampus, jalan raya, Senayan, dan tiga lingkaran merah: pos aparat yang dilaporkan anak-anak Damar.' },
      kartu: { label: 'Kartu kader', text: () => kaderAktif().map(k => `${KADER[k].nama} (${KADER[k].ahli})`).join(', ') || 'Belum ada kader yang bisa ditugaskan.' },
      daftar: { label: 'Daftar periksa', text: 'Kak Ratna menulis: tali, medis, hukum, humas, sweeping, air, odol, toa.' }
    },
    steps: [
      { id: 'isu', label: 'Isu utama aksi', options: isuOpts },
      { id: 'frame', label: 'Bingkai', options: () => FRAMING },
      { id: 'bentuk', label: 'Bentuk aksi', options: () => [
        { v: 'mimbar', t: 'Mimbar di dalam kampus', d: 'massa kecil, Sorotan rendah, didukung Kak Ratna' },
        { v: 'duduk', t: 'Aksi duduk di gerbang', d: 'massa sedang, risiko bentrok rendah, didukung Bang Fikri' },
        { v: 'jalan', t: 'Long march ke jalan raya', d: 'massa besar, risiko bentrok tinggi, didukung anak-anak Damar' },
        { v: 'dprd', t: 'Long march ke DPRD', d: 'massa besar, risiko bentrok sedang' },
        { v: 'delegasi', t: 'Delegasi tanpa massa', d: 'massa sangat kecil, didukung Mas Yudi' }] },
      { id: 'rute', label: 'Rute', options: () => S.m.pick.bentuk === 'jalan' || S.m.pick.bentuk === 'dprd' ? [
        { v: 'utama', t: 'Jalan utama', d: 'cepat, pasti dihadang' },
        { v: 'kampung', t: 'Lewat kampung', d: 'lambat, warga ikut bergabung', req: s => aktif('asep') || s.f.dapurUmum },
        { v: 'tetangga', t: 'Lewat kampus tetangga', d: 'massa bergabung di jalan', req: () => aktif('mei') }] : [{ v: 'none', t: 'Tidak perlu rute', d: 'aksi tidak keluar kampus' }] },
      { id: 'pos', label: 'Tempatkan kader di pos', type: 'pos' },
      { id: 'gelang', label: 'Warna gelang hari itu', options: () => ['merah', 'kuning', 'hijau', 'biru'].map(w => ({ v: w, t: cap(w) })) }
    ],
    done: (s, p) => {
      s.f.isuAksi = p.isu; s.f.bentuk = p.bentuk; s.f.rute = p.rute; s.f.ruteJauh = p.bentuk === 'jalan' || p.bentuk === 'dprd'; s.f.pos = p.pos; s.f.gelang = p.gelang;
      const fx = { [FRAME_SENIOR[p.frame]]: 1 }, menang = { jalan: 'damar', dprd: 'damar', duduk: 'fikri', mimbar: 'ratna', delegasi: 'yudi' }[p.bentuk];
      for (const k of ['damar', 'fikri', 'ratna']) fx[k] = (fx[k] || 0) + (k === menang ? 1 : -1);
      const kosong = Object.keys(POS).filter(k => !p.pos[k]).map(k => POS[k].toLowerCase());
      return { fx, note: [`Rencana disepakati: ${{ mimbar: 'mimbar di dalam kampus', duduk: 'aksi duduk di gerbang', jalan: 'long march ke jalan raya', dprd: 'long march ke DPRD', delegasi: 'delegasi tanpa massa' }[p.bentuk]}. Gelang hari itu berwarna ${p.gelang}.`, menang === 'damar' ? 'Anak-anak Damar bersorak. Bang Fikri keluar ruangan tanpa bicara.' : menang === 'fikri' ? 'Bang Fikri tersenyum. Anak-anak Damar menyebutmu penakut.' : 'Separuh ruangan kecewa, separuh lagi lega.', kosong.length ? `Pos yang masih kosong: ${kosong.join(', ')}.` : 'Semua pos terisi.'], go: 'b8_logistik' };
    }
  },
  b8_logistik: {
    mode: 'logistik', bab: 8, judul: 'Logistik', waktu: 'awal Maret 1998', bulan: '1998-03', scene: 'papan', alt: 'Daftar belanja logistik aksi',
    text: ['Kak Ratna menyerahkan amplop kas gerakan. “Belanja yang perlu, bukan yang kamu mau. Massa tanpa air minum bubar lebih cepat dari massa yang dipukul.”'],
    massaBenar: s => ({ mimbar: 300, duduk: 500, jalan: 900, dprd: 800, delegasi: 20 }[s.f.bentuk] || 300) * (0.6 + s.massa / 100) * (s.iklim >= ISU.find(i => i.v === s.f.isuAksi).ambang ? 1 : 0.6),
    next: 'b9_kumpul'
  },
  b9_kumpul: {
    mode: 'inspect', level: 2, v: 'kumpul', bab: 9, judul: 'Titik Kumpul', waktu: 'awal Maret 1998', scene: 'inspect', alt: 'Meja sweeping di titik kumpul aksi',
    text: s => [`Kamu duduk di meja sweeping. Aturannya: jaket almamater, KTM, dan gelang ${s.f.gelang}. Antrean di belakang terus memanjang.`],
    rules: s => `<ul class="rules"><li>Peserta memakai jaket almamater dan membawa KTM.</li><li>Gelang hari ini berwarna <b>${s.f.gelang}</b>.</li><li>Periksa tas kalau ada yang mencurigakan.</li></ul>`,
    daftar: s => `<div class="sheet"><p><b>Gelang hari ini: ${s.f.gelang}</b></p><p>Jaket almamater wajib. Wartawan boleh ikut di luar barisan.</p></div>`, daftarLabel: 'Pegangan sweeping',
    visitors: s => {
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
      return list;
    },
    evaluate: (s, kep, list) => {
      const { fx, lines } = nilaiStandar(kep, list, (t, fx, lines) => {
        if (t.id === 'prov') { s.f.provokatorLolos = true; lines.push('Laki-laki dengan jeriken itu lolos masuk barisan.'); }
        if (t.id === 'intel') { fx.sorotan = (fx.sorotan || 0) + 10; lines.push('Gunawan lolos. Namanya tidak ada di kampus mana pun.'); }
      });
      if (kep.pers !== 'tolak') fx.tekanan = 5;
      if (kep.tetangga === 'jamin') { fx.massa += 6; lines.push('Mei menjamin Yohanes. Dua puluh mahasiswa kampus tetangga bergabung.'); }
      if (!lines.length) lines.push('Barisan berangkat bersih.');
      return { fx, note: lines, go: 'b9_jalan' };
    }
  },
  b9_jalan: {
    mode: 'rounds', bab: 9, judul: 'Barisan Tameng', waktu: 'awal Maret 1998', scene: 'jalan', spanduk: 'TOLAK SIDANG UMUM', alt: 'Barisan tameng di depan barisan mahasiswa',
    text: s => [s.f.bentuk === 'mimbar' || s.f.bentuk === 'delegasi' ? 'Aksi dimulai di halaman kampus. Aparat berjaga di luar gerbang.' : 'Barisanmu bergerak. Lima puluh meter di depan, barisan tameng berjajar menutup jalan.'],
    hots: { tameng: { label: 'Barisan tameng', text: 'Helm, tameng rotan, dan pentungan. Wajah-wajah di baliknya masih muda, seumuran kalian.' }, spanduk: { label: 'Spanduk', text: 'Spanduk kain yang dicat semalaman. Catnya belum benar-benar kering.' } },
    rounds: [
      { text: 'Komandan lapangan berteriak lewat pengeras suara: “Bubar! Ini perintah!”', options: [
        { t: 'Orasi: bacakan tuntutan keras-keras', fx: s => ({ pengaruh: 5, sorotan: 5, massa: kutipan() ? 6 : 3 }), note: s => kutipan() ? 'Kamu mengutip buku yang kamu baca di sekretariat. Barisan di belakang bersorak.' : 'Suaramu tenggelam di tengah jalan, tapi barisan tetap bertahan.' },
        { t: 'Negosiasi dengan komandan', fx: { yudi: 1, pengaruh: 3 }, note: 'Komandan memberi waktu sampai pukul tiga. Setelah itu, katanya, ia tidak bertanggung jawab.' },
        { t: 'Perintahkan massa duduk', fx: { fikri: 1, ricuh: -1 }, note: 'Ratusan orang duduk di aspal. Barisan tameng berhenti maju.' },
        { t: 'Maju selangkah demi selangkah', fx: { damar: 1, ricuh: 1, sorotan: 5 }, note: 'Jarak menyempit. Kamu bisa melihat nomor di helm prajurit paling depan.' }] },
      { text: s => s.f.provokatorLolos ? 'Sebuah botol melayang dari belakang barisan dan pecah di depan tameng. Bau bensin menyebar.' : pick(['Hujan turun deras. Spanduk basah dan berat.', 'Wartawan berdatangan dengan kamera besar.']), options: [
        { t: 'Duduk dan tahan barisan, jangan membalas', fx: s => ({ ricuh: s.f.provokatorLolos ? 0 : -1, massa: (s.siap.air || 0) >= 0.8 ? 6 : 2, nyali: -5 }), note: s => ((s.siap.air || 0) >= 0.8 ? 'Air minum cukup. Barisan bertahan lama di bawah terik.' : 'Air minum habis sebelum siang. Beberapa peserta pingsan.') + (s.f.pos && s.f.pos.tali ? ' Tali massa menahan barisan tetap rapat.' : '') },
        { t: 'Mundur teratur ke kampus', fx: { ricuh: -1, sorotan: -5, massa: -3, ratna: 1 }, note: s => (s.siap.toa || 0) >= 0.8 ? 'Komando lewat toa terdengar jelas. Barisan mundur ruas demi ruas.' : 'Tanpa toa, perintahmu tidak terdengar sampai belakang. Barisan pecah menjadi kelompok-kelompok kecil.' },
        { t: 'Dorong maju', fx: s => ({ massa: 8, nyali: 8, sorotan: 12, ricuh: s.f.pos && s.f.pos.tali ? 1 : 2, damar: 1 }), note: 'Tameng dan barisan bertemu. Dorong-dorongan, teriakan, lalu pentungan.' },
        { t: 'Cari komandan dan minta waktu', fx: { pengaruh: 5, yudi: 1 }, note: 'Komandan mau menahan pasukannya kalau kalian bubar pukul lima.' }] },
      { text: 'Gas air mata ditembakkan. Asap putih menutup jalan, dan barisan tameng mulai memukul mundur.', options: [
        { t: 'Evakuasi lewat jalur yang sudah disiapkan', fx: s => ({ ricuh: -1, nyali: (s.siap.odol || 0) >= 0.8 ? -3 : -10 }), note: s => ((s.siap.odol || 0) >= 0.8 ? 'Odol dan kain basah dibagikan cepat. Mata perih, tapi semua bisa berjalan.' : 'Tanpa odol dan kain basah, kawan-kawan berjalan sambil menangis dan batuk.') + (s.f.pos && s.f.pos.medis ? ' Tim medis menangani yang terluka di halaman kampus.' : '') },
        { t: 'Bertahan di tempat', fx: s => ({ massa: 5, ricuh: 1, nyali: (s.siap.odol || 0) >= 0.8 ? -6 : -15, sorotan: 8 }), note: 'Kamu bertahan sampai napasmu sesak. Empat kawan dibawa ke rumah sakit.' },
        { t: 'Bubar lewat kampung, minta warga membuka pintu', req: s => s.f.dapurUmum || s.massa >= 50, fx: { ricuh: -1, massa: 5 }, note: 'Pak RT dan warga membuka pintu-pintu rumah. Barisanmu menghilang di gang-gang kecil.' }] }
    ],
    done: s => {
      const note = [], fx = {}, ricuh = s.ricuh >= 3 || s.f.provokatorLolos;
      if (s.f.aksiBocor) { fx.ricuh = 1; note.push('Aparat sudah menunggu di rute yang kalian rahasiakan.'); }
      const isu = isuFx(s.f.isuAksi, 10); Object.assign(fx, isu.fx); note.push(isu.note);
      if (ricuh) { s.f.judulKoran = 'Aksi Mahasiswa Berakhir Ricuh, Puluhan Diamankan'; fx.cap = 2; fx.massa = (fx.massa || 0) - 8; if (s.pengaruh >= 35) fx.bapak = -1; }
      else if (s.f.pos && s.f.pos.humas) { s.f.judulKoran = 'Mahasiswa Duduk, Aparat Memukul'; fx.massa = (fx.massa || 0) + 6; s.cap = 0; }
      else s.f.judulKoran = 'Ribuan Mahasiswa Tolak Sidang Umum';
      s.f.namaDiKoran = (s.f.namaDiKoran || 0) + (s.pengaruh >= 35 ? 1 : 0);
      fx.iklim = 8;
      return { fx, note, go: 'b9_koran' };
    }
  },
  b9_koran: {
    bab: 9, judul: 'Koran Esok Hari', waktu: 'awal Maret 1998', scene: 'koran', alt: 'Halaman depan koran esok hari',
    text: s => [`Pagi berikutnya, Laras membawa koran ke sekretariat. Judulnya: “${s.f.judulKoran}”.`, s.f.judulKoran.includes('Ricuh') ? 'Ibu kos menatapmu lama saat kamu lewat di ruang tamu.' : 'Seseorang menempel kliping itu di dinding sekretariat.'],
    hots: { judul: { label: 'Judul', text: s => s.f.judulKoran }, foto: { label: 'Foto', text: 'Foto barisan mahasiswa dari atas. Kamu mencari wajahmu sendiri, dan menemukannya di pojok kiri.' } },
    choices: [{ t: 'Gunting klipingnya dan simpan', go: 'b10_kamar' }]
  },

  b10_kamar: {
    bab: 10, judul: 'Kamar yang Diacak', waktu: 'pertengahan Maret 1998', bulan: '1998-03', scene: 'kamarDamar', enter: { nyali: -10, damarHilang: true }, alt: 'Kamar Bang Damar yang diacak',
    text: ['Pada 10 Maret, MPR memilih Presiden untuk ketujuh kalinya. Tiga hari kemudian, Bang Damar tidak pulang.', 'Kamar kosnya diacak. Kamu berdiri di ambang pintu dengan senter kecil. Kamu boleh membawa paling banyak tiga barang sebagai bukti.'],
    kabar: s => [kabar('damar', 'laras'), kabar('damar', 'damar'), kabar('damar', 'warung')],
    hots: {
      rak: { label: 'Rak buku kosong', text: 'Semua buku Damar hilang, termasuk yang legal.', act: ambil('rak') },
      lantai: { label: 'Lantai berdebu', text: 'Bekas sepatu lars, besar, lebih dari satu pasang.', act: ambil('lantai') },
      asbak: { label: 'Asbak', text: 'Puntung rokok putih berfilter. Damar hanya merokok kretek.', act: ambil('asbak') },
      kalender: { label: 'Kalender', text: s => 'Tanggal 13 Maret dilingkari: “rapat jam 7”. Hanya lima orang yang tahu jadwal itu.' + (penyusupAktif() ? ` Salah satunya ${KADER[s.penyusup].nama}.` : '') },
      ubin: { label: 'Ubin lepas', text: 'Di bawahnya ada buku catatan kecil berisi kontak jaringan Damar di banyak kota.', act: { t: 'Ambil buku catatannya', req: s => !s.bukti.includes('catatanDamar'), fx: { bukti: 'catatanDamar' }, note: 'Kamu menyelipkan buku catatan itu di balik bajumu. Kalau tertangkap, buku ini berbahaya.' } },
      ibukos: { label: 'Ibu kos', text: '“Mobilnya tanpa pelat, Nak. Mereka datang jam satu pagi.”', act: ambil('ibukos') }
    },
    choices: [
      { t: 'Telusuri kabar dari Laras', req: s => s.ui.kabar && s.ui.kabar.at(0), run: s => { s.ui.tmp = s.ui.kabar.at(0).ok; }, fx: s => s.ui.kabar.at(0).ok ? { bukti: 'saksi' } : { sorotan: 8, nyali: -5 }, go: 'b10_putus', note: s => s.ui.tmp ? 'Jejaknya benar. Seorang tukang ojek melihat mobil itu masuk kompleks berpagar tinggi.' : 'Jejaknya salah. Kamu menghabiskan sehari bertanya ke tempat yang salah, dan seseorang mulai menanyaimu balik.' },
      { t: 'Telusuri kabar dari anak-anak Damar', run: s => { s.ui.tmp = s.ui.kabar.at(1).ok; }, fx: s => s.ui.kabar.at(1).ok ? { bukti: 'saksi' } : { sorotan: 10, nyali: -5 }, go: 'b10_putus', note: s => s.ui.tmp ? 'Jejaknya benar. Ada saksi yang mau bicara ke LBH.' : 'Jejaknya salah. Anak-anak Damar malah ribut dengan petugas jaga.' },
      { t: 'Jangan buang waktu mengejar kabar', go: 'b10_putus' }
    ]
  },
  b10_putus: {
    bab: 10, judul: 'Kamar yang Diacak', waktu: 'pertengahan Maret 1998', scene: 'kamarDamar', alt: 'Kamar Bang Damar',
    text: s => [`Kamu membawa ${s.f.buktiDamar || 0} bukti dari kamar itu. Kak Ratna mendesak kalian membawa kasus ini ke publik. Mas Yudi mendesak menunggu.`],
    choices: [
      { t: 'Bawa ke publik: konferensi pers, LBH, posko pengaduan', fx: s => ({ sorotan: 20, massa: 10 + 5 * (s.f.buktiDamar || 0), pengaruh: 10, ratna: 1, yudi: -1, damarPublik: true }), run: s => { s.f.namaDiKoran = (s.f.namaDiKoran || 0) + 1; }, go: 'kos7', note: 'Nama Bang Damar masuk koran, dan namamu juga. Kamu tahu yang kedua berbahaya. Yang pertama mungkin menyelamatkan nyawanya.' },
      { t: 'Doa bersama dan mimbar duka di masjid kampus', fx: { massa: 12, sorotan: 8, nyali: 5, fikri: 1, damarPublik: true }, go: 'kos7', note: 'Ribuan lilin menyala di pelataran masjid. Wartawan datang meski tidak diundang. Foto Bang Damar dipajang di tangga.' },
      { t: 'Cari diam-diam lewat jaringan', fx: { sorotan: 3, nyali: -8, pengaruh: 3 }, go: 'kos7', note: 'Jaringanmu menemukan jejak sampai sebuah kompleks berpagar tinggi di pinggir kota. Setelah itu jejaknya putus.' },
      { t: 'Minta Mas Yudi bertanya ke kenalannya di Kodam', fx: { sorotan: -5, massa: -8, yudi: 1, ratna: -1 }, go: 'kos7', note: 'Jawabannya sopan dan kosong: “Tidak ada data yang bersangkutan.” Mas Yudi menyarankan kalian menunggu.' }
    ]
  },
  kos7: kosNode({ bab: 'Antara bab 10 dan 11', waktu: 'Maret 1998', dari: '1998-02', bulan: '1998-03', kalender: 'Maret 1998', next: 'b11_razia' }),

  b11_razia: {
    mode: 'razia', bab: 11, judul: 'Razia', waktu: 'akhir Maret 1998 · pukul 23.40', bulan: '1998-03', scene: 'sekre', v: 'razia', alt: 'Sekretariat malam, mesin stensil berputar',
    text: s => ['Kamu sedang mencetak selebaran ketika suara truk terdengar di luar. ' + (s.yudi >= 3 ? 'Pager-mu berbunyi setengah jam lalu: TAMU DATANG JAM 12. Y.' : s.f.dapurUmum ? 'Anak Pak RT berlari ke sekretariat: “Banyak orang berseragam di mulut gang!”' : 'Tidak ada yang memperingatkanmu.'), 'Kamu hanya punya waktu untuk beberapa tindakan sebelum pintu digedor.'],
    budget: s => 3 + (s.yudi >= 3 ? 2 : 0) - (s.f.intelMasuk ? 1 : 0),
    options: [
      { id: 'plafon', t: 'Sembunyikan dokumen di plafon', d: 'aman', fx: { dokAman: true }, note: 'Daftar kontak dan bukti kamu dorong ke atas plafon.' },
      { id: 'karung', t: 'Sembunyikan dokumen di karung beras', d: '50% ditemukan', run: s => { if (Math.random() < 0.5) { s.f.dokAman = true; return 'Dokumen kamu benamkan di dalam beras.'; } s.f.dokDitemukan = true; return 'Dokumen kamu benamkan di dalam beras, tapi ujung mapnya masih mencuat.'; } },
      { id: 'bakar', t: 'Bakar daftar anggota', d: 'nama-nama tidak bisa disita', fx: { daftarDibakar: true }, note: 'Kertas-kertas itu kamu bakar di bak mandi. Asapnya membuat matamu perih.' },
      { id: 'stensil', t: 'Sembunyikan mesin stensil', d: 'selebaran tidak bisa dilacak', fx: { stensilAman: true }, note: 'Kamu dan seorang kawan menggotong mesin stensil ke kamar mandi dan menutupinya dengan tikar.' },
      { id: 'buku', t: 'Sembunyikan buku terlarang', d: 'tidak jadi barang bukti', req: s => s.buku.dikos.length > 0, fx: { bukuDititip: true }, run: s => { s.buku.dikos = []; return 'Buku-buku terlarang kamu selipkan di balik lemari.'; } },
      ...Object.keys(KADER).map(k => ({ id: 'kabur_' + k, t: `Suruh ${KADER[k].nama} kabur lewat jendela belakang`, req: s => aktif(k), run: s => { s.f['lolos_' + k] = true; return `${KADER[k].nama} melompat jendela dan menghilang di gang.`; } }))
    ],
    after: s => {
      const note = [], fx = {};
      const hadir = kaderAktif().slice(0, 2);
      for (const k of hadir) if (!s.f['lolos_' + k]) { s.kader[k] = 'ditangkap'; note.push(`${KADER[k].nama} tertangkap di dalam sekretariat.`); }
      if (!s.f.bukuDititip && s.buku.dikos.length) { fx.sorotan = 10 * s.buku.dikos.length; note.push('Di kosmu, aparat menyita buku-buku terlarang.'); }
      if (!s.f.stensilAman) { fx.sorotan = (fx.sorotan || 0) + 5; note.push('Mesin stensil disita. Selebaran-selebaran lama bisa dilacak ke sini.'); }
      note.push('Pintu digedor. Kamu sudah tidak punya waktu lagi.');
      return { fx, note, go: 'b11_sembunyi' };
    }
  },
  b11_sembunyi: {
    mode: 'hide', siapa: 'kamu', rounds: 4, spots: ['plafon', 'lemari', 'bak', 'kolong', 'atap', 'warga'], bab: 11, judul: 'Sembunyi', waktu: 'akhir Maret 1998 · lewat tengah malam', scene: 'sembunyi', alt: 'Pandangan dari tempat persembunyian',
    text: ['Pintu jebol. Senter-senter menyapu ruangan. Kamu punya beberapa detik untuk memilih tempat.'],
    after: (s, ok) => { if (ok) { s.f.dariAtap = s.m.spot === 'atap'; return { note: s.m.spot === 'warga' ? 'Ibu pemilik rumah sebelah menutupimu dengan tumpukan kain jemuran. Setelah langkah-langkah itu pergi, ia membuka pintu belakang untukmu.' : 'Langkah-langkah itu menjauh. Kamu menunggu sampai suara truk menghilang, lalu keluar lewat belakang.', go: 'b11_lari' }; } s.f.kembaliKe = 'b12_buron'; return { fx: { nyali: -5 }, note: 'Sebuah tangan menarik kerah bajumu. Matamu silau oleh senter.', go: ditangkapKe(s) }; }
  },
  b11_lari: {
    mode: 'run', bab: 11, judul: 'Lari', waktu: 'akhir Maret 1998 · pukul 01.00', scene: 'gang', alt: 'Persimpangan gang di malam hari',
    text: ['Peluit berbunyi di belakangmu. Kamu berlari menyusuri gang-gang yang kamu hafal dari dapur umum dan kos-kosan kawan.'],
    after: (s, ok) => { if (ok) return { note: s.protokol.includes('safehouse') ? 'Kamu sampai di jalan besar. Wahyu sudah menunggu di mobil boks, mesinnya menyala.' : 'Kamu sampai di jalan besar dan menghentikan taksi pertama yang lewat.', go: 'b11_mobil' }; s.f.kembaliKe = 'b12_buron'; return { fx: { nyali: -5 }, note: 'Kamu tertangkap di ujung gang. Seseorang menutup kepalamu dengan jaket.', go: ditangkapKe(s) }; }
  },
  b11_mobil: {
    mode: 'tail', bab: 11, judul: 'Dibuntuti', waktu: 'akhir Maret 1998 · pukul 01.30', scene: 'mobil', alt: 'Pandangan dari jok belakang mobil, spion memperlihatkan lampu mobil lain',
    text: s => [`Kalian melaju menuju ${s.protokol.includes('safehouse') ? 'safehouse dekat rel kereta' : 'kos seorang kawan di Rawamangun'}. Di spion, sepasang lampu mengikuti sejak tadi.`],
    after: (s, h) => {
      if (h === 'tangkap') { s.f.kembaliKe = 'b12_buron'; return { note: 'Dua laki-laki menarikmu keluar dari mobil.', go: ditangkapKe(s) }; }
      if (h === 'lepas') return { fx: { nyali: 5 }, note: 'Kalian sampai tanpa buntut. Malam itu kamu tidur di lantai, dengan sepatu masih terpasang.', go: 'b12_buron' };
      if (h === 'buntut') { s.f.safehouseBocor = true; const k = kaderAktif().at(0); if (k) s.kader[k] = 'diawasi'; return { note: 'Kalian sampai, dan mobil itu parkir di ujung gang. Tempat ini tidak aman lagi.', go: 'b12_buron' }; }
      s.f.tanpaSafehouse = true; return { fx: { nyali: -10 }, note: 'Kamu turun di masjid dan tidur di serambinya sampai subuh.', go: 'b12_buron' };
    }
  },

  periksa: { mode: 'interogasi', jenis: 'resmi', aman: true, bab: 'Ruang Periksa', judul: 'Ditangkap', waktu: 'tanpa jam', scene: 'periksa', alt: 'Ruang interogasi dengan lampu gantung', text: ['Kursi besi, lampu gantung, dan seorang laki-laki berbaju safari yang tidak memperkenalkan diri. Di dinding ada jam, dan jarumnya bergerak sangat lambat.'] },
  culik: { mode: 'interogasi', jenis: 'culik', aman: true, bab: 'Mata Tertutup', judul: 'Diculik', waktu: 'tanpa tanggal', scene: 'periksa', alt: 'Layar gelap', text: ['Matamu ditutup kain. Mobil berjalan lama, lalu berhenti. Kamu tidak tahu ini siang atau malam, dan tidak ada yang menyebut namamu dengan benar.'] },
  pasca: {
    aman: true, bab: 'Setelah dilepas', judul: 'Pulang', waktu: s => namaBulan(s.bulan), scene: 'kos', v: 'malam', alt: 'Kamar kos yang gelap',
    text: s => [s.bocor.length ? `Kamu membocorkan: ${s.bocor.map(id => ({ kode: 'kode telepon', safehouse: 'lokasi safehouse', buruh: 'penghubung buruh', nama: 'nama kader', aksi: 'rencana aksi', dana: 'sumber dana', kontakDamar: 'kontak jaringan Damar' }[id])).join(', ')}. Tidak ada yang tahu, kecuali kamu.` : 'Kamu tidak membocorkan apa pun. Tubuhmu ingat semuanya, meski kamu ingin lupa.', 'Kamu tidak bisa tidur kalau lampu dimatikan.'],
    choices: s => s.bocor.length && !s.f.sudahPutusBocor ? [
      { t: 'Mengaku kepada presidium', fx: { massa: -10, mengaku: true, sudahPutusBocor: true }, note: 'Kak Ratna mendengarkan tanpa memotong. “Kamu bukan yang pertama. Kita pindahkan orang-orangnya malam ini.”', go: s2 => pascaKe(s2) },
      { t: 'Simpan sendiri', fx: { rahasiaSimpan: true, sudahPutusBocor: true }, note: 'Kamu memutuskan tidak ada yang perlu tahu. Setiap kali ada kawan yang ditangkap, kamu bertanya-tanya apakah itu karena kamu.', go: s2 => pascaKe(s2) }
    ] : [{ t: 'Pulihkan diri sebisanya', fx: s2 => s2.bocor.length ? {} : { nyaliMax: -20, pengaruh: 10, bertahan: true }, note: s2 => s2.bocor.length ? 'Kamu kembali bekerja.' : 'Kamu bertahan. Kabar itu menyebar, dan kawan-kawan memandangmu dengan cara yang berbeda. Tapi setiap bunyi sepatu lars di lorong membuat tanganmu gemetar.', go: s2 => pascaKe(s2) }]
  }
});
function pascaKe(s) {
  if (s.f.tertangkapBuron && s.bukti.length && !s.f.dokAman) { s.ending = 'dipenjara'; return 'akhir'; }
  const k = s.f.kembaliKe || 'b12_buron'; s.f.kembaliKe = null; return k;
}
