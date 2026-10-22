
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
        const resumen = document.getElementById("resumen-horario");

        resultados.innerHTML = "";
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
                sinSecciones.map(materia => materia.codigo).join(", ") +
                ". No se pueden generar horarios hasta que tengan secciones.";
            return;
        }

        const horarios = generarHorarios(materiasSeleccionadas);

        if (horarios.length === 0) {
            mensaje.textContent =
                "No se encontraron combinaciones sin choques para las materias seleccionadas.";
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

            const boton = document.createElement("button");
            boton.type = "button";
            boton.textContent = "Ver este horario";

            boton.addEventListener("click", () => {
                mostrarResumenHorario(horario, indice + 1);
            });

            tarjeta.append(titulo, detalle, boton);

            horario.forEach(item => {
                const linea = document.createElement("p");
                linea.className = "detalle-materia";

                const seccion = item.seccion;
                const nombreSeccion = seccion.id || "Sin identificador";

                linea.textContent =
                    item.materia.codigo + " - " +
                    item.materia.nombre + " | Seccion: " +
                    nombreSeccion;

                tarjeta.appendChild(linea);
            });

            resultados.appendChild(tarjeta);
        });
    });
}

function mostrarResumenHorario(horario, numero) {
    const resumen = document.getElementById("resumen-horario");

    if (!resumen) {
        return;
    }

    resumen.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Horario seleccionado: " + numero;
    resumen.appendChild(titulo);

    horario.forEach(item => {
        const materia = item.materia;
        const seccion = item.seccion;

        const bloque = document.createElement("article");
        bloque.className = "tarjeta-seleccion";

        const nombre = document.createElement("h4");
        nombre.textContent = materia.codigo + " - " + materia.nombre;
        bloque.appendChild(nombre);

        const profesor = document.createElement("p");
        profesor.textContent =
            "Profesor: " + (seccion.profesor || "No especificado");
        bloque.appendChild(profesor);

        if (!seccion.horario || seccion.horario.length === 0) {
            const sinHorario = document.createElement("p");
            sinHorario.textContent = "Esta seccion no tiene horario registrado.";
            bloque.appendChild(sinHorario);
        } else {
            seccion.horario.forEach(diaHorario => {
                const linea = document.createElement("p");

                const horas = diaHorario.bloques.map(id => {
                    const bloqueHorario = obtenerBloque(id);

                    if (!bloqueHorario) {
                        return "Bloque " + id;
                    }

                    return bloqueHorario.inicio + "-" + bloqueHorario.fin;
                });

                linea.textContent =
                    diaHorario.dia + ": " + horas.join(", ") +
                    (diaHorario.aula ? " | Aula: " + diaHorario.aula : "");

                bloque.appendChild(linea);
            });
        }

        resumen.appendChild(bloque);
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
            const mensaje = document.getElementById("mensaje-generador");
            mensaje.textContent =
                "Primero genera un horario y selecciona Ver este horario.";
            return;
        }

        window.print();
    });
}
