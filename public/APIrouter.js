const promiseIpc = require('electron-promise-ipc');
const controller = require('./APIcontroller');
const compRoutes = require('./routes/compRoutes');

const Controller = controller.Controller;
const CompRoutes = compRoutes.CompRoutes;

function Router(db) {
    this.controller = new Controller(db);
    this.router = promiseIpc;
    this.routes = {
        compRoutes: new CompRoutes(this.router, this.controller.controllers.compController)
    }    
}

module.exports = {
    Router: Router
}