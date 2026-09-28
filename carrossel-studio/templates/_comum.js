// Peças compartilhadas pelos estilos de carrossel.

export const escapar = (t) =>
  String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// *palavra* vira destaque na cor do fundo atual.
export const comDestaque = (t) => escapar(t).replace(/\*([^*]+)\*/g, '<span class="destaque">$1</span>');

// Escolhe o tamanho da fonte pelo tamanho do texto: [[até N caracteres, px], ...], mínimo.
export function tamanho(texto, faixas, minimo) {
  const n = String(texto ?? "").replace(/\*/g, "").length;
  return (faixas.find(([limite]) => n <= limite) || [0, minimo])[1];
}

export const tituloGrande = (t) => tamanho(t, [[30, 96], [55, 84], [80, 74], [110, 64]], 56);
export const subtitulo = (t) => tamanho(t, [[90, 38], [160, 34]], 30);

const ICONE_SALVAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

export function vars(fundo) {
  return [
    `--fundo:${fundo.fundo}`,
    `--texto:${fundo.texto}`,
    `--subtexto:${fundo.subtexto}`,
    `--destaque:${fundo.destaque}`,
    `--pill-texto:${fundo.pill_texto || "#FFFFFF"}`,
  ].join(";");
}

// Logo (se houver) ou assinatura em texto.
export function marca(visual, classe = "topo") {
  if (visual.logo) return `<div class="${classe}"><img src="${visual.logo}" alt=""></div>`;
  if (visual.assinatura) return `<div class="${classe}">${escapar(visual.assinatura)}</div>`;
  return "";
}

// Barra inferior: página, pontinhos e "arraste" (ou o botão de salvar no último slide).
export function rodape({ visual, i, total }) {
  const rod = visual.rodape || {};
  const numero = `${String(i + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
  const direita = i === total - 1 && visual.cta_final
    ? `<div class="salvar">${ICONE_SALVAR}${escapar(visual.cta_final)}</div>`
    : `<div class="arraste">${escapar(rod.texto_arraste || "")}</div>`;
  const pontos = rod.pontos === false ? "" : Array.from({ length: total }, (_, k) => `<i class="${k === i ? "ativo" : ""}"></i>`).join("");
  return `<div class="rodape">
    <div class="pagina">${rod.paginacao === false ? "" : numero}</div>
    <div class="pontos">${pontos}</div>
    ${direita}
  </div>`;
}

export function cssBase(visual, fontesCss) {
  return `
${fontesCss}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #777; font-family: "${visual.fonte || "Poppins"}", system-ui, sans-serif; }
.slide { position: relative; width: ${visual.largura}px; height: ${visual.altura}px; overflow: hidden; margin: 0 auto 40px;
  background: var(--fundo); color: var(--texto); }
.destaque { color: var(--destaque); }
.topo img { height: 56px; display: block; }
.rodape { position: absolute; left: 96px; right: 96px; bottom: 76px; z-index: 2;
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
