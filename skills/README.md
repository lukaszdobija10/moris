# Skille Moris — wersja z księgą znaku

Katalog zawiera **skill `moris-docs` przebudowany na system wizualny z księgi
znaku** (`../brand/moris-logo-manual.pdf`). To jedyny skill firmowy Moris —
`lukaszdobija-docs` i `coaching-toolkit` należą do marki lukaszdobija.pl
i pozostają bez zmian.

## Jak wgrać zmienioną wersję

Skille są synchronizowane z konta, a nie z tego repozytorium. Zmiany zrobione
w kontenerze sesji **znikają razem z sesją**. Żeby wersja 2.0 obowiązywała na
stałe, katalog `moris-docs/` trzeba wgrać do biblioteki skilli na koncie
(Ustawienia → Capabilities → Skills, albo tą samą drogą, którą powstała
wersja 1.0). Repozytorium jest tu kopią źródłową i historią zmian.

## Co się zmieniło w wersji 2.0

| Obszar | Wersja 1.0 | Wersja 2.0 |
|---|---|---|
| Źródło systemu | plik Word ZSZ-POL-FIN-01 | księga znaku `moris-logo-manual.pdf` |
| Kolor wiodący | granat `156082` | Steel blue `1A2B3C` · RAL 5011 |
| Kolor drugoplanowy | granat ciemny `0E4258` | Sapphire blue `1F3855` · RAL 5003 |
| Krój | Arial | Poppins (przełącznik: Paralucent / Poppins / Arial) |
| Znak | sygnatura słowna „Moris.eu" | logotyp z księgi osadzany jako grafika |
| Kolory statusu | zieleń/bursztyn/czerwień dowolne | kolory informacyjne z księgi wraz z rozbiciami |

Nazwy kluczy w `COLOR` nie zmieniły się, więc wszystkie generatory działają bez
przeróbek. Sprawdzone: 16 wzorów generuje się i przechodzi walidację OOXML,
w każdym osadzony jest znak.

## Przełącznik kroju

W `lib/moris-brand.js`, stała `FONT_SET`:

- `"brand"` — Paralucent w nagłówkach, Poppins w tekście. Wymaga licencji
  (The Northern Block) i instalacji kroju na stanowiskach odbiorców.
- `"office"` — wszystko Poppinsem. **Ustawienie domyślne.** Poppins jest
  darmowy (Google Fonts) i księga wskazuje go jako krój tekstowy.
- `"system"` — wszystko Arialem. Awaryjnie, gdy na stanowiskach nie można
  zainstalować żadnego kroju firmowego.

Nie przestawiaj na `"brand"`, dopóki Paralucent nie jest zainstalowany
u odbiorców — Word podstawi wtedy krój losowo i dokument straci spójność.
