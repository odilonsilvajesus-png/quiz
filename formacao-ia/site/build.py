"""Gera o site de estudo (index.html) a partir dos arquivos .md da formação.

Uso: python3 formacao-ia/site/build.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent / "index.html"
TEMPLATE = Path(__file__).resolve().parent / "template.html"

# Ordem de estudo (a mesma do cronograma do README)
GROUPS = [
    ("Fase 1 · Fundamentos", ["modulo-01-fundamentos.md", "modulo-02-engenharia-de-prompt.md"]),
    ("Fase 2 · Diagnóstico e estratégia", ["modulo-03-diagnostico-e-oportunidades.md", "modulo-10-governanca-roi-e-mudanca.md"]),
    ("Fase 3 · Implementação", ["modulo-04-ferramentas.md", "modulo-05-automacao.md",
                                "modulo-06-atendimento-e-vendas.md", "modulo-07-marketing-e-conteudo.md"]),
    ("Fase 4 · Construção", ["modulo-08-dados-e-rag.md", "modulo-09-agentes-e-arquitetura.md"]),
    ("Fase 5 · Autoridade", ["trilha-palestras-e-autoridade.md", "projeto-final.md"]),
]
GUIDE = "README.md"
TEMPLATES = [
    "roteiro-entrevista-diagnostico.md", "relatorio-diagnostico.md", "calculadora-roi.md",
    "proposta-comercial.md", "ficha-de-automacao.md", "caso-de-estudo.md",
    "documento-de-arquitetura.md", "politica-de-uso-de-ia.md", "roteiro-de-palestra.md",
]
SHORT = {
    "modulo-01-fundamentos.md": "M1", "modulo-02-engenharia-de-prompt.md": "M2",
    "modulo-03-diagnostico-e-oportunidades.md": "M3", "modulo-04-ferramentas.md": "M4",
    "modulo-05-automacao.md": "M5", "modulo-06-atendimento-e-vendas.md": "M6",
    "modulo-07-marketing-e-conteudo.md": "M7", "modulo-08-dados-e-rag.md": "M8",
    "modulo-09-agentes-e-arquitetura.md": "M9", "modulo-10-governanca-roi-e-mudanca.md": "M10",
    "trilha-palestras-e-autoridade.md": "Trilha", "projeto-final.md": "Final",
}


def words(text):
    return len(re.findall(r"\w+", text))


def parse_doc(text):
    """Separa título (h1), linha de carga horária e corpo."""
    lines = text.strip("\n").split("\n")
    title = lines[0].lstrip("# ").strip()
    body = lines[1:]
    meta = ""
    for i, ln in enumerate(body[:6]):
        m = re.fullmatch(r"\*\*(.+)\*\*", ln.strip())
        if m:
            meta = m.group(1)
            body = body[:i] + body[i + 1:]
            break
    return title, meta, body


def split_lessons(body):
    """Divide o corpo em lições nos títulos '## ' (e '# ' internos), ignorando blocos de código."""
    sections, cur_title, cur, fence, prefix = [], "Visão geral e objetivos", [], False, ""
    for ln in body:
        if ln.strip().startswith("```"):
            fence = not fence
        if not fence and (ln.startswith("## ") or ln.startswith("# ")):
            sections.append((cur_title, cur))
            text = ln.lstrip("# ").strip()
            if ln.startswith("# "):
                part = text.split(":")[0].strip().title()
                prefix = part + " · "
                cur_title, cur = text, []
            else:
                text = re.sub(r"\s*\(Partes? [A-Z](?: e [A-Z])?\)", "", text)
                cur_title, cur = prefix + text, []
            continue
        cur.append(ln)
    sections.append((cur_title, cur))
    out = []
    for t, ls in sections:
        md = "\n".join(ls).strip()
        if re.sub(r"[-\s]", "", md) == "":
            continue
        md = re.sub(r"\n-{3,}\s*$", "", md).strip()
        out.append((t, md))
    return out


def module_entry(fname, group):
    text = (ROOT / fname).read_text(encoding="utf-8")
    title, meta, body = parse_doc(text)
    mid = re.sub(r"[^a-z0-9]", "", SHORT.get(fname, fname).lower())
    sections = split_lessons(body)
    # Introduções curtas viram o início da primeira aula
    if len(sections) > 1 and sections[0][0] == "Visão geral e objetivos" and words(sections[0][1]) < 40:
        sections[1] = (sections[1][0], sections[0][1] + "\n\n" + sections[1][1])
        sections = sections[1:]
    lessons = []
    for i, (t, md) in enumerate(sections):
        lessons.append({"id": f"{mid}-{i + 1}", "title": t, "md": md, "words": words(md)})
    return {"id": mid, "file": fname, "short": SHORT.get(fname, ""), "title": title,
            "meta": meta, "group": group, "lessons": lessons}


def single_entry(path, mid, group, short):
    text = path.read_text(encoding="utf-8")
    title, meta, body = parse_doc(text)
    md = "\n".join(body).strip()
    return {"id": mid, "file": path.name, "short": short, "title": title, "meta": meta,
            "group": group, "lessons": [{"id": f"{mid}-1", "title": title, "md": md, "words": words(md)}]}


def main():
    modules = [single_entry(ROOT / GUIDE, "guia", "Comece aqui", "Guia")]
    modules[0]["lessons"][0]["title"] = "Guia da formação e cronograma"
    for group, files in GROUPS:
        for f in files:
            modules.append(module_entry(f, group))
    tpl_lessons = []
    for f in TEMPLATES:
        path = ROOT / "templates" / f
        title, _, body = parse_doc(path.read_text(encoding="utf-8"))
        md = "\n".join(body).strip()
        tpl_lessons.append({"id": "modelo-" + f[:-3], "title": title, "md": md, "words": words(md),
                            "file": "templates/" + f, "template": True})
    modules.append({"id": "modelos", "file": "templates/", "short": "Modelos", "title": "Modelos prontos",
                    "meta": "Use nos entregáveis de cada módulo", "group": "Referência", "lessons": tpl_lessons})

    data = json.dumps({"modules": modules}, ensure_ascii=False).replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf-8").replace("/*__DATA__*/null", data)
    OUT.write_text(html, encoding="utf-8")
    n = sum(len(m["lessons"]) for m in modules)
    print(f"{OUT} gerado: {len(modules)} seções, {n} lições, {len(html) // 1024} KB")


if __name__ == "__main__":
    main()
