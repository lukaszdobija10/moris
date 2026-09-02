/* WZORY OPERACYJNE — notatka służbowa, protokół, formularz */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, dataTable, metaTable,
  PAGE, CONTENT_W, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType,
} = B;

// baner tytułowy dokumentu operacyjnego (bez pełnej strony tytułowej)
function opBanner(kicker, title) {
  return [
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "Moris", bold: true, size: 32, color: COLOR.navy }),
        new TextRun({ text: ".eu", bold: true, size: 32, color: COLOR.navy }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [new TextRun({
        text: kicker.toUpperCase().split("").join("\u200a"),
        bold: true, size: 20, color: COLOR.grey,
      })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 16, space: 6, color: COLOR.navy } },
      children: [new TextRun({ text: title, bold: true, size: 44, color: COLOR.navy })],
    }),
  ];
}

// pole formularza z linią do wypełnienia
function fieldRow(label, w = CONTENT_W) {
  return new Table({
    width: { size: w, type: WidthType.DXA },
    columnWidths: [w],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: w, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR.line },
      },
      margins: { top: 60, bottom: 100, left: 0, right: 0 },
      children: [new Paragraph({ children: [
        new TextRun({ text: label, bold: true, size: 19, color: COLOR.navy }),
      ]})],
    })] })],
  });
}

/* ====================== 05 — NOTATKA SŁUŻBOWA ====================== */
const notatka = [
  ...opBanner("Dokument wewn\u0119trzny", "Notatka s\u0142u\u017cbowa"),
  metaTable([
    ["Data sporz\u0105dzenia", "[DD.MM.RRRR]"],
    ["Sporz\u0105dzaj\u0105cy", "[Imi\u0119 i nazwisko, stanowisko]"],
    ["Adresaci", "[Osoby / dzia\u0142y, do kt\u00f3rych kierowana jest notatka]"],
    ["Dotyczy", "[Zwi\u0119z\u0142y temat notatki]"],
    ["Klasyfikacja", "U\u017cytek wewn\u0119trzny"],
  ]),

  h1("1. Sytuacja"),
  p("[Opisz stan faktyczny \u2014 co si\u0119 wydarzy\u0142o, czego dotyczy notatka, jaki jest kontekst. Trzymaj si\u0119 fakt\u00f3w, dat i liczb.]"),

  h1("2. Ustalenia"),
  p("[Przedstaw wnioski z analizy sytuacji. Je\u015bli ustale\u0144 jest kilka, u\u017cyj listy.]"),
  bullet("[Ustalenie pierwsze]"),
  bullet("[Ustalenie drugie]"),

  h1("3. Rekomendacja"),
  p("[Sformu\u0142uj konkretn\u0105 rekomendacj\u0119 dzia\u0142ania. Rekomendacja ma by\u0107 jednoznaczna i wykonalna \u2014 nie og\u00f3lna obserwacja.]"),
  calloutBox("Rekomendacja: [tre\u015b\u0107 \u2014 co konkretnie nale\u017cy zrobi\u0107, przez kogo i do kiedy]."),

  h1("4. Dalsze kroki"),
  dataTable([CONTENT_W - 4400, 2400, 2000], [
    ["Dzia\u0142anie", "Odpowiedzialny", "Termin"],
    ["[Co nale\u017cy wykona\u0107]", "[Kto]", "[Do kiedy]"],
    ["[Co nale\u017cy wykona\u0107]", "[Kto]", "[Do kiedy]"],
  ]),
  gap(200),
  pRuns([new TextRun({ text: "Sporz\u0105dzi\u0142(a): ", bold: true, size: 20, color: COLOR.navy }),
         new TextRun({ text: "[Imi\u0119 i nazwisko]", size: 20, color: COLOR.ink })]),
];

/* ====================== 06 — PROTOKÓŁ ====================== */
const protokol = [
  ...opBanner("Dokument wewn\u0119trzny", "Protok\u00f3\u0142"),
  metaTable([
    ["Rodzaj protoko\u0142u", "[Spotkanie / ustalenia / odbi\u00f3r]"],
    ["Data", "[DD.MM.RRRR]"],
    ["Miejsce / forma", "[Lokalizacja lub: spotkanie zdalne]"],
    ["Prowadz\u0105cy", "[Imi\u0119 i nazwisko]"],
    ["Protokolant", "[Imi\u0119 i nazwisko]"],
  ]),

  h1("1. Uczestnicy"),
  dataTable([700, CONTENT_W - 3900, 3200], [
    ["Lp.", "Imi\u0119 i nazwisko", "Rola / dzia\u0142"],
    ["1", "[Imi\u0119 i nazwisko]", "[Rola]"],
    ["2", "[Imi\u0119 i nazwisko]", "[Rola]"],
    ["3", "[Imi\u0119 i nazwisko]", "[Rola]"],
  ]),

  h1("2. Porz\u0105dek spotkania"),
  num("[Punkt pierwszy porz\u0105dku]"),
  num("[Punkt drugi porz\u0105dku]"),
  num("[Punkt trzeci porz\u0105dku]"),

  h1("3. Przebieg i om\u00f3wione kwestie"),
  h2("3.1 [Tytu\u0142 pierwszego punktu]"),
  p("[Streszczenie dyskusji i przedstawionych stanowisk dla tego punktu.]"),
  h2("3.2 [Tytu\u0142 drugiego punktu]"),
  p("[Streszczenie dyskusji i przedstawionych stanowisk dla tego punktu.]"),

  h1("4. Ustalenia i decyzje"),
  dataTable([700, CONTENT_W - 700], [
    ["Lp.", "Tre\u015b\u0107 ustalenia / decyzji"],
    ["1", "[Tre\u015b\u0107 ustalenia]"],
    ["2", "[Tre\u015b\u0107 ustalenia]"],
  ]),

  h1("5. Zadania do realizacji"),
  dataTable([700, CONTENT_W - 5100, 2400, 2000], [
    ["Lp.", "Zadanie", "Odpowiedzialny", "Termin"],
    ["1", "[Opis zadania]", "[Kto]", "[Do kiedy]"],
    ["2", "[Opis zadania]", "[Kto]", "[Do kiedy]"],
  ]),

  h1("6. Termin kolejnego spotkania"),
  p("[Data i forma kolejnego spotkania lub adnotacja: nie ustalono.]"),

  gap(200),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W / 2, CONTENT_W / 2],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: CONTENT_W / 2, type: WidthType.DXA },
        borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
        margins: { top: 200, bottom: 0, left: 0, right: 200 },
        children: [
          new Paragraph({ spacing:{after:200}, children:[new TextRun({ text:"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026", color:COLOR.grey })] }),
          new Paragraph({ children:[new TextRun({ text:"Protokolant", bold:true, size:19, color:COLOR.navy })] }),
        ],
      }),
      new TableCell({
        width: { size: CONTENT_W / 2, type: WidthType.DXA },
        borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
        margins: { top: 200, bottom: 0, left: 200, right: 0 },
        children: [
          new Paragraph({ spacing:{after:200}, children:[new TextRun({ text:"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026", color:COLOR.grey })] }),
          new Paragraph({ children:[new TextRun({ text:"Prowadz\u0105cy", bold:true, size:19, color:COLOR.navy })] }),
        ],
      }),
    ]})],
  }),
];

/* ====================== 07 — FORMULARZ ====================== */
const formularz = [
  ...opBanner("Formularz wewn\u0119trzny", "Formularz zg\u0142oszeniowy"),
  p("[Kr\u00f3tki opis przeznaczenia formularza \u2014 do czego s\u0142u\u017cy i kto go wype\u0142nia. Wype\u0142niony formularz przekazuje si\u0119 do: [adresat].]"),

  h1("1. Dane zg\u0142aszaj\u0105cego"),
  fieldRow("Imi\u0119 i nazwisko"),
  fieldRow("Stanowisko / dzia\u0142"),
  fieldRow("Data zg\u0142oszenia"),
  fieldRow("Kontakt (telefon / e-mail)"),

  h1("2. Przedmiot zg\u0142oszenia"),
  fieldRow("Czego dotyczy zg\u0142oszenie"),
  gap(60),
  fieldRow("Opis \u2014 wiersz 1"),
  fieldRow("Opis \u2014 wiersz 2"),
  fieldRow("Opis \u2014 wiersz 3"),

  h1("3. Oczekiwane dzia\u0142anie"),
  fieldRow("Czego oczekuje zg\u0142aszaj\u0105cy"),
  fieldRow("Oczekiwany termin"),

  h1("4. Cz\u0119\u015b\u0107 wype\u0142niana przez osob\u0119 rozpatruj\u0105c\u0105"),
  calloutBox("Poni\u017csz\u0105 cz\u0119\u015b\u0107 wype\u0142nia osoba przyjmuj\u0105ca zg\u0142oszenie \u2014 nie zg\u0142aszaj\u0105cy.", COLOR.amber),
  gap(100),
  dataTable([3000, CONTENT_W - 3000], [
    ["Pole", "Warto\u015b\u0107"],
    ["Numer zg\u0142oszenia", "[FRM/\u2026]"],
    ["Osoba rozpatruj\u0105ca", "[Imi\u0119 i nazwisko]"],
    ["Data przyj\u0119cia", "[DD.MM.RRRR]"],
    ["Status", "[Przyj\u0119te / w toku / zamkni\u0119te]"],
    ["Decyzja / spos\u00f3b za\u0142atwienia", "[Opis]"],
  ]),
  gap(220),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W / 2, CONTENT_W / 2],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: CONTENT_W / 2, type: WidthType.DXA },
        borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
        margins: { top: 200, bottom: 0, left: 0, right: 200 },
        children: [
          new Paragraph({ spacing:{after:200}, children:[new TextRun({ text:"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026", color:COLOR.grey })] }),
          new Paragraph({ children:[new TextRun({ text:"Podpis zg\u0142aszaj\u0105cego", bold:true, size:19, color:COLOR.navy })] }),
        ],
      }),
      new TableCell({
        width: { size: CONTENT_W / 2, type: WidthType.DXA },
        borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} },
        margins: { top: 200, bottom: 0, left: 200, right: 0 },
        children: [
          new Paragraph({ spacing:{after:200}, children:[new TextRun({ text:"\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026\u2026", color:COLOR.grey })] }),
          new Paragraph({ children:[new TextRun({ text:"Podpis osoby rozpatruj\u0105cej", bold:true, size:19, color:COLOR.navy })] }),
        ],
      }),
    ]})],
  }),
];

/* ====================== GENEROWANIE ====================== */
function make(children, hdrPillar, ftrId, file, label) {
  const doc = buildDoc([{
    properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
    headers: { default: header(hdrPillar, "Dzia\u0142 Sprzeda\u017cy E-Commerce") },
    footers: { default: footer(ftrId, "1.0", true) },
    children,
  }]);
  return B.Packer.toBuffer(doc).then((buf) => {
    fs.writeFileSync("./out/" + file, buf);
    console.log("OK: " + label);
  });
}

Promise.all([
  make(notatka, "Notatka s\u0142u\u017cbowa", "ZSZ-FRM-ECM-NS", "05_Wzor_notatka_sluzbowa.docx", "Notatka sluzbowa"),
  make(protokol, "Protok\u00f3\u0142", "ZSZ-FRM-ECM-PR", "06_Wzor_protokol.docx", "Protokol"),
  make(formularz, "Formularz zg\u0142oszeniowy", "ZSZ-FRM-ECM-ZG", "07_Wzor_formularz.docx", "Formularz"),
]).then(() => console.log("Wszystkie wzory operacyjne gotowe."));
