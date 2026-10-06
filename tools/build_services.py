#!/usr/bin/env python3
"""Xizmat sahifalarini (xizmatlar/<slug>/index.html) va sitemap.xml ni yaratadi.
Ishlatish: python3 tools/build_services.py
Videolar qo'shish: VIDEOS ichida kerakli xizmatga ("YouTube ID", boshlanish_soniyasi, "Sarlavha") qo'shing."""
import html, json, os
BASE = "https://nodatiy.com"
NAME = "Hojimuqon Xalilov Vahobjon o'g'li"
LASTMOD = "2026-10-05"
SERVICES = [
 ("podcast-production","Podcast production","Podcast production","Ko'p kamerali syomka, toza ovoz, yorug'lik va montaj.",
  "Podcast uchun ko'p kamerali syomka, toza ovoz, to'g'ri yorug'lik va montaj. Suratga olishdan YouTube'ga chiqarishgacha bo'lgan jarayonni o'zim boshqaraman.",
  ["Ko'p kamerali syomka","Toza ovoz","Yorug'lik","Montaj","YouTube'ga chiqarish"]),
 ("youtube-kontent","YouTube kontent","YouTube kanal uchun video","Intervyu va suhbatlar, kanal uchun tayyor video va nashr qilish.",
  "Intervyu, suhbat va boshqa formatlardagi videolarni YouTube kanalingiz uchun tayyorlayman: syomka, montaj va nashrga tayyorlash.",
  ["Intervyu va suhbatlar","Montaj","Kanal uchun tayyor video","Nashrga tayyorlash"]),
 ("reels-short-form","Reels va short-form","Reels va short-form","Uzun suhbatdan qisqa, e'tiborni ushlaydigan videolar.",
  "Uzun podcast va suhbatlardan Reels, Shorts va boshqa qisqa formatlar uchun e'tiborni ushlaydigan videolar tayyorlayman.",
  ["Qisqa videolar","Vertikal format","Tez montaj","Ijtimoiy tarmoqlar uchun"]),
 ("tadbir-syomkasi","Tadbir syomkasi","Tadbir yoki safar syomkasi","Konferensiya, uchrashuv va yopiq tadbirlarni suratga olish.",
  "Konferensiya, uchrashuv va yopiq tadbirlarni suratga olaman va ularni tayyor videoga aylantiraman.",
  ["Konferensiya va uchrashuvlar","Yopiq tadbirlar","Syomka va montaj"]),
 ("travel-event-video","Travel va event video","Tadbir yoki safar syomkasi","Safar va ekspeditsiyalardan emotsiyaga boy kontent.",
  "Safar, ekspeditsiya va ko'p kunlik tadbirlarni suratga olib, emotsiyaga boy video tayyorlayman.",
  ["Safar va ekspeditsiyalar","Ko'p kunlik syomka","Emotsiyaga boy montaj"]),
 ("online-kurs-kontenti","Online kurs kontenti","Online kurs kontenti","Darslarni suratga olish va tushunarli qilib montaj qilish.",
  "Online kurs darslarini suratga olaman va tushunarli, tartibli qilib montaj qilaman.",
  ["Dars syomkasi","Toza ovoz va tasvir","Tushunarli montaj"]),
]
# slug -> [("YouTube ID", boshlanish_soniyasi, "Sarlavha (ixtiyoriy)"), ...]
VIDEOS = {s[0]: [] for s in SERVICES}
VIDEOS["youtube-kontent"] = [  # vaqt belgisi 0 bo'lsa video boshidan ochiladi
    ('GQxH5K4hQxQ', 0, "Gumanoid robotlar, AI startap, Logistika, Biznes ta'lim | Akmal Paiziev  #Dayjest"),
    ('RIca_MOMgrA', 0, "Dangasallik aslida yo'qmi? | Soatov Mirjalol"),
    ('9qGSB5K0Mgw', 0, 'Diqqatingiz o‘g‘irlanmoqda, iltimos ehtiyot bo‘ling!'),
    ('JcXFes2h7rs', 0, 'IELTS WRITING BALLIMNI 6.0 DAN 8.0 GA KO’TARGAN 5 QADAM'),
    ('XcRwFlRFBjs', 0, 'Premiere Pro: Montajni osonlashtiradigan 7 ta yashirin plagin'),
    ('bsPky9leQ3o', 0, 'DADAM BILAN UNUTILMAS SAFAR: BOZTEPE, AYASOFYA, SÜMELA, VARVARA, AYDER, GANITA VA DOLMABAHÇE'),
    ('7SUu1xocusE', 0, "Bunga e'tibor bermasangiz, kanalingiz barbod bo'ladi!"),
]
VIDEOS["podcast-production"] = [
    ('wyULmvkAKmo', 17, "KOFIRLAR, TASHQI KUCH, MAZHAB MONOPOLIYASI, DINIY TA'LIM, G'ARB, KONSPIROLOGIYA – ABROR MUXTOR ALIY"),
    ('_KWBw6mrXLU', 4, "O'zbek parlamentiga ishonch, Prezident hokimiyati, Energetika islohoti, Ta'lim, Tramp siyosati"),
    ('L2YAq8itUDM', 7256, 'Taqdirga iymon keltirish, Radikalizm, Zamonaviy hayot va xilma-xil fikrlik!'),
    ('VRlKZz98wOs', 744, 'Genetik Pasport: Farzandingiz kelajagini DNK orqali bilish mumkinmi?'),
    ('zWl2hJdDJss', 3357, 'Ramazon Temirov: Jangchi uchun eng qiyin sinov nima?'),
    ('WWQlabnxy6Q', 8, 'Muvaffaqiyat formulasi: Eng yosh (male) IELTS 9.0 sohibi bilan ochiq suhbat'),
    ('gV_9UrX5TlU', 2, "Shaxsiy brendni boshlash yo'llari ko'p, lekin qaysi biridan yurish kerak? | G'anisher Otaboyev"),
    ('rUyQ7KiMm3U', 5, "18-25 yosh bo'lsangiz - millionlarni topishga kech emas!"),
    ('PuxD8ThC3-U', 3230, 'Saroy masxarabozlari, Mirshakardan xafa bo‘lgan tadbirkor, Din kulgiga qarshimi?'),
    ('fCoziXAD0R8', 1199, 'Coworkinglar qanday pul ishlaydi? C-Space asoschisi bilan biznes model va real tajriba haqida suhbat'),
    ('OkjI1S8FAjg', 33, 'Andijon voqealari (2005), Toshkentdagi boylar, xususiy qamoqxona, parlament tirikmi?'),
    ('Q2b0D1yhV3s', 86, 'Har bir O‘zbek ko‘rishi shart bo‘lgan kino! Sarvar Karimov'),
    ('OdDpfLR6Ye8', 23, "Tadbirkorlik falsafasi, rivojlanish yo'li, milliy o'zlik harakati! | Abdukarim Mirzayev"),
    ('n8q4ax1RA_c', 3326, "Maktab inqirozi, so'z erkinligi ahvoli va sun'iy intellekt bilan kelajak | Azam Qahramoniy"),
    ('E3a5dKLMewE', 17, "Dinlar urushga sabab bo'ladimi? Xayrulla Umarov bilan suhbat"),
]
PLAY = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="rgba(0,0,0,.5)"/><path d="M26 20l18 12-18 12z" fill="#fff"/></svg>'
e = html.escape
def page(s):
    slug,title,goal,short,lead,pts = s; url=f"{BASE}/xizmatlar/{slug}/"; vids=VIDEOS.get(slug,[])
    if vids:
        cards=''.join(f'<a class="vcard" href="https://www.youtube.com/watch?v={v[0]}{'&amp;t='+str(v[1])+'s' if v[1] else ''}" target="_blank" rel="noopener" aria-label="{e(v[2] if len(v)>2 and v[2] else title)}: YouTube\'da ko\'rish"><img loading="lazy" decoding="async" width="480" height="360" alt="{e(v[2] if len(v)>2 and v[2] else title+" namunasi "+str(i+1))}" src="https://i.ytimg.com/vi_webp/{v[0]}/hqdefault.webp">{PLAY}</a>' for i,v in enumerate(vids))
        works=f'<div class="works">{cards}</div>'
    else:
        works='<div class="works">'+'<div class="vcard ph"><span>Tez orada</span></div>'*3+'</div>\n<p class="note">Bu bo\'limdagi ishlar tez orada qo\'shiladi. Hozircha <a href="/#ishlar">asosiy sahifadagi namunalarni</a> ko\'rishingiz mumkin.</p>'
    others=''.join(f'<a href="/xizmatlar/{o[0]}/">{e(o[1])}</a>' for o in SERVICES if o[0]!=slug)
    ld=json.dumps({"@context":"https://schema.org","@graph":[
      {"@type":"Service","name":title,"description":lead,"url":url,"areaServed":"UZ","provider":{"@type":"Person","name":NAME,"alternateName":"Hojimuqon","url":BASE+"/"}},
      {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Bosh sahifa","item":BASE+"/"},{"@type":"ListItem","position":2,"name":"Xizmatlar","item":BASE+"/#xizmatlar"},{"@type":"ListItem","position":3,"name":title,"item":url}]}]},ensure_ascii=False,separators=(',',':'))
    full=f"{title} | Hojimuqon, Nodatiy"
    return f'''<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(full)}</title>
<meta name="description" content="{e(lead)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="{url}">
<link rel="icon" href="/assets/icon-nk-96.png" type="image/png" sizes="96x96">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta name="theme-color" content="#060607">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nodatiy">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{e(full)}">
<meta property="og:description" content="{e(lead)}">
<meta property="og:image" content="{BASE}/assets/og-3.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://i.ytimg.com">
<script type="application/ld+json">{ld}</script>
<link rel="stylesheet" href="/assets/page.css">
</head>
<body>
<header><div class="wrap">
<a href="/" aria-label="Bosh sahifa"><img src="/assets/logo-sm.webp" width="150" height="83" alt="Hojimuqon"></a>
<nav><a href="/#ishlar">Ishlar</a><a href="/#hamkorlar">Loyihalar</a><a href="/#xizmatlar">Xizmatlar</a><a href="/#haqimda">Men haqimda</a></nav>
<a class="btn sm" href="/?x={slug}#buyurtma">Buyurtma berish</a>
</div></header>
<main class="wrap">
<nav class="crumbs" aria-label="Sahifa yo'li"><a href="/">Bosh sahifa</a> / <a href="/#xizmatlar">Xizmatlar</a> / <span>{e(title)}</span></nav>
<h1>{e(title)}</h1>
<p class="lead">{e(lead)}</p>
<ul class="chips">{''.join(f"<li>{e(p)}</li>" for p in pts)}</ul>
<div class="cta"><a class="btn" href="/?x={slug}#buyurtma">Buyurtma berish</a></div>
<section>
<h2>Qilingan ishlar</h2>
{works}
</section>
<section>
<h2>Boshqa xizmatlar</h2>
<div class="more">{others}</div>
</section>
<div class="end"><h2>Loyihangizni muhokama qilamiz</h2><a class="btn" href="/?x={slug}#buyurtma">Buyurtma berish</a></div>
</main>
<footer>© 2026 {e(NAME)}, nodatiy.com<br><a href="/credits.html">Rasm mualliflari</a></footer>
</body>
</html>
'''
for s in SERVICES:
    d=f"xizmatlar/{s[0]}"; os.makedirs(d,exist_ok=True); open(d+"/index.html","w").write(page(s))
urls=[(BASE+"/","1.0",True)]+[(f"{BASE}/xizmatlar/{s[0]}/","0.8",False) for s in SERVICES]
sm='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
for u,p,img in urls:
    sm+=f'  <url>\n    <loc>{u}</loc>\n    <lastmod>{LASTMOD}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>{p}</priority>\n'+(f'    <image:image><image:loc>{BASE}/assets/og-3.jpg</image:loc></image:image>\n' if img else '')+'  </url>\n'
open("sitemap.xml","w").write(sm+'</urlset>\n'); print("Yaratildi:",len(SERVICES),"sahifa + sitemap")
