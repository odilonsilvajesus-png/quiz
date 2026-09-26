# Módulo 4: Ecossistema de ferramentas de IA

**Semana 10 · cerca de 9 horas**

## Objetivos de aprendizagem
1. Conhecer as categorias de ferramentas de IA e os principais representantes.
2. Avaliar ferramentas com critérios objetivos (custo, privacidade, integração, adoção).
3. Recomendar a "stack" certa conforme o porte e a maturidade da empresa.
4. Entender planos gratuitos, individuais, de equipe e empresariais, e as implicações de privacidade de cada um.

> ⚠️ **Ferramentas mudam rápido.** Os nomes abaixo são exemplos atuais. O que você deve dominar são as **categorias e os critérios de escolha**, que continuam valendo.

---

## Aula 4.1: O mapa do ecossistema

| Categoria | Para que serve | Exemplos |
|---|---|---|
| **Assistentes gerais** | Conversar, escrever, analisar, criar | Claude, ChatGPT, Gemini, Microsoft Copilot |
| **IA embutida em suítes** | IA dentro do e-mail, documentos e planilhas | Gemini no Google Workspace, Copilot no Microsoft 365 |
| **IA em ferramentas de trabalho** | IA dentro do app que a equipe já usa | Notion AI, Canva (Magic Studio), CRMs com IA, ERPs com IA |
| **Automação** | Conectar sistemas e rodar fluxos | Make, Zapier, n8n |
| **Atendimento e chatbots** | Bots no WhatsApp, Instagram, site | Plataformas de chatbot com IA e API oficial do WhatsApp (ver M6) |
| **Conteúdo visual** | Imagens, vídeos, design | Canva, geradores de imagem dos assistentes, Midjourney, ferramentas de vídeo e avatar |
| **Voz e transcrição** | Transcrever reuniões e áudios, gerar voz | Gravadores com transcrição, notetakers de reunião, ElevenLabs |
| **Pesquisa** | Pesquisa com fontes citadas | Modos de pesquisa aprofundada dos assistentes, Perplexity |
| **Conhecimento (RAG)** | Perguntar aos documentos da empresa | Projects do Claude, GPTs, NotebookLM, bases em n8n (ver M8) |
| **Construção de apps/agentes** | Criar soluções próprias | APIs dos modelos, SDKs de agentes, plataformas no-code de agentes |
| **Desenvolvimento assistido** | Criar software com IA | Claude Code, Cursor, GitHub Copilot |

---

## Aula 4.2: Critérios de avaliação

Avalie cada ferramenta de 1 a 5 em cada critério:

| Critério | Pergunta |
|---|---|
| **1. Adequação** | Resolve bem o problema específico? |
| **2. Facilidade de adoção** | A equipe consegue usar sem treinamento pesado? Tem interface em português? |
| **3. Integração** | Conecta com o que a empresa já usa (WhatsApp, Google, ERP)? Tem API? |
| **4. Privacidade e segurança** | Os dados são usados para treinar modelos? Tem opção empresarial? Onde os dados ficam? |
| **5. Custo total** | Preço por usuário + uso + implementação + manutenção. Cobra em dólar? |
| **6. Suporte e maturidade** | A empresa é estável? Tem suporte? Comunidade ativa? |
| **7. Dependência (lock-in)** | Se trocar de ferramenta, perde tudo? Os dados são exportáveis? |

**Ponderação:** ajuste os pesos ao cliente. Uma clínica pesa mais privacidade; um e-commerce pesa mais integração.

---

## Aula 4.3: Planos e privacidade (ponto crítico)

| Tipo de plano | Uso dos dados | Recomendação |
|---|---|---|
| **Gratuito** | Frequentemente pode ser usado para melhorar modelos (verifique as configurações) | Uso pessoal; **nunca** dados de clientes |
| **Individual pago** | Geralmente há controle para desativar o uso em treinamento | Profissionais autônomos, com as configurações ajustadas |
| **Equipe / Business** | Normalmente **não** usam os dados para treinar; administração centralizada | **Padrão recomendado para PMEs** |
| **Enterprise** | Contratos, SSO, auditoria, retenção configurável | Empresas maiores ou reguladas |
| **API** | Em geral, não usada para treinamento por padrão; retenção limitada | Automações e produtos próprios |

> ✅ Antes de recomendar, **leia a política de privacidade e os termos atuais** da ferramenta e anote a data da consulta. Isso protege você e o cliente e é exigido para conformidade com a LGPD (M10B).

---

## Aula 4.4: Stacks recomendadas por perfil

### Perfil A: Microempresa (1 a 5 pessoas, maturidade baixa)
- 1 assistente de IA pago (plano individual ou de equipe) + a biblioteca de prompts (M2)
- WhatsApp Business com respostas rápidas e catálogo
- Canva para conteúdo
- Google Workspace ou equivalente
- **Custo aproximado:** baixo. **Foco:** produtividade individual padronizada.

### Perfil B: Pequena empresa (6 a 30 pessoas, maturidade média)
- Assistente de IA em **plano de equipe** (Projects/GPTs compartilhados)
- Automação (Make ou n8n) para 3 a 5 fluxos
- Chatbot com IA no WhatsApp integrado a um CRM simples
- IA embutida na suíte de escritório
- **Foco:** automação de processos e atendimento.

### Perfil C: Média empresa (30+ pessoas, maturidade média a alta)
- Assistente em plano empresarial com governança
- n8n (auto-hospedado ou em nuvem) ou plataforma de integração
- Base de conhecimento (RAG) interna
- Agentes integrados ao ERP e CRM via API
- **Foco:** sistemas e agentes, com governança.

---

## Aula 4.5: Como testar uma ferramenta em 1 hora (protocolo)
1. **(10 min)** Defina 3 tarefas reais do cliente que a ferramenta deveria resolver.
2. **(30 min)** Execute as 3 tarefas. Cronometre e anote as dificuldades.
3. **(10 min)** Verifique: preço atual, política de privacidade, integrações e exportação de dados.
4. **(10 min)** Pontue na matriz de critérios e escreva um veredito de 3 linhas: "Recomendo para ___ porque ___; cuidado com ___."

---

## Exercícios

**Exercício 1: Teste de 3 assistentes (90 min).** Aplique o protocolo da Aula 4.5 em Claude, ChatGPT e Gemini com as mesmas 3 tarefas da empresa-laboratório.

**Exercício 2: Auditoria de privacidade (45 min).** Para 3 ferramentas, leia os termos e preencha: "Usa dados para treinamento? Como desativar? Onde ficam os dados? Qual plano é adequado para dados de clientes?"

**Exercício 3: IA embutida (45 min).** Teste a IA dentro do Google Workspace ou do Microsoft 365 (resumo de e-mails, criação de planilha, apresentação). Compare com fazer a mesma tarefa em um assistente separado.

**Exercício 4: Custo total (30 min).** Monte o custo mensal da Stack B para uma empresa de 15 pessoas (preços oficiais atuais, com conversão cambial).

---

## Tarefa de campo
Levante **todas as ferramentas** que a empresa-laboratório usa hoje (inclusive planilhas e WhatsApp pessoal). Identifique quais têm IA embutida **não utilizada** e quais têm API ou integração com Make/n8n.

---

## Entregável: Matriz de ferramentas
Uma planilha com:
- De 12 a 15 ferramentas avaliadas nos 7 critérios.
- Recomendação para os 3 perfis (A, B, C).
- Stack recomendada para a empresa-laboratório, com custo mensal estimado.
- Data da última revisão (atualize a cada trimestre).

---

## Autoavaliação
1. Cite 5 categorias de ferramentas de IA.
2. Qual o risco de usar planos gratuitos com dados de clientes?
3. Qual tipo de plano é o padrão recomendado para PMEs? Por quê?
4. Por que o critério "dependência" importa?
5. Uma clínica odontológica com 10 funcionários quer começar. Qual perfil de stack e quais cuidados?

<details>
<summary><strong>Gabarito</strong></summary>

1. Assistentes gerais, IA embutida em suítes, automação, atendimento/chatbots, conteúdo visual, voz, pesquisa, RAG, construção de agentes e desenvolvimento (quaisquer 5).
2. Os dados podem ser usados para treinar modelos e há menos controle de retenção. É um risco de LGPD e de confidencialidade.
3. O plano de Equipe/Business: normalmente não treina com os dados, tem administração centralizada e custo acessível.
4. Porque trocar de ferramenta pode significar perder dados, fluxos e investimento. Prefira ferramentas com dados exportáveis e padrões abertos.
5. Perfil B em versão inicial (ou A evoluindo para B): assistente em plano de equipe e chatbot de agendamento. Cuidados: dados de saúde são **dados sensíveis** pela LGPD, então exigem privacidade reforçada, nada de planos gratuitos e nenhuma orientação clínica pela IA.
</details>
