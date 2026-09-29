import { useEffect, useState } from "react";
import { api, defaultAuto, defaultOptions, type AutoOptions, type EditOptions, type Profile, type Status } from "../api";
import { EditOptionsForm } from "./EditOptionsForm";
import { Alert, Section, Segmented, Slider, Toggle } from "./ui";

const STORAGE_KEY = "clone-studio:options";
const MODE_KEY = "clone-studio:mode";
const AUTO_KEY = "clone-studio:auto";

type Mode = "ai" | "upload";

function load<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return typeof fallback === "object" && fallback ? { ...fallback, ...parsed } : parsed;
    }
  } catch {
    // ignora preferências corrompidas
  }
  return fallback;
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // armazenamento indisponível: segue sem lembrar preferências
  }
}

export function NewVideo({ profile, status, onCreated }: { profile: Profile; status: Status; onCreated: () => void }) {
  const [mode, setMode] = useState<Mode>(() => load<Mode>(MODE_KEY, "ai"));
  const [title, setTitle] = useState("");
  const [copy, setCopy] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [auto, setAuto] = useState<AutoOptions>(() => load(AUTO_KEY, defaultAuto()));
  const [options, setOptions] = useState<EditOptions>(() => load(STORAGE_KEY, defaultOptions(profile.handle)));
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => save(STORAGE_KEY, options), [options]);
  useEffect(() => save(AUTO_KEY, auto), [auto]);
  useEffect(() => save(MODE_KEY, mode), [mode]);

  // Várias copies separadas por uma linha com "---" viram vários vídeos de uma vez.
  const scripts = copy.split(/^\s*---\s*$/m).map((s) => s.trim()).filter(Boolean);
  const chars = scripts.reduce((n, s) => n + s.length, 0);
  const seconds = Math.round(chars / 15);

  async function submit() {
    setSending(true);
    setError(null);
    try {
      if (mode === "upload") {
        if (!video) return;
        setProgress(0);
        await api.uploadVideo(video, { title, options, auto }, setProgress);
        setVideo(null);
      } else {
        for (const [i, s] of scripts.entries()) {
          await api.createJob(scripts.length > 1 ? `${title || "Vídeo"} ${i + 1}` : title, s, options);
        }
        setCopy("");
      }
      setTitle("");
      onCreated();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
      setProgress(null);
    }
  }

  const photoUrl = mode === "ai" && profile.avatar.photoFile ? `/files/uploads/${profile.avatar.photoFile}` : undefined;
  const ready = mode === "ai" ? scripts.length > 0 && profile.consent : !!video;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <ModeCard
          active={mode === "ai"}
          onClick={() => setMode("ai")}
          icon="🤖"
          title="Gerar 100% com IA"
          text="Você escreve a copy e o seu clone grava com a sua voz. Depois a edição é automática."
        />
        <ModeCard
          active={mode === "upload"}
          onClick={() => setMode("upload")}
          icon="🎬"
          title="Editar vídeo gravado"
          text="Você sobe um vídeo seu (aula, live, podcast…) e a plataforma tira as pausas, faz os cortes e edita sozinha."
        />
      </div>

      {mode === "ai" && !profile.consent && <Alert kind="warn">Antes de gerar, confirme o consentimento de uso da voz e imagem em “Meu Clone”.</Alert>}
      {error && <Alert kind="error">{error}</Alert>}

      {mode === "ai" ? (
        <Section title="Copy" subtitle="O texto que o seu clone vai falar. Escreva como você fala.">
          <div className="space-y-4">
            <input className="input" placeholder="Título interno (opcional)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea
              className="input min-h-56 resize-y leading-relaxed"
              placeholder={"Você sabia que 90% das pessoas desistem antes de ver resultado?\n\nHoje eu vou te mostrar…\n\n---\n\n(use uma linha com --- para gerar vários vídeos de uma vez)"}
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
              <span>
                {chars} caracteres · ~{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} de vídeo
                {scripts.length > 1 && <b className="text-brand-400"> · {scripts.length} vídeos</b>}
              </span>
              <span className="hint mt-0">Dica: pontuação (, . ! ?) cria pausas naturais na fala.</span>
            </div>
          </div>
        </Section>
      ) : (
        <Section
          title="Seu vídeo"
          subtitle={
            status.transcribe !== "mock"
              ? "A fala é transcrita para gerar legendas, tirar pausas e escolher os cortes."
              : "Modo demo: sem chave da ElevenLabs ou da OpenAI não há transcrição — as pausas saem pelo silêncio e os cortes por duração, sem legendas."
          }
        >
          <div className="space-y-5">
            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition ${video ? "border-brand-500 bg-brand-600/10" : "border-zinc-700 hover:border-zinc-500"}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f?.type.startsWith("video/")) setVideo(f);
              }}
            >
              <span className="text-3xl">🎞️</span>
              {video ? (
                <>
                  <span className="font-semibold">{video.name}</span>
                  <span className="text-xs text-zinc-400">{(video.size / 1024 / 1024).toFixed(0)} MB · clique para trocar</span>
                </>
              ) : (
                <>
                  <span className="font-semibold">Arraste o vídeo aqui ou clique para escolher</span>
                  <span className="text-xs text-zinc-500">MP4, MOV, WEBM… horizontal ou vertical</span>
                </>
              )}
              <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && setVideo(e.target.files[0])} />
            </label>

            <input className="input" placeholder="Título / assunto do vídeo (ajuda a IA a escolher os cortes)" value={title} onChange={(e) => setTitle(e.target.value)} />

            <div className="space-y-4">
              <Segmented
                value={auto.mode}
                onChange={(v) => setAuto({ ...auto, mode: v })}
                options={[
                  { value: "clips", label: "✂️ Gerar vários cortes" },
                  { value: "full", label: "Vídeo inteiro editado" },
                ]}
              />
              {auto.mode === "clips" && (
                <div className="grid gap-4 rounded-xl border border-zinc-800 p-4 sm:grid-cols-2">
                  <div>
                    <span className="label">Duração de cada corte</span>
                    <Segmented
                      value={auto.clipLength}
                      onChange={(v) => setAuto({ ...auto, clipLength: v })}
                      options={[
                        { value: "short", label: "15–35s" },
                        { value: "medium", label: "30–65s" },
                        { value: "long", label: "55–95s" },
                      ]}
                    />
                  </div>
                  <Slider
                    label="Quantidade de cortes"
                    min={0}
                    max={12}
                    step={1}
                    value={auto.clipCount}
                    onChange={(v) => setAuto({ ...auto, clipCount: v })}
                    format={(v) => (v === 0 ? "automático" : String(v))}
                  />
                  <p className="hint sm:col-span-2">
                    {status.clips !== "auto"
                      ? `A IA (${status.clips === "claude" ? "Claude" : "GPT"}) lê a transcrição, escolhe os trechos com mais potencial e escreve título e gancho de cada corte.`
                      : "Sem chave de IA (OpenAI ou Anthropic) os cortes seguem a ordem do vídeo, fechando em frases completas. Com a chave, a IA escolhe os melhores trechos."}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-6">
                <Toggle checked={auto.removePauses} onChange={(v) => setAuto({ ...auto, removePauses: v })} label="Tirar pausas e silêncios" />
                <Toggle checked={auto.removeFillers} onChange={(v) => setAuto({ ...auto, removeFillers: v })} label="Tirar vícios (“é…”, “hã”, “hum”)" />
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section title="Edição" subtitle={mode === "ai" ? "Aplicada automaticamente depois que o clone gravar." : "Aplicada em cada corte."}>
        <EditOptionsForm value={options} onChange={setOptions} photoUrl={photoUrl} />
      </Section>

      <div className="flex items-center justify-end gap-4">
        {progress !== null && (
          <div className="flex w-64 items-center gap-3 text-sm text-zinc-400">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            {progress}%
          </div>
        )}
        <button className="btn-primary px-6 py-3 text-base" disabled={!ready || sending} onClick={submit}>
          {sending
            ? progress !== null ? "Enviando vídeo…" : "Enviando…"
            : mode === "upload"
              ? auto.mode === "clips" ? "Gerar cortes" : "Editar vídeo"
              : scripts.length > 1 ? `Gerar ${scripts.length} vídeos` : "Gerar vídeo"}
        </button>
      </div>
    </div>
  );
}

function ModeCard({ active, onClick, icon, title, text }: { active: boolean; onClick: () => void; icon: string; title: string; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`card flex items-start gap-4 text-left transition ${active ? "border-brand-500 bg-brand-600/10 ring-2 ring-brand-500/30" : "hover:border-zinc-600"}`}
    >
      <span className="text-3xl">{icon}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-1 block text-sm text-zinc-400">{text}</span>
      </span>
    </button>
  );
}
