
function mostrarResumen(horario, numero) {
    const contenedor = document.getElementById("resumen-horario");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Horario seleccionado: " + numero;
    contenedor.appendChild(titulo);

    let totalUC = 0;

    horario.forEach(item => {
        totalUC += Number(item.materia.uc);

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-seleccion";

        const nombre = document.createElement("h4");
        nombre.textContent =
            item.materia.codigo + " - " + item.materia.nombre;

        const seccion = document.createElement("p");
        seccion.textContent =
            "Seccion: " + (item.seccion.id || "No especificada");

        const creditos = document.createElement("p");
        creditos.textContent = "Unidades de credito: " + item.materia.uc;

        const profesor = document.createElement("p");
        profesor.textContent =
            "Profesor: " + (item.seccion.profesor || "No especificado");

        tarjeta.append(nombre, seccion, creditos, profesor);

        item.seccion.horario.forEach(diaHorario => {
            const detalle = document.createElement("p");

            const horas = diaHorario.bloques.map(id => {
                const bloque = obtenerBloque(id);

                return bloque
                    ? bloque.inicio + " - " + bloque.fin
                    : "Bloque " + id;
            });

            detalle.textContent =
                diaHorario.dia + ": " + horas.join(", ") +
                (diaHorario.aula ? " | Aula: " + diaHorario.aula : "");

            tarjeta.appendChild(detalle);
        });

        contenedor.appendChild(tarjeta);
    });

    const total = document.createElement("p");
    total.textContent = "Total de unidades de credito: " + totalUC;
    contenedor.appendChild(total);
}
