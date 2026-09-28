// Gera as imagens dos slides com o gpt-image-2 da OpenAI.
import fs from "node:fs";
import OpenAI from "openai";

const MODELO = () => process.env.IMAGEM_MODELO || "gpt-image-2";
const QUALIDADE = () => process.env.IMAGEM_QUALIDADE || "medium";
// Proporção 4:5 do carrossel do Instagram (1080x1350), com lados múltiplos de 16 como o modelo exige.
const TAMANHO = "1088x1360";

export const temGeradorImagem = () => Boolean(process.env.OPENAI_API_KEY);

// Quais slides recebem imagem em cada modo.
export function slidesComImagem(modo, total) {
  if (modo === "todas") return Array.from({ length: total }, (_, i) => i);
  if (modo === "capa") return [0];
  return [];
}

function montarPrompt({ descricao, estilo, paleta }) {
  return [
    descricao,
    estilo ? `Estilo visual: ${estilo}.` : "",
    paleta ? `Harmonize com as cores da marca: ${[paleta.escura, paleta.clara, paleta.destaque].join(", ")}.` : "",
    "Imagem vertical para post de Instagram.",
    "Não escreva nenhum texto, letra, número, logotipo ou marca d'água na imagem.",
    "Deixe áreas mais calmas na imagem para receber texto por cima.",
  ].filter(Boolean).join(" ");
}

export async function gerarImagem({ descricao, estilo, paleta, destino }) {
  const client = new OpenAI();
  const resposta = await client.images.generate({
    model: MODELO(),
    prompt: montarPrompt({ descricao, estilo, paleta }),
    size: TAMANHO,
    quality: QUALIDADE(),
    output_format: "jpeg",
    n: 1,
  });
  const b64 = resposta.data?.[0]?.b64_json;
  if (!b64) throw new Error("A OpenAI não devolveu a imagem.");
  fs.writeFileSync(destino, Buffer.from(b64, "base64"));
}

// Roda as tarefas com no máximo `limite` ao mesmo tempo.
export async function emParalelo(tarefas, limite = 3) {
  const resultados = [];
  let proxima = 0;
  const trabalhador = async () => {
    while (proxima < tarefas.length) {
      const i = proxima++;
      resultados[i] = await tarefas[i]().then(
        (valor) => ({ ok: true, valor }),
        (erro) => ({ ok: false, erro }),
      );
    }
  };
  await Promise.all(Array.from({ length: Math.min(limite, tarefas.length) }, trabalhador));
  return resultados;
}

// Imagem de marcação usada na prévia, nas cores do cliente.
export function imagemExemplo(paleta) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${paleta.destaque}"/><stop offset="1" stop-color="${paleta.escura}"/></linearGradient></defs>
<rect width="1080" height="1350" fill="url(#g)"/>
<circle cx="800" cy="360" r="260" fill="#fff" opacity=".13"/><circle cx="260" cy="980" r="380" fill="#000" opacity=".14"/>
<text x="540" y="560" font-family="sans-serif" font-size="44" fill="#fff" opacity=".7" text-anchor="middle">imagem gerada pela IA</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
