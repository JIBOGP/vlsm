//Eliminar subred

let botonEditColor = document.getElementById("btnEditColor");
let botonCerrarEditColor =document.getElementById("cerrar_c_ui")
let editor_color = document.getElementById("contenedor_c_ui");
let row_to_edit = "";

// Variable para almacenar el estado del botón (ON/OFF)
let estadoBotonEditColor = false;

// Función para cambiar el estado del botón
function cambiarEstadoBotonEditColo() {
    estadoBotonEditColor = !estadoBotonEditColor;
    botonEditColor.innerHTML = estadoBotonEditColor ? "<img src='images/buttons/paint_cell_on.png' alt='delete_row.png' title='Eliminar subredes'>" : "<img src='images/buttons/paint_cell.png' alt='delete_row.png' title='Eliminar subredes'>";
    return estadoBotonEditColor
}

// Agregar un controlador de evento de clic al botón Eliminar
botonEditColor.addEventListener("click", btn_editar);
botonCerrarEditColor.addEventListener("click", btn_editar);

function btn_editar() {
    let editar = cambiarEstadoBotonEditColo();
    let filas = tabla_body.rows;
    if (editar) {
        editor_color.style.display = "flex";
        botonCaptura.disabled = true;
        descargarButton.disabled = true;
        cargarButton.disabled = true;
        btn_add_row.disabled = true;
        botonEliminar.disabled = true;
        if (filas.length == 0) {
            editor_color.style.display = "none";
            row_to_edit = "";
            botonCaptura.disabled = false;
            descargarButton.disabled = false;
            cargarButton.disabled = false;
            btn_add_row.disabled = false;
            botonEliminar.disabled = false;
            cambiarEstadoBotonEditColo();
        } else {
            for (let i = 0; i < filas.length; i++) {
                filas[i].classList.add("aEditar");
                filas[i].addEventListener("click", editarFila);
                filas[i].cells[0].contentEditable = false;
                filas[i].cells[1].contentEditable = false;
            }
        }
    } else {
        editor_color.style.display = "none";
        row_to_edit = "";
        botonCaptura.disabled = false;
        descargarButton.disabled = false;
        cargarButton.disabled = false;
        btn_add_row.disabled = false;
        botonEliminar.disabled = false;
        if (filas.length > 0) {
            for (let i = 0; i < filas.length; i++) {
                filas[i].classList.remove("aEditar");
                filas[i].removeAttribute("id");
                filas[i].removeEventListener("click", editarFila);
                filas[i].cells[0].contentEditable = true;
                filas[i].cells[1].contentEditable = true;
            }
        }

    }
}

function editarFila() {
    row_to_edit = this;
    for (let i = 0; i < tabla_body.rows.length; i++) {
        tabla_body.rows[i].removeAttribute("id");
    }
    this.id = "selected";
}


//UI color selector

let saturationInput = document.getElementById('saturationInput');
let lightnessInput = document.getElementById('lightnessInput');

// // Definir el espacio de color inicial y los valores de saturación y luminosidad
let saturation = parseInt(saturationInput.value); // Obtener el valor inicial del input
let lightness = parseInt(lightnessInput.value); // Obtener el valor inicial del input de luminosidad

// Función para actualizar los colores
function updateColors() {
    saturation = parseInt(saturationInput.value);
    lightness = parseInt(lightnessInput.value);
    updatePercentageText();
    drawRing(); // Volver a dibujar el anillo con los valores actualizados
}

// Función para actualizar el texto de porcentaje
function updatePercentageText() {
    saturationPercentage.textContent = saturation + '%';
    lightnessPercentage.textContent = lightness + '%';
}

// Agregar el evento input para capturar el cambio de valor
saturationInput.addEventListener('input', updateColors);
lightnessInput.addEventListener('input', updateColors);

// Obtener referencia al elemento canvas
let canvas = document.getElementById('ringCanvas');
let context = canvas.getContext('2d');

// Obtener el centro del anillo
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

// Definir los radios interno y externo del anillo
let innerRadius = centerX * 0.8;
let outerRadius = centerX * 0.9;

// Definir el ancho del anillo
let ringWidth = 10;
let outlineWidth = 2;

// Definir los colores
let color_space = 8
let colors = 360;

// Calcular el ángulo para cada color
let angle = (2 * Math.PI) / colors;

// Variable para almacenar el color seleccionado
let selectedColor = null;

// Función para dibujar el anillo de colores
function drawRing() {
    // Limpiar el canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el anillo de colores
    for (let i = 0; i < colors; i++) {
        let startAngle = i * angle;
        let endAngle = (i + 1) * angle;

        context.beginPath();
        context.arc(centerX, centerY, innerRadius, startAngle, endAngle);
        context.arc(centerX, centerY, outerRadius, endAngle, startAngle, true);
        context.closePath();
        context.lineWidth = ringWidth;
        context.strokeStyle = "hsl(" + Math.floor(i / color_space) * color_space + "deg, " + saturation + "%, " + lightness + "%)";
        context.stroke();
    }

    // Dibujar el contorno del anillo
    context.beginPath();
    context.arc(centerX, centerY, innerRadius - ringWidth / 2, 0, 2 * Math.PI);
    context.lineWidth = outlineWidth;
    context.strokeStyle = '#317985';
    context.stroke();
    // Dibujar el contorno del anillo
    context.beginPath();
    context.arc(centerX, centerY, outerRadius + ringWidth / 2, 0, 2 * Math.PI, true);
    context.lineWidth = outlineWidth;
    context.strokeStyle = '#317985';
    context.stroke();
}

// Función para dibujar el círculo interno
function drawInnerCircle(color, width) {
    // Limpiar el canvas y dibujar el anillo de colores
    drawRing();

    context.beginPath();
    context.arc(centerX, centerY, width + 2, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = "#317985";
    context.fill();
    // Dibujar el círculo interno
    context.beginPath();
    context.arc(centerX, centerY, width, 0, 2 * Math.PI);
    context.closePath();
    context.fillStyle = color;
    context.fill();
}

// Función para manejar el evento de mousemove
function handleMouseMove(event) {
    let mouse_x = event.offsetX;
    let mouse_y = event.offsetY;

    // Calcular la distancia desde el centro del anillo
    let distance = Math.sqrt(Math.pow(mouse_x - centerX, 2) + Math.pow(mouse_y - centerY, 2));

    // Verificar si el mouse está dentro del anillo
    if (distance >= innerRadius - ringWidth && distance <= outerRadius + ringWidth) {
        // Calcular el ángulo del punto seleccionado
        let angle = Math.atan2(mouse_y - centerY, mouse_x - centerX);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        // Calcular el índice del color seleccionado
        let colorIndex = Math.floor((angle * (180 / Math.PI) + 2) / color_space) * color_space;

        // Obtener el color correspondiente
        let color = "hsl(" + Math.floor(colorIndex / color_space) * color_space + "deg, " + saturation + "%, " + lightness + "%)";

        // Dibujar el círculo interno
        drawInnerCircle(color, 30);

        // Almacenar el color seleccionado
        selectedColor = color;
    } else {
        // Limpiar el canvas y dibujar el anillo de colores
        drawRing();

        // Restablecer el color seleccionado
        selectedColor = null;
    }
}

//Cambia el color al hacer clic
function handleMouseclic(event) {
    if (row_to_edit != "") {
        let mouse_x = event.offsetX;
        let mouse_y = event.offsetY;

        // Calcular la distancia desde el centro del anillo
        let distance = Math.sqrt(Math.pow(mouse_x - centerX, 2) + Math.pow(mouse_y - centerY, 2));

        // Verificar si el mouse está dentro del anillo
        if (distance >= innerRadius - ringWidth && distance <= outerRadius + ringWidth) {
            // Calcular el ángulo del punto seleccionado
            let angle = Math.atan2(mouse_y - centerY, mouse_x - centerX);
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            // Calcular el índice del color seleccionado
            let colorIndex = Math.floor((angle * (180 / Math.PI) + 2) / color_space) * color_space;

            // Obtener el color correspondiente
            let color = "hsl(" + Math.floor(colorIndex / color_space) * color_space + "deg, " + saturation + "%, " + lightness + "%)";

            // Dibujar el círculo interno
            drawInnerCircle(color, 30);

            // Almacenar el color seleccionado
            row_to_edit.cells[0].style.backgroundColor = hslStringToRgb(color);
            if (calculateBrightness(row_to_edit.cells[0].style.backgroundColor) < 128) {
                row_to_edit.cells[0].style.color = "rgb(255,255,255)";
            } else {
                row_to_edit.cells[0].style.color = "rgb(0,0,0)";
            }
            calcular();
        }
    }
}

// Agregar el evento de mousemove al canvas
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('click', handleMouseclic);

// Dibujar el anillo de colores inicialmente
drawRing();


//Input design
const rangeInputs = document.querySelectorAll('input[type="range"]')
const numberInput = document.querySelector('input[type="number"]')

function handleInputChange(e) {
    let target = e.target
    if (e.target.type !== 'range') {
        target = document.getElementById('range')
    }
    const min = target.min
    const max = target.max
    const val = target.value

    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
    input.addEventListener('input', handleInputChange)
    input.style.backgroundSize = input.value + "% 100%"
})

//HSL to rgb

function hslStringToRgb(hslString) {
    const hslRegex = /hsl\(\s*(\d+)deg,\s*(\d+%)\s*,\s*(\d+%)\s*\)/;
    const match = hslString.match(hslRegex);

    if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        const rgb = hslToRgb(h, s, l);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    return null;
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
  
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l;
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
  
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
  
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }
  
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
  
    return [r, g, b];
  }