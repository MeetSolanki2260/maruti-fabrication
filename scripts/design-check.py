import threading, http.server, functools
from playwright.sync_api import sync_playwright
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(("127.0.0.1",8099),functools.partial(Q,directory="/home/claude/maruti/out")); threading.Thread(target=srv.serve_forever,daemon=True).start()
FIG={"top+nav+hero+strip":880,"services":734,"where":859,"gallery":1041,"custom":737,"benefits":479,"process":505,"faq":545,"contact":795,"footer":326}
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1440,"height":900}); pg.goto("http://127.0.0.1:8099/en/"); pg.wait_for_timeout(1200)
    h=pg.evaluate("document.documentElement.scrollHeight")
    for y in range(0,h,600): pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(180)
    pg.evaluate("scrollTo(0,0)"); pg.wait_for_timeout(500)
    hs=pg.evaluate("""(()=>{const g=s=>Math.round(document.querySelector(s).getBoundingClientRect().height);
      const hero=g('.top')+g('.hdr')+g('.hero')+g('.strip');
      return [hero,g('#services'),g('.where'),g('#inspiration'),g('#custom'),g('.benefits'),g('#process'),g('#faq'),g('#contact'),g('.ftr')]})()""")
    for (k,v),m in zip(FIG.items(),hs): print(f"{k:20s} figma {v:5d}  mine {m:5d}  diff {m-v:+d}")
    print("total", h, "(figma 6901 incl. closed FAQ items; 7125 open)")
    pg.screenshot(path="design/_my-full-page.png",full_page=True)
    b.close()
