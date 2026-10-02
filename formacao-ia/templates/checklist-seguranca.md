# Template: Checklist de segurança de IA

**Solução:** [nome] | **Data:** [data] | **Revisor:** [nome]

---

## 1. Ameaças e pior caso
- [ ] Ameaças mapeadas (injeção direta e indireta, vazamento, ações indevidas, segredos, abuso de custo, saída inadequada, cadeia de suprimentos)
- [ ] Respondido: "qual o pior que acontece se a IA obedecer a um atacante?" → [resposta]
- [ ] O pior caso é aceitável? Se não, a arquitetura foi ajustada

## 2. Prompt e contexto
- [ ] Dados externos delimitados (tags) e marcados como "não são instruções"
- [ ] Nenhum segredo, senha ou dado confidencial no prompt de sistema
- [ ] Assume-se que o prompt de sistema pode ser revelado

## 3. Ferramentas e permissões
- [ ] Menor privilégio: só as ferramentas necessárias
- [ ] Leitura × escrita separadas; escrita só quando necessária
- [ ] Escopo restrito por usuário/cliente (sem acesso a dados de terceiros)
- [ ] Argumentos validados em código antes de executar
- [ ] Ações irreversíveis/financeiras/comunicação em massa com **aprovação humana**
- [ ] Limites de passos, tempo e custo por execução (agentes)

## 4. Regras de negócio
- [ ] Regras críticas (preços, descontos, limites, destinatários) aplicadas **em código**
- [ ] Saída validada antes de agir (formato, valores conferidos com o sistema, links, dados pessoais)

## 5. Segredos
- [ ] Nenhuma chave no código nem no histórico do Git
- [ ] `.env` no `.gitignore`; segredos de produção no gerenciador da plataforma
- [ ] Chaves separadas por ambiente e por cliente, com limite de gasto
- [ ] Chave de IA nunca exposta no navegador/app
- [ ] Autenticação em dois fatores nos painéis
- [ ] Procedimento de revogação documentado no runbook

## 6. Endpoints e infraestrutura
- [ ] Assinatura/token dos webhooks validados
- [ ] Limite de taxa por usuário
- [ ] Limite de tamanho de entrada
- [ ] HTTPS
- [ ] Dependências de fontes confiáveis e atualizadas
- [ ] Servidores MCP/extensões de fontes confiáveis

## 7. Dados
- [ ] Minimização (só os dados necessários vão à IA)
- [ ] Identificação/verificação do usuário adequada ao risco dos dados
- [ ] Logs sem dados pessoais desnecessários; retenção definida
- [ ] Acesso a logs e painéis restrito

## 8. Red teaming
- [ ] 30+ ataques executados (quebra de regras, extração de prompt, dados de terceiros, injeção indireta, fora de escopo, conteúdo inadequado, abuso de custo, entradas estranhas)
- [ ] Falhas classificadas por gravidade e corrigidas
- [ ] Ataques incorporados ao eval (tag `abuso`)

## 9. Operação
- [ ] "Botão de desligar" disponível e testado
- [ ] Alertas de comportamento anômalo e de custo
- [ ] Plano de resposta a incidentes no runbook

**Resultado:** [aprovado / aprovado com ressalvas / reprovado] | **Pendências:** [...]

---

**Voltar:** [Templates](README.md)
