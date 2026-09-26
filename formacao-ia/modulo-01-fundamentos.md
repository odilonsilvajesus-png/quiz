# Módulo 1: Como a IA funciona

**Semanas 1 e 2 · cerca de 18 horas**

## Objetivos de aprendizagem
Ao final deste módulo você será capaz de:
1. Explicar para um empresário, sem jargão, como funciona um modelo de linguagem (LLM).
2. Distinguir o que a IA generativa faz bem do que ela faz mal.
3. Entender tokens, janela de contexto, temperatura e custo por uso.
4. Reconhecer e reduzir alucinações.
5. Escolher o tipo de modelo adequado a cada tarefa (texto, imagem, voz, raciocínio).

---

## Aula 1.1: O que é Inteligência Artificial, de verdade

**IA** é o campo que cria sistemas capazes de executar tarefas que normalmente exigiriam inteligência humana: reconhecer padrões, entender linguagem, tomar decisões e gerar conteúdo.

Existem três "camadas" que você precisa saber diferenciar:

| Camada | O que é | Exemplo em PME |
|---|---|---|
| **IA (geral)** | Qualquer sistema que imita alguma capacidade cognitiva | Regras de antifraude no cartão |
| **Machine Learning (aprendizado de máquina)** | Sistemas que **aprendem padrões a partir de dados**, em vez de seguir regras escritas à mão | Previsão de demanda com base nas vendas passadas |
| **IA generativa** | Modelos de ML que **geram conteúdo novo** (texto, imagem, áudio, código) | Responder clientes no WhatsApp, criar posts, resumir contratos |

Até 2022, usar IA exigia cientistas de dados, grandes volumes de dados próprios e meses de projeto. **A IA generativa mudou isso**: modelos já treinados, acessíveis por chat ou API, resolvem tarefas de linguagem sem treinamento específico. É por isso que a IA ficou viável para PMEs.

### A virada para PMEs
- **Antes:** a IA era um projeto de dados, caro e demorado.
- **Agora:** a IA é uma ferramenta de trabalho. O gargalo deixou de ser técnico e passou a ser **saber onde aplicar, como integrar ao processo e como fazer as pessoas usarem**. É exatamente esse o papel do especialista que você vai ser.

---

## Aula 1.2: Como um LLM funciona (sem matemática)

**LLM** (*Large Language Model*, modelo de linguagem de grande escala) é o motor por trás de Claude, ChatGPT e Gemini.

### A ideia central: prever a próxima palavra
Um LLM foi treinado com uma quantidade enorme de texto (livros, sites, códigos) para fazer uma coisa: **dado um texto, prever qual é a continuação mais provável**.

> "O cliente pediu o reembolso porque o produto chegou ___"
> O modelo calcula probabilidades: "quebrado" (alta), "atrasado" (alta), "azul" (baixa)...

Ao repetir essa previsão palavra por palavra, ele escreve respostas inteiras. Para prever bem, o modelo teve de "absorver" gramática, fatos, estilos, raciocínios e padrões de milhões de documentos.

### As 3 fases de construção de um LLM
1. **Pré-treinamento:** o modelo lê trilhões de palavras e aprende a prever texto. Resultado: um modelo que "sabe muito", mas não sabe conversar.
2. **Ajuste fino por instrução:** o modelo aprende com exemplos de perguntas e boas respostas, e passa a seguir instruções.
3. **Alinhamento com feedback humano:** pessoas avaliam respostas e o modelo aprende a ser útil, honesto e seguro.

### Analogia para usar em palestras
> "Imagine um estagiário que leu toda a biblioteca do mundo, é rapidíssimo e incansável, **mas começou hoje na sua empresa**: não conhece seus clientes, seus preços nem suas regras. E, quando não sabe algo, às vezes inventa com muita confiança. A IA é esse estagiário. Seu trabalho é dar a ele **contexto, instruções claras e supervisão**."

Essa analogia explica, de uma vez: por que o prompt importa (instruções), por que o RAG importa (contexto da empresa), por que a revisão humana importa (alucinação) e por que o ganho é enorme (velocidade e escala).

---

## Aula 1.3: Tokens, contexto, temperatura e custo

### Tokens
O modelo não lê palavras, lê **tokens**: pedaços de palavra. Em português, **1 token ≈ 3 a 4 caracteres**, ou cerca de **0,6 a 0,75 palavra**.
- "Atendimento" pode virar 2 ou 3 tokens.
- Uma página A4 de texto tem **cerca de 500 a 700 tokens**.

**Por que importa:** as APIs cobram **por token**, tanto de entrada (o que você envia) quanto de saída (o que o modelo gera). Tokens de saída costumam custar várias vezes mais que os de entrada.

### Janela de contexto
É a quantidade máxima de tokens que o modelo consegue "ver" de uma vez: instruções, histórico da conversa, documentos anexados e a própria resposta. Os modelos atuais têm janelas de centenas de milhares de tokens (algumas passam de 1 milhão). Isso equivale a centenas de páginas.

**Implicações práticas:**
- Conversas muito longas "esquecem" ou diluem instruções do início. **Dica:** para uma tarefa nova, abra um chat novo.
- Nem tudo cabe no contexto. Para uma base de conhecimento grande, você vai usar **RAG** (Módulo 8).
- Quanto mais contexto enviado, maior o custo e a latência (tempo de resposta).

### Temperatura
Parâmetro que controla a **aleatoriedade** da resposta (disponível em APIs e em algumas ferramentas):
- **Baixa (0 a 0,3):** respostas consistentes e previsíveis. Use para extração de dados, classificação e atendimento.
- **Alta (0,7 a 1):** respostas mais variadas e criativas. Use para brainstorm e ideias de conteúdo.

### Custo: como estimar
```
Custo por execução = (tokens de entrada × preço de entrada) + (tokens de saída × preço de saída)
Custo mensal = custo por execução × execuções por mês
```
**Exemplo:** um atendimento no WhatsApp usa em média 3.000 tokens de entrada (instruções + histórico + FAQ) e 300 de saída. Com 2.000 conversas por mês de 5 mensagens cada, são 10.000 chamadas. Consulte a tabela de preços atual do fornecedor e calcule. Na maioria dos casos de PME, o custo mensal de API fica na casa das **dezenas a poucas centenas de reais**, bem abaixo do custo de uma hora humana equivalente.

> ⚠️ Preços mudam com frequência. **Sempre confira a página oficial de preços** do fornecedor antes de orçar para um cliente.

---

## Aula 1.4: Alucinações e limites

**Alucinação** é quando o modelo gera uma informação falsa com aparência de verdadeira: cita uma lei inexistente, inventa o preço de um produto ou cria um dado estatístico.

### Por que acontece
O modelo gera o texto **mais provável**, e não o texto **verdadeiro**. Quando ele não tem a informação, a continuação "mais provável" pode ser algo que *parece* correto.

### Onde a IA é forte e onde é fraca

| Forte ✅ | Fraca ⚠️ |
|---|---|
| Resumir, reescrever e traduzir | Fatos muito específicos ou recentes sem fonte fornecida |
| Classificar e extrair dados de textos | Cálculos longos (sem ferramenta de código) |
| Redigir rascunhos (e-mails, posts, propostas) | Informações internas da empresa (se não as receber) |
| Brainstorm e variações | Decisões críticas sem supervisão (jurídico, médico, crédito) |
| Responder com base em documentos fornecidos | Consistência absoluta de 100% das vezes |
| Analisar sentimento, intenção e tom | Saber quando não sabe (melhora com instrução explícita) |

### 6 técnicas para reduzir alucinação
1. **Dê a fonte:** "Responda **apenas** com base no documento abaixo."
2. **Autorize o "não sei":** "Se a informação não estiver no documento, responda 'Não tenho essa informação' e encaminhe para um atendente."
3. **Peça citações:** "Indique o trecho do documento que sustenta cada afirmação."
4. **Diminua a temperatura** em tarefas factuais.
5. **Divida tarefas complexas** em etapas menores.
6. **Revisão humana** em tudo que tem impacto jurídico, financeiro ou de reputação.

---

## Aula 1.5: Tipos de modelos e quando usar cada um

| Tipo | O que faz | Uso em PME |
|---|---|---|
| **LLM de texto (chat)** | Conversa, escreve, analisa | Atendimento, propostas, resumos |
| **Modelos de raciocínio** ("pensamento estendido") | Pensam em etapas antes de responder; melhores em lógica, matemática, planejamento | Análise financeira, diagnóstico, planejamento |
| **Modelos rápidos e baratos** (versões "mini", "flash", "haiku") | Menos capazes, muito mais baratos e rápidos | Classificação em volume, triagem, extração simples |
| **Multimodais (visão)** | Leem imagens, PDFs escaneados, prints, fotos | Ler notas fiscais, comprovantes, cardápios, planilhas fotografadas |
| **Geração de imagem** | Criam imagens a partir de texto | Criativos, mockups, ilustrações |
| **Voz (transcrição e fala)** | Áudio → texto e texto → áudio | Transcrever áudios do WhatsApp, reuniões, URA inteligente |
| **Embeddings** | Transformam texto em vetores numéricos que representam significado | Busca semântica e RAG (Módulo 8) |

### Regra prática de escolha
1. Comece com o **modelo mais capaz** para validar se a tarefa é possível.
2. Depois de funcionar, teste um **modelo mais barato**. Se a qualidade se mantiver, troque.
3. Para volume alto e tarefas simples, use o modelo rápido. Para decisões complexas, use o modelo de raciocínio.

---

## Aula 1.6: O mapa das aplicações de IA em PMEs

Use este mapa em diagnósticos e palestras. Ele organiza **onde** a IA gera valor:

| Área | Aplicações típicas | Tipo de ganho |
|---|---|---|
| **Vendas** | Qualificação de leads, follow-up, propostas, roteiros de ligação | Receita |
| **Atendimento** | FAQ automatizado, triagem, 2ª via, status de pedido | Custo + experiência |
| **Marketing** | Posts, anúncios, e-mails, SEO, análise de concorrentes | Receita + produtividade |
| **Financeiro** | Conciliação, leitura de notas, cobrança, relatórios | Custo + menos erros |
| **Operações** | Pedidos, estoque, agendamentos, checklists | Custo + velocidade |
| **RH** | Triagem de currículos, onboarding, manual do funcionário | Produtividade |
| **Gestão** | Relatórios automáticos, análise de indicadores, atas | Qualidade de decisão |
| **Jurídico/Administrativo** | Resumo de contratos, minutas, organização de documentos | Produtividade |

### Os 4 níveis de uso de IA em uma empresa
1. **Uso individual:** funcionários usam chat de IA por conta própria.
2. **Uso padronizado:** prompts, modelos e boas práticas compartilhados.
3. **Automação:** a IA embutida em processos, rodando sem alguém pedir.
4. **Agentes e sistemas:** a IA executa tarefas de várias etapas integrada aos sistemas da empresa.

A maioria das PMEs está entre os níveis 0 e 1. **Seu trabalho é levá-las aos níveis 2, 3 e 4.**

---

## Exercícios

**Exercício 1: Teste comparativo (45 min).** Escolha 3 tarefas de uma PME:
- (a) Escrever uma resposta a um cliente irritado com atraso na entrega.
- (b) Extrair nome, CNPJ, valor e vencimento de um texto de boleto (invente um).
- (c) Criar 5 ideias de post para uma padaria.

Rode as 3 tarefas em **3 assistentes** (Claude, ChatGPT, Gemini). Registre em uma tabela: qualidade (nota de 1 a 5), tempo e observações. **Conclusão esperada:** a diferença entre modelos existe, mas **a qualidade do pedido pesa mais que a escolha do modelo**.

**Exercício 2: Contando tokens (20 min).** Use um contador de tokens público (por exemplo, o tokenizer da OpenAI na web) e cole: um parágrafo em português, o mesmo em inglês, e uma tabela. Anote quantos tokens cada um tem e compare.

**Exercício 3: Provocando alucinações (30 min).** Pergunte a um assistente, sem acesso à web:
- "Qual o faturamento de 2023 da [padaria pequena do seu bairro]?"
- "Qual artigo da CLT trata de [tema bem específico]? Cite o texto integral."

Depois repita, acrescentando: "Se não souber com certeza, diga que não sabe." Registre a diferença.

**Exercício 4: Estimativa de custo (30 min).** Calcule o custo mensal de API para uma loja que recebe 1.500 mensagens por mês, com 2.500 tokens de entrada e 250 de saída por mensagem. Use a tabela de preços oficial de **dois modelos** (um grande e um rápido) e compare.

**Exercício 5: Multimodalidade (30 min).** Tire foto de uma nota fiscal, cupom ou cardápio. Peça a um assistente para extrair os dados em tabela. Avalie a precisão item a item.

**Exercício 6: Mapa de aplicações da empresa-laboratório (45 min).** Usando a tabela da Aula 1.6, liste pelo menos 3 aplicações possíveis por área na sua empresa-laboratório. Isso é um rascunho, e será aprofundado no Módulo 3.

---

## Tarefa de campo
Converse por 30 minutos com o dono ou gestor da empresa-laboratório e pergunte:
1. "Você ou sua equipe já usam IA? Para quê?"
2. "O que mais consome tempo da equipe hoje?"
3. "Qual o maior medo que você tem sobre IA?"

Registre as respostas no diário de bordo. Elas vão alimentar o diagnóstico (M3) e suas palestras, porque são objeções reais.

---

## Entregável: "IA explicada para empresários"
Um documento de **1 a 2 páginas** com:
1. O que é IA generativa (um parágrafo, com a analogia do estagiário ou uma sua).
2. O que ela faz bem e o que ela faz mal (tabela).
3. Três exemplos concretos de aplicação em PMEs, com o ganho de cada um.
4. Os 3 cuidados essenciais (alucinação, dados sensíveis e revisão humana).

**Critério de qualidade:** um empresário sem conhecimento técnico lê em 5 minutos e entende. Teste com uma pessoa real.

➡️ Este documento vira a **base da Palestra 1**.

---

## Autoavaliação

1. Qual a diferença entre Machine Learning e IA generativa?
2. Por que um LLM pode alucinar?
3. Aproximadamente quantos tokens tem uma página A4 de texto?
4. Qual temperatura você usaria para extrair dados de notas fiscais? Por quê?
5. Cite 3 técnicas para reduzir alucinações.
6. Um cliente quer que a IA responda sobre os preços da tabela da empresa dele. O que você precisa fornecer ao modelo?
7. Quando vale usar um modelo "rápido e barato" em vez do mais capaz?
8. Quais são os 4 níveis de uso de IA em uma empresa?
9. Por que conversas muito longas podem piorar a qualidade das respostas?
10. Qual o principal gargalo para adoção de IA em PMEs hoje: técnico ou de aplicação? Justifique.

<details>
<summary><strong>Gabarito</strong></summary>

1. ML aprende padrões a partir de dados para prever e classificar. A IA generativa é um tipo de ML que **gera conteúdo novo** (texto, imagem etc.).
2. Porque ele gera o texto **mais provável**, e não o verificado como verdadeiro. Sem a informação, a continuação provável pode ser falsa.
3. Entre 500 e 700 tokens.
4. Baixa (0 a 0,3), porque a tarefa exige consistência e precisão, não criatividade.
5. Fornecer a fonte, autorizar o "não sei", pedir citações, baixar a temperatura, dividir a tarefa e revisar com um humano (quaisquer 3).
6. A tabela de preços atualizada no contexto (no prompt ou via RAG), com instrução para responder apenas com base nela.
7. Em tarefas simples e de alto volume (classificação, triagem, extração), depois de validar que a qualidade se mantém.
8. Uso individual → uso padronizado → automação → agentes e sistemas.
9. Instruções do início se diluem em muito contexto, e o histórico pode trazer informações conflitantes. Além disso, o custo e a latência aumentam.
10. De aplicação: saber onde aplicar, integrar ao processo e fazer as pessoas adotarem. A tecnologia já está acessível.
</details>

---

## Para aprofundar (opcional)
- Documentação oficial de "prompt engineering" e "model overview" da Anthropic, da OpenAI e do Google (em inglês, mas com ótimos exemplos).
- Vídeo introdutório de Andrej Karpathy, *"Intro to Large Language Models"* (YouTube), a melhor explicação acessível de como LLMs funcionam.
- Anote no diário de bordo 3 conceitos que ainda não ficaram claros e pergunte a um assistente de IA: "Explique [conceito] para um empresário, com um exemplo de padaria."
