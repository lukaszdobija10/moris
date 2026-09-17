# moris.eu — analiza i propozycja nowego układu strony

Repozytorium robocze Działu Sprzedaży E-Commerce Moris sp. z o.o.

| Plik | Co zawiera |
|---|---|
| [`ANALIZA.md`](ANALIZA.md) | Odtworzona architektura informacji obecnego serwisu, diagnoza dziesięciu problemów konwersyjnych, propozycja nowego układu strony głównej wraz z uzasadnieniem każdej sekcji, miary skuteczności. |
| [`odwzorowanie/index.html`](odwzorowanie/index.html) | Model strukturalny obecnej strony `moris.eu/pl` z przełącznikiem „Pokaż uwagi UX" — siedem ponumerowanych uwag przypiętych do miejsc, których dotyczą. |
| [`redesign/index.html`](redesign/index.html) | Prototyp nowego układu. Działające: wyszukiwarka parametryczna, konfigurator cięcia z podglądem odpadu, kalkulator masy i ceny z rabatem progowym, szybkie zamówienie z listy. |
| [`redesign/rejestracja.html`](redesign/rejestracja.html) | Ekran rejestracji w dwóch odsłonach: przed podaniem NIP (trzy kroki, dla kogo, dlaczego warto) i po weryfikacji (formularz z danymi z rejestru, kontakt firmowy, przełącznik „inne dane do faktury”, rozdzielone zgody). |
| [`redesign/po-rejestracji.html`](redesign/po-rejestracji.html) | Ekran po rejestracji w dwóch momentach: „potwierdź adres e-mail” i „zamów pierwszy raz”. Zbudowany na zasadzie jeden ekran — jedno działanie: główny przycisk do katalogu, jedna rzecz do dokończenia (adres dostawy), trzy kroki zamówienia i cztery fakty. |
| [`ANALIZA-REJESTRACJA.md`](ANALIZA-REJESTRACJA.md) | Analiza UX ekranu rejestracji na podstawie zrzutów produkcji: 7 usterek krytycznych, 6 wysokiego wpływu, 12 średnich, kolejność wdrożenia, niespójności kontaktowe w serwisie. |
| [`rejestracja/index.html`](rejestracja/index.html) | Drugi prototyp rejestracji, z przełącznikiem „Pokaż uwagi UX”. Działające: weryfikacja sumy kontrolnej NIP, lista krajów sortowana po polsku z filtrowaniem, trzy kroki, żywa walidacja hasła, rozdzielone zgody. **Pokrywa się zakresem z `redesign/rejestracja.html` — do scalenia, patrz „Do rozstrzygnięcia”.** |
| [`ANALIZA-MAILINGI.md`](ANALIZA-MAILINGI.md) | Analiza kodu przekazanych mailingów ExpertSender: 23 usterki z numerami linii, opis czterech nowych kompilacji, lista kontrolna przed wysyłką. |
| [`mailingi/`](mailingi/) | Cztery szablony mailingowe — obsługa platformy, budowanie zaufania, baza produktowa, usługi dodatkowe i transport. Plus `podglad.html` (wszystkie obok siebie) i `build.py` (generator wspólnej ramy). |
| [`brand/`](brand/) | Księga znaku Moris (PDF), jej przepisanie do `BRANDBOOK.md`, tokeny `tokens.css` oraz znak wyciągnięty z księgi jako SVG. Wszystkie prototypy i mailingi korzystają z tego systemu. |

Prototypy i mailingi to samodzielne pliki HTML — wystarczy otworzyć
w przeglądarce, bez budowania i bez zależności. `mailingi/build.py` służy
wyłącznie do regeneracji wspólnej ramy szablonów; jego uruchomienie nie jest
potrzebne, żeby z nich korzystać.

Mailingi przed wysyłką wymagają podmiany dwóch znaczników
(`{{LINK_WYPISU_Z_EXPERTSENDER}}`, `{{ID_KAMPANII}}`) — pełna lista kontrolna
w rozdziale 5 dokumentu `ANALIZA-MAILINGI.md`.

## Do rozstrzygnięcia

W repozytorium stoją **dwa prototypy rejestracji**, zbudowane niezależnie
w dwóch sesjach: `redesign/rejestracja.html` (dwie odsłony, pełny system
wizualny z księgi) oraz `rejestracja/index.html` (trzy kroki, weryfikacja sumy
kontrolnej NIP, przełącznik uwag UX). Zakresy się pokrywają. Decyzja, który
zostaje — albo które elementy przenieść z jednego do drugiego — należy do
właściciela repozytorium; oba działają i oba są opisane wyżej.

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
