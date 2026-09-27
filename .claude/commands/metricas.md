---
description: Registra as métricas dos posts publicados há 48h+ e gera o relatório semanal de aprendizado
argument-hint: "[id-da-ficha ou 'semana']"
---

1. Liste as fichas em `conteudo/fichas/` com `status: "publicado"` e sem `publicacao.metricas`, publicadas há mais de 48h (ou só `$ARGUMENTS`, se for um id).
2. Peça ao Odilon os números de cada post (alcance, curtidas, comentários, salvamentos, compartilhamentos, leads na DM) ou leia um print/CSV que ele enviar.
3. Use o subagente **publicador** para registrar as métricas e escrever o relatório semanal em `conteudo/lotes/relatorio-<AAAA-MM-DD>.md`.
4. Destaque 3 aprendizados para o próximo `/semana`.
