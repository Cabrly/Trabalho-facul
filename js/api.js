export async function carregarTarefas() {

    const resposta =
        await fetch("./dados.json");


    if (!resposta.ok) {

        const erro =
            new Error(
                `Resposta HTTP ${resposta.status}`
            );

        erro.name = "ProtocolError";

        erro.status =
            resposta.status;

        throw erro;

    }


    const documento =
        await resposta.json();


    if (
        typeof documento !== "object" ||
        documento === null ||
        !Array.isArray(documento.tarefas)
    ) {

        throw new SyntaxError(
            "Formato de dados inválido."
        );

    }


    return documento.tarefas;
}