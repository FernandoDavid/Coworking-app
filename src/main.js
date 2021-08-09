const {BrowserWindow} = require('electron');

let window;  

function createWindow(){
        window = new BrowserWindow({ show:false });
        window.maximize();
        window.loadFile('src/views/index.html');
        window.show();
}

module.exports={
    createWindow
}