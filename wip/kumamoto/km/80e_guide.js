/* ================= 合戦・築城の案内: 自動案内・テロップ・部隊の名札・兵力グラフ・戦況図 ================= */
/* 兵力（通説・諸説あり）と、人形の数の目安（1体＝約500人） */
const FORCE={seinan:{t:14000,k:3800}};
const PER=100;
/* 場面ごとの損害と結果（通説・諸説あり） */
const LOSS={seinan:[null,'城下の多くが焼け、住民は避難','総攻撃は失敗。薩摩軍は力攻めをやめて包囲へ','城内は食糧不足に。段山は鎮台が確保','4月14日 包囲が解かれる（籠城52日）']};
const TGT={seinan:[null,null,null,null,null]};
const SIDE_K=/^km_(hohei|aim|kneel|load|charge|crouch|hohou|gunki|gun_|shikan|shirei|kihei|uma_b)/,SIDE_T=/^km_(sat_|shizoku|shosei)/;
let UMULT={t:1,k:1};
function unitSide(spr){ let k=0,t=0; for(const s of spr){ if(SIDE_K.test(s)) k++; else if(SIDE_T.test(s)) t++; } return k>t?'k':t>0?'t':null; }

/* 自動案内の立ち寄り先: [x,z, 見る先x,z, 空撮1/地上0, テロップ] */
const TOURS={
 seinan:[
  [[-60,70,TA.cx,TA.cz,1,'明治10年2月19日の昼ごろ、本丸から火の手が上がりました。天守も本丸御殿も、みるみる炎に包まれます'],[-6,4,TA.cx,TA.cz,0,'出火の原因は、失火・薩摩方の放火・鎮台の自焼など諸説あり、今もわかっていません'],[60,40,TA.cx,TA.cz,1,'加藤清正の築いた天守は、こうして270年の歴史を閉じました']],
  [[-40,260,0,200,1,'鎮台は、敵が町家に隠れて近づけないよう、城のまわりの町に火を放ちました'],[30,104,30,150,0,'長塀や石垣の上に兵を並べ、門をふさいで籠城の構えをとります'],[-60,200,-60,300,1,'住民は家財を持って、城下から逃げ出しました']],
  [[-10,190,0,120,1,'2月22日、薩摩軍は南・西・東から一斉に攻めかかりました'],[20,100,20,150,0,'長塀の内側から、鎮台の兵が銃で応戦します'],[-60,30,-120,47,1,'西出丸の高い石垣と武者返しが、薩摩軍を寄せつけません'],[200,-60,104,-10,1,'東の坪井川の向こうからも攻撃がありましたが、城に取り付けませんでした']],
  [[-420,-60,-380,-150,1,'3月12〜13日、城の北西の段山で激しい奪い合いが起こりました'],[-380,320,TA.cx,TA.cz,1,'西の花岡山から、薩摩軍の大砲が城を狙います'],[-6,30,-4,26,0,'城内では米が足りなくなり、粥や馬の肉でしのいだと伝わります']],
  [[30,280,40,160,1,'4月14日、南から政府軍の別働隊が到着し、熊本城に入りました'],[44,110,44,180,0,'52日間の籠城は終わり、城は最後まで落ちませんでした'],[200,60,300,40,1,'薩摩軍は東へ退き、戦いは九州各地へと移っていきます']]]};
/* 寄って見せる見どころ（望遠のズーム倍率）: ZOOM[場面][番号][見どころの番号] */
const ZOOM={seinan:[[0,1.4,0],[0,1.2,0],[0,1.3,1.2,0],[1.4,0,1.2],[0,1.2,0]]};
const BASE_FOV=camera.fov; let fovNow=BASE_FOV;
function setFov(z){ const f=BASE_FOV/Math.max(1,z); if(Math.abs(f-camera.fov)>.01){ camera.fov=f; camera.updateProjectionMatrix(); } fovNow=f; }
/* ---------- 名札（3Dの部隊の上に浮かぶ） ---------- */
const TAGS=[]; const TAGCOL={t:'#c8352a',k:'#2f5fa8',n:'#6b6458'};
function tagSprite(text,side){ const f='bold 44px "Hiragino Sans","Noto Sans JP",sans-serif',c=makeCanvas(8,8),g0=c.getContext('2d'); g0.font=f; const w=Math.ceil(g0.measureText(text).width)+60;
  c.width=w; c.height=72; const g=c.getContext('2d'); g.fillStyle='rgba(14,15,17,.86)'; g.beginPath(); g.roundRect?g.roundRect(2,2,w-4,68,14):g.rect(2,2,w-4,68); g.fill();
  g.fillStyle=TAGCOL[side]||TAGCOL.n; g.fillRect(2,2,16,68); g.strokeStyle=TAGCOL[side]||TAGCOL.n; g.lineWidth=4; g.strokeRect(4,4,w-8,64);
  g.font=f; g.fillStyle='#fff'; g.textBaseline='middle'; g.fillText(text,34,38); const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,depthWrite:false,toneMapped:false,fog:false,transparent:true})); s.renderOrder=9; s.userData.aspect=w/72; return s; }
function tagP(x,z,text,side,h){ const s=tagSprite(text,side); GB.add(s); TAGS.push({s,x,z,h:h||6,side}); }
function tagU(u,text,side){ if(!u) return; const s=tagSprite(text,side); GB.add(s); TAGS.push({s,u,h:6,side}); }
const uSpr=n=>UNITS.find(u=>u.spr[0]===n);
function uNear(x,z,side){ let b=null,bd=1e9; for(const u of UNITS){ if(side&&u.side!==side) continue; const d=Math.hypot(u.at[0]-x,u.at[1]-z); if(d<bd){ bd=d; b=u; } } return b; }
function clearTags(){ for(const t of TAGS){ GB.remove(t.s); t.s.material.map.dispose(); t.s.material.dispose(); } TAGS.length=0; }
const _tv=new THREE.Vector3();
function updateTags(){ const cx=camera.position.x,cy=camera.position.y,cz=camera.position.z,H=innerHeight,W=innerWidth,f=1/Math.tan(camera.fov*Math.PI/360),L=[];
  for(const t of TAGS){ let x=t.x,z=t.z;
    if(t.u){ const p=unitPos(t.u,{ox:0,oz:0,mx:.5,ph:0},phT); x=p[0]; z=p[2]; } const y=withScen(()=>groundH(x,z))+t.h+(t.u&&t.u.y!==null?t.u.y:0);
    const d=Math.hypot(x-cx,y-cy,z-cz),hh=Math.min(60,Math.max(1.2,(H>W?24:H<500?15:21)*2*d/(f*H))); t.s.position.set(x,y+hh*.6,z); t.s.scale.set(hh*t.s.userData.aspect,hh,1); t.s.visible=d<900&&!P.room&&P.level<0;
    if(!t.s.visible) continue; _tv.copy(t.s.position).project(camera); if(_tv.z>1) continue; const ph=hh*f/d*H/2*1.08,pw=ph*t.s.userData.aspect;
    L.push({t,sx:(_tv.x+1)/2*W,sy:(1-_tv.y)/2*H,pw,ph,d,hh}); }
  /* 重なった名札は、近いものを下に残し、遠いものを上へずらす（それでも重なれば小さく薄くする） */
  L.sort((a,b)=>a.d-b.d); const placed=[];
  for(const q of L){ let sy=q.sy,k=0; const hit=y=>placed.some(o=>Math.abs(o.sx-q.sx)<(o.pw+q.pw)/2&&Math.abs(o.sy-y)<(o.ph+q.ph)/2);
    while(hit(sy)&&k<5){ sy-=q.ph*1.05; k++; }
    if(k){ q.t.s.position.y+=q.hh*1.05*k; } if(hit(sy)){ q.t.s.scale.multiplyScalar(.7); q.t.s.material.opacity=.55; } else q.t.s.material.opacity=1;
    placed.push({sx:q.sx,sy,pw:q.pw,ph:q.ph}); } }
const TAGF={seinan:[()=>{ tagP(TA.cx,TA.cz,'天守・本丸御殿 炎上','n',40); tagP(-2,-6,'熊本鎮台 本営（谷干城）','k',8); },
  ()=>{ tagP(0,220,'城下の焼き払い','n',10); tagP(30,106,'長塀の守り（鎮台）','k',8); tagP(-60,300,'避難する住民','n',6); },
  ()=>{ tagP(-40,150,'薩摩軍（南から）','t',8); tagP(60,150,'薩摩軍（南から）','t',8); tagP(-370,20,'薩摩軍（西から）','t',8); tagP(165,-10,'薩摩軍（東から）','t',8); tagP(30,106,'熊本鎮台 約3,500〜4,000','k',10); tagP(-2,-6,'鎮台 本営','k',8); },
  ()=>{ tagP(-380,-150,'段山の攻防（3月12〜13日）','n',10); tagP(-430,300,'花岡山の砲台（薩摩軍）','t',8); tagP(-60,150,'包囲の柵','t',6); },
  ()=>{ tagP(40,200,'政府軍の別働隊（4月14日 入城）','k',10); tagP(240,90,'退く薩摩軍','t',8); tagP(TA.cx,TA.cz,'籠城52日を守り抜いた熊本城','n',20); }]};

/* ---------- 1体＝約500人にそろえる（いったん並べて数え、倍率をかけて並べ直す） ---------- */
function countSides(){ const c={t:{u:0,f:0},k:{u:0,f:0}},inU=new Set(); for(const u of UNITS) for(const m of u.mem){ if(!m.it||m.flag) continue; inU.add(m.it); if(u.side&&u.scal) c[u.side].u++; else if(u.side) c[u.side].f++; }
  for(const it of bCrowd.items){ if(inU.has(it)||it.hidden||it.twin||/_nb_/.test(it.name)) continue; if(SIDE_K.test(it.name)&&it.name!=='teppo_k') c.k.f++; else if(SIDE_T.test(it.name)) c.t.f++; } return c; }
function scaledBuild(build){ UMULT={t:1,k:1}; build(); const tg=(TGT[SCEN]||[])[PHI]; if(!tg) return; const c=countSides(),m={};
  for(const s of ['t','k']) m[s]=c[s].u>0?Math.max(0,(tg[s]-c[s].f)/c[s].u):1; if(Math.abs(m.t-1)<.06&&Math.abs(m.k-1)<.06) return; UMULT=m; build(); UMULT={t:1,k:1}; }
function sideCounts(){ const c=countSides(); return {t:c.t.u+c.t.f,k:c.k.u+c.k.f}; }

/* ---------- 画面: テロップ・兵力グラフ ---------- */
{ const st=document.createElement('style'); st.textContent=`
#ticker{position:fixed;left:0;right:0;bottom:env(safe-area-inset-bottom,0px);height:38px;z-index:6;pointer-events:none;overflow:hidden;background:linear-gradient(90deg,rgba(12,12,14,.9),rgba(12,12,14,.78));border-top:2px solid rgba(210,69,44,.75)}
#ticker .lb{position:absolute;left:0;top:0;bottom:0;z-index:2;display:flex;align-items:center;padding:0 10px;background:#b8341f;color:#fff;font-size:12px;font-weight:800;letter-spacing:.08em}
#ticker .tx{position:absolute;top:0;left:0;white-space:nowrap;line-height:36px;font-size:16px;font-weight:700;color:#fff;text-shadow:0 1px 2px #000;will-change:transform}
#scForce{margin:6px 0 2px;display:grid;gap:3px} #scForce .r{display:grid;grid-template-columns:44px 1fr auto;gap:6px;align-items:center;font-size:11.5px}
#scForce .b{height:9px;border-radius:5px;background:rgba(255,255,255,.08);overflow:hidden} #scForce .b i{display:block;height:100%;border-radius:5px}
#scForce .n{font-size:10.5px;color:var(--mute)} #scForce .l{font-size:10.5px;color:#f1c27a;line-height:1.35} #scForce em{font-style:normal;color:#ff8a7a;font-size:.9em;margin-left:3px} #scForce .sw{display:flex;position:relative;overflow:visible} #scForce .sw i{border-radius:0} #scForce .sw i:first-child{border-radius:5px 0 0 5px} #scForce .sw i:last-child{border-radius:0 5px 5px 0} #scForce .sw b{position:absolute;top:-2px;bottom:-2px;width:2px;margin-left:-1px;background:#fff;box-shadow:0 0 4px #000;transition:left .4s} #scForce .b i{transition:width .4s} #scForce .st{font-weight:700;color:#9fc3ff} #scForce .st.bad{color:#ff8a7a} #scForce .u{font-size:10px;color:var(--mute);margin-top:1px}
#scen #scText{display:none} #scen{box-sizing:border-box;max-width:calc(100% - 24px)} #scen .t{font-size:16px} #mini.battle{width:150px;height:150px}
#scen.min{top:calc(env(safe-area-inset-top,0px) + 68px);width:calc(100% - 196px - env(safe-area-inset-left,0px) - env(safe-area-inset-right,0px));max-width:340px;padding:6px 8px 7px;border-radius:10px}
#scen.min .d,#scen.min #scForce .u{display:none} #scen.min .t{font-size:13px;margin:0 0 4px;padding-right:92px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:22px}
#scen.min .gnd{top:6px;right:46px;height:22px;padding:0 7px;font-size:10.5px;border-radius:7px} #scen.min .tg{top:8px;right:6px;font-size:11px}
#scen.min #scForce{margin:0;gap:2px} #scen.min #scForce .r{grid-template-columns:34px 1fr auto;gap:5px;font-size:10.5px} #scen.min #scForce .b{height:7px}
@media (min-width:760px){ #scen.min{top:calc(env(safe-area-inset-top,0px) + 74px)} }`; document.head.appendChild(st);
  const tk=document.createElement('div'); tk.id='ticker'; tk.hidden=true; tk.innerHTML='<span class="lb" id="tkLb">案内</span><span class="tx" id="tkTx"></span>'; document.body.appendChild(tk);
  const f=document.createElement('div'); f.id='scForce'; $('scText').after(f); }
const tick={x:0,w:0,cw:0,lbw:0,text:'',speed:70};
function setTicker(text,label){ if(text===tick.text) return; tick.text=text; const tx=$('tkTx'); tx.textContent=text; $('tkLb').textContent=label||'案内';
  tick.lbw=$('tkLb').offsetWidth; tick.cw=$('ticker').clientWidth; tick.w=tx.scrollWidth; tick.x=tick.lbw+12; tx.style.transform=`translateX(${tick.x}px)`; tick.hold=2.2; }
function tickerNeed(){ return Math.max(0,tick.w-(tick.cw-tick.lbw-24))/tick.speed+5; }   /* 読み切るのに必要な秒数 */
function updateTicker(dt){ if($('ticker').hidden) return; const room=tick.cw-tick.lbw-24; if(tick.w<=room) return; if(tick.hold>0){ tick.hold-=dt; return; }
  tick.x-=tick.speed*dt; if(tick.x<-tick.w+tick.lbw+room*.6){ tick.x=tick.lbw+12; tick.hold=2.2; } $('tkTx').style.transform=`translateX(${tick.x}px)`; }
/* 場面ごとの兵力と戦況の移り変わり（通説をもとにした目安）: [場面の中の秒, 薩摩軍, 政府軍, 戦況(豊臣の優勢 0〜1)] */
const FLOW={seinan:[[[0,14000,3800,.5],[30,14000,3800,.5]],
  [[0,14000,3800,.5],[40,14000,3800,.48]],
  [[0,14000,3800,.62],[20,13800,3700,.6],[45,13300,3600,.45]],
  [[0,13300,3600,.5],[30,13000,3400,.47],[60,12800,3300,.42]],
  [[0,12800,3300,.38],[25,12500,3300,.24],[50,12200,3300,.12]]]};
function flowAt(t){ const L=((FLOW[SCEN]||[])[PHI]); if(!L) return null; if(t<=L[0][0]) return L[0]; for(let i=1;i<L.length;i++) if(t<=L[i][0]){ const a=L[i-1],b=L[i],k=(t-a[0])/(b[0]-a[0]); return a.map((v,j)=>v+(b[j]-v)*k); } return L[L.length-1]; }
let flowLast=null;
function drawForce(){ const F=FORCE[SCEN],el=$('scForce'); if(!F){ el.innerHTML='<div class="u">人足・職人を動員した築城の様子（人数は目安ではありません）</div>'; flowLast=null; return; }
  const fw=flowAt(phT)||[0,F.t,F.k,.5],t=fw[1],k=fw[2],bal=fw[3],mx=Math.max(F.t,F.k),fm=v=>v>=10000?'約'+(Math.round(v/1000)/10)+'万':'約'+(Math.round(v/100)*100).toLocaleString();
  const L=(FLOW[SCEN]||[])[PHI]||[[0,t,k]],t0=L[0][1],k0=L[0][2],dl=(v0,v)=>v0-v>=50?`<em>▼${fm(v0-v).replace('約','')}</em>`:'';
  const st=bal>=.62?'薩摩軍 優勢':bal>=.45?'互角':bal>=.25?'薩摩軍 劣勢':'薩摩軍 総崩れ';
  flowLast=[t,k,bal]; const c=sideCounts();
  el.innerHTML=`<div class="r"><span>薩摩軍</span><span class="b"><i style="width:${t/mx*100}%;background:#c8352a"></i></span><span>${fm(t)}${dl(t0,t)}</span></div>`+
    `<div class="r"><span>政府軍</span><span class="b"><i style="width:${k/mx*100}%;background:#2f5fa8"></i></span><span>${fm(k)}${dl(k0,k)}</span></div>`+
    `<div class="r w"><span>戦況</span><span class="b sw"><i style="width:${bal*100}%;background:#c8352a"></i><i style="width:${(1-bal)*100}%;background:#2f5fa8"></i><b style="left:${bal*100}%"></b></span><span class="st${bal<.45?' bad':''}">${st}</span></div>`+
    (((LOSS[SCEN]||[])[PHI])?`<div class="l">${LOSS[SCEN][PHI]}</div>`:'')+
    ((TGT[SCEN]||[])[PHI]?`<div class="u">人形1体＝約${PER}人（この場面：薩摩 ${c.t}体・政府 ${c.k}体）／兵力は通説で諸説あり</div>`:'<div class="u">兵力・戦況は通説をもとにした目安です</div>'); }
/* 場面が進むにつれてメーターを動かす */
{ let acc=0; const _u=updateTour; updateTour=function(dt){ _u(dt); if(!SCEN||!FORCE[SCEN]) return; acc+=dt; if(acc<.4) return; acc=0; const f=flowAt(phT); if(f&&flowLast&&(Math.abs(f[1]-flowLast[0])>20||Math.abs(f[2]-flowLast[1])>20||Math.abs(f[3]-flowLast[2])>.005)) drawForce(); }; }

/* ---------- 自動案内（カメラが見どころを順に回る） ---------- */
const tour={on:true,i:-1,t:0,dur:0,from:null,to:null,move:0,done:false,snap:null};
function stopCam(s){ const [x,z,lx,lz,dr]=s; const yy=dr?49.6:withScen(()=>groundH(x,z))+1.6,ty=withScen(()=>groundH(lx,lz))+(dr?2:1.4); const d=Math.hypot(lx-x,lz-z)||1;
  return {x,z,y:yy,yaw:Math.atan2(-(lx-x),-(lz-z)),pitch:Math.max(-1.1,Math.min(.4,Math.atan2(ty-yy,d)*(dr?.78:1))),dr}; }
function tourStops(){ return ((TOURS[SCEN]||[])[PHI])||[]; }
function tourGo(i){ const S=tourStops(); tour.i=i; tour.spun=false; if(i>=S.length){ tour.done=true; tour.t=0; return; } const s=S[i]; tour.to=stopCam(s); tour.to.zoom=((ZOOM[SCEN]||[])[PHI]||[])[i]||1; tour.from=Object.assign({x:P.x,z:P.z,y:P.y,yaw:P.yaw,pitch:P.pitch},{zoom:BASE_FOV/camera.fov}); tour.move=0; tour.t=0;
  P.room=null; P.level=-1; P.mode=s[4]?'drone':'walk'; $('vView').textContent=s[4]?'空撮':'歩く'; setTicker(s[5],(i+1)+' / '+S.length); tour.dur=Math.max(9,tickerNeed());
  const sp=s[6]; if(sp==='sled'&&PH&&PH.sled){ PH.sledT0=phT+2.6; tour.to=Object.assign(sledCam(PH.sled[0],PH.sled[1]),{zoom:1}); tour.dur=Math.max(26,tour.dur); }
  else if(sp&&sp.orbit){ tour.to=Object.assign(orbitCam(sp.orbit,0),{zoom:1}); tour.dur=Math.max(sp.orbit[6],tour.dur); } }
/* 特別なカメラ: 修羅を横から追う／燃える天守のまわりをゆっくり回る */
function sledCam(p,q){ const dx=q[0]-p[0],dz=q[1]-p[1],l=Math.hypot(dx,dz)||1,ux=dx/l,uz=dz/l,x=p[0]-uz*20-ux*6,z=p[1]+ux*20-uz*6,gh=(a,b)=>withScen(()=>groundH(a,b)),y=Math.max(gh(x,z),gh(p[0],p[1]))+8,tx=p[0]+ux*6,tz=p[1]+uz*6;
  return {x,z,y,yaw:Math.atan2(-(tx-x),-(tz-z)),pitch:Math.atan2(gh(tx,tz)+1-y,Math.hypot(tx-x,tz-z)),dr:1}; }
function sledNow(){ const path=PH.sled,L=path.length-1,k=Math.min(L-.001,(Math.max(0,phT-(PH.sledT0||0))/(PH.sledDur||60))%1*L),i=k|0,u=k-i,a=path[i],b=path[i+1]; return [[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],b]; }
function orbitCam(o,k){ const [cx,cz,R,H,a0,a1]=o,a=a0+(a1-a0)*k,x=cx+Math.sin(a)*R,z=cz+Math.cos(a)*R,gh=(p,q)=>withScen(()=>groundH(p,q)),y=gh(cx,cz)+H,ty=gh(cx,cz)+22;
  return {x,z,y,yaw:Math.atan2(-(cx-x),-(cz-z)),pitch:Math.atan2(ty-y,R),dr:1}; }
function tourStart(){ tour.done=false; tourGo(0); }
function userMoving(){ return joy.id!==null||looks.size>0||Object.keys(keys).some(k=>keys[k]); }
function tourStop(msg){ setFov(1); if(!tour.on) return; tour.on=false; auto=false; $('scAuto').classList.remove('on'); if(msg) showHint('自動案内を止めました。「自動案内」でもう一度始まります'); const S=tourStops(); if(PH) setTicker(PH.text,'解説'); }
function tourEnd(){ setFov(1); tour.on=false; auto=false; $('scAuto').classList.remove('on'); setTicker('自動案内はここで終わりです。「自動案内」でもう一度見られます。パッドで自由に歩くこともできます','終了');
  const E=ERAS.find(e=>e.k===SCEN); $('tourEndT').textContent=(E?E.b:'')+'の自動案内が終わりました'; $('tourEnd').hidden=false; }
function updateTour(dt){ if(!SCEN||!PH) return; updateTicker(dt); updateTags(); if(!tour.on) return;
  if(userMoving()){ tourStop(true); return; }
  if(tour.done){ tour.t+=dt; if(tour.t>3){ if(PHI<SCENS[SCEN].phases.length-1){ if(auto){ setPhase(PHI+1); tourStart(); } } else tourEnd(); } return; }
  if(tour.i<0) return; const a=tour.from,b=tour.to;
  if(tour.move<1){ tour.move=Math.min(1,tour.move+dt/2.6); const k=tour.move*tour.move*(3-2*tour.move); let dy=b.yaw-a.yaw; dy=Math.atan2(Math.sin(dy),Math.cos(dy));
    P.x=a.x+(b.x-a.x)*k; P.z=a.z+(b.z-a.z)*k; P.y=a.y+(b.y-a.y)*k; P.yaw=a.yaw+dy*k; P.pitch=a.pitch+(b.pitch-a.pitch)*k; setFov(tour.move<.5?1+(a.zoom-1)*(1-tour.move*2):1+(b.zoom-1)*sstep((tour.move-.5)*2)); return; }
  P.x=b.x; P.z=b.z; tour.t+=dt;
  const sp=tourStops()[tour.i][6];
  if(sp==='sled'||(sp&&sp.orbit)){ if(tour.t>tour.dur){ tourGo(tour.i+1); return; } const c=sp==='sled'?sledCam(...sledNow()):orbitCam(sp.orbit,Math.min(1,tour.t/tour.dur)); P.x=c.x; P.z=c.z; P.y=c.y; P.yaw=c.yaw; P.pitch=c.pitch; setFov(1); return; }
  if(tour.t<=tour.dur){ P.yaw=b.yaw; P.pitch=b.pitch; setFov(b.zoom); return; }
  /* 見どころを見たあと、地上へ降りて見どころに寄って見せる（降りられない所は、その場でズーム） */
  const st=tour.t-tour.dur; if(!tour.spun){ tour.spun=true; const s0=tourStops()[tour.i]; tour.bt=battleGroups(s0[2],s0[3]); if(tour.bt){ tour.bt.cam=null; if(phT>tour.bt.end-4) phT=Math.max(0,tour.bt.start-1); } tour.cu=tour.bt?null:closeCam(s0,b); if(!tour.bt&&!tour.cu){ tour.spun=false; tourGo(tour.i+1); return; } }
  if(tour.bt){ const done=followBattle(tour.bt,b,st,dt); if(done){ tour.spun=false; tourGo(tour.i+1); } return; }
  const c=tour.cu,MV=3.2,HOLD=CLOSE_T; if(st<MV){ const k=sstep(st/MV); let dy=c.yaw-b.yaw; dy=Math.atan2(Math.sin(dy),Math.cos(dy)); P.x=b.x+(c.x-b.x)*k; P.z=b.z+(c.z-b.z)*k; P.y=b.y+(c.y-b.y)*k; P.yaw=b.yaw+dy*k; P.pitch=b.pitch+(c.pitch-b.pitch)*k; setFov(b.zoom+(c.zoom-b.zoom)*k); return; }
  if(c.walk&&P.mode!=='walk'){ P.mode='walk'; $('vView').textContent='歩く'; }
  P.x=c.x; P.z=c.z; P.y=c.y; P.yaw=c.yaw; P.pitch=c.pitch; setFov(c.zoom);
  if(st>=MV+HOLD){ tour.spun=false; tourGo(tour.i+1); } }
const CLOSE_T=7;   /* 地上で見どころを見る秒数 */
/* 見どころ（s の見る先）のそばの地上の立ち位置を探す */
/* 寄って見せる所（見どころごとに手で決めた、少し高い所からの寄りのカメラ）: [カメラx,z,地面からの高さ, 見る先x,z,地面からの高さ, ズーム] */
const CLOSE={};
function closeCam(s,b){ const dr=s[4],zm=Math.max(1,b.zoom||1); if(!dr) return {x:b.x,z:b.z,y:b.y,yaw:b.yaw,pitch:b.pitch,zoom:Math.min(2.4,Math.max(1.3,zm*1.3)),walk:true};
  const C=CLOSE[SCEN+'/'+PHI+'/'+tour.i]; if(!C) return null; const [cx,cz,ch,lx,lz,lh,z]=C,gh=(x,z)=>withScen(()=>groundH(x,z)),y=Math.max(gh(cx,cz),gh(lx,lz))+ch,ty=gh(lx,lz)+lh,d=Math.hypot(lx-cx,lz-cz);
  return {x:cx,z:cz,y,yaw:Math.atan2(-(lx-cx),-(lz-cz)),pitch:Math.atan2(ty-y,d),zoom:z,walk:false}; }
{ const st=document.createElement('style'); st.textContent=`#tourEnd{position:fixed;left:50%;top:42%;transform:translate(-50%,-50%);z-index:30;width:min(320px,calc(100% - 40px));background:var(--panel);border:1px solid rgba(210,69,44,.7);border-radius:14px;padding:16px;text-align:center;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
#tourEnd b{display:block;font-family:var(--f-disp);font-size:18px;margin-bottom:6px} #tourEnd p{font-size:12.5px;color:var(--mute);margin:0 0 12px;line-height:1.6} #tourEnd .r{display:flex;gap:8px;justify-content:center}
#tourEnd button{height:36px;padding:0 14px;border-radius:10px;border:1px solid var(--line);background:transparent;cursor:pointer;font-size:13px} #tourEnd button.p{background:rgba(210,69,44,.35);border-color:rgba(210,69,44,.8)}`; document.head.appendChild(st);
  const d=document.createElement('section'); d.id='tourEnd'; d.hidden=true; d.innerHTML='<b id="tourEndT">自動案内が終わりました</b><p>おつかれさまでした。ここからは自由に歩いて、陣や部隊のそばまで近づいてみましょう。</p><div class="r"><button id="tourAgain">最初からもう一度</button><button class="p" id="tourFree">自由に歩く</button></div>'; document.body.appendChild(d);
  $('tourFree').onclick=()=>{ $('tourEnd').hidden=true; };
  $('tourAgain').onclick=()=>{ $('tourEnd').hidden=true; setPhase(0); tour.on=true; auto=true; $('scAuto').classList.add('on'); tourStart(); }; }
/* ---------- 戦況図（右上の地図を戦場全体の図に） ---------- */
const BR={x0:-480,x1:320,z0:-260,z1:340};
function battleOverlay(g,X,Z,sc,dpr){ for(const u of UNITS){ if(!u.side||u.mem.length===0) continue; const col=u.side==='t'?'#e0412f':'#3b78d8',p=unitPos(u,{ox:0,oz:0,mx:.5,ph:0},phT),r=Math.max(2*dpr,Math.min(7*dpr,Math.sqrt(u.mem.length)*sc*1.6));
    if(u.to){ g.strokeStyle=col; g.globalAlpha=.75; g.lineWidth=1.6*dpr; g.setLineDash([3*dpr,2*dpr]); g.beginPath(); g.moveTo(X(u.at[0]),Z(u.at[1])); g.lineTo(X(u.to[0]),Z(u.to[1])); g.stroke(); g.setLineDash([]);
      const ang=Math.atan2(Z(u.to[1])-Z(u.at[1]),X(u.to[0])-X(u.at[0])),ex=X(u.to[0]),ez=Z(u.to[1]); g.fillStyle=col; g.beginPath(); g.moveTo(ex+Math.cos(ang)*5*dpr,ez+Math.sin(ang)*5*dpr); g.lineTo(ex+Math.cos(ang+2.4)*5*dpr,ez+Math.sin(ang+2.4)*5*dpr); g.lineTo(ex+Math.cos(ang-2.4)*5*dpr,ez+Math.sin(ang-2.4)*5*dpr); g.fill(); g.globalAlpha=1; }
    g.fillStyle=col; g.strokeStyle='#fff'; g.lineWidth=.8*dpr; g.beginPath(); g.arc(X(p[0]),Z(p[2]),r,0,6.283); g.fill(); g.stroke(); }
  for(const t of TAGS){ if(t.u) continue; g.fillStyle=TAGCOL[t.side]||'#888'; g.fillRect(X(t.x)-3*dpr,Z(t.z)-3*dpr,6*dpr,6*dpr); }
  g.save(); g.translate(X(P.x),Z(P.z)); g.rotate(-P.yaw); g.fillStyle='#fff'; g.strokeStyle='#111'; g.lineWidth=1.2*dpr; g.beginPath(); g.moveTo(0,-7*dpr); g.lineTo(5*dpr,6*dpr); g.lineTo(0,3*dpr); g.lineTo(-5*dpr,6*dpr); g.closePath(); g.fill(); g.stroke(); g.restore(); }
const WORLD=(()=>{ const c=makeCanvas(8,8); return c; })();
function drawWorld(g,X,Z){ const a=Math.max(BR.x0,DX0),b=Math.min(BR.x1,DX0+DW),c=Math.max(BR.z0,DZ0),d=Math.min(BR.z1,DZ0+DW); g.drawImage(mapCE||mapC,(a-DX0)*GS,(c-DZ0)*GS,(b-a)*GS,(d-c)*GS,X(a),Z(c),X(b)-X(a),Z(d)-Z(c)); }
const _drawMini0=drawMini; drawMini=function(){ const mb=!!SCEN&&MODE==='edo'&&!P.room&&P.level<0; $('mini').classList.toggle('battle',mb); if(!mb) return _drawMini0();
  const r=miniC.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),S=Math.round(r.width*dpr); if(miniC.width!==S){ miniC.width=miniC.height=S; }
  const W=BR.x1-BR.x0,H=BR.z1-BR.z0,sc=S/Math.max(W,H),ox=(S-W*sc)/2,oz=(S-H*sc)/2; mini2.fillStyle='#4a4842'; mini2.fillRect(0,0,S,S);
  drawWorld(mini2,x=>ox+(x-BR.x0)*sc,z=>oz+(z-BR.z0)*sc); battleOverlay(mini2,x=>ox+(x-BR.x0)*sc,z=>oz+(z-BR.z0)*sc,sc,dpr); };
const _drawMap0=drawMap; drawMap=function(){ _drawMap0(); if(!SCEN) return; const c=$('mapC'),g=c.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),sx=c.width/(MAPR.x1-MAPR.x0),sz=c.height/(MAPR.z1-MAPR.z0); g.fillStyle='#4a4842'; g.fillRect(0,0,c.width,c.height); drawWorld(g,x=>(x-MAPR.x0)*sx,z=>(z-MAPR.z0)*sz);
  battleOverlay(g,x=>(x-MAPR.x0)*sx,z=>(z-MAPR.z0)*sz,Math.min(sx,sz),dpr); };
window.__tour={tour,tourGo,TAGS,get phT(){return phT},sc:(s)=>sideCenter(tour.bt,s),pickAny:(x,y)=>pickAny(x,y)};


/* ---------- 合戦を追うカメラ: 近くでぶつかる薩摩軍・政府軍の両方が画面に入る位置から、動きに合わせて追う ---------- */
function battleGroups(lx,lz){ if(SCEN!=='seinan') return null; let near=UNITS.filter(u=>u.side&&u.n>2&&u.mem.length&&Math.hypot(u.at[0]-lx,u.at[1]-lz)<300&&Math.hypot((u.to||u.at)[0]-lx,(u.to||u.at)[1]-lz)<300);
  const mv0=near.filter(u=>u.to); if(!mv0.length) return null; let fx=0,fz=0; for(const u of mv0){ fx+=u.to[0]; fz+=u.to[1]; } fx/=mv0.length; fz/=mv0.length;
  near=near.filter(u=>Math.hypot((u.to||u.at)[0]-fx,(u.to||u.at)[1]-fz)<140||(u.to&&Math.hypot(u.at[0]-fx,u.at[1]-fz)<200)); if(!near.some(u=>u.side==='t')||!near.some(u=>u.side==='k')) return null;
  let start=1e9,end=0; for(const u of near) if(u.to){ start=Math.min(start,u.t0||0); end=Math.max(end,(u.t0||0)+(u.dur||20)+(u.back?(u.hold||4)+(u.bdur||u.dur||20):0)); } if(end===0){ start=0; end=20; }
  return {near,start,end:Math.min(end,60),lx,lz}; }
function sideCenter(G,side){ let x=0,z=0,n=0; for(const u of G.near){ if(u.side!==side) continue; const p=unitPos(u,{ox:0,oz:0,mx:.5,ph:0},phT); x+=p[0]*u.n; z+=p[2]*u.n; n+=u.n; } return n?[x/n,z/n]:null; }
function followBattle(G,b,st,dt){ const t=sideCenter(G,'t'),k=sideCenter(G,'k'); if(!t||!k) return st>8;
  const mx=(t[0]+k[0])/2,mz=(t[1]+k[1])/2,sep=Math.max(30,Math.hypot(t[0]-k[0],t[1]-k[1])),dx=(t[0]-k[0])/sep,dz=(t[1]-k[1])/sep;
  /* 両軍を結ぶ線の横から、両方が画面の左右に入る距離で見る */ if(!G.sgn){ const a=Math.hypot(b.x-(mx-dz*99),b.z-(mz+dx*99)),c=Math.hypot(b.x-(mx+dz*99),b.z-(mz-dx*99)); G.sgn=a<c?1:-1; }
  const W=innerWidth,H=innerHeight,fovH=2*Math.atan(Math.tan(BASE_FOV*Math.PI/360)*W/H),D=Math.max(40,(sep*.5+16)/Math.tan(fovH/2)*.82),hgt=D*.32+6;
  const cx=mx-dz*D*G.sgn,cz=mz+dx*D*G.sgn,gy=withScen(()=>groundH(mx,mz)),cy=Math.max(gy,withScen(()=>groundH(cx,cz)))+hgt,yaw=Math.atan2(-(mx-cx),-(mz-cz)),pitch=Math.atan2(gy+2-cy,D);
  const tgt={x:cx,z:cz,y:cy,yaw,pitch}; if(!G.cam){ G.cam={x:P.x,z:P.z,y:P.y,yaw:P.yaw,pitch:P.pitch}; G.k0=0; }
  const r=Math.min(1,dt*(st<3?1.2:2.2)),c=G.cam; for(const q of ['x','y','z','pitch']) c[q]+=(tgt[q]-c[q])*r; let dy=tgt.yaw-c.yaw; dy=Math.atan2(Math.sin(dy),Math.cos(dy)); c.yaw+=dy*r;
  if(P.mode!=='drone'){ P.mode='drone'; $('vView').textContent='空撮'; } P.x=c.x; P.z=c.z; P.y=c.y; P.yaw=c.yaw; P.pitch=c.pitch; setFov(1);
  return st>Math.max(12,Math.min(30,G.end-phT+4)); }
/* ---------- 誰にでも話しかけられる: 場面・陣営・役目に合ったセリフ ---------- */
const ROLE=[['bs',/_bs_/],['work',/^(ninpu|km_nofu|km_mino)$/],['teppo',/^km_(hohei|aim|kneel|load|crouch|gun_|sat_)/],['yari',/^km_charge/],['kiba',/^km_(kihei|uma_b)$/],['shou',/^km_(shikan|shirei|shizoku|gunki)$/],['hohei',/^km_hohou$/],['sou',/^km_sou$|monk/],['onna',/^km_(musume|onna)$|^(okami_p|w_box)$/],['kodomo',/^km_kodomo$/],['hei',/^(km_shosei|q_merchant)$/]];
const NOT_PERSON=/nobori|maku|tent|saku|sakamogi|kagaribi|tawara|taru|hako|horo|niuma|kosatsu|roten|mise/;
const RNAME={fallen:'傷ついた兵',work:'農民',teppo:'兵',yari:'兵',kiba:'騎兵',shou:'隊長',hohei:'砲兵',sou:'僧',onna:'町の女',kodomo:'町の子ども',hei:'町の人'};
function roleOf(n){ n=n.replace(/_b$/,''); if(NOT_PERSON.test(n)) return null; for(const [r,re] of ROLE) if(re.test(n)) return r; return null; }
function sideOf(n){ return SIDE_K.test(n)?'k':(SIDE_T.test(n)||/^(y_|r_)/.test(n))?'t':null; }
/* LINES[場面][番号][役目または陣営] */
const LINES={seinan:[
  {k:['火事だ！ 天守が燃えておる！','弾薬を運び出せ、急げ！','兵糧の米まで焼けてしもうた……'],t:['熊本の城から煙が上がっておるそうな。'],onna:['お城が……お城が燃えております！'],all:['天守が燃えるなど、誰が思うたじゃろう。']},
  {k:['町に火を放て、敵に隠れ場所を与えるな！','門はすべて土嚢でふさげ。','米と弾をできるだけ運び込め！'],onna:['家が……でも、命あっての物種です。'],kodomo:['おっかあ、どこへ逃げるの？'],work:['荷車に積めるだけ積んで、川の向こうへ逃げるぞ。'],all:['城下が火の海じゃ……']},
  {t:['城を一揉みに揉みつぶせ！','西郷どんのために、ここで手柄を立てるぞ！','石垣が高すぎて、とても登れん……'],k:['引きつけて撃て！','鎮台兵は百姓の兵と侮られたが、ここで意地を見せる時じゃ。','清正公の石垣が、我らを守ってくださる！']},
  {t:['段山を取られてはならぬ、押し返せ！','城は兵糧が尽きかけておると聞く。待てば落ちる。'],k:['今日も粥じゃ……','援軍はまだか。南の方で大砲の音がするぞ。','段山は我らが取り返した！']},
  {k:['援軍じゃ！ 援軍が来たぞ！','よう、ここまで持ちこたえた……','52日の籠城、清正公の城は落ちなんだ。'],t:['ここは退くしかない。東へ向かえ。'],all:['ようやく戦が終わる……']}]};
const AREA_LINES=[[/本丸|天守/,['この天守は、加藤清正公が築かれたのじゃ。','本丸御殿には、殿のお住まいと政の場があります。']],[/城下町|古町/,['清正公の町割りで、どの町にも寺があるのじゃ。','白川の舟で、米も塩もここへ届く。']],[/二の丸|武家/,['ご家老衆のお屋敷が並んでおる。']],[/長塀|坪井川/,['この長い塀は、坪井川に沿ってずっと続いておる。']]];
const GEN_LINES={all:['よいお日和でございますな。','熊本のお城は、どこから見ても見事なものです。']};
function pickAny(sx,sy){ let best=null,bd=1e9; const C=SCEN?bCrowd:(MODE==='edo'&&typeof npcCrowd!=='undefined'?npcCrowd:null); if(!C) return null;
  for(const it of C.items){ if(it.hidden||it.off||!it.h||!roleOf(it.name)) continue; const d=tapHit(it,sx,sy,60); if(d>=0&&d<bd){ bd=d; best=it; } } if(!best) return null;
  if(BSG[best.name]) return {name:BSG[best.name][0],say:BSG[best.name][1]};
  const r=roleOf(best.name),sd=SCEN?sideOf(best.name):null; let pool=null; if(r==='fallen') return {name:'傷ついた兵',say:['う、うう……水を……','もう歩けぬ……置いていってくれ。','味方はどこじゃ……'][(best._k=(best._k||0)+1)%3]};
  if(SCEN){ const L=((LINES[SCEN]||[])[PHI])||{}; pool=L[r]||(sd&&L[sd])||((r==='work'||r==='ishiku'||r==='boss')&&L.work)||L.all||(sd&&L[sd==='t'?'t':'k']); if(!pool) pool=L.t||L.k||GEN_LINES.all; }
  else { const a=areaAt(best.x,best.z)||''; const hit=AREA_LINES.find(([re])=>re.test(a)); pool=hit?hit[1]:GEN_LINES.all; }
  best._k=(best._k===undefined?(best.i||0):best._k+1); const say=pool[best._k%pool.length];
  const side=sd==='t'?'薩摩軍の':sd==='k'?'政府軍の':''; let nm=RNAME[r]||'町の人'; if(!SCEN&&!/本丸|山里|詰ノ丸|中之段/.test(areaAt(best.x,best.z)||'')) nm={onna:'町の女',hei:'侍',shou:'武士',work:'人足'}[r]||nm; return {name:side+nm,say}; }