import type { ReactNode } from "react";

export function Section({ title, subtitle, children, right }: { title: string; subtitle?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-zinc-400">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-600" : "bg-zinc-700"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white transition ${checked ? "left-5.5" : "left-0.5"}`} />
      </button>
      {label}
    </label>
  );
}

export function Slider(props: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-zinc-300">{props.label}</span>
        <span className="tabular-nums text-zinc-400">{props.format ? props.format(props.value) : props.value}</span>
      </div>
      <input
        type="range"
        className="w-full accent-brand-500"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-zinc-700 bg-zinc-950 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${value === o.value ? "bg-brand-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Alert({ kind = "info", children }: { kind?: "info" | "error" | "warn"; children: ReactNode }) {
  const color = {
    info: "border-sky-800 bg-sky-950/50 text-sky-200",
    error: "border-red-800 bg-red-950/50 text-red-200",
    warn: "border-amber-800 bg-amber-950/40 text-amber-200",
  }[kind];
  return <div className={`rounded-xl border px-4 py-3 text-sm ${color}`}>{children}</div>;
}
