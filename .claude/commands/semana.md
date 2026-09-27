---
description: Cria o lote semanal de 14 pautas (7 carrosséis + 7 reels) com o subagente pesquisador
argument-hint: "[data de início da semana AAAA-MM-DD] [temas ou observações opcionais]"
---

Crie o lote de pautas da semana para o @odilon.mentor.

Argumentos: $ARGUMENTS (se não houver data, use a próxima segunda-feira).

1. Use o subagente **pesquisador** para gerar as 14 fichas em `conteudo/fichas/` e o resumo em `conteudo/lotes/`.
2. Confira que as fichas passam no schema `agents/ficha-de-conteudo.schema.json` (rode um script Python curto com `json` para checar campos obrigatórios e enums).
3. Mostre ao Odilon uma tabela: dia sugerido · id · pilar · tipo/formato · gancho · dados necessários.
4. Pergunte quais pautas ele aprova para produção e quais dados (casos, números, história) ele pode fornecer agora. Não siga para a produção sem a escolha dele.
