/* ---------- 切り替え ---------- */
let PHI=0,auto=true;
function setScen(sc){ clearUnits(); SCEN=sc; const S=sc?SCENS[sc]:null; GB.visible=!!S; GNPC.visible=!S; if(typeof decoT!=='undefined'&&decoT.pages) for(const pg of decoT.pages) pg.mesh.visible=!S;
  BOUNDS={x0:-420,x1:300,z0:-260,z1:330}; if(MODE==='edo') MAPR=S?{x0:-480,x1:320,z0:-260,z1:340}:MAPR;
  if(!S){ FX.clear(); keepState('whole'); $('scen').hidden=true; $('ticker').hidden=true; if(typeof setFov==='function') setFov(1); return; } $('ticker').hidden=false; setPhase(0); $('scen').hidden=false; }
function setPhase(i){ const S=SCENS[SCEN]; PHI=(i+S.phases.length)%S.phases.length; PH=S.phases[PHI]; phT=0;
  scaledBuild(()=>{ clearUnits(); for(let k=TALK.length-1;k>=0;k--) if(TALK[k].scen) TALK.splice(k,1); PH.build(); });
  { const f=(TAGF[SCEN]||[])[PHI]; if(f) f(); } drawForce(); setTicker(PH.text,'解説'); applyTime(PH.time); FX.clear(); if(FXS.some(f=>f.type!=='cannon'&&!f.t0)) for(let k=0;k<40;k++){ fxsStep(0,.15); FX.update(.15); }
  $('scDate').textContent=S.name+' · '+PH.date; $('scTitle').textContent=PH.title; $('scText').textContent=PH.text; $('scNum').textContent=(PHI+1)+' / '+S.phases.length; $('scText').scrollTop=0; nearSpot=null; lastArea=''; }
let scGround=false;
function goGround(){ const g=PH&&PH.gnd; if(!g){ goPhaseCam(); return; } P.room=null; P.level=-1; P.mode='walk'; $('vView').textContent='歩く'; let x=g[0],z=g[1];
  if(!walkable(x,z)){ outer: for(let r=1;r<40;r+=1) for(let a=0;a<6.283;a+=.5){ const xx=g[0]+Math.cos(a)*r,zz=g[1]+Math.sin(a)*r; if(walkable(xx,zz)){ x=xx; z=zz; break outer; } } }
  P.x=x; P.z=z; P.yaw=Math.atan2(-(g[2]-x),-(g[3]-z)); P.pitch=.02; P.y=groundH(x,z)+1.6; }
function goScenCam(){ if(scGround&&PH&&PH.gnd) goGround(); else goPhaseCam(); $('scGnd').textContent=scGround?'空から':'地上へ'; }
function goPhaseCam(){ if(!PH) return; const c=PH.cam; P.room=null; P.level=-1; P.x=c[0]; P.z=c[1]; P.yaw=c[2]; P.pitch=c[3]; P.mode=c[4]?'drone':'walk'; $('vView').textContent=c[4]?'空撮':'歩く'; P.y=c[4]?Math.max(70,groundH(P.x,P.z)+40):groundH(P.x,P.z)+1.6; }
function updateScen(dt){ if(!SCEN) return; updateUnits(dt); updateTour(dt);
  if(!tour.on&&auto&&phT>(PH.dur||55)&&PHI<SCENS[SCEN].phases.length-1){ setPhase(PHI+1); goScenCam(); } }
function updateChars(dt){ updateNPC(dt); updateScen(dt); FX.update(dt); const T=TIMES[timeIdx],inside=P.room||P.level>=0; sprTint(inside?1:T.night>.5?.45:timeIdx===2?.88:timeIdx===0?.95:1); }
/* ---------- 画面: 時代を選ぶ・場面の案内 ---------- */
{ const st=document.createElement('style'); st.textContent=`
#eraSheet{position:fixed;inset:0;z-index:25;background:rgba(12,13,15,.92);display:flex;align-items:center;justify-content:center;padding:16px}
#eraSheet .in{width:min(440px,100%);display:grid;gap:8px}
#eraSheet h2{font-family:var(--f-disp);font-weight:800;font-size:22px;margin:0 0 6px;letter-spacing:.06em}
#eraSheet button.era{display:grid;grid-template-columns:1fr auto;align-items:center;gap:4px 10px;text-align:left;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:rgba(238,240,241,.04);cursor:pointer}
#eraSheet button.era b{font-family:var(--f-disp);font-size:17px;font-weight:800} #eraSheet button.era small{color:var(--mute);font-size:12px;grid-column:1/3;line-height:1.5}
#eraSheet button.era span{font-size:11px;color:var(--mute)} #eraSheet button.era.on{border-color:rgba(210,69,44,.8);background:rgba(210,69,44,.14)}
#eraSheet .x{justify-self:end;height:38px;padding:0 14px;border-radius:10px;border:1px solid var(--line);background:transparent;cursor:pointer}
#scen{position:fixed;left:calc(env(safe-area-inset-left,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 74px);width:min(360px,calc(100% - 150px));z-index:5;background:var(--panel);border:1px solid rgba(210,69,44,.55);border-radius:12px;padding:10px 12px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
#scen .d{font-size:11px;color:var(--mute);letter-spacing:.06em} #scen .t{font-family:var(--f-disp);font-weight:800;font-size:17px;margin:2px 0 4px;padding-right:96px} #scen .d{padding-right:60px}
#scText{font-size:12.5px;line-height:1.7;max-height:96px;overflow:auto;touch-action:pan-y} #scen.min #scText,#scen.min .row{display:none}
#scen .row{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap} #scen .row button{height:32px;padding:0 10px;border-radius:9px;border:1px solid var(--line);background:transparent;cursor:pointer;font-size:12px}
#scen .gnd{position:absolute;top:26px;right:8px;height:30px;padding:0 10px;border-radius:9px;border:1px solid rgba(210,69,44,.8);background:rgba(210,69,44,.3);color:inherit;cursor:pointer;font-size:12px;font-weight:700} #scen .row button.on{background:rgba(210,69,44,.25)} #scen .tg{position:absolute;top:6px;right:8px;border:0;background:transparent;color:var(--mute);cursor:pointer;font-size:12px}
@media (max-width:520px){ #scen{width:calc(100% - 24px);top:calc(env(safe-area-inset-top,0px) + 168px)} }`; document.head.appendChild(st);
  const es=document.createElement('section'); es.id='eraSheet'; es.hidden=true; es.innerHTML='<div class="in"><h2>時代と体験を選ぶ</h2><div id="eraList" style="display:grid;gap:8px"></div><button class="x" id="eraX">閉じる</button></div>'; document.body.appendChild(es);
  const sp=document.createElement('section'); sp.id='scen'; sp.hidden=true; sp.innerHTML='<button class="tg" id="scTg">たたむ</button><button class="gnd" id="scGnd">地上へ</button><div class="d" id="scDate"></div><div class="t" id="scTitle"></div><div id="scText"></div><div class="row"><button id="scPrev">◀ 前</button><button id="scNext">次 ▶</button><button id="scCam">この場面を最初から</button><button id="scAuto" class="on">自動案内</button><span id="scNum" style="font-size:11px;color:var(--mute);align-self:center"></span></div>'; document.body.appendChild(sp); }
const ERAS=[{k:'modern',b:'現代',s:'令和の熊本城',t:'令和3年に復旧した天守閣、復旧が進む石垣と櫓、特別見学通路を歩いて見学'},{k:'edo',b:'江戸時代',s:'加藤清正・細川家の城',t:'慶長12年（1607）ごろ完成した城と、碁盤目の城下町。天守と本丸御殿の中に入れます'},
  {k:'seinan',b:'西南戦争',s:'明治10年（1877）',t:'天守炎上、薩摩軍の総攻撃、52日間の籠城、包囲が解かれるまでを場面ごとにたどります'}];
function openEra(){ const L=$('eraList'); L.innerHTML=''; const cur=MODE==='modern'?'modern':(SCEN||'edo'); for(const e of ERAS){ const b=document.createElement('button'); b.className='era'+(e.k===cur?' on':''); b.innerHTML='<b></b><span></span><small></small>'; b.querySelector('b').textContent=e.b; b.querySelector('span').textContent=e.s; b.querySelector('small').textContent=e.t;
    b.onclick=()=>{ $('eraSheet').hidden=true; chooseEra(e.k); }; L.append(b); } $('eraSheet').hidden=false; if(typeof closeMenu==='function') closeMenu(); }
function chooseEra(k){ const sc=(k==='modern'||k==='edo')?null:k; if(MODE!==(k==='modern'?'modern':'edo')) setMode(k==='modern'?'modern':'edo'); setScen(sc);
  const E=ERAS.find(e=>e.k===k); $('vEra').textContent=E.b.slice(0,4); $('eyebrow').textContent='熊本城さんぽ · '+E.b; curSpots=spotList(); buildPins();
  if(document.getElementById('tourEnd')) $('tourEnd').hidden=true; if(sc){ $('scen').classList.add('min'); $('scTg').textContent='ひらく'; scGround=false; tour.on=true; auto=true; $('scAuto').classList.add('on'); goScenCam(); tourStart(); showHint(E.b+'：自動案内で見どころを回ります。パッドを動かすと自由に歩けます'); } }
$('tEra').onclick=()=>{ if(started) openEra(); }; $('eraX').onclick=()=>{ $('eraSheet').hidden=true; };
const phaseCam=()=>{ if(tour.on) tourStart(); else goScenCam(); }; $('scPrev').onclick=()=>{ setPhase(PHI-1); phaseCam(); }; $('scNext').onclick=()=>{ setPhase(PHI+1); phaseCam(); }; $('scCam').onclick=()=>{ if(tour.on) tourStart(); else goScenCam(); };
$('scGnd').onclick=()=>{ tourStop(false); scGround=!(scGround&&P.mode==='walk'); goScenCam(); showHint(scGround?'地上に降りました。パッドで歩いて、兵や陣のそばまで近づけます':'空から見ています'); };
$('scAuto').onclick=()=>{ if(tour.on){ tourStop(false); } else { tour.on=true; auto=true; $('scAuto').classList.add('on'); tourStart(); showHint('自動案内を始めます'); } }; $('scTg').onclick=()=>{ const m=$('scen').classList.toggle('min'); $('scTg').textContent=m?'ひらく':'たたむ'; };

window.__scn={KB,KEEP,setT:v=>{phT=v},get STBK(){return STBK},FX,get FXS(){return FXS},get phT(){return phT},get UNITS(){return UNITS},setScen,setPhase,chooseEra};
window.__km={get P(){return P},setMode,teleport:id=>teleport(curSpots.find(s=>s.id===id)),groundH,walkable,get FL(){return FL},TEN,setLook:(x,y,z,yaw,pitch,mode)=>{ P.x=x; P.y=y; P.z=z; P.yaw=yaw; P.pitch=pitch; P.mode=mode||'drone'; P.level=-1; P.room=null; },applyTime};
