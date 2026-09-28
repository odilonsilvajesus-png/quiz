# CLAUDE.md

Este repositório tem **dois projetos independentes**:
1. **Quiz (app web):** `index.html`, `src/`, `public/`, `package.json` (Vite + React + Tailwind). Só mexa nele se o pedido for sobre o quiz.
2. **Máquina de conteúdo do @odilon.mentor** (marca **SIC · Simeão IA Creator Digital**, "Domine com IA."): um time de agentes que pesquisa, escreve, monta o visual, revisa e publica conteúdo de Instagram para **donos de empresa**. Todo o resto deste arquivo é sobre ele.

## Estrutura
```
agents/                         ← fonte da verdade (instruções e conhecimento)
  00-base-de-conhecimento.md    marca, público, oferta, casos reais, tom, identidade SIC, regras
  01…05-agente-*.md             instruções completas de cada agente
  conhecimento/mapa-mestre.md   linha editorial, estruturas, formatos, ganchos, reels, checklist
  conhecimento/banco-de-fotos-ia.md   regras de uso de fotos do Odilon feitas com IA
  ficha-de-conteudo.schema.json      formato da ficha que passa de um agente para o outro
  marca-sic.json                paleta, fontes e estilo da marca (usado pelo renderizador)
  render/render.py              JSON → PNGs 1080×1350 (formatos A, B, C, D)
  reels/                        ESTÚDIO DE REELS (time separado): guia, 5 agentes, voz-config.json, scripts de voz e montagem
  publish/publicar_instagram.py publicação pela Graph API (simula por padrão)
.claude/agents/                 subagentes: qualificador-de-leads (prospecção); carrosséis (pesquisador, redator, visual, revisor, publicador, arquivista-de-fotos) e reels (reel-roteirista, reel-voz, reel-diretor-de-cena, reel-editor, reel-revisor)
.claude/commands/               comandos: /dia, /produzir-dia, /produzir-reel, /montar-reel, /semana, /produzir-post, /catalogar-fotos, /referencias, /publicar, /metricas, /prospectar
scraper/instagram_scraper.py    coleta de perfis de referência (Apify)
prospeccao/                     prospecção de clientes na base de seguidores: prospectar.py, icp.json, README (dados/ é ignorado pelo git)
conteudo/fichas/                uma ficha JSON por post (versionada)
conteudo/lotes/                 resumo de cada lote semanal de pautas (versionado)
conteudo/render/                PNGs gerados (ignorado pelo git)
fotos/                          imagens (ignorado pelo git): originais/ (Odilon, com ia/), ia-generica/, banco/, noticias/, internet/ + indice.json
output/                         coletas de referência e análises (ignorado pelo git)
```

## Setup (uma vez)
```bash
pip install -r scraper/requirements.txt -r agents/requirements.txt
playwright install chromium
```
- **Fotos:** sincronize a pasta do Google Drive do Odilon (https://drive.google.com/drive/folders/1IEW4NYUmXdegsE0Xmg6vVXvSIYQuznqS) para `fotos/originais/` (download manual ou Google Drive para computador). Depois rode `/catalogar-fotos`.
- **Variáveis de ambiente** (nunca em arquivo versionado nem no chat): `APIFY_TOKEN` (coleta de referências) · `IG_USER_ID` e `IG_ACCESS_TOKEN` (publicação pela API, opcional) · `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` (voz dos reels).

## Fluxo de trabalho
**Meta: 10 posts por dia (7 carrosséis + 3 reels com IA).** Grade no Mapa Mestre, Parte 6B.
**Dois times:** carrosséis (redator → visual → revisor) e **Estúdio de Reels** (`agents/reels/00-estudio-de-reels.md`: reel-roteirista → reel-voz → reel-diretor-de-cena → Odilon gera os clipes → reel-editor → reel-revisor). Reels usam o rosto do Odilon, a voz dele no ElevenLabs e IA de movimento; **nunca slides de carrossel**.
```
/dia <data>           → pesquisador cria as 10 pautas do dia (grade de horários) + resumo
/produzir-dia <data>  → carrosséis em lote + reels até os prompts (Estúdio de Reels) → painel de aprovação único
/montar-reel <id>     → depois que o Odilon gerar os clipes: montagem + revisão do reel
/semana               → (planejamento) pesquisador cria um lote de pautas da semana + resumo em conteudo/lotes/
Odilon escolhe as pautas
/produzir-post <id>   → redator → visual (render) → revisor (até 3 rodadas) → para e pede aprovação do Odilon
Odilon aprova         → publicacao.aprovacao_humana = true na ficha
/publicar <id>        → publicador agenda/publica e registra
/metricas             → publicador coleta métricas 48h depois e alimenta o pesquisador
/prospectar <zip>     → seguidores (exportação do Instagram) → Apify → pontuação → subagente qualificador-de-leads
```
Cada etapa é feita pelo **subagente certo** (ver `.claude/agents/`). O agente principal **orquestra**: chama o subagente, lê a ficha que ele devolveu, decide o próximo passo e mostra ao Odilon um resumo curto.

## Regras que valem para qualquer agente
1. **Antes de trabalhar, leia** `agents/00-base-de-conhecimento.md` e o arquivo de instruções do seu papel em `agents/`. Eles mandam; este CLAUDE.md só resume.
2. **Nunca invente** número, cliente, depoimento ou história. Se faltar dado, registre em `pendencias` e pergunte.
3. **Crença da marca:** o dono precisa estar envolvido na empresa, mas **nem tudo precisa passar por ele**.
4. **Sem política partidária, sem promessa de resultado, sem usar Deus como argumento de venda.**
5. **Imagens:** use só as catalogadas em `fotos/indice.json` e siga `agents/conhecimento/politica-de-imagens.md`. São 6 origens: `odilon-real`, `odilon-ia`, `ia-generica`, `banco`, `noticia` e `internet`. Resumo: foto feita com IA nunca em **fé/testemunho** nem como **prova**; banco só com licença registrada; notícia só com fonte e data visíveis; foto da internet só com licença; o Odilon aparece em ≥70% dos carrosséis. **Não gere imagens.**
6. **Identidade SIC** em toda arte: carregue `agents/marca-sic.json`; blocos sólidos, cantos retos, terracota `#B84B26` só em ação, sem emoji, sem degradê.
7. **Nada é publicado sem** `revisao.veredito` aprovado **e** `publicacao.aprovacao_humana: true`.
8. **Ficha é o contrato:** cada agente edita só o seu bloco da ficha (`pauta`, `texto`, `visual`, `revisao`, `publicacao`) e acrescenta uma linha em `historico`. Valide contra `agents/ficha-de-conteudo.schema.json`.

## Comandos úteis
```bash
python agents/render/render.py conteudo/fichas/<id>.visual.json --saida conteudo/render/<id>
python agents/reels/scripts/voz_elevenlabs.py conteudo/fichas/<id>.json [--simular]   # reel: narração ElevenLabs + tempos
python agents/reels/scripts/montar_reel.py conteudo/reels/<id> [--rascunho]          # reel: montagem final
python agents/publish/publicar_instagram.py conteudo/fichas/<id>.json            # simulação
python scraper/instagram_scraper.py <perfil> --max-posts 50 --sem-midias          # precisa de APIFY_TOKEN
```

## Convenções
- Todo conteúdo em **português do Brasil**.
- IDs de ficha: `AAAA-MM-DD-slug` (ex.: `2026-10-06-chatgpt-nao-e-ia`).
- O spec de renderização de cada post fica ao lado da ficha: `conteudo/fichas/<id>.visual.json`.
