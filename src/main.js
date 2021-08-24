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

async function createReservacion(reservacion){
    try {
        const conn = await getConnection();
        await conn.query("INSERT INTO reservaciones SET ?", reservacion);
    } catch (error) {
        console.log(error);
    }
}





module.exports = {
    createWindow,
    createReservacion
}