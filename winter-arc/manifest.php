<?php
/**
 * Winter Arc — manifest PWA (dodanie do ekranu głównego telefonu).
 * Generowany dynamicznie, żeby tytuł pochodził z config.php,
 * a plik nie podpadał pod blokadę *.json w .htaccess.
 */
$CFG = require __DIR__ . '/config.php';
header('Content-Type: application/manifest+json; charset=utf-8');
echo json_encode([
    'name'             => $CFG['title'],
    'short_name'       => mb_strlen($CFG['title']) > 12 ? 'Arc' : $CFG['title'],
    'lang'             => 'pl',
    'start_url'        => './?v=dzis',
    'scope'            => './',
    'display'          => 'standalone',
    'background_color' => '#F5F0E8',
    'theme_color'      => '#0F4C5C',
    'icons'            => [
        ['src' => 'assets/icon-192.png', 'sizes' => '192x192', 'type' => 'image/png'],
        ['src' => 'assets/icon-512.png', 'sizes' => '512x512', 'type' => 'image/png', 'purpose' => 'any maskable'],
        ['src' => 'assets/icon.svg',     'sizes' => 'any',     'type' => 'image/svg+xml'],
    ],
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
