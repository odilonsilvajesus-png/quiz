# Módulo 3: Análise estrutural e identificação de oportunidades

**Semanas 5 a 7 · cerca de 27 horas**

> Este é o módulo mais importante da formação. Ferramentas qualquer pessoa aprende; **saber onde aplicar IA com retorno** é o que faz de você um especialista e um consultor que cobra bem.

## Objetivos de aprendizagem
1. Conduzir entrevistas de diagnóstico com donos e equipe.
2. Mapear processos (fluxograma e SIPOC) e identificar gargalos.
3. Avaliar a maturidade da empresa com o **Diagnóstico em 5 camadas**.
4. Identificar e **pontuar oportunidades** com critérios objetivos.
5. Construir um **roadmap de 90 dias**.
6. Redigir e apresentar um relatório de diagnóstico profissional.

---

## Aula 3.1: A mentalidade certa ("problema primeiro, IA depois")

O erro nº 1 de quem começa: **chegar com a solução** ("vamos colocar um chatbot!"). O especialista chega com **perguntas**.

### Os 3 princípios
1. **Negócio antes de tecnologia.** Toda iniciativa de IA deve se ligar a um de 4 resultados: **aumentar receita, reduzir custo, reduzir risco ou melhorar a experiência** (do cliente ou do funcionário).
2. **Processo antes de automação.** Automatizar um processo ruim gera um processo ruim mais rápido. Às vezes a melhor recomendação é "padronize primeiro".
3. **Pequeno, medido, escalado.** Comece com uma vitória rápida (2 a 4 semanas), meça e depois expanda.

### Sinais de que uma tarefa é boa candidata para IA
- É **repetitiva** e frequente.
- Envolve **texto, voz ou imagem** (ler, escrever, classificar, resumir, responder).
- Segue **um padrão** (existe um "jeito certo" de fazer).
- Hoje consome **tempo de pessoas caras** ou causa **atrasos** para o cliente.
- O **erro é tolerável** ou pode ser revisado por alguém.

### Sinais de alerta (cuidado ou não aplicar)
- Decisão de alto impacto sem possibilidade de revisão (crédito, diagnóstico médico, demissão).
- O processo não existe ou muda toda semana.
- Os dados necessários não existem ou estão inacessíveis.
- Volume muito baixo (automatizar algo que acontece 2 vezes por mês raramente compensa).

---

## Aula 3.2: O Diagnóstico em 5 camadas

Framework para avaliar a **prontidão** da empresa para IA. Dê uma nota de 1 a 5 em cada camada.

| Camada | Nota 1 (inicial) | Nota 3 (intermediário) | Nota 5 (avançado) |
|---|---|---|---|
| **1. Estratégia** | Ninguém pensou em IA; sem objetivos claros de negócio | Dono interessado; objetivos gerais ("crescer") | Metas claras e mensuráveis; IA vista como alavanca para elas |
| **2. Processos** | Tudo "na cabeça" das pessoas; cada um faz de um jeito | Processos principais conhecidos, pouco documentados | Processos documentados, com indicadores e donos |
| **3. Dados** | Informação em papel, WhatsApp pessoal, cadernos | Planilhas e algum sistema, pouco integrados | Sistemas (ERP/CRM) com dados organizados e acessíveis via API |
| **4. Pessoas** | Resistência ou medo; baixa familiaridade digital | Alguns usam IA por conta própria | Equipe treinada, com "campeões" de IA e cultura de experimentação |
| **5. Tecnologia** | Sem sistemas; e-mail pessoal | Ferramentas em nuvem soltas (Google, WhatsApp Business) | Stack integrada, ferramentas com API, alguma automação |

### Como interpretar
- **Média ≤ 2:** comece por **quick wins individuais** (prompts, assistentes) e por **organizar processos e dados**. Não proponha agentes complexos.
- **Média entre 2 e 3,5:** o ideal são **automações pontuais** e o **atendimento com IA** em canais já existentes.
- **Média > 3,5:** pronto para **integrações, RAG e agentes**.

> 💡 A camada **mais fraca** limita tudo. Uma empresa com Estratégia 5 e Dados 1 **não** consegue um agente que consulta estoque. Seu roadmap deve fortalecer a camada fraca.

### Visualização
Apresente as notas em um **gráfico de radar** (Google Sheets e Excel fazem isso). Ele é muito eficaz em reuniões com donos, porque o ponto fraco salta aos olhos.

---

## Aula 3.3: Entrevistas de diagnóstico

### Quem entrevistar
1. **Dono ou sócio** (60 min): estratégia, dores, metas, orçamento, medos.
2. **2 a 4 pessoas da operação** (30 a 45 min cada): como o trabalho acontece de verdade.
3. **Opcional:** 2 ou 3 clientes (15 min), para entender a experiência deles.

### Técnicas de entrevista
- **Perguntas abertas:** "Me conte como funciona desde que o cliente chama até a entrega."
- **Peça para mostrar:** "Pode me mostrar na tela como você faz isso?" Observar vale mais que ouvir.
- **Quantifique:** "Quantas vezes por dia? Quanto tempo leva? Quantas pessoas fazem?"
- **Os 5 porquês:** repita "por quê?" até chegar à causa raiz.
- **Não proponha soluções durante a entrevista.** Apenas escute e anote.

Use o roteiro completo em [templates/roteiro-entrevista-diagnostico.md](templates/roteiro-entrevista-diagnostico.md).

### Perguntas-chave (resumo)
- "Se você tivesse um funcionário extra, de graça, amanhã, o que ele faria?"
- "O que mais atrasa ou irrita os clientes?"
- "Que tarefa todo mundo odeia fazer?"
- "Onde acontecem mais erros ou retrabalho?"
- "Que informação você gostaria de ter e hoje não tem?"
- "Qual tarefa só uma pessoa sabe fazer?" (esse é um risco de dependência)

---

## Aula 3.4: Mapeamento de processos

### Ferramenta 1: SIPOC (visão macro)
Para cada processo principal, preencha:

| Fornecedor (S) | Entrada (I) | Processo (P) | Saída (O) | Cliente (C) |
|---|---|---|---|---|
| Cliente | Mensagem no WhatsApp | Atendimento e venda | Pedido confirmado | Expedição |
| Expedição | Pedido | Separação e envio | Pacote enviado + código de rastreio | Cliente |

### Ferramenta 2: Fluxograma (visão detalhada)
Símbolos básicos: ⬭ início/fim, ▭ atividade, ◇ decisão, ▱ documento/dado.

**Exemplo: processo de orçamento de uma serralheria**
```
[Cliente pede orçamento no WhatsApp]
        ↓
[Atendente pergunta medidas e fotos] ← (média 6 mensagens de ida e volta, 1 dia)
        ↓
[Dono calcula no caderno] ← GARGALO: só o dono sabe calcular; 2 dias de fila
        ↓
[Atendente digita orçamento no Word e envia PDF] ← 20 min
        ↓
◇ Cliente respondeu em 3 dias?
   Não → [Nada acontece] ← PERDA: 40% dos orçamentos sem follow-up
   Sim → [Negociação] → [Pedido]
```

### O que marcar no fluxograma
Para cada atividade, anote:
- ⏱ **Tempo** (quanto leva)
- 🔁 **Frequência** (quantas vezes por dia/semana)
- 👤 **Quem faz** (e quanto custa a hora dessa pessoa)
- ⚠️ **Problemas** (erros, retrabalho, esperas, dependência de uma pessoa)

### Os 7 desperdícios (adaptados do Lean) para caçar oportunidades
1. **Espera:** cliente ou processo parado aguardando alguém.
2. **Retrabalho:** corrigir erros e refazer.
3. **Digitação duplicada:** o mesmo dado digitado em 2 ou mais lugares.
4. **Busca de informação:** "onde está aquele arquivo?", "qual é o preço disso?"
5. **Comunicação repetitiva:** responder a mesma pergunta 50 vezes.
6. **Dependência de pessoa:** só um sabe fazer.
7. **Falta de acompanhamento:** oportunidades perdidas por esquecimento (follow-up, cobrança, pós-venda).

**Quase todo desperdício de tipo 3 a 7 tem solução com IA e automação.**

---

## Aula 3.5: Identificação e pontuação de oportunidades

### Passo 1: Liste as oportunidades
Para cada problema encontrado, descreva a oportunidade no formato:
> **Quando** [gatilho], **a IA** [ação], **para que** [resultado de negócio].

Exemplo: "**Quando** um cliente pede orçamento, **a IA** coleta as medidas e fotos, calcula a estimativa com a tabela do dono e envia um PDF, **para que** o orçamento saia em minutos em vez de 3 dias."

### Passo 2: Pontue
Cada fator recebe uma nota de **1 a 5**:

| Fator | 1 | 5 |
|---|---|---|
| **Frequência (F)** | Mensal | Dezenas de vezes por dia |
| **Tempo gasto (T)** | Minutos por mês | Dezenas de horas por mês |
| **Padronização (P)** | Cada caso é único | Sempre o mesmo padrão |
| **Risco (R)** | Erro é inofensivo | Erro causa grande prejuízo |

```
Pontuação de Oportunidade = F × T × P × (6 − R)
```
Valor máximo: 5 × 5 × 5 × 5 = **625**.

### Passo 3: Avalie o esforço
| Esforço | Descrição |
|---|---|
| **Baixo** | Prompt padronizado ou ferramenta pronta; até 1 semana |
| **Médio** | Automação com 2 ou 3 integrações; 2 a 4 semanas |
| **Alto** | Agente, RAG, integração com ERP legado; mais de 1 mês |

### Passo 4: Matriz Impacto × Esforço

```
          IMPACTO ALTO
               │
   PROJETOS    │   QUICK WINS
  ESTRATÉGICOS │  (faça primeiro!)
               │
ESFORÇO ───────┼─────── ESFORÇO
  ALTO         │         BAIXO
               │
    EVITE      │   TAREFAS
   (por ora)   │   COMPLEMENTARES
               │
          IMPACTO BAIXO
```

**Exemplo completo**

| # | Oportunidade | F | T | P | R | Pontuação | Esforço | Quadrante |
|---|---|---|---|---|---|---|---|---|
| 1 | Pré-atendimento de orçamento no WhatsApp | 5 | 5 | 4 | 2 | 400 | Médio | Estratégico/Quick win |
| 2 | Follow-up automático de orçamentos | 4 | 3 | 5 | 1 | 300 | Baixo | **Quick win** |
| 3 | Legendas de Instagram | 3 | 2 | 4 | 1 | 120 | Baixo | Complementar |
| 4 | Precificação automática de projetos especiais | 2 | 4 | 2 | 5 | 16 | Alto | Evite |

---

## Aula 3.6: Roadmap de 90 dias e o relatório

### Estrutura do roadmap
| Período | Foco | Exemplo |
|---|---|---|
| **Dias 1–30** | 1 ou 2 quick wins + fundação | Follow-up automático; biblioteca de prompts; organizar a tabela de preços em planilha |
| **Dias 31–60** | 1 projeto estratégico | Pré-atendimento de orçamento com IA |
| **Dias 61–90** | Medir, ajustar, treinar, escalar | Relatório de resultados; treinamento; próximo ciclo |

### Regras do roadmap
- Cada iniciativa tem: **dono na empresa, indicador de sucesso, meta e data**.
- Inclua ações que **não são IA** quando necessário ("padronizar a tabela de preços").
- No máximo **3 iniciativas simultâneas** em uma PME.

### O relatório de diagnóstico
Use o modelo [templates/relatorio-diagnostico.md](templates/relatorio-diagnostico.md). A estrutura é:
1. Sumário executivo (1 página: o que encontramos, o que recomendamos, quanto vale)
2. Contexto da empresa
3. Diagnóstico em 5 camadas (radar e comentários)
4. Processos mapeados e desperdícios
5. Oportunidades pontuadas (tabela + matriz)
6. Roadmap de 90 dias
7. Investimento estimado e retorno (virá do M10A)
8. Riscos e próximos passos

### Apresentação ao dono (30 a 45 min)
1. Comece pela **dor que ele mesmo contou** ("Você disse que perde orçamentos...").
2. Mostre o radar ("seu ponto mais forte é X, o gargalo é Y").
3. Apresente as **3 principais oportunidades**, em linguagem de dinheiro e tempo.
4. Proponha o **primeiro passo concreto** (o quick win).
5. Pergunte: "Faz sentido para você? O que mudaria?"

---

## Usando IA para acelerar o diagnóstico
- **Transcreva as entrevistas** (gravador do celular + transcrição por IA) e peça: "Liste todas as tarefas, dores, tempos e frequências mencionados, em tabela."
- **Gere fluxogramas:** "Converta esta descrição do processo em um diagrama Mermaid." Cole no Mermaid Live Editor ou no Notion.
- **Pré-pontuação:** "Com base nas dores listadas, sugira oportunidades de IA no formato Quando/A IA/Para que." **Revise sempre**: você tem o contexto que a IA não tem.

---

## Exercícios

**Exercício 1: Estudo de caso simulado (60 min).** Leia o caso abaixo e faça: diagnóstico em 5 camadas, 6 oportunidades pontuadas e a matriz.

> **Ótica Visão Clara** (Recife, 8 funcionários, 2 lojas). Recebem cerca de 60 mensagens por dia no WhatsApp, a maioria perguntando preço de lentes, horário e se aceitam convênio. As receitas médicas chegam por foto e são digitadas manualmente no sistema (15 min cada, cerca de 20 por dia). O dono monta os relatórios de venda no fim do mês copiando dados do sistema para o Excel (1 dia inteiro). Não há follow-up para clientes que fizeram orçamento e não compraram (estimam 35% de desistência). Funcionários usam ChatGPT pessoal "às vezes". O sistema da ótica é um software local sem API. As fotos de produtos para o Instagram são feitas pela vendedora, que "não tem tempo de postar".

**Exercício 2: Fluxograma (45 min).** Desenhe o fluxograma de um processo da sua própria rotina (por exemplo, "pagar contas do mês"). Marque tempo, frequência e desperdícios.

**Exercício 3: Roleplay de entrevista (45 min).** Peça a um assistente de IA: "Você é dono de uma academia de bairro. Vou te entrevistar para um diagnóstico de IA. Responda de forma realista, com dores, contradições e resistências." Conduza a entrevista usando o roteiro. Depois peça feedback: "Avalie minha condução da entrevista."

**Exercício 4: 20 oportunidades por segmento (45 min).** Para 4 segmentos (clínica, restaurante, escritório de contabilidade, loja de e-commerce), liste 5 oportunidades de IA cada, no formato Quando/A IA/Para que. Esse repertório será útil em palestras e em vendas.

---

## Tarefa de campo (a principal da formação até aqui)
Na empresa-laboratório:
1. **Semana 5:** agende as entrevistas (dono + 2 a 4 funcionários).
2. **Semana 6:** faça as entrevistas (grave, com autorização), observe o trabalho e mapeie de 5 a 10 processos.
3. **Semana 7:** pontue as oportunidades, monte o roadmap, redija o relatório e **apresente ao dono**.

Peça ao dono, ao final: "De 0 a 10, quanto esse diagnóstico te ajudou? O que faltou?" Registre a resposta. Ela é seu primeiro depoimento.

---

## Entregável: Relatório de diagnóstico de IA
- Relatório completo seguindo o template (8 a 15 páginas).
- Radar das 5 camadas.
- De 5 a 10 processos mapeados (com pelo menos 2 fluxogramas detalhados).
- Pelo menos 10 oportunidades pontuadas + matriz Impacto × Esforço.
- Roadmap de 90 dias.
- Feedback do dono registrado.

---

## Autoavaliação
1. Quais os 4 resultados de negócio a que toda iniciativa de IA deve se ligar?
2. Por que "processo antes de automação"?
3. Cite 4 sinais de que uma tarefa é boa candidata para IA.
4. Qual é a fórmula da Pontuação de Oportunidade e por que o risco entra como (6 − R)?
5. Uma empresa tem notas: Estratégia 4, Processos 2, Dados 1, Pessoas 3, Tecnologia 2. O que você recomendaria para os primeiros 90 dias?
6. O que é SIPOC?
7. Cite 4 dos 7 desperdícios e uma solução de IA para cada.
8. Por que não propor soluções durante a entrevista?
9. Quantas iniciativas simultâneas são recomendadas para uma PME?
10. Como começar a apresentação do diagnóstico ao dono?

<details>
<summary><strong>Gabarito</strong></summary>

1. Aumentar receita, reduzir custo, reduzir risco e melhorar a experiência.
2. Porque automatizar um processo ruim só produz resultados ruins mais rápido. É preciso padronizar e entender o processo antes.
3. Repetitiva e frequente; envolve texto, voz ou imagem; segue um padrão; consome tempo caro ou gera atrasos; o erro é tolerável ou revisável (quaisquer 4).
4. F × T × P × (6 − R). O risco é invertido porque risco alto deve **reduzir** a pontuação (R = 5 vira fator 1; R = 1 vira fator 5).
5. A camada de Dados (1) é a mais fraca. Recomende quick wins que não dependem de dados integrados (prompts padronizados, atendimento de FAQ com base em documento simples) e, em paralelo, a organização de dados (tabela de preços, cadastro de clientes em planilha ou CRM). Não proponha integrações complexas.
6. Uma ferramenta de mapeamento macro: Fornecedor, Entrada, Processo, Saída, Cliente.
7. Espera → resposta automática 24h; retrabalho → validação automática de dados; digitação duplicada → extração por IA + integração; busca de informação → base de conhecimento (RAG); comunicação repetitiva → FAQ com IA; dependência de pessoa → documentar em POP + assistente; falta de acompanhamento → follow-up automático (quaisquer 4).
8. Porque isso enviesa as respostas, faz você parar de ouvir e cria expectativas antes de entender o problema.
9. No máximo 3.
10. Pela dor que o próprio dono relatou, conectando o diagnóstico ao que importa para ele.
</details>
