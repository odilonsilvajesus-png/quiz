# Clone Studio

Plataforma que produz vídeos prontos para as redes sociais de dois jeitos:

**🤖 100% IA** — você escreve a copy e o **seu clone de IA grava com a sua voz**:

```
copy ──► voz clonada (ElevenLabs) ──► clone em vídeo com lip-sync (HeyGen) ──► edição automática (FFmpeg) ──► download
```

**🎬 Vídeo gravado** — você sobe um vídeo seu (aula, live, podcast…) e a plataforma **corta e edita sozinha**:

```
vídeo ──► transcrição (ElevenLabs) ──► escolha dos cortes (Claude) ──► tira pausas e vícios ──► edição automática ──► download
```

### Modo vídeo gravado

- **Vários cortes ou vídeo inteiro**: escolha a duração (15–35s, 30–65s, 55–95s) e a quantidade (ou automático).
- **Cortes escolhidos por IA**: com `ANTHROPIC_API_KEY`, o Claude lê a transcrição, escolhe os trechos que funcionam sozinhos e escreve **título** (para o post) e **gancho** (na tela) de cada corte. Sem a chave, os cortes seguem a ordem do vídeo, fechando em frases completas.
- **Tira pausas e silêncios** (jump cut) e **vícios de linguagem** ("é…", "hã", "hum").
- Cada corte passa pela mesma edição do modo IA: modelos (tela cheia, dividida, podcast…), legendas animadas, gancho, marca d'água e trilha.
- Vídeo horizontal vira vertical automaticamente (enquadramento central).

## O que ela faz

| Etapa | Como |
|---|---|
| **Clone de voz** | Grave pelo microfone ou envie 1–3 min de áudio → cria sua voz no ElevenLabs (Instant Voice Clone). |
| **Clone em vídeo** | Use seu *Instant Avatar* do HeyGen (gravado a partir de um vídeo seu) ou envie uma foto (*talking photo*). |
| **Produção** | A copy vira narração com a sua voz; o áudio é enviado ao HeyGen, que gera o avatar falando com sincronização labial. |
| **Edição** | Formato 9:16 / 1:1 / 16:9, legendas animadas com palavra destacada (estilo TikTok/Reels), título de gancho, marca d'água com seu @, trilha com *ducking* automático, volume normalizado para redes (-14 LUFS). |
| **Entrega** | Pré-visualização no navegador e download do MP4, da capa (JPG) e das legendas (SRT). |

### Modelos de edição

Marque um ou vários — cada modelo vira um vídeo pronto a partir do **mesmo** clone (a voz e o avatar são gerados uma vez só):

| Modelo | Como fica |
|---|---|
| **Tela cheia** | Você ocupando a tela toda (Reels/TikTok clássico). |
| **Tela dividida** | Vídeo de apoio em cima (gameplay, produto, prints) e você embaixo; no 16:9 fica lado a lado. |
| **Podcast** | Fundo desfocado, cartão com a câmera, onda sonora animada, seu nome/@ e o título do episódio. |
| **Apresentador** | Conteúdo em tela cheia e você numa janela no canto (react, aula, análise). |
| **Moldura** | Você num cartão centralizado sobre fundo desfocado, com título em cima. |

- **Cortes dinâmicos**: alterna plano aberto e close a cada frase, como se fossem duas câmeras.
- **Vídeos/imagens de apoio**: se alternam a cada frase; imagens ganham movimento de câmera.

Extras:
- **Vários vídeos de uma vez**: separe as copies com uma linha contendo `---`.
- **Reeditar sem gastar créditos**: muda legendas, gancho, trilha etc. reaproveitando voz e avatar já gerados.
- **Retomada**: se algo falhar ou o servidor reiniciar, o vídeo continua da etapa em que parou.
- **Modo demo**: sem chaves de API, tudo funciona com voz silenciosa e sua foto animada — ótimo para testar a edição.

## Como rodar

Requisitos: Node.js 20+ (o FFmpeg já vem incluso via `ffmpeg-static`).

```bash
cd clone-studio
cp .env.example .env      # cole suas chaves ElevenLabs e HeyGen
npm install
npm run dev               # interface em http://localhost:5173
```

Produção (um único servidor servindo API + interface):

```bash
npm run build
npm start                 # http://localhost:3001
```

## Primeiro uso

1. **Meu Clone** → preencha nome e @, marque a confirmação de consentimento.
2. **Clone de voz** → grave/envie amostras e clique em *Criar meu clone de voz* (ou selecione uma voz existente da sua conta).
3. **Clone em vídeo** → crie um *Instant Avatar* no painel do HeyGen e selecione-o na lista, ou envie uma foto.
4. **Novo Vídeo** → cole a copy, ajuste a edição e clique em *Gerar vídeo*.
5. **Meus Vídeos** → acompanhe o progresso e baixe quando ficar pronto.

## Estrutura

```
server/
  index.ts             API REST (Express)
  pipeline.ts          fila e orquestração das etapas voz → avatar → edição
  providers/
    elevenlabs.ts      clone de voz + TTS com tempo de cada palavra
    transcribe.ts      transcrição dos vídeos gravados (ElevenLabs Speech-to-Text)
    heygen.ts          upload do áudio, geração e download do vídeo do avatar
    mock.ts            modo demo
  editor/
    captions.ts        legendas ASS (karaokê) e SRT
    autocut.ts         tira pausas/vícios e emenda os trechos (vídeo gravado)
    clips.ts           escolhe os cortes (Claude ou por duração)
    layouts.ts         modelos de edição (tela dividida, podcast, apresentador…)
    render.ts          edição final com FFmpeg (um vídeo por modelo)
  assets/fonts/        Montserrat ExtraBold (SIL OFL) para as legendas
web/                   interface React + Tailwind
data/                  (gerado) perfil, uploads e vídeos — fora do git
```

## Custos e limites

- Claude (opcional, só para escolher os cortes): uma chamada por vídeo gravado, cobrada pelo tamanho da transcrição.
- ElevenLabs também cobra a transcrição por minuto de áudio.
- ElevenLabs: clone de voz instantâneo exige plano *Starter* ou superior; cobra por caractere narrado.
- HeyGen: API cobrada por créditos/minuto de vídeo; planos menores só geram 720p (ajuste `HEYGEN_MAX_HEIGHT=720`). A edição final sempre exporta em 1080p.
- Para trocar de fornecedor (ex.: D-ID, Hedra, Synthesia), basta criar outro arquivo em `server/providers/` com as mesmas funções.

## Uso responsável

Use apenas a sua própria voz e imagem (ou de quem autorizou por escrito). Várias redes
pedem que conteúdo gerado por IA seja sinalizado — ative o rótulo de "conteúdo com IA" ao publicar.
