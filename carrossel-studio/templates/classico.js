// Estilo "Clássico": título central com palavra em destaque, divisor curto, subtítulo e barra de navegação.
import { escapar, comDestaque, tituloGrande, subtitulo, vars, marca, rodape, cssBase } from "./_comum.js";

export const info = { nome: "Clássico", descricao: "Texto centralizado, divisor e palavra em destaque. Com imagem, ela vira fundo escurecido." };

export function css(visual, fontesCss) {
  return `${cssBase(visual, fontesCss)}
.classico { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 150px 96px 190px; text-align: center; }
.classico .foto { position: absolute; inset: 0; background-size: cover; background-position: center; }
.classico .foto::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.78)); }
.classico .conteudo { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
.classico .divisor { width: 84px; height: 7px; border-radius: 99px; background: var(--destaque); margin-bottom: 56px; }
.classico h1 { font-weight: ${visual.peso_titulo || 700}; line-height: 1.12; letter-spacing: -0.02em; max-width: 900px; }
.classico p.sub { margin-top: 44px; font-weight: 500; line-height: 1.42; color: var(--subtexto); max-width: 840px; }
.classico .topo { position: absolute; top: 64px; left: 0; right: 0; display: flex; justify-content: center; z-index: 1;
  font-weight: 600; font-size: 24px; letter-spacing: .14em; color: var(--subtexto); }
`;
}

export function slide({ visual, s, i, total, fundo, foto }) {
  // Sobre foto o texto precisa ser claro: usa as cores do fundo escuro.
  const cores = foto ? visual.fundos.escuro : fundo;
  return `<section class="slide classico" style="${vars(cores)}">
  ${foto ? `<div class="foto" style="background-image:url('${foto}')"></div>` : ""}
  ${marca(visual)}
  <div class="conteudo">
    <div class="divisor"></div>
    <h1 style="font-size:${tituloGrande(s.titulo)}px">${comDestaque(s.titulo)}</h1>
    ${s.subtitulo ? `<p class="sub" style="font-size:${subtitulo(s.subtitulo)}px">${escapar(s.subtitulo)}</p>` : ""}
  </div>
  ${rodape({ visual, i, total })}
</section>`;
}
