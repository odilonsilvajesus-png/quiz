// Painel web local: npm run painel -> http://localhost:3333
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {
  RAIZ, PASTA_SAIDA, FONTES, carregarCliente, listarClientes, criarCliente, fundosDaPaleta,
  salvarReferencias, salvarPerfil, salvarVisual, salvarImagemCliente, salvarConteudo, salvarVoz, gravarDataUrl,
  salvarDirecionamento, adicionarExemplo,
} from "./cliente.js";
import { referenciasRanqueadas, gerarCarrossel, historico } from "./pipeline.js";
import { listarModelos, modelosDoCliente, resolverModelo } from "./modelos.js";
import { montarHtml, listarEstilos, renderizar } from "./render.js";
import { imagemExemplo, slidesComImagem, temGeradorImagem, resolverModo } from "./imagens.js";
import { nomeProvedor } from "./ia.js";
import { descreverVoz } from "./copy.js";
import { coletarLegendas } from "./coleta/instagram.js";

if (fs.existsSync(path.join(RAIZ, ".env"))) process.loadEnvFile(path.join(RAIZ, ".env"));

const PORTA = Number(process.env.PORTA || 3333);
const TIPOS = { ".html": "text/html; charset=utf-8", ".png": "image/png", ".json": "application/json", ".txt": "text/plain; charset=utf-8" };

class Resposta {
  constructor(tipo, conteudo) {
    this.tipo = tipo;
    this.conteudo = conteudo;
  }
}

function json(res, status, dados) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dados));
}

function arquivo(res, caminho, base) {
  const alvo = path.resolve(caminho);
  if (!alvo.startsWith(base + path.sep) || !fs.existsSync(alvo) || !fs.statSync(alvo).isFile()) {
    res.writeHead(404).end("Não encontrado");
    return;
  }
  res.writeHead(200, { "Content-Type": TIPOS[path.extname(alvo)] || "application/octet-stream" });
  fs.createReadStream(alvo).pipe(res);
}

async function corpo(req) {
  let dados = "";
  for await (const parte of req) dados += parte;
  return dados ? JSON.parse(dados) : {};
}

function pastaCarrossel(clienteId, nome) {
  if (!/^[\w.-]+$/.test(nome || "")) throw new Error("Carrossel inválido.");
  return path.join(PASTA_SAIDA, clienteId, "carrosseis", nome);
}

function listarGerados(clienteId) {
  return historico(clienteId)
    .slice()
    .reverse()
    .map((h) => {
      const pasta = pastaCarrossel(clienteId, h.pasta);
      if (!fs.existsSync(path.join(pasta, "carrossel.json"))) return null;
      const carrossel = JSON.parse(fs.readFileSync(path.join(pasta, "carrossel.json"), "utf8"));
      const imagens = fs.readdirSync(pasta).filter((f) => f.endsWith(".png")).sort();
      // ?v= muda quando o slide é renderizado de novo, para o navegador não mostrar a versão antiga.
      const versao = (f) => Math.round(fs.statSync(path.join(pasta, f)).mtimeMs);
      return { ...h, carrossel, imagens: imagens.map((f) => `/saida/${clienteId}/carrosseis/${h.pasta}/${f}?v=${versao(f)}`) };
    })
    .filter(Boolean);
}

function resumoCliente(c) {
  return {
    id: c.id,
    nome: c.nome,
    descricao: c.descricao || "",
    instagram: c.instagram || "",
    paleta: c.visual.paleta,
    fonte: c.visual.fonte,
    referencias: (c.referencias.instagram?.length || 0) + (c.referencias.youtube?.length || 0),
    carrosseis: historico(c.id).length,
  };
}

function detalheCliente(id) {
  const c = carregarCliente(id);
  return {
    ...resumoCliente(c),
    referencias: c.referencias,
    conteudo: {
      angulos: c.conteudo.angulos,
      modelo_padrao: resolverModelo(c).id,
      cta_legenda: c.conteudo.cta_legenda || "",
      proibir_travessao: Boolean(c.conteudo.proibir_travessao),
    },
    visual: {
      paleta: c.visual.paleta,
      fonte: c.visual.fonte,
      assinatura: c.visual.assinatura || "",
      cta_final: c.visual.cta_final || "",
      texto_arraste: c.visual.rodape?.texto_arraste || "",
      tem_logo: Boolean(c.visual.logo),
      tem_foto_pessoa: Boolean(c.visual.foto_pessoa),
      template: c.visual.template,
      imagens: c.visual.imagens,
    },
    voz: c.voz,
    direcionamento: c.baseConhecimento,
    exemplos: c.exemplosCarrossel.length,
    modelos: modelosDoCliente(c),
  };
}

// Prévia ao vivo: aplica as alterações ainda não salvas e mostra os slides lado a lado.
async function previa(id, dados) {
  const c = carregarCliente(id);
  const paleta = { ...c.visual.paleta, ...(dados.paleta || {}) };
  const cliente = {
    ...c,
    visual: {
      ...c.visual,
      paleta,
      fundos: fundosDaPaleta(paleta),
      fonte: FONTES.includes(dados.fonte) ? dados.fonte : c.visual.fonte,
      assinatura: dados.assinatura ?? c.visual.assinatura,
      cta_final: dados.cta_final ?? c.visual.cta_final,
      rodape: { ...c.visual.rodape, texto_arraste: dados.texto_arraste ?? c.visual.rodape?.texto_arraste },
    },
  };
  const infoEstilo = (await listarEstilos()).find((e) => e.id === (dados.template || c.visual.template));
  const modoImagens = resolverModo(dados.imagens?.modo || c.visual.imagens?.modo, infoEstilo);
  const comImagem = new Set(slidesComImagem(modoImagens, resolverModelo(c, dados.modelo).estrutura.length));
  const modelo = resolverModelo(c, dados.modelo);
  const estilo = dados.template || c.visual.template;
  const exemplo = c.exemplosCarrossel.find((e) => e.slides.length === modelo.estrutura.length);
  const slides = modelo.estrutura.map((s, i) => ({
    titulo: exemplo?.slides[i].titulo || `${s.papel} com *destaque*`,
    subtitulo: exemplo?.slides[i].subtitulo || s.instrucao,
    fundo: s.fundo,
    imagem: comImagem.has(i) ? "exemplo" : undefined,
  }));
  const zoom = Number(dados.zoom) || 0.22;
  const css = `body{display:flex;flex-wrap:wrap;gap:40px;padding:40px;background:transparent;zoom:${zoom}}.slide{margin:0;border-radius:24px;flex:none}`;
  const html = await montarHtml(cliente, { angulo: "Prévia", estilo, slides }, { cssExtra: css, imagemExemplo: imagemExemplo(paleta) });
  return new Resposta("text/html; charset=utf-8", html);
}

// Ajuste manual de um carrossel já gerado: textos e troca/remoção da imagem de cada slide
// (ex.: subir um print real). Depois renderiza de novo.
async function editarCarrossel(id, nomePasta, { slides = [], imagens = {} }) {
  const cliente = carregarCliente(id);
  const pasta = pastaCarrossel(id, nomePasta);
  const arquivo = path.join(pasta, "carrossel.json");
  const carrossel = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  slides.forEach((s, i) => {
    if (!carrossel.slides[i]) return;
    if (typeof s.titulo === "string") carrossel.slides[i].titulo = s.titulo;
    if (typeof s.subtitulo === "string") carrossel.slides[i].subtitulo = s.subtitulo;
  });
  for (const [i, dataUrl] of Object.entries(imagens)) {
    const s = carrossel.slides[Number(i)];
    if (!s) continue;
    s.imagem = dataUrl ? gravarDataUrl(dataUrl, pasta, `enviada-${String(Number(i) + 1).padStart(2, "0")}-${Date.now()}`) : undefined;
  }
  await renderizar(cliente, carrossel, pasta);
  return listarGerados(id).find((g) => g.pasta === nomePasta);
}

async function gerarVoz(id) {
  const cliente = carregarCliente(id);
  if (!cliente.instagram) throw new Error("Preencha o Instagram do cliente na aba Referências primeiro.");
  if (!process.env.APIFY_TOKEN) throw new Error("A coleta do tom de voz usa o Apify. Preencha APIFY_TOKEN no .env.");
  const legendas = await coletarLegendas(cliente.instagram);
  if (legendas.length < 5) throw new Error(`Só encontrei ${legendas.length} legendas longas em ${cliente.instagram}. Preciso de pelo menos 5.`);
  const texto = await descreverVoz(cliente, legendas);
  salvarVoz(id, texto);
  return { texto, legendas: legendas.length };
}

const C = "([\\w-]+)";
const rota = (metodo, padrao, fn) => [metodo, new RegExp(`^${padrao.replace(":id", C)}$`), fn];

const rotas = [
  rota("GET", "/api/status", async () => ({
    ia: nomeProvedor(),
    imagens: temGeradorImagem(),
    estilos: await listarEstilos(),
    apify: Boolean(process.env.APIFY_TOKEN),
    youtube: Boolean(process.env.YOUTUBE_API_KEY),
    fontes: FONTES,
  })),
  rota("GET", "/api/modelos", () => listarModelos()),
  rota("GET", "/api/clientes", () => listarClientes().map(resumoCliente)),
  rota("POST", "/api/clientes", async (_m, _u, req) => ({ id: criarCliente(await corpo(req)) })),
  rota("GET", "/api/clientes/:id", (m) => detalheCliente(m[1])),
  rota("PUT", "/api/clientes/:id/perfil", async (m, _u, req) => (salvarPerfil(m[1], await corpo(req)), detalheCliente(m[1]))),
  rota("PUT", "/api/clientes/:id/visual", async (m, _u, req) => (salvarVisual(m[1], await corpo(req)), detalheCliente(m[1]))),
  rota("PUT", "/api/clientes/:id/logo", async (m, _u, req) => (salvarImagemCliente(m[1], "logo", (await corpo(req)).dataUrl), detalheCliente(m[1]))),
  rota("PUT", "/api/clientes/:id/foto-pessoa", async (m, _u, req) => (salvarImagemCliente(m[1], "foto_pessoa", (await corpo(req)).dataUrl), detalheCliente(m[1]))),
  rota("PUT", "/api/clientes/:id/carrosseis/([\\w.-]+)", async (m, _u, req) => editarCarrossel(m[1], m[2], await corpo(req))),
  rota("PUT", "/api/clientes/:id/conteudo", async (m, _u, req) => (salvarConteudo(m[1], await corpo(req)), detalheCliente(m[1]))),
  rota("PUT", "/api/clientes/:id/voz", async (m, _u, req) => (salvarVoz(m[1], (await corpo(req)).texto), { ok: true })),
  rota("POST", "/api/clientes/:id/voz/gerar", (m) => gerarVoz(m[1])),
  rota("PUT", "/api/clientes/:id/direcionamento", async (m, _u, req) => (salvarDirecionamento(m[1], (await corpo(req)).texto), { ok: true })),
  rota("POST", "/api/clientes/:id/previa", async (m, _u, req) => previa(m[1], await corpo(req))),
  rota("GET", "/api/clientes/:id/referencias", (m, url) =>
    referenciasRanqueadas(carregarCliente(m[1]), { recoletar: url.searchParams.has("recoletar"), log: () => {} })),
  rota("PUT", "/api/clientes/:id/referencias", async (m, _u, req) => salvarReferencias(m[1], await corpo(req))),
  rota("GET", "/api/clientes/:id/carrosseis", (m) => listarGerados(m[1])),
  rota("POST", "/api/clientes/:id/gerar", async (m, _u, req) => {
    const { refId, angulo, modelo, estilo, imagens, indice } = await corpo(req);
    const cliente = carregarCliente(m[1]);
    const { posts } = await referenciasRanqueadas(cliente, { log: () => {} });
    const ref = posts.find((p) => p.id === refId);
    if (!ref) throw new Error("Referência não encontrada. Atualize a coleta.");
    await gerarCarrossel(cliente, ref, {
      angulo: angulo || undefined, modelo: modelo || undefined, estilo: estilo || undefined, imagens: imagens || undefined, indice, log: () => {},
    });
    return listarGerados(cliente.id)[0];
  }),
  rota("POST", "/api/clientes/:id/aprovar", async (m, _u, req) => {
    const pasta = pastaCarrossel(m[1], (await corpo(req)).pasta);
    const carrossel = JSON.parse(fs.readFileSync(path.join(pasta, "carrossel.json"), "utf8"));
    return { exemplos: adicionarExemplo(m[1], carrossel) };
  }),
];

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    try {
      if (url.pathname === "/") return arquivo(res, path.join(RAIZ, "painel", "index.html"), path.join(RAIZ, "painel"));
      if (url.pathname.startsWith("/saida/")) {
        return arquivo(res, path.join(PASTA_SAIDA, decodeURIComponent(url.pathname.slice(7))), PASTA_SAIDA);
      }
      for (const [metodo, padrao, fn] of rotas) {
        const m = url.pathname.match(padrao);
        if (!m || req.method !== metodo) continue;
        const resultado = await fn(m, url, req);
        if (resultado instanceof Resposta) {
          res.writeHead(200, { "Content-Type": resultado.tipo });
          return res.end(resultado.conteudo);
        }
        return json(res, 200, resultado);
      }
      json(res, 404, { erro: "Rota não encontrada" });
    } catch (erro) {
      console.error(erro);
      json(res, 500, { erro: erro.message });
    }
  })
  .listen(PORTA, () => console.log(`Painel rodando em http://localhost:${PORTA}`));
