/* WZORY — Notatka z weekly + Notatka z rekrutacji + Odpowiedź na reklamację */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak, dataTable, metaTable, titlePage,
  PAGE, CONTENT_W, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType,
} = B;

function opBanner(kicker, title) {
  return [
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "Moris", bold: true, size: 32, color: COLOR.navy }),
      new TextRun({ text: ".eu", bold: true, size: 32, color: COLOR.navy }),
    ]}),
    new Paragraph({ spacing: { before: 80, after: 40 }, children: [new TextRun({
      text: kicker.toUpperCase().split("").join("\u200a"), bold: true, size: 20, color: COLOR.grey,
    })]}),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 16, space: 6, color: COLOR.navy } },
      children: [new TextRun({ text: title, bold: true, size: 40, color: COLOR.navy })],
    }),
  ];
}

function fieldRow(label, w = CONTENT_W) {
  return new Table({
    width: { size: w, type: WidthType.DXA }, columnWidths: [w],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: w, type: WidthType.DXA },
      borders: { top:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE},
        bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.line } },
      margins: { top: 60, bottom: 100, left: 0, right: 0 },
      children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 19, color: COLOR.navy })] })],
    })] })],
  });
}

function signatureRow(left, right) {
  const mk = (label, mL, mR) => new TableCell({
    width: { size: CONTENT_W / 2, type: WidthType.DXA },
    borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
    margins: { top: 200, bottom: 0, left: mL, right: mR },
    children: [
      new Paragraph({ spacing:{after:200}, children:[new TextRun({ text:"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026", color:COLOR.grey })] }),
      new Paragraph({ children:[new TextRun({ text:label, bold:true, size:19, color:COLOR.navy })] }),
    ],
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W / 2, CONTENT_W / 2],
    rows: [new TableRow({ children: [mk(left, 0, 200), mk(right, 200, 0)] })],
  });
}

/* ============ 13 — NOTATKA Z WEEKLY ZESPOŁU ============ */
const weekly = [
  ...opBanner("Spotkanie zespo\u0142u \u2014 weekly", "Notatka ze spotkania"),
  metaTable([
    ["Spotkanie", "Weekly Dzia\u0142u Sprzeda\u017cy E-Commerce"],
    ["Data", "[DD.MM.RRRR]"],
    ["Tydzie\u0144", "[Nr tygodnia / zakres dat]"],
    ["Prowadz\u0105cy", "[Imi\u0119 i nazwisko]"],
    ["Protokolant", "[Imi\u0119 i nazwisko]"],
    ["Klasyfikacja", "U\u017cytek wewn\u0119trzny"],
  ]),

  h1("1. Obecno\u015b\u0107"),
  dataTable([CONTENT_W - 3000, 3000], [
    ["Cz\u0142onek zespo\u0142u", "Obecno\u015b\u0107"],
    ["[Imi\u0119 i nazwisko]", "[Obecny / nieobecny]"],
    ["[Imi\u0119 i nazwisko]", "[Obecny / nieobecny]"],
    ["[Imi\u0119 i nazwisko]", "[Obecny / nieobecny]"],
  ]),

  h1("2. Realizacja zada\u0144 z poprzedniego tygodnia"),
  p("[Przegl\u0105d zada\u0144 ustalonych na poprzednim weekly \u2014 status i kr\u00f3tki komentarz dla ka\u017cdego.]"),
  dataTable([CONTENT_W - 4400, 2000, 2400], [
    ["Zadanie", "Status", "Komentarz"],
    ["[Zadanie]", "[Zrealizowane / w toku / przeniesione]", "[Komentarz]"],
    ["[Zadanie]", "[Zrealizowane / w toku / przeniesione]", "[Komentarz]"],
  ]),

  h1("3. Wyniki tygodnia"),
  p("[Kr\u00f3tkie zestawienie kluczowych wska\u017anik\u00f3w tygodnia wobec planu \u2014 sprzeda\u017c, zam\u00f3wienia, bie\u017c\u0105ce priorytety.]"),
  dataTable([CONTENT_W - 5400, 1800, 1800, 1800], [
    ["Wska\u017anik", "Plan", "Wykonanie", "Komentarz"],
    ["[Wska\u017anik]", "[Warto\u015b\u0107]", "[Warto\u015b\u0107]", "[Komentarz]"],
    ["[Wska\u017anik]", "[Warto\u015b\u0107]", "[Warto\u015b\u0107]", "[Komentarz]"],
  ]),

  h1("4. Om\u00f3wione tematy"),
  h2("4.1 [Temat pierwszy]"),
  p("[Streszczenie dyskusji i ustalonego stanowiska.]"),
  h2("4.2 [Temat drugi]"),
  p("[Streszczenie dyskusji i ustalonego stanowiska.]"),

  h1("5. Sprawy zg\u0142oszone przez zesp\u00f3\u0142"),
  p("[Tematy, problemy lub potrzeby zg\u0142oszone przez cz\u0142onk\u00f3w zespo\u0142u oraz spos\u00f3b ich za\u0142atwienia.]"),
  bullet("[Zg\u0142oszenie \u2014 spos\u00f3b za\u0142atwienia / decyzja]"),
  bullet("[Zg\u0142oszenie \u2014 spos\u00f3b za\u0142atwienia / decyzja]"),

  h1("6. Zadania na nadchodz\u0105cy tydzie\u0144"),
  dataTable([700, CONTENT_W - 5100, 2400, 2000], [
    ["Lp.", "Zadanie", "Odpowiedzialny", "Termin"],
    ["1", "[Opis zadania]", "[Kto]", "[Do kiedy]"],
    ["2", "[Opis zadania]", "[Kto]", "[Do kiedy]"],
    ["3", "[Opis zadania]", "[Kto]", "[Do kiedy]"],
  ]),

  h1("7. Termin kolejnego spotkania"),
  p("[Data i godzina kolejnego weekly.]"),

  gap(160),
  signatureRow("Protokolant", "Prowadz\u0105cy"),
];

/* ============ 14 — NOTATKA Z REKRUTACJI ============ */
const rekrutacja = [
  ...opBanner("Proces rekrutacji \u2014 dokument poufny", "Notatka z rozmowy rekrutacyjnej"),
  metaTable([
    ["Stanowisko", "[Nazwa stanowiska]"],
    ["Kandydat", "[Imi\u0119 i nazwisko]"],
    ["Data rozmowy", "[DD.MM.RRRR]"],
    ["Etap rekrutacji", "[Rozmowa I / II / spotkanie finalne]"],
    ["Forma rozmowy", "[Stacjonarna / zdalna]"],
    ["Prowadz\u0105cy rozmow\u0119", "[Imi\u0119 i nazwisko, stanowisko]"],
    ["Klasyfikacja", "POUFNE \u2014 dane kandydata"],
  ]),
  calloutBox("Notatka zawiera dane osobowe kandydata. Przechowuje si\u0119 j\u0105 zgodnie z polityk\u0105 ochrony danych i okresem retencji ustalonym dla proces\u00f3w rekrutacyjnych.", COLOR.amber),

  h1("1. \u0179r\u00f3d\u0142o aplikacji"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Pole", "Warto\u015b\u0107"],
    ["\u0179r\u00f3d\u0142o", "[Og\u0142oszenie / polecenie / baza w\u0142asna]"],
    ["Data wp\u0142yni\u0119cia aplikacji", "[DD.MM.RRRR]"],
    ["Dost\u0119pno\u015b\u0107 kandydata", "[Termin rozpocz\u0119cia pracy]"],
    ["Oczekiwania finansowe", "[Kwota / przedzia\u0142]"],
  ]),

  h1("2. Do\u015bwiadczenie i kwalifikacje"),
  p("[Kr\u00f3tkie streszczenie \u015bcie\u017cki zawodowej kandydata oraz do\u015bwiadczenia istotnego dla stanowiska. Skup si\u0119 na faktach z rozmowy, nie na powt\u00f3rzeniu CV.]"),
  h2("2.1 Do\u015bwiadczenie zwi\u0105zane ze stanowiskiem"),
  bullet("[Element do\u015bwiadczenia istotny dla roli]"),
  bullet("[Element do\u015bwiadczenia istotny dla roli]"),
  h2("2.2 Znajomo\u015b\u0107 narz\u0119dzi i obszaru"),
  p("[Ocena znajomo\u015bci narz\u0119dzi i obszaru pracy \u2014 np. systemy sprzeda\u017cowe, obs\u0142uga klienta B2B, wiedza bran\u017cowa.]"),

  h1("3. Ocena wg kryteri\u00f3w"),
  p("Skala: 1 \u2014 poni\u017cej oczekiwa\u0144, 2 \u2014 cz\u0119\u015bciowo spe\u0142nia, 3 \u2014 spe\u0142nia oczekiwania, 4 \u2014 powy\u017cej oczekiwa\u0144, 5 \u2014 wyr\u00f3\u017cniaj\u0105co."),
  dataTable([CONTENT_W - 5400, 1400, CONTENT_W - (CONTENT_W - 5400) - 1400], [
    ["Kryterium", "Ocena", "Uzasadnienie"],
    ["Kompetencje merytoryczne", "[1\u20135]", "[Komentarz]"],
    ["Do\u015bwiadczenie zawodowe", "[1\u20135]", "[Komentarz]"],
    ["Komunikatywno\u015b\u0107", "[1\u20135]", "[Komentarz]"],
    ["Motywacja i dopasowanie", "[1\u20135]", "[Komentarz]"],
    ["Dopasowanie do zespo\u0142u", "[1\u20135]", "[Komentarz]"],
  ]),

  h1("4. Mocne strony i obszary w\u0105tpliwo\u015bci"),
  h2("4.1 Mocne strony"),
  bullet("[Mocna strona kandydata]"),
  bullet("[Mocna strona kandydata]"),
  h2("4.2 Obszary w\u0105tpliwo\u015bci"),
  bullet("[W\u0105tpliwo\u015b\u0107 / pytanie otwarte do dalszej weryfikacji]"),
  bullet("[W\u0105tpliwo\u015b\u0107 / pytanie otwarte do dalszej weryfikacji]"),

  h1("5. Rekomendacja"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Pole", "Warto\u015b\u0107"],
    ["Rekomendacja", "[Zatrudni\u0107 / kolejny etap / rezerwa / odrzuci\u0107]"],
    ["Uzasadnienie", "[Kr\u00f3tkie uzasadnienie decyzji]"],
    ["Proponowany kolejny krok", "[Np. spotkanie finalne, oferta, informacja zwrotna]"],
  ]),
  calloutBox("Decyzj\u0119 rekrutacyjn\u0105 opieramy na kryteriach i faktach z rozmowy. Ka\u017cdy kandydat \u2014 niezale\u017cnie od rozstrzygni\u0119cia \u2014 otrzymuje informacj\u0119 zwrotn\u0105."),

  gap(160),
  signatureRow("Prowadz\u0105cy rozmow\u0119", "Decyzja \u2014 osoba zatwierdzaj\u0105ca"),
];

/* ============ 15 — ODPOWIEDŹ NA REKLAMACJĘ (do klienta) ============ */
const odpowiedz = [
  // nagłówek nadawcy (układ pisma do klienta)
  new Paragraph({ spacing: { after: 40 }, children: [
    new TextRun({ text: "Moris", bold: true, size: 36, color: COLOR.navy }),
    new TextRun({ text: ".eu", bold: true, size: 36, color: COLOR.navy }),
  ]}),
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({
    text: "Moris sp. z o.o.", size: 18, color: COLOR.grey })] }),
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({
    text: "ul. Wiejska 27, 41-500 Chorz\u00f3w", size: 18, color: COLOR.grey })] }),
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({
    text: "tel. 32 416 36 99  |  info@moris.eu  |  moris.eu", size: 18, color: COLOR.grey })] }),
  new Paragraph({
    spacing: { before: 120, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, space: 4, color: COLOR.navy } },
    children: [],
  }),
  new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200 },
    children: [new TextRun({ text: "Chorz\u00f3w, [DD.MM.RRRR]", size: 20, color: COLOR.ink })] }),

  // adresat
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "[Nazwa firmy klienta]", bold: true, size: 22, color: COLOR.ink })] }),
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "[Imi\u0119 i nazwisko osoby kontaktowej]", size: 22, color: COLOR.ink })] }),
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "[Ulica i numer]", size: 22, color: COLOR.ink })] }),
  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "[Kod pocztowy i miejscowo\u015b\u0107]", size: 22, color: COLOR.ink })] }),

  // znak sprawy
  new Paragraph({ spacing: { after: 60 }, children: [
    new TextRun({ text: "Numer reklamacji: ", bold: true, size: 20, color: COLOR.navy }),
    new TextRun({ text: "REK/[NNN]/[RRRR]", size: 20, color: COLOR.ink }),
  ]}),
  new Paragraph({ spacing: { after: 200 }, children: [
    new TextRun({ text: "Dotyczy: ", bold: true, size: 20, color: COLOR.navy }),
    new TextRun({ text: "reklamacji zg\u0142oszonej w dniu [DD.MM.RRRR], zam\u00f3wienie [ZC\u2026] / faktura [FV\u2026]", size: 20, color: COLOR.ink }),
  ]}),

  pRuns([new TextRun({ text: "Szanowni Pa\u0144stwo,", size: 22, color: COLOR.ink })]),
  p("informujemy o zako\u0144czeniu rozpatrywania zg\u0142oszonej przez Pa\u0144stwa reklamacji. Poni\u017cej przedstawiamy rozstrzygni\u0119cie wraz z uzasadnieniem oraz dalszym tokiem post\u0119powania."),

  h2("Przedmiot reklamacji"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Pozycja", "Warto\u015b\u0107"],
    ["Reklamowany wyr\u00f3b", "[Wyr\u00f3b, gatunek stali, wymiar]"],
    ["Zam\u00f3wienie / faktura", "[ZC\u2026 / FV\u2026]"],
    ["Zg\u0142oszona niezgodno\u015b\u0107", "[Kr\u00f3tki opis wg zg\u0142oszenia klienta]"],
    ["Data zg\u0142oszenia", "[DD.MM.RRRR]"],
  ]),

  h2("Rozstrzygni\u0119cie"),
  // wyróżniony blok z decyzją
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      shading: { fill: COLOR.tintMid, type: ShadingType.CLEAR },
      borders: {
        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
        left: { style: BorderStyle.SINGLE, size: 24, color: COLOR.navy },
      },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children: [new Paragraph({ children: [
        new TextRun({ text: "Reklamacja zosta\u0142a rozpatrzona: ", size: 22, color: COLOR.ink }),
        new TextRun({ text: "[uznana / uznana cz\u0119\u015bciowo / nieuznana]", bold: true, size: 22, color: COLOR.navy }),
      ]})],
    })] })],
  }),
  gap(120),
  p("[Uzasadnienie rozstrzygni\u0119cia \u2014 przedstaw ustalenia weryfikacji w spos\u00f3b konkretny i rzeczowy. Wska\u017c, co zosta\u0142o sprawdzone i na jakiej podstawie podj\u0119to decyzj\u0119. Pos\u0142uguj si\u0119 faktami, datami i numerami dokument\u00f3w.]"),

  h2("Spos\u00f3b za\u0142atwienia"),
  p("[Opisz konkretne dzia\u0142anie: wymiana wyrobu, korekta faktury, zwrot, rekompensata \u2014 wraz z terminem realizacji. Je\u015bli reklamacja zosta\u0142a nieuznana, wyja\u015bnij rzeczowo podstaw\u0119 i wska\u017c, jakie kroki klient mo\u017ce podj\u0105\u0107.]"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Pozycja", "Warto\u015b\u0107"],
    ["Dzia\u0142anie", "[Wymiana / korekta / zwrot / rekompensata / brak]"],
    ["Termin realizacji", "[DD.MM.RRRR]"],
    ["Osoba prowadz\u0105ca spraw\u0119", "[Imi\u0119 i nazwisko]"],
  ]),

  calloutBox("Wskaz\u00f3wka redakcyjna (usu\u0144 przed wys\u0142aniem): odpowied\u017a formu\u0142ujemy konkretnie i rzeczowo, bez j\u0119zyka przepraszaj\u0105cego. Podajemy rozstrzygni\u0119cie, podstaw\u0119, spos\u00f3b za\u0142atwienia i termin. Nawet przy reklamacji nieuznanej pozostawiamy otwart\u0105 \u015bcie\u017ck\u0119 dalszej wsp\u00f3\u0142pracy \u2014 reklamacja nie ko\u0144czy relacji.", COLOR.amber),

  p("W razie pyta\u0144 lub potrzeby doprecyzowania pozostajemy do Pa\u0144stwa dyspozycji. Bezpo\u015bredni kontakt do osoby prowadz\u0105cej spraw\u0119 podajemy w stopce pisma."),
  gap(140),
  pRuns([new TextRun({ text: "Z powa\u017caniem,", size: 22, color: COLOR.ink })]),
  gap(140),
  pRuns([new TextRun({ text: "[Imi\u0119 i nazwisko]", bold: true, size: 22, color: COLOR.navy })]),
  pRuns([new TextRun({ text: "[Stanowisko] \u2014 Dzia\u0142 Sprzeda\u017cy E-Commerce", size: 20, color: COLOR.grey })]),
  pRuns([new TextRun({ text: "Moris sp. z o.o.  |  tel. [numer]  |  [adres@moris.eu]", size: 20, color: COLOR.grey })]),

  gap(180),
  new Paragraph({ spacing: { after: 60 },
    children: [new TextRun({ text: "Za\u0142\u0105czniki:", bold: true, size: 20, color: COLOR.navy })] }),
  bullet("[Np. korekta faktury, protok\u00f3\u0142, dokumentacja zdj\u0119ciowa \u2014 je\u015bli dotyczy]"),
];

/* ============ GENEROWANIE ============ */
function make(children, hdrPillar, ftrId, confidential, file, label) {
  const doc = buildDoc([{
    properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
    headers: { default: header(hdrPillar, "Dzia\u0142 Sprzeda\u017cy E-Commerce") },
    footers: { default: footer(ftrId, "1.0", confidential) },
    children,
  }]);
  return B.Packer.toBuffer(doc).then((buf) => {
    fs.writeFileSync("./out/" + file, buf);
    console.log("OK: " + label);
  });
}

Promise.all([
  make(weekly, "Spotkanie zespo\u0142u", "ZSZ-FRM-ECM-WKL", true,
       "13_Wzor_notatka_weekly.docx", "Notatka weekly"),
  make(rekrutacja, "Proces rekrutacji", "ZSZ-FRM-ECM-REK", true,
       "14_Wzor_notatka_rekrutacja.docx", "Notatka rekrutacja"),
  make(odpowiedz, "Obs\u0142uga reklamacji", "Moris sp. z o.o.", false,
       "15_Wzor_odpowiedz_na_reklamacje.docx", "Odpowiedz na reklamacje"),
]).then(() => console.log("Wszystkie trzy wzory gotowe."));
