"""Gera o site de estudo (um único index.html) a partir dos arquivos .md de uma formação.

Uso:
    python3 build_site.py <pasta-da-formacao>

A pasta precisa ter um curso.json (formato abaixo). O site é gravado em
<pasta>/site/index.html, pronto para publicar.

curso.json:
{
  "titulo": "Especialista em Finanças para Pequenos Negócios",   # título da página inicial
  "marca": "Formação Finanças",                                   # nome curto (menu e aba)
  "submarca": "para Pequenos Negócios",                           # complemento do nome curto
  "slug": "financas-pme",                                         # identificador (progresso salvo)
  "eyebrow": "Formação prática · 16 semanas",
  "intro": "Do zero até montar e analisar o financeiro de uma empresa real.",
  "aplicar": "A tarefa prática na empresa-laboratório.",          # passo 3 do 'como estudar'
  "horas": 140,                                                   # carga total (opcional)
  "guia": "README.md",                                            # opcional
  "glossario": "glossario.md",                                    # opcional
  "grupos": [
    {"nome": "Fase 1 · Fundamentos", "modulos": [
      {"arquivo": "modulo-01-fundamentos.md", "sigla": "M1"}
    ]}
  ],
  "modelos": ["templates/planilha-fluxo-de-caixa.md"]             # opcional
}

Convenções dos arquivos de módulo:
- 1ª linha: "# Título do módulo"
- uma linha em negrito logo depois: "**Semanas 1 e 2 · cerca de 18 horas**"
- cada "## " vira uma aula (página) no site; "# " interno (ex.: "# PARTE A: ...") prefixa as aulas seguintes
- blocos ```mermaid viram esquemas visuais
"""
import json
import re
import sys
from pathlib import Path

TEMPLATE = Path(__file__).resolve().parent.parent / "assets" / "template.html"


def words(text):
    return len(re.findall(r"\w+", text))


def parse_doc(text):
    """Separa título (h1), linha de carga horária em negrito e corpo."""
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
    """Divide o corpo em aulas nos títulos '## ' (e '# ' internos), ignorando blocos de código."""
    sections, cur_title, cur, fence, prefix = [], "Visão geral e objetivos", [], False, ""
    for ln in body:
        if ln.strip().startswith("```"):
            fence = not fence
        if not fence and (ln.startswith("## ") or ln.startswith("# ")):
            sections.append((cur_title, cur))
            text = ln.lstrip("# ").strip()
            if ln.startswith("# "):
                prefix = text.split(":")[0].strip().title() + " · "
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
        out.append((t, re.sub(r"\n-{3,}\s*$", "", md).strip()))
    return out


def slugify(s):
    s = s.lower()
    for a, b in zip("áàâãäéèêëíìîïóòôõöúùûüç", "aaaaaeeeeiiiiooooouuuuc"):
        s = s.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-") or "x"


def module_entry(root, arquivo, sigla, group):
    title, meta, body = parse_doc((root / arquivo).read_text(encoding="utf-8"))
    mid = slugify(sigla).replace("-", "")
    sections = split_lessons(body)
    # Introduções curtas viram o início da primeira aula
    if len(sections) > 1 and sections[0][0] == "Visão geral e objetivos" and words(sections[0][1]) < 40:
        sections[1] = (sections[1][0], sections[0][1] + "\n\n" + sections[1][1])
        sections = sections[1:]
    lessons = [{"id": f"{mid}-{i + 1}", "title": t, "md": md, "words": words(md)}
               for i, (t, md) in enumerate(sections)]
    return {"id": mid, "file": Path(arquivo).name, "short": sigla, "title": title,
            "meta": meta, "group": group, "lessons": lessons}


def single_entry(root, arquivo, mid, group, short, title=None):
    t, meta, body = parse_doc((root / arquivo).read_text(encoding="utf-8"))
    md = "\n".join(body).strip()
    return {"id": mid, "file": Path(arquivo).name, "short": short, "title": t, "meta": meta,
            "group": group, "ref": True,
            "lessons": [{"id": f"{mid}-1", "title": title or t, "md": md, "words": words(md)}]}


def main():
    if len(sys.argv) != 2:
        sys.exit("Uso: python3 build_site.py <pasta-da-formacao>")
    root = Path(sys.argv[1]).resolve()
    cfg = json.loads((root / "curso.json").read_text(encoding="utf-8"))

    modules, siglas = [], set()
    if cfg.get("guia"):
        modules.append(single_entry(root, cfg["guia"], "guia", "Comece aqui", "Guia",
                                    "Guia da formação e cronograma"))
    if cfg.get("glossario"):
        modules.append(single_entry(root, cfg["glossario"], "glossario", "Comece aqui", "A–Z"))
    for g in cfg["grupos"]:
        for m in g["modulos"]:
            if m["sigla"] in siglas:
                sys.exit(f"Sigla repetida no curso.json: {m['sigla']}")
            siglas.add(m["sigla"])
            modules.append(module_entry(root, m["arquivo"], m["sigla"], g["nome"]))
    if cfg.get("modelos"):
        tpl = []
        for arq in cfg["modelos"]:
            t, _, body = parse_doc((root / arq).read_text(encoding="utf-8"))
            md = "\n".join(body).strip()
            tpl.append({"id": "modelo-" + slugify(Path(arq).stem), "title": t, "md": md,
                        "words": words(md), "file": arq, "template": True})
        modules.append({"id": "modelos", "file": "templates/", "short": "Modelos",
                        "title": "Modelos prontos", "meta": "Use nos entregáveis de cada módulo",
                        "group": "Referência", "ref": True, "lessons": tpl})

    meta = {k: cfg.get(k) for k in ("titulo", "marca", "submarca", "slug", "eyebrow",
                                     "intro", "aplicar", "horas")}
    meta["slug"] = meta["slug"] or slugify(cfg["titulo"])
    meta["titulo_aba"] = cfg.get("titulo_aba") or cfg["titulo"]
    data = json.dumps({"meta": meta, "modules": modules}, ensure_ascii=False).replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf-8")
    titulo_aba = (meta["titulo_aba"] or "Formação").replace("<", "").replace("&", "e")
    html = html.replace("__TITULO_ABA__", titulo_aba).replace("/*__DATA__*/null", data)

    out = root / "site" / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    n = sum(len(m["lessons"]) for m in modules)
    print(f"{out} gerado: {len(modules)} seções, {n} aulas, {len(html) // 1024} KB")


if __name__ == "__main__":
    main()
