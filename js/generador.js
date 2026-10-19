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