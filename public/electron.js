const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const fs = require('fs');
const { readdirSync } = require('fs');

const path = require('path');
const url = require('url');

const sqlite3 = require('sqlite3').verbose();

let mainWindow;

const models = require('./APImodels');
const router = require('./APIrouter');

//#region INITIALIZE DATABASE ENVIRONMENT 

const dbDir = "pulsefgdata";
const dbName = "pulsefg";
if (!fs.existsSync('.' + `/${dbDir}/${dbName}.db`)) {
    fs.mkdirSync('.' + `/${dbDir}`);
    fs.createWriteStream('.' + `/${dbDir}/${dbName}.db`);
}

const imgDir = "images";
if (!fs.existsSync('.' + `/${imgDir}`)) {
    fs.mkdirSync('.' + `/${imgDir}`);
}

const getDirs = (path) => {
    let dirs = {};
    readdirSync(path, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dirs[dir.name] = getFiles(dir.name));
    return dirs;
}

const getFiles = (dir) => {
    let validExtensions = [
        ".jpg",
        ".JPG",
        ".jpeg",
        ".png",
        ".bmp"
    ];
    return readdirSync(`./images/${dir}`, { withFileTypes: true })
        .filter(file => !file.isDirectory())
        .filter(file => validExtensions.includes(path.extname(file.name)))
        .map(file => file.name);
}

if (isDev) {
    console.log(`Current image dir: ${path.resolve('./images')}`);
    console.log(getDirs('./images'));
}

const db = new sqlite3.Database(path.join('.', `/${dbDir}/${dbName}.db`));

//#endregion

//#region CREATE ELECTRON WINDOW

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
    models.CheckOrCreateModels(db).then(res => {
        console.log(res);
    }).catch((err) => console.log(err));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        db.close();
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

//#endregion

//#region MAIN API

const Router = router.Router;
const routes = new Router(db);

//#endregion