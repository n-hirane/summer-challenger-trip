const screens=[...document.querySelectorAll('.screen')];
const nav=[...document.querySelectorAll('[data-target]')];
function show(id){
  screens.forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===id));
  window.scrollTo(0,0);
}
nav.forEach(b=>b.addEventListener('click',()=>show(b.dataset.target)));

const checklists={
natsumi:{name:"なつみ",
live:[["ticket","チケット"],["ticket-case","チケットケース"],["fc","FC会員証"],["penlight","ペンライト"],["towel","マフラータオル"],["live-t","ライブT"],["rubber2","ラババン×2"],["kurari-uchiwa","くらりうちわ"],["kurari-bag","くらり巾着"],["acsta","アクスタ"],["gintape","銀テケース"],["ziplock","貴重品用ジップロック"],["bigbag","荷物全体ビニール袋"]],
travel:[["wallet","財布"],["phone","スマホ"],["battery","モバイルバッテリー"],["handkerchief","ハンカチ"],["makeup","化粧ポーチ"],["nuinori","ぬいのり"],["kaga","かがぬい＆かがまる"],["bottle","水筒"],["case","A5ケース or A4ケース"]],
hotel:[["makeup","化粧ポーチ"],["power","電源タップ＆長い充電コード"],["contacts","コンタクト(3日分)"],["glasses","眼鏡"],["#","着替え"],["underwear","下着",1],["socks","靴下",1],["shirt","シャツ",1],["pants","ズボン",1],["roomwear","部屋着",1],["pouch","館内歩き用の持ち歩きポーチ"],["iron","ヘアアイロン"],["milk","ヘアミルク"],["towel","タオル"],["#","お風呂セット"],["bodytowel","ボディタオル",1],["facewash","洗顔フォーム",1],["bathbag","持ち込み用袋",1],["wet","ウエットティッシュ"],["trash","小さめのごみ袋"]]},
yu:{name:"ゆう",
live:[["#","ライブ関連"],["ticket","チケット",1],["holder","チケットホルダー",1],["fc","FC会員証",1],["#","グッズ"],["penlight","ペンライト",1],["tshirt","Tシャツ",1],["towel","マフラータオル",1],["kurari","くらりうちわ",1],["wrist","リストバンド",1],["rubber2","ラババン×２",1],["#","推し活関連"],["fan","ファンサうちわ",1],["nuinori2","ぬいのり×２",1],["kurari-pouch","くらり共(くらりポーチ)",1],["acsta2","アクスタ×２",1],["gintape","銀テケース",1]],
travel:[["pouch","色々入ってるポーチ"],["wax","ワックス、スプレー"],["eyedrops","目薬"],["sweat","汗拭きシート"],["battery","モバイルバッテリー"],["adapter","ＡＣアダプタ"],["bottle","水筒"]],
hotel:[["#","着替え"],["pants3","パンツ×３",1],["socks3","靴下×３",1],["tshirt3","Ｔシャツ×３",1],["yshirt2","Ｙシャツ×２",1],["bottoms2","ズボン×２",1],["sandals","サンダル",1],["#","その他"],["trash3","ゴミ袋×３",1],["minaca-trade","交換用MINACA",1],["minaca-spare","余りMINACA",1]]}};
const PROFILE_KEY="summer-challenger-profile-v1", STATE_KEY="summer-challenger-checks-v3";
let activeProfile=localStorage.getItem(PROFILE_KEY); if(!checklists[activeProfile]) activeProfile=null;
let state={}; try{state=JSON.parse(localStorage.getItem(STATE_KEY)||"{}")||{}}catch(e){state={}}
const realItems=a=>a.filter(x=>x[0]!=="#");
function updateProgress(){
 if(!activeProfile)return;
 let done=0,total=0;
 ["live","travel","hotel"].forEach(g=>{
  const items=realItems(checklists[activeProfile][g]), d=items.filter(x=>state[`${activeProfile}-${g}-${x[0]}`]).length;
  done+=d; total+=items.length;
  const p=document.getElementById(g+"Progress"); if(p)p.textContent=`${d} / ${items.length}`;
 });
 document.getElementById("checkProgress").textContent=`${done} / ${total} チェック済み`;
 document.getElementById("checkProfileName").textContent=checklists[activeProfile].name;
}
function renderChecks(){
 if(!activeProfile){document.getElementById("profilePicker").hidden=false;return}
 ["live","travel","hotel"].forEach(g=>{
  const el=document.getElementById(g+"Checks");
  el.innerHTML=checklists[activeProfile][g].map(x=>{
   if(x[0]==="#")return `<div class="check-subhead">${x[1]}</div>`;
   const id=`${activeProfile}-${g}-${x[0]}`;
   return `<label class="check-item ${x[2]?"sub-item":""} ${state[id]?"done":""}"><input type="checkbox" data-id="${id}" ${state[id]?"checked":""}><span>${x[1]}</span></label>`;
  }).join("");
 });
 document.querySelectorAll(".check-item input").forEach(i=>i.addEventListener("change",e=>{state[e.target.dataset.id]=e.target.checked;localStorage.setItem(STATE_KEY,JSON.stringify(state));renderChecks()}));
 updateProgress();
}
function chooseProfile(p){activeProfile=p;localStorage.setItem(PROFILE_KEY,p);document.getElementById("profilePicker").hidden=true;renderChecks()}
document.querySelectorAll("[data-profile-choice]").forEach(b=>b.addEventListener("click",()=>chooseProfile(b.dataset.profileChoice)));
document.getElementById("changeProfile").addEventListener("click",()=>document.getElementById("profilePicker").hidden=false);
document.getElementById("resetChecks").addEventListener("click",()=>{if(!activeProfile)return;if(confirm(`${checklists[activeProfile].name}のチェック状態をすべて未チェックに戻しますか？`)){["live","travel","hotel"].forEach(g=>realItems(checklists[activeProfile][g]).forEach(x=>delete state[`${activeProfile}-${g}-${x[0]}`]));localStorage.setItem(STATE_KEY,JSON.stringify(state));renderChecks()}});
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
