# Modelo de CLAUDE.md

Copie para a raiz do projeto com o nome `CLAUDE.md` e preencha os campos `___`. Revise a cada módulo: toda vez que o Claude errar algo que deveria saber, acrescente uma regra.

```markdown
# ___ (nome do projeto)

## O que é
___ (uma frase: o que o sistema faz e para quem)
Modelo: ___ (SaaS multi-empresa / sistema sob medida para um cliente / sistema interno)

## Stack
- Next.js (App Router) + TypeScript em modo estrito
- PostgreSQL via Prisma
- Validação: Zod (sempre no servidor)
- Login: Better Auth
- Pagamentos: ___ (Asaas / Mercado Pago / Stripe), atrás da interface em src/server/pagamentos
- Testes: Vitest (unitários e integração), Playwright (ponta a ponta)
- Hospedagem: ___

## Comandos
- `npm run dev`: roda local
- `npm test`: testes unitários e de integração
- `npm run test:e2e`: testes de ponta a ponta
- `npm run lint`: verificação de estilo
- `npx tsc --noEmit`: verificação de tipos
- `npx prisma migrate dev --name <nome>`: nova migration

## Estrutura
- `src/app/`: telas e rotas
- `src/components/`: componentes de interface
- `src/server/`: tudo que só roda no servidor (regras de negócio, acesso ao banco)
- `src/lib/`: utilitários gerais
- `docs/`: especificação, ADRs, diário de decisões
- `tests/e2e/`: testes de ponta a ponta

## Regras inegociáveis de segurança
1. Toda verificação de login e permissão acontece no servidor.
2. Toda consulta a dados de negócio filtra por `empresaId` obtido da sessão. Nunca aceite empresaId vindo do frontend.
3. Todo dado de entrada é validado com Zod no servidor antes de qualquer uso.
4. Nunca escreva segredos no código. Use variáveis de ambiente sem o prefixo NEXT_PUBLIC_. Toda variável nova vai para o `.env.example` sem valor.
5. Nunca registre em log senhas, tokens, documentos (CPF/CNPJ), dados de cartão ou conteúdo de mensagens.
6. Nunca monte SQL concatenando texto. Use o Prisma ou consultas parametrizadas.
7. Webhooks externos só são processados após verificar a assinatura ou token de origem, e de forma idempotente.
8. Toda ação sensível (alterar valores, permissões, excluir dados) grava um registro de auditoria.

## Regras de negócio e dados
- Dinheiro é sempre inteiro em centavos (`valorCentavos`). Nunca use float.
- Datas e horas são gravadas em UTC. Datas sem horário (vencimentos) usam o tipo date. Exibição no fuso America/Sao_Paulo.
- Toda tabela de negócio tem `empresaId` obrigatório, com índice.
- Exclusão de registros de negócio é lógica (`excluidoEm`), salvo pedido explícito.
- Formatação de moeda: `src/lib/moeda.ts`. Datas: `src/lib/datas.ts`.
- ___ (regras específicas deste projeto)

## Forma de trabalhar
- Tarefas que mexem em mais de um arquivo começam com um plano, que eu aprovo antes da execução.
- Faça perguntas quando uma regra de negócio não estiver clara. Não adivinhe.
- Passos pequenos: um passo do plano por vez, com testes.
- Toda funcionalidade nova vem com testes, incluindo casos de erro, isolamento entre empresas e permissão.
- Nunca altere, desative ou pule um teste para fazê-lo passar sem minha aprovação explícita.
- Não instale bibliotecas novas sem me perguntar e justificar.
- Não altere o esquema do banco, a autenticação ou a configuração de deploy sem que isso esteja no plano aprovado.
- Antes de dizer que terminou, rode `npm test`, `npm run lint` e `npx tsc --noEmit` e mostre o resultado.
- Ao usar bibliotecas e serviços externos, consulte a documentação oficial atual.

## Lições aprendidas
- ___ (data) ___ (o erro que aconteceu e a regra que o evita)
```

## Checklist antes de usar

- [ ] O nome, a descrição e o modelo do projeto estão preenchidos.
- [ ] Os comandos listados existem no `package.json`.
- [ ] As regras de negócio específicas do cliente estão escritas.
- [ ] Pedi ao Claude para resumir as regras e ele entendeu as mais importantes.
