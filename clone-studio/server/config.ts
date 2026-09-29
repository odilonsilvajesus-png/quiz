import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..");

try {
  process.loadEnvFile(path.join(ROOT, ".env"));
} catch {
  // .env é opcional: sem chaves a plataforma roda em modo demo.
}

export const DATA_DIR = path.resolve(process.env.DATA_DIR ?? path.join(ROOT, "data"));
export const JOBS_DIR = path.join(DATA_DIR, "jobs");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
export const FONTS_DIR = path.join(ROOT, "server", "assets", "fonts");
export const DIST_DIR = path.join(ROOT, "dist");

export const config = {
  port: Number(process.env.PORT ?? 3001),
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY ?? "",
    modelId: process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
    sttModelId: process.env.ELEVENLABS_STT_MODEL_ID ?? "scribe_v1",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
  },
  heygen: {
    apiKey: process.env.HEYGEN_API_KEY ?? "",
    maxHeight: Number(process.env.HEYGEN_MAX_HEIGHT ?? 1080),
  },
};

export const voiceProvider = () => (config.elevenlabs.apiKey ? "elevenlabs" : "mock") as "elevenlabs" | "mock";
export const avatarProvider = () => (config.heygen.apiKey ? "heygen" : "mock") as "heygen" | "mock";
export const transcribeProvider = () => (config.elevenlabs.apiKey ? "elevenlabs" : "mock") as "elevenlabs" | "mock";
export const clipsProvider = () => (config.anthropic.apiKey ? "claude" : "auto") as "claude" | "auto";
