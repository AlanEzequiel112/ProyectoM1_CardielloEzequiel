const paleta = document.getElementById("paleta");
const botonGenerar = document.getElementById("botonPrimario");
const botonFormato = document.getElementById("cambiarFormato");
const seleccionTamaño = document.getElementById("seleccionTamaño");
const textoFormato = document.getElementById("textoFormato");

let formatoActual = "HEX";
let tamañoVisible = parseInt(seleccionTamaño.value);

function generarHex() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + hex.padStart(6, "0");
}

// Función para convertir HEX a HSL
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

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
}

function mostrarPaleta() {
  paleta.innerHTML = "";
  const tamaño = parseInt(seleccionTamaño.value);

  for (let i = 0; i < tamaño; i++) {
    const color = generarHex();

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.background = color;

    const codigo = document.createElement("div");
    codigo.className = "codigo";
    codigo.textContent = formatoActual === "HEX" ? color : hexAHSL(color);

    tarjeta.appendChild(colorDiv);
    tarjeta.appendChild(codigo);
    paleta.appendChild(tarjeta);
  }
}

// Evento para generar paleta
botonGenerar.addEventListener("click", mostrarPaleta);

// Evento para cambiar formato
botonFormato.addEventListener("click", () => {
  formatoActual = formatoActual === "HEX" ? "HSL" : "HEX";
  botonFormato.textContent =
    formatoActual === "HEX" ? "Cambiar a HSL" : "Cambiar a HEX";
  textoFormato.textContent = "Formato actual: " + formatoActual;
  mostrarPaleta();
});     