import fs from "node:fs";
import path from "node:path";
import { UPLOADS_DIR } from "../config.js";
import type { EditOptions, Layout, MediaFile, Word } from "../types.js";
import { type AssOverrides, assTime, clean } from "./captions.js";
import { ffmpeg } from "./ffmpeg.js";

export const LAYOUT_NAMES: Record<Layout, string> = {
  fullscreen: "Tela cheia",
  split: "Tela dividida",
  podcast: "Podcast",
  pip: "Apresentador",
  frame: "Moldura",
};

export type Segment = { start: number; end: number };

/** Divide a fala em trechos (frases de ~2 a 5s). Cada trecho é um “corte”. */
export function segmentsFrom(words: Word[], duration: number): Segment[] {
  const segs: Segment[] = [];
  let start = 0;
  words.forEach((w, i) => {
    const next = words[i + 1];
    if (!next) return;
    const len = w.end - start;
    const sentenceEnd = /[.!?…:;]$/.test(w.text);
    if ((sentenceEnd && len >= 1.8) || len >= 4.5) {
      const cut = (w.end + next.start) / 2;
      segs.push({ start, end: cut });
      start = cut;
    }
  });
  segs.push({ start, end: duration });
  // Evita um último corte curtinho demais.
  if (segs.length > 1 && segs[segs.length - 1].end - segs[segs.length - 1].start < 1.2) {
    const last = segs.pop()!;
    segs[segs.length - 1].end = last.end;
  }
  return segs;
}

const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);
const IMAGE = /\.(jpe?g|png|webp|gif|bmp)$/i;

/**
 * Monta a trilha de “B-roll” no tamanho de uma caixa do layout, trocando de
 * vídeo/imagem a cada corte (imagens ganham um movimento de câmera lento).
 */
export async function buildBroll(dir: string, media: MediaFile[], segs: Segment[], w: number, h: number) {
  const files = media.map((m) => path.join(UPLOADS_DIR, m.file)).filter((f) => fs.existsSync(f));
  if (!files.length) return undefined;
  const out = `broll-${w}x${h}.mp4`;
  const inputs: string[] = [];
  const filters: string[] = [];
  segs.forEach((seg, i) => {
    const file = files[i % files.length];
    const d = Math.max(0.1, seg.end - seg.start).toFixed(3);
    if (IMAGE.test(file)) {
      inputs.push("-loop", "1", "-framerate", "30", "-t", d, "-i", file);
      const x = i % 2 ? `(iw-ow)*(1-t/${d})` : `(iw-ow)*t/${d}`;
      filters.push(
        `[${i}:v]scale=${even(w * 1.12)}:${even(h * 1.12)}:force_original_aspect_ratio=increase,` +
          `crop=${w}:${h}:x='${x}':y='(ih-oh)/2',setsar=1,fps=30,format=yuv420p,trim=duration=${d},setpts=PTS-STARTPTS[s${i}]`,
      );
    } else {
      inputs.push("-stream_loop", "-1", "-t", d, "-i", file);
      filters.push(
        `[${i}:v]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},setsar=1,fps=30,format=yuv420p,` +
          `trim=duration=${d},setpts=PTS-STARTPTS[s${i}]`,
      );
    }
  });
  filters.push(`${segs.map((_, i) => `[s${i}]`).join("")}concat=n=${segs.length}:v=1:a=0[out]`);
  await ffmpeg([...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", out], { cwd: dir });
  return out;
}

/** Monta o grafo de filtros do ffmpeg de um layout, com rótulos únicos. */
class Graph {
  filters: string[] = [];
  private n = 0;
  avatarUses = 0;
  label = (p = "x") => `[${p}${this.n++}]`;
  avatar = () => `[av${this.avatarUses++}]`;
  add = (f: string) => this.filters.push(f);
}

export type LayoutCtx = {
  W: number;
  H: number;
  opts: EditOptions;
  segs: Segment[];
  duration: number;
  person: { name: string; handle: string };
};

export type LayoutPlan = {
  /** Tamanhos de B-roll que o layout vai usar (gerados antes do render). */
  brollSizes: { w: number; h: number }[];
  build: (inputs: { avatar: string; broll?: (w: number, h: number) => string }) => {
    filters: string[];
    out: string;
    wave?: { label: string; w: number; h: number };
    ass: AssOverrides;
  };
};

const hex = (c: string) => `0x${c.replace("#", "")}`;

export function planLayout(layout: Layout, ctx: LayoutCtx): LayoutPlan {
  const { W, H, opts, segs, duration } = ctx;
  const scale = Math.min(W, H) / 1080;
  const vertical = H >= W;
  const border = even(6 * scale);
  const end = assTime(duration + 1);
  const title = (text: string, x: number, y: number) =>
    `Dialogue: 3,0:00:00.00,${end},Title,,0,0,0,,{\\an5\\pos(${Math.round(x)},${Math.round(y)})}${clean(text)}`;
  const tag = (text: string, x: number, y: number) =>
    `Dialogue: 3,0:00:00.00,${end},Tag,,0,0,0,,{\\an7\\pos(${Math.round(x)},${Math.round(y)})}${clean(text)}`;
  const personTag = [ctx.person.name, ctx.person.handle].filter(Boolean).join(" · ");

  return {
    brollSizes:
      layout === "split"
        ? [vertical ? { w: W, h: even(H / 2) } : { w: even(W / 2), h: H }]
        : layout === "pip"
          ? [{ w: W, h: H }]
          : [],
    build: ({ avatar, broll }) => {
      const g = new Graph();

      /** Redimensiona preenchendo a caixa; yBias puxa o corte para cima (rosto). */
      const cover = (input: string, w: number, h: number, yBias = 0.5) => {
        const out = g.label("c");
        g.add(`${input}scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}:(iw-ow)/2:(ih-oh)*${yBias},setsar=1${out}`);
        return out;
      };

      /** Câmera do avatar: com cortes dinâmicos alterna plano aberto e fechado a cada frase. */
      const camera = (w: number, h: number, yBias = 0.35) => {
        if (!opts.cuts || segs.length < 2) return cover(g.avatar(), w, h, yBias);
        const wide = cover(g.avatar(), w, h, yBias);
        const tight = g.label("t");
        g.add(`${g.avatar()}crop=iw/1.3:ih/1.3:(iw-ow)/2:(ih-oh)*0.3${tight}`);
        const close = cover(tight, w, h, yBias);
        const on = segs
          .filter((_, i) => i % 2 === 1)
          .map((s) => `between(t,${s.start.toFixed(2)},${s.end.toFixed(2)})`)
          .join("+");
        const out = g.label("cam");
        g.add(`${wide}${close}overlay=enable='${on}'${out}`);
        return out;
      };

      const withBorder = (input: string, w: number, h: number) => {
        const out = g.label("b");
        g.add(`${input}pad=${w}:${h}:${border}:${border}:color=white${out}`);
        return out;
      };

      const blurredBackground = () => {
        const bg = cover(g.avatar(), W, H);
        const out = g.label("bg");
        g.add(`${bg}boxblur=luma_radius=${Math.round(40 * scale)}:luma_power=2,eq=brightness=-0.2:saturation=0.8${out}`);
        return out;
      };

      const overlay = (base: string, top: string, x: number, y: number) => {
        const out = g.label("o");
        g.add(`${base}${top}overlay=${Math.round(x)}:${Math.round(y)}${out}`);
        return out;
      };

      const colorCard = (w: number, h: number) => {
        const out = g.label("col");
        g.add(`color=c=${hex(opts.background)}:s=${w}x${h}:r=30:d=${duration.toFixed(2)},setsar=1${out}`);
        return out;
      };

      const events: string[] = [];
      let out: string;
      let ass: AssOverrides = {};
      let wave: { label: string; w: number; h: number } | undefined;

      switch (layout) {
        case "split": {
          // Tela dividida: mídia de apoio em cima (ou à esquerda), você embaixo (ou à direita).
          const bw = vertical ? W : even(W / 2);
          const bh = vertical ? even(H / 2) : H;
          let top: string;
          if (broll) {
            top = cover(broll(bw, bh), bw, bh);
          } else {
            top = colorCard(bw, bh);
            events.push(title(opts.layoutTitle || opts.hook.text || "", bw / 2, bh / 2));
          }
          const me = camera(bw, vertical ? H - bh : W - bw, 0.3);
          out = g.label("split");
          g.add(`${top}${me}${vertical ? "vstack" : "hstack"}=inputs=2${out}`);
          const line = g.label("l");
          g.add(
            vertical
              ? `${out}drawbox=x=0:y=${bh - border / 2}:w=iw:h=${border}:color=${hex(opts.captions.highlight)}:t=fill${line}`
              : `${out}drawbox=x=${bw - border / 2}:y=0:w=${border}:h=ih:color=${hex(opts.captions.highlight)}:t=fill${line}`,
          );
          out = line;
          ass = vertical ? { alignment: 5, marginV: 0 } : { alignment: 2, marginV: Math.round(H * 0.08) };
          break;
        }

        case "podcast": {
          // Estúdio de podcast: fundo desfocado, cartão com a câmera, onda sonora e nome.
          const [cw, aspect, cy] = vertical ? [W * 0.88, 4 / 5, H * 0.14] : W === H ? [W * 0.64, 1, H * 0.12] : [W * 0.62, 16 / 9, H * 0.12];
          const cardW = even(cw);
          const cardH = even(cardW / aspect);
          const cardX = (W - cardW) / 2;
          const card = withBorder(camera(cardW - 2 * border, cardH - 2 * border, 0.3), cardW, cardH);
          out = overlay(blurredBackground(), card, cardX, cy);
          const waveH = even(H * (vertical ? 0.07 : 0.08));
          wave = { label: g.label("wave"), w: cardW, h: waveH };
          const withWave = g.label("pw");
          g.add(`${out}${wave.label}overlay=${Math.round(cardX)}:${Math.round(cy + cardH + H * 0.015)}${withWave}`);
          out = withWave;
          events.push(title(opts.layoutTitle || "PODCAST", W / 2, cy / 2));
          if (personTag) events.push(tag(personTag, cardX + border + 24 * scale, cy + border + 24 * scale));
          ass = { alignment: 2, marginV: Math.round(H - (cy + cardH) + 40 * scale), marginH: Math.round(cardX + 40 * scale) };
          break;
        }

        case "pip": {
          // Apresentador: mídia de apoio em tela cheia e você numa janela no canto.
          const bg = broll ? cover(broll(W, H), W, H) : blurredBackground();
          const bw = even(W * (vertical ? 0.46 : W === H ? 0.36 : 0.26));
          const bh = even(bw * 1.25);
          const margin = Math.round(W * 0.05);
          const box = withBorder(camera(bw - 2 * border, bh - 2 * border, 0.25), bw, bh);
          out = overlay(bg, box, W - bw - margin, vertical ? H * 0.62 : H - bh - margin);
          if (opts.layoutTitle) events.push(tag(opts.layoutTitle, margin, H * (vertical ? 0.08 : 0.06)));
          ass = vertical ? { alignment: 5, marginV: 0 } : { alignment: 8, marginV: Math.round(H * 0.16) };
          break;
        }

        case "frame": {
          // Moldura: você num cartão centralizado sobre o próprio vídeo desfocado.
          const cardW = even(W * (vertical ? 0.86 : 0.7));
          const cardH = even(vertical ? cardW : cardW * (H / W));
          const cy = (H - cardH) / 2 - (vertical ? H * 0.05 : 0);
          const card = withBorder(camera(cardW - 2 * border, cardH - 2 * border, 0.3), cardW, cardH);
          out = overlay(blurredBackground(), card, (W - cardW) / 2, cy);
          if (opts.layoutTitle) events.push(title(opts.layoutTitle, W / 2, cy / 2));
          ass = vertical
            ? { alignment: 8, marginV: Math.round(cy + cardH + 50 * scale) }
            : { alignment: 2, marginV: Math.round(H - (cy + cardH) + 30 * scale) };
          break;
        }

        default:
          out = camera(W, H);
      }

      // O avatar é usado várias vezes no mesmo grafo: divide a entrada uma vez só.
      const prelude = [`${avatar}fps=30,setsar=1,split=${Math.max(1, g.avatarUses)}${Array.from({ length: Math.max(1, g.avatarUses) }, (_, i) => `[av${i}]`).join("")}`];
      if (g.avatarUses === 0) prelude[0] = `${avatar}nullsink`;
      return { filters: [...prelude, ...g.filters], out, wave, ass: { ...ass, events } };
    },
  };
}
