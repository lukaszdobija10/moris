/* WZORY — Protokół reklamacyjny + Wezwanie do zapłaty */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak, dataTable, metaTable, titlePage,
  PAGE, CONTENT_W, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType,
} = B;

// baner operacyjny (ten sam co we wzorach 05–07)
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
      children: [new TextRun({ text: title, bold: true, size: 44, color: COLOR.navy })],
    }),
  ];
}

// pole z linią do wypełnienia
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

// dwa pola podpisu obok siebie
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

/* ============ 08 — PROTOKÓŁ REKLAMACYJNY ============ */
const reklamacja = [
  ...opBanner("Dokument wewn\u0119trzny", "Protok\u00f3\u0142 reklamacyjny"),
  metaTable([
    ["Numer reklamacji", "REK/[NNN]/[RRRR]"],
    ["Data zg\u0142oszenia", "[DD.MM.RRRR]"],
    ["Data sporz\u0105dzenia protoko\u0142u", "[DD.MM.RRRR]"],
    ["Przyjmuj\u0105cy zg\u0142oszenie", "[Imi\u0119 i nazwisko, Dzia\u0142 Sprzeda\u017cy E-Commerce]"],
    ["Termin rozpatrzenia (SLA)", "10 dni roboczych od daty zg\u0142oszenia"],
    ["Klasyfikacja", "U\u017cytek wewn\u0119trzny"],
  ]),

  h1("1. Dane klienta"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Pole", "Warto\u015b\u0107"],
    ["Nazwa firmy", "[Nazwa klienta]"],
    ["NIP", "[NIP]"],
    ["Osoba zg\u0142aszaj\u0105ca", "[Imi\u0119 i nazwisko]"],
    ["Kontakt", "[Telefon / e-mail]"],
  ]),

  h1("2. Przedmiot reklamacji"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Pole", "Warto\u015b\u0107"],
    ["Numer zam\u00f3wienia / faktury", "[ZC\u2026 / FV\u2026]"],
    ["Data realizacji zam\u00f3wienia", "[DD.MM.RRRR]"],
    ["Reklamowany wyr\u00f3b", "[Wyr\u00f3b, gatunek stali, wymiar]"],
    ["Ilo\u015b\u0107 reklamowana", "[Ilo\u015b\u0107 / masa]"],
  ]),

  h1("3. Opis zg\u0142oszenia"),
  p("[Opis niezgodno\u015bci zg\u0142oszonej przez klienta \u2014 dok\u0142adnie wed\u0142ug tre\u015bci zg\u0142oszenia. Podaj fakty: czego dotyczy wada, kiedy zosta\u0142a stwierdzona, w jakim zakresie.]"),
  h2("3.1 Kategoria niezgodno\u015bci"),
  bullet("[ ] Niezgodno\u015b\u0107 ilo\u015bciowa (brak / nadwy\u017cka)"),
  bullet("[ ] Niezgodno\u015b\u0107 jako\u015bciowa (wada wyrobu)"),
  bullet("[ ] Niezgodno\u015b\u0107 dokumentacji (atest, WZ, faktura)"),
  bullet("[ ] Uszkodzenie w transporcie"),
  bullet("[ ] Inna \u2014 [opis]"),

  h1("4. Dokumentacja zg\u0142oszenia"),
  p("[Wymie\u0144 materia\u0142y do\u0142\u0105czone przez klienta: zdj\u0119cia, kopia WZ, kopia atestu, protok\u00f3\u0142 szkody przewo\u017anika.]"),
  bullet("[Dokument / materia\u0142 1]"),
  bullet("[Dokument / materia\u0142 2]"),

  h1("5. Stanowisko Moris"),
  p("[Wynik weryfikacji zg\u0142oszenia. Przedstaw ustalenia: czy reklamacja jest zasadna, na jakiej podstawie, jaki jest zakres odpowiedzialno\u015bci Moris.]"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Pole", "Warto\u015b\u0107"],
    ["Rozstrzygni\u0119cie", "[Uznana / uznana cz\u0119\u015bciowo / odrzucona]"],
    ["Uzasadnienie", "[Podstawa rozstrzygni\u0119cia]"],
    ["Spos\u00f3b za\u0142atwienia", "[Wymiana / korekta / zwrot / rekompensata]"],
    ["Termin realizacji", "[DD.MM.RRRR]"],
  ]),
  calloutBox("Komunikacj\u0119 zwrotn\u0105 do klienta formu\u0142ujemy konkretnie: podajemy rozstrzygni\u0119cie, podstaw\u0119, spos\u00f3b za\u0142atwienia i termin. Rezygnujemy z j\u0119zyka przepraszaj\u0105cego \u2014 nawet przy reklamacji odrzuconej pozostawiamy otwart\u0105 \u015bcie\u017ck\u0119 dalszej wsp\u00f3\u0142pracy.", COLOR.amber),

  h1("6. Dzia\u0142ania koryguj\u0105ce"),
  p("[Je\u015bli reklamacja ujawni\u0142a problem procesowy \u2014 wska\u017c dzia\u0142anie zapobiegaj\u0105ce powt\u00f3rzeniu. Je\u015bli nie dotyczy, wpisz: nie dotyczy.]"),
  dataTable([CONTENT_W - 4400, 2400, 2000], [
    ["Dzia\u0142anie koryguj\u0105ce", "Odpowiedzialny", "Termin"],
    ["[Opis dzia\u0142ania]", "[Kto]", "[Do kiedy]"],
  ]),

  gap(180),
  signatureRow("Sporz\u0105dzi\u0142(a)", "Zatwierdzi\u0142(a)"),
];

/* ============ 09 — WEZWANIE DO ZAPŁATY ============ */
const wezwanie = [
  // nagłówek nadawcy (układ pisma)
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
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "[Nazwa firmy d\u0142u\u017cnika]", bold: true, size: 22, color: COLOR.ink })] }),
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "[Ulica i numer]", size: 22, color: COLOR.ink })] }),
  new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: "[Kod pocztowy i miejscowo\u015b\u0107]", size: 22, color: COLOR.ink })] }),
  new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "NIP: [NIP d\u0142u\u017cnika]", size: 20, color: COLOR.grey })] }),

  // tytuł pisma — wyśrodkowany
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 },
    children: [new TextRun({ text: "WEZWANIE DO ZAP\u0141ATY", bold: true, size: 30, color: COLOR.navy })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 240 },
    children: [new TextRun({ text: "[wezwanie pierwsze / wezwanie ostateczne]", italics: true, size: 20, color: COLOR.grey })],
  }),

  pRuns([new TextRun({ text: "Szanowni Pa\u0144stwo,", size: 22, color: COLOR.ink })]),
  p("dzia\u0142aj\u0105c w imieniu Moris sp. z o.o., wzywamy Pa\u0144stwa do uregulowania zaleg\u0142ych nale\u017cno\u015bci wynikaj\u0105cych z poni\u017cej wskazanych dokument\u00f3w ksi\u0119gowych."),

  h2("Zestawienie zaleg\u0142o\u015bci"),
  dataTable([2400, 1900, 1900, CONTENT_W - 6200], [
    ["Nr faktury", "Data wystawienia", "Termin p\u0142atno\u015bci", "Kwota zaleg\u0142a"],
    ["[FV\u2026]", "[DD.MM.RRRR]", "[DD.MM.RRRR]", "[Kwota] PLN"],
    ["[FV\u2026]", "[DD.MM.RRRR]", "[DD.MM.RRRR]", "[Kwota] PLN"],
  ]),
  gap(100),
  dataTable([CONTENT_W - 3000, 3000], [
    ["Pozycja", "Kwota"],
    ["Nale\u017cno\u015b\u0107 g\u0142\u00f3wna razem", "[Suma] PLN"],
    ["Odsetki za op\u00f3\u017anienie (na dzie\u0144 wezwania)", "[Kwota] PLN"],
    ["Razem do zap\u0142aty", "[Suma ko\u0144cowa] PLN"],
  ], { zebra: false }),

  h2("Termin i spos\u00f3b zap\u0142aty"),
  p("Wskazan\u0105 powy\u017cej kwot\u0119 nale\u017cy uregulowa\u0107 w terminie [X] dni od daty otrzymania niniejszego wezwania, przelewem na rachunek bankowy:"),
  pRuns([new TextRun({ text: "[Numer rachunku bankowego Moris sp. z o.o.]", bold: true, size: 22, color: COLOR.navy })]),
  p("W tytule przelewu prosimy poda\u0107 numery op\u0142acanych faktur. Za dat\u0119 zap\u0142aty przyjmuje si\u0119 dzie\u0144 uznania rachunku Moris."),

  calloutBox("Je\u017celi nale\u017cno\u015b\u0107 zosta\u0142a uregulowana po dacie sporz\u0105dzenia wezwania, prosimy potraktowa\u0107 pismo jako bezprzedmiotowe i przes\u0142a\u0107 potwierdzenie przelewu na adres info@moris.eu."),

  h2("Skutki braku zap\u0142aty"),
  p("Brak zap\u0142aty w wyznaczonym terminie spowoduje:"),
  bullet("naliczanie dalszych odsetek ustawowych za op\u00f3\u017anienie w transakcjach handlowych,"),
  bullet("wstrzymanie realizacji kolejnych zam\u00f3wie\u0144 oraz zawieszenie limitu kredytowego, je\u015bli zosta\u0142 przyznany,"),
  bullet("skierowanie sprawy na drog\u0119 windykacji oraz post\u0119powania s\u0105dowego, z obci\u0105\u017ceniem d\u0142u\u017cnika kosztami."),
  calloutBox("W korespondencji windykacyjnej nie stosujemy j\u0119zyka przepraszaj\u0105cego. Podajemy konkretny termin, jednoznacznie nazwane nast\u0119pstwa i bezpo\u015bredni kontakt do osoby prowadz\u0105cej spraw\u0119. Door relacyjny pozostaje otwarty \u2014 celem jest odzyskanie nale\u017cno\u015bci i utrzymanie klienta.", COLOR.amber),

  p("W razie pyta\u0144 lub potrzeby ustalenia indywidualnego harmonogramu sp\u0142aty prosimy o kontakt z osob\u0105 prowadz\u0105c\u0105 spraw\u0119."),
  gap(140),
  pRuns([new TextRun({ text: "Z powa\u017caniem,", size: 22, color: COLOR.ink })]),
  gap(140),
  pRuns([new TextRun({ text: "[Imi\u0119 i nazwisko]", bold: true, size: 22, color: COLOR.navy })]),
  pRuns([new TextRun({ text: "[Stanowisko] \u2014 Dzia\u0142 Sprzeda\u017cy E-Commerce", size: 20, color: COLOR.grey })]),
  pRuns([new TextRun({ text: "Moris sp. z o.o.  |  tel. [numer]  |  [adres@moris.eu]", size: 20, color: COLOR.grey })]),
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
  make(reklamacja, "Obs\u0142uga reklamacji", "REK/[NNN]/[RRRR]", true,
       "08_Wzor_protokol_reklamacyjny.docx", "Protokol reklamacyjny"),
  make(wezwanie, "Windykacja nale\u017cno\u015bci", "Moris sp. z o.o.", false,
       "09_Wzor_wezwanie_do_zaplaty.docx", "Wezwanie do zaplaty"),
]).then(() => console.log("Wzory klienckie gotowe."));
