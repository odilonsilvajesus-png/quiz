// Estilo "Papelaria editorial": mesa clara com objetos do tema nas bordas, título pesado com palavra
// em caixa de destaque, rabiscos à mão, selo com a marca e botão redondo de seta.
import { escapar, comDestaque, tamanho, rgba, cssBase } from "./_comum.js";

export const info = {
  nome: "Papelaria editorial",
  descricao: "Mesa clara com objetos do tema nos cantos, título pesado com palavra em destaque, rabiscos à mão e selo da marca.",
  imagens: "todas",
  fontes: ["Caveat"],
  direcao_imagem:
    "Fundo de mesa clara em tons creme, foto real vista de cima ou levemente inclinada, com 2 a 4 objetos do dia a dia ligados ao tema daquele slide (ex.: planner, calendário, post-it, caderno, relógio, xícara) posicionados só nas bordas e cantos, levemente desfocados. O centro da imagem fica vazio e claro para o texto. Sem pessoas, sem mãos.",
  formato_texto:
    "titulo: frase curta de impacto (2 a 6 palavras) com UMA palavra-chave entre *asteriscos* (ela ganha uma caixa de destaque). subtitulo: continuação em 1 ou 2 frases curtas, com o trecho mais forte entre *asteriscos* (fica em negrito).",
};

const RISCOS =
  '<svg class="riscos" viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M14 58 L44 66"/><path d="M34 30 L54 50"/><path d="M68 10 L70 40"/></svg>';
const CURVAS =
  '<svg class="curvas" viewBox="0 0 1080 1350" fill="none" stroke="currentColor" stroke-width="3"><path d="M-40 260 C 120 120, 200 40, 260 -40"/><path d="M1120 1000 C 900 1040, 800 1180, 820 1400"/></svg>';
const SETA =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function css(visual, fontesCss) {
  const p = visual.paleta;
  return `${cssBase(visual, fontesCss)}
.papel { --tinta: ${p.destaque2}; --caixa: ${rgba(p.destaque, 0.22)};
  background: ${p.clara} radial-gradient(circle at 20% 15%, rgba(255,255,255,.7), transparent 45%); color: var(--tinta);
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 150px 110px 200px; }
.papel .foto { position: absolute; inset: 0; background-size: cover; background-position: center; }
.papel .foto::after { content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse 62% 42% at 50% 48%, ${rgba(p.clara, 0.88)} 0%, ${rgba(p.clara, 0.55)} 55%, ${rgba(p.clara, 0.1)} 100%); }
.papel .curvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .45; color: var(--tinta); }
.papel .bloco { position: relative; z-index: 1; }
.papel .riscos { position: absolute; width: 110px; left: -70px; top: -70px; color: var(--tinta); }
.papel h1 { font-weight: 800; line-height: 1.02; letter-spacing: -0.03em; }
.papel h1 .destaque { color: inherit; padding: 0 .12em; box-decoration-break: clone; -webkit-box-decoration-break: clone;
  background: linear-gradient(transparent 16%, var(--caixa) 16%, var(--caixa) 94%, transparent 94%); }
.papel p.sub { margin-top: 26px; font-weight: 500; line-height: 1.12; letter-spacing: -0.015em; }
.papel p.sub .destaque { color: inherit; font-weight: 800; }
.papel .bloco { max-width: 860px; }
.papel .selo { position: absolute; left: 80px; bottom: 76px; z-index: 2; width: 128px; height: 128px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff, #d9d9d9 45%, #9e9e9e 80%, #cfcfcf);
  box-shadow: 0 10px 24px rgba(0,0,0,.25), inset 0 0 0 6px rgba(255,255,255,.6);
  display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #555; letter-spacing: .12em; transform: rotate(-8deg); }
.papel .selo img { width: 70%; height: 70%; object-fit: contain; border-radius: 50%; }
.papel .pessoa { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); height: 62%; z-index: 1; }
.papel.capa-pessoa .bloco { z-index: 2; }
.papel.capa-pessoa { justify-content: flex-start; padding-top: 110px; }
.papel .pontos-papel { position: absolute; bottom: 60px; left: 0; right: 0; display: flex; justify-content: center; gap: 12px; z-index: 2; }
.papel .pontos-papel i { width: 11px; height: 11px; border-radius: 50%; background: var(--tinta); opacity: .25; }
.papel .pontos-papel i.ativo { opacity: .9; }
.papel .botao { position: absolute; right: 80px; bottom: 90px; z-index: 2; width: 92px; height: 92px; border-radius: 50%;
  border: 3px solid var(--tinta); display: flex; align-items: center; justify-content: center; color: var(--tinta); }
.papel .botao svg { width: 48px; height: 48px; }
.papel .cta { position: absolute; right: 80px; bottom: 90px; z-index: 2; padding: 22px 36px; border-radius: 99px; background: var(--tinta);
  color: ${p.clara}; font-size: 26px; font-weight: 700; letter-spacing: .06em; }
`;
}

export function slide({ visual, s, i, total, foto }) {
  const capaPessoa = i === 0 && visual.foto_pessoa;
  const t = tamanho(s.titulo, capaPessoa ? [[25, 104], [45, 90]] : [[18, 132], [32, 116], [55, 98]], 84);
  const st = tamanho(s.subtitulo, [[50, 76], [90, 64], [140, 54]], 46);
  const iniciais = (visual.nome_exibicao || "").split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase();
  const pontos = Array.from({ length: total }, (_, k) => `<i class="${k === i ? "ativo" : ""}"></i>`).join("");
  return `<section class="slide papel ${capaPessoa ? "capa-pessoa" : ""}">
  ${foto ? `<div class="foto" style="background-image:url('${foto}')"></div>` : ""}
  ${CURVAS}
  <div class="selo">${visual.logo ? `<img src="${visual.logo}" alt="">` : escapar(iniciais)}</div>
  <div class="bloco">
    ${RISCOS}
    <h1 style="font-size:${t}px">${comDestaque(s.titulo)}</h1>
    ${s.subtitulo && !capaPessoa ? `<p class="sub" style="font-size:${st}px">${comDestaque(s.subtitulo)}</p>` : ""}
  </div>
  ${capaPessoa ? `<img class="pessoa" src="${visual.foto_pessoa}" alt="">` : ""}
  <div class="pontos-papel">${pontos}</div>
  ${i === total - 1 && visual.cta_final ? `<div class="cta">${escapar(visual.cta_final)}</div>` : `<div class="botao">${SETA}</div>`}
</section>`;
}
