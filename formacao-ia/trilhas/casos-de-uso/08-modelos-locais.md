# Caso 08: Modelos locais e open source

---

## Quando considerar
| Motivo | Exemplo |
|---|---|
| **Privacidade/regulação** | Dados de saúde, jurídicos ou sigilosos que o cliente não aceita enviar para fora |
| **Custo em volume muito alto** | Milhões de classificações simples por mês |
| **Sem internet confiável** | Operações em campo, indústria isolada |
| **Controle e independência** | Não depender de um fornecedor externo |
| **Latência local** | Respostas muito rápidas em equipamentos locais |

## Quando **não** considerar (a maioria dos casos de PME)
- Volume baixo/médio: as APIs são mais baratas que comprar e manter hardware.
- Tarefas complexas (agentes, raciocínio difícil, código): os modelos de ponta via API costumam ser bem superiores.
- Sem ninguém para manter a infraestrutura.
- Quando um fornecedor de API com contrato adequado (DPA, sem treino com os dados, retenção controlada) resolve a questão de privacidade.

---

## Conceitos
- **Modelos de pesos abertos:** Llama (Meta), Mistral, Qwen, DeepSeek, Gemma (Google), entre outros. Verifique a **licença** de cada um (alguns têm restrições de uso comercial ou de escala).
- **Tamanho (parâmetros):** modelos menores rodam em computadores comuns; maiores exigem GPUs potentes.
- **Quantização:** técnica que reduz o tamanho e a memória do modelo, com alguma perda de qualidade, para rodar em hardware mais modesto.
- **Ferramentas para rodar localmente:** Ollama, LM Studio, llama.cpp (uso individual e testes); vLLM e similares (servidores de produção).

---

## Arquitetura típica
```
Servidor local (com GPU, ou CPU para modelos pequenos)
  → Ollama/vLLM servindo o modelo com API compatível
  → Sua aplicação chama a API local (mesmo padrão de uma API em nuvem)
  → Dados não saem da rede da empresa
```

### Arquitetura híbrida (frequentemente a melhor)
```
Dados sensíveis → modelo local (anonimização, classificação, extração)
Dados anonimizados / tarefas complexas → modelo de ponta via API
```

---

## Passo a passo de avaliação
1. Defina a tarefa e monte o **eval** (Módulo 4.1).
2. Rode o eval com 2 ou 3 modelos locais (via Ollama, por exemplo) e com um modelo de API.
3. Compare: qualidade, velocidade, **custo total** (hardware, energia, manutenção, pessoas) × custo da API no volume esperado.
4. Considere o risco operacional: quem atualiza, monitora e conserta?
5. Decida e documente (ADR).

---

## Cuidados
- **Licenças** dos modelos.
- **Segurança do servidor** (ele fica na rede do cliente).
- **Atualizações:** novos modelos surgem rápido; planeje a reavaliação.
- **Qualidade em português:** varia muito entre modelos; teste com os seus casos.
- **Expectativa:** deixe claro ao cliente a diferença de capacidade em relação aos modelos de ponta.

---

## Métricas
- Qualidade no eval (comparada à API)
- Latência
- Custo total mensal (TCO) × custo de API equivalente
- Disponibilidade do servidor

---

## Laboratório
Instale o Ollama (ou similar) no seu computador, rode 2 modelos abertos e compare-os com um modelo de API no eval de uma das suas soluções (por exemplo, o classificador de mensagens do Módulo 3.1). Escreva um ADR recomendando (ou não) o uso local para aquele caso.

---

**Voltar:** [Casos de uso](README.md)
