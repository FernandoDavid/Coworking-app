const {createWindow} = require('./main.js')
const {app} = require('electron')
const path = require('path')
const bootstrap = require('bootstrap');

require('electron-reload')(__dirname)

require('./database.js');

app.whenReady().then(createWindow);