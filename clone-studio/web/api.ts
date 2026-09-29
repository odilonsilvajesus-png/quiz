export type Format = "9:16" | "1:1" | "16:9";

export type Profile = {
  name: string;
  handle: string;
  consent: boolean;
  voice: { voiceId?: string; voiceName?: string; stability: number; similarity: number; style: number; speed: number };
  avatar: { type: "avatar" | "talking_photo"; avatarId?: string; talkingPhotoId?: string; photoFile?: string };
};

export type Layout = "fullscreen" | "split" | "podcast" | "pip" | "frame";
export type MediaFile = { file: string; name: string };

export const LAYOUTS: { value: Layout; label: string; description: string; usesMedia?: boolean }[] = [
  { value: "fullscreen", label: "Tela cheia", description: "Você ocupando a tela toda, estilo Reels clássico." },
  { value: "split", label: "Tela dividida", description: "Vídeo de apoio em cima (gameplay, produto, prints) e você embaixo.", usesMedia: true },
  { value: "podcast", label: "Podcast", description: "Estúdio: cartão com a câmera, onda sonora, nome e título do episódio." },
  { value: "pip", label: "Apresentador", description: "Conteúdo em tela cheia e você numa janela no canto (react/aula).", usesMedia: true },
  { value: "frame", label: "Moldura", description: "Você num cartão central sobre fundo desfocado, título em cima." },
];

export type EditOptions = {
  format: Format;
  layouts: Layout[];
  cuts: boolean;
  media: MediaFile[];
  layoutTitle: string;
  background: string;
  captions: {
    enabled: boolean;
    style: "karaoke" | "simple";
    wordsPerLine: number;
    position: "bottom" | "middle" | "top";
    fontSize: number;
    color: string;
    highlight: string;
    uppercase: boolean;
  };
  hook: { enabled: boolean; text: string; seconds: number };
  watermark: { enabled: boolean; text: string };
  music: { file?: string; name?: string; volume: number };
};

export type StepKey = "voice" | "avatar" | "transcribe" | "plan" | "edit";

export type AutoOptions = {
  mode: "full" | "clips";
  clipCount: number;
  clipLength: "short" | "medium" | "long";
  removePauses: boolean;
  removeFillers: boolean;
};

export type Clip = { id: string; title: string; hook: string; reason?: string; start: number; end: number; duration?: number };

export type Job = {
  id: string;
  title: string;
  copy: string;
  kind?: "ai" | "upload";
  source?: { file: string; name: string };
  auto?: AutoOptions;
  options: EditOptions;
  status: "queued" | "running" | "done" | "error";
  steps: Partial<Record<StepKey, { status: "pending" | "running" | "done" | "error"; message?: string }>>;
  error?: string;
  providers: { voice?: string; avatar?: string; transcribe?: string; clips?: string };
  outputs: {
    final?: string;
    thumb?: string;
    srt?: string;
    duration?: number;
    renders?: { layout: Layout; file: string; thumb: string; clip?: string }[];
    clips?: Clip[];
  };
  createdAt: string;
  updatedAt: string;
};

export type Status = {
  voice: "elevenlabs" | "mock";
  avatar: "heygen" | "mock";
  transcribe: "elevenlabs" | "openai" | "mock";
  clips: "claude" | "openai" | "auto";
};
export type Voice = { id: string; name: string; category: string };
export type Avatar = { id: string; name: string; preview: string; type: "avatar" | "talking_photo" };

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Erro ${res.status}`);
  return data as T;
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  status: () => call<Status>("/api/status"),
  profile: () => call<Profile>("/api/profile"),
  saveProfile: (p: Partial<Profile>) => call<Profile>("/api/profile", json("PUT", p)),
  cloneVoice: (name: string, files: File[]) => {
    const form = new FormData();
    form.append("name", name);
    files.forEach((f) => form.append("samples", f));
    return call<Profile>("/api/profile/voice", { method: "POST", body: form });
  },
  uploadPhoto: (file: File) => {
    const form = new FormData();
    form.append("photo", file);
    return call<Profile>("/api/profile/photo", { method: "POST", body: form });
  },
  voices: () => call<Voice[]>("/api/voices"),
  avatars: () => call<Avatar[]>("/api/avatars"),
  uploadMusic: (file: File) => {
    const form = new FormData();
    form.append("music", file);
    return call<{ file: string; name: string }>("/api/music", { method: "POST", body: form });
  },
  uploadMedia: (files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("media", f));
    return call<MediaFile[]>("/api/media", { method: "POST", body: form });
  },
  jobs: () => call<Job[]>("/api/jobs"),
  createJob: (title: string, copy: string, options: EditOptions) =>
    call<Job>("/api/jobs", json("POST", { title, copy, options })),
  /** Upload com progresso (vídeos grandes). */
  uploadVideo: (file: File, payload: { title: string; options: EditOptions; auto: AutoOptions }, onProgress: (pct: number) => void) =>
    new Promise<Job>((resolve, reject) => {
      const form = new FormData();
      form.append("payload", JSON.stringify(payload));
      form.append("video", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/jobs/upload");
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.error ?? `Erro ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error("Falha de rede no envio do vídeo."));
      xhr.send(form);
    }),
  retry: (id: string) => call<Job>(`/api/jobs/${id}/retry`, { method: "POST" }),
  reedit: (id: string, options: EditOptions) => call<Job>(`/api/jobs/${id}/reedit`, json("POST", { options })),
  remove: (id: string) => call<void>(`/api/jobs/${id}`, { method: "DELETE" }),
};

export const defaultOptions = (handle = ""): EditOptions => ({
  format: "9:16",
  layouts: ["fullscreen"],
  cuts: true,
  media: [],
  layoutTitle: "",
  background: "#0f172a",
  captions: {
    enabled: true,
    style: "karaoke",
    wordsPerLine: 3,
    position: "bottom",
    fontSize: 78,
    color: "#FFFFFF",
    highlight: "#FACC15",
    uppercase: true,
  },
  hook: { enabled: false, text: "", seconds: 3 },
  watermark: { enabled: !!handle, text: handle },
  music: { volume: 0.12 },
});

export const defaultAuto = (): AutoOptions => ({
  mode: "clips",
  clipCount: 0,
  clipLength: "medium",
  removePauses: true,
  removeFillers: true,
});
