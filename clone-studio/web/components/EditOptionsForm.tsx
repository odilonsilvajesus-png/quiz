import { useState } from "react";
import { api, type EditOptions } from "../api";
import { Segmented, Slider, Toggle } from "./ui";

type Props = { value: EditOptions; onChange: (v: EditOptions) => void; photoUrl?: string };

export function EditOptionsForm({ value: o, onChange, photoUrl }: Props) {
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof EditOptions>(key: K, patch: Partial<EditOptions[K]> | EditOptions[K]) =>
    onChange({ ...o, [key]: typeof patch === "object" ? { ...(o[key] as object), ...patch } : patch });

  async function onMusic(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const m = await api.uploadMusic(file);
      set("music", { file: m.file, name: m.name });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_220px]">
      <div className="space-y-6">
        <div>
          <span className="label">Formato</span>
          <Segmented
            value={o.format}
            onChange={(v) => set("format", v)}
            options={[
              { value: "9:16", label: "9:16 Reels/TikTok/Shorts" },
              { value: "1:1", label: "1:1 Feed" },
              { value: "16:9", label: "16:9 YouTube" },
            ]}
          />
        </div>

        <div className="space-y-4">
          <Toggle checked={o.captions.enabled} onChange={(v) => set("captions", { enabled: v })} label="Legendas automáticas" />
          {o.captions.enabled && (
            <div className="grid gap-4 rounded-xl border border-zinc-800 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <Segmented
                  value={o.captions.style}
                  onChange={(v) => set("captions", { style: v })}
                  options={[
                    { value: "karaoke", label: "Palavra destacada" },
                    { value: "simple", label: "Simples" },
                  ]}
                />
                <Segmented
                  value={o.captions.position}
                  onChange={(v) => set("captions", { position: v })}
                  options={[
                    { value: "top", label: "Topo" },
                    { value: "middle", label: "Meio" },
                    { value: "bottom", label: "Base" },
                  ]}
                />
              </div>
              <Slider label="Palavras por linha" min={1} max={7} step={1} value={o.captions.wordsPerLine} onChange={(v) => set("captions", { wordsPerLine: v })} />
              <Slider label="Tamanho" min={40} max={120} step={2} value={o.captions.fontSize} onChange={(v) => set("captions", { fontSize: v })} />
              <label className="flex items-center gap-3 text-sm">
                <input type="color" value={o.captions.color} onChange={(e) => set("captions", { color: e.target.value })} className="h-8 w-10 rounded bg-transparent" />
                Cor do texto
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="color" value={o.captions.highlight} onChange={(e) => set("captions", { highlight: e.target.value })} className="h-8 w-10 rounded bg-transparent" />
                Cor do destaque
              </label>
              <Toggle checked={o.captions.uppercase} onChange={(v) => set("captions", { uppercase: v })} label="CAIXA ALTA" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Toggle checked={o.hook.enabled} onChange={(v) => set("hook", { enabled: v })} label="Título de gancho no início" />
          {o.hook.enabled && (
            <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
              <input className="input" placeholder="Ex.: O erro que ninguém te conta" value={o.hook.text} onChange={(e) => set("hook", { text: e.target.value })} />
              <Slider label="Duração" min={1} max={8} step={0.5} value={o.hook.seconds} onChange={(v) => set("hook", { seconds: v })} format={(v) => `${v}s`} />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Toggle checked={o.watermark.enabled} onChange={(v) => set("watermark", { enabled: v })} label="Marca d'água (@ do perfil)" />
          {o.watermark.enabled && (
            <input className="input" placeholder="@seuperfil" value={o.watermark.text} onChange={(e) => set("watermark", { text: e.target.value })} />
          )}
        </div>

        <div className="space-y-3">
          <span className="label">Trilha de fundo</span>
          <div className="flex flex-wrap items-center gap-3">
            <label className="btn-ghost cursor-pointer">
              {uploading ? "Enviando…" : o.music.file ? "Trocar música" : "Escolher música"}
              <input type="file" accept="audio/*" className="hidden" onChange={(e) => onMusic(e.target.files?.[0])} />
            </label>
            {o.music.file && (
              <>
                <span className="max-w-48 truncate text-sm text-zinc-400">{o.music.name}</span>
                <button type="button" className="text-sm text-red-400 hover:underline" onClick={() => set("music", { file: undefined, name: undefined })}>
                  remover
                </button>
              </>
            )}
          </div>
          {o.music.file && (
            <Slider label="Volume da música" min={0.02} max={0.5} step={0.01} value={o.music.volume} onChange={(v) => set("music", { volume: v })} format={(v) => `${Math.round(v * 100)}%`} />
          )}
          <p className="hint">A música abaixa automaticamente quando você fala. Use apenas músicas livres de direitos.</p>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input type="color" value={o.background} onChange={(e) => set("background", e.target.value)} className="h-8 w-10 rounded bg-transparent" />
          Cor de fundo do avatar
        </label>
      </div>

      <Preview o={o} photoUrl={photoUrl} />
    </div>
  );
}

function Preview({ o, photoUrl }: { o: EditOptions; photoUrl?: string }) {
  const ratio = { "9:16": "9 / 16", "1:1": "1 / 1", "16:9": "16 / 9" }[o.format];
  const words = ["ISSO", "VAI", "MUDAR"].map((w) => (o.captions.uppercase ? w : w.toLowerCase()));
  const pos = { top: "top-[12%]", middle: "top-1/2 -translate-y-1/2", bottom: "bottom-[20%]" }[o.captions.position];
  const size = (o.captions.fontSize / 1080) * 220;
  return (
    <div className="md:sticky md:top-4 self-start">
      <span className="label">Prévia</span>
      <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-700" style={{ aspectRatio: ratio, background: o.background }}>
        {photoUrl && <img src={photoUrl} alt="" className="absolute inset-0 size-full object-cover" />}
        {o.hook.enabled && o.hook.text && (
          <div className="absolute inset-x-3 top-[10%] text-center">
            <span className="inline-block bg-white px-2 py-1 text-xs font-extrabold text-black">{o.hook.text}</span>
          </div>
        )}
        {o.watermark.enabled && o.watermark.text && <div className="absolute right-2 top-2 text-[9px] font-bold text-white/70">{o.watermark.text}</div>}
        {o.captions.enabled && (
          <div className={`absolute inset-x-2 text-center font-extrabold ${pos}`} style={{ fontSize: size, color: o.captions.color, textShadow: "0 0 3px #000, 0 2px 2px #000" }}>
            {words.slice(0, Math.max(1, Math.min(3, o.captions.wordsPerLine))).map((w, i) => (
              <span key={w} style={i === 1 && o.captions.style === "karaoke" ? { color: o.captions.highlight } : undefined}>
                {w}{" "}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
