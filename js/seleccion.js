
let materiasSeleccionadas = [];

function agregarMateria(codigo) {
    const materia = buscarMateria(codigo);

    if (!materia) {
        mostrarMensaje("No se encontro la materia.");
        return;
    }

    const yaExiste = materiasSeleccionadas.some(
        seleccionada => seleccionada.codigo === codigo
    );

    if (yaExiste) {
        mostrarMensaje("Esa materia ya esta seleccionada.");
        return;
    }

    const creditosActuales = materiasSeleccionadas.reduce(
        (total, seleccionada) => total + Number(seleccionada.uc),
        0
    );

    if (creditosActuales + Number(materia.uc) > LIMITE_UC) {
        mostrarMensaje("No puedes superar el limite de 28 UC.");
        return;
    }

    materiasSeleccionadas.push(materia);

    mostrarMensaje("Materia agregada correctamente.");
    mostrarSeleccion();
}

function quitarMateria(codigo) {
    materiasSeleccionadas = materiasSeleccionadas.filter(
        materia => materia.codigo !== codigo
    );

    mostrarMensaje("Materia eliminada de la seleccion.");
    mostrarSeleccion();
}

function mostrarSeleccion() {
    const contenedor = document.getElementById("seleccion");
    const contador = document.getElementById("contador-uc");

    if (!contenedor || !contador) {
        return;
    }

    const creditos = materiasSeleccionadas.reduce(
        (total, materia) => total + Number(materia.uc),
        0
    );

    contador.textContent = creditos + " / " + LIMITE_UC + " UC";
    contenedor.innerHTML = "";

    if (materiasSeleccionadas.length === 0) {
        contenedor.innerHTML =
            '<p class="estado-vacio">Todavia no has seleccionado materias.</p>';
        return;
    }

    materiasSeleccionadas.forEach(materia => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-seleccion";

        const nombre = document.createElement("h3");
        nombre.textContent = materia.nombre;

        const detalle = document.createElement("p");
        detalle.className = "detalle-materia";
        detalle.textContent =
            materia.codigo + " - " + materia.uc + " UC";

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "boton-secundario";
        boton.textContent = "Quitar materia";

        boton.addEventListener("click", () => {
            quitarMateria(materia.codigo);
        });

        tarjeta.append(nombre, detalle, boton);
        contenedor.appendChild(tarjeta);
    });
}

function mostrarMensaje(texto) {
    const mensaje = document.getElementById("mensaje");

    if (mensaje) {
        mensaje.textContent = texto;
    }
}
