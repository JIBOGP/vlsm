//Eliminar subred

let botonEditColor = document.getElementById("btnEditColor");

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

function btn_editar() {
    let editar = cambiarEstadoBotonEditColo();
    let filas = tabla_body.rows;
    if (editar) {
        botonCaptura.disabled = true;
        descargarButton.disabled = true;
        cargarButton.disabled = true;
        btn_add_row.disabled = true;
        botonEliminar.disabled = true;
        if (filas.length == 0) {
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
        botonCaptura.disabled = false;
        descargarButton.disabled = false;
        cargarButton.disabled = false;
        btn_add_row.disabled = false;
        botonEliminar.disabled = false;
        if (filas.length > 0) {
            for (let i = 0; i < filas.length; i++) {
                filas[i].classList.remove("aEditar");
                filas[i].removeEventListener("click", editarFila);
                filas[i].cells[0].contentEditable = true;
                filas[i].cells[1].contentEditable = true;
            }
        }

    }
}

function editarFila() {
    let ncolor=random_color();
    this.cells[0].style.backgroundColor = ncolor;
    if (calculateBrightness(ncolor) < 128) {
        this.cells[0].style.color = "rgb(255,255,255)";
    }else{
        this.cells[0].style.color = "rgb(0,0,0)";
    }
    calcular();
}