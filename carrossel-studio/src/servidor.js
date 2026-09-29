// Painel web local: npm run painel -> http://localhost:3333
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {
  RAIZ, PASTA_SAIDA, FONTES, carregarCliente, listarClientes, criarCliente, fundosDaPaleta,
  salvarReferencias, salvarPerfil, salvarVisual, salvarImagemCliente, salvarConteudo, salvarVoz, gravarDataUrl,
  salvarDirecionamento, adicionarExemplo, salvarPublicacao, listarFotos, caminhoFoto, adicionarFoto, removerFoto,
} from "./cliente.js";
import { listarSugestoes, gerarSugestoes, limparSugestoes, sugestaoComoReferencia } from "./sugestoes.js";
import { aprofundar, podeAnalisar } from "./analise.js";
import { listarDocumentos, adicionarDocumento, removerDocumento, guardarTexto } from "./documentos.js";
import { lerMapaDaMarca, podeLerMapa } from "./marca.js";
import { gerarCarrossel, atualizarColeta } from "./pipeline.js";
import { ultimaColeta } from "./coleta/index.js";
import { ranquear } from "./ranking.js";
import { iniciarTarefa, estadoTarefa } from "./tarefas.js";
import { comMedicao, resumoDoMes, custoPorPasta, cotacao } from "./custos.js";
import * as carrosseis from "./carrosseis.js";
import { publicarCarrossel, testarConexao, temHospedagem } from "./publicar.js";
import { criarZip } from "./zip.js";
import { createRequire } from "node:module";
import { listarModelos, modelosDoCliente, resolverModelo } from "./modelos.js";
import { montarHtml, listarEstilos, renderizar, exportarJpeg } from "./render.js";
import { imagemExemplo, slidesComImagem, temGeradorImagem, resolverModo } from "./imagens.js";
import { nomeProvedor } from "./ia.js";
import { descreverVoz } from "./copy.js";
import { coletarPostsDoCliente } from "./coleta/instagram.js";

if (fs.existsSync(path.join(RAIZ, ".env"))) process.loadEnvFile(path.join(RAIZ, ".env"));

const PORTA = Number(process.env.PORTA || 3333);
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".woff2": "font/woff2",
};
const require = createRequire(import.meta.url);
const PASTA_FONTE_PAINEL = path.join(path.dirname(require.resolve("@fontsource/inter/package.json")), "files");
const { pastaCarrossel } = carrosseis;
// Cada carrossel vem com o quanto custou (em reais), quando houve gasto.
const listarGerados = (id) => {
  const custos = custoPorPasta(id);
  return carrosseis.listar(id).map((g) => ({ ...g, custo_brl: custos[g.pasta] ?? null }));
};

class Resposta {
  constructor(tipo, conteudo, baixarComo) {
    this.tipo = tipo;
    this.conteudo = conteudo;
    this.baixarComo = baixarComo;
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

function resumoCliente(c) {
  return {
    id: c.id,
    nome: c.nome,
    descricao: c.descricao || "",
    instagram: c.instagram || "",
    paleta: c.visual.paleta,
    fonte: c.visual.fonte,
    referencias: (c.referencias.instagram?.length || 0) + (c.referencias.youtube?.length || 0),
    contagem: carrosseis.contagem(c.id),
    gasto_mes: resumoDoMes(c.id).brl,
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
    fotos: listarFotos(c.id).map((nome) => ({ nome, url: `/api/clientes/${c.id}/fotos/${nome}` })),
    documentos: listarDocumentos(c.id),
    direcionamento: c.baseConhecimento,
    exemplos: c.exemplosCarrossel.length,
    gasto_mes: resumoDoMes(c.id).brl,
    publicacao: {
      conectado: Boolean(c.publicacao?.ig_user_id && c.publicacao?.token),
      ig_user_id: c.publicacao?.ig_user_id || "",
      conta: c.publicacao?.conta || "",
    },
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
      alternar_fundos: dados.alternar_fundos ?? c.visual.alternar_fundos,
      usar_fechamento: dados.usar_fechamento ?? c.visual.usar_fechamento,
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

// Lê o mapa da marca, guarda o arquivo e as diretrizes (como documento) e devolve a paleta sugerida.
// A paleta só é aplicada quando o usuário salva a identidade visual.
async function lerMapa(id, { nome = "mapa-da-marca", dataUrl }) {
  const cliente = carregarCliente(id);
  const mapa = await lerMapaDaMarca({ nome, dataUrl });
  const m = String(dataUrl).match(/^data:([\w/+.-]+);base64,(.+)$/);
  if (m) {
    const ext = m[1] === "application/pdf" ? "pdf" : m[1].split("/")[1].replace("jpeg", "jpg");
    fs.mkdirSync(path.join(cliente.pasta, "assets"), { recursive: true });
    fs.writeFileSync(path.join(cliente.pasta, "assets", `mapa-da-marca.${ext}`), Buffer.from(m[2], "base64"));
  }
  const linhasCores = mapa.cores_encontradas.map((c) => `- ${c.hex}: ${c.nome}`).join("\n");
  const texto = [`Mapa da marca de ${cliente.nome}.`, linhasCores && `Cores:\n${linhasCores}`,
    mapa.fontes_do_mapa.length && `Fontes: ${mapa.fontes_do_mapa.join(", ")}`, mapa.diretrizes && `Diretrizes:\n${mapa.diretrizes}`]
    .filter(Boolean).join("\n\n");
  guardarTexto(id, { nome: `Mapa da marca (${nome})`, texto, origem: "mapa-marca", substituirOrigem: true });
  return { mapa, cliente: detalheCliente(id) };
}

function salvarLegenda(id, nomePasta, legenda) {
  const arquivoJson = path.join(pastaCarrossel(id, nomePasta), "carrossel.json");
  const carrossel = JSON.parse(fs.readFileSync(arquivoJson, "utf8"));
  carrossel.legenda = legenda;
  fs.writeFileSync(arquivoJson, JSON.stringify(carrossel, null, 2));
}

// Publica no Instagram do cliente e move o carrossel para "Postados".
async function publicar(id, nomePasta, { legenda } = {}) {
  const cliente = carregarCliente(id);
  const { ig_user_id: igUserId, token } = cliente.publicacao || {};
  if (!igUserId || !token) throw new Error("Conecte o Instagram deste cliente na aba Perfil e referências.");
  if (!temHospedagem()) throw new Error("Preencha IMGBB_API_KEY no .env para enviar as imagens ao Instagram.");
  const pasta = pastaCarrossel(id, nomePasta);
  const arquivoJson = path.join(pasta, "carrossel.json");
  const carrossel = JSON.parse(fs.readFileSync(arquivoJson, "utf8"));
  if (typeof legenda === "string") {
    carrossel.legenda = legenda;
    fs.writeFileSync(arquivoJson, JSON.stringify(carrossel, null, 2));
  }
  const arquivos = await exportarJpeg(pasta, { largura: cliente.visual.largura, altura: cliente.visual.altura });
  const resultado = await publicarCarrossel({ igUserId, token, arquivos, legenda: carrossel.legenda });
  return carrosseis.marcarPostado(id, nomePasta, resultado);
}

// Ideias da última coleta, sem coletar nem analisar nada aqui (isso é tarefa da coleta em segundo plano).
function ideias(id) {
  carregarCliente(id);
  const coleta = ultimaColeta(id);
  if (!coleta) return { sem_coleta: true, avisos: [], posts: [] };
  return { ...coleta, posts: ranquear(coleta.posts, { limite: 60 }) };
}

// Tom de voz a partir dos posts reais do cliente: fala dos reels, texto dos carrosséis e legendas.
async function gerarVoz(id, log = () => {}) {
  const cliente = carregarCliente(id);
  if (!cliente.instagram) throw new Error("Preencha o Instagram do cliente na aba Perfil e referências primeiro.");
  if (!process.env.APIFY_TOKEN) throw new Error("A coleta do tom de voz usa o Apify. Preencha APIFY_TOKEN no .env.");
  log(`Coletando os posts de ${cliente.instagram}...`);
  const posts = await coletarPostsDoCliente(cliente.instagram, 30, log);
  if (posts.length < 5) throw new Error(`Só encontrei ${posts.length} posts em ${cliente.instagram}. Preciso de pelo menos 5.`);
  // Analisa os 12 posts mais engajados: é neles que o jeito de falar dela mais aparece.
  const selecionados = posts
    .sort((a, b) => b.metricas.curtidas + 2 * b.metricas.comentarios - (a.metricas.curtidas + 2 * a.metricas.comentarios))
    .slice(0, 12);
  await aprofundar(selecionados, { limite: 12, log });
  log("Escrevendo a descrição do tom de voz...");
  const texto = await descreverVoz(cliente, selecionados);
  salvarVoz(id, texto);
  const analisados = selecionados.filter((p) => p.analise?.transcricao || p.analise?.slides).length;
  return { texto, posts: selecionados.length, analisados };
}

// Verifica a cada minuto se há carrossel agendado para publicar. Só funciona com o painel aberto.
async function publicarAgendados() {
  for (const c of listarClientes()) {
    for (const item of carrosseis.agendamentosVencidos(c.id)) {
      carrosseis.atualizar(c.id, item.pasta, { publicando: true });
      try {
        await publicar(c.id, item.pasta);
        console.log(`Agendamento publicado: ${c.nome} · ${item.angulo}`);
      } catch (erro) {
        carrosseis.atualizar(c.id, item.pasta, { publicando: undefined, falhou: erro.message });
        console.error(`Agendamento falhou (${c.nome} · ${item.angulo}): ${erro.message}`);
      }
    }
  }
}

const C = "([\\w-]+)";
const rota = (metodo, padrao, fn) => [metodo, new RegExp(`^${padrao.replace(":id", C)}$`), fn];

const rotas = [
  rota("GET", "/api/status", async () => ({
    ia: nomeProvedor(),
    imagens: temGeradorImagem(),
    hospedagem: temHospedagem(),
    analise: podeAnalisar(),
    mapa: podeLerMapa(),
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
  rota("POST", "/api/clientes/:id/voz/gerar", (m) => (carregarCliente(m[1]), iniciarTarefa(`voz:${m[1]}`, (log) => comMedicao(m[1], { tipo: "tom de voz" }, () => gerarVoz(m[1], log))))),
  rota("GET", "/api/clientes/:id/voz/gerar", (m) => estadoTarefa(`voz:${m[1]}`)),
  rota("PUT", "/api/clientes/:id/direcionamento", async (m, _u, req) => (salvarDirecionamento(m[1], (await corpo(req)).texto), { ok: true })),
  rota("POST", "/api/clientes/:id/previa", async (m, _u, req) => previa(m[1], await corpo(req))),
  rota("GET", "/api/clientes/:id/referencias", (m) => ideias(m[1])),
  rota("POST", "/api/clientes/:id/coleta", (m) => {
    const cliente = carregarCliente(m[1]);
    return iniciarTarefa(`coleta:${cliente.id}`, async (log) => {
      const coleta = await atualizarColeta(cliente, { log });
      return { posts: coleta.posts.length };
    });
  }),
  rota("GET", "/api/clientes/:id/coleta", (m) => estadoTarefa(`coleta:${m[1]}`)),
  rota("PUT", "/api/clientes/:id/referencias", async (m, _u, req) => salvarReferencias(m[1], await corpo(req))),
  rota("GET", "/api/clientes/:id/carrosseis", (m) => listarGerados(m[1])),
  rota("POST", "/api/clientes/:id/gerar", async (m, _u, req) => {
    const { refId, angulo, modelo, estilo, imagens, indice, observacao, obsImagem, fotoPessoa } = await corpo(req);
    const cliente = carregarCliente(m[1]);
    let ref;
    if (String(refId).startsWith("sug:")) {
      const sugestao = listarSugestoes(cliente.id).find((s) => s.id === refId);
      ref = sugestao && sugestaoComoReferencia(sugestao);
    } else {
      ref = ideias(cliente.id).posts.find((p) => p.id === refId);
    }
    if (!ref) throw new Error("Referência não encontrada. Atualize a coleta.");
    await gerarCarrossel(cliente, ref, {
      angulo: angulo || undefined, modelo: modelo || undefined, estilo: estilo || undefined, imagens: imagens || undefined,
      indice, observacao, obsImagem, fotoPessoa: fotoPessoa || undefined, log: () => {},
    });
    return listarGerados(cliente.id)[0];
  }),
  rota("POST", "/api/clientes/:id/carrosseis/([\\w.-]+)/descartar", async (m, _u, req) =>
    carrosseis.descartar(m[1], m[2], (await corpo(req)).motivo)),
  rota("POST", "/api/clientes/:id/carrosseis/([\\w.-]+)/restaurar", (m) => carrosseis.restaurar(m[1], m[2])),
  rota("POST", "/api/clientes/:id/carrosseis/([\\w.-]+)/marcar-postado", async (m, _u, req) =>
    carrosseis.marcarPostado(m[1], m[2], { permalink: (await corpo(req)).permalink || "" })),
  rota("POST", "/api/clientes/:id/carrosseis/([\\w.-]+)/publicar", async (m, _u, req) => publicar(m[1], m[2], await corpo(req))),
  rota("GET", "/api/clientes/:id/carrosseis/([\\w.-]+)/zip", (m) => {
    const pasta = pastaCarrossel(m[1], m[2]);
    const arquivos = fs.readdirSync(pasta).filter((f) => /^slide-\d+\.png$/.test(f)).sort().map((f) => path.join(pasta, f));
    return new Resposta("application/zip", criarZip(arquivos), `${m[2]}.zip`);
  }),
  rota("POST", "/api/clientes/:id/carrosseis/([\\w.-]+)/agendar", async (m, _u, req) => {
    const { quando, legenda } = await corpo(req);
    if (typeof legenda === "string") salvarLegenda(m[1], m[2], legenda);
    return carrosseis.agendar(m[1], m[2], quando);
  }),
  rota("POST", "/api/clientes/:id/carrosseis/([\\w.-]+)/cancelar-agendamento", (m) => carrosseis.cancelarAgendamento(m[1], m[2])),
  rota("GET", "/api/clientes/:id/sugestoes", (m) => listarSugestoes(m[1])),
  rota("POST", "/api/clientes/:id/documentos", async (m, _u, req) => (await adicionarDocumento(m[1], await corpo(req)), detalheCliente(m[1]))),
  rota("DELETE", "/api/clientes/:id/documentos/(doc-\\d+)", (m) => (removerDocumento(m[1], m[2]), detalheCliente(m[1]))),
  rota("POST", "/api/clientes/:id/mapa-marca", async (m, _u, req) => {
    const dados = await corpo(req);
    return comMedicao(m[1], { tipo: "mapa da marca", descricao: dados.nome || "" }, () => lerMapa(m[1], dados));
  }),
  rota("POST", "/api/clientes/:id/sugestoes", async (m, _u, req) => {
    const dados = await corpo(req);
    return comMedicao(m[1], { tipo: "sugestões", descricao: dados.foco || "" }, () => gerarSugestoes(carregarCliente(m[1]), dados));
  }),
  rota("GET", "/api/clientes/:id/custos", async (m, url) => ({
    ...resumoDoMes(m[1], url.searchParams.get("mes") || undefined), cotacao: await cotacao(),
  })),
  rota("GET", "/api/custos", async () => {
    const clientes = listarClientes().map((c) => ({ id: c.id, nome: c.nome, ...resumoDoMes(c.id) }));
    return { brl: +clientes.reduce((t, c) => t + c.brl, 0).toFixed(4), clientes: clientes.map(({ entradas, ...c }) => c), cotacao: await cotacao() };
  }),
  rota("DELETE", "/api/clientes/:id/sugestoes", (m) => (limparSugestoes(m[1]), [])),
  rota("POST", "/api/clientes/:id/fotos", async (m, _u, req) => (adicionarFoto(m[1], (await corpo(req)).dataUrl), detalheCliente(m[1]))),
  rota("DELETE", "/api/clientes/:id/fotos/([\\w.-]+)", (m) => (removerFoto(m[1], m[2]), detalheCliente(m[1]))),
  rota("GET", "/api/clientes/:id/fotos/([\\w.-]+)", (m) => {
    const arq = caminhoFoto(m[1], m[2]);
    return new Resposta(TIPOS[path.extname(arq).toLowerCase()] || "image/jpeg", fs.readFileSync(arq));
  }),
  rota("PUT", "/api/clientes/:id/publicacao", async (m, _u, req) => {
    const dados = await corpo(req);
    salvarPublicacao(m[1], dados);
    const c = carregarCliente(m[1]);
    if (!c.publicacao?.ig_user_id || !c.publicacao?.token) return detalheCliente(m[1]);
    salvarPublicacao(m[1], { conta: await testarConexao({ igUserId: c.publicacao.ig_user_id, token: c.publicacao.token }) });
    return detalheCliente(m[1]);
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
      if (url.pathname.startsWith("/marca/")) {
        return arquivo(res, path.join(RAIZ, "painel", "marca", path.basename(url.pathname)), path.join(RAIZ, "painel", "marca"));
      }
      if (url.pathname.startsWith("/fontes/")) {
        return arquivo(res, path.join(PASTA_FONTE_PAINEL, path.basename(url.pathname)), PASTA_FONTE_PAINEL);
      }
      if (url.pathname.startsWith("/saida/")) {
        return arquivo(res, path.join(PASTA_SAIDA, decodeURIComponent(url.pathname.slice(7))), PASTA_SAIDA);
      }
      for (const [metodo, padrao, fn] of rotas) {
        const m = url.pathname.match(padrao);
        if (!m || req.method !== metodo) continue;
        const resultado = await fn(m, url, req);
        if (resultado instanceof Resposta) {
          res.writeHead(200, {
            "Content-Type": resultado.tipo,
            ...(resultado.baixarComo ? { "Content-Disposition": `attachment; filename="${resultado.baixarComo}"` } : {}),
          });
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
  .listen(PORTA, () => {
    console.log(`Painel rodando em http://localhost:${PORTA}`);
    // Se o painel foi fechado no meio de uma publicação, libera o agendamento para tentar de novo.
    for (const c of listarClientes()) {
      for (const h of carrosseis.historico(c.id)) if (h.publicando) carrosseis.atualizar(c.id, h.pasta, { publicando: undefined });
    }
    publicarAgendados();
    setInterval(publicarAgendados, 60_000);
  });
