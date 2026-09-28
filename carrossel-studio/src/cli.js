#!/usr/bin/env node
// Linha de comando: npm run coletar -- camila | npm run gerar -- camila --top 3 | ...
import fs from "node:fs";
import path from "node:path";
import { RAIZ, carregarCliente, criarCliente } from "./cliente.js";
import { referenciasRanqueadas, gerarCarrossel } from "./pipeline.js";
import { renderizar } from "./render.js";
import { coletarLegendas } from "./coleta/instagram.js";
import { descreverVoz } from "./copy.js";

if (fs.existsSync(path.join(RAIZ, ".env"))) process.loadEnvFile(path.join(RAIZ, ".env"));

const [comando, ...resto] = process.argv.slice(2);
const flags = {};
const posicionais = [];
for (let i = 0; i < resto.length; i++) {
  if (resto[i].startsWith("--")) flags[resto[i].slice(2)] = resto[i + 1]?.startsWith("--") ? true : resto[++i] ?? true;
  else posicionais.push(resto[i]);
}

function tabela(posts) {
  console.log("\n #  | outlier | plataforma | perfil                      | conteúdo");
  console.log("----+---------+------------+-----------------------------+---------------------------------------");
  posts.forEach((p, i) =>
    console.log(
      `${String(i + 1).padStart(3)} | ${String(p.ranking.outlier + "x").padStart(7)} | ${p.plataforma.padEnd(10)} | ${p.perfil.slice(0, 27).padEnd(27)} | ${p.titulo.slice(0, 60)}`,
    ),
  );
  console.log("");
}

const comandos = {
  async coletar() {
    const cliente = carregarCliente(posicionais[0]);
    const r = await referenciasRanqueadas(cliente, { recoletar: true });
    if (r.demo) console.log("\n>>> MODO DEMONSTRAÇÃO: dados fictícios. Cadastre referências e chaves de API para dados reais.");
    tabela(r.posts);
  },

  async gerar() {
    const cliente = carregarCliente(posicionais[0]);
    const r = await referenciasRanqueadas(cliente, { recoletar: Boolean(flags.recoletar) });
    let escolhidas;
    if (flags.ref) {
      escolhidas = [r.posts[Number(flags.ref) - 1]].filter(Boolean);
      if (!escolhidas.length) throw new Error(`Referência #${flags.ref} não existe. Rode "npm run coletar" para ver a lista.`);
    } else {
      escolhidas = r.posts.slice(0, Number(flags.top || 3));
    }
    for (const [i, ref] of escolhidas.entries()) {
      const res = await gerarCarrossel(cliente, ref, { angulo: flags.angulo, indice: i });
      console.log(`\nOK: ${res.carrossel.angulo}\n    ${res.pasta}\n`);
    }
  },

  // Re-renderiza um carrossel.json editado à mão (ajuste de texto sem gastar IA).
  async renderizar() {
    const arq = path.resolve(posicionais[0]);
    const carrossel = JSON.parse(fs.readFileSync(arq, "utf8"));
    const cliente = carregarCliente(carrossel.cliente);
    const res = await renderizar(cliente, carrossel, path.dirname(arq));
    console.log(`OK: ${res.imagens.length} slides em ${res.pasta}`);
  },

  async "novo-cliente"() {
    const [id, ...nome] = posicionais;
    const pasta = criarCliente(id, nome.join(" "));
    console.log(`Cliente criado em ${pasta}\nPreencha cliente.json e base-conhecimento.md.`);
  },

  async "gerar-voz"() {
    const cliente = carregarCliente(posicionais[0]);
    if (!cliente.instagram) throw new Error('Preencha "instagram" no cliente.json primeiro.');
    console.log(`Coletando legendas de ${cliente.instagram}...`);
    const legendas = await coletarLegendas(cliente.instagram);
    if (legendas.length < 5) throw new Error(`Só encontrei ${legendas.length} legendas longas. Preciso de pelo menos 5.`);
    const voz = await descreverVoz(cliente, legendas);
    fs.writeFileSync(path.join(cliente.pasta, "voz.md"), voz);
    console.log(`Voz salva em ${path.join(cliente.pasta, "voz.md")}. Revise antes de usar.`);
  },
};

if (!comandos[comando]) {
  console.log(`Comandos:
  coletar <cliente>                         coleta e ranqueia as referências
  gerar <cliente> [--top 3] [--ref N] [--angulo "..."] [--recoletar]
  renderizar <caminho/carrossel.json>       re-renderiza depois de editar o texto
  novo-cliente <id> <Nome>                  cria a pasta de um cliente novo
  gerar-voz <cliente>                       cria voz.md a partir do Instagram do cliente`);
  process.exit(comando ? 1 : 0);
}

comandos[comando]().catch((erro) => {
  console.error(`\nErro: ${erro.message}`);
  process.exit(1);
});
