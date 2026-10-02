# Glossário

Termos técnicos usados na formação, explicados em português simples. Entre parênteses, o módulo em que o termo é aprofundado.

---

**ADR (Architecture Decision Record):** registro curto de uma decisão de arquitetura: contexto, opções, decisão e motivos. (3.3)

**Agente (de IA):** sistema em que o modelo decide sozinho os próximos passos para atingir um objetivo, usando ferramentas e repetindo até concluir. (3.6)

**Agente de código:** ferramenta de IA que lê, escreve, executa e corrige código num projeto (ex.: Claude Code, Codex). (3.2)

**Alucinação:** quando a IA gera informação falsa com aparência de verdadeira. (1.1)

**ANPD:** Autoridade Nacional de Proteção de Dados, órgão que fiscaliza a LGPD. (4.4)

**API:** interface que permite que sistemas conversem entre si por meio de requisições padronizadas. (3.1)

**AS-IS / TO-BE:** mapa de um processo como ele é hoje / como deve ficar. (2.2)

**Base legal:** hipótese da LGPD que autoriza um tratamento de dados (ex.: execução de contrato, legítimo interesse, consentimento). (4.4)

**Batch (lote):** processamento de muitas tarefas de uma vez, sem urgência, geralmente com desconto. (2.5)

**Benchmark:** teste padronizado para comparar modelos; não substitui testes com os seus casos. (1.4)

**Business case:** análise de custo, benefício, ROI e payback de uma solução. (2.5)

**Cache de prompt:** recurso que reaproveita partes repetidas do prompt com custo menor. (2.5)

**Chunk / chunking:** trecho de documento / divisão de documentos em trechos para o RAG. (3.5)

**Computer use:** capacidade da IA de ver a tela e controlar mouse e teclado. (3.7)

**Contexto (janela de contexto):** tudo o que o modelo "enxerga" numa chamada (instruções, documentos, histórico), medido em tokens. (1.1)

**Controlador / Operador:** na LGPD, quem decide sobre o tratamento / quem trata em nome do controlador. (4.4)

**Cron:** expressão que define horários de execução agendada. (4.2)

**DPA (Data Processing Agreement):** contrato/aditivo que regula o tratamento de dados pessoais por um fornecedor. (4.4)

**DPO / Encarregado:** pessoa responsável pelo canal entre a empresa, os titulares e a ANPD. (4.4)

**Embedding:** representação numérica do significado de um texto, usada na busca semântica. (3.5)

**Engenharia de contexto:** escolher e organizar as informações que acompanham a instrução ao modelo. (1.2)

**Engenharia de prompt:** técnica de escrever instruções claras e eficazes para a IA. (1.2)

**Eval (avaliação):** conjunto de casos de teste com critérios de correção para medir a qualidade de uma solução de IA. (4.1)

**Few-shot:** técnica de incluir exemplos no prompt. (1.2)

**Fine-tuning (ajuste fino):** retreinar um modelo com dados específicos; raramente necessário em PME. (3.5)

**Humano no loop:** pontos em que uma pessoa revisa ou aprova o trabalho da IA. (3.3)

**Idempotência:** propriedade de uma operação que, executada duas vezes, não gera efeito duplicado. (4.2)

**JSON:** formato de texto padrão para troca de dados entre sistemas. (3.1)

**JSON Schema:** especificação do formato que um JSON deve ter; usado para forçar saídas estruturadas. (3.1)

**Latência:** tempo de resposta. (4.2)

**LGPD:** Lei Geral de Proteção de Dados (Lei nº 13.709/2018). (4.4)

**LLM (Large Language Model):** modelo de linguagem de grande porte, como Claude, GPT e Gemini. (1.1)

**LLM-juiz:** uso de um modelo de IA para avaliar respostas de outro, com base numa rubrica. (4.1)

**Lock-in:** dependência excessiva de um fornecedor, que dificulta a troca. (1.3)

**MCP (Model Context Protocol):** padrão aberto para conectar aplicações de IA a sistemas e dados. (3.4)

**Modelo de pesos abertos (open weights):** modelo cujos parâmetros são públicos e podem rodar em infraestrutura própria. (Caso 08)

**Multimodal:** modelo que entende (e às vezes gera) mais de um tipo de conteúdo: texto, imagem, áudio. (1.1)

**Payback:** tempo para o investimento se pagar. (2.5)

**Prompt de sistema:** instrução permanente que define identidade, regras e comportamento de um assistente. (1.2)

**Prompt injection:** tentativa de manipular a IA com instruções maliciosas, diretas ou escondidas em conteúdo. (4.3)

**Quantização:** técnica para reduzir o tamanho de um modelo e rodá-lo em hardware mais simples. (Caso 08)

**RAG (Retrieval-Augmented Generation):** técnica em que o sistema busca trechos relevantes numa base de conhecimento antes de a IA responder. (3.5)

**Raciocínio estendido:** modo em que o modelo "pensa" antes de responder, melhorando tarefas complexas. (1.1)

**Red teaming:** atacar a própria solução para encontrar falhas de segurança. (4.3)

**RIPD:** Relatório de Impacto à Proteção de Dados Pessoais. (4.4)

**ROI:** retorno sobre o investimento. (2.5)

**Runbook:** manual de operação de uma solução em produção. (4.2)

**Saída estruturada:** resposta da IA num formato fixo (geralmente JSON), garantido por schema. (1.2, 3.1)

**Skill:** pacote de instruções e arquivos que ensina a IA a executar uma tarefa do jeito da empresa. (3.4)

**SLA:** acordo de nível de serviço (tempos de resposta, disponibilidade, inclusões). (5.5)

**SQL:** linguagem para consultar e manipular bancos de dados relacionais. (3.1)

**TCO (custo total de propriedade):** soma de todos os custos de uma solução ao longo do tempo. (2.5)

**Temperatura:** parâmetro que controla a variação/criatividade das respostas. (1.1)

**Token:** pedaço de texto que o modelo processa; base de limites e cobrança. (1.1)

**Tool use (uso de ferramentas):** capacidade do modelo de chamar funções externas (consultar estoque, enviar e-mail). (1.1, 3.6)

**Webhook:** aviso automático que um sistema envia para uma URL quando um evento acontece. (3.1)

**Workflow:** sequência de etapas definidas em código, algumas com IA. (3.3)

---

**Voltar:** [Início](README.md)
