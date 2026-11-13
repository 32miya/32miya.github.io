/* ================= 両方の時代 ================= */
B=BS; curSet=BSETS.shared;
const KMM={wall:'kmWB',roof:'roof',gable:'plaster'};
function kmTamon(x0,x1,z0,z1,h,y,par){ tamon(null,x0,x1,z0,z1,h,y,KMM); block(x0-.3,z0-.3,x1+.3,z1+.3,'castle'); }
/* 橋（木の橋）と、現代の特別見学通路（地上約6mの空中の歩道。令和2年（2020）に公開） */
for(const b of BRIDGES){ if(b.mode==='modern') continue; woodBridge(b,{}); }
{ const W=WALK_A,b=BRIDGES.find(q=>q.id==='walkA'); B=BM; for(let x=W.x0;x<W.x1;x+=4){ const x1=Math.min(W.x1,x+4),h0=b.h(x,0),h1=b.h(x1,0),L=Math.hypot(x1-x,h1-h0),ang=Math.atan2(h1-h0,x1-x),mx=(x+x1)/2,my=(h0+h1)/2,mz=(W.z0+W.z1)/2;
    BM.concrete.add(new THREE.BoxGeometry(L+.05,.3,W.z1-W.z0),TM(mx,my-.17,mz,0,1,1,1,0,ang)); for(const z of [W.z0+.1,W.z1-.1]){ BM.rail.add(new THREE.BoxGeometry(L+.05,.08,.08),TM(mx,my+1.05,z,0,1,1,1,0,ang)); BM.glass.add(new THREE.BoxGeometry(L,.9,.04),TM(mx,my+.55,z,0,1,1,1,0,ang)); }
    if(Math.round(x)%12===0){ const gy=baseH(mx,mz); if(my-gy>1.2) for(const z of [W.z0+.4,W.z1-.4]) BM.rail.add(new THREE.BoxGeometry(.32,my-gy,.32),TM(mx,gy+(my-gy)/2-.3,z)); } }
  for(const z of [W.z0-.05,W.z1+.05]){ curSet=BSETS.modern; } B=BS; curSet=BSETS.shared; }
/* 天守前広場の石畳（本丸） */
/* 長塀（重要文化財）: 坪井川に沿う長さ約242mの塀。上は白漆喰、下は黒い下見板。令和3年（2021）に地震からの復旧を終えた */
dobei(-36,108,100,108,3.1,'castle',0);
/* 本丸御殿: 慶長15年（1610）ごろの完成と考えられる。明治10年に焼失、平成20年（2008）に大広間などを復元。床下を「闇り通路」が抜ける */
const GOT={cx:4,cz:10,w:40,d:14,y:32.5}; const GOTG=new THREE.Group(); scene.add(GOTG);
{ const g=GOT,x0=g.cx-g.w/2-.7,x1=g.cx+g.w/2+.7,z0=g.cz-g.d/2-.7,z1=g.cz+g.d/2+.7,y0=PL.honmaru.H;
  box(BS.stone,x0,5.4,y0-.2,g.y,z0,z1); box(BS.stone,12.6,x1,y0-.2,g.y,z0,z1); box(BS.stoneK,5.4,12.6,g.y-.6,g.y,z0,z1);
  for(const x of [5.4,12.6]) box(BS.stone,x-.6,x,22,g.y,z0,18.2); box(BS.stone,5.4-.6,12.6+.6,g.y-.6,g.y+.01,z0-.01,z0+.4);
  { const BG=mkB(),oB=B; B=BG; goten2(g.cx,g.cz,g.w,g.d,4.6,{y:g.y,par:GOTG,kara:-1,noBlock:true}); goten2(g.cx-12,g.cz-1,12,6,3.4,{y:g.y,par:GOTG,noBlock:true}); for(const k in BG) BG[k].build(M[k],true,GOTG); B=oB; }
  block(x0,z0,5.4,z1,'castle'); block(12.6,z0,x1,z1,'castle');
  /* 御殿の北の石段 */ for(let k=0;k<4;k++) BS.stoneK.add(boxUVGeo(3,.62,.4,1.2,1.2),TM(-6,y0+.31+k*.62,z0-.2-(3-k)*.4)); }
/* 数寄屋丸二階御広間（平成元年（1989）復元）と、西櫓御門 */
yagura(-71,8,14,8,Math.PI/2,{y:PL.sukiya.H,par:scene,wall:'kmWB',h1:4.2,h2:3.4});
gate(-79,28,5.6,Math.PI/2,{y:PL.sukiya.H,h:5,par:scene});
/* 西出丸: 戌亥櫓・未申櫓・元太鼓櫓（平成15年（2003）復元）、南大手門・西大手門 */
for(const [x,z,nm] of [[-145,-69,'戌亥櫓'],[-145,43,'未申櫓'],[-97,-69,'元太鼓櫓']]) yagura(x,z,9,8,0,{y:PL.nishide.H,par:scene,wall:'kmWB',h1:4.4,h2:3.4});
yaguraMon(-124,48.5,5.2,0,{y:PL.nishide.H,len:18,dep:6,ph:3.8,h2:3.4,par:scene,wall:'kmWB',shachi:true});
yaguraMon(-149.5,-10,5.2,Math.PI/2,{y:PL.nishide.H,len:16,dep:6,ph:3.8,h2:3.4,par:scene,wall:'kmWB',shachi:true});
{ const p=PL.nishide; for(const [a,b,c,d] of [[p.x0+1,p.z0+5,p.x0+1,-15],[p.x0+1,-5,p.x0+1,p.z1-5],[p.x0+5,p.z0+1,p.x1-6,p.z0+1],[p.x0+5,p.z1-1,-133.5,p.z1-1],[-114.5,p.z1-1,p.x1-1,p.z1-1]]) dobei(a,b,c,d,2.4,'castle',p.H); }
/* 頬当御門（いまの天守への入口）・須戸口門・不開門（開かずの門） */
yaguraMon(51,-8,5,Math.PI/2,{y:PL.honmaru.H,len:13,dep:5,ph:3.6,h2:3,par:scene,wall:'kmWB',drop:0});
gate(44,96.5,5,0,{y:PL.take.H,h:4.8,par:scene});
gate(100,-72.5,4.2,0,{y:PL.higashi.H,h:4.6,par:scene});
/* 東竹之丸の櫓群（重要文化財）: 源之進櫓・四間櫓・十四間櫓・七間櫓・田子櫓。地震で被災し、順に復旧が進む */
const HIGASHI_YAG=[['源之進櫓',-40,-20],['四間櫓',-14,-6],['十四間櫓',-2,16],['七間櫓',20,30],['田子櫓',34,44]];
for(const [nm,z0,z1] of HIGASHI_YAG) kmTamon(100.5,105.5,z0,z1,3.6,PL.higashi.H);
kmTamon(54,64,-73.5,-69,3.4,PL.higashi.H); /* 五間櫓 */
/* 監物櫓（重要文化財）: 二の丸の北のはずれ */
kmTamon(-190,-176,-108.5,-103.5,3.6,PL.nino.H);
/* 平櫓（重要文化財）: 東竹之丸の南 */
kmTamon(84,96,53,57.5,3.4,PL.higashi.H);

/* ================= 現代 ================= */
B=BM; curSet=BSETS.modern;
/* 宇土櫓（重要文化財・江戸時代から残るただ一つの五階櫓）: いまは解体修理のため素屋根（工事用の覆い）の中。2032年度の復旧完了をめざす */
{ const x0=-82,x1=-58,z0=-51,z1=-30,y0=PL.heiza.H,H=26; BM.hall.add(new THREE.BoxGeometry(x1-x0,H,z1-z0),TM((x0+x1)/2,y0+H/2,(z0+z1)/2),new THREE.Color('#dfe3e6'));
  for(let x=x0;x<=x1+.01;x+=4) for(const z of [z0-.1,z1+.1]) BM.rail.add(new THREE.BoxGeometry(.3,H,.3),TM(x,y0+H/2,z)); for(let y=y0+4;y<y0+H;y+=4.5) for(const z of [z0-.15,z1+.15]) BM.rail.add(new THREE.BoxGeometry(x1-x0,.2,.2),TM((x0+x1)/2,y,z));
  BM.concrete.add(new THREE.BoxGeometry(x1-x0+1,1,z1-z0+1),TM((x0+x1)/2,y0+H+.5,(z0+z1)/2)); block(x0,z0,x1,z1,'castle');
  BM.showcase.add(new THREE.BoxGeometry(6,1.6,.1),TM((x0+x1)/2,y0+3,z1+.25)); }
/* 東十八間櫓・北十八間櫓: 平成28年の地震で石垣ごと崩れ、部材を保管して復旧を待つ（いまは石垣の上に建物が無い） */
/* 飯田丸五階櫓: 地震で「一本石垣」に支えられて残ったが解体。石垣は令和6年（2024）に復旧 */
{ const y=PL.iida.H; for(let i=0;i<4;i++) for(let j=0;j<4;j++) BM.stoneK.add(new THREE.DodecahedronGeometry(.36,0),TM(-35+i*2.4,y+.02,46+j*2.4,i+j,1.1,.4,1.1)); }
/* 加藤神社: 加藤清正をまつる。境内から宇土櫓と天守がよく見える */
{ const y=PL.kita.H,x=-44,z=-84; goten2(x,z,12,8,3.2,{y,par:GM,kind:'castle'}); for(const s of [-1,1]) BM.stoneK.add(new THREE.CylinderGeometry(.32,.36,5,12),TM(x+s*2.4,y+2.5,z+11));
  BM.stoneK.add(new THREE.BoxGeometry(6.8,.45,.6),TM(x,y+4.9,z+11)); BM.stoneK.add(new THREE.BoxGeometry(5.6,.35,.5),TM(x,y+4.1,z+11)); for(const s of [-1,1]) block(x+s*2.4-.4,z+10.6,x+s*2.4+.4,z+11.4,'castle'); }
/* 加藤清正の銅像（行幸橋のたもと） */
{ const x=-116,z=134; BM.stoneK.add(boxUVGeo(3,2.6,3,2,2),TM(x,1.3,z)); BM.bronze.add(new THREE.CylinderGeometry(.55,.7,2,10),TM(x,3.6,z)); BM.bronze.add(new THREE.SphereGeometry(.32,10,8),TM(x,4.85,z)); BM.bronze.add(new THREE.ConeGeometry(.3,1.5,8),TM(x,5.8,z)); BM.bronze.add(new THREE.BoxGeometry(.12,2.6,.12),TM(x+.75,3.7,z,0,1,1,1,.15)); block(x-1.6,z-1.6,x+1.6,z+1.6,'town'); }
/* 案内板 */
for(const [x,z] of [[44,-10],[-116,52],[-60,-4],[-6,0],[30,-46],[-124,140],[-44,-70]]){ const y=baseH(x,z); BM.darkwood.add(new THREE.BoxGeometry(.12,1.2,.12),TM(x-.6,y+.6,z)); BM.darkwood.add(new THREE.BoxGeometry(.12,1.2,.12),TM(x+.6,y+.6,z)); BM.showcase.add(new THREE.BoxGeometry(1.6,1,.08),TM(x,y+1.5,z)); }
/* 天守閣前広場の入口の受付 */ bldg(42,-22,6,4,2.8,'#d8cfbd',{roof:'#3d4147'});
/* 桜の馬場 城彩苑（土産店・食事処が並ぶ）と、熊本城ミュージアム わくわく座 */
for(let x=-196;x<-110;x+=11){ bldg(x,156,9,8,4,'#e2d9c6',{roof:'#3d4147'}); bldg(x,190,9,8,4,'#e2d9c6',{roof:'#3d4147'}); }
bldg(-86,176,26,18,7,'#d9cfbb',{roof:'#3d4147'});
/* 熊本市役所（14階に展望ロビー。お城がよく見える） */
bldg(200,6,30,20,58,'#cfcac0');
/* 熊本の町（現代） */
for(const [z,s] of [[144,1],[210,-1],[220,1],[290,-1],[300,1]]) for(const [a0,a1] of [[-420,-300],[-290,-124],[-114,44],[54,156],[166,240],[250,300]]){ if(z===144&&a0>-300&&a0<44) continue; houseRow(a0,a1,z,'x',s); }
for(const [x,s] of [[162,1],[240,-1],[250,1]]) houseRow(-250,-40,x,'z',s);
houseRow(40,130,166,'z',1);
for(const [a0,a1] of [[-420,-360]]) houseRow(-250,120,-360,'z',-1);

/* ================= 江戸時代（加藤清正が築き、細川家が受け継いだ城） ================= */
B=BE; curSet=BSETS.edo;
/* 宇土櫓: 外観3重・内部5階地下1階。小西行長の宇土城の天守を移したという言い伝えがあるが、調査では否定的 */
const UTO={cx:-71,cz:-41};
kmTower(GE,UTO.cx,PL.heiza.H+1.2,UTO.cz,[{P:poly8(6.2,5.4,.2),h:7.4,slope:.52,wins:[[1.1,1.05,1.2,3],[4.8,1,1.2,3]]},{P:poly8(4.2,3.7,.2),h:3.8,slope:.55,wins:[[2.2,.9,1,2.4]]},{P:poly8(3,2.7,.2),h:4,deck:.8,wins:[[1.6,1.3,1.2,2]]}],{ishi:true,shs:.75,noShutter:false});
box(BE.stone,UTO.cx-7.4,UTO.cx+7.4,PL.heiza.H,PL.heiza.H+1.2,UTO.cz-6.6,UTO.cz+6.6); block(UTO.cx-7.6,UTO.cz-6.8,UTO.cx+7.6,UTO.cz+6.8,'castle');
kmTamon(-62,-44,-49.5,-45,3.6,PL.heiza.H); /* 宇土櫓の続櫓 */
/* 飯田丸五階櫓（江戸時代の姿） */
kmTower(GE,-31,PL.iida.H,50.5,[{P:poly8(5,4.4,.2),h:6.8,slope:.5,wins:[[1.1,1,1.2,2.8],[4.4,1,1.2,2.8]]},{P:poly8(3.4,3,.2),h:3.6,wins:[[2,.9,1,2.2]]},{P:poly8(2.6,2.3,.2),h:3.4,wins:[[1.4,1,1,1.8]]}],{shs:.7});
block(-36.5,45,-25.5,56,'castle');
/* 東十八間櫓・北十八間櫓（江戸時代から残る。地震で崩落） */
kmTamon(100.5,105.5,-70,-46,3.6,PL.higashi.H); kmTamon(68,96,-73.5,-69,3.6,PL.higashi.H);
/* 失われた櫓: 東三階櫓・百間櫓・月見櫓など（明治の初めまでにほとんどが取り壊された） */
yagura(45,-44,8,8,0,{y:PL.honmaru.H,par:GE,wall:'kmWB',h1:4.2,h2:3.4});
kmTamon(-36,-18,54,57.5,3.4,PL.iida.H); kmTamon(-2,20,54,57.5,3.4,PL.iida.H); /* 百間櫓 */
yagura(18,52,7,6,0,{y:PL.iida.H,par:GE,wall:'kmWB',single:true}); /* 月見櫓 */
kmTamon(-38,-6,92.5,95.5,3.2,PL.take.H); /* 竹の丸の櫓 */
/* 曲輪のふちの土塀（石垣の上）。現代は西出丸だけ復元 */
for(const p of PLAT){ if(!p.walls||p.id==='nishide') continue; const E=[[p.x0,p.z0,p.x1,p.z0],[p.x1,p.z0,p.x1,p.z1],[p.x0,p.z1,p.x1,p.z1],[p.x0,p.z0,p.x0,p.z1]];
  E.forEach(([ax,az,bx2,bz],k)=>{ if(!p.walls[k]) return; const vert=k%2===1,inset=.9,sg=k===0||k===3?1:-1; let segs=[vert?[az,bz]:[ax,bx2]];
    for(const r of RAMPS.concat([{x0:5,x1:13,z0:-200,z1:200}].filter(()=>p.id==='honmaru'||p.id==='iida'))){ const lo=vert?r.z0-2.5:r.x0-2.5,hi=vert?r.z1+2.5:r.x1+2.5,line=vert?ax:az; if(!(vert?(line>r.x0-3&&line<r.x1+3):(line>r.z0-3&&line<r.z1+3))) continue; segs=segs.flatMap(([a,b])=>[[a,Math.min(b,lo)],[Math.max(a,hi),b]]).filter(([a,b])=>b-a>2); }
    for(const [a,b] of segs){ if(vert) dobei(ax+sg*inset,a+.5,ax+sg*inset,b-.5,2.2,'castle',p.H); else dobei(a+.5,az+sg*inset,b-.5,az+sg*inset,2.2,'castle',p.H); } }); }
/* 二の丸の重臣の屋敷 */
for(const [x0,z0,x1,z1,f] of [[-330,-100,-290,-66,'s'],[-280,-100,-240,-66,'s'],[-230,-100,-196,-66,'s'],[-330,-40,-292,-4,'e'],[-330,8,-292,40,'e'],[-276,-40,-236,-6,'n'],[-226,-40,-190,-6,'n'],[-276,14,-236,50,'n'],[-226,14,-190,50,'n']]) buke(x0,z0,x1,z1,f);
/* 三の丸・新町の武家屋敷（台地の西） */
for(let z=-180;z<100;z+=44) for(const [x0,x1] of [[-420,-392],[-386,-358]]) if(!(z<-12&&z+36>-20)) buke(x0,z,x1,z+36,x0<-400?'e':'w');
/* 城下町（古町・新町）の町家 */
for(const z of [140,186,234,282]) for(let x=-400;x<300;x+=56){ const a0=x+6,a1=x+56; if(a0<-128&&a1>-128||a0<44&&a1>39) continue; if(z>140) machiRow(a0+1,a1-1,z,'x',-1,rnd()<.3); machiRow(a0+1,a1-1,z+(z===140?0:6),'x',1,rnd()<.3); }
/* 寺町（古町の南のはずれに寺が集まる） */
for(const [x,z] of [[-300,312],[-180,312],[100,312]]){ goten2(x,z,16,10,4,{y:0,par:GE,kind:'town'}); }
B=BS; curSet=BSETS.shared;
