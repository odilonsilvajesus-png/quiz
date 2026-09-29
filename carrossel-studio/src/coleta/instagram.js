// Coleta posts de perfis do Instagram pelo Apify (ator apify/instagram-scraper, pago por uso).
// A API oficial da Meta só entrega métricas completas de contas que você administra.
const ATOR = "apify~instagram-scraper";

function normalizarHandle(ref) {
  const m = ref.match(/instagram\.com\/([\w.]+)/);
  return (m ? m[1] : ref).replace(/^@/, "").trim();
}

export async function coletarPerfis(refs, { limite = 30, periodoDias = 90 } = {}) {
  const handles = refs.map(normalizarHandle);
  const url = `https://api.apify.com/v2/acts/${ATOR}/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      directUrls: handles.map((h) => `https://www.instagram.com/${h}/`),
      resultsType: "posts",
      resultsLimit: limite,
      onlyPostsNewerThan: `${periodoDias} days`,
    }),
  });
  if (!resp.ok) {
    throw new Error(`Apify respondeu ${resp.status}: ${await resp.text()}`);
  }
  const itens = await resp.json();

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
export async function coletarPostsDoCliente(handle, limite = 30) {
  return coletarPerfis([handle], { limite, periodoDias: 365 });
}
