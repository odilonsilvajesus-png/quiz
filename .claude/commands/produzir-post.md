---
description: Produz um post do início ao fim (redator → visual → revisor) a partir de uma ficha com status "pauta"
argument-hint: "<id-da-ficha>"
---

Produza o post da ficha `conteudo/fichas/$ARGUMENTS.json`.

1. Leia a ficha. Se `pauta.dados_necessarios` tiver itens que ainda não estão na base de conhecimento, pergunte ao Odilon antes de continuar (ou siga sem aquele dado, se ele autorizar).
2. **Redator:** use o subagente **redator** para preencher o bloco `texto`. Mostre ao Odilon as 3 opções de gancho e use a primeira se ele não escolher outra.
3. **Visual:** use o subagente **visual** para gerar o spec e os PNGs (carrossel/estático) ou os planos de gravação e edição (reel).
4. **Revisor:** use o subagente **revisor**.
   - Veredito `reprovado` ou `ajustes`: mande os ajustes para o subagente indicado em `para` (redator ou visual) e revise de novo. **Máximo de 3 rodadas.**
   - Ajustes com `para: "humano"`: pare e pergunte ao Odilon.
5. Quando aprovado, mostre ao Odilon: as imagens em `conteudo/render/$ARGUMENTS/` (ou o roteiro do reel), a legenda, as notas do revisor, as fotos com origem IA usadas e as pendências.
6. Pergunte se ele aprova a publicação. Só se ele disser sim explicitamente, grave `publicacao.aprovacao_humana: true` na ficha.
