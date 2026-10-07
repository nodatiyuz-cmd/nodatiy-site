// /api/views?ids=ID1,ID2,... -> {"ID1": 12345, ...}   (ko'rilish soni, ochiq videolar uchun)
// /api/views?total=1        -> {"total": 2194653, "videos": 34}   (saytdagi barcha videolar yig'indisi)
// Kalit: Cloudflare Pages -> Settings -> Variables and secrets -> YOUTUBE_API_KEY (Secret).
// Kalit kodda saqlanmaydi va brauzerga yuborilmaydi. Natija 1 soat keshlanadi.
import { ALLOWED } from "./_ids.js";

const OK = new Set(ALLOWED);
const HEAD = { "content-type": "application/json; charset=utf-8" };
const json = (obj, cc) => new Response(JSON.stringify(obj), { headers: { ...HEAD, "cache-control": cc } });

async function counts(ids, key) {
  const out = {};
  for (let i = 0; i < ids.length; i += 50) { // YouTube bir so'rovda 50 tagacha ID qabul qiladi
    const api = "https://www.googleapis.com/youtube/v3/videos?part=statistics&fields=items(id,statistics/viewCount)&id=" + ids.slice(i, i + 50).join(",") + "&key=" + encodeURIComponent(key);
    const r = await fetch(api);
    if (!r.ok) throw new Error("YouTube API: " + r.status);
    for (const it of (await r.json()).items || []) {
      const c = Number(it.statistics && it.statistics.viewCount);
      if (Number.isFinite(c)) out[it.id] = c; // ko'rilish soni yashirilgan bo'lsa, qo'shilmaydi
    }
  }
  return out;
}

export async function onRequestGet({ request, env, waitUntil }) {
  const url = new URL(request.url);
  const total = url.searchParams.has("total");
  // faqat saytdagi videolar (kvotani begonalar sarflab yubormasligi uchun)
  const ids = total ? [...OK] : [...new Set((url.searchParams.get("ids") || "").split(",").map(s => s.trim()).filter(id => OK.has(id)))].sort().slice(0, 50);
  if (!ids.length) return json({}, "public, max-age=300");

  const cache = caches.default;
  const key = new Request(url.origin + "/__views/" + (total ? "total" : ids.join(",")));
  const hit = await cache.match(key);
  if (hit) return hit;

  if (!env.YOUTUBE_API_KEY) return json({}, "no-store");
  try {
    const c = await counts(ids, env.YOUTUBE_API_KEY);
    const res = json(total ? { total: Object.values(c).reduce((a, b) => a + b, 0), videos: Object.keys(c).length } : c, "public, max-age=3600");
    const put = cache.put(key, res.clone());
    if (waitUntil) waitUntil(put); else await put;
    return res;
  } catch (e) {
    return json({}, "no-store");
  }
}
