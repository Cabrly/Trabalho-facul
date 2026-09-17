import {
    carregarTarefas
} from "./api.js";


import {
    renderizarEstado
} from "./estados.js";


import {
    iniciarTinta
} from "./tinta.js";


import {
    iniciarFundo
} from "./fundo.js";


import {
    iniciarAcoes
} from "./acoes.js";


import {
    carregarSalvo,
    salvar
} from "./persistencia.js";



/*
    Fonte única de verdade da aplicação.

    Não armazenamos tarefas filtradas aqui.
    A lista visível sempre será calculada
    novamente a partir deste estado.
*/
const estado = {

    tarefas: [],

    busca: "",

    status: "todos",

    prioridade: "todas",

    ordenacao: "padrao",

    carregando: true,

    erro: null

};



const busca =
    document.querySelector("#busca");


const filtroStatus =
    document.querySelector("#filtro-status");


const filtroPrioridade =
    document.querySelector("#filtro-prioridade");


const ordenacao =
    document.querySelector("#ordenacao");


const limparFiltros =
    document.querySelector("#limpar-filtros");



/*
    Recebe o estado e devolve
    uma nova lista.

    Não altera estado.tarefas.
    Não consulta o DOM.
*/
function derivarTarefas(estadoAtual) {

    /*
        Criamos uma cópia.

        Isso é importante principalmente
        porque sort() altera o array
        no qual ele é executado.
    */
    let tarefasVisiveis =
        [...estadoAtual.tarefas];


    /*
        BUSCA
    */
    const textoBusca =
        estadoAtual.busca
            .trim()
            .toLowerCase();


    if (textoBusca !== "") {

        tarefasVisiveis =
            tarefasVisiveis.filter(
                (tarefa) =>
                    tarefa.titulo
                        .toLowerCase()
                        .includes(textoBusca)
            );

    }


    /*
        STATUS
    */
    if (
        estadoAtual.status !==
        "todos"
    ) {

        tarefasVisiveis =
            tarefasVisiveis.filter(
                (tarefa) =>
                    tarefa.status ===
                    estadoAtual.status
            );

    }


    /*
        PRIORIDADE
    */
    if (
        estadoAtual.prioridade !==
        "todas"
    ) {

        tarefasVisiveis =
            tarefasVisiveis.filter(
                (tarefa) =>
                    tarefa.prioridade ===
                    estadoAtual.prioridade
            );

    }


    /*
        ORDENAÇÃO

        A ordenação acontece somente
        na cópia criada anteriormente.
    */
    if (
        estadoAtual.ordenacao ===
        "prazo-asc"
    ) {

        tarefasVisiveis.sort(
            (a, b) =>
                a.prazo.localeCompare(
                    b.prazo
                )
        );

    }


    if (
        estadoAtual.ordenacao ===
        "prazo-desc"
    ) {

        tarefasVisiveis.sort(
            (a, b) =>
                b.prazo.localeCompare(
                    a.prazo
                )
        );

    }


    return tarefasVisiveis;
}



/*
    Mantém os controles sincronizados
    com o objeto de estado.
*/
function sincronizarControles() {

    busca.value =
        estado.busca;


    filtroStatus.value =
        estado.status;


    filtroPrioridade.value =
        estado.prioridade;


    ordenacao.value =
        estado.ordenacao;

}



/*
    Este é o único ponto de atualização
    da interface.

    Estado
        ↓
    derivação
        ↓
    renderização
*/
function atualizarInterface() {

    sincronizarControles();


    /*
        A lista visível é derivada
        apenas uma vez neste ciclo.
    */
    const tarefasVisiveis =
        derivarTarefas(estado);


    renderizarEstado(
        estado,
        tarefasVisiveis
    );

}



/*
    Chamado sempre que uma AÇÃO altera as tarefas
    (criar, editar, excluir, mover).

    Grava no armazenamento e re-renderiza a partir
    do mesmo estado — mantendo a fonte única.
*/
function aoAlterar() {

    salvar(estado.tarefas);

    atualizarInterface();

}



/*
    EVENTOS DOS CONTROLES

    Cada evento:
    1. altera o estado
    2. chama atualizarInterface()
*/


busca.addEventListener(
    "input",
    (evento) => {

        estado.busca =
            evento.target.value;


        atualizarInterface();

    }
);



filtroStatus.addEventListener(
    "change",
    (evento) => {

        estado.status =
            evento.target.value;


        atualizarInterface();

    }
);



filtroPrioridade.addEventListener(
    "change",
    (evento) => {

        estado.prioridade =
            evento.target.value;


        atualizarInterface();

    }
);



ordenacao.addEventListener(
    "change",
    (evento) => {

        estado.ordenacao =
            evento.target.value;


        atualizarInterface();

    }
);



limparFiltros.addEventListener(
    "click",
    () => {

        estado.busca = "";

        estado.status =
            "todos";

        estado.prioridade =
            "todas";

        estado.ordenacao =
            "padrao";


        atualizarInterface();

    }
);



async function iniciar() {

    iniciarFundo();

    iniciarTinta();


    /*
        Liga as interações do quadro
        (arrastar, criar, editar, excluir, mover).
    */
    iniciarAcoes({ estado, aoAlterar });


    /*
        Se já existirem tarefas salvas no navegador,
        elas têm prioridade sobre o dados.json.

        Assim, tudo que o usuário mexeu continua
        valendo depois de recarregar a página.
    */
    const salvas = carregarSalvo();

    if (salvas) {

        estado.tarefas = salvas;

        estado.carregando = false;

        estado.erro = null;


        atualizarInterface();

        return;

    }


    /*
        Primeira execução (sem nada salvo):
        carregando antes do await.
    */
    estado.carregando = true;

    estado.erro = null;


    atualizarInterface();


    try {

        /*
            carregarTarefas apenas obtém
            os dados.

            Nenhuma regra de filtro
            existe na API.
        */
        const tarefas =
            await carregarTarefas();


        /*
            O array original vindo
            da API é armazenado no estado.
        */
        estado.tarefas =
            tarefas;


        estado.carregando = false;

        estado.erro = null;


        /*
            Guarda a semente para as próximas visitas.
        */
        salvar(estado.tarefas);


        atualizarInterface();

    } catch (erro) {

        estado.carregando = false;


        if (
            erro.name ===
            "TypeError"
        ) {

            estado.erro =
                "Erro de rede. Não foi possível carregar as tarefas.";

        } else if (
            erro.name ===
            "SyntaxError"
        ) {

            estado.erro =
                "Erro de formato. O arquivo JSON é inválido.";

        } else if (
            erro.name ===
            "ProtocolError"
        ) {

            estado.erro =
                `Erro de protocolo. O servidor respondeu com HTTP ${erro.status}.`;

        } else {

            estado.erro =
                "Ocorreu um erro inesperado.";

        }


        atualizarInterface();

    }

}



iniciar();