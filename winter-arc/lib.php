<?php
/**
 * Winter Arc — warstwa danych i logika.
 */

declare(strict_types=1);

$CFG = require __DIR__ . '/config.php';
date_default_timezone_set($CFG['tz']);

/* ------------------------------------------------------------------ */
/* Baza                                                                */
/* ------------------------------------------------------------------ */

function db(): PDO
{
    global $CFG;
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dir = dirname($CFG['db_path']);
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    if (!is_writable($dir)) {
        http_response_code(500);
        exit('Katalog ' . htmlspecialchars($dir) . ' nie ma prawa zapisu. Ustaw chmod 775.');
    }

    $pdo = new PDO('sqlite:' . $CFG['db_path'], null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA foreign_keys = ON');
    migrate($pdo);

    return $pdo;
}

function migrate(PDO $pdo): void
{
    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        k TEXT PRIMARY KEY,
        v TEXT NOT NULL
    )");

    // Jeden wiersz na dzień Arca.
    $pdo->exec("CREATE TABLE IF NOT EXISTS days (
        d        TEXT PRIMARY KEY,   -- YYYY-MM-DD
        food     INTEGER NOT NULL DEFAULT 0,  -- filar 1: deficyt + białko
        steps    INTEGER NOT NULL DEFAULT 0,  -- filar 1: próg kroków
        block    INTEGER NOT NULL DEFAULT 0,  -- filar 2: blok doradczy
        training INTEGER NOT NULL DEFAULT 0,  -- filar 1: trening (cel tygodniowy 4x)
        journal  TEXT NOT NULL DEFAULT '',    -- filar 3: co obiecałem i dotrzymałem
        note     TEXT NOT NULL DEFAULT ''
    )");

    // Jeden wiersz na tydzień (klucz = poniedziałek).
    $pdo->exec("CREATE TABLE IF NOT EXISTS weeks (
        w          TEXT PRIMARY KEY,
        weight     REAL,
        waist      REAL,
        contacts   INTEGER NOT NULL DEFAULT 0,  -- filar 2: rozmowy z rynkiem
        content    INTEGER NOT NULL DEFAULT 0,  -- filar 2: opublikowana treść
        relation   INTEGER NOT NULL DEFAULT 0,  -- filar 4: zachowanie tygodnia
        grudge     INTEGER NOT NULL DEFAULT 1,  -- filar 4: brak zaległej pretensji > 7 dni
        value_note TEXT NOT NULL DEFAULT '',    -- filar 3: ćwiczenie tygodniowe
        review     INTEGER NOT NULL DEFAULT 0   -- przegląd niedzielny zrobiony
    )");

    // Punkty kontrolne: 2026-10, 2026-11, 2026-12.
    $pdo->exec("CREATE TABLE IF NOT EXISTS checkpoints (
        m       TEXT PRIMARY KEY,  -- YYYY-MM
        weight  REAL,
        waist   REAL,
        revenue REAL,
        savings REAL,
        note    TEXT NOT NULL DEFAULT ''
    )");
}

/* ------------------------------------------------------------------ */
/* Ustawienia                                                          */
/* ------------------------------------------------------------------ */

function settings_all(bool $reload = false): array
{
    if ($reload || !isset($GLOBALS['__settings'])) {
        $GLOBALS['__settings'] = [];
        foreach (db()->query('SELECT k, v FROM settings') as $r) {
            $GLOBALS['__settings'][$r['k']] = $r['v'];
        }
    }
    return $GLOBALS['__settings'];
}

function setting(string $key, ?string $default = null): ?string
{
    $all = settings_all();
    return $all[$key] ?? $default;
}

function set_setting(string $key, string $val): void
{
    $st = db()->prepare('INSERT INTO settings (k, v) VALUES (?, ?)
                         ON CONFLICT(k) DO UPDATE SET v = excluded.v');
    $st->execute([$key, $val]);
    settings_all(true);
}

/* ------------------------------------------------------------------ */
/* Autoryzacja                                                         */
/* ------------------------------------------------------------------ */

function session_start_safe(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'httponly' => true,
            'samesite' => 'Lax',
            'secure'   => !empty($_SERVER['HTTPS']),
        ]);
        session_start();
    }
}

function is_configured(): bool
{
    return (bool) setting('password_hash');
}

function is_logged_in(): bool
{
    session_start_safe();
    return !empty($_SESSION['wa_auth']);
}

/** Po 5 nieudanych próbach kolejne logowanie możliwe dopiero po 60 sekundach. */
function login_locked(): int
{
    $n  = (int) setting('login_fail_n', '0');
    $at = (int) setting('login_fail_at', '0');
    if ($n < 5) return 0;
    $left = $at + 60 - time();
    return $left > 0 ? $left : 0;
}

function login(string $password): bool
{
    if (login_locked() > 0) {
        return false;
    }
    $hash = setting('password_hash');
    if (!$hash || !password_verify($password, $hash)) {
        $n = (int) setting('login_fail_n', '0');
        set_setting('login_fail_n', (string) ($n >= 5 ? 1 : $n + 1));
        set_setting('login_fail_at', (string) time());
        return false;
    }
    set_setting('login_fail_n', '0');
    session_start_safe();
    session_regenerate_id(true);
    $_SESSION['wa_auth'] = true;
    return true;
}

function logout(): void
{
    session_start_safe();
    $_SESSION = [];
    session_destroy();
}

function csrf_token(): string
{
    session_start_safe();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function csrf_check(): void
{
    session_start_safe();
    $sent = (string) ($_POST['csrf'] ?? '');
    $have = (string) ($_SESSION['csrf'] ?? '');
    if ($have === '' || $sent === '' || !hash_equals($have, $sent)) {
        http_response_code(400);
        exit('Nieprawidłowy token formularza. Odśwież stronę i spróbuj ponownie.');
    }
}

/* ------------------------------------------------------------------ */
/* Kalendarz i fazy                                                    */
/* ------------------------------------------------------------------ */

function arc_days(): array
{
    global $CFG;
    static $days = null;
    if ($days !== null) {
        return $days;
    }
    $days = [];
    $cur   = new DateTimeImmutable($CFG['start']);
    $end   = new DateTimeImmutable($CFG['end']);
    while ($cur <= $end) {
        $days[] = $cur->format('Y-m-d');
        $cur = $cur->modify('+1 day');
    }
    return $days;
}

function today(): string
{
    return (new DateTimeImmutable('now'))->format('Y-m-d');
}

/** Dzień w obrębie Arca, przycięty do zakresu. */
function clamp_day(string $d): string
{
    $days = arc_days();
    if (!valid_date($d)) $d = today();
    if ($d < $days[0]) return $days[0];
    if ($d > end($days)) return end($days);
    return $d;
}

function arc_day_number(string $d): int
{
    $days = arc_days();
    $i = array_search($d, $days, true);
    return $i === false ? 0 : $i + 1;
}

/**
 * Faza: kalibracja (1. miesiąc Arca), pełna moc (środek), utrzymanie (ostatni miesiąc).
 * Liczona względem zakresu z config.php, więc przesunięcie dat nie psuje faz.
 */
function phase(string $d): array
{
    $months = checkpoint_months();
    $m      = substr($d, 0, 7);
    $idx    = array_search($m, $months, true);
    $last   = count($months) - 1;
    if ($idx === false) {
        $idx = $m < $months[0] ? 0 : $last;
    }

    if ($idx === 0 && $last > 0) {
        return [
            'key'   => 'kalibracja',
            'name'  => 'Kalibracja',
            'desc'  => 'Ustawiasz progi i budujesz serię. Efektów jeszcze nie oceniasz.',
            'food'  => 'Deficyt ok. 500 kcal + białko',
            'block' => 60,
            'contacts' => 5,
        ];
    }
    if ($idx < $last) {
        return [
            'key'   => 'moc',
            'name'  => 'Pełna moc',
            'desc'  => 'Miesiąc największego zwrotu. Brak świąt, brak wymówek.',
            'food'  => 'Deficyt ok. 500 kcal + białko',
            'block' => 90,
            'contacts' => 5,
        ];
    }
    return [
        'key'   => 'utrzymanie',
        'name'  => 'Utrzymanie',
        'desc'  => 'Cel: nie przytyć i nie zerwać serii. Deficyt schodzi do zera.',
        'food'  => 'Jedzenie w normie (bez deficytu) + białko',
        'block' => 45,
        'contacts' => 3,
    ];
}

/** Czy ciąg ma postać YYYY-MM-DD i jest prawdziwą datą. */
function valid_date(?string $d): bool
{
    if ($d === null || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) return false;
    $dt = DateTimeImmutable::createFromFormat('!Y-m-d', $d);
    return $dt !== false && $dt->format('Y-m-d') === $d;
}

/** Pierwszy tydzień = tylko pomiar kroków, bez progu. */
function is_measurement_week(string $d): bool
{
    $days = arc_days();
    return array_search($d, $days, true) !== false && arc_day_number($d) <= 7;
}

function is_weekday(string $d): bool
{
    $n = (int) (new DateTimeImmutable($d))->format('N');
    return $n <= 5;
}

function week_start(string $d): string
{
    return (new DateTimeImmutable($d))->modify('monday this week')->format('Y-m-d');
}

/* ------------------------------------------------------------------ */
/* Dane dzienne i tygodniowe                                           */
/* ------------------------------------------------------------------ */

function get_day(string $d): array
{
    $st = db()->prepare('SELECT * FROM days WHERE d = ?');
    $st->execute([$d]);
    $row = $st->fetch();
    return $row ?: [
        'd' => $d, 'food' => 0, 'steps' => 0, 'block' => 0,
        'training' => 0, 'journal' => '', 'note' => '',
    ];
}

function save_day(string $d, array $f): void
{
    $st = db()->prepare('INSERT INTO days (d, food, steps, block, training, journal, note)
                         VALUES (:d, :food, :steps, :block, :training, :journal, :note)
                         ON CONFLICT(d) DO UPDATE SET
                            food = :food, steps = :steps, block = :block,
                            training = :training, journal = :journal, note = :note');
    $st->execute([
        ':d' => $d,
        ':food' => (int) ($f['food'] ?? 0),
        ':steps' => (int) ($f['steps'] ?? 0),
        ':block' => (int) ($f['block'] ?? 0),
        ':training' => (int) ($f['training'] ?? 0),
        ':journal' => trim((string) ($f['journal'] ?? '')),
        ':note' => trim((string) ($f['note'] ?? '')),
    ]);
}

function all_days(): array
{
    $out = [];
    foreach (db()->query('SELECT * FROM days') as $r) {
        $out[$r['d']] = $r;
    }
    return $out;
}

/**
 * Dzień zaliczony = jedzenie + kroki + (blok, jeśli dzień roboczy).
 * W tygodniu pomiarowym kroki liczą się jako zaliczone przez sam fakt pomiaru.
 */
function day_complete(array $row): bool
{
    $d = $row['d'];
    if (!$row['food'])  return false;
    if (!$row['steps']) return false;
    if (is_weekday($d) && !$row['block']) return false;
    return true;
}

function day_status(string $d, array $map): string
{
    $t = today();
    if ($d > $t) return 'future';
    $row = $map[$d] ?? null;
    if (!$row) return $d === $t ? 'open' : 'missed';
    if (day_complete($row)) return 'done';
    $any = $row['food'] || $row['steps'] || $row['block'] || $row['training'] || $row['journal'] !== '';
    if ($d === $t) return $any ? 'partial' : 'open';
    return $any ? 'partial' : 'missed';
}

/** Aktualna seria dni zaliczonych, licząc wstecz od wczoraj lub dziś. */
function current_streak(array $map): int
{
    $days  = arc_days();
    $today = today();
    $streak = 0;
    for ($i = count($days) - 1; $i >= 0; $i--) {
        $d = $days[$i];
        if ($d > $today) continue;
        $row = $map[$d] ?? null;
        $ok  = $row && day_complete($row);
        if ($d === $today && !$ok) {
            continue; // dzisiaj jeszcze trwa — nie zeruje serii
        }
        if ($ok) { $streak++; } else { break; }
    }
    return $streak;
}

function longest_streak(array $map): int
{
    $best = 0; $cur = 0;
    foreach (arc_days() as $d) {
        if ($d > today()) break;
        $row = $map[$d] ?? null;
        if ($row && day_complete($row)) { $cur++; $best = max($best, $cur); }
        else { $cur = 0; }
    }
    return $best;
}

/** Zasada nadrzędna: nigdy dwa razy z rzędu. */
function alert_two_in_row(array $map): bool
{
    $today = today();
    $y  = (new DateTimeImmutable($today))->modify('-1 day')->format('Y-m-d');
    $days = arc_days();
    if ($y < $days[0]) return false;
    $ok1 = isset($map[$y]) && day_complete($map[$y]);
    return !$ok1; // wczoraj wypadło → dziś jest dniem, w którym nie wolno opuścić
}

function missed_two_in_row(array $map): bool
{
    $today = today();
    $y  = (new DateTimeImmutable($today))->modify('-1 day')->format('Y-m-d');
    $y2 = (new DateTimeImmutable($today))->modify('-2 day')->format('Y-m-d');
    $days = arc_days();
    if ($y2 < $days[0]) return false;
    $ok1 = isset($map[$y])  && day_complete($map[$y]);
    $ok2 = isset($map[$y2]) && day_complete($map[$y2]);
    return !$ok1 && !$ok2;
}

function adherence(array $map, ?string $monthPrefix = null): array
{
    $elapsed = 0; $done = 0;
    foreach (arc_days() as $d) {
        if ($d > today()) break;
        if ($monthPrefix && strpos($d, $monthPrefix) !== 0) continue;
        $elapsed++;
        if (isset($map[$d]) && day_complete($map[$d])) $done++;
    }
    $pct = $elapsed ? (int) round(100 * $done / $elapsed) : 0;
    return ['elapsed' => $elapsed, 'done' => $done, 'pct' => $pct];
}

/* ------------------------------------------------------------------ */
/* Tygodnie                                                            */
/* ------------------------------------------------------------------ */

function arc_weeks(): array
{
    $weeks = [];
    foreach (arc_days() as $d) {
        $w = week_start($d);
        $weeks[$w] = true;
    }
    return array_keys($weeks);
}

function get_week(string $w): array
{
    $st = db()->prepare('SELECT * FROM weeks WHERE w = ?');
    $st->execute([$w]);
    $row = $st->fetch();
    return $row ?: [
        'w' => $w, 'weight' => null, 'waist' => null, 'contacts' => 0,
        'content' => 0, 'relation' => 0, 'grudge' => 1, 'value_note' => '', 'review' => 0,
    ];
}

function save_week(string $w, array $f): void
{
    $st = db()->prepare('INSERT INTO weeks (w, weight, waist, contacts, content, relation, grudge, value_note, review)
                         VALUES (:w, :weight, :waist, :contacts, :content, :relation, :grudge, :value_note, :review)
                         ON CONFLICT(w) DO UPDATE SET
                            weight = :weight, waist = :waist, contacts = :contacts,
                            content = :content, relation = :relation, grudge = :grudge,
                            value_note = :value_note, review = :review');
    $st->execute([
        ':w' => $w,
        ':weight' => num_or_null($f['weight'] ?? null),
        ':waist'  => num_or_null($f['waist'] ?? null),
        ':contacts' => (int) ($f['contacts'] ?? 0),
        ':content'  => (int) ($f['content'] ?? 0),
        ':relation' => (int) ($f['relation'] ?? 0),
        ':grudge'   => (int) ($f['grudge'] ?? 0),
        ':value_note' => trim((string) ($f['value_note'] ?? '')),
        ':review'   => (int) ($f['review'] ?? 0),
    ]);
}

function all_weeks(): array
{
    $out = [];
    foreach (db()->query('SELECT * FROM weeks') as $r) {
        $out[$r['w']] = $r;
    }
    return $out;
}

function trainings_in_week(string $w, array $map): int
{
    $n = 0;
    $cur = new DateTimeImmutable($w);
    for ($i = 0; $i < 7; $i++) {
        $d = $cur->modify("+$i day")->format('Y-m-d');
        if (isset($map[$d]) && $map[$d]['training']) $n++;
    }
    return $n;
}

function num_or_null($v)
{
    if ($v === null || $v === '' ) return null;
    $v = str_replace(',', '.', (string) $v);
    return is_numeric($v) ? (float) $v : null;
}

/** Uporządkowana seria pomiarów danego typu: [tydzień => wartość]. */
function measure_series(array $weeks, string $field): array
{
    $out = [];
    foreach ($weeks as $w => $row) {
        if ($row[$field] !== null && $row[$field] !== '') {
            $out[$w] = (float) $row[$field];
        }
    }
    ksort($out);
    return $out;
}

/** Zmiana względem pierwszego pomiaru. Zwraca null, gdy brak dwóch punktów. */
function measure_delta(array $weeks, string $field): ?array
{
    $s = measure_series($weeks, $field);
    if (count($s) < 2) return null;
    $keys  = array_keys($s);
    $first = $s[$keys[0]];
    $last  = $s[$keys[count($keys) - 1]];
    return ['first' => $first, 'last' => $last, 'delta' => round($last - $first, 1)];
}

function fmt_num(?float $v, int $dec = 1): string
{
    return $v === null ? '—' : number_format($v, $dec, ',', ' ');
}

function fmt_delta(float $d, string $unit): string
{
    $sign = $d > 0 ? '+' : ($d < 0 ? '−' : '±');
    return $sign . number_format(abs($d), 1, ',', ' ') . ' ' . $unit;
}

/* ------------------------------------------------------------------ */
/* Punkty kontrolne                                                    */
/* ------------------------------------------------------------------ */

function checkpoint_months(): array
{
    $m = [];
    foreach (arc_days() as $d) {
        $m[substr($d, 0, 7)] = true;
    }
    return array_keys($m);
}

function get_checkpoint(string $m): array
{
    $st = db()->prepare('SELECT * FROM checkpoints WHERE m = ?');
    $st->execute([$m]);
    $row = $st->fetch();
    return $row ?: ['m' => $m, 'weight' => null, 'waist' => null, 'revenue' => null, 'savings' => null, 'note' => ''];
}

function save_checkpoint(string $m, array $f): void
{
    $st = db()->prepare('INSERT INTO checkpoints (m, weight, waist, revenue, savings, note)
                         VALUES (:m, :weight, :waist, :revenue, :savings, :note)
                         ON CONFLICT(m) DO UPDATE SET
                            weight = :weight, waist = :waist, revenue = :revenue,
                            savings = :savings, note = :note');
    $st->execute([
        ':m' => $m,
        ':weight'  => num_or_null($f['weight'] ?? null),
        ':waist'   => num_or_null($f['waist'] ?? null),
        ':revenue' => num_or_null($f['revenue'] ?? null),
        ':savings' => num_or_null($f['savings'] ?? null),
        ':note'    => trim((string) ($f['note'] ?? '')),
    ]);
}

function contacts_in_month(string $m, array $weeks): int
{
    $n = 0;
    foreach ($weeks as $w => $row) {
        // przypisujemy tydzień do miesiąca jego czwartku (środek tygodnia)
        $mid = (new DateTimeImmutable($w))->modify('+3 day')->format('Y-m');
        if ($mid === $m) $n += (int) $row['contacts'];
    }
    return $n;
}

/* ------------------------------------------------------------------ */
/* Widok                                                               */
/* ------------------------------------------------------------------ */

function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

function pl_date(string $d): string
{
    $months = [1=>'stycznia',2=>'lutego',3=>'marca',4=>'kwietnia',5=>'maja',6=>'czerwca',
               7=>'lipca',8=>'sierpnia',9=>'września',10=>'października',11=>'listopada',12=>'grudnia'];
    $dt = new DateTimeImmutable($d);
    return (int) $dt->format('j') . ' ' . $months[(int) $dt->format('n')] . ' ' . $dt->format('Y');
}

function pl_dow(string $d): string
{
    $n = (int) (new DateTimeImmutable($d))->format('N');
    return ['pon','wt','śr','czw','pt','sob','ndz'][$n - 1];
}

function pl_month(string $m): string
{
    $names = ['01'=>'Styczeń','02'=>'Luty','03'=>'Marzec','04'=>'Kwiecień','05'=>'Maj','06'=>'Czerwiec',
              '07'=>'Lipiec','08'=>'Sierpień','09'=>'Wrzesień','10'=>'Październik','11'=>'Listopad','12'=>'Grudzień'];
    return ($names[substr($m, 5, 2)] ?? $m) . ' ' . substr($m, 0, 4);
}
