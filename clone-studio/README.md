# Clone Studio

Plataforma para transformar uma **copy** em um vídeo pronto para as redes sociais,
com o **seu clone de IA falando com a sua voz**.

```
copy ──► voz clonada (ElevenLabs) ──► clone em vídeo com lip-sync (HeyGen) ──► edição automática (FFmpeg) ──► download
```

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
    heygen.ts          upload do áudio, geração e download do vídeo do avatar
    mock.ts            modo demo
  editor/
    captions.ts        legendas ASS (karaokê) e SRT
    layouts.ts         modelos de edição (tela dividida, podcast, apresentador…)
    render.ts          edição final com FFmpeg (um vídeo por modelo)
  assets/fonts/        Montserrat ExtraBold (SIL OFL) para as legendas
web/                   interface React + Tailwind
data/                  (gerado) perfil, uploads e vídeos — fora do git
```

## Custos e limites

- ElevenLabs: clone de voz instantâneo exige plano *Starter* ou superior; cobra por caractere narrado.
- HeyGen: API cobrada por créditos/minuto de vídeo; planos menores só geram 720p (ajuste `HEYGEN_MAX_HEIGHT=720`). A edição final sempre exporta em 1080p.
- Para trocar de fornecedor (ex.: D-ID, Hedra, Synthesia), basta criar outro arquivo em `server/providers/` com as mesmas funções.

## Uso responsável

Use apenas a sua própria voz e imagem (ou de quem autorizou por escrito). Várias redes
pedem que conteúdo gerado por IA seja sinalizado — ative o rótulo de "conteúdo com IA" ao publicar.
