/* Angkatan 98 · latar adegan, semua 960×540 */
const bg = c => `<rect width="960" height="540" fill="${c}"/>`;
const wall = (seed, c = P) => bg(c) + gouge(seed, 30, 0, 0, 960, 420, 16, 1.1, c === P ? P2 : DIM, 3);
const floor = (y, seed) => `<rect y="${y}" width="960" height="${540 - y}" fill="${K}"/>` + gouge(seed, 26, 0, y + 6, 960, 534 - y, 60, 0, P, 2);
const neon = (x, w, cls = '') => `<rect x="${x}" y="8" width="${w}" height="12" rx="6" fill="${P}" stroke="${K}" stroke-width="4" class="${cls}"/>`;
const nightSky = seed => bg(NIGHT) + gouge(seed, 40, 0, 0, 960, 300, 2, 0, P2, 2);
const tvSet = (x, y, w, h, inner = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${K}"/><rect x="${x + 10}" y="${y + 10}" width="${w - 46}" height="${h - 20}" rx="14" fill="${P2}"/><svg x="${x + 10}" y="${y + 10}" width="${w - 46}" height="${h - 20}" viewBox="0 0 200 140" preserveAspectRatio="none">${inner}</svg><circle cx="${x + w - 18}" cy="${y + 22}" r="5" fill="${P}"/><circle cx="${x + w - 18}" cy="${y + 40}" r="5" fill="${P}"/>`;
const tvPodium = `<rect width="200" height="140" fill="${P2}"/><rect x="70" y="78" width="60" height="62" fill="${K}"/>${'<circle cx="100" cy="52" r="16" fill="' + K + '"/><path d="M72 90 Q72 66 100 66 Q128 66 128 90Z" fill="' + K + '"/>'}<rect x="20" y="16" width="40" height="26" fill="${R}"/>`;
const table = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="16" fill="${K}"/><path d="M${x + 14} ${y + 16} V${y + 80} M${x + w - 14} ${y + 16} V${y + 80}" stroke="${K}" stroke-width="10"/>`;
const winFrame = (x, y, w, h, night) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${night ? NIGHT : P2}"/>${night ? gouge(x + y, 10, x + 6, y + 6, w - 12, h - 12, 2, 0, P2, 2) : gouge(x + y, 10, x + 6, y + 6, w - 12, h - 12, 26, 0, K, 2)}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="10"/><path d="M${x} ${y + h / 2} H${x + w} M${x + w / 2} ${y} V${y + h}" stroke="${K}" stroke-width="6"/>`;
function crowd(seed, n, y, sc, fill = K, x0 = 0, w = 960) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) s += silhouette(x0 + (i + 0.5) * w / n + (r() - 0.5) * 20, y + (r() - 0.5) * 14, sc * (0.85 + r() * 0.3), fill);
  return s;
}
function smoke(x, base, h, seed) {
  const r = rng(seed); let d = `M${x} ${base}`;
  for (let y = base; y > base - h; y -= 24) d += ` q${(r() - 0.5) * 40} -12 ${(r() - 0.5) * 30} -24`;
  return `<path d="${d}" stroke="${K}" stroke-width="${18 + h / 12}" stroke-linecap="round" fill="none" opacity=".85"/><path d="M${x - 6} ${base} l-8 10 l16 0z" fill="${R}"/>`;
}

/* ---------- babak I ---------- */
function sRumah(S, n) {
  const lebaran = n.v === 'lebaran';
  let o = wall(81) + winFrame(40, 70, 190, 170, !lebaran);
  if (lebaran) for (let i = 0; i < 5; i++) o += `<path d="M${270 + i * 60} 20 V${60 + (i % 2) * 14}" stroke="${K}" stroke-width="2"/><path d="M${270 + i * 60} ${60 + (i % 2) * 14} l14 14 l-14 14 l-14 -14z" fill="${P2}" stroke="${K}" stroke-width="3"/><path d="M${262 + i * 60} ${66 + (i % 2) * 14} l16 16 M${278 + i * 60} ${66 + (i % 2) * 14} l-16 16" stroke="${K}" stroke-width="2"/>`;
  o += `<rect x="700" y="230" width="220" height="190" fill="${K}"/>`;
  o += hot('tv', 'Televisi', tvSet(714, 120, 190, 120, lebaran ? `<rect width="200" height="140" fill="${P2}"/><text x="100" y="80" text-anchor="middle" ${ST} font-size="30" fill="${K}">TAKBIR</text>` : `<rect width="200" height="140" fill="${P2}"/><rect x="0" y="100" width="200" height="40" fill="${R}"/><text x="100" y="128" text-anchor="middle" ${ST} font-size="18" fill="${P}">BERITA</text><path d="M20 96 L60 40 L100 70 L150 30 L190 96Z" fill="${K}"/>`));
  o += floor(420, 82);
  o += hot('bapak', 'Bapak', person(lebaran ? C.bapakLebaran : C.bapak, 300, 150, 1.05) + (lebaran ? '' : `<g transform="rotate(-4 400 360)"><rect x="300" y="318" width="210" height="96" fill="${P}" stroke="${K}" stroke-width="4"/><text x="405" y="348" text-anchor="middle" ${ST} font-size="18" fill="${K}">AKTIVIS DIBURU</text><path d="M312 362h180M312 376h150M312 390h170" stroke="${K}" stroke-width="2.5"/></g>`));
  o += hot('ibu', 'Ibu', person(C.ibu, 520, 168, .95));
  o += hot('dika', 'Dika', person(C.dika, 110, 228, .8));
  o += `<path d="M180 410 L780 410 L840 520 L120 520Z" fill="${P2}" stroke="${K}" stroke-width="5"/><ellipse cx="330" cy="450" rx="54" ry="18" fill="${P}" stroke="${K}" stroke-width="3"/><ellipse cx="560" cy="452" rx="54" ry="18" fill="${P}" stroke="${K}" stroke-width="3"/>`;
  o += lebaran ? hot('amplop', 'Amplop Lebaran', `<rect x="640" y="440" width="70" height="40" fill="${R}" stroke="${K}" stroke-width="3" transform="rotate(-8 675 460)"/><rect x="420" y="430" width="60" height="50" rx="8" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M424 446 h52" stroke="${K}" stroke-width="2"/>`)
    : hot('tas', 'Tas', `<path d="M820 470 Q820 430 860 428 L920 428 Q950 430 950 470 L950 530 L820 530Z" fill="${GREEN}" stroke="${K}" stroke-width="4"/><path d="M850 428 Q885 396 920 428" ${ink(5)}/>`) + `<rect x="430" y="424" width="44" height="40" rx="6" fill="${P}" stroke="${K}" stroke-width="3"/><text x="452" y="450" text-anchor="middle" ${MONO} font-size="9" fill="${K}">tempe</text>`;
  return o;
}

function sGerbang(S, n) {
  const night = n.v === 'malam';
  let o = night ? nightSky(17) : bg(P);
  if (!night) { let rays = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; rays += `M${(830 + Math.cos(a) * 62).toFixed(1)} ${(86 + Math.sin(a) * 62).toFixed(1)}L${(830 + Math.cos(a) * 88).toFixed(1)} ${(86 + Math.sin(a) * 88).toFixed(1)}`; } o += `<path d="${rays}" stroke="${K}" stroke-width="6" stroke-linecap="round"/><circle cx="830" cy="86" r="44" fill="${P}" stroke="${K}" stroke-width="6"/>`; }
  else o += smoke(160, 300, 220, 4) + smoke(700, 300, 260, 5) + smoke(860, 300, 180, 6);
  o += `<rect x="230" y="176" width="500" height="170" fill="${K}"/><rect x="440" y="110" width="80" height="70" fill="${K}"/><path d="M480 110 V58" stroke="${night ? P2 : K}" stroke-width="4"/><rect x="482" y="58" width="42" height="24" fill="${R}" stroke="${K}" stroke-width="3"/>`;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 9; i++) o += `<rect x="${252 + i * 52}" y="${196 + j * 40}" width="24" height="22" fill="${night ? (i * j % 3 ? DIM : P2) : P}"/>`;
  o += `<path d="M0 340 H960 V540 H0Z" fill="${K}"/>` + gouge(11, 60, 0, 360, 960, 180, 26, 0, night ? DIM : P, 2.5);
  const pillar = x => `<rect x="${x}" y="168" width="92" height="232" fill="${P}" stroke="${K}" stroke-width="6"/><rect x="${x + 52}" y="171" width="37" height="226" fill="url(#hatch)"/><rect x="${x - 10}" y="152" width="112" height="22" fill="${K}" stroke="${night ? P2 : K}" stroke-width="2"/>`;
  o += pillar(108) + pillar(760);
  if (night) {
    let bars = ''; for (let x = 206; x <= 756; x += 22) bars += `M${x} 250 V400`;
    o += `<path d="${bars} M200 256 H760 M200 330 H760" stroke="${P2}" stroke-width="5"/>`;
    o += hot('warga', 'Warga di luar gerbang', crowd(23, 7, 470, 1.1, DIM, 160, 640) + `<g>${person(C.warga1, 210, 330, .75)}${person(C.ibuKos, 380, 344, .7)}</g>`);
    o += hot('provokator', 'Orang berikat kepala', person({ head: 'kotak', hair: 'cepak', mood: 'marah', baju: 'kaus' }, 640, 320, .8) + `<rect x="652" y="352" width="140" height="14" fill="${R}"/><rect x="770" y="440" width="44" height="60" rx="6" fill="${P2}" stroke="${K}" stroke-width="3"/>`);
    o += hot('mahasiswa', 'Mahasiswa di balik pagar', `<g opacity=".95">${person(C.mhs1, -10, 330, .9)}${person(C.mhs3, 860, 330, .9)}</g>`);
    return o;
  }
  o += `<path d="M380 345 L580 345 L760 540 L200 540Z" fill="${P2}" stroke="${K}" stroke-width="4"/>` + gouge(12, 26, 260, 380, 420, 150, 30, 0.05, K, 2);
  for (const [x, y, sc] of [[430, 360, .7], [520, 372, .8], [470, 392, .9], [560, 410, 1], [400, 420, 1.05]]) o += `<g transform="translate(${x} ${y}) scale(${sc})"><circle cx="0" cy="0" r="9" fill="${K}"/><path d="M-11 10 h22 v26 h-22z" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M-6 36 v14 M6 36 v14" stroke="${K}" stroke-width="5"/></g>`;
  const panel = (x0, dir) => { let d = ''; for (let i = 0; i < 7; i++) { const x = x0 + dir * i * 14; d += `M${x} ${262 + i * 5}V${398 - i * 3}`; } const x6 = x0 + dir * 84; return `<path d="${d}M${x0} 262 L${x6} 292 M${x0} 330 L${x6} 342 M${x0} 398 L${x6} 380" stroke="${K}" stroke-width="5" fill="none"/>`; };
  o += panel(204, 1) + panel(756, -1) + `<path d="M200 184 L150 160 M760 184 L810 160" stroke="${K}" stroke-width="3"/>`;
  o += hot('spanduk', 'Spanduk penyambutan', `<path d="M200 184 Q480 204 760 184 L760 246 Q480 266 200 246Z" fill="${R}" stroke="${K}" stroke-width="4"/><text x="480" y="226" text-anchor="middle" ${ST} font-size="30" fill="${P}">SELAMAT DATANG MAHASISWA BARU</text><text x="480" y="247" text-anchor="middle" ${MONO} font-weight="700" font-size="13" fill="${P}">UNIVERSITAS GELORA BANGSA 1996/1997</text>`);
  o += `<rect x="46" y="0" width="20" height="540" fill="${K}"/><rect x="20" y="30" width="72" height="10" fill="${K}"/><path d="M58 40 Q400 92 960 60 M58 56 Q420 112 960 84" stroke="${K}" stroke-width="2.5" fill="none"/>`;
  o += hot('selebaran', 'Selebaran di tiang listrik', `<rect x="16" y="262" width="104" height="124" fill="transparent"/><g transform="rotate(-5 60 320)"><rect x="34" y="286" width="54" height="70" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M40 300h40M40 310h34M40 320h40M40 330h26M40 340h36" stroke="${K}" stroke-width="2.5"/></g>`);
  o += `<rect x="610" y="300" width="110" height="46" fill="${GREEN}" stroke="${K}" stroke-width="3"/><circle cx="630" cy="350" r="12" fill="${K}"/><circle cx="700" cy="350" r="12" fill="${K}"/>`;
  o += hot('panitia', 'Panitia ospek', `<g transform="translate(548 232) scale(1.15)">${face(C.panitia)}<path d="M94 124 L34 100 L34 166 L94 142Z" fill="${P}" stroke="${K}" stroke-width="5"/><ellipse cx="34" cy="133" rx="8" ry="33" fill="${K}"/></g>`);
  o += hot('koran', 'Penjual koran', person(C.penjual, 790, 296, 1) + `<g transform="rotate(-8 850 470)"><rect x="770" y="410" width="170" height="120" fill="${P}" stroke="${K}" stroke-width="4"/><text x="855" y="446" text-anchor="middle" ${ST} font-size="22" fill="${K}">AKTIVIS</text><text x="855" y="468" text-anchor="middle" ${ST} font-size="15" fill="${R}">DIBURU APARAT</text><path d="M782 484h146M782 496h120M782 508h140" stroke="${K}" stroke-width="2.5"/></g>`);
  return o;
}

function sLapangan(S) {
  let w = ''; for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * Math.PI * 2, a1 = (i + 1) / 24 * Math.PI * 2; w += `M480 70L${(480 + Math.cos(a0) * 900).toFixed(0)} ${(70 + Math.sin(a0) * 900).toFixed(0)}L${(480 + Math.cos(a1) * 900).toFixed(0)} ${(70 + Math.sin(a1) * 900).toFixed(0)}Z`; }
  let o = bg(P) + `<path d="${w}" fill="${R}" opacity=".85"/><circle cx="480" cy="70" r="58" fill="${P}" stroke="${K}" stroke-width="8"/>`;
  o += `<path d="M0 300 V262 H90 V240 H170 V270 H300 V230 H360 V270 H600 V246 H700 V270 H840 V236 H960 V300Z" fill="${K}"/><rect y="296" width="960" height="244" fill="${K}"/>` + gouge(21, 90, 0, 300, 960, 240, 14, -1.35, P, 2.5);
  for (const [k, x] of [['damar', 30], ['ratna', 262], ['fikri', 494], ['yudi', 726]]) o += hot(k, SENIOR[k], person(C[k], x, 128, 1.2));
  for (let i = 0; i < 7; i++) { const x = 290 + i * 104; o += `<ellipse cx="${x}" cy="468" rx="36" ry="40" fill="${K}" stroke="${P}" stroke-width="3"/><path d="M${x - 46} 540 Q${x - 44} 500 ${x} 502 Q${x + 44} 500 ${x + 46} 540Z" fill="${P}" stroke="${K}" stroke-width="4"/>`; }
  return o + hot('laras', 'Laras', `<g transform="translate(-6 300)">${face(C.larasMaba)}<path d="M152 72 q6 10 0 16 M158 94 q6 10 0 16" ${ink(3)}/></g>`);
}

function sKtm(S) {
  return bg(K) + gouge(61, 40, 0, 0, 960, 540, 90, 0.02, DIM, 3) + `<rect x="770" y="420" width="120" height="70" rx="6" fill="${R}" stroke="${P2}" stroke-width="3"/>` + `<g transform="translate(208 99) scale(1.6)">${ktm(myKtm())}</g>`;
}

function sSekre(S, n) {
  const v = n.v || 'siang', night = v !== 'siang';
  let o = wall(31, night ? P2 : P) + (night ? `<rect width="960" height="420" fill="${K}" opacity=".18"/>` : '');
  o += neon(330, 300, night ? 'neon' : '');
  o += winFrame(24, 64, 210, 190, night);
  o += `<g transform="rotate(-3 320 130)"><rect x="262" y="44" width="118" height="170" fill="${R}" stroke="${K}" stroke-width="4"/><text x="321" y="96" text-anchor="middle" ${ST} font-size="26" fill="${P}">KAMPUS</text><text x="321" y="130" text-anchor="middle" ${ST} font-size="26" fill="${P}">BUKAN</text><text x="321" y="164" text-anchor="middle" ${ST} font-size="26" fill="${P}">BARAK</text></g>`;
  o += `<g transform="rotate(2 446 100)"><rect x="398" y="40" width="96" height="124" fill="${K}"/><text x="446" y="80" text-anchor="middle" ${ST} font-size="17" fill="${P}">DISKUSI</text><text x="446" y="104" text-anchor="middle" ${ST} font-size="17" fill="${P}">KAMIS</text><text x="446" y="128" text-anchor="middle" ${ST} font-size="17" fill="${P}">MALAM</text></g>`;
  o += floor(400, 33);
  if (v === 'siang') {
    o += hot('papan', 'Papan pengumuman', `<rect x="548" y="40" width="170" height="104" fill="${P2}" stroke="${K}" stroke-width="6"/><rect x="551" y="43" width="164" height="98" fill="url(#dots)"/><rect x="562" y="52" width="46" height="56" fill="${P}" stroke="${K}" stroke-width="2"/><rect x="664" y="50" width="42" height="64" fill="${R}" stroke="${K}" stroke-width="2"/>`);
    o += `<rect x="904" y="166" width="40" height="64" rx="4" fill="${K}"/>`;
    o += hot('damar', 'Bang Damar', person(C.damar, 34, 104, .95) + `<path d="M182 216 q10 -16 0 -30 q-10 -14 2 -30" ${ink(3)}/>`);
    o += hot('yudi', 'Mas Yudi', person(C.yudi, 730, 104, .95) + `<path d="M904 200 Q886 232 872 230" ${ink(3)}/>`);
    o += hot('ratna', 'Kak Ratna', person(C.ratna, 556, 150, .85) + table(510, 324, 260) + `<rect x="528" y="300" width="74" height="24" fill="${R}" stroke="${K}" stroke-width="2.5"/>`);
    o += hot('stensil', 'Mesin stensil', person(C.wahyu, 190, 246, .72) + table(286, 356, 190) + `<rect x="306" y="296" width="150" height="60" rx="26" fill="${K}"/><path d="M318 312 h126 M318 326 h126" stroke="${P}" stroke-width="3"/><path d="M470 326 L494 300" stroke="${K}" stroke-width="6"/>`);
    o += `<path d="M10 452 L330 452 L370 540 L-20 540Z" fill="${P2}" stroke="${K}" stroke-width="4"/><path d="M10 452 L330 452 L370 540 L-20 540Z" fill="url(#cross)"/>`;
    return o + hot('fikri', 'Bang Fikri', person(C.fikri, 70, 318, .85) + `<rect x="160" y="478" width="90" height="56" fill="${P}" stroke="${K}" stroke-width="3"/>`);
  }
  if (v === 'kamis') {
    o += hot('rak', 'Rak buku', `<rect x="560" y="60" width="200" height="300" fill="${K}"/>` + [0, 1, 2, 3].map(j => `<path d="M560 ${130 + j * 70} H760" stroke="${P2}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${570 + i * 23}" y="${78 + j * 70 + (i % 3) * 4}" width="18" height="${48 - (i % 3) * 4}" fill="${(i + j) % 4 ? P2 : R}" stroke="${K}" stroke-width="1.5"/>`).join('')).join(''));
    o += `<path d="M120 452 L820 452 L880 540 L60 540Z" fill="${P2}" stroke="${K}" stroke-width="4"/><path d="M120 452 L820 452 L880 540 L60 540Z" fill="url(#cross)"/>`;
    const slots = [[40, 230, .9], [250, 250, .82], [800, 240, .85]];
    (n.hadir || []).slice(0, 3).forEach((id, i) => { const [x, y, sc] = slots.at(i); o += hot(id, id, person(C[id], x, y, sc)); });
    o += `<path d="M430 470 l60 -40 l14 10 l-60 40z" fill="${R}" stroke="${K}" stroke-width="3"/><ellipse cx="470" cy="488" rx="40" ry="22" fill="${P}" stroke="${K}" stroke-width="3"/><circle cx="470" cy="488" r="8" fill="${K}"/>`;
    return o + `<rect x="620" y="470" width="30" height="34" rx="4" fill="${P}" stroke="${K}" stroke-width="3"/>`;
  }
  if (v === 'stensil') {
    o += table(240, 330, 480) + `<rect x="300" y="250" width="220" height="80" rx="34" fill="${K}"/><path d="M316 272 h188 M316 292 h188" stroke="${P}" stroke-width="3"/>`;
    o += hot('selebaran', 'Draf selebaran', `<g transform="rotate(-6 620 300)"><rect x="560" y="250" width="120" height="80" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M572 266h96M572 280h80M572 294h90M572 308h60" stroke="${K}" stroke-width="2.5"/></g>`);
    return o + hot('wahyu', 'Wahyu', person(C.wahyu, 740, 200, .9));
  }
  if (v === 'radio') {
    o += table(360, 360, 300) + hot('radio', 'Radio', `<rect x="380" y="306" width="120" height="54" rx="8" fill="${K}"/><circle cx="410" cy="333" r="16" fill="url(#dots)" stroke="${P}" stroke-width="2"/><path d="M470 306 L500 250" stroke="${K}" stroke-width="3"/>`) + hot('tv', 'Televisi', tvSet(520, 250, 130, 110, tvPodium));
    o += hot('telepon', 'Telepon sekretariat', `<rect x="880" y="200" width="44" height="70" rx="4" fill="${K}"/>`);
    return o + hot('kawan', 'Wajah kawan-kawan', person(C.bimo, 40, 200, .8) + person(C.dimas, 190, 230, .75) + person(C.mei, 700, 230, .75));
  }
  if (v === 'razia') {
    o += hot('plafon', 'Plafon', `<rect x="560" y="20" width="120" height="40" fill="${P2}" stroke="${K}" stroke-width="3"/><path d="M560 20 l30 20" stroke="${K}" stroke-width="2"/>`);
    o += hot('karung', 'Karung beras', `<path d="M760 420 Q752 340 800 336 Q850 340 842 420Z" fill="${P2}" stroke="${K}" stroke-width="4"/><text x="800" y="392" text-anchor="middle" ${ST} font-size="14" fill="${K}">BERAS</text>`);
    o += hot('bak', 'Kamar mandi', `<rect x="860" y="150" width="90" height="250" fill="${DIM}" stroke="${K}" stroke-width="4"/><circle cx="872" cy="280" r="5" fill="${P}"/>`);
    o += table(250, 330, 420) + hot('stensil', 'Mesin stensil', `<rect x="300" y="250" width="200" height="80" rx="34" fill="${K}"/><path d="M316 272 h168 M316 292 h168" stroke="${P}" stroke-width="3"/><path d="M500 290 L530 260" stroke="${K}" stroke-width="6"/>`);
    o += `<g transform="rotate(-8 600 370)"><rect x="540" y="300" width="110" height="30" fill="${P}" stroke="${K}" stroke-width="2"/></g>`;
    return o + hot('jendela', 'Jendela belakang', `<rect x="24" y="64" width="210" height="190" fill="transparent"/>`) + `<text x="150" y="40" ${MONO} font-weight="700" font-size="20" fill="${R}">23.40</text>`;
  }
  return o;
}

function sKos(S, n) {
  const night = n.v === 'malam';
  let o = wall(41) + (night ? `<rect width="960" height="420" fill="${NIGHT}" opacity=".55"/>` : '');
  let cal = `<rect x="34" y="66" width="184" height="226" fill="${P}" stroke="${K}" stroke-width="4"/><rect x="34" y="66" width="184" height="46" fill="${R}"/><text x="126" y="96" text-anchor="middle" ${ST} font-size="18" fill="${P}">${esc((n.kalender || 'KALENDER').toUpperCase())}</text>`;
  let grid = ''; const cw = 164 / 7;
  for (let i = 0; i <= 7; i++) grid += `M${(44 + i * cw).toFixed(1)} 132V282`;
  for (let j = 0; j <= 5; j++) grid += `M44 ${132 + j * 30}H208`;
  cal += `<path d="${grid}" stroke="${K}" stroke-width="1.2"/>`;
  ((S.m && S.m.slots) || []).forEach((_, i) => { for (const c of [2 * i, 2 * i + 1]) { const x = 44 + c * cw, y = 192; cal += `<path d="M${x + 4} ${y + 5}L${x + cw - 4} ${y + 25}M${x + cw - 4} ${y + 5}L${x + 4} ${y + 25}" stroke="${R}" stroke-width="3"/>`; } });
  o += hot('kalender', 'Kalender dinding', cal);
  o += hot('pintu', 'Pintu ke lorong', `<rect x="244" y="76" width="70" height="344" fill="${K}"/><path d="M252 84 L300 96 L300 412 L252 420Z" fill="${P2}" stroke="${K}" stroke-width="3"/>` + (n.dering ? `<path d="M262 200 l-16 -10 M262 220 h-20 M262 240 l-16 10" stroke="${R}" stroke-width="4"/>` : ''));
  const motor = S.sorotan >= 75 ? 3 : S.sorotan >= 50 ? 2 : S.sorotan >= 25 ? 1 : 0;
  let view = `<rect x="340" y="62" width="300" height="230" fill="${night ? NIGHT : P}"/><path d="M346 176 L400 132 L456 176Z M448 180 L520 124 L592 180Z M584 172 L640 140 V180Z" fill="${K}"/><rect x="346" y="176" width="288" height="40" fill="url(#hatch)"/><path d="M346 292 L478 210 L502 210 L634 292Z" fill="${K}"/>`;
  for (let i = 0; i < motor; i++) { const x = 470 + i * 26, y = 214 + i * 8; view += `<g transform="translate(${x} ${y}) scale(${0.55 + i * 0.12})"><circle cx="-10" cy="10" r="7" fill="${P}" stroke="${K}" stroke-width="3"/><circle cx="14" cy="10" r="7" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M-12 4 L16 4 L10 -6 L-4 -6Z" fill="${K}"/><circle cx="2" cy="-18" r="6" fill="${K}"/></g>`; }
  let bars = ''; for (let x = 370; x <= 610; x += 30) bars += `M${x} 62 V292`;
  o += hot('jendela', 'Jendela', view + `<path d="${bars}" stroke="${K}" stroke-width="4"/><rect x="340" y="62" width="300" height="230" fill="none" stroke="${K}" stroke-width="12"/>`);
  o += hot('cermin', 'Cermin', `<rect x="672" y="62" width="96" height="128" rx="44" fill="${K}"/><clipPath id="mirror"><rect x="680" y="70" width="80" height="112" rx="38"/></clipPath><g clip-path="url(#mirror)"><rect x="680" y="70" width="80" height="112" fill="${P2}"/>${person({ ...FOTO[S.foto], tired: S.nyali < 40 }, 676, 74, .44)}</g>`);
  o += hot('meja', 'Meja belajar', `<rect x="660" y="318" width="290" height="18" fill="${K}"/><path d="M676 336 V420 M934 336 V420" stroke="${K}" stroke-width="10"/><path d="M900 318 V244 Q900 222 880 226 L860 234" stroke="${K}" stroke-width="6" fill="none"/><path d="M842 226 L878 236 L866 258Z" fill="${K}"/><rect x="690" y="286" width="60" height="32" fill="${P}" stroke="${K}" stroke-width="3"/><rect x="770" y="290" width="70" height="28" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M770 290 L805 308 L840 290" ${ink(2.5)}/>`);
  o += `<rect y="420" width="960" height="120" fill="${K}"/><path d="M0 452 Q480 436 960 452 V540 H0Z" fill="url(#sarung)" stroke="${K}" stroke-width="5"/>`;
  if (n.v === 'dika') o += person(C.dikaMaba, 380, 300, .9);
  return o + hot('dompet', 'Dompet', `<g transform="rotate(-8 150 488)"><rect x="104" y="466" width="92" height="50" rx="6" fill="${K}" stroke="${P}" stroke-width="2"/><path d="M110 472 h80 M110 510 h80" stroke="${P}" stroke-width="1.5" stroke-dasharray="4 4"/></g>`);
}

function shoe(type) {
  if (type === 'lars') { let l = ''; for (let i = 0; i < 6; i++) l += `M392 ${312 + i * 16} L446 ${320 + i * 16} M446 ${312 + i * 16} L392 ${320 + i * 16}`; return `<path d="M372 300 L466 300 L470 430 Q478 456 452 458 L388 458 Q362 456 368 430Z" fill="${K}" stroke="${P2}" stroke-width="2"/><path d="${l}" stroke="${P}" stroke-width="2.5"/><path d="M364 446 H476" stroke="${P}" stroke-width="3"/>`; }
  if (type === 'sandal') { let toes = ''; for (let i = 0; i < 5; i++) toes += `<circle cx="${394 + i * 14}" cy="444" r="6" fill="${P}" stroke="${K}" stroke-width="2.5"/>`; return `<path d="M380 392 L462 392 L466 440 Q466 452 448 452 L394 452 Q378 452 378 440Z" fill="${P}" stroke="${K}" stroke-width="4"/>${toes}<path d="M420 424 L392 404 M420 424 L452 404" stroke="${R}" stroke-width="6"/>`; }
  if (type === 'pantofel') return `<path d="M372 396 L466 396 Q480 430 466 452 L380 452 Q362 430 372 396Z" fill="${K}" stroke="${P2}" stroke-width="2"/><path d="M392 412 Q420 404 446 414" stroke="${P}" stroke-width="3" fill="none"/>`;
  return `<path d="M370 392 L468 392 L474 432 Q476 452 452 454 L388 454 Q364 452 366 432Z" fill="${P}" stroke="${K}" stroke-width="5"/><path d="M392 400 L446 412 M446 400 L392 412 M394 418 L444 428 M444 418 L394 428" stroke="${K}" stroke-width="3"/>`;
}
function sInspect(S, n) {
  const m = S.m, t = m.list && m.list.at(m.i), v = n.v || 'pintu';
  let o;
  if (v === 'pintu') o = wall(51) + neon(330, 300, 'neon') + `<rect x="236" y="34" width="488" height="506" fill="${K}"/><rect x="262" y="58" width="436" height="482" fill="${DARK}"/><path d="M262 470 H698 M286 430 H674 M306 396 H654 M322 368 H638" stroke="${DIM}" stroke-width="4"/>`;
  else if (v === 'kumpul') o = bg(P) + `<rect y="120" width="960" height="200" fill="${P2}"/><path d="M0 120 H960" stroke="${K}" stroke-width="6"/>` + [80, 260, 700, 880].map(x => `<circle cx="${x}" cy="90" r="70" fill="${GREEN}" stroke="${K}" stroke-width="4"/><rect x="${x - 10}" y="140" width="20" height="180" fill="${K}"/>`).join('') + `<rect x="300" y="140" width="360" height="56" fill="${R}" stroke="${K}" stroke-width="4"/><text x="480" y="178" text-anchor="middle" ${ST} font-size="26" fill="${P}">TOLAK SIDANG UMUM</text>` + crowd(52, 9, 330, .9, DIM);
  else o = bg(P) + `<path d="M180 230 Q330 100 480 230 Q630 100 780 230 Z" fill="${GREEN}" stroke="${K}" stroke-width="5"/><rect x="140" y="230" width="680" height="90" fill="${P2}" stroke="${K}" stroke-width="4"/>` + crowd(53, 12, 330, .8, DIM) + (() => { let b = ''; for (let x = 20; x < 960; x += 26) b += `M${x} 200 V500`; return `<path d="${b} M0 214 H960 M0 300 H960" stroke="${K}" stroke-width="6"/>`; })();
  if (t && m.bawah) o += `<rect x="262" y="380" width="436" height="160" fill="#2a2520"/><path d="M384 40 L376 392 L462 392 L472 40Z M488 40 L498 392 L584 392 L576 40Z" fill="${t.sepatu === 'lars' ? '#2d3328' : K}" stroke="${DIM}" stroke-width="3"/>` + shoe(t.sepatu) + `<g transform="translate(960 0) scale(-1 1)">${shoe(t.sepatu)}</g>`;
  else if (t) o += person(t.face, 330, 150, 1.5) + (m.tas && t.tas ? `<g><rect x="600" y="380" width="120" height="80" rx="10" fill="${P2}" stroke="${K}" stroke-width="4"/><text x="660" y="428" text-anchor="middle" ${ST} font-size="14" fill="${t.tasBahaya ? R : K}">${esc(t.tas.toUpperCase())}</text></g>` : '') + (m.gelang && t.gelang ? `<rect x="250" y="420" width="90" height="26" rx="12" fill="${GELANG[t.gelang]}" stroke="${K}" stroke-width="3"/>` : '');
  return o + `<rect y="490" width="960" height="50" fill="${K}"/>` + gouge(52, 16, 0, 496, 960, 40, 80, 0, P, 2);
}
const GELANG = { merah: R, kuning: '#d9a520', hijau: GREEN, biru: '#2f4f8f' };

function sDiskusi(S) {
  let o = bg(K) + `<path d="M480 80 L90 540 L870 540Z" fill="${P2}" opacity=".16"/><path d="M480 0 V58" stroke="${P2}" stroke-width="3"/><circle cx="480" cy="74" r="16" fill="${P}" stroke="${P2}" stroke-width="3"/>`;
  if (S.f.intelMasuk) o += hot('intel', 'Orang di barisan belakang', person({ head: 'kotak', hair: 'cepak', baju: 'kemeja' }, 414, 100, .6));
  const hadir = [C.ratna].concat((S.f.hadirDiskusi || []).map(id => (INSPEKSI1.find(t => t.id === id) || {}).face).filter(Boolean));
  while (hadir.length < 4) hadir.push(hadir.length % 2 ? C.warga1 : C.dimas);
  [[24, 214, .95], [250, 176, .82], [540, 176, .82], [766, 214, .95]].forEach(([x, y, sc], i) => { o += i === 0 ? hot('ratna', 'Kak Ratna', person(hadir[0], x, y, sc)) : person({ ...hadir.at(i), mood: 'tenang' }, x, y, sc); });
  o += `<path d="M0 430 Q480 410 960 430 V540 H0Z" fill="${P2}"/><path d="M0 430 Q480 410 960 430 V540 H0Z" fill="url(#cross)"/>`;
  return o + hot('buku', 'Fotokopian buku', `<g transform="rotate(-4 480 480)"><rect x="372" y="440" width="230" height="92" fill="${P}" stroke="${K}" stroke-width="4"/><rect x="380" y="448" width="150" height="76" fill="${R}" stroke="${K}" stroke-width="3"/><text x="455" y="478" text-anchor="middle" ${ST} font-size="13" fill="${P}">PENDIDIKAN MORAL</text><text x="455" y="496" text-anchor="middle" ${ST} font-size="13" fill="${P}">PANCASILA</text><text x="566" y="478" text-anchor="middle" ${ST} font-size="14" fill="${K}">BUMI</text><text x="566" y="496" text-anchor="middle" ${ST} font-size="14" fill="${K}">MANUSIA</text></g>`);
}

function sBus(S) {
  let o = bg(P) + `<rect x="60" y="60" width="840" height="300" fill="${P2}"/><path d="M60 250 H900" stroke="${K}" stroke-width="3"/>` + gouge(91, 50, 60, 250, 840, 110, 30, 0, GREEN, 4);
  for (let x = 120; x < 900; x += 160) o += `<path d="M${x} 250 V130 M${x - 30} 140 Q${x} 110 ${x + 30} 140 M${x - 28} 128 Q${x} 104 ${x + 28} 128" stroke="${K}" stroke-width="6" fill="none"/>`;
  o += `<path d="M0 0 H960 V60 H60 V360 H900 V60 H960 V540 H0Z" fill="${K}"/><path d="M60 210 H900" stroke="${K}" stroke-width="8"/>`;
  o += hot('kenek', 'Kenek', person({ head: 'kotak', hair: 'keriting', baju: 'kaus' }, 640, 300, 1));
  return o + hot('asongan', 'Pedagang asongan', person({ head: 'bulat', hair: 'peci', baju: 'kaus' }, 120, 320, .9) + `<rect x="150" y="470" width="120" height="50" fill="${P2}" stroke="${K}" stroke-width="3"/><text x="210" y="502" text-anchor="middle" ${ST} font-size="14" fill="${K}">TAHU</text>`);
}

function sTps(S) {
  let o = wall(101) + floor(400, 102) + `<rect x="300" y="40" width="360" height="60" fill="${R}" stroke="${K}" stroke-width="4"/><text x="480" y="82" text-anchor="middle" ${ST} font-size="32" fill="${P}">TPS 07 · RW 05</text>`;
  o += hot('bilik', 'Bilik suara', [0, 1, 2].map(i => `<rect x="${80 + i * 140}" y="150" width="120" height="250" fill="${P2}" stroke="${K}" stroke-width="4"/><path d="M${80 + i * 140} 170 H${200 + i * 140}" stroke="${K}" stroke-width="3"/><path d="M${90 + i * 140} 172 Q${110 + i * 140} 300 ${96 + i * 140} 400 M${190 + i * 140} 172 Q${170 + i * 140} 300 ${184 + i * 140} 400" stroke="${K}" stroke-width="2"/>`).join(''));
  o += hot('kotak', 'Kotak suara', `<rect x="560" y="300" width="130" height="100" fill="#a9aea5" stroke="${K}" stroke-width="4"/><rect x="590" y="290" width="70" height="12" fill="${K}"/><rect x="616" y="330" width="18" height="24" rx="4" fill="${K}"/>`);
  return o + hot('saksi', 'Saksi di meja TPS', table(720, 330, 220) + person(C.pakRT, 740, 140, .85));
}

function sBank(S) {
  let o = bg(P) + `<rect x="80" y="60" width="520" height="340" fill="${P2}" stroke="${K}" stroke-width="6"/><rect x="80" y="60" width="520" height="60" fill="${K}"/><text x="340" y="102" text-anchor="middle" ${ST} font-size="34" fill="${P}">BANK DANA RAKYAT</text>`;
  for (let i = 0; i < 4; i++) o += `<rect x="${110 + i * 120}" y="150" width="90" height="250" fill="${DIM}" stroke="${K}" stroke-width="3"/>`;
  o += hot('papan', 'Papan kurs', `<rect x="660" y="80" width="250" height="210" fill="${K}"/><text x="785" y="116" text-anchor="middle" ${ST} font-size="18" fill="${P}">MONEY CHANGER</text><text x="690" y="170" ${MONO} font-size="22" font-weight="700" fill="${P2}">USD</text><text x="890" y="170" text-anchor="end" ${MONO} font-size="26" font-weight="700" fill="#e7c34a">${Math.round(S.kurs || 2400).toLocaleString('id-ID')}</text><path d="M680 200 H890 M680 240 H890" stroke="${DIM}" stroke-width="2"/>`);
  o += `<rect y="400" width="960" height="140" fill="${K}"/>`;
  return o + hot('antrean', 'Antrean nasabah', crowd(111, 8, 450, 1.1, DIM, 40, 620)) + hot('satpam', 'Satpam', person(C.petugas, 700, 300, .9));
}

function sToko(S) {
  let o = wall(121) + floor(430, 122);
  for (let j = 0; j < 4; j++) o += `<path d="M40 ${110 + j * 80} H600" stroke="${K}" stroke-width="8"/>` + (j === 3 ? [0, 1].map(i => `<rect x="${60 + i * 40}" y="${76 + j * 80}" width="30" height="34" fill="${P2}" stroke="${K}" stroke-width="2"/>`).join('') : '');
  o += `<path d="M40 70 V430 M600 70 V430" stroke="${K}" stroke-width="10"/>`;
  o += hot('rak', 'Rak kosong', `<rect x="40" y="70" width="560" height="360" fill="transparent"/>`);
  o += hot('papan', 'Papan harga', `<rect x="650" y="60" width="270" height="180" fill="${K}"/><text x="785" y="96" text-anchor="middle" ${ST} font-size="20" fill="${P}">HARGA HARI INI</text><text x="670" y="134" ${MONO} font-size="16" fill="${P2}">Minyak 1 kg</text><text x="670" y="168" ${MONO} font-size="16" fill="${P2}">Beras 1 kg</text><text x="670" y="202" ${MONO} font-size="16" fill="${P2}">Gula 1 kg</text><path d="M820 128 l60 -6 M820 162 l60 -6" stroke="${R}" stroke-width="4"/>`);
  o += hot('radio', 'Radio di meja kasir', table(640, 330, 280) + `<rect x="680" y="280" width="110" height="50" rx="8" fill="${K}"/><circle cx="710" cy="305" r="14" fill="url(#dots)" stroke="${P}" stroke-width="2"/>`);
  return o + hot('ibu', 'Ibu-ibu di antrean', person(C.warga1, 140, 260, .9) + person(C.ibuKos, 360, 280, .85));
}

function sPapan(S) {
  let o = wall(131) + floor(420, 132) + `<rect x="60" y="40" width="840" height="320" fill="#26302a" stroke="${K}" stroke-width="12"/>`;
  const route = (S.m && S.m.pick && S.m.pick.rute) || '';
  o += hot('peta', 'Peta di papan tulis', `<rect x="110" y="200" width="120" height="80" fill="none" stroke="${P}" stroke-width="3"/><text x="170" y="246" text-anchor="middle" ${MONO} font-size="16" fill="${P}">KAMPUS</text><rect x="700" y="80" width="150" height="70" fill="none" stroke="${P}" stroke-width="3"/><text x="775" y="122" text-anchor="middle" ${MONO} font-size="16" fill="${P}">SENAYAN</text><path d="M230 240 H700 M500 240 V110 H700" stroke="${P2}" stroke-width="2" stroke-dasharray="8 8" fill="none"/>`
    + [[420, 240], [600, 110], [560, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="${R}" stroke-width="4"/>`).join('')
    + (route === 'utama' ? `<path d="M230 240 H700 V150" stroke="${P}" stroke-width="5" fill="none"/>` : route === 'kampung' ? `<path d="M230 260 Q400 330 560 300 Q660 280 720 150" stroke="${P}" stroke-width="5" fill="none"/>` : route === 'tetangga' ? `<path d="M230 220 Q360 120 500 110 H700" stroke="${P}" stroke-width="5" fill="none"/>` : ''));
  o += table(160, 420, 640) + hot('kartu', 'Kartu kader', [0, 1, 2, 3, 4].map(i => `<rect x="${200 + i * 110}" y="380" width="80" height="44" fill="${P}" stroke="${K}" stroke-width="3" transform="rotate(${i % 2 ? 4 : -4} ${240 + i * 110} 402)"/>`).join(''));
  return o + hot('daftar', 'Daftar periksa Kak Ratna', `<rect x="800" y="300" width="120" height="110" fill="${P}" stroke="${K}" stroke-width="3"/><path d="M816 324h80M816 346h70M816 368h84M816 390h60" stroke="${K}" stroke-width="2.5"/>`);
}

function sJalan(S, n) {
  const night = n.v === 'malam', r = (S.m && S.m.r) || 0;
  let o = night ? nightSky(141) : bg(P);
  o += `<path d="M0 300 L960 300 L960 540 L0 540Z" fill="${night ? '#22201c' : P2}"/><path d="M380 300 L580 300 L760 540 L200 540Z" fill="${night ? DIM : P}" stroke="${K}" stroke-width="3"/>`;
  o += `<path d="M0 300 V160 H120 V200 H260 V120 H340 V300 M620 300 V140 H760 V190 H960 V300" fill="${K}"/>`;
  if (night) o += `<path d="M120 0 L330 300 L410 300Z M840 0 L600 300 L680 300Z" fill="${P}" opacity=".22"/><path d="M380 240 h220 v40 h-220z M410 220 h120 v20 h-120z M530 228 l90 -10" fill="${GREEN}" stroke="${K}" stroke-width="4"/>`;
  else o += `<rect x="120" y="230" width="140" height="60" fill="${GREEN}" stroke="${K}" stroke-width="4"/>`;
  let shields = ''; for (let i = 0; i < 12; i++) shields += `<rect x="${200 + i * 48}" y="${270 - (night ? 0 : 0)}" width="42" height="70" rx="6" fill="${night ? DIM : '#7d8a86'}" stroke="${K}" stroke-width="3"/><circle cx="${221 + i * 48}" cy="258" r="16" fill="${GREEN}" stroke="${K}" stroke-width="3"/>`;
  o += hot('tameng', 'Barisan tameng', shields);
  if (r >= 2 || night) o += [[300, 380], [520, 360], [700, 400], [420, 420]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${60 + i * 10}" fill="${P2}" opacity=".55"/>`).join('');
  if (r >= 1 && !night) o += `<path d="M520 200 l12 8 l-4 12 l-14 -2z" fill="${K}"/>`;
  o += crowd(142, 10, 520, 1.6, K, -40, 1040);
  return o + hot('spanduk', 'Spanduk', `<path d="M40 440 Q480 410 920 440 L920 500 Q480 470 40 500Z" fill="${R}" stroke="${K}" stroke-width="4"/><text x="480" y="474" text-anchor="middle" ${ST} font-size="30" fill="${P}">${esc(n.spanduk || 'REFORMASI TOTAL')}</text>`);
}

function sKoran(S) {
  const j = S.f.judulKoran || 'Mahasiswa Turun ke Jalan';
  let o = bg(K) + `<g transform="rotate(-2 480 270)"><rect x="140" y="20" width="680" height="500" fill="${P}" stroke="${K}" stroke-width="4"/><text x="480" y="80" text-anchor="middle" ${ST} font-size="48" fill="${K}">HARIAN NUSANTARA</text><path d="M160 96 H800 M160 102 H800" stroke="${K}" stroke-width="3"/>`;
  o += hot('judul', 'Judul utama', `<text x="480" y="150" text-anchor="middle" ${ST} font-size="${j.length > 34 ? 26 : 32}" fill="${R}">${esc(j.toUpperCase())}</text>`);
  o += hot('foto', 'Foto halaman depan', `<rect x="170" y="176" width="380" height="240" fill="${P2}" stroke="${K}" stroke-width="3"/>` + crowd(151, 5, 380, 1.2, K, 170, 380) + `<path d="M170 300 H550" stroke="${K}" stroke-width="2"/>`);
  for (let i = 0; i < 12; i++) o += `<path d="M580 ${190 + i * 20} H${780 - (i % 3) * 30}" stroke="${K}" stroke-width="3"/>`;
  for (let i = 0; i < 4; i++) o += `<path d="M170 ${440 + i * 18} H${780 - (i % 2) * 60}" stroke="${K}" stroke-width="3"/>`;
  return o + '</g>';
}

function sKamarDamar(S) {
  let o = bg('#2a2520') + `<path d="M0 0 L300 540 L0 540Z" fill="${P2}" opacity=".18"/>` + floor(400, 161);
  o += hot('rak', 'Rak buku kosong', `<rect x="620" y="80" width="200" height="300" fill="${K}" stroke="${DIM}" stroke-width="3"/><path d="M620 160 H820 M620 240 H820 M620 320 H820" stroke="${DIM}" stroke-width="4"/>`);
  o += hot('lantai', 'Lantai berdebu', `<path d="M300 470 l20 -6 l6 14 l-20 6z M340 500 l20 -6 l6 14 l-20 6z M380 466 l20 -6 l6 14 l-20 6z" fill="${P2}" opacity=".7"/>` + gouge(162, 20, 120, 420, 600, 100, 30, 0.4, P2, 3));
  o += hot('asbak', 'Asbak', `<ellipse cx="200" cy="380" rx="40" ry="14" fill="${DIM}" stroke="${P2}" stroke-width="3"/><path d="M184 374 l24 -4 M196 380 l22 2" stroke="${P}" stroke-width="4"/>`);
  o += hot('kalender', 'Kalender', `<rect x="360" y="90" width="120" height="150" fill="${P2}" stroke="${K}" stroke-width="3"/><rect x="360" y="90" width="120" height="30" fill="${R}"/><circle cx="420" cy="180" r="14" fill="none" stroke="${R}" stroke-width="3"/>`);
  o += hot('ubin', 'Ubin yang lepas', `<rect x="520" y="440" width="80" height="40" fill="${DIM}" stroke="${P2}" stroke-width="3" transform="rotate(6 560 460)"/>`);
  return o + hot('ibukos', 'Ibu kos di pintu', `<rect x="40" y="60" width="160" height="340" fill="${P2}" opacity=".35"/>` + person(C.ibuKos, 20, 170, .9));
}

/* ---------- kejar-kejaran ---------- */
const SPOT_LABEL = { plafon: 'Plafon', lemari: 'Lemari pakaian', bak: 'Bak air', kolong: 'Kolong ranjang', atap: 'Atap genteng', warga: 'Rumah warga sebelah' };
function sSembunyi(S) {
  const m = S.m, sp = m.spot;
  const beam = m.dekat ? `<path d="M${m.dekat === sp ? 560 : 820} 0 L${m.dekat === sp ? 380 : 700} 540 L${m.dekat === sp ? 760 : 960} 540Z" fill="${P}" opacity=".28"/>` : '';
  if (!sp) {
    let o = bg(NIGHT) + `<rect width="960" height="420" fill="${K}" opacity=".5"/>` + floor(420, 171);
    o += hot('plafon', 'Plafon', `<rect x="380" y="10" width="200" height="40" fill="${DIM}" stroke="${P2}" stroke-width="3"/>`);
    o += hot('lemari', 'Lemari pakaian', `<rect x="60" y="120" width="180" height="300" fill="${DIM}" stroke="${P2}" stroke-width="4"/><path d="M150 120 V420" stroke="${P2}" stroke-width="3"/>`);
    o += hot('bak', 'Kamar mandi', `<rect x="300" y="150" width="120" height="270" fill="${K}" stroke="${P2}" stroke-width="4"/>`);
    o += hot('kolong', 'Kolong ranjang', `<rect x="480" y="340" width="300" height="60" fill="${DIM}" stroke="${P2}" stroke-width="4"/><path d="M480 400 V430 M780 400 V430" stroke="${P2}" stroke-width="6"/>`);
    o += hot('atap', 'Jendela ke atap', `<rect x="820" y="80" width="110" height="140" fill="${NIGHT}" stroke="${P2}" stroke-width="5"/>`);
    return o + hot('warga', 'Pintu belakang ke rumah warga', `<rect x="840" y="250" width="90" height="170" fill="${K}" stroke="${P2}" stroke-width="4"/>`);
  }
  let o;
  if (sp === 'lemari') { o = bg('#2a2520'); for (let x = 0; x < 960; x += 80) o += `<rect x="${x}" y="0" width="56" height="540" fill="${K}"/>`; }
  else if (sp === 'plafon') o = bg(K) + `<path d="M0 300 H960 M0 360 H960" stroke="${DIM}" stroke-width="20"/><rect x="400" y="300" width="160" height="60" fill="${P2}" opacity=".5"/>`;
  else if (sp === 'bak') o = bg('#2a2a28') + (() => { let t = ''; for (let y = 0; y < 300; y += 50) t += `<path d="M0 ${y} H960" stroke="${DIM}" stroke-width="3"/>`; return t; })() + `<rect y="300" width="960" height="240" fill="#2f3b44"/><path d="M0 330 q120 -20 240 0 t240 0 t240 0 t240 0" stroke="${P2}" stroke-width="3" fill="none"/>`;
  else if (sp === 'kolong') o = bg(K) + `<rect y="0" width="960" height="120" fill="${DIM}"/><rect y="460" width="960" height="80" fill="#2a2520"/>`;
  else if (sp === 'atap') { o = nightSky(181); for (let y = 300; y < 540; y += 30) o += `<path d="M0 ${y} q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="${R}" stroke-width="10" fill="none"/>`; }
  else o = bg('#2a2520') + `<rect x="80" y="260" width="200" height="120" fill="${K}"/><circle cx="140" cy="250" r="20" fill="${R}"/><path d="M600 0 V540" stroke="${P2}" stroke-width="4"/>` + person(C.warga1, 640, 200, 1);
  o += beam;
  if (m.dekat === sp) o += `<path d="M380 470 l40 -4 l0 40 l-44 0z M460 470 l40 -4 l0 40 l-44 0z" fill="${K}" stroke="${P2}" stroke-width="2"/>`;
  return o + `<text x="24" y="40" ${MONO} font-weight="700" font-size="18" fill="${P2}">${SPOT_LABEL[sp]}</text>`;
}
const CUE_ICON = {
  peluit: `<path d="M-20 0 h30 a12 12 0 1 1 0 24 h-30z" fill="${P2}"/>`,
  anjing: `<path d="M-24 10 q10 -24 30 -10 l10 -10 l4 14 q-6 18 -30 16z" fill="${P2}"/>`,
  warung: `<rect x="-24" y="-6" width="48" height="30" fill="#e7c34a"/>`,
  musala: `<path d="M-22 24 V0 Q0 -26 22 0 V24Z" fill="${P2}"/>`,
  pasar: `<path d="M-26 24 L-20 -4 H20 L26 24Z" fill="${R}"/>`,
  gelap: `<circle r="14" fill="${DIM}"/>`
};
function sGang(S) {
  const j = S.m.opsi || [];
  let o = bg(NIGHT) + `<path d="M0 0 L300 180 L300 420 L0 540Z M960 0 L660 180 L660 420 L960 540Z" fill="${K}"/><path d="M300 420 L660 420 L960 540 L0 540Z" fill="#22201c"/>` + gouge(191, 20, 0, 430, 960, 100, 30, 0, DIM, 3);
  const pos = [[180, 300], [480, 300], [780, 300]];
  j.forEach((d, i) => { const [x, y] = pos.at(j.length === 2 ? (i ? 2 : 0) : i); o += hot('arah' + i, d.label, `<rect x="${x - 80}" y="${y - 110}" width="160" height="200" fill="${DARK}" stroke="${P2}" stroke-width="4"/><g transform="translate(${x} ${y - 30})">${CUE_ICON[d.cue]}</g><text x="${x}" y="${y + 70}" text-anchor="middle" ${ST} font-size="18" fill="${P2}">${esc(d.label)}</text>`); });
  return o;
}
function sMobil(S) {
  const m = S.m, jarak = m.jarak ?? 2, sz = 40 - jarak * 7;
  let o = bg(NIGHT) + `<path d="M260 120 L700 120 L860 360 L100 360Z" fill="#22201c"/><path d="M480 120 V360" stroke="${P2}" stroke-width="4" stroke-dasharray="20 20"/>`;
  o += `<path d="M0 0 H960 V120 H700 Q480 100 260 120 H0Z" fill="${K}"/><path d="M0 360 H960 V540 H0Z" fill="${K}"/>`;
  o += `<path d="M120 540 Q120 330 300 320 Q380 320 400 540Z M560 540 Q580 320 660 320 Q840 330 840 540Z" fill="${DIM}" stroke="${K}" stroke-width="4"/>` + person(C[m.sopir] || C.warga2, 190, 230, .7);
  o += hot('spion', 'Spion', `<rect x="400" y="40" width="160" height="56" rx="12" fill="${K}" stroke="${P2}" stroke-width="4"/><rect x="408" y="48" width="144" height="40" rx="8" fill="${NIGHT}"/><circle cx="${468}" cy="68" r="${Math.max(4, sz / 3)}" fill="#e7c34a"/><circle cx="${492}" cy="68" r="${Math.max(4, sz / 3)}" fill="#e7c34a"/>`);
  return o + `<circle cx="300" cy="200" r="10" fill="${R}" opacity="${m.r % 2 ? .8 : .2}"/>`;
}
function sPeriksa(S, n) {
  if (n.jenis === 'culik') return bg('#060505') + gouge(201, 60, 0, 0, 960, 540, 3, 0, '#1a1716', 3) + `<text x="480" y="280" text-anchor="middle" ${MONO} font-size="20" fill="#3d3833">${(S.m.jam || 0)} jam</text>`;
  let o = bg('#141210') + `<path d="M480 60 L180 540 L780 540Z" fill="${P}" opacity=".14"/><path d="M480 0 V50" stroke="${P2}" stroke-width="3"/><path d="M440 50 h80 l-14 24 h-52z" fill="${DIM}"/>`;
  o += hot('interogator', 'Interogator', person(C.interogator, 360, 150, 1.2));
  o += hot('jam', 'Jam dinding', `<circle cx="820" cy="110" r="50" fill="${P2}" stroke="${K}" stroke-width="5"/><path d="M820 110 L820 76 M820 110 L${820 + 30 * Math.cos(((S.m.jam || 0) % 12) / 12 * 2 * Math.PI - Math.PI / 2)} ${110 + 30 * Math.sin(((S.m.jam || 0) % 12) / 12 * 2 * Math.PI - Math.PI / 2)}" ${ink(4)}/>`);
  return o + `<rect x="100" y="440" width="760" height="100" fill="${DIM}" stroke="${K}" stroke-width="5"/>` + hot('asbak', 'Asbak', `<ellipse cx="700" cy="460" rx="40" ry="12" fill="${K}"/>`);
}

/* ---------- babak III ---------- */
const KOTA_SKETSA = {
  jakarta: `<path d="M470 360 V120 L480 80 L490 120 V360Z" fill="${K}"/><path d="M462 80 q18 -40 36 0z" fill="#e7c34a"/><rect x="420" y="340" width="120" height="30" fill="${K}"/>`,
  bandung: `<path d="M300 360 V240 H660 V360Z M460 240 V180 H500 V240" fill="${K}"/><path d="M470 180 V140 M462 150 h16 M464 140 h12" stroke="${K}" stroke-width="5"/>`,
  yogya: `<path d="M460 360 V180 Q480 140 500 180 V360Z" fill="${K}"/><circle cx="480" cy="150" r="16" fill="${K}"/><path d="M0 360 L200 220 L320 360Z" fill="${DIM}"/>`,
  surabaya: `<path d="M462 360 L470 110 Q480 90 490 110 L498 360Z" fill="${K}"/><path d="M380 360 H580 V340 H380Z" fill="${K}"/>`,
  medan: `<path d="M360 360 V250 H600 V360Z" fill="${K}"/><path d="M420 250 Q480 160 540 250Z" fill="${K}"/><path d="M600 360 V200 H620 V360" fill="${K}"/>`,
  magelang: `<path d="M0 360 L300 170 L600 360Z M380 360 L640 200 L960 360Z" fill="${DIM}"/>` + gouge(211, 40, 0, 360, 960, 60, 30, 0, GREEN, 4)
};
function sKota(S) {
  const k = S.m.kota || 'jakarta', night = (S.m.minggu || 1) % 2 === 0;
  let o = night ? nightSky(221) : bg(P) + `<circle cx="820" cy="90" r="40" fill="${P}" stroke="${K}" stroke-width="5"/>`;
  o += `<rect y="360" width="960" height="180" fill="${K}"/>` + KOTA_SKETSA[k] + crowd(222, 6, 470, 1.1, DIM);
  o += hot('peta', 'Peta buron', `<g transform="translate(700 380)"><rect width="240" height="140" fill="${P}" stroke="${K}" stroke-width="4"/><path d="M20 30 L90 70 L130 60 L210 90 M30 100 L200 110" stroke="${K}" stroke-width="3" fill="none"/>${(S.m.jejakKota || []).map((c, i) => `<circle cx="${30 + i * 36}" cy="${40 + (i % 2) * 50}" r="7" fill="${R}"/>`).join('')}</g>`);
  return o + hot('wartel', 'Wartel', `<g transform="translate(60 250)"><rect width="140" height="170" fill="${P2}" stroke="${K}" stroke-width="4"/><text x="70" y="30" text-anchor="middle" ${ST} font-size="20" fill="${R}">WARTEL</text><rect x="20" y="50" width="100" height="40" fill="${K}"/><text x="70" y="78" text-anchor="middle" ${MONO} font-size="18" fill="#e7c34a">000.00</text></g>`);
}
function sTerminal(S, n) {
  let o = bg(P) + `<path d="M0 120 H960 V150 H0Z" fill="${K}"/>` + [0, 1, 2].map(i => `<rect x="${40 + i * 300}" y="200" width="260" height="130" rx="20" fill="${i === 1 ? R : P2}" stroke="${K}" stroke-width="5"/><circle cx="${90 + i * 300}" cy="330" r="22" fill="${K}"/><circle cx="${250 + i * 300}" cy="330" r="22" fill="${K}"/>`).join('');
  o += `<rect y="350" width="960" height="190" fill="${K}"/>` + table(520, 380, 380);
  o += hot('petugas', n.v === 'imigrasi' ? 'Petugas imigrasi' : 'Petugas razia KTP', person(C.petugas, 600, 190, 1));
  return o + hot('antrean', 'Antrean', crowd(231, 5, 470, 1.2, DIM, 0, 480)) + (n.v === 'imigrasi' ? `<rect x="560" y="140" width="260" height="40" fill="${K}"/><text x="690" y="168" text-anchor="middle" ${ST} font-size="20" fill="${P}">IMIGRASI</text>` : '');
}
function sJenewa(S) {
  let o = wall(241) + floor(420, 242) + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${100 + i * 150} 420 V120" stroke="${K}" stroke-width="5"/><rect x="${102 + i * 150}" y="120" width="60" height="40" fill="${[R, '#2f4f8f', GREEN, '#e7c34a', K, P2].at(i)}" stroke="${K}" stroke-width="2"/>`).join('');
  o += hot('delegasi', 'Delegasi negara', person({ head: 'kotak', hair: 'uban', baju: 'kemeja' }, 40, 230, .85));
  o += hot('pelapor', 'Pelapor khusus PBB', person({ head: 'oval', hair: 'bob', glasses: 'kotak', baju: 'kemeja' }, 280, 220, .85));
  o += hot('wartawan', 'Wartawan internasional', person({ head: 'bulat', hair: 'keriting', baju: 'kaus' }, 520, 230, .85));
  return o + hot('eksil', 'Seorang eksil 1965', person(C.eksil, 760, 220, .85));
}
function sJauh(S) {
  return wall(251, P2) + winFrame(560, 60, 340, 240, true) + `<path d="M570 260 h320" stroke="${P2}" stroke-width="3"/>` + floor(420, 252) + hot('tv', 'Televisi kamar penginapan', tvSet(80, 160, 300, 200, `<rect width="200" height="140" fill="${P2}"/>${smoke(60, 140, 120, 1)}${smoke(140, 140, 100, 2)}<text x="100" y="24" text-anchor="middle" ${ST} font-size="16" fill="${R}">JAKARTA</text>`)) + hot('telepon', 'Telepon kamar', `<rect x="440" y="360" width="70" height="40" rx="6" fill="${K}"/>`);
}

/* ---------- babak IV dan V ---------- */
function sAtap(S, n) {
  let o = bg(P2) + `<rect y="380" width="960" height="160" fill="${K}"/><path d="M0 380 V300 H80 V330 H160 V260 H260 V320 H380 V280 H520 V340 H640 V270 H760 V320 H960 V380Z" fill="${DIM}"/>`;
  const r = rng(261), nAsap = n.asap || 7;
  for (let i = 0; i < nAsap; i++) o += smoke(60 + r() * 840, 320, 120 + r() * 180, 262 + i);
  o += hot('asap', 'Asap di cakrawala', `<rect x="0" y="0" width="960" height="320" fill="transparent"/>`);
  o += hot('truk', 'Truk di kejauhan', `<rect x="700" y="350" width="70" height="26" fill="${GREEN}" stroke="${K}" stroke-width="2"/>`);
  return o + hot('kawan', 'Kawan di atap', person(C.bimo, 40, 300, .9)) + hot('radio', 'Radio', `<rect x="820" y="440" width="100" height="50" rx="8" fill="${P2}" stroke="${K}" stroke-width="3"/>`);
}
function sKubah(S) {
  let o = bg(P) + `<path d="M80 360 Q280 80 480 360 Q680 80 880 360 Z" fill="${GREEN}" stroke="${K}" stroke-width="6"/>` + gouge(271, 30, 120, 200, 720, 150, 40, -0.4, K, 3);
  o += crowd(272, 14, 300, .6, K, 160, 640) + `<rect y="360" width="960" height="180" fill="${K}"/>` + crowd(273, 16, 470, 1, DIM);
  o += hot('spanduk', 'Spanduk di kubah', `<rect x="330" y="170" width="300" height="46" fill="${R}" stroke="${K}" stroke-width="3"/><text x="480" y="202" text-anchor="middle" ${ST} font-size="24" fill="${P}">TURUNKAN SEKARANG</text>`);
  return o + hot('dapur', 'Dapur umum', `<rect x="40" y="400" width="200" height="80" fill="${P2}" stroke="${K}" stroke-width="4"/><text x="140" y="448" text-anchor="middle" ${ST} font-size="18" fill="${K}">DAPUR UMUM</text>`);
}
function sLorongDpr(S) {
  return wall(281) + neon(200, 560, 'neon') + floor(430, 282) + winFrame(700, 80, 220, 160, true) + `<rect x="740" y="190" width="70" height="30" fill="${GREEN}"/>` + hot('safari', 'Laki-laki bersafari', person(C.safari, 300, 160, 1.2)) + hot('amplop', 'Amplop cokelat', `<rect x="380" y="430" width="140" height="80" fill="#a3743e" stroke="${K}" stroke-width="4" transform="rotate(-6 450 470)"/>`);
}
function sLobi(S) {
  return wall(291) + floor(420, 292) + table(380, 330, 200) + tvSet(390, 200, 180, 130, tvPodium) + crowd(293, 9, 500, 1.6, K, -40, 1040);
}
function sKontrakan(S) {
  const pf = S.penyusup && C[S.penyusup] ? { ...C[S.penyusup], fh: 'kumis', glasses: 'kotak', baju: 'batik' } : C.tokoh;
  let o = wall(301) + floor(420, 302) + `<rect x="620" y="230" width="280" height="190" fill="${K}"/>` + hot('tv', 'Televisi', tvSet(640, 110, 240, 150, `<rect width="200" height="140" fill="${P2}"/><svg x="60" y="10" width="80" height="96" viewBox="0 0 200 240">${face(pf)}</svg><rect y="110" width="200" height="30" fill="${R}"/>`));
  o += table(140, 380, 420) + hot('kotak', 'Kotak Daftar Nama', `<rect x="230" y="300" width="200" height="80" fill="#a3743e" stroke="${K}" stroke-width="4"/><path d="M240 300 l20 -30 h140 l20 30" fill="${P2}" stroke="${K}" stroke-width="3"/>`);
  return o + hot('telepon', 'Telepon', `<rect x="480" y="340" width="70" height="40" rx="6" fill="${K}"/>`);
}
function sLaporan(S) {
  return bg('#2a2520') + `<path d="M480 0 L140 540 L820 540Z" fill="${P}" opacity=".15"/>` + table(100, 380, 760) + hot('laporan', 'Laporan penyelidikan', `<rect x="320" y="250" width="300" height="130" fill="${P}" stroke="${K}" stroke-width="4"/><text x="470" y="300" text-anchor="middle" ${ST} font-size="18" fill="${K}">LAPORAN PENYELIDIKAN</text><text x="470" y="326" text-anchor="middle" ${MONO} font-size="13" fill="${K}">PENGHILANGAN ORANG SECARA PAKSA</text><text x="470" y="346" text-anchor="middle" ${MONO} font-size="13" fill="${K}">1997–1998</text>`) + hot('foto', 'Foto-foto lama', [0, 1, 2].map(i => `<rect x="${660 + i * 50}" y="${290 + i * 8}" width="70" height="86" fill="${P2}" stroke="${K}" stroke-width="3" transform="rotate(${i * 7 - 7} ${695 + i * 50} 333)"/>`).join(''));
}
function sPoster(S) {
  let w = ''; for (let i = 0; i < 18; i += 2) { const a0 = Math.PI + i / 18 * Math.PI, a1 = Math.PI + (i + 1) / 18 * Math.PI; w += `M480 560L${(480 + Math.cos(a0) * 1100).toFixed(0)} ${(560 + Math.sin(a0) * 1100).toFixed(0)}L${(480 + Math.cos(a1) * 1100).toFixed(0)} ${(560 + Math.sin(a1) * 1100).toFixed(0)}Z`; }
  let crowdS = '';
  for (let i = 0; i < 13; i++) { const x = 20 + i * 77; if (i % 3 === 1) crowdS += `<path d="M${x + 14} 470 L${x + 34} 392" stroke="${K}" stroke-width="16" stroke-linecap="round"/><circle cx="${x + 36}" cy="384" r="15" fill="${K}"/>`; crowdS += `<circle cx="${x}" cy="462" r="27" fill="${K}"/><path d="M${x - 46} 540 Q${x - 44} 494 ${x} 494 Q${x + 44} 494 ${x + 46} 540Z" fill="${K}"/>`; }
  const sub = S.ending ? 'TIDAK ADA YANG SELAMAT UTUH' : 'JAKARTA 1996–2006';
  return bg(P) + `<path d="${w}" fill="${S.ending ? K : R}"/>${crowdS}<rect x="150" y="120" width="660" height="200" fill="${P}" stroke="${K}" stroke-width="8"/><text x="480" y="238" text-anchor="middle" ${ST} font-size="104" fill="${K}">ANGKATAN 98</text><text x="480" y="290" text-anchor="middle" ${MONO} font-weight="700" font-size="20" letter-spacing="5" fill="${R}">${sub}</text>`;
}

const SCENES = {
  poster: sPoster, rumah: sRumah, gerbang: sGerbang, lapangan: sLapangan, ktm: sKtm, sekre: sSekre, kos: sKos, inspect: sInspect, diskusi: sDiskusi,
  bus: sBus, tps: sTps, bank: sBank, toko: sToko, papan: sPapan, jalan: sJalan, koran: sKoran, kamarDamar: sKamarDamar, sembunyi: sSembunyi, gang: sGang,
  mobil: sMobil, periksa: sPeriksa, kota: sKota, terminal: sTerminal, jenewa: sJenewa, jauh: sJauh, atap: sAtap, kubah: sKubah, lorongDpr: sLorongDpr,
  lobi: sLobi, kontrakan: sKontrakan, laporan: sLaporan
};
