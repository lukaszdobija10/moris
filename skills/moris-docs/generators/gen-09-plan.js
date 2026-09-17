/* WZÓR — Plan zadań i priorytetów (perspektywa: miesiąc / rok / strategia) */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak, dataTable, metaTable, titlePage,
  PAGE, CONTENT_W, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType,
} = B;

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

const meta = [
  ["Dokument", "Plan zada\u0144 i priorytet\u00f3w"],
  ["Identyfikator", "ZSZ-PLN-ECM-[NN]"],
  ["W\u0142a\u015bciciel planu", "[Imi\u0119 i nazwisko / zesp\u00f3\u0142]"],
  ["Horyzont planu", "[np. 2026\u20132028]"],
  ["Data sporz\u0105dzenia", "[DD.MM.RRRR]"],
  ["Data nast\u0119pnego przegl\u0105du", "[DD.MM.RRRR]"],
  ["Klasyfikacja", "U\u017cytek wewn\u0119trzny"],
];

const children = [
  ...titlePage({
    kicker: "Narz\u0119dzie planowania",
    titleLines: ["Plan zada\u0144", "i priorytet\u00f3w"],
    subtitle: "Wizja, kamienie milowe i zadania w trzech perspektywach czasowych: miesi\u0105c \u2014 rok \u2014 strategia",
    meta,
  }),
  pageBreak(),

  /* INSTRUKCJA */
  h1("Jak korzysta\u0107 z tego dokumentu"),
  p("Dokument porz\u0105dkuje planowanie w trzech perspektywach czasowych. Wype\u0142nia si\u0119 go od g\u00f3ry w d\u00f3\u0142 \u2014 od wizji, przez filary strategiczne, po konkretne zadania miesi\u0105ca. Ka\u017cda perspektywa odpowiada na inne pytanie."),
  dataTable([2600, CONTENT_W - 2600], [
    ["Perspektywa", "Pytanie, na kt\u00f3re odpowiada"],
    ["Strategia", "W jakich obszarach budujemy trwa\u0142\u0105 przewag\u0119 i dok\u0105d zmierzamy?"],
    ["Rok", "Jakie cele osi\u0105gniemy w tym roku i po czym poznamy post\u0119p?"],
    ["Miesi\u0105c", "Co konkretnie robimy teraz, aby przybli\u017cy\u0107 cele roczne?"],
  ]),
  calloutBox("Zasada sp\u00f3jno\u015bci: ka\u017cde zadanie miesi\u0119czne powinno da\u0107 si\u0119 przypisa\u0107 do kamienia milowego, a ka\u017cdy kamie\u0144 \u2014 do filaru strategicznego. Zadanie, kt\u00f3rego nie da si\u0119 tak przypisa\u0107, wymaga decyzji: albo nie jest priorytetem, albo plan strategiczny jest niekompletny."),
  p("Dokument jest formalnym zapisem planu \u2014 wersj\u0105 archiwaln\u0105. Do pracy bie\u017c\u0105cej s\u0142u\u017cy interaktywne narz\u0119dzie planowania (plik HTML). Plan przegl\u0105da si\u0119 cyklicznie; ka\u017cdy przegl\u0105d aktualizuje status i, w razie potrzeby, podnosi wersj\u0119 dokumentu."),
  pageBreak(),

  /* 1 — WIZJA */
  h1("1. Wizja"),
  p("Wizja to opis stanu docelowego \u2014 tego, co ma by\u0107 prawd\u0105 na ko\u0144cu horyzontu planu, a czego dzi\u015b jeszcze nie ma. Dobra wizja jest konkretna, ambitna i sprawdzalna: po jej przeczytaniu wiadomo, czy zosta\u0142a osi\u0105gni\u0119ta."),
  h3("Sformu\u0142owanie wizji"),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      shading: { fill: COLOR.tintLight, type: ShadingType.CLEAR },
      borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE},
        left: { style: BorderStyle.SINGLE, size: 24, color: COLOR.navy } },
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [new Paragraph({ children: [new TextRun({
        text: "[Sformu\u0142uj wizj\u0119 jednym\u2013dwoma zdaniami. Stan docelowy, nie lista \u017cycze\u0144.]",
        italics: true, size: 23, color: COLOR.grey })] })],
    })] })],
  }),
  h3("Dlaczego ta wizja"),
  p("[Uzasadnij wyb\u00f3r wizji \u2014 jaka potrzeba biznesowa lub szansa za ni\u0105 stoi. Wizja bez uzasadnienia trudno przetrwa pierwsz\u0105 trudn\u0105 decyzj\u0119.]"),

  /* 2 — FILARY STRATEGICZNE */
  h1("2. Filary strategiczne"),
  p("Filar strategiczny to trwa\u0142y obszar, w kt\u00f3rym budujemy przewag\u0119 \u2014 nie pojedyncze zadanie, lecz kierunek utrzymywany przez ca\u0142y horyzont planu. Zalecana liczba filar\u00f3w to trzy do pi\u0119ciu; wi\u0119cej rozprasza uwag\u0119."),
  dataTable([2600, 3400, CONTENT_W - 6000], [
    ["Filar", "Opis kierunku", "Miara sukcesu"],
    ["[Nazwa filaru]", "[Co i po co \u2014 kierunek dzia\u0142ania]", "[Po czym poznamy sukces]"],
    ["[Nazwa filaru]", "[Co i po co \u2014 kierunek dzia\u0142ania]", "[Po czym poznamy sukces]"],
    ["[Nazwa filaru]", "[Co i po co \u2014 kierunek dzia\u0142ania]", "[Po czym poznamy sukces]"],
  ]),
  calloutBox("Przyk\u0142adowe filary dla obszaru e-commerce: do\u015bwiadczenie zakupowe klienta, efektywno\u015b\u0107 operacyjna i logistyka, rozw\u00f3j kompetencji zespo\u0142u, rentowno\u015b\u0107 i polityka cenowa. Filary dobiera si\u0119 do realnej sytuacji \u2014 powy\u017csze s\u0142u\u017c\u0105 wy\u0142\u0105cznie jako ilustracja."),

  /* 3 — INICJATYWY STRATEGICZNE */
  h1("3. Inicjatywy strategiczne"),
  p("Inicjatywa strategiczna to du\u017ce, wieloletnie przedsi\u0119wzi\u0119cie wynikaj\u0105ce z filaru. Inicjatywy s\u0105 pomostem mi\u0119dzy kierunkiem a celami rocznymi."),
  dataTable([3000, 2200, 1800, CONTENT_W - 7000], [
    ["Inicjatywa", "Filar", "Horyzont", "Status"],
    ["[Nazwa inicjatywy]", "[Filar]", "[Rok / okres]", "[Planowana / w toku]"],
    ["[Nazwa inicjatywy]", "[Filar]", "[Rok / okres]", "[Planowana / w toku]"],
  ]),

  /* 4 — CELE ROCZNE I KAMIENIE MILOWE */
  h1("4. Cele roczne i kamienie milowe"),
  p("Cel roczny to wymierny rezultat do osi\u0105gni\u0119cia w ci\u0105gu roku. Kamie\u0144 milowy to sprawdzalny punkt kontrolny z dat\u0105 \u2014 odpowiada na pytanie: po czym poznam, \u017ce jestem na kursie? Ka\u017cdy cel rozpisuje si\u0119 na kilka kamieni."),

  h2("4.1 Cel roczny \u2014 [nazwa celu]"),
  dataTable([2600, CONTENT_W - 2600], [
    ["Pole", "Warto\u015b\u0107"],
    ["Powi\u0105zany filar", "[Filar strategiczny]"],
    ["Miara celu", "[Warto\u015b\u0107 docelowa \u2014 liczba, wska\u017anik]"],
    ["Stan wyj\u015bciowy", "[Warto\u015b\u0107 na starcie]"],
    ["Termin", "[Koniec okresu]"],
  ]),
  h3("Kamienie milowe celu"),
  dataTable([700, CONTENT_W - 5500, 2000, 2800], [
    ["Lp.", "Kamie\u0144 milowy \u2014 sprawdzalny rezultat", "Termin", "Status"],
    ["1", "[Co konkretnie ma by\u0107 gotowe / osi\u0105gni\u0119te]", "[DD.MM.RRRR]", "[Nieosi\u0105gni\u0119ty / w toku / osi\u0105gni\u0119ty]"],
    ["2", "[Co konkretnie ma by\u0107 gotowe / osi\u0105gni\u0119te]", "[DD.MM.RRRR]", "[Nieosi\u0105gni\u0119ty / w toku / osi\u0105gni\u0119ty]"],
    ["3", "[Co konkretnie ma by\u0107 gotowe / osi\u0105gni\u0119te]", "[DD.MM.RRRR]", "[Nieosi\u0105gni\u0119ty / w toku / osi\u0105gni\u0119ty]"],
  ]),

  h2("4.2 Cel roczny \u2014 [nazwa celu]"),
  dataTable([2600, CONTENT_W - 2600], [
    ["Pole", "Warto\u015b\u0107"],
    ["Powi\u0105zany filar", "[Filar strategiczny]"],
    ["Miara celu", "[Warto\u015b\u0107 docelowa]"],
    ["Stan wyj\u015bciowy", "[Warto\u015b\u0107 na starcie]"],
    ["Termin", "[Koniec okresu]"],
  ]),
  h3("Kamienie milowe celu"),
  dataTable([700, CONTENT_W - 5500, 2000, 2800], [
    ["Lp.", "Kamie\u0144 milowy \u2014 sprawdzalny rezultat", "Termin", "Status"],
    ["1", "[Co konkretnie ma by\u0107 gotowe / osi\u0105gni\u0119te]", "[DD.MM.RRRR]", "[Nieosi\u0105gni\u0119ty / w toku / osi\u0105gni\u0119ty]"],
    ["2", "[Co konkretnie ma by\u0107 gotowe / osi\u0105gni\u0119te]", "[DD.MM.RRRR]", "[Nieosi\u0105gni\u0119ty / w toku / osi\u0105gni\u0119ty]"],
  ]),
  calloutBox("Skopiuj sekcj\u0119 4.x dla ka\u017cdego kolejnego celu rocznego. Zalecana liczba cel\u00f3w rocznych to trzy do pi\u0119ciu \u2014 tyle, ile zesp\u00f3\u0142 jest w stanie realnie prowadzi\u0107 r\u00f3wnolegle.", COLOR.amber),

  /* 5 — PLAN MIESIĘCZNY */
  h1("5. Plan miesi\u0119czny \u2014 zadania i priorytety"),
  p("Perspektywa egzekucji. Zadania konkretne, wykonalne w ci\u0105gu tygodni, ka\u017cde z priorytetem i terminem. Priorytet okre\u015bla kolejno\u015b\u0107 pracy, nie wa\u017cno\u015b\u0107 \u017cyciow\u0105 zadania."),
  dataTable([2200, CONTENT_W - 2200], [
    ["Priorytet", "Znaczenie"],
    ["A \u2014 krytyczny", "Realizowany w pierwszej kolejno\u015bci; blokuje lub warunkuje inne zadania."],
    ["B \u2014 wa\u017cny", "Zaplanowany na ten miesi\u0105c; realizowany po zadaniach A."],
    ["C \u2014 warto\u015bciowy", "Przybli\u017ca cele, lecz mo\u017ce poczeka\u0107; realizowany, gdy jest przestrze\u0144."],
  ]),
  h3("Zadania miesi\u0105ca \u2014 [miesi\u0105c, rok]"),
  dataTable([900, CONTENT_W - 7100, 1700, 2100, 2400], [
    ["Prio.", "Zadanie", "Termin", "Odpowiedzialny", "Powi\u0105zany kamie\u0144"],
    ["[A/B/C]", "[Konkretne, wykonalne zadanie]", "[DD.MM]", "[Imi\u0119 i nazwisko]", "[Kamie\u0144 milowy]"],
    ["[A/B/C]", "[Konkretne, wykonalne zadanie]", "[DD.MM]", "[Imi\u0119 i nazwisko]", "[Kamie\u0144 milowy]"],
    ["[A/B/C]", "[Konkretne, wykonalne zadanie]", "[DD.MM]", "[Imi\u0119 i nazwisko]", "[Kamie\u0144 milowy]"],
    ["[A/B/C]", "[Konkretne, wykonalne zadanie]", "[DD.MM]", "[Imi\u0119 i nazwisko]", "[Kamie\u0144 milowy]"],
    ["[A/B/C]", "[Konkretne, wykonalne zadanie]", "[DD.MM]", "[Imi\u0119 i nazwisko]", "[Kamie\u0144 milowy]"],
  ]),

  /* 6 — PRZEGLĄD */
  h1("6. Przegl\u0105d planu"),
  p("Plan jest dokumentem \u017cywym \u2014 traci warto\u015b\u0107, je\u015bli nie jest przegl\u0105dany. Przegl\u0105d miesi\u0119czny aktualizuje zadania; przegl\u0105d kwartalny weryfikuje kamienie milowe; przegl\u0105d roczny rewiduje filary i wizj\u0119."),
  dataTable([2200, 2400, CONTENT_W - 4600], [
    ["Rodzaj przegl\u0105du", "Cz\u0119stotliwo\u015b\u0107", "Zakres weryfikacji"],
    ["Operacyjny", "Miesi\u0119cznie", "Status zada\u0144, priorytety, plan na kolejny miesi\u0105c."],
    ["Taktyczny", "Kwartalnie", "Post\u0119p kamieni milowych, korekta cel\u00f3w rocznych."],
    ["Strategiczny", "Rocznie", "Aktualno\u015b\u0107 filar\u00f3w i wizji, decyzje kierunkowe."],
  ]),
  h3("Notatka z ostatniego przegl\u0105du"),
  dataTable([2600, CONTENT_W - 2600], [
    ["Pole", "Warto\u015b\u0107"],
    ["Data przegl\u0105du", "[DD.MM.RRRR]"],
    ["Co posz\u0142o zgodnie z planem", "[Kr\u00f3tkie podsumowanie]"],
    ["Co wymaga korekty", "[Kr\u00f3tkie podsumowanie]"],
    ["Decyzje i zmiany w planie", "[Lista decyzji]"],
  ]),

  /* 7 — HISTORIA WERSJI */
  h1("7. Historia wersji planu"),
  dataTable([1500, 2200, CONTENT_W - 3700], [
    ["Wersja", "Data", "Opis zmiany"],
    ["1.0", "[DD.MM.RRRR]", "Wydanie pierwsze planu."],
  ]),

  gap(160),
  signatureRow("Sporz\u0105dzi\u0142(a)", "Zatwierdzi\u0142(a)"),
];

const doc = buildDoc([{
  properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
  headers: { default: header("Planowanie zada\u0144 i priorytet\u00f3w", "Dzia\u0142 Sprzeda\u017cy E-Commerce") },
  footers: { default: footer("ZSZ-PLN-ECM-[NN]", "1.0", true) },
  children,
}]);

B.Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("./out/17_Wzor_plan_zadan_priorytetow.docx", buf);
  console.log("OK: Plan zadan i priorytetow");
});
