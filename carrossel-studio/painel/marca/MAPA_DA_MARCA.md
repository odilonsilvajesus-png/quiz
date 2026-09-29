# Mapa da marca — VIRALIZA STUDIO

**Versão 1.0 · 29/09/2026**  
**Aplicação:** interface do sistema de criação automática de carrosséis, página de demonstração e materiais comerciais.

## 1. Essência da marca

**Nome oficial:** VIRALIZA STUDIO  
**Categoria:** plataforma de criação de carrosséis.  
**Promessa de comunicação:** transformar uma ideia em um carrossel pronto para revisar, ajustar e publicar.  
**Personalidade:** criativa, ágil, clara e profissional. A marca tem energia, mas a interface deve transmitir controle e confiança.  
**Frase descritiva sugerida:** “Crie carrosséis com mais velocidade e controle.” Esta frase é uma sugestão de comunicação, não parte do logotipo.

### Voz e texto

- Português do Brasil, direto e específico.
- Verbos de ação: **Criar carrossel**, **Gerar slides**, **Revisar conteúdo**, **Editar design**, **Exportar**.
- Mostrar o estado real do trabalho: “Gerando estrutura”, “Criando slides”, “Pronto para revisão”.
- Evitar promessas de viralização garantida, excesso de exclamações e jargão de IA.
- Tratar a IA como ferramenta de produção; deixar claro que o usuário pode revisar e editar antes de publicar.

## 2. Logotipo aprovado

O logo horizontal aprovado tem um **símbolo à esquerda com três cards sobrepostos em movimento**, em tons de violeta. À direita, **VIRALIZA** aparece em branco, em caixa alta e peso forte; **STUDIO** aparece abaixo em lilás, também em caixa alta. A versão atual foi criada para **fundo escuro**.

**Arquivo de referência:** usar a imagem final do logo aprovada nesta conversa como fonte visual. Este documento não substitui o arquivo de imagem do logo e não autoriza redesenhar suas letras por aproximação.

### Regras de uso

1. Usar a imagem do logo original, preservando proporções, cores e espaçamento entre símbolo e nome.
2. Exibir a versão atual somente sobre fundos escuros que mantenham contraste com o texto branco.
3. Em cabeçalhos estreitos, usar um recorte apenas do símbolo original; não recriar um “V” tipográfico genérico.
4. Manter uma margem livre ao redor equivalente, no mínimo, à altura da letra **V** do nome.
5. Não esticar, girar, aplicar sombra, contorno, brilho, animação pulsante ou colocar sobre fotografia movimentada.
6. Não inverter as cores automaticamente para criar uma versão clara. Se uma tela clara exigir logo escuro, produzir e aprovar uma variante própria.
7. O logo representa a plataforma. **Não adicioná-lo automaticamente aos carrosséis exportados pelos clientes.**

### Tamanhos recomendados

- Menu lateral expandido: largura aproximada de 180–220 px para o conjunto.
- Cabeçalho de landing page: largura aproximada de 200–260 px.
- Ícone isolado em navegação compacta: 32–40 px.
- Preservar legibilidade; abaixo do limite confortável, usar só o símbolo.

## 3. Cores

Os valores abaixo são **tokens digitais propostos a partir da aparência do logo aprovado**, não uma extração vetorial oficial. O roxo forte e o fundo ameixa escuro são o núcleo visual.

| Token | Hex | Uso |
|---|---:|---|
| `brand.950` | `#0F091D` | Fundo principal da interface escura |
| `brand.900` | `#1A112B` | Cards, menu e painéis |
| `brand.800` | `#2A1A42` | Bordas destacadas, hover discreto |
| `brand.500` | `#5B23F5` | Botão principal, foco e ações importantes |
| `brand.400` | `#7B4DFF` | Hover do botão e elementos secundários |
| `brand.200` | `#C9A9FC` | Detalhes do símbolo, chips e texto de destaque |
| `text.primary` | `#FFFFFF` | Títulos e texto prioritário |
| `text.secondary` | `#C9C2D5` | Descrições e rótulos secundários |
| `text.muted` | `#9F96B1` | Metadados e texto auxiliar |
| `border.default` | `#3B2D4D` | Divisórias e contornos |
| `surface.input` | `#211633` | Campos de formulário |

**Gradiente opcional:** `linear-gradient(135deg, #C9A9FC 0%, #7B4DFF 48%, #4303FD 100%)`. Aplicar apenas em detalhes, ilustrações leves ou estados promocionais. O botão principal pode permanecer sólido para ganhar clareza.

**Cores funcionais:** sucesso `#37C994`, aviso `#F5B95C`, erro `#F17883`. Usar somente para o significado funcional correspondente.

**Regra de contraste:** texto branco sobre superfícies escuras; texto escuro sobre botões lilás claros. Conferir contraste WCAG AA para texto normal (4,5:1) e componentes (3:1). Não usar lilás claro como texto pequeno em fundo branco.

## 4. Tipografia

- **Interface:** Inter. Alternativa: Manrope; fallback: `system-ui, sans-serif`.
- **Logo:** usar a arte aprovada. Não substituir a tipografia do logo pela fonte da interface.
- Títulos: peso 700, frases curtas, entrelinha 1,15–1,25.
- Corpo: peso 400–500, entrelinha 1,45–1,6.
- Botões e rótulos: peso 600, caixa normal. Reservar caixa alta para a marca e pequenos marcadores pontuais.
- Escala sugerida: 12 / 14 / 16 / 20 / 24 / 32 / 40 px. Corpo principal: 16 px.

## 5. Linguagem visual da interface

### Estrutura

- Interface predominantemente escura, com hierarquia clara entre fundo, painel e área editável.
- Bordas de 1 px discretas; raios de 10–14 px para cards e campos; 10 px para botões.
- Espaçamento em múltiplos de 4 px; passos usuais de 8, 12, 16, 24 e 32 px.
- Sombras muito sutis. O contraste de superfície deve fazer a maior parte do trabalho.
- Ícones de traço simples e consistente; evitar ícones 3D e misturar bibliotecas com pesos diferentes.
- Transições curtas, de 150–250 ms; respeitar preferência de movimento reduzido.

### Componentes principais

| Componente | Direção |
|---|---|
| Botão primário | Roxo sólido, texto branco, verbo específico. Um principal por área de decisão. |
| Botão secundário | Superfície escura, borda visível, texto branco. |
| Campo de prompt | Espaço generoso, rótulo explícito, exemplo útil sem substituir o rótulo. |
| Templates | Miniatura do carrossel, nome, proporção e ação de seleção. |
| Editor | Prévia central em destaque, controles agrupados, navegação clara entre slides. |
| Barra de progresso | Etapas nomeadas; indicar quando a geração terminou e há revisão pendente. |
| Exportação | Formato e tamanho claros; mostrar confirmação e possibilidade de download. |
| Estado vazio | Explicar o primeiro passo e oferecer uma ação concreta. |

### Tratamento das prévias

O conteúdo criado pelos clientes pode ter sua **própria identidade visual**. Mostrar as artes sobre um palco neutro e separar claramente a moldura da interface do arquivo exportado. Não aplicar o roxo da VIRALIZA a todo carrossel gerado. Não incluir marca d’água sem uma decisão explícita de produto.

## 6. Aplicações por tela

1. **Acesso / onboarding:** logo horizontal sobre fundo `brand.950`; proposta curta e chamada principal.
2. **Dashboard:** navegação e títulos discretos; ação **Criar carrossel** fácil de localizar; projetos recentes em cards.
3. **Fluxo de criação:** ideia → estrutura → design → revisão → exportação. Mostrar o passo atual e permitir voltar sem perder o trabalho.
4. **Editor:** a arte é protagonista; controles visuais em painéis que não competem com ela.
5. **Apresentação comercial:** mostrar exemplos reais de antes/depois ou ideia/resultado; usar o símbolo e a paleta para enquadrar o produto, sem prometer resultados de alcance.
6. **Mobile:** símbolo no cabeçalho quando faltar espaço; controles com áreas de toque confortáveis e prévia navegável.

## 7. O que evitar

- Interface inteira em roxo saturado ou gradientes em todos os painéis.
- Texto de baixo contraste, inclusive placeholders quase invisíveis.
- Emojis como parte da linguagem visual fixa do produto.
- Chamadas genéricas como “Deixe a IA fazer tudo” quando o usuário ainda precisa revisar.
- Copiar literalmente a identidade de Instagram, Canva ou de ferramentas concorrentes.
- Alterar o logo para combinar com cada template do cliente.
- Inserir o logo ou uma marca d’água no carrossel final sem configuração de produto.

## 8. Tokens iniciais para implementação

```css
:root {
  color-scheme: dark;
  --vs-bg: #0F091D;
  --vs-surface: #1A112B;
  --vs-surface-input: #211633;
  --vs-border: #3B2D4D;
  --vs-primary: #5B23F5;
  --vs-primary-hover: #7B4DFF;
  --vs-lavender: #C9A9FC;
  --vs-text: #FFFFFF;
  --vs-text-secondary: #C9C2D5;
  --vs-text-muted: #9F96B1;
  --vs-success: #37C994;
  --vs-warning: #F5B95C;
  --vs-error: #F17883;
  --vs-radius-control: 10px;
  --vs-radius-card: 14px;
  --vs-font: Inter, Manrope, system-ui, sans-serif;
}
```

## 9. Instrução pronta para a IA que vai aplicar a marca

> Aplique a identidade visual VIRALIZA STUDIO ao sistema existente. Use este mapa como especificação e a imagem do logo aprovado como referência visual obrigatória. Primeiro inspecione a estrutura atual e identifique os componentes globais; depois implemente tokens de cor e tipografia, cabeçalho/menu, botões, campos, cards, editor, estados de geração e telas de exportação. Preserve fluxos, dados e funcionalidades. Use a versão atual do logo apenas em fundos escuros, sem redesenhá-lo ou gerar uma cópia com texto recriado. A interface deve permanecer legível e responsiva; verifique contraste, foco por teclado e estados de carregamento/erro. As artes dos clientes devem preservar a identidade própria e a exportação não deve receber marca d’água automaticamente. Ao final, apresente telas ou capturas das páginas principais, indique os arquivos alterados e destaque qualquer decisão que dependa de aprovação, como uma variante do logo para fundo claro.

---

**Observação de entrega:** envie à IA **este mapa e a imagem final do logo**. O documento orienta a aplicação; a imagem é a referência para o desenho exato da marca.
