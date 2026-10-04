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
