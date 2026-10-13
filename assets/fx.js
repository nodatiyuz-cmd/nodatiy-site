/* Butun sayt bo'ylab kursor effekti: matn ustida rang-barang gradient va kursor ortidan yuradigan yumshoq nur. Faqat sichqonchada. */
(()=>{
if(!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
const SEL="h1,h2,h3,h4,p,li,figcaption,label,nav a,.lead,.stats b,.stats span,blockquote,dt,dd";
const NO="a,button,img,svg,input,select,textarea,video,iframe,canvas,picture";
const ok=new WeakMap();
const check=el=>{let v=ok.get(el);if(v===undefined){const cs=getComputedStyle(el);const bg=cs.backgroundColor;v=!el.querySelector(NO)&&cs.backgroundImage==="none"&&(bg==="rgba(0, 0, 0, 0)"||bg==="transparent")&&el.textContent.trim().length>0;ok.set(el,v)}return v};
const aura=document.createElement("div");aura.className="aura";aura.setAttribute("aria-hidden","true");document.body.appendChild(aura);
let ax=0,ay=0,raf=0,cur=null;
const flush=()=>{raf=0;aura.style.transform="translate3d("+ax+"px,"+ay+"px,0)"};
const enter=el=>{clearTimeout(el._t);if(!el.classList.contains("fx")){el.classList.add("fx");void el.offsetWidth}el.classList.add("hot")};
const leave=el=>{el.classList.remove("hot");el._t=setTimeout(()=>{if(!el.classList.contains("hot"))el.classList.remove("fx")},700)};
addEventListener("pointermove",e=>{
  if(e.pointerType!=="mouse")return;
  ax=e.clientX;ay=e.clientY;aura.classList.add("on");if(!raf)raf=requestAnimationFrame(flush);
  let el=e.target.closest?e.target.closest(SEL):null;if(el&&!check(el))el=null;
  if(el!==cur){if(cur)leave(cur);cur=el;if(el)enter(el)}
  if(el){const r=el.getBoundingClientRect();el.style.setProperty("--mx",(e.clientX-r.left)+"px");el.style.setProperty("--my",(e.clientY-r.top)+"px")}
},{passive:true});
document.addEventListener("mouseout",e=>{if(!e.relatedTarget){aura.classList.remove("on");if(cur){leave(cur);cur=null}}});
})();
