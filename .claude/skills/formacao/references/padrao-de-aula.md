# Padrão de escrita dos módulos e aulas

Leia este arquivo antes de escrever o primeiro módulo (etapa 4 da skill).

## Sumário

1. Estrutura do arquivo de um módulo (esqueleto completo)
2. Como escrever uma aula de conteúdo
3. Exercícios, tarefa, entregável e autoavaliação
4. Guia (README), glossário e modelos
5. Links: só fontes verificadas
6. Estilo de texto
7. Checklist de qualidade de cada módulo

---

## 1. Estrutura do arquivo de um módulo

Cada módulo é um arquivo `modulo-NN-slug.md`. O gerador do site transforma **cada título `## `** em uma página (aula) e usa a primeira linha `# ` como título do módulo. Siga este esqueleto:

````markdown
# Módulo N: [Título]

**Semanas X e Y · cerca de Z horas**

## Objetivos de aprendizagem

[1 parágrafo: por que este módulo importa e onde ele se encaixa na formação]

Ao final deste módulo você será capaz de:
1. [verbo de ação observável]
2. ...

### Como estudar este módulo
```mermaid
flowchart LR
    ... (sequência aulas → exercícios → tarefa → entregável → autoavaliação)
```
*Figura: [o que o esquema mostra].*

[tabela de distribuição do tempo por semana, quando o módulo tiver mais de 1 semana]

---

## Aula N.1: [Título]
(conteúdo, ver seção 2)

## Aula N.2: [Título]
...

---

## Exercícios
### Exercício 1: [nome] (tempo)
...

---

## Tarefa de campo
...

---

## Entregável: [nome]
...

---

## Autoavaliação
...
<details>
<summary><strong>Gabarito</strong></summary>
...
</details>

---

## Para aprofundar (opcional)
| Material | Formato | Por que vale |
````

Regras do gerador que você precisa respeitar:
- A **linha em negrito** logo abaixo do título (`**Semanas 1 e 2 · cerca de 18 horas**`) vira a carga horária mostrada no site. Mantenha-a sozinha na linha.
- Todo `## ` vira uma página. Use `### ` e `#### ` para subtítulos dentro de uma aula.
- Para um módulo estudado em duas partes, use `# PARTE A: [nome]` e `# PARTE B: [nome]` antes das respectivas aulas; o site prefixa as aulas com "Parte A ·".
- Links entre arquivos da formação (`[modelo de relatório](templates/relatorio.md)`) viram links internos no site.

## 2. Como escrever uma aula de conteúdo

Uma aula de conteúdo tem, tipicamente, **800 a 1.500 palavras**. Aulas sobre conceitos centrais podem passar disso; aulas de apoio podem ser menores. O critério é: **a pessoa consegue aprender aquilo só com esta aula, sem precisar procurar em outro lugar?**

Estrutura recomendada:

1. **Abertura (2 a 4 frases):** por que este assunto importa, conectado a uma situação real do público.
2. **Explicação em partes**, com `### ` para cada ideia, sempre nesta ordem: conceito em linguagem simples → exemplo concreto → (quando ajudar) tabela ou esquema.
3. **Pelo menos um exemplo completo** do mundo do público-alvo, com nomes, números e situação realista (ex.: "a Padaria Pão da Vila, com 6 funcionários...").
4. **Erros comuns ou cuidados**, quando houver.
5. **Esquema visual** quando houver um mecanismo, fluxo, comparação, hierarquia ou sequência que o texto sozinho não mostra bem (ver `esquemas-mermaid.md`). Em média, 1 a 2 esquemas por aula de conteúdo; nenhum esquema decorativo.
6. **Quadro "Em resumo"** no fim:
   ```markdown
   > 📌 **Em resumo**
   > - [3 a 4 frases curtas com o essencial]
   ```
7. **"Para ir além"**: de 1 a 3 links verificados para fontes oficiais, cursos gratuitos ou vídeos (ver seção 5). Se não houver fonte boa e verificada, omita a seção.

Recursos de formatação que o site renderiza bem:
- Tabelas (comparações, critérios, antes × depois).
- Blocos de código para prompts, fórmulas, modelos de texto e código (o site coloca botão "Copiar").
- Citações (`>`) para dicas, alertas e destaques; use um emoji no início para o tipo (💡 dica, ⚠️ cuidado, 🎯 ideia-chave, ⚖️ aviso legal).
- Checklists (`- [ ]`): no site viram caixas que a pessoa marca, e o estado fica salvo.
- `<details><summary>` para resoluções e gabaritos escondidos. Deixe uma linha em branco depois do `<summary>` para o Markdown interno funcionar.

## 3. Exercícios, tarefa, entregável e autoavaliação

**Exercícios (4 a 6 por módulo):** cada um com título, tempo estimado, objetivo, passo a passo numerado e "o que observar" ou "resultado esperado". Em pelo menos 1 ou 2 por módulo, inclua uma **resolução comentada** dentro de `<details>`, para a pessoa conferir depois de tentar.

**Tarefa de campo:** aplicação no mundo real (em uma empresa, projeto pessoal, cliente, contexto que a pessoa informou). Diga exatamente o que fazer, com quem e o que registrar.

**Entregável:** o produto concreto do módulo, que vai para o portfólio. Tenha requisitos objetivos e um checklist de qualidade (`- [ ]`).

**Autoavaliação:** de 8 a 12 perguntas que exigem entender, não decorar (inclua perguntas de aplicação: "uma empresa tem X; o que você recomendaria?"). Gabarito em `<details>`, com respostas completas e não só "a letra certa". Meta indicada: 80% de acerto para avançar.

## 4. Guia (README), glossário e modelos

**README.md (guia da formação):** objetivo; como a formação funciona (o ciclo ler → fazer → aplicar → entregar → verificar); o que há em cada aula; carga horária; o que é preciso antes de começar; mapa da formação (tabela com fases, semanas e módulos); modelos prontos; **cronograma semana a semana em checklist** (`- [ ]`); marcos de verificação por fase; rotina de atualização (quando o tema muda rápido).

**glossario.md:** termos em ordem alfabética, agrupados em blocos (A a D, E a L...), em tabela com "Termo | O que significa | Onde estudar (módulo e aula)". Escreva por último, quando todas as aulas existirem.

**templates/*.md:** cada modelo começa com `# Nome do modelo` e traz campos para preencher (`___`), tabelas e checklists. No site, cada modelo ganha o botão "Copiar modelo em texto".

## 5. Links: só fontes verificadas

Links inventados destroem a confiança na formação. Regras:
- **Nunca escreva um endereço de memória sem verificar.** Antes de usar, teste com `curl` (ou rode `scripts/check_links.py` no fim de cada módulo).
- Prefira **fontes oficiais e estáveis**: documentação oficial, leis em sites do governo, instituições reconhecidas, cursos gratuitos de universidades e plataformas conhecidas.
- **Vídeos:** só cite vídeos cujo título você confirmou pelo oEmbed do YouTube (o script faz isso). Nunca cite o ID de um vídeo de memória sem confirmar.
- Quando um link **redireciona**, use o endereço final, exceto quando o destino for uma página de login ou uma versão datada de um endereço estável (nesses casos, mantenha o original).
- Sites que bloqueiam robôs (respondem 403/400/429) podem ser mantidos **se forem endereços oficiais conhecidos e estáveis**; diga isso à pessoa no fim.
- Indique o idioma quando não for português ("em inglês, com legendas").
- Preços, planos e versões de ferramentas mudam: ensine os critérios e mande consultar a página oficial, em vez de escrever valores que vão envelhecer.

## 6. Estilo de texto

- Escreva no idioma da pessoa, com acentuação correta, frases diretas e voz ativa.
- Explique cada termo técnico na primeira vez que aparece.
- Use exemplos do contexto da pessoa (região, setor, tamanho de empresa, realidade de quem estuda).
- Prefira tabelas a listas longas quando houver comparação.
- Não use enchimento ("é importante notar que...", "neste mundo cada vez mais..."). Cada parágrafo precisa ensinar algo.
- Seja honesto sobre limites, riscos e o que exige um profissional habilitado (jurídico, saúde, finanças).

## 7. Checklist de qualidade de cada módulo

Antes de passar para o próximo módulo, confira:
- [ ] Objetivos com verbos de ação observáveis.
- [ ] Cada aula de conteúdo ensina sozinha, com exemplo concreto e "Em resumo".
- [ ] Esquemas só onde mostram um mecanismo, fluxo ou comparação; todos com legenda.
- [ ] Exercícios com passo a passo; pelo menos 1 com resolução comentada.
- [ ] Tarefa de campo aplicada ao contexto real da pessoa.
- [ ] Entregável concreto com checklist de qualidade.
- [ ] Autoavaliação de 8 a 12 perguntas, com gabarito completo.
- [ ] Todos os links verificados.
- [ ] Nenhum fato duvidoso apresentado como certo; preços e versões remetem à fonte oficial.
