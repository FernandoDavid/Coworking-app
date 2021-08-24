const {BrowserWindow, app} = require('electron')
const { getConnection } = require('./database.js')
const path = require('path')

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

async function createReservacion(reservacion){
    try {
        const conn = await getConnection();
        await conn.query("INSERT INTO reservaciones SET ?", reservacion);
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
    aproveReservacion
}