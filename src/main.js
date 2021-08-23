const {BrowserWindow, app} = require('electron')
const path = require('path')

let window;

require('./database.js');
require('electron-reload')(__dirname);

function createWindow(){
    window = new BrowserWindow({ show:false });
    window.maximize();
    window.loadFile('src/views/index.html');
    window.webContents.on('did-finish-load', function() {
        window.show();
    });
    
    window.on("closed", () => {
        app.quit();
    });
}

module.exports = {
    createWindow
}