---
description: Produz em lote todas as fichas de um dia (redator → visual → revisor) e pede uma aprovação única
argument-hint: "<data AAAA-MM-DD>"
---

Produza todas as fichas com status "pauta" do dia $ARGUMENTS (id começando com a data ou `publicacao.data_hora` nesse dia).

1. **Carrosséis:** redação em paralelo com o subagente **redator** para as fichas de carrossel (pode rodar várias em paralelo, uma chamada por ficha ou por grupos de 3 a 4 fichas).
2. **Visual em paralelo:** chame o subagente **visual** para cada carrossel com texto pronto.
   - Carrosséis: spec + PNGs em `conteudo/render/<id>/`.
   - Controle de fotos: nenhuma foto repetida no dia nem nos últimos 7 dias.
2b. **Reels (Estúdio de Reels), em paralelo com os carrosséis:** para cada ficha de reel, rode o fluxo de `/produzir-reel` (reel-roteirista → reel-voz → reel-diretor-de-cena) até os prompts.
3. **Revisão dos carrosséis:** chame o subagente **revisor** para cada carrossel. Ajustes voltam para o subagente indicado (máximo de 3 rodadas por ficha). Ficha que não passar, ou com média abaixo de 7,5, fica de fora do dia.
4. **Painel de aprovação:** crie `conteudo/lotes/aprovacao-<data>.md` com, para cada post: horário, id, gancho, veredito e média, caminho das imagens/vídeo, fotos com IA usadas, pendências. Mostre ao Odilon.
5. Pergunte: "Aprovar todos? Ou quais ids vetar?". Grave `publicacao.aprovacao_humana: true` **só** nos que ele aprovar explicitamente.
6. **Reels:** liste, para cada um dos 3 reels, os clipes a gerar (arquivo esperado, ferramenta, foto de referência e prompt, ou o caminho do `prompts.md`) e lembre: depois de salvar os clipes, rodar `/montar-reel <id>` (montagem, revisão e aprovação do reel).
