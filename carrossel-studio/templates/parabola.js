// Estilo "Parábola ilustrada": história contada slide a slide sobre imagens que continuam a cena,
// sempre com a mesma personagem. Capa com título serifado e enfeites dourados.
import { escapar, comDestaque, paragrafos, tamanho, rgba, cssBase } from "./_comum.js";

export const info = {
  nome: "Parábola ilustrada",
  descricao: "História contada slide a slide sobre imagens que continuam a cena, com a mesma personagem. Capa com título serifado.",
  imagens: "todas",
  fontes: ["Playfair Display", "Dancing Script"],
  direcao_imagem:
    "Fotografia cinematográfica realista, luz dourada e suave, com a MESMA personagem em todos os slides (pessoa, animal ou objeto que protagoniza a história), no mesmo cenário. Cada imagem mostra o momento exato daquele trecho da história, com expressão e gesto claros. Deixe a parte de cima e a esquerda da imagem com fundo limpo (céu, parede, fundo desfocado) para receber o texto.",
  formato_texto:
    "Conte uma história (parábola) com começo, conflito, virada e lição, frase a frase, criando suspense entre os slides. Capa: titulo curto e intrigante (vai em caixa alta), subtitulo vazio. Demais slides: titulo e subtitulo são dois trechos da história, em linhas curtas (use \\n para quebrar linha). Marque palavras em negrito com *asteriscos*. Falas de personagens ficam em um parágrafo próprio, entre aspas “ ”. A frase de virada de um slide pode ficar como parágrafo inteiro entre asteriscos (vira uma faixa escura). No máximo 30 palavras por slide.",
};

const ENFEITE = (cor) =>
  `<svg class="enfeite" viewBox="0 0 600 40"><line x1="20" y1="20" x2="270" y2="20" stroke="${cor}" stroke-width="2"/><line x1="330" y1="20" x2="580" y2="20" stroke="${cor}" stroke-width="2"/><path d="M300 4 L304 16 L316 20 L304 24 L300 36 L296 24 L284 20 L296 16 Z" fill="${cor}"/></svg>`;

export function css(visual, fontesCss) {
  const p = visual.paleta;
  const tinta = p.texto_escuro;
  return `${cssBase(visual, fontesCss)}
.parabola { background: ${p.clara}; color: ${tinta}; }
.parabola .foto { position: absolute; inset: 0; background-size: cover; background-position: center; }
.parabola .veu { position: absolute; inset: 0;
  background: linear-gradient(160deg, ${rgba(p.clara, 0.78)} 0%, ${rgba(p.clara, 0.45)} 32%, ${rgba(p.clara, 0)} 58%); }
.parabola .arroba { position: absolute; left: 0; right: 0; bottom: 56px; text-align: center; z-index: 2;
  font-family: "Dancing Script", cursive; font-size: 34px; color: ${tinta}; opacity: .75; }
.parabola.capa { display: flex; flex-direction: column; align-items: center; padding: 90px 80px 0; text-align: center; }
.parabola.capa .veu { background: linear-gradient(180deg, ${rgba(p.clara, 0.85)} 0%, ${rgba(p.clara, 0.55)} 38%, ${rgba(p.clara, 0)} 60%); }
.parabola.capa .topo-arroba { position: relative; z-index: 2; font-family: "Dancing Script", cursive; font-size: 40px; margin-bottom: 18px; }
.parabola .enfeite { position: relative; z-index: 2; width: 560px; height: 40px; }
.parabola.capa h1 { position: relative; z-index: 2; font-family: "Playfair Display", serif; font-weight: 800; text-transform: uppercase;
  line-height: 1.02; letter-spacing: -0.01em; margin: 18px 0; color: ${tinta}; }
.parabola.interno { padding: 110px 96px 180px; }
.parabola .texto { position: relative; z-index: 2; max-width: 560px; }
.parabola .texto p { font-size: 44px; font-weight: 500; line-height: 1.22; }
.parabola .texto p + p { margin-top: 30px; }
.parabola .texto .destaque { color: inherit; font-weight: 700; }
.parabola .texto p.fala { display: inline-block; font-weight: 700; font-size: 50px; line-height: 1.12; padding: 18px 26px;
  background: ${rgba(p.clara, 0.92)}; box-shadow: 0 8px 20px rgba(0,0,0,.08); transform: rotate(-1deg); }
.parabola .texto p.virada { display: inline-block; background: ${p.escura}; color: ${p.texto_claro}; font-weight: 700;
  padding: 10px 22px; border-radius: 10px 30px 12px 26px; }
.parabola .divisor { width: 90px; height: 4px; background: ${p.destaque}; margin: 30px 0; border-radius: 4px; }
`;
}

export function slide({ visual, s, i, foto }) {
  const arroba = visual.arroba || visual.assinatura || "";
  const imagem = foto ? `<div class="foto" style="background-image:url('${foto}')"></div>` : "";
  if (i === 0) {
    const t = tamanho(s.titulo, [[20, 124], [35, 108], [55, 94]], 80);
    return `<section class="slide parabola capa">
  ${imagem}<div class="veu"></div>
  ${arroba ? `<div class="topo-arroba">${escapar(arroba)}</div>` : ""}
  ${ENFEITE(visual.paleta.destaque)}
  <h1 style="font-size:${t}px">${comDestaque(s.titulo)}</h1>
  ${ENFEITE(visual.paleta.destaque)}
</section>`;
  }
  return `<section class="slide parabola interno">
  ${imagem}<div class="veu"></div>
  <div class="texto">
    ${paragrafos(s.titulo)}
    ${s.subtitulo ? `<div class="divisor"></div>${paragrafos(s.subtitulo)}` : ""}
  </div>
  ${arroba ? `<div class="arroba">${escapar(arroba)}</div>` : ""}
</section>`;
}
