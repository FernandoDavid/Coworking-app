const {BrowserWindow, app} = require('electron')
const path = require('path')

let window;

require('./database.js');
require('electron-reload')(__dirname)

function createWindow(){
    window = new BrowserWindow({ show:false });
    window.maximize();
    window.loadFile('src/views/index.html');
    window.show();
    window.on("closed", () => {
        app.quit()
    });
}

app.on("quit", () => {
    newHandlebars.clearTemps();
});



app.whenReady().then(createWindow);