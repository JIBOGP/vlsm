//Insertar subred
const btn_add_row = document.getElementById("cant_red_add");
btn_add_row.addEventListener("click", function () {
    var nuevaFila = document.createElement("tr");
    for (var i = 0; i < 8; i++) {
        var nuevocelda = document.createElement("th");
        if (i < 2) {
            var nuevoInput = document.createElement("input");
            if (i == 0) {
                nuevocelda.style.backgroundColor = random_color();
                if (calculateBrightness(nuevocelda.style.backgroundColor) < 128) {
                    nuevoInput.style.color = "white";
                }
            }

            if (i == 0) { nuevoInput.type = "text"; } else { nuevoInput.type = "number"; }
            nuevoInput.classList.add("table_inputs");
            nuevocelda.appendChild(nuevoInput);
        }
        nuevaFila.appendChild(nuevocelda);
    }
    tabla_body.appendChild(nuevaFila);
    recolorred();
});
