const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const fs = require('fs');
const { readdirSync } = require('fs');

const path = require('path');
const url = require('url');

const uniqid = require('uniqid');
const promiseIpc = require('electron-promise-ipc');

const sqlite3 = require('sqlite3').verbose();

let mainWindow;

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
    CheckOrCreateModels().then(res => {
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

//#region INITIALIZE DATABASE MODELS

function CheckOrCreateModels() {
    return new Promise((resolve, reject) => {
        let tables = [
            {
                tableName: 'comp',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' }
            },
            {
                tableName: 'session',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                unitOfMeasure: { foreignKey: false, string: 'TEXT NOT NULL' },
                comp: { foreignKey: false, string: 'TEXT NOT NULL' },
                compKey: { foreignKey: true, string: 'FOREIGN KEY (comp) REFERENCES comp(_id)' }
            },
            {
                tableName: 'pulsegraph',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                session: { foreignKey: false, string: 'TEXT NOT NULL' },
                sessionKey: { foreignKey: true, string: 'FOREIGN KEY (session) REFERENCES session(_id)' }
            },
            {
                tableName: 'match',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                result: { foreignKey: false, string: 'INT NOT NULL' },
                session: { foreignKey: false, string: 'TEXT NOT NULL' },
                sessionKey: { foreignKey: true, string: 'FOREIGN KEY (session) REFERENCES session(_id)' }
            },
            {
                tableName: 'widget_parameter',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                title: { foreignKey: false, string: 'TEXT NOT NULL' },
                imagePath: { foreignKey: false, string: 'TEXT' }, // IMAGES OPTIONAL
                match: { foreignKey: false, string: 'TEXT NOT NULL' },
                matchKey: { foreignKey: true, string: 'FOREIGN KEY (match) REFERENCES match(_id)' }
            },
            {
                tableName: 'widget_notebox',
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                title: { foreignKey: false, string: 'TEXT NOT NULL' },
                text: { foreignKey: false, string: 'TEXT NOT NULL' },
                imagePath: { foreignKey: false, string: 'TEXT' }, // IMAGES OPTIONAL
                match: { foreignKey: false, string: 'TEXT NOT NULL' },
                matchKey: { foreignKey: true, string: 'FOREIGN KEY (match) REFERENCES match(_id)' }
            }
        ];

        db.serialize(() => {
            tables.forEach(t => {
                let sql =
                    `CREATE TABLE IF NOT EXISTS ${t.tableName} (
                    _id TEXT PRIMARY KEY,
                    `;

                let fields = Object.keys(t);
                for (let k = 0; k < fields.length; k++) {
                    if (fields[k] != 'tableName') {
                        sql += !t[fields[k]].foreignKey ? `${fields[k]} ${t[fields[k]].string}` : `${t[fields[k]].string}`;
                        if (k + 1 < fields.length) sql += `,
                        `;
                    }
                }
                sql += `
                )`;
                let stmt = db.prepare(sql);
                stmt.run(err => {
                    reject(err);
                });
                stmt.finalize();
            });
            resolve('Models created!');
        });
    });
}

//#endregion

//#region MAIN API

promiseIpc.on('test', () => {
    return new Promise((resolve, reject) => {
        console.log('IPC Reached main!');
        resolve('IPC Returned from main!');
    });
});

promiseIpc.on('/comp', (ping) => {
    console.log(ping.message);
    return new Promise((resolve, reject) => {
        GetCompendiums().then((res) => {
            resolve(res);
        });
    });
})

promiseIpc.on('/comp/create', (form) => {
    return new Promise((resolve, reject) => {
        CreateCompendium(form).then((res) => {
            GetCompendiums().then((res) => {
                resolve(res);
            });
        }).catch((err) => {
            GetCompendiums().then((res) => {
                resolve(res);
            });
        });
    });
})

//#endregion

//#region API FUNCTIONS

function GetCompendiums() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`SELECT _id as id, name, createdAt FROM comp ORDER BY createdAt DESC`, (err, comps) => {
                if (err) reject(err);
                resolve(comps);
            });
        });
    });
}

function CreateCompendium(form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form!');
        if (form.name) db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO comp (
                    _id,
                    name,
                    createdAt
                )
                VALUES (
                    $id,
                    $name,
                    $createdAt
                )`
            );
            let compId = uniqid('cmp_');
            stmt.run({
                $id: compId,
                $name: form.name,
                $createdAt: new Date(Date.now()).toISOString()
            });
            stmt.finalize();
            resolve(`Compendium [${compId}] created successfully!`);
        });
    });
}

//#endregion