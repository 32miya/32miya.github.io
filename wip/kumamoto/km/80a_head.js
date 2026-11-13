/* ================= 西南戦争の体験（シナリオ）: 明治10年（1877）2月〜4月 =================
   ・事実: 2月19日 城内で原因不明の出火、天守・本丸御殿などが焼失。2月22日 薩摩軍が総攻撃。熊本鎮台（司令長官 谷干城）は籠城し、
     4月14日に政府軍の別働隊が到着して包囲が解かれるまで52日間、城を守り抜いた。
   ・兵力は通説（薩摩軍 約13,000〜16,000、政府軍 約3,500〜4,000）で諸説あり。兵の配置・動きは、記録をもとにした目安と想像です */
KX.visible=true; GOTG.visible=true;
const GB=new THREE.Group(); GE.add(GB); GB.visible=false; const bCrowd=new Crowd(GB,1800);
const yawTo=(fx,fz,tx,tz)=>Math.atan2(-(tx-fx),-(tz-fz));
const KEEP={X:{g:KX},cx:TA.cx,cz:TA.cz}; const GT={visible:true}; function keepBuild(){ } var STBK=[]; const BSG={};
const sled={visible:false,position:new THREE.Vector3(),rotation:{y:0}};
const KB={top:1e9};
/* 焼け跡: 天守台の上の焼け残りの柱と瓦、本丸御殿の礎石 */
const RUIN=new THREE.Group(); RUIN.visible=false; GE.add(RUIN);
{ const y=TA.y0; for(let i=0;i<14;i++){ const m=mesh(new THREE.BoxGeometry(.35,1+rnd()*3.2,.35),std({color:0x1d1a17,roughness:1})); m.position.set(TA.cx+(rnd()-.5)*15,y+.8,TA.cz+(rnd()-.5)*12); m.rotation.set((rnd()-.5)*.8,rnd()*3,(rnd()-.5)*.8); RUIN.add(m); }
  for(let i=0;i<40;i++){ const m=mesh(new THREE.BoxGeometry(.8+rnd(),.3,.6+rnd()),M.roof); m.position.set(TA.cx+(rnd()-.5)*16,y+.2,TA.cz+(rnd()-.5)*13); m.rotation.set(rnd(),rnd()*3,rnd()); RUIN.add(m); }
  for(let i=0;i<30;i++){ const m=mesh(new THREE.BoxGeometry(.4,1.5+rnd()*2,.4),std({color:0x221d18,roughness:1})); m.position.set(GOT.cx+(rnd()-.5)*38,GOT.y+.7,GOT.cz+(rnd()-.5)*12); m.rotation.set((rnd()-.5)*.6,rnd()*3,(rnd()-.5)*.6); RUIN.add(m); } }
function keepState(s){ KX.visible=s!=='gone'; KXI.visible=s!=='gone'; GOTG.visible=s!=='gone'; RUIN.visible=s==='gone'||s==='burning'; }
/* ---------- 部隊（兵の集団）---------- */
const K_INF=['km_hohei_a','km_aim','km_hohei_b','km_kneel','km_load','km_hohei_c','km_crouch','km_aim'],K_LINE=['km_kneel','km_aim','km_load','km_crouch','km_kneel','km_aim'],
  T_INF=['km_sat_a','km_sat_b','km_shizoku','km_sat_a','km_shosei','km_sat_b'],T_LEAD=['km_shizoku','km_sat_b'],CIV=['km_musume','km_onna','km_nofu','km_kodomo','km_mino','km_sou','q_merchant','okami_p','w_box','ninpu'],
  K_FLAG=['km_gunki'],T_FLAG=['km_sat_a'],RED=T_INF,WORK=CIV,PULL=CIV;
