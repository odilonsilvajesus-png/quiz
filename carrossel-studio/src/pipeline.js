// Fluxo completo: referência ranqueada -> copy na voz do cliente -> PNGs com a identidade visual.
import fs from "node:fs";
import path from "node:path";
import { pastaSaida } from "./cliente.js";
import { coletar, ultimaColeta } from "./coleta/index.js";
import { ranquear } from "./ranking.js";
import { escreverCarrossel } from "./copy.js";
import { renderizar } from "./render.js";

const slug = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

function arquivoHistorico(clienteId) {
  return path.join(pastaSaida(clienteId), "historico.json");
}

export function historico(clienteId) {
  const arq = arquivoHistorico(clienteId);
  return fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, "utf8")) : [];
}

export async function referenciasRanqueadas(cliente, { recoletar = false, limite = 20, log } = {}) {
  const coleta = (!recoletar && ultimaColeta(cliente.id)) || (await coletar(cliente, { log }));
  return { ...coleta, posts: ranquear(coleta.posts, { limite }) };
}

export async function gerarCarrossel(cliente, referencia, { angulo, indice = 0, log = console.log } = {}) {
  const recentes = historico(cliente.id).slice(-10).map((h) => h.angulo);
  log(`Escrevendo carrossel a partir de ${referencia.perfil} (${referencia.ranking?.outlier ?? "-"}x)...`);
  const copy = await escreverCarrossel(cliente, referencia, { angulo, indice, angulosRecentes: recentes });

  const carrossel = {
    cliente: cliente.id,
    criado_em: new Date().toISOString(),
    referencia: {
      id: referencia.id,
      perfil: referencia.perfil,
      url: referencia.url,
      trecho: referencia.texto.slice(0, 300),
      outlier: referencia.ranking?.outlier ?? null,
    },
    ...copy,
  };

  const carimbo = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const pasta = pastaSaida(cliente.id, "carrosseis", `${carimbo}-${slug(copy.angulo)}`);
  log(`Renderizando ${copy.slides.length} slides...`);
  const render = await renderizar(cliente, carrossel, pasta);

  const hist = historico(cliente.id);
  hist.push({ data: carrossel.criado_em, angulo: copy.angulo, referencia: referencia.id, pasta: path.basename(pasta), demo: !!copy.demo });
  fs.writeFileSync(arquivoHistorico(cliente.id), JSON.stringify(hist, null, 2));

  return { carrossel, ...render };
}
