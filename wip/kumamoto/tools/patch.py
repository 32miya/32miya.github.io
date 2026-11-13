p='/home/claude/work/out/index.html'; s=open(p).read()
R=[
('<meta name="description" content="織田信長の安土城（滋賀県近江八幡市・特別史跡）を、現代の城跡と信長の時代を切り替えてスマホで歩いて巡れる3D散策アプリ。幻の天主の中も上れます">','<meta name="description" content="加藤清正が築いた熊本城（熊本県熊本市・特別史跡）を、現代・江戸時代・西南戦争の3つの時代でスマホで歩いて巡れる3D散策アプリ。天守の中にも上れます">'),
('<title>安土城さんぽ</title>','<title>熊本城さんぽ</title>'),
('安土城さんぽ · 現代</div><div class="area" id="area">大手道</div>','熊本城さんぽ · 現代</div><div class="area" id="area">本丸</div>'),
('<h1 class="vtitle">安土城</h1>','<h1 class="vtitle">熊本城</h1>'),
('滋賀県近江八幡市 · 特別史跡 · 3D散策','熊本県熊本市 · 特別史跡 · 3D散策'),
('<p>織田信長が琵琶湖のほとりの安土山に築いた城。一直線の大手道を上り、黒金門を抜けて天主台跡へ。摠見寺の三重塔や二王門も歩けます。メニューの「時代」で、天正9年（1581年）ごろの信長の時代に切り替えると、焼失した幻の天主に入り、地階から金色の最上階まで上れます。</p>',
 '<p>加藤清正が茶臼山に築いた名城。「武者返し」の石垣が段々に重なり、黒い大天守と小天守がそびえます。地震から復旧した天守閣の中を最上階まで上り、宇土櫓・長塀・本丸御殿の下の闇り通路も歩けます。メニューの「時代」で、江戸時代の城と城下町、そして明治10年（1877）の西南戦争の52日間の籠城を体験できます。</p>'),
('<div class="note">距離は実際より縮め、建物の配置と寸法は簡略化しています。信長の時代の姿は、『信長公記』やフロイスの記録・発掘の成果をもとに、言い伝えと仮説（復元案）で補った想像の再現です。</div>',
 '<div class="note">距離は実際より縮め、建物の配置と寸法は簡略化しています。江戸時代の姿は、古写真・絵図や復元の成果をもとに、記録の少ない部分（天守の内部や城下の家並みなど）を言い伝えと想像で補った再現です。西南戦争の兵力・動きは通説にもとづく目安です。</div>'),
("stoneE:'stone_nozura_atarashii',stoneM:'stone_nozura_koke'","stoneE:'stone_uchikomi',stoneM:'stone_uchikomi'"),
("{ const E=TEN.edo.entry,t=labelSprite('天主入口（穴蔵）','近づくと入れます'); t.position.set(TA.cx,TZ.g0+5.2,E.Z+1); GE.add(t); DOOR_MARKS.push({sp:t,base:TZ.g0+5.2,era:'edo',x:TA.cx,z:E.Z+1.2}); }",
 "for(const [era,par] of [['edo',GE],['modern',GM]]){ const E=TEN[era].entry,t=labelSprite(era==='edo'?'天守入口（穴蔵）':'天守閣 入口','近づくと入れます'); t.position.set(TA.cx,TZ.g0+5.2,E.Z+1); par.add(t); DOOR_MARKS.push({sp:t,base:TZ.g0+5.2,era,x:TA.cx,z:E.Z+1.2}); }"),
("if(MODE==='edo'){ const E=TEN.edo.entry;","if(!TEN[MODE].none&&!SCEN){ const E=TEN[MODE].entry;"),
("return {name:'天主に入る'","return {name:'天守に入る'"),
("MODE==='edo'&&dz<0&&","!TEN[MODE].none&&!SCEN&&dz<0&&"),
("TEN.edo.entry","TEN[MODE].entry"),
("showHint('天主台の南に出ました。石段を下りると","showHint('天守台の南に出ました。ここは"),
("'天主の地階（穴蔵）に入りました。東の階段で1階へ上れます'","'天守の地階（穴蔵）に入りました。東の階段で1階へ上れます'"),
("MAPR={x0:-260,x1:250,z0:-300,z1:255};","MAPR={x0:-440,x1:310,z0:-270,z1:340};"),
("$('vEra').textContent=m==='edo'?'信長':'現代'; $('eyebrow').textContent='安土城さんぽ · '+(m==='edo'?'信長の時代':'現代');","$('vEra').textContent=m==='edo'?'江戸':'現代'; $('eyebrow').textContent='熊本城さんぽ · '+(m==='edo'?'江戸時代':'現代');"),
("showHint(m==='edo'?'信長の時代（天正9年・1581年ごろ）の安土城と城下町。記録・発掘の成果に、言い伝えと仮説を合わせて再現しています':'現代の安土城跡に戻りました')","showHint(m==='edo'?'江戸時代（加藤清正・細川家）の熊本城と城下町。古写真・絵図などの記録に、言い伝えと想像を合わせて再現しています':'現代（令和）の熊本城に戻りました')"),
("$('tEra').onclick=()=>setMode(MODE==='edo'?'modern':'edo');","$('tEra').onclick=()=>{ if(started) openEra(); };"),
("ATLAS_META.pages=5; Object.assign(ATLAS_META.s,AZD2); /* 5ページ目: 安土城の人物・小物・鯱・提灯（共通素材 deco_azuchi2.webp） */","ATLAS_META.pages=5; Object.assign(ATLAS_META.s,KMD); /* 5ページ目: 熊本城の人物・兵・小物（共通素材 deco_kumamoto.webp） */"),
("'/oshiro/common/assets/deco_azuchi2.webp'","'/oshiro/common/assets/deco_kumamoto.webp'"),
("P.level>=0?FL[P.level].name","P.level>=0?flName()"),
("const P={x:0,z:36,y:1.6","const P={x:8,z:-2,y:31.6"),
]
for a,b in R:
    n=s.count(a)
    if n==0: print('MISSING:',a[:70])
    s=s.replace(a,b)
s=s.replace("function keepState(s){","function flName(){ const F=FL[P.level]; if(F&&F.zones) for(const z of F.zones) if(inR(z.r,P.x,P.z,0)) return z.name; return F?F.name:''; }\nfunction keepState(s){")
open(p,'w').write(s)
