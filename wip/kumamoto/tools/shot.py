import sys, asyncio, json, threading, http.server, functools, os
from playwright.async_api import async_playwright
ROOT='/home/claude/work/site'; PORT=8765
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
def serve():
    h=functools.partial(Q,directory=ROOT); http.server.ThreadingHTTPServer(('127.0.0.1',PORT),h).serve_forever()
threading.Thread(target=serve,daemon=True).start()
THREE=open('/home/claude/work/vendor/package/build/three.min.js','rb').read()
async def main(actions, out):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg=await b.new_page(viewport={'width':int(os.environ.get('VW','900')),'height':int(os.environ.get('VH','600'))})
        logs=[]
        pg.on('console',lambda m: logs.append(m.type+': '+m.text) if m.type in ('error','warning') else None)
        pg.on('response',lambda r: logs.append('404: '+r.url) if r.status==404 and '127.0.0.1' in r.url else None)
        pg.on('pageerror',lambda e: logs.append('PAGEERR: '+str(e)))
        async def route(r):
            u=r.request.url
            if 'three.min.js' in u: await r.fulfill(body=THREE,content_type='application/javascript')
            elif u.startswith('http://127.0.0.1'): await r.continue_()
            else: await r.fulfill(status=404,body='')
        await pg.route('**/*',route)
        await pg.goto(f'http://127.0.0.1:{PORT}/kumamoto/index.html?q=low')
        await pg.wait_for_timeout(9000)
        i=0
        for a in actions:
            if a.startswith('js:'):
                try: r=await pg.evaluate(a[3:]); print('JS->',str(r)[:1500])
                except Exception as e: print('JSERR',str(e)[:600])
            elif a.startswith('wait:'): await pg.wait_for_timeout(int(a[5:]))
            elif a.startswith('shot:'):
                await pg.screenshot(path=out+'_'+a[5:]+'.png'); i+=1
        print('\n'.join(logs[:40]))
        await b.close()
acts=json.load(open(sys.argv[1])); asyncio.run(main(acts,sys.argv[2]))
