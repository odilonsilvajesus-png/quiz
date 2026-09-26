# Módulo 5: Automação no-code e low-code com IA

**Semanas 11 a 13 · cerca de 27 horas**

## Objetivos de aprendizagem
1. Entender os conceitos de automação: gatilhos, ações, dados, webhooks e APIs.
2. Ler e manipular JSON.
3. Construir fluxos no Make e/ou no n8n com etapas de IA.
4. Tratar erros e monitorar automações.
5. Colocar em produção 3 automações reais e medir o resultado.

---

## Aula 5.1: Conceitos fundamentais

Uma automação é uma **receita**: *quando* algo acontece, *faça* uma sequência de passos.

| Conceito | O que é | Exemplo |
|---|---|---|
| **Gatilho (trigger)** | Evento que inicia o fluxo | Chegou um e-mail; nova linha na planilha; formulário enviado; todo dia às 8h |
| **Ação** | Algo que o fluxo executa | Criar tarefa, enviar mensagem, chamar a IA, gravar na planilha |
| **Módulo / nó** | Cada bloco do fluxo | "Gmail – Watch emails", "OpenAI/Anthropic – Create message" |
| **Mapeamento de dados** | Passar dados de um passo para outro | Usar o "assunto do e-mail" do passo 1 como entrada do passo 2 |
| **Filtro / condição** | Só continua se uma regra for verdadeira | Só se o e-mail vier de cliente |
| **Roteador (router / switch)** | Divide o fluxo em caminhos | Se reclamação → caminho A; se orçamento → caminho B |
| **Iterador / loop** | Repete para cada item de uma lista | Para cada anexo, extraia os dados |
| **Webhook** | Uma URL que recebe dados de outro sistema em tempo real | O site envia os dados do formulário para o webhook |
| **API** | Uma "porta" para um sistema conversar com outro | A API do CRM permite criar contatos automaticamente |

### Make x Zapier x n8n

| | Make | Zapier | n8n |
|---|---|---|---|
| Curva de aprendizado | Média | Fácil | Média/alta |
| Visual | Fluxo visual detalhado | Lista linear de passos | Fluxo visual (nós) |
| Custo | Cobra por operação; bom custo-benefício | Mais caro em volume | Gratuito auto-hospedado; nuvem paga |
| Flexibilidade | Alta | Média | Muito alta (aceita código JS/Python) |
| IA e agentes | Módulos de IA | Módulos de IA | Nós de IA e **agentes** nativos, forte em RAG |
| Recomendação | Ótimo para começar | Clientes que querem simplicidade | **Aprenda a fundo**: é o mais versátil para projetos de IA |

**Recomendação da formação:** aprenda o **n8n** como ferramenta principal e o **Make** no básico (muitos clientes já o usam).

---

## Aula 5.2: JSON e APIs sem medo

### JSON
É o formato que os sistemas usam para trocar dados. São pares de "chave": valor.
```json
{
  "cliente": "Maria Souza",
  "telefone": "+5531999998888",
  "pedido": {
    "itens": [
      {"produto": "Pão de queijo", "quantidade": 20},
      {"produto": "Café 500g", "quantidade": 1}
    ],
    "total": 58.90,
    "pago": false
  }
}
```
- `{ }` = objeto (um "registro")
- `[ ]` = lista
- Textos entre aspas; números sem aspas; `true`/`false` e `null` sem aspas.
- Para acessar dados: `pedido.total` → 58.90; `pedido.itens[0].produto` → "Pão de queijo".

### Como funciona uma chamada de API
```
Método:  POST (enviar/criar) | GET (consultar) | PUT/PATCH (atualizar) | DELETE (apagar)
URL:     https://api.sistema.com/v1/contatos
Headers: Authorization: Bearer SUA_CHAVE   ← autenticação
         Content-Type: application/json
Body:    {"nome": "Maria", "telefone": "..."}
Resposta: 200 OK + JSON | 400 erro no pedido | 401 sem autorização | 429 limite excedido | 500 erro no servidor
```

### Chamando um modelo de IA via API
Toda automação com IA faz, no fundo, algo assim:
```json
POST https://api.anthropic.com/v1/messages
{
  "model": "<id-do-modelo>",
  "max_tokens": 500,
  "system": "Você classifica e-mails de uma distribuidora...",
  "messages": [{"role": "user", "content": "Texto do e-mail aqui"}]
}
```
No Make e no n8n, você não escreve isso à mão: preenche campos em um módulo pronto. Mas **entender a estrutura** permite usar qualquer API, mesmo sem módulo pronto (via módulo "HTTP Request").

> 🔐 **Chaves de API são senhas.** Nunca as coloque em planilhas compartilhadas, prints ou código público. Use o cofre de credenciais da ferramenta.

---

## Aula 5.3: O padrão "IA dentro do fluxo"

Quase toda automação com IA segue um de 5 padrões:

| Padrão | Fluxo | Exemplo |
|---|---|---|
| **1. Classificar e rotear** | Entrada → IA classifica → roteador → ações diferentes | E-mails: financeiro, comercial, suporte |
| **2. Extrair e registrar** | Documento/texto → IA extrai JSON → grava no sistema | Nota fiscal → planilha financeira |
| **3. Gerar e enviar** | Dados → IA redige → revisão (opcional) → envio | Relatório semanal, follow-up personalizado |
| **4. Resumir e notificar** | Muitos dados → IA resume → alerta | Resumo diário de avaliações do Google para o dono |
| **5. Enriquecer** | Registro → IA analisa e acrescenta informação → atualiza | Lead no CRM → IA pontua o potencial e sugere a abordagem |

### Humano no circuito (*human in the loop*)
Para saídas de risco, adicione uma etapa de **aprovação**: a IA gera um rascunho, envia para aprovação (e-mail, Slack, WhatsApp, Telegram), a pessoa aprova ou edita, e só então o sistema envia. **Comece sempre com aprovação humana** e remova-a quando os dados mostrarem qualidade consistente.

---

## Aula 5.4: Construindo a automação 1 (passo a passo)

### "Triagem inteligente de e-mails / formulários"
**Objetivo:** mensagens de contato são classificadas pela IA, registradas numa planilha e o responsável é avisado.

**Passos no n8n (a lógica é igual no Make):**
1. **Gatilho:** `Gmail Trigger` (novo e-mail na caixa de contato) **ou** `Webhook` (formulário do site).
2. **Nó de IA** (Anthropic/OpenAI "Message a model" ou "Basic LLM Chain"), com este prompt:
   ```
   Classifique a mensagem abaixo. Responda APENAS em JSON:
   {"categoria": "ORCAMENTO|SUPORTE|FINANCEIRO|OUTRO",
    "urgencia": "ALTA|MEDIA|BAIXA",
    "resumo": "até 20 palavras",
    "nome_cliente": "string ou null"}
   Mensagem: """{{ $json.text }}"""
   ```
3. **Converter a resposta em JSON** (nó "Code" ou "Structured Output Parser").
4. **Google Sheets – Append row:** data, remetente, categoria, urgência, resumo.
5. **Switch** por categoria → 4 saídas.
6. **Notificação** para cada responsável (e-mail, Telegram ou WhatsApp), com prioridade para urgência ALTA.
7. **Tratamento de erro:** configure um "Error Workflow" que avisa você quando o fluxo falhar.

**Teste com 20 mensagens reais (anonimizadas).** Meça a taxa de acerto da classificação.

---

## Aula 5.5: Automações 2 e 3 (projetos guiados)

### Automação 2: "Extração de documentos → sistema"
**Gatilho:** arquivo novo numa pasta do Drive (ou anexo de e-mail).
**Fluxo:** baixar o arquivo → **IA com visão** extrai (fornecedor, CNPJ, valor, vencimento, itens) em JSON → validar (valor > 0? data válida? CNPJ com 14 dígitos?) → gravar na planilha de contas a pagar → se a validação falhar, enviar para revisão humana.
**Métrica:** minutos de digitação economizados por documento × volume mensal; taxa de erros.

### Automação 3: "Relatório executivo automático"
**Gatilho:** toda segunda-feira às 7h.
**Fluxo:** ler a planilha ou sistema de vendas (últimos 7 dias) → calcular indicadores (nó de código ou fórmulas) → **IA redige** o resumo: "principais números, o que melhorou, o que piorou, 3 pontos de atenção, 1 sugestão de ação" → enviar por e-mail ou WhatsApp ao dono.

**Dica importante:** **faça os cálculos fora da IA** (fórmula ou código) e passe os números prontos. A IA é ótima para **interpretar e redigir**, mas pode errar contas.

### Outras ideias para escolher
- Follow-up de orçamentos sem resposta em 48h (mensagem personalizada pela IA).
- Resposta a avaliações do Google (rascunho para aprovação).
- Transcrição de áudios do WhatsApp → resumo → tarefa no gerenciador.
- Novo lead no formulário → IA pesquisa e pontua → CRM → mensagem de boas-vindas.
- Cobrança escalonada (lembrete amigável → firme → aviso) com tom gerado pela IA.

---

## Aula 5.6: Produção, monitoramento e custos

### Checklist antes de colocar em produção
- [ ] Testado com pelo menos 20 casos reais, incluindo casos estranhos (e-mail vazio, anexo corrompido, idioma diferente)
- [ ] Tratamento de erro configurado (alerta quando falha)
- [ ] Log de execuções ativo (a ferramenta guarda o histórico)
- [ ] Credenciais em cofre, não em texto
- [ ] Limites de custo: teto de gasto na conta da API
- [ ] Humano no circuito para saídas de risco
- [ ] Ficha de documentação preenchida ([templates/ficha-de-automacao.md](templates/ficha-de-automacao.md))
- [ ] Responsável na empresa definido e treinado

### Monitoramento semanal (primeiro mês)
- Quantas execuções? Quantas falhas? Por quê?
- Amostra de 10 saídas da IA: qualidade ainda boa?
- Custo acumulado de API e da ferramenta.

### Medição de resultado (antes × depois)
| Indicador | Antes | Depois | Ganho |
|---|---|---|---|
| Tempo por item | 15 min | 1 min (revisão) | −93% |
| Volume mensal | 400 | 400 | — |
| Horas/mês | 100h | 6,7h | **93h liberadas** |
| Erros de digitação | ~4% | ~1% | −75% |

---

## Exercícios

**Exercício 1: JSON (30 min).** Escreva à mão o JSON de um pedido com 3 itens, cliente, endereço e pagamento. Valide-o num validador online. Depois, escreva o caminho para acessar o nome do 2º item.

**Exercício 2: Primeira API (45 min).** No n8n ou no Make, use o módulo "HTTP Request" para consultar uma API pública gratuita (por exemplo, BrasilAPI: `https://brasilapi.com.br/api/cep/v1/01001000`). Extraia a cidade e grave numa planilha.

**Exercício 3: Primeira chamada de IA via automação (45 min).** Crie uma conta de API (Anthropic ou OpenAI), gere uma chave, defina um **limite de gasto** e faça um fluxo simples: planilha com 10 frases → IA classifica o sentimento → escreve o resultado na coluna ao lado.

**Exercícios 4 a 6.** Construa as automações 1, 2 e 3 (Aulas 5.4 e 5.5), primeiro em ambiente de teste e depois na empresa-laboratório.

---

## Tarefa de campo
Implemente **3 automações** na empresa-laboratório, escolhidas entre as oportunidades do diagnóstico (M3). Rode cada uma por pelo menos **1 semana** e meça o antes e depois.

---

## Entregável
- 3 automações em produção.
- 3 **fichas de automação** completas (template), com: objetivo, fluxo (print ou diagrama), prompts usados, casos de teste, métricas antes e depois, custo mensal, responsável e plano de contingência.
- Um vídeo de 3 a 5 minutos (tela gravada) mostrando uma automação funcionando. Isso é ótimo para o portfólio e para palestras.

---

## Autoavaliação
1. Qual a diferença entre gatilho e ação?
2. O que é um webhook?
3. No JSON `{"pedido":{"itens":[{"produto":"A"},{"produto":"B"}]}}`, como acessar "B"?
4. O que significam os códigos 401 e 429?
5. Cite os 5 padrões de "IA dentro do fluxo".
6. Por que fazer cálculos fora da IA?
7. O que é "humano no circuito" e quando remover?
8. Cite 5 itens do checklist de produção.
9. Por que recomendar o n8n como ferramenta principal?
10. Onde guardar chaves de API?

<details>
<summary><strong>Gabarito</strong></summary>

1. O gatilho é o evento que inicia o fluxo; a ação é o que o fluxo executa.
2. Uma URL que recebe dados de outro sistema em tempo real, quando um evento acontece.
3. `pedido.itens[1].produto`
4. 401 = não autorizado (credencial inválida); 429 = limite de requisições excedido.
5. Classificar e rotear; extrair e registrar; gerar e enviar; resumir e notificar; enriquecer.
6. Porque LLMs podem errar contas. Fórmulas e código são exatos, e a IA interpreta os números prontos.
7. Uma etapa de aprovação humana antes da ação final. Remova quando os dados mostrarem qualidade consistente por um período, e só em saídas de baixo risco.
8. Testes com 20 casos, tratamento de erro, logs, credenciais em cofre, teto de custo, humano no circuito, documentação e responsável definido (quaisquer 5).
9. É flexível, aceita código, tem agentes e RAG nativos, pode ser auto-hospedado (custo baixo e controle dos dados) e tem comunidade ativa.
10. No cofre de credenciais da ferramenta ou em variáveis de ambiente. Nunca em texto aberto, planilhas ou código público.
</details>
