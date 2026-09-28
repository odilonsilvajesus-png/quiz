// Template "clássico": título central com palavra em destaque, divisor, subtítulo e barra de navegação.
// Cores, fontes, fundos e textos vêm do cliente.json, então o mesmo template atende qualquer cliente.

const escapar = (t) =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// *palavra* vira destaque na cor do fundo atual.
const comDestaque = (t) => escapar(t).replace(/\*([^*]+)\*/g, '<span class="destaque">$1</span>');

function tamanhoTitulo(texto) {
  const n = texto.replace(/\*/g, "").length;
  if (n <= 30) return 96;
  if (n <= 55) return 84;
  if (n <= 80) return 74;
  if (n <= 110) return 64;
  return 56;
}

function tamanhoSubtitulo(texto) {
  const n = texto.length;
  if (n <= 90) return 38;
  if (n <= 160) return 34;
  return 30;
}

const ICONE_SALVAR =
  '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

export function css(visual, fontesCss) {
  const f = visual.fonte || "Poppins";
  return `
${fontesCss}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #777; font-family: "${f}", system-ui, sans-serif; }
.slide {
  position: relative; width: ${visual.largura}px; height: ${visual.altura}px; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 150px 96px 190px; text-align: center; margin: 0 auto 40px;
  background: var(--fundo); color: var(--texto);
}
.slide .foto { position: absolute; inset: 0; background-size: cover; background-position: center; }
.slide .foto::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.78)); }
.conteudo { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
.divisor { width: 84px; height: 7px; border-radius: 99px; background: var(--destaque); margin-bottom: 56px; }
h1 { font-weight: ${visual.peso_titulo || 700}; line-height: 1.12; letter-spacing: -0.02em; max-width: 900px; }
h1 .destaque { color: var(--destaque); }
p.sub { margin-top: 44px; font-weight: 500; line-height: 1.42; color: var(--subtexto); max-width: 840px; }
.topo { position: absolute; top: 64px; left: 0; right: 0; display: flex; justify-content: center; z-index: 1;
  font-weight: 600; font-size: 24px; letter-spacing: .14em; color: var(--subtexto); }
.topo img { height: 56px; }
.rodape { position: absolute; left: 96px; right: 96px; bottom: 76px; z-index: 1;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; font-weight: 600; }
.pagina { font-size: 28px; letter-spacing: .08em; color: var(--subtexto); justify-self: start; }
.pontos { display: flex; gap: 14px; }
.pontos i { width: 13px; height: 13px; border-radius: 50%; background: var(--texto); opacity: .28; }
.pontos i.ativo { background: var(--destaque); opacity: 1; }
.arraste { justify-self: end; font-size: 26px; letter-spacing: .14em; color: var(--subtexto); }
.salvar { justify-self: end; display: flex; align-items: center; gap: 10px; padding: 18px 28px; border-radius: 99px; white-space: nowrap;
  background: var(--destaque); color: var(--pill-texto); font-size: 22px; letter-spacing: .06em; }
.salvar svg { width: 26px; height: 26px; flex: none; }
`;
}

export function slide({ visual, s, i, total, fundo, foto }) {
  const vars = [
    `--fundo:${fundo.fundo}`,
    `--texto:${fundo.texto}`,
    `--subtexto:${fundo.subtexto}`,
    `--destaque:${fundo.destaque}`,
    `--pill-texto:${fundo.pill_texto || (fundo.destaque === "#1A1A1A" ? "#FFF8F0" : "#FFFFFF")}`,
  ].join(";");
  const ultimo = i === total - 1;
  const rod = visual.rodape || {};
  const numero = `${String(i + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  const topo = visual.logo
    ? `<div class="topo"><img src="${visual.logo}" alt=""></div>`
    : visual.assinatura
      ? `<div class="topo">${escapar(visual.assinatura)}</div>`
      : "";

  const direita = ultimo && visual.cta_final
    ? `<div class="salvar">${ICONE_SALVAR}${escapar(visual.cta_final)}</div>`
    : `<div class="arraste">${escapar(rod.texto_arraste || "")}</div>`;

  return `<section class="slide" data-i="${i}" style="${vars}">
  ${foto ? `<div class="foto" style="background-image:url('${foto}')"></div>` : ""}
  ${topo}
  <div class="conteudo">
    <div class="divisor"></div>
    <h1 style="font-size:${tamanhoTitulo(s.titulo)}px">${comDestaque(s.titulo)}</h1>
    ${s.subtitulo ? `<p class="sub" style="font-size:${tamanhoSubtitulo(s.subtitulo)}px">${escapar(s.subtitulo)}</p>` : ""}
  </div>
  <div class="rodape">
    <div class="pagina">${rod.paginacao === false ? "" : numero}</div>
    <div class="pontos">${rod.pontos === false ? "" : Array.from({ length: total }, (_, k) => `<i class="${k === i ? "ativo" : ""}"></i>`).join("")}</div>
    ${direita}
  </div>
</section>`;
}
