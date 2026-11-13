/* ================= 熊本城の素材 ================= */
/* 桔梗紋（加藤家）: 5枚の花びらの先に切れ込み。鬼瓦・棟の端・幕に */
function kikyo(g,cx,cy,r,col,bg){ g.save(); g.translate(cx,cy); g.fillStyle=col;
  for(let i=0;i<5;i++){ g.save(); g.rotate(i/5*6.283); g.beginPath(); g.moveTo(0,0); g.bezierCurveTo(-r*.55,-r*.25,-r*.62,-r*.86,-r*.18,-r*.98); g.lineTo(0,-r*.84); g.lineTo(r*.18,-r*.98); g.bezierCurveTo(r*.62,-r*.86,r*.55,-r*.25,0,0); g.fill(); g.restore(); }
  g.strokeStyle=bg; g.lineWidth=r*.06; for(let i=0;i<5;i++){ g.save(); g.rotate(i/5*6.283); g.beginPath(); g.moveTo(0,-r*.2); g.lineTo(0,-r*.78); g.stroke(); g.restore(); }
  g.fillStyle=bg; g.beginPath(); g.arc(0,0,r*.16,0,6.283); g.fill(); g.restore(); }
{ const c=makeCanvas(256,256),g=c.getContext('2d'); g.fillStyle='#2c2f35'; g.fillRect(0,0,256,256); g.fillStyle='#3d4148'; g.beginPath(); g.arc(128,128,122,0,6.283); g.fill();
  g.strokeStyle='#22252a'; g.lineWidth=10; g.beginPath(); g.arc(128,128,112,0,6.283); g.stroke(); kikyo(g,128,128,92,'#565b63','#2c2f35');
  M.tachi=std({map:toTex(c,true,false),roughness:.5,metalness:.45}); M.kiri=M.tachi; }
/* 金の桔梗紋（御殿の飾り金具・幕） */
{ const c=makeCanvas(256,256),g=c.getContext('2d'); g.clearRect(0,0,256,256); g.strokeStyle='#e0b04a'; g.lineWidth=14; g.beginPath(); g.arc(128,128,112,0,6.283); g.stroke(); kikyo(g,128,128,86,'#e0b04a','rgba(0,0,0,0)');
  M.kikyoG=std({map:toTex(c,true,false),transparent:true,alphaTest:.4,roughness:.35,metalness:.7,side:THREE.DoubleSide}); }
M.roofA=M.roof;
M.shachiK=std({color:0x2e3134,roughness:.45,metalness:.55});
/* 熊本城の壁: 上に白漆喰の小壁、下は黒い下見板張り（墨を塗った板を横に重ねる）。v は壁の高さ全体で 0〜1 */
function kmWallCanvas(win){ const c=makeCanvas(256,512),g=c.getContext('2d'); g.fillStyle='#e9e7e1'; g.fillRect(0,0,256,512); mottleTex(g,256,140,60,['#e0ddd5','#f3f2ee','#d8d5cb'],.4); weather(g,256,140,18,110); speckle(g,256,140,900,.08);
  g.fillStyle='#16171a'; g.fillRect(0,132,256,380);
  for(let y=140;y<512;y+=19){ g.fillStyle='rgba(255,255,255,.06)'; g.fillRect(0,y,256,2); g.fillStyle='rgba(0,0,0,.55)'; g.fillRect(0,y+16,256,3); for(let k=0;k<3;k++){ g.fillStyle=`rgba(${rnd()<.5?60:0},${rnd()<.5?55:0},${rnd()<.5?50:0},.12)`; g.fillRect(rnd()*256,y+2,30+rnd()*60,13); } }
  for(const x of [0,128]){ g.fillStyle='#0b0b0d'; g.fillRect(x,132,7,380); }
  g.fillStyle='#0d0d0f'; g.fillRect(0,126,256,10);
  if(win){ /* 突上戸の窓（上に開く黒い板戸）と格子 */ g.fillStyle='#08080a'; g.fillRect(70,190,116,96); for(let bx=76;bx<182;bx+=11){ g.fillStyle='#3a3a38'; g.fillRect(bx,190,4,96); } g.fillStyle='#1d1e21'; g.fillRect(64,178,128,14); g.fillStyle='rgba(0,0,0,.6)'; g.fillRect(64,192,128,6); }
  return c; }
const cKmW=kmWallCanvas(false), cKmWB=kmWallCanvas(true);
addMatLater('kmW',()=>{ const t=toTex(cKmW); return std({map:t,bumpMap:toBump(cKmW,1.2),bumpScale:.25,roughness:.78,side:THREE.DoubleSide}); });
addMatLater('kmWB',()=>{ const t=toTex(cKmWB); return std({map:t,bumpMap:toBump(cKmWB,1.2),bumpScale:.25,roughness:.78}); });
/* 長塀: 上は白漆喰、下は黒い下見板（熊本城の塀は腰が黒い） */
{ const g=cDobei.getContext('2d'); g.fillStyle='#e4e0d6'; g.fillRect(0,0,256,256); mottleTex(g,256,120,50,['#d6d0c2','#ece8df'],.5); weather(g,256,120,18,90); speckle(g,256,120,1000,.1);
  g.fillStyle='#0f1012'; g.fillRect(0,112,256,10); g.fillStyle='#17181b'; g.fillRect(0,122,256,134); for(let y=126;y<256;y+=16){ g.fillStyle='rgba(255,255,255,.06)'; g.fillRect(0,y,256,2); g.fillStyle='rgba(0,0,0,.5)'; g.fillRect(0,y+13,256,3); }
  for(let x=18;x<256;x+=64){ g.fillStyle='#1b1815'; g.fillRect(x,70,14,14); g.beginPath(); g.moveTo(x+30,86); g.lineTo(x+48,86); g.lineTo(x+39,70); g.closePath(); g.fill(); }
  tDobei.needsUpdate=true; }
/* 本丸御殿の外壁（白い漆喰と黒い腰板） */
addMatLater('kmGotenW',()=>{ const c=makeCanvas(256,256),g=c.getContext('2d'); g.fillStyle='#ece8de'; g.fillRect(0,0,256,256); mottleTex(g,256,256,40,['#e2ddd0','#f3f0e8'],.4); g.fillStyle='#2a2119'; g.fillRect(0,170,256,86); for(let x=0;x<256;x+=32){ g.fillStyle='#1c150f'; g.fillRect(x,0,8,256); } return std({map:toTex(c),roughness:.85}); });
/* 現代の天守閣（博物館）の内装: 白い壁と展示パネル */
addMatLater('kmHall',()=>std({color:0xe8e6e0,roughness:.75,side:THREE.DoubleSide}));
