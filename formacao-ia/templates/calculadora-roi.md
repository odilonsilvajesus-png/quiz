# Calculadora de ROI de IA

> Monte esta tabela em Google Sheets ou Excel. As fórmulas estão indicadas ao lado de cada linha, com as referências de célula na coluna B (os valores ficam na coluna B, começando na linha 2).

## 1. Premissas

| Linha | Item | Valor | Fórmula / fonte |
|---|---|---|---|
| 2 | Salário mensal da função | 2.500 | informado pelo cliente |
| 3 | Fator de encargos e benefícios | 1,8 | regra prática CLT (ajustar) |
| 4 | Horas trabalhadas/mês | 176 | |
| 5 | **Custo da hora** | | `=B2*B3/B4` |
| 6 | Volume da tarefa/mês | 400 | medido no diagnóstico |
| 7 | Tempo por tarefa antes (min) | 12 | cronometrado |
| 8 | Tempo por tarefa depois (min) | 2 | medido no piloto ou estimado |
| 9 | **Horas economizadas/mês** | | `=B6*(B7-B8)/60` |
| 10 | Vendas adicionais/mês | 5 | estimativa conservadora |
| 11 | Ticket médio (R$) | 300 | |
| 12 | Margem de contribuição (%) | 40% | |

## 2. Benefícios mensais (cenário 100%)

| Linha | Item | Fórmula |
|---|---|---|
| 14 | Valor do tempo economizado | `=B9*B5` |
| 15 | Margem das vendas adicionais | `=B10*B11*B12` |
| 16 | Custos evitados (erros, contratação etc.) | informado |
| 17 | **Benefício bruto mensal** | `=B14+B15+B16` |

## 3. Custos

| Linha | Item | Valor |
|---|---|---|
| 19 | Investimento inicial (implementação + treinamento) | 5.000 |
| 20 | Licenças/plataformas por mês | |
| 21 | API + mensagens por mês | |
| 22 | Manutenção/suporte por mês | |
| 23 | **Custo mensal total** | `=B20+B21+B22` |

## 4. Resultado por cenário

| Linha | Indicador | Conservador (50%) | Provável (75%) | Otimista (100%) |
|---|---|---|---|---|
| 25 | Benefício mensal | `=B17*0,5` | `=B17*0,75` | `=B17` |
| 26 | Benefício líquido mensal | `=B25-$B$23` | `=C25-$B$23` | `=D25-$B$23` |
| 27 | Payback (meses) | `=SE(B26>0;$B$19/B26;"não se paga")` | idem | idem |
| 28 | ROI 12 meses (%) | `=(B26*12-$B$19)/$B$19` | idem | idem |

> Em planilhas com configuração em inglês, use vírgula nos argumentos e `IF` no lugar de `SE`.

## 5. Premissas declaradas (sempre escreva)
- Fonte do volume: ___
- Como o tempo foi medido: ___
- O tempo economizado será realocado para: ___
- Riscos que podem reduzir o benefício: ___
