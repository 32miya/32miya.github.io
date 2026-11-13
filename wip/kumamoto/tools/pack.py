import json
from PIL import Image
import numpy as np
from scipy import ndimage as nd
k1=Image.open('k1.png').convert('RGBA'); k3=Image.open('k3.png').convert('RGBA'); k2=Image.open('k2a.png').convert('RGBA')
b1=json.load(open('s1b.json')); b3=json.load(open('s3.png.json'))
def soft(im):
    a=np.array(im); al=a[:,:,3].astype(float); a[:,:,3]=np.clip((al-50)*255/140,0,255).astype(np.uint8); return Image.fromarray(a,'RGBA')
def crop_box(im,x,y,w,h,pad=2):
    c=im.crop((x-pad,y-pad,x+w+pad,y+h+pad)); a=np.array(c)
    # keep only the largest components (drop neighbor bits touching edges)
    m=a[:,:,3]>100; lab,n=nd.label(nd.binary_dilation(m,iterations=3))
    if n>1:
        sz=nd.sum(m,lab,range(1,n+1)); keep=[i+1 for i,s in enumerate(sz) if s>=0.06*sz.max()]
        a[:,:,3]=np.where(np.isin(lab,keep),a[:,:,3],0)
    c=Image.fromarray(a,'RGBA'); bb=c.getbbox(); return c.crop(bb)
N1=['km_shirei','km_hohei_a','km_hohei_b','km_shikan','km_shizoku','km_musume','km_onna','km_sou','km_nofu','km_hohei_c','km_kodomo','km_mino','km_kihei','km_kneel','km_aim','km_load','km_charge','km_crouch','km_hohou','km_gunki','km_uma_b','km_kanri','km_shosei',None,'km_seiro','km_mon','km_koya',None,'km_saku','SPLIT29','km_roten','km_mise','km_horo','km_niuma','km_taru','km_tawara','km_hako','km_nobori_ao','km_nobori_aka','km_kosatsu','km_toro',None,'km_iwa','km_sakura','km_matsu','km_icho','km_yanagi','km_take',None,'km_kagaribi',None]
H1={'km_shirei':1.8,'km_hohei_a':1.72,'km_hohei_b':1.72,'km_shikan':1.75,'km_shizoku':1.72,'km_musume':1.58,'km_onna':1.58,'km_sou':1.7,'km_nofu':1.62,'km_hohei_c':1.74,'km_kodomo':1.15,'km_mino':1.72,'km_kihei':2.6,'km_kneel':1.12,'km_aim':1.72,'km_load':1.55,'km_charge':1.6,'km_crouch':1.0,'km_hohou':1.95,'km_gunki':2.9,'km_uma_b':2.3,'km_kanri':1.76,'km_shosei':1.7,'km_seiro':7,'km_mon':6,'km_koya':5,'km_saku':3.2,'km_sakamogi':1.6,'km_tent':3,'km_roten':3,'km_mise':4.4,'km_horo':2.5,'km_niuma':2,'km_taru':1.5,'km_tawara':1.3,'km_hako':1.5,'km_nobori_ao':3.4,'km_nobori_aka':3.4,'km_kosatsu':2.2,'km_toro':2.4,'km_iwa':1.5,'km_sakura':7,'km_matsu':6,'km_icho':10,'km_yanagi':7,'km_take':6,'km_kagaribi':2}
items=[]
for i,n in enumerate(N1):
    if n is None: continue
    x,y,w,h=b1[i]
    if n=='SPLIT29':
        items.append(('km_sakamogi',crop_box(k1,x,y,1372-x,h),H1['km_sakamogi']))
        items.append(('km_tent',crop_box(k1,1374,y,x+w-1374,h),H1['km_tent'])); continue
    items.append((n,crop_box(k1,x,y,w,h),H1[n]))
N3=[None,'km_shachi_l','km_shachi_r','km_kikyo','km_kikyo_ban','km_maku','FUSUMA','km_ranma_matsu','km_ranma_nami','BYOBU','km_andon','km_zushi','km_jiku','km_gaku','km_tsubo','km_tsuitate','FS16','km_hashira',None,None,'km_shokudai','km_koran','km_nagamochi','km_dai']
H3={'km_shachi_l':2.4,'km_shachi_r':2.4,'km_kikyo':1.0,'km_kikyo_ban':1.3,'km_maku':3.0,'km_ranma_matsu':.62,'km_ranma_nami':.62,'km_andon':1.6,'km_zushi':1.5,'km_jiku':1.9,'km_gaku':1.6,'km_tsubo':1.0,'km_tsuitate':1.5,'km_hashira':2.2,'km_shokudai':1.3,'km_koran':.95,'km_nagamochi':.9,'km_dai':.75}
tex={}
# sort b3 entries are by row then x; verify count
print(len(b3))
for i,n in enumerate(N3):
    if i>=len(b3) or n is None: continue
    x,y,w,h=b3[i]
    if n=='FUSUMA':
        for nm,(a0,a1) in [('km_fs_matsu',(17,322)),('km_fs_sakura',(332,568)),('km_fs_tsuru',(575,731)),('km_fs_take',(737,906))]: tex[nm]=k3.crop((a0+4,y+4,a1-4,y+h-4))
        continue
    if n=='BYOBU': tex['km_byobu']=k3.crop((x+2,y+2,x+w-2,y+h-2)); continue
    if n=='FS16': tex['km_fs_sakura2']=k3.crop((x+6,y+6,x+w-6,y+h-6)); continue
    items.append((n,crop_box(k3,x,y,w,h),H3[n]))
for n,(x0,y0,x1,y1),h in [('km_gun_a',(0,0,770,500),3.1),('km_gun_b',(770,0,1536,500),2.25),('km_sat_a',(0,495,770,1024),2.4),('km_sat_b',(770,495,1536,1024),2.65)]:
    c=k2.crop((x0,y0,x1,y1)); items.append((n,c.crop(c.getbbox()),h))
# target pixel heights
def tgt(n,h):
    if n.startswith('km_gun') or n.startswith('km_sat'): return 330
    if h<=2.0 and n not in ('km_kikyo','km_ranma_matsu','km_ranma_nami','km_koran','km_dai','km_nagamochi','km_tsubo'): return 215
    return 196
P=2048; page=Image.new('RGBA',(P,P),(0,0,0,0)); meta={}
rows=sorted([(n,im,h) for n,im,h in items],key=lambda t:-tgt(t[0],t[2]))
x=2;y=2;rowh=0
for n,im,h in rows:
    th=tgt(n,h); s=th/im.height; w=max(4,round(im.width*s)); im2=soft(im.resize((w,th),Image.LANCZOS))
    if w>P-4: s=(P-4)/im.width; w=P-4; th=round(im.height*s); im2=soft(im.resize((w,th),Image.LANCZOS))
    if x+w>P-2: x=2; y+=rowh+2; rowh=0
    page.alpha_composite(im2,(x,y)); meta[n]=[4,x,y,w,th,h]; x+=w+2; rowh=max(rowh,th)
print('used height',y+rowh)
page.save('deco_kumamoto.png'); page.save('deco_kumamoto.webp',quality=86,method=6)
json.dump(meta,open('deco_kumamoto.json','w'))
import os; os.makedirs('tex',exist_ok=True)
for n,im in tex.items():
    im=im.convert('RGB'); s=512/max(im.size); im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS).save('tex/'+n+'.webp',quality=86)
print(len(meta),list(tex))
