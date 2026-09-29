import type { EditOptions, Word } from "../types.js";

export type Line = { words: Word[]; start: number; end: number };

/** Agrupa palavras em linhas curtas, quebrando em pontuação e pausas. */
export function groupWords(words: Word[], perLine: number): Line[] {
  const lines: Line[] = [];
  let current: Word[] = [];
  const flush = () => {
    if (current.length) lines.push({ words: current, start: current[0].start, end: current[current.length - 1].end });
    current = [];
  };
  words.forEach((w, i) => {
    const next = words[i + 1];
    current.push(w);
    const pause = next ? next.start - w.end > 0.5 : true;
    if (current.length >= perLine || /[.!?…:;]$/.test(w.text) || pause) flush();
  });
  flush();
  return lines;
}

const assTime = (s: number) => {
  const cs = Math.max(0, Math.round(s * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const sec = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
};

const srtTime = (s: number) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)},${pad(ms % 1000, 3)}`;
};

/** #RRGGBB -> &HAABBGGRR (formato de cor do ASS). */
const assColor = (hex: string, alpha = 0) => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const a = alpha.toString(16).padStart(2, "0");
  return `&H${a}${c.slice(4, 6)}${c.slice(2, 4)}${c.slice(0, 2)}`.toUpperCase();
};

const clean = (t: string) => t.replace(/[{}\\]/g, "");

export const FONT_NAME = "Montserrat ExtraBold";

export function buildAss(words: Word[], opts: EditOptions, W: number, H: number, duration: number) {
  const scale = Math.min(W, H) / 1080;
  const c = opts.captions;
  const fontSize = Math.round(c.fontSize * scale);
  const alignment = { bottom: 2, middle: 5, top: 8 }[c.position];
  const marginV = c.position === "bottom" ? Math.round(H * (opts.format === "9:16" ? 0.2 : 0.08)) : Math.round(H * 0.1);
  const hookSize = Math.round(62 * scale);

  const styles = [
    `Style: Caption,${FONT_NAME},${fontSize},${assColor(c.color)},${assColor(c.color)},&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,${Math.round(6 * scale)},${Math.round(3 * scale)},${alignment},${Math.round(70 * scale)},${Math.round(70 * scale)},${marginV},1`,
    `Style: Hook,${FONT_NAME},${hookSize},&H00000000,&H00000000,&H00FFFFFF,&H00FFFFFF,0,0,0,0,100,100,0,0,3,${Math.round(18 * scale)},0,8,${Math.round(80 * scale)},${Math.round(80 * scale)},${Math.round(H * 0.12)},1`,
    `Style: Mark,${FONT_NAME},${Math.round(34 * scale)},&H40FFFFFF,&H40FFFFFF,&H80000000,&H00000000,0,0,0,0,100,100,0,0,1,${Math.round(2 * scale)},0,9,${Math.round(40 * scale)},${Math.round(40 * scale)},${Math.round(50 * scale)},1`,
  ];

  const events: string[] = [];
  const fmt = (t: string) => clean(c.uppercase ? t.toUpperCase() : t);

  if (c.enabled) {
    for (const line of groupWords(words, c.wordsPerLine)) {
      if (c.style === "simple") {
        events.push(`Dialogue: 0,${assTime(line.start)},${assTime(line.end + 0.15)},Caption,,0,0,0,,${line.words.map((w) => fmt(w.text)).join(" ")}`);
        continue;
      }
      line.words.forEach((w, i) => {
        const next = line.words[i + 1];
        const end = next ? next.start : line.end + 0.15;
        const text = line.words
          .map((x, j) =>
            j === i ? `{\\c${assColor(c.highlight)}\\fscx112\\fscy112}${fmt(x.text)}{\\r}` : fmt(x.text),
          )
          .join(" ");
        events.push(`Dialogue: 0,${assTime(w.start)},${assTime(end)},Caption,,0,0,0,,${text}`);
      });
    }
  }
  if (opts.hook.enabled && opts.hook.text.trim()) {
    events.push(`Dialogue: 1,${assTime(0)},${assTime(Math.min(opts.hook.seconds, duration))},Hook,,0,0,0,,{\\fad(150,250)}${clean(opts.hook.text.trim())}`);
  }
  if (opts.watermark.enabled && opts.watermark.text.trim()) {
    events.push(`Dialogue: 2,${assTime(0)},${assTime(duration + 1)},Mark,,0,0,0,,${clean(opts.watermark.text.trim())}`);
  }

  return [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${W}`,
    `PlayResY: ${H}`,
    "WrapStyle: 0",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    ...styles,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ...events,
    "",
  ].join("\n");
}

export function buildSrt(words: Word[], perLine: number) {
  return groupWords(words, perLine)
    .map((l, i) => `${i + 1}\n${srtTime(l.start)} --> ${srtTime(l.end)}\n${l.words.map((w) => w.text).join(" ")}\n`)
    .join("\n");
}
