// Foto do perfil do Instagram do cliente, para identificar cada um no painel.
// Usa a API oficial quando o Instagram do cliente está conectado (grátis); senão, o Apify.
import fs from "node:fs";
import { carregarCliente, salvarFotoPerfil, marcarTentativaFoto, caminhoFotoPerfil } from "./cliente.js";
import { dadosDoPerfil } from "./publicar.js";
import { detalhesDoPerfil } from "./coleta/instagram.js";
import { comMedicao } from "./custos.js";

const emAndamento = new Set();

export const temFotoPerfil = (id) => fs.existsSync(caminhoFotoPerfil(id));

export async function atualizarFotoPerfil(id) {
  const c = carregarCliente(id);
  if (!c.instagram) throw new Error("Cadastre o Instagram do cliente primeiro.");
  const { ig_user_id: igUserId, token } = c.publicacao || {};
  let dados = null;
  if (igUserId && token) dados = await dadosDoPerfil({ igUserId, token }).catch(() => null);
  if (!dados?.foto && process.env.APIFY_TOKEN) {
    dados = await comMedicao(id, { tipo: "foto do perfil", descricao: c.instagram }, () => detalhesDoPerfil(c.instagram));
  }
  if (!dados?.foto) {
    throw new Error(process.env.APIFY_TOKEN || (igUserId && token)
      ? `Não encontrei a foto de ${c.instagram}. Confira se o @ está certo e se o perfil é público.`
      : "Para puxar a foto, conecte o Instagram do cliente ou preencha APIFY_TOKEN no .env.");
  }
  const resp = await fetch(dados.foto, { signal: AbortSignal.timeout(30_000) });
  if (!resp.ok) throw new Error(`Não consegui baixar a foto (${resp.status}).`);
  salvarFotoPerfil(id, Buffer.from(await resp.arrayBuffer()), { seguidores: dados.seguidores });
  return carregarCliente(id).perfil_instagram;
}

// Busca em segundo plano quando o cliente tem Instagram e ainda não tem foto.
// Tenta no máximo uma vez por dia, para não gastar Apify à toa.
export function buscarFotoSeFaltar(c) {
  if (!c.instagram || temFotoPerfil(c.id) || emAndamento.has(c.id)) return;
  if (!process.env.APIFY_TOKEN && !(c.publicacao?.ig_user_id && c.publicacao?.token)) return;
  const ultima = c.perfil_instagram?.tentativa_em;
  if (ultima && Date.now() - new Date(ultima).getTime() < 24 * 3600_000) return;
  emAndamento.add(c.id);
  marcarTentativaFoto(c.id);
  atualizarFotoPerfil(c.id)
    .catch((erro) => marcarTentativaFoto(c.id, erro.message))
    .finally(() => emAndamento.delete(c.id));
}
