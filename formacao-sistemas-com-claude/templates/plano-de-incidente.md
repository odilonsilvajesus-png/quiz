# Plano de resposta a incidentes

Preencha **antes** de qualquer incidente, guarde em lugar acessível mesmo com o sistema fora do ar (gerenciador de senhas, cópia impressa) e ensaie pelo menos uma vez por ano.

**Sistema:** ___ · **Cliente (controlador):** ___ · **Versão do plano:** ___ · **Último ensaio:** ___

## 1. Contatos

| Papel | Nome | Telefone | E-mail | Quando acionar |
|---|---|---|---|---|
| Responsável técnico (você) | ___ | ___ | ___ | Sempre |
| Substituto técnico | ___ | ___ | ___ | Se o responsável não responder em 30 min |
| Responsável do cliente | ___ | ___ | ___ | Todo incidente que afete o cliente |
| Encarregado de dados do cliente (DPO) | ___ | ___ | ___ | Incidente com dados pessoais |
| Advogado do cliente | ___ | ___ | ___ | Conforme decisão do cliente |
| Suporte da hospedagem | ___ | ___ | ___ | Infraestrutura |
| Suporte do provedor de pagamento | ___ | ___ | ___ | Pagamentos |

## 2. Classificação

| Gravidade | Exemplos | Avisar o cliente em |
|---|---|---|
| **Crítica** | Vazamento de dados pessoais, acesso indevido de administrador, ransomware, sistema todo fora do ar | Imediatamente (até 1 hora) |
| **Alta** | Funcionalidade crítica fora (pagamentos, login), dados alterados indevidamente, chave vazada | Até 4 horas |
| **Média** | Lentidão grave, falha parcial com contorno | Até 24 horas |
| **Baixa** | Problema sem impacto para usuários | No relatório mensal |

## 3. Primeiros passos por tipo

### Vazamento ou exposição de dados
1. Conter: desligar a funcionalidade (interruptor) ou voltar a versão.
2. Preservar evidências: não apagar logs; exportar os registros relevantes.
3. Avaliar com logs e auditoria: quais dados, quais empresas, quantos titulares, desde quando, houve acesso de fato?
4. Avisar o controlador com os fatos.
5. Apoiar o controlador na avaliação de risco e na comunicação à ANPD e aos titulares (prazo do regulamento: 3 dias úteis; confira o texto vigente).

### Conta invadida (de usuário ou administrativa)
1. Bloquear a conta e encerrar todas as sessões.
2. Trocar a senha e revisar o 2FA; se for conta sua, revisar todas as contas ligadas ao mesmo e-mail.
3. Revisar a auditoria das ações feitas pela conta.
4. Reverter alterações indevidas.

### Segredo vazado (chave de API, token, senha)
1. Revogar e gerar novo segredo no painel do serviço.
2. Atualizar a variável de ambiente e reiniciar.
3. Verificar uso indevido no painel do serviço (cobranças, mensagens, acessos).
4. Remover do lugar onde vazou (e lembrar que o histórico do Git guarda).

### Ransomware ou exclusão em massa
1. Isolar: tirar o servidor afetado da rede ou desligar acessos.
2. Não pagar resgate sem orientação jurídica e policial.
3. Restaurar a partir da cópia externa imutável em ambiente novo.
4. Trocar todas as credenciais antes de reconectar.

### Indisponibilidade
1. Seguir o [runbook](runbook.md) do sintoma.
2. Atualizar a página de status ou avisar os clientes.

## 4. Registro do incidente

| Campo | Preencher |
|---|---|
| Número / data de abertura | ___ |
| Como foi detectado | ___ |
| Horário da detecção | ___ |
| Gravidade | ___ |
| Descrição | ___ |
| Dados pessoais envolvidos? | ☐ Não ☐ Sim: quais ___ · titulares ___ · empresas ___ |
| Linha do tempo (hora → ação) | ___ |
| Contenção feita às | ___ |
| Cliente avisado às | ___ por ___ |
| Comunicação à ANPD (decisão do controlador) | ☐ Não necessária (justificativa ___) ☐ Feita em ___ |
| Causa raiz | ___ |
| Correção (commit / ação) | ___ |
| Melhorias (testes, regras, monitoramento) | ___ |
| Encerrado em | ___ |

## 5. Modelos de comunicação

### Primeiro aviso ao cliente
```text
Assunto: [Incidente] ___ (resumo curto)

Olá, ___.

Às ___ de hoje identificamos ___ (o que aconteceu, em uma frase).
O que já fizemos: ___ (contenção).
O que estamos fazendo agora: ___ (avaliação).
O que sabemos até agora: ___ (fatos, sem suposições).
O que você precisa fazer: ___ (ou "nada por enquanto").
Próxima atualização: hoje às ___.

Estou disponível em ___ (telefone).
```

### Relatório final ao cliente
```text
Resumo: ___
Linha do tempo: ___
Impacto: ___ (dados, titulares, tempo, funcionalidades)
Causa: ___
Correção: ___
O que mudamos para não acontecer de novo: ___
```

## 6. Ensaios

| Data | Cenário | Tempo até conter | O que faltou | Ajuste feito |
|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ |
