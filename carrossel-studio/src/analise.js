// Analisa o conteúdo REAL de um post, não só a legenda:
// - Reels/vídeo: baixa o vídeo e transcreve a fala.
// - Carrossel/imagem: a IA lê o texto de cada slide e descreve o visual.
// Usa a OpenAI (mesma OPENAI_API_KEY). Sem chave, o post fica só com a legenda.
import OpenAI, { toFile } from "openai";
import { emParalelo } from "./imagens.js";
import { registrarUso, custoTranscricao, custoTextoOpenAI } from "./custos.js";

const MODELO_TRANSCRICAO = () => process.env.TRANSCRICAO_MODELO || "gpt-4o-transcribe";
const MODELO_VISAO = () => process.env.OPENAI_MODEL || "gpt-5.5";
const LIMITE_VIDEO = 25 * 1024 * 1024; // limite de arquivo da transcrição

export const podeAnalisar = () => Boolean(process.env.OPENAI_API_KEY);

async function baixar(url) {
  const resp = await fetch(url, { signal: AbortSignal.timeout(90_000) });
  if (!resp.ok) throw new Error(`não consegui baixar a mídia (${resp.status})`);
  return Buffer.from(await resp.arrayBuffer());
}

async function transcrever(client, urlVideo) {
  const video = await baixar(urlVideo);
  if (video.length > LIMITE_VIDEO) throw new Error("vídeo grande demais para transcrever");
  const resposta = await client.audio.transcriptions.create({
    file: await toFile(video, "reel.mp4", { type: "video/mp4" }),
    model: MODELO_TRANSCRICAO(),
    language: "pt",
  });
  registrarUso({ servico: "transcrição", modelo: MODELO_TRANSCRICAO(), usd: custoTranscricao(MODELO_TRANSCRICAO(), resposta.usage) });
  return (resposta.text || "").trim();
}

async function lerSlides(client, urls) {
  // As imagens vão embutidas (base64): links do Instagram costumam bloquear acesso de fora.
  const imagens = [];
  for (const url of urls.slice(0, 10)) {
    const dados = await baixar(url);
    imagens.push({ type: "input_image", image_url: `data:image/jpeg;base64,${dados.toString("base64")}`, detail: "auto" });
  }
  const resposta = await client.responses.create({
    model: MODELO_VISAO(),
    input: [{
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Estas são as imagens de um post do Instagram, na ordem. Para cada uma, escreva 'Slide N:' seguido do texto exato que aparece nela (se houver) e, entre colchetes, uma descrição visual curta. Não invente texto que não está na imagem.",
        },
        ...imagens,
      ],
    }],
  });
  registrarUso({ servico: "leitura de slides", modelo: resposta.model, usd: custoTextoOpenAI(resposta.model, resposta.usage) });
  return (resposta.output_text || "").trim();
}

// Preenche post.analise = { transcricao?, slides?, erro? }. Não lança erro: falha vira aviso no post.
export async function analisarPost(post) {
  // Tempo limite por chamada: um vídeo ou imagem travado não pode segurar a coleta inteira.
  const client = new OpenAI({ timeout: 180_000, maxRetries: 1 });
  const analise = {};
  try {
    if (post.midia?.video) analise.transcricao = await transcrever(client, post.midia.video);
    if (post.midia?.imagens?.length && post.tipo !== "reels" && post.tipo !== "video") {
      analise.slides = await lerSlides(client, post.midia.imagens);
    }
  } catch (erro) {
    analise.erro = erro.message;
  }
  analise.em = new Date().toISOString();
  return analise;
}

// Analisa os `limite` primeiros posts ainda sem análise (a lista já vem ranqueada).
export async function aprofundar(posts, { limite = 12, log = () => {} } = {}) {
  if (!podeAnalisar()) return 0;
  const pendentes = posts.filter((p) => p.plataforma === "instagram" && p.midia && !p.analise).slice(0, limite);
  if (!pendentes.length) return 0;
  log(`Analisando o conteúdo real de ${pendentes.length} post(s): fala dos reels e texto dos carrosséis...`);
  let feitos = 0;
  const resultados = await emParalelo(pendentes.map((p) => async () => {
    const r = await analisarPost(p);
    log(`Analisando o conteúdo real: ${++feitos} de ${pendentes.length} posts (fala dos reels e texto dos carrosséis)...`);
    return r;
  }), 3);
  resultados.forEach((r, i) => { pendentes[i].analise = r.ok ? r.valor : { erro: r.erro.message }; });
  return pendentes.length;
}

// Texto completo usado pela IA: o conteúdo real vem primeiro, a legenda por último.
export function conteudoCompleto(post) {
  const partes = [];
  if (post.analise?.transcricao) partes.push(`FALA DO VÍDEO (transcrição):\n${post.analise.transcricao}`);
  if (post.analise?.slides) partes.push(`TEXTO E VISUAL DOS SLIDES:\n${post.analise.slides}`);
  partes.push(`LEGENDA:\n${post.texto || "(sem legenda)"}`);
  return partes.join("\n\n");
}
