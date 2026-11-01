/* Angkatan 98 · lembar isyarat: apa yang berubah di gambar saat tiap paragraf muncul.
   Urutan isyarat mengikuti urutan paragraf di text adegan (atau note pilihan). Adegan yang tidak tercantum
   tetap mendapat sorotan otomatis: paragraf yang menyebut orang atau benda di adegan menyorotnya.
   Isi isyarat: raut { tokoh: tenang|gugup|marah|sedih|senyum|kaget }, lampu redup|padam|senter|'' ,
   tambah (svg tokoh atau benda), getar, fokus (id benda di adegan; false = jangan menyorot). */

const ISYARAT = {
  p_rumah: [{ raut: { ibu: 'senyum' } }, { fokus: 'tv', raut: { bapak: 'gugup' } }],
  b2_tamu: [{ lampu: 'redup', getar: true, fokus: 'pintu' }, { tambah: () => person(C.yos, 170, 140, 0.9) }, {}],
  b3_diskusi: s => [{ lampu: 'redup' }, s.f.intelMasuk ? { fokus: 'intel', raut: { ratna: 'marah' } } : { raut: { ratna: 'senyum' } }],
  b4_rumah: [{ raut: { ibu: 'senyum', dika: 'senyum' } }, { raut: { bapak: 'gugup', ibu: 'tenang', dika: 'tenang' }, fokus: 'bapak' }],
  b4_teror: s => [{ getar: true, fokus: 'stensil' }, {}, s.f.yosPemimpin ? { tambah: () => person(C.yos, 680, 170, 0.85) } : {}],
  b7_dering: [{ lampu: 'padam', fokus: 'pintu', getar: true }, { getar: true }],
  b7_telepon: [{ lampu: 'padam', fokus: 'pintu' }, { lampu: '', fokus: 'jendela' }],
  b10_kamar: [{}, { lampu: 'senter' }],
  b11_razia: s => [{ getar: true }, ...(yosAda(s) ? [{ tambah: () => person(C.yos, 40, 250, 0.7) }] : []), ...(s.f.hendraKenal ? [{ lampu: 'redup' }] : []), {}],
  periksa: s => [{ raut: { interogator: s.f.hendraKenal ? 'senyum' : 'tenang' }, lampu: 'redup' }, { fokus: 'jam' }],
  b14_sekre: s => [{ getar: true, raut: { bimo: 'sedih', dimas: 'marah', mei: 'sedih' }, fokus: 'radio' }, ...(s.f.plafonDiambil ? [{}] : []), { fokus: 'kawan' }],
  b15_atap: [{ fokus: 'asap', lampu: 'redup' }, { raut: { bimo: 'sedih' }, fokus: 'kawan' }],
  b16_bapak: s => [{ tambah: () => person(C.bapak, 360, 230, 1), raut: { bapak: s.f.suratBohong ? 'marah' : 'senyum' } }],
  b16_amplop: [{}, { raut: { safari: 'senyum' }, fokus: 'amplop' }],
  b17_lobi: [{}, { getar: true }],
  b19_adik: [{}, {}, { fokus: 'kalender' }, {}],
  teror: s => [{ raut: { bapak: 'sedih', ibu: 'sedih', dika: s.f.terorIni === 'dika' || s.f.terorIni === 'bawa' ? 'kaget' : 'sedih' }, lampu: 'redup' }],
  insomnia: [{ lampu: 'padam' }],
  sela_nyanyi: [{ lampu: 'redup' }]
};
for (const [id, isy] of Object.entries(ISYARAT)) NODES[id].isyarat = isy;

// isyarat untuk catatan hasil pilihan, dicari dari awal teks pilihannya
const ISYARAT_PILIHAN = {
  p_rumah: {
    'Berjanji kepada Bapak': [{ raut: { bapak: 'tenang', dika: 'sedih' }, fokus: 'dika' }],
    'Diam saja': [{ raut: { bapak: 'tenang' }, lampu: 'redup' }],
    'Bilang kamu ingin tahu': [{ raut: { bapak: 'marah', dika: 'senyum' }, fokus: 'bapak' }]
  },
  b4_rumah: {
    'Ceritakan semuanya kepada Bapak': s => [{ raut: { bapak: s.f.janjiBapak ? 'marah' : 'sedih', ibu: 'sedih' }, fokus: 'bapak' }],
    'Bilang kamu hanya kuliah': [{ raut: { bapak: 'senyum', dika: 'sedih' }, fokus: 'dika' }],
    'Ceritakan semuanya kepada Dika': [{ raut: { dika: 'senyum' }, fokus: 'dika' }],
    'Beri Dika satu buku': [{ raut: { dika: 'kaget' }, fokus: 'dika' }]
  },
  b3_diskusi: {
    'Mulai seperti biasa': s => [{ raut: { ratna: s.f.intelMasuk ? 'gugup' : 'senyum' } }],
    'Bubarkan dengan alasan listrik padam': [{ lampu: 'padam' }],
    'Ganti topik': [{ raut: { ratna: 'tenang' } }],
    'Serahkan ke Mas Yudi': [{ raut: { ratna: 'marah' } }]
  },
  b7_telepon: {
    'Abaikan': [{ lampu: '' }],
    'Laporkan': [{ lampu: '' }],
    'Pulang ke Magelang': [{ lampu: '' }]
  }
};
for (const [id, peta] of Object.entries(ISYARAT_PILIHAN)) {
  const pilihan = NODES[id].choices;
  if (!Array.isArray(pilihan)) continue;
  for (const [awal, isy] of Object.entries(peta)) {
    const c = pilihan.find(x => typeof x.t === 'string' && x.t.startsWith(awal));
    console.assert(c, `isyarat pilihan tidak ketemu: ${id} · ${awal}`);
    if (c) c.isyarat = isy;
  }
}
