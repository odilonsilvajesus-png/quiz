# Módulo 8: Dados e base de conhecimento (RAG)

**Semanas 18 e 19 · cerca de 18 horas**

## Objetivos de aprendizagem
1. Usar IA para analisar dados de planilhas e sistemas com confiabilidade.
2. Entender como o RAG funciona: documentos, divisão em trechos (chunking), embeddings, busca vetorial e geração.
3. Preparar documentos da empresa para uma base de conhecimento de qualidade.
4. Construir uma base de conhecimento com ferramenta pronta e com n8n.
5. Avaliar a qualidade do RAG com um conjunto de perguntas de teste.

---

## Aula 8.1: IA para análise de dados

### O que a IA faz bem com dados
- **Explicar** planilhas, fórmulas e relatórios.
- **Escrever fórmulas** (PROCV/XLOOKUP, SOMASES, tabelas dinâmicas) e scripts.
- **Analisar arquivos** (CSV/Excel) usando **execução de código**: os assistentes com análise de dados escrevem e rodam Python sobre o arquivo, e o resultado é calculado, não "chutado".
- **Interpretar** os resultados e sugerir hipóteses.
- **Limpar dados:** padronizar nomes, datas, telefones, remover duplicados.

### Regras de confiabilidade
1. Prefira assistentes que **executam código** para cálculos, e confira se o código de fato rodou.
2. **Valide 2 ou 3 números** manualmente (totais, contagens).
3. Peça as **premissas**: "Quais suposições você fez sobre os dados?"
4. Anonimize dados pessoais antes de enviar (veja o M10B).

### Prompt modelo: análise de vendas
```
Você é um analista de dados de varejo. Anexei as vendas de jan–jun (CSV).
1. Descreva a estrutura dos dados e aponte problemas de qualidade.
2. Calcule: faturamento por mês, ticket médio, top 10 produtos, curva ABC.
3. Identifique sazonalidade e anomalias.
4. Gere 2 gráficos úteis para o dono.
5. Liste 5 insights acionáveis, cada um com a evidência numérica.
Use execução de código para todos os cálculos.
```

---

## Aula 8.2: O que é RAG e por que ele importa

**RAG** (*Retrieval-Augmented Generation*, geração aumentada por recuperação) é a técnica que permite à IA responder **com base nos documentos da empresa**, sem que eles precisem caber inteiros no prompt nem que o modelo seja retreinado.

### Como funciona
```
PREPARAÇÃO (uma vez, e a cada atualização)
Documentos → divididos em trechos (chunks) → cada trecho vira um vetor (embedding) → guardado num banco vetorial

CONSULTA (a cada pergunta)
Pergunta → vira vetor → busca os trechos mais parecidos em significado → trechos + pergunta vão para o LLM → resposta com base nos trechos (e citação da fonte)
```

### Conceitos
- **Embedding:** representação numérica do **significado** de um texto. Textos com sentido parecido têm vetores próximos, mesmo com palavras diferentes ("prazo de entrega" ≈ "quanto tempo demora pra chegar").
- **Banco vetorial:** banco especializado em buscar vetores próximos (exemplos: Supabase/pgvector, Pinecone, Qdrant, ou o armazenamento embutido de ferramentas).
- **Chunking:** a divisão dos documentos em pedaços (tipicamente 300 a 1.000 tokens, com alguma sobreposição).
- **Top-k:** quantos trechos recuperar por pergunta (tipicamente de 3 a 8).

### Quando usar cada abordagem

| Situação | Solução |
|---|---|
| Poucos documentos (cabem no contexto, por exemplo um FAQ de 20 páginas) | **Colocar tudo no prompt ou num Project.** É mais simples e muitas vezes mais preciso |
| Muitos documentos, atualizados com frequência | **RAG** |
| Dados estruturados (estoque, pedidos, preços que mudam) | **Consulta direta ao sistema/banco** (ferramenta ou API, ver M9). Não use RAG para isso |
| Estilo ou formato muito específico | Exemplos no prompt; fine-tuning só em casos raros |

> 💡 Erro comum: construir RAG para 10 páginas de documentos. **Comece sempre pelo mais simples.**

---

## Aula 8.3: Preparação de documentos (80% da qualidade)

"Lixo entra, lixo sai." A qualidade do RAG depende mais **dos documentos** que da tecnologia.

### Checklist de preparação
- [ ] **Inventário:** liste todos os documentos (manuais, políticas, FAQ, tabelas, contratos-modelo, procedimentos).
- [ ] **Atualidade:** remova versões antigas e contraditórias (se houver 3 tabelas de preço, a IA vai misturar).
- [ ] **Formato:** prefira texto (Markdown, Docs, PDF com texto selecionável). PDFs escaneados precisam de OCR.
- [ ] **Estrutura:** títulos e subtítulos claros; uma ideia por seção.
- [ ] **Autossuficiência:** cada seção deve fazer sentido sozinha. Em vez de "conforme item anterior", escreva a regra completa.
- [ ] **Tabelas:** converta tabelas complexas em linhas descritivas ou mantenha-as em Markdown.
- [ ] **Metadados:** para cada documento, registre título, área, data de atualização e responsável.
- [ ] **Sensibilidade:** retire dados pessoais e informações que nem todos podem ver.

### Técnica: FAQ reescrito
Converta manuais longos em **perguntas e respostas**. A IA pode ajudar: "Transforme este manual em 40 perguntas e respostas autossuficientes, na linguagem que um funcionário novo usaria." Revise com o responsável.

---

## Aula 8.4: Construindo a base de conhecimento

### Opção 1: ferramentas prontas (comece aqui)
- **Projects (Claude) / GPTs (ChatGPT) / Gems (Gemini):** suba os documentos e escreva as instruções. Ideal para uso interno da equipe.
- **NotebookLM (Google):** ótimo para estudar e consultar documentos com citações.
- **Vantagem:** rápido e sem código. **Limite:** menos controle, integração limitada com outros canais.

### Opção 2: RAG com n8n (para integrar ao WhatsApp, site ou sistemas)
**Fluxo de ingestão:**
1. Gatilho: arquivo novo ou atualizado numa pasta do Drive.
2. Carregar o documento (nó "Default Data Loader").
3. Dividir em trechos (nó "Text Splitter", por exemplo "Recursive Character", com tamanho de ~800 e sobreposição de ~100).
4. Gerar embeddings (nó de embeddings do provedor escolhido).
5. Gravar no banco vetorial (por exemplo, Supabase Vector Store), com metadados (nome do arquivo, data).

**Fluxo de consulta:**
1. Gatilho: mensagem (chat, WhatsApp, webhook).
2. Nó **AI Agent** com a ferramenta "Vector Store Tool" apontando para a base.
3. Prompt de sistema: "Responda apenas com base na base de conhecimento. Cite o documento-fonte. Se não encontrar, diga que não sabe e encaminhe."
4. Resposta → canal.

### Instruções essenciais para o assistente RAG
```
- Use SOMENTE as informações recuperadas da base de conhecimento.
- Ao final de cada resposta, indique: "Fonte: [nome do documento], atualizado em [data]".
- Se as informações recuperadas forem insuficientes ou contraditórias, diga isso
  e sugira quem procurar: [responsável por área].
- Não complete lacunas com conhecimento geral quando o assunto for política interna.
```

---

## Aula 8.5: Avaliando a qualidade do RAG

### O conjunto de 30 perguntas
Crie **30 perguntas com a resposta correta conhecida**:
- 15 perguntas diretas ("Qual o prazo de troca?")
- 5 perguntas com outras palavras ("Comprei e não gostei, e agora?")
- 5 perguntas que exigem combinar 2 documentos
- 5 perguntas **sem resposta na base** (o correto é dizer "não sei")

### Métricas
| Métrica | Pergunta | Meta |
|---|---|---|
| **Precisão** | A resposta está correta? | ≥ 90% |
| **Fidelidade** | A resposta usa só o que está nos documentos (sem invenção)? | 100% |
| **Recuperação** | O trecho certo foi encontrado? | ≥ 90% |
| **Recusa correta** | Nas perguntas sem resposta, disse que não sabe? | 100% |

### Se falhar, onde mexer
| Sintoma | Causa provável | Ajuste |
|---|---|---|
| Não encontra a informação que existe | Chunk ruim, pergunta com vocabulário diferente | Reescrever o documento em FAQ; ajustar o tamanho do chunk; aumentar o top-k |
| Mistura informações | Documentos contraditórios ou desatualizados | Limpar versões antigas |
| Inventa | Instrução fraca | Reforçar "somente com base"; baixar a temperatura |
| Resposta incompleta | Top-k baixo; informação espalhada | Aumentar o top-k; consolidar documentos |

---

## Exercícios

**Exercício 1: Análise de planilha (60 min).** Use um CSV de vendas (real anonimizado, ou gere um fictício com 500 linhas pedindo à IA). Aplique o prompt da Aula 8.1 e valide 3 números manualmente.

**Exercício 2: Preparação de documentos (60 min).** Pegue 3 documentos da empresa-laboratório e aplique o checklist da Aula 8.3. Converta um deles em FAQ.

**Exercício 3: Project ou NotebookLM (45 min).** Monte uma base em ferramenta pronta e teste 10 perguntas.

**Exercício 4: RAG no n8n (2 a 3 h).** Construa os fluxos de ingestão e de consulta da Aula 8.4 com um banco vetorial gratuito (por exemplo, o plano gratuito do Supabase).

**Exercício 5: Avaliação (60 min).** Aplique as 30 perguntas nas duas versões (pronta × n8n) e compare as métricas.

---

## Tarefa de campo
Construa o **"cérebro da empresa"** para a empresa-laboratório: uma base com manuais, políticas e FAQ que a equipe consulta (ou que alimenta o agente do M6). Treine 2 funcionários e colete o feedback após 1 semana: "Quantas vezes usou? Encontrou o que precisava?"

---

## Entregável
- Base de conhecimento funcionando.
- Inventário de documentos com metadados.
- Planilha de avaliação com as 30 perguntas e métricas (antes e depois dos ajustes).
- Ficha de automação (fluxos de ingestão e consulta).

---

## Autoavaliação
1. O que é RAG, em uma frase?
2. O que é um embedding?
3. Quando **não** usar RAG?
4. Por que a preparação dos documentos importa mais que a tecnologia?
5. Quais os 4 tipos de perguntas no conjunto de teste?
6. O RAG está misturando preços antigos e novos. Qual a causa e a solução?
7. Por que dados de estoque não devem ir para o RAG?
8. Qual a regra de confiabilidade mais importante para cálculos com IA?

<details>
<summary><strong>Gabarito</strong></summary>

1. Técnica que busca os trechos relevantes dos documentos da empresa e os entrega ao modelo para que ele responda com base neles.
2. Uma representação numérica (vetor) do significado de um texto, que permite buscar por semelhança de sentido.
3. Quando os documentos cabem no contexto (é mais simples colocar tudo no prompt) e para dados estruturados que mudam (use consulta direta ao sistema).
4. Porque documentos desatualizados, contraditórios ou mal estruturados geram respostas erradas, qualquer que seja a tecnologia.
5. Diretas, com outras palavras, combinando 2 documentos, e sem resposta na base.
6. Há documentos desatualizados ou contraditórios na base. Remova as versões antigas e mantenha uma fonte única com data.
7. Porque mudam constantemente e exigem precisão. O correto é consultar o sistema em tempo real via API/ferramenta.
8. Usar execução de código (ou fórmulas) para os cálculos e validar números manualmente.
</details>
