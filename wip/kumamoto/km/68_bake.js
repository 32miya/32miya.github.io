/* 天守と本丸御殿は、西南戦争の場面で焼け落ちるので、それぞれのグループの中だけでまとめる（全体のまとめからは外す） */
function bakeInto(root){ const KEY=new Map(); for(const k of BKEYS) if(M[k]&&!KEY.has(M[k])) KEY.set(M[k],k); for(const k in M) if(!KEY.has(M[k])) KEY.set(M[k],k);
  root.updateMatrixWorld(true); const set={},kill=[],inv=new THREE.Matrix4().copy(root.matrixWorld).invert();
  root.traverse(o=>{ if(!o.isMesh||o.isInstancedMesh||Array.isArray(o.material)) return; const k=KEY.get(o.material); if(!k) return; const g=o.geometry; if(!g||!g.attributes.position||g.attributes.color||o.material.transparent||o.renderOrder) return; if(g.attributes.position.count>6000) return; kill.push([o,k]); });
  for(const [o,k] of kill){ (set[k]=set[k]||new Batch()).add(o.geometry.clone(),new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld)); o.parent.remove(o); }
  for(const k in set) set[k].build(M[k],!NOCAST.includes(k),root); }
