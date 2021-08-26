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
        throw e;
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
        console.log(error);
    }
}

async function getPaquete(id){
    try {
        const conn = await getConnection();
        const paquete = await conn.query("SELECT * FROM paquetes WHERE idpaquete="+id);
        return paquete[0];
    } catch (error) {
        console.log(error);
    }
}

async function modifyPaquete(id, data){
    try {
        const conn = await getConnection();
        await conn.query("UPDATE paquetes SET ? WHERE idpaquete = ?",[data,id]);
    } catch (error) {
        console.log(error);
    }
}

async function createReservacion(reservacion,fecha){
    try {
        const conn = await getConnection();
        await conn.query("INSERT INTO reservaciones SET ?", reservacion);
        await generateFicha(reservacion,fecha);
    } catch (error) {
        console.log(error);
    }
}

async function deleteReservacion(idReservacion){
    try {
        const conn = await getConnection();
        await conn.query("DELETE FROM reservaciones WHERE idReservacion="+idReservacion);
    } catch (error) {
        console.log(error);
    }
}

async function aproveReservacion(idReservacion){
    try {
        const conn = await getConnection();
        await conn.query("UPDATE reservaciones SET pagado=1 WHERE idReservacion="+idReservacion);
    } catch (error) {
        console.log(error);
    }
}

async function getNoPagados(){
    try {
        const conn = await getConnection();
        const noPagados = conn.query("SELECT idReservacion, cliente FROM reservaciones WHERE pagado=0");
        return noPagados;
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
    modifyPaquete
}