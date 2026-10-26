# Génère index.html de l'app LifeCasts System (dépôt LifeCasts-System : APK + source OTA) depuis system.html.
# Usage : python3 tools/build-system-app.py X.Y [../lifecasts-system/index.html]   (puis commit "vX.Y : …")
import re,sys
V=sys.argv[1];out=sys.argv[2] if len(sys.argv)>2 else "../lifecasts-system/index.html"
R="https://lifecasts-hub.github.io/"
s=open("system.html").read();lc=open("lc-common.js").read();blk=open("tools/system-block.js").read()
n=open("tools/ota-template.html").read()
def rep(t,a,b):
    assert a in t,a;return t.replace(a,b,1)
i=n.find('<script>/*LC-OTA*/');j=n.find('</script>',i)+9;head=re.sub(r'var B="[\d.]+"','var B="%s"'%V,n[i:j])
k=n.rfind('/*LC-OTA*/');a=n.rfind('<script',0,k);b=n.find('</script>',k)+9
mod=n[a:b].replace('APP="notes"','APP="system"').replace(R+"The-Notes-App/index.html",R+"LifeCasts-System/index.html").replace("typeof notes!==\"undefined\"","typeof LC_APPS!==\"undefined\"").replace("🔴 ","").replace("#1f2a44","#2a1c14")
lc=rep(lc,"async function fbInit(withAuth){","let _FBI=null;function fbInit(a){return _FBI||(_FBI=fbInit0(a))}\nasync function fbInit0(withAuth){")
s=rep(s,'<script src="lc-common.js?v=14"></script>','<script>'+lc+'</script>')
s=rep(s,"function initGoogle(){","function initGoogle(){if(location.protocol===\"file:\")return fbBtn();")
s=rep(s,"function logout(){try{","function logout(){try{if(window.firebase&&firebase.apps&&firebase.apps.length)firebase.auth().signOut()}catch(e){}try{")
s=rep(s,'new URLSearchParams(location.search).get("app");if(want)','(new URLSearchParams(location.search).get("app")||location.hash.slice(1));if(want)')
s=rep(s,"boot();bnSync();",blk+"\nboot();bnSync();")
s=rep(s,'<meta charset="utf-8">','<meta charset="utf-8">\n<base href="%s">\n'%R+head)
s=rep(s,'</body>',mod+'\n</body>')
open(out,"w").write(s);print("ok",len(s))
