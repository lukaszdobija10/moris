# System identyfikacji wizualnej Moris — specyfikacja z księgi znaku

Źródło: [`moris-logo-manual.pdf`](moris-logo-manual.pdf) — „Moris – podstawowe
wytyczne stosowania logo”. Ten plik jest przepisaniem księgi do postaci, z której
korzystają prototypy w repozytorium. **W razie rozbieżności rozstrzyga PDF.**

Wartości wykonawcze do wklejenia w kod: [`tokens.css`](tokens.css).

---

## 1. Znak

| Element | Plik | Zastosowanie |
|---|---|---|
| Symbol | [`moris-symbol.svg`](moris-symbol.svg) | favicon, awatar, sygnet w aplikacji, znak wodny |
| Logotyp poziomy | [`moris-logo-poziomy.svg`](moris-logo-poziomy.svg) | nagłówek strony, stopka, papier firmowy |
| Logotyp pionowy | [`moris-logo-pionowy.svg`](moris-logo-pionowy.svg) | układy wąskie, materiały kwadratowe, oznaczenia |
| Logotyp z hasłem | (w PDF) | reprezentacja pełna: „steel trade and services” + „moris.eu” |

Pliki SVG odtworzono z krzywych z księgi — nie są przerysowane ani przybliżone.
Wypełnienie ustawione na `currentColor`, więc znak dziedziczy kolor tekstu
i działa zarówno w wersji granatowej, jak i w kontrze na białą.

**Konstrukcja i pole ochronne.** Księga opisuje znak na siatce modułowej opartej
na module *x* — szerokość ramienia symbolu. Pole ochronne wokół całego logotypu
wynosi *x*. Nie umieszczać w nim żadnych innych elementów: tekstu, linii,
krawędzi zdjęcia.

**Czego nie robić** (wynika z konstrukcji): nie rozciągać nieproporcjonalnie,
nie obracać, nie zmieniać odstępu symbolu od logotypu, nie wypełniać symbolu
gradientem, nie umieszczać na tle o niskim kontraście — na zdjęciach stosować
wersję białą na przyciemnieniu.

---

## 2. Kolory marki

| Nazwa | RAL | HEX | CMYK |
|---|---|---|---|
| Steel blue | RAL 5011 | `#1A2B3C` | 100–100–60–30 |
| Sapphire blue | RAL 5003 | `#1F3855` | 70–30–0–70 |
| Pastel blue | RAL 5024 | `#73B7E5` | 55–15–0–0 |
| White | — | `#FFFFFF` | — |

## 3. Kolory dodatkowe

| Nazwa | RAL | HEX |
|---|---|---|
| Telegrey 2 | RAL 7046 | `#838E91` |
| Traffic grey | RAL 7042 | `#9CA9AD` |
| — | — | `#B6C5CA` |
| — | — | `#E8F1F4` |
| Luminous Orange | RAL 2007 | `#FF7517` |
| Zinc Yellow | RAL 1018 | `#FFE97D` |

## 4. Kolory informacyjne (UI)

Księga podaje je razem z rozbiciami: żółty w 50%, zielony i czerwony w 60% i 30%.
Rozbicia są tłem komunikatu, kolor pełny — jego krawędzią lub ikoną.

| Znaczenie | Pełny | 60% | 30% |
|---|---|---|---|
| Potwierdzenie, dostępność | `#47C98B` | `#91DFB9` | `#C8EFDC` |
| Błąd, brak, blokada | `#F95050` | `#FB9696` | `#FDCBCB` |
| Ostrzeżenie, uwaga | `#FFE97D` | — | `#FFF4BE` (50%) |

---

## 5. Typografia

| Rola | Krój z księgi | Zapas webowy |
|---|---|---|
| Display | Paralucent Extra Light | Poppins 200 |
| Headline | Paralucent Medium | Poppins 500 |
| Tekst ciągły | Poppins Regular | Poppins 400 |
| Cyfry, oznaczenia | Paralucent Stencil Extra Light | Poppins 200 |

Paralucent (The Northern Block) jest krojem komercyjnym i nie jest hostowany na
Google Fonts. W prototypach stoi na pierwszym miejscu w stosie — po wykupieniu
licencji webfont wystarczy dograć pliki, bez zmian w kodzie. Poppins pochodzi
z Google Fonts i jest w księdze krojem tekstowym, więc zapas nie wprowadza
obcego charakteru.

---

## 6. Zasady zastosowania w interfejsie

To warstwa wykonawcza — księga opisuje materiały drukowane, interfejs wymaga
kilku rozstrzygnięć więcej. Poniższe decyzje wynikają z księgi i z wymagań
dostępności; każda jest do akceptacji.

**Hierarchia kolorów.** Steel blue niesie tekst i ciemne powierzchnie.
Sapphire blue jest kolorem działania: przyciski główne, odnośniki, ramki pól
aktywnych. Pastel blue i jego 30% rozbicie są tłem sekcji i znaczników.
Luminous Orange jest akcentem wyróżniającym jeden element na ekranie — nigdy
kilkanaście naraz; biały tekst na pomarańczowym daje kontrast 2,7:1, więc na
tym tle składamy tekst w kolorze Steel blue (5,4:1).

**Znaczniki statusu.** Kolor informacyjny niesie tło (rozbicie 30%), tekst
zostaje w kolorze Steel blue. Same kolory UI mają na bieli kontrast poniżej
progu i nie nadają się na tekst.

**Kontrast tekstu drugorzędnego.** Telegrey 2 na bieli daje 3,3:1 — poniżej
wymogu WCAG AA dla tekstu ciągłego. Do opisów i metadanych używamy tokenu
pochodnego `--muted: #5F6E75` (5,3:1), czyli Telegrey przyciemnionego. Oryginalny
Telegrey zostaje przy elementach dekoracyjnych i dużym stopniu pisma.

**Dane liczbowe.** Paralucent Stencil Extra Light to krój ekspozycyjny —
świetny w dużych liczbach wyróżnikowych, nieczytelny w tabeli cen. Dane
tabelaryczne składamy Poppinsem z `font-variant-numeric: tabular-nums`,
żeby cyfry wyrównywały się w kolumnach.

---

## 7. Rozbieżność do wyjaśnienia

Skill `moris-docs`, którym generowane są dokumenty firmowe (polityki, oferty,
pisma), opisuje inny system: granat `#156082` i krój Arial. Ta specyfikacja
została odtworzona z wewnętrznego dokumentu Word (ZSZ-POL-FIN-01), a nie
z księgi znaku — i najprawdopodobniej utrwala to, co powstało w Wordzie, a nie
to, co ustalił projektant.

**Rekomendacja:** księga znaku jest nadrzędna. Dokumenty firmowe powinny przejść
na Steel blue `#1A2B3C` i Sapphire blue `#1F3855`, a tam gdzie Paralucent nie
jest dostępny w pakiecie biurowym — na Poppins albo, w ostateczności, Arial jako
zamiennik systemowy. Zmiana wymaga decyzji, bo dotyka wszystkich wzorów ZSZ.
