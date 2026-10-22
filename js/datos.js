
const LIMITE_UC = 28;

function obtenerMaterias() {
    if (typeof MATERIAS === "undefined") {
        return [];
    }

    return MATERIAS;
}

function obtenerBloques() {
    if (typeof BLOQUES === "undefined") {
        return [];
    }

    return BLOQUES;
}

function obtenerTrimestres() {
    const materias = obtenerMaterias();

    return [...new Set(
        materias.map(materia => materia.trimestre)
    )].sort((a, b) => Number(a) - Number(b));
}

function buscarMateria(codigo) {
    return obtenerMaterias().find(
        materia => materia.codigo === codigo
    );
}
