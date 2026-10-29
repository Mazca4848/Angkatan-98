/* Angkatan 98 · Babak III dan IV: buron, Jenewa, Mei 1998 */
TOPIK.sasaran = { truth: () => false, benar: () => 'Jangan percaya siapa pun yang mengajak ke pertokoan. Itu jebakan.', salah: () => 'Kampus tetangga sudah turun ke pertokoan. Kita ketinggalan!' };
TOPIK.mundur = { truth: () => true, benar: () => 'Presiden akan mundur dalam dua hari. Bertahan saja.', salah: () => 'Presiden tidak akan mundur. Tentara akan membersihkan gedung ini besok subuh.' };
const kartuSah = (id, nama, f, kampus) => ({ id, nama, sah: true, sepatu: 'sneakers', face: f, kode: 'Reformasi damai', docs: [{ type: 'kartu', nama, kampus, face: f, ring: 'B' }], kata: '“Ring B. Saya bawa nasi dari dapur umum.”', jawab: '“Kami gantian jaga dari jam dua belas.”' });

Object.assign(NODES, {
  b12_buron: {
    mode: 'buron', buron: true, bab: 12, judul: 'DPO', waktu: 'April – awal Mei 1998', bulan: '1998-04', scene: 'kota', alt: 'Sketsa kota tempatmu bersembunyi',
    text: s => ['Namamu sekarang ada di daftar pencarian orang. Selama lima minggu kamu berpindah kota, menyamar, dan tetap menggerakkan aksi lewat telepon, kurir, dan surat.', s.f.safehouseBocor ? 'Safehouse sudah ketahuan, jadi kamu mulai dari bangku terminal.' : s.f.tanpaSafehouse ? 'Kamu tidak punya safehouse. Setiap malam kamu harus mencari tempat tidur baru.' : 'Kamu mulai dari safehouse di Jakarta.'],
    hots: { peta: { label: 'Peta buron', text: s => 'Kota yang pernah kamu singgahi: ' + ((s.f.jejakKota || []).map(k => KOTA[k].t).join(', ') || 'belum ada') + '.' }, wartel: { label: 'Wartel', text: 'Argo tagihan berjalan di layar kecil. Satu menit ke Jakarta bisa sama dengan sebungkus nasi.' } }
  },
  b13_bandara: {
    bab: 13, judul: 'Jenewa', waktu: 'pertengahan April 1998', bulan: '1998-04', scene: 'terminal', v: 'imigrasi', alt: 'Loket imigrasi bandara',
    text: s => ['Bandara Soekarno-Hatta. Kak Ratna menghubungkanmu dengan sebuah LSM internasional yang menanggung tiketmu. Kamu hanya membawa USD 50 untuk visa dan biaya hidup.', s.sorotan >= 60 ? 'Petugas imigrasi mengetik namamu, lalu berhenti. Ia menatap layar terlalu lama.' : 'Petugas imigrasi membolak-balik paspormu dengan malas.'],
    hots: { petugas: { label: 'Petugas imigrasi', text: 'Ia mencocokkan wajahmu dengan foto paspor, lalu membuka sebuah buku tebal di laci.' }, antrean: { label: 'Antrean', text: 'TKW yang berangkat ke Hong Kong, pengusaha dengan koper mahal, dan kamu.' } },
    choices: [
      { t: 'Serahkan paspor dan tunggu', fx: { usd: -50 }, run: s => { s.f.cekal = s.sorotan >= 60 && Math.random() < 0.5; if (s.f.cekal) s.f.kembaliKe = 'b12_buron'; }, go: s => s.f.cekal ? 'periksa' : 'b13_jenewa', note: s => s.f.cekal ? 'Petugas memanggil dua orang dari ruang belakang. “Ikut kami sebentar, Dik.”' : 'Stempel jatuh di halaman paspormu. Tiga jam kemudian, pesawat lepas landas.' }
    ]
  },
  b13_jenewa: {
    mode: 'rounds', bab: 13, judul: 'Jenewa', waktu: 'April 1998', scene: 'jenewa', alt: 'Koridor gedung PBB di Jenewa dengan deretan bendera',
    text: ['Koridor gedung PBB di Jenewa. Sidang Komisi HAM berlangsung di ruang besar, tapi yang menentukan adalah pertemuan-pertemuan kecil di koridor. Waktumu hanya cukup untuk dua.'],
    hots: { delegasi: { label: 'Delegasi negara', text: 'Diplomat Belanda dengan dasi biru. Ia ingin bukti, bukan cerita.' }, pelapor: { label: 'Pelapor khusus', text: 'Pelapor khusus PBB untuk penghilangan paksa. Mejanya penuh map dari puluhan negara.' }, wartawan: { label: 'Wartawan', text: 'Wartawan kantor berita internasional. Ia butuh kutipan yang bisa dimuat besok pagi.' }, eksil: { label: 'Eksil 1965', text: 'Laki-laki tua berbahasa Jawa halus. Ia tinggal di Amsterdam sejak paspornya dicabut.' } },
    rounds: () => [0, 1].map(() => ({ text: s => `Pertemuan ${s.m.r + 1}. Siapa yang kamu temui?`, options: s => [
      { t: 'Delegasi negara', req: s2 => !s2.f.temu_delegasi, run: s2 => { s2.f.temu_delegasi = true; const kuat = s2.bukti.length >= 2; apply({ tekanan: kuat ? 25 : 10 }); return kuat ? 'Kamu meletakkan foto bekas sepatu lars, kesaksian ibu kos, dan catatan kecurangan pemilu di mejanya. Ia memotret semuanya.' : 'Ia mendengarkan dengan sopan, lalu bertanya, “Ada buktinya?” Kamu tidak punya cukup.'; } },
      { t: 'Pelapor khusus PBB', req: s2 => !s2.f.temu_pelapor, run: s2 => { s2.f.temu_pelapor = true; apply({ tekanan: s2.f.damarPublik ? 20 : 10 }); return s2.f.damarPublik ? 'Nama Bang Damar dimasukkan ke dalam laporan PBB, lengkap dengan tanggal dan saksi.' : 'Pelapor mencatat nama Bang Damar, tapi tanpa laporan publik di dalam negeri, kasusnya lemah.'; } },
      { t: 'Wartawan internasional', req: s2 => !s2.f.temu_wartawan, run: s2 => { s2.f.temu_wartawan = true; const bisa = s2.bekal.includes('kamus') || aktif('laras'); apply({ tekanan: bisa ? 15 : 5, cap: 2 }); return bisa ? 'Wawancaramu dimuat di koran Eropa keesokan harinya. Di Jakarta, koran pemerintah menyebutmu antek asing.' : 'Tanpa kamus dan penerjemah, wawancaranya berantakan. Hanya satu kalimatmu yang dikutip, dan itu salah.'; } },
      { t: 'Eksil 1965', req: s2 => !s2.f.temu_eksil, run: s2 => { s2.f.temu_eksil = true; apply({ nyali: 10 }); return 'Ia bercerita tentang tiga puluh tahun tidak bisa pulang, tentang ibunya yang meninggal tanpa ia tahu. “Jangan sampai kalian jadi kami.”'; } }
    ] })),
    done: s => ({ note: `Tekanan internasional sekarang ${s.tekanan}. Tinggal satu keputusan: pulang atau tinggal.`, go: 'b13_pilih' })
  },
  b13_pilih: {
    bab: 13, judul: 'Jenewa', waktu: 'akhir April 1998', scene: 'jauh', alt: 'Kamar penginapan di Jenewa',
    text: ['Kamar penginapan kecil di dekat stasiun. Kak Ratna menelepon dari Jakarta: aksi-aksi kampus makin besar, dan namamu masih di daftar.'],
    hots: { tv: { label: 'Televisi', text: 'Berita Eropa menayangkan demonstrasi mahasiswa di Jakarta selama tiga puluh detik.' }, telepon: { label: 'Telepon', text: 'Tagihannya dibayar dengan dolar terakhirmu.' } },
    choices: [
      { t: 'Pulang dan lanjutkan sebagai buron', run: s => { s.f.buronResume = 4; s.f.kembaliKe = 'b12_buron'; s.f.tertangkapPulang = s.sorotan >= 60 && Math.random() < 0.4; }, go: s => s.f.tertangkapPulang ? 'periksa' : 'b12_buron', note: s => s.f.tertangkapPulang ? 'Di bandara, dua orang sudah menunggumu di ujung garbarata.' : 'Kamu pulang lewat Singapura dan masuk Jakarta naik kapal feri dari Batam.' },
      { t: 'Tinggal di luar negeri untuk sementara', fx: { diLuar: true, tekanan: 10 }, go: 'jauh', note: 'Kamu memperpanjang visa dengan surat dari LSM. Kamu bilang ini hanya sementara.' }
    ]
  },
  jauh: {
    bab: 'Dari jauh', judul: 'Mei di Televisi', waktu: 'Mei 1998', bulan: '1998-05', scene: 'jauh', alt: 'Televisi kamar penginapan menayangkan Jakarta yang terbakar',
    text: ['Dari televisi penginapan, kamu melihat kabar Trisakti, lalu Jakarta yang terbakar. Kamu menelepon sekretariat setiap malam, dan tidak selalu ada yang mengangkat.'],
    hots: { tv: { label: 'Televisi', text: 'Asap hitam di atas Jakarta, ditayangkan tanpa suara di antara berita sepak bola.' }, telepon: { label: 'Telepon', text: 'Nada sambung yang panjang ke Jakarta.' } },
    choices: [
      { t: 'Beri wawancara ke media internasional setiap hari', fx: { tekanan: 20, cap: 2 }, go: 'jauh_kamis', note: 'Wajahmu muncul di tiga stasiun televisi Eropa. Di Jakarta, rumah orang tuamu didatangi lagi.' },
      { t: 'Telepon pusat dan bantu koordinasi dari jauh', fx: { massa: 5, pengaruh: 3 }, go: 'jauh_kamis', note: 'Kamu membacakan nomor-nomor LBH dan rumah sakit lewat telepon, satu per satu, sampai suaramu habis.' },
      { t: 'Tulis surat panjang untuk Ibu', fx: { ibu: 1, nyali: 5 }, go: 'jauh_kamis', note: 'Kamu tidak tahu apakah surat itu sampai.' }
    ]
  },
  jauh_kamis: {
    bab: 'Dari jauh', judul: 'Kamis Pagi', waktu: 'Kamis, 21 Mei 1998', scene: 'jauh', alt: 'Televisi kamar penginapan',
    text: ['Pukul empat pagi waktu Jenewa, Presiden membacakan pernyataan berhenti di televisi. Kamu menonton sendirian.'],
    choices: [
      { t: 'Pulang sekarang', run: s => { s.f.paspor_dicabut = s.sorotan >= 60; if (s.f.paspor_dicabut) s.ending = 'diasingkan'; else s.f.diLuar = false; }, go: s => s.ending ? 'akhir' : 'b18_semanggi', note: s => s.f.paspor_dicabut ? 'Kedutaan memberitahumu bahwa paspormu sudah dicabut. Kamu tidak bisa pulang.' : 'Kamu pulang pada bulan Juni. Kawan-kawan menjemputmu di bandara, dan beberapa dari mereka tidak kamu kenali lagi.' },
      { t: 'Tetap di luar negeri', run: s => { s.ending = 'diasingkan'; }, go: 'akhir', note: 'Kamu bilang kamu akan pulang tahun depan. Kamu mengatakannya lagi tahun depannya.' }
    ]
  },

  b14_terminal: {
    bab: 14, judul: 'Kabar dari Grogol', waktu: 'Selasa, 12 Mei 1998', bulan: '1998-05', scene: 'terminal', alt: 'Terminal bus Kampung Rambutan',
    enter: s => { for (const [k, st] of Object.entries(s.kader)) if (st === 'ditangkap' && (aktif('tigor') || s.ratna >= 3)) s.kader[k] = 'aktif'; return {}; },
    text: ['Bus dari luar kota berhenti di terminal Kampung Rambutan. Di pintu keluar, petugas memeriksa KTP penumpang satu per satu.'],
    hots: { petugas: { label: 'Petugas', text: 'Ia mencocokkan wajah dengan selembar kertas berisi foto-foto fotokopian.' }, antrean: { label: 'Antrean', text: 'Penumpang menunggu dengan sabar. Tidak ada yang mau terlihat terburu-buru.' } },
    choices: [
      { t: 'Tunjukkan KTP palsu', req: s => s.f.ktpPalsu, go: 'b14_sekre', note: 'Petugas membaca nama Joko Susilo keras-keras, lalu mengembalikan KTP-mu.' },
      { t: 'Selipkan uang di antara KTP', cost: () => harga(20000), dis: s => s.uang.tunai < harga(20000), alasan: 'uangmu tidak cukup', run: s => { if (Math.random() < 0.3) apply({ sorotan: 10 }); }, go: 'b14_sekre', note: 'Petugas memasukkan uangnya ke saku tanpa melihatmu.' },
      { t: 'Lewat pintu samping', run: s => { if (Math.random() < 0.5) apply({ sorotan: 10, nyali: -5 }); }, go: 'b14_sekre', note: 'Kamu menyelinap di antara kuli angkut. Seseorang berteriak di belakangmu, tapi kamu tidak menoleh.' }
    ]
  },
  b14_sekre: {
    bab: 14, judul: 'Kabar dari Grogol', waktu: 'Selasa, 12 Mei 1998 · malam', scene: 'sekre', v: 'radio', enter: { nyali: -5, iklim: 25 }, alt: 'Sekretariat malam dengan radio dan televisi',
    text: ['Menjelang malam, kabar datang dari radio dan telepon sekretariat: mahasiswa Universitas Trisakti ditembak setelah aksi damai di kampus mereka di Grogol.', 'Ruangan penuh wajah kawan. Semua mata menoleh ke presidium.'],
    kabar: s => [kabar('trisakti', s.bekal.includes('radio') ? 'radio' : 'tvri'), kabar('trisakti', 'warung'), kabar('trisakti', aktif('laras') ? 'laras' : 'ratna')],
    hots: { radio: { label: 'Radio', text: 'Penyiar radio swasta membacakan nama-nama rumah sakit yang menerima korban.' }, tv: { label: 'Televisi', text: 'TVRI menayangkan pernyataan Panglima. Tidak ada gambar dari Grogol.' }, telepon: { label: 'Telepon', text: 'Kampus-kampus lain menelepon bergantian, meminta satu komando.' }, kawan: { label: 'Wajah kawan', text: 'Bimo menangis. Dimas memukul meja. Mei diam setelah menelepon keluarganya di Glodok.' } },
    choices: () => {
      const opsi = [
        { t: 'Serukan aksi besar besok pagi', s: 'damar', fx: { massa: 10, nyali: 5, sorotan: 15, ricuh: 2, damar: 1 }, n: 'Selebaran stensil dicetak sampai subuh. Besok pagi kampus akan kosong, dan jalan raya akan penuh.' },
        { t: 'Malam berkabung: lilin, doa, pernyataan sikap', s: 'fikri', fx: { massa: 10, pengaruh: 5, ricuh: -1, fikri: 1 }, n: 'Kalian menyalakan seribu lilin. Pernyataan sikapmu dikutip tiga koran keesokan harinya.' },
        { t: 'Konsolidasi lintas kampus: satu komando, satu tuntutan', s: 'ratna', fx: { pengaruh: 15, sorotan: 10, ricuh: -1, ratna: 1 }, n: 'Pukul tiga pagi, perwakilan belasan kampus sepakat pada satu tuntutan: Presiden turun.' },
        { t: 'Tahan massa di kampus', s: 'yudi', fx: { massa: -10, ricuh: -1, sorotan: -5, yudi: 1 }, n: 'Gerbang kampus tetap tertutup. Sebagian mahasiswa memanjat pagar dan pergi sendiri.' }
      ];
      const top = Object.keys(SENIOR).sort((a, b) => S[b] - S[a]).at(0), menang = opsi.find(o => o.s === top);
      return opsi.map(o => ({ t: o.t, go: 'b15_atap', fx: S.pengaruh >= 75 ? o.fx : menang.fx, note: S.pengaruh >= 75 ? o.n : (o === menang ? menang.n : `Kamu mengusulkannya, tapi rapat mengikuti ${SENIOR[top]}. ${menang.n}`) }));
    }
  },
  b15_atap: {
    bab: 15, judul: 'Kota Terbakar', waktu: '13–15 Mei 1998', scene: 'atap', asap: 9, enter: { nyali: -6 }, alt: 'Atap kampus, asap hitam di cakrawala',
    text: ['Asap hitam naik dari banyak penjuru kota. Pusat perbelanjaan dijarah lalu dibakar. Saksi melihat kelompok orang tak dikenal berbadan tegap datang dengan truk, memancing warga, lalu menghilang.', 'Toko dan rumah warga Tionghoa menjadi sasaran. Lebih dari seribu orang tewas, banyak yang terjebak di gedung yang dibakar, dan banyak perempuan menjadi korban kekerasan seksual.'],
    hots: { asap: { label: 'Asap', text: 'Kamu menghitung kolom asap. Pagi tadi dua, sekarang lebih dari sembilan.' }, truk: { label: 'Truk', text: 'Truk tanpa tanda menurunkan orang-orang berambut cepak di dekat pusat perbelanjaan, lalu pergi.' }, kawan: { label: 'Bimo', text: '“Rumah sakit penuh. Mereka minta relawan dan kain kasa.”' }, radio: { label: 'Radio', text: 'Radio swasta membacakan daftar jalan yang harus dihindari. Daftarnya terus bertambah.' } },
    choices: [{ t: 'Turun ke gerbang kampus', go: 'b15_gerbang' }]
  },
  b15_gerbang: {
    mode: 'rounds', bab: 15, judul: 'Gerbang Kampus', waktu: '14 Mei 1998 · malam', scene: 'gerbang', v: 'malam', alt: 'Gerbang kampus di malam hari, warga di luar pagar',
    text: ['Di balik pagar kampus, dua hal terjadi bersamaan. Warga berdatangan meminta perlindungan, dan beberapa orang di luar pagar memanggil mahasiswa untuk ikut ke pertokoan.'],
    hots: { warga: { label: 'Warga', text: 'Keluarga-keluarga dengan tas seadanya. Seorang ayah menggendong anak yang tertidur.' }, provokator: { label: 'Orang berikat kepala', text: 'Ikat kepala merah yang seragam, jeriken di kaki. Kamu melihat orang yang sama di gerbang lain satu jam lalu.' }, mahasiswa: { label: 'Mahasiswa', text: 'Beberapa mahasiswa mulai memanjat pagar. Mata mereka merah, entah karena asap atau marah.' } },
    rounds: [
      { text: 'Warga di luar pagar memohon dibukakan gerbang. Mereka tidak diperiksa: kamu hanya memutuskan gerbang dibuka atau tidak.', options: [
        { t: 'Buka gerbang lebar-lebar', fx: { massa: 10, nyali: 5, sorotan: 5, ricuh: -1, fikri: 1, ratna: 1, posko: true }, note: 'Ratusan orang masuk. Ruang-ruang kuliah berubah menjadi tempat tidur.' },
        { t: 'Buka untuk perempuan, anak, dan orang tua dulu', fx: { massa: 6, posko: true }, note: 'Kamu membuka gerbang kecil. Antrean bergerak pelan tapi tertib.' },
        { t: 'Tutup gerbang, kampus harus aman dulu', fx: { massa: -10, nyali: -5, yudi: 1 }, note: 'Wajah-wajah di balik pagar tidak akan kamu lupakan.' }] },
      { text: s => { if (!s.m.kb) s.m.kb = kabar('sasaran', 'warung'); return `Seseorang di luar pagar berteriak: “${s.m.kb.teks}”`; }, options: [
        { t: 'Tunjuk orang berikat kepala itu di depan massa', fx: s => ({ ricuh: s.pengaruh >= 35 ? -2 : 0, pengaruh: 5 }), note: s => s.pengaruh >= 35 ? 'Massa mendengarkanmu. Orang-orang berikat kepala itu pergi sebelum dikerumuni.' : 'Tidak banyak yang mendengarkanmu. Beberapa mahasiswa tetap pergi.' },
        { t: 'Bujuk mahasiswa dengan orasi', fx: s => ({ ricuh: kutipan() || aktif('dimas') ? -2 : -1 }), note: s => aktif('dimas') ? 'Dimas naik ke atas meja dan membacakan sajak tentang api yang tidak memilih korban. Mereka turun dari pagar.' : 'Kamu bicara sampai suaramu habis. Sebagian besar tetap tinggal.' },
        { t: 'Biarkan yang mau pergi', fx: { ricuh: 3, massa: -10, nyali: -10 }, note: 'Kemarahan itu tidak memilih sasaran dengan adil. Kamu baru benar-benar paham saat membaca daftar korban beberapa hari kemudian.' }] },
      { text: s => aktif('mei') ? 'Telepon sekretariat berdering. Mei, suaranya pecah: keluarganya terjebak di toko mereka di Glodok.' : 'Malam makin larut. Kamu harus memastikan semua orang ada.', options: s => aktif('mei') ? [
        { t: 'Jemput keluarga Mei ke posko kampus', req: s2 => aktif('wahyu') && (aktif('asep') || s2.f.dapurUmum), fx: { nyali: -5, meiAman: true }, note: 'Wahyu menyetir mobil boks lewat jalan-jalan kampung yang ditunjukkan Asep. Subuh, keluarga Mei tidur di ruang kuliah lantai dua.' },
        { t: 'Telepon keluarganya agar mengungsi ke rumah tetangga', fx: { tokoMei: true }, note: 'Toko mereka terbakar malam itu. Keluarga Mei selamat karena disembunyikan tetangga di lantai atas rumahnya.' },
        { t: 'Antar Mei pulang bersama Bimo', fx: { nyali: -10, meiPergi: true }, note: 'Kalian menembus asap dengan motor. Keluarga Mei selamat. Mei memelukmu lama, dan kamu sudah tahu artinya.' }
      ] : [{ t: 'Hitung kepala', fx: { ricuh: -1 }, note: 'Kamu menghitung tiga kali. Tiga orang belum kembali. Mereka muncul subuh, selamat, dengan mata merah kena asap.' }] }
    ],
    done: s => ({ note: 'Fajar datang dengan bau hangus. Kamu belum tidur sejak dua hari lalu.', go: 'b15_putus' })
  },
  b15_putus: {
    bab: 15, judul: 'Kota Terbakar', waktu: '15 Mei 1998', scene: 'atap', asap: 14, alt: 'Atap kampus, asap di mana-mana',
    text: ['Presidium bertemu di atap gedung, tempat satu-satunya yang sinyal pager-nya masih jelas. Kamu harus memutuskan apa yang dikerjakan barisanmu selama kota terbakar.'],
    choices: [
      { t: 'Perkuat posko perlindungan di kampus', fx: { massa: 10, ricuh: -1, fikri: 1 }, go: 'b16_gerbang', note: 'Mahasiswa kedokteran membuka klinik darurat. Dapur umum memasak untuk warga sampai beras habis.' },
      { t: 'Tarik semua massa ke kampus dan hitung kepala', fx: { ricuh: -1, massa: 3, yudi: 1 }, go: 'b16_gerbang', note: 'Tidak ada mahasiswa kampusmu yang tercatat ikut menjarah.' },
      { t: 'Kirim tim dokumentasi untuk mencatat penggerak kerusuhan', fx: { pengaruh: 10, sorotan: 15, ratna: 1, bukti: 'dokumentasi' }, go: 'b16_gerbang', note: 'Tim pulang membawa foto truk dan daftar lokasi. Beberapa bulan kemudian, catatan seperti ini sampai ke Tim Gabungan Pencari Fakta.' },
      { t: 'Biarkan, ini kemarahan rakyat', fx: { massa: -15, nyali: -10, ricuh: 3 }, go: 'b16_gerbang', note: 'Kamu memalingkan muka. Kamu akan memalingkan muka dari ingatan ini selama bertahun-tahun.' }
    ]
  },

  b16_gerbang: {
    mode: 'inspect', level: 3, v: 'dpr', bab: 16, judul: 'Gerbang Senayan', waktu: 'Senin, 18 Mei 1998', bulan: '1998-05', scene: 'inspect', alt: 'Gerbang gedung DPR dengan kubah hijau di belakang',
    text: ['Ribuan mahasiswa menduduki gedung DPR/MPR. Sore ini Ketua DPR meminta Presiden mundur. Kamu menjaga ring pengaman di gerbang.'],
    rules: '<ul class="rules"><li>Kartu presidium bertinta merah, berlaku 18–25 Mei.</li><li>Kode hari ini: <b>Reformasi damai</b>.</li><li>Kartu pers wajib berstempel redaksi.</li></ul>',
    daftar: () => '<div class="sheet"><p><b>Kode hari ini: Reformasi damai</b></p><p>Tinta kartu presidium: merah. Wartawan tanpa stempel redaksi tidak boleh masuk.</p></div>', daftarLabel: 'Pegangan ring pengaman',
    visitors: s => {
      const pf = penyusupAktif() ? C[s.penyusup] : { head: 'kotak', hair: 'cepak', baju: 'almamater' }, pn = penyusupAktif() ? KADER[s.penyusup].nama : 'Herman';
      const list = [
        kartuSah('k1', 'Rizal Effendi', C.mhs1, 'Universitas Gelora Bangsa'),
        { id: 'peny', nama: pn, sah: false, sepatu: penyusupAktif() ? 'sneakers' : 'lars', face: pf, kode: 'Reformasi total', docs: [{ type: 'kartu', nama: pn, kampus: 'Universitas Gelora Bangsa', face: pf, palsu: true }], kata: penyusupAktif() ? '“Ini aku. Masa kamu tidak percaya kawan sendiri?”' : '“Saya dari ring C, disuruh ambil air.”', jawab: '“Kartuku basah kena hujan, jadi tintanya luntur.”', kebenaran: penyusupAktif() ? 'kartunya palsu. Tintanya ungu, bukan merah, dan ia tidak tahu kode hari ini.' : 'kartunya palsu dan sepatunya lars.' },
        kartuSah('k2', 'Nurul Hidayah', { head: 'oval', hair: 'kerudung', baju: 'almamater' }, 'IKIP Jakarta'),
        { id: 'pers1', nama: 'Bambang Sudarso', sah: true, sepatu: 'sneakers', face: { head: 'bulat', hair: 'belah', glasses: 'bulat', baju: 'kemeja' }, kode: '-', docs: [{ type: 'pers', nama: 'Bambang Sudarso', media: 'Harian Nusantara', no: 'HN-1121', stempel: true, face: { head: 'bulat', hair: 'belah', glasses: 'bulat', baju: 'kemeja' } }], kata: '“Saya mau wawancara presidium.”', jawab: '“Redaksi saya di Palmerah.”', salahTolak: 'Koran besok tidak memuat suara dari dalam gedung.' },
        { id: 'pers2', nama: 'Agus Wiranata', sah: false, sepatu: 'pantofel', face: { head: 'kotak', hair: 'belah', fh: 'kumis', baju: 'safari' }, kode: '-', docs: [{ type: 'pers', nama: 'Agus Wiranata', media: 'Mingguan Bangsa', no: '-', stempel: false, face: { head: 'kotak', hair: 'belah', fh: 'kumis', baju: 'safari' } }], kata: '“Wartawan. Cepat, saya dikejar tenggat.”', jawab: '“Redaksi? Ya, di Jakarta.”', kebenaran: 'wartawan gadungan. Kartunya tanpa stempel redaksi.' },
        { id: 'tokoh', nama: 'Seorang tokoh politik', sah: true, khusus: true, sepatu: 'pantofel', face: C.tokoh, kode: '-', docs: [{ type: 'none', teks: 'Tidak membawa kartu, membawa rombongan' }], kata: '“Saya ingin menyampaikan dukungan dari atas panggung.”', jawab: '“Partai kami selalu bersama mahasiswa.”' },
        kartuSah('k3', 'Hasan Basri', C.mhs3, 'Universitas Gelora Bangsa')
      ];
      if (s.f.damarDilepas) list.splice(3, 0, { id: 'damar', nama: 'Bang Damar', sah: true, khusus: true, sepatu: 'sandal', face: C.damarKurus, kode: '-', docs: [{ type: 'none', teks: 'KTM-nya disita saat ia diculik' }], kata: '“Ini aku.” Suaranya serak. Rambutnya dicukur habis, dan ada bekas luka di pergelangan tangannya.', jawab: '“Kamu yang dulu tanya kenapa harus dibentak, kan?”' });
      return list;
    },
    evaluate: (s, kep, list) => {
      const { fx, lines } = nilaiStandar(kep, list, (t, fx, lines) => {
        if (t.id === 'peny') { fx.ricuh = 1; lines.push(penyusupAktif() ? `${t.nama} masuk. Malam itu gerbang belakang terbuka sendiri, dan tiga orang asing ditemukan di dapur umum.` : 'Herman masuk, lalu menghilang ke arah gerbang belakang.'); }
        else { lines.push(`${t.nama} ternyata ${t.kebenaran}`); fx.sorotan = (fx.sorotan || 0) + 5; }
      });
      if (kep.tokoh === 'izin') { fx.yudi = 1; fx.fikri = -1; lines.push('Tokoh itu naik panggung. Massa bersorak, lalu sebagian bertanya-tanya untuk apa.'); }
      if (kep.damar) { if (kep.damar === 'tolak') { fx.damar = -2; fx.nyali = -10; lines.push('Kamu menolak Bang Damar karena tidak mengenalinya. Ia berbalik pergi tanpa marah. Belakangan seseorang memberitahumu siapa dia.'); } else { fx.nyali = 15; fx.damar = 2; lines.push('Kamu mengenali matanya. Bang Damar memelukmu di depan gerbang, dan ia tidak melepaskanmu untuk waktu yang lama.'); } }
      if (kep.peny === 'tolak' && penyusupAktif()) { s.f.penyusupKetahuan = true; s.kader[s.penyusup] = 'keluar'; fx.bukti = 'penyusup'; lines.push(`${KADER[s.penyusup].nama} tidak tahu kode hari ini. Saat kamu menahannya, ia lari ke arah truk tentara.`); }
      if (!lines.length) lines.push('Gerbangmu bersih sampai subuh.');
      return { fx, note: lines, go: s.f.suratBohong || s.f.suratJujur ? 'b16_bapak' : 'b16_kubah' };
    }
  },
  b16_bapak: {
    bab: 16, judul: 'Tamu dari Magelang', waktu: 'Selasa, 19 Mei 1998', scene: 'kubah', alt: 'Halaman gedung DPR yang penuh mahasiswa',
    text: s => [s.f.suratBohong ? 'Bapak berdiri di luar ring, masih memakai seragam Korpri. Ia naik bus semalaman. “Pulang. Sekarang. Bapak sudah tahu semuanya.”' : 'Bapak berdiri di luar ring dengan dua kantong plastik berisi nasi bungkus. “Ibumu yang masak. Bagi ke kawan-kawanmu.”'],
    choices: s => s.f.suratBohong ? [
      { t: 'Ikut Bapak pulang', run: s2 => { s2.f.patahSebab = 'bapak'; s2.ending = 'patah'; }, go: 'akhir', note: 'Kamu mengambil tas dan berjalan keluar ring. Kawan-kawan tidak menahanmu.' },
      { t: 'Yakinkan Bapak untuk pulang sendiri', req: s2 => s2.nyali >= 40, fx: { nyali: 10, bapak: 1 }, go: 'b16_kubah', note: 'Kamu bicara lama. Akhirnya Bapak menyerahkan uang saku dan berkata, “Telepon Ibumu tiap malam.”' },
      { t: 'Minta kawan mengantar Bapak keluar', fx: { nyali: -10, bapak: -1 }, go: 'b16_kubah', note: 'Kamu tidak sanggup menatapnya. Bimo mengantar Bapak ke halte.' }
    ] : [{ t: 'Makan bersama Bapak di tangga gedung', fx: { bapak: 1, nyali: 10, massa: 3 }, go: 'b16_kubah', note: 'Bapak duduk di tangga gedung DPR, di antara ratusan mahasiswa, dan makan nasi bungkus bersamamu. Ia tidak bicara banyak. Ia tidak perlu.' }]
  },
  b16_kubah: {
    mode: 'logistik', pendudukan: true, bab: 16, judul: 'Logistik Pendudukan', waktu: '19 Mei 1998', scene: 'kubah', alt: 'Atap kubah hijau penuh mahasiswa',
    text: ['Ribuan mahasiswa tidur di tangga, di lobi, dan di atap kubah hijau. Warga Senayan mengirim nasi bungkus berkarung-karung. Kamu mengatur belanja untuk dua hari ke depan.'],
    massaBenar: s => 2000 * (0.5 + s.massa / 100),
    next: 'b16_konflik'
  },
  b16_konflik: {
    bab: 16, judul: 'Gerbang Senayan', waktu: '19 Mei 1998 · malam', scene: 'kubah', alt: 'Atap kubah hijau',
    enter: s => s.f.rahasiaSimpan && s.ratna >= 1 && !s.f.rahasiaTerbongkar ? { massa: -30, rahasiaTerbongkar: true } : {},
    text: s => [s.f.rahasiaTerbongkar && s.f.rahasiaSimpan ? 'Kak Ratna memanggilmu ke depan presidium. Ia membacakan catatan interogasi yang didapat LBH. Namamu ada di situ, di samping semua yang kamu bocorkan.' : 'Presidium berkumpul di ruang fraksi yang kosong.', 'Radio memberitakan Presiden bertemu tokoh-tokoh agama dan menjanjikan reformasi bertahap. Presidium terbelah.'],
    kabar: s => [kabar('mundur', 'yudi'), kabar('mundur', 'damar')],
    choices: [
      { t: 'Atur logistik dan ring pengaman per kampus', fx: { massa: 10, pengaruh: 8, ricuh: -1, ratna: 1 }, go: s => penyusupAktif() ? 'b16_penyusup' : 'b16_amplop', note: 'Dua penyusup tanpa kartu digiring keluar sebelum sempat membuat onar.' },
      { t: 'Larang elite dan partai naik panggung', fx: { massa: 10, pengaruh: 5, fikri: 1 }, go: s => penyusupAktif() ? 'b16_penyusup' : 'b16_amplop', note: 'Seorang tokoh terkenal turun panggung dengan muka masam. Massa bersorak.' },
      { t: 'Buka dialog dengan fraksi dan tokoh', fx: { pengaruh: 12, massa: -5, yudi: 2 }, go: s => penyusupAktif() ? 'b16_penyusup' : 'b16_amplop', note: 'Kamu pulang membawa nomor telepon tiga orang penting. Beberapa kawan mulai memanggilmu “Pak Dewan”.' },
      { t: 'Tolak semua negosiasi dan menginap sampai Presiden turun', fx: { massa: 8, nyali: -5, sorotan: 5, damar: 1 }, go: s => penyusupAktif() ? 'b16_penyusup' : 'b16_amplop', note: 'Malam kedua hujan turun. Spanduk dijadikan selimut. Tidak ada yang pulang.' }
    ]
  },
  b16_penyusup: {
    bab: 16, judul: 'Wajah yang Kamu Kenal', waktu: '20 Mei 1998', scene: 'lorongDpr', alt: 'Lorong gedung DPR',
    text: s => [`${KADER[s.penyusup].nama} datang ke lorong bersama seorang laki-laki bersafari. Saat melihatmu, ia memalingkan muka. Semuanya tiba-tiba masuk akal: jadwal yang bocor, warna gelang, instruksi yang terbalik.`],
    choices: [
      { t: 'Konfrontasi di tempat', fx: { nyali: -5, bukti: 'penyusup', penyusupKetahuan: true }, run: s => { s.kader[s.penyusup] = 'keluar'; }, go: 'b16_amplop', note: s => `${KADER[s.penyusup].nama} tidak membantah. “Mereka memegang adikku,” katanya, lalu pergi.` },
      { t: 'Biarkan ia pergi', fx: { penyusupKetahuan: true }, run: s => { s.kader[s.penyusup] = 'keluar'; }, go: 'b16_amplop', note: 'Kamu memberinya jalan. Kamu tidak pernah melihatnya lagi, kecuali di televisi bertahun-tahun kemudian.' },
      { t: 'Serahkan ke presidium', fx: { massa: 5, penyusupKetahuan: true, bukti: 'penyusup' }, run: s => { s.kader[s.penyusup] = 'keluar'; }, go: 'b16_amplop', note: 'Presidium menginterogasinya semalaman, dengan pertanyaan-pertanyaan yang dulu ditanyakan kepadamu.' }
    ]
  },
  b16_amplop: {
    bab: 16, judul: 'Amplop Cokelat', waktu: 'Rabu, 20 Mei 1998 · malam', scene: 'lorongDpr', enter: { nyali: -5 }, alt: 'Laki-laki bersafari menyodorkan amplop cokelat',
    text: ['Rencana aksi besar di Monas hari ini batal setelah tentara menutup kawasan itu.', 'Malamnya, seorang laki-laki bersafari menemuimu di lorong. Ia menyebut nama kampung Bapak dengan benar, lalu menyodorkan amplop cokelat. “Bubarkan massa besok pagi. Beasiswa ke luar negeri, pekerjaan, keluarga aman.”'],
    hots: { safari: { label: 'Laki-laki bersafari', text: 'Lencana kecil di kerahnya, tanpa nama.' }, amplop: { label: 'Amplop', text: 'Tebal. Terlalu tebal untuk sekadar uang transpor.' } },
    choices: [
      { t: 'Tolak, lalu umumkan tawaran itu di depan massa', fx: { massa: 12, sorotan: 15, nyali: 5, damar: 1 }, go: 'b17_lobi', note: 'Kamu mengangkat amplop itu di atas panggung tanpa membukanya. Sorakan massa terdengar sampai ke Jalan Gatot Subroto.' },
      { t: 'Tolak dengan tenang, lalu lapor ke presidium', fx: { nyali: 3, pengaruh: 3, ratna: 1 }, go: 'b17_lobi', note: 'Presidium menambah penjaga di sekitarmu dan memindahkan Ibu ke rumah saudara malam itu juga.' },
      { t: 'Terima demi keluarga', fx: { massa: -10, suap: true, suapKiriman: true, yudi: 1 }, go: 'b17_lobi', note: 'Amplop itu terasa berat di tasmu. Sampai pagi, kamu belum tahu apakah akan menjalankan bagianmu dari kesepakatan itu.' }
    ]
  },
  b17_lobi: {
    bab: 17, judul: 'Kamis Pagi', waktu: 'Kamis, 21 Mei 1998', scene: 'lobi', alt: 'Ratusan mahasiswa menatap televisi tabung di lobi DPR',
    enter: s => { if (s.f.meiPergi && s.kader.mei) s.kader.mei = 'pergi'; for (const [k, st] of Object.entries(s.kader)) if (st === 'ditangkap') s.kader[k] = 'aktif'; return {}; },
    text: s => ['Kamu berdesakan bersama ratusan mahasiswa di depan televisi tabung di atas meja satpam. Pukul sembilan pagi, Presiden membacakan pernyataan berhenti dari jabatannya, dan Wakil Presiden diambil sumpahnya.', 'Gedung pecah oleh teriakan, tangis, dan sujud syukur.' + (s.f.suap ? ' Kamu ikut bersorak, dengan amplop cokelat masih di tasmu.' : ''), 'Status DPO-mu dicabut diam-diam beberapa minggu kemudian. Tidak ada yang meminta maaf.'],
    choices: [{ t: 'Pulang dan tidur untuk pertama kalinya dalam seminggu', fx: { nyali: 15 }, go: 'b18_semanggi' }]
  }
});
