const fs = require('fs');
const { readdirSync } = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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

const initDirectories = function (db) {
    if (!fs.existsSync('.' + `/${db.dbDir}/${db.dbName}.db`)) {
        fs.mkdirSync('.' + `/${db.dbDir}`);
        fs.createWriteStream('.' + `/${db.dbDir}/${db.dbName}.db`);
    }

    if (!fs.existsSync('.' + `/${db.imgDir}`)) {
        fs.mkdirSync('.' + `/${db.imgDir}`);
    }
}


function Initializer() {
    this.dbDir = "pulsefgdata";
    this.dbName = "pulsefg";
    this.imgDir = "images";
    this.db = null;
}

Initializer.prototype.logDirectories = () => {
    console.log(`Current image dir: ${path.resolve('./images')}`);
    console.log(getDirs('./images'));
}

Initializer.prototype.initialize = function (){
    initDirectories(this);
    this.db = new sqlite3.Database(path.join('.', `/${this.dbDir}/${this.dbName}.db`));
    return this.db;
}

module.exports = {
    Initializer: Initializer
}