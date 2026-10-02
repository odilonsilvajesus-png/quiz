# Template: Especificação de solução (para agentes de código)

> Entregue este documento ao agente de código na fase **Explorar** (Módulo 3.2). Quanto mais claro, melhor o resultado.

---

# Especificação: [Nome da solução]

**Cliente:** [empresa] | **Versão:** [v1] | **Data:** [data] | **Responsável:** [nome]

## 1. Contexto de negócio
[Quem é a empresa, qual o processo atual, qual o problema, com números. Por que isso importa.]

## 2. Objetivo
[Uma ou duas frases: o que a solução deve alcançar.]

## 3. Usuários
| Usuário | Como interage | Nível técnico |
|---|---|---|

## 4. Escopo
### Faz
- [funcionalidade 1]
- [...]

### Não faz (fora do escopo)
- [...]

## 5. Fluxo principal
1. [gatilho]
2. [etapa]
3. [...]

## 6. Regras de negócio e exceções
| Situação | Comportamento esperado |
|---|---|
| [caso normal] | |
| [exceção 1] | |
| [dado ausente/ilegível] | |
| [falha de integração] | |
| [tentativa de abuso] | |

## 7. Dados e integrações
| Sistema | Acesso (API, arquivo, MCP...) | Leitura/escrita | Credenciais (onde ficam) |
|---|---|---|---|

## 8. IA
- **Padrão de arquitetura:** [classificador / workflow / RAG / agente...] e justificativa
- **Modelo(s):** [a definir pelo eval / candidatos]
- **Prompts:** [onde ficam no repositório]
- **Saída estruturada:** [schema]
- **Humano no loop:** [onde e como]

## 9. Requisitos não funcionais
- **Volume:** [n por dia]
- **Latência aceitável:** [segundos/minutos]
- **Custo de IA alvo:** [R$/mês]
- **Segurança:** segredos em variáveis de ambiente; menor privilégio; [outros]
- **LGPD:** [dados pessoais envolvidos; minimização; retenção]
- **Logs:** [o que registrar]
- **Hospedagem:** [onde vai rodar]

## 10. Critérios de aceite
- [ ] [critério verificável 1, ex.: "≥ 95% de acerto nos 50 casos do eval, 0 erros críticos"]
- [ ] [...]
- [ ] README permite que outra pessoa rode o projeto
- [ ] Testes automatizados das funções críticas

## 11. Exemplos
| Entrada | Saída esperada |
|---|---|

(Anexe arquivos de exemplo anonimizados em `tests/exemplos/`.)

## 12. Fora de questão / restrições
- [ex.: "não alterar dados no ERP"; "não enviar mensagens a clientes sem aprovação na fase piloto"]

---

**Voltar:** [Templates](README.md)
