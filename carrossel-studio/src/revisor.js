// Revisor: segunda leitura do carrossel antes de chegar ao painel. Dá notas, aponta bloqueios e ajustes.
// Se não passar (bloqueio, gancho abaixo de 7 ou média abaixo de 7,5), o pipeline reescreve uma vez.
import { z } from "zod";
import { gerarEstruturado } from "./ia.js";
import { VICIO_METODO } from "./copy.js";

const NOTA_MINIMA_GANCHO = 7;
const NOTA_MINIMA_FLUXO = 7;
const MEDIA_MINIMA = 7.5;

const esquema = z.object({
  bloqueios: z.array(z.string()).describe("Problemas graves que impedem publicar. Vazio se nenhum."),
  notas: z.object({
    gancho: z.number().describe("0 a 10"),
    clareza: z.number().describe("0 a 10"),
    tom_de_voz: z.number().describe("0 a 10"),
    estrutura: z.number().describe("0 a 10"),
    fluxo: z.number().describe("0 a 10"),
    conexao: z.number().describe("0 a 10"),
    cta: z.number().describe("0 a 10"),
  }),
  ajustes: z.array(z.object({
    onde: z.string().describe("'slide N' ou 'legenda'"),
    problema: z.string(),
    sugestao: z.string().describe("Correção concreta, de preferência com o texto novo"),
  })).describe("No máximo 5, os de maior impacto. Vazio se estiver ótimo."),
  resumo: z.string().describe("Uma frase com o veredito e o principal ponto de melhora"),
});

// Conferência feita pelo sistema: o vício "no nosso método" reprova e força a reescrita.
function vicioMetodo(copy) {
  return copy.slides
    .map((s, i) => ({ i, texto: `${s.titulo} ${s.subtitulo || ""}` }))
    .filter((x) => VICIO_METODO.test(x.texto))
    .map((x) => ({
      onde: `slide ${x.i + 1}`,
      problema: 'Usa "no nosso método/protocolo"',
      sugestao: "Descreva a solução pelo que acontece na prática, sem citar \"nosso método\". O cliente aparece só no último slide, como quem pode ajudar.",
    }));
}

const limitar = (n) => Math.max(0, Math.min(10, Number(n) || 0));

export function veredito(r, { reprovar = false } = {}) {
  const notas = Object.fromEntries(Object.entries(r.notas).map(([k, v]) => [k, limitar(v)]));
  const valores = Object.values(notas);
  const media = +(valores.reduce((t, v) => t + v, 0) / valores.length).toFixed(1);
  const aprovado = !reprovar && !r.bloqueios.length && notas.gancho >= NOTA_MINIMA_GANCHO
    && (notas.fluxo ?? 10) >= NOTA_MINIMA_FLUXO && (notas.conexao ?? 10) >= NOTA_MINIMA_FLUXO && media >= MEDIA_MINIMA;
  return { ...r, notas, media, aprovado, ajustes: r.ajustes.slice(0, 5) };
}

export async function revisarCarrossel(cliente, copy, modelo, { objetivo } = {}) {
  const base = (cliente.baseConhecimento || "").slice(0, 8000);
  const r = await gerarEstruturado({
    nome: "revisao",
    schema: esquema,
    sistema: `Você é o revisor e guardião da marca de ${cliente.nome}${cliente.descricao ? ` (${cliente.descricao})` : ""}. Você é exigente, mas prático: aponta o problema, onde está e como resolver. Você não reescreve o post.

Bloqueios (qualquer um impede publicar):
- Número, caso, depoimento ou história que não está na base do cliente (inventado).
- Promessa de resultado garantido ("vai faturar", "garantido", "dobra").
- Política partidária, acusação a pessoas, humilhar funcionário, cliente ou público.
- Texto copiado de outro perfil.
- Algo que contradiz o posicionamento ou as regras do cliente.
- Tema, público ou termo central que aparece pela primeira vez só no último slide (o final fica sem nexo).

Notas de 0 a 10:
- gancho: toca numa dúvida real de decisão, no medo de escolher errado ou num desejo específico, com o termo que o público usa? Quem está decidindo se reconhece na hora? Passa no teste de 1 segundo (dá para saber sobre o que é e se é comigo só lendo a capa)? Pergunta genérica ("Você sofre com…?"), metáfora, trocadilho, jogo de palavras, frase que precisa ser decifrada, conselho genérico ou título batido vale no máximo 5. O slide 2 funciona sozinho como capa?
- conexao: fala com quem já sente a dor e já tenta resolver do jeito comum? A pessoa se reconhece no cenário (já pesquisou, comparou, tem medo de escolher errado)? Mostra um erro comum e por que o passo correto importa? Vende segurança na decisão ("X sem Y": o resultado sem o medo), e não a novidade da solução? Nota baixa se o texto for genérico ou só informativo.
- fluxo: cada slide puxa o próximo, como um argumento só? Lendo só os títulos em sequência dá para entender o argumento (a informação concreta está no título, não escondida no subtítulo)? Títulos em forma de aforismo ou frase de efeito derrubam a nota para no máximo 6. O último slide fecha a pergunta da capa? Nota baixa se os slides forem frases de efeito soltas ou se o final parecer desconectado.
- clareza: uma ideia completa por slide, em frases inteiras e sem jargão? Cada slide do meio entrega algo prático e concreto?
- tom_de_voz: parece ${cliente.nome} falando? Traz algo próprio do cliente (experiência, opinião, método), e não conteúdo genérico do nicho?
- estrutura: segue a "${modelo.nome}" slide a slide (dor que a pessoa já sente, o caminho atual que não dá resultado, por que não dá, o novo caminho, o valor dele, a solução na prática, podemos ajudar)? Cada slide é consequência do anterior? "No nosso método", "no nosso protocolo" ou variações valem no máximo 4.
- cta: o último slide e a legenda levam a avaliação, conversa ou comentário${objetivo && objetivo !== "auto" ? ` (objetivo "${objetivo}")` : ""}, transmitindo segurança em vez de pressão?

Seja rigoroso com o gancho: dê 9 ou 10 só para um dos melhores ganchos do mês.

${cliente.voz ? `<voz_do_cliente>\n${cliente.voz}\n</voz_do_cliente>\n` : ""}${base ? `<base_do_cliente>\n${base}\n</base_do_cliente>` : ""}`,
    usuario: `Estrutura "${modelo.nome}":
${modelo.estrutura.map((s, i) => `${i + 1}. ${s.papel}: ${s.instrucao}`).join("\n")}

Carrossel para revisar:
${copy.slides.map((s, i) => `${i + 1}. ${s.titulo}${s.subtitulo ? ` / ${s.subtitulo}` : ""}`).join("\n")}
Botão do último slide: ${copy.cta_botao || "(nenhum)"}
Legenda: ${copy.legenda}`,
  });
  const vicios = vicioMetodo(copy);
  return veredito({ ...r, ajustes: [...vicios, ...r.ajustes] }, { reprovar: vicios.length > 0 });
}
