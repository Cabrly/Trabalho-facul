import {
    carregarTarefas
} from "./api.js";


import {
    renderizarEstado
} from "./estados.js";


import {
    iniciarTinta
} from "./tinta.js";


async function iniciar() {

    iniciarTinta();


    /*
        Obrigatório:
        carregando ANTES do await.
    */

    renderizarEstado(
        "carregando"
    );


    try {

        const tarefas =
            await carregarTarefas();


        /*
            Vazio não é erro.
        */

        if (
            tarefas.length === 0
        ) {

            renderizarEstado(
                "vazio"
            );

            return;

        }


        renderizarEstado(
            "sucesso",
            tarefas
        );


    } catch (erro) {


        if (
            erro.name ===
            "TypeError"
        ) {

            renderizarEstado(
                "erro",
                "Erro de rede. Não foi possível carregar as tarefas."
            );

            return;

        }


        if (
            erro.name ===
            "SyntaxError"
        ) {

            renderizarEstado(
                "erro",
                "Erro de formato. O arquivo JSON é inválido."
            );

            return;

        }


        if (
            erro.name ===
            "ProtocolError"
        ) {

            renderizarEstado(
                "erro",
                `Erro de protocolo. O servidor respondeu com HTTP ${erro.status}.`
            );

            return;

        }


        renderizarEstado(
            "erro",
            "Ocorreu um erro inesperado."
        );

    }
}


iniciar();