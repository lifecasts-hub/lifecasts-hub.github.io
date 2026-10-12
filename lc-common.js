/* LifeCasts — outils communs aux pages Applications / Admin */
const FBC={apiKey:"AIzaSyBXXuPijD1GRpRQV3OfnWK_zHGJOoLLmeM",authDomain:"lifecasts-17e42.firebaseapp.com",projectId:"lifecasts-17e42",storageBucket:"lifecasts-17e42.firebasestorage.app",messagingSenderId:"625851569945",appId:"1:625851569945:web:421d879406d64d57061788"};
const ADMINS=["justsrufus.lok@gmail.com"]; // doit correspondre aux règles Firestore
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
