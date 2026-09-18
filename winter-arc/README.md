# Winter Arc — aplikacja do prowadzenia 90 dni

Aplikacja webowa na własny serwer. PHP + SQLite, bez zależności zewnętrznych, bez frameworka, bez połączeń na zewnątrz. Dane siedzą w jednym pliku bazy na twoim serwerze.

## Test lokalny przed wgraniem

```
cd winter-arc
php -S 127.0.0.1:8080
```
Otwórz `http://127.0.0.1:8080`. Wbudowany serwer PHP nie czyta `.htaccess`, więc lokalnie plik bazy jest osiągalny przez HTTP — na Apache już nie.

## Wymagania

- PHP 8.0 lub nowszy
- Rozszerzenie `pdo_sqlite` (standard na każdym hostingu współdzielonym)
- Apache z obsługą `.htaccess` lub nginx (patrz sekcja Bezpieczeństwo)

## Instalacja — 5 kroków

1. Wgraj całą zawartość katalogu na serwer, np. do `public_html/arc/` albo na subdomenę `arc.lukaszdobija.pl`.

2. Nadaj prawo zapisu katalogowi `data/`:
   ```
   chmod 775 data
   ```
   Na hostingu współdzielonym często wystarczy 755. Jeśli aplikacja zgłosi brak prawa zapisu, ustaw 775.

3. Wejdź na adres aplikacji w przeglądarce. Przy pierwszym uruchomieniu ustawisz hasło. Baza danych utworzy się automatycznie.

4. Przejdź do **Ustawień** i uzupełnij: cel kcal, białko, próg kroków (po tygodniu pomiaru), wariant filaru 4, zdanie o sobie, zamrożone inicjatywy.

5. Dodaj aplikację do ekranu głównego telefonu (Safari: „Udostępnij → Do ekranu początkowego”, Chrome: „Dodaj do ekranu głównego”). Aplikacja ma manifest PWA, więc otworzy się jak osobna aplikacja, bez paska przeglądarki. Codzienne odhaczanie ma zajmować 60 sekund — jeśli wymaga logowania się przez przeglądarkę, przestaniesz to robić w trzecim tygodniu.

## Konfiguracja

Plik `config.php`:

- `db_path` — ścieżka do bazy. Domyślnie `data/winter-arc.sqlite`.
- `start`, `end` — zakres Arca. Domyślnie 1.10.2026 – 31.12.2026.
- `tz` — strefa czasowa, decyduje o tym, co aplikacja uznaje za „dzisiaj".
- `title` — tytuł w nagłówku.

## Bezpieczeństwo

Aplikacja chroni wszystkie widoki hasłem, stosuje tokeny CSRF przy zapisie, po pięciu nieudanych logowaniach blokuje kolejne próby na 60 sekund i wysyła nagłówek `noindex` (panel nie trafi do wyszukiwarek). Zostają dwie rzeczy do domknięcia po twojej stronie:

**HTTPS.** Bez certyfikatu hasło leci otwartym tekstem. Każdy sensowny hosting daje dziś Let's Encrypt za darmo.

**Dostęp do pliku bazy.** Dołączony `.htaccess` blokuje pobranie `.sqlite` przez HTTP na Apache. Dwa mocniejsze warianty:

*Wariant zalecany* — przenieś bazę poza katalog publiczny. W `config.php`:
```php
'db_path' => dirname(__DIR__) . '/winter-arc-data/winter-arc.sqlite',
```
i utwórz ten katalog obok `public_html`, nie w środku. Wtedy plik jest fizycznie nieosiągalny przez przeglądarkę.

*Na nginx* — `.htaccess` jest ignorowany, dodaj do konfiguracji serwera:
```nginx
location ~ \.(sqlite|sqlite-wal|sqlite-shm)$ { deny all; }
location ^~ /data/ { deny all; }
```

## Kopia zapasowa

Dwie drogi:

- **Eksport JSON** — link w stopce aplikacji. Pobiera wszystkie dane bez hasła. Rób to przy każdym punkcie kontrolnym.
- **Kopia pliku** — skopiuj `data/winter-arc.sqlite`. To cała baza.

## Struktura

```
config.php        konfiguracja
lib.php           baza, autoryzacja, logika filarów i serii
index.php         router i wszystkie widoki
manifest.php      manifest PWA (ikona i tytuł na ekranie głównym telefonu)
assets/app.css    style (paleta lukaszdobija.pl v2.0)
assets/app.js     drobne usprawnienia interfejsu
assets/icon*      ikona aplikacji (SVG + PNG 180/192/512)
data/             baza SQLite (tworzy się sama; nie trafia do repozytorium)
.htaccess         blokada dostępu do bazy przez HTTP, nagłówek noindex
```

## Logika, którą aplikacja wymusza

**Dzień zaliczony** = jedzenie + kroki + blok doradczy (blok tylko w dni robocze). Trening liczy się do celu tygodniowego 4×, nie dziennego — nie zeruje dnia.

**Seria** liczy się wstecz od dziś. Bieżący dzień nie zeruje serii dopóki trwa.

**Alert po jednym dniu** — przypomnienie zasady „nigdy dwa razy z rzędu".

**Alarm po dwóch dniach** — protokół awarii: minimalna wersja każdego filaru, bez liczenia Arca od nowa.

**Fazy** przełączają się automatycznie według miesięcy zakresu z `config.php` (pierwszy, środkowe, ostatni):
- Październik — kalibracja. Pierwsze 7 dni: kroki tylko mierzysz, bez progu.
- Listopad — pełna moc. Blok 90 minut, 5 kontaktów tygodniowo.
- Grudzień — utrzymanie. Deficyt schodzi do zera, blok 45 minut, 3 kontakty tygodniowo.

**Punkty kontrolne** liczą procent dotrzymanych dni i sumę rozmów automatycznie. Wagę, pas, przychód i oszczędności wpisujesz ręcznie.

## Po 31 grudnia

Pole „Decyzja na 1 stycznia" w Ustawieniach jest jedyną częścią aplikacji, która ma znaczenie po zakończeniu Arca. Wypełnij je w grudniu, nie 2 stycznia.
