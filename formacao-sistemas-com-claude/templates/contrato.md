# Roteiro de contrato de desenvolvimento e manutenção

> ⚖️ **Este não é um contrato pronto.** É um roteiro das cláusulas e decisões que você deve levar a um advogado para redigir (ou revisar) o seu modelo de contrato. Contratos dependem da legislação vigente, do tipo de cliente e do seu enquadramento. Faça uma vez, bem feito, e reutilize.

**Partes:** Contratante ___ (CNPJ ___) · Contratada ___ (CNPJ ___)

## Decisões que você precisa tomar antes de ir ao advogado

| Tema | Sua decisão |
|---|---|
| Modelo de preço | ☐ Projeto fechado ☐ Implantação + mensalidade ☐ Por hora ☐ SaaS (termos de uso) |
| Propriedade do código | ☐ Cessão total ☐ Licença de uso + base reutilizável sua ☐ SaaS (sem entrega de código) |
| Direito de reaproveitar a base em outros clientes | ☐ Sim ☐ Não |
| Garantia | ___ dias após o aceite final |
| Permanência mínima (se mensalidade) | ___ meses |
| Teto de responsabilidade | ___ (ex.: valores pagos nos últimos 12 meses) |
| Prazo para avisar o cliente sobre incidentes de segurança | ___ horas |
| Período de transição na saída | ___ dias |
| Multa e juros por atraso de pagamento | ___ |
| Suspensão por inadimplência após | ___ dias |
| Foro | ___ |

## Cláusulas essenciais (roteiro)

### 1. Objeto
O desenvolvimento, a implantação e (se contratado) a manutenção do sistema ___, conforme a especificação aprovada (anexo I, versão ___).

### 2. Escopo e mudanças
- O escopo é o da especificação aprovada.
- Pedidos fora do escopo seguem o processo: registro → avaliação de impacto por escrito → aprovação por escrito → execução → atualização da especificação.

### 3. Prazos e obrigações do contratante
- Cronograma (anexo II).
- Obrigações do contratante: fornecer informações, acessos, dados e aprovações nos prazos; indicar um responsável; manter as contas essenciais em seu nome.
- Atrasos do contratante estendem os prazos da contratada na mesma proporção.

### 4. Aceite
- Cada entrega é disponibilizada em homologação; o contratante tem ___ dias úteis para aprovar ou apontar defeitos em relação à especificação.
- Na ausência de manifestação no prazo, a entrega é considerada aceita.

### 5. Preço e pagamento
- Valores, parcelas, datas, forma de pagamento, reajuste anual (índice ___).
- Multa e juros por atraso; suspensão de serviços após ___ dias de inadimplência, com aviso prévio.
- Custos de terceiros: quais são pagos diretamente pelo contratante.

### 6. Garantia
- Correção, sem custo, de defeitos em relação à especificação, por ___ dias após o aceite final.
- Não cobre: mudanças de requisitos, problemas causados por terceiros ou pelo contratante, adaptações a mudanças de fornecedores (cobertas pela manutenção).

### 7. Manutenção e SLA (se contratados)
- Plano contratado (anexo III) e SLA (anexo IV).
- Vigência, renovação, mudança de plano e cancelamento com aviso de ___ dias.

### 8. Propriedade intelectual
- Conforme a decisão acima: cessão dos direitos sobre o código específico após a quitação; ou licença de uso perpétua, com a contratada mantendo a titularidade da base reutilizável e o direito de reaproveitá-la.
- Bibliotecas de código aberto mantêm as próprias licenças.

### 9. Proteção de dados pessoais (LGPD)
- O contratante é **controlador**; a contratada é **operadora** dos dados pessoais tratados no sistema.
- A contratada trata os dados apenas conforme as instruções do contratante e para a execução do contrato.
- Medidas de segurança adotadas (referência ao Dossiê de Confiança / anexo de segurança).
- Lista de suboperadores (hospedagem, banco, e-mail, WhatsApp, IA etc.) e regra para incluir novos.
- Aviso ao contratante sobre incidentes de segurança em até ___ horas após a ciência, com as informações disponíveis, e apoio na avaliação e nas comunicações.
- Apoio ao contratante no atendimento aos direitos dos titulares.
- Ao fim do contrato: devolução e/ou eliminação dos dados, conforme instrução do contratante, ressalvadas obrigações legais de guarda.

### 10. Confidencialidade
- Ambas as partes mantêm em sigilo as informações da outra, durante o contrato e por ___ anos após.

### 11. Limitação de responsabilidade
- Responsabilidade total limitada a ___.
- Exclusão de lucros cessantes e danos indiretos, nos limites permitidos pela lei.
- Responsabilidades do contratante: uso adequado, guarda de senhas, remoção de usuários desligados, conteúdo e dados inseridos.

### 12. Vigência, rescisão e transição
- Vigência e hipóteses de rescisão (com e sem justa causa, aviso prévio).
- Na saída: entrega de acessos, código (conforme a cláusula 8), documentação e exportação dos dados; apoio à transição por ___ dias.

### 13. Disposições gerais e foro
- Comunicações por escrito (e-mails indicados).
- Anexos: I especificação · II cronograma · III plano de manutenção · IV SLA · V segurança e proteção de dados.
- Foro: ___.

## Para SaaS (no lugar do contrato negociado)

- **Termos de uso:** serviço, planos, pagamento, teste grátis, suspensão, cancelamento, exportação de dados, encerramento do serviço com aviso prévio de ___ meses, limitação de responsabilidade, SLA (se houver), alterações dos termos.
- **Política de privacidade:** dados dos assinantes (você controlador) e dos clientes deles (você operador), finalidades, compartilhamento, retenção, direitos, contato.
- **Acordo de tratamento de dados** disponível para clientes que pedirem.
- **Registro do aceite:** data, hora, usuário, versão dos termos.

## Checklist

- [ ] Decisões da primeira tabela tomadas.
- [ ] Modelo revisado por advogado.
- [ ] Anexos padronizados (especificação, cronograma, plano, SLA, segurança).
- [ ] Versão de termos de uso e política de privacidade publicada (SaaS).
