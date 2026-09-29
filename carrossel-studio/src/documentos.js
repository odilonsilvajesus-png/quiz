// Documentos do cliente (PDF, Word, TXT, MD): o texto é extraído e entra no contexto da IA.
// Ficam em clientes/<id>/documentos/ (fora do Git, como o resto do kit do cliente).
import fs from "node:fs";
import path from "node:path";
import { PASTA_CLIENTES } from "./cliente.js";

const LIMITE_CARACTERES = 60_000; // por documento, para não estourar o contexto

const pasta = (id) => path.join(PASTA_CLIENTES, id, "documentos");
const indice = (id) => path.join(pasta(id), "documentos.json");

export function listarDocumentos(id) {
  return fs.existsSync(indice(id)) ? JSON.parse(fs.readFileSync(indice(id), "utf8")) : [];
}

function salvarIndice(id, lista) {
  fs.mkdirSync(pasta(id), { recursive: true });
  fs.writeFileSync(indice(id), JSON.stringify(lista, null, 2));
}

export async function extrairTexto(nome, buffer) {
  const ext = path.extname(nome).toLowerCase();
  if ([".txt", ".md", ".markdown", ".csv"].includes(ext)) return buffer.toString("utf8");
  if (ext === ".pdf") {
    const { getDocumentProxy, extractText } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }
  if (ext === ".docx") {
    const mammoth = (await import("mammoth")).default;
    return (await mammoth.extractRawText({ buffer })).value;
  }
  throw new Error("Formato não suportado. Envie PDF, Word (.docx), TXT ou MD.");
}

// Guarda o texto de um documento. `substituirOrigem` troca o documento anterior da mesma origem (ex.: mapa da marca).
export function guardarTexto(id, { nome, texto, origem = "upload", substituirOrigem = false }) {
  const limpo = String(texto || "").replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
  if (!limpo) throw new Error(`Não encontrei texto em "${nome}". Se for um PDF escaneado (imagem), envie a versão com texto.`);
  let lista = listarDocumentos(id);
  if (substituirOrigem) {
    for (const d of lista.filter((x) => x.origem === origem)) fs.rmSync(path.join(pasta(id), `${d.id}.txt`), { force: true });
    lista = lista.filter((x) => x.origem !== origem);
  }
  const doc = {
    id: `doc-${Date.now()}`,
    nome,
    origem,
    caracteres: Math.min(limpo.length, LIMITE_CARACTERES),
    cortado: limpo.length > LIMITE_CARACTERES,
    criado_em: new Date().toISOString(),
  };
  fs.mkdirSync(pasta(id), { recursive: true });
  fs.writeFileSync(path.join(pasta(id), `${doc.id}.txt`), limpo.slice(0, LIMITE_CARACTERES));
  salvarIndice(id, [doc, ...lista]);
  return doc;
}

export async function adicionarDocumento(id, { nome, dataUrl }) {
  const base64 = String(dataUrl || "").split(",")[1];
  if (!base64) throw new Error("Arquivo inválido.");
  const texto = await extrairTexto(nome, Buffer.from(base64, "base64"));
  return guardarTexto(id, { nome, texto });
}

export function removerDocumento(id, docId) {
  if (!/^doc-\d+$/.test(docId)) throw new Error("Documento inválido.");
  fs.rmSync(path.join(pasta(id), `${docId}.txt`), { force: true });
  salvarIndice(id, listarDocumentos(id).filter((d) => d.id !== docId));
}

export function textosDosDocumentos(id) {
  return listarDocumentos(id)
    .map((d) => {
      const arq = path.join(pasta(id), `${d.id}.txt`);
      return fs.existsSync(arq) ? { nome: d.nome, texto: fs.readFileSync(arq, "utf8") } : null;
    })
    .filter(Boolean);
}
