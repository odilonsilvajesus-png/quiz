// Carrega e salva o "Kit do Cliente": tudo que muda de um cliente para outro mora em clientes/<id>/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PASTA_CLIENTES = path.join(RAIZ, "clientes");
export const PASTA_SAIDA = path.join(RAIZ, "saida");

export const FONTES = ["Poppins", "Montserrat", "Inter", "DM Sans", "Playfair Display", "Lora"];

const PALETA_PADRAO = {
  escura: "#1A1A1A",
  clara: "#F0EBE1",
  destaque: "#E07A5F",
  destaque2: "#B8513A",
  gradiente: true,
  texto_claro: "#F7F2E9",
  texto_escuro: "#1A1A1A",
};

// ---------- cores ----------

function hexParaRgba(hex, alfa) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alfa})`;
}

// A paleta (6 cores) gera os 3 tipos de fundo usados nos slides.
export function fundosDaPaleta(p) {
  return {
    escuro: { fundo: p.escura, texto: p.texto_claro, subtexto: hexParaRgba(p.texto_claro, 0.72), destaque: p.destaque },
    claro: { fundo: p.clara, texto: p.texto_escuro, subtexto: hexParaRgba(p.texto_escuro, 0.68), destaque: p.destaque },
    destaque: {
      fundo: p.gradiente ? `linear-gradient(160deg, ${p.destaque} 0%, ${p.destaque2} 100%)` : p.destaque,
      texto: p.texto_claro,
      subtexto: hexParaRgba(p.texto_claro, 0.85),
      destaque: p.escura,
      pill_texto: p.texto_claro,
    },
  };
}

// Clientes antigos têm só "fundos" (e o terceiro fundo chamado "gradiente"). Converte para o formato novo.
function normalizar(config) {
  const c = structuredClone(config);
  c.visual ??= {};
  c.conteudo ??= {};
  c.referencias ??= { instagram: [], youtube: [], periodo_dias: 90 };
  const f = c.visual.fundos || {};
  if (f.gradiente && !f.destaque) f.destaque = f.gradiente;
  delete f.gradiente;
  for (const s of c.conteudo.estrutura || []) if (s.fundo === "gradiente") s.fundo = "destaque";

  if (!c.visual.paleta) {
    const cores = (f.destaque?.fundo || "").match(/#[0-9a-f]{6}/gi) || [];
    c.visual.paleta = {
      ...PALETA_PADRAO,
      escura: f.escuro?.fundo || PALETA_PADRAO.escura,
      clara: f.claro?.fundo || PALETA_PADRAO.clara,
      destaque: f.escuro?.destaque || cores[0] || PALETA_PADRAO.destaque,
      destaque2: cores.at(-1) || PALETA_PADRAO.destaque2,
      gradiente: cores.length > 1,
      texto_claro: f.escuro?.texto || PALETA_PADRAO.texto_claro,
      texto_escuro: f.claro?.texto || PALETA_PADRAO.texto_escuro,
    };
  }
  c.visual.fundos = { ...f, ...fundosDaPaleta(c.visual.paleta) };
  c.visual.largura ??= 1080;
  c.visual.altura ??= 1350;
  c.visual.template ??= "classico";
  c.visual.fonte ??= "Poppins";
  c.visual.rodape ??= { paginacao: true, pontos: true, texto_arraste: "ARRASTE →" };
  c.visual.imagens ??= { modo: "auto", estilo: "" };
  c.conteudo.limites ??= { titulo_max_caracteres: 110, subtitulo_max_caracteres: 220 };
  c.conteudo.angulos ??= [];
  c.conteudo.modelo_padrao ??= c.conteudo.estrutura?.length ? "proprio" : "quebra-de-crenca";
  return c;
}

// ---------- leitura ----------

const arquivoConfig = (id) => path.join(PASTA_CLIENTES, id, "cliente.json");

function lerConfig(id) {
  if (!/^[\w-]+$/.test(id) || id.startsWith("_") || !fs.existsSync(arquivoConfig(id))) {
    throw new Error(`Cliente "${id}" não encontrado.`);
  }
  return normalizar(JSON.parse(fs.readFileSync(arquivoConfig(id), "utf8")));
}

export function listarClientes() {
  return fs
    .readdirSync(PASTA_CLIENTES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && fs.existsSync(arquivoConfig(d.name)))
    .map((d) => carregarCliente(d.name));
}

export function carregarCliente(id) {
  const config = lerConfig(id);
  const pasta = path.join(PASTA_CLIENTES, id);
  const ler = (nome) => {
    if (!nome) return "";
    const p = path.join(pasta, nome);
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
  };
  const exemplosTxt = ler(config.exemplos || "exemplos.json");
  return {
    ...config,
    id,
    pasta,
    baseConhecimento: ler(config.base_conhecimento || "base-conhecimento.md"),
    voz: ler("voz.md"),
    exemplosCarrossel: exemplosTxt.trim() ? JSON.parse(exemplosTxt) : [],
  };
}

export function pastaSaida(clienteId, ...partes) {
  const p = path.join(PASTA_SAIDA, clienteId, ...partes);
  fs.mkdirSync(p, { recursive: true });
  return p;
}

// ---------- escrita ----------

// Lê, aplica a alteração e grava, sempre no formato novo.
function alterarConfig(id, alterar) {
  const config = lerConfig(id);
  alterar(config);
  delete config.visual.fundos; // recalculado a partir da paleta ao carregar
  fs.writeFileSync(arquivoConfig(id), JSON.stringify(config, null, 2) + "\n");
  return config;
}

function escreverArquivo(id, nome, texto) {
  fs.writeFileSync(path.join(PASTA_CLIENTES, id, nome), texto ?? "");
}

const slug = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

export function criarCliente(dados) {
  const nome = (dados.nome || "").trim();
  if (!nome) throw new Error("Informe o nome do cliente.");
  let id = slug(dados.id || nome);
  if (!id) throw new Error("Nome inválido.");
  const base = id;
  for (let n = 2; fs.existsSync(path.join(PASTA_CLIENTES, id)); n++) id = `${base}-${n}`;

  const destino = path.join(PASTA_CLIENTES, id);
  fs.cpSync(path.join(PASTA_CLIENTES, "_modelo"), destino, { recursive: true });
  alterarConfig(id, (c) => {
    c.id = id;
    c.nome = nome;
    c.descricao = dados.descricao || "";
    c.instagram = dados.instagram ? normalizarInstagram(dados.instagram) : "";
    c.referencias = { ...c.referencias, instagram: [], youtube: [] };
    c.visual.assinatura = c.instagram;
    if (dados.modelo) c.conteudo.modelo_padrao = dados.modelo;
    if (dados.paleta) c.visual.paleta = { ...c.visual.paleta, ...dados.paleta };
  });
  return id;
}

// "@Perfil", "perfil" ou "https://instagram.com/perfil/" viram "@perfil".
export function normalizarInstagram(ref) {
  const url = ref.match(/instagram\.com\/([\w.]+)/i);
  const handle = (url ? url[1] : ref).trim().replace(/^@/, "").replace(/\/+$/, "");
  return handle ? `@${handle.toLowerCase()}` : "";
}

// Canal do YouTube: aceita @handle, ID "UC..." ou link do canal.
function normalizarYoutube(ref) {
  const limpo = ref.trim().replace(/\/+$/, "");
  const handle = limpo.match(/@[\w.-]+/);
  if (handle) return handle[0];
  const id = limpo.match(/UC[\w-]{22}/);
  if (id) return id[0];
  return limpo ? `@${limpo.replace(/^@/, "")}` : "";
}

const semRepetir = (lista, normalizar) => [...new Set((lista || []).map(normalizar).filter(Boolean))];

export function salvarReferencias(id, { instagram, youtube, perfil_cliente, periodo_dias }) {
  const c = alterarConfig(id, (c) => {
    c.referencias = {
      ...c.referencias,
      instagram: semRepetir(instagram, normalizarInstagram),
      youtube: semRepetir(youtube, normalizarYoutube),
      periodo_dias: Number(periodo_dias) || c.referencias?.periodo_dias || 90,
    };
    if (perfil_cliente !== undefined) c.instagram = perfil_cliente ? normalizarInstagram(perfil_cliente) : "";
  });
  return { instagram: c.instagram, referencias: c.referencias };
}

export function salvarPerfil(id, { nome, descricao, instagram }) {
  alterarConfig(id, (c) => {
    if (nome?.trim()) c.nome = nome.trim();
    if (descricao !== undefined) c.descricao = descricao;
    if (instagram !== undefined) c.instagram = instagram ? normalizarInstagram(instagram) : "";
  });
}

export function salvarVisual(id, v) {
  alterarConfig(id, (c) => {
    if (v.paleta) c.visual.paleta = { ...c.visual.paleta, ...v.paleta };
    if (v.fonte && FONTES.includes(v.fonte)) c.visual.fonte = v.fonte;
    if (v.template && /^[a-z0-9-]+$/.test(v.template) && fs.existsSync(path.join(RAIZ, "templates", `${v.template}.js`))) {
      c.visual.template = v.template;
    }
    if (v.imagens) {
      c.visual.imagens = {
        modo: ["auto", "nenhuma", "capa", "todas"].includes(v.imagens.modo) ? v.imagens.modo : c.visual.imagens.modo,
        estilo: String(v.imagens.estilo ?? c.visual.imagens.estilo ?? ""),
      };
    }
    if (v.assinatura !== undefined) c.visual.assinatura = v.assinatura;
    if (v.cta_final !== undefined) c.visual.cta_final = v.cta_final;
    if (v.texto_arraste !== undefined) c.visual.rodape = { ...c.visual.rodape, texto_arraste: v.texto_arraste };
  });
}

// Converte a imagem enviada pelo navegador (data URL) e grava em `pasta` com o nome dado.
export function gravarDataUrl(dataUrl, pasta, nome) {
  const m = String(dataUrl).match(/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,(.+)$/);
  if (!m) throw new Error("Envie uma imagem PNG, JPG, WEBP ou SVG.");
  const ext = { jpeg: "jpg", "svg+xml": "svg" }[m[1]] || m[1];
  fs.mkdirSync(pasta, { recursive: true });
  const arquivo = `${nome}.${ext}`;
  fs.writeFileSync(path.join(pasta, arquivo), Buffer.from(m[2], "base64"));
  return arquivo;
}

// Logo ou foto do cliente (PNG sem fundo), guardados em assets/.
export function salvarImagemCliente(id, campo, dataUrl) {
  if (!["logo", "foto_pessoa"].includes(campo)) throw new Error("Campo de imagem inválido.");
  alterarConfig(id, (c) => {
    c.visual[campo] = dataUrl ? `assets/${gravarDataUrl(dataUrl, path.join(PASTA_CLIENTES, id, "assets"), campo)}` : null;
  });
}

export function salvarConteudo(id, { modelo_padrao, angulos, cta_legenda, proibir_travessao }) {
  alterarConfig(id, (c) => {
    if (modelo_padrao) c.conteudo.modelo_padrao = modelo_padrao;
    if (Array.isArray(angulos)) c.conteudo.angulos = angulos.map((a) => a.trim()).filter(Boolean);
    if (cta_legenda !== undefined) c.conteudo.cta_legenda = cta_legenda;
    if (proibir_travessao !== undefined) c.conteudo.proibir_travessao = Boolean(proibir_travessao);
  });
}

export const salvarVoz = (id, texto) => escreverArquivo(id, "voz.md", texto);

export function salvarDirecionamento(id, texto) {
  const c = lerConfig(id);
  escreverArquivo(id, c.base_conhecimento || "base-conhecimento.md", texto);
}

// Guarda um carrossel aprovado como exemplo de tom para as próximas gerações.
export function adicionarExemplo(id, carrossel) {
  const cliente = carregarCliente(id);
  const exemplos = cliente.exemplosCarrossel.filter((e) => e.origem_id !== carrossel.criado_em);
  exemplos.push({
    angulo: carrossel.angulo,
    origem: "Aprovado no painel",
    origem_id: carrossel.criado_em,
    slides: carrossel.slides.map(({ titulo, subtitulo }) => ({ titulo, subtitulo })),
  });
  escreverArquivo(id, cliente.exemplos || "exemplos.json", JSON.stringify(exemplos, null, 2) + "\n");
  return exemplos.length;
}
