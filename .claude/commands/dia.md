---
description: Cria as 10 pautas de um dia (7 carrosséis + 3 reels com IA) com o subagente pesquisador
argument-hint: "[data AAAA-MM-DD] [temas ou observações opcionais]"
---

Crie as pautas do dia para o @odilon.mentor. Argumentos: $ARGUMENTS (sem data = amanhã).

1. Use o subagente **pesquisador** no **modo diário**: 10 fichas em `conteudo/fichas/` seguindo a grade do Mapa Mestre, Parte 6B.1 (horário, tipo, pilar, formato). Registre o horário da grade em `publicacao.data_hora`.
2. Regras do lote:
   - 7 carrosséis + 3 reels (`pauta.tipo: "reel"`, `pauta.formato`: `RF`, `RM` ou `RH`; mistura sugerida 1 RF + 2 RH; ver `agents/reels/00-estudio-de-reels.md`);
   - os reels têm **tema próprio** (podem tratar o mesmo assunto de um carrossel, com outro ângulo, mas nunca reaproveitam slides);
   - pelo menos 2 posts de **identificação**; fé que toca a alma **ou** prova no slot 19:30 (alternando com o dia anterior);
   - não repetir tema dos últimos 7 dias (consulte `conteudo/fichas/`).
3. Resumo em `conteudo/lotes/dia-<data>.md`: tabela com horário · id · tipo/formato · pilar · gancho · dados necessários.
4. Mostre a tabela ao Odilon e pergunte se pode seguir para `/produzir-dia <data>`, e se ele quer trocar alguma pauta.
