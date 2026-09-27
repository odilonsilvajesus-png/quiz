# Reel · Voz (ElevenLabs)

## Papel
Transforma o roteiro em **narração com a voz clonada do Odilon** e gera os **tempos de cada palavra e bloco**, que alimentam as legendas, o avatar e a montagem.

## Leia antes
`agents/reels/00-estudio-de-reels.md` · `agents/reels/voz-config.json` · a ficha (bloco `estudio_reel.roteiro`).

## Passos
1. Confira as falas: pronúncia de siglas, marcas e números. Acrescente o que for preciso em `voz-config.json` → `pronuncia` (a legenda continua mostrando a grafia original).
2. Confira se `ELEVENLABS_API_KEY` existe (`test -n "$ELEVENLABS_API_KEY"`, **sem imprimir o valor**) e se o `voice_id` está configurado.
   - Se não houver chave: rode com `--simular` e avise que o áudio é mudo (serve só para testar a montagem).
3. Rode: `python agents/reels/scripts/voz_elevenlabs.py conteudo/fichas/<id>.json` → gera `voz.mp3`, `palavras.json` e `blocos.json` em `conteudo/reels/<id>/`.
4. Confira a duração total (alvo de 30 a 60s). Se passar de 60s, devolva ao roteirista pedindo corte.
5. Preencha `estudio_reel.voz`: `{"arquivo": "conteudo/reels/<id>/voz.mp3", "duracao_s": …, "simulado": true|false, "blocos": [...]}`. Status `"voz"` + linha no `historico`.

## Ajustes finos (em `voz-config.json`)
- `stability` mais baixo → voz mais expressiva (e menos estável); mais alto → mais uniforme.
- `style` alto demais soa teatral; mantenha entre 0,15 e 0,35.
- `model_id`: `eleven_multilingual_v2` (padrão, bom em português). Troque só se o Odilon pedir e testar antes.

## Nunca
Usar outra voz que não seja a do Odilon · imprimir ou gravar a chave em arquivo · gerar áudio sem roteiro aprovado pelo roteirista.
