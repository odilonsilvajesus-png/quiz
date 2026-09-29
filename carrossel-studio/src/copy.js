// Escreve o carrossel na voz do cliente a partir de uma referência que performou bem.
import { z } from "zod";
import { conteudoCompleto } from "./analise.js";
import { provedor, gerarEstruturado, gerarTexto } from "./ia.js";

export const temIA = () => Boolean(provedor());

function esquema(qtdSlides, comImagem, comDiagrama) {
  const slide = { titulo: z.string(), subtitulo: z.string() };
  if (comDiagrama) {
    slide.etapas = z.array(z.string()).describe("3 a 5 rótulos curtos de uma sequência, só nos slides que ensinam etapas. Vazio nos outros.");
  }
  if (comImagem) {
    slide.imagem = z.string().describe("A cena exata que este slide descreve, mostrada como fotografia: quem, fazendo o quê, onde, com qual expressão. Sem texto na imagem.");
  }
  const extras = comImagem
    ? { direcao_de_arte: z.string().describe("Direção de arte única para todas as imagens do carrossel: personagem principal (idade, aparência, roupa), ambiente, luz, clima e tipo de foto.") }
    : {};
  return z.object({
    ...extras,
    angulo: z.string().describe("Ângulo/tema escolhido, exatamente como aparece na lista do cliente quando houver lista"),
    por_que_a_referencia_funcionou: z.string().describe("1 a 3 frases: o mecanismo de atenção da referência (gancho, tensão, identificação)"),
    slides: z
      .array(z.object(slide))
      .describe(`Exatamente ${qtdSlides} slides, na ordem da estrutura`),
    legenda: z.string().describe("Legenda do post para o Instagram, com CTA comercial no final"),
    pendencias: z.array(z.string()).describe("Marcadores [ENTRE COLCHETES] usados que alguém precisa preencher. Vazio se nenhum."),
  });
}

// As imagens nascem do texto: uma direção de arte para o carrossel inteiro e, em cada slide,
// a cena que aquele texto descreve. Nada genérico ou de banco de imagens.
function regrasImagem(cliente, preferencia, direcaoEstilo, { regras, observacao, comPessoa } = {}) {
  return `Imagens (serão geradas por IA a partir do que você escrever):${regras ? `\n- REGRAS OBRIGATÓRIAS DO CLIENTE PARA IMAGENS (nunca desrespeite): ${regras}` : ""}${observacao ? `\n- Observação para as imagens deste carrossel: ${observacao}` : ""}${comPessoa ? `\n- A protagonista das imagens é a PRÓPRIA ${cliente.nome}, a partir de uma foto real dela. Descreva cenas com ela (roupa, lugar, gesto, expressão), sem descrever o rosto.` : ""}${direcaoEstilo ? `\n- Tipo de imagem que este estilo visual pede: ${direcaoEstilo}` : ""}
- Preencha "direcao_de_arte" com UM conceito visual para o carrossel inteiro, tirado do tema e do público de ${cliente.nome}: a mesma personagem principal em todos os slides (idade, aparência, roupa), o mesmo ambiente, a mesma luz e o mesmo clima emocional.${preferencia ? ` Preferência visual do cliente: ${preferencia}.` : ""}
- Em cada slide, preencha "imagem" com a cena que ILUSTRA LITERALMENTE aquele texto: se o slide fala de comer escondida à noite, mostre a personagem comendo escondida à noite. A imagem precisa fazer sentido mesmo para quem ler só aquele slide.
- Mostre ação, gesto e expressão concretos. Nada de imagem genérica, simbólica demais, de banco de imagens ou sem relação com a frase.
- Respeite o posicionamento do cliente: nada que contradiga a base de conhecimento (ex.: se o cliente é contra dieta, não mostre balança, fita métrica ou prato de salada como solução).
- Nunca peça texto, letras, números ou logotipos dentro da imagem.`;
}

function promptSistema(cliente, modelo, opcoes = {}) {
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

${opcoes.rejeitados?.length ? `<carrosseis_descartados>
Carrosséis que o cliente DESCARTOU e o motivo. Aprenda com isso e não repita os mesmos erros:
${opcoes.rejeitados.map((r) => `- ${r.angulo}${r.estilo ? ` (estilo ${r.estilo})` : ""}: ${r.motivo}`).join("\n")}
</carrosseis_descartados>

` : ""}${exemplos ? `<carrosseis_aprovados>
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
${opcoes.estilo?.formato_texto ? `- Formato do texto para o estilo visual "${opcoes.estilo.nome}": ${opcoes.estilo.formato_texto}\n` : ""}${opcoes.comImagem ? `${regrasImagem(cliente, opcoes.estiloImagem, opcoes.estilo?.direcao_imagem, { regras: cliente.visual.imagens?.regras, observacao: opcoes.obsImagem, comPessoa: opcoes.comPessoa })}\n` : ""}- Nunca invente números, depoimentos, preços ou resultados. Quando precisar de um dado que não existe na base, use um marcador entre colchetes e liste em "pendencias".`;
}

function promptUsuario(referencia, { angulo, angulosRecentes = [], observacao }) {
  const m = referencia.metricas || {};
  const r = referencia.ranking || {};
  const pauta = referencia.plataforma === "sugestao";
  const blocoReferencia = pauta
    ? `<pauta_sugerida>
${referencia.texto}
</pauta_sugerida>

Escreva um carrossel a partir desta pauta, criada com base no conhecimento do próprio cliente.`
    : `<referencia>
Plataforma: ${referencia.plataforma} (${referencia.tipo})
Perfil: ${referencia.perfil}
Desempenho: ${m.curtidas} curtidas, ${m.comentarios} comentários${m.visualizacoes ? `, ${m.visualizacoes} visualizações` : ""}${r.outlier ? ` (${r.outlier}x acima da média do próprio perfil)` : ""}

${conteudoCompleto(referencia)}
</referencia>

O que fez esse post performar está no CONTEÚDO REAL (a fala do vídeo e o texto dos slides), não na legenda. Baseie-se principalmente nele; use a legenda só como apoio.`;
  return `${blocoReferencia}

${angulo ? `Use obrigatoriamente o ângulo: ${angulo}.` : pauta ? "" : "Escolha o ângulo que melhor aproveita o mecanismo de atenção dessa referência."}
${observacao ? `Observação do usuário para este carrossel (siga com prioridade): ${observacao}` : ""}
${angulosRecentes.length ? `Evite repetir estes ângulos, usados recentemente: ${angulosRecentes.join("; ")}.` : ""}

Escreva o carrossel.`;
}

const semTravessao = (t) => t.replace(/\s*[—–]\s*/g, ", ").replace(/,\s*,/g, ",");

function limpar(resultado, cliente) {
  if (!cliente.conteudo.proibir_travessao) return resultado;
  return {
    ...resultado,
    slides: resultado.slides.map((s) => ({ ...s, titulo: semTravessao(s.titulo), subtitulo: semTravessao(s.subtitulo) })),
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
    sistema: promptSistema(cliente, modelo, opcoes),
    usuario: promptUsuario(referencia, opcoes),
    schema: esquema(qtd, opcoes.comImagem, opcoes.estilo?.diagrama),
    nome: "carrossel",
  });
  if (resultado.slides.length !== qtd) {
    throw new Error(`A IA devolveu ${resultado.slides.length} slides em vez de ${qtd}. Tente de novo.`);
  }
  return limpar(resultado, cliente);
}

// Gera o voz.md do cliente a partir dos posts reais dele: fala dos reels, texto dos carrosséis e legendas.
export async function descreverVoz(cliente, posts) {
  if (!temIA()) throw new Error("Configure OPENAI_API_KEY no .env para gerar a voz automaticamente.");
  return gerarTexto(`Abaixo estão ${posts.length} posts reais do Instagram de ${cliente.nome}. Cada um traz, quando disponível, a FALA do vídeo (transcrição do reels), o TEXTO dos slides do carrossel e a LEGENDA.
O tom de voz está principalmente em como ${cliente.nome} FALA nos vídeos e ESCREVE nos slides; a legenda é complementar.
Escreva um guia de voz em Markdown, em português do Brasil, para um redator imitar o jeito de escrever de ${cliente.nome}. Inclua:
- Tom (formal/informal, acolhedor/firme, técnico/simples) com exemplos tirados do material
- Vocabulário e expressões que ela repete
- Tamanho e ritmo das frases, uso de perguntas, emojis e pontuação
- Como ela abre e fecha os textos, e que tipo de CTA usa
- O que ela evita
- Diferenças entre o jeito de falar (vídeo) e de escrever (slides e legenda), se houver
Descreva só o que aparece no material, sem inventar.

${posts.map((p, i) => `<post n="${i + 1}" tipo="${p.tipo}">\n${conteudoCompleto(p)}\n</post>`).join("\n")}`);
}
