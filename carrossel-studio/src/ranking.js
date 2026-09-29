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

  // Perfis que repetem a mesma legenda em vários posts: fica só o de melhor desempenho,
  // a não ser que a análise mostre que o conteúdo real é diferente.
  const vistos = new Set();
  return ranqueados
    .sort((a, b) => b.ranking.outlier - a.ranking.outlier || b.ranking.interacoes - a.ranking.interacoes)
    .filter((p) => {
      // Enquanto o conteúdo real não foi analisado, posts com mídia contam como diferentes (mesma legenda,
      // reels diferentes). Depois da análise, a comparação usa a fala/texto dos slides.
      const conteudo = p.analise?.transcricao || p.analise?.slides || (p.midia ? p.id : p.texto) || "";
      // Compara o conteúdo inteiro: posts diferentes costumam começar igual (mesma abertura, mesma capa).
      const chave = `${p.perfil}|${conteudo.toLowerCase().replace(/\s+/g, " ").trim()}`;
      if (vistos.has(chave)) return false;
      vistos.add(chave);
      return true;
    })
    .slice(0, limite);
}
