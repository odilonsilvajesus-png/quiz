// Coleta vídeos de canais do YouTube pela YouTube Data API v3 (oficial, gratuita dentro da cota).
const API = "https://www.googleapis.com/youtube/v3";

async function chamar(recurso, params) {
  const url = new URL(`${API}/${recurso}`);
  for (const [k, v] of Object.entries({ ...params, key: process.env.YOUTUBE_API_KEY })) {
    url.searchParams.set(k, v);
  }
  const resp = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!resp.ok) {
    throw new Error(`YouTube API ${recurso} respondeu ${resp.status}: ${await resp.text()}`);
  }
  return resp.json();
}

// Aceita "@handle", "UCxxxx" ou a URL do canal.
function identificarCanal(ref) {
  const limpo = ref.trim().replace(/\/+$/, "");
  const handle = limpo.match(/@[\w.-]+/);
  if (handle) return { forHandle: handle[0] };
  const id = limpo.match(/UC[\w-]{22}/);
  if (id) return { id: id[0] };
  return { forHandle: `@${limpo}` };
}

export async function coletarCanal(ref, { limite = 30, periodoDias = 90 } = {}) {
  const canal = await chamar("channels", { part: "snippet,contentDetails,statistics", ...identificarCanal(ref) });
  const info = canal.items?.[0];
  if (!info) throw new Error(`Canal do YouTube não encontrado: ${ref}`);

  const uploads = info.contentDetails.relatedPlaylists.uploads;
  const lista = await chamar("playlistItems", {
    part: "contentDetails",
    playlistId: uploads,
    maxResults: Math.min(limite, 50),
  });
  const ids = lista.items.map((i) => i.contentDetails.videoId);
  if (!ids.length) return [];

  const videos = await chamar("videos", { part: "snippet,statistics", id: ids.join(",") });
  const corte = Date.now() - periodoDias * 86400000;

  return videos.items
    .filter((v) => new Date(v.snippet.publishedAt).getTime() >= corte)
    .map((v) => ({
      id: `yt:${v.id}`,
      plataforma: "youtube",
      perfil: info.snippet.customUrl || info.snippet.title,
      seguidores: Number(info.statistics.subscriberCount || 0),
      url: `https://www.youtube.com/watch?v=${v.id}`,
      titulo: v.snippet.title,
      texto: `${v.snippet.title}\n\n${v.snippet.description}`.slice(0, 4000),
      tipo: "video",
      publicado_em: v.snippet.publishedAt,
      thumbnail: v.snippet.thumbnails?.high?.url || "",
      metricas: {
        visualizacoes: Number(v.statistics.viewCount || 0),
        curtidas: Number(v.statistics.likeCount || 0),
        comentarios: Number(v.statistics.commentCount || 0),
      },
    }));
}
