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
const REPOS={bible:"lifecasts-hub/The-Bible-App",cantiques:"lifecasts-hub/Songs-Book"};
async function ghVersions(repo){
  const r=await fetch("https://api.github.com/repos/"+repo+"/commits?path=index.html&per_page=100");if(!r.ok)throw new Error("GitHub indisponible");
  const out=[],seen=new Set();
  for(const c of await r.json()){const msg=c.commit.message.replace(/\n*Co-Authored-By:[\s\S]*$/i,"").trim(),m=msg.match(/^v?(\d+(?:\.\d+)+)\s*[:\-–—]?\s*([\s\S]*)$/i);
    if(!m||seen.has(m[1]))continue;seen.add(m[1]);out.push({version:m[1],date:Date.parse(c.commit.committer.date),notes:m[2].trim()})}
  return out.sort((x,y)=>vcmp(y.version,x.version));
}
