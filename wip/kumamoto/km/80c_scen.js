/* ---------- 西南戦争の場面 ---------- */
/* 天守の炎上: PH.fire={t0,dur} の間、天守と本丸御殿から炎と煙。終わると焼け落ちる */
function fireStep(t,dt){ const F=PH.fire; if(t<F.t0) return; const k=(t-F.t0)/F.dur;
  if(k<1){ const n=40*dt; for(let i=0;i<n;i++){ const a=rnd()*6.283,r=rnd()*9,x=TA.cx+Math.cos(a)*r,z=TA.cz+Math.sin(a)*r*.85,y=TA.y0+rnd()*22*(1-k*.6); FX.emit(2,x,y,z,3+rnd()*3,(rnd()-.5)*.8,2+rnd()*2,(rnd()-.5)*.8,1+rnd()*.8); if(rnd()<.3) FX.emit(1,x,y+4,z,5,(rnd()-.5)+.5,3+rnd()*2,(rnd()-.5),12); if(rnd()<.25) FX.emit(4,x,y,z,.4,(rnd()-.5)*3,3+rnd()*3,(rnd()-.5)*3,2.5); }
    for(let i=0;i<14*dt;i++){ const x=GOT.cx+(rnd()-.5)*38,z=GOT.cz+(rnd()-.5)*12; FX.emit(2,x,GOT.y+1+rnd()*5,z,3+rnd()*2,(rnd()-.5)*.6,2+rnd()*2,(rnd()-.5)*.6,1+rnd()*.6); if(rnd()<.3) FX.emit(1,x,GOT.y+6,z,5,.4,3,0,10); }
    if(k>.62&&KX.visible){ keepState('burning'); for(let i=0;i<80;i++) FX.emit(4,TA.cx+(rnd()-.5)*16,TA.y0+rnd()*14,TA.cz+(rnd()-.5)*14,.5,(rnd()-.5)*7,2+rnd()*6,(rnd()-.5)*7,3); showHint('天守が焼け落ちた…（明治10年2月19日）'); } }
  else if(rnd()<dt*3) FX.emit(1,TA.cx+(rnd()-.5)*8,TA.y0+2,TA.cz+(rnd()-.5)*8,6,.5,2.5,0,14); }
const camTo=(x,z,tx,tz,pitch,dr)=>[x,z,yawTo(x,z,tx,tz),pitch||(dr?-.42:.02),dr?1:0];
/* 石垣の上に並ぶ守備の兵: (x0,z0)→(x1,z1) の線上に n 隊。face: 外向き */
function wallLine(x0,z0,x1,z1,y,face,n,o){ o=o||{}; for(let i=0;i<n;i++){ const t=(i+.5)/n,x=x0+(x1-x0)*t,z=z0+(z1-z0)*t; unit(Object.assign({spr:o.spr||K_LINE,n:o.k||5,at:[x,z],w:Math.hypot(x1-x0,z1-z0)/n*.8,d:1,y,face,fire:o.fire??.1,aim:[x+face[0]*80,z+face[1]*80],tight:true},o.u||{})); } }
/* 町を焼く炎（政府軍は籠城の前に、敵の隠れ場所をなくすため城下に火を放った） */
function townFires(list){ for(const [x,z,r] of list) FXS.push({type:'blaze',x,z,y:0,r:r||6,h:6,rate:10,ring:false}); }
function smokeCols(list){ for(const [x,z] of list) FXS.push({type:'column',x,z,y:3,r:8,rate:2}); }
function dc(sp,x,z,o){ return DC(sp,x,z,o); }
const HQ=()=>{ const it=dc('km_shirei',-2,-6,{}); if(it) TALK.push({it,name:'谷干城（熊本鎮台司令長官）',say:'この城は清正公の築かれた天下の名城。援軍が来るまで、一兵たりとも入れてはならぬ。',era:'edo',scen:'seinan'}); dc('km_shikan',2,-6,{flip:true}); dc('km_tent',-14,-4,{}); };
const SCENS={seinan:{name:'西南戦争（明治10年・1877）',fill:{},phases:[
 {date:'明治10年2月19日',title:'天守炎上',time:1,dur:70,fire:{t0:6,dur:40},cam:camTo(-60,70,TA.cx,TA.cz,-.18,1),gnd:[-6,4,TA.cx,TA.cz],
  text:'薩摩軍が熊本へ迫るなか、2月19日の昼ごろ、城内から火が出て、天守と本丸御殿などが焼け落ちました。原因は、失火・放火・鎮台がわざと焼いたなど諸説あり、いまもわかっていません。兵糧も多くが焼けましたが、鎮台は城にこもって戦う覚悟を固めます。',
  build(){ keepState('whole'); HQ(); for(const [x,z] of [[-20,-10],[24,-8],[-28,4],[34,0]]) unit({spr:K_INF,n:6,at:[x,z],w:8,d:4,face:[0,-1],mill:.3,millR:2});
    unit({spr:['km_hohei_a','km_hohei_b','km_hohei_c'],n:8,at:[-10,30],to:[0,8],t0:4,dur:30,w:6,d:6}); for(const [s,x,z] of [['km_tawara',-30,10],['km_taru',-27,12],['km_hako',30,12]]) dc(s,x,z,{}); }},
 {date:'明治10年2月20〜21日',title:'籠城の備え・城下の焼き払い',time:2,dur:70,cam:camTo(-40,260,TA.cx,40,-.3,1),gnd:[30,104,30,150],
  text:'鎮台は、薩摩軍が城下の家々に隠れて近づけないよう、城のまわりの町に火を放ちました。住民は家財を持って逃げ出します。城内には米・弾薬を運び込み、門をふさぎ、石垣の上や長塀に兵を配して、約3,500〜4,000の兵で籠城の構えをとりました。',
  build(){ keepState('gone'); HQ(); townFires([[-200,190,9],[-90,240,8],[30,200,10],[110,250,8],[-300,240,9],[180,180,8],[-40,300,7]]); smokeCols([[-150,230],[60,270]]);
    unit({spr:CIV,n:16,at:[-60,160],to:[-60,320],t0:0,dur:60,w:18,d:10,noScale:true}); unit({spr:CIV.concat(['km_niuma','km_horo']),n:12,at:[90,160],to:[120,320],t0:5,dur:60,w:14,d:8,noScale:true});
    unit({spr:['km_hohei_a','km_hohei_b'],n:8,at:[-120,150],to:[-120,134],t0:0,dur:20,w:10,d:4,fire:0});
    wallLine(-30,106,95,106,0,[0,1],7,{fire:0}); wallLine(-146,47,-100,47,PL.nishide.H,[0,1],3,{fire:0}); wallLine(104.5,-55,104.5,50,PL.higashi.H,[1,0],5,{fire:0});
    for(const [x,z] of [[-20,100],[0,100],[20,100],[60,100]]) dc(pick(['km_sakamogi','km_saku']),x,z+16,{}); for(const [s,x,z] of [['km_tawara',30,90],['km_tawara',34,91],['km_taru',38,90],['km_hako',-20,90]]) dc(s,x,z,{}); }},
 {date:'明治10年2月22日',title:'薩摩軍の総攻撃',time:0,dur:80,cam:camTo(-10,190,10,90,-.35,1),gnd:[10,100,20,150],
  text:'夜明けとともに、薩摩軍は南・西・東から一斉に攻めかかりました。しかし加藤清正が築いた高い石垣と「武者返し」、長塀や櫓からの銃撃に阻まれ、城に取り付くことができません。薩摩軍は力攻めをあきらめ、城を囲んで兵糧攻めに切り替えます。',
  build(){ keepState('gone'); HQ();
    unit({spr:T_INF,n:10,at:[-40,250],to:[-40,138],t0:2,dur:30,w:40,d:10,fire:.6,fireT0:25,aim:[-40,106],back:.35,hold:12,bdur:20,loss:.2});
    unit({spr:T_INF,n:9,at:[60,260],to:[60,138],t0:6,dur:30,w:36,d:10,fire:.6,fireT0:28,aim:[60,106],back:.35,hold:12,bdur:20,loss:.2});
    unit({spr:T_INF,n:8,at:[-430,40],to:[-362,20],t0:4,dur:30,w:30,d:12,fire:.5,fireT0:26,aim:[-330,20],back:.3,hold:10,loss:.15});
    unit({spr:T_INF,n:8,at:[240,0],to:[160,-10],t0:8,dur:30,w:30,d:12,fire:.5,fireT0:30,aim:[104,-10],back:.3,hold:10,loss:.15});
    wallLine(-30,106,95,106,0,[0,1],7,{fire:.5}); wallLine(-146,47,-100,47,PL.nishide.H,[0,1],3,{fire:.4}); wallLine(104.5,-55,104.5,50,PL.higashi.H,[1,0],5,{fire:.4}); wallLine(-340,-100,-340,60,PL.nino.H,[-1,0],5,{fire:.4});
    dc('km_hohou',-8,92,{}); dc('km_hohou',60,92,{}); FXS.push({type:'cannon',from:[-8,8,92],to:[-40,1,170],every:4,spread:14},{type:'cannon',from:[60,8,92],to:[60,1,175],every:5,spread:14});
    smokeCols([[-200,220],[100,240],[-380,0]]); }},
 {date:'明治10年3月',title:'包囲・段山の攻防・兵糧攻め',time:1,dur:75,cam:camTo(-420,-60,-300,-140,-.3,1),gnd:[-330,-104,-380,-150],
  text:'薩摩軍は城を囲み、西の花岡山に大砲を据えて城を砲撃しました。3月12〜13日には、城の北西の段山（だにやま）で激しい奪い合いとなり、鎮台が奪い返します。城内では食糧が乏しくなり、兵は粥や馬の肉でしのいだと伝わります。4月には薩摩軍が川をせき止めて城のまわりを水びたしにする「水攻め」も行いました。',
  build(){ keepState('gone'); HQ();
    unit({spr:T_INF,n:10,at:[-420,-170],to:[-390,-150],t0:0,dur:20,w:30,d:10,fire:.6,aim:[-345,-120],mill:.4,millR:6});
    unit({spr:K_INF,n:10,at:[-330,-100],to:[-370,-140],t0:10,dur:30,w:24,d:8,fire:.6,aim:[-410,-170],back:.2,hold:8});
    dc('km_hohou',-430,300,{flip:true}); dc('km_sat_b',-424,306,{}); FXS.push({type:'cannon',from:[-430,0,300],to:[TA.cx,30,TA.cz+20],every:6,spread:20});
    for(let x=-300;x<120;x+=24) dc(pick(['km_saku','km_sakamogi']),x,150,{}); for(let z=-120;z<100;z+=24) dc(pick(['km_saku','km_sakamogi']),165,z,{});
    unit({spr:T_INF,n:6,at:[-100,160],w:60,d:6,face:[0,-1],fire:.15,aim:[-100,106]}); unit({spr:T_INF,n:5,at:[175,-20],w:40,d:6,face:[-1,0],fire:.15,aim:[104,-20]});
    wallLine(-30,106,95,106,0,[0,1],5,{fire:.12}); wallLine(-340,-100,-340,60,PL.nino.H,[-1,0],4,{fire:.2});
    for(const [s,x,z] of [['km_tawara',-6,26],['km_taru',-2,26],['km_tent',-30,40],['km_kagaribi',-20,30]]) dc(s,x,z,{}); }},
 {date:'明治10年4月14日',title:'包囲が解かれる（籠城52日）',time:0,dur:80,cam:camTo(30,280,40,160,-.35,1),gnd:[44,110,44,180],
  text:'4月8日、鎮台の一隊（奥保鞏の突囲隊）が包囲を破って城外の味方と連絡をつけました。そして4月14日、南から進んできた政府軍の別働隊（山川浩らの隊）が熊本城に入城し、52日間の籠城は終わります。薩摩軍は東へ退き、戦いは九州各地へ移っていきました。',
  build(){ keepState('gone'); HQ();
    unit({spr:K_INF.concat(['km_gun_a','km_gun_b']),n:12,at:[40,330],to:[44,140],t0:2,dur:40,w:30,d:14,fire:.2});
    unit({spr:['km_kihei','km_kihei'],n:3,at:[10,330],to:[20,150],t0:0,dur:30,w:10,d:4,dust:.8,noScale:true}); unit({spr:['km_gunki'],n:1,at:[44,330],to:[44,145],t0:2,dur:40,w:1,d:1,noScale:true});
    unit({spr:T_INF,n:9,at:[170,140],to:[300,40],t0:6,dur:40,w:30,d:12,loss:.1}); unit({spr:T_INF,n:7,at:[-200,170],to:[-80,330],t0:4,dur:40,w:30,d:10});
    unit({spr:['km_charge','km_hohei_a','km_hohei_b'],n:8,at:[44,100],to:[44,124],t0:20,dur:10,w:8,d:6});
    wallLine(-30,106,95,106,0,[0,1],4,{fire:0}); }}]}};
