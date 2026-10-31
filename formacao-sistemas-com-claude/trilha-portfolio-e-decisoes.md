# Trilha contínua: Portfólio e diário de decisões

**Do início ao fim da formação · cerca de 30 minutos por semana**

## Por que esta trilha existe

Dois problemas que você vai enfrentar como quem vende sistemas:

1. **"Por que eu fiz assim mesmo?"** Seis meses depois, o cliente pede uma mudança e você não lembra por que escolheu aquela hospedagem, aquele provedor de pagamento, aquela regra. O Claude também não lembra: cada sessão começa do zero.
2. **"Como eu provo que sei fazer?"** O cliente quer ver o que você já fez. Mostrar "um sistema" não basta; ele quer entender o problema, a solução e o resultado.

Esta trilha resolve os dois com um único hábito: **registrar decisões enquanto trabalha**, e transformar esse registro em casos de portfólio.

Ao final da trilha você terá:
1. Um diário de decisões com o raciocínio de cada escolha importante da formação.
2. Pelo menos 4 casos de portfólio prontos para mostrar a clientes.
3. Uma página de portfólio publicada.

---

## O diário de decisões

Um arquivo (`docs/diario.md` no repositório do Gestor, ou um caderno digital) com entradas curtas. Formato:

```markdown
## 2026-11-14 · Escolha do provedor de pagamento

**Contexto:** o Gestor precisa cobrar assinatura mensal de empresas brasileiras,
com Pix e boleto.
**Opções consideradas:** Asaas, Mercado Pago, Stripe.
**Decisão:** Asaas como principal, com a integração isolada atrás de uma interface
para poder trocar.
**Por quê:** Pix e boleto nativos, assinaturas recorrentes, painel em português.
**O que pode dar errado:** taxa mudar; instabilidade do provedor.
**Como eu saberia que errei:** taxa de falha de cobrança acima de 5% ou clientes
pedindo cartão internacional.
```

Decisões grandes de arquitetura viram **ADRs** formais (Módulo 6, [modelo](templates/adr.md)). O diário é mais leve: cabe tudo, inclusive aprendizados ("hoje descobri que o Claude não filtra por empresa quando eu não peço").

### O que registrar

| Registre sempre | Não precisa registrar |
|---|---|
| Escolha de tecnologia, hospedagem, provedor | Nome de variável |
| Regra de negócio decidida com o cliente | Ajustes visuais pequenos |
| Incidente ou bug sério e como foi resolvido | Correções de digitação |
| Algo que o Claude errou e a regra criada no CLAUDE.md | |
| Trocas: "abri mão de X para ganhar Y" | |

> 💡 **Use o Claude para escrever o diário.** No fim de uma sessão: *"resuma em formato de entrada de diário as decisões que tomamos hoje, com contexto, opções, decisão e porquê"*. Você revisa e salva.

---

## O portfólio

Um caso de portfólio conta uma história que o cliente reconhece. Estrutura:

```markdown
# [Nome do projeto]: [resultado em uma frase]

**Cliente / contexto:** distribuidora de autopeças com 12 funcionários.
**Problema:** estoque controlado em planilha, vendas perdidas por falta de
produto, 3 horas por dia conferindo pedidos.
**Solução:** ERP web com estoque em tempo real, pedidos pelo celular e alerta de
reposição.
**Como garantimos a segurança:** cada vendedor vê só os próprios clientes,
backup diário testado, acesso com 2FA para o financeiro.
**Resultado:** [números, se o cliente autorizar: horas economizadas, vendas
recuperadas].
**Tecnologia:** Next.js, PostgreSQL, hospedado em [região].
**Imagens:** 2 a 3 capturas de tela com dados fictícios.
```

> ⚠️ **Nunca mostre dados reais de clientes no portfólio.** Use capturas com dados inventados, e peça autorização por escrito para citar o nome do cliente. Isso é LGPD e é profissionalismo: quem vê o portfólio entende que você cuida dos dados.

---

## Marcos por fase

### Fase 1
- [ ] Diário criado, com pelo menos 5 entradas (inclusive a tarefa de campo do M1).
- [ ] **Caso 1:** a calculadora de preço (simples, mas mostra o ciclo).

### Fase 2
- [ ] Entradas para cada decisão de especificação, modelagem e stack do Gestor.
- [ ] **Caso 2:** a especificação de um cliente real ou da sua operação (sem dados sensíveis), mostrando como você transforma uma conversa em projeto.

### Fase 3
- [ ] Entradas para pagamentos, multi-tenant e integrações.
- [ ] **Caso 3:** o Gestor, com capturas de tela e um vídeo curto (2 minutos) mostrando login, cadastro, cobrança e WhatsApp.

### Fase 4
- [ ] Entradas para hospedagem, segurança e o teste de restauração de backup.
- [ ] O caso do Gestor ganha a seção "como garantimos a segurança e a disponibilidade".

### Fase 5 e projeto final
- [ ] **Caso 4:** o projeto final, com problema, solução, segurança, resultado.
- [ ] Página de portfólio publicada (pode ser um site estático, como a calculadora do M1), com os 4 casos e uma forma de contato.

---

## O ritual semanal (30 minutos)

1. Releia as entradas da semana e complete o que faltar.
2. Pergunte: "alguma decisão desta semana merece um ADR formal?".
3. Pergunte: "alguma lição desta semana merece virar regra no CLAUDE.md?".
4. Uma vez por fase: atualize o portfólio.
