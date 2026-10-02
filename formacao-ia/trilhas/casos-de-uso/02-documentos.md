# Caso 02: Documentos (notas, boletos, contratos, pedidos)

> Um dos casos de **maior ROI** em PMEs: muito trabalho manual de digitação e conferência, regras claras e erros caros.

---

## Problema típico e sinais no diagnóstico
- Pessoas digitando dados de documentos em sistemas ou planilhas.
- Conferências manuais (nota × pedido, contrato × política).
- Documentos chegando por vários canais (e-mail, WhatsApp, papel).
- Erros de digitação, atrasos, multas.
- Contratos arquivados sem controle de prazos e obrigações.

---

## Tipos de documento e abordagem

| Documento | Melhor abordagem | Observação |
|---|---|---|
| **NF-e** | **Ler o XML** (estruturado), não o PDF (DANFE) | O XML tem todos os dados exatos; IA só para casos especiais (descrição de itens, correspondência com pedido) |
| **NFS-e** | XML/API quando disponível; senão, PDF com IA | Padrões variam por município (com a padronização nacional em andamento, verifique) |
| **Boletos** | IA multimodal no PDF/imagem + validação da linha digitável | A linha digitável tem dígitos verificadores: valide em código |
| **Pedidos de clientes** (texto, PDF, foto, planilha) | IA multimodal + correspondência com catálogo | Formatos muito variados: grande força da IA |
| **Contratos** | IA para resumo, extração de cláusulas e prazos | **Revisão jurídica** para decisões |
| **Documentos pessoais** (RG, CNH, comprovantes) | IA multimodal | **Dados pessoais:** LGPD rigorosa, minimização |
| **Comprovantes de pagamento** | IA multimodal + conferência com extrato | Atenção a fraudes (comprovantes falsos) |

> **Princípio:** se existe **dado estruturado** (XML, API, arquivo do banco), use-o. IA é para o que não é estruturado.

---

## Arquitetura de referência

```
Entrada (e-mail, upload, WhatsApp, pasta)
   → Pré-processamento (tipo de arquivo, PDF com texto ou imagem, várias páginas)
   → Classificação do documento (boleto? nota? pedido? outro?)
   → Extração com IA (saída estruturada, schema por tipo)
   → Validação em código:
       • formatos (CNPJ/CPF com dígito verificador, datas, valores)
       • regras (linha digitável válida; valor × pedido; duplicidade)
       • confiança (campos nulos → revisão)
   → OK: grava no sistema/planilha
   → Problema: fila de revisão humana (com o documento e os campos destacados)
   → Logs e métricas
```

### Dicas técnicas
- Envie o **PDF/imagem diretamente** ao modelo multimodal: modelos atuais leem bem documentos, inclusive tabelas.
- **Schema por tipo de documento**, com campos obrigatórios e regra para nulos.
- **Valide tudo que for validável em código** (dígitos verificadores, somas, datas). Use a IA para ler e o código para conferir.
- **Peça evidência:** "para cada campo, indique o trecho/posição de onde extraiu" ajuda a revisão.
- **Processamento em lote** (batch) para volumes grandes sem urgência: mais barato.

---

## Passo a passo
1. Reúna de 30 a 50 exemplos reais de cada tipo (anonimizados se possível) e os valores corretos (gabarito).
2. Defina os schemas e as regras de validação.
3. Construa o extrator e rode o eval: acerto **por campo** e % de documentos 100% corretos.
4. Ajuste até a meta; defina o que vai para revisão.
5. Integre com a entrada (e-mail/pasta) e a saída (sistema/planilha).
6. Piloto assistido: humano confere tudo por 2 semanas.
7. Autônomo por exceção: humano revisa só a fila.

---

## Cuidados
- **Fraude:** comprovantes e boletos falsos existem. Valide beneficiário/CNPJ contra cadastro de fornecedores; desconfie de mudanças de dados bancários.
- **LGPD:** documentos pessoais e financeiros; minimização e retenção.
- **Contratos:** IA ajuda a ler e organizar; decisão e parecer são do advogado.
- **Formatos novos:** monitore documentos que caem na revisão por formato desconhecido.

---

## Métricas
- Acerto por campo; % de documentos sem nenhuma correção
- % enviados para revisão
- Tempo por documento (antes × depois)
- Erros que chegaram ao sistema (devem tender a zero)
- Multas/juros evitados

---

## Laboratório
Construa o extrator de boletos ou de pedidos da empresa-laboratório, com validação em código, fila de revisão e eval por campo com 50 documentos.

---

**Voltar:** [Casos de uso](README.md)
