// Estilo "Editorial": número grande do slide, texto alinhado à esquerda, visual de revista.
import { escapar, comDestaque, tamanho, subtitulo, vars, marca, rodape, cssBase } from "./_comum.js";

export const info = { imagens: "capa", nome: "Editorial", descricao: "Número grande, texto à esquerda e linhas finas. Com imagem, ela fica em um quadro no topo." };

export function css(visual, fontesCss) {
  return `${cssBase(visual, fontesCss)}
.editorial { display: flex; flex-direction: column; justify-content: center; padding: 120px 96px 200px; }
.editorial .topo { position: absolute; top: 72px; right: 96px; font-weight: 600; font-size: 24px; letter-spacing: .12em; color: var(--subtexto); }
.editorial .num { font-size: 150px; font-weight: 800; line-height: .9; color: var(--destaque); letter-spacing: -0.04em; }
.editorial .linha { height: 3px; background: var(--texto); opacity: .15; margin: 36px 0 44px; }
.editorial h1 { font-weight: ${visual.peso_titulo || 700}; line-height: 1.1; letter-spacing: -0.025em; }
.editorial p.sub { margin-top: 36px; font-weight: 500; line-height: 1.45; color: var(--subtexto); max-width: 860px; }
.editorial .quadro { height: 520px; border-radius: 28px; background-size: cover; background-position: center; margin-bottom: 48px; flex: none; }
.editorial.com-foto { justify-content: flex-start; padding-top: 150px; }
.editorial.com-foto .num { font-size: 96px; }
.editorial.com-foto .linha { margin: 24px 0 28px; }
`;
}

export function slide({ visual, s, i, total, fundo, foto }) {
  const t = tamanho(s.titulo, foto ? [[40, 76], [80, 64]] : [[30, 92], [55, 80], [80, 70], [110, 62]], foto ? 56 : 54);
  return `<section class="slide editorial ${foto ? "com-foto" : ""}" style="${vars(fundo)}">
  ${marca(visual)}
  ${foto ? `<div class="quadro" style="background-image:url('${foto}')"></div>` : ""}
  <div class="num">${String(i + 1).padStart(2, "0")}</div>
  <div class="linha"></div>
  <h1 style="font-size:${t}px">${comDestaque(s.titulo)}</h1>
  ${s.subtitulo ? `<p class="sub" style="font-size:${foto ? 32 : subtitulo(s.subtitulo)}px">${escapar(s.subtitulo)}</p>` : ""}
  ${rodape({ visual, i, total })}
</section>`;
}
