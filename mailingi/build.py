#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generator szablonow mailingowych Moris (ExpertSender).

Wyjscie: samodzielne pliki HTML w tym katalogu — gotowe do wklejenia
w ExpertSender. Generator sluzy tylko temu, zeby wspolna rama (naglowek,
menu, kontakt, stopka) byla w jednym miejscu; wygenerowane pliki nie
wymagaja niczego do dzialania.

    python3 build.py
"""

import io
import os

# --- Paleta wg ksiegi znaku Moris -----------------------------------------
NAVY     = "#156082"   # granat podstawowy
NAVY_D   = "#0E4258"   # granat ciemny
GRAPHITE = "#12202B"   # grafit — tekst
BLUE_L   = "#F2F6F8"   # blekit jasny — tlo sekcji
BLUE     = "#D9E5EC"   # blekit — obramowania, linie
ORANGE   = "#F35E07"   # kolor funkcyjny CTA (do akceptacji — patrz README)
GREY     = "#5A6B76"   # tekst pomocniczy
WHITE    = "#FFFFFF"
PAGE_BG  = "#ECECEC"

FONT = "Arial, Helvetica, sans-serif"
MONO = "Consolas, 'Courier New', Courier, monospace"

W       = 600   # szerokosc maila
INNER   = 536   # szerokosc kolumny tresci

LOGO_HEADER = "https://bevisible.pl/mailingi/moris-03-2024-4/logo-moris-dark.png"
LOGO_FOOTER = "https://bevisible.pl/mailingi/moris-03-2024-4/logo-dark.png"
ICON_MAIL   = "https://bevisible.pl/mailingi/moris-03-2024-4/mail.png"
ICON_CALL   = "https://bevisible.pl/mailingi/moris-03-2024-4/call.png"

URL_HOME    = "https://moris.eu/pl/"
URL_STEEL   = "https://moris.eu/pl/stal/c/STEEL"
URL_RAIL    = "https://moris.eu/pl/kolej/c/RAIL"
URL_CATALOG = "https://moris.eu/pl/wszystkie-produkty/c/catalogue"
URL_BLOG    = "https://moris.eu/pl/blog"
URL_CONTACT = "https://moris.eu/pl/contact-us"
URL_LOGIN   = "https://moris.eu/pl/login"
URL_ABOUT   = "https://moris.eu/pl/about-us"
URL_WHY     = "https://moris.eu/pl/why-we"
URL_CUT     = "https://moris.eu/pl/cutting-service"
URL_DELIV   = "https://moris.eu/pl/delivery"
URL_HDS     = "https://moris.eu/pl/blog/HDS"

MAIL   = "info@moris.eu"
PHONE  = "+48 32 416 36 99"
PHONE_HREF = "tel:+48324163699"

# ExpertSender wstawia wlasny, podpisany link wypisu i pixel per kampania —
# nie da sie ich wygenerowac poza systemem. Zostawiamy znaczniki do podmiany.
UNSUB_PLACEHOLDER = "{{LINK_WYPISU_Z_EXPERTSENDER}}"
PIXEL_PLACEHOLDER = ("https://link.moris.eu/mo/$uid$_1060954645_"
                     "{{ID_KAMPANII}}_$llid$_$launchId$.gif")

RODO = (
    u"Zgodnie z wymogami ogólnego rozporządzenia o ochronie danych osobowych "
    u"(RODO), pragniemy poinformować, że: Administratorem Państwa danych "
    u"osobowych jest Moris Sp. z o.o. z siedzibą w Chorzowie, ul. Wiejska 27, "
    u"41-503 Chorzów. Państwa dane osobowe będą przetwarzane w celu realizacji "
    u"procesu ofertowania, zawarcia lub wykonywania umowy oraz w prawnie "
    u"uzasadnionym interesie administratora, w celu utrzymania kontaktów "
    u"biznesowych. Dane będą przechowywane przez okres niezbędny do prowadzenia "
    u"korespondencji, a następnie w celach archiwizacyjnych, jednak nie dłużej "
    u"niż rok. Przysługuje Państwu prawo do cofnięcia zgody, a podanie danych "
    u"jest dobrowolne."
)

CSS = """
body{margin:0!important;padding:0!important;width:100%%!important;
background-color:%(page)s;font-family:%(font)s;
-webkit-text-size-adjust:100%%!important;-ms-text-size-adjust:100%%!important;
-webkit-font-smoothing:antialiased!important;}
table{border-collapse:collapse!important;mso-table-lspace:0pt;mso-table-rspace:0pt;}
img{border:0!important;outline:none!important;display:block!important;
-ms-interpolation-mode:bicubic;}
a{text-decoration:none!important;}
a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;
font-size:inherit!important;font-family:inherit!important;
font-weight:inherit!important;line-height:inherit!important;}
u+#body a{color:inherit;text-decoration:none;font-size:inherit;
font-family:inherit;font-weight:inherit;line-height:inherit;}
#outlook a{padding:0;}
.ExternalClass{width:100%%;}
.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,
.ExternalClass td,.ExternalClass div{line-height:100%%;}
@media screen and (max-width:600px){
  table.container{width:100%%!important;}
  img.image{width:100%%!important;height:auto!important;}
  td.stack{display:block!important;width:100%%!important;
    box-sizing:border-box!important;}
  td.pad-mobile{padding-left:16px!important;padding-right:16px!important;}
  td.menu-item{display:block!important;width:100%%!important;border:none!important;
    text-align:center!important;padding-top:9px!important;padding-bottom:9px!important;}
  td.h1{font-size:26px!important;line-height:32px!important;}
  td.h2{font-size:21px!important;line-height:28px!important;}
  td.gap-mobile{padding-bottom:20px!important;}
  .hide-mobile{display:none!important;}
}
""" % {"page": PAGE_BG, "font": FONT}


# --- Elementy skladowe -----------------------------------------------------

def wrap(inner, bg=WHITE, pad_top=0, pad_bottom=0, block_id=""):
    """Wiersz szerokosci 600 px z kolumna tresci 536 px."""
    bid = ' e-block-id="%s"' % block_id if block_id else ""
    return """<tr%(bid)s>
<td style="background-color:%(bg)s;">
<table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="%(w)s" class="container" style="width:%(w)spx;background-color:%(bg)s;">
<tr><td class="pad-mobile" style="padding:%(pt)spx 32px %(pb)spx 32px;">
<table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="%(i)s" class="container" style="width:%(i)spx;">
%(inner)s
</table>
</td></tr></table>
</td></tr>
""" % {"bid": bid, "bg": bg, "w": W, "i": INNER,
       "pt": pad_top, "pb": pad_bottom, "inner": inner}


def header_block():
    menu = [
        ("wyroby hutnicze", URL_STEEL),
        ("produkty kolejowe", URL_RAIL),
        ("blog", URL_BLOG),
        ("kontakt", URL_CONTACT),
    ]
    cells = []
    for i, (label, href) in enumerate(menu):
        border = ("border-right:1px solid %s;" % BLUE) if i < len(menu) - 1 else ""
        cells.append(
            '<td class="menu-item" style="%svertical-align:middle;'
            'text-transform:uppercase;font-size:11px;line-height:14px;'
            'font-weight:700;letter-spacing:.4px;text-align:center;'
            'font-family:%s;padding:2px 6px;">'
            '<a href="%s" target="_blank" style="color:%s;'
            'text-decoration:none!important;">%s</a></td>'
            % (border, FONT, href, NAVY, label))

    inner = """<tr>
<td class="stack" style="width:300px;vertical-align:middle;padding-bottom:6px;">
<a href="%(home)s" target="_blank" title="Moris" style="text-decoration:none!important;"><img e-editable="logo" border="0" src="%(logo)s" width="175" height="26" alt="Moris" style="display:block!important;border:0!important;"></a>
</td>
<td class="stack" e-editable="claim" style="width:236px;vertical-align:middle;color:%(graph)s;text-transform:uppercase;font-size:11px;line-height:16px;font-weight:400;letter-spacing:.4px;text-align:right;font-family:%(font)s;">
Najszybsza <strong>hurtownia stali online</strong>
</td>
</tr>
<tr><td colspan="2" style="padding-top:18px;"><table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0"><tr><td style="height:1px;line-height:1px;font-size:0;background-color:%(blue)s;">&nbsp;</td></tr></table></td></tr>
<tr><td colspan="2" style="padding-top:14px;">
<table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%%" class="container"><tr>%(menu)s</tr></table>
</td></tr>""" % {"home": URL_HOME, "logo": LOGO_HEADER, "graph": GRAPHITE,
                 "font": FONT, "blue": BLUE, "menu": "".join(cells)}
    return wrap(inner, WHITE, 32, 20, "moris-header")


def hero(kicker, h1, lead):
    inner = """<tr><td e-editable="kicker" style="font-family:%(font)s;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:%(orange)s;padding-bottom:12px;">%(kicker)s</td></tr>
<tr><td class="h1" e-editable="naglowek" style="font-family:%(font)s;font-size:31px;line-height:38px;font-weight:700;color:%(navy)s;padding-bottom:16px;mso-line-height-rule:exactly;">%(h1)s</td></tr>
<tr><td e-editable="lead" style="font-family:%(font)s;font-size:16px;line-height:25px;font-weight:400;color:%(graph)s;">%(lead)s</td></tr>""" % {
        "font": FONT, "orange": ORANGE, "navy": NAVY, "graph": GRAPHITE,
        "kicker": kicker, "h1": h1, "lead": lead}
    return wrap(inner, WHITE, 34, 32, "moris-hero")


def h2_row(text, color=None):
    return ('<tr><td class="h2" e-editable="h2" style="font-family:%s;font-size:23px;'
            'line-height:30px;font-weight:700;color:%s;padding-bottom:18px;'
            'mso-line-height-rule:exactly;">%s</td></tr>'
            % (FONT, color or NAVY, text))


def steps_rows(items):
    """Numerowane kroki: numer w kwadracie + tytul + opis."""
    out = []
    for n, (title, desc) in enumerate(items, start=1):
        last = (n == len(items))
        out.append("""<tr><td style="padding-bottom:%(pb)spx;">
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0" class="container"><tr>
<td width="44" style="width:44px;vertical-align:top;padding-right:16px;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="44" style="width:44px;"><tr>
<td align="center" bgcolor="%(navy)s" style="width:44px;height:44px;background-color:%(navy)s;font-family:%(mono)s;font-size:18px;line-height:44px;font-weight:700;color:%(white)s;text-align:center;mso-line-height-rule:exactly;">%(n)s</td>
</tr></table>
</td>
<td style="vertical-align:top;">
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0"><tr>
<td e-editable="krok%(n)stytul" style="font-family:%(font)s;font-size:17px;line-height:24px;font-weight:700;color:%(navy_d)s;padding-bottom:5px;">%(title)s</td></tr>
<tr><td e-editable="krok%(n)sopis" style="font-family:%(font)s;font-size:15px;line-height:23px;font-weight:400;color:%(graph)s;">%(desc)s</td></tr>
</table>
</td></tr></table>
</td></tr>""" % {"pb": 0 if last else 20, "navy": NAVY, "navy_d": NAVY_D,
                 "mono": MONO, "font": FONT, "white": WHITE, "graph": GRAPHITE,
                 "n": n, "title": title, "desc": desc})
    return "".join(out)


def bullets_rows(items, marker=ORANGE, color=None):
    """Punktowana lista zbudowana na tabeli — bez <ul>, ktore rozjezdza Outlook."""
    out = []
    for i, item in enumerate(items):
        last = (i == len(items) - 1)
        out.append("""<tr><td style="padding-bottom:%(pb)spx;">
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0"><tr>
<td width="18" style="width:18px;vertical-align:top;font-family:%(font)s;font-size:15px;line-height:23px;color:%(marker)s;font-weight:700;">&bull;</td>
<td style="vertical-align:top;font-family:%(font)s;font-size:15px;line-height:23px;color:%(color)s;">%(item)s</td>
</tr></table></td></tr>""" % {"pb": 0 if last else 9, "font": FONT,
                              "marker": marker, "color": color or GRAPHITE, "item": item})
    return "".join(out)


def stats_rows(items):
    """Pas liczb — 2 x 2 na desktopie, 1 kolumna na mobile."""
    out = []
    for i in range(0, len(items), 2):
        pair = items[i:i + 2]
        cells = []
        for j, (value, label) in enumerate(pair):
            pad = "padding-right:12px;" if j == 0 else "padding-left:12px;"
            cells.append("""<td class="stack gap-mobile" style="width:256px;%(pad)svertical-align:top;">
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0"><tr>
<td e-editable="liczba" style="font-family:%(mono)s;font-size:29px;line-height:36px;font-weight:700;color:%(navy)s;padding-bottom:4px;mso-line-height-rule:exactly;">%(value)s</td></tr>
<tr><td e-editable="opis" style="font-family:%(font)s;font-size:14px;line-height:20px;color:%(grey)s;">%(label)s</td></tr>
</table></td>""" % {"pad": pad, "mono": MONO, "navy": NAVY, "font": FONT,
                    "grey": GREY, "value": value, "label": label})
        if len(pair) == 1:
            cells.append('<td class="stack" style="width:256px;">&nbsp;</td>')
        pb = 0 if i + 2 >= len(items) else 24
        out.append('<tr><td style="padding-bottom:%spx;">'
                   '<table role="presentation" width="100%%" border="0" cellpadding="0" '
                   'cellspacing="0" class="container"><tr>%s</tr></table></td></tr>'
                   % (pb, "".join(cells)))
    return "".join(out)


def cards_rows(items):
    """Karty: tytul + opis, na jasnym blekicie, z lewa krecha granatowa."""
    out = []
    for i, (title, desc, href, link_label) in enumerate(items):
        last = (i == len(items) - 1)
        link = ""
        if href:
            link = ('<tr><td style="padding-top:9px;"><a href="%s" target="_blank" '
                    'style="font-family:%s;font-size:14px;line-height:20px;'
                    'font-weight:700;color:%s;text-decoration:none!important;">'
                    '%s &rarr;</a></td></tr>' % (href, FONT, ORANGE, link_label))
        out.append("""<tr><td style="padding-bottom:%(pb)spx;">
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0" class="container"><tr>
<td width="4" bgcolor="%(navy)s" style="width:4px;background-color:%(navy)s;font-size:0;line-height:0;">&nbsp;</td>
<td bgcolor="%(blue_l)s" style="background-color:%(blue_l)s;padding:18px 20px;">
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0"><tr>
<td e-editable="karta_tytul" style="font-family:%(font)s;font-size:16px;line-height:22px;font-weight:700;color:%(navy_d)s;padding-bottom:6px;">%(title)s</td></tr>
<tr><td e-editable="karta_opis" style="font-family:%(font)s;font-size:15px;line-height:23px;color:%(graph)s;">%(desc)s</td></tr>
%(link)s
</table>
</td></tr></table></td></tr>""" % {"pb": 0 if last else 12, "navy": NAVY,
                                   "blue_l": BLUE_L, "font": FONT,
                                   "navy_d": NAVY_D, "graph": GRAPHITE,
                                   "title": title, "desc": desc, "link": link})
    return "".join(out)


def table_rows(headers, rows, dark=False):
    """Tabela danych technicznych — cyfry krojem o stalej szerokosci."""
    head_col = BLUE if dark else GREY
    line_str = WHITE if dark else NAVY      # linia pod naglowkiem
    line_row = NAVY_D if dark else BLUE     # linie miedzy wierszami
    col_a    = BLUE if dark else GRAPHITE   # kolumna opisowa
    col_b    = WHITE if dark else NAVY_D    # kolumna z wartoscia

    th = "".join(
        '<td style="font-family:%s;font-size:11px;line-height:16px;font-weight:700;'
        'letter-spacing:.8px;text-transform:uppercase;color:%s;padding:0 10px 8px 0;'
        'border-bottom:2px solid %s;">%s</td>' % (FONT, head_col, line_str, h)
        for h in headers)
    body = []
    for r in rows:
        tds = []
        for k, cell in enumerate(r):
            fam = FONT if k == 0 else MONO
            col = col_a if k == 0 else col_b
            wgt = "400" if k == 0 else "700"
            tds.append('<td style="font-family:%s;font-size:14px;line-height:21px;'
                       'font-weight:%s;color:%s;padding:9px 10px 9px 0;'
                       'border-bottom:1px solid %s;">%s</td>'
                       % (fam, wgt, col, line_row, cell))
        body.append("<tr>%s</tr>" % "".join(tds))
    return ('<tr><td><table role="presentation" width="100%%" border="0" cellpadding="0" '
            'cellspacing="0" class="container"><tr>%s</tr>%s</table></td></tr>'
            % (th, "".join(body)))


def table_rows_dark(headers, rows):
    """Ta sama tabela na granatowym tle."""
    return table_rows(headers, rows, dark=True)


def cta_rows(label, href, width=280, align="left"):
    """Przycisk odporny na Outlooka (VML) — bez obrazka."""
    return """<tr><td align="%(align)s" style="padding-top:26px;">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="%(href)s" style="height:52px;v-text-anchor:middle;width:%(w)spx;" arcsize="6%%" stroke="f" fillcolor="%(orange)s">
<w:anchorlock/>
<center style="color:#ffffff;font-family:%(font)s;font-size:16px;font-weight:bold;">%(label)s</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-- -->
<a e-editable="cta" href="%(href)s" target="_blank" style="background-color:%(orange)s;border-radius:3px;color:#ffffff;display:inline-block;font-family:%(font)s;font-size:16px;font-weight:700;line-height:52px;text-align:center;text-decoration:none!important;width:%(w)spx;-webkit-text-size-adjust:none;">%(label)s</a>
<!--<![endif]-->
</td></tr>""" % {"align": align, "href": href, "w": width, "orange": ORANGE,
                 "font": FONT, "label": label}


def divider_row():
    return ('<tr><td style="padding-top:26px;"><table role="presentation" width="100%%" '
            'border="0" cellpadding="0" cellspacing="0"><tr><td style="height:1px;'
            'line-height:1px;font-size:0;background-color:%s;">&nbsp;</td></tr>'
            '</table></td></tr>' % ORANGE)


def contact_block(title):
    inner = """<tr><td e-editable="kontakt_tytul" class="h2" style="font-family:%(font)s;font-size:23px;line-height:30px;font-weight:700;color:%(white)s;padding-bottom:22px;mso-line-height-rule:exactly;">%(title)s</td></tr>
<tr><td>
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0" class="container"><tr>
<td class="stack gap-mobile" style="width:268px;vertical-align:top;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%"><tr>
<td width="56" style="width:56px;padding-right:20px;vertical-align:top;">
<a href="mailto:%(mail)s" style="text-decoration:none!important;"><img border="0" src="%(icon_mail)s" width="56" height="56" alt="Napisz do nas" style="display:block!important;border:0!important;"></a>
</td>
<td style="vertical-align:middle;font-family:%(font)s;font-size:15px;line-height:22px;color:%(white)s;">
<a href="mailto:%(mail)s" style="color:%(white)s;text-decoration:none!important;">E-mail<br><strong>%(mail)s</strong></a>
</td></tr></table>
</td>
<td class="stack" style="width:268px;vertical-align:top;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%%"><tr>
<td width="56" style="width:56px;padding-right:20px;vertical-align:top;">
<a href="%(phone_href)s" style="text-decoration:none!important;"><img border="0" src="%(icon_call)s" width="56" height="56" alt="Zadzwoń do nas" style="display:block!important;border:0!important;"></a>
</td>
<td style="vertical-align:middle;font-family:%(font)s;font-size:15px;line-height:22px;color:%(white)s;">
<a href="%(phone_href)s" style="color:%(white)s;text-decoration:none!important;">Telefon<br><strong>%(phone)s</strong></a>
</td></tr></table>
</td></tr></table>
</td></tr>
<tr><td e-editable="kontakt_godziny" style="font-family:%(font)s;font-size:13px;line-height:20px;color:%(blue)s;padding-top:20px;">Dział Obsługi Klienta pracuje od poniedziałku do piątku, 8:00–16:00.</td></tr>""" % {
        "font": FONT, "white": WHITE, "title": title, "mail": MAIL,
        "icon_mail": ICON_MAIL, "icon_call": ICON_CALL,
        "phone_href": PHONE_HREF, "phone": PHONE, "blue": BLUE}
    return wrap(inner, NAVY_D, 44, 44, "moris-kontakt")


def footer_block():
    inner = """<tr><td align="center" style="padding-bottom:16px;">
<a href="%(home)s" target="_blank" style="text-decoration:none!important;"><img border="0" src="%(logo)s" width="148" height="24" alt="Moris" style="display:block!important;border:0!important;margin:0 auto;"></a>
</td></tr>
<tr><td e-editable="adres" align="center" style="font-family:%(font)s;font-size:13px;line-height:20px;color:%(grey)s;padding-bottom:14px;">
Moris sp. z o.o., ul. Wiejska 27, 41-503 Chorzów &nbsp;&middot;&nbsp; <a href="%(contact)s" target="_blank" style="color:%(navy)s;text-decoration:none!important;">Kontakt</a>
</td></tr>
<tr><td e-editable="rodo" align="center" style="font-family:%(font)s;font-size:11px;line-height:17px;color:%(grey)s;padding-bottom:14px;">%(rodo)s</td></tr>
<tr><td align="center" style="font-family:%(font)s;font-size:13px;line-height:20px;">
<a e-editable="wypis" href="%(unsub)s" target="_blank" style="color:%(navy)s;text-decoration:underline!important;">Wypisz się tutaj</a>
</td></tr>""" % {"home": URL_HOME, "logo": LOGO_FOOTER, "font": FONT,
                 "grey": GREY, "navy": NAVY, "contact": URL_CONTACT,
                 "rodo": RODO, "unsub": UNSUB_PLACEHOLDER}
    return wrap(inner, WHITE, 36, 40, "moris-stopka")


def document(title, preheader, blocks):
    return """<!DOCTYPE html>
<html lang="pl" e-locale="pl-PL" e-is-multilanguage="false" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>%(title)s</title>
<!--[if mso]>
<xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->
<style type="text/css">%(css)s</style>
</head>
<body id="body" style="margin:0;padding:0;width:100%%;background-color:%(page)s;font-family:%(font)s;">
<div ems:preheader style="display:none!important;font-size:1px;color:%(page)s;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">%(pre)s</div>
<div style="display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%%" border="0" cellpadding="0" cellspacing="0" bgcolor="%(page)s" style="background-color:%(page)s;">
<tr><td align="center" style="padding:0;">
<!--[if mso]><table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="%(w)s"><tr><td><![endif]-->
<table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="%(w)s" class="container" style="width:%(w)spx;background-color:%(white)s;">
%(blocks)s
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
<img src="%(pixel)s" height="2" width="2" border="0" alt="" aria-hidden="true" style="display:block;">
</body>
</html>
""" % {"title": title, "css": CSS, "page": PAGE_BG, "font": FONT,
       "pre": preheader, "w": W, "white": WHITE, "blocks": "".join(blocks),
       "pixel": PIXEL_PLACEHOLDER}


# ===========================================================================
#  MAILING 1 — OBSŁUGA PLATFORMY
# ===========================================================================

def mailing_obsluga_platformy():
    blocks = [header_block()]

    blocks.append(hero(
        "Przewodnik po platformie",
        "Zamów stal w&nbsp;cztery kroki",
        "Platforma MORIS.EU to ten sam Moris, którego znasz — z tymi samymi cenami, "
        "warunkami płatności i transportem. Różnica jest jedna: cenę, dostępność "
        "i termin dostawy widzisz od razu, bez czekania na odpowiedź."))

    blocks.append(wrap(
        h2_row("Jak złożyć zamówienie") + steps_rows([
            ("Znajdź produkt",
             "Wpisz profil i wymiar w wyszukiwarkę albo przejdź kategorią — pręty, "
             "płaskowniki, kątowniki, ceowniki, dwuteowniki, profile zamknięte, rury, "
             "blachy, szyny. Przy każdym indeksie widzisz stan magazynowy."),
            ("Ustaw długość i ilość",
             "Potrzebujesz nietypowej długości? Zaznacz cięcie na wymiar. System przeliczy "
             "masę i cenę pozycji od razu — również dla jednej sztuki."),
            ("Wybierz dostawę",
             "Podaj adres, a platforma wyliczy koszt transportu i pokaże termin. Do wyboru "
             "odbiór własny, dostawa standardowa i ciężarówka HDS z rozładunkiem żurawiem."),
            ("Potwierdź zamówienie",
             "Zapłać online — BLIK, karta, Apple Pay, Google Pay, Autopay — albo przelewem "
             "z proformy, zgodnie z warunkami, które masz u nas ustalone."),
        ]), BLUE_L, 40, 40, "moris-kroki"))

    blocks.append(wrap(
        h2_row("Co znajdziesz w swoim panelu") + cards_rows([
            ("Historia zamówień",
             "Wszystkie zamówienia w jednym miejscu — te złożone online i te przyjęte "
             "przez Dział Handlowy.", None, None),
            ("Oferty",
             "Oferta przygotowana przez Twojego opiekuna handlowego czeka na platformie. "
             "Realizujesz ją bez przepisywania pozycji.", None, None),
            ("Zapisane koszyki",
             "Powtarzalne zamówienia odtwarzasz jednym kliknięciem, zamiast składać "
             "listę od nowa.", None, None),
            ("Konfigurator własnych kodów produktów",
             "Podepnij swoje indeksy do naszych — na platformie i w dokumentach zobaczysz "
             "nazwy, których używacie u siebie.", None, None),
        ]), WHITE, 40, 0, "moris-panel"))

    blocks.append(wrap(
        h2_row("Twoje warunki handlowe nie zmieniają się") +
        '<tr><td e-editable="warunki" style="font-family:%s;font-size:16px;line-height:25px;'
        'color:%s;padding-bottom:18px;">Wszystkie indywidualne ustalenia, które mieliśmy '
        'przed uruchomieniem platformy, są na niej odwzorowane automatycznie:</td></tr>'
        % (FONT, GRAPHITE) +
        bullets_rows([
            "<strong>ceny</strong> — Twoja siatka rabatowa, nie cennik katalogowy",
            "<strong>płatności</strong> — uzgodnione terminy i formy rozliczenia",
            "<strong>transport</strong> — warunki dostawy ustalone dla Twoich adresów",
            "<strong>opiekun handlowy</strong> — ten sam, pod tym samym adresem",
        ]) +
        cta_rows("Zaloguj się na moris.eu", URL_LOGIN, 260),
        WHITE, 36, 36, "moris-warunki"))

    blocks.append(contact_block("Masz pytanie o platformę?"))
    blocks.append(footer_block())

    return document(
        "Zamów stal w cztery kroki — przewodnik po platformie MORIS.EU",
        "Cena, dostępność i termin dostawy od razu. Cztery kroki na moris.eu.",
        blocks)


# ===========================================================================
#  MAILING 2 — BUDOWANIE ZAUFANIA
# ===========================================================================

def mailing_zaufanie():
    blocks = [header_block()]

    blocks.append(hero(
        "O Moris",
        "Od 1994 roku dostarczamy stal",
        "Przez trzydzieści lat nie zmieniło się to, co najważniejsze: stal ma być "
        "dostępna, opisana i dowieziona na czas. Zmieniło się to, jak łatwo można "
        "ją u nas zamówić."))

    blocks.append(wrap(
        stats_rows([
            ("1994", "rok założenia firmy"),
            ("~4 000", "indeksów dostępnych z magazynu"),
            ("&gt;50%", "obrotu z klientami stałymi"),
            ("20 m", "wysokość magazynu automatycznego"),
        ]), BLUE_L, 40, 40, "moris-liczby"))

    blocks.append(wrap(
        h2_row("Czym to potwierdzamy") + cards_rows([
            ("ISO 9001:2015",
             "System zarządzania jakością potwierdzony certyfikatem. Do każdej dostawy "
             "wystawiamy dokumenty jakościowe wyrobu.", None, None),
            ("Licencjonowany spedytor",
             "Własna licencja spedycyjna. Organizujemy transport samochodowy i kolejowy "
             "na terenie całej Europy.", URL_DELIV, "Poznaj zasady dostawy"),
            ("Magazyn automatyczny",
             "Wysokie składowanie do 20 m, zintegrowane z systemami IT i maszynami "
             "tnącymi. Stan magazynowy, który widzisz online, jest stanem rzeczywistym.",
             None, None),
            ("Ponad połowa klientów wraca",
             "Ponad 50% obrotu realizujemy z klientami stałymi. To miara, na którą "
             "pracuje się latami, a nie jednym sezonem.", None, None),
        ]), WHITE, 40, 0, "moris-dowody"))

    blocks.append(wrap(
        h2_row("Co to znaczy w Twoim zamówieniu") +
        table_rows(["Zobowiązanie", "Parametr"], [
            ("Wyroby standardowe z magazynu", "3 dni robocze"),
            ("Wyroby cięte na wymiar", "5 dni roboczych"),
            ("Minimum zamówienia", "1 sztuka"),
            ("Zasięg dostawy", "cała Polska"),
            ("Rozładunek HDS — zasięg ramienia", "11 m"),
            ("Dostawa HDS — długość i masa", "do 7 m / 14 t"),
        ]) + divider_row(),
        WHITE, 40, 0, "moris-zobowiazania"))

    blocks.append(wrap(
        '<tr><td e-editable="cytat" style="font-family:%s;font-size:18px;line-height:28px;'
        'font-style:italic;color:%s;padding-bottom:12px;">'
        "&bdquo;[MIEJSCE NA OPINIĘ KLIENTA — do uzupełnienia przed wysyłką. "
        "Wymagana pisemna zgoda klienta na publikację nazwy firmy.]&rdquo;"
        '</td></tr>'
        '<tr><td e-editable="cytat_autor" style="font-family:%s;font-size:14px;'
        'line-height:20px;color:%s;">[Imię i nazwisko, stanowisko, firma]</td></tr>'
        % (FONT, NAVY_D, FONT, GREY),
        BLUE_L, 34, 34, "moris-opinia"))

    blocks.append(wrap(
        h2_row("Sprawdź nas na własnym zamówieniu") +
        '<tr><td e-editable="zamkniecie" style="font-family:%s;font-size:16px;'
        'line-height:25px;color:%s;">Załóż konto albo zaloguj się na istniejące. '
        'Zobaczysz ceny, dostępność i terminy zanim podejmiesz decyzję — bez '
        'zobowiązania i bez czekania na ofertę.</td></tr>' % (FONT, GRAPHITE) +
        cta_rows("Poznaj Moris", URL_ABOUT, 220) +
        '<tr><td style="padding-top:14px;font-family:%s;font-size:14px;line-height:21px;'
        'color:%s;"><a href="%s" target="_blank" style="color:%s;'
        'text-decoration:none!important;font-weight:700;">Dlaczego my &rarr;</a></td></tr>'
        % (FONT, GREY, URL_WHY, NAVY),
        WHITE, 36, 36, "moris-zamkniecie"))

    blocks.append(contact_block("Chcesz porozmawiać, zanim zamówisz?"))
    blocks.append(footer_block())

    return document(
        "Od 1994 roku dostarczamy stal — poznaj Moris",
        "ISO 9001:2015, licencjonowany spedytor, magazyn automatyczny, "
        "ponad połowa obrotu z klientami stałymi.",
        blocks)


# ===========================================================================
#  MAILING 3 — BAZA PRODUKTOWA
# ===========================================================================

def mailing_baza_produktowa():
    blocks = [header_block()]

    blocks.append(hero(
        "Baza produktowa",
        "Około 4 000 indeksów.<br>Wszystkie z magazynu.",
        "Nie musisz pytać o dostępność. Katalog MORIS.EU pokazuje stan magazynowy, "
        "cenę i termin przy każdej pozycji — również wtedy, gdy potrzebujesz "
        "jednej sztuki."))

    blocks.append(wrap(
        h2_row("Dwa światy produktowe") + cards_rows([
            ("Wyroby hutnicze",
             "Pręty okrągłe i sześciokąty ciągnione, płaskowniki ciągnione, walcowane "
             "i szerokie, kątowniki, ceowniki U, UPE i UPN, dwuteowniki, teowniki, "
             "profile zamknięte kwadratowe i prostokątne, rury, blachy.",
             URL_STEEL, "Przejdź do wyrobów hutniczych"),
            ("Kolej",
             "Szyny transportowe, dźwignicowe, tramwajowe i lekkie oraz akcesoria "
             "kolejowe.",
             URL_RAIL, "Przejdź do produktów kolejowych"),
        ]), BLUE_L, 40, 40, "moris-swiaty"))

    blocks.append(wrap(
        h2_row("Gatunki, które trzymamy na stanie") +
        table_rows(["Zastosowanie", "Gatunek"], [
            ("Konstrukcyjny podstawowy", "S235JR"),
            ("Profile zamknięte i rury", "S235JRH"),
            ("Konstrukcyjny podwyższonej wytrzymałości", "S355J2"),
            ("Normalizowany", "S355J2+N"),
            ("Profile zamknięte podwyższonej wytrzymałości", "S355J2H"),
        ]),
        WHITE, 40, 0, "moris-gatunki"))

    blocks.append(wrap(
        h2_row("Przykładowe pozycje z katalogu") +
        table_rows(["Pozycja", "Indeks"], [
            ("Pręt okrągły, konstrukcyjny", "fi 90 S355J2+N L=6 m"),
            ("Szyna kolejowa lekka", "49E1 R260 L=12 m"),
        ]) +
        cta_rows("Otwórz pełny katalog", URL_CATALOG, 250),
        WHITE, 36, 36, "moris-przyklady"))

    blocks.append(wrap(
        h2_row("Nie masz wymiaru katalogowego? Utniemy", WHITE) +
        '<tr><td e-editable="ciecie_lead" style="font-family:%s;font-size:16px;'
        'line-height:25px;color:%s;padding-bottom:16px;">Cięcie zamawiasz razem '
        'z wyrobem — bez osobnego zapytania i bez dopłaty ukrytej w cenie '
        'materiału.</td></tr>' % (FONT, BLUE) +
        bullets_rows([
            "<strong style=\"color:#FFFFFF;\">Cięcie na wymiar 90°</strong> — "
            "dokładnie ta długość, której potrzebujesz",
            "<strong style=\"color:#FFFFFF;\">Cięcie transportowe</strong> — "
            "podział pozycji na 2–6 części, żeby zmieściła się w transporcie",
            "<strong style=\"color:#FFFFFF;\">Termin</strong> — 5 dni roboczych "
            "dla wyrobów ciętych, 3 dni dla standardowych",
        ], marker=ORANGE, color=BLUE) +
        cta_rows("Sprawdź usługę cięcia", URL_CUT, 250),
        NAVY, 40, 40, "moris-ciecie"))

    blocks.append(contact_block("Szukasz pozycji, której nie ma w katalogu?"))
    blocks.append(footer_block())

    return document(
        "Około 4 000 indeksów stali z magazynu — sprawdź katalog MORIS.EU",
        "Pręty, płaskowniki, kątowniki, ceowniki, dwuteowniki, profile, rury, "
        "blachy i szyny — od jednej sztuki.",
        blocks)


# ===========================================================================
#  MAILING 4 — USŁUGI DODATKOWE I TRANSPORT
# ===========================================================================

def mailing_uslugi_i_transport():
    blocks = [header_block()]

    blocks.append(hero(
        "Usługi dodatkowe",
        "Utniemy, dowieziemy,<br>rozładujemy",
        "Stal to połowa zamówienia. Druga połowa to doprowadzenie jej na miejsce "
        "w takiej postaci, w jakiej ma trafić na produkcję. Obie zamawiasz razem — "
        "w tym samym koszyku, z kosztem wyliczonym od razu."))

    # --- cięcie ------------------------------------------------------------
    blocks.append(wrap(
        h2_row("Cięcie na wymiar") +
        '<tr><td e-editable="ciecie_lead" style="font-family:%s;font-size:16px;'
        'line-height:25px;color:%s;padding-bottom:20px;">Nie musisz zamawiać '
        'długości katalogowej i dopasowywać jej u siebie. Cięcie zaznaczasz przy '
        'pozycji w koszyku — bez osobnego zapytania i bez czekania na wycenę.'
        '</td></tr>' % (FONT, GRAPHITE) +
        cards_rows([
            ("Cięcie na wymiar 90°",
             "Dokładnie ta długość, której potrzebujesz. Rozliczamy rzeczywistą "
             "masę pozycji po cięciu, nie masę pręta katalogowego.",
             None, None),
            ("Cięcie transportowe",
             "Podział pozycji na 2–6 części, żeby zmieściła się w Twoim transporcie "
             "albo przeszła przez bramę na miejscu rozładunku.",
             None, None),
        ]) +
        '<tr><td style="padding-top:16px;font-family:%s;font-size:14px;line-height:21px;'
        'color:%s;"><a href="%s" target="_blank" style="color:%s;'
        'text-decoration:none!important;font-weight:700;">Szczegóły usługi cięcia '
        '&rarr;</a></td></tr>' % (FONT, GREY, URL_CUT, ORANGE),
        BLUE_L, 40, 40, "moris-ciecie"))

    # --- transport: trzy drogi --------------------------------------------
    blocks.append(wrap(
        h2_row("Trzy sposoby odbioru") +
        '<tr><td e-editable="transport_lead" style="font-family:%s;font-size:16px;'
        'line-height:25px;color:%s;padding-bottom:20px;">Sposób dostawy wybierasz '
        'na etapie koszyka. Przy każdym widzisz koszt policzony dla Twojego adresu '
        'i termin — zanim potwierdzisz zamówienie.</td></tr>' % (FONT, GRAPHITE) +
        cards_rows([
            ("Odbiór własny",
             "Zamówienie czeka przygotowane w Chorzowie. Bez kosztu transportu, "
             "rozładunek po Twojej stronie.",
             None, None),
            ("Dostawa standardowa",
             "Dowozimy na wskazany adres w całej Polsce. Rozładunek zapewnia "
             "odbiorca — potrzebny dźwig, wózek widłowy albo ekipa.",
             None, None),
            ("Ciężarówka HDS z rozładunkiem",
             "Nie masz czym rozładować? Kierowca zdejmuje towar żurawiem "
             "samochodowym i stawia go tam, gdzie wskażesz.",
             URL_HDS, "Poznaj usługę HDS"),
        ]),
        WHITE, 40, 0, "moris-transport"))

    # --- parametry HDS (granat) -------------------------------------------
    blocks.append(wrap(
        h2_row("Dostawa HDS — parametry", WHITE) +
        '<tr><td e-editable="hds_lead" style="font-family:%s;font-size:16px;'
        'line-height:25px;color:%s;padding-bottom:20px;">Zanim wybierzesz HDS, '
        'sprawdź, czy Twoje zamówienie mieści się w granicach usługi:'
        '</td></tr>' % (FONT, BLUE) +
        table_rows_dark(["Parametr", "Wartość"], [
            ("Zasięg ramienia żurawia", "11 m"),
            ("Maksymalna długość wyrobu", "7 m"),
            ("Maksymalna masa zamówienia", "14 t"),
            ("Zasięg dostawy", "cała Polska"),
            ("Minimum zamówienia", "1 sztuka"),
        ]) +
        '<tr><td e-editable="hds_uwaga" style="font-family:%s;font-size:14px;'
        'line-height:21px;color:%s;padding-top:16px;">Zamówienie przekracza któryś '
        'z parametrów? Napisz do opiekuna handlowego — transport ponadgabarytowy '
        'organizujemy indywidualnie, również koleją.</td></tr>' % (FONT, BLUE),
        NAVY, 40, 40, "moris-hds"))

    # --- jak zamówić -------------------------------------------------------
    blocks.append(wrap(
        h2_row("Jak to zamówić") + steps_rows([
            ("Skompletuj koszyk",
             "Dodaj pozycje z katalogu. Przy każdej widzisz stan magazynowy "
             "i cenę w Twoich warunkach."),
            ("Zaznacz cięcie przy pozycji",
             "Podaj długość albo liczbę części. System przeliczy masę i cenę "
             "pozycji od razu."),
            ("Wybierz sposób dostawy",
             "Wpisz adres i wskaż odbiór własny, dostawę standardową albo "
             "ciężarówkę HDS. Koszt transportu wyliczy się automatycznie."),
        ]),
        BLUE_L, 40, 40, "moris-jak-zamowic"))

    # --- terminy -----------------------------------------------------------
    blocks.append(wrap(
        h2_row("Terminy realizacji") +
        table_rows(["Rodzaj zamówienia", "Termin"], [
            ("Wyroby standardowe z magazynu", "3 dni robocze"),
            ("Wyroby cięte na wymiar", "5 dni roboczych"),
        ]) +
        '<tr><td e-editable="terminy_uwaga" style="font-family:%s;font-size:14px;'
        'line-height:21px;color:%s;padding-top:14px;">Termin widoczny w koszyku '
        'dotyczy Twojego zamówienia i Twojego adresu — nie jest wartością '
        'orientacyjną.</td></tr>' % (FONT, GREY) +
        cta_rows("Policz dostawę w koszyku", URL_LOGIN, 270) +
        '<tr><td style="padding-top:14px;font-family:%s;font-size:14px;line-height:21px;'
        'color:%s;"><a href="%s" target="_blank" style="color:%s;'
        'text-decoration:none!important;font-weight:700;">Zasady dostawy &rarr;</a>'
        '</td></tr>' % (FONT, GREY, URL_DELIV, NAVY),
        WHITE, 40, 36, "moris-terminy"))

    blocks.append(contact_block("Nietypowy gabaryt albo pilny termin?"))
    blocks.append(footer_block())

    return document(
        "Cięcie na wymiar i dostawa z rozładunkiem — usługi dodatkowe Moris",
        "Cięcie 90°, cięcie transportowe, ciężarówka HDS z rozładunkiem żurawiem. "
        "Koszt wyliczany w koszyku.",
        blocks)


# ===========================================================================

TARGETS = [
    ("01-obsluga-platformy.html", mailing_obsluga_platformy),
    ("02-zaufanie.html",          mailing_zaufanie),
    ("03-baza-produktowa.html",   mailing_baza_produktowa),
    ("04-uslugi-i-transport.html", mailing_uslugi_i_transport),
]


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    for name, fn in TARGETS:
        path = os.path.join(here, name)
        with io.open(path, "w", encoding="utf-8") as f:
            f.write(fn())
        print("zapisano %s (%d B)" % (name, os.path.getsize(path)))


if __name__ == "__main__":
    main()
