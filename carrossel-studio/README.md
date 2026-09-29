# Viraliza Studio

_Antes chamado Carrossel Studio._

Sistema que:

1. **Coleta** os posts e vídeos de perfis do Instagram e canais do YouTube que você usa como referência.
2. **Ranqueia** o que engajou acima do normal de cada perfil (outlier score).
3. **Escreve** um carrossel original na voz do seu cliente, com o GPT (ou o Claude), usando a base de conhecimento dele.
4. **Renderiza** os slides em PNG 1080×1350 com a identidade visual do cliente.

Funciona para qualquer cliente: tudo que muda de um para outro fica na pasta `clientes/<id>/`.

---

## Instalação (uma vez)

Pré-requisitos: [Node.js 20+](https://nodejs.org) e Google Chrome instalado.

```bash
cd carrossel-studio
npm install
cp .env.example .env     # depois preencha as chaves
npm run painel           # abre em http://localhost:3333
```

Sem as chaves, tudo roda em **modo demonstração**: referências fictícias e os carrosséis já aprovados do cliente, para você validar o visual.

### Chaves de API (arquivo `.env`)

O modelo padrão é o `gpt-5.5`. Para trocar, defina `OPENAI_MODEL` no `.env`. Para usar o Claude no lugar do GPT, preencha `ANTHROPIC_API_KEY` e `IA_PROVEDOR=anthropic`.

| Chave | Para quê | Onde pegar | Custo |
|---|---|---|---|
| `OPENAI_API_KEY` | Escrever a copy (GPT) | platform.openai.com → API keys | por uso, centavos por carrossel |
| `YOUTUBE_API_KEY` | Vídeos e métricas do YouTube | Google Cloud → ativar "YouTube Data API v3" → Credenciais → Chave de API | gratuito dentro da cota diária |
| `APIFY_TOKEN` | Posts e métricas do Instagram | apify.com → Settings → Integrations | por uso, ~US$ 2 a 5 por mil posts |

---

## Uso no dia a dia

Rode `npm run painel` e abra **http://localhost:3333**. Tudo é feito pelo painel.

### Página inicial: clientes
Menu lateral com todos os clientes e o botão **Novo cliente**. Os cartões mostram referências, rascunhos e postados de cada um.

### Painel de cada cliente
Cada cliente tem o próprio endereço (ex.: `http://localhost:3333/#/c/camila`) e seis abas:

| Aba | Para quê |
|---|---|
| **Criar** | **Das referências:** ideias que mais engajaram, com o conteúdo real (fala transcrita dos reels e texto lido dos carrosséis). Filtros por plataforma, formato e perfil de referência, seleção de várias ideias para criar em lote e **Limpar seleção**. **Sugestões da IA:** pautas criadas a partir do conhecimento do próprio cliente. |
| **Carrosséis** | Separado em **Rascunhos**, **Agendados**, **Postados** e **Descartados**. Em cada rascunho: **Postar no Instagram** (agora ou agendado), **Editar**, **Baixar** (ZIP), **Aprovar como exemplo** e **Descartar**. |
| **Perfil e referências** | Dados do cliente, referências (Instagram e YouTube) e a **conexão para postar direto no Instagram**. |
| **Voz e direcionamento** | Tom de voz coletado das legendas, direcionamento manual e temas/regras. |
| **Modelos** | Estruturas de texto, com prévia. |
| **Identidade visual** | Estilo, imagens com IA, cores, fontes, foto e logo, com prévia ao vivo. |

### Conteúdo real das referências (não só a legenda)
Com `OPENAI_API_KEY`, os posts mais bem ranqueados de cada coleta são analisados: a **fala dos reels é transcrita** e o **texto de cada slide dos carrosséis é lido** pela IA. A cópia do carrossel se baseia nesse conteúdo real, com a legenda só como apoio. Posts que repetem a mesma legenda deixam de ser tratados como iguais. O botão com o olho, em cada ideia, mostra a transcrição, os slides e a legenda.
O mesmo vale para o **tom de voz**: a coleta analisa a fala dos reels, os carrosséis e as legendas da própria cliente.

### Documentos do cliente
Em **Voz e direcionamento → Documentos do cliente**, suba briefing, apresentação do método, pesquisa de público, roteiros etc. Aceita **PDF, Word (.docx), TXT e MD**. O texto é extraído e entra no contexto da IA em todos os carrosséis e sugestões. PDFs escaneados (só imagem) não têm texto para extrair.

### Mapa da marca
Em **Identidade visual → Mapa da marca**, suba o mapa/guia da marca (imagem ou PDF). A IA lê as cores (e os códigos, quando estão escritos) e a fonte, mostra as cores encontradas e a paleta sugerida, e **Aplicar ao visual** preenche a paleta e a fonte na prévia. Confirme em **Salvar identidade visual**. As diretrizes escritas no mapa viram um documento do cliente automaticamente.

### Imagens: regras, observações e a foto da própria pessoa
- **Regras obrigatórias** (Identidade visual): o que a IA nunca pode mostrar, por exemplo "público evangélico, nunca usar cruz". Valem para todas as imagens do cliente.
- **Observação para as imagens** (na janela de criar): vale só para aquele carrossel.
- **Fotos da pessoa** (Identidade visual): envie fotos nítidas do cliente. Ao criar, escolha uma foto e a IA coloca a própria pessoa nas cenas, mudando roupa, cenário e pose e mantendo o rosto.

### Agendar publicação
Na janela **Postar no Instagram**, escolha data e hora e clique em **Agendar publicação**. O carrossel vai para **Agendados** e o Viraliza publica sozinho no horário. **O painel (`npm run painel`) precisa estar aberto no computador nesse horário.** Se algo falhar, o motivo aparece no carrossel e dá para postar agora ou reagendar.

### Postar direto no Instagram
1. O Instagram do cliente precisa ser conta **Profissional** (Business ou Criador).
2. Em developers.facebook.com, crie um app do tipo "Empresa", adicione o produto **Instagram** e gere o **token** da conta do cliente (com permissão para publicar conteúdo). Copie também o **ID da conta**.
3. Na aba **Perfil e referências**, cole o ID e o token e clique em **Salvar e testar conexão**.
4. No `.env`, preencha `IMGBB_API_KEY` (grátis em api.imgbb.com). O Instagram só publica imagens com link público, então os slides sobem para o ImgBB por 1 dia antes de irem para o Instagram.

Depois disso, **Postar no Instagram** publica o carrossel com a legenda (editável na hora) e ele vai para **Postados**, com o link do post.
Sem conexão, dá para baixar os slides, postar pelo celular e clicar em **Já postei, marcar como postado**.

### Dashboard e foto do perfil
- **Dashboard** (menu lateral): carrosséis criados, postados, agendados e rascunhos do mês, nota média do revisor, gasto com IA e custo médio por carrossel; gráficos por dia dos últimos 30 dias; tabela por cliente; estruturas mais usadas; próximos agendamentos e descartes recentes.
- **Foto do perfil:** o painel puxa sozinho a foto do Instagram de cada cliente (pela conexão do Instagram, grátis, ou pelo Apify) e mostra no menu, nos cartões e no topo do cliente, com o número de seguidores. Em **Perfil e referências** há o botão **Atualizar foto**.

### Escrita viral e revisor
- **Estruturas:** Ensino, Narrativa, Sequência, Contraponto e Identificação. No modelo **Automático**, a IA escolhe a estrutura pelo tipo do conteúdo (com o modelo barato do `LEITURA_MODELO`).
- **Capa só com a headline** (4 a 12 palavras) e **3 capas alternativas** em cada carrossel: em **Outras capas**, "Usar esta capa" troca sem gastar IA.
- **Slide 2** funciona sozinho como capa. Limite de palavras por slide, dor específica, nada inventado, sem promessa de resultado.
- **CTA pelo objetivo** (Alcance, Autoridade, Lead, Conversão), escolhido na hora de criar. Palavra-chave, entrega e próximo passo ficam em **Voz e direcionamento → Temas, regras e chamada para ação**.
- **Revisor** sempre ligado: dá nota de 0 a 10 para gancho, clareza, tom de voz, estrutura e CTA, e aponta bloqueios. Abaixo de 7 no gancho ou 7,5 de média, o carrossel é reescrito uma vez com os ajustes. A nota aparece no carrossel.

### Quanto custa cada carrossel
Cada carrossel mostra **quanto custou** em reais (texto + imagens com IA). No topo do cliente e na página inicial aparece o **gasto do mês**; clicando, abre o detalhe por tipo (carrosséis, coletas, tom de voz, sugestões, mapa da marca).
O cálculo usa o consumo que a OpenAI, o Claude e o Apify informam em cada chamada, o dólar PTAX do Banco Central e o IOF de 3,5% do cartão internacional (ajustável no `.env` com `COTACAO_DOLAR` e `IOF_PERCENTUAL`). É uma estimativa: a fatura oficial continua nos painéis de cada serviço.

### Descartar ensina a IA
Ao descartar, o sistema pede o motivo (ex.: "fora do tom", "imagem não combina"). Os motivos recentes entram no prompt dos próximos carrosséis para a IA não repetir os mesmos erros. Carrosséis descartados podem ser restaurados.

Os arquivos saem em `saida/<cliente>/carrosseis/<data>-<tema>/`: `slide-01.png` …, `legenda.txt`, `carrossel.json` (editável) e `carrossel.html`.

### Pela linha de comando (opcional)
```bash
npm run coletar -- camila
npm run gerar -- camila --top 3 --modelo lista-de-dicas
npm run renderizar -- saida/camila/carrosseis/<pasta>/carrossel.json   # depois de editar o texto à mão
```

### Imagens com IA (gpt-image-2)
As imagens são geradas sozinhas, a partir do conteúdo, sem ninguém escrever prompt:
1. Junto com o texto, a IA define uma **direção de arte** para o carrossel inteiro (a mesma personagem, ambiente, luz e clima), tirada do tema e do público do cliente.
2. Para cada slide, ela descreve a **cena que aquele texto descreve** (se o slide fala de comer escondida à noite, a imagem mostra isso).
3. O `gpt-image-2` gera cada imagem com a cena e a direção de arte, em 4:5, sem texto e nas cores da marca.

No modo **automático** (padrão), Clássico, Editorial e Tweet ganham imagem na capa, e Cinematográfico e Dividido, em todos os slides. A direção de arte e a cena de cada imagem aparecem em cada carrossel gerado.
Precisa de `OPENAI_API_KEY`. Cada imagem tem custo; qualidade e modelo mudam no `.env` (`IMAGEM_QUALIDADE`, `IMAGEM_MODELO`).

### Editar um carrossel gerado
Em cada carrossel da aba **Conteúdo**, o botão **Editar** abre os textos de cada slide e permite trocar ou remover a imagem de um slide (por exemplo, subir um print real de comentário ou resultado). **Salvar e renderizar** gera os PNGs de novo.
Prints de prova social devem ser sempre reais: a IA nunca inventa depoimentos ou resultados.

### Estilos com formato próprio
Alguns estilos pedem um jeito de escrever diferente, e a IA recebe essas regras automaticamente:
- **Minimalista de texto:** destaque em negrito (não em cor), capa em caixa alta, sem imagens.
- **Parábola ilustrada:** história frase a frase, falas entre aspas em faixa de papel, frase de virada em faixa escura. As imagens mantêm a mesma personagem: a primeira é gerada e serve de referência para as outras.
- **Ensaio quadriculado:** títulos "Passo 1:" viram rótulo manuscrito e, quando o slide ensina uma sequência, o sistema desenha um diagrama de etapas a partir do texto.
- **Papelaria editorial:** o fundo de cada slide é uma mesa com objetos ligados ao tema daquele slide.

### Criar um estilo visual novo
Copie um arquivo de `templates/` (ex.: `editorial.js`), mude `info` (nome e descrição), o CSS e o HTML do slide.
Ele aparece sozinho na aba **Identidade visual**.

### Criar um modelo de carrossel novo
Copie um arquivo de `modelos/` (ex.: `lista-de-dicas.json`) e mude `id`, `nome`, `descricao` e a `estrutura`.
Cada slide tem `papel`, `instrucao` (o que a IA deve escrever) e `fundo` (`escuro`, `claro` ou `destaque`).
Ele aparece sozinho na aba **Modelos de carrossel** de todos os clientes.

## Como funciona o ranking

Comparar curtidas entre perfis favorece quem é grande. Por isso cada post é comparado **com a mediana do próprio perfil**:

- interações = curtidas + 2 × comentários (comentário vale mais, porque exige esforço)
- outlier = interações do post ÷ mediana do perfil (no YouTube, média disso com as views)

Um post com **3x** performou três vezes acima do normal daquele perfil, mesmo que o perfil seja pequeno.

## Cuidados

- A coleta do Instagram via Apify raspa dados públicos, o que é zona cinzenta nos Termos da Meta. Use para análise e inspiração.
- A IA usa a referência só como inspiração de ângulo. O texto final é original, na voz do cliente, e ela é instruída a nunca copiar frases.
- Sempre revise antes de publicar, principalmente em nichos de saúde.

---

## Dados dos clientes ficam fora do Git

Este repositório é público. Por isso o `.gitignore` deixa de fora tudo em `clientes/`, exceto `clientes/_modelo/`.
Guarde as pastas dos clientes (base de conhecimento, exemplos, logos) em um lugar privado, como Google Drive ou um repositório privado,
e copie para `clientes/<id>/` na máquina onde o sistema roda.
