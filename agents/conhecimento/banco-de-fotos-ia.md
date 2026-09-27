# Banco de fotos com IA: Odilon (@odilon.mentor)
Gerar fotos **do próprio Odilon** com IA a partir de fotos originais, para abastecer os carrosséis (formatos A, B e C) e as capas de reels **sem depender de sessão de fotos toda semana**.

## 1. Regras (inegociáveis)
1. **Só o Odilon.** A IA gera imagens **apenas do Odilon**, a partir das fotos de referência dele. **Nunca** de cliente, esposa, filhos, equipe ou qualquer outra pessoa real (para eles, só foto real e autorizada).
2. **Cenário sim, prova falsa não.** Pode gerar Odilon no escritório, no notebook, no carro, lendo a Bíblia, pensativo à janela. **Não pode** gerar cena que funcione como prova ou fato: palco lotado de evento que não aconteceu, reunião com cliente identificável, foto com pessoa famosa, tela com resultado/faturamento, prêmio, viagem que não houve.
3. **Conteúdo de fé e testemunho** ("Aqui eu orava…", antes e depois de vida): **só foto real**. Testemunho com foto inventada quebra a confiança que o conteúdo de alma constrói.
4. **Marcação:** toda imagem gerada entra no banco com `gerada_por_ia: true`, e a ficha registra isso em `visual.fotos_ia`. O Publicador ativa o **rótulo de IA do Instagram** ("Informações de IA") quando a imagem for fotorrealista.
5. **Aparência natural (regra da marca):** sem pele de plástico, sem brilho, sem sombra dramática, sem cenário futurista, sem robô, circuito ou rede neural. Se parecer "foto de IA", descarte.
6. **Proporção no feed:** no máximo **~60% das fotos** do mês geradas por IA. O restante precisa ser real (bastidor, cliente com autorização, família, eventos de verdade).

## 2. Fotos de referência (o que o Odilon precisa mandar)
Quanto melhores as referências, mais parecido o resultado.
- **15 a 25 fotos**, só ele na imagem, **boa luz natural** e alta resolução (foto de celular recente serve).
- Variar: **frente, 3/4 esquerda, 3/4 direita, perfil**; **sério, meio sorriso, sorrindo**; **rosto próximo, meio corpo, corpo inteiro** (3–4).
- **Sem óculos escuros, boné, filtro ou beleza do app**; sem outras pessoas cortadas na foto.
- 2 ou 3 roupas diferentes que ele realmente usa (a IA copia o estilo).
- Salvar em `fotos/referencias/` com nomes simples: `ref-frente-serio-01.jpg`, `ref-34-esq-sorrindo-02.jpg`…

## 3. Ferramentas possíveis (escolher uma)
| Tipo | Exemplos | Como funciona | Bom para |
|---|---|---|---|
| **Edição com referência** (sem treino) | Gemini (modelo de imagem do Google), ChatGPT (geração de imagem), FLUX Kontext | Envia 1–3 fotos + prompt; ele mantém o rosto e muda cenário e roupa | Começar hoje, poucas imagens por vez |
| **Modelo treinado com o seu rosto** | LoRA de FLUX (via Replicate ou fal.ai), Higgsfield (Soul ID), Leonardo, Midjourney com referência de personagem | Treina uma vez com 15–25 fotos e depois gera ilimitado só com texto | Volume alto e consistência (recomendado para os agentes) |

- Para os **agentes gerarem sozinhos**, é preciso uma ferramenta **com API** (ex.: Replicate, fal.ai, API do Gemini ou da OpenAI) e a chave guardada como variável de ambiente, nunca no chat nem no repositório.
- As ferramentas e modelos mudam rápido: confirmar preço, qualidade de rosto e **termos de uso** (direito de uso comercial das imagens) antes de escolher.

## 4. Padrão visual das fotos geradas (SIC)
Incluir em **todo prompt**:
```
photorealistic editorial photo of [ODILON], natural soft window light, muted warm tones,
subtle plum and terracotta accents in the environment, real Brazilian business setting,
35mm lens, shallow depth of field, natural skin texture, candid and authentic,
no text, no logos, no futuristic elements, no robots, no glow, no heavy shadows,
vertical 4:5 composition
```
- `[ODILON]` = o gatilho do modelo treinado (ex.: `ODLN man`) ou "the man in the reference photos".
- **Composição por formato:**
  - **Formato A:** pessoa na **metade de cima** (o texto entra no bloco plum embaixo) → acrescentar `subject in the upper half of the frame, empty space at the bottom`.
  - **Formato C:** foto cinematográfica e um pouco escura, com espaço no centro para o bloco de texto → `moody low light, centered negative space`.
  - **Capa de reel:** rosto grande e expressão forte → `close-up, strong expression, looking at camera`.
- **Roupa:** tons neutros (off-white, preto, grafite, bege), camisa ou polo lisa; um acessório discreto pode ter plum ou terracota.

## 5. Biblioteca de cenas (prompts-base)
Cada linha vira de 3 a 5 variações. Nome do arquivo: `ia-<cena>-<nº>.jpg`.

| Cena | Pilar / uso | Prompt (acrescentar ao padrão da seção 4) |
|---|---|---|
| `escritorio-falando` | Mentalidade, capa A | `[ODILON] explaining something with hand gestures, seated at a wooden desk in a modern small-business office, looking at camera` |
| `notebook-whatsapp` | IA | `[ODILON] working on a laptop, focused, phone beside the laptop, over-the-shoulder angle, screen out of focus` |
| `janela-pensativo` | Mentalidade, fé | `[ODILON] standing by a window at dusk, thoughtful expression, hands in pockets, city lights blurred` |
| `carro-parado` | Identificação, fé (madrugada) | `[ODILON] sitting in a parked car at night, serious and tired expression, dashboard light on the face` |
| `madrugada-celular` | Fé (estrutura ALMA) | `[ODILON] sitting on the edge of a bed at 3am, face lit only by a phone screen, dark room` |
| `biblia-mesa` | Fé | `[ODILON] reading an open Bible at a kitchen table in the early morning, coffee mug, soft sunlight` |
| `caminhando-rua` | Mentalidade, identificação | `[ODILON] walking on a city sidewalk holding a coffee, candid street photo` |
| `abrindo-porta` | Identificação ("e mesmo assim você abre as portas") | `[ODILON] opening the glass door of a small business in the morning, seen from outside` |
| `quadro-branco` | Negócios, ensino (B) | `[ODILON] pointing at a whiteboard with a simple process diagram (unreadable scribbles), small meeting room` |
| `retrato-autoridade` | Capa B, Comece Aqui | `[ODILON] portrait, arms crossed, confident but warm smile, plain dark plum wall background` |
| `cafe-agenda` | Negócios, rotina | `[ODILON] writing in a paper planner at a café table, laptop closed beside` |
| `sorrindo-camera` | CTA (último slide) | `[ODILON] smiling at camera, relaxed posture, modern office background softly blurred` |

**Nunca gerar:** palco, plateia, "evento lotado", cliente ou pessoas identificáveis, telas com números ou resultados, prêmios, carros e bens de luxo como ostentação, cenários de viagem que não aconteceram.

## 6. Fluxo no time de agentes
```
Odilon envia referências → (1x) treino do modelo / configuração da ferramenta
        ↓
Agente Visual lê as fichas da semana → escolhe a cena da biblioteca para cada slide
        ↓
Gera 3–5 variações por cena → salva em fotos/ia/ com metadados (cena, prompt, data, gerada_por_ia: true)
        ↓
Odilon aprova as melhores (as reprovadas são apagadas) → usa no JSON de renderização
        ↓
Revisor confere as regras da seção 1 → Publicador ativa o rótulo de IA quando necessário
```
Metadados de cada imagem (arquivo `fotos/ia/indice.json`):
```json
{"arquivo": "ia-carro-parado-02.jpg", "cena": "carro-parado", "prompt": "…", "ferramenta": "…", "data": "2026-10-01", "gerada_por_ia": true, "aprovada": true}
```
