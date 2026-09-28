// Ranqueia os posts pelo quanto performaram ACIMA do normal do próprio perfil.
// Comparar só curtidas favorece perfis grandes; o "outlier score" mede o que viralizou de verdade.

const mediana = (valores) => {
  const v = [...valores].sort((a, b) => a - b);
  if (!v.length) return 0;
  const meio = Math.floor(v.length / 2);
  return v.length % 2 ? v[meio] : (v[meio - 1] + v[meio]) / 2;
};

// Comentário pesa mais que curtida: exige mais esforço e indica conversa.
const interacoes = (m) => m.curtidas + 2 * m.comentarios;

export function ranquear(posts, { limite = 20 } = {}) {
  const porPerfil = new Map();
  for (const p of posts) {
    if (!porPerfil.has(p.perfil)) porPerfil.set(p.perfil, []);
    porPerfil.get(p.perfil).push(p);
  }

  const ranqueados = [];
  for (const lista of porPerfil.values()) {
    const base = mediana(lista.map((p) => interacoes(p.metricas))) || 1;
    const baseViews = mediana(lista.map((p) => p.metricas.visualizacoes).filter(Boolean)) || 0;

    for (const p of lista) {
      const inter = interacoes(p.metricas);
      const outlierInteracoes = inter / base;
      const outlierViews = baseViews && p.metricas.visualizacoes ? p.metricas.visualizacoes / baseViews : null;
      // Com só 1 post no perfil não há como comparar: fica neutro (1x).
      const outlier = lista.length > 1
        ? (outlierViews ? (outlierInteracoes + outlierViews) / 2 : outlierInteracoes)
        : 1;
      ranqueados.push({
        ...p,
        ranking: {
          interacoes: inter,
          outlier: Number(outlier.toFixed(2)),
          taxa_engajamento: p.seguidores ? Number(((inter / p.seguidores) * 100).toFixed(2)) : null,
          posts_no_perfil: lista.length,
        },
      });
    }
  }

  return ranqueados
    .sort((a, b) => b.ranking.outlier - a.ranking.outlier || b.ranking.interacoes - a.ranking.interacoes)
    .slice(0, limite);
}
