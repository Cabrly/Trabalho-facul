export function renderizarTarefas(
    tarefas,
    quadro
) {

    const areas =
        quadro.querySelectorAll(
            "[data-tarefas]"
        );


    areas.forEach((area) => {

        area.replaceChildren();

    });


    tarefas.forEach((tarefa) => {

        const area =
            quadro.querySelector(
                `[data-tarefas="${tarefa.status}"]`
            );


        if (!area) {
            return;
        }


        const artigo =
            document.createElement(
                "article"
            );


        artigo.classList.add(
            "task"
        );


        if (
            tarefa.status ===
            "em-andamento"
        ) {

            artigo.classList.add(
                "active"
            );

        }


        if (
            tarefa.status ===
            "concluido"
        ) {

            artigo.classList.add(
                "completed"
            );

        }


        const topo =
            document.createElement(
                "div"
            );


        topo.classList.add(
            "task-top"
        );


        const prioridade =
            document.createElement(
                "span"
            );


        prioridade.classList.add(
            "priority",
            obterClassePrioridade(
                tarefa
            )
        );


        prioridade.textContent =
            obterTextoPrioridade(
                tarefa
            );


        const menu =
            document.createElement(
                "button"
            );


        menu.type = "button";

        menu.classList.add(
            "menu"
        );

        menu.textContent = "•••";


        const titulo =
            document.createElement(
                "h4"
            );


        titulo.textContent =
            tarefa.titulo;


        const descricao =
            document.createElement(
                "p"
            );


        descricao.textContent =
            obterDescricao(
                tarefa.status
            );


        const rodape =
            document.createElement(
                "div"
            );


        rodape.classList.add(
            "task-footer"
        );


        const prazo =
            document.createElement(
                "span"
            );


        if (
            tarefa.status ===
            "concluido"
        ) {

            prazo.textContent =
                "✓ Concluído";

        } else {

            prazo.textContent =
                `📅 ${formatarData(
                    tarefa.prazo
                )}`;

        }


        const avatar =
            document.createElement(
                "span"
            );


        avatar.classList.add(
            "avatar"
        );


        avatar.textContent =
            tarefa.titulo
                .charAt(0)
                .toUpperCase();


        topo.append(
            prioridade,
            menu
        );


        rodape.append(
            prazo,
            avatar
        );


        artigo.append(
            topo,
            titulo,
            descricao,
            rodape
        );


        area.append(
            artigo
        );

    });


    atualizarContadores(
        tarefas,
        quadro
    );


    atualizarProgresso(
        tarefas
    );
}



function obterClassePrioridade(
    tarefa
) {

    if (
        tarefa.status ===
        "concluido"
    ) {

        return "done-tag";

    }


    if (
        tarefa.prioridade ===
        "alta"
    ) {

        return "high";

    }


    if (
        tarefa.prioridade ===
        "media"
    ) {

        return "medium";

    }


    return "low";
}



function obterTextoPrioridade(
    tarefa
) {

    if (
        tarefa.status ===
        "concluido"
    ) {

        return "Feito";

    }


    const nomes = {

        alta: "Alta",

        media: "Média",

        baixa: "Baixa"

    };


    return nomes[
        tarefa.prioridade
    ];
}



function obterDescricao(
    status
) {

    const descricoes = {

        "a-fazer":
            "Tarefa aguardando início.",

        "em-andamento":
            "Tarefa em desenvolvimento.",

        "em-revisao":
            "Tarefa aguardando revisão.",

        "concluido":
            "Tarefa finalizada."

    };


    return descricoes[status];
}



function formatarData(
    data
) {

    const [
        ano,
        mes,
        dia
    ] = data.split("-");


    return `${dia}/${mes}/${ano}`;
}



function atualizarContadores(
    tarefas,
    quadro
) {

    const status = [

        "a-fazer",

        "em-andamento",

        "em-revisao",

        "concluido"

    ];


    status.forEach(
        (estado) => {

            const quantidade =
                tarefas.filter(
                    (tarefa) =>
                        tarefa.status ===
                        estado
                ).length;


            const contador =
                quadro.querySelector(
                    `[data-contador="${estado}"]`
                );


            if (contador) {

                contador.textContent =
                    quantidade;

            }

        }
    );
}



function atualizarProgresso(
    tarefas
) {

    const texto =
        document.querySelector(
            "#progresso-texto"
        );


    const barra =
        document.querySelector(
            "#progresso-barra"
        );


    if (
        tarefas.length === 0
    ) {

        texto.textContent =
            "0%";

        barra.style.width =
            "0%";

        return;

    }


    const concluidas =
        tarefas.filter(
            (tarefa) =>
                tarefa.status ===
                "concluido"
        ).length;


    const porcentagem =
        Math.round(
            (
                concluidas /
                tarefas.length
            ) * 100
        );


    texto.textContent =
        `${porcentagem}%`;


    barra.style.width =
        `${porcentagem}%`;
}