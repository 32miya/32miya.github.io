let UNITS=[],FXS=[],phT=0,PH=null;
function unit(o){ const u=Object.assign({n:12,w:24,d:6,y:null,fire:0,loss:0,mill:0,spd:1},o); u.side=unitSide(u.spr); u.scal=!u.noScale&&u.n>3&&!!u.side; if(u.scal) u.n=Math.max(1,Math.round(u.n*(UMULT[u.side]??1))); const to=u.to||u.at,dx=to[0]-u.at[0],dz=to[1]-u.at[1],l=Math.hypot(dx,dz);
  const fwd=l>.1?[dx/l,dz/l]:(u.face||[0,-1]); u.fwd=fwd; u.right=[-fwd[1],fwd[0]]; const cols=Math.max(1,Math.round(Math.sqrt(u.n*u.w/Math.max(1,u.d)))),rows=Math.ceil(u.n/cols); u.mem=[];
  for(let i=0;i<u.n;i++){ const c=i%cols,r=(i/cols)|0,ox=(cols>1?c/(cols-1)-.5:0)*u.w+(rnd()-.5)*1.4,oz=(rows>1?r/(rows-1)-.5:0)*u.d+(rnd()-.5)*(u.tight?0:1.2),spr=u.spr[i%u.spr.length];
    const m={ox,oz,ph:rnd()*6,dead:rnd()<u.loss,tdie:.35+rnd()*.6,mx:rnd()}; const p=unitPos(u,m,0); m.it=bCrowd.add(spr,p[0],p[1],p[2],{s:u.s,flip:rnd()<.5}); if(m.it&&sprInfo(spr+'_b')&&spr!=='onna'){ const bk=bCrowd.add(spr+'_b',p[0],p[1],p[2],{s:u.s,flip:m.it.flip,shadow:false}); if(bk){ bk.twin=1; bCrowd.setOn(bk,false); m.it.bk=bk; } } if(u.air&&m.it){ m.it.air=1; if(m.it.bk) m.it.bk.air=1; } u.mem.push(m); }
  if(u.flags) for(let i=0;i<u.flags;i++){ const ox=(i/(Math.max(1,u.flags-1))-.5)*u.w; const m={ox,oz:-u.d/2-1.5,ph:0,flag:true}; const p=unitPos(u,m,0); m.it=bCrowd.add(u.fl?pick(u.fl):pick(K_FLAG),p[0],p[1],p[2],{s:.9}); u.mem.push(m); }
  UNITS.push(u); return u; }
function unitProg(u,t){ if(!u.to) return 0; const t0=u.t0||0,dur=u.dur||20; let k=Math.min(1,Math.max(0,(t-t0)/dur)); k=k*k*(3-2*k); if(u.back){ const kb=Math.min(1,Math.max(0,(t-t0-dur-(u.hold||4))/(u.bdur||dur))); k-=kb*u.back; } return k; }
function unitPos(u,m,t){ const k=unitProg(u,t),bx=u.at[0]+((u.to||u.at)[0]-u.at[0])*k,bz=u.at[1]+((u.to||u.at)[1]-u.at[1])*k; let x=bx+u.right[0]*m.ox+u.fwd[0]*m.oz,z=bz+u.right[1]*m.ox+u.fwd[1]*m.oz;
  if(u.mill){ const s=Math.sin(t*u.mill*.3+m.mx*6.283); x+=u.fwd[0]*s*u.millR; z+=u.fwd[1]*s*u.millR; } if(u.scatter&&t>u.scatter){ const e=Math.min(1,(t-u.scatter)/6)*14; x+=Math.cos(m.mx*9)*e; z+=Math.sin(m.mx*9)*e; }
  const bad=(xx,zz)=>hitBlock(xx,zz,.3)||(waterAt(xx,zz,.3)&&!walkable(xx,zz)); if(u.y===null&&bad(x,z)){ let ok=false; for(let d=1;d<=8&&!ok;d++) for(const sg of [1,-1]){ const xx=x+u.right[0]*d*sg,zz=z+u.right[1]*d*sg; if(!bad(xx,zz)){ x=xx; z=zz; ok=true; break; } } if(!ok) for(let d=1;d<=8&&!ok;d++) for(const sg of [1,-1]){ const xx=x+u.fwd[0]*d*sg,zz=z+u.fwd[1]*d*sg; if(!bad(xx,zz)){ x=xx; z=zz; ok=true; break; } } }
  const y=u.y!==null?u.y:withScen(()=>groundH(x,z)); return [x,y,z,k]; }
function withScen(f){ return f(); }
function clearUnits(){ STBK.length=0; bCrowd.clear(); UNITS=[]; FXS=[]; FX.clear(); if(typeof clearTags==='function') clearTags(); }
function fxsStep(t,dt){
  for(const f of FXS){ if(t<(f.t0||0)||(f.t1&&t>f.t1)) continue;
    if(f.type==='cannon'){ f.acc=(f.acc||rnd()*f.every)+dt; if(f.acc>=f.every){ f.acc=0; const [x,y,z]=f.from; FX.emit(3,x,y+1,z,7,0,0,0,.35); for(let i=0;i<4;i++) FX.emit(0,x+(rnd()-.5)*2,y+1.2,z+(rnd()-.5)*2,4,(rnd()-.5)*1.2,.8,(rnd()-.5)*1.2,6); f.pending=(f.pending||[]); f.pending.push(1.4); }
      if(f.pending) for(let i=f.pending.length-1;i>=0;i--){ f.pending[i]-=dt; if(f.pending[i]<=0){ f.pending.splice(i,1); const [x,y,z]=f.to,j=f.spread||4; const ix=x+(rnd()-.5)*j,iy=y+(rnd()-.5)*j*.6,iz=z+(rnd()-.5)*j; FX.emit(3,ix,iy,iz,6,0,0,0,.3); for(let k=0;k<6;k++) FX.emit(k<2?1:5,ix,iy,iz,3,(rnd()-.5)*3,1+rnd()*2,(rnd()-.5)*3,4); for(let k=0;k<8;k++) FX.emit(4,ix,iy,iz,.5,(rnd()-.5)*6,2+rnd()*4,(rnd()-.5)*6,1.5); } } }
    else if(f.type==='blaze'){ if(f.kf&&f.y>KB.top+1) continue; const n=f.rate*dt; for(let i=0;i<n||rnd()<n-i;i++){ const a=rnd()*6.283,r=f.r*(f.ring===false?rnd():.85+rnd()*.3),x=f.x+Math.cos(a)*r,z=f.z+Math.sin(a)*r,y=f.y+rnd()*(f.h||4); FX.emit(2,x,y,z,3+rnd()*3,Math.cos(a)*.8+(rnd()-.5)*.6,2+rnd()*2,Math.sin(a)*.8+(rnd()-.5)*.6,1+rnd()*.8); if(rnd()<.35) FX.emit(1,x,y+3,z,4,(rnd()-.5)+.4,3+rnd()*2,(rnd()-.5),9); if(rnd()<.2) FX.emit(4,x,y,z,.4,(rnd()-.5)*2,3+rnd()*3,(rnd()-.5)*2,2.5); if(i>40) break; } }
    else if(f.type==='column'){ if(rnd()<f.rate*dt) FX.emit(1,f.x+(rnd()-.5)*f.r,f.y,f.z+(rnd()-.5)*f.r,5,.6,2.5+rnd(),(rnd()-.5)*.5,14); } }
}
function updateUnits(dt){ if(!GB.visible) return; phT+=dt; const t=phT,rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);
  for(const u of UNITS){ /* 兵が向いている方向とカメラから見た方向が同じなら後ろ姿 */ { const rv=u.back&&unitProg(u,t)<unitProg(u,t-.1)?-1:1,fx=u.fwd[0]*rv,fz=u.fwd[1]*rv,c=unitPos(u,{ox:0,oz:0,mx:.5,ph:0},t),bk=(fx*(c[0]-camera.position.x)+fz*(c[2]-camera.position.z))>0;
      if(bk!==u.bkNow){ u.bkNow=bk; for(const m of u.mem) if(m.it&&m.it.bk&&!m.gone){ bCrowd.setOn(m.it,!bk); bCrowd.setOn(m.it.bk,bk); } } }
    const moving=u.to&&(t>(u.t0||0))&&(unitProg(u,t)<.999&&unitProg(u,t)>.001||u.back)||u.mill||(u.scatter&&t>u.scatter);
    for(const m of u.mem){ if(!m.it) continue; if(m.dead&&!m.gone&&unitProg(u,t)>m.tdie&&!m.flag){ m.gone=true; const di=m.it; bCrowd.hide(di); if(m.mx<.6) bCrowd.add(m.mx<.3?'act_fallen':'taore',di.x,di.y,di.z,{flip:m.mx<.15||(m.mx>.3&&m.mx<.45)}); continue; } if(m.gone) continue; if(!moving&&m.placed) continue;
      const p=unitPos(u,m,t); m.ph+=dt*(u.to?5:0); const bob=moving&&!m.flag?Math.abs(Math.sin(m.ph+(u.mill?t*3:0)))*.05:0; const mvx=u.fwd[0]*(u.back&&unitProg(u,t)<unitProg(u,t-.1)?-1:1),mvz=u.fwd[1];
      bCrowd.move(m.it,p[0],p[1]+bob,p[2],m.flag?undefined:(mvx*rx+mvz*rz)<0); m.placed=true; }
    if(u.fire&&t>(u.fireT0||0)&&(!u.fireT1||t<u.fireT1)&&rnd()<u.fire*dt){ const m=pick(u.mem); if(m&&m.it&&!m.gone&&!m.flag){ const it=m.it,fx=u.aim?u.aim[0]-it.x:u.fwd[0],fz=u.aim?u.aim[1]-it.z:u.fwd[1],l=Math.hypot(fx,fz)||1;
        FX.emit(3,it.x+fx/l*.8,it.y+1.3,it.z+fz/l*.8,1.6,0,0,0,.25); FX.emit(0,it.x+fx/l*1.2,it.y+1.4,it.z+fz/l*1.2,1.2,fx/l*.6+(rnd()-.5)*.4,.35,fz/l*.6+(rnd()-.5)*.4,4+rnd()*2); } }
    if(u.dust&&rnd()<u.dust*dt){ const m=pick(u.mem); if(m&&m.it) FX.emit(5,m.it.x+(rnd()-.5)*2,m.it.y+.3,m.it.z+(rnd()-.5)*2,1.6,(rnd()-.5)*.3,.25,(rnd()-.5)*.3,5); } }
  for(const [it,bk,fz] of STBK){ if(it.hidden) continue; const b=fz*(it.z-camera.position.z)>0; bCrowd.setOn(it,!b); bCrowd.setOn(bk,b); }
  fxsStep(t,dt);
  if(PH&&PH.fire) fireStep(t,dt); }

function freeSpot(x,z,m){ if(!hitBlock(x,z,m||.4)&&!waterAt(x,z,.3)) return [x,z]; for(let r=1;r<=12;r+=1) for(let a=0;a<6.283;a+=.5){ const xx=x+Math.cos(a)*r,zz=z+Math.sin(a)*r; if(!hitBlock(xx,zz,m||.4)&&!waterAt(xx,zz,.3)) return [xx,zz]; } return null; }
const DC=(sp,x,z,o,y,keep)=>{ if(!keep){ const f=freeSpot(x,z); if(!f) return null; x=f[0]; z=f[1]; if(y!==undefined&&y<5&&Math.abs(withScen(()=>groundH(x,z))-y)>.6) return null; } return bCrowd.add(sp,x,y!==undefined?y:withScen(()=>groundH(x,z)),z,o||{}); };
