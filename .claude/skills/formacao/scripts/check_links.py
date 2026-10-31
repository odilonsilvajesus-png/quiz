"""Confere os links externos citados nos arquivos .md de uma formação.

Uso:
    python3 check_links.py <pasta-da-formacao>

Para cada link, faz uma requisição (seguindo redirecionamentos) e classifica:
- OK          respondeu 200
- REDIRECIONA respondeu 200 em outro endereço: troque pelo endereço final
- BLOQUEADO   403/400/429/302 para login: comum em sites que bloqueiam robôs
                (Meta, OpenAI, GitHub, Google). Mantenha só se for um endereço
                oficial que você conhece; caso contrário, troque.
- QUEBRADO    404, 410, erro de conexão: troque ou remova

Para vídeos do YouTube, confirma pelo serviço oEmbed, que devolve o título real.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0 Safari/537.36"


def curl(url):
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-L", "--max-time", "20", "-A", UA,
                        "-w", "%{http_code} %{url_effective}", url],
                       capture_output=True, text=True)
    parts = r.stdout.strip().split(" ", 1)
    return (parts[0], parts[1] if len(parts) > 1 else url) if parts and parts[0] else ("000", url)


def youtube_title(url):
    r = subprocess.run(["curl", "-s", "--max-time", "20",
                        f"https://www.youtube.com/oembed?url={url}&format=json"],
                       capture_output=True, text=True)
    try:
        return json.loads(r.stdout).get("title")
    except json.JSONDecodeError:
        return None


def main():
    if len(sys.argv) != 2:
        sys.exit("Uso: python3 check_links.py <pasta-da-formacao>")
    root = Path(sys.argv[1])
    links = {}
    for f in sorted(root.rglob("*.md")):
        for u in re.findall(r"\]\((https?://[^)\s]+)\)", f.read_text(encoding="utf-8")):
            links.setdefault(u, set()).add(f.name)

    resumo = {"OK": 0, "REDIRECIONA": 0, "BLOQUEADO": 0, "QUEBRADO": 0}
    for u in sorted(links):
        onde = ", ".join(sorted(links[u]))
        if "youtube.com/watch" in u or "youtu.be/" in u:
            t = youtube_title(u)
            status = "OK" if t else "QUEBRADO"
            print(f"{status:12} {u}  [{t or 'vídeo não encontrado'}]  ({onde})")
            resumo[status] += 1
            continue
        code, final = curl(u)
        if code == "200" and final.rstrip("/") == u.rstrip("/"):
            status = "OK"
        elif code == "200" and "accounts.google.com" not in final and "login" not in final:
            status = "REDIRECIONA"
        elif code in ("403", "400", "429", "302", "401") or "accounts.google.com" in final:
            status = "BLOQUEADO"
        else:
            status = "QUEBRADO"
        resumo[status] += 1
        extra = f" -> {final}" if status == "REDIRECIONA" else f" ({code})" if status != "OK" else ""
        if status != "OK":
            print(f"{status:12} {u}{extra}  ({onde})")
    print("\nResumo:", ", ".join(f"{k}: {v}" for k, v in resumo.items()), f"| total: {len(links)}")


if __name__ == "__main__":
    main()
