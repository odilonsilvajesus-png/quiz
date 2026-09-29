# Como instalar o Clone Studio no seu computador (VS Code + Claude)

Guia passo a passo para Windows e Mac. Leva uns 15 minutos.

> **Duas coisas diferentes, duas contas diferentes:**
> - **Claude no VS Code** (o assistente que te ajuda a mexer no código) usa a sua **conta do Claude** (Pro, Max, Team ou Enterprise, ou uma conta do Claude Console). A chave do GPT **não** funciona aqui.
> - **A plataforma Clone Studio** (o site que gera os vídeos) usa as **chaves de API** que você coloca no arquivo `.env` — é aí que entra a sua **chave do GPT**.

---

## 1. Instale os programas básicos

| Programa | Para quê | Onde baixar |
|---|---|---|
| **Node.js 22 (LTS)** | roda a plataforma | https://nodejs.org → botão "LTS" |
| **Git** | baixa o código do GitHub | https://git-scm.com/downloads |
| **VS Code** (1.94 ou mais novo) | editor | https://code.visualstudio.com |

Instale os três com as opções padrão. Depois **reinicie o computador** (no Windows isso garante que o `node` e o `git` fiquem disponíveis no terminal).

O FFmpeg (que edita os vídeos) **não precisa instalar**: ele vem junto com a plataforma.

## 2. Instale o Claude no VS Code

1. Abra o VS Code.
2. Aperte `Ctrl+Shift+X` (Windows) ou `Cmd+Shift+X` (Mac) para abrir as **Extensões**.
3. Pesquise **Claude Code** (da Anthropic) e clique em **Install**.
4. Abra qualquer arquivo e clique no ícone ✻ (faísca) no canto superior direito do editor — ou no ícone ✻ na barra da esquerda.
5. Clique em **Sign in** e faça login com a sua conta do Claude no navegador.

## 3. Baixe o projeto

No VS Code, abra o terminal: menu **Terminal → New Terminal**. Cole os comandos abaixo, um de cada vez:

```bash
git clone https://github.com/odilonsilvajesus-png/quiz.git
cd quiz
git checkout claude/stoic-keller-otye8r
cd clone-studio
npm install
```

> O `git checkout` é necessário porque a plataforma ainda está no branch `claude/stoic-keller-otye8r` (não foi juntada ao `main`).

Depois abra a pasta no VS Code: **File → Open Folder…** → escolha a pasta `quiz/clone-studio`.

## 4. Coloque a sua chave do GPT

1. Pegue sua chave em https://platform.openai.com/api-keys (**Create new secret key**). Ela começa com `sk-`.
   A API da OpenAI é cobrada à parte da assinatura do ChatGPT: coloque créditos em https://platform.openai.com/settings/organization/billing.
2. Crie o arquivo de configuração copiando o modelo:
   - **Windows:** `copy .env.example .env`
   - **Mac:** `cp .env.example .env`
3. Abra o `.env` no VS Code e preencha:

```ini
OPENAI_API_KEY=sk-sua-chave-aqui
```

Salve (`Ctrl+S`). **Nunca** envie o `.env` para o GitHub nem mostre a chave para ninguém — o projeto já ignora esse arquivo no git.

### O que a chave do GPT libera

| Função | Só com a chave do GPT |
|---|---|
| 🎬 **Editar vídeo gravado**: transcrição, legendas, tirar pausas e vícios | ✅ funciona |
| 🎬 **Cortes escolhidos por IA** (título e gancho de cada corte) | ✅ funciona |
| Modelos de edição (tela dividida, podcast…), trilha, marca d'água | ✅ funciona (não precisa de chave) |
| 🤖 **Clone 100% IA com a sua voz** | ❌ precisa da **ElevenLabs** (voz) e da **HeyGen** (avatar) — a OpenAI não clona voz nem cria avatar |

Quando quiser o clone com a sua voz, é só acrescentar no mesmo `.env`:

```ini
ELEVENLABS_API_KEY=...
HEYGEN_API_KEY=...
```

## 5. Rode a plataforma

No terminal do VS Code, dentro da pasta `clone-studio`:

```bash
npm run dev
```

Abra no navegador: **http://localhost:5173**

No topo aparece em que modo cada parte está. Para parar, clique no terminal e aperte `Ctrl+C`.

Nas próximas vezes, basta abrir a pasta no VS Code e rodar `npm run dev` de novo.

## 6. Use o Claude para mexer no projeto

Com a pasta `clone-studio` aberta, clique no ícone ✻ e peça em português, por exemplo:

- "Muda a cor padrão das legendas para verde"
- "Cria um modelo de edição novo com a tela dividida em três partes"
- "Deu esse erro no terminal: (cole o erro). Resolve pra mim"

O Claude mostra as alterações antes de aplicar; você aceita ou recusa cada uma.

---

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `node` ou `git` "não é reconhecido" | Reinicie o computador depois de instalar; confira com `node -v` e `git --version`. |
| `npm install` falha no Windows com erro de permissão | Feche o VS Code, abra de novo e rode dentro da pasta `clone-studio`. |
| "Não foi possível conectar à API" na página | O terminal com `npm run dev` precisa estar aberto e sem erro. |
| Erro `401 Incorrect API key` num vídeo | A chave no `.env` está errada ou sem créditos. Corrija, reinicie o `npm run dev` e clique em **Tentar de novo** no vídeo. |
| Erro de modelo (`model_not_found`) ao gerar cortes | Sua conta não tem o modelo padrão. No `.env`, troque `OPENAI_MODEL=` por um modelo que apareça em https://platform.openai.com/docs/models e reinicie. |
| Porta ocupada | Feche outro `npm run dev` aberto, ou mude `PORT=` no `.env`. |
