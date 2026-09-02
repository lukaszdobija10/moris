/* Księga Identyfikacji Wizualnej Dokumentów Moris.eu */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak, cell, dataTable, titlePage, metaTable,
  Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
  BorderStyle, WidthType, ShadingType, CONTENT_W, PAGE,
} = B;

// próbka koloru: pasek + opis
function swatch(hex, name, role) {
  const swW = 1100, txtW = CONTENT_W - swW;
  return new TableRow({
    children: [
      new TableCell({
        width: { size: swW, type: WidthType.DXA },
        shading: { fill: hex, type: ShadingType.CLEAR },
        borders: { top:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, bottom:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, left:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, right:{style:BorderStyle.SINGLE,size:2,color:COLOR.line} },
        margins: { top: 240, bottom: 240, left: 100, right: 100 },
        children: [new Paragraph({ children: [] })],
      }),
      new TableCell({
        width: { size: txtW, type: WidthType.DXA },
        shading: { fill: COLOR.white, type: ShadingType.CLEAR },
        borders: { top:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, bottom:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, left:{style:BorderStyle.SINGLE,size:2,color:COLOR.line}, right:{style:BorderStyle.SINGLE,size:2,color:COLOR.line} },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        verticalAlign: "center",
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [
            new TextRun({ text: name, bold: true, size: 22, color: COLOR.ink }),
            new TextRun({ text: "    #" + hex, size: 20, color: COLOR.grey }),
          ]}),
          new Paragraph({ children: [new TextRun({ text: role, size: 20, color: COLOR.grey })] }),
        ],
      }),
    ],
  });
}

const meta = [
  ["Dokument", "Ksi\u0119ga Identyfikacji Wizualnej Dokument\u00f3w"],
  ["Identyfikator", "MORIS-CI-DOC-01"],
  ["Wersja", "1.0"],
  ["Data wydania", "Maj 2026"],
  ["W\u0142a\u015bciciel dokumentu", "Dyrektor Sprzeda\u017cy E-Commerce"],
  ["Zakres stosowania", "Wszystkie dokumenty firmowe Moris sp. z o.o."],
  ["Klasyfikacja", "U\u017cytek wewn\u0119trzny"],
];

const children = [
  ...titlePage({
    kicker: "System identyfikacji wizualnej",
    titleLines: ["Ksi\u0119ga znaku", "dokument\u00f3w Moris"],
    subtitle: "Standard wizualny dla dokument\u00f3w wewn\u0119trznych i korespondencji handlowej platformy moris.eu",
    meta,
  }),
  pageBreak(),

  /* 1 */
  h1("1. Przeznaczenie ksi\u0119gi"),
  p("Niniejsza ksi\u0119ga definiuje jednolity standard wizualny dokument\u00f3w Moris sp. z o.o. Celem jest sp\u00f3jno\u015b\u0107 \u2014 ka\u017cdy dokument firmowy, niezale\u017cnie od autora i przeznaczenia, ma by\u0107 natychmiast rozpoznawalny jako materia\u0142 Moris i prezentowa\u0107 jednakowy poziom profesjonalizmu."),
  p("Ksi\u0119ga obowi\u0105zuje dla trzech kategorii dokument\u00f3w: dokument\u00f3w wewn\u0119trznych (polityki, procedury, instrukcje systemu ZSZ), pism do klient\u00f3w (oferty handlowe, korespondencja B2B) oraz wzor\u00f3w operacyjnych (notatki, protoko\u0142y, formularze). Do ka\u017cdej kategorii za\u0142\u0105czono gotowy wz\u00f3r."),
  calloutBox("Zasada nadrz\u0119dna: nie tworzymy formatowania od nowa dla ka\u017cdego dokumentu. Korzystamy z gotowych wzor\u00f3w i z palety opisanej w tej ksi\u0119dze. Indywidualne odst\u0119pstwa os\u0142abiaj\u0105 rozpoznawalno\u015b\u0107 marki."),

  /* 2 */
  h1("2. Znak"),
  p("Znakiem Moris jest symbol z\u0142o\u017cony z geometrycznych ramion oraz logotyp \u201eMoris\u201d. Ksi\u0119ga znaku (assets/moris-logo-manual.pdf) definiuje trzy warianty: sam symbol, logotyp poziomy oraz logotyp pionowy. W dokumentach stosujemy wariant poziomy \u2014 w nag\u0142\u00f3wku ka\u017cdej strony i na stronie tytu\u0142owej."),
  h2("2.1 Warianty i pliki"),
  dataTable([2600, 2600, CONTENT_W - 5200], [
    ["Wariant", "Plik", "Zastosowanie"],
    ["Logotyp poziomy", "assets/moris-logo-poziomy.svg", "nag\u0142\u00f3wek strony, strona tytu\u0142owa, papier firmowy"],
    ["Logotyp pionowy", "assets/moris-logo-pionowy.svg", "uk\u0142ady w\u0105skie, materia\u0142y kwadratowe"],
    ["Symbol", "assets/moris-symbol.svg", "sygnet, awatar, znak wodny"],
    ["Wersja do Worda", "assets/moris-logo-granat.png", "osadzana automatycznie przez modu\u0142 brandingu"],
  ]),
  h2("2.2 Zasady stosowania"),
  bullet("Znak w nag\u0142\u00f3wku strony: szeroko\u015b\u0107 78 px, wariant granatowy."),
  bullet("Znak na stronie tytu\u0142owej: szeroko\u015b\u0107 210 px, wariant granatowy."),
  bullet("Na ciemnym tle stosujemy wariant bia\u0142y (assets/moris-logo-bialy.png)."),
  bullet("Pole ochronne wok\u00f3\u0142 znaku r\u00f3wne jest szeroko\u015bci ramienia symbolu (modu\u0142 x z ksi\u0119gi). W polu ochronnym nie umieszczamy tekstu, linii ani kraw\u0119dzi zdj\u0119cia."),
  bullet("Nie rozci\u0105gamy znaku nieproporcjonalnie, nie obracamy go, nie zmieniamy odst\u0119pu symbolu od logotypu ani nie wype\u0142niamy go gradientem."),
  calloutBox("Znak jest osadzany automatycznie przez modu\u0142 lib/moris-brand.js. Je\u015bli plik graficzny jest niedost\u0119pny, komponenty wracaj\u0105 do sygnatury s\u0142ownej \u201eMoris\u201d \u2014 dokument wygeneruje si\u0119 mimo braku grafiki."),

  /* 3 */
  h1("3. Paleta kolor\u00f3w"),
  p("Paleta pochodzi wprost z ksi\u0119gi znaku. Kolory marki podano wraz z odpowiednikami RAL \u2014 to one obowi\u0105zuj\u0105 przy zam\u00f3wieniach poligraficznych i przy oznakowaniu."),
  h2("3.1 Kolory marki"),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1100, CONTENT_W - 1100],
    rows: [
      swatch(COLOR.navy, "Steel blue \u00b7 RAL 5011", "Tekst podstawowy, sygnatura, nag\u0142\u00f3wki H1, nag\u0142\u00f3wki tabel, linie akcentuj\u0105ce."),
      swatch(COLOR.navyDark, "Sapphire blue \u00b7 RAL 5003", "Nag\u0142\u00f3wki H2 i H3, akcenty drugiego planu."),
      swatch(COLOR.pastel, "Pastel blue \u00b7 RAL 5024", "Wyr\u00f3\u017cnienia, t\u0142a znacznik\u00f3w, elementy pomocnicze."),
    ],
  }),
  h2("3.2 Kolory dodatkowe"),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1100, CONTENT_W - 1100],
    rows: [
      swatch(COLOR.grey, "Telegrey 2 \u00b7 RAL 7046", "Nag\u0142\u00f3wek i stopka strony, metadane."),
      swatch(COLOR.greyMid, "Traffic grey \u00b7 RAL 7042", "Opisy drugoplanowe, podpisy pod tabelami."),
      swatch(COLOR.orange, "Luminous Orange \u00b7 RAL 2007", "Akcent wyr\u00f3\u017cniaj\u0105cy jeden element \u2014 nigdy kilka naraz."),
      swatch(COLOR.yellow, "Zinc Yellow \u00b7 RAL 1018", "Podkre\u015blenia i oznaczenia pomocnicze."),
    ],
  }),
  h2("3.3 Kolory informacyjne"),
  p("Stosowane wy\u0142\u0105cznie do oznaczania statusu lub charakteru informacji \u2014 nigdy jako kolor dekoracyjny. Barwa pe\u0142na niesie pasek lub ikon\u0119, rozbicie stanowi t\u0142o, a wariant przyciemniony s\u0142u\u017cy do tekstu, bo barwy pe\u0142ne s\u0105 na bieli zbyt jasne."),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [1100, CONTENT_W - 1100],
    rows: [
      swatch(COLOR.greenPure, "Ziele\u0144 \u00b7 #47C98B", "Status pozytywny, warunek spe\u0142niony, akceptacja. T\u0142o: #C8EFDC, tekst: #1B6B48."),
      swatch(COLOR.yellow, "\u017b\u00f3\u0142\u0107 \u00b7 #FFE97D", "Ostrze\u017cenie, kwestia do decyzji. T\u0142o: #FFF4BE, tekst: #8A5A08."),
      swatch(COLOR.redPure, "Czerwie\u0144 \u00b7 #F95050", "Status krytyczny, b\u0142\u0105d, twarde ograniczenie. T\u0142o: #FDCBCB, tekst: #C42222."),
    ],
  }),
  h2("3.4 Kolory t\u0142a"),
  dataTable([2200, 2000, CONTENT_W - 4200], [
    ["Kolor t\u0142a", "HEX", "Zastosowanie"],
    ["B\u0142\u0119kit jasny", COLOR.tintLight, "T\u0142o kom\u00f3rek opisowych, wiersze parzyste tabel (zebra)."],
    ["Pastel blue 30%", COLOR.tintMid, "T\u0142o ramek informacyjnych (callout)."],
    ["Steel blue", COLOR.navy, "T\u0142o wierszy nag\u0142\u00f3wkowych tabel \u2014 tekst bia\u0142y."],
  ]),
  pageBreak(),

  /* 4 */
  h1("4. Typografia"),
  p("Ksi\u0119ga znaku wskazuje dwa kroje: Paralucent \u2014 Extra Light w roli ekspozycyjnej i Medium w nag\u0142\u00f3wkach \u2014 oraz Poppins Regular w tek\u015bcie ci\u0105g\u0142ym. Cyfry i oznaczenia w materia\u0142ach ekspozycyjnych sk\u0142adamy krojem Paralucent Stencil Extra Light."),
  p("Paralucent jest krojem komercyjnym (The Northern Block) i wymaga licencji oraz instalacji na stanowiskach. Dop\u00f3ki nie jest wdro\u017cony, dokumenty sk\u0142adamy Poppinsem \u2014 krojem darmowym, kt\u00f3ry ksi\u0119ga i tak wskazuje jako tekstowy. Modu\u0142 brandingu ma prze\u0142\u0105cznik FONT_SET o trzech ustawieniach: \u201ebrand\u201d (Paralucent w nag\u0142\u00f3wkach), \u201eoffice\u201d (wszystko Poppinsem, ustawienie domy\u015blne) oraz \u201esystem\u201d (Arial awaryjnie, gdy na stanowiskach nie mo\u017cna zainstalowa\u0107 kroju firmowego)."),
  calloutBox("Poppins jest do pobrania z Google Fonts bez op\u0142at. Zanim zmienisz FONT_SET na \u201ebrand\u201d, upewnij si\u0119, \u017ce Paralucent jest zainstalowany na stanowiskach odbiorc\u00f3w \u2014 inaczej Word podstawi kr\u00f3j losowo i dokument straci sp\u00f3jno\u015b\u0107.", COLOR.amber),
  h2("4.1 Hierarchia tekstu"),
  dataTable([2400, 1500, 1700, CONTENT_W - 5600], [
    ["Element", "Rozmiar", "Styl", "Kolor"],
    ["Tytu\u0142 dokumentu", "26 pkt", "Pogrubienie", "Steel blue"],
    ["Nag\u0142\u00f3wek H1", "16 pkt", "Pogrubienie + linia", "Steel blue"],
    ["Nag\u0142\u00f3wek H2", "13 pkt", "Pogrubienie", "Sapphire blue"],
    ["Nag\u0142\u00f3wek H3", "11,5 pkt", "Pogrubienie", "Sapphire blue"],
    ["Tekst podstawowy", "11 pkt", "Zwyk\u0142y", "Steel blue"],
    ["Tekst pomocniczy", "9\u201310 pkt", "Zwyk\u0142y / kursywa", "Telegrey 2"],
  ]),
  h2("4.2 Zasady sk\u0142adu"),
  bullet("Interlinia tekstu podstawowego: 1,15 \u2014 zapewnia oddech bez rozrzedzenia strony."),
  bullet("Akapity oddzielamy odst\u0119pem, nie wci\u0119ciem pierwszego wiersza ani pust\u0105 lini\u0105."),
  bullet("Nag\u0142\u00f3wek H1 zawsze z doln\u0105 lini\u0105 w kolorze granatu g\u0142\u00f3wnego."),
  bullet("Tekst justujemy do lewej; nie stosujemy justowania obustronnego (tworzy nier\u00f3wne odst\u0119py)."),
  bullet("W polskich tekstach stosujemy cudzys\u0142\u00f3w drukarski \u201e\u2026\u201d oraz p\u00f3\u0142pauz\u0119 \u2013 w wyliczeniach i zakresach."),

  /* 5 */
  h1("5. Uk\u0142ad strony"),
  h2("5.1 Format i marginesy"),
  dataTable([3400, CONTENT_W - 3400], [
    ["Parametr", "Warto\u015b\u0107"],
    ["Format arkusza", "A4 (210 \u00d7 297 mm)"],
    ["Margines g\u00f3rny / dolny", "25 mm"],
    ["Margines lewy / prawy", "25,4 mm"],
    ["Szeroko\u015b\u0107 kolumny tekstu", "ok. 159 mm"],
  ]),
  h2("5.2 Nag\u0142\u00f3wek strony"),
  p("Nag\u0142\u00f3wek zawiera sygnatur\u0119 \u201eMoris.eu\u201d, nazw\u0119 obszaru lub procesu (po lewej) oraz jednostk\u0119 organizacyjn\u0105 (po prawej, dosuni\u0119te do prawej kraw\u0119dzi). Oddzielony od tre\u015bci ciENk\u0105 lini\u0105 granatow\u0105."),
  h2("5.3 Stopka strony"),
  p("Stopka zawiera klauzul\u0119 dokumentu (po lewej), numeracj\u0119 stron w formacie \u201eStrona X / Y\u201d (na \u015brodku) oraz identyfikator i wersj\u0119 dokumentu (po prawej). Oddzielona od tre\u015bci lini\u0105 granatow\u0105."),
  calloutBox("Dokumenty wewn\u0119trzne maj\u0105 w stopce klauzul\u0119 \u201eDOKUMENT POUFNY \u2014 wy\u0142\u0105cznie do u\u017cytku wewn\u0119trznego\u201d. Dokumenty kierowane do klient\u00f3w zawieraj\u0105 zamiast niej dane adresowe sp\u00f3\u0142ki."),

  /* 6 */
  h1("6. Strona tytu\u0142owa"),
  p("Strona tytu\u0142owa otwiera dokumenty o charakterze formalnym \u2014 polityki, procedury, raporty, oferty. Sk\u0142ada si\u0119 z pi\u0119ciu sta\u0142ych element\u00f3w u\u0142o\u017conych od g\u00f3ry: grubej linii granatowej, sygnatury \u201eMoris.eu\u201d, ma\u0142ego nadtytu\u0142u (kicker), w\u0142a\u015bciwego tytu\u0142u oraz podtytu\u0142u kursyw\u0105."),
  p("Pod tytu\u0142em umieszczamy tabel\u0119 metryki dokumentu \u2014 zestaw par etykieta\u2013warto\u015b\u0107 opisuj\u0105cych dokument. Etykiety w kolumnie lewej maj\u0105 t\u0142o b\u0142\u0119kitne i kolor granatowy; warto\u015bci w kolumnie prawej \u2014 t\u0142o bia\u0142e."),
  h3("Standardowa metryka dokumentu"),
  metaTable([
    ["Dokument", "Pe\u0142na nazwa dokumentu"],
    ["Identyfikator", "Sygnatura wg systemu ZSZ"],
    ["Wersja", "Numer wersji"],
    ["Data wydania", "Miesi\u0105c i rok"],
    ["W\u0142a\u015bciciel dokumentu", "Stanowisko odpowiedzialne"],
    ["Klasyfikacja", "Poziom poufno\u015bci"],
  ]),
  pageBreak(),

  /* 7 */
  h1("7. Tabele"),
  p("Tabela jest preferowanym formatem prezentacji danych operacyjnych, decyzyjnych i por\u00f3wnawczych \u2014 czytelniejszym ni\u017c lista wypunktowana. Ka\u017cda tabela ma wiersz nag\u0142\u00f3wkowy oraz naprzemienne t\u0142o wierszy."),
  h2("7.1 Standard tabeli"),
  bullet("Wiersz nag\u0142\u00f3wkowy: t\u0142o granatu g\u0142\u00f3wnego, tekst bia\u0142y, pogrubiony."),
  bullet("Wiersze parzyste: t\u0142o b\u0142\u0119kitu jasnego; wiersze nieparzyste: t\u0142o bia\u0142e (efekt zebry)."),
  bullet("Siatka: cienka linia w kolorze szaro-b\u0142\u0119kitnym."),
  bullet("Tekst w kom\u00f3rkach: 10,5 pkt; nag\u0142\u00f3wek tabeli: 10,5 pkt pogrubiony."),
  bullet("Wewn\u0119trzny margines kom\u00f3rki zapewnia oddech \u2014 tekst nie dotyka kraw\u0119dzi."),
  h3("Przyk\u0142ad tabeli danych"),
  dataTable([2600, 3200, CONTENT_W - 5800], [
    ["Element", "Rekomendacja", "Status"],
    ["Wiersz nag\u0142\u00f3wkowy", "Granat g\u0142\u00f3wny, tekst bia\u0142y", "Standard"],
    ["Wiersze tre\u015bci", "Naprzemienne t\u0142o (zebra)", "Standard"],
    ["Linia siatki", "Cienka, szaro-b\u0142\u0119kitna", "Standard"],
  ]),

  /* 8 */
  h1("8. Ramki informacyjne i listy"),
  h2("8.1 Ramka informacyjna (callout)"),
  p("Ramka wyr\u00f3\u017cnia regu\u0142\u0119, ostrze\u017cenie lub kluczow\u0105 zasad\u0119. Ma t\u0142o b\u0142\u0119kitne, lewy pasek akcentuj\u0105cy i tekst pisany kursyw\u0105. Kolor lewego paska niesie znaczenie:"),
  bullet("Pasek granatowy \u2014 regu\u0142a lub zasada o charakterze neutralnym."),
  bullet("Pasek bursztynowy \u2014 ostrze\u017cenie, kwestia wymagaj\u0105ca uwagi."),
  bullet("Pasek czerwony \u2014 twarde ograniczenie, zakaz, warunek krytyczny."),
  gap(80),
  calloutBox("Przyk\u0142ad: regu\u0142a neutralna. Ramki u\u017cywamy oszcz\u0119dnie \u2014 nadmiar wyr\u00f3\u017cnie\u0144 sprawia, \u017ce \u017cadne nie jest zauwa\u017cane."),
  gap(80),
  calloutBox("Przyk\u0142ad: ostrze\u017cenie. Kwestia wymagaj\u0105ca decyzji lub szczeg\u00f3lnej uwagi czytelnika.", COLOR.amber),
  gap(80),
  calloutBox("Przyk\u0142ad: ograniczenie krytyczne. Warunek, kt\u00f3rego nie wolno pomin\u0105\u0107.", COLOR.red),
  h2("8.2 Listy"),
  bullet("Lista wypunktowana \u2014 dla element\u00f3w r\u00f3wnorz\u0119dnych, bez kolejno\u015bci. Znacznik: p\u00f3\u0142pauza."),
  num("Lista numerowana \u2014 dla krok\u00f3w procesu, kolejno\u015bci dzia\u0142a\u0144, etap\u00f3w."),

  /* 9 */
  h1("9. System sygnatur dokument\u00f3w"),
  p("Ka\u017cdy dokument formalny otrzymuje sygnatur\u0119 wed\u0142ug jednolitego schematu. U\u0142atwia to katalogowanie, przywo\u0142ywanie i kontrol\u0119 wersji."),
  h3("Schemat sygnatury"),
  p("ZSZ \u2013 KATEGORIA \u2013 OBSZAR \u2013 NUMER", { bold: true, color: COLOR.navy }),
  dataTable([2200, CONTENT_W - 2200], [
    ["Cz\u0142on", "Znaczenie i przyk\u0142adowe warto\u015bci"],
    ["ZSZ", "Przynale\u017cno\u015b\u0107 do Zintegrowanego Systemu Zarz\u0105dzania."],
    ["KATEGORIA", "POL \u2014 polityka, PRC \u2014 procedura, INS \u2014 instrukcja, FRM \u2014 formularz, OFR \u2014 oferta."],
    ["OBSZAR", "FIN \u2014 finanse, ECM \u2014 e-commerce, SPR \u2014 sprzeda\u017c, LOG \u2014 logistyka."],
    ["NUMER", "Kolejny numer dwucyfrowy w obr\u0119bie obszaru, np. 01."],
  ]),
  calloutBox("Przyk\u0142ad: ZSZ-POL-FIN-01 \u2014 pierwsza polityka w obszarze finans\u00f3w. Sygnatura widnieje w metryce dokumentu oraz w prawej cz\u0119\u015bci stopki ka\u017cdej strony."),

  /* 10 */
  h1("10. Stosowanie ksi\u0119gi"),
  p("Ksi\u0119ga jest dokumentem referencyjnym dla wszystkich os\u00f3b tworz\u0105cych materia\u0142y firmowe. Wraz z ni\u0105 udost\u0119pniono komplet gotowych wzor\u00f3w \u2014 zalecamy prac\u0119 na wzorach zamiast budowania uk\u0142adu od podstaw."),
  dataTable([3000, CONTENT_W - 3000], [
    ["Wz\u00f3r", "Przeznaczenie"],
    ["Wz\u00f3r dokumentu wewn\u0119trznego", "Polityki, procedury, instrukcje systemu ZSZ."],
    ["Wz\u00f3r oferty handlowej", "Oferty cenowe i propozycje dla klient\u00f3w B2B."],
    ["Wz\u00f3r pisma do klienta", "Korespondencja handlowa i formalna z klientami."],
    ["Wz\u00f3r notatki s\u0142u\u017cbowej", "Notatki wewn\u0119trzne, ustalenia, rekomendacje."],
    ["Wz\u00f3r protoko\u0142u", "Protoko\u0142y spotka\u0144, ustale\u0144, odbior\u00f3w."],
    ["Wz\u00f3r formularza", "Formularze zg\u0142oszeniowe i wnioski wewn\u0119trzne."],
  ]),
  calloutBox("Aktualizacja ksi\u0119gi nale\u017cy do Dyrektora Sprzeda\u017cy E-Commerce. Zmiany wprowadzane s\u0105 wersjami; ka\u017cda zmiana podnosi numer wersji i dat\u0119 wydania.", COLOR.amber),
];

const doc = buildDoc([{
  properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
  headers: { default: header("System identyfikacji wizualnej", "Dzia\u0142 Sprzeda\u017cy E-Commerce") },
  footers: { default: footer("MORIS-CI-DOC-01", "1.0", true) },
  children,
}]);

B.Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("./out/01_Ksiega_znaku_Moris.docx", buf);
  console.log("OK: Ksiega znaku");
});
