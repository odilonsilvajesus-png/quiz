// Tarefas demoradas (coleta, tom de voz) rodam em segundo plano no servidor.
// O painel inicia a tarefa e consulta o andamento, em vez de ficar esperando uma resposta que pode nunca chegar.
const tarefas = new Map();

function resumo(t) {
  return {
    rodando: t.rodando,
    etapa: t.etapa || "",
    erro: t.erro || null,
    resultado: t.resultado ?? null,
    segundos: t.inicio ? Math.round(((t.fim || Date.now()) - t.inicio) / 1000) : 0,
    terminou_em: t.fim ? new Date(t.fim).toISOString() : null,
  };
}

export function iniciarTarefa(chave, fn) {
  const atual = tarefas.get(chave);
  if (atual?.rodando) return resumo(atual);
  const t = { rodando: true, etapa: "Começando...", inicio: Date.now() };
  tarefas.set(chave, t);
  Promise.resolve()
    .then(() => fn((etapa) => { t.etapa = etapa; }))
    .then(
      (r) => { t.resultado = r; },
      (erro) => { t.erro = erro.message; console.error(`Tarefa ${chave} falhou: ${erro.message}`); },
    )
    .finally(() => { t.rodando = false; t.fim = Date.now(); });
  return resumo(t);
}

export const estadoTarefa = (chave) => resumo(tarefas.get(chave) || { rodando: false });
