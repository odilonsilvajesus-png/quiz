import { useEffect, useRef, useState } from "react";
import { api, type Avatar, type Profile, type Status, type Voice } from "../api";
import { Alert, Section, Slider, Toggle } from "./ui";

export function CloneSetup({ profile, setProfile, status }: { profile: Profile; setProfile: (p: Profile) => void; status: Status }) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [samples, setSamples] = useState<File[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.voices().then(setVoices).catch(() => {});
    api.avatars().then(setAvatars).catch(() => {});
  }, []);

  async function run(label: string, fn: () => Promise<Profile>) {
    setBusy(label);
    setError(null);
    try {
      setProfile(await fn());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const save = (patch: Partial<Profile>) => run("save", () => api.saveProfile(patch));
  const photoUrl = profile.avatar.photoFile ? `/files/uploads/${profile.avatar.photoFile}` : undefined;

  return (
    <div className="space-y-6">
      {error && <Alert kind="error">{error}</Alert>}

      <Section title="Seus dados" subtitle="Usados na marca d'água e no nome do clone." right={saved ? <span className="text-sm text-emerald-400">Salvo ✓</span> : null}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nome</label>
            <input className="input" defaultValue={profile.name} onBlur={(e) => save({ name: e.target.value })} />
          </div>
          <div>
            <label className="label">@ nas redes</label>
            <input className="input" placeholder="@seuperfil" defaultValue={profile.handle} onBlur={(e) => save({ handle: e.target.value })} />
          </div>
        </div>
        <div className="mt-4">
          <Toggle
            checked={profile.consent}
            onChange={(v) => save({ consent: v })}
            label="Confirmo que a voz e a imagem usadas no clone são minhas (ou tenho autorização por escrito da pessoa)."
          />
        </div>
      </Section>

      <Section title="1. Clone de voz" subtitle={status.voice === "elevenlabs" ? "ElevenLabs conectado." : "Modo demo — adicione ELEVENLABS_API_KEY no .env para clonar sua voz."}>
        {profile.voice.voiceId ? (
          <Alert>
            Voz ativa: <b>{profile.voice.voiceName ?? profile.voice.voiceId}</b>
          </Alert>
        ) : (
          <Alert kind="warn">Nenhuma voz configurada ainda.</Alert>
        )}

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Criar clone a partir de gravações</h3>
            <p className="text-sm text-zinc-400">
              Grave de 1 a 3 minutos falando naturalmente, sem música e sem eco. Quanto mais limpo o áudio, mais parecido fica.
            </p>
            <Recorder onRecorded={(f) => setSamples((s) => [...s, f])} />
            <label className="btn-ghost cursor-pointer">
              Enviar arquivos de áudio
              <input type="file" accept="audio/*,video/*" multiple className="hidden" onChange={(e) => setSamples((s) => [...s, ...Array.from(e.target.files ?? [])])} />
            </label>
            {samples.length > 0 && (
              <ul className="space-y-1 text-sm text-zinc-400">
                {samples.map((f, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="truncate">{f.name}</span>
                    <button className="text-red-400" onClick={() => setSamples((s) => s.filter((_, j) => j !== i))}>×</button>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="btn-primary"
              disabled={!samples.length || !profile.consent || status.voice !== "elevenlabs" || !!busy}
              onClick={() => run("voice", () => api.cloneVoice(profile.name || "Minha voz", samples)).then(() => setSamples([]))}
            >
              {busy === "voice" ? "Clonando…" : "Criar meu clone de voz"}
            </button>
          </div>

          <div className="space-y-4">
            {voices.length > 0 && (
              <div>
                <label className="label">Ou use uma voz já criada na sua conta</label>
                <select
                  className="input"
                  value={profile.voice.voiceId ?? ""}
                  onChange={(e) => {
                    const v = voices.find((x) => x.id === e.target.value);
                    save({ voice: { ...profile.voice, voiceId: v?.id, voiceName: v?.name } });
                  }}
                >
                  <option value="">Selecione…</option>
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <h3 className="text-sm font-semibold">Ajustes da voz</h3>
            {(
              [
                ["stability", "Estabilidade", 0, 1, 0.05, "Mais baixo = mais emoção/variação"],
                ["similarity", "Semelhança", 0, 1, 0.05, "Quão fiel ao seu timbre"],
                ["style", "Estilo/expressividade", 0, 1, 0.05, ""],
                ["speed", "Velocidade", 0.7, 1.2, 0.05, ""],
              ] as const
            ).map(([key, label, min, max, step, hint]) => (
              <div key={key}>
                <Slider
                  label={label}
                  min={min}
                  max={max}
                  step={step}
                  value={profile.voice[key]}
                  onChange={(v) => setProfile({ ...profile, voice: { ...profile.voice, [key]: v } })}
                  format={(v) => v.toFixed(2)}
                />
                {hint && <p className="hint">{hint}</p>}
              </div>
            ))}
            <button className="btn-ghost" onClick={() => save({ voice: profile.voice })}>Salvar ajustes</button>
          </div>
        </div>
      </Section>

      <Section title="2. Clone em vídeo (avatar)" subtitle={status.avatar === "heygen" ? "HeyGen conectado." : "Modo demo — adicione HEYGEN_API_KEY no .env para usar seu avatar com sincronização labial."}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Opção A — Avatar a partir de vídeo (recomendado)</h3>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-400">
              <li>No HeyGen, crie um <b>Instant Avatar</b>: grave ~2 min olhando para a câmera, boa luz, fundo limpo.</li>
              <li>Depois que ele ficar pronto, ele aparece na lista ao lado.</li>
              <li>Selecione-o — ele vai falar com a sua voz clonada.</li>
            </ol>
            <h3 className="pt-3 text-sm font-semibold">Opção B — Avatar a partir de uma foto</h3>
            <p className="text-sm text-zinc-400">Foto de rosto, de frente, bem iluminada. Mais rápido, porém menos realista.</p>
            <div className="flex items-center gap-4">
              {photoUrl && <img src={photoUrl} alt="Sua foto" className="size-16 rounded-xl object-cover" />}
              <label className={`btn-ghost cursor-pointer ${!profile.consent ? "pointer-events-none opacity-50" : ""}`}>
                {busy === "photo" ? "Enviando…" : "Enviar foto"}
                <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => e.target.files?.[0] && run("photo", () => api.uploadPhoto(e.target.files![0]))} />
              </label>
            </div>
          </div>

          <div>
            <span className="label">Avatar ativo</span>
            {avatars.length === 0 ? (
              <p className="text-sm text-zinc-500">
                {status.avatar === "heygen" ? "Nenhum avatar encontrado na sua conta HeyGen." : "No modo demo, sua foto é usada com um leve zoom animado."}
              </p>
            ) : (
              <div className="grid max-h-96 grid-cols-3 gap-3 overflow-y-auto pr-1">
                {avatars.map((a) => {
                  const active = a.type === "avatar" ? profile.avatar.type === "avatar" && profile.avatar.avatarId === a.id : profile.avatar.type === "talking_photo" && profile.avatar.talkingPhotoId === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => save({ avatar: { ...profile.avatar, type: a.type, ...(a.type === "avatar" ? { avatarId: a.id } : { talkingPhotoId: a.id }) } })}
                      className={`overflow-hidden rounded-xl border text-left text-xs transition ${active ? "border-brand-500 ring-2 ring-brand-500/40" : "border-zinc-800 hover:border-zinc-600"}`}
                    >
                      <img src={a.preview} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                      <div className="truncate px-2 py-1">{a.name}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

function Recorder({ onRecorded }: { onRecorded: (f: File) => void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const rec = useRef<MediaRecorder | null>(null);
  const timer = useRef<number>(0);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true } });
    const chunks: Blob[] = [];
    const r = new MediaRecorder(stream);
    r.ondataavailable = (e) => chunks.push(e.data);
    r.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const type = r.mimeType || "audio/webm";
      onRecorded(new File(chunks, `gravacao-${new Date().toISOString().slice(11, 19)}.${type.includes("mp4") ? "m4a" : "webm"}`, { type }));
    };
    r.start();
    rec.current = r;
    setSeconds(0);
    setRecording(true);
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    rec.current?.stop();
    clearInterval(timer.current);
    setRecording(false);
  }

  return recording ? (
    <button className="btn bg-red-600 text-white hover:bg-red-500" onClick={stop}>
      <span className="size-2 animate-pulse rounded-full bg-white" /> Parar ({Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")})
    </button>
  ) : (
    <button className="btn-ghost" onClick={() => start().catch(() => alert("Não foi possível acessar o microfone."))}>
      🎙️ Gravar pelo microfone
    </button>
  );
}
