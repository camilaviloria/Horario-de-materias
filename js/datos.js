
const LIMITE_UC = 28;

function obtenerMaterias() {
    const materias = typeof MATERIAS === "undefined" ? [] : MATERIAS;
    const manuales = typeof materiasManuales === "undefined" ? [] : materiasManuales;

    return [...materias, ...manuales];
}

function obtenerBloques() {
    if (typeof BLOQUES === "undefined") {
        return [];
    }

    return BLOQUES;
}

function obtenerTrimestres() {
    const materias = obtenerMaterias();

    return [...new Set(materias.map(materia => materia.trimestre))]
        .sort((a, b) => Number(a) - Number(b));
}

function buscarMateria(codigo) {
    return obtenerMaterias().find(
        materia => materia.codigo === codigo
    );
}
