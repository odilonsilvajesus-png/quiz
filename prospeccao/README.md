# Prospecção na base de seguidores

Encontra, entre os seus seguidores, quem tem perfil de **cliente do produto de Implementação de IA** (atendimento, gestão, marketing e vendas), com uma pontuação, a dor provável de cada um e uma primeira mensagem sugerida.

```
exportação oficial do Instagram ─► seguidores.csv
(opcional) comentários nos seus posts ─► engajados.csv      (Apify)
dados públicos de cada perfil ─► perfis.jsonl                 (Apify)
pontuação pelo ICP (icp.json) ─► leads.xlsx + resumo.md
subagente qualificador-de-leads ─► leads-qualificados.md (+ .csv)
```
Tudo fica em `prospeccao/dados/<conta>/`, que **não vai para o git** (são dados de terceiros).

No Claude Code, o caminho curto é: `/prospectar <caminho-da-exportação.zip>`.

## 1. Baixe a lista dos seus seguidores (oficial, grátis)
A lista de seguidores vem da exportação oficial da sua própria conta: sem login em ferramenta de terceiros e sem risco para a conta.
1. No app do Instagram: **Perfil → menu (☰) → Central de Contas → Suas informações e permissões → Exportar suas informações** (em algumas versões: "Baixar suas informações").
2. **Criar exportação → escolha @odilon.mentor → Exportar para o dispositivo.**
3. Em **Personalizar informações**, marque só **Seguidores e seguindo**. **Período: Desde o início. Formato: JSON.**
4. **Iniciar exportação.** O aviso chega por e-mail (de minutos a algumas horas). Baixe o `.zip`.

Os nomes dos menus mudam de vez em quando; o que importa é: exportação, só "Seguidores e seguindo", formato **JSON**.

## 2. Rode as etapas
```bash
export APIFY_TOKEN=...          # no terminal; nunca em arquivo

python prospeccao/prospectar.py seguidores ~/Downloads/instagram-odilon.mentor-2026-09-28.zip
python prospeccao/prospectar.py engajados --posts 30 --confirmar      # opcional: quem comentou (lead mais quente)
python prospeccao/prospectar.py enriquecer --limite 100               # mostra quanto vai coletar
python prospeccao/prospectar.py enriquecer --limite 100 --confirmar   # teste com 100 perfis
python prospeccao/prospectar.py enriquecer --confirmar                # o restante (retoma de onde parou)
python prospeccao/prospectar.py pontuar
```
- A coleta gasta créditos do Apify. Rode o teste de 100, veja o custo no painel do Apify e só então rode o restante.
- Ordem da coleta: primeiro quem comentou, depois os seguidores mais recentes.
- Se cair no meio, rode de novo: o que já foi coletado fica salvo.
- Para outra conta (um cliente, por exemplo): `--conta <usuario>` antes da etapa.

## 3. Leia o resultado
`leads.xlsx` tem uma aba por grupo, com as colunas `status` e `observações` para você acompanhar:

| Grupo | O que é |
|---|---|
| **A** | Decisor + sinais claros de empresa. Abordar primeiro |
| **B** | Empresa ou decisor, com menos evidência |
| **C** | Sinais fracos; vale olhar se sobrar tempo |
| **Parceiros** | Agências, social media, tráfego, automação, IA: não são clientes, podem ser parceiros |
| **Fora do perfil** | Sem sinal de empresa |
| **Descartados** | Fã-clube, sorteio, conta sem posts, apostas, perfil apagado |

A pontuação soma: decisor na bio (dono, fundador, CEO, sócio…), conta comercial e categoria, palavras de empresa (loja, clínica, unidades, desde 2010…), porte (1 mil a 50 mil seguidores pesa mais), WhatsApp ou site na bio, se seguiu nos últimos 90 dias e se comentou nos seus posts. A **dor provável** vem das palavras de cada frente (ex.: WhatsApp + agendamento → atendimento; unidades + equipe → gestão). Pesos e palavras ficam em `icp.json`; ajuste à vontade.

Depois, o subagente **qualificador-de-leads** lê os grupos A e B um por um, confirma ou rebaixa, aponta a evidência da dor e escreve uma primeira mensagem para cada perfil quente.

## 4. Regras de abordagem
- **Envio à mão**, uma mensagem por vez, e **no máximo 20 a 30 DMs por dia**. Nunca automatize DM para a lista (o Instagram bloqueia a conta e é spam).
- Antes da DM, **interaja**: veja os stories, curta ou comente algo real de 1 ou 2 posts.
- Primeira mensagem **sem pitch, sem link e sem preço**: algo específico do perfil + uma pergunta sobre a operação.
- Se a pessoa não responder ou disser não, **não insista** (no máximo 1 retorno depois de alguns dias).

## 5. Privacidade (LGPD)
- Usamos só dados **públicos de perfil** (nome, bio, categoria, link, números) para um contato comercial pontual. Nada de buscar telefone, e-mail ou dados pessoais em outros lugares.
- A lista é **sua**: não venda, não compartilhe e não publique.
- Se alguém pedir para não ser contatado, marque em `status` e não aborde mais.
- Apague `prospeccao/dados/` quando a campanha terminar.
