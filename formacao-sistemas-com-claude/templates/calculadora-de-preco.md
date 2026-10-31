# Calculadora de preço

Preencha em uma planilha (copie as tabelas) ou peça ao Claude para transformar este modelo em uma planilha com fórmulas. **Anote a data de consulta de cada preço de fornecedor**: preços e câmbio mudam.

**Projeto / cliente:** ___ · **Data:** ___

---

## Parte 1 · Seu valor-hora mínimo

| Item | Valor mensal |
|---|---|
| Retirada desejada (seu "salário") | R$ ___ |
| Custos fixos do negócio (ferramentas, contador, equipamento, internet, cursos) | R$ ___ |
| Reservas (férias, 13º, doença, meses fracos), sugestão: 20% a 30% da retirada | R$ ___ |
| **A · Custo mensal para existir profissionalmente** | **R$ ___** |
| Horas de trabalho no mês | ___ h |
| Percentual vendável (sugestão: 50% a 70%) | ___% |
| **B · Horas vendáveis** | **___ h** |
| **Valor-hora mínimo (A ÷ B)** | **R$ ___** |
| Valor-hora praticado (mínimo + margem) | R$ ___ |

---

## Parte 2 · Estimativa de esforço

| Pacote de trabalho | Otimista (h) | Provável (h) | Pessimista (h) | Esperado = (O + 4P + Pe) ÷ 6 |
|---|---|---|---|---|
| Descoberta e especificação | | | | |
| Base (login, permissões, multi-empresa, auditoria) | | | | |
| Funcionalidade: ___ | | | | |
| Funcionalidade: ___ | | | | |
| Integração: ___ (inclui configuração de conta) | | | | |
| Infraestrutura, CI/CD, monitoramento, backups | | | | |
| Segurança (auditoria e correções) | | | | |
| Importação e limpeza de dados | | | | |
| Treinamento e implantação | | | | |
| Gestão e reuniões | | | | |
| **Soma** | | | | **___ h** |
| Multiplicador de risco (1,1 a 2,0) | | | | × ___ |
| **Horas estimadas** | | | | **___ h** |

---

## Parte 3 · Custos mensais de operação

| Item | Volume estimado | Preço oficial (consultado em ___) | Custo mensal |
|---|---|---|---|
| Aplicação (hospedagem) | | | R$ ___ |
| Banco de dados gerenciado | | | R$ ___ |
| Armazenamento de arquivos | ___ GB | | R$ ___ |
| Backup externo | ___ GB | | R$ ___ |
| Monitoramento e erros | | | R$ ___ |
| E-mail transacional | ___ e-mails | | R$ ___ |
| WhatsApp (por categoria de mensagem) | ___ mensagens | | R$ ___ |
| IA (API do Claude) | ___ chamadas | | R$ ___ |
| Emissor de notas | ___ notas | | R$ ___ |
| Domínio (anual ÷ 12) | | | R$ ___ |
| **Subtotal** | | | **R$ ___** |
| Margem de segurança (30% a 50%) | | | R$ ___ |
| **C · Custo de infraestrutura mensal** | | | **R$ ___** |
| Horas mensais de operação (monitoramento, atualizações, backups) | ___ h × valor-hora | | R$ ___ |
| **D · Custo mensal total de operação** | | | **R$ ___** |

---

## Parte 4 · Valor para o cliente

| Pergunta (da entrevista de descoberta) | Valor |
|---|---|
| Quanto a dor custa por mês hoje (vendas perdidas, horas, multas, retrabalho)? | R$ ___ |
| Ganhos esperados por mês com o sistema | R$ ___ |
| **E · Valor mensal estimado para o cliente** | **R$ ___** |
| Alternativas de mercado (SaaS pronto, outro fornecedor) e seus preços | ___ |

---

## Parte 5 · Preço

### Opção A · Projeto fechado
| Item | Valor |
|---|---|
| Horas estimadas × valor-hora praticado | R$ ___ |
| Ajuste pelo valor (entre o custo e o valor E) | R$ ___ |
| Impostos sobre o faturamento (alíquota informada pelo contador: ___%) | R$ ___ |
| **Preço do projeto** | **R$ ___** |
| Condições (entrada, parcelas) | ___ |
| Plano de manutenção sugerido | R$ ___ /mês |

### Opção B · Implantação + mensalidade
| Item | Valor |
|---|---|
| Implantação | R$ ___ |
| Mensalidade (operação D + horas de melhoria + amortização do desenvolvimento + margem + impostos) | R$ ___ /mês |
| Permanência mínima | ___ meses |
| Total no período mínimo | R$ ___ |

### Opção C · SaaS (por empresa)
| Item | Valor |
|---|---|
| Custo de infraestrutura por empresa (C ÷ nº de empresas) | R$ ___ |
| Suporte e operação por empresa | R$ ___ |
| Taxa do provedor de pagamento sobre a assinatura | ___% |
| **Custo por empresa** | **R$ ___** |
| Preço do plano (deve cobrir custo, impostos, aquisição e margem) | R$ ___ /mês |
| Margem por empresa | R$ ___ (___%) |
| Limites incluídos (usuários, mensagens, IA) | ___ |

---

## Parte 6 · Conferência

- [ ] O preço fica acima do custo total, com impostos.
- [ ] O preço fica abaixo do valor estimado para o cliente, e o retorno é mostrável ("se paga em ___ meses").
- [ ] Custos variáveis estão protegidos por limite ou repasse.
- [ ] A data de consulta dos preços está anotada.
- [ ] Impostos e enquadramento confirmados com o contador.
