/* ================= 天守（大天守・小天守）: 外観3重・内部6階地下1階の大天守と、外観2重・内部4階地下1階の小天守 =================
   ・事実: 加藤清正が慶長年間（1600年ごろ〜1607年）に築いた。明治10年（1877）2月19日、西南戦争の直前に原因不明の火災で本丸御殿とともに焼失。
     昭和35年（1960）に外観を復元（鉄骨鉄筋コンクリート造）。平成28年（2016）の熊本地震で被災し、令和3年（2021）に復旧して内部は博物館。
   ・言い伝え・仮説: 江戸時代の内部の間取りや調度は記録が少なく、ここでは想像で補っています。 */
/* 鯱は黒っぽい金属（銅）の立体にする（金の鯱は熊本城には無い） */
function shachi(par,x,y,z,s,ry){ shachi3D(par,x,y,z,s*.85,ry); }
/* 熊本城の壁1面: 上が白漆喰、下が黒い下見板。窓・戸口の穴あき（ローカル+zが外側）。v は壁の高さで 0〜1 */
function kmSide(par,cx,y,cz,len,H,ry,wins,o){ o=o||{}; const dep=o.depth||.32,G=new THREE.Group(); G.position.set(cx,y,cz); G.rotation.y=ry; par.add(G);
  const s=new THREE.Shape(); s.moveTo(-len/2,0); s.lineTo(len/2,0); s.lineTo(len/2,H); s.lineTo(-len/2,H); s.lineTo(-len/2,0);
  for(const w of wins) s.holes.push(rectPath2(new THREE.Path(),w.x,w.s,w.w,w.h));
  const g=new THREE.ExtrudeGeometry(s,{depth:dep,bevelEnabled:false,curveSegments:2}); const u=g.attributes.uv,p=g.attributes.position;
  for(let i=0;i<u.count;i++){ u.setXY(i,(p.getX(i)+len/2)/2.6,p.getY(i)/H); } g.translate(0,0,-dep);
  G.add(mesh(g,M.kmW,true,true));
  for(const w of wins){ if(w.door) continue;
    for(const [w2,h2,xx,yy] of [[w.w+.26,.12,w.x,w.s-.06],[w.w+.26,.12,w.x,w.s+w.h+.06],[.12,w.h,w.x-w.w/2-.07,w.s+w.h/2],[.12,w.h,w.x+w.w/2+.07,w.s+w.h/2]]){ const b=mesh(new THREE.BoxGeometry(w2,h2,.08),M.black,false,false); b.position.set(xx,yy,.03); G.add(b); }
    /* 突上戸（上に跳ね上げた黒い板戸） */ if(!o.noShutter){ const sh=mesh(new THREE.BoxGeometry(w.w+.2,w.h*.9,.05),M.black,false,false); sh.position.set(w.x,w.s+w.h+.02+Math.sin(.6)*w.h*.45,.05+Math.cos(.6)*w.h*.45); sh.rotation.x=-(Math.PI/2-.6); sh.position.set(w.x,w.s+w.h-.02+ (w.h*.9/2)*Math.cos(Math.PI/2-.6),.04+(w.h*.9/2)*Math.sin(Math.PI/2-.6)); G.add(sh); }
    const n=Math.max(3,Math.round(w.w/.2)); for(let k=1;k<n;k++){ const bar=mesh(new THREE.BoxGeometry(.05,w.h,.06),M.darkwood,false,false); bar.position.set(w.x-w.w/2+k*w.w/n,w.s+w.h/2,-dep/2); G.add(bar); } }
  return G; }
/* 武者返し: 下はゆるく、上へいくほど垂直に反り立つ天守台の石垣。door={x0,x1,y1}: +z面（南）の入口 */
function mushaGeo(a,b,h,bat,door,ex){ const N=12,v=[],uv=[],tl=4.5,prof=t=>bat*Math.pow(1-t,ex||2.2);
  const ts=[]; for(let i=0;i<=N;i++) ts.push(i/N); if(door){ ts.push(door.y1/h); ts.sort((p,q)=>p-q); }
  const corner=(o)=>[[-(a+o),b+o],[a+o,b+o],[a+o,-(b+o)],[-(a+o),-(b+o)]];
  for(let f=0;f<4;f++){ for(let i=0;i<ts.length-1;i++){ const t0=ts[i],t1=ts[i+1]; if(t1-t0<1e-4) continue; const o0=prof(t0),o1=prof(t1),c0=corner(o0),c1=corner(o1),y0=h*t0,y1=h*t1;
      const A0=c0[f],B0=c0[(f+1)%4],A1=c1[f],B1=c1[(f+1)%4];
      let cuts=[0,1]; if(f===0&&door){ const L0=B0[0]-A0[0],L1=B1[0]-A1[0]; const s0a=(door.x0-A0[0])/L0,s1a=(door.x1-A0[0])/L0,s0b=(door.x0-A1[0])/L1,s1b=(door.x1-A1[0])/L1; cuts=[[0,0],[s0a,s0b],[s1a,s1b],[1,1]]; }
      else cuts=[[0,0],[1,1]];
      for(let j=0;j<cuts.length-1;j++){ if(f===0&&door&&j===1&&t1<=door.y1/h+1e-4) continue; const [sa0,sa1]=cuts[j],[sb0,sb1]=cuts[j+1];
        const P0=[A0[0]+(B0[0]-A0[0])*sa0,y0,A0[1]+(B0[1]-A0[1])*sa0],P1=[A0[0]+(B0[0]-A0[0])*sb0,y0,A0[1]+(B0[1]-A0[1])*sb0],P2=[A1[0]+(B1[0]-A1[0])*sb1,y1,A1[1]+(B1[1]-A1[1])*sb1],P3=[A1[0]+(B1[0]-A1[0])*sa1,y1,A1[1]+(B1[1]-A1[1])*sa1];
        const L=Math.hypot(B0[0]-A0[0],B0[1]-A0[1]); v.push(...P0,...P1,...P2,...P0,...P2,...P3); const U=s=>s*L/tl,V0=y0/tl,V1=y1/tl; uv.push(U(sa0),V0,U(sb0),V0,U(sb1),V1,U(sa0),V0,U(sb1),V1,U(sa1),V1); } } }
  return geoFrom(v,uv); }
/* 算木積みの隅石（天守台・櫓台の角） */
function mushaCorners(bt,cx,y0,cz,a,b,h,bat,ex){ for(const [sx,sz] of [[1,1],[1,-1],[-1,1],[-1,-1]]){ let r=0; for(let y=h-.05;y>.5;y-=SANGI_Y,r++){ const t=(y-SANGI_Y/2)/h,o=bat*Math.pow(1-t,ex||2.2),x=cx+sx*(a+o+.05),z=cz+sz*(b+o+.05),Lg=1.9+(r%3)*.3,w=.9;
    if(r%2) bt.add(boxUVGeo(Lg,SANGI_Y-.07,w,1.2,1.2),TM(x-sx*Lg/2,y0+y-SANGI_Y/2,z-sz*w/2)); else bt.add(boxUVGeo(w,SANGI_Y-.07,Lg,1.2,1.2),TM(x-sx*w/2,y0+y-SANGI_Y/2,z-sz*Lg/2)); } } }
/* 天守・櫓の外観: 箱を重ね、反りのある屋根でつなぐ。levels: [{P,h,slope,wins:[[sill,h,w,step]...]}] */
function kmTower(par,cx,y0,cz,levels,o){ o=o||{}; const g=new THREE.Group(); g.position.set(cx,0,cz); par.add(g); const oh=o.oh||1.9,mats={roof:M.roof,gable:M.plaster,gold:false,orn:false,crest:M.tachi,shs:o.shs||1,trim:M.black};
  let y=y0; levels.forEach((L,i)=>{ L.Y=y; const nx=levels[i+1]; if(nx){ const O=growP(L.P,oh); let d=0; for(let k=0;k<8;k++) d=Math.max(d,Math.hypot(O[k][0],O[k][1])-Math.hypot(nx.P[k][0],nx.P[k][1])); L.rise=d*(L.slope||.55); L.O=O; } y+=L.h; });
  levels.forEach((L,i)=>{ const P=L.P,nx=levels[i+1];
    for(let k=0;k<8;k++){ const a=P[k],b=P[(k+1)%8],len=Math.hypot(b[0]-a[0],b[1]-a[1]); if(len<.05) continue; const mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2,[nx2,nz2]=nrmOut(a,b),ry=Math.atan2(nx2,nz2);
      let wins=[]; if(len>3.4) for(const [sill,wh,ww,step] of (L.wins||[])){ const n=Math.max(1,Math.floor((len-2)/step)); for(let q=0;q<n;q++) wins.push({x:-((n-1)*step)/2+q*step,s:sill,w:ww,h:wh}); }
      const side=k===7?'s':k===3?'n':k===1?'e':k===5?'w':null; if(side&&o.doors) for(const d of o.doors) if(d.lv===i&&d.side===side){ wins=wins.filter(w=>Math.abs(w.x-d.x)>d.w/2+.7); wins.push({x:d.x,s:0,w:d.w,h:d.h,door:true}); }
      kmSide(g,mx,L.Y,mz,len+.02,L.h,ry,wins,{noShutter:o.noShutter});
      /* 下端の黒い水切りと上端の長押 */ const m=mesh(new THREE.BoxGeometry(len,.14,.14),M.black,false,false); m.position.set(mx+nx2*.03,L.Y+.07,mz+nz2*.03); m.rotation.y=ry; g.add(m); }
    if(nx){ const [rg,fr]=polyRoofParts(L.O,nx.P,L.rise,.55); const r=mesh(rg,M.roof); r.position.y=L.Y+L.h-.1; g.add(r); const f=mesh(fr,M.ridge); f.position.y=L.Y+L.h-.1; g.add(f);
      /* 軒裏（白漆喰の塗込め） */ const und=new THREE.Shape(); L.O.forEach(([x,z],j)=>j?und.lineTo(x,-z):und.moveTo(x,-z)); und.closePath(); const hp=new THREE.Path(); L.P.slice().reverse().forEach(([x,z],j)=>j?hp.lineTo(x,-z):hp.moveTo(x,-z)); hp.closePath(); und.holes.push(hp);
      const ug=new THREE.ShapeGeometry(und); ug.rotateX(-Math.PI/2); const um=mesh(ug,M.darkwood,false,false); um.position.y=L.Y+L.h-.12; g.add(um); }
    else { let a=0,b=0; for(const [x,z] of P){ a=Math.max(a,x); b=Math.max(b,z); } const r=hipRoof(2*a,2*b,oh+.3+(L.deck||0),mats); r.position.y=L.Y+L.h-.1; g.add(r); } });
  /* 石落とし: 1重目の隅の張り出し */ if(o.ishi){ const L=levels[0]; let a=0,b=0; for(const [x,z] of L.P){ a=Math.max(a,x); b=Math.max(b,z); }
    for(const sx of [-1,1]) for(const sz of [-1,1]){ for(const [w,d,x,z] of [[1.8,.8,sx*(a-1.4),sz*(b+.38)],[.8,1.8,sx*(a+.38),sz*(b-1.4)]]){ const s=mesh(new THREE.BoxGeometry(w,1.3,d),M.black); s.position.set(x,L.Y+1.05,z); g.add(s); const c=mesh(new THREE.BoxGeometry(w+.2,.12,d+.2),M.black); c.position.set(x,L.Y+1.75,z); g.add(c); } } }
  return {g,levels,mats}; }
const TEN={}; const DECO_KEEP=[],DECO_KEEPM=[],GIBO=[];
const TA={cx:TZ.cx,cz:TZ.cz,y0:TZ.g0+TZ.bh,oh:1.9};
/* 大天守: 1・2階／3・4階／5・6階の3つの重ね。6階に廻縁（高欄） */
const TLV=[
  {name:'1・2階',P:poly8(9,7.6,.25),h:8.6,slope:.5,wins:[[1.1,1.15,1.3,3.2],[5.4,1.1,1.3,3.2]]},
  {name:'3・4階',P:poly8(6.6,5.6,.25),h:7.6,slope:.56,wins:[[2.5,.9,1.2,2.8],[4.9,1.05,1.2,2.8]]},
  {name:'5・6階',P:poly8(4.3,3.8,.25),h:7.2,deck:1.1,wins:[[2.5,.9,1.1,2.6],[4.6,1.5,1.5,2.2]]}];
/* 小天守（西に連結）: 1・2階／3・4階 */
const SX={cx:TA.cx-19.5,cz:TA.cz+1.5};
const SLV=[{name:'小天守 1・2階',P:poly8(5.6,4.8,.25),h:7.4,slope:.52,wins:[[1.1,1.1,1.2,3],[4.9,1.05,1.2,3]]},{name:'小天守 3・4階',P:poly8(3.8,3.3,.25),h:5.8,wins:[[2.4,.9,1.1,2.4],[4.0,1,1.1,2.4]]}];
/* 階（内部）: 0=地階（穴蔵）, 1=1階 … 6=6階 */
const TFL=[
  {lv:-1,name:'天守 地階',kana:'てんしゅ ちかい',light:.55},{lv:0,name:'天守 1階',kana:'てんしゅ いっかい',light:.7},{lv:0,name:'天守 2階',kana:'てんしゅ にかい',light:.7},
  {lv:1,name:'天守 3階',kana:'てんしゅ さんがい',light:.72},{lv:1,name:'天守 4階',kana:'てんしゅ よんかい',light:.74},{lv:2,name:'天守 5階',kana:'てんしゅ ごかい',light:.78},{lv:2,name:'天守 6階（最上階）',kana:'てんしゅ ろっかい',light:.95}];
const TFL_TXT={
 modern:['入口の地下1階。天守台の石垣の中の「穴蔵」にあたります。ここから順路に沿って上ります（内部は鉄骨鉄筋コンクリート造の博物館）。',
  '1階の展示「加藤清正と熊本城の誕生」。清正が茶臼山に築いた城と、石垣づくりの技を模型や映像で紹介します（展示の内容は簡略化しています）。',
  '2階の展示「細川家の熊本城」。寛永9年（1632）に入った細川家のもとで、城と城下町は幕末まで続きました。',
  '3階の展示「西南戦争と熊本城」。明治10年（1877）、天守は焼け落ちましたが、熊本鎮台は52日間の籠城で城を守り抜きました。',
  '4階の展示「近代の熊本城と熊本地震」。平成28年（2016）の地震で崩れた石垣と、復旧の歩みを紹介します。',
  '5階は、6階の展望フロアへ上る手前の階。窓は外観だけで、館内からは外は見えません（博物館の階）。',
  '最上階の展望フロア。四方の窓から、熊本の市街、金峰山、晴れた日には阿蘇の山々まで見渡せます。'],
 edo:['天守台の石垣の内側の「穴蔵」。兵糧や武具を納める蔵として使われたと考えられます。中は暗く、石の壁に囲まれています。',
  '大天守の1階。太い柱が並ぶ板の間で、戦いのときには兵が詰める場所でした。窓は突上戸で、外へ跳ね上げて開けます（間取りは想像）。',
  '2階。武具を並べた広い板の間（想像）。窓から鉄砲を撃てるよう、壁には狭間も設けられていました。',
  '3階（屋根裏の階）。外から見ると1つ目の大屋根の中にあたり、窓は屋根の上の高い所にあります。',
  '4階。城下を見張る窓が並びます。柱と梁がむき出しの、質実な造りです。',
  '5階。2つ目の屋根の中にあたる階です。',
  '最上階。四方の窓の外には廻縁（まわりえん）がめぐり、城下と坪井川、遠くの山々まで見渡せます。殿さまが上ることはまれだったと考えられています（内部は想像）。']};
function planKeep(){ const cx=TA.cx,cz=TA.cz,FL=[],ST=[],g0=TZ.g0,ti=(TZ.bw/2-TZ.bat)-.8,tj=(TZ.bd/2-TZ.bat)-.8;
  const E={x0:cx-1.4,x1:cx+1.4,Z:cz+TZ.bd/2,zIn:cz+tj};
  FL.push(Object.assign({y:g0,h:TZ.bh,rects:[{x0:cx-ti,x1:cx+ti,z0:cz-tj,z1:cz+tj},{x0:E.x0-.1,x1:E.x1+.1,z0:cz+tj-.2,z1:E.Z}],pillars:[]},TFL[0]));
  const L=TLV,L0=L[0].Y,L1=L[1].Y,L2=L[2].Y;
  const ys=[L0,L0+L[0].h/2,L1,L1+L[1].h/2,L2,L2+L[2].h/2],hs=[L[0].h/2,L[0].h/2,L[1].h/2,L[1].h/2,L[2].h/2,L[2].h/2];
  for(let i=1;i<=6;i++){ const lv=L[TFL[i].lv]; let a=0,b=0; for(const [x,z] of lv.P){ a=Math.max(a,x); b=Math.max(b,z); }
    const F=Object.assign({y:ys[i-1],h:hs[i-1],P:lv.P,pillars:[],w:2*a,d:2*b},TFL[i]); F.rects=[{x0:cx-a+.85,x1:cx+a-.85,z0:cz-b+.85,z1:cz+b-.85}]; FL.push(F); }
  /* 1階: 西の渡廊下と小天守1階 */
  { const F=FL[1],sa=SLV[0].P[1][0],sb=SLV[0].P[0][1]; F.rects.push({x0:SX.cx+sa-1,x1:cx-9+.95,z0:SX.cz-1.4,z1:SX.cz+1.4},{x0:SX.cx-sa+.85,x1:SX.cx+sa-.85,z0:SX.cz-sb+.85,z1:SX.cz+sb-.85});
    F.zones=[{r:{x0:SX.cx-sa,x1:SX.cx+sa,z0:SX.cz-sb,z1:SX.cz+sb},name:'小天守 1階'},{r:{x0:SX.cx+sa,x1:cx-9,z0:SX.cz-2,z1:SX.cz+2},name:'小天守への渡廊下'}]; }
  const stair=(i,x0,len,dir)=>{ const rise=FL[i+1].y-FL[i].y,zs=cz-dir*len/2,ze=cz+dir*len/2; ST.push({x0:cx+x0,x1:cx+x0+2,z0:Math.min(zs,ze),z1:Math.max(zs,ze),from:zs,to:ze,rise}); };
  stair(0,5.6,11,-1); stair(1,-7.6,6.2,1); stair(2,3.4,6.2,-1); stair(3,-5.4,5.2,1); stair(4,1.2,4.6,-1); stair(5,-3.2,4.4,1);
  return {cx,cz,g0,FL,ST,entry:E}; }
/* 外観（現代・江戸時代とも同じ姿。西南戦争の場面では焼失させる） */
B=BS; curSet=BSETS.shared;
const KX=new THREE.Group(); scene.add(KX);
const KT=kmTower(KX,TA.cx,TA.y0,TA.cz,TLV,{ishi:true,doors:[{lv:0,side:'w',x:SX.cz-TA.cz,w:1.6,h:2.4}]});
const KS=kmTower(KX,SX.cx,TA.y0,SX.cz,SLV,{ishi:true,shs:.8,doors:[{lv:0,side:'e',x:-(SX.cz-SX.cz),w:1.6,h:2.4}]});
const TP=planKeep(); TEN.edo=Object.assign({par:GE},TP); TEN.modern=Object.assign({par:GM},planKeep());
{ const cx=TA.cx,cz=TA.cz,g0=TZ.g0,bh=TZ.bh,T=TLV;
  /* 天守台（大・小）と、その間をつなぐ石垣 */ const a=TZ.bw/2-TZ.bat,b=TZ.bd/2-TZ.bat;
  const base=mesh(mushaGeo(a,b,bh+.02,TZ.bat,{x0:-1.6,x1:1.6,y1:3.4}),wallN,false,true); base.position.set(cx,g0,cz); KX.add(base); mushaCorners(BS.sangi,cx,g0,cz,a,b,bh,TZ.bat);
  const sa=6.8,sb=5.9,sbat=2.4; const sm=mesh(mushaGeo(sa,sb,bh+.02,sbat,null),wallN,false,true); sm.position.set(SX.cx,g0,SX.cz); KX.add(sm); mushaCorners(BS.sangi,SX.cx,g0,SX.cz,sa,sb,bh,sbat);
  box(BS.stone,SX.cx+sa-.4,cx-a+.4,g0,g0+bh,SX.cz-3.4,SX.cz+3.4);
  for(const [x0,x1,z0,z1] of [[cx-a,cx+a,cz-b,cz+b],[SX.cx-sa,SX.cx+sa,SX.cz-sb,SX.cz+sb],[SX.cx+sa-.4,cx-a+.4,SX.cz-3.4,SX.cz+3.4]]){ const m=mesh(boxUVGeo(x1-x0,.3,z1-z0,3,3),M.stoneK,false,true); m.position.set((x0+x1)/2,g0+bh+.12,(z0+z1)/2); KX.add(m); }
  block(cx-TZ.bw/2+.4,cz-TZ.bd/2+.4,cx+TZ.bw/2-.4,cz+TZ.bd/2-.8,'castle'); block(SX.cx-sa-sbat+.4,SX.cz-sb-sbat+.4,SX.cx+sa,SX.cz+sb+sbat-.4,'castle'); block(SX.cx+sa-1,SX.cz-3.6,cx-a+1,SX.cz+3.6,'castle');
  /* 穴蔵への入口の通路（石の壁と天井） */ const E=TP.entry; for(const s of [-1,1]) box(BS.stone,cx+s*1.6-(s>0?0:.7),cx+s*1.6+(s>0?.7:0),g0,g0+3.4,E.zIn,E.Z+.2); box(BS.stoneK,cx-2.3,cx+2.3,g0+3.4,g0+3.9,E.zIn,E.Z-1);
  /* 渡廊下（大天守と小天守をつなぐ） */ { const x0=SX.cx+SLV[0].P[1][0]-.1,x1=cx-9+.1,L=x1-x0,mx=(x0+x1)/2; for(const s of [-1,1]) kmSide(KX,mx,TA.y0,SX.cz+s*2.2,L,4.2,s>0?0:Math.PI,[]); const r=mesh(gableRoofGeo(L+1.4,6.2,1.6,.8,.3),M.roof); r.position.set(mx,TA.y0+4.2,SX.cz); KX.add(r); const e=mesh(gableEndsGeo(L,4.4,1.5),M.plaster); e.position.set(mx,TA.y0+4.2,SX.cz); KX.add(e); }
  /* 破風: 1重目の東西に千鳥破風、南に唐破風、2重目の南北に千鳥破風（大天守）。小天守の南に唐破風 */
  const mats={roof:M.roof,gable:M.plaster,gold:false,orn:false,trim:M.black};
  { const r0=T[0],r1=T[1]; for(const s of [-1,1]){ chidori(KX,cx+s*(r0.P[1][0]+TA.oh*.5),r0.Y+r0.h+r0.rise*.22,cz,s>0?Math.PI/2:-Math.PI/2,7.4,2.8,mats); chidori(KX,cx,r1.Y+r1.h+r1.rise*.2,cz+s*(r1.P[0][1]+TA.oh*.45),s>0?0:Math.PI,5.6,2.3,mats); }
    karahafu(KX,cx,r0.Y+r0.h-.25+r0.rise*.1,cz+(r0.P[0][1]+TA.oh*.7),0,5.2,mats); karahafu(KX,cx,r0.Y+r0.h-.25+r0.rise*.1,cz-(r0.P[0][1]+TA.oh*.7),Math.PI,5.2,mats);
    const s0=SLV[0]; karahafu(KX,SX.cx,s0.Y+s0.h-.25+s0.rise*.1,SX.cz+(s0.P[0][1]+TA.oh*.7),0,4.2,mats); chidori(KX,SX.cx-(s0.P[1][0]+TA.oh*.5),s0.Y+s0.h+s0.rise*.2,SX.cz,-Math.PI/2,5.2,2.2,mats); }
  /* 6階の廻縁と高欄（黒） */ { const L=T[2],R=growP(L.P,L.deck),y=L.Y+L.h/2; const deck=mesh(polySlab(R,[],.2),M.darkwood,true,true); deck.position.set(cx,y-.2,cz); KX.add(deck);
    const Rr=growP(L.P,L.deck-.1); for(let k=0;k<8;k++){ const p=Rr[k],q=Rr[(k+1)%8],len=Math.hypot(q[0]-p[0],q[1]-p[1]); if(len<.2) continue; const mx=(p[0]+q[0])/2,mz=(p[1]+q[1])/2,[nx,nz]=nrmOut(p,q),ry=Math.atan2(nx,nz);
      for(const [yy,hh,dd] of [[.95,.1,.12],[.5,.07,.1],[-.12,.2,.08]]){ const r=mesh(new THREE.BoxGeometry(len,hh,dd),M.lacquer,false,false); r.position.set(cx+mx,y+yy,cz+mz); r.rotation.y=ry; KX.add(r); }
      const n=Math.max(1,Math.round(len/1.1)); for(let q2=0;q2<=n;q2++){ const t=q2/n,pp=mesh(new THREE.BoxGeometry(.09,.95,.09),M.lacquer,false,false); pp.position.set(cx+p[0]+(q[0]-p[0])*t,y+.48,cz+p[1]+(q[1]-p[1])*t); KX.add(pp); } }
    for(const [x,z] of L.P){ const l=Math.hypot(x,z),q=mesh(new THREE.BoxGeometry(.22,.4,L.deck+.3),M.black,false,false); q.position.set(cx+x+x/l*L.deck/2,y-.42,cz+z+z/l*L.deck/2); q.rotation.y=Math.atan2(x,z); KX.add(q); } }
  /* 入口（地下の穴蔵口）の扉と看板 */ { const E=TP.entry; for(const s of [-1,1]) BS.darkwood.add(new THREE.BoxGeometry(.3,3.4,.3),TM(cx+s*1.75,g0+1.7,E.Z-.6)); BS.darkwood.add(new THREE.BoxGeometry(3.8,.4,.4),TM(cx,g0+3.5,E.Z-.6));
    for(const s of [-1,1]){ const d=new THREE.Group(); d.position.set(cx+s*2.4,g0,E.Z-.3); d.rotation.y=s*.35; KX.add(d); const lf=mesh(new THREE.BoxGeometry(1.4,3.1,.12),M.darkwood); lf.position.y=1.55; d.add(lf); for(const yy of [.6,1.6,2.6]){ const k=mesh(new THREE.BoxGeometry(1.42,.1,.14),M.black); k.position.y=yy; d.add(k); } } } }
B=BS; curSet=BSETS.shared;
/* ---------- 内部（現代: 博物館 / 江戸時代: 板の間） ---------- */
function slabHoles(bt,fp,holes,y,th){ const xs=[fp.x0,fp.x1],zs=[fp.z0,fp.z1]; for(const h of holes){ if(!h) continue; xs.push(Math.max(fp.x0,Math.min(fp.x1,h.x0)),Math.max(fp.x0,Math.min(fp.x1,h.x1))); zs.push(Math.max(fp.z0,Math.min(fp.z1,h.z0)),Math.max(fp.z0,Math.min(fp.z1,h.z1))); }
  const X=[...new Set(xs)].sort((a,b)=>a-b),Z=[...new Set(zs)].sort((a,b)=>a-b);
  for(let i=0;i<X.length-1;i++) for(let j=0;j<Z.length-1;j++){ const x0=X[i],x1=X[i+1],z0=Z[j],z1=Z[j+1]; if(x1-x0<.01||z1-z0<.01) continue; const mx=(x0+x1)/2,mz=(z0+z1)/2; if(holes.some(h=>h&&mx>h.x0&&mx<h.x1&&mz>h.z0&&mz<h.z1)) continue; bt.add(boxUVGeo(x1-x0,th,z1-z0,2.4,2.4),TM(mx,y-th/2,mz)); } }
function keepInterior(era){ const T=TEN[era],{cx,cz,FL,ST}=T,mod=era==='modern',WB=F=>F&&F.rects&&{rects:F.rects}; B=mod?BM:BE; curSet=mod?BSETS.modern:BSETS.edo;
  /* 地階（穴蔵）: 石の壁、柱、礎石 */
  { const F=FL[0],y=F.y,ti=(TZ.bw/2-TZ.bat),tj=(TZ.bd/2-TZ.bat),E=T.entry; box(B.stone,cx-ti,cx+ti,y-.3,y,cz-tj,cz+tj);
    for(const [x0,x1,z0,z1] of [[-ti,-ti+.8,-tj,tj],[ti-.8,ti,-tj,tj],[-ti,ti,-tj,-tj+.8],[-ti,-1.6,tj-.8,tj],[1.6,ti,tj-.8,tj]]) box(B.stone,cx+x0,cx+x1,y,y+TZ.bh-.3,cz+z0,cz+z1);
    if(mod){ box(B.kmHall,cx-ti+.9,cx-ti+1,y,y+3.2,cz-tj+1,cz+tj-1); B.lampIn.add(new THREE.BoxGeometry(2,.1,.6),TM(cx-3,y+3.6,cz)); B.lampIn.add(new THREE.BoxGeometry(2,.1,.6),TM(cx+3,y+3.6,cz+3)); B.floor.add(boxUVGeo(2*ti-1.8,.06,2*tj-1.8,2.4,2.4),TM(cx,y+.03,cz)); }
    for(let i=-2;i<=2;i++) for(let j=-1;j<=1;j++){ const x=cx+i*3.4,z=cz+j*4; if(ST[0]&&inR(wellR(ST[0],null),x,z,.6)) continue; B.stoneK.add(boxUVGeo(.8,.16,.8,1,1),TM(x,y+.08,z)); B.darkwood.add(new THREE.BoxGeometry(.42,TZ.bh-.3,.42),TM(x,y+(TZ.bh-.3)/2,z)); F.pillars.push([x,z]); }
    B.lampIn.add(new THREE.BoxGeometry(.3,.4,.3),TM(cx-ti+1,y+2.2,cz)); B.lampIn.add(new THREE.BoxGeometry(.3,.4,.3),TM(cx+ti-1,y+2.2,cz-3));
    if(!mod){ for(const [s,x,z] of [['km_tawara',-6.5,-4.5],['km_taru',-6.5,3.5],['km_hako',6.5,-5],['km_tawara',-3,-5.4]]){ DECO_KEEP.push([s,cx+x,y,cz+z]); coll(F,cx+x-.9,cx+x+.9,cz+z-.7,cz+z+.7); } } }
  /* 1〜6階 */
  FL.forEach((F,i)=>{ if(i===0) return; const y=F.y,last=i===FL.length-1;
    const wellDn=ST[i-1]?wellR(ST[i-1],WB(F)):null,wellUp=ST[i]?wellR(ST[i],WB(FL[i+1])):null;
    const hD=[wellDn&&{x0:wellDn.x0-cx,x1:wellDn.x1-cx,z0:wellDn.z0-cz,z1:wellDn.z1-cz}].filter(Boolean);
    B[mod?'floor':'tenF'].add(polySlab(F.P,hD,.25),TM(cx,y-.25,cz));
    if(!last){ const hU=[wellUp&&{x0:wellUp.x0-cx,x1:wellUp.x1-cx,z0:wellUp.z0-cz,z1:wellUp.z1-cz}].filter(Boolean); B[mod?'kmHall':'darkwood'].add(polySlab(F.P,hU,.2),TM(cx,FL[i+1].y-.45,cz)); }
    else B[mod?'kmHall':'darkwood'].add(polySlab(F.P,[],.2),TM(cx,y+F.h-.05,cz));
    if(ST[i-1]) stairWell(F,ST[i-1],mod?'rail':'darkwood',WB(F));
    let a=F.w/2,b=F.d/2;
    /* 博物館の階（1〜5階）は窓の内側を展示の壁でふさぐ（外は見えない）。6階の展望フロアと江戸時代は窓から外が見える */
    if(mod&&i<=5){ const t=.5; for(const [x0,x1,z0,z1] of [[-a+t,a-t,-b+t,-b+t+.1],[-a+t,a-t,b-t-.1,b-t],[-a+t,-a+t+.1,-b+t,b-t],[a-t-.1,a-t,-b+t,b-t]]){
        if(i===1&&x0===-a+t&&x1===-a+t+.1){ box(B.kmHall,cx+x0,cx+x1,y,y+F.h-.45,cz+z0,cz+SX.cz-cz-1.3-0); box(B.kmHall,cx+x0,cx+x1,y,y+F.h-.45,cz+SX.cz-cz+1.3,cz+z1); continue; }
        box(B.kmHall,cx+x0,cx+x1,y,y+F.h-.45,cz+z0,cz+z1); }
      B.lampIn.add(new THREE.BoxGeometry(2.4,.06,.5),TM(cx-a/2,y+F.h-.5,cz)); B.lampIn.add(new THREE.BoxGeometry(2.4,.06,.5),TM(cx+a/2,y+F.h-.5,cz)); }
    else { /* 外壁の内側の柱と長押 */ for(let k=0;k<8;k++){ const p=F.P[k],q=F.P[(k+1)%8],len=Math.hypot(q[0]-p[0],q[1]-p[1]); if(len<1) continue; const [nx,nz]=nrmOut(p,q),ry=Math.atan2(nx,nz),n=Math.max(1,Math.round(len/2.4));
        for(let t=0;t<=n;t++){ const x=cx+p[0]+(q[0]-p[0])*t/n-nx*.4,z=cz+p[1]+(q[1]-p[1])*t/n-nz*.4; B[mod?'rail':'darkwood'].add(new THREE.BoxGeometry(.32,F.h-.45,.32),TM(x,y+(F.h-.45)/2,z)); }
        if(!mod) B.darkwood.add(new THREE.BoxGeometry(len,.14,.1),TM(cx+(p[0]+q[0])/2-nx*.4,y+2.2,cz+(p[1]+q[1])/2-nz*.4,ry)); }
      B.lampIn.add(new THREE.BoxGeometry(.3,.42,.3),TM(cx-a+1.2,y+2.0,cz)); }
    /* 身舎の柱（太い通し柱） */ for(const [x,z] of [[-a*.45,-b*.45],[a*.45,-b*.45],[-a*.45,b*.45],[a*.45,b*.45]]){ const px=cx+x,pz=cz+z; if(ST.some(s=>inR(wellR(s,null),px,pz,.7))) continue; B[mod?'kmHall':'darkwood'].add(new THREE.BoxGeometry(.5,F.h-.45,.5),TM(px,y+(F.h-.45)/2,pz)); F.pillars.push([px,pz]); }
    /* 展示・調度 */
    const free=(x,z,r)=>!ST.some(s=>inR(wellR(s,null),cx+x,cz+z,(r||1)+.4))&&!F.pillars.some(p=>Math.hypot(p[0]-cx-x,p[1]-cz-z)<(r||1)+.4);
    const F2=Object.assign(F,{y});
    if(mod){ if(i===1){ if(free(-3,-4.5,1.5)) diorama(F2,cx-3,cz-4.5,3.2,2,11); if(free(3.5,4.6)) armor(F2,cx+3.5,cz+4.6,Math.PI); if(free(5.5,-4.6)) glassCase(F2,cx+5.5,cz-4.6,2,1,1.1,0); panel(F2,cx,cz-b+.62,0,4,1.6);
        for(let k=0;k<3;k++) DECO_KEEPM.push(['km_hohei_a',0,0,0]) && DECO_KEEPM.pop(); }
      if(i===2){ if(free(-3,-4.4)) glassCase(F2,cx-3,cz-4.4,2.4,1,1.2,0); if(free(3,4.4)) glassCase(F2,cx+3,cz+4.4,2.4,1,1.2,0); panel(F2,cx,cz-b+.62,0,4,1.6); if(free(-5,4.2)) byobu(F2,cx-5,cz+4.2,Math.PI,6,.55,1.6,'kmByobu'); }
      if(i===3){ if(free(0,-2.6,1.6)) diorama(F2,cx,cz-2.6,3.4,2.2,23); panel(F2,cx-2,cz+b-.62,Math.PI,3,1.6); }
      if(i===4){ panel(F2,cx,cz-b+.62,0,4,1.6); if(free(2.5,2.4)) glassCase(F2,cx+2.5,cz+2.4,1.6,1,1,0); }
      if(i===5){ panel(F2,cx+1,cz-b+.62,0,3,1.4); }
      if(i===6){ for(const s of [-1,1]) bx(F2,'darkwood',2.2,.45,.5,cx+s*1.4,y+.22,cz+2,0,null,true); } }
    else { if(i===1){ if(free(-5,-4.5)) armor(F2,cx-5,cz-4.5,0,'#2a2a2e','#7a2d24'); if(free(-2.5,-4.5)) armor(F2,cx-2.5,cz-4.5,0,'#2a2a2e','#26406a'); for(let k=0;k<5;k++) bx(F2,'darkwood',.06,2.6,.06,cx+2+k*.5,y+1.3,cz-b+1.1,0); bx(F2,'darkwood',3,.1,.12,cx+3,y+1.9,cz-b+1); }
      if(i===2){ for(const [s,x,z] of [['km_nagamochi',-4.5,4.5],['km_nagamochi',4.5,-4.5],['km_taru',5,4.6]]) if(free(x,z)){ DECO_KEEP.push([s,cx+x,y,cz+z]); coll(F,cx+x-.8,cx+x+.8,cz+z-.5,cz+z+.5); } }
      if(i===4){ if(free(-3,2.6)) armor(F2,cx-3,cz+2.6,Math.PI,'#2a2a2e','#c79f45'); }
      if(i===6){ box(B.tatami,cx-a+.9,cx+a-.9,y,y+.08,cz-b+.9,cz+b-.9); } } });
  /* 階段 */
  ST.forEach((s,i)=>{ const y0=FL[i].y,n=Math.max(6,Math.round(s.rise/.26)),run=s.to-s.from,w=s.x1-s.x0,x=(s.x0+s.x1)/2,st=Math.abs(run)/n,sg=Math.sign(run);
    for(let k=0;k<n;k++){ const zc=s.from+(k+.5)/n*run,yt=y0+(k+1)/n*s.rise; B.darkwood.add(new THREE.BoxGeometry(w-.12,.08,st+.05),TM(x,yt-.04,zc)); B.darkwood.add(new THREE.BoxGeometry(w-.16,s.rise/n,.04),TM(x,yt-s.rise/n/2,zc-sg*st/2)); }
    const L=Math.hypot(run,s.rise),ang=-Math.atan2(s.rise,run),mz=(s.from+s.to)/2;
    for(const xx of [s.x0+.06,s.x1-.06]){ B.darkwood.add(new THREE.BoxGeometry(.1,.32,L),TM(xx,y0+s.rise/2-.1,mz,0,1,1,1,ang)); B[mod?'rail':'darkwood'].add(new THREE.BoxGeometry(.06,.06,L),TM(xx,y0+s.rise/2+.85,mz,0,1,1,1,ang)); } });
  /* 渡廊下と小天守1階の床・天井 */ { const F=FL[1],y=F.y; for(const r of F.rects.slice(1)){ B[mod?'floor':'tenF'].add(boxUVGeo(r.x1-r.x0+1.5,.25,r.z1-r.z0+1.5,2.4,2.4),TM((r.x0+r.x1)/2,y-.125,(r.z0+r.z1)/2)); B[mod?'kmHall':'darkwood'].add(boxUVGeo(r.x1-r.x0+1.5,.2,r.z1-r.z0+1.5,2.4,2.4),TM((r.x0+r.x1)/2,y+3.9,(r.z0+r.z1)/2)); }
    if(mod){ const r=F.rects[2]; panel(F,(r.x0+r.x1)/2,r.z0+.3,0,3,1.4); } else DECO_KEEP.push(['km_andon',SX.cx+2,y,SX.cz-2]); }
  B=BS; curSet=BSETS.shared; }
keepInterior('edo'); keepInterior('modern');
