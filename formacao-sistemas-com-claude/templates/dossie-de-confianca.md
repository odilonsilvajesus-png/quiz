# Modelo de Dossiê de Confiança

Um documento de 3 a 6 páginas, em linguagem de dono de empresa, que explica por que o sistema é confiável. **Cada afirmação precisa de um controle real e de uma evidência** (anote a evidência na coluna da direita do seu rascunho; ela não vai para o cliente, mas você mostra se pedirem). Não inclua detalhes que ajudem um atacante (versões exatas, endereços internos, nomes de contas administrativas).

---

# Dossiê de Confiança · ___ (nome do sistema)

**Preparado para:** ___ · **Versão:** ___ · **Data:** ___

## 1. Em uma página

(Cole aqui a página de resumo: 7 a 9 linhas com dados, acessos, registro, backup, monitoramento, atualizações, LGPD e continuidade. Modelo na Aula 17.5.)

## 2. Seus dados

**Onde ficam:** os dados são armazenados em ___ (provedor), na região ___, com criptografia no armazenamento e no caminho entre o seu computador e o sistema.

**Quem acessa:**
| Quem | O que pode ver |
|---|---|
| ___ (papel) | ___ |
| ___ (papel) | ___ |
| Suporte técnico (nós) | Somente com a sua autorização, por tempo limitado e com registro |

**Dados sensíveis:** ___ (se houver, ex.: receitas). Acesso restrito a ___ e cada visualização é registrada.

**Os dados são seus:** você pode exportar todos os dados a qualquer momento, em formatos abertos (planilha / JSON).

**LGPD:** sua empresa é a controladora dos dados dos seus clientes; nós atuamos como operadores, tratando os dados apenas para prestar o serviço e conforme suas instruções. O sistema permite atender os pedidos dos titulares (consultar, corrigir, eliminar). Fornecedores que tratam dados em nosso nome: ___.

## 3. Como protegemos

- **Acesso:** cada pessoa tem o próprio usuário. Senhas nunca são guardadas (só um código irreversível). Administradores entram com verificação em duas etapas. Tentativas repetidas de senha são bloqueadas.
- **Separação:** ___ (para SaaS: cada empresa só enxerga os próprios dados; essa separação é garantida pelo sistema e pelo banco de dados, e testada automaticamente a cada atualização).
- **Quem sai, sai na hora:** ao remover um usuário, o acesso dele é encerrado imediatamente, em todos os dispositivos.
- **Registro:** toda ação importante (alterações de valores, permissões, exportações, exclusões) fica registrada com quem fez e quando.
- **Atualizações:** correções de segurança são aplicadas em até ___; as demais atualizações, ___.
- **Verificação:** o sistema passa por revisão de segurança antes de cada entrega e por auditoria ___ (frequência). Última auditoria: ___.

## 4. Disponibilidade

- **Monitoramento:** o sistema é verificado de fora a cada ___ minutos, 24 horas por dia. Em caso de problema, somos avisados automaticamente.
- **Meta de disponibilidade:** ___% no horário ___.
- **Histórico:** disponibilidade dos últimos ___ meses: ___%.
- **Atualizações sem parar o sistema:** novas versões só entram no ar depois de testadas; se algo der errado, voltamos à versão anterior em minutos.
- **Status:** acompanhe em ___ (página de status, se houver).

## 5. Backups e recuperação

- **Backup:** ___ (frequência), com cópia em outro provedor, protegida contra exclusão.
- **Perda máxima prevista:** ___ (RPO).
- **Tempo de volta no pior cenário:** até ___ (RTO).
- **Teste:** a restauração é testada a cada ___. Último teste: ___ (tempo: ___).

## 6. Se algo der errado

- Temos um plano de resposta a incidentes: detectar, conter, avaliar, comunicar, corrigir e aprender.
- Em caso de incidente que afete seus dados, avisamos você em até ___ horas, com as informações disponíveis, e apoiamos sua empresa nas comunicações exigidas pela LGPD.
- Problemas são atendidos conforme o SLA: crítico com resposta em ___ e solução ou contorno em ___.

## 7. Continuidade: e se o fornecedor sumir?

- O domínio, a conta de pagamento e a conta do WhatsApp estão no nome da sua empresa.
- ___ (o código fica no repositório da sua empresa / você tem direito a uma cópia / no SaaS: exportação completa e aviso prévio de ___ meses em caso de encerramento).
- A documentação permite que outro profissional instale, opere e mantenha o sistema. Ela é testada por alguém que não conhece o sistema.
- A tecnologia usada é amplamente conhecida no mercado.

## 8. O que nenhum sistema garante

- Não existe segurança absoluta. O que garantimos são camadas de proteção, monitoramento e capacidade de recuperação.
- O sistema depende de fornecedores (___); quando eles têm problemas, agimos para reduzir o impacto e comunicamos.
- A segurança também depende de você: senhas fortes e não compartilhadas, verificação em duas etapas, remover quem sai da empresa, cuidado com e-mails e mensagens falsas. **Nunca pedimos a sua senha.**

## 9. Evidências disponíveis sob pedido

- Relatório da última auditoria de segurança (resumo).
- Relatório do último teste de restauração.
- Histórico de disponibilidade.
- Lista de fornecedores que tratam dados.

---

## Checklist antes de entregar

- [ ] Cada afirmação tem controle real e evidência (ver seu rascunho com a coluna de evidências).
- [ ] Os números (RPO, RTO, disponibilidade, prazos) batem com o SLA e com a realidade medida.
- [ ] Linguagem de cliente, sem jargão.
- [ ] Nenhum detalhe que ajude um atacante.
- [ ] Seção de limites incluída.
