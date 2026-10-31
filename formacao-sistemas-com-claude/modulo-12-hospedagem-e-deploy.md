# Módulo 12: Hospedagem, servidor e deploy

**Semanas 23 e 24 · cerca de 26 horas**

## Objetivos de aprendizagem

Hoje, quando o Claude diz "vamos hospedar na Vercel" ou "suba na VPS", você segue sem saber o que está por trás. Neste módulo você coloca o Gestor no ar **duas vezes**: primeiro em uma plataforma gerenciada (PaaS), depois em um servidor próprio (VPS) montado do zero. E aprende a peça que mais protege contra o "sistema caiu depois da atualização": o deploy automático, testado, que não derruba o sistema e que volta atrás em minutos.

Ao final deste módulo você será capaz de:
1. Registrar um domínio e configurar o DNS para o sistema e para o e-mail.
2. Publicar o Gestor em uma PaaS com banco gerenciado, HTTPS e domínio próprio.
3. Gerenciar variáveis de ambiente e manter homologação e produção separados.
4. Empacotar a aplicação com Docker.
5. Montar uma VPS segura do zero, com proxy reverso e HTTPS.
6. Automatizar testes e deploy com GitHub Actions.
7. Publicar sem derrubar o sistema e voltar à versão anterior quando algo der errado.

### Como estudar este módulo
```mermaid
flowchart LR
    A["Aulas 12.1 a 12.3<br/>domínio, PaaS, ambientes"] --> P["Gestor no ar<br/>em PaaS"]
    P --> B["Aulas 12.4 e 12.5<br/>Docker e VPS"]
    B --> V["Gestor no ar<br/>em VPS"]
    V --> C["Aulas 12.6 e 12.7<br/>CI/CD e deploy seguro"]
    C --> EN["Entregável: deploy<br/>automático com rollback"]
    EN --> AV["Autoavaliação"]
```
*Figura: o módulo publica o Gestor primeiro em PaaS, depois em VPS, e termina com o deploy automático e seguro.*

| Semana | O que fazer | Horas |
|---|---|---|
| 23 | Aulas 12.1 a 12.3, Gestor em PaaS, exercícios 1 e 2 | 12 |
| 24 | Aulas 12.4 a 12.7, VPS, CI/CD, exercícios 3 a 5, entregável, autoavaliação | 14 |

---

## Aula 12.1: Domínio e DNS na prática

O domínio é o endereço da empresa na internet, e um dos ativos mais esquecidos. Domínio vencido é uma das causas mais comuns (e mais evitáveis) de sistema fora do ar, e um domínio mal configurado deixa os e-mails da empresa caírem no spam ou serem falsificados.

### Registrando o domínio

- Domínios `.com.br` são registrados no **Registro.br**; `.com` e outros em registradores internacionais.
- **Em nome de quem?** Para um sistema de cliente, o domínio deve ser **do cliente** (CNPJ dele), não seu. Você pode ser contato técnico. Se você sumir, o cliente não perde o próprio endereço. Isso entra no Dossiê de Confiança.
- **Renovação automática** ligada, com cartão válido, e alerta de vencimento no seu calendário e no monitoramento (Módulo 15).
- **2FA** na conta do registrador: quem invade essa conta pode apontar o domínio para outro lugar e roubar tudo (inclusive e-mails de recuperação de senha).

### Onde fica o DNS

O registrador indica quais **servidores de DNS** respondem pelo domínio. Você pode usar o DNS do próprio registrador ou de um provedor de DNS (como Cloudflare), que costuma oferecer painel melhor, mudanças rápidas e proteções extras.

### O mapa de DNS de um sistema

| Nome | Tipo | Aponta para | Para quê |
|---|---|---|---|
| `gestor.com.br` | A ou CNAME | Site institucional | Página de vendas |
| `app.gestor.com.br` | CNAME | Plataforma de hospedagem (ex.: `gestor.up.railway.app`) | O sistema |
| `homolog.gestor.com.br` | CNAME | Ambiente de homologação | Testes antes da produção |
| `notificacoes.gestor.com.br` | TXT (SPF), CNAME (DKIM) | Provedor de e-mail | E-mails transacionais (Aula 11.4) |
| `_dmarc.gestor.com.br` | TXT | Política DMARC | Proteção contra falsificação |
| `gestor.com.br` | MX | Provedor de e-mail da empresa | Caixas de e-mail |
| `gestor.com.br` | CAA | Autoridades certificadoras permitidas | Só elas podem emitir certificados HTTPS para o domínio |

> 💡 **Registro CAA:** diz quais autoridades podem emitir certificados para o seu domínio (por exemplo, só o Let's Encrypt). É uma proteção barata contra certificados emitidos indevidamente.

### Mudando o DNS sem susto

1. **Antes:** reduza o TTL dos registros que vai mudar (por exemplo, para 300 segundos) com 1 dia de antecedência.
2. **Mude** fora do horário de pico.
3. **Confira** com `nslookup app.gestor.com.br` (e em um verificador online de propagação).
4. **Depois de estável**, volte o TTL para um valor maior.
5. **Registre** a mudança no diário.

### Exemplo completo: o domínio da Ótica Visão Clara

- Domínio `oticavisaoclara.com.br` registrado no Registro.br **no CNPJ da ótica**, com a dona como titular e você como contato técnico.
- DNS no provedor de DNS, com 2FA.
- `sistema.oticavisaoclara.com.br` → CNAME para a plataforma de hospedagem.
- SPF, DKIM e DMARC configurados para o subdomínio de notificações.
- Renovação automática ligada; vencimento registrado no monitoramento com alerta 30 dias antes.

> 📌 **Em resumo**
> - O domínio do cliente fica no nome do cliente; você é contato técnico.
> - Renovação automática, alerta de vencimento e 2FA no registrador e no DNS.
> - Mapa de DNS: sistema, homologação, e-mail (SPF, DKIM, DMARC, MX) e CAA.
> - Mude DNS com TTL reduzido antes, conferindo depois.

### Para ir além
- [O que é DNS (Cloudflare, em português)](https://www.cloudflare.com/pt-br/learning/dns/what-is-dns/)

---

## Aula 12.2: O Gestor no ar em uma PaaS

A PaaS é o caminho recomendado para os seus primeiros projetos de clientes (Aula 6.3): a plataforma cuida do servidor, do sistema operacional e do HTTPS, e você cuida da aplicação. Nesta aula você publica o Gestor completo: aplicação web, trabalhador de tarefas, banco gerenciado e domínio.

### O que você vai montar

```mermaid
flowchart LR
    GH["GitHub<br/>branch main"] -->|"deploy automático"| WEB["Serviço web<br/>Next.js"]
    GH -->|"deploy automático"| WK["Serviço worker<br/>fila e agendamentos"]
    WEB --> DB[("PostgreSQL gerenciado<br/>sem acesso público")]
    WK --> DB
    U["Usuários"] -->|"HTTPS<br/>app.gestor.com.br"| WEB
    WEB --> EXT["Provedores:<br/>pagamento, WhatsApp, e-mail"]
    WK --> EXT
```
*Figura: o Gestor em uma PaaS. Dois serviços do mesmo código (web e worker), um banco gerenciado privado e o domínio com HTTPS.*

### Escolhendo a plataforma

Railway, Render e Vercel são opções populares (há outras). Critérios para o Gestor:

| Critério | Por quê |
|---|---|
| Suporta **processo contínuo** (worker) além do web | O Gestor tem fila e agendamentos (Aula 7.5) |
| Oferece **PostgreSQL gerenciado** com backups, ou integra bem com um (Neon, Supabase, outros) | Banco é a peça mais crítica |
| **Região** próxima do Brasil (ou no Brasil) | Latência e conversa sobre dados (Aula 6.3) |
| **Rede privada** entre aplicação e banco | Banco sem acesso público |
| Deploy por `git push`, com **ambientes** (homologação e produção) | Fluxo da Aula 12.6 |
| **Logs**, métricas e reinício automático | Operação (Módulo 15) |
| Preço previsível e alertas de gasto | Aula 6.5 |

> 💡 A Vercel é excelente para Next.js, mas funciona no modelo serverless: tarefas contínuas (worker) e conexões longas (tempo real) precisam de outra peça (um serviço de filas e agendamentos gerenciado, ou um worker hospedado em outro lugar). Railway e Render rodam processos contínuos com mais naturalidade. Registre a escolha em ADR.

### O passo a passo (genérico)

1. **Crie o projeto** na plataforma e conecte o repositório do GitHub.
2. **Crie o banco** PostgreSQL gerenciado, na mesma região, **sem acesso público** (só pela rede privada).
3. **Crie dois serviços** do mesmo repositório:
   - `web`: comando de início `npm run start` (depois de `npm run build`).
   - `worker`: comando de início `npm run worker`.
4. **Configure as variáveis de ambiente** (Aula 12.3) em cada serviço.
5. **Migrations no deploy:** antes de iniciar a nova versão, rode `npx prisma migrate deploy` (a maioria das plataformas tem um "comando de pré-deploy").
6. **Verificação de saúde:** configure a rota `/api/saude` (que confere se a aplicação e o banco respondem) para a plataforma saber se a nova versão subiu bem antes de mandar tráfego para ela.
7. **Domínio:** adicione `app.gestor.com.br`, crie o CNAME indicado, aguarde o certificado HTTPS automático.
8. **Teste de ponta a ponta** em produção com uma empresa de teste.

### A rota de saúde

```typescript
// src/app/api/saude/route.ts
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", versao: process.env.APP_VERSAO });
  } catch {
    return Response.json({ status: "erro" }, { status: 503 });
  }
}
```

Ela não exige login e **não devolve nenhum dado** além de "ok" e a versão. Será usada pela plataforma, pelo monitoramento (Módulo 15) e por você.

### Exemplo completo: o primeiro deploy do Gestor

Pedido ao Claude (antes de mexer na plataforma, que você configura pelo painel):

```text
Prepare o Gestor para deploy em PaaS:
1. Scripts no package.json: build, start, worker, migrate:deploy.
2. Rota /api/saude conforme a Aula 12.2.
3. Validação das variáveis de ambiente na inicialização (Zod), falhando com
   mensagem clara se faltar alguma.
4. docs/deploy.md com: serviços, comandos, variáveis necessárias (sem valores),
   ordem de deploy (migrations antes) e como verificar.
5. Garanta que o worker e o web podem rodar do mesmo código com comandos diferentes.
Não use nada específico de uma plataforma no código.
```

A última linha importa: código sem amarras a uma plataforma permite trocar de hospedagem (inclusive para a VPS da Aula 12.5) sem reescrever.

> 📌 **Em resumo**
> - Na PaaS, o Gestor tem dois serviços do mesmo código (web e worker) e um banco gerenciado privado.
> - Escolha a plataforma por suporte a worker, banco, região, rede privada, ambientes, logs e preço.
> - Migrations antes de iniciar a nova versão; rota de saúde para a plataforma conferir a subida.
> - Código sem amarras a uma plataforma.

### Para ir além
- [Documentação da Railway (em inglês)](https://docs.railway.com/)
- [Documentação da Render (em inglês)](https://render.com/docs)
- [Documentação da Vercel (em inglês)](https://vercel.com/docs)

---

## Aula 12.3: Variáveis de ambiente, homologação e produção

A maior parte dos desastres em produção não vem de código ruim, vem de **configuração errada**: a chave de teste do pagamento em produção, a homologação apontando para o banco de produção, um segredo exposto num print. Esta aula organiza a configuração para que esses erros fiquem difíceis de cometer.

### Dois ambientes, separados de verdade

| | Homologação (staging) | Produção |
|---|---|---|
| Endereço | `homolog.gestor.com.br` | `app.gestor.com.br` |
| Banco | **Próprio**, com dados fictícios | Próprio, com dados reais |
| Pagamentos | Chaves de **teste** (sandbox) | Chaves de produção |
| WhatsApp | Número de teste | Números reais |
| E-mail | Envio só para endereços seus (ou para uma caixa de testes) | Envio real |
| Quem acessa | Você e quem testa | Clientes |
| Deploy | A cada merge na branch de homologação (ou na `main`) | Após aprovação (Aula 12.6) |

> ⚠️ **Homologação nunca usa dados reais nem conecta no banco de produção.** E nunca envia e-mail ou WhatsApp para clientes reais. Um teste de "régua de cobrança" em homologação que dispara mensagens para os clientes verdadeiros é um incidente.

### Organizando as variáveis

```bash
# .env.example (vai para o Git, sem valores)
APP_AMBIENTE=""            # desenvolvimento | homologacao | producao
APP_URL=""
DATABASE_URL=""
BETTER_AUTH_SECRET=""
CHAVE_MESTRA_CRIPTOGRAFIA=""
PAGAMENTOS_PROVEDOR=""
ASAAS_API_URL=""
ASAAS_API_KEY=""
ASAAS_WEBHOOK_TOKEN=""
WHATSAPP_APP_SECRET=""
EMAIL_API_KEY=""
ANTHROPIC_API_KEY=""
SENTRY_DSN=""
```

Regras:
1. **Cada ambiente tem os seus valores**, configurados no painel da plataforma, nunca em arquivo no repositório.
2. **Segredos diferentes por ambiente.** O `BETTER_AUTH_SECRET` de homologação não é o de produção.
3. **Validação na inicialização** (Aula 7.4), incluindo uma trava de coerência: se `APP_AMBIENTE=producao` e a chave de pagamento é de teste (ou o contrário), o sistema se recusa a iniciar.
4. **Quem vê os segredos de produção:** só quem precisa. Na plataforma, use papéis e 2FA.
5. **Nunca** cole segredos em conversas, tickets, prints ou documentos. Se precisar compartilhar com alguém, use o gerenciador de senhas.

### Gerando segredos fortes

Segredos de sessão e chaves de criptografia devem ser **aleatórios e longos**. Gere com:

```bash
openssl rand -base64 32
```

Nunca use frases, nomes ou "123456" para segredos, nem em homologação.

### O seu computador também é um ambiente

- O seu `.env` local tem chaves **de teste** apenas.
- Você **não** tem a `DATABASE_URL` de produção no seu computador no dia a dia. Quando precisar investigar, use um usuário **somente leitura**, por um período, e registre.
- O Claude Code roda no seu computador: mais um motivo para que a produção não esteja ao alcance dele (Aula 2.4).

### Exemplo completo: a trava que evitou um desastre

Um dia, ao configurar a produção de um cliente novo, você copiou as variáveis de homologação e esqueceu de trocar a chave do Asaas. Na inicialização:

```text
Erro de configuração: APP_AMBIENTE=producao mas ASAAS_API_URL aponta para o
sandbox. O sistema não vai iniciar. Corrija as variáveis de ambiente.
```

O deploy falhou na verificação de saúde, a versão anterior continuou no ar (Aula 12.7), e você corrigiu em 2 minutos. Sem a trava, o sistema teria subido "funcionando", gerando cobranças de mentira para clientes reais, e você só descobriria quando ninguém recebesse dinheiro.

> 📌 **Em resumo**
> - Homologação e produção totalmente separados: banco, chaves, números e e-mails.
> - Variáveis por ambiente no painel da plataforma; `.env.example` sem valores no Git.
> - Validação e trava de coerência na inicialização.
> - Segredos aleatórios e longos; produção fora do seu computador no dia a dia.

### Para ir além
- [The Twelve-Factor App, fator III: configuração (em português)](https://12factor.net/pt_br/)
- [Guia de gerenciamento de segredos da OWASP (em inglês)](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## Aula 12.4: Docker: a aplicação dentro de uma caixa

"No meu computador funciona" é uma das frases mais antigas da programação. O **Docker** resolve isso empacotando a aplicação com tudo o que ela precisa (versão do Node, bibliotecas, comandos) em uma **imagem** que roda igual em qualquer lugar: no seu computador, na VPS, em outra nuvem.

### Conceitos

| Conceito | O que é | Analogia |
|---|---|---|
| **Imagem** | O pacote pronto da aplicação, imutável | A receita congelada |
| **Contêiner** | Uma imagem em execução | O prato servido |
| **Dockerfile** | O arquivo que descreve como montar a imagem | A receita escrita |
| **Docker Compose** | Um arquivo que descreve vários contêineres juntos (aplicação, worker, proxy) | O cardápio do jantar |
| **Volume** | Pasta que sobrevive quando o contêiner é recriado | A despensa |

### Um Dockerfile seguro para o Gestor

```dockerfile
# Etapa 1: construir
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# Etapa 2: imagem final, só com o necessário
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
USER node                      # não roda como administrador (root)
EXPOSE 3000
CMD ["npm", "run", "start"]
```

O que observar:
- **Duas etapas:** a imagem final não carrega ferramentas de construção nem o código-fonte desnecessário (menor e com menos superfície de ataque).
- **`USER node`:** a aplicação não roda como administrador do contêiner. Se for invadida, o estrago é menor.
- **Versão fixada da imagem base** (`node:22-alpine`); atualizada de propósito, não por acaso.
- **Nenhum segredo dentro da imagem.** Variáveis de ambiente são passadas na hora de rodar. Confira o `.dockerignore` (como o `.gitignore`): `.env`, `.git`, `node_modules` não entram.

> ⚠️ **Segredo dentro de imagem é segredo vazado.** Qualquer pessoa com acesso à imagem consegue extrair os arquivos. Nunca use `COPY .env` nem escreva segredos no Dockerfile.

### Docker Compose: tudo junto

```yaml
# docker-compose.yml (produção na VPS, simplificado)
services:
  web:
    image: ghcr.io/sua-conta/gestor:${VERSAO}
    env_file: /etc/gestor/producao.env      # fora do repositório, permissão restrita
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/saude"]
      interval: 30s
  worker:
    image: ghcr.io/sua-conta/gestor:${VERSAO}
    command: ["npm", "run", "worker"]
    env_file: /etc/gestor/producao.env
    restart: unless-stopped
  caddy:
    image: caddy:2
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_dados:/data
    restart: unless-stopped
volumes:
  caddy_dados:
```

Repare: só o **Caddy** (o proxy, Aula 12.5) expõe portas para a internet. A aplicação e o worker ficam na rede interna do Docker.

### Exemplo completo: rodando o Gestor em Docker no seu computador

```text
Crie Dockerfile, .dockerignore e docker-compose.dev.yml para o Gestor:
- Dockerfile em duas etapas, usuário não root, sem segredos.
- docker-compose.dev.yml com web, worker e um PostgreSQL local, com volume para
  os dados e senha só de desenvolvimento.
- .dockerignore com .env*, .git, node_modules, .next, coverage.
- Instruções em docs/deploy.md para subir com docker compose.
Depois de criar, rode docker compose up, mostre a rota /api/saude respondendo
e o tamanho final da imagem.
```

> 📌 **Em resumo**
> - Docker empacota a aplicação para rodar igual em qualquer lugar.
> - Dockerfile em duas etapas, usuário não root, versão fixada, nenhum segredo na imagem.
> - Docker Compose descreve aplicação, worker e proxy juntos; só o proxy fica exposto.
> - Segredos entram na hora de rodar, por arquivo protegido fora do repositório ou variáveis.

### Para ir além
- [Primeiros passos com Docker (em inglês)](https://docs.docker.com/get-started/)
- [Docker Compose (em inglês)](https://docs.docker.com/compose/)

---

## Aula 12.5: Uma VPS segura do zero

Agora você monta o seu próprio servidor. A VPS dá controle e custo previsível, e transfere para você a responsabilidade de mantê-la protegida. Um servidor esquecido, sem atualizações, com senha no SSH, é encontrado por robôs em horas. Esta aula ensina o mínimo que **todo** servidor seu precisa ter, desde o primeiro minuto.

### O roteiro de proteção inicial

```mermaid
flowchart TB
    A["1. Criar a VPS<br/>Ubuntu LTS, região próxima,<br/>já com sua chave SSH"] --> B["2. Atualizar o sistema"]
    B --> C["3. Criar usuário próprio<br/>com sudo"]
    C --> D["4. SSH só com chave<br/>sem senha, sem login de root"]
    D --> E["5. Firewall<br/>só portas 22, 80 e 443"]
    E --> F["6. Atualizações de<br/>segurança automáticas"]
    F --> G["7. Proteção contra<br/>tentativas em massa (fail2ban)"]
    G --> H["8. Docker + Caddy + Gestor"]
    H --> I["9. Backups e monitoramento<br/>(Módulos 14 e 15)"]
```
*Figura: o roteiro de proteção de uma VPS. Os passos 1 a 7 vêm antes de qualquer aplicação.*

### Os comandos essenciais (Ubuntu)

```bash
# 2. atualizar
sudo apt update && sudo apt upgrade -y

# 3. usuário próprio
adduser deploy && usermod -aG sudo deploy
# copiar sua chave pública para /home/deploy/.ssh/authorized_keys

# 4. SSH só com chave (em /etc/ssh/sshd_config ou em um arquivo em sshd_config.d/)
#    PasswordAuthentication no
#    PermitRootLogin no
sudo systemctl restart ssh      # ANTES, teste o login com chave em outra janela!

# 5. firewall
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable

# 6. atualizações automáticas de segurança
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades

# 7. proteção contra tentativas em massa no SSH
sudo apt install fail2ban -y
```

> ⚠️ **Não se tranque para fora.** Antes de desligar o login por senha, abra **outra** janela do terminal e confirme que consegue entrar com a chave. Se você desligar a senha sem a chave funcionando, perde o acesso (e terá que usar o console de emergência do provedor).

> 💡 **Use o Claude como copiloto, não como piloto, aqui.** Peça: *"explique cada comando antes de eu rodar e me diga como desfazer"*. E rode você mesmo, no servidor, conferindo cada saída. Não dê ao Claude Code acesso SSH ao servidor de produção com permissões amplas.

### Chave SSH: o que é

Em vez de senha, você entra no servidor com um par de chaves: a **privada** fica no seu computador (protegida por uma frase-senha), a **pública** fica no servidor. Gere com:

```bash
ssh-keygen -t ed25519 -C "seu-email"
```

Nunca compartilhe a chave privada. Se o seu computador for perdido, remova a chave pública dele de todos os servidores.

### Caddy: o porteiro com HTTPS automático

O **proxy reverso** é o programa que recebe as conexões da internet (portas 80 e 443) e as repassa para a aplicação. O **Caddy** faz isso e ainda obtém e renova certificados HTTPS sozinho (via Let's Encrypt).

```text
# Caddyfile
app.gestor.com.br {
    reverse_proxy web:3000
    encode gzip
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }
}
```

São poucas linhas para: HTTPS com renovação automática, redirecionamento de HTTP para HTTPS, compressão e alguns cabeçalhos de segurança (aprofundados no Módulo 13).

### O banco na VPS: gerenciado ou no servidor?

| | Banco gerenciado (fora da VPS) | PostgreSQL no próprio servidor |
|---|---|---|
| Backups | Automáticos, com restauração no painel | **Você** configura, testa e envia para fora |
| Atualizações | Do fornecedor | Suas |
| Se a VPS morrer | Os dados estão a salvo | Depende dos seus backups |
| Custo | Maior | Menor |

Recomendação desta formação: mesmo usando VPS para a aplicação, prefira **banco gerenciado** enquanto não dominar backup e restauração (Módulo 14). Se usar o banco no servidor, ele **não** expõe a porta 5432 para a internet (só a rede interna do Docker).

### Painéis de gestão (Coolify e similares)

Ferramentas como o Coolify instalam na sua VPS uma "PaaS própria": deploy por git, certificados, bancos, logs. Elas reduzem o trabalho, mas **não** eliminam a responsabilidade: o sistema operacional, o firewall, o SSH e as atualizações continuam sendo seus, e o próprio painel vira um alvo (proteja com 2FA e mantenha atualizado).

### Exemplo completo: a VPS do Gestor

1. VPS com Ubuntu LTS, 2 a 4 GB de memória, região próxima, criada já com sua chave SSH.
2. Passos 2 a 7 da tabela, conferidos um a um, com a saída registrada em `docs/servidor.md`.
3. Docker instalado (pelo método oficial).
4. `/etc/gestor/producao.env` com permissão `600` (só o dono lê), dono `deploy`.
5. `docker compose up -d` com a versão publicada da imagem.
6. DNS de `app.gestor.com.br` apontando para o IP da VPS (registro A); Caddy obtém o certificado.
7. Teste externo: `curl -I https://app.gestor.com.br/api/saude` → `200`; `curl -I http://...` → redireciona para HTTPS; `nmap` (ou um verificador online) mostra só as portas 22, 80 e 443 abertas.

> 📌 **Em resumo**
> - Antes de qualquer aplicação: atualizar, usuário próprio, SSH só com chave, firewall, atualizações automáticas, fail2ban.
> - Teste o acesso por chave antes de desligar a senha.
> - Caddy como proxy reverso com HTTPS automático e cabeçalhos de segurança.
> - Prefira banco gerenciado; se o banco estiver no servidor, nunca exponha a porta dele.

### Para ir além
- [Configuração inicial de servidor Ubuntu (DigitalOcean, em inglês)](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu)
- [Documentação do Caddy (em inglês)](https://caddyserver.com/docs/)
- [Documentação do Ubuntu Server (em inglês)](https://ubuntu.com/server/docs)

---

## Aula 12.6: CI/CD: testes e deploy automáticos

Deploy feito à mão é deploy feito com pressa, às vezes esquecendo um passo. **CI/CD** automatiza o caminho do código até a produção: todo pull request roda os testes, e o deploy acontece sempre do mesmo jeito, só se tudo passou. É a peça que mais reduz o "atualizei e caiu".

### CI e CD

| | O que faz | Quando |
|---|---|---|
| **CI** (integração contínua) | Roda verificação de tipos, lint, testes e auditoria de dependências | Em todo pull request e em todo push |
| **CD** (entrega/implantação contínua) | Constrói a versão e publica no ambiente | Após o merge, se a CI passou |

### O pipeline do Gestor

```mermaid
flowchart LR
    PR["Pull request"] --> CI["CI<br/>tipos · lint · testes ·<br/>isolamento · auditoria"]
    CI -->|"falhou"| X["Merge bloqueado"]
    CI -->|"passou"| M["Merge na main"]
    M --> B["Constrói a imagem<br/>com a versão (commit)"]
    B --> H["Deploy em homologação<br/>+ testes de ponta a ponta"]
    H --> A{"Aprovação<br/>manual"}
    A -->|"aprovado"| P["Deploy em produção<br/>migrations + saúde"]
    P --> S{"Saúde ok?"}
    S -->|"não"| RB["Mantém / volta<br/>a versão anterior"]
    S -->|"sim"| OK["No ar"]
```
*Figura: o pipeline do Gestor. Nada chega à produção sem passar pelos testes, pela homologação e por uma aprovação, e a saúde da nova versão é conferida antes de valer.*

### GitHub Actions: a CI em um arquivo

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read            # permissões mínimas
jobs:
  verificar:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: teste
        ports: ["5432:5432"]
    env:
      DATABASE_URL: postgresql://postgres:teste@localhost:5432/postgres
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npx prisma migrate deploy
      - run: npm test
      - run: npm audit --audit-level=high
```

Depois, em **Settings → Branches/Rulesets** do GitHub, exija que o job `verificar` passe antes do merge (Aula 2.3).

### Segredos na CI/CD

- Os segredos do deploy (token da plataforma, chave SSH de deploy) ficam em **Secrets** do GitHub, de preferência em **Environments** (`homologacao`, `producao`), com **aprovação obrigatória** para o ambiente de produção.
- A CI de pull requests **não** recebe segredos de produção.
- Permissões mínimas no `GITHUB_TOKEN` (`permissions:` no arquivo).
- Ações de terceiros (`uses:`) só de fontes confiáveis, com versão fixada.
- Para deploy em VPS, uma chave SSH **exclusiva** para o deploy, com acesso só ao usuário `deploy`.

### Versão rastreável

Cada deploy carrega a **versão** (o hash do commit ou uma tag). Ela aparece na rota de saúde, nos logs e na ferramenta de erros. Quando um erro novo surgir, você sabe exatamente qual versão o introduziu, e qual é a anterior para voltar.

### Exemplo completo: o pedido do pipeline

```text
Crie o pipeline de CI/CD do Gestor no GitHub Actions:
1. ci.yml: em PR e push na main; Postgres de teste como serviço; tipos, lint,
   migrations, testes unitários e de integração (incluindo isolamento),
   npm audit nível high. Permissões mínimas.
2. deploy.yml: após CI verde na main, constrói a imagem com a tag do commit,
   publica no registro, faz deploy em homologação e roda os testes Playwright
   contra homologação. Depois, job de produção no environment "producao"
   (que terá aprovação obrigatória configurada por mim no GitHub).
3. Nenhum segredo de produção disponível em jobs de pull request.
4. Ações de terceiros com versão fixada.
Documente em docs/deploy.md como aprovar um deploy e como voltar uma versão.
```

> 📌 **Em resumo**
> - CI roda tipos, lint, testes e auditoria em todo pull request; o merge é bloqueado se falhar.
> - CD publica em homologação, roda testes de ponta a ponta e vai para produção com aprovação.
> - Segredos em Environments do GitHub, com aprovação para produção e permissões mínimas.
> - Toda versão é rastreável pelo commit.

### Para ir além
- [GitHub Actions (documentação em português)](https://docs.github.com/pt/actions)

---

## Aula 12.7: Deploy sem derrubar, e voltar atrás em minutos

Mesmo com testes, uma versão nova pode ter um problema que só aparece em produção. O que separa o amador do sênior não é nunca errar, é **errar sem que o cliente perceba**: o deploy não derruba o sistema, e voltar à versão anterior leva minutos, não horas.

### Deploy sem queda

A ideia: a versão nova sobe **ao lado** da antiga; só quando a nova está saudável, o tráfego passa para ela; a antiga é desligada depois.

```mermaid
sequenceDiagram
    participant U as Usuários
    participant P as Proxy / plataforma
    participant V1 as Versão atual
    participant V2 as Versão nova
    U->>P: requisições
    P->>V1: atende normalmente
    Note over V2: sobe e roda a verificação de saúde
    V2-->>P: saúde ok
    P->>V2: passa a enviar as requisições novas
    P->>V1: termina as que estavam em andamento
    Note over V1: desligada
```
*Figura: o deploy sem queda. A versão nova só recebe tráfego depois de passar na verificação de saúde; se não passar, a atual continua atendendo.*

PaaS costumam fazer isso automaticamente quando a verificação de saúde está configurada. Na VPS, você consegue com o Compose subindo a nova versão e trocando no Caddy, ou com ferramentas que automatizam esse padrão.

### O cuidado especial: migrations

O banco é compartilhado pelas duas versões durante a troca. Se a versão nova renomear uma coluna que a antiga usa, a antiga quebra no meio do deploy. Por isso, o padrão **expandir e contrair** (Aula 5.5) é obrigatório em produção:

| Mudança | Errado (quebra durante o deploy) | Certo |
|---|---|---|
| Renomear coluna | Renomeia direto | 1º deploy: cria a nova e grava nas duas; 2º: lê da nova; 3º: remove a antiga |
| Coluna nova obrigatória | `NOT NULL` sem padrão | Cria com padrão (ou opcional), preenche, depois torna obrigatória |
| Remover coluna | Remove junto com o código | 1º deploy: código para de usar; 2º: remove |

Regra para o CLAUDE.md: *"toda migration deve ser compatível com a versão anterior do código em execução"*.

### Voltar atrás (rollback)

Quando a nova versão tem problema:

| Situação | Ação |
|---|---|
| Nova versão não passou na saúde | Automático: a atual continua no ar |
| Passou na saúde, mas há erros novos em produção | **Voltar para a versão anterior** (na PaaS, "redeploy" da versão anterior; na VPS, `VERSAO=<anterior> docker compose up -d`) |
| O problema envolve dados gravados errados | Voltar o código **e** corrigir os dados com um script revisado (nunca restaurar o backup inteiro por cima de dados novos sem análise) |

Por que voltar o código é fácil e voltar o banco é difícil: o banco continuou recebendo dados reais desde o deploy. Restaurar o backup apagaria esses dados. Por isso as migrations são compatíveis com a versão anterior: assim, voltar o código **não exige** voltar o banco.

### Interruptores de funcionalidade (feature flags)

Para funcionalidades grandes ou arriscadas, use um **interruptor**: o código vai para produção desligado, e você liga para uma empresa de teste, depois para algumas, depois para todas. Se der problema, desliga sem novo deploy.

```typescript
if (await funcionalidadeAtiva("atendimento_ia", sessao.empresaId)) { ... }
```

### Quando publicar

- **Evite** sexta-feira à tarde, véspera de feriado e horário de pico do cliente.
- Publique quando você estiver disponível para acompanhar por pelo menos 1 hora.
- Mudanças grandes: avise os clientes antes (e registre no histórico de versões).

### O checklist de deploy

O modelo completo está em [templates/checklist-deploy.md](templates/checklist-deploy.md). O essencial:
- [ ] CI verde e homologação testada.
- [ ] Migrations lidas e compatíveis com a versão anterior.
- [ ] Backup recente confirmado (antes de migrations de risco, um backup manual).
- [ ] Versão anterior anotada (para voltar).
- [ ] Horário adequado e você disponível.
- [ ] Depois: saúde ok, logs sem erros novos por 30 minutos, teste rápido dos fluxos críticos.

### Exemplo completo: o deploy que voltou em 3 minutos

Terça, 10h. Deploy da versão `a3f9c2e` com a nova tela de funil. Saúde ok. Às 10h12, a ferramenta de erros alerta: "Erro novo: 230 ocorrências em 8 minutos, rota `/funil`", afetando empresas com mais de 500 oportunidades.

1. 10h13: você confirma no painel de erros (versão `a3f9c2e`).
2. 10h14: redeploy da versão anterior `91be0d4`. Como a migration da versão nova só **adicionou** uma coluna, a versão antiga funciona com o banco atual.
3. 10h16: erros param. Você avisa as 3 empresas afetadas (Módulo 16).
4. À tarde: reproduz em homologação com o seed de 2.000 oportunidades, escreve o teste que falha, corrige, publica de novo.

Tempo de impacto: 6 minutos, em parte dos clientes. Sem a disciplina de migrations compatíveis e versão rastreável, seria uma manhã inteira de sistema quebrado.

> 📌 **Em resumo**
> - A versão nova só recebe tráfego depois de passar na verificação de saúde.
> - Migrations sempre compatíveis com a versão anterior (expandir e contrair).
> - Voltar o código deve ser trivial e não exigir voltar o banco.
> - Interruptores de funcionalidade, horário certo, checklist de deploy e acompanhamento depois.

---

## Exercícios

### Exercício 1: Mapa de DNS (30 min)
Escreva o mapa completo de DNS do Gestor (sistema, homologação, e-mail, DMARC, CAA). Se tiver um domínio, configure de verdade e confira com `nslookup`.

### Exercício 2: A trava de configuração (45 min)
Implemente a validação de variáveis com a trava de coerência entre ambiente e chaves de pagamento, e um teste que confirma que o sistema se recusa a iniciar com `APP_AMBIENTE=producao` e chave de sandbox.

### Exercício 3: VPS do zero (3 h)
Crie uma VPS de teste (a mais barata serve), aplique o roteiro da Aula 12.5, suba o Gestor com Docker e Caddy, e confira de fora: HTTPS ok, HTTP redireciona, só as portas 22, 80 e 443 abertas, login por senha no SSH recusado.

<details>
<summary><strong>Resolução comentada (verificações)</strong></summary>

- **HTTPS:** `curl -I https://seu-dominio/api/saude` deve devolver `200`. Se der erro de certificado, confira se o DNS já aponta para o IP da VPS e se as portas 80 e 443 estão abertas (o Caddy precisa delas para obter o certificado).
- **Redirecionamento:** `curl -I http://seu-dominio` deve devolver `308` ou `301` com `location: https://...`.
- **Portas:** de outro computador, `nmap -Pn seu-ip` (ou um verificador de portas online) deve listar só 22, 80 e 443. Se aparecer 5432 (PostgreSQL) ou 3000 (aplicação), algo está exposto: no Compose, só o Caddy deve ter `ports:`.
- **SSH com senha recusado:** `ssh -o PubkeyAuthentication=no deploy@seu-ip` deve responder `Permission denied (publickey)`. Se pedir senha, a configuração `PasswordAuthentication no` não foi aplicada (confira arquivos em `/etc/ssh/sshd_config.d/`, que podem sobrescrever).
- **Login de root:** `ssh root@seu-ip` deve ser recusado.
Registre as saídas em `docs/servidor.md`. Ao terminar o exercício, apague a VPS de teste se não for usá-la, para não ficar um servidor esquecido.
</details>

### Exercício 4: Pipeline verde (90 min)
Implemente o `ci.yml` da Aula 12.6, proteja a `main` exigindo o job e abra um pull request com um teste quebrado de propósito. Confirme que o merge fica bloqueado. Depois corrija.

### Exercício 5: Ensaio de rollback (60 min)
Em homologação, publique uma versão com um erro proposital em uma tela, detecte pelos logs e volte para a versão anterior. Cronometre do alerta até a correção e registre o passo a passo no `docs/deploy.md`.

---

## Tarefa de campo

**Planeje a hospedagem do caso real** (Módulo 4): PaaS ou VPS (com justificativa em ADR), região, banco, domínio (em nome de quem), ambientes, custo mensal e quem aprova os deploys. Se o cliente já tem domínio ou hospedagem, levante: onde está registrado, em nome de quem, quem tem a senha, quando vence. É comum descobrir que o domínio está no nome de um ex-funcionário ou de uma agência que fechou.

---

## Entregável: Gestor em produção com deploy automático

**Checklist de qualidade:**
- [ ] Domínio com renovação automática, 2FA no registrador e DNS, registro CAA.
- [ ] Gestor no ar em PaaS (ou VPS) com HTTPS no domínio próprio.
- [ ] Banco sem acesso público; serviços web e worker separados.
- [ ] Rota de saúde sem dados sensíveis, usada pela plataforma.
- [ ] Homologação e produção separados (banco, chaves, números, e-mails).
- [ ] Variáveis validadas na inicialização, com trava de coerência.
- [ ] Dockerfile em duas etapas, usuário não root, sem segredos.
- [ ] VPS de exercício protegida pelo roteiro (SSH com chave, firewall, atualizações automáticas).
- [ ] CI obrigatória para merge; deploy em homologação automático e produção com aprovação.
- [ ] Migrations compatíveis com a versão anterior; rollback documentado e ensaiado.
- [ ] `docs/deploy.md` e `docs/servidor.md` atualizados.

---

## Autoavaliação

Meta: 8 de 10.

1. Em nome de quem deve ficar o domínio do sistema de um cliente, e por quê?
2. O que faz o registro CAA?
3. Por que o Gestor tem dois serviços (web e worker) do mesmo código?
4. Para que serve a rota de saúde, e o que ela não pode devolver?
5. Cite 3 diferenças obrigatórias entre homologação e produção.
6. Por que um segredo dentro de uma imagem Docker está vazado?
7. Quais são os passos de proteção de uma VPS antes de instalar qualquer aplicação?
8. Por que testar o login com chave em outra janela antes de desligar a senha do SSH?
9. O que a CI precisa rodar em todo pull request do Gestor?
10. Por que as migrations devem ser compatíveis com a versão anterior do código?

<details>
<summary><strong>Gabarito</strong></summary>

1. Em nome do cliente (CNPJ dele), com você como contato técnico, porque o endereço é um ativo da empresa; se você deixar de prestar serviço, o cliente não perde o domínio.
2. Diz quais autoridades certificadoras podem emitir certificados HTTPS para o domínio, dificultando a emissão indevida.
3. Porque o web atende requisições e o worker processa a fila e os agendamentos continuamente; separá-los evita que tarefas pesadas deixem as telas lentas e permite escalar cada um.
4. Para a plataforma, o monitoramento e você saberem se a aplicação e o banco estão respondendo (inclusive antes de mandar tráfego para uma versão nova). Não pode devolver dados de clientes, segredos ou detalhes internos; só o status e a versão.
5. Bancos diferentes (homologação com dados fictícios), chaves de pagamento de teste em homologação, números de WhatsApp e envio de e-mail que não atingem clientes reais, segredos diferentes.
6. Porque qualquer pessoa com acesso à imagem pode extrair os arquivos e camadas dela, inclusive o segredo.
7. Atualizar o sistema, criar usuário próprio com sudo, SSH só com chave e sem login de root, firewall liberando só 22, 80 e 443, atualizações de segurança automáticas e proteção contra tentativas em massa (fail2ban).
8. Para não se trancar para fora: se a chave não estiver funcionando e a senha for desligada, você perde o acesso ao servidor.
9. Verificação de tipos, lint, migrations em banco de teste, testes unitários e de integração (inclusive de isolamento) e auditoria de dependências.
10. Porque durante o deploy as duas versões usam o mesmo banco, e porque assim é possível voltar o código para a versão anterior sem precisar voltar o banco (o que apagaria dados novos).
</details>

---

## Checklist de segurança do módulo

- [ ] 2FA no registrador, no DNS, na plataforma de hospedagem e no GitHub.
- [ ] Banco sem acesso público.
- [ ] Segredos por ambiente, nunca no repositório nem em imagens.
- [ ] Trava de coerência entre ambiente e chaves.
- [ ] VPS: SSH só com chave, sem root, firewall, atualizações automáticas, fail2ban.
- [ ] Contêineres sem root; só o proxy exposto.
- [ ] HTTPS com redirecionamento e cabeçalhos básicos.
- [ ] Segredos de deploy em Environments com aprovação para produção.
- [ ] Ações de terceiros com versão fixada; permissões mínimas no pipeline.

---

## Para aprofundar (opcional)

| Material | Formato | Por que vale |
|---|---|---|
| [GitHub Actions](https://docs.github.com/pt/actions) | Texto, em português | Pipelines de CI/CD |
| [Docker: primeiros passos](https://docs.docker.com/get-started/) | Texto, em inglês | Imagens, contêineres e Compose |
| [Caddy](https://caddyserver.com/docs/) | Texto, em inglês | Proxy reverso com HTTPS automático |
| [Coolify](https://coolify.io/docs/) | Texto, em inglês | Painel de deploy para VPS |
