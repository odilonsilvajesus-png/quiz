# Módulo 2: Seu ambiente de trabalho profissional

**Semanas 3 e 4 · cerca de 22 horas**

## Objetivos de aprendizagem

Programadores seniores não são mais rápidos porque digitam mais rápido. São mais rápidos porque têm um ambiente em que **errar é barato**: tudo versionado, tudo reversível, tudo organizado. Neste módulo você monta esse ambiente: terminal, Git, GitHub e Claude Code, e aprende a ler o código que o Claude escreve. No fim, o repositório do Gestor está criado, com as regras do projeto escritas para o Claude seguir.

Ao final deste módulo você será capaz de:
1. Navegar e executar comandos no terminal sem medo.
2. Versionar código com Git: commits, branches, desfazer mudanças.
3. Trabalhar com GitHub: repositórios, pull requests e revisão.
4. Usar o Claude Code: modos de permissão, modo de planejamento, comandos e o arquivo CLAUDE.md.
5. Ler código TypeScript e entender o que ele faz, mesmo sem escrevê-lo do zero.
6. Organizar um projeto com estrutura de pastas profissional.

### Como estudar este módulo
```mermaid
flowchart LR
    A["Aulas 2.1 a 2.3<br/>terminal, Git, GitHub"] --> I["Instalar o ambiente"]
    I --> B["Aulas 2.4 a 2.6<br/>Claude Code, TypeScript,<br/>estrutura"]
    B --> T["Tarefa: repositório<br/>do Gestor"]
    T --> AV["Autoavaliação"]
```
*Figura: a sequência do módulo. Primeiro as ferramentas de base, depois o Claude Code e o projeto.*

| Semana | O que fazer | Horas |
|---|---|---|
| 3 | Aulas 2.1 a 2.3, exercícios 1 a 3, instalação | 11 |
| 4 | Aulas 2.4 a 2.6, exercícios 4 e 5, tarefa, entregável, autoavaliação | 11 |

---

## Aula 2.1: Terminal sem medo

O terminal é aquela janela preta onde se digitam comandos. Muita gente o evita, mas ele é o painel de controle de tudo o que você vai fazer: rodar o sistema, instalar bibliotecas, conversar com o Claude Code, acessar servidores. A boa notícia: você precisa de uns 15 comandos para 90% do trabalho.

### O que é o terminal

O terminal é um programa em que você conversa com o computador por texto em vez de clicar. Cada linha que você digita é um **comando**; o computador executa e mostra o resultado.

| Sistema | Qual usar |
|---|---|
| Windows | **PowerShell** ou, melhor ainda, o **WSL** (um Linux dentro do Windows). Para esta formação, recomendamos o WSL com Ubuntu, porque os servidores onde seus sistemas vão rodar são Linux. |
| macOS | O app **Terminal** (ou o iTerm2) |
| Linux | O terminal do sistema |

### Onde você está: o diretório atual

O terminal sempre está "dentro" de uma pasta, o **diretório atual**. Os comandos agem sobre ela.

| Comando | O que faz | Exemplo |
|---|---|---|
| `pwd` | Mostra onde você está | `/home/ana/projetos` |
| `ls` | Lista o que tem na pasta (`ls -la` mostra também arquivos ocultos) | `ls -la` |
| `cd pasta` | Entra em uma pasta | `cd gestor` |
| `cd ..` | Volta uma pasta | |
| `cd ~` | Vai para a sua pasta pessoal | |
| `mkdir nome` | Cria uma pasta | `mkdir projetos` |
| `cat arquivo` | Mostra o conteúdo de um arquivo | `cat package.json` |
| `cp origem destino` | Copia | `cp .env.example .env` |
| `mv origem destino` | Move ou renomeia | |
| `rm arquivo` | Apaga (**sem lixeira!**) | |

> ⚠️ **O comando que destrói computadores:** `rm -rf` apaga pastas inteiras, sem confirmação e sem lixeira. Nunca rode `rm -rf` com um caminho que você não leu duas vezes. Se o Claude sugerir um `rm -rf`, leia o caminho com atenção antes de aprovar. Na Aula 2.4 você vai configurar o Claude Code para sempre pedir sua permissão nesses casos.

### Comandos que você vai usar todo dia

| Comando | Para quê |
|---|---|
| `node -v` / `npm -v` | Ver se o Node.js (o motor que roda JavaScript no servidor) está instalado |
| `npm install` | Instalar as bibliotecas que o projeto usa |
| `npm run dev` | Rodar o sistema no seu computador |
| `npm test` | Rodar os testes automatizados |
| `git status` | Ver o que mudou no projeto (Aula 2.2) |
| `claude` | Abrir o Claude Code na pasta atual (Aula 2.4) |
| `ssh usuario@servidor` | Entrar em um servidor remoto (Módulo 12) |

### Atalhos que economizam horas

- **Tab** completa nomes de pastas e arquivos. Digite `cd ges` e aperte Tab.
- **Seta para cima** traz o comando anterior.
- **Ctrl + C** interrompe um programa rodando (por exemplo, para parar o `npm run dev`).
- **Ctrl + L** ou `clear` limpa a tela.

### Lendo mensagens de erro (a habilidade que mais importa)

Iniciantes veem um erro vermelho e entram em pânico. Seniores **leem** o erro. Quase toda mensagem de erro diz exatamente o que aconteceu, em inglês. Exemplo:

```text
Error: Cannot find module 'zod'
Require stack:
- /home/ana/gestor/src/lib/validacao.ts
```

Tradução: "não encontrei a biblioteca 'zod', que o arquivo `validacao.ts` pediu". Solução provável: `npm install zod`. Mesmo quando você não entender, **copie a mensagem inteira** e cole para o Claude. Nunca escreva "deu erro". Escreva "deu este erro: [mensagem completa]".

### Exemplo completo: preparando a máquina

Roteiro para deixar seu computador pronto (faça na tarefa desta semana):

```bash
# 1. (Só Windows) Instalar o WSL com Ubuntu, no PowerShell como administrador
wsl --install

# 2. Instalar o Node.js na versão LTS (de suporte longo). Recomendado: via nvm,
#    que permite trocar de versão. Siga as instruções do site oficial do nvm.
node -v   # deve mostrar v22 ou superior

# 3. Instalar o Git
git --version

# 4. Criar a pasta de projetos
mkdir -p ~/projetos && cd ~/projetos
```

> 💡 **Use o Claude para aprender o terminal.** Quando não souber um comando, pergunte: *"no terminal do Ubuntu, como eu listo os arquivos maiores que 100 MB desta pasta? Explique cada parte do comando"*. A parte "explique cada parte" é o que transforma uma resposta em aprendizado.

> 📌 **Em resumo**
> - O terminal é o painel de controle; uns 15 comandos cobrem quase tudo.
> - No Windows, use o WSL com Ubuntu, porque seus servidores serão Linux.
> - `rm -rf` não tem volta; leia o caminho duas vezes.
> - Leia as mensagens de erro e cole-as inteiras para o Claude.

### Para ir além
- [Configuração inicial de servidor Ubuntu (DigitalOcean, em inglês)](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu): você vai usar no Módulo 12, mas já ajuda a praticar o terminal.

---

## Aula 2.2: Git: a máquina do tempo do seu código

Imagine que o Claude fez 40 alterações no seu sistema, uma delas quebrou o login, e você não sabe qual. Sem Git, você está perdido. Com Git, você volta para a versão de ontem em 10 segundos. Git é a ferramenta que torna **seguro** deixar uma IA mexer no seu código.

### O que é Git

Git é um sistema de **controle de versões**: ele guarda fotografias do seu projeto ao longo do tempo. Cada fotografia se chama **commit** e tem uma mensagem dizendo o que mudou.

```mermaid
flowchart LR
    C1["commit 1<br/>estrutura inicial"] --> C2["commit 2<br/>cadastro de clientes"]
    C2 --> C3["commit 3<br/>validação do CPF"]
    C3 --> C4["commit 4<br/>quebrou o login ❌"]
    C4 -.->|"git revert"| C3
```
*Figura: o histórico de commits. Quando um commit quebra algo, você desfaz exatamente aquele, sem perder o resto.*

### As três áreas

O Git trabalha com três "lugares":

| Área | O que é | Comando que leva para lá |
|---|---|---|
| **Pasta de trabalho** | Os arquivos como estão agora, com suas mudanças | (você ou o Claude editam) |
| **Área de preparação** (staging) | As mudanças que vão entrar no próximo commit | `git add arquivo` |
| **Histórico** | Os commits salvos | `git commit -m "mensagem"` |

### Os comandos essenciais

```bash
git init                    # transforma a pasta em um repositório Git
git status                  # o que mudou? (use o tempo todo)
git diff                    # mostra exatamente as linhas alteradas
git add .                   # prepara todas as mudanças
git commit -m "feat: cadastro de clientes"   # salva a fotografia
git log --oneline           # lista os commits
git restore arquivo.ts      # descarta mudanças não salvas de um arquivo
git revert abc123           # cria um commit que desfaz o commit abc123
```

> 🎯 **O hábito mais importante desta formação:** antes de pedir qualquer coisa grande ao Claude, faça um commit. Se o resultado não ficar bom, você volta. É um botão de "desfazer" ilimitado.

### Branches: linhas paralelas de trabalho

Uma **branch** (ramo) é uma linha de trabalho separada. A branch principal, `main`, deve conter **sempre** código que funciona. Novas funcionalidades nascem em branches próprias:

```bash
git switch -c feat/funil-de-vendas    # cria e entra na branch
# ... trabalha, faz commits ...
git switch main                       # volta para a principal
git merge feat/funil-de-vendas        # junta o trabalho na main
```

Por que isso importa: se o funil de vendas ficar pela metade, a `main` continua funcionando e você pode corrigir um bug urgente do cliente nela, sem misturar com o trabalho incompleto.

### Mensagens de commit que contam uma história

Daqui a seis meses, quando o cliente pedir uma manutenção (Módulo 16), o histórico de commits vai ser a sua memória. Use o padrão **Conventional Commits**:

| Prefixo | Quando | Exemplo |
|---|---|---|
| `feat:` | Funcionalidade nova | `feat: exportar clientes para CSV` |
| `fix:` | Correção de bug | `fix: saldo negativo exibido como positivo` |
| `refactor:` | Reorganização sem mudar comportamento | `refactor: separa cálculo de juros em função própria` |
| `test:` | Testes | `test: casos de vencimento em fim de semana` |
| `docs:` | Documentação | `docs: instruções de deploy` |
| `chore:` | Manutenção geral | `chore: atualiza dependências` |

### O `.gitignore`: o que nunca entra no Git

O arquivo `.gitignore` lista o que o Git deve ignorar. Ele é sua **primeira linha de defesa contra vazamento de segredos**:

```text
# dependências (são reinstaladas com npm install)
node_modules/

# segredos
.env
.env.local
.env.*.local

# arquivos gerados
.next/
dist/
coverage/

# dados
*.sql
*.dump
backups/
```

> ⚠️ **Se um segredo foi para o GitHub, considere-o vazado.** Apagar o arquivo depois não resolve: ele continua no histórico. Há robôs que varrem o GitHub procurando chaves 24 horas por dia. O procedimento correto (Módulo 14) é **trocar a chave imediatamente** no painel do serviço.

### Exemplo completo: recuperando um desastre

Você pediu ao Claude para "melhorar o layout da tela de clientes". Ele mexeu em 12 arquivos, inclusive no de autenticação, e agora ninguém consegue logar.

```bash
git status                 # mostra os 12 arquivos alterados (ainda sem commit)
git diff src/auth/         # vê o que mudou na autenticação
git restore src/auth/      # descarta só as mudanças na autenticação
npm run dev                # testa: login voltou a funcionar
git add . && git commit -m "feat: novo layout da tela de clientes"
```

Em dois minutos você manteve a parte boa e descartou a parte ruim. Sem Git, seriam horas tentando lembrar o que estava antes.

> 📌 **Em resumo**
> - Git guarda fotografias (commits) do projeto; você pode voltar a qualquer uma.
> - Faça commit antes de qualquer pedido grande ao Claude.
> - Trabalhe em branches; a `main` deve funcionar sempre.
> - O `.gitignore` impede que segredos e dados entrem no repositório.

### Para ir além
- [Livro Pro Git (gratuito, em português)](https://git-scm.com/book/pt-br/v2): leia os capítulos 1 a 3.
- [Conventional Commits (em português)](https://www.conventionalcommits.org/pt-br/v1.0.0/)

---

## Aula 2.3: GitHub: repositório remoto, pull requests e revisão

O Git guarda o histórico no seu computador. O **GitHub** guarda uma cópia na nuvem e adiciona colaboração: revisão de código, automações, controle de quem pode mexer em quê. Para você, ele cumpre três papéis: **backup** do código, **vitrine** do portfólio e **portão de qualidade** antes de qualquer mudança chegar à produção.

### Repositório local e remoto

```mermaid
flowchart LR
    L["Seu computador<br/>repositório local"] -->|"git push<br/>envia commits"| R["GitHub<br/>repositório remoto"]
    R -->|"git pull<br/>traz commits"| L
    R -->|"dispara"| CI["Testes automáticos<br/>e deploy (Módulo 12)"]
```
*Figura: o repositório local e o remoto. O push envia, o pull traz, e o GitHub pode disparar testes e deploys a cada envio.*

```bash
git remote add origin https://github.com/seu-usuario/gestor.git
git push -u origin main      # primeira vez
git push                     # nas próximas
git pull                     # trazer mudanças feitas em outro lugar
```

### Pull request: a mudança passa pela revisão

Um **pull request** (PR) é um pedido: "quero juntar a branch `feat/funil` na `main`; aqui está o que mudou". No GitHub, o PR mostra todas as linhas alteradas, permite comentários linha a linha e roda os testes automáticos.

Mesmo trabalhando sozinho, use PRs. Motivos:
1. **Você revisa o que o Claude fez antes de aceitar.** A tela do PR é o melhor lugar para ler mudanças.
2. **Os testes rodam sozinhos** (Módulo 12) e bloqueiam a mudança se algo quebrar.
3. **O histórico fica documentado**: cada PR explica por que a mudança foi feita.

O fluxo de trabalho padrão desta formação:

```mermaid
flowchart LR
    B["Cria branch"] --> C["Claude implementa<br/>com commits pequenos"]
    C --> P["Abre pull request"]
    P --> T{"Testes passaram?<br/>Revisão ok?"}
    T -->|"Não"| C
    T -->|"Sim"| M["Merge na main"]
    M --> D["Deploy"]
```
*Figura: o fluxo de uma mudança. Nada entra na main sem passar por testes e revisão.*

### Protegendo a branch principal

Nas configurações do repositório (**Settings → Branches → Branch protection rules** ou **Rulesets**), proteja a `main`:
- Exigir pull request para alterar (ninguém faz push direto).
- Exigir que os testes passem antes do merge.
- Impedir que a branch seja apagada ou reescrita.

Isso protege você de você mesmo, numa sexta-feira às 23h.

### Segurança da sua conta GitHub

Seu GitHub vai guardar o código de sistemas de clientes. Se alguém invadir a sua conta, pode inserir código malicioso que vai direto para produção. Por isso:

- [ ] Ative a **autenticação em dois fatores** (2FA), de preferência com app autenticador ou chave física, não SMS.
- [ ] Repositórios de clientes são **privados**.
- [ ] Ative os alertas do **Dependabot** (avisos de bibliotecas com falhas de segurança) e o **secret scanning** (detecção de chaves vazadas), disponíveis nas configurações de segurança do repositório.
- [ ] Ao dar acesso a um cliente ou colaborador, dê o mínimo necessário (leitura, se possível).

### Exemplo completo: a primeira mudança revisada

1. `git switch -c feat/readme`
2. Peça ao Claude: *"escreva um README.md para este projeto com: o que é, como instalar, como rodar"*.
3. Leia o arquivo gerado. Corrija o que estiver errado.
4. `git add README.md && git commit -m "docs: README inicial"`
5. `git push -u origin feat/readme`
6. No GitHub, clique em **Compare & pull request**. Escreva no PR: o que mudou e por quê.
7. Na aba **Files changed**, leia linha a linha. Comente algo, só para praticar.
8. Clique em **Merge pull request**. Depois, no terminal: `git switch main && git pull`.

> 📌 **Em resumo**
> - GitHub é backup, portfólio e portão de qualidade.
> - Toda mudança passa por pull request, mesmo trabalhando sozinho.
> - Proteja a branch `main` e ative 2FA, Dependabot e secret scanning.
> - Repositórios de clientes são sempre privados.

### Para ir além
- [Documentação do GitHub em português](https://docs.github.com/pt/get-started/start-your-journey/hello-world)
- [Sobre o secret scanning (GitHub, em português)](https://docs.github.com/pt/code-security/secret-scanning/introduction/about-secret-scanning)
- [Dependabot (GitHub, em português)](https://docs.github.com/pt/code-security/dependabot)

---

## Aula 2.4: Claude Code: o seu time de programadores

Até aqui você usava o Claude como um conselheiro que escreve código para você copiar e colar. O **Claude Code** é diferente: ele trabalha **dentro do seu projeto**. Lê os arquivos, roda comandos, executa os testes, edita o código e faz commits. É como ter um programador sentado ao seu lado. E, como com qualquer programador, **você precisa saber dirigi-lo e conferir o trabalho dele**.

### Instalação

Consulte sempre a página oficial (o link está no fim da aula), porque os métodos mudam. Na data desta formação:

```bash
# macOS, Linux e WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
winget install Anthropic.ClaudeCode
```

Depois, entre na pasta do projeto e rode `claude`. Na primeira vez, ele pede para você entrar com a sua conta.

### Como uma sessão funciona

Você escreve um pedido em linguagem natural. O Claude Code lê os arquivos que precisa, propõe ações (editar um arquivo, rodar um comando) e, dependendo do **modo de permissão**, pede sua autorização antes de cada uma.

| Ação | Como fazer |
|---|---|
| Interromper o Claude no meio | **Esc** |
| Alternar entre os modos de permissão (inclusive o modo de planejamento) | **Shift + Tab** |
| Mencionar um arquivo específico | `@src/lib/clientes.ts` |
| Limpar a conversa e começar do zero | `/clear` |
| Criar o arquivo CLAUDE.md inicial do projeto | `/init` |
| Ver e ajustar permissões | `/permissions` |
| Ver todos os comandos disponíveis | `/help` |

### Modos de permissão: quanto de liberdade dar

| Modo | O que acontece | Quando usar |
|---|---|---|
| **Padrão** | Pede permissão para editar arquivos e rodar comandos | Sempre que estiver aprendendo e em projetos de clientes |
| **Aceitar edições** | Edita arquivos sem perguntar, mas ainda pede para comandos | Quando você confia no plano e vai revisar tudo no pull request |
| **Planejamento** (plan mode) | **Só lê e propõe um plano**, sem alterar nada | No começo de toda tarefa não trivial (Módulo 3) |

> 🎯 **Regra da formação:** toda tarefa que mexe em mais de um arquivo começa no **modo de planejamento**. Você lê o plano, corrige, e só então libera a execução. Isso evita 80% dos "o Claude saiu mexendo em tudo".

> ⚠️ **Nunca rode o Claude Code com permissões totais em um computador com acesso à produção.** Se o seu terminal tem a senha do banco de dados real ou acesso ao servidor do cliente, um comando errado aprovado no automático pode apagar dados reais. Mantenha os acessos de produção fora do ambiente de desenvolvimento.

### O CLAUDE.md: as regras da casa

O **CLAUDE.md** é um arquivo na raiz do projeto que o Claude Code lê automaticamente no início de cada sessão. É onde você escreve **as regras que ele deve seguir sempre**: a stack, os comandos, os padrões de código e, principalmente, as regras de segurança.

Sem CLAUDE.md, a cada sessão o Claude "chega" sem saber nada do projeto e decide por conta própria. Com CLAUDE.md, ele trabalha do seu jeito. Um trecho do CLAUDE.md do Gestor:

```markdown
# Gestor

SaaS de CRM com financeiro, multi-empresa (multi-tenant).

## Stack
Next.js (App Router) + TypeScript estrito, PostgreSQL via Prisma, validação com Zod,
login com Better Auth, testes com Vitest e Playwright.

## Comandos
- `npm run dev`: roda local
- `npm test`: testes unitários
- `npm run lint`: verificação de estilo

## Regras inegociáveis
- Toda consulta ao banco filtra por `empresaId` da sessão. Nunca confie em empresaId vindo do frontend.
- Toda verificação de permissão acontece no servidor.
- Dinheiro é sempre inteiro em centavos (`valorCentavos`). Nunca use float.
- Todo dado de entrada é validado com Zod no servidor.
- Nunca coloque segredos no código; use variáveis de ambiente sem prefixo NEXT_PUBLIC_.
- Toda funcionalidade nova vem com teste.
- Antes de considerar uma tarefa concluída, rode `npm test` e `npm run lint`.
```

O modelo completo está em [templates/claude-md.md](templates/claude-md.md). Você vai usá-lo na tarefa deste módulo e melhorá-lo a cada módulo.

### Outras peças do Claude Code (para conhecer agora e usar depois)

- **Skills:** pacotes de instruções para tarefas específicas (por exemplo, "como fazer deploy neste projeto"). O Claude carrega quando a tarefa pede.
- **Subagentes:** assistentes especializados que o Claude pode acionar (por exemplo, um revisor de segurança).
- **Hooks:** comandos que rodam automaticamente em certos momentos (por exemplo, rodar o verificador de estilo depois de cada edição).
- **Comando `/security-review`** e revisão de código: pedem ao Claude uma revisão das mudanças pendentes. Você vai usar no Módulo 13.

Os nomes e recursos evoluem. Quando quiser saber o que existe hoje, pergunte ao próprio Claude Code: *"quais recursos do Claude Code me ajudariam a garantir que os testes sempre rodam antes de um commit?"*.

### Exemplo completo: primeira sessão no Gestor

```text
Você: (no modo de planejamento) Leia o CLAUDE.md e me diga, com suas palavras,
      quais são as 3 regras mais importantes deste projeto e por quê.

Claude: [resume as regras de empresaId, permissão no servidor e dinheiro em centavos]

Você: Ótimo. Agora proponha a estrutura de pastas inicial para um projeto Next.js
      seguindo essas regras. Não crie nada ainda, só o plano.

Claude: [propõe a estrutura]

Você: Ajuste: quero uma pasta src/server separada para tudo que só roda no servidor.
      Pode executar.
```

Repare: você **verificou que ele entendeu as regras** antes de deixá-lo trabalhar. Faça isso no início de todo projeto.

> 📌 **Em resumo**
> - O Claude Code trabalha dentro do projeto: lê, roda comandos, edita e testa.
> - Comece toda tarefa não trivial no modo de planejamento (Shift + Tab).
> - O CLAUDE.md contém as regras que o Claude segue em toda sessão; as regras de segurança ficam nele.
> - Mantenha acessos de produção longe do ambiente onde o Claude trabalha.

### Para ir além
- [Visão geral do Claude Code (documentação oficial, em inglês)](https://code.claude.com/docs/en/overview)
- [Guia rápido de instalação (em inglês)](https://code.claude.com/docs/en/quickstart)
- [Como o Claude Code usa o CLAUDE.md (memória, em inglês)](https://code.claude.com/docs/en/memory)

---

## Aula 2.5: Ler código TypeScript sem ser programador

Você não precisa escrever código do zero. Mas precisa **ler** o código que o Claude escreve, o suficiente para perceber quando algo está errado. É como um engenheiro civil que não assenta tijolos, mas sabe quando uma parede está torta. Esta aula te dá esse olhar.

### Por que TypeScript

**TypeScript** é JavaScript com **tipos**: você declara que tipo de valor cada coisa guarda (texto, número, data), e o computador avisa antes de rodar quando algo não bate. Para quem trabalha com IA, isso é ouro: muitos erros do Claude são pegos automaticamente pelo verificador de tipos, antes de chegarem ao cliente.

### Os sete blocos que formam quase todo código

#### 1. Variáveis: caixas com nome
```typescript
const nomeEmpresa = "Padaria Pão da Vila";   // const: não muda
let tentativas = 0;                          // let: pode mudar
```

#### 2. Tipos: o que cabe em cada caixa
```typescript
const valorCentavos: number = 15050;          // R$ 150,50
const ativo: boolean = true;
const vencimento: Date = new Date("2026-11-10");
```

#### 3. Objetos e tipos de objeto: fichas com campos
```typescript
type Cliente = {
  id: string;
  nome: string;
  email: string | null;     // pode ser texto ou vazio
  empresaId: string;        // a qual empresa (tenant) pertence
};
```

#### 4. Funções: receitas que recebem ingredientes e devolvem um resultado
```typescript
function calcularMulta(valorCentavos: number, diasAtraso: number): number {
  const multa = Math.round(valorCentavos * 0.02);              // 2% de multa
  const juros = Math.round(valorCentavos * 0.00033 * diasAtraso); // ~1% ao mês
  return valorCentavos + multa + juros;
}
```

#### 5. Condições: decisões
```typescript
if (usuario.papel !== "dono") {
  throw new Error("Sem permissão");   // interrompe com erro
}
```

#### 6. Listas e repetições
```typescript
const vencidas = cobrancas.filter((c) => c.vencimento < hoje && !c.paga);
const totalCentavos = vencidas.reduce((soma, c) => soma + c.valorCentavos, 0);
```
Lê-se: "das cobranças, pegue as que venceram e não foram pagas; depois some os valores".

#### 7. Código assíncrono: esperar algo de fora
```typescript
const cliente = await db.cliente.findFirst({ where: { id, empresaId } });
```
`await` significa "espere a resposta do banco antes de seguir". Quase toda conversa com banco de dados e APIs externas usa `async`/`await`.

### O olhar de revisor: o que procurar

Ao ler código do Claude, você não precisa entender cada vírgula. Procure **sinais**:

| Sinal | O que pode indicar | Exemplo |
|---|---|---|
| Consulta ao banco **sem** `empresaId` | Vazamento entre empresas | `db.cliente.findMany()` sem `where` |
| `any` | Tipo desligado; o verificador não protege mais | `function salvar(dados: any)` |
| Números com ponto para dinheiro | Erro de arredondamento | `const total = 10.5 * 3` |
| `catch` vazio | Erro engolido; problema silencioso | `catch (e) {}` |
| Texto do usuário montando SQL | Injeção de SQL (Módulo 13) | `` `SELECT * FROM clientes WHERE nome = '${nome}'` `` |
| Segredo escrito no código | Vazamento | `const apiKey = "sk_live_..."` |
| `console.log` com dados pessoais | Dados sensíveis nos logs | `console.log(usuario)` |
| `// TODO` em código de segurança | Proteção esquecida | `// TODO: verificar permissão` |

### Exemplo completo: revisando uma função do Claude

O Claude escreveu esta função para o Gestor:

```typescript
export async function buscarCliente(id: string) {
  const cliente = await db.cliente.findUnique({ where: { id } });
  return cliente;
}
```

Com o olhar de revisor: a consulta busca o cliente **só pelo id**, sem `empresaId`. Se um usuário da Empresa A descobrir o id de um cliente da Empresa B (ids aparecem nos endereços das páginas), ele vê o cliente da outra empresa. Isso tem nome: **IDOR** (referência direta insegura a objeto), uma das falhas mais comuns em SaaS (Módulo 13).

O pedido de correção ao Claude:

```text
A função buscarCliente não filtra por empresaId, o que permite que uma empresa
veja clientes de outra. Corrija recebendo o empresaId da sessão do usuário
(nunca do frontend), use findFirst com where { id, empresaId }, e escreva um
teste que prove que um usuário da empresa A recebe "não encontrado" ao buscar
um cliente da empresa B.
```

Você não escreveu nenhuma linha de código, mas encontrou uma falha grave e pediu uma correção precisa, com teste. **Isso é trabalho de sênior.**

> 💡 **Peça explicações sempre.** *"Explique esta função como se eu fosse um gerente que precisa aprovar o código: o que ela faz, o que pode dar errado e como você protegeu contra isso."*

> 📌 **Em resumo**
> - TypeScript adiciona tipos ao JavaScript e pega muitos erros da IA automaticamente.
> - Sete blocos formam quase todo código: variáveis, tipos, objetos, funções, condições, listas, assíncrono.
> - Revise procurando sinais: consulta sem `empresaId`, `any`, dinheiro com ponto, `catch` vazio, segredo no código.
> - Seu papel é ler, questionar e pedir correções precisas com teste.

### Para ir além
- [TypeScript em 5 minutos (documentação oficial, em inglês)](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

---

## Aula 2.6: Estrutura de projeto profissional

Quando um projeto cresce sem organização, cada arquivo novo vai para "onde der". Seis meses depois, nem você nem o Claude acham nada, e uma correção simples quebra três coisas. Uma estrutura clara é o que permite fazer manutenção com segurança, inclusive quando o cliente pedir uma mudança daqui a um ano.

### Princípio: separar por responsabilidade

Cada pasta tem **um tipo de responsabilidade**. A pergunta "onde fica isto?" deve ter uma resposta óbvia.

```text
gestor/
├── CLAUDE.md              # regras para o Claude
├── README.md              # como instalar e rodar
├── .env.example           # lista das variáveis necessárias, SEM valores reais
├── .gitignore
├── package.json           # dependências e comandos
├── prisma/
│   ├── schema.prisma      # modelo do banco de dados (Módulo 5)
│   └── migrations/        # histórico de mudanças no banco
├── docs/
│   ├── especificacao.md   # o que o sistema faz (Módulo 4)
│   └── decisoes/          # ADRs, registros de decisões (Módulo 6)
├── src/
│   ├── app/               # telas e rotas (Next.js)
│   ├── components/        # peças de interface reutilizáveis
│   ├── server/            # SÓ roda no servidor
│   │   ├── db.ts          # conexão com o banco
│   │   ├── auth/          # login e sessão
│   │   ├── clientes/      # regras de negócio de clientes
│   │   └── financeiro/    # regras de negócio do financeiro
│   └── lib/               # utilitários gerais (formatar moeda, datas)
└── tests/
    └── e2e/               # testes de ponta a ponta (Playwright)
```

### As camadas dentro do backend

Dentro de `src/server`, cada assunto (clientes, financeiro) segue a mesma organização em camadas:

```mermaid
flowchart TB
    R["Rota / ação<br/>recebe o pedido, confere sessão"] --> V["Validação<br/>os dados têm o formato certo?"]
    V --> S["Serviço<br/>regras de negócio"]
    S --> D["Acesso a dados<br/>consultas ao banco, sempre com empresaId"]
    D --> DB[("Banco")]
```
*Figura: as camadas do backend. Cada camada tem uma única responsabilidade, o que facilita testar e revisar.*

| Camada | Responsabilidade | Não deve |
|---|---|---|
| Rota/ação | Receber o pedido, identificar o usuário, devolver a resposta | Conter regras de negócio |
| Validação | Garantir que os dados têm o formato certo | Consultar o banco |
| Serviço | Aplicar as regras ("cliente inadimplente não pode receber novo orçamento") | Saber de HTTP ou telas |
| Acesso a dados | Ler e gravar no banco | Decidir regras |

Por que isso importa para você: quando o cliente pedir "mude a regra de multa", você sabe que a mudança fica em um só lugar (o serviço do financeiro), e os testes daquele serviço mostram se algo quebrou.

### O `.env.example`

Este arquivo **vai** para o Git e lista as variáveis necessárias, sem os valores:

```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/gestor"
BETTER_AUTH_SECRET="gere-um-valor-aleatorio-longo"
ASAAS_API_KEY=""
ASAAS_WEBHOOK_TOKEN=""
```

Quem for rodar o projeto (você daqui a um ano, outro desenvolvedor, o Claude em uma sessão nova) sabe exatamente o que configurar.

### Padrões de nome

Combine no CLAUDE.md e mantenha:
- Código em inglês ou em português? **Escolha um e mantenha.** Nesta formação, o domínio do negócio fica em português (`cliente`, `cobranca`, `valorCentavos`), porque reflete a linguagem do cliente, e termos técnicos em inglês (`createdAt`, `id`).
- Arquivos em `kebab-case` (`contas-a-receber.ts`); tipos em `PascalCase` (`ContaAReceber`); variáveis e funções em `camelCase` (`calcularMulta`).

### Exemplo completo: criando o esqueleto do Gestor

Na tarefa deste módulo, você vai pedir ao Claude:

```text
(modo de planejamento)
Crie o esqueleto de um projeto Next.js com TypeScript estrito chamado gestor,
seguindo exatamente a estrutura de pastas abaixo e as regras do CLAUDE.md.
[cole a estrutura]
Inclua: .gitignore (com .env, node_modules, .next), .env.example sem valores reais,
README com instruções, e um teste de exemplo que passe com Vitest.
Mostre o plano primeiro. Não instale bibliotecas além de Next.js, TypeScript, Vitest e Zod.
```

Depois de executar, confira com seus próprios olhos:
- `cat .gitignore` contém `.env`?
- `git status` não mostra nenhum arquivo `.env`?
- `npm test` passa?
- `npm run dev` abre a página inicial?

> 📌 **Em resumo**
> - Cada pasta tem uma responsabilidade; "onde fica isto?" deve ter resposta óbvia.
> - O backend é dividido em rota, validação, serviço e acesso a dados.
> - O `.env.example` documenta as variáveis sem expor valores.
> - Combine padrões de nome no CLAUDE.md e confira o resultado com os próprios olhos.

### Para ir além
- [Documentação do Next.js (em inglês)](https://nextjs.org/docs)
- [Curso gratuito oficial do Next.js (em inglês)](https://nextjs.org/learn)

---

## Exercícios

### Exercício 1: Caça ao tesouro no terminal (40 min)
**Objetivo:** praticar navegação.
1. Crie a estrutura `~/treino/a/b/c` com um único comando (`mkdir -p`).
2. Crie um arquivo `segredo.txt` em `c` com o texto "achei" (`echo "achei" > segredo.txt`).
3. Volte para `~` e, sem usar `cd`, mostre o conteúdo do arquivo com `cat` e o caminho completo.
4. Copie o arquivo para `~/treino`, renomeie a cópia para `copia.txt` e apague a pasta `a` inteira.

**Resultado esperado:** só `~/treino/copia.txt` deve sobrar. Antes do último passo, leia o comando de apagar duas vezes.

### Exercício 2: Máquina do tempo (60 min)
**Objetivo:** usar Git para desfazer erros.
1. Crie uma pasta, rode `git init` e crie um arquivo `notas.md` com 3 linhas. Faça commit.
2. Altere a linha 2 e faça commit. Adicione a linha 4 e faça commit.
3. Use `git log --oneline` para ver os 3 commits.
4. Desfaça **só** o commit da alteração da linha 2 com `git revert`.
5. Agora altere o arquivo sem fazer commit e descarte a mudança com `git restore`.

<details>
<summary><strong>Resolução comentada</strong></summary>

- No passo 4, use `git revert <id-do-commit>` com o id mostrado no `git log`. O Git cria um **novo** commit que desfaz aquele. O histórico fica com 4 commits, e a linha 4 continua lá. Essa é a forma segura de desfazer em projetos compartilhados, porque não apaga a história.
- No passo 5, `git restore notas.md` volta o arquivo ao estado do último commit. Mudanças não commitadas descartadas assim **não podem ser recuperadas**; por isso o hábito de commitar com frequência.
- Se der conflito no revert (o Git não sabe como desfazer automaticamente), ele marca o trecho no arquivo. Leia, escolha a versão certa, salve, `git add` e `git revert --continue`.
</details>

### Exercício 3: Seu primeiro pull request (45 min)
Siga o exemplo completo da Aula 2.3 no repositório da calculadora do Módulo 1: crie uma branch, peça ao Claude uma melhoria (por exemplo, botão "Copiar resultado"), abra o PR, revise as linhas na aba "Files changed" e faça o merge.

### Exercício 4: Revisor de código (60 min)
**Objetivo:** aplicar o olhar de revisor da Aula 2.5.
Encontre os 5 problemas neste código e escreva o pedido de correção para o Claude:

```typescript
const ASAAS_KEY = "aact_prod_000abc123";

export async function relatorioFinanceiro(empresaId: any) {
  try {
    const lancamentos = await db.lancamento.findMany();
    const total = lancamentos.reduce((s, l) => s + l.valor * 1.1, 0);
    console.log("relatorio", lancamentos);
    return total;
  } catch (e) {}
}
```

<details>
<summary><strong>Resolução comentada</strong></summary>

1. **Segredo no código** (`ASAAS_KEY`). Deve vir de `process.env.ASAAS_API_KEY`, e a chave atual deve ser trocada no painel do Asaas, porque se isso foi para o Git, está vazada.
2. **`empresaId: any`**: tipo desligado. Deve ser `string`, e vir da sessão do usuário.
3. **`findMany()` sem filtro**: busca os lançamentos de **todas** as empresas. Deve ter `where: { empresaId }`.
4. **Dinheiro em float** (`l.valor * 1.1`): risco de arredondamento. Use `valorCentavos` inteiro e `Math.round` em cada cálculo.
5. **`console.log` com dados financeiros** e **`catch` vazio**: dados sensíveis nos logs e erro engolido (a função devolve `undefined` em silêncio). Deve registrar o erro sem dados sensíveis e repassá-lo.

Pedido ao Claude: *"Revise relatorioFinanceiro: mova a chave para variável de ambiente, tipe empresaId como string vindo da sessão, filtre por empresaId, use valores inteiros em centavos, remova o log de dados, trate o erro registrando só a mensagem e relançando. Escreva testes para: empresa A não vê lançamentos da empresa B; total calculado corretamente em centavos."*
</details>

### Exercício 5: Instalação e primeira sessão (90 min)
Instale o Claude Code e, em uma pasta de testes, siga o exemplo completo da Aula 2.4: crie um CLAUDE.md simples, peça ao Claude para resumir as regras e verifique se ele entendeu. Teste o modo de planejamento (Shift + Tab) e o Esc para interromper.

---

## Tarefa de campo

**Crie o repositório do Gestor.**

1. Crie um repositório **privado** `gestor` no GitHub, com 2FA ativado na sua conta.
2. Copie o [modelo de CLAUDE.md](templates/claude-md.md) e adapte.
3. Siga o exemplo completo da Aula 2.6 para criar o esqueleto do projeto, em uma branch, via pull request.
4. Proteja a branch `main` (exigir pull request).
5. Ative Dependabot e secret scanning.
6. No seu diário de decisões, registre: por que o repositório é privado, por que a `main` é protegida e quais regras você colocou no CLAUDE.md.

---

## Entregável: Repositório do Gestor pronto para o trabalho

**Checklist de qualidade:**
- [ ] Repositório privado, com `main` protegida.
- [ ] 2FA ativo na conta GitHub.
- [ ] CLAUDE.md com stack, comandos e pelo menos 6 regras inegociáveis.
- [ ] Estrutura de pastas igual (ou justificadamente diferente) à da Aula 2.6.
- [ ] `.gitignore` contém `.env` e `node_modules`; nenhum `.env` no histórico (`git log --all -- .env` não mostra nada).
- [ ] `.env.example` sem valores reais.
- [ ] README explica como instalar e rodar.
- [ ] `npm test` passa e `npm run dev` abre a página.
- [ ] Pelo menos 3 commits com mensagens no padrão Conventional Commits e 1 pull request mesclado.

---

## Autoavaliação

Meta: 8 de 10.

1. Você está na pasta `~/projetos/gestor/src` e quer ir para `~/projetos`. Qual comando?
2. Por que fazer commit **antes** de pedir uma mudança grande ao Claude?
3. Qual a diferença entre `git restore` e `git revert`?
4. O Claude criou um arquivo `.env` com a senha do banco e você fez `git add .`. O que você confere antes do commit, e o que deveria ter evitado isso?
5. Uma chave do Mercado Pago foi parar no GitHub há 2 dias, e você apagou o arquivo hoje. O problema está resolvido? O que fazer?
6. Por que usar pull requests mesmo trabalhando sozinho?
7. Para que serve o modo de planejamento do Claude Code, e quando usá-lo?
8. O que deve estar no CLAUDE.md de um projeto SaaS? Cite 4 itens.
9. Leia: `db.cobranca.findMany({ where: { status: "vencida" } })`. Que problema você aponta num sistema multi-empresa?
10. O cliente pede para mudar a regra de cálculo de juros. Em qual camada do backend essa mudança deve ficar, e por quê?

<details>
<summary><strong>Gabarito</strong></summary>

1. `cd ../..` (sobe dois níveis) ou `cd ~/projetos`.
2. Porque o commit é um ponto de restauração. Se o resultado for ruim, você volta exatamente ao estado anterior sem perder nada.
3. `git restore` descarta mudanças **ainda não commitadas** em arquivos. `git revert` cria um **novo commit** que desfaz um commit antigo, preservando o histórico.
4. Rode `git status` e confira se o `.env` aparece na lista. Se aparecer, tire-o da preparação (`git restore --staged .env`) e adicione `.env` ao `.gitignore`. Um `.gitignore` correto desde o início teria evitado.
5. Não está resolvido: o arquivo continua no histórico e robôs varrem o GitHub o tempo todo. Considere a chave vazada: troque-a (revogue a antiga e gere uma nova) no painel do Mercado Pago imediatamente, atualize a variável de ambiente no servidor e verifique se houve uso indevido.
6. Porque o PR é o lugar para revisar o que o Claude mudou, os testes automáticos rodam e bloqueiam erros, e o histórico fica documentado com o motivo de cada mudança.
7. No modo de planejamento o Claude só lê e propõe um plano, sem alterar nada. Use no início de toda tarefa que mexe em mais de um arquivo, para corrigir o rumo antes de qualquer alteração.
8. Exemplos: descrição do projeto; stack; comandos (dev, test, lint); regra de filtrar toda consulta por empresaId da sessão; permissão verificada no servidor; dinheiro em centavos; validação de entrada com Zod; segredos só em variáveis de ambiente; toda funcionalidade com teste; rodar testes antes de concluir.
9. A consulta não filtra por `empresaId`, então traz as cobranças vencidas de **todas** as empresas. Deve ser `where: { status: "vencida", empresaId }`, com o empresaId vindo da sessão.
10. Na camada de **serviço** (regras de negócio) do financeiro. Assim a mudança fica em um só lugar, independente de telas e do banco, e os testes do serviço mostram se algo quebrou.
</details>

---

## Checklist de segurança do módulo

- [ ] 2FA ativado no GitHub (de preferência com app ou chave física).
- [ ] Repositórios de clientes privados.
- [ ] `.env` no `.gitignore` antes do primeiro commit.
- [ ] Dependabot e secret scanning ativos.
- [ ] Branch `main` protegida.
- [ ] Regras de segurança escritas no CLAUDE.md.
- [ ] Nenhum acesso de produção no computador onde o Claude Code trabalha com permissões amplas.

---

## Para aprofundar (opcional)

| Material | Formato | Por que vale |
|---|---|---|
| [Pro Git](https://git-scm.com/book/pt-br/v2) | Livro gratuito, em português | A referência completa de Git |
| [Boas práticas do Claude Code](https://code.claude.com/docs/en/best-practices) | Texto, em inglês | Recomendações oficiais de uso |
| [Configurações do Claude Code](https://code.claude.com/docs/en/settings) | Texto, em inglês | Permissões e ajustes finos |
