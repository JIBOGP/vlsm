//Insertar subred
const btn_add_row = document.getElementById("cant_red_add");
btn_add_row.addEventListener("click", function () {
    elim = (botonEliminar.querySelectorAll("img")[0].style.display == 'none');
    var nuevaFila = document.createElement("tr");
    for (var i = 0; i < 8 + elim; i++) {
        var nuevocelda = document.createElement("th");
        if (elim && i == 0) {
            var botonEliminarFila = document.createElement('button');
            botonEliminarFila.classList.add('eliminarBtn');
            botonEliminarFila.addEventListener('click', eliminarFila);

            nuevocelda.appendChild(botonEliminarFila);
            nuevocelda.style.width="auto";
        }
        if (i >= elim && i < 2 + elim) {
            var nuevoInput = document.createElement("input");
            if (i == 0 + elim) { nuevoInput.type = "text"; } else { nuevoInput.type = "number"; }
            nuevoInput.classList.add("table_inputs");
            nuevocelda.appendChild(nuevoInput);
        }
        nuevaFila.appendChild(nuevocelda);
    }
    tabla_body.appendChild(nuevaFila);
    recolorred();
});
