# nodatiy.com

Hojimuqon portfolio sayti: podcast va YouTube production. Oddiy statik sayt (HTML, CSS, JS), build kerak emas.

## Tuzilma
- `index.html`: butun sayt (stil va skript ichida)
- `assets/`: logolar, fotosurat, Telegram uchun `og.jpg`
- `404.html`, `robots.txt`, `sitemap.xml`: xizmat fayllari
- `_headers`: Cloudflare Pages xavfsizlik va kesh sozlamalari
- `apps-script/Code.gs`: arizalarni Google Sheets'ga yozuvchi skript

## Yangilash
Faylni GitHub'da o'zgartirib (yoki **Add file, Upload files** orqali almashtirib) **Commit changes** bosing. Cloudflare Pages 1-2 daqiqada saytni o'zi yangilaydi.

## Cloudflare Pages sozlamalari
Framework: None. Build command: bo'sh. Build output directory: `/` (bo'sh qoldirsa ham bo'ladi). Production branch: `main`.

## Video va matnlarni o'zgartirish
`index.html` oxiridagi `V` ro'yxati: har bir qator `["YouTube ID", boshlanish soniyasi]`.

## Ariza formasini Google Sheets'ga ulash
1. sheets.new ochib, **Extensions, Apps Script** ga `apps-script/Code.gs` ni qo'ying.
2. **Deploy, New deployment, Web app**: Execute as **Me**, access **Anyone**.
3. Chiqqan manzilni `index.html` dagi `const SHEET_URL=""` ga qo'ying.

## Xizmat sahifalari
`xizmatlar/<xizmat>/index.html` sahifalari `tools/build_services.py` skripti orqali yaratiladi. Videolar qo'shish: skriptdagi `VIDEOS` lug'atiga `("YouTube ID", boshlanish_soniyasi, "Sarlavha")` qo'shib, `python3 tools/build_services.py` ni ishga tushiring. Skript `sitemap.xml` ni ham yangilaydi.

Reels (9:16) bo'limi: `VERTICAL` ro'yxatidagi xizmatlar vertikal kartalar bilan chiqadi, karta bosilganda video sayt ichidagi pleyerda ochiladi (`tools/modal.html`). Muqovani qo'lda almashtirish uchun `assets/reels/<YouTube ID>.webp` fayl qo'ying.

## AI va agentlar uchun
`robots.txt` AI qidiruv botlariga ochiq. `llms.txt` va `llms-full.txt` fayllari `python3 tools/build_services.py` orqali yaratiladi (matnlari skript oxirida; saytdagi ma'lumot o'zgarsa, ularni ham yangilang). Xizmat sahifalarida `ItemList` JSON-LD bor.

## YouTube ko'rilish soni
`functions/api/views.js` (Cloudflare Pages Function) YouTube Data API dan ko'rilish sonini oladi va `assets/views.js` kartalarga chiqaradi. Kalit: Cloudflare Pages → Settings → Variables and secrets → `YOUTUBE_API_KEY` (Secret, Production). Kalitni kodga yozmang. Kalit qo'shilgach yangi deploy kerak. Ruxsat etilgan video ID lar `functions/api/_ids.js` da (build skripti yaratadi).
