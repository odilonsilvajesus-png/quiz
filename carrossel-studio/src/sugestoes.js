// Sugestões de pauta criadas a partir do conhecimento do próprio cliente (sem depender de referências):
// base de conhecimento, voz, temas, o que já foi feito e o que foi descartado.
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { pastaSaida } from "./cliente.js";
import { modelosDoCliente } from "./modelos.js";
import { historico, aprendizados } from "./carrosseis.js";
import { gerarEstruturado, provedor } from "./ia.js";
import { textosDosDocumentos } from "./documentos.js";

const arquivo = (clienteId) => path.join(pastaSaida(clienteId), "sugestoes.json");

export function listarSugestoes(clienteId) {
  return fs.existsSync(arquivo(clienteId)) ? JSON.parse(fs.readFileSync(arquivo(clienteId), "utf8")) : [];
}

export function limparSugestoes(clienteId) {
  fs.writeFileSync(arquivo(clienteId), "[]");
}

// Transforma a sugestão no formato de "referência" que o gerador de carrossel já entende.
export function sugestaoComoReferencia(s) {
  return {
    id: s.id,
    plataforma: "sugestao",
    tipo: "pauta",
    perfil: "Sugestão da IA",
    texto: `Tema: ${s.tema}\nGancho: ${s.gancho}\nDesenvolvimento: ${s.resumo}\nPor que vai engajar: ${s.por_que}`,
    metricas: { curtidas: 0, comentarios: 0, visualizacoes: 0 },
  };
}

export async function gerarSugestoes(cliente, { quantidade = 8, foco = "" } = {}) {
  const modelos = modelosDoCliente(cliente);
  const feitos = historico(cliente.id).slice(-30).map((h) => h.angulo);
  let novas;

  if (!provedor()) {
    // Modo demonstração: usa os temas cadastrados.
    const temas = cliente.conteudo.angulos.length ? cliente.conteudo.angulos : ["Tema principal do cliente"];
    novas = temas.slice(0, quantidade).map((tema) => ({
      tema, gancho: `[GANCHO SOBRE ${tema.toUpperCase()}]`, resumo: "Configure OPENAI_API_KEY para sugestões reais.",
      por_que: "Modo demonstração.", modelo: modelos[0]?.id || "", angulo: tema,
    }));
  } else {
    const schema = z.object({
      sugestoes: z.array(z.object({
        tema: z.string().describe("Título curto da pauta"),
        gancho: z.string().describe("Frase de abertura (capa) forte, na voz do cliente"),
        resumo: z.string().describe("2 a 3 frases com o desenvolvimento do carrossel"),
        por_que: z.string().describe("Por que essa pauta tende a engajar este público"),
        modelo: z.string().describe("id do modelo de carrossel mais adequado, da lista fornecida"),
        angulo: z.string().describe("Tema/ângulo da lista do cliente, se houver um que se encaixe; senão, vazio"),
      })),
    });
    const r = await gerarEstruturado({
      nome: "sugestoes",
      schema,
      sistema: `Você é estrategista de conteúdo de ${cliente.nome}${cliente.descricao ? ` (${cliente.descricao})` : ""}.
Crie pautas de carrossel para o Instagram usando só o conhecimento abaixo sobre o cliente, o público e o método. Cada pauta precisa ser específica (nada genérico), ter um gancho forte e um objetivo comercial coerente com a base.

${cliente.baseConhecimento ? `<base_de_conhecimento>\n${cliente.baseConhecimento}\n</base_de_conhecimento>` : ""}
${cliente.voz ? `<voz_do_cliente>\n${cliente.voz}\n</voz_do_cliente>` : ""}
${textosDosDocumentos(cliente.id).map((d) => `<documento nome="${d.nome}">\n${d.texto}\n</documento>`).join("\n")}
${cliente.conteudo.angulos.length ? `<temas_do_cliente>\n${cliente.conteudo.angulos.join("\n")}\n</temas_do_cliente>` : ""}
<modelos_disponiveis>
${modelos.map((m) => `${m.id}: ${m.nome} - ${m.descricao}`).join("\n")}
</modelos_disponiveis>`,
      usuario: `Sugira ${quantidade} pautas diferentes entre si.
${feitos.length ? `Evite repetir o que já foi feito recentemente: ${feitos.join("; ")}.` : ""}
${aprendizados(cliente.id).length ? `O cliente descartou estes conteúdos, aprenda com os motivos: ${aprendizados(cliente.id).map((a) => `${a.angulo}: ${a.motivo}`).join("; ")}.` : ""}
${foco ? `Foco pedido pelo usuário: ${foco}.` : ""}
Nunca invente números, depoimentos ou resultados.`,
    });
    novas = r.sugestoes;
  }

  const agora = new Date().toISOString();
  const lista = [
    ...novas.map((s, i) => ({ ...s, id: `sug:${Date.now()}-${i}`, criado_em: agora })),
    ...listarSugestoes(cliente.id),
  ];
  fs.writeFileSync(arquivo(cliente.id), JSON.stringify(lista, null, 2));
  return lista;
}
