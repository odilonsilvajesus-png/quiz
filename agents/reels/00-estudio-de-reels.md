# Estúdio de Reels: @odilon.mentor (SIC)
Time **separado** do time de carrosséis, especializado em reels feitos com **o rosto do Odilon**, **a voz dele no ElevenLabs** e **IA de movimento de vídeo**. Meta: **3 reels por dia**.

> Os reels **não** reaproveitam slides de carrossel. Cada reel tem roteiro falado próprio.

## 1. Os 3 tipos de reel
| Código | Tipo | Como é | Quando usar |
|---|---|---|---|
| **RF** | **Odilon falando** | Avatar do Odilon com sincronia labial, falando para a câmera, com a voz dele (ElevenLabs) | Opinião, resposta de caixinha, identificação, "o que você faria?" |
| **RM** | **Odilon em movimento + narração** | Fotos do Odilon animadas por IA (andando, digitando, no carro, olhando pela janela) com a voz dele em off | Reflexão, fé (só com fotos reais animadas; ver regra 4), história, mentalidade |
| **RH** | **Híbrido (padrão)** | Abre com RF (gancho falado olhando para a câmera) → meio com RM e b-roll → fecha com RF (CTA) | A maioria dos reels: prende no rosto, mantém com movimento |

**B-roll sem pessoa** (IA genérica: cena, objeto, mãos) pode entrar como complemento em RM e RH, seguindo `agents/conhecimento/politica-de-imagens.md`.

**Mistura diária sugerida:** 1 RF + 2 RH, ou 1 RF + 1 RM + 1 RH. Duração: **30 a 60 segundos**.

## 2. O time
| Ordem | Agente | Entrega | Arquivo de instruções |
|---|---|---|---|
| 1 | **reel-roteirista** | Roteiro falado em blocos + texto na tela + tipo de cena por bloco + legenda | `01-roteirista.md` |
| 2 | **reel-voz** | Narração no ElevenLabs (`voz.mp3`) + tempo de cada palavra e bloco | `02-voz.md` |
| 3 | **reel-diretor-de-cena** | Storyboard: para cada bloco, a foto de referência do Odilon, a ferramenta e o **prompt** de avatar ou de movimento | `03-diretor-de-cena.md` |
| — | **Odilon / ferramenta** | Gera os clipes (avatar e movimento) com os prompts e salva em `conteudo/reels/<id>/clipes/` | — |
| 4 | **reel-editor** | Monta o reel final: clipes + voz + legendas + título + CTA + selo, na identidade SIC | `04-editor.md` |
| 5 | **reel-revisor** | Aprova ou reprova: roteiro, voz, sincronia labial, rosto, marca, regras de IA | `05-revisor-de-reels.md` |
| 6 | **publicador** (o mesmo dos carrosséis) | Publica com **rótulo de IA** ativado | `agents/05-agente-publicador.md` |

## 3. Pasta de cada reel
```
conteudo/reels/<id>/
  voz.mp3          ← reel-voz (ElevenLabs)
  palavras.json    ← reel-voz (tempo de cada palavra)
  blocos.json      ← reel-voz (tempo de cada bloco)
  storyboard.json  ← reel-diretor-de-cena
  prompts.md       ← reel-diretor-de-cena (prompts prontos para copiar nas ferramentas)
  clipes/          ← Odilon/ferramenta (01-avatar.mp4, 02-movimento.mp4…)
  reel-rascunho.mp4 / reel-final.mp4  ← reel-editor
```
Os arquivos de áudio e vídeo não vão para o git; storyboard e prompts vão (junto com a ficha).

## 4. Regras (inegociáveis)
1. **Só o rosto e a voz do Odilon.** Nunca avatar, voz clonada ou rosto de outra pessoa (cliente, família, famoso).
2. **Rótulo de IA sempre:** todo reel RF, RM e RH é marcado como conteúdo com IA na publicação ("Informações de IA" no Instagram).
3. **Sem prova falsa:** nada de clipe mostrando evento, palco, cliente, tela com resultado, prêmio ou viagem que não aconteceu.
4. **Fé e testemunho:** RF/RH com avatar **não** falam de testemunho pessoal ("eu orava…"). Para fé, use **RM com fotos reais do Odilon** animadas (origem `odilon-real`) e roteiro de reflexão, ou grave de verdade.
5. **Voz:** só a voz clonada do Odilon, com o consentimento dele registrado no ElevenLabs. Pronúncia revisada (dicionário em `voz-config.json`).
6. **Qualidade de rosto e boca:** clipe com boca borrada, dente estranho, olhar parado ou rosto diferente do Odilon é descartado e refeito. Se passar por "vídeo de IA mal feito", **não publica**.
7. **Reel real toda semana:** pelo menos 1 reel gravado de verdade por semana, para comparar métricas com os de IA (Mapa Mestre, Parte 6B).

## 5. Ferramentas (exemplos; confira preço, qualidade e termos de uso antes)
| Etapa | Exemplos | Observação |
|---|---|---|
| Voz | **ElevenLabs** (clone profissional da voz do Odilon) | Automático via `scripts/voz_elevenlabs.py` com `ELEVENLABS_API_KEY` |
| Avatar falando (RF) | HeyGen, Hedra, Kling (lip sync), Higgsfield | Entrada: foto ou vídeo de referência do Odilon + `voz.mp3` do bloco |
| Movimento (RM) | Kling, Veo, Runway, Hailuo, Higgsfield | Entrada: foto do Odilon (do `fotos/indice.json`) + prompt de movimento |
| Montagem | **Automática:** `scripts/montar_reel.py` | Alternativa manual: CapCut, com o storyboard como guia |

Hoje os clipes de avatar e de movimento são gerados **nas ferramentas** (manual ou pelo painel delas) com os prompts do diretor de cena. Se alguma ferramenta escolhida tiver API, dá para automatizar essa etapa depois com um script como o de voz.

## 6. Comandos
```
/dia <data>             → as 3 pautas de reel do dia saem junto com os carrosséis (tipo "reel", formato RF/RM/RH)
/produzir-reel <id>     → roteirista → voz → diretor de cena → entrega os prompts e para (Odilon gera os clipes)
/montar-reel <id>       → editor monta com os clipes em clipes/ → revisor → pede aprovação
```

## 7. Scripts
```bash
python agents/reels/scripts/voz_elevenlabs.py conteudo/fichas/<id>.json            # narração + tempos (ElevenLabs)
python agents/reels/scripts/voz_elevenlabs.py conteudo/fichas/<id>.json --simular  # teste sem API (áudio mudo)
python agents/reels/scripts/montar_reel.py conteudo/reels/<id> --rascunho          # prévia rápida
python agents/reels/scripts/montar_reel.py conteudo/reels/<id>                     # versão final
```
