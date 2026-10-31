# Modelo de ADR (registro de decisão de arquitetura)

Salve em `docs/decisoes/NNNN-titulo-curto.md` (ex.: `0004-asaas-como-provedor-principal.md`). Um arquivo por decisão. Nunca apague: para mudar uma decisão, crie um ADR novo e marque o antigo como "substituído por NNNN".

```markdown
# ADR ___: ___ (título da decisão, no afirmativo)

**Status:** ☐ proposto ☐ aceito ☐ substituído por ADR ___ ☐ descontinuado
**Data:** ___
**Decidido por:** ___ · **Aprovado pelo cliente:** ☐ sim ☐ não se aplica

## Contexto
___ (qual problema ou necessidade levou a esta decisão; números relevantes:
usuários, volume, orçamento, prazo, exigências do cliente ou da lei)

## Opções consideradas
1. ___: prós ___ / contras ___
2. ___: prós ___ / contras ___
3. ___: prós ___ / contras ___

## Decisão
___ (o que foi escolhido, em uma ou duas frases)

## Consequências
Positivas:
+ ___
+ ___

Negativas e riscos:
- ___
- ___

Mitigação dos riscos:
- ___

## Impacto em segurança e dados pessoais
___ (a decisão muda onde os dados ficam, quem acessa, quais fornecedores tratam
dados? Algo a informar ao cliente ou registrar para a LGPD?)

## Custo
___ (impacto na fatura mensal e no tempo de operação; data da consulta aos preços)

## Como saberemos que erramos
___ (sinal mensurável que faria rever esta decisão)
```

## Checklist

- [ ] Pelo menos duas opções reais foram consideradas.
- [ ] As consequências negativas estão escritas com honestidade.
- [ ] O impacto em segurança e dados pessoais foi avaliado.
- [ ] Existe um sinal mensurável para rever a decisão.
- [ ] O ADR foi salvo em `docs/decisoes/` e commitado.
