const COLORES=['#d7eee7','#f7e2d1','#dfe7fa','#f4dfeb','#e5efd4','#dcecf4','#f6eccb','#e9e0f5'];

function renderRejilla(r){
    const g=document.querySelector('#rejilla'),min=Math.min(...BLOQUES.map(b=>aMin(b.inicio))),max=Math.max(...BLOQUES.map(b=>aMin(b.fin))),paso=15,filas=Math.ceil((max-min)/paso);
    g.innerHTML='<div class="ghead">HORA</div>'+DIAS.map(d=>`<div class="ghead">${diaNombre(d)}</div>`).join('');
    g.style.gridTemplateRows=`34px repeat(${filas},15px)`;
    for(let i=0;
    i<filas;
    i++){
        const t=document.createElement('div');
        t.className='time';
        t.style.gridColumn='1';
        t.style.gridRow=String(i+2);
        t.textContent=i%4===0?aHora(min+i*paso):'';
        g.append(t)
    }
    const cols={
        
    };
    DIAS.forEach((d,i)=>{
        const c=document.createElement('div');
        c.className='day';
        c.style.gridColumn=String(i+2);
        c.style.gridRow=`2 / span ${filas}`;
        c.style.minHeight=(max-min)+'px';
        g.append(c);
        cols[d]=c
    });
    r.forEach(x=>x.seccion.horario.forEach(s=>{
        const z=intervalo(s),b=document.createElement('button');
        b.className='session';
        b.style.top=(z.inicio-min)+'px';
        b.style.height=Math.max(18,z.fin-z.inicio-2)+'px';
        b.style.background=COLORES[Math.abs(hash(x.materia.codigo))%COLORES.length];
        b.innerHTML=`<b>${esc(x.materia.codigo)}</b>Sec ${esc(x.seccion.id)}<br>${esc(s.aula)}`;
        b.setAttribute('aria-label',`${x.materia.nombre}, seccion ${x.seccion.id}, ${diaNombre(s.dia)} ${aHora(z.inicio)} a ${aHora(z.fin)}, aula ${s.aula}`);
        b.onclick=()=>detalleSesion(x,s);
        cols[s.dia].append(b)
    }))
}

function detalleSesion(item,s){
    const z=intervalo(s);
    detalleBody.innerHTML=`<h2>${esc(item.materia.codigo)} · ${esc(item.materia.nombre)}</h2><section class="materia"><b>Seccion ${esc(item.seccion.id)}</b><p><b>Profesor:</b> ${esc(item.seccion.profesor)}</p><p><b>Sesion:</b> ${diaNombre(s.dia)} ${aHora(z.inicio)}-${aHora(z.fin)}</p><p><b>Aula:</b> ${esc(s.aula)}</p><p><b>Bloques:</b> ${s.bloques.map(esc).join(', ')}</p></section>`;
    detalle.showModal()
}

function hash(s){
    let h=0;
    for(const c of s)h=(h*31+c.charCodeAt(0))|0;
    return h
}

