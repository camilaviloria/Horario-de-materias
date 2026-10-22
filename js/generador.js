
function generarHorarios(materias = materiasSeleccionadas, maxResultados = 100) {
    const resultados = [];
    const seleccionActual = [];

    if (!materias || materias.length === 0) {
        return resultados;
    }

    function buscarCombinaciones(indice) {
        if (resultados.length >= maxResultados) {
            return;
        }

        if (indice === materias.length) {
            resultados.push([...seleccionActual]);
            return;
        }

        const materia = materias[indice];

        for (const seccion of materia.secciones) {
            const tieneChoque = seleccionActual.some(seleccionada =>
                seccionesTienenChoque(seleccionada.seccion, seccion)
            );

            if (tieneChoque) {
                continue;
            }

            seleccionActual.push({
                materia: materia,
                seccion: seccion
            });

            buscarCombinaciones(indice + 1);

            seleccionActual.pop();

            if (resultados.length >= maxResultados) {
                return;
            }
        }
    }

    buscarCombinaciones(0);

    return resultados;
}
