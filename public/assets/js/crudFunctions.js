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
        total_neto: parseFloat(total_neto.value),
        pagado: 0
    }
    main.createReservacion(newReservacion);   
}


