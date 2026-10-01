// Fluxo completo: referência ranqueada -> copy na voz do cliente -> PNGs com a identidade visual.
import fs from "node:fs";
import path from "node:path";
import { pastaSaida, caminhoFoto } from "./cliente.js";
import { coletar, ultimaColeta, salvarColeta } from "./coleta/index.js";
import { aprofundar } from "./analise.js";
import { ranquear } from "./ranking.js";
import { escreverCarrossel, escolherEstrutura } from "./copy.js";
import { revisarCarrossel } from "./revisor.js";
import { renderizar } from "./render.js";
import { resolverModelo } from "./modelos.js";
import { historico, salvarHistorico, aprendizados } from "./carrosseis.js";
import { comMedicao } from "./custos.js";

export { historico };
import { temGeradorImagem, slidesComImagem, gerarImagem, emParalelo, resolverModo } from "./imagens.js";
import { listarEstilos } from "./render.js";

const slug = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

const LIMITE_IDEIAS = 60;

// Coleta de novo e analisa o conteúdo real dos melhores posts (fala dos reels, texto dos slides).
export function atualizarColeta(cliente, opcoes = {}) {
  return comMedicao(cliente.id, { tipo: "coleta", descricao: "Coleta das referências" }, () => coletarEAnalisar(cliente, opcoes));
}

async function coletarEAnalisar(cliente, { log = () => {} } = {}) {
  const coleta = await coletar(cliente, { log });
  const posts = ranquear(coleta.posts, { limite: LIMITE_IDEIAS });
  if (await aprofundar(posts, { log })) {
    const porId = new Map(posts.map((p) => [p.id, p.analise]));
    for (const p of coleta.posts) if (porId.get(p.id)) p.analise = porId.get(p.id);
    salvarColeta(cliente.id, coleta);
  }
  return coleta;
}

// Ideias ranqueadas da última coleta. Só coleta se ainda não houver nenhuma (ou se pedirem).
export async function referenciasRanqueadas(cliente, { recoletar = false, limite = LIMITE_IDEIAS, log = () => {} } = {}) {
  const coleta = (!recoletar && ultimaColeta(cliente.id)) || (await atualizarColeta(cliente, { log }));
  return { ...coleta, posts: ranquear(coleta.posts, { limite }) };
}

// O custo (texto + imagens) fica ligado à pasta do carrossel.
export function gerarCarrossel(cliente, referencia, opcoes = {}) {
  return comMedicao(cliente.id, {
    tipo: "carrossel", descricao: `A partir de ${referencia.perfil || "sugestão"}`, pasta: (r) => path.basename(r.pasta),
  }, () => montarCarrossel(cliente, referencia, opcoes));
}

async function montarCarrossel(cliente, referencia, opcoes) {
  const { angulo, modelo: modeloId, estilo, indice = 0, log = console.log } = opcoes;
  const recentes = historico(cliente.id).slice(-10).map((h) => h.angulo);
  const observacao = (opcoes.observacao || "").trim();
  let modelo = resolverModelo(cliente, modeloId);
  let motivoEstrutura;
  if (modelo.automatico) {
    log("Escolhendo a estrutura pelo tipo do conteúdo...");
    ({ modelo, motivo: motivoEstrutura } = await escolherEstrutura(cliente, referencia, { observacao }));
  }
  // Objetivo automático: com palavra-chave, o final pede o comentário (gera interessados); senão, o próximo passo comercial.
  const ctaCliente = cliente.conteudo.cta || {};
  let objetivoEscolhido = opcoes.objetivo || ctaCliente.objetivo_padrao || "auto";
  if (objetivoEscolhido === "auto" && ctaCliente.palavra_chave) objetivoEscolhido = "lead";
  else if (objetivoEscolhido === "auto" && ctaCliente.conversao) objetivoEscolhido = "conversao";
  const objetivo = objetivoEscolhido === "auto" ? undefined : objetivoEscolhido;
  const estiloFinal = estilo || cliente.visual.template || "classico";
  const infoEstilo = (await listarEstilos()).find((e) => e.id === estiloFinal);
  const modoImagens = resolverModo(opcoes.imagens || cliente.visual.imagens?.modo, infoEstilo);
  const estiloImagem = cliente.visual.imagens?.estilo || "";
  const obsImagem = (opcoes.obsImagem || "").trim();
  // Foto real do cliente como protagonista das imagens (opcional).
  const fotoPessoa = opcoes.fotoPessoa ? caminhoFoto(cliente.id, opcoes.fotoPessoa) : null;
  log(`Escrevendo carrossel (${modelo.nome}) a partir de ${referencia.perfil} (${referencia.ranking?.outlier ?? "-"}x)...`);
  const opcoesCopy = {
    angulo, indice, modelo, angulosRecentes: recentes, rejeitados: aprendizados(cliente.id), comImagem: modoImagens !== "nenhuma",
    estiloImagem, estilo: infoEstilo, obsImagem, comPessoa: Boolean(fotoPessoa), observacao, objetivo,
  };
  let copy = await escreverCarrossel(cliente, referencia, opcoesCopy);
  const revisao = copy.demo ? null : await revisarComReescrita(cliente, referencia, copy, modelo, opcoesCopy, log);
  if (revisao?.copy) copy = revisao.copy;
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
    modelo: { id: modelo.id, nome: modelo.nome, ...(motivoEstrutura ? { automatico: true, motivo: motivoEstrutura } : {}) },
    objetivo: objetivoEscolhido,
    estilo: estiloFinal,
    ...copy,
    ...(revisao ? { revisao: revisao.resultado } : {}),
  };

  const carimbo = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const pasta = pastaSaida(cliente.id, "carrosseis", `${carimbo}-${slug(copy.angulo)}`);
  if (obsImagem) carrossel.observacao_imagens = obsImagem;
  await gerarImagensDoCarrossel(cliente, carrossel, pasta, {
    modo: modoImagens, estilo: estiloImagem, direcaoEstilo: infoEstilo?.direcao_imagem, horizontal: infoEstilo?.formato_imagem === "horizontal", fotoPessoa, obsImagem, log,
  });
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

// Revisor sempre ligado: se o carrossel não passar, reescreve uma vez com os ajustes e revisa de novo.
// Uma falha do revisor nunca derruba o carrossel.
async function revisarComReescrita(cliente, referencia, copy, modelo, opcoesCopy, log) {
  try {
    log("Revisando o carrossel...");
    const primeira = await revisarCarrossel(cliente, copy, modelo, opcoesCopy);
    if (primeira.aprovado) return { resultado: { ...primeira, rodadas: 1 } };
    log(`Nota ${primeira.media}: reescrevendo o que o revisor apontou...`);
    const nova = await escreverCarrossel(cliente, referencia, {
      ...opcoesCopy, revisao: { anterior: copy, ajustes: primeira.ajustes, bloqueios: primeira.bloqueios },
    });
    const segunda = await revisarCarrossel(cliente, nova, modelo, opcoesCopy);
    return {
      copy: nova,
      resultado: { ...segunda, rodadas: 2, antes: { media: primeira.media, notas: primeira.notas, ajustes: primeira.ajustes, bloqueios: primeira.bloqueios } },
    };
  } catch (erro) {
    return { resultado: { erro: `A revisão não rodou: ${erro.message}` } };
  }
}

// Gera as imagens dos slides escolhidos. Uma falha não derruba o carrossel: vira pendência.
async function gerarImagensDoCarrossel(cliente, carrossel, pasta, { modo, estilo, direcaoEstilo, horizontal, fotoPessoa, obsImagem, log }) {
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
      horizontal,
      estilo,
      paleta: cliente.visual.paleta,
      referencia,
      fotoPessoa,
      regras: cliente.visual.imagens?.regras,
      observacao: obsImagem,
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
