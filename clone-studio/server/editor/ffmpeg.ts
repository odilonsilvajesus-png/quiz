import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const FFMPEG = process.env.FFMPEG_PATH || (ffmpegPath as unknown as string) || "ffmpeg";

/** Executa o ffmpeg e rejeita com as últimas linhas do log em caso de erro. */
export function ffmpeg(args: string[], opts: { cwd?: string; onProgress?: (seconds: number) => void } = {}) {
  return new Promise<string>((resolve, reject) => {
    const proc = spawn(FFMPEG, ["-hide_banner", "-y", ...args], { cwd: opts.cwd });
    let log = "";
    proc.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      log = (log + text).slice(-20000);
      const m = /time=(\d+):(\d+):(\d+\.\d+)/.exec(text);
      if (m && opts.onProgress) opts.onProgress(+m[1] * 3600 + +m[2] * 60 + +m[3]);
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve(log);
      else reject(new Error(`ffmpeg falhou (código ${code}):\n${log.split("\n").slice(-15).join("\n")}`));
    });
  });
}

/** Duração em segundos de um arquivo de mídia. */
export async function probeDuration(file: string) {
  const log = await ffmpeg(["-i", file, "-f", "null", "-t", "0", "-"]);
  const m = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(log);
  if (!m) throw new Error(`Não foi possível ler a duração de ${file}`);
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
}

export async function hasAudioStream(file: string) {
  const log = await ffmpeg(["-i", file, "-f", "null", "-t", "0", "-"]);
  return /Stream #\d+:\d+.*Audio:/.test(log);
}
