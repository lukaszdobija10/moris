/* WZÓR — Dokument wewnętrzny (procedura / polityka / instrukcja ZSZ) */
const fs = require("fs");
const B = require("../lib/moris-brand.js");
const {
  COLOR, buildDoc, header, footer, p, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak, dataTable, titlePage, metaTable,
  PAGE, CONTENT_W,
} = B;

const meta = [
  ["Dokument", "[Pe\u0142na nazwa dokumentu]"],
  ["Identyfikator", "ZSZ-[KAT]-[OBSZAR]-[NN]"],
  ["Wersja", "1.0"],
  ["Data wydania", "[Miesi\u0105c Rok]"],
  ["W\u0142a\u015bciciel dokumentu", "[Stanowisko]"],
  ["Akceptuj\u0105cy", "[Stanowisko / organ]"],
  ["Zakres stosowania", "[Jednostki / role obj\u0119te dokumentem]"],
  ["Klasyfikacja", "POUFNE \u2014 u\u017cytek wewn\u0119trzny"],
];

const children = [
  ...titlePage({
    kicker: "Dokument wewn\u0119trzny",
    titleLines: ["[Kategoria \u2014 np.", "Polityka / Procedura]"],
    subtitle: "[Podtytu\u0142 \u2014 jednozdaniowy opis przeznaczenia dokumentu]",
    meta,
  }),
  pageBreak(),

  h1("1. Cel i zakres dokumentu"),
  p("[Opisz, co dokument reguluje i komu s\u0142u\u017cy. Wska\u017c jednostki organizacyjne i role obj\u0119te jego stosowaniem.]"),
  p("[Opcjonalnie: powi\u0105\u017c dokument z celami biznesowymi sp\u00f3\u0142ki \u2014 wyja\u015bnij, jak\u0105 warto\u015b\u0107 wnosi jego przestrzeganie.]"),
  bullet("[Cel pierwszy]"),
  bullet("[Cel drugi]"),
  bullet("[Cel trzeci]"),

  h2("1.1 Definicje i poj\u0119cia"),
  p("[Je\u015bli dokument pos\u0142uguje si\u0119 terminami wymagaj\u0105cymi doprecyzowania, zdefiniuj je tutaj.]"),
  dataTable([2600, CONTENT_W - 2600], [
    ["Poj\u0119cie", "Definicja"],
    ["[Termin 1]", "[Definicja terminu]"],
    ["[Termin 2]", "[Definicja terminu]"],
  ]),

  h1("2. Zasady og\u00f3lne"),
  p("[Przedstaw nadrz\u0119dne zasady, na kt\u00f3rych opiera si\u0119 dokument. W razie potrzeby wyr\u00f3\u017cnij regu\u0142\u0119 tward\u0105 w ramce poni\u017cej.]"),
  calloutBox("Regu\u0142a: [tre\u015b\u0107 zasady o charakterze neutralnym \u2014 obja\u015bnienie lub wytyczna]."),
  gap(80),
  calloutBox("Regu\u0142a twarda: [warunek krytyczny, kt\u00f3rego nie wolno pomin\u0105\u0107].", COLOR.red),

  h1("3. Przebieg procesu"),
  p("[Opisz proces krok po kroku. Dla sekwencji etap\u00f3w u\u017cyj tabeli z przypisaniem odpowiedzialno\u015bci i SLA.]"),
  dataTable([2600, 3400, 1900, CONTENT_W - 7900], [
    ["Etap", "Czynno\u015b\u0107", "Odpowiedzialny", "SLA"],
    ["1. [Nazwa etapu]", "[Opis czynno\u015bci]", "[Rola]", "[X dni]"],
    ["2. [Nazwa etapu]", "[Opis czynno\u015bci]", "[Rola]", "[X dni]"],
    ["3. [Nazwa etapu]", "[Opis czynno\u015bci]", "[Rola]", "[X dni]"],
  ]),

  h1("4. Odpowiedzialno\u015bci"),
  p("[Wymie\u0144 role uczestnicz\u0105ce w procesie i przypisany im zakres odpowiedzialno\u015bci.]"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Rola", "Zakres odpowiedzialno\u015bci"],
    ["[Stanowisko / dzia\u0142]", "[Za co odpowiada]"],
    ["[Stanowisko / dzia\u0142]", "[Za co odpowiada]"],
  ]),

  h1("5. Wyj\u0105tki i sytuacje szczeg\u00f3lne"),
  p("[Opisz przypadki odbiegaj\u0105ce od standardowego przebiegu oraz spos\u00f3b post\u0119powania w ka\u017cdym z nich.]"),
  bullet("[Sytuacja szczeg\u00f3lna \u2014 spos\u00f3b post\u0119powania]"),
  bullet("[Sytuacja szczeg\u00f3lna \u2014 spos\u00f3b post\u0119powania]"),

  h1("6. Dokumenty powi\u0105zane"),
  dataTable([2800, CONTENT_W - 2800], [
    ["Identyfikator", "Nazwa dokumentu"],
    ["ZSZ-[\u2026]", "[Nazwa]"],
    ["ZSZ-[\u2026]", "[Nazwa]"],
  ]),

  h1("7. Historia zmian"),
  dataTable([1500, 2200, CONTENT_W - 3700], [
    ["Wersja", "Data", "Opis zmiany"],
    ["1.0", "[Miesi\u0105c Rok]", "Wydanie pierwsze."],
  ]),
];

const doc = buildDoc([{
  properties: { page: { size: { width: PAGE.width, height: PAGE.height }, margin: PAGE.margin } },
  headers: { default: header("[Nazwa procesu / obszaru]", "[Jednostka organizacyjna]") },
  footers: { default: footer("ZSZ-[KAT]-[OBSZAR]-[NN]", "1.0", true) },
  children,
}]);

B.Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("./out/02_Wzor_dokument_wewnetrzny.docx", buf);
  console.log("OK: Wzor dokumentu wewnetrznego");
});
