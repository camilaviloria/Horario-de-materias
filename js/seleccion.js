(function () {
  let seleccionadas = []; 
  let topeUC = 28; 

  let contResumen = null;
  let contLista = null;

  function crear(tag, props, hijos) {
    const el = document.createElement(tag);
    props = props || {};
    for (const k in props) {
      const v = props[k];
      if (k === 'clase') el.className = v;
      else if (k === 'texto') el.textContent = v;
      else if (k.indexOf('on') === 0 && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v);
    }
    if (hijos) {
      const arr = Array.isArray(hijos) ? hijos : [hijos];
      arr.forEach(h => { if (h) el.appendChild(h); });
    }
    return el;
  }

  function calcularTotalUC() {
    let total = 0;
    seleccionadas.forEach(codigo => {
      const materia = buscarMateria(codigo);
      if (materia) total += materia.uc;
    });
    return total;
  }

  function mostrarMensaje(texto, tipo) {
    const contMensajes = document.getElementById('mensajes');
    const div = crear('div', { clase: 'mensaje ' + (tipo ? 'mensaje--' + tipo : ''), texto });
    contMensajes.appendChild(div);
    setTimeout(() => div.remove(), 4000); 
  }

  function agregarMateria(codigo) {
    if (seleccionadas.includes(codigo)) {
      mostrarMensaje('La materia ya está en tu selección.', 'error');
      return;
    }

    const materia = buscarMateria(codigo);
    if (!materia) return;

    if (calcularTotalUC() + materia.uc > topeUC) {
      mostrarMensaje(`No puedes agregar ${codigo}. Superarías el tope de ${topeUC} UC.`, 'error');
      return;
    }

    seleccionadas.push(codigo);
    mostrarMensaje(`${materia.nombre} agregada.`, 'exito');
    render();
    
    document.dispatchEvent(new CustomEvent('seleccion:cambio'));
  }

  function quitarMateria(codigo) {
    seleccionadas = seleccionadas.filter(c => c !== codigo);
    render();
    document.dispatchEvent(new CustomEvent('seleccion:cambio'));
  }

  function render() {
    const total = calcularTotalUC();
    contResumen.replaceChildren(); 
    contResumen.appendChild(
      crear('div', { clase: 'seleccion-resumen__texto' }, [
        crear('span', { texto: `${seleccionadas.length} materias · ` }),
        crear('strong', { 
          texto: `${total} UC`, 
          clase: total > topeUC ? 'texto-error' : '' 
        }),
        crear('span', { texto: ` de ${topeUC} máx.` })
      ])
    );

    contLista.replaceChildren(); 

    if (seleccionadas.length === 0) {
      contLista.appendChild(crear('p', { clase: 'vacio', texto: 'No has seleccionado ninguna materia aún.' }));
      return;
    }

    seleccionadas.forEach(codigo => {
      const materia = buscarMateria(codigo);
      
      const btnEliminar = crear('button', { 
        clase: 'btn btn--mini btn--peligro', 
        texto: 'Quitar',
        onclick: () => quitarMateria(codigo)
      });

      const item = crear('div', { clase: 'seleccion-item' }, [
        crear('div', { clase: 'seleccion-item__info' }, [
          crear('strong', { texto: materia.codigo }),
          crear('span', { texto: materia.nombre })
        ]),
        btnEliminar
      ]);
      
      contLista.appendChild(item);
    });
  }

  window.seleccion = {
        inicializar: function () {
      contResumen = document.getElementById('seleccion-resumen');
      contLista = document.getElementById('seleccion-lista');
      
      document.addEventListener('materia:seleccionar', function (evento) {
        agregarMateria(evento.detail.codigo);
      });

      const btnGenerar = document.getElementById('btn-generar');
      if (btnGenerar) {
        btnGenerar.addEventListener('click', function () {
          if (seleccionadas.length === 0) {
            mostrarMensaje('Selecciona al menos una materia para generar.', 'error');
            return;
          }

          const materiasCompletas = seleccionadas.map(codigo => buscarMateria(codigo));

          const combinaciones = Generador.generar(materiasCompletas);

          console.log("¡Combinaciones generadas!", combinaciones.length);
          
          if (combinaciones.length === 0) {
            mostrarMensaje('No existe ninguna combinación posible sin choques.', 'error');
          } else {
            mostrarMensaje(`Se encontraron ${combinaciones.length} combinaciones válidas.`, 'exito');
          }
        });
      }

      render(); 
    },
    
    obtenerSeleccionadas: function() { return seleccionadas; }
  };
})();