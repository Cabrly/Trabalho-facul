export function iniciarTinta() {
    iniciarRastro();
    iniciarRespingo();
}


function iniciarRastro() {
    let ultimaMarca = 0;

    document.addEventListener("pointermove", (evento) => {

        const agora = performance.now();

        if (agora - ultimaMarca < 18) {
            return;
        }

        ultimaMarca = agora;

        criarMarcaPincel(
            evento.clientX,
            evento.clientY
        );

        // ocasionalmente cria uma gotinha menor
        if (Math.random() < 0.18) {
            criarGotinhaRastro(
                evento.clientX,
                evento.clientY
            );
        }
    });
}


function criarMarcaPincel(x, y) {

    const marca =
        document.createElement("span");

    marca.classList.add("ink-trail");

    const largura =
        14 + Math.random() * 28;

    const altura =
        4 + Math.random() * 9;

    marca.style.width =
        `${largura}px`;

    marca.style.height =
        `${altura}px`;

    marca.style.left =
        `${x}px`;

    marca.style.top =
        `${y}px`;

    marca.style.setProperty(
        "--rotacao",
        `${-20 + Math.random() * 40}deg`
    );

    document.body.append(marca);

    marca.addEventListener(
        "animationend",
        () => marca.remove()
    );
}


function criarGotinhaRastro(x, y) {

    const gota =
        document.createElement("span");

    gota.classList.add(
        "ink-trail-drop"
    );

    const tamanho =
        2 + Math.random() * 5;

    gota.style.width =
        `${tamanho}px`;

    gota.style.height =
        `${tamanho}px`;

    gota.style.left =
        `${x + (-12 + Math.random() * 24)}px`;

    gota.style.top =
        `${y + (-12 + Math.random() * 24)}px`;

    document.body.append(gota);

    gota.addEventListener(
        "animationend",
        () => gota.remove()
    );
}


function iniciarRespingo() {

    document.addEventListener(
        "pointerdown",
        (evento) => {

            criarRespingo(
                evento.clientX,
                evento.clientY
            );

        }
    );
}


function criarRespingo(x, y) {

    const grupo =
        document.createElement("div");

    grupo.classList.add(
        "ink-splash"
    );

    grupo.style.left =
        `${x}px`;

    grupo.style.top =
        `${y}px`;


    // Mancha central
    const centro =
        document.createElement("span");

    centro.classList.add(
        "ink-splash-center"
    );

    centro.style.setProperty(
        "--centro-rotacao",
        `${Math.random() * 50 - 25}deg`
    );

    grupo.append(centro);


    // Segunda mancha menor irregular
    const secundaria =
        document.createElement("span");

    secundaria.classList.add(
        "ink-splash-secondary"
    );

    secundaria.style.left =
        `${-15 + Math.random() * 30}px`;

    secundaria.style.top =
        `${-12 + Math.random() * 24}px`;

    grupo.append(secundaria);


    // Gotas externas
    const quantidade =
        12 +
        Math.floor(
            Math.random() * 9
        );


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const gota =
            document.createElement("span");

        gota.classList.add(
            "ink-drop"
        );

        const angulo =
            Math.random() *
            Math.PI *
            2;

        const distancia =
            25 +
            Math.random() *
            65;

        const xFinal =
            Math.cos(angulo) *
            distancia;

        const yFinal =
            Math.sin(angulo) *
            distancia;

        const tamanho =
            2 +
            Math.random() *
            8;

        gota.style.width =
            `${tamanho}px`;

        gota.style.height =
            `${tamanho}px`;

        gota.style.setProperty(
            "--gota-x",
            `${xFinal}px`
        );

        gota.style.setProperty(
            "--gota-y",
            `${yFinal}px`
        );

        grupo.append(gota);
    }


    document.body.append(grupo);


    setTimeout(
        () => grupo.remove(),
        1100
    );
}