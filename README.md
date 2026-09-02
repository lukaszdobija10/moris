# moris.eu — analiza i propozycja nowego układu strony

Repozytorium robocze Działu Sprzedaży E-Commerce Moris sp. z o.o.

| Plik | Co zawiera |
|---|---|
| [`ANALIZA.md`](ANALIZA.md) | Odtworzona architektura informacji obecnego serwisu, diagnoza dziesięciu problemów konwersyjnych, propozycja nowego układu strony głównej wraz z uzasadnieniem każdej sekcji, miary skuteczności. |
| [`odwzorowanie/index.html`](odwzorowanie/index.html) | Model strukturalny obecnej strony `moris.eu/pl` z przełącznikiem „Pokaż uwagi UX" — siedem ponumerowanych uwag przypiętych do miejsc, których dotyczą. |
| [`redesign/index.html`](redesign/index.html) | Prototyp nowego układu. Działające: wyszukiwarka parametryczna, konfigurator cięcia z podglądem odpadu, kalkulator masy i ceny z rabatem progowym, szybkie zamówienie z listy. |
| [`redesign/rejestracja.html`](redesign/rejestracja.html) | Ekran rejestracji w dwóch odsłonach — przed podaniem NIP (dla kogo, dlaczego warto, potrzebne kroki) i po weryfikacji (formularz, postęp, pomoc): dane firmy z CEIDG/KRS i białej listy VAT, walidacja sumy kontrolnej NIP, kontakt firmowy oddzielony od danych osoby, przełącznik „inne dane do faktury" wraz z odbiorcą towaru, rozdzielone zgody wymagane i marketingowe. |
| [`brand/`](brand/) | Księga znaku Moris (PDF), jej przepisanie do `BRANDBOOK.md`, tokeny `tokens.css` oraz znak wyciągnięty z księgi jako SVG. Wszystkie prototypy korzystają z tego systemu. |

Wszystkie trzy prototypy to samodzielne pliki HTML — wystarczy otworzyć w przeglądarce,
bez budowania i bez zależności.

## Zastrzeżenie

Sesja robocza działała za firmowym proxy blokującym ruch do `moris.eu` (403).
Struktura i treść zostały odtworzone z indeksu wyszukiwarki dla domeny,
publikacji branżowych i profili firmowych — szczegóły metodyki w rozdziale 1
dokumentu `ANALIZA.md`. Odwzorowanie należy traktować jako model strukturalny,
nie kopię 1:1.

## System wizualny

Źródłem jest księga znaku [`brand/moris-logo-manual.pdf`](brand/moris-logo-manual.pdf).
Przepisanie do postaci roboczej: [`brand/BRANDBOOK.md`](brand/BRANDBOOK.md),
wartości do kodu: [`brand/tokens.css`](brand/tokens.css).

| Rola | Wartość |
|---|---|
| Steel blue · RAL 5011 | `#1A2B3C` — tekst, ciemne powierzchnie |
| Sapphire blue · RAL 5003 | `#1F3855` — kolor działania |
| Pastel blue · RAL 5024 | `#73B7E5` — tła sekcji i znaczników |
| Luminous Orange · RAL 2007 | `#FF7517` — akcent |
| Kolory UI | `#47C98B` / `#F95050` / `#FFE97D` w rozbiciach 30% i 60% |
| Display / Headline | Paralucent Extra Light / Medium (zapas: Poppins 200 / 500) |
| Tekst | Poppins Regular |

Znak wyciągnięty z księgi jako krzywe i zapisany w SVG:
[`moris-symbol.svg`](brand/moris-symbol.svg),
[`moris-logo-poziomy.svg`](brand/moris-logo-poziomy.svg),
[`moris-logo-pionowy.svg`](brand/moris-logo-pionowy.svg).
Wypełnienie ustawione na `currentColor` — znak dziedziczy kolor tekstu.

Paralucent (The Northern Block) jest krojem komercyjnym i nie jest hostowany
na Google Fonts. W prototypach stoi pierwszy w stosie, zapasem jest Poppins —
krój, który księga i tak wskazuje jako tekstowy. Po wykupieniu licencji webfont
wystarczy dograć pliki, bez zmian w kodzie.

Trzy tokeny są **pochodne** — księga ich nie definiuje, bo dotyczą wyłącznie
interfejsu: przyciemniony Telegrey do tekstu drugorzędnego (oryginał nie spełnia
WCAG AA), delikatna linia wewnętrzna i warianty kolorów UI do tekstu. Każdy
opisany w `brand/BRANDBOOK.md` i wymaga akceptacji.

**Do wyjaśnienia:** skill `moris-docs`, którym powstają dokumenty firmowe, opisuje
inny system — granat `#156082` i Arial. Ta specyfikacja została odtworzona
z wewnętrznego pliku Word, nie z księgi znaku. Rekomendacja w `brand/BRANDBOOK.md`,
rozdział 7.
