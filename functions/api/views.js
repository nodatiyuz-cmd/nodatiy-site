// /api/views?ids=ID1,ID2,... -> {"ID1": 12345, ...}   (ko'rilish soni, ochiq videolar uchun)
// /api/views?total=1        -> {"total": 2194653, "videos": 34, "seconds": 123456}   (saytdagi barcha videolar: ko'rilish yig'indisi va umumiy davomiylik)
// Kalit: Cloudflare Pages -> Settings -> Variables and secrets -> YOUTUBE_API_KEY (Secret).
// Kalit kodda saqlanmaydi va brauzerga yuborilmaydi. Natija 1 soat keshlanadi.
import { ALLOWED } from "./_ids.js";

const OK = new Set(ALLOWED);
const HEAD = { "content-type": "application/json; charset=utf-8" };
const json = (obj, cc) => new Response(JSON.stringify(obj), { headers: { ...HEAD, "cache-control": cc } });

// ISO 8601 davomiylik (PT1H2M3S) -> soniya
const secs = d => { const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(d || ""); return m ? (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0) : 0; };

async function counts(ids, key, dur) {
  const out = {}, len = {};
  for (let i = 0; i < ids.length; i += 50) { // YouTube bir so'rovda 50 tagacha ID qabul qiladi
    const api = "https://www.googleapis.com/youtube/v3/videos?part=statistics" + (dur ? ",contentDetails" : "") + "&fields=items(id,statistics/viewCount" + (dur ? ",contentDetails/duration" : "") + ")&id=" + ids.slice(i, i + 50).join(",") + "&key=" + encodeURIComponent(key);
    const r = await fetch(api);
    if (!r.ok) throw new Error("YouTube API: " + r.status);
    for (const it of (await r.json()).items || []) {
      const c = Number(it.statistics && it.statistics.viewCount);
      if (Number.isFinite(c)) out[it.id] = c; // ko'rilish soni yashirilgan bo'lsa, qo'shilmaydi
      if (dur) len[it.id] = secs(it.contentDetails && it.contentDetails.duration);
    }
  }
  return [out, len];
}

export async function onRequestGet({ request, env, waitUntil }) {
  const url = new URL(request.url);
  const total = url.searchParams.has("total");
  // faqat saytdagi videolar (kvotani begonalar sarflab yubormasligi uchun)
  const ids = total ? [...OK] : [...new Set((url.searchParams.get("ids") || "").split(",").map(s => s.trim()).filter(id => OK.has(id)))].sort().slice(0, 120);
  if (!ids.length) return json({}, "public, max-age=300");

  const cache = caches.default;
  const key = new Request(url.origin + "/__views/" + (total ? "total" : ids.join(",")));
  const hit = await cache.match(key);
  if (hit) return hit;

  if (!env.YOUTUBE_API_KEY) return json({}, "no-store");
  try {
    const [c, len] = await counts(ids, env.YOUTUBE_API_KEY, total);
    const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
    const res = json(total ? { total: sum(c), videos: Object.keys(c).length, seconds: sum(len) } : c, "public, max-age=3600");
    const put = cache.put(key, res.clone());
    if (waitUntil) waitUntil(put); else await put;
    return res;
  } catch (e) {
    return json({}, "no-store");
  }
}
