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

// Mistura duas cores hex (peso = quanto de `b`).
export function misturar(a, b, peso) {
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [rgb(a), rgb(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * peso).toString(16).padStart(2, "0")).join("").toUpperCase();
}

const luminancia = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// Cor do último slide: se o cliente não escolheu, um tom profundo da cor de destaque (diferente dos outros fundos).
export const corDeFechamento = (p) => (/^#[0-9a-f]{6}$/i.test(p.fechamento || "") ? p.fechamento : misturar(p.escura, p.destaque, 0.45));

// A paleta gera os 4 tipos de fundo usados nos slides: escuro, claro, destaque e fechamento (último slide).
export function fundosDaPaleta(p) {
  const fechamento = corDeFechamento(p);
  const fechamentoEscuro = luminancia(fechamento) < 0.55;
  return {
    fechamento: {
      fundo: fechamentoEscuro
        ? `radial-gradient(120% 80% at 50% 105%, ${hexParaRgba(p.destaque, 0.45)} 0%, transparent 60%), ${fechamento}`
        : fechamento,
      texto: fechamentoEscuro ? p.texto_claro : p.texto_escuro,
      subtexto: hexParaRgba(fechamentoEscuro ? p.texto_claro : p.texto_escuro, 0.78),
      destaque: fechamentoEscuro ? p.destaque : p.escura,
      pill_texto: p.texto_claro,
    },
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
  c.visual.paleta.fechamento = corDeFechamento(c.visual.paleta);
  c.visual.fundos = { ...f, ...fundosDaPaleta(c.visual.paleta) };
  c.visual.alternar_fundos ??= true;
  c.visual.usar_fechamento ??= true;
  c.visual.largura ??= 1080;
  c.visual.altura ??= 1350;
  c.visual.template ??= "classico";
  c.visual.fonte ??= "Poppins";
  c.visual.rodape ??= { paginacao: true, pontos: true, texto_arraste: "ARRASTE →" };
  c.visual.imagens ??= { modo: "auto", estilo: "" };
  c.conteudo.limites ??= { titulo_max_caracteres: 110, subtitulo_max_caracteres: 220 };
  c.conteudo.angulos ??= [];
  c.conteudo.modelo_padrao ??= c.conteudo.estrutura?.length ? "proprio" : "auto";
  c.conteudo.cta = { palavra_chave: "", entrega: "", conversao: "", objetivo_padrao: "auto", ...c.conteudo.cta };
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

export function salvarReferencias(id, { instagram, youtube, perfil_cliente, periodo_dias, posts_por_perfil }) {
  const c = alterarConfig(id, (c) => {
    c.referencias = {
      ...c.referencias,
      instagram: semRepetir(instagram, normalizarInstagram),
      youtube: semRepetir(youtube, normalizarYoutube),
      periodo_dias: Number(periodo_dias) || c.referencias?.periodo_dias || 90,
      posts_por_perfil: Math.min(100, Number(posts_por_perfil) || c.referencias?.posts_por_perfil || 30),
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
        regras: String(v.imagens.regras ?? c.visual.imagens.regras ?? ""),
      };
    }
    if (v.assinatura !== undefined) c.visual.assinatura = v.assinatura;
    if (v.alternar_fundos !== undefined) c.visual.alternar_fundos = Boolean(v.alternar_fundos);
    if (v.usar_fechamento !== undefined) c.visual.usar_fechamento = Boolean(v.usar_fechamento);
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

// Banco de fotos reais do cliente (assets/fotos/), usadas pela IA para colocar a pessoa nas imagens.
const pastaFotos = (id) => path.join(PASTA_CLIENTES, id, "assets", "fotos");

export function listarFotos(id) {
  const pasta = pastaFotos(id);
  return fs.existsSync(pasta) ? fs.readdirSync(pasta).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort() : [];
}

export function caminhoFoto(id, nome) {
  if (!/^[\w.-]+$/.test(nome || "") || !listarFotos(id).includes(nome)) throw new Error("Foto não encontrada.");
  return path.join(pastaFotos(id), nome);
}

export function adicionarFoto(id, dataUrl) {
  lerConfig(id);
  return gravarDataUrl(dataUrl, pastaFotos(id), `foto-${Date.now()}`);
}

export function removerFoto(id, nome) {
  fs.rmSync(caminhoFoto(id, nome));
}

// Logo ou foto do cliente (PNG sem fundo), guardados em assets/.
export function salvarImagemCliente(id, campo, dataUrl) {
  if (!["logo", "foto_pessoa"].includes(campo)) throw new Error("Campo de imagem inválido.");
  alterarConfig(id, (c) => {
    c.visual[campo] = dataUrl ? `assets/${gravarDataUrl(dataUrl, path.join(PASTA_CLIENTES, id, "assets"), campo)}` : null;
  });
}

const OBJETIVOS = ["auto", "alcance", "autoridade", "lead", "conversao"];

export function salvarConteudo(id, { modelo_padrao, angulos, cta_legenda, proibir_travessao, cta }) {
  alterarConfig(id, (c) => {
    if (cta) {
      const atual = c.conteudo.cta || {};
      c.conteudo.cta = {
        palavra_chave: String(cta.palavra_chave ?? atual.palavra_chave ?? "").trim().toUpperCase(),
        entrega: String(cta.entrega ?? atual.entrega ?? "").trim(),
        conversao: String(cta.conversao ?? atual.conversao ?? "").trim(),
        objetivo_padrao: OBJETIVOS.includes(cta.objetivo_padrao) ? cta.objetivo_padrao : atual.objetivo_padrao || "auto",
      };
    }
    if (modelo_padrao) c.conteudo.modelo_padrao = modelo_padrao;
    if (Array.isArray(angulos)) c.conteudo.angulos = angulos.map((a) => a.trim()).filter(Boolean);
    if (cta_legenda !== undefined) c.conteudo.cta_legenda = cta_legenda;
    if (proibir_travessao !== undefined) c.conteudo.proibir_travessao = Boolean(proibir_travessao);
  });
}

export const salvarVoz = (id, texto) => escreverArquivo(id, "voz.md", texto);

// Conexão com o Instagram do cliente para publicar. Fica só no computador (clientes/ não vai para o Git).
export function salvarPublicacao(id, { ig_user_id, token, conta }) {
  alterarConfig(id, (c) => {
    c.publicacao = {
      ...c.publicacao,
      ...(ig_user_id !== undefined ? { ig_user_id: String(ig_user_id).trim() } : {}),
      ...(token ? { token: String(token).trim() } : {}),
      ...(conta !== undefined ? { conta } : {}),
    };
  });
}

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
