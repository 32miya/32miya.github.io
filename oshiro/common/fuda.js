/* お城さんぽシリーズ共通: 見どころ札集め と 写真モード
   ・見どころ札: 各城の「名所」に“歩いて”着くと、その名所の札がもらえる。名所一覧のワープや建物の出入りで着いたときは、
     その場で15m以上歩くまではもらえない。札は時代ごとの名所も含めて城ごとに集める（現代・江戸などを切り替えると増える）。
   ・写真モード: 画面の文字やボタンを消して景色だけを撮り、城名とURLの透かしを入れて保存・共有する。
   ・各城の index.html の oshiro-portal ブロックで、goshuin.js の後に <script src="/oshiro/common/fuda.js"></script> を読む。
     城のコード側には、名所と自分の位置を知らせる窓口 window.OshiroGame（2行）が必要（../common/README.md）。
     撮影には /oshiro/common/perf.js の OshiroPerf.capture を使う。
   ・記録は localStorage "oshiroSanpo.fuda" = { 城id: { got:[名所id…], total:数 } }（入口の札の数の表示にも使う） */
(function(){
  'use strict';
  var KEY = 'oshiroSanpo.fuda';
  var NAMES = { osaka:'大阪城', himeji:'姫路城', matsumoto:'松本城', hikone:'彦根城', inuyama:'犬山城', kumamoto:'熊本城',
                aizu:'鶴ヶ城', matsuyama:'松山城', azuchi:'安土城', bitchu:'備中松山城' };
  var WALK_UNLOCK = 15;   /* ワープ・出入りのあと、札をもらうのに歩く距離（m） */
  var JUMP = 8;           /* 0.3秒でこれ以上動いたらワープ・出入りとみなす（m） */

  function G(){ return window.OshiroGame; }
  function cid(){ return (window.OshiroGoshuin && OshiroGoshuin.id) || ''; }
  function load(){ try{ var o = JSON.parse(localStorage.getItem(KEY) || '{}'); return (o && typeof o === 'object') ? o : {}; }catch(e){ return {}; } }
  function save(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} }
  function rec(){ var o = load(), id = cid(); if(!o[id]) o[id] = {got:[], total:0}; return {o:o, r:o[id]}; }
  function allSpots(){ var g = G(); try{ return (g && g.all()) || []; }catch(e){ return []; } }
  function total(){ var seen = {}, n = 0; allSpots().forEach(function(s){ if(s && s.id && !seen[s.id]){ seen[s.id] = 1; n++; } }); return n; }
  function nameOf(id){
    var g = G(), cur = [];
    try{ cur = g.spots() || []; }catch(e){}
    for(var i = 0; i < cur.length; i++) if(cur[i].id === id) return cur[i].name;
    var a = allSpots(); for(var j = 0; j < a.length; j++) if(a[j].id === id) return a[j].name;
    return id;
  }

  /* ---------- 見た目（城の画面に重ねる） ---------- */
  var css = ''+
  '#fdPop{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 70px);transform:translateX(-50%);z-index:9997;pointer-events:none;display:flex;align-items:center;gap:12px;'+
    'padding:10px 16px 10px 10px;border-radius:14px;background:rgba(17,16,14,.86);color:#f3ead8;box-shadow:0 8px 30px rgba(0,0,0,.45);animation:fdIn .45s cubic-bezier(.2,1.5,.4,1) both, fdOut .5s ease 3.2s forwards;max-width:calc(100vw - 32px)}'+
  '#fdPop .ita{flex:none;width:44px;height:64px;border-radius:5px;background:linear-gradient(160deg,#c89a5c,#9a6a35);border:2px solid #5a3a1a;box-shadow:inset 0 0 0 2px rgba(255,236,200,.25);'+
    'writing-mode:vertical-rl;display:flex;align-items:center;justify-content:center;font:900 13px/1.1 "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif;color:#3a2410;letter-spacing:.1em;overflow:hidden}'+
  '#fdPop .t small{white-space:nowrap}#fdPop .t{font:600 13px/1.45 "Hiragino Sans","Noto Sans JP",sans-serif}#fdPop .t b{display:block;font-size:16px;font-family:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif}#fdPop .t small{opacity:.78}'+
  '@keyframes fdIn{0%{opacity:0;transform:translate(-50%,-14px) scale(.9)}100%{opacity:1;transform:translate(-50%,0) scale(1)}}@keyframes fdOut{to{opacity:0}}'+
  '#fdSheet{position:fixed;inset:0;z-index:9996;background:rgba(10,9,8,.55);display:flex;align-items:flex-end;justify-content:center}'+
  '#fdSheet .bx{width:min(560px,100%);max-height:82vh;overflow:auto;background:#1b1813;color:#f3ead8;border-radius:18px 18px 0 0;padding:16px 16px calc(env(safe-area-inset-bottom,0px) + 18px);box-shadow:0 -8px 30px rgba(0,0,0,.5)}'+
  '@media (min-width:760px){#fdSheet{align-items:center}#fdSheet .bx{border-radius:18px}}'+
  '#fdSheet h3{font:900 19px/1.3 "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif;display:flex;align-items:baseline;gap:10px}#fdSheet h3 span{font:700 13px "Hiragino Sans","Noto Sans JP",sans-serif;color:#e0b25a}'+
  '#fdSheet .x{float:right;width:34px;height:34px;border-radius:50%;border:0;background:#2c2620;color:#f3ead8;font-size:18px;cursor:pointer}'+
  '#fdSheet .bar{height:8px;border-radius:4px;background:#2c2620;margin:10px 0 6px;overflow:hidden}#fdSheet .bar i{display:block;height:100%;background:linear-gradient(90deg,#c8372d,#e0b25a)}'+
  '#fdSheet .note{font:12px/1.6 "Hiragino Sans","Noto Sans JP",sans-serif;color:#cfc2a6;margin-bottom:12px}'+
  '#fdSheet .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}'+
  '#fdSheet .f{position:relative;height:118px;border-radius:7px;padding:8px 6px;display:flex;align-items:center;justify-content:center;text-align:center;'+
    'font:800 12px/1.35 "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif;border:2px solid #3a3025;background:#24201a;color:#6f6656}'+
  '#fdSheet .f.on{background:linear-gradient(160deg,#d3a868,#a37440);border-color:#5a3a1a;color:#2e1c0c;box-shadow:inset 0 0 0 2px rgba(255,236,200,.28)}'+
  '#fdSheet .f.on:after{content:"済";position:absolute;right:5px;bottom:5px;width:22px;height:22px;border-radius:50%;border:2px solid #c8372d;color:#c8372d;font:900 11px/18px serif;background:rgba(246,238,222,.85)}'+
  '#fdSheet .f.cur{outline:2px dashed #e0b25a;outline-offset:2px}'+
  '#fdSheet .done{margin:4px 0 12px;padding:10px 12px;border-radius:10px;background:rgba(200,55,45,.18);border:1px solid #c8372d;font:700 13px/1.5 "Hiragino Sans","Noto Sans JP",sans-serif}'+
  /* 写真モード */
  'body.oshiro-photo *{visibility:hidden!important}body.oshiro-photo canvas.oshiro-gl,body.oshiro-photo #phUI,body.oshiro-photo #phUI *,body.oshiro-photo #phView,body.oshiro-photo #phView *{visibility:visible!important}'+
  '#phUI{position:fixed;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);z-index:9998;display:flex;justify-content:center;align-items:center;gap:28px;pointer-events:none}'+
  '#phUI button{pointer-events:auto;border:0;cursor:pointer}'+
  '#phShot{width:72px;height:72px;border-radius:50%;background:#f3ead8;box-shadow:0 0 0 5px rgba(243,234,216,.4),0 6px 20px rgba(0,0,0,.4)}#phShot:active{transform:scale(.94)}'+
  '#phUI .s{width:48px;height:48px;border-radius:50%;background:rgba(17,16,14,.7);color:#f3ead8;font:700 12px "Hiragino Sans","Noto Sans JP",sans-serif}'+
  '#phTip{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 16px);transform:translateX(-50%);z-index:9998;background:rgba(17,16,14,.7);color:#f3ead8;padding:6px 14px;border-radius:999px;font:500 12px "Hiragino Sans","Noto Sans JP",sans-serif;pointer-events:none;transition:opacity .8s}'+
  '#phView{position:fixed;inset:0;z-index:9999;background:rgba(10,9,8,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:16px}'+
  '#phView img{max-width:100%;max-height:70vh;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.6)}'+
  '#phView .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}'+
  '#phView .row button,#phView .row a{height:42px;padding:0 18px;border-radius:999px;border:1px solid #5a4a35;background:#2c2620;color:#f3ead8;font:700 14px "Hiragino Sans","Noto Sans JP",sans-serif;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}'+
  '#phView .row .main{background:#c8372d;border-color:#c8372d}'+
  '#phView small{color:#cfc2a6;font:12px/1.5 "Hiragino Sans","Noto Sans JP",sans-serif;text-align:center}';
  function addCss(){ if(document.getElementById('fdStyle')) return; var st = document.createElement('style'); st.id = 'fdStyle'; st.textContent = css; document.head.appendChild(st); }
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function closeMenu(){ var m = document.getElementById('menu'), b = document.getElementById('menuBtn'); if(m && !m.hidden){ if(b) b.click(); if(!m.hidden) m.hidden = true; } }

  /* ---------- 見どころ札 ---------- */
  function updBtn(){ var v = document.getElementById('vFuda'); if(!v) return; var R = rec().r; v.textContent = R.got.length + '/' + (total() || R.total || '?'); }
  function pop(name, n, t){
    var old = document.getElementById('fdPop'); if(old) old.remove();
    var d = document.createElement('div'); d.id = 'fdPop';
    var short = name.replace(/（.*?）/g, '').slice(0, 8);
    d.innerHTML = '<div class="ita">' + esc(short) + '</div><div class="t"><small>見どころ札をいただきました</small><b>' + esc(name) + '</b><small>' + (NAMES[cid()] || '') + '　' + n + ' / ' + t + (n >= t ? '　すべて集めました！' : '') + '</small></div>';
    document.body.appendChild(d); setTimeout(function(){ if(d.parentNode) d.remove(); }, 3900);
  }
  function collect(s){
    var x = rec(); if(x.r.got.indexOf(s.id) >= 0) return;
    x.r.got.push(s.id); x.r.total = total(); save(x.o);
    pop(s.name, x.r.got.length, x.r.total); updBtn();
  }
  function openSheet(){
    closeMenu(); addCss();
    var old = document.getElementById('fdSheet'); if(old) old.remove();
    var R = rec().r, all = allSpots(), seen = {}, list = [], cur = {};
    try{ (G().spots() || []).forEach(function(s){ cur[s.id] = 1; }); }catch(e){}
    all.forEach(function(s){ if(s && s.id && !seen[s.id]){ seen[s.id] = 1; list.push(s); } });
    var t = list.length, n = list.filter(function(s){ return R.got.indexOf(s.id) >= 0; }).length;
    var d = document.createElement('div'); d.id = 'fdSheet';
    var h = '<div class="bx"><button class="x" aria-label="閉じる">×</button><h3>見どころ札<span>' + esc(NAMES[cid()] || '') + '　' + n + ' / ' + t + '</span></h3>' +
      '<div class="bar"><i style="width:' + (t ? Math.round(n / t * 100) : 0) + '%"></i></div>' +
      (n >= t && t ? '<div class="done">' + esc(NAMES[cid()] || 'この城') + 'の見どころ札をすべて集めました。お見事です！</div>' : '') +
      '<div class="note">名所に<b>歩いて</b>着くと札がもらえます。名所一覧のワープで着いたときは、まわりを少し歩くともらえます。点線の札は、いまの時代で行ける名所です（時代を切り替えると行ける名所が変わります）。</div><div class="g">';
    list.forEach(function(s){ var on = R.got.indexOf(s.id) >= 0; h += '<div class="f' + (on ? ' on' : '') + (!on && cur[s.id] ? ' cur' : '') + '">' + esc(nameOf(s.id)) + '</div>'; });
    d.innerHTML = h + '</div></div>';
    d.addEventListener('click', function(e){ if(e.target === d || e.target.classList.contains('x')) d.remove(); });
    document.body.appendChild(d);
  }

  /* 歩いて着いたかを見張る（0.3秒ごと） */
  var last = null, walked = 0, blocked = {}, warpSeen = 0;
  function near(s, me){
    var lv = (s.level === undefined || s.level === null) ? -1 : s.level;
    if(me.room || me.level !== lv) return false;
    var p = s.pos || s.at, a = s.at || s.pos, inside = lv >= 0;
    var dp = p ? Math.hypot(me.x - p[0], me.z - p[1]) : 1e9, da = a ? Math.hypot(me.x - a[0], me.z - a[1]) : 1e9;
    return inside ? (dp < 6 || da < 8) : (dp < 9 || da < 14);
  }
  var ticks = 0;
  function tick(){
    ticks++;
    var g = G(); if(!g || !cid()) return;
    var started = true; try{ started = g.started(); }catch(e){}
    if(!started || document.hidden || document.body.classList.contains('oshiro-photo')){ last = null; return; }
    var me; try{ me = g.me(); }catch(e){ return; }
    if(!me || !me.walk || me.tour){ last = null; return; }
    var spots; try{ spots = g.spots() || []; }catch(e){ return; }
    var jumped = !last || (g.warpAt || 0) !== warpSeen || Math.hypot(me.x - last.x, me.z - last.z) > JUMP || me.level !== last.level || me.room !== last.room;
    if(jumped){
      /* ワープ・出入り・開始直後: 着いた場所のまわりの名所は、少し歩くまで札にしない */
      warpSeen = g.warpAt || 0; walked = 0; blocked = {};
      spots.forEach(function(s){ if(near(s, me)) blocked[s.id] = 1; });
    } else walked += Math.hypot(me.x - last.x, me.z - last.z);
    last = {x:me.x, z:me.z, level:me.level, room:me.room};
    if(walked >= WALK_UNLOCK) blocked = {};
    var got = rec().r.got;
    for(var i = 0; i < spots.length; i++){ var s = spots[i]; if(!s || !s.id || got.indexOf(s.id) >= 0 || blocked[s.id]) continue; if(near(s, me)){ collect(s); break; } }
  }

  /* ---------- 写真モード ---------- */
  var tipT = 0;
  function photoOn(){
    closeMenu(); addCss();
    document.body.classList.add('oshiro-photo');
    var ui = document.createElement('div'); ui.id = 'phUI';
    ui.innerHTML = '<button class="s" id="phX">戻る</button><button id="phShot" aria-label="撮影"></button><button class="s" id="phHide">隠す</button>';
    document.body.appendChild(ui);
    var tip = document.createElement('div'); tip.id = 'phTip'; tip.textContent = '構図を決めて、まるいボタンで撮影'; document.body.appendChild(tip);
    clearTimeout(tipT); tipT = setTimeout(function(){ tip.style.opacity = '0'; }, 2500);
    document.getElementById('phX').onclick = photoOff;
    document.getElementById('phShot').onclick = shoot;
    /* 「隠す」: ボタンも消して画面だけに。どこかを押すと戻る */
    document.getElementById('phHide').onclick = function(e){ e.stopPropagation(); ui.style.display = 'none'; tip.style.opacity = '0';
      setTimeout(function(){ var back = function(){ ui.style.display = ''; removeEventListener('pointerdown', back, true); }; addEventListener('pointerdown', back, true); }, 300); };
  }
  function photoOff(){
    document.body.classList.remove('oshiro-photo');
    ['phUI','phTip','phView'].forEach(function(id){ var e = document.getElementById(id); if(e) e.remove(); });
  }
  function areaText(){ var a = document.getElementById('area'); return a ? a.textContent.trim() : ''; }
  function shoot(){
    var P = window.OshiroPerf;
    var done = function(url){ if(!url){ alert('この端末では撮影できませんでした'); return; } finish(url); };
    if(P && P.capture) P.capture(done);
    else { var c = document.querySelector('canvas.oshiro-gl') || document.querySelector('canvas'); try{ done(c.toDataURL('image/jpeg', .92)); }catch(e){ done(null); } }
  }
  function finish(url){
    var img = new Image();
    img.onload = function(){
      var W = img.width, H = img.height, c = document.createElement('canvas'); c.width = W; c.height = H;
      var x = c.getContext('2d'); x.drawImage(img, 0, 0);
      /* 透かし: 城名・場所・URL（右下） */
      var s = Math.max(1, Math.min(W, H) / 720), pad = 18 * s;
      var t1 = (NAMES[cid()] || 'お城') + 'さんぽ', t2 = areaText(), t3 = '32miya.github.io/oshiro/';
      x.font = '700 ' + (26 * s) + 'px "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif';
      var w1 = x.measureText(t1).width; x.font = '500 ' + (15 * s) + 'px "Hiragino Sans","Noto Sans JP",sans-serif';
      var w2 = Math.max(x.measureText(t2).width, x.measureText(t3).width), bw = Math.max(w1, w2) + pad * 1.6, bh = (t2 ? 82 : 62) * s;
      var gx = W - bw - pad, gy = H - bh - pad;
      x.fillStyle = 'rgba(17,16,14,.55)'; roundRect(x, gx, gy, bw, bh, 10 * s); x.fill();
      x.fillStyle = '#c8372d'; x.fillRect(gx, gy + 10 * s, 4 * s, bh - 20 * s);
      x.fillStyle = '#f3ead8'; x.textBaseline = 'top';
      x.font = '700 ' + (26 * s) + 'px "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif'; x.fillText(t1, gx + pad * .8, gy + 10 * s);
      x.font = '500 ' + (15 * s) + 'px "Hiragino Sans","Noto Sans JP",sans-serif'; x.globalAlpha = .9;
      if(t2) x.fillText(t2, gx + pad * .8, gy + 42 * s);
      x.fillText(t3, gx + pad * .8, gy + (t2 ? 61 : 42) * s); x.globalAlpha = 1;
      c.toBlob(function(b){ show(b, c.toDataURL('image/jpeg', .9)); }, 'image/jpeg', .92);
    };
    img.src = url;
  }
  function roundRect(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function show(blob, dataUrl){
    var v = document.createElement('div'); v.id = 'phView';
    var fn = (NAMES[cid()] || 'oshiro') + '_' + new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '') + '.jpg';
    var url = blob ? URL.createObjectURL(blob) : dataUrl;
    var canShare = false; try{ canShare = !!(blob && navigator.canShare && navigator.canShare({files:[new File([blob], fn, {type:'image/jpeg'})]})); }catch(e){}
    v.innerHTML = '<img alt="撮った写真"><div class="row">' + (canShare ? '<button class="main" id="phShare">共有・保存</button>' : '') +
      '<a id="phSave" download="' + fn + '"' + (canShare ? '' : ' class="main"') + '>画像を保存</a><button id="phAgain">もう1枚</button><button id="phEnd">おわる</button></div>' +
      '<small>保存できないときは、画像を長押しして「写真に追加」してください</small>';
    v.querySelector('img').src = url; v.querySelector('#phSave').href = url;
    document.body.appendChild(v);
    if(canShare) document.getElementById('phShare').onclick = function(){ navigator.share({files:[new File([blob], fn, {type:'image/jpeg'})], title:(NAMES[cid()] || '') + 'さんぽ', text:'お城さんぽ https://32miya.github.io/oshiro/'}).catch(function(){}); };
    document.getElementById('phAgain').onclick = function(){ v.remove(); };
    document.getElementById('phEnd').onclick = photoOff;
  }

  /* ---------- メニューにボタンを足す ---------- */
  function addButtons(){
    var tools = document.querySelector('#menu .tools'); if(!tools || document.getElementById('tFuda')) return !!tools;
    addCss();
    var b1 = document.createElement('button'); b1.className = 'tool'; b1.id = 'tFuda'; b1.setAttribute('aria-label', '見どころ札を見る');
    b1.innerHTML = '<small>札帳</small><b id="vFuda">0</b>'; b1.onclick = openSheet;
    var b2 = document.createElement('button'); b2.className = 'tool'; b2.id = 'tPhoto'; b2.setAttribute('aria-label', '写真を撮る');
    b2.innerHTML = '<small>写真</small><b>撮る</b>'; b2.onclick = photoOn;
    tools.appendChild(b1); tools.appendChild(b2);
    updBtn(); return true;
  }
  function start(){
    var tries = 0;
    (function wait(){ if(addButtons() && G() && cid()){ setInterval(tick, 300); return; } if(++tries < 60) setTimeout(wait, 500); })();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.OshiroFuda = { open:openSheet, photo:photoOn, state:function(){ return rec().r; }, debug:function(){ return {walked:walked, blocked:Object.keys(blocked), last:last, ticks:ticks}; }, tick:tick };
})();
