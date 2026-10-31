# Modelo de especificação de sistema

Salve como `docs/especificacao.md` no repositório do projeto. Preencha os campos `___`. Mude a especificação **antes** do código, sempre.

**Projeto:** ___
**Cliente:** ___
**Versão do documento:** ___ · **Data:** ___
**Aprovado pelo cliente em:** ___ (link do e-mail ou mensagem de aprovação)

---

## 1. Visão geral

**Problema:** ___ (a dor, em 2 a 3 frases, com quanto custa hoje)
**Objetivo do sistema:** ___
**Critérios de sucesso (mensuráveis):**
1. ___ (ex.: "reduzir faltas de 18% para menos de 8% em 3 meses")
2. ___

**Modelo:** ☐ Sob medida para um cliente ☐ Sistema interno ☐ SaaS multi-empresa

## 2. Usuários e papéis

| Papel | Quem é | Quantos | Onde usa (computador, celular) | Familiaridade com tecnologia |
|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ |

## 3. Escopo

### 3.1 MVP (versão 1)
| Código | Funcionalidade | MoSCoW |
|---|---|---|
| H01 | ___ | Must |

### 3.2 Versões futuras
| Versão | Conteúdo |
|---|---|
| v2 | ___ |

### 3.3 Fora do escopo
- ___

## 4. Histórias de usuário e critérios de aceite

### H01 · ___
**Como** ___, **quero** ___, **para** ___.

```text
Critério 1
Dado ___
Quando ___
Então ___

Critério 2 (erro)
Dado ___
Quando ___
Então ___

Critério 3 (segurança)
Dado ___
Quando ___
Então ___
```

## 5. Regras de negócio

| Código | Regra | Origem (quem definiu) |
|---|---|---|
| RN01 | ___ | ___ |

## 6. Fluxos e telas

### 6.1 Fluxos principais
(diagramas com caminhos de erro)

### 6.2 Mapa de telas por papel
| Tela | ___ (papel 1) | ___ (papel 2) | ___ (papel 3) |
|---|---|---|---|
| ___ | ✔ / ✘ / parcial | | |

### 6.3 Wireframes
(links ou imagens)

## 7. Dados

### 7.1 Entidades principais
| Entidade | Descrição | Volume estimado |
|---|---|---|
| ___ | ___ | ___ por mês |

### 7.2 Migração de dados existentes
- Origem: ___ · Volume: ___ · Responsável pela limpeza: ___

## 8. Requisitos não funcionais

| Área | Requisito |
|---|---|
| Disponibilidade | ___ (ex.: 99,5% em horário comercial) |
| Backup e perda máxima de dados | ___ (ex.: diário, retenção 30 dias, perda máxima de 24h) |
| Recuperação | ___ (ex.: sistema de volta em até 4 horas após falha grave) |
| Desempenho | ___ (ex.: telas em até 2 segundos) |
| Volume | ___ usuários simultâneos, ___ registros/mês |
| Dispositivos | ___ |
| Acessibilidade | ___ |

## 9. Segurança e privacidade

### 9.1 Dados pessoais tratados
| Dado | De quem | Finalidade | Sensível? | Base legal (a confirmar) |
|---|---|---|---|---|
| ___ | ___ | ___ | Sim/Não | ___ |

### 9.2 Controles
- [ ] Login com senha forte; 2FA para ___
- [ ] Permissões por papel conforme o mapa de telas
- [ ] Isolamento entre empresas (se multi-empresa)
- [ ] Bloqueio imediato de usuário desligado
- [ ] Auditoria de: ___
- [ ] Backup: ___ · Restauração testada a cada ___
- [ ] Hospedagem em ___ (região), criptografia em repouso e em trânsito

### 9.3 Retenção e exclusão
- ___ (prazo e regra; marcar "a confirmar com contador/advogado")

## 10. Integrações

| Serviço | Para quê | O que acontece se ele falhar |
|---|---|---|
| ___ | ___ | ___ |

## 11. Perguntas em aberto

| # | Pergunta | Para quem | Impacto se não responder | Status |
|---|---|---|---|---|
| P1 | ___ | ___ | ___ | aberta |

---

## Checklist antes de enviar ao cliente

- [ ] Toda história tem critérios de aceite, incluindo erro e segurança.
- [ ] Toda regra de negócio está numerada e tem origem.
- [ ] Todo fluxo tem caminho de erro.
- [ ] Todo dado pessoal tem finalidade.
- [ ] Os requisitos não funcionais foram perguntados ao cliente, não inventados.
- [ ] O Claude revisou o documento e os problemas apontados foram resolvidos ou viraram perguntas em aberto.
