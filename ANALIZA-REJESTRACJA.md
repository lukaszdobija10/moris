# moris.eu/pl — ekran rejestracji: analiza UX i propozycja zmian

Dokument roboczy Działu Sprzedaży E-Commerce. Podstawa: dwa zrzuty ekranu
formularza rejestracji — stan początkowy z rozwiniętą listą krajów oraz stan
po weryfikacji NIP. Prototyp proponowanego rozwiązania:
[`rejestracja/index.html`](rejestracja/index.html).

Usterki ponumerowano i uszeregowano według wpływu na konwersję, nie według
kolejności na ekranie. Przy każdej podano proponowaną zmianę.

---

## 1. Kontekst — dlaczego ten ekran jest wąskim gardłem

Rejestracja na moris.eu jest **bramą do wszystkiego**: bez konta klient nie widzi
swoich cen, nie sprawdzi kosztu dostawy, nie złoży zamówienia. Każdy punkt tarcia
tutaj kosztuje nie jedną transakcję, tylko cały przyszły przychód z tego klienta.

Jednocześnie jest to ekran o **najwyższym naturalnym poziomie wątpliwości**:
odbiorca ma podać NIP firmy, dane osobowe, numer telefonu i wyrazić trzy zgody,
zanim cokolwiek zobaczy. W obecnej wersji dostaje w zamian puste pole
i nagłówek „Rejestracja”.

---

## 2. Usterki krytyczne

### K1. Zero uzasadnienia wartości na całym ekranie

**Stan:** strona nie mówi ani słowa o tym, co klient dostaje po rejestracji.
Nagłówek „Rejestracja”, pod nim pole NIP. Cała komunikacja o korzyściach
(ceny w swoich warunkach, stany magazynowe, koszt dostawy, cięcie na wymiar)
została na stronie głównej i w mailingach — czyli **przed** decyzją, a nie
w momencie jej podejmowania.

**Skutek:** klient, który trafił tu z linku w mailu albo z wyszukiwarki,
podejmuje decyzję o podaniu danych firmowych bez żadnej przesłanki.

**Zmiana:** stała kolumna boczna z pięcioma konkretami — co konkretnie
odblokowuje konto. Widoczna na każdym kroku, także po przewinięciu.

### K2. Nie wiadomo, co się stanie po kliknięciu „Zarejestruj”

**Stan:** brak jakiejkolwiek informacji o tym, co następuje po wysłaniu formularza.
Czy konto jest aktywne od razu? Czy przyjdzie mail weryfikacyjny? Czy handlowiec
musi je zaakceptować? Czy ceny pojawią się natychmiast?

**Skutek:** to jest największa niewiadoma w rejestracji B2B. Klient, który
podejrzewa, że będzie czekał na akceptację, odkłada rejestrację „na później”.

**Zmiana:** oś czasu w kolumnie bocznej — cztery kroki od założenia konta do
pierwszego zamówienia, z czasem przy każdym. Plus zdanie pod przyciskiem:
kiedy dokładnie konto działa i kiedy pojawiają się warunki handlowe.
**Do uzupełnienia rzeczywistymi wartościami — w prototypie stoi znacznik.**

### K3. Lista krajów posortowana po kodzie ISO przy polskich nazwach

**Stan:** kolejność na zrzucie to Bułgaria, Belgia, Czechy, Niemcy, Dania, Estonia —
czyli BG, BE, CZ, DE, DK, EE. Lista jest posortowana po **kodzie kraju**,
a wyświetla **polskie nazwy**.

**Skutek:** alfabetyczne szukanie nie działa. Użytkownik szukający Niemiec przewija
listę w poszukiwaniu litery N i nie znajduje jej, bo Niemcy stoją przy D.
Dodatkowo **Polska nie jest na górze**, mimo że to główny rynek — trzeba przewinąć
przez większość listy do litery P (a faktycznie do PL, gdzieś za Maltą).

**Zmiana:** sortowanie polskim porządkiem alfabetycznym (`Intl.Collator("pl")`),
Polska przypięta na górze, pole z filtrowaniem po wpisaniu liter, obsługa klawiatury.

### K4. Brak wartości domyślnej kraju

**Stan:** pole „Wybierz kraj” jest puste, mimo że interfejs jest ustawiony na
język polski i walutę PLN.

**Skutek:** jedno zbędne kliknięcie i jedna zbędna decyzja dla większości ruchu.

**Zmiana:** Polska ustawiona domyślnie. Zmiana kraju pozostaje jednym kliknięciem.

### K5. Wymagania hasła: jednocześnie za słabe i za uciążliwe

**Stan:** „min. 6 znaków, w tym 1 wielka litera, 1 cyfra i 1 symbol”.

**Skutek podwójny.** Sześć znaków to za mało jak na konto z dostępem do warunków
handlowych i historii zamówień. Wymuszony **znak specjalny** to natomiast jedna
z najczęstszych przyczyn porzucenia rejestracji — użytkownik wpisuje hasło,
dostaje odrzucenie, wpisuje drugie, znowu odrzucenie. NIST odradza wymuszanie
klas znaków od 2017 r. (SP 800-63B) właśnie dlatego, że podnosi porzucenia,
a nie podnosi realnego bezpieczeństwa.

**Zmiana:** minimum 10 znaków, mała i wielka litera, cyfra — bez wymuszania
symbolu. Reguły jako lista odhaczana **na żywo** przy pisaniu, nie jako statyczny
tekst pod polem. Wskaźnik siły hasła.

### K6. Brak podglądu hasła, przy jednoczesnym „Powtórz hasło”

**Stan:** hasło wpisywane na ślepo, dwa razy, pod restrykcyjne reguły.

**Skutek:** maksymalizacja liczby błędów. Użytkownik nie widzi, co pisze,
a musi trafić w cztery warunki naraz — i zrobić to dwukrotnie identycznie.

**Zmiana:** przycisk „Pokaż”. Przy działającym podglądzie pole „Powtórz hasło”
przestaje być potrzebne — usunięte. To o jedno pole mniej w formularzu.

### K7. Zgody: wspólny przełącznik nad wymaganymi i dobrowolnymi

**Stan:** trzy zgody w jednym bloku, nad nimi „Zaznacz wszystkie zgody”.
Żadna nie jest oznaczona jako wymagana lub dobrowolna. Dwie są ucięte w połowie
zdania, z linkiem „Rozwiń”.

**Skutek — użytkowy:** klient nie wie, co musi zaznaczyć, żeby przejść dalej,
więc albo zaznacza wszystko z niepewności, albo utyka.

**Skutek — prawny:** RODO wymaga, żeby zgoda marketingowa była **dobrowolna
i odrębna**. Jeden przełącznik obejmujący akceptację OWH (warunek zawarcia umowy)
razem ze zgodą marketingową (dobrowolną) podważa dobrowolność tej drugiej.
**Do przeglądu przez dział prawny.**

**Zmiana:** dwie osobne grupy — „Wymagane” i „Dobrowolne”, z jawnym nagłówkiem.
Przełącznik zbiorczy usunięty. Pełna treść zgody rozwijana w miejscu, bez
przeładowania. Przycisk „Załóż konto” nieaktywny, dopóki nie zaznaczono
obu wymaganych — z widoczną informacją dlaczego.

---

## 3. Usterki wysokiego wpływu

### W1. Dane z rejestru pojawiają się bez potwierdzenia sukcesu

**Stan:** po weryfikacji NIP nazwa i adres firmy pojawiają się jako zwykły tekst
pod nagłówkiem „Adres rejestracyjny firmy”. Bez ikony, bez koloru, bez komunikatu.

**Ocena:** samo pobieranie danych z rejestru to **najlepszy element całego flow** —
oszczędza użytkownikowi przepisywania czterech linijek adresu. Ale nie jest
oznaczone jako sukces, więc nie działa jako nagroda za wysiłek.

**Zmiana:** wyraźne potwierdzenie — „Znaleźliśmy Twoją firmę w rejestrze”,
zielona ramka, dane w formie listy definicyjnej.

### W2. Danych firmy nie można poprawić

**Stan:** adres pobrany z rejestru jest tekstem statycznym. Brak pola edycji,
brak linku „to nie moja firma”, brak możliwości podania innego adresu dostawy.

**Skutek:** każdy przypadek nieaktualnych danych w rejestrze albo adresu
korespondencyjnego innego niż rejestrowy kończy się porzuceniem formularza
lub telefonem do BOK. W dystrybucji stali adres dostawy **rzadko** jest adresem
rejestrowym — towar jedzie na budowę albo do zakładu, nie do biura.

**Zmiana:** dwa wyjścia pod danymi firmy — „Adres dostawy jest inny — popraw”
(rozwija pola adresowe) i „To nie moja firma” (wraca do kroku z NIP).

### W3. Brak wskaźnika postępu

**Stan:** po weryfikacji NIP formularz rozwija się naraz o pięć pól, sekcję zgód
i dwa przyciski. Nie wiadomo, ile jeszcze zostało.

**Skutek:** formularz sprawia wrażenie dłuższego, niż jest. Klasyczna przyczyna
porzucenia w połowie.

**Zmiana:** trzy nazwane kroki (Firma → Dane kontaktowe → Zgody formalne)
z zaznaczonym postępem. Ten sam zestaw pól, ale podzielony i z widocznym końcem.

### W4. „Anuluj” ma tę samą wagę wizualną co „Zarejestruj”

**Stan:** dwa przyciski obok siebie, podobnej wielkości, w jednej linii.
Nie wiadomo też, dokąd „Anuluj” prowadzi ani czy ostrzega przed utratą danych.

**Zmiana:** akcja wycofująca jako „Wstecz” w formie przycisku konturowego,
wyraźnie lżejszego niż CTA; główny przycisk większy i po przeciwnej stronie.

### W5. Sekcja dla klientów indywidualnych konkuruje z głównym zadaniem

**Stan:** „NIE MASZ DZIAŁALNOŚCI GOSPODARCZEJ?” zajmuje około jednej trzeciej
pierwszego ekranu, z osobnym formularzem e-mail i osobnym przyciskiem
„Zapisuję się”. Obietnica: „będzie dostępna niebawem – pracujemy nad tym!” —
bez daty.

**Skutek:** dwa konkurencyjne zadania na jednym ekranie. Klient firmowy —
czyli ten, na którym zależy — musi przewinąć obok formularza, który go nie dotyczy.
Klient indywidualny dostaje obietnicę bez terminu, co jest gorsze niż jasne „nie”.

**Zmiana:** zwinięte za linkiem „Nie mam numeru NIP”, rozwijane na żądanie.
Zero utraty funkcji, zero konkurencji o uwagę. Do obietnicy dopisać **konkretny
termin albo go usunąć** — „niebawem” bez daty psuje wiarygodność.

### W6. Pasek ikon profili na ekranie rejestracji

**Stan:** dwanaście ikon kształtów (kwadrat, koło, sześciokąt, kątownik, ceownik…)
plus „SALE” — pas zajmujący pełną szerokość, tuż pod menu.

**Skutek:** na ekranie, którego jedynym zadaniem jest wypełnienie formularza,
stoi dwanaście linków wyprowadzających. Ikony są bez podpisów, więc i tak
nieczytelne dla kogoś, kto nie zna asortymentu.

**Zmiana:** pas ukryty na ścieżce rejestracji. Nawigacja skrócona do logo,
menu głównego i logowania.

---

## 4. Usterki średniego wpływu

| # | Element | Problem | Zmiana |
|---|---|---|---|
| S1 | Przycisk „Sprawdź” | ikona ↻ (odświeżanie) sugeruje ponowne ładowanie, nie weryfikację | usunąć ikonę albo zastąpić lupą |
| S2 | Placeholder pola NIP | „Numer Identyfikacji Podatkow…” — obcięty, dłuższy niż pole | placeholder pokazuje **format** (`1234567890`), nie powtarza etykiety |
| S3 | Instrukcja formatu NIP | pojawia się dopiero pod polem po weryfikacji | widoczna od początku, razem z etykietą |
| S4 | Pole telefonu | etykieta „Numer telefonu +48…”, placeholder „Numer telefonu” — nie wiadomo, czy wpisać prefiks | placeholder z pełnym przykładem `+48 600 000 000` |
| S5 | „Adres e-mail (firmowy)” | sugestia w nawiasie bez konsekwencji — nie wiadomo, co się stanie przy adresie prywatnym | albo egzekwować i wyjaśnić, albo usunąć nawias |
| S6 | Kontrast placeholderów | jasnoszary na białym — poniżej progu WCAG AA | ciemniejszy odcień |
| S7 | Nagłówki wersalikami | „MASZ PROBLEMY Z REJESTRACJĄ?”, „NIE MASZ DZIAŁALNOŚCI…” — trudniejsze w czytaniu | normalna wielkość liter |
| S8 | Puste miejsce nad formularzem | około 150 px pustki między nagłówkiem „Rejestracja” a formularzem | formularz podniesiony ponad linię zgięcia |
| S9 | Wsparcie znika na drugim ekranie | „info@moris.eu” widoczne w kroku 1, brak go w kroku 2 | kontakt do BOK stały, w kolumnie bocznej |
| S10 | Lista krajów przykrywa treść | rozwinięta lista zasłania sekcje pod spodem, tekst przecięty w połowie | lista jako nakładka nad tłem, nie w przepływie |
| S11 | Brak wzmianki o dotychczasowych klientach | formularz nie mówi, że ustalone warunki zostaną przypisane | zdanie na ekranie końcowym — to najmocniejszy argument dla stałych klientów |
| S12 | „Zapoznałem się” | forma rodzajowa w treści zgody | „Potwierdzam zapoznanie się z…” |

---

## 5. Niespójności do wyjaśnienia poza UX

Wykryte przy okazji, wykraczają poza ten ekran:

| Element | Wariant A | Wariant B |
|---|---|---|
| Adres e-mail | `info@moris.eu` (formularz rejestracji, mailingi) | `moris@moris.eu` (stopka serwisu) |
| Telefon | `+48 32 416 36 99` (mailingi) | `+48 32 41 636 00` (stopka serwisu) |

To dwa różne adresy i **dwa różne numery**. Trzeba ustalić, który jest właściwy
dla obsługi klienta, i ujednolicić — obecnie klient trafia pod inny kontakt
w zależności od tego, gdzie spojrzy.

---

## 6. Prototyp

[`rejestracja/index.html`](rejestracja/index.html) — samodzielny plik, bez
budowania i bez zależności poza krojem JetBrains Mono z Google Fonts (przy braku
sieci działa krój zapasowy). Przycisk **„Pokaż uwagi UX”** w górnym pasku
przypina ponumerowane uwagi do elementów, których dotyczą.

Co w nim faktycznie działa:

- **weryfikacja NIP** — pełny algorytm sumy kontrolnej (wagi 6,5,7,2,3,4,5,6,7),
  z komunikatem rozróżniającym błędną długość od błędnej sumy;
- **lista krajów** — sortowanie polskim porządkiem, Polska na górze, filtrowanie
  po wpisaniu liter, obsługa strzałek i Enter;
- **trzy kroki** z zaznaczonym postępem i możliwością cofnięcia;
- **hasło** — reguły odhaczane na żywo, wskaźnik siły, podgląd;
- **walidacja pól** przed przejściem dalej, z ustawieniem kursora na pierwszym
  brakującym polu;
- **zgody** rozdzielone na wymagane i dobrowolne, CTA nieaktywne do momentu
  zaznaczenia obu wymaganych, pełna treść rozwijana w miejscu;
- **ekran końcowy** z informacją o przypisaniu warunków handlowych.

Dane firmy zwracane po weryfikacji są **przykładowe** — prototyp nie ma backendu
i nie odpytuje żadnego rejestru.

Sprawdzone: brak przewijania poziomego przy 390, 768, 1280 i 1920 px,
brak błędów JavaScript.

---

## 7. Kolejność wdrożenia

Uszeregowane według stosunku efektu do kosztu:

**Tydzień pierwszy — poprawki bez zmiany architektury:**
K3 (sortowanie krajów), K4 (Polska domyślnie), K5 (reguły hasła), K6 (podgląd
hasła, usunięcie powtórzenia), S1–S4, S6, S7.

**Tydzień drugi — zmiany w układzie:**
K1 (kolumna z korzyściami), K2 (co się stanie dalej), W1 (potwierdzenie sukcesu),
W4 (hierarchia przycisków), W5 (zwinięcie sekcji indywidualnej), W6 (ukrycie
paska ikon).

**Do zaplanowania — wymaga pracy po stronie backendu lub prawnej:**
K7 (przebudowa zgód — **wymaga akceptacji działu prawnego**), W2 (edycja adresu
i odrzucenie danych z rejestru), W3 (podział na kroki).

## 8. Czego ta analiza nie obejmuje

- **Danych ilościowych.** Nie ma dostępu do analityki, więc nie wiadomo, na którym
  polu użytkownicy faktycznie odpadają. Zanim cokolwiek wdrożycie, warto włączyć
  śledzenie porzuceń na poziomie pojedynczego pola — to zweryfikuje albo obali
  kolejność z rozdziału 7.
- **Zachowania na urządzeniach mobilnych.** Oba zrzuty pochodzą z desktopu.
- **Ścieżki logowania i odzyskiwania hasła**, które są drugą połową tego samego
  problemu.
- **Treści prawnej zgód** — rozdział 2, punkt K7 wskazuje problem konstrukcyjny,
  ale ocena zgodności należy do działu prawnego.
