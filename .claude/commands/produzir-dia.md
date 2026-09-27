---
description: Produz em lote todas as fichas de um dia (redator → visual → revisor) e pede uma aprovação única
argument-hint: "<data AAAA-MM-DD>"
---

Produza todas as fichas com status "pauta" do dia $ARGUMENTS (id começando com a data ou `publicacao.data_hora` nesse dia).

1. **Redação em paralelo:** chame o subagente **redator** para as fichas (pode rodar várias em paralelo, uma chamada por ficha ou por grupos de 3 a 4 fichas).
2. **Visual em paralelo:** chame o subagente **visual** para cada ficha com texto pronto.
   - Carrosséis: spec + PNGs em `conteudo/render/<id>/`.
   - Reel **R3:** depois dos PNGs do carrossel de origem, rode `python agents/render/reel_de_slides.py conteudo/render/<id-do-carrossel> --zoom --saida conteudo/render/<id>/reel.mp4` (com `--audio` se houver trilha em `fotos/audio/`).
   - Reels **R1/R2:** plano de gravação/edição e os prompts para as ferramentas externas (avatar, voz, cenas).
   - Controle de fotos: nenhuma foto repetida no dia nem nos últimos 7 dias.
3. **Revisão:** chame o subagente **revisor** para cada ficha. Ajustes voltam para o subagente indicado (máximo de 3 rodadas por ficha). Ficha que não passar, ou com média abaixo de 7,5, fica de fora do dia.
4. **Painel de aprovação:** crie `conteudo/lotes/aprovacao-<data>.md` com, para cada post: horário, id, gancho, veredito e média, caminho das imagens/vídeo, fotos com IA usadas, pendências. Mostre ao Odilon.
5. Pergunte: "Aprovar todos? Ou quais ids vetar?". Grave `publicacao.aprovacao_humana: true` **só** nos que ele aprovar explicitamente.
6. Liste o que ainda depende de ferramenta externa (reels R1/R2) com os prompts prontos para copiar.
