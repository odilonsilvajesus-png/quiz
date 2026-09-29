import { useState } from "react";
import { api, LAYOUTS, type EditOptions, type Format, type Layout } from "../api";
import { Segmented, Slider, Toggle } from "./ui";

type Props = { value: EditOptions; onChange: (v: EditOptions) => void; photoUrl?: string };

export function EditOptionsForm({ value: o, onChange, photoUrl }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const set = <K extends keyof EditOptions>(key: K, patch: Partial<EditOptions[K]> | EditOptions[K]) =>
    onChange({ ...o, [key]: typeof patch === "object" ? { ...(o[key] as object), ...patch } : patch });

  async function onMedia(files: File[]) {
    if (!files.length) return;
    setUploadingMedia(true);
    try {
      const added = await api.uploadMedia(files);
      onChange({ ...o, media: [...o.media, ...added] });
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploadingMedia(false);
    }
  }

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

        <div className="space-y-3">
          <div>
            <span className="label">Modelos de edição</span>
            <p className="hint -mt-1 mb-3">Marque quantos quiser — cada modelo vira um vídeo pronto, usando o mesmo clone (sem custo extra de IA).</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {LAYOUTS.map((l) => {
                const active = o.layouts.includes(l.value);
                return (
                  <button
                    key={l.value}
                    type="button"
                    title={l.description}
                    onClick={() => {
                      const next = active ? o.layouts.filter((x) => x !== l.value) : [...o.layouts, l.value];
                      if (next.length) set("layouts", next);
                    }}
                    className={`rounded-xl border p-2 text-left transition ${active ? "border-brand-500 bg-brand-600/10 ring-2 ring-brand-500/30" : "border-zinc-800 hover:border-zinc-600"}`}
                  >
                    <LayoutIcon layout={l.value} format={o.format} />
                    <div className="mt-2 flex items-center justify-between text-sm font-medium">
                      {l.label}
                      <span className={`grid size-4 place-items-center rounded text-[10px] ${active ? "bg-brand-500 text-white" : "border border-zinc-600"}`}>{active && "✓"}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-3 text-[11px] leading-snug text-zinc-500">{l.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Toggle checked={o.cuts} onChange={(v) => set("cuts", v)} label="Cortes dinâmicos (alterna plano aberto e close a cada frase)" />

          {o.layouts.some((l) => l !== "fullscreen") && (
            <div>
              <label className="label">Título do vídeo / episódio</label>
              <input
                className="input"
                placeholder={o.layouts.includes("podcast") ? "Ex.: PODCAST FOCO TOTAL — EP. 12" : "Ex.: 3 erros que te travam"}
                value={o.layoutTitle}
                onChange={(e) => set("layoutTitle", e.target.value)}
              />
              <p className="hint">Aparece no topo do podcast, da moldura e do apresentador (e na tela dividida quando não há vídeo de apoio).</p>
            </div>
          )}

          {o.layouts.some((l) => LAYOUTS.find((x) => x.value === l)?.usesMedia) && (
            <div className="rounded-xl border border-zinc-800 p-4">
              <span className="label">Vídeos e imagens de apoio</span>
              <p className="hint -mt-1 mb-3">
                Usados na tela dividida e no apresentador. Eles se alternam a cada frase. Ex.: gameplay, demonstração do produto, prints, slides.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {o.media.map((m, i) => (
                  <span key={m.file} className="flex items-center gap-2 rounded-lg bg-zinc-800 px-2 py-1 text-xs">
                    {i + 1}. <span className="max-w-36 truncate">{m.name}</span>
                    <button type="button" className="text-red-400" onClick={() => set("media", o.media.filter((x) => x.file !== m.file))}>×</button>
                  </span>
                ))}
                <label className="btn-ghost cursor-pointer py-1.5">
                  {uploadingMedia ? "Enviando…" : "+ Adicionar"}
                  <input type="file" accept="video/*,image/*" multiple className="hidden" onChange={(e) => onMedia(Array.from(e.target.files ?? []))} />
                </label>
              </div>
            </div>
          )}
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

/** Desenho esquemático de cada modelo: roxo = você, cinza = mídia de apoio. */
export function LayoutIcon({ layout, format }: { layout: Layout; format: Format }) {
  const vertical = format !== "16:9";
  const me = "absolute rounded-[3px] bg-brand-500";
  const media = "absolute bg-zinc-500";
  return (
    <div className="mx-auto h-24 overflow-hidden">
      <div
        className="relative mx-auto h-full overflow-hidden rounded-md bg-zinc-800"
        style={{ aspectRatio: { "9:16": "9 / 16", "1:1": "1 / 1", "16:9": "16 / 9" }[format], maxWidth: "100%" }}
      >
        {layout === "fullscreen" && <div className={`${me} inset-0 rounded-none`} />}
        {layout === "split" &&
          (vertical ? (
            <>
              <div className={`${media} inset-x-0 top-0 h-1/2`} />
              <div className={`${me} inset-x-0 bottom-0 h-1/2 rounded-none`} />
            </>
          ) : (
            <>
              <div className={`${media} inset-y-0 left-0 w-1/2`} />
              <div className={`${me} inset-y-0 right-0 w-1/2 rounded-none`} />
            </>
          ))}
        {layout === "podcast" && (
          <>
            <div className="absolute inset-x-[15%] top-[5%] h-[3px] rounded bg-white/70" />
            <div className={`${me} inset-x-[6%] top-[14%] h-[48%] ring-1 ring-white`} />
            <div className="absolute inset-x-[6%] top-[66%] flex h-[8%] items-center gap-[2px]">
              {[3, 6, 4, 8, 5, 7, 3, 6, 4, 5].map((h, i) => (
                <span key={i} className="flex-1 rounded bg-amber-400" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
          </>
        )}
        {layout === "pip" && (
          <>
            <div className={`${media} inset-0`} />
            <div className={`${me} right-[6%] ${vertical ? "top-[60%] h-[30%] w-[45%]" : "bottom-[8%] h-[40%] w-[26%]"} ring-1 ring-white`} />
          </>
        )}
        {layout === "frame" && (
          <>
            <div className="absolute inset-0 bg-brand-500/30 blur-[2px]" />
            <div className="absolute inset-x-[20%] top-[10%] h-[3px] rounded bg-white/70" />
            <div className={`${me} inset-x-[7%] ${vertical ? "top-[22%] h-[42%]" : "top-[15%] h-[70%]"} ring-1 ring-white`} />
          </>
        )}
      </div>
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
