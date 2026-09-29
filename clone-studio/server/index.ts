import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { DIST_DIR, UPLOADS_DIR, avatarProvider, config, voiceProvider } from "./config.js";
import { enqueue } from "./pipeline.js";
import * as eleven from "./providers/elevenlabs.js";
import * as heygen from "./providers/heygen.js";
import { deleteJob, getJob, getProfile, jobDir, listJobs, loadJobs, saveJob, saveProfile } from "./store.js";
import type { EditOptions, Job, Profile } from "./types.js";
import { HttpError } from "./util.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
});

type Handler = (req: Request, res: Response) => Promise<unknown> | unknown;
const h = (fn: Handler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res)).catch(next);

const requireConsent = () => {
  if (!getProfile().consent) {
    throw new HttpError(400, "Confirme em “Meu Clone” que a voz e a imagem usadas são suas (ou que você tem autorização).");
  }
};

app.get("/api/status", (_req, res) => {
  res.json({ voice: voiceProvider(), avatar: avatarProvider() });
});

// ---- Meu clone -----------------------------------------------------------

app.get("/api/profile", (_req, res) => res.json(getProfile()));

app.put("/api/profile", h((req, res) => {
  const body = req.body as Partial<Profile>;
  res.json(saveProfile({ name: body.name, handle: body.handle, consent: body.consent, voice: body.voice, avatar: body.avatar } as Partial<Profile>));
}));

app.post("/api/profile/voice", upload.array("samples", 25), h(async (req, res) => {
  requireConsent();
  const files = (req.files as Express.Multer.File[]) ?? [];
  if (!files.length) throw new HttpError(400, "Envie pelo menos uma gravação da sua voz.");
  if (voiceProvider() !== "elevenlabs") throw new HttpError(400, "Configure ELEVENLABS_API_KEY no .env para clonar a voz.");
  const name = String(req.body.name || getProfile().name || "Minha voz");
  try {
    const voiceId = await eleven.cloneVoice(name, files);
    res.json(saveProfile({ voice: { ...getProfile().voice, voiceId, voiceName: name } }));
  } finally {
    for (const f of files) fs.rmSync(f.path, { force: true });
  }
}));

app.post("/api/profile/photo", upload.single("photo"), h(async (req, res) => {
  requireConsent();
  const file = req.file;
  if (!file) throw new HttpError(400, "Envie uma foto.");
  const patch: Partial<Profile["avatar"]> = { photoFile: file.filename };
  if (avatarProvider() === "heygen") {
    patch.talkingPhotoId = await heygen.uploadTalkingPhoto(file.path, file.mimetype);
    patch.type = "talking_photo";
  }
  res.json(saveProfile({ avatar: { ...getProfile().avatar, ...patch } }));
}));

app.get("/api/voices", h(async (_req, res) => {
  res.json(voiceProvider() === "elevenlabs" ? await eleven.listVoices() : []);
}));

app.get("/api/avatars", h(async (_req, res) => {
  res.json(avatarProvider() === "heygen" ? await heygen.listAvatars() : []);
}));

// ---- Vídeos --------------------------------------------------------------

app.post("/api/music", upload.single("music"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Envie um arquivo de áudio." });
  res.json({ file: req.file.filename, name: req.file.originalname });
});

app.get("/api/jobs", (_req, res) => res.json(listJobs()));

app.get("/api/jobs/:id", (req, res) => {
  const job = getJob(req.params.id);
  return job ? res.json(job) : res.status(404).json({ error: "Vídeo não encontrado." });
});

app.post("/api/jobs", h((req, res) => {
  requireConsent();
  const { title, copy, options } = req.body as { title?: string; copy?: string; options: EditOptions };
  const text = (copy ?? "").trim();
  if (text.length < 5) throw new HttpError(400, "Escreva a copy do vídeo.");
  if (text.length > 5000) throw new HttpError(400, "A copy passou de 5.000 caracteres. Divida em vídeos menores.");
  const now = new Date().toISOString();
  const job: Job = {
    id: `${now.slice(0, 10)}-${crypto.randomBytes(3).toString("hex")}`,
    title: (title ?? "").trim() || text.slice(0, 48),
    copy: text,
    options,
    status: "queued",
    steps: { voice: { status: "pending" }, avatar: { status: "pending" }, edit: { status: "pending" } },
    providers: { voice: voiceProvider(), avatar: avatarProvider() },
    outputs: {},
    external: {},
    createdAt: now,
    updatedAt: now,
  };
  saveJob(job);
  enqueue(job.id);
  res.status(201).json(job);
}));

/** Tenta de novo a partir da etapa que falhou (não gasta créditos das etapas já concluídas). */
app.post("/api/jobs/:id/retry", h((req, res) => {
  const job = getJob(String(req.params.id));
  if (!job) throw new HttpError(404, "Vídeo não encontrado.");
  if (job.status === "running" || job.status === "queued") throw new HttpError(409, "Este vídeo já está sendo processado.");
  for (const s of Object.values(job.steps)) if (s.status === "error") s.status = "pending";
  job.status = "queued";
  saveJob(job);
  enqueue(job.id);
  res.json(job);
}));

/** Refaz só a edição (legendas, formato, trilha…) reaproveitando voz e avatar. */
app.post("/api/jobs/:id/reedit", h((req, res) => {
  const job = getJob(String(req.params.id));
  if (!job) throw new HttpError(404, "Vídeo não encontrado.");
  if (job.status === "running" || job.status === "queued") throw new HttpError(409, "Aguarde o vídeo terminar.");
  const options = (req.body as { options: EditOptions }).options;
  if (options.format !== job.options.format && job.providers.avatar === "heygen") {
    // Formato diferente precisa de um novo render do avatar para não cortar o rosto.
    job.outputs.raw = undefined;
    job.external.heygenVideoId = undefined;
    job.steps.avatar = { status: "pending" };
  }
  job.options = options;
  job.steps.edit = { status: "pending" };
  job.status = "queued";
  saveJob(job);
  enqueue(job.id);
  res.json(job);
}));

app.delete("/api/jobs/:id", h((req, res) => {
  const job = getJob(String(req.params.id));
  if (!job) throw new HttpError(404, "Vídeo não encontrado.");
  if (job.status === "running") throw new HttpError(409, "Aguarde o vídeo terminar para excluir.");
  deleteJob(job.id);
  res.status(204).end();
}));

const DOWNLOADS: Record<string, (job: Job) => string | undefined> = {
  video: (j) => j.outputs.final,
  capa: (j) => j.outputs.thumb,
  legendas: (j) => j.outputs.srt,
  voz: (j) => j.outputs.audio,
};

app.get("/api/jobs/:id/download/:kind", (req, res) => {
  const job = getJob(req.params.id);
  const file = job && DOWNLOADS[req.params.kind]?.(job);
  if (!job || !file) return res.status(404).json({ error: "Arquivo não disponível." });
  const slug = job.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 40).toLowerCase() || job.id;
  res.download(path.join(jobDir(job.id), file), `${slug}${path.extname(file)}`);
});

app.use("/files/jobs", (req, res, next) => {
  // Só expõe arquivos de saída para pré-visualização.
  if (!/^\/[\w-]+\/(final\.mp4|capa\.jpg|avatar\.mp4|voz\.mp3)$/.test(req.path)) return res.status(404).end();
  next();
}, express.static(path.dirname(jobDir("x"))));
app.use("/files/uploads", express.static(UPLOADS_DIR));

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(DIST_DIR, "index.html")));
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof HttpError && err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message });
});

// Retoma vídeos interrompidos (ex.: servidor reiniciado durante o render do HeyGen).
for (const job of loadJobs()) {
  if (job.status === "running" || job.status === "queued") enqueue(job.id);
}

app.listen(config.port, () => {
  console.log(`Clone Studio API em http://localhost:${config.port}`);
  console.log(`  voz: ${voiceProvider()} | avatar: ${avatarProvider()}`);
});
