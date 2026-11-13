import re
A=open('/home/claude/src/32miya-32miya-azuchi-castle/index.html').read().split('\n')
K='/home/claude/work/km/'
f=lambda n:open(K+n).read().rstrip('\n')
g=lambda a,b:'\n'.join(A[a-1:b])
parts=[g(1,1384),f('10_layout.js'),g(1479,1568),f('20_mats.js'),g(1643,1846),f('25_art.js'),g(1865,2033),f('15_ground.js'),g(2059,2085),f('16_flat.js'),g(2091,2102),f('17_banks.js'),
 g(2112,2229),g(2235,2269),f('30_keep.js'),f('40_eras.js'),f('45_rooms.js'),f('50_spots.js'),f('68_bake.js'),g(2663,2667),'bakeInto(KX); bakeInto(GOTG); KX.visible=false; GOTG.visible=false;',g(2668,2686),f('60_far.js'),g(2712,2720),f('65_trees.js'),g(2733,2787),f('66_water.js'),
 g(2793,2799),f('67_boats.js'),g(2802,3146),f('70_people.js'),g(3218,3267),f('80a_head.js'),f('80b_engine.js'),f('80c_scen.js'),f('80d_switch.js'),f('80e_guide.js'),g(3268,len(A))]
s='\n'.join(parts)
open('/home/claude/work/out/index.html','w').write(s)
print(len(s))
