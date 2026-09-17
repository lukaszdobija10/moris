/* ============================================================
   MORIS — System identyfikacji wizualnej dokumentów
   Wspólny moduł brandingu. Wersja 2.0 / 2026

   ŹRÓDŁO: księga znaku Moris — assets/moris-logo-manual.pdf
   („Moris – podstawowe wytyczne stosowania logo”).
   Wersja 1.0 modułu opierała się na palecie odtworzonej z pliku
   Word ZSZ-POL-FIN-01 (granat 156082, Arial). Ta paleta nie
   pochodziła z księgi znaku i została zastąpiona.

   Nazwy kluczy w COLOR pozostały bez zmian, żeby wszystkie
   generatory działały bez przeróbek — zmieniły się wartości.
   ============================================================ */

const fs = require("fs");
const path = require("path");

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, HeadingLevel, TabStopType,
  TabStopPosition, PageBreak, ImageRun,
} = require("docx");

/* ---------- PALETA (księga znaku) ---------- */
// Kolory marki, dodatkowe i informacyjne przepisane wprost z księgi.
// Klucze zachowane z wersji 1.0 — zmieniły się wyłącznie wartości.
const COLOR = {
  // --- kolory marki ---
  navy:      "1A2B3C", // Steel blue    · RAL 5011 — sygnatura, H1, nagłówki tabel, linie
  navyDark:  "1F3855", // Sapphire blue · RAL 5003 — H2 i H3, akcenty drugiego planu
  pastel:    "73B7E5", // Pastel blue   · RAL 5024 — wyróżnienia, tła znaczników
  white:     "FFFFFF",

  // --- kolory dodatkowe ---
  ink:       "1A2B3C", // tekst podstawowy = Steel blue (księga nie ma osobnego grafitu)
  grey:      "838E91", // Telegrey 2    · RAL 7046 — nagłówek i stopka strony, metadane
  greyMid:   "9CA9AD", // Traffic grey  · RAL 7042 — opisy drugoplanowe
  greyText:  "5F6E75", // POCHODNY: Telegrey przyciemniony do czytelności w tekście ciągłym
  line:      "B6C5CA", // linia siatki tabel
  tintLight: "E8F1F4", // jasny błękit — zebra tabel, tła komórek
  tintMid:   "D5E9F7", // POCHODNY: Pastel blue 30% — tła ramek informacyjnych
  orange:    "FF7517", // Luminous Orange · RAL 2007 — akcent wyróżniający
  yellow:    "FFE97D", // Zinc Yellow     · RAL 1018

  // --- kolory informacyjne (UI) ---
  // Pełne barwy służą jako pasek/ikona, rozbicia jako tło, warianty *Ink jako tekst.
  green:     "1B6B48", // tekst statusu pozytywnego (z #47C98B, czytelny na papierze)
  amber:     "8A5A08", // tekst ostrzeżenia (z #FF7517)
  red:       "C42222", // tekst statusu krytycznego (z #F95050)
  greenPure: "47C98B",
  redPure:   "F95050",
  greenBg:   "C8EFDC", // rozbicie 30%
  amberBg:   "FFF4BE", // rozbicie 50% Zinc Yellow
  redBg:     "FDCBCB", // rozbicie 30%
};

/* ---------- FONT ---------- */
/*  Księga znaku wskazuje: Display — Paralucent Extra Light, nagłówki —
    Paralucent Medium, tekst — Poppins Regular, cyfry — Paralucent Stencil.
    Word nie ma stosu zapasowego: podaje się jedną nazwę i jeśli krój nie jest
    zainstalowany, Word podstawia własny. Dlatego moduł ma przełącznik:

      "brand"  — Paralucent w nagłówkach (wymaga licencji i instalacji na
                 stanowiskach; Paralucent to krój komercyjny The Northern Block),
      "office" — wszystko Poppinsem (domyślnie; Poppins jest darmowy, do pobrania
                 z Google Fonts, i księga wskazuje go jako krój tekstowy),
      "system" — wszystko Arialem (awaryjnie, gdy na stanowiskach nie da się
                 zainstalować żadnego kroju firmowego).

    Zmiana jednej linii poniżej przestawia wszystkie wzory.                     */
const FONT_SET = "office"; // "brand" | "office" | "system"

const FONT_SETS = {
  brand:  { display: "Paralucent", head: "Paralucent", body: "Poppins" },
  office: { display: "Poppins",    head: "Poppins",    body: "Poppins" },
  system: { display: "Arial",      head: "Arial",      body: "Arial"   },
};
const FONTS = FONT_SETS[FONT_SET] || FONT_SETS.office;
const FONT = FONTS.body;          // zgodność wsteczna — generatory używają FONT
const FONT_HEAD = FONTS.head;
const FONT_DISPLAY = FONTS.display;

/* ---------- LOGO ---------- */
/*  Znak wyciągnięty z krzywych księgi znaku. W dokumentach Word wstawiamy
    wersję PNG (Word nie renderuje SVG w nagłówku strony niezawodnie).
    Gdy plik zniknie, komponenty wracają do sygnatury słownej — dokument
    nigdy się nie wywala z powodu braku grafiki.                              */
const ASSETS = path.join(__dirname, "..", "assets");
const LOGO = {
  navy:  path.join(ASSETS, "moris-logo-granat.png"),
  white: path.join(ASSETS, "moris-logo-bialy.png"),
};
const LOGO_RATIO = 264.58 / 43.33; // proporcje logotypu poziomego z księgi

function logoRun(widthPx, variant = "navy") {
  const file = LOGO[variant] || LOGO.navy;
  try {
    return new ImageRun({
      type: "png",
      data: fs.readFileSync(file),
      transformation: { width: widthPx, height: Math.round(widthPx / LOGO_RATIO) },
    });
  } catch (e) {
    // awaryjnie: sygnatura słowna w kolorze marki
    return new TextRun({
      text: "Moris",
      bold: true,
      font: FONT_HEAD,
      size: Math.round(widthPx / 2),
      color: variant === "white" ? COLOR.white : COLOR.navy,
    });
  }
}

/* ---------- WYMIARY STRONY (A4) ---------- */
const PAGE = {
  width: 11906, height: 16838,
  margin: { top: 1418, right: 1440, bottom: 1418, left: 1440 },
};
// szerokość kolumny treści = 11906 - 1440 - 1440 = 9026
const CONTENT_W = 9026;

/* ---------- STYLE AKAPITÓW ---------- */
const paragraphStyles = [
  {
    id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
    run: { size: 56, bold: true, font: FONT_DISPLAY, color: COLOR.navy },
    paragraph: { spacing: { before: 0, after: 80 } },
  },
  {
    id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
    run: { size: 32, bold: true, font: FONT_HEAD, color: COLOR.navy },
    paragraph: {
      spacing: { before: 360, after: 180 }, outlineLevel: 0,
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, space: 4, color: COLOR.navy } },
    },
  },
  {
    id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
    run: { size: 26, bold: true, font: FONT_HEAD, color: COLOR.navyDark },
    paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 },
  },
  {
    id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
    run: { size: 23, bold: true, font: FONT_HEAD, color: COLOR.navyDark },
    paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 },
  },
];

/* ---------- KONSTRUKTOR DOKUMENTU ---------- */
function buildDoc(sections) {
  return new Document({
    creator: "Moris sp. z o.o.",
    styles: {
      default: { document: { run: { font: FONT, size: 22, color: COLOR.ink } } },
      paragraphStyles,
    },
    numbering: {
      config: [
        { reference: "bullets", levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2013", alignment: AlignmentType.LEFT,
          style: { run: { color: COLOR.navy }, paragraph: { indent: { left: 360, hanging: 260 } } } }] },
        { reference: "numbers", levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 420, hanging: 320 } } } }] },
      ],
    },
    sections,
  });
}

/* ---------- NAGŁÓWEK STRONY ---------- */
// pillar = nazwa procesu/obszaru (lewa); unit = jednostka organizacyjna (prawa)
function header(pillar, unit) {
  return new Header({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
        spacing: { after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, space: 4, color: COLOR.navy } },
        children: [
          logoRun(78),
          new TextRun({ text: "   |   ", color: COLOR.grey, size: 18 }),
          new TextRun({ text: pillar, color: COLOR.grey, size: 18 }),
          new TextRun({ text: "\t", size: 18 }),
          new TextRun({ text: unit, color: COLOR.grey, size: 18 }),
        ],
      }),
    ],
  });
}

/* ---------- STOPKA STRONY ---------- */
// docId = identyfikator dokumentu (np. ZSZ-POL-FIN-01); ver = wersja
function footer(docId, ver, confidential = true) {
  const leftText = confidential
    ? "DOKUMENT POUFNY \u2014 wy\u0142\u0105cznie do u\u017cytku wewn\u0119trznego Moris sp. z o.o."
    : "Moris sp. z o.o.  |  ul. Wiejska 27, 41-500 Chorz\u00f3w";
  return new Footer({
    children: [
      new Paragraph({
        tabStops: [
          { type: TabStopType.CENTER, position: CONTENT_W / 2 },
          { type: TabStopType.RIGHT, position: CONTENT_W },
        ],
        spacing: { before: 60 },
        border: { top: { style: BorderStyle.SINGLE, size: 8, space: 4, color: COLOR.navy } },
        children: [
          new TextRun({ text: leftText, italics: true, color: COLOR.grey, size: 16 }),
          new TextRun({ text: "\tStrona ", color: COLOR.grey, size: 16 }),
          new TextRun({ children: [PageNumber.CURRENT], bold: true, color: COLOR.grey, size: 16 }),
          new TextRun({ text: " / ", color: COLOR.grey, size: 16 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: COLOR.grey, size: 16 }),
          new TextRun({ text: "\t" + docId + "   v" + ver, color: COLOR.grey, size: 16 }),
        ],
      }),
    ],
  });
}

/* ---------- KOMPONENTY TREŚCI ---------- */

// akapit zwykły
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 120, line: 276 },
    children: [new TextRun({ text, size: 22, color: COLOR.ink, ...opts })],
  });
}

// akapit z wieloma fragmentami (runs)
function pRuns(runs, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 120, line: 276 },
    ...opts,
    children: runs,
  });
}

// punkt listy wypunktowanej
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 30, after: 60, line: 276 },
    children: [new TextRun({ text, size: 22, color: COLOR.ink })],
  });
}

// punkt listy numerowanej
function num(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { before: 30, after: 60, line: 276 },
    children: [new TextRun({ text, size: 22, color: COLOR.ink })],
  });
}

// nagłówki
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });

// ramka informacyjna (lewy pasek granatowy, tło błękitne)
function calloutBox(text, accent = COLOR.navy) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      shading: { fill: COLOR.tintMid, type: ShadingType.CLEAR },
      borders: {
        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        left: { style: BorderStyle.SINGLE, size: 24, color: accent },
      },
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children: [new Paragraph({
        spacing: { line: 276 },
        children: [new TextRun({ text, italics: true, size: 21, color: COLOR.ink })],
      })],
    })] })],
  });
}

// odstęp pionowy
const gap = (h = 200) => new Paragraph({ spacing: { before: h, after: 0 }, children: [] });

// przerwa strony
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

/* ---------- TABELE ---------- */

// komórka tabeli
function cell(content, { fill, bold, color, w, align, header: isHdr } = {}) {
  const runs = (Array.isArray(content) ? content : [content]).map((t) =>
    new TextRun({
      text: String(t), bold: bold || isHdr, size: isHdr ? 21 : 21,
      color: color || (isHdr ? COLOR.white : COLOR.ink),
    }));
  const border = { style: BorderStyle.SINGLE, size: 2, color: COLOR.line };
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: fill || (isHdr ? COLOR.navy : COLOR.white), type: ShadingType.CLEAR },
    borders: { top: border, bottom: border, left: border, right: border },
    margins: { top: 80, bottom: 80, left: 130, right: 130 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: align || AlignmentType.LEFT,
      spacing: { line: 260 },
      children: runs,
    })],
  });
}

// tabela z nagłówkiem kolumn (data = tablica wierszy; pierwszy wiersz = nagłówek)
function dataTable(colWidths, rows, opts = {}) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const trs = rows.map((row, ri) => new TableRow({
    tableHeader: ri === 0,
    children: row.map((c, ci) => {
      if (ri === 0) return cell(c, { w: colWidths[ci], header: true });
      const zebra = opts.zebra !== false && ri % 2 === 0;
      return cell(c, { w: colWidths[ci], fill: zebra ? COLOR.tintLight : COLOR.white });
    }),
  }));
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: trs,
  });
}

// tabela metryki dokumentu (dwie kolumny: etykieta | wartość)
function metaTable(pairs) {
  const labelW = 2600, valueW = CONTENT_W - labelW;
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [labelW, valueW],
    rows: pairs.map((row, i) => new TableRow({
      children: [
        cell(row[0], { w: labelW, fill: COLOR.tintLight, bold: true, color: COLOR.navy }),
        cell(row[1], { w: valueW, fill: COLOR.white }),
      ],
    })),
  });
}

/* ---------- STRONA TYTUŁOWA ---------- */
// kicker = mały nadtytuł; title = wieloliniowy tytuł; subtitle = podtytuł kursywą
function titlePage({ kicker, titleLines, subtitle, meta }) {
  const out = [];
  out.push(gap(260));
  // linia granatowa nad tytułem
  out.push(new Paragraph({
    spacing: { after: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 28, space: 6, color: COLOR.navy } },
    children: [],
  }));
  // logo z księgi znaku
  out.push(new Paragraph({
    spacing: { after: 200 },
    children: [logoRun(210)],
  }));
  // kicker
  if (kicker) out.push(new Paragraph({
    spacing: { before: 80, after: 60 },
    children: [new TextRun({
      text: kicker.toUpperCase().split("").join("\u200a"),
      bold: true, size: 22, color: COLOR.grey,
    })],
  }));
  // tytuł
  titleLines.forEach((line) => out.push(new Paragraph({
    style: "Title",
    children: [new TextRun({ text: line, bold: true, size: 52, color: COLOR.navy })],
  })));
  // podtytuł
  if (subtitle) out.push(new Paragraph({
    spacing: { before: 240, after: 80, line: 300 },
    children: [new TextRun({ text: subtitle, italics: true, size: 26, color: COLOR.ink })],
  }));
  out.push(gap(360));
  // tabela metryki
  if (meta) out.push(metaTable(meta));
  return out;
}

module.exports = {
  Packer, COLOR, FONT, FONTS, FONT_HEAD, FONT_DISPLAY, FONT_SET, PAGE, CONTENT_W,
  LOGO, logoRun,
  buildDoc, header, footer,
  p, pRuns, bullet, num, h1, h2, h3,
  calloutBox, gap, pageBreak,
  cell, dataTable, metaTable, titlePage,
  // re-eksport klas docx dla wzorów
  Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
  BorderStyle, WidthType, ShadingType, VerticalAlign, HeadingLevel,
  TabStopType, PageBreak, ImageRun,
};
