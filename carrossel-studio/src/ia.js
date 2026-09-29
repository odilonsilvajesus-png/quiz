// Camada de IA: o resto do sistema não sabe se quem escreve é o GPT (OpenAI) ou o Claude (Anthropic).
// Escolha: IA_PROVEDOR=openai|anthropic no .env. Sem isso, usa a primeira chave que encontrar.
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { registrarUso, custoTextoOpenAI, custoClaude } from "./custos.js";

const MODELO_OPENAI = () => process.env.OPENAI_MODEL || "gpt-5.5";
const MODELO_CLAUDE = () => process.env.CLAUDE_MODEL || "claude-opus-5-5";

export function provedor() {
  const escolhido = process.env.IA_PROVEDOR?.toLowerCase();
  if (escolhido === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (escolhido === "anthropic" && process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

export const nomeProvedor = () => ({ openai: "GPT", anthropic: "Claude" })[provedor()] || null;

// Resposta em JSON validada pelo schema Zod.
export async function gerarEstruturado({ sistema, usuario, schema, nome }) {
  if (provedor() === "openai") {
    const client = new OpenAI();
    const resposta = await client.responses.parse({
      model: MODELO_OPENAI(),
      instructions: sistema,
      input: usuario,
      text: { format: zodTextFormat(schema, nome) },
    });
    registrarUso({ servico: "texto", modelo: resposta.model, usd: custoTextoOpenAI(resposta.model, resposta.usage) });
    if (resposta.status === "incomplete") {
      throw new Error(`A resposta veio incompleta (${resposta.incomplete_details?.reason ?? "motivo desconhecido"}). Tente de novo.`);
    }
    if (!resposta.output_parsed) throw new Error("O GPT não devolveu um resultado válido. Tente de novo.");
    return resposta.output_parsed;
  }

  if (provedor() === "anthropic") {
    const client = new Anthropic();
    const resposta = await client.beta.messages.parse({
      model: MODELO_CLAUDE(),
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "high", format: betaZodOutputFormat(schema) },
      // O prompt de sistema é igual em todas as chamadas do cliente: fica em cache.
      system: [{ type: "text", text: sistema, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: usuario }],
    });
    registrarUso({ servico: "texto", modelo: resposta.model, usd: custoClaude(resposta.model, resposta.usage) });
    if (resposta.stop_reason === "refusal") {
      throw new Error(`O modelo recusou o pedido (${resposta.stop_details?.category ?? "sem categoria"}). Tente outra referência.`);
    }
    if (resposta.stop_reason === "max_tokens" || !resposta.parsed_output) {
      throw new Error("A resposta veio incompleta. Tente de novo.");
    }
    return resposta.parsed_output;
  }

  throw new Error("Nenhuma chave de IA configurada. Preencha OPENAI_API_KEY (ou ANTHROPIC_API_KEY) no .env.");
}

export async function gerarTexto(prompt) {
  if (provedor() === "openai") {
    const client = new OpenAI();
    const resposta = await client.responses.create({ model: MODELO_OPENAI(), input: prompt });
    registrarUso({ servico: "texto", modelo: resposta.model, usd: custoTextoOpenAI(resposta.model, resposta.usage) });
    return resposta.output_text;
  }

  if (provedor() === "anthropic") {
    const client = new Anthropic();
    const resposta = await client.beta.messages.create({
      model: MODELO_CLAUDE(),
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "high" },
      messages: [{ role: "user", content: prompt }],
    });
    registrarUso({ servico: "texto", modelo: resposta.model, usd: custoClaude(resposta.model, resposta.usage) });
    if (resposta.stop_reason === "refusal") throw new Error("O modelo recusou o pedido.");
    return resposta.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  }

  throw new Error("Nenhuma chave de IA configurada. Preencha OPENAI_API_KEY (ou ANTHROPIC_API_KEY) no .env.");
}
