# Génère store-app.html (LifeStore pour l'APK + source OTA) depuis store.html.
# Usage : python3 tools/build-store-app.py X.Y   (puis commit "vX.Y : …")
import re,sys
V=sys.argv[1];R="https://lifecasts-hub.github.io/"
s=open("store.html").read();lc=open("lc-common.js").read()
n=open("tools/ota-template.html").read()  # blocs OTA (repris de Notes)
i=n.find('<script>/*LC-OTA*/');j=n.find('</script>',i)+9;head=re.sub(r'var B="[\d.]+"','var B="%s"'%V,n[i:j])
k=n.rfind('/*LC-OTA*/');a=n.rfind('<script',0,k);b=n.find('</script>',k)+9
mod=n[a:b].replace('APP="notes"','APP="store"').replace(R+"The-Notes-App/index.html",R+"store-app.html").replace("typeof notes!==\"undefined\"","typeof LC_APPS!==\"undefined\"").replace("🔴 ","").replace("#1f2a44","#c98a1b")
s=s.replace('<script src="lc-common.js?v=14"></script>','<script>'+lc+'</script>')
s=re.sub(r'(src|href)="(?!https?:|#|\$|data:|lifecasts:|mailto:)/?([^"]*)"',lambda m:'%s="%s%s"'%(m[1],R,m[2]),s)
s=s.replace('<meta charset="utf-8">','<meta charset="utf-8">\n'+head,1).replace('</body>',mod+'\n</body>')
open("store-app.html","w").write(s);print("ok",len(s))
