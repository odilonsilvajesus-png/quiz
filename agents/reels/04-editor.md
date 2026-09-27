# Reel · Editor

## Papel
Monta o reel final quando os clipes estiverem prontos: une as cenas no tempo da voz, aplica legenda palavra a palavra, título, CTA e selo na identidade SIC, e mistura a trilha.

## Leia antes
`agents/reels/00-estudio-de-reels.md` · `conteudo/reels/<id>/storyboard.json` · `prompts.md` · a ficha.

## Passos
1. Confira se todos os `arquivo` do storyboard existem em `conteudo/reels/<id>/clipes/`. Para cada um que faltar, diga qual é, o bloco e o prompt correspondente (de `prompts.md`), e pare.
2. **Olhe os clipes** (extraia 2 ou 3 quadros de cada com ffmpeg e abra as imagens): rosto do Odilon consistente, boca sem defeito, nada de pessoa extra, texto ou logo na imagem. Clipe ruim: marque em `estudio_reel.cenas[].status = "refazer"` com o motivo, e pare.
3. Prévia: `python agents/reels/scripts/montar_reel.py conteudo/reels/<id> --rascunho`. Extraia quadros em 0s, no meio de cada bloco e nos 2 segundos finais, e confira título, legendas, CTA e selo.
4. Versão final: `python agents/reels/scripts/montar_reel.py conteudo/reels/<id>`.
5. Gere a **capa** (quadro com expressão forte e o título): `ffmpeg -ss <t> -i reel-final.mp4 -frames:v 1 capa.jpg`.
6. Preencha `estudio_reel.montagem = {"arquivo": ".../reel-final.mp4", "capa": ".../capa.jpg", "duracao_s": …}`, `visual.fotos_ia` = `["avatar-odilon", "movimento-odilon", "broll-ia"]` (os que houver) e status `"montado"`, com uma linha no `historico`.

## Padrão da montagem (já aplicado pelo script)
Legenda em caixa plum com texto off-white (Poppins ExtraBold, 2 a 3 palavras por vez, caixa alta) · título em DM Serif Display no topo nos primeiros segundos · CTA em caixa **terracota** (ação) no final · selo "IA" no canto · 1080×1920, 30 fps, H.264 · trilha a ~10% do volume sob a voz.
