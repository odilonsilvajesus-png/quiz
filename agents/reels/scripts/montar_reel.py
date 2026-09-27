#!/usr/bin/env python3
"""Monta o reel final (1080x1920) a partir de clipes + narração + tempos das palavras, na identidade SIC.

Uso:
    python agents/reels/scripts/montar_reel.py conteudo/reels/<id>

A pasta precisa ter:
    voz.mp3           narração (voz_elevenlabs.py)
    palavras.json     tempo de cada palavra (voz_elevenlabs.py)
    blocos.json       tempo de cada bloco do roteiro (voz_elevenlabs.py)
    storyboard.json   cenas e textos (escrito pelo agente diretor-de-cena), ex.:
      {
        "titulo": "Você acha que usa IA?",          # caixa no topo nos primeiros segundos
        "titulo_segundos": 3,
        "cta": "Comenta IA",                         # caixa terracota no final
        "cta_segundos": 3,
        "musica": "../../../fotos/audio/trilha.mp3", # opcional (caminho relativo a esta pasta)
        "volume_musica": 0.10,
        "legendas": true,
        "cenas": [
          {"bloco": 1, "arquivo": "clipes/01-avatar.mp4", "tipo": "avatar"},
          {"bloco": 2, "arquivo": "clipes/02-movimento.mp4", "tipo": "movimento"},
          {"bloco": 3, "arquivo": "clipes/03.jpg", "tipo": "foto"}  # imagem parada vira zoom lento
        ]
      }
Cada cena começa no início do seu bloco e vai até a próxima cena; a última segura até o fim do áudio.
Clipe mais curto que a cena congela no último quadro; mais longo é cortado.
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

W, H, FPS = 1080, 1920, 30
RAIZ = Path(__file__).resolve().parents[3]
FONTES = RAIZ / "agents/reels/fontes"
MARCA = RAIZ / "agents/marca-sic.json"
IMG = {".jpg", ".jpeg", ".png", ".webp"}


def ffmpeg_bin() -> str:
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def ass_cor(hexcor: str) -> str:
    h = hexcor.lstrip("#")
    return f"&H00{h[4:6]}{h[2:4]}{h[0:2]}".upper()


def ts(t: float) -> str:
    t = max(t, 0)
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"


def gerar_ass(palavras: list[dict], sb: dict, total: float, marca: dict, destino: Path) -> None:
    plum = ass_cor(marca.get("cor_fundo_escuro", "#2E0F36"))
    off = ass_cor(marca.get("cor_texto_escuro", "#F5F0EB"))
    terra = ass_cor(marca.get("cor_acao", "#B84B26"))
    linhas = [
        "[Script Info]", "ScriptType: v4.00+", f"PlayResX: {W}", f"PlayResY: {H}", "WrapStyle: 0", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, "
        "Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        # BorderStyle 3 = caixa sólida (cor do OutlineColour), cantos retos, sem sombra
        f"Style: Legenda,Poppins ExtraBold,76,{off},{off},{plum},{plum},0,0,0,0,100,100,0,0,3,14,0,2,90,90,560,1",
        f"Style: Titulo,DM Serif Display,78,{off},{off},{plum},{plum},0,0,0,0,100,100,0,0,3,22,0,8,80,80,230,1",
        f"Style: CTA,Poppins Bold,70,{off},{off},{terra},{terra},0,0,0,0,100,100,0,0,3,24,0,5,120,120,0,1",
        f"Style: Selo,Poppins Medium,30,{terra},{terra},{plum},{plum},0,0,0,0,100,100,8,0,3,10,0,9,0,56,60,1",
        "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]
    cta_ini = total - float(sb.get("cta_segundos", 3)) if sb.get("cta") else total + 1
    if sb.get("legendas", True):
        grupo = []
        for p in palavras:
            grupo.append(p)
            fim_frase = p["palavra"][-1:] in ".!?,;:"
            if len(grupo) == 3 or fim_frase or p is palavras[-1]:
                ini, fim = grupo[0]["inicio"], grupo[-1]["fim"] + 0.05
                if ini < cta_ini:
                    texto = " ".join(g["palavra"] for g in grupo).upper().rstrip(",;:")
                    linhas.append(f"Dialogue: 1,{ts(ini)},{ts(min(fim, cta_ini))},Legenda,,0,0,0,,{texto}")
                grupo = []
    if sb.get("titulo"):
        linhas.append(f"Dialogue: 2,{ts(0)},{ts(float(sb.get('titulo_segundos', 3)))},Titulo,,0,0,0,,{sb['titulo']}")
    if sb.get("cta"):
        linhas.append(f"Dialogue: 3,{ts(cta_ini)},{ts(total)},CTA,,0,0,0,,{sb['cta']}")
    linhas.append(f"Dialogue: 4,{ts(0)},{ts(total)},Selo,,0,0,0,,IA")
    destino.write_text("\n".join(linhas) + "\n", encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser(description="Monta o reel final.")
    ap.add_argument("pasta")
    ap.add_argument("--saida", help="padrão: <pasta>/reel-final.mp4")
    ap.add_argument("--rascunho", action="store_true", help="render rápido e mais leve, para conferir")
    a = ap.parse_args()

    pasta = Path(a.pasta).resolve()
    sb = json.loads((pasta / "storyboard.json").read_text(encoding="utf-8"))
    palavras = json.loads((pasta / "palavras.json").read_text(encoding="utf-8"))
    blocos = {b["bloco"]: b for b in json.loads((pasta / "blocos.json").read_text(encoding="utf-8"))}
    marca = json.loads(MARCA.read_text(encoding="utf-8")) if MARCA.exists() else {}
    total = round(palavras[-1]["fim"] + 1.0, 2)

    cenas = sb["cenas"]
    inicios = [0.0] + [blocos[c["bloco"]]["inicio"] if "inicio" not in c else c["inicio"] for c in cenas[1:]]
    duracoes = [max(inicios[i + 1] - inicios[i], 0.5) for i in range(len(cenas) - 1)] + [max(total - inicios[-1], 0.5)]

    gerar_ass(palavras, sb, total, marca, pasta / "legendas.ass")

    ff = ffmpeg_bin()
    tmp = pasta / ".montagem"
    tmp.mkdir(exist_ok=True)
    preset_cena = "veryfast" if a.rascunho else "medium"
    lista = []
    for i, (c, d) in enumerate(zip(cenas, duracoes)):
        arq = (pasta / c["arquivo"]).resolve()
        if not arq.exists():
            sys.exit(f"Clipe não encontrado: {arq}")
        out_c = tmp / f"cena_{i:02d}.mp4"
        cover = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"
        if arq.suffix.lower() in IMG:  # foto parada: zoom lento
            entrada = ["-loop", "1", "-framerate", str(FPS), "-t", f"{d:.3f}", "-i", str(arq)]
            vf = (f"scale={int(W * 1.3)}:{int(H * 1.3)}:force_original_aspect_ratio=increase,crop={int(W * 1.3)}:{int(H * 1.3)},"
                  f"zoompan=z='min(1+0.0008*on,1.12)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS},setsar=1")
        else:  # vídeo: corta ou congela o último quadro até a duração da cena
            entrada = ["-i", str(arq)]
            vf = f"{cover},fps={FPS},tpad=stop_mode=clone:stop_duration={d:.3f}"
        subprocess.run([ff, "-y", "-loglevel", "error", *entrada, "-vf", vf + ",format=yuv420p", "-an",
                        "-t", f"{d:.3f}", "-r", str(FPS), "-c:v", "libx264", "-preset", preset_cena, "-crf", "18",
                        str(out_c)], check=True)
        lista.append(f"file '{out_c.name}'")
    (tmp / "lista.txt").write_text("\n".join(lista) + "\n", encoding="utf-8")
    base = tmp / "base.mp4"
    subprocess.run([ff, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "lista.txt", "-c", "copy",
                    str(base)], check=True, cwd=tmp)

    fontsdir = os.path.relpath(FONTES, pasta).replace("\\", "/")
    cmd = [ff, "-y", "-loglevel", "error", "-i", str(base), "-i", str(pasta / "voz.mp3")]
    filtros = [f"[0:v]ass=legendas.ass:fontsdir={fontsdir},fps={FPS}[v]",
               f"[1:a]apad,atrim=0:{total},asetpts=PTS-STARTPTS[vz]"]
    audio_out = "[vz]"
    if sb.get("musica"):
        cmd += ["-stream_loop", "-1", "-i", str((pasta / sb["musica"]).resolve())]
        vol = float(sb.get("volume_musica", 0.10))
        filtros.append(f"[2:a]volume={vol},atrim=0:{total},asetpts=PTS-STARTPTS,afade=t=out:st={max(total - 1.5, 0)}:d=1.5[mu]")
        filtros.append("[vz][mu]amix=inputs=2:duration=first:normalize=0[mix]")
        audio_out = "[mix]"

    saida = Path(a.saida).resolve() if a.saida else pasta / ("reel-rascunho.mp4" if a.rascunho else "reel-final.mp4")
    preset, crf = ("veryfast", "28") if a.rascunho else ("medium", "19")
    cmd += ["-filter_complex", ";".join(filtros), "-map", "[v]", "-map", audio_out, "-t", f"{total}",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "high", "-preset", preset, "-crf", crf,
            "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(saida)]
    subprocess.run(cmd, check=True, cwd=pasta)
    for p in tmp.glob("*"):
        p.unlink()
    tmp.rmdir()
    print(f"Reel de {total:.1f}s em {saida}", file=sys.stderr)


if __name__ == "__main__":
    main()
