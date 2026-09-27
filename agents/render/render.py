#!/usr/bin/env python3
"""Renderiza carrosséis (1080x1350) a partir de uma especificação JSON gerada pelo Agente Visual.

Uso:
    python agents/render/render.py agents/render/exemplos/exemplo-formato-A.json
    python agents/render/render.py spec.json --saida output/carrosseis/meu-post

Formatos: A (post sobre foto real), B (editorial com números), C (photo dump), D (frase com rabisco).
Marcações no texto: **negrito**  __sublinhado à mão__  ((círculo à mão))
Esquema completo da especificação: agents/03-agente-visual.md
"""

import argparse
import asyncio
import html
import json
import re
import sys
from pathlib import Path

from playwright.async_api import async_playwright

W, H = 1080, 1350
FONTS = Path(__file__).parent / "fonts"
CHROMIUM = "/opt/pw-browsers/chromium"  # ambiente Claude Code na web; em outra máquina, deixe o Playwright achar o próprio


def markup(text: str) -> str:
    t = html.escape(text).replace("\n", "<br>")
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"__(.+?)__", r'<span class="ul">\1</span>', t)
    t = re.sub(r"\(\((.+?)\)\)", r'<span class="circ">\1</span>', t)
    return t


def photo_css(slide: dict, base: Path) -> str:
    foto = slide.get("foto")
    if foto and (base / foto).exists():
        return f"background-image:url('{(base / foto).resolve().as_uri()}')"
    return "background:linear-gradient(135deg,#2b2b2b,#555)"


def placeholder(slide: dict, base: Path) -> str:
    foto = slide.get("foto")
    if foto and (base / foto).exists():
        return ""
    desc = html.escape(slide.get("foto_descricao") or foto or "foto")
    return f'<div class="ph">📷 FOTO: {desc}</div>'


def styles(brand: dict) -> str:
    accent = brand.get("cor_destaque", "#E3262E")
    enc = accent.replace("#", "%23")
    underline = (
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'>"
        f"<path d='M2 8 C 40 4, 80 11, 120 6 S 180 4, 198 7' stroke='{enc}' stroke-width='3.2' fill='none' stroke-linecap='round'/></svg>"
    )
    circle = (
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80' preserveAspectRatio='none'>"
        f"<path d='M20 45 C 15 15, 170 5, 190 35 S 120 78, 40 70 S 5 40, 60 18' stroke='{enc}' stroke-width='3' fill='none' stroke-linecap='round'/></svg>"
    )
    return f"""
@font-face{{font-family:Inter;font-weight:100 900;src:url('{(FONTS/'Inter-variable.woff2').as_uri()}') format('woff2')}}
@font-face{{font-family:Caveat;font-weight:600;src:url('{(FONTS/'Caveat-600.woff2').as_uri()}') format('woff2')}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:{W}px;height:{H}px;overflow:hidden;font-family:Inter,sans-serif;background:#000;color:#fff}}
.s{{position:relative;width:{W}px;height:{H}px;overflow:hidden}}
b{{font-weight:800}}
.ul{{background:url("{underline}") no-repeat left 100%/100% 0.32em;padding-bottom:0.12em}}
.circ{{position:relative;white-space:nowrap}}
.circ::after{{content:"";position:absolute;left:-0.35em;right:-0.35em;top:-0.25em;bottom:-0.3em;background:url("{circle}") no-repeat center/100% 100%}}
.accent{{color:{accent}}}
.ph{{position:absolute;top:24px;left:24px;right:24px;font:600 26px Inter;color:#ddd;background:rgba(0,0,0,.45);padding:14px 18px;border:2px dashed #aaa;border-radius:12px}}
.photo{{position:absolute;inset:0;background-size:cover;background-position:center}}
/* A */
.a-photo{{position:absolute;left:0;right:0;top:0;height:800px;background-size:cover;background-position:center top}}
.a-fade{{position:absolute;left:0;right:0;top:520px;height:300px;background:linear-gradient(transparent,#000)}}
.a-box{{position:absolute;left:64px;right:64px;bottom:120px}}
.a-head{{display:flex;align-items:center;gap:18px;margin-bottom:34px}}
.a-av{{width:68px;height:68px;border-radius:50%;background:#444 center/cover;border:2px solid #222}}
.a-h1{{font:700 26px Inter}} .a-h2{{font:400 24px Inter;color:#bbb}}
.a-dots{{margin-left:auto;color:#999;font-size:34px;letter-spacing:2px}}
.a-txt{{font:400 54px/1.2 Inter;letter-spacing:-0.5px}}
.a-only{{position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%);font:400 78px/1.15 Inter;letter-spacing:-1px}}
.arrow{{position:absolute;right:70px;bottom:70px;width:120px;height:3px;background:{accent}}}
.arrow::after{{content:"";position:absolute;right:-2px;top:-9px;border-left:18px solid {accent};border-top:10px solid transparent;border-bottom:10px solid transparent}}
.a-cta{{position:absolute;left:64px;right:64px;bottom:110px;font:400 56px/1.2 Inter;text-shadow:0 2px 18px rgba(0,0,0,.6)}}
.shade{{position:absolute;inset:0;background:linear-gradient(transparent 35%,rgba(0,0,0,.85))}}
/* B */
.b-white{{background:#fff;color:#111}}
.b-cap-txt{{position:absolute;left:64px;right:64px;bottom:110px}}
.b-title{{font:800 70px/1.08 Inter;letter-spacing:-1.5px;margin-bottom:26px}}
.b-sub{{font:400 36px/1.3 Inter;opacity:.92}}
.b-num{{position:absolute;left:30px;top:50%;transform:translateY(-52%);font:900 620px/1 Inter;color:{accent};letter-spacing:-30px}}
.b-col{{position:absolute;left:470px;right:70px;top:50%;transform:translateY(-50%)}}
.b-col h2{{font:800 50px/1.12 Inter;margin-bottom:28px;letter-spacing:-0.5px}}
.b-col p{{font:400 34px/1.35 Inter;margin-bottom:22px}}
.b-body{{position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%)}}
.b-body h2{{font:800 62px/1.1 Inter;margin-bottom:34px;letter-spacing:-1px}}
.b-body p{{font:400 38px/1.35 Inter;margin-bottom:24px}}
.b-cta{{position:absolute;left:90px;right:90px;top:50%;transform:translateY(-50%);text-align:center}}
.b-cta h2{{font:800 60px/1.15 Inter;margin-bottom:50px}}
.b-btn{{display:inline-block;background:{accent};color:#fff;font:600 38px/1.3 Inter;padding:30px 44px;border-radius:18px}}
/* C */
.c-dark{{position:absolute;inset:0;background:rgba(0,0,0,.28)}}
.c-txt{{position:absolute;left:90px;right:90px;top:50%;transform:translateY(-50%);text-align:center;font:700 46px/1.22 Inter;text-shadow:0 2px 10px rgba(0,0,0,.8)}}
.c-txt.baixo{{top:auto;bottom:260px;transform:none}}
/* D */
.d-txt{{position:absolute;left:80px;right:80px;top:40%;transform:translateY(-50%);text-align:center;font:800 82px/1.15 Inter;letter-spacing:-1.5px}}
.d-note{{position:absolute;right:90px;top:250px;font:600 44px/1 Caveat;color:{accent};transform:rotate(-12deg);text-align:center}}
.d-handle{{position:absolute;left:0;right:0;bottom:120px;text-align:center;font:400 26px Inter;color:#666}}
.count{{position:absolute;right:64px;top:52px;font:500 24px Inter;color:#888}}
"""


def slide_html(fmt: str, s: dict, i: int, n: int, brand: dict, base: Path) -> str:
    t = s.get("tipo")
    txt = markup(s.get("texto", ""))
    av = brand.get("avatar")
    av_css = f"background-image:url('{(base / av).resolve().as_uri()}')" if av and (base / av).exists() else ""
    head = (f'<div class="a-head"><div class="a-av" style="{av_css}"></div><div>'
            f'<div class="a-h1">@{html.escape(brand.get("handle", "seuperfil"))}</div>'
            f'<div class="a-h2">{html.escape(brand.get("nome", "Seu Nome"))}</div></div><div class="a-dots">···</div></div>')
    arrow = '<div class="arrow"></div>' if i == 0 else ""
    count = f'<div class="count">{i + 1}/{n}</div>' if brand.get("contador") else ""

    if fmt == "A":
        if t == "texto":
            return f'<div class="s"><div class="a-only">{txt}</div>{arrow}{count}</div>'
        if t == "cta":
            return (f'<div class="s"><div class="photo" style="{photo_css(s, base)}"></div><div class="shade"></div>'
                    f'{placeholder(s, base)}<div class="a-cta">{txt}</div>{count}</div>')
        return (f'<div class="s"><div class="a-photo" style="{photo_css(s, base)}"></div><div class="a-fade"></div>'
                f'{placeholder(s, base)}<div class="a-box">{head}<div class="a-txt">{txt}</div></div>{arrow}{count}</div>')

    if fmt == "B":
        claro = " b-white" if s.get("fundo") == "claro" else ""
        if t == "capa":
            return (f'<div class="s"><div class="photo" style="{photo_css(s, base)}"></div><div class="shade"></div>{placeholder(s, base)}'
                    f'<div class="b-cap-txt"><div class="b-title">{markup(s.get("titulo", ""))}</div>'
                    f'<div class="b-sub">{txt}</div></div>{arrow}{count}</div>')
        if t == "numero":
            ps = "".join(f"<p>{markup(p)}</p>" for p in s.get("texto", "").split("\n\n"))
            return (f'<div class="s{claro}"><div class="b-num">{html.escape(str(s.get("numero", i)))}</div>'
                    f'<div class="b-col"><h2>{markup(s.get("titulo", ""))}</h2>{ps}</div>{count}</div>')
        if t == "cta_botao":
            return (f'<div class="s{claro}"><div class="b-cta"><h2>{markup(s.get("titulo", ""))}</h2>'
                    f'<div class="b-btn">{txt}</div></div>{count}</div>')
        ps = "".join(f"<p>{markup(p)}</p>" for p in s.get("texto", "").split("\n\n"))
        return f'<div class="s{claro}"><div class="b-body"><h2>{markup(s.get("titulo", ""))}</h2>{ps}</div>{count}</div>'

    if fmt == "C":
        pos = " baixo" if s.get("posicao") == "baixo" else ""
        return (f'<div class="s"><div class="photo" style="{photo_css(s, base)}"></div><div class="c-dark"></div>'
                f'{placeholder(s, base)}<div class="c-txt{pos}">{txt}</div></div>')

    if fmt == "D":
        nota = f'<div class="d-note">{html.escape(s.get("nota", ""))}</div>' if s.get("nota") else ""
        return (f'<div class="s">{nota}<div class="d-txt">{txt}</div>'
                f'<div class="d-handle">@{html.escape(brand.get("handle", "seuperfil"))}</div></div>')

    raise ValueError(f"Formato desconhecido: {fmt}")


async def render(spec_path: Path, out_dir: Path) -> list[Path]:
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    base = spec_path.parent
    fmt, brand, slides = spec["formato"], spec.get("marca", {}), spec["slides"]
    out_dir.mkdir(parents=True, exist_ok=True)
    css = styles(brand)
    files = []
    async with async_playwright() as p:
        kw = {"executable_path": CHROMIUM} if Path(CHROMIUM).exists() else {}
        browser = await p.chromium.launch(**kw)
        page = await browser.new_page(viewport={"width": W, "height": H})
        for i, s in enumerate(slides):
            doc = f"<html><head><meta charset='utf-8'><style>{css}</style></head><body>{slide_html(fmt, s, i, len(slides), brand, base)}</body></html>"
            tmp = out_dir / f".slide_{i}.html"
            tmp.write_text(doc, encoding="utf-8")
            await page.goto(tmp.as_uri())
            await page.evaluate("document.fonts.ready")
            f = out_dir / f"{i + 1:02d}.png"
            await page.screenshot(path=str(f))
            tmp.unlink()
            files.append(f)
        await browser.close()
    return files


def main() -> None:
    ap = argparse.ArgumentParser(description="Renderiza carrossel a partir de JSON.")
    ap.add_argument("spec")
    ap.add_argument("--saida", help="pasta de saída (padrão: output/carrosseis/<nome do json>)")
    a = ap.parse_args()
    spec = Path(a.spec)
    out = Path(a.saida) if a.saida else Path("output/carrosseis") / spec.stem
    files = asyncio.run(render(spec, out))
    print(f"{len(files)} slides em {out}/", file=sys.stderr)


if __name__ == "__main__":
    main()
