export type Format = "9:16" | "1:1" | "16:9";

export type Profile = {
  name: string;
  handle: string;
  consent: boolean;
  voice: { voiceId?: string; voiceName?: string; stability: number; similarity: number; style: number; speed: number };
  avatar: { type: "avatar" | "talking_photo"; avatarId?: string; talkingPhotoId?: string; photoFile?: string };
};

export type EditOptions = {
  format: Format;
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

export type StepKey = "voice" | "avatar" | "edit";

export type Job = {
  id: string;
  title: string;
  copy: string;
  options: EditOptions;
  status: "queued" | "running" | "done" | "error";
  steps: Record<StepKey, { status: "pending" | "running" | "done" | "error"; message?: string }>;
  error?: string;
  providers: { voice: string; avatar: string };
  outputs: { final?: string; thumb?: string; srt?: string; duration?: number };
  createdAt: string;
  updatedAt: string;
};

export type Status = { voice: "elevenlabs" | "mock"; avatar: "heygen" | "mock" };
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
  jobs: () => call<Job[]>("/api/jobs"),
  createJob: (title: string, copy: string, options: EditOptions) =>
    call<Job>("/api/jobs", json("POST", { title, copy, options })),
  retry: (id: string) => call<Job>(`/api/jobs/${id}/retry`, { method: "POST" }),
  reedit: (id: string, options: EditOptions) => call<Job>(`/api/jobs/${id}/reedit`, json("POST", { options })),
  remove: (id: string) => call<void>(`/api/jobs/${id}`, { method: "DELETE" }),
};

export const defaultOptions = (handle = ""): EditOptions => ({
  format: "9:16",
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
