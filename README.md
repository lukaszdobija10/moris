# moris.eu — analiza i propozycja nowego układu strony

Repozytorium robocze Działu Sprzedaży E-Commerce Moris sp. z o.o.

| Plik | Co zawiera |
|---|---|
| [`ANALIZA.md`](ANALIZA.md) | Odtworzona architektura informacji obecnego serwisu, diagnoza dziesięciu problemów konwersyjnych, propozycja nowego układu strony głównej wraz z uzasadnieniem każdej sekcji, miary skuteczności. |
| [`odwzorowanie/index.html`](odwzorowanie/index.html) | Model strukturalny obecnej strony `moris.eu/pl` z przełącznikiem „Pokaż uwagi UX" — siedem ponumerowanych uwag przypiętych do miejsc, których dotyczą. |
| [`redesign/index.html`](redesign/index.html) | Prototyp nowego układu. Działające: wyszukiwarka parametryczna, konfigurator cięcia z podglądem odpadu, kalkulator masy i ceny z rabatem progowym, szybkie zamówienie z listy. |
| [`ANALIZA-MAILINGI.md`](ANALIZA-MAILINGI.md) | Analiza kodu przekazanych mailingów ExpertSender: 23 usterki z numerami linii, rozbieżność palety z księgą znaku, opis czterech nowych kompilacji, lista kontrolna przed wysyłką. |
| [`mailingi/`](mailingi/) | Cztery szablony mailingowe — obsługa platformy, budowanie zaufania, baza produktowa, usługi dodatkowe i transport. Plus `podglad.html` (wszystkie obok siebie) i `build.py` (generator wspólnej ramy). |

Prototypy i mailingi to samodzielne pliki HTML — wystarczy otworzyć
w przeglądarce, bez budowania i bez zależności. `mailingi/build.py` służy
wyłącznie do regeneracji wspólnej ramy szablonów; jego uruchomienie nie jest
potrzebne, żeby z nich korzystać.

Mailingi przed wysyłką wymagają podmiany dwóch znaczników
(`{{LINK_WYPISU_Z_EXPERTSENDER}}`, `{{ID_KAMPANII}}`) — pełna lista kontrolna
w rozdziale 5 dokumentu `ANALIZA-MAILINGI.md`.

## Zastrzeżenie

Sesja robocza działała za firmowym proxy blokującym ruch do `moris.eu` (403).
Struktura i treść zostały odtworzone z indeksu wyszukiwarki dla domeny,
publikacji branżowych i profili firmowych — szczegóły metodyki w rozdziale 1
dokumentu `ANALIZA.md`. Odwzorowanie należy traktować jako model strukturalny,
nie kopię 1:1.

## System wizualny

Paleta i typografia wg księgi znaku Moris: granat `#156082`, granat ciemny
`#0E4258`, grafit `#12202B`, błękity `#F2F6F8` / `#D9E5EC`, krój Arial.
Zieleń, bursztyn i czerwień użyte wyłącznie jako kolory funkcyjne (dostępność,
termin, ostrzeżenie) — zgodnie z zasadą kolorów funkcyjnych z księgi.

Prototyp nowego układu proponuje jedno rozszerzenie księgi: krój o stałej
szerokości (JetBrains Mono) dla danych technicznych — wymiarów, gatunków,
indeksów i cen. Uzasadnienie: cyfry w kolumnach tabel wyrobów muszą się
wyrównywać. To decyzja funkcjonalna, nie ozdobna, i wymaga akceptacji.
