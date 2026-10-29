/* Angkatan 98 · mode permainan */
const randInt = n => Math.floor(Math.random() * n);

/* ---------- cerita biasa ---------- */
MODES.story = {
  panel(n) { return meta(n) + prose(n) + kabarHTML() + lookHTML(n) + (S.ui.last ? resultHTML() : choicesHTML(val(n.choices))); },
  act(n, a, v) {
    if (a !== 'choose' || S.ui.last) return;
    const c = val(n.choices)[+v];
    if (!c || (c.req && !c.req(S)) || (c.dis && c.dis(S))) return;
    const b = snap();
    if (c.cost && !bayar(val(c.cost))) return;
    apply(val(c.fx));
    const here = S.node;
    if (c.run) c.run(S);
    if (S.node !== here) return;
    const note = val(c.note), g = val(c.go);
    if (!note) return go(g);
    setResult(val(c.t), note, b, g, c.lanjut);
  },
  actions(n) {
    if (S.ui.last) return [{ a: 'next' }];
    return visibleChoices(val(n.choices)).filter(([c]) => !(c.dis && c.dis(S))).map(([, i]) => ({ a: 'choose', v: i }));
  }
};

/* ---------- pembuka ---------- */
MODES.intro = {
  panel() {
    const d = loadSave();
    return `<div class="intro"><p class="label">Permainan sudut pandang orang pertama · sekitar 85 menit</p><h1>Angkatan 98</h1><p>Kamu mahasiswa baru di Jakarta, Agustus 1996. Setiap layar adalah pandangan matamu sendiri. Klik orang dan benda untuk mengamati, lalu putuskan apa yang kamu lakukan. Permainan tersimpan otomatis di browser ini.</p><p class="fine">Kampus dan tokoh fiktif. Peristiwa besarnya nyata. Tidak ada ending yang selamat utuh.</p><div class="row"><button type="button" class="btn" data-a="goto" data-v="p_rumah">Mulai dari awal</button>${d && d.node !== 'intro' && !d.ending ? `<button type="button" class="btn alt" data-a="lanjut">Lanjutkan (${namaBulan(d.bulan)})</button>` : ''}</div></div>`;
  },
  act() {},
  actions() { return [{ a: 'goto', v: 'p_rumah' }]; }
};

/* ---------- KTM ---------- */
MODES.ktm = {
  panel(n) {
    if (S.m.step === 1) return meta(n) + `<p>Ini KTM-mu. Kenali bagian-bagiannya, karena kelak kamu akan memeriksa KTM orang lain.</p><ul class="rules"><li><b>Foto</b> harus cocok dengan wajah pemiliknya.</li><li><b>NIM</b>: dua angka pertama angkatan, dua angka berikutnya kode fakultas.</li><li><b>Stempel asli</b>: lingkaran merah ganda dengan bintang di tengah.</li></ul>${deltasHTML(S.m.delta)}<button type="button" class="btn" data-a="goto" data-v="b1_lapangan">Ke lapangan</button>`;
    return meta(n) + `<p>Loket daftar ulang di aula. Petugas memotretmu, lalu menyodorkan formulir. KTM jadi dalam lima menit.</p>
      <form class="form" id="ktm-form"><div class="form"><label class="label" for="ktm-nama">Nama lengkap</label><input id="ktm-nama" maxlength="22" autocomplete="off" value="${esc(S.nama)}"></div>
      <fieldset><legend class="label">Foto</legend><div class="row">${FOTO.map((f, i) => `<button type="button" class="foto" data-a="foto" data-v="${i}" aria-pressed="${S.foto === i}" aria-label="Foto ${i + 1}"><svg viewBox="0 0 200 240">${face(f)}</svg></button>`).join('')}</div></fieldset>
      <fieldset><legend class="label">Fakultas</legend><div class="fak">${Object.entries(FAK).map(([k, v]) => `<button type="button" class="choice" data-a="fak" data-v="${k}" aria-pressed="${S.fak === k}"><span class="key" aria-hidden="true">${k[0]}</span><span><b>${k}</b><small>${v.bonus}</small></span></button>`).join('')}</div></fieldset>
      <button type="submit" class="btn">Ambil KTM</button></form>`;
  },
  act(n, a, v) {
    if (a === 'foto') { S.foto = +v; return render(); }
    if (a === 'fak') { S.fak = v; return render(); }
    if (a === 'ambil' && S.m.step !== 1) {
      S.nama = S.nama.trim() || 'Bagas Pratama';
      S.nim = `96.${FAK[S.fak].kode}.${String(100 + randInt(900)).padStart(4, '0')}`;
      const b = snap(); apply(FAK[S.fak].fx); S.m.delta = diff(b); S.m.step = 1; render();
    }
  },
  actions() { return S.m.step === 1 ? [{ a: 'goto', v: 'b1_lapangan' }] : [{ a: 'fak', v: pick(Object.keys(FAK)) }, { a: 'foto', v: randInt(4) }, { a: 'ambil' }]; }
};

/* ---------- formulir bertahap ---------- */
const POS = { tali: 'Tali massa', medis: 'Medis', hukum: 'Hukum', humas: 'Humas', sweeping: 'Sweeping' };
MODES.form = {
  enter(n) { S.m = { step: 0, pick: {}, multi: [], pos: {} }; },
  panel(n) {
    let h = meta(n) + prose(n) + lookHTML(n);
    if (S.ui.last) return h + resultHTML();
    const st = n.steps[S.m.step];
    if (st.type === 'pos') {
      const posts = Object.keys(POS).slice(0, S.protokol.includes('sel') ? 4 : 5);
      return h + `<div class="ask"><p class="label">${st.label}</p><div class="posgrid">${posts.map(p => `<div class="slot full"><span class="label">${POS[p]}</span><span>${S.m.pos[p] ? KADER[S.m.pos[p]].nama + ' · ' + KADER[S.m.pos[p]].ahli : 'kosong'}</span><button type="button" class="link" data-a="cyc" data-v="${p}">Ganti</button></div>`).join('')}</div>${S.protokol.includes('sel') ? '<p class="fine">Sistem sel mengurangi satu pos.</p>' : ''}<button type="button" class="btn" data-a="ok">Simpan pos kader</button></div>`;
    }
    const opts = val(st.options).filter(o => !o.req || o.req(S));
    if (st.multi) return h + `<div class="ask"><p class="label">${st.label} (pilih ${st.multi})</p><div class="acts">${opts.map(o => `<button type="button" class="chip" data-a="tog" data-v="${o.v}" aria-pressed="${S.m.multi.includes(o.v)}"${o.dis && o.dis(S) ? ' disabled' : ''}><b>${o.t}</b>${o.d ? ` <small>${o.d}</small>` : ''}</button>`).join('')}</div><button type="button" class="btn" data-a="ok"${S.m.multi.length !== st.multi ? ' disabled' : ''}>Pilih</button></div>`;
    return h + `<div class="ask"><p class="label">${st.label}</p><ol class="choices">${opts.map((o, k) => `<li><button type="button" class="choice" data-a="opt" data-v="${o.v}"${o.dis && o.dis(S) ? ' disabled' : ''}><span class="key" aria-hidden="true">${'ABCDEFGH'[k]}</span><span>${o.t}${o.d ? `<small>${o.d}</small>` : ''}${o.dis && o.dis(S) ? `<small class="bad">${o.alasan || 'belum bisa dipilih'}</small>` : ''}</span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    if (S.ui.last) return;
    const st = n.steps[S.m.step];
    if (a === 'cyc') { const pool = [null, ...kaderAktif()]; const cur = pool.indexOf(S.m.pos[v] || null); S.m.pos[v] = pool.at((cur + 1) % pool.length); return render(); }
    if (a === 'tog') { const i = S.m.multi.indexOf(v); if (i >= 0) S.m.multi.splice(i, 1); else if (S.m.multi.length < st.multi) S.m.multi.push(v); return render(); }
    if (a === 'opt') { const o = val(st.options).find(x => x.v === v); if (!o || (o.dis && o.dis(S))) return; S.m.pick[st.id] = v; }
    else if (a === 'ok') { if (st.multi) { if (S.m.multi.length !== st.multi) return; S.m.pick[st.id] = [...S.m.multi]; S.m.multi = []; } else if (st.type === 'pos') S.m.pick[st.id] = { ...S.m.pos }; else return; }
    else return;
    S.m.step++;
    if (S.m.step < n.steps.length) return render();
    const b = snap(), res = n.done(S, S.m.pick);
    apply(res.fx);
    setResult(null, res.note, b, res.go || n.next, res.lanjut);
  },
  actions(n) {
    if (S.ui.last) return [{ a: 'next' }];
    const st = n.steps[S.m.step];
    if (st.type === 'pos') { const ks = kaderAktif(); return ks.length && Math.random() < 0.7 ? [{ a: 'cyc', v: pick(Object.keys(POS)) }] : [{ a: 'ok' }]; }
    const opts = val(st.options).filter(o => (!o.req || o.req(S)) && !(o.dis && o.dis(S)));
    if (st.multi) return S.m.multi.length === st.multi || opts.length < st.multi ? [{ a: S.m.multi.length === st.multi ? 'ok' : 'tog', v: S.m.multi.at(0) }] : [{ a: 'tog', v: pick(opts.filter(o => !S.m.multi.includes(o.v))).v }];
    return opts.map(o => ({ a: 'opt', v: o.v }));
  }
};

/* ---------- ronde ---------- */
MODES.rounds = {
  enter(n) { S.m = { r: 0, res: null }; },
  panel(n) {
    const rs = val(n.rounds), R = rs[S.m.r];
    let h = meta(n, S.ui.last ? '' : `ronde ${Math.min(S.m.r + 1, rs.length)} dari ${rs.length}`) + (S.m.r === 0 && !S.m.res ? prose(n) : '') + lookHTML(n);
    if (S.ui.last) return h + resultHTML();
    if (S.m.res) return h + `<section class="result" tabindex="-1"><p class="label">Kamu memilih</p><p class="pick">${S.m.res.pick}</p>${[].concat(S.m.res.note).map(p => `<p>${p}</p>`).join('')}${deltasHTML(S.m.res.deltas)}<button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    const opts = val(R.options).map((o, i) => [o, i]).filter(([o]) => !o.req || o.req(S));
    return h + `<div class="prose"><p>${val(R.text)}</p></div><div class="ask"><ol class="choices">${opts.map(([o, i], k) => `<li><button type="button" class="choice" data-a="opt" data-v="${i}"><span class="key" aria-hidden="true">${'ABCDEF'[k]}</span><span>${val(o.t)}${o.d ? `<small>${val(o.d)}</small>` : ''}</span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    if (S.ui.last) return;
    const rs = val(n.rounds), here = S.node;
    if (a === 'opt' && !S.m.res) {
      const o = val(rs[S.m.r].options)[+v]; if (!o || (o.req && !o.req(S))) return;
      const b = snap(); apply(val(o.fx));
      const note = o.run ? o.run(S) : val(o.note);
      if (S.node !== here) return;
      S.m.res = { pick: val(o.t), note, deltas: diff(b) };
      return render('.result');
    }
    if (a === 'rn' && S.m.res) {
      S.m.res = null; S.m.r++;
      if (S.m.r < rs.length) return render();
      const b = snap(), res = n.done(S);
      if (S.node !== here) return;
      apply(res.fx);
      setResult(null, res.note, b, res.go || n.next);
    }
  },
  actions(n) {
    if (S.ui.last) return [{ a: 'next' }];
    if (S.m.res) return [{ a: 'rn' }];
    const opts = val(val(n.rounds)[S.m.r].options);
    return opts.map((o, i) => [o, i]).filter(([o]) => !o.req || o.req(S)).map(([, i]) => ({ a: 'opt', v: i }));
  }
};

/* ---------- kamar kos: uang, slot, kejadian ---------- */
const SLOT = {
  kuliah: { t: 'Kuliah', d: 'IPK +0,15', run: () => { apply({ ipk: 0.15 }); return 'Kamu masuk semua kelas dan mengumpulkan tugas tepat waktu.'; } },
  organisasi: { t: 'Organisasi', d: 'Pengaruh +4, Sorotan +3', run: () => {
    apply({ pengaruh: 4, sorotan: 3 });
    if (!S.kader.wahyu && rekrut('wahyu')) return 'Kamu mencetak selebaran semalaman bersama Wahyu, anak Teknik. Paginya ia bilang mau ikut kamu.';
    return 'Kamu ikut rapat dan menempel pengumuman diskusi di papan fakultas.';
  } },
  baca: { t: 'Baca di sekretariat', d: 'satu Kamis membaca', req: () => !!S.buku.baca, run: () => { if (!S.buku.baca) return 'Kamu membaca ulang catatan-catatan lama di sekretariat.'; apply({ pengaruh: 1 }); return baca(1) || `Kamu membaca ${BUKU[S.buku.baca].judul}. Tinggal ${S.buku.sisa} Kamis lagi.`; } },
  kerja: { t: 'Kerja sambilan', d: 'les privat atau jaga fotokopi', run: () => { const u = harga(S.fak === 'Teknik' ? 50000 : 40000); apply({ uang: u }); return `Kamu memberi les privat untuk anak SMP di Rawamangun. Upahnya ${rp(u)}.`; } },
  istirahat: { t: 'Istirahat', d: 'Nyali +10', run: () => { apply({ nyali: 10 }); return 'Kamu tidur siang, mencuci baju, dan menonton televisi di ruang tamu ibu kos.'; } },
  damar: { t: 'Ngopi dengan Bang Damar', d: 'kepercayaan +1', req: () => !S.f.damarHilang, run: () => { apply({ damar: 1 }); return 'Bang Damar bercerita tentang aksi-aksi lamanya sampai warung tutup.'; } },
  ratna: { t: 'Ngopi dengan Kak Ratna', d: 'kepercayaan +1', run: () => { apply({ ratna: 1 }); return 'Kak Ratna memintamu merangkum fotokopian buku, lalu memeriksa rangkumanmu dengan pulpen merah.'; } },
  fikri: { t: 'Ngopi dengan Bang Fikri', d: 'kepercayaan +1', run: () => { apply({ fikri: 1 }); return 'Bang Fikri mengajakmu mendata keluarga miskin di kampung belakang kampus.'; } },
  yudi: { t: 'Ngopi dengan Mas Yudi', d: 'kepercayaan +1', run: () => { apply({ yudi: 1 }); return 'Mas Yudi mentraktirmu soto di kantin rektorat dan mengenalkanmu pada beberapa pegawai.'; } },
  telepon: { t: 'Telepon rumah', d: 'Ibu +1, Nyali +5', run: () => { apply({ nyali: 5, ibu: 1, uang: -harga(2000) }); return 'Ibumu bertanya kamu sudah makan atau belum. Tiga menit habis terlalu cepat.'; } },
  dika: { t: 'Surat untuk Dika', d: 'Dika +1', run: () => { apply({ dika: 1, tahu: 1 }); return 'Kamu menulis surat panjang untuk Dika tentang Jakarta, kampus, dan kawan-kawanmu.'; } },
  selidiki: { t: 'Perhatikan kader', d: 'satu petunjuk', req: () => kaderAktif().length > 0, run: () => clue() },
  titip: { t: 'Titipkan buku terlarang', d: 'aman dari razia', req: () => S.buku.dikos.length > 0, run: () => { S.buku.dikos = []; S.f.bukuDititip = true; return 'Buku-buku terlarang kamu bungkus koran dan titipkan ke rumah Pak RT.'; } },
  dapur: { t: 'Bantu dapur umum warga', d: 'Kepercayaan massa +4', req: () => S.f.dapurUmum, run: () => { const pakai = Math.min(2, S.uang.barang); apply({ massa: 4 + pakai * 2, barang: -pakai }); return pakai ? `Kamu menyumbangkan ${pakai} paket beras dan minyak. Antrean nasi lebih panjang dari minggu lalu.` : 'Kamu membantu memasak di dapur umum sampai tengah malam.'; } }
};
for (const [id, b] of Object.entries(BUKU)) SLOT['buku_' + id] = { t: `Mulai baca: ${b.judul}`, d: `${b.lama} Kamis${b.terlarang ? ', terlarang' : ''}`, req: () => !S.buku.baca && !S.buku.selesai.includes(id), run: () => { S.buku.baca = id; S.buku.sisa = b.lama; return `Kamu meminjam ${b.judul} dari rak sekretariat.`; } };
const CLUES = {
  wahyu: ['Wahyu memakai pager baru, katanya hadiah dari paman di Bekasi. Minggu lalu ia mengeluh tidak sanggup bayar kos.', 'Wahyu menjual jam tangannya untuk membeli tinta stensil, dan tidak bercerita ke siapa pun.'],
  asep: ['Asep selalu tahu jadwal rapat yang tidak pernah diberitahukan kepadanya.', 'Asep pulang ke kampung tiap akhir bulan untuk mengantar uang buat ibunya.'],
  dimas: ['Dimas tidak pernah ada di sekretariat setiap kali ada razia, padahal biasanya ia tidur di sana.', 'Dimas menulis puisi tentang kawan-kawannya dan membacakannya di warung kopi.']
};
function clue() {
  const cands = kaderAktif().filter(k => CLUES[k]);
  if (!cands.length) { const k = pick(kaderAktif()); return `Kamu memperhatikan ${KADER[k].nama}. Tidak ada yang aneh.`; }
  const k = pick(cands), guilty = k === S.penyusup && penyusupAktif();
  S.f['clue_' + k] = (S.f['clue_' + k] || 0) + (guilty ? 1 : 0);
  return 'Kamu memperhatikan ' + KADER[k].nama + '. ' + CLUES[k].at(guilty ? 0 : 1);
}
const EVENTS = [
  () => S.sorotan >= 20 ? { t: 'Hansip memeriksa KTP semua penghuni kos. Namamu dicatat lebih lama dari yang lain.', fx: { sorotan: 3 } } : { t: 'Hansip memeriksa KTP semua penghuni kos. Tidak ada yang aneh.' },
  () => ({ t: 'Wesel dari rumah telat seminggu. Kamu makan mi instan tiga hari berturut-turut.', fx: { nyali: -3 } }),
  () => ({ t: 'Harga nasi bungkus di warung langganan naik lagi. Ibu warung minta maaf.', fx: { uang: -harga(3000) } }),
  () => ({ t: 'Kawan sebelah kamar meminjam uang untuk ongkos pulang ke Bogor. Ia berjanji mengembalikannya bulan depan.', fx: { uang: -harga(10000), massa: 2 } }),
  () => ({ t: 'Pesan pager masuk ke sekretariat untukmu: RAPAT SENAT RABU PAGI. DATANG. Y.', fx: { yudi: 1 } }),
  () => ({ t: 'Surat dari Ibu terselip di bawah pintu. Isinya resep sambal dan doa yang panjang.', fx: { nyali: 5 } }),
  () => ({ t: 'Dika mengirim surat. Ia ranking tiga di kelas dan ingin tahu kapan kamu pulang.', fx: { dika: 1, kagum: 1 } }),
  () => ({ t: 'Listrik padam dua malam. Kamu membaca dengan lilin sampai matamu perih.', fx: { nyali: -2 } })
];
const KOS_HOTS = {
  kalender: { label: 'Kalender', text: () => 'Kalender bergambar Danau Toba, hadiah dari toko kelontong. Setiap slot yang kamu isi akan dicoret merah.' },
  jendela: { label: 'Jendela', text: s => s.sorotan >= 50 ? 'Dua motor tanpa pelat parkir di ujung gang. Pengendaranya bergantian melihat ke jendelamu.' : s.sorotan >= 25 ? 'Ada satu motor tanpa pelat di ujung gang. Pengendaranya merokok dan tidak turun.' : 'Gang sepi. Anak-anak main layangan di ujung gang.' },
  cermin: { label: 'Cermin', text: s => s.nyali < 40 ? 'Wajahmu sendiri. Lingkar matamu makin gelap.' : 'Wajahmu sendiri. Masih kelihatan seperti mahasiswa biasa.' },
  meja: { label: 'Meja belajar', text: s => `KHS terakhir: IPK ${ipkStr(s.ipk)}. Di sebelahnya, surat dari rumah yang belum kamu balas.` },
  dompet: { label: 'Dompet', text: s => `Tunai ${rp(s.uang.tunai)}. Nasi bungkus sekarang ${rp(harga(1500))}, sewa kamar Rp 35.000 sebulan.` },
  pintu: { label: 'Lorong', text: () => 'Telepon umum koin menempel di dinding lorong. Ibu kos menempel tulisan tangan: TELEPON MAKS. 3 MENIT.' }
};
TOPIK.kurs = {
  truth: s => kursAt(nextMonth(s.bulan)) > kursAt(s.bulan) * 1.03 ? 'naik' : kursAt(nextMonth(s.bulan)) < kursAt(s.bulan) * 0.97 ? 'turun' : 'tetap',
  benar: (s, t) => t === 'naik' ? 'Dolar bakal naik lagi bulan depan. Kalau mau beli, beli sekarang.' : t === 'turun' ? 'Rupiah bakal menguat. Jangan borong dolar dulu.' : 'Kurs bakal tenang-tenang saja bulan depan.',
  salah: (s, t) => t === 'naik' ? 'Rupiah bakal menguat. Jangan borong dolar dulu.' : t === 'turun' ? 'Dolar bakal naik lagi bulan depan. Beli sekarang.' : pick(['Dolar bakal melonjak bulan depan.', 'Rupiah bakal menguat tajam bulan depan.'])
};
const nextMonth = b => { let y = Number(b.slice(0, 4)), m = Number(b.slice(5, 7)) + 1; if (m > 12) { m = 1; y++; } return `${y}-${String(m).padStart(2, '0')}`; };
MODES.kos = {
  enter(n) {
    const months = Math.max(1, monthsBetween(n.dari, n.bulan));
    const lines = [], kir = kiriman() * months, hidup = Math.round((35000 + 70000 * indeks()) * months / 500) * 500;
    S.bankBeku = false;
    if (S.uang.bank > 0) {
      const rate = (S.bulan >= '1998-01' ? 0.04 : 0.015) + (S.bankJenis === 'kecil' ? 0.005 : 0), bunga = Math.round(S.uang.bank * (Math.pow(1 + rate, months) - 1));
      S.uang.bank += bunga; lines.push(`Bunga bank ${months} bulan: +${rp(bunga)}.`);
      if (n.dari < '1997-11' && n.bulan >= '1997-11' && S.bankJenis === 'kecil') { S.bankBeku = true; lines.push('Pada 1 November 1997, bankmu termasuk 16 bank yang ditutup. Tabunganmu dibekukan sampai kunjungan berikutnya.'); }
    }
    if (S.uang.barang > 0) { const rusak = Math.round(S.uang.barang * (1 - Math.pow(0.85, months / 3))); if (rusak) { S.uang.barang -= rusak; lines.push(`${rusak} paket beras berkutu dan harus dibuang.`); } }
    S.uang.tunai += kir;
    lines.push(kir ? `Kiriman Bapak ${months} bulan: +${rp(kir)}.` : 'Bapak tidak mengirim uang bulan-bulan ini.');
    lines.push(`Sewa kos dan makan ${months} bulan: −${rp(hidup)}.`);
    S.uang.tunai -= hidup;
    if (S.uang.tunai < 0 && !S.bankBeku) { const t = Math.min(S.uang.bank, -S.uang.tunai); S.uang.bank -= t; S.uang.tunai += t; if (t) lines.push(`Kamu menarik ${rp(t)} dari bank untuk menutup biaya hidup.`); }
    if (S.uang.tunai < 0) { S.uang.tunai = 0; apply({ nyali: -6 }); lines.push('Uangmu tidak cukup. Kamu makan seadanya, Nyali −6.'); }
    S.kurs = Math.round(kursAt(n.bulan) * (0.95 + Math.random() * 0.1));
    S.m = { step: 'uang', slots: [], lines, out: [], ev: null };
    S.ui.kabar = [kabar('kurs', S.fak === 'Ekonomi' ? 'ekonomi' : pick(['radio', 'warung', 'yudi']))];
  },
  panel(n) {
    let h = meta(n) + prose(n) + lookHTML(n);
    const m = S.m;
    if (m.step === 'uang') {
      const kb = S.kurs, beli = Math.round(kb * 1.015), jual = Math.round(kb * 0.985), hb = harga(20000);
      h += `<div class="obs"><p class="label">Uang bulan ini</p><ul class="rules">${m.lines.map(l => `<li>${l}</li>`).join('')}</ul></div>` + kabarHTML();
      h += `<div class="ask"><p class="label">Atur uangmu · kurs hari ini ${rp(kb)} per dolar</p><div class="sheet"><table><thead><tr><th>Tempat</th><th>Isi</th><th>Tindakan</th></tr></thead><tbody>
        <tr><td>Tunai</td><td>${rp(S.uang.tunai)}</td><td>dipakai untuk semua pengeluaran</td></tr>
        <tr><td>Bank${S.bankJenis ? (S.bankJenis === 'kecil' ? ' swasta kecil' : ' besar') : ''}</td><td>${rp(S.uang.bank)}${S.bankBeku ? ' (beku)' : ''}</td><td>${S.bankJenis ? `<button type="button" class="chip" data-a="setor" data-v="25000"${S.uang.tunai < 25000 ? ' disabled' : ''}>Setor Rp 25.000</button> <button type="button" class="chip" data-a="tarik" data-v="25000"${S.uang.bank < 25000 || S.bankBeku ? ' disabled' : ''}>Tarik Rp 25.000</button>` : `<button type="button" class="chip" data-a="bank" data-v="kecil">Buka rekening bank swasta kecil (bunga lebih tinggi)</button> <button type="button" class="chip" data-a="bank" data-v="besar">Buka rekening bank besar</button>`}</td></tr>
        <tr><td>Dolar</td><td>USD ${S.uang.usd}</td><td><button type="button" class="chip" data-a="beliusd"${S.uang.tunai < beli * 10 ? ' disabled' : ''}>Beli USD 10 (${rp(beli * 10)})</button> <button type="button" class="chip" data-a="jualusd"${S.uang.usd < 10 ? ' disabled' : ''}>Jual USD 10 (${rp(jual * 10)})</button></td></tr>
        <tr><td>Barang</td><td>${S.uang.barang} paket</td><td><button type="button" class="chip" data-a="belibarang"${S.uang.tunai < hb ? ' disabled' : ''}>Beli 1 paket beras dan minyak (${rp(hb)})</button></td></tr>
        </tbody></table></div><button type="button" class="btn" data-a="selesai">Selesai mengatur uang</button></div>`;
      return h;
    }
    if (m.step === 'hasil') return h + `<section class="result" tabindex="-1"><p class="label">Bulan-bulan ini</p><ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul><div class="event"><p class="label">Kejadian</p><p>${m.ev}</p></div>${deltasHTML(m.deltas)}<button type="button" class="btn" data-a="goto" data-v="${n.next}">Lanjut</button></section>`;
    const DAYS = ['Slot 1', 'Slot 2', 'Slot 3'];
    const slots = DAYS.map((d, i) => { const a = m.slots[i]; return `<div class="slot${a ? ' full' : ''}"><span class="label">${d}</span>${a ? `<span>${SLOT[a].t}</span><button type="button" class="link" data-a="unslot" data-v="${i}">Hapus</button>` : '<span class="empty">kosong</span>'}</div>`; }).join('');
    const acts = Object.entries(SLOT).filter(([, a]) => !a.req || a.req(S)).map(([id, a]) => `<button type="button" class="chip" data-a="slot" data-v="${id}"${m.slots.length >= 3 ? ' disabled' : ''}><b>${a.t}</b> <small>${a.d}</small></button>`).join('');
    const tuduh = kaderAktif().length ? `<details class="tuduh"><summary>Telepon presidium: tuduh seorang kader sebagai penyusup</summary><div class="acts">${kaderAktif().map(k => `<button type="button" class="chip" data-a="tuduh" data-v="${k}">Tuduh ${KADER[k].nama}</button>`).join('')}</div></details>` : '';
    return h + (m.tuduhNote ? `<div class="obs"><p>${m.tuduhNote}</p></div>` : '') + `<div class="ask"><p class="label">Isi tiga slot waktu</p><div class="slots">${slots}</div><div class="acts">${acts}</div><button type="button" class="btn" data-a="jalani"${m.slots.length < 3 ? ' disabled' : ''}>Jalani</button>${tuduh}</div>`;
  },
  act(n, a, v) {
    const m = S.m, kb = S.kurs;
    if (m.step === 'uang') {
      if (a === 'bank') S.bankJenis = v;
      else if (a === 'setor' && S.uang.tunai >= 25000) { S.uang.tunai -= 25000; S.uang.bank += 25000; }
      else if (a === 'tarik' && S.uang.bank >= 25000 && !S.bankBeku) { S.uang.bank -= 25000; S.uang.tunai += 25000; }
      else if (a === 'beliusd' && bayar(Math.round(kb * 1.015) * 10)) S.uang.usd += 10;
      else if (a === 'jualusd' && S.uang.usd >= 10) { S.uang.usd -= 10; S.uang.tunai += Math.round(kb * 0.985) * 10; }
      else if (a === 'belibarang' && bayar(harga(20000))) S.uang.barang += 1;
      else if (a === 'selesai') m.step = 'slot';
      return render();
    }
    if (m.step !== 'slot') return;
    if (a === 'slot' && m.slots.length < 3 && SLOT[v] && (!SLOT[v].req || SLOT[v].req(S))) { m.slots.push(v); return render(); }
    if (a === 'unslot') { m.slots.splice(+v, 1); return render(); }
    if (a === 'tuduh' && aktif(v)) {
      const benar = v === S.penyusup && penyusupAktif();
      S.kader[v] = 'keluar';
      if (benar) { S.f.penyusupKetahuan = true; apply({ sorotan: -15, massa: 5 }); m.tuduhNote = `Tuduhanmu benar. ${KADER[v].nama} tidak membantah. Keesokan harinya ia menghilang dari kos, dan pager di sekretariat berhenti berbunyi di jam-jam aneh.`; }
      else { apply({ massa: -10 }); m.tuduhNote = `Tuduhanmu salah. ${KADER[v].nama} menangis di depan presidium lalu keluar dari gerakan. Beberapa kawan mulai menjaga jarak darimu.`; }
      return render();
    }
    if (a === 'jalani' && m.slots.length === 3) {
      const b = snap();
      m.out = m.slots.map(id => SLOT[id].run());
      const ev = pick(EVENTS)(); apply(ev.fx); m.ev = ev.t;
      if (S.cap > 0) S.cap--;
      m.deltas = diff(b); m.step = 'hasil';
      render('.result');
    }
  },
  actions(n) {
    const m = S.m;
    if (m.step === 'uang') { const ops = [{ a: 'selesai' }]; if (!S.bankJenis) ops.push({ a: 'bank', v: pick(['kecil', 'besar']) }); if (S.uang.tunai > 60000) ops.push({ a: 'setor', v: 25000 }, { a: 'beliusd' }, { a: 'belibarang' }); if (S.uang.usd >= 10) ops.push({ a: 'jualusd' }); return ops; }
    if (m.step === 'hasil') return [{ a: 'goto', v: n.next }];
    if (m.slots.length >= 3) return [{ a: 'jalani' }];
    return Object.entries(SLOT).filter(([, a]) => !a.req || a.req(S)).map(([id]) => ({ a: 'slot', v: id }));
  }
};

/* ---------- logistik ---------- */
const ITEMS = {
  air: { t: 'Air minum gelas (dus isi 48)', harga: 6000, per: 40, step: 5 },
  nasi: { t: 'Nasi bungkus', harga: 1500, per: 1, step: 50 },
  odol: { t: 'Odol dan kain basah', harga: 1200, per: 15, step: 10 },
  tali: { t: 'Tali tambang 50 m', harga: 25000, per: 150, step: 1 },
  p3k: { t: 'Kotak P3K', harga: 30000, per: 200, step: 1 },
  toa: { t: 'Sewa toa dan aki', harga: 20000, per: 300, step: 1 },
  spanduk: { t: 'Spanduk dan cat', harga: 15000, per: 0, step: 1 },
  gelang: { t: 'Gelang warna', harga: 100, per: 1, step: 100 },
  bus: { t: 'Sewa metromini', harga: 150000, per: 60, step: 1 }
};
const need = (id, M) => id === 'spanduk' ? 3 : id === 'bus' ? (S.f.ruteJauh ? Math.ceil(M / ITEMS.bus.per) : 0) : Math.ceil(M / ITEMS[id].per);
TOPIK.massa = {
  truth: s => s.m.M,
  benar: (s, t) => `Perkiraanku sekitar ${Math.round(t / 50) * 50} orang.`,
  salah: (s, t) => `Perkiraanku sekitar ${Math.round(t * pick([0.5, 0.6, 1.6, 2]) / 50) * 50} orang.`
};
MODES.logistik = {
  enter(n) {
    const M = Math.round(n.massaBenar(S));
    const ks = kaderAktif().length, anggaran = Math.round((40000 * ks + S.massa * (n.pendudukan ? 6000 : 2500) + (S.f.dapurUmum ? 50000 : 0)) * indeks());
    S.m = { M, anggaran, qty: Object.fromEntries(Object.keys(ITEMS).map(k => [k, 0])), simpan: null };
    S.ui.kabar = [kabar('massa', S.ratna >= 2 ? 'ratna' : 'damar')];
    S.m.est = Number((S.ui.kabar[0].teks.match(/(\d+)/) || [0, M])[1]);
  },
  panel(n) {
    let h = meta(n) + prose(n) + kabarHTML();
    if (S.ui.last) return h + resultHTML();
    const m = S.m, cost = id => harga(ITEMS[id].harga) * m.qty[id], total = Object.keys(ITEMS).reduce((s, id) => s + cost(id), 0), sisa = m.anggaran - total;
    h += `<div class="ask"><p class="label">Anggaran ${rp(m.anggaran)} · terpakai ${rp(total)} · sisa ${rp(sisa)}</p><div class="sheet"><table><thead><tr><th>Barang</th><th>Butuh untuk ±${m.est} orang</th><th>Jumlah</th><th>Biaya</th><th></th></tr></thead><tbody>`;
    for (const [id, it] of Object.entries(ITEMS)) {
      if (id === 'bus' && !S.f.ruteJauh) continue;
      const nd = id === 'spanduk' ? 3 : Math.ceil(m.est / it.per);
      h += `<tr><td>${it.t}</td><td>${nd}</td><td>${m.qty[id]}</td><td>${rp(cost(id))}</td><td><button type="button" class="chip" data-a="kurang" data-v="${id}"${m.qty[id] <= 0 ? ' disabled' : ''}>−${it.step}</button> <button type="button" class="chip" data-a="tambah" data-v="${id}"${sisa < harga(it.harga) * it.step ? ' disabled' : ''}>+${it.step}</button></td></tr>`;
    }
    h += `</tbody></table></div><div class="row"><button type="button" class="chip" data-a="pribadi"${S.uang.tunai < 25000 ? ' disabled' : ''}>Tambah Rp 25.000 dari uang pribadi</button></div><p class="label">Simpan barang di</p><div class="acts">${[['sekre', 'Sekretariat (berisiko kena razia)'], ['rt', 'Rumah Pak RT'], ['kos', 'Kos kader']].map(([v, t]) => `<button type="button" class="chip" data-a="simpan" data-v="${v}" aria-pressed="${m.simpan === v}"${v === 'rt' && !S.f.dapurUmum ? ' disabled' : ''}>${t}</button>`).join('')}</div><button type="button" class="btn" data-a="ok"${m.simpan ? '' : ' disabled'}>Selesai belanja</button></div>`;
    return h;
  },
  act(n, a, v) {
    if (S.ui.last) return;
    const m = S.m, total = () => Object.keys(ITEMS).reduce((s, id) => s + harga(ITEMS[id].harga) * m.qty[id], 0);
    if (a === 'tambah' && ITEMS[v] && m.anggaran - total() >= harga(ITEMS[v].harga) * ITEMS[v].step) m.qty[v] += ITEMS[v].step;
    else if (a === 'kurang' && m.qty[v] > 0) m.qty[v] = Math.max(0, m.qty[v] - ITEMS[v].step);
    else if (a === 'pribadi' && bayar(25000)) m.anggaran += 25000;
    else if (a === 'simpan') m.simpan = v;
    else if (a === 'ok' && m.simpan) {
      const b = snap(), siap = {}, notes = [];
      for (const id of Object.keys(ITEMS)) { const nd = need(id, m.M); siap[id] = nd ? Math.min(1, m.qty[id] / nd) : 1; }
      if (m.simpan === 'sekre' && penyusupAktif() && Math.random() < 0.4) { for (const k of Object.keys(siap)) siap[k] *= 0.5; notes.push('Dua hari sebelum aksi, separuh barang di sekretariat hilang. Tidak ada yang tahu siapa yang membuka gembok.'); }
      if (kaderAktif().some(k => S.kader[k] === 'diawasi') && Math.random() < 0.3) { siap.air *= 0.5; notes.push('Seorang kader yang sedang diawasi dihentikan di jalan, dan air minum yang dibawanya disita.'); }
      S.siap = siap;
      const cek = Object.keys(ITEMS).filter(id => id !== 'bus' || S.f.ruteJauh).map(id => `${siap[id] >= 0.8 ? '✓' : '✗'} ${ITEMS[id].t}`);
      notes.unshift(`Massa yang benar-benar datang sekitar ${m.M} orang.`);
      notes.push('Daftar periksa Kak Ratna: ' + cek.join(' · '));
      return setResult(null, notes, b, n.next);
    }
    render();
  },
  actions() {
    if (S.ui.last) return [{ a: 'next' }];
    const ops = Object.keys(ITEMS).map(id => ({ a: 'tambah', v: id }));
    if (!S.m.simpan) return [{ a: 'simpan', v: pick(['sekre', 'kos']) }, ...ops];
    return Math.random() < 0.2 ? [{ a: 'ok' }] : ops;
  }
};

/* ---------- inspeksi ---------- */
function docHTML(t) {
  return (t.docs || []).map(d => {
    if (d.type === 'none') return `<div class="noktm">${d.teks || 'Tidak membawa kartu'}</div>`;
    const fn = { ktm, kartu: kartuPresidium, pers: kartuPers, ktp }[d.type];
    return `<svg viewBox="0 0 340 214" role="img" aria-label="${d.type} atas nama ${esc(d.nama)}">${fn(d)}</svg>`;
  }).join('');
}
MODES.inspect = {
  enter(n) { S.m = { list: n.visitors(S), i: -1, bawah: false, tanya: false, tas: false, gelang: false, kode: false, ticks: 0, kep: {} }; },
  panel(n) {
    const m = S.m;
    if (S.ui.last) return meta(n) + resultHTML();
    if (m.i < 0) return meta(n) + prose(n) + `<p class="label">Aturan</p>${val(n.rules)}<button type="button" class="btn" data-a="mulai">Mulai berjaga</button>`;
    const t = m.list[m.i];
    let h = meta(n, `tamu ${m.i + 1} dari ${m.list.length}`) + (n.level >= 2 ? `<p class="label">Antrean ${'■'.repeat(Math.min(12, m.ticks))}${'□'.repeat(Math.max(0, 12 - m.ticks))}${m.ticks > 12 ? ' · massa mulai resah' : ''}</p>` : '');
    h += `<p class="say">${val(t.kata)}</p>` + (m.tanya ? `<p class="say">${val(t.jawab)}</p>` : '') + (m.kode ? `<p class="say">Kode hari ini? “${t.kode}”</p>` : '') + (m.tas ? `<p class="say">Isi tasnya: ${t.tas || 'buku dan botol minum'}.</p>` : '') + (m.gelang ? `<p class="say">Gelangnya: ${t.gelang || 'tidak pakai gelang'}.</p>` : '');
    h += `<div class="docs"><figure class="doc">${docHTML(t)}<figcaption class="label">Dokumen tamu</figcaption></figure><figure class="doc">${val(n.daftar) || ''}<figcaption class="label">${n.daftarLabel || 'Pegangan penjaga'}</figcaption></figure></div>`;
    const tools = [['tanya', 'Tanya sesuatu', m.tanya], ['bawah', m.bawah ? 'Lihat wajahnya' : 'Lihat ke bawah', false]];
    if (n.level >= 2) tools.push(['tas', 'Periksa tas', m.tas], ['gelang', 'Lihat gelang', m.gelang]);
    if (n.level >= 3) tools.push(['kode', 'Tanya kode hari ini', m.kode]);
    h += `<div class="row">${tools.map(([a, l, d]) => `<button type="button" class="chip" data-a="${a}"${d ? ' disabled' : ''}>${l}</button>`).join('')}</div>`;
    const opsi = [['izin', 'Izinkan masuk', ''], ['tolak', 'Tolak', 'alt']].concat((val(t.opsi) || []).map(o => [o.v, o.t, 'alt']));
    return h + `<div class="row">${opsi.map(([v, l, c]) => `<button type="button" class="btn ${c}" data-a="putus" data-v="${v}">${l}</button>`).join('')}</div>`;
  },
  act(n, a, v) {
    const m = S.m; if (S.ui.last) return;
    if (a === 'mulai' && m.i < 0) return blinkThen(() => { m.i = 0; render(); });
    if (m.i < 0) return;
    if (a === 'tanya' || a === 'tas' || a === 'gelang' || a === 'kode') { if (!m[a]) { m[a] = true; m.ticks++; } return render(); }
    if (a === 'bawah') { m.bawah = !m.bawah; m.ticks += m.bawah ? 1 : 0; return render(); }
    if (a === 'putus') {
      m.kep[m.list[m.i].id] = v; m.ticks++;
      if (m.i < m.list.length - 1) return blinkThen(() => { m.i++; m.bawah = m.tanya = m.tas = m.gelang = m.kode = false; render(); });
      const b = snap(), res = n.evaluate(S, m.kep, m.list);
      if (n.level >= 2 && m.ticks > 12 + m.list.length) { apply({ massa: -5 }); res.note = [].concat(res.note, 'Antrean terlalu lama. Massa di belakang mulai resah, dan aparat datang lebih awal.'); }
      apply(res.fx);
      setResult(null, res.note, b, res.go || n.next);
    }
  },
  actions(n) {
    const m = S.m;
    if (S.ui.last) return [{ a: 'next' }];
    if (m.i < 0) return [{ a: 'mulai' }];
    const t = m.list[m.i], ops = [{ a: 'putus', v: 'izin' }, { a: 'putus', v: 'tolak' }].concat((val(t.opsi) || []).map(o => ({ a: 'putus', v: o.v })));
    if (!m.tanya && Math.random() < 0.5) return [{ a: 'tanya' }];
    return ops;
  }
};
// penilaian bawaan: tolak yang sah merugikan, loloskan yang tidak sah berbahaya
function nilaiStandar(kep, list, salahMasuk) {
  const fx = { massa: 0, pengaruh: 0 }, lines = [];
  for (const t of list) {
    const v = kep[t.id];
    if (t.khusus) continue;
    if (t.sah && v === 'tolak') { fx.massa -= 4; lines.push(`${t.nama} ternyata anggota sah. ${t.salahTolak || 'Ia pulang dengan kecewa.'}`); }
    else if (!t.sah && v !== 'tolak') { salahMasuk(t, fx, lines); }
    else if (!t.sah) { fx.pengaruh += 3; lines.push(`${t.nama}: ${t.kebenaran}`); }
  }
  return { fx, lines };
}

/* ---------- kejar-kejaran: sembunyi ---------- */
const SPOTS = {
  plafon: { t: 'Plafon', p: 0.10, n: 3, area: 'atas' }, lemari: { t: 'Lemari pakaian', p: 0.30, n: 2, area: 'kamar' }, bak: { t: 'Bak air', p: 0.15, n: 4, area: 'mandi' },
  kolong: { t: 'Kolong ranjang', p: 0.45, n: 1, area: 'kamar' }, atap: { t: 'Atap genteng', p: 0.20, n: 3, area: 'atas' }, warga: { t: 'Rumah warga sebelah', p: 0.05, n: 1, area: 'luar' }
};
const AREA = { atas: 'ke arah langit-langit', kamar: 'ke kamar tidur', mandi: 'ke kamar mandi', luar: 'ke pintu belakang' };
const spotP = id => id === 'warga' ? (S.massa >= 50 || S.f.dapurUmum ? 0.05 : 0.6) : SPOTS[id].p;
MODES.hide = {
  enter(n) { S.m = { spot: null, r: 0, dekat: null, cue: null, res: null, selesai: null }; },
  panel(n) {
    const m = S.m;
    let h = meta(n, m.spot ? `ronde ${Math.min(m.r + 1, n.rounds)} dari ${n.rounds}` : '') + (m.spot ? '' : prose(n));
    if (S.ui.last) return h + resultHTML();
    if (m.res) return h + `<section class="result" tabindex="-1"><p>${m.res}</p><button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    if (!m.spot) return h + `<div class="ask"><p class="label">${n.siapa === 'yos' ? 'Sembunyikan Bang Yos di' : 'Sembunyi di'}</p><ol class="choices">${n.spots.map((id, k) => `<li><button type="button" class="choice" data-a="spot" data-v="${id}"><span class="key">${'ABCDEF'[k]}</span><span>${SPOTS[id].t}<small>Nyali −${SPOTS[id].n} per ronde${id === 'warga' ? ', aman kalau warga mempercayaimu' : ''}</small></span></button></li>`).join('')}</ol></div>`;
    return h + `<div class="prose"><p>${m.cue}</p></div><div class="ask"><ol class="choices"><li><button type="button" class="choice" data-a="diam"><span class="key">A</span><span>Diam dan tahan napas</span></button></li>${n.spots.filter(id => id !== m.spot).map((id, k) => `<li><button type="button" class="choice" data-a="pindah" data-v="${id}"><span class="key">${'BCDEF'[k]}</span><span>Pindah ke ${SPOTS[id].t.toLowerCase()}<small>25% terdengar</small></span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    const m = S.m;
    if (S.ui.last) return;
    const finish = ok => { const b = snap(); const r = n.after(S, ok); apply(r.fx); setResult(null, r.note, b, r.go); };
    if (a === 'spot' && !m.spot) { m.spot = v; nextCue(); return render(); }
    if (a === 'rn' && m.res) { m.res = null; if (m.selesai !== null) return finish(m.selesai); nextCue(); return render(); }
    if ((a === 'diam' || a === 'pindah') && m.spot && !m.res) {
      let found = false, txt = '';
      if (a === 'pindah') { if (Math.random() < 0.25) { found = true; txt = 'Lantai berderit saat kamu bergerak. Senter langsung menyorot ke arahmu.'; } else { m.spot = v; txt = `Kamu berhasil pindah ke ${SPOTS[v].t.toLowerCase()} tanpa suara.`; } }
      if (!found) {
        apply({ nyali: -(n.siapa === 'yos' ? 3 : SPOTS[m.spot].n) });
        const p = spotP(m.spot) + (m.actual === SPOTS[m.spot].area ? 0.35 : 0);
        if (m.spot === 'plafon' && S.nyali < 20 && n.siapa !== 'yos') { found = true; txt += ' Debu plafon masuk ke hidungmu. Kamu bersin.'; }
        else if (Math.random() < p) { found = true; txt += ` Sorot senter berhenti tepat di ${SPOTS[m.spot].t.toLowerCase()}.`; }
        else txt += ` Langkah itu ${m.actual === SPOTS[m.spot].area ? 'berhenti sangat dekat, lalu menjauh lagi' : 'menuju tempat lain'}.`;
      }
      m.r++;
      if (found) m.selesai = false; else if (m.r >= n.rounds) m.selesai = true;
      m.res = txt.trim(); return render('.result');
    }
  },
  actions(n) {
    const m = S.m;
    if (S.ui.last) return [{ a: 'next' }];
    if (m.res) return [{ a: 'rn' }];
    if (!m.spot) return n.spots.map(id => ({ a: 'spot', v: id }));
    return [{ a: 'diam' }, { a: 'diam' }, { a: 'pindah', v: pick(n.spots.filter(id => id !== m.spot)) }];
  }
};
function nextCue() {
  const m = S.m, areas = Object.keys(AREA);
  m.actual = pick(areas);
  const heard = Math.random() < 0.75 ? m.actual : pick(areas.filter(x => x !== m.actual));
  m.dekat = Object.keys(SPOTS).find(id => SPOTS[id].area === heard);
  m.cue = pick(['Bunyi sepatu lars', 'Sorot senter', 'Suara laki-laki berbisik', 'Derit pintu']) + ' bergerak ' + AREA[heard] + '.';
}

/* ---------- kejar-kejaran: lari ---------- */
const CUES = { peluit: { t: 'peluit', aman: 0.2 }, anjing: { t: 'anjing menggonggong', aman: 0.4 }, warung: { t: 'warung masih buka', aman: 0.6 }, musala: { t: 'pengajian di musala', aman: 0.7 }, pasar: { t: 'pasar malam', aman: 0.65 }, gelap: { t: 'gelap dan sepi', aman: 0.5 } };
function genJunction() {
  const dirs = pick([['Kiri', 'Kanan'], ['Kiri', 'Lurus', 'Kanan']]);
  const opsi = dirs.map(d => { const cue = pick(Object.keys(CUES)); const pa = cue === 'musala' && S.fikri >= 2 ? 0.9 : CUES[cue].aman; return { label: `${d}: ${CUES[cue].t}`, cue, aman: Math.random() < pa }; });
  if (!opsi.some(o => o.aman)) pick(opsi).aman = true;
  return opsi;
}
MODES.run = {
  enter(n) { S.m = { j: 0, stamina: 100, jarak: 3 + (S.f.dariAtap ? 1 : 0), opsi: genJunction(), lari: false, res: null, selesai: null }; },
  panel(n) {
    const m = S.m;
    let h = meta(n, `persimpangan ${Math.min(m.j + 1, 6)} dari 6`) + (m.j === 0 && !m.res ? prose(n) : '');
    if (S.ui.last) return h + resultHTML();
    h += `<p class="label">Stamina ${m.stamina} · Jarak dengan pengejar ${'■'.repeat(Math.max(0, m.jarak))}${'□'.repeat(Math.max(0, 5 - m.jarak))}</p>`;
    if (m.res) return h + `<section class="result" tabindex="-1"><p>${m.res}</p><button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    return h + `<div class="row"><button type="button" class="chip" data-a="pace" aria-pressed="${!m.lari}">Jalan cepat (stamina −15)</button><button type="button" class="chip" data-a="pace" aria-pressed="${m.lari}">Berlari (stamina −25, jarak +1)</button></div><div class="ask"><ol class="choices">${m.opsi.map((o, k) => `<li><button type="button" class="choice" data-a="arah" data-v="${k}"><span class="key">${'ABC'[k]}</span><span>${o.label}</span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    const m = S.m; if (S.ui.last) return;
    const finish = ok => { const b = snap(); const r = n.after(S, ok); apply(r.fx); setResult(null, r.note, b, r.go); };
    if (a === 'pace') { m.lari = !m.lari; return render(); }
    if (a === 'rn' && m.res) { m.res = null; if (m.selesai !== null) return finish(m.selesai); m.opsi = genJunction(); return render(); }
    if (a === 'arah' && !m.res) {
      const o = m.opsi[+v]; let t = '';
      m.stamina -= m.lari ? 25 : 15; if (m.lari) m.jarak++;
      if (o.aman) t = pick(['Gang itu tembus ke jalan kecil. Langkah pengejar terdengar makin jauh.', 'Kamu menyelinap di antara jemuran warga.', 'Jalan itu sepi dan gelap. Kamu terus berlari.']);
      else { m.jarak--; t = pick(['Buntu. Kamu harus memanjat pagar dan kehilangan waktu.', 'Ada orang berseragam di ujung gang. Kamu berbalik.', 'Seorang warga berteriak, dan pengejarmu mendengarnya.']); }
      if (m.j === 2) { if (S.massa >= 50 || S.f.dapurUmum) { m.jarak++; t += ' Seorang ibu membuka pintu dapurnya dan menyuruhmu lewat rumahnya.'; } else if (S.cap > 0) { m.jarak--; t += ' Warga mengenali wajahmu dari koran dan berteriak memanggil hansip.'; } }
      m.j++;
      if (m.jarak <= 0 || m.stamina <= 0) { m.selesai = false; t += m.stamina <= 0 ? ' Kakimu tidak kuat lagi.' : ' Tangan seseorang mencengkeram kerah bajumu.'; }
      else if (m.j >= 6) m.selesai = true;
      m.res = t; return render('.result');
    }
  },
  actions() {
    const m = S.m;
    if (S.ui.last) return [{ a: 'next' }];
    if (m.res) return [{ a: 'rn' }];
    return m.opsi.map((_, k) => ({ a: 'arah', v: k })).concat(m.stamina > 60 ? [{ a: 'pace' }] : []);
  }
};

/* ---------- kejar-kejaran: dibuntuti mobil ---------- */
const MANUVER = {
  belok: { t: 'Belok mendadak', d: 'Jarak +1, Curiga +20', run: m => { m.jarak++; m.curiga += 20; return 'Ban berdecit. Lampu di spion ikut berbelok, tapi tertinggal satu tikungan.'; } },
  pasar: { t: 'Masuk pasar atau jalan sempit', d: 'Jarak +2 kalau sopirnya orang setempat', run: m => { const lokal = m.sopir === 'wahyu'; m.jarak += lokal ? 2 : 0; m.curiga += 10; return lokal ? 'Wahyu hafal setiap gang di pasar ini. Mobil di belakang terjebak gerobak sayur.' : 'Sopir taksi ragu-ragu di gang sempit. Mobil di belakang tetap menempel.'; } },
  putar: { t: 'Putar balik di bundaran', d: 'Memastikan, Curiga +10', run: m => { m.curiga += 10; m.tahu = true; return 'Mobil itu ikut memutar penuh. Sekarang kamu yakin: kalian dibuntuti.'; } },
  terminal: { t: 'Ganti kendaraan di terminal', d: 'Lepas kalau Jarak minimal 2', run: m => { if (m.jarak >= 2) { m.lepas = true; return 'Kamu melompat ke bus kota yang baru berangkat. Mobil itu terhalang antrean angkot.'; } m.curiga += 20; return 'Mobil itu terlalu dekat. Mereka melihatmu turun, jadi kamu kembali naik.'; } },
  spbu: { t: 'Berhenti di SPBU dan menunggu', d: 'Curiga −20, Jarak kembali 0', run: m => { m.curiga = Math.max(0, m.curiga - 20); m.jarak = 0; return 'Kalian mengisi bensin pelan-pelan. Mobil itu parkir di seberang jalan dengan lampu mati.'; } }
};
MODES.tail = {
  enter(n) { S.m = { r: 0, jarak: 1, curiga: 30, sopir: aktif('wahyu') ? 'wahyu' : null, tahu: false, lepas: false, res: null, akhir: false }; },
  panel(n) {
    const m = S.m;
    let h = meta(n, m.akhir ? '' : `ronde ${Math.min(m.r + 1, 5)} dari 5`) + (m.r === 0 && !m.res ? prose(n) : '');
    if (S.ui.last) return h + resultHTML();
    h += `<p class="label">Jarak buntut ${'■'.repeat(Math.max(0, m.jarak))}${'□'.repeat(Math.max(0, 5 - m.jarak))} · Curiga ${Math.min(100, m.curiga)}</p>`;
    if (m.res) return h + `<section class="result" tabindex="-1"><p>${m.res}</p><button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    if (m.akhir) return h + `<div class="prose"><p>Kalian hampir sampai, tapi mobil itu masih ada di spion.</p></div><div class="ask"><ol class="choices"><li><button type="button" class="choice" data-a="ujung" data-v="bawa"><span class="key">A</span><span>Tetap ke safehouse<small>safehouse ketahuan, kader di sana diawasi</small></span></button></li><li><button type="button" class="choice" data-a="ujung" data-v="batal"><span class="key">B</span><span>Batalkan dan tidur di masjid<small>Nyali −10, babak berikutnya tanpa safehouse</small></span></button></li></ol></div>`;
    return h + `<div class="ask"><ol class="choices">${Object.entries(MANUVER).map(([id, x], k) => `<li><button type="button" class="choice" data-a="man" data-v="${id}"><span class="key">${'ABCDE'[k]}</span><span>${x.t}<small>${x.d}</small></span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    const m = S.m; if (S.ui.last) return;
    const finish = hasil => { const b = snap(); const r = n.after(S, hasil); apply(r.fx); setResult(null, r.note, b, r.go); };
    if (a === 'man' && !m.res && !m.akhir) {
      let t = MANUVER[v].run(m); m.r++;
      t += ' ' + pick(['Lampu merah di perempatan terasa sangat lama.', 'Radio sopir memutar dangdut terlalu keras.', 'Hujan mulai turun.', '']);
      if (m.curiga >= 100) { m.res = t + ' Mobil itu memotong jalan dan berhenti melintang di depan kalian.'; m.hasil = 'tangkap'; }
      else if (m.lepas || m.jarak >= 4) { m.res = t + ' Lampu di spion hilang.'; m.hasil = 'lepas'; }
      else if (m.r >= 5) { m.res = t; m.akhir = true; }
      else m.res = t;
      return render('.result');
    }
    if (a === 'rn' && m.res) { m.res = null; if (m.hasil) return finish(m.hasil); return render(); }
    if (a === 'ujung' && m.akhir) return finish(v === 'bawa' ? 'buntut' : 'batal');
  },
  actions() {
    const m = S.m;
    if (S.ui.last) return [{ a: 'next' }];
    if (m.res) return [{ a: 'rn' }];
    if (m.akhir) return [{ a: 'ujung', v: 'bawa' }, { a: 'ujung', v: 'batal' }];
    return Object.keys(MANUVER).map(id => ({ a: 'man', v: id }));
  }
};

/* ---------- razia: tindakan terbatas ---------- */
MODES.razia = {
  enter(n) { S.m = { left: n.budget(S), done: [], lines: [] }; },
  panel(n) {
    let h = meta(n, `sisa ${S.m.left} tindakan`) + prose(n) + lookHTML(n);
    if (S.ui.last) return h + resultHTML();
    if (S.m.lines.length) h += `<ul class="rules">${S.m.lines.map(l => `<li>${l}</li>`).join('')}</ul>`;
    const opts = n.options.filter(o => !S.m.done.includes(o.id) && (!o.req || o.req(S)));
    return h + `<div class="ask"><ol class="choices">${opts.map((o, k) => `<li><button type="button" class="choice" data-a="opt" data-v="${o.id}"><span class="key">${'ABCDEFGH'[k]}</span><span>${o.t}${o.d ? `<small>${o.d}</small>` : ''}</span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    if (S.ui.last || a !== 'opt') return;
    const o = n.options.find(x => x.id === v && !S.m.done.includes(x.id)); if (!o) return;
    apply(val(o.fx)); S.m.lines.push(o.run ? o.run(S) : val(o.note)); S.m.done.push(o.id); S.m.left--;
    if (S.m.left <= 0 || !n.options.some(x => !S.m.done.includes(x.id) && (!x.req || x.req(S)))) { const b = snap(); const r = n.after(S); apply(r.fx); return setResult(null, r.note, b, r.go); }
    render();
  },
  actions(n) { if (S.ui.last) return [{ a: 'next' }]; return n.options.filter(o => !S.m.done.includes(o.id) && (!o.req || o.req(S))).map(o => ({ a: 'opt', v: o.id })); }
};

/* ---------- buron ---------- */
const KOTA = {
  jakarta: { t: 'Jakarta', risiko: 14, ongkos: 0, kampus: true, jaringan: true, d: 'pusat gerakan, razia tiap minggu' },
  bandung: { t: 'Bandung', risiko: 10, ongkos: 15000, kampus: true, jaringan: true, d: 'kampus besar, intel kampus banyak' },
  yogya: { t: 'Yogyakarta', risiko: 6, ongkos: 30000, kampus: true, jaringan: true, d: 'basis aktivis dan penerbit' },
  surabaya: { t: 'Surabaya', risiko: 6, ongkos: 35000, kampus: true, jaringan: true, d: 'serikat buruh' },
  medan: { t: 'Medan', risiko: 8, ongkos: 60000, kampus: false, jaringan: true, d: 'jaringan pers, panas pada awal Mei' },
  magelang: { t: 'Magelang', risiko: 2, ongkos: 25000, kampus: false, jaringan: false, d: 'kampung halaman, kontak putus' }
};
const AKSI_BURON = {
  sembunyi: { t: 'Bersembunyi', d: 'Jejak −10, Nyali +4', run: () => { apply({ jejak: -10, nyali: 4 }); return 'Kamu tidak keluar kamar seminggu penuh.'; } },
  wartel: { t: 'Kontak pusat lewat wartel', d: 'cepat, Jejak +5', run: () => kontak('wartel', S.sorotan > 60 ? 10 : 5, 0) },
  pager: { t: 'Kontak pusat lewat pager', d: 'pesan pendek satu arah, Jejak +2', run: () => kontak('pager', 2, 0) },
  kurir: { t: 'Kontak pusat lewat kurir', d: 'lambat, kabar berubah tiap perantara', run: () => kontak('kurir', 0, 2) },
  surat: { t: 'Kontak pusat lewat surat berkode', d: 'paling aman, bisa tidak sampai', run: () => Math.random() < 0.25 ? 'Suratmu tidak pernah sampai.' : kontak('surat', 0, 1) },
  email: { t: 'Kontak pusat lewat email lab kampus', d: 'hanya di kota berkampus, Jejak +4', req: () => KOTA[S.m.kota].kampus, run: () => { apply({ tekanan: 5 }); return kontak('email', 4, 0); } },
  damai: { t: 'Instruksikan aksi damai', d: 'lewat kontak minggu ini', run: () => instruksi('damai') },
  jalan: { t: 'Instruksikan turun ke jalan', d: 'massa besar, risiko bentrok', run: () => instruksi('jalan') },
  uang: { t: 'Cari uang', d: 'kerja serabutan, Jejak +5', run: () => { const u = harga(40000); apply({ uang: u, jejak: 5 }); return `Kamu menjadi kuli angkut di pasar. Upahnya ${rp(u)}.`; } },
  ktp: { t: 'Urus KTP palsu', d: () => rp(S.f.yosBerutang ? harga(37500) : harga(75000)), req: () => KOTA[S.m.kota].jaringan && !S.f.ktpPalsu, run: () => { const c = S.f.yosBerutang ? harga(37500) : harga(75000); if (!bayar(c)) return 'Uangmu tidak cukup untuk KTP palsu.'; S.f.ktpPalsu = true; return S.f.yosBerutang ? 'Bang Yos menepati utangnya. KTP atas nama Joko Susilo jadi dalam dua hari, separuh harga.' : 'KTP atas nama Joko Susilo jadi dalam tiga hari.'; } },
  keluarga: { t: 'Kabari keluarga', d: 'Ibu +1, Nyali +5, Jejak +10', run: () => { apply({ ibu: 1, nyali: 5, jejak: S.m.kota === 'magelang' ? 4 : 10 }); return 'Suara Ibu bergetar di telepon. Ia tidak bertanya kamu di mana.'; } }
};
function kontak(ch, jj, hops) { apply({ jejak: jj, massa: 2, pengaruh: 2 }); S.m.kontak = ch; S.m.hops = hops; return `Kontak lewat ${ch} tersambung. Kawan-kawan di pusat tahu kamu masih ada.`; }
TOPIK.instruksi = {
  truth: s => s.m.hasilAksi,
  benar: (s, t) => t === 'baik' ? 'Aksi kemarin berjalan seperti yang kamu minta. Barisan rapi.' : 'Aksi kemarin ricuh. Beberapa kawan ditangkap.',
  salah: (s, t) => t === 'baik' ? 'Aksi kemarin ricuh. Beberapa kawan ditangkap.' : 'Aksi kemarin berjalan lancar.'
};
function instruksi(jenis) {
  let j = jenis;
  if (!S.m.kontak) S.m.hops = 2;
  if (penyusupAktif() && !S.f.instruksiDibalik) { S.f.instruksiDibalik = true; j = jenis === 'damai' ? 'jalan' : 'damai'; }
  const ricuh = j === 'jalan' && Math.random() < (S.siap.odol >= 0.8 ? 0.3 : 0.55);
  S.m.hasilAksi = ricuh ? 'buruk' : 'baik';
  apply(j === 'jalan' ? { massa: 8, sorotan: 6, ricuh: ricuh ? 1 : 0, iklim: 3 } : { massa: 4, iklim: 2 });
  const e = kabar('instruksi', S.m.kontak === 'kurir' || !S.m.kontak ? 'kurir' : 'laras', S.m.hops || 0);
  S.m.kabarMinggu = e;
  return `Kamu mengirim instruksi aksi ${jenis === 'damai' ? 'damai' : 'turun ke jalan'}.` + (j !== jenis ? ' Instruksi itu sampai ke pusat dalam bentuk yang terbalik.' : '') + ` Kabar yang kembali: “${e.teks}”`;
}
const MINGGU = ['6–12 April 1998', '13–19 April 1998', '20–26 April 1998', '27 April – 3 Mei 1998', '4–10 Mei 1998'];
MODES.buron = {
  enter(n) {
    const w = S.f.buronResume || 1; delete S.f.buronResume;
    S.m = { minggu: w, kota: S.f.kotaBuron || 'jakarta', step: 'kota', pilih: [], out: [], jejakKota: S.f.jejakKota || [], kontak: null, ev: null };
  },
  panel(n) {
    const m = S.m;
    let h = meta(n, `minggu ${m.minggu} dari 5 · ${MINGGU.at(m.minggu - 1)}`) + (m.minggu === 1 && m.step === 'kota' ? prose(n) : '') + lookHTML(n);
    h += `<p class="label">Kota sekarang: ${KOTA[m.kota].t} · Jejak ${S.jejak} · KTP palsu: ${S.f.ktpPalsu ? 'ada' : 'belum'}</p>`;
    if (m.step === 'kota') return h + `<div class="ask"><p class="label">Minggu ini kamu ada di mana?</p><ol class="choices">${Object.entries(KOTA).map(([id, k], i) => `<li><button type="button" class="choice" data-a="kota" data-v="${id}"><span class="key">${'ABCDEF'[i]}</span><span>${id === m.kota ? 'Tetap di ' + k.t : 'Pindah ke ' + k.t}<small>${k.d}${id === m.kota ? '' : ' · ongkos ' + rp(harga(k.ongkos))}</small></span></button></li>`).join('')}</ol></div>`;
    if (m.step === 'aksi') return h + (m.out.length ? `<ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul>` : '') + `<div class="ask"><p class="label">Pilih tindakan ${m.pilih.length + 1} dari 2</p><ol class="choices">${Object.entries(AKSI_BURON).filter(([id, x]) => (!x.req || x.req()) && !m.pilih.includes(id)).map(([id, x], i) => `<li><button type="button" class="choice" data-a="aksi" data-v="${id}"><span class="key">${'ABCDEFGHIJKL'[i]}</span><span>${x.t}<small>${val(x.d)}</small></span></button></li>`).join('')}</ol></div>`;
    const jen = m.ev && m.ev.jenewa ? `<div class="ask"><p class="label">Kesempatan ke Jenewa</p><ol class="choices"><li><button type="button" class="choice" data-a="jenewa" data-v="pergi"${jenewaBisa() ? '' : ' disabled'}><span class="key">A</span><span>Berangkat sendiri ke Jenewa<small>${jenewaBisa() ? 'butuh paspor, USD 50, dan kontak LSM' : jenewaAlasan()}</small></span></button></li><li><button type="button" class="choice" data-a="jenewa" data-v="kirim"${aktif('laras') || S.ratna >= 3 ? '' : ' disabled'}><span class="key">B</span><span>Kirim ${aktif('laras') ? 'Laras' : 'Kak Ratna'} sebagai gantimu<small>Tekanan internasional +20</small></span></button></li><li><button type="button" class="choice" data-a="jenewa" data-v="tidak"><span class="key">C</span><span>Tidak usah</span></button></li></ol></div>` : `<button type="button" class="btn" data-a="minggu">${m.minggu < 5 ? 'Minggu berikutnya' : 'Pulang ke Jakarta'}</button>`;
    return h + `<section class="result" tabindex="-1"><ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul>${m.ev ? `<div class="event"><p class="label">Minggu ini</p><p>${m.ev.t}</p></div>` : ''}${deltasHTML(m.deltas)}${jen}</section>`;
  },
  act(n, a, v) {
    const m = S.m;
    if (a === 'kota' && m.step === 'kota') {
      m.b = snap(); m.out = [];
      if (v !== m.kota) {
        const c = harga(KOTA[v].ongkos);
        if (!bayar(c)) { m.out.push(`Ongkos ke ${KOTA[v].t} tidak cukup. Kamu tetap di ${KOTA[m.kota].t}.`); v = m.kota; }
        else { m.kota = v; m.out.push(`Kamu naik ${v === 'medan' ? 'kapal' : pick(['bus malam', 'kereta ekonomi'])} ke ${KOTA[v].t}.`); if (Math.random() < 0.4) { if (S.f.ktpPalsu) { apply({ jejak: 3 }); m.out.push('Ada razia KTP di terminal. KTP palsumu lolos, meski petugas menatapmu agak lama.'); } else { apply({ jejak: 15 }); m.out.push('Ada razia KTP di terminal. Tanpa KTP palsu, kamu harus menyelinap lewat pintu samping, dan seorang petugas mencatat ciri-cirimu.'); } } }
      }
      m.jejakKota.push(m.kota); S.f.jejakKota = m.jejakKota; S.f.kotaBuron = m.kota;
      apply({ jejak: (m.minggu === 5 && m.kota === 'medan') ? 15 : KOTA[m.kota].risiko });
      m.step = 'aksi'; m.kontak = null; m.pilih = []; return render();
    }
    if (a === 'aksi' && m.step === 'aksi' && AKSI_BURON[v] && !m.pilih.includes(v)) {
      m.pilih.push(v); S.m.kontak = m.kontak; m.out.push(AKSI_BURON[v].run());
      m.kontak = S.m.kontak;
      if (m.pilih.length < 2) return render();
      m.ev = mingguEvent(m.minggu); if (m.ev.fx) apply(m.ev.fx);
      m.deltas = diff(m.b); m.step = 'hasil';
      if (S.jejak >= 100) { S.f.kembaliKe = 'b12_buron'; S.f.buronResume = Math.min(5, m.minggu + 1); S.f.tertangkapBuron = true; S.jejak = 60; return go('periksa'); }
      return render('.result');
    }
    if (a === 'jenewa' && m.ev && m.ev.jenewa) {
      if (v === 'pergi' && jenewaBisa()) { S.f.buronResume = 4; S.f.kotaBuron = m.kota; return go('b13_bandara'); }
      if (v === 'kirim') { apply({ tekanan: 20, sorotan: -5 }); m.out.push(`${aktif('laras') ? 'Laras' : 'Kak Ratna'} berangkat ke Jenewa membawa daftar nama orang hilang.`); }
      m.ev.jenewa = false; return render();
    }
    if (a === 'minggu' && m.step === 'hasil' && !(m.ev && m.ev.jenewa)) {
      if (m.minggu >= 5) return go(S.f.diLuar ? 'jauh' : 'b14_terminal');
      m.minggu++; m.step = 'kota'; m.ev = null; return render();
    }
  },
  actions() {
    const m = S.m;
    if (m.step === 'kota') return Object.keys(KOTA).map(id => ({ a: 'kota', v: id }));
    if (m.step === 'aksi') return Object.entries(AKSI_BURON).filter(([id, x]) => (!x.req || x.req()) && !m.pilih.includes(id)).map(([id]) => ({ a: 'aksi', v: id }));
    if (m.ev && m.ev.jenewa) return [{ a: 'jenewa', v: 'tidak' }].concat(jenewaBisa() ? [{ a: 'jenewa', v: 'pergi' }] : []).concat(aktif('laras') || S.ratna >= 3 ? [{ a: 'jenewa', v: 'kirim' }] : []);
    return [{ a: 'minggu' }];
  }
};
const jenewaBisa = () => S.f.paspor && S.uang.usd >= 50 && (S.ratna >= 3 || aktif('laras'));
const jenewaAlasan = () => !S.f.paspor ? 'kamu tidak punya paspor' : S.uang.usd < 50 ? 'simpanan dolarmu kurang dari USD 50' : 'kamu tidak punya kontak LSM internasional';
function mingguEvent(w) {
  const k = S.m.kota;
  if (w === 1) return { t: 'Radio swasta menyebut aksi mahasiswa mulai menyebar ke kampus-kampus di luar Jawa.', fx: { iklim: 3 } };
  if (w === 2) return { t: 'Lewat kontak lama Kak Ratna, datang tawaran: sidang Komisi HAM PBB di Jenewa masih berlangsung sampai akhir April.', jenewa: true };
  if (w === 3) { const fx = { bapak: -1, kagum: 1 }; let t = 'Dua orang berbaju safari mendatangi rumah di Magelang. Bapak dipanggil atasannya, dan Dika ditanyai di sekolah.'; if (S.f.bukuUntukDika) { fx.bapak = -2; t += ' Mereka menemukan buku yang kamu berikan kepada Dika.'; } return { t, fx }; }
  if (w === 4) {
    const p = S.f.damarPublik ? 0.3 + 0.2 * Math.min(3, S.f.buktiDamar || 0) + 0.1 * Math.floor(S.tekanan / 25) : 0.05;
    S.f.damarDilepas = Math.random() < p;
    if (!S.f.damarDilepas) S.f.damarHilangPermanen = true;
    return S.f.damarDilepas ? { t: 'Kabar dari LBH: Bang Damar dilepas di pinggir jalan tol dengan mata tertutup. Ia hidup, tapi belum mau bicara.', fx: { nyali: 10, damar: 1 } } : { t: 'Tidak ada kabar tentang Bang Damar. Orang-orang yang hilang bersamanya juga belum kembali.', fx: { nyali: -8 } };
  }
  if (k === 'medan') return { t: 'Setelah harga BBM naik pada 4 Mei, Medan rusuh. Toko-toko dibakar, dan kamu terkurung di rumah persembunyian selama empat hari.', fx: { nyali: -6, jejak: -5 } };
  if (k === 'yogya') return { t: 'Pada 8 Mei, bentrokan pecah di Gejayan. Seorang mahasiswa tewas. Kamu ikut mengantar jenazahnya keesokan hari.', fx: { nyali: -6, massa: 5, iklim: 5 } };
  return { t: 'Harga BBM naik pada 4 Mei. Ongkos angkot naik, dan amarah orang di pasar terasa sampai ke kamarmu.', fx: { iklim: 5 } };
}

/* ---------- interogasi ---------- */
const TAKTIK = ['Interogator membuka map berisi foto rumahmu di Magelang. “Bapakmu PNS, kan? Sayang kalau kariernya selesai.”', '“Kawanmu sudah cerita semuanya. Kami cuma butuh kamu membenarkan.”', 'Mereka memindahkanmu ke sel bersama seorang tahanan lain yang ramah. Ia banyak bertanya.', '“Jawab tiga pertanyaan, dan besok pagi kamu pulang. Janji.”', 'Seorang petugas membentak dan memukul meja. Petugas lain menawarimu rokok dan teh manis.'];
function rahasiaList() {
  const r = [], p48 = S.protokol.includes('p48'), sel = S.protokol.includes('sel'), ri = rankIdx();
  r.push({ id: 'kode', t: 'Kode telepon', exp: p48 ? 12 : 1e9 });
  if (ri >= 2 || S.protokol.includes('safehouse')) r.push({ id: 'safehouse', t: 'Lokasi safehouse', exp: p48 ? 24 : 1e9 });
  if (aktif('asep')) r.push({ id: 'buruh', t: 'Penghubung buruh', exp: p48 ? 24 : 1e9 });
  r.push({ id: 'nama', t: sel ? 'Dua nama kader' : 'Nama semua kadermu', exp: 1e9 });
  if (ri >= 3) r.push({ id: 'aksi', t: 'Rencana aksi berikutnya', exp: 1e9 });
  if (ri >= 4) r.push({ id: 'dana', t: 'Sumber dana gerakan', exp: 1e9 });
  if (S.bukti.includes('catatanDamar')) r.push({ id: 'kontakDamar', t: 'Kontak jaringan Damar', exp: 1e9 });
  return r;
}
function bocorkan(id) {
  if (S.bocor.includes(id)) return '';
  S.bocor.push(id);
  if (id === 'kode') apply({ sorotan: 10 });
  if (id === 'safehouse') { S.f.safehouseBocor = true; const k = kaderAktif().at(0); if (k) S.kader[k] = 'diawasi'; }
  if (id === 'buruh') apply({ massa: -10 });
  if (id === 'nama') { const ks = kaderAktif().slice(0, S.protokol.includes('sel') ? 1 : 2); ks.forEach(k => { S.kader[k] = 'ditangkap'; }); apply({ massa: -5 }); }
  if (id === 'aksi') S.f.aksiBocor = true;
  if (id === 'dana') apply({ massa: -10, pengaruh: -5 });
  if (id === 'kontakDamar') apply({ damar: -2 });
  return rahasiaList().find(x => x.id === id)?.t || id;
}
MODES.interogasi = {
  enter(n) {
    let N = n.jenis === 'resmi' ? 4 : 6;
    if (n.jenis === 'resmi') { if (aktif('tigor') || S.ratna >= 3) N--; if (aktif('laras') || S.f.damarPublik) N--; }
    S.m = { r: 0, N: Math.max(2, N), jam: 0, ket: S.nyali, secrets: rahasiaList(), res: null, taktik: pick(TAKTIK), selesai: false };
  },
  panel(n) {
    const m = S.m, step = n.jenis === 'resmi' ? 12 : 24;
    let h = meta(n, `ronde ${Math.min(m.r + 1, m.N)} dari ${m.N}`) + (m.r === 0 && !m.res ? prose(n) : '');
    if (S.ui.last) return h + resultHTML();
    h += `<p class="label">Jam ke-${m.jam} · Ketahanan ${Math.max(0, m.ket)}</p>`;
    if (m.res) return h + `<section class="result" tabindex="-1">${[].concat(m.res).map(p => `<p>${p}</p>`).join('')}<button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    const sec = m.secrets.map(x => `<li>${x.t}${S.bocor.includes(x.id) ? ' · <b class="bad">sudah bocor</b>' : m.jam >= x.exp ? ' · <b class="good">sudah kedaluwarsa</b>' : x.exp < 1e9 ? ` · kedaluwarsa jam ke-${x.exp}` : ''}</li>`).join('');
    const opsi = [['diam', 'Diam', 'Ketahanan −15']].concat(kutipan() ? [['kutip', 'Diam sambil mengulang kutipan dari buku dalam hati', 'Ketahanan −8']] : []).concat([['palsu', 'Beri info palsu', '40% ketahuan, Ketahanan −25']]).concat(m.secrets.filter(x => !S.bocor.includes(x.id)).map(x => ['basi:' + x.id, `Beri info soal ${x.t.toLowerCase()}`, m.jam >= x.exp ? 'sudah basi, aman' : 'masih berlaku, berarti bocor'])).concat([['semua', 'Bocorkan semua', 'interogasi selesai lebih cepat']]);
    return h + `<div class="prose"><p>${m.taktik}</p></div><div class="obs"><p class="label">Yang kamu tahu</p><ul class="rules">${sec}</ul></div><div class="ask"><ol class="choices">${opsi.map(([v, t, d], k) => `<li><button type="button" class="choice" data-a="jawab" data-v="${v}"><span class="key">${'ABCDEFGHIJ'[k]}</span><span>${t}<small>${d}</small></span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    const m = S.m, step = n.jenis === 'resmi' ? 12 : 24;
    if (S.ui.last) return;
    if (a === 'rn' && m.res) { m.res = null; if (m.selesai) return selesaiInterogasi(n); m.taktik = pick(TAKTIK); return render(); }
    if (a !== 'jawab' || m.res) return;
    const lines = [];
    if (v === 'diam') { m.ket -= 15; lines.push('Kamu diam. Waktu dipotong: lampu itu menyala terus, dan kamu kehilangan hitungan jam.'); }
    else if (v === 'kutip') { m.ket -= 8; lines.push('Kamu mengulang satu kalimat dari buku itu di kepalamu, berkali-kali, sampai pertanyaan mereka terdengar jauh.'); }
    else if (v === 'palsu') { if (Math.random() < 0.4) { m.ket -= 25; lines.push('Mereka mengecek ceritamu dan tahu kamu berbohong. Malam itu panjang sekali.'); } else { m.ket -= 5; lines.push('Mereka mencatat ceritamu dan pergi mengeceknya.'); } }
    else if (v.startsWith('basi:')) { const x = m.secrets.find(s => s.id === v.slice(5)); if (m.jam >= x.exp) lines.push(`Kamu menyebut ${x.t.toLowerCase()}. Sudah lewat ${x.exp} jam, kawan-kawan pasti sudah pindah. Mereka mencatatnya dengan puas, dan pulang dengan tangan kosong.`); else lines.push(`Kamu menyebut ${bocorkan(x.id).toLowerCase()}. Informasi itu masih berlaku.`); }
    else if (v === 'semua') { m.secrets.filter(x => m.jam < x.exp).forEach(x => bocorkan(x.id)); lines.push('Kamu menceritakan semuanya. Mereka mematikan lampu dan membiarkanmu tidur.'); m.selesai = true; }
    if (m.ket <= 0 && !m.selesai) { const sisa = m.secrets.filter(x => m.jam < x.exp && !S.bocor.includes(x.id)); if (sisa.length) lines.push(`Kamu patah. Mulutmu menyebut ${bocorkan(pick(sisa).id).toLowerCase()} sebelum kamu sempat menahannya.`); m.selesai = true; }
    m.jam += step; m.r++;
    if (m.r >= m.N) m.selesai = true;
    m.res = lines; render('.result');
  },
  actions() {
    const m = S.m;
    if (S.ui.last) return [{ a: 'next' }];
    if (m.res) return [{ a: 'rn' }];
    return [{ a: 'jawab', v: 'diam' }, { a: 'jawab', v: 'palsu' }, { a: 'jawab', v: 'basi:kode' }, { a: 'jawab', v: pick(['diam', 'semua', 'basi:nama']) }];
  }
};
function selesaiInterogasi(n) {
  const m = S.m, b = snap();
  S.nyali = clamp(Math.max(15, m.ket), 0, S.nyaliMax);
  if (n.jenis === 'culik') {
    const lepas = S.f.damarPublik || S.massa >= 50 || S.tekanan >= 25 || aktif('laras');
    if (!lepas) return end('dihilangkan');
    S.sorotan = 60; S.f.pernahDiculik = true;
    return setResult(null, ['Suatu subuh, mobil berhenti dan pintunya dibuka. Kamu didorong keluar di pinggir jalan tol dengan mata masih tertutup.', 'Kawan-kawanmu tidak diam selama kamu hilang. Namamu ada di koran, di mimbar, dan di posko pengaduan.'], b, 'pasca');
  }
  S.sorotan = Math.max(40, S.sorotan - 20);
  setResult(null, ['Setelah ' + m.jam + ' jam, pintu dibuka. Kamu dilepas dengan wajib lapor setiap Senin, dan kamu tahu kamu tidak akan datang.'], b, 'pasca');
}

/* ---------- epilog ---------- */
function kehilangan() {
  const list = [...S.hilang];
  for (const [id, st] of Object.entries(S.kader)) if (st === 'tewas' || st === 'pergi') list.push({ siapa: KADER[id].nama, cara: st === 'tewas' ? 'tewas' : 'pergi ke luar negeri dan tidak kembali ke gerakan' });
  if (S.f.damarHilangPermanen) list.push({ siapa: 'Bang Damar', cara: 'dihilangkan pada Maret 1998, tidak pernah kembali' });
  if (['dihilangkan', 'dibunuh', 'diasingkan', 'dipenjara'].includes(S.ending)) list.unshift({ siapa: 'Kamu', cara: ENDINGS[S.ending].judul.toLowerCase() });
  if (!list.length) { S.f.damarHilangPermanen = true; list.push({ siapa: 'Bang Damar', cara: 'dihilangkan pada Maret 1998, tidak pernah kembali' }); }
  return list;
}
MODES.akhir = {
  panel(n) {
    const E = ENDINGS[S.ending] || ENDINGS.menolak_lupa, loss = kehilangan();
    return `<div class="intro"><p class="label">Akhir cerita · ${rankOf(S.pengaruh)}</p><h2 class="end-title">${E.judul}</h2></div><div class="prose">${[].concat(E.text(S)).concat(epilogTambahan()).map(p => `<p>${p}</p>`).join('')}</div>
      <p class="label">Daftar kehilangan</p><div class="sheet"><table><tbody>${loss.map(l => `<tr><td><b>${l.siapa}</b></td><td>${l.cara}</td></tr>`).join('')}</tbody></table></div>
      <aside class="sejarah"><p class="label">Catatan sejarah</p><p>Empat mahasiswa Trisakti tewas ditembak pada 12 Mei 1998. Tim Gabungan Pencari Fakta menemukan indikasi bahwa kerusuhan 13–15 Mei digerakkan secara terorganisir. Tiga belas aktivis yang diculik pada 1997–1998 sampai hari ini belum kembali. Kasus Semanggi I dan II belum dibawa ke pengadilan HAM.</p></aside>
      <button type="button" class="btn" data-a="restart">Main lagi dari awal</button>`;
  },
  act() {},
  actions() { return []; }
};
