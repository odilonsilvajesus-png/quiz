/**
 * Receptor de inscrições — Negócio dos Gigantes
 *
 * 1. Crie uma Planilha Google e abra Extensões > Apps Script.
 * 2. Cole este código e salve.
 * 3. Implantar > Nova implantação > Tipo "App da Web"
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 4. Copie a URL gerada e cole em NDG_CONFIG.endpoint
 *    (public/negocio-dos-gigantes/index.html).
 */
var COLUNAS = [
  "enviado_em", "nome", "whatsapp", "email", "aluno", "turma", "unidade",
  "empresa", "cargo", "segmento", "frase", "produtos", "cliente_ideal",
  "instagram", "site", "whatsapp_comercial",
  "busca", "busca_outro", "quem_conhecer", "oferta_comunidade", "parceria",
  "confirma_disponibilidade", "autoriza_dados", "autoriza_imagem", "autoriza_catalogo",
  "restricao"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var dados = JSON.parse(e.postData.contents);
    var aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inscrições")
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Inscrições");
    if (aba.getLastRow() === 0) aba.appendRow(COLUNAS);
    aba.appendRow(COLUNAS.map(function (c) { return dados[c] || ""; }));
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
