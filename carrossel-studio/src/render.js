// Monta o HTML do carrossel com a identidade do cliente e tira um PNG de cada slide.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { chromium } from "playwright-core";
import { RAIZ } from "./cliente.js";

const require = createRequire(import.meta.url);

// Fontes ficam embutidas no HTML para o render funcionar offline e o preview abrir em qualquer lugar.
function fontesCss(fonte, pesos = [400, 500, 600, 700, 800, 900]) {
  const slug = fonte.toLowerCase().replace(/\s+/g, "-");
  let pasta;
  try {
    pasta = path.join(path.dirname(require.resolve(`@fontsource/${slug}/package.json`)), "files");
  } catch {
    console.warn(`Aviso: fonte "${fonte}" não instalada. Rode: npm install @fontsource/${slug}`);
    return "";
  }
  return pesos
    .map((peso) => {
      const arq = path.join(pasta, `${slug}-latin-${peso}-normal.woff2`);
      if (!fs.existsSync(arq)) return "";
      const dados = fs.readFileSync(arq).toString("base64");
      return `@font-face{font-family:"${fonte}";font-weight:${peso};src:url(data:font/woff2;base64,${dados}) format("woff2");}`;
    })
    .join("\n");
}

// Imagens viram data URI para o HTML funcionar sozinho (render e prévia). Caminhos relativos
// procuram primeiro na pasta do carrossel (imagens geradas) e depois na pasta do cliente (logo, capa).
function comoDataUri(arquivo, ...pastas) {
  if (!arquivo) return null;
  if (/^(https?:|data:)/.test(arquivo)) return arquivo;
  const p = pastas.filter(Boolean).map((d) => path.join(d, arquivo)).find((c) => fs.existsSync(c));
  if (!p) return null;
  const ext = path.extname(p).slice(1).replace("jpg", "jpeg").replace("svg", "svg+xml");
  return `data:image/${ext};base64,${fs.readFileSync(p).toString("base64")}`;
}

const PASTA_TEMPLATES = path.join(RAIZ, "templates");

export async function listarEstilos() {
  const arquivos = fs.readdirSync(PASTA_TEMPLATES).filter((f) => f.endsWith(".js") && !f.startsWith("_"));
  const estilos = await Promise.all(
    arquivos.map(async (f) => {
      const t = await import(path.join(PASTA_TEMPLATES, f));
      return { id: path.basename(f, ".js"), ...t.info };
    }),
  );
  const ordem = ["classico", "editorial", "tweet", "cinematografico", "dividido", "papelaria", "minimalista", "parabola", "ensaio"];
  return estilos.sort((a, b) => (ordem.indexOf(a.id) + 1 || 99) - (ordem.indexOf(b.id) + 1 || 99));
}

// opcoes.pastaImagens: pasta do carrossel, onde ficam as imagens geradas pela IA.
// opcoes.imagemExemplo: usada na prévia no lugar das imagens que ainda não existem.
export async function montarHtml(cliente, carrossel, { cssExtra = "", pastaImagens, imagemExemplo } = {}) {
  const estilo = carrossel.estilo || cliente.visual.template || "classico";
  const arquivoTemplate = path.join(PASTA_TEMPLATES, `${estilo}.js`);
  const template = await import(fs.existsSync(arquivoTemplate) ? arquivoTemplate : path.join(PASTA_TEMPLATES, "classico.js"));
  const visual = {
    ...cliente.visual,
    logo: comoDataUri(cliente.visual.logo, cliente.pasta),
    foto_pessoa: comoDataUri(cliente.visual.foto_pessoa, cliente.pasta),
    data: new Date(carrossel.criado_em || Date.now()).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }),
    nome_exibicao: cliente.nome,
    arroba: cliente.instagram || cliente.visual.assinatura,
  };
  const estrutura = cliente.conteudo.estrutura;
  const total = carrossel.slides.length;

  const slides = carrossel.slides
    .map((s, i) => {
      const foto = s.imagem === "exemplo"
        ? imagemExemplo
        : comoDataUri(s.imagem || (i === 0 ? visual.foto_capa : null), pastaImagens, cliente.pasta);
      let nomeFundo = s.fundo || estrutura?.[i]?.fundo;
      if (nomeFundo === "gradiente") nomeFundo = "destaque";
      const fundo = visual.fundos[nomeFundo] || visual.fundos.escuro;
      return template.slide({ visual, s, i, total, fundo, foto });
    })
    .join("\n");

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>${cliente.nome} · ${carrossel.angulo}</title>
<style>${template.css(visual, [visual.fonte || "Poppins", ...(template.info?.fontes || [])].filter((f, k, l) => l.indexOf(f) === k).map((f) => fontesCss(f)).join("\n"))}${cssExtra}</style>
</head><body>${slides}</body></html>`;
}

function abrirNavegador() {
  const caminho = process.env.CHROMIUM_PATH || ["/opt/pw-browsers/chromium"].find((p) => fs.existsSync(p));
  // Sem caminho definido, usa o Google Chrome instalado na máquina.
  return chromium.launch(caminho ? { executablePath: caminho } : { channel: "chrome" });
}

export async function renderizar(cliente, carrossel, pastaDestino) {
  fs.mkdirSync(pastaDestino, { recursive: true });
  const html = await montarHtml(cliente, carrossel, { pastaImagens: pastaDestino });
  const arquivoHtml = path.join(pastaDestino, "carrossel.html");
  fs.writeFileSync(arquivoHtml, html);
  fs.writeFileSync(path.join(pastaDestino, "carrossel.json"), JSON.stringify(carrossel, null, 2));
  fs.writeFileSync(path.join(pastaDestino, "legenda.txt"), carrossel.legenda || "");

  const navegador = await abrirNavegador();
  const imagens = [];
  try {
    const pagina = await navegador.newPage({
      viewport: { width: cliente.visual.largura, height: cliente.visual.altura },
    });
    await pagina.setContent(html, { waitUntil: "load" });
    await pagina.evaluate(() => document.fonts.ready);
    const slides = await pagina.$$(".slide");
    for (let i = 0; i < slides.length; i++) {
      const nome = `slide-${String(i + 1).padStart(2, "0")}.png`;
      await slides[i].screenshot({ path: path.join(pastaDestino, nome) });
      imagens.push(nome);
    }
  } finally {
    await navegador.close();
  }
  return { pasta: pastaDestino, imagens, html: arquivoHtml };
}
