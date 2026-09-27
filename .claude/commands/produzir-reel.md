---
description: Estúdio de Reels · do roteiro aos prompts (roteirista → voz → diretor de cena) e para para o Odilon gerar os clipes
argument-hint: "<id-da-ficha>"
---

Reel da ficha `conteudo/fichas/$ARGUMENTS.json` (tipo "reel", formato RF, RM ou RH).

1. Use o subagente **reel-roteirista**. Mostre ao Odilon as 3 opções de gancho, a duração estimada e o roteiro em blocos. Siga com a primeira opção se ele não escolher outra.
2. Use o subagente **reel-voz**. Sem `ELEVENLABS_API_KEY`, gere em modo `--simular` e avise.
3. Use o subagente **reel-diretor-de-cena** para o `storyboard.json` e o `prompts.md`.
4. Mostre ao Odilon a lista de clipes a gerar (arquivo esperado · bloco · segundos · ferramenta · foto de referência · prompt) e o caminho `conteudo/reels/$ARGUMENTS/prompts.md`.
5. Diga: "Salve os clipes em `conteudo/reels/$ARGUMENTS/clipes/` com esses nomes e rode `/montar-reel $ARGUMENTS`."
