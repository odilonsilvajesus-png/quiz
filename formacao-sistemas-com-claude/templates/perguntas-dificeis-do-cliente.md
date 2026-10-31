# Banco de respostas às perguntas difíceis do cliente

Adapte cada resposta ao sistema e aos números reais (substitua os `___`). Estrutura de toda resposta: **validar → fatos e números → evidência → limite honesto → pergunta de volta**. Treine em voz alta.

---

## 1. "E se o sistema cair?"

> "Faz todo sentido se preocupar, porque sistema parado é operação parada. O sistema é verificado de fora a cada ___ minutos, 24 horas por dia; se algo falhar, eu sou avisado na hora, normalmente antes de você perceber. A maioria dos problemas eu resolvo em minutos, porque toda atualização pode ser desfeita rapidamente. No pior cenário, com perda total do servidor, o sistema volta em até ___ a partir dos backups, que eu testo a cada ___. Nos últimos ___ meses, a disponibilidade foi de ___%. Nenhum sistema tem 100%, mas eu garanto ___% no contrato, com desconto se eu não cumprir. Quanto tempo fora do ar seria aceitável para a sua operação?"

## 2. "E se vazarem os meus dados?"

> "É a pergunta mais importante. O sistema tem várias camadas: cada pessoa entra com o próprio usuário, os administradores com verificação em duas etapas, cada um vê só o que o cargo permite, tudo trafega e fica guardado criptografado, e toda ação importante fica registrada. ___ (SaaS: a separação entre empresas é garantida pelo sistema e pelo próprio banco, e testada a cada atualização.) Antes da entrega, o sistema passa por uma auditoria de segurança, e as atualizações de segurança são aplicadas em até ___. E se mesmo assim algo acontecer, temos um plano: conter na hora, avaliar exatamente o que foi afetado e avisar você em até ___ horas para as providências da LGPD. Quais dados da sua empresa você considera mais sensíveis?"

## 3. "E se você sumir?"

> "Você tem toda razão em perguntar, e eu cuido disso desde o primeiro dia. O domínio, a conta de pagamento e a do WhatsApp ficam no nome da sua empresa; eu sou só convidado. ___ (o código fica no repositório da sua empresa). Toda a documentação para outro programador assumir está pronta, e eu testo com alguém que não conhece o sistema. A tecnologia é a mesma que grandes empresas usam, então você encontra quem dê continuidade. E o contrato prevê a entrega de tudo e ___ dias de apoio na transição. Quer ver a documentação?"

## 4. "Os dados são meus?"

> "São. Você pode exportar todos os dados a qualquer momento, em planilha. Pela LGPD, sua empresa é a controladora e eu sou o operador: eu trato os dados só para prestar o serviço, conforme as suas instruções. No fim do contrato, eu devolvo e elimino os dados, como você decidir."

## 5. "Por que tão caro, se a IA faz tudo?"

> "A IA realmente me faz escrever código mais rápido, e é por isso que o preço é menor do que seria sem ela. Mas o código é só uma parte. O que você está contratando é: entender o seu problema, desenhar a solução certa, garantir que funciona com testes automáticos, proteger os dados, colocar no ar com backup testado e monitoramento, e ter alguém responsável por tudo isso. Pelas suas contas, o problema custa ___ por mês; o investimento se paga em ___ meses. Faz sentido olhar por esse lado?"

## 6. "Meu sobrinho (ou outra empresa) faz por menos."

> "Pode ser uma ótima opção. Sugiro comparar o que está incluído, não só o preço: o sistema terá testes automáticos? Backup com restauração testada? Monitoramento? Verificação em duas etapas? Documentação para outro profissional assumir? Contrato com SLA e proteção de dados? Se tudo isso estiver incluído, a comparação é justa. Posso deixar essa lista com você."

## 7. "Precisa mesmo de manutenção? Depois de pronto, não está pronto?"

> "Um sistema parado no tempo se deteriora, mesmo sem ninguém mexer: as peças que ele usa ganham falhas de segurança publicadas, os fornecedores (pagamento, WhatsApp, nota fiscal) mudam as regras, os certificados vencem. A manutenção é o que mantém o sistema seguro e funcionando sem você precisar se preocupar. Sem ela, em 1 ou 2 anos, colocar em dia costuma custar mais do que o plano inteiro. Todo mês você recebe um relatório do que foi feito."

## 8. "Dá para fazer em 2 semanas?"

> "Com qualidade e segurança, em 2 semanas dá para entregar ___ (MVP menor), que já resolve ___. O restante vem na etapa seguinte. O que não dá é entregar tudo em 2 semanas sem testes e sem segurança, porque aí o risco fica com você. Qual parte é mais urgente para a sua operação?"

## 9. "E se eu quiser mudar alguma coisa depois?"

> "Vai querer, e é normal: com o sistema rodando, a gente descobre o que mais vale a pena. Mudanças fora do escopo são avaliadas por escrito, com custo e prazo, e só feitas com a sua aprovação, então você nunca é surpreendido. E o plano de manutenção ___ inclui ___ horas por mês para melhorias."

## 10. "Onde ficam os servidores? No Brasil?"

> "Os dados ficam em ___ (provedor), na região ___. ___ (Se no Brasil: isso simplifica a conversa sobre a LGPD e deixa o sistema mais rápido.) (Se fora: a LGPD permite, com as salvaguardas adequadas, e o fornecedor ___ adota ___; está registrado na nossa lista de fornecedores.)"

## 11. "Vocês usam IA com os meus dados?"

> "___ (Se não: não.) (Se sim:) Só na funcionalidade ___, que você pode ligar ou desligar. Enviamos o mínimo necessário, sem ___, e a IA apenas sugere; quem decide é a sua equipe. O fornecedor e as condições de tratamento estão na nossa lista de fornecedores."

## 12. "Já teve algum problema com outro cliente?"

> "___ (Resposta honesta, sem expor o cliente.) Ex.: 'Já tivemos uma instabilidade de ___ minutos por causa de ___. Detectamos na hora, voltamos à versão anterior, e criamos ___ para não acontecer de novo.' Problemas acontecem com todo sistema; o que importa é detectar rápido, resolver e aprender."

---

## Treino

- [ ] Respondi a todas em voz alta, cronometrando (meta: até 1 minuto cada).
- [ ] Treinei com o Claude no papel de cliente desconfiado.
- [ ] Reescrevi as 3 respostas mais fracas.
- [ ] Os números citados batem com o SLA, o Dossiê e a realidade.
