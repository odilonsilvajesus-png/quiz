import fs from "node:fs";
import { ffmpeg } from "../editor/ffmpeg.js";
import type { Word } from "../types.js";

/**
 * Modo demo: sem chaves de API, gera um áudio silencioso com o ritmo de fala
 * estimado e um vídeo com a sua foto animada — assim dá para testar legendas,
 * edição e download de ponta a ponta sem gastar créditos.
 */
export async function synthesize(text: string, outFile: string): Promise<Word[]> {
  const tokens = text.split(/\s+/).filter(Boolean);
  const words: Word[] = [];
  let t = 0.3;
  for (const token of tokens) {
    const len = 0.12 + token.length * 0.055;
    words.push({ text: token, start: t, end: t + len });
    t += len + (/[.!?]$/.test(token) ? 0.45 : /[,;:]$/.test(token) ? 0.2 : 0.06);
  }
  const duration = Math.max(t + 0.4, 2);
  await ffmpeg(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", duration.toFixed(2), "-c:a", "libmp3lame", "-q:a", "4", outFile]);
  return words;
}

export async function createVideo(opts: {
  audioFile: string;
  photoFile?: string;
  width: number;
  height: number;
  background: string;
  outFile: string;
}) {
  const { width: W, height: H } = opts;
  const photo = opts.photoFile && fs.existsSync(opts.photoFile) ? opts.photoFile : undefined;
  const input = photo
    ? ["-loop", "1", "-framerate", "30", "-i", photo]
    : ["-f", "lavfi", "-i", `color=c=${opts.background.replace("#", "0x")}:s=${W}x${H}:r=30`];
  const video = photo
    ? `[0:v]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
      `zoompan=z='min(zoom+0.0006,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=30,format=yuv420p[v]`
    : `[0:v]format=yuv420p[v]`;
  await ffmpeg([
    ...input,
    "-i", opts.audioFile,
    "-filter_complex", video,
    "-map", "[v]", "-map", "1:a",
    "-shortest",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
    "-c:a", "aac", "-b:a", "128k",
    opts.outFile,
  ]);
}
