# Carrossel Studio

Sistema que:

1. **Coleta** os posts e vídeos de perfis do Instagram e canais do YouTube que você usa como referência.
2. **Ranqueia** o que engajou acima do normal de cada perfil (outlier score).
3. **Escreve** um carrossel original na voz do seu cliente, com o Claude, usando a base de conhecimento dele.
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

| Chave | Para quê | Onde pegar | Custo |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Escrever a copy | console.anthropic.com → API Keys | por uso, centavos por carrossel |
| `YOUTUBE_API_KEY` | Vídeos e métricas do YouTube | Google Cloud → ativar "YouTube Data API v3" → Credenciais → Chave de API | gratuito dentro da cota diária |
| `APIFY_TOKEN` | Posts e métricas do Instagram | apify.com → Settings → Integrations | por uso, ~US$ 2 a 5 por mil posts |

---

## Uso no dia a dia

### Pelo painel (`npm run painel`)
1. Escolha o cliente no topo.
2. À esquerda aparecem as referências ranqueadas. O número em laranja é quantas vezes o post performou acima da média do próprio perfil.
3. Escolha o ângulo (ou deixe a IA escolher) e clique em **Gerar carrossel**.
4. À direita aparecem os slides prontos para baixar, com a legenda e as pendências (marcadores `[ENTRE COLCHETES]` que alguém precisa preencher).

### Pela linha de comando
```bash
npm run coletar -- camila                     # coleta e mostra o ranking
npm run gerar -- camila --top 3               # gera carrosséis das 3 melhores referências
npm run gerar -- camila --ref 5 --angulo "Nome do ângulo"
npm run renderizar -- saida/camila/carrosseis/<pasta>/carrossel.json   # depois de editar o texto à mão
```

Os arquivos saem em `saida/<cliente>/carrosseis/<data>-<angulo>/`:
`slide-01.png` … `slide-07.png`, `legenda.txt`, `carrossel.json` (editável) e `carrossel.html`.

**Ajustar um texto sem gastar IA:** edite o `carrossel.json` e rode `npm run renderizar` apontando para ele.

---

## Cadastrar um cliente novo (~10 minutos)

```bash
npm run novo-cliente -- maria-nutri "Maria Silva"
```

Isso cria `clientes/maria-nutri/` a partir do modelo. Preencha:

| Arquivo | O que colocar |
|---|---|
| `base-conhecimento.md` | Quem é, método, persona, produtos, regras. É o contexto que a IA lê antes de escrever. |
| `exemplos.json` | 2 ou 3 carrosséis reais e aprovados. Ensinam tom, ritmo e tamanho do texto. |
| `cliente.json` → `referencias` | @ do Instagram e canais do YouTube de referência. |
| `cliente.json` → `conteudo.estrutura` | Papel de cada slide e qual fundo usar. A quantidade de itens define quantos slides o carrossel tem. |
| `cliente.json` → `conteudo.angulos` | (Opcional) lista de temas ou ângulos do cliente. A IA escolhe um por carrossel. |
| `cliente.json` → `visual` | Fonte, cores dos fundos, logo, assinatura, texto do CTA final. |
| `assets/` | Logo e foto de capa (caminhos usados em `visual.logo` e `visual.foto_capa`). |

**Voz automática:** preencha `"instagram"` no `cliente.json` e rode `npm run gerar-voz -- maria-nutri`. O sistema lê as legendas do cliente e cria o `voz.md`. Revise antes de usar.

**Fonte diferente:** troque `visual.fonte` (ex.: `"Montserrat"`) e instale com `npm install @fontsource/montserrat`.

**Visual diferente:** o template `templates/classico.js` serve para a maioria dos clientes só trocando as cores. Para um layout novo, copie o arquivo com outro nome e aponte `visual.template` para ele.

---

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
