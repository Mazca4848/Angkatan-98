/* Angkatan 98 · mode permainan */
const randInt = n => Math.floor(Math.random() * n);

/* ---------- cerita biasa ---------- */
MODES.story = {
  enter(n) { if (n.batasWaktu) mulaiWaktu(val(n.batasWaktu.detik)); },
  // selama obrolan berjalan, pilihan adegan menunggu sampai obrolan selesai
  panel(n) { return meta(n) + prose(n) + batinHTML(n) + kabarHTML(true) + lookHTML(n) + (S.ui.last ? resultHTML() : S.ui.dlg && !S.ui.dlg.selesai ? '' : (n.batasWaktu ? waktuHTML(n.batasWaktu.label) : '') + choicesHTML(val(n.choices))); },
  act(n, a, v) {
    if (a === 'waktuHabis' && n.batasWaktu && !S.ui.last) { const b = snap(), r = n.batasWaktu.habis(S); apply(r.fx); return setResult('Kamu tidak sempat memutuskan', r.note, b, r.go); }
    if (a !== 'choose' || S.ui.last || (S.ui.dlg && !S.ui.dlg.selesai)) return;
    S.ui.waktu = null;
    const c = val(n.choices)[+v];
    if (!c || (c.req && !c.req(S)) || (c.dis && c.dis(S))) return;
    const b = snap();
    if (c.cost && !bayar(val(c.cost))) return;
    const gagal = n.rencana && bocor();
    const [fx, sindir] = dinginkan(gagal ? gagalkan(val(c.fx)) : val(c.fx) || {});
    apply(fx);
    const here = S.node;
    if (c.run) c.run(S);
    if (S.node !== here) return;
    const note = [].concat(val(c.note) || [], gagal ? BOCOR_NOTE : [], sindir).filter(Boolean), g = val(c.go);
    if (!note.length) return go(g);
    S.ui.lainPilihan = visibleChoices(val(n.choices)).map(([x]) => val(x.t)).filter(t => t !== val(c.t));
    S.ui.isyaratNote = val(c.isyarat) || null;
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
    return `<div class="intro"><p class="label">Permainan sudut pandang orang pertama · sekitar 85 menit</p><h1>Angkatan 98</h1><p>Kamu mahasiswa baru di Jakarta, Agustus 1996. Setiap layar adalah pandangan matamu sendiri. Klik orang dan benda untuk mengamati, lalu putuskan apa yang kamu lakukan. Permainan tersimpan otomatis di browser ini.</p><p class="fine">Kampus dan tokoh fiktif. Peristiwa besarnya nyata. Tidak ada ending yang selamat utuh.</p>${simpananUsang ? '<p class="fine bad">Simpananmu dibuat oleh versi game yang lebih lama dan tidak bisa dilanjutkan di versi ini. Mulai dari awal untuk bermain.</p>' : ''}<p class="fine">Beberapa momen genting punya batas waktu. ${tombolWaktu()} ${tombolTeks()}</p>${koleksiHTML()}<div class="row"><button type="button" class="btn" data-a="goto" data-v="p_rumah">Mulai dari awal</button>${d && d.node !== 'intro' && !d.ending ? `<button type="button" class="btn alt" data-a="lanjut">Lanjutkan (${namaBulan(d.bulan)})</button>` : ''}</div></div>`;
  },
  act() {},
  actions() { return [{ a: 'goto', v: 'p_rumah' }]; }
};

/* ---------- KTM ---------- */
MODES.ktm = {
  panel(n) {
    if (S.m.step === 1) return meta(n) + `<p>Ini KTM-mu. Kenali bagian-bagiannya, karena kelak kamu akan memeriksa KTM orang lain.</p><ul class="rules"><li><b>Foto</b> harus cocok dengan wajah pemiliknya.</li><li><b>NIM</b>: dua angka pertama angkatan, dua angka berikutnya kode fakultas.</li><li><b>Stempel asli</b>: lingkaran merah ganda dengan bintang di tengah.</li></ul><button type="button" class="btn" data-a="goto" data-v="b1_lapangan">Ke lapangan</button>`;
    return meta(n) + `<p>Loket daftar ulang di aula. Petugas memotretmu, lalu menyodorkan formulir. KTM jadi dalam lima menit.</p>
      <form class="form" id="ktm-form"><div class="form"><label class="label" for="ktm-nama">Nama lengkap</label><input id="ktm-nama" maxlength="22" autocomplete="off" value="${esc(S.nama)}"></div>
      <fieldset><legend class="label">Gender</legend><div class="fak">${Object.entries(GENDER).map(([k, g]) => `<button type="button" class="choice" data-a="gender" data-v="${k}" aria-pressed="${genderKu() === k}"><span class="key" aria-hidden="true">${g.t[0]}</span><span><b>${g.t}</b></span></button>`).join('')}</div></fieldset>
      <fieldset><legend class="label">Foto</legend><div class="row">${GENDER[genderKu()].foto.map(i => `<button type="button" class="foto" data-a="foto" data-v="${i}" aria-pressed="${S.foto === i}" aria-label="Foto ${i + 1}"><svg viewBox="0 0 200 240">${face(FOTO[i])}</svg></button>`).join('')}</div></fieldset>
      <fieldset><legend class="label">Fakultas</legend><div class="fak">${Object.entries(FAK).map(([k, v]) => `<button type="button" class="choice" data-a="fak" data-v="${k}" aria-pressed="${S.fak === k}"><span class="key" aria-hidden="true">${k[0]}</span><span><b>${k}</b></span></button>`).join('')}</div></fieldset>
      <button type="submit" class="btn">Ambil KTM</button></form>`;
  },
  act(n, a, v) {
    if (a === 'gender' && GENDER[v]) { if (Object.values(NAMA_AWAL).includes(S.nama.trim())) S.nama = NAMA_AWAL[v]; S.gender = v; S.foto = GENDER[v].foto[0]; return render(); }
    if (a === 'foto' && GENDER[genderKu()].foto.includes(+v)) { S.foto = +v; return render(); }
    if (a === 'fak') { S.fak = v; return render(); }
    if (a === 'ambil' && S.m.step !== 1) {
      S.nama = S.nama.trim() || NAMA_AWAL[genderKu()];
      S.nim = `96.${FAK[S.fak].kode}.${String(100 + randInt(900)).padStart(4, '0')}`;
      const b = snap(); apply(FAK[S.fak].fx); S.m.delta = diff(b); S.m.step = 1; render();
    }
  },
  actions() { return S.m.step === 1 ? [{ a: 'goto', v: 'b1_lapangan' }] : [{ a: 'fak', v: pick(Object.keys(FAK)) }, { a: 'gender', v: pick(Object.keys(GENDER)) }, { a: 'foto', v: pick(GENDER[genderKu()].foto) }, { a: 'ambil' }]; }
};

/* ---------- formulir bertahap ---------- */
const POS = { tali: 'Tali massa', medis: 'Medis', hukum: 'Hukum', humas: 'Humas', sweeping: 'Sweeping' };

/* peta papan tulis korlap: rute long march digambar titik demi titik */
const PETA = {
  kampus: { x: 150, y: 205, nama: 'Kampus' },
  a1: { x: 300, y: 205, nama: 'Simpang raya' }, a2: { x: 450, y: 205, nama: 'Pos aparat jalan raya', jenis: 'pos' }, a3: { x: 620, y: 205, nama: 'Rumah sakit', jenis: 'rs' },
  b1: { x: 300, y: 95, nama: 'Kampus tetangga', jenis: 'tetangga' }, b2: { x: 450, y: 95, nama: 'Jembatan' }, b3: { x: 620, y: 95, nama: 'Pos aparat jembatan', jenis: 'pos' },
  c1: { x: 300, y: 300, nama: 'Kampung Rawa', jenis: 'kampung' }, c2: { x: 450, y: 300, nama: 'Kampung Kali', jenis: 'kampung' }, c3: { x: 620, y: 300, nama: 'Pasar', jenis: 'pasar' },
  senayan: { x: 810, y: 95, nama: 'Senayan', ujung: true }, dprd: { x: 810, y: 245, nama: 'DPRD', ujung: true }
};
const JENIS_PETA = { pos: 'POS', rs: 'RS', tetangga: 'KAMPUS 2', kampung: 'KAMPUNG', pasar: 'PASAR' };
const RUAS = 'kampus-a1 kampus-b1 kampus-c1 a1-a2 a2-a3 b1-b2 b2-b3 c1-c2 c2-c3 a1-b1 a1-c1 a2-b2 a2-c2 a3-b3 a3-c3 b3-senayan a3-senayan a3-dprd c3-dprd'.split(' ').map(r => r.split('-'));
const longMarch = () => S.m.pick.bentuk === 'jalan' || S.m.pick.bentuk === 'dprd';
const tujuan = () => S.m.pick.bentuk === 'dprd' ? 'dprd' : 'senayan';
const sambung = id => RUAS.filter(r => r.includes(id)).map(r => r[0] === id ? r[1] : r[0]);
function langkahBisa() {
  const r = S.m.rute, akhir = r.at(-1);
  return akhir === tujuan() ? [] : sambung(akhir).filter(id => !r.includes(id) && (!PETA[id].ujung || id === tujuan()));
}
// kampung dihitung dua ruas karena gangnya sempit dan barisan melambat
function nilaiRute(r) {
  const v = { pos: 0, rs: 0, tetangga: 0, kampung: 0, pasar: 0 };
  for (const id of r) if (PETA[id].jenis) v[PETA[id].jenis]++;
  v.panjang = r.length - 1 + v.kampung;
  return v;
}

MODES.form = {
  enter(n) { S.m = { step: 0, pick: {}, multi: [], pos: {}, rute: ['kampus'] }; },
  panel(n) {
    let h = meta(n) + prose(n) + lookHTML(n);
    if (S.ui.last) return h + resultHTML();
    const st = n.steps[S.m.step];
    if (st.type === 'peta') {
      if (!longMarch()) return h + `<div class="ask"><p class="label">${st.label}</p><p>Aksi tidak keluar kampus, jadi tidak perlu rute.</p><button type="button" class="btn" data-a="ok">Lanjut</button></div>`;
      const r = S.m.rute, v = nilaiRute(r), bisa = langkahBisa(), sampai = r.at(-1) === tujuan();
      return h + `<div class="ask"><p class="label">${st.label}</p><p>Seret kapur atau ketuk titik di papan, dari Kampus sampai ${PETA[tujuan()].nama}. Ketuk titik yang sudah dilewati untuk menghapus rute sesudahnya.</p>
        <p class="label">Coretan kapur Kak Ratna di pojok papan</p><ul class="rules"><li>Lingkaran merah: pos aparat, kata anak-anak Damar.</li><li>Kampung: gangnya sempit, tapi warganya kenal dapur umum.</li><li>Pasar: ramai sekali, siapa saja bisa menyusup.</li><li>Kampus tetangga: mereka cuma ikut kalau dijemput.</li><li>RS: kata Bimo, IGD-nya buka sampai malam.</li><li>“Jalan jauh = air banyak.”</li></ul>
        <p class="label">Rute: ${r.map(id => PETA[id].nama).join(' → ')} · ${v.panjang} ruas</p>
        ${bisa.length ? `<div class="acts">${bisa.map(id => `<button type="button" class="chip" data-a="titik" data-v="${id}">Lewat ${PETA[id].nama}</button>`).join('')}</div>` : sampai ? '' : '<p class="fine">Jalan buntu. Ketuk titik sebelumnya atau ulang dari kampus.</p>'}
        <div class="row"><button type="button" class="chip" data-a="ulang"${r.length > 1 ? '' : ' disabled'}>Ulang dari kampus</button></div>
        <button type="button" class="btn" data-a="ok"${sampai ? '' : ' disabled'}>Tetapkan rute</button></div>`;
    }
    if (st.type === 'pos') {
      const posts = Object.keys(POS).slice(0, S.protokol.includes('sel') ? 4 : 5);
      return h + `<div class="ask"><p class="label">${st.label}</p><div class="posgrid">${posts.map(p => `<div class="slot full"><span class="label">${POS[p]}</span><span>${S.m.pos[p] ? KADER[S.m.pos[p]].nama + ' · ' + KADER[S.m.pos[p]].ahli : 'kosong'}</span><button type="button" class="link" data-a="cyc" data-v="${p}">Ganti</button></div>`).join('')}</div>${S.protokol.includes('sel') ? '<p class="fine">Sistem sel mengurangi satu pos.</p>' : ''}<button type="button" class="btn" data-a="ok">Simpan pos kader</button></div>`;
    }
    const opts = val(st.options).filter(o => !o.req || o.req(S));
    if (st.multi) return h + `<div class="ask"><p class="label">${st.label} (pilih ${st.multi})</p><div class="acts">${opts.map(o => `<button type="button" class="chip" data-a="tog" data-v="${o.v}" aria-pressed="${S.m.multi.includes(o.v)}"${o.dis && o.dis(S) ? ' disabled' : ''}><b>${o.t}</b>${o.d ? ` <small>${o.d}</small>` : ''}</button>`).join('')}</div><button type="button" class="btn" data-a="ok"${S.m.multi.length !== st.multi ? ' disabled' : ''}>Pilih</button></div>`;
    return h + pilihanHTML(opts.map(o => ({ a: 'opt', v: o.v, t: o.t, d: o.d, dis: o.dis && o.dis(S), alasan: o.alasan, kel: o.kel })), st.label);
  },
  act(n, a, v) {
    if (S.ui.last) return;
    const st = n.steps[S.m.step];
    if (a === 'cyc') { const pool = [null, ...kaderAktif()]; const cur = pool.indexOf(S.m.pos[v] || null); S.m.pos[v] = pool.at((cur + 1) % pool.length); return render(); }
    if (a === 'tog') { const i = S.m.multi.indexOf(v); if (i >= 0) S.m.multi.splice(i, 1); else if (S.m.multi.length < st.multi) S.m.multi.push(v); return render(); }
    if (st.type === 'peta' && (a === 'titik' || a === 'ulang')) {
      const r = S.m.rute, i = a === 'ulang' ? 0 : r.indexOf(v);
      if (i >= 0) { if (i === r.length - 1) return; r.length = i + 1; return render(); }
      if (!langkahBisa().includes(v)) return;
      r.push(v); return render();
    }
    if (a === 'opt') { const o = val(st.options).find(x => x.v === v); if (!o || (o.dis && o.dis(S))) return; S.m.pick[st.id] = v; }
    else if (a === 'ok') { if (st.multi) { if (S.m.multi.length !== st.multi) return; S.m.pick[st.id] = [...S.m.multi]; S.m.multi = []; } else if (st.type === 'pos') S.m.pick[st.id] = { ...S.m.pos }; else if (st.type === 'peta') { if (longMarch() && S.m.rute.at(-1) !== tujuan()) return; S.m.pick[st.id] = longMarch() ? [...S.m.rute] : null; } else return; }
    else return;
    S.m.step++;
    if (S.m.step < n.steps.length) return render();
    const b = snap(), res = n.done(S, S.m.pick);
    // rencana aksi yang bocor baru terasa di jalan; rencana lain langsung gagal
    if (n.rencana && bocor()) { if (n.rencana === 'aksi') S.f.aksiBocor = true; else { res.fx = gagalkan(res.fx); res.note = [].concat(res.note, BOCOR_NOTE); } }
    apply(res.fx);
    setResult(null, res.note, b, res.go || n.next, res.lanjut);
  },
  actions(n) {
    if (S.ui.last) return [{ a: 'next' }];
    const st = n.steps[S.m.step];
    if (st.type === 'pos') { const ks = kaderAktif(); return ks.length && Math.random() < 0.7 ? [{ a: 'cyc', v: pick(Object.keys(POS)) }] : [{ a: 'ok' }]; }
    if (st.type === 'peta') { if (!longMarch() || S.m.rute.at(-1) === tujuan()) return [{ a: 'ok' }]; const bisa = langkahBisa(); return bisa.length ? bisa.map(v => ({ a: 'titik', v })) : [{ a: 'ulang' }]; }
    const opts = val(st.options).filter(o => (!o.req || o.req(S)) && !(o.dis && o.dis(S)));
    if (st.multi) return S.m.multi.length === st.multi || opts.length < st.multi ? [{ a: S.m.multi.length === st.multi ? 'ok' : 'tog', v: S.m.multi.at(0) }] : [{ a: 'tog', v: pick(opts.filter(o => !S.m.multi.includes(o.v))).v }];
    return opts.map(o => ({ a: 'opt', v: o.v }));
  }
};

/* ---------- ronde ---------- */
// ronde bertahap; node dengan `marah` punya indikator kemarahan aparat, opsi dengan `kata` memakai mini game merangkai kalimat
MODES.rounds = {
  enter(n) { S.m = { r: 0, res: null }; if (n.marah) S.m.marah = clamp(Math.round(val(n.marah)), 0, 100); const R0 = val(n.rounds)[0]; if (R0.waktu) mulaiWaktu(R0.waktu.detik); },
  panel(n) {
    const rs = val(n.rounds), R = rs[S.m.r];
    let h = meta(n, S.ui.last ? '' : `ronde ${Math.min(S.m.r + 1, rs.length)} dari ${rs.length}`) + (S.m.r === 0 && !S.m.res && !S.m.kata ? prose(n) : '') + lookHTML(n) + (n.marah ? marahHTML(S.m.marah) : '');
    if (S.ui.last) return h + resultHTML();
    if (S.m.kata) return h + kataHTML(S.m.kata);
    if (S.m.res) return h + `<section class="result" tabindex="-1"><p class="label">Kamu memilih</p><p class="pick">${S.m.res.pick}</p>${[].concat(S.m.res.note).map(p => `<p>${p}</p>`).join('')}${deltasHTML(S.m.res.deltas)}<button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    const opts = val(R.options).map((o, i) => [o, i]).filter(([o]) => !o.req || o.req(S));
    return h + `<div class="prose"><p>${val(R.text)}</p></div>${R.waktu ? waktuHTML(R.waktu.label) : ''}` + pilihanHTML(opts.map(([o, i]) => ({ a: 'opt', v: i, t: val(o.t), d: o.d && val(o.d), kel: o.kel })));
  },
  act(n, a, v) {
    if (S.ui.last) return;
    const rs = val(n.rounds), here = S.node;
    if (S.m.kata) {
      const k = S.m.kata;
      if (a === 'kata' && k.urutan[+v] != null && !k.pilih.includes(+v)) k.pilih.push(+v);
      else if (a === 'kataHapus') k.pilih.pop();
      else if (a !== 'kataHabis' || v !== k.id) return;
      const habis = a === 'kataHabis' || Date.now() > k.batas;
      if (!habis && k.pilih.length < k.urutan.length) return render('.mg');
      S.m.kataOk = !habis && k.pilih.map(i => k.urutan[i]).join(' ') === k.kata;
      S.m.kataNote = S.m.kataOk ? 'Kalimatmu utuh dan jelas.' : habis ? 'Waktumu habis sebelum kalimatnya selesai.' : 'Kata-katamu tertukar, dan orang-orang tidak menangkap maksudmu.';
      S.m.kata = null;
      return MODES.rounds.act(n, 'opt', String(k.opsi));
    }
    if (a === 'waktuHabis' && !S.m.res && !S.m.kata && rs[S.m.r].waktu) { const W = rs[S.m.r].waktu, b = snap(); apply(val(W.habis.fx)); S.m.res = { pick: 'Kamu terlambat memutuskan', note: val(W.habis.note), deltas: diff(b) }; return render('.result'); }
    if (a === 'opt' && !S.m.res) {
      const o = val(rs[S.m.r].options)[+v]; if (!o || (o.req && !o.req(S))) return;
      S.ui.waktu = null;
      if (o.kata && S.m.kataOk == null) { S.m.kata = buatKata(o.kata, +v); return render('.mg'); }
      const b = snap(); apply(val(o.fx));
      if (n.marah) S.m.marah = clamp(S.m.marah + (val(o.marah) || 0), 0, 100);
      const note = [].concat(o.kata ? [S.m.kataNote] : [], o.run ? o.run(S) : val(o.note));
      S.m.kataOk = null; S.m.kataNote = null;
      if (S.node !== here) return;
      S.m.res = { pick: val(o.t), note, deltas: diff(b) };
      return render('.result');
    }
    if (a === 'rn' && S.m.res) {
      S.m.res = null; S.m.r++;
      if (S.m.r < rs.length) { if (rs[S.m.r].waktu) mulaiWaktu(rs[S.m.r].waktu.detik); return render(); }
      const b = snap(), res = n.done(S);
      if (S.node !== here) return;
      apply(res.fx);
      setResult(null, res.note, b, res.go || n.next);
    }
  },
  actions(n) {
    if (S.ui.last) return [{ a: 'next' }];
    if (S.m.kata) return S.m.kata.urutan.map((_, i) => i).filter(i => !S.m.kata.pilih.includes(i)).map(v => ({ a: 'kata', v }));
    if (S.m.res) return [{ a: 'rn' }];
    const opts = val(val(n.rounds)[S.m.r].options);
    return opts.map((o, i) => [o, i]).filter(([o]) => !o.req || o.req(S)).map(([, i]) => ({ a: 'opt', v: i }));
  }
};

/* ---------- kamar kos: uang, slot, kejadian ---------- */
const pengaruhRapat = () => (genderKu() === 'P' ? 3 : 5) + Math.floor(paham('freire') / 2) - (S.protokol.includes('sel') ? 1 : 0), sorotanRapat = () => S.fak === 'FISIP' ? 5 : 3;
const isyaratRapat = () => isyarat('rapat', genderKu() === 'P' ? 'Kamu harus pulang sebelum pukul sembilan karena pagar kos putri dikunci. Dari jendela angkot, kamu melihat kawan-kawan laki-laki masih berdiskusi di sekretariat.' : 'Rapat baru bubar lewat tengah malam. Tidak ada jam malam di kos putra.') + (S.fak === 'FISIP' ? isyarat('fisip', 'Seorang laki-laki berjaket kulit memotret papan pengumuman fakultasmu.') : '');
const SLOT = {
  kuliah: { t: 'Kuliah', d: 'masuk kelas dan mengerjakan tugas', run: () => { apply({ ipk: 0.15 }); return 'Kamu masuk semua kelas dan mengumpulkan tugas tepat waktu.'; } },
  organisasi: { t: 'Organisasi', d: 'rapat dan menempel pengumuman', run: () => {
    if (bocor()) { apply({ sorotan: 8, kuasa: 2 }); return 'Rapat organisasi didatangi dua orang dari intel kampus. Mereka sudah tahu agendanya sebelum rapat dibuka.'; }
    apply({ pengaruh: pengaruhRapat(), sorotan: sorotanRapat(), kuasa: -1 });
    if (!S.kader.wahyu && rekrut('wahyu')) return 'Kamu mencetak selebaran semalaman bersama Wahyu, anak Teknik. Paginya ia bilang mau ikut kamu.' + isyaratRapat();
    return 'Kamu ikut rapat dan menempel pengumuman diskusi di papan fakultas.' + isyaratRapat();
  } },
  baca: { t: 'Baca di sekretariat', d: 'satu Kamis membaca', req: () => !!bukuDibaca(), run: () => { if (!S.buku.baca) { const id = bukuUlang(); if (!id) return 'Kamu membaca ulang catatan-catatan lama di sekretariat.'; tambahPaham(id); return `Kamu membaca ulang ${BUKU[id].judul} dan menemukan hal-hal yang dulu terlewat.`; } apply({ pengaruh: 1 }); return baca(1) || `Kamu membaca ${BUKU[S.buku.baca].judul}. Tinggal ${S.buku.sisa} Kamis lagi.`; } },
  kerja: { t: 'Kerja sambilan', d: 'les privat atau jaga fotokopi', run: () => { const u = harga(S.fak === 'Teknik' ? 50000 : 40000); apply({ uang: u }); return `Kamu memberi les privat untuk anak SMP di Rawamangun. Upahnya ${rp(u)}.`; } },
  istirahat: { t: 'Istirahat', d: 'tidur siang dan mencuci baju', run: () => { apply({ nyali: 10 }); return 'Kamu tidur siang, mencuci baju, dan menonton televisi di ruang tamu ibu kos.'; } },
  damar: { t: 'Ngopi dengan Bang Damar', d: 'mendengar cerita dan pandangannya', req: () => !S.f.damarHilang, run: () => { apply({ damar: 1 }); return 'Bang Damar bercerita tentang aksi-aksi lamanya sampai warung tutup.' + (S.fak === 'Ekonomi' ? isyarat('bankir', 'Ia tetap memanggilmu “si bankir”, setengah bercanda.') : ''); } },
  ratna: { t: 'Ngopi dengan Kak Ratna', d: 'mendengar cerita dan pandangannya', run: () => { apply({ ratna: 1 }); return 'Kak Ratna memintamu merangkum fotokopian buku, lalu memeriksa rangkumanmu dengan pulpen merah.'; } },
  fikri: { t: 'Ngopi dengan Bang Fikri', d: 'mendengar cerita dan pandangannya', run: () => { apply({ fikri: 1 }); return 'Bang Fikri mengajakmu mendata keluarga miskin di kampung belakang kampus.'; } },
  yudi: { t: 'Ngopi dengan Mas Yudi', d: 'mendengar cerita dan pandangannya', run: () => { apply({ yudi: 1 }); return 'Mas Yudi mentraktirmu soto di kantin rektorat dan mengenalkanmu pada beberapa pegawai.'; } },
  telepon: { t: 'Telepon rumah', d: 'koin untuk telepon umum di lorong', run: () => { apply({ nyali: 5, ibu: 1, uang: -harga(2000) }); return 'Ibumu bertanya kamu sudah makan atau belum. Tiga menit habis terlalu cepat.'; } },
  dika: { t: 'Surat untuk Dika', d: 'surat panjang ke Magelang', run: () => { apply({ dika: 1, tahu: 1 }); return 'Kamu menulis surat panjang untuk Dika tentang Jakarta, kampus, dan kawan-kawanmu.'; } },
  selidiki: { t: 'Perhatikan kader', d: 'mengamati kawan diam-diam', req: () => kaderAktif().length > 0, run: () => clue() },
  titip: { t: 'Titipkan buku terlarang', d: 'dibungkus koran, dititip ke Pak RT', req: () => S.buku.dikos.length > 0, run: () => { S.buku.dikos = []; S.f.bukuDititip = true; return 'Buku-buku terlarang kamu bungkus koran dan titipkan ke rumah Pak RT.'; } },
  dapur: { t: 'Bantu dapur umum warga', d: 'memasak untuk warga', req: () => S.f.dapurUmum, run: () => { if (bocor()) { apply({ sorotan: 5, kuasa: 2 }); return 'Aparat membubarkan dapur umum sebelum nasi matang. Mereka tahu jadwalnya.'; } S.f.dapurKali = (S.f.dapurKali || 0) + 1; const pakai = Math.min(2, S.uang.barang); apply({ massa: 4 + pakai * 2 + (genderKu() === 'P' ? 2 : 0), barang: -pakai, kuasa: -1 }); return (pakai ? `Kamu menyumbangkan ${pakai} paket beras dan minyak. Antrean nasi lebih panjang dari minggu lalu.` : 'Kamu membantu memasak di dapur umum sampai tengah malam.') + (genderKu() === 'P' ? isyarat('dapur', 'Ibu-ibu dari kampung sebelah ikut memasak bersamamu, dan mereka memintamu datang lagi minggu depan.') : ''); } }
};
Object.assign(SLOT, {
  dosen: { t: 'Lobi dosen', d: 'membujuk dosen ikut berorasi', req: () => S.bulan >= '1997-10' && !S.f.dosenIkut, run: () => { S.f.dosenIkut = true; apply({ pengaruh: 2, kuasa: -1 }); return 'Pak Harsono, dosen Hukum Tata Negara, akhirnya berjanji ikut berorasi di aksi berikutnya. “Saya sudah tua. Mereka mau apa?”'; } },
  alamat: { t: 'Salin buku alamat', d: 'semua nama diganti samaran', req: () => kaderAktif().length > 1 && !S.f.alamatSamaran, run: () => { S.f.alamatSamaran = true; return 'Kamu menyalin ulang buku alamat semalaman. Semua nama diganti nama buah, dan yang asli kamu bakar.'; } },
  buletin: { t: 'Fotokopi buletin berantai', d: 'seratus lembar, disebar dari tangan ke tangan', req: () => S.bulan >= '1997-06', run: () => { apply({ massa: 2, tekanan: 1, sorotan: 2, kuasa: -1 }); return 'Seratus lembar buletin kamu fotokopi di kios dekat pasar, lalu dititipkan dari kampus ke kampus. Pemilik kios mulai hafal wajahmu.'; } }
});
for (const id of Object.keys(KADER)) SLOT['kader_' + id] = { t: `Ngobrol dengan ${KADER[id].nama}`, d: 'mendengar cerita dan pandangannya', req: () => aktif(id), run: (k = 1) => { tambahDekat(id, Math.max(1, Math.round(2 * k))); S.f['bicara_' + id] = S.bulan; return [`Kamu dan ${KADER[id].nama} ngobrol sampai warung tutup.`, `${KADER[id].nama} bercerita tentang keluarganya, hal yang belum pernah ia ceritakan ke orang lain.`, `${KADER[id].nama} menunggumu di tangga sekretariat seperti biasa. Kalian tidak perlu banyak bicara lagi.`][tingkat(id)]; } };
for (const [id, b] of Object.entries(BUKU)) SLOT['buku_' + id] = { t: `Mulai baca: ${b.judul}`, d: () => `${lamaBaca(b)} Kamis${b.terlarang ? ', terlarang' : ''}`, req: () => !S.buku.baca && !S.buku.selesai.includes(id), run: () => { S.buku.baca = id; S.buku.sisa = lamaBaca(b); return `Kamu meminjam ${b.judul} dari rak sekretariat.` + (S.fak === 'Teknik' ? isyarat('teknik', 'Bahasanya terasa asing bagimu yang lebih biasa membaca rumus. Satu halaman butuh dua kali baca.') : '');  } };
const lamaBaca = b => b.lama + (S.fak === 'Teknik' ? 1 : 0);
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
  kalender: { label: 'Kalender', text: () => 'Kalender bergambar Danau Toba, hadiah dari toko kelontong. Setiap hari yang kamu tulis di buku catatan kamu coret merah.' },
  jendela: { label: 'Jendela', text: s => s.sorotan >= 50 ? 'Dua motor tanpa pelat parkir di ujung gang. Pengendaranya bergantian melihat ke jendelamu.' : s.sorotan >= 25 ? 'Ada satu motor tanpa pelat di ujung gang. Pengendaranya merokok dan tidak turun.' : 'Gang sepi. Anak-anak main layangan di ujung gang.' },
  cermin: { label: 'Cermin', text: s => s.nyali < 40 ? 'Wajahmu sendiri. Lingkar matamu makin gelap.' : 'Wajahmu sendiri. Masih kelihatan seperti mahasiswa biasa.' },
  meja: { label: 'Meja belajar', text: s => `KHS terakhir: IPK ${ipkStr(s.ipk)}. Di sebelahnya, surat dari rumah yang belum kamu balas.` },
  dompet: { label: 'Dompet', text: s => `Tunai ${rp(s.uang.tunai)}. Nasi bungkus sekarang ${rp(harga(1500))}, sewa kamar Rp 35.000 sebulan.` },
  radio: { label: 'Radio ibu kos', text: s => (s.kuasa ?? 100) >= 70 ? 'Radio memutar pidato yang sama setiap jam. Ibu kos bilang, “Bapak Presiden itu sudah seperti raja. Tidak akan ke mana-mana.”' : (s.kuasa ?? 100) >= 35 ? 'Penyiar membacakan berita dengan suara hati-hati. Di sela lagu, ada yang menelepon dan mengeluhkan harga.' : 'Penyiar radio swasta mulai menyebut kata “reformasi” tanpa berbisik. Ibu kos mengecilkan suaranya, tapi tidak mematikannya.' },
  pintu: { label: 'Lorong', text: () => 'Telepon umum koin menempel di dinding lorong. Ibu kos menempel tulisan tangan: TELEPON MAKS. 3 MENIT.' }
};
TOPIK.kurs = {
  truth: s => kursAt(nextMonth(s.bulan)) > kursAt(s.bulan) * 1.03 ? 'naik' : kursAt(nextMonth(s.bulan)) < kursAt(s.bulan) * 0.97 ? 'turun' : 'tetap',
  benar: (s, t) => t === 'naik' ? 'Dolar bakal naik lagi bulan depan. Kalau mau beli, beli sekarang.' : t === 'turun' ? 'Rupiah bakal menguat. Jangan borong dolar dulu.' : 'Kurs bakal tenang-tenang saja bulan depan.',
  salah: (s, t) => t === 'naik' ? 'Rupiah bakal menguat. Jangan borong dolar dulu.' : t === 'turun' ? 'Dolar bakal naik lagi bulan depan. Beli sekarang.' : pick(['Dolar bakal melonjak bulan depan.', 'Rupiah bakal menguat tajam bulan depan.'])
};
const nextMonth = b => { let y = Number(b.slice(0, 4)), m = Number(b.slice(5, 7)) + 1; if (m > 12) { m = 1; y++; } return `${y}-${String(m).padStart(2, '0')}`; };
/* slot yang dilewatkan, IPK, dan posisimu di antara para senior: dihitung setiap kali slot dijalani */
const bolos = () => S.fak === 'Hukum' ? 0.25 : 0.2, ambangSP = () => S.fak === 'Hukum' ? 2.75 : 2.5;
const LALAI = [
  { cek: sl => !sl.includes('kuliah'), fx: () => ({ ipk: -bolos() }), t: () => S.fak === 'Hukum' ? 'Kamu bolos kuliah. Di Fakultas Hukum, satu pertemuan yang terlewat berarti satu bab hafalan yang menumpuk.' : 'Kamu bolos kuliah bulan-bulan ini.' },
  { cek: sl => !sl.includes('organisasi'), fx: { pengaruh: -4 }, t: 'Kamu tidak muncul di rapat organisasi, dan orang lain mengambil peranmu.' },
  { cek: sl => S.buku.baca && !sl.some(x => x === 'baca' || x.startsWith('buku_')), fx: { pengaruh: -2 }, t: 'Diskusi Kamis berjalan tanpamu, dan kamu tertinggal bacaan.' },
  { cek: sl => !sl.includes('telepon') && !sl.includes('dika'), fx: { ibu: -1, dika: -1 }, t: 'Kamu tidak menghubungi rumah sama sekali. Ibu dan Dika mulai berhenti bertanya.' }
];
// condong ke satu senior: ada untungnya, ada harganya, dan faksi yang kamu jauhi ikut membalas
const FAKSI = {
  damar: { plus: { massa: 3 }, minus: { sorotan: 4 }, t: 'Kamu dicap anak Bang Damar. Barisan jalanan ikut ke mana pun kamu pergi, tapi intel juga makin mengenali wajahmu.' },
  ratna: { plus: { pengaruh: 3 }, minus: { massa: -3 }, t: 'Kamu dicap orangnya Kak Ratna. Kamu ikut rapat-rapat penting, tapi anak-anak lapangan menyebutmu elitis.' },
  fikri: { plus: { nyali: 4 }, minus: { pengaruh: -3 }, t: 'Kamu dicap muridnya Bang Fikri. Pengajian malam membuatmu lebih tenang, tapi anak-anak Damar menyebutmu penakut.' },
  yudi: { plus: () => ({ uang: harga(15000) }), minus: { massa: -4 }, t: 'Kamu dicap orangnya Mas Yudi. Ia menitipkan amplop uang transpor, tapi kawan-kawan berbisik bahwa kamu dekat dengan rektorat.' }
};
function posisiSenior() {
  const sen = Object.keys(SENIOR), top = sen.reduce((a, b) => S[b] > S[a] ? b : a), jauh = sen.filter(k => S[k] <= 1);
  return { top, jauh, condong: S[top] >= 4 && jauh.length >= 2, terasing: S.bulan >= '1997-06' && S[top] <= 1 };
}
function peringatanSlot() {
  const p = posisiSenior(), w = [];
  if (p.condong) w.push(`Di sekretariat, orang mulai menyebutmu “orangnya ${SENIOR[p.top]}”.`);
  if (p.terasing) w.push(S.f.terasing ? 'Kak Ratna menatapmu lama di rapat terakhir, seperti sedang menimbang sesuatu.' : 'Belakangan tidak ada senior yang mengajakmu ngopi. Di rapat, kursi di sebelahmu kosong.');
  return w.map(x => `<p class="fine">${x}</p>`).join('');
}
function akibatBulan(sl) {
  const out = [];
  for (const x of LALAI) if (x.cek(sl)) { apply(val(x.fx)); out.push(val(x.t)); }
  if (S.ipk < 2 && !S.f.dropOut) { S.f.dropOut = true; apply({ bapak: -2, pengaruh: -5 }); out.push('IPK-mu jatuh di bawah 2,00. Kampus mengeluarkanmu (DO), KTM-mu tidak berlaku lagi, dan Bapak berhenti mengirim uang.'); }
  else if (S.ipk < ambangSP() && !S.f.suratPeringatan) { S.f.suratPeringatan = true; apply({ bapak: -1 }); out.push('Surat peringatan akademik dikirim ke rumah. Bapak membalas dengan surat tiga baris: “Kuliahmu dulu.”'); }
  else if (S.ipk >= 3.5 && !S.f.dropOut) { const u = harga(25000); apply({ uang: u }); out.push(`IPK-mu ${ipkStr(S.ipk)}. Beasiswa prestasi cair: +${rp(u)}.`); }
  const p = posisiSenior();
  if (p.terasing) {
    S.f.terasing = (S.f.terasing || 0) + 1;
    if (S.f.terasing >= 2) { S.ending = 'dikeluarkan'; out.push('Rapat presidium memutuskan mengeluarkanmu. Tidak ada senior yang mau menjaminmu, dan seseorang menyebut namamu sebagai penyusup.'); }
    else { apply({ pengaruh: -5, massa: -3 }); out.push('Di rapat, tidak ada satu senior pun yang mau menjaminmu. Orang-orang mulai bertanya kamu sebenarnya orang siapa. Kak Ratna berkata pelan, “Hati-hati. Orang yang tidak dijamin siapa pun gampang dituduh.”'); }
  } else S.f.terasing = 0;
  if (p.condong) { const F = FAKSI[p.top]; apply(val(F.plus)); apply(F.minus); apply({ pengaruh: -3 }); out.push(`${F.t} Faksi ${p.jauh.map(k => SENIOR[k]).join(' dan ')} memboikot usulanmu di rapat.`); }
  return out;
}
// slot yang sedang dipilih diisi lebih dulu; kegiatan tanpa mini game hanya boleh di prioritas Rendah
function tempatSlot(id) {
  const m = S.m, cocok = i => !m.slots[i] && (i >= 4 || !!jenisMain(id));
  return cocok(m.pilih) ? m.pilih : m.slots.findIndex((_, i) => cocok(i));
}
function mainBerikut(n) {
  const m = S.m, i = m.antre.shift();
  if (i == null) return selesaikanBulan(n);
  m.step = 'main'; m.mg = buatMain(i, m.slots[i], 1); render('.mg');
}
// slot Penting dan Sedang hanya berhasil kalau mini gamenya lolos; hasilnya dikalikan bobot prioritas
function selesaikanBulan(n) {
  const m = S.m, b = snap();
  m.out = m.slots.map((id, i) => {
    const p = PRIOR[Math.floor(i / 2)];
    if (i < 4 && !m.ok[i]) return `${p.t} · ${SLOT[id].t}: gagal, tidak ada hasil.`;
    const k = bobotSlot(i, m.ulang), s0 = snap(), t = SLOT[id].run(k);
    skalakan(s0, k);
    return `${p.t} · ${t}`;
  }).concat(akibatBulan(m.slots), tugasBulan(m));
  const ev = pick(EVENTS)(); apply(ev.fx); m.ev = ev.t;
  if (S.cap > 0) S.cap--;
  m.deltas = diff(b); m.step = 'hasil'; m.mg = null;
  render('.result');
}
// tugas kader di setiap kunjungan kos: dipakai terus jadi lelah, tidak pernah dilibatkan merasa diabaikan
const TUGAS = {
  istirahat: { t: 'Istirahat', fx: {} },
  cetak: { t: 'Cetak selebaran', fx: { massa: 2, sorotan: 2, kuasa: -1 }, n: k => `${k} mencetak selebaran sampai tangannya hitam kena tinta.` },
  kurir: { t: 'Jadi kurir kabar', fx: { sorotan: -2 }, n: k => `${k} mengantar pesan dari kampus ke kampus, jadi kalian jarang memakai telepon.` },
  posko: { t: 'Jaga posko dan dapur umum', fx: { massa: 2 }, n: k => `${k} menjaga posko dan ikut memasak di dapur umum.` },
  lobi: { t: 'Lobi kampus lain', fx: { pengaruh: 2, iklim: 1, kuasa: -1 }, n: k => `${k} pulang dari kampus tetangga membawa nomor telepon tiga ketua senat.` }
};
function tugasBulan(m) {
  const out = [];
  for (const k of kaderAktif()) {
    const t = (m.tugas || {})[k] || 'istirahat', nama = KADER[k].nama, L = S.lelah = S.lelah || {};
    if (t === 'istirahat') {
      L[k] = 0;
      if (S.f['bicara_' + k] !== S.bulan) { S.f['abai_' + k] = (S.f['abai_' + k] || 0) + 1; if (S.f['abai_' + k] >= 2) { tambahDekat(k, -1); out.push(dekat(k) ? `${nama} makin jarang datang ke sekretariat. Tidak ada yang mengajaknya bicara atau memberinya tugas.` : `${nama} berhenti datang. Di tangga sekretariat, kawan-kawan bilang ia merasa tidak dibutuhkan.`); if (!dekat(k)) S.kader[k] = 'keluar'; } }
      continue;
    }
    S.f['abai_' + k] = 0; L[k] = (L[k] || 0) + 1;
    if (t === 'kurir') S.f.kurirSiap = true;
    apply(TUGAS[t].fx); out.push(TUGAS[t].n(nama));
    if (L[k] === 3) out.push(`${nama} tertidur di tengah rapat. Matanya cekung.`);
    if (L[k] >= 4) { if (tingkat(k) === 2) { S.kader[k] = 'diawasi'; L[k] = 2; out.push(`${nama} terlalu lelah untuk berhati-hati. Ia tidak sadar dibuntuti pulang, dan sekarang namanya ada di catatan intel.`); } else { S.kader[k] = 'keluar'; out.push(`${nama} bilang ia butuh berhenti dulu. Ia tidak kembali.`); } }
  }
  return out;
}
// surat Dika, satu di setiap kunjungan kos: balasanmu membentuk siapa Dika kelak
const DIKA_SURAT = {
  kos1: ['Guru BP merazia tas kami, mencari kaset dan majalah. Di Jakarta aman?', ['Aman. Jaga dirimu, dan jangan cari gara-gara dengan guru BP.', 'hati'], ['Aku ikut diskusi buku terlarang! Kamu juga harus berani melawan guru BP.', 'berani'], ['Aman. Belajar yang rajin.', 'jauh']],
  kos2: ['Kawan sekelasku bilang toko-toko di Tasikmalaya dibakar orang. Kenapa orang bisa begitu?', ['Karena ada yang sengaja memanas-manasi. Jangan ikut membenci, Dik.', 'hati'], ['Karena pemerintah membiarkannya. Suatu hari kita harus melawan mereka semua.', 'berani'], ['Itu urusan orang dewasa.', 'jauh']],
  kos3: ['Bapak marah karena aku bilang mau golput kalau sudah boleh memilih.', ['Pilihanmu nanti milikmu. Tapi jangan bertengkar dengan Bapak sekarang.', 'hati'], ['Bagus. Bilang ke Bapak, golput itu perlawanan.', 'berani'], ['Jangan bikin Bapak marah.', 'jauh']],
  kos5: ['Aku ikut lomba pidato 17-an. Boleh aku pakai kata-katamu?', ['Boleh, tapi tulis dengan kata-katamu sendiri, dan pikirkan siapa yang mendengar.', 'hati'], ['Pakai. Sebut soal KKN di depan Pak Camat.', 'berani'], ['Pakai saja yang ada di buku.', 'jauh']],
  kos5b: ['Harga buku pelajaran naik. Bapak bilang mungkin aku tidak usah les.', ['Nanti kukirim uang sedikit. Belajar terus, ya.', 'hati'], ['Sekolah juga tidak penting. Nanti ikut aku saja ke Jakarta.', 'berani'], ['Itu urusan Bapak.', 'jauh']],
  kos6: ['Di televisi ada mahasiswa demo. Aku mencari wajahmu. Aku juga mau ikut kalau sudah kuliah.', ['Kalau nanti ikut, pelajari dulu tuntutannya, dan jangan pernah di barisan depan sendirian.', 'hati'], ['Ikut. Barisan depan itu tempat paling terhormat.', 'berani'], ['Kamu masih kecil.', 'jauh']],
  kos7: ['Bang Damar yang dulu kamu ceritakan itu hilang, ya? Kamu juga bisa hilang?', ['Bisa. Makanya aku hati-hati. Kalau ada apa-apa, kamu jaga Ibu.', 'hati'], ['Aku tidak takut. Kalau aku hilang, kamu yang meneruskan.', 'berani'], ['Jangan tanya-tanya soal itu.', 'jauh']]
};
const SURAT_FX = { hati: { dika: 1 }, berani: { kagum: 1 }, jauh: { dika: -1 } };
const selisihKurs = () => S.fak === 'Ekonomi' ? 0.005 : 0.015;
MODES.kos = {
  enter(n) {
    const months = Math.max(1, monthsBetween(n.dari, n.bulan));
    const lines = [], kir = kiriman() * months, bulanan = 35000 + 70000 * indeks(), hidup = Math.round(bulanan * months / 500) * 500;
    S.bankBeku = false;
    if (S.uang.bank > 0) {
      const rate = (S.bulan >= '1998-01' ? 0.04 : 0.015) + (S.bankJenis === 'kecil' ? 0.005 : 0), bunga = Math.round(S.uang.bank * (Math.pow(1 + rate, months) - 1));
      S.uang.bank += bunga; lines.push(`Bunga bank ${months} bulan: +${rp(bunga)}.`);
      if (n.dari < '1997-11' && n.bulan >= '1997-11' && S.bankJenis === 'kecil') { S.bankBeku = true; lines.push('Pada 1 November 1997, bankmu termasuk 16 bank yang ditutup. Tabunganmu dibekukan sampai kunjungan berikutnya.'); }
    }
    if (S.uang.barang > 0) { const rusak = Math.round(S.uang.barang * (1 - Math.pow(0.9, months / 3))); if (rusak) { S.uang.barang -= rusak; lines.push(`${rusak} paket beras berkutu dan harus dibuang.`); } }
    if (S.uang.utang > 0) { const bunga = Math.round(S.uang.utang * (Math.pow(1 + BUNGA_LINTAH, months) - 1)); S.uang.utang += bunga; lines.push(`Bunga lintah darat ${months} bulan: utangmu bertambah ${rp(bunga)}.`); }
    S.kurs = Math.round(kursAt(n.bulan) * (0.95 + Math.random() * 0.1));
    tagihUtang(lines); // yang ditagih utang lama; pinjaman baru bulan ini baru ditagih kunjungan berikutnya
    S.uang.tunai += kir;
    lines.push(kir ? `Kiriman Bapak ${months} bulan: +${rp(kir)}.` : 'Bapak tidak mengirim uang bulan-bulan ini.');
    // bahan pokok dibeli dengan harga lama, lalu dimasak saat harga sudah naik: selisihnya jadi penghematan
    const pakai = Math.min(S.uang.barang, 2 * months), hemat = pakai * harga(20000);
    if (pakai) { S.uang.barang -= pakai; lines.push(`Kamu memasak ${pakai} paket beras dan minyak dari lemari. Biaya makan berkurang ${rp(hemat)}, dengan harga sepaket sekarang ${rp(harga(20000))}.`); }
    lines.push(`Sewa kos dan makan ${months} bulan: −${rp(hidup - hemat)}.`);
    const sewaAman = S.protokol.includes('safehouse') && !S.f.safehouseBocor ? harga(10000) * months : 0;
    if (sewaAman) lines.push(`Sewa kamar safehouse ${months} bulan: −${rp(sewaAman)}.`);
    bayarWajib(hidup - hemat + sewaAman, lines);
    const cadangan = S.uang.tunai + (S.bankBeku ? 0 : S.uang.bank) + S.uang.usd * S.kurs + S.uang.barang * harga(20000);
    if (!S.uang.utang && cadangan >= 3 * bulanan) { apply({ nyali: 5 }); lines.push('Simpananmu cukup untuk hidup tiga bulan ke depan. Kamu tidur lebih nyenyak.'); }
    if (S.f.agenGanda) {
      const nm = KADER[S.penyusup].nama;
      S.f.agenSisa = (S.f.agenSisa || 2) - 1; apply({ sorotan: -5 });
      if (S.f.agenSisa > 0) lines.push(`Kabar palsu yang kamu titipkan lewat ${nm} membuat aparat menggerebek rumah kosong di Bekasi.`);
      else { S.f.agenGanda = false; S.f.penyusupKetahuan = true; S.f.agenKorban = true; S.kader[S.penyusup] = 'ditangkap'; lines.push(`Aparat sadar kabar dari ${nm} selalu salah. Ia dijemput dari kosnya tengah malam. Sejak itu tidak ada yang tahu kabarnya.`); }
    }
    S.m = { step: 'uang', slots: Array(6).fill(null), pilih: 0, lines, out: [], ev: null, tugas: {}, surat: DIKA_SURAT[S.node] && !S.f['surat_' + S.node] ? S.node : null };
    S.ui.kabar = [kabar('kurs', S.fak === 'Ekonomi' ? 'ekonomi' : pick(['radio', 'warung', 'yudi']))];
  },
  panel(n) {
    let h = meta(n) + prose(n) + lookHTML(n);
    const m = S.m;
    if (m.step === 'uang') {
      const kb = S.kurs, beli = Math.round(kb * (1 + selisihKurs())), jual = Math.round(kb * (1 - selisihKurs())), hb = harga(20000);
      h += `<div class="obs"><p class="label">Uang bulan ini</p><ul class="rules">${m.lines.map(l => `<li>${l}</li>`).join('')}</ul></div>` + kabarHTML();
      if (m.surat) { const [q, ...o] = DIKA_SURAT[m.surat]; h += `<div class="ask"><p class="label">Surat dari Dika</p><div class="kb"><b>Dika</b><p>“${sapaan()}, ${q[0].toLowerCase() + q.slice(1)}”</p></div><ol class="choices">${o.map(([t], k) => `<li><button type="button" class="choice" data-a="surat" data-v="${k}"><span class="key" aria-hidden="true">${'ABC'[k]}</span><span>Balas: ${t}</span></button></li>`).join('')}</ol></div>`; }
      else if (m.suratNote) h += `<div class="obs"><p>${m.suratNote}</p></div>`;
      h += `<div class="ask"><p class="label">Atur uangmu · kurs hari ini ${rp(kb)} per dolar</p>${S.fak === 'Ekonomi' ? '<p class="fine">Kamu tahu money changer mana yang tidak mengambil untung besar.</p>' : ''}<div class="sheet"><table><thead><tr><th>Tempat</th><th>Isi</th><th>Tindakan</th></tr></thead><tbody>
        <tr><td>Tunai</td><td>${rp(S.uang.tunai)}</td><td>dipakai untuk semua pengeluaran</td></tr>
        <tr><td>Bank${S.bankJenis ? (S.bankJenis === 'kecil' ? ' swasta kecil' : ' besar') : ''}</td><td>${rp(S.uang.bank)}${S.bankBeku ? ' (beku)' : ''}</td><td>${S.bankJenis ? `<button type="button" class="chip" data-a="setor" data-v="25000"${S.uang.tunai < 25000 ? ' disabled' : ''}>Setor Rp 25.000</button> <button type="button" class="chip" data-a="tarik" data-v="25000"${S.uang.bank < 25000 || S.bankBeku ? ' disabled' : ''}>Tarik Rp 25.000</button>` : `<button type="button" class="chip" data-a="bank" data-v="kecil">Buka rekening bank swasta kecil (bunga lebih tinggi)</button> <button type="button" class="chip" data-a="bank" data-v="besar">Buka rekening bank besar</button>`}</td></tr>
        <tr><td>Dolar</td><td>USD ${S.uang.usd}</td><td><button type="button" class="chip" data-a="beliusd"${S.uang.tunai < beli * 10 ? ' disabled' : ''}>Beli USD 10 (${rp(beli * 10)})</button> <button type="button" class="chip" data-a="jualusd"${S.uang.usd < 10 ? ' disabled' : ''}>Jual USD 10 (${rp(jual * 10)})</button></td></tr>
        <tr><td>Bahan pokok</td><td>${S.uang.barang} paket</td><td><button type="button" class="chip" data-a="belibarang"${S.uang.tunai < hb ? ' disabled' : ''}>Beli 1 paket beras dan minyak (${rp(hb)})</button><br><small>Beras dan minyak di lemari bisa kamu masak sendiri. Harga di warung naik hampir setiap bulan.</small></td></tr>
        ${S.uang.utang > 0 ? `<tr><td class="bad">Utang lintah darat</td><td>${rp(S.uang.utang)}</td><td><button type="button" class="chip" data-a="bayarutang"${S.uang.tunai <= 0 ? ' disabled' : ''}>Cicil ${rp(Math.min(25000, S.uang.utang))}</button> <button type="button" class="chip" data-a="lunasi"${S.uang.tunai < S.uang.utang ? ' disabled' : ''}>Lunasi</button><br><small>Penagihnya berpesan: “Jangan sampai saya yang datang ke kosmu.”</small></td></tr>` : ''}
        </tbody></table></div><button type="button" class="btn" data-a="selesai"${m.surat ? ' disabled' : ''}>${m.surat ? 'Balas surat Dika dulu' : 'Selesai mengatur uang'}</button></div>`;
      return h;
    }
    if (m.step === 'hasil') return h + `<section class="result" tabindex="-1"><p class="label">Bulan-bulan ini</p><ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul><div class="event"><p class="label">Kejadian</p><p>${m.ev}</p></div>${deltasHTML(m.deltas)}<button type="button" class="btn" data-a="goto" data-v="${S.ending ? 'akhir' : n.next}">Lanjut</button></section>`;
    if (m.step === 'main') return h + panelMain(m);
    if (m.step === 'tugas') return h + `<div class="ask"><p class="label">Beri tugas kadermu bulan-bulan ini</p><div class="posgrid">${kaderAktif().map(k => `<div class="slot full"><span class="label">${KADER[k].nama}</span><span>${TUGAS[m.tugas[k] || 'istirahat'].t}${(S.lelah || {})[k] >= 2 ? ' · <small class="bad">matanya cekung</small>' : ''}</span><button type="button" class="link" data-a="tugas" data-v="${k}">Ganti</button></div>`).join('')}</div><button type="button" class="btn" data-a="tugasok">Bagikan tugas</button></div>`;
    const kotak = i => { const a = m.slots[i]; return a ? `<div class="slot full"><span>${SLOT[a].t}</span><button type="button" class="link" data-a="unslot" data-v="${i}">Hapus</button></div>` : `<button type="button" class="slot${m.pilih === i ? ' aktif' : ''}" data-a="pilihslot" data-v="${i}"><span class="empty">${m.pilih === i ? 'akan diisi' : 'kosong'}</span></button>`; };
    const baris = PRIOR.map((p, r) => `<p class="label">${p.t} · ${['dikerjakan sungguh-sungguh, boleh dicoba lagi kalau gagal', 'dikerjakan sekali jalan', 'sambil lalu'][r]}</p><div class="slots dua">${kotak(2 * r)}${kotak(2 * r + 1)}</div>`).join('');
    const penuh = m.slots.every(Boolean);
    const acts = Object.entries(SLOT).filter(([, a]) => !a.req || a.req(S)).map(([id, a]) => `<button type="button" class="chip" data-a="slot" data-v="${id}"${tempatSlot(id) < 0 ? ' disabled' : ''}><b>${a.t}</b> <small>${val(a.d)}${jenisMain(id) ? '' : ' · hanya bisa sambil lalu'}</small></button>`).join('');
    const tuduh = kaderAktif().length ? `<details class="tuduh"><summary>Telepon presidium: tuduh seorang kader sebagai penyusup</summary><div class="acts">${kaderAktif().map(k => `<button type="button" class="chip" data-a="tuduh" data-v="${k}">Tuduh ${KADER[k].nama}</button>`).join('')}</div></details>` : '';
    return h + (m.tuduhNote ? `<div class="obs"><p>${m.tuduhNote}</p></div>` : '') + `<div class="ask"><p class="label">Isi enam slot waktu menurut prioritas</p>${peringatanSlot()}${baris}<div class="acts">${acts}</div><button type="button" class="btn" data-a="jalani"${penuh ? '' : ' disabled'}>Jalani</button>${tuduh}</div>`;
  },
  act(n, a, v) {
    const m = S.m, kb = S.kurs;
    if (m.step === 'uang') {
      if (a === 'bank') S.bankJenis = v;
      else if (a === 'setor' && S.uang.tunai >= 25000) { S.uang.tunai -= 25000; S.uang.bank += 25000; }
      else if (a === 'tarik' && S.uang.bank >= 25000 && !S.bankBeku) { S.uang.bank -= 25000; S.uang.tunai += 25000; }
      else if (a === 'beliusd' && bayar(Math.round(kb * (1 + selisihKurs())) * 10)) S.uang.usd += 10;
      else if (a === 'jualusd' && S.uang.usd >= 10) { S.uang.usd -= 10; S.uang.tunai += Math.round(kb * (1 - selisihKurs())) * 10; }
      else if (a === 'belibarang' && bayar(harga(20000))) S.uang.barang += 1;
      else if (a === 'bayarutang' && S.uang.utang > 0) { const x = Math.min(25000, S.uang.utang, S.uang.tunai); S.uang.tunai -= x; S.uang.utang -= x; }
      else if (a === 'lunasi' && S.uang.utang > 0 && S.uang.tunai >= S.uang.utang) { S.uang.tunai -= S.uang.utang; S.uang.utang = 0; }
      else if (a === 'surat' && m.surat) { const o = DIKA_SURAT[m.surat][1 + Number(v)]; if (!o) return; S.f['surat_' + m.surat] = o[1]; S.f['dika_' + o[1]] = (S.f['dika_' + o[1]] || 0) + 1; apply(SURAT_FX[o[1]]); m.suratNote = 'Kamu membalas: “' + o[0] + '” Suratnya kamu masukkan ke kotak pos di ujung gang.'; m.surat = null; }
      else if (a === 'selesai' && !m.surat) m.step = kaderAktif().length ? 'tugas' : 'slot';
      return render();
    }
    if (m.step === 'tugas') {
      const ks = Object.keys(TUGAS);
      if (a === 'tugas' && aktif(v)) m.tugas[v] = ks.at((ks.indexOf(m.tugas[v] || 'istirahat') + 1) % ks.length);
      else if (a === 'hadiah' && aktif(v) && !S.f['hadiah_' + v] && bayar(harga(KADER[v].harga))) { S.f['hadiah_' + v] = true; tambahDekat(v, 2); m.hadiahNote = `${KADER[v].nama} menerima ${KADER[v].benda} itu lama sekali tanpa bicara, lalu menyimpannya di saku.`; }
      else if (a === 'tugasok') m.step = 'slot';
      return render();
    }
    if (m.step === 'main') {
      const g = m.mg;
      if (a === 'mg' && !g.hasil) { jawabMain(g, v); return render('.mg'); }
      if (a === 'mgulang' && g.hasil && !g.hasil.ok && bisaUlang(g)) { m.ulang++; m.mg = buatMain(g.i, g.id, g.coba + 1); return render('.mg'); }
      if (a === 'mglanjut' && g.hasil) { m.ok[g.i] = g.hasil.ok; return mainBerikut(n); }
      return;
    }
    if (m.step !== 'slot') return;
    if (a === 'pilihslot' && !m.slots[+v]) { m.pilih = +v; return render(); }
    if (a === 'slot' && SLOT[v] && (!SLOT[v].req || SLOT[v].req(S)) && tempatSlot(v) >= 0) { m.slots[tempatSlot(v)] = v; m.pilih = m.slots.findIndex(x => !x); return render(); }
    if (a === 'unslot' && m.slots[+v]) { m.slots[+v] = null; m.pilih = +v; return render(); }
    if (a === 'tuduh' && aktif(v)) {
      const benar = v === S.penyusup && penyusupAktif();
      S.kader[v] = 'keluar';
      if (benar) { S.f.penyusupKetahuan = true; apply({ sorotan: -15, massa: 5 }); m.tuduhNote = `Tuduhanmu benar. ${KADER[v].nama} tidak membantah. Keesokan harinya ia menghilang dari kos, dan pager di sekretariat berhenti berbunyi di jam-jam aneh.`; }
      else { apply({ massa: -10 }); m.tuduhNote = `Tuduhanmu salah. ${KADER[v].nama} menangis di depan presidium lalu keluar dari gerakan. Beberapa kawan mulai menjaga jarak darimu.`; }
      return render();
    }
    if (a === 'jalani' && m.slots.every(Boolean)) { m.ok = []; m.ulang = 0; m.antre = [0, 1, 2, 3]; return mainBerikut(n); }
  },
  actions(n) {
    const m = S.m;
    if (m.step === 'uang' && m.surat) return [0, 1, 2].map(v => ({ a: 'surat', v }));
    if (m.step === 'tugas') { const ks = kaderAktif(); return [{ a: 'tugasok' }, ...ks.map(v => ({ a: 'tugas', v }))]; }
    if (m.step === 'uang') { const ops = [{ a: 'selesai' }]; if (!S.bankJenis) ops.push({ a: 'bank', v: pick(['kecil', 'besar']) }); if (S.uang.tunai > 60000) ops.push({ a: 'setor', v: 25000 }, { a: 'beliusd' }, { a: 'belibarang' }); if (S.uang.usd >= 10) ops.push({ a: 'jualusd' }); if (S.uang.utang > 0 && S.uang.tunai > 0) ops.push({ a: 'bayarutang' }); return ops; }
    if (m.step === 'hasil') return [{ a: 'goto', v: S.ending ? 'akhir' : n.next }];
    if (m.step === 'main') return aksiBotMain(m.mg);
    if (m.slots.every(Boolean)) return [{ a: 'jalani' }];
    return Object.entries(SLOT).filter(([id, a]) => (!a.req || a.req(S)) && tempatSlot(id) >= 0).map(([id]) => ({ a: 'slot', v: id }));
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
const hargaItem = id => harga(ITEMS[id].harga) * (id === 'toa' && S.fak === 'Teknik' ? 0.5 : 1);
// barang wajib aksi; di bawah separuh kebutuhan dianggap sabotase
const WAJIB = ['air', 'odol', 'p3k', 'toa'];
const minimalItem = (id, M) => Math.ceil(Math.ceil(M / ITEMS[id].per) * 0.5);
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
    const m = S.m, cost = id => hargaItem(id) * m.qty[id], total = Object.keys(ITEMS).reduce((s, id) => s + cost(id), 0), sisa = m.anggaran - total;
    h += `<div class="ask"><p class="label">Anggaran ${rp(m.anggaran)} · terpakai ${rp(total)} · sisa ${rp(sisa)}</p><div class="sheet"><table><thead><tr><th>Barang</th><th>Minimal</th><th>Cukup untuk ±${m.est} orang</th><th>Jumlah</th><th>Biaya</th><th></th></tr></thead><tbody>`;
    for (const [id, it] of Object.entries(ITEMS)) {
      if (id === 'bus' && !S.f.ruteJauh) continue;
      const nd = id === 'spanduk' ? 3 : Math.ceil(m.est / it.per);
      h += `<tr><td>${id === 'toa' && S.fak === 'Teknik' ? 'Toa rakitan sendiri dari aki bekas' : it.t}</td><td>${WAJIB.includes(id) ? minimalItem(id, m.est) : '–'}</td><td>${nd}</td><td>${m.qty[id]}</td><td>${rp(cost(id))}</td><td><button type="button" class="chip" data-a="kurang" data-v="${id}"${m.qty[id] <= 0 ? ' disabled' : ''}>−${it.step}</button> <button type="button" class="chip" data-a="tambah" data-v="${id}"${sisa < hargaItem(id) * it.step ? ' disabled' : ''}>+${it.step}</button></td></tr>`;
    }
    h += `</tbody></table></div><div class="row"><button type="button" class="chip" data-a="pribadi"${S.uang.tunai < 25000 ? ' disabled' : ''}>Tambah Rp 25.000 dari uang pribadi</button></div><p class="label">Simpan barang di</p><div class="acts">${[['sekre', 'Sekretariat (berisiko kena razia)'], ['rt', 'Rumah Pak RT'], ['kos', 'Kos kader']].map(([v, t]) => `<button type="button" class="chip" data-a="simpan" data-v="${v}" aria-pressed="${m.simpan === v}"${v === 'rt' && !S.f.dapurUmum ? ' disabled' : ''}>${t}</button>`).join('')}</div><button type="button" class="btn" data-a="ok"${m.simpan ? '' : ' disabled'}>Selesai belanja</button></div>`;
    return h;
  },
  act(n, a, v) {
    if (S.ui.last) return;
    const m = S.m, total = () => Object.keys(ITEMS).reduce((s, id) => s + hargaItem(id) * m.qty[id], 0);
    if (a === 'tambah' && ITEMS[v] && m.anggaran - total() >= hargaItem(v) * ITEMS[v].step) m.qty[v] += ITEMS[v].step;
    else if (a === 'kurang' && m.qty[v] > 0) m.qty[v] = Math.max(0, m.qty[v] - ITEMS[v].step);
    else if (a === 'pribadi' && bayar(25000)) m.anggaran += 25000;
    else if (a === 'simpan') m.simpan = v;
    else if (a === 'ok' && m.simpan) {
      const b = snap(), siap = {}, notes = [];
      for (const id of Object.keys(ITEMS)) { const nd = need(id, m.M); siap[id] = nd ? Math.min(1, m.qty[id] / nd) : 1; }
      if (bocor()) { const sisa = m.simpan === 'sekre' ? 0.2 : 0.5; for (const k of Object.keys(siap)) siap[k] *= sisa; apply({ kuasa: 3 }); notes.push(`Dua hari sebelum aksi, aparat menggerebek ${{ sekre: 'sekretariat', rt: 'rumah Pak RT', kos: 'kos kader' }[m.simpan]} dan menyita ${sisa < 0.5 ? 'hampir semua' : 'separuh'} barang. Hanya lingkaran dalam yang tahu tempat itu.`); }
      if (kaderAktif().some(k => S.kader[k] === 'diawasi') && Math.random() < 0.3) { siap.air *= 0.5; notes.push('Seorang kader yang sedang diawasi dihentikan di jalan, dan air minum yang dibawanya disita.'); }
      S.siap = siap;
      const cek = Object.keys(ITEMS).filter(id => id !== 'bus' || S.f.ruteJauh).map(id => `${siap[id] >= 0.8 ? '✓' : '✗'} ${ITEMS[id].t}`);
      notes.unshift(`Massa yang benar-benar datang sekitar ${m.M} orang.`);
      notes.push('Daftar periksa Kak Ratna: ' + cek.join(' · '));
      const kurang = WAJIB.filter(id => m.qty[id] < minimalItem(id, m.est));
      if (kurang.length) {
        S.f.sabotase = (S.f.sabotase || 0) + 1; apply({ pengaruh: -10, massa: -5, ratna: -1, kuasa: 4 });
        notes.push(S.f.sabotase >= 2 ? 'Untuk kedua kalinya belanjaanmu jauh di bawah kebutuhan. Presidium tidak lagi bertanya. Mereka menyebutnya sabotase.' : `Presidium memeriksa daftar belanjamu: ${kurang.map(id => ITEMS[id].t.toLowerCase()).join(', ')} jauh di bawah kebutuhan. Di rapat, seseorang bertanya pelan apakah kamu sengaja menyabotase aksi.`);
        if (S.f.sabotase >= 2) S.ending = 'dikeluarkan';
      }
      return setResult(null, notes, b, S.ending ? 'akhir' : n.next);
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
  enter(n) { S.m = { list: n.visitors(S), i: -1, bawah: false, tanya: false, tas: false, gelang: false, kode: false, ticks: 0, kep: {} }; S.m.batas = (n.sabar != null ? val(n.sabar) : 10) + S.m.list.length; },
  panel(n) {
    const m = S.m;
    if (S.ui.last) return meta(n) + resultHTML();
    if (m.i < 0) return meta(n) + prose(n) + `<p class="label">Aturan</p>${val(n.rules)}<button type="button" class="btn" data-a="mulai">Mulai berjaga</button>`;
    const t = m.list[m.i];
    let h = meta(n, `tamu ${m.i + 1} dari ${m.list.length}`) + antreanHTML(m);
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
    if (a === 'tanya' || a === 'tas' || a === 'gelang' || a === 'kode') { if (!m[a]) { m[a] = true; m.ticks++; } return m.ticks >= m.batas ? jebol(n) : render(); }
    if (a === 'bawah') { m.bawah = !m.bawah; m.ticks += m.bawah ? 1 : 0; return m.ticks >= m.batas ? jebol(n) : render(); }
    if (a === 'putus') {
      m.kep[m.list[m.i].id] = v; m.ticks++;
      if (m.i < m.list.length - 1 && m.ticks >= m.batas) return jebol(n);
      if (m.i < m.list.length - 1) return blinkThen(() => { m.i++; m.bawah = m.tanya = m.tas = m.gelang = m.kode = false; render(); });
      selesaiInspeksi(n);
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
// kesabaran antrean: setiap pemeriksaan dan keputusan memakan waktu; kalau habis, yang belum diperiksa menerobos masuk
function antreanHTML(m) {
  const sisa = Math.max(0, 1 - m.ticks / m.batas), sempit = m.batas - m.ticks <= 4;
  return `<div class="marah"><span class="label">Kesabaran antrean${sempit ? ' · barisan belakang mulai mendorong dan berteriak' : m.batas - m.ticks <= 8 ? ' · orang-orang mulai menggerutu' : ''}</span><div class="meter"><i style="width:${Math.round(sisa * 100)}%"></i></div></div>`;
}
function jebol(n) {
  const m = S.m, sisa = m.list.slice(m.i + (m.kep[m.list[m.i].id] ? 1 : 0));
  for (const t of sisa) m.kep[t.id] = 'izin';
  selesaiInspeksi(n, sisa);
}
function selesaiInspeksi(n, jebolan) {
  const m = S.m, b = snap(), res = n.evaluate(S, m.kep, m.list);
  if (jebolan) { apply({ massa: n.level >= 2 ? -6 : -3, ricuh: n.level >= 2 ? 1 : 0 }); res.note = [`Antrean jebol. ${jebolan.length ? jebolan.length + ' orang menerobos masuk tanpa diperiksa, dan tidak ada lagi yang bisa membendung mereka.' : 'Orang-orang mendorong mejamu dan masuk begitu saja.'}`].concat(res.note); }
  apply(res.fx);
  setResult(null, res.note, b, res.go || n.next);
}
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
  plafon: { t: 'Plafon', p: 0.10, n: 3, area: 'atas', h: 'pengap dan berdebu', kel: 'Naik ke atas' }, lemari: { t: 'Lemari pakaian', p: 0.30, n: 2, area: 'kamar', h: 'sempit, bau kapur barus', kel: 'Di dalam rumah' }, bak: { t: 'Bak air', p: 0.15, n: 4, area: 'mandi', h: 'air dingin sampai dagu', kel: 'Di dalam rumah' },
  kolong: { t: 'Kolong ranjang', p: 0.45, n: 1, area: 'kamar', h: 'gelap dan rendah', kel: 'Di dalam rumah' }, atap: { t: 'Atap genteng', p: 0.20, n: 3, area: 'atas', h: 'licin dan terbuka', kel: 'Naik ke atas' }, warga: { t: 'Rumah warga sebelah', p: 0.05, n: 1, area: 'luar', h: 'kalau mereka mau membukakan pintu' }
};
const AREA = { atas: 'ke arah langit-langit', kamar: 'ke kamar tidur', mandi: 'ke kamar mandi', luar: 'ke pintu belakang' };
const spotP = id => id === 'warga' ? (S.massa >= 50 || S.f.dapurUmum || S.fikri >= 3 ? 0.05 : 0.6) : SPOTS[id].p;
MODES.hide = {
  enter(n) { S.m = { spot: null, r: 0, dekat: null, cue: null, res: null, selesai: null }; mulaiWaktu(n.siapa === 'yos' ? 10 : 8); },
  panel(n) {
    const m = S.m;
    let h = meta(n, m.spot ? `ronde ${Math.min(m.r + 1, n.rounds)} dari ${n.rounds}` : '') + (m.spot ? '' : prose(n));
    if (S.ui.last) return h + resultHTML();
    if (m.res) return h + `<section class="result" tabindex="-1"><p>${m.res}</p><button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    if (!m.spot) return h + waktuHTML('Langkah mendekat') + pilihanHTML(n.spots.map(id => ({ a: 'spot', v: id, t: SPOTS[id].t, d: SPOTS[id].h, kel: SPOTS[id].kel })), n.siapa === 'yos' ? 'Sembunyikan Bang Yos di' : 'Sembunyi di');
    return h + `<div class="prose"><p>${m.cue}</p></div>${waktuHTML('Senter menyapu ruangan')}` + pilihanHTML([{ a: 'diam', t: 'Diam dan tahan napas' }].concat(n.spots.filter(id => id !== m.spot).map(id => ({ a: 'pindah', v: id, t: `Pindah ke ${SPOTS[id].t.toLowerCase()}`, d: 'lantai papan bisa berderit', kel: 'Pindah tempat' }))));
  },
  act(n, a, v) {
    const m = S.m;
    if (S.ui.last) return;
    const finish = ok => { const b = snap(); const r = n.after(S, ok); apply(r.fx); setResult(null, r.note, b, r.go); };
    if (a === 'waktuHabis' && !m.spot && !m.res) { m.spot = n.spots.includes('kolong') ? 'kolong' : n.spots.at(-1); m.res = `Kamu tidak sempat memilih. ${n.siapa === 'yos' ? 'Bang Yos menyelinap' : 'Kamu menyelinap'} ke ${SPOTS[m.spot].t.toLowerCase()}, tempat terdekat.`; return render('.result'); }
    if (a === 'waktuHabis' && m.spot && !m.res) return MODES.hide.act(n, 'diam');
    if (a === 'spot' && !m.spot) { S.ui.waktu = null; m.spot = v; nextCue(); mulaiWaktu(6); return render(); }
    if (a === 'rn' && m.res) { m.res = null; if (m.selesai !== null) return finish(m.selesai); nextCue(); mulaiWaktu(6); return render(); }
    if ((a === 'diam' || a === 'pindah') && m.spot && !m.res) {
      S.ui.waktu = null;
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
  enter(n) { S.m = { j: 0, stamina: 100, jarak: 3 + (S.f.dariAtap ? 1 : 0), opsi: genJunction(), lari: false, res: null, selesai: null }; mulaiWaktu(6); },
  panel(n) {
    const m = S.m;
    let h = meta(n, `persimpangan ${Math.min(m.j + 1, 6)} dari 6`) + (m.j === 0 && !m.res ? prose(n) : '');
    if (S.ui.last) return h + resultHTML();
    h += `<div class="marah"><span class="label">Tenagamu</span><div class="meter"><i style="width:${clamp(m.stamina, 0, 100)}%"></i></div></div><p class="label">Jarak dengan pengejar ${'■'.repeat(Math.max(0, m.jarak))}${'□'.repeat(Math.max(0, 5 - m.jarak))}</p>`;
    if (m.res) return h + `<section class="result" tabindex="-1"><p>${m.res}</p><button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    return h + waktuHTML('Langkah pengejar') + `<div class="row"><button type="button" class="chip" data-a="pace" aria-pressed="${!m.lari}">Jalan cepat (hemat tenaga)</button><button type="button" class="chip" data-a="pace" aria-pressed="${m.lari}">Berlari (cepat, menguras tenaga)</button></div><div class="ask"><ol class="choices">${m.opsi.map((o, k) => `<li><button type="button" class="choice" data-a="arah" data-v="${k}"><span class="key">${'ABC'[k]}</span><span>${o.label}</span></button></li>`).join('')}</ol></div>`;
  },
  act(n, a, v) {
    const m = S.m; if (S.ui.last) return;
    const finish = ok => { const b = snap(); const r = n.after(S, ok); apply(r.fx); setResult(null, r.note, b, r.go); };
    if (a === 'pace') { m.lari = !m.lari; return render(); }
    if (a === 'rn' && m.res) { m.res = null; if (m.selesai !== null) return finish(m.selesai); m.opsi = genJunction(); mulaiWaktu(6); return render(); }
    if (a === 'waktuHabis' && !m.res) { m.jarak--; m.ragu = true; return MODES.run.act(n, 'arah', String(randInt(m.opsi.length))); }
    if (a === 'arah' && !m.res) {
      S.ui.waktu = null;
      const o = m.opsi[+v]; let t = m.ragu ? 'Kamu ragu terlalu lama, dan langkah pengejar makin dekat. Kakimu memilih sendiri. ' : ''; m.ragu = false;
      m.stamina -= m.lari ? 25 : 15; if (m.lari) m.jarak++;
      if (o.aman) t += pick(['Gang itu tembus ke jalan kecil. Langkah pengejar terdengar makin jauh.', 'Kamu menyelinap di antara jemuran warga.', 'Jalan itu sepi dan gelap. Kamu terus berlari.']);
      else { m.jarak--; t += pick(['Buntu. Kamu harus memanjat pagar dan kehilangan waktu.', 'Ada orang berseragam di ujung gang. Kamu berbalik.', 'Seorang warga berteriak, dan pengejarmu mendengarnya.']); }
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
  belok: { kel: 'Kelabui di jalan', t: 'Belok mendadak', d: 'ban berdecit', run: m => { m.jarak++; m.curiga += 20; return 'Ban berdecit. Lampu di spion ikut berbelok, tapi tertinggal satu tikungan.'; } },
  pasar: { kel: 'Kelabui di jalan', t: 'Masuk pasar atau jalan sempit', d: 'gang sempit yang hanya dihafal orang setempat', run: m => { const lokal = m.sopir === 'wahyu'; m.jarak += lokal ? 2 : 0; m.curiga += 10; return lokal ? 'Wahyu hafal setiap gang di pasar ini. Mobil di belakang terjebak gerobak sayur.' : 'Sopir taksi ragu-ragu di gang sempit. Mobil di belakang tetap menempel.'; } },
  putar: { kel: 'Kelabui di jalan', t: 'Putar balik di bundaran', d: 'untuk memastikan', run: m => { m.curiga += 10; m.tahu = true; return 'Mobil itu ikut memutar penuh. Sekarang kamu yakin: kalian dibuntuti.'; } },
  terminal: { t: 'Ganti kendaraan di terminal', d: 'melompat ke bus lain', run: m => { if (m.jarak >= 2) { m.lepas = true; return 'Kamu melompat ke bus kota yang baru berangkat. Mobil itu terhalang antrean angkot.'; } m.curiga += 20; return 'Mobil itu terlalu dekat. Mereka melihatmu turun, jadi kamu kembali naik.'; } },
  spbu: { t: 'Berhenti di SPBU dan menunggu', d: 'pura-pura biasa saja', run: m => { m.curiga = Math.max(0, m.curiga - 20); m.jarak = 0; return 'Kalian mengisi bensin pelan-pelan. Mobil itu parkir di seberang jalan dengan lampu mati.'; } }
};
MODES.tail = {
  enter(n) { S.m = { r: 0, jarak: saudara('wahyu') ? 2 : 1, curiga: 30, sopir: aktif('wahyu') ? 'wahyu' : null, tahu: false, lepas: false, res: null, akhir: false }; },
  panel(n) {
    const m = S.m;
    let h = meta(n, m.akhir ? '' : `ronde ${Math.min(m.r + 1, 5)} dari 5`) + (m.r === 0 && !m.res ? prose(n) : '');
    if (S.ui.last) return h + resultHTML();
    h += `<p class="label">Jarak buntut ${'■'.repeat(Math.max(0, m.jarak))}${'□'.repeat(Math.max(0, 5 - m.jarak))}</p><div class="marah"><span class="label">Kecurigaan mereka</span><div class="meter"><i style="width:${Math.min(100, m.curiga)}%"></i></div></div>`;
    if (m.res) return h + `<section class="result" tabindex="-1"><p>${m.res}</p><button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    if (m.akhir) return h + `<div class="prose"><p>Kalian hampir sampai, tapi mobil itu masih ada di spion.</p></div><div class="ask"><ol class="choices"><li><button type="button" class="choice" data-a="ujung" data-v="bawa"><span class="key">A</span><span>Tetap ke safehouse<small>mobil itu masih di belakang</small></span></button></li><li><button type="button" class="choice" data-a="ujung" data-v="batal"><span class="key">B</span><span>Batalkan dan tidur di masjid<small>serambinya dingin dan terbuka</small></span></button></li></ol></div>`;
    return h + pilihanHTML(Object.entries(MANUVER).map(([id, x]) => ({ a: 'man', v: id, t: x.t, d: x.d, kel: x.kel })));
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
  enter(n) { S.m = { left: n.budget(S), done: [], lines: [] }; if (n.detik) mulaiWaktu(val(n.detik)); if (diTas('bukti') && S.bukti.length) S.f.bawaBukti = true; },
  panel(n) {
    let h = meta(n, `sisa ${S.m.left} tindakan`) + prose(n) + lookHTML(n);
    if (S.ui.last) return h + resultHTML();
    h += waktuHTML('Langkah-langkah di tangga');
    if (S.m.lines.length) h += `<ul class="rules">${S.m.lines.map(l => `<li>${l}</li>`).join('')}</ul>`;
    const opts = n.options.filter(o => !S.m.done.includes(o.id) && (!o.req || o.req(S)));
    return h + pilihanHTML(opts.map(o => ({ a: 'opt', v: o.id, t: val(o.t), d: o.d && val(o.d), kel: o.kel })));
  },
  act(n, a, v) {
    if (S.ui.last) return;
    if (a === 'waktuHabis') { const b = snap(), r = n.after(S); apply(r.fx); return setResult(null, ['Pintu digedor sebelum kamu selesai.'].concat(r.note), b, r.go); }
    if (a !== 'opt') return;
    const o = n.options.find(x => x.id === v && !S.m.done.includes(x.id)); if (!o) return;
    apply(val(o.fx)); S.m.lines.push(o.run ? o.run(S) : val(o.note)); S.m.done.push(o.id); S.m.left--;
    if (S.m.left <= 0 || !n.options.some(x => !S.m.done.includes(x.id) && (!x.req || x.req(S)))) { S.ui.waktu = null; const b = snap(); const r = n.after(S); apply(r.fx); return setResult(null, r.note, b, r.go); }
    render();
  },
  actions(n) { if (S.ui.last) return [{ a: 'next' }]; return n.options.filter(o => !S.m.done.includes(o.id) && (!o.req || o.req(S))).map(o => ({ a: 'opt', v: o.id })); }
};

/* ---------- buron ---------- */
// jarak dari Jakarta: makin jauh makin aman (Jejak kecil), tapi kabar dan perintah melewati makin banyak perantara
const KOTA = {
  jakarta: { t: 'Jakarta', jarak: 0, risiko: 14, ongkos: 0, kampus: true, jaringan: true, d: 'pusat gerakan, razia tiap minggu', minggu: () => ({ fx: { pengaruh: 3 }, t: 'Kamu menemui presidium langsung di rumah-rumah aman. Perintahmu sampai tanpa perantara.' }) },
  bandung: { t: 'Bandung', jarak: 1, risiko: 10, ongkos: 15000, kampus: true, jaringan: true, d: 'kampus besar, intel kampus banyak', minggu: () => ({ fx: { massa: 3, sorotan: 2 }, t: 'Mahasiswa Bandung mengajakmu ke rapat gelap. Intel kampus mencatat ada wajah baru.' }) },
  yogya: { t: 'Yogyakarta', jarak: 2, risiko: 7, ongkos: 30000, kampus: true, jaringan: true, d: 'basis aktivis dan penerbit', minggu: () => ({ fx: { tekanan: 4, nyali: 3 }, t: 'Penerbit kecil mencetak kesaksianmu tanpa nama, dan komunitas seni menampungmu.' }) },
  magelang: { t: 'Magelang', jarak: 2, risiko: 6, ongkos: 25000, kampus: false, jaringan: false, d: 'kampung halaman, dekat keluarga', minggu: () => rumahDiawasi() ? { fx: { jejak: 12, nyali: 4 }, t: 'Rumah keluargamu sedang diawasi. Laki-laki di warung depan rumah mengenali langkahmu.' } : { fx: { nyali: 8, ibu: 1 }, t: 'Kamu tidur di rumah Pakde di kampung sebelah. Ibu datang diam-diam membawa rantang.' } },
  surabaya: { t: 'Surabaya', jarak: 3, risiko: 5, ongkos: 35000, kampus: true, jaringan: true, d: 'serikat buruh', minggu: () => ({ fx: { uang: harga(15000), massa: aktif('asep') ? 5 : 2 }, t: 'Serikat buruh memberimu tempat tidur di mes pabrik dan sedikit uang.' + (aktif('asep') ? ' Kenalan Asep mengumpulkan buruh untuk mendengarmu.' : '') }) },
  medan: { t: 'Medan', jarak: 4, risiko: 3, ongkos: 60000, kampus: false, jaringan: true, d: 'jaringan pers, jauh dari pusat', minggu: () => ({ fx: { tekanan: 3 }, t: 'Wartawan di Medan memuat kabar tentang orang hilang. Kabar dari Jakarta sampai ke sini seminggu terlambat.' }) }
};
const rumahDiawasi = () => (S.f.terorKena || []).length > 0 && !S.f.keluargaAman;
TOPIK.razia = {
  truth: s => s.m.razia,
  benar: (s, t) => `Minggu ini razia besar di ${KOTA[t].t}. Jangan ke sana dulu.`,
  salah: (s, t) => `Minggu ini razia besar di ${KOTA[pick(Object.keys(KOTA).filter(k => k !== t))].t}. Jangan ke sana dulu.`
};
// awal minggu: pusat mengabarkan kota sasaran razia; akurasinya turun sesuai jarak kotamu dari Jakarta
function mingguBaru(m) {
  m.razia = pick(['jakarta', 'jakarta', 'jakarta', 'bandung', 'bandung', 'yogya', 'magelang', 'surabaya', 'medan']);
  if (S.f.lokasiBocor) { m.razia = m.kota; S.f.lokasiBocor = false; } // kawan yang tertangkap menyebut kotamu
  S.ui.kabar = [kabar('razia', aktif('laras') ? 'laras' : 'ratna', KOTA[m.kota].jarak)];
  S.ui.cek = null; S.ui.kabarDelta = null;
}
const isyaratRazia = () => ' ' + (genderKu() === 'P' ? 'Petugas hanya melirikmu sebentar, lalu memeriksa laki-laki di belakangmu.' : 'Petugas memeriksa setiap laki-laki muda di antrean.');
const AKSI_BURON = {
  sembunyi: { kel: 'Bertahan hidup', t: 'Bersembunyi', d: 'tidak keluar kamar seminggu', run: () => { apply({ jejak: -10, nyali: 4 }); return 'Kamu tidak keluar kamar seminggu penuh.'; } },
  wartel: { kel: 'Kontak pusat', t: 'Kontak pusat lewat wartel', d: 'cepat, tapi penjaga wartel melihat wajahmu', run: () => kontak('wartel', S.sorotan > 60 ? 10 : 5, 0) },
  pager: { kel: 'Kontak pusat', t: 'Kirim pesan pager ke pusat', d: 'balasannya harus kamu jawab dari telepon umum', req: () => !S.m.pagerMasuk && !seniorTangkap('yudi'), run: () => { S.m.pagerMasuk = true; return 'Kamu menitipkan pesan ke operator pager: JOKO SEHAT. MINTA KABAR. Sejam kemudian pager-mu bergetar: nomor telepon umum dan jam.'; } },
  balas: { kel: 'Kontak pusat', t: 'Balas pager dari telepon umum', d: 'pakai kode, berdiri di bilik yang menghadap jalan', req: () => S.m.pagerMasuk, run: () => { S.m.pagerMasuk = false; S.f.pagerKali = (S.f.pagerKali || 0) + 1; const t = kontak('pager', 2, 0); if (S.f.pagerKali === 2) return t + ' Operator pager menanyakan nama lengkapmu, katanya untuk data pelanggan.'; if (S.f.pagerKali >= 3) { apply({ jejak: 15 }); return t + ' Seminggu kemudian kamu tahu: operator pager itu melaporkan pesan-pesanmu ke polisi.'; } return t; } },
  kurir: { kel: 'Kontak pusat', t: 'Kontak pusat lewat kurir', d: 'lambat, lewat banyak tangan', run: () => kontak('kurir', 0, 2) },
  surat: { kel: 'Kontak pusat', t: 'Kontak pusat lewat surat berkode', d: 'surat berkode, belum tentu sampai', run: () => Math.random() < 0.25 ? 'Suratmu tidak pernah sampai.' : kontak('surat', 0, 1) },
  email: { kel: 'Kontak pusat', t: 'Kontak pusat lewat email lab kampus', d: 'dari lab kampus yang ramai', req: () => KOTA[S.m.kota].kampus, run: () => { apply({ tekanan: 5 }); return kontak('email', 4, 0); } },
  coret: { kel: 'Tanda perlawanan', aksi: true, t: 'Coret tembok dan gerbong kereta', d: 'stensil anti pemerintah, malam-malam', run: () => coret() },
  tulis: { kel: 'Tanda perlawanan', aksi: true, t: 'Tulis di media dengan nama samaran', d: 'opini di majalah alternatif dan buletin berantai', req: () => aktif('laras') || KOTA[S.m.kota].kampus, run: () => tulis() },
  gerak: { kel: 'Tanda perlawanan', aksi: true, t: 'Gerakkan aksi bersama warga dan mahasiswa', d: 'puluhan sampai ratusan orang, lewat kontak minggu ini', run: () => gerak() },
  pindah: { kel: 'Bertahan hidup', t: 'Pindahkan kawan yang paling ketakutan', d: () => saudara('wahyu') ? 'Wahyu menyetir, gratis' : rp(harga(20000)), req: () => jaringan().some(id => (S.takut[id] || 0) >= 40), run: () => pindahkan() },
  dialog: { kel: 'Undangan dialog menteri', t: 'Kirim wakil ke dialog dengan menteri', d: 'banyak kampus menolak datang', req: () => S.m.minggu === 2 && !S.f.dialogDipilih, run: () => { S.f.dialogDipilih = 'kirim'; apply({ pengaruh: 5, yudi: 1, massa: -4, kuasa: 1 }); return 'Wakilmu duduk di meja dialog dengan menteri pada 15 April. Pengaruhmu di ruang-ruang resmi naik, tapi kampus-kampus lain mencap barisanmu kompromis.'; } },
  tolakdialog: { kel: 'Undangan dialog menteri', t: 'Tolak undangan dialog bersama kampus lain', d: 'pernyataan sikap bersama', req: () => S.m.minggu === 2 && !S.f.dialogDipilih, run: () => { S.f.dialogDipilih = 'tolak'; apply({ massa: 4, pengaruh: -2, kuasa: -2 }); return 'Kamu ikut menandatangani penolakan dialog. Barisan antarkampus makin rapat, tapi pintu lobi tertutup untukmu.'; } },
  uang: { kel: 'Bertahan hidup', t: 'Cari uang', d: 'kuli angkut di pasar', run: () => { const u = harga(40000); apply({ uang: u, jejak: 5 }); return `Kamu menjadi kuli angkut di pasar. Upahnya ${rp(u)}.`; } },
  ktp: { kel: 'Bertahan hidup', t: 'Urus KTP palsu', d: () => rp(S.f.yosBerutang ? harga(37500) : harga(75000)), req: () => KOTA[S.m.kota].jaringan && !S.f.ktpPalsu, run: () => { const c = S.f.yosBerutang ? harga(37500) : harga(75000); if (!bayar(c)) return 'Uangmu tidak cukup untuk KTP palsu.'; S.f.ktpPalsu = true; return S.f.yosBerutang ? 'Bang Yos menepati utangnya. KTP atas nama Joko Susilo jadi dalam dua hari, separuh harga.' : 'KTP atas nama Joko Susilo jadi dalam tiga hari.'; } },
  keluarga: { kel: 'Bertahan hidup', t: 'Kabari keluarga', d: 'telepon ke rumah', run: () => { apply({ ibu: 1, nyali: 5, jejak: S.m.kota === 'magelang' ? 4 : 10 }); return 'Suara Ibu bergetar di telepon. Ia tidak bertanya kamu di mana.'; } }
};
function kontak(ch, jj, hops) { apply({ jejak: jj, massa: 2, pengaruh: 2 }); S.m.kontak = ch; S.m.hops = hops + KOTA[S.m.kota].jarak; return `Kontak lewat ${ch} tersambung. Kawan-kawan di pusat tahu kamu masih ada.`; }
TOPIK.instruksi = {
  truth: s => s.m.hasilAksi,
  benar: (s, t) => t === 'baik' ? 'Aksi kemarin berjalan seperti yang kamu minta. Barisan rapi.' : 'Aksi kemarin ricuh. Beberapa kawan ditangkap.',
  salah: (s, t) => t === 'baik' ? 'Aksi kemarin ricuh. Beberapa kawan ditangkap.' : 'Aksi kemarin berjalan lancar.'
};
// aksi saat buron, dari yang paling kecil risikonya: coretan, tulisan, sampai menggerakkan orang
function tenangkanSemua(n) { S.takut = S.takut || {}; for (const id of jaringan()) S.takut[id] = clamp((S.takut[id] || 0) + n, 0, 100); }
function coret() {
  apply({ iklim: 2, jejak: 3, kuasa: -1 }); tenangkanSemua(-5);
  if (Math.random() < 0.1) { apply({ kuasa: 3 }); S.m.tertangkap = 'Ronda kampung memergokimu dengan kaleng cat di tangan. Mereka menyerahkanmu ke Koramil.'; return 'Kamu menyemprotkan stensil TURUNKAN HARGA, TURUNKAN PRESIDEN di tembok jembatan.'; }
  return 'Kamu menyemprotkan stensil TURUNKAN HARGA, TURUNKAN PRESIDEN di tembok jembatan dan gerbong kereta. Paginya orang-orang di halte membicarakannya.';
}
function tulis() {
  const n = S.f.tulisKali = (S.f.tulisKali || 0) + 1;
  apply({ tekanan: 6 + (saudara('laras') ? 3 : 0), iklim: 3, jejak: 6 + 4 * (n - 1), kuasa: -3 }); tenangkanSemua(-5);
  return 'Tulisanmu dimuat dengan nama samaran di majalah alternatif dan beredar sebagai fotokopi.' + (saudara('laras') ? ' Laras menyunting dan mengirimnya ke kantor berita luar negeri.' : '') + (n >= 2 ? ' Seorang redaktur bilang gaya tulisanmu mudah dikenali.' : '');
}
function gerak() {
  const gagal = bocor();
  if (!S.m.kontak) S.m.hops = 2 + KOTA[S.m.kota].jarak;
  // makin banyak perantara, makin besar peluang perintahmu diubah di jalan tanpa kamu tahu
  const ubah = !gagal && Math.random() < Math.min(0.6, 0.1 * S.m.hops);
  const razia = gagal || (!ubah && Math.random() < 0.3);
  S.m.hasilAksi = razia ? 'buruk' : 'baik';
  const tangkap = [];
  if (razia) for (const k of kaderAktif()) if (k !== S.penyusup && Math.random() < 0.5) { S.kader[k] = 'ditangkap'; tangkap.push(KADER[k].nama); }
  apply(gagal ? { massa: -5, sorotan: 6, ricuh: 1, jejak: 15, kuasa: 4 } : ubah ? { massa: 4, iklim: 2, jejak: 8, kuasa: -2 } : { massa: 10 + (S.m.kota === 'surabaya' && saudara('asep') ? 5 : 0), pengaruh: 5, iklim: 5, jejak: 15, ricuh: razia ? 1 : 0, kuasa: razia ? 2 : -6 });
  tenangkanSemua(razia ? 20 : -15);
  const e = kabar('instruksi', S.m.kontak === 'kurir' || !S.m.kontak ? 'kurir' : 'laras', S.m.hops || 0);
  return `Kamu menggerakkan aksi bersama warga dan mahasiswa di ${KOTA[S.m.kota].t}.` + (gagal ? ' Rencananya bocor. Aparat sudah menunggu di titik kumpul.' : '') + (ubah ? ' Di jalan, perintahmu berubah menjadi aksi diam yang kecil. Kamu baru tahu belakangan.' : '') + (tangkap.length ? ` Razia menyapu barisan, dan ${tangkap.join(', ')} ikut ditangkap.` : '') + (S.m.hops >= 2 ? ` Pesanmu melewati ${S.m.hops} perantara.` : '') + ` Kabar yang kembali: “${e.teks}”`;
}
// jaringan yang harus dijaga selama buron: kader aktif dan senior yang belum tertangkap
const seniorTangkap = id => (S.f.seniorTangkap || []).includes(id);
const jaringan = () => kaderAktif().concat(['ratna', 'fikri', 'yudi'].filter(id => !seniorTangkap(id)));
const namaJaringan = id => KADER[id] ? KADER[id].nama : SENIOR[id];
const jumlahTangkap = () => Object.values(S.kader).filter(st => st === 'ditangkap').length + (S.f.seniorTangkap || []).length;
function takutAwal(id) { return clamp(30 + 10 * jumlahTangkap() - 5 * (KADER[id] ? dekat(id) : S[id]), 0, 100); }
function jaringanMinggu(m) {
  S.takut = S.takut || {};
  const naik = 10 + 5 * jumlahTangkap() + Math.floor(S.jejak / 10) - (S.protokol.includes('kolektif') ? 3 : 0);
  for (const id of jaringan()) S.takut[id] = clamp((S.takut[id] ?? takutAwal(id)) + naik, 0, 100);
  m.panik = jaringan().filter(id => S.takut[id] >= 70).sort((a, b) => S.takut[b] - S.takut[a]).slice(0, 2);
  // makin banyak kawan yang tertangkap, makin besar peluang salah satunya menyebut kotamu
  const p = 0.06 * jumlahTangkap() + (penyusupAktif() ? 0.1 : 0) - (S.f.ktpPalsu ? 0.03 : 0);
  if (Math.random() < p) { S.f.lokasiBocor = true; apply({ jejak: 20 }); m.out.push('Kurir membawa kabar buruk: seorang kawan yang tertangkap menyebut kota tempatmu bersembunyi.'); }
}
function mulaiTenang(m) {
  const id = m.panik.shift();
  if (!id) { m.step = 'aksi'; m.mg = null; return; }
  m.step = 'jaringan'; m.mg = buatMain(9, 'tenang_' + id, 1); m.mg.jenis = 'obrolan'; m.mg.siapa = id;
}
function selesaiTenang(m) {
  const g = m.mg, id = g.siapa, nama = namaJaringan(id);
  if (g.hasil.ok) { S.takut[id] = clamp(S.takut[id] - 40, 0, 100); apply({ nyali: 3 }); m.out.push(`${nama} akhirnya tidur malam itu. Menenangkan orang lain ternyata ikut menenangkanmu.`); }
  else if (KADER[id]) {
    if (tingkat(id) >= 1) { S.kader[id] = 'keluar'; m.out.push(`${nama} kabur ke kampungnya tanpa pamit.`); }
    else { S.kader[id] = 'ditangkap'; apply({ kuasa: 2 }); m.out.push(`${nama} menyerahkan diri ke Polsek. Ia tahu terlalu banyak.`); }
  } else {
    S.f.seniorTangkap = (S.f.seniorTangkap || []).concat(id); apply({ kuasa: 3 });
    m.out.push(`${nama} keluar dari persembunyian dan ditangkap di jalan.` + (id === 'ratna' ? ' Jaringan LSM-nya di luar negeri ikut terputus.' : id === 'yudi' ? ' Pager-nya disita, dan jalur pager ke pusat mati.' : ' Kawan-kawan kehilangan orang yang menenangkan mereka.'));
    if (id === 'fikri') apply({ nyali: -10 });
  }
  mulaiTenang(m);
}
function pindahkan() {
  const id = jaringan().sort((a, b) => (S.takut[b] || 0) - (S.takut[a] || 0))[0], nama = namaJaringan(id);
  if (!saudara('wahyu') && !bayar(harga(20000))) return 'Uangmu tidak cukup untuk memindahkan siapa pun.';
  S.takut[id] = clamp(S.takut[id] - 30, 0, 100);
  if (S.m.kontak === 'kurir' && Math.random() < 0.15) { apply({ jejak: 10 }); return `${nama} kamu pindahkan lewat kurir ke kota lain. Kurirnya diikuti, dan jejakmu ikut terbaca.`; }
  return `${nama} kamu pindahkan ke rumah kenalan di kota lain.` + (saudara('wahyu') ? ' Wahyu menyetir semalaman tanpa mau dibayar.' : '');
}
const MINGGU = ['6–12 April 1998', '13–19 April 1998', '20–26 April 1998', '27 April – 3 Mei 1998', '4–10 Mei 1998'];
MODES.buron = {
  enter(n) {
    const w = S.f.buronResume || 1; delete S.f.buronResume;
    S.m = { minggu: w, kota: S.f.kotaBuron || 'jakarta', step: 'kota', pilih: [], out: [], jejakKota: S.f.jejakKota || [], kontak: null, ev: null };
    mingguBaru(S.m);
  },
  panel(n) {
    const m = S.m;
    let h = meta(n, `minggu ${m.minggu} dari 5 · ${MINGGU.at(m.minggu - 1)}`) + (m.minggu === 1 && m.step === 'kota' ? prose(n) : '') + lookHTML(n);
    h += `<p class="label">Kota sekarang: ${KOTA[m.kota].t} · KTP palsu: ${S.f.ktpPalsu ? 'ada' : 'belum'}</p>`;
    const jr = jaringan();
    if (jr.length) h += `<div class="obs"><p class="label">Jaringanmu</p><ul class="rules">${jr.map(id => { const t = (S.takut || {})[id] || 0; return `<li>${namaJaringan(id)} · ${t >= 70 ? '<b class="bad">panik, ingin menyerah</b>' : t >= 40 ? 'tidak bisa tidur' : 'bersembunyi, masih tenang'}</li>`; }).join('')}</ul></div>`;
    if (m.step === 'jaringan') return h + (m.out.length ? `<ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul>` : '') + panelMain(m);
    if (m.step === 'kota') return h + kabarHTML() + pilihanHTML(Object.entries(KOTA).map(([id, k]) => ({ a: 'kota', v: id, t: id === m.kota ? 'Tetap di ' + k.t : 'Pindah ke ' + k.t, d: k.d + (id === m.kota ? '' : ' · ongkos ' + rp(harga(k.ongkos))), kel: id === m.kota ? null : 'Pindah kota' })), 'Minggu ini kamu ada di mana?');
    if (m.step === 'aksi') return h + (m.out.length ? `<ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul>` : '') + pilihanHTML(Object.entries(AKSI_BURON).filter(([id, x]) => (!x.req || x.req()) && !m.pilih.includes(id)).map(([id, x]) => ({ a: 'aksi', v: id, t: x.t, d: val(x.d), kel: x.kel })), `Pilih tindakan ${m.pilih.length + 1} dari 3${m.pilih.some(id => AKSI_BURON[id].aksi) ? '' : ' · gerakan butuh tanda bahwa kamu masih ada'}`);
    const jen = m.ev && m.ev.jenewa ? `<div class="ask"><p class="label">Kesempatan ke Jenewa</p><ol class="choices"><li><button type="button" class="choice" data-a="jenewa" data-v="pergi"${jenewaBisa() ? '' : ' disabled'}><span class="key">A</span><span>Berangkat sendiri ke Jenewa<small>${jenewaBisa() ? 'tiket ditanggung LSM' : jenewaAlasan()}</small></span></button></li><li><button type="button" class="choice" data-a="jenewa" data-v="kirim"${aktif('laras') || S.ratna >= 3 ? '' : ' disabled'}><span class="key">B</span><span>Kirim ${aktif('laras') ? 'Laras' : 'Kak Ratna'} sebagai gantimu<small>kamu tetap bersembunyi di sini</small></span></button></li><li><button type="button" class="choice" data-a="jenewa" data-v="tidak"><span class="key">C</span><span>Tidak usah</span></button></li></ol></div>` : `<button type="button" class="btn" data-a="minggu">${m.minggu < 5 ? 'Minggu berikutnya' : 'Pulang ke Jakarta'}</button>`;
    return h + `<section class="result" tabindex="-1"><ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul>${m.ev ? `<div class="event"><p class="label">Minggu ini</p><p>${m.ev.t}</p></div>` : ''}${deltasHTML(m.deltas)}${jen}</section>`;
  },
  act(n, a, v) {
    const m = S.m;
    if (a === 'kota' && m.step === 'kota') {
      m.b = snap(); m.out = [];
      if (v !== m.kota) {
        const c = harga(KOTA[v].ongkos);
        if (!bayar(c)) { m.out.push(`Ongkos ke ${KOTA[v].t} tidak cukup. Kamu tetap di ${KOTA[m.kota].t}.`); v = m.kota; }
        else { m.kota = v; m.out.push(`Kamu naik ${v === 'medan' ? 'kapal' : pick(['bus malam', 'kereta ekonomi'])} ke ${KOTA[v].t}.`); if (Math.random() < 0.4) { if (S.f.ktpPalsu) { apply({ jejak: jejakRazia(3) }); m.out.push('Ada razia KTP di terminal. KTP palsumu lolos, meski petugas menatapmu agak lama.' + isyaratRazia()); } else { apply({ jejak: jejakRazia(15) }); m.out.push('Ada razia KTP di terminal. Tanpa KTP palsu, kamu harus menyelinap lewat pintu samping, dan seorang petugas mencatat ciri-cirimu.' + isyaratRazia()); } } }
      }
      m.jejakKota.push(m.kota); S.f.jejakKota = m.jejakKota; S.f.kotaBuron = m.kota;
      apply({ jejak: (m.minggu === 5 && m.kota === 'medan') ? 15 : KOTA[m.kota].risiko });
      if (m.kota === m.razia) { apply({ jejak: jejakRazia(S.f.ktpPalsu ? 8 : 15) }); m.out.push(`Razia besar menyisir ${KOTA[m.kota].t} minggu ini.` + (S.ui.kabar[0].ok ? ' Pusat sudah memperingatkanmu.' : ' Kabar yang sampai kepadamu menyebut kota lain.') + isyaratRazia()); }
      const e = KOTA[m.kota].minggu(); apply(e.fx); m.out.push(e.t);
      if (yosAda(S)) { apply({ jejak: -2 }); if (m.minggu === 1) m.out.push('Bang Yos mengirim alamat-alamat yang dulu menyembunyikannya. Pintu-pintu itu terbuka untukmu tanpa banyak tanya.'); }
      if (S.damar >= 3 && !S.f.damarHilangPermanen) { apply({ jejak: -3 }); if (m.minggu === 1) m.out.push('Nama Bang Damar membuka pintu rumah-rumah aman di kota ini. Kawan lamanya menyimpanmu tanpa banyak bertanya.'); }
      if (S.uang.utang > 0) { const bg = Math.round(S.uang.utang * BUNGA_LINTAH / 4); S.uang.utang += bg; m.out.push(`Bunga lintah darat minggu ini: utangmu bertambah ${rp(bg)}.`); }
      const biaya = m.kota === 'magelang' && !rumahDiawasi() ? 0 : harga(10000);
      if (biaya) { m.out.push(`Makan dan penginapan murah minggu ini: −${rp(biaya)}.`); bayarWajib(biaya, m.out); }
      m.kontak = null; m.pilih = []; jaringanMinggu(m); mulaiTenang(m); return render();
    }
    if (m.step === 'jaringan') {
      const g = m.mg;
      if (a === 'mg' && !g.hasil) { jawabMain(g, v); return render('.mg'); }
      if (a === 'mglanjut' && g.hasil) { selesaiTenang(m); return render(); }
      return;
    }
    if (a === 'aksi' && m.step === 'aksi' && AKSI_BURON[v] && !m.pilih.includes(v) && (!AKSI_BURON[v].req || AKSI_BURON[v].req())) {
      m.pilih.push(v); S.m.kontak = m.kontak; m.out.push(AKSI_BURON[v].run());
      m.kontak = S.m.kontak;
      if (m.pilih.length < 3 && !m.tertangkap) return render();
      if (!m.pilih.some(id => AKSI_BURON[id].aksi)) { apply({ pengaruh: -5, kuasa: 3 }); tenangkanSemua(10); m.out.push('Seminggu tanpa satu pun tanda perlawanan. Di pusat, orang-orang mulai bertanya apakah kamu sudah menyerah.'); }
      if (m.tertangkap) { m.out.push(m.tertangkap); S.f.kembaliKe = 'b12_buron'; S.f.buronResume = Math.min(5, m.minggu + 1); S.f.tertangkapBuron = true; S.f.kotaBuron = m.kota; return go('periksa'); }
      m.ev = mingguEvent(m.minggu); if (m.ev.fx) apply(m.ev.fx);
      m.deltas = diff(m.b); m.step = 'hasil';
      if (S.jejak >= 100) { S.f.kembaliKe = 'b12_buron'; S.f.buronResume = Math.min(5, m.minggu + 1); S.f.tertangkapBuron = true; S.jejak = 60; return go('periksa'); }
      return render('.result');
    }
    if (a === 'jenewa' && m.ev && m.ev.jenewa) {
      if (v === 'pergi' && jenewaBisa()) { S.f.buronResume = 4; S.f.kotaBuron = m.kota; return go('b13_bandara'); }
      if (v === 'kirim') { apply({ tekanan: 20, sorotan: -5, kuasa: -5 }); m.out.push(`${aktif('laras') ? 'Laras' : 'Kak Ratna'} berangkat ke Jenewa membawa daftar nama orang hilang.`); }
      m.ev.jenewa = false; return render();
    }
    if (a === 'minggu' && m.step === 'hasil' && !(m.ev && m.ev.jenewa)) {
      const ujung = m.minggu >= 5 ? (S.f.diLuar ? 'jauh' : 'b14_terminal') : null;
      // tidak bisa menemukanmu, mereka mendatangi keluargamu dulu
      if (terorJatuh(true)) { S.f.kembaliKe = ujung || 'b12_buron'; if (!ujung) S.f.buronResume = m.minggu + 1; S.f.kotaBuron = m.kota; S.f.terorBuron = true; return go('teror'); }
      if (ujung) return go(ujung);
      m.minggu++; m.step = 'kota'; m.ev = null; mingguBaru(m); return render();
    }
  },
  actions() {
    const m = S.m;
    if (m.step === 'kota') return Object.keys(KOTA).map(id => ({ a: 'kota', v: id }));
    if (m.step === 'jaringan') return aksiBotMain(m.mg);
    if (m.step === 'aksi') return Object.entries(AKSI_BURON).filter(([id, x]) => (!x.req || x.req()) && !m.pilih.includes(id)).map(([id]) => ({ a: 'aksi', v: id }));
    if (m.ev && m.ev.jenewa) return [{ a: 'jenewa', v: 'tidak' }].concat(jenewaBisa() ? [{ a: 'jenewa', v: 'pergi' }] : []).concat(aktif('laras') || S.ratna >= 3 ? [{ a: 'jenewa', v: 'kirim' }] : []);
    return [{ a: 'minggu' }];
  }
};
const jenewaBisa = () => S.f.paspor && S.uang.usd >= 50 && ((S.ratna >= 3 && !seniorTangkap('ratna')) || aktif('laras'));
const jenewaAlasan = () => !S.f.paspor ? 'kamu tidak punya paspor' : S.uang.usd < 50 ? 'simpanan dolarmu kurang dari USD 50' : 'kamu tidak punya kontak LSM internasional';
function mingguEvent(w) {
  const k = S.m.kota;
  if (w === 1) return { t: 'Radio swasta menyebut aksi mahasiswa mulai menyebar ke kampus-kampus di luar Jawa.', fx: { iklim: 3 } };
  if (w === 2) return { t: 'Lewat kontak lama Kak Ratna, datang tawaran: sidang Komisi HAM PBB di Jenewa masih berlangsung sampai akhir April.', jenewa: true };
  if (w === 3) {
    if (S.f.damarBenar || S.f.damarLapor) { if (!S.bukti.includes('saksiSel')) S.bukti.push('saksiSel'); return { t: 'Seorang aktivis kampus lain yang baru dilepas bersaksi di LBH: selama disekap, ia mendengar suara Bang Damar dari sel sebelah. Dua hari kemudian, rumah saksi itu didatangi orang tak dikenal.', fx: { nyali: -2, tekanan: 3 } }; }
    return { t: 'Kurir membawa kabar: tiga kawan dari kampus lain ditangkap di Jakarta minggu ini. Dika menulis surat ke alamat samaranmu, menanyakan kapan kamu pulang.', fx: { nyali: -4, kagum: 1 } };
  }
  if (w === 4) {
    // tekanan pembebasan: kasus yang dibawa ke publik, dilaporkan resmi, punya saksi, dan diliput dunia
    const skor = (S.f.damarPublik ? 1 : 0) + (S.f.damarLapor ? 1 : 0) + (S.f.damarBenar ? 1 : 0) + (S.bukti.includes('saksiSel') ? 1 : 0) + Math.min(2, Math.floor(S.tekanan / 25));
    S.f.damarDilepas = skor >= 3;
    if (!S.f.damarDilepas) S.f.damarHilangPermanen = true;
    return S.f.damarDilepas ? { t: 'Kabar dari LBH: status Bang Damar berubah. Ia tercatat ditahan resmi di Polda, dan pengacara boleh menjenguknya. Akhir April ia dilepas. Ia hidup, tapi belum mau bicara.', fx: { nyali: 10, damar: 1 } } : { t: 'Tidak ada kabar tentang Bang Damar. Tidak ada kantor yang mengaku menahannya, dan orang-orang yang hilang bersamanya juga belum kembali.', fx: { nyali: -8 } };
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
  if (!S.f.daftarDisita) r.push({ id: 'nama', t: sel ? 'Dua nama kader' : 'Nama semua kadermu', exp: 1e9 });
  if (ri >= 3) r.push({ id: 'aksi', t: 'Rencana aksi berikutnya', exp: 1e9 });
  if (ri >= 4) r.push({ id: 'dana', t: 'Sumber dana gerakan', exp: 1e9 });
  if (S.bukti.includes('catatanDamar')) r.push({ id: 'kontakDamar', t: 'Kontak jaringan Damar', exp: 1e9 });
  return r;
}
function bocorkan(id) {
  if (S.bocor.includes(id)) return '';
  S.bocor.push(id); apply({ kuasa: 2 });
  if (id === 'kode') apply({ sorotan: 10 });
  if (id === 'safehouse') { S.f.safehouseBocor = true; const k = kaderAktif().at(0); if (k) S.kader[k] = 'diawasi'; }
  if (id === 'buruh') apply({ massa: -10 });
  if (id === 'nama') { const ks = kaderAktif().slice(0, S.protokol.includes('sel') ? 1 : 2); ks.forEach(k => { S.kader[k] = 'ditangkap'; }); apply({ massa: -5 }); }
  if (id === 'aksi') S.f.aksiBocor = true;
  if (id === 'dana') apply({ massa: -10, pengaruh: -5 });
  if (id === 'kontakDamar') apply({ damar: -2 });
  return rahasiaList().find(x => x.id === id)?.t || id;
}
// tertangkap saat penyusup masih di dalam: mereka sudah tahu semuanya, jadi pulang hanya bisa ditebus mahal
const TEBUS = {
  nama: { t: 'Sebut nama kader yang belum mereka punya', d: 'mereka menyodorkan kertas kosong dan pulpen', req: () => kaderAktif().some(k => k !== S.penyusup), run: () => { const ks = kaderAktif().filter(k => k !== S.penyusup); ks.forEach(k => { S.kader[k] = 'ditangkap'; }); if (!S.bocor.includes('nama')) S.bocor.push('nama'); apply({ massa: -15 }); return `Kamu menyebut ${ks.map(k => KADER[k].nama).join(', ')}. Malam itu juga mereka dijemput satu per satu.`; } },
  lapor: { t: 'Tanda tangani pernyataan keluar dari gerakan', d: 'surat bermeterai sudah disiapkan', run: () => { apply({ pengaruh: -25, bapak: -1, nyaliMax: -15, wajibLapor: true }); return 'Kamu menandatangani pernyataan bermeterai. Bapak dipanggil dari Magelang untuk ikut menandatangani sebagai penjamin. Ia tidak menatapmu sama sekali.'; } },
  informan: { t: 'Setuju menjadi informan mereka', d: 'mereka menyodorkan selembar nomor telepon', run: () => { apply({ informan: true }); return 'Mereka memberimu nomor telepon dan jadwal: setiap Kamis pukul tujuh malam. Kamu pulang malam itu juga, dan tidak ada yang bertanya bagaimana caranya.'; } },
  diam: { t: 'Tetap diam', d: 'kamu menatap jam dinding' }
};
const tebusBisa = () => Object.keys(TEBUS).filter(k => !TEBUS[k].req || TEBUS[k].req());
MODES.interogasi = {
  enter(n) {
    let N = n.jenis === 'resmi' ? 4 : 6;
    if (n.jenis === 'resmi') { if (aktif('tigor') || S.ratna >= 3) N--; if (aktif('laras') || S.f.damarPublik) N--; if (S.fak === 'Hukum') N--; }
    if (saudara('tigor')) N--;
    // bukti di tasmu ikut tertangkap dan dipakai untuk menekanmu
    const sita = S.f.bawaBukti && S.bukti.length ? sitaBukti(S.bukti) : [];
    S.f.bawaBukti = false; S.f.sitaKali = sita.length;
    const taktik = sita.length ? `Interogator menumpahkan isi tasmu ke meja: ${sita.map(b => (BUKTI[b] || b).toLowerCase()).join(', ')}. “Ini semua punya siapa?”` : genderKu() === 'P' ? 'Interogator memakai ancaman yang hanya ditujukan kepada tahanan perempuan. Kamu menatap jam dinding dan menghitung detiknya.' : n.jenis === 'resmi' && S.fak === 'Hukum' ? 'Kamu menyebut hak-hakmu menurut KUHAP, pasal demi pasal, seperti di ruang kuliah. Pemeriksa saling pandang.' : pick(TAKTIK);
    S.f.ditebusKali = false;
    S.m = { r: 0, N: Math.max(2, N) + (sita.length ? 1 : 0), jam: 0, ket: S.nyali - (genderKu() === 'P' ? 10 : 0) + 3 * paham('bumi'), secrets: rahasiaList(), res: null, taktik, selesai: false, dikhianati: penyusupAktif() };
  },
  panel(n) {
    const m = S.m, step = n.jenis === 'resmi' ? 12 : 24;
    let h = meta(n, m.dikhianati ? '' : `ronde ${Math.min(m.r + 1, m.N)} dari ${m.N}`) + (m.r === 0 && !m.res ? prose(n) : '');
    if (S.ui.last) return h + resultHTML();
    if (m.dikhianati) return h + `<div class="prose"><p>Interogator membacakan jadwal rapat kalian, kode telepon, warna gelang, dan alamat yang hanya diketahui lingkaran dalam. Semuanya benar.</p><p>“Kami tidak butuh pengakuanmu. Kawanmu sudah cerita semuanya. Kalau mau pulang, ada harganya.”</p></div>` + `<div class="ask"><ol class="choices">${tebusBisa().map((k, i) => `<li><button type="button" class="choice" data-a="tebus" data-v="${k}"><span class="key" aria-hidden="true">${'ABCD'[i]}</span><span>${TEBUS[k].t}<small>${TEBUS[k].d}</small></span></button></li>`).join('')}</ol></div>`;
    h += `<p class="label">Jam ke-${m.jam}</p>` + `<div class="marah"><span class="label">Ketahananmu</span><div class="meter"><i style="width:${clamp(m.ket, 0, 100)}%"></i></div></div>`;
    if (m.res) return h + `<section class="result" tabindex="-1">${[].concat(m.res).map(p => `<p>${p}</p>`).join('')}<button type="button" class="btn" data-a="rn">Lanjut</button></section>`;
    const sec = m.secrets.map(x => `<li>${x.t}${S.bocor.includes(x.id) ? ' · <b class="bad">sudah bocor</b>' : m.jam >= x.exp ? ' · <b class="good">sudah kedaluwarsa</b>' : x.exp < 1e9 ? ` · kedaluwarsa jam ke-${x.exp}` : ''}</li>`).join('');
    const opsi = [['diam', 'Diam', 'tatap jam dinding']].concat(kutipan() ? [['kutip', 'Diam sambil mengulang kutipan dari buku dalam hati', 'satu kalimat, berulang-ulang']] : []).concat([['palsu', 'Beri info palsu', 'mereka mungkin mengeceknya']]).concat(m.secrets.filter(x => !S.bocor.includes(x.id)).map(x => ['basi:' + x.id, `Beri info soal ${x.t.toLowerCase()}`, ''])).concat([['semua', 'Bocorkan semua', 'supaya lampu dimatikan']]);
    return h + `<div class="prose"><p>${m.taktik}</p></div><div class="obs"><p class="label">Yang kamu tahu</p><ul class="rules">${sec}</ul></div>` + pilihanHTML(opsi.map(([v, t, d]) => ({ a: 'jawab', v, t, d, kel: v === 'palsu' || v.startsWith('basi:') ? 'Beri informasi' : null })));
  },
  act(n, a, v) {
    const m = S.m, step = n.jenis === 'resmi' ? 12 : 24;
    if (S.ui.last) return;
    if (m.dikhianati) {
      if (a !== 'tebus' || !tebusBisa().includes(v)) return;
      if (v === 'diam') { S.f.diamDikhianati = true; return end(n.jenis === 'culik' ? 'dihilangkan' : 'dipenjara'); }
      m.tebusNote = TEBUS[v].run(); S.f.ditebusKali = true; return selesaiInterogasi(n);
    }
    if (a === 'rn' && m.res) { m.res = null; if (m.selesai) return selesaiInterogasi(n); m.taktik = pick(TAKTIK); return render(); }
    if (a !== 'jawab' || m.res) return;
    const lines = [];
    if (v === 'diam') { m.ket -= 15; lines.push('Kamu diam. Waktu dipotong: lampu itu menyala terus, dan kamu kehilangan hitungan jam.'); }
    else if (v === 'kutip') { m.ket -= 8; lines.push('Kamu mengulang satu kalimat dari buku itu di kepalamu, berkali-kali, sampai pertanyaan mereka terdengar jauh.'); }
    else if (v === 'palsu') { if (Math.random() < 0.4) { m.ket -= 25; lines.push('Mereka mengecek ceritamu dan tahu kamu berbohong. Malam itu panjang sekali.'); } else { m.ket -= 5; lines.push('Mereka mencatat ceritamu dan pergi mengeceknya.'); } }
    else if (v.startsWith('basi:')) { const x = m.secrets.find(s => s.id === v.slice(5)); if (!x) return; if (m.jam >= x.exp) lines.push(`Kamu menyebut ${x.t.toLowerCase()}. Sudah lewat ${x.exp} jam, kawan-kawan pasti sudah pindah. Mereka mencatatnya dengan puas, dan pulang dengan tangan kosong.`); else lines.push(`Kamu menyebut ${bocorkan(x.id).toLowerCase()}. Informasi itu masih berlaku.`); }
    else if (v === 'semua') { m.secrets.filter(x => m.jam < x.exp).forEach(x => bocorkan(x.id)); lines.push('Kamu menceritakan semuanya. Mereka mematikan lampu dan membiarkanmu tidur.'); m.selesai = true; }
    if (m.ket <= 0 && !m.selesai) { const sisa = m.secrets.filter(x => m.jam < x.exp && !S.bocor.includes(x.id)); if (sisa.length) lines.push(`Kamu patah. Mulutmu menyebut ${bocorkan(pick(sisa).id).toLowerCase()} sebelum kamu sempat menahannya.`); m.selesai = true; }
    m.jam += step; m.r++;
    if (m.r >= m.N) m.selesai = true;
    m.res = lines; render('.result');
  },
  actions() {
    const m = S.m;
    if (S.ui.last) return [{ a: 'next' }];
    if (m.dikhianati) return tebusBisa().map(v => ({ a: 'tebus', v }));
    if (m.res) return [{ a: 'rn' }];
    return [{ a: 'jawab', v: 'diam' }, { a: 'jawab', v: 'palsu' }, { a: 'jawab', v: 'basi:kode' }, { a: 'jawab', v: pick(['diam', 'semua', 'basi:nama']) }];
  }
};
function selesaiInterogasi(n) {
  const m = S.m, b = snap(), tebus = m.tebusNote ? [m.tebusNote] : [];
  S.nyali = clamp(Math.max(15, m.ket), 0, S.nyaliMax);
  if (n.jenis === 'culik') {
    if (m.tebusNote) { S.sorotan = 60; S.f.pernahDiculik = true; return setResult(null, tebus.concat('Suatu subuh, mobil berhenti dan pintunya dibuka. Kamu didorong keluar di pinggir jalan tol dengan mata masih tertutup.'), b, 'pasca'); }
    const lepas = S.f.damarPublik || S.massa >= 50 || S.tekanan >= 25 || aktif('laras');
    if (!lepas) return end('dihilangkan');
    S.sorotan = 60; S.f.pernahDiculik = true;
    return setResult(null, ['Suatu subuh, mobil berhenti dan pintunya dibuka. Kamu didorong keluar di pinggir jalan tol dengan mata masih tertutup.', 'Kawan-kawanmu tidak diam selama kamu hilang. Namamu ada di koran, di mimbar, dan di posko pengaduan.'], b, 'pasca');
  }
  S.sorotan = Math.max(40, S.sorotan - 20);
  setResult(null, tebus.length ? tebus.concat('Pintu dibuka sebelum subuh. Tidak ada yang memukulmu malam itu.') : ['Setelah ' + m.jam + ' jam, pintu dibuka. Kamu dilepas dengan wajib lapor setiap Senin, dan kamu tahu kamu tidak akan datang.'], b, 'pasca');
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
    const E = ENDINGS[S.ending] || ENDINGS.menolak_lupa, loss = kehilangan(), jejak = jejakPilihan(S);
    catatEnding(S.ending);
    return `<div class="intro"><p class="label">Akhir cerita · ${rankOf(S.pengaruh)}</p><h2 class="end-title">${E.judul}</h2></div><div class="prose">${[].concat(E.text(S)).concat(epilogTambahan()).map(p => `<p>${p}</p>`).join('')}</div>
      ${jejak.length ? `<div class="jejak"><p class="label">Yang membawamu sampai di sini</p>${jejak.map(t => `<p>${t}</p>`).join('')}</div>` : ''}
      <p class="label">Daftar kehilangan</p><div class="sheet"><table><tbody>${loss.map(l => `<tr><td><b>${l.siapa}</b></td><td>${l.cara}</td></tr>`).join('')}</tbody></table></div>
      ${E.fiksi ? '<aside class="sejarah"><p class="label">Catatan sejarah · ending fiksi</p><p>Dalam sejarah nyata, Presiden Soeharto mengundurkan diri pada 21 Mei 1998, setelah tawaran Komite Reformasi pada 19 Mei ditolak tokoh-tokoh yang diajak bergabung. Ending ini membayangkan apa yang terjadi kalau tekanan gerakan tidak cukup.</p></aside>' : ''}
      <aside class="sejarah"><p class="label">Catatan sejarah</p><p>Empat mahasiswa Trisakti tewas ditembak pada 12 Mei 1998. Tim Gabungan Pencari Fakta menemukan indikasi bahwa kerusuhan 13–15 Mei digerakkan secara terorganisir. Tiga belas aktivis yang diculik pada 1997–1998 sampai hari ini belum kembali. Kasus Semanggi I dan II belum dibawa ke pengadilan HAM.</p></aside>
      <div class="row">${adaBabak() ? '<button type="button" class="btn" data-a="ulangbabak">Ulangi babak ini</button>' : ''}<button type="button" class="btn${adaBabak() ? ' alt' : ''}" data-a="restart">Main lagi dari awal</button></div>${koleksiHTML()}`;
  },
  act() {},
  actions() { return []; }
};
