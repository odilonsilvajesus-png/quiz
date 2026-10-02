# Empresa fictícia: Casa Aurora Materiais de Construção

> Use esta empresa nos laboratórios **somente se você não tiver acesso a uma empresa real**. Ela foi desenhada com problemas típicos de PMEs brasileiras para que todos os exercícios façam sentido.

---

## Visão geral

| Item | Informação |
|---|---|
| **Razão social** | Casa Aurora Comércio de Materiais Ltda. |
| **Setor** | Varejo de materiais de construção (loja física + vendas por WhatsApp) |
| **Localização** | Cidade de ~300 mil habitantes, interior de SP |
| **Fundação** | 2009 (empresa familiar, 2ª geração assumindo) |
| **Faturamento** | ~R$ 9 milhões/ano |
| **Funcionários** | 28 |
| **Clientes** | ~60% pessoa física (reformas), ~40% pedreiros, empreiteiros e pequenas construtoras |
| **Ticket médio** | R$ 480 (PF) / R$ 2.300 (profissionais) |
| **SKUs** | ~6.500 produtos ativos |

## Pessoas-chave

- **Sr. Antônio (62)**: fundador. Desconfiado de tecnologia, mas aberto a "qualquer coisa que dê dinheiro".
- **Juliana (34)**: filha, diretora comercial. Puxa a modernização e é a sua principal interlocutora.
- **Marcos (45)**: gerente financeiro. Faz tudo em planilha e tem medo de perder o controle.
- **Rafael (29)**: supervisor de vendas, com 6 vendedores sob ele.
- **Dona Célia (51)**: compras e estoque. Conhece todos os fornecedores e não documenta nada.

## Estrutura

```
Diretoria (Antônio, Juliana)
├── Comercial (Rafael + 6 vendedores + 2 no WhatsApp)
├── Financeiro (Marcos + 2 assistentes)
├── Compras e Estoque (Célia + 1 assistente)
├── Logística (1 coordenador + 4 motoristas/ajudantes)
├── Loja/Caixa (5 pessoas)
└── Administrativo/RH (2 pessoas, 1 terceirizado de contabilidade)
```

## Sistemas e tecnologia

| Sistema | Uso | Observação |
|---|---|---|
| **ERP de mercado (genérico, local)** | Estoque, vendas, fiscal | Instalado em servidor local, não tem API documentada; exporta CSV/Excel |
| **WhatsApp Business (app)** | Atendimento | 2 celulares, sem integração, conversas se perdem |
| **Planilhas Excel** | Financeiro, metas, cotações | Mais de 40 planilhas espalhadas, algumas com macros |
| **E-mail (Gmail corporativo)** | Fornecedores, NF-e, boletos | Caixa compartilhada com ~200 e-mails/dia |
| **Instagram** | Marketing | Postagens irregulares |
| **Site** | Institucional | Desatualizado, sem e-commerce |

## Números operacionais

- **Atendimento WhatsApp**: ~180 conversas/dia; 2 atendentes; tempo médio de primeira resposta: **47 minutos** em horário comercial; fora do horário, nada.
- **Orçamentos**: ~60/dia; levam de 15 a 40 min cada (consultar estoque, preço, frete); **taxa de conversão: 22%**.
- **Orçamentos sem follow-up**: estimados em 70%.
- **Notas fiscais de entrada**: ~35/dia; conferência manual contra o pedido de compra (~10 min cada).
- **Contas a pagar**: boletos chegam por e-mail, WhatsApp e papel; atrasos ocasionais geram multa (~R$ 1.800/mês em juros).
- **Cobrança**: inadimplência de 6% nas vendas a prazo para profissionais; cobrança feita por telefone quando "sobra tempo".
- **Ruptura de estoque**: os vendedores estimam que 1 em cada 10 orçamentos tem item em falta.
- **Rotatividade**: alta no atendimento (3 trocas no último ano); o treinamento de um vendedor novo leva ~2 meses.

## Dores declaradas (em entrevista)

- **Antônio**: "A gente perde venda porque demora para responder. O cliente vai no concorrente."
- **Juliana**: "Quero crescer as vendas para profissionais, mas não temos estrutura para atender bem."
- **Marcos**: "Gasto metade do meu tempo conferindo papel e lançando boleto."
- **Rafael**: "Vendedor novo demora muito para aprender os produtos. Tem muita dúvida técnica."
- **Célia**: "Eu sei de cabeça quando comprar. Se eu sair, ninguém sabe."

## Concorrência

- Duas grandes redes nacionais com loja na cidade (preço agressivo, e-commerce).
- Três lojas locais menores.
- Diferencial atual da Casa Aurora: **atendimento próximo, entrega rápida e crédito para profissionais**.

## Objetivos da diretoria (próximos 2 anos)

1. Crescer 25% em faturamento sem aumentar a equipe proporcionalmente.
2. Aumentar a participação de clientes profissionais para 55%.
3. Reduzir a dependência de pessoas-chave (conhecimento na cabeça da Célia e do Antônio).
4. Profissionalizar a gestão para a sucessão.

---

## Materiais simulados para os laboratórios

Quando um laboratório pedir dados da empresa e você estiver usando a Casa Aurora, **peça a um assistente de IA para gerar dados simulados realistas** com base nesta descrição, por exemplo:

> "Gere 30 mensagens de WhatsApp realistas que clientes de uma loja de materiais de construção do interior de SP enviariam, variando entre pedidos de orçamento, dúvidas técnicas, reclamações de entrega e perguntas sobre crédito. Inclua erros de digitação e linguagem informal."

> "Gere uma planilha CSV com 50 produtos de materiais de construção, com colunas: código, descrição, categoria, unidade, preço, estoque_atual, estoque_minimo, fornecedor."

Gerar dados sintéticos para teste já é, por si, uma habilidade útil que você vai usar como especialista.
