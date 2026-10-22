
function generarHorarios(materias = materiasSeleccionadas, maxResultados = 100) {
    const resultados = [];
    const seleccionActual = [];

    if (!materias || materias.length === 0) {
        return resultados;
    }

    function buscarCombinaciones(indice) {
        if (resultados.length >= maxResultados) {
            return;
        }

        if (indice === materias.length) {
            resultados.push([...seleccionActual]);
            return;
        }

        const materia = materias[indice];

        for (const seccion of materia.secciones) {
            const tieneChoque = seleccionActual.some(seleccionada =>
                seccionesTienenChoque(seleccionada.seccion, seccion)
            );

            if (tieneChoque) {
                continue;
            }

            seleccionActual.push({
                materia: materia,
                seccion: seccion
            });

            buscarCombinaciones(indice + 1);

            seleccionActual.pop();

            if (resultados.length >= maxResultados) {
                return;
            }
        }
    }

    buscarCombinaciones(0);

    return resultados;
}
(function () {
  let limiteSeguridad = 5000; 
  function generar(materias) {
    const resultados = [];
    const combinacionActual = [];

    function backtrack(indiceMateria) {
      if (indiceMateria === materias.length) {
        resultados.push([...combinacionActual]); 
        return;
      }

      if (resultados.length >= limiteSeguridad) return;

      const materiaActual = materias[indiceMateria];

      for (const seccion of materiaActual.secciones) {
        
        let hayChoque = false;
        for (const seccionElegida of combinacionActual) {
          if (Choques.seccionesChocan(seccionElegida, seccion)) {
            hayChoque = true;
            break; 
          }
        }

        if (!hayChoque) {
          combinacionActual.push(seccion);
          backtrack(indiceMateria + 1); 
          combinacionActual.pop();      
        }
      }
    }

    backtrack(0);
    return resultados;
  }

  window.Generador = {
    generar: generar
  };
})();
