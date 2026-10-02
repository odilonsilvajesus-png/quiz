# Caso 04: Dados e relatórios para gestão

---

## Problema típico e sinais no diagnóstico
- O dono decide "no feeling" porque os relatórios demoram ou não existem.
- Alguém passa dias por mês montando planilhas de resultados.
- Dados espalhados (ERP, planilhas, banco, e-commerce) sem visão consolidada.
- Perguntas simples ("qual produto teve mais devolução no trimestre?") levam dias para ser respondidas.

---

## Aplicações

| Aplicação | Descrição |
|---|---|
| **Análise ad hoc com assistente** | Subir planilhas num assistente com análise de dados e fazer perguntas |
| **Relatório automático periódico** | Toda segunda: dados → análise → texto explicativo + gráficos → e-mail/WhatsApp do dono |
| **Perguntas em linguagem natural ao banco** ("text-to-SQL") | "Quanto vendemos de cimento em setembro por vendedor?" → IA gera a consulta → executa → responde |
| **Alertas inteligentes** | Detectar anomalias (queda de vendas, ruptura, inadimplência subindo) e explicar |
| **Análise de texto em escala** | Classificar e resumir reclamações, avaliações, motivos de perda de venda |

---

## Arquitetura de referência: relatório semanal automático
```
[Agendado: segunda 7h]
  → Extrair dados (exportação do ERP / banco intermediário)
  → Calcular indicadores EM CÓDIGO (vendas, margem, ticket, comparações)
  → Gerar gráficos (código)
  → IA: redigir a análise a partir dos indicadores calculados
       ("explique as 3 variações mais relevantes e sugira 2 ações")
  → Enviar (e-mail/WhatsApp) + guardar histórico
```

> **Regra de ouro:** **números são calculados por código**, não pela IA "de cabeça". A IA interpreta, explica e redige. Isso evita erros de cálculo e alucinação de números.

## Arquitetura: perguntas em linguagem natural
```
Pergunta → IA (com o esquema do banco e exemplos de consultas) → SQL
  → Validação: só SELECT; tabelas permitidas; limite de linhas
  → Executa com usuário SOMENTE LEITURA
  → IA explica o resultado (e mostra a consulta usada)
```
Cuidados: usuário de banco **somente leitura**; restringir tabelas; mostrar a consulta para auditoria; testar com um conjunto de perguntas com respostas conhecidas (eval).

---

## Passo a passo (relatório automático)
1. Entreviste o dono e os gestores: **quais decisões** eles tomam e que números precisam para isso.
2. Defina 5 a 10 indicadores-chave e as comparações (semana anterior, mesmo período do ano anterior, meta).
3. Garanta o acesso aos dados (Caso de integração, Módulos 3.4 e 3.7).
4. Implemente o cálculo em código e **valide os números com o financeiro**.
5. Implemente a redação com IA (prompt com estrutura fixa).
6. Envie por 4 semanas e ajuste com o feedback.

---

## Cuidados
- **Qualidade dos dados** (Módulo 2.4): relatório bonito com dado errado é perigoso.
- **Números sempre rastreáveis** à fonte.
- **Acesso:** dados financeiros e de pessoas com controle.
- **Interpretação:** a IA sugere hipóteses; não confunda correlação com causa.

---

## Métricas
- Horas economizadas na montagem de relatórios
- Frequência de uso pelos gestores (abrem? perguntam?)
- Decisões tomadas a partir do relatório (registre exemplos)
- Acerto em perguntas de teste (para text-to-SQL)

---

## Laboratório
Construa o **relatório semanal automático** para o dono da empresa-laboratório, com indicadores calculados em código, análise redigida por IA e envio automático. Valide os números com o responsável financeiro.

---

**Voltar:** [Casos de uso](README.md)
