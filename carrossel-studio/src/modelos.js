// Biblioteca de modelos de carrossel (estrutura narrativa + fundo de cada slide), em modelos/*.json.
// A Metodologia Viraliza vem primeiro e é o padrão. Os modelos "viral" são os que o modo Automático
// escolhe conforme o tipo do conteúdo.
import fs from "node:fs";
import path from "node:path";
import { RAIZ } from "./cliente.js";

const PASTA_MODELOS = path.join(RAIZ, "modelos");
export const MODELO_PADRAO = "metodologia";

export function listarModelos() {
  return fs
    .readdirSync(PASTA_MODELOS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(PASTA_MODELOS, f), "utf8")))
    .sort((a, b) => Number(Boolean(b.viral)) - Number(Boolean(a.viral)) || (a.ordem ?? 99) - (b.ordem ?? 99));
}

export const estruturasVirais = () => listarModelos().filter((m) => m.viral);

export const MODELO_AUTOMATICO = {
  id: "auto",
  nome: "Automático",
  descricao: "A IA escolhe a estrutura pelo tipo do conteúdo. Na dúvida, usa a Metodologia Viraliza.",
  automatico: true,
  estrutura: [],
};

// Modelos disponíveis para um cliente: a biblioteca (Metodologia Viraliza primeiro), o Automático e o próprio, se houver.
export function modelosDoCliente(cliente) {
  const lista = listarModelos();
  const posicao = lista.findIndex((m) => m.id === MODELO_PADRAO) + 1;
  lista.splice(posicao, 0, MODELO_AUTOMATICO);
  if (cliente.conteudo.estrutura?.length) {
    lista.push({
      id: "proprio",
      nome: `Modelo próprio de ${cliente.nome}`,
      descricao: "Estrutura definida para este cliente.",
      estrutura: cliente.conteudo.estrutura,
    });
  }
  return lista;
}

// Sem padrão escolhido: a Metodologia Viraliza.
export function resolverModelo(cliente, modeloId) {
  const lista = modelosDoCliente(cliente);
  const id = modeloId || cliente.conteudo.modelo_padrao || MODELO_PADRAO;
  return lista.find((m) => m.id === id) || lista.find((m) => m.id === MODELO_PADRAO);
}
