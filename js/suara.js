/* Angkatan 98 · suara: semua disintesis dengan Web Audio API, tanpa berkas rekaman.
   Suara hanya menguatkan; setiap informasi tetap ada di teks. */
const Suara = (() => {
  const ADA = typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext);
  const TINGKAT = { nyala: { t: 'nyala', g: 0.8 }, pelan: { t: 'pelan', g: 0.35 }, mati: { t: 'mati', g: 0 } };
  let kumpul = null, ctx = null, master = null, putih = null, amb = { kunci: '', lapis: [] }, latar = {}, simpulTerakhir = null, jejak = {}, detakTerakhir = 0;

  function tingkat() { try { const v = localStorage.getItem('angkatan98-suara'); return TINGKAT[v] ? v : 'nyala'; } catch (e) { return 'nyala'; } }
  function atur() {
    const ks = Object.keys(TINGKAT), v = ks.at((ks.indexOf(tingkat()) + 1) % ks.length);
    try { localStorage.setItem('angkatan98-suara', v); } catch (e) { /* abaikan */ }
    if (master) master.gain.setTargetAtTime(TINGKAT[v].g, ctx.currentTime, 0.1);
  }
  // browser baru mengizinkan suara setelah klik atau tombol pertama
  function mulai() {
    if (!ADA) return;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = TINGKAT[tingkat()].g;
      const kompres = ctx.createDynamicsCompressor(); master.connect(kompres); kompres.connect(ctx.destination);
      putih = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = putih.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    if (typeof S !== 'undefined' && S) perbarui();
  }
  const siap = () => ctx && ctx.state === 'running' && tingkat() !== 'mati';

  /* ---------- bahan dasar ---------- */
  const gain = (v, ke = master) => { const g = ctx.createGain(); g.gain.value = v; g.connect(ke); return g; };
  const filter = (jenis, f, q = 1, ke) => { const x = ctx.createBiquadFilter(); x.type = jenis; x.frequency.value = f; x.Q.value = q; x.connect(ke); return x; };
  function derau(ke, mulaiDi = ctx.currentTime, lama = 0) { const s = ctx.createBufferSource(); s.buffer = putih; s.loop = !lama; s.connect(ke); s.start(mulaiDi, Math.random() * 1.5); if (lama) s.stop(mulaiDi + lama); else if (kumpul) kumpul.push(s); return s; }
  function nada(jenis, f, ke, mulaiDi = ctx.currentTime, lama = 0) { const o = ctx.createOscillator(); o.type = jenis; o.frequency.value = f; o.connect(ke); o.start(mulaiDi); if (lama) o.stop(mulaiDi + lama); else if (kumpul) kumpul.push(o); return o; }
  // semua sumber yang berulang di dalam satu lapisan dicatat supaya bisa dihentikan bersama
  function buatLapis(fn) { kumpul = []; const L = fn(); L.x = kumpul; kumpul = null; return L; }
  // amplop pendek: naik cepat, turun eksponensial
  function letup(v, lama, ke, t = ctx.currentTime) { const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + lama); g.connect(ke); return g; }
  function bunyiDerau(jenis, f, v, lama, t = ctx.currentTime, q = 1) { derau(filter(jenis, f, q, letup(v, lama, master, t)), t, lama + 0.05); }
  function bunyiNada(bentuk, f, v, lama, t = ctx.currentTime, turunKe) { const o = nada(bentuk, f, letup(v, lama, master, t), t, lama + 0.05); if (turunKe) o.frequency.exponentialRampToValueAtTime(turunKe, t + lama); return o; }
  const berulang = (ms, fn) => setInterval(() => { if (siap()) fn(); }, ms);

  /* ---------- lapisan latar ---------- */
  const LAPIS = {
    ruang: () => { const g = gain(0.035); derau(filter('lowpass', 280, 0.7, g)); return { g }; },
    ramai: () => { const g = gain(0.05), lfo = nada('sine', 0.13, gain(0.025, g.gain)); derau(filter('bandpass', 650, 0.7, g)); derau(filter('bandpass', 1300, 1.2, gain(0.4, g))); return { g }; },
    hujan: () => { const g = gain(0.045); derau(filter('highpass', 900, 0.5, g)); return { g, t: berulang(140, () => { if (Math.random() < 0.5) bunyiDerau('highpass', 3500, 0.015 * Math.random(), 0.03); }) }; },
    mesin: () => { const g = gain(0.06), o = nada('sawtooth', 42, filter('lowpass', 130, 1, g)); nada('sine', 0.4, gain(3, o.frequency)); return { g }; },
    angin: () => { const g = gain(0.045), f = filter('bandpass', 420, 0.6, g); derau(f); nada('sine', 0.07, gain(220, f.frequency)); return { g }; },
    api: () => ({ g: gain(1), t: berulang(90, () => { if (Math.random() < 0.35) bunyiDerau('highpass', 1800 + Math.random() * 2000, 0.02 * Math.random(), 0.02 + Math.random() * 0.04); }) }),
    kipas: () => ({ g: gain(1), t: berulang(1400, () => bunyiNada('triangle', 190, 0.012, 0.28, ctx.currentTime, 140)) }),
    jangkrik: () => ({ g: gain(1), t: berulang(950, () => { for (let i = 0; i < 3; i++) bunyiNada('sine', 4600, 0.006, 0.035, ctx.currentTime + i * 0.06); }) }),
    stensil: () => ({ g: gain(1), t: berulang(560, () => { bunyiDerau('bandpass', 1500, 0.035, 0.04, ctx.currentTime, 3); bunyiNada('square', 160, 0.008, 0.05); }) }),
    radio: () => { const g = gain(0.012), lfo = nada('sine', 0.3, gain(0.008, g.gain)); derau(filter('bandpass', 2400, 2, g)); return { g }; },
    lampu: () => { const g = gain(0.018); nada('sine', 100, g); nada('sine', 50, gain(0.6, g)); return { g }; },
    jam: () => ({ g: gain(1), t: berulang(1500, () => bunyiNada('square', 1700, 0.02, 0.015)) }),
    gitar: () => ({ g: gain(1), t: berulang(3200, () => { if (Math.random() < 0.6) bunyiNada('triangle', pick([196, 220, 262, 294, 330, 392]), 0.03, 1.1); }) })
  };
  // adegan yang sama bisa punya suasana berbeda menurut varian dan nodenya
  function suasana(n, id) {
    const sc = val(n.scene), v = n.v, l = [];
    if (id === 'akhir') return ['hujan'];
    if (['intro', 'b14_sekre', 'b17_komite', 'b10_kamar'].includes(id)) return id === 'intro' ? [] : ['ruang'];
    if (['kos', 'sekre', 'rumah', 'kontrakan', 'kamarDamar', 'papan', 'diskusi', 'laporan', 'lorongDpr', 'jauh', 'jenewa', 'ktm', 'koran', 'kubah', 'lobi'].includes(sc)) l.push('ruang');
    if (sc === 'kos') { l.push('kipas'); if (v === 'malam' || n.dering) l.push('jangkrik'); }
    if (sc === 'sekre') { if (v === 'stensil' || v === 'razia') l.push('stensil'); if (v === 'radio') l.push('radio'); if (v === 'kamis') l.push('gitar'); }
    if (['jalan', 'lapangan', 'gerbang', 'kubah', 'lobi', 'inspect', 'tps', 'toko', 'bank', 'terminal'].includes(sc)) l.push('ramai');
    if (['kota', 'mobil'].includes(sc)) l.push('hujan');
    if (['bus', 'mobil', 'terminal'].includes(sc)) l.push('mesin');
    if (['atap', 'gang'].includes(sc)) l.push('angin');
    if (sc === 'atap') l.push('api');
    if (sc === 'periksa') l.push('lampu', 'jam');
    if (sc === 'koran' && id === 'b11_tv') l.push('radio');
    return l;
  }
  function hentikan(L, t = 1.2) {
    L.g.gain.setTargetAtTime(0.0001, ctx.currentTime, t / 3);
    setTimeout(() => { if (L.t) clearInterval(L.t); try { L.g.disconnect(); } catch (e) { /* sudah lepas */ } (L.x || []).forEach(o => { try { o.stop(); } catch (e) { /* sudah berhenti */ } }); }, t * 1000 + 200);
  }
  function aturLatar(daftar) {
    const kunci = daftar.join('+');
    if (kunci === amb.kunci) return;
    amb.lapis.forEach(L => hentikan(L));
    amb = { kunci, lapis: daftar.map(id => { const L = buatLapis(LAPIS[id]), tujuan = L.g.gain.value; L.g.gain.setValueAtTime(0.0001, ctx.currentTime); L.g.gain.setTargetAtTime(tujuan, ctx.currentTime, 0.5); return L; }) };
  }

  /* ---------- lapisan keadaan: detak jantung, dengung rezim, dering ---------- */
  function lapisKeadaan(id, on, buat) {
    if (on && !latar[id]) latar[id] = buatLapis(buat);
    else if (!on && latar[id]) { hentikan(latar[id], 0.8); delete latar[id]; }
    return latar[id];
  }
  function jantung(bpm) { return { g: gain(1), bpm, t: setInterval(() => { if (!siap()) return; const t = ctx.currentTime; bunyiNada('sine', 62, 0.09, 0.12, t, 40); bunyiNada('sine', 58, 0.06, 0.12, t + 0.22, 38); }, 60000 / bpm) }; }
  function perbarui() {
    if (!siap()) return;
    const n = NODES[S.node]; if (!n) return;
    aturLatar(suasana(n, S.node));
    const takut = S.nyali < 20 || (n.mode === 'hide' && !S.ui.last);
    const bpm = n.mode === 'hide' ? 96 : S.nyali < 10 ? 110 : 84;
    if (latar.jantung && latar.jantung.bpm !== bpm) { hentikan(latar.jantung, 0.1); delete latar.jantung; }
    lapisKeadaan('jantung', takut && S.node !== 'akhir', () => jantung(bpm));
    // dengung rendah selama kuasa rezim masih berdiri menjelang Mei 1998
    const dengung = lapisKeadaan('rezim', S.bulan >= '1998-03' && S.bulan <= '1998-05' && (S.kuasa ?? 100) > 0 && S.node !== 'akhir', () => { const g = gain(0.0001); nada('sine', 55, g); nada('sine', 82.4, gain(0.5, g)); return { g }; });
    if (dengung) dengung.g.gain.setTargetAtTime(0.05 * (S.kuasa ?? 100) / 100, ctx.currentTime, 1);
    lapisKeadaan('dering', S.node === 'b7_dering' && !S.ui.last, () => ({ g: gain(1), t: berulang(2600, () => { const t = ctx.currentTime; for (const d of [0, 0.5]) { bunyiNada('sine', 440, 0.05, 0.4, t + d); bunyiNada('sine', 480, 0.05, 0.4, t + d); } }) }));
    pemicu(n);
  }

  /* ---------- bunyi sekali ---------- */
  const B = {
    kertas: () => bunyiDerau('bandpass', 3200, 0.04, 0.07, ctx.currentTime, 0.8),
    ketuk: () => bunyiNada('square', 1200, 0.015, 0.02),
    stempel: () => { bunyiNada('sine', 110, 0.25, 0.18, ctx.currentTime, 50); bunyiDerau('lowpass', 500, 0.12, 0.08); },
    kapur: () => { for (let i = 0; i < 3; i++) bunyiDerau('highpass', 2600, 0.03, 0.05, ctx.currentTime + i * 0.05, 2); },
    gedor: () => { for (let i = 0; i < 3; i++) { const t = ctx.currentTime + i * 0.38; bunyiNada('sine', 75, 0.4, 0.25, t, 40); bunyiDerau('lowpass', 400, 0.25, 0.15, t); } },
    truk: () => { const t = ctx.currentTime, g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 1.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 4); g.connect(master); nada('sawtooth', 38, filter('lowpass', 150, 1, g), t, 4.1); },
    peluit: () => { for (const d of [0, 0.7]) { const o = bunyiNada('sine', 2700, 0.05, 0.5, ctx.currentTime + d); nada('sine', 9, gain(60, o.frequency), ctx.currentTime + d, 0.55); } },
    langkah: (keras, cepat) => { for (let i = 0; i < 4; i++) { const t = ctx.currentTime + i * (cepat ? 0.22 : 0.45); bunyiNada('sine', 105, keras ? 0.18 : 0.06, 0.08, t, 60); bunyiDerau('lowpass', 600, keras ? 0.08 : 0.03, 0.05, t); } },
    statis: (lama = 1.2) => bunyiDerau('bandpass', 2600, 0.05, lama, ctx.currentTime, 1.5),
    tembakJauh: () => { for (let i = 0; i < 3; i++) bunyiDerau('lowpass', 260, 0.18, 0.4, ctx.currentTime + i * (0.3 + Math.random() * 0.5)); },
    sorak: () => { const t = ctx.currentTime, g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 1.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 5); g.connect(master); derau(filter('bandpass', 900, 0.6, g), t, 5.1); },
    koin: () => { bunyiNada('sine', 2500, 0.04, 0.15); bunyiNada('sine', 3300, 0.03, 0.2, ctx.currentTime + 0.08); },
    bip: () => { for (let i = 0; i < 3; i++) bunyiNada('square', 2000, 0.02, 0.07, ctx.currentTime + i * 0.12); },
    mobil: () => { const t = ctx.currentTime, o = nada('sawtooth', 60, filter('lowpass', 300, 1, letup(0.08, 2.5, master, t)), t, 2.6); o.frequency.linearRampToValueAtTime(90, t + 2); }
  };
  // bunyi saat masuk adegan tertentu, dan saat keadaan di dalam adegan berubah
  const MASUK = { b11_razia: 'truk', b11_lari: 'peluit', b11_mobil: 'mobil', b14_sekre: 'statis', b11_tv: 'statis', b17_lobi: 'sorak', teror: 'statis', b18_semanggi: 'sorak' };
  function pemicu(n) {
    if (S.node !== simpulTerakhir) {
      simpulTerakhir = S.node; jejak = {};
      if (MASUK[S.node]) B[MASUK[S.node]]();
    }
    const m = S.m || {};
    if (n.mode === 'hide' && m.cue && jejak.cue !== m.cue) { jejak.cue = m.cue; const dekat = m.spot && m.dekat && SPOTS[m.dekat].area === SPOTS[m.spot].area; B.langkah(dekat, false); }
    if (n.mode === 'run' && !m.res && jejak.simpang !== m.j) { jejak.simpang = m.j; B.langkah(true, true); if (m.j && Math.random() < 0.4) B.peluit(); }
    if (S.node === 'b18_semanggi' && m.r === 2 && !m.res && !jejak.tembak) { jejak.tembak = true; B.tembakJauh(); }
  }
  // detak waktu untuk hitung mundur: makin cepat saat waktunya hampir habis
  if (ADA) setInterval(() => {
    if (!siap() || typeof S === 'undefined' || !S || !S.ui) return;
    const w = S.ui.waktu, k = S.m && S.m.kata, batas = w && isFinite(w.ms) ? w.batas : k && isFinite(k.ms) ? k.batas : 0, ms = w && isFinite(w.ms) ? w.ms : k ? k.ms : 0;
    if (!batas || S.ui.last) return;
    const sisa = batas - Date.now(); if (sisa <= 0) return;
    const jeda = sisa < ms * 0.25 ? 380 : 1000;
    if (Date.now() - detakTerakhir >= jeda) { detakTerakhir = Date.now(); bunyiNada('square', sisa < ms * 0.25 ? 1900 : 1400, 0.025, 0.02); }
  }, 120);

  // bunyi untuk aksi pemain, sebelum aksinya dijalankan
  function aksi(a, v) {
    if (!siap()) return;
    const id = S.node;
    if (a === 'waktuHabis' && id === 'b11_razia') return B.gedor();
    if (a === 'ambil') return B.stempel();
    if (a === 'titik' || a === 'ulang') return B.kapur();
    if (a === 'kata' || a === 'kataHapus') return B.ketuk();
    if (a === 'aksi' && v === 'pager') return B.bip();
    if (a === 'aksi' && v === 'balas') return B.koin();
    if (a === 'putus' && id === 'b11_razia') return;
    if (['choose', 'opt', 'slot', 'surat', 'mg', 'putus', 'tugas', 'kota', 'aksi', 'spot', 'arah', 'next', 'goto', 'selesai', 'jalani', 'mglanjut', 'rn', 'ok'].includes(a)) B.kertas();
  }

  if (ADA) for (const ev of ['pointerdown', 'keydown']) document.addEventListener(ev, mulai);
  return { mulai, atur, perbarui, aksi, tingkat: () => TINGKAT[tingkat()].t };
})();
