
import { useState, useEffect, useRef } from "react";

const CHECKOUT_URL = "https://pay.hotmart.com/W106115946J";


type Answers = {
  gender: "nino" | "nina" | null;
  age: string | null;
  childName: string;
  eliminate: string[];
  challenges: string[];
  distractions: string[];
  energyMgmt: string[];
  plannerMust: string[];
  routineStructure: string[];
  extras: string[];
};

const initialAnswers: Answers = {
  gender: null,
  age: null,
  childName: "",
  eliminate: [],
  challenges: [],
  distractions: [],
  energyMgmt: [],
  plannerMust: [],
  routineStructure: [],
  extras: [],
};

const PROGRESS_MAP: Record<number, number> = {
  1: 25, 2: 45, 3: 60, 4: 70, 5: 78, 6: 84, 7: 84, 8: 84,
  9: 88, 10: 92, 11: 95, 12: 98, 13: 100,
};

function QuizFunnel() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const go = (n: number) => {
    const nextProgress = PROGRESS_MAP[n] ?? 0;
    setProgress(nextProgress);
    setTimeout(() => {
      setCurrentStep(n);
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    }, 400);
  };

  const pronoun = answers.gender === "nina" ? "tu hija" : "tu hijo";
  const childName = answers.childName || (answers.gender === "nina" ? "tu hija" : "tu hijo");

  const common = { answers, setAnswers, go, childName, pronoun };
  const showProgress = currentStep >= 1 && currentStep <= 13;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FCF8F2", color: "#3D1D10", fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      {showProgress && (
        <div className="max-w-md mx-auto px-5 pt-6">
          <PersistentProgressBar value={progress} />
        </div>
      )}
      {currentStep === 0 && <Welcome go={go} />}
      {currentStep === 1 && <Step1 {...common} />}
      {currentStep === 2 && <Step2 {...common} />}
      {currentStep === 3 && <Step3 {...common} />}
      {currentStep === 4 && <Step4 {...common} />}
      {currentStep === 5 && <Step5 {...common} />}
      {currentStep === 6 && <Step6 {...common} />}
      {currentStep === 7 && <Step7 {...common} />}
      {currentStep === 8 && <Step8 {...common} />}
      {currentStep === 9 && <Step9 {...common} />}
      {currentStep === 10 && <Step10 {...common} />}
      {currentStep === 11 && <Step11 {...common} />}
      {currentStep === 12 && <Step12 {...common} />}
      {currentStep === 13 && <Step13 {...common} />}
      {currentStep === 14 && <Step14 {...common} />}
    </div>
  );
}

function PersistentProgressBar({ value }: { value: number }) {
  return (
    <div
      key="progress-bar-track"
      style={{
        width: "100%",
        height: "8px",
        backgroundColor: "#F1E7D8",
        borderRadius: "999px",
        overflow: "hidden",
      }}
    >
      <div
        key="progress-bar-fill"
        style={{
          height: "100%",
          width: `${value}%`,
          backgroundColor: "#FF6600",
          borderRadius: "999px",
          transition: "width 700ms ease-in-out",
        }}
      />
    </div>
  );
}

/* ---------- Shared UI ---------- */

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F1E7D8" }}>
      <div
        className="h-2 rounded-full"
        style={{
          width: `${value}%`,
          backgroundColor: "#FF6600",
          transition: "width 600ms ease-in-out",
        }}
      />
    </div>
  );
}

function ImagePlaceholder({ label, h = 180 }: { label: string; h?: number }) {
  return (
    <div
      className="w-full rounded-2xl flex items-center justify-center text-xs"
      style={{ backgroundColor: "#EEE7DA", color: "#9A8870", height: h }}
    >
      {label}
    </div>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] ${className}`}
      style={{
        backgroundColor: disabled ? "#E2E8F0" : "#FF6600",
        color: disabled ? "#94A3B8" : "#FFFFFF",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 6px 20px rgba(255,102,0,0.25)",
      }}
    >
      {children}
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white border text-xl font-bold transition-all active:scale-95"
      style={{ borderColor: "#E8DFCF", color: "#3D1D10" }}
      aria-label="Volver"
    >
      ←
    </button>
  );
}

function PageShell({ progress: _progress, children }: { progress?: number; children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto px-5 pt-3 pb-10">
      <div className="mt-2">{children}</div>
    </div>
  );
}

function QuestionTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-extrabold text-center leading-tight" style={{ color: "#3D1D10" }}>{children}</h1>;
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-sm mt-2" style={{ color: "#8A6E5A" }}>{children}</p>;
}

/* ---------- Multi-select helpers ---------- */

type Opt = { emoji?: string; label: string };

function MultiSelectList({
  options,
  selected,
  onChange,
}: {
  options: Opt[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const ALL = "Todas las anteriores";
  const allLabels = options.filter((o) => o.label !== ALL).map((o) => o.label);

  const toggle = (label: string) => {
    if (label === ALL) {
      const allSelected = allLabels.every((l) => selected.includes(l));
      if (allSelected) onChange([]);
      else onChange([...allLabels, ALL]);
      return;
    }
    let next = selected.includes(label)
      ? selected.filter((s) => s !== label)
      : [...selected.filter((s) => s !== ALL), label];
    if (allLabels.every((l) => next.includes(l))) next = [...next.filter((s) => s !== ALL), ALL];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const isSel = selected.includes(o.label);
        return (
          <button
            key={o.label}
            onClick={() => toggle(o.label)}
            className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all active:scale-[0.99]"
            style={{
              border: `2px solid ${isSel ? "#FF6600" : "#EFE6D6"}`,
              boxShadow: isSel ? "0 4px 14px rgba(255,102,0,0.12)" : "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm shrink-0"
              style={{
                backgroundColor: isSel ? "#FF6600" : "transparent",
                border: `2px solid ${isSel ? "#FF6600" : "#FF6600"}`,
              }}
            >
              {isSel ? "✓" : ""}
            </span>
            {o.emoji && <span className="text-xl">{o.emoji}</span>}
            <span className="font-semibold text-sm" style={{ color: "#3D1D10" }}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function NavRow({
  onBack,
  onNext,
  disabled,
  nextLabel = "Continuar →",
}: {
  onBack: () => void;
  onNext: () => void;
  disabled: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <BackButton onClick={onBack} />
      <div className="flex-1">
        <PrimaryButton onClick={onNext} disabled={disabled}>
          {nextLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ---------- Welcome ---------- */

function Welcome({ go }: { go: (n: number) => void }) {
  return (
    <div className="max-w-md mx-auto px-5 py-8 flex flex-col items-center text-center">
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white"
        style={{ border: "1.5px solid #FF6600" }}
      >
        <span style={{ color: "#FF6600" }}>💡</span>
        <span className="text-xs font-extrabold tracking-wider" style={{ color: "#FF6600" }}>
          TDAH PRODUCTIVO KIDS
        </span>
      </div>

      <div className="relative mt-6 w-full">
        <img
          src="https://i.imgur.com/wLA36Er.png"
          alt="TDAH Productivo Kids"
          className="welcome-mockup-img"
        />
        <span
          className="absolute -top-2 -right-2 text-xs font-bold text-white px-3 py-1 rounded-full"
          style={{ backgroundColor: "#FF6600" }}
        >
          ¡Nuevo!
        </span>
      </div>

      <div
        className="mt-5 px-4 py-2 rounded-full text-xs font-semibold"
        style={{ backgroundColor: "#FFF3CD", color: "#3D1D10" }}
      >
        100% personalizado para el cerebro de tu hijo
      </div>

      <h1 className="mt-5 text-4xl font-extrabold leading-tight" style={{ color: "#3D1D10" }}>
        Tu hijo no es
        <br />
        <span style={{ color: "#FF6600", fontSize: "2.75rem" }}>perezoso.</span>
      </h1>

      <p className="mt-3 text-base font-semibold" style={{ color: "#3D1D10" }}>
        Su cerebro solo necesita un sistema diferente.
      </p>

      <p className="mt-4 text-sm" style={{ color: "#7B5E48" }}>
        Responde 6 preguntas rápidas y recibe un planner creado especialmente para la rutina de tu hijo con TDAH — para que lo usen juntos.
      </p>

      <div
        className="mt-6 w-full bg-white rounded-2xl p-5 text-left"
        style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.06)" }}
      >
        {[
          "Combate la procrastinación",
          "Reduce conflictos en casa",
          "Organiza la rutina escolar",
          "Aumenta la autoconfianza",
        ].map((t) => (
          <div key={t} className="flex items-center gap-3 py-1.5">
            <span style={{ color: "#FF6600" }} className="font-bold">
              ✓
            </span>
            <span className="text-sm font-semibold" style={{ color: "#3D1D10" }}>
              {t}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full">
        <PrimaryButton onClick={() => go(1)}>Crear el Planner de mi Hijo →</PrimaryButton>
      </div>

      <p className="mt-3 text-xs" style={{ color: "#8A6E5A" }}>
        Toma menos de 2 minutos • Para niños de 4 a 14 años
      </p>

      <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: "#7B5E48" }}>
        <span className="text-lg">😊😄🥰😃🙂</span>
        <span className="font-semibold">+2.400 familias ya transformaron su rutina</span>
      </div>
    </div>
  );
}

/* ---------- Step props ---------- */

type StepProps = {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  go: (n: number) => void;
  childName: string;
  pronoun: string;
};

/* ---------- Step 1: Gender ---------- */

function Step1({ answers, setAnswers, go }: StepProps) {
  const select = (g: "nino" | "nina") => setAnswers({ ...answers, gender: g });
  return (
    <PageShell progress={25}>
      <QuestionTitle>¿Tu hijo es niño o niña?</QuestionTitle>
      <Subtitle>Selecciona una opción</Subtitle>
      <div className="grid grid-cols-2 gap-2 mt-5">
        {([
          { v: "nino", label: "Niño", imgUrl: "https://i.imgur.com/m361U76.jpeg" },
          { v: "nina", label: "Niña", imgUrl: "https://i.imgur.com/WB1gceb.jpeg" },
        ] as const).map((o) => {
          const sel = answers.gender === o.v;
          return (
            <button
              key={o.v}
              onClick={() => select(o.v)}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-3 transition-all active:scale-[0.98]"
              style={{
                border: `2px solid ${sel ? "#FF6600" : "#EFE6D6"}`,
                boxShadow: sel ? "0 6px 18px rgba(255,102,0,0.18)" : "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              <div className="card-gender w-full" style={{ height: 130 }}>
                <img src={o.imgUrl} alt={o.label} />
              </div>
              <span className="font-bold" style={{ color: "#3D1D10" }}>
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-5">
        <PrimaryButton disabled={!answers.gender} onClick={() => go(2)}>
          Continuar →
        </PrimaryButton>
      </div>
    </PageShell>
  );
}

/* ---------- Step 2: Age ---------- */

function Step2({ answers, setAnswers, go }: StepProps) {
  const ages = [
    { v: "4-6", emoji: "🧒", label: "4-6 años" },
    { v: "7-9", emoji: "👦", label: "7-9 años" },
    { v: "10-12", emoji: "🧑", label: "10-12 años" },
    { v: "13-14", emoji: "🎓", label: "13-14 años" },
  ];
  return (
    <PageShell progress={45}>
      <p className="text-center text-sm" style={{ color: "#7B5E48" }}>
        <span style={{ color: "#FF6600", fontWeight: 800 }}>4.231</span>{" "}
        {answers.gender === "nina" ? "niñas" : "niños"} ya tienen su Planner TDAH Productivo Kids
      </p>
      <div className="mt-5">
        <QuestionTitle>¿Cuántos años tiene?</QuestionTitle>
        <Subtitle>Selecciona una opción</Subtitle>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-5">
        {ages.map((a) => {
          const sel = answers.age === a.v;
          return (
            <button
              key={a.v}
              onClick={() => setAnswers({ ...answers, age: a.v })}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 transition-all active:scale-[0.98]"
              style={{
                border: `2px solid ${sel ? "#FF6600" : "#EFE6D6"}`,
                boxShadow: sel ? "0 6px 18px rgba(255,102,0,0.18)" : "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              <span className="text-3xl">{a.emoji}</span>
              <span className="font-bold text-sm" style={{ color: "#3D1D10" }}>
                {a.label}
              </span>
            </button>
          );
        })}
      </div>
      <NavRow onBack={() => go(1)} onNext={() => go(3)} disabled={!answers.age} />
    </PageShell>
  );
}

/* ---------- Step 3: Name ---------- */

function Step3({ answers, setAnswers, go }: StepProps) {
  const isNina = answers.gender === "nina";
  return (
    <PageShell progress={60}>
      <div className="flex justify-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: "#FFF3CD" }}
        >
          {isNina ? "👧" : "👦"}
        </div>
      </div>
      <div className="mt-4">
        <QuestionTitle>{isNina ? "¿Cuál es el nombre de tu hija?" : "¿Cuál es el nombre de tu hijo?"}</QuestionTitle>
        <Subtitle>Vamos a personalizar el planner con su nombre</Subtitle>
      </div>
      <input
        type="text"
        value={answers.childName}
        onChange={(e) => setAnswers({ ...answers, childName: e.target.value })}
        placeholder="Escribe su nombre aquí..."
        className="mt-6 w-full bg-white rounded-2xl px-5 py-4 text-base outline-none"
        style={{ border: "2px solid #FFD1B0", color: "#3D1D10" }}
      />
      <NavRow onBack={() => go(2)} onNext={() => go(4)} disabled={answers.childName.trim().length < 2} />
    </PageShell>
  );
}

/* ---------- Step 4: Eliminate ---------- */

function Step4({ answers, setAnswers, go, childName }: StepProps) {
  const options: Opt[] = [
    { emoji: "📚", label: "Peleas diarias con las tareas escolares" },
    { emoji: "📦", label: "Desorganización constante en todo" },
    { emoji: "😭", label: "Crisis, llanto y berrinches frecuentes" },
    { emoji: "😔", label: "Se siente incapaz o diferente" },
    { emoji: "📯", label: "Quejas constantes de la escuela" },
    { label: "Todas las anteriores" },
  ];
  return (
    <PageShell progress={70}>
      <QuestionTitle>¿Qué es lo que más deseas eliminar de la rutina de {childName}?</QuestionTitle>
      <Subtitle>Selecciona todas las que quieras</Subtitle>
      <div className="mt-3">
        <MultiSelectList
          options={options}
          selected={answers.eliminate}
          onChange={(v) => setAnswers({ ...answers, eliminate: v })}
        />
      </div>
      <NavRow onBack={() => go(3)} onNext={() => go(5)} disabled={answers.eliminate.length === 0} />
    </PageShell>
  );
}

/* ---------- Step 5: Challenges ---------- */

function Step5({ answers, setAnswers, go, childName }: StepProps) {
  const options: Opt[] = [
    { emoji: "🔥", label: "Control de la impulsividad" },
    { emoji: "🎯", label: "Mantener el enfoque en cualquier actividad" },
    { emoji: "📋", label: "Organización y planificación" },
    { emoji: "⏰", label: "Gestión del tiempo y horarios" },
    { emoji: "🧠", label: "Memorizar tareas y compromisos" },
    { emoji: "👥", label: "Relación con otros niños" },
    { label: "Todas las anteriores" },
  ];
  return (
    <PageShell progress={78}>
      <QuestionTitle>¿En qué áreas el TDAH representa mayores desafíos para {childName}?</QuestionTitle>
      <Subtitle>Selecciona todas las que quieras</Subtitle>
      <div className="mt-3">
        <MultiSelectList
          options={options}
          selected={answers.challenges}
          onChange={(v) => setAnswers({ ...answers, challenges: v })}
        />
      </div>
      <NavRow onBack={() => go(4)} onNext={() => go(6)} disabled={answers.challenges.length === 0} />
    </PageShell>
  );
}

/* ---------- Step 6: Distractions ---------- */

function Step6({ answers, setAnswers, go, childName }: StepProps) {
  const options: Opt[] = [
    { emoji: "📱", label: "El celular, la tablet o la televisión" },
    { emoji: "🧑‍🤝‍🧑", label: "Otros niños o personas a su alrededor" },
    { emoji: "💭", label: "Pensamientos dispersos" },
    { emoji: "📝", label: "Tareas pendientes en su mente" },
    { emoji: "🔊", label: "Sonidos y ruidos del entorno" },
    { label: "Todas las anteriores" },
  ];
  return (
    <PageShell progress={84}>
      <QuestionTitle>¿Qué es lo que más distrae a {childName}?</QuestionTitle>
      <Subtitle>Selecciona todas las que quieras</Subtitle>
      <div className="mt-3">
        <MultiSelectList
          options={options}
          selected={answers.distractions}
          onChange={(v) => setAnswers({ ...answers, distractions: v })}
        />
      </div>
      <NavRow onBack={() => go(5)} onNext={() => go(7)} disabled={answers.distractions.length === 0} />
    </PageShell>
  );
}

/* ---------- Step 7: Diagnostic ---------- */

function Step7({ go, childName }: StepProps) {
  const targets = [
    { emoji: "⏰", label: "Dificultad para seguir rutinas", value: 82 },
    { emoji: "📚", label: "Conflictos con las tareas escolares", value: 78 },
    { emoji: "🎒", label: "Desorganización escolar", value: 74 },
    { emoji: "😔", label: "Baja autoconfianza", value: 71 },
  ];
  const BASE_DURATION = 2200;
  const MIN_VALUE = 71;
  const getDuration = (v: number) => BASE_DURATION * (v / MIN_VALUE);

  const [vals, setVals] = useState([0, 0, 0, 0]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [clicked, setClicked] = useState<number | null>(null);

  useEffect(() => {
    const rafs: number[] = [];
    targets.forEach((tg, i) => {
      const duration = getDuration(tg.value);
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(elapsed / duration, 1);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        setVals((prev) => {
          const next = [...prev];
          next[i] = Math.round(eased * tg.value);
          return next;
        });
        if (p < 1) rafs.push(requestAnimationFrame(step));
      };
      rafs.push(requestAnimationFrame(step));
    });

    const maxDur = Math.max(...targets.map((t) => getDuration(t.value)));
    const timer = setTimeout(() => setShowQuestion(true), maxDur + 100);

    return () => {
      rafs.forEach((r) => cancelAnimationFrame(r));
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (i: number) => {
    setClicked(i);
    setTimeout(() => go(8), 350);
  };

  const options = [
    { emoji: "😓", label: "Sí, es exactamente así" },
    { emoji: "🙂", label: "No, está mejor que esto" },
    { emoji: "😐", label: "Más o menos" },
  ];

  return (
    <PageShell progress={60}>
      <div
        className="bg-white rounded-3xl p-6"
        style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-xl font-extrabold" style={{ color: "#3D1D10" }}>
            Preocupante...
          </h2>
        </div>
        <p className="mt-2 text-sm" style={{ color: "#7B5E48" }}>
          Hasta ahora hemos identificado que la situación de {childName} está así:
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {targets.map((t, i) => (
            <div key={t.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2" style={{ color: "#3D1D10" }}>
                  <span>{t.emoji}</span>
                  <span className="font-semibold">{t.label}</span>
                </span>
                <span className="font-extrabold" style={{ color: "#DC2626" }}>
                  {vals[i]}%
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full" style={{ backgroundColor: "#F1E7D8" }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${vals[i]}%`,
                    background: "linear-gradient(90deg, #4ADE80 0%, #FACC15 60%, #EF4444 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            maxHeight: showQuestion ? 400 : 0,
            overflow: "hidden",
            transition: "max-height 600ms ease-in-out",
          }}
        >
          <h3 className="mt-6 text-center text-lg font-extrabold" style={{ color: "#3D1D10" }}>
            ¿Te identificas con esto?
          </h3>

          <div className="mt-3 flex flex-col gap-2">
            {options.map((o, i) => (
              <button
                key={o.label}
                onClick={() => pick(i)}
                className="w-full bg-white rounded-2xl px-4 py-3 flex items-center justify-between transition-all active:scale-[0.99]"
                style={{
                  border: `2px solid ${clicked === i ? "#FF6600" : "#EFE6D6"}`,
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{o.emoji}</span>
                  <span className="font-semibold text-sm" style={{ color: "#3D1D10" }}>
                    {o.label}
                  </span>
                </span>
                <span style={{ color: "#B8A78F" }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}


/* ---------- Step 8: Promise ---------- */

function Step8({ go, childName }: StepProps) {
  return (
    <div className="max-w-md mx-auto px-5 pt-8 pb-10">
      <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
        <h2 className="text-2xl font-extrabold text-center" style={{ color: "#3D1D10" }}>
          Entendemos la situación de {childName}...
        </h2>

        <div
          className="mt-5 rounded-2xl p-4 text-center text-sm font-semibold"
          style={{ backgroundColor: "#EBF7EE", border: "1px solid #B5E0BE", color: "#15803D" }}
        >
          Y te garantizamos que su rutina va a ser otra después de{" "}
          <span className="font-extrabold">TDAH Productivo Kids</span> 😊
        </div>

        <div
          className="mt-4 rounded-2xl p-4"
          style={{ backgroundColor: "#FFFCE6", border: "1px solid #F4E58E" }}
        >
          <p className="text-center font-extrabold" style={{ color: "#3D1D10" }}>
            ✨ Lo que van a lograr: ✨
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {[
              "Organización y rutina con claridad en el día a día",
              "Reducción de conflictos y crisis en casa",
              "Aumento de la autoconfianza y el rendimiento escolar",
            ].map((t) => (
              <div key={t} className="bg-white rounded-xl px-3 py-3 flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm shrink-0"
                  style={{ backgroundColor: "#FF6600" }}
                >
                  ✓
                </span>
                <span className="text-sm font-semibold" style={{ color: "#3D1D10" }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <PrimaryButton onClick={() => go(9)}>Ok, continuar →</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 9: Energy ---------- */

function Step9({ answers, setAnswers, go, childName }: StepProps) {
  const options: Opt[] = [
    { emoji: "🎮", label: "Momentos de juego libre" },
    { emoji: "🥗", label: "Alimentación equilibrada y horarios fijos" },
    { emoji: "⏸️", label: "Pausas entre actividades" },
    { emoji: "🏃", label: "Ejercicio físico o deporte" },
    { emoji: "😴", label: "Rutina de sueño constante" },
    { label: "Todas las anteriores" },
  ];
  return (
    <PageShell progress={88}>
      <QuestionTitle>¿Cómo maneja mejor su energía {childName} durante el día?</QuestionTitle>
      <Subtitle>Selecciona todas las que quieras</Subtitle>
      <div className="mt-3">
        <MultiSelectList
          options={options}
          selected={answers.energyMgmt}
          onChange={(v) => setAnswers({ ...answers, energyMgmt: v })}
        />
      </div>
      <NavRow onBack={() => go(8)} onNext={() => go(10)} disabled={answers.energyMgmt.length === 0} />
    </PageShell>
  );
}

/* ---------- Step 10: Planner must ---------- */

function Step10({ answers, setAnswers, go, childName }: StepProps) {
  const options: Opt[] = [
    { emoji: "✏️", label: "Rutina escolar y tareas" },
    { emoji: "🌅", label: "Rutina de la mañana y de la noche" },
    { emoji: "🏆", label: "Sistema de misiones y recompensas" },
    { emoji: "💪", label: "Control de humor y emociones" },
    { emoji: "📖", label: "Seguimiento de lectura y estudios" },
    { emoji: "🥗", label: "Salud y alimentación" },
    { emoji: "🎯", label: "Metas semanales visuales" },
    { label: "Todas las anteriores" },
  ];
  return (
    <PageShell progress={92}>
      <QuestionTitle>
        ¿Qué <span style={{ color: "#FF6600" }}>NO</span> puede faltar en el planner de {childName}?
      </QuestionTitle>
      <Subtitle>Selecciona todas las que quieras</Subtitle>
      <div className="mt-3">
        <MultiSelectList
          options={options}
          selected={answers.plannerMust}
          onChange={(v) => setAnswers({ ...answers, plannerMust: v })}
        />
      </div>
      <NavRow onBack={() => go(9)} onNext={() => go(11)} disabled={answers.plannerMust.length === 0} />
    </PageShell>
  );
}

/* ---------- Step 11: Routine structure ---------- */

function Step11({ answers, setAnswers, go, childName }: StepProps) {
  const options: Opt[] = [
    { emoji: "✅", label: "Checklists visuales simples" },
    { emoji: "🎯", label: "Objetivos y metas diarias" },
    { emoji: "⭐", label: "Sistema de recompensas y estrellas" },
    { emoji: "🎨", label: "Organización por colores e íconos" },
    { emoji: "⏸️", label: "Pausas programadas durante el día" },
    { label: "Todas las anteriores" },
  ];
  return (
    <PageShell progress={95}>
      <QuestionTitle>¿Cómo deseas estructurar la rutina de {childName} para reducir los conflictos?</QuestionTitle>
      <Subtitle>Selecciona todas las que quieras</Subtitle>
      <div className="mt-3">
        <MultiSelectList
          options={options}
          selected={answers.routineStructure}
          onChange={(v) => setAnswers({ ...answers, routineStructure: v })}
        />
      </div>
      <NavRow onBack={() => go(10)} onNext={() => go(12)} disabled={answers.routineStructure.length === 0} />
    </PageShell>
  );
}

/* ---------- Step 12: Extras ---------- */

function Step12({ answers, setAnswers, go, childName }: StepProps) {
  const options: Opt[] = [
    { emoji: "📚", label: "Club de lectura infantil" },
    { emoji: "🌍", label: "Inglés e idiomas" },
    { emoji: "⚽", label: "Deportes y actividades físicas" },
    { emoji: "🎨", label: "Arte, música y creatividad" },
    { emoji: "🧩", label: "Juegos educativos y razonamiento" },
    { emoji: "🧑‍🤝‍🧑", label: "Habilidades sociales y amistades" },
    { label: "Todas las anteriores" },
  ];
  return (
    <PageShell progress={98}>
      <QuestionTitle>¿Y qué te gustaría incluir además en el planner de {childName}?</QuestionTitle>
      <Subtitle>Selecciona todas las que quieras</Subtitle>
      <div className="mt-3">
        <MultiSelectList
          options={options}
          selected={answers.extras}
          onChange={(v) => setAnswers({ ...answers, extras: v })}
        />
      </div>
      <NavRow onBack={() => go(11)} onNext={() => go(13)} disabled={answers.extras.length === 0} />
    </PageShell>
  );
}

/* ---------- Step 13: Loading / Compilation ---------- */

function Step13({ go, childName }: StepProps) {
  const [barProgress, setBarProgress] = useState(0);
  const items = [
    { emoji: "🏆", label: "Sistema de misiones y recompensas" },
    { emoji: "💪", label: "Módulo de control de emociones" },
    { emoji: "🌅", label: "Rutinas de la mañana y de la noche" },
    { emoji: "📖", label: "Guía completa para padres" },
    { emoji: "🎯", label: "Metas semanales adaptadas al TDAH" },
    { emoji: "⭐", label: "Tablero de logros y estrellas" },
  ];
  const goneRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 3000;
    let raf = 0;
    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setBarProgress(Math.round(p));
      if (p < 100) {
        raf = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          if (!goneRef.current) {
            goneRef.current = true;
            try {
              sessionStorage.setItem("plannerJustCreated", "1");
            } catch {}
            go(14);
          }
        }, 1000);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checks = Math.floor((barProgress / 100) * items.length);

  return (
    <div className="max-w-md mx-auto px-5 pt-8 pb-10 relative">
      <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
        <p className="text-center font-extrabold" style={{ color: "#3D1D10", fontSize: "16px" }}>
          Creando el planner de {childName}...
        </p>

        <div className="mt-5 text-center">
          <div style={{ position: "relative", display: "inline-block", animation: "floatPlannerLoading 4s ease-in-out infinite" }}>
            <img src="https://i.imgur.com/SwaZEvC.png" alt="Planner TDAH Productivo Kids" className="planner-loading-img" />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "#3D1D10" }} className="font-semibold">
              Creando el planner de {childName}...
            </span>
            <span className="font-extrabold" style={{ color: "#15803D" }}>
              {barProgress}%
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: "#F1E7D8" }}>
            <div
              className="h-2 rounded-full"
              style={{ width: `${barProgress}%`, backgroundColor: "#4CAF50", transition: "width 0.1s linear" }}
            />
          </div>
        </div>

        <div
          className="mt-5 rounded-2xl p-4"
          style={{ backgroundColor: "#FFFCE6", border: "1px solid #F4E58E" }}
        >
          <p className="font-extrabold text-sm" style={{ color: "#7A5C2E" }}>
            Personalizando el planner de {childName}:
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {items.map((it, i) => (
              <div key={it.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm" style={{ color: "#3D1D10" }}>
                  <span>{it.emoji}</span>
                  <span className="font-semibold">{it.label}</span>
                </span>
                <span
                  className="transition-opacity"
                  style={{ opacity: i < checks ? 1 : 0, color: "#22C55E", fontWeight: 800 }}
                >
                  ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function Confetti() {
  const pieces = Array.from({ length: 30 });
  const colors = ["#FF6600", "#FACC15", "#22C55E", "#3B82F6", "#EC4899"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const dur = 2 + Math.random() * 2;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute block w-2 h-3 rounded-sm"
            style={{
              left: `${left}%`,
              top: "-10px",
              backgroundColor: color,
              animation: `confetti-fall ${dur}s linear ${delay}s infinite`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
      <style>{`@keyframes confetti-fall { to { transform: translateY(180px) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

/* ---------- Step 14: Sales page ---------- */

function Step14({ childName }: StepProps) {
  const name = childName?.trim() || "tu hijo";
  const [secondsLeft, setSecondsLeft] = useState(35 * 60);
  const [justCreated, setJustCreated] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("plannerJustCreated") === "1") {
        setJustCreated(true);
        sessionStorage.removeItem("plannerJustCreated");
        const t = setTimeout(() => setJustCreated(false), 5000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 35 * 60 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const scrollToOffer = () => {
    document.getElementById("oferta-final")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
  const goToCheckout = () => {
    window.open(CHECKOUT_URL, "_blank");
  };
  const CTA = ({
    ctaKey,
    label,
    big = false,
    action = "scroll",
  }: {
    ctaKey: string;
    label: string;
    big?: boolean;
    action?: "scroll" | "checkout";
  }) => (
    <div className="block mt-6">
      <button
        key={ctaKey}
        type="button"
        onClick={action === "checkout" ? goToCheckout : scrollToOffer}
        className={`w-full ${big ? "py-5 text-lg" : "py-4 text-base"} rounded-2xl font-extrabold text-white`}
        style={{ backgroundColor: "#FF6600", color: "#FFFFFF" }}
      >
        {label}
      </button>
    </div>
  );

  const modules = [
    { n: "01", title: "Rutina Escolar y Tarea en Casa", desc: "Actividades simples y visuales para organizar los deberes y crear hábitos de estudio consistentes sin conflictos.", img: "https://i.imgur.com/OH13a9c.jpeg" },
    { n: "02", title: "Emociones y Salud", desc: "Herramientas visuales para identificar, expresar y manejar emociones difíciles con calma y claridad.", img: "https://i.imgur.com/buULYfz.jpeg" },
    { n: "03", title: "Misiones y Recompensas", desc: "Sistema de gamificación que convierte tareas diarias en desafíos motivadores con recompensas que funcionan.", img: "https://i.imgur.com/DiO0ZVG.jpeg" },
    { n: "04", title: "Guía para Padres y Explicaciones", desc: "Guía completa para entender el cerebro TDAH y aplicar las estrategias correctas en casa.", img: "https://i.imgur.com/YujGZal.jpeg" },
  ];

  const pillars = [
    { n: "01", title: "Estímulo Dopaminérgico", desc: "Actividades y recompensas que activan los circuitos de motivación del cerebro TDAH de forma natural." },
    { n: "02", title: "Organización Visual Adaptada", desc: "Layouts, íconos y colores diseñados para el procesamiento visual del cerebro con TDAH." },
    { n: "03", title: "Sistema de Misiones", desc: "Microobjetivos alcanzables que generan ciclos de logro y motivan a completar la rutina." },
    { n: "04", title: "Retos Completables", desc: "Desafíos progresivos que se adaptan al nivel de energía y concentración en cada momento del día." },
  ];

  const diagnostics = [
    { p: "Peleas diarias con las tareas", pPct: 88, s: "Rutina de estudios fácil y constante", sPct: 20 },
    { p: "Estancamiento y desorganización constante", pPct: 82, s: "Activación visual que da energía al seguir", sPct: 15 },
    { p: "“Ya lo hizo, ¡no consigo!”", pPct: 79, s: "Aumenta la sensación de conquista", sPct: 22 },
    { p: "Dificultad para mantener foco", pPct: 85, s: "Microtareas guiadas paso a paso", sPct: 18 },
    { p: "Baja autoestima por fallos repetidos", pPct: 76, s: "Confianza y sentido de logro diario", sPct: 25 },
    { p: "Conflictos constantes en casa", pPct: 80, s: "Rutina visual que reduce el caos", sPct: 20 },
  ];

  const testimonials = [
    { name: "Ana Medina", emoji: "👩🏻", t: "Después de años lidiando con berrinches en la hora de las tareas, el planner fue la herramienta que nos hacía falta. Mi hijo ahora pide él solo sentarse a organizar su día. ¡No lo puedo creer!" },
    { name: "Camila Tavares", emoji: "👩🏽", t: "Lo que más me sorprendió fue la velocidad de los resultados. En menos de una semana ya notaba a mi hija más tranquila y segura con sus tareas. El sistema de misiones es genial." },
    { name: "Rosario Peralta", emoji: "👩🏼", t: "Tengo cuatro hijos, dos con TDAH confirmado. Este planner fue lo mejor que encontré. Organiza, motiva y reduce el caos en casa de una manera que no pensé posible." },
    { name: "Sabrina Felix", emoji: "👩🏾", t: "Después de meses buscando algo que funcionara, encontré el TDAH Productivo Kids. Los conflictos en casa bajaron casi un 70% en el primer mes. ¡Muy recomendado!" },
  ];

  const faqs = [
    { q: "¿Cómo voy a recibir el planner?", a: "Inmediatamente después de la confirmación del pago, recibirás el acceso en tu correo electrónico en formato PDF de alta calidad, listo para imprimir en casa." },
    { q: "Mi hijo no tiene diagnóstico formal. ¿Funciona?", a: "Sí. Las actividades de rutina, organización y control emocional benefician a cualquier niño con rasgos de desatención, impulsividad o dificultad de organización, con o sin diagnóstico." },
    { q: "¿Para qué edad es el planner?", a: "Está perfectamente adaptado para niños y niñas entre 4 y 14 años. El contenido es visual, lúdico y apropiado para distintos niveles de desarrollo." },
    { q: "¿Mi hijo lo usa solo o lo usamos juntos?", a: "¡Ambos funcionan! Fue pensado para que padres e hijos lo usen juntos los primeros días, hasta que el niño desarrolle autonomía para usarlo con más independencia." },
    { q: "¿Cómo funciona la garantía de 7 días?", a: "Si en los primeros 7 días no estás satisfecho, basta con contactar a nuestro soporte y hacemos el reembolso completo sin ninguna pregunta." },
    { q: "¿Cómo lo imprimo en casa?", a: "El archivo viene en PDF tamaño A4, optimizado para impresoras domésticas. Puedes imprimir en blanco y negro o a color — ambas versiones funcionan perfectamente." },
  ];

  return (
    <div style={{ backgroundColor: "#FCF8F2" }}>
      <style>{`@keyframes floatPlanner { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } } .planner-hero-img { animation: floatPlanner 4s ease-in-out infinite; display: block; margin: 0 auto; max-width: 420px; width: 90%; }`}</style>

      {/* Sticky top banner */}
      <div
        className="sticky top-0 z-40 w-full text-center py-2 px-4"
        style={{ backgroundColor: "#FFF8EE", borderBottom: "1px solid #FFB37A" }}
      >
        <p className="text-xs font-semibold" style={{ color: "#3D1D10" }}>
          {justCreated ? `¡Planner creado para ${name}! 🎉` : `Personalizado para ${name} • TDAH Productivo Kids`}
        </p>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 pb-12">
        {/* BLOCO 1 — HERO */}
        <h1 className="text-3xl font-extrabold text-center leading-tight">
          <span style={{ color: "#FF6600" }}>¡El TDAH de {name} bajo control</span>
          <br />
          <span style={{ color: "#3D1D10" }}>con este planner!</span>
        </h1>
        <p className="mt-4 text-center text-sm" style={{ color: "#7B5E48" }}>
          Basado en sus respuestas, creamos el planner perfecto para transformar su rutina de maneras
          que van a celebrar juntos.
        </p>

        <CTA ctaKey="cta-hero" label={`Quiero el Planner de ${name} ahora →`} />

        <div className="mt-3 text-center">
          <p className="text-sm" style={{ color: "#3D1D10" }}>
            <span style={{ color: "#FF6600" }}>★★★★★</span>{" "}
            <span style={{ color: "#7B5E48" }}>(4.9 • 2.457 familias) 👨‍👩‍👧‍👦</span>
          </p>
        </div>

        <div className="mt-6">
          <img
            src="https://i.imgur.com/r76UjHp.png"
            alt="Planner TDAH Productivo Kids"
            className="planner-hero-img"
          />
        </div>

        <div className="mt-5 flex justify-center">
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-bold"
            style={{ backgroundColor: "#FFF3CD", border: "1px solid #FFB37A", color: "#3D1D10" }}
          >
            Personalizado para {name} • TDAH Productivo Kids
          </span>
        </div>

        {/* BLOCO 2 — MÓDULOS */}
        <h2 className="mt-10 text-xl font-extrabold text-center" style={{ color: "#3D1D10" }}>
          Lo que incluimos en el planner de {name}
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: "#7B5E48" }}>
          Con base en sus respuestas, creamos una planificación única con el nivel de recursos para
          desarrollar las habilidades específicas discutidas.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          {modules.map((m) => (
            <div
              key={m.n}
              className="relative bg-white rounded-2xl p-4 w-full"
              style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
            >
              <div
                className="absolute -top-2 -left-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-extrabold z-10"
                style={{ backgroundColor: "#FF6600" }}
              >
                {m.n}
              </div>
              <img src={m.img} alt={m.title} className="module-card-img" />
              <p className="mt-3 text-xs font-bold" style={{ color: "#FF6600" }}>
                100 páginas • Tamaño A4
              </p>
              <h3 className="mt-1 font-extrabold text-base leading-tight" style={{ color: "#3D1D10" }}>
                {m.title}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "#7B5E48" }}>
                {m.desc}
              </p>
              <div className="mt-3">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#FFF3CD", color: "#7A5C2E" }}
                >
                  ✨ ¡Diseñado para el TDAH! ✨
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bonus card */}
        <div
          className="mt-4 rounded-2xl p-4"
          style={{ backgroundColor: "#FFFCE6", boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}
        >
          <img src="https://i.imgur.com/cuo7DWi.jpeg" alt="Bonus" className="bonus-card-img" />
          <div className="mt-4 flex justify-center">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-extrabold"
              style={{ backgroundColor: "#FF6600", color: "#fff" }}
            >
              ✨ ¡Y mucho más! ✨
            </span>
          </div>
          <p className="mt-3 text-center text-xs font-semibold" style={{ color: "#7B5E48" }}>
            PDF para imprimir • Tamaño A4
          </p>
        </div>

        <CTA ctaKey="cta-modules" label={`Quiero el planner de ${name} →`} />

        {/* BLOCO 3 — POR QUÉ FUNCIONA */}
        <h2 className="mt-10 text-xl font-extrabold text-center" style={{ color: "#3D1D10" }}>
          ¿Por qué el Planner TDAH Productivo Kids funciona?
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: "#7B5E48" }}>
          Diseñado en neuropsicología y estrategias comprobadas para el cerebro TDAH infantil.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {pillars.map((p) => (
            <div
              key={p.n}
              className="relative bg-white rounded-2xl p-3 pt-5"
              style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
            >
              <div
                className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
                style={{ backgroundColor: "#FF6600" }}
              >
                {p.n}
              </div>
              <h3 className="font-extrabold text-sm leading-tight" style={{ color: "#3D1D10" }}>
                {p.title}
              </h3>
              <p className="mt-1 text-xs" style={{ color: "#7B5E48" }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-sm italic" style={{ color: "#7B5E48" }}>
          El Planner TDAH Productivo Kids fue desarrollado con base en pedagogía activa para ayudar a{" "}
          {name}. Fue probado y mejorado con un grupo de familias con un protocolo de conquistas únicas.
        </p>

        <CTA ctaKey="cta-pillars" label={`Quiero el planner de ${name} →`} />

        {/* BLOCO 4 — DIAGNÓSTICO VISUAL */}
        <div className="mt-10 text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "#FFF3CD", color: "#7A5C2E" }}
          >
            Transformar los desafíos en conquistas
          </span>
        </div>
        <h2 className="mt-3 text-xl font-extrabold text-center" style={{ color: "#3D1D10" }}>
          Cómo el planner resuelve los desafíos de {name}
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: "#7B5E48" }}>
          Mira cómo el planner ataca directamente cada punto identificado en sus respuestas.
        </p>

        {(() => {
          const pairs = [
            {
              beforeEmoji: "😤",
              beforeTitle: "Guerra diaria con la tarea en casa",
              beforeDesc: `${name} resiste, llora o ignora completamente la hora de la tarea. Te sientes agotada y culpable.`,
              metricLabel: "Tarea completada a tiempo",
              beforeValue: "18%",
              beforePct: 18,
              afterEmoji: "✅",
              afterTitle: "Rutina de estudios fácil y constante",
              afterDesc: "Sistema de micro-tareas con tiempo visual que convierte la tarea en misiones de 10 minutos — sin conflicto.",
              afterValue: "84%",
              afterPct: 84,
            },
            {
              beforeEmoji: "🎒",
              beforeTitle: "Olvidos y desorganización constante",
              beforeDesc: "Material olvidado, mochila desordenada, horarios perdidos. Lo recuerdas por él — y te sientes exhausta.",
              metricLabel: "Objetos olvidados por semana",
              beforeValue: "9x",
              beforePct: 90,
              afterEmoji: "✨",
              afterTitle: "Rutina visual que él puede seguir solo",
              afterDesc: `Checklists visuales de mañana y noche que ${name} usa con autonomía creciente.`,
              afterValue: "1x",
              afterPct: 10,
            },
            {
              beforeEmoji: "😔",
              beforeTitle: '"Soy tonto. No puedo."',
              beforeDesc: `${name} se compara con otros niños y siente que algo está mal en él.`,
              metricLabel: "Autoconfianza percibida",
              beforeValue: "baja",
              beforePct: 15,
              afterEmoji: "💛",
              afterTitle: "Confianza y sentido de conquista",
              afterDesc: "Sistema de misiones y recompensas que le muestra visualmente cuánto está evolucionando.",
              afterValue: "alta",
              afterPct: 85,
            },
          ];
          return (
            <div className="mt-5">
              {pairs.map((p, i) => (
                <div key={i}>
                  {/* ANTES */}
                  <div
                    style={{
                      background: "#FFF0F0",
                      border: "1px solid #FFCCCC",
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 8,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: "#FEE2E2" }}
                      >
                        {p.beforeEmoji}
                      </div>
                      <h4 className="font-extrabold text-sm" style={{ color: "#3D1D10" }}>
                        {p.beforeTitle}
                      </h4>
                    </div>
                    <div className="mt-2">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        style={{ backgroundColor: "#FECACA", color: "#991B1B" }}
                      >
                        ANTES
                      </span>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: "#7B5E48" }}>
                      {p.beforeDesc}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#7B5E48" }}>{p.metricLabel}</span>
                      <span className="text-sm font-extrabold" style={{ color: "#DC2626" }}>{p.beforeValue}</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "#E2E8F0", borderRadius: 999, marginTop: 6 }}>
                      <div style={{ width: `${p.beforePct}%`, height: "100%", borderRadius: 999, background: "#F87171" }} />
                    </div>
                  </div>

                  {/* DESPUÉS */}
                  <div
                    style={{
                      background: "#F0FFF4",
                      border: "1px solid #B2DFCC",
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 24,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: "#DCFCE7" }}
                      >
                        {p.afterEmoji}
                      </div>
                      <h4 className="font-extrabold text-sm" style={{ color: "#3D1D10" }}>
                        {p.afterTitle}
                      </h4>
                    </div>
                    <div className="mt-2">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        style={{ backgroundColor: "#BBF7D0", color: "#166534" }}
                      >
                        DESPUÉS
                      </span>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: "#7B5E48" }}>
                      {p.afterDesc}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs" style={{ color: "#7B5E48" }}>{p.metricLabel}</span>
                      <span className="text-sm font-extrabold" style={{ color: "#16A34A" }}>{p.afterValue}</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "#E2E8F0", borderRadius: 999, marginTop: 6 }}>
                      <div style={{ width: `${p.afterPct}%`, height: "100%", borderRadius: 999, background: "#4ADE80" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        <CTA ctaKey="cta-diagnostic" label={`¡Quiero transformar la rutina de ${name}!`} />

        {/* BLOCO 5 — DEPOIMENTOS */}
        <h2 className="mt-10 text-xl font-extrabold text-center" style={{ color: "#3D1D10" }}>
          Lo que dicen los padres que ya lo usaron
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: "#7B5E48" }}>
          Mira cómo el Planner TDAH Productivo Kids transformó la rutina de estas familias como la tuya.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: "#FFE6D2" }}
                >
                  {t.emoji}
                </div>
                <div>
                  <p className="font-extrabold text-sm" style={{ color: "#3D1D10" }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "#FF6600" }}>
                    ★★★★★
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm" style={{ color: "#7B5E48" }}>
                {t.t}
              </p>
            </div>
          ))}
        </div>

        <CTA ctaKey="cta-testimonials" label={`Quiero el planner de ${name} →`} />

        {/* BLOCO 6 — OFERTA FINAL */}
        <h2 className="mt-10 text-2xl font-extrabold text-center" style={{ color: "#3D1D10" }}>
          Transforma el TDAH de {name} en su mayor fortaleza
        </h2>
        <p className="mt-3 text-center">
          <span style={{ color: "#FF6600" }} className="text-lg">★★★★★</span>{" "}
          <span className="text-sm" style={{ color: "#7B5E48" }}>
            Más de 2.400 familias transformadas
          </span>
        </p>
        <p className="mt-3 text-center text-sm" style={{ color: "#7B5E48" }}>
          Basado en sus respuestas, el planner es el compañero perfecto para ayudar a {name} a
          desarrollar su máximo potencial, transformando los desafíos del TDAH en conquistas únicas.
        </p>

        <div
          id="oferta-final"
          className="mt-6 rounded-3xl overflow-hidden"
          style={{ border: "1px solid #FFD9B0", backgroundColor: "#fff" }}
        >
          <div className="px-5 py-4 text-center" style={{ backgroundColor: "#FFF3CD" }}>
            <div style={{ textAlign: "center", fontSize: "13px", color: "#3D1D10" }}>
              <div>Vas a crear el planner de <strong>{name}</strong> —</div>
              <div>esta oferta es válida por:</div>
            </div>
            <p className="mt-1 text-3xl font-extrabold tabular-nums" style={{ color: "#3D1D10" }}>
              {mm}:{ss}
            </p>
          </div>

          <div className="px-5 py-6">
            {/* Imagem com badge -70% */}
            <div className="text-center">
              <div style={{ position: "relative", display: "inline-block", margin: "0 auto" }}>
                <img
                  src="https://i.imgur.com/SwaZEvC.png"
                  alt="Planner"
                  style={{ width: "100%", maxWidth: 220, borderRadius: 12, display: "block" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: -8,
                    background: "#FF3B3B",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 13,
                    borderRadius: 999,
                    padding: "4px 10px",
                  }}
                >
                  -70%
                </span>
              </div>
            </div>

            {/* Bloco de preço */}
            <div className="mt-5 text-center">
              <p className="text-sm" style={{ color: "#7B5E48" }}>
                Precio normal: <span className="line-through">$29.90 USD</span>
              </p>
              <p className="mt-2 text-sm" style={{ color: "#7B5E48" }}>
                Con tu descuento, solo:
              </p>
              <p className="mt-1 text-4xl font-extrabold" style={{ color: "#15803D" }}>
                $9.90 USD
              </p>
              <p className="mt-1 text-xs" style={{ color: "#22C55E" }}>
                o 4x de $2.50 en la tarjeta
              </p>
            </div>

            {/* Lista Lo que recibes hoy */}
            <div className="mt-6">
              <h4 className="font-extrabold text-base" style={{ color: "#3D1D10" }}>
                Lo que recibes hoy:
              </h4>
              <ul className="mt-3 space-y-2.5 text-sm" style={{ color: "#3D1D10" }}>
                {[
                  `Planner personalizado con más de 150 páginas exclusivas para ${name}`,
                  "Sistema de Misiones y Recompensas adaptado al cerebro TDAH infantil",
                  "Rutinas visuales de mañana, tarde y noche",
                  "Guía completa para los padres — cómo usar, cómo mantener, cómo adaptar",
                  "Acceso Vitalicio y Actualizaciones Gratuitas",
                  "Garantía de 30 días — satisfacción o tu dinero de vuelta",
                  "Acceso inmediato por e-mail + soporte directo por WhatsApp en caso de dudas",
                ].map((it) => (
                  <li key={it} className="flex items-start gap-2.5">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-extrabold mt-0.5"
                      style={{ backgroundColor: "#22C55E" }}
                    >
                      ✓
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <CTA ctaKey="cta-offer-card" label="COMPRAR AHORA →" big action="checkout" />

            <p className="mt-4 text-center text-xs" style={{ color: "#7B5E48" }}>
              🔒 Compra Segura • 📧 Acceso Inmediato • 🛡️ Garantía de 7 días
            </p>
            <p className="mt-2 text-center text-xs" style={{ color: "#7B5E48" }}>
              Si en los primeros 7 días no estás 100% satisfecho con los resultados de {name}, te
              devolvemos el dinero sin preguntas.
            </p>
          </div>
        </div>

        {/* BLOCO 7 — FAQ */}
        <h2 className="mt-10 text-xl font-extrabold text-center" style={{ color: "#3D1D10" }}>
          Preguntas frecuentes
        </h2>
        <div className="mt-5 flex flex-col gap-3">
          {faqs.map((f, i) => (
            <FAQ key={i} q={f.q} a={f.a} />
          ))}
        </div>

        <CTA ctaKey="cta-footer" label={`Quiero el planner de ${name} ahora →`} action="checkout" />

        <p className="mt-8 text-center text-xs" style={{ color: "#B8A78F" }}>
          Política de Privacidad • Términos de Uso • Soporte
        </p>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EFE6D6" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ backgroundColor: "#FDECEC" }}
      >
        <span className="font-bold text-sm" style={{ color: "#3D1D10" }}>
          {q}
        </span>
        <span style={{ color: "#3D1D10" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 py-3 text-sm" style={{ backgroundColor: "#EBF7EE", color: "#15803D" }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default QuizFunnel;
