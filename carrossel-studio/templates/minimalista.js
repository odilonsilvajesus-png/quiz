// Estilo "Minimalista de texto": fundo liso, sem enfeites. Capa em caixa alta extra pesada;
// slides internos com título curto em negrito e parágrafo com negrito só nos trechos fortes.
import { comDestaque, paragrafos, tamanho, cssBase } from "./_comum.js";

export const info = {
  nome: "Minimalista de texto",
  descricao: "Fundo liso e só texto. Capa em caixa alta bem pesada, slides com frase em negrito e reflexão. Não usa imagem.",
  imagens: "nenhuma",
  fontes: ["Montserrat"],
  formato_texto:
    "Capa (slide 1): titulo com uma frase curta e forte (vai em caixa alta), subtitulo vazio. Demais slides: titulo com 1 frase curta; subtitulo com 1 a 3 frases de reflexão, podendo separar em 2 parágrafos com linha em branco. O destaque aqui é NEGRITO, não cor: marque entre *asteriscos* só os trechos mais fortes.",
};

export function css(visual, fontesCss) {
  const p = visual.paleta;
  return `${cssBase(visual, fontesCss)}
.mini { background: ${p.clara}; color: ${p.texto_escuro}; font-family: "Montserrat", sans-serif; display: flex; flex-direction: column; justify-content: center; }
.mini .destaque { color: inherit; font-weight: 700; }
.mini.capa { padding: 120px 96px; }
.mini.capa h1 { font-weight: 900; text-transform: uppercase; line-height: 1.02; letter-spacing: -0.01em; }
.mini.capa p.sub { margin-top: 40px; font-size: 40px; font-weight: 500; }
.mini.interno { padding: 120px 200px 120px 190px; }
.mini.interno h1 { font-size: 48px; font-weight: 700; line-height: 1.15; margin-bottom: 40px; }
.mini.interno .texto p { font-size: 46px; font-weight: 400; line-height: 1.18; }
.mini.interno .texto p + p { margin-top: 40px; }
.mini .assinatura { position: absolute; bottom: 70px; left: 190px; font-size: 24px; font-weight: 600; letter-spacing: .1em; opacity: .5; }
`;
}

export function slide({ visual, s, i }) {
  if (i === 0) {
    const t = tamanho(s.titulo, [[20, 150], [35, 128], [55, 110]], 92);
    return `<section class="slide mini capa">
  <h1 style="font-size:${t}px">${comDestaque(s.titulo)}</h1>
  ${s.subtitulo ? `<p class="sub">${comDestaque(s.subtitulo)}</p>` : ""}
</section>`;
  }
  return `<section class="slide mini interno">
  <h1>${comDestaque(s.titulo)}</h1>
  <div class="texto">${paragrafos(s.subtitulo)}</div>
  ${visual.assinatura ? `<div class="assinatura">${comDestaque(visual.assinatura)}</div>` : ""}
</section>`;
}
