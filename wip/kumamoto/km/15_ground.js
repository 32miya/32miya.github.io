/* 茶臼山の台地: 林と土手の斜面・曲輪・石段の下地（両方の時代） */
function paintHill(P,edo){ for(let x=INR.x0;x<INR.x1;x+=2.5) for(let z=INR.z0;z<INR.z1;z+=2.5){ if(platAt(x+1.25,z+1.25)||rampAt(x+1.25,z+1.25)) continue; if(hillH(x+1.25,z+1.25)>.5) P.R(x,z,x+2.6,z+2.6,pick(edo?FOREST:FOREST.concat(LAWN))); }
  for(const p of PLAT){
    if(edo){ P.R(p.x0,p.z0,p.x1,p.z1,'#a99a7d'); P.mot(p.x0,p.z0,p.x1,p.z1,['#a39478','#ad9f83','#9a8c71','#b1a488'],(p.x1-p.x0)*(p.z1-p.z0)/10,2.5); }
    else if(p.id==='nino'||p.id==='take'||p.id==='higashi'){ P.R(p.x0,p.z0,p.x1,p.z1,'#5f7440'); P.mot(p.x0,p.z0,p.x1,p.z1,LAWN,(p.x1-p.x0)*(p.z1-p.z0)/8,2.5); }
    else { P.R(p.x0,p.z0,p.x1,p.z1,GRAVEL); P.mot(p.x0,p.z0,p.x1,p.z1,['#ab9f86','#bcb197','#a59a82'],(p.x1-p.x0)*(p.z1-p.z0)/10,2.5); } }
  for(const r of RAMPS){ P.R(r.x0,r.z0,r.x1,r.z1,edo?'#a6a092':'#9a958a'); }
  P.R(BIZEN.x0-1,BIZEN.z0-1,BIZEN.x1+1,BIZEN.z1+1,'#5a5a48'); P.R(BIZEN.x0,BIZEN.z0,BIZEN.x1,BIZEN.z1,WATERC); }
function paddies(P,x0,z0,x1,z1,cw,ch){ for(let x=x0;x<x1;x+=cw) for(let z=z0;z<z1;z+=ch){ P.R(x,z,Math.min(x1,x+cw),Math.min(z1,z+ch),pick(PADDY)); P.R(x,z,Math.min(x1,x+cw),z+.6,'#6a6440'); P.R(x,z,x+.6,Math.min(z1,z+ch),'#6a6440'); } }
/* 現代: 熊本の市街（電車通り・市役所・桜の馬場 城彩苑） */
PM.R(-1200,-1200,1200,1200,'#7c7a74'); PM.mot(-560,-560,560,560,['#77756f','#85837c','#6f6d68'],5000,5);
for(const z of [134,210,290]) PM.R(-560,z,560,z+10,'#47484c'); for(const x of [-300,-124,44,156,240]) PM.R(x,-560,x+10,560,'#47484c');
PM.R(-560,-200,560,-190,'#47484c');
for(const z of [137,213]){ PM.R(-560,z,560,z+.4,'#d8d6cf'); PM.R(-560,z+3.6,560,z+4,'#9a9aa0'); PM.R(-560,z+5.2,560,z+5.6,'#9a9aa0'); } /* 市電の軌道 */
PM.R(-210,140,-60,200,'#8c877c'); PM.joints(-210,140,-60,200,2.5); /* 桜の馬場 城彩苑 */
PM.R(-300,140,-212,205,'#55565a'); for(let x=-296;x<-214;x+=3.2) for(const z of [145,170,186]) PM.R(x,z,x+.15,z+10,'#e8e6df'); /* 駐車場 */
PM.R(INR.x0,INR.z0,INR.x1,INR.z1,'#4a5a33'); paintHill(PM,false);
/* 江戸時代: 城下町（古町・新町）と、そのまわりの田畑 */
PE.R(-1200,-1200,1200,1200,'#8c7c63'); paddies(PE,-560,-560,560,-200,22,14); paddies(PE,180,-560,560,560,20,14);
PE.R(TOWN.x0,TOWN.z0,TOWN.x1,TOWN.z1,'#9a8a6e'); PE.mot(TOWN.x0,TOWN.z0,TOWN.x1,TOWN.z1,['#93836a','#a08f73','#8a7b62'],2400,4);
PE.R(-560,-200,INR.x0,130,'#9a8a6e'); PE.mot(-560,-200,INR.x0,130,['#93836a','#a08f73','#8a7b62'],1200,4); /* 新町・武家屋敷 */
for(const r of ROADS) PE.R(r.x0,r.z0,r.x1,r.z1,'#a39273');
for(let x=-400;x<300;x+=56) PE.R(x,140,x+6,330,'#a39273'); for(let z=180;z<330;z+=48) PE.R(-420,z,300,z+6,'#a39273'); /* 古町の碁盤目 */
PE.R(INR.x0,INR.z0,INR.x1,INR.z1,'#4a5530'); paintHill(PE,true);
for(const [P,c] of [[PM,'#6a6a5a'],[PE,'#6f6450']]) for(const W of [MOAT,RIV_E]){ P.R(W.x0-2,W.z0-2,W.x1+2,W.z1+2,c); P.R(W.x0,W.z0,W.x1,W.z1,WATERC); }
for(const b of BRIDGES){ PM.R(b.x0,b.z0,b.x1,b.z1,'#a69c86'); if(b.mode!=='modern') PE.R(b.x0,b.z0,b.x1,b.z1,'#a39273'); }
