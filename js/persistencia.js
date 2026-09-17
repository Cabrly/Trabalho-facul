/* =========================================================
   PERSISTÊNCIA — guarda as tarefas no navegador
   ---------------------------------------------------------
   Salva o array de tarefas no localStorage para que as
   alterações (mover, criar, editar, excluir) sobrevivam ao
   recarregar a página. O dados.json continua servindo apenas
   como semente na primeira execução.
========================================================= */


const CHAVE = "kaizen.tarefas.v1";


/*
    Devolve as tarefas salvas ou null
    (quando nunca houve nada salvo, ou
    o conteúdo está corrompido).
*/
export function carregarSalvo() {

    let bruto = null;

    try {
        bruto = localStorage.getItem(CHAVE);
    } catch (erro) {
        /* localStorage bloqueado (ex.: aba privada). */
        return null;
    }

    if (!bruto) {
        return null;
    }

    try {

        const dados = JSON.parse(bruto);

        if (Array.isArray(dados)) {
            return dados;
        }

    } catch (erro) {
        /* JSON inválido → ignora e recomeça da semente. */
        return null;
    }

    return null;
}


/*
    Grava o array de tarefas.
    Falhas de armazenamento são silenciosas:
    o app continua funcionando na memória.
*/
export function salvar(tarefas) {

    try {

        localStorage.setItem(
            CHAVE,
            JSON.stringify(tarefas)
        );

    } catch (erro) {
        /* Sem espaço ou bloqueado: não quebra a aplicação. */
    }
}


/*
    Limpa o armazenamento (usado por um eventual
    botão de "restaurar exemplo").
*/
export function limparSalvo() {

    try {
        localStorage.removeItem(CHAVE);
    } catch (erro) {
        /* nada a fazer */
    }
}
