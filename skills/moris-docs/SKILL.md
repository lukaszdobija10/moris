---
name: moris-docs
description: "Twórz dokumenty i narzędzia w systemie identyfikacji wizualnej Moris sp. z o.o. (dystrybucja stali, platforma B2B moris.eu, Dział Sprzedaży E-Commerce). Używaj tego skilla ZAWSZE, gdy Łukasz prosi o jakikolwiek dokument firmowy Moris: politykę, procedurę, instrukcję ZSZ, ofertę, pismo do klienta, wezwanie do zapłaty, protokół reklamacyjny, odpowiedź na reklamację, notatkę służbową, protokół spotkania, weekly, formularz, notatkę coachingową, podsumowanie wyników, ocenę półroczną, notatkę z rekrutacji, plan zadań, narzędzie planowania — lub o księgę znaku Moris. Triggerem jest sam kontekst: Łukasz jest Dyrektorem Sprzedaży E-Commerce w Moris, więc dokumenty firmowe dla tej roli używają tego brandingu — nawet bez słów 'brand' czy 'moris'. Skill zawiera moduł generujący docx, 17 gotowych wzorów, znak w plikach SVG i PNG oraz specyfikację brandu z księgi znaku (Steel blue 1A2B3C, Sapphire blue 1F3855, Paralucent/Poppins, format ZSZ). NIE używaj dla marki lukaszdobija.pl (osobny skill) ani dla ebooka."
---

# moris-docs

Generator dokumentów i narzędzi w systemie identyfikacji wizualnej Moris sp. z o.o.

System wizualny pochodzi z **księgi znaku Moris** (`assets/moris-logo-manual.pdf`).
Wszystkie wzory są ze sobą spójne: ten sam znak, paleta, typografia, układ nagłówka
i stopki, system sygnatur.

> **Wersja 2.0.** Do wersji 1.0 skill opierał się na palecie odtworzonej z pliku
> Word ZSZ-POL-FIN-01 (granat `156082`, Arial). Ta paleta nie pochodziła z księgi
> znaku i została zastąpiona. Nazwy kluczy w `COLOR` się nie zmieniły, więc
> generatory działają bez przeróbek.

## Architektura skilla — jak to działa

Inaczej niż skille oparte na gotowych plikach .docx, ten skill generuje dokumenty
**programowo**. Sercem jest moduł `lib/moris-brand.js`, który definiuje cały system
wizualny (kolory, fonty, style, komponenty: nagłówek, stopkę, stronę tytułową, tabele,
ramki). Każdy generator w `generators/` korzysta z tego modułu i produkuje gotowy
.docx. To zapewnia, że zmiana brandu w jednym miejscu propaguje się na wszystkie wzory.

```
moris-docs/
├── SKILL.md                          ← ten plik
├── lib/moris-brand.js                ← moduł brandingu (jedyne źródło prawdy w kodzie)
├── assets/                           ← znak i księga znaku
│   ├── moris-logo-manual.pdf         ← ŹRÓDŁO systemu wizualnego
│   ├── moris-logo-poziomy.svg        ← logotyp poziomy (nagłówek, strona tytułowa)
│   ├── moris-logo-pionowy.svg        ← logotyp pionowy (układy wąskie)
│   ├── moris-symbol.svg              ← sam symbol (sygnet, awatar, favicon)
│   ├── moris-logo-granat.png         ← wersja osadzana w docx
│   └── moris-logo-bialy.png          ← wersja na ciemne tło
├── generators/                       ← skrypty generujące poszczególne wzory
├── templates/narzedzie-planowania.html ← interaktywne narzędzie (HTML)
└── references/system-wizualny.md     ← pełna specyfikacja brandu (dla nowych typów)
```

## Znak i kroje — dwie rzeczy do zapamiętania

**Znak osadza się sam.** Moduł wstawia logotyp do nagłówka każdej strony
(78 px) i na stronę tytułową (210 px) funkcją `logoRun(szerokość, "navy" | "white")`.
Katalog `assets/` musi być skopiowany razem z `lib/` — bez niego komponenty
wracają do sygnatury słownej „Moris" i dokument nadal się wygeneruje, ale bez znaku.

**Krój ustawia jeden przełącznik.** Księga wskazuje Paralucent (komercyjny,
The Northern Block) w nagłówkach i Poppins w tekście. Word nie ma stosu
zapasowego, więc `lib/moris-brand.js` ma stałą `FONT_SET`:

| Ustawienie | Efekt | Kiedy używać |
|---|---|---|
| `"brand"` | Paralucent w nagłówkach, Poppins w tekście | gdy Paralucent jest wdrożony na stanowiskach |
| `"office"` | wszystko Poppinsem | **domyślne** — Poppins jest darmowy (Google Fonts) |
| `"system"` | wszystko Arialem | awaryjnie, gdy nie da się zainstalować kroju firmowego |

Nie zmieniaj `FONT_SET` na `"brand"`, dopóki Paralucent nie jest zainstalowany
u odbiorców dokumentu — Word podstawi wtedy krój losowo.

## Szybki start

**Zasada nr 1: nigdy nie definiuj brandingu od zera.** Zawsze korzystaj z modułu
`lib/moris-brand.js` (dla docx) albo z szablonu HTML. Moduł zawiera komplet
komponentów — Twoja praca to złożenie treści, nie projektowanie układu.

### Krok 1 — przygotuj środowisko robocze

```bash
mkdir -p /home/claude/moris && cd /home/claude/moris
cp -r <ścieżka-do-skilla>/lib ./lib
cp -r <ścieżka-do-skilla>/assets ./assets      # znak — bez tego dokumenty będą bez logo
cp -r <ścieżka-do-skilla>/generators ./generators
npm install docx        # biblioteka generująca .docx
mkdir -p out
```

(Ścieżkę do skilla podaje runtime; zwykle `/mnt/skills/user/moris-docs`.)

### Krok 2 — wybierz wzór i uruchom generator

Generatory są gotowe do uruchomienia. Każdy zapisuje plik do `./out/`.

```bash
node generators/gen-03-oferta.js     # → ./out/03_Wzor_oferta_handlowa.docx
```

### Krok 3 — wypełnij treścią

Wszystkie wzory zawierają placeholdery w nawiasach kwadratowych `[…]`. Aby wypełnić
dokument konkretną treścią, edytuj odpowiedni generator (zamień stringi `[…]` na
właściwe dane) i uruchom go ponownie, albo — dla dokumentu czysto szablonowego —
przekaż plik z `./out/` użytkownikowi do wypełnienia w Wordzie.

**Dla treści konkretnej** (np. realna oferta dla klienta): edytuj tablice danych w
generatorze. Tabele budowane są funkcją `dataTable(szerokości, wiersze)`, gdzie
pierwszy wiersz to nagłówek. Akapity to `p("tekst")`, nagłówki `h1()/h2()/h3()`,
ramki `calloutBox("tekst", KOLOR)`.

### Krok 4 — walidacja (obowiązkowa dla docx)

```bash
python /mnt/skills/public/docx/scripts/office/validate.py out/<plik>.docx
```

Musi zwrócić „All validations PASSED!". Walidacja wychwytuje uszkodzenia OOXML.

## Mapa wzorów

| Prośba | Generator | Klasa |
|---|---|---|
| księga znaku dokumentów, branding, system wizualny | `gen-01-ksiega.js` | referencja |
| polityka, procedura, instrukcja ZSZ | `gen-02-wewnetrzny.js` | wewnętrzny |
| oferta, propozycja handlowa | `gen-03-oferta.js` | klient |
| pismo do klienta, korespondencja B2B | `gen-04-pismo.js` | klient |
| notatka służbowa, protokół, formularz | `gen-05-operacyjne.js` | operacyjny |
| protokół reklamacyjny, wezwanie do zapłaty | `gen-06-reklamacja-wezwanie.js` | mieszany |
| notatka coachingowa 1:1, podsumowanie wyników, ocena półroczna | `gen-07-hr.js` | HR |
| notatka z weekly, notatka z rekrutacji, odpowiedź na reklamację | `gen-08-weekly-rekrutacja-odpowiedz.js` | mieszany |
| plan zadań i priorytetów (miesiąc/rok/strategia) | `gen-09-plan.js` | planowanie |
| interaktywne narzędzie planowania | `templates/narzedzie-planowania.html` | HTML |

Niektóre generatory tworzą po kilka plików naraz (np. `gen-05` → notatka, protokół,
formularz). Przeczytaj nagłówek generatora, by wiedzieć, co produkuje.

## Narzędzie planowania (HTML)

`templates/narzedzie-planowania.html` to interaktywne, samodzielne narzędzie:
trzy perspektywy (miesiąc/rok/strategia), wizja, kamienie milowe, priorytety A/B/C,
zapis w `window.storage`, eksport/import JSON, arkusz druku `@media print`.

Aby dostarczyć je użytkownikowi, skopiuj plik do `/mnt/user-data/outputs/`. Aby
dostosować — edytuj bezpośrednio; trzyma się tej samej palety co dokumenty docx.

**UWAGA — pułapka kodowania:** w treści HTML używaj WPROST polskich znaków
(ą, ę, ó, „, —), NIGDY sekwencji `\uXXXX`. W treści HTML `\u0118` nie jest
dekodowane przez przeglądarkę — wyświetli się dosłownie. (Escape `\uXXXX` jest
poprawny tylko w stringach JavaScript wewnątrz `<script>`.)

## Tworzenie nowego typu dokumentu

Jeśli prośba nie pasuje do żadnego wzoru, zbuduj nowy generator na bazie modułu:

1. Przeczytaj `references/system-wizualny.md` — pełna specyfikacja brandu.
2. Skopiuj najbliższy istniejący generator jako punkt wyjścia.
3. Importuj komponenty z modułu: `const B = require("../lib/moris-brand.js");`
   Dostępne: `buildDoc, header, footer, titlePage, metaTable, dataTable,
   calloutBox, p, h1, h2, h3, bullet, num, gap, pageBreak, logoRun, COLOR,
   FONT, FONT_HEAD, FONT_DISPLAY, CONTENT_W, PAGE`.
4. Dobierz: nagłówek (`header(obszar, jednostka)`), stopkę
   (`footer(sygnatura, wersja, poufny=true/false)` — `false` daje stopkę z adresem
   dla klienta), stronę tytułową lub baner operacyjny.
5. Nadaj sygnaturę wg schematu `ZSZ-KATEGORIA-OBSZAR-NN` (patrz referencja).
6. Waliduj wynik.

## Zasady tonu (krytyczne — z dokumentów źródłowych)

- **Bez języka przepraszającego** w windykacji i reklamacjach; konkret, termin,
  jednoznaczne następstwa.
- **Otwarta ścieżka współpracy** nawet przy odmowie — relacja trwa.
- **Limity kredytowe to przywilej** (opt-in), nie standardowy produkt.
- **Konkret zamiast ogólników**: daty, kwoty, numery dokumentów (ZC…, FV…), transakcje
  SAP zamiast sformułowań generycznych.
- Rejestr: profesjonalna polszczyzna biznesowa, formalna, bez emocji.

Pełne zasady, znak, paleta, typografia, słownictwo SAP i dane firmowe:
`references/system-wizualny.md`. Źródło systemu wizualnego: `assets/moris-logo-manual.pdf`.
