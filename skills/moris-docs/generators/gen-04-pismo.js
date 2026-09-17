/* WZÓR — Pismo do klienta (korespondencja handlowa B2B) */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, h1, h2,
  calloutBox, gap, dataTable,
  PAGE, CONTENT_W, Paragraph, TextRun, AlignmentType, BorderStyle,
} = B;

// blok danych nadawcy/adresata
function addressBlock(lines, opts = {}) {
  return lines.map((ln, i) => new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: 0, after: 20, line: 264 },
    children: [new TextRun({
      text: ln, size: opts.size || 20,
      bold: i === 0 && opts.boldFirst,
      color: opts.color || COLOR.ink,
    })],
  }));
}

const children = [
  // nagłówek nadawcy
  new Paragraph({
    spacing: { before: 0, after: 40 },
    children: [
      new TextRun({ text: "Moris", bold: true, size: 36, color: COLOR.navy }),
      new TextRun({ text: ".eu", bold: true, size: 36, color: COLOR.navy }),
    ],
  }),
  ...addressBlock([
    "Moris sp. z o.o.",
    "ul. Wiejska 27, 41-500 Chorz\u00f3w",
    "tel. 32 416 36 99  |  info@moris.eu  |  moris.eu",
  ], { size: 18, color: COLOR.grey }),
  new Paragraph({
    spacing: { before: 120, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, space: 4, color: COLOR.navy } },
    children: [],
  }),

  // miejscowość i data — do prawej
  new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 200 },
    children: [new TextRun({ text: "Chorz\u00f3w, [DD.MM.RRRR]", size: 20, color: COLOR.ink })],
  }),

  // adresat
  ...addressBlock([
    "[Nazwa firmy klienta]",
    "[Imi\u0119 i nazwisko osoby kontaktowej]",
    "[Ulica i numer]",
    "[Kod pocztowy i miejscowo\u015b\u0107]",
  ], { boldFirst: true, size: 22 }),
  gap(160),

  // znak sprawy
  new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: "Znak sprawy: ", bold: true, size: 20, color: COLOR.navy }),
      new TextRun({ text: "[ZSZ-\u2026 / numer wewn\u0119trzny]", size: 20, color: COLOR.ink }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "Dotyczy: ", bold: true, size: 20, color: COLOR.navy }),
      new TextRun({ text: "[zwi\u0119z\u0142e okre\u015blenie tematu pisma]", size: 20, color: COLOR.ink }),
    ],
  }),

  // zwrot grzecznościowy
  pRuns([new TextRun({ text: "Szanowni Pa\u0144stwo,", size: 22, color: COLOR.ink })]),

  // treść — wskazówki redakcyjne
  p("[Akapit pierwszy \u2014 cel pisma. Podaj jednoznacznie, czego dotyczy korespondencja i z jakiego powodu kierujemy j\u0105 do klienta. Przywo\u0142aj konkretny numer zam\u00f3wienia, faktury lub zapytania.]"),
  p("[Akapit drugi \u2014 sedno sprawy. Przedstaw fakty, ustalenia lub stanowisko Moris. U\u017cywaj konkretnych dat i kwot zamiast sformu\u0142owa\u0144 og\u00f3lnych.]"),
  p("[Akapit trzeci \u2014 oczekiwane dzia\u0142anie i termin. Wska\u017c jednoznacznie, czego oczekujemy od klienta i do kiedy, a tak\u017ce konsekwencje braku reakcji, je\u015bli dotycz\u0105.]"),

  calloutBox("Wskaz\u00f3wka redakcyjna (usu\u0144 przed wys\u0142aniem): w korespondencji windykacyjnej i reklamacyjnej rezygnujemy z j\u0119zyka przepraszaj\u0105cego. Podajemy konkretny termin, numer dokumentu i jednoznacznie nazwane nast\u0119pstwa. Nawet odmawiaj\u0105c, pozostawiamy otwart\u0105 \u015bcie\u017ck\u0119 dalszej wsp\u00f3\u0142pracy.", COLOR.amber),

  p("[Akapit zamykaj\u0105cy \u2014 pozostawienie kontaktu. Zaznacz gotowo\u015b\u0107 do rozmowy i podaj bezpo\u015bredni kontakt do osoby prowadz\u0105cej spraw\u0119.]"),

  // podpis
  gap(200),
  pRuns([new TextRun({ text: "Z powa\u017caniem,", size: 22, color: COLOR.ink })]),
  gap(160),
  pRuns([new TextRun({ text: "[Imi\u0119 i nazwisko]", bold: true, size: 22, color: COLOR.navy })]),
  pRuns([new TextRun({ text: "[Stanowisko] \u2014 Dzia\u0142 Sprzeda\u017cy E-Commerce", size: 20, color: COLOR.grey })]),
  pRuns([new TextRun({ text: "Moris sp. z o.o.  |  tel. [numer]  |  [adres@moris.eu]", size: 20, color: COLOR.grey })]),

  // załączniki
  gap(200),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: "Za\u0142\u0105czniki:", bold: true, size: 20, color: COLOR.navy })],
  }),
  bullet("[Za\u0142\u0105cznik 1 \u2014 nazwa]"),
  bullet("[Za\u0142\u0105cznik 2 \u2014 nazwa]"),
];

const doc = buildDoc([{
  properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
  headers: { default: header("Korespondencja handlowa", "Dzia\u0142 Sprzeda\u017cy E-Commerce") },
  footers: { default: footer("Moris sp. z o.o.", "1.0", false) },
  children,
}]);

B.Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("./out/04_Wzor_pismo_do_klienta.docx", buf);
  console.log("OK: Wzor pisma do klienta");
});
