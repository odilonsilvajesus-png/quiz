#!/usr/bin/env python3
"""Transforma os PNGs de um carrossel (1080x1350) em reel vertical 1080x1920 com transições.

Uso:
    python agents/render/reel_de_slides.py conteudo/render/<id> --saida conteudo/render/<id>/reel.mp4
    python agents/render/reel_de_slides.py conteudo/render/<id> --segundos 3.5 --audio trilha.mp3 --marca agents/marca-sic.json

- Cada slide fica centralizado sobre a cor de fundo escuro da marca (bordas de cima e de baixo).
- Transição em fade entre slides; zoom lento opcional (--zoom).
- Áudio opcional (música sem direitos autorais ou narração); cortado na duração do vídeo.
Requer ffmpeg (usa o do pacote imageio-ffmpeg se o do sistema não existir).
"""

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

W, H, SLIDE_H = 1080, 1920, 1350


def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg não encontrado. Instale o ffmpeg ou: pip install imageio-ffmpeg")


def main() -> None:
    ap = argparse.ArgumentParser(description="Reel 9:16 a partir dos slides de um carrossel.")
    ap.add_argument("pasta", help="pasta com 01.png, 02.png…")
    ap.add_argument("--saida", help="arquivo .mp4 (padrão: <pasta>/reel.mp4)")
    ap.add_argument("--segundos", type=float, default=3.0, help="tempo de cada slide (padrão 3s; use mais para slides com muito texto)")
    ap.add_argument("--transicao", type=float, default=0.5, help="duração do fade entre slides")
    ap.add_argument("--audio", help="arquivo de áudio opcional")
    ap.add_argument("--marca", default="agents/marca-sic.json", help="arquivo da marca (para a cor de fundo)")
    ap.add_argument("--zoom", action="store_true", help="zoom lento em cada slide")
    a = ap.parse_args()

    pasta = Path(a.pasta)
    slides = sorted(p for p in pasta.glob("[0-9][0-9].png"))
    if not slides:
        sys.exit(f"Nenhum slide 01.png, 02.png… em {pasta}")
    cor = "0x2E0F36"
    marca = Path(a.marca)
    if marca.exists():
        cor = json.loads(marca.read_text(encoding="utf-8")).get("cor_fundo_escuro", "#2E0F36").replace("#", "0x")
    saida = Path(a.saida) if a.saida else pasta / "reel.mp4"

    d, t, n = a.segundos, a.transicao, len(slides)
    cmd = [ffmpeg_bin(), "-y", "-loglevel", "error"]
    for s in slides:
        cmd += ["-loop", "1", "-t", f"{d + t:.2f}", "-i", str(s)]
    if a.audio:
        cmd += ["-i", a.audio]

    parts = []
    for i in range(n):
        zoom = (f",zoompan=z='min(zoom+0.0006,1.06)':d={int((d + t) * 30)}:s={W}x{SLIDE_H}:fps=30"
                if a.zoom else "")
        parts.append(f"[{i}:v]scale={W}:{SLIDE_H}{zoom},pad={W}:{H}:0:(oh-ih)/2:color={cor},setsar=1,fps=30,format=yuv420p[v{i}]")
    last = "v0"
    for i in range(1, n):
        offset = i * d
        out = f"x{i}"
        parts.append(f"[{last}][v{i}]xfade=transition=fade:duration={t}:offset={offset:.2f}[{out}]")
        last = out
    cmd += ["-filter_complex", ";".join(parts), "-map", f"[{last}]"]
    total = n * d + t
    if a.audio:
        cmd += ["-map", f"{n}:a", "-c:a", "aac", "-b:a", "160k", "-af", f"afade=t=out:st={max(total - 1.5, 0):.2f}:d=1.5"]
    cmd += ["-t", f"{total:.2f}", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "high", "-preset", "medium", "-crf", "20", "-movflags", "+faststart", str(saida)]
    subprocess.run(cmd, check=True)
    print(f"Reel de {total:.1f}s em {saida}", file=sys.stderr)


if __name__ == "__main__":
    main()
