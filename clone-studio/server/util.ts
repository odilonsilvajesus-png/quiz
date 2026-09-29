import fs from "node:fs";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** fetch com erro legível e novas tentativas em falhas temporárias (429/5xx/rede). */
export async function request(url: string, init: RequestInit & { retries?: number } = {}) {
  const { retries = 3, ...opts } = init;
  for (let attempt = 0; ; attempt++) {
    let res: Response | undefined;
    try {
      res = await fetch(url, opts);
    } catch (err) {
      if (attempt >= retries) throw err;
    }
    if (res?.ok) return res;
    if (res && res.status !== 429 && res.status < 500) {
      throw new HttpError(res.status, `${new URL(url).host} respondeu ${res.status}: ${await res.text()}`);
    }
    if (attempt >= retries) {
      throw new HttpError(res?.status ?? 0, `${new URL(url).host} indisponível (${res?.status ?? "rede"})`);
    }
    await sleep(1000 * 2 ** attempt);
  }
}

export async function download(url: string, file: string) {
  const res = await request(url);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}
