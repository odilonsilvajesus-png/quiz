# Módulo 2: Engenharia de prompt profissional

**Semanas 3 e 4 · cerca de 18 horas**

## Objetivos de aprendizagem
1. Estruturar prompts com o método **PCTRFE** (Papel, Contexto, Tarefa, Restrições, Formato, Exemplos).
2. Usar técnicas avançadas: exemplos (*few-shot*), raciocínio em etapas, encadeamento e autocrítica.
3. Escrever **prompts de sistema** para assistentes e agentes.
4. Avaliar e iterar prompts com critérios objetivos.
5. Montar uma biblioteca de prompts reutilizáveis para uma empresa.

---

## Aula 2.1: Por que o prompt é o "código" da IA

Um prompt ruim gera uma resposta genérica. Um bom prompt gera uma resposta pronta para uso. A diferença não é o modelo, é **quanta informação útil você deu**.

**Prompt fraco:**
> Escreva um post sobre nossa promoção.

**Prompt profissional:**
> Você é o social media de uma padaria artesanal de bairro em Belo Horizonte, com tom acolhedor e bem-humorado.
> Contexto: nesta sexta teremos "Pão de queijo em dobro": na compra de 10, leve 20, das 16h às 18h. Nosso público são famílias e trabalhadores do bairro.
> Tarefa: escreva uma legenda para Instagram anunciando a promoção.
> Restrições: no máximo 80 palavras; no máximo 3 emojis; não use as palavras "imperdível" nem "incrível".
> Formato: gancho na 1ª linha; corpo; CTA "Salve este post e marque quem vai com você"; 5 hashtags locais.

A segunda versão elimina ambiguidades. **Tudo que você não especifica, o modelo "chuta" com a opção mais genérica.**

---

## Aula 2.2: O método PCTRFE

| Letra | Componente | Pergunta que responde | Exemplo |
|---|---|---|---|
| **P** | Papel | Quem a IA deve ser? | "Você é um analista financeiro de PMEs com 15 anos de experiência." |
| **C** | Contexto | Qual a situação, o público, o histórico? | "A empresa é uma distribuidora com 12 funcionários e margem apertada..." |
| **T** | Tarefa | O que exatamente fazer? (use verbo no imperativo) | "Analise o DRE abaixo e identifique os 3 maiores riscos." |
| **R** | Restrições | O que evitar, quais limites? | "Não recomende empréstimos. Linguagem sem jargão." |
| **F** | Formato | Como a resposta deve vir? | "Tabela com colunas: Risco, Evidência, Impacto, Ação." |
| **E** | Exemplos | Como é uma boa resposta? | "Exemplo de linha: Estoque parado / R$ 80 mil em giro lento / Alto / Liquidação..." |

**Nem todo prompt precisa dos 6.** Para tarefas simples, T + F bastam. Para tarefas recorrentes ou críticas, use todos.

### Dicas que fazem diferença
- **Separe os dados das instruções** com delimitadores: `"""texto"""`, `<documento>...</documento>` ou `---`.
- **Seja positivo:** "Use frases curtas" funciona melhor que "Não use frases longas".
- **Explique o porquê:** "Use linguagem simples, **porque o público são idosos com pouca familiaridade com tecnologia**". O modelo generaliza melhor quando entende o motivo.
- **Coloque a pergunta no fim** quando houver um documento longo.

---

## Aula 2.3: Técnicas avançadas

### 1. *Few-shot* (dar exemplos)
Mostrar 2 a 5 exemplos de entrada e saída é a forma **mais eficaz** de obter consistência de formato e tom.

```
Classifique a intenção da mensagem do cliente em: COMPRA, DÚVIDA, RECLAMAÇÃO, OUTRO.

Mensagem: "Vocês entregam em Contagem?" → DÚVIDA
Mensagem: "Quero 2 kits do plano mensal" → COMPRA
Mensagem: "Faz 10 dias e não chegou nada!!" → RECLAMAÇÃO

Mensagem: "{{mensagem_do_cliente}}" →
```

**Cuidado:** os exemplos devem ser variados. Se todos forem parecidos, o modelo copia o padrão superficial.

### 2. Raciocínio em etapas (*chain of thought*)
Para tarefas de análise, peça ao modelo que **pense antes de concluir**:
> "Antes de dar a recomendação, analise passo a passo: (1) receitas, (2) custos fixos, (3) custos variáveis, (4) margem. Só depois apresente a conclusão."

Modelos de raciocínio já fazem isso internamente, mas explicitar as etapas ainda ajuda a controlar **o que** é analisado.

### 3. Encadeamento de prompts (*prompt chaining*)
Divida uma tarefa grande em etapas, e a saída de uma vira a entrada da próxima:
```
Etapa 1: Extraia os pontos principais da transcrição da reunião.
Etapa 2: A partir dos pontos, identifique decisões e responsáveis.
Etapa 3: Redija a ata formal e o e-mail de follow-up.
```
**Vantagens:** mais qualidade, fácil de depurar e cada etapa pode usar um modelo diferente. Essa é a base das automações (M5) e dos agentes (M9).

### 4. Autocrítica e revisão
> "Revise sua resposta anterior como um editor exigente. Liste 3 fraquezas e reescreva a versão final corrigindo-as."

### 5. Perguntas de esclarecimento
> "Antes de começar, faça até 5 perguntas sobre o que falta para você executar esta tarefa com excelência."

Técnica valiosa quando **você** não sabe tudo o que o modelo precisa.

### 6. Saída estruturada (JSON)
Essencial para automações, porque outro sistema vai ler a resposta:
```
Extraia os dados e responda APENAS com JSON válido, sem texto antes ou depois:
{"nome": string, "cnpj": string, "valor": number, "vencimento": "AAAA-MM-DD"}
```
Muitas APIs oferecem o modo "structured outputs" ou "JSON mode", que garante o formato. Use sempre que disponível.

### 7. Prefixo ou âncora de resposta
Comece a resposta pelo modelo para forçar o formato: termine o prompt com `Resposta em tabela:\n| Item |`.

---

## Aula 2.4: Prompts de sistema (a "personalidade" do assistente)

O **prompt de sistema** é a instrução permanente que define como um assistente se comporta em **todas** as conversas. É o que você configura em "Projects" do Claude, "GPTs" do ChatGPT, "Gems" do Gemini, e em qualquer chatbot ou agente que construir.

### Estrutura de um bom prompt de sistema
```markdown
# Identidade
Você é a Bia, assistente virtual da Clínica Sorriso (odontologia, Campinas-SP).

# Objetivo
Ajudar pacientes a agendar avaliações e tirar dúvidas sobre tratamentos.

# Tom de voz
Acolhedor, claro, frases curtas. Trate por "você". Máximo 1 emoji por mensagem.

# Conhecimento
- Endereço, horários e convênios: ver <info_clinica>.
- Tratamentos e faixas de preço: ver <tabela_servicos>.

# Regras
1. Nunca dê diagnóstico ou orientação clínica. Diga: "Isso precisa ser avaliado pelo dentista".
2. Nunca informe preço exato de tratamento; informe a faixa e ofereça avaliação gratuita.
3. Se o paciente relatar dor forte, sangramento ou inchaço: priorize encaixe no mesmo dia e acione a recepção.
4. Se não souber a resposta: "Vou verificar com a equipe e retorno em breve" e marque [ENCAMINHAR_HUMANO].

# Fluxo de agendamento
1. Pergunte nome e melhor período (manhã/tarde).
2. Ofereça 2 horários disponíveis.
3. Confirme e envie o endereço.

<info_clinica>...</info_clinica>
<tabela_servicos>...</tabela_servicos>
```

### Checklist do prompt de sistema
- [ ] Identidade e objetivo claros
- [ ] Tom de voz com exemplos
- [ ] Fontes de conhecimento delimitadas
- [ ] Regras do que **nunca** fazer
- [ ] Critério de encaminhamento a um humano
- [ ] Fluxo principal passo a passo
- [ ] Exemplos de boas respostas (opcional, mas poderoso)

---

## Aula 2.5: Como avaliar prompts (o que separa o amador do profissional)

Amador: "achei a resposta boa". Profissional: **testa com um conjunto de casos e mede**.

### Processo de avaliação
1. **Defina critérios** (3 a 5), por exemplo: correção factual, formato, tom, completude e tamanho.
2. **Monte um conjunto de teste** de 10 a 20 entradas reais e variadas, incluindo **casos difíceis** (cliente grosseiro, pergunta fora do escopo, dado faltando).
3. **Rode o prompt** em todos os casos.
4. **Pontue** cada saída de 1 a 5 em cada critério.
5. **Ajuste** o prompt onde ele falhou e **rode de novo em todos os casos**, porque um ajuste pode quebrar outro caso.
6. **Versione:** v1, v2, v3... com uma anotação do que mudou.

### Planilha de avaliação (modelo)

| Caso | Entrada | Saída v1 | Correção | Formato | Tom | Nota v1 | Saída v2 | Nota v2 |
|---|---|---|---|---|---|---|---|---|
| 1 | "Vocês abrem domingo?" | ... | 5 | 5 | 4 | 4,7 | ... | ... |
| 2 | Cliente xingando | ... | 3 | 5 | 2 | 3,3 | ... | ... |

**Meta:** média ≥ 4,5 e nenhum caso crítico abaixo de 4.

> 💡 Você também pode usar **uma IA como avaliadora** ("LLM como juiz"): dê a ela os critérios e peça uma nota justificada. Isso acelera, mas faça amostragem humana para garantir.

---

## Aula 2.6: Os 12 erros mais comuns

1. Pedido vago ("melhore este texto"). Diga **em que** melhorar.
2. Não informar o público-alvo.
3. Não definir o formato de saída.
4. Colocar várias tarefas não relacionadas em um único prompt.
5. Não fornecer dados da empresa e esperar que a IA "saiba".
6. Aceitar a primeira resposta sem iterar.
7. Usar o mesmo chat para tudo, com o histórico contaminando as respostas.
8. Instruções contraditórias ("seja breve" + "explique em detalhes").
9. Exemplos todos iguais no *few-shot*.
10. Não autorizar o "não sei" em tarefas factuais.
11. Colar dados sensíveis (CPF, dados de saúde) sem necessidade (veja o M10).
12. Não salvar os prompts que funcionaram.

---

## Aula 2.7: Biblioteca de prompts corporativa

Uma biblioteca transforma o uso individual (nível 1) em **uso padronizado** (nível 2). Cada prompt deve ter uma ficha:

```markdown
## [VEN-03] Resposta a objeção de preço
- **Área:** Vendas
- **Quando usar:** cliente diz que está caro
- **Entradas necessárias:** produto, preço, objeção exata do cliente, diferenciais
- **Ferramenta recomendada:** qualquer assistente
- **Versão:** v3 (12/05) · **Nota média nos testes:** 4,6
- **Prompt:**
  Você é um vendedor consultivo de [segmento]...
  (texto completo com {{variáveis}})
- **Exemplo de saída aprovada:** ...
- **Cuidados:** não oferecer desconto acima de 10% sem aprovação.
```

**Organização sugerida:** código por área (VEN, ATD, MKT, FIN, RH, GES, OPS), guardado em Notion, Google Docs ou em "Projects" compartilhados.

---

## Exercícios

**Exercício 1: Reescrita (30 min).** Transforme estes 5 prompts fracos em prompts PCTRFE completos, rode ambas as versões e compare:
1. "Faça um e-mail de cobrança."
2. "Crie uma descrição de produto."
3. "Resuma esta reunião."
4. "Me dê ideias de promoção."
5. "Responda esse cliente."

**Exercício 2: Few-shot de classificação (45 min).** Crie um prompt que classifica mensagens de clientes em 5 categorias e sentimento (positivo/neutro/negativo). Monte 20 mensagens de teste (inclua ironia e mensagens ambíguas). Meça a taxa de acerto sem exemplos e com 4 exemplos.

**Exercício 3: Encadeamento (45 min).** A partir de uma transcrição de reunião (grave uma, ou peça à IA para simular 1 página), construa uma cadeia de 3 prompts: pontos principais → decisões e responsáveis → ata e e-mail. Compare com um prompt único fazendo tudo.

**Exercício 4: Extração em JSON (30 min).** Crie um prompt que extrai de 5 mensagens de pedido (escritas de formas diferentes) os campos: cliente, itens, quantidades, endereço e forma de pagamento, em JSON. Valide cada JSON em um validador online.

**Exercício 5: Prompt de sistema (60 min).** Escreva o prompt de sistema de um assistente de atendimento para a empresa-laboratório (use a estrutura da Aula 2.4). Configure-o em um Project, GPT ou Gem e teste com 15 perguntas, incluindo 5 difíceis.

**Exercício 6: Avaliação formal (60 min).** Pegue o prompt do Exercício 5 e aplique o processo da Aula 2.5: critérios, 15 casos, pontuação, v2 e nova pontuação. Documente a melhora.

---

## Tarefa de campo
Acompanhe (ou entreviste) 2 funcionários da empresa-laboratório por 1 hora cada e anote as tarefas de escrita, leitura e análise que eles fazem. Para cada uma, crie um prompt e **teste com eles**. Colete o feedback: "Isso economizaria seu tempo? Quanto?"

---

## Entregável: Biblioteca de 25 prompts testados
- **25 prompts**, pelo menos 3 por área (Vendas, Atendimento, Marketing, Financeiro, RH, Gestão, Operações).
- Cada prompt em uma **ficha completa** (modelo da Aula 2.7).
- Pelo menos **5 prompts com avaliação formal** (planilha com casos de teste e notas).
- **1 prompt de sistema** completo do assistente da empresa-laboratório.

**Critério de qualidade:** um funcionário que nunca usou IA consegue usar a ficha sozinho e obter um bom resultado.

### Ideias para compor os 25
- **VEN:** qualificação de lead, resposta a objeção, proposta comercial, follow-up após silêncio, roteiro de ligação.
- **ATD:** resposta a reclamação, FAQ, pedido de avaliação, pós-venda.
- **MKT:** legenda, roteiro de Reels, anúncio, e-mail marketing, calendário editorial.
- **FIN:** e-mail de cobrança em 3 tons, análise de DRE, explicação de fluxo de caixa ao sócio.
- **RH:** descrição de vaga, triagem de currículo, roteiro de entrevista, feedback.
- **GES:** ata de reunião, relatório semanal, análise SWOT, plano de ação.
- **OPS:** checklist de processo, procedimento operacional padrão (POP) a partir de um áudio explicativo.

---

## Autoavaliação
1. O que significa cada letra de PCTRFE?
2. Qual a técnica mais eficaz para obter consistência de formato?
3. Quando usar encadeamento em vez de um prompt único?
4. Por que pedir JSON em automações?
5. Cite 5 elementos de um bom prompt de sistema.
6. Por que é preciso rodar **todos** os casos de teste depois de ajustar um prompt?
7. Qual o risco de usar exemplos muito parecidos no *few-shot*?
8. O que é "LLM como juiz" e qual a sua limitação?
9. Por que explicar o "porquê" de uma instrução melhora o resultado?
10. Qual a diferença entre o nível 1 (uso individual) e o nível 2 (uso padronizado) de IA?

<details>
<summary><strong>Gabarito</strong></summary>

1. Papel, Contexto, Tarefa, Restrições, Formato, Exemplos.
2. *Few-shot*: fornecer exemplos de entrada e saída.
3. Em tarefas complexas com etapas distintas, em que cada etapa pode ser verificada, depurada ou feita por um modelo diferente.
4. Porque outro sistema (planilha, CRM, automação) precisa ler a resposta de forma estruturada e previsível.
5. Identidade, objetivo, tom de voz, fontes de conhecimento, regras de proibição, critério de encaminhamento a um humano, fluxo principal e exemplos (quaisquer 5).
6. Porque a correção de um caso pode piorar outros (regressão).
7. O modelo copia padrões superficiais e falha em entradas diferentes.
8. Usar uma IA para avaliar saídas de outra com base em critérios. A limitação é que ela pode errar ou ser enviesada, então é preciso amostragem humana.
9. O modelo entende a intenção e aplica a regra corretamente em situações não previstas.
10. No nível 1, cada pessoa usa do seu jeito. No nível 2, há prompts, padrões e boas práticas compartilhados, com qualidade consistente.
</details>
