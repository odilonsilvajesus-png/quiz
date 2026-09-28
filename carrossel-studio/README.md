# Carrossel Studio

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
Lista todos os clientes. Clique em **+ Cadastrar cliente** para criar um novo (nome, Instagram, nicho, modelo padrão e cores principais).

### Painel de cada cliente
Cada cliente tem o próprio endereço (ex.: `http://localhost:3333/#/c/camila`) e cinco abas:

| Aba | Para quê |
|---|---|
| **Conteúdo** | Ranking das referências que mais engajaram. Escolha o modelo e o tema e clique em **Gerar carrossel**. **Aprovar como exemplo** ensina a IA com os carrosséis bons. |
| **Perfil e referências** | Nome, Instagram e nicho do cliente. Perfis do Instagram e canais do YouTube de referência (cole o @ ou o link). **Salvar e coletar** já busca os posts. |
| **Voz e direcionamento** | **1. Tom de voz coletado pelo sistema** a partir das legendas do Instagram do cliente (editável). **2. Informações e direcionamento**: o que você levantou sobre o cliente; a IA segue com prioridade. **3. Temas e regras**: temas, CTA da legenda, proibir travessão. |
| **Modelos de carrossel** | Biblioteca de estruturas (Quebra de crença, Lista de dicas, Mito x Verdade, Storytelling, Passo a passo, Erros comuns, e o modelo próprio do cliente quando existe). Escolha o padrão e veja a prévia. |
| **Identidade visual** | **Estilo do carrossel** (Clássico, Editorial, Tweet, Cinematográfico, Dividido), **imagens com IA** (nenhuma, só capa ou todos os slides, com estilo das imagens), paleta de 6 cores (com paletas prontas), fonte, assinatura, logo e textos. Prévia ao vivo antes de salvar. |

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
