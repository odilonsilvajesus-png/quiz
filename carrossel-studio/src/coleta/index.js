// Junta as fontes de coleta e decide quando usar o modo demonstração.
import fs from "node:fs";
import path from "node:path";
import { coletarCanal } from "./youtube.js";
import { coletarPerfis } from "./instagram.js";
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
      posts.push(...(await coletarPerfis(ref.instagram, { ...opcoes, limite: ref.posts_por_perfil || 30 })));
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
  if (!posts.length) {
    demo = true;
    avisos.push("Nenhum dado real coletado. Usando dados de DEMONSTRAÇÃO.");
    posts.push(...dadosDemo());
  }

  avisos.forEach((a) => log(`Aviso: ${a}`));
  const resultado = { coletado_em: new Date().toISOString(), demo, avisos, posts };
  fs.writeFileSync(path.join(pastaSaida(cliente.id), "coleta.json"), JSON.stringify(resultado, null, 2));
  return resultado;
}

export function ultimaColeta(clienteId) {
  const arquivo = path.join(pastaSaida(clienteId), "coleta.json");
  return fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, "utf8")) : null;
}
