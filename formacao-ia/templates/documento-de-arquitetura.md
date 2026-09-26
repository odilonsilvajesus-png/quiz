# Documento de arquitetura: [nome da solução]

**Empresa:** ___ · **Autor:** ___ · **Versão:** ___ · **Data:** ___

---

## 1. Contexto e objetivo
- Problema de negócio: ___
- Objetivo mensurável: ___
- Usuários: ___ (clientes externos / equipe interna)
- Volume esperado: ___ interações por dia/mês

## 2. Requisitos
**Funcionais (o que a solução faz):**
1. ___
2. ___

**Não funcionais:**
| Requisito | Meta |
|---|---|
| Latência | ex.: resposta em até 10s |
| Disponibilidade | ex.: 24/7; contingência se a IA falhar |
| Custo | ex.: até R$ ___/mês |
| Segurança e privacidade | ex.: sem dados sensíveis; logs por 90 dias |
| Manutenção | ex.: base atualizada mensalmente por ___ |

## 3. Arquitetura em 6 camadas

```
[1. CANAIS]        ___
      ↓
[2. ORQUESTRAÇÃO]  ___
      ↓
[3. INTELIGÊNCIA]  modelo principal: ___ · modelo de triagem: ___
      ↓
[4. CONHECIMENTO]  ___ (prompt / RAG / consulta a sistemas)
      ↓
[5. SISTEMAS]      ___ (via API / MCP)
      ↓
[6. GOVERNANÇA]    logs: ___ · aprovação humana: ___ · teto de custo: ___
```

[Opcional: diagrama visual (Mermaid, Whimsical, draw.io)]

## 4. Ferramentas do agente (se houver)
| Ferramenta | Descrição | Parâmetros | Permissão | Exige confirmação humana? |
|---|---|---|---|---|
| | | | leitura / escrita | |

## 5. Decisões de arquitetura
| Decisão | Opções consideradas | Escolha | Justificativa |
|---|---|---|---|
| Plataforma | | | |
| Modelo | | | |
| Conhecimento | | | |
| Hospedagem | | | |
| Nível de autonomia | | | |

## 6. Fluxos principais
1. **Fluxo feliz:** ___
2. **Fluxo de exceção** (não sabe, erro de sistema): ___
3. **Encaminhamento para humano:** ___

## 7. Riscos e mitigação
| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Alucinação | | | |
| Prompt injection | | | |
| Indisponibilidade da API | | | |
| Vazamento de dados | | | |
| Custo acima do previsto | | | |

## 8. Estimativa de custos
| Item | Cálculo | Mensal |
|---|---|---|
| API de IA | ___ execuções × ___ tokens × preço | |
| Plataformas | | |
| Mensageria | | |
| Manutenção | | |
| **Total** | | |

## 9. Plano de testes
- Casos de teste: ___ (link)
- Critérios de aprovação: ___
- Piloto: ___ (modo sombra → parcial → pleno)

## 10. Operação
- Monitoramento: ___
- Responsáveis: ___
- Contingência: ___
- Revisão periódica: ___
