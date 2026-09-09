const screens=[...document.querySelectorAll('.screen')];
const nav=[...document.querySelectorAll('[data-target]')];
function show(id){
  screens.forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===id));
  window.scrollTo(0,0);
}
nav.forEach(b=>b.addEventListener('click',()=>show(b.dataset.target)));

const lists={
 live:["紙チケット","MINACA・交換用グッズ","ペンライト","モバイルバッテリー","身分証 / 財布","雨具（レインコート）","飲み物","暑さ対策"],
 travel:["着替え","洗面用品","常備薬","充電器","エコバッグ","折りたたみ傘"],
 hotel:["部屋着","ランドリー用袋","朝食利用","貴重品管理","お土産スペース","ホテル鍵"]
};
const KEY="summer-challenger-checks-v1";
let state=JSON.parse(localStorage.getItem(KEY)||"{}");
function renderChecks(){
  Object.entries(lists).forEach(([group,items])=>{
    const el=document.getElementById(group+"Checks");
    el.innerHTML=items.map((item,i)=>{
      const id=group+"-"+i;
      return `<label class="check-item ${state[id]?'done':''}"><input type="checkbox" data-id="${id}" ${state[id]?'checked':''}><span>${item}</span></label>`;
    }).join("");
  });
  document.querySelectorAll('.check-item input').forEach(input=>input.addEventListener('change',e=>{
    state[e.target.dataset.id]=e.target.checked;
    localStorage.setItem(KEY,JSON.stringify(state));
    renderChecks();
  }));
}
document.getElementById("resetChecks").addEventListener("click",()=>{
  if(confirm("チェック状態をすべて未チェックに戻しますか？")){state={};localStorage.removeItem(KEY);renderChecks();}
});
renderChecks();

const d=new Date();
const tripDate=new Date(2026,8,d.getDate());
let title="旅行前";
if(d>=new Date(2026,8,12)&&d<new Date(2026,8,13)) title="DAY 1 · LIVE";
else if(d>=new Date(2026,8,13)&&d<new Date(2026,8,14)) title="DAY 2 · LIVE";
else if(d>=new Date(2026,8,14)&&d<new Date(2026,8,15)) title="DAY 3 · FUJI-Q";
else if(d>=new Date(2026,8,15)) title="旅行終了";
document.getElementById("todayTitle").textContent=title;

if("serviceWorker" in navigator){
  window.addEventListener("load", async ()=>{
    try{
      const registration=await navigator.serviceWorker.register("service-worker.js");
      await registration.update();
    }catch(e){
      console.warn("Service Worker update failed",e);
    }
  });
}

const spotButtons=[...document.querySelectorAll('.spot[data-spot]')];
const mapMarkers=[...document.querySelectorAll('.map-marker[data-spot]')];
function selectSpot(number, scrollToMap=false){
  spotButtons.forEach(b=>b.classList.toggle('selected',b.dataset.spot===number));
  mapMarkers.forEach(m=>m.classList.toggle('selected',m.dataset.spot===number));
  if(scrollToMap){
    document.getElementById('mapWrap')?.scrollIntoView({behavior:'smooth',block:'center'});
  }
}
spotButtons.forEach(button=>button.addEventListener('click',()=>{
  selectSpot(button.dataset.spot,true);
}));
mapMarkers.forEach(marker=>marker.addEventListener('click',()=>{
  selectSpot(marker.dataset.spot,false);
}));
