// Escreve o carrossel na voz do cliente a partir de uma referência que performou bem.
import { z } from "zod";
import { provedor, gerarEstruturado, gerarTexto } from "./ia.js";

export const temIA = () => Boolean(provedor());

function esquema(qtdSlides) {
  return z.object({
    angulo: z.string().describe("Ângulo/tema escolhido, exatamente como aparece na lista do cliente quando houver lista"),
    por_que_a_referencia_funcionou: z.string().describe("1 a 3 frases: o mecanismo de atenção da referência (gancho, tensão, identificação)"),
    slides: z
      .array(z.object({ titulo: z.string(), subtitulo: z.string() }))
      .describe(`Exatamente ${qtdSlides} slides, na ordem da estrutura`),
    legenda: z.string().describe("Legenda do post para o Instagram, com CTA comercial no final"),
    pendencias: z.array(z.string()).describe("Marcadores [ENTRE COLCHETES] usados que alguém precisa preencher. Vazio se nenhum."),
  });
}

function promptSistema(cliente, modelo) {
  const c = cliente.conteudo;
  const estrutura = modelo.estrutura.map((s, i) => `${i + 1}. ${s.papel}: ${s.instrucao}`).join("\n");
  const exemplos = cliente.exemplosCarrossel
    .map((ex) => `### Ângulo: ${ex.angulo}\n` + ex.slides.map((s, i) => `${i + 1}. ${s.titulo} / ${s.subtitulo}`).join("\n"))
    .join("\n\n");

  return `Você é o redator de conteúdo de ${cliente.nome}${cliente.descricao ? ` (${cliente.descricao})` : ""}.
Sua tarefa: receber um conteúdo de REFERÊNCIA (de outro perfil ou canal) que teve engajamento acima do normal, entender POR QUE ele funcionou e escrever um carrossel ORIGINAL na voz de ${cliente.nome}, seguindo o método, o público e as regras do cliente.

A referência é só inspiração de ângulo e mecanismo de atenção. Nunca copie frases dela. Todo o conteúdo precisa soar como ${cliente.nome} e respeitar o posicionamento descrito abaixo.

${cliente.baseConhecimento.trim() ? `<base_de_conhecimento>
Informações e direcionamento sobre ${cliente.nome}. Siga com prioridade.
${cliente.baseConhecimento}
</base_de_conhecimento>` : ""}
${cliente.voz.trim() ? `\n<voz_do_cliente>
Tom de voz observado nas publicações de ${cliente.nome}. Imite este jeito de escrever.\n${cliente.voz}\n</voz_do_cliente>\n` : ""}
<estrutura_do_carrossel>
Modelo: ${modelo.nome}
${estrutura}
</estrutura_do_carrossel>

${exemplos ? `<carrosseis_aprovados>
Estes carrosséis já foram publicados e aprovados. Use-os como padrão de tom, ritmo e tamanho de texto. A ordem dos slides segue sempre a <estrutura_do_carrossel> acima, mesmo que os exemplos tenham outra estrutura.

${exemplos}
</carrosseis_aprovados>` : ""}

Regras de formato:
- Exatamente ${modelo.estrutura.length} slides, cada um com "titulo" (curto e direto, 1 a 3 linhas, até ${c.limites.titulo_max_caracteres} caracteres) e "subtitulo" (reforço em tom mais baixo, até ${c.limites.subtitulo_max_caracteres} caracteres).
- Em cada título, marque de 1 a 4 palavras-chave de destaque entre asteriscos, assim: "Você não precisa de *mais disciplina.*". Só uma marcação por título.
- ${c.regra_de_ouro || "Um tema por carrossel."}
${c.angulos?.length ? `- Escolha o ângulo mais adequado desta lista: ${c.angulos.join("; ")}.` : ""}
${c.proibir_travessao ? "- Nunca use travessão (— ou –). Use vírgula, ponto, dois pontos ou hífen simples." : ""}
- Legenda: ${c.cta_legenda || "termine com um CTA claro."}
- Nunca invente números, depoimentos, preços ou resultados. Quando precisar de um dado que não existe na base, use um marcador entre colchetes e liste em "pendencias".`;
}

function promptUsuario(referencia, { angulo, angulosRecentes = [] }) {
  const m = referencia.metricas;
  const r = referencia.ranking || {};
  return `<referencia>
Plataforma: ${referencia.plataforma} (${referencia.tipo})
Perfil: ${referencia.perfil}
Desempenho: ${m.curtidas} curtidas, ${m.comentarios} comentários${m.visualizacoes ? `, ${m.visualizacoes} visualizações` : ""}${r.outlier ? ` (${r.outlier}x acima da média do próprio perfil)` : ""}

Conteúdo:
${referencia.texto}
</referencia>

${angulo ? `Use obrigatoriamente o ângulo: ${angulo}.` : "Escolha o ângulo que melhor aproveita o mecanismo de atenção dessa referência."}
${angulosRecentes.length ? `Evite repetir estes ângulos, usados recentemente: ${angulosRecentes.join("; ")}.` : ""}

Escreva o carrossel.`;
}

const semTravessao = (t) => t.replace(/\s*[—–]\s*/g, ", ").replace(/,\s*,/g, ",");

function limpar(resultado, cliente) {
  if (!cliente.conteudo.proibir_travessao) return resultado;
  return {
    ...resultado,
    slides: resultado.slides.map((s) => ({ titulo: semTravessao(s.titulo), subtitulo: semTravessao(s.subtitulo) })),
    legenda: semTravessao(resultado.legenda),
  };
}

// opcoes.modelo: { nome, estrutura } escolhido na biblioteca de modelos (ver modelos.js).
export async function escreverCarrossel(cliente, referencia, opcoes = {}) {
  const modelo = opcoes.modelo;
  const qtd = modelo.estrutura.length;

  if (!temIA()) {
    // Modo demonstração: usa um carrossel aprovado do cliente (ou textos de exemplo) para testar o visual.
    const exemplos = cliente.exemplosCarrossel.filter((e) => e.slides.length === qtd);
    const ex = exemplos.find((e) => e.angulo === opcoes.angulo) || exemplos[(opcoes.indice || 0) % (exemplos.length || 1)];
    return {
      demo: true,
      angulo: ex?.angulo || `Exemplo: ${modelo.nome}`,
      por_que_a_referencia_funcionou: "MODO DEMONSTRAÇÃO: configure OPENAI_API_KEY no .env para gerar copy nova a partir da referência.",
      slides: ex?.slides || modelo.estrutura.map((s) => ({ titulo: `${s.papel}: texto de *exemplo*`, subtitulo: s.instrucao })),
      legenda: "[LEGENDA GERADA PELA IA]",
      pendencias: [],
    };
  }

  const resultado = await gerarEstruturado({
    sistema: promptSistema(cliente, modelo),
    usuario: promptUsuario(referencia, opcoes),
    schema: esquema(qtd),
    nome: "carrossel",
  });
  if (resultado.slides.length !== qtd) {
    throw new Error(`A IA devolveu ${resultado.slides.length} slides em vez de ${qtd}. Tente de novo.`);
  }
  return limpar(resultado, cliente);
}

// Gera o voz.md do cliente a partir de legendas reais dele.
export async function descreverVoz(cliente, legendas) {
  if (!temIA()) throw new Error("Configure OPENAI_API_KEY no .env para gerar a voz automaticamente.");
  return gerarTexto(`Abaixo estão ${legendas.length} legendas reais do Instagram de ${cliente.nome}.
Escreva um guia de voz em Markdown, em português do Brasil, para um redator imitar o jeito de escrever de ${cliente.nome}. Inclua:
- Tom (formal/informal, acolhedor/firme, técnico/simples) com exemplos tirados das legendas
- Vocabulário e expressões que ela repete
- Tamanho e ritmo das frases, uso de perguntas, emojis e pontuação
- Como ela abre e fecha os textos, e que tipo de CTA usa
- O que ela evita
Descreva só o que aparece nas legendas, sem inventar.

${legendas.map((l, i) => `<legenda n="${i + 1}">\n${l}\n</legenda>`).join("\n")}`);
}
