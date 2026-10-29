// Uji otomatis: bot memainkan permainan acak sampai tamat dan melaporkan error.
// Jalankan: node tests/bot.js [jumlah_permainan]
const fs = require('fs'), vm = require('vm'), path = require('path');
const N = Number(process.argv[2]) || 200;
const ctx = { console, setTimeout: f => f(), requestAnimationFrame: f => f() };
vm.createContext(ctx);
for (const f of ['art', 'scenes', 'engine', 'modes', 'story1', 'story2', 'story3', 'story4']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
}
const hasil = vm.runInContext(`
BOT = true;
const r = { error: 0, ending: {}, langkah: [], dikunjungi: {}, pesan: [] };
const main = (mulai, persiapan) => {
  S = fresh(); go('intro'); if (persiapan) persiapan(); go(mulai);
  let langkah = 0;
  while (S.node !== 'akhir' && langkah < 5000) {
    const n = NODES[S.node];
    MODES[n.mode || 'story'].panel(n); SCENES[val(n.scene)](S, n); hudHTML(n); notesHTML();
    const opsi = actions();
    if (!opsi.length) throw new Error('buntu di ' + S.node);
    const x = opsi[Math.floor(Math.random() * opsi.length)];
    act(x.a, x.v); langkah++; r.dikunjungi[S.node] = true;
    for (const k of ['pengaruh', 'massa', 'nyali', 'sorotan', 'jejak']) if (!(S[k] >= 0 && S[k] <= 100)) throw new Error(k + ' di luar rentang di ' + S.node);
  }
  if (S.node !== 'akhir') throw new Error('tidak tamat, berhenti di ' + S.node);
  MODES.akhir.panel(NODES.akhir);
  r.ending[S.ending] = (r.ending[S.ending] || 0) + 1; r.langkah.push(langkah);
};
const jenewa = () => { S.f.paspor = true; S.uang.usd = 200; S.ratna = 3; S.f.damarHilang = true; S.f.buronResume = 4; S.pengaruh = 40; };
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
process.exitCode = r.error ? 1 : 0;
