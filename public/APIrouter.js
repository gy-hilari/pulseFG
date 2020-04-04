const promiseIpc = require('electron-promise-ipc');
const controller = require('./APIcontroller');
const compRoutes = require('./routes/compRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const matchRoutes = require('./routes/matchRoutes');

const Controller = controller.Controller;
const CompRoutes = compRoutes.CompRoutes;
const SessionRoutes = sessionRoutes.SessionRoutes;
const MatchRoutes = matchRoutes.MatchRoutes;

function Router(db) {
    this.controller = new Controller(db);
    this.router = promiseIpc;
    this.routes = {
        compRoutes: new CompRoutes(this.router, this.controller.controllers.compController),
        sessionRoutes: new SessionRoutes(this.router, this.controller.controllers.sessionController),
        matchRoutes: new MatchRoutes(this.router, this.controller.controllers.matchController)
    }    
}

module.exports = {
    Router: Router
}