// Escreve o carrossel na voz do cliente a partir de uma referência que performou bem.
import { z } from "zod";
import { conteudoCompleto } from "./analise.js";
import { textosDosDocumentos } from "./documentos.js";
import { provedor, gerarEstruturado, gerarTexto } from "./ia.js";
import { estruturasVirais } from "./modelos.js";

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
    planejamento: z.object({
      quem: z.string().describe("Para quem exatamente é este post: perfil, momento de vida ou do negócio, dor"),
      por_que: z.string().describe("Qual ganho a pessoa percebe até o 3º slide"),
      ideia_central: z.string().describe("A ÚNICA ideia do carrossel, em uma frase"),
      pergunta_da_capa: z.string().describe("A pergunta que a capa deixa na cabeça do leitor (o 'como assim?') e que só o último slide responde"),
      fio_condutor: z.string().describe("Em uma linha, como cada slide leva ao próximo até fechar a pergunta da capa"),
    }).describe("Preencha ANTES de escrever os slides"),
    ...extras,
    angulo: z.string().describe("Ângulo/tema escolhido, exatamente como aparece na lista do cliente quando houver lista"),
    por_que_a_referencia_funcionou: z.string().describe("1 a 3 frases: o mecanismo de atenção da referência (gancho, tensão, identificação)"),
    slides: z
      .array(z.object(slide))
      .describe(`Exatamente ${qtdSlides} slides, na ordem da estrutura. No slide 1 (capa), "subtitulo" é vazio.`),
    ganchos_alternativos: z.array(z.string()).describe("3 outras headlines para a capa, de 4 a 12 palavras, cada uma com um mecanismo diferente (curiosidade, polêmica, identificação)"),
    cta_botao: z.string().describe("Texto do botão do último slide, em caixa alta, até 22 caracteres, coerente com o CTA. Ex.: SALVE ESTE POST, COMENTE AGENDA"),
    legenda: z.string().describe("Legenda do post para o Instagram, terminando com o mesmo CTA do último slide"),
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

// CTA pelo objetivo do post. Palavra-chave, entrega e próximo passo vêm do cadastro do cliente.
function regrasCta(cliente, objetivo) {
  const cta = cliente.conteudo.cta || {};
  const palavra = cta.palavra_chave ? `a palavra ${cta.palavra_chave}` : "uma PALAVRA curta ligada ao tema, em caixa alta";
  const entrega = cta.entrega || "[O QUE A PESSOA RECEBE] (liste em pendencias)";
  const tipos = {
    alcance: "ALCANCE: pedir para seguir o perfil ou mandar o post para alguém que precisa ler.",
    autoridade: "AUTORIDADE: pedir para salvar o post para usar depois.",
    lead: `LEAD (CTA duplo): salvar o post e comentar ${palavra} para receber ${entrega}.`,
    conversao: `CONVERSÃO: levar ao próximo passo comercial: ${cta.conversao || "[PRÓXIMO PASSO: link na bio, direct ou formulário] (liste em pendencias)"}.`,
  };
  if (tipos[objetivo]) return `CTA deste post (obrigatório): ${tipos[objetivo]}`;
  return `CTA: escolha UM objetivo que combine com o conteúdo e use o CTA dele:\n${Object.values(tipos).map((t) => `  - ${t}`).join("\n")}\n  Em estruturas de identificação ou contraponto, uma pergunta fácil de responder também funciona.`;
}

// Regras de copy viral que valem para todos os clientes e todos os modelos.
function regrasVirais(modelo, objetivo, cliente) {
  const maxPalavras = modelo.palavras_max || 35;
  return `<regras_de_viralizacao>
Antes de escrever, preencha "planejamento": para quem é, qual ganho a pessoa percebe até o 3º slide, a ÚNICA ideia central, a pergunta que a capa abre e o fio que leva de slide em slide até a resposta. Se houver duas ideias, fique com a mais forte.

CAPA (slide 1):
- Só a headline. "subtitulo" vazio. De 4 a 12 palavras.
- A capa precisa fazer a pessoa pensar "como assim?" e arrastar para entender. Ela ABRE uma pergunta e NÃO entrega a resposta.
- Fórmulas que funcionam:
  • problema + consequência: "Seu conteúdo pode estar afastando clientes sem você perceber."
  • resultado + contradição: "Você não precisa postar mais para vender mais."
  • erro + curiosidade: "O erro que faz seu conteúdo parecer bom… e vender pouco."
  • consequência escondida de algo bom: "A balança desceu 10 kg. Seu cabelo desceu junto."
  • pergunta provocativa: "E se o problema não fosse falta de clientes?"
  • segredo: "Existe uma parte da sua estratégia que quase ninguém olha."
  • contraste: "Enquanto você tenta convencer, seus concorrentes estão fazendo outra coisa."
- Proibido na capa: conselho ou ordem genérica ("Não faça X", "Cuide de Y"), título que já entrega a conclusão, frase que só faz sentido depois de ler o post.
- O tema e o público do post aparecem já na capa ou no slide 2 (ex.: se o post é sobre quem usa canetinha, a canetinha está na capa ou no slide 2, nunca só no final).
- Em "ganchos_alternativos", escreva 3 outras headlines para a capa, cada uma com um mecanismo diferente.

SLIDE 2: precisa funcionar sozinho como capa, porque o Instagram reexibe o carrossel a partir dele. É um segundo gancho que aprofunda a pergunta da capa, nunca introdução.

CONSCIÊNCIA (vale para qualquer estrutura, é o que cria conexão):
- Não tente convencer. Conduza a pessoa até o ponto em que a solução passa a fazer sentido: atenção → curiosidade → identificação → tensão → descoberta → novo jeito de ver → desejo → ação.
- Quebra de padrão: desafie a explicação que o público já tem para o próprio problema ("Talvez o problema não seja X").
- Dor em camadas: não pare na dor funcional ("você não vende"). Mostre a cena concreta e o que ela custa em dinheiro, emoção, identidade ("começa a duvidar se é bom no que faz") ou futuro.
- Identificação: use o diálogo interno do público, os pensamentos que ele nunca falou em voz alta ("Será que meu preço está alto?", "Será que o problema sou eu?").
- Erro oculto: em algum slide, mostre que o problema aparente não é o real: "Você acha que é X. Mas o verdadeiro problema é Y." Esse é o momento que faz a pessoa salvar e compartilhar.
- Nova perspectiva: depois de derrubar a explicação antiga, coloque outra no lugar ("Não é X. É Y."). Criticar sem oferecer um novo jeito de ver só frustra.
- Solução: mostre o mecanismo (o que fazer, como pensar, por que funciona), simples de entender, sem entregar tudo.
- CTA: o próximo microcompromisso que a pessoa está pronta para assumir. Quem acabou de descobrir o problema comenta, salva ou segue; não recebe oferta agressiva.

FIO CONDUTOR (o que segura a pessoa até o fim):
- O carrossel é UM argumento contínuo, não uma sequência de frases de efeito soltas. Cada slide responde à pergunta que o anterior deixou e deixa uma nova.
- Comece os slides do meio com conectores que puxam o próximo: "Só que…", "E o pior:", "O detalhe que ninguém conta:", "Por isso…", "Aí vem a virada:".
- Títulos concretos, que se entendem sozinhos. Nada de metáfora abstrata que só faz sentido lendo o subtítulo (errado: "O folículo não vive de promessa"; certo: "Sem proteína, o cabelo é o primeiro a pagar a conta").
- Lista ("três pontos", "três erros") não se espreme num subtítulo: cada item ganha um slide ou uma frase curta e clara.
- O penúltimo slide é o clímax (a virada ou a frase mais forte). O último slide FECHA o que a capa abriu (retoma a ideia ou a cena da capa com a resposta) e só então faz o CTA.
- Nada novo no final: nenhum tema, público ou termo aparece pela primeira vez no último slide.
- O CTA é consequência do que foi mostrado e diz por que agir (ex.: "Salva para mostrar no seu próximo retorno médico", não só "salve este post").

TEXTO:
- No máximo ${maxPalavras} palavras por slide (título + subtítulo). Frases curtas, português do dia a dia.
- Um destaque por slide.
- A micro-dor específica vence a frase genérica: uma cena que o público reconhece na hora ("o cliente que some depois do orçamento" vence "clientes difíceis").
- Traga algo do próprio cliente (experiência, opinião, história, método) tirado da base. Conteúdo que qualquer perfil do nicho postaria não serve.

PROIBIDO:
- Slide de "conclusão", "resumo" ou "obrigado por ler".
- Promessa de resultado garantido ("vai", "garantido", "dobra"). Use "pode", "no caso de X".
- Jargão técnico sem explicar, linguagem de guru, emoji nos slides.
- Número, caso, depoimento ou história que não esteja na base do cliente.
- Humilhar alguém, opinião partidária ou acusar pessoas.

${regrasCta(cliente, objetivo)}
- O último slide leva o CTA, e "cta_botao" é o texto curto do botão desse slide. A legenda termina com o mesmo CTA.
</regras_de_viralizacao>`;
}

function promptSistema(cliente, modelo, opcoes = {}) {
  const c = cliente.conteudo;
  const documentos = textosDosDocumentos(cliente.id);
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
${documentos.length ? `\n<documentos_do_cliente>
Documentos enviados sobre ${cliente.nome}. Use como fonte de verdade sobre o cliente, o método, a marca e o público.
${documentos.map((d) => `<documento nome="${d.nome}">\n${d.texto}\n</documento>`).join("\n")}
</documentos_do_cliente>\n` : ""}${cliente.voz.trim() ? `\n<voz_do_cliente>
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

${regrasVirais(modelo, opcoes.objetivo, cliente)}

Regras de formato:
- Exatamente ${modelo.estrutura.length} slides, cada um com "titulo" (curto e direto, 1 a 3 linhas, até ${c.limites.titulo_max_caracteres} caracteres) e "subtitulo" (reforço em tom mais baixo, até ${c.limites.subtitulo_max_caracteres} caracteres). Na capa, "subtitulo" é vazio.
- Em cada título, marque de 1 a 4 palavras-chave de destaque entre asteriscos, assim: "Você não precisa de *mais disciplina.*". Só uma marcação por título.
- ${c.regra_de_ouro || "Um tema por carrossel."}
${c.angulos?.length ? `- Escolha o ângulo mais adequado desta lista: ${c.angulos.join("; ")}.` : ""}
${c.proibir_travessao ? "- Nunca use travessão (— ou –). Use vírgula, ponto, dois pontos ou hífen simples." : ""}
- Legenda: ${c.cta_legenda || "termine com um CTA claro."}
${opcoes.estilo?.formato_texto ? `- Formato do texto para o estilo visual "${opcoes.estilo.nome}": ${opcoes.estilo.formato_texto}\n` : ""}${opcoes.comImagem ? `${regrasImagem(cliente, opcoes.estiloImagem, opcoes.estilo?.direcao_imagem, { regras: cliente.visual.imagens?.regras, observacao: opcoes.obsImagem, comPessoa: opcoes.comPessoa })}\n` : ""}- Nunca invente números, depoimentos, preços ou resultados. Quando precisar de um dado que não existe na base, use um marcador entre colchetes e liste em "pendencias".`;
}

// Pedido de correção do revisor: a versão anterior e o que precisa mudar.
function blocoRevisao(revisao) {
  if (!revisao) return "";
  const { anterior, ajustes = [], bloqueios = [] } = revisao;
  return `

<revisao>
O revisor avaliou a versão abaixo e ela não passou. Reescreva o carrossel corrigindo TODOS os pontos apontados e mantendo o que já estava bom.
${bloqueios.length ? `Bloqueios (obrigatório corrigir):\n${bloqueios.map((b) => `- ${b}`).join("\n")}\n` : ""}${ajustes.length ? `Ajustes:\n${ajustes.map((a) => `- ${a.onde}: ${a.problema} → ${a.sugestao}`).join("\n")}\n` : ""}
Versão anterior:
${anterior.slides.map((s, i) => `${i + 1}. ${s.titulo}${s.subtitulo ? ` / ${s.subtitulo}` : ""}`).join("\n")}
Legenda: ${anterior.legenda}
</revisao>`;
}

function promptUsuario(referencia, { angulo, angulosRecentes = [], observacao, revisao }) {
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
${angulosRecentes.length ? `Evite repetir estes ângulos, usados recentemente: ${angulosRecentes.join("; ")}.` : ""}${blocoRevisao(revisao)}

Escreva o carrossel.`;
}

const semTravessao = (t) => t.replace(/\s*[—–]\s*/g, ", ").replace(/,\s*,/g, ",");

function limpar(resultado, cliente) {
  if (!cliente.conteudo.proibir_travessao) return resultado;
  return {
    ...resultado,
    slides: resultado.slides.map((s) => ({ ...s, titulo: semTravessao(s.titulo), subtitulo: semTravessao(s.subtitulo) })),
    ganchos_alternativos: (resultado.ganchos_alternativos || []).map(semTravessao),
    legenda: semTravessao(resultado.legenda),
  };
}

// A capa leva só a headline.
function capaSoHeadline(resultado) {
  if (resultado.slides[0]) resultado.slides[0].subtitulo = "";
  return resultado;
}

// Modo Automático: escolhe a estrutura viral pelo tipo do conteúdo, com um modelo barato (LEITURA_MODELO).
export async function escolherEstrutura(cliente, referencia, { observacao } = {}) {
  const opcoes = estruturasVirais();
  if (!temIA()) return { modelo: opcoes[0], motivo: "Modo demonstração." };
  const conteudo = referencia.plataforma === "sugestao" ? referencia.texto : conteudoCompleto(referencia);
  const r = await gerarEstruturado({
    nome: "estrutura",
    modeloOpenAI: process.env.LEITURA_MODELO || undefined,
    schema: z.object({
      estrutura: z.enum(opcoes.map((m) => m.id)),
      motivo: z.string().describe("Uma frase explicando a escolha"),
    }),
    sistema: `Você escolhe a estrutura de roteiro de um carrossel do Instagram pelo TIPO do conteúdo. Opções:
${opcoes.map((m) => `- ${m.id} (${m.nome}): ${m.quando_usar}`).join("\n")}
${opcoes.some((m) => m.id === "n3") ? "Na dúvida, escolha n3. Use outra só quando o conteúdo for claramente daquele tipo." : ""}`,
    usuario: `Cliente: ${cliente.nome}${cliente.descricao ? ` (${cliente.descricao})` : ""}

Conteúdo que vai virar carrossel:
${conteudo.slice(0, 6000)}${observacao ? `\n\nObservação do usuário: ${observacao}` : ""}`,
  });
  return { modelo: opcoes.find((m) => m.id === r.estrutura) || opcoes[0], motivo: r.motivo };
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
  return capaSoHeadline(limpar(resultado, cliente));
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
