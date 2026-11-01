// Uji otomatis: bot memainkan permainan acak sampai tamat dan melaporkan error.
// Jalankan: node tests/bot.js [jumlah_permainan]
const fs = require('fs'), vm = require('vm'), path = require('path');
const N = Number(process.argv[2]) || 200;
const ctx = { console, setTimeout: f => f(), requestAnimationFrame: f => f() };
vm.createContext(ctx);
for (const f of ['art', 'scenes', 'kit', 'engine', 'modes', 'minigame', 'story1', 'story2', 'story3', 'story4', 'dialog', 'selingan', 'isyarat']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
}
const hasil = vm.runInContext(`
BOT = true;
const r = { tunggal: {}, error: 0, ending: {}, langkah: [], dikunjungi: {}, pesan: [], kabar: { cek: 0, sebar: 0 } };
const main = (mulai, persiapan) => {
  S = fresh(); go('intro'); if (persiapan) persiapan(); go(mulai);
  let langkah = 0, kabarDi = null;
  while (S.node !== 'akhir' && langkah < 5000) {
    const n = NODES[S.node];
    const panel = MODES[n.mode || 'story'].panel(n); SCENES[val(n.scene)](S, n); hudHTML(n); notesHTML();
    // aturan pilihan: setiap daftar paling banyak 4 tombol; daftar satu tombol dicatat
    for (const ol of panel.split('<ol class="choices">').slice(1).map(x => x.split('</ol>')[0])) {
      const jml = ol.split('<li>').length - 1;
      if (jml > 4) throw new Error('daftar pilihan ' + jml + ' tombol di ' + S.node);
      if (jml === 1) r.tunggal[S.node] = 1;
    }
    if (S.ui.kabar && !S.ui.last && kabarDi !== S.node) { kabarDi = S.node; if (Math.random() < 0.3) { const a = Math.random() < 0.5 || n.mode ? 'cek' : 'sebar'; act(a, Math.floor(Math.random() * S.ui.kabar.length)); r.kabar[a]++; continue; } }
    const opsi = actions();
    if (!opsi.length) throw new Error('buntu di ' + S.node);
    const x = opsi[Math.floor(Math.random() * opsi.length)];
    act(x.a, x.v); langkah++; r.dikunjungi[S.node] = true;
    if (S.nyali <= 0 && !S.ending) throw new Error('nyali 0 tapi permainan lanjut di ' + S.node);
    if (!(S.uang.tunai >= 0) || !(S.uang.utang >= 0)) throw new Error('uang tidak sah di ' + S.node + ': ' + JSON.stringify(S.uang));
    for (const k of ['pengaruh', 'massa', 'nyali', 'sorotan', 'jejak']) if (!(S[k] >= 0 && S[k] <= 100)) throw new Error(k + ' di luar rentang di ' + S.node);
    for (const [id, t] of Object.entries(S.takut || {})) if (!(t >= 0 && t <= 100)) throw new Error('takut ' + id + ' di luar rentang di ' + S.node);
    for (const [id, d] of Object.entries(S.dekat || {})) if (!(d >= 0 && d <= 8)) throw new Error('kedekatan ' + id + ' di luar rentang di ' + S.node);
    for (const [id, h] of Object.entries(S.hati || {})) if (!(h >= -12 && h <= 12)) throw new Error('afeksi ' + id + ' di luar rentang di ' + S.node);
    if (S.ui.dlg) { r.obrolan = (r.obrolan || 0) + 1; dlgHTML(); }
  }
  if (S.node !== 'akhir') throw new Error('tidak tamat, berhenti di ' + S.node);
  MODES.akhir.panel(NODES.akhir);
  r.ending[S.ending] = (r.ending[S.ending] || 0) + 1; r.langkah.push(langkah);
};
const jenewa = () => { S.f.paspor = true; S.uang.usd = 200; S.ratna = 3; S.f.damarHilang = true; S.f.buronResume = 4; S.pengaruh = 40; S.kuasa = 20; };
for (let g = 0; g < ${N}; g++) {
  try { g % 5 === 4 ? main('b13_bandara', jenewa) : main('p_rumah'); }
  catch (e) { r.error++; if (r.pesan.length < 5) r.pesan.push(e.message); }
}
r.belum = Object.keys(NODES).filter(k => !r.dikunjungi[k] && k !== 'intro' && k !== 'p_rumah');
JSON.stringify(r);
`, ctx);
const r = JSON.parse(hasil), l = r.langkah.sort((a, b) => a - b);
console.log(`permainan: ${N} · error: ${r.error}`);
r.pesan.forEach(p => console.log('  ' + p));
console.log('ending:', r.ending);
console.log('langkah per permainan: median', l[Math.floor(l.length / 2)], '· min', l[0], '· maks', l.at(-1));
console.log('bab yang tidak pernah dikunjungi:', r.belum.join(', ') || '-');
console.log('kabar dicek:', r.kabar.cek, '· diteruskan:', r.kabar.sebar);
console.log('langkah obrolan:', r.obrolan || 0);
console.log('adegan dengan satu pilihan saja:', Object.keys(r.tunggal).length, Object.keys(r.tunggal).slice(0, 12).join(', '));
process.exitCode = r.error ? 1 : 0;
