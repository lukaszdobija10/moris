# moris.eu/pl — analiza strony i propozycja nowego układu

Dokument roboczy dla Działu Sprzedaży E-Commerce. Zawiera: (1) zastrzeżenie
metodyczne, (2) odtworzoną architekturę informacji obecnego serwisu, (3) diagnozę,
(4) propozycję nowego układu strony głównej, (5) miary skuteczności.

---

## 1. Zastrzeżenie metodyczne — jak powstała ta analiza

Sesja robocza działa za firmowym proxy, które **blokuje ruch wychodzący do
`moris.eu` (403 na CONNECT)**. Nie udało się pobrać żywego kodu strony ani zrzutów
ekranu. Analizę zbudowano na źródłach zastępczych:

- indeks wyszukiwarki dla domeny `moris.eu` (tytuły, adresy i opisy podstron —
  pozwalają odtworzyć architekturę informacji i większość komunikatów);
- publikacje branżowe o platformie (Inwestycje.pl, Automatyka.pl, Nowoczesny
  Przemysł, AO Biznes, narzedziownia.org);
- profil firmowy LinkedIn / Facebook Moris;
- księga znaku Moris (paleta, typografia, ton komunikacji).

**Konsekwencja:** warstwa treści i struktury jest odtworzona rzetelnie, natomiast
detale wizualne obecnej strony (dokładne proporcje, zdjęcia, mikrokopia przycisków)
są rekonstrukcją, nie kopią 1:1. Plik `odwzorowanie/index.html` należy czytać jako
**model strukturalny**, nie jako zrzut produkcji. Po odblokowaniu domeny albo po
przekazaniu HTML-a strony rekonstrukcję można doprecyzować w godzinę.

---

## 2. Odtworzona architektura informacji

### 2.1 Mapa serwisu

| Obszar | Adresy | Rola |
|---|---|---|
| Strona główna | `/pl/` | wizytówka + wejście do katalogu |
| Katalog zbiorczy | `/pl/wszystkie-produkty/c/catalogue` | pełna lista indeksów |
| Wyroby hutnicze | `/pl/stal/c/STEEL` + podkategorie (`/plaskowniki/c/FLAT`, `/prety-okragle/c/ROUND`, …) | świat produktowy nr 1 |
| Kolej | `/pl/kolej`, `/pl/kolej/akcesoria-kolejowe/c/ACCESORIES` | świat produktowy nr 2 |
| Karta produktu | `/pl/product/{id}/{slug}` | np. „Pręt okrągły fi 90 S355J2+N L=6 m" |
| Usługi | `/pl/cutting-service`, `/pl/delivery`, płatności | cięcie, dostawa, płatność |
| Firma | `/pl/about-us`, `/pl/why-we`, `/pl/contact-us`, `/pl/faq-page` | treści statyczne |
| Treści | `/pl/blog` | SEO / content marketing |
| Formalne | `/pl/terms-and-conditions`, polityki | regulamin |
| Konto | rejestracja, logowanie, koszyk | strefa B2B |
| Języki | `/pl/`, `/en/`, (CZ, SK; zapowiadane LT, LV, EE, HU) | rynki |

### 2.2 Sekcje strony głównej (kolejność odtworzona)

1. Pasek użytkowy — telefon BOK, wybór języka, logowanie / rejestracja, koszyk.
2. Nagłówek — logo, menu kategorii, wyszukiwarka tekstowa.
3. Hero — hasło „Tysiące produktów stalowych dla dużych i małych firm",
   zdjęcie magazynu, przycisk do katalogu / rejestracji.
4. Dwa kafle światów produktowych: **Wyroby hutnicze** i **Kolej**.
5. Pas przewag — magazyn automatyczny, dostawa w całej Polsce, cięcie na wymiar,
   zamówienia 24/7.
6. „Dlaczego my" — doświadczenie od 1994 r., ponad 50% klientów stałych,
   ISO 9001:2015, licencjonowany spedytor (samochód + kolej, cała Europa).
7. Usługa cięcia — cięcie 90°, cięcie transportowe (podział na 2–6 części).
8. Dostawa — 3 dni robocze dla wyrobów standardowych, 5 dni dla ciętych na wymiar,
   rozładunek HDS, zasięg żurawia do 11 m, wyroby do 7 m.
9. Płatności — Autopay, BLIK, Apple Pay, Google Pay, karta, przelew z proformy.
10. Blog / aktualności.
11. Stopka — dane spółki (ul. Wiejska 27, 41-503 Chorzów; BOK 32 416 36 99;
    info@moris.eu; pn–pt 8:00–16:00), linki formalne, kanały social.

### 2.3 Rdzeń oferty (to, co strona faktycznie sprzedaje)

- ok. **4 000 indeksów** dostępnych z magazynu automatycznego wysokiego składowania
  (ok. 20 m, integracja z systemami IT i maszynami tnącymi);
- **wyroby hutnicze**: pręty okrągłe, sześciokąty ciągnione, płaskowniki
  (ciągnione, walcowane, szerokie), kątowniki, ceowniki (U, UPE, UPN),
  dwuteowniki, teowniki, profile zamknięte kwadratowe i prostokątne, rury, blachy —
  gatunki S235JR, S235JRH, S355J2, S355J2+N, S355J2H;
- **kolej**: szyny transportowe, dźwignicowe, tramwajowe, lekkie (np. 49E1 R260 12 m)
  oraz akcesoria kolejowe;
- **cięcie na wymiar** i cięcie transportowe;
- **sprzedaż od 1 sztuki**, wycena natychmiastowa, rabaty rosnące z wielkością
  zamówienia, wybór terminu i formy dostawy w czasie rzeczywistym.

---

## 3. Diagnoza — co obecny układ robi dobrze, a co kosztuje sprzedaż

### Mocne strony

- Jasny podział na dwa światy produktowe (hutnictwo / kolej) — to realna oś
  segmentacji klienta, nie sztuczna kategoria.
- Wiarygodność jest udokumentowana konkretem: rok 1994, ISO 9001:2015, licencja
  spedytora, wysokość magazynu, terminy w dniach roboczych.
- Pełny stos płatności online w B2B (Autopay, BLIK, Apple Pay) — rzadkość w branży.

### Słabe punkty (uporządkowane wg wpływu na konwersję)

| # | Problem | Skutek | Waga |
|---|---|---|---|
| 1 | Strona główna jest **wizytówką**, nie ladą sklepową. Pierwszy ekran zajmuje hasło i zdjęcie, a nie narzędzie wyboru wyrobu. | Klient, który wie czego chce (większość w B2B), musi przeklikać 3–4 ekrany do produktu. | krytyczna |
| 2 | Brak **wyszukiwarki parametrycznej** (typ wyrobu → gatunek → wymiar → długość) na pierwszym ekranie. Wyszukiwarka tekstowa nie odpowiada sposobowi, w jaki technolog nazywa wyrób. | Porzucenia na etapie szukania; ruch ucieka do konkurencji z konfiguratorem. | krytyczna |
| 3 | **Cena i dostępność za rejestracją.** Brak nawet ceny orientacyjnej dla niezalogowanych. | Odcięta konwersja nowego klienta i utracony ruch SEO na frazy „cena pręta …". | wysoka |
| 4 | **Za dużo stron statycznych** o firmie („O nas", „Dlaczego my", FAQ) przy zbyt małej liczbie ścieżek do katalogu. Przewagi rozproszone na 4 podstrony. | Rozmyty przekaz, długa ścieżka, słaby link juice do kategorii. | wysoka |
| 5 | **Cięcie jako podstrona informacyjna**, a nie narzędzie w ścieżce zakupu. To najmocniejszy wyróżnik Moris — pokazany biernie. | Wyróżnik nie pracuje na decyzję zakupową. | wysoka |
| 6 | Brak **kalkulatora masy i ceny** oraz przeliczenia mb ↔ kg ↔ szt. na etapie przeglądania. | Klient liczy w Excelu, czyli poza serwisem. | średnia |
| 7 | Brak **szybkiego zamówienia** (wklejenie listy indeksów, import CSV, powtórzenie poprzedniego zamówienia, listy zakupowe). To standard zakupów powtarzalnych w B2B. | Stały klient nie ma ścieżki „na skróty" — wraca do maila i telefonu do handlowca. | wysoka |
| 8 | **Termin dostawy i dostępność nie są widoczne przy produkcie** na poziomie listy. | Najczęstsze pytanie do BOK; zbędny koszt obsługi. | średnia |
| 9 | Progi rabatowe opisane słownie („rabat rośnie z wielkością zamówienia") zamiast **tabelą progów**. | Brak bodźca do zwiększenia koszyka. | średnia |
| 10 | Stopka nie pracuje na SEO — brak rozpisanych kategorii i gatunków stali. | Utrata długiego ogona fraz. | średnia |

---

## 4. Propozycja nowego układu strony głównej

### 4.1 Zasada naczelna

**Strona główna przestaje być broszurą, a staje się ladą sklepową.**
Pierwszy ekran musi umożliwiać złożenie zamówienia, nie opowiadać o firmie.
Historia firmy zostaje — ale poniżej narzędzia, w roli dowodu, nie wstępu.

### 4.2 Kolejność sekcji (i uzasadnienie każdej)

| # | Sekcja | Zadanie | Dlaczego tutaj |
|---|---|---|---|
| 1 | Pasek użytkowy | BOK, godziny, język (PL/EN/CZ/SK), status zamówienia, konto | Klient B2B często wraca po status, nie po zakup |
| 2 | Nagłówek przyklejony + mega-menu | katalog zawsze pod ręką, koszyk widoczny | Skraca ścieżkę z każdego miejsca strony |
| 3 | **Hero = wyszukiwarka parametryczna** | wyrób → gatunek → wymiar → długość → „Pokaż dostępne" | Odwzorowuje sposób, w jaki klient nazywa potrzebę |
| 4 | Pas dowodów (5 liczb) | 1994, ISO 9001:2015, ~4 000 indeksów, magazyn 20 m, 3 dni robocze | Wiarygodność bez osobnej podstrony |
| 5 | Dwa światy + siatka kategorii z rysunkami przekrojów | wejście do katalogu jednym kliknięciem | Ikona przekroju jest szybciej rozpoznawana niż nazwa |
| 6 | **Konfigurator cięcia** (interaktywny) | podział sztuki 6 m na odcinki, podgląd odpadu i kosztu | Przenosi wyróżnik z opisu do działania |
| 7 | **Kalkulator masy i ceny** | mb ↔ kg ↔ szt., wycena orientacyjna bez logowania | Zdejmuje pracę z Excela i z BOK |
| 8 | **Szybkie zamówienie** | wklej listę / CSV / powtórz zamówienie / listy zakupowe | Ścieżka dla klienta powracającego |
| 9 | Progi rabatowe — tabela | pokazanie progu, do którego brakuje X ton | Podnosi średnią wartość koszyka |
| 10 | Dostawa i płatność | 3 dni / 5 dni, HDS do 11 m, wyroby do 7 m, Autopay/BLIK/Apple Pay/proforma | Usuwa dwie najczęstsze obiekcje przed koszykiem |
| 11 | Dla stałych klientów | limit kredytowy (opt-in), kokpit, opiekun handlowy | Segment o najwyższej marży |
| 12 | Baza wiedzy (blog) | dobór gatunku, tolerancje, normy | Długi ogon SEO + kompetencja |
| 13 | Stopka rozbudowana | kategorie, gatunki, usługi, dane spółki, ISO, płatności | SEO + formalności |

Znikają jako osobne pozycje w menu: „Dlaczego my" (wchodzi w pas dowodów i sekcję
11) oraz „O nas" (skrót w stopce + jedna podstrona dla przetargów i rekrutacji).

### 4.3 Decyzje projektowe

System wizualny pochodzi z księgi znaku (`brand/moris-logo-manual.pdf`).
Pełne przepisanie: `brand/BRANDBOOK.md`, wartości wykonawcze: `brand/tokens.css`.

- **Znak.** Symbol i oba logotypy wyciągnięte z księgi jako krzywe i zapisane
  w SVG (`brand/moris-symbol.svg`, `moris-logo-poziomy.svg`, `moris-logo-pionowy.svg`).
  To geometria z księgi, nie przerysowanie. Wypełnienie ustawione na
  `currentColor`, więc znak działa granatowy i w kontrze na białą bez drugiego pliku.
- **Kolorystyka.** Steel blue `#1A2B3C` (RAL 5011) niesie tekst i ciemne
  powierzchnie. Sapphire blue `#1F3855` (RAL 5003) jest kolorem działania:
  przyciski, odnośniki, ramki pól aktywnych. Pastel blue `#73B7E5` (RAL 5024)
  i jego 30% rozbicie są tłem sekcji i znaczników. Luminous Orange `#FF7517`
  (RAL 2007) zostaje akcentem wyróżniającym jeden element — nigdy kilkanaście.
- **Kolory informacyjne (UI)** z księgi: `#47C98B` potwierdzenie, `#F95050` błąd,
  `#FFE97D` ostrzeżenie — użyte tak, jak księga je pokazuje, czyli w rozbiciach
  30% jako tło znacznika. Tekst w znaczniku zostaje w kolorze Steel blue: same
  kolory UI mają na bieli kontrast poniżej progu czytelności.
- **Typografia.** Display — Paralucent Extra Light (nagłówek pierwszego ekranu,
  duże liczby w pasie dowodów, dokładnie ta rola, w której księga pokazuje „02”).
  Nagłówki sekcji — Paralucent Medium. Tekst — Poppins Regular. Paralucent jest
  krojem komercyjnym i nie jest hostowany na Google Fonts; w prototypach stoi
  pierwszy w stosie, zapasem jest Poppins w wagach 200 i 500. Po wykupieniu
  licencji webfont wystarczy dograć pliki, bez zmian w kodzie.
- **Dane liczbowe.** Księga wskazuje na cyfry Paralucent Stencil Extra Light.
  To krój ekspozycyjny — świetny w liczbie wyróżnikowej, nieczytelny w tabeli
  cen. Tabele i wyceny składamy Poppinsem z `font-variant-numeric: tabular-nums`,
  żeby cyfry wyrównywały się w kolumnach.
- **Trzy tokeny pochodne**, których księga nie definiuje, bo dotyczą tylko
  interfejsu: `--muted #5F6E75` (Telegrey 2 przyciemniony — oryginał daje na
  bieli 3,3:1, poniżej WCAG AA dla tekstu ciągłego), `--line-soft #DCE6EA`
  (delikatne linie wewnętrzne) oraz warianty kolorów UI do tekstu przy polach
  formularza. Wszystkie opisane w `brand/BRANDBOOK.md` i wymagają akceptacji.
- **Język wizualny**: rysunek techniczny. Przekroje profili jako grafiki
  wektorowe, linie wymiarowe jako separatory sekcji, delikatna siatka
  milimetrowa w tle pierwszego ekranu. Zamiast zdjęć stockowych — geometria
  wyrobu, którą klient rozpoznaje zawodowo.
- **Dostępność**: kontrast tekstu ≥ 4,5:1, widoczny stan focus,
  `prefers-reduced-motion`, tabele przewijane poziomo we własnym kontenerze.

### 4.4 Rejestracja konta B2B — przebudowa formularza

Prototyp: `redesign/rejestracja.html`.

Obecny formularz prosi o NIP, po czym pokazuje pobrany adres rejestracyjny firmy,
dane użytkownika i blok zgód. Trzy rzeczy w nim brakują lub działają wbrew
sposobowi, w jaki kupuje firma.

**A. Dane firmy pobierane z rejestru — dopowiedzenie tego, co już jest**

Adres rejestracyjny już się zaciąga. Warto pokazać wprost, skąd: **CEIDG** dla
jednoosobowej działalności, **KRS** dla spółek, **GUS/REGON** jako uzupełnienie
oraz **biała lista VAT** jako status podatnika. To nie jest kosmetyka — status na
białej liście przesądza o sposobie rozliczenia płatności, a klient powinien go
zobaczyć przed założeniem konta, nie przy pierwszej fakturze.

Trzy poprawki wykonawcze:

- **Walidacja sumy kontrolnej NIP przed odpytaniem rejestru.** Dziesięć cyfr
  i algorytm wagowy — koszt zerowy, a odsiewa literówki, zanim klient zobaczy
  komunikat „nie znaleziono firmy" i uzna, że platforma nie działa.
- **Karta danych z rejestru zamiast surowego adresu**: nazwa, NIP i REGON, adres,
  forma prawna, znacznik źródła, znacznik VAT, data i godzina pobrania.
- **Ścieżka korekty ręcznej.** Rejestry bywają nieaktualne. Poprawione dane
  kierują konto do weryfikacji BOK zamiast blokować rejestrację.

**B. Kontakt do firmy — sekcja, której nie ma**

Obecny formularz zbiera wyłącznie dane osoby zakładającej konto. To błąd
strukturalny: **faktura, dokument WZ i potwierdzenie dostawy adresowane są do
firmy, nie do osoby**. Kiedy pracownik zaopatrzenia zmienia stanowisko lub
firmę, dokumenty przestają docierać, a odzyskanie konta staje się sprawą dla BOK.

Nowe pola:

| Pole | Status | Do czego służy |
|---|---|---|
| E-mail firmowy do dokumentów | wymagane | faktury, WZ, potwierdzenia terminów |
| Telefon firmowy | wymagane | kontakt kierowcy przy dostawie i rozładunku HDS |
| Dodatkowy e-mail | opcjonalne | kopia dla księgowości lub zaopatrzenia |
| Strona www | opcjonalne | skraca weryfikację nowego kontrahenta |

**C. „Czy inne dane do faktury?" — pole wyboru rozwijające sekcję**

Domyślnie fakturujemy na dane z rejestru. Jedno pole wyboru rozwija dane nabywcy:
NIP (walidowany tak samo jak główny, z podpowiedzią nazwy z rejestru), nazwa,
adres, e-mail do e-faktur. Wewnątrz — drugie pole wyboru: **odbiorca towaru inny
niż nabywca**, czyli dostawa na budowę albo do oddziału przy fakturze na centralę.

To najczęstszy powód, dla którego zamówienie B2B kończy się telefonem do
handlowca zamiast w koszyku. Rozwiązanie kosztuje jedno pole wyboru.

**D. Dwie odsłony jednego ekranu**

Ekran rejestracji ma dwa zadania, które stoją ze sobą w sprzeczności: **przekonać**
firmę, która trafiła tu pierwszy raz, i **nie przeszkadzać** tej, która już
zdecydowała. Obecny formularz robi tylko to drugie — otwiera się pytaniem o NIP,
bez słowa o tym, dla kogo jest Moris i co klient z tego ma.

Rozwiązanie: jeden adres, dwie odsłony przełączane momentem podania NIP.

| | Przed podaniem NIP | Po weryfikacji NIP |
|---|---|---|
| Zadanie ekranu | przekonać i wytłumaczyć | doprowadzić do końca |
| Formularz | kompaktowa karta, tylko kraj i NIP | pełny, na całą szerokość |
| Treść wokół | dla kogo, dlaczego warto, potrzebne kroki, pytania | pasek postępu, co zostało, kontakt do BOK |
| Nagłówek | „Stal zamawiasz sam, kiedy jej potrzebujesz." | „Zostały dwa kroki." |

**Dla kogo** — sześć typowych sytuacji zakupowych zamiast listy branż: produkcja
i warsztat, budownictwo, utrzymanie ruchu, kolej, handel i odsprzedaż, dział
zakupów. Każda z jednym zdaniem, które klient rozpozna jako swoje („biorę sześć
prętów, nie całą wiązkę"). Do tego jawnie powiedziane, kogo Moris **jeszcze** nie
obsługuje — konto zakłada się na NIP, więc klient indywidualny dowiaduje się tego
od razu, a nie po wypełnieniu połowy formularza.

**Dlaczego warto** — sześć konkretów z liczbą zamiast przymiotników: wycena
w 0 minut, zamówienia 24/7, sprzedaż od 1 sztuki, cięcie 90°, termin 3 dni znany
przed zapłatą, rabat −7% naliczany automatycznie. Pod spodem pasek wiarygodności:
1994, ISO 9001:2015, magazyn 20 m, ~4 000 indeksów, licencjonowany spedytor.

**Potrzebne kroki** — trzy kroki z czasem przy każdym (30 s / 2 min / 30 s) oraz
sekcja **„czego nie potrzebujesz"**: skanów dokumentów, umowy ramowej, wniosku
o limit kredytowy. To najskuteczniejsza część takiego ekranu — zdejmuje obawę,
że rejestracja w hurtowni stali oznacza papierologię i tydzień oczekiwania.

Po podaniu NIP treść sprzedażowa znika. Zostaje pasek postępu, formularz i trzy
kafle pomocy z boku, a na dole wąski pas z trzema wartościami — żeby argument
nie wyparował całkowicie, ale też nie konkurował z polami do wypełnienia.

**D. Dwie poprawki przy okazji**

- **Wymagania hasła jako lista warunków zapalających się na zielono**, zamiast
  zdania „min. 6 znaków, w tym 1 wielka litera, 1 cyfra i 1 symbol". Przy okazji
  minimum warto podnieść z 6 do 8 znaków — sześć znaków to dziś próg poniżej
  przyjętej praktyki.
- **Rozdzielenie zgód wymaganych od marketingowych.** Obecne pole „Zaznacz
  wszystkie zgody" zaznacza jednym kliknięciem także zgody marketingowe. Zgoda
  marketingowa musi być dobrowolna i odrębna — zbiorcze zaznaczenie osłabia jej
  ważność. W prototypie przycisk zaznacza wyłącznie zgody konieczne do założenia
  konta, a zgody dobrowolne stoją w osobnej grupie z wyraźnym oznaczeniem.

### 4.5 Co zmienia się poza stroną główną (rekomendacje dalszych kroków)

1. **Karta produktu**: cena orientacyjna bez logowania, dostępność w sztukach,
   deklarowany termin, kalkulator cięcia na miejscu, plik z atestem/deklaracją.
2. **Lista kategorii**: filtry po gatunku, wymiarze, długości i dostępności;
   sortowanie po cenie za kg i za mb.
3. **Konto**: powtórzenie zamówienia, listy zakupowe, koszyki zespołowe,
   faktury i WZ do pobrania, limit kredytowy jako świadome opt-in.
4. **SEO**: strony gatunków (S235JR, S355J2+N) i strony zastosowań jako osobne
   punkty wejścia dla długiego ogona.

---

## 5. Miary skuteczności (do pomiaru przed / po)

| Miara | Punkt odniesienia | Cel po wdrożeniu |
|---|---|---|
| Udział sesji, które kończą się wejściem na kartę produktu | do ustalenia z GA4 | +30% |
| Liczba kroków od wejścia do dodania do koszyka | 4–5 | 2 |
| Konwersja rejestracji z ruchu organicznego | do ustalenia | +25% |
| Średnia wartość zamówienia (wpływ progów rabatowych) | do ustalenia | +10% |
| Udział zamówień powracających złożonych bez kontaktu z BOK | do ustalenia | +40% |
| Liczba zapytań do BOK o termin i dostępność | do ustalenia | −50% |

---

## 6. Pliki w repozytorium

| Plik | Zawartość |
|---|---|
| `ANALIZA.md` | ten dokument |
| `odwzorowanie/index.html` | model strukturalny obecnej strony + nakładka z uwagami UX |
| `redesign/index.html` | propozycja nowego układu strony głównej, działający prototyp |
| `redesign/rejestracja.html` | przebudowany formularz rejestracji konta B2B |
| `brand/` | księga znaku (PDF), jej przepisanie, tokeny CSS i znak w SVG |

Prototypy są samodzielnymi plikami HTML — wystarczy otworzyć je w przeglądarce.
