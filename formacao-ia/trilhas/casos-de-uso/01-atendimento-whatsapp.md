# Caso 01: Atendimento e vendas pelo WhatsApp

> No Brasil, este é o caso de uso **número 1** em PMEs. O WhatsApp é o principal canal de relacionamento de grande parte das empresas.

---

## Problema típico e sinais no diagnóstico
- Demora na primeira resposta (dezenas de minutos ou horas).
- Sem atendimento fora do horário comercial.
- Perguntas repetitivas (preço, horário, endereço, prazo, estoque).
- Orçamentos sem follow-up.
- Conversas espalhadas em celulares pessoais; histórico perdido quando o funcionário sai.
- Picos de demanda que sobrecarregam a equipe.

---

## Fundamentos do canal

### WhatsApp Business (aplicativo) × WhatsApp Business Platform (API)
| | App WhatsApp Business | WhatsApp Business Platform (API) |
|---|---|---|
| Uso | Celular/computador, manual | Integração com sistemas e automação |
| Automação | Respostas rápidas e mensagens de ausência simples | Bots, IA, integração com CRM/ERP, vários atendentes |
| Acesso | Gratuito | Via Meta (Cloud API) diretamente ou por um provedor parceiro (BSP) |
| Custo | Gratuito | Cobrança da Meta por mensagem/conversa conforme categoria (marketing, utilidade, autenticação, serviço), mais o provedor, se houver |

**Para automação com IA, use a API oficial.** Soluções não oficiais que "automatizam o app" violam os termos do WhatsApp e podem levar ao **banimento do número**.

### Regras importantes da plataforma (verifique a política vigente da Meta)
- **Janela de atendimento:** depois que o cliente envia uma mensagem, a empresa pode responder livremente por um período (historicamente 24 horas). Fora dessa janela, só com **mensagens de modelo (templates) aprovadas** pela Meta.
- **Templates:** mensagens proativas (follow-up, lembretes, cobranças, marketing) precisam de modelo aprovado e categorizado.
- **Consentimento (opt-in):** a empresa deve ter permissão do cliente para enviar mensagens proativas.
- **Política para IA:** a Meta restringe o uso da API para chatbots de IA de uso geral. Assistentes focados no atendimento do próprio negócio são o uso pretendido. Confira as políticas atuais antes de projetar.
- **Preços e regras mudam com frequência:** consulte a documentação oficial da Meta para desenvolvedores.

---

## Arquitetura de referência

```
Cliente ⇄ WhatsApp ──webhook──► [Servidor]
                                   │
                    ┌──────────────┼───────────────────────────┐
                    │  1. Identificar cliente (telefone → CRM)  │
                    │  2. Carregar histórico recente            │
                    │  3. Classificar intenção                  │
                    │     ├─ simples (FAQ) → RAG → responde     │
                    │     ├─ orçamento → agente com ferramentas │
                    │     │   (buscar_produto, estoque, frete)  │
                    │     └─ sensível (reclamação, crédito,     │
                    │         desconto, pedido de humano)       │
                    │         → transfere para atendente        │
                    │  4. Validar resposta (preços × sistema)   │
                    │  5. Enviar pela API                       │
                    │  6. Registrar (CRM, logs, métricas)       │
                    │  7. Agendar follow-up (templates)         │
                    └───────────────────────────────────────────┘
                                   │
                    Painel de atendimento humano (fila, histórico, assumir conversa)
```

### Componentes
- **Plataforma de atendimento** com caixa compartilhada para humanos (pronta ou construída). Muitas plataformas brasileiras de atendimento já integram a API do WhatsApp e permitem conectar um bot próprio. **Avalie usar uma plataforma pronta para a parte humana e construir só a inteligência.**
- **Servidor** (webhook) com a lógica de IA.
- **Base de conhecimento** (RAG ou contexto).
- **Ferramentas** de consulta (estoque, preço, pedido, agenda).
- **Banco** de conversas e clientes.
- **Áudios:** transcrição automática (muitos clientes mandam áudio). Veja o [Caso 03](03-voz.md).

---

## Passo a passo de implementação

1. **Diagnóstico do atendimento:** exporte e analise uma amostra de conversas (anonimizada). Classifique as intenções e meça a frequência de cada uma. Normalmente, algumas poucas intenções respondem pela maior parte do volume.
2. **Defina o escopo da IA:** quais intenções ela resolve sozinha, quais prepara para um humano, quais transfere direto.
3. **Monte a base de conhecimento** (FAQ, políticas, produtos) a partir das conversas reais.
4. **Escolha a infraestrutura:** API oficial (direta ou via provedor) + plataforma de atendimento humano.
5. **Construa** o fluxo (classificação → caminhos) com agente de código.
6. **Avalie** com 100+ mensagens reais (eval por intenção, Módulo 4.1).
7. **Piloto em sombra:** a IA sugere e o humano envia.
8. **Assistido → autônomo por exceção**, por intenção (comece pelas mais seguras).
9. **Follow-up** com templates aprovados.
10. **Monitore** e melhore semanalmente.

---

## Cuidados

| Tema | Cuidado |
|---|---|
| **Transparência** | Informar que é uma assistente virtual; oferecer humano a qualquer momento ("digite ATENDENTE") |
| **Transferência** | Passar o contexto ao humano (o cliente não deve repetir tudo) |
| **Horário** | Fora do horário, deixar claro quando um humano retorna |
| **Preços e estoque** | Sempre da ferramenta/sistema, validados em código; "sujeito a confirmação" se o dado não for em tempo real |
| **LGPD** | Base legal (execução de contrato/procedimentos preliminares), minimização, retenção, política de privacidade atualizada |
| **CDC** | Informações corretas; ofertas cumpridas |
| **Tom** | Adequado à marca e à região; mensagens curtas |
| **Equipe** | Atendentes como "especialistas" e supervisores, não concorrentes da IA |

---

## Métricas
- Tempo da primeira resposta
- % de conversas resolvidas pela IA sem transferência
- % de transferências corretas (casos que deveriam mesmo ir para um humano)
- Conversão (orçamento → venda)
- Satisfação (pesquisa curta ao final)
- Volume fora do horário atendido
- Custo por conversa (IA + Meta + plataforma)

---

## Laboratório
1. Analise 200 conversas reais (anonimizadas) e monte a tabela de intenções e frequências.
2. Defina o escopo da IA por intenção.
3. Construa a base de conhecimento e o fluxo de classificação → resposta → transferência.
4. Avalie com 100 mensagens.
5. Rode em sombra por 2 semanas e compare as respostas da IA com as humanas.
6. Calcule o business case real (Módulo 2.5).

---

**Voltar:** [Casos de uso](README.md)
