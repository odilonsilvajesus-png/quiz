# Caso 03: Voz (transcrição, reuniões, ligações, áudios)

---

## Problema típico e sinais no diagnóstico
- Reuniões sem ata; decisões e tarefas esquecidas.
- Ligações comerciais sem registro no CRM.
- Clientes mandando **áudios no WhatsApp** que a equipe precisa ouvir um a um.
- Visitas técnicas e de campo com relatórios escritos à mão (ou não escritos).
- Atendimento telefônico com fila e chamadas perdidas.

---

## Aplicações, da mais simples à mais complexa

| Aplicação | Como funciona | Complexidade |
|---|---|---|
| **Notas de reunião** | Gravar → transcrever → resumir (decisões, tarefas, pendências) | Baixa (há ferramentas prontas) |
| **Áudios do WhatsApp** | Transcrever automaticamente e tratar como texto no fluxo do atendimento | Baixa-média |
| **Ligações comerciais → CRM** | Gravar → transcrever → extrair dados (interesse, objeções, próximos passos) → CRM | Média |
| **Relatório de campo por voz** | Técnico grava áudio → IA gera relatório estruturado | Baixa-média |
| **Análise de qualidade de atendimento** | Transcrever ligações → avaliar por rubrica → painel | Média |
| **Atendente telefônico com IA** | Voz em tempo real: entende, responde, consulta sistemas, transfere | Alta |

---

## Componentes técnicos
- **Transcrição (speech-to-text):** modelos de transcrição de vários provedores (e modelos abertos como o Whisper). Critérios: qualidade em **português brasileiro** com sotaques e ruído, separação de falantes, custo por minuto.
- **Processamento do texto:** LLM para resumir, extrair e classificar (os mesmos padrões dos outros casos).
- **Síntese de voz (text-to-speech):** para respostas faladas.
- **Voz em tempo real:** APIs de conversação por voz com baixa latência, integradas à telefonia (operadoras/provedores VoIP).

---

## Exemplo: da reunião ao plano de ação
```
Gravação → Transcrição (com falantes) →
  [IA: resumo estruturado em JSON: decisões, tarefas {responsável, prazo}, pendências, riscos]
  → Validação (responsáveis existem? prazos são datas?)
  → E-mail para os participantes + tarefas no gerenciador/CRM
```

**Prompt de resumo (trecho):**
```
A partir da transcrição, extraia:
1. decisões: lista de decisões tomadas (frases curtas)
2. tarefas: {descricao, responsavel, prazo (AAAA-MM-DD ou null)}
3. pendencias: assuntos discutidos sem decisão
Use somente o que foi dito. Se o responsável ou o prazo não foram mencionados, use null.
```

---

## Cuidados
| Tema | Cuidado |
|---|---|
| **Consentimento e transparência** | Informar que a reunião/ligação está sendo gravada e transcrita. Para ligações com clientes, aviso no início |
| **LGPD** | Voz pode ser dado biométrico quando usada para identificar a pessoa; gravações têm dados pessoais. Minimização, retenção curta do áudio (guarde o texto se bastar), base legal |
| **Qualidade do áudio** | Ruído e microfones ruins derrubam a qualidade: oriente o uso de bons microfones |
| **Erros de transcrição** | Nomes próprios, produtos e siglas: forneça um glossário ao modelo de transcrição/LLM |
| **Atendente por voz** | Sempre oferecer humano; cuidado com latência; testar muito antes de colocar no ar |

---

## Métricas
- Taxa de erro de palavras em amostras (ou avaliação qualitativa)
- % de reuniões com ata enviada
- Tarefas registradas e concluídas
- Tempo economizado com áudios do WhatsApp
- Para voz em tempo real: % resolvido, latência, satisfação, transferências

---

## Laboratório
1. Implemente o fluxo **reunião → ata → tarefas** para a empresa-laboratório (ferramenta pronta ou construída).
2. Implemente a **transcrição automática de áudios** no fluxo de atendimento (Caso 01).
3. Avalie a qualidade em 20 áudios reais, com o glossário da empresa.

---

**Voltar:** [Casos de uso](README.md)
