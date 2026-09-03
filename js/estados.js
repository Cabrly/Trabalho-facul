import {
    renderizarTarefas
} from "./renderizacao.js";


export function renderizarEstado(
    estado,
    dados = null
) {

    const mensagem =
        document.querySelector(
            "[data-estado]"
        );


    const quadro =
        document.querySelector(
            "#quadro"
        );


    mensagem.className =
        "estado";


    if (
        estado === "carregando"
    ) {

        mensagem.classList.add(
            "estado-carregando"
        );


        mensagem.textContent =
            "Carregando tarefas...";


        quadro.classList.add(
            "quadro-carregando"
        );


        return;
    }


    quadro.classList.remove(
        "quadro-carregando"
    );


    if (
        estado === "vazio"
    ) {

        mensagem.classList.add(
            "estado-vazio"
        );


        mensagem.textContent =
            "Nenhuma tarefa encontrada.";


        renderizarTarefas(
            [],
            quadro
        );


        return;
    }


    if (
        estado === "erro"
    ) {

        mensagem.classList.add(
            "estado-erro"
        );


        mensagem.textContent =
            dados;


        renderizarTarefas(
            [],
            quadro
        );


        return;
    }


    if (
        estado === "sucesso"
    ) {

        mensagem.classList.add(
            "estado-sucesso"
        );


        mensagem.textContent =
            `${dados.length} tarefas carregadas.`;


        renderizarTarefas(
            dados,
            quadro
        );

    }
}