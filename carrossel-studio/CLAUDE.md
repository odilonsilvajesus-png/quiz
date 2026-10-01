# Viraliza Studio (pasta carrossel-studio): guia para o Claude

Sistema que coleta referências do Instagram/YouTube, escreve carrosséis na voz de cada cliente com IA
e renderiza os slides em PNG com a identidade visual do cliente. Quem usa não é programador: explique
passos em português simples e dê comandos prontos para copiar.

## Rodar
- `npm install` e `npm run painel` → http://localhost:3333 (painel web, é por onde tudo é usado).
- Chaves no `.env` (modelo em `.env.example`): `OPENAI_API_KEY` (texto e imagens), `APIFY_TOKEN`, `YOUTUBE_API_KEY`, `IMGBB_API_KEY`. O ID e o token do Instagram de cada cliente ficam no `cliente.json` dele (fora do Git).
- Sem chaves tudo roda em modo demonstração.
- Render usa o Google Chrome instalado (playwright-core, `channel: "chrome"`) ou `CHROMIUM_PATH`.

## Estrutura
- `src/servidor.js`: servidor HTTP do painel e rotas `/api/...`.
- `painel/index.html`: painel inteiro (HTML + JS puro, rotas por hash `#/c/<cliente>/<aba>`).
- `src/cliente.js`: leitura/gravação do kit do cliente (`clientes/<id>/cliente.json`), paleta → fundos, normalização de formatos antigos.
- `src/carrosseis.js`: estados do carrossel (rascunho, agendado, postado, descartado com motivo); o agendador roda no `servidor.js` a cada minuto e aprendizados para o prompt.
- `src/analise.js`: conteúdo real dos posts (transcrição da fala dos reels e leitura do texto dos slides), usado nas referências e no tom de voz.
- `src/copy.js`: escrita do carrossel. `regrasVirais` (capa só com headline, slide 2 como segundo gancho, texto no tamanho da estrutura Z4 sem limite fixo de palavras, travas) e `regrasCta` (CTA pelo objetivo: alcance, autoridade, lead, conversão) valem para todos os clientes. Regras de um cliente específico (fé, marca pessoal) ficam nos documentos dele, nunca aqui.
- `src/revisor.js`: revisor sempre ligado; notas de 0 a 10 e bloqueios. Abaixo de 7 no gancho, fluxo ou conexão, ou 7,5 de média, o pipeline reescreve uma vez.
- `src/perfil.js`: foto do perfil do Instagram do cliente (API oficial se conectado, senão Apify), buscada sozinha em segundo plano no máximo uma vez por dia; fica em `clientes/<id>/assets/perfil.jpg`.
- `src/dashboard.js`: números do dashboard (`#/dashboard`): produção, publicação, nota do revisor e gasto do mês e dos últimos 30 dias.
- `src/custos.js`: custo de cada operação (texto, imagens, transcrição, Apify) em dólar e reais; `registrarUso` em cada chamada paga, `comMedicao` em volta de cada operação. Preços por modelo na tabela `PRECOS`: atualizar quando mudar o modelo ou o preço.
- `src/tarefas.js`: tarefas demoradas (coleta, tom de voz) em segundo plano; o painel consulta o andamento.
- `src/sugestoes.js`: pautas sugeridas pela IA a partir do conhecimento do cliente.
- `src/documentos.js`: documentos do cliente (PDF, DOCX, TXT, MD) → texto que entra no prompt da copy e das sugestões.
- `src/marca.js`: leitura do mapa da marca (imagem ou PDF) com IA → paleta, fonte e diretrizes.
- `src/publicar.js`: publicação no Instagram (Graph API) com imagens hospedadas no ImgBB.
- `src/pipeline.js`: referência → copy (`src/copy.js`) → imagens (`src/imagens.js`) → PNGs (`src/render.js`).
- `src/ia.js`: provedor de texto (OpenAI por padrão, Claude com `IA_PROVEDOR=anthropic`).
- `templates/*.js`: estilos visuais. Cada um exporta `info` (nome, descricao, imagens, fontes, direcao_imagem, formato_texto, diagrama), `css()` e `slide()`. Peças comuns em `templates/_comum.js`. Um arquivo novo aparece sozinho no painel.
- `modelos/*.json`: biblioteca de modelos de carrossel (papel, instrução e fundo de cada slide). A Metodologia Viraliza (`metodologia.json`: dor que a pessoa já sente, caminho atual que não dá resultado, por que não dá, novo caminho, valor dele, solução na prática, podemos ajudar) é o padrão e a primeira da lista; o fio dela só entra no prompt quando ela é o modelo escolhido. "Automático" escolhe entre os modelos com `viral: true`. Em todos os modelos, nunca "no nosso método" (o revisor reprova).
- `clientes/<id>/`: kit do cliente (base de conhecimento, voz, exemplos, assets). **Fica fora do Git**, exceto `clientes/_modelo/`.
- `saida/`: carrosséis gerados (fora do Git).

## Regras
- O repositório é público: nunca versionar `clientes/<id>/`, `.env` ou `saida/`.
- A IA nunca inventa números, depoimentos, preços ou prints de prova social; usa marcadores `[ENTRE COLCHETES]`.
- Imagens: sempre ligadas ao texto do slide (direção de arte única + cena de cada slide), sem texto dentro da imagem.
- Textos da interface e mensagens de commit em português.
- Visual do painel segue `painel/marca/MAPA_DA_MARCA.md` (tokens em `:root` do `painel/index.html`, logo em `painel/marca/`). O roxo e o logo da Viraliza são só da interface: nunca aplicar nos carrosséis dos clientes.
- Antes de subir mudanças: testar gerando um carrossel no modo demonstração e conferir os PNGs.
