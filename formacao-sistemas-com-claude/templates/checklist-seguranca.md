# Checklist de segurança

Use antes de entregar um sistema, antes de abrir um SaaS para vendas e a cada 6 meses. **Só marque um item com evidência**: o teste que prova, a configuração, o relatório.

**Sistema:** ___ · **Versão:** ___ · **Data:** ___ · **Responsável:** ___

## 1. Autenticação
- [ ] Biblioteca madura de login (sem implementação própria de senhas e sessões). Evidência: ___
- [ ] Hash de senha com algoritmo próprio para senhas (Argon2id, scrypt ou bcrypt). Evidência: ___
- [ ] Senha com comprimento mínimo e recusa de senhas comuns. Teste: ___
- [ ] Mensagens genéricas no login e na recuperação. Teste: ___
- [ ] Limite de tentativas no login e na recuperação. Teste: ___
- [ ] 2FA obrigatório para ___ (papéis). Evidência: ___
- [ ] Recuperação de senha: token aleatório, curto, uso único, guardado como hash; encerra sessões; avisa por e-mail. Teste: ___
- [ ] Cookie de sessão `HttpOnly`, `Secure`, `SameSite`; expiração por inatividade. Evidência: ___
- [ ] Sessões revogáveis (logout e desligamento com efeito imediato). Teste: ___

## 2. Autorização e isolamento
- [ ] Toda rota e Server Action verifica sessão e permissão no servidor. Teste (401 em todas as rotas): ___
- [ ] Matriz de permissões central com teste gerado por papel e rota. Teste: ___
- [ ] `empresaId` sempre da sessão; escopo automático no acesso ao banco. Evidência: ___
- [ ] RLS ativa e forçada em todas as tabelas de negócio (se SaaS). Teste (tabela sem RLS): ___
- [ ] Testes de isolamento: rotas, listas, criação, arquivos, tarefas, cache, tempo real. Teste: ___
- [ ] Recurso de outra empresa responde 404. Teste: ___
- [ ] Convites sem papel maior que o de quem convida; empresa nunca sem dono. Teste: ___
- [ ] Acesso de suporte com consentimento, prazo e registro (se existir). Evidência: ___

## 3. Entrada de dados e injeções
- [ ] Toda entrada validada com schema estrito no servidor. Evidência: ___
- [ ] Chaves estrangeiras recebidas conferidas com `empresaId`. Teste: ___
- [ ] Nenhum SQL montado com texto do usuário (`$queryRawUnsafe` proibido). Busca no código: ___
- [ ] Nenhum `dangerouslySetInnerHTML` com conteúdo de usuário sem sanitização. Busca: ___
- [ ] URLs de usuários validadas (`https://`). Teste: ___
- [ ] Exportações protegidas contra injeção em planilhas. Teste: ___
- [ ] Nenhum comando do sistema montado com texto do usuário. Busca: ___
- [ ] IA: dados mínimos, saída validada, sem ações sensíveis automáticas. Teste: ___

## 4. Arquivos
- [ ] Tamanho máximo e lista de tipos permitidos, verificando o tipo real. Teste: ___
- [ ] SVG e HTML recusados (ou tratados). Teste: ___
- [ ] Nome gerado pelo sistema; armazenamento privado com caminho por empresa. Evidência: ___
- [ ] Download por rota que confere sessão e empresa, ou link temporário. Teste: ___

## 5. Segredos e criptografia
- [ ] Nenhum segredo no repositório, no histórico ou em imagens. Evidência (secret scanning): ___
- [ ] Segredos por ambiente; produção fora do computador de desenvolvimento. Evidência: ___
- [ ] Variáveis validadas na inicialização, com trava de coerência. Teste: ___
- [ ] Segredos de clientes (tokens, certificados, chaves) criptografados no banco. Evidência: ___
- [ ] HTTPS em tudo, HSTS ativo. Relatório SSL Labs: ___

## 6. Integrações e webhooks
- [ ] Webhooks verificam a origem (assinatura ou token) com comparação de tempo constante. Teste: ___
- [ ] Webhooks idempotentes (id do evento único). Teste: ___
- [ ] Eventos financeiros reconsultam o provedor antes de agir. Teste: ___
- [ ] Tempo limite em todas as chamadas externas. Evidência: ___
- [ ] Número de cartão nunca passa pelo servidor. Evidência: ___

## 7. Navegador
- [ ] Cabeçalhos: HSTS, CSP, nosniff, Referrer-Policy, frame-ancestors, Permissions-Policy. Relatório Observatory: ___
- [ ] CORS fechado (ou só domínios explícitos). Teste: ___
- [ ] Componentes de cliente recebem só os campos necessários. Revisão: ___
- [ ] Nada sensível em `localStorage` nem em URLs. Revisão: ___

## 8. Limites e disponibilidade
- [ ] Limites de requisições em login, cadastro, busca, exportação, IA. Teste: ___
- [ ] Toda lista paginada com máximo. Evidência: ___
- [ ] Proteção de borda (CDN/anti-DDoS) se o SLA exigir. Evidência: ___

## 9. Dependências e pipeline
- [ ] Dependências mínimas e justificadas. Lista: ___
- [ ] `package-lock.json` versionado; CI usa `npm ci`. Evidência: ___
- [ ] `npm audit` sem vulnerabilidades altas; Dependabot ativo. Evidência: ___
- [ ] Ações de CI com versão fixada; permissões mínimas; segredos de produção com aprovação. Evidência: ___

## 10. Servidor e infraestrutura
- [ ] Banco sem acesso público. Evidência: ___
- [ ] (VPS) SSH só com chave, sem root, firewall, atualizações automáticas, fail2ban. Evidência: ___
- [ ] Contêineres sem root; só o proxy exposto. Evidência: ___
- [ ] 2FA em: GitHub, hospedagem, DNS, registrador, provedores de pagamento e e-mail. Evidência: ___

## 11. Dados pessoais (LGPD)
- [ ] Inventário de dados pessoais atualizado. Documento: ___
- [ ] Dados sensíveis identificados, com acesso restrito e registrado. Evidência: ___
- [ ] Logs sem senhas, tokens, documentos, cartões, mensagens ou dados de saúde. Teste: ___
- [ ] Procedimento de atendimento a titulares (acesso, correção, eliminação). Documento: ___
- [ ] Fornecedores que tratam dados listados. Documento: ___

## 12. Recuperação e resposta
- [ ] Backup automático, cópia fora do provedor principal. Evidência: ___
- [ ] Restauração testada em: ___ (data). Tempo medido: ___
- [ ] Auditoria de ações sensíveis, só de inserção. Teste: ___
- [ ] Monitoramento e alertas (disponibilidade, erros, falhas de login). Evidência: ___
- [ ] Plano de resposta a incidente escrito e ensaiado. Documento: ___

## Achados

| # | Achado | Gravidade (crítica/alta/média/baixa) | Status | Correção (commit) |
|---|---|---|---|---|
| 1 | ___ | ___ | ___ | ___ |

## Riscos aceitos

| Risco | Justificativa | Aceito por | Revisar em |
|---|---|---|---|
| ___ | ___ | ___ | ___ |
