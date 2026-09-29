import fs from "node:fs";
import path from "node:path";
import { FONTS_DIR, UPLOADS_DIR } from "../config.js";
import type { Format, Job, Layout, Render } from "../types.js";
import { buildAss, buildSrt } from "./captions.js";
import { ffmpeg, hasAudioStream, probeDuration } from "./ffmpeg.js";
import { LAYOUT_NAMES, buildBroll, planLayout, segmentsFrom } from "./layouts.js";

export const OUTPUT_SIZE: Record<Format, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "16:9": { width: 1920, height: 1080 },
};

/** Opções de jobs antigos podem não ter os campos de layout. */
export function layoutsOf(job: Job): Layout[] {
  const list = job.options.layouts?.length ? job.options.layouts : ["fullscreen" as const];
  return [...new Set(list)];
}

/**
 * Edição final: gera um vídeo para cada modelo escolhido (tela cheia, dividida,
 * podcast…), com legendas animadas, gancho, marca d'água, voz normalizada e
 * trilha com ducking.
 */
export async function renderAll(
  job: Job,
  dir: string,
  person: { name: string; handle: string },
  onProgress: (message: string) => void,
) {
  const { options } = job;
  const { width: W, height: H } = OUTPUT_SIZE[options.format];
  const raw = path.join(dir, job.outputs.raw!);
  const voiceFile = path.join(dir, job.outputs.audio!);
  const duration = await probeDuration(voiceFile);
  const words = job.outputs.words ?? [];
  const segs = segmentsFrom(words, duration);
  const voiceFromRaw = await hasAudioStream(raw);
  const layouts = layoutsOf(job);
  const brolls = new Map<string, string | undefined>();

  fs.writeFileSync(path.join(dir, "legendas.srt"), buildSrt(words, options.captions.wordsPerLine));

  const renders: Render[] = [];
  for (const [i, layout] of layouts.entries()) {
    const label = `${LAYOUT_NAMES[layout]}${layouts.length > 1 ? ` (${i + 1}/${layouts.length})` : ""}`;
    const plan = planLayout(layout, { W, H, opts: options, segs, duration, person });

    for (const { w, h } of plan.brollSizes) {
      const key = `${w}x${h}`;
      if (!brolls.has(key) && options.media?.length) {
        onProgress(`${label}: montando vídeos de apoio…`);
        brolls.set(key, await buildBroll(dir, options.media, segs, w, h));
      }
    }

    // Entradas: 0 = avatar, depois voz (se o vídeo não tiver áudio), B-roll e música.
    const inputs = ["-i", raw];
    const add = (...args: string[]) => {
      const idx = inputs.filter((x) => x === "-i").length;
      inputs.push(...args);
      return idx;
    };
    const voiceIdx = voiceFromRaw ? 0 : add("-i", voiceFile);
    const brollFile = plan.brollSizes.map(({ w, h }) => brolls.get(`${w}x${h}`)).find(Boolean);
    const brollIdx = brollFile ? add("-i", brollFile) : undefined;

    const built = plan.build({
      avatar: "[0:v]",
      broll: brollIdx === undefined ? undefined : () => `[${brollIdx}:v]`,
    });

    const assFile = `subs-${layout}.ass`;
    fs.writeFileSync(path.join(dir, assFile), buildAss(words, options, W, H, duration, built.ass));
    // Caminhos relativos ao diretório do job evitam problemas de escape no filtro do ffmpeg.
    const fontsDir = path.relative(dir, FONTS_DIR).split(path.sep).join("/");

    const filters = [...built.filters, `${built.out}subtitles=${assFile}:fontsdir='${fontsDir}',format=yuv420p[v]`];
    filters.push(`[${voiceIdx}:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000${built.wave ? ",asplit=2[voice][wavein]" : "[voice]"}`);
    if (built.wave) {
      const color = `0x${options.captions.highlight.replace("#", "")}`;
      filters.push(`[wavein]showwaves=s=${built.wave.w}x${built.wave.h}:mode=cline:rate=30:scale=sqrt:colors=${color},format=rgba${built.wave.label}`);
    }

    const music = options.music.file ? path.join(UPLOADS_DIR, options.music.file) : undefined;
    if (music && fs.existsSync(music)) {
      const idx = add("-stream_loop", "-1", "-i", music);
      filters.push(
        `[${idx}:a]volume=${options.music.volume.toFixed(2)},aresample=48000,afade=t=out:st=${Math.max(0, duration - 1.5).toFixed(2)}:d=1.5[mus]`,
        `[voice]asplit=2[vo][sc]`,
        `[mus][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[duck]`,
        `[vo][duck]amix=inputs=2:duration=first:normalize=0[a]`,
      );
    } else {
      filters.push(`[voice]anull[a]`);
    }

    const file = layouts.length === 1 && layout === "fullscreen" ? "final.mp4" : `final-${layout}.mp4`;
    const thumb = file.replace("final", "capa").replace(".mp4", ".jpg");
    let last = -1;
    await ffmpeg(
      [
        ...inputs,
        "-filter_complex", filters.join(";"),
        "-map", "[v]", "-map", "[a]",
        "-t", duration.toFixed(2),
        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-profile:v", "high",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart",
        file,
      ],
      {
        cwd: dir,
        onProgress: (t) => {
          const pct = Math.min(99, Math.round((t / duration) * 100));
          if (pct - last >= 5) {
            last = pct;
            onProgress(`Editando ${label}… ${pct}%`);
          }
        },
      },
    );
    await ffmpeg(["-ss", Math.min(1, duration / 3).toFixed(2), "-i", file, "-frames:v", "1", "-q:v", "3", thumb], { cwd: dir });
    renders.push({ layout, file, thumb });
  }

  // Remove vídeos de modelos que deixaram de ser escolhidos numa reedição.
  const keep = new Set(renders.flatMap((r) => [r.file, r.thumb]));
  for (const f of fs.readdirSync(dir)) {
    if (/^(final|capa)(-\w+)?\.(mp4|jpg)$/.test(f) && !keep.has(f)) fs.rmSync(path.join(dir, f));
  }

  return { renders, final: renders[0].file, thumb: renders[0].thumb, srt: "legendas.srt", duration };
}
