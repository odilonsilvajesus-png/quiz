import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { config } from "../config.js";
import { ffmpeg, probeDuration } from "../editor/ffmpeg.js";
import type { Word } from "../types.js";
import { request } from "../util.js";

/** Transcreve o áudio com o tempo de cada palavra (ElevenLabs Speech-to-Text). */
export async function transcribeElevenLabs(audioFile: string): Promise<{ words: Word[]; language?: string }> {
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

/**
 * Transcrição com a OpenAI (Whisper). A API aceita até 25 MB por arquivo, então
 * áudios longos são enviados em partes de 20 minutos e os tempos somados.
 */
export async function transcribeOpenAI(audioFile: string): Promise<{ words: Word[]; language?: string }> {
  const client = new OpenAI({ apiKey: config.openai.apiKey });
  const duration = await probeDuration(audioFile);
  const CHUNK = 20 * 60;
  const words: Word[] = [];
  let language: string | undefined;
  for (let start = 0; start < duration; start += CHUNK) {
    const part = path.join(path.dirname(audioFile), `stt-${start}.mp3`);
    await ffmpeg(["-ss", String(start), "-t", String(CHUNK), "-i", audioFile, "-c", "copy", part]);
    try {
      const res = await client.audio.transcriptions.create({
        file: fs.createReadStream(part),
        model: config.openai.sttModel,
        response_format: "verbose_json",
        timestamp_granularities: ["word"],
      });
      language ??= res.language;
      for (const w of res.words ?? []) {
        if (w.word.trim()) words.push({ text: w.word.trim(), start: start + w.start, end: start + w.end });
      }
    } finally {
      fs.rmSync(part, { force: true });
    }
  }
  return { words, language };
}

export function transcribe(provider: "elevenlabs" | "openai", audioFile: string) {
  return provider === "elevenlabs" ? transcribeElevenLabs(audioFile) : transcribeOpenAI(audioFile);
}
