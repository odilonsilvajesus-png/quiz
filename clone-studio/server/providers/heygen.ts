import fs from "node:fs";
import { config } from "../config.js";
import type { Format, Profile } from "../types.js";
import { download, request, sleep } from "../util.js";

const API = "https://api.heygen.com";
const UPLOAD = "https://upload.heygen.com";
const headers = () => ({ "X-Api-Key": config.heygen.apiKey });

async function uploadBytes(url: string, file: string, contentType: string) {
  const res = await request(url, {
    method: "POST",
    headers: { ...headers(), "Content-Type": contentType },
    body: fs.readFileSync(file),
  });
  return ((await res.json()) as { data: Record<string, string> }).data;
}

/** Envia uma foto sua para virar um “talking photo” (avatar a partir de foto). */
export async function uploadTalkingPhoto(file: string, mimetype: string) {
  const data = await uploadBytes(`${UPLOAD}/v1/talking_photo`, file, mimetype);
  return data.talking_photo_id;
}

export async function listAvatars() {
  const res = await request(`${API}/v2/avatars`, { headers: headers() });
  const { data } = (await res.json()) as {
    data: {
      avatars: { avatar_id: string; avatar_name: string; preview_image_url: string }[];
      talking_photos: { talking_photo_id: string; talking_photo_name: string; preview_image_url: string }[];
    };
  };
  return [
    ...data.avatars.map((a) => ({ id: a.avatar_id, name: a.avatar_name, preview: a.preview_image_url, type: "avatar" as const })),
    ...data.talking_photos.map((t) => ({
      id: t.talking_photo_id,
      name: t.talking_photo_name,
      preview: t.preview_image_url,
      type: "talking_photo" as const,
    })),
  ];
}

export function dimensionFor(format: Format) {
  const h = Math.min(config.heygen.maxHeight, 1080);
  const long = Math.round((h * 16) / 9 / 2) * 2;
  if (format === "9:16") return { width: h, height: long };
  if (format === "16:9") return { width: long, height: h };
  return { width: h, height: h };
}

/** Pede ao HeyGen o vídeo do avatar falando exatamente o áudio gerado com a sua voz. */
export async function createVideo(opts: {
  avatar: Profile["avatar"];
  audioFile: string;
  format: Format;
  background: string;
  title: string;
}) {
  const { avatar } = opts;
  const character =
    avatar.type === "talking_photo"
      ? { type: "talking_photo", talking_photo_id: avatar.talkingPhotoId }
      : { type: "avatar", avatar_id: avatar.avatarId, avatar_style: "normal" };
  if (!avatar.avatarId && !avatar.talkingPhotoId) {
    throw new Error("Nenhum avatar configurado. Selecione seu avatar em “Meu Clone”.");
  }

  const asset = await uploadBytes(`${UPLOAD}/v1/asset`, opts.audioFile, "audio/mpeg");
  const res = await request(`${API}/v2/video/generate`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      title: opts.title,
      video_inputs: [
        {
          character,
          voice: { type: "audio", audio_asset_id: asset.id },
          background: { type: "color", value: opts.background },
        },
      ],
      dimension: dimensionFor(opts.format),
    }),
  });
  return ((await res.json()) as { data: { video_id: string } }).data.video_id;
}

/** Aguarda o HeyGen renderizar e baixa o vídeo. */
export async function waitAndDownload(videoId: string, outFile: string, onProgress: (msg: string) => void) {
  const started = Date.now();
  for (;;) {
    const res = await request(`${API}/v1/video_status.get?video_id=${videoId}`, { headers: headers() });
    const { data } = (await res.json()) as {
      data: { status: string; video_url?: string; error?: { message?: string; detail?: string } | null };
    };
    if (data.status === "completed" && data.video_url) {
      onProgress("Baixando vídeo do avatar…");
      await download(data.video_url, outFile);
      return;
    }
    if (data.status === "failed") {
      throw new Error(`HeyGen falhou: ${data.error?.detail ?? data.error?.message ?? "erro desconhecido"}`);
    }
    const mins = Math.floor((Date.now() - started) / 60000);
    onProgress(`HeyGen renderizando (${data.status})… ${mins} min`);
    if (Date.now() - started > 60 * 60 * 1000) throw new Error("HeyGen demorou mais de 1h para renderizar.");
    await sleep(10000);
  }
}
