const { remote} = require('electron')
const main = remote.require('./../src/main.js')

//Validar fecha para que sea de lunes a viernes y la hora de 8 a 7 
function agendarReservacion(idPaquete){
    var cliente = document.getElementById('cliente');
    var fecha_contratacion = document.getElementById('fecha_contratacion');
    var fecha_finalizacion = document.getElementById('fecha_finalizacion');
    var periodo_uso = document.getElementById('periodo_uso');
    var tiempo_uso = document.getElementById('tiempo_uso');
    var total_neto = document.getElementById('total_neto');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //Month starts in 0
    var yyyy = today.getFullYear();

    today = yyyy + '/' + mm + '/' + dd;
    //document.write(today);

    const newReservacion = {
        idPaquete: idPaquete,
        cliente: cliente.value,
        fecha_registro: today,
        fecha_contratacion: fecha_contratacion.value,
        fecha_finalizacion: fecha_finalizacion.value,
        periodo_uso: periodo_uso.value,
        tiempo_uso: tiempo_uso.value,
        total_neto: total_neto.value,
        pagado: 0
    }
    main.createReservacion(newReservacion, today);
    location.reload();  
}

function renderPaquetes(paquetes){
    const divPaquetes = document.querySelector('#paquetes');
    divPaquetes.innerHTML = "";
    paquetes.forEach((p)=>{
        divPaquetes.innerHTML += `
        <div class="row gx-0">
            <div class="card mb-3">
                <div class="row g-0">
                  <div class="col-md-3">
                    <img src="../../public/res/img/${p.idpaquete}.png" class="img-fluid rounded-start" alt="...">
                  </div>
                  <div class="col-md-9">
                    <div class="card-body">
                      <div class="row">
                          <div class="col-11">
                            <h5 class="card-title">${p.nombre}</h5>
                          </div>
                          <div class="col-1">
                            <div class="options">
                                <button class="btn btn-light" onclick="fillModalModificar(${p.idpaquete})" data-bs-toggle="modal" data-bs-target="#modificarPaquete"><i class="fas fa-cog"></i></button>
                            </div>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col-12">
                            ${p.servicios}
                          </div>
                          <div class="col-4">
                            <p class="card-text">Personas: ${p.capacidad_personas}</p>
                          </div>
                          <div class="col-4">
                            <p class="card-text">Tarifa hora: ${p.tarifa_hora}</p>
                          </div>
                          <div class="col-4">
                            <p class="card-text">Tarifa dia: ${p.tarifa_dia}</p>
                          </div>
                          <div class="col-4">
                            <p class="card-text">Tarifa semana: ${p.tarifa_semana}</p>
                          </div>
                          <div class="col-4">
                            <p class="card-text">Tarifa mes: ${p.tarifa_mensual}</p>
                          </div>
                          <div class="col-4">
                            <p class="card-text">Medidas: ${p.medidas}</p>
                          </div>
                          <div class="col-4">
                            <p class="card-text">Capacidad instalada: ${p.capacidad_instalada}</p>
                          </div>
                          <div class="agenda">
                              <button onclick="fillModalReservacion(${p.idpaquete})" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#registrarReservacion">Agendar reservacion</button>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        `
    });
}

function renderNoPagados(clientesNP){
    const tablaHTML = document.querySelector('#noPagados');
    var tabla = ""
    tabla += `
    <table class="table">
        <thead>
            <th>Nombre</th>
            <th>Validar</th>
        </thead>
        <tbody>
    `    
    clientesNP.forEach((c)=>{
        tabla += `
                <tr>
                    <td class="align-self-center" scope="row">${c.cliente}</td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group" aria-label="actionButtons">
                            <button type="button" onclick="validateReservacion(${c.idReservacion})" class="btn btn-success"><i class="fas fa-check"></i></button>
                            <button type="button" onclick="deleteReservacion(${c.idReservacion})" class="btn btn-danger"><i class="fas fa-times"></i></button>
                        </div>
                    </td>
                </tr>
        `
    });
    tabla += `
        </tbody>
    </table>
    `
    tablaHTML.innerHTML = tabla;
}

async function calcularPrecios(){
    var idPaquete = document.getElementById('idpaquete').value;
    var periodo = document.getElementById('periodo_uso').value;
    var tiempo = document.getElementById('tiempo_uso').value;
    const total_neto = document.getElementById('total_neto');
    const total_iva = document.getElementById('total_iva');
    
    paquete = await main.getPaquete(idPaquete);
    let preciosPeriodo = [paquete['tarifa_hora'], paquete['tarifa_dia'], paquete['tarifa_semana'], paquete['tarifa_mensual']];
    
    costo_neto=parseFloat(preciosPeriodo[periodo-1]*tiempo);

    total_neto.value = Math.round((costo_neto + Number.EPSILON) * 100) / 100 ;
    total_iva.value = Math.round(((costo_neto*1.16) + Number.EPSILON) * 100) / 100 ;
}

async function getNoPagados(){
    noPagados = await main.getNoPagados();
    renderNoPagados(noPagados);
}

async function deleteReservacion(id){
    await main.deleteReservacion(id);
    location.reload();
}

async function validateReservacion(id){
    await main.aproveReservacion(id);
    location.reload();
}

async function getPaquetes() {
    paquetes = await main.listPaquetes();
    renderPaquetes(paquetes);
};

async function fillModalReservacion(id) {
    paquete = await main.getPaquete(id);
    var formAgendar = document.getElementById('reservacionForm');
    var idPaquete = document.getElementById('idpaquete');
    var titulo = document.getElementById("titleReservacion");

    formAgendar.reset();
    idPaquete.value = paquete.idpaquete;
    titulo.innerHTML = '';
    titulo.innerText = 'Agendar reservacion para '+paquete.nombre;
    formAgendar.setAttribute('onsubmit', 'agendarReservacion('+paquete.idpaquete+')');
}

async function fillModalModificar(id){
    paquete = await main.getPaquete(id);
    //Set the information in the inputs 
    var formModificar = document.getElementById('modificarForm');
    var titulo = document.getElementById("modificartitlePaquete");
    var idPaquete = document.getElementById('modificaridpaquete');
    var nombre = document.getElementById('modificarnombre');
    var servicios = document.getElementById('modificarservicios');
    var tarifa_hora = document.getElementById('modificartarifa_hora'); 
    var tarifa_dia = document.getElementById('modificartarifa_dia'); 
    var tarifa_semana = document.getElementById('modificartarifa_semana'); 
    var tarifa_mensual = document.getElementById('modificartarifa_mensual'); 

    formModificar.reset();
    idPaquete.value = paquete.idpaquete;
    titulo.innerHTML = '';
    titulo.innerText = 'Modificar paquete '+paquete.nombre;
    nombre.value = paquete.nombre;
    servicios.value = paquete.servicios;
    tarifa_hora.value = paquete.tarifa_hora;
    tarifa_dia.value = paquete.tarifa_dia;
    tarifa_semana.value = paquete.tarifa_semana;
    tarifa_mensual.value = paquete.tarifa_mensual;
    formModificar.setAttribute('onsubmit', 'modificarPaquete('+paquete.idpaquete+')'); //Hacer funcion para modificar paquete
}

 
async function modificarPaquete(id){
    var nombre = document.getElementById('modificarnombre').value;
    var servicios = document.getElementById('modificarservicios').value;
    var tarifa_hora = document.getElementById('modificartarifa_hora').value; 
    var tarifa_dia = document.getElementById('modificartarifa_dia').value; 
    var tarifa_semana = document.getElementById('modificartarifa_semana').value; 
    var tarifa_mensual = document.getElementById('modificartarifa_mensual').value; 

    const newPaquete = {
        nombre: nombre,
        servicios: servicios,
        tarifa_hora: tarifa_hora,
        tarifa_dia: tarifa_dia,
        tarifa_semana: tarifa_semana,
        tarifa_mensual: tarifa_mensual
    }

    main.modifyPaquete(id, newPaquete);
    location.reload();
}

async function initPaquetes() {
    getPaquetes();
}

async function initIndex() {
    getNoPagados();
}

