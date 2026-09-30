// Biblioteca de modelos de carrossel (estrutura narrativa + fundo de cada slide), em modelos/*.json.
// Os modelos "viral" (Ensino, Narrativa, Sequência, Contraponto, Identificação) vêm primeiro e são
// os que o modo Automático escolhe conforme o tipo do conteúdo.
import fs from "node:fs";
import path from "node:path";
import { RAIZ } from "./cliente.js";

const PASTA_MODELOS = path.join(RAIZ, "modelos");

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
  descricao: "A IA escolhe a estrutura pelo tipo do conteúdo, preferindo os formatos práticos (Lista prática, Errado x Certo). N3 para mudar a visão do público sobre um problema; as outras quando o conteúdo é claramente daquele tipo.",
  automatico: true,
  estrutura: [],
};

// Modelos disponíveis para um cliente: Automático, o próprio (se tiver estrutura definida) e a biblioteca.
export function modelosDoCliente(cliente) {
  const lista = listarModelos();
  if (cliente.conteudo.estrutura?.length) {
    lista.unshift({
      id: "proprio",
      nome: `Modelo próprio de ${cliente.nome}`,
      descricao: "Estrutura definida para este cliente.",
      estrutura: cliente.conteudo.estrutura,
    });
  }
  lista.unshift(MODELO_AUTOMATICO);
  return lista;
}

// Sem padrão escolhido: o modelo próprio do cliente, se existir; senão, o Automático.
export function resolverModelo(cliente, modeloId) {
  const lista = modelosDoCliente(cliente);
  const id = modeloId || cliente.conteudo.modelo_padrao || (cliente.conteudo.estrutura?.length ? "proprio" : "auto");
  return lista.find((m) => m.id === id) || MODELO_AUTOMATICO;
}
