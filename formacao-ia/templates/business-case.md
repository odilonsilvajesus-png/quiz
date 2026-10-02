# Template: Business case de solução de IA

> Monte em planilha (Google Sheets ou Excel) seguindo esta estrutura. Mantenha as **premissas** numa aba separada, para facilitar a análise de sensibilidade.

---

## Aba 1: Premissas

| Premissa | Valor | Fonte/justificativa |
|---|---|---|
| Volume de tarefas por mês | | |
| Tempo atual por tarefa (min) | | Medido em [data] |
| Tempo com a solução por tarefa (min) | | Estimativa / piloto |
| Custo da hora do funcionário (R$) | | (salário × fator de encargos) ÷ horas |
| % do tempo economizado efetivamente realocado | | Conservador |
| Taxa de conversão atual | | |
| Taxa de conversão esperada | | |
| Ticket médio (R$) | | |
| Margem de contribuição (%) | | |
| Custos evitados/mês (multas, erros) | | |
| Câmbio (R$/US$) | | Data |

## Aba 2: Custo de uso de IA

| Item | Valor |
|---|---|
| Chamadas por mês | |
| Tokens de entrada por chamada | |
| Tokens de saída por chamada | |
| % da entrada em cache | |
| Preço entrada (US$/milhão de tokens) | Página oficial, [data] |
| Preço saída (US$/milhão de tokens) | |
| Preço leitura de cache (US$/milhão de tokens) | |
| **Custo mensal (US$)** | = fórmula |
| **Custo mensal (R$)** | = fórmula |

**Fórmula:**
```
Entrada não cacheada = chamadas × tokens_entrada × (1 − %cache) × preço_entrada ÷ 1.000.000
Entrada cacheada     = chamadas × tokens_entrada × %cache × preço_cache ÷ 1.000.000
Saída                = chamadas × tokens_saída × preço_saída ÷ 1.000.000
```

## Aba 3: Custo total (TCO)

| Categoria | Item | Único (R$) | Mensal (R$) |
|---|---|---|---|
| Implantação | Diagnóstico/descoberta | | |
| Implantação | Construção e integração | | |
| Implantação | Testes e piloto | | |
| Implantação | Treinamento | | |
| Licenças | Ferramentas/plataformas | | |
| Uso | IA (Aba 2) | | |
| Uso | WhatsApp API / voz / outros | | |
| Infraestrutura | Hospedagem, banco | | |
| Manutenção | Suporte e evolução | | |
| Interno | Tempo da equipe (revisão, supervisão) | | |
| **Total** | | **=soma** | **=soma** |

## Aba 4: Benefícios

| Tipo | Cálculo | R$/mês |
|---|---|---|
| Tempo realocado | volume × (tempo atual − tempo novo) ÷ 60 × custo hora × % realocado | |
| Receita adicional (margem) | volume de oportunidades × Δ conversão × ticket × margem | |
| Custos evitados | | |
| Risco reduzido (opcional) | probabilidade × impacto | |
| **Total** | | **=soma** |

## Aba 5: Resultado e sensibilidade

| Indicador | Pessimista | Base | Otimista |
|---|---|---|---|
| Benefícios/mês | | | |
| Custos recorrentes/mês | | | |
| **Benefício líquido/mês** | | | |
| Investimento inicial | | | |
| **Payback (meses)** = investimento ÷ líquido | | | |
| **ROI 12 meses** = (líquido × 12 − investimento) ÷ investimento | | | |

**Ponto de equilíbrio:** "a solução se paga se [premissa-chave] for de pelo menos [valor]".

## One-pager (resumo para o cliente)

1. **Problema:** [números do AS-IS]
2. **Solução:** [linguagem de negócio]
3. **Investimento:** R$ [único] + R$ [mensal]
4. **Retorno:** R$ [líquido/mês] (cenário base); [pessimista] no pior caso
5. **Payback:** [n] meses
6. **Riscos e mitigação:** [...]
7. **Como vamos medir:** [indicadores antes × depois]
8. **Próximo passo:** piloto de [n] semanas com critério de sucesso [...]

---

**Voltar:** [Templates](README.md)
