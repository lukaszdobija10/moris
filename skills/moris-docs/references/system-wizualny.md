# System identyfikacji wizualnej Moris — specyfikacja

Źródło: **księga znaku Moris** — `assets/moris-logo-manual.pdf` („Moris –
podstawowe wytyczne stosowania logo”). W razie rozbieżności rozstrzyga PDF.

> Wersja 1.0 tej specyfikacji opisywała paletę odtworzoną z pliku Word
> ZSZ-POL-FIN-01 (granat `156082`, Arial). Ta paleta nie pochodziła z księgi
> znaku i została zastąpiona. Jeśli spotkasz stare dokumenty w granacie
> `156082` — to materiały sprzed ujednolicenia.

Ten plik opisuje system niezależnie od kodu — stosuj go, gdy tworzysz **nowy typ
dokumentu**, którego nie ma wśród gotowych generatorów, albo gdy musisz zbudować
materiał w innej technologii (np. strona HTML, prezentacja).

---

## Znak

| Wariant | Plik | Zastosowanie |
|---|---|---|
| Logotyp poziomy | `assets/moris-logo-poziomy.svg` | nagłówek strony, strona tytułowa, papier firmowy |
| Logotyp pionowy | `assets/moris-logo-pionowy.svg` | układy wąskie, materiały kwadratowe |
| Symbol | `assets/moris-symbol.svg` | sygnet, awatar, znak wodny, favicon |
| Wersja do Worda | `assets/moris-logo-granat.png`, `assets/moris-logo-bialy.png` | osadzana automatycznie przez `lib/moris-brand.js` |

Pliki SVG odtworzono z krzywych księgi — nie są przerysowane. Wypełnienie
ustawione na `currentColor`, więc znak dziedziczy kolor otoczenia.

**Zasady.** W nagłówku strony znak ma szerokość 78 px, na stronie tytułowej
210 px. Na ciemnym tle stosuje się wariant biały. Pole ochronne wokół znaku jest
równe szerokości ramienia symbolu (moduł *x* z księgi) — nie umieszcza się w nim
tekstu, linii ani krawędzi zdjęcia. Znaku nie rozciągamy nieproporcjonalnie, nie
obracamy, nie zmieniamy odstępu symbolu od logotypu i nie wypełniamy gradientem.

W kodzie: `logoRun(szerokość, "navy" | "white")` z modułu brandingu. Gdy plik
graficzny jest niedostępny, funkcja wraca do sygnatury słownej „Moris" —
dokument wygeneruje się mimo braku grafiki.

---

## Paleta kolorów

### Kolory marki

| Nazwa | RAL | HEX | Zastosowanie |
|---|---|---|---|
| Steel blue | RAL 5011 | `1A2B3C` | tekst podstawowy, nagłówki H1, tła nagłówków tabel, linie akcentujące |
| Sapphire blue | RAL 5003 | `1F3855` | nagłówki H2 i H3, akcenty drugiego planu |
| Pastel blue | RAL 5024 | `73B7E5` | wyróżnienia, tła znaczników |
| White | — | `FFFFFF` | tło, tekst na Steel blue |

### Kolory dodatkowe

| Nazwa | RAL | HEX | Zastosowanie |
|---|---|---|---|
| Telegrey 2 | RAL 7046 | `838E91` | nagłówek i stopka strony, metadane |
| Traffic grey | RAL 7042 | `9CA9AD` | opisy drugoplanowe, podpisy pod tabelami |
| — | — | `B6C5CA` | cienka linia siatki tabel |
| — | — | `E8F1F4` | tło komórek opisowych, wiersze parzyste tabel (zebra) |
| Luminous Orange | RAL 2007 | `FF7517` | akcent wyróżniający jeden element |
| Zinc Yellow | RAL 1018 | `FFE97D` | podkreślenia i oznaczenia pomocnicze |

### Kolory informacyjne

Barwa pełna niesie pasek lub ikonę, rozbicie stanowi tło, wariant przyciemniony
służy do tekstu — barwy pełne są na bieli zbyt jasne, żeby czytać z nich słowa.

| Znaczenie | Pełny | Tło | Tekst |
|---|---|---|---|
| Status pozytywny, akceptacja | `47C98B` | `C8EFDC` | `1B6B48` |
| Ostrzeżenie, kwestia do decyzji | `FFE97D` | `FFF4BE` | `8A5A08` |
| Status krytyczny, zakaz | `F95050` | `FDCBCB` | `C42222` |

**Zasada kolorów funkcyjnych:** stosuje się je WYŁĄCZNIE do oznaczania statusu
lub charakteru informacji — nigdy jako kolor dekoracyjny.

### Tokeny pochodne

Trzy wartości nie występują w księdze — powstały, bo dokument potrzebuje
rozstrzygnięć, których materiał ekspozycyjny nie definiuje:
`5F6E75` (Telegrey przyciemniony do czytelności w tekście ciągłym),
`D5E9F7` (Pastel blue 30% jako tło ramek informacyjnych) oraz warianty tekstowe
kolorów informacyjnych z tabeli powyżej.

---

## Typografia

| Rola | Krój z księgi | Zapas |
|---|---|---|
| Display (tytuł dokumentu) | Paralucent Extra Light | Poppins |
| Nagłówki H1–H3 | Paralucent Medium | Poppins pogrubiony |
| Tekst ciągły | Poppins Regular | Poppins |
| Cyfry, oznaczenia ekspozycyjne | Paralucent Stencil Extra Light | Poppins |

**Paralucent** (The Northern Block) jest krojem komercyjnym — wymaga licencji
i instalacji na stanowiskach. **Poppins** jest darmowy (Google Fonts) i księga
wskazuje go jako krój tekstowy, więc zapas nie wprowadza obcego charakteru.

Word nie ma stosu zapasowego: podaje się jedną nazwę kroju i jeśli nie jest
zainstalowany, Word podstawia własny. Dlatego moduł `lib/moris-brand.js` ma
przełącznik `FONT_SET`:

| Ustawienie | Efekt | Kiedy |
|---|---|---|
| `brand` | Paralucent w nagłówkach, Poppins w tekście | gdy Paralucent jest wdrożony na stanowiskach |
| `office` | wszystko Poppinsem | **domyślne** |
| `system` | wszystko Arialem | gdy nie można zainstalować żadnego kroju firmowego |

### Hierarchia tekstu

| Element | Rozmiar (pkt) | docx half-points | Styl | Kolor |
|---|---|---|---|---|
| Tytuł dokumentu | 26 | 52 | Pogrubienie | Steel blue |
| Nagłówek H1 | 16 | 32 | Pogrubienie + dolna linia | Steel blue |
| Nagłówek H2 | 13 | 26 | Pogrubienie | Sapphire blue |
| Nagłówek H3 | 11,5 | 23 | Pogrubienie | Sapphire blue |
| Tekst podstawowy | 11 | 22 | Zwykły | Steel blue |
| Tekst pomocniczy | 9–10 | 18–20 | Zwykły / kursywa | Telegrey 2 |

Zasady składu: interlinia tekstu 1,15 (≈ `line: 276`); akapity oddzielane
odstępem, nie wcięciem; tekst justowany do lewej; cudzysłów drukarski „…",
półpauza – w zakresach i wyliczeniach.

---

## Układ strony

- Format A4: szerokość `11906`, wysokość `16838` (twips/DXA).
- Marginesy: góra/dół `1418` (25 mm), lewy/prawy `1440` (25,4 mm).
- Szerokość kolumny treści: `9026` DXA (≈ 159 mm). Wszystkie tabele i bloki pełnej
  szerokości używają tej wartości jako `CONTENT_W`.

**Nagłówek strony:** znak (logotyp poziomy, szerokość 78 px) + separator „ | " +
nazwa procesu/obszaru (szary, lewa), jednostka organizacyjna (szary, dosunięta do
prawej). Pod spodem cienka linia w kolorze Steel blue.

**Stopka strony:** klauzula (lewa) + numeracja „Strona X / Y" (środek) + identyfikator
i wersja dokumentu (prawa). Nad nią cienka linia w kolorze Steel blue.
- Dokumenty wewnętrzne: klauzula „DOKUMENT POUFNY — wyłącznie do użytku wewnętrznego
  Moris sp. z o.o."
- Dokumenty do klientów: zamiast klauzuli dane adresowe „Moris sp. z o.o. | ul. Wiejska
  27, 41-500 Chorzów".

---

## Strona tytułowa

Pięć stałych elementów od góry: gruba linia w kolorze Steel blue, znak (szerokość
210 px), mały nadtytuł rozstrzelony (kicker, szary), wieloliniowy tytuł (Steel blue, 26 pkt),
podtytuł kursywą. Pod tytułem — tabela metryki dokumentu (etykiety w kolumnie lewej:
tło błękit jasny, tekst Steel blue; wartości w prawej: tło białe).

Standardowa metryka: Dokument, Identyfikator, Wersja, Data wydania, Właściciel
dokumentu, Akceptujący (jeśli dotyczy), Zakres stosowania, Klasyfikacja.

---

## Tabele

- Wiersz nagłówkowy: tło Steel blue, tekst biały, pogrubiony, 10,5 pkt.
- Wiersze treści: efekt zebry — parzyste tło błękit jasny, nieparzyste białe.
- Siatka: cienka linia `B6C5CA`.
- Wewnętrzne marginesy komórki zapewniają oddech (góra/dół ≈ 80, boki ≈ 130 DXA).
- Tabela jest preferowana nad listą wypunktowaną dla danych operacyjnych,
  decyzyjnych i porównawczych.

---

## Ramki informacyjne (callout)

Tło Pastel blue 30% `D5E9F7`, lewy pasek akcentujący (gruby), tekst kursywą. Kolor
lewego paska niesie znaczenie:
- Steel blue — reguła/zasada neutralna.
- Żółty `FFE97D` — ostrzeżenie, kwestia do uwagi.
- Czerwony `F95050` — twarde ograniczenie, zakaz.

Stosować oszczędnie — nadmiar wyróżnień sprawia, że żadne nie jest zauważane.

---

## System sygnatur dokumentów

Schemat: **ZSZ – KATEGORIA – OBSZAR – NUMER**

- ZSZ — przynależność do Zintegrowanego Systemu Zarządzania.
- KATEGORIA — POL (polityka), PRC (procedura), INS (instrukcja), FRM (formularz),
  OFR (oferta), RAP (raport), PLN (plan).
- OBSZAR — FIN (finanse), ECM (e-commerce), SPR (sprzedaż), LOG (logistyka),
  HR (kadry).
- NUMER — kolejny dwucyfrowy w obrębie obszaru, np. 01.

Przykład: `ZSZ-POL-FIN-01`. Sygnatura widnieje w metryce i w prawej części stopki.

---

## Zasady tonu i treści (przeniesione z dokumentów źródłowych)

1. **Język bez przepraszania** w korespondencji windykacyjnej i reklamacyjnej.
   Podawać konkretny termin, numer dokumentu, jednoznacznie nazwane następstwa.
2. **Otwarta ścieżka współpracy** — nawet przy odmowie/odrzuceniu reklamacji
   pozostawić możliwość dalszej współpracy. Reklamacja nie kończy relacji.
3. **Limity kredytowe jako przywilej**, nie standardowy produkt — polityka opt-in,
   nigdy nieproponowana proaktywnie.
4. **Eskalacja windykacji stopniowa** — przy zaostrzeniu usuwa się język łagodzący,
   konsekwencje podaje wprost z terminami.
5. **Konkret zamiast ogólników** — daty, kwoty, numery (ZC…, FV…, transakcje SAP),
   nie sformułowania generyczne.
6. **Prawa zwrotu w B2B są ograniczone** — odstąpienie tylko przed wysyłką i
   płatnością; nie wpisywać do dokumentów nieprawdziwych praw zwrotu.

---

## Słownictwo SAP i narzędzia (kontekst e-commerce Moris)

Transakcje: VA01/02/03 (zlecenia), VF01/02/03 (faktury), VL01N/02N/03N (dostawy),
ZC (zamówienia), ASM, kokpit handlowca, kokpit CMC, kokpit transportu.
Platforma: moris.eu (front B2B), AutoPay (limit 15 000 PLN), Emarsys.
Weryfikacja klienta: KRS, biała lista VAT, BIG/KRD, Bisnode/Dun & Bradstreet.
BOK: 32 416 36 99 / info@moris.eu / pn–pt 8:00–16:00.
Adres: Moris sp. z o.o., ul. Wiejska 27, 41-500 Chorzów.
