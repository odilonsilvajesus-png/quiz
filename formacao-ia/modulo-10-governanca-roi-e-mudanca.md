# Módulo 10: ROI, governança, LGPD e gestão da mudança

**Parte A (semanas 8 e 9): ROI e caso de negócio · cerca de 18 horas**
**Parte B (semana 23): governança, LGPD e gestão da mudança · cerca de 9 horas**

---

# PARTE A: ROI e caso de negócio

## Objetivos de aprendizagem
1. Calcular o retorno de iniciativas de IA com premissas explícitas e conservadoras.
2. Estimar o custo total (implementação + operação + manutenção).
3. Construir um caso de negócio e uma proposta comercial.
4. Precificar os seus serviços de consultoria e implementação.

---

## Aula A.1: As 4 fontes de valor

| Fonte | Como calcular | Exemplo |
|---|---|---|
| **1. Tempo economizado** | Horas economizadas/mês × custo da hora (salário + encargos) | 80h × R$ 35 = R$ 2.800/mês |
| **2. Receita adicional** | Aumento de conversão × volume × ticket médio × margem | +3 vendas/semana × R$ 400 × 40% margem = R$ 2.080/mês |
| **3. Custo evitado** | Erros, multas, retrabalho, contratações evitadas | Não contratar 1 atendente: R$ 3.500/mês |
| **4. Risco / experiência** | Mais difícil de medir: satisfação, retenção, reputação | Queda de reclamações; nota do Google sobe |

### Custo da hora
```
Custo da hora = (salário + encargos e benefícios) / horas trabalhadas no mês
Regra prática para CLT: encargos e benefícios ≈ 60% a 100% do salário (varia pelo regime tributário)
Exemplo: salário R$ 2.500 × 1,8 = R$ 4.500 / 176h ≈ R$ 25,50/h
```

> ⚠️ **Tempo economizado não é dinheiro economizado**, a menos que o tempo seja **realocado** para algo produtivo (vender mais, atender melhor) ou evite uma contratação. Diga isso ao cliente. É honestidade que gera confiança.

---

## Aula A.2: Custo total da solução

| Tipo | Itens |
|---|---|
| **Implementação (única)** | Seu serviço (diagnóstico, construção, testes), configuração, treinamento |
| **Operação (mensal)** | Licenças (assistentes, plataformas), uso de API, mensagens de WhatsApp, hospedagem |
| **Manutenção (mensal)** | Ajustes de prompt e base, monitoramento, suporte, atualizações |
| **Custos internos** | Tempo da equipe do cliente em reuniões, testes e treinamento |

### Fórmulas
```
Benefício mensal líquido = Benefícios mensais − Custos mensais (operação + manutenção)
Payback (meses)          = Investimento inicial / Benefício mensal líquido
ROI em 12 meses (%)      = (Benefício líquido em 12 meses − Investimento inicial) / Investimento inicial × 100
```

### Exemplo completo: atendimento com IA numa loja
| Item | Valor |
|---|---|
| Horas economizadas | 70h/mês × R$ 25,50 = R$ 1.785 |
| Receita adicional (respostas noturnas e fins de semana) | 6 vendas/mês × R$ 300 × 45% = R$ 810 |
| **Benefício mensal** | **R$ 2.595** |
| Plataforma + API + mensagens | R$ 450/mês |
| Manutenção (seu serviço) | R$ 600/mês |
| **Benefício líquido mensal** | **R$ 1.545** |
| Investimento inicial (implementação) | R$ 5.000 |
| **Payback** | 5.000 / 1.545 ≈ **3,2 meses** |
| **ROI 12 meses** | (1.545 × 12 − 5.000) / 5.000 = **271%** |

### 3 cenários (sempre apresente)
- **Conservador:** 50% dos benefícios estimados.
- **Provável:** 75%.
- **Otimista:** 100%.

**Decida pelo conservador.** Se o projeto se paga no cenário conservador, é uma boa decisão. Use a [calculadora de ROI](templates/calculadora-roi.md).

---

## Aula A.3: O caso de negócio (1 página)

```
PROBLEMA: [dor em números — "40% dos orçamentos ficam sem follow-up; ~R$ 18 mil/mês em propostas perdidas"]
SOLUÇÃO: [o que será feito, em linguagem de negócio]
BENEFÍCIOS: [3 cenários, com premissas]
INVESTIMENTO: [inicial + mensal]
PAYBACK E ROI: [conservador]
RISCOS E MITIGAÇÃO: [2 ou 3 principais]
INDICADORES DE SUCESSO: [como vamos medir, meta em 90 dias]
PRÓXIMO PASSO: [decisão pedida + data]
```

---

## Aula A.4: Precificação dos seus serviços

### Modelos de cobrança
| Modelo | Quando usar | Observação |
|---|---|---|
| **Diagnóstico (preço fechado)** | Porta de entrada | Pode ser abatido do projeto se o cliente contratar |
| **Projeto (preço fechado)** | Implementação com escopo claro | Defina muito bem o escopo e o que está fora |
| **Recorrência mensal** | Manutenção, melhoria contínua, suporte | É o que dá estabilidade ao seu negócio |
| **Hora/consultoria** | Mentorias, dúvidas pontuais | Difícil de escalar |
| **Treinamento/workshop** | Equipes e eventos | Ótimo gerador de leads (conecta com palestras) |
| **Por resultado** | Só com medição inequívoca | Arriscado; combine com um valor fixo |

### Como calcular o preço de um projeto
```
Preço mínimo = (horas estimadas × seu valor-hora) × 1,3 (margem para imprevistos)
Preço por valor = 10% a 30% do benefício líquido do 1º ano do cliente
Cobre o MAIOR entre os dois, desde que o payback do cliente fique abaixo de ~6 meses.
```

### Pacotes (exemplo de estrutura; defina seus valores conforme mercado e experiência)
- **Diagnóstico IA:** 2 semanas, relatório + roadmap + apresentação.
- **Implementação Quick Win:** 1 automação ou assistente, 2 a 4 semanas.
- **Implementação Estratégica:** agente ou atendimento completo, 4 a 8 semanas.
- **Acompanhamento mensal:** monitoramento, melhorias, novos prompts, suporte.
- **Treinamento de equipe:** 4h a 8h, com a biblioteca de prompts da empresa.

---

## Exercícios (Parte A)

**Exercício A1 (45 min).** Calcule o custo da hora de 3 cargos da empresa-laboratório.

**Exercício A2 (90 min).** Faça o ROI das 3 principais oportunidades do seu diagnóstico (M3), nos 3 cenários.

**Exercício A3 (60 min).** Escreva o caso de negócio de 1 página da oportunidade nº 1.

**Exercício A4 (60 min).** Defina seus 5 pacotes de serviço, com escopo, prazo e preço inicial. Pesquise 3 concorrentes (consultores e agências de IA) para calibrar.

## Entregável (Parte A)
- **Calculadora de ROI** preenchida com as 3 oportunidades.
- **Proposta comercial** completa ([templates/proposta-comercial.md](templates/proposta-comercial.md)) para a empresa-laboratório.
- **Tabela de pacotes** dos seus serviços.

---

# PARTE B: Governança, LGPD e gestão da mudança

## Objetivos de aprendizagem
1. Aplicar a LGPD ao uso de IA (bases legais, dados sensíveis, direitos dos titulares).
2. Classificar dados e definir o que pode ser usado em cada ferramenta.
3. Redigir uma política de uso de IA para PMEs.
4. Identificar e mitigar riscos (alucinação, vazamento, viés, dependência).
5. Conduzir a adoção pela equipe (gestão da mudança).

---

## Aula B.1: LGPD aplicada à IA

A **Lei Geral de Proteção de Dados** (Lei 13.709/2018) se aplica sempre que a IA trata **dados pessoais** (qualquer informação que identifique ou possa identificar uma pessoa: nome, CPF, telefone, e-mail, endereço, IP, foto, voz).

### Conceitos essenciais
| Conceito | Significado para projetos de IA |
|---|---|
| **Controlador** | A empresa cliente: decide por que e como tratar os dados |
| **Operador** | Quem trata os dados em nome do controlador: você (se tiver acesso) e os fornecedores de IA |
| **Bases legais** (art. 7º) | Todo tratamento precisa de uma: consentimento, execução de contrato, legítimo interesse, obrigação legal etc. Ex.: responder o cliente que chamou no WhatsApp → execução de contrato/procedimentos preliminares |
| **Dados sensíveis** (art. 5º, II e art. 11) | Saúde, biometria, religião, origem racial, opinião política, vida sexual, dados genéticos, filiação sindical. **Regras mais rígidas** e bases legais mais restritas |
| **Princípios** (art. 6º) | Finalidade, adequação, **necessidade (minimização)**, transparência, segurança, prevenção, não discriminação, responsabilização |
| **Direitos dos titulares** (art. 18) | Acesso, correção, eliminação, informação sobre compartilhamento etc. |
| **Decisões automatizadas** (art. 20) | O titular pode pedir revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem seus interesses (ex.: crédito, perfil) |
| **Transferência internacional** (arts. 33 a 36) | Muitas ferramentas de IA processam dados fora do Brasil, o que exige atenção às hipóteses legais e aos contratos do fornecedor |
| **ANPD** | Autoridade Nacional de Proteção de Dados: fiscaliza e orienta |

> ⚖️ Este módulo dá base prática, **não substitui assessoria jurídica**. Em projetos com dados sensíveis ou em volume, recomende ao cliente validar com advogado ou DPO.

### Checklist LGPD para cada projeto de IA
- [ ] Quais dados pessoais a solução trata? São necessários (minimização)?
- [ ] Há dados sensíveis? Se sim, qual base legal e quais salvaguardas adicionais?
- [ ] Qual a base legal de cada finalidade?
- [ ] O fornecedor de IA usa os dados para treinamento? (usar planos que não usam)
- [ ] Onde os dados são processados e armazenados? Há contrato ou termos adequados (DPA)?
- [ ] Por quanto tempo os dados (logs, conversas) são guardados?
- [ ] O titular é informado (aviso de privacidade, aviso de atendimento por IA)?
- [ ] Há forma de atender a pedidos de acesso ou eliminação?
- [ ] Quem tem acesso aos logs e às conversas?
- [ ] Há decisão automatizada relevante? Existe revisão humana?

---

## Aula B.2: Classificação de dados (o "semáforo")

| Classe | Exemplos | Onde pode ser usado |
|---|---|---|
| 🟢 **Público** | Site, catálogo, posts, preços públicos | Qualquer ferramenta |
| 🟡 **Interno** | Processos, manuais, metas, relatórios sem dados pessoais | Ferramentas **aprovadas** em planos que não treinam com os dados |
| 🟠 **Confidencial** | Dados de clientes, contratos, financeiro detalhado, estratégia | Só ferramentas corporativas aprovadas, com controle de acesso; minimizar e anonimizar sempre que possível |
| 🔴 **Restrito** | Dados sensíveis (saúde etc.), senhas, dados bancários completos, documentos de identidade | **Não enviar** a assistentes de IA de uso geral. Só em soluções específicas avaliadas, com base legal e salvaguardas |

### Técnicas de proteção
- **Anonimizar/pseudonimizar:** trocar "Maria Souza, CPF 123..." por "Cliente A".
- **Minimizar:** enviar só o necessário ("o valor e a data", não a planilha inteira).
- **Agregar:** enviar totais em vez de registros individuais.

---

## Aula B.3: Política de uso de IA

Toda empresa que você atender deve sair com uma **política de 2 a 4 páginas**. Use [templates/politica-de-uso-de-ia.md](templates/politica-de-uso-de-ia.md). Conteúdo mínimo:
1. Objetivo e abrangência
2. Ferramentas aprovadas (e as proibidas)
3. Classificação de dados (semáforo) e o que pode ir para cada ferramenta
4. Regras de uso: revisão humana, checagem de fatos, transparência com clientes
5. Usos proibidos
6. Propriedade e confidencialidade do conteúdo
7. Responsáveis e canal de dúvidas
8. Incidentes: o que fazer se dados forem expostos
9. Treinamento obrigatório e revisão periódica da política

---

## Aula B.4: Matriz de riscos de IA

| Risco | Exemplo | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| **Alucinação** | Bot informa preço errado | Média | Alto | RAG com fonte única; "não sei"; testes; revisão semanal |
| **Vazamento de dados** | Funcionário cola planilha de clientes em ferramenta gratuita | Média | Alto | Política + semáforo + ferramentas corporativas + treinamento |
| **Prompt injection** | Cliente manipula o bot para dar desconto | Baixa/Média | Médio | Permissões mínimas; regras de negócio fora da IA |
| **Viés/discriminação** | Triagem de currículos favorece um perfil | Média | Alto | Critérios objetivos; revisão humana; auditoria de amostras |
| **Dependência de fornecedor** | Ferramenta aumenta o preço ou sai do mercado | Média | Médio | Dados exportáveis; documentação; arquitetura modular |
| **Dependência de pessoa** | Só o consultor sabe manter | Alta | Médio | Documentação + treinamento de um responsável interno |
| **Custo descontrolado** | Laço de automação consome a API | Baixa | Médio | Teto de gasto; alertas; monitoramento |
| **Reputação** | Resposta inadequada viraliza | Baixa | Alto | Tom testado; encaminhamento; transparência |

---

## Aula B.5: Gestão da mudança (onde a maioria dos projetos falha)

Ferramenta instalada ≠ ferramenta adotada. Os principais motivos de fracasso são **humanos**: medo de substituição, falta de tempo para aprender, hábitos, desconfiança.

### O modelo ADKAR, adaptado
| Etapa | Pergunta | Ação prática |
|---|---|---|
| **Consciência** | Por que mudar? | Mostre a dor e o ganho **para o funcionário** ("menos digitação chata") |
| **Desejo** | Eu quero participar? | Envolva a equipe desde o diagnóstico; ouça os medos |
| **Conhecimento** | Sei como fazer? | Treinamento prático com as tarefas reais deles |
| **Habilidade** | Consigo fazer no dia a dia? | Acompanhamento nas 2 primeiras semanas; guias rápidos |
| **Reforço** | Vou continuar? | Métricas visíveis; reconhecimento; "campeões de IA" |

### Táticas que funcionam em PMEs
1. **Campeões de IA:** 1 ou 2 funcionários entusiastas que recebem treinamento extra e ajudam os colegas.
2. **Comece pela tarefa mais odiada:** a adesão é imediata.
3. **Discurso honesto sobre empregos:** "A IA vai tirar as tarefas repetitivas para vocês fazerem o que importa." Se houver redução de quadro planejada, **não engane**. Recomende ao dono transparência e requalificação.
4. **Treinamento em 3 tempos:** demonstração (30 min) → prática guiada com as tarefas deles (60 min) → desafio da semana.
5. **Ritual semanal de 15 min:** "o que a IA resolveu esta semana?"
6. **Métricas no mural:** horas economizadas, respostas automáticas, vendas geradas.

### Plano de treinamento modelo (empresa de 15 pessoas)
| Semana | Atividade | Público |
|---|---|---|
| 1 | Workshop "IA na prática" (2h): conceitos + política de uso + prompts básicos | Todos |
| 2 | Oficinas por área (1h cada) com a biblioteca de prompts da área | Por área |
| 3 | Treinamento dos campeões (3h): automações e manutenção | Campeões |
| 4 | Plantão de dúvidas + desafio | Todos |
| Mensal | Ritual de 15 min + novidades | Todos |

---

## Exercícios (Parte B)

**Exercício B1 (45 min).** Aplique o checklist LGPD ao agente de atendimento que você construiu no M6.

**Exercício B2 (30 min).** Classifique 20 tipos de dados da empresa-laboratório no semáforo.

**Exercício B3 (60 min).** Redija a política de uso de IA da empresa-laboratório com o template.

**Exercício B4 (45 min).** Monte a matriz de riscos das soluções implementadas (M5, M6, M8, M9).

**Exercício B5 (60 min).** Planeje e **aplique** o workshop de 2h para a equipe da empresa-laboratório.

## Entregável (Parte B): Kit de governança
- Política de uso de IA.
- Semáforo de classificação de dados.
- Checklist LGPD aplicado a cada solução.
- Matriz de riscos.
- Plano de treinamento + material do workshop.

---

## Autoavaliação (Partes A e B)
1. Por que "tempo economizado" não é necessariamente "dinheiro economizado"?
2. Calcule o payback: investimento de R$ 8.000; benefício líquido de R$ 2.000/mês.
3. Por que decidir pelo cenário conservador?
4. Como calcular o preço de um projeto (dois métodos)?
5. O que são dados sensíveis pela LGPD? Dê 4 exemplos.
6. O que diz o art. 20 da LGPD e qual a relevância para IA?
7. O que pode ser colocado numa ferramenta de IA gratuita, segundo o semáforo?
8. Cite 5 itens de uma política de uso de IA.
9. Quais as etapas do ADKAR?
10. O que são campeões de IA?

<details>
<summary><strong>Gabarito</strong></summary>

1. Só vira dinheiro se o tempo for realocado para atividades que geram valor ou se evitar custos (como uma contratação).
2. 8.000 / 2.000 = 4 meses.
3. Porque protege contra premissas otimistas e dá segurança à decisão: se se paga no pior cenário, é uma boa decisão.
4. Por custo: horas × valor-hora × 1,3. Por valor: 10% a 30% do benefício líquido do 1º ano. Cobre o maior, mantendo um payback razoável para o cliente.
5. Dados sobre origem racial ou étnica, religião, opinião política, filiação sindical, saúde, vida sexual, dados genéticos e biométricos (quaisquer 4).
6. O titular pode pedir a revisão de decisões tomadas unicamente por tratamento automatizado que afetem seus interesses. Por isso, IA que decide (crédito, seleção) precisa de revisão humana e transparência.
7. Apenas dados públicos (🟢).
8. Objetivo; ferramentas aprovadas; classificação de dados; regras de uso; usos proibidos; confidencialidade; responsáveis; incidentes; treinamento e revisão (quaisquer 5).
9. Consciência, Desejo, Conhecimento, Habilidade, Reforço.
10. Funcionários entusiastas que recebem treinamento extra e apoiam a adoção pelos colegas.
</details>
