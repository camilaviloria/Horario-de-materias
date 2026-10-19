(function () {

  function seccionesChocan(seccionA, seccionB) {
    for (const sesionA of seccionA.sesiones) {
      for (const sesionB of seccionB.sesiones) {

        if (sesionA.dia === sesionB.dia && 
            sesionA.iniMin < sesionB.finMin && 
            sesionB.iniMin < sesionA.finMin) {
          return true; 
        }
      }
    }
    return false; 
  }

  window.Choques = {
    seccionesChocan: seccionesChocan
  };
})(); 