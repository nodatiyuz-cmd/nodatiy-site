/* YouTube ko'rilish sonini kartalarga qo'shadi: /api/views dan oladi. Xato bo'lsa jim o'tadi. */
(()=>{
const els=[...document.querySelectorAll("a.vcard[data-id],a.card[data-id]")];
if(!els.length)return;
const ids=[...new Set(els.map(a=>a.dataset.id))];
const EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
/* Format: 850 -> "850", 3 450 -> "3,4 ming", 85 000 -> "85 ming", 1 250 000 -> "1,2 mln" (har doim pastga yaxlitlanadi) */
const fmt=n=>{
  if(n<1e3)return String(n);
  if(n<1e4)return String(Math.floor(n/100)/10).replace(".",",")+" ming";
  if(n<1e6)return Math.floor(n/1e3)+" ming";
  if(n<1e7)return String(Math.floor(n/1e5)/10).replace(".",",")+" mln";
  return Math.floor(n/1e6)+" mln";
};
fetch("/api/views?ids="+ids.join(",")).then(r=>r.ok?r.json():{}).then(d=>{
  els.forEach(a=>{
    const c=d[a.dataset.id];
    if(typeof c!=="number"||a.querySelector(".vw"))return;
    const s=document.createElement("span");s.className="vw";s.innerHTML=EYE+"<b>"+fmt(c)+"</b>";
    s.setAttribute("title",c.toLocaleString("en-US").replace(/,/g," ")+" marta ko'rilgan");
    a.appendChild(s);
  });
}).catch(()=>{});
})();
