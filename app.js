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

const PROFILE_KEY="summer-challenger-profile-v1";
const STATE_KEY="summer-challenger-checks-v3";
const CUSTOM_KEY="summer-challenger-custom-items-v1";
const DELETED_KEY="summer-challenger-deleted-fixed-items-v1";

let activeProfile=localStorage.getItem(PROFILE_KEY);
if(!checklists[activeProfile]) activeProfile=null;

let state={};
try{ state=JSON.parse(localStorage.getItem(STATE_KEY)||"{}")||{}; }catch(e){ state={}; }

let customItems={};
try{ customItems=JSON.parse(localStorage.getItem(CUSTOM_KEY)||"{}")||{}; }catch(e){ customItems={}; }
if(!customItems || typeof customItems!=="object") customItems={};

let deletedFixed={};
try{ deletedFixed=JSON.parse(localStorage.getItem(DELETED_KEY)||"{}")||{}; }catch(e){ deletedFixed={}; }
if(!deletedFixed || typeof deletedFixed!=="object") deletedFixed={};

const realItems=a=>a.filter(x=>x[0]!=="#");

function customKey(profile,group){ return `${profile}-${group}`; }
function fixedDeleteKey(profile,group,id){ return `${profile}-${group}-${id}`; }

function getCustomItems(profile,group){
  const key=customKey(profile,group);
  return Array.isArray(customItems[key]) ? customItems[key] : [];
}
function saveCustomItems(){ localStorage.setItem(CUSTOM_KEY,JSON.stringify(customItems)); }
function saveDeletedFixed(){ localStorage.setItem(DELETED_KEY,JSON.stringify(deletedFixed)); }

function sanitizeLabel(value){
  return value.replace(/\s+/g," ").trim().slice(0,80);
}

function visibleFixedItems(profile,group){
  return realItems(checklists[profile][group]).filter(x=>!deletedFixed[fixedDeleteKey(profile,group,x[0])]);
}

function countGroup(profile,group){
  const fixed=visibleFixedItems(profile,group);
  const custom=getCustomItems(profile,group);
  const all=[
    ...fixed.map(x=>({id:x[0],custom:false})),
    ...custom.map(x=>({id:x.id,custom:true}))
  ];
  const done=all.filter(x=>{
    const prefix=x.custom?"custom":"fixed";
    return state[`${profile}-${group}-${prefix}-${x.id}`];
  }).length;
  return {done,total:all.length};
}

function updateProgress(){
  if(!activeProfile)return;
  let done=0,total=0;
  ["live","travel","hotel"].forEach(g=>{
    const c=countGroup(activeProfile,g);
    done+=c.done;
    total+=c.total;
    const p=document.getElementById(g+"Progress");
    if(p)p.textContent=`${c.done} / ${c.total}`;
  });
  const all=document.getElementById("checkProgress");
  if(all)all.textContent=`${done} / ${total} チェック済み`;
  const who=document.getElementById("checkProfileName");
  if(who)who.textContent=checklists[activeProfile].name;
}

function renderFixedItems(profile,group){
  return checklists[profile][group].map(x=>{
    if(x[0]==="#")return `<div class="check-subhead">${x[1]}</div>`;
    if(deletedFixed[fixedDeleteKey(profile,group,x[0])]) return "";
    const id=`${profile}-${group}-fixed-${x[0]}`;
    return `<div class="custom-check-row ${state[id]?"done":""}">
      <label class="check-item ${x[2]?"sub-item":""}">
        <input type="checkbox" data-id="${id}" ${state[id]?"checked":""}>
        <span>${x[1]}</span>
      </label>
      <button class="delete-custom" type="button" data-delete-fixed="${x[0]}" data-group="${group}" data-label="${x[1]}" aria-label="${x[1]}を削除">削除</button>
    </div>`;
  }).join("");
}

function renderCustomItems(profile,group){
  return getCustomItems(profile,group).map(item=>{
    const id=`${profile}-${group}-custom-${item.id}`;
    return `<div class="custom-check-row ${state[id]?"done":""}">
      <label class="check-item custom-item">
        <input type="checkbox" data-id="${id}" ${state[id]?"checked":""}>
        <span>${item.label}</span>
      </label>
      <button class="delete-custom" type="button" data-delete-custom="${item.id}" data-group="${group}" aria-label="${item.label}を削除">削除</button>
    </div>`;
  }).join("");
}

function renderChecks(){
  if(!activeProfile){
    const picker=document.getElementById("profilePicker");
    if(picker)picker.hidden=false;
    return;
  }

  ["live","travel","hotel"].forEach(g=>{
    const el=document.getElementById(g+"Checks");
    el.innerHTML=renderFixedItems(activeProfile,g)+renderCustomItems(activeProfile,g);
  });

  document.querySelectorAll(".check-item input").forEach(i=>i.addEventListener("change",e=>{
    state[e.target.dataset.id]=e.target.checked;
    localStorage.setItem(STATE_KEY,JSON.stringify(state));
    renderChecks();
  }));

  document.querySelectorAll("[data-delete-custom]").forEach(button=>{
    button.addEventListener("click",()=>{
      const group=button.dataset.group;
      const id=button.dataset.deleteCustom;
      const key=customKey(activeProfile,group);
      const item=getCustomItems(activeProfile,group).find(x=>x.id===id);
      if(!item)return;
      if(confirm(`「${item.label}」を削除しますか？`)){
        customItems[key]=getCustomItems(activeProfile,group).filter(x=>x.id!==id);
        delete state[`${activeProfile}-${group}-custom-${id}`];
        saveCustomItems();
        localStorage.setItem(STATE_KEY,JSON.stringify(state));
        renderChecks();
      }
    });
  });

  document.querySelectorAll("[data-delete-fixed]").forEach(button=>{
    button.addEventListener("click",()=>{
      const group=button.dataset.group;
      const id=button.dataset.deleteFixed;
      const label=button.dataset.label;
      if(confirm(`「${label}」を削除しますか？`)){
        deletedFixed[fixedDeleteKey(activeProfile,group,id)]=true;
        delete state[`${activeProfile}-${group}-fixed-${id}`];
        saveDeletedFixed();
        localStorage.setItem(STATE_KEY,JSON.stringify(state));
        renderChecks();
      }
    });
  });

  updateProgress();
}

function chooseProfile(p){
  activeProfile=p;
  localStorage.setItem(PROFILE_KEY,p);
  const picker=document.getElementById("profilePicker");
  if(picker)picker.hidden=true;
  renderChecks();
}

function openAddDialog(group){
  if(!activeProfile)return;
  const input=document.getElementById("customItemInput");
  const dialog=document.getElementById("customItemDialog");
  dialog.dataset.group=group;
  input.value="";
  dialog.hidden=false;
  setTimeout(()=>input.focus(),50);
}
function closeAddDialog(){
  document.getElementById("customItemDialog").hidden=true;
}
function addCustomItem(){
  if(!activeProfile)return;
  const dialog=document.getElementById("customItemDialog");
  const group=dialog.dataset.group;
  const input=document.getElementById("customItemInput");
  const label=sanitizeLabel(input.value);
  if(!label){ input.focus(); return; }
  const key=customKey(activeProfile,group);
  if(!Array.isArray(customItems[key]))customItems[key]=[];
  const id=`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
  customItems[key].push({id,label});
  saveCustomItems();
  closeAddDialog();
  renderChecks();
}

document.querySelectorAll("[data-profile-choice]").forEach(b=>b.addEventListener("click",()=>chooseProfile(b.dataset.profileChoice)));
document.getElementById("changeProfile")?.addEventListener("click",()=>{
  document.getElementById("profilePicker").hidden=false;
});
document.querySelectorAll("[data-add-group]").forEach(b=>{
  b.addEventListener("click",()=>openAddDialog(b.dataset.addGroup));
});
document.getElementById("customItemCancel")?.addEventListener("click",closeAddDialog);
document.getElementById("customItemSave")?.addEventListener("click",addCustomItem);
document.getElementById("customItemInput")?.addEventListener("keydown",e=>{
  if(e.key==="Enter")addCustomItem();
});

document.getElementById("resetChecks").addEventListener("click",()=>{
  if(!activeProfile)return;
  if(confirm(`${checklists[activeProfile].name}のチェック状態をすべて未チェックに戻しますか？`)){
    Object.keys(state).forEach(key=>{
      if(key.startsWith(`${activeProfile}-`)) delete state[key];
    });
    localStorage.setItem(STATE_KEY,JSON.stringify(state));
    renderChecks();
  }
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
