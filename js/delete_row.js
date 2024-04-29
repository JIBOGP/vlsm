//Eliminar subred

let botonEliminar = document.getElementById("btnEliminar");

// Agregar un controlador de evento de clic al botón Eliminar
botonEliminar.addEventListener("click", btn_eliminar);

function btn_eliminar() {
    let filas = tabla.getElementsByTagName('tr');
    let img = botonEliminar.querySelectorAll("img");
    if (img[0].style.display == "none") { // MODO No eliminar
        for (var i = 0; i < filas.length; i++) {
            filas[i].deleteCell(0);
        }
        // Restaurar el estilo del botón
        img[0].style.display = "";
        img[1].style.display = "none";

    } else if (filas.length > 2) { // MODO Eliminar
        for (var i = 0; i < filas.length; i++) {
            var nuevoTh = document.createElement('th'); // Cambiar a <th>
            if (i > 0) {
                var botonEliminarFila = document.createElement('button');
                botonEliminarFila.classList.add('eliminarBtn');
                if (i < (filas.length - 1)) {
                    botonEliminarFila.addEventListener('click', eliminarFila);
                } else {
                    botonEliminarFila.addEventListener('click', function () {
                        tabla_body.innerHTML = '';
                        btn_eliminar()
                    });
                }
                nuevoTh.appendChild(botonEliminarFila);
            }
            nuevoTh.style.width = "auto"
            filas[i].insertBefore(nuevoTh, filas[i].firstChild);
        }
        // Cambiar el estilo del botón
        img[0].style.display = "none";
        img[1].style.display = "";
    }
}

function eliminarFila() {
    this.parentNode.parentNode.remove();
    if (tabla.getElementsByTagName('tr').length === 2) {
        btn_eliminar()
    } else { recolorred() }
}