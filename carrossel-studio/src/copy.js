// Escreve o carrossel na voz do cliente a partir de uma referência que performou bem.
import { z } from "zod";
import { conteudoCompleto } from "./analise.js";
import { textosDosDocumentos } from "./documentos.js";
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
    planejamento: z.object({
      quem: z.string().describe("Para quem exatamente é este post: perfil, momento de vida ou do negócio, dor"),
      por_que: z.string().describe("Qual ganho a pessoa percebe até o 3º slide"),
      promessa: z.string().describe("O que o carrossel vende, no formato 'X sem Y': o resultado que a pessoa quer sem o medo dela. Ex.: 'Implantar IA no WhatsApp sem perder qualidade nem irritar cliente'"),
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
    ganchos_alternativos: z.array(z.string()).describe("3 outras headlines para a capa, uma frase cada, cada uma com um mecanismo diferente (curiosidade, polêmica, identificação)"),
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
- CAPA: a imagem mostra a EMOÇÃO da headline. De preferência a personagem olhando para a câmera com uma expressão forte que combine com a frase (surpresa, dúvida, riso, cansaço, alívio), ou o objeto do tema em close (celular, café, notebook, prato). Fundo limpo e escuro o bastante para receber texto branco grande por cima.
- Mostre ação, gesto e expressão concretos. Nada de imagem genérica, simbólica demais, de banco de imagens ou sem relação com a frase.
- Respeite o posicionamento do cliente: nada que contradiga a base de conhecimento (ex.: se o cliente é contra dieta, não mostre balança, fita métrica ou prato de salada como solução).
- Nunca peça texto, letras, números ou logotipos dentro da imagem.`;
}

// CTA pelo objetivo do post. Palavra-chave, presente e próximo passo vêm do cadastro do cliente.
function regrasCta(cliente, objetivo) {
  const cta = cliente.conteudo.cta || {};
  const palavra = cta.palavra_chave || "[PALAVRA]";
  const tipos = {
    conversao: `levar ao próximo passo: ${cta.conversao || "[PRÓXIMO PASSO: agendar avaliação, link na bio ou direct] (liste em pendencias)"}. Ex.: "Quer saber qual caminho faz sentido para você? Agende sua avaliação."`,
    lead: cta.entrega
      ? `comentar a palavra para receber o presente: "Quer receber ${cta.entrega}? Comenta ${palavra} que eu te mando na DM."`
      : `comentar a palavra para dar o primeiro passo: "Quer saber se [o seu caso] está pronto para [solução]? Comenta ${palavra} que eu te mostro o primeiro passo."`,
    autoridade: `salvar: "Salva este post para lembrar antes de escolher."`,
    alcance: `compartilhar: "Manda para quem está decidindo isso agora."`,
  };
  const faltaPalavra = objetivo === "lead" && !cta.palavra_chave ? " Liste em pendencias que falta a palavra-chave." : "";
  if (tipos[objetivo]) return `CTA deste post (obrigatório): ${tipos[objetivo]}${faltaPalavra}`;
  return `CTA: por padrão, leve a uma conversa ou avaliação. Opções:\n${Object.values(tipos).map((t) => `  - ${t}`).join("\n")}`;
}

function descreverSolucao(cliente) {
  const m = cliente.conteudo.metodo || {};
  const partes = [m.nome && `Nome: ${m.nome} (pode aparecer UMA vez, no slide da solução ou do "podemos ajudar").`, m.primeiro_passo && `Como começa: ${m.primeiro_passo}.`].filter(Boolean);
  return partes.length ? partes.join(" ") : "Use o serviço, processo ou forma de trabalho descrita na base do cliente.";
}

// Expressões que viram vício quando a IA escreve o slide da solução.
export const VICIO_METODO = /\b(aqui\s+)?n[oa]\s+noss[oa]\s+(m[ée]todo|protocolo|metodologia|processo)\b/i;

// A Metodologia Viraliza: vale para todos os clientes. Regras de um cliente específico ficam nos documentos dele.
function regrasVirais(modelo, objetivo, cliente) {
  return `<metodologia_viraliza>
PÚBLICO: quem JÁ sente a dor e já tenta resolver do jeito comum, sem resultado. Não tente convencer que existe um problema.
O FIO DO CARROSSEL, nesta ordem:
1. apresentar uma dor que a pessoa já sente;
2. mostrar que o caminho que ela segue não gera resultado;
3. explicar por que não gera resultado;
4. introduzir o novo caminho;
5. agregar valor a esse novo caminho;
6. trazer a solução na prática;
7. mostrar que podemos ajudar.
Cada slide é consequência do anterior: é um argumento só, do começo ao fim.

Antes de escrever, preencha "planejamento": quem exatamente sente a dor (ex.: "dono de clínica que sobe a verba e não vê agenda cheia"), o ganho de arrastar, a promessa no formato "X sem Y", a ÚNICA ideia central, a pergunta que a capa deixa e o fio condutor.

SOLUÇÃO DO CLIENTE: ${descreverSolucao(cliente)}

GANCHO (slide 1): só a headline, "subtitulo" vazio, em uma frase.
- Toca numa dor que a pessoa já sente, no caminho que ela já tenta sem resultado ou num desejo específico. Precisa gerar identificação imediata.
- Use um destes tipos:
  • Dor direta: "Você sobe a verba e as vendas não acompanham." / "Seu WhatsApp responde rápido, mas o cliente some."
  • Caminho que não funciona: "Cortar carboidrato não está te fazendo emagrecer." / "Trocar de criativo não vai salvar sua campanha."
  • Causa escondida: "Sua dor no joelho pode não estar começando no joelho." / "O problema talvez não seja o anúncio."
  • Alerta antes da decisão: "Antes de colocar IA no seu WhatsApp, entenda isso."
  • Nem todo mundo: "Nem todo sorriso bonito começa pelas lentes de contato."
  • Promessa: "Existe um jeito de X sem Y."
  • História (só com caso que esteja na base): "Uma paciente chegou querendo X. O problema era Y."
- Use o termo que o público usa (o procedimento, o serviço, a situação). Marque 1 palavra de destaque com *asteriscos*.
- Teste de 1 segundo: quem está rolando o feed entende SOBRE O QUE é e se é com ELE só lendo a capa. A headline nomeia a situação ou o objeto concreto do público e o risco ou ganho concreto.
  Ruim: "Antes da IA falar, defina quando calar." (jogo de palavras, abstrato). Bom: "Seu chatbot pode estar espantando cliente no WhatsApp."
- Proibido: pergunta genérica ("Você sofre com dor nas costas?"), metáfora, trocadilho, jogo de palavras, frase de efeito que precisa ser decifrada, conselho genérico, "Conheça nossos tratamentos".
- Em "ganchos_alternativos", 3 outras headlines de tipos DIFERENTES da capa.

DESENVOLVIMENTO: siga a estrutura slide a slide. Uma ideia por slide, cada slide puxando o próximo.
- O TÍTULO de cada slide carrega a informação concreta; o subtítulo continua e detalha. Quem ler apenas os títulos em sequência precisa entender o argumento inteiro.
- Nada de aforismo ou frase de efeito no título sem dizer, no próprio título, qual é o ponto de verdade.
- A solução é descrita pelo que acontece na prática (as etapas, o que se analisa, o que muda), com fatores concretos tirados da base do cliente.
- NUNCA escreva "no nosso método", "aqui no nosso método", "no nosso protocolo", "na nossa metodologia" ou variações. O cliente aparece só no último slide, como quem pode ajudar ("posso te ajudar", "a gente te ajuda").

TEXTO DOS SLIDES: cada slide é uma ideia completa, em frases inteiras, do tamanho que a ideia pedir. Pode listar itens (tentativas comuns, causas, etapas). Português do dia a dia; explique qualquer termo técnico.
Exemplo de carrossel nesse fio (tom, ritmo e tamanho de texto; não copie):
1. "Você sobe a verba e as *vendas* não acompanham." 2. "Todo mês é igual: mais investimento, mais cliques, e o caixa no mesmo lugar." 3. "Aí você troca o criativo, testa outro público e sobe a verba de novo. E nada muda." 4. "Isso não funciona porque o anúncio quase nunca é onde a venda trava. Ela trava na oferta, na página ou no atendimento." 5. "O caminho é descobrir onde a venda trava antes de gastar mais." 6. "Assim cada real vai para o ponto que segura a venda, e o tráfego deixa de ser aposta." 7. "Na prática: analisar oferta, página, métricas e atendimento, corrigir o gargalo e só então escalar." 8. "Se você quer descobrir onde a sua venda está travando, eu posso te ajudar. Comenta ANÁLISE."

CTA (último slide, "podemos ajudar"): mostra que o cliente pode ajudar e faz um convite suave, com segurança e sem pressão.
${regrasCta(cliente, objetivo)}
- "cta_botao" é o texto curto do botão do último slide.
- Legenda: 3 a 6 linhas que resumem a dor, por que o caminho atual não funciona e o novo caminho, terminando com o mesmo CTA.

CHECKLIST antes de responder: começa por uma dor que a pessoa já sente? Mostra que o caminho atual não gera resultado e explica por quê? Apresenta o novo caminho e o valor dele? A solução está descrita na prática? O final mostra que podemos ajudar, sem pressão? Nenhum "no nosso método"?

PROIBIDO: promessa de resultado garantido (use "pode"); emoji nos slides; número, caso, depoimento ou antes e depois que não estejam na base; humilhar alguém; opinião partidária; slide de "conclusão" ou "obrigado por ler".
</metodologia_viraliza>`;
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
- Exatamente ${modelo.estrutura.length} slides, cada um com "titulo" (a frase principal do slide, até ${c.limites.titulo_max_caracteres} caracteres) e "subtitulo" (continuação e detalhe, até ${c.limites.subtitulo_max_caracteres} caracteres). Na capa, "subtitulo" é vazio.
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
