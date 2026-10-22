
function horaAMinutos(hora) {
    const partes = hora.split(":");
    return Number(partes[0]) * 60 + Number(partes[1]);
}

function hayCruceDeHoras(inicioA, finA, inicioB, finB) {
    return inicioA < finB && inicioB < finA;
}

function obtenerBloque(id) {
    return obtenerBloques().find(bloque => bloque.id === id);
}

function obtenerIntervalos(horario) {
    const intervalos = [];

    horario.forEach(diaHorario => {
        diaHorario.bloques.forEach(id => {
            const bloque = obtenerBloque(id);

            if (bloque) {
                intervalos.push({
                    dia: diaHorario.dia,
                    inicio: horaAMinutos(bloque.inicio),
                    fin: horaAMinutos(bloque.fin),
                    aula: diaHorario.aula
                });
            }
        });
    });

    return intervalos;
}
