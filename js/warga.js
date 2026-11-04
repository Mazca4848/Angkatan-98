/* Angkatan 98 · warga di Hari yang Berulang: pelapor, anak tiap senior, tokoh sampingan, suara masyarakat, benda petunjuk.
   Semua percakapan di sini memakai sistem bicara yang sama (DIALOG); mini game obrolan kos juga dilebur ke sini. */

/* ---------- tokoh ---------- */
Object.assign(C, {
  jefri: { head: 'kotak', hair: 'gondrong', baju: 'kaus' },
  sari: { head: 'oval', hair: 'kuncir', baju: 'jins' },
  rudi: { head: 'bulat', hair: 'keriting', glasses: 'kotak', fh: 'jenggot', baju: 'jins' },
  sri: { head: 'oval', hair: 'bob', mark: 'tahi', baju: 'kaus' },
  dewi: { head: 'oval', hair: 'kerudung', baju: 'kemeja' },
  agus: { head: 'bulat', hair: 'peci', baju: 'kemeja' },
  bayu: { head: 'kotak', hair: 'cepak', baju: 'almamater' },
  teguh: { head: 'oval', hair: 'belah', glasses: 'kotak', baju: 'kemeja' },
  kardi: { head: 'panjang', hair: 'uban', baju: 'kaus' },
  wali: { head: 'oval', hair: 'kerudung', glasses: 'kotak', baju: 'batik' },
  tetangga: { head: 'bulat', hair: 'belah', baju: 'kaus' }
});
Object.assign(RAUT_BERLAWANAN, { ibukos: 'gugup', pakrt: 'gugup', kardi: 'sedih', wali: 'marah', tetangga: 'marah', sri: 'sedih', dewi: 'sedih', teguh: 'gugup' });

// anak: anak tiap senior. bantu: efek harian kalau sudah bergabung denganmu
const WARGA = {
  jefri: { nama: 'Jefri', anak: 'damar', tempat: 'warung', bantu: [{ massa: 1 }, 'Jefri mengatur truk dan toa. Barisan kalian berangkat dan pulang tepat waktu.'] },
  sari: { nama: 'Sari', anak: 'damar', tempat: 'warung', bantu: [{ sorotan: -1 }, 'Sari memperbarui peta pos aparat di sekitar kampus. Kalian tahu jalan mana yang harus dihindari.'] },
  rudi: { nama: 'Rudi', anak: 'ratna', tempat: 'sekre', bantu: [{ pengaruh: 1 }, 'Rudi menyalin notulen rapat ke tiga kampus lain. Namamu ikut terbawa.'] },
  sri: { nama: 'Sri', anak: 'ratna', tempat: 'sekre', bantu: [{ massa: 1 }, 'Sri mengajak dua kawan FISIP-nya ke diskusi Kamis.'] },
  dewi: { nama: 'Dewi', anak: 'fikri', tempat: 'masjid', bantu: [{ massa: 1 }, 'Dewi memasak di dapur umum dan menyebut namamu kepada ibu-ibu di sana.'] },
  agus: { nama: 'Agus', anak: 'fikri', tempat: 'masjid', bantu: [{ massa: 1 }, 'Agus menambah dua puluh keluarga ke daftar penerima beras.'] },
  bayu: { nama: 'Bayu', anak: 'yudi', tempat: 'senat', bantu: [{ sorotan: -1 }, 'Bayu membocorkan jadwal latihan Menwa. Kalian tahu kapan kampus sedang dijaga.'] },
  teguh: { nama: 'Teguh', anak: 'yudi', tempat: 'senat', bantu: [{ pengaruh: 1 }, 'Teguh memasukkan agendamu ke rapat himpunan.'] },
  kardi: { nama: 'Pak Kardi', tempat: 'masjid' },
  wali: { nama: 'Bu Retno', tempat: 'dosen' },
  tetangga: { nama: 'Joko', tempat: 'lorong' },
  ibukos: { nama: 'Ibu kos', tempat: 'tamu', c: 'ibuKos' },
  pakrt: { nama: 'Pak RT', tempat: 'rawa', c: 'pakRT', digambar: true } // sudah ada di gambar Kampung Rawa
};
const wargaDi = t => Object.keys(WARGA).filter(id => WARGA[id].tempat === t);
const anakAktif = () => Object.keys(S.anak || {}).filter(k => S.anak[k] === 'aktif');
function rekrutAnak(id) { (S.anak = S.anak || {})[id] = 'aktif'; ubahHati(WARGA[id].anak, -2); return {}; }

/* ---------- pelapor: ibu kos, Pak RT, Bapak ---------- */
// takut 0–3. Tingkat 1 dan 2 selalu tampak sebagai tanda di buku catatan; tingkat 3 berarti ia sudah melapor (sekali saja)
const lapor = id => (S.lapor || {})[id] || 0;
function geserLapor(id, d) { const L = S.lapor = S.lapor || {}; if ((L[id] || 0) < 3) L[id] = clamp((L[id] || 0) + d, 0, 3); }
const TANDA = {
  ibukos: ['Ibu kos memasang gembok baru dan mengunci pagar sejam lebih awal. Ia tidak memberimu kuncinya.', 'Ibu kos menanyakan tamumu: siapa yang kemarin datang, kuliah di mana, rumahnya di mana. Jawabanmu ia catat di balik kalender.'],
  pakrt: ['Pak RT pura-pura tidak melihatmu saat kalian berpapasan di gang.', 'Pak RT meminta melihat KTP-mu “untuk pendataan”. Ia memegangnya lama sebelum mengembalikannya.'],
  bapak: ['Surat Bapak kali ini hanya tiga baris. Biasanya satu halaman penuh.', 'Di telepon, Bapak berkata, “Orang kantor bertanya soal kamu.” Lalu ia diam lama, menunggu kamu menjelaskan.']
};
function laporkan(id) {
  if (id === 'ibukos') {
    const out = ['“Pak RW kemarin ke sini,” kata ibu kos tanpa menatapmu. Malamnya Pak RW datang lagi bersama dua orang berjaket, dan kamarmu digeledah.'];
    if (S.buku.baca && BUKU[S.buku.baca].terlarang && !diTas('buku')) { out.push(`${BUKU[S.buku.baca].judul} di bawah kasur disita.`); S.buku.baca = null; S.buku.sisa = 0; }
    if ((S.f.selebaran || 0) > 0 && !diTas('selebaran')) { out.push('Selebaran di lemari ikut dibawa.'); S.f.selebaran = 0; }
    if (S.bukti.length && !diTas('bukti')) out.push(`Map berisi ${sitaBukti(S.bukti).length} bukti diambil dari laci.`);
    apply({ sorotan: 10, nyali: -3 }); rapikanTas();
    return out.join(' ');
  }
  if (id === 'pakrt') { apply({ sorotan: 10, massa: -3 }); return '“Kodim minta daftar warga baru,” kata Pak RT pelan. Namamu sudah ada di daftar itu, di kolom pendatang, dengan tanda tangannya di bawah.'; }
  S.f.dibina = true; apply({ sorotan: 8, nyali: -8 });
  return 'Bapak datang ke Jakarta tanpa memberi tahu dan pulang hari itu juga. Seminggu kemudian dua orang dari Kodim mengetuk pintu kos. “Bapakmu minta kamu dibina.” Mereka bicara sopan selama satu jam tentang masa depanmu.';
}
// dinilai setiap kali hari ditutup. Kepada Bapak yang hangat dan tidak pernah kamu bohongi, takutnya berhenti di tanda pertama
function nilaiPelapor(m) {
  const out = [], naik = (id, p) => { if (lapor(id) >= 3 || Math.random() >= p) return; geserLapor(id, 1); out.push(lapor(id) === 3 ? laporkan(id) : TANDA[id][lapor(id) - 1]); };
  naik('ibukos', clamp((S.sorotan - 20) / 100, 0, 0.5) + (m.larut ? 0.25 : 0));
  if (S.f.dapurUmum && m.dikunjungi.includes('rawa')) naik('pakrt', clamp((S.sorotan - 30) / 90, 0, 0.5));
  if (m.dilakukan.includes('telepon')) geserLapor('bapak', -1);
  else if (!(sikap('bapak') === 'hangat' && !S.f.bohongBapak && lapor('bapak') >= 1)) naik('bapak', clamp((S.sorotan - 35) / 90, 0, 0.4) + (S.f.bohongBapak ? 0.15 : 0));
  return out;
}
function hariWarga(m) {
  const out = anakAktif().map(k => { apply(WARGA[k].bantu[0]); return WARGA[k].bantu[1]; });
  return out.concat(nilaiPelapor(m));
}

/* ---------- percakapan di tempat ---------- */
// setengah jam, satu kali saja, hanya kalau orangnya ada di tempatmu
const dlgWarga = (id, o) => ({ siapa: id, warga: id, nama: WARGA[id].nama, mulai: () => { S.m.jam += 0.5; return {}; }, ...o });
// anak senior awalnya menilaimu lewat cerita seniornya
const dlgAnak = (id, o) => dlgWarga(id, { ...o, mulai: () => { S.m.jam += 0.5; const H = S.hati = S.hati || {}; if (!(id in H)) H[id] = Math.round(hati(WARGA[id].anak) / 2); return {}; } });
const ajakAnak = (id, terima) => s => !(s.anak || {})[id] && hati(id) >= 0 && anakAktif().length < 3 ? [[`Ajak ${WARGA[id].nama} bekerja bersama kelompokmu`, 's', terima, null, () => rekrutAnak(id)]] : [];
const kataSenior = (id, t) => s => t[sikap(WARGA[id].anak)];

Object.assign(DIALOG, {
  /* anak Bang Damar */
  anak_jefri: dlgAnak('jefri', { giliran: [
    { kata: kataSenior('jefri', { hangat: 'Jefri menggulung kabel toa di bangku warung. “Bang Damar bilang kau bisa diandalkan. Jarang dia bilang begitu.”', biasa: 'Jefri menggulung kabel toa di bangku warung dan mengangguk kepadamu. “Kau yang suka duduk di pojok sekretariat itu, kan?”', dingin: 'Jefri menggulung kabel toa tanpa menoleh. “Bang Damar bilang kau kebanyakan baca, kurang turun.”' }), opsi: [
      ['Toa itu yang dipakai di aksi kemarin? Suaranya sampai ke ujung jalan.', 's', '“Aki truk, Bung. Kusambung sendiri.” Ia bangga, dan tidak menyembunyikannya.', { damar: 1 }],
      ['Aku ke sini cuma mau ngopi.', 'n', '“Kopinya pahit. Cocok buat yang belum tahu mau ngapain.”'],
      ['Toa begitu bikin aparat cepat datang. Kenapa tidak pakai selebaran saja?', 'l', 'Jefri berhenti menggulung. “Selebaran tidak bisa teriak.”', { ratna: 1 }]] },
    { kata: '“Truk buat aksi berikutnya belum ada. Sopirnya takut. Kau kenal orang yang punya mobil?”', opsi: s => [
      ['Aku tanya kawan-kawan. Kalau tidak ada, kita jalan kaki dari kampus.', 's', '“Jalan kaki juga bisa. Asal barisannya rapat.”'],
      ['Tidak kenal.', 'n', 'Jefri mengangguk dan kembali ke kabelnya.'],
      ['Kalau sopirnya takut, mungkin aksinya yang perlu ditunda.', 'l', '“Ditunda terus sampai kita tua.” Ia tertawa, tidak ramah.'],
      ...ajakAnak('jefri', '“Kalau Bang Damar tanya, bilang aku yang mau.” Ia menyalami tanganmu dengan tangan yang hitam oli.')(s)] }
  ], tutup: { hangat: 'Jefri menyodorkan rokok kretek. Kamu tidak merokok, tapi kamu menerimanya.', biasa: 'Jefri kembali ke kabel-kabelnya.', dingin: 'Jefri pindah ke bangku lain.' } }),
  anak_sari: dlgAnak('sari', { giliran: [
    { kata: kataSenior('sari', { hangat: 'Sari menggambar sesuatu di balik bungkus rokok: kotak-kotak kecil dan panah. “Bang Damar suka kamu. Itu sebabnya aku mau bicara.”', biasa: 'Sari menggambar sesuatu di balik bungkus rokok: kotak-kotak kecil dan panah. Ia menutupinya dengan tangan waktu kamu duduk.', dingin: 'Sari langsung membalik bungkus rokok yang sedang ia coret-coret. “Bang Damar bilang hati-hati sama kamu.”' }), opsi: [
      ['Itu peta pos jaga, ya? Aku tidak akan bilang siapa-siapa.', 's', 'Ia menatapmu sebentar, lalu membuka tangannya. “Pos Koramil, pos polisi, dan pos yang tidak ada di peta mana pun.”'],
      ['Kamu kuliah di FISIP juga?', 'n', '“Angkatan 95. Jarang masuk kelas, jarang dicari dosen.”'],
      ['Menggambar begitu di warung terbuka itu bahaya, Sar.', 'l', '“Bahaya kalau digambar di sekretariat. Di warung, orang kira aku main tebak-tebakan.”']] },
    { kata: '“Tiap Selasa pos depan kampus ganti orang. Yang jaga hari Selasa suka tidur.” Ia melipat bungkus rokoknya kecil-kecil. “Menurutmu informasi begini harus dibagi ke semua orang?”', opsi: s => [
      ['Ke yang perlu saja. Makin banyak yang tahu, makin cepat bocor.', 's', '“Nah. Kak Ratna bilang begitu juga, dan aku benci mengakuinya.”', { ratna: 1 }],
      ['Ke semua. Biar semua orang bisa jaga diri.', 'n', '“Termasuk yang bukan orang kita?” Ia tidak menunggu jawabanmu.'],
      ['Aku tidak mau tahu soal begitu.', 'l', '“Ya sudah. Nanti kalau ditangkap di Selasa yang salah, jangan salahkan aku.”'],
      ...ajakAnak('sari', 'Sari menyelipkan bungkus rokok itu ke saku kemejamu. “Petanya kuperbarui tiap minggu. Jangan sampai basah.”')(s)] }
  ], tutup: { hangat: 'Sari menggambar satu panah lagi di peta kecilnya, ke arah kosmu. “Biar aku tahu jalan pulangmu.”', biasa: 'Sari kembali menggambar.', dingin: 'Sari menyimpan gambarnya dan pergi lebih dulu.' } }),

  /* anak Kak Ratna */
  anak_rudi: dlgAnak('rudi', { giliran: [
    { kata: kataSenior('rudi', { hangat: 'Rudi menyalin notulen dengan huruf kecil-kecil. “Kak Ratna menyebut namamu di rapat presidium. Kalimatnya baik.”', biasa: 'Rudi menyalin notulen dengan huruf kecil-kecil. “Kau ikut rapat Kamis kemarin? Aku tidak lihat namamu di daftar hadir.”', dingin: 'Rudi menyalin notulen dan tidak mengangkat kepala. “Kak Ratna minta aku memeriksa daftar hadir. Namamu sering bolong.”' }), opsi: [
      ['Aku datang terlambat. Nanti kutulis namaku, dengan jamnya.', 's', 'Rudi menyodorkan pulpen. “Jamnya yang penting. Biar kalau ada yang tanya, kita semua punya cerita yang sama.”'],
      ['Daftar hadir itu penting, ya?', 'n', '“Penting kalau ada yang hilang. Kita jadi tahu siapa yang terakhir melihatnya.”'],
      ['Daftar hadir cuma bikin aparat gampang tahu siapa saja anggota kita.', 'l', 'Rudi berhenti menulis. Ia tahu kamu benar, dan ia tidak suka itu.', { damar: 1 }]] },
    { kata: '“Malam jaga pintu dulu, ada orang yang mengaku temanku. Aku tidak pernah membawa teman.” Rudi menatap pintu sekretariat. “Sejak itu aku menyalin semuanya dua kali.”', opsi: s => [
      ['Salinannya simpan di tempat berbeda. Satu di sini, satu di luar kampus.', 's', '“Satu di rumah ibuku di Depok.” Ia hampir tersenyum. “Kau berpikir seperti Kak Ratna.”'],
      ['Mungkin cuma salah paham.', 'n', '“Sepatu lars bukan salah paham.”'],
      ['Menyalin dua kali artinya dua kali lebih banyak yang bisa disita.', 'l', 'Rudi menutup bukunya pelan. Kamu tidak tahu apakah ia akan berhenti menyalin atau berhenti bicara padamu.'],
      ...ajakAnak('rudi', '“Aku bisa menyalin untuk kelompokmu juga.” Ia menulis namamu di halaman baru.')(s)] }
  ], tutup: { hangat: 'Rudi memberimu satu salinan notulen terakhir, dilipat empat.', biasa: 'Rudi kembali menyalin.', dingin: 'Rudi mencoret sesuatu di bukunya. Mungkin bukan namamu.' } }),
  anak_sri: dlgAnak('sri', { giliran: [
    { kata: kataSenior('sri', { hangat: 'Sri menata kursi untuk diskusi Kamis. “Kak Ratna bilang kau yang paling rajin merangkum. Ajari aku, dong.”', biasa: 'Sri menata kursi untuk diskusi Kamis. “Bab dua sudah selesai? Aku masih tersangkut di halaman yang sama.”', dingin: 'Sri menata kursi dan menghindari matamu. “Kak Ratna bilang kau suka bicara di luar rapat.”' }), opsi: [
      ['Halaman mana? Kita baca bareng sekarang.', 's', 'Sri duduk di kursi yang baru ia tata. Satu jam kemudian kalian masih di halaman yang sama, tapi kali ini karena berdebat.'],
      ['Belum juga. Babnya tebal.', 'n', '“Syukurlah, bukan aku saja.”'],
      ['Baca buku tidak menurunkan harga beras, Sri.', 'l', '“Tapi bikin kita tahu kenapa harganya naik.” Ia kembali ke kursi-kursinya.', { damar: 1 }]] },
    { kata: '“Pembantu rektor memanggil beberapa anak FISIP minggu lalu. Katanya cuma ngobrol.” Sri memeluk map di dadanya. “Kalau aku dipanggil, aku harus bilang apa?”', opsi: s => [
      ['Bilang yang kamu tahu saja: kita kelompok studi. Lalu cerita ke Kak Ratna sesudahnya.', 's', 'Sri mengangguk dan mengulang kalimatmu pelan, seperti menghafal.'],
      ['Mungkin kamu tidak dipanggil.', 'n', '“Mungkin.” Ia tidak terdengar yakin.'],
      ['Jangan datang. Mereka tidak bisa memaksa.', 'l', '“Mereka bisa mencabut beasiswaku.” Ia berbicara sangat pelan.'],
      ...ajakAnak('sri', '“Aku bawa dua kawan FISIP Kamis depan. Mereka penakut, tapi rajin.”')(s)] }
  ], tutup: { hangat: 'Sri menyisakan kursi di sebelahnya untukmu.', biasa: 'Sri kembali menata kursi.', dingin: 'Sri menata kursimu paling ujung, dekat pintu.' } }),

  /* anak Bang Fikri */
  anak_dewi: dlgAnak('dewi', { giliran: [
    { kata: kataSenior('dewi', { hangat: 'Dewi melipat mukena di serambi masjid. “Bang Fikri mendoakanmu di kajian Selasa. Namamu disebut.”', biasa: 'Dewi melipat mukena di serambi masjid. “Mau ikut kajian? Selasa malam, sesudah Isya.”', dingin: 'Dewi melipat mukena lebih cepat waktu kamu datang. “Bang Fikri bilang kamu lebih suka cara yang keras.”' }), opsi: [
      ['Mau. Temanya apa minggu ini?', 's', '“Amar makruf nahi mungkar.” Ia tersenyum kecil. “Bagian nahi mungkar-nya yang paling susah.”', { fikri: 1 }],
      ['Nanti kalau sempat.', 'n', '“Nanti itu kata paling sibuk di kampus ini.”'],
      ['Doa saja tidak cukup, Wi.', 'l', '“Siapa bilang saja?” Ia menunjuk karung beras di pojok serambi.']] },
    { kata: '“Dapur umum di Kampung Rawa kekurangan tangan. Ibu-ibu di sana masak dari subuh.” Dewi menatap karung-karung beras. “Kamu bisa masak?”', opsi: s => [
      ['Tidak terlalu, tapi aku bisa mengangkat karung dan mencuci panci.', 's', '“Itu justru yang paling dicari.”'],
      ['Sedikit.', 'n', '“Sedikit juga dihitung.”'],
      ['Itu lebih cocok untuk ibu-ibu, kan?', 'l', 'Dewi tidak menjawab. Ia mengangkat karung itu sendiri.'],
      ...ajakAnak('dewi', '“Bismillah. Mulai Ahad, ya.”')(s)] }
  ], tutup: { hangat: 'Dewi membungkuskan dua potong kue lapis untukmu, sisa pengajian.', biasa: 'Dewi kembali melipat mukena.', dingin: 'Dewi pamit masuk ke ruang akhwat.' } }),
  anak_agus: dlgAnak('agus', { giliran: [
    { kata: kataSenior('agus', { hangat: 'Agus membolak-balik buku besar penuh nama. “Bang Fikri bilang kau orang yang lurus. Jarang ia bilang begitu tentang anak PENA.”', biasa: 'Agus membolak-balik buku besar penuh nama dan angka. “Daftar keluarga miskin di tiga RW. Mau lihat?”', dingin: 'Agus menutup buku besarnya. “Bang Fikri pesan, data ini jangan sampai ke orang yang suka ribut.”' }), opsi: [
      ['Mau. Dari mana datanya?', 's', '“Dari pintu ke pintu. Pak RT tidak punya data sebagus ini.” Ia bangga, dan berhak bangga.', { fikri: 1 }],
      ['Banyak sekali namanya.', 'n', '“Tiap bulan nambah.”'],
      ['Data begini bisa jatuh ke tangan kelurahan, lalu dipakai untuk mendata kita.', 'l', 'Agus memeluk bukunya. “Makanya aku yang pegang, bukan kelurahan.”', { ratna: 1 }]] },
    { kata: '“Bulan ini harga beras naik lagi. Daftar penerima harus kupotong, atau berasnya yang kubagi lebih sedikit.” Agus memijat dahinya. “Kau pilih yang mana?”', opsi: s => [
      ['Bagi lebih sedikit, tapi semua dapat. Lalu kita cari tambahan beras.', 's', '“Itu jawaban Bang Fikri juga.”'],
      ['Aku tidak tahu, Gus.', 'n', '“Aku juga tidak. Makanya aku tanya.”'],
      ['Potong saja yang paling tidak butuh.', 'l', '“Semua orang di sini merasa paling butuh.” Ia mendesah.'],
      ...ajakAnak('agus', '“Kalau kelompokmu mau ikut membagi, aku tambah dua puluh keluarga.”')(s)] }
  ], tutup: { hangat: 'Agus menulis namamu di halaman depan buku besarnya, di kolom relawan.', biasa: 'Agus kembali menghitung.', dingin: 'Agus menyimpan bukunya di dalam tas.' } }),

  /* anak Mas Yudi */
  anak_bayu: dlgAnak('bayu', { giliran: [
    { kata: kataSenior('bayu', { hangat: 'Bayu duduk tegak di kursi senat, rambutnya cepak. “Mas Yudi bilang kau bisa diajak bicara. Itu langka di PENA.”', biasa: 'Bayu duduk tegak di kursi senat, rambutnya cepak. “Kita pernah ketemu. Malam jaga pintu, kan? Kau yang memeriksa KTM-ku.”', dingin: 'Bayu duduk tegak dan menatapmu dari ujung kaki. “Mas Yudi bilang kau tidak suka orang Menwa.”' }), opsi: [
      ['Waktu itu kamu jujur soal rambutmu. Aku ingat.', 's', 'Bahunya turun sedikit. “Orang jarang ingat bagian itu.”'],
      ['Iya. Maaf kalau terlalu lama.', 'n', '“Tidak apa-apa. Lebih baik lama daripada salah.”'],
      ['Orang Menwa di diskusi kami tetap bikin kawan-kawan gugup.', 'l', '“Aku juga gugup di latihan Menwa, kalau mau tahu.” Ia tidak tersenyum.']] },
    { kata: '“Komandan Menwa minta kami mencatat siapa saja yang sering ke sekretariat PENA.” Bayu memelankan suara. “Aku belum menyerahkan apa-apa. Menurutmu aku harus bagaimana?”', opsi: s => [
      ['Serahkan nama-nama yang sudah diketahui semua orang. Sisanya, kamu tidak tahu.', 's', '“Tidak tahu.” Ia mengulangnya. “Itu bisa kulakukan.”', { yudi: 1 }],
      ['Terserah kamu.', 'n', '“Itu yang paling tidak membantu.”'],
      ['Keluar saja dari Menwa.', 'l', '“Beasiswaku dari Menwa.” Ia berdiri dan merapikan seragamnya.'],
      ...ajakAnak('bayu', '“Aku tidak bisa ikut aksi. Tapi aku bisa bilang kapan kampus sedang dijaga.”')(s)] }
  ], tutup: { hangat: 'Bayu memberi hormat kecil, setengah bercanda.', biasa: 'Bayu kembali ke berkas-berkasnya.', dingin: 'Bayu mencatat sesuatu di bukunya. Kamu tidak bisa membacanya dari sini.' } }),
  anak_teguh: dlgAnak('teguh', { giliran: [
    { kata: kataSenior('teguh', { hangat: 'Teguh, ketua himpunan Ekonomi, menyalamimu dengan dua tangan. “Mas Yudi cerita banyak soal kamu. Yang baik-baik.”', biasa: 'Teguh, ketua himpunan Ekonomi, menyalamimu dengan sopan. “Ada perlu dengan himpunan?”', dingin: 'Teguh, ketua himpunan Ekonomi, melihat jam tangannya. “Mas Yudi sedang rapat. Lama.”' }), opsi: [
      ['Aku ingin himpunan ikut diskusi soal harga sembako. Datanya kalian yang paling paham.', 's', '“Data kami ada. Yang belum ada keberanian mempresentasikannya.” Ia tertawa, setengah malu.', { yudi: 1 }],
      ['Cuma lewat.', 'n', '“Ruang senat bukan tempat lewat, Dik.” Ia mengatakannya seperti Mas Yudi.'],
      ['Himpunan cuma sibuk seminar dan cari sponsor.', 'l', '“Sponsor itu yang bayar konsumsi diskusimu juga.”', { damar: 1 }]] },
    { kata: '“Dekan bilang himpunan yang ikut aksi akan dibekukan, seperti PENA.” Teguh membetulkan kacamatanya. “Kalau kau jadi aku, apa yang kau korbankan duluan?”', opsi: s => [
      ['Jangan korbankan himpunan. Bawa datanya ke diskusi, bukan bendera himpunannya.', 's', '“Data tanpa bendera.” Ia menulis kalimat itu di agendanya. “Mas Yudi akan suka.”'],
      ['Aku tidak tahu. Aku bukan ketua.', 'n', '“Untung kau bukan.” Ia tersenyum lelah.'],
      ['Biar dibekukan. Himpunan yang diam tidak ada gunanya.', 'l', 'Teguh menutup agendanya. “Gampang bilang begitu kalau bukan namamu di surat pembekuan.”'],
      ...ajakAnak('teguh', '“Agendamu kumasukkan ke rapat himpunan. Diam-diam dulu.”')(s)] }
  ], tutup: { hangat: 'Teguh memberimu kartu namanya. Ada nomor telepon rumah yang ditulis tangan di baliknya.', biasa: 'Teguh kembali ke rapatnya.', dingin: 'Teguh memanggil orang berikutnya.' } }),

  /* Pak Kardi: tukang sapu yang tahu siapa saja keluar masuk */
  kardi_a: dlgWarga('kardi', { giliran: [
    { kata: 'Pak Kardi menyapu serambi masjid pelan-pelan, seperti sapunya lebih tua dari dia. “Dik, sandalnya jangan di situ. Nanti hilang.”', opsi: [
      ['Terima kasih, Pak. Bapak sudah lama di sini?', 's', '“Dua puluh dua tahun. Rektornya sudah ganti empat kali, sapunya baru dua.”'],
      ['Iya, Pak.', 'n', 'Ia mengangguk dan terus menyapu.'],
      ['Biar saja, Pak. Sandal murah.', 'l', '“Murah buat Adik.” Ia memindahkan sandalmu sendiri ke rak.']] },
    { kata: '“Anak saya tiga. Yang tengah sakit paru-paru, harus ke puskesmas tiap Kamis.” Ia bersandar pada gagang sapu. “Adik anak PENA, ya? Saya sering lihat Adik pulang malam.”', opsi: [
      ['Iya, Pak. Semoga anak Bapak cepat sembuh. Kalau perlu diantar, bilang saja.', 's', 'Pak Kardi menatapmu lama. “Adik ini baik. Hati-hati, ya. Orang baik gampang dimanfaatkan.”'],
      ['Saya cuma ikut diskusi, Pak.', 'n', '“Diskusi sampai jam dua belas.” Ia tersenyum tanpa menuduh.'],
      ['Bapak tidak usah tahu urusan saya.', 'l', '“Saya tidak mau tahu, Dik. Orang lain yang mau tahu.” Ia pergi menyapu ke sisi lain.']] }
  ], tutup: { hangat: 'Pak Kardi menyisihkan sebungkus teh dari kotak marbot untukmu.', biasa: 'Pak Kardi kembali menyapu.', dingin: 'Pak Kardi tidak menyapamu lagi waktu kamu lewat.' } }),
  kardi_b: dlgWarga('kardi', { req: s => s.f.dlg_kardi_a && s.bulan >= '1997-04', giliran: [
    { kata: 'Pak Kardi menunggumu di tangga masjid, sapunya disandarkan ke tembok. “Dik, sini sebentar. Jangan di tengah.”', opsi: [
      ['Ada apa, Pak?', 's', 'Ia menarikmu ke balik tiang.'],
      ['Saya buru-buru, Pak.', 'n', '“Sebentar saja. Ini lebih penting dari kuliah.”'],
      ['Kalau soal pulang malam, saya sudah tahu, Pak.', 'l', '“Bukan itu.” Ia tidak tersinggung, hanya tidak sabar.']] },
    { kata: '“Kemarin ada orang tanya jadwal sekretariat. Rambut cepak, sepatu bagus, bukan mahasiswa. Saya bilang tidak tahu.” Pak Kardi menatap gerbang. “Kalau saya lihat dia lagi, Adik mau saya kasih tahu?”', opsi: [
      ['Mau, Pak. Terima kasih. Tapi Bapak jangan sampai kena masalah.', 's', '“Tukang sapu tidak pernah dicurigai, Dik. Itu untungnya jadi orang yang tidak dilihat.”'],
      ['Mungkin cuma orang tanya biasa.', 'n', '“Orang biasa tidak tanya jadwal sambil mencatat.”'],
      ['Bapak jangan ikut-ikut. Nanti malah ketahuan.', 'l', '“Ya sudah.” Ia mengambil sapunya. “Saya cuma mau menolong.”']] }
  ], sesudah: () => { if (sikap('kardi') === 'hangat') S.f.kardiAwas = true; },
  tutup: { hangat: 'Sejak hari itu, Pak Kardi berdeham dua kali setiap ada orang asing di sekitar sekretariat. Kamu jadi lebih jarang kena razia di jalan.', biasa: 'Pak Kardi kembali ke serambi.', dingin: 'Pak Kardi tidak pernah membahasnya lagi.' } }),

  /* dosen wali */
  wali_a: dlgWarga('wali', { giliran: [
    { kata: s => `Bu Retno, dosen walimu, membuka map KHS-mu. “IPK ${ipkStr(s.ipk)}. ${s.ipk >= 3 ? 'Bagus. Pertahankan.' : 'Kamu bisa lebih dari ini.'} Kamu ikut kegiatan apa di luar kelas?”`, opsi: [
      ['Kelompok studi, Bu. Kami membaca buku dan berdiskusi.', 's', '“Membaca itu baik.” Ia menulis sesuatu di mapmu. “Asal bukunya tidak membuat kamu lupa kuliah.”'],
      ['Tidak ada, Bu. Kuliah saja.', 'n', 'Bu Retno mengangkat alis. Ia sudah mendengar namamu disebut di rapat fakultas.'],
      ['Itu urusan pribadi saya, Bu.', 'l', '“Saya dosen walimu. Urusanmu memang urusan saya.” Ia menutup map dengan agak keras.']] },
    { kata: '“Waktu saya mahasiswa, tahun tujuh puluh delapan, kampus diduduki tentara. Saya memilih lulus cepat.” Bu Retno menatap jendela. “Kamu tahu kenapa saya cerita ini?”', opsi: [
      ['Supaya saya tahu Ibu juga pernah memilih. Saya hargai itu, Bu.', 's', 'Bu Retno tersenyum untuk pertama kalinya. “Pilihlah dengan mata terbuka. Itu saja.”'],
      ['Supaya saya lulus cepat juga?', 'n', '“Supaya kamu tahu ada pilihan itu.”'],
      ['Supaya saya takut, Bu?', 'l', '“Supaya kamu tidak bodoh.” Ia memanggil mahasiswa berikutnya.']] }
  ], tutup: { hangat: 'Bu Retno menandatangani KRS-mu tanpa mencoret satu mata kuliah pun.', biasa: 'Bu Retno menandatangani KRS-mu.', dingin: 'Bu Retno menandatangani KRS-mu dan mencoret satu mata kuliah pilihanmu.' } }),
  wali_b: dlgWarga('wali', { req: s => s.f.dlg_wali_a && s.sorotan >= 30, giliran: [
    { kata: '“Rektorat minta daftar mahasiswa yang ‘aktif di luar kegiatan resmi’.” Bu Retno meletakkan selembar formulir kosong di meja. “Dosen wali yang mengisi.”', opsi: [
      ['Ibu mau menulis nama saya?', 'n', '“Saya belum memutuskan. Itu sebabnya kamu saya panggil.”'],
      ['Saya mengerti posisi Ibu. Saya tidak akan menyulitkan Ibu.', 's', 'Bu Retno menghela napas panjang. “Kamu mengerti. Itu sudah separuh jalan.”'],
      ['Kalau Ibu menulis nama saya, Ibu sama saja dengan mereka.', 'l', 'Wajah Bu Retno mengeras. “Hati-hati dengan kalimat seperti itu di ruangan ini.”']] },
    { kata: '“Kalau formulir ini kosong, saya yang ditanya. Kalau terisi, kamu yang ditanya.” Ia memutar pulpennya. “Beri saya alasan untuk mengosongkannya.”', opsi: [
      ['IPK saya tetap terjaga, Bu. Saya tidak pernah membolos ujian. Tuliskan itu.', 's', 'Bu Retno menulis di formulir itu, lalu melipatnya. Kamu tidak bisa melihat isinya.'],
      ['Saya tidak punya alasan, Bu.', 'n', '“Itu juga jawaban.”'],
      ['Ibu takut. Itu alasannya.', 'l', 'Bu Retno menulis namamu, pelan, huruf demi huruf.']] }
  ], sesudah: () => { if (sikap('wali') === 'dingin') apply({ sorotan: 4 }); },
  tutup: { hangat: 'Seminggu kemudian, kamu dengar formulir dari Bu Retno kembali ke rektorat dalam keadaan kosong.', biasa: 'Kamu tidak pernah tahu apa yang ditulis Bu Retno.', dingin: 'Seminggu kemudian, namamu dibacakan di rapat fakultas.' } }),

  /* tetangga kamar */
  tetangga_a: dlgWarga('tetangga', { giliran: [
    { kata: 'Joko, tetangga kamarmu, mengelap motor bebeknya di lorong. Radio gelombang pendek di jendelanya mendesis. “Semalam kau pulang jam berapa? Pagar sudah digembok.”', opsi: [
      ['Maaf kalau berisik, Jok. Lain kali aku lewat pelan-pelan.', 's', '“Bukan berisik. Ibu kos yang tanya ke aku.” Ia mengangkat bahu.'],
      ['Lupa.', 'n', '“Lupa itu jawaban yang bagus. Pakai itu kalau ibu kos tanya.”'],
      ['Bukan urusanmu, Jok.', 'l', '“Memang bukan.” Ia mengelap motornya lebih keras.']] },
    { kata: '“Aku mau kerja di Batam habis lulus. Pabrik elektronik, gajinya dolar.” Joko memutar kenop radio sampai suara BBC terdengar jelas. “Kalian yang demo itu, nanti kerja di mana?”', opsi: [
      ['Belum tahu. Mungkin di tempat yang tidak perlu takut bicara.', 's', '“Belum ada tempat begitu di Indonesia.” Tapi ia mengeraskan radionya, untukmu.'],
      ['Sama, cari kerja.', 'n', '“Ya. Ujung-ujungnya sama.”'],
      ['Kerja di Batam itu kerja buat modal asing.', 'l', '“Modal asing yang bayar kosku.” Ia mematikan radio.']] }
  ], tutup: { hangat: 'Joko meminjamkan radionya semalam. Kamu mendengar siaran BBC dan Radio Australia sampai tertidur.', biasa: 'Joko kembali ke motornya.', dingin: 'Joko menutup jendelanya, radionya ikut tidak terdengar.' } }),
  tetangga_b: dlgWarga('tetangga', { req: s => s.f.dlg_tetangga_a && s.sorotan >= 35, giliran: [
    { kata: '“Kemarin ada orang tanya soal kau.” Joko tidak menatapmu. “Jam berapa kau pulang, siapa tamumu. Katanya dari kelurahan.”', opsi: [
      ['Terima kasih sudah bilang, Jok. Kau jawab apa?', 's', '“Aku bilang aku tidur jam sembilan. Mana kutahu.”'],
      ['Orang kelurahan memang suka tanya-tanya.', 'n', '“Orang kelurahan tidak pakai sepatu begitu.”'],
      ['Kau tidak jawab apa-apa, kan?', 'l', '“Kenapa aku harus bohong buat kau?” Ia bertanya serius.']] },
    { kata: '“Dia kasih nomor telepon. Katanya telepon kalau kau bawa tamu banyak.” Joko memutar-mutar secarik kertas. “Aku harus bagaimana?”', opsi: [
      ['Simpan saja. Kau tidak berutang apa-apa ke mereka, atau ke aku.', 's', 'Joko melipat kertas itu dan memasukkannya ke kaleng rokok kosong. “Tidak berutang ke siapa-siapa. Enak juga.”'],
      ['Terserah kau.', 'n', 'Joko memandangi kertas itu lama.'],
      ['Kalau kau telepon mereka, kita bukan tetangga lagi.', 'l', '“Kita memang cuma tetangga.” Ia memasukkan kertas itu ke saku kemejanya.']] }
  ], sesudah: () => { if (sikap('tetangga') === 'hangat') S.f.radioBBC = true; else if (sikap('tetangga') === 'dingin') apply({ sorotan: 3 }); },
  tutup: { hangat: '“Radioku boleh kau pakai kapan saja,” kata Joko. “Asal baterainya kau ganti.”', biasa: 'Joko kembali ke motornya.', dingin: 'Malam itu kamu mendengar Joko menelepon dari telepon umum lorong. Ia bicara pelan sekali.' } }),

  /* ibu kos: makin dekat kamu dengannya, makin lama takutnya bertahan sebelum ia melapor */
  ibukos_a: dlgWarga('ibukos', { req: () => lapor('ibukos') < 3, giliran: [
    { kata: 'Ibu kos menonton televisi di ruang tamu. Di dinding, foto Presiden dan Wakil Presiden dalam bingkai yang dilap tiap pagi. “Sudah makan, Nak?”', opsi: [
      ['Sudah, Bu. Ibu sendiri sudah?', 's', '“Sudah, sudah.” Ia senang ditanya balik. Jarang ada anak kos yang begitu.'],
      ['Belum, Bu. Nanti.', 'n', '“Jangan nanti-nanti. Nanti sakit, Ibu yang repot menelepon orang tuamu.”'],
      ['Saya buru-buru, Bu.', 'l', '“Anak sekarang buru-buru semua.” Ia kembali ke televisi.']] },
    { kata: '“Bapak Presiden itu sudah seperti raja. Ibu cuma tidak mau ada ribut, Nak. Tahun enam puluh lima Ibu masih kecil, tapi Ibu ingat.” Ia mengecilkan suara televisi. “Kamu tidak ikut-ikut yang ribut-ribut itu, kan?”', opsi: [
      ['Saya ikut kelompok belajar, Bu. Kalau ada apa-apa, Ibu orang pertama yang saya kabari.', 's', 'Ibu kos menatapmu lama, lalu mengangguk. “Janji, ya. Ibu tidak suka kaget.”'],
      ['Tidak, Bu.', 'n', '“Syukurlah.” Ia tidak terdengar yakin.'],
      ['Kalau tidak ada yang ribut, tidak ada yang berubah, Bu.', 'l', 'Ibu kos mematikan televisi. Ruang tamu jadi sangat sunyi.']] }
  ], sesudah: () => { if (sikap('ibukos') === 'hangat') geserLapor('ibukos', -1); },
  tutup: { hangat: 'Ibu kos membungkuskan pisang goreng dari dapur. “Buat teman belajarmu.”', biasa: 'Ibu kos menyalakan televisinya lagi.', dingin: 'Ibu kos menulis sesuatu di balik kalender.' } }),
  ibukos_b: dlgWarga('ibukos', { req: s => s.f.dlg_ibukos_a && lapor('ibukos') >= 1 && lapor('ibukos') < 3, giliran: [
    { kata: '“Pagar sekarang Ibu kunci lebih awal.” Ibu kos memutar-mutar gembok barunya. “Kemarin ada orang tanya-tanya di depan. Ibu takut, Nak.”', opsi: [
      ['Saya mengerti, Bu. Saya akan pulang sebelum pagar dikunci.', 's', 'Bahunya turun sedikit. “Ibu bukan mau mengusir. Ibu cuma takut.”'],
      ['Orang tanya apa, Bu?', 'n', '“Tanya siapa yang sering pulang malam.” Ia tidak menyebut namamu, tapi tidak perlu.'],
      ['Ibu tidak perlu takut. Kami tidak berbuat salah.', 'l', '“Yang tidak berbuat salah juga bisa diangkut, Nak. Ibu lihat sendiri malam itu.”']] },
    { kata: '“Tamumu yang kemarin itu siapa? Yang rambutnya gondrong?” Ibu kos memegang kalender yang punggungnya penuh tulisan tangan. “Pak RW minta Ibu mencatat.”', opsi: [
      ['Teman kuliah, Bu. Namanya boleh Ibu catat. Kami tidak menyembunyikan apa-apa.', 's', 'Ibu kos menulis nama itu, lalu menatapmu. “Terima kasih sudah jujur. Ibu catat yang kamu bilang saja.”'],
      ['Saya lupa, Bu.', 'n', '“Lupa.” Ia menulis sesuatu juga.'],
      ['Ibu tidak usah mencatat apa-apa untuk Pak RW.', 'l', '“Rumah ini atas nama Ibu, Nak. Bukan atas namamu.”']] }
  ], sesudah: () => { if (sikap('ibukos') === 'hangat') geserLapor('ibukos', -1); },
  tutup: { hangat: 'Ibu kos memberimu kunci gembok cadangan. “Jangan bilang anak-anak lain.”', biasa: 'Ibu kos menggantung kalender itu kembali di dinding.', dingin: 'Ibu kos menelepon seseorang dari ruang tamu begitu kamu masuk kamar.' } }),

  /* Pak RT di Kampung Rawa */
  pakrt_a: dlgWarga('pakrt', { req: () => lapor('pakrt') < 3, giliran: [
    { kata: 'Pak RT duduk di depan rumahnya, di samping tungku dapur umum. “Mahasiswa lagi. Kalian ini mau bantu atau mau bikin kampung saya jadi berita?”', opsi: [
      ['Mau bantu, Pak. Kalau ada yang Bapak tidak suka, bilang saja.', 's', '“Nah. Itu yang saya mau dengar.” Ia menunjuk karung beras. “Angkat itu dulu.”'],
      ['Dua-duanya, mungkin, Pak.', 'n', 'Pak RT tertawa pendek. “Jujur juga kamu.”'],
      ['Kampung ini memang harus jadi berita, Pak. Biar orang tahu.', 'l', '“Yang jadi berita itu kalian. Yang didatangi tentara itu kami.”']] },
    { kata: '“Saya ini dipilih warga, tapi yang menggaji saya kelurahan.” Pak RT menyalakan rokok. “Kalau kelurahan minta nama-nama, saya harus bagaimana?”', opsi: [
      ['Bapak lindungi warga dulu. Nama kami tidak usah Bapak tutupi kalau itu membahayakan Bapak.', 's', 'Pak RT menatapmu lama. “Kamu anak siapa? Bapakmu pasti orang baik.”'],
      ['Saya tidak tahu, Pak.', 'n', '“Saya juga tidak.” Ia mengisap rokoknya dalam-dalam.'],
      ['Bapak jangan kasih nama siapa pun.', 'l', '“Gampang bilang jangan. Kamu tidak punya lima anak.”']] }
  ], sesudah: () => { if (sikap('pakrt') === 'hangat') geserLapor('pakrt', -1); },
  tutup: { hangat: 'Pak RT menunjukkan gudang di belakang rumahnya. “Kalau ada yang perlu disimpan, taruh di sini.”', biasa: 'Pak RT kembali mengawasi tungku.', dingin: 'Pak RT masuk rumah dan menutup pintunya.' } }),
  pakrt_b: dlgWarga('pakrt', { req: s => s.f.dlg_pakrt_a && lapor('pakrt') >= 1 && lapor('pakrt') < 3, giliran: [
    { kata: 'Pak RT tidak duduk di depan rumah seperti biasa. Ia berdiri di balik pintu dan bicara lewat celahnya. “Jangan lama-lama di sini hari ini.”', opsi: [
      ['Ada apa, Pak? Saya bisa pergi sekarang kalau perlu.', 's', 'Ia membuka pintu sedikit lebih lebar.'],
      ['Saya cuma sebentar, Pak.', 'n', '“Sebentar juga kelihatan.”'],
      ['Bapak takut sama kami sekarang?', 'l', '“Saya takut untuk kalian dan untuk kami.” Ia hampir menutup pintunya.']] },
    { kata: '“Kodim minta daftar warga baru. Ada kolom pendatang.” Pak RT memegang selembar kertas yang belum ditandatangani. “Kamu sering ke sini. Kamu pendatang atau bukan?”', opsi: [
      ['Tulis saja saya pendatang, Pak. Tapi saya pendatang yang ikut memasak di dapur umum.', 's', 'Pak RT tersenyum kecut. “Pendatang yang memasak.” Ia melipat kertas itu dan tidak menandatanganinya hari itu.'],
      ['Terserah Bapak.', 'n', 'Pak RT menatap kertas itu lama.'],
      ['Kalau Bapak tulis nama saya, Bapak sama saja dengan mereka.', 'l', 'Pak RT mengambil pulpen dari saku bajunya.']] }
  ], sesudah: () => { if (sikap('pakrt') === 'hangat') geserLapor('pakrt', -1); },
  tutup: { hangat: 'Pak RT menyelipkan kertas itu ke bawah taplak meja. “Kelurahan bisa menunggu.”', biasa: 'Pak RT menutup pintu pelan.', dingin: 'Pak RT menandatangani kertas itu di depanmu.' } })
});

// kegiatan tambahan di tempat-tempat warga
KEGIATAN.push(
  { id: 'berita', tempat: 'tamu', jam: 1, t: 'Nonton berita bersama ibu kos', d: 'Dunia Dalam Berita di TVRI', run: () => { const takut = lapor('ibukos'); if (takut && takut < 3) geserLapor('ibukos', -1); return beritaTV() + (takut && takut < 3 ? ' Di akhir siaran, ibu kos tertawa kecil pada leluconmu, untuk pertama kalinya sejak pagar digembok.' : ''); } },
  { id: 'bbc', tempat: 'lorong', jam: 1, t: 'Dengar siaran BBC di radio Joko', d: 'kabar yang tidak ada di TVRI', req: () => S.f.radioBBC, run: () => { apply({ nyali: 2, pengaruh: 1 }); return siaranBBC(); } }
);
for (const k of KEGIATAN.slice(-2)) KEG[k.id] = k;
const beritaTV = () => S.bulan < '1997-06' ? 'Presiden meresmikan bendungan. Penyiar menyebut angka pertumbuhan ekonomi tujuh persen dua kali.'
  : S.bulan < '1998-01' ? 'Penyiar menyebut rupiah “mengalami koreksi”. Gambar berikutnya: Presiden memanen padi bersama petani.'
  : 'Penyiar membacakan harga sembako di pasar induk dengan suara datar. Ibu kos menghitung dengan jarinya, lalu berhenti.';
const siaranBBC = () => S.bulan < '1997-06' ? 'BBC menyiarkan wawancara dengan aktivis yang dicari sejak 27 Juli. Joko mengecilkan suaranya setiap kali ada langkah di lorong.'
  : S.bulan < '1998-01' ? 'BBC melaporkan IMF datang ke Jakarta. Kata penyiarnya, rupiah adalah mata uang yang paling parah jatuh di Asia.'
  : 'Radio Australia menyiarkan aksi mahasiswa di kampus-kampus lain. Ternyata kalian tidak sendirian.';

/* ---------- suara masyarakat: satu kalimat yang terdengar saat kamu tiba ---------- */
// [siapa, kalimat, dari bulan, sampai bulan]. Sikap tiap orang punya alasannya sendiri
const SUARA = {
  kantin: [['Mahasiswa di meja sebelah', 'Yang penting lulus, terus kerja di bank. Politik itu urusan orang tua.', '', '1997-08'], ['Mahasiswi yang antre nasi', 'Kakakku dipanggil Kodim cuma gara-gara foto. Jangan ajak aku ikut apa-apa.'], ['Ibu kantin', 'Minyak goreng naik lagi. Kalau porsinya kukecilkan, jangan protes, ya, Dik.', '1997-08'], ['Mahasiswa dengan koran terlipat', 'Dolar hampir tujuh belas ribu. Kiriman orang tuaku tinggal sepertiganya.', '1998-01']],
  kelas: [['Mahasiswa di bangku belakang', 'Ujian Pancasila minggu depan. Hafalkan saja butir-butirnya, jangan dipikir.'], ['Asisten dosen', 'Stabilitas itu mahal. Lihat negara-negara yang ribut terus, rakyatnya yang susah.', '', '1998-02']],
  dosen: [['Pegawai tata usaha', 'Anak-anak itu tidak tahu repotnya kalau negara kacau. Saya ingat 1965.'], ['Pegawai yang mengetik', 'Saya cuma pegawai. Jangan ajak saya bicara di sini.']],
  senat: [['Pengurus senat', 'Kalau mau didengar, pakai surat resmi. Teriak di jalan cuma bikin rektor malu.'], ['Mahasiswa berjaket kuning', 'Kampanye besok yang ikut dapat kaus dan nasi bungkus. Lumayan buat akhir bulan.', '1997-03', '1997-06']],
  kios: [['Pemilik kios', 'Fotokopi apa saja boleh, asal saya tidak usah baca. Anak saya tiga.'], ['Pemilik kios', 'Yang ini tidak usah bayar. Anak saya juga kuliah. Tapi jangan bilang dari kios saya.', '1998-01']],
  warung: [['Penjual kopi', 'Siapa pun presidennya, kopi saya tetap seribu.', '', '1997-08'], ['Sopir bajaj', 'Setoran naik, penumpang turun. Yang tanggung siapa? Saya.', '1997-08'], ['Penjual kopi', 'Kalau kalian turun ke jalan, kopi saya gratis. Sudah terlalu lama kita diam.', '1998-02']],
  masjid: [['Jamaah tua', 'Dulu ceramah di sini pernah dihentikan tentara. Hati-hati kalau bicara soal penguasa.'], ['Takmir masjid', 'Masjid ini rumah Allah. Yang lapar boleh makan di sini, siapa pun dia.', '1998-01']],
  rawa: [['Ibu-ibu di dapur umum', 'Harga beras sudah dua kali lipat sejak Lebaran. Anak saya makan nasi aking.', '1998-02'], ['Warga di pos ronda', 'Kalau mahasiswa sering ke sini, nanti kampung kita yang didatangi tentara.'], ['Tukang ojek', 'Mau demo, mau tidak, besok saya tetap narik.']],
  rawamangun: [['Orang tua muridmu', 'Belajar yang rajin, jangan ikut-ikutan demo. Masa depanmu masih panjang.'], ['Pemilik toko kelontong', 'Orang borong mi instan dan gula sejak kemarin. Saya sendiri tidak kebagian.', '1998-01']]
};
function suaraDi(t) {
  const ada = (SUARA[t] || []).filter(([, k, dari = '', sampai = '9999']) => S.bulan >= dari && S.bulan < sampai && !(S.f.suara || []).includes(k));
  if (!ada.length) return null;
  const [siapa, k] = pick(ada); (S.f.suara = S.f.suara || []).push(k);
  return { siapa, k };
}

/* ---------- benda petunjuk: satu atau dua per tempat, tidak pernah satu-satunya jalan ---------- */
const BENDA = {
  lorong: { pengumuman: ['Pengumuman kos', () => `Kertas di dinding lorong: “Pagar dikunci pukul ${fmtJam(jamMalam())}.” ${lapor('ibukos') >= 1 ? 'Angka jamnya baru saja dicoret dan ditulis ulang dengan spidol.' : 'Tulisannya sudah pudar.'}`] },
  tamu: {
    foto: ['Foto Presiden', () => 'Foto Presiden dan Wakil Presiden di dinding. Bingkainya dilap tiap pagi. Di bawahnya, kalender bergambar pohon beringin.'],
    bukutamu: ['Buku tamu kos', () => lapor('ibukos') >= 2 ? 'Namamu tertulis berkali-kali minggu ini, dengan jam pulang di sebelahnya. Tulisan ibu kos makin rapi, seperti untuk dibaca orang lain.' : lapor('ibukos') ? 'Ada kolom baru di buku tamu: “jam pulang”. Baru diisi beberapa hari.' : 'Buku tamu yang jarang diisi. Halaman terakhirnya daftar belanja.']
  },
  kelas: { absen: ['Daftar hadir', s => s.sorotan >= 40 ? 'Di sebelah namamu ada titik kecil dengan pensil. Di sebelah nama tiga kawan PENA juga.' : 'Namamu tercatat rapi. Kamu belum pernah absen tiga kali.'] },
  dosen: { penguji: ['Daftar dosen penguji', s => s.bulan >= '1997-06' ? 'Daftar dosen penguji ditempel di pintu. Nama Pak Harsono dicoret dengan spidol, dan tidak ada yang mau menjelaskan kenapa.' : 'Daftar dosen penguji ditempel di pintu. Pak Harsono menguji tiga mata kuliah semester ini.'] },
  sekre: { bukutamu: ['Buku tamu sekretariat', () => kaderAktif().length ? 'Kamu membaca jam datang dan pulang di buku tamu. ' + clue() : 'Buku tamu sekretariat. Kebanyakan nama senior.'] },
  masjid: { kajian: ['Jadwal kajian', () => 'Jadwal kajian Selasa malam: “Amar makruf nahi mungkar.” Seseorang menambahkan dengan pensil: “termasuk kepada penguasa?”'] },
  senat: { kaca: ['Kaca meja senat', () => 'Di bawah kaca meja Mas Yudi terselip kartu nama: Kapten Inf. Sutrisno, Kodim 0505 Jakarta Timur. Ada nomor rumah yang ditulis tangan di baliknya.'] },
  kantin: {
    harga: ['Papan harga', () => `Nasi rames ${rp(harga(1500))}. ${indeks() > 1.3 ? 'Angkanya sudah dihapus dan ditulis ulang berkali-kali sampai papannya kelabu.' : 'Tulisannya masih tulisan awal semester.'}`],
    koran: ['Koran di meja', s => s.bulan < '1997-06' ? 'Kompas hari ini: pembangunan, swasembada, tujuh persen. Berita penangkapan aktivis ada di halaman sembilan, dua paragraf.' : s.bulan < '1998-01' ? 'Koran hari ini: “Rupiah Terus Melemah”. Di bawahnya, iklan rumah di Cibubur.' : 'Koran hari ini: daftar harga sembako di pasar induk, dan di sebelahnya foto antrean minyak goreng.']
  },
  warung: { utang: ['Buku utang warung', s => s.f.damarHilang ? 'Nama Bang Damar masih ada di halaman pertama buku utang. Penjual kopi tidak pernah mencoretnya.' : 'Nama Bang Damar ada di halaman pertama buku utang, dengan angka yang tidak pernah berkurang.'] },
  kios: { pesanan: ['Buku pesanan fotokopi', s => s.bulan >= '1997-06' && penyusupAktif() ? `Ada pesanan “daftar anggota, lima rangkap” bulan lalu. Pemesannya hanya menulis inisial: ${KADER[S.penyusup].nama[0]}.` : 'Pesanan biasa: diktat, skripsi, undangan pernikahan.'] },
  rawa: { daftar: ['Daftar warga', () => lapor('pakrt') >= 2 ? 'Daftar warga dari kelurahan di meja Pak RT sudah ditandatangani. Kolom pendatang terisi tiga nama.' : 'Daftar warga dari kelurahan di meja Pak RT. Belum ditandatangani.'] }
};
const bendaHTML = t => { const b = BENDA[t]; return b ? `<div class="look"><span class="label">Amati</span>${Object.entries(b).map(([id, [l]]) => `<button type="button" class="chip" data-a="look" data-v="bd_${id}">${l}</button>`).join('')}</div>` : ''; };

/* ---------- siapa yang bisa diajak bicara di tempatmu ---------- */
function bicaraHari(s) {
  const m = s.m;
  if (!m || m.step !== 'jalan' || m.peta || m.jam + 0.5 > jamMalam()) return [];
  return wargaDi(m.lokasi).map(id => Object.keys(DIALOG).find(k => DIALOG[k].warga === id && !s.f['dlg_' + k] && (!DIALOG[k].req || DIALOG[k].req(s)))).filter(Boolean);
}
for (const n of Object.values(NODES)) if (n.mode === 'hari') n.bicara = bicaraHari;
// gambar warga di tempatnya
const POS_WARGA = { warung: [[740, 230, 0.8], [30, 240, 0.8]], sekre: [[760, 250, 0.8], [600, 260, 0.75]], masjid: [[60, 220, 0.85], [200, 230, 0.8], [810, 250, 0.7]], senat: [[600, 200, 0.85], [740, 220, 0.8]], dosen: [[700, 150, 0.9]], lorong: [[600, 200, 0.9]], tamu: [[620, 170, 0.95]] };
const gambarWarga = t => wargaDi(t).filter(id => !WARGA[id].digambar).map((id, i) => { const p = (POS_WARGA[t] || [])[i]; return p ? hot(id, WARGA[id].nama, person(C[WARGA[id].c || id], ...p)) : ''; }).join('');

/* ---------- mini game obrolan dilebur ke percakapan ---------- */
// dua giliran diambil dari OBROLAN; urutan opsinya disimpan di S.m.ob supaya tetap sama setelah dimuat ulang
const lawanOb = id => id === 'telepon' ? 'ibu' : id.replace('kader_', '');
function giliranOb(i) {
  const ob = S.m.ob, x = OBROLAN[ob.id].giliran.find(y => y.id === ob.giliran[i]);
  return { kata: val(x.kata), opsi: ob.urut[i].map(j => x.opsi[j]) };
}
function hadiahOpsi() {
  const k = S.m.ob.id.startsWith('kader_') && S.m.ob.id.slice(6), K = KADER[k];
  if (!K || S.f['hadiah_' + k] || S.uang.tunai < harga(K.harga)) return [];
  return [[`Berikan ${K.benda} yang kamu beli untuknya (${rp(harga(K.harga))})`, 's', `${K.nama} menerima ${K.benda} itu lama sekali tanpa bicara, lalu menyimpannya di saku.`, null, () => { if (bayar(harga(K.harga))) { S.f['hadiah_' + k] = true; tambahDekat(k, 2); } return {}; }]];
}
DIALOG.ob = {
  get nama() { return OBROLAN[S.m.ob.id].nama; },
  get siapa() { return lawanOb(S.m.ob.id); },
  get bobot() { return S.m.ob.id === 'organisasi' ? 0 : 0.5; },
  tutup: {},
  giliran: [0, 1].map(i => ({ kata: () => giliranOb(i).kata, opsi: () => giliranOb(i).opsi.map(([t, a]) => [t, a, OBROLAN[S.m.ob.id].reaksi[a]]).concat(i === 1 ? hadiahOpsi() : []) })),
  // seperti mini game lama: berhasil kalau ada yang sejalan dan tidak ada yang berlawanan
  sesudah(g) {
    const ok = g.jejak.some(x => x.arah === 's') && !g.jejak.some(x => x.arah === 'l');
    selesaiKegiatan(KEG[S.m.ob.keg], ok);
    g.tutup = S.m.catatan; S.m.catatan = null;
  }
};
function mulaiOb(k) {
  const O = OBROLAN[k.slot], a = ambilBaru('obrolan_' + k.slot, O.giliran);
  let b = ambilBaru('obrolan_' + k.slot, O.giliran);
  while (b.id === a.id) b = pick(O.giliran);
  S.m.ob = { id: k.slot, keg: k.id, giliran: [a.id, b.id], urut: [a, b].map(x => acak(x.opsi.map((_, j) => j))) };
  S.ui.obs = null;
  S.ui.dlg = { k: 'ob', i: 0, jejak: [], selesai: false };
}
