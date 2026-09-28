---
description: Prospecção de clientes na base de seguidores (exportação do Instagram → Apify → pontuação → qualificação)
argument-hint: "<caminho da exportação do Instagram .zip> [--limite N]"
---

Exportação/argumentos: $ARGUMENTS

Siga `prospeccao/README.md`. Conta padrão: odilon.mentor.

1. **Seguidores:** se foi informado um caminho, rode `python prospeccao/prospectar.py seguidores <caminho>`. Se não, e `prospeccao/dados/odilon.mentor/seguidores.csv` não existir, explique ao Odilon como baixar a exportação (seção 1 do README) e pare.
2. **Token:** confira `test -n "$APIFY_TOKEN"` sem imprimir o valor. Se não existir, peça para configurar e pare.
3. **Engajados (opcional):** pergunte se quer incluir quem comentou nos últimos 30 posts. Se sim: `python prospeccao/prospectar.py engajados --posts 30 --confirmar`.
4. **Enriquecer:** rode primeiro sem `--confirmar` para mostrar quantos perfis serão coletados; **peça confirmação ao Odilon** (gasta créditos Apify). Na primeira vez, use `--limite 100` como teste; depois, o restante (a etapa retoma de onde parou).
5. **Pontuar:** `python prospeccao/prospectar.py pontuar`.
6. **Qualificar:** chame o subagente **qualificador-de-leads** para `prospeccao/dados/odilon.mentor/leads.csv`.
7. Mostre ao Odilon: quantos A/B/C, os 10 perfis mais quentes (com a dor e a mensagem sugerida) e os caminhos de `leads.xlsx` e `leads-qualificados.md`. Lembre: DMs enviadas à mão, poucas por dia.
