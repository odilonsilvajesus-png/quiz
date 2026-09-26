# Módulo 7: Marketing e conteúdo com IA

**Semana 17 · cerca de 9 horas**

## Objetivos de aprendizagem
1. Criar um **guia de marca para IA** (voz, público, regras) que garanta consistência.
2. Produzir conteúdo (posts, roteiros, anúncios, e-mails, SEO) com processo e qualidade.
3. Usar IA para pesquisa de público e análise de concorrentes e criativos.
4. Montar um **sistema de conteúdo** que a equipe da empresa opere sozinha.
5. Conhecer os cuidados legais e éticos (direitos autorais, imagem de pessoas, transparência).

---

## Aula 7.1: O problema do "conteúdo de IA genérico"

Conteúdo genérico acontece quando a IA não conhece **a marca, o público e o objetivo**. A solução não é "um prompt melhor": é um **guia de marca para IA** usado em todo pedido.

### Guia de marca para IA (estrutura)
```markdown
# Marca: [Nome]
## Quem somos (3 linhas)
## Público principal (persona)
- Quem é, idade, rotina, dores, desejos, objeções, palavras que usa
## Promessa / proposta de valor (1 frase)
## Tom de voz
- Somos: [ex.: próximos, bem-humorados, especialistas sem arrogância]
- Não somos: [ex.: formais, agressivos, "coach"]
- Palavras que usamos: ...
- Palavras proibidas: ...
## Exemplos de textos aprovados (3 a 5)
## Produtos/serviços e diferenciais
## Regras
- Emojis: [quantidade/estilo]
- Promessas proibidas (ex.: "resultado garantido")
- Regras do setor (ex.: publicidade médica, alimentos, financeiro)
```
Coloque esse guia num **Project/GPT/Gem** da marca. Assim, todo pedido já parte do contexto certo.

---

## Aula 7.2: Frameworks de copy que a IA executa muito bem

| Framework | Estrutura | Uso |
|---|---|---|
| **AIDA** | Atenção → Interesse → Desejo → Ação | Anúncios, posts de venda |
| **PAS** | Problema → Agitação → Solução | Anúncios diretos, e-mails |
| **Antes-Depois-Ponte** | Situação atual → situação desejada → como chegar | Serviços, transformação |
| **Gancho-História-Oferta** | Gancho forte → história curta → oferta | Reels, TikTok, vídeos |
| **4U** (para títulos) | Útil, Urgente, Único, Ultra-específico | Títulos, assuntos de e-mail |

**Prompt modelo:**
> Com base no guia de marca, crie 5 variações de anúncio para [produto] usando o framework PAS. Público: [persona]. Objetivo: [mensagens no WhatsApp]. Cada variação com gancho diferente: (1) dor, (2) curiosidade, (3) prova social, (4) número, (5) pergunta. No máximo 125 caracteres no texto principal.

---

## Aula 7.3: Processo de produção de conteúdo com IA

```
1. ESTRATÉGIA (humano + IA)  → pilares de conteúdo, objetivos, frequência
2. PAUTA (IA)                → calendário mensal a partir dos pilares e datas
3. RASCUNHO (IA)             → textos e roteiros com o guia de marca
4. VISUAL (IA + Canva)       → imagens, carrosséis, capas
5. REVISÃO (humano)          → fatos, tom, regras do setor, "cara da marca"
6. PUBLICAÇÃO (automação)    → agendamento
7. ANÁLISE (IA)              → o que performou e por quê → ajusta o passo 1
```

### Pilares de conteúdo (exemplo: academia de bairro)
1. **Educação** (40%): dicas de treino e alimentação
2. **Prova** (25%): transformações de alunos, depoimentos
3. **Bastidores** (20%): equipe, estrutura, rotina
4. **Oferta** (15%): planos, aulas experimentais, promoções

### Roteiro de vídeo curto (modelo)
```
[0–3s]  GANCHO: frase ou cena que para o scroll
[3–20s] CONTEÚDO: 3 pontos rápidos, com cortes a cada 2–3s
[20–30s] CTA: uma ação clara
Legenda na tela: sim. Duração: 20–40s.
```

---

## Aula 7.4: Pesquisa e análise com IA

- **Pesquisa de público:** "Liste as 20 principais dúvidas, medos e desejos de [persona] em relação a [produto], com as palavras que essas pessoas usam." Valide com os comentários e conversas reais da empresa.
- **Análise de concorrentes:** colete posts e anúncios públicos (Biblioteca de Anúncios da Meta) e peça: "Analise estes 10 anúncios: ganchos usados, promessas, ofertas, CTA, padrões e lacunas que podemos explorar."
- **Análise de criativo:** envie o print ou o vídeo e peça a decomposição: gancho, estrutura, gatilhos, CTA e por que funciona.
- **Análise de desempenho:** exporte as métricas (alcance, salvamentos, cliques) e peça: "Quais temas e formatos performaram melhor? Quais hipóteses testamos no próximo mês?"
- **SEO local:** descrições do Perfil de Empresa no Google, respostas a avaliações, posts do perfil e textos de site com as palavras que o cliente busca.

---

## Aula 7.5: Imagem, vídeo e cuidados legais

### Geração visual
- Use IA para **ideias, fundos, variações e mockups**. Para produtos reais, prefira **fotos reais** melhoradas (fundo, luz, recorte), porque imagens geradas podem enganar o consumidor sobre o produto.
- Mantenha a identidade: cores, fontes e modelos no Canva (kit de marca).

### Cuidados obrigatórios
1. **Direitos autorais:** não peça "no estilo de [artista vivo]" para uso comercial; não use marcas e personagens de terceiros.
2. **Imagem e voz de pessoas:** nunca gere imagem ou voz de pessoas reais sem autorização por escrito.
3. **Publicidade:** respeite o CDC (nada de propaganda enganosa), o CONAR e as regras de conselhos profissionais (medicina, odontologia, advocacia, nutrição etc. têm restrições específicas).
4. **Transparência:** indique uso de IA quando exigido pela plataforma ou quando a imagem puder confundir o consumidor.
5. **Checagem de fatos:** números, estatísticas e afirmações técnicas devem ser verificados.

---

## Exercícios

**Exercício 1: Guia de marca (60 min).** Crie o guia de marca para IA da empresa-laboratório. Entreviste o dono por 20 minutos para isso. Configure num Project/GPT.

**Exercício 2: Teste A/B de prompts (45 min).** Gere 5 posts **sem** o guia e 5 **com** o guia. Mostre a 3 pessoas (sem dizer qual é qual) e peça para escolherem os que "têm a cara da marca".

**Exercício 3: Calendário (45 min).** Crie o calendário do próximo mês: pilares, 12 posts, 4 roteiros de vídeo e 2 e-mails. Inclua datas comemorativas relevantes ao segmento.

**Exercício 4: Espionagem de anúncios (45 min).** Analise 10 anúncios de concorrentes na Biblioteca de Anúncios da Meta com IA. Liste 5 aprendizados e 3 ideias de teste.

---

## Tarefa de campo
Entregue à empresa-laboratório **um mês de conteúdo** produzido com o sistema e treine a pessoa responsável para operar sozinha. Após 30 dias, compare as métricas (alcance, engajamento, mensagens recebidas) com o mês anterior.

---

## Entregável: Sistema de conteúdo
- Guia de marca para IA.
- Project/GPT configurado.
- 10 prompts de conteúdo (posts, roteiros, anúncios, e-mail, resposta a avaliações, análise de desempenho).
- Modelos visuais no Canva.
- Processo de 7 etapas documentado com responsáveis.
- Calendário do mês.

**Critério de qualidade:** a pessoa responsável produz uma semana de conteúdo em até 2 horas, com aprovação do dono.

---

## Autoavaliação
1. Qual a causa principal do conteúdo genérico?
2. Cite 6 elementos de um guia de marca para IA.
3. Descreva o framework PAS.
4. Qual a distribuição recomendada por pilares no exemplo da academia?
5. Cite 3 cuidados legais ao usar imagens geradas por IA.
6. Por que preferir fotos reais para produtos?
7. Como usar a IA para analisar concorrentes?

<details>
<summary><strong>Gabarito</strong></summary>

1. A IA não conhece a marca, o público e o objetivo, ou seja, falta contexto.
2. Quem somos, público/persona, proposta de valor, tom de voz (somos/não somos), palavras usadas e proibidas, exemplos aprovados, produtos e diferenciais, regras (quaisquer 6).
3. Problema → Agitação (intensificar a dor) → Solução.
4. Educação 40%, Prova 25%, Bastidores 20%, Oferta 15%.
5. Não imitar artistas vivos nem marcas de terceiros; não usar imagem ou voz de pessoas reais sem autorização; não enganar o consumidor (CDC/CONAR); respeitar as regras de conselhos profissionais; transparência (quaisquer 3).
6. Imagens geradas podem não representar o produto real, o que caracteriza propaganda enganosa e gera frustração no cliente.
7. Coletando anúncios e posts públicos (por exemplo, na Biblioteca de Anúncios da Meta) e pedindo à IA que analise ganchos, promessas, ofertas, padrões e lacunas.
</details>
