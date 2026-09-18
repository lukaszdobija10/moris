<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

$v = $_GET['v'] ?? 'dzis';

/* ------------------------------------------------------------------ */
/* Setup — pierwsze uruchomienie                                       */
/* ------------------------------------------------------------------ */

if (!is_configured()) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $p1 = (string) ($_POST['p1'] ?? '');
        $p2 = (string) ($_POST['p2'] ?? '');
        if (strlen($p1) < 8) {
            $err = 'Hasło musi mieć co najmniej 8 znaków.';
        } elseif ($p1 !== $p2) {
            $err = 'Hasła nie są identyczne.';
        } else {
            set_setting('password_hash', password_hash($p1, PASSWORD_DEFAULT));
            login($p1);
            header('Location: ?v=ustawienia&setup=1');
            exit;
        }
    }
    render_setup($err ?? null);
    exit;
}

/* ------------------------------------------------------------------ */
/* Logowanie                                                           */
/* ------------------------------------------------------------------ */

if ($v === 'logout') {
    logout();
    header('Location: ?v=login');
    exit;
}

if (!is_logged_in()) {
    $err = null;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (login((string) ($_POST['password'] ?? ''))) {
            header('Location: ?v=dzis');
            exit;
        }
        $left = login_locked();
        $err  = $left > 0
            ? 'Za dużo nieudanych prób. Spróbuj ponownie za ' . $left . ' s.'
            : 'Nieprawidłowe hasło.';
        usleep(400000);
    }
    render_login($err);
    exit;
}

/* ------------------------------------------------------------------ */
/* Obsługa zapisu                                                      */
/* ------------------------------------------------------------------ */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $action = $_POST['action'] ?? '';

    if ($action === 'day') {
        $d = clamp_day((string) ($_POST['d'] ?? today()));
        save_day($d, $_POST);
        header('Location: ?v=' . ($_POST['back'] ?? 'dzis') . '&d=' . urlencode($d) . '&ok=1');
        exit;
    }

    if ($action === 'week') {
        $w = (string) ($_POST['w'] ?? week_start(today()));
        save_week($w, $_POST);
        header('Location: ?v=tydzien&w=' . urlencode($w) . '&ok=1');
        exit;
    }

    if ($action === 'checkpoint') {
        $m = (string) ($_POST['m'] ?? '');
        if (in_array($m, checkpoint_months(), true)) {
            save_checkpoint($m, $_POST);
        }
        header('Location: ?v=punkty&ok=1');
        exit;
    }

    if ($action === 'settings') {
        foreach (['kcal', 'protein', 'steps', 'variant', 'identity', 'frozen', 'january'] as $k) {
            set_setting($k, trim((string) ($_POST[$k] ?? '')));
        }
        header('Location: ?v=ustawienia&ok=1');
        exit;
    }

    if ($action === 'password') {
        $old = (string) ($_POST['old'] ?? '');
        $p1  = (string) ($_POST['p1'] ?? '');
        $p2  = (string) ($_POST['p2'] ?? '');
        if (!password_verify($old, (string) setting('password_hash'))) {
            $flash = 'Stare hasło nieprawidłowe.';
        } elseif (strlen($p1) < 8 || $p1 !== $p2) {
            $flash = 'Nowe hasło musi mieć 8+ znaków i być powtórzone identycznie.';
        } else {
            set_setting('password_hash', password_hash($p1, PASSWORD_DEFAULT));
            $flash = 'Hasło zmienione.';
        }
        session_start_safe();
        $_SESSION['flash'] = $flash;
        header('Location: ?v=ustawienia');
        exit;
    }
}

/* ------------------------------------------------------------------ */
/* Eksport                                                             */
/* ------------------------------------------------------------------ */

if ($v === 'export') {
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="winter-arc-' . today() . '.json"');
    echo json_encode([
        'exported'    => date('c'),
        'settings'    => array_diff_key(settings_all(), ['password_hash' => 1, 'login_fail_n' => 1, 'login_fail_at' => 1]),
        'days'        => array_values(all_days()),
        'weeks'       => array_values(all_weeks()),
        'checkpoints' => db()->query('SELECT * FROM checkpoints')->fetchAll(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

/* ------------------------------------------------------------------ */
/* Dane wspólne dla widoków                                            */
/* ------------------------------------------------------------------ */

$dayMap  = all_days();
$weekMap = all_weeks();
$streak  = current_streak($dayMap);
$adh     = adherence($dayMap);

render_header($v);

switch ($v) {
    case 'kalendarz':  view_calendar($dayMap); break;
    case 'tydzien':    view_week($dayMap, $weekMap); break;
    case 'punkty':     view_checkpoints($dayMap, $weekMap); break;
    case 'ustawienia': view_settings(); break;
    case 'dzien':      view_day(valid_date($_GET['d'] ?? null) ? (string) $_GET['d'] : today(), $dayMap); break;
    default:           view_today($dayMap, $weekMap, $streak, $adh); break;
}

render_footer();


/* ================================================================== */
/* WIDOKI                                                              */
/* ================================================================== */

/** Wspólne meta: brak indeksowania, ikona, manifest (dodanie do ekranu głównego). */
function head_meta(): void
{
    global $CFG;
    ?>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0F4C5C">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="<?= e($CFG['title']) ?>">
<link rel="icon" href="assets/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/icon-180.png">
<link rel="manifest" href="manifest.php">
<link rel="stylesheet" href="assets/app.css">
    <?php
}

function render_setup(?string $err): void
{
    global $CFG;
    ?><!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($CFG['title']) ?> — konfiguracja</title>
<?php head_meta(); ?></head>
<body class="gate">
<div class="gate-box">
  <div class="brandline"></div>
  <h1><?= e($CFG['title']) ?></h1>
  <p class="muted">Pierwsze uruchomienie. Ustaw hasło dostępu — to jedyna ochrona tej aplikacji.</p>
  <?php if ($err): ?><p class="err"><?= e($err) ?></p><?php endif; ?>
  <form method="post">
    <label>Hasło<input type="password" name="p1" required minlength="8" autofocus></label>
    <label>Powtórz hasło<input type="password" name="p2" required minlength="8"></label>
    <button type="submit">Ustaw hasło i zacznij</button>
  </form>
</div></body></html><?php
}

function render_login(?string $err): void
{
    global $CFG;
    ?><!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($CFG['title']) ?></title>
<?php head_meta(); ?></head>
<body class="gate">
<div class="gate-box">
  <div class="brandline"></div>
  <h1><?= e($CFG['title']) ?></h1>
  <?php if ($err): ?><p class="err"><?= e($err) ?></p><?php endif; ?>
  <form method="post">
    <label>Hasło<input type="password" name="password" required autofocus></label>
    <button type="submit">Wejdź</button>
  </form>
</div></body></html><?php
}

function render_header(string $v): void
{
    global $CFG;
    $nav = [
        'dzis'      => 'Dziś',
        'kalendarz' => 'Kalendarz',
        'tydzien'   => 'Tydzień',
        'punkty'    => 'Punkty',
        'ustawienia'=> 'Ustawienia',
    ];
    ?><!doctype html>
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($CFG['title']) ?></title>
<?php head_meta(); ?></head>
<body>
<header class="top">
  <div class="wrap">
    <div class="brandline"></div>
    <div class="topbar">
      <span class="logo"><?= e($CFG['title']) ?></span>
      <a class="out" href="?v=logout">Wyloguj</a>
    </div>
    <nav>
      <?php foreach ($nav as $k => $label): ?>
        <a href="?v=<?= $k ?>" class="<?= $v === $k || ($v === 'dzien' && $k === 'kalendarz') ? 'on' : '' ?>"><?= $label ?></a>
      <?php endforeach; ?>
    </nav>
  </div>
</header>
<main class="wrap">
<?php if (isset($_GET['ok'])): ?><p class="ok">Zapisano.</p><?php endif; ?>
<?php
    session_start_safe();
    if (!empty($_SESSION['flash'])) {
        echo '<p class="ok">' . e($_SESSION['flash']) . '</p>';
        unset($_SESSION['flash']);
    }
}

function render_footer(): void
{
    ?></main>
<footer class="wrap muted small">
  Łukasz Dobija · Winter Arc · <a href="?v=export">eksport danych (JSON)</a>
</footer>
<script src="assets/app.js"></script>
</body></html><?php
}

/* ------------------------------------------------------------------ */

function view_today(array $map, array $weekMap, int $streak, array $adh): void
{
    global $CFG;
    $t     = today();
    $days  = arc_days();
    $start = $days[0];
    $end   = end($days);

    if ($t < $start) {
        $daysTo = (new DateTimeImmutable($start))->diff(new DateTimeImmutable($t))->days;
        echo '<section class="card"><h2>Arc jeszcze nie wystartował</h2>';
        echo '<p>Start: <strong>' . pl_date($start) . '</strong> — za ' . $daysTo . ' dni.</p>';
        echo '<p class="muted">Do tego czasu domknij listę z sekcji 8 planu: zapotrzebowanie kaloryczne, plan treningowy, bloki w kalendarzu, zdanie o sobie, zdjęcia i pomiar pasa, wybór wariantu filaru 4. Progi wpiszesz w <a href="?v=ustawienia">Ustawieniach</a>.</p>';
        echo '</section>';
        return;
    }
    if ($t > $end) {
        echo '<section class="card"><h2>Arc zamknięty</h2><p>Przejdź do <a href="?v=punkty">Punktów kontrolnych</a> i domknij grudzień. Potem decyzja z sekcji 7: co przechodzi dalej na stałe.</p></section>';
    }

    $d   = clamp_day($t);
    $row = get_day($d);
    $ph  = phase($d);
    $n   = arc_day_number($d);
    $total = count($days);
    $w   = week_start($d);
    $week = get_week($w);
    $tr  = trainings_in_week($w, $map);

    /* Pasek stanu */
    ?>
    <section class="stats">
      <div class="stat"><span class="k">Dzień</span><span class="v"><?= $n ?><span class="sub">/<?= $total ?></span></span></div>
      <div class="stat"><span class="k">Seria</span><span class="v <?= $streak >= 7 ? 'good' : '' ?>"><?= $streak ?><span class="sub">dni</span></span></div>
      <div class="stat"><span class="k">Dotrzymane</span><span class="v"><?= $adh['pct'] ?><span class="sub">%</span></span></div>
      <div class="stat"><span class="k">Faza</span><span class="v small-v"><?= e($ph['name']) ?></span></div>
    </section>
    <?php

    if (missed_two_in_row($map)) {
        echo '<div class="alarm"><strong>Dwa dni z rzędu wypadły.</strong> Protokół awarii: dziś minimalna wersja każdego filaru — 20 minut bloku, spacer, jedzenie w normie. Chodzi o odzyskanie serii, nie o wynik. Nie liczysz Arca od nowa.</div>';
    } elseif (alert_two_in_row($map)) {
        echo '<div class="warn"><strong>Wczoraj wypadło.</strong> Zasada nadrzędna: nigdy dwa razy z rzędu. Dzisiejszy dzień jest jedynym, który się w tym tygodniu naprawdę liczy.</div>';
    }

    echo '<p class="phase-note muted">' . e($ph['desc']) . '</p>';

    day_form($d, $row, $ph, 'dzis');

    /* Skrót tygodnia */
    $contactsTarget = $ph['contacts'];
    $dW = measure_delta($weekMap, 'weight');
    $dP = measure_delta($weekMap, 'waist');
    ?>
    <section class="card">
      <h2>Ten tydzień <span class="muted small">(<?= pl_date($w) ?>)</span></h2>
      <div class="weekbar">
        <div class="wb"><span>Treningi</span><strong class="<?= $tr >= 4 ? 'good' : '' ?>"><?= $tr ?>/4</strong></div>
        <div class="wb"><span>Rozmowy z rynkiem</span><strong class="<?= $week['contacts'] >= $contactsTarget ? 'good' : '' ?>"><?= (int) $week['contacts'] ?>/<?= $contactsTarget ?></strong></div>
        <div class="wb"><span>Treść</span><strong class="<?= $week['content'] ? 'good' : '' ?>"><?= $week['content'] ? 'tak' : 'nie' ?></strong></div>
        <div class="wb"><span>Waga<?= $dW ? ' · od startu' : '' ?></span><strong>
          <?= $week['weight'] !== null ? fmt_num((float) $week['weight']) . ' kg' : ($dW ? fmt_num($dW['last']) . ' kg' : '—') ?>
          <?php if ($dW): ?><em class="delta <?= $dW['delta'] < 0 ? 'good' : '' ?>"><?= fmt_delta($dW['delta'], 'kg') ?></em><?php endif; ?>
        </strong></div>
        <?php if ($dP): ?>
        <div class="wb"><span>Pas · od startu</span><strong><?= fmt_num($dP['last']) ?> cm
          <em class="delta <?= $dP['delta'] < 0 ? 'good' : '' ?>"><?= fmt_delta($dP['delta'], 'cm') ?></em></strong></div>
        <?php endif; ?>
      </div>
      <p><a class="btn ghost" href="?v=tydzien&w=<?= urlencode($w) ?>">Otwórz przegląd tygodnia</a></p>
    </section>
    <?php

    /* Zdanie o sobie */
    $identity = setting('identity', '');
    if ($identity !== '') {
        echo '<section class="card identity"><h2>Zdanie</h2><p class="big">' . e($identity) . '</p></section>';
    }
}

function view_day(string $d, array $map): void
{
    $d = clamp_day($d);
    $row = get_day($d);
    $ph  = phase($d);
    echo '<p class="muted small"><a href="?v=kalendarz">← kalendarz</a></p>';
    day_form($d, $row, $ph, 'kalendarz');
}

function day_form(string $d, array $row, array $ph, string $back): void
{
    $isToday = $d === today();
    $meas    = is_measurement_week($d);
    $weekday = is_weekday($d);
    $kcal    = setting('kcal', '');
    $protein = setting('protein', '');
    $steps   = setting('steps', '');
    ?>
    <section class="card day">
      <h2><?= $isToday ? 'Dziś' : 'Dzień' ?> — <?= pl_date($d) ?> <span class="muted small">(<?= pl_dow($d) ?>)</span></h2>
      <form method="post" id="dayform">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="day">
        <input type="hidden" name="back" value="<?= e($back) ?>">
        <input type="hidden" name="d" value="<?= e($d) ?>">

        <div class="pillar">
          <div class="pillar-h"><span class="badge">Filar 1</span> Ciało</div>
          <label class="check">
            <input type="checkbox" name="food" value="1" <?= $row['food'] ? 'checked' : '' ?>>
            <span><strong><?= e($ph['food']) ?></strong>
            <?php if ($kcal || $protein): ?><em class="muted"><?= $kcal ? e($kcal) . ' kcal' : '' ?><?= ($kcal && $protein) ? ' · ' : '' ?><?= $protein ? e($protein) . ' g białka' : '' ?></em><?php endif; ?></span>
          </label>
          <label class="check">
            <input type="checkbox" name="steps" value="1" <?= $row['steps'] ? 'checked' : '' ?>>
            <span><strong><?= $meas ? 'Pomiar kroków (tydzień kalibracyjny)' : 'Próg kroków osiągnięty' ?></strong>
            <?php if (!$meas && $steps): ?><em class="muted">cel: <?= e($steps) ?></em><?php endif; ?></span>
          </label>
          <label class="check optional">
            <input type="checkbox" name="training" value="1" <?= $row['training'] ? 'checked' : '' ?>>
            <span><strong>Trening</strong> <em class="muted">cel tygodniowy 4×, nie dzienny</em></span>
          </label>
        </div>

        <div class="pillar">
          <div class="pillar-h"><span class="badge">Filar 2</span> Marka</div>
          <label class="check <?= $weekday ? '' : 'optional' ?>">
            <input type="checkbox" name="block" value="1" <?= $row['block'] ? 'checked' : '' ?>>
            <span><strong>Blok doradczy <?= $ph['block'] ?> min</strong>
            <em class="muted"><?= $weekday ? 'przed pracą operacyjną · bez narzędzi, logotypów i porządkowania' : 'weekend — nieobowiązkowy' ?></em></span>
          </label>
        </div>

        <div class="pillar">
          <div class="pillar-h"><span class="badge">Filar 3</span> Wartość</div>
          <label class="field">
            <span>Co obiecałem sobie dziś i dotrzymałem</span>
            <textarea name="journal" rows="2" placeholder="Dotrzymanie, nie efekt. „Zjadłem zgodnie z planem”, nie „schudłem”."><?= e($row['journal']) ?></textarea>
          </label>
        </div>

        <label class="field">
          <span>Notatka (opcjonalnie)</span>
          <textarea name="note" rows="2"><?= e($row['note']) ?></textarea>
        </label>

        <button type="submit">Zapisz dzień</button>
      </form>
    </section>
    <?php
}

/* ------------------------------------------------------------------ */

function view_calendar(array $map): void
{
    $days = arc_days();
    $byMonth = [];
    foreach ($days as $d) {
        $byMonth[substr($d, 0, 7)][] = $d;
    }
    ?>
    <section class="card">
      <h2>Kalendarz — <?= count(arc_days()) ?> dni</h2>
      <p class="legend">
        <span><i class="sw done"></i> zaliczony</span>
        <span><i class="sw partial"></i> częściowy</span>
        <span><i class="sw missed"></i> wypadł</span>
        <span><i class="sw future"></i> przed nami</span>
      </p>
      <?php foreach ($byMonth as $m => $list):
          $ph = phase($list[0]);
          $a  = adherence($map, $m); ?>
        <div class="month">
          <h3><?= pl_month($m) ?> <span class="muted small">· <?= e($ph['name']) ?> · <?= $a['done'] ?>/<?= $a['elapsed'] ?> dni</span></h3>
          <div class="grid">
            <?php
            $firstDow = (int) (new DateTimeImmutable($list[0]))->format('N');
            for ($i = 1; $i < $firstDow; $i++) echo '<span class="cell blank"></span>';
            foreach ($list as $d):
                $st = day_status($d, $map);
                $num = (int) (new DateTimeImmutable($d))->format('j'); ?>
              <a class="cell <?= $st ?>" href="?v=dzien&d=<?= $d ?>" title="<?= pl_date($d) ?>"><?= $num ?></a>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </section>
    <?php

    /* Dziennik dotrzymań */
    $entries = array_filter($map, fn($r) => trim($r['journal']) !== '');
    krsort($entries);
    if ($entries) {
        echo '<section class="card"><h2>Dziennik dotrzymań</h2><ul class="journal">';
        foreach (array_slice($entries, 0, 40, true) as $d => $r) {
            echo '<li><span class="muted small">' . pl_date($d) . '</span><br>' . e($r['journal']) . '</li>';
        }
        echo '</ul></section>';
    }
}

/* ------------------------------------------------------------------ */

function view_week(array $map, array $weekMap): void
{
    $weeks = arc_weeks();
    $w = $_GET['w'] ?? week_start(today());
    if (!in_array($w, $weeks, true)) {
        $w = $weeks[0];
        foreach ($weeks as $cand) {
            if ($cand <= week_start(today())) $w = $cand;
        }
    }
    $row  = get_week($w);
    $ph   = phase($w);
    $tr   = trainings_in_week($w, $map);
    $variant = setting('variant', 'zwiazek');
    $idx  = array_search($w, $weeks, true);
    $prev = $idx > 0 ? $weeks[$idx - 1] : null;
    $next = $idx < count($weeks) - 1 ? $weeks[$idx + 1] : null;
    $waistWeek = $idx % 2 === 0; // co drugi tydzień
    ?>
    <section class="card">
      <div class="weeknav">
        <?php if ($prev): ?><a href="?v=tydzien&w=<?= $prev ?>">← poprzedni</a><?php else: ?><span></span><?php endif; ?>
        <strong>Tydzień <?= (int) $idx + 1 ?> · <?= pl_date($w) ?></strong>
        <?php if ($next): ?><a href="?v=tydzien&w=<?= $next ?>">następny →</a><?php else: ?><span></span><?php endif; ?>
      </div>

      <div class="weekbar">
        <div class="wb"><span>Treningi (z dni)</span><strong class="<?= $tr >= 4 ? 'good' : '' ?>"><?= $tr ?>/4</strong></div>
        <div class="wb"><span>Faza</span><strong><?= e($ph['name']) ?></strong></div>
        <?php
        // Ostatni pomiar sprzed tego tygodnia — do porównania.
        $prevW = null; $prevP = null;
        foreach (measure_series($weekMap, 'weight') as $k => $val) { if ($k < $w) $prevW = [$k, $val]; }
        foreach (measure_series($weekMap, 'waist')  as $k => $val) { if ($k < $w) $prevP = [$k, $val]; }
        if ($prevW && $row['weight'] !== null):
            $d = round((float) $row['weight'] - $prevW[1], 1); ?>
          <div class="wb"><span>Waga vs poprzedni pomiar</span><strong class="<?= $d < 0 ? 'good' : '' ?>"><?= fmt_delta($d, 'kg') ?></strong></div>
        <?php elseif ($prevW): ?>
          <div class="wb"><span>Poprzedni pomiar</span><strong><?= fmt_num($prevW[1]) ?> kg</strong></div>
        <?php endif; ?>
        <?php if ($prevP && $row['waist'] !== null):
            $d = round((float) $row['waist'] - $prevP[1], 1); ?>
          <div class="wb"><span>Pas vs poprzedni pomiar</span><strong class="<?= $d < 0 ? 'good' : '' ?>"><?= fmt_delta($d, 'cm') ?></strong></div>
        <?php endif; ?>
      </div>

      <form method="post">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="week">
        <input type="hidden" name="w" value="<?= e($w) ?>">

        <div class="pillar">
          <div class="pillar-h"><span class="badge">Filar 1</span> Pomiar</div>
          <div class="row2">
            <label class="field"><span>Waga (kg) — sobota rano</span>
              <input type="text" inputmode="decimal" name="weight" value="<?= $row['weight'] !== null ? e((string) $row['weight']) : '' ?>"></label>
            <label class="field"><span>Pas (cm) <?= $waistWeek ? '' : '— w tym tygodniu opcjonalnie' ?></span>
              <input type="text" inputmode="decimal" name="waist" value="<?= $row['waist'] !== null ? e((string) $row['waist']) : '' ?>"></label>
          </div>
        </div>

        <div class="pillar">
          <div class="pillar-h"><span class="badge">Filar 2</span> Marka</div>
          <label class="field"><span>Rozmowy / kontakty z rynkiem (cel: <?= $ph['contacts'] ?>)</span>
            <input type="number" min="0" max="50" name="contacts" value="<?= (int) $row['contacts'] ?>"></label>
          <label class="check">
            <input type="checkbox" name="content" value="1" <?= $row['content'] ? 'checked' : '' ?>>
            <span><strong>Opublikowana treść</strong></span>
          </label>
        </div>

        <div class="pillar">
          <div class="pillar-h"><span class="badge">Filar 3</span> Wartość — ćwiczenie tygodniowe</div>
          <label class="field">
            <span>Trzy rzeczy, za które uszanowałbyś kogoś innego, gdyby je zrobił — i jak je sobie unieważniasz</span>
            <textarea name="value_note" rows="5" placeholder="1.&#10;2.&#10;3.&#10;&#10;Jak to unieważniam: „to było łatwe”, „każdy by to zrobił”…"><?= e($row['value_note']) ?></textarea>
          </label>
        </div>

        <div class="pillar">
          <div class="pillar-h"><span class="badge">Filar 4</span> Związek</div>
          <label class="check">
            <input type="checkbox" name="grudge" value="1" <?= $row['grudge'] ? 'checked' : '' ?>>
            <span><strong>Żadna niewypowiedziana pretensja nie ma więcej niż 7 dni</strong></span>
          </label>
          <label class="check">
            <input type="checkbox" name="relation" value="1" <?= $row['relation'] ? 'checked' : '' ?>>
            <span><strong><?= $variant === 'szukam'
                ? 'Dwa nowe kontakty w tym tygodniu'
                : 'Wieczór bez telefonu i bez tematów logistycznych' ?></strong></span>
          </label>
        </div>

        <label class="check">
          <input type="checkbox" name="review" value="1" <?= $row['review'] ? 'checked' : '' ?>>
          <span><strong>Przegląd niedzielny zrobiony</strong> <em class="muted">seria, pomiary, kontakty, bloki wpisane w kalendarz</em></span>
        </label>

        <button type="submit">Zapisz tydzień</button>
      </form>
    </section>
    <?php
}

/* ------------------------------------------------------------------ */

function view_checkpoints(array $map, array $weekMap): void
{
    $months = checkpoint_months();
    $base   = null;
    foreach ($months as $m) {
        $cp = get_checkpoint($m);
        $a  = adherence($map, $m);
        $contacts = contacts_in_month($m, $weekMap);
        $ph = phase($m . '-15');
        if ($base === null && $cp['weight'] !== null) $base = (float) $cp['weight'];
        ?>
        <section class="card">
          <h2>Punkt kontrolny — <?= pl_month($m) ?> <span class="muted small">· <?= e($ph['name']) ?></span></h2>
          <div class="weekbar">
            <div class="wb"><span>Dni dotrzymane</span><strong class="<?= $a['pct'] >= 80 ? 'good' : '' ?>"><?= $a['done'] ?>/<?= $a['elapsed'] ?> · <?= $a['pct'] ?>%</strong></div>
            <div class="wb"><span>Rozmowy z rynkiem</span><strong><?= $contacts ?></strong></div>
          </div>
          <form method="post">
            <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
            <input type="hidden" name="action" value="checkpoint">
            <input type="hidden" name="m" value="<?= e($m) ?>">
            <div class="row2">
              <label class="field"><span>Waga (kg)</span><input type="text" inputmode="decimal" name="weight" value="<?= $cp['weight'] !== null ? e((string) $cp['weight']) : '' ?>"></label>
              <label class="field"><span>Pas (cm)</span><input type="text" inputmode="decimal" name="waist" value="<?= $cp['waist'] !== null ? e((string) $cp['waist']) : '' ?>"></label>
            </div>
            <div class="row2">
              <label class="field"><span>Przychód z doradztwa (PLN)</span><input type="text" inputmode="decimal" name="revenue" value="<?= $cp['revenue'] !== null ? e((string) $cp['revenue']) : '' ?>"></label>
              <label class="field"><span>Oszczędności miesiąca (PLN)</span><input type="text" inputmode="decimal" name="savings" value="<?= $cp['savings'] !== null ? e((string) $cp['savings']) : '' ?>"></label>
            </div>
            <label class="field"><span>Wniosek</span><textarea name="note" rows="3"><?= e($cp['note']) ?></textarea></label>
            <button type="submit">Zapisz punkt</button>
          </form>
        </section>
        <?php
    }
    ?>
    <section class="card muted small">
      <p>Między punktami kontrolnymi nie zmieniasz planu, nawet jeśli w trzecim tygodniu wydaje ci się, że coś nie działa.</p>
    </section>
    <?php
}

/* ------------------------------------------------------------------ */

function view_settings(): void
{
    $variant = setting('variant', 'zwiazek');
    ?>
    <?php if (isset($_GET['setup'])): ?>
      <div class="warn">Hasło ustawione. Uzupełnij progi poniżej — bez nich aplikacja działa, ale nie pokaże ci celów przy checkboxach.</div>
    <?php endif; ?>
    <section class="card">
      <h2>Progi i decyzje</h2>
      <form method="post">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="settings">
        <div class="row2">
          <label class="field"><span>Cel kcal / dzień</span><input type="text" name="kcal" value="<?= e(setting('kcal', '')) ?>" placeholder="np. 2100"></label>
          <label class="field"><span>Cel białka (g)</span><input type="text" name="protein" value="<?= e(setting('protein', '')) ?>" placeholder="np. 160"></label>
        </div>
        <label class="field"><span>Próg kroków (ustal po 7 dniach pomiaru: średnia +30%)</span>
          <input type="text" name="steps" value="<?= e(setting('steps', '')) ?>" placeholder="np. 9500"></label>

        <label class="field"><span>Wariant filaru 4</span>
          <select name="variant">
            <option value="zwiazek" <?= $variant === 'zwiazek' ? 'selected' : '' ?>>Jestem w związku — pogłębiam</option>
            <option value="szukam"  <?= $variant === 'szukam'  ? 'selected' : '' ?>>Szukam</option>
          </select></label>

        <label class="field"><span>Zdanie o sobie — co robisz i dla kogo (niezmienne przez 90 dni)</span>
          <textarea name="identity" rows="2"><?= e(setting('identity', '')) ?></textarea></label>

        <label class="field"><span>Zamrożone inicjatywy — co jawnie stoi do 1 stycznia</span>
          <textarea name="frozen" rows="4"><?= e(setting('frozen', '')) ?></textarea></label>

        <label class="field"><span>Decyzja na 1 stycznia — co przechodzi dalej na stałe, a co było zabiegiem na 90 dni</span>
          <textarea name="january" rows="4"><?= e(setting('january', '')) ?></textarea></label>

        <button type="submit">Zapisz</button>
      </form>
    </section>

    <section class="card">
      <h2>Hasło</h2>
      <form method="post">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="password">
        <label class="field"><span>Stare hasło</span><input type="password" name="old" required></label>
        <div class="row2">
          <label class="field"><span>Nowe hasło</span><input type="password" name="p1" required minlength="8"></label>
          <label class="field"><span>Powtórz</span><input type="password" name="p2" required minlength="8"></label>
        </div>
        <button type="submit" class="ghost">Zmień hasło</button>
      </form>
    </section>
    <?php
}
