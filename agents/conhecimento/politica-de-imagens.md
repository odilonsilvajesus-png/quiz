# Política de imagens dos carrosséis (@odilon.mentor · SIC)
Os carrosséis podem usar **6 fontes de imagem**. Cada uma tem regras próprias. Todas as imagens ficam em `fotos/` (subpasta por fonte) e são catalogadas em `fotos/indice.json` pelo **arquivista-de-fotos** com `origem`, `fonte`, `licenca` e `credito`.

> Os agentes **não geram imagens**. Eles catalogam, escolhem e usam o que está em `fotos/`. Imagens de IA, de banco ou de notícia são **baixadas ou criadas pelo Odilon (ou pela equipe) fora do sistema** e colocadas na pasta certa.

## 1. As 6 fontes
| `origem` | Pasta | O que é | Pode usar em | Não pode |
|---|---|---|---|---|
| `odilon-real` | `fotos/originais/` | Fotos reais do Odilon | Tudo, inclusive fé, testemunho e capa | – |
| `odilon-ia` | `fotos/originais/ia/` | Fotos do Odilon feitas com IA a partir das originais | Capa e slides de mentalidade, negócios e IA | Fé, testemunho, cena que pareça prova (ver `banco-de-fotos-ia.md`) |
| `ia-generica` | `fotos/ia-generica/` | Imagem feita com IA **sem pessoa real identificável**: cenário, objeto, mãos, silhueta, conceito | Slides internos, fundo de frase, formato C | Pessoa real ou famosa · cena que finja ser notícia, fato ou prova · robô, circuito, rede neural (regra da marca) |
| `banco` | `fotos/banco/` | Banco de imagens com licença (Unsplash, Pexels, Pixabay, Adobe Stock, Shutterstock, Freepik…) | Slides internos, formato C, fundo de frase | Foto de cliché (aperto de mão posado, "equipe feliz apontando para a tela") · imagem sem licença registrada |
| `noticia` | `fotos/noticias/` | **Print de manchete** ou trecho de notícia real | Formato B (tema quente, dado), identificação com assunto do momento | Manchete editada ou montada · notícia antiga apresentada como nova · reproduzir a matéria inteira |
| `internet` | `fotos/internet/` | Foto real de terceiros (pessoa famosa, empresa, produto, evento) | Só com **licença, material de imprensa oficial, domínio público ou Creative Commons** | Foto "achada no Google" sem licença · usar rosto famoso para sugerir que ele apoia o Odilon ou a oferta |

## 2. Regras por fonte

### Notícia (print de manchete)
- **Sempre com fonte visível no slide:** veículo e data (ex.: "Fonte: Valor Econômico, 06/10/2026") e o link na legenda.
- **Print fiel:** não editar título, número ou data. Recortar só a manchete (título, linha fina e, se preciso, 1 parágrafo).
- **Data recente:** notícia com mais de 30 dias só se o post deixar claro que é antiga.
- Uso para **comentar e analisar** (é o que torna a citação legítima). O carrossel precisa trazer a opinião ou lição do Odilon, não só repostar.
- **Veículo confiável** (jornal, portal de economia, site oficial). Nada de print de post anônimo ou de site duvidoso.
- Sem política partidária: notícia de governo só pelo impacto **no negócio** (imposto, crédito, varejo, bets e consumo), sem atacar ou defender partido ou pessoa.

### Banco de imagens
- **Registrar a licença:** no índice, `fonte` (site), `url` e `licenca` ("Unsplash License", "Pexels License", "Adobe Stock Standard"…). Sem licença registrada, não entra.
- **Crédito:** quando a licença pedir (ou por boa prática), crédito pequeno no slide ou na legenda ("Foto: Nome / Unsplash").
- **Estilo SIC:** fotos naturais de operação e negócio, luz real, tons quentes. Evitar fundo branco de estúdio, sorriso forçado e escritório genérico de revista.
- Bancos gratuitos proíbem, em geral, usar a foto para sugerir que a pessoa retratada endossa algo, ou em contexto sensível. Confira a licença do site.

### IA genérica
- **Sem pessoa real identificável** (nem famosa, nem cliente, nem "parecida com alguém").
- **Aparência natural**, na paleta da marca. Nada de robô, circuito, cérebro digital, holograma ou brilho neon.
- **Nunca como prova ou notícia:** não gerar "foto de evento", "tela com faturamento", "manchete".
- Registrar `fonte` (ferramenta) e `gerada_por_ia: true`. O Publicador ativa o rótulo de IA quando a imagem for fotorrealista.

### Foto real da internet
- Só entra com uma destas licenças: **material de imprensa oficial** (press kit da empresa ou do evento), **domínio público**, **Creative Commons** (seguir a exigência: crédito, não comercial etc.) ou **licença comprada** (Getty, Reuters, Folhapress…).
- **Pessoa famosa:** em conteúdo de **análise ou história** (ex.: "o que o dono da Havan fez com…"), com crédito, e **nunca** perto da CTA de venda ou sugerindo apoio ao Odilon.
- Na dúvida, troque por print de notícia (com fonte) ou por imagem de banco.

## 3. Mistura recomendada por post
| Tipo de post | Capa | Slides internos |
|---|---|---|
| Mentalidade, negócios, IA (formato A) | **Odilon** (real ou IA) | Odilon, banco ou IA genérica |
| Notícia ou tema quente (formato B) | **Print da notícia** ou Odilon | Notícia, dados, banco |
| Identificação (formato A/D) | Odilon ou banco (cena do dia a dia de dono) | Banco ou IA genérica (boleto, celular, porta, carro) |
| Fé que toca a alma (formato C) | **Odilon real** ou IA genérica sem pessoa (paisagem, Bíblia, mãos) | Odilon real ou IA genérica sem pessoa |
| Testemunho ("Aqui eu orava…") | **Só Odilon real** | **Só Odilon real** |
| Prova / caso de cliente | Odilon real | Print real autorizado (dados borrados) |

**Regra de marca pessoal:** em pelo menos **70% dos carrosséis**, o Odilon aparece em algum slide (de preferência na capa ou no último). Marca pessoal sem rosto não gera conexão.

## 4. Crédito no slide
O renderizador aceita o campo `credito` em qualquer slide com foto (texto pequeno no canto inferior) e o tipo de slide `noticia` no formato B (print com fonte). Exemplos em `agents/render/exemplos/exemplo-noticia-B.json`.

## 5. Campos no `fotos/indice.json`
```json
{
  "arquivo": "fotos/noticias/2026-10-06-valor-bets-varejo.png",
  "origem": "noticia",
  "fonte": "Valor Econômico",
  "url": "https://…",
  "data_publicacao": "2026-10-06",
  "licenca": "citação para comentário (print de manchete)",
  "credito": "Fonte: Valor Econômico, 06/10/2026",
  "gerada_por_ia": false,
  "pessoas": [],
  "cena": "manchete-bets-varejo",
  "usos": ["B-noticia"],
  "proibido_em": ["cta"]
}
```
