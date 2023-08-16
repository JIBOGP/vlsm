//Insertar subred
const btn_add_row = document.getElementById("cant_red_add");
btn_add_row.addEventListener("click", function () {
    var nuevaFila = document.createElement("tr");
    for (var i = 0; i < 8; i++) {
        var nuevoTh = document.createElement("th");
        if (i < 2) {
            if (i == 0) {
                nuevoTh.style.backgroundColor = random_color();
                if (calculateBrightness(nuevoTh.style.backgroundColor) < 128) {
                    nuevoTh.style.color = "white";
                  }
            }
            nuevoTh.setAttribute("contenteditable", "true");
        }
        nuevaFila.appendChild(nuevoTh);
    }
    tabla_body.appendChild(nuevaFila);
});