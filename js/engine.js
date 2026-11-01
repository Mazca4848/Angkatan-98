/* Angkatan 98 · mesin: state, ekonomi, rumor, render, simpan */
const SENIOR = { damar: 'Bang Damar', ratna: 'Kak Ratna', fikri: 'Bang Fikri', yudi: 'Mas Yudi' };
const LINE = { damar: 'aksi langsung', ratna: 'organisasi dan jaringan', fikri: 'gerakan moral', yudi: 'jalur dialog' };
const KADER = {
  laras: { nama: 'Laras', fak: 'Komunikasi', ahli: 'humas', pos: 'humas', benda: 'pita mesin ketik', harga: 6000 },
  bimo: { nama: 'Bimo', fak: 'Kedokteran', ahli: 'medis', pos: 'medis', benda: 'senter kecil', harga: 5000 },
  wahyu: { nama: 'Wahyu', fak: 'Teknik', ahli: 'stensil, sopir', pos: 'tali', benda: 'sebungkus kretek', harga: 3000 },
  mei: { nama: 'Mei', fak: 'Teknik', ahli: 'juru catat, jaringan kampus', pos: 'sweeping', benda: 'buku tulis bersampul', harga: 4000 },
  asep: { nama: 'Asep', fak: 'Ekonomi', ahli: 'penghubung buruh', pos: 'tali', benda: 'kaset dangdut', harga: 5000 },
  dimas: { nama: 'Dimas', fak: 'Sastra', ahli: 'orator', pos: 'humas', benda: 'antologi puisi fotokopian', harga: 4000 },
  tigor: { nama: 'Tigor', fak: 'Hukum', ahli: 'tim hukum', pos: 'hukum', benda: 'KUHAP saku yang baru', harga: 8000 }
};
const STATUS = { aktif: 'aktif', diawasi: 'diawasi', ditangkap: 'ditangkap', keluar: 'keluar', tewas: 'tewas', pergi: 'pergi ke luar negeri' };
// jurusan dan gender punya untung dan rugi yang tidak pernah diumumkan; pemain menangkapnya dari kejadian di cerita
const FAK = {
  Hukum: { kode: '01', fx: { ratna: 1 } },
  Teknik: { kode: '02', fx: { uang: 30000 } },
  Ekonomi: { kode: '03', fx: { massa: -5 } },
  FISIP: { kode: '04', fx: { damar: 1, pengaruh: 5, sorotan: 10 } }
};
const GENDER = {
  L: { t: 'Laki-laki', foto: [0, 1] },
  P: { t: 'Perempuan', foto: [2, 3] }
};
const NAMA_AWAL = { L: 'Bagas Pratama', P: 'Sekar Ayuningtyas' };
const genderKu = () => S.gender || (S.foto >= 2 ? 'P' : 'L'); // simpanan lama belum punya gender
// isyarat cerita untuk untung-rugi tersembunyi: selalu muncul pertama kali, sesudahnya sesekali saja
const isyarat = (kunci, teks) => { if (S.f['isyarat_' + kunci] && Math.random() > 0.3) return ''; S.f['isyarat_' + kunci] = true; return ' ' + teks; };
const jejakRazia = n => genderKu() === 'P' ? Math.round(n / 2) : n;
const RANKS = [[75, 'Presidium'], [55, 'Koordinator Lapangan'], [35, 'Kader Inti'], [15, 'Anggota'], [0, 'Mahasiswa Baru']];
const rankOf = p => RANKS.find(([m]) => p >= m)[1];
const rankIdx = () => 4 - RANKS.findIndex(([m]) => S.pengaruh >= m);
const LABEL = { kuasa: 'Kuasa rezim', pengaruh: 'Pengaruh', massa: 'Kepercayaan massa', nyali: 'Nyali', sorotan: 'Sorotan', jejak: 'Jejak', iklim: 'Iklim politik', tekanan: 'Tekanan internasional', ipk: 'IPK', tunai: 'Uang', usd: 'Dolar', barang: 'Barang', utang: 'Utang', ...SENIOR, bapak: 'Bapak', ibu: 'Ibu', dika: 'Dika' };
const TRACK = Object.keys(LABEL);
const BAD_UP = ['sorotan', 'jejak', 'utang', 'kuasa'];
const TERLIHAT = ['tunai', 'usd', 'barang', 'utang']; // status lain hanya terasa lewat cerita dan bar HUD
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
  let k = r <= 0 || S.f.bapakDipecat || S.f.dropOut ? 0 : r >= 3 ? 150000 : 150000 - (3 - r) * 30000;
  if (r === 5 && k) k += 25000;
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
// biaya hidup tidak bisa ditolak: tunai dulu, lalu bank, sisanya terpaksa dipinjam dari lintah darat
const BUNGA_LINTAH = 0.2; // per bulan, berbunga-berbunga
function bayarWajib(n, out) {
  let kurang = n - S.uang.tunai;
  if (kurang <= 0) { S.uang.tunai -= n; return; }
  S.uang.tunai = 0;
  if (!S.bankBeku && S.uang.bank > 0) { const t = Math.min(S.uang.bank, kurang); S.uang.bank -= t; kurang -= t; out.push(`Kamu menarik ${rp(t)} dari bank untuk menutup biaya hidup.`); }
  if (kurang <= 0) return;
  S.uang.utang = (S.uang.utang || 0) + kurang; apply({ nyali: -4 });
  out.push(`Uangmu habis di tengah bulan. Kamu terpaksa meminjam ${rp(kurang)} dari lintah darat di pasar, dengan bunga 20% sebulan.`);
}
// penagih datang kalau utang menumpuk: barang dan dolar disita dulu, lalu keluargamu yang didatangi
function tagihUtang(out) {
  if ((S.uang.utang || 0) < harga(60000)) return;
  const nilai = S.uang.barang * harga(15000) + Math.round(S.uang.usd * S.kurs * 0.9);
  apply({ nyali: -5, sorotan: 5 });
  out.push(`Penagih lintah darat datang ke kos dan berteriak di depan pintu. Seluruh gang tahu kamu berutang.${nilai ? ` Mereka mengangkut ${S.uang.barang ? S.uang.barang + ' paket bahan pokok' : ''}${S.uang.barang && S.uang.usd ? ' dan ' : ''}${S.uang.usd ? 'USD ' + S.uang.usd : ''} senilai ${rp(Math.min(nilai, S.uang.utang))}.` : ''}`);
  S.uang.utang = Math.max(0, S.uang.utang - nilai); S.uang.barang = 0; S.uang.usd = 0;
  if (S.uang.utang >= harga(150000)) { apply({ bapak: -1, ibu: -1, nyali: -5 }); out.push('Utangmu masih besar, jadi penagih mencari alamat rumahmu di Magelang. Bapak harus menjual sepeda motornya untuk mencicil sebagian.'); S.uang.utang = Math.round(S.uang.utang / 2); }
}

/* ---------- kader ---------- */
const aktif = id => S.kader[id] === 'aktif' || S.kader[id] === 'diawasi';
const kaderAktif = () => Object.keys(S.kader).filter(aktif);
function rekrut(id) {
  if (S.kader[id] || kaderAktif().length >= 5) return false;
  S.kader[id] = 'aktif';
  if (id === S.penyusup) S.f.penyusupMasuk = S.bulan;
  return true;
}
// kedekatan 0–8: Kenal (0–2), Percaya (3–5), Saudara (6+). Setiap naik tingkat membuka satu kejadian pribadi
const TINGKAT = ['Kenal', 'Percaya', 'Saudara'];
const dekat = id => (S.dekat || {})[id] || 0;
const tingkat = id => dekat(id) >= 6 ? 2 : dekat(id) >= 3 ? 1 : 0;
const saudara = id => aktif(id) && tingkat(id) === 2;
function tambahDekat(id, n) {
  const D = S.dekat = S.dekat || {}, t0 = tingkat(id);
  D[id] = clamp((D[id] || 0) + n, 0, 8);
  const t1 = tingkat(id);
  if (t1 > t0 && aktif(id)) (S.f.ceritaAntre = S.f.ceritaAntre || []).push(id + ':' + t1);
}
// afeksi tersembunyi: tidak pernah tampil sebagai angka. Ucapanmu menggesernya; setiap 4 poin mengendap diam-diam
// menjadi satu langkah hubungan yang sudah ada (kepercayaan senior, kedekatan kader, restu keluarga) saat adegan berganti
const hati = id => (S.hati || {})[id] || 0;
const sikap = id => hati(id) >= 3 ? 'hangat' : hati(id) <= -3 ? 'dingin' : 'biasa';
const rasa = (id, t) => t[sikap(id)] ?? t.biasa;
function ubahHati(id, n) { const H = S.hati = S.hati || {}; H[id] = clamp((H[id] || 0) + n, -12, 12); }
function endapkanHati() {
  const L = S.hatiL = S.hatiL || {};
  for (const [id, v] of Object.entries(S.hati || {})) {
    const k = Math.trunc(v / 4), d = k - (L[id] || 0);
    if (!d) continue;
    L[id] = k;
    if (id in KADER) tambahDekat(id, d); else if (id in SENIOR || id in S.rel) apply({ [id]: d });
  }
}
const penyusupAktif = () => aktif(S.penyusup) && !S.f.penyusupKetahuan;
// selama penyusup belum ketahuan, rencana gagal 90% dan naik 5% setiap bulan ia dibiarkan.
// Agen ganda menghentikan kebocoran; forum lintas kampus membuat rencana punya banyak simpul, jadi peluangnya separuh
const BOCOR_AWAL = 0.9, BOCOR_NAIK = 0.05;
const peluangBocor = () => penyusupAktif() && !S.f.agenGanda ? Math.min(1, BOCOR_AWAL + BOCOR_NAIK * Math.max(0, monthsBetween(S.f.penyusupMasuk || S.bulan, S.bulan))) * (S.f.forum ? 0.5 : 1) : 0;
function bocor() {
  if (Math.random() >= peluangBocor()) return false;
  S.f.bocorKali = (S.f.bocorKali || 0) + 1; return true;
}
const BOCOR_NOTE = 'Tapi rencana itu bocor. Aparat sudah menunggu sebelum kalian bergerak, padahal hanya lingkaran dalam yang tahu.';
// rencana yang bocor: hasil baiknya hilang, yang tersisa hanya risikonya
function gagalkan(fx) {
  const out = { sorotan: 8, massa: -5, kuasa: 3 };
  for (const [k, v] of Object.entries(fx || {})) {
    if (k === 'bukti') continue;
    const baik = typeof v === 'number' && (['massa', 'pengaruh', 'tekanan', 'iklim', 'nyali'].includes(k) ? v > 0 : ['sorotan', 'ricuh', 'kuasa'].includes(k) && v < 0);
    if (!baik) out[k] = typeof v === 'number' && out[k] ? out[k] + v : v;
  }
  return out;
}

/* ---------- rumor ---------- */
const SUMBER = {
  laras: { nama: 'Laras', base: 60 }, ratna: { nama: 'Kak Ratna', base: 55 }, fikri: { nama: 'Bang Fikri', base: 50 }, radio: { nama: 'Radio swasta', base: 50 },
  yudi: { nama: 'Mas Yudi', base: 45 }, kurir: { nama: 'Kurir', base: 40 }, rt: { nama: 'Pak RT', base: 40 }, damar: { nama: 'Anak-anak Damar', base: 35 },
  tvri: { nama: 'TVRI', base: 30 }, warung: { nama: 'Obrolan warung', base: 20 }, penyusup: { nama: 'kawan', base: 70 }, ekonomi: { nama: 'Catatan kurs', base: 55 }
};
function trustOf(src) {
  if (src in SENIOR) return clamp(S[src] + (sikap(src) === 'hangat' ? 1 : sikap(src) === 'dingin' ? -1 : 0), 0, 5);
  if (src === 'laras') return aktif('laras') ? 4 : 1;
  if (src === 'rt') return S.f.dapurUmum ? 4 : 1;
  if (src === 'radio') return S.bekal.includes('radio') ? 2 : 0;
  if (src === 'penyusup') return 4;
  if (src === 'ekonomi') return S.fak === 'Ekonomi' ? 5 : 0;
  return 0;
}
// Madilog melatih menimbang bukti; kode samaran membuat pesan kadang salah tangkap
const akurasi = (src, hops = 0) => clamp(SUMBER[src].base + 8 * trustOf(src) - 15 * hops + 3 * paham('madilog') - (S.protokol.includes('samaran') ? 5 : 0), 10, 95);
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
const koreksi = e => TOPIK[e.topik].benar(S, TOPIK[e.topik].truth(S));
const ongkosCek = () => S.bekal.includes('catatan') ? 2 : 6;
// cek silang: hanya sempat satu kabar per adegan, dan setiap orang yang ditanyai ikut tahu kamu sedang mencari
function cekKabar(i) {
  const e = S.ui.kabar && S.ui.kabar[i];
  if (!e || e.cek || S.ui.cek != null || S.ui.last) return;
  S.ui.cek = i; e.cek = true; if (!e.ok) e.koreksi = koreksi(e);
  const b = snap(); apply({ sorotan: ongkosCek() }); S.ui.kabarDelta = diff(b);
  if (e.topik === 'massa' && !e.ok) S.m.est = Math.round(S.m.M / 50) * 50;
  render('.kabar');
}
// meneruskan kabar ke massa: kabar yang benar menambah kepercayaan, kabar yang keliru menggerusnya
function sebarKabar(i) {
  const e = S.ui.kabar && S.ui.kabar[i];
  if (!e || S.ui.sebar != null || S.ui.last) return;
  S.ui.sebar = i; e.cek = true; e.sebar = true; if (!e.ok) e.koreksi = koreksi(e);
  const b = snap(); apply(e.ok ? { massa: 4, pengaruh: 3 } : { massa: -6, pengaruh: -4 }); S.ui.kabarDelta = diff(b);
  render('.kabar');
}

/* ---------- state ---------- */
function fresh() {
  return {
    versi: VERSI_SIMPAN, node: 'intro', nama: 'Bagas Pratama', fak: 'Hukum', gender: 'L', foto: 0, nim: '', bulan: '1996-08', kurs: 2340,
    kuasa: 100, pengaruh: 0, massa: 30, nyali: 50, nyaliMax: 100, sorotan: 5, jejak: 20, iklim: 10, ipk: 3, tekanan: 0, ricuh: 0, cap: 0,
    uang: { tunai: 20000, bank: 0, usd: 0, barang: 0, utang: 0 }, bankJenis: null, bankBeku: false,
    rel: { bapak: 3, ibu: 4, dika: 4 }, kagum: 0, tahu: 0, hati: {}, hatiL: {},
    damar: 0, ratna: 0, fikri: 0, yudi: 0,
    kader: {}, dekat: {}, lelah: {}, penyusup: pick(['wahyu', 'asep', 'dimas']),
    buku: { baca: null, sisa: 0, selesai: [], dikos: [], paham: {} }, bekal: [], protokol: [], bukti: [], kabar: [], bocor: [], hilang: [], siap: {},
    f: {}, seen: {}, ui: {}, m: {}, ending: null, log: []
  };
}
// kuasa rezim mulai penuh; setiap aksi menggerusnya, setiap kegagalan memulihkannya. Belum kosong pada 21 Mei 1998 berarti rezim bertahan
const GERUS = 3; // pengali dampak aksi terhadap kuasa rezim; kegagalan tidak ikut dikali
const CLAMP100 = ['pengaruh', 'massa', 'sorotan', 'jejak', 'iklim', 'tekanan'];
function apply(fx) {
  for (const [k, v] of Object.entries(fx || {})) {
    if (k === 'kuasa') S.kuasa = clamp((S.kuasa ?? 100) + (v < 0 ? v * GERUS : v), 0, 100);
    else if (k === 'uang') S.uang.tunai = Math.max(0, S.uang.tunai + v);
    else if (k === 'usd' || k === 'barang' || k === 'bank') S.uang[k] = Math.max(0, S.uang[k] + v);
    else if (k === 'massa' && v > 0 && S.cap > 0) S.massa = clamp(S.massa + Math.ceil(v / 2), 0, 100);
    else if (CLAMP100.includes(k)) S[k] = clamp(S[k] + v, 0, 100);
    else if (k === 'nyali') S.nyali = clamp(S.nyali + v, 0, S.nyaliMax);
    else if (k === 'nyaliMax') { S.nyaliMax = clamp(S.nyaliMax + v, 30, 100); S.nyali = Math.min(S.nyali, S.nyaliMax); }
    else if (k === 'ipk') S.ipk = Math.round(clamp(S.ipk + v, 0, 4) * 100) / 100;
    else if (k in SENIOR) S[k] = clamp(S[k] + v, 0, k === 'damar' && S.fak === 'Ekonomi' ? 4 : 5);
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
function get(k) { if (k === 'tunai' || k === 'usd' || k === 'barang' || k === 'utang') return S.uang[k] || 0; if (k in S.rel) return S.rel[k]; return S[k]; }
function diff(b) {
  const out = [];
  for (const k of TRACK) {
    const d = Math.round((get(k) - b[k]) * 100) / 100;
    if (!d || !TERLIHAT.includes(k)) continue;
    const v = k === 'tunai' || k === 'utang' ? rp(Math.abs(d)) : k === 'ipk' ? ipkStr(Math.abs(d)) : k === 'usd' ? 'USD ' + Math.abs(d) : Math.abs(d);
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
  if (!S.ending && S.nyali <= 0) { S.ending = 'patah'; id = 'akhir'; }
  else if (!S.ending && !NODES[id].aman) {
    if (S.massa <= 0) { S.ending = 'barisan'; id = 'akhir'; }
    else if (S.sorotan >= 100 && !S.f.diLuar) { S.f.kembaliKe = id; id = 'culik'; }
    else if (terorJatuh(false, id)) { S.f.kembaliKe = id; id = 'teror'; }
    else if (ancamanJatuh(id)) { S.f.kembaliKe = id; id = 'ancaman'; }
    else if (ceritaJatuh(id)) { S.f.kembaliKe = id; id = 'kader_cerita'; }
    else { const sela = typeof selaJatuh === 'function' && selaJatuh(id); if (sela) { S.f.kembaliKe = id; id = sela; } }
  }
  if (BABAK.includes(id) && !S.ending) simpanBabak(id);
  const prev = NODES[S.node], n = NODES[id], moved = !prev || prev.scene !== n.scene;
  const doIt = () => {
    tinggalkanObrolan();
    endapkanHati();
    S.node = id; S.ui = {}; S.m = {};
    if (n.bulan) { S.bulan = n.bulan; S.kurs = kursAt(n.bulan); }
    if (n.enter) { const b = snap(); apply(val(n.enter)); S.ui.enterDelta = diff(b); }
    if (n.kabar) S.ui.kabar = n.kabar(S);
    const M = MODES[n.mode || 'story']; if (M.enter) M.enter(n);
    if (!S.ending && S.nyali <= 0) return end('patah');
    if (n.log) S.log.push(val(n.log));
    const q = S.bulan.slice(0, 4) + Math.floor((Number(S.bulan.slice(5, 7)) - 1) / 3);
    if (S.bekal.includes('foto') && S.nyali < 20 && !S.f['foto' + q]) { S.f['foto' + q] = true; apply({ nyali: 5 }); (S.ui.enterDelta = S.ui.enterDelta || []).push(['Foto keluarga di dompet: Nyali +5', false]); }
    if (!BOT) kamera(moved);
    save(); render(); if (!BOT && typeof window !== 'undefined') { $('panel').scrollTop = 0; if (moved) window.scrollTo(0, 0); }
    if (!BOT) keterangan(val(n.waktu));
  };
  moved ? blinkThen(doIt) : doIt();
}
function end(id) { S.ending = id; go('akhir'); }
function act(a, v) {
  if (!BOT && typeof Suara !== 'undefined') Suara.aksi(a, v);
  aksi(a, v);
  // nyali habis di tengah adegan: tidak ada pilihan lagi, langsung ke ending Patah
  if (S.ending || S.nyali > 0) return;
  S.ending = 'patah';
  if (S.ui.last) { S.ui.last.go = 'akhir'; S.ui.last.lanjut = 'Nyalimu habis'; render(); } else go('akhir');
}
function aksi(a, v) {
  const n = NODES[S.node], M = MODES[n.mode || 'story'];
  if (a === 'look') return look(v);
  if (a === 'bicara') return mulaiObrolan(v);
  if (a === 'ucap') return ucap(+v);
  if (a === 'acthot') return doAct(v);
  if (a === 'next') return go(S.ui.last.go);
  if (a === 'goto') return go(v);
  if (a === 'restart') { S = fresh(); clearSave(); return go('intro'); }
  if (a === 'ulangbabak') return muatBabak();
  if (a === 'aturwaktu') { aturWaktu(); return render(); }
  if (a === 'aturteks') { aturTeks(); return render(); }
  if (a === 'atursuara') { if (typeof Suara !== 'undefined') { Suara.mulai(); Suara.atur(); } return render(); }
  if (a === 'waktuHabis') { const w = S.ui.waktu; if (!w || w.id !== v) return; S.ui.waktu = null; return M.act(n, 'waktuHabis'); }
  if (a === 'cek') return cekKabar(+v);
  if (a === 'sebar') return sebarKabar(+v);
  if (a === 'lanjut') { const d = loadSave(); if (d) { S = d; return render(); } return; }
  return M.act(n, a, v);
}
const actions = () => {
  const n = NODES[S.node], g = S.ui.dlg;
  // bot: obrolan yang sedang berjalan harus dijawab; obrolan baru kadang dimulai
  if (g && !g.selesai) return giliranIni(g).opsi.map((_, v) => ({ a: 'ucap', v }));
  const o = MODES[n.mode || 'story'].actions(n);
  if (!S.ui.last && Math.random() < 0.5) for (const k of obrolanAda(n)) o.push({ a: 'bicara', v: k });
  // bot sesekali membiarkan waktunya habis
  if (S.ui.waktu && !S.ui.last && Math.random() < 0.15) o.push({ a: 'waktuHabis', v: S.ui.waktu.id });
  return o;
};

/* ---------- pengamatan ---------- */
function look(id) {
  const n = NODES[S.node], x = n.hots && n.hots[id];
  if (!x || S.ui.last || (x.req && !x.req(S))) return;
  const key = S.node + ':' + id;
  S.ui.obsDelta = null;
  if (!S.seen[key]) { S.seen[key] = 1; if (x.fx) { const b = snap(); apply(val(x.fx)); S.ui.obsDelta = diff(b); } }
  S.ui.obs = id;
  render('.obs');
  condong(id);
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
  const bab = val(n.bab), judul = val(n.judul), head = bab != null ? `${typeof bab === 'number' ? 'Bab ' + bab : bab} · ${judul}` : judul;
  return `<p class="meta"><span>${head}</span><span>${val(n.waktu) || ''}${extra ? ' · ' + extra : ''}</span></p>` + deltasHTML(S.ui.enterDelta);
}
const prose = n => n.text ? `<div class="prose">${[].concat(val(n.text)).map(p => `<p>${p}</p>`).join('')}</div>` : '';
function kabarHTML(bisaSebar = false) {
  const ks = S.ui.kabar;
  if (!ks || !ks.length) return '';
  const buka = !S.ui.last, benar = e => e.ok ? '' : ` Yang benar: “${e.koreksi}”`;
  const hasil = e => e.sebar ? `<p class="cek ${e.ok ? 'good' : 'bad'}">${e.ok ? 'Kamu meneruskannya ke kawan-kawan. Kabar itu terbukti, dan orang makin percaya pada kata-katamu.' : 'Kamu meneruskannya ke kawan-kawan. Kabar itu keliru, dan orang mulai ragu pada kata-katamu.' + benar(e)}</p>`
    : e.cek ? `<p class="cek ${e.ok ? 'good' : 'bad'}">${e.ok ? 'Cek silang: kabar ini benar.' : 'Cek silang: kabar ini meleset.' + benar(e)}</p>` : '';
  const tombol = (e, i) => (buka && S.ui.cek == null && !e.cek ? `<button type="button" class="chip" data-a="cek" data-v="${i}">Cek silang ke sumber lain</button> ` : '') + (buka && bisaSebar && S.ui.sebar == null ? `<button type="button" class="chip" data-a="sebar" data-v="${i}">Teruskan ke kawan-kawan</button>` : '');
  return `<div class="kabar" tabindex="-1"><p class="label">Kabar yang sampai kepadamu</p>${ks.map((e, i) => `<div class="kb"><b>${e.nama}</b> <span class="pips" title="Kepercayaanmu pada sumber">${e.src in SENIOR || e.src === 'laras' || e.src === 'rt' ? pips(trustOf(e.src)) : ''}</span><p>“${e.teks}”</p>${hasil(e)}${tombol(e, i)}</div>`).join('')}${deltasHTML(S.ui.kabarDelta)}${buka ? `<p class="fine">Kamu hanya sempat mengecek satu kabar${bisaSebar ? ' dan meneruskan satu kabar ke kawan-kawan' : ''}. Setiap orang yang kamu tanyai ikut tahu kamu sedang mencari tahu.</p>` : ''}</div>`;
}
function obsHTML(n) {
  const id = S.ui.obs, x = n.hots[id], key = 'act:' + S.node + ':' + id;
  let a = '';
  if (x.act) a = S.f[key] ? `<p>${val(x.act.note)}</p>` : (!x.act.req || x.act.req(S)) ? `<button type="button" class="chip" data-a="acthot" data-v="${id}">${x.act.t}</button>` : '';
  return `<div class="obs" tabindex="-1"><p class="label">Kamu mengamati: ${val(x.label)}</p><p>${val(x.text)}</p>${deltasHTML(S.ui.obsDelta)}${a}</div>`;
}
function lookHTML(n) {
  const hs = Object.entries(n.hots || {}).filter(([, x]) => !x.req || x.req(S));
  if (S.ui.dlg) return dlgHTML() + chips(hs);
  return (S.ui.obs && n.hots[S.ui.obs] ? obsHTML(n) : '') + chips(hs) + bicaraHTML(n);
}

/* ---------- percakapan ---------- */
// arah jawaban seperti di obrolan kos: s = sejalan, n = mengambang, l = berlawanan. Opsi: [ucapan, arah, balasan, {afeksi tokoh lain}, {fx diam-diam}]
const DIALOG = {}, ARAH = { s: 2, n: 0, l: -2 };
const obrolanAda = n => (val(n.bicara) || []).filter(k => DIALOG[k] && !S.f['dlg_' + k] && (!DIALOG[k].req || DIALOG[k].req(S)));
const giliranIni = g => { const G = DIALOG[g.k].giliran[g.i]; return { kata: val(G.kata), opsi: val(G.opsi) }; };
const bicaraHTML = n => { const ks = S.ui.last ? [] : obrolanAda(n); return ks.length ? `<div class="look"><span class="label">Bicara</span>${ks.map(k => `<button type="button" class="chip" data-a="bicara" data-v="${k}">${val(DIALOG[k].nama)}</button>`).join('')}</div>` : ''; };
function mulaiObrolan(k) {
  if (S.ui.last || S.ui.dlg || !obrolanAda(NODES[S.node]).includes(k)) return;
  const D = DIALOG[k];
  if (D.mulai) apply(D.mulai);
  S.ui.obs = null;
  S.ui.dlg = { k, i: 0, jejak: [], selesai: false };
  render('.dlg');
}
function ucap(v) {
  const g = S.ui.dlg;
  if (!g || g.selesai) return;
  const D = DIALOG[g.k], G = giliranIni(g), o = G.opsi[v];
  if (!o) return;
  const [t, arah, balas, lain, fx] = o;
  ubahHati(D.siapa, ARAH[arah]);
  for (const [id, n] of Object.entries(lain || {})) ubahHati(id, n);
  if (fx) apply(fx);
  g.jejak.push({ kata: G.kata, jawab: t, balas: val(balas) });
  g.i++;
  if (g.i >= D.giliran.length) { g.selesai = true; g.tutup = rasa(D.siapa, D.tutup); S.f['dlg_' + g.k] = true; if (D.hadiah && D.hadiah[sikap(D.siapa)]) apply(D.hadiah[sikap(D.siapa)]); }
  render('.dlg');
}
// pergi saat diajak bicara tetap terasa
function tinggalkanObrolan() {
  const g = S.ui && S.ui.dlg;
  if (!g || g.selesai) return;
  S.f['dlg_' + g.k] = true;
  ubahHati(DIALOG[g.k].siapa, -1);
}
function dlgHTML() {
  const g = S.ui.dlg, D = DIALOG[g.k], n = g.jejak.length;
  // .baru: bagian yang baru muncul sesudah jawaban terakhir, untuk diungkap bertahap
  const baris = (x, j) => { const b = j === n - 1 ? ' baru' : ''; return `<p class="ucap">${x.kata}</p><p class="jawab${b}">“${x.jawab}”</p>${x.balas ? `<p class="ucap${b}">${x.balas}</p>` : ''}`; };
  let h = `<div class="dlg" tabindex="-1"><p class="label">Bicara dengan ${val(D.nama)}</p>${g.jejak.map(baris).join('')}`;
  if (g.selesai) return h + `<p class="ucap baru">${g.tutup}</p></div>`;
  const G = giliranIni(g);
  return h + `<p class="ucap baru">${G.kata}</p><ol class="choices baru">${G.opsi.map((o, v) => `<li><button type="button" class="choice" data-a="ucap" data-v="${v}"><span class="key" aria-hidden="true">${'ABCD'[v]}</span><span>${o[0]}</span></button></li>`).join('')}</ol></div>`;
}
// senior yang sudah tidak menganggapmu sejalan menerima bantuanmu dengan dingin: kepercayaannya naik lebih sedikit
const SINDIR = {
  damar: 'Bang Damar menerima bantuanmu tanpa menoleh. Ia belum lupa ucapanmu tempo hari.',
  ratna: 'Kak Ratna mencatat namamu, lalu menutup bukunya. Di matanya kamu belum sejalan.',
  fikri: 'Bang Fikri mengangguk sopan, sesopan kepada orang yang baru dikenal.',
  yudi: 'Mas Yudi tersenyum, tapi tidak menyebut namamu di depan orang-orang pentingnya.'
};
function dinginkan(fx) {
  const out = { ...fx }, lines = [];
  for (const k of Object.keys(SENIOR)) if (out[k] > 0 && sikap(k) === 'dingin') { out[k]--; lines.push(SINDIR[k]); }
  return [out, lines];
}
const chips = hs => hs.length ? `<div class="look"><span class="label">Amati</span>${hs.map(([id, x]) => `<button type="button" class="chip${S.seen[S.node + ':' + id] ? ' seen' : ''}" data-a="look" data-v="${id}" aria-pressed="${S.ui.obs === id}">${val(x.label)}</button>`).join('')}</div>` : '';
const visibleChoices = list => (list || []).map((c, i) => [c, i]).filter(([c]) => !c.req || c.req(S));
function choicesHTML(list, label = 'Apa yang kamu lakukan?') {
  const vs = visibleChoices(list);
  return `<div class="ask"><p class="label">${label}</p><ol class="choices">${vs.map(([c, i], k) => `<li><button type="button" class="choice" data-a="choose" data-v="${i}"${c.dis && c.dis(S) ? ' disabled' : ''}><span class="key" aria-hidden="true">${'ABCDEFGH'[k]}</span><span>${val(c.t)}${c.d ? `<small>${val(c.d)}</small>` : ''}${c.dis && c.dis(S) ? `<small class="bad">${val(c.alasan) || 'belum bisa dipilih'}</small>` : ''}</span></button></li>`).join('')}</ol></div>`;
}
function resultHTML() {
  const L = S.ui.last;
  return `<section class="result" tabindex="-1">${L.pick ? `<p class="pick"><span class="label">Kamu memilih</span> ${L.pick}</p>` : ''}${[].concat(L.note).map(p => `<p>${p}</p>`).join('')}${L.batin ? `<p class="batin">${L.batin}</p>` : ''}${deltasHTML(L.deltas)}<button type="button" class="btn" data-a="next">${L.lanjut || 'Lanjut'}</button></section>`;
}
function setResult(pickText, note, b, goId, lanjut) {
  // gagal: lebih banyak hal penting yang memburuk daripada membaik (stat tersembunyi ikut dihitung, tidak ditampilkan)
  const deltas = diff(b), arah = ['massa', 'pengaruh', 'nyali', 'sorotan', 'kuasa', 'bapak', 'ibu', 'dika', ...Object.keys(SENIOR)].map(k => Math.sign((get(k) - b[k]) * (BAD_UP.includes(k) ? -1 : 1))).filter(Boolean);
  const buruk = arah.reduce((a, x) => a + x, 0) < 0;
  S.ui.last = { pick: pickText, note, deltas, go: goId, lanjut, batin: renungan(buruk, arah.length) };
  // keputusan yang dipilih sendiri diingat untuk malam-malam tanpa tidur
  if (pickText && !NODES[S.node].aman) {
    S.f.keputusan = { t: pickText, lain: S.ui.lainPilihan || [], buruk, bulan: S.bulan };
    if (buruk && S.f.keputusan.lain.length) S.f.gagal = S.f.keputusan; // diingat sampai malam tanpa tidur berikutnya
  }
  render('.result');
}

/* ---------- HUD dan catatan ---------- */
const kataBar = v => v >= 75 ? 'tinggi' : v >= 40 ? 'sedang' : v >= 15 ? 'rendah' : 'nyaris habis';
const barHTML = (l, v, w) => `<span class="bar${w ? ' warn' : ''}">${l}<i role="meter" aria-label="${l}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(v)}" aria-valuetext="${kataBar(v)}"><b style="width:${clamp(Math.round(v), 0, 100)}%"></b></i></span>`;
function hudHTML(n) {
  const s = [['Kuasa rezim', S.kuasa ?? 100, S.bulan >= '1998-04' && (S.kuasa ?? 100) > 0], ['Pengaruh', S.pengaruh], ['Massa', S.massa, S.massa <= 15], ['Nyali', S.nyali, S.nyali <= 20], ['Sorotan', S.sorotan, S.sorotan >= 65]];
  if (n.buron) s.push(['Jejak', S.jejak, S.jejak >= 70]);
  if (S.bulan < '1998-04' && !S.f.dropOut) s.push(['IPK', S.ipk * 25, S.ipk < 2.5]);
  const u = [['Uang', rp(S.uang.tunai)]];
  if (S.uang.utang > 0) u.push(['Utang', rp(S.uang.utang), true]);
  u.push(['Kurs', rp(S.kurs || kursAt(S.bulan))]);
  return `<span class="hud-title">Angkatan 98<small>${namaBulan(S.bulan)}</small></span><span class="hud-stats"><span class="rank">${rankOf(S.pengaruh)}</span>${s.map(([l, v, w]) => barHTML(l, v, w)).join('')}${u.map(([l, v, w]) => `<span${w ? ' class="warn"' : ''}>${l} <b>${v}</b></span>`).join('')}${typeof Suara !== 'undefined' ? `<button type="button" class="hud-suara" data-a="atursuara">Suara: ${Suara.tingkat()}</button>` : ''}</span>`;
}
function notesHTML() {
  const ks = Object.entries(S.kader);
  const kab = S.kabar.slice(-6).reverse();
  const nb = b => BUKTI[b] || b;
  const bukti = [...S.bukti.map(b => `<li>${nb(b)}${S.f.bawaBukti ? ' · di tasmu' : ''}</li>`), ...(S.f.buktiSekre || []).map(b => `<li>${nb(b)} · di plafon sekretariat</li>`), ...(S.f.buktiDisita || []).map(b => `<li>${nb(b)} · <b class="bad">disita aparat</b></li>`)];
  return `<div class="notes-grid">
    <div><p class="label">Kepercayaan senior</p><ul>${Object.entries(SENIOR).map(([k, n]) => `<li>${n} <span class="pips">${pips(S[k])}</span></li>`).join('')}</ul></div>
    <div><p class="label">Keluarga</p><ul><li>Bapak <span class="pips">${pips(S.rel.bapak)}</span></li><li>Ibu <span class="pips">${pips(S.rel.ibu)}</span></li><li>Dika <span class="pips">${pips(S.rel.dika)}</span></li>${(S.f.terorKena || []).map(t => `<li><b class="bad">${t}</b></li>`).join('')}${S.f.keluargaAman ? '<li>Mengungsi ke rumah Bude</li>' : ''}</ul></div>
    <div><p class="label">Kader</p><ul>${ks.length ? ks.map(([id, st]) => `<li>${KADER[id].nama} · ${KADER[id].ahli} · ${STATUS[st]}${aktif(id) ? ' · ' + TINGKAT[tingkat(id)].toLowerCase() : ''}</li>`).join('') : '<li>Belum ada</li>'}${S.f.bocorKali ? `<li><b class="bad">Rencana bocor ${S.f.bocorKali} kali. Ada yang membocorkan dari dalam.</b></li>` : ''}</ul></div>
    <div><p class="label">Uang</p><ul><li>Tunai ${rp(S.uang.tunai)}</li><li>Bank ${rp(S.uang.bank)}${S.bankBeku ? ' (dibekukan)' : ''}</li><li>Dolar USD ${S.uang.usd}</li><li>Bahan pokok ${S.uang.barang} paket</li>${S.uang.utang > 0 ? `<li><b class="bad">Utang lintah darat ${rp(S.uang.utang)}</b></li>` : ''}</ul></div>
    <div><p class="label">Rak buku</p><ul>${S.buku.baca ? `<li>Sedang dibaca: ${BUKU[S.buku.baca].judul} (${S.buku.sisa} Kamis lagi)</li>` : ''}${Object.keys(BUKU).filter(b => paham(b)).map(b => `<li>${BUKU[b].judul} · pemahaman ${paham(b)}/5${S.buku.selesai.includes(b) ? ', selesai' : ''}</li>`).join('') || '<li>Belum ada yang dibaca</li>'}</ul></div>
    <div><p class="label">Bukti</p><ul>${bukti.length ? bukti.join('') : '<li>Belum ada</li>'}</ul></div>
    <div class="wide"><p class="label">Pengaturan</p><p>${tombolWaktu()} ${tombolTeks()}</p><p class="fine">Berlaku untuk momen genting: razia, sembunyi, lari, telepon tengah malam, gerbang kampus, dan orasi.</p></div>
    <div class="wide"><p class="label">Buku catatan kabar</p><ul>${kab.length ? kab.map(e => `<li>${namaBulan(e.bulan)} · ${e.nama}: “${e.teks}”${e.cek ? (e.ok ? ' <b class="good">benar</b>' : ' <b class="bad">meleset</b>') : ''}${e.sebar ? ' · kamu teruskan' : ''}</li>`).join('') : '<li>Belum ada kabar tercatat</li>'}</ul></div>
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
const BUKTI = { rak: 'Rak buku Damar yang dikosongkan', lantai: 'Bekas sepatu lars', asbak: 'Puntung rokok asing', ibukos: 'Kesaksian ibu kos', kecurangan: 'Catatan kecurangan Pemilu 1997', dokumentasi: 'Dokumentasi penggerak kerusuhan', catatanDamar: 'Buku catatan kontak Damar', penyusup: 'Catatan tentang penyusup', saksi: 'Saksi mobil penculik Damar', catatanMei: 'Catatan Mei tentang orang-orang yang hilang dan ditangkap', saksiSel: 'Kesaksian tahanan yang mendengar Damar di sel sebelah' };
// bukti yang jatuh ke tangan aparat hilang dari Daftar Nama, dan kontak Damar di dalamnya ikut terbongkar
function sitaBukti(dari) {
  const id = dari.splice(0);
  S.f.buktiDisita = (S.f.buktiDisita || []).concat(id);
  if (id.includes('catatanDamar')) apply({ damar: -2 });
  return id;
}
function ambilPlafon() {
  const id = (S.f.buktiSekre || []).splice(0);
  for (const b of id) if (!S.bukti.includes(b)) S.bukti.push(b);
  return id.length;
}
// pemahaman tiap buku naik satu tingkat per sesi baca, sampai 5; tiap buku memberi kekuatan berbeda
const paham = id => (S.buku.paham || {})[id] || 0;
function tambahPaham(id) { const p = S.buku.paham = S.buku.paham || {}; p[id] = Math.min(5, (p[id] || 0) + 1); }
const bukuUlang = () => S.buku.selesai.filter(b => paham(b) < 5).sort((a, b) => paham(a) - paham(b))[0];
const bukuDibaca = () => S.buku.baca || bukuUlang();
function baca(n = 1) {
  if (!S.buku.baca) return null;
  tambahPaham(S.buku.baca);
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
  const n = NODES[S.node], svg = `<g filter="url(#rough)">${SCENES[val(n.scene)](S, n)}</g><rect width="960" height="540" filter="url(#grain)" opacity=".5" style="mix-blend-mode:multiply" pointer-events="none"/>`;
  $('scene').setAttribute('aria-label', val(n.alt) || n.judul);
  // gambar ulang hanya bila isinya berubah, supaya napas tokoh dan gerak kamera tidak terpotong (id clipPath selalu baru, abaikan)
  const kunci = svg.replace(/hc\d+/g, '');
  if (kunci === tampil.svg) return;
  tampil.svg = kunci;
  $('scene').innerHTML = svg;
}
function render(focusSel) {
  if (BOT) return;
  const n = NODES[S.node], baru = tampil.node !== S.node, p = $('panel'), lama = lebarBar();
  tampil.node = S.node;
  selesaiUngkap();
  $('hud').innerHTML = hudHTML(n);
  geserBar(lama);
  renderScene();
  p.innerHTML = MODES[n.mode || 'story'].panel(n);
  $('notes-body').innerHTML = notesHTML();
  // momen berbatas waktu tampil sekaligus: jam sudah berjalan
  if (baru && !S.ui.waktu) ungkap([...p.children].flatMap(el => el.matches('.prose') ? [...el.children] : [el]));
  else if (focusSel === '.result' || focusSel === '.obs') { const el = p.querySelector(focusSel); if (el) ungkap([...el.children]); }
  else if (focusSel === '.dlg') ungkap([...p.querySelectorAll('.dlg .baru')]);
  if (focusSel) {
    const el = p.querySelector(focusSel), baru = p.querySelectorAll('.baru');
    if (el) { el.focus({ preventScroll: true }); (focusSel === '.dlg' && baru.length ? baru[baru.length - 1] : el).scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); }
  }
  if (typeof Suara !== 'undefined') Suara.perbarui();
}

/* ---------- gerak ---------- */
// semua gerak mati untuk bot dan prefers-reduced-motion; teks tetap terbaca utuh tanpa gerak
const tampil = { node: null, svg: '', waktu: null };
let ungkapT = 0;
// teks muncul bertahap, lamanya mengikuti panjang kalimat; klik atau tombol apa pun menampilkan semuanya
function ungkap(els) {
  if (reduced || !els.length) return;
  let t = 0;
  for (const el of els) { el.style.setProperty('--tunda', t + 'ms'); el.classList.add('ungkap'); t += clamp(el.textContent.length * 9, 120, 1400); }
  $('panel').classList.add('mengungkap');
  clearTimeout(ungkapT);
  ungkapT = setTimeout(selesaiUngkap, t + 500);
}
function selesaiUngkap() {
  clearTimeout(ungkapT);
  const p = $('panel');
  if (!p.classList.contains('mengungkap')) return;
  p.classList.remove('mengungkap');
  for (const el of p.querySelectorAll('.ungkap')) el.classList.remove('ungkap');
}
// kamera: adegan baru didekati pelan; benda yang diamati ditatap
function kamera(baru) {
  const k = $('kam'), sc = $('scene');
  if (!k) return;
  sc.style.transform = '';
  if (!baru || reduced) return;
  k.classList.remove('dorong'); void k.offsetWidth; k.classList.add('dorong');
}
function condong(id) {
  if (BOT || reduced) return;
  const el = $('scene').querySelector(`[data-hot="${id}"]`);
  if (!el) return;
  const b = el.getBBox(), dx = clamp((0.5 - (b.x + b.width / 2) / 960) * 30, -2.8, 2.8), dy = clamp((0.5 - (b.y + b.height / 2) / 540) * 30, -2.8, 2.8);
  $('scene').style.transform = `scale(1.06) translate(${dx.toFixed(2)}%, ${dy.toFixed(2)}%)`;
}
// keterangan tempat dan waktu diketik di atas adegan, hanya saat berganti
function keterangan(teks) {
  if (!teks || teks === tampil.waktu) return;
  tampil.waktu = teks;
  const el = $('keterangan');
  if (!el || reduced) return;
  el.textContent = teks;
  el.style.setProperty('--n', teks.length);
  el.classList.remove('ketik'); void el.offsetWidth; el.classList.add('ketik');
}
// bar HUD bergeser dari nilai lama ke nilai baru, tidak melompat
const lebarBar = () => Object.fromEntries([...document.querySelectorAll('#hud .bar i')].map(i => [i.getAttribute('aria-label'), i.firstChild.style.width]));
function geserBar(lama) {
  if (reduced) return;
  for (const i of document.querySelectorAll('#hud .bar i')) {
    const b = i.firstChild, dari = lama[i.getAttribute('aria-label')], ke = b.style.width;
    if (!dari || dari === ke) continue;
    b.style.width = dari; void b.offsetWidth;
    b.style.transition = 'width .9s cubic-bezier(.3, .7, .2, 1)'; b.style.width = ke;
  }
}

/* ---------- batas waktu ---------- */
// hanya untuk momen panik; pengaturan disimpan per pemain: normal, panjang (dua kali), atau tanpa batas
const MODE_WAKTU = { normal: { t: 'Normal', kali: 1 }, panjang: { t: 'Panjang', kali: 2 }, mati: { t: 'Tanpa batas', kali: Infinity } };
function modeWaktu() { try { const v = localStorage.getItem('angkatan98-waktu'); return MODE_WAKTU[v] ? v : 'normal'; } catch (e) { return 'normal'; } }
const kaliWaktu = () => MODE_WAKTU[modeWaktu()].kali;
function aturWaktu() { const ks = Object.keys(MODE_WAKTU), v = ks.at((ks.indexOf(modeWaktu()) + 1) % ks.length); try { localStorage.setItem('angkatan98-waktu', v); } catch (e) { /* abaikan */ } }
function mulaiWaktu(detik) {
  const ms = detik * 1000 * kaliWaktu(), id = Math.random().toString(36).slice(2);
  S.ui.waktu = { id, ms, batas: Date.now() + ms };
  if (!BOT && isFinite(ms) && typeof window !== 'undefined') setTimeout(() => act('waktuHabis', id), ms + 50);
  return id;
}
function waktuHTML(label) {
  const w = S.ui.waktu;
  if (!w || !isFinite(w.ms)) return '';
  const sisa = Math.max(0, w.batas - Date.now());
  return `<div class="marah"><span class="label">${label}</span><div class="waktu-bar"><i style="--mulai:${Math.round(sisa / w.ms * 100)}%;animation-duration:${sisa}ms"></i></div></div>`;
}
const tombolWaktu = () => `<button type="button" class="chip" data-a="aturwaktu">Batas waktu: ${MODE_WAKTU[modeWaktu()].t}</button>`;
// ukuran teks disimpan per pemain; semua ukuran di halaman ikut membesar karena memakai rem
const UKURAN_TEKS = { normal: { t: 'Normal', px: 16 }, besar: { t: 'Besar', px: 18 }, lebih: { t: 'Sangat besar', px: 20 } };
function ukuranTeks() { try { const v = localStorage.getItem('angkatan98-teks'); return UKURAN_TEKS[v] ? v : 'normal'; } catch (e) { return 'normal'; } }
function terapkanTeks() { if (typeof document !== 'undefined') document.documentElement.style.fontSize = UKURAN_TEKS[ukuranTeks()].px + 'px'; }
function aturTeks() { const ks = Object.keys(UKURAN_TEKS), v = ks.at((ks.indexOf(ukuranTeks()) + 1) % ks.length); try { localStorage.setItem('angkatan98-teks', v); } catch (e) { /* abaikan */ } terapkanTeks(); }
const tombolTeks = () => `<button type="button" class="chip" data-a="aturteks">Ukuran teks: ${UKURAN_TEKS[ukuranTeks()].t}</button>`;
// akhir cerita yang pernah dicapai, lintas permainan
const KEY_ENDING = 'angkatan98-ending';
function endingTercapai() { try { return JSON.parse(localStorage.getItem(KEY_ENDING)) || []; } catch (e) { return []; } }
function catatEnding(id) { if (BOT || !id) return; try { const a = endingTercapai(); if (!a.includes(id)) localStorage.setItem(KEY_ENDING, JSON.stringify(a.concat(id))); } catch (e) { /* abaikan */ } }
function koleksiHTML() {
  const a = endingTercapai(), semua = Object.entries(ENDINGS);
  if (!a.length) return '';
  return `<div class="koleksi"><p class="label">Akhir yang pernah kamu capai: ${semua.filter(([id]) => a.includes(id)).length} dari ${semua.length}</p><ul>${semua.map(([id, E]) => `<li${a.includes(id) ? '' : ' class="belum"'}>${a.includes(id) ? E.judul : 'belum terbuka'}</li>`).join('')}</ul></div>`;
}

/* ---------- simpan ---------- */
const KEY = 'angkatan98-simpan';
function save() { if (BOT) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* penyimpanan tidak tersedia */ } }
// versi simpanan: naikkan setiap kali adegan atau isi state berubah sampai simpanan lama tidak cocok lagi.
// Simpanan v1 tidak punya kolom versi, jadi dianggap versi 1.
const VERSI_SIMPAN = 1;
// adegan yang diganti nama atau dihapus: id lama -> id baru. Diisi saat v2 mengganti kos1–kos7.
const PINDAH_ADEGAN = {};
let simpananUsang = false;
function cocokkan(d) {
  if (!d || (d.versi || 1) > VERSI_SIMPAN) return null;
  if (PINDAH_ADEGAN[d.node]) d.node = PINDAH_ADEGAN[d.node];
  if (!d.node || !NODES[d.node]) { simpananUsang = true; return null; }
  d.versi = VERSI_SIMPAN;
  return d;
}
function loadSave() { try { return cocokkan(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + '-babak'); } catch (e) { /* abaikan */ } CEKPOIN = null; }
// checkpoint: keadaan tepat sebelum babak dimulai, supaya ending pahit tidak memaksa mengulang satu jam permainan
const BABAK = ['b1_gerbang', 'b4_bus', 'b7_toko', 'b11_razia', 'b14_terminal', 'b18_semanggi'];
let CEKPOIN = null;
function simpanBabak(id) {
  CEKPOIN = JSON.stringify({ id, s: S });
  if (!BOT) try { localStorage.setItem(KEY + '-babak', CEKPOIN); } catch (e) { /* penyimpanan tidak tersedia */ }
}
// checkpoint yang adegannya sudah tidak ada di versi ini dianggap tidak ada
function bacaBabak() {
  let d = CEKPOIN;
  if (!d && !BOT) try { d = localStorage.getItem(KEY + '-babak'); } catch (e) { /* abaikan */ }
  if (!d) return null;
  try { const x = JSON.parse(d), id = PINDAH_ADEGAN[x.id] || x.id, s = cocokkan({ ...x.s, node: x.s.node }); return NODES[id] && s ? { id, s } : null; } catch (e) { return null; }
}
const adaBabak = () => !!bacaBabak();
function muatBabak() {
  const x = bacaBabak();
  if (!x) return;
  S = x.s; S.ending = null;
  go(x.id);
}
