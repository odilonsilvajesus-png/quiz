# Como usar a máquina de conteúdo no VS Code + Claude Code

## 1. Preparar (uma vez)
1. Instale o **VS Code** e a extensão **Claude Code** (ou use o `claude` no terminal integrado).
2. Clone o repositório e entre na branch:
   ```bash
   git clone https://github.com/odilonsilvajesus-png/quiz.git
   cd quiz
   git checkout claude/instagram-scraper-8lb62j
   ```
3. Instale as dependências:
   ```bash
   pip install -r scraper/requirements.txt -r agents/requirements.txt
   playwright install chromium
   ```
4. **Fotos:** baixe a pasta do Google Drive para `fotos/originais/`, **mantendo as subpastas**. Se ainda não houver, crie uma subpasta `ia/` para as fotos feitas com IA e deixe as reais fora dela. Essa pasta não vai para o GitHub.
5. **Tokens** (no terminal, nunca em arquivo versionado):
   ```bash
   export APIFY_TOKEN=...          # para /referencias
   export IG_USER_ID=...           # opcional, só para publicar pela API
   export IG_ACCESS_TOKEN=...
   ```
6. Preencha os campos `{{ }}` de `agents/00-base-de-conhecimento.md`. Os mais importantes: **sua história**, **casos reais de clientes com números**, **oferta**, **palavra-chave da CTA** e **link do formulário**.

## 2. Como o Claude Code entende o projeto
| Arquivo | Para quê |
|---|---|
| `CLAUDE.md` | Lido automaticamente em toda sessão: estrutura, fluxo e regras |
| `.claude/agents/*.md` | **Subagentes:** pesquisador, redator, visual, revisor, publicador e arquivista-de-fotos |
| `.claude/commands/*.md` | **Comandos** que você digita com `/` |
| `.claude/settings.json` | Permissões: renderizar e coletar sem pedir; publicar sempre pede confirmação |
| `agents/*.md` e `agents/conhecimento/*.md` | Instruções e conhecimento que cada subagente lê antes de trabalhar |

## 3. Rotina
| Quando | Comando | O que acontece |
|---|---|---|
| 1ª vez e a cada fotos novas | `/catalogar-fotos` | O arquivista olha cada foto e monta `fotos/indice.json` (real/IA, cena, enquadramento, usos) |
| A cada 15 dias | `/referencias ricardonuneseletro umantoniodasilva rodvincenzi` | Atualiza as referências e resume o que está funcionando |
| **Todo dia (meta de 10 posts)** | `/dia 2026-10-06` e depois `/produzir-dia 2026-10-06` | 10 pautas (7 carrosséis + 3 reels com IA), produção em lote e **um painel de aprovação** para o dia inteiro |
| Planejamento semanal (opcional) | `/semana 2026-10-05` | 14 pautas em `conteudo/fichas/` e um resumo; você escolhe quais produzir |
| Para cada pauta escolhida | `/produzir-post <id>` | Redator → visual → revisor (até 3 rodadas); PNGs em `conteudo/render/<id>/`; pede a sua aprovação |
| Depois de aprovar | `/publicar <id>` | Pacote pronto (imagens + `legenda.txt` + horário + palavra-chave + aviso de rótulo de IA) ou publicação pela API |
| 48h depois | `/metricas semana` | Registra os números e gera o relatório que alimenta a próxima `/semana` |

Você também pode chamar um subagente direto: *"use o subagente redator na ficha 2026-10-06-chatgpt-nao-e-ia"*.

## 4. Exemplo pronto
`conteudo/fichas/exemplo-2026-10-11-bet-empresario.json` (e o `.visual.json` ao lado) mostram uma ficha completa. Para gerar as imagens:
```bash
python agents/render/render.py conteudo/fichas/exemplo-2026-10-11-bet-empresario.visual.json --saida conteudo/render/exemplo-2026-10-11-bet-empresario
```

## 5. Ajustes comuns
- **Trocar fontes:** no `.visual.json` do post, `"marca": {"arquivo": "../../agents/marca-sic.json", "fontes": {"titulo": "DM Serif Display", "texto": "Inter"}}`. Para trocar de vez, edite `agents/marca-sic.json`.
- **Mudar tom, pilares ou regras:** edite `agents/00-base-de-conhecimento.md` ou `agents/conhecimento/mapa-mestre.md`. Os subagentes leem esses arquivos a cada tarefa.
- **Mudar o comportamento de um agente:** edite o arquivo dele em `agents/0X-agente-*.md` (as instruções completas); o `.claude/agents/*.md` só aponta para ele.
