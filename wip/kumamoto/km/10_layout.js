/* ---------- world layout（熊本城） ----------
   x: 東が＋, z: 南が＋（北が −z）。距離は実際よりおよそ0.55倍に縮めています。
   茶臼山の台地の上に、本丸（天守・本丸御殿）を中心として、平左衛門丸・数寄屋丸・飯田丸・東竹之丸・竹の丸・西出丸・二の丸が
   高い石垣で段々に重なります。南と東のふもとを坪井川が流れ、その北岸に長塀がのびます。 */
const WATER_Y=-1.8, DRY_Y=-1;
const inR=(r,x,z,m)=>x>r.x0-m&&x<r.x1+m&&z>r.z0-m&&z<r.z1+m;
const sstep=t=>{ t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); };
function segD(px,pz,a,b){ const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((px-a[0])*dx+(pz-a[1])*dz)/(dx*dx+dz*dz))); return Math.hypot(px-a[0]-dx*t,pz-a[1]-dz*t); }
const rDist=(r,x,z)=>Math.hypot(Math.max(r.x0-x,0,x-r.x1),Math.max(r.z0-z,0,z-r.z1));
/* 台地（城域）の範囲 */
const INR={x0:-352,x1:132,z0:-160,z1:110};
/* 坪井川（南と東のふもと）。MOAT は南の流れ、RIV_E は東の流れ */
const MOAT={x0:-440,x1:150,z0:114,z1:128};
const RIV_E={x0:136,x1:150,z0:-260,z1:128};
/* 備前堀（いま熊本城に残るただ一つの水堀）: 二の丸の東、西出丸の北 */
const BIZEN={x0:-168,x1:-118,z0:-128,z1:-112};
const TOWN={x0:-420,x1:300,z0:130,z1:330};
/* 曲輪（平らな段）。wall: 石垣の高さ（下の斜面との差） */
const PLAT=[
  {id:'honmaru',x0:-40,x1:50,z0:-50,z1:18,H:30,wall:13,name:'本丸'},
  {id:'heiza',x0:-80,x1:-40,z0:-50,z1:-6,H:30,wall:13,name:'平左衛門丸'},
  {id:'kita',x0:-80,x1:50,z0:-96,z1:-50,H:25,wall:9,name:'本丸の北（加藤神社）'},
  {id:'sukiya',x0:-80,x1:-40,z0:-6,z1:40,H:25,wall:10,name:'数寄屋丸'},
  {id:'iida',x0:-40,x1:24,z0:18,z1:58,H:22,wall:13,name:'飯田丸'},
  {id:'higashi',x0:50,x1:106,z0:-74,z1:58,H:20,wall:12,name:'東竹之丸'},
  {id:'take',x0:-40,x1:106,z0:58,z1:96,H:8,wall:8,name:'竹の丸'},
  {id:'nishide',x0:-150,x1:-92,z0:-74,z1:48,H:16,wall:9,name:'西出丸'},
  {id:'nino',x0:-340,x1:-172,z0:-110,z1:72,H:10,wall:7,name:'二の丸'}];
const MOUNDS=[];
function moundH(x,z){ return 0; }
const PL={}; PLAT.forEach(p=>PL[p.id]=p);
/* 石段・坂。a: 'x' か 'z' の向き、f→t でその座標、h0→h1 で高さ */
const RAMPS=[
  {id:'miyuki',x0:-128,x1:-120,z0:48,z1:112,a:'z',f:112,t:48,h0:0,h1:16,name:'行幸坂'},
  {id:'nishiyagura',x0:-92,x1:-80,z0:24,z1:32,a:'x',f:-92,t:-80,h0:16,h1:25,name:'西櫓御門への石段'},
  {id:'sukiyaN',x0:-66,x1:-58,z0:-16,z1:2,a:'z',f:2,t:-16,h0:25,h1:30,name:'数寄屋丸から本丸への石段'},
  {id:'kurai',x0:6,x1:12,z0:2,z1:40,a:'z',f:40,t:2,h0:22,h1:30,name:'闇り通路'},
  {id:'takeIida',x0:-14,x1:-6,z0:58,z1:84,a:'z',f:84,t:58,h0:8,h1:22,name:'竹の丸から飯田丸への石段'},
  {id:'takeHigashi',x0:72,x1:80,z0:58,z1:80,a:'z',f:80,t:58,h0:8,h1:20,name:'東竹之丸への石段'},
  {id:'hoate',x0:50,x1:68,z0:-12,z1:-4,a:'x',f:68,t:50,h0:20,h1:30,name:'頬当御門'},
  {id:'sudo',x0:40,x1:48,z0:96,z1:114,a:'z',f:114,t:96,h0:0,h1:8,name:'須戸口門'},
  {id:'kitaHon',x0:18,x1:26,z0:-60,z1:-46,a:'z',f:-60,t:-46,h0:25,h1:30,name:'本丸への石段（北）'},
  {id:'kitazaka',x0:-26,x1:-18,z0:-150,z1:-96,a:'z',f:-150,t:-96,h0:0,h1:25,name:'加藤神社への坂'},
  {id:'dobashi',x0:-172,x1:-150,z0:-14,z1:-6,a:'x',f:-172,t:-150,h0:10,h1:16,name:'西大手門の土橋'},
  {id:'ninoS',x0:-262,x1:-254,z0:72,z1:110,a:'z',f:110,t:72,h0:0,h1:10,name:'二の丸への坂'},
  {id:'ninoN',x0:-200,x1:-192,z0:-150,z1:-110,a:'z',f:-150,t:-110,h0:0,h1:10,name:'二の丸への坂（北）'}];
const HS=1;
const ENTR=[];
function rampH(r,x,z){ const c=r.a==='x'?x:z,u=Math.max(0,Math.min(1,(c-r.f)/(r.t-r.f))); return r.h0+(r.h1-r.h0)*u; }
/* 台地の自然の斜面（土手と林）: 曲輪の石垣の下から、およそ35°で下る */
function hillRaw(x,z){ let h=0; for(const p of PLAT){ const top=p.H-p.wall-.7*rDist(p,x,z); if(top>h) h=top; } return h; }
function hillH(x,z){ if(!inR(INR,x,z,0)) return 0; let h=hillRaw(x,z); if(h<=0) return 0; const e=Math.min(x-INR.x0,INR.x1-x,z-INR.z0,INR.z1-z); h*=sstep(e/14); if(h>.4) h+=(fbm(x*.05,z*.05,3)-.5)*Math.min(1.8,h*.3); return Math.max(0,h); }
function platAt(x,z){ for(const p of PLAT) if(x>=p.x0&&x<=p.x1&&z>=p.z0&&z<=p.z1) return p; return null; }
function platAtMesh(x,z){ for(const p of PLAT){ if(!(x>=p.x0&&x<=p.x1&&z>=p.z0&&z<=p.z1)) continue; const W=p.walls; if(W){ const e=.01; if((W[0]&&z<p.z0+e)||(W[1]&&x>p.x1-e)||(W[2]&&z>p.z1-e)||(W[3]&&x<p.x0+e)) continue; } return p; } return null; }
function rampAt(x,z){ for(const r of RAMPS) if(x>=r.x0&&x<=r.x1&&z>=r.z0&&z<=r.z1) return r; return null; }
function baseH(x,z){ if(!inR(INR,x,z,0)) return 0; if(inR(BIZEN,x,z,0)) return -2.6; const r=rampAt(x,z); if(r) return rampH(r,x,z); const p=platAt(x,z); if(p) return p.H; return hillH(x,z); }
function meshH(x,z){ if(!inR(INR,x,z,0)) return 0; if(inR(BIZEN,x,z,1)) return -2.6; const r=rampAt(x,z); if(r) return rampH(r,x,z); const p=platAtMesh(x,z); if(p) return p.H; const q=platAt(x,z); if(q){ let lo=1e9; for(const [dx,dz] of [[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){ const x2=x+dx,z2=z+dz; if(platAt(x2,z2)===q) continue; lo=Math.min(lo,baseH(x2,z2)); } return lo<1e8?lo:q.H; } return hillH(x,z); }
for(const p of PLAT){ if(!p.wall) continue; const E=[[p.x0,p.z0,p.x1,p.z0,0,-1],[p.x1,p.z0,p.x1,p.z1,1,0],[p.x0,p.z1,p.x1,p.z1,0,1],[p.x0,p.z0,p.x0,p.z1,-1,0]];
  p.walls=E.map(([ax,az,bx,bz,nx,nz])=>{ const L=Math.hypot(bx-ax,bz-az),n=Math.max(3,Math.ceil(L/2.5)); let lo=1e9; for(let i=0;i<=n;i++){ const t=i/n; lo=Math.min(lo,baseH(ax+(bx-ax)*t+nx*1.8,az+(bz-az)*t+nz*1.8)); } return lo<p.H-.6; }); }
/* 橋（特別見学通路は空中の歩道） */
const WALK_A={x0:-176,x1:-80,z0:-100,z1:-95};
const BRIDGES=[
  {id:'miyukibashi',x0:-129,x1:-119,z0:113.5,z1:128.5,h:(x,z)=>.35+.6*Math.sin(Math.PI*Math.min(1,Math.max(0,(z-113.5)/15))),mode:'both',name:'行幸橋'},
  {id:'sudobashi',x0:39,x1:49,z0:113.5,z1:128.5,h:()=>.4,mode:'both',name:'須戸口の橋'},
  {id:'higashibashi',x0:135.5,x1:150.5,z0:-30,z1:-22,h:()=>.4,mode:'both',name:'坪井川の橋'},
  {id:'walkA',x0:WALK_A.x0,x1:WALK_A.x1,z0:WALK_A.z0,z1:WALK_A.z1,h:(x,z)=>10.3+(25.2-10.3)*Math.max(0,Math.min(1,(x-WALK_A.x0)/(WALK_A.x1-WALK_A.x0))),mode:'modern',name:'特別見学通路'}
];
let BOUNDS={x0:-420,x1:300,z0:-260,z1:330}; let SCEN=null; const FILL={};
const actB=()=>BRIDGES.filter(b=>b.mode==='both'||b.mode===MODE);
/* 大天守の天守台（武者返しの石垣）。中心と大きさ */
const TZ={cx:8,cz:-26,g0:30,bw:24,bd:21,bh:8,bat:3.2,ch:.4};
function waterAt(x,z,m){ m=m||0; if(inR(MOAT,x,z,m)||inR(RIV_E,x,z,m)) return true; if(inR(BIZEN,x,z,m)) return true; return false; }
/* 道（木を植えない場所） */
const ROADS=[{x0:-440,x1:300,z0:128,z1:140},{x0:-128,x1:-120,z0:128,z1:330},{x0:150,x1:162,z0:-260,z1:330},{x0:39,x1:49,z0:128,z1:330},{x0:-440,x1:-352,z0:-20,z1:-12}];
/* blockers with spatial grid */
const GC=20, BSETS={shared:{list:[],grid:new Map()},modern:{list:[],grid:new Map()},edo:{list:[],grid:new Map()}}; let curSet=BSETS.shared, MODE='modern';
function block(x0,z0,x1,z1,kind){ const b={x0:Math.min(x0,x1),z0:Math.min(z0,z1),x1:Math.max(x0,x1),z1:Math.max(z0,z1),kind:kind||'house'},grid=curSet.grid; curSet.list.push(b);
  for(let cx=Math.floor(b.x0/GC);cx<=Math.floor(b.x1/GC);cx++) for(let cz=Math.floor(b.z0/GC);cz<=Math.floor(b.z1/GC);cz++){ const k=cx+','+cz; if(!grid.has(k)) grid.set(k,[]); grid.get(k).push(b); } }
function hitIn(set,x,z,m){ const l=set.grid.get(Math.floor(x/GC)+','+Math.floor(z/GC)); if(!l) return false; for(const b of l) if(inR(b,x,z,m)) return true; return false; }
const STG={}; let STCUR=null;
function hitBlock(x,z,m){ return hitIn(BSETS.shared,x,z,m)||hitIn(BSETS[MODE],x,z,m); }
const MACHI=[];
const LATER=[]; function addMatLater(k,f){ LATER.push([k,f]); }
