const paleta=document.getElementById("paleta");
const botonGenerar=document.getElementById("botonPrimario");
const botonFormato=document.getElementById("cambiarFormato");
const seleccionTamaño=document.getElementById("seleccionTamaño");
const textoFormato=document.getElementById("textoFormato");
const toast=document.getElementById("toast");

let formatoActual="HEX";
let tamañoVisible=parseInt(seleccionTamaño.value);
let colores=JSON.parse(localStorage.getItem("paletaColores"))||[];

function guardarEstado(){
  localStorage.setItem("paletaColores",JSON.stringify(colores));
}

function mostrarToast(mensaje,tipo){
  toast.textContent=mensaje;
  toast.className="toast mostrar "+tipo;
  setTimeout(()=>toast.classList.remove("mostrar"),4000);
}

function generarHex(){
  const hex=Math.floor(Math.random()*16777215).toString(16);
  return "#"+hex.padStart(6,"0");
}

/* ===== HEX a HSL ===== */
function hexAHSL(H){
  let r=parseInt(H.substring(1,3),16)/255;
  let g=parseInt(H.substring(3,5),16)/255;
  let b=parseInt(H.substring(5,7),16)/255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}
  else{
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r:h=(g-b)/d+(g<b?6:0);break;
      case g:h=(b-r)/d+2;break;
      case b:h=(r-g)/d+4;break;
    }
    h/=6;
  }
  return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
}

function mostrarPaleta(){
  paleta.innerHTML="";
  const visibles=colores.slice(0,tamañoVisible);

  visibles.forEach((colorObj,index)=>{
    const tarjeta=document.createElement("article");
    tarjeta.className="tarjeta";

    const colorDiv=document.createElement("div");
    colorDiv.className="color";
    colorDiv.style.background=colorObj.valor;

    const botonBloqueo=document.createElement("button");
    botonBloqueo.className="bloqueo-btn";
    botonBloqueo.innerHTML=colorObj.bloqueado?svgLock():svgUnlock();
    if(colorObj.bloqueado) botonBloqueo.classList.add("bloqueado");

    botonBloqueo.addEventListener("click",()=>{
      colorObj.bloqueado=!colorObj.bloqueado;
      guardarEstado();
      mostrarPaleta();
      mostrarToast(
        colorObj.bloqueado?"Color bloqueado correctamente.":"Color desbloqueado.",
        "info"
      );
    });

    const codigo=document.createElement("div");
    codigo.className="codigo";
    codigo.textContent=formatoActual==="HEX"?colorObj.valor:hexAHSL(colorObj.valor);

    codigo.addEventListener("click",()=>{
      navigator.clipboard.writeText(codigo.textContent);
      mostrarToast("Código copiado al portapapeles.","exito");
    });

    tarjeta.appendChild(colorDiv);
    tarjeta.appendChild(botonBloqueo);
    tarjeta.appendChild(codigo);
    paleta.appendChild(tarjeta);
  });
}

/* ===== Eventos ===== */
botonGenerar.addEventListener("click",()=>{

  const visibles = colores.slice(0,tamañoVisible);
  const todosBloqueados = visibles.length > 0 && visibles.every(c => c.bloqueado);

  if(todosBloqueados){
    mostrarToast(
      "Todas las paletas están bloqueadas 🔒. Desbloquea al menos un color para generar una nueva combinación.",
      "advertencia"
    );
    return;
  }

  if(colores.length===0){
    for(let i=0;i<9;i++){
      colores.push({valor:generarHex(),bloqueado:false});
    }
  }else{
    colores=colores.map(c=>c.bloqueado?c:{valor:generarHex(),bloqueado:false});
  }

  guardarEstado();
  mostrarPaleta();
  mostrarToast("Las paletas se generaron correctamente.","exito");
});

botonFormato.addEventListener("click",()=>{
  formatoActual=formatoActual==="HEX"?"HSL":"HEX";
  botonFormato.textContent=formatoActual==="HEX"?"Cambiar a HSL":"Cambiar a HEX";
  textoFormato.textContent="Formato actual: "+formatoActual;
  mostrarPaleta();
  mostrarToast(`El cambio a ${formatoActual} se realizó exitosamente.`,"info");
});

seleccionTamaño.addEventListener("change",()=>{
  tamañoVisible=parseInt(seleccionTamaño.value);

  let desbloqueados=false;
  colores.forEach((color,index)=>{
    if(index>=tamañoVisible && color.bloqueado){
      color.bloqueado=false;
      desbloqueados=true;
    }
  });

  guardarEstado();
  mostrarPaleta();

  if(desbloqueados){
    mostrarToast(
      "Algunos colores fueron desbloqueados automáticamente al reducir el tamaño.",
      "advertencia"
    );
  }else{
    mostrarToast("Cantidad actualizada correctamente.","info");
  }
});

/* ===== SVG ===== */
function svgLock(){
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M12 17a2 2 0 002-2 2 2 0 00-4 0 2 2 0 002 2zm6-6h-1V9a5 5 0 00-10 0v2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-8-2a3 3 0 016 0v2H10V9z"/>
  </svg>`;
}

function svgUnlock(){
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M17 8h-1V6a4 4 0 00-8 0h2a2 2 0 114 0v2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z"/>
  </svg>`;
}

mostrarPaleta();
