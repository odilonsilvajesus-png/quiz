export type Format = "9:16" | "1:1" | "16:9";

/** Modelos de edição: cada um gera um vídeo final diferente a partir do mesmo clone. */
export type Layout = "fullscreen" | "split" | "podcast" | "pip" | "frame";

export type MediaFile = { file: string; name: string };

export type Profile = {
  name: string;
  handle: string;
  consent: boolean;
  voice: {
    voiceId?: string;
    voiceName?: string;
    stability: number;
    similarity: number;
    style: number;
    speed: number;
  };
  avatar: {
    type: "avatar" | "talking_photo";
    avatarId?: string;
    talkingPhotoId?: string;
    /** Foto local (usada no modo demo e como capa do clone). */
    photoFile?: string;
  };
};

export type EditOptions = {
  format: Format;
  layouts: Layout[];
  /** Cortes dinâmicos: alterna enquadramento aberto/fechado a cada frase. */
  cuts: boolean;
  /** Vídeos/imagens de apoio (parte de cima da tela dividida, fundo do apresentador). */
  media: MediaFile[];
  /** Título do podcast / manchete exibida nos modelos que têm cabeçalho. */
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
  music: { file?: string; volume: number };
};

/** Como o vídeo nasce: 100% IA (copy → clone) ou a partir de um vídeo gravado. */
export type JobKind = "ai" | "upload";

export type AutoOptions = {
  /** Vídeo inteiro editado, ou vários cortes curtos escolhidos automaticamente. */
  mode: "full" | "clips";
  /** 0 = quantos a IA achar bons. */
  clipCount: number;
  clipLength: "short" | "medium" | "long";
  removePauses: boolean;
  removeFillers: boolean;
};

export type Clip = {
  id: string;
  title: string;
  hook: string;
  reason?: string;
  /** Trecho no vídeo original, em segundos. */
  start: number;
  end: number;
  /** Vídeo do trecho já sem pausas, e as palavras no tempo desse arquivo. */
  file?: string;
  words?: Word[];
  duration?: number;
};

export type StepKey = "voice" | "avatar" | "transcribe" | "plan" | "edit";
export type StepStatus = "pending" | "running" | "done" | "error";

export type Render = { layout: Layout; file: string; thumb: string; clip?: string };

export type Word = { text: string; start: number; end: number };

export type Job = {
  id: string;
  title: string;
  copy: string;
  options: EditOptions;
  kind?: JobKind;
  source?: { file: string; name: string };
  auto?: AutoOptions;
  status: "queued" | "running" | "done" | "error";
  steps: Partial<Record<StepKey, { status: StepStatus; message?: string }>>;
  error?: string;
  providers: { voice?: "elevenlabs" | "mock"; avatar?: "heygen" | "mock"; transcribe?: "elevenlabs" | "openai" | "mock"; clips?: "claude" | "openai" | "auto" };
  outputs: {
    audio?: string;
    words?: Word[];
    raw?: string;
    final?: string;
    renders?: Render[];
    clips?: Clip[];
    srt?: string;
    thumb?: string;
    duration?: number;
  };
  external: { heygenVideoId?: string };
  createdAt: string;
  updatedAt: string;
};
