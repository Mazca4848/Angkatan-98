// Membangun Angkatan 98 dari index.html dan js/*.js menjadi satu berkas HTML.
//
//   node tools/build.mjs artifact            dist/angkatan98.html (halaman artifact claude.ai)
//   node tools/build.mjs android [--naikkan] www/index.html proyek Android; --naikkan menaikkan versionCode
//   node tools/build.mjs kit                 dist/galeri-kit.html (galeri kit adegan untuk pengembang)
//   node tools/build.mjs semua               ketiganya
//
// Lokasi proyek Android bisa diganti lewat ANDROID_DIR. GitHub Pages memakai index.html apa adanya, tanpa build.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ANDROID = process.env.ANDROID_DIR || resolve(ROOT, '..', 'Documents', 'angkatan98-android');
const DIST = join(ROOT, 'dist');
const sumber = readFileSync(join(ROOT, 'index.html'), 'utf8');
const FONT_GOOGLE = /<link rel="preconnect"[^>]*>\s*<link rel="preconnect"[^>]*>\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/;

// semua <script src="js/…"> diganti isi berkasnya; berkas js yang tidak dimuat index.html dilaporkan
function inlineSkrip(html) {
  const dipakai = new Set();
  const out = html.replace(/<script src="(js\/[a-z0-9-]+\.js)"><\/script>/g, (_, f) => {
    const js = readFileSync(join(ROOT, f), 'utf8');
    if (js.includes('</script')) throw new Error(`${f} berisi "</script", tidak bisa di-inline`);
    dipakai.add(f);
    return `<script>\n${js}\n</script>`;
  });
  if (/<script src="js\//.test(out)) throw new Error('masih ada <script src="js/…"> yang tidak terbaca');
  const lupa = readdirSync(join(ROOT, 'js')).map(f => 'js/' + f).filter(f => f.endsWith('.js') && !dipakai.has(f));
  if (lupa.length) console.warn('peringatan: berkas ini tidak dimuat index.html:', lupa.join(', '));
  return out;
}

function artifact() {
  let out = inlineSkrip(sumber);
  // kerangka artifact sudah menyediakan doctype, head, dan body
  out = out.replace(/<!doctype html>\s*<html lang="id">\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/, '');
  out = out.replace('<title>Angkatan 98</title>', '<title>Angkatan 98</title>\n<meta name="claude:viewport-fit-sides" content="cover">');
  out = out.replace(/<\/head>\s*<body>\s*/, '').replace(/<\/body>\s*<\/html>\s*$/, '');
  if (/<head>|<body>/.test(out)) throw new Error('artifact: tag head/body masih tersisa');
  mkdirSync(DIST, { recursive: true });
  writeFileSync(join(DIST, 'angkatan98.html'), out);
  console.log(`artifact: dist/angkatan98.html (${Math.round(out.length / 1024)} KB)`);
}

// Android berjalan offline: font dari www/fonts (lisensi OFL), padding safe-area dari Capacitor
function android(naikkan) {
  if (!existsSync(ANDROID)) throw new Error(`proyek Android tidak ditemukan di ${ANDROID} (atur ANDROID_DIR)`);
  if (!FONT_GOOGLE.test(sumber)) throw new Error('android: link Google Fonts di index.html berubah, perbarui FONT_GOOGLE');
  const fontLokal = `<style>
@font-face { font-family: "Courier Prime"; font-weight: 400; font-style: normal; src: url("fonts/CourierPrime-Regular.ttf") format("truetype"); }
@font-face { font-family: "Courier Prime"; font-weight: 700; font-style: normal; src: url("fonts/CourierPrime-Bold.ttf") format("truetype"); }
@font-face { font-family: "Courier Prime"; font-weight: 400; font-style: italic; src: url("fonts/CourierPrime-Italic.ttf") format("truetype"); }
@font-face { font-family: "Saira Stencil One"; font-weight: 400; font-style: normal; src: url("fonts/SairaStencilOne-Regular.ttf") format("truetype"); }
:root { padding-top: var(--safe-area-inset-top, env(safe-area-inset-top, 0px)); padding-bottom: var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)); }
</style>`;
  const fonts = join(ANDROID, 'www', 'fonts');
  for (const f of ['CourierPrime-Regular.ttf', 'CourierPrime-Bold.ttf', 'CourierPrime-Italic.ttf', 'SairaStencilOne-Regular.ttf']) if (!existsSync(join(fonts, f))) throw new Error(`android: font hilang: www/fonts/${f}`);
  const out = inlineSkrip(sumber).replace(FONT_GOOGLE, fontLokal);
  writeFileSync(join(ANDROID, 'www', 'index.html'), out);
  console.log(`android: ${join(ANDROID, 'www', 'index.html')} (${Math.round(out.length / 1024)} KB)`);

  const gradle = join(ANDROID, 'android', 'app', 'build.gradle');
  let g = readFileSync(gradle, 'utf8');
  const kode = Number((g.match(/versionCode (\d+)/) || [])[1]), nama = (g.match(/versionName "([^"]+)"/) || [])[1];
  if (naikkan) { g = g.replace(/versionCode \d+/, `versionCode ${kode + 1}`); writeFileSync(gradle, g); console.log(`android: versionCode ${kode} → ${kode + 1} (versionName masih "${nama}", ubah manual kalau perlu)`); }
  else console.log(`android: versionCode ${kode}, versionName "${nama}". Play Store menolak versionCode yang sama: pakai --naikkan sebelum membuat AAB baru.`);
  console.log('android: langkah berikutnya: npx cap sync android, lalu gradlew bundleRelease (JAVA_HOME dan ANDROID_HOME di android-build)');
}

// galeri kit: pola SVG dari index.html + art.js, scenes.js, kit.js
function kit() {
  const defs = (sumber.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/) || [])[0];
  if (!defs) throw new Error('kit: blok <defs> pola SVG tidak ditemukan di index.html');
  const js = ['art', 'scenes', 'kit'].map(f => readFileSync(join(ROOT, 'js', f + '.js'), 'utf8')).join('\n');
  const out = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Galeri kit adegan</title>
<style>body{margin:0;padding:16px;background:#221f1b;color:#d8ceb6;font:14px "Courier New",monospace}h1{font-size:18px}section{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}figure{margin:0}svg.k{width:100%;height:auto;background:#e8e0cb;display:block}figcaption{padding:4px 0}</style></head><body>
${defs}<h1>Galeri kit adegan</h1><h2>Contoh rakitan</h2><section id="contoh"></section><h2>Bagian</h2><section id="bagian"></section>
<script>${js}
const SAMPEL = { pintu: () => KIT.pintu(400, 150, 140, 300) + KIT.pintu(620, 150, 140, 300, { terbuka: true }), jendela: () => KIT.jendela(300, 100, 360, 260, true), pagar: () => KIT.pagar(100, 200, 760, 160), meja: () => KIT.meja(300, 300, 360), konter: () => KIT.konter(260, 280, 440, 120), kursi: () => KIT.kursi(440, 420, 1.6), rak: () => KIT.rak(140, 80, 300, 380) + KIT.rak(520, 80, 300, 380, { isi: 'botol' }), lemari: () => KIT.lemari(380, 120, 200, 340), kasur: () => KIT.kasur(300, 380), papan: () => KIT.papan(80, 100, 360, 220, { tulisan: ['RAPAT', 'AKSI', 'BUKU'] }) + KIT.papan(500, 100, 380, 220, { jenis: 'tulis', tulisan: ['Kampus -> Senayan', 'air, odol, toa'] }), poster: () => KIT.poster(360, 120, 240, 300, ['KAMPUS', 'BUKAN', 'BARAK']), jam: () => KIT.jam(480, 270, 120, 9), telepon: () => KIT.telepon(450, 200), foto: () => KIT.foto(420, 160, 120, 150), lampu: () => KIT.lampu(480, 0, { panjang: 120 }), kipas: () => KIT.kipas(480, 200), pohon: () => KIT.pohon(480, 500, 1.4), tiang: () => KIT.tiang(480, 520, 420), motor: () => KIT.motor(480, 420, 2), bajaj: () => KIT.bajaj(480, 440, 2), kopaja: () => KIT.kopaja(480, 440, 1.6) , metromini: () => KIT.kopaja(480, 440, 1.6, { jenis: 'metromini' }), taksi: () => KIT.taksi(480, 440, 2.2) };
const kartu = (judul, svg) => '<figure><svg class="k" viewBox="0 0 960 540"><g filter="url(#rough)">' + svg + '</g></svg><figcaption>' + judul + '</figcaption></figure>';
document.getElementById('contoh').innerHTML = Object.entries(CONTOH_KIT).map(([k, f]) => kartu(k, f())).join('');
document.getElementById('bagian').innerHTML = Object.entries(SAMPEL).map(([k, f]) => kartu('KIT.' + k, f())).join('');
const kurang = Object.keys(KIT).filter(k => !SAMPEL[k] && !['ruang', 'jalan'].includes(k)); if (kurang.length) document.body.insertAdjacentHTML('beforeend', '<p>Belum ada contoh: ' + kurang.join(', ') + '</p>');
</script></body></html>`;
  mkdirSync(DIST, { recursive: true });
  writeFileSync(join(DIST, 'galeri-kit.html'), out);
  console.log('kit: dist/galeri-kit.html');
}

const [target, ...opsi] = process.argv.slice(2);
const kerja = { artifact, android: () => android(opsi.includes('--naikkan')), kit, semua: () => { artifact(); kit(); android(opsi.includes('--naikkan')); } }[target];
if (!kerja) { console.error('pakai: node tools/build.mjs artifact | android [--naikkan] | kit | semua'); process.exit(1); }
kerja();
