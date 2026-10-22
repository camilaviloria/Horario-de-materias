
document.addEventListener("DOMContentLoaded", () => {
    iniciarCatalogo();
    mostrarSeleccion();
    iniciarFormulario();
    iniciarGenerador();
    iniciarImpresion();
});

function iniciarGenerador() {
    const boton = document.getElementById("boton-generar");

    if (!boton) {
        return;
    }

    boton.addEventListener("click", () => {
        const mensaje = document.getElementById("mensaje-generador");
        const resultados = document.getElementById("resultados-horarios");

        resultados.innerHTML = "";

        const rejilla = document.getElementById("rejilla-horario");
        const resumen = document.getElementById("resumen-horario");

        rejilla.innerHTML = "";
        resumen.innerHTML = "";

        if (materiasSeleccionadas.length === 0) {
            mensaje.textContent = "Primero selecciona al menos una materia.";
            return;
        }

        const sinSecciones = materiasSeleccionadas.filter(
            materia => !materia.secciones || materia.secciones.length === 0
        );

        if (sinSecciones.length > 0) {
            mensaje.textContent =
                "Estas materias no tienen secciones disponibles: " +
                sinSecciones.map(materia => materia.codigo).join(", ");
            return;
        }

        const horarios = generarHorarios(materiasSeleccionadas);

        if (horarios.length === 0) {
            mensaje.textContent =
                "No se encontraron horarios sin choques para esta seleccion.";
            return;
        }

        mensaje.textContent =
            "Se encontraron " + horarios.length + " combinaciones validas.";

        horarios.forEach((horario, indice) => {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-materia";

            const titulo = document.createElement("h3");
            titulo.textContent = "Horario " + (indice + 1);

            const detalle = document.createElement("p");
            detalle.textContent =
                horario.length + " materias incluidas.";

            const botonVer = document.createElement("button");
            botonVer.type = "button";
            botonVer.textContent = "Ver este horario";

            botonVer.addEventListener("click", () => {
                mostrarRejilla(horario);
                mostrarResumen(horario, indice + 1);
            });

            tarjeta.append(titulo, detalle, botonVer);

            horario.forEach(item => {
                const linea = document.createElement("p");
                linea.className = "detalle-materia";
                linea.textContent =
                    item.materia.codigo + " - " + item.materia.nombre +
                    " | Seccion: " + (item.seccion.id || "Sin identificador");

                tarjeta.appendChild(linea);
            });

            resultados.appendChild(tarjeta);
        });
    });
}

function iniciarImpresion() {
    const boton = document.getElementById("boton-imprimir");

    if (!boton) {
        return;
    }

    boton.addEventListener("click", () => {
        const resumen = document.getElementById("resumen-horario");

        if (!resumen || resumen.innerHTML.trim() === "") {
            document.getElementById("mensaje-generador").textContent =
                "Primero genera un horario y pulsa Ver este horario.";
            return;
        }

        window.print();
    });
}
