/* お城さんぽシリーズ共通: 御城印（登城の記録）
   天守の最上階に着いたら、その城の御城印をこの端末に記録し、御城印を押す演出を出す。
   ・各城の画面左上の場所の表示（#area）を見張り、最上階の名前になったら記録する（各城のコードは変えずに済む）
   ・記録は入口（/oshiro/）の御城印帳と同じ localStorage "oshiroSanpo.goshuin"（城の id の配列）
   ・各城の index.html の oshiro-portal ブロックで <script src="/oshiro/common/goshuin.js"></script> を読む
   ・新しい城を足すときは CASTLES に「リポジトリ名: [id, 城名]」を、最上階の名前が「天守 … 最上階」の形でなければ TOP にも足す */
(function(){
  var KEY = 'oshiroSanpo.goshuin';
  var CASTLES = {
    '32miya-osaka-castle':                    ['osaka','大阪城'],
    '32miya-himeji-castle':                   ['himeji','姫路城'],
    'matsumoto-castle':                       ['matsumoto','松本城'],
    '32miya-32miya-hikone-castle':            ['hikone','彦根城'],
    '32miya-inuyama-castle':                  ['inuyama','犬山城'],
    '32miya-kumamoto-castle':                 ['kumamoto','熊本城'],
    '32miya-matsuyama-castle':                ['matsuyama','松山城'],
    '32miya-32miya-azuchi-castle':            ['azuchi','安土城'],
    '32miya-32miya-bitchu-matsuyama-castle-': ['bitchu','備中松山城']
  };
  /* 最上階の名前。ふつうは「（大）天守／天主／天守閣 … 最上階 または 展望台」。小天守・櫓の最上階は含めない */
  var DEF = /^大?天[守主]閣?\s.*(最上階|展望台)/;
  var TOP = {
    inuyama: /^(4階（高欄の間）|廻縁（4階)/,
    bitchu:  /^天守 2階/
  };
  var seg = (location.pathname.split('/').filter(Boolean)[0] || '');
  var C = CASTLES[seg]; if(!C) return;
  var id = C[0], name = C[1], re = TOP[id] || DEF;

  function list(){ try{ var a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; }catch(e){ return []; } }
  function add(){ try{ var a = list(); if(a.indexOf(id) < 0){ a.push(id); localStorage.setItem(KEY, JSON.stringify(a)); } return true; }catch(e){ return false; } }

  /* 御城印を押す演出（画面中央に朱の印。2.8秒で消える。操作の邪魔をしない） */
  function show(){
    if(!document.getElementById('gsStyle')){
      var st = document.createElement('style'); st.id = 'gsStyle';
      st.textContent =
        '#gsPop{position:fixed;inset:0;display:grid;place-items:center;pointer-events:none;z-index:9999}' +
        '#gsPop .in{display:flex;flex-direction:column;align-items:center;gap:12px;padding:22px 24px 18px;box-sizing:border-box;max-width:calc(100vw - 40px);border-radius:18px;background:rgba(17,16,14,.78);' +
        'box-shadow:0 10px 40px rgba(0,0,0,.45);animation:gsFade 2.9s ease forwards}' +
        '#gsPop .seal{width:132px;height:132px;border:5px solid #c8372d;border-radius:50%;color:#c8372d;background:rgba(246,238,222,.96);display:grid;place-items:center;text-align:center;' +
        'font-family:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif;font-weight:700;font-size:15px;line-height:1.25;letter-spacing:.08em;transform:rotate(-8deg);animation:gsStamp .5s cubic-bezier(.2,1.6,.4,1) both}' +
        '#gsPop .seal b{display:block;font-size:30px;letter-spacing:.04em;margin:2px 0}' +
        '#gsPop .t{color:#f3ead8;font:600 15px/1.5 "Hiragino Sans","Noto Sans JP",sans-serif;letter-spacing:.06em;text-align:center}' +
        '#gsPop .t small{display:block;font-size:12px;opacity:.8;font-weight:400}' +
        '@keyframes gsStamp{0%{transform:scale(2.4) rotate(-20deg);opacity:0}60%{opacity:1}100%{transform:scale(1) rotate(-8deg);opacity:1}}' +
        '@keyframes gsFade{0%,80%{opacity:1}100%{opacity:0}}';
      document.head.appendChild(st);
    }
    var old = document.getElementById('gsPop'); if(old) old.remove();
    var d = document.createElement('div'); d.id = 'gsPop';
    var short = name.replace(/城$/, '');
    d.innerHTML = '<div class="in"><div class="seal"><div>登城<b>' + short + '</b>御城印</div></div>' +
      '<div class="t">天守の最上階に登城しました<small>' + name + 'の御城印をいただきました（お城選びの御城印帳に記録）</small></div></div>';
    document.body.appendChild(d);
    setTimeout(function(){ if(d.parentNode) d.remove(); }, 3000);
  }

  var done = list().indexOf(id) >= 0;
  function check(t){ if(done || !t) return; if(re.test(t.trim())){ done = true; if(add()) show(); } }
  function start(){
    var el = document.getElementById('area');
    if(!el){ setTimeout(start, 1000); return; }
    check(el.textContent);
    new MutationObserver(function(){ check(el.textContent); }).observe(el, {childList:true, characterData:true, subtree:true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.OshiroGoshuin = { id: id, has: function(){ return list().indexOf(id) >= 0; } };
})();
