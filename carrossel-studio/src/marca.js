// Lê o mapa da marca (imagem ou PDF) com a IA e devolve a paleta, a fonte e as diretrizes.
import { registrarUso, custoTextoOpenAI } from "./custos.js";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { FONTES } from "./cliente.js";

const MODELO = () => process.env.OPENAI_MODEL || "gpt-5.5";
const hex = z.string().describe("Cor em hexadecimal #RRGGBB");

const esquema = z.object({
  cores_encontradas: z.array(z.object({ hex, nome: z.string().describe("Nome ou uso da cor no mapa, ex.: primária, fundo, destaque") })),
  paleta: z.object({
    escura: hex.describe("Cor escura para fundo de slides escuros"),
    clara: hex.describe("Cor clara para fundo de slides claros"),
    destaque: hex.describe("Cor principal de destaque da marca"),
    destaque2: hex.describe("Segunda cor, usada no gradiente com a de destaque"),
    texto_claro: hex.describe("Cor do texto sobre fundo escuro"),
    texto_escuro: hex.describe("Cor do texto sobre fundo claro"),
  }),
  gradiente: z.boolean().describe("Se a marca usa degradê entre a cor de destaque e a segunda cor"),
  fontes_do_mapa: z.array(z.string()).describe("Fontes citadas no mapa da marca"),
  fonte: z.enum(FONTES).describe("Fonte disponível mais parecida com a fonte de títulos da marca"),
  diretrizes: z.string().describe("Tudo o que o mapa diz sobre tom, estilo, uso de cores, elementos gráficos e o que evitar. Vazio se não houver."),
});

export const podeLerMapa = () => Boolean(process.env.OPENAI_API_KEY);

export async function lerMapaDaMarca({ nome, dataUrl }) {
  if (!podeLerMapa()) throw new Error("Para ler o mapa da marca, preencha OPENAI_API_KEY no .env.");
  const pdf = /^data:application\/pdf/.test(dataUrl) || /\.pdf$/i.test(nome);
  const arquivo = pdf
    ? { type: "input_file", filename: nome || "mapa.pdf", file_data: dataUrl }
    : { type: "input_image", image_url: dataUrl, detail: "high" };
  const client = new OpenAI();
  const resposta = await client.responses.parse({
    model: MODELO(),
    input: [{
      role: "user",
      content: [
        {
          type: "input_text",
          text: `Este é o mapa da marca (brand book / guia de identidade visual) de um cliente. Leia os códigos de cor exatos quando estiverem escritos; se não estiverem, estime pelas amostras de cor.
Monte a paleta para carrosséis do Instagram: um fundo escuro, um fundo claro, a cor de destaque, uma segunda cor para degradê e as cores de texto que ficam legíveis sobre cada fundo.
Escolha, entre estas fontes disponíveis, a mais parecida com a fonte de títulos da marca: ${FONTES.join(", ")}.
Copie também as diretrizes escritas no mapa (tom, estilo, uso de cores e elementos, o que evitar).`,
        },
        arquivo,
      ],
    }],
    text: { format: zodTextFormat(esquema, "mapa_da_marca") },
  });
  registrarUso({ servico: "leitura do mapa", modelo: resposta.model, usd: custoTextoOpenAI(resposta.model, resposta.usage) });
  if (!resposta.output_parsed) throw new Error("Não consegui ler o mapa da marca. Tente uma imagem mais nítida.");
  return resposta.output_parsed;
}
