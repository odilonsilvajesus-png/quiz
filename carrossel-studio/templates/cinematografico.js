// Estilo "Cinematográfico": imagem ocupando o slide inteiro, texto grande embaixo sobre degradê.
import { escapar, comDestaque, tamanho, vars, marca, rodape, cssBase } from "./_comum.js";

export const info = { imagens: "todas", nome: "Cinematográfico", descricao: "Imagem no slide inteiro com texto embaixo. Pede imagens com IA (sem imagem, usa a cor do fundo)." };

export function css(visual, fontesCss) {
  return `${cssBase(visual, fontesCss)}
.cine { display: flex; flex-direction: column; justify-content: flex-end; padding: 120px 96px 210px; }
.cine .foto { position: absolute; inset: 0; background-size: cover; background-position: center; }
.cine .foto::after { content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.05) 30%, rgba(0,0,0,.6) 58%, rgba(0,0,0,.9) 100%); }
.cine .conteudo { position: relative; z-index: 1; }
.cine .topo { position: absolute; top: 72px; left: 96px; z-index: 1; font-weight: 600; font-size: 24px; letter-spacing: .12em; color: var(--subtexto); }
.cine .tag { display: inline-block; width: 70px; height: 7px; border-radius: 99px; background: var(--destaque); margin-bottom: 36px; }
.cine h1 { font-weight: ${Math.max(visual.peso_titulo || 700, 700)}; line-height: 1.06; letter-spacing: -0.03em; }
.cine p.sub { margin-top: 30px; font-weight: 500; line-height: 1.4; color: var(--subtexto); max-width: 860px; }
.cine.sem-foto { background-image: radial-gradient(circle at 80% 10%, rgba(255,255,255,.08), transparent 55%), none; }
`;
}

export function slide({ visual, s, i, total, fundo, foto }) {
  const cores = foto ? visual.fundos.escuro : fundo;
  return `<section class="slide cine ${foto ? "" : "sem-foto"}" style="${vars(cores)}">
  ${foto ? `<div class="foto" style="background-image:url('${foto}')"></div>` : ""}
  ${marca(visual)}
  <div class="conteudo">
    <span class="tag"></span>
    <h1 style="font-size:${tamanho(s.titulo, [[30, 100], [55, 86], [80, 74], [110, 64]], 56)}px">${comDestaque(s.titulo)}</h1>
    ${s.subtitulo ? `<p class="sub" style="font-size:${tamanho(s.subtitulo, [[90, 36], [160, 32]], 28)}px">${escapar(s.subtitulo)}</p>` : ""}
  </div>
  ${rodape({ visual, i, total })}
</section>`;
}
