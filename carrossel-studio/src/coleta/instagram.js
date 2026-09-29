// Coleta posts de perfis do Instagram pelo Apify (ator apify/instagram-scraper, pago por uso).
// A API oficial da Meta só entrega métricas completas de contas que você administra.
import { registrarUso } from "../custos.js";

const ATOR = "apify~instagram-scraper";

export function normalizarHandle(ref) {
  const m = ref.match(/instagram\.com\/([\w.]+)/);
  return (m ? m[1] : ref).replace(/^@/, "").trim();
}

const API = () => process.env.APIFY_URL || "https://api.apify.com/v2";
const TEMPO_MAXIMO = 10 * 60; // segundos que o Apify pode rodar antes de parar e devolver o que já coletou
const FINAIS = ["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"];

async function pedir(caminho, opcoes = {}) {
  const sep = caminho.includes("?") ? "&" : "?";
  const resp = await fetch(`${API()}${caminho}${sep}token=${process.env.APIFY_TOKEN}`, {
    ...opcoes,
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(90_000),
  }).catch((erro) => {
    throw new Error(erro.name === "TimeoutError"
      ? "o Apify demorou demais para responder."
      : "não consegui falar com o Apify. Confira a internet e tente de novo.");
  });
  if (!resp.ok) {
    const texto = await resp.text();
    if (resp.status === 401) throw new Error("APIFY_TOKEN inválido. Confira a chave no .env.");
    if (resp.status === 402) throw new Error("Os créditos do Apify acabaram. Veja em apify.com → Billing.");
    throw new Error(`Apify respondeu ${resp.status}: ${texto.slice(0, 300)}`);
  }
  return resp.json();
}

// Roda o ator em segundo plano no Apify e acompanha até terminar (o modo "esperar a resposta" corta em 5 minutos).
async function rodarAtor(entrada, log) {
  let run = (await pedir(`/acts/${ATOR}/runs?timeout=${TEMPO_MAXIMO}`, { method: "POST", body: JSON.stringify(entrada) })).data;
  const inicio = Date.now();
  const limite = inicio + (TEMPO_MAXIMO + 120) * 1000;
  while (!FINAIS.includes(run.status)) {
    if (Date.now() > limite) {
      await pedir(`/actor-runs/${run.id}/abort`, { method: "POST" }).catch(() => {});
      break;
    }
    log(`Instagram: o Apify está coletando os posts (${Math.round((Date.now() - inicio) / 1000)}s)...`);
    try {
      run = (await pedir(`/actor-runs/${run.id}?waitForFinish=20`)).data;
    } catch (erro) {
      log(`Instagram: aguardando o Apify (${erro.message})...`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  // O Apify informa quanto a execução custou (em dólar).
  const final = await pedir(`/actor-runs/${run.id}`).then((r) => r.data).catch(() => run);
  registrarUso({ servico: "coleta Apify", modelo: ATOR, usd: final.usageTotalUsd ?? null });
  const itens = await pedir(`/datasets/${run.defaultDatasetId}/items?clean=true&format=json`);
  if (run.status === "FAILED" && !itens.length) throw new Error("A coleta do Instagram falhou no Apify. Tente de novo em alguns minutos.");
  if (run.status !== "SUCCEEDED") log(`Instagram: o Apify parou antes do fim (${run.status}); usando os ${itens.length} itens coletados.`);
  return itens;
}

export async function coletarPerfis(refs, { limite = 30, periodoDias = 90, log = () => {} } = {}) {
  const handles = refs.map(normalizarHandle);
  const itens = await rodarAtor({
    directUrls: handles.map((h) => `https://www.instagram.com/${h}/`),
    resultsType: "posts",
    resultsLimit: limite,
    onlyPostsNewerThan: `${periodoDias} days`,
  }, log);

  return itens
    .filter((p) => p.ownerUsername && p.caption !== undefined)
    .map((p) => ({
      id: `ig:${p.shortCode || p.id}`,
      plataforma: "instagram",
      perfil: `@${p.ownerUsername}`,
      seguidores: 0,
      url: p.url,
      titulo: (p.caption || "").split("\n")[0].slice(0, 120),
      texto: (p.caption || "").slice(0, 4000),
      tipo: p.type === "Sidecar" ? "carrossel" : p.type === "Video" ? "reels" : "imagem",
      publicado_em: p.timestamp,
      thumbnail: p.displayUrl || "",
      // Mídia real do post, usada para transcrever a fala dos reels e ler o texto dos slides.
      midia: {
        video: p.videoUrl || null,
        imagens: (p.images?.length ? p.images : (p.childPosts || []).map((c) => c.displayUrl)).filter(Boolean).length
          ? (p.images?.length ? p.images : (p.childPosts || []).map((c) => c.displayUrl)).filter(Boolean)
          : [p.displayUrl].filter(Boolean),
      },
      metricas: {
        visualizacoes: Number(p.videoViewCount || p.videoPlayCount || 0),
        curtidas: Math.max(0, Number(p.likesCount || 0)),
        comentarios: Number(p.commentsCount || 0),
      },
    }));
}

// Posts do próprio cliente, usados para entender o tom de voz (fala, slides e legendas).
export async function coletarPostsDoCliente(handle, limite = 30, log = () => {}) {
  return coletarPerfis([handle], { limite, periodoDias: 365, log });
}
