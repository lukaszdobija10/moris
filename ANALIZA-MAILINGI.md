# Mailingi Moris — analiza kodu źródłowego i trzy nowe kompilacje

Dokument roboczy Działu Sprzedaży E-Commerce. Zawiera: (1) co realnie jest
w przekazanych plikach, (2) listę usterek kodu z odwołaniem do numerów linii,
(3) rozbieżność z księgą znaku, (4) opis trzech nowych kompilacji,
(5) listę rzeczy do potwierdzenia przed wysyłką.

---

## 1. Co jest w przekazanych plikach

Przekazano trzy pliki. Realnie są to **dwa szablony**:

| Plik | Kampania | Uwaga |
|---|---|---|
| `campaign_source.html` | Powitanie na Platformie MORIS.EU | ID kampanii `154331` |
| `campaign_source_2.html` | **duplikat powyższego** | ID `154332` |
| `campaign_source_1.html` | Obniżka ceny transportu HDS | ID `418601` |

Pierwsze dwa pliki są identyczne **bajt w bajt** — różnią się wyłącznie
podpisanym hashem w linku wypisu i numerem kampanii w pixelu zliczającym.
Sprawdzenie:

```
diff <(sed 's/15433[12]/ID/g' campaign_source.html) \
     <(sed 's/15433[12]/ID/g' campaign_source_2.html)
# jedyna różnica: hash _esuh w linku wypisu
```

Wniosek operacyjny: to nie są dwa warianty do porównania, tylko ten sam
kreatyw wysłany dwukrotnie na dwie listy. Jeżeli intencją był test A/B —
nie odbył się.

### Platforma wysyłkowa

Kod pochodzi z **ExpertSender**: namespace `ems:` (`ems:preheader`,
`ems:deeplink`), atrybuty edycyjne `e-editable` i `e-block-id`, znaczniki
scalania `$uid$`, `$llid$`, `$sid$`, `$launchId$`, domena śledząca
`link.moris.eu`. Nowe kompilacje zachowują wszystkie te konwencje, żeby
dały się wkleić bez przeróbek.

### Warstwa graficzna

Obrazy leżą w dwóch miejscach: `link.moris.eu/custloads/1060954645/`
(wgrane przez ExpertSender) i `bevisible.pl/mailingi/moris-*` (serwer agencji).
Druga lokalizacja jest zależnością zewnętrzną poza kontrolą Moris — jeżeli
agencja wyłączy katalog, logo i ikony znikną we wszystkich wysłanych
mailingach wstecz. **Do przeniesienia na `link.moris.eu`.**

---

## 2. Usterki kodu

Numery linii odnoszą się do plików źródłowych w postaci przekazanej.

### 2.1 Struktura — łamie się w Outlooku

| # | Plik : linia | Problem | Skutek |
|---|---|---|---|
| 1 | `campaign_source` : 156–159 | `<table>` otwarta, zaraz po niej `<td>` **bez `<tr>`** | Outlook (silnik Word) porzuca komórkę albo cały blok; sekcja „Zobacz, co daje Ci korzystanie z Platformy” może nie renderować się w ogóle |
| 2 | `campaign_source` : 186–191 | ta sama konstrukcja — `<td>` bez `<tr>` | jw., blok o warunkach współpracy |
| 3 | `campaign_source` : 151–152 | pusty `<tr>` zamknięty razem z `</table>` | parser to toleruje, ale przy edycji w ESP taki martwy znacznik potrafi „zjeść” kolejny wiersz |
| 4 | `campaign_source` : 194 | `</table></td></tr>` — domknięcia w kolejności odwrotnej do otwarcia | przeglądarka naprawia, Word niekoniecznie |
| 5 | `campaign_source` : 239–243 | **`<a>` zagnieżdżony w `<a>`** oraz `<strong>` w `<strong>` z odwróconym domknięciem | HTML zabroniony; klienty pocztowe rozstrzygają to różnie — link „Hurtownia Stali Online” może być nieklikalny lub odziedziczyć zły kolor |

Walidacja parserem drzewa znaczników (usterki 1, 2 i 5 — pozostałe dwie parser
toleruje, ale silnik Worda nie musi): `campaign_source` — **3 błędy**,
`campaign_source_1` — **0 błędów**. Nowe kompilacje: **0 błędów**
(zestaw testowy w rozdziale 5).

### 2.2 CSS i renderowanie

| # | Plik : linia | Problem | Skutek |
|---|---|---|---|
| 6 | `campaign_source` : 166 | `color: 1a2b3c` — **brak `#`** | deklaracja nieważna, tekst dziedziczy kolor; punkt 1. listy może mieć inny kolor niż punkty 2–4 |
| 7 | `campaign_source` : 278, 280, 281 | `text-wrap: nowrap` | własność nieobsługiwana w klientach pocztowych; poprawnie `white-space:nowrap` (w linii 280 jest obok — czyli autor to wiedział, ale zostawił obie) |
| 8 | `campaign_source` : 280 | `<section>` wewnątrz komórki tabeli | Outlook ignoruje style HTML5-owych bloków; zbędna warstwa |
| 9 | `campaign_source_1` : 177–193 | lista punktowana na `<ul>` | Outlook nadaje `<ul>` własne marginesy; wcięcia rozjadą się względem reszty maila |
| 10 | `campaign_source_1` : 274 | obraz `width="700"` w kontenerze **600 px** | obraz wystaje poza szerokość maila; w Gmailu przeskalowany, w Outlooku przycięty |
| 11 | oba : 137, 274 | `<a>` z atrybutami `src`, `alt`, `altsrc` | atrybuty nie należą do `<a>`; ślad po wklejce z edytora, ignorowane, ale mylą przy edycji |
| 12 | `campaign_source` : 86 | „Jeśli ten e-mail nie wyświetla się poprawnie” z **`href=""`** | link do wersji przeglądarkowej prowadzi donikąd |
| 13 | oba : 1 | brak `<meta name="viewport">` | telefony renderują w trybie desktopowym i skalują — tekst 14 px robi się nieczytelny |
| 14 | oba : 1 | `<html e-locale="en-US">`, brak `lang="pl"` | czytniki ekranu czytają polski tekst angielską fonetyką |
| 15 | oba | brak bloku warunkowego MSO (`PixelsPerInch`) | Outlook na ekranach HiDPI powiększa cały mail o ~1/3 |
| 16 | oba | brak `role="presentation"` na tabelach układu | czytnik ekranu ogłasza „tabela, 12 wierszy” dla każdej ramki layoutu |
| 17 | oba | `alt="Moris"` na wszystkich obrazach, także treściowych | przy zablokowanych obrazach (domyślnie w Outlooku) odbiorca widzi pięć razy słowo „Moris” zamiast treści |
| 18 | oba | brak atrybutów `bgcolor` obok `background-color` w CSS | Outlook potrafi pominąć tła sekcji granatowych |
| 19 | `campaign_source_1` : 138 | `<img width="550">` bez `height` | skok układu w trakcie ładowania |

### 2.3 Treść

| # | Miejsce | Problem |
|---|---|---|
| 20 | `campaign_source` : 85 (preheader) | „na **ternie** całego kraju” → *terenie* |
| 21 | `campaign_source` : 148 | „warunków **wspólpracy**” → *współpracy* |
| 22 | `campaign_source` | mailing powitalny nie ma **żadnego przycisku CTA** — jedyna droga do platformy to link tekstowy w nagłówku i miniatura wideo. Mailing o HDS przycisk ma (linia 286). To najpoważniejszy problem konwersyjny w tym zestawie. |
| 23 | `campaign_source` | brak numeru telefonu w bloku kontaktowym — jest tylko e-mail, mimo że drugi mailing podaje oba |

---

## 3. Rozbieżność z księgą znaku

Mailingi używają palety, której nie ma w księdze znaku Moris:

| Rola | W mailingach | Księga znaku |
|---|---|---|
| Granat | `#1A2B3C` oraz `#1F3855` (dwie różne wartości w dwóch mailingach) | `#156082` / `#0E4258` |
| Tło sekcji | `#E8F1F4`, `#f1f3f5` (dwie wartości) | `#F2F6F8` / `#D9E5EC` |
| Akcent | `#F35E07` i `#FF7517` (dwie wartości) | kolor spoza księgi |
| Link | `#73b7e5` | brak odpowiednika |

Nowe kompilacje przechodzą na paletę z księgi: `#156082`, `#0E4258`, `#12202B`,
`#F2F6F8`, `#D9E5EC`.

Dwie decyzje wymagają akceptacji:

1. **Pomarańcz `#F35E07` zostaje** — wyłącznie jako kolor przycisku i akcentu
   nawigacyjnego, nigdy jako tło bloku ani kolor tekstu ciągłego. Uzasadnienie:
   jest jedynym kolorem w całym systemie, który kontrastuje z granatem na tyle,
   żeby przycisk był widoczny bez obrazków. Alternatywa — przycisk granatowy —
   zlewa się z blokami sekcji.
2. **Krój o stałej szerokości dla danych technicznych** (`Consolas`,
   `Courier New`) — cyfry w tabelach wymiarów i gatunków muszą się wyrównywać
   w kolumnach. To to samo rozszerzenie, które prototyp strony proponuje jako
   JetBrains Mono; w mailu font webowy jest zawodny, więc stosujemy kroje
   systemowe.

---

## 4. Trzy nowe kompilacje

Pliki w katalogu [`mailingi/`](mailingi/). Każdy plik `.html` jest samodzielny —
do wklejenia w ExpertSender bez budowania. Skrypt `build.py` istnieje tylko po to,
żeby wspólna rama (nagłówek, menu, blok kontaktowy, stopka, przycisk) była
w jednym miejscu; jego uruchomienie nie jest potrzebne do użycia szablonów.

### 4.1 `01-obsluga-platformy.html` — obsługa platformy

**Cel:** doprowadzić klienta do pierwszego samodzielnego zamówienia online.

**Co zmienia się względem mailingu powitalnego:**

- ciąg przyczynowo-skutkowy zamiast listy zalet — cztery ponumerowane kroki
  (*znajdź produkt → ustaw długość i ilość → wybierz dostawę → potwierdź*)
  zamiast czterech zdań zaczynających się od „Szybko sprawdzisz”, „Automatycznie
  wyliczysz”. Odbiorca po przeczytaniu wie, co zobaczy na ekranie;
- **przycisk CTA**, którego w oryginale nie było — odporny na Outlooka
  (VML `v:roundrect` + wariant HTML), więc działa także przy zablokowanych obrazkach;
- panel klienta opisany jako cztery karty korzyści, nie jako spis funkcji;
- obietnica ciągłości warunków handlowych (ceny, płatności, transport, opiekun)
  rozbita na cztery punkty zamiast jednego zdania na 24 px — bo to jest zdanie,
  które zdejmuje główny opór przed platformą.

### 4.2 `02-zaufanie.html` — budowanie zaufania

**Cel:** zdjąć ryzyko przed pierwszym zamówieniem — u klienta, który firmy
jeszcze nie zna albo zna ją wyłącznie z kontaktu telefonicznego.

**Konstrukcja:** dowód, nie deklaracja. Kolejno:

1. pas czterech liczb — `1994`, `~4 000`, `>50%`, `20 m`;
2. cztery dowody z uzasadnieniem: ISO 9001:2015, licencjonowany spedytor,
   magazyn automatyczny, udział klientów stałych;
3. **tabela zobowiązań z parametrami** — 3 dni robocze / 5 dni roboczych /
   1 sztuka / cała Polska / 11 m / 7 m i 14 t. Liczba jest sprawdzalna,
   przymiotnik nie;
4. miejsce na opinię klienta — **puste, oznaczone znacznikiem**. Świadomie
   nie wpisano tam nic: cytat referencyjny wolno publikować wyłącznie
   za pisemną zgodą klienta.

### 4.3 `03-baza-produktowa.html` — baza produktowa

**Cel:** pokazać zasięg oferty i wprowadzić do katalogu.

**Konstrukcja:**

1. dwa światy produktowe jako osobne wejścia — wyroby hutnicze i kolej,
   każdy z własnym linkiem do kategorii;
2. tabela gatunków na stanie z przypisanym zastosowaniem — S235JR, S235JRH,
   S355J2, S355J2+N, S355J2H. Kupujący szuka gatunku, nie nazwy kategorii;
3. dwie przykładowe pozycje z realnym zapisem indeksu
   (`fi 90 S355J2+N L=6 m`, `49E1 R260 L=12 m`) — pokazują, jak wygląda opis
   produktu, zanim ktokolwiek kliknie;
4. sekcja cięcia na wymiar na granatowym tle, na końcu — odpowiedź na
   najczęstszy powód rezygnacji: „nie ma mojego wymiaru”.

### 4.4 Wspólna warstwa techniczna

Wszystkie trzy pliki:

- 600 px, tabele z `role="presentation"`, komórki z `bgcolor` obok CSS;
- `lang="pl"`, `viewport`, `x-apple-disable-message-reformatting`,
  blok warunkowy MSO z `PixelsPerInch` (usuwa powiększanie w Outlooku HiDPI);
- responsywność przez `td.stack` — dwie kolumny składają się do jednej poniżej
  600 px; menu rozkłada się na cztery wiersze;
- **zero obrazów treściowych** — nagłówki, liczby, karty i tabele są
  tekstem. Mail czyta się w całości przy domyślnie zablokowanych obrazkach
  w Outlooku. Obrazy pozostają tylko na logo i dwóch ikonach kontaktu,
  z opisowym `alt`;
- przyciski bulletproof (VML dla Outlooka, HTML dla reszty) — bez plików PNG,
  więc zmiana treści przycisku nie wymaga grafika;
- preheader + blok znaków wypełniających, żeby skrzynka nie doklejała
  do podglądu początku stopki;
- `e-editable` na każdym bloku tekstowym i `e-block-id` na każdej sekcji —
  redakcja w ExpertSender bez wchodzenia w kod.

---

## 5. Zanim wyślesz — lista kontrolna

**Musi być podmienione:**

1. `{{LINK_WYPISU_Z_EXPERTSENDER}}` w stopce — ExpertSender generuje podpisany
   link per kampania; nie da się go wygenerować poza systemem. Wstaw przez
   funkcję wypisu w edytorze albo skopiuj z bieżącej kampanii.
2. `{{ID_KAMPANII}}` w adresie pixela zliczającego (ostatnia linia pliku).
3. W `02-zaufanie.html` — blok `moris-opinia`: uzupełnić cytatem za pisemną
   zgodą klienta **albo usunąć cały blok**. Nie wysyłać ze znacznikiem.

**Do potwierdzenia w danych źródłowych:**

| Element | Gdzie | Status |
|---|---|---|
| `/pl/login`, `/pl/about-us`, `/pl/why-we`, `/pl/cutting-service`, `/pl/delivery` | wszystkie trzy mailingi | adresy odtworzone z indeksu wyszukiwarki (patrz `ANALIZA.md`, rozdz. 1) — **sprawdzić, czy odpowiadają na 200** |
| „ISO 9001:2015”, „licencjonowany spedytor”, „>50% obrotu z klientami stałymi”, „magazyn 20 m”, „~4 000 indeksów” | `02-zaufanie.html` | dane z publikacji branżowych i profili firmowych, nie z dokumentów spółki — **potwierdzić przed użyciem jako obietnica handlowa** |
| „dokumenty jakościowe wyrobu do każdej dostawy” | `02-zaufanie.html`, karta ISO | sformułowanie ogólne — **doprecyzować, jaki dokument faktycznie towarzyszy dostawie** |
| Terminy 3 / 5 dni roboczych, HDS 11 m / 7 m / 14 t | `02` i `03` | pochodzą z `campaign_source_1.html` i z `ANALIZA.md` — sprawdzić aktualność |
| Rok założenia 1994 → „trzydzieści lat” | `02-zaufanie.html`, lead | przy wysyłce w 2026 r. poprawić na „ponad trzydzieści lat” |

**Testy techniczne przed wysyłką:**

- test renderowania: Outlook 2016/2019 (Windows), Outlook.com, Gmail web,
  Gmail Android, Apple Mail iOS, Thunderbird;
- test z **zablokowanymi obrazkami** — mail ma być w całości czytelny;
- kontrola drzewa znaczników (zestaw z rozdz. 2.1). Wynik oczekiwany: 0 błędów;
- test szerokości: żaden element nie może przekraczać 600 px (usterka nr 10).

**Naprawy do wykonania w istniejących szablonach**, jeżeli będą wysyłane dalej:
usterki 1, 2, 5, 6, 10, 12, 13 z rozdziału 2 — pozostałe są kosmetyczne,
te siedem albo psuje układ, albo prowadzi donikąd.
