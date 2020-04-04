const compController = require('./controllers/compController');
const sessionController = require('./controllers/sessionController');
const matchController = require('./controllers/matchController');
const CompController = compController.CompContoller;
const SessionController = sessionController.SessionController;
const MatchController = matchController.MatchController;

function Controller(db) {
    this.db = db;
    this.controllers = {
        compController: new CompController(this.db),
        sessionController: new SessionController(this.db),
        matchController: new MatchController(this.db)
    }
}

module.exports = {
    Controller: Controller
}