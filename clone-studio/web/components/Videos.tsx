import { useState } from "react";
import { api, defaultOptions, LAYOUTS, type EditOptions, type Job, type Layout, type StepKey } from "../api";
import { EditOptionsForm } from "./EditOptionsForm";

const STEPS: Record<"ai" | "upload", { key: StepKey; label: string }[]> = {
  ai: [
    { key: "voice", label: "Voz" },
    { key: "avatar", label: "Clone" },
    { key: "edit", label: "Edição" },
  ],
  upload: [
    { key: "transcribe", label: "Transcrição" },
    { key: "plan", label: "Cortes" },
    { key: "edit", label: "Edição" },
  ],
};

const layoutLabel = (l?: Layout) => LAYOUTS.find((x) => x.value === l)?.label ?? l ?? "";

function downloadAll(urls: string[]) {
  // Espaça os downloads para o navegador não bloquear.
  urls.forEach((url, i) =>
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = url;
      a.click();
    }, i * 700),
  );
}

export function Videos({ jobs, refresh, onNew }: { jobs: Job[]; refresh: () => void; onNew: () => void }) {
  if (!jobs.length) {
    return (
      <div className="card py-16 text-center">
        <p className="text-zinc-400">Nenhum vídeo ainda.</p>
        <button className="btn-primary mt-4" onClick={onNew}>Criar o primeiro vídeo</button>
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} refresh={refresh} />
      ))}
    </div>
  );
}

function JobCard({ job, refresh }: { job: Job; refresh: () => void }) {
  const [editing, setEditing] = useState<EditOptions | null>(null);
  const [copied, setCopied] = useState(false);
  const busy = job.status === "queued" || job.status === "running";
  const version = encodeURIComponent(job.updatedAt);
  const ratio = { "9:16": "9 / 16", "1:1": "1 / 1", "16:9": "16 / 9" }[job.options.format];
  const kind = job.kind ?? "ai";
  const steps = STEPS[kind];
  const current = steps.find((s) => job.steps[s.key]?.status === "running" || job.steps[s.key]?.status === "error");
  // Jobs antigos só têm outputs.final; os novos têm um render por corte e por modelo de edição.
  const renders: { layout: Layout; file: string; thumb: string; clip?: string }[] =
    job.outputs.renders ?? (job.outputs.final ? [{ layout: "fullscreen", file: job.outputs.final, thumb: job.outputs.thumb ?? "" }] : []);
  const clips = (job.outputs.clips ?? []).filter((c) => renders.some((r) => r.clip === c.id));
  const [clipId, setClipId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Layout | null>(null);
  const clip = clips.find((c) => c.id === clipId) ?? clips[0];
  const clipRenders = clip ? renders.filter((r) => r.clip === clip.id) : renders;
  const render = clipRenders.find((r) => r.layout === selected) ?? clipRenders[0];
  const query = (r?: { layout: Layout; clip?: string }) =>
    job.outputs.renders && r ? `?layout=${r.layout}${r.clip ? `&clip=${r.clip}` : ""}` : "";
  const canReedit = !busy && steps.filter((s) => s.key !== "edit").every((s) => job.steps[s.key]?.status === "done");
  const text = clip ? `${clip.title}\n\n${clip.hook}` : job.copy;

  const act = (fn: () => Promise<unknown>) => fn().then(refresh).catch((e: Error) => alert(e.message));

  return (
    <article className="card flex flex-col gap-4 p-4">
      <div className="relative overflow-hidden rounded-xl bg-zinc-950" style={{ aspectRatio: ratio, maxHeight: 520 }}>
        {job.status === "done" && render ? (
          <video
            key={render.file}
            className="size-full object-contain"
            src={`/files/jobs/${job.id}/${render.file}?v=${version}`}
            poster={render.thumb ? `/files/jobs/${job.id}/${render.thumb}?v=${version}` : undefined}
            controls
            playsInline
            preload="none"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
            {busy && <div className="size-8 animate-spin rounded-full border-2 border-zinc-700 border-t-brand-500" />}
            <p className={`text-sm ${job.status === "error" ? "text-red-300" : "text-zinc-400"}`}>
              {job.status === "queued" ? "Na fila…" : current?.key ? job.steps[current.key]?.message : ""}
            </p>
          </div>
        )}
      </div>

      {job.status === "done" && clips.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {clips.map((c, i) => (
            <button
              key={c.id}
              title={c.title}
              onClick={() => setClipId(c.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${c.id === clip?.id ? "bg-fuchsia-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
            >
              Corte {i + 1}
            </button>
          ))}
        </div>
      )}

      {job.status === "done" && clipRenders.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {clipRenders.map((r) => (
            <button
              key={r.layout}
              onClick={() => setSelected(r.layout)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${r.layout === render?.layout ? "bg-brand-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
            >
              {layoutLabel(r.layout)}
            </button>
          ))}
        </div>
      )}

      {job.status === "done" && clip && clips.length > 1 && (
        <div className="rounded-xl bg-zinc-950/60 p-3 text-sm">
          <p className="font-semibold">{clip.title}</p>
          {clip.reason && <p className="mt-1 text-xs text-zinc-400">{clip.reason}</p>}
          <p className="mt-1 text-xs tabular-nums text-zinc-500">
            Trecho original {fmt(clip.start)}–{fmt(clip.end)}
            {clip.duration ? ` · ${Math.round(clip.duration)}s` : ""}
          </p>
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold">{job.title}</h3>
          {job.outputs.duration && clips.length <= 1 && <span className="shrink-0 text-xs tabular-nums text-zinc-500">{Math.round(job.outputs.duration)}s</span>}
        </div>
        <p className="text-xs text-zinc-500">
          {kind === "upload" ? "🎬 Vídeo gravado" : "🤖 Clone IA"} · {new Date(job.createdAt).toLocaleString("pt-BR")} · {job.options.format}
          {clips.length > 1 && ` · ${clips.length} cortes`}
          {(job.providers.voice === "mock" || job.providers.avatar === "mock" || job.providers.transcribe === "mock") && " · demo"}
        </p>
      </div>

      <ol className="flex gap-2">
        {steps.map((s) => {
          const st = job.steps[s.key]?.status ?? "pending";
          const color = { pending: "bg-zinc-800 text-zinc-500", running: "bg-brand-600/30 text-brand-400 animate-pulse", done: "bg-emerald-900/50 text-emerald-300", error: "bg-red-900/50 text-red-300" }[st];
          return (
            <li key={s.key} className={`flex-1 rounded-lg px-2 py-1 text-center text-xs font-medium ${color}`}>
              {st === "done" ? "✓ " : st === "error" ? "✕ " : ""}
              {s.label}
            </li>
          );
        })}
      </ol>

      {job.status === "error" && job.error && (
        <details className="text-xs text-red-300">
          <summary className="cursor-pointer">Ver erro</summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-red-300/80">{job.error}</pre>
        </details>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        {job.status === "done" && (
          <>
            <a className="btn-primary w-full" href={`/api/jobs/${job.id}/download/video${query(render)}`}>
              ⬇ Baixar {[clips.length > 1 && clip ? `corte ${clips.indexOf(clip) + 1}` : "", renders.length > 1 ? layoutLabel(render?.layout).toLowerCase() : ""].filter(Boolean).join(" · ") || "vídeo"}
            </a>
            {renders.length > 1 && (
              <button className="btn-ghost w-full" onClick={() => downloadAll(renders.map((r) => `/api/jobs/${job.id}/download/video${query(r)}`))}>
                ⬇ Baixar tudo ({renders.length} vídeos)
              </button>
            )}
            <a className="btn-ghost whitespace-nowrap" href={`/api/jobs/${job.id}/download/capa${query(render)}`} title="Baixar capa">Capa</a>
            <a className="btn-ghost" href={`/api/jobs/${job.id}/download/legendas${query(render)}`} title="Legendas .srt">SRT</a>
          </>
        )}
        {job.status === "error" && <button className="btn-primary flex-1" onClick={() => act(() => api.retry(job.id))}>Tentar de novo</button>}
        {canReedit && (
          <button className="btn-ghost" onClick={() => setEditing({ ...defaultOptions(), ...structuredClone(job.options) })}>Reeditar</button>
        )}
        <button
          className="btn-ghost"
          onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}
        >
          {copied ? "Copiado ✓" : clip ? "Copiar título" : "Copiar texto"}
        </button>
        {!busy && (
          <button className="btn text-red-400 hover:bg-red-950/50" onClick={() => confirm("Excluir este vídeo?") && act(() => api.remove(job.id))}>
            Excluir
          </button>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4" onClick={() => setEditing(null)}>
          <div className="card my-8 w-full max-w-4xl bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-lg font-semibold">Reeditar “{job.title}”</h2>
            <p className="mb-5 text-sm text-zinc-400">
              {kind === "upload"
                ? "Reaproveita a transcrição e os cortes já feitos — só a edição é refeita."
                : "Reaproveita a voz e o clone já gerados — só a edição é refeita, sem gastar créditos."}
            </p>
            <EditOptionsForm value={editing} onChange={setEditing} />
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="btn-primary" onClick={() => act(() => api.reedit(job.id, editing)).then(() => setEditing(null))}>Aplicar edição</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}
