import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { config } from "../config.js";
import type { AutoOptions, Clip, Word } from "../types.js";
import { isFiller } from "./autocut.js";

type Sentence = { index: number; text: string; start: number; end: number };

const LENGTHS: Record<AutoOptions["clipLength"], { min: number; target: number; max: number; label: string }> = {
  short: { min: 15, target: 25, max: 35, label: "15 a 35 segundos" },
  medium: { min: 30, target: 45, max: 65, label: "30 a 65 segundos" },
  long: { min: 55, target: 75, max: 95, label: "55 a 95 segundos" },
};

export function sentencesFrom(words: Word[]): Sentence[] {
  const out: Sentence[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ index: out.length, text: cur.map((w) => w.text).join(" "), start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const long = cur.length >= 40;
    if (/[.!?…]$/.test(w.text) || long || (next && next.start - w.end > 1.2)) flush();
  });
  flush();
  return out;
}

const shorten = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);

/** Sem IA: agrupa frases seguidas até chegar na duração pedida. */
function heuristic(sentences: Sentence[], opts: AutoOptions, duration: number): Omit<Clip, "id">[] {
  const L = LENGTHS[opts.clipLength];
  const clips: Omit<Clip, "id">[] = [];
  if (!sentences.length) {
    // Sem transcrição: fatias de tempo fixas.
    for (let t = 0; t + L.min <= duration || (t === 0 && duration > 0); t += L.target) {
      const end = Math.min(duration, t + L.target);
      clips.push({ title: `Corte ${clips.length + 1}`, hook: "", start: t, end });
      if (end >= duration) break;
    }
  } else {
    let group: Sentence[] = [];
    for (const s of sentences) {
      group.push(s);
      const len = s.end - group[0].start;
      if (len >= L.target || (len >= L.min && /[.!?…]$/.test(s.text))) {
        clips.push({ title: shorten(group[0].text, 70), hook: shorten(group[0].text, 45), start: group[0].start, end: s.end });
        group = [];
      }
    }
    if (group.length && group[group.length - 1].end - group[0].start >= L.min * 0.6) {
      clips.push({ title: shorten(group[0].text, 70), hook: shorten(group[0].text, 45), start: group[0].start, end: group[group.length - 1].end });
    }
  }
  return opts.clipCount > 0 ? clips.slice(0, opts.clipCount) : clips;
}

const ClipPlan = z.object({
  clips: z.array(
    z.object({
      title: z.string(),
      hook: z.string(),
      start_sentence: z.number().int(),
      end_sentence: z.number().int(),
      reason: z.string(),
    }),
  ),
});

/** Com Claude: escolhe os trechos com mais potencial de viralizar e escreve título e gancho. */
async function withClaude(sentences: Sentence[], opts: AutoOptions, videoTitle: string): Promise<Omit<Clip, "id">[]> {
  const L = LENGTHS[opts.clipLength];
  const client = new Anthropic({ apiKey: config.anthropic.apiKey });
  const transcript = sentences.map((s) => `[${s.index}] (${s.start.toFixed(1)}s–${s.end.toFixed(1)}s) ${s.text}`).join("\n");
  const count = opts.clipCount > 0 ? `exatamente ${opts.clipCount} cortes (ou menos, se o vídeo não tiver material suficiente)` : "quantos cortes realmente bons existirem (normalmente de 2 a 8)";

  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "high", format: betaZodOutputFormat(ClipPlan) },
    system:
      "Você é editor de vídeos curtos para Reels, TikTok e Shorts, especialista em encontrar os trechos de um vídeo longo que funcionam sozinhos como cortes. " +
      "Um bom corte começa forte (uma frase que prende nos primeiros 3 segundos), tem uma ideia completa com começo, meio e fim, e não depende de contexto de fora do trecho. " +
      "Escreva títulos e ganchos no idioma do vídeo, curtos e sem clickbait enganoso.",
    messages: [
      {
        role: "user",
        content:
          `Vídeo: "${videoTitle}"\n\nTranscrição numerada por frase, com tempos:\n\n${transcript}\n\n` +
          `Escolha ${count}. Cada corte deve durar entre ${L.label} (some os tempos das frases) e ser um intervalo contínuo de frases (start_sentence até end_sentence, inclusive). ` +
          `Os cortes não podem se sobrepor. Para cada um: title (até 70 caracteres, para a legenda do post), hook (até 45 caracteres, texto que aparece na tela nos primeiros segundos) e reason (uma frase dizendo por que esse trecho funciona).`,
      },
    ],
  });

  if (response.stop_reason === "refusal") throw new Error("A IA recusou analisar este vídeo.");
  const plan = response.parsed_output;
  if (!plan) throw new Error("A IA não devolveu os cortes no formato esperado.");

  const last = sentences.length - 1;
  const used: [number, number][] = [];
  const clips: Omit<Clip, "id">[] = [];
  for (const c of plan.clips) {
    const a = Math.max(0, Math.min(last, c.start_sentence));
    const b = Math.max(a, Math.min(last, c.end_sentence));
    if (used.some(([x, y]) => a <= y && b >= x)) continue;
    used.push([a, b]);
    clips.push({ title: shorten(c.title, 90), hook: shorten(c.hook, 60), reason: c.reason, start: sentences[a].start, end: sentences[b].end });
  }
  return clips.sort((x, y) => x.start - y.start);
}

export async function planClips(words: Word[], duration: number, opts: AutoOptions, videoTitle: string, useClaude: boolean) {
  if (opts.mode === "full") {
    return [{ id: "c1", title: videoTitle, hook: "", start: 0, end: duration }];
  }
  const sentences = sentencesFrom(opts.removeFillers ? words.filter((w) => !isFiller(w)) : words);
  const planned = useClaude && sentences.length >= 3 ? await withClaude(sentences, opts, videoTitle) : heuristic(sentences, opts, duration);
  if (!planned.length) return [{ id: "c1", title: videoTitle, hook: "", start: 0, end: duration }];
  return planned.map((c, i) => ({ ...c, id: `c${i + 1}` }));
}
