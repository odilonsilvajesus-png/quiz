// ZIP simples (sem compressão), suficiente para baixar os PNGs de um carrossel de uma vez.
import fs from "node:fs";
import path from "node:path";

const TABELA = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABELA[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function criarZip(arquivos) {
  const partes = [];
  const central = [];
  let posicao = 0;
  for (const arquivo of arquivos) {
    const dados = fs.readFileSync(arquivo);
    const nome = Buffer.from(path.basename(arquivo));
    const crc = crc32(dados);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(dados.length, 18);
    local.writeUInt32LE(dados.length, 22);
    local.writeUInt16LE(nome.length, 26);
    partes.push(local, nome, dados);

    const cabecalho = Buffer.alloc(46);
    cabecalho.writeUInt32LE(0x02014b50, 0);
    cabecalho.writeUInt16LE(20, 4);
    cabecalho.writeUInt16LE(20, 6);
    cabecalho.writeUInt32LE(crc, 16);
    cabecalho.writeUInt32LE(dados.length, 20);
    cabecalho.writeUInt32LE(dados.length, 24);
    cabecalho.writeUInt16LE(nome.length, 28);
    cabecalho.writeUInt32LE(posicao, 42);
    central.push(cabecalho, nome);
    posicao += local.length + nome.length + dados.length;
  }
  const tamanhoCentral = central.reduce((t, b) => t + b.length, 0);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(arquivos.length, 8);
  fim.writeUInt16LE(arquivos.length, 10);
  fim.writeUInt32LE(tamanhoCentral, 12);
  fim.writeUInt32LE(posicao, 16);
  return Buffer.concat([...partes, ...central, fim]);
}
