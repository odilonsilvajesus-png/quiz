# Checklist de entrega ao cliente

Use na entrega de todo sistema (e na passagem para outro responsável). O cliente assina (ou confirma por e-mail) o termo de entrega no final.

**Sistema:** ___ · **Cliente:** ___ · **Versão entregue:** ___ · **Data:** ___

## 1. Funcionalidades
- [ ] Todas as histórias do escopo aprovado implementadas e validadas pelo cliente em homologação.
- [ ] Critérios de aceite conferidos (lista anexa, com status).
- [ ] Pendências (se houver) listadas com prazo e aceitas pelo cliente.

## 2. Qualidade e segurança
- [ ] CI verde na versão entregue.
- [ ] [Checklist de segurança](checklist-seguranca.md) preenchido, sem achados críticos ou altos.
- [ ] Testes de isolamento e de permissões passando.
- [ ] Usuários de teste e dados fictícios removidos da produção.
- [ ] 2FA ativado para os administradores do cliente.

## 3. Infraestrutura e operação
- [ ] Produção no ar no domínio do cliente, com HTTPS.
- [ ] Monitoramento e alertas ativos.
- [ ] Backup automático ativo; cópia externa ativa; **restauração testada** em ___.
- [ ] Página de status (se aplicável).
- [ ] Runbooks e plano de incidente preenchidos.

## 4. Contas e acessos (o cliente é titular)
| Conta | Titular | Acesso do prestador | Conferido |
|---|---|---|---|
| Domínio / registrador | ___ | ___ | ☐ |
| DNS | ___ | ___ | ☐ |
| Hospedagem | ___ | ___ | ☐ |
| Banco de dados | ___ | ___ | ☐ |
| Repositório de código | ___ | ___ | ☐ |
| Provedor de pagamento | ___ | ___ | ☐ |
| WhatsApp / Meta | ___ | ___ | ☐ |
| E-mail transacional | ___ | ___ | ☐ |
| Emissor de notas / certificado digital | ___ | ___ | ☐ |
| Outros: ___ | ___ | ___ | ☐ |

- [ ] Cofre de emergência do cliente (ou procedimento de entrega de credenciais) configurado.
- [ ] Datas de vencimento (domínio, certificados, contratos) informadas ao cliente.

## 5. Documentação
- [ ] README: instalar, rodar, testar.
- [ ] `docs/especificacao.md` na versão entregue.
- [ ] `docs/arquitetura.md` e ADRs.
- [ ] `docs/deploy.md`, `docs/operacao.md`, runbooks.
- [ ] Inventário LGPD e lista de fornecedores que tratam dados.
- [ ] Pacote de passagem testado por alguém sem conhecimento prévio do sistema.
- [ ] Manual do usuário ou base de conhecimento com os fluxos principais.

## 6. Treinamento
- [ ] Treinamento dos administradores (usuários, permissões, exportação, atendimento a titulares).
- [ ] Treinamento dos usuários finais nos fluxos principais.
- [ ] Gravação ou material de apoio entregue.

## 7. Comercial e contrato
- [ ] Período de garantia informado: de ___ até ___.
- [ ] Plano de manutenção contratado: ___ (ou recusa registrada por escrito, com os riscos explicados).
- [ ] SLA entregue.
- [ ] Canais de suporte e horário informados.
- [ ] [Dossiê de Confiança](dossie-de-confianca.md) entregue.

## Termo de entrega

Declaro que recebi o sistema ___, versão ___, com os itens acima, e que as pendências listadas foram aceitas com os prazos indicados.

Cliente: ___ · Data: ___
Prestador: ___ · Data: ___
