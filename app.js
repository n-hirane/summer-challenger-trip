const screens=[...document.querySelectorAll('.screen')];
const nav=[...document.querySelectorAll('[data-target]')];
function show(id){
  screens.forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.target===id));
  window.scrollTo(0,0);
}
nav.forEach(b=>b.addEventListener('click',()=>show(b.dataset.target)));

const lists={
  live:[
    {id:"ticket",label:"チケット"},
    {id:"ticket-case",label:"チケットケース"},
    {id:"fc-card",label:"FC会員証"},
    {id:"penlight",label:"ペンライト"},
    {id:"muffler-towel",label:"マフラータオル"},
    {id:"live-t",label:"ライブT"},
    {id:"wristband",label:"リストバンド"},
    {id:"rubber-band-2",label:"ラババン×2"},
    {id:"kurari-uchiwa",label:"くらりうちわ"},
    {id:"fanservice-uchiwa",label:"ファンサうちわ"},
    {id:"nuinori-2",label:"ぬいのり×2"},
    {id:"kurari-pouch",label:"くらり共(くらりポーチ)"},
    {id:"acrylic-stand-2",label:"アクスタ×2"},
    {id:"gintape-case",label:"銀テケース"},
    {id:"minaca-trade",label:"交換用MINACA"},
    {id:"minaca-spare",label:"あまりMINACA"},
    {id:"valuables-ziplock",label:"貴重品用ジップロック"},
    {id:"large-plastic-bag",label:"荷物全体ビニール袋"}
  ],
  travel:[
    {id:"wallet",label:"財布"},
    {id:"smartphone",label:"スマホ"},
    {id:"mobile-battery",label:"モバイルバッテリー"},
    {id:"handkerchief",label:"ハンカチ"},
    {id:"makeup-pouch-travel",label:"化粧ポーチ"},
    {id:"kaganuikagamaru",label:"かがぬい＆かがまる"},
    {id:"water-bottle",label:"水筒"},
    {id:"case-a5-a4",label:"A5ケース or A4ケース"}
  ],
  hotel:[
    {id:"makeup-pouch-hotel",label:"化粧ポーチ"},
    {id:"power-strip-cable",label:"電源タップ＆長い充電コード"},
    {id:"contacts-3days",label:"コンタクト(3日分)"},
    {id:"glasses",label:"眼鏡"},
    {id:"eye-drops",label:"目薬"},
    {type:"subhead",label:"着替え"},
    {id:"underwear",label:"下着",sub:true},
    {id:"socks",label:"靴下",sub:true},
    {id:"shirt",label:"シャツ",sub:true},
    {id:"pants",label:"ズボン",sub:true},
    {id:"sandals",label:"サンダル",sub:true},
    {id:"roomwear",label:"部屋着",sub:true},
    {id:"walking-pouch",label:"館内歩き用の持ち歩きポーチ"},
    {id:"body-wipes",label:"汗拭きシート"},
    {id:"hair-iron",label:"ヘアアイロン"},
    {id:"hair-milk",label:"ヘアミルク"},
    {id:"towel",label:"タオル"},
    {type:"subhead",label:"お風呂セット"},
    {id:"body-towel",label:"ボディタオル",sub:true},
    {id:"face-wash",label:"洗顔フォーム",sub:true},
    {id:"bath-bag",label:"持ち込み用袋",sub:true},
    {id:"wet-tissue",label:"ウエットティッシュ"},
    {id:"small-trash-bags",label:"小さめのごみ袋"}
  ]
};

const KEY="summer-challenger-checks-v2";
let state=JSON.parse(localStorage.getItem(KEY)||"{}");

function renderChecks(){
  Object.entries(lists).forEach(([group,items])=>{
    const el=document.getElementById(group+"Checks");
    el.innerHTML=items.map(item=>{
      if(item.type==="subhead"){
        return `<div class="check-subhead">${item.label}</div>`;
      }
      const id=`${group}-${item.id}`;
      return `<label class="check-item ${item.sub?'sub-item':''} ${state[id]?'done':''}">
        <input type="checkbox" data-id="${id}" ${state[id]?'checked':''}>
        <span>${item.label}</span>
      </label>`;
    }).join("");
  });

  document.querySelectorAll('.check-item input').forEach(input=>input.addEventListener('change',e=>{
    state[e.target.dataset.id]=e.target.checked;
    localStorage.setItem(KEY,JSON.stringify(state));
    renderChecks();
  }));
}

document.getElementById("resetChecks").addEventListener("click",()=>{
  if(confirm("チェック状態をすべて未チェックに戻しますか？")){
    state={};
    localStorage.removeItem(KEY);
    renderChecks();
  }
});
renderChecks();
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
