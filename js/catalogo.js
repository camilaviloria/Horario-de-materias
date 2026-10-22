
function actualizarFiltroTrimestres() {
    const filtro = document.getElementById("filtro-trimestre");

    if (!filtro) {
        return;
    }

    const trimestreActual = filtro.value;

    filtro.innerHTML = '<option value="">Todos los trimestres</option>';

    obtenerTrimestres().forEach(trimestre => {
        const opcion = document.createElement("option");

        opcion.value = trimestre;
        opcion.textContent = "Trimestre " + trimestre;

        filtro.appendChild(opcion);
    });

    const existe = [...filtro.options].some(
        opcion => opcion.value === trimestreActual
    );

    if (existe) {
        filtro.value = trimestreActual;
    }
}

function iniciarCatalogo() {
    const busqueda = document.getElementById("busqueda");
    const filtro = document.getElementById("filtro-trimestre");

    if (!busqueda || !filtro) {
        return;
    }

    actualizarFiltroTrimestres();

    busqueda.addEventListener("input", mostrarCatalogo);
    filtro.addEventListener("change", mostrarCatalogo);

    mostrarCatalogo();
}

function mostrarCatalogo() {
    const catalogo = document.getElementById("catalogo");
    const busqueda = document.getElementById("busqueda");
    const filtro = document.getElementById("filtro-trimestre");
    const contador = document.getElementById("total-materias");

    if (!catalogo || !busqueda || !filtro) {
        return;
    }

    const texto = busqueda.value.trim().toLowerCase();
    const trimestre = filtro.value;

    const materiasFiltradas = obtenerMaterias().filter(materia => {
        const coincideTexto =
            materia.codigo.toLowerCase().includes(texto) ||
            materia.nombre.toLowerCase().includes(texto);

        const coincideTrimestre =
            trimestre === "" ||
            String(materia.trimestre) === trimestre;

        return coincideTexto && coincideTrimestre;
    });

    catalogo.innerHTML = "";

    if (contador) {
        contador.textContent = materiasFiltradas.length + " materias";
    }

    if (materiasFiltradas.length === 0) {
        catalogo.innerHTML =
            '<p class="estado-vacio">No se encontraron materias.</p>';
        return;
    }

    materiasFiltradas.forEach(materia => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-materia";

        const codigo = document.createElement("span");
        codigo.className = "codigo-materia";
        codigo.textContent = materia.codigo;

        const nombre = document.createElement("h3");
        nombre.textContent = materia.nombre;

        const detalle = document.createElement("p");
        detalle.className = "detalle-materia";
        detalle.textContent =
            "Trimestre " + materia.trimestre +
            " - " + materia.uc + " UC";

        const secciones = document.createElement("p");
        secciones.className = "detalle-materia";
        secciones.textContent =
            materia.secciones.length + " secciones disponibles";

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Agregar materia";

        boton.addEventListener("click", () => {
            agregarMateria(materia.codigo);
        });

        tarjeta.append(
            codigo,
            nombre,
            detalle,
            secciones,
            boton
        );

        catalogo.appendChild(tarjeta);
    });
}
