<?php
/**
 * Winter Arc — konfiguracja.
 * Jedyny plik, który zwykle trzeba dotknąć po wgraniu na serwer.
 */

return [
    // Ścieżka do bazy SQLite. Katalog musi mieć prawo zapisu dla PHP (chmod 755 lub 775).
    'db_path' => __DIR__ . '/data/winter-arc.sqlite',

    // Zakres Arca. Zmiana dat po rozpoczęciu nie kasuje danych,
    // ale przelicza kalendarz i punkty kontrolne.
    'start'   => '2026-10-01',
    'end'     => '2026-12-31',

    // Strefa czasowa — decyduje o tym, co aplikacja uznaje za „dzisiaj".
    'tz'      => 'Europe/Warsaw',

    // Tytuł widoczny w nagłówku.
    'title'   => 'Winter Arc 2026',
];
