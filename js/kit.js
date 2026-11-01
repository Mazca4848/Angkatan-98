/* Angkatan 98 · kit adegan: bagian-bagian latar yang bisa dirakit untuk tempat baru di peta.
   Semua bagian mengembalikan string SVG di kanvas 960×540, memakai palet dan tekstur cukil kayu dari art.js dan scenes.js.
   Lihat galeri dengan: node tools/build.mjs kit, lalu buka dist/galeri-kit.html */

const KIT = {
  /* ---------- ruang dasar ---------- */
  // ruangan: dinding bertekstur, lantai gelap, opsional gelap malam
  ruang: ({ seed = 1, warna = P, lantai = 420, malam = false } = {}) => wall(seed, warna) + (malam ? `<rect width="960" height="${lantai}" fill="${NIGHT}" opacity=".45"/>` : '') + floor(lantai, seed + 1),
  // jalanan luar: langit, deretan bangunan, aspal dengan marka
  jalan: ({ seed = 1, malam = false, cakrawala = 300 } = {}) => {
    let o = malam ? nightSky(seed) : bg(P);
    const r = rng(seed); let x = 0, d = `M0 ${cakrawala}`;
    while (x < 960) { const w = 60 + r() * 90, h = 60 + r() * 140; d += ` V${cakrawala - h} H${(x + w).toFixed(0)}`; x += w; }
    o += `<path d="${d} V${cakrawala} Z" fill="${malam ? DIM : P2}" stroke="${K}" stroke-width="3"/>`;
    o += `<rect y="${cakrawala}" width="960" height="${540 - cakrawala}" fill="${malam ? '#22201c' : K}"/>` + gouge(seed + 2, 30, 0, cakrawala + 10, 960, 540 - cakrawala - 10, 40, 0, malam ? DIM : P2, 2);
    return o + `<path d="M0 ${cakrawala + 120} H960" stroke="${P}" stroke-width="5" stroke-dasharray="40 30"/>`;
  },

  /* ---------- bagian bangunan ---------- */
  pintu: (x, y, w = 90, h = 200, { terbuka = false, warna = P2 } = {}) => `<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 8}" fill="${K}"/>` + (terbuka
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${DARK}"/><path d="M${x} ${y} L${x + w * 0.3} ${y + 12} V${y + h - 6} L${x} ${y + h}Z" fill="${warna}" stroke="${K}" stroke-width="3"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${warna}" stroke="${K}" stroke-width="3"/><rect x="${x + 12}" y="${y + 14}" width="${w - 24}" height="${h * 0.35}" fill="none" stroke="${K}" stroke-width="2.5"/><circle cx="${x + w - 16}" cy="${y + h * 0.55}" r="5" fill="${K}"/>`),
  jendela: (x, y, w = 200, h = 160, malam = false) => winFrame(x, y, w, h, malam),
  pagar: (x, y, w, h = 90) => { let d = ''; for (let i = x; i <= x + w; i += 22) d += `M${i} ${y} V${y + h}`; return `<path d="${d} M${x} ${y + 14} H${x + w} M${x} ${y + h - 14} H${x + w}" stroke="${K}" stroke-width="5"/>`; },

  /* ---------- perabot ---------- */
  meja: (x, y, w = 260) => table(x, y, w),
  konter: (x, y, w = 300, h = 90) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P2}" stroke="${K}" stroke-width="5"/><rect x="${x}" y="${y}" width="${w}" height="14" fill="${K}"/><rect x="${x + w * 0.6}" y="${y + 18}" width="${w * 0.4 - 4}" height="${h - 22}" fill="url(#hatch)"/>`,
  kursi: (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0 0 V-90 M50 0 V-40 M0 -40 H54 M0 -90 H10" stroke="${K}" stroke-width="8" fill="none"/><rect x="-4" y="-46" width="58" height="10" fill="${K}"/></g>`,
  rak: (x, y, w = 200, h = 260, { tingkat = 4, isi = 'buku', seed = 3 } = {}) => {
    const r = rng(seed); let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${K}"/>`;
    for (let j = 0; j < tingkat; j++) {
      const ty = y + (j + 1) * h / tingkat;
      o += `<path d="M${x} ${ty} H${x + w}" stroke="${P2}" stroke-width="4"/>`;
      if (isi === 'kosong') continue;
      for (let bx = x + 8; bx < x + w - 14; bx += isi === 'botol' ? 26 : 16 + r() * 6) {
        const bh = (h / tingkat) * (0.55 + r() * 0.3);
        o += isi === 'botol' ? `<rect x="${bx}" y="${ty - bh}" width="16" height="${bh}" rx="6" fill="${r() < 0.3 ? R : P2}" stroke="${K}" stroke-width="1.5"/>` : `<rect x="${bx.toFixed(0)}" y="${(ty - bh).toFixed(0)}" width="12" height="${bh.toFixed(0)}" fill="${r() < 0.2 ? R : P2}" stroke="${K}" stroke-width="1.5"/>`;
      }
    }
    return o;
  },
  lemari: (x, y, w = 160, h = 280) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P2}" stroke="${K}" stroke-width="5"/><path d="M${x + w / 2} ${y} V${y + h}" stroke="${K}" stroke-width="3"/><circle cx="${x + w / 2 - 10}" cy="${y + h / 2}" r="4" fill="${K}"/><circle cx="${x + w / 2 + 10}" cy="${y + h / 2}" r="4" fill="${K}"/><rect x="${x + w / 2 + 3}" y="${y + 3}" width="${w / 2 - 6}" height="${h - 6}" fill="url(#hatch2)" opacity=".5"/>`,
  kasur: (x, y, w = 320) => `<rect x="${x}" y="${y}" width="${w}" height="56" fill="url(#sarung)" stroke="${K}" stroke-width="5"/><rect x="${x + 10}" y="${y - 22}" width="90" height="28" rx="12" fill="${P}" stroke="${K}" stroke-width="3"/>`,

  /* ---------- benda dinding ---------- */
  papan: (x, y, w = 260, h = 160, { jenis = 'gabus', tulisan = [] } = {}) => jenis === 'tulis'
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#26302a" stroke="${K}" stroke-width="10"/>` + tulisan.map((t, i) => `<text x="${x + 18}" y="${y + 34 + i * 26}" ${MONO} font-size="18" fill="${P2}">${esc(t)}</text>`).join('')
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P2}" stroke="${K}" stroke-width="6"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" fill="url(#dots)"/>` + tulisan.map((t, i) => `<g transform="rotate(${i % 2 ? 3 : -3} ${x + 20 + i * 70} ${y + 40})"><rect x="${x + 14 + i * 70}" y="${y + 14}" width="60" height="70" fill="${i % 3 === 1 ? R : P}" stroke="${K}" stroke-width="2"/><text x="${x + 44 + i * 70}" y="${y + 52}" text-anchor="middle" ${ST} font-size="11" fill="${i % 3 === 1 ? P : K}">${esc(t)}</text></g>`).join(''),
  poster: (x, y, w, h, teks, { warna = R, miring = -3 } = {}) => `<g transform="rotate(${miring} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${warna}" stroke="${K}" stroke-width="4"/>${[].concat(teks).map((t, i, a) => `<text x="${x + w / 2}" y="${y + h / 2 + (i - (a.length - 1) / 2) * 30 + 9}" text-anchor="middle" ${ST} font-size="24" fill="${warna === R || warna === K ? P : K}">${esc(t)}</text>`).join('')}</g>`,
  jam: (x, y, r = 40, pukul = 9) => { const a = (pukul % 12) / 12 * 2 * Math.PI - Math.PI / 2; return `<circle cx="${x}" cy="${y}" r="${r}" fill="${P2}" stroke="${K}" stroke-width="5"/><path d="M${x} ${y} L${x} ${y - r * 0.7} M${x} ${y} L${(x + Math.cos(a) * r * 0.5).toFixed(1)} ${(y + Math.sin(a) * r * 0.5).toFixed(1)}" ${ink(4)}/>`; },
  telepon: (x, y) => `<rect x="${x}" y="${y}" width="56" height="90" rx="6" fill="${GREEN}" stroke="${K}" stroke-width="4"/><rect x="${x + 10}" y="${y + 12}" width="36" height="20" fill="${P2}"/><path d="M${x + 6} ${y + 44} q-14 24 6 40" ${ink(5)}/><rect x="${x + 20}" y="${y + 44}" width="26" height="30" fill="url(#stub)"/>`,
  foto: (x, y, w = 90, h = 110) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P2}" stroke="${K}" stroke-width="5"/><g transform="translate(${x + w / 2 - 36} ${y + 8}) scale(.36)">${face({ head: 'bulat', hair: 'peci', fh: 'kumis', baju: 'safari' })}</g>`,

  /* ---------- cahaya dan suasana ---------- */
  lampu: (x, y = 0, { nyala = true, panjang = 70 } = {}) => `<path d="M${x} ${y} V${y + panjang}" stroke="${K}" stroke-width="3"/>` + (nyala ? `<path d="M${x} ${y + panjang} L${x - 220} 540 L${x + 220} 540Z" fill="${P}" opacity=".16"/>` : '') + `<circle cx="${x}" cy="${y + panjang + 12}" r="14" fill="${nyala ? P : DIM}" stroke="${K}" stroke-width="3"/>`,
  kipas: (x, y) => `<circle cx="${x}" cy="${y}" r="46" fill="none" stroke="${K}" stroke-width="5"/><path d="M${x} ${y} l-30 -26 M${x} ${y} l36 -14 M${x} ${y} l-6 40" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${y + 46} V${y + 120} M${x - 30} ${y + 120} H${x + 30}" stroke="${K}" stroke-width="6"/>`,

  /* ---------- luar ruangan ---------- */
  pohon: (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-10" y="-120" width="20" height="120" fill="${K}"/><circle cx="0" cy="-150" r="70" fill="${GREEN}" stroke="${K}" stroke-width="5"/><circle cx="-40" cy="-120" r="40" fill="${GREEN}" stroke="${K}" stroke-width="5"/>${gouge(x + y, 12, -60, -200, 120, 100, 18, 0.8, K, 2)}</g>`,
  tiang: (x, y, h = 300) => `<rect x="${x - 8}" y="${y - h}" width="16" height="${h}" fill="${K}"/><rect x="${x - 36}" y="${y - h + 20}" width="72" height="8" fill="${K}"/><path d="M${x - 36} ${y - h + 24} Q${x - 300} ${y - h + 70} ${x - 600} ${y - h + 30} M${x + 36} ${y - h + 24} Q${x + 300} ${y - h + 70} ${x + 600} ${y - h + 30}" stroke="${K}" stroke-width="2.5" fill="none"/>`,

  /* ---------- kendaraan (peta kota dan transportasi) ---------- */
  motor: (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><circle cx="-40" cy="0" r="22" fill="${P}" stroke="${K}" stroke-width="6"/><circle cx="44" cy="0" r="22" fill="${P}" stroke="${K}" stroke-width="6"/><path d="M-40 0 L-6 -34 L30 -34 L44 0 M-6 -34 L-14 -56 M24 -44 H44" ${ink(7)}/><rect x="-20" y="-50" width="40" height="16" rx="6" fill="${K}"/></g>`,
  bajaj: (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-70 0 V-90 Q-70 -120 -30 -124 H40 Q70 -120 70 -80 V0 Z" fill="${R}" stroke="${K}" stroke-width="5"/><rect x="-50" y="-104" width="70" height="44" fill="${NIGHT}" stroke="${K}" stroke-width="3"/><circle cx="-46" cy="4" r="18" fill="${K}"/><circle cx="46" cy="4" r="18" fill="${K}"/><circle cx="-46" cy="4" r="7" fill="${P2}"/><circle cx="46" cy="4" r="7" fill="${P2}"/></g>`,
  // bus kota kecil; warna oranye-hijau untuk Kopaja, oranye-biru untuk Metromini
  kopaja: (x, y, sc = 1, { jenis = 'kopaja' } = {}) => { const garis = jenis === 'kopaja' ? GREEN : '#2f4f8f'; let jendela = ''; for (let i = 0; i < 5; i++) jendela += `<rect x="${-150 + i * 58}" y="-120" width="46" height="40" fill="${NIGHT}" stroke="${K}" stroke-width="3"/>`; return `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-170" y="-140" width="340" height="130" rx="14" fill="#d9822b" stroke="${K}" stroke-width="5"/><rect x="-170" y="-60" width="340" height="18" fill="${garis}"/>${jendela}<rect x="130" y="-120" width="30" height="100" fill="${K}"/><circle cx="-110" cy="-8" r="24" fill="${K}"/><circle cx="110" cy="-8" r="24" fill="${K}"/><text x="0" y="-26" text-anchor="middle" ${ST} font-size="18" fill="${K}">${jenis === 'kopaja' ? 'KOPAJA' : 'METROMINI'}</text></g>`; },
  taksi: (x, y, sc = 1) => `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-130 -10 V-50 L-90 -90 H80 L120 -50 H130 V-10 Z" fill="#2f4f8f" stroke="${K}" stroke-width="5"/><path d="M-80 -84 H70 L100 -54 H-110Z" fill="${NIGHT}" stroke="${K}" stroke-width="3"/><rect x="-20" y="-104" width="40" height="14" fill="${P}" stroke="${K}" stroke-width="2"/><circle cx="-80" cy="-8" r="22" fill="${K}"/><circle cx="80" cy="-8" r="22" fill="${K}"/></g>`
};

// contoh rakitan untuk galeri: dari bagian kit saja, tanpa gambar khusus
const CONTOH_KIT = {
  'Lorong kos': () => KIT.ruang({ seed: 7 }) + KIT.pintu(80, 180, 90, 240) + KIT.pintu(330, 180, 90, 240, { terbuka: true }) + KIT.pintu(580, 180, 90, 240) + KIT.telepon(800, 220) + KIT.poster(760, 70, 140, 80, ['TELEPON', 'MAKS. 3 MENIT'], { warna: P, miring: 2 }) + KIT.lampu(480, 0, { panjang: 40 }),
  'Ruang tamu ibu kos': () => KIT.ruang({ seed: 9, malam: true }) + KIT.foto(430, 60) + tvSet(80, 200, 220, 150, tvPodium) + KIT.kursi(560, 420, 1.2) + KIT.kursi(700, 420, 1.2) + KIT.meja(560, 360, 220) + KIT.jam(860, 90, 36, 21),
  'Ruang dosen': () => KIT.ruang({ seed: 11 }) + KIT.rak(40, 90, 220, 300, { tingkat: 5 }) + KIT.jendela(640, 70, 260, 180) + KIT.meja(320, 330, 320) + KIT.kursi(470, 420) + KIT.papan(300, 80, 260, 150, { tulisan: ['JADWAL', 'UJIAN', 'RAPAT'] }),
  'Halte Kopaja': () => KIT.jalan({ seed: 13 }) + KIT.tiang(120, 300) + KIT.pohon(860, 300, 0.9) + KIT.kopaja(520, 470, 1.1) + KIT.bajaj(150, 500, 0.8) + KIT.motor(820, 500, 0.9),
  'Jalan malam': () => KIT.jalan({ seed: 17, malam: true }) + KIT.tiang(760, 300) + KIT.taksi(420, 480, 1.2) + KIT.pagar(0, 210, 300)
};
