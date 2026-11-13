/* 平らな地面（台地の範囲は高さのある地形メッシュ、坪井川は水面） */
function rectSub(list,h){ const out=[]; for(const r of list){ if(!(h.x1>r.x0&&h.x0<r.x1&&h.z1>r.z0&&h.z0<r.z1)){ out.push(r); continue; }
    if(h.z0>r.z0) out.push(R4(r.x0,r.z0,r.x1,h.z0)); if(h.z1<r.z1) out.push(R4(r.x0,h.z1,r.x1,r.z1));
    const z0=Math.max(r.z0,h.z0),z1=Math.min(r.z1,h.z1); if(h.x0>r.x0) out.push(R4(r.x0,z0,h.x0,z1)); if(h.x1<r.x1) out.push(R4(h.x1,z0,r.x1,z1)); } return out; }
{ let pieces=[R4(-6000,-6000,6000,6000)]; for(const h of [INR,MOAT,RIV_E]) pieces=rectSub(pieces,h);
  for(const [mat,par] of [[groundMat,GM],[groundMatE,GE]]) for(const r of pieces) if(r.x1>r.x0&&r.z1>r.z0) par.add(mesh(groundGeo(rectShape(r)),mat,false,true)); }
