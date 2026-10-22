
function mostrarRejilla(horario) {
    const contenedor = document.getElementById("rejilla-horario");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    const dias = [
        "Lunes", "Martes", "Miercoles",
        "Jueves", "Viernes", "Sabado"
    ];

    const tabla = document.createElement("table");
    tabla.className = "tabla-horario";

    const encabezado = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    const columnaHora = document.createElement("th");

    columnaHora.textContent = "Hora";
    filaEncabezado.appendChild(columnaHora);

    dias.forEach(dia => {
        const celda = document.createElement("th");
        celda.textContent = dia;
        filaEncabezado.appendChild(celda);
    });

    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);

    const cuerpo = document.createElement("tbody");

    obtenerBloques().forEach(bloque => {
        const fila = document.createElement("tr");
        const celdaHora = document.createElement("th");

        celdaHora.textContent = bloque.inicio + " - " + bloque.fin;
        fila.appendChild(celdaHora);

        dias.forEach(dia => {
            const celda = document.createElement("td");

            horario.forEach(item => {
                item.seccion.horario.forEach(diaHorario => {
                    const coincideDia =
                        diaHorario.dia.toLowerCase() === dia.toLowerCase();

                    const coincideBloque =
                        diaHorario.bloques.includes(bloque.id);

                    if (coincideDia && coincideBloque) {
                        const materia = document.createElement("div");
                        materia.className = "bloque-materia";
                        materia.textContent =
                            item.materia.codigo + " - " + item.materia.nombre;

                        if (diaHorario.aula) {
                            materia.textContent += " | " + diaHorario.aula;
                        }

                        celda.appendChild(materia);
                    }
                });
            });

            fila.appendChild(celda);
        });

        cuerpo.appendChild(fila);
    });

    tabla.appendChild(cuerpo);
    contenedor.appendChild(tabla);
}
