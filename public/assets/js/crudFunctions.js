const { remote} = require('electron')
const main = remote.require('./../src/main.js')


function agendarReservacion(idPaquete){
    var cliente = document.getElementById('cliente');
    var fecha_contratacion = document.getElementById('fecha_contratacion');
    var fecha_finalizacion = document.getElementById('fecha_finalizacion');
    var periodo_uso = document.getElementById('periodo_uso');
    var tiempo_uso = document.getElementById('tiempo_uso');
    var total_neto = document.getElementById('total_neto');

    const newReservacion = {
        idPaquete: idPaquete,
        cliente: cliente.value,
        fecha_contratacion: fecha_contratacion.value,
        fecha_finalizacion: fecha_finalizacion.value,
        periodo_uso: periodo_uso.value,
        tiempo_uso: tiempo_uso.value,
        total_neto: total_neto.value,
        pagado: 0
    }
    main.createReservacion(newReservacion);
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
                    <img src="../../public/res/img/${p.idpaquete}.jpg" class="img-fluid rounded-start" alt="...">
                  </div>
                  <div class="col-md-9">
                    <div class="card-body">
                      <div class="row">
                          <div class="col-11">
                            <h5 class="card-title">${p.nombre}</h5>
                          </div>
                          <div class="col-1">
                            <div class="options">
                                <button class="btn btn-light"><i class="fas fa-cog"></i></button>
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
    var titulo = document.getElementById("titleReservacion");
    var inputId=document.getElementById('idpaquete');
    var btnAgendar = document.getElementById('btnAgendar');
    titulo.innerText += paquete.nombre;
    inputId.value=(paquete.idpaquete);
    btnAgendar.setAttribute('onclick', 'agendarReservacion('+paquete.idpaquete+')')
}
  
async function initPaquetes() {
    getPaquetes();
}

async function initIndex() {
    getNoPagados();
}

