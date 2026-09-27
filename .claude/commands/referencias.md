---
description: Coleta ou atualiza perfis de referência do Instagram e resume o que está funcionando
argument-hint: "<@perfil> [@perfil2 ...]"
---

Perfis: $ARGUMENTS

1. Confira se a variável `APIFY_TOKEN` existe (`test -n "$APIFY_TOKEN"`), sem imprimir o valor. Se não existir, peça ao Odilon para configurá-la no terminal (`export APIFY_TOKEN=...`) e pare.
2. Para cada perfil: `python scraper/instagram_scraper.py <perfil> --max-posts 50 --sem-midias`.
3. Use o subagente **pesquisador** para ler `output/<perfil>/posts.csv` e `perfil.json` e resumir: formatos que mais performam, ganchos dos top 10 posts (só os que estão 2x acima da mediana do perfil), CTA/funil e o que dá para modelar no conteúdo do Odilon.
4. Salve o resumo em `conteudo/lotes/referencias-<AAAA-MM-DD>.md`.
