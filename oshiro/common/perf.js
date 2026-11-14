/* お城さんぽシリーズ共通: 軽量化（スマホの発熱・フリーズ対策）
   各城の index.html で three.js の直後、城のコードより前に読む:
     <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
     <script src="/oshiro/common/perf.js"></script>
   城のコードは変えずに、three.js の描画の入口に割り込んで次の4つを行う（読み込めないときは何もしない＝今まで通り）。
   ① 影: 毎フレームの描き直しをやめ、動いている間は2フレームに1回、止まっている間は3フレームに1回（毎秒約7回）。
         太陽の向きが変わったとき・遠くへ移動したときはすぐ描き直す。スマホは影のぼかしを軽い方式（PCF）にする。
   ③ 止まっているとき: 操作もカメラの動きもない状態が1.5秒続いたら、描く回数を毎秒20回に落とす。触ればすぐ元に戻る。
   ④ 解像度: スマホは画素密度の上限を1.25倍にする（城の「画質 高」の1.6倍から）。
   ⑤ 自動調整: 動かしている間の速さを測り、カクつき（毎秒27回未満、または引っかかり）が続いたら一段ずつ軽くする
         （解像度1.0倍 → 城の「画質」を「軽」に → 解像度0.8倍）。自分で画質ボタンを押したら、画質の切り替えはしない。
   写真モード（fuda.js）のために、描いた直後の画面を写す OshiroPerf.capture(cb) も持つ。
   確認用: URL に ?perf=off で無効、?perf=hud で左下に状態を表示。window.OshiroPerf で状態を見られる。 */
(function(){
  'use strict';
  var T = window.THREE; if(!T || !T.WebGLRenderer) return;
  var q = ''; try{ q = new URLSearchParams(location.search).get('perf') || ''; }catch(e){}
  if(q === 'off') return;

  var touch = false;
  try{ touch = matchMedia('(hover:none) and (pointer:coarse)').matches || ('ontouchstart' in window && navigator.maxTouchPoints > 0); }catch(e){}

  var S = { level:0, fps:0, idle:false, touch:touch, prCap: touch ? 1.25 : 99, shadowRenders:0, frames:0, autoQual:false, userQual:false };
  window.OshiroPerf = S;
  var now = function(){ return performance.now(); };

  /* ---------- ③ 止まっているときは毎秒20回に ---------- */
  var lastInput = now(), lastMove = now(), IDLE_MS = 1500, IDLE_DT = 50;
  ['pointerdown','pointermove','touchstart','touchmove','keydown','wheel'].forEach(function(ev){
    addEventListener(ev, function(){ lastInput = now(); }, {passive:true, capture:true});
  });
  function isIdle(t){ return (t - lastInput > IDLE_MS) && (t - lastMove > IDLE_MS); }

  var raf0 = window.requestAnimationFrame.bind(window);
  var lastFrameT = 0, curT = -1, fpsAcc = 0, fpsN = 0, fpsSince = now(), lastStep = now();
  function onFrame(t){
    if(t !== curT){
      var dt = t - curT; curT = t; S.frames++;
      var idle = isIdle(t); S.idle = idle;
      /* ⑤ 動かしている間だけ速さを測る（止まっている間は毎秒20回にしているので測らない） */
      if(!idle && dt > 0 && dt < 1500 && !document.hidden){ fpsAcc += Math.min(dt, 500); fpsN++; if(dt > 120) S.longFrames = (S.longFrames || 0) + 1; }
      else { fpsAcc = 0; fpsN = 0; fpsSince = t; S.longFrames = 0; }
      if(t - fpsSince > 3000 && fpsN > 20){
        var fps = 1000 / (fpsAcc / fpsN); S.fps = Math.round(fps);
        /* 毎秒27回を下回る、または0.12秒以上止まるコマが3回以上（省電力モードの毎秒30回は下げない） */
        if((fps < 27 || (S.longFrames || 0) >= 3) && t - lastStep > 4000) stepDown();
        fpsAcc = 0; fpsN = 0; fpsSince = t; S.longFrames = 0;
      }
      lastFrameT = t;
    }
  }
  window.requestAnimationFrame = function(cb){
    var wrap = function(t){ onFrame(t); cb(t); };
    var n = now();
    if(isIdle(n) && !document.hidden){
      var wait = lastFrameT + IDLE_DT - n;
      if(wait > 4){ var id = {}; id.t = setTimeout(function(){ id.r = raf0(wrap); }, wait); return pend(id); }
    }
    return raf0(wrap);
  };
  /* 止まっているときの予約も cancelAnimationFrame で取り消せるように */
  var pending = {}, pid = 1e9;
  function pend(o){ var k = ++pid; pending[k] = o; setTimeout(function(){ delete pending[k]; }, 2000); return k; }
  var caf0 = window.cancelAnimationFrame.bind(window);
  window.cancelAnimationFrame = function(id){ var o = pending[id]; if(o){ clearTimeout(o.t); if(o.r) caf0(o.r); delete pending[id]; } else caf0(id); };

  /* ---------- 描画の入口に割り込む ---------- */
  var R0 = T.WebGLRenderer;
  var renderers = [];
  function Wrapped(params){
    var r = new R0(params);
    setup(r); renderers.push(r);
    return r;
  }
  Wrapped.prototype = R0.prototype;
  T.WebGLRenderer = Wrapped;

  var capQ = [];
  /* 写真モード（fuda.js）用: 次に画面へ描いた直後の絵を JPEG で渡す。描いた直後に読むので preserveDrawingBuffer は要らない */
  S.capture = function(cb){ capQ.push(cb); lastInput = now(); };
  function setup(r){
    try{ r.domElement.classList.add('oshiro-gl'); }catch(e){}
    /* ④ 解像度の上限 */
    var setPR0 = r.setPixelRatio.bind(r);
    r.__wantPR = r.getPixelRatio();
    r.setPixelRatio = function(v){ r.__wantPR = v; setPR0(Math.min(v, S.prCap)); };
    r.setPixelRatio(r.__wantPR);

    /* ① スマホは影のぼかしを軽い方式に（見た目はほぼ同じ） */
    var sm = r.shadowMap, stype = sm.type;
    try{
      Object.defineProperty(sm, 'type', { configurable:true,
        get: function(){ return stype; },
        set: function(v){ stype = (touch && v === T.PCFSoftShadowMap) ? T.PCFShadowMap : v; } });
    }catch(e){}

    /* ① 影の描き直しを間引く */
    var render0 = r.render.bind(r);
    var shFrame = -1, shAge = 99, shManaged = false;
    var lights = null, lightsScene = null, lightsAt = 0;
    var lastDir = new T.Vector3(), lastPos = new T.Vector3(1e9,0,0), tmp = new T.Vector3(), tmp2 = new T.Vector3();
    var camPrev = new WeakMap();
    function shadowLights(scene){
      if(lightsScene !== scene || S.frames - lightsAt > 300){
        lights = []; lightsScene = scene; lightsAt = S.frames;
        scene.traverse(function(o){ if(o.isDirectionalLight && o.castShadow) lights.push(o); });
      }
      return lights;
    }
    r.render = function(scene, camera){
      /* カメラが動いたか（③の「止まっている」判定に使う） */
      if(camera && camera.isPerspectiveCamera){
        camera.updateMatrixWorld();
        var e = camera.matrixWorld.elements, p = camPrev.get(camera);
        if(!p){ p = new Float32Array(16); camPrev.set(camera, p); p[0] = 1e9; }
        var d = 0; for(var i = 0; i < 16; i++){ d += Math.abs(e[i] - p[i]); p[i] = e[i]; }
        if(d > 0.004) lastMove = now();
      }
      if(sm.enabled && scene && scene.isScene && shFrame !== curT){
        var wants = sm.autoUpdate || sm.needsUpdate || shManaged;
        if(sm.autoUpdate){ sm.autoUpdate = false; shManaged = true; }
        if(wants){
          shFrame = curT; shAge++;
          var force = shAge > 99, L = shadowLights(scene), l = L[0];
          if(l){
            l.updateMatrixWorld(); l.target.updateMatrixWorld();
            tmp.setFromMatrixPosition(l.matrixWorld); tmp2.setFromMatrixPosition(l.target.matrixWorld);
            tmp.sub(tmp2).normalize();
            if(tmp.distanceTo(lastDir) > 0.002) force = true;   /* 時刻を変えた（太陽の向きが変わった） */
            if(tmp2.distanceTo(lastPos) > 6) force = true;      /* 遠くへ移動した（名所へ移動・天守へ入るなど） */
          }
          /* 動いている間は2フレームに1回（重いときは3回に1回）。止まっている間（毎秒20回）は3フレームに1回 */
          var every = !isIdle(now()) ? (S.level >= 2 ? 3 : 2) : 3;
          var upd = force || shAge >= every;
          sm.needsUpdate = upd;
          if(upd){ shAge = 0; S.shadowRenders++; if(l){ lastDir.copy(tmp); lastPos.copy(tmp2); } }
        }
      }
      var out = render0(scene, camera);
      if(capQ.length && r.getRenderTarget() === null){ var url = null; try{ url = r.domElement.toDataURL('image/jpeg', .95); }catch(e){} capQ.splice(0).forEach(function(f){ try{ f(url); }catch(e){} }); }
      return out;
    };
  }

  /* ---------- ⑤ 一段ずつ軽くする ---------- */
  function applyPR(){
    renderers.forEach(function(r){ r.setPixelRatio(r.__wantPR); });
    try{ dispatchEvent(new Event('resize')); }catch(e){}
  }
  function qualBtn(){ return document.getElementById('tQual'); }
  function qualIsHigh(){ var v = document.getElementById('vQual'); return v && v.textContent.trim() === '高'; }
  document.addEventListener('click', function(e){ var b = qualBtn(); if(b && e.isTrusted && b.contains(e.target)) S.userQual = true; }, true);
  var toasted = false;
  function toast(msg){
    if(toasted) return; toasted = true;
    var d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = 'position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:9998;background:rgba(17,16,14,.82);color:#f3ead8;padding:8px 14px;border-radius:999px;font:500 12px/1.4 "Hiragino Sans","Noto Sans JP",sans-serif;pointer-events:none;transition:opacity .6s';
    document.body.appendChild(d);
    setTimeout(function(){ d.style.opacity = '0'; }, 3200); setTimeout(function(){ d.remove(); }, 4000);
  }
  function stepDown(){
    lastStep = now();
    if(S.level === 0){ S.level = 1; S.prCap = Math.min(S.prCap, 1.0); applyPR(); }
    else if(S.level === 1){
      S.level = 2;
      if(!S.userQual && qualIsHigh() && qualBtn()){ S.autoQual = true; qualBtn().click(); }
    }
    else if(S.level === 2){ S.level = 3; S.prCap = Math.min(S.prCap, 0.8); applyPR(); }
    else return;
    toast('動きが重いため、画質を自動で軽くしました');
  }

  /* ---------- 確認用の表示（?perf=hud） ---------- */
  if(q === 'hud'){
    addEventListener('load', function(){
      var h = document.createElement('div');
      h.style.cssText = 'position:fixed;left:6px;bottom:6px;z-index:9999;background:rgba(0,0,0,.6);color:#9f9;font:11px/1.3 monospace;padding:4px 6px;border-radius:4px;pointer-events:none;white-space:pre';
      document.body.appendChild(h);
      var sh0 = 0, f0 = 0;
      setInterval(function(){
        var r = renderers[0];
        h.textContent = 'fps ' + S.fps + '  lv ' + S.level + (S.idle ? '  idle' : '') + '\npr ' + (r ? r.getPixelRatio().toFixed(2) : '-') +
          '  影 ' + (S.shadowRenders - sh0) + '/' + (S.frames - f0) + 'fr';
        sh0 = S.shadowRenders; f0 = S.frames;
      }, 1000);
    });
  }
})();
