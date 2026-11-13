/* ================= 中に入れる建物 ================= */
B=BE;
/* 本丸御殿 昭君之間・若松之間（江戸時代）: 金の障壁画の大広間 */
{ const R=RD.goten=mkRoom(Object.assign({era:'edo'},doorAt(-6,GOT.cz-GOT.d/2-.7,0,-1),roomTxt('本丸御殿 昭君之間','ほんまるごてん しょうくんのま','本丸御殿でもっとも格式の高い部屋。中国・漢の時代の王昭君の物語を描いた金の障壁画で飾られていたと伝わります（ここに並ぶ松・桜・鶴・竹の襖絵は再現のための想像の絵）。「昭君」は「将軍」の隠語で、豊臣秀頼をかくまうための部屋だったという言い伝えもあります（真偽は不明）。',[['完成','慶長15年（1610）ごろ'],['焼失','明治10年（1877）'],['復元','平成20年（2008）'],['伝承','秀頼をかくまう部屋']])));
  const w=20,d=12,h=4.6; shell(R,w,d,h,{floor:'tatami',ftile:1.8,wall:'kin',front:'shoji',ceil:'kinpaku',ctile:2.4,door:2.4,doorH:2.6,lamps:4}); pillarsRow(R,'lacquer',w,d,h,3,true); nageshi(R,'lacquer',w,d,2.9);
  fusumaWall(R,w,d,2.85,3.2,['kmMatsuL','kmMatsuR','kmSakuraL','kmSakuraR','kmTsuru','kmTake','kmSakura2L','kmSakura2R']); coffer(R,w,d,h,2,['kinpaku','greenP','kinpaku']);
  ranmaRow(R,w,d,2.95,3.75,3.4,['km_ranma_matsu','km_ranma_nami']);
  rb(R,'tatami',-5,5,0,.4,-d/2+.2,-d/2+3.4,true,1.8); rb(R,'lacquer',-5,5,.36,.42,-d/2+3.35,-d/2+3.45);
  rg(R,'kmByobu',new THREE.BoxGeometry(6,1.7,.05),0,1.25,-d/2+.6); }
/* 城下の町家（江戸時代） */
{ const m=pickMachi(-40,190),dd=machiDoor(m); const R=RD.machi=mkRoom(Object.assign({era:'edo'},dd,roomTxt('城下の町家','じょうかの まちや','古町の商家。加藤清正は城下を碁盤の目に町割りし、白川や坪井川の舟運を整えて商いを盛んにしたと伝わります。間口が狭く奥に長い町家が通りに並びました。',[['町','古町'],['造り','間口が狭く奥に長い']])));
  const w=6.4,d=11,h=3.6; shell(R,w,d,h,{floor:'tsuchi',wall:'tsuchi',front:'woodGrain',ceil:'woodGrain',door:1.6,doorX:-2,doorMat:'noren',lamps:2});
  rb(R,'tatami',-.9,w/2,0,.45,-d/2,d/2-.8,true,1.8); rb(R,'darkwood',-1,-.9,0,.47,-d/2,d/2-.8); rb(R,'woodGrain',2.6,3.1,.45,2.3,-1.4,1,true); rb(R,'stone',-3,-1.4,0,.8,-d/2+.3,-d/2+1.6,true); }
B=BM;
/* 熊本城ミュージアム わくわく座（現代） */
{ const R=RD.waku=mkRoom(Object.assign({era:'modern'},doorAt(-86,166.4,0,-1),roomTxt('熊本城ミュージアム わくわく座','くまもとじょうミュージアム わくわくざ','桜の馬場 城彩苑にある歴史文化体験施設。加藤清正の築城から西南戦争、熊本地震と復旧まで、熊本城の歴史を映像や模型、体験で紹介しています（展示は簡略化）。',[['場所','桜の馬場 城彩苑'],['展示','映像・模型・体験']])));
  const w=16,d=12,h=5; shell(R,w,d,h,{floor:'floor',wall:'kmHall',front:'glass',ceil:'black',door:2.2,doorMat:'glass',lamps:4});
  rb(R,'darkwood',-3,3,0,.9,-2,1,true); rb(R,'dote',-2.9,2.9,.9,.95,-1.9,.9); rb(R,'showcase',-w/2+.1,-w/2+.16,1,2.6,-4,4); rb(R,'showcase',w/2-.16,w/2-.1,1,2.6,-4,4); rb(R,'black',-5,5,1,4,-d/2+.1,-d/2+.2); }
B=BS;
const roomName=R=>R.name;
