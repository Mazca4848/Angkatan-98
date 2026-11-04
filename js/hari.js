/* Angkatan 98 · Hari yang Berulang: satu hari bertanggal di peta kampus mewakili kebiasaanmu selama berbulan-bulan.
   Pagi di kamar memakai layar kos lama (uang, surat Dika, tugas kader) ditambah mengisi tas. Sesudah keluar kamar,
   jam berjalan dari 08.00 sampai jam malam. Setiap kegiatan memakan jam; efeknya memakai slot lama (SLOT di modes.js). */

const JAM_MULAI = 8;
// ibu kos yang mulai takut mengunci pagar sejam lebih awal
const jamMalam = () => (genderKu() === 'P' ? 21 : 24) - (lapor('ibukos') >= 1 ? 1 : 0);
const fmtJam = j => `${String(Math.floor(j)).padStart(2, '0')}.${j % 1 ? '30' : '00'}`;
const JALAN_KAMPUS = 0.5, JALAN_LUAR = 1; // jam perjalanan: di dalam kampus dan kos, atau ke kampung dan Rawamangun

/* ---------- tempat ---------- */
// kawasan: kampus dan kos bersebelahan; luar butuh satu jam jalan kaki. buka: [jam buka, jam tutup]
const TEMPAT = {
  kamar: { nama: 'Kamar kos', kawasan: 'Kos', buka: [0, 24], peta: [70, 380, 150, 90] },
  lorong: { nama: 'Lorong kos', kawasan: 'Kos', buka: [0, 24], peta: [230, 410, 120, 60] },
  tamu: { nama: 'Ruang tamu', kawasan: 'Kos', buka: [6, 22], peta: [365, 410, 135, 60] },
  kelas: { nama: 'Ruang kelas', kawasan: 'Kampus', buka: [8, 16], peta: [90, 150, 160, 80] },
  dosen: { nama: 'Ruang dosen', kawasan: 'Kampus', buka: [9, 15], peta: [90, 240, 160, 60] },
  sekre: { nama: 'Sekretariat', kawasan: 'Kampus', buka: [10, 24], peta: [330, 170, 190, 110] },
  masjid: { nama: 'Masjid kampus', kawasan: 'Kampus', buka: [8, 22], peta: [330, 40, 150, 90] },
  senat: { nama: 'Ruang senat', kawasan: 'Kampus', buka: [8, 16], req: s => s.sorotan < 65, tutup: 'rektorat tidak lagi menerimamu', peta: [600, 40, 190, 90] },
  kantin: { nama: 'Kantin', kawasan: 'Kampus', buka: [8, 20], peta: [600, 170, 160, 90] },
  warung: { nama: 'Warung belakang', kawasan: 'Kampus', buka: [17, 24], peta: [800, 170, 130, 90] },
  kios: { nama: 'Kios fotokopi', kawasan: 'Kampus', buka: [8, 20], peta: [560, 330, 140, 70] },
  rawa: { nama: 'Kampung Rawa', kawasan: 'Luar kampus', buka: [8, 22], req: s => s.f.dapurUmum, tutup: 'belum ada yang kamu kenal di sana', peta: [40, 30, 0, 0] },
  rawamangun: { nama: 'Rawamangun', kawasan: 'Luar kampus', buka: [14, 20], peta: [0, 0, 0, 0] }
};
const luarKampus = id => TEMPAT[id].kawasan === 'Luar kampus';
// di dalam kos tidak memakan waktu
const ongkosJalan = (dari, ke) => dari === ke || (TEMPAT[dari].kawasan === 'Kos' && TEMPAT[ke].kawasan === 'Kos') ? 0 : luarKampus(dari) || luarKampus(ke) ? JALAN_LUAR : JALAN_KAMPUS;
const lamaJalan = (dari, ke) => ongkosJalan(dari, ke) ? `${ongkosJalan(dari, ke) * 60} menit jalan kaki` : 'bersebelahan';
const tempatBuka = (id, jam) => { const t = TEMPAT[id]; return (!t.req || t.req(S)) && jam >= t.buka[0] && jam < t.buka[1]; };
// kader sering ada di tempat tertentu
const KADER_TEMPAT = { laras: 'kantin', bimo: 'kantin', dimas: 'kantin', wahyu: 'sekre', mei: 'sekre', tigor: 'sekre', asep: 'rawa' };
const kaderDi = id => kaderAktif().filter(k => (k === 'asep' && !S.f.dapurUmum ? 'kantin' : KADER_TEMPAT[k]) === id);

/* ---------- kegiatan ---------- */
// slot: kunci SLOT lama, untuk efek dan mini game. jam: lama kegiatan. kel: kelompok di daftar pilihan
const KEGIATAN = [
  { id: 'kuliah', slot: 'kuliah', tempat: 'kelas', jam: 2 },
  { id: 'dosen', slot: 'dosen', tempat: 'dosen', jam: 1 },
  { id: 'baca', slot: 'baca', tempat: 'sekre', jam: 2, t: 'Membaca di rak sekretariat' },
  ...Object.keys(BUKU).map(b => ({ id: 'buku_' + b, slot: 'buku_' + b, tempat: 'sekre', jam: 1, kel: 'Ambil buku dari rak' })),
  { id: 'organisasi', slot: 'organisasi', tempat: 'sekre', jam: 3 },
  { id: 'ratna', slot: 'ratna', tempat: 'sekre', jam: 2 },
  { id: 'cetak', tempat: 'sekre', jam: 2, t: 'Cetak selebaran di mesin stensil', d: 'tiga ikat, masuk ke tasmu kalau muat', run: () => { S.f.selebaran = (S.f.selebaran || 0) + 3; apply({ sorotan: 2 }); if (S.tas && S.tas.length < 4 && !S.tas.includes('selebaran')) S.tas.push('selebaran'); return 'Kamu mencetak tiga ikat selebaran sampai tanganmu hitam kena tinta.'; } },
  ...Object.keys(KADER).map(k => ({ id: 'tuduh_' + k, tempat: 'sekre', jam: 1, kel: 'Rapat presidium: tuduh penyusup', req: () => aktif(k), t: `Tuduh ${KADER[k].nama}`, d: 'tidak bisa ditarik kembali', run: () => tuduhKader(k) })),
  { id: 'fikri', slot: 'fikri', tempat: 'masjid', jam: 2 },
  { id: 'yudi', slot: 'yudi', tempat: 'senat', jam: 2 },
  { id: 'damar', slot: 'damar', tempat: 'warung', jam: 2 },
  { id: 'selidiki', slot: 'selidiki', tempat: 'kantin', jam: 1 },
  { id: 'bagikan', tempat: 'kantin', jam: 1, t: 'Bagikan selebaran dari tas', d: 'orang membaca, intel juga', req: () => diTas('selebaran'), run: () => bagikanSelebaran() },
  { id: 'buletin', slot: 'buletin', tempat: 'kios', jam: 2 },
  { id: 'istirahat', slot: 'istirahat', tempat: 'kamar', jam: 2 },
  { id: 'alamat', slot: 'alamat', tempat: 'kamar', jam: 2 },
  { id: 'dika', slot: 'dika', tempat: 'kamar', jam: 1 },
  { id: 'telepon', slot: 'telepon', tempat: 'lorong', jam: 1 },
  { id: 'dapur', slot: 'dapur', tempat: 'rawa', jam: 3 },
  { id: 'titip', slot: 'titip', tempat: 'rawa', jam: 1 },
  { id: 'kerja', slot: 'kerja', tempat: 'rawamangun', jam: 3 }
].concat(Object.keys(KADER).map(k => ({ id: 'kader_' + k, slot: 'kader_' + k, tempat: null, jam: 1, kel: 'Ngobrol dengan kader' })));
const KEG = Object.fromEntries(KEGIATAN.map(k => [k.id, k]));
// buku di tas bisa dibaca di mana saja, lebih singkat
const BACA_TAS = { id: 'bacatas', slot: 'baca', jam: 1, t: 'Baca buku dari tasmu', d: 'satu jam, di mana saja' };
function kegiatanDi(tempat) {
  const ada = KEGIATAN.filter(k => (k.tempat === tempat || (k.id.startsWith('kader_') && kaderDi(tempat).includes(k.id.slice(6)))) && (!k.req || k.req()) && (!k.slot || !SLOT[k.slot].req || SLOT[k.slot].req()));
  if (tempat !== 'sekre' && tempat !== 'kamar' && diTas('buku') && S.buku.baca) ada.push(BACA_TAS);
  return ada;
}
const judulKeg = k => k.t || SLOT[k.slot].t;
const dKeg = k => k.d || (k.slot ? val(SLOT[k.slot].d) : '');

/* ---------- tas ---------- */
const BARANG = {
  radio: () => 'Radio kecil', foto: () => 'Foto keluarga', kamus: () => 'Kamus bahasa Inggris', catatan: () => 'Buku catatan kosong',
  buku: () => `Buku: ${BUKU[S.buku.baca].judul}${BUKU[S.buku.baca].terlarang ? ' (terlarang)' : ''}`,
  bukti: () => `Map bukti (${S.bukti.length})`,
  selebaran: () => `Selebaran (${S.f.selebaran} ikat)`,
  ktp: () => 'KTP palsu'
};
const barangPunya = () => [...S.bekal, ...(S.buku.baca ? ['buku'] : []), ...(S.bukti.length ? ['bukti'] : []), ...((S.f.selebaran || 0) > 0 ? ['selebaran'] : []), ...(S.f.ktpPalsu ? ['ktp'] : [])];
// sebelum ada tas (simpanan lama, prolog), bekal awal dianggap selalu dibawa
const diTas = k => (S.tas || S.bekal).includes(k) && barangPunya().includes(k);
function rapikanTas() { const punya = barangPunya(); S.tas = (S.tas || S.bekal.slice()).filter(k => punya.includes(k)).slice(0, 4); }
const tasHTML = () => `<div class="ask"><p class="label">Isi tas hari ini · ${S.tas.length} dari 4</p><div class="acts">${barangPunya().map(k => `<button type="button" class="chip" data-a="tas" data-v="${k}" aria-pressed="${S.tas.includes(k)}"${!S.tas.includes(k) && S.tas.length >= 4 ? ' disabled' : ''}>${BARANG[k]()}</button>`).join('')}</div><p class="fine">Yang tidak dibawa tetap di kamar. Razia di jalan memeriksa tas; penggeledahan kos memeriksa kamar.</p></div>`;

function bagikanSelebaran() {
  S.f.selebaran--; if (!S.f.selebaran) S.tas = S.tas.filter(k => k !== 'selebaran');
  apply({ massa: 3, sorotan: 3, iklim: 1, kuasa: -1 });
  return 'Kamu menyelipkan selebaran di meja-meja kantin. Beberapa orang membacanya sambil makan, satu orang melipatnya rapi ke saku.';
}
function tuduhKader(v) {
  const benar = v === S.penyusup && penyusupAktif();
  S.kader[v] = 'keluar';
  if (benar) { S.f.penyusupKetahuan = true; apply({ sorotan: -15, massa: 5 }); return `Tuduhanmu benar. ${KADER[v].nama} tidak membantah. Keesokan harinya ia menghilang dari kos.`; }
  apply({ massa: -10 }); return `Tuduhanmu salah. ${KADER[v].nama} menangis di depan presidium lalu keluar dari gerakan.`;
}
// razia di jalan: sekali sehari paling banyak, makin sering kalau Sorotan tinggi; yang diperiksa hanya isi tas
function raziaJalan() {
  if (S.m.raziaJalan || Math.random() >= clamp(S.sorotan / 250, 0.03, 0.35) * (S.f.kardiAwas ? 0.5 : 1)) return null;
  S.m.raziaJalan = true;
  const out = ['Di mulut gang, dua petugas menghentikan setiap orang yang lewat dan memeriksa tas.' + isyaratRazia()];
  if (diTas('buku') && BUKU[S.buku.baca].terlarang) { out.push(`Mereka menemukan ${BUKU[S.buku.baca].judul}. Bukunya disita, dan namamu dicatat.`); S.buku.baca = null; S.buku.sisa = 0; apply({ sorotan: 10 }); }
  if (diTas('bukti')) { const id = sitaBukti(S.bukti); out.push(`Map berisi ${id.length} bukti ikut disita.`); apply({ sorotan: 5 }); }
  if (diTas('selebaran')) { out.push('Selebaran di tasmu dirampas, dan petugas itu membacanya keras-keras di depan orang banyak.'); S.f.selebaran = 0; apply({ sorotan: 8 }); }
  if (out.length === 1) out.push(diTas('ktp') ? 'Mereka membaca KTP palsumu dan mengembalikannya tanpa bertanya.' : 'Tidak ada yang mereka cari di tasmu. Kamu boleh lewat.');
  rapikanTas();
  return out;
}

/* ---------- mode ---------- */
MODES.hari = {
  // lanjutan: simpanan lama yang berhenti di tengah kunjungan kos; uangnya sudah dihitung, jadi langsung ke pagi
  enter(n, lanjutan) {
    if (lanjutan) S.m = { step: 'uang', lines: ['Uang periode ini sudah dihitung sebelum kamu menutup permainan.'], slots: Array(6).fill(null), tugas: {}, out: [] };
    else MODES.kos.enter(n);
    Object.assign(S.m, { jam: JAM_MULAI, lokasi: 'kamar', peta: false, dilakukan: [], dikunjungi: ['kamar'], larut: false, log: [], catatan: null, suara: null, bd: {}, awal: snap() });
    rapikanTas();
  },
  panel(n) {
    const m = S.m;
    if (m.step === 'uang' || m.step === 'tugas') return MODES.kos.panel(n) + tasHTML();
    let h = meta(n, `pukul ${fmtJam(m.jam)} · jam malam ${fmtJam(jamMalam())}`);
    if (m.step === 'main') return h + panelMain(m);
    if (m.step === 'hasil') return h + `<section class="result" tabindex="-1"><p class="label">Halaman buku catatan</p><ul class="rules">${m.out.map(l => `<li>${l}</li>`).join('')}</ul>${m.ev ? `<div class="event"><p class="label">Kejadian</p><p>${m.ev}</p></div>` : ''}${deltasHTML(m.deltas)}<button type="button" class="btn" data-a="goto" data-v="${S.ending ? 'akhir' : n.next}">Lanjut</button></section>`;
    if (m.razia) h += `<div class="event"><p class="label">Razia di jalan</p>${m.razia.map(l => `<p>${l}</p>`).join('')}</div>`;
    if (m.catatan) h += `<div class="obs" tabindex="-1"><p>${m.catatan}</p></div>`;
    if (S.ui.dlg && !S.ui.dlg.selesai) return h + dlgHTML();
    if (m.suara && !m.peta) h += `<div class="kb suara"><b>${m.suara.siapa}</b><p>“${m.suara.k}”</p></div>`;
    if (S.ui.dlg) h += dlgHTML();
    if (m.peta) {
      const items = Object.entries(TEMPAT).filter(([id, t]) => id !== m.lokasi && (!t.req || t.req(S) || t.tutup)).map(([id, t]) => {
        const tiba = m.jam + ongkosJalan(m.lokasi, id), ok = id === 'kamar' || (tempatBuka(id, tiba) && tiba < jamMalam());
        return { a: 'ke', v: id, t: t.nama, d: lamaJalan(m.lokasi, id), dis: !ok, alasan: t.req && !t.req(S) ? t.tutup : tiba >= jamMalam() ? 'lewat jam malam' : `buka ${fmtJam(t.buka[0])}–${fmtJam(t.buka[1])}`, kel: t.kawasan };
      });
      return h + pilihanHTML(items.concat({ a: 'tutuppeta', t: 'Tetap di sini' }), 'Pergi ke mana?');
    }
    const ks = kegiatanDi(m.lokasi).map(k => ({ a: 'giat', v: k.id, t: judulKeg(k), d: `${k.jam} jam · ${dKeg(k)}`, dis: m.jam + k.jam > jamMalam(), alasan: 'tidak cukup waktu sebelum jam malam', kel: k.kel }));
    const pergi = m.lokasi === 'kamar' ? { a: 'tidur', t: 'Tutup hari ini', d: 'tidur, dan tulis harimu di buku catatan' } : { a: 'ke', v: 'kamar', t: TEMPAT[m.lokasi].kawasan === 'Kos' ? 'Masuk kamar' : 'Pulang ke kos', d: lamaJalan(m.lokasi, 'kamar'), kel: 'Pergi' };
    // benda di kamar memakai benda amatan kos lama; tempat lain memakai BENDA
    const amati = m.lokasi === 'kamar' ? (S.ui.obs && n.hots[S.ui.obs] ? obsHTML(n) : '') + chips(Object.entries(n.hots || {})) : bendaHTML(m.lokasi);
    return h + amati + bicaraHTML(n) + pilihanHTML(ks.concat({ a: 'peta', t: 'Buka peta', d: 'pergi ke tempat lain', kel: 'Pergi' }, pergi), `Di ${TEMPAT[m.lokasi].nama.toLowerCase()}`);
  },
  act(n, a, v) {
    const m = S.m;
    if (m.step === 'uang' || m.step === 'tugas') {
      if (a === 'tas') { const i = S.tas.indexOf(v); if (i >= 0) S.tas.splice(i, 1); else if (S.tas.length < 4 && barangPunya().includes(v)) S.tas.push(v); return render(); }
      MODES.kos.act(n, a, v);
      if (m.step === 'slot') { m.step = 'jalan'; m.lokasi = 'kamar'; render(); }
      return;
    }
    if (m.step === 'main') {
      const g = m.mg;
      if (a === 'mg' && !g.hasil) { jawabMain(g, v); return render('.mg'); }
      if (a === 'mglanjut' && g.hasil) { m.step = 'jalan'; selesaiKegiatan(KEG[m.mainId] || BACA_TAS, g.hasil.ok); return render('.obs'); }
      return;
    }
    if (m.step !== 'jalan') return;
    m.catatan = null; S.ui.obs = null;
    if (S.ui.dlg) { if (!S.ui.dlg.selesai) return; S.ui.dlg = null; }
    if (a === 'peta') { m.peta = true; m.razia = null; return render(); }
    if (a === 'tutuppeta') { m.peta = false; return render(); }
    if (a === 'ke' && TEMPAT[v] && v !== m.lokasi) {
      const tiba = m.jam + ongkosJalan(m.lokasi, v);
      if (v !== 'kamar' && (!tempatBuka(v, tiba) || tiba >= jamMalam())) {
        const t = TEMPAT[v];
        m.catatan = t.req && !t.req(S) ? `${t.nama}: ${t.tutup}.` : tiba >= jamMalam() ? `Kalau ke ${t.nama.toLowerCase()} sekarang, kamu lewat jam malam.` : `${t.nama} buka pukul ${fmtJam(t.buka[0])} sampai ${fmtJam(t.buka[1])}. Kamu akan tiba pukul ${fmtJam(tiba)}.`;
        return render('.obs');
      }
      const lewatLuar = luarKampus(v) || luarKampus(m.lokasi);
      m.jam = tiba; m.lokasi = v; m.peta = false; m.razia = lewatLuar ? raziaJalan() : null;
      if (!m.dikunjungi.includes(v)) m.dikunjungi.push(v);
      m.suara = suaraDi(v);
      return render();
    }
    if (a === 'tidur' && m.lokasi === 'kamar') return tutupHari(n);
    if (a === 'giat') {
      const k = v === 'bacatas' ? BACA_TAS : KEG[v];
      if (!k || m.jam + k.jam > jamMalam() || !kegiatanDi(m.lokasi).includes(k)) return;
      m.jam += k.jam; m.razia = null;
      if (k.slot && jenisMain(k.slot) === 'obrolan') { mulaiOb(k); return render('.dlg'); }
      if (k.slot && jenisMain(k.slot)) { m.step = 'main'; m.mainId = k.id; m.mg = buatMain(5, k.slot, 1); m.mg.hari = true; return render('.mg'); }
      selesaiKegiatan(k, true);
      return render('.obs');
    }
  },
  klik(n, id) {
    const m = S.m;
    if (m.step !== 'jalan') return;
    if (m.peta && TEMPAT[id]) return MODES.hari.act(n, 'ke', id);
    if (S.ui.dlg && !S.ui.dlg.selesai) return;
    // benda petunjuk: hasilnya tetap sepanjang hari
    const b = id.startsWith('bd_') && BENDA[m.lokasi] && BENDA[m.lokasi][id.slice(3)];
    if (b) { m.catatan = `<b>${b[0]}.</b> ${m.bd[id] = m.bd[id] || b[1](S)}`; S.ui.dlg = null; return render('.obs'); }
    if (WARGA[id]) { const d = bicaraHari(S).find(k => DIALOG[k].warga === id); if (d) { S.ui.dlg = null; return mulaiObrolan(d); } }
    const k = KEG[id] || KEG['kader_' + id];
    if (k && kegiatanDi(m.lokasi).includes(k)) return MODES.hari.act(n, 'giat', k.id);
  },
  actions(n) {
    const m = S.m;
    if (m.step === 'uang' || m.step === 'tugas') return MODES.kos.actions(n).concat(Math.random() < 0.2 ? barangPunya().map(v => ({ a: 'tas', v })) : []);
    if (m.step === 'main') return aksiBotMain(m.mg);
    if (m.step === 'hasil') return [{ a: 'goto', v: S.ending ? 'akhir' : n.next }];
    if (m.jam >= jamMalam()) return [m.lokasi === 'kamar' ? { a: 'tidur' } : { a: 'ke', v: 'kamar' }];
    if (m.peta) { const ke = Object.keys(TEMPAT).filter(id => id !== m.lokasi && tempatBuka(id, m.jam + ongkosJalan(m.lokasi, id)) && m.jam + ongkosJalan(m.lokasi, id) < jamMalam()); return ke.length ? ke.map(v => ({ a: 'ke', v })) : [{ a: 'tutuppeta' }]; }
    const ks = kegiatanDi(m.lokasi).filter(k => m.jam + k.jam <= jamMalam()).map(k => ({ a: 'giat', v: k.id }));
    if (m.lokasi === 'kamar' && (m.jam >= 20 || Math.random() < 0.15)) return [{ a: 'tidur' }];
    return ks.length && Math.random() < 0.6 ? ks : [{ a: 'peta' }, { a: 'ke', v: 'kamar' }];
  }
};
// kegiatan selesai: efek slot lama dijalankan sekali, lalu dicatat sebagai kebiasaan hari ini
function selesaiKegiatan(k, ok) {
  const m = S.m;
  if (k.slot) m.dilakukan.push(k.slot);
  const teks = !ok ? `${judulKeg(k)}: tidak berhasil, waktunya terbuang.` : k.run ? k.run() : SLOT[k.slot].run(1);
  m.catatan = teks; m.log.push(`${fmtJam(m.jam - k.jam)} · ${teks}`);
  if (S.ending) return tutupHari(NODES[S.node]);
  if (m.jam >= jamMalam() && m.lokasi !== 'kamar') { m.catatan += ` Sudah jam malam. Kamu pulang ke kos, dan ibu kos membukakan pagar sambil melihat jam.`; m.lokasi = 'kamar'; m.larut = true; }
}
function tutupHari(n) {
  const m = S.m;
  const buka = `Kamu menjalani hari seperti ini hampir setiap minggu sampai ${namaBulan(n.bulan)}.`;
  m.out = [buka, ...m.log, ...akibatBulan(m.dilakukan), ...tugasBulan(m), ...hariWarga(m)];
  const ev = pick(EVENTS)(); apply(ev.fx); m.ev = ev.t;
  if (S.cap > 0) S.cap--;
  m.deltas = diff(m.awal); m.step = 'hasil';
  render('.result');
}

/* ---------- gambar: peta kampus dan tempat ---------- */
function sPetaKampus(S) {
  const m = S.m || {};
  let o = bg(P) + gouge(401, 50, 0, 0, 960, 540, 30, 0.2, P2, 3);
  o += `<path d="M0 320 H960 M520 0 V540 M250 320 V540" stroke="${P2}" stroke-width="34"/><path d="M0 320 H960 M520 0 V540 M250 320 V540" stroke="${K}" stroke-width="2" stroke-dasharray="14 12"/>`;
  o += `<text x="20" y="312" ${MONO} font-size="14" fill="${K}">JALAN KAMPUS</text><text x="262" y="530" ${MONO} font-size="14" fill="${K}">GANG BELAKANG</text>`;
  for (const [id, t] of Object.entries(TEMPAT)) {
    const [x, y, w, h] = t.peta;
    if (!w) continue;
    const di = id === m.lokasi, buka = tempatBuka(id, (m.jam || 8) + ongkosJalan(m.lokasi || 'kamar', id));
    o += hot(id, t.nama, `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${di ? R : buka ? P : DIM}" stroke="${K}" stroke-width="4"/>${buka || di ? `<rect x="${x + w - 30}" y="${y + 4}" width="26" height="${h - 8}" fill="url(#hatch2)" opacity=".5"/>` : ''}<text x="${x + 10}" y="${y + h / 2 + 6}" ${ST} font-size="${Math.min(17, Math.floor((w - 40) / (t.nama.length * 0.6)))}" fill="${di ? P : buka ? K : P2}">${t.nama.toUpperCase()}</text>`);
  }
  // tempat di luar kampus: panah di tepi peta
  const panah = (id, x, y, arah) => { const t = TEMPAT[id]; if (t.req && !t.req(S)) return ''; const buka = tempatBuka(id, (m.jam || 8) + 1); return hot(id, t.nama, `<path d="M${x} ${y} l${arah * 40} -24 v14 h${arah * 60} v20 h${-arah * 60} v14z" fill="${buka ? R : DIM}" stroke="${K}" stroke-width="3"/><text x="${x + arah * 110}" y="${y + 6}" text-anchor="${arah > 0 ? 'start' : 'end'}" ${ST} font-size="16" fill="${K}">${t.nama.toUpperCase()} · 1 JAM</text>`); };
  o += panah('rawa', 40, 500, 1) + panah('rawamangun', 940, 470, -1);
  return o + `<text x="940" y="528" text-anchor="end" ${MONO} font-weight="700" font-size="20" fill="${R}">${fmtJam(m.jam || 8)}</text>`;
}
const ORANG_SLOT = [[60, 250, 0.85], [700, 240, 0.85], [380, 270, 0.8]];
const orangDi = (ids, slot = ORANG_SLOT) => ids.slice(0, slot.length).map((id, i) => { const [x, y, sc] = slot[i]; return C[id] ? hot(id, KADER[id] ? KADER[id].nama : SENIOR[id] || id, person(C[id], x, y, sc)) : ''; }).join('');
const GAMBAR_TEMPAT = {
  kamar: s => sKos(s, { v: (s.m.jam || 8) >= 18 ? 'malam' : '', kalender: namaBulan(s.bulan) }),
  lorong: () => CONTOH_KIT['Lorong kos'](),
  tamu: () => CONTOH_KIT['Ruang tamu ibu kos'](),
  kelas: () => KIT.ruang({ seed: 21 }) + KIT.papan(300, 60, 360, 170, { jenis: 'tulis', tulisan: ['Pasal 28 UUD 1945', 'kemerdekaan berserikat'] }) + person({ head: 'kotak', hair: 'uban', glasses: 'kotak', baju: 'batik' }, 720, 150, 0.9) + crowd(431, 8, 500, 1.4, DIM, 0, 960),
  dosen: () => CONTOH_KIT['Ruang dosen']() + hot('harsono', 'Pak Harsono', person({ head: 'kotak', hair: 'uban', glasses: 'bulat', baju: 'batik' }, 420, 140, 0.9)),
  sekre: s => sSekre(s, { v: 'kamis', hadir: kaderDi('sekre') }),
  masjid: () => KIT.ruang({ seed: 23, warna: P }) + `<path d="M380 400 V180 Q480 80 580 180 V400" fill="${P2}" stroke="${K}" stroke-width="6"/><path d="M0 430 H960" stroke="${GREEN}" stroke-width="40"/>` + KIT.lampu(200, 0, { panjang: 60 }) + KIT.lampu(760, 0, { panjang: 60 }) + (aktif('fikri') || !(S.f.seniorTangkap || []).includes('fikri') ? hot('fikri', 'Bang Fikri', person(C.fikri, 640, 200, 0.95)) : ''),
  senat: () => KIT.ruang({ seed: 25 }) + KIT.poster(80, 60, 220, 120, ['SENAT', 'MAHASISWA'], { warna: K, miring: 0 }) + KIT.telepon(820, 180) + KIT.meja(300, 340, 360) + hot('yudi', 'Mas Yudi', person(C.yudi, 380, 150, 0.95)),
  kantin: s => KIT.ruang({ seed: 27 }) + KIT.konter(40, 300, 300, 110) + KIT.poster(60, 80, 220, 90, ['NASI RAMES', 'Rp 1.500'], { warna: P, miring: 2 }) + KIT.meja(420, 380, 240) + KIT.meja(700, 380, 220) + orangDi(kaderDi('kantin'), [[400, 200, 0.85], [640, 210, 0.8], [800, 220, 0.75]]),
  warung: s => KIT.jalan({ seed: 29, malam: true, cakrawala: 280 }) + KIT.konter(80, 330, 380, 120) + KIT.lampu(270, 140, { panjang: 50 }) + KIT.poster(110, 230, 160, 70, ['KOPI', 'TUBRUK'], { warna: P, miring: -2 }) + (s.f.damarHilang ? '' : hot('damar', 'Bang Damar', person(C.damar, 560, 220, 0.95))),
  kios: () => KIT.jalan({ seed: 31 }) + KIT.konter(300, 330, 360, 120) + KIT.poster(330, 200, 300, 90, ['FOTOKOPI', 'JILID · KETIK'], { warna: R, miring: 0 }) + KIT.tiang(140, 330),
  rawa: s => KIT.jalan({ seed: 33, cakrawala: 260 }) + KIT.konter(80, 330, 300, 110) + KIT.poster(100, 220, 260, 80, ['DAPUR UMUM'], { warna: R, miring: -2 }) + hot('pakrt', 'Pak RT', person(C.pakRT, 460, 230, 0.9)) + orangDi(kaderDi('rawa'), [[700, 240, 0.85]]),
  rawamangun: () => KIT.ruang({ seed: 35 }) + KIT.meja(300, 360, 360) + KIT.kursi(340, 440) + person({ head: 'bulat', hair: 'belah', baju: 'kaus' }, 420, 230, 0.8) + KIT.jam(820, 90, 34, 15)
};
SCENES.petaKampus = sPetaKampus;
SCENES.tempat = s => { const t = (s.m && s.m.lokasi) || 'kamar'; return GAMBAR_TEMPAT[t](s) + gambarWarga(t); };
