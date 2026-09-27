---
description: Prepara o pacote de publicação (ou publica pela API) de uma ficha aprovada
argument-hint: "<id-da-ficha>"
---

1. Leia `conteudo/fichas/$ARGUMENTS.json`. Se `revisao.veredito` não for aprovado ou `publicacao.aprovacao_humana` não for `true`, pare e diga o que falta.
2. Use o subagente **publicador** para montar o pacote (arquivos, `legenda.txt`, data/hora sugerida, palavra-chave da automação de DM, necessidade de rótulo de IA).
3. Pergunte ao Odilon se ele vai postar manualmente/agendar na ferramenta dele ou pela API. Só use a API com confirmação explícita, e sempre rode a simulação antes.
4. Depois de publicado, peça o link do post e registre na ficha.
