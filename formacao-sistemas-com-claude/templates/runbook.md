# Modelo de runbook de operação

Um runbook por sintoma, em `docs/runbooks/`. Escreva para alguém cansado seguir às 3h da manhã: passos curtos, comandos prontos, links diretos. **Não coloque segredos aqui**: diga onde encontrá-los no cofre.

**Sistema:** ___ · **Última revisão:** ___ · **Último teste em homologação:** ___

---

## Formato de cada runbook

```markdown
## Runbook: ___ (sintoma)

**Gatilho:** ___ (alerta ou relato)
**Gravidade típica:** ___
**Painel:** ___ (link)   **Logs:** ___ (link)

1. Confirme: ___ (comando ou verificação)
2. Verifique a causa mais provável: ___
   - Se ___ → ___
   - Se ___ → ___
3. Ação de contenção: ___
4. Se não resolver em ___ min: ___ (escalar para quem / qual runbook)
5. Ao resolver: confirme ___, comunique ___ (modelo), registre o incidente.

**Onde estão as credenciais necessárias:** cofre "___", item "___".
```

---

## Runbooks essenciais (preencha para cada sistema)

### 1. Sistema fora do ar
1. `curl -I https://___/api/saude`
   - Sem resposta ou erro de DNS → passo 2 · Erro de certificado → runbook 8 · 502/503 → passo 3 · 200 → runbook 2
2. `nslookup ___` · Domínio vencido? Painel do registrador: ___
3. Status do provedor de hospedagem: ___ (link). Incidente deles? → página de status + aviso aos clientes.
4. Deploy nos últimos 60 min? → runbook 10 (voltar versão).
5. Banco: painel ___. Disco? Conexões? → runbook 4.
6. 30 min sem solução → suporte da hospedagem (___) e runbook 9 (recuperação de desastre).

### 2. Erros 5xx em alta
1. Ferramenta de erros: qual erro, desde quando, qual versão? (___)
2. Coincide com deploy? → runbook 10.
3. Erro de um fornecedor (pagamento, WhatsApp, e-mail)? → runbook 6.
4. Erro de banco (conexões, tempo esgotado)? → runbook 4.
5. Erro novo de código sem deploy recente? → desligar a funcionalidade por interruptor, investigar.

### 3. Sistema lento
1. Painel: p95 por rota; qual rota está lenta?
2. Banco: consultas lentas no momento (___), conexões em uso.
3. Fila de tarefas acumulada consumindo recursos?
4. Pico de tráfego anormal (robô)? → limites de requisições, bloqueio na borda.
5. Contenção: desligar funcionalidades pesadas; aumentar instâncias temporariamente.

### 4. Banco: disco cheio ou conexões esgotadas
1. Disco: o que cresceu? (tabelas maiores: ___ consulta). Logs ou arquivos dentro do banco?
2. Ação imediata: aumentar o armazenamento no painel (___).
3. Conexões: quantas por origem? Vazamento de conexões após deploy? → runbook 10.
4. Depois: alerta em 80%, revisão de retenção, pool de conexões.

### 5. Fila de tarefas parada ou com falhas
1. O worker está rodando? (___)
2. Tarefas na fila de falhas: qual tipo, qual erro?
3. Erro de fornecedor → runbook 6. Erro de código → corrigir e reprocessar.
4. Reprocessar com segurança (tarefas são idempotentes): comando ___

### 6. Fornecedor fora (pagamento, WhatsApp, e-mail, IA)
1. Página de status do fornecedor: ___
2. Confirmar que a pausa automática e a fila estão segurando (sem perda).
3. Pagamento: confirmar que a suspensão automática está pausada.
4. Atualizar a página de status do sistema e a faixa de aviso.
5. Ao normalizar: acompanhar o esvaziamento da fila; rodar a conciliação.

### 7. Backup falhou
1. Log da tarefa de backup: ___
2. Credencial do armazenamento externo válida? Espaço disponível?
3. Rodar o backup manualmente: comando ___
4. Confirmar o arquivo na cópia externa e o batimento.
5. Não deixar passar do dia: um dia sem backup é RPO estourado.

### 8. Certificado HTTPS ou domínio vencendo
1. Domínio: renovação automática ligada? Cartão válido? (registrador ___)
2. Certificado: a renovação automática da plataforma/Caddy falhou? Log ___
3. DNS ainda aponta para o lugar certo? Porta 80 acessível (necessária para renovar)?
4. Certificado digital de cliente (nota fiscal): avisar o cliente com antecedência; procedimento de troca ___

### 9. Recuperação de desastre (restaurar em outro ambiente)
1. Cofre de emergência: item "___" (credenciais do armazenamento externo, registro de imagens, DNS).
2. Criar banco novo em ___; criar usuários e extensões: script ___
3. Restaurar o último dump externo: comando ___
4. Conferir: contagem de registros por tabela; campos criptografados abrindo com a chave do cofre.
5. Subir a aplicação (imagem ___), configurar variáveis (lista em `.env.example`).
6. Atualizar o DNS; atualizar webhooks externos que apontam para o sistema (lista: ___).
7. Testar fluxos críticos; comunicar clientes.
8. Tempo-alvo (RTO): ___

### 10. Voltar uma versão
1. Versão atual e anterior: `/api/saude` e histórico de deploys (___).
2. As migrations da versão atual são compatíveis com a anterior? (devem ser)
3. Ação: ___ (PaaS: redeploy da anterior; VPS: `VERSAO=___ docker compose up -d`)
4. Confirmar saúde e erros; comunicar se houve impacto.

### 11. Pico de falhas de login
1. Origem: muitos IPs (preenchimento de credenciais) ou um só (força bruta)?
2. Limites de requisições funcionando? Bloquear na borda se necessário.
3. Alguma conta teve sucesso de login de origem suspeita? → plano de incidente.
4. Comunicar os clientes se houver contas comprometidas; recomendar 2FA.

### 12. Incidente de segurança
→ [Plano de resposta a incidentes](plano-de-incidente.md)

---

## Registro de execuções

| Data | Runbook | Situação | Funcionou? | Ajuste feito |
|---|---|---|---|---|
| ___ | ___ | ☐ real ☐ teste | ___ | ___ |
