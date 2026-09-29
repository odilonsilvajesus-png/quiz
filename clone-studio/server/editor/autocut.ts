import fs from "node:fs";
import path from "node:path";
import type { Word } from "../types.js";
import { ffmpeg } from "./ffmpeg.js";

export type Interval = { start: number; end: number };

/** Vícios de linguagem que somem quando a opção está ligada. */
const FILLERS = /^(h+[ãa]+|[ãa]+h*|h*u+m+|h*m+|[ée]+h*|ahn+|uh+|eh+|er+m*|hum+|tipo[,.]?)$/i;

export const isFiller = (w: Word) => FILLERS.test(w.text.replace(/[.,!?…]+$/, ""));

/** Extrai o áudio (mono, leve) para transcrever e medir silêncios. */
export async function extractAudio(src: string, out: string) {
  await ffmpeg(["-i", src, "-vn", "-ac", "1", "-ar", "16000", "-c:a", "libmp3lame", "-b:a", "64k", out]);
}

/** Trechos com som (fala) segundo o detector de silêncio do ffmpeg — usado sem transcrição. */
export async function speechIntervals(audio: string, duration: number): Promise<Interval[]> {
  const log = await ffmpeg(["-i", audio, "-af", "silencedetect=noise=-35dB:d=0.45", "-f", "null", "-"]);
  const out: Interval[] = [];
  let cursor = 0;
  for (const m of log.matchAll(/silence_(start|end): (-?[\d.]+)/g)) {
    const t = Math.max(0, Number(m[2]));
    if (m[1] === "start") {
      if (t - cursor > 0.05) out.push({ start: cursor, end: t });
    } else cursor = t;
  }
  if (duration - cursor > 0.05) out.push({ start: cursor, end: duration });
  return out;
}

/**
 * Trechos a manter dentro de [start, end]: junta palavras próximas e corta as
 * pausas longas (jump cut), deixando uma folga para a fala não soar picotada.
 */
export function keepFromWords(words: Word[], range: Interval, opts: { removePauses: boolean; removeFillers: boolean }): Interval[] {
  const inRange = words.filter((w) => w.start >= range.start - 0.01 && w.end <= range.end + 0.01);
  const kept = opts.removeFillers ? inRange.filter((w) => !isFiller(w)) : inRange;
  if (!opts.removePauses && !opts.removeFillers) return [range];
  if (!kept.length) return [range];

  const PAD = 0.1;
  const MAX_GAP = opts.removePauses ? 0.35 : Infinity;
  const out: Interval[] = [];
  for (const [i, w] of kept.entries()) {
    const prev = kept[i - 1];
    // Sem remover pausas, só corta onde havia vício de linguagem entre duas palavras.
    const fillerBetween = prev && inRange.some((x) => x.start >= prev.end && x.end <= w.start && isFiller(x));
    if (prev && w.start - prev.end <= MAX_GAP && !(opts.removeFillers && fillerBetween)) {
      out[out.length - 1].end = w.end;
    } else {
      out.push({ start: w.start, end: w.end });
    }
  }
  return out.map((iv) => ({ start: Math.max(range.start, iv.start - PAD), end: Math.min(range.end, iv.end + PAD) }));
}

export function keepFromSpeech(speech: Interval[], range: Interval): Interval[] {
  const PAD = 0.12;
  const out = speech
    .map((s) => ({ start: Math.max(range.start, s.start - PAD), end: Math.min(range.end, s.end + PAD) }))
    .filter((s) => s.end - s.start > 0.15);
  return out.length ? out : [range];
}

/** Passa as palavras do tempo do vídeo original para o tempo do trecho já cortado. */
export function remapWords(words: Word[], keep: Interval[]): Word[] {
  const out: Word[] = [];
  let offset = 0;
  for (const iv of keep) {
    for (const w of words) {
      if (w.start >= iv.start - 0.01 && w.end <= iv.end + 0.01) {
        out.push({ text: w.text, start: offset + Math.max(0, w.start - iv.start), end: offset + Math.min(iv.end, w.end) - iv.start });
      }
    }
    offset += iv.end - iv.start;
  }
  return out;
}

/** Gera um vídeo só com os trechos mantidos, emendados (cortes secos). */
export async function cutVideo(src: string, keep: Interval[], dir: string, out: string, onProgress?: (t: number) => void) {
  const expr = keep.map((k) => `between(t,${k.start.toFixed(3)},${k.end.toFixed(3)})`).join("+");
  const script = `${out}.filter`;
  fs.writeFileSync(
    path.join(dir, script),
    `[0:v]fps=30,select='${expr}',setpts=N/30/TB,format=yuv420p[v];[0:a]aresample=48000,aselect='${expr}',asetpts=N/SR/TB[a]`,
  );
  await ffmpeg(
    ["-i", src, "-filter_complex_script", script, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-c:a", "aac", "-b:a", "192k", out],
    { cwd: dir, onProgress },
  );
  fs.rmSync(path.join(dir, script), { force: true });
}
