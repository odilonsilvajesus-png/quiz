# Checklist de deploy

Use em todo deploy de produção. Copie para a descrição do pull request ou para o registro do deploy e marque cada item.

**Sistema:** ___ · **Versão nova:** ___ (commit/tag) · **Versão anterior (para voltar):** ___
**Data e hora:** ___ · **Responsável:** ___

## Antes

- [ ] CI verde (tipos, lint, testes, isolamento, auditoria de dependências).
- [ ] Testado em homologação, inclusive os fluxos afetados pela mudança.
- [ ] Testes de ponta a ponta passaram contra homologação.
- [ ] Li o SQL de todas as migrations desta versão.
- [ ] As migrations são compatíveis com a versão anterior do código (expandir e contrair).
- [ ] Migration com risco de perda de dados? ☐ Não ☐ Sim → backup manual feito às ___ e restauração testada em cópia.
- [ ] Backup automático mais recente confirmado (data/hora: ___).
- [ ] Variáveis de ambiente novas cadastradas em produção (e no `.env.example`).
- [ ] Funcionalidades arriscadas atrás de interruptor (feature flag), desligado.
- [ ] Horário adequado (fora do pico do cliente, não é sexta à tarde nem véspera de feriado).
- [ ] Estou disponível para acompanhar por pelo menos 1 hora.
- [ ] Clientes avisados (se houver mudança visível ou janela de manutenção).

## Durante

- [ ] Migrations aplicadas sem erro.
- [ ] Nova versão passou na verificação de saúde.
- [ ] Tráfego passou para a nova versão.

## Depois (primeiros 30 minutos)

- [ ] `/api/saude` mostra a versão nova.
- [ ] Ferramenta de erros: nenhum erro novo relevante.
- [ ] Logs: sem aumento de erros 5xx; tempo de resposta normal.
- [ ] Teste rápido dos fluxos críticos: login, cadastro, cobrança, WhatsApp.
- [ ] Fila de tarefas processando normalmente.
- [ ] Registro do deploy feito (histórico de versões / diário).

## Se algo der errado

1. Erro grave afetando clientes? **Volte para a versão anterior primeiro**, investigue depois.
2. Comando/ação para voltar: ___
3. Dados gravados errados? Não restaure o backup por cima: levante os registros afetados e corrija com script revisado.
4. Avise os clientes afetados ([plano de incidente](plano-de-incidente.md)).
5. Registre o incidente e a causa.
