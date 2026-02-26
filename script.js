const paleta = document.getElementById("paleta");
const botonGenerar = document.getElementById("botonPrimario");
const seleccionTamaño = document.getElementById("seleccionTamaño");

function generarHex() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + hex.padStart(6, "0");
}

function mostrarPaleta() {
  const tamaño = parseInt(seleccionTamaño.value);
  paleta.innerHTML = "";

  for (let i = 0; i < tamaño; i++) {
    const color = generarHex();

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.background = color;

    const codigo = document.createElement("div");
    codigo.className = "codigo";
    codigo.textContent = color;

    tarjeta.appendChild(colorDiv);
    tarjeta.appendChild(codigo);
    paleta.appendChild(tarjeta);
  }
}

botonGenerar.addEventListener("click", mostrarPaleta);