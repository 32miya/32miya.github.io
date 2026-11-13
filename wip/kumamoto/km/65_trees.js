/* 台地の斜面の林（両方の時代）: 石垣のきわと石段は避ける。熊本城は「銀杏城」とも呼ばれ、清正が植えたと伝わる大銀杏が本丸にある */
TS=TSETS.both;
for(let i=0;i<7000;i++){ const x=INR.x0+3+rnd()*(INR.x1-INR.x0-6),z=INR.z0+3+rnd()*(INR.z1-INR.z0-6); if(hillH(x,z)<1||platAt(x,z)) continue; if(PLAT.some(p=>p.wall&&rDist(p,x,z)<3.5)) continue; if(RAMPS.some(r=>inR(r,x,z,3))) continue; if(!okT(x,z)) continue;
  const r=rnd(); if(r<.22) addPine(x,z,1+rnd()*.6); else if(r<.32) addRound(x,z,1.2+rnd()*.5,false,['#c9a53a','#d4b444','#b8962f']); else addRound(x,z,1.1+rnd()*.7,false,DEEP); }
/* 本丸の大銀杏（天守の北） */ addRound(30,-44,2.6,false,['#c9a53a','#d4b444','#b8962f']);
for(const [set,mode] of [[TSETS.modern,'modern'],[TSETS.edo,'edo']]){ TS=set; MODE=mode; const edo=mode==='edo';
  for(const p of PLAT){ const n=edo?2:Math.round((p.x1-p.x0)*(p.z1-p.z0)/(p.id==='nino'?260:180)); for(let i=0;i<n*3&&n>0;i++){ const x=p.x0+3+rnd()*(p.x1-p.x0-6),z=p.z0+3+rnd()*(p.z1-p.z0-6); if(!okT(x,z)) continue; if(Math.hypot(x-TA.cx,z-TA.cz)<24) continue; if(Math.abs(x-GOT.cx)<24&&Math.abs(z-GOT.cz)<10) continue; if(p.id==='nino'&&!edo&&!(x<p.x0+14||x>p.x1-14||z<p.z0+14||z>p.z1-14)) continue;
      edo?addPine(x,z,1+rnd()*.3):(rnd()<.45?addBlossom(x,z,1.1+rnd()*.3,SAKURA):addRound(x,z,1+rnd()*.4,false)); } }
  /* 坪井川の岸と行幸坂の桜 */ for(let x=MOAT.x0+4;x<MOAT.x1-4;x+=edo?14:9){ if(okT(x,111)) (edo?addRound(x,111,1,false):addBlossom(x,111,1,SAKURA)); }
  if(!edo) for(let z=60;z<108;z+=7) for(const x of [-131,-117]) if(okT(x,z)) addBlossom(x,z,1.05,SAKURA);
  if(edo){ for(let i=0;i<140;i++){ const x=TOWN.x0+rnd()*(TOWN.x1-TOWN.x0),z=TOWN.z0+rnd()*(TOWN.z1-TOWN.z0); if(okT(x,z)) (rnd()<.5?addPine(x,z,.9):addRound(x,z,1,false)); } }
  else { for(let i=0;i<220;i++){ const x=-400+rnd()*680,z=140+rnd()*180; if(okT(x,z)) addRound(x,z,.9+rnd()*.4,false); } } }
MODE='modern';
