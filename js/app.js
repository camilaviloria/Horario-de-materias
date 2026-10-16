
let materias = [];

function agregarMateria(nombre) {
    if (materias.includes(nombre)) {
        return;
    }

    materias.push(nombre);
    mostrarMaterias();
}

function quitarMateria(nombre) {
    materias = materias.filter(materia => materia !== nombre);
    mostrarMaterias();
}

function mostrarMaterias() {
    let lista = document.getElementById("seleccion");
    lista.innerHTML = "";

    materias.forEach(function(nombre) {
        let elemento = document.createElement("li");
        elemento.textContent = nombre + " ";

        let boton = document.createElement("button");
        boton.textContent = "Quitar";
        boton.onclick = function() {
            quitarMateria(nombre);
        };

        elemento.appendChild(boton);
        lista.appendChild(elemento);
    });

    document.getElementById("contador").textContent =
        "Materias seleccionadas: " + materias.length;
}
