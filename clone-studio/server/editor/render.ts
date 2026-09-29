import fs from "node:fs";
import path from "node:path";
import { FONTS_DIR, UPLOADS_DIR } from "../config.js";
import type { Format, Job } from "../types.js";
import { buildAss, buildSrt } from "./captions.js";
import { ffmpeg, hasAudioStream, probeDuration } from "./ffmpeg.js";

export const OUTPUT_SIZE: Record<Format, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "16:9": { width: 1920, height: 1080 },
};

/**
 * Edição final: enquadra no formato da rede social, queima legendas animadas,
 * gancho e marca d'água, normaliza o volume da voz e mistura trilha com ducking.
 */
export async function render(job: Job, dir: string, onProgress: (pct: number) => void) {
  const { options } = job;
  const { width: W, height: H } = OUTPUT_SIZE[options.format];
  const raw = path.join(dir, job.outputs.raw!);
  const duration = await probeDuration(path.join(dir, job.outputs.audio!));
  const words = job.outputs.words ?? [];

  fs.writeFileSync(path.join(dir, "subs.ass"), buildAss(words, options, W, H, duration));
  fs.writeFileSync(path.join(dir, "legendas.srt"), buildSrt(words, options.captions.wordsPerLine));

  // Caminhos relativos ao diretório do job evitam problemas de escape no filtro do ffmpeg.
  const fontsDir = path.relative(dir, FONTS_DIR).split(path.sep).join("/");
  const inputs = ["-i", raw];
  const voiceFromRaw = await hasAudioStream(raw);
  if (!voiceFromRaw) inputs.push("-i", path.join(dir, job.outputs.audio!));
  const voiceIn = voiceFromRaw ? "[0:a]" : "[1:a]";

  const filters = [
    `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,fps=30,` +
      `subtitles=subs.ass:fontsdir='${fontsDir}'[v]`,
    `${voiceIn}loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[voice]`,
  ];

  const music = options.music.file ? path.join(UPLOADS_DIR, options.music.file) : undefined;
  if (music && fs.existsSync(music)) {
    const idx = inputs.filter((x) => x === "-i").length;
    inputs.push("-stream_loop", "-1", "-i", music);
    filters.push(
      `[${idx}:a]volume=${options.music.volume.toFixed(2)},aresample=48000,afade=t=out:st=${Math.max(0, duration - 1.5).toFixed(2)}:d=1.5[mus]`,
      `[voice]asplit=2[vo][sc]`,
      `[mus][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[duck]`,
      `[vo][duck]amix=inputs=2:duration=first:normalize=0[a]`,
    );
  } else {
    filters.push(`[voice]anull[a]`);
  }

  await ffmpeg(
    [
      ...inputs,
      "-filter_complex", filters.join(";"),
      "-map", "[v]", "-map", "[a]",
      "-t", duration.toFixed(2),
      "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-profile:v", "high",
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
      "-movflags", "+faststart",
      "final.mp4",
    ],
    { cwd: dir, onProgress: (t) => onProgress(Math.min(99, Math.round((t / duration) * 100))) },
  );

  await ffmpeg(["-ss", Math.min(1, duration / 3).toFixed(2), "-i", "final.mp4", "-frames:v", "1", "-q:v", "3", "capa.jpg"], { cwd: dir });
  return { final: "final.mp4", srt: "legendas.srt", thumb: "capa.jpg", duration };
}
