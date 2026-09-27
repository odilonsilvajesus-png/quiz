---
description: Cataloga as fotos novas de fotos/ em fotos/indice.json com o subagente arquivista-de-fotos
argument-hint: "[pasta específica dentro de fotos/, opcional]"
---

1. Verifique se existem imagens em `fotos/` (ou em `$ARGUMENTS`, se informado). Se a pasta estiver vazia, explique ao Odilon como baixar a pasta do Google Drive (https://drive.google.com/drive/folders/1IEW4NYUmXdegsE0Xmg6vVXvSIYQuznqS) para `fotos/originais/`, mantendo as subpastas (principalmente a separação entre fotos reais e feitas com IA).
2. Use o subagente **arquivista-de-fotos** para catalogar as fotos novas.
3. Mostre o resumo: total por origem (real/ia/incerto), por cena, fotos com outras pessoas e cenas que faltam.
4. Liste as fotos com origem `incerto` e pergunte ao Odilon se são reais ou IA; atualize o índice com a resposta.
