import fs from "node:fs";
import { config } from "../config.js";
import type { Word } from "../types.js";
import { request } from "../util.js";

/** Transcreve o áudio com o tempo de cada palavra (ElevenLabs Speech-to-Text). */
export async function transcribe(audioFile: string): Promise<{ words: Word[]; language?: string }> {
  const form = new FormData();
  form.append("model_id", config.elevenlabs.sttModelId);
  form.append("timestamps_granularity", "word");
  form.append("tag_audio_events", "false");
  form.append("file", new Blob([fs.readFileSync(audioFile)], { type: "audio/mpeg" }), "audio.mp3");
  const res = await request("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": config.elevenlabs.apiKey },
    body: form,
    retries: 2,
  });
  const data = (await res.json()) as {
    language_code?: string;
    words: { text: string; start: number; end: number; type: string }[];
  };
  return {
    language: data.language_code,
    words: data.words.filter((w) => w.type === "word" && w.text.trim()).map((w) => ({ text: w.text.trim(), start: w.start, end: w.end })),
  };
}
