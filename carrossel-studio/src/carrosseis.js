// Ciclo de vida dos carrosséis gerados: rascunho → postado, ou descartado (com motivo).
// Tudo fica em saida/<cliente>/historico.json, junto do registro de geração.
import fs from "node:fs";
import path from "node:path";
import { PASTA_SAIDA, pastaSaida } from "./cliente.js";

export const ESTADOS = ["rascunho", "agendado", "postado", "descartado"];

const arquivoHistorico = (clienteId) => path.join(pastaSaida(clienteId), "historico.json");

export function historico(clienteId) {
  const arq = arquivoHistorico(clienteId);
  const lista = fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, "utf8")) : [];
  return lista.map((h) => ({ estado: "rascunho", ...h }));
}

export function salvarHistorico(clienteId, lista) {
  fs.writeFileSync(arquivoHistorico(clienteId), JSON.stringify(lista, null, 2));
}

export function pastaCarrossel(clienteId, nome) {
  if (!/^[\w.-]+$/.test(nome || "")) throw new Error("Carrossel inválido.");
  return path.join(PASTA_SAIDA, clienteId, "carrosseis", nome);
}

// Atualiza um registro do histórico (ex.: estado, motivo, link do post).
export function atualizar(clienteId, nomePasta, alteracoes) {
  const lista = historico(clienteId);
  const item = lista.find((h) => h.pasta === nomePasta);
  if (!item) throw new Error("Carrossel não encontrado.");
  Object.assign(item, alteracoes);
  salvarHistorico(clienteId, lista);
  return item;
}

export function descartar(clienteId, nomePasta, motivo) {
  if (!String(motivo || "").trim()) throw new Error("Conte o motivo do descarte. É ele que ensina a IA.");
  return atualizar(clienteId, nomePasta, { estado: "descartado", motivo: motivo.trim(), descartado_em: new Date().toISOString() });
}

export const restaurar = (clienteId, nomePasta) =>
  atualizar(clienteId, nomePasta, { estado: "rascunho", motivo: undefined, descartado_em: undefined });

export const marcarPostado = (clienteId, nomePasta, { permalink = "", id = "" } = {}) =>
  atualizar(clienteId, nomePasta, {
    estado: "postado", postado_em: new Date().toISOString(), permalink, instagram_id: id, falhou: undefined, publicando: undefined,
  });

// Agenda a publicação. O painel precisa estar rodando no horário marcado para publicar.
export function agendar(clienteId, nomePasta, quando) {
  const data = new Date(quando);
  if (Number.isNaN(data.getTime())) throw new Error("Escolha a data e a hora da publicação.");
  if (data.getTime() < Date.now() - 60_000) throw new Error("Escolha um horário no futuro.");
  return atualizar(clienteId, nomePasta, { estado: "agendado", agendado_para: data.toISOString(), falhou: undefined, publicando: undefined });
}

export const cancelarAgendamento = (clienteId, nomePasta) =>
  atualizar(clienteId, nomePasta, { estado: "rascunho", agendado_para: undefined, falhou: undefined, publicando: undefined });

// Agendamentos que já passaram do horário e ainda não foram tentados.
export const agendamentosVencidos = (clienteId) =>
  historico(clienteId).filter((h) => h.estado === "agendado" && !h.falhou && !h.publicando && new Date(h.agendado_para) <= new Date());

// Motivos de descarte recentes, usados no prompt para a IA não repetir os mesmos erros.
export function aprendizados(clienteId, limite = 15) {
  return historico(clienteId)
    .filter((h) => h.estado === "descartado" && h.motivo)
    .slice(-limite)
    .map((h) => ({ angulo: h.angulo, estilo: h.estilo, modelo: h.modelo, motivo: h.motivo }));
}

export function listar(clienteId) {
  return historico(clienteId)
    .slice()
    .reverse()
    .map((h) => {
      const pasta = pastaCarrossel(clienteId, h.pasta);
      if (!fs.existsSync(path.join(pasta, "carrossel.json"))) return null;
      const carrossel = JSON.parse(fs.readFileSync(path.join(pasta, "carrossel.json"), "utf8"));
      const imagens = fs.readdirSync(pasta).filter((f) => /^slide-\d+\.png$/.test(f)).sort();
      // ?v= muda quando o slide é renderizado de novo, para o navegador não mostrar a versão antiga.
      const versao = (f) => Math.round(fs.statSync(path.join(pasta, f)).mtimeMs);
      return { ...h, carrossel, imagens: imagens.map((f) => `/saida/${clienteId}/carrosseis/${h.pasta}/${f}?v=${versao(f)}`) };
    })
    .filter(Boolean);
}

export function contagem(clienteId) {
  const n = { rascunho: 0, agendado: 0, postado: 0, descartado: 0 };
  for (const h of historico(clienteId)) n[h.estado] = (n[h.estado] || 0) + 1;
  return n;
}
