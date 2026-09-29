// Números do dashboard: produção, publicação, qualidade e gasto, do mês e dos últimos 30 dias.
import fs from "node:fs";
import path from "node:path";
import { listarClientes } from "./cliente.js";
import { historico, pastaCarrossel } from "./carrosseis.js";
import { custosDoCliente } from "./custos.js";

// Datas no fuso do computador (AAAA-MM-DD), para o "hoje" bater com o de quem usa.
const dia = (iso) => new Date(iso).toLocaleDateString("sv-SE");
const DIAS = 30;

function ultimosDias() {
  const hoje = new Date();
  return Array.from({ length: DIAS }, (_, i) => dia(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - (DIAS - 1 - i))));
}

function lerCarrossel(clienteId, pasta) {
  try {
    return JSON.parse(fs.readFileSync(path.join(pastaCarrossel(clienteId, pasta), "carrossel.json"), "utf8"));
  } catch {
    return null;
  }
}

const media = (lista) => (lista.length ? +(lista.reduce((t, v) => t + v, 0) / lista.length).toFixed(1) : null);

export function painelGeral() {
  const mes = dia(new Date()).slice(0, 7);
  const dias = ultimosDias();
  const porDia = Object.fromEntries(dias.map((d) => [d, { criados: 0, postados: 0, gasto: 0 }]));
  const estruturas = {};
  const agendados = [];
  const descartes = [];
  const notasGerais = [];
  const custosCarrosselMes = [];

  const clientes = listarClientes().map((c) => {
    const hist = historico(c.id);
    const doMes = hist.filter((h) => h.data && dia(h.data).startsWith(mes));
    const notas = [];
    for (const h of hist) {
      if (h.data && porDia[dia(h.data)]) porDia[dia(h.data)].criados++;
      if (h.postado_em && porDia[dia(h.postado_em)]) porDia[dia(h.postado_em)].postados++;
      if (h.estado === "agendado") {
        agendados.push({ cliente: c.nome, cliente_id: c.id, angulo: h.angulo, quando: h.agendado_para, falhou: h.falhou || null });
      }
      if (h.estado === "descartado" && h.motivo) {
        descartes.push({ cliente: c.nome, cliente_id: c.id, angulo: h.angulo, motivo: h.motivo, quando: h.descartado_em || h.data });
      }
    }
    for (const h of doMes) {
      if (h.modelo) estruturas[h.modelo] = (estruturas[h.modelo] || 0) + 1;
      const k = lerCarrossel(c.id, h.pasta);
      if (k?.revisao?.media != null) notas.push(k.revisao.media);
    }
    notasGerais.push(...notas);

    const custos = custosDoCliente(c.id);
    for (const e of custos) if (porDia[dia(e.em)]) porDia[dia(e.em)].gasto += e.brl;
    const custosMes = custos.filter((e) => dia(e.em).startsWith(mes));
    const carrosseisMes = custosMes.filter((e) => e.tipo === "carrossel");
    custosCarrosselMes.push(...carrosseisMes.map((e) => e.brl));

    return {
      id: c.id,
      nome: c.nome,
      instagram: c.instagram || "",
      criados_mes: doMes.length,
      postados_mes: hist.filter((h) => h.postado_em && dia(h.postado_em).startsWith(mes)).length,
      rascunhos: hist.filter((h) => h.estado === "rascunho").length,
      agendados: hist.filter((h) => h.estado === "agendado").length,
      descartados_mes: doMes.filter((h) => h.estado === "descartado").length,
      nota_media: media(notas),
      gasto_mes: +custosMes.reduce((t, e) => t + e.brl, 0).toFixed(4),
      custo_medio_carrossel: carrosseisMes.length ? +(carrosseisMes.reduce((t, e) => t + e.brl, 0) / carrosseisMes.length).toFixed(4) : null,
      ultimo_post: hist.filter((h) => h.postado_em).map((h) => h.postado_em).sort().at(-1) || null,
    };
  });

  const soma = (campo) => clientes.reduce((t, c) => t + (c[campo] || 0), 0);
  return {
    mes,
    totais: {
      clientes: clientes.length,
      criados_mes: soma("criados_mes"),
      postados_mes: soma("postados_mes"),
      rascunhos: soma("rascunhos"),
      agendados: soma("agendados"),
      descartados_mes: soma("descartados_mes"),
      gasto_mes: +soma("gasto_mes").toFixed(4),
      custo_medio_carrossel: custosCarrosselMes.length ? +(custosCarrosselMes.reduce((t, v) => t + v, 0) / custosCarrosselMes.length).toFixed(4) : null,
      nota_media: media(notasGerais),
    },
    dias: dias.map((d) => ({ dia: d, ...porDia[d], gasto: +porDia[d].gasto.toFixed(4) })),
    estruturas: Object.entries(estruturas).map(([nome, qtd]) => ({ nome, qtd })).sort((a, b) => b.qtd - a.qtd),
    clientes: clientes.sort((a, b) => b.criados_mes - a.criados_mes || a.nome.localeCompare(b.nome)),
    agendados: agendados.sort((a, b) => new Date(a.quando) - new Date(b.quando)).slice(0, 10),
    descartes: descartes.sort((a, b) => new Date(b.quando) - new Date(a.quando)).slice(0, 8),
  };
}
