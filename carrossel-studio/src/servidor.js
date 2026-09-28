// Painel web local: npm run painel -> http://localhost:3333
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { RAIZ, PASTA_SAIDA, carregarCliente, listarClientes, salvarReferencias } from "./cliente.js";
import { referenciasRanqueadas, gerarCarrossel, historico } from "./pipeline.js";
import { nomeProvedor } from "./ia.js";

if (fs.existsSync(path.join(RAIZ, ".env"))) process.loadEnvFile(path.join(RAIZ, ".env"));

const PORTA = Number(process.env.PORTA || 3333);
const TIPOS = { ".html": "text/html; charset=utf-8", ".png": "image/png", ".json": "application/json", ".txt": "text/plain; charset=utf-8" };

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

function listarGerados(clienteId) {
  return historico(clienteId)
    .slice()
    .reverse()
    .map((h) => {
      const pasta = path.join(PASTA_SAIDA, clienteId, "carrosseis", h.pasta);
      if (!fs.existsSync(pasta)) return null;
      const carrossel = JSON.parse(fs.readFileSync(path.join(pasta, "carrossel.json"), "utf8"));
      const imagens = fs.readdirSync(pasta).filter((f) => f.endsWith(".png")).sort();
      return { ...h, carrossel, imagens: imagens.map((f) => `/saida/${clienteId}/carrosseis/${h.pasta}/${f}`) };
    })
    .filter(Boolean);
}

const rotas = [
  ["GET", /^\/api\/status$/, () => ({
    ia: nomeProvedor(),
    apify: Boolean(process.env.APIFY_TOKEN),
    youtube: Boolean(process.env.YOUTUBE_API_KEY),
    clientes: listarClientes().map((c) => ({ id: c.id, nome: c.nome, descricao: c.descricao })),
  })],
  ["GET", /^\/api\/clientes\/([\w-]+)$/, (m) => {
    const c = carregarCliente(m[1]);
    return { id: c.id, nome: c.nome, instagram: c.instagram || "", angulos: c.conteudo.angulos || [], referencias: c.referencias };
  }],
  ["GET", /^\/api\/clientes\/([\w-]+)\/referencias$/, (m, url) =>
    referenciasRanqueadas(carregarCliente(m[1]), { recoletar: url.searchParams.has("recoletar"), log: () => {} })],
  ["PUT", /^\/api\/clientes\/([\w-]+)\/referencias$/, async (m, _url, req) => salvarReferencias(m[1], await corpo(req))],
  ["GET", /^\/api\/clientes\/([\w-]+)\/carrosseis$/, (m) => listarGerados(m[1])],
  ["POST", /^\/api\/clientes\/([\w-]+)\/gerar$/, async (m, _url, req) => {
    const { refId, angulo, indice } = await corpo(req);
    const cliente = carregarCliente(m[1]);
    const { posts } = await referenciasRanqueadas(cliente, { log: () => {} });
    const ref = posts.find((p) => p.id === refId);
    if (!ref) throw new Error("Referência não encontrada. Atualize a coleta.");
    await gerarCarrossel(cliente, ref, { angulo: angulo || undefined, indice, log: () => {} });
    return listarGerados(cliente.id)[0];
  }],
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
        if (m && req.method === metodo) return json(res, 200, await fn(m, url, req));
      }
      json(res, 404, { erro: "Rota não encontrada" });
    } catch (erro) {
      console.error(erro);
      json(res, 500, { erro: erro.message });
    }
  })
  .listen(PORTA, () => console.log(`Painel rodando em http://localhost:${PORTA}`));
