// Publica um carrossel no Instagram pela API oficial (Instagram Graph API, conta Profissional).
// A API busca cada imagem por um link público, então as imagens sobem antes para o ImgBB.
import fs from "node:fs";

const VERSAO = () => process.env.IG_GRAPH_VERSION || "v23.0";
// Tokens do "Login do Instagram" começam com IG; os do Facebook usam graph.facebook.com.
// IG_GRAPH_BASE e IMGBB_URL só servem para testes com servidores simulados.
const base = (token) =>
  `${process.env.IG_GRAPH_BASE || `https://graph.${token.startsWith("IG") ? "instagram" : "facebook"}.com`}/${VERSAO()}`;
const IMGBB = () => process.env.IMGBB_URL || "https://api.imgbb.com/1/upload";

export const temHospedagem = () => Boolean(process.env.IMGBB_API_KEY);

async function graph(token, metodo, caminho, params = {}) {
  const url = new URL(`${base(token)}/${caminho}`);
  const corpo = new URLSearchParams({ ...params, access_token: token });
  const resp = metodo === "GET"
    ? await fetch(`${url}?${corpo}`)
    : await fetch(url, { method: "POST", body: corpo });
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok || dados.error) {
    throw new Error(`Instagram: ${dados.error?.error_user_msg || dados.error?.message || `erro ${resp.status}`}`);
  }
  return dados;
}

// Sobe a imagem para o ImgBB e devolve o link público (expira em 1 dia, só precisa durar a publicação).
async function hospedar(arquivo) {
  const corpo = new URLSearchParams({ image: fs.readFileSync(arquivo).toString("base64") });
  const resp = await fetch(`${IMGBB()}?expiration=86400&key=${process.env.IMGBB_API_KEY}`, {
    method: "POST",
    body: corpo,
  });
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok || !dados.data?.url) throw new Error(`Falha ao hospedar a imagem: ${dados.error?.message || resp.status}`);
  return dados.data.url;
}

const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function aguardarPronto(token, containerId) {
  for (let tentativa = 0; tentativa < 30; tentativa++) {
    const { status_code: estado } = await graph(token, "GET", containerId, { fields: "status_code" });
    if (estado === "FINISHED") return;
    if (estado === "ERROR" || estado === "EXPIRED") throw new Error(`Instagram recusou o carrossel (${estado}).`);
    await esperar(2000);
  }
  throw new Error("O Instagram demorou demais para processar as imagens. Tente de novo.");
}

// arquivos: caminhos dos JPEGs na ordem dos slides. Devolve { id, permalink }.
export async function publicarCarrossel({ igUserId, token, arquivos, legenda, log = () => {} }) {
  if (arquivos.length < 2) throw new Error("O carrossel precisa de pelo menos 2 slides.");
  if (arquivos.length > 20) throw new Error("O Instagram aceita no máximo 20 slides por carrossel.");

  log("Enviando imagens...");
  const links = [];
  for (const arquivo of arquivos) links.push(await hospedar(arquivo));

  log("Criando os slides no Instagram...");
  const filhos = [];
  for (const url of links) {
    const { id } = await graph(token, "POST", `${igUserId}/media`, { image_url: url, is_carousel_item: "true" });
    filhos.push(id);
  }
  for (const id of filhos) await aguardarPronto(token, id);

  const { id: carrossel } = await graph(token, "POST", `${igUserId}/media`, {
    media_type: "CAROUSEL",
    children: filhos.join(","),
    caption: legenda || "",
  });
  await aguardarPronto(token, carrossel);

  log("Publicando...");
  const { id } = await graph(token, "POST", `${igUserId}/media_publish`, { creation_id: carrossel });
  const { permalink } = await graph(token, "GET", id, { fields: "permalink" }).catch(() => ({}));
  return { id, permalink: permalink || "" };
}

// Foto e seguidores da conta conectada (grátis, pela API oficial).
export async function dadosDoPerfil({ igUserId, token }) {
  const d = await graph(token, "GET", igUserId, { fields: "username,profile_picture_url,followers_count" });
  return { foto: d.profile_picture_url || null, seguidores: d.followers_count ?? null };
}

// Confere se a conexão funciona e devolve o @ da conta.
export async function testarConexao({ igUserId, token }) {
  const dados = await graph(token, "GET", igUserId, { fields: "username" });
  return dados.username ? `@${dados.username}` : "";
}
