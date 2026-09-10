export function iniciarTinta() {
    iniciarRastro();
}


function iniciarRastro() {

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.classList.add(
        "rastro-svg"
    );


    const caminho =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    caminho.classList.add(
        "rastro-caminho"
    );


    svg.append(
        caminho
    );


    document.body.append(
        svg
    );


    let pontos = [];

    let tempoFade = null;

    let desaparecendo = false;


    document.addEventListener(
        "pointermove",
        (evento) => {

            /*
                Cancela o desaparecimento
                enquanto o mouse estiver
                se movimentando.
            */
            clearTimeout(
                tempoFade
            );


            desaparecendo = false;


            caminho.classList.remove(
                "desaparecendo"
            );


            /*
                Adiciona a posição atual
                ao mesmo caminho.
            */
            pontos.push({
                x: evento.clientX,
                y: evento.clientY
            });


            /*
                Limite de pontos para o
                rastro não ficar enorme.
            */
            if (
                pontos.length > 35
            ) {

                pontos.shift();

            }


            desenharCaminho(
                caminho,
                pontos
            );


            /*
                O rastro só começa a
                desaparecer quando o
                movimento realmente parar.
            */
            tempoFade =
                setTimeout(
                    () => {

                        desaparecerRastro(
                            caminho,
                            () => {

                                pontos = [];

                                caminho.setAttribute(
                                    "d",
                                    ""
                                );

                            }
                        );

                    },
                    100
                );

        }
    );


    document.addEventListener(
        "pointerleave",
        () => {

            clearTimeout(
                tempoFade
            );


            desaparecerRastro(
                caminho,
                () => {

                    pontos = [];

                    caminho.setAttribute(
                        "d",
                        ""
                    );

                }
            );

        }
    );

}



function desenharCaminho(
    caminho,
    pontos
) {

    if (
        pontos.length < 2
    ) {

        return;

    }


    /*
        Começa exatamente no
        primeiro ponto.
    */
    let desenho =
        `M ${pontos[0].x} ${pontos[0].y}`;


    /*
        Curva suave entre os pontos.

        Como tudo pertence ao mesmo
        path SVG, não existem buracos
        entre os segmentos.
    */
    for (
        let i = 1;
        i < pontos.length - 1;
        i++
    ) {

        const atual =
            pontos[i];


        const proximo =
            pontos[i + 1];


        const meioX =
            (
                atual.x +
                proximo.x
            ) / 2;


        const meioY =
            (
                atual.y +
                proximo.y
            ) / 2;


        desenho +=
            ` Q ${atual.x} ${atual.y} ${meioX} ${meioY}`;

    }


    /*
        Liga até a posição mais recente
        para não existir atraso visual
        na ponta da lâmina.
    */
    const ultimo =
        pontos[
            pontos.length - 1
        ];


    desenho +=
        ` L ${ultimo.x} ${ultimo.y}`;


    caminho.setAttribute(
        "d",
        desenho
    );

}



function desaparecerRastro(
    caminho,
    aoTerminar
) {

    caminho.classList.add(
        "desaparecendo"
    );


    const finalizar =
        () => {

            caminho.removeEventListener(
                "transitionend",
                finalizar
            );


            caminho.classList.remove(
                "desaparecendo"
            );


            aoTerminar();

        };


    caminho.addEventListener(
        "transitionend",
        finalizar
    );

}