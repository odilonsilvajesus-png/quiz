import fs from "node:fs";
import path from "node:path";
import { UPLOADS_DIR } from "./config.js";
import { OUTPUT_SIZE, render } from "./editor/render.js";
import * as eleven from "./providers/elevenlabs.js";
import * as heygen from "./providers/heygen.js";
import * as mock from "./providers/mock.js";
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

function setStep(job: Job, key: StepKey, status: Job["steps"][StepKey]["status"], message?: string) {
  job.steps[key] = { status, message };
  saveJob(job);
}

async function run(id: string) {
  const job = getJob(id);
  if (!job) return;
  const dir = jobDir(id);
  const profile = getProfile();
  let step: StepKey = "voice";
  job.status = "running";
  job.error = undefined;
  saveJob(job);

  try {
    // 1) Voz: transforma a copy em narração com a sua voz clonada.
    step = "voice";
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
    step = "avatar";
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

    // 3) Edição: formato, legendas, gancho, marca d'água, trilha.
    step = "edit";
    setStep(job, step, "running", "Editando… 0%");
    let last = -1;
    const out = await render(job, dir, (pct) => {
      if (pct - last >= 5) {
        last = pct;
        setStep(job, step, "running", `Editando… ${pct}%`);
      }
    });
    Object.assign(job.outputs, out);
    setStep(job, step, "done");
    job.status = "done";
    saveJob(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[job ${id}] etapa ${step}:`, message);
    job.status = "error";
    job.error = message;
    setStep(job, step, "error", message.split("\n")[0]);
  }
}
