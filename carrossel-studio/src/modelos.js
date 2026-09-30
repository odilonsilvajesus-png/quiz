// A estrutura dos carrosséis: uma metodologia única (modelos/metodologia.json).
// Os modelos antigos ficam guardados em modelos/arquivo/ e não aparecem mais no painel.
import fs from "node:fs";
import path from "node:path";
import { RAIZ } from "./cliente.js";

const ARQUIVO_METODOLOGIA = path.join(RAIZ, "modelos", "metodologia.json");

export const metodologia = () => JSON.parse(fs.readFileSync(ARQUIVO_METODOLOGIA, "utf8"));

export const listarModelos = () => [metodologia()];
export const modelosDoCliente = () => listarModelos();

// Todo carrossel usa a metodologia, qualquer que seja o modelo pedido (inclusive de clientes antigos).
export const resolverModelo = () => metodologia();
