const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');


function createWindow() {
    let state = windowStateKeeper({
        defaultWidth: 800, defaultHeight: 600
    })

    mainWindow = isDev ?
        new BrowserWindow({
            x: state.x, y: state.y,
            width: state.width, height: state.height,
            minWidth: 700, minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                webSecurity: false,
                preload: path.join(__dirname, "/preload.js")
            },

            frame: true
        })
        :
        new BrowserWindow({
            x: state.x, y: state.y,
            width: state.width, height: state.height,
            minWidth: 700, minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                devTools: false,
                preload: path.join(__dirname, "/preload.js")
            },

            frame: true
        });

    const startUrl = isDev ? process.env.ELECTRON_START_URL : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    if (isDev) mainWindow.webContents.openDevTools();

    state.manage(mainWindow);

    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});