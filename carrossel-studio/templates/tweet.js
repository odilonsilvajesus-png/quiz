// Estilo "Tweet": parece um print de post do X/Twitter, com foto de perfil, nome e @.
import { escapar, comDestaque, tamanho, vars, rodape, cssBase } from "./_comum.js";

export const info = { nome: "Tweet", descricao: "Parece um print de post, com foto de perfil, nome e @. Muito usado para opinião e bastidores." };

const VERIFICADO =
  '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M22.5 12.5c0-1.58-.88-2.95-2.16-3.6.15-.44.23-.91.23-1.4 0-2.21-1.71-4-3.82-4-.47 0-.92.09-1.34.25C14.8 2.49 13.5 1.5 12 1.5s-2.8.99-3.41 2.25c-.42-.16-.87-.25-1.34-.25-2.11 0-3.82 1.79-3.82 4 0 .49.08.96.23 1.4-1.28.65-2.16 2.02-2.16 3.6 0 1.5.8 2.8 1.97 3.49-.03.2-.05.4-.05.61 0 2.21 1.71 4 3.82 4 .47 0 .92-.09 1.34-.25.61 1.26 1.91 2.25 3.41 2.25s2.8-.99 3.41-2.25c.42.16.87.25 1.34.25 2.11 0 3.82-1.79 3.82-4 0-.21-.02-.41-.05-.61 1.17-.69 1.97-1.99 1.97-3.49z"/><path fill="#fff" d="M10.5 16.2l-3.7-3.7 1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4z"/></svg>';

export function css(visual, fontesCss) {
  return `${cssBase(visual, fontesCss)}
.tweet { display: flex; flex-direction: column; justify-content: center; padding: 110px 96px 200px; }
.tweet .perfil { display: flex; align-items: center; gap: 26px; margin-bottom: 44px; }
.tweet .avatar { width: 112px; height: 112px; border-radius: 50%; flex: none; background: var(--destaque) center/cover; color: var(--pill-texto);
  display: flex; align-items: center; justify-content: center; font-size: 44px; font-weight: 700; }
.tweet .nome { font-size: 40px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
.tweet .nome svg { width: 38px; height: 38px; color: var(--destaque); }
.tweet .arroba { font-size: 32px; color: var(--subtexto); margin-top: 4px; }
.tweet h1 { font-weight: 600; line-height: 1.3; letter-spacing: -0.01em; }
.tweet p.sub { margin-top: 32px; font-weight: 400; line-height: 1.4; }
.tweet .imagem { margin-top: 40px; border-radius: 28px; height: 440px; background-size: cover; background-position: center; border: 2px solid rgba(127,127,127,.2); }
`;
}

export function slide({ visual, s, i, total, fundo, foto }) {
  const nome = visual.nome_exibicao || "";
  const arroba = visual.arroba || visual.assinatura || "";
  const iniciais = nome.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const t = tamanho(s.titulo, foto ? [[60, 60], [110, 54]] : [[60, 76], [110, 66], [160, 58]], foto ? 48 : 52);
  const st = tamanho(s.subtitulo, foto ? [[120, 38]] : [[120, 46], [200, 42]], foto ? 34 : 38);
  return `<section class="slide tweet" style="${vars(fundo)}">
  <div class="perfil">
    <div class="avatar" ${visual.logo ? `style="background-image:url('${visual.logo}')"` : ""}>${visual.logo ? "" : escapar(iniciais)}</div>
    <div><div class="nome">${escapar(nome)}${VERIFICADO}</div><div class="arroba">${escapar(arroba)}</div></div>
  </div>
  <h1 style="font-size:${t}px">${comDestaque(s.titulo)}</h1>
  ${s.subtitulo ? `<p class="sub" style="font-size:${st}px">${escapar(s.subtitulo)}</p>` : ""}
  ${foto ? `<div class="imagem" style="background-image:url('${foto}')"></div>` : ""}
  ${rodape({ visual, i, total })}
</section>`;
}
