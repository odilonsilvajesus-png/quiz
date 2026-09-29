import fs from "node:fs";
import path from "node:path";
import { config } from "../config.js";
import type { Profile, Word } from "../types.js";
import { request } from "../util.js";

const API = "https://api.elevenlabs.io/v1";
const headers = () => ({ "xi-api-key": config.elevenlabs.apiKey });

/** Cria um clone de voz instantâneo a partir de amostras de áudio (1 a 25 arquivos). */
export async function cloneVoice(name: string, files: { path: string; originalname: string; mimetype: string }[]) {
  const form = new FormData();
  form.append("name", name);
  form.append("description", "Clone de voz criado pelo Clone Studio");
  form.append("remove_background_noise", "true");
  for (const f of files) {
    form.append("files", new Blob([fs.readFileSync(f.path)], { type: f.mimetype }), f.originalname);
  }
  const res = await request(`${API}/voices/add`, { method: "POST", headers: headers(), body: form, retries: 1 });
  const data = (await res.json()) as { voice_id: string };
  return data.voice_id;
}

export async function listVoices() {
  const res = await request(`${API}/voices`, { headers: headers() });
  const data = (await res.json()) as { voices: { voice_id: string; name: string; category: string }[] };
  return data.voices.map((v) => ({ id: v.voice_id, name: v.name, category: v.category }));
}

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

/** Gera a narração com a voz clonada e devolve o tempo de cada palavra (usado nas legendas). */
export async function synthesize(text: string, voice: Profile["voice"], outFile: string): Promise<Word[]> {
  if (!voice.voiceId) throw new Error("Nenhuma voz configurada. Crie ou selecione sua voz em “Meu Clone”.");
  const res = await request(
    `${API}/text-to-speech/${voice.voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: config.elevenlabs.modelId,
        voice_settings: {
          stability: voice.stability,
          similarity_boost: voice.similarity,
          style: voice.style,
          speed: voice.speed,
          use_speaker_boost: true,
        },
      }),
    },
  );
  const data = (await res.json()) as { audio_base64: string; alignment: Alignment };
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, Buffer.from(data.audio_base64, "base64"));
  return wordsFromAlignment(data.alignment);
}

export function wordsFromAlignment(a: Alignment): Word[] {
  const words: Word[] = [];
  let current: Word | null = null;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      current = null;
      return;
    }
    if (!current) {
      current = { text: "", start: a.character_start_times_seconds[i], end: 0 };
      words.push(current);
    }
    current.text += ch;
    current.end = a.character_end_times_seconds[i];
  });
  return words;
}
