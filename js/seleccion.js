function agregar(c){
    const m=catalogo().find(x=>x.codigo===c);
    if(!m||estado.seleccion.some(x=>x.codigo===c))return;
    const n=ucTotal()+Number(m.uc);
    if(n>estado.limite)return msg(`No se agrego: excederia el limite por ${n-estado.limite} UC.`,'error');
    estado.seleccion.push(m);
    invalidar();
    renderSeleccion();
    renderCatalogo()
}

function quitar(c){
    estado.seleccion=estado.seleccion.filter(m=>m.codigo!==c);
    delete estado.fijos[c];
    delete estado.excluidos[c];
    invalidar();
    renderSeleccion();
    renderCatalogo()
}

function desexcluir(c,id){
    estado.excluidos[c]=(estado.excluidos[c]||[]).filter(x=>x!==id);
    invalidar();
    renderSeleccion()
}

function renderSeleccion(){
    const b=document.querySelector('#seleccion');
    b.innerHTML=estado.seleccion.map(m=>`<article class="sel"><b>${esc(m.codigo)} · ${esc(m.nombre)}</b><span class="meta">${m.uc} UC · ${m.secciones.length} secciones</span><label>Fijar seccion<select data-fix="${esc(m.codigo)}"><option value="">Cualquiera</option>${m.secciones.map(s=>`<option ${
        estado.fijos[m.codigo]===s.id?'selected':''
    }
     value="${esc(s.id)}">${
        esc(s.id)
    }
    </option>`).join('')}</select></label><label>Excluir seccion<select data-ex="${esc(m.codigo)}"><option value="">Elegir...</option>${m.secciones.filter(s=>!(estado.excluidos[m.codigo]||[]).includes(s.id)).map(s=>`<option value="${esc(s.id)}">${
        esc(s.id)
    }
    </option>`).join('')}</select></label><div class="excluidas">${(estado.excluidos[m.codigo]||[]).length?'Excluidas: '+(estado.excluidos[m.codigo]||[]).map(id=>`<button type="button" class="exclude-chip" data-unexclude="${esc(m.codigo)}|${esc(id)}">${
        esc(id)
    }
     ×</button>`).join(' '):'Excluidas: ninguna'}</div><div class="actions"><button data-remove="${esc(m.codigo)}" class="danger">Quitar</button></div></article>`).join('')||'<p class="empty">Sin materias seleccionadas.</p>';
    b.querySelectorAll('[data-remove]').forEach(x=>x.onclick=()=>quitar(x.dataset.remove));
    b.querySelectorAll('[data-fix]').forEach(x=>x.onchange=()=>{
        if(x.value)estado.fijos[x.dataset.fix]=x.value;
        else delete estado.fijos[x.dataset.fix];
        invalidar();
        renderSeleccion()
    });
    b.querySelectorAll('[data-ex]').forEach(x=>x.onchange=()=>{
        if(!x.value)return;
        const c=x.dataset.ex,m=estado.seleccion.find(y=>y.codigo===c),arr=estado.excluidos[c]||[];
        if(arr.includes(x.value))return;
        if(arr.length>=m.secciones.length-1)return msg('No puedes excluir todas las secciones.','error');
        estado.excluidos[c]=[...arr,x.value];
        if(estado.fijos[c]===x.value)delete estado.fijos[c];
        invalidar();
        renderSeleccion()
    });
    b.querySelectorAll('[data-unexclude]').forEach(x=>x.onclick=()=>{
        const [c,id]=x.dataset.unexclude.split('|');
        desexcluir(c,id)
    });
    document.querySelector('#ucActual').textContent=ucTotal();
    document.querySelector('#cantSeleccion').textContent=estado.seleccion.length;
    const inc=incompatibles();
    document.querySelector('#incompatibles').innerHTML=inc.length?`<b>Materias incompatibles</b><ul>${inc.map(x=>`<li>${
        esc(x)
    }
    </li>`).join('')}</ul>`:''
}


