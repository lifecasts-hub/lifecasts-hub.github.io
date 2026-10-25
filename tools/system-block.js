/* App (file://) : la connexion Google se fait sur le site (appairage, copié de la Bible). Code dans pairings/{code} ; le site y dépose le idToken Google, l'app fait signInWithCredential puis supprime le document. */
let FA=null,FD=null,pairOff=null;const PAIR_URL="https://lifecasts-hub.github.io/LifeCasts-System/";
function lcToast(t){const e=q("lerr");e.textContent=t;e.hidden=false}
function fbBtn(){const g=q("gbtn");if(g.firstChild)return;const b=E("button",{className:"btn",textContent:"Continuer avec Google"});b.onclick=fbPair;g.append(b)}
async function fbPair(){if(!FA)return lcToast("Connexion indisponible (hors ligne ?)");
 try{const a=new Uint8Array(18);crypto.getRandomValues(a);const c=[...a].map(x=>x.toString(16).padStart(2,"0")).join("");
  await FD.doc("pairings/"+c).set({at:Date.now()});localStorage.setItem("lc.pair",c);fbPairWait(c);
  location.href=PAIR_URL+"?pair="+c}
 catch(e){lcToast("Connexion indisponible (hors ligne ?)")}}
function fbPairWait(c){if(pairOff)pairOff();const r=FD.doc("pairings/"+c),end=()=>{if(pairOff){pairOff();pairOff=null}localStorage.removeItem("lc.pair");r.delete().catch(()=>{})};
 pairOff=r.onSnapshot(async s=>{const d=s.data();if(!s.exists||(d&&Date.now()-d.at>15*6e4))return end();if(!d||!d.t)return;
  end();try{await FA.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(d.t))}catch(e){lcToast("Connexion refusée : "+(e.code||""))}},()=>{})}
function fbUser(u){if(!u)return;const o=user();if(o&&o.id===u.uid)return;
 try{localStorage.setItem(KEY,JSON.stringify({id:u.uid,name:u.displayName||u.email||"Compte Google",email:u.email||"",picture:u.photoURL||"",provider:"google",since:(o&&o.since)||Date.now()}))}catch(e){}
 S.guest=false;save();boot()}
// Site : page ouverte par l'app avec ?pair=CODE → bouton de liaison (le popup exige un clic).
function pairSite(){const c=new URLSearchParams(location.search).get("pair");if(!c||!/^[0-9a-f]{36}$/.test(c))return;
 const o=document.createElement("div");o.style.cssText="position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(0,0,0,.5);padding:16px;font:15px -apple-system,BlinkMacSystemFont,sans-serif";
 const B="border:0;border-radius:12px;padding:12px 16px;font:inherit;margin-top:14px;width:100%;background:#141413;color:#fff";
 const show=(t,x,btn)=>{o.innerHTML=`<div style="background:#fff;color:#141413;border-radius:22px;padding:22px;width:min(92vw,420px)"><h3 style="margin:0 0 8px">${t}</h3><div style="opacity:.8">${x}</div>${btn?`<button style="${B}">${btn}</button>`:""}</div>`;return o.querySelector("button")};
 const go=async()=>{const pr=new firebase.auth.GoogleAuthProvider();pr.setCustomParameters({prompt:"select_account"});
  try{const r=await FA.signInWithPopup(pr),t=r.credential&&r.credential.idToken;if(!t)throw{code:"no-token"};
   await FD.doc("pairings/"+c).update({t,uid:r.user.uid});history.replaceState(null,"",location.pathname);
   show("C'est fait !","Votre compte est lié. Revenez dans l'application LifeCasts System.","Retour à l'application").onclick=()=>{location.href="lifecasts://system"};
   setTimeout(()=>{location.href="lifecasts://system"},800)}
  catch(e){show("Échec de la connexion",(e.code==="not-found"||e.code==="permission-denied")?"Ce lien a expiré. Relancez la connexion depuis l'application.":"Erreur : "+(e.code||"inconnue"),"Réessayer").onclick=go}};
 document.body.appendChild(o);show("Connexion à l'application","Connectez-vous avec Google pour lier l'application LifeCasts System à votre compte.","Se connecter avec Google").onclick=go}
if(location.protocol==="file:"||new URLSearchParams(location.search).get("pair"))fbInit(true).then(()=>{FA=firebase.auth();FD=firebase.firestore();
 if(location.protocol==="file:"){FA.onAuthStateChanged(fbUser);const c=localStorage.getItem("lc.pair");if(c)fbPairWait(c)}else pairSite()}).catch(()=>{});
