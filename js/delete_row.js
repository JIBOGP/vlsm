//Eliminar subred

let botonEliminar = document.getElementById("btnEliminar");

// Variable para almacenar el estado del botón (ON/OFF)
let estadoBoton = false;

// Función para cambiar el estado del botón
function cambiarEstadoBoton() {
    estadoBoton = !estadoBoton;
    botonEliminar.innerHTML = estadoBoton ? "<img src='images/buttons/delete_row_on.png' alt='delete_row.png' title='Eliminar subredes'>" : "<img src='images/buttons/delete_row.png' alt='delete_row.png' title='Eliminar subredes'>";
    return estadoBoton
}

// Agregar un controlador de evento de clic al botón Eliminar
botonEliminar.addEventListener("click", btn_eliminar);

function btn_eliminar() {
    let eliminar = cambiarEstadoBoton();
    let filas = tabla_body.rows;
    if (eliminar) {
        botonCaptura.disabled = true;
        descargarButton.disabled = true;
        cargarButton.disabled = true;
        btn_add_row.disabled = true;
        botonEditColor.disabled = true;
        if (filas.length == 0) {
            botonCaptura.disabled = false;
            descargarButton.disabled = false;
            cargarButton.disabled = false;
            btn_add_row.disabled = false;
            botonEditColor.disabled = false;
            cambiarEstadoBoton();
        } else {
            for (let i = 0; i < filas.length; i++) {
                filas[i].classList.add("aEliminar");
                filas[i].addEventListener("click", eliminarFila);
                filas[i].cells[0].querySelectorAll(".table_inputs")[0].disabled = true;
                filas[i].cells[1].querySelectorAll(".table_inputs")[0].disabled = true;
            }
        }
    } else {
        botonCaptura.disabled = false;
        descargarButton.disabled = false;
        cargarButton.disabled = false;
        btn_add_row.disabled = false;
        botonEditColor.disabled = false;
        if (filas.length > 0) {
            for (let i = 0; i < filas.length; i++) {
                filas[i].classList.remove("aEliminar");
                filas[i].removeEventListener("click", eliminarFila);
                filas[i].cells[0].querySelectorAll(".table_inputs")[0].disabled = false;
                filas[i].cells[1].querySelectorAll(".table_inputs")[0].disabled = false;
            }
        }

    }
}

// Eliminar la fila
function eliminarFila() {
    this.parentNode.removeChild(this);
    calcular();
    recolorred();
}