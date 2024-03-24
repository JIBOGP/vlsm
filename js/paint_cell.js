//Eliminar subred

let botonEditColor = document.getElementById("btnEditColor");
let botonCerrarEditColor = document.getElementById("cerrar_c_ui")
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
        changeBar();
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
                filas[i].cells[0].querySelectorAll(".table_inputs")[0].disabled = true;
                filas[i].cells[1].querySelectorAll(".table_inputs")[0].disabled = true;
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
                filas[i].cells[0].querySelectorAll(".table_inputs")[0].disabled = false;
                filas[i].cells[1].querySelectorAll(".table_inputs")[0].disabled = false;
            }
        }

    }
}


let draggables = document.querySelectorAll('.color_selector_c_ui');
let barra = document.querySelector('#color_bar_c_ui');
let currentDraggable = null;
let initialX;
let initialY;

barra.addEventListener("mousedown", function (e) {
    cscant = document.querySelectorAll(".color_selector_c_ui").length
    if (currentDraggable == null && cscant < 16) {
        let colorSelectorDiv = document.createElement('div');
        colorSelectorDiv.classList.add('color_selector_c_ui');

        let firstInnerDiv = document.createElement('div');
        let colorInput = document.createElement('input');
        colorInput.setAttribute('type', 'color');
        colorInput.setAttribute('value', '#ffffff');
        colorInput.addEventListener('input', handleChange);
        firstInnerDiv.appendChild(colorInput);

        let secondInnerDiv = document.createElement('div');

        colorSelectorDiv.appendChild(firstInnerDiv);
        colorSelectorDiv.appendChild(secondInnerDiv);

        colorSelectorDiv.addEventListener('mousedown', startDragging);
        colorSelectorDiv.addEventListener('dblclick', doubleClick);
        colorSelectorDiv.style.left = Math.round(e.clientX - barra.getBoundingClientRect().x) + "px";

        barra.appendChild(colorSelectorDiv);
    }
})


function startDragging(event) {
    currentDraggable = this;
    initialX = event.clientX;
    initialLeft = parseFloat(window.getComputedStyle(currentDraggable).left);
}

function drag(event) {
    if (currentDraggable) {
        changeBar();
        recolorred();
        let deltaX = event.clientX - initialX;
        let newLeft = initialLeft + deltaX;
        newLeft = Math.min(Math.max(newLeft, 0), barra.clientWidth);
        currentDraggable.style.left = newLeft + 'px';
    }
}

function stopDragging() {
    currentDraggable = null;
    changeBar();
    recolorred();
}

function compararPorLeft(a, b) {
    var leftA = a.style.left ? parseInt(a.style.left) : 0; // Si el atributo left no está definido, se asigna 0
    var leftB = b.style.left ? parseInt(b.style.left) : 0; // Si el atributo left no está definido, se asigna 0

    return leftA - leftB;
}

// Ordenar el arreglo de elementos utilizando la función de comparación

draggables.forEach(function (draggable) {
    draggable.addEventListener('mousedown', startDragging);
    draggable.addEventListener('dblclick', doubleClick);
    draggable.querySelector("input").addEventListener('input', handleChange);
});

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDragging);

function handleChange() {
    stopDragging()
}

function changeBar() {
    let l_colors = document.querySelectorAll(".color_selector_c_ui");
    l_colors = Array.from(l_colors);

    l_colors.sort(compararPorLeft);

    let gradiente = "linear-gradient(90deg";
    /* console.clear(); */
    l_colors.forEach(l_color => {
        let l_color_input = l_color.querySelector("input")
        /* console.log(l_color.style.left);
        console.log(l_color_input); */
        gradiente += ", " + l_color_input.value + " " + parseInt(l_color.style.left) / barra.clientWidth * 100 + "%"
    });
    gradiente += ")";
    barra.style.background = gradiente;
    /* console.log(gradiente); */
}

function doubleClick() {
    cscant = document.querySelectorAll(".color_selector_c_ui").length
    if (cscant > 2) { this.remove(); }
    changeBar();
    recolorred();
}

changeBar();

//Obtener los colores de la barra

function getColorFromGradient(cant) {
    if (!estadoBotonEditColor) { editor_color.style.display = "flex"; }
    let cslist = document.querySelectorAll(".color_selector_c_ui");

    let canvas = document.createElement('canvas');
    canvas.width = barra.clientWidth;
    canvas.height = 1;
    document.body.appendChild(canvas); // Agregar el lienzo al cuerpo del documento

    let context = canvas.getContext('2d');

    // Definir el degradado
    let degradado = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    cslist.forEach(cl => {
        if (cl.style.left == "100%") { cl.style.left = `${canvas.width}px`; console.log(canvas.width); }
        degradado.addColorStop((parseInt(cl.style.left) / canvas.width).toFixed(2), cl.querySelector("input").value);
    });

    // Aplicar el degradado al fondo del lienzo
    context.fillStyle = degradado;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Obtener los datos de los píxeles del lienzo
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Calcular el ancho de cada intervalo
    let intervalo = Math.floor((canvas.width - 1) / (cant - 1));
    if (cant == 1) intervalo = 0;

    let colors_list = []

    for (let i = 0; i < cant; i++) {
        // Obtener el índice del pixel en el canvas correspondiente al intervalo actual
        let pixelIndex = Math.min(i * intervalo * 4, (canvas.width - 1) * 4);

        // Extraer el color del pixel en el índice calculado
        let r = data[pixelIndex];
        let g = data[pixelIndex + 1];
        let b = data[pixelIndex + 2];
        let a = data[pixelIndex + 3];

        // Formatear el color como una cadena RGBA
        let color = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (a / 255).toFixed(2) + ')';

        // Agregar el color a la lista de colores
        colors_list.push(color);
    }
    canvas.remove();
    if (!estadoBotonEditColor) { editor_color.style.display = "none" }

    return colors_list;
}

function recolorred() {
    let trs = tabla_body.querySelectorAll("tr");
    let colors = getColorFromGradient(trs.length);
    let elements = document.querySelectorAll(".elements");
    trs.forEach((tr, i) => {
        tr.querySelectorAll("th")[0].style.backgroundColor = colors[i];
        if (elements.length > 0) elements[i].style.backgroundColor = colors[i];
        if (calculateBrightness(tr.querySelectorAll("th")[0].style.backgroundColor) < 128) {
            tr.querySelectorAll("input")[0].style.color = "white";
        } else { tr.querySelectorAll("input")[0].style.color = "black"; }
    });
}