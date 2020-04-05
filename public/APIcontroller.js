const compController = require('./controllers/compController');
const sessionController = require('./controllers/sessionController');
const matchController = require('./controllers/matchController');
const measurementController = require('./controllers/measurementController');
const CompController = compController.CompContoller;
const SessionController = sessionController.SessionController;
const MatchController = matchController.MatchController;
const MeasurementController = measurementController.MeasurementController;

function Controller(db) {
    this.db = db;
    this.controllers = {
        compController: new CompController(this.db),
        sessionController: new SessionController(this.db),
        matchController: new MatchController(this.db),
        measurementController: new MeasurementController(this.db)
    }
}

module.exports = {
    Controller: Controller
}