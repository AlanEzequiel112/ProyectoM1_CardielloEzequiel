const paleta = document.getElementById("paleta");
const botonGenerar = document.getElementById("botonPrimario");
const botonFormato = document.getElementById("cambiarFormato");
const seleccionTamaño = document.getElementById("seleccionTamaño");

let formatoActual = "HEX";
let colores = [];

/* ===== Generar HEX ===== */
function generarHex() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + hex.padStart(6, "0");
}

/* ===== HEX a HSL ===== */
function hexAHSL(H) {
  let r = parseInt(H.substring(1, 3), 16) / 255;
  let g = parseInt(H.substring(3, 5), 16) / 255;
  let b = parseInt(H.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
        min = Math.min(r, g, b);

  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/* ===== Generar Paleta ===== */
function generarPaleta() {
  const tamaño = parseInt(seleccionTamaño.value);
  colores = [];

  for (let i = 0; i < tamaño; i++) {
    colores.push({
      valor: generarHex(),
      bloqueado: false
    });
  }

  mostrarPaleta();
}

/* ===== Mostrar Paleta ===== */
function mostrarPaleta() {
  paleta.innerHTML = "";

  const tamañoActual = parseInt(seleccionTamaño.value);

  colores.slice(0, tamañoActual).forEach((colorObj, index) => {

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.background = colorObj.valor;

    const botonBloqueo = document.createElement("button");
    botonBloqueo.className = "bloqueo-btn";
    botonBloqueo.textContent = colorObj.bloqueado ? "🔒" : "🔓";

    botonBloqueo.addEventListener("click", () => {
      colorObj.bloqueado = !colorObj.bloqueado;
      mostrarPaleta();
    });

    const codigo = document.createElement("div");
    codigo.className = "codigo";
    codigo.textContent =
      formatoActual === "HEX"
        ? colorObj.valor
        : hexAHSL(colorObj.valor);

    tarjeta.appendChild(colorDiv);
    tarjeta.appendChild(botonBloqueo);
    tarjeta.appendChild(codigo);
    paleta.appendChild(tarjeta);
  });
}

/* ===== Evento Generar ===== */
botonGenerar.addEventListener("click", () => {

  if (colores.length === 0) {
    generarPaleta();
    return;
  }

  colores = colores.map(color =>
    color.bloqueado
      ? color
      : { valor: generarHex(), bloqueado: false }
  );

  mostrarPaleta();
});

/* ===== Evento Cambiar Formato ===== */
botonFormato.addEventListener("click", () => {
  formatoActual = formatoActual === "HEX" ? "HSL" : "HEX";
  botonFormato.textContent =
    formatoActual === "HEX"
      ? "Cambiar a HSL"
      : "Cambiar a HEX";

  mostrarPaleta();
});

/* ===== Cambiar tamaño ===== */
seleccionTamaño.addEventListener("change", () => {
  mostrarPaleta(); 
});