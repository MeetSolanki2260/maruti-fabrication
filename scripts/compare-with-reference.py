"""Compares the built site (out/) with the approved reference file section by section.
Run after `npm run build`:  python3 scripts/compare-with-reference.py   (needs Python + Playwright)
Both pages are drawn with the same bundled fonts, so any size difference is a real layout difference."""
import functools, http.server, os, re, shutil, tempfile, threading
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tmp = tempfile.mkdtemp(); os.makedirs(tmp + "/fonts")
for f in ("BarlowCondensed-500", "BarlowCondensed-600", "BarlowCondensed-700", "Inter-var", "JetBrainsMono-400", "JetBrainsMono-500"):
    shutil.copy(f"{ROOT}/app/fonts/{f}.woff2", tmp + "/fonts/")
shutil.copytree(f"{ROOT}/design/reference/img", tmp + "/img")
h = open(f"{ROOT}/design/reference/reference-index.html", encoding="utf8").read()
h = re.sub(r'<link rel="preconnect"[^>]*>\n?', "", h); h = re.sub(r'<link href="https://fonts.googleapis.com[^>]*>', "", h)
faces = "".join(f"@font-face{{font-family:'{n}';font-weight:{w};src:url(fonts/{f}.woff2)}}" for n, w, f in [
    ("Barlow Condensed", 500, "BarlowCondensed-500"), ("Barlow Condensed", 600, "BarlowCondensed-600"), ("Barlow Condensed", 700, "BarlowCondensed-700"),
    ("Inter", "100 900", "Inter-var"), ("JetBrains Mono", 400, "JetBrainsMono-400"), ("JetBrains Mono", 500, "JetBrainsMono-500")])
open(tmp + "/index.html", "w", encoding="utf8").write(h.replace("<style>", f"<style>{faces}</style><style>", 1))
def serve(d, port):
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Q, directory=d)); threading.Thread(target=s.serve_forever, daemon=True).start()
serve(tmp, 8100); serve(f"{ROOT}/out", 8099)
JS = """[...document.querySelectorAll('.strip,header.nav,.hero,.ticker,main>section,footer')].map(e=>[(e.className||e.id||e.tagName).toString().split(' ')[0],Math.round(e.getBoundingClientRect().height)])"""
def load(pg, url):
    pg.goto(url); pg.wait_for_timeout(1200)
    for y in range(0, pg.evaluate("document.documentElement.scrollHeight"), 500): pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(300)
    pg.wait_for_timeout(1500); pg.evaluate("scrollTo(0,0)")
with sync_playwright() as p:
    b = p.chromium.launch()
    for W in (390, 768, 1440, 1920):
        r = b.new_page(viewport={"width": W, "height": 900}); m = b.new_page(viewport={"width": W, "height": 900})
        load(r, "http://127.0.0.1:8100/index.html"); load(m, "http://127.0.0.1:8099/en/")
        a, c = r.evaluate(JS), m.evaluate(JS); bad = [(x[0], x[1], y[1]) for x, y in zip(a, c) if x[1] != y[1]]
        print(f"width {W}: {len(a)} sections, {len(a)-len(bad)} same height" + ("" if not bad else "; different: " + ", ".join(f"{n} {x}->{y}px" for n, x, y in bad)))
    b.close()
