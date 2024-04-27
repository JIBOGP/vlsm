let ipinput = document.querySelectorAll(".ip");
let mascara = document.getElementById("mask");
let contenedor = document.getElementById("contenedor");
let ip_value = "0.0.0.0"
let ip_base = "0.0.0.0";
let ip_top = "0.0.0.0";

//Tabla
let tabla_body = document.getElementById("redes_desc").getElementsByTagName("tbody")[0]; //Tabla Body
let tabla_foot = document.getElementById("redes_desc").getElementsByTagName("tfoot")[0].rows[0].cells; //Tabla foot

//Comportamiento de IP input

ipinput.forEach((input, index) => {
    input.addEventListener('input', () => {
        let value = parseInt(input.value, 10);

        if (isNaN(value)) {
            value = 0;
        }

        value = Math.min(255, Math.max(0, value));

        input.value = value;

        if (input.value.length === 3 && index < ipinput.length - 1) {
            ipinput[index + 1].focus();
        }
    });
});

//Corrige la mascara para que no se salga de los margenes de 0 a 32
function mask_corrector(mask_c) {
    if (mask_c > 32) { mask_c = 32; }
    else if (mask_c < 0) { mask_c = 0; }
    mascara.value = mask_c;
    return mask_c
}

//Boton calcular
document.getElementById("calcular").addEventListener("click", calcular);

function calcular() {
    get_ip_values();
    ordenarTabla(tabla_body);
    error_datos = errors(tabla_body.rows);
    if (error_datos) {
        generar_datos(tabla_body);
        contenedor.innerHTML = "";
        if (Number(tabla_foot[3].innerHTML.replace("/", "")) >= Number(mascara.value) || tabla_body.children.length === 0) {
            generer_grafico_vlsm(tabla_body.rows);
        }
    }
}

//Calcula el valor de la ip en formato ipv4 su base y su tope
function get_ip_values() {
    let mascara_value = mask_corrector(Number(mascara.value));
    ip_value = (Array.from(ipinput).map(input => { return input.value; })).join('.'); //Concatenacion de los valores de los inputs de la ip
    ip_base = calculate_base(ip_to_octet(ip_value), mask_to_octet(mascara_value)) //Calculado de la base de la ip con su respectiva mascara
    ip_top = octet_to_ipv4(ip_to_octet(ip_base).slice(0, mascara_value) + mask_to_octet(mascara_value).replaceAll("1", "").replaceAll("0", "1")) //Calculado del tope de la ip con su respectiva mascara
}

//Verificamos que los campos de ips necesarias no esten vacios
function errors(filas) {
    let result = true;
    if (filas.length > 0) {
        let sumval = 0
        for (let i = 0; i < filas.length; i++) {
            let poscol = filas[i].cells[1];
            let msg = "";
            let val =poscol.querySelector(".table_inputs").value;

            if (poscol.querySelector(".error-cell")) { poscol.querySelector(".error-cell").remove(); }
            sumval += Math.pow(2, Math.ceil(Math.log2(parseInt(filas[i].cells[1].querySelector(".table_inputs").value))))
            //Capturas de error
            if (val == '') { //input vacio
                msg = "Este dato esta vacio";
                result = false;
            } else if (val > Math.pow(2, 32)) { //input mayor a la maxima cantidad de ips
                msg = `El valor supera el limite de 2^32 (${Math.pow(2, 32)})`;
                result = false;
            } else if (val <= 2) { //Input menor a la cantidad minima de redes necesarias
                msg = "La red no es utilizable (necesita una base , un broadcast y una ip asignable)";
                result = false;
            } else if (Math.ceil(Math.log2(sumval)) > parseInt(mascara.value)) { //Input supera el limite dado por la mascara
                msg = `Se a superado el limite de redes disponibles para una mascara de ${mascara.value}/`;
                result = false;
            }

            if (msg != "") {
                var errorCell = document.createElement("div");
                errorCell.className = "error-cell";

                // Crear el elemento div con la 'X' dentro
                var xElement = document.createElement("div");
                xElement.textContent = "[!]";

                var xElementMsg = document.createElement("div");
                xElementMsg.className = "error-cell-msg"
                xElementMsg.textContent = msg;

                // Añadir el elemento de la 'X' al contenedor
                errorCell.appendChild(xElement);
                errorCell.appendChild(xElementMsg);

                poscol.appendChild(errorCell);
            }
        }
    }
    return result
}

//Ordena la tabla por la cantidad de ips necesarias de mayor a menor
function ordenarTabla(tabla) {
    let filas = tabla.rows;

    let arregloFilas = Array.from(filas); // Convertir las filas a un array y eliminar la primera fila de encabezado

    arregloFilas.sort(function (a, b) {
        let cola = parseInt(a.cells[1].querySelectorAll(".table_inputs")[0].value);
        let colb = parseInt(b.cells[1].querySelectorAll(".table_inputs")[0].value);
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

//Generar tabla de datos
function generar_datos(tabla) {
    let arr_filas = tabla.rows;
    tabla_foot[1].innerHTML = 0;
    for (let i = 0; i < arr_filas.length; i++) {
        let columnas = arr_filas[i].cells;
        let tdba = Math.ceil(Math.log2(columnas[1].querySelectorAll(".table_inputs")[0].value))

        //TAMAÑO DEL BLOQUE ASIGNADO
        columnas[2].innerHTML = "2^" + tdba + " = " + Math.pow(2, tdba);

        //MÁSCARA RESULTANTE
        columnas[3].innerHTML = (32 - tdba);
        //DIRECCIÓN BASE
        if (i == 0) { columnas[4].innerHTML = ip_base }
        else {
            let cols_aux = arr_filas[i - 1].cells;
            columnas[4].innerHTML = sum_ip(octet_to_ipv4(ip_to_octet(cols_aux[7].innerHTML)), 1);
        }
        if (Number(columnas[3].innerHTML) >= 0) {
            //MÁSCARA
            columnas[5].innerHTML = octet_to_ipv4(mask_to_octet(columnas[3].innerHTML));

            //BROADCAST
            columnas[7].innerHTML = octet_to_ipv4(ip_to_octet(columnas[4].innerHTML).slice(0, columnas[3].innerHTML) +
                mask_to_octet(columnas[3].innerHTML).replaceAll("1", "").replaceAll("0", "1"));

            //RANGO ASIGNABLE
            columnas[6].innerHTML = sum_ip(columnas[4].innerHTML, 1) + "-" + sum_ip(columnas[7].innerHTML, -1);

            tabla_foot[1].innerHTML = Number(tabla_foot[1].innerHTML) + Math.pow(2, 32 - Number(columnas[3].innerHTML));
        }
        //Correciones de estilo visuales
        columnas[3].innerHTML = "/" + columnas[3].innerHTML;
        columnas[4].innerHTML += columnas[3].innerHTML;
    }
    let f_mask = 32 - Math.ceil(Math.log2(Number(tabla_foot[1].innerHTML)));
    if (tabla_foot[1].innerHTML != 0) {
        tabla_foot[2].innerHTML = "2^" + (32 - f_mask) + " = " + Math.pow(2, 32 - f_mask);
        tabla_foot[3].innerHTML = "/" + f_mask;
    } else { tabla_foot[1].innerHTML = ''; }
}

//Mascara a formato octeto
function mask_to_octet(mask) {
    return "1".repeat(mask) + "0".repeat(32 - mask)
}
//Octeto a formato IPV4
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
//IPV4 a formato octeto
function ip_to_octet(ip_o) {
    let arr = ip_o.split(".");
    let val = "";
    for (let i = 0; i < arr.length; i++) {
        arr[i] = ('00000000' + Number(arr[i]).toString(2)).slice(-8)
    }
    return arr.join("")
}

//Calcula la base de la ip
function calculate_base(ip_c, mask_c) {
    let result = "";

    arr_ip = ip_c.split("");
    arr_masc = mask_c.split("");

    for (let i = 0; i < arr_ip.length; i++) {
        result += arr_ip[i] & arr_masc[i]
    }
    return octet_to_ipv4(result)
}

//Suma y resta de ips con un valor entero ej: 
//  0.0.0.0     + 1 = 0.0.0.1 
//  0.0.0.255   + 1 = 0.0.1.0 
//  0.0.0.0     - 1 = 0.0.0.0
//  1.0.0.0     - 1 = 0.255.255.255

function sum_ip(ipv4, val) {
    let octetos = ipv4.split('.');

    // Convertir los octetos a números enteros
    for (let i = 0; i < octetos.length; i++) {
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
    for (let j = 0; j < octetos.length; j++) {
        octetos[j] = octetos[j].toString();
    }

    // Volver a concatenar los octetos en una cadena
    let direccionIP = octetos.join('.');

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
        contenedor.innerHTML = generate_box(ip_base, Number(mascara.value), ip_top, "Libre", "rgb(255,255,255)", 64);
    }
}

//Asigna los espacios ocupados del grafico vlsm
function agregar_element(fila, dom) {
    let ver = '<div class="vertical" mask="/';
    let hor = '<div class="horizontal" mask="/';
    if (fila[3].innerHTML == dom.getAttribute("mask")) {
        dom.setAttribute("mask", "/full/");
        dom.innerHTML = generate_box(fila[4].innerHTML.slice(0, -3), fila[3].innerHTML.replace("/", ""), fila[7].innerHTML, fila[0].querySelectorAll(".table_inputs")[0].value, fila[0].style.backgroundColor, Math.round(64 * (dom.offsetHeight / contenedor.offsetHeight)) + 4);
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

//Asigna los espacios libres del grafico vlsm
function vlsm_assign_free(dom) {
    if (dom.getAttribute("mask") != "/null/" && dom.getAttribute("mask") != "/full/") {
        dom_mask = dom.getAttribute("mask").replace("/", "");
        let hermano = Array.from(dom.parentNode.children).filter(function (elementoActual) { return elementoActual !== dom; });
        let elem_hermano = hermano[0].getElementsByClassName("bottom")
        let ip_base_libre = sum_ip(elem_hermano[elem_hermano.length - 1].innerHTML, 1);
        let ip_top_libre = octet_to_ipv4(ip_to_octet(ip_base_libre).slice(0, dom_mask) + mask_to_octet(dom_mask).replaceAll("1", "").replaceAll("0", "1"));
        dom.innerHTML = generate_box(ip_base_libre, dom_mask, ip_top_libre, "Libre", "RGB(255,255,255)", Math.round(64 * (dom.offsetHeight / contenedor.offsetHeight)) + 4);
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
    if (calculateBrightness(color) < 128) {
        div.style.color = "white";
    }
    div.style.fontSize = `${fnt_size}px`;
    const pTop = document.createElement("p");
    pTop.className = "top";
    pTop.textContent = ip_base;
    if (fnt_size < 12) { pTop.style.opacity = 0 }
    div.appendChild(pTop);

    const centerDiv = document.createElement("div");
    if (fnt_size < 12) { centerDiv.style.opacity = 0 }
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
    if (fnt_size < 12) { pBottom.style.opacity = 0 }
    div.appendChild(pBottom);

    return div.outerHTML;
}

//Generador de colores aleatorios
function random_color() {
    let color = `rgb(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)})`
    return color
}

//Calcula el brillo de los colores
function calculateBrightness(color) {
    const rgbValues = color.match(/\d+/g);
    const red = parseInt(rgbValues[0]);
    const green = parseInt(rgbValues[1]);
    const blue = parseInt(rgbValues[2]);
    const brightness = Math.sqrt(
        0.299 * (red * red) +
        0.587 * (green * green) +
        0.114 * (blue * blue)
    );
    return brightness;
}

//Hecho por Juan Ignacio Bertoldi