// Quanto cada coisa custou: carrosséis, coletas, tom de voz, sugestões e mapa da marca.
// Cada chamada paga (OpenAI, Claude, Apify) registra o próprio uso; `comMedicao` junta tudo o que
// aconteceu dentro de uma operação e grava em saida/<cliente>/custos.json, em dólar e em reais.
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { PASTA_SAIDA, pastaSaida } from "./cliente.js";

const medidor = new AsyncLocalStorage();

// Dólares por 1 milhão de tokens (tabelas oficiais da OpenAI e da Anthropic, set/2026).
// Modelo fora da lista: o custo aparece como "sem preço" em vez de um número inventado.
const PRECOS = {
  "gpt-5.5": { entrada: 5, cache: 0.5, saida: 30 },
  "gpt-5.4": { entrada: 2.5, cache: 0.25, saida: 15 },
  "gpt-5.4-mini": { entrada: 0.75, cache: 0.075, saida: 4.5 },
  "gpt-5.4-nano": { entrada: 0.2, cache: 0.02, saida: 1.25 },
  "gpt-5": { entrada: 1.25, cache: 0.125, saida: 10 },
  "gpt-5-mini": { entrada: 0.25, cache: 0.025, saida: 2 },
  "gpt-5-nano": { entrada: 0.05, cache: 0.005, saida: 0.4 },
  "gpt-4.1-mini": { entrada: 0.4, cache: 0.1, saida: 1.6 },
  "gpt-image-2": { texto: 5, texto_cache: 1.25, imagem: 8, imagem_cache: 2, saida: 30 },
  "gpt-image-1": { texto: 5, texto_cache: 1.25, imagem: 10, imagem_cache: 2.5, saida: 40 },
  // Transcrição: preço por minuto oficial; o preço por token de áudio é proporcional a ele.
  "gpt-4o-transcribe": { minuto: 0.006, audio: 6, texto: 2.5, saida: 10 },
  "gpt-4o-mini-transcribe": { minuto: 0.003, audio: 3, texto: 1.25, saida: 5 },
  "gpt-transcribe": { minuto: 0.0045, audio: 4.5, texto: 2.5, saida: 10 },
  "claude-opus-5-5": { entrada: 4, cache: 0.2, cache_escrita: 5, saida: 20 },
};

// "gpt-5.5-2026-04-01" → "gpt-5.5"
function precoDe(modelo = "") {
  const chave = Object.keys(PRECOS).sort((a, b) => b.length - a.length).find((k) => modelo === k || modelo.startsWith(`${k}-`));
  return chave ? PRECOS[chave] : null;
}

const M = 1_000_000;

// OpenAI Responses (texto e leitura de imagens).
export function custoTextoOpenAI(modelo, uso) {
  const p = precoDe(modelo);
  if (!p || !uso) return null;
  const cache = uso.input_tokens_details?.cached_tokens || 0;
  return ((uso.input_tokens - cache) * p.entrada + cache * p.cache + uso.output_tokens * p.saida) / M;
}

// Claude (Messages).
export function custoClaude(modelo, uso) {
  const p = precoDe(modelo);
  if (!p || !uso) return null;
  return (uso.input_tokens * p.entrada + (uso.cache_read_input_tokens || 0) * p.cache
    + (uso.cache_creation_input_tokens || 0) * p.cache_escrita + uso.output_tokens * p.saida) / M;
}

// Geração e edição de imagens (texto do prompt, imagens de referência e imagem gerada).
export function custoImagem(modelo, uso) {
  const p = precoDe(modelo);
  if (!p || !uso) return null;
  const d = uso.input_tokens_details || {};
  const imagem = d.image_tokens ?? 0;
  const texto = d.text_tokens ?? Math.max(0, (uso.input_tokens || 0) - imagem);
  return (texto * p.texto + imagem * p.imagem + (uso.output_tokens || 0) * p.saida) / M;
}

// Transcrição: cobrada por tokens de áudio ou por minuto, conforme o que a API devolver.
export function custoTranscricao(modelo, uso) {
  const p = precoDe(modelo);
  if (!p || !uso) return null;
  if (uso.type === "duration") return (uso.seconds / 60) * p.minuto;
  const d = uso.input_token_details || {};
  const audio = d.audio_tokens ?? uso.input_tokens ?? 0;
  return (audio * p.audio + (d.text_tokens || 0) * p.texto + (uso.output_tokens || 0) * p.saida) / M;
}

// Chamado por quem gasta. `usd` null = modelo sem preço conhecido.
export function registrarUso({ servico, modelo = "", usd }) {
  medidor.getStore()?.push({ servico, modelo, usd: usd ?? null });
}

// ---------- cotação do dólar ----------
const ARQUIVO_COTACAO = () => path.join(PASTA_SAIDA, "cotacao.json");
const IOF = () => Number(process.env.IOF_PERCENTUAL ?? 3.5); // compra internacional no cartão

// Dólar PTAX de venda do Banco Central (oficial). Se falhar, tenta a AwesomeAPI.
async function buscarCotacao() {
  const data = (d) => `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;
  const hoje = new Date();
  const inicio = new Date(hoje.getTime() - 10 * 86400_000); // cobre fins de semana e feriados
  const em = new Date().toISOString();
  try {
    const url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)"
      + `?@dataInicial='${data(inicio)}'&@dataFinalCotacao='${data(hoje)}'&$format=json&$orderby=dataHoraCotacao%20desc&$top=1`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const item = (await r.json()).value?.[0];
    if (item?.cotacaoVenda > 0) return { valor: item.cotacaoVenda, fonte: `PTAX do Banco Central de ${item.dataHoraCotacao.slice(8, 10)}/${item.dataHoraCotacao.slice(5, 7)}`, em };
  } catch {}
  const r = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL", { signal: AbortSignal.timeout(8000) });
  const valor = Number((await r.json()).USDBRL?.bid);
  if (!(valor > 0)) throw new Error("cotação indisponível");
  return { valor, fonte: "AwesomeAPI (dólar comercial)", em };
}

export async function cotacao() {
  const fixa = Number(process.env.COTACAO_DOLAR);
  if (fixa > 0) return { valor: fixa, fonte: "COTACAO_DOLAR no .env" };
  let salva = null;
  try { salva = JSON.parse(fs.readFileSync(ARQUIVO_COTACAO(), "utf8")); } catch {}
  if (salva && Date.now() - new Date(salva.em).getTime() < 6 * 3600_000) return salva;
  try {
    const nova = await buscarCotacao();
    fs.mkdirSync(PASTA_SAIDA, { recursive: true });
    fs.writeFileSync(ARQUIVO_COTACAO(), JSON.stringify(nova, null, 2));
    return nova;
  } catch {
    // Sem internet: usa a última cotação conhecida.
    return salva || { valor: 5.5, fonte: "valor padrão (sem internet; defina COTACAO_DOLAR no .env)" };
  }
}

// ---------- registro por cliente ----------
const arquivoCustos = (clienteId) => path.join(pastaSaida(clienteId), "custos.json");

export function custosDoCliente(clienteId) {
  try { return JSON.parse(fs.readFileSync(arquivoCustos(clienteId), "utf8")); } catch { return []; }
}

// Roda `fn` medindo tudo o que ela gastar. Grava mesmo se `fn` falhar (a API cobra do mesmo jeito).
// `pasta(resultado)` liga o custo ao carrossel gerado.
export async function comMedicao(clienteId, { tipo, descricao = "", pasta }, fn) {
  const itens = [];
  let resultado, erro;
  try {
    resultado = await medidor.run(itens, fn);
  } catch (e) {
    erro = e;
  }
  if (itens.length) {
    const agrupados = new Map();
    for (const i of itens) {
      const chave = `${i.servico}|${i.modelo}`;
      const g = agrupados.get(chave) || { servico: i.servico, modelo: i.modelo, vezes: 0, usd: 0, sem_preco: 0 };
      g.vezes++;
      if (i.usd == null) g.sem_preco++;
      else g.usd += i.usd;
      agrupados.set(chave, g);
    }
    const usd = [...agrupados.values()].reduce((t, g) => t + g.usd, 0);
    const { valor, fonte } = await cotacao();
    const brl = usd * valor * (1 + IOF() / 100);
    const lista = custosDoCliente(clienteId);
    lista.push({
      em: new Date().toISOString(), tipo, descricao, pasta: pasta && resultado !== undefined ? pasta(resultado) : undefined,
      falhou: erro ? erro.message : undefined, usd: +usd.toFixed(6), brl: +brl.toFixed(4),
      cotacao: valor, cotacao_fonte: fonte, iof: IOF(),
      itens: [...agrupados.values()].map((g) => ({ ...g, usd: +g.usd.toFixed(6) })),
    });
    fs.writeFileSync(arquivoCustos(clienteId), JSON.stringify(lista, null, 2));
  }
  if (erro) throw erro;
  return resultado;
}

// Total do mês (AAAA-MM) de um cliente, com as entradas do mês.
export function resumoDoMes(clienteId, mes = new Date().toISOString().slice(0, 7)) {
  const doMes = custosDoCliente(clienteId).filter((c) => c.em.slice(0, 7) === mes);
  const porTipo = {};
  for (const c of doMes) porTipo[c.tipo] = +((porTipo[c.tipo] || 0) + c.brl).toFixed(4);
  return {
    mes,
    brl: +doMes.reduce((t, c) => t + c.brl, 0).toFixed(4),
    usd: +doMes.reduce((t, c) => t + c.usd, 0).toFixed(6),
    por_tipo: porTipo,
    sem_preco: doMes.some((c) => c.itens.some((i) => i.sem_preco)),
    entradas: doMes.slice().reverse(),
  };
}

// Custo em reais de cada carrossel, pela pasta.
export function custoPorPasta(clienteId) {
  const mapa = {};
  for (const c of custosDoCliente(clienteId)) if (c.pasta) mapa[c.pasta] = +((mapa[c.pasta] || 0) + c.brl).toFixed(4);
  return mapa;
}
