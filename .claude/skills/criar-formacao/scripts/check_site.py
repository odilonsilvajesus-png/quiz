"""Abre o site gerado em um navegador sem tela e confere cada aula.

Uso:
    python3 check_site.py <pasta-da-formacao>/site/index.html

Para cada aula, verifica:
- se todos os esquemas (blocos mermaid) foram desenhados;
- se há links internos que não apontam para outra aula (arquivos .md não encontrados).

Requer Node.js e Playwright com Chromium. Se não estiverem disponíveis, o script
avisa e encerra sem erro: nesse caso, revise os esquemas seguindo as regras de
references/esquemas-mermaid.md.

As bibliotecas do site (marked e mermaid) são baixadas com curl para uma pasta
temporária, porque o navegador sem tela pode não confiar no certificado do proxy
do ambiente. O site publicado continua carregando as bibliotecas da CDN.
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

JS = r"""
const pw = await import(process.env.PW_MODULE);
const { chromium } = pw.default ?? pw;
const opts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const b = await chromium.launch(opts);
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + process.argv[2]); await p.waitForTimeout(800);
const ids = await p.evaluate(() => DATA.modules.flatMap(m => m.lessons.map(l => l.id)));
let total = 0, bad = 0;
for (const id of ids) {
  await p.evaluate(i => { location.hash = i; }, id); await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({
    figs: document.querySelectorAll('figure.diagram').length,
    svgs: document.querySelectorAll('figure.diagram svg').length,
    fails: [...document.querySelectorAll('figure.diagram')].filter(x => x.querySelector('.fail')).map(x => x.dataset.src.split('\n').slice(0, 2).join(' | ')),
    badLinks: [...document.querySelectorAll('#prose a[href]')].map(a => a.getAttribute('href')).filter(h => !h.startsWith('http') && !h.startsWith('#'))
  }));
  total += r.figs;
  if (r.fails.length || r.svgs < r.figs || r.badLinks.length) { bad++; console.log('PROBLEMA', id, JSON.stringify(r)); }
}
console.log(`aulas: ${ids.length} | esquemas: ${total} | aulas com problema: ${bad}`);
if (errs.length) console.log('erros de página:', errs);
await b.close();
"""


def find_playwright():
    candidates = []
    try:
        root = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()
        if root:
            candidates.append(Path(root) / "playwright" / "index.mjs")
    except FileNotFoundError:
        pass
    candidates += [Path(p) for p in ("/opt/node22/lib/node_modules/playwright/index.mjs",
                                     "/usr/lib/node_modules/playwright/index.mjs",
                                     "/usr/local/lib/node_modules/playwright/index.mjs")]
    return next((c for c in candidates if c.exists()), None)


def main():
    if len(sys.argv) != 2:
        sys.exit("Uso: python3 check_site.py <caminho>/site/index.html")
    site = Path(sys.argv[1]).resolve()
    pw = find_playwright()
    if not shutil.which("node") or not pw:
        print("Node.js ou Playwright não encontrados: verificação automática pulada.")
        return
    html = site.read_text(encoding="utf-8")
    tmp = Path(tempfile.mkdtemp(prefix="check-site-"))
    for url in re.findall(r'<script src="(https://[^"]+)"', html):
        local = url.rsplit("/", 1)[-1]
        subprocess.run(["curl", "-sS", "-o", str(tmp / local), url], check=True)
        html = html.replace(url, local)
    page = tmp / "preview.html"
    page.write_text('<!doctype html><html><head><meta charset="utf-8"></head><body>' + html +
                    "</body></html>", encoding="utf-8")
    (tmp / "check.mjs").write_text(JS, encoding="utf-8")
    env = dict(os.environ, PW_MODULE=pw.as_uri())
    chromium = Path("/opt/pw-browsers/chromium")
    if chromium.exists():
        env["CHROMIUM_PATH"] = str(chromium)
    subprocess.run(["node", str(tmp / "check.mjs"), str(page)], env=env, timeout=1200)


if __name__ == "__main__":
    main()
