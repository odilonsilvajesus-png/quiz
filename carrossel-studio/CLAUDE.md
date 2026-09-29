# Carrossel Studio: guia para o Claude

Sistema que coleta referências do Instagram/YouTube, escreve carrosséis na voz de cada cliente com IA
e renderiza os slides em PNG com a identidade visual do cliente. Quem usa não é programador: explique
passos em português simples e dê comandos prontos para copiar.

## Rodar
- `npm install` e `npm run painel` → http://localhost:3333 (painel web, é por onde tudo é usado).
- Chaves no `.env` (modelo em `.env.example`): `OPENAI_API_KEY` (texto e imagens), `APIFY_TOKEN`, `YOUTUBE_API_KEY`.
- Sem chaves tudo roda em modo demonstração.
- Render usa o Google Chrome instalado (playwright-core, `channel: "chrome"`) ou `CHROMIUM_PATH`.

## Estrutura
- `src/servidor.js`: servidor HTTP do painel e rotas `/api/...`.
- `painel/index.html`: painel inteiro (HTML + JS puro, rotas por hash `#/c/<cliente>/<aba>`).
- `src/cliente.js`: leitura/gravação do kit do cliente (`clientes/<id>/cliente.json`), paleta → fundos, normalização de formatos antigos.
- `src/pipeline.js`: referência → copy (`src/copy.js`) → imagens (`src/imagens.js`) → PNGs (`src/render.js`).
- `src/ia.js`: provedor de texto (OpenAI por padrão, Claude com `IA_PROVEDOR=anthropic`).
- `templates/*.js`: estilos visuais. Cada um exporta `info` (nome, descricao, imagens, fontes, direcao_imagem, formato_texto, diagrama), `css()` e `slide()`. Peças comuns em `templates/_comum.js`. Um arquivo novo aparece sozinho no painel.
- `modelos/*.json`: estruturas de texto (papel, instrução e fundo de cada slide).
- `clientes/<id>/`: kit do cliente (base de conhecimento, voz, exemplos, assets). **Fica fora do Git**, exceto `clientes/_modelo/`.
- `saida/`: carrosséis gerados (fora do Git).

## Regras
- O repositório é público: nunca versionar `clientes/<id>/`, `.env` ou `saida/`.
- A IA nunca inventa números, depoimentos, preços ou prints de prova social; usa marcadores `[ENTRE COLCHETES]`.
- Imagens: sempre ligadas ao texto do slide (direção de arte única + cena de cada slide), sem texto dentro da imagem.
- Textos da interface e mensagens de commit em português.
- Antes de subir mudanças: testar gerando um carrossel no modo demonstração e conferir os PNGs.
