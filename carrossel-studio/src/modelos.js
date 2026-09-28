// Biblioteca de modelos de carrossel (estrutura narrativa + fundo de cada slide), em modelos/*.json.
import fs from "node:fs";
import path from "node:path";
import { RAIZ } from "./cliente.js";

const PASTA_MODELOS = path.join(RAIZ, "modelos");

export function listarModelos() {
  return fs
    .readdirSync(PASTA_MODELOS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(PASTA_MODELOS, f), "utf8")))
    .sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99));
}

// Modelos disponíveis para um cliente: o próprio (se ele tiver estrutura definida) + a biblioteca.
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
  return lista;
}

export function resolverModelo(cliente, modeloId) {
  const lista = modelosDoCliente(cliente);
  const id = modeloId || cliente.conteudo.modelo_padrao;
  return lista.find((m) => m.id === id) || lista[0];
}
