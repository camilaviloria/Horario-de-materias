function animarResultado(){
    resultado.classList.remove('result-change');
    void resultado.offsetWidth;
    resultado.classList.add('result-change')
}

function renderResultados(){
    const ok=estado.filtrados.length>0;
    vacio.classList.toggle('hidden',ok);
    resultado.classList.toggle('hidden',!ok);
    estadoResultados.textContent=estado.base.length?`${estado.filtrados.length} de ${estado.base.length} combinaciones cumplen los filtros.`:'Agrega materias y genera horarios.';
    if(!ok){
        vacio.textContent=estado.base.length?'No hay resultados con estas preferencias.':'Aun no hay horarios generados.';
        return
    }
    const r=estado.filtrados[estado.indice],m=metricas(r);
    posicion.textContent=`Opcion ${estado.indice+1} de ${estado.filtrados.length}`;
    anterior.disabled=estado.indice===0;
    siguiente.disabled=estado.indice===estado.filtrados.length-1;
    metricas.innerHTML=`<div class="metric"><b>${m.dias}</b><small>Dias de asistencia</small></div><div class="metric"><b>${(m.huecos/60).toFixed(1)} h</b><small>Horas muertas</small></div><div class="metric"><b>${aHora(m.entrada)}</b><small>Entrada mas temprana</small></div><div class="metric"><b>${aHora(m.salida)}</b><small>Salida mas tardia</small></div>`;
    renderRejilla(r);
    animarResultado()
}

function renderResumen(){
    if(!estado.definitivo){
        resumen.className='empty';
        resumen.textContent='Todavia no has elegido un horario definitivo.';
        return
    }
    resumen.className='';
    resumen.innerHTML=`<table class="summary"><thead><tr><th>Codigo</th><th>Materia</th><th>Seccion</th><th>Profesor</th><th>Horario / aula</th></tr></thead><tbody>${estado.definitivo.map(x=>`<tr><td>${
        esc(x.materia.codigo)
    }
    </td><td>${
        esc(x.materia.nombre)
    }
    </td><td>${
        esc(x.seccion.id)
    }
    </td><td>${
        esc(x.seccion.profesor)
    }
    </td><td>${
        x.seccion.horario.map(s=>{
            const z=intervalo(s);
            return `${diaNombre(s.dia)} ${aHora(z.inicio)}-${aHora(z.fin)} · ${esc(s.aula)}`
        }).join('<br>')
    }
    </td></tr>`).join('')}</tbody></table><p><b>Total: ${estado.definitivo.reduce((n,x)=>n+Number(x.materia.uc),0)} UC</b></p>`
}

