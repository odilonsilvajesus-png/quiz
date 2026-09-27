#!/usr/bin/env python3
"""Renderiza carrosséis (1080x1350) a partir de uma especificação JSON gerada pelo Agente Visual.

Uso:
    python agents/render/render.py agents/render/exemplos/exemplo-formato-A.json
    python agents/render/render.py spec.json --saida output/carrosseis/meu-post

Formatos: A (post sobre foto real), B (editorial com números), C (photo dump), D (frase com rabisco).
Marcações no texto: **negrito**  __sublinhado à mão__  ((círculo à mão))

Bloco "marca" (tudo opcional; a marca oficial fica em agents/marca-sic.json e é carregada com
"marca": {"arquivo": "caminho/para/marca-sic.json"}):
  cores:  cor_acao (CTA, botão, seta, círculo), cor_sublinhado, cor_numeros, cor_nota,
          cor_fundo_escuro, cor_fundo_claro, cor_texto_escuro, cor_texto_claro, cor_titulo_claro,
          cor_texto_botao, cor_selo_fundo, cor_sublinhado_claro, cor_numeros_claro (versões para fundo claro)
          (cor_destaque, se presente, é o padrão de ação/sublinhado/números/nota)
  fontes: {"titulo": "Source Serif 4", "texto": "Poppins", "peso_titulo": 700}
          disponíveis: Inter, Poppins, Montserrat, Source Serif 4, DM Serif Display
  estilo: {"degrade": true, "cantos_retos": false, "sombra_texto": true, "selo": "", "ponto_final": false}
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

FONT_FILES = {
    "Inter": [("Inter-variable.woff2", "100 900")],
    "Poppins": [("Poppins-400.woff2", "400"), ("Poppins-500.woff2", "500"),
                ("Poppins-600.woff2", "600"), ("Poppins-700.woff2", "700")],
    "Montserrat": [("Montserrat-variable.woff2", "100 900")],
    "Source Serif 4": [("SourceSerif4-variable.woff2", "200 900")],
    "DM Serif Display": [("DMSerifDisplay-400.woff2", "400")],
    "Caveat": [("Caveat-600.woff2", "600")],
}


def markup(text: str) -> str:
    t = html.escape(text).replace("\n", "<br>")
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"__(.+?)__", r'<span class="ul">\1</span>', t)
    t = re.sub(r"\(\((.+?)\)\)", r'<span class="circ">\1</span>', t)
    return t


def with_pf(text: str, on: bool) -> str:
    """Ponto final da marca: substitui o '.' final; não entra depois de '?', '!' ou ':'."""
    if not on:
        return markup(text)
    t = text.rstrip()
    if t.endswith("?") or t.endswith("!") or t.endswith(":"):
        return markup(t)
    if t.endswith("."):
        t = t[:-1]
    m = re.search(r"(\*\*|__|\)\))$", t)  # ponto dentro de marcação: "__palavra.__"
    if m and t[: m.start()].endswith("."):
        t = t[: m.start() - 1] + m.group(1)
    return markup(t) + '<span class="pf"></span>'


def photo_css(slide: dict, base: Path) -> str:
    foto = slide.get("foto")
    if foto and (base / foto).exists():
        return f"background-image:url('{(base / foto).resolve().as_uri()}')"
    return "background:linear-gradient(135deg,#3a3440,#6a6270)"


def placeholder(slide: dict, base: Path) -> str:
    foto = slide.get("foto")
    if foto and (base / foto).exists():
        return ""
    desc = html.escape(slide.get("foto_descricao") or foto or "foto")
    return f'<div class="ph">FOTO: {desc}</div>'


def font_faces(families: set[str]) -> str:
    out = []
    for fam in families:
        for fn, weight in FONT_FILES.get(fam, []):
            out.append(f"@font-face{{font-family:'{fam}';font-weight:{weight};src:url('{(FONTS / fn).as_uri()}') format('woff2')}}")
    return "\n".join(out)


def svg(path_d: str, color: str, vb: str, width: float) -> str:
    c = color.replace("#", "%23")
    return (f"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='{vb}' preserveAspectRatio='none'>"
            f"<path d='{path_d}' stroke='{c}' stroke-width='{width}' fill='none' stroke-linecap='round'/></svg>")


def styles(brand: dict) -> str:
    base_accent = brand.get("cor_destaque", "#E3262E")
    acao = brand.get("cor_acao", base_accent)
    sub = brand.get("cor_sublinhado", base_accent)
    nums = brand.get("cor_numeros", base_accent)
    nota = brand.get("cor_nota", brand.get("cor_secundaria", base_accent))
    dark = brand.get("cor_fundo_escuro", "#000000")
    light = brand.get("cor_fundo_claro", "#FFFFFF")
    t_dark = brand.get("cor_texto_escuro", "#FFFFFF")
    t_light = brand.get("cor_texto_claro", "#111111")
    h_light = brand.get("cor_titulo_claro", t_light)
    on_acao = brand.get("cor_texto_botao", "#FFFFFF")
    selo_bg = brand.get("cor_selo_fundo", dark)
    sub_l = brand.get("cor_sublinhado_claro", sub)
    nums_l = brand.get("cor_numeros_claro", nums)

    fontes = brand.get("fontes", {})
    ft = fontes.get("titulo", "Inter")
    fx = fontes.get("texto", "Inter")
    wt = fontes.get("peso_titulo", 800)
    est = {"degrade": True, "cantos_retos": False, "sombra_texto": True, "selo": "", "ponto_final": False}
    est.update(brand.get("estilo", {}))
    r = 0 if est["cantos_retos"] else 18
    av_r = "0" if est["cantos_retos"] else "50%"
    shadow = "0 2px 10px rgba(0,0,0,.8)" if est["sombra_texto"] else "none"

    underline = svg("M2 8 C 40 4, 80 11, 120 6 S 180 4, 198 7", sub, "0 0 200 12", 3.2)
    underline_l = svg("M2 8 C 40 4, 80 11, 120 6 S 180 4, 198 7", sub_l, "0 0 200 12", 3.2)
    circle = svg("M20 45 C 15 15, 170 5, 190 35 S 120 78, 40 70 S 5 40, 60 18", acao, "0 0 200 80", 3)

    if est["degrade"]:
        a_photo_h = 800
        a_fade = f".a-fade{{position:absolute;left:0;right:0;top:520px;height:300px;background:linear-gradient(transparent,{dark})}}"
        full_photo = ".fullph{position:absolute;inset:0;background-size:cover;background-position:center}"
        shade = f".shade{{position:absolute;inset:0;background:linear-gradient(transparent 35%,{dark}d9)}}"
        c_blk = ""
        c_dim = 0.28
    else:  # blocos sólidos: foto com corte seco e bloco de cor, sem degradê
        a_photo_h = 720
        a_fade = ".a-fade{display:none}"
        full_photo = ".fullph{position:absolute;left:0;right:0;top:0;height:760px;background-size:cover;background-position:center}"
        shade = ".shade{display:none}"
        c_blk = f"background:{dark};padding:24px 32px;display:inline-block;"
        c_dim = 0.0

    return f"""
{font_faces({ft, fx, "Caveat"})}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:{W}px;height:{H}px;overflow:hidden;font-family:'{fx}',sans-serif;background:{dark};color:{t_dark}}}
.s{{position:relative;width:{W}px;height:{H}px;overflow:hidden;background:{dark}}}
b{{font-weight:700}}
.T{{font-family:'{ft}',serif;font-weight:{wt}}}
.ul{{background:url("{underline}") no-repeat left 100%/100% 0.32em;padding-bottom:0.12em}}
.circ{{position:relative;white-space:nowrap}}
.circ::after{{content:"";position:absolute;left:-0.35em;right:-0.35em;top:-0.25em;bottom:-0.3em;background:url("{circle}") no-repeat center/100% 100%}}
.pf{{display:inline-block;width:0.2em;height:0.2em;background:{acao};margin-left:0.06em}}
.selo{{position:absolute;right:56px;top:48px;background:{selo_bg};color:{acao};font:500 24px '{fx}';letter-spacing:8px;padding:12px 10px 12px 18px;z-index:5}}
.ph{{position:absolute;top:24px;left:24px;right:170px;font:600 24px '{fx}';color:#eee;background:rgba(0,0,0,.45);padding:14px 18px;border:2px dashed #bbb;border-radius:{r}px;z-index:4}}
.photo{{position:absolute;inset:0;background-size:cover;background-position:center}}
{full_photo}
{shade}
/* A */
.a-photo{{position:absolute;left:0;right:0;top:0;height:{a_photo_h}px;background-size:cover;background-position:center top}}
{a_fade}
.a-box{{position:absolute;left:64px;right:64px;bottom:120px}}
.a-head{{display:flex;align-items:center;gap:18px;margin-bottom:34px}}
.a-av{{width:68px;height:68px;border-radius:{av_r};background:#555 center/cover}}
.a-h1{{font:600 26px '{fx}'}} .a-h2{{font:400 24px '{fx}';opacity:.7}}
.a-dots{{margin-left:auto;opacity:.6;font-size:34px;letter-spacing:2px}}
.a-txt{{font:400 50px/1.25 '{fx}';letter-spacing:-0.3px}}
.a-only{{position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%);font-size:80px;line-height:1.12;letter-spacing:-0.5px}}
.arrow{{position:absolute;right:70px;bottom:70px;width:120px;height:3px;background:{acao}}}
.arrow::after{{content:"";position:absolute;right:-2px;top:-9px;border-left:18px solid {acao};border-top:10px solid transparent;border-bottom:10px solid transparent}}
.a-cta{{position:absolute;left:64px;right:64px;bottom:110px;font:400 54px/1.22 '{fx}';text-shadow:{shadow}}}
/* B */
.b-white{{background:{light};color:{t_light}}}
.b-white .T{{color:{h_light}}}
.b-white .ul{{background-image:url("{underline_l}")}}
.b-white .b-num{{color:{nums_l}}}
.b-cap-txt{{position:absolute;left:64px;right:64px;bottom:110px}}
.b-title{{font-size:74px;line-height:1.06;letter-spacing:-1px;margin-bottom:26px}}
.b-sub{{font:400 34px/1.35 '{fx}';opacity:.92}}
.b-num{{position:absolute;left:30px;top:50%;transform:translateY(-52%);font-size:600px;line-height:1;color:{nums};letter-spacing:-20px}}
.b-col{{position:absolute;left:470px;right:70px;top:50%;transform:translateY(-50%)}}
.b-col h2{{font-size:52px;line-height:1.1;margin-bottom:28px}}
.b-col p{{font:400 32px/1.4 '{fx}';margin-bottom:22px}}
.b-body{{position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%)}}
.b-body h2{{font-size:66px;line-height:1.08;margin-bottom:34px}}
.b-body p{{font:400 36px/1.4 '{fx}';margin-bottom:24px}}
.b-cta{{position:absolute;left:90px;right:90px;top:50%;transform:translateY(-50%);text-align:center}}
.b-cta h2{{font-size:62px;line-height:1.12;margin-bottom:50px}}
.b-btn{{display:inline-block;background:{acao};color:{on_acao};font:600 36px/1.3 '{fx}';padding:30px 44px;border-radius:{r}px}}
/* C */
.c-dark{{position:absolute;inset:0;background:rgba(0,0,0,{c_dim})}}
.c-txt{{position:absolute;left:90px;right:90px;top:50%;transform:translateY(-50%);text-align:center;font:600 44px/1.25 '{fx}';text-shadow:{shadow}}}
.c-txt .blk{{{c_blk}}}
.c-txt.baixo{{top:auto;bottom:220px;transform:none}}
/* D */
.d-txt{{position:absolute;left:80px;right:80px;top:42%;transform:translateY(-50%);text-align:center;font-size:84px;line-height:1.12;letter-spacing:-0.5px}}
.d-note{{position:absolute;right:90px;top:250px;font:600 44px/1 Caveat;color:{nota};transform:rotate(-12deg);text-align:center}}
.d-handle{{position:absolute;left:0;right:0;bottom:120px;text-align:center;font:400 26px '{fx}';opacity:.55}}
.count{{position:absolute;left:64px;bottom:44px;font:500 22px '{fx}';opacity:.55}}
"""


def slide_html(fmt: str, s: dict, i: int, n: int, brand: dict, base: Path) -> str:
    t = s.get("tipo")
    est = brand.get("estilo", {})
    pf_on = bool(est.get("ponto_final"))
    txt = markup(s.get("texto", ""))
    av = brand.get("avatar")
    av_css = f"background-image:url('{(base / av).resolve().as_uri()}')" if av and (base / av).exists() else ""
    head = (f'<div class="a-head"><div class="a-av" style="{av_css}"></div><div>'
            f'<div class="a-h1">@{html.escape(brand.get("handle", "seuperfil"))}</div>'
            f'<div class="a-h2">{html.escape(brand.get("nome", "Seu Nome"))}</div></div><div class="a-dots">···</div></div>')
    arrow = '<div class="arrow"></div>' if i == 0 else ""
    count = f'<div class="count">{i + 1}/{n}</div>' if brand.get("contador") else ""
    selo = f'<div class="selo">{html.escape(est["selo"])}</div>' if est.get("selo") else ""

    if fmt == "A":
        if t == "texto":
            return f'<div class="s"><div class="a-only T">{txt}</div>{count}{selo}</div>'
        if t == "cta":
            return (f'<div class="s"><div class="fullph" style="{photo_css(s, base)}"></div><div class="shade"></div>'
                    f'{placeholder(s, base)}<div class="a-cta">{txt}</div>{count}{selo}</div>')
        return (f'<div class="s"><div class="a-photo" style="{photo_css(s, base)}"></div><div class="a-fade"></div>'
                f'{placeholder(s, base)}<div class="a-box">{head}<div class="a-txt">{txt}</div></div>{arrow}{count}{selo}</div>')

    if fmt == "B":
        claro = " b-white" if s.get("fundo") == "claro" else ""
        ps = "".join(f"<p>{markup(p)}</p>" for p in s.get("texto", "").split("\n\n"))
        if t == "capa":
            return (f'<div class="s"><div class="fullph" style="{photo_css(s, base)}"></div><div class="shade"></div>{placeholder(s, base)}'
                    f'<div class="b-cap-txt"><div class="b-title T">{with_pf(s.get("titulo", ""), pf_on)}</div>'
                    f'<div class="b-sub">{txt}</div></div>{arrow}{count}{selo}</div>')
        if t == "numero":
            return (f'<div class="s{claro}"><div class="b-num T">{html.escape(str(s.get("numero", i)))}</div>'
                    f'<div class="b-col"><h2 class="T">{markup(s.get("titulo", ""))}</h2>{ps}</div>{count}{selo}</div>')
        if t == "cta_botao":
            return (f'<div class="s{claro}"><div class="b-cta"><h2 class="T">{markup(s.get("titulo", ""))}</h2>'
                    f'<div class="b-btn">{txt}</div></div>{count}{selo}</div>')
        return (f'<div class="s{claro}"><div class="b-body"><h2 class="T">{with_pf(s.get("titulo", ""), pf_on)}</h2>{ps}</div>'
                f'{count}{selo}</div>')

    if fmt == "C":
        pos = " baixo" if s.get("posicao") == "baixo" else ""
        return (f'<div class="s"><div class="photo" style="{photo_css(s, base)}"></div><div class="c-dark"></div>'
                f'{placeholder(s, base)}<div class="c-txt{pos}"><span class="blk">{txt}</span></div>{selo}</div>')

    if fmt == "D":
        nota = f'<div class="d-note">{html.escape(s.get("nota", ""))}</div>' if s.get("nota") else ""
        return (f'<div class="s">{nota}<div class="d-txt T">{with_pf(s.get("texto", ""), pf_on)}</div>'
                f'<div class="d-handle">@{html.escape(brand.get("handle", "seuperfil"))}</div>{selo}</div>')

    raise ValueError(f"Formato desconhecido: {fmt}")


def load_brand(spec: dict, base: Path) -> dict:
    """A marca pode vir inline ou de arquivo: "marca": {"arquivo": "../../marca-sic.json", ...sobrescritas}."""
    brand = dict(spec.get("marca", {}))
    ref = brand.pop("arquivo", None)
    if ref:
        ref_path = base / ref
        loaded = json.loads(ref_path.read_text(encoding="utf-8"))
        if loaded.get("avatar"):
            loaded["avatar"] = str((ref_path.parent / loaded["avatar"]).resolve())
        loaded.update(brand)
        brand = loaded
    return brand


async def render(spec_path: Path, out_dir: Path) -> list[Path]:
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    base = spec_path.parent
    fmt, slides = spec["formato"], spec["slides"]
    brand = load_brand(spec, base)
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
