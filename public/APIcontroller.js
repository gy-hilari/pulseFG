const compController = require('./controllers/compController');
const sessionController = require('./controllers/sessionController');
const CompController = compController.CompContoller;
const SessionController = sessionController.SessionController;

function Controller(db) {
    this.db = db;
    this.controllers = {
        compController: new CompController(this.db),
        sessionController: new SessionController(this.db)
    }
}

module.exports = {
    Controller: Controller
}