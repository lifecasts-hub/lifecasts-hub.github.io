/* LifeCasts — outils communs aux pages Applications / Admin */
const FBC={apiKey:"AIzaSyBXXuPijD1GRpRQV3OfnWK_zHGJOoLLmeM",authDomain:"lifecasts-17e42.firebaseapp.com",projectId:"lifecasts-17e42",storageBucket:"lifecasts-17e42.firebasestorage.app",messagingSenderId:"625851569945",appId:"1:625851569945:web:421d879406d64d57061788"};
const ADMINS=["lifecasts.h@gmail.com"]; // doit correspondre aux règles Firestore
const FBV="https://www.gstatic.com/firebasejs/10.14.1/firebase-";
const $=id=>document.getElementById(id);
function loadScript(src){return new Promise((ok,ko)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=ko;document.head.append(s)})}
async function fbInit(withAuth){
  await loadScript(FBV+"app-compat.js");
  await Promise.all((withAuth?["auth","firestore"]:["firestore"]).map(m=>loadScript(FBV+m+"-compat.js")));
  firebase.initializeApp(FBC);return firebase.firestore();
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fdate(ms){return ms?new Date(ms).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):""}
function vcmp(a,b){a=String(a).split(".").map(Number);b=String(b).split(".").map(Number);for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d>0?1:-1}return 0}
function nl(s){return esc(s).replace(/\n/g,"<br>")}

/* Versions lues sur GitHub : chaque commit « vX.Y : nouveautés » qui modifie index.html = une version */
/* REGISTRE UNIQUE DES APPLICATIONS — pour publier une nouvelle app, ajouter UNE ligne ici (le dépôt doit avoir index.html + icon-192.png).
   Le site (Applications, System : dock, mises à jour, À propos) se met à jour tout seul. mot = mot-clé pour retrouver une ancienne fiche Firestore sans id. */
const LC_APPS=[
 {id:"bible",repo:"lifecasts-hub/The-Bible-App",nom:"Bible LifeCasts",court:"Bible",mot:"bible",description:"La Parole, partout. Même hors connexion.",ordre:1},
 {id:"cantiques",repo:"lifecasts-hub/Songs-Book",nom:"Cantiques",court:"Cantiques",mot:"cantique",description:"Les chants d'autrefois, dans votre poche.",ordre:2},
 {id:"notes",repo:"lifecasts-hub/The-Notes-App",nom:"Notes",court:"Notes",mot:"note",description:"Vos notes et celles de la Bible, au même endroit.",ordre:3},
 {id:"system",repo:"lifecasts-hub/LifeCasts-System",nom:"LifeCasts System",court:"System",mot:"system",description:"Votre bureau LifeCasts : toutes vos applications au même endroit.",ordre:4}
];
LC_APPS.forEach(a=>{a.dir=a.repo.split("/")[1];a.url="/"+a.dir+"/";a.iconUrl="https://lifecasts-hub.github.io"+a.url+"icon-192.png"});
const REPOS=Object.fromEntries(LC_APPS.map(a=>[a.id,a.repo]));
async function ghVersions0(repo){
  const r=await fetch("https://api.github.com/repos/"+repo+"/commits?path=index.html&per_page=100");if(!r.ok)throw new Error("GitHub indisponible");
  const out=[],seen=new Set();
  for(const c of await r.json()){const msg=c.commit.message.replace(/\n*Co-Authored-By:[\s\S]*$/i,"").trim(),m=msg.match(/^v?(\d+(?:\.\d+)+)\s*[:\-–—]?\s*([\s\S]*)$/i);
    if(!m||seen.has(m[1]))continue;seen.add(m[1]);out.push({version:m[1],date:Date.parse(c.commit.committer.date),notes:m[2].trim()})}
  out.sort((x,y)=>vcmp(y.version,x.version));
  /* Version réellement publiée : var B="x.y" dans index.html de l'app */
  try{const cur=await liveVersion(repo);if(cur){const i=out.findIndex(v=>v.version===cur);
    if(i>0)out.unshift(out.splice(i,1)[0]);else if(i<0)out.unshift({version:cur,date:out[0]?out[0].date:Date.now(),notes:""});
    out.forEach((v,k)=>{if(k&&vcmp(v.version,cur)>0)v.skip=1})}}catch(e){}
  return out.filter(v=>!v.skip);
}
async function liveVersion(repo){const r=await fetch("/"+repo.split("/")[1]+"/index.html",{cache:"no-store"});if(!r.ok)return null;const m=(await r.text()).match(/var\s+B\s*=\s*["']([\d.]+)["']/);return m?m[1]:null}

/* Icônes SVG (remplacent les emojis) */
var ICO=(function(){var P={
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
book:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
note:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c1 0 1.6-.8 1.6-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7H16a6 6 0 0 0 6-6c0-4.6-4.5-8.4-10-8.4z"/>',
image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
disk:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>'};
return function(n,s){return '<svg class="ico" viewBox="0 0 24 24" width="'+(s||'1em')+'" height="'+(s||'1em')+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[n]+'</svg>'}})();

/* Téléchargements : fichiers .apk / .dmg joints à la dernière Release GitHub */
async function ghDownloads0(repo){
  try{const r=await fetch("https://api.github.com/repos/"+repo+"/contents/downloads");if(r.ok){const best={};
    for(const x of await r.json()){const n=x.name.toLowerCase(),t=n.endsWith(".apk")?"Android (APK)":n.endsWith(".dmg")?"Mac (DMG)":/\.(exe|msi)$/.test(n)?"Windows (EXE)":null;if(!t)continue;
      const v=(x.name.match(/(\d+(?:\.\d+)+)/)||[])[1]||"0";if(!best[t]||vcmp(v,best[t].tag)>0)best[t]={label:t,url:"https://lifecasts-hub.github.io/"+repo.split("/")[1]+"/downloads/"+encodeURIComponent(x.name),size:x.size,tag:v}}
    const out=Object.values(best);if(out.length)return out}}catch(e){}
  try{const r=await fetch("https://data.jsdelivr.com/v1/packages/gh/"+repo+"@main?structure=flat");if(r.ok){const best={};
    for(const f of (await r.json()).files||[]){const m=f.name.match(/^\/downloads\/([^/]+)$/);if(!m)continue;const n=m[1].toLowerCase(),t=n.endsWith(".apk")?"Android (APK)":n.endsWith(".dmg")?"Mac (DMG)":/\.(exe|msi)$/.test(n)?"Windows (EXE)":null;if(!t)continue;
      const v=(m[1].match(/(\d+(?:\.\d+)+)/)||[])[1]||"0";if(!best[t]||vcmp(v,best[t].tag)>0)best[t]={label:t,url:"https://lifecasts-hub.github.io/"+repo.split("/")[1]+"/downloads/"+encodeURIComponent(m[1]),size:f.size,tag:v}}
    const out=Object.values(best);if(out.length)return out}}catch(e){}
  const r=await fetch("https://api.github.com/repos/"+repo+"/releases/latest");if(!r.ok)return [];const j=await r.json();
  return (j.assets||[]).map(x=>{const n=x.name.toLowerCase();const t=n.endsWith(".apk")?"Android (APK)":n.endsWith(".dmg")?"Mac (DMG)":/\.(exe|msi)$/.test(n)?"Windows (EXE)":null;return t&&{label:t,url:x.browser_download_url,size:x.size,tag:j.tag_name}}).filter(Boolean)}

/* Cache 15 min (limite GitHub : 60 requêtes/h) + repli si GitHub ne répond pas */
async function ghCached(k,fn,fb){let c;try{c=JSON.parse(localStorage.getItem("lcgh:"+k))}catch(e){}
  if(c&&Date.now()-c.t<9e5)return c.v;
  try{const v=await fn();if(Array.isArray(v)&&!v.length&&c)return c.v;try{if(!(Array.isArray(v)&&!v.length))localStorage.setItem("lcgh:"+k,JSON.stringify({t:Date.now(),v}))}catch(e){}return v}
  catch(e){if(c)return c.v;if(fb)return fb();throw e}}
function ghVersions(repo){return ghCached("v:"+repo,()=>ghVersions0(repo),async()=>{const v=await liveVersion(repo);return v?[{version:v,date:null,notes:""}]:[]})}
function ghDownloads(repo){return ghCached("d2:"+repo,()=>ghDownloads0(repo),()=>[])}
