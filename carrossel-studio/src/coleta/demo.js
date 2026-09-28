// Dados fictícios para o modo demonstração (sem chaves de API ou sem referências cadastradas).
// Perfis e números são inventados, só para mostrar o fluxo funcionando.
const dias = (n) => new Date(Date.now() - n * 86400000).toISOString();

const post = (id, plataforma, perfil, seguidores, texto, tipo, idade, curtidas, comentarios, visualizacoes = 0) => ({
  id: `demo:${id}`,
  plataforma,
  perfil,
  seguidores,
  url: "",
  titulo: texto.split("\n")[0].slice(0, 120),
  texto,
  tipo,
  publicado_em: dias(idade),
  thumbnail: "",
  metricas: { curtidas, comentarios, visualizacoes },
  demo: true,
});

export function dadosDemo() {
  return [
    post(1, "instagram", "@demo_psicologa_a", 48000,
      "Você não come à noite por fome. Você come porque é o primeiro momento do dia em que ninguém precisa de você.\nO silêncio da casa vira permissão.",
      "carrossel", 12, 9400, 612),
    post(2, "instagram", "@demo_psicologa_a", 48000,
      "5 alimentos que ajudam a controlar a ansiedade.",
      "carrossel", 20, 1100, 38),
    post(3, "instagram", "@demo_psicologa_a", 48000,
      "Quem nunca prometeu 'segunda eu começo'? A culpa de domingo é o combustível da compulsão de sábado.",
      "reels", 33, 2300, 140, 61000),
    post(4, "instagram", "@demo_nutri_comportamental", 125000,
      "Se na sua casa ninguém dizia 'eu te amo', é bem provável que dissessem 'come mais um pouquinho'.\nComida virou a língua do afeto.",
      "carrossel", 8, 21800, 1930),
    post(5, "instagram", "@demo_nutri_comportamental", 125000,
      "Meu café da manhã de hoje.",
      "imagem", 15, 2600, 45),
    post(6, "instagram", "@demo_nutri_comportamental", 125000,
      "Você não precisa de disciplina. Você precisa parar de se punir.",
      "reels", 41, 5200, 210, 140000),
    post(7, "youtube", "@DemoCanalMenteECorpo", 310000,
      "Por que você sabota a dieta justamente quando está dando certo\n\nNeste vídeo falo sobre o medo inconsciente de mudar de identidade e por que o cérebro trata o emagrecimento como ameaça.",
      "video", 18, 14200, 1320, 402000),
    post(8, "youtube", "@DemoCanalMenteECorpo", 310000,
      "Rotina de treinos em casa para iniciantes",
      "video", 25, 1900, 88, 51000),
    post(9, "youtube", "@DemoCanalMenteECorpo", 310000,
      "Comer escondido: o que está por trás da vergonha\n\nA vergonha de comer na frente dos outros nasce muito antes da comida. Falo de julgamento na infância e do corpo como alvo de comentários da família.",
      "video", 52, 9800, 870, 233000),
  ];
}
