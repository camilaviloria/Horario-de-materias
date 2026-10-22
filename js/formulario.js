
let materiasManuales = [];

function iniciarFormulario() {
    const formulario = document.getElementById("formulario-materia");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const codigo = document
            .getElementById("codigo-manual")
            .value
            .trim()
            .toUpperCase();

        const nombre = document
            .getElementById("nombre-manual")
            .value
            .trim();

        const trimestre = Number(
            document.getElementById("trimestre-manual").value
        );

        const uc = Number(
            document.getElementById("uc-manual").value
        );

        const mensaje = document.getElementById("mensaje-manual");

        if (!codigo || !nombre || !Number.isInteger(trimestre) ||
            trimestre < 1 || !Number.isInteger(uc) || uc < 1 || uc > 28) {
            mensaje.textContent =
                "Revisa los datos. El trimestre debe ser mayor que 0 y las UC deben estar entre 1 y 28.";
            return;
        }

        const existe = obtenerMaterias().some(
            materia => materia.codigo.toUpperCase() === codigo
        );

        if (existe) {
            mensaje.textContent =
                "Ya existe una materia con ese codigo.";
            return;
        }

        const materia = {
            codigo: codigo,
            nombre: nombre,
            trimestre: trimestre,
            uc: uc,
            secciones: []
        };

        materiasManuales.push(materia);

        actualizarFiltroTrimestres();
        mostrarCatalogo();

        mensaje.textContent =
            "Materia agregada al catalogo temporalmente.";

        formulario.reset();
    });
}
