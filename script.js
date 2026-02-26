/* ===== Selección de elementos ===== */
const paleta = document.getElementById("paleta");
const botonGenerar = document.getElementById("botonPrimario");
const botonFormato = document.getElementById("cambiarFormato");
const seleccionTamaño = document.getElementById("seleccionTamaño");
const toast = document.getElementById("toast");

/* ===== Variables globales ===== */
let formatoActual = "HEX";
let colores = [];

/* ===== Funciones de colores ===== */
function generarHex() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + hex.padStart(6, "0");
}

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
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/* ===== Persistencia con localStorage ===== */
function guardarEstado() {
  localStorage.setItem("paletaColores", JSON.stringify(colores));
}

function cargarEstado() {
  const guardado = localStorage.getItem("paletaColores");
  if (guardado) {
    colores = JSON.parse(guardado);
  } else {
    generarPaleta();
  }
}

/* ===== Toast ===== */
function mostrarToast(mensaje, tipo) {
  toast.textContent = mensaje;
  toast.className = `toast mostrar ${tipo}`;
  setTimeout(() => toast.classList.remove("mostrar"), 4000);
}

/* ===== Generar paleta ===== */
function generarPaleta() {
  const tamaño = parseInt(seleccionTamaño.value);
  colores = [];

  for (let i = 0; i < tamaño; i++) {
    colores.push({ valor: generarHex(), bloqueado: false });
  }

  guardarEstado();
  mostrarPaleta();
}

/* ===== Crear botón de bloqueo ===== */
function crearBotonBloqueo(colorObj) {
  const boton = document.createElement("button");
  boton.className = "bloqueo-btn";
  boton.textContent = colorObj.bloqueado ? "🔒" : "🔓";

  boton.addEventListener("click", () => {
    colorObj.bloqueado = !colorObj.bloqueado;
    guardarEstado();
    mostrarPaleta();

    mostrarToast(
      colorObj.bloqueado
        ? "Color bloqueado correctamente."
        : "Color desbloqueado.",
      "info"
    );

    const todasBloqueadas = colores.every(c => c.bloqueado);
    if (todasBloqueadas) {
      mostrarToast(
        "Todos los colores están bloqueados. No se pueden generar nuevas paletas.",
        "advertencia"
      );
    }
  });

  return boton;
}

/* ===== Mostrar paleta ===== */
function mostrarPaleta() {
  paleta.innerHTML = "";
  const tamañoActual = parseInt(seleccionTamaño.value);

  colores.slice(0, tamañoActual).forEach(colorObj => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.background = colorObj.valor;

    const botonBloqueo = crearBotonBloqueo(colorObj);

    const codigo = document.createElement("div");
    codigo.className = "codigo";
    codigo.textContent =
      formatoActual === "HEX" ? colorObj.valor : hexAHSL(colorObj.valor);

    codigo.addEventListener("click", () => {
      navigator.clipboard.writeText(codigo.textContent);
      mostrarToast("Código copiado al portapapeles.", "exito");
    });

    tarjeta.appendChild(colorDiv);
    tarjeta.appendChild(botonBloqueo);
    tarjeta.appendChild(codigo);
    paleta.appendChild(tarjeta);
  });
}

/* ===== Eventos ===== */
botonGenerar.addEventListener("click", () => {
  if (colores.length === 0) {
    generarPaleta();
  } else {
    colores = colores.map(color =>
      color.bloqueado ? color : { valor: generarHex(), bloqueado: false }
    );
    guardarEstado();
    mostrarPaleta();
    mostrarToast("Paleta generada correctamente.", "exito");
  }
});

botonFormato.addEventListener("click", () => {
  formatoActual = formatoActual === "HEX" ? "HSL" : "HEX";
  botonFormato.textContent =
    formatoActual === "HEX" ? "Cambiar a HSL" : "Cambiar a HEX";
  mostrarPaleta();
  mostrarToast(`Formato cambiado a ${formatoActual}.`, "info");
});

seleccionTamaño.addEventListener("change", () => {
  const tamañoVisible = parseInt(seleccionTamaño.value);
  let desbloqueados = false;

  colores.forEach((color, index) => {
    if (index >= tamañoVisible && color.bloqueado) {
      color.bloqueado = false;
      desbloqueados = true;
    }
  });

  guardarEstado();
  mostrarPaleta();

  if (desbloqueados) {
    mostrarToast(
      "Algunos colores se desbloquearon automáticamente al reducir el tamaño.",
      "advertencia"
    );
  }
});

/* ===== Inicializar ===== */
cargarEstado();
mostrarPaleta();