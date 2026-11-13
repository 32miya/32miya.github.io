/* far: 金峰山（西）・立田山（北東）と、遠くに阿蘇の外輪山（東の山並み） */
const KINU={x:-1900,z:-380,R:760,H:400},HACHI={x:900,z:-1000,R:380,H:120};
{ const SA=256,SR=22,pos=[],col=[],idx=[]; const cL=new THREE.Color('#3a4a3e'),cM=new THREE.Color('#5d6766'),tmp=new THREE.Color();
  for(let i=0;i<=SR;i++){ const t=i/SR,r=2600+Math.pow(t,1.25)*3200; for(let j=0;j<=SA;j++){ const a=j/SA*Math.PI*2,x=Math.cos(a)*r,z=Math.sin(a)*r;
      const east=.25+.75*Math.min(1,Math.max(0,(Math.cos(a)+.2)/.8)),west=.9*Math.min(1,Math.max(0,(-Math.cos(a)-.5)/.4)); const ridge=1-Math.abs(2*fbm(x*.0011+7,z*.0011,5)-1);
      const prof=Math.pow(Math.sin(Math.PI*Math.min(1,t*1.15)),.7); const h=(30+360*Math.max(east,west*1.1)*Math.pow(ridge,1.4))*prof;
      pos.push(x,h-2,z); tmp.copy(cL).lerp(cM,Math.min(1,h/300)).convertSRGBToLinear(); col.push(tmp.r,tmp.g,tmp.b); } }
  for(let i=0;i<SR;i++) for(let j=0;j<SA;j++){ const a=i*(SA+1)+j,b=a+1,c=a+SA+1,d=c+1; idx.push(a,c,b,b,c,d); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); g.setIndex(idx); g.computeVertexNormals();
  scene.add(mesh(g,std({vertexColors:true,roughness:1}),false,false)); }
for(const S of [KINU,HACHI]){ const NR=40,NA=64,pos=[],col=[],idx=[],c=new THREE.Color(),cL=new THREE.Color('#556b45'),cH=new THREE.Color('#6e7d55');
  for(let i=0;i<=NR;i++){ const t=i/NR,r=S.R*t; for(let j=0;j<=NA;j++){ const a=j/NA*6.283,x=S.x+Math.cos(a)*r*.8,z=S.z+Math.sin(a)*r*1.3,h=S.H*Math.pow(Math.cos(t*Math.PI/2),1.3)*(.75+.5*fbm(x*.006+3,z*.006,4))*(1+.25*Math.sin(a*3+1)); pos.push(x,h-.5,z); c.copy(cL).lerp(cH,h/S.H).convertSRGBToLinear(); col.push(c.r,c.g,c.b); } }
  for(let i=0;i<NR;i++) for(let j=0;j<NA;j++){ const a=i*(NA+1)+j,b=a+1,cc=a+NA+1,d=cc+1; idx.push(a,cc,b,b,cc,d); }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('color',new THREE.Float32BufferAttribute(col,3)); g.setIndex(idx); g.computeVertexNormals(); scene.add(mesh(g,std({vertexColors:true,roughness:1}),false,true)); }
/* 現代: 遠くの熊本の市街 */
{ const N=900,geo=new THREE.BoxGeometry(1,1,1); geo.translate(0,.5,0); const im=new THREE.InstancedMesh(geo,M.city,N); im.frustumCulled=false; let n=0; const c=new THREE.Color();
  while(n<N){ const a=rnd()*6.283,r=520+Math.pow(rnd(),.7)*1500,x=Math.cos(a)*r,z=Math.sin(a)*r; if(Math.hypot(x-KINU.x,(z-KINU.z)/1.3)<KINU.R*.8+40) continue; if(Math.hypot(x-HACHI.x,(z-HACHI.z)/1.3)<HACHI.R*.8+30) continue;
    const w=10+rnd()*18,d=10+rnd()*18,h=6+Math.pow(rnd(),2)*34; im.setMatrixAt(n,TM(x,0,z,rnd()*.3,w,h,d)); c.setHSL(.08+rnd()*.06,.04+rnd()*.08,.5+rnd()*.3); im.setColorAt(n,c.convertSRGBToLinear()); n++; }
  GM.add(im); }
/* 江戸時代: 外の村（田畑の中の農家） */
{ const N=240,geo=new THREE.BoxGeometry(1,1,1); geo.translate(0,.5,0); const im=new THREE.InstancedMesh(geo,M.thatch,N),rf=new THREE.InstancedMesh(gableRoofGeo(1,1,1,.15,.08),M.thatch,N); im.frustumCulled=rf.frustumCulled=false; let n=0;
  while(n<N){ const a=rnd()*6.283,r=520+Math.pow(rnd(),.8)*1300,x=Math.cos(a)*r,z=Math.sin(a)*r; if(Math.hypot(x-KINU.x,(z-KINU.z)/1.3)<KINU.R*.8+30) continue; const w=7+rnd()*5,d=6+rnd()*4,h=2.6+rnd();
    im.setMatrixAt(n,TM(x,0,z,rnd()*3,w,h,d)); rf.setMatrixAt(n,TM(x,h,z,0,w,2.6,d)); n++; } GE.add(im); GE.add(rf); }
