# Центр Плова — website

Static site for Кафе «Центр Плова» (Bishkek, three branches). No build step. Same structure
and effects as the Nomad Manti site, adapted for Centr Plova.

```bash
python3 -m http.server 8643     # then open http://localhost:8643
```
(ES modules need a server; opening index.html from disk won't load the menu, branches or 3D.)

## Structure
| Path | What |
|---|---|
| `index.html` | Intro, 3-reel hero, story, pillars, 3D signature dishes, menu, halls & booths, gallery, reviews, branches, footer |
| `css/style.css` | Design tokens at the top (brand red, saffron, teal velvet, cream) |
| `js/main.js` | Smooth scroll (Lenis), GSAP scroll animations, menu tabs, branch switcher + map, 2GIS review card with live QR |
| `js/menu-data.js` | **The menu — edit prices/items here** (from the Instagram "Меню" highlight, Oct 2026; prices in сом) |
| `js/site-config.js` | **Branches, phones, hours, 2GIS links, delivery URLs** |
| `js/dishes3d.js` | three.js scene with 4 procedural dishes: plov, manti, boso lagman, shashlik |
| `assets/photos/` | Food & interior photos from instagram.com/centr_plova |
| `assets/video/` | Reels from the account, 720p, audio removed (WebM + MP4) — hero: hall / plov-kazan / table; final: lanterns |
| `assets/source/` | Original downloaded reels (not served, git-ignored) |
| `print/review-card.html` | Printable A5 table cards with a 2GIS review QR, one branch at a time (`?b=zhibek`, `?b=tugolbai`, `?b=mkr5`) |

## Swapping in Blender models
Export each dish as **glTF Binary (.glb)** to `assets/models/plov.glb`, `manti.glb`, `lagman.glb`,
`shashlik.glb`. The site loads a .glb automatically if it exists, otherwise uses the procedural model.

## Before launch — check with the owner
- `LINKS.website` in `js/site-config.js` is a placeholder (`eldarttyy.github.io/centr-plova`) — set the real
  URL; the table-card QR uses it.
- Address of the 5 мкр branch: the bio says "5 микрорайон, 66Б", the delivery story says "ул. Карла-Маркса, 66/1".
  Жибек-Жолу is 527 in the bio but 2GIS shows "1111".
- Hours (10:00–23:00 daily, all branches) come from the "График работы" post.
- Rights to the photos and reels (they're the restaurant's own Instagram content).
- Some menu descriptions are short summaries of the ingredient lines on the menu cards; a few dishes have none.
- Review quotes are short excerpts from public 2GIS reviews of the Жибек-Жолу branch.

## Reviews
Each branch's review link is `<2GIS firm URL>/tab/reviews`. The QR code on the site and on the
printable card is generated in the browser from `site-config.js`, so it updates if a link changes.
Every star rating sends guests to 2GIS — don't redirect unhappy guests to a private form instead.

## Delivery (Glovo / Yandex Eats)
Paste the store URL into `DELIVERY` in `js/site-config.js`; the button appears automatically.
