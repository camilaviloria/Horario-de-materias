let contadorSecciones=0;

function nuevaSeccion(datos={
    id:'',profesor:'',horario:[]
}){
    contadorSecciones++;
    const wrap=document.createElement('section');
    wrap.className='manual-section';
    wrap.dataset.section=contadorSecciones;
    wrap.innerHTML=`<div class="manual-section-title"><b>Seccion</b><button type="button" class="ghost remove-section small-btn">Quitar</button></div><div class="row"><div class="field"><label>Identificador</label><input class="sec-id" value="${esc(datos.id)}"><small class="field-error sec-id-error"></small></div><div class="field"><label>Profesor</label><input class="sec-prof" value="${esc(datos.profesor)}"><small class="field-error sec-prof-error"></small></div></div><div class="field"><label>Sesiones</label><p class="help">Una por linea: DIA | BLOQUES | AULA. Ejemplo: LUN | B01,B02 | A-12</p><textarea class="sec-ses" rows="4">${esc((datos.horario||[]).map(h=>`${
        h.dia
    }
     | ${
        h.bloques.join(',')
    }
     | ${
        h.aula
    }
    `).join('\n'))}</textarea><small class="field-error sec-ses-error"></small></div>`;
    wrap.querySelector('.remove-section').onclick=()=>{
        if(manualSections.children.length<=1){
            errSecciones.textContent='La materia debe tener al menos una seccion.';
            return
        }
        wrap.remove();
        errSecciones.textContent=''
    };
    manualSections.append(wrap)
}

function parseSesiones(txt){
    const out=[],errs=[];
    txt.split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach((line,i)=>{
        const p=line.split('|').map(x=>x.trim());
        if(p.length!==3){
            errs.push(`Linea ${i+1}: usa DIA | BLOQUES | AULA.`);
            return
        }
        const dia=key(p[0]),ids=p[1].split(',').map(x=>x.trim()).filter(Boolean),bs=ids.map(bloque);
        if(!DIAS.includes(dia))errs.push(`Linea ${i+1}: dia invalido.`);
        if(!ids.length||bs.some(x=>!x))errs.push(`Linea ${i+1}: existe un bloque invalido.`);
        if(bs.length&&new Set(bs.map(x=>x.tipo)).size>1)errs.push(`Linea ${i+1}: los bloques deben ser del mismo tipo.`);
        if(bs.length>1&&!bs.some(x=>!x)){
            const orden=[...BLOQUES.filter(b=>b.tipo===bs[0].tipo)].sort((a,b)=>aMin(a.inicio)-aMin(b.inicio));
            const pos=ids.map(id=>orden.findIndex(b=>b.id===id)).sort((a,b)=>a-b);
            for(let j=1;
            j<pos.length;
            j++)if(pos[j]!==pos[j-1]+1){
                errs.push(`Linea ${i+1}: los bloques no son consecutivos.`);
                break
            }
            
        }
        if(!p[2])errs.push(`Linea ${i+1}: falta el aula.`);
        out.push({
            dia,bloques:ids,aula:p[2]
        })
    });
    return {
        out,errs
    }
    
}

function limpiarErrores(){
    document.querySelectorAll('.field-error').forEach(x=>x.textContent='')
}

function leerSecciones(){
    const secciones=[],ids=new Set();
    let valido=true;
    document.querySelectorAll('.manual-section').forEach((box,i)=>{
        const id=box.querySelector('.sec-id').value.trim(),profesor=box.querySelector('.sec-prof').value.trim(),parsed=parseSesiones(box.querySelector('.sec-ses').value);
        if(!id){
            box.querySelector('.sec-id-error').textContent='El identificador es obligatorio.';
            valido=false
        }
        else if(ids.has(key(id))){
            box.querySelector('.sec-id-error').textContent='El identificador debe ser unico dentro de la materia.';
            valido=false
        }
        else ids.add(key(id));
        if(!profesor){
            box.querySelector('.sec-prof-error').textContent='El profesor es obligatorio.';
            valido=false
        }
        if(!parsed.out.length){
            box.querySelector('.sec-ses-error').textContent='Agrega al menos una sesion.';
            valido=false
        }
        else if(parsed.errs.length){
            box.querySelector('.sec-ses-error').textContent=parsed.errs.join(' ');
            valido=false
        }
        const sec={
            id,profesor,horario:parsed.out
        };
        if(!parsed.errs.length&&parsed.out.length&&choqueInterno(sec)){
            box.querySelector('.sec-ses-error').textContent='Las sesiones de esta seccion chocan entre si.';
            valido=false
        }
        secciones.push(sec)
    });
    return {
        secciones,valido
    }
    
}

function iniciarFormulario(){
    addSection.onclick=()=>nuevaSeccion();
    nuevaSeccion();
    formManual.onsubmit=e=>{
        e.preventDefault();
        limpiarErrores();
        const codigo=key(mCodigo.value),nombre=mNombre.value.trim(),tr=Number(mTrim.value),uc=Number(mUc.value);
        let valido=true;
        if(!codigo){
            errCodigo.textContent='El codigo es obligatorio.';
            valido=false
        }
        else{
            const otro=catalogo().find(m=>key(m.codigo)===codigo&&m.codigo!==estado.editando);
            if(otro){
                errCodigo.textContent='Este codigo ya existe.';
                valido=false
            }
            
        }
        if(!nombre){
            errNombre.textContent='El nombre es obligatorio.';
            valido=false
        }
        if(!Number.isInteger(tr)||tr<1){
            errTrim.textContent='Ingresa un trimestre entero positivo.';
            valido=false
        }
        if(!Number.isInteger(uc)||uc<1||uc>5){
            errUc.textContent='Las UC deben estar entre 1 y 5.';
            valido=false
        }
        const leidas=leerSecciones();
        if(!manualSections.children.length){
            errSecciones.textContent='Agrega al menos una seccion.';
            valido=false
        }
        if(!leidas.valido)valido=false;
        if(!valido)return msg('Revisa los campos marcados en el formulario.','error');
        if(estado.editando){
            const anterior=estado.editando,m=estado.manuales.find(x=>x.codigo===anterior);
            Object.assign(m,{
                codigo,nombre,trimestre:tr,uc,secciones:leidas.secciones,manual:true
            });
            estado.seleccion=estado.seleccion.map(x=>x.codigo===anterior?m:x);
            if(anterior!==codigo){
                estado.fijos[codigo]=estado.fijos[anterior];
                estado.excluidos[codigo]=estado.excluidos[anterior];
                delete estado.fijos[anterior];
                delete estado.excluidos[anterior]
            }
            
        }
        else estado.manuales.push({
            codigo,nombre,trimestre:tr,uc,secciones:leidas.secciones,manual:true
        });
        cancelarEdicion();
        iniciarCatalogo();
        renderManuales();
        renderSeleccion();
        invalidar();
        msg('Materia manual guardada correctamente.','success')
    }
    
}

function renderManuales(){
    manuales.innerHTML=estado.manuales.map(m=>`<article class="manual"><div><b>${esc(m.codigo)} · ${esc(m.nombre)}</b><span class="meta">${m.secciones.length} seccion(es) · ${m.uc} UC</span></div><div class="actions"><button class="ghost" data-manual-edit="${esc(m.codigo)}">Editar</button><button class="danger" data-manual-del="${esc(m.codigo)}">Eliminar</button></div></article>`).join('');
    manuales.querySelectorAll('[data-manual-edit]').forEach(b=>b.onclick=()=>editarManual(b.dataset.manualEdit));
    manuales.querySelectorAll('[data-manual-del]').forEach(b=>b.onclick=()=>pedirEliminarManual(b.dataset.manualDel))
}

function editarManual(c){
    const m=estado.manuales.find(x=>x.codigo===c);
    if(!m)return;
    estado.editando=c;
    mCodigo.value=m.codigo;
    mNombre.value=m.nombre;
    mTrim.value=m.trimestre;
    mUc.value=m.uc;
    manualSections.replaceChildren();
    m.secciones.forEach(s=>nuevaSeccion(s));
    cancelEdit.classList.remove('hidden');
    formManual.scrollIntoView({
        behavior:'smooth',block:'start'
    })
}

function cancelarEdicion(){
    estado.editando=null;
    formManual.reset();
    manualSections.replaceChildren();
    nuevaSeccion();
    cancelEdit.classList.add('hidden');
    limpiarErrores()
}

function pedirEliminarManual(c){
    const m=estado.manuales.find(x=>x.codigo===c);
    if(!m)return;
    confirmarTexto.textContent=`¿Eliminar ${m.codigo} - ${m.nombre}? Si esta seleccionada, tambien se quitara de la seleccion.`;
    confirmar.dataset.codigo=c;
    confirmar.showModal()
}

function eliminarManualConfirmado(){
    const c=confirmar.dataset.codigo;
    if(!c)return;
    if(estado.seleccion.some(m=>m.codigo===c))quitar(c);
    estado.manuales=estado.manuales.filter(m=>m.codigo!==c);
    delete estado.fijos[c];
    delete estado.excluidos[c];
    confirmar.close();
    confirmar.dataset.codigo='';
    iniciarCatalogo();
    renderManuales();
    invalidar();
    msg('Materia manual eliminada.','success')
}

