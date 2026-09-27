# Time de agentes de conteúdo: IA para Empresários

São 5 agentes, cada um com uma função, trabalhando em sequência. Eles passam entre si **uma única ficha de conteúdo em JSON**, que vai sendo preenchida a cada etapa.

```
 ┌─────────────┐   pautas    ┌───────────┐   textos   ┌──────────┐  slides/roteiro  ┌──────────┐  aprovado  ┌─────────────┐
 │ 1 PESQUISADOR├───────────▶│ 2 REDATOR ├──────────▶│ 3 VISUAL ├────────────────▶│ 4 REVISOR├──────────▶│ 5 PUBLICADOR│
 └─────────────┘             └───────────┘            └──────────┘                  └────┬─────┘            └──────┬──────┘
        ▲                          ▲                        ▲                             │ reprovado             │
        │                          └────────────────────────┴─────── volta com ajustes ───┘                       │
        └──────────────────────────── métricas dos posts publicados (aprendizado) ─────────────────────────────────┘
```

| # | Agente | Arquivo de instruções | Entrega |
|---|---|---|---|
| 1 | Pesquisador | `01-agente-pesquisador.md` | Pautas com referência real, gancho sugerido, pilar e formato |
| 2 | Redator | `02-agente-redator.md` | Texto de cada slide / roteiro do reel + legenda + CTA |
| 3 | Visual | `03-agente-visual.md` | JSON de renderização → PNGs (carrossel) · plano de gravação e edição (reel) |
| 4 | Revisor | `04-agente-revisor.md` | Nota por critério, aprovado/reprovado, lista de ajustes |
| 5 | Publicador | `05-agente-publicador.md` | Agendamento/publicação + registro e coleta de métricas |

## Arquivos de conhecimento (anexar a TODOS os agentes)
1. `00-base-de-conhecimento.md`: marca, público, pilares, pontes, tom, CTA, identidade visual e regras. **Preencha os campos `{{…}}` antes de usar.**
2. `conhecimento/mapa-mestre.md`: direção única (v1 + v2) com pilares, estruturas, formatos visuais, conversão, reels, rotina e checklist. Baseado em Ricardo Nunes, Antônio da Silva, Rod Vincenzi, Rishi, Social Media de Elite e Rapha Falcão.
3. `ficha-de-conteudo.schema.json`: o formato do JSON que passa de um agente para o outro.

## Ferramentas deste repositório que os agentes usam
| Ferramenta | Quem usa | Comando |
|---|---|---|
| `scraper/instagram_scraper.py` | Pesquisador | `APIFY_TOKEN=... python scraper/instagram_scraper.py @perfil --max-posts 50` |
| `agents/render/render.py` | Visual | `python agents/render/render.py ficha-visual.json --saida output/carrosseis/<id>` |
| `agents/publish/publicar_instagram.py` | Publicador | `python agents/publish/publicar_instagram.py ficha.json` (simulação por padrão) |

## Instalação (para rodar as ferramentas)
```bash
pip install -r scraper/requirements.txt -r agents/requirements.txt
playwright install chromium   # só fora do Claude Code na web
```

## Como montar em cada plataforma
- **Claude (Projetos):** crie 1 projeto por agente. Cole o conteúdo do arquivo `0X-agente-*.md` nas **instruções do projeto** e anexe os arquivos de conhecimento. Você passa a ficha JSON de um projeto para o outro.
- **ChatGPT (GPTs personalizados):** mesmo esquema. Instruções = arquivo do agente; Knowledge = arquivos de conhecimento.
- **Automação (n8n, Make, Claude Agent SDK / API):** cada agente vira uma chamada de modelo com o arquivo como *system prompt* e a ficha JSON como entrada. As ferramentas (scraper, render e publicação) viram nós ou ferramentas que o agente chama.
- **Claude Code:** os 5 arquivos podem virar subagentes em `.claude/agents/`. Eles rodam dentro deste repositório com acesso direto ao scraper e ao renderizador.

## Regras do time
1. **Nada é publicado sem aprovação humana.** O Revisor aprova a qualidade; você aprova a publicação (`aprovacao_humana: true` na ficha).
2. **Nada é inventado.** Números, casos de cliente e histórias pessoais vêm da base de conhecimento ou de você. Se faltar, o agente pede, não inventa.
3. **Cada agente só mexe na sua parte da ficha** e registra o que fez em `historico`.
