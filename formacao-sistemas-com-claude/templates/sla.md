# Modelo de SLA (acordo de nível de serviço)

Anexo do contrato de manutenção. Adapte para cada plano. **Valide a redação final com um advogado.**

**Sistema:** ___ · **Cliente:** ___ · **Plano:** ___ · **Vigência:** ___

## 1. Horário de atendimento

- Dias e horário em que os prazos correm: ___ (ex.: segunda a sexta, 8h às 18h, exceto feriados nacionais).
- Fora desse horário: ___ (ex.: alertas críticos são monitorados, mas os prazos começam no próximo período de atendimento; ou plantão para gravidade 1).

## 2. Canais

| Canal | Uso | Endereço / número |
|---|---|---|
| ___ | Chamados de gravidade 3 e 4 | ___ |
| ___ | Gravidade 2 | ___ |
| ___ | Somente gravidade 1 | ___ |

Todo chamado recebe um número de registro.

## 3. Níveis de gravidade

| Gravidade | Definição | Exemplos neste sistema |
|---|---|---|
| **1 · Crítica** | Sistema indisponível ou funcionalidade essencial parada para todos os usuários; suspeita de incidente de segurança | ___ |
| **2 · Alta** | Funcionalidade importante com falha, sem contorno razoável | ___ |
| **3 · Média** | Falha com contorno disponível, ou que afeta poucos usuários | ___ |
| **4 · Baixa** | Dúvidas, ajustes visuais, problemas cosméticos | ___ |

O cliente informa a gravidade; o prestador confirma com base nesta tabela e informa se houver reclassificação, com justificativa.

## 4. Prazos

| Gravidade | Tempo de resposta | Tempo de solução ou contorno |
|---|---|---|
| 1 · Crítica | ___ | ___ |
| 2 · Alta | ___ | ___ |
| 3 · Média | ___ | ___ |
| 4 · Baixa | ___ | ___ |

- **Resposta:** confirmação de recebimento com análise inicial.
- **Contorno:** medida que restaura a operação enquanto a correção definitiva é feita.
- Prazos contados dentro do horário de atendimento, salvo indicação em contrário.

## 5. Disponibilidade

- **Meta mensal:** ___% (no horário de ___ / 24x7).
- **Medição:** monitoramento externo a cada ___ minutos da verificação de saúde do sistema; o sistema é considerado indisponível quando ___ verificações seguidas falham.
- **Relatório:** disponibilidade informada no relatório mensal.

## 6. Exclusões

Não contam como indisponibilidade nem descumprimento de prazo:
- Manutenções programadas avisadas com pelo menos ___ de antecedência, limitadas a ___ horas por mês.
- Falhas causadas pelo cliente ou por terceiros contratados por ele (alteração de configuração, uso indevido, dados importados incorretamente, internet, computadores ou dispositivos do cliente).
- Indisponibilidade de serviços de terceiros contratados diretamente pelo cliente.
- ___ (indisponibilidades gerais de provedores de infraestrutura, se negociado).
- Caso fortuito e força maior.
- Período em que o acesso estiver suspenso por inadimplência.

## 7. Compensações

| Disponibilidade apurada no mês | Crédito na mensalidade seguinte |
|---|---|
| Abaixo de ___% | ___% |
| Abaixo de ___% | ___% |
| Abaixo de ___% | ___% (teto) |

- Descumprimento de prazo de gravidade 1: crédito de ___% por ocorrência, limitado a ___% da mensalidade.
- O total de créditos no mês está limitado a ___% da mensalidade.
- O crédito deve ser solicitado em até ___ dias após o relatório mensal.
- Os créditos são a compensação integral pelo descumprimento do SLA, nos limites do contrato.

## 8. Obrigações do cliente

- Usar os canais definidos e informar o problema com detalhes (o que fez, o que esperava, o que aconteceu, horário, usuário).
- Manter um responsável disponível para validar soluções.
- Manter atualizados os contatos e os titulares das contas essenciais.
- Não compartilhar senhas; remover usuários desligados.

## 9. Revisão

Este SLA é revisado a cada ___ meses ou quando houver mudança de plano.
