/* WZÓR — Oferta handlowa B2B */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak, dataTable, titlePage, metaTable,
  PAGE, CONTENT_W, Paragraph, TextRun, AlignmentType,
} = B;

const meta = [
  ["Numer oferty", "OFR/[NNN]/[RRRR]"],
  ["Data wystawienia", "[DD.MM.RRRR]"],
  ["Wa\u017cno\u015b\u0107 oferty", "[DD.MM.RRRR] (np. 14 dni)"],
  ["Klient", "[Nazwa firmy klienta]"],
  ["Osoba kontaktowa", "[Imi\u0119 i nazwisko]"],
  ["Przygotowa\u0142", "[Imi\u0119 i nazwisko, Dzia\u0142 Sprzeda\u017cy E-Commerce]"],
];

const children = [
  ...titlePage({
    kicker: "Oferta handlowa",
    titleLines: ["Oferta", "dla [Nazwa klienta]"],
    subtitle: "[Kr\u00f3tki opis przedmiotu oferty \u2014 np. dostawa wyrob\u00f3w stalowych]",
    meta,
  }),
  pageBreak(),

  h1("1. Wprowadzenie"),
  p("Szanowni Pa\u0144stwo,"),
  p("w odpowiedzi na Pa\u0144stwa zapytanie przedstawiamy ofert\u0119 na dostaw\u0119 wyrob\u00f3w stalowych. Moris sp. z o.o. jest dystrybutorem i przetw\u00f3rc\u0105 stali dzia\u0142aj\u0105cym na rynku od pocz\u0105tku lat 90. Oferujemy szeroki asortyment: blachy, rury, kszta\u0142towniki, pr\u0119ty, dwuteowniki oraz materia\u0142y kolejowe."),
  p("[Akapit dopasowany do konkretnego zapytania klienta \u2014 nawi\u0105zanie do potrzeby, terminu, projektu.]"),

  h1("2. Przedmiot oferty"),
  p("Poni\u017csza specyfikacja obejmuje pozycje obj\u0119te ofert\u0105. Ceny podano w PLN netto, bez kosztu transportu, kt\u00f3ry okre\u015blono w sekcji 4."),
  dataTable([700, 3000, 1500, 1100, 1300, CONTENT_W - 7600], [
    ["Lp.", "Wyr\u00f3b / gatunek", "Wymiar", "Ilo\u015b\u0107", "Cena jedn.", "Warto\u015b\u0107"],
    ["1", "[Wyr\u00f3b, gatunek stali, norma]", "[Wymiar]", "[Ilo\u015b\u0107]", "[Cena]", "[Warto\u015b\u0107]"],
    ["2", "[Wyr\u00f3b, gatunek stali, norma]", "[Wymiar]", "[Ilo\u015b\u0107]", "[Cena]", "[Warto\u015b\u0107]"],
    ["3", "[Wyr\u00f3b, gatunek stali, norma]", "[Wymiar]", "[Ilo\u015b\u0107]", "[Cena]", "[Warto\u015b\u0107]"],
  ]),
  gap(120),
  dataTable([CONTENT_W - 2400, 2400], [
    ["Pozycja", "Warto\u015b\u0107 netto"],
    ["Warto\u015b\u0107 wyrob\u00f3w razem", "[Suma] PLN"],
    ["Transport (wg sekcji 4)", "[Kwota] PLN"],
    ["Warto\u015b\u0107 oferty netto", "[Suma ko\u0144cowa] PLN"],
  ], { zebra: false }),

  h1("3. Parametry techniczne i jako\u015b\u0107"),
  p("[Opisz gatunki stali, normy i parametry istotne dla klienta. W razie potrzeby wska\u017c odpowiedniki gatunkowe w r\u00f3\u017cnych normach.]"),
  bullet("Atesty: do wyrob\u00f3w wystawiamy atest 3.1 wg PN-EN 10204 \u2014 [zakres / na \u017cyczenie]."),
  bullet("Us\u0142ugi dodatkowe: ci\u0119cie na wymiar, [inne us\u0142ugi przetw\u00f3rcze]."),
  bullet("Pakowanie i oznaczenie: [spos\u00f3b przygotowania wyrob\u00f3w do wysy\u0142ki]."),

  h1("4. Warunki dostawy"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Parametr", "Warunek"],
    ["Spos\u00f3b dostawy", "[Transport Moris / odbi\u00f3r w\u0142asny]"],
    ["Adres dostawy", "[Adres lub: zgodnie z ustaleniami]"],
    ["Termin realizacji", "[X dni roboczych od potwierdzenia zam\u00f3wienia]"],
    ["Koszt transportu", "[Kwota PLN netto / wg cennika strefowego]"],
  ]),

  h1("5. Warunki handlowe"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Parametr", "Warunek"],
    ["Ceny", "PLN netto; nale\u017cy doliczy\u0107 podatek VAT wg obowi\u0105zuj\u0105cej stawki."],
    ["Forma p\u0142atno\u015bci", "Pro forma / AutoPay (do 15 000 PLN) / wg indywidualnych ustale\u0144."],
    ["Wa\u017cno\u015b\u0107 oferty", "[X dni] od daty wystawienia."],
    ["Realizacja", "Po potwierdzeniu zam\u00f3wienia i zaksi\u0119gowaniu p\u0142atno\u015bci."],
  ]),
  calloutBox("Ceny mog\u0105 ulec zmianie w przypadku istotnych waha\u0144 notowa\u0144 rynkowych stali. Po up\u0142ywie terminu wa\u017cno\u015bci oferta wymaga ponownego potwierdzenia.", COLOR.amber),

  h1("6. Kontakt"),
  p("W razie pyta\u0144 lub potrzeby doprecyzowania oferty pozostajemy do dyspozycji."),
  dataTable([2800, CONTENT_W - 2800], [
    ["Dane kontaktowe", "Warto\u015b\u0107"],
    ["Opiekun handlowy", "[Imi\u0119 i nazwisko]"],
    ["Telefon", "[Numer]"],
    ["E-mail", "[adres@moris.eu]"],
    ["Biuro Obs\u0142ugi Klienta", "32 416 36 99  |  info@moris.eu  |  pn\u2013pt 8:00\u201316:00"],
  ]),
  gap(160),
  pRuns([new TextRun({ text: "Z powa\u017caniem,", size: 22, color: COLOR.ink })]),
  gap(80),
  pRuns([new TextRun({ text: "[Imi\u0119 i nazwisko]", bold: true, size: 22, color: COLOR.navy })]),
  pRuns([new TextRun({ text: "Dzia\u0142 Sprzeda\u017cy E-Commerce \u2014 Moris sp. z o.o.", size: 20, color: COLOR.grey })]),
];

const doc = buildDoc([{
  properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
  headers: { default: header("Oferta handlowa", "Dzia\u0142 Sprzeda\u017cy E-Commerce") },
  footers: { default: footer("OFR/[NNN]/[RRRR]", "1.0", false) },
  children,
}]);

B.Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("./out/03_Wzor_oferta_handlowa.docx", buf);
  console.log("OK: Wzor oferty handlowej");
});
