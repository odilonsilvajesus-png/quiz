# Template: Runbook (manual de operação)

> **Nunca coloque senhas ou chaves neste documento.** Indique apenas onde estão guardadas.

---

# Runbook: [Nome da solução]

**Versão:** [v] | **Última atualização:** [data] | **Responsável técnico:** [nome] | **Responsável de negócio:** [nome]

## 1. Visão geral
- **O que faz:** [1 a 3 frases]
- **Quem usa:** [...]
- **Horário de funcionamento:** [...]
- **Arquitetura resumida:** [diagrama ou link]

## 2. Onde roda
| Componente | Serviço/local | Conta (titular) | Onde estão as credenciais |
|---|---|---|---|
| Servidor/funções | | | |
| Banco de dados | | | |
| IA (API) | | | |
| WhatsApp/e-mail/etc. | | | |
| Repositório do código | | | |

## 3. Como saber se está funcionando
- **Painel:** [link]
- **Valores normais:** [ex.: 150 a 250 execuções/dia; erro < 2%; custo diário < R$ 15]
- **Verificação rápida diária:** [o que olhar]

## 4. Alertas
| Alerta | O que significa | O que fazer | Quem |
|---|---|---|---|
| [Execução agendada não rodou] | | | |
| [Taxa de erro alta] | | | |
| [Gasto acima do limite] | | | |
| [Fila de revisão acumulada] | | | |

## 5. Problemas comuns
| Sintoma | Causa provável | Solução |
|---|---|---|
| [Erro 401 na IA] | Chave expirada/revogada | Gerar nova chave e atualizar o segredo em [local] |
| [Integração com ERP falhou] | Exportação não gerada | Verificar [tarefa agendada no servidor local] |
| [...] | | |

## 6. Desligar e religar
- **Desligar (emergência):** [passo a passo]
- **Religar:** [passo a passo]
- **Verificar após religar:** [...]

## 7. Plano de contingência
[Como a equipe trabalha se a solução parar: processo manual, quem assume, por quanto tempo é aceitável.]

## 8. Como fazer mudanças
| Mudança | Como | Quem pode | Exige eval? |
|---|---|---|---|
| Atualizar base de conhecimento | | | Sim/Não |
| Alterar prompt | | | Sim |
| Alterar regras de negócio | | | Sim |
| Trocar modelo | | | Sim |

## 9. Rotinas de manutenção
- **Semanal:** [...]
- **Mensal:** [...]
- **Trimestral:** [...]

## 10. Contatos
| Papel | Nome | Contato |
|---|---|---|

## 11. Histórico de incidentes
| Data | O que aconteceu | Causa | Correção | Prevenção |
|---|---|---|---|---|

## 12. Histórico de mudanças
| Data | Mudança | Versão | Resultado do eval |
|---|---|---|---|

---

**Voltar:** [Templates](README.md)
