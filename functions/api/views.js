// /api/views?ids=ID1,ID2,... -> {"ID1": 12345, ...}
// YouTube Data API orqali ochiq videolarning ko'rilish sonini oladi.
// Kalit: Cloudflare Pages -> Settings -> Variables and secrets -> YOUTUBE_API_KEY (Secret).
// Kalit kodda saqlanmaydi va brauzerga yuborilmaydi. Natija 1 soat keshlanadi.
import { ALLOWED } from "./_ids.js";

const OK = new Set(ALLOWED);
const HEAD = { "content-type": "application/json; charset=utf-8" };

export async function onRequestGet({ request, env, waitUntil }) {
  const url = new URL(request.url);
  // faqat saytdagi videolar (kvotani begonalar sarflab yubormasligi uchun)
  const ids = [...new Set((url.searchParams.get("ids") || "").split(",").map(s => s.trim()).filter(id => OK.has(id)))].sort().slice(0, 50);
  if (!ids.length) return new Response("{}", { headers: { ...HEAD, "cache-control": "public, max-age=300" } });

  const cache = caches.default;
  const key = new Request(url.origin + "/__views/" + ids.join(","));
  const hit = await cache.match(key);
  if (hit) return hit;

  if (!env.YOUTUBE_API_KEY) return new Response("{}", { headers: { ...HEAD, "cache-control": "no-store" } });
  try {
    const api = "https://www.googleapis.com/youtube/v3/videos?part=statistics&fields=items(id,statistics/viewCount)&id=" + ids.join(",") + "&key=" + encodeURIComponent(env.YOUTUBE_API_KEY);
    const r = await fetch(api);
    if (!r.ok) throw new Error("YouTube API: " + r.status);
    const j = await r.json();
    const out = {};
    for (const it of j.items || []) {
      const c = Number(it.statistics && it.statistics.viewCount);
      if (Number.isFinite(c)) out[it.id] = c; // ko'rilish soni yashirilgan bo'lsa, qo'shilmaydi
    }
    const res = new Response(JSON.stringify(out), { headers: { ...HEAD, "cache-control": "public, max-age=3600" } });
    const put = cache.put(key, res.clone());
    if (waitUntil) waitUntil(put); else await put;
    return res;
  } catch (e) {
    return new Response("{}", { headers: { ...HEAD, "cache-control": "no-store" } });
  }
}
