import { useCallback, useEffect, useState } from "react";
import { api, type Job, type Profile, type Status } from "./api";
import { CloneSetup } from "./components/CloneSetup";
import { NewVideo } from "./components/NewVideo";
import { Videos } from "./components/Videos";

type Tab = "clone" | "new" | "videos";

export default function App() {
  const [tab, setTab] = useState<Tab>("new");
  const [status, setStatus] = useState<Status | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => api.jobs().then(setJobs).catch(() => {}), []);

  useEffect(() => {
    Promise.all([api.status(), api.profile()])
      .then(([s, p]) => {
        setStatus(s);
        setProfile(p);
        if (!p.consent) setTab("clone");
      })
      .catch(() => setError("Não foi possível conectar à API. O servidor está rodando?"));
    refresh();
  }, [refresh]);

  const active = jobs.some((j) => j.status === "queued" || j.status === "running");
  useEffect(() => {
    const id = setInterval(refresh, active ? 2000 : 15000);
    return () => clearInterval(id);
  }, [active, refresh]);

  if (error) return <p className="p-10 text-center text-red-300">{error}</p>;
  if (!status || !profile) return <p className="p-10 text-center text-zinc-500">Carregando…</p>;

  const demo = status.voice === "mock" || status.avatar === "mock";
  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "clone", label: "Meu Clone" },
    { key: "new", label: "Novo Vídeo" },
    { key: "videos", label: "Meus Vídeos", badge: jobs.filter((j) => j.status === "queued" || j.status === "running").length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <header className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-lg font-black">C</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Clone Studio</h1>
            <p className="text-xs text-zinc-500">copy → voz → clone → edição → download</p>
          </div>
        </div>
        <nav className="flex gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition ${tab === t.key ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              {t.label}
              {!!t.badge && <span className="ml-2 rounded-full bg-brand-600 px-1.5 text-xs text-white">{t.badge}</span>}
            </button>
          ))}
        </nav>
      </header>

      {demo && (
        <div className="mb-6 rounded-xl border border-amber-800/60 bg-amber-950/30 px-4 py-2 text-sm text-amber-200">
          <b>Modo demo:</b> {status.voice === "mock" && "sem ElevenLabs (voz silenciosa)"}
          {status.voice === "mock" && status.avatar === "mock" && " · "}
          {status.avatar === "mock" && "sem HeyGen (foto animada)"}. Configure as chaves no <code>.env</code> para usar seu clone real.
        </div>
      )}

      {tab === "clone" && <CloneSetup profile={profile} setProfile={setProfile} status={status} />}
      {tab === "new" && (
        <NewVideo
          profile={profile}
          onCreated={() => {
            refresh();
            setTab("videos");
          }}
        />
      )}
      {tab === "videos" && <Videos jobs={jobs} refresh={refresh} onNew={() => setTab("new")} />}
    </div>
  );
}
