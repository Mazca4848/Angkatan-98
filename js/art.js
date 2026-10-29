/* Angkatan 98 · gambar: palet, wajah rakitan, dokumen */
const P = '#e8e0cb', P2 = '#d6ccb2', K = '#1c1916', R = '#b0281d', DARK = '#0f0d0b', DIM = '#3a342c', NIGHT = '#1d2433', GREEN = '#41604a';
const ST = 'font-family="Saira Stencil One, Impact, sans-serif"';
const MONO = 'font-family="Courier Prime, Courier New, monospace"';
const ink = w => `fill="none" stroke="${K}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const carve = `fill="none" stroke="${P}" stroke-width="2.5" stroke-linecap="round"`;
const HAIR = `fill="${K}" stroke="${P}" stroke-width="2.5" stroke-linejoin="round"`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- tokoh ---------- */
const C = {
  damar: { head: 'panjang', hair: 'gondrong', fh: 'brewok', baju: 'jins' },
  damarKurus: { head: 'panjang', hair: 'cepak', mark: 'luka', mood: 'gugup', baju: 'kaus' },
  ratna: { head: 'oval', hair: 'bob', glasses: 'kotak', baju: 'kemeja' },
  fikri: { head: 'bulat', hair: 'peci', fh: 'jenggot', baju: 'kemeja' },
  yudi: { head: 'kotak', hair: 'belah', fh: 'kumis', baju: 'kemeja' },
  yudiTua: { head: 'kotak', hair: 'uban', fh: 'kumis', glasses: 'kotak', baju: 'batik' },
  laras: { head: 'oval', hair: 'kuncir', baju: 'kemeja' },
  larasMaba: { head: 'oval', hair: 'kuncir', mood: 'gugup', baju: 'kemeja', sign: 'LARAS' },
  wahyu: { head: 'bulat', hair: 'keriting', baju: 'kaus' },
  bimo: { head: 'kotak', hair: 'belah', glasses: 'bulat', baju: 'kemeja' },
  mei: { head: 'oval', hair: 'bob', glasses: 'bulat', baju: 'kemeja' },
  asep: { head: 'bulat', hair: 'belah', fh: 'kumis', baju: 'kaus' },
  dimas: { head: 'oval', hair: 'keriting', glasses: 'bulat', baju: 'kemeja' },
  tigor: { head: 'kotak', hair: 'belah', glasses: 'kotak', mark: 'tahi', baju: 'kemeja' },
  yos: { head: 'panjang', hair: 'gondrong', mood: 'gugup', mark: 'luka', baju: 'kaus' },
  bapak: { head: 'kotak', hair: 'uban', fh: 'kumis', glasses: 'kotak', baju: 'kemeja' },
  bapakLebaran: { head: 'kotak', hair: 'peci', fh: 'kumis', glasses: 'kotak', baju: 'batik' },
  ibu: { head: 'bulat', hair: 'kerudung', baju: 'kemeja' },
  dika: { head: 'oval', hair: 'belah', baju: 'kaus' },
  dikaMaba: { head: 'oval', hair: 'belah', baju: 'almamater' },
  panitia: { head: 'kotak', hair: 'belah', mood: 'marah', baju: 'almamater' },
  penjual: { head: 'bulat', hair: 'keriting', fh: 'kumis', baju: 'kaus' },
  interogator: { head: 'kotak', hair: 'cepak', fh: 'kumis', baju: 'safari' },
  safari: { head: 'bulat', hair: 'belah', fh: 'kumis', baju: 'safari' },
  aparat: { head: 'kotak', hair: 'cepak', mood: 'marah', baju: 'seragam' },
  petugas: { head: 'bulat', hair: 'cepak', baju: 'seragam' },
  tokoh: { head: 'bulat', hair: 'peci', fh: 'kumis', baju: 'batik' },
  eksil: { head: 'panjang', hair: 'uban', glasses: 'bulat', baju: 'kemeja' },
  ibuKos: { head: 'bulat', hair: 'kerudung', mood: 'gugup', baju: 'kaus' },
  pakRT: { head: 'kotak', hair: 'peci', fh: 'kumis', baju: 'kaus' },
  warga1: { head: 'oval', hair: 'kerudung', baju: 'kaus' },
  warga2: { head: 'bulat', hair: 'belah', baju: 'kaus' },
  mhs1: { head: 'oval', hair: 'belah', baju: 'almamater' },
  mhs2: { head: 'bulat', hair: 'kuncir', baju: 'almamater' },
  mhs3: { head: 'kotak', hair: 'keriting', glasses: 'kotak', baju: 'almamater' }
};
const FOTO = [
  { head: 'oval', hair: 'belah', baju: 'kemeja' },
  { head: 'bulat', hair: 'keriting', glasses: 'kotak', baju: 'kemeja' },
  { head: 'oval', hair: 'kuncir', baju: 'kemeja' },
  { head: 'oval', hair: 'kerudung', baju: 'kemeja' }
];
const HEADS = { oval: [46, 58], bulat: [52, 54], panjang: [42, 64], kotak: [46, 60] };
let FID = 0;

function capPath(L, Rr, T, side, dip) {
  return `M${L - 3} ${side} Q${L - 3} ${T - 5} 100 ${T - 5} Q${Rr + 3} ${T - 5} ${Rr + 3} ${side} Q${(Rr + 100) / 2 + 6} ${T + dip} 100 ${T + dip - 3} Q${(L + 100) / 2 - 6} ${T + dip} ${L - 3} ${side}Z`;
}

function baju(f) {
  const base = 'M0 240 L0 226 Q6 190 56 180 L84 172 L116 172 L144 180 Q194 190 200 226 L200 240 Z';
  const shade = `<path d="M150 182 Q194 192 200 226 L200 240 L162 240 Z" fill="url(#hatch)"/>`;
  const b = f.baju || 'kaus';
  const collar = `<path d="M84 172 L90 194 L100 182 L110 194 L116 172" fill="${P}" stroke="${K}" stroke-width="3.5"/>`;
  if (b === 'almamater') return `<path d="${base}" fill="${R}" stroke="${K}" stroke-width="4"/><path d="M86 173 L100 206 L114 173Z" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M84 172 L98 216 M116 172 L102 216" ${ink(3.5)}/><path d="M138 200 h12 v10 q-6 7 -12 0z" fill="${P}" stroke="${K}" stroke-width="2"/>` + shade;
  if (b === 'kaus') return `<path d="${base}" fill="${P}" stroke="${K}" stroke-width="4"/><path d="M84 174 Q100 192 116 174" ${ink(4)}/>` + shade;
  if (b === 'jins') return `<path d="${base}" fill="${P2}" stroke="${K}" stroke-width="4"/><path d="${base}" fill="url(#cross)"/><path d="M82 172 L92 194 L100 182 L108 194 L118 172" fill="${P2}" stroke="${K}" stroke-width="3.5"/><path d="M100 184 V240" stroke="${K}" stroke-width="2" stroke-dasharray="3 6"/>`;
  if (b === 'safari') return `<path d="${base}" fill="${P2}" stroke="${K}" stroke-width="4"/><path d="${base}" fill="url(#hatch2)"/><path d="M78 172 L92 198 L100 184 L108 198 L122 172" fill="${P2}" stroke="${K}" stroke-width="3"/><rect x="48" y="204" width="32" height="24" fill="${P2}" stroke="${K}" stroke-width="3"/><rect x="120" y="204" width="32" height="24" fill="${P2}" stroke="${K}" stroke-width="3"/>`;
  if (b === 'seragam') return `<path d="${base}" fill="${GREEN}" stroke="${K}" stroke-width="4"/><path d="${base}" fill="url(#hatch2)" opacity=".5"/><path d="M80 172 L92 196 L100 184 L108 196 L120 172" fill="${GREEN}" stroke="${K}" stroke-width="3"/><path d="M24 196 L60 184 M176 196 L140 184" stroke="${P}" stroke-width="6"/><rect x="130" y="206" width="26" height="8" fill="${P}" stroke="${K}" stroke-width="1.5"/>`;
  if (b === 'batik') return `<path d="${base}" fill="${P}" stroke="${K}" stroke-width="4"/><path d="${base}" fill="url(#batik)"/>` + collar;
  return `<path d="${base}" fill="${P}" stroke="${K}" stroke-width="4"/>${collar}<path d="M100 184 V240" stroke="${K}" stroke-width="2.5" stroke-dasharray="2 9"/>` + shade;
}

function face(f) {
  const id = 'hc' + (FID++), [rx, ry] = HEADS[f.head || 'oval'], L = 100 - rx, Rr = 100 + rx, T = 98 - ry, hair = f.hair || 'belah', mood = f.mood || 'tenang';
  const shape = f.head === 'kotak'
    ? '<path d="M54 74 Q54 38 100 38 Q146 38 146 74 L146 114 Q144 152 100 158 Q56 152 54 114 Z"/>'
    : `<ellipse cx="100" cy="98" rx="${rx}" ry="${ry}"/>`;
  let s = `<clipPath id="${id}">${shape}</clipPath>`;
  if (hair === 'gondrong') s += `<path d="M38 98 Q34 24 100 24 Q166 24 162 98 L170 178 Q152 188 138 170 L136 120 L64 120 L62 170 Q48 188 30 178 Z" ${HAIR}/><path d="M46 84 Q44 130 42 172 M154 84 Q156 130 158 172" ${carve}/>`;
  if (hair === 'bob') s += `<path d="M38 152 L38 94 Q38 28 100 28 Q162 28 162 94 L162 152 Q148 158 134 152 L66 152 Q52 158 38 152Z" ${HAIR}/><path d="M48 88 L46 146 M152 88 L154 146" ${carve}/>`;
  if (hair === 'kuncir') s += `<path d="M136 52 Q188 56 178 142 Q170 116 154 102 Q148 76 134 66Z" ${HAIR}/><circle cx="142" cy="54" r="7" fill="${R}" stroke="${K}" stroke-width="2"/>`;
  if (hair === 'kerudung') s += `<path d="M30 214 Q24 40 100 24 Q176 40 170 214 Z" ${HAIR}/><path d="M44 124 Q40 170 46 208 M156 124 Q160 170 154 208" ${carve}/>`;
  s += `<path d="M84 136 L84 186 L116 186 L116 136 Z" fill="${P}" stroke="${K}" stroke-width="4"/><path d="M104 142 L115 142 L115 184 L104 186 Z" fill="url(#hatch)"/>`;
  s += baju(f);
  if (hair !== 'kerudung') s += `<ellipse cx="${L + 2}" cy="104" rx="8" ry="13" fill="${P}" stroke="${K}" stroke-width="4"/><ellipse cx="${Rr - 2}" cy="104" rx="8" ry="13" fill="${P}" stroke="${K}" stroke-width="4"/>`;
  s += shape.replace('/>', ` fill="${P}" stroke="${K}" stroke-width="5"/>`);
  s += `<g clip-path="url(#${id})"><rect x="${100 + rx * 0.35}" y="20" width="120" height="200" fill="url(#hatch)"/>`;
  if (hair === 'cepak') s += `<path d="M30 92 Q30 ${T - 10} 100 ${T - 10} Q170 ${T - 10} 170 92 Q150 ${T + 18} 100 ${T + 16} Q50 ${T + 18} 30 92Z" fill="url(#stub)"/>`;
  if (f.fh === 'jenggot') for (let i = 0; i < 27; i++) s += `<circle cx="${72 + (i % 9) * 7}" cy="${142 + Math.floor(i / 9) * 6}" r="2.2" fill="${K}"/>`;
  if (f.fh === 'brewok') s += `<path d="M40 104 Q50 162 100 168 Q150 162 160 104 L148 106 Q140 146 100 150 Q60 146 52 106Z" fill="${K}"/>`;
  s += '</g>';
  const brow = { tenang: ['M70 84 L92 82', 'M108 82 L130 84'], gugup: ['M70 86 L92 79', 'M108 79 L130 86'], marah: ['M70 79 L92 87', 'M108 87 L130 79'] }[mood];
  s += `<path d="${brow[0]} ${brow[1]}" ${ink(6)}/>`;
  s += f.closed ? `<path d="M72 97 Q81 101 90 97 M110 97 Q119 101 128 97" ${ink(4)}/>` : `<path d="M71 97 Q81 89 91 97 Q81 102 71 97Z M109 97 Q119 89 129 97 Q119 102 109 97Z" fill="${K}"/>`;
  if (f.tired) s += `<path d="M72 106 Q81 111 90 106 M110 106 Q119 111 128 106" ${ink(3)}/>`;
  s += `<path d="M100 98 L93 117 L104 119" ${ink(4)}/>`;
  const mouth = { tenang: 'M88 133 Q100 136 112 133', gugup: 'M88 134 Q94 129 100 134 Q106 139 112 134', marah: 'M88 137 Q100 128 112 137' }[mood];
  s += `<path d="${mouth}" ${ink(5)}/>`;
  if (f.fh === 'kumis') s += `<path d="M84 126 Q100 118 116 126 Q100 130 84 126Z" fill="${K}"/>`;
  if (f.mark === 'tahi') s += `<circle cx="124" cy="120" r="3.5" fill="${K}"/>`;
  if (f.mark === 'luka') s += `<path d="M122 104 L134 124 M124 112 L130 110 M127 118 L133 116" ${ink(3)}/>`;
  if (f.glasses === 'bulat') s += `<g ${ink(4)}><circle cx="81" cy="96" r="14"/><circle cx="119" cy="96" r="14"/><path d="M95 95 Q100 91 105 95 M67 94 L${L + 4} 92 M133 94 L${Rr - 4} 92"/></g>`;
  if (f.glasses === 'kotak') s += `<g ${ink(4)}><rect x="65" y="86" width="31" height="22" rx="3"/><rect x="104" y="86" width="31" height="22" rx="3"/><path d="M96 95 L104 95 M65 92 L${L + 4} 90 M135 92 L${Rr - 4} 90"/></g>`;
  if (hair === 'belah') s += `<path d="${capPath(L, Rr, T, 92, 22)}" ${HAIR}/><path d="M116 ${T - 2} Q108 ${T + 8} 106 ${T + 20}" ${carve}/>`;
  if (hair === 'uban') s += `<path d="${capPath(L, Rr, T, 92, 20)}" fill="${P2}" stroke="${K}" stroke-width="4"/><path d="M70 ${T + 2} Q90 ${T - 6} 116 ${T + 4} M64 ${T + 12} Q92 ${T} 132 ${T + 12}" ${ink(2.5)}/>`;
  if (hair === 'gondrong') s += `<path d="${capPath(L, Rr, T, 100, 20)}" ${HAIR}/><path d="M70 ${T + 2} Q80 ${T + 10} 84 ${T + 18} M124 ${T + 2} Q118 ${T + 10} 116 ${T + 18}" ${carve}/>`;
  if (hair === 'bob') s += `<path d="${capPath(L, Rr, T, 90, 26)}" ${HAIR}/>`;
  if (hair === 'kuncir') s += `<path d="${capPath(L, Rr, T, 90, 20)}" ${HAIR}/><path d="M80 ${T + 4} Q100 ${T - 2} 124 ${T + 6}" ${carve}/>`;
  if (hair === 'keriting') {
    for (let a = 196; a <= 344; a += 16) { const r = a * Math.PI / 180; s += `<circle cx="${(100 + (rx + 2) * Math.cos(r)).toFixed(1)}" cy="${(96 + (ry + 2) * Math.sin(r)).toFixed(1)}" r="13" ${HAIR}/>`; }
    s += `<path d="${capPath(L, Rr, T, 86, 18)}" ${HAIR}/>`;
  }
  if (hair === 'peci') s += `<path d="${capPath(L, Rr, T, 84, 14)}" ${HAIR}/><path d="M${L + 6} ${T + 12} L${L + 12} ${T - 26} Q100 ${T - 34} ${Rr - 12} ${T - 26} L${Rr - 6} ${T + 12} Q100 ${T + 4} ${L + 6} ${T + 12}Z" ${HAIR}/><path d="M${L + 10} ${T - 2} Q100 ${T - 10} ${Rr - 10} ${T - 2}" ${carve}/>`;
  if (hair === 'kerudung') s += `<path d="M${L - 8} 112 Q${L - 8} ${T - 12} 100 ${T - 12} Q${Rr + 8} ${T - 12} ${Rr + 8} 112 L${Rr - 1} 112 Q${Rr - 3} ${T + 12} 100 ${T + 10} Q${L + 3} ${T + 12} ${L + 1} 112Z" ${HAIR}/><path d="M${L - 6} 116 Q${L - 2} 176 100 184 Q${Rr + 2} 176 ${Rr + 6} 116 L176 222 L24 222Z" ${HAIR}/><path d="M60 198 Q100 212 140 198" ${carve}/>`;
  if (f.sign) s += `<path d="M88 176 L74 206 M112 176 L126 206" stroke="${K}" stroke-width="2"/><g transform="rotate(-3 100 222)"><rect x="56" y="204" width="88" height="34" fill="${P2}" stroke="${K}" stroke-width="3"/><text x="100" y="228" text-anchor="middle" ${ST} font-size="17" fill="${K}">${f.sign}</text></g>`;
  return s;
}

const person = (f, x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})">${face(f)}</g>`;
const hot = (id, label, inner) => `<g class="hot" data-hot="${id}" tabindex="0" role="button" aria-label="${label}">${inner}</g>`;
const silhouette = (x, y, sc, fill = K) => `<g transform="translate(${x} ${y}) scale(${sc})"><circle cx="0" cy="-34" r="17" fill="${fill}"/><path d="M-30 30 Q-28 -12 0 -12 Q28 -12 30 30Z" fill="${fill}"/></g>`;

function rng(seed) {
  return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function gouge(seed, n, x, y, w, h, len, ang, col, sw) {
  const r = rng(seed); let d = '';
  for (let i = 0; i < n; i++) { const px = x + r() * w, py = y + r() * h, l = len * (0.5 + r()), a = ang + (r() - 0.5) * 0.3; d += `M${px.toFixed(1)} ${py.toFixed(1)}l${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}`; }
  return `<path d="${d}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
}
function star(cx, cy, r) {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); }
  return d + 'Z';
}

/* ---------- dokumen ---------- */
const field = (x, y, l, v) => `<text x="${x}" y="${y}" ${MONO} font-size="9" letter-spacing="1" fill="#5a5247">${l}</text><text x="${x}" y="${y + 16}" ${MONO} font-size="13" font-weight="700" fill="${K}">${esc(v)}</text>`;
const photo = f => `<rect x="16" y="56" width="96" height="122" fill="${P2}" stroke="${K}" stroke-width="2.5"/><svg x="16" y="56" width="96" height="122" viewBox="0 0 200 254" overflow="hidden">${face(f)}</svg>`;
function ktm(d) {
  const stamp = d.stempel === 'palsu'
    ? `<g opacity=".85"><circle cx="100" cy="168" r="22" fill="none" stroke="${R}" stroke-width="2.5"/><text x="100" y="173" text-anchor="middle" ${ST} font-size="13" fill="${R}">UGB</text></g>`
    : `<g opacity=".85"><circle cx="100" cy="168" r="24" fill="none" stroke="${R}" stroke-width="2.5"/><circle cx="100" cy="168" r="17" fill="none" stroke="${R}" stroke-width="2"/><path d="${star(100, 168, 10)}" fill="${R}"/></g>`;
  return `<rect x="2" y="2" width="336" height="210" rx="10" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M2 12 Q2 2 12 2 H328 Q338 2 338 12 V44 H2Z" fill="${R}"/>`
    + `<text x="170" y="24" text-anchor="middle" ${ST} font-size="16" fill="${P}">UNIVERSITAS GELORA BANGSA</text><text x="170" y="38" text-anchor="middle" ${MONO} font-size="10" font-weight="700" letter-spacing="2" fill="${P}">KARTU TANDA MAHASISWA</text>`
    + photo(d.face) + field(128, 64, 'NAMA', d.nama) + field(128, 100, 'NIM', d.nim) + field(128, 136, 'FAKULTAS', d.fak) + field(250, 136, 'ANGKATAN', d.ang)
    + `<text x="128" y="196" ${MONO} font-size="9" fill="#5a5247">Berlaku selama terdaftar</text>` + stamp;
}
function kartuPresidium(d) {
  const tinta = d.palsu ? '#7a2f8a' : R;
  return `<rect x="2" y="2" width="336" height="210" rx="10" fill="${P}" stroke="${K}" stroke-width="3"/><rect x="2" y="2" width="336" height="40" fill="${K}"/>`
    + `<text x="170" y="28" text-anchor="middle" ${ST} font-size="17" fill="${P}">PRESIDIUM MAHASISWA · SENAYAN</text>`
    + photo(d.face) + field(128, 64, 'NAMA', d.nama) + field(128, 100, 'KAMPUS', d.kampus) + field(128, 136, 'BERLAKU', '18–25 MEI 1998')
    + `<rect x="128" y="168" width="196" height="26" fill="${tinta}" opacity=".85"/><text x="226" y="186" text-anchor="middle" ${ST} font-size="14" fill="${P}">RING ${esc(d.ring || 'B')}</text>`;
}
function kartuPers(d) {
  return `<rect x="2" y="2" width="336" height="210" rx="10" fill="${P}" stroke="${K}" stroke-width="3"/><rect x="2" y="2" width="336" height="40" fill="${P2}" stroke="${K}" stroke-width="2"/>`
    + `<text x="170" y="29" text-anchor="middle" ${ST} font-size="19" fill="${K}">KARTU PERS</text>`
    + photo(d.face) + field(128, 64, 'NAMA', d.nama) + field(128, 100, 'MEDIA', d.media) + field(128, 136, 'NO.', d.no)
    + (d.stempel ? `<g opacity=".85"><rect x="230" y="160" width="90" height="36" fill="none" stroke="${R}" stroke-width="2.5" transform="rotate(-6 275 178)"/><text x="275" y="184" text-anchor="middle" ${ST} font-size="12" fill="${R}" transform="rotate(-6 275 178)">REDAKSI</text></g>` : '');
}
function ktp(d) {
  return `<rect x="2" y="2" width="336" height="210" rx="10" fill="#cfd6c9" stroke="${K}" stroke-width="3"/><text x="170" y="28" text-anchor="middle" ${MONO} font-weight="700" font-size="13" fill="${K}">KARTU TANDA PENDUDUK</text>`
    + photo(d.face) + field(128, 64, 'NAMA', d.nama) + field(128, 100, 'ALAMAT', d.alamat) + field(128, 136, 'PEKERJAAN', d.kerja);
}
