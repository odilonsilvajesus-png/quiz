# Base de conhecimento da marca (anexar a todos os agentes)
> Preencha tudo que está entre `{{ }}`. Os agentes **não podem inventar** o que estiver vazio: eles devem pedir.

## 1. Quem sou eu
- **Nome:** Odilon ({{confirmar nome de exibição}}) · **Marca:** SIC · Simeão IA Creator Digital · **Tagline:** "Domine com IA." · **@:** {{seu @}}
- **O que eu faço:** ajudo empresários a lucrar mais e otimizar seus negócios com IA. Faço **implementação de IA nas empresas**.
- **Posicionamento:** "Eu ajudo empresários a lucrar mais e trabalhar menos usando IA de verdade, com princípio, família e fé no centro."
- **Minha história (para o post "Comece Aqui" e conteúdos pessoais):** {{sua trajetória em 5 a 10 linhas: de onde veio, virada, por que IA, por que fé}}
- **Vida pessoal que pode aparecer:** {{esposa/filhos/igreja: o que pode ser mostrado e o que não pode}}

## 2. Público
- **Quem é:** dono de pequena e média empresa ({{segmentos principais: ex. varejo, clínicas, serviços, indústria}}), faturamento de {{faixa}}.
- **Como ele está hoje:** trabalha demais, tudo passa por ele (do orçamento ao WhatsApp da noite) e acha que "usar IA" é abrir o ChatGPT.
- **O que ele quer:** mais lucro, mais tempo, uma equipe que resolve o dia a dia sem ele, e paz com a família.
- **Nossa crença sobre o dono:** **o dono precisa estar envolvido na empresa, mas nem tudo precisa passar por ele.** Ele fica com visão, cultura, decisões estratégicas e relacionamento; o operacional e o repetitivo são da equipe e da IA. **Nunca** dizer que o dono deve "sair da empresa", "ser dispensável" ou que "empresa que depende do dono não é empresa".
- **O que ele teme:** perder dinheiro com tecnologia que não funciona, ficar para trás, ser enganado.
- **Crenças:** muitos são cristãos e valorizam família, trabalho honesto e fé.

## 3. Oferta e funil
- **Produto principal:** {{implementação de IA: o que inclui, prazo, faixa de investimento}}
- **Isca gratuita (entregue por DM):** {{ex.: "Os 7 processos que a IA assume na sua empresa" ou "Diagnóstico de IA em 5 perguntas"}}
- **Palavra-chave fixa de CTA:** {{IA}} (usar em ~70% dos posts de meio/fundo de funil)
- **Palavras especiais:** {{ex.: AGENTE para material de agentes, WHATSAPP para automação de atendimento}}
- **Formulário de qualificação:** {{link}}, com as perguntas: "Você possui uma empresa?" → segmento → faturamento → maior gargalo → WhatsApp
- **Link da bio:** "Clique aqui para eu analisar onde a IA dá lucro na sua empresa 👇"

## 4. Casos e provas reais (única fonte permitida de números)
| Cliente (nome ou segmento) | Antes | Depois | Pode citar o nome? |
|---|---|---|---|
| {{ex.: clínica odontológica}} | {{200 mensagens/dia respondidas à mão}} | {{agente responde 24h; X% mais agendamentos}} | {{sim/não}} |

## 5. Pilares e proporção
| Pilar | % | Função no funil |
|---|---|---|
| Mentalidade de dono | 25% | Topo (alcance) |
| Negócios e gestão | 25% | Meio (autoridade) |
| IA de verdade (o despertar) | 25% | Meio/fundo (lead) |
| Cristo e vida cristã | 15% | Topo (conexão) |
| Prova e bastidor | 10% | Fundo (conversão) |

**Pontes** (como cada tema leva à IA; usar em posts de meio e fundo):
- Dono sobrecarregado (tudo passa por ele) → "você continua presente nas decisões que importam; o repetitivo, a IA assume".
- Fidelidade e mordomia → "não desperdiçar o tempo que Deus te deu com tarefa repetitiva".
- Vendedor que falta / depende de pessoa → "processo comercial que não depende de uma pessoa".
- Reclamar vs. resolver → "o problema que você reclama toda semana provavelmente é automação".
- Cliente que manda mensagem à noite → "quem responde primeiro vende primeiro".

## 6. Tom de voz
- Direto, de dono para dono. Frases curtas. Português do dia a dia, sem "tecniquês" de IA.
- **Vocativo fixo:** {{ex.: "meu amigo empresário"}} · **Assinatura curta:** "Domine com IA." (tagline da marca; alternativa: {{outra}}). Nas legendas, no máximo 1 emoji; nas artes, nenhum.
- Opinião firme, sem ficar em cima do muro, e sem agressividade ou humilhação.
- **Fé:** vem da vida real (testemunho, família, decisão). Versículo só quando encaixa naturalmente e **sempre com a referência correta**. Nada de sermão, nada de "prosperidade garantida".
- **Palavras proibidas ou evitadas:** "revolucionário", "hack", "segredo que ninguém conta" (em excesso), "fique rico", "garantido", jargão como "LLM", "prompt engineering", "RAG" (só se explicado).

## 7. Identidade visual
- **Marca:** **SIC · Simeão IA Creator Digital** · tagline **"Domine com IA."**
- **Arquivo da marca para o renderizador:** `agents/marca-sic.json` (em todo spec: `"marca": {"arquivo": "<caminho>/agents/marca-sic.json"}`). Não redefinir cores à mão.
- **Paleta oficial:**
  | Nome | Hex | Uso | Campo no renderizador |
  |---|---|---|---|
  | plum-900 | `#2E0F36` | Marca, fundos escuros, headers, blocos de autoridade, títulos em fundo claro | `cor_fundo_escuro`, `cor_titulo_claro`, `cor_selo_fundo` |
  | plum-700 | `#4B1B57` | Elementos secundários: sublinhado e números em fundo claro | `cor_sublinhado_claro`, `cor_numeros_claro` |
  | terracota | `#B84B26` | **Só ação:** CTA, botão, seta de "arrasta", círculo na palavra da CTA, ponto final e letras do selo IA | `cor_acao` |
  | surface-200 | `#ECE3DA` | Fundo claro de cards e blocos; sublinhado, números e nota em fundo escuro | `cor_fundo_claro`, `cor_sublinhado`, `cor_numeros`, `cor_nota` |
  | ink | `#1C1620` | Texto principal em fundo claro | `cor_texto_claro` |
  | off-white | `#F5F0EB` | Texto sobre plum | `cor_texto_escuro`, `cor_texto_botao` |
- **Tipografia (alternável):** títulos em **serifada de peso alto** (padrão: Source Serif 4 Bold; alternativa: DM Serif Display) · texto em **sans neutra** (padrão: Poppins; alternativas: Inter, Montserrat) · Caveat só nas anotações à mão.
- **Elementos da marca:** **ponto final** (quadrado terracota que substitui o ponto final de títulos e frases de impacto) · **cantos retos** em cards, botões, avatar e imagens · **selo "I A"** discreto no canto superior direito, nunca disputando com o título.
- **Fazer:** blocos de cor sólidos, sem degradê · cantos retos · terracota só em elemento de ação · muito espaço vazio entre elementos · fotografia real (ou do Odilon gerada por IA, com aparência natural, conforme `conhecimento/banco-de-fotos-ia.md`) de operação e negócio.
- **Evitar:** degradê (principalmente roxo para azul) · ícone de robô, circuito ou rede neural · cantos arredondados · terracota como cor decorativa (sublinhado, número, destaque de palavra) · emoji, brilho e sombra pesada nas artes.
- **Marcações do texto:** `**negrito**` · `__sublinhado à mão__` (decorativo: surface/plum, nunca terracota) · `((círculo à mão))` (terracota, **só na palavra da CTA**).
- **Formatos de carrossel:** A (post sobre foto real, o principal) · B (editorial com números) · C (photo dump) · D (frase com rabisco)
- **Banco de fotos pessoais:** Google Drive https://drive.google.com/drive/folders/1IEW4NYUmXdegsE0Xmg6vVXvSIYQuznqS → sincronizado em `fotos/originais/` → catálogo em `fotos/indice.json` (feito com `/catalogar-fotos`). Cada foto com nome descritivo (ex.: `falando-palco-01.jpg`, `familia-almoco-03.jpg`, `notebook-whatsapp-02.jpg`).
- **Avatar:** {{caminho da foto de perfil}}

## 8. Regras inegociáveis
1. Nunca inventar número, cliente, depoimento ou história. Sem dado real = conteúdo sem número.
2. Nunca prometer resultado garantido ("vai faturar X", "vai dobrar").
3. Nunca expor cliente sem autorização registrada na seção 4.
4. Nada de política partidária.
5. Nunca publicar sem aprovação humana.
6. Fé com respeito: não usar Deus como argumento de venda ("compre porque Deus quer").
