# Projeto Integrador 3: Três soluções funcionando

**Nível:** 3, Construtor
**Pré-requisitos:** Módulos 3.1 a 3.7
**Esforço estimado:** 40 a 60 horas

---

## O desafio

Construir as **3 soluções prioritárias** identificadas no Diagnóstico Estrutural (Projeto Integrador 2), funcionando com dados reais (ou realistas) e prontas para um piloto.

> Neste projeto você ainda não precisa colocar tudo em produção 24/7. Isso é o Nível 4. Aqui o objetivo é **construir certo**: arquitetura adequada, código de qualidade, testado e demonstrável.

## Requisitos por solução

Para cada uma das 3 soluções:

### 1. Especificação
- Usando o template [`templates/especificacao-solucao.md`](../templates/especificacao-solucao.md).
- Com critérios de aceite verificáveis.

### 2. Arquitetura
- Diagrama (componentes, fronteiras, humanos, dados sensíveis).
- Padrões usados e justificativa (simplicidade suficiente).
- Pelo menos 2 ADRs.

### 3. Implementação
- Construída com agente de código, seguindo as 4 fases.
- Repositório com `CLAUDE.md` (ou equivalente), README e histórico de commits.
- Segredos fora do código; dados de teste anonimizados.

### 4. Testes
- Testes automatizados das partes críticas.
- Conjunto de pelo menos 20 casos de teste realistas, com taxa de acerto medida.
- Casos de exceção e de abuso cobertos.

### 5. Demonstração
- Vídeo de 3 a 5 minutos mostrando a solução funcionando (vira conteúdo de portfólio e de palestra).
- Demonstração ao vivo para o cliente da empresa-laboratório.

## Requisito de diversidade

As 3 soluções devem, juntas, cobrir **pelo menos 3 padrões diferentes** de arquitetura (Módulo 3.3), por exemplo:
- um **extrator/classificador** ou **workflow**;
- um **RAG** ou **assistente com MCP/skill**;
- um **agente** ou integração **sem API**.

## Critérios de aprovação

| Critério | Requisito mínimo |
|---|---|
| Funciona | As 3 soluções rodam com dados realistas |
| Qualidade medida | Taxa de acerto calculada em ≥ 20 casos por solução |
| Arquitetura | Justificada; nenhum agente onde um workflow resolveria |
| Segurança | Segredos protegidos, menor privilégio, ações de risco com aprovação |
| Documentação | Qualquer pessoa técnica consegue rodar a partir do README |
| Validação | Cliente viu a demonstração e aprovou o piloto |

## Autoavaliação de prontidão para o Nível 4
- [ ] Construo uma automação simples sozinho, com agente de código, em 1 a 2 dias.
- [ ] Sei escolher o padrão de arquitetura e justificar.
- [ ] Sei usar saída estruturada, ferramentas, RAG e MCP.
- [ ] Reviso o código do agente com o checklist e encontro problemas.
- [ ] Tenho pelo menos 3 repositórios no GitHub com projetos documentados.

---

**Próximo:** [Nível 4: Módulo 4.1, Avaliação e testes](../nivel-4-implementador/4.1-avaliacao-e-testes.md)
