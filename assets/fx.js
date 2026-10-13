/* Butun sayt bo'ylab kursor effekti: kursor ortidan yuradigan yumshoq fon nuri (matnlarga ta'sir qilmaydi). Faqat sichqonchada. */
(()=>{
if(!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
const aura=document.createElement("div");aura.className="aura";aura.setAttribute("aria-hidden","true");document.body.appendChild(aura);
let ax=0,ay=0,raf=0;
const flush=()=>{raf=0;aura.style.transform="translate3d("+ax+"px,"+ay+"px,0)"};
addEventListener("pointermove",e=>{
  if(e.pointerType!=="mouse")return;
  ax=e.clientX;ay=e.clientY;aura.classList.add("on");if(!raf)raf=requestAnimationFrame(flush);
},{passive:true});
document.addEventListener("mouseout",e=>{if(!e.relatedTarget)aura.classList.remove("on")});
})();
