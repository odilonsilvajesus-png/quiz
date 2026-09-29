import { useEffect, useState } from "react";
import { api, defaultOptions, type EditOptions, type Profile } from "../api";
import { EditOptionsForm } from "./EditOptionsForm";
import { Alert, Section } from "./ui";

const STORAGE_KEY = "clone-studio:options";

function loadOptions(handle: string): EditOptions {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultOptions(handle), ...JSON.parse(saved) };
  } catch {
    // ignora preferências corrompidas
  }
  return defaultOptions(handle);
}

export function NewVideo({ profile, onCreated }: { profile: Profile; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [copy, setCopy] = useState("");
  const [options, setOptions] = useState<EditOptions>(() => loadOptions(profile.handle));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
    } catch {
      // armazenamento indisponível: segue sem lembrar preferências
    }
  }, [options]);

  // Várias copies separadas por uma linha com "---" viram vários vídeos de uma vez.
  const scripts = copy.split(/^\s*---\s*$/m).map((s) => s.trim()).filter(Boolean);
  const chars = scripts.reduce((n, s) => n + s.length, 0);
  const seconds = Math.round(chars / 15);

  async function submit() {
    setSending(true);
    setError(null);
    try {
      for (const [i, s] of scripts.entries()) {
        await api.createJob(scripts.length > 1 ? `${title || "Vídeo"} ${i + 1}` : title, s, options);
      }
      setCopy("");
      setTitle("");
      onCreated();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  const photoUrl = profile.avatar.photoFile ? `/files/uploads/${profile.avatar.photoFile}` : undefined;

  return (
    <div className="space-y-6">
      {!profile.consent && <Alert kind="warn">Antes de gerar, confirme o consentimento de uso da voz e imagem em “Meu Clone”.</Alert>}
      {error && <Alert kind="error">{error}</Alert>}

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

      <Section title="Edição" subtitle="Aplicada automaticamente depois que o clone gravar.">
        <EditOptionsForm value={options} onChange={setOptions} photoUrl={photoUrl} />
      </Section>

      <div className="flex justify-end">
        <button className="btn-primary px-6 py-3 text-base" disabled={!scripts.length || sending || !profile.consent} onClick={submit}>
          {sending ? "Enviando…" : scripts.length > 1 ? `Gerar ${scripts.length} vídeos` : "Gerar vídeo"}
        </button>
      </div>
    </div>
  );
}
