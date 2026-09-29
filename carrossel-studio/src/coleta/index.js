// Junta as fontes de coleta e decide quando usar o modo demonstração.
import fs from "node:fs";
import path from "node:path";
import { coletarCanal } from "./youtube.js";
import { coletarPerfis, normalizarHandle } from "./instagram.js";
import { dadosDemo } from "./demo.js";
import { pastaSaida } from "../cliente.js";

export async function coletar(cliente, { log = console.log } = {}) {
  const ref = cliente.referencias || {};
  const opcoes = { periodoDias: ref.periodo_dias || 90 };
  const posts = [];
  const avisos = [];

  if (ref.instagram?.length) {
    if (process.env.APIFY_TOKEN) {
      log(`Instagram: coletando ${ref.instagram.length} perfil(is)...`);
      try {
        const doInstagram = await coletarPerfis(ref.instagram, { ...opcoes, limite: ref.posts_por_perfil || 30, log });
        posts.push(...doInstagram);
        for (const h of ref.instagram.map(normalizarHandle)) {
          const n = doInstagram.filter((p) => p.perfil.toLowerCase() === `@${h}`.toLowerCase()).length;
          if (!n) avisos.push(`@${h}: nenhum post nos últimos ${opcoes.periodoDias} dias (perfil privado, nome errado ou sem posts no período).`);
        }
      } catch (erro) {
        avisos.push(`Instagram: ${erro.message}`);
      }
    } else {
      avisos.push("APIFY_TOKEN não configurado: perfis do Instagram ignorados.");
    }
  }

  if (ref.youtube?.length) {
    if (process.env.YOUTUBE_API_KEY) {
      for (const canal of ref.youtube) {
        log(`YouTube: coletando ${canal}...`);
        try {
          posts.push(...(await coletarCanal(canal, { ...opcoes, limite: ref.videos_por_canal || 30 })));
        } catch (erro) {
          avisos.push(`YouTube ${canal}: ${erro.message}`);
        }
      }
    } else {
      avisos.push("YOUTUBE_API_KEY não configurada: canais do YouTube ignorados.");
    }
  }

  let demo = false;
  // Se a coleta real falhou, mantém a anterior em vez de trocar por dados de demonstração.
  const anterior = ultimaColeta(cliente.id);
  if (!posts.length && avisos.some((a) => !a.includes("não configurad")) && anterior?.posts?.length && !anterior.demo) {
    throw new Error(`A coleta não trouxe nenhum post. ${avisos.join(" ")} As ideias anteriores foram mantidas.`);
  }
  if (!posts.length) {
    demo = true;
    avisos.push("Nenhum dado real coletado. Usando dados de DEMONSTRAÇÃO.");
    posts.push(...dadosDemo());
  }

  avisos.forEach((a) => log(`Aviso: ${a}`));
  const por_perfil = {};
  for (const p of posts) por_perfil[p.perfil] = (por_perfil[p.perfil] || 0) + 1;
  const resultado = { coletado_em: new Date().toISOString(), demo, avisos, por_perfil, periodo_dias: opcoes.periodoDias, posts };
  fs.writeFileSync(path.join(pastaSaida(cliente.id), "coleta.json"), JSON.stringify(resultado, null, 2));
  return resultado;
}

export function salvarColeta(clienteId, coleta) {
  fs.writeFileSync(path.join(pastaSaida(clienteId), "coleta.json"), JSON.stringify(coleta, null, 2));
}

export function ultimaColeta(clienteId) {
  const arquivo = path.join(pastaSaida(clienteId), "coleta.json");
  return fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, "utf8")) : null;
}
