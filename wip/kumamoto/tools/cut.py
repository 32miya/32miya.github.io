import sys, json
from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage as nd
def comps(alpha, thr=40, dil=7, minpx=1500):
    m=alpha>thr
    md=nd.binary_dilation(m,iterations=dil)
    lab,n=nd.label(md)
    out=[]
    for i,s in enumerate(nd.find_objects(lab)):
        sub=(lab[s]==i+1)&m[s]
        if sub.sum()<minpx: continue
        ys,xs=np.nonzero(sub)
        out.append((s[1].start+xs.min(), s[0].start+ys.min(), xs.max()-xs.min()+1, ys.max()-ys.min()+1, i+1))
    return lab,out
if __name__=='__main__':
    f,outp,dil=sys.argv[1],sys.argv[2],int(sys.argv[3])
    im=Image.open(f).convert('RGBA'); a=np.array(im)
    lab,boxes=comps(a[:,:,3],dil=dil)
    boxes.sort(key=lambda b:(round(b[1]/120),b[0]))
    sheet=Image.new('RGB',im.size,(60,60,60)); sheet.paste(im,(0,0),im)
    d=ImageDraw.Draw(sheet)
    for k,(x,y,w,h,_) in enumerate(boxes):
        d.rectangle([x,y,x+w,y+h],outline=(255,0,0),width=2); d.text((x+3,y+3),str(k),fill=(255,255,0))
    sheet.save(outp)
    json.dump([[int(v) for v in b[:4]] for b in boxes],open(outp+'.json','w'))
    print(len(boxes))
