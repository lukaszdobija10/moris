/* WZORY — Notatka coachingowa 1:1 + Podsumowanie wyników + Ocena półroczna */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak, dataTable, metaTable, titlePage,
  PAGE, CONTENT_W, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign,
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

/* ============ 10 — NOTATKA COACHINGOWA 1:1 ============ */
const coaching = [
  ...opBanner("Rozw\u00f3j zespo\u0142u \u2014 dokument poufny", "Notatka z rozmowy 1:1"),
  metaTable([
    ["Pracownik", "[Imi\u0119 i nazwisko]"],
    ["Prze\u0142o\u017cony / coach", "[Imi\u0119 i nazwisko]"],
    ["Data rozmowy", "[DD.MM.RRRR]"],
    ["Numer spotkania w cyklu", "[np. 1:1 nr 6]"],
    ["Klasyfikacja", "POUFNE \u2014 dost\u0119p: pracownik i prze\u0142o\u017cony"],
  ]),
  calloutBox("Notatka 1:1 jest dokumentem rozwojowym, nie dyscyplinuj\u0105cym. S\u0142u\u017cy ci\u0105g\u0142o\u015bci rozmowy i \u015bledzeniu post\u0119pu. Dost\u0119p maj\u0105 wy\u0142\u0105cznie pracownik i jego prze\u0142o\u017cony."),

  h1("1. Przegl\u0105d ustale\u0144 z poprzedniego spotkania"),
  p("[Przejd\u017a przez zadania ustalone na poprzednim 1:1. Oznacz status ka\u017cdego i kr\u00f3tko skomentuj.]"),
  dataTable([CONTENT_W - 4400, 2000, 2400], [
    ["Ustalenie z poprzedniego 1:1", "Status", "Komentarz"],
    ["[Ustalenie]", "[Zrealizowane / w toku]", "[Komentarz]"],
    ["[Ustalenie]", "[Zrealizowane / w toku]", "[Komentarz]"],
  ]),

  h1("2. Bie\u017c\u0105ce wyniki i obserwacje"),
  p("[Om\u00f3w aktualne wyniki pracownika w odniesieniu do cel\u00f3w. Opieraj si\u0119 na konkretnych danych \u2014 liczbach, wska\u017anikach, przyk\u0142adach sytuacji.]"),
  h2("2.1 Co dzia\u0142a dobrze"),
  bullet("[Mocna strona / sukces \u2014 konkretny przyk\u0142ad]"),
  bullet("[Mocna strona / sukces \u2014 konkretny przyk\u0142ad]"),
  h2("2.2 Obszary do rozwoju"),
  bullet("[Obszar rozwojowy \u2014 konkretny przyk\u0142ad, bez oceny osoby]"),
  bullet("[Obszar rozwojowy \u2014 konkretny przyk\u0142ad, bez oceny osoby]"),

  h1("3. G\u0142os pracownika"),
  p("[Zapisz perspektyw\u0119 pracownika \u2014 jak sam ocenia swoj\u0105 prac\u0119, co go wspiera, co utrudnia, czego potrzebuje od prze\u0142o\u017conego lub zespo\u0142u.]"),
  fieldRow("Co u\u0142atwia prac\u0119"),
  fieldRow("Co utrudnia prac\u0119 / bariery"),
  fieldRow("Oczekiwane wsparcie"),

  h1("4. Cele rozwojowe"),
  p("[Sformu\u0142uj cele wsp\u00f3lnie z pracownikiem. Cel ma by\u0107 konkretny, mierzalny i osadzony w czasie.]"),
  dataTable([CONTENT_W - 3800, 1800, 2000], [
    ["Cel rozwojowy", "Miara", "Termin"],
    ["[Cel]", "[Jak zmierzymy]", "[Do kiedy]"],
    ["[Cel]", "[Jak zmierzymy]", "[Do kiedy]"],
  ]),

  h1("5. Ustalenia i plan dzia\u0142ania"),
  p("[Zapisz konkretne dzia\u0142ania uzgodnione na tym spotkaniu \u2014 zar\u00f3wno po stronie pracownika, jak i prze\u0142o\u017conego.]"),
  dataTable([CONTENT_W - 4400, 2400, 2000], [
    ["Dzia\u0142anie", "Odpowiedzialny", "Termin"],
    ["[Dzia\u0142anie]", "[Pracownik / prze\u0142o\u017cony]", "[Do kiedy]"],
    ["[Dzia\u0142anie]", "[Pracownik / prze\u0142o\u017cony]", "[Do kiedy]"],
  ]),

  h1("6. Termin kolejnego spotkania"),
  p("[Data kolejnego 1:1 oraz g\u0142\u00f3wny temat, je\u015bli zosta\u0142 wst\u0119pnie ustalony.]"),

  gap(160),
  signatureRow("Pracownik", "Prze\u0142o\u017cony / coach"),
];

/* ============ 11 — PODSUMOWANIE WYNIKÓW ============ */
const wyniki = [
  ...titlePage({
    kicker: "Raport okresowy",
    titleLines: ["Podsumowanie", "wynik\u00f3w sprzeda\u017cy"],
    subtitle: "[Okres raportowania \u2014 np. II kwarta\u0142 2026 / maj 2026]",
    meta: [
      ["Dokument", "Podsumowanie wynik\u00f3w \u2014 [okres]"],
      ["Identyfikator", "ZSZ-RAP-ECM-[NN]"],
      ["Okres raportowania", "[Od DD.MM.RRRR do DD.MM.RRRR]"],
      ["Data sporz\u0105dzenia", "[DD.MM.RRRR]"],
      ["Sporz\u0105dzaj\u0105cy", "[Imi\u0119 i nazwisko, Dyrektor Sprzeda\u017cy E-Commerce]"],
      ["Klasyfikacja", "POUFNE \u2014 u\u017cytek wewn\u0119trzny"],
    ],
  }),
  pageBreak(),

  h1("1. Podsumowanie zarz\u0105dcze"),
  p("[Synteza okresu w 3\u20135 zdaniach \u2014 najwa\u017cniejszy wniosek na wej\u015bciu. Czy cel zosta\u0142 osi\u0105gni\u0119ty, co go zdeterminowa\u0142o, jaka jest rekomendacja na kolejny okres.]"),
  calloutBox("Kluczowy wniosek okresu: [jednozdaniowe, konkretne stwierdzenie poparte liczb\u0105]."),

  h1("2. Realizacja cel\u00f3w"),
  p("[Zestawienie najwa\u017cniejszych wska\u017anik\u00f3w wobec planu. Podawaj warto\u015bci konkretne i procent realizacji.]"),
  dataTable([CONTENT_W - 6000, 2000, 2000, 2000], [
    ["Wska\u017anik", "Plan", "Wykonanie", "Realizacja"],
    ["Przych\u00f3d netto", "[PLN]", "[PLN]", "[%]"],
    ["Liczba zam\u00f3wie\u0144", "[szt.]", "[szt.]", "[%]"],
    ["\u015arednia warto\u015b\u0107 zam\u00f3wienia", "[PLN]", "[PLN]", "[%]"],
    ["Mar\u017ca", "[%]", "[%]", "[p.p.]"],
    ["Nowi klienci", "[szt.]", "[szt.]", "[%]"],
  ]),

  h1("3. Analiza okresu"),
  h2("3.1 Co zadzia\u0142a\u0142o"),
  bullet("[Czynnik sukcesu \u2014 z konkretnym efektem liczbowym]"),
  bullet("[Czynnik sukcesu \u2014 z konkretnym efektem liczbowym]"),
  h2("3.2 Co odbiega od planu"),
  bullet("[Obszar poni\u017cej planu \u2014 z konkretn\u0105 luk\u0105 i przyczyn\u0105]"),
  bullet("[Obszar poni\u017cej planu \u2014 z konkretn\u0105 luk\u0105 i przyczyn\u0105]"),
  h2("3.3 Wyniki zespo\u0142u"),
  p("[Zestawienie wynik\u00f3w indywidualnych lub komentarz do pracy zespo\u0142u, je\u015bli raport obejmuje t\u0119 perspektyw\u0119.]"),
  dataTable([CONTENT_W - 5600, 2800, 2800], [
    ["Cz\u0142onek zespo\u0142u", "Wynik okresu", "Komentarz"],
    ["[Imi\u0119 i nazwisko]", "[Warto\u015b\u0107]", "[Komentarz]"],
    ["[Imi\u0119 i nazwisko]", "[Warto\u015b\u0107]", "[Komentarz]"],
  ]),

  h1("4. Wnioski i rekomendacje"),
  p("[Wnioski przek\u0142adaj\u0105ce analiz\u0119 na decyzje. Ka\u017cda rekomendacja konkretna i wykonalna \u2014 nie og\u00f3lna obserwacja.]"),
  num("[Rekomendacja \u2014 co zrobi\u0107, dlaczego, jaki spodziewany efekt]"),
  num("[Rekomendacja \u2014 co zrobi\u0107, dlaczego, jaki spodziewany efekt]"),

  h1("5. Cele na kolejny okres"),
  dataTable([CONTENT_W - 4000, 2000, 2000], [
    ["Cel", "Miara", "Termin"],
    ["[Cel]", "[Warto\u015b\u0107 docelowa]", "[Okres]"],
    ["[Cel]", "[Warto\u015b\u0107 docelowa]", "[Okres]"],
  ]),

  gap(180),
  signatureRow("Sporz\u0105dzi\u0142(a)", "Przyj\u0105\u0142(\u0119\u0142a) do wiadomo\u015bci"),
];

/* ============ 12 — OCENA PÓŁROCZNA (z samooceną) ============ */
// wiersz dwukolumnowy: samoocena | ocena przełożonego
function dualBox(title) {
  const half = CONTENT_W / 2;
  const mkCell = (label, fill) => new TableCell({
    width: { size: half, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    borders: { top:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, bottom:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, left:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, right:{style:BorderStyle.SINGLE,size:2,color:COLOR.line} },
    margins: { top: 100, bottom: 240, left: 140, right: 140 },
    children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, color: COLOR.grey })] })],
  });
  return [
    new Paragraph({ spacing: { before: 160, after: 60 },
      children: [new TextRun({ text: title, bold: true, size: 23, color: COLOR.navyDark })] }),
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [half, half],
      rows: [new TableRow({ children: [
        mkCell("Samoocena pracownika", COLOR.tintLight),
        mkCell("Ocena prze\u0142o\u017conego", COLOR.white),
      ]})],
    }),
  ];
}

const ocena = [
  ...opBanner("Rozw\u00f3j zespo\u0142u \u2014 dokument poufny", "Ocena p\u00f3\u0142roczna"),
  metaTable([
    ["Pracownik", "[Imi\u0119 i nazwisko]"],
    ["Stanowisko", "[Stanowisko]"],
    ["Oceniaj\u0105cy", "[Imi\u0119 i nazwisko prze\u0142o\u017conego]"],
    ["Okres oceny", "[I / II p\u00f3\u0142rocze RRRR]"],
    ["Data rozmowy oceniaj\u0105cej", "[DD.MM.RRRR]"],
    ["Klasyfikacja", "POUFNE \u2014 dost\u0119p: pracownik, prze\u0142o\u017cony, HR"],
  ]),
  calloutBox("Cz\u0119\u015b\u0107 \u201eSamoocena pracownika\u201d wype\u0142nia pracownik przed rozmow\u0105. Cz\u0119\u015b\u0107 \u201eOcena prze\u0142o\u017conego\u201d wype\u0142nia prze\u0142o\u017cony. Rozm\u00f3w\u0119 oceniaj\u0105c\u0105 prowadzi si\u0119 na podstawie obu wype\u0142nionych kolumn."),

  h1("1. Realizacja cel\u00f3w z poprzedniego okresu"),
  p("[Zestaw cele wyznaczone na poprzedni\u0105 ocen\u0119 i oce\u0144 stopie\u0144 ich realizacji.]"),
  dataTable([CONTENT_W - 4400, 2400, 2000], [
    ["Cel z poprzedniego okresu", "Realizacja", "Komentarz"],
    ["[Cel]", "[% / status]", "[Komentarz]"],
    ["[Cel]", "[% / status]", "[Komentarz]"],
  ]),

  h1("2. Ocena kompetencji"),
  p("Skala oceny: 1 \u2014 poni\u017cej oczekiwa\u0144, 2 \u2014 cz\u0119\u015bciowo spe\u0142nia, 3 \u2014 spe\u0142nia oczekiwania, 4 \u2014 powy\u017cej oczekiwa\u0144, 5 \u2014 wzorowo. W kolumnie samooceny pracownik wpisuje ocen\u0119 w\u0142asn\u0105; w kolumnie oceny \u2014 prze\u0142o\u017cony."),
  dataTable([CONTENT_W - 4000, 2000, 2000], [
    ["Kompetencja", "Samoocena", "Ocena prze\u0142."],
    ["Realizacja cel\u00f3w sprzeda\u017cowych", "[1\u20135]", "[1\u20135]"],
    ["Obs\u0142uga klienta i komunikacja", "[1\u20135]", "[1\u20135]"],
    ["Znajomo\u015b\u0107 oferty i wiedza produktowa", "[1\u20135]", "[1\u20135]"],
    ["Samodzielno\u015b\u0107 i organizacja pracy", "[1\u20135]", "[1\u20135]"],
    ["Wsp\u00f3\u0142praca w zespole", "[1\u20135]", "[1\u20135]"],
    ["Korzystanie z narz\u0119dzi (SAP, ASM, kokpity)", "[1\u20135]", "[1\u20135]"],
  ]),

  ...dualBox("3. Najwi\u0119ksze osi\u0105gni\u0119cia okresu"),
  ...dualBox("4. Obszary do rozwoju"),
  ...dualBox("5. Potrzeby szkoleniowe i wsparcie"),

  h1("6. Cele na kolejne p\u00f3\u0142rocze"),
  p("[Cele wyznaczone wsp\u00f3lnie podczas rozmowy oceniaj\u0105cej \u2014 konkretne, mierzalne, osadzone w czasie.]"),
  dataTable([CONTENT_W - 4000, 2000, 2000], [
    ["Cel", "Miara", "Termin"],
    ["[Cel]", "[Warto\u015b\u0107 docelowa]", "[Do kiedy]"],
    ["[Cel]", "[Warto\u015b\u0107 docelowa]", "[Do kiedy]"],
    ["[Cel]", "[Warto\u015b\u0107 docelowa]", "[Do kiedy]"],
  ]),

  h1("7. Podsumowanie rozmowy"),
  p("[Wsp\u00f3lny wniosek ko\u0144cowy z rozmowy oceniaj\u0105cej \u2014 og\u00f3lna ocena okresu i kierunek na kolejne p\u00f3\u0142rocze.]"),
  new Paragraph({ spacing: { before: 80, after: 60 },
    children: [new TextRun({ text: "Komentarz pracownika do oceny:", bold: true, size: 20, color: COLOR.navy })] }),
  fieldRow("Komentarz \u2014 wiersz 1"),
  fieldRow("Komentarz \u2014 wiersz 2"),

  gap(180),
  signatureRow("Podpis pracownika", "Podpis prze\u0142o\u017conego"),
];

/* ============ GENEROWANIE ============ */
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
  make(coaching, "Rozw\u00f3j zespo\u0142u", "ZSZ-FRM-ECM-1on1", "10_Wzor_notatka_coachingowa.docx", "Notatka coachingowa"),
  make(wyniki, "Raport okresowy", "ZSZ-RAP-ECM-NN", "11_Wzor_podsumowanie_wynikow.docx", "Podsumowanie wynikow"),
  make(ocena, "Ocena okresowa", "ZSZ-FRM-ECM-OCP", "12_Wzor_ocena_polroczna.docx", "Ocena polroczna"),
]).then(() => console.log("Wzory HR gotowe."));
