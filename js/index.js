const ip = document.getElementById("ip");
const mascara = document.getElementById("mask");
const contenedor = document.getElementById("contenedor");
let ip_base = 0;
let ip_top = 0;

//Tabla
const tabla_body = document.getElementById("redes_desc").getElementsByTagName("tbody")[0]; //Tabla Body
const tabla_foot = document.getElementById("redes_desc").getElementsByTagName("tfoot")[0].rows[0].cells; //Tabla foot

//Insertar subred
const btn_add_row = document.getElementById("cant_red_add");
btn_add_row.addEventListener("click", function () {
    var nuevaFila = document.createElement("tr");
    for (var i = 0; i < 8; i++) {
        var nuevoTh = document.createElement("th");
        if (i < 2) {
            if (i == 0) {
                nuevoTh.style.backgroundColor = random_color();
            }
            nuevoTh.setAttribute("contenteditable", "true");
        }
        nuevaFila.appendChild(nuevoTh);
    }
    tabla_body.appendChild(nuevaFila);
});


//Boton calcular
document.getElementById("calcular").addEventListener("click", calcular);

function calcular() {
    getip();
    ordenarTabla(tabla_body);
    generar_datos(tabla_body);
    contenedor.innerHTML = "";
    if (Number(tabla_foot[3].innerHTML.replace("/", "")) >= Number(mascara.value) || tabla_foot[1].innerHTML == "0") {
        generer_grafico_vlsm(tabla_body.rows);
    }
}

function ordenarTabla(tabla) {
    var filas = tabla.rows;

    var arregloFilas = Array.from(filas); // Convertir las filas a un array y eliminar la primera fila de encabezado

    arregloFilas.sort(function (a, b) {
        var cola = parseInt(a.cells[1].textContent);
        var colb = parseInt(b.cells[1].textContent);
        return colb - cola; // Ordenar de mayor a menor
    });

    // Remover las filas existentes de la tabla
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }

    // Agregar las filas ordenadas a la tabla
    arregloFilas.forEach(function (fila) {
        tabla.appendChild(fila);
    });
}

function generar_datos(tabla) {
    let arr_filas = tabla.rows;
    tabla_foot[1].innerHTML = Number(0);
    for (let i = 0; i < arr_filas.length; i++) {
        let columnas = arr_filas[i].cells;
        let val = Number(columnas[1].innerHTML);
        let tdba = 0
        while (Math.pow(2, tdba) < val) {
            tdba += 1;
        }
        columnas[2].innerHTML = "2^" + tdba + " = " + Math.pow(2, tdba);
        columnas[3].innerHTML = (32 - tdba);
        if (i == 0) { columnas[4].innerHTML = ip_base }
        else {
            let cols_aux = arr_filas[i - 1].cells;
            columnas[4].innerHTML = sum_ip(octet_to_ipv4(ip_to_octet(cols_aux[7].innerHTML)), 1);
        }
        columnas[5].innerHTML = octet_to_ipv4(mask_to_b_octet(columnas[3].innerHTML));
        columnas[7].innerHTML = octet_to_ipv4(ip_to_octet(columnas[4].innerHTML).slice(0, columnas[3].innerHTML) + mask_to_b_octet(columnas[3].innerHTML).replaceAll("1", "").replaceAll("0", "1"));
        columnas[6].innerHTML = sum_ip(columnas[4].innerHTML, 1) + "-" + sum_ip(columnas[7].innerHTML, -1);

        tabla_foot[1].innerHTML = Number(tabla_foot[1].innerHTML) + Math.pow(2, 32 - Number(columnas[3].innerHTML));

        //Correciones de estilo visuales
        columnas[3].innerHTML = "/" + columnas[3].innerHTML;
        columnas[4].innerHTML += columnas[3].innerHTML;
    }
    let f_mask = 32 - Math.ceil(Math.log2(Number(tabla_foot[1].innerHTML)));
    tabla_foot[2].innerHTML = "2^" + (32 - f_mask) + " = " + Math.pow(2, 32 - f_mask);
    tabla_foot[3].innerHTML = "/" + f_mask;
}

function getip() {
    let ip_value = ip_corrector(document.getElementById("ip").value);
    let mascara_value = mask_corrector(Number(mascara.value));
    ip_base = calculate_base(ip_to_octet(ip_value), mask_to_b_octet(mascara_value))
    ip_top = octet_to_ipv4(ip_to_octet(ip_base).slice(0, mascara_value) + mask_to_b_octet(mascara_value).replaceAll("1", "").replaceAll("0", "1"))
}

function ip_corrector(ip_c) {

    let arr = ip_c.split(".");
    for (let i = 0; i < 4; i++) {
        if (Number(arr[i]) > 255) { arr[i] = "255"; }
        else if (Number(arr[i]) < 0) { arr[i] = "0"; }
    }
    arr = arr.splice(0, 4);
    ip.value = arr.join(".");
    return arr.join(".")
}

function mask_corrector(mask_c) {
    if (mask_c > 32) { mask_c = 32; }
    else if (mask_c < 0) { mask_c = 0; }
    mascara.value = mask_c;
    return mask_c
}

function mask_to_b_octet(mask) {
    return "1".repeat(mask) + "0".repeat(32 - mask)
}
function octet_to_ipv4(octet) {
    let result = '';
    octet = octet.split("");
    for (let i = 0; i < octet.length; i++) {
        result += octet[i];
        if ((i + 1) % 8 === 0 && i !== octet.length - 1) {
            result += '.';
        }
    }
    result = result.split(".");
    for (let i = 0; i < result.length; i++) {
        result[i] = parseInt(Number(result[i]), 2);
    }
    return result.join(".")
}
function ip_to_octet(ip_o) {
    let arr = ip_o.split(".");
    let val = "";
    for (let i = 0; i < arr.length; i++) {
        arr[i] = ('00000000' + Number(arr[i]).toString(2)).slice(-8)
    }
    return arr.join("")
}

function calculate_base(ip_c, mask_c) {
    let result = "";

    arr_ip = ip_c.split("");
    arr_masc = mask_c.split("");

    for (let i = 0; i < arr_ip.length; i++) {
        result += arr_ip[i] & arr_masc[i]
    }
    return octet_to_ipv4(result)
}


function sum_ip(ipv4, val) {
    var octetos = ipv4.split('.');

    // Convertir los octetos a números enteros
    for (var i = 0; i < octetos.length; i++) {
        octetos[i] = parseInt(octetos[i]);
    }

    // Incrementar el último octeto
    octetos[3] += val;

    // Verificar si el último octeto alcanza 256 y ajustar los octetos anteriores
    if (octetos[3] === 256) {
        octetos[2]++;
        octetos[3] = 0;

        if (octetos[2] === 256) {
            octetos[1]++;
            octetos[2] = 0;

            if (octetos[1] === 256) {
                octetos[0]++;
                octetos[1] = 0;
            }
        }
    } else if (octetos[3] < 0) {
        octetos[2]--;

        if (octetos[2] < 0) {
            octetos[1]--;

            if (octetos[1] < 0) {
                octetos[0]--;
            }

            octetos[1] = octetos[1] < 0 ? 255 : octetos[1];
        }

        octetos[2] = octetos[2] < 0 ? 255 : octetos[2];
    }

    // Volver a convertir los octetos en cadenas de texto
    for (var j = 0; j < octetos.length; j++) {
        octetos[j] = octetos[j].toString();
    }

    // Volver a concatenar los octetos en una cadena
    var direccionIP = octetos.join('.');

    return direccionIP;
}

function generer_grafico_vlsm(filas) {
    //Generate box
    contenedor.setAttribute("mask", "/" + mascara.value)
    if (filas.length > 0) {
        for (let i = 0; i < filas.length; i++) {
            agregar_element(filas[i].cells, contenedor);
        }
        vlsm_assign_free(contenedor);
    } else {
        contenedor.innerHTML = generate_box(ip_base, Number(mascara.value), ip_top, "Libre", "#ffffff", 64);
    }
}

//Asigna los espacios ocupados del grafico clsm
function agregar_element(fila, dom) {
    let ver = '<div class="vertical" mask="/';
    let hor = '<div class="horizontal" mask="/';
    if (fila[3].innerHTML == dom.getAttribute("mask")) {
        dom.setAttribute("mask", "/full/");
        dom.innerHTML = generate_box(fila[4].innerHTML.slice(0, -3), fila[3].innerHTML.replace("/", ""), fila[7].innerHTML, fila[0].innerHTML, fila[0].style.backgroundColor, Math.round(64 * (dom.offsetHeight / contenedor.offsetHeight)) + 4);
    } else if (dom.getAttribute("mask") != "/null/") {
        dom_mask = Number(dom.getAttribute("mask").replace("/", "")) + 1;
        dom.setAttribute("mask", "/null/");
        if (dom.id == "contenedor") {
            dom.innerHTML = ver + dom_mask + '"></div>' + ver + dom_mask + '"></div>';
        } else if (dom.className == "vertical") {
            dom.innerHTML = hor + dom_mask + '"></div>' + hor + dom_mask + '"></div>';
        } else if (dom.className == "horizontal") {
            dom.innerHTML = ver + dom_mask + '"></div>' + ver + dom_mask + '"></div>';
        }
        let hijos = Array.from(dom.children);
        agregar_element(fila, hijos[0]);
    } else if (dom.getAttribute("mask") == "/null/") {
        let hijos = Array.from(dom.children);
        if (hijos[0].getAttribute("mask") != "/full/") { agregar_element(fila, hijos[0]); }
        else { agregar_element(fila, hijos[1]); }
    }
    if (dom.getAttribute("mask") == "/null/") {
        let hijos = Array.from(dom.children);
        if (hijos[0].getAttribute("mask") == "/full/" && hijos[1].getAttribute("mask") == "/full/") dom.setAttribute("mask", "/full/");
    }
}

//Asigna los espacios libres del grafico clsm
function vlsm_assign_free(dom) {
    if (dom.getAttribute("mask") != "/null/" && dom.getAttribute("mask") != "/full/") {
        dom_mask = dom.getAttribute("mask").replace("/", "");
        let hermano = Array.from(dom.parentNode.children).filter(function (elementoActual) { return elementoActual !== dom; });
        let elem_hermano = hermano[0].getElementsByClassName("bottom")
        let ip_base_libre = sum_ip(elem_hermano[elem_hermano.length - 1].innerHTML, 1);
        let ip_top_libre = octet_to_ipv4(ip_to_octet(ip_base_libre).slice(0, dom_mask) + mask_to_b_octet(dom_mask).replaceAll("1", "").replaceAll("0", "1"));
        dom.innerHTML = generate_box(ip_base_libre, dom_mask, ip_top_libre, "Libre", "#ffffff", Math.round(64 * (dom.offsetHeight / contenedor.offsetHeight)) + 4);
    } else if (dom.getAttribute("mask") == "/null/") {
        let hijos = Array.from(dom.children);
        vlsm_assign_free(hijos[0]);
        vlsm_assign_free(hijos[1]);
    }
}

//Genera la caja de datos del grafico vlsm
function generate_box(ip_base, mask_num, ip_top, nombre, color, fnt_size) {
    const div = document.createElement("div");
    div.className = "elements";
    div.style.backgroundColor = color;
    div.style.fontSize = `${fnt_size}px`;

    const pTop = document.createElement("p");
    pTop.className = "top";
    pTop.textContent = ip_base;
    div.appendChild(pTop);

    const centerDiv = document.createElement("div");
    centerDiv.className = "center";

    const pNombre = document.createElement("p");
    pNombre.textContent = nombre;
    centerDiv.appendChild(pNombre);

    const pDispositives = document.createElement("p");
    pDispositives.className = "center_dispositives";
    pDispositives.textContent = `2^${32 - Number(mask_num)} = ${Math.pow(2, 32 - Number(mask_num))} direcciones`;
    centerDiv.appendChild(pDispositives);

    const pMask = document.createElement("p");
    pMask.className = "center_mask";
    pMask.textContent = `/${Number(mask_num)}`;
    centerDiv.appendChild(pMask);

    div.appendChild(centerDiv);

    const pBottom = document.createElement("p");
    pBottom.className = "bottom";
    pBottom.textContent = ip_top;
    div.appendChild(pBottom);

    return div.outerHTML;
}

//Generador de colores aleatorios
function random_color() {
    let color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    return color
}


//Hecho por Juan Ignacio Bertoldi