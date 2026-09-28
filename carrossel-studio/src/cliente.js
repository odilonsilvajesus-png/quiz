// Carrega o "Kit do Cliente": tudo que muda de um cliente para outro mora em clientes/<id>/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PASTA_CLIENTES = path.join(RAIZ, "clientes");
export const PASTA_SAIDA = path.join(RAIZ, "saida");

export function listarClientes() {
  return fs
    .readdirSync(PASTA_CLIENTES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => carregarCliente(d.name));
}

export function carregarCliente(id) {
  const pasta = path.join(PASTA_CLIENTES, id);
  const arquivo = path.join(pasta, "cliente.json");
  if (!fs.existsSync(arquivo)) {
    throw new Error(`Cliente "${id}" não encontrado em ${pasta}`);
  }
  const config = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  const ler = (nome) => {
    if (!nome) return "";
    const p = path.join(pasta, nome);
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
  };
  const exemplosTxt = ler(config.exemplos);
  return {
    ...config,
    id,
    pasta,
    baseConhecimento: ler(config.base_conhecimento),
    voz: ler("voz.md"),
    exemplosCarrossel: exemplosTxt ? JSON.parse(exemplosTxt) : [],
  };
}

export function pastaSaida(clienteId, ...partes) {
  const p = path.join(PASTA_SAIDA, clienteId, ...partes);
  fs.mkdirSync(p, { recursive: true });
  return p;
}

export function criarCliente(id, nome) {
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw new Error("Use só letras minúsculas, números e hífen no id (ex.: maria-nutri).");
  }
  const destino = path.join(PASTA_CLIENTES, id);
  if (fs.existsSync(destino)) throw new Error(`Já existe um cliente "${id}".`);
  fs.cpSync(path.join(PASTA_CLIENTES, "_modelo"), destino, { recursive: true });
  const arquivo = path.join(destino, "cliente.json");
  const config = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  config.id = id;
  config.nome = nome || id;
  fs.writeFileSync(arquivo, JSON.stringify(config, null, 2) + "\n");
  return destino;
}

// "@Perfil", "perfil" ou "https://instagram.com/perfil/" viram "@perfil".
function normalizarInstagram(ref) {
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

// Atualiza só as referências no cliente.json, preservando o resto do arquivo.
export function salvarReferencias(id, { instagram, youtube, perfil_cliente, periodo_dias }) {
  const arquivo = path.join(PASTA_CLIENTES, id, "cliente.json");
  const config = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  config.referencias = {
    ...config.referencias,
    instagram: semRepetir(instagram, normalizarInstagram),
    youtube: semRepetir(youtube, normalizarYoutube),
    periodo_dias: Number(periodo_dias) || config.referencias?.periodo_dias || 90,
  };
  if (perfil_cliente !== undefined) config.instagram = perfil_cliente ? normalizarInstagram(perfil_cliente) : "";
  fs.writeFileSync(arquivo, JSON.stringify(config, null, 2) + "\n");
  return { instagram: config.instagram, referencias: config.referencias };
}
