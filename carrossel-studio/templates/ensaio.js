// Estilo "Ensaio quadriculado": papel quadriculado alternando bege e escuro, capa em fonte condensada
// com palavra em bloco de cor, cabeçalho de revista e diagramas de etapas desenhados a partir do texto.
import { escapar, comDestaque, paragrafos, tamanho, rgba, cssBase } from "./_comum.js";

export const info = {
  nome: "Ensaio quadriculado",
  descricao: "Papel quadriculado bege e escuro, capa condensada com palavra em bloco de cor, cabeçalho de revista e diagramas de etapas.",
  imagens: "nenhuma",
  fontes: ["Anton", "Caveat", "Inter", "Dancing Script"],
  diagrama: true,
  formato_texto:
    "Capa: titulo provocativo e curto (vai em caixa alta, fonte condensada) com UMA palavra entre *asteriscos* (fica em um bloco de cor); subtitulo vazio ou algo como \"(parte 1)\". Demais slides: titulo é a frase de abertura; subtitulo tem 2 a 4 frases curtas, separadas por linha em branco. Se o título começar com \"Passo 1:\", \"Passo 2:\" etc., esse rótulo aparece manuscrito. Quando um slide ensinar uma sequência, preencha \"etapas\" com 3 a 5 rótulos curtos (vira um diagrama). Nos outros slides, deixe \"etapas\" vazio.",
};

const SETA_PAPEL =
  '<svg class="seta-papel" viewBox="0 0 200 110"><path d="M10 40 C 60 70, 110 70, 150 45 L 140 20 L 195 50 L 150 95 L 148 70 C 100 95, 45 90, 5 60 Z" fill="currentColor" stroke="#111" stroke-width="3"/></svg>';

export function css(visual, fontesCss) {
  const p = visual.paleta;
  const grade = (cor) =>
    `linear-gradient(${cor} 1.5px, transparent 1.5px) 0 0 / 38px 38px, linear-gradient(90deg, ${cor} 1.5px, transparent 1.5px) 0 0 / 38px 38px`;
  return `${cssBase(visual, fontesCss)}
.ensaio { font-family: "Inter", sans-serif; padding: 190px 96px 200px; display: flex; flex-direction: column; justify-content: center; }
.ensaio.bege { background: ${grade(rgba(p.texto_escuro, 0.06))}, ${p.clara}; color: ${p.texto_escuro}; --meta: ${rgba(p.texto_escuro, 0.55)}; }
.ensaio.escuro { background: ${grade(rgba(p.texto_claro, 0.05))}, ${p.escura}; color: ${p.texto_claro}; --meta: ${rgba(p.texto_claro, 0.55)}; }
.ensaio .meta { position: absolute; left: 96px; right: 96px; display: flex; justify-content: space-between;
  font-size: 24px; letter-spacing: .18em; text-transform: uppercase; color: var(--meta); font-weight: 500; }
.ensaio .meta.cima { top: 70px; }
.ensaio .meta.baixo { bottom: 110px; }
.ensaio .meta b { color: ${p.destaque}; font-weight: 500; }
.ensaio .progresso { position: absolute; left: 96px; right: 96px; bottom: 70px; height: 3px; background: var(--meta); opacity: .5; }
.ensaio .progresso i { display: block; height: 100%; background: currentColor; }
.ensaio h1 { font-size: 60px; font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; margin-bottom: 38px; }
.ensaio h1 .destaque, .ensaio .texto .destaque { color: ${p.destaque}; }
.ensaio .rotulo { font-family: "Caveat", cursive; font-weight: 700; font-size: 64px; color: ${p.destaque}; display: block; margin-bottom: 6px; letter-spacing: 0; }
.ensaio .texto p { font-size: 40px; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; }
.ensaio .texto p + p { margin-top: 30px; }
.ensaio .diagrama { margin-top: 56px; background: ${grade("rgba(0,0,0,.07)")}, #fff; color: #111; border-radius: 6px; padding: 60px 50px 50px;
  display: grid; position: relative; }
.ensaio .diagrama::before { content: ""; position: absolute; left: 80px; right: 80px; top: 88px; height: 4px; background: #111; }
.ensaio .diagrama .etapa { position: relative; text-align: center; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: .02em; }
.ensaio .diagrama .etapa span { display: block; font-size: 22px; font-weight: 700; margin-bottom: 12px; }
.ensaio .diagrama .etapa i { display: block; width: 26px; height: 26px; border-radius: 50%; background: #111; margin: 0 auto 22px; }
.ensaio .seta-papel { position: absolute; right: 110px; bottom: 170px; width: 200px; color: ${p.clara}; transform: rotate(-8deg); }
.ensaio.capa { padding: 140px 96px 200px; justify-content: center; }
.ensaio.capa h1 { font-family: "Anton", sans-serif; font-weight: 400; text-transform: uppercase; line-height: 1.02; letter-spacing: 0; margin: 0; }
.ensaio.capa h1 .destaque { color: ${p.clara}; padding: 0 .08em; box-decoration-break: clone; -webkit-box-decoration-break: clone;
  background: linear-gradient(transparent 12%, ${p.destaque} 12%, ${p.destaque} 97%, transparent 97%); }
.ensaio.capa .parte { font-family: "Caveat", cursive; font-size: 44px; font-weight: 700; margin-top: 36px; margin-left: 240px; }
.ensaio.capa .assinatura { position: absolute; left: 96px; bottom: 110px; font-family: "Dancing Script", cursive; font-size: 52px; font-weight: 700; }
`;
}

export function slide({ visual, s, i, total, fundo }) {
  const tom = fundo === visual.fundos.escuro ? "escuro" : "bege";
  const arroba = (visual.arroba || visual.assinatura || "").toUpperCase();
  const progresso = `<div class="progresso"><i style="width:${((i + 1) / total) * 100}%"></i></div>`;

  if (i === 0) {
    const t = tamanho(s.titulo, [[20, 190], [35, 160], [55, 132]], 110);
    return `<section class="slide ensaio capa ${tom}">
  <h1 style="font-size:${t}px">${comDestaque(s.titulo)}</h1>
  ${s.subtitulo ? `<div class="parte">${escapar(s.subtitulo)}</div>` : ""}
  <div class="assinatura">por ${escapar(visual.nome_exibicao || "")}</div>
  ${progresso}
</section>`;
  }

  const passo = s.titulo.match(/^(passo\s*\d+\s*:)\s*/i);
  const titulo = passo ? s.titulo.slice(passo[0].length) : s.titulo;
  const etapas = (s.etapas || []).filter(Boolean).slice(0, 5);
  const diagrama = etapas.length >= 2
    ? `<div class="diagrama" style="grid-template-columns:repeat(${etapas.length},1fr)">${etapas
      .map((e, k) => `<div class="etapa"><span>${k + 1}</span><i></i>${escapar(e)}</div>`).join("")}</div>`
    : "";
  return `<section class="slide ensaio ${tom}">
  <div class="meta cima"><span>${escapar(arroba)}</span><span>${String(i + 1).padStart(2, "0")}<b>/</b>${String(total).padStart(2, "0")}</span></div>
  <h1 style="${titulo.length > 70 ? "font-size:52px" : ""}">${passo ? `<span class="rotulo">${escapar(passo[1])}</span>` : ""}${comDestaque(titulo)}</h1>
  <div class="texto">${paragrafos(s.subtitulo)}</div>
  ${diagrama}
  ${!diagrama && i % 3 === 1 ? SETA_PAPEL : ""}
  <div class="meta baixo"><span>Ensaio</span><span>${escapar(visual.data || "")}</span></div>
  ${progresso}
</section>`;
}
