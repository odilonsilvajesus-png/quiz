# Módulo 1: Como um sistema funciona por dentro

**Semanas 1 e 2 · cerca de 22 horas**

## Objetivos de aprendizagem

Hoje, quando o Claude diz "vamos criar a API" ou "precisamos configurar o DNS", você obedece sem saber o que isso significa. Este módulo dá o **mapa do território**: as peças de todo sistema web, onde cada uma roda e como elas conversam. Sem esse mapa, você não consegue avaliar se o que a IA propôs faz sentido, e é aí que nascem os sistemas que caem e vazam dados. No fim do módulo você também coloca seu primeiro app no ar, para sentir o ciclo completo logo na segunda semana.

Ao final deste módulo você será capaz de:
1. Desenhar a arquitetura de um sistema web (frontend, backend, banco de dados, serviços externos) e explicar o papel de cada parte.
2. Explicar o caminho de uma requisição: do navegador, passando por DNS e HTTPS, até o servidor e de volta.
3. Identificar onde cada parte do código roda (navegador, servidor, nuvem) e o que isso significa para a segurança.
4. Reconhecer a anatomia comum de ERP, CRM, sistema financeiro, sistema de atendimento e SaaS.
5. Publicar um app simples feito com o Claude e explicar cada etapa do que aconteceu.

### Como estudar este módulo
```mermaid
flowchart LR
    A["Aulas 1.1 a 1.5"] --> E["Exercícios 1 a 5"]
    E --> T["Tarefa de campo:<br/>dissecar um sistema real"]
    T --> EN["Entregável:<br/>app no ar + diagrama"]
    EN --> AV["Autoavaliação"]
```
*Figura: a sequência de estudo do módulo, das aulas ao primeiro app publicado.*

| Semana | O que fazer | Horas |
|---|---|---|
| 1 | Aulas 1.1 a 1.3, exercícios 1 a 3 | 10 |
| 2 | Aulas 1.4 e 1.5, exercícios 4 e 5, tarefa, entregável, autoavaliação | 12 |

---

## Aula 1.1: O mapa: frontend, backend, banco de dados e API

Todo sistema que você vai construir, seja um CRM de uma clínica ou um ERP de uma distribuidora, é feito das mesmas quatro peças. Se você souber o que cada uma faz, consegue ler qualquer proposta do Claude e perguntar: "isso está no lugar certo?".

### As quatro peças

Pense em um restaurante.

| Peça | No restaurante | No sistema | Exemplo no Gestor |
|---|---|---|---|
| **Frontend** | O salão e o cardápio: o que o cliente vê e toca | As telas que rodam no navegador ou celular | A tela de lista de clientes, o botão "Nova venda" |
| **Backend** | A cozinha: onde o trabalho de verdade acontece, longe dos olhos do cliente | O programa que roda no servidor e aplica as regras de negócio | Calcular o total da venda, verificar se o usuário pode ver aquele cliente |
| **Banco de dados** | A despensa e o caderno de pedidos: onde tudo fica guardado | O lugar onde os dados ficam salvos de forma permanente | A tabela de clientes, a tabela de cobranças |
| **API** | O garçom: leva o pedido do salão para a cozinha e traz o prato de volta | O conjunto de "portas" pelas quais o frontend pede coisas ao backend | `GET /api/clientes` devolve a lista de clientes |

### Por que essa separação importa (e por que importa para a segurança)

A regra de ouro: **o frontend é território do usuário; o backend é território seu.**

Tudo o que roda no navegador pode ser visto e alterado por quem está usando. Qualquer pessoa pode abrir as ferramentas do navegador (tecla F12), ver o código da tela e mudar o que é enviado. Por isso:

- **Validar no frontend é conforto; validar no backend é segurança.** Se a tela impede que o atendente veja o faturamento, ótimo para a experiência. Mas se o backend não verificar também, basta o atendente chamar a API diretamente e ele vê tudo.
- **Segredos nunca vão para o frontend.** A chave do Asaas, a senha do banco, o token do WhatsApp: tudo isso fica só no backend.

> ⚠️ **O erro mais comum em sistemas feitos com IA**
> O Claude, quando pedido de forma vaga ("faça uma tela de relatório financeiro só para o dono"), pode esconder o botão na tela e esquecer de proteger a rota no backend. O sistema "funciona" na demonstração e vaza dados na primeira semana. A partir de agora, sempre que pedir algo com restrição de acesso, diga explicitamente: *"a verificação de permissão deve acontecer no backend"*.

### Exemplo completo: a Clínica Sorriso Fácil

A Clínica Sorriso Fácil, com 3 dentistas e 2 recepcionistas, quer um sistema de agenda. Veja como as peças se dividem:

```mermaid
flowchart LR
    subgraph NAV["Navegador da recepcionista"]
        FE["Frontend<br/>tela da agenda"]
    end
    subgraph SRV["Servidor (nuvem)"]
        BE["Backend<br/>regras: horário livre?<br/>quem pode marcar?"]
    end
    DB[("Banco de dados<br/>pacientes, consultas")]
    WA["Serviço externo<br/>WhatsApp"]
    FE -->|"API: POST /consultas"| BE
    BE -->|"grava a consulta"| DB
    BE -->|"envia lembrete"| WA
    BE -->|"responde: marcada"| FE
```
*Figura: a arquitetura da agenda da clínica. O frontend só pede, o backend decide e grava, e só o backend fala com o banco e com o WhatsApp.*

1. A recepcionista escolhe um horário e clica em "Marcar" (frontend).
2. O frontend chama a API: "quero marcar a consulta do paciente 123 às 14h com a Dra. Ana".
3. O backend confere: a recepcionista está logada? Pertence a esta clínica? O horário está livre? A Dra. Ana atende nesse dia?
4. Se tudo estiver certo, grava no banco e pede ao serviço de WhatsApp que mande o lembrete.
5. Devolve ao frontend: "consulta marcada".

Repare que **todas as decisões importantes estão no passo 3, no backend**. O frontend pode até mostrar só os horários livres, mas quem garante é o backend, porque duas recepcionistas podem clicar no mesmo horário ao mesmo tempo.

### Serviços externos

Quase todo sistema também conversa com **serviços de terceiros**: provedor de pagamento (Asaas, Mercado Pago, Stripe), envio de e-mail, WhatsApp, emissão de nota fiscal, armazenamento de arquivos. Eles também se comunicam por API. Você vai integrar vários deles no Módulo 11. Por enquanto, guarde: **cada serviço externo é uma dependência que pode falhar**, e um sistema robusto precisa saber o que fazer quando ele falha.

### Monolito: tudo junto, mas organizado

Para começar, frontend e backend podem morar **no mesmo projeto** e ser publicados juntos. É o que o Next.js, a ferramenta padrão desta formação, faz. Isso se chama **monolito**, e é a escolha certa para 95% dos sistemas de pequenas e médias empresas. Você vai entender o porquê no Módulo 6. A separação entre frontend e backend continua existindo **dentro** do projeto: alguns arquivos rodam no navegador e outros só no servidor.

> 📌 **Em resumo**
> - Todo sistema web tem frontend (o que se vê), backend (onde as regras rodam), banco de dados (onde tudo fica salvo) e API (a ponte entre eles).
> - O frontend está nas mãos do usuário e pode ser manipulado; regras e permissões precisam ser garantidas no backend.
> - Segredos (chaves, senhas) ficam só no backend.
> - Serviços externos são dependências que podem falhar e precisam de plano B.

### Para ir além
- [Visão geral do HTTP (MDN, em português)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview)
- [Como a internet funciona (MDN, em português)](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work)

---

## Aula 1.2: Internet na prática: HTTP, DNS, domínio e HTTPS

Quando o cliente liga dizendo "o sistema não abre", o problema pode estar em cinco lugares diferentes. Saber o caminho que uma requisição percorre é o que permite descobrir onde está o defeito em minutos, e não em horas.

### O caminho de uma requisição

Quando alguém digita `app.gestor.com.br` no navegador, acontece isto:

```mermaid
sequenceDiagram
    participant N as Navegador
    participant D as DNS
    participant S as Servidor do Gestor
    participant B as Banco de dados
    N->>D: Qual é o endereço de app.gestor.com.br?
    D-->>N: É o IP 203.0.113.10
    N->>S: Conexão segura (HTTPS) com 203.0.113.10
    S-->>N: Certificado: sou mesmo app.gestor.com.br
    N->>S: GET /clientes (com o cookie de login)
    S->>B: Busca os clientes da empresa do usuário
    B-->>S: 42 clientes
    S-->>N: 200 OK + página com 42 clientes
```
*Figura: o caminho de uma requisição. Primeiro o DNS traduz o nome em endereço, depois o HTTPS cria um canal seguro, e só então o pedido chega ao servidor.*

### DNS: a lista telefônica da internet

Computadores se encontram por **endereços IP** (números como `203.0.113.10`). Pessoas preferem nomes. O **DNS** (Sistema de Nomes de Domínio) traduz um nome em um IP.

- O **domínio** (`gestor.com.br`) é comprado em um **registrador** (no Brasil, domínios `.com.br` são registrados no Registro.br).
- Nas configurações de DNS do domínio você cria **registros**:

| Registro | Para quê | Exemplo |
|---|---|---|
| **A** | Aponta um nome para um IP | `app.gestor.com.br → 203.0.113.10` |
| **CNAME** | Aponta um nome para outro nome | `app.gestor.com.br → gestor.vercel.app` |
| **MX** | Diz qual servidor recebe e-mails do domínio | `gestor.com.br → servidor de e-mail` |
| **TXT** | Textos de verificação (provar que você é dono, configurar e-mail) | Registros SPF e DKIM para o e-mail não cair no spam |

> 💡 **Problema clássico:** você muda o DNS e "não funciona". Mudanças de DNS podem levar de minutos a algumas horas para valer em todos os lugares (é a chamada **propagação**, controlada pelo **TTL**, o tempo que cada resposta fica guardada em cache). Antes de uma mudança importante, diminua o TTL com antecedência.

### HTTP: a língua da conversa

**HTTP** é o protocolo, ou seja, o conjunto de regras da conversa entre navegador e servidor. Toda conversa tem um **pedido** (request) e uma **resposta** (response).

O pedido tem um **método** (o verbo) e um **caminho** (o recurso):

| Método | Significa | Exemplo no Gestor |
|---|---|---|
| `GET` | Buscar | `GET /api/clientes` lista os clientes |
| `POST` | Criar | `POST /api/clientes` cadastra um cliente |
| `PUT` / `PATCH` | Alterar | `PATCH /api/clientes/42` muda o telefone do cliente 42 |
| `DELETE` | Apagar | `DELETE /api/clientes/42` remove o cliente 42 |

A resposta traz um **código de status**, que é a primeira pista em qualquer problema:

| Faixa | Significa | Os mais comuns |
|---|---|---|
| 2xx | Deu certo | `200 OK`, `201 Created` |
| 3xx | Vá para outro lugar | `301`/`302` redirecionamento |
| 4xx | **O pedido** tem um problema | `400` dados inválidos, `401` não está logado, `403` está logado mas não tem permissão, `404` não existe, `429` pedidos demais |
| 5xx | **O servidor** tem um problema | `500` erro interno, `502`/`503`/`504` servidor fora do ar ou lento demais |

> 🎯 **Ideia-chave para diagnóstico:** erro 4xx, olhe o que o usuário ou o frontend mandou. Erro 5xx, olhe o servidor e os logs. Só essa distinção já resolve metade das ligações de "o sistema não funciona".

O pedido e a resposta também carregam **cabeçalhos** (headers), informações extras como "este é o meu cookie de login" ou "não deixe este site ser aberto dentro de outro site". Você vai usar cabeçalhos de segurança no Módulo 13.

### HTTPS: o cadeado

**HTTPS** é HTTP dentro de um túnel criptografado (o protocolo TLS). Ele garante três coisas:

1. **Sigilo:** quem está no meio do caminho (o Wi-Fi da cafeteria, o provedor de internet) não consegue ler a senha nem os dados.
2. **Integridade:** ninguém consegue alterar a resposta no meio do caminho.
3. **Identidade:** o **certificado** prova que o servidor é mesmo o dono do domínio.

Hoje certificados são gratuitos (o Let's Encrypt emite milhões por dia) e as plataformas de hospedagem os configuram sozinhas. **Não existe desculpa para um sistema sem HTTPS.** Um sistema sem HTTPS que recebe senha é um vazamento esperando acontecer.

### Exemplo completo: diagnosticando "o sistema não abre"

A Distribuidora Ramos liga às 8h: "o sistema não abre". Com o mapa acima, você segue o caminho:

1. **O nome resolve?** Abra o terminal e rode `nslookup app.ramos.com.br`. Se não houver resposta, o problema é DNS (domínio vencido é o caso mais comum, e mais constrangedor).
2. **O servidor responde?** Rode `curl -I https://app.ramos.com.br`. Sem resposta: servidor fora do ar. Erro de certificado: HTTPS vencido ou mal configurado.
3. **Qual o status?** `502` ou `503`: a aplicação caiu ou está reiniciando. `500`: a aplicação está de pé, mas algo dentro dela quebrou (olhe os logs).
4. **Funciona para você e não para eles?** O problema pode estar na rede da empresa ou no computador do usuário.

Em 3 minutos você sabe em qual "andar do prédio" está o problema. No Módulo 15 você vai automatizar esse diagnóstico com monitoramento, para saber **antes** do cliente ligar.

> 📌 **Em resumo**
> - DNS traduz nomes em endereços; registros A e CNAME apontam o domínio para o servidor.
> - HTTP é a conversa de pedido e resposta; o código de status diz se o problema é do pedido (4xx) ou do servidor (5xx).
> - HTTPS dá sigilo, integridade e identidade; é gratuito e obrigatório.
> - Diagnosticar é seguir o caminho: DNS → conexão → status → logs.

### Para ir além
- [O que é DNS (Cloudflare, em português)](https://www.cloudflare.com/pt-br/learning/dns/what-is-dns/)
- [Como o Let's Encrypt funciona (em português)](https://letsencrypt.org/pt-br/how-it-works/)
- [Cookies HTTP (MDN, em português)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Cookies)

---

## Aula 1.3: Onde o código roda: navegador, servidor e nuvem

Uma das perguntas que mais vai aparecer na sua vida de quem constrói sistemas é: **"este código roda onde?"**. A resposta define o que ele pode acessar, quem pode vê-lo e quanto custa.

### Três lugares

| Lugar | O que roda ali | Quem controla | Pode guardar segredos? |
|---|---|---|---|
| **Navegador** (computador ou celular do usuário) | Telas, botões, animações, validações de conforto | O usuário | **Não**, nunca |
| **Servidor** (uma máquina na nuvem) | Regras de negócio, acesso ao banco, chamadas a serviços externos | Você | Sim, em variáveis de ambiente |
| **Serviços gerenciados** (banco de dados, fila, armazenamento de arquivos) | Partes especializadas que alguém opera por você | Você configura, o fornecedor opera | Guardam os dados; o acesso é por credenciais |

### O que é "a nuvem" de verdade

"Nuvem" é só **o computador de outra empresa, alugado por você**. Essas empresas (AWS, Google Cloud, Azure, Hetzner, DigitalOcean e muitas outras) mantêm prédios com milhares de servidores, energia de reserva, internet redundante e segurança física. Você aluga uma parte deles.

Existem três jeitos principais de alugar, do mais "faça você mesmo" ao mais "faça por mim":

```mermaid
flowchart LR
    VPS["VPS<br/>servidor virtual<br/>você cuida de tudo"] --> PAAS["PaaS<br/>plataforma<br/>você só manda o código"]
    PAAS --> SL["Serverless<br/>funções<br/>rodam só quando chamadas"]
```
*Figura: os três modelos de hospedagem, do que dá mais controle (e mais trabalho) ao que dá menos controle (e menos trabalho).*

- **VPS (servidor virtual privado):** você recebe uma máquina Linux vazia. Instala tudo, atualiza tudo, protege tudo. Mais barato e mais flexível, mais responsabilidade. Exemplo: Hetzner, DigitalOcean, Hostinger VPS.
- **PaaS (plataforma como serviço):** você envia o código e a plataforma cuida do servidor, do HTTPS, das atualizações do sistema operacional. Exemplo: Railway, Render, Vercel.
- **Serverless:** seu código vira pequenas funções que só "acordam" quando alguém as chama. Você paga por uso. O Next.js na Vercel funciona assim.

Você vai aprender a escolher entre eles no Módulo 6 e a usar os dois primeiros no Módulo 12. Por enquanto, entenda a troca: **quanto mais controle, mais responsabilidade de segurança e manutenção é sua.**

### Variáveis de ambiente: onde moram os segredos

O código do sistema vai para o GitHub. Os segredos **não podem ir junto**. A solução são as **variáveis de ambiente**: valores configurados no servidor, fora do código, que o programa lê quando inicia.

```bash
# arquivo .env (no seu computador, NUNCA vai para o GitHub)
DATABASE_URL="postgresql://usuario:senha@servidor:5432/gestor"
ASAAS_API_KEY="chave-secreta-do-asaas"
```

No código, o programa lê `process.env.ASAAS_API_KEY`. No servidor de produção, você cadastra esses valores no painel da hospedagem. O arquivo `.env` fica listado no `.gitignore`, a lista de arquivos que o Git ignora.

> ⚠️ **Cuidado com o prefixo público.** No Next.js, variáveis que começam com `NEXT_PUBLIC_` são **embutidas no código do navegador**. Qualquer um vê. Se o Claude sugerir `NEXT_PUBLIC_ASAAS_API_KEY`, isso é um vazamento. Recuse e peça para mover a chamada para o servidor.

### Ambientes: desenvolvimento, homologação e produção

Um sistema profissional roda em pelo menos dois lugares:

| Ambiente | Para quê | Dados |
|---|---|---|
| **Desenvolvimento (local)** | Onde você e o Claude constroem | Dados de teste, inventados |
| **Homologação (staging)** | Cópia do sistema real para testar antes de liberar | Dados de teste parecidos com os reais |
| **Produção** | O sistema que o cliente usa | Dados reais. Sagrados |

A regra que evita a maior parte dos desastres: **nada vai para produção sem passar antes por um ambiente onde quebrar não faz mal.** E: **nunca use dados reais de clientes no seu computador** (isso é risco de vazamento e problema de LGPD).

### Exemplo completo: o Gestor, peça por peça

| Peça do Gestor | Onde roda | Por quê |
|---|---|---|
| Telas (lista de clientes, funil, financeiro) | Navegador | É o que o usuário vê |
| Regras (calcular saldo, verificar permissão) | Servidor | Precisa ser confiável e esconder a lógica |
| Dados (clientes, cobranças) | Banco PostgreSQL gerenciado | Precisa de backup, segurança e disponibilidade |
| Arquivos (contratos em PDF, fotos) | Armazenamento de arquivos (tipo S3) | Banco não é lugar para arquivos grandes |
| Chave do Asaas, senha do banco | Variáveis de ambiente do servidor | Segredo nunca vai para o código nem para o navegador |
| Envio de lembretes diários | Tarefa agendada no servidor | Precisa rodar mesmo com ninguém usando o sistema |

> 📌 **Em resumo**
> - Código roda em três lugares: navegador (do usuário, inseguro), servidor (seu) e serviços gerenciados.
> - A nuvem é aluguel de computador; VPS dá mais controle e mais responsabilidade, PaaS e serverless dão menos trabalho.
> - Segredos ficam em variáveis de ambiente, nunca no código nem no navegador (atenção ao `NEXT_PUBLIC_`).
> - Tenha ambientes separados e nunca use dados reais de cliente no seu computador.

### Para ir além
- [The Twelve-Factor App (em português)](https://12factor.net/pt_br/): os 12 princípios de aplicações bem construídas para a nuvem. Leia o fator III (configurações).

---

## Aula 1.4: Anatomia dos sistemas que você vai vender

Você quer vender ERP, financeiro, CRM, atendimento e SaaS. Parecem coisas diferentes, mas por baixo compartilham uns 70% da estrutura. Quem enxerga essa estrutura comum constrói mais rápido, cobra com mais segurança e reaproveita código entre clientes.

### A base comum de todo sistema de gestão

Quase todo sistema empresarial tem estas camadas:

```mermaid
flowchart TB
    subgraph BASE["Base comum (todo sistema tem)"]
        AUTH["Login, usuários,<br/>papéis e permissões"]
        TEN["Empresas / filiais<br/>(multi-tenant)"]
        CAD["Cadastros<br/>clientes, produtos, fornecedores"]
        AUD["Auditoria<br/>quem fez o quê, quando"]
        NOT["Notificações<br/>e-mail, WhatsApp"]
        REL["Relatórios e painéis"]
    end
    subgraph ESP["Parte específica (o que muda)"]
        E1["Funil de vendas (CRM)"]
        E2["Estoque, compras, NF (ERP)"]
        E3["Contas, conciliação (Financeiro)"]
        E4["Conversas, filas, SLA (Atendimento)"]
    end
    BASE --> ESP
```
*Figura: a base comum de sistemas de gestão e a parte específica de cada tipo. A base é o que você reaproveita entre clientes.*

### Os cinco tipos, lado a lado

| Tipo | O problema que resolve | Entidades centrais | Pontos críticos |
|---|---|---|---|
| **CRM** | "Perdemos clientes porque ninguém faz follow-up" | Contato, empresa, oportunidade, etapa do funil, atividade | Histórico completo, lembretes, relatórios de conversão |
| **ERP** | "Não sei quanto tenho em estoque nem quanto lucro" | Produto, estoque, pedido de venda, pedido de compra, nota fiscal | Integridade do estoque, impostos, integração fiscal |
| **Financeiro** | "Não sei se vou ter dinheiro no fim do mês" | Conta bancária, lançamento, categoria, conta a pagar e a receber | **Precisão absoluta nos valores**, conciliação, auditoria |
| **Atendimento** | "Clientes reclamam que ninguém responde" | Conversa, mensagem, fila, atendente, tíquete | Tempo real, integração com WhatsApp, tempo de resposta |
| **SaaS** | "Quero vender o mesmo sistema para muitas empresas" | Empresa assinante, plano, assinatura, fatura | Isolamento entre empresas, cobrança automática, escala |

Repare: **SaaS não é um tipo de sistema, é um modelo de negócio.** Você pode ter um CRM SaaS, um financeiro SaaS, um sistema de atendimento SaaS. O que torna algo SaaS é: muitas empresas usando o mesmo sistema, cada uma isolada, pagando assinatura. É por isso que o Gestor é um CRM com financeiro **em modelo SaaS**: ele treina as duas coisas.

### Sistema sob medida × SaaS × sistema interno

Você quer trabalhar nos três modelos. Eles mudam a forma de construir:

| | Sob medida para um cliente | Sistema interno (sua operação) | SaaS (vender em escala) |
|---|---|---|---|
| Quem usa | Uma empresa | Sua equipe | Muitas empresas |
| Multi-tenant | Normalmente não | Não | **Obrigatório** |
| Cobrança | Projeto + mensalidade de manutenção | Nenhuma | Assinatura automática |
| Personalização | Alta | Alta | Baixa (configurações, não código) |
| Risco principal | Escopo crescer sem controle | Ninguém documentar | Uma falha atinge todos os clientes de uma vez |
| Onde está o lucro | Hora de desenvolvimento + manutenção recorrente | Economia de tempo | Muitos clientes pagando pouco cada |

> 💡 **Estratégia que muitos desenvolvedores usam:** construir um sistema sob medida para um cliente, **mantendo o direito de reaproveitar o código** (isso vai no contrato, Módulo 17), e depois transformá-lo em SaaS para outras empresas do mesmo setor. A clínica que pagou pelo sistema de agenda vira seu primeiro cliente do "Agenda SaaS para clínicas".

### Exemplo completo: o mesmo esqueleto, três clientes

Você recebe três pedidos no mesmo mês:

1. **Autopeças Silva** quer controlar estoque e vendas no balcão (ERP).
2. **Imobiliária Lar Novo** quer acompanhar os interessados em cada imóvel (CRM).
3. **Escritório Contábil Exato** quer controlar os honorários a receber de 80 clientes (financeiro).

Os três precisam de: login com papéis, cadastro de clientes, auditoria, notificações, relatórios. Você constrói essa base uma vez, com qualidade, e reaproveita. A parte específica de cada um é talvez 30% do trabalho. **Isso muda o seu preço e o seu prazo**: você não está começando do zero três vezes. No Módulo 17 você vai aprender a precificar levando isso em conta, sem cobrar barato demais.

### Os pontos que mais derrubam cada tipo de sistema

- **Financeiro:** usar números com vírgula flutuante para dinheiro (R$ 0,10 + R$ 0,20 vira R$ 0,30000000000000004). Solução no Módulo 5: guardar em centavos, como número inteiro.
- **ERP:** duas vendas simultâneas baixando o mesmo último item do estoque. Solução no Módulo 7: transações.
- **Atendimento:** perder mensagens quando o WhatsApp manda notificações repetidas ou fora de ordem. Solução no Módulo 11: idempotência.
- **SaaS:** um cliente ver os dados de outro. Solução no Módulo 9: isolamento por empresa em todas as consultas.
- **Todos:** não ter histórico de quem alterou o quê. Solução: tabela de auditoria, desde o primeiro dia.

> 📌 **Em resumo**
> - ERP, CRM, financeiro e atendimento compartilham uma base comum (login, empresas, cadastros, auditoria, notificações, relatórios).
> - SaaS é um modelo de negócio: muitas empresas, isoladas, pagando assinatura.
> - Reaproveitar a base entre clientes é o que dá velocidade e margem.
> - Cada tipo tem armadilhas conhecidas; você vai aprender a solução de cada uma ao longo da formação.

---

## Aula 1.5: Vitória cedo: seu primeiro app no ar em uma tarde

Chega de teoria por um momento. Nesta aula você vai pedir ao Claude um app pequeno e colocá-lo no ar, com link para mandar a alguém. A diferença em relação ao que você já fazia: desta vez você vai **entender cada passo** usando o mapa das aulas anteriores.

> 💡 Se ainda não tem o Claude Code instalado, você pode fazer esta aula usando o Claude no navegador (claude.ai) para gerar o código, e repetir no Claude Code depois do Módulo 2. O objetivo aqui é o ciclo, não a ferramenta.

### O app: calculadora de preço de serviço

Um app de uma tela só: a pessoa informa horas de trabalho, valor da hora e custos extras, e o app mostra o preço sugerido com margem. Simples, útil (você mesmo vai usar) e sem banco de dados, para focar no ciclo.

### Passo 1: peça com clareza

Em vez de "faça uma calculadora", use um pedido com **objetivo, requisitos e restrições**. Esse formato vai se repetir na formação inteira:

```text
Quero criar um app web simples de uma página: uma calculadora de preço de serviço.

Objetivo: o usuário informa horas estimadas, valor da hora e custos extras,
e escolhe uma margem (20%, 30% ou 40%). O app mostra o custo total e o preço sugerido.

Requisitos:
- Uma única página, em português, que funcione bem no celular.
- Valores em reais, formatados como R$ 1.234,56.
- Cálculo feito em centavos (números inteiros) para evitar erro de arredondamento.
- Sem banco de dados e sem login.

Restrições:
- Use HTML, CSS e JavaScript puros, em um único arquivo index.html.
- Não use bibliotecas externas.

Antes de escrever o código, me explique em 5 linhas como você vai organizar o arquivo.
```

Repare na última linha: **pedir a explicação antes do código**. É o primeiro hábito de sênior. Se a explicação não fizer sentido, você corrige antes de gastar tempo.

### Passo 2: leia o que foi gerado (mesmo sem entender tudo)

Abra o `index.html` e identifique as três partes:
- `<style>`: a aparência (CSS).
- O HTML: a estrutura (campos, botão, resultado).
- `<script>`: o comportamento (JavaScript que faz a conta).

Procure a função que calcula. Pergunte ao Claude: *"explique linha por linha a função de cálculo, como se eu nunca tivesse programado"*. Você não precisa dominar JavaScript agora. Precisa criar o hábito de **não aceitar código que você não consegue explicar**.

### Passo 3: teste como um cliente chato

Abra o arquivo no navegador (clique duas vezes nele) e tente quebrar:
- E se eu deixar um campo vazio?
- E se eu digitar letras? Números negativos? 999999999?
- E se eu usar vírgula (`150,50`) em vez de ponto?
- Fica bom no celular? (No navegador, F12 e depois o ícone de celular.)

Anote cada problema e peça a correção, **um problema por vez**. Esse é o ciclo que você vai aprofundar no Módulo 3.

### Passo 4: coloque no ar

Para um site de um arquivo só, você pode usar uma hospedagem de sites estáticos (que só entrega arquivos prontos, sem backend). Siga o caminho pelo GitHub, porque ele será o padrão de toda a formação:

1. Crie uma conta no GitHub e um repositório chamado `calculadora-preco` (público).
2. Envie o `index.html` pelo botão "Add file → Upload files".
3. Vá em **Settings → Pages**, escolha a branch `main` e salve.
4. Em um ou dois minutos, o GitHub mostra o link: `https://seu-usuario.github.io/calculadora-preco/`.

Abra no celular. Mande para alguém. Você tem um app no ar.

### Passo 5: entenda o que aconteceu

Volte ao mapa e responda (vai fazer parte do entregável):

```mermaid
flowchart LR
    VC["Você"] -->|"envia o código"| GH["GitHub<br/>repositório"]
    GH -->|"publica"| GP["GitHub Pages<br/>servidor de arquivos"]
    U["Usuário no celular"] -->|"DNS + HTTPS"| GP
    GP -->|"entrega index.html"| U
    U -->|"o cálculo roda<br/>no navegador"| U
```
*Figura: o que aconteceu ao publicar a calculadora. Não há backend nem banco: o servidor só entrega o arquivo e o cálculo roda no navegador do usuário.*

- Onde está o frontend? (Todo o app.)
- Onde está o backend? (Não há. O GitHub Pages só entrega arquivos.)
- Onde roda o cálculo? (No navegador do usuário.)
- O que aconteceria se o app precisasse guardar os orçamentos de cada usuário? (Precisaria de backend e banco de dados, e de login, para cada um ver só os seus. É isso que você vai construir a partir do Módulo 5.)
- O link tem cadeado? (Sim, o GitHub Pages fornece HTTPS automaticamente.)

> ⚠️ **Por que isso não é um "sistema" ainda:** como o cálculo roda no navegador, qualquer pessoa pode alterá-lo. Para uma calculadora pessoal, tudo bem. Para um orçamento que o cliente vai pagar, o cálculo oficial precisaria estar no backend. Essa é exatamente a fronteira da Aula 1.1.

> 📌 **Em resumo**
> - Peça com objetivo, requisitos e restrições, e peça a explicação antes do código.
> - Não aceite código que você não consegue explicar; peça ao Claude para explicar linha por linha.
> - Teste tentando quebrar, e corrija um problema por vez.
> - Ao publicar, identifique no mapa onde roda cada parte.

### Para ir além
- [Hello World no GitHub (documentação oficial, em português)](https://docs.github.com/pt/get-started/using-github/hello-world)

---

## Exercícios

### Exercício 1: O garçom em ação (40 min)
**Objetivo:** ver requisições HTTP de verdade.
1. Abra qualquer sistema web que você usa (o painel do seu banco, um e-commerce, o Gmail).
2. Aperte F12, vá na aba **Rede** (Network) e recarregue a página.
3. Clique em 5 requisições diferentes e anote: método, caminho, código de status.
4. Encontre pelo menos uma requisição que busca dados (normalmente devolve JSON) e veja a resposta na aba "Resposta" ou "Preview".

**O que observar:** quantas requisições uma única página faz; quais são de arquivos (imagens, scripts) e quais são de dados (API).

### Exercício 2: Detetive de DNS (30 min)
**Objetivo:** usar as ferramentas de diagnóstico da Aula 1.2.
1. No terminal (no Windows, "Prompt de Comando" ou "PowerShell"; no Mac, "Terminal"), rode `nslookup google.com.br` e anote o IP.
2. Rode `nslookup` para o site da sua empresa ou de uma empresa conhecida.
3. Rode `curl -I https://www.google.com.br` e identifique o código de status e dois cabeçalhos.
4. Rode `curl -I http://www.google.com.br` (sem o "s") e veja o que acontece.

<details>
<summary><strong>Resolução comentada</strong></summary>

- O `nslookup` mostra um ou mais IPs. Sites grandes devolvem vários, porque distribuem o acesso entre muitos servidores.
- O `curl -I` mostra só os cabeçalhos. Para o Google, normalmente aparece `HTTP/2 200` e cabeçalhos como `content-type` e `date`.
- No passo 4, você deve ver um código `301` com um cabeçalho `location` apontando para a versão `https`. É o servidor dizendo "aqui não, vá pelo caminho seguro". Seus sistemas devem fazer o mesmo: qualquer acesso por HTTP é redirecionado para HTTPS.
</details>

### Exercício 3: Onde mora cada coisa (45 min)
**Objetivo:** classificar onde o código deve rodar.
Para cada item, diga se deve rodar no **navegador**, no **servidor** ou nos **dois**, e por quê:
1. Verificar se o e-mail digitado tem um "@".
2. Calcular o desconto de um pedido.
3. Mostrar uma mensagem "campo obrigatório" em vermelho.
4. Conferir se o usuário pode ver o relatório financeiro.
5. Gerar o PDF de uma nota fiscal.
6. Guardar a chave da API do WhatsApp.

<details>
<summary><strong>Resolução comentada</strong></summary>

1. **Os dois.** No navegador para dar retorno imediato; no servidor porque o navegador pode ser burlado.
2. **Servidor.** Se o cálculo fica só no navegador, o usuário pode alterá-lo e pagar menos. Pode haver uma prévia no navegador, mas o valor oficial vem do servidor.
3. **Navegador.** É só experiência; não protege nada.
4. **Servidor, obrigatoriamente.** O navegador pode esconder o botão, mas quem garante é o servidor.
5. **Servidor.** Envolve dados oficiais e possivelmente certificados digitais.
6. **Servidor**, em variável de ambiente. Nunca no navegador.
</details>

### Exercício 4: Classifique os sistemas (30 min)
**Objetivo:** reconhecer a anatomia da Aula 1.4.
Pense em três empresas que você conhece (pode ser a sua). Para cada uma, escreva: qual tipo de sistema mais resolveria a dor dela (ERP, CRM, financeiro, atendimento), quais seriam as 4 entidades centrais e qual seria o ponto crítico.

### Exercício 5: Quebre a calculadora (60 min)
**Objetivo:** praticar o teste de cliente chato.
Com a calculadora da Aula 1.5 no ar, faça uma lista de pelo menos 8 testes de entrada estranha, rode todos, registre o que aconteceu e peça ao Claude a correção de cada falha, uma por vez. Publique a versão corrigida.

---

## Tarefa de campo

**Disseque um sistema real que você usa no trabalho** (o sistema da sua empresa, o de um fornecedor, um SaaS que você assina).

1. Use-o por 20 minutos com as ferramentas do navegador abertas (F12 → Rede).
2. Desenhe (no papel, no Excalidraw ou em qualquer ferramenta) a arquitetura provável: frontend, backend, API, banco, serviços externos que você consegue identificar (pagamento, mapas, chat).
3. Anote: o domínio usa HTTPS? Qual tipo de sistema é (ERP, CRM...)? É SaaS?
4. Liste 3 coisas que você acha que estão **no backend** e não aparecem para você.
5. Registre tudo no seu diário de decisões (trilha de portfólio).

---

## Entregável: Primeiro app no ar + diagrama da arquitetura

Entregue em um documento (pode ser o README do repositório da calculadora):

1. O link público da calculadora.
2. O diagrama da arquitetura dela (como o da Aula 1.5).
3. O diagrama da arquitetura do sistema real da tarefa de campo.
4. Um parágrafo explicando, com suas palavras, o caminho de uma requisição.

**Checklist de qualidade:**
- [ ] O link abre no celular, com cadeado (HTTPS).
- [ ] A calculadora trata campos vazios, letras e números negativos sem quebrar.
- [ ] Os valores aparecem em reais, no formato brasileiro.
- [ ] O diagrama mostra onde roda cada parte.
- [ ] O parágrafo menciona DNS, HTTPS e código de status.
- [ ] Você consegue explicar cada linha da função de cálculo.

---

## Autoavaliação

Responda sem consultar. Meta: 8 de 10.

1. Qual é a diferença de papel entre frontend e backend, e por que uma regra de permissão nunca pode ficar só no frontend?
2. Um cliente reclama que recebe "erro 403" ao abrir o relatório. O que isso indica e onde você começaria a investigar?
3. E se fosse "erro 502"?
4. Para que serve o DNS? Qual registro você usaria para apontar `app.cliente.com.br` para `cliente.onrender.com`?
5. Cite as três garantias do HTTPS.
6. O Claude sugeriu guardar a chave do Mercado Pago em `NEXT_PUBLIC_MP_KEY`. O que está errado e o que você pede no lugar?
7. Qual é a diferença entre VPS e PaaS em termos de responsabilidade?
8. Por que é perigoso usar dados reais de clientes no seu computador de desenvolvimento?
9. Uma loja quer controlar estoque, pedidos e nota fiscal. Que tipo de sistema é esse e qual o ponto crítico?
10. O que torna um sistema "SaaS"? Cite o principal risco técnico desse modelo.

<details>
<summary><strong>Gabarito</strong></summary>

1. O frontend é a interface que roda no navegador do usuário; o backend roda no servidor e aplica as regras. Como o frontend está nas mãos do usuário, qualquer verificação feita só ali pode ser burlada (chamando a API direto ou alterando o código no navegador). Permissão precisa ser verificada no backend.
2. 403 significa "você está identificado, mas não tem permissão". Comece pelas permissões daquele usuário no backend: qual o papel dele, se pertence à empresa certa, se a regra de acesso ao relatório está correta.
3. 502 é um problema do servidor: o intermediário (proxy ou plataforma) não conseguiu falar com a aplicação. A aplicação caiu, está reiniciando ou travou. Olhe o status da hospedagem e os logs da aplicação.
4. O DNS traduz nomes de domínio em endereços IP. Para apontar um nome para outro nome, use um registro **CNAME**.
5. Sigilo (ninguém lê no caminho), integridade (ninguém altera no caminho) e identidade (o certificado prova quem é o servidor).
6. Variáveis com `NEXT_PUBLIC_` são embutidas no código que vai para o navegador, então a chave ficaria visível para qualquer pessoa. Peça para usar uma variável sem esse prefixo e fazer a chamada ao Mercado Pago a partir do servidor.
7. Na VPS você recebe uma máquina vazia e é responsável por instalar, atualizar e proteger tudo (sistema operacional, firewall, HTTPS). Na PaaS a plataforma cuida do servidor e você só cuida do código e da configuração da aplicação.
8. Porque o seu computador é menos protegido que o servidor (pode ser roubado, ter vírus, sincronizar arquivos com nuvens pessoais), e a LGPD exige que dados pessoais sejam tratados só para a finalidade e com a segurança adequadas. Use dados inventados.
9. É um ERP. Ponto crítico: integridade do estoque (vendas simultâneas não podem vender o mesmo item duas vezes) e a parte fiscal.
10. SaaS é o modelo em que muitas empresas usam o mesmo sistema, cada uma isolada, pagando assinatura. O principal risco técnico é uma empresa conseguir ver dados de outra (falha de isolamento), e uma falha atingir todos os clientes de uma vez.
</details>

---

## Checklist de segurança do módulo

(Parte da [trilha Segurança desde o 1º dia](trilha-seguranca-desde-o-dia-1.md).)
- [ ] Sei explicar por que permissão é verificada no backend.
- [ ] Sei que segredos ficam em variáveis de ambiente, nunca no código nem com `NEXT_PUBLIC_`.
- [ ] Todo link que publico tem HTTPS.
- [ ] Não uso dados reais de clientes no meu computador.

---

## Para aprofundar (opcional)

| Material | Formato | Por que vale |
|---|---|---|
| [Visão geral do HTTP (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview) | Texto, em português | A referência mais confiável sobre HTTP |
| [The Twelve-Factor App](https://12factor.net/pt_br/) | Texto, em português | Princípios usados por quase toda plataforma moderna de hospedagem |
| [O que é HTTPS (Cloudflare)](https://www.cloudflare.com/pt-br/learning/ssl/what-is-https/) | Texto, em português | Explicação visual do cadeado |
