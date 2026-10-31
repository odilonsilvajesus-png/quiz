---
name: formacao
description: Cria formações completas de estudo (cursos práticos com módulos, aulas, esquemas visuais, exercícios, tarefas práticas, entregáveis, autoavaliações com gabarito, glossário e modelos) sobre qualquer tema, e entrega como um site navegável publicado em um link. Pergunta o tema e o objetivo, monta o sumário, pede confirmação e só então escreve tudo. Use sempre que a pessoa pedir para criar um curso, formação, trilha de estudos, plano de estudos completo, material didático, apostila, programa de capacitação ou treinamento sobre um assunto, ou disser coisas como "quero aprender X de verdade", "monte uma formação sobre Y", "crie um curso para eu estudar Z", "preciso virar especialista em W", mesmo que não fale em "site" ou "skill". Também vale para pedidos em inglês, como "create a course / curriculum / study program / learning path about X".
---

# Formação

Esta skill transforma um tema em uma **formação de verdade**: o tipo de material com que alguém consegue sair do zero e chegar a fazer algo concreto, com um site navegável para estudar aula por aula.

O que guia todas as decisões é o **aprendizado real**. O número de módulos, de aulas e de semanas é consequência do que a pessoa precisa aprender para atingir o objetivo dela, nunca uma meta fixa.

## O fluxo (5 etapas)

```
1. Entender o tema e o objetivo  →  2. Montar o sumário  →  3. Pedir confirmação
→  4. Escrever a formação  →  5. Gerar, verificar e publicar o site (entregar o link)
```

Não pule a confirmação (etapa 3). Escrever uma formação inteira leva muito trabalho; um sumário errado desperdiça tudo isso.

---

## Etapa 1: Entender o tema e o objetivo

Se a pessoa ainda não disse o tema, pergunte. Depois, numa única rodada de perguntas (use uma ferramenta de perguntas com opções se a sessão tiver uma, como `AskUserQuestion`; senão, pergunte em texto), descubra o mínimo para desenhar bem:

1. **Tema** (texto livre, se ainda não foi dito).
2. **Objetivo final:** o que a pessoa quer conseguir **fazer** no fim (trabalhar com isso, aplicar no próprio negócio, ensinar, passar em uma prova, mudar de carreira...).
3. **Nível atual:** do zero, já tem noções, já trabalha com o tema.
4. **Tempo disponível:** horas por semana (ex.: até 5h, 5 a 10h, mais de 10h).
5. **Contexto de aplicação:** onde ela vai praticar (empresa própria, emprego, clientes, projeto pessoal). É isso que torna as tarefas práticas reais.

Se a conversa já respondeu a alguma dessas perguntas, não pergunte de novo. Se a pessoa não quiser responder, siga com escolhas razoáveis e diga quais foram.

## Etapa 2: Montar o sumário

Leia `references/desenho-pedagogico.md` e siga o método de desenho reverso:

1. Defina de 3 a 6 **competências finais** com verbos de ação observáveis.
2. Derive os conhecimentos e habilidades de cada competência.
3. Agrupe em **módulos** (cada um termina em um entregável) e ordene por dependência.
4. Agrupe em **fases**, cada uma com um marco de verificação.
5. Acrescente o que o objetivo pedir: **trilhas contínuas**, **projeto final integrador**, **glossário** e **modelos prontos**.
6. Estime a carga horária (cerca de 30% leitura, 70% prática) e o número de semanas pelo tempo informado.

Se o tema muda rápido (tecnologia, leis, mercado), pesquise o estado atual antes de fechar o sumário, se a sessão tiver busca na web.

## Etapa 3: Pedir confirmação

Mostre o sumário **na conversa**, no formato da seção 7 de `references/desenho-pedagogico.md`: para quem, competências, duração, fases com marcos, módulos com aulas e entregáveis, trilhas, projeto final e materiais de apoio.

Depois pergunte diretamente se a pessoa aprova ou quer acrescentar, retirar ou reordenar algo. Ajuste e mostre de novo até ela aprovar. Só então comece a etapa 4.

## Etapa 4: Escrever a formação

Leia `references/padrao-de-aula.md` (estrutura dos arquivos e das aulas) e `references/esquemas-mermaid.md` (esquemas visuais) antes de escrever o primeiro módulo.

**Onde salvar:** crie uma pasta `formacao-<slug-do-tema>/` no diretório de trabalho (ou no diretório de rascunho da sessão, se não houver um diretório de projeto). Estrutura:

```
formacao-<slug>/
├── curso.json              # configuração do site (modelo em assets/curso.exemplo.json)
├── README.md               # guia da formação + cronograma em checklist
├── modulo-01-<slug>.md     # um arquivo por módulo, na ordem de estudo
├── modulo-02-<slug>.md
├── ...
├── trilha-<slug>.md        # se houver trilha contínua
├── projeto-final.md
├── glossario.md            # escrito por último
├── templates/              # modelos prontos, se houver
└── site/index.html         # gerado pelo script
```

**Ordem de trabalho:**
1. `curso.json` e `README.md` (com o sumário aprovado).
2. Os módulos, **um de cada vez, na ordem de estudo**. Cada módulo completo antes do próximo: aulas, exercícios, tarefa, entregável e autoavaliação. Ao terminar cada módulo, confira o checklist de qualidade (seção 7 de `padrao-de-aula.md`).
3. Trilhas, projeto final e modelos.
4. Glossário, por último.

**Profundidade:** cada aula de conteúdo deve ensinar sozinha (tipicamente 800 a 1.500 palavras), com explicação, exemplo concreto do contexto da pessoa, esquema quando houver um mecanismo a mostrar, "Em resumo" e links verificados. É isso que diferencia uma formação de um resumo.

**Formações longas:** publique o site ao fim de cada fase (etapa 5), avisando a pessoa, para que ela já possa começar a estudar enquanto o restante é escrito. Republique sempre o mesmo arquivo para manter o mesmo link.

**Links:** nunca escreva endereços de memória sem verificar. Rode `python3 scripts/check_links.py formacao-<slug>` ao fim de cada módulo (ou teste os links com curl antes de usar) e corrija o que estiver quebrado ou redirecionando.

## Etapa 5: Gerar, verificar e publicar o site

Os scripts ficam na pasta desta skill (`scripts/`). Rode-os a partir de qualquer diretório, passando o caminho da formação:

```bash
python3 <pasta-da-skill>/scripts/build_site.py formacao-<slug>        # gera site/index.html
python3 <pasta-da-skill>/scripts/check_site.py formacao-<slug>/site/index.html   # confere esquemas e links internos
python3 <pasta-da-skill>/scripts/check_links.py formacao-<slug>       # confere links externos
```

- `build_site.py` lê o `curso.json`, transforma cada `## ` dos módulos em uma página e embute tudo em um único `index.html` (menu lateral por fases, progresso salvo no navegador, checklists marcáveis, anotações por aula, busca, gabaritos escondidos, botão de copiar em códigos e modelos, temas claro e escuro, funciona no celular).
- `check_site.py` precisa de Node.js com Playwright; se não houver, ele avisa e você revisa os esquemas pelas regras de `esquemas-mermaid.md`.
- Corrija todo problema apontado e gere de novo.

**Publicar:** se a sessão tiver uma ferramenta de publicação de páginas (como a ferramenta `Artifact`), publique `formacao-<slug>/site/index.html` com ela, seguindo as regras da própria ferramenta (algumas pedem uma chamada inicial antes de criar uma página nova). O arquivo já atende aos requisitos comuns dessas ferramentas: tem `<title>`, cores para os temas claro e escuro, layout para celular e carrega bibliotecas só de `cdn.jsdelivr.net`. Para atualizar, republique o mesmo arquivo, e o link continua o mesmo.

Se não houver ferramenta de publicação, entregue o arquivo `index.html` (ele funciona sozinho, aberto direto no navegador) e explique como abri-lo.

Se o diretório for um repositório git e a pessoa trabalha com ele, faça commit da pasta da formação.

## Mensagem final

Entregue, de forma curta:
- **O link do site** (ou o arquivo).
- O que a formação tem: número de módulos, aulas, esquemas, horas e semanas.
- Como estudar: por onde começar, como marcar aulas como estudadas, que o progresso fica salvo **no navegador** usado.
- Limites honestos: links que não puderam ser testados (sites que bloqueiam robôs), assuntos que exigem atualização periódica ou um profissional habilitado.
- Uma oferta de próximo passo (aprofundar um módulo, criar quizzes, slides).

## Arquivos desta skill

| Arquivo | Quando ler ou usar |
|---|---|
| `references/desenho-pedagogico.md` | Etapa 2: desenhar o sumário e apresentá-lo para aprovação |
| `references/padrao-de-aula.md` | Etapa 4: estrutura dos arquivos, das aulas, exercícios, autoavaliações, links e estilo |
| `references/esquemas-mermaid.md` | Etapa 4: quando e como desenhar esquemas sem quebrar o site |
| `assets/curso.exemplo.json` | Modelo do `curso.json` |
| `assets/template.html` | Layout do site (usado pelo `build_site.py`; não precisa editar) |
| `scripts/build_site.py` | Gera o site |
| `scripts/check_site.py` | Confere esquemas e links internos no navegador |
| `scripts/check_links.py` | Confere links externos e títulos de vídeos |
