function iniciarCatalogo(){
    const ts=[...new Set(catalogo().map(m=>m.trimestre))].sort((a,b)=>a-b),s=document.querySelector('#filtroTrim');
    s.innerHTML='<option value="">Todos los trimestres</option>'+ts.map(t=>`<option value="${t}">Trimestre ${t}</option>`).join('');
    renderCatalogo()
}
function renderCatalogo(){
    const q=key(document.querySelector('#buscar').value),t=document.querySelector('#filtroTrim').value,box=document.querySelector('#catalogo');
    const ms=catalogo().filter(m=>(!q||key(m.codigo).includes(q)||key(m.nombre).includes(q))&&(!t||String(m.trimestre)===t));
    document.querySelector('#totalCatalogo').textContent=catalogo().length;
    box.innerHTML=ms.map(m=>`<article class="materia ${m.manual?'manual':''}"><span class="meta">${esc(m.codigo)} · Trim. ${m.trimestre} · ${m.uc} UC · ${m.secciones.length} secciones ${m.manual?'· MANUAL':''}</span><b>${esc(m.nombre)}</b><div class="actions"><button data-detail="${esc(m.codigo)}" class="ghost">Ver detalle</button><button data-add="${esc(m.codigo)}" ${estado.seleccion.some(x=>x.codigo===m.codigo)?'disabled':''}>Agregar</button>${m.manual?`<button data-edit="${esc(m.codigo)}" class="ghost">Editar</button><button data-del="${esc(m.codigo)}" class="danger">Eliminar</button>`:''}</div></article>`).join('')||'<p class="empty">No hay coincidencias.</p>';
    box.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>agregar(b.dataset.add));
    box.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>detalleMateria(b.dataset.detail));
    box.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editarManual(b.dataset.edit));
    box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>pedirEliminarManual(b.dataset.del))
}
function detalleMateria(c){
    const m=catalogo().find(x=>x.codigo===c);
    document.querySelector('#detalleBody').innerHTML=`<h2>${esc(m.codigo)} · ${esc(m.nombre)}</h2><p>${m.uc} UC · Trimestre ${m.trimestre}</p>`+m.secciones.map(s=>`<section class="materia"><b>Seccion ${esc(s.id)}</b><p>${esc(s.profesor)}</p>${s.horario.map(h=>{const x=intervalo(h);return `<p>${
        diaNombre(h.dia)
    }
     ${
        aHora(x.inicio)
    }
    -${
        aHora(x.fin)
    }
     · ${
        esc(h.aula)
    }
    </p>`}).join('')}</section>`).join('');
    document.querySelector('#detalle').showModal()
}

