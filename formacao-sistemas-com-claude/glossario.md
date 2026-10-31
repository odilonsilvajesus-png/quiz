# Glossário

Os termos técnicos da formação, em ordem alfabética, com a aula onde cada um é explicado.

## A a C

| Termo | O que significa | Onde estudar |
|---|---|---|
| ADR | Registro de decisão de arquitetura: um documento curto com contexto, opções, decisão e consequências | M6, Aula 6.4 |
| Adaptador | Código que traduz a interface do seu sistema para a de um fornecedor específico, permitindo trocá-lo | M10, Aula 10.3 |
| Análise sem culpados (post-mortem) | Revisão de um incidente focada no que o sistema e o processo permitiram, não em quem errou | M15, Aula 15.5 |
| ANPD | Autoridade Nacional de Proteção de Dados, que fiscaliza a LGPD | M14, Aula 14.1 |
| API | Conjunto de "portas" pelas quais um programa pede coisas a outro (por exemplo, o frontend ao backend) | M1, Aula 1.1 |
| Atribuição em massa | Falha em que campos extras enviados pelo usuário são gravados no banco sem controle | M7, Aula 7.2 |
| Auditoria (registro) | Tabela que registra quem fez cada ação sensível, quando e o que mudou; só aceita inserções | M5, Aula 5.4 |
| Auditoria de segurança | Verificação estruturada dos controles de segurança, com evidências | M13, Aula 13.6 |
| Autenticação | Confirmar quem é o usuário (login) | M9, Aula 9.1 |
| Autorização | Decidir o que o usuário pode fazer (permissões) | M9, Aula 9.3 |
| Backend | A parte do sistema que roda no servidor e aplica as regras de negócio | M1, Aula 1.1 |
| Backup imutável | Cópia de segurança que ninguém consegue apagar por um período, nem com as suas credenciais | M14, Aula 14.4 |
| Base legal | O fundamento previsto na LGPD que autoriza um tratamento de dados (contrato, obrigação legal, consentimento etc.) | M14, Aula 14.1 |
| Batimento (heartbeat) | Aviso que uma tarefa envia ao monitoramento quando termina; a ausência dele gera alerta | M15, Aula 15.2 |
| Branch | Linha paralela de trabalho no Git | M2, Aula 2.2 |
| CAA | Registro de DNS que diz quais autoridades podem emitir certificados HTTPS para o domínio | M12, Aula 12.1 |
| Cache | Guardar um resultado para reaproveitar sem recalcular | M15, Aula 15.4 |
| Chargeback (contestação) | Quando o titular do cartão contesta uma compra com o banco | M10, Aula 10.1 |
| Chave de idempotência | Identificador enviado com uma operação para que repeti-la não crie duplicatas | M7, Aula 7.6 |
| Chave estrangeira | Coluna que aponta para a chave primária de outra tabela | M5, Aula 5.1 |
| Chave primária | Coluna que identifica cada linha de uma tabela de forma única | M5, Aula 5.1 |
| CI/CD | Integração contínua (testes automáticos a cada mudança) e entrega contínua (publicação automática) | M12, Aula 12.6 |
| Churn | Percentual de clientes ou receita que cancela em um período | M17, Aula 17.6 |
| Circuit breaker (pausa automática) | Mecanismo que suspende chamadas a um serviço depois de muitas falhas seguidas | M11, Aula 11.1 |
| CLAUDE.md | Arquivo de regras do projeto que o Claude Code lê em toda sessão | M2, Aula 2.4 |
| Claude Code | Ferramenta em que o Claude trabalha dentro do projeto: lê, edita, roda comandos e testes | M2, Aula 2.4 |
| Commit | Uma "fotografia" do projeto no Git, com mensagem | M2, Aula 2.2 |
| Componente | Peça reutilizável de interface | M8, Aula 8.1 |
| Conciliação | Tarefa que compara o seu sistema com o provedor (por exemplo, de pagamento) e corrige divergências | M10, Aula 10.5 |
| Contêiner | Uma imagem Docker em execução | M12, Aula 12.4 |
| Controlador | Na LGPD, quem decide por que e como os dados pessoais são tratados | M14, Aula 14.1 |
| Cookie | Pequeno dado guardado pelo navegador e enviado a cada requisição; guarda a sessão | M9, Aula 9.1 |
| CORS | Regra do navegador que controla quais sites podem ler respostas da sua API | M13, Aula 13.4 |
| Criptografia em campos | Criptografar valores específicos na aplicação antes de gravar no banco | M14, Aula 14.3 |
| CSP | Política de segurança de conteúdo: cabeçalho que diz ao navegador de onde scripts e recursos podem vir | M13, Aula 13.4 |
| CSRF | Ataque em que outro site faz o navegador do usuário logado enviar ações ao seu sistema | M9, Aula 9.1 |

## D a H

| Termo | O que significa | Onde estudar |
|---|---|---|
| Dado pessoal | Informação que identifica ou pode identificar uma pessoa | M14, Aula 14.1 |
| Dado pessoal sensível | Categoria com proteção reforçada: saúde, biometria, genética, origem racial, religião, entre outras | M14, Aula 14.1 |
| DDoS | Ataque de negação de serviço distribuída: inundar o sistema de tráfego a partir de muitas máquinas | M13, Aula 13.4 |
| Defesa em profundidade | Várias camadas de proteção, para que a falha de uma não seja suficiente para um incidente | M6, Aula 6.6 |
| Degradação elegante | Quando uma parte falha, o resto do sistema continua funcionando e o usuário sabe o que está limitado | M15, Aula 15.6 |
| Dependabot | Ferramenta do GitHub que alerta e propõe atualizações de bibliotecas vulneráveis | M2, Aula 2.3 · M13, Aula 13.5 |
| Deploy | Publicar uma nova versão do sistema | M12 |
| DKIM | Assinatura digital dos e-mails do seu domínio | M11, Aula 11.4 |
| DMARC | Política que diz o que fazer com e-mails que falham nas verificações do domínio | M11, Aula 11.4 |
| DNS | Sistema que traduz nomes de domínio em endereços IP | M1, Aula 1.2 · M12, Aula 12.1 |
| Docker | Ferramenta que empacota a aplicação para rodar igual em qualquer lugar | M12, Aula 12.4 |
| Dossiê de Confiança | Documento em linguagem de cliente que explica por que o sistema é confiável, com evidências | M17, Aula 17.5 |
| Encarregado (DPO) | Pessoa indicada pelo controlador como canal com titulares e com a ANPD | M14, Aula 14.1 |
| Especificação | Documento que define exatamente o que será construído | M4, Aula 4.5 |
| Exclusão lógica | Marcar um registro como excluído (`excluidoEm`) em vez de apagá-lo | M5, Aula 5.4 |
| Expandir e contrair | Fazer mudanças arriscadas no banco em etapas compatíveis com a versão anterior do código | M5, Aula 5.5 · M12, Aula 12.7 |
| Fila de tarefas | Lista de trabalhos a executar em segundo plano, com novas tentativas | M7, Aula 7.5 |
| Frontend | A parte do sistema que o usuário vê e usa, no navegador | M1, Aula 1.1 |
| Função pura | Função que sempre devolve o mesmo resultado para a mesma entrada e não mexe em nada fora dela | M7, Aula 7.3 |
| Git | Sistema de controle de versões do código | M2, Aula 2.2 |
| GitHub | Serviço que guarda repositórios Git na nuvem e adiciona colaboração e automações | M2, Aula 2.3 |
| GitHub Actions | Automação de testes e deploys dentro do GitHub | M12, Aula 12.6 |
| Hash de senha | Resultado irreversível de um algoritmo próprio para senhas; o sistema guarda isso, nunca a senha | M9, Aula 9.1 |
| Homologação (staging) | Ambiente de testes que imita a produção, com dados fictícios | M1, Aula 1.3 · M12, Aula 12.3 |
| HSTS | Cabeçalho que obriga o navegador a usar sempre HTTPS no domínio | M13, Aula 13.4 |
| HTTP | O protocolo de pedido e resposta entre navegador e servidor | M1, Aula 1.2 |
| HTTPS | HTTP dentro de um canal criptografado, com certificado que prova a identidade do servidor | M1, Aula 1.2 |

## I a M

| Termo | O que significa | Onde estudar |
|---|---|---|
| Idempotência | Propriedade de uma operação que, repetida, tem o mesmo efeito que uma vez só | M7, Aulas 7.5 e 7.6 |
| IDOR | Falha em que trocar um id na requisição dá acesso a um registro de outra pessoa ou empresa | M2, Aula 2.5 · M9 |
| Índice | Estrutura do banco que acelera buscas por determinadas colunas | M5, Aula 5.6 |
| Injeção | Família de ataques em que um dado do usuário é interpretado como comando (SQL, HTML, comandos, fórmulas, instruções de IA) | M13, Aula 13.3 |
| Injeção de instruções (prompt injection) | Texto externo lido pela IA que tenta mudar o comportamento dela | M11, Aula 11.6 |
| Interruptor de funcionalidade (feature flag) | Liga e desliga uma funcionalidade sem novo deploy | M12, Aula 12.7 |
| Inventário de dados | Lista dos dados pessoais tratados, com finalidade, local, acesso, compartilhamento e retenção | M14, Aula 14.2 |
| JWT | Token assinado que carrega informações da sessão; difícil de revogar antes de expirar | M9, Aula 9.1 |
| Lançamento e baixa | No financeiro, o título (o que se deve) e o pagamento registrado contra ele | M5, Aula 5.3 |
| LGPD | Lei Geral de Proteção de Dados (Lei 13.709/2018) | M14 |
| Limite de requisições (rate limit) | Restrição de quantas requisições um usuário ou IP pode fazer em um período | M9, Aula 9.2 · M13, Aula 13.4 |
| Livro de movimentos | Registrar cada entrada e saída em vez de editar um saldo | M5, Aula 5.3 |
| Logs estruturados | Registros em formato JSON, com campos fixos, fáceis de filtrar | M7, Aula 7.4 |
| LTV e CAC | Valor que um cliente gera enquanto fica (LTV) e quanto custa conquistá-lo (CAC) | M17, Aula 17.6 |
| Máquina de estados | Modelo em que algo passa por estados definidos, com transições permitidas | M10, Aula 10.4 |
| Matriz de permissões | Tabela de quais papéis podem fazer quais ações | M9, Aula 9.3 |
| Menor privilégio | Cada pessoa ou serviço recebe só o acesso necessário | M9, Aula 9.3 · M14, Aula 14.5 |
| Migration | Arquivo com as instruções para levar o banco de uma versão para a próxima | M5, Aula 5.5 |
| Minimização | Coletar e guardar só os dados necessários | M14, Aula 14.2 |
| Modelagem de ameaças | Exercício de identificar o que pode dar errado e como se proteger | M13, Aula 13.1 |
| Monolito modular | Uma única aplicação organizada internamente em módulos bem separados | M6, Aula 6.1 |
| MoSCoW | Técnica de priorização: precisa, deveria, poderia, não agora | M4, Aula 4.3 |
| MRR | Receita recorrente mensal de um SaaS | M17, Aula 17.6 |
| Multi-tenant | Várias empresas no mesmo sistema, cada uma vendo só os próprios dados | M1, Aula 1.4 · M9, Aula 9.4 |
| MVP | Produto mínimo viável: pequeno em escopo, completo em qualidade | M4, Aula 4.3 |

## N a R

| Termo | O que significa | Onde estudar |
|---|---|---|
| N+1 | Padrão lento em que se faz uma consulta para a lista e mais uma para cada item | M5, Aula 5.6 |
| Next.js | Framework web que junta frontend e backend no mesmo projeto | M6, Aula 6.2 |
| NF-e, NFC-e, NFS-e | Notas fiscais eletrônicas de produtos, de consumidor e de serviços | M11, Aula 11.5 |
| Operador | Na LGPD, quem trata dados pessoais em nome do controlador | M14, Aula 14.1 |
| ORM | Ferramenta que traduz entre o código e as tabelas do banco (ex.: Prisma) | M5, Aula 5.5 |
| OWASP Top 10 | Lista dos dez riscos mais críticos de aplicações web, publicada pela OWASP | M13, Aula 13.2 |
| PaaS | Plataforma como serviço: você envia o código e a plataforma cuida do servidor | M1, Aula 1.3 · M12, Aula 12.2 |
| Paginação | Mostrar listas em partes, em vez de trazer tudo | M5, Aula 5.6 · M8, Aula 8.3 |
| PCI DSS | Padrão de segurança da indústria de cartões | M10, Aula 10.1 |
| Pentest | Teste de invasão feito por profissionais especializados, com autorização | M13, Aula 13.6 |
| PITR | Recuperação por ponto no tempo: restaurar o banco para qualquer minuto dentro de um período | M14, Aula 14.4 |
| Pix | Meio de pagamento instantâneo brasileiro | M10, Aula 10.1 |
| Plano de incidente | Procedimento escrito para responder a incidentes de segurança | M14, Aula 14.6 |
| Plano de manutenção | Serviço recorrente com escopo, prazos e preço definidos | M16, Aula 16.2 |
| PostgreSQL | Banco de dados relacional usado na formação | M5 |
| Prisma | ORM usado na formação, com migrations e consultas tipadas | M5, Aula 5.5 |
| Proxy reverso | Programa que recebe as conexões da internet e as repassa para a aplicação (ex.: Caddy) | M12, Aula 12.5 |
| Pull request | Pedido para juntar uma branch na principal, com revisão e testes | M2, Aula 2.3 |
| RBAC | Controle de acesso baseado em papéis | M9, Aula 9.3 |
| Régua de cobrança | Sequência de lembretes e ações antes e depois do vencimento | M10, Aula 10.6 |
| Regra 3-2-1 | Três cópias, dois tipos de armazenamento, uma fora do provedor principal | M14, Aula 14.4 |
| Réplica | Cópia viva e sincronizada do banco, para disponibilidade (não substitui backup) | M14, Aula 14.4 |
| Rollback | Voltar para a versão anterior do sistema | M12, Aula 12.7 |
| RLS | Segurança em nível de linha: o próprio banco filtra as linhas que cada conexão pode ver | M9, Aula 9.5 |
| RPO e RTO | Quanto de dados se pode perder (RPO) e em quanto tempo o sistema precisa voltar (RTO) | M14, Aula 14.4 |
| Runbook | Procedimento passo a passo para um sintoma de operação | M15, Aula 15.5 |

## S a Z

| Termo | O que significa | Onde estudar |
|---|---|---|
| SaaS | Software como serviço: muitas empresas usam o mesmo sistema, pagando assinatura | M1, Aula 1.4 |
| Sal (salt) | Valor aleatório misturado à senha antes do hash | M9, Aula 9.1 |
| Seed | Script que preenche o banco de desenvolvimento com dados fictícios | M5, Aula 5.5 |
| Server Action | Função do servidor chamada diretamente por formulários e botões no Next.js; é uma rota pública | M7, Aula 7.1 |
| Serverless | Modelo em que o código roda em funções sob demanda, sem servidor fixo | M1, Aula 1.3 · M6, Aula 6.1 |
| Sessão | O registro de que o usuário está logado, identificado por um cookie | M9, Aula 9.1 |
| SLA | Acordo de nível de serviço: o que você garante ao cliente em contrato | M15, Aula 15.1 · M16, Aula 16.3 |
| SLI e SLO | O indicador medido (SLI) e a meta interna (SLO) de disponibilidade e desempenho | M15, Aula 15.1 |
| SPF | Registro de DNS que lista quais servidores podem enviar e-mails pelo domínio | M11, Aula 11.4 |
| SQL | Linguagem para consultar e alterar bancos relacionais | M5, Aula 5.2 |
| SSH | Protocolo para acessar servidores remotos com segurança | M12, Aula 12.5 |
| SSRF | Ataque em que o servidor é induzido a chamar endereços internos | M13, Aula 13.3 |
| Stack | O conjunto de tecnologias de um sistema | M6, Aula 6.2 |
| STRIDE | Categorias de ameaças: falsificação, adulteração, repúdio, vazamento, negação de serviço, elevação de privilégio | M13, Aula 13.1 |
| Superfície de ataque | O conjunto de portas pelas quais alguém pode tentar entrar no sistema | M6, Aula 6.6 |
| Teste de caracterização | Teste que captura o comportamento atual antes de mexer em código pouco testado | M16, Aula 16.5 |
| Teste de contrato | Teste que verifica que vários adaptadores cumprem a mesma interface do mesmo jeito | M10, Aula 10.7 |
| Testes unitários, de integração e de ponta a ponta | Testes de uma função, de partes juntas com banco, e do sistema todo pelo navegador | M3, Aula 3.4 |
| Titular | A pessoa a quem os dados pessoais se referem | M14, Aula 14.1 |
| TLS | O protocolo de criptografia por trás do HTTPS e de conexões seguras com o banco | M14, Aula 14.3 |
| Transação | Conjunto de operações no banco que acontecem todas ou nenhuma | M5, Aula 5.2 · M7, Aula 7.3 |
| TTL | Tempo que uma resposta de DNS fica guardada em cache | M1, Aula 1.2 · M12, Aula 12.1 |
| TypeScript | JavaScript com tipos; pega muitos erros antes de o código rodar | M2, Aula 2.5 |
| Variável de ambiente | Configuração e segredos definidos fora do código, no servidor | M1, Aula 1.3 · M12, Aula 12.3 |
| VPS | Servidor virtual privado: uma máquina Linux alugada, sob sua responsabilidade | M1, Aula 1.3 · M12, Aula 12.5 |
| WCAG | Diretrizes internacionais de acessibilidade para a web | M8, Aula 8.6 |
| Webhook | Chamada que um serviço externo faz ao seu sistema quando algo acontece | M7, Aula 7.6 |
| Wireframe | Esboço de tela em blocos, sem cores, para validar informações e ações | M4, Aula 4.4 |
| Worker | Processo que executa as tarefas da fila em segundo plano | M7, Aula 7.5 · M12, Aula 12.2 |
| XSS | Execução, no navegador de outra pessoa, de um script inserido como texto | M8, Aula 8.6 |
| Zod | Biblioteca de validação de dados que também gera os tipos TypeScript | M7, Aula 7.2 |
