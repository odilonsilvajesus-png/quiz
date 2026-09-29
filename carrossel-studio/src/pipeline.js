// Fluxo completo: referência ranqueada -> copy na voz do cliente -> PNGs com a identidade visual.
import fs from "node:fs";
import path from "node:path";
import { pastaSaida } from "./cliente.js";
import { coletar, ultimaColeta } from "./coleta/index.js";
import { ranquear } from "./ranking.js";
import { escreverCarrossel } from "./copy.js";
import { renderizar } from "./render.js";
import { resolverModelo } from "./modelos.js";
import { historico, salvarHistorico, aprendizados } from "./carrosseis.js";

export { historico };
import { temGeradorImagem, slidesComImagem, gerarImagem, emParalelo, resolverModo } from "./imagens.js";
import { listarEstilos } from "./render.js";

const slug = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

export async function referenciasRanqueadas(cliente, { recoletar = false, limite = 20, log } = {}) {
  const coleta = (!recoletar && ultimaColeta(cliente.id)) || (await coletar(cliente, { log }));
  return { ...coleta, posts: ranquear(coleta.posts, { limite }) };
}

export async function gerarCarrossel(cliente, referencia, opcoes = {}) {
  const { angulo, modelo: modeloId, estilo, indice = 0, log = console.log } = opcoes;
  const recentes = historico(cliente.id).slice(-10).map((h) => h.angulo);
  const modelo = resolverModelo(cliente, modeloId);
  const estiloFinal = estilo || cliente.visual.template || "classico";
  const infoEstilo = (await listarEstilos()).find((e) => e.id === estiloFinal);
  const modoImagens = resolverModo(opcoes.imagens || cliente.visual.imagens?.modo, infoEstilo);
  const estiloImagem = cliente.visual.imagens?.estilo || "";
  log(`Escrevendo carrossel (${modelo.nome}) a partir de ${referencia.perfil} (${referencia.ranking?.outlier ?? "-"}x)...`);
  const copy = await escreverCarrossel(cliente, referencia, {
    angulo, indice, modelo, angulosRecentes: recentes, rejeitados: aprendizados(cliente.id), comImagem: modoImagens !== "nenhuma", estiloImagem, estilo: infoEstilo,
  });
  // Cada slide guarda o próprio fundo, para re-renderizar igual mesmo se o modelo mudar depois.
  copy.slides = copy.slides.map((s, i) => ({ ...s, fundo: modelo.estrutura[i]?.fundo || "escuro" }));

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
    modelo: { id: modelo.id, nome: modelo.nome },
    estilo: estiloFinal,
    ...copy,
  };

  const carimbo = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const pasta = pastaSaida(cliente.id, "carrosseis", `${carimbo}-${slug(copy.angulo)}`);
  await gerarImagensDoCarrossel(cliente, carrossel, pasta, { modo: modoImagens, estilo: estiloImagem, direcaoEstilo: infoEstilo?.direcao_imagem, log });
  log(`Renderizando ${copy.slides.length} slides...`);
  const render = await renderizar(cliente, carrossel, pasta);

  const hist = historico(cliente.id);
  hist.push({
    data: carrossel.criado_em, angulo: copy.angulo, referencia: referencia.id, pasta: path.basename(pasta),
    demo: !!copy.demo, estado: "rascunho", modelo: modelo.nome, estilo: carrossel.estilo,
  });
  salvarHistorico(cliente.id, hist);

  return { carrossel, ...render };
}

// Gera as imagens dos slides escolhidos. Uma falha não derruba o carrossel: vira pendência.
async function gerarImagensDoCarrossel(cliente, carrossel, pasta, { modo, estilo, direcaoEstilo, log }) {
  // A IA devolve a descrição em "imagem"; o campo passa a guardar só o arquivo gerado.
  for (const s of carrossel.slides) {
    if (s.imagem) s.imagem_descricao = s.imagem;
    delete s.imagem;
  }
  const indices = slidesComImagem(modo, carrossel.slides.length);
  if (!indices.length) return;
  carrossel.pendencias ??= [];
  if (!temGeradorImagem()) {
    carrossel.pendencias.push("Imagens não geradas: preencha OPENAI_API_KEY no .env.");
    return;
  }
  log(`Gerando ${indices.length} imagem(ns) com IA...`);
  const gerar = (i, referencia) => {
    const s = carrossel.slides[i];
    const arquivo = `imagem-${String(i + 1).padStart(2, "0")}.jpg`;
    return gerarImagem({
      descricao: s.imagem_descricao || `${s.titulo.replace(/\*/g, "")}. ${s.subtitulo}`,
      direcao: carrossel.direcao_de_arte,
      direcaoEstilo,
      estilo,
      paleta: cliente.visual.paleta,
      referencia,
      destino: path.join(pasta, arquivo),
    }).then(() => arquivo);
  };
  // A primeira imagem sai sozinha e vira referência das outras: mesma personagem, cenário e luz.
  const [primeiro, ...resto] = indices;
  const inicial = await emParalelo([() => gerar(primeiro)]);
  const referencia = inicial[0].ok ? path.join(pasta, inicial[0].valor) : undefined;
  const tarefas = resto.map((i) => () => gerar(i, referencia));
  const resultados = [...inicial, ...(await emParalelo(tarefas))];
  resultados.forEach((r, k) => {
    if (r.ok) carrossel.slides[indices[k]].imagem = r.valor;
    else {
      carrossel.pendencias.push(`Imagem do slide ${indices[k] + 1} não gerada: ${r.erro.message}`);
    }
  });
}
