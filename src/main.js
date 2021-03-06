const {BrowserWindow, app} = require('electron')
const Pizzip = require('pizzip')
const DocxTemplater = require('docxtemplater')
const fs = require('fs')
const { getConnection } = require('./database.js')
const path = require('path')

const homeDir = require('os').homedir();
const desktopDir = `${homeDir}/Desktop`;

let window;

require('electron-reload')(__dirname);

function createWindow(){
    window = new BrowserWindow({ 
        show:false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule:true
        }
    });
    window.maximize();
    window.loadFile('src/views/index.html');
    window.webContents.on('did-finish-load', function() {
        window.show();
    });
    window.on("closed", () => {
        app.quit();
    });
}

async function generateFicha(reservacion, fecha){
    var content = fs.readFileSync(path.resolve(__dirname, 'docs/ficha_pago_cajas.docx'), 'binary');
    const zip = new Pizzip(content);
    const doc = new DocxTemplater(zip);
    doc.setData({
        fecha: fecha,
        nombre: reservacion.cliente,
        linea: 'Especificar linea',
        subtotal: reservacion.total_neto,
        iva:  Math.round(((reservacion.total_neto*0.16) + Number.EPSILON) * 100) / 100,
        total: Math.round(((reservacion.total_neto*1.16) + Number.EPSILON) * 100) / 100
    });
    try {
        doc.render();
    } catch (e) {
        alert(e);
    }
    var buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(`${desktopDir}/Ficha_${reservacion.cliente}.docx`, buf);
}

async function listPaquetes(){
    try {
        const conn = await getConnection();
        const paquetes = await conn.query("SELECT * FROM paquetes");
        return paquetes;
    } catch (error) {
        alert("Error al enlistar paquetes:"+error);
    }
}

async function getPaquete(id){
    try {
        const conn = await getConnection();
        const paquete = await conn.query("SELECT * FROM paquetes WHERE idpaquete="+id);
        return paquete[0];
    } catch (error) {
        alert("Error al obtener paquetes:"+error);
    }
}

async function modifyPaquete(id, data){
    try {
        const conn = await getConnection();
        await conn.query("UPDATE paquetes SET ? WHERE idpaquete = ?",[data,id]);
    } catch (error) {
        alert("Error al modificar paquete:"+error);
    }
}

async function createReservacion(reservacion,fecha){
    try {
        const conn = await getConnection();
        await conn.query("INSERT INTO reservaciones SET ?", reservacion);
        await generateFicha(reservacion,fecha);
    } catch (error) {
        alert("Error al agendar reservacion:"+error);
    }
}

async function verificarDisponibilidad(fecha_contratacion, idpaquete){
    try {
        const  fecha_actual = new Date(fecha_contratacion);
        const  fecha = fecha_actual.getFullYear()+'-'+('0'+(fecha_actual.getMonth()+1)).slice(-2)+'-'+('0'+(fecha_actual.getDate())).slice(-2) + " "+("0"+fecha_actual.getHours()).slice(-2)+":"+("0"+fecha_actual.getMinutes()).slice(-2)+":00";
        //console.log(fecha);
        const conn = await getConnection();
        const res =  await conn.query("SELECT verificarReservacion('"+fecha+"',"+idpaquete+") as disponible");
        //console.log(res[0].disponible);
        return res[0].disponible;
    } catch (error) {
        alert("Error al verificar disponibilidad:"+error);
    }
}

async function deleteReservacion(idReservacion){
    try {
        const conn = await getConnection();
        await conn.query("DELETE FROM reservaciones WHERE idReservacion="+idReservacion);
    } catch (error) {
        alert("Error al eliminar reservacion:"+error);
    }
}

async function aproveReservacion(idReservacion){
    try {
        const conn = await getConnection();
        await conn.query("UPDATE reservaciones SET pagado=1 WHERE idReservacion="+idReservacion);
    } catch (error) {
        alert("Error al aceptar reservacion:"+error);
    }
}

async function getNoPagados(){
    try {
        const conn = await getConnection();
        const noPagados = conn.query("SELECT r.idReservacion reservacion, r.cliente cliente, p.nombre paquete, r.total_neto total FROM reservaciones r inner join paquetes p on r.idpaquete=p.idpaquete WHERE pagado=0");
        return noPagados;
    } catch (error) {
        console.log(error);
    }
}

async function getPagados(id){
    try {
        const conn = await getConnection();
        const pagados = conn.query("SELECT * FROM reservaciones WHERE idpaquete="+id+" and pagado=1 and fecha_finalizacion>now() order by fecha_contratacion, fecha_finalizacion");
        return pagados;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createWindow,
    createReservacion,
    listPaquetes,
    getPaquete,
    getNoPagados,
    deleteReservacion,
    aproveReservacion,
    modifyPaquete,
    verificarDisponibilidad,
    getPagados
}