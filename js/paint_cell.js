//Eliminar subred

let botonEditColor = document.getElementById("btnEditColor");
let botonCerrarEditColor = document.getElementById("cerrar_c_ui")
let editor_color = document.getElementById("contenedor_c_ui");
let row_to_edit = "";

// Variable para almacenar el estado del botón (ON/OFF)
let estadoBotonEditColor = false;

// Función para cambiar el estado del botón
function cambiarEstadoBotonEditColo() {
    let img = botonEditColor.querySelectorAll("img");
    estadoBotonEditColor = !estadoBotonEditColor;
    if (estadoBotonEditColor) { img[0].style.display = "none"; img[1].style.display = "" } else { img[0].style.display = ""; img[1].style.display = "none" }
    return estadoBotonEditColor
}

// Agregar un controlador de evento de clic al botón Eliminar
botonEditColor.addEventListener("click", btn_editar);
botonCerrarEditColor.addEventListener("click", btn_editar);

function btn_editar() {
    let editar = cambiarEstadoBotonEditColo();
    if (editar) {
        editor_color.style.display = "flex";
        changeBar();
    } else {
        editor_color.style.display = "none";
    }
}


let draggables = document.querySelectorAll('.color_selector_c_ui');
let barra = document.querySelector('#color_bar_c_ui');
let currentDraggable = null;
let initialX;
let initialY;

barra.addEventListener("mousedown", function (e) {
    if (currentDraggable == null) {
        let colorSelectorDiv = createSelectorColor()
        colorSelectorDiv.style.left = Math.round(e.clientX - barra.getBoundingClientRect().x) + "px";

        barra.appendChild(colorSelectorDiv);
    }
})

function createSelectorColor(color = '#ffffff', pos = 0) {
    let colorSelectorDiv = document.createElement('div');
    colorSelectorDiv.classList.add('color_selector_c_ui');

    let firstInnerDiv = document.createElement('div');
    let colorInput = document.createElement('input');
    colorInput.setAttribute('type', 'color');
    colorInput.setAttribute('value', color);
    colorInput.addEventListener('input', handleChange);
    firstInnerDiv.appendChild(colorInput);

    let secondInnerDiv = document.createElement('div');

    colorSelectorDiv.appendChild(firstInnerDiv);
    colorSelectorDiv.appendChild(secondInnerDiv);

    colorSelectorDiv.addEventListener('mousedown', startDragging);
    colorSelectorDiv.addEventListener('dblclick', doubleClick);
    colorSelectorDiv.style.left = `${pos}px`;
    return colorSelectorDiv
}

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
    var leftA = a.style.left ? parseFloat(a.style.left) : 0; // Si el atributo left no está definido, se asigna 0
    var leftB = b.style.left ? parseFloat(b.style.left) : 0; // Si el atributo left no está definido, se asigna 0

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

    let gradiente = "";
    l_colors.forEach(l_color => {
        let l_color_input = l_color.querySelector("input")
        gradiente += ", " + l_color_input.value + " " + parseFloat(l_color.style.left) / barra.clientWidth * 100 + "%"
    });
    barra.style.background = "linear-gradient(90deg" + gradiente + ")";
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
        if (cl.style.left == "100%") { cl.style.left = `${canvas.width}px`; }
        degradado.addColorStop((parseFloat(cl.style.left) / canvas.width).toFixed(2), cl.querySelector("input").value);
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
    elim = (botonEliminar.querySelectorAll("img")[0].style.display == 'none') ? 1 : 0;
    let trs = tabla_body.querySelectorAll("tr");
    let colors = getColorFromGradient(trs.length);
    trs.forEach((tr, i) => {
        tr.querySelectorAll("th")[elim].style.backgroundColor = colors[i];
        if (calculateBrightness(tr.querySelectorAll("th")[elim].style.backgroundColor) < 128) {
            tr.querySelectorAll("input")[0].style.color = "white";
        } else {
            tr.querySelectorAll("input")[0].style.color = "black";
        }
    });
}

let barradeColores = document.querySelector("#color_selector_c_gradients>div:first-child")
barradeColores.addEventListener("click", () => {
    let button = barradeColores.querySelector("div")
    if (button.innerHTML == "▼") {
        button.innerHTML = " ▼ "
        barradeColores.parentNode.classList.add("show");
    } else {
        button.innerHTML = "▼"
        barradeColores.parentNode.classList.remove("show");
    }
})

function setbarcolor(val, balanced) {
    val = val.split(",")
    Array.from(document.querySelectorAll(".color_selector_c_ui")).forEach(el => el.remove());

    val.forEach((element, i) => {
        if (balanced) {
            barra.appendChild(createSelectorColor(element, i / (val.length - 1) * 620));
        } else {
            color = element.split('|');
            if (color[1].includes('%')) {
                barra.appendChild(createSelectorColor(color[0], parseFloat(color[1]) / 100 * 620));
            }
        }
    });
    changeBar();
    recolorred()
}

//Creacion de gradientes

let load = true;
let cantGrad = 0

function newbarcolor(background = barra.style.background) {
    let divContenedor = document.createElement("div");
    divContenedor.addEventListener("click", function () {
        setbarcolor(transformtobarcode(background), 0);
        calcular();
    });
    divContenedor.addEventListener("dblclick", function () {
        removeElementFromStorage(divContenedor);
        divContenedor.remove();
    });
    divContenedor.style.background = background;

    document.querySelector("#color_selector_c_gradients>div:last-child").insertBefore(divContenedor, document.querySelector("#color_selector_c_gradients>div:last-child>div:last-child"));
    if (!load) { saveElementToStorage(background); }
}

function saveElementToStorage(background) {
    let savedElements = JSON.parse(localStorage.getItem('savedElements')) || [];
    savedElements.push(background);
    localStorage.setItem('savedElements', JSON.stringify(savedElements));
}

function removeElementFromStorage(element) {
    let savedElements = JSON.parse(localStorage.getItem('savedElements')) || [];
    let indexToRemove = -1;
    savedElements.forEach(function (item, index) {
        if (item === element.style.background) {
            indexToRemove = index;
        }
    });
    if (indexToRemove !== -1) {
        savedElements.splice(indexToRemove, 1);
        localStorage.setItem('savedElements', JSON.stringify(savedElements));
    }
}

window.addEventListener('load', function () {
    let savedElements = JSON.parse(localStorage.getItem('savedElements')) || [];
    savedElements.forEach(function (background) {
        newbarcolor(background);
    });
    load = false;
});


function transformtobarcode(gradientCadena) {
    // Extraer las ocurrencias de rgb(x, x, x) x%
    const matches = gradientCadena.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)\s*([\d.]+)%/g);

    if (!matches) {
        return "Formato de entrada incorrecto";
    }

    // Procesar cada ocurrencia para convertirla al formato deseado
    const coloresHex = matches.map(match => {
        const [r, g, b, position, dec] = match.match(/\d+/g);
        const hexColor = "#" + [r, g, b].map(c => parseInt(c).toString(16).padStart(2, '0')).join('');
        return `${hexColor}|${position}.${dec}%`;
    });

    // Unir los resultados
    return coloresHex.join(',');
}


/** Botones*/
const buttons=document.querySelector("#buttons_c_gradients").querySelectorAll("button")

buttons[0].addEventListener("click",function () {   //Random
    let drags=document.querySelectorAll('.color_selector_c_ui');
    drags.forEach(d => {
        d.querySelector("input").value=generarColorHexadecimal();
    });
    changeBar();
    recolorred();
    calcular();
})

function generarColorHexadecimal() {
    // Generar valores aleatorios para los componentes RGB
    const r = Math.floor(Math.random() * 256); // Valor entre 0 y 255
    const g = Math.floor(Math.random() * 256); // Valor entre 0 y 255
    const b = Math.floor(Math.random() * 256); // Valor entre 0 y 255

    // Convertir los componentes RGB a formato hexadecimal y concatenarlos
    const colorHexadecimal = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    
    return colorHexadecimal;
}
function componentToHex(componente) {
    const hex = componente.toString(16); // Convertir a hexadecimal
    return hex.length === 1 ? "0" + hex : hex; // Asegurar que haya dos caracteres en el resultado
}