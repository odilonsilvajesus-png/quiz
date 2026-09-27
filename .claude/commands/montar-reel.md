---
description: Estúdio de Reels · monta o reel com os clipes gerados (editor → revisor) e pede aprovação
argument-hint: "<id-da-ficha>"
---

1. Use o subagente **reel-editor** em `conteudo/reels/$ARGUMENTS/`. Se faltar clipe ou algum precisar ser refeito, mostre a lista (com o prompt de cada um) e pare.
2. Use o subagente **reel-revisor**. Ajustes voltam para o subagente indicado (reel-roteirista, reel-voz, reel-diretor-de-cena, reel-editor) ou para o Odilon (refazer clipe). Máximo de 3 rodadas.
3. Aprovado: mostre ao Odilon o caminho do `reel-final.mp4`, a capa, a legenda, as notas e o aviso de **rótulo de IA obrigatório**.
4. Pergunte se ele aprova a publicação. Só com um "sim" explícito, grave `publicacao.aprovacao_humana: true`.
