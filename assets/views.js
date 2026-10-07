/* YouTube ko'rilish sonini kartalarga qo'shadi: /api/views dan oladi. Xato bo'lsa jim o'tadi. */
(()=>{
/* Umumiy ko'rilish ("videolarning umumiy ko'rilishi") — saytdagi hamma videolar yig'indisi, jonli */
const tv=document.getElementById("tv");
if(tv)fetch("/api/views?total=1").then(r=>r.ok?r.json():{}).then(d=>{
  if(typeof d.total!=="number"||d.total<1e6)return; /* kam bo'lsa, HTML dagi qiymat qoladi */
  const set=()=>{tv.textContent=(d.total<1e7?String(Math.floor(d.total/1e5)/10).replace(".",","):String(Math.floor(d.total/1e6)))+" mln";tv.title=d.total.toLocaleString("en-US").replace(/,/g," ")+" marta ko'rilgan"};
  tv.parentElement.classList.contains("in")?setTimeout(set,1700):set(); /* sanash animatsiyasi tugagach */
}).catch(()=>{});
const els=[...document.querySelectorAll("a.vcard[data-id],a.card[data-id]")];
if(!els.length)return;
const MIN=1000; /* shundan kam ko'rilgan videolarda belgi chiqmaydi (0 ham) */
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
    if(typeof c!=="number"||c<MIN||a.querySelector(".vw"))return;
    const s=document.createElement("span");s.className="vw";s.innerHTML=EYE+"<b>"+fmt(c)+"</b>";
    s.setAttribute("title",c.toLocaleString("en-US").replace(/,/g," ")+" marta ko'rilgan");
    a.appendChild(s);
  });
}).catch(()=>{});
})();
