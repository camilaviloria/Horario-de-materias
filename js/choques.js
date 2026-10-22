
function seccionesTienenChoque(seccionA, seccionB) {
    const intervalosA = obtenerIntervalos(seccionA.horario);
    const intervalosB = obtenerIntervalos(seccionB.horario);

    return intervalosA.some(a => {
        return intervalosB.some(b => {
            return a.dia === b.dia &&
                hayCruceDeHoras(
                    a.inicio,
                    a.fin,
                    b.inicio,
                    b.fin
                );
        });
    });
}

function detectarChoques(secciones) {
    const choques = [];

    for (let i = 0; i < secciones.length; i++) {
        for (let j = i + 1; j < secciones.length; j++) {
            if (seccionesTienenChoque(secciones[i], secciones[j])) {
                choques.push({
                    seccionA: secciones[i],
                    seccionB: secciones[j]
                });
            }
        }
    }

    return choques;
}
