// Estilo "Dividido": imagem na metade de cima e texto na metade de baixo.
import { escapar, comDestaque, tamanho, subtitulo, vars, marca, rodape, cssBase } from "./_comum.js";

export const info = { imagens: "todas", nome: "Dividido", descricao: "Imagem em cima, texto embaixo. Sem imagem, o texto ocupa o slide todo." };

export function css(visual, fontesCss) {
  return `${cssBase(visual, fontesCss)}
.dividido { display: flex; flex-direction: column; }
.dividido .imagem { height: 640px; flex: none; background-size: cover; background-position: center; position: relative; }
.dividido .imagem::after { content: ""; position: absolute; left: 96px; bottom: -4px; width: 120px; height: 8px; border-radius: 99px; background: var(--destaque); }
.dividido .texto { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px 96px 190px; }
.dividido.sem-foto .texto { padding-top: 150px; }
.dividido .topo { position: absolute; top: 64px; left: 96px; z-index: 1; font-weight: 600; font-size: 24px; letter-spacing: .12em; color: var(--subtexto); }
.dividido.com-foto .topo { color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,.5); }
.dividido .barra { width: 84px; height: 7px; border-radius: 99px; background: var(--destaque); margin-bottom: 40px; }
.dividido h1 { font-weight: ${visual.peso_titulo || 700}; line-height: 1.12; letter-spacing: -0.02em; }
.dividido p.sub { margin-top: 28px; font-weight: 500; line-height: 1.42; color: var(--subtexto); }
`;
}

export function slide({ visual, s, i, total, fundo, foto }) {
  const t = foto ? tamanho(s.titulo, [[40, 74], [80, 64]], 56) : tamanho(s.titulo, [[30, 94], [55, 82], [80, 72], [110, 62]], 54);
  const st = foto ? tamanho(s.subtitulo, [[100, 34]], 30) : subtitulo(s.subtitulo);
  return `<section class="slide dividido ${foto ? "com-foto" : "sem-foto"}" style="${vars(fundo)}">
  ${foto ? `<div class="imagem" style="background-image:url('${foto}')"></div>` : ""}
  ${marca(visual)}
  <div class="texto">
    ${foto ? "" : '<div class="barra"></div>'}
    <h1 style="font-size:${t}px">${comDestaque(s.titulo)}</h1>
    ${s.subtitulo ? `<p class="sub" style="font-size:${st}px">${escapar(s.subtitulo)}</p>` : ""}
  </div>
  ${rodape({ visual, i, total })}
</section>`;
}
