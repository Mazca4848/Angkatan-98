/* Angkatan 98 · mesin: state, ekonomi, rumor, render, simpan */
const SENIOR = { damar: 'Bang Damar', ratna: 'Kak Ratna', fikri: 'Bang Fikri', yudi: 'Mas Yudi' };
const LINE = { damar: 'aksi langsung', ratna: 'organisasi dan jaringan', fikri: 'gerakan moral', yudi: 'jalur dialog' };
const KADER = {
  laras: { nama: 'Laras', fak: 'Komunikasi', ahli: 'humas', pos: 'humas' },
  bimo: { nama: 'Bimo', fak: 'Kedokteran', ahli: 'medis', pos: 'medis' },
  wahyu: { nama: 'Wahyu', fak: 'Teknik', ahli: 'stensil, sopir', pos: 'tali' },
  mei: { nama: 'Mei', fak: 'Teknik', ahli: 'juru catat, jaringan kampus', pos: 'sweeping' },
  asep: { nama: 'Asep', fak: 'Ekonomi', ahli: 'penghubung buruh', pos: 'tali' },
  dimas: { nama: 'Dimas', fak: 'Sastra', ahli: 'orator', pos: 'humas' },
  tigor: { nama: 'Tigor', fak: 'Hukum', ahli: 'tim hukum', pos: 'hukum' }
};
const STATUS = { aktif: 'aktif', diawasi: 'diawasi', ditangkap: 'ditangkap', keluar: 'keluar', tewas: 'tewas', pergi: 'pergi ke luar negeri' };
const FAK = {
  Hukum: { kode: '01', bonus: 'Kak Ratna +1, Tigor lebih mudah direkrut', fx: { ratna: 1 } },
  Teknik: { kode: '02', bonus: 'Uang +Rp 30.000, kerja sambilan lebih besar', fx: { uang: 30000 } },
  Ekonomi: { kode: '03', bonus: 'kabar kurs lebih akurat', fx: {} },
  FISIP: { kode: '04', bonus: 'Bang Damar +1, Pengaruh +5', fx: { damar: 1, pengaruh: 5 } }
};
const RANKS = [[75, 'Presidium'], [55, 'Koordinator Lapangan'], [35, 'Kader Inti'], [15, 'Anggota'], [0, 'Mahasiswa Baru']];
const rankOf = p => RANKS.find(([m]) => p >= m)[1];
const rankIdx = () => 4 - RANKS.findIndex(([m]) => S.pengaruh >= m);
const LABEL = { pengaruh: 'Pengaruh', massa: 'Kepercayaan massa', nyali: 'Nyali', sorotan: 'Sorotan', jejak: 'Jejak', iklim: 'Iklim politik', tekanan: 'Tekanan internasional', ipk: 'IPK', tunai: 'Uang', usd: 'Dolar', barang: 'Barang', ...SENIOR, bapak: 'Bapak', ibu: 'Ibu', dika: 'Dika' };
const TRACK = Object.keys(LABEL);
const BAD_UP = ['sorotan', 'jejak'];
const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const ipkStr = v => v.toFixed(2).replace('.', ',');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = id => document.getElementById(id);
const cap = s => s[0].toUpperCase() + s.slice(1);
let S, BOT = false;
const val = (v, s = S) => typeof v === 'function' ? v(s) : v;
const pick = list => list.at(Math.floor(Math.random() * list.length));

/* ---------- ekonomi ---------- */
const KURS = { '1996-08': 2340, '1996-12': 2380, '1997-03': 2410, '1997-06': 2450, '1997-07': 2600, '1997-08': 3030, '1997-09': 3280, '1997-10': 3650, '1997-11': 3670, '1997-12': 4650, '1998-01': 10375, '1998-02': 8750, '1998-03': 8325, '1998-04': 7970, '1998-05': 10525, '1998-06': 14900, '1998-07': 13000, '1998-09': 10700, '1998-11': 7300, '1998-12': 8025, '1999-06': 6726, '1999-09': 8386, '1999-12': 7085, '2001-12': 10400, '2004-12': 9300, '2006-12': 9000 };
const INDEKS = { '1996-08': 1.0, '1997-01': 1.03, '1997-07': 1.06, '1997-09': 1.08, '1997-11': 1.12, '1997-12': 1.15, '1998-01': 1.25, '1998-02': 1.4, '1998-03': 1.47, '1998-04': 1.53, '1998-05': 1.6, '1998-07': 1.8, '1998-11': 1.96, '1999-06': 2.0, '2004-01': 2.6, '2006-01': 3.1 };
const lookup = (tab, b) => { let v; for (const k of Object.keys(tab).sort()) if (k <= b) v = tab[k]; return v ?? Object.values(tab)[0]; };
const kursAt = b => lookup(KURS, b);
const indeks = () => lookup(INDEKS, S.bulan);
const harga = base => Math.round(base * indeks() / 500) * 500;
function kiriman() {
  const r = S.rel.bapak;
  if (S.f.kirimanStop) { S.f.kirimanStop = false; return 0; }
  let k = r <= 0 ? 0 : r >= 3 ? 150000 : 150000 - (3 - r) * 30000;
  if (r === 5) k += 25000;
  if (S.f.kirimanSeparuh) k = Math.round(k / 2);
  if (S.f.suapKiriman) k += 60000;
  return k;
}
const monthsBetween = (a, b) => (Number(b.slice(0, 4)) - Number(a.slice(0, 4))) * 12 + Number(b.slice(5, 7)) - Number(a.slice(5, 7));
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const namaBulan = b => `${BULAN.at(Number(b.slice(5, 7)) - 1)} ${b.slice(0, 4)}`;
function bayar(n) {
  if (S.uang.tunai >= n) { S.uang.tunai -= n; return true; }
  return false;
}

/* ---------- kader ---------- */
const aktif = id => S.kader[id] === 'aktif' || S.kader[id] === 'diawasi';
const kaderAktif = () => Object.keys(S.kader).filter(aktif);
function rekrut(id) {
  if (S.kader[id] || kaderAktif().length >= 5) return false;
  S.kader[id] = 'aktif'; return true;
}
const penyusupAktif = () => aktif(S.penyusup) && !S.f.penyusupKetahuan;

/* ---------- rumor ---------- */
const SUMBER = {
  laras: { nama: 'Laras', base: 60 }, ratna: { nama: 'Kak Ratna', base: 55 }, fikri: { nama: 'Bang Fikri', base: 50 }, radio: { nama: 'Radio swasta', base: 50 },
  yudi: { nama: 'Mas Yudi', base: 45 }, kurir: { nama: 'Kurir', base: 40 }, rt: { nama: 'Pak RT', base: 40 }, damar: { nama: 'Anak-anak Damar', base: 35 },
  tvri: { nama: 'TVRI', base: 30 }, warung: { nama: 'Obrolan warung', base: 20 }, penyusup: { nama: 'kawan', base: 70 }, ekonomi: { nama: 'Catatan kurs', base: 55 }
};
function trustOf(src) {
  if (src in SENIOR) return S[src];
  if (src === 'laras') return aktif('laras') ? 4 : 1;
  if (src === 'rt') return S.f.dapurUmum ? 4 : 1;
  if (src === 'radio') return S.bekal.includes('radio') ? 2 : 0;
  if (src === 'penyusup') return 4;
  if (src === 'ekonomi') return S.fak === 'Ekonomi' ? 5 : 0;
  return 0;
}
const akurasi = (src, hops = 0) => clamp(SUMBER[src].base + 8 * trustOf(src) - 15 * hops, 10, 95);
const TOPIK = {};
function kabar(topik, src, hops = 0, penting = false) {
  const T = TOPIK[topik], truth = T.truth(S);
  let ok = Math.random() * 100 < akurasi(src, hops);
  if (src === 'penyusup' && penting) ok = false;
  const nama = src === 'penyusup' ? KADER[S.penyusup].nama : SUMBER[src].nama;
  const e = { topik, src, nama, teks: ok ? T.benar(S, truth) : T.salah(S, truth), ok, bulan: S.bulan, cek: false };
  S.kabar.push(e);
  return e;
}
const pips = n => '■'.repeat(n) + '□'.repeat(Math.max(0, 5 - n));

/* ---------- state ---------- */
function fresh() {
  return {
    node: 'intro', nama: 'Bagas Pratama', fak: 'Hukum', foto: 0, nim: '', bulan: '1996-08', kurs: 2340,
    pengaruh: 0, massa: 30, nyali: 50, nyaliMax: 100, sorotan: 5, jejak: 20, iklim: 10, ipk: 3, tekanan: 0, ricuh: 0, cap: 0,
    uang: { tunai: 20000, bank: 0, usd: 0, barang: 0 }, bankJenis: null, bankBeku: false,
    rel: { bapak: 3, ibu: 4, dika: 4 }, kagum: 0, tahu: 0,
    damar: 0, ratna: 0, fikri: 0, yudi: 0,
    kader: {}, penyusup: pick(['wahyu', 'asep', 'dimas']),
    buku: { baca: null, sisa: 0, selesai: [], dikos: [] }, bekal: [], protokol: [], bukti: [], kabar: [], bocor: [], hilang: [], siap: {},
    f: {}, seen: {}, ui: {}, m: {}, ending: null, log: []
  };
}
const CLAMP100 = ['pengaruh', 'massa', 'sorotan', 'jejak', 'iklim', 'tekanan'];
function apply(fx) {
  for (const [k, v] of Object.entries(fx || {})) {
    if (k === 'uang') S.uang.tunai = Math.max(0, S.uang.tunai + v);
    else if (k === 'usd' || k === 'barang' || k === 'bank') S.uang[k] = Math.max(0, S.uang[k] + v);
    else if (k === 'massa' && v > 0 && S.cap > 0) S.massa = clamp(S.massa + Math.ceil(v / 2), 0, 100);
    else if (CLAMP100.includes(k)) S[k] = clamp(S[k] + v, 0, 100);
    else if (k === 'nyali') S.nyali = clamp(S.nyali + v, 0, S.nyaliMax);
    else if (k === 'nyaliMax') { S.nyaliMax = clamp(S.nyaliMax + v, 30, 100); S.nyali = Math.min(S.nyali, S.nyaliMax); }
    else if (k === 'ipk') S.ipk = Math.round(clamp(S.ipk + v, 0, 4) * 100) / 100;
    else if (k in SENIOR) S[k] = clamp(S[k] + v, 0, 5);
    else if (k === 'bapak' || k === 'ibu' || k === 'dika') S.rel[k] = clamp(S.rel[k] + v, 0, 5);
    else if (k === 'kagum' || k === 'tahu' || k === 'ricuh') S[k] = Math.max(0, S[k] + v);
    else if (k === 'cap') S.cap = Math.max(S.cap, v);
    else if (k === 'kader') for (const id of [].concat(v)) rekrut(id);
    else if (k === 'bukti') for (const id of [].concat(v)) { if (!S.bukti.includes(id)) S.bukti.push(id); }
    else if (k === 'hilang') S.hilang.push(v);
    else S.f[k] = v;
  }
}
const snap = () => ({ ...Object.fromEntries(TRACK.map(k => [k, get(k)])), kader: { ...S.kader } });
function get(k) { if (k === 'tunai' || k === 'usd' || k === 'barang') return S.uang[k]; if (k in S.rel) return S.rel[k]; return S[k]; }
function diff(b) {
  const out = [];
  for (const k of TRACK) {
    const d = Math.round((get(k) - b[k]) * 100) / 100;
    if (!d) continue;
    const v = k === 'tunai' ? rp(Math.abs(d)) : k === 'ipk' ? ipkStr(Math.abs(d)) : k === 'usd' ? 'USD ' + Math.abs(d) : Math.abs(d);
    out.push([`${LABEL[k]} ${d > 0 ? '+' : '−'}${v}`, BAD_UP.includes(k) ? d > 0 : d < 0]);
  }
  for (const [id, st] of Object.entries(S.kader)) if (b.kader[id] !== st) out.push([st === 'aktif' && !b.kader[id] ? `Kader baru: ${KADER[id].nama}` : `${KADER[id].nama}: ${STATUS[st]}`, st !== 'aktif']);
  return out;
}

/* ---------- navigasi ---------- */
const NODES = {}, MODES = {}, ENDINGS = {};
const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function blinkThen(fn) {
  if (BOT || reduced) return fn();
  const stage = $('stage');
  if (!stage) return fn();
  stage.classList.add('shut');
  setTimeout(() => { fn(); requestAnimationFrame(() => stage.classList.remove('shut')); }, 240);
}
function go(id) {
  id = val(id);
  if (!NODES[id]) throw new Error('node tidak ada: ' + id);
  if (!S.ending && !NODES[id].aman) {
    if (S.nyali <= 0) { S.ending = 'patah'; id = 'akhir'; }
    else if (S.massa <= 0) { S.ending = 'barisan'; id = 'akhir'; }
    else if (S.sorotan >= 100 && !S.f.diLuar) { S.f.kembaliKe = id; id = 'culik'; }
  }
  const prev = NODES[S.node], n = NODES[id], moved = !prev || prev.scene !== n.scene;
  const doIt = () => {
    S.node = id; S.ui = {}; S.m = {};
    if (n.bulan) { S.bulan = n.bulan; S.kurs = kursAt(n.bulan); }
    if (n.enter) { const b = snap(); apply(val(n.enter)); S.ui.enterDelta = diff(b); }
    if (n.kabar) S.ui.kabar = n.kabar(S);
    const M = MODES[n.mode || 'story']; if (M.enter) M.enter(n);
    if (n.log) S.log.push(val(n.log));
    const q = S.bulan.slice(0, 4) + Math.floor((Number(S.bulan.slice(5, 7)) - 1) / 3);
    if (S.bekal.includes('foto') && S.nyali < 20 && !S.f['foto' + q]) { S.f['foto' + q] = true; apply({ nyali: 5 }); (S.ui.enterDelta = S.ui.enterDelta || []).push(['Foto keluarga di dompet: Nyali +5', false]); }
    save(); render(); if (moved && !BOT && typeof window !== 'undefined') window.scrollTo(0, 0);
  };
  moved ? blinkThen(doIt) : doIt();
}
function end(id) { S.ending = id; go('akhir'); }
function act(a, v) {
  const n = NODES[S.node], M = MODES[n.mode || 'story'];
  if (a === 'look') return look(v);
  if (a === 'acthot') return doAct(v);
  if (a === 'next') return go(S.ui.last.go);
  if (a === 'goto') return go(v);
  if (a === 'restart') { S = fresh(); clearSave(); return go('intro'); }
  if (a === 'ceksilang') { if (!S.ui.kabar || S.ui.cek) return; S.ui.cek = true; S.ui.kabar.forEach(e => { e.cek = true; }); if (!S.bekal.includes('catatan')) apply({ sorotan: 3 }); return render(); }
  if (a === 'lanjut') { const d = loadSave(); if (d) { S = d; return render(); } return; }
  return M.act(n, a, v);
}
const actions = () => { const n = NODES[S.node]; return MODES[n.mode || 'story'].actions(n); };

/* ---------- pengamatan ---------- */
function look(id) {
  const n = NODES[S.node], x = n.hots && n.hots[id];
  if (!x || S.ui.last || (x.req && !x.req(S))) return;
  const key = S.node + ':' + id;
  S.ui.obsDelta = null;
  if (!S.seen[key]) { S.seen[key] = 1; if (x.fx) { const b = snap(); apply(val(x.fx)); S.ui.obsDelta = diff(b); } }
  S.ui.obs = id;
  render('.obs');
}
function doAct(id) {
  const x = NODES[S.node].hots[id], key = 'act:' + S.node + ':' + id;
  if (!x.act || S.f[key] || (x.act.req && !x.act.req(S))) return;
  const b = snap(); apply(val(x.act.fx)); if (x.act.run) x.act.run(S); S.f[key] = true; S.ui.obsDelta = diff(b);
  render('.obs');
}

/* ---------- potongan panel ---------- */
const deltasHTML = ds => ds && ds.length ? `<ul class="deltas">${ds.map(([t, bad]) => `<li class="${bad ? 'bad' : 'good'}">${t}</li>`).join('')}</ul>` : '';
function meta(n, extra) {
  const head = n.bab != null ? `${typeof n.bab === 'number' ? 'Bab ' + n.bab : n.bab} · ${n.judul}` : n.judul;
  return `<p class="meta"><span>${head}</span><span>${val(n.waktu) || ''}${extra ? ' · ' + extra : ''}</span></p>` + deltasHTML(S.ui.enterDelta);
}
const prose = n => n.text ? `<div class="prose">${[].concat(val(n.text)).map(p => `<p>${p}</p>`).join('')}</div>` : '';
function kabarHTML() {
  const ks = S.ui.kabar;
  if (!ks || !ks.length) return '';
  return `<div class="kabar"><p class="label">Kabar yang sampai kepadamu</p>${ks.map(e => `<div class="kb"><b>${e.nama}</b> <span class="pips" title="Kepercayaanmu pada sumber">${e.src in SENIOR || e.src === 'laras' || e.src === 'rt' ? pips(trustOf(e.src)) : ''}</span><p>“${e.teks}”</p>${e.cek ? `<p class="cek ${e.ok ? 'good' : 'bad'}">${e.ok ? 'Cek silang: kabar ini benar.' : 'Cek silang: kabar ini meleset.'}</p>` : ''}</div>`).join('')}${S.ui.cek || S.ui.last ? '' : `<button type="button" class="chip" data-a="ceksilang">Cek silang ke sumber lain${S.bekal.includes('catatan') ? '' : ' (Sorotan +3)'}</button>`}</div>`;
}
function obsHTML(n) {
  const id = S.ui.obs, x = n.hots[id], key = 'act:' + S.node + ':' + id;
  let a = '';
  if (x.act) a = S.f[key] ? `<p>${val(x.act.note)}</p>` : (!x.act.req || x.act.req(S)) ? `<button type="button" class="chip" data-a="acthot" data-v="${id}">${x.act.t}</button>` : '';
  return `<div class="obs" tabindex="-1"><p class="label">Kamu mengamati: ${x.label}</p><p>${val(x.text)}</p>${deltasHTML(S.ui.obsDelta)}${a}</div>`;
}
function lookHTML(n) {
  const hs = Object.entries(n.hots || {}).filter(([, x]) => !x.req || x.req(S));
  if (S.ui.obs && n.hots[S.ui.obs]) return obsHTML(n) + chips(hs);
  return chips(hs);
}
const chips = hs => hs.length ? `<div class="look"><span class="label">Amati</span>${hs.map(([id, x]) => `<button type="button" class="chip${S.seen[S.node + ':' + id] ? ' seen' : ''}" data-a="look" data-v="${id}" aria-pressed="${S.ui.obs === id}">${x.label}</button>`).join('')}</div>` : '';
const visibleChoices = list => (list || []).map((c, i) => [c, i]).filter(([c]) => !c.req || c.req(S));
function choicesHTML(list, label = 'Apa yang kamu lakukan?') {
  const vs = visibleChoices(list);
  return `<div class="ask"><p class="label">${label}</p><ol class="choices">${vs.map(([c, i], k) => `<li><button type="button" class="choice" data-a="choose" data-v="${i}"${c.dis && c.dis(S) ? ' disabled' : ''}><span class="key" aria-hidden="true">${'ABCDEFGH'[k]}</span><span>${val(c.t)}${c.d ? `<small>${val(c.d)}</small>` : ''}${c.dis && c.dis(S) ? `<small class="bad">${val(c.alasan) || 'belum bisa dipilih'}</small>` : ''}</span></button></li>`).join('')}</ol></div>`;
}
function resultHTML() {
  const L = S.ui.last;
  return `<section class="result" tabindex="-1">${L.pick ? `<p class="label">Kamu memilih</p><p class="pick">${L.pick}</p>` : ''}${[].concat(L.note).map(p => `<p>${p}</p>`).join('')}${deltasHTML(L.deltas)}<button type="button" class="btn" data-a="next">${L.lanjut || 'Lanjut'}</button></section>`;
}
function setResult(pickText, note, b, goId, lanjut) { S.ui.last = { pick: pickText, note, deltas: diff(b), go: goId, lanjut }; render('.result'); }

/* ---------- HUD dan catatan ---------- */
function hudHTML(n) {
  const s = [['Pengaruh', S.pengaruh], ['Massa', S.massa, S.massa <= 15], ['Nyali', S.nyali, S.nyali <= 20], ['Sorotan', S.sorotan, S.sorotan >= 70]];
  if (n.buron) s.push(['Jejak', S.jejak, S.jejak >= 70]);
  s.push(['Uang', rp(S.uang.tunai)], ['Kurs', rp(S.kurs || kursAt(S.bulan))]);
  return `<span class="hud-title">Angkatan 98<small>${namaBulan(S.bulan)}</small></span><span class="hud-stats"><span class="rank">${rankOf(S.pengaruh)}</span>${s.map(([l, v, w]) => `<span${w ? ' class="warn"' : ''}>${l} <b>${v}</b></span>`).join('')}</span>`;
}
function notesHTML() {
  const ks = Object.entries(S.kader);
  const kab = S.kabar.slice(-6).reverse();
  return `<div class="notes-grid">
    <div><p class="label">Kepercayaan senior</p><ul>${Object.entries(SENIOR).map(([k, n]) => `<li>${n} <span class="pips">${pips(S[k])}</span></li>`).join('')}</ul></div>
    <div><p class="label">Keluarga</p><ul><li>Bapak <span class="pips">${pips(S.rel.bapak)}</span></li><li>Ibu <span class="pips">${pips(S.rel.ibu)}</span></li><li>Dika <span class="pips">${pips(S.rel.dika)}</span></li></ul></div>
    <div><p class="label">Kader</p><ul>${ks.length ? ks.map(([id, st]) => `<li>${KADER[id].nama} · ${KADER[id].ahli} · ${STATUS[st]}</li>`).join('') : '<li>Belum ada</li>'}</ul></div>
    <div><p class="label">Uang</p><ul><li>Tunai ${rp(S.uang.tunai)}</li><li>Bank ${rp(S.uang.bank)}${S.bankBeku ? ' (dibekukan)' : ''}</li><li>Dolar USD ${S.uang.usd}</li><li>Barang ${S.uang.barang} paket</li></ul></div>
    <div><p class="label">Rak buku</p><ul>${S.buku.baca ? `<li>Sedang dibaca: ${BUKU[S.buku.baca].judul} (${S.buku.sisa} Kamis lagi)</li>` : ''}${S.buku.selesai.map(b => `<li>Kutipan: ${BUKU[b].judul}</li>`).join('') || '<li>Belum ada kutipan</li>'}</ul></div>
    <div><p class="label">Bukti</p><ul>${S.bukti.length ? S.bukti.map(b => `<li>${BUKTI[b] || b}</li>`).join('') : '<li>Belum ada</li>'}</ul></div>
    <div class="wide"><p class="label">Buku catatan kabar</p><ul>${kab.length ? kab.map(e => `<li>${namaBulan(e.bulan)} · ${e.nama}: “${e.teks}”${e.cek ? (e.ok ? ' <b class="good">benar</b>' : ' <b class="bad">meleset</b>') : ''}</li>`).join('') : '<li>Belum ada kabar tercatat</li>'}</ul></div>
  </div>`;
}
const BUKU = {
  bumi: { judul: 'Bumi Manusia', terlarang: true, lama: 2, senior: ['damar', 'ratna'] },
  madilog: { judul: 'Madilog', terlarang: true, lama: 3, senior: ['damar'] },
  gie: { judul: 'Catatan Seorang Demonstran', terlarang: false, lama: 1, senior: ['fikri'] },
  freire: { judul: 'Pendidikan Kaum Tertindas', terlarang: false, lama: 2, senior: ['ratna'] },
  syariati: { judul: 'Tugas Cendekiawan Muslim', terlarang: false, lama: 1, senior: ['fikri'] },
  p4: { judul: 'Buku P4 dan UUD 1945', terlarang: false, lama: 1, senior: ['yudi'] }
};
const BUKTI = { rak: 'Rak buku Damar yang dikosongkan', lantai: 'Bekas sepatu lars', asbak: 'Puntung rokok asing', ibukos: 'Kesaksian ibu kos', kecurangan: 'Catatan kecurangan Pemilu 1997', dokumentasi: 'Dokumentasi penggerak kerusuhan', catatanDamar: 'Buku catatan kontak Damar', penyusup: 'Catatan tentang penyusup' };
function baca(n = 1) {
  if (!S.buku.baca) return null;
  S.buku.sisa -= n;
  if (S.buku.sisa > 0) return null;
  const id = S.buku.baca, b = BUKU[id];
  S.buku.selesai.push(id); S.buku.baca = null;
  if (b.terlarang) S.buku.dikos.push(id);
  const fx = {}; for (const s of b.senior) fx[s] = 1; apply(fx);
  return `Kamu selesai membaca ${b.judul}.`;
}
const kutipan = () => S.buku.selesai.length;

/* ---------- render ---------- */
function myKtm() { return { nama: S.nama.trim() || 'Nama Lengkap', nim: S.nim || `96.${FAK[S.fak].kode}.____`, fak: S.fak, ang: '1996', face: FOTO[S.foto], stempel: 'asli' }; }
function renderScene() {
  const n = NODES[S.node];
  $('scene').setAttribute('aria-label', val(n.alt) || n.judul);
  $('scene').innerHTML = `<g filter="url(#rough)">${SCENES[val(n.scene)](S, n)}</g><rect width="960" height="540" filter="url(#grain)" opacity=".5" style="mix-blend-mode:multiply" pointer-events="none"/>`;
}
function render(focusSel) {
  if (BOT) return;
  const n = NODES[S.node];
  $('hud').innerHTML = hudHTML(n);
  renderScene();
  $('panel').innerHTML = MODES[n.mode || 'story'].panel(n);
  $('notes-body').innerHTML = notesHTML();
  if (focusSel) { const el = $('panel').querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }
}

/* ---------- simpan ---------- */
const KEY = 'angkatan98-simpan';
function save() { if (BOT) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* penyimpanan tidak tersedia */ } }
function loadSave() { try { const d = JSON.parse(localStorage.getItem(KEY)); return d && d.node && NODES[d.node] ? d : null; } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(KEY); } catch (e) { /* abaikan */ } }
