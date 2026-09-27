#!/usr/bin/env python3
"""Gera a narração do reel com a voz do Odilon (ElevenLabs) e o tempo de cada palavra.

Uso:
    python agents/reels/scripts/voz_elevenlabs.py conteudo/fichas/<id>.json
    python agents/reels/scripts/voz_elevenlabs.py conteudo/fichas/<id>.json --simular   # sem API: áudio mudo + tempos estimados

Lê as falas de estudio_reel.roteiro (ou texto.roteiro_reel) da ficha, aplica o dicionário de pronúncia de
agents/reels/voz-config.json e salva em conteudo/reels/<id>/:
    voz.mp3        narração
    palavras.json  [{"palavra", "inicio", "fim", "bloco"}]  (base das legendas e da montagem)
    blocos.json    [{"bloco", "inicio", "fim", "fala"}]      (para o storyboard casar cenas com falas)
Variáveis de ambiente: ELEVENLABS_API_KEY (obrigatória sem --simular) e, opcionalmente, ELEVENLABS_VOICE_ID.
"""

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[3]
CONFIG = RAIZ / "agents/reels/voz-config.json"


def ffmpeg_bin() -> str:
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def falas_da_ficha(ficha: dict) -> list[str]:
    roteiro = ficha.get("estudio_reel", {}).get("roteiro") or ficha.get("texto", {}).get("roteiro_reel") or []
    falas = [b.get("fala", "").strip() for b in roteiro if b.get("fala", "").strip()]
    if not falas:
        sys.exit("A ficha não tem falas em estudio_reel.roteiro nem em texto.roteiro_reel.")
    return falas


def aplicar_pronuncia(texto: str, dic: dict) -> str:
    for escrito, falado in sorted(dic.items(), key=lambda kv: -len(kv[0])):
        texto = re.sub(rf"(?<!\w){re.escape(escrito)}(?!\w)", falado, texto)
    return texto


def palavras_por_caractere(texto: str, inicios: list[float], fins: list[float]) -> list[dict]:
    palavras, atual, ini = [], "", None
    for ch, a, b in zip(texto, inicios, fins):
        if ch.isspace():
            if atual:
                palavras.append({"palavra": atual, "inicio": ini, "fim": fim})
                atual = ""
            continue
        if not atual:
            ini = a
        atual += ch
        fim = b
    if atual:
        palavras.append({"palavra": atual, "inicio": ini, "fim": fim})
    return palavras


def chamar_api(texto: str, cfg: dict) -> tuple[bytes, dict]:
    chave = os.environ.get("ELEVENLABS_API_KEY")
    voz = os.environ.get("ELEVENLABS_VOICE_ID") or cfg.get("voice_id")
    if not chave or not voz:
        sys.exit("Defina ELEVENLABS_API_KEY e o voice_id (em voz-config.json ou ELEVENLABS_VOICE_ID), ou use --simular.")
    url = (f"https://api.elevenlabs.io/v1/text-to-speech/{voz}/with-timestamps"
           f"?output_format={cfg.get('output_format', 'mp3_44100_128')}")
    corpo = {"text": texto, "model_id": cfg.get("model_id", "eleven_multilingual_v2"),
             "voice_settings": cfg.get("voice_settings", {})}
    req = urllib.request.Request(url, json.dumps(corpo).encode(),
                                 {"xi-api-key": chave, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        dados = json.load(r)
    return base64.b64decode(dados["audio_base64"]), dados["alignment"]


def simular(texto: str, cfg: dict, destino: Path) -> dict:
    """Tempos estimados + áudio mudo, para testar o pipeline sem gastar créditos."""
    vel = cfg.get("velocidade_estimada_palavras_por_segundo", 2.6)
    ini, fim, t = [], [], 0.0
    for ch in texto:
        dur = (1 / vel) / 6 if not ch.isspace() else 0.02
        if ch in ".!?":
            dur += 0.35
        elif ch in ",;:":
            dur += 0.15
        ini.append(round(t, 3)); t += dur; fim.append(round(t, 3))
    subprocess.run([ffmpeg_bin(), "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
                    "-t", f"{t + 0.3:.2f}", "-c:a", "libmp3lame", "-b:a", "96k", str(destino)], check=True)
    return {"characters": list(texto), "character_start_times_seconds": ini, "character_end_times_seconds": fim}


def main() -> None:
    ap = argparse.ArgumentParser(description="Narração ElevenLabs + tempos por palavra.")
    ap.add_argument("ficha")
    ap.add_argument("--simular", action="store_true", help="não chama a API: áudio mudo e tempos estimados")
    ap.add_argument("--saida", help="pasta de saída (padrão: conteudo/reels/<id>)")
    a = ap.parse_args()

    ficha_path = Path(a.ficha)
    ficha = json.loads(ficha_path.read_text(encoding="utf-8"))
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    out = Path(a.saida) if a.saida else RAIZ / "conteudo/reels" / ficha["id"]
    out.mkdir(parents=True, exist_ok=True)

    falas = falas_da_ficha(ficha)
    dic = cfg.get("pronuncia", {})
    # para cada palavra escrita: sua forma falada e quantos tokens ela vira (ex.: ChatGPT -> "tchat GPT" = 2)
    mapa = []  # (bloco, palavra_escrita, n_tokens_falados)
    faladas = []
    for n, fala in enumerate(falas, 1):
        partes = []
        for w in fala.split():
            fw = aplicar_pronuncia(w, dic)
            partes.append(fw)
            mapa.append((n, w, len(fw.split())))
        faladas.append(" ".join(partes))
    texto = " ".join(faladas)

    if a.simular:
        alinhamento = simular(texto, cfg, out / "voz.mp3")
    else:
        audio, alinhamento = chamar_api(texto, cfg)
        (out / "voz.mp3").write_bytes(audio)

    chars = "".join(alinhamento["characters"])
    tokens = palavras_por_caractere(chars, alinhamento["character_start_times_seconds"],
                                    alinhamento["character_end_times_seconds"])
    palavras_faladas, i = [], 0
    for bloco, escrita, k in mapa:
        grupo = tokens[i: i + k]
        i += k
        if not grupo:
            break
        palavras_faladas.append({"palavra": escrita, "inicio": grupo[0]["inicio"], "fim": grupo[-1]["fim"], "bloco": bloco})

    blocos = []
    for n, fala in enumerate(falas, 1):
        seg = [p for p in palavras_faladas if p["bloco"] == n]
        if seg:
            blocos.append({"bloco": n, "inicio": seg[0]["inicio"], "fim": seg[-1]["fim"], "fala": fala})

    (out / "palavras.json").write_text(json.dumps(palavras_faladas, ensure_ascii=False, indent=1), encoding="utf-8")
    (out / "blocos.json").write_text(json.dumps(blocos, ensure_ascii=False, indent=1), encoding="utf-8")
    dur = palavras_faladas[-1]["fim"] if palavras_faladas else 0
    print(f"{'SIMULAÇÃO: ' if a.simular else ''}{len(palavras_faladas)} palavras, {dur:.1f}s, {len(blocos)} blocos em {out}/",
          file=sys.stderr)


if __name__ == "__main__":
    main()
