/* ================= 江戸時代の人々（切り抜き画像） =================
   人物のことばは、記録をふまえた想像のせりふです */
/* 門番と見張り */
for(const [s,x,z,nm,say] of [
  ['t_yari',-127,52,'南大手門の番士','この南大手門が西出丸の正面じゃ。熊本城でいちばん大きな櫓門よ。'],['ashigaru',-121,52,'南大手門の足軽','行幸坂を上るとき、左の高い石垣を見上げてみよ。'],
  ['yari_a',-153,-12.4,'西大手門の番士','土橋を渡れば二の丸じゃ。ご家老衆のお屋敷が並んでおる。'],['t_yari',-81,25.4,'西櫓御門の番士','この先は数寄屋丸。殿のおもてなしの場じゃ。'],
  ['yari_a',55,-11,'頬当御門の番士','この石段を上れば本丸、正面が大天守じゃ。'],['t_yari',41,99.6,'須戸口門の番士','坪井川の舟の荷は、この門から城へ運び入れる。'],
  ['ashigaru',100,-69.4,'不開門の番','この門は鬼門の方角ゆえ、ふだんは決して開けぬ。'],['yari_a',5.2,2,'天守台の番士','天守の入口は南の穴蔵じゃ。中の階段は急ゆえ、気をつけて上られよ。']]) npc(s,[[x,z]],0,nm,say,{fixed:true});
/* 城内を行き交う人 */
for(const [s,a,b,sp,nm,say] of [
  ['samurai_a',[-124,100],[-124,56],.6,'登城する侍','この坂を上りきると南大手門。本丸までは、まだいくつも門をくぐるぞ。'],['sam_haori',[-130,-40],[-110,-40],.5,'西出丸の侍','清正公は、この城に井戸を120も掘らせたそうな。籠城に備えてのことよ。'],
  ['w_samurai',[-20,-30],[-20,0],.7,'使番','急ぎの使いじゃ。御殿へ参る。'],['sam_kami',[30,-20],[30,-40],.4,'家臣','この石垣の反りを見よ。武者返しと申して、上るほど反り返っておる。'],
  ['samurai_b',[-60,-20],[-46,-20],.5,'平左衛門丸の侍','宇土櫓は天守に負けぬ大きさよ。'],['sam_armor',[70,-40],[70,30],.5,'東竹之丸の侍','東の櫓は坪井川の向こうを見張っておる。'],
  ['samurai_a',[-10,30],[-10,50],.5,'飯田丸の侍','飯田覚兵衛殿は、清正公とともに石垣を築いた名人じゃ。'],['k_monk',[-250,-60],[-250,20],.4,'二の丸を通る僧','加藤のお殿さまは、法華経を深く信じておられたそうな。'],
  ['sam_haori',[-300,-50],[-200,-50],.5,'家老の家臣','この二の丸には、ご家老衆のお屋敷が並ぶ。']]) npc(s,[a,b],sp,nm,say);
/* 城下町（古町）の人々 */
const TOWN_P=[['q_merchant','古町の商人','白川の舟で、米も塩もここへ届く。'],['q_traveler','旅の者','豊前街道を下ってきた。熊本のお城は、遠くからでもよう見える。'],['okami_p','茶屋のおかみ','ひと休みしていきなされ。'],['ninpu','荷を運ぶ人足','坪井川の舟荷じゃ、そこを通してくれ。'],['w_box','町の娘','お寺へお参りに行くところです。'],['k_monk','町の寺の僧','この町は、どの区画にも寺がある。清正公の町割りじゃ。']];
{ let k=0; for(let j=0;j<44;j++){ const P2=TOWN_P[k++%TOWN_P.length],z0=[183,231,279][j%3],x0=-390+rnd()*640,x1=x0+30+rnd()*60; npc(P2[0],j%2?[[x1,z0],[x0,z0]]:[[x0,z0],[x1,z0]],.5+rnd()*.6,P2[1],P2[2]); }
  for(let j=0;j<14;j++){ const P2=TOWN_P[k++%TOWN_P.length],x=-124+(rnd()-.5)*5,z0=140+rnd()*140; npc(P2[0],[[x,z0],[x,z0+40]],.5+rnd()*.5,P2[1],P2[2]); }
  for(let j=0;j<10;j++){ const P2=TOWN_P[k++%TOWN_P.length],x0=-400+rnd()*500; npc(P2[0],[[x0,134],[x0+50,134]],.6+rnd()*.5,P2[1],P2[2]); } }
/* 町の灯り・店先の道具・高札 */
const decoT=new Crowd(GE,900,false);
for(const m of MACHI){ const c=Math.cos(m.ry),s=Math.sin(m.ry); for(const off of [-1.2,1.2]){ const x=m.cx+(m.eo+off)*c+(m.F+.5)*s,z=m.cz-(m.eo+off)*s+(m.F+.5)*c; const r=rnd(); if(r<.3) decoT.add(pick(['lan_white','lan_red']),x,1.55,z,{shadow:false}); else if(r<.4) decoT.add(pick(['km_taru','km_tawara','km_hako']),x,0,z,{s:.7}); } }
for(const [x,z] of [[-128,51],[-120,51],[53,-12],[53,-4],[-152,-14],[-152,-6],[2,1.5],[14,1.5]]) decoT.add('kagaribi',x,gyT(x,z),z,{s:1});
for(const [s,x,z] of [['km_roten',-60,189],['km_mise',-30,189.5],['km_roten',20,237],['km_mise',80,237.5],['km_roten',-200,285],['km_horo',-110,138],['km_niuma',-106,140],['km_kosatsu',-118,145],['km_kosatsu',-40,232]]) decoT.add(s,x,gyT(x,z),z,{});
for(const [s,x,z] of [['km_taru',-300,132],['km_tawara',-296,133],['km_hako',-290,132],['km_tawara',30,132]]) decoT.add(s,x,0,z,{});
/* 天守の中の荷（穴蔵・武具） */
for(const [s,x,y,z] of DECO_KEEP) decoT.add(s,x,y,z,{});
/* 本丸の大銀杏のそばの灯籠 */
/* 現代: 加藤神社の灯籠・のぼり */
{ const dm=new Crowd(GM,60,false); for(const [s,x,z] of [['km_toro',-48,-72],['km_toro',-40,-72],['km_nobori_aka',-52,-76],['km_nobori_ao',-36,-76]]) dm.add(s,x,gyT(x,z),z,{}); }

/* ---------- 室内の調度品・人物 ---------- */
{ const D=RD;
  rp(D.goten,'lord_green',0,.4,-d2(D.goten)-.6,{},true,['加藤清正（想像）','この城は、どんな大軍に攻められても落ちぬよう築いた。井戸も兵糧の備えも万全じゃ。']);
  rp(D.goten,'samurai_a',-6,0,1.5,{},true,['家臣','殿は朝鮮での戦いの経験をもとに、この城の守りを工夫されたと聞く。']); rp(D.goten,'sam_kami',6,0,1.5,{flip:true},true,['家臣','この昭君之間の絵は、狩野派の筆と伝わる。']);
  for(const [s,x,z] of [['km_andon',-8.6,-4.6],['km_andon',8.6,-4.6],['km_tsubo',-6.4,-4.8],['km_zushi',6.4,-4.9],['km_shokudai',-3,-1.4],['km_shokudai',3,-1.4]]) rp(D.goten,s,x,0,z,{},true);
  rp(D.goten,'km_maku',-8.8,0,3,{},false); rp(D.goten,'km_kikyo_ban',0,3.0,-5.9,{},false);
  rp(D.machi,'q_merchant',1.6,.45,1.2,{},false,['町家の主人','清正公のおかげで、熊本の町は商いで賑わっております。']); for(const [s,x,z] of [['km_tawara',-2.5,-1.5],['km_taru',-2.4,3.6],['km_hako',-2.2,.2]]) rp(D.machi,s,x,0,z,{},true);
  rp(D.waku,'km_hohei_a',-6.4,0,-3,{},true); rp(D.waku,'km_shizoku',6.4,0,-3,{flip:true},true); rp(D.waku,'km_kikyo',0,2.2,-5.75,{},false); }
function d2(R){ return R.d/2-1.2; }
/* 天守の中の人（江戸時代） */
{ const T=TEN.edo,F=T.FL,cx=T.cx,cz=T.cz; for(const [i,s,x,z,nm,say] of [[0,'ashigaru',-6,2,'穴蔵の番','この穴蔵には兵糧や武具が納めてある。'],[1,'samurai_a',-5,3,'天守番の侍','この窓は突上戸。開けて外をのぞけば、城下が一望じゃ。'],[6,'sam_haori',1.5,1.5,'天守番','ここが最上階。東に阿蘇、西に金峰山が見える。']]){
    const n=npc(s,[[cx+x,cz+z]],0,nm,say,{fixed:true,y:F[i].y}); } }
