/* Angkatan 98 · selingan: momen ringan, malam tanpa tidur, suara batin, dan jejak pilihan di akhir cerita */

// Bang Yos selamat kalau kamu menyembunyikannya atau mengantarnya ke Damar, dan ia tidak tertangkap
const yosAda = s => !!s.f.yosPercaya && !s.f.yosTertangkap;
const kembaliSela = s => { const k = s.f.kembaliKe; s.f.kembaliKe = null; return k; };
const KADER_URUT = ['laras', 'bimo', 'mei', 'wahyu', 'dimas', 'tigor', 'asep'];
const kaderPertama = () => KADER_URUT.find(aktif);

/* ---------- kapan selingan datang ---------- */
// satu selingan per perpindahan; momen ringan sekali seumur permainan, malam tanpa tidur hanya saat nyali tipis
function selaJatuh(tujuan) {
  const T = NODES[tujuan];
  if (!T || S.f.diLuar || S.bulan >= '1999-01') return null;
  const sekali = (k, ok) => { if (!ok || S.f['sela_' + k]) return false; S.f['sela_' + k] = true; return true; };
  if (sekali('nyanyi', tujuan === 'kos2')) return 'sela_nyanyi';
  if (sekali('ultah', tujuan === 'kos3')) return 'sela_ultah';
  if (sekali('keliling', tujuan === 'kos5')) return 'sela_keliling';
  if (sekali('piala', tujuan === 'b18_semanggi')) return 'sela_piala';
  if (T.mode === 'kos' && S.uang.tunai < harga(15000) && (S.f.tolongKali || 0) < 2 && S.f.tolongDi !== tujuan) {
    S.f.tolongKali = (S.f.tolongKali || 0) + 1; S.f.tolongDi = tujuan; return 'sela_tolong';
  }
  const malamAksi = tujuan === 'b9_kumpul';
  if ((T.mode === 'kos' || malamAksi) && S.nyali < (malamAksi ? 50 : 35) && S.f.insomniaDi !== tujuan) {
    const k = S.f.keputusan;
    S.f.insomniaDi = tujuan;
    S.f.insomniaJenis = malamAksi ? 'aksi' : S.f.gagal ? 'sesudah' : k ? 'sebelum' : 'biasa';
    return 'insomnia';
  }
  return null;
}

/* ---------- suara batin ---------- */
const pendek = t => { const x = String(t).replace(/<[^>]+>/g, ''); return x.length > 70 ? x.slice(0, 68).replace(/\s\S*$/, '') + '…' : x; };
const BATIN = {
  hancur: ['Tanganmu tidak berhenti gemetar sejak pagi. Kamu menyembunyikannya di saku supaya kawan-kawan tidak melihat.', 'Ada suara kecil di kepalamu yang bertanya: kalau kamu berhenti sekarang, siapa yang akan menyalahkanmu?', 'Kamu lupa kapan terakhir kali tidur lebih dari tiga jam.'],
  diawasi: ['Kamu berhenti duduk membelakangi pintu.', 'Di warung, kamu memesan tanpa menyebut nama. Kebiasaan baru yang tidak kamu sukai.', 'Setiap orang asing yang terlalu ramah kini terasa seperti pertanyaan.'],
  ragu: [s => `“${pendek(s.f.gagal.t)}” Kalimat itu terus berulang di kepalamu. Kamu belum bisa memutuskan apakah itu keberanian atau kecerobohan.`, () => 'Kawan-kawan bilang kamu sudah melakukan yang terbaik. Kamu tidak yakin mereka sungguh-sungguh.'],
  cemas: ['Setiap motor yang melambat di depan kos membuatmu menahan napas.', 'Kamu mulai menghitung siapa saja yang tahu alamatmu.', 'Kamu ingin percaya bahwa yang kamu lakukan ada artinya. Hari ini, percaya terasa berat.'],
  yakin: ['Untuk pertama kalinya, kamu merasa barisan di belakangmu bukan sekadar kerumunan.', 'Kamu masih takut. Tapi takut itu sekarang punya teman.'],
  rindu: ['Kamu teringat dapur rumah di Magelang: bau tempe goreng, suara radio, Bapak yang pura-pura membaca koran.', 'Sudah lama kamu tidak mendengar suara Ibu. Kamu tidak tahu apakah itu karena sibuk atau karena takut ditanya.'],
  biasa: ['Kamu menimbang-nimbang. Di kepalamu, setiap pilihan punya wajah orang yang akan menanggungnya.', 'Dua tahun lalu kamu belum peduli soal semua ini. Kamu masih belum tahu apakah dulu itu lebih baik.']
};
function moodKu() {
  const k = S.f.keputusan, dingin = Object.keys(SENIOR).find(id => sikap(id) === 'dingin'), top = Object.keys(SENIOR).reduce((a, b) => S[b] > S[a] ? b : a);
  if (S.nyali < 20) return ['hancur'];
  if (S.sorotan >= 65) return ['diawasi'];
  if (S.f.gagal && S.f.gagal.bulan === S.bulan) return ['ragu'];
  if (dingin && (S.bulan < '1998-03' || dingin !== 'damar')) return ['pendapat', `Kamu teringat tatapan ${SENIOR[dingin]} terakhir kali kalian bicara. Mungkin waktu itu kamu terlalu cepat menjawab.`];
  if (S.nyali < 40) return ['cemas'];
  if (S.nyali >= 65 && S.massa >= 55) return ['yakin'];
  if (S.rel.ibu <= 2 || S.rel.bapak <= 1) return ['rindu'];
  if (S[top] >= 3) return ['pendapat', `Makin hari kamu makin mengerti cara ${SENIOR[top]} melihat dunia. Kamu belum tahu apakah itu hal baik.`];
  return ['biasa'];
}
// satu baris batin per adegan, dipilih tetap menurut nama adegan supaya tidak berganti setiap kali layar digambar ulang
function batinHTML(n) {
  if (!n.choices || S.ui.last || n.aman) return '';
  const [m, teks] = moodKu(), h = [...S.node].reduce((a, c) => a + c.charCodeAt(0), 0);
  if (m === 'biasa' && h % 3) return '';
  const t = teks || val(BATIN[m][h % BATIN[m].length]);
  return `<p class="batin">${t}</p>`;
}
// sesudah memilih: kadang protagonis mempertanyakan keputusannya sendiri
const SESAL = ['Kamu bertanya-tanya apakah ada jalan lain yang tidak kamu lihat.', 'Benarkah itu satu-satunya pilihan? Kamu tidak yakin, dan kamu tidak bisa kembali untuk memeriksanya.', 'Yang paling berat bukan akibatnya, tapi kenyataan bahwa kamu sendiri yang memilihnya.'];
const WASPADA = ['Terlalu mudah. Kamu menunggu harganya datang.', 'Kamu lega, lalu malu karena lega. Mungkin orang lain yang membayarnya di tempat lain.', 'Kamu ingin percaya ini keputusan yang benar. Kamu juga tahu, merasa benar belum tentu sama dengan benar.'];
const renungan = (buruk, n) => !n || Math.random() < 0.45 ? '' : pick(buruk ? SESAL : WASPADA);

/* ---------- malam tanpa tidur ---------- */
const TERBURUK = ['pintu kos digedor sebelum subuh, dan orang-orang yang masuk sudah tahu namamu.', 'Ibu menerima telepon dari nomor yang tidak dikenal, dan suara di seberang menyebut namamu pelan-pelan.', 'kawan yang paling kamu percaya duduk di ruang periksa, dan semua yang ia katakan berawal dari keputusanmu.', 'tidak terjadi apa-apa. Tidak ada yang berubah, dan semua yang kamu korbankan ternyata sia-sia.', 'koran pagi memuat fotomu dengan judul yang salah, dan orang-orang yang kamu bela memalingkan muka.'];
const TERBURUK_AKSI = ['barisan tameng menutup jalan dari dua arah, dan gang yang kamu andalkan sudah dijaga sejak subuh.', 'botol bensin melayang dari tengah barisanmu sendiri, dan foto di koran besok hanya memperlihatkan api.', 'air minum habis sebelum siang, dan anak-anak baru pingsan satu per satu di aspal.', 'tidak ada yang datang. Kamu berdiri di gerbang dengan toa, dan yang mendengar hanya intel di seberang jalan.'];
const ANDAI = ['tidak ada yang terluka, dan kawan-kawan masih tertawa di sekretariat seperti biasa.', 'Bapak tidak perlu tahu apa-apa, dan Ibu tetap tidur nyenyak.', 'orang-orang yang kamu bela tetap percaya padamu.', 'kamu pulang lebih awal dan tidur tanpa mimpi.'];
function teksInsomnia(s) {
  const k = s.f.insomniaJenis === 'sesudah' ? s.f.gagal : s.f.keputusan, j = s.f.insomniaJenis, buka = 'Lampu sudah mati sejak tadi. Kipas angin berderit, dan kamu menghitung retakan di langit-langit.';
  if (j === 'aksi') return [buka, 'Besok aksi. Kepalamu memutar ulang rencana di papan tulis, ruas demi ruas.', `Lalu bayangan itu datang dengan sendirinya: ${pick(TERBURUK_AKSI)}`, 'Kamu tahu bayangan itu belum tentu terjadi. Kamu juga tahu, tidak ada yang bisa menjamin sebaliknya.'];
  if (j === 'sesudah') return [buka, `Kamu memutar ulang hari itu. “${pendek(k.t)}”, begitu keputusanmu.`, `Bagaimana kalau kamu memilih “${pendek(pick(k.lain))}”? Di kepalamu, versi itu berjalan lebih baik: ${pick(ANDAI)}`, 'Lalu kamu ingat: jalan yang tidak dipilih selalu tampak lebih bersih, karena tidak ada yang pernah mengujinya.'];
  if (j === 'sebelum') return [buka, `Kamu teringat keputusanmu: “${pendek(k.t)}”. Akibatnya belum datang, dan justru itu yang membuatmu terjaga.`, `Kamu membayangkan akibat terburuknya: ${pick(TERBURUK)}`];
  return [buka, 'Tidak ada yang terjadi hari ini. Tapi kepalamu tetap menyusun daftar: siapa yang tahu alamatmu, siapa yang bisa ditanya, siapa yang mungkin bicara.'];
}

Object.assign(NODES, {
  insomnia: {
    aman: true, bab: 'Malam', judul: 'Tidak Bisa Tidur', waktu: s => namaBulan(s.bulan), scene: 'kos', v: 'malam', alt: 'Kamar kos gelap, langit-langit retak',
    text: s => s.ui.insomnia || (s.ui.insomnia = teksInsomnia(s)),
    choices: [
      { t: 'Bangun, nyalakan lampu, dan tulis di buku catatan', fx: { nyali: 4 }, run: s => { s.f.keputusan = null; s.f.gagal = null; s.f.catatanMalam = (s.f.catatanMalam || 0) + 1; }, note: 'Kamu menulis sampai tanganmu pegal. Kalimat-kalimatnya tidak menjawab apa pun, tapi kepalamu sedikit lebih sepi.', go: kembaliSela },
      { t: 'Paksa memejamkan mata', run: s => { s.f.keputusan = null; s.f.gagal = null; s.ui.tmp = Math.random() < 0.5; apply({ nyali: s.ui.tmp ? 6 : -3 }); }, note: s => s.ui.tmp ? 'Entah kapan, kamu tertidur. Pagi datang tanpa mimpi.' : 'Azan subuh terdengar sebelum matamu benar-benar terpejam.', go: kembaliSela },
      { t: 'Keluar ke lorong, mungkin ada yang juga belum tidur', run: s => { s.f.keputusan = null; s.f.gagal = null; const k = kaderPertama(); s.ui.tmp = k; if (k) tambahDekat(k, 1); apply({ nyali: 3 }); }, note: s => s.ui.tmp ? `${KADER[s.ui.tmp].nama} duduk di tangga, juga tidak bisa tidur. Kalian tidak membicarakan apa pun yang penting, dan itu justru yang kalian butuhkan.` : 'Lampu ruang tamu ibu kos masih menyala. Radio memutar keroncong pelan. Kamu duduk di sana sampai mengantuk.', go: kembaliSela }
    ]
  },

  /* ---------- momen ringan ---------- */
  sela_nyanyi: {
    aman: true, bab: 'Selingan', judul: 'Lagu Kamis Malam', waktu: 'November 1996', scene: 'sekre', v: 'kamis', alt: 'Sekretariat diterangi lilin, seseorang memetik gitar',
    text: s => [`Kamis malam, listrik padam lagi dan diskusi selesai lebih cepat. Seseorang menyalakan lilin, dan ${aktif('wahyu') ? 'Wahyu' : 'seorang anak Teknik'} mengambil gitar dari pojok.`, 'Mereka menyanyikan lagu-lagu Iwan Fals, lalu sebuah lagu yang belum pernah kamu dengar. Semua orang hafal liriknya kecuali kamu: “Darah Juang”. Bang Damar menyanyi dengan mata terpejam. Kak Ratna pura-pura tidak hafal, tapi bibirnya ikut bergerak.'],
    choices: [
      { t: 'Ikut menyanyi, meski salah lirik', fx: { nyali: 5 }, run: () => { ubahHati('damar', 1); ubahHati('fikri', 1); }, note: 'Kamu salah di bait kedua, dan tidak ada yang peduli. Untuk satu lagu, sekretariat itu terasa seperti rumah.', go: kembaliSela },
      { t: 'Minta diajari liriknya, lalu tulis di buku', fx: { nyali: 3 }, run: () => ubahHati('ratna', 2), note: 'Kak Ratna menuliskan liriknya di halaman belakang bukumu, lengkap dengan nama penciptanya. “Lagu juga perlu dicatat.”', go: kembaliSela },
      { t: 'Diam di pojok dan mendengarkan', fx: { nyali: 2 }, note: 'Ada yang menyodorkan kopi tanpa bertanya. Kamu menyimpan malam itu lama sekali.', go: kembaliSela }
    ]
  },
  sela_ultah: {
    aman: true, bab: 'Selingan', judul: 'Satu Lilin', waktu: 'Maret 1997', scene: 'sekre', v: 'kamis', alt: 'Martabak manis dengan satu lilin di meja sekretariat',
    text: s => { const k = kaderPertama(), nama = k ? KADER[k].nama : 'Sri Wulandari'; return [`Hari ini ${nama} berulang tahun yang kedua puluh. Tidak ada yang punya uang untuk kue, jadi kalian patungan membeli martabak manis dan menancapkan satu lilin di tengahnya.`, 'Kak Ratna membawa termos teh. Bang Damar menyumbang sebungkus kretek, lalu ditegur karena itu bukan hadiah. Sekretariat yang biasanya penuh debat malam ini penuh tawa.']; },
    choices: [
      { t: s => `Belikan ${kaderPertama() ? KADER[kaderPertama()].nama : 'Sri'} hadiah kecil`, cost: () => harga(5000), dis: s => s.uang.tunai < harga(5000), alasan: 'uangmu tidak cukup', run: () => { const k = kaderPertama(); if (k) { tambahDekat(k, 1); ubahHati(k, 2); } else ubahHati('ratna', 1); }, note: s => `${kaderPertama() ? KADER[kaderPertama()].nama : 'Sri'} memegang hadiahmu lama. “Tidak ada yang pernah ingat tanggal ini, kecuali ibuku.”`, go: kembaliSela },
      { t: 'Bacakan ucapan selamat yang konyol di depan semua orang', fx: { nyali: 4 }, run: () => ubahHati('fikri', 1), note: 'Semua orang tertawa sampai Bang Fikri harus menyeka matanya. Malam itu tidak ada yang membicarakan intel.', go: kembaliSela },
      { t: 'Ikut makan, lalu pulang lebih awal untuk belajar', fx: { ipk: 0.05 }, note: 'Kamu membawa pulang sepotong martabak untuk ibu kos. Ujian tengah semester tinggal seminggu.', go: kembaliSela }
    ]
  },
  sela_keliling: {
    aman: true, bab: 'Selingan', judul: 'Jakarta Tengah Malam', waktu: 'malam 17 Agustus 1997', scene: 'bus', alt: 'Jalanan Jakarta yang kosong dari jendela angkot',
    text: s => ['Malam menjelang 17 Agustus. Gang-gang dihias umbul-umbul, dan di ujung jalan ada panggung dangdut tujuh belasan.', `${aktif('wahyu') ? 'Wahyu meminjam angkot bapaknya dan mengajak kalian' : 'Kawan sebelah kamar mengajakmu naik motor tuanya,'} berkeliling Jakarta tengah malam: Senen, Monas, sampai pelabuhan. Jalanan kosong. Kota yang siang hari terasa mengancam, malam ini terasa milik kalian.`],
    choices: [
      { t: 'Berhenti makan nasi goreng dan ngobrol sampai subuh', fx: { nyali: 6 }, run: () => { if (aktif('wahyu')) tambahDekat('wahyu', 1); }, note: 'Kalian bicara soal cita-cita, bukan soal rezim. Ternyata cita-cita semua orang sederhana sekali.', go: kembaliSela },
      { t: 'Berteriak sekeras-kerasnya di jalan yang kosong', fx: { nyali: 8, sorotan: 2 }, note: 'Kalian meneriakkan apa saja: nama mantan, nama dosen, nama presiden. Hansip di pos ronda hanya menggeleng.', go: kembaliSela },
      { t: 'Mampir ke panggung tujuh belasan dan ikut lomba joget', fx: { massa: 3, nyali: 4 }, note: 'Kamu kalah di babak pertama. Ibu-ibu kampung yang menonton masih mengenali wajahmu berbulan-bulan kemudian.', go: kembaliSela }
    ]
  },
  sela_tolong: {
    aman: true, bab: 'Selingan', judul: 'Dompet Kosong', waktu: s => namaBulan(s.bulan), scene: 'kos', alt: 'Dompet terbuka di atas kasur, isinya receh',
    text: ['Dompetmu tinggal recehan, dan kiriman dari rumah belum datang. Sudah dua hari kamu makan mi instan yang dibagi dua.', 'Kamu harus meminta tolong seseorang. Bagian ini lebih sulit dari aksi mana pun.'],
    choices: [
      { t: 'Minta keringanan ke ibu kos', fx: () => ({ uang: harga(5000), nyali: 3 }), note: 'Ibu kos tidak menjawab. Malamnya, sepiring nasi dan sayur lodeh muncul di depan pintumu, dan ia tidak pernah menagihnya.', go: kembaliSela },
      { t: s => `Minta tolong ${KADER[kaderPertama()].nama}`, req: () => !!kaderPertama(), fx: () => ({ uang: harga(15000) }), run: () => { const k = kaderPertama(); tambahDekat(k, 1); ubahHati(k, 1); }, note: () => `${KADER[kaderPertama()].nama} mengosongkan dompetnya tanpa bertanya. “Nanti gantian.” Kalian berdua tahu tidak ada yang mencatat utang itu.`, go: kembaliSela },
      { t: 'Kasbon di warung Pak RT', req: s => s.f.dapurUmum, fx: () => ({ uang: harga(15000) }), note: 'Pak RT menulis namamu di buku kasbon, lalu mencoretnya lagi di depanmu. “Dapur umum sudah membayarnya.”', go: kembaliSela },
      { t: 'Tahan saja, jangan merepotkan siapa pun', fx: { nyali: -5 }, note: 'Kamu bertahan dengan air putih dan gengsi. Di kelas, kepalamu terasa ringan dan suara dosen terdengar jauh sekali.', go: kembaliSela }
    ]
  },
  sela_piala: {
    aman: true, bab: 'Selingan', judul: 'Final', waktu: 'dini hari, 13 Juli 1998', scene: 'sekre', v: 'radio', alt: 'Televisi pinjaman di atas meja stensil sekretariat',
    text: ['Final Piala Dunia, Prancis melawan Brasil. Sekretariat penuh orang yang biasanya bertengkar soal strategi. Malam ini mereka bertengkar soal Ronaldo.', 'Televisi pinjaman dari ibu kos dipasang di atas meja stensil. Ada yang membawa kacang rebus, ada yang tidur di tikar dan terbangun setiap kali orang berteriak. Selama dua jam, tidak ada yang membicarakan orang hilang.'],
    choices: [
      { t: 'Dukung Brasil, seperti hampir semua orang di ruangan', fx: { nyali: 5 }, note: 'Zidane mencetak dua gol dengan kepala, dan Prancis menang tiga-nol. Kalian kalah bersama-sama, dan anehnya itu terasa menyenangkan.', go: kembaliSela },
      { t: 'Dukung Prancis, sendirian melawan arus', fx: { nyali: 5 }, note: 'Kamu bersorak sendirian setiap kali Prancis mencetak gol, dan seseorang melemparimu kulit kacang. Besoknya semua orang masih membicarakannya.', go: kembaliSela },
      { t: 'Tertidur sebelum babak kedua', fx: { nyali: 8 }, note: 'Kamu terbangun saat azan subuh, dengan jaket seseorang menyelimutimu. Tidak ada yang mau mengaku itu jaket siapa.', go: kembaliSela }
    ]
  }
});

/* ---------- Bang Yos, kalau ia memimpin PENA ---------- */
Object.assign(DIALOG, {
  yos_pena: {
    nama: 'Bang Yos', siapa: 'yos', req: s => s.f.yosPemimpin,
    giliran: [
      { kata: '“Mereka mencoret dinding kita dengan tiga huruf, dan rektorat langsung membekukan kita.” Bang Yos menyingkirkan pecahan kaca dengan ujung sandalnya. “Menurutmu kita harus marah atau pintar?”', opsi: [
        ['Marah. Kalau kita diam, mereka akan mencoret lebih banyak dinding.', 'n', '“Marah itu bensin. Jangan sampai kita yang terbakar.”', { damar: 1 }],
        ['Pintar dulu, Bang. Marahnya kita simpan untuk saat yang tepat.', 's', '“Itu jawaban orang yang pernah menunggu razia lewat.” Ia tersenyum tipis.'],
        ['Mungkin kita kurangi kegiatan dulu, Bang.', 'l', 'Bang Yos menatapmu lama. “Aku pernah dikejar sampai ke depan kamarmu. Mengurangi kegiatan tidak membuat mereka berhenti.”', { yudi: 1 }]] },
      { kata: '“Aku butuh orang yang memegang daftar anggota. Bukan yang paling berani. Yang paling bisa tutup mulut.”', opsi: [
        ['Bakar saja daftarnya, Bang. Lebih aman tanpa catatan.', 'l', '“Tanpa catatan, kalau ada yang hilang kita bahkan tidak tahu siapa.”', { ratna: -1 }],
        ['Aku bisa, Bang. Daftar itu tidak akan keluar dari tanganku.', 's', '“Aku tahu.” Ia tidak menjelaskan bagaimana ia tahu.', { ratna: 1 }],
        ['Jangan aku, Bang. Aku belum siap ditanya-tanya.', 'n', '“Jujur juga.” Ia mengangguk. “Itu lebih baik daripada berani tapi bocor.”']] },
      { kata: '“Satu hal lagi.” Ia merendahkan suaranya. “Utangku padamu belum lunas. Kalau suatu hari kamu terdesak, cari aku. Di mana pun.”', opsi: [
        ['Bang Yos tidak berutang apa-apa.', 'n', '“Itu bukan keputusanmu.” Ia tertawa kecil.'],
        ['Aku akan ingat, Bang.', 's', 'Ia menjabat tanganmu, lama dan keras, seperti orang yang sedang menandatangani sesuatu.'],
        ['Semoga aku tidak perlu, Bang.', 'n', '“Semoga.” Ia tidak terdengar yakin.']] }
    ],
    tutup: { hangat: 'Sebelum pergi, Bang Yos menuliskan alamat sebuah rumah di Bekasi di bungkus rokokmu. “Hafalkan, lalu buang.”', biasa: 'Bang Yos kembali menyingkirkan pecahan kaca sambil bersiul pelan.', dingin: 'Bang Yos pergi tanpa menoleh, tapi ia tetap meninggalkan nomor pager-nya di meja.' }
  }
});
NODES.b4_teror.bicara = ['yos_pena'];

/* ---------- jejak pilihan di akhir cerita: disebut samar, tidak dihitung ---------- */
function jejakPilihan(s) {
  const out = [], tambah = (ok, t) => { if (ok && out.length < 5) out.push(t); };
  tambah(s.f.yosTertangkap && !s.f.yosPercaya, 'Ada ketukan tiga kali di bulan September 1996 yang tidak pernah berlanjut. Kamu jarang memikirkannya.');
  tambah(yosAda(s), 'Seseorang yang dulu mengetuk pintumu tidak pernah lupa jalan pulang ke pintu yang sama.');
  tambah(s.f.intelMasuk, 'Satu wajah yang kamu biarkan lewat di pintu sekretariat ikut mencatat banyak hal sesudahnya.');
  for (const k of Object.keys(SENIOR)) {
    tambah(sikap(k) === 'dingin', `${SENIOR[k]} pernah berhenti menyimpankan kursi untukmu. Kamu baru sadar setelah kursi itu lama kosong.`);
    tambah(sikap(k) === 'hangat', `Di rapat-rapat yang tidak kamu hadiri, ${SENIOR[k]} beberapa kali menyebut namamu.`);
  }
  tambah(s.f.bohongBapak || s.f.suratBohong, 'Ada surat ke Magelang yang isinya tidak sepenuhnya benar. Bapak menyimpannya lebih lama dari yang kamu kira.');
  tambah(s.f.suratJujur || s.f.jujurBapak, 'Kamu pernah jujur kepada Bapak. Kejujuran itu ternyata lebih mahal, dan sekaligus lebih ringan, dari yang kamu kira.');
  tambah(s.f.dapurUmum, 'Antrean nasi di rumah Pak RT mengingat wajahmu lebih lama daripada koran mana pun.');
  tambah(penyusupAktif(), 'Ada kawan yang selalu tahu jadwal rapat lebih dulu. Kamu tidak pernah benar-benar menanyakannya.');
  tambah(s.f.damarPublik, 'Saat Bang Damar hilang, kamu memilih bersuara. Suara itu ikut menentukan siapa yang dicari, dan siapa yang mencari.');
  tambah(s.f.suap, 'Amplop cokelat itu tidak pernah benar-benar keluar dari tasmu.');
  tambah((s.f.dika_berani || 0) > (s.f.dika_hati || 0), 'Surat-suratmu ke Dika lebih sering bicara soal keberanian daripada soal pulang.');
  tambah((s.f.dika_hati || 0) > (s.f.dika_berani || 0), 'Surat-suratmu ke Dika lebih sering mengajarinya cara mundur.');
  return out;
}
