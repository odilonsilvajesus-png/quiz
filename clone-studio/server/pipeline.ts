import fs from "node:fs";
import path from "node:path";
import { UPLOADS_DIR } from "./config.js";
import { cutVideo, extractAudio, keepFromSpeech, keepFromWords, remapWords, speechIntervals } from "./editor/autocut.js";
import { planClips } from "./editor/clips.js";
import { probeDuration } from "./editor/ffmpeg.js";
import { OUTPUT_SIZE, renderAll, type Source } from "./editor/render.js";
import * as eleven from "./providers/elevenlabs.js";
import * as heygen from "./providers/heygen.js";
import * as mock from "./providers/mock.js";
import * as stt from "./providers/transcribe.js";
import { getJob, getProfile, jobDir, saveJob } from "./store.js";
import type { Job, StepKey } from "./types.js";

const queue: string[] = [];
let busy = false;

/** Fila simples: um vídeo por vez, na ordem em que foram pedidos. */
export function enqueue(id: string) {
  if (!queue.includes(id)) queue.push(id);
  void next();
}

async function next() {
  if (busy) return;
  const id = queue.shift();
  if (!id) return;
  busy = true;
  try {
    await run(id);
  } finally {
    busy = false;
    void next();
  }
}

type StepStatus = NonNullable<Job["steps"][StepKey]>["status"];

function setStep(job: Job, key: StepKey, status: StepStatus, message?: string) {
  job.steps[key] = { status, message };
  saveJob(job);
}

async function run(id: string) {
  const job = getJob(id);
  if (!job) return;
  const dir = jobDir(id);
  const profile = getProfile();
  const person = { name: profile.name, handle: profile.handle };
  const current = { step: (job.kind === "upload" ? "transcribe" : "voice") as StepKey };
  job.status = "running";
  job.error = undefined;
  saveJob(job);

  try {
    const sources = job.kind === "upload" ? await prepareUpload(job, dir, current) : await prepareAi(job, dir, current);

    // Edição: formato, modelos, legendas, gancho, marca d'água, trilha.
    current.step = "edit";
    setStep(job, "edit", "running", "Editando…");
    const out = await renderAll(job, dir, sources, person, (msg) => setStep(job, "edit", "running", msg));
    Object.assign(job.outputs, out);
    setStep(job, "edit", "done");
    job.status = "done";
    saveJob(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[job ${id}] etapa ${current.step}:`, message);
    job.status = "error";
    job.error = message;
    setStep(job, current.step, "error", message.split("\n")[0]);
  }
}

/** Modo 100% IA: copy → voz clonada → avatar com lip-sync. */
async function prepareAi(job: Job, dir: string, current: { step: StepKey }): Promise<Source[]> {
  const profile = getProfile();
  let step: StepKey;
  // 1) Voz: transforma a copy em narração com a sua voz clonada.
  step = current.step = "voice";
  if (!job.outputs.audio || !fs.existsSync(path.join(dir, job.outputs.audio))) {
    setStep(job, step, "running", "Gerando narração com a sua voz…");
    const audio = path.join(dir, "voz.mp3");
    job.outputs.words =
      job.providers.voice === "elevenlabs"
        ? await eleven.synthesize(job.copy, profile.voice, audio)
        : await mock.synthesize(job.copy, audio);
    job.outputs.audio = "voz.mp3";
  }
  setStep(job, step, "done");

  // 2) Clone em vídeo: avatar com sincronização labial usando o áudio acima.
  step = current.step = "avatar";
  if (!job.outputs.raw || !fs.existsSync(path.join(dir, job.outputs.raw))) {
    const raw = path.join(dir, "avatar.mp4");
    if (job.providers.avatar === "heygen") {
      if (!job.external.heygenVideoId) {
        setStep(job, step, "running", "Enviando áudio para o HeyGen…");
        job.external.heygenVideoId = await heygen.createVideo({
          avatar: profile.avatar,
          audioFile: path.join(dir, job.outputs.audio),
          format: job.options.format,
          background: job.options.background,
          title: job.title,
        });
        saveJob(job);
      }
      await heygen.waitAndDownload(job.external.heygenVideoId, raw, (msg) => setStep(job, step, "running", msg));
    } else {
      setStep(job, step, "running", "Animando sua foto (modo demo)…");
      const { width, height } = OUTPUT_SIZE[job.options.format];
      await mock.createVideo({
        audioFile: path.join(dir, job.outputs.audio),
        photoFile: profile.avatar.photoFile && path.join(UPLOADS_DIR, profile.avatar.photoFile),
        width,
        height,
        background: job.options.background,
        outFile: raw,
      });
    }
    job.outputs.raw = "avatar.mp4";
  }
  setStep(job, step, "done");

  return [{ raw: job.outputs.raw, audio: job.outputs.audio, words: job.outputs.words ?? [], duration: await probeDuration(path.join(dir, job.outputs.audio)) }];
}

/**
 * Modo vídeo gravado: transcreve, escolhe os cortes (IA ou por duração), tira
 * pausas e vícios de linguagem e deixa cada corte pronto para a edição.
 */
async function prepareUpload(job: Job, dir: string, current: { step: StepKey }): Promise<Source[]> {
  const src = path.join(dir, job.source!.file);
  const auto = job.auto!;
  const duration = await probeDuration(src);

  current.step = "transcribe";
  if (!job.outputs.audio || !fs.existsSync(path.join(dir, job.outputs.audio))) {
    setStep(job, "transcribe", "running", "Extraindo o áudio…");
    await extractAudio(src, path.join(dir, "audio.mp3"));
    job.outputs.audio = "audio.mp3";
    if (job.providers.transcribe === "elevenlabs") {
      setStep(job, "transcribe", "running", "Transcrevendo a fala…");
      job.outputs.words = (await stt.transcribe(path.join(dir, "audio.mp3"))).words;
    } else {
      job.outputs.words = [];
    }
  }
  setStep(job, "transcribe", "done", job.outputs.words?.length ? `${job.outputs.words.length} palavras` : "Sem transcrição (modo demo)");

  current.step = "plan";
  const words = job.outputs.words ?? [];
  if (!job.outputs.clips?.every((c) => c.file && fs.existsSync(path.join(dir, c.file)))) {
    setStep(job, "plan", "running", auto.mode === "clips" ? (job.providers.clips === "claude" ? "IA escolhendo os melhores trechos…" : "Separando os cortes…") : "Preparando o vídeo…");
    const clips = job.outputs.clips?.length ? job.outputs.clips : await planClips(words, duration, auto, job.title, job.providers.clips === "claude");
    job.outputs.clips = clips;
    saveJob(job);
    const speech = words.length ? [] : await speechIntervals(path.join(dir, "audio.mp3"), duration);
    for (const [i, clip] of clips.entries()) {
      const range = { start: clip.start, end: clip.end };
      const keep = words.length ? keepFromWords(words, range, auto) : auto.removePauses ? keepFromSpeech(speech, range) : [range];
      const total = keep.reduce((n, k) => n + k.end - k.start, 0);
      const label = clips.length > 1 ? `Cortando trecho ${i + 1}/${clips.length}` : "Cortando pausas";
      clip.file = `corte-${clip.id}.mp4`;
      await cutVideo(src, keep, dir, clip.file, (t) => setStep(job, "plan", "running", `${label}… ${Math.min(99, Math.round((t / total) * 100))}%`));
      clip.words = remapWords(words, keep);
      clip.duration = await probeDuration(path.join(dir, clip.file));
      saveJob(job);
    }
  }
  const clips = job.outputs.clips!;
  const cut = clips.reduce((n, c) => n + (c.end - c.start) - (c.duration ?? 0), 0);
  setStep(job, "plan", "done", `${clips.length} ${clips.length > 1 ? "cortes" : "vídeo"}${cut > 1 ? ` · ${Math.round(cut)}s de pausas removidos` : ""}`);

  return clips.map((c) => ({
    id: auto.mode === "clips" ? c.id : undefined,
    raw: c.file!,
    words: c.words ?? [],
    duration: c.duration!,
    title: auto.mode === "clips" ? c.title : undefined,
    hook: auto.mode === "clips" ? c.hook : undefined,
  }));
}
