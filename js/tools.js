//Guardar grafico vlsm como imagen

const botonCaptura = document.querySelector("#btnCapturar"),
    objetivo = document.querySelector("#contenedor");

botonCaptura.addEventListener("click", () => {
    html2canvas(objetivo).then(canvas => {
        let enlace = document.createElement('a');
        enlace.download = "captura.png";
        enlace.href = canvas.toDataURL();
        enlace.click();
    });
});

//Guardar tabla de datos
const descargarButton = document.getElementById('btnSave_table');

descargarButton.addEventListener('click', function () {
    const filas = tabla_body.rows;
    let csvContent = '';

    //Desactibar eliminar fila en caso de que este activo
    if (botonEliminar.querySelectorAll("img")[0].style.display == 'none') {
        btn_eliminar();
    }

    // Recorrer las filas de la tabla
    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].cells;
        const filaDatos = [];

        // Recorrer las celdas de la fila actual
        for (let j = 0; j < celdas.length; j++) {
            if (j > 1) { filaDatos.push(celdas[j].innerText.replace(";", "")); }
            else { filaDatos.push(celdas[j].querySelectorAll(".table_inputs")[0].value.replace(";", "")); }
        }

        csvContent += filaDatos.join(';') + '\n';
    }
    csvContent += ip_value + ';' + mascara.value
    // Crear un objeto Blob con el contenido CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Crear un enlace de descarga
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = 'datos.csv';
    enlaceDescarga.style.display = 'none';

    // Agregar el enlace de descarga al DOM y simular un clic
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
});

//Subir tabla de datos

const archivoInput = document.getElementById('archivoInput');
const cargarButton = document.getElementById('btnUpload_table');

cargarButton.addEventListener('click', function () {
    archivoInput.value = null
    archivoInput.click();
});

archivoInput.addEventListener('change', function () {
    const archivo = archivoInput.files[0];
    const lector = new FileReader();

    lector.onload = function (evento) {
        const contenido = evento.target.result;
        const filas = contenido.split('\n');

        // Limpiar tabla existente
        tabla_body.innerHTML = '';

        //Desactibar eliminar fila en caso de que este activo
        if (botonEliminar.querySelectorAll("img")[0].style.display == 'none') {
            btn_eliminar();
        }

        //Cargado de datos de tabla
        for (let i = 0; i < filas.length - 1; i++) {
            const celdas = filas[i].split(';');
            const fila = document.createElement('tr');
            for (let j = 0; j < 8; j++) {
                let celda = document.createElement('th');
                if (j < 2) {
                    var nuevoInput = document.createElement("input");
                    if (j == 0) { nuevoInput.type = "text"; } else { nuevoInput.type = "number"; nuevoInput.classList.add("ips_ceil") }
                    nuevoInput.value = celdas[j];
                    nuevoInput.classList.add("table_inputs");
                    celda.appendChild(nuevoInput);
                } else { celda.textContent = celdas[j]; }

                fila.appendChild(celda);
            }
            tabla_body.appendChild(fila);
        }
        //Cargado de ip
        let ip_saved_values = ((filas[filas.length - 1]).split(';'))[0].split('.');
        ipinput.forEach((input, index) => {
            input.value = ip_saved_values[index];
        });
        mascara.value = ((filas[filas.length - 1]).split(';'))[1];
        calcular();
    };

    lector.readAsText(archivo);
});