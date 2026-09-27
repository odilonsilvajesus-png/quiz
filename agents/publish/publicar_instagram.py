#!/usr/bin/env python3
"""Publica uma ficha aprovada no Instagram pela Graph API (content publishing).

Por padrão só SIMULA (mostra o que faria). Para publicar de verdade: --publicar

Pré-requisitos:
  - Conta profissional do Instagram ligada a uma Página do Facebook.
  - Variáveis de ambiente: IG_USER_ID e IG_ACCESS_TOKEN (permissão instagram_content_publish).
  - Mídias em URL pública (a API não aceita arquivo local): informe em visual.urls_publicas
    na ficha ou com --urls, na ordem dos slides.

Uso:
  python agents/publish/publicar_instagram.py ficha.json
  python agents/publish/publicar_instagram.py ficha.json --urls https://.../01.png https://.../02.png --publicar
"""

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

API = f"https://graph.facebook.com/{os.environ.get('IG_API_VERSION', 'v21.0')}"


def call(method: str, path: str, **params) -> dict:
    params["access_token"] = os.environ["IG_ACCESS_TOKEN"]
    data = urllib.parse.urlencode(params).encode()
    if method == "GET":
        req = urllib.request.Request(f"{API}/{path}?{data.decode()}")
    else:
        req = urllib.request.Request(f"{API}/{path}", data=data, method="POST")
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.load(resp)


def wait_ready(container_id: str, tries: int = 30) -> None:
    for _ in range(tries):
        status = call("GET", container_id, fields="status_code").get("status_code")
        if status == "FINISHED":
            return
        if status == "ERROR":
            sys.exit(f"Contêiner {container_id} com erro no processamento.")
        time.sleep(10)
    sys.exit(f"Contêiner {container_id} não ficou pronto a tempo.")


def main() -> None:
    ap = argparse.ArgumentParser(description="Publica ficha aprovada no Instagram.")
    ap.add_argument("ficha")
    ap.add_argument("--urls", nargs="*", help="URLs públicas das mídias, na ordem")
    ap.add_argument("--publicar", action="store_true", help="publica de verdade (sem isso, só simula)")
    a = ap.parse_args()

    path = Path(a.ficha)
    ficha = json.loads(path.read_text(encoding="utf-8"))
    rev, pub = ficha.get("revisao", {}), ficha.setdefault("publicacao", {})
    if rev.get("veredito") not in ("aprovado", "aprovado_com_ressalvas"):
        sys.exit("Bloqueado: a ficha não foi aprovada pelo Revisor.")
    if pub.get("aprovacao_humana") is not True:
        sys.exit("Bloqueado: falta publicacao.aprovacao_humana = true.")

    urls = a.urls or ficha.get("visual", {}).get("urls_publicas") or []
    if not urls:
        sys.exit("Informe as URLs públicas das mídias (--urls ou visual.urls_publicas).")
    caption = ficha.get("texto", {}).get("legenda", "")
    tipo = ficha["pauta"]["tipo"]

    plano = {"tipo": tipo, "midias": urls, "legenda": caption[:120] + ("…" if len(caption) > 120 else "")}
    print(json.dumps(plano, ensure_ascii=False, indent=2))
    if not a.publicar:
        print("\nSIMULAÇÃO: nada foi publicado. Use --publicar para publicar.", file=sys.stderr)
        return

    ig = os.environ["IG_USER_ID"]
    if tipo == "reel":
        cid = call("POST", f"{ig}/media", media_type="REELS", video_url=urls[0], caption=caption)["id"]
        wait_ready(cid)
    elif len(urls) == 1:
        cid = call("POST", f"{ig}/media", image_url=urls[0], caption=caption)["id"]
    else:
        children = [call("POST", f"{ig}/media", image_url=u, is_carousel_item="true")["id"] for u in urls[:10]]
        cid = call("POST", f"{ig}/media", media_type="CAROUSEL", children=",".join(children), caption=caption)["id"]
        wait_ready(cid)
    media_id = call("POST", f"{ig}/media_publish", creation_id=cid)["id"]
    link = call("GET", media_id, fields="permalink").get("permalink", "")

    pub.update({"canal": "api_instagram", "url_post": link, "data_hora": datetime.now().astimezone().isoformat(timespec="seconds")})
    ficha["status"] = "publicado"
    ficha.setdefault("historico", []).append({"agente": "publicador", "quando": pub["data_hora"], "acao": f"publicado: {link}"})
    path.write_text(json.dumps(ficha, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Publicado: {link}", file=sys.stderr)


if __name__ == "__main__":
    main()
