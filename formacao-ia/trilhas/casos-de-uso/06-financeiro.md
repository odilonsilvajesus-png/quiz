# Caso 06: Financeiro (contas, cobrança, conciliação)

---

## Problema típico e sinais no diagnóstico
- Boletos e notas chegando por vários canais; lançamento manual.
- Pagamentos atrasados por esquecimento (juros e multas).
- Cobrança de clientes feita "quando sobra tempo".
- Conciliação bancária manual e demorada.
- Classificação de despesas inconsistente (atrapalha a contabilidade e a análise).
- Dono sem visão clara de fluxo de caixa.

---

## Aplicações

| Aplicação | Padrão | Observação |
|---|---|---|
| **Contas a pagar** | Extrair + Verificar + Acompanhar | Ver o [Caso 02](02-documentos.md); agenda de vencimentos e alertas |
| **Cobrança escalonada** | Acompanhar + Redigir + Classificar | Lembrete antes do vencimento → aviso no dia → cobrança gradual → negociação humana |
| **Conciliação assistida** | Verificar | Cruzar extrato × lançamentos; a IA sugere correspondências difíceis (descrições diferentes) |
| **Classificação de despesas** | Classificar | Plano de contas da empresa + exemplos; revisão das incertas |
| **Fluxo de caixa explicado** | Analisar + Redigir | Números calculados em código + explicação e alertas ([Caso 04](04-dados-e-relatorios.md)) |
| **Atendimento financeiro** | Responder | Segunda via, status de pagamento, condições (com verificação de identidade) |

---

## Exemplo: régua de cobrança com IA
```
D-3: lembrete amigável (template) com link/linha digitável
D0:  aviso de vencimento
D+3: cobrança 1 (tom cordial)
D+10: cobrança 2 (mais firme) + oferta de contato
Resposta do cliente → classificação:
   "já paguei"        → verificar comprovante/extrato → atualizar
   "vou pagar dia X"  → registrar promessa → lembrete no dia
   "não tenho como"   → encaminhar a humano para negociação
   contestação        → humano
```

**Regras em código** (nunca só no prompt): valores, juros e multas calculados pelo sistema; descontos e acordos só com aprovação humana; horários e frequência de contato respeitando a lei e o bom senso.

---

## Cuidados
| Tema | Cuidado |
|---|---|
| **Cobrança** | Código de Defesa do Consumidor: cobrança sem constrangimento, ameaça ou exposição (art. 42); tom respeitoso; horários adequados |
| **Fraude** | Validar dados bancários de fornecedores; alerta para mudanças; nunca pagar automaticamente sem conferência |
| **Pagamentos** | IA **prepara**, humano **aprova** pagamentos |
| **LGPD** | Dados financeiros: acesso restrito, minimização, logs sem dados completos |
| **Contabilidade** | Alinhar classificações com o contador da empresa |

---

## Métricas
- Juros e multas pagos (antes × depois)
- Inadimplência e prazo médio de recebimento
- Tempo da equipe financeira por tarefa
- % de lançamentos/conciliações automáticos sem correção

---

## Laboratório
Implemente **contas a pagar** (extração + agenda + alertas) ou a **régua de cobrança** para a empresa-laboratório, com regras em código e aprovação humana nas ações sensíveis. Meça por 60 dias.

---

**Voltar:** [Casos de uso](README.md)
